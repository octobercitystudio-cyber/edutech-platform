import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      courses ( price )
    `);
  
  if (error) {
    console.error('Error fetching enrollments:', error);
    return;
  }
  
  let totalRevenue = 0;
  enrollments.forEach(en => {
    if (en.courses && en.courses.price) {
      totalRevenue += parseFloat(en.courses.price);
    }
  });

  console.log('Enrollments:', enrollments.length);
  console.log('Total Revenue:', totalRevenue);
}

test();
