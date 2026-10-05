-- MarzaLearn Phase 7 Final Database Setup
-- Disesuaikan dengan struktur backup.sql
-- Tidak menggunakan tabel classes.

-- profiles menggunakan class_name untuk XC/XD

-- Pastikan kolom role dan class_name tersedia
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS class_name text;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS student_id text;

-- Contoh data guru
-- UPDATE public.profiles
-- SET role='teacher', class_name=NULL
-- WHERE email='guru1@marzalearn.com';

-- Contoh data siswa
-- UPDATE public.profiles
-- SET role='student', class_name='XC'
-- WHERE email='siswa01@marzalearn.com';

-- Aktifkan RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Siswa dapat melihat profile sendiri
CREATE POLICY IF NOT EXISTS "student_view_own_profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Guru dapat melihat seluruh profile
CREATE POLICY IF NOT EXISTS "teacher_view_profiles"
ON public.profiles
FOR SELECT
USING (
 EXISTS (
   SELECT 1 FROM public.profiles p
   WHERE p.id = auth.uid()
   AND p.role='teacher'
 )
);
