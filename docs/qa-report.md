# QA Report (sprint log)

## Sprint S0–S3 · 2026-07-06 · commit f451eae

**Scope shipped**
- S0: Next.js 16 (App Router, TS) + Tailwind v4 scaffold in `site/`. Brand tokens in `app/globals.css` `@theme` (from `Design/design-system/colors_and_type.css`). Fonts: Glory + Instrument Sans (local variable TTFs via `next/font/local`), Instrument Serif italic (Google). Assets staged to `public/` (mascot cutouts, product, GLB, logos).
- S1: Navbar (sticky, mobile sheet, standing pre-order pill), Footer (cocoa, quiet kheelona.ai line, contact TODO), Container/Section (wash system)/CurveDivider, Button variants, Eyebrow, inline Shape SVGs.
- S2: `MascotScene` (pointer tilt + scroll parallax + idle float, reduced-motion static) and `Mascot3D` (lazy `@google/model-viewer` GLB with idle animation; poster + static-render fallback; gated to fine pointers, no Save-Data, no reduced-motion).
- S3: Home `/` with all 11 sections, PDF copy verbatim (Rs.→₹), C-style orange finale with character lineup + inline `TallyEmbed` adapter (placeholder until `tally-form-url` blocker clears).

**Checks run**
- `next build`: zero errors, zero type errors, static prerender OK.
- SSR content check: hero copy present in raw HTML (no-JS visible; reveals are enhancement-only).
- Visual pass (production server, Chrome): hero, feelings, MeetLumi, PlayOS, compare, safety, voices, journal, finale all render; images and fonts load; ₹ glyph correct.
- Voice-lint grep (`—`) over `site/`: clean.

**Bugs found and fixed**
1. framer-motion `whileInView` reveals baked `opacity:0` into SSR HTML (invisible without JS, bad for SEO). Replaced with CSS reveals gated on `html.js` + one `RevealObserver`; content now fully visible in SSR/no-JS.
2. `model-viewer` slot showed empty until interaction in throttled tabs; added `poster` (wink render) so the slot is never blank.

**Known QA artifact (not a bug)**
- Driving an *unfocused* Chrome tab via automation freezes animation clocks; reveals appear stuck mid-fade in screenshots. Verified final state by disabling transitions. Focused/manual testing unaffected.

**Outstanding for later sprints**
- Placeholders live on Home by design: testimonials ×3, Tally panel (blockers `claims-testimonials`, `tally-form-url`). Launch gate = zero placeholders.
- Lighthouse pass scheduled S12; GLB Draco compression evaluation S12 (current GLB 2.19MB raw).

## Sprint S4–S6 · 2026-07-06 · commit 66ef52c

**Scope shipped**
- S4 `/products/lumi`: hero, conversation demo (chat bubbles), five-feelings-deeper (C-style saturated cards), parent app grid, in-the-box + PENDING specs card, safety strip, 8-question FAQ. Product + FAQPage JSON-LD.
- S5 `/playos`: voice-path ledger (4 steps), privacy cards, family block (orange bold), quiet kheelona.ai link.
- S6 `/safety`: teal hero, body (certs honestly flagged in-progress), four word-rules, voice-data cards, grown-up-holds-the-keys.
- FinaleCTA closes every page; all CTAs same-page anchor to #reserve.

**Checks**: build green (7 routes), voice-lint grep clean, all routes 200, visual pass on lumi + safety.
**Fixed**: nested .git dirs from create-next-app/create-video made the repo track site/ and launch-video/ as submodule stubs; absorbed into the root repo.
**Copy note**: all non-Home copy drafted this sprint is AI-drafted per prompt §5.2 and pending founder review at this milestone (compiled into copy-reference.md at S8).
