import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yikjxsvjyierucptmjpa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SnmhmZz32JKN5MT5kQa9Aw_T8H0cXnG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
