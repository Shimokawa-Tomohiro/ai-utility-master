import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとキーを取得
// バックエンド処理（Webhook等）では権限の強い SERVICE_KEY を使用することを想定
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Backend functions may fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);