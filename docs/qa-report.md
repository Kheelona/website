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

## Sprint S7–S13 (project completion run) · 2026-07-06

**Scope shipped**
- S7 `/team`: manifesto hero, founder cards (locked facts), beliefs ledger, gentle close.
- S8 `/stories`: index grouped by theme + 4 seed articles (lib/stories.ts, Article JSON-LD, soft closes). Home journal links now resolve.
- S9 (partial): Tally adapter final; gtag event stubs; BLOCKED on founder URL (FOUNDER-TODO #1).
- S10 `/privacy` `/terms` `/setup`: plain-language drafts, counsel TODO flags.
- S11: sitemap.ts (13 URLs), robots.ts, Organization JSON-LD, OG image (public/og.png, brand card 1200x630), per-page canonicals/meta already in place. FAQPage schema on Lumi + Safety; Product schema on Lumi; Article schema on stories.
- S12/S13: Lighthouse driven fixes: list semantics (Reveal `as="li"`), hero badge contrast, footer link underline, `sizes` on mascot images, LCP-safe "rise" reveal mode for all heroes (fade-from-opacity-0 was costing ~3.5s of LCP).

**Final Lighthouse (production build, localhost)**
- Desktop: Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100 → §3 gates PASSED.
- Mobile (simulated slow 4G): 85 · 100 · 96 · 100. LCP 4.4s from the hero character image; documented tradeoff per §3 (option: smaller mobile hero render).

**QA checks**: build zero errors (18 static pages), all 16 routes 200, branded 404, voice-lint + hype grep clean across app/components/lib, sticky mobile CTA hides at #reserve, no-JS SSR shows full content.

**Remaining founder-gated items**: see FOUNDER-TODO.md (Tally URL, deploy auth, testimonials, certs/specs, ship date, contact email, languages list, GA4 ID, counsel review, 3D judgment).

## Content expansion sprint (10 new articles + assets + AI-detection verification) · 2026-07-06

**Scope shipped**
- Keyword research: Google autocomplete (India locale, `gl=in`) across 42 parent-intent seeds; clusters → 10 new article briefs (see `lib/stories-expansion.ts` header).
- 10 new journal articles in `site/lib/stories-expansion.ts`, merged into STORIES (total 14; 28 static pages build).
- Engagement pass on the original 4 (scene-first openers, e.g. safe-AI-toy now opens on the stomach-flip moment).
- 7 hero illustrations generated with Gemini (locked style: warm 3D animated-film look, Indian families, no text), downscaled to 1440px JPEGs in `site/public/stories/`, wired via `hero`/`heroAlt` fields + Article JSON-LD `image`. Remaining 7 prompts saved in `docs/stories-image-prompts.md`.
- Article page now renders hero with real alt text (SEO/AEO) and correct 1440x803 intrinsic size.

**AI-humanizer step (user-requested) — evidence-based outcome**
- Tested QuillBot AI Humanizer on a representative sample (tantrums article, 115-word chunk within the 125-word free limit). Output DEGRADED the copy: inverted the meaning of the opening scene ("a child who was silent for forty minutes becomes a weather system" → "A quiet child ... is a small weather system"), changed "The video ends" to "The video cuts out", weakened word choices. Decision: do not machine-rewrite.
- Instead verified all 14 articles through AI detectors:
  - QuillBot AI Detector v7.1.0: 4 scans covering 10 articles → 0% likely AI, 100% human-written each time.
  - Scribbr Free AI Detector (QuillBot v7.1.0 engine): final 4 articles (1,183 words) → 0% likely AI, 100% human-written.
- Conclusion: the copy already passes as human-written; humanizer rewrite unnecessary and harmful. QuillBot anonymous scan limit (~4) reached; future re-checks can use Scribbr or a logged-in QuillBot.

**Checks**: build green (28 static pages, all 14 article routes), voice-lint grep clean (0 em-dashes, 0 hype, names exact), hero image + article page visually verified on production build (localhost:3456), heroes return 200.


## Visual rework sprint (cutouts, 3D hero, launch film) · 2026-07-07

**Founder brief**: pages not loading properly; images carrying baked backgrounds; hero dull + broken two-faced GLB; wants launch video and a ground-up, subtly immersive 3D visual language (keep brand tokens + verbatim copy; hero copy staged, all sentences retained).

**Scope shipped**
- `tools/cutout` (Swift + Vision subject lift, EXIF-aware, neutral shadow/halo cleanup): all 7 mascot poses + lumi-blue re-cut from `Design/` originals. Canvas pixel audit: no background remnants. Fixes the white patches on teal/orange/purple washes.
- Loading: Reveal default is transform-only "rise" (nothing hides), observer fires at viewport edge (-8%), 0.45s transitions; above-fold MascotScene gets priority. Fast scroll can no longer land on blank viewports (reproduced then re-tested on /stories).
- Tripo3D regeneration (web UI, cleaned multi-view inputs): mascot Smart Mesh 10k tri, 2k texture, rig v2.5 Good-for-Animals -> Humanoid, idle clip ("NlaTrack"). Verified from 8 angles offline: the Janus/two-face artifact is gone. Lumi plush generated from front/left/right product photos -> `lumi-plush.glb`. Credits 875 -> 745 (cap was ~400 spend; used 130).
- Hero: slim copy + R3F scene (`components/three/HeroScene.tsx`): idle clip, scroll-linked yaw, pointer tilt, sparkles, static contact shadow; gates identical to old model-viewer slot (pointer:fine, no Save-Data, no reduced-motion) with the static cutout as LCP + fallback. `@google/model-viewer` removed.
- StagedIntro: remaining PDF hero sentences as staged display lines (verbatim, in order).
- LaunchVideo section + `launch-video/src/ProductFilm.tsx`: 20s, five scenes from real photoshoot cutouts (agent-shortlisted 14 of 60 photos), all on-screen text verbatim site copy, 2.1MB H.264 + poster. Autoplay muted, pauses offscreen, reduced-motion/Save-Data get poster + controls.
- /products/lumi: photo hero cross-fades into a slow 3D turntable (`LumiTurntable`, no controls).
- Feelings (home): five identical tinted cards -> cast lineup on one soft ground with per-feeling color ticks; curve dividers now alternate direction.
- A11y: canvas aria-label removed (prohibited-attr), 3D layers aria-hidden (they restate the static art), eyebrows back to sanctioned orange-deep, feelings captions ink, PlayOS numerals orange-deep, kheelona.ai link ink-head underline.

**Lighthouse desktop (post-rework)**: / 99/96/100/100 · /products/lumi 100/92/100/100 · /stories 100/96/100/100 (Perf/A11y/BP/SEO; gates 90+ met everywhere).
**Known contrast remainder**: white-on-orange compare/finale bands measure ~2.9:1 at large text (needs 3:1). Brand-locked oranges; gate met; revisit only if the founder wants a deeper orange.
**Verification**: full page-by-page screenshot walkthrough (all 9 pages + articles + 404) on the production build; GLB 8-angle contact sheets for both models; video scene stills reviewed; build green (28 pages).
**Note for future automation**: Chrome throttles IntersectionObserver/rAF in unfocused tabs; the 3D mount and reveals can look inert in captures while being fine for real users. One real interaction wakes them.
