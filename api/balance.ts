import { getSupabaseClient } from './_lib/supabase';

export default async function handler(req: any, res: any) {
  try {
    // CORS Headers
    // Note: setHeader values must be strings, not booleans
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

    const { pin } = req.query;

    if (!pin) {
      return res.status(400).json({ valid: false, message: 'PIN is required' });
    }

    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits, plan_type')
      .eq('pin_code', pin)
      .single();

    if (error || !data) {
      // PINが見つからない場合は単に無効として返す（500エラーにしない）
      return res.status(200).json({ valid: false, message: 'Invalid PIN' });
    }

    return res.status(200).json({
      valid: true,
      credits: data.credits,
      plan: data.plan_type
    });

  } catch (error: any) {
    console.error('Balance Check Error:', error);
    // 環境変数エラーなどの場合
    const message = error.message || 'Server Error';
    return res.status(500).json({ 
      valid: false, 
      message: 'Server Error', 
      detail: message 
    });
  }
}