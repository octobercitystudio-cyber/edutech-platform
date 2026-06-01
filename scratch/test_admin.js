import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdmin() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'ahmed@teacher.com',
    password: 'Password123!',
  });

  const userId = authData.user?.id;

  // Try to insert course with instructor_id
  const { error: courseError } = await supabase.from('courses').insert([{
    title: 'Test Course with ID',
    instructor_name: 'Admin',
    price: 100,
    status: 'نشط',
    instructor_id: userId
  }]);
  console.log('Insert course with instructor_id:', courseError ? courseError.message : 'Success');
}

testAdmin();
