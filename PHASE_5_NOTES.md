# MarzaLearn — Phase 5

## 6-Step Marzano Session Engine

Implemented in this phase:

### Session architecture
- Replaced the Phase 4 mission roadmap placeholder with a functional six-step session engine.
- Added strict sequential unlocking: Provide → Restate → Visualize → Engage → Discuss → Games.
- Students may revisit already unlocked steps, but cannot skip ahead.
- Added a simplified Focus Session header so normal Home / Chapters navigation is removed while the mission is active.
- Added responsive Step Progress for desktop and mobile.
- Added per-step completion rules so the Next Step button cannot be used before the required work is done.
- Added a final Mission Complete screen with objective scores and teacher-review status.

### Step 1 — Provide
- One-word-at-a-time vocabulary explorer rather than a grid of vocabulary cards.
- Browser pronunciation button via Speech Synthesis.
- Tracks which target words have been explored.
- Requires all six words before Step 2 unlocks.

### Step 2 — Restate
- Worksheet-style responses for every target word.
- Stores each response in the session state.
- Requires every prompt to contain an answer before Step 3 unlocks.

### Step 3 — Visualize
- Fully implemented HTML canvas drawing board.
- Pen and eraser tools.
- Undo / redo / clear.
- Pointer-event support for mouse, pen and touch.
- Students may switch between drawing directly and uploading an image.
- Large uploaded images are resized before saving.
- Three required visual prompts per chapter.
- Images upload to private Supabase Storage bucket `visualize-assets` when configured.
- Local recovery fallback is kept if Storage has not yet been configured.

### Step 4 — Engage
- Interactive tap-to-match activity, usable on desktop and mobile.
- Definitions are deterministically shuffled.
- Wrong attempts do not make the activity impossible to finish.
- A first-try score is tracked for grading while students can still correct mistakes and complete all pairs.
- All pairs must be connected before Step 5 unlocks.

### Step 5 — Discuss
- Dedicated response workspace with the supplied discussion prompt and example.
- Live word and sentence estimate.
- Requires a complete response before Step 6 unlocks.

### Step 6 — Games
- One-question-at-a-time multiple-choice game.
- Choice order is shuffled.
- The first answer is locked.
- Correct-answer micro-confetti animation uses only the restrained MarzaLearn mint / peach palette.
- Objective score is stored automatically.

### Autosave and recovery
- Added `useMarzanoSession` as the session state engine.
- Immediate browser/localStorage recovery for accidental refreshes or temporary connection issues.
- Debounced Supabase autosave for normal answer changes.
- Mission completion is persisted immediately instead of waiting for the normal debounce.
- Dashboard mission progress can fall back to recovered local sessions if the optional Supabase table is not available yet.
- Visual preview data is deliberately stripped from the database JSON; only Storage paths are sent to Supabase to avoid bloating PostgreSQL rows.

### Database / Storage setup
Run:

`supabase/PHASE_5_SESSION_SETUP.sql`

in the Supabase SQL editor before production use. It creates/extends:
- `learning_sessions`
- unique student/chapter mission constraint
- student RLS policies
- preliminary teacher read policy
- private `visualize-assets` Storage bucket
- student visual upload/read policies
- preliminary teacher visual read policy

The application still has a local recovery fallback so UI development can continue before this SQL is applied.

### Validation performed
- TypeScript parser syntax check across every JS / JSX source file: passed.
- Relative local import scan across `src`: 0 missing imports.
- Structured chapter-data check: all 5 chapters contain 6 Provide words, 6 Restate prompts, 3 Visualize prompts, 6 Engage pairs, a Discuss prompt, and 3 Game questions.
- A full Vite production build could not be completed in the working environment because `npm ci` timed out while downloading dependencies. The partial `node_modules` folder is removed before packaging.

## Next planned phase

Phase 6 — Ultimate Project Submission + Teacher Review foundation:

1. Build project brief and submission flow separately from the one-session mission.
2. Store project type and URL in `project_submissions`.
3. Build real Teacher Dashboard data views for XC / XD and Chapters 1–5.
4. Open a student submission detail view.
5. Show Restate, Visualize, Engage score, Discuss, Game score, and project link.
6. Add teacher score + textual feedback persistence.
7. Add corresponding teacher Storage access / review policies if needed.
