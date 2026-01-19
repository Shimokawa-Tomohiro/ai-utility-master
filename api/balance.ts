import { getSupabaseClient } from './_lib/supabase';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { pin } = req.query;

    if (!pin) {
      return res.status(200).json({ valid: false, message: 'PINコードを入力してください' });
    }

    const supabase = getSupabaseClient();
    
    // Supabaseクライアントの初期化失敗チェック
    if (!supabase) {
      return res.status(200).json({ 
        valid: false, 
        message: 'システムエラー: データベース接続設定が不足しています (Environment Variables Missing)' 
      });
    }
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits, plan_type')
      .eq('pin_code', pin)
      .single();

    if (error || !data) {
      return res.status(200).json({ valid: false, message: '無効なPINコードです' });
    }

    return res.status(200).json({
      valid: true,
      credits: data.credits,
      plan: data.plan_type
    });

  } catch (error: any) {
    console.error('Balance Check Error:', error);
    return res.status(200).json({ 
      valid: false, 
      message: `サーバーエラー: ${error.message || 'Unknown Error'}` 
    });
  }
}