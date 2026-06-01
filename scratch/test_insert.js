import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const fakeUUID = '123e4567-e89b-12d3-a456-426614174000';
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      id: fakeUUID,
      name: 'Test Admin Insert',
      email: 'testadmininsert@example.com',
      role: 'student'
    }]);
    
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded:', data);
  }
}

testInsert();
