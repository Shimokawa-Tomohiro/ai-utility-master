import OpenAI from 'openai';
import { supabase } from './_lib/supabase';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  const { pin, name, target } = req.query; // target can be 'last', 'first', or 'all' (default)

  if (!pin) {
    return res.status(200).send("Error: PINコードが必要です");
  }
  if (!name) {
    return res.status(200).send("Error: 名前が必要です");
  }

  try {
    // 1. Check PIN and Credits in Supabase
    const { data: userData, error: dbError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('pin_code', pin)
      .single();

    if (dbError || !userData) {
      return res.status(200).send("Error: 無効なPINコード");
    }

    if (userData.credits <= 0) {
      return res.status(200).send("Error: 残高ゼロ");
    }

    // 2. Call OpenAI API for Name Splitting
    // Using gpt-4o-mini as requested
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "入力された氏名をJSON形式 {'last_name': '姓', 'first_name': '名'} で返してください。例外処理や余計な文字は不要です。"
        },
        {
          role: "user",
          content: name
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("AI did not return any content");
    }

    const aiResult = JSON.parse(content);
    const lastName = aiResult.last_name || '';
    const firstName = aiResult.first_name || '';

    // 3. Deduct Credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userData.credits - 1 })
      .eq('id', userData.id);

    if (updateError) {
      console.error("Credit update failed:", updateError);
      return res.status(200).send("Error: 消費処理失敗");
    }

    // 4. Return result based on target
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    if (target === 'last') {
      res.status(200).send(lastName);
    } else if (target === 'first') {
      res.status(200).send(firstName);
    } else {
      res.status(200).send(`${lastName},${firstName}`);
    }

  } catch (error: any) {
    console.error("API Error:", error);
    res.status(200).send(`Error: AI処理失敗 ${error.message}`);
  }
}