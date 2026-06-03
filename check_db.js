import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgiasnlypaawkitflssu.supabase.co';
const supabaseKey = 'sb_publishable_xIclSlUK2zD19I9FzxI1yg_nGFMxIgD';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- PROFILES ---');
    const { data: profiles } = await supabase.from('profiles').select('*');
    profiles.forEach(p => console.log(`[${p.role}] ID: ${p.id} | Name: ${p.name} | Email: ${p.email}`));

    console.log('\n--- COURSES ---');
    const { data: courses } = await supabase.from('courses').select('*');
    courses.forEach(c => console.log(`ID: ${c.id} | Title: ${c.title} | Teacher: ${c.instructor_name}`));
}

check();
