-- MarzaLearn Phase 8.5 - student progress persistence and RLS
-- Run this in Supabase SQL Editor before using teacher monitoring.

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  chapter_id integer not null,
  current_step integer not null default 0,
  percentage integer not null default 0,
  status text not null default 'not_started',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint student_progress_student_chapter_key unique (student_id, chapter_id),
  constraint student_progress_percentage_check check (percentage between 0 and 100),
  constraint student_progress_step_check check (current_step between 0 and 6)
);

alter table public.student_progress add column if not exists current_step integer not null default 0;
alter table public.student_progress add column if not exists percentage integer not null default 0;
alter table public.student_progress add column if not exists status text not null default 'not_started';
alter table public.student_progress add column if not exists updated_at timestamptz not null default now();

alter table public.student_progress enable row level security;

drop policy if exists "students_select_own_progress" on public.student_progress;
create policy "students_select_own_progress"
on public.student_progress for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "students_insert_own_progress" on public.student_progress;
create policy "students_insert_own_progress"
on public.student_progress for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "students_update_own_progress" on public.student_progress;
create policy "students_update_own_progress"
on public.student_progress for update
to authenticated
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

-- Current schema has no teacher-to-class relation. Until one is added,
-- teacher accounts can read progress rows but cannot modify them.
drop policy if exists "teachers_select_student_progress" on public.student_progress;
create policy "teachers_select_student_progress"
on public.student_progress for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'teacher'
  )
);

create index if not exists student_progress_student_id_idx
  on public.student_progress(student_id);
create index if not exists student_progress_chapter_id_idx
  on public.student_progress(chapter_id);

-- Validation queries
select student_id, chapter_id, current_step, percentage, status, updated_at
from public.student_progress
order by student_id, chapter_id;
