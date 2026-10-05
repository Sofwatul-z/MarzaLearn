import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jymvbnqduaodvhkcbdcg.supabase.co';
const supabaseKey = 'sb_publishable_Y604RpXoUJlppG3ff6FPzQ_klOOplRt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Let's just login with a random wrong password. Wait, I can't.
  // I need to use the app's logged-in session. But I don't have it.
  
  // Can we just test if the column `user_id` exists?
  const res = await supabase.from('chapters').select('user_id').limit(1);
  console.log("user_id select:", res.error);

  const res2 = await supabase.from('chapters').select('teacher_id').limit(1);
  console.log("teacher_id select:", res2.error);

  const res3 = await supabase.from('chapters').select('created_by').limit(1);
  console.log("created_by select:", res3.error);
}

check();
