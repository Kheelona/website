# Phase 0: Kick-Off Checkpoint (also covers pre-filled Phases 1, 3, 4 and the Phase 7 tool decision)
**Status**: Completed
**Completed at**: 2026-07-06
**Approved by user**: Yes (plan-mode approval + 4-question founder Q&A)

## Summary
Project bootstrapped. Build prompt and the full homepage PDF read end to end. Founder Q&A locked the four open decisions. Documentation scaffold created. Next: the 3-concept design round (Phase 2 gate), then blueprint, then sprint build.

## Key Decisions (founder Q&A, 2026-07-06)
1. **Design tokens**: from `Design/design-system/` — founder populated the folder mid-session. Do not invent tokens.
2. **3D mascot**: pre-rendered PNGs + parallax at launch. No GLB model exists. Architecture reserves a swap-in slot for a live R3F mascot later. No live WebGL at launch.
3. **Pre-order tool**: **Tally**. Fields locked: parent name, email, WhatsApp number, WhatsApp consent (checkbox), child's birth month, city. Founder to provide the form URL before Sprint S9 (blocker `tally-form-url`).
4. **Concept round**: 3 full-scroll styled homepage concepts (self-contained HTML in `design-concepts/`), founder approves one, then full build including copywriting for the other 8 pages.

## Design system extract (source: `Design/design-system/colors_and_type.css` + its README)
- **Palette**: Kheelona Orange `#EF762F` (primary accent, hover `#D85F1B`), Sunshine Yellow `#F1A23B`, Sky Blue `#29A0D7` (+soft `#3AA4E5`), Mint Teal `#1ABC9C`, Magic Purple `#8B5BFF`, alert red `#FF2A2A` (character mouths only). Usage ratio 30% yellow / 30% white / 20% blue / 10% orange / 5% teal / 5% purple. Surfaces: white, warm `#FFF7EE`, cool `#EAF6FC`. Neutrals: ink `#000`/`#272727`/`#363636`/`#727272`, line `#CFCFCF`.
- **Type**: Glory (display, local variable TTF), Instrument Sans (text, local variable TTF), Instrument Serif Italic (eyebrow/section labels, Google Fonts). Headings tight (-1% to -3% tracking, 120% lh), body 130% lh.
- **Shape language**: 5 primitives (flower-3/5/13, polygon, squircle, triangle-5 SVGs in `assets/shapes/`) used as 15%-alpha decorative clusters bleeding off one corner. Faces (eyes+mouth) can be composited on shapes.
- **Radius**: cards 10px, hairline border `#CFCFCF` (cards get border, NOT shadow), pill buttons, one shadow recipe `0 4px 4px rgba(0,0,0,0.25)` for sticker/CTA only.
- **Motion**: bouncy `cubic-bezier(0.34,1.56,0.64,1)`, 160–320ms. Press scale 0.96. No glassmorphism, no frosted nav.

## Resolved conflicts (per build prompt §0 precedence)
- Design-system README prefers em-dashes and says ages "3–12" → **Brand Bible wins**: zero em-dashes anywhere (voice-lint), Lumi copy says ages 3 to 6.
- PDF renders price as "Rs. 4,999" → prompt §1.10 standardizes **₹** site-wide. Flagged; one-line revert if founder prefers Rs.
- Spec paths say `/design/*` → actual folder is `Design/` (capital D).

## Asset inventory (verified 2026-07-06)
- `kheelona homepage website content.pdf`: 7 pages. All 11 Home sections + 16-keyword map. Read in full. Blue boxes = verbatim copy.
- `Design/mascot-3d-images/`: ~20 PNG renders of the fox-deer mascot (Main_Refrence 1–4, Blessful and Joyful 1–4, Laughing 1–5, Dancing, Sitting_with_wide_legs, angry/furious 1–4, angry with fire, scared). White backgrounds, high-res.
- `Design/product-images/`: Lumi Blue (front/back/left/right PNGs), Lumi pastel green (3 PNGs), Kheelona photoshoot 2025 (~60 JPGs). **Lumi Pink is empty.**
- `Design/design-system/`: complete (tokens CSS, fonts, brand README, logo PNGs, shape SVGs, UI-kit reference, brand guidelines HTML).

## Pre-filled phase confirmations
- **Phase 1 (BA)**: purpose = pre-order list at launch price; audience = parents of 3–6 year olds, India-first, screen-wary; 9 pages per §2; conversion = Tally form; pre-shipping, globally-ready. Confirmed by founder via plan approval.
- **Phase 3 (Marketing/SEO)**: 16-keyword map locked (prompt §3.1 = PDF final page). Per-page meta to be drafted in the Phase 8 blueprint.
- **Phase 4 (Content strategy)**: one idea = "The smartest way to grow your child's brain is to understand their heart." Home = PDF verbatim; other 8 pages AI-drafted per prompt §5.2 during their sprints; voice-lint §1.7 is the gate.
- **Phase 7 (partial)**: stack locked (Next.js App Router + TS + Tailwind + Framer Motion + MDX on Vercel). Tally decided. R3F deferred (renders + parallax at launch).

## Downstream Impact
- Concept round output (`design-concepts/`) decides the visual treatment for all 9 pages.
- Tally adapter must be thin enough to swap tools later; keep form fields + analytics events tool-agnostic.
- Hero and scroll beats must be built around renders + parallax; keep a documented mount point for a future R3F canvas.

## Context for Resume
Read `docs/project-state.json` → `last_handoff`. If concepts exist in `design-concepts/`, the founder may already have picked one; check `approvals`. Never re-interview Brand Bible topics.
