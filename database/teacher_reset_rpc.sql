-- ==============================================================================
-- TRANSACTIONAL RPC: teacher_reset_student_chapter
-- Single source of truth for resetting student chapter progress in Supabase.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.teacher_reset_student_chapter(
  target_student_id TEXT,
  target_chapter_id INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_id UUID;
  v_db_chapter_id INTEGER;
BEGIN
  -- 1. Resolve UUID
  IF target_student_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_student_id := target_student_id::uuid;
  END IF;

  -- 2. Lookup by email if not UUID
  IF v_student_id IS NULL THEN
    SELECT id INTO v_student_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(target_student_id)) 
    LIMIT 1;
  END IF;

  -- 3. Lookup in profiles
  IF v_student_id IS NULL THEN
    BEGIN
      SELECT id INTO v_student_id FROM public.profiles WHERE student_id = TRIM(target_student_id) LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      v_student_id := NULL;
    END;
  END IF;

  IF v_student_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Student ' || target_student_id || ' not found.'
    );
  END IF;

  v_db_chapter_id := 15 + target_chapter_id;

  -- Atomic transactional deletions across all progress tables
  -- 1. student_progress
  DELETE FROM public.student_progress
  WHERE student_id = v_student_id
    AND chapter_id IN (target_chapter_id, v_db_chapter_id);

  -- 2. learning_sessions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'learning_sessions') THEN
    DELETE FROM public.learning_sessions
    WHERE student_id = v_student_id
      AND chapter_id IN (target_chapter_id, v_db_chapter_id);
  END IF;

  -- 3. project_submissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_submissions') THEN
    DELETE FROM public.project_submissions
    WHERE student_id = v_student_id
      AND chapter_id IN (target_chapter_id, v_db_chapter_id);
  END IF;

  -- 4. student_step_progress (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_step_progress') THEN
    DELETE FROM public.student_step_progress
    WHERE student_id = v_student_id
      AND (chapter_id IN (target_chapter_id, v_db_chapter_id) OR step_id IN (SELECT id FROM public.lesson_steps WHERE chapter_id IN (target_chapter_id, v_db_chapter_id)));
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'student_id', v_student_id,
    'chapter_id', target_chapter_id,
    'message', 'Reset completed atomically'
  );
END;
$$;

-- Overload with (UUID, INTEGER) for convenience
CREATE OR REPLACE FUNCTION public.teacher_reset_student_chapter(
  target_student_id UUID,
  target_chapter_id INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.teacher_reset_student_chapter(target_student_id::TEXT, target_chapter_id);
END;
$$;

-- Overload with (student_id, chapter_id)
CREATE OR REPLACE FUNCTION public.teacher_reset_student_chapter(
  student_id TEXT,
  chapter_id INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.teacher_reset_student_chapter(student_id, chapter_id);
END;
$$;
