# PHASE 8.2 - Teacher Dashboard Supabase Integration

## Implemented
- Teacher service connected to Supabase.
- Student list fetched from public.profiles.
- Class filtering uses profiles.class_name (XC/XD).
- Student progress fetched from public.student_progress.

## Database relation
profiles.id (UUID)
        |
        |
student_progress.student_id (UUID)

## Testing account
Teacher:
- Teacher MarzaLearn

Student:
- Tiara Intan
- 20261001
- XC

## Expected behavior
Teacher opens Student Management:
- Select XC -> Tiara Intan appears.
- Select XD -> appears when XD students exist.

## Note
student_progress empty is not an error. It means the student has not started learning.