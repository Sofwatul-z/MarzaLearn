-- ==============================================================================
-- MARZALEARN: COMPREHENSIVE SUPABASE DATABASE & STORAGE FIX SCRIPT
-- ==============================================================================
-- This script fixes:
-- 1. `student_progress` table: Ensures columns, UNIQUE constraint, and RLS policies
--    so student progress updates and teacher monitoring calculate live percentages.
-- 2. `chapters` & `chapter_steps` tables: RLS policies allowing teachers to create,
--    edit, and delete chapters without "Failed to save chapter".
-- 3. `project_submissions` table: Dedicated table for Project video submissions,
--    scripts, and teacher grading.
-- 4. `visualize-assets` bucket: Cloud storage bucket and policies for digital canvas
--    and visual drawing uploads.
-- 5. `reset_student_chapter()`: Stored function to easily reset a student's progress
--    by email and chapter number without column mismatch errors.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FIX `student_progress` TABLE & CONSTRAINTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  provide BOOLEAN DEFAULT FALSE,
  restate BOOLEAN DEFAULT FALSE,
  visualize BOOLEAN DEFAULT FALSE,
  engage BOOLEAN DEFAULT FALSE,
  discuss BOOLEAN DEFAULT FALSE,
  play BOOLEAN DEFAULT FALSE,
  percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all required columns exist (if table already existed with missing columns)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='provide') THEN
    ALTER TABLE public.student_progress ADD COLUMN provide BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='restate') THEN
    ALTER TABLE public.student_progress ADD COLUMN restate BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='visualize') THEN
    ALTER TABLE public.student_progress ADD COLUMN visualize BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='engage') THEN
    ALTER TABLE public.student_progress ADD COLUMN engage BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='discuss') THEN
    ALTER TABLE public.student_progress ADD COLUMN discuss BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='play') THEN
    ALTER TABLE public.student_progress ADD COLUMN play BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='student_progress' AND column_name='percentage') THEN
    ALTER TABLE public.student_progress ADD COLUMN percentage INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enforce UNIQUE (student_id, chapter_id) for upsert on conflict
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'student_progress_student_id_chapter_id_key'
       OR conname = 'student_progress_student_chapter_key'
  ) THEN
    -- Remove any duplicates before applying unique constraint if they exist
    DELETE FROM public.student_progress a USING public.student_progress b
    WHERE a.id < b.id AND a.student_id = b.student_id AND a.chapter_id = b.chapter_id;
    
    ALTER TABLE public.student_progress 
    ADD CONSTRAINT student_progress_student_chapter_key UNIQUE (student_id, chapter_id);
  END IF;
END $$;

-- Enable RLS on student_progress
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Policies for student_progress
DROP POLICY IF EXISTS "Students can view own progress" ON public.student_progress;
CREATE POLICY "Students can view own progress"
ON public.student_progress FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

DROP POLICY IF EXISTS "Students can insert own progress" ON public.student_progress;
CREATE POLICY "Students can insert own progress"
ON public.student_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update own progress" ON public.student_progress;
CREATE POLICY "Students can update own progress"
ON public.student_progress FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- ------------------------------------------------------------------------------
-- 2. FIX `chapters` & `chapter_steps` RLS POLICIES (TEACHER CRUD)
-- ------------------------------------------------------------------------------
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;
CREATE POLICY "Anyone can view chapters"
ON public.chapters FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Teachers can insert chapters" ON public.chapters;
CREATE POLICY "Teachers can insert chapters"
ON public.chapters FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

DROP POLICY IF EXISTS "Teachers can update chapters" ON public.chapters;
CREATE POLICY "Teachers can update chapters"
ON public.chapters FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

DROP POLICY IF EXISTS "Teachers can delete chapters" ON public.chapters;
CREATE POLICY "Teachers can delete chapters"
ON public.chapters FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

