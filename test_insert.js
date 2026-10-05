import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jymvbnqduaodvhkcbdcg.supabase.co';
const supabaseKey = 'sb_publishable_Y604RpXoUJlppG3ff6FPzQ_klOOplRt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('chapters').select('*').limit(1);
  console.log('Select error:', error);
  console.log('Select data:', data);

  // Try insert to see error
  const { error: insertError } = await supabase.from('chapters').insert({ title: 'test', description: 'test', semester: 1, order_number: 99 });
  console.log('Insert error:', insertError);
}
test();
