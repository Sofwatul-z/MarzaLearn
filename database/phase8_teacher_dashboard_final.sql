-- MarzaLearn Phase 8
-- Menggunakan struktur database aktual

-- Tidak membuat tabel classes.
-- Kelas disimpan pada profiles.class_name.

-- Daftar siswa XC
SELECT id, full_name, student_id
FROM public.profiles
WHERE role='student' AND class_name='XC';

-- Daftar siswa XD
SELECT id, full_name, student_id
FROM public.profiles
WHERE role='student' AND class_name='XD';

-- Progress siswa tertentu
SELECT *
FROM public.student_progress
WHERE student_id = 'GANTI_ID_SISWA';
