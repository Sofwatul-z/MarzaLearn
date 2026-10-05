# MarzaLearn — Phase 4

## Chapter Learning Experience & Content Foundation

Phase 4 turns each chapter from a metadata-only destination into a real learning experience before the Marzano session.

### Implemented

- Added structured source-backed content for all five chapters under `src/data/chapters/`.
- The chapter data now includes:
  - Introduction / definition / purpose / text structure
  - Listen & Read title, transcript, and local MP3 path
  - Grammar Corner content and examples
  - All six Marzano activity payloads for the next phase
  - Ultimate Project briefs for later project work
- Added a real `Chapter.jsx` learning page.
- Added 3-part Learn flow:
  1. Introduction
  2. Listen & Read
  3. Grammar Corner
- Added a custom responsive `AudioPlayer` using the five existing MP3 files in `public/audio`.
- Added interactive Grammar Corner tabs and reusable formula / expression presentation.
- Added a restrained chapter-specific visual motif while preserving the global mint / peach / dark-green design system.
- Added a sticky Learn progress control with transitions.
- Added a clear hand-off from Grammar Corner to the 6-Step Mission.
- Updated routing:
  - `/student/chapter/:id` → Learn experience
  - `/student/chapter/:id/session` → 6-Step Mission shell
- Refined the mission shell so Phase 5 has a clean destination without keeping the old generic blue-card prototype.

### Intentionally deferred

The six interactive Marzano activities are not implemented in this phase. Their complete content payloads are already stored in chapter data, but the `Begin with Provide` control remains disabled until Phase 5 builds the real session engine, validation, autosave, and step locking.

### Next phase

**Phase 5 — 6-Step Marzano Session Engine**

Build Provide, Restate, Visualize, Engage, Discuss, Games, sequential locking, autosave/recovery state, and the final mission result screen.
