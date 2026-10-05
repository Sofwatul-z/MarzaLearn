-- MarzaLearn authentication diagnostic
-- Run in Supabase SQL Editor. Never expose passwords or service-role keys.

-- 1. Confirm Auth users exist and whether their email is confirmed.
select
  id,
  email,
  email_confirmed_at,
  last_sign_in_at,
  banned_until,
  deleted_at
from auth.users
order by created_at desc;

-- 2. Every login account must have exactly one matching profile.
select
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.class_name,
  p.student_id
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc;

-- 3. Find profiles with invalid or missing roles.
select id, full_name, role, class_name, student_id
from public.profiles
where role is null
   or role not in ('student', 'teacher');

-- 4. Inspect profile RLS policies. The authenticated user must be allowed
-- to read their own profile after signInWithPassword succeeds.
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles';
