import Stripe from 'stripe';
import { Resend } from 'resend';
import { getSupabaseClient } from './_lib/supabase';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any, // 安定版のAPIバージョンを指定
  typescript: true,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const MY_DOMAIN = "ai-utility-master.vercel.app";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function generatePin() {
  const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `AI-${randomPart}`;
}

async function sendPinEmail(toEmail: string, pinCode: string, credits: number, planName: string) {
  // 姓名分割用URL
  const nameFormula = `=IMPORTDATA("https://${MY_DOMAIN}/api/sheet?name=" & ENCODEURL(A1) & "&pin=${pinCode}")`;
  // 住所分割用URL
  const addressFormula = `=IMPORTDATA("https://${MY_DOMAIN}/api/sheet?address=" & ENCODEURL(A1) & "&pin=${pinCode}")`;
  
  console.log(`[Email] Attempting to send to: ${toEmail}`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'AI Utility Master <onboarding@resend.dev>', // 本番時は自身の認証済みドメインに変更推奨
      to: toEmail,
      subject: '【姓名分割AI】PINコード発行のお知らせ',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">ご購入ありがとうございます</h2>
            <p>以下のPINコードですぐにAI機能をご利用いただけます。</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; color: #64748b; font-size: 0.9rem;">あなたのPINコード</p>
                <p style="margin: 10px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0f172a;">${pinCode}</p>
                <p style="margin: 0; font-size: 0.9rem;">プラン: ${planName} (${credits.toLocaleString()}回分)</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            
            <h3>使い方（スプレッドシート）</h3>
            <p>目的に合わせて、以下の数式をコピーしてセルに貼り付けてください。</p>
            
            <h4 style="margin-bottom:5px;">1. 姓名分割（名前 → 姓・名）</h4>
            <code style="display: block; background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto; margin-bottom: 20px;">
                ${nameFormula}
            </code>

            <h4 style="margin-bottom:5px;">2. 住所分割（住所 → 都道府県・市区町村・番地・建物）</h4>
            <code style="display: block; background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto;">
                ${addressFormula}
            </code>
            
            <br>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            
            <p style="font-size: 0.85rem; color: #64748b;">
                【お問い合わせ】<br>
                ご不明な点や不具合がございましたら、下記までご連絡ください。<br>
                <a href="mailto:shimotomo16@gmail.com" style="color: #3b82f6; text-decoration: none;">shimotomo16@gmail.com</a>
            </p>
        </div>
      `
    });

    if (error) {
      console.error(`[Email Error] Resend API returned error:`, JSON.stringify(error, null, 2));
      throw new Error(`Resend API Error: ${error.message}`);
    }

    console.log(`[Email Success] Sent to ${toEmail}. ID: ${data?.id}`);
  } catch (err: any) {
    console.error(`[Email Critical Error] Failed to send email:`, err);
    throw err; // エラーを上位に投げてリトライ制御させる
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    if (!endpointSecret) throw new Error("Missing Webhook Secret");
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const amountTotal = session.amount_total;
    
    // Stripe Event ID for Idempotency logic (if implemented)
    const eventId = event.id;

    console.log(`[Webhook] Processing checkout. Email: ${customerEmail}, Amount: ${amountTotal}`);

    if (customerEmail && amountTotal) {
      let addedCredits = 100;
      let planName = "Unknown";

      if (amountTotal === 500) {
        addedCredits = 500;
        planName = "ライト";
      } else if (amountTotal === 2000) {
        addedCredits = 3000;
        planName = "スタンダード";
      } else if (amountTotal === 5000) {
        addedCredits = 10000;
        planName = "ビジネス";
      }

      const maxRetries = 5;
      for (let i = 0; i < maxRetries; i++) {
        const newPin = generatePin();

        try {
          const supabase = getSupabaseClient();
          if (!supabase) throw new Error("Supabase client init failed");

          const { error: dbError } = await supabase.from('user_credits').insert({
            pin_code: newPin,
            credits: addedCredits,
            email: customerEmail,
            plan_type: planName
          });

          if (dbError) {
            console.error("[DB Error] Insert failed (likely duplicate PIN):", dbError);
            if (i === maxRetries - 1) throw dbError;
            continue; // Retry with new PIN
          }
          
          console.log(`[DB Success] PIN ${newPin} created. Sending email...`);

          // メール送信試行
          try {
            await sendPinEmail(customerEmail, newPin, addedCredits, planName);
          } catch (emailErr) {
            console.error("[Fatal] PIN created but email failed.", emailErr);
          }

          break; // Success loop exit

        } catch (e) {
          console.error("Critical error in PIN generation loop:", e);
          if (i === maxRetries - 1) {
            return res.status(500).json({ status: "error", message: "Failed to generate PIN" });
          }
        }
      }
    } else {
        console.warn("[Webhook] Missing email or amount in session data.");
    }
  }

  res.status(200).json({ status: "success" });
}