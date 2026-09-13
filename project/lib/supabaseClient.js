import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Make sure MY_SUPABASE_URL and MY_SUPABASE_ANON_KEY secrets are configured.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
