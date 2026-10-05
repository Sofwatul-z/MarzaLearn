-- MarzaLearn Phase 8.4.1 Chapter Validation Query

-- Check chapters table
SELECT * FROM public.chapters
ORDER BY id;

-- Check chapter steps relation
SELECT
    cs.id,
    cs.chapter_id,
    cs.step_number,
    cs.step_name
FROM public.chapter_steps cs
ORDER BY cs.chapter_id, cs.step_number;

-- Check student progress relation
SELECT *
FROM public.student_progress;

-- Check student step progress relation
SELECT *
FROM public.student_step_progress;
