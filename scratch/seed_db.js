import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const teachers = [
    { email: 'ahmed@teacher.com', name: 'أ. أحمد السيد', course: 'الرياضيات المتقدمة - الصف الثالث الثانوي', price: 250, desc: 'كورس شامل في منهج الرياضيات بأسلوب حديث ومبسط.' },
    { email: 'mahmoud@teacher.com', name: 'أ. محمود رضا', course: 'الفيزياء الحديثة وقوانين نيوتن', price: 300, desc: 'شرح مفصل لمنهج الفيزياء مع تجارب عملية ونماذج امتحانات.' },
    { email: 'sara@teacher.com', name: 'أ. سارة كامل', course: 'الكيمياء العضوية والتفاعلات', price: 200, desc: 'دورة تفاعلية لشرح الكيمياء العضوية من الصفر حتى الاحتراف.' }
  ];

  console.log('Inserting courses...');

  for (const t of teachers) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: t.email,
      password: 'Password123!',
    });

    if (authError) {
      console.error(`Login failed for ${t.email}:`, authError.message);
      continue;
    }

    const { error: courseError } = await supabase.from('courses').insert([{
      title: t.course,
      instructor_name: t.name,
      price: t.price,
      description: t.desc,
      status: 'نشط'
    }]);

    if (courseError) {
      console.error(`Error creating course for ${t.name}:`, courseError.message);
    } else {
      console.log(`Course '${t.course}' created successfully for ${t.name}`);
    }
  }

  console.log('Seed process completed!');
}

seed();
