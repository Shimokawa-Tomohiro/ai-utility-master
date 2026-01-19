import { supabase } from './_lib/supabase';

export default async function handler(req: any, res: any) {
  const { pin } = req.query;

  if (!pin) {
    return res.status(400).json({ valid: false, message: 'PIN is required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits, plan_type')
      .eq('pin_code', pin)
      .single();

    if (error || !data) {
      return res.json({ valid: false, message: 'Invalid PIN' });
    }

    return res.json({
      valid: true,
      credits: data.credits,
      plan: data.plan_type
    });

  } catch (error) {
    console.error('Balance Check Error:', error);
    return res.status(500).json({ valid: false, message: 'Server Error' });
  }
}