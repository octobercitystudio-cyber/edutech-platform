import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  const { data: wallets, error: wErr } = await supabase.from('wallet').select('*');
  
  console.log('Profiles:', profiles);
  console.log('Wallets:', wallets);
}

inspect();
