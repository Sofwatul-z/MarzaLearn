import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  // Let's just select one row from chapters and chapter_steps to see the columns
  const { data: chapters } = await supabase.from('chapters').select('*').limit(1);
  console.log('chapters table:', chapters);

  const { data: steps } = await supabase.from('chapter_steps').select('*').limit(1);
  console.log('chapter_steps table:', steps);
}

checkSchema();
