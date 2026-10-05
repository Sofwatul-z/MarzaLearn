-- MarzaLearn Phase 5 — 6-Step mission persistence
-- Run this in the Supabase SQL editor before production use.
-- Safe to re-run: table/columns, constraint, bucket, and policies are guarded.

create extension if not exists pgcrypto;

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  chapter_id integer not null,
  status text not null default 'in_progress',
  current_step integer not null default 1,
  session_data jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.learning_sessions add column if not exists session_data jsonb not null default '{}'::jsonb;
alter table public.learning_sessions add column if not exists updated_at timestamptz not null default now();
alter table public.learning_sessions add column if not exists completed_at timestamptz;
alter table public.learning_sessions add column if not exists current_step integer not null default 1;
alter table public.learning_sessions add column if not exists status text not null default 'in_progress';

-- One required learning mission per student per chapter.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'learning_sessions_student_chapter_key'
      and conrelid = 'public.learning_sessions'::regclass
  ) then
    alter table public.learning_sessions
      add constraint learning_sessions_student_chapter_key unique (student_id, chapter_id);
  end if;
end $$;

alter table public.learning_sessions enable row level security;

drop policy if exists "students_select_own_learning_sessions" on public.learning_sessions;
create policy "students_select_own_learning_sessions"
on public.learning_sessions for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "students_insert_own_learning_sessions" on public.learning_sessions;
create policy "students_insert_own_learning_sessions"
on public.learning_sessions for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "students_update_own_learning_sessions" on public.learning_sessions;
create policy "students_update_own_learning_sessions"
on public.learning_sessions for update
to authenticated
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

-- Read access for teacher accounts. This assumes profiles.id = auth.users.id
-- and profiles.role contains 'teacher', which matches the current MarzaLearn auth code.
drop policy if exists "teachers_select_learning_sessions" on public.learning_sessions;
create policy "teachers_select_learning_sessions"
on public.learning_sessions for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'teacher'
  )
);

-- Private Storage bucket for Step 3 drawings/uploads.
insert into storage.buckets (id, name, public)
values ('visualize-assets', 'visualize-assets', false)
on conflict (id) do update set public = false;

drop policy if exists "students_read_own_visualize_assets" on storage.objects;
create policy "students_read_own_visualize_assets"
on storage.objects for select
to authenticated
using (
  bucket_id = 'visualize-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "students_upload_own_visualize_assets" on storage.objects;
create policy "students_upload_own_visualize_assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'visualize-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "students_update_own_visualize_assets" on storage.objects;
create policy "students_update_own_visualize_assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'visualize-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'visualize-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "teachers_read_visualize_assets" on storage.objects;
create policy "teachers_read_visualize_assets"
on storage.objects for select
to authenticated
using (
  bucket_id = 'visualize-assets'
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'teacher'
  )
);
