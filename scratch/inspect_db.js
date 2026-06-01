import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data: students, error: sErr } = await supabase.from('profiles').select('*').eq('role', 'student');
  const { data: wallets, error: wErr } = await supabase.from('wallet').select('*');
  
  console.log('Students:', students?.length, sErr);
  console.log('Wallets:', wallets, wErr);
}

inspect();