-- Chapter steps RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chapter_steps') THEN
    ALTER TABLE public.chapter_steps ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can view chapter steps" ON public.chapter_steps;
    CREATE POLICY "Anyone can view chapter steps"
    ON public.chapter_steps FOR SELECT
    TO authenticated, anon
    USING (true);

    DROP POLICY IF EXISTS "Teachers can insert chapter steps" ON public.chapter_steps;
    CREATE POLICY "Teachers can insert chapter steps"
    ON public.chapter_steps FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
    );

    DROP POLICY IF EXISTS "Teachers can update chapter steps" ON public.chapter_steps;
    CREATE POLICY "Teachers can update chapter steps"
    ON public.chapter_steps FOR UPDATE
    TO authenticated
    USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
    );

    DROP POLICY IF EXISTS "Teachers can delete chapter steps" ON public.chapter_steps;
    CREATE POLICY "Teachers can delete chapter steps"
    ON public.chapter_steps FOR DELETE
    TO authenticated
    USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
    );
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. CREATE `project_submissions` TABLE (Project VIDEOS & REVIEWS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  student_name TEXT,
  class_name TEXT,
  attendance_number TEXT,
  script_text TEXT,
  video_url TEXT NOT NULL,
  checklist JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'submitted', -- 'submitted' | 'reviewed'
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT project_submissions_student_chapter_key UNIQUE (student_id, chapter_id)
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students and teachers can view project submissions" ON public.project_submissions;
CREATE POLICY "Students and teachers can view project submissions"
ON public.project_submissions FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id 
  OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

DROP POLICY IF EXISTS "Students can insert own project submissions" ON public.project_submissions;
CREATE POLICY "Students can insert own project submissions"
ON public.project_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update own project submissions" ON public.project_submissions;
CREATE POLICY "Students can update own project submissions"
ON public.project_submissions FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Teachers can grade project submissions" ON public.project_submissions;
CREATE POLICY "Teachers can grade project submissions"
ON public.project_submissions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
);

-- ------------------------------------------------------------------------------
-- 4. CONFIGURE SUPABASE STORAGE: `visualize-assets` BUCKET
-- ------------------------------------------------------------------------------
-- Insert bucket if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('visualize-assets', 'visualize-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for `visualize-assets`
DROP POLICY IF EXISTS "Anyone can view visualize assets" ON storage.objects;
CREATE POLICY "Anyone can view visualize assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'visualize-assets');

DROP POLICY IF EXISTS "Authenticated users can upload visualize assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload visualize assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'visualize-assets');

DROP POLICY IF EXISTS "Users can update own visualize assets" ON storage.objects;
CREATE POLICY "Users can update own visualize assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'visualize-assets' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete own visualize assets" ON storage.objects;
CREATE POLICY "Users can delete own visualize assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'visualize-assets' AND auth.uid() = owner);

-- ------------------------------------------------------------------------------
-- 5. STORED FUNCTION: RESET STUDENT PROGRESS (FOR RETESTING)
-- ------------------------------------------------------------------------------
-- Usage Example:
-- SELECT public.reset_student_chapter('20261001@school.com', 1);
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.reset_student_chapter(text, integer);

CREATE OR REPLACE FUNCTION public.reset_student_chapter(p_identifier TEXT, p_chapter_id INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_id UUID;
  v_db_chapter_id INTEGER;
BEGIN
  -- 1. Try resolving student_id as direct UUID
  IF p_identifier ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_student_id := p_identifier::uuid;
  END IF;

  -- 2. Lookup in auth.users by email (case-insensitive)
  IF v_student_id IS NULL THEN
    SELECT id INTO v_student_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(p_identifier)) 
    LIMIT 1;
  END IF;

  -- 3. Lookup in profiles by student_id or identifier if column exists
  IF v_student_id IS NULL THEN
    BEGIN
      EXECUTE 'SELECT id FROM public.profiles WHERE student_id = $1 LIMIT 1'
      INTO v_student_id
      USING TRIM(p_identifier);
    EXCEPTION WHEN OTHERS THEN
      v_student_id := NULL;
    END;
  END IF;

  IF v_student_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Student identifier ' || p_identifier || ' not found in auth.users or profiles.'
    );
  END IF;

  v_db_chapter_id := 15 + p_chapter_id;

  -- 1. Delete from student_progress
  DELETE FROM public.student_progress
  WHERE student_id = v_student_id
    AND chapter_id IN (p_chapter_id, v_db_chapter_id);

  -- 2. Delete from project_submissions (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_submissions') THEN
    DELETE FROM public.project_submissions
    WHERE student_id = v_student_id
      AND chapter_id IN (p_chapter_id, v_db_chapter_id);
  END IF;

  -- 3. Delete from student_step_progress (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'student_step_progress') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'student_step_progress' AND column_name = 'chapter_id'
    ) THEN
      DELETE FROM public.student_step_progress
      WHERE student_id = v_student_id
        AND chapter_id IN (p_chapter_id, v_db_chapter_id);
    ELSE
      BEGIN
        EXECUTE 'DELETE FROM public.student_step_progress 
                 WHERE student_id = $1 
                   AND step_id IN (SELECT id FROM public.lesson_steps WHERE chapter_id IN ($2, $3))'
        USING v_student_id, p_chapter_id, v_db_chapter_id;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END IF;
  END IF;

  -- 4. Delete from learning_sessions (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_sessions') THEN
    DELETE FROM public.learning_sessions
    WHERE student_id = v_student_id
      AND chapter_id IN (p_chapter_id, v_db_chapter_id);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'student_id', v_student_id,
    'message', 'Successfully reset progress for ' || p_identifier || ' on chapter ' || p_chapter_id
  );
END;
$$;
