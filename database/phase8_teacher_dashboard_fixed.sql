-- MarzaLearn Phase 8 Database Preparation
-- Disesuaikan dengan struktur aktual:
-- profiles.class_name menyimpan XC/XD
-- Tidak menggunakan tabel classes

-- Statistik kelas tidak dibuat sebagai tabel wajib.
-- Dashboard dihitung langsung dari tabel yang sudah ada.

-- Jumlah siswa XC
SELECT COUNT(*) AS total_xc
FROM public.profiles
WHERE role='student'
AND class_name='XC';

-- Jumlah siswa XD
SELECT COUNT(*) AS total_xd
FROM public.profiles
WHERE role='student'
AND class_name='XD';

-- Progress siswa XC
SELECT
p.full_name,
p.class_name,
sp.chapter_id,
sp.percentage
FROM public.profiles p
JOIN public.student_progress sp
ON p.id = sp.student_id
WHERE p.class_name='XC';

-- Progress siswa XD
SELECT
p.full_name,
p.class_name,
sp.chapter_id,
sp.percentage
FROM public.profiles p
JOIN public.student_progress sp
ON p.id = sp.student_id
WHERE p.class_name='XD';
