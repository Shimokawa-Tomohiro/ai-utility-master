import Stripe from 'stripe';
import { Resend } from 'resend';
import { supabase } from '../lib/supabase';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});
const resend = new Resend(process.env.RESEND_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const MY_DOMAIN = "name-spliter.vercel.app";

// Raw body parser helper for Stripe signature verification
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
  // Generate random hex string (12 chars) and prefix with AI-
  const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `AI-${randomPart}`;
}

async function sendPinEmail(toEmail: string, pinCode: string, credits: number, planName: string) {
  const sheetFormula = `=IMPORTDATA("https://${MY_DOMAIN}/api/sheet?name=" & ENCODEURL(A1) & "&pin=${pinCode}")`;
  
  try {
    await resend.emails.send({
      from: 'AI Utility Master <onboarding@resend.dev>', // Update this to your verified domain in production
      to: toEmail,
      subject: '【姓名分割AI】PINコード発行のお知らせ',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">ご購入ありがとうございます</h2>
            <p>以下のPINコードですぐに姓名分割関数をご利用いただけます。</p>
            
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; color: #64748b; font-size: 0.9rem;">あなたのPINコード</p>
                <p style="margin: 10px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #0f172a;">${pinCode}</p>
                <p style="margin: 0; font-size: 0.9rem;">プラン: ${planName} (${credits.toLocaleString()}回分)</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            
            <h3>使い方（スプレッドシート）</h3>
            <p>以下の数式をコピーしてセルに貼り付けてください。</p>
            <code style="display: block; background: #1e293b; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto;">
                ${sheetFormula}
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
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Email Error:`, error);
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
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const amountTotal = session.amount_total;

    if (customerEmail && amountTotal) {
      let addedCredits = 100;
      let planName = "Unknown";

      // Simple logic mapping amount to plan
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

      // Retry logic for PIN generation collision
      const maxRetries = 5;
      for (let i = 0; i < maxRetries; i++) {
        const newPin = generatePin();

        try {
          const { error } = await supabase.from('user_credits').insert({
            pin_code: newPin,
            credits: addedCredits,
            email: customerEmail,
            plan_type: planName
          });

          if (error) {
            // Check for uniqueness violation if Supabase returns specific error code for unique constraint
            // For now, assuming any error might be collision or connection issue, but let's log it
            console.error("DB Insert Error:", error);
            if (i === maxRetries - 1) throw error; // Re-throw on last attempt
            continue;
          }

          // Success - Send Email
          await sendPinEmail(customerEmail, newPin, addedCredits, planName);
          break; // Exit retry loop

        } catch (e) {
          console.error("Critical error in PIN generation loop:", e);
          if (i === maxRetries - 1) {
            return res.status(500).json({ status: "error", message: "Failed to generate PIN" });
          }
        }
      }
    }
  }

  res.status(200).json({ status: "success" });
}