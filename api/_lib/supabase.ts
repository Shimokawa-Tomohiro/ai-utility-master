import { createClient } from '@supabase/supabase-js';

// シングルトンインスタンスを保持
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

  // 環境変数がない場合はエラーを投げずにnullを返す（呼び出し元でハンドリングする）
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_KEY) are missing.');
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};