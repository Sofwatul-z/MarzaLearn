# MarzaLearn — Phase 2: Global Design System & Layout Foundation

## Design direction
- Bright, clean base with warm off-white background.
- Restrained pastel palette: mint as primary pastel, peach as secondary accent.
- Deep green-charcoal is used only for contrast, headings, and primary actions.
- Plus Jakarta Sans is the global typeface.
- Motion is subtle and respects `prefers-reduced-motion`.

## Added/updated foundation
- Global color, typography, surface, input, focus, scrollbar, selection, and shell tokens in `src/index.css`.
- Reusable `Button` with primary, secondary, pastel, ghost, and danger variants.
- Reusable `Logo` component.
- Refined `Navbar` using the new design system.
- Implemented `GradientBlob`, `FloatingShape`, and `GlassPanel` primitives.
- Rebuilt `AuthLayout`, `StudentLayout`, and `TeacherLayout` around the same shell system.
- Refined `Loader` and login page to use the shared foundation.
- Normalized the current landing-page palette to the new system without redesigning the full landing layout yet.

## Intentionally deferred
- Student Dashboard redesign.
- Chapter learning-path redesign.
- Learn section and 6-step learning engine.
- Teacher Dashboard redesign.
- Full Landing page redesign.

Those will be handled in subsequent phases so visual and functional changes remain testable in smaller increments.
