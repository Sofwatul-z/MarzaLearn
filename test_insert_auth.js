import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jymvbnqduaodvhkcbdcg.supabase.co';
const supabaseKey = 'sb_publishable_Y604RpXoUJlppG3ff6FPzQ_klOOplRt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Try to sign in as teacher. I'll just use a common test email or sign up.
  // Wait, I can just sign up a new user!
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_teacher_123@example.com',
    password: 'password123'
  });
  
  if (authError) {
    console.log("Signup error:", authError);
    // Maybe try login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test_teacher_123@example.com',
      password: 'password123'
    });
    console.log("Login error:", loginError);
  }

  console.log("Auth session:", await supabase.auth.getSession());

  // Try insert
  const { data, error } = await supabase
    .from('chapters')
    .insert({
      title: 'Test Chapter',
      description: 'Test Desc',
      semester: 1,
      order_number: 99
    })
    .select();

  console.log('Insert Result:', data);
  console.log('Insert Error:', error);
}

check();
