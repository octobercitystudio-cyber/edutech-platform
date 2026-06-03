import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgiasnlypaawkitflssu.supabase.co';
const supabaseKey = 'sb_publishable_xIclSlUK2zD19I9FzxI1yg_nGFMxIgD';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteFakes() {
    console.log('Deleting fake courses...');
    const fakeCourseIds = [
        'ba2c8232-0717-464f-9ca4-0e7511223b00',
        '4fd22259-e473-45be-8584-24e6805f5d6f',
        '5165d69f-5bf1-478a-8c60-644ab131f0f6'
    ];
    
    for (const id of fakeCourseIds) {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) console.error('Error deleting course:', error.message);
    }

    console.log('Deleting fake profiles...');
    const fakeEmails = [
        't1@example.com', 't2@example.com', 't3@example.com',
        't1_assistant@example.com', 't2_assistant@example.com', 't3_assistant@example.com'
    ];
    
    for (const email of fakeEmails) {
        const { error } = await supabase.from('profiles').delete().eq('email', email);
        if (error) console.error('Error deleting profile:', error.message);
    }
    
    console.log('Done!');
}

deleteFakes();
