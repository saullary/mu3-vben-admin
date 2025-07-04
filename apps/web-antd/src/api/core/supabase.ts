import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env;

export const supabase: SupabaseClient = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_KEY,
);

export default supabase;
