-- MarzaLearn Phase 8.4.4 - chapter ID and access validation
-- Run in Supabase SQL Editor with an authenticated test session.

-- Chapter metadata must use database IDs 16-20 and order 1-5.
select id, order_number, semester, title
from public.chapters
where id between 16 and 20
order by order_number;

-- Every chapter must expose six ordered steps.
select c.id as chapter_id, count(cs.id) as step_count,
       min(cs.step_number) as first_step, max(cs.step_number) as last_step
from public.chapters c
left join public.chapter_steps cs on cs.chapter_id = c.id
where c.id between 16 and 20
group by c.id
order by c.id;

-- Check duplicate or orphaned step relations.
select cs.chapter_id, cs.step_number, count(*) as duplicate_count
from public.chapter_steps cs
group by cs.chapter_id, cs.step_number
having count(*) > 1;

select cs.*
from public.chapter_steps cs
left join public.chapters c on c.id = cs.chapter_id
where c.id is null;

-- Confirm the current user/profile role and class.
select id, full_name, role, class_name, student_id
from public.profiles
where id = auth.uid();

-- Verify student progress rows are only owned by the student and teacher
-- monitoring queries only return students in the selected class.
select sp.student_id, sp.chapter_id, sp.current_step, sp.percentage, sp.status
from public.student_progress sp
where sp.student_id = auth.uid()
   or exists (
     select 1 from public.profiles teacher
     where teacher.id = auth.uid() and teacher.role = 'teacher'
   );
