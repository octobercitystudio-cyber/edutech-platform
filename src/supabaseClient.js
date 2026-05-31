import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sgiasnlypaawkitflssu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xIclSlUK2zD19I9FzxI1yg_nGFMxIgD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
