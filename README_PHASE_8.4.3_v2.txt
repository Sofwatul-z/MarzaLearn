MarzaLearn Phase 8.4.3 v2 Fix

Purpose:
- Patch only the chapter ID flow.
- Preserve previous dashboard design.
- Fix chapter detail loading.

Changes:
1. chapter.js:
   - Normalize route parameter ID using Number().
   - Load chapter_steps using numeric database chapter_id.
   - Map Supabase chapter IDs correctly.

2. Dashboard.jsx:
   - Keep existing design.
   - Chapter Management remains a clickable motion button.

Replace:
src/services/chapter.js
src/pages/teacher/Dashboard.jsx

Restart:
npm run dev
