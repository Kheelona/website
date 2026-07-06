# Phase 2: UI/UX Discovery Checkpoint
**Status**: Completed
**Completed at**: 2026-07-06
**Approved by user**: Yes

## Summary
Three styled homepage concepts were built in `design-concepts/` (A Storybook, B Playmat, C Sunshine), QA'd in the browser at desktop and mobile widths, and presented with full-page previews. The founder approved a blend: **Concept A as the base, with Concept C's bold elements folded in**.

## Key Decisions
1. **Visual direction = A + C blend.**
   - Base: A "Storybook". Warm alternating washes (`#FFF7EE` / `#EAF6FC`), curved SVG dividers, soft tinted cards (rounded ~22px, no borders), mascot staged in scenes, calm reveals.
   - From C (explicit founder example): the **"Reserve Lumi before the price goes up" finale** as C built it: saturated orange block, big Glory display, white pill CTA, and the **character lineup** (grumpy · wink · Lumi product · silly · joy) along the bottom edge.
   - From C (agent's judgment, founder can veto at any milestone): saturated full-color feelings-card energy is available as an accent language for one or two "bold moments" per page; A's warmth stays dominant.
2. **Mascot as a dimensional character site-wide** (founder directive): every page carries the mascot with 3D-feeling treatment. Implementation: reusable `MascotScene` component (pre-rendered PNG cutouts + pointer-tilt perspective transform + scroll parallax + idle float, drop shadows for grounding). `prefers-reduced-motion` collapses to static. A live R3F mount point stays documented for a future GLB.
3. **Launch video** (founder directive): a Remotion-built teaser using the mascot cutouts, brand shapes/tokens, the one-idea headline and the reserve CTA. Lives in `launch-video/` inside this repo. Output MP4 deliverable; can be embedded on the site later (as plain `<video>`, not WebGL).

## Outputs
- `design-concepts/concept-a.html` (approved base), `concept-b.html`, `concept-c.html` (source of the finale + bold moments)
- `design-concepts/preview-concept-{a,b,c}.png`, `mobile-preview.html`, `README.md` (asset pipeline + trade-off notes)
- `design-concepts/assets/`: mascot cutouts (7 poses), Lumi product cutouts, brand-shape color variants, local fonts

## Downstream Impact
- Phase 8 blueprint maps the A+C blend into the Next.js component plan (Section/wash system, curve dividers, MascotScene, BoldBlock for C-style moments, FinaleCTA with lineup).
- Feelings cards keep A's pastel treatment; C's saturated cards remain an option for the Lumi page's five-feelings-deeper section.
- The Sad feelings card uses the "scared" render as a stand-in; request a true Sad pose from the 3D artist (tracked in state `open_issues`).
- Engineering gotchas carried into the build: use `overflow-x: clip` (never `hidden` on body), never rely on `scroll-snap x mandatory` at desktop, shape SVGs need baked fills when used via `<img>` / `next/image`.

## Context for Resume
Read `design-concepts/README.md` for the concept comparison and asset notes. The approved look = concept-a.html with concept-c.html's `.foot-cta` section (and its bold-block language available as accents).
