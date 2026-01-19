import OpenAI from 'openai';
import { getSupabaseClient } from './_lib/supabase';

// Initialize OpenAI safely
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

export default async function handler(req: any, res: any) {
  const { pin, name, address, target } = req.query;

  // Set encoding
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (!pin) return res.status(200).send("Error: PINコードが必要です");
  if (!name && !address) return res.status(200).send("Error: 名前(name)または住所(address)が必要です");

  try {
    const supabase = getSupabaseClient();
    if (!supabase) return res.status(200).send("Error: システム設定エラー(DB)");

    const openai = getOpenAI();
    if (!openai) return res.status(200).send("Error: システム設定エラー(AI)");

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

    let resultText = "";

    // 2. Call OpenAI API based on input type
    if (address) {
      // --- Address Splitting Logic ---
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              入力された日本の住所を以下の4つに分割し、JSON形式で返してください。
              
              キー:
              - prefecture: 都道府県 (例: 東京都)
              - city: 市区町村 (郡を含む) (例: 港区, 〇〇郡〇〇町)
              - town_number: 町域・番地 (例: 麻布台1丁目3-1)
              - building: 建物名・号室 (例: 麻布台ヒルズ森JPタワー 24F)

              ルール:
              - 建物名がない場合は空文字にしてください。
              - JSONのみを返してください。
            `
          },
          {
            role: "user",
            content: address
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("AI did not return any content");

      const aiResult = JSON.parse(content);
      // CSV format: pref,city,town,building
      // Ensure no commas exist in the values to avoid breaking CSV structure
      const clean = (str: string) => (str || '').replace(/,/g, '、');
      
      resultText = `${clean(aiResult.prefecture)},${clean(aiResult.city)},${clean(aiResult.town_number)},${clean(aiResult.building)}`;

    } else {
      // --- Name Splitting Logic ---
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
      if (!content) throw new Error("AI did not return any content");

      const aiResult = JSON.parse(content);
      const lastName = aiResult.last_name || '';
      const firstName = aiResult.first_name || '';

      if (target === 'last') {
        resultText = lastName;
      } else if (target === 'first') {
        resultText = firstName;
      } else {
        resultText = `${lastName},${firstName}`;
      }
    }

    // 3. Deduct Credit
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userData.credits - 1 })
      .eq('id', userData.id);

    if (updateError) {
      console.error("Credit update failed:", updateError);
      return res.status(200).send("Error: 消費処理失敗");
    }

    // 4. Return result
    res.status(200).send(resultText);

  } catch (error: any) {
    console.error("API Error:", error);
    res.status(200).send(`Error: AI処理失敗 ${error.message}`);
  }
}