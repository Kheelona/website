# kheelona.com — Master Blueprint (`website-steps.md`)

> Phase 8 output. The single source of truth for implementation. If reality diverges, update this file first. Approved direction: **Concept A (Storybook) base + Concept C bold moments** (see `docs/checkpoints/phase-2-ux-discovery.md`).

> **STRUCTURE UPDATE (2026-07-12) — read before using any path below.** The app is now
> `src/`-based atomic design per the BINDING standards in `docs/standards/` (see CLAUDE.md
> "Production structure & standards"). Component/file paths in the §8.x sections below trace
> the R4→R11 build and PREDATE that reorg (some name since-retired components); translate any
> path through `docs/standards/STRUCTURE-MAP.md`. New sections MUST follow the standards
> (atoms/molecules/organisms/templates + features/, `@/config/site`, a Storybook story + a
> Vitest test per component). Quick map: `components/three/*` + `lib/three/*` →
> `src/features/ambient-stage/`; `components/sections/home/*` → `src/features/home/`;
> `components/ui/*` → `src/components/{atoms|molecules|templates}`;
> `components/sections/shared/*` + `components/layout/*` (Nav/Footer) → `src/components/organisms/`;
> `lib/site.ts` → `src/config/site.ts`; `app/globals.css` → `src/styles/globals.css`.

## 8.1 Overview
- **Job**: turn parent interest into a qualified pre-order list for Lumi at ₹4,999 (₹9,999 after launch, no payment now), and earn trust.
- **Audience**: parents of children aged 3 to 6, India-first, screen-wary, often the mother.
- **Stack (locked)**: Next.js App Router + TypeScript, Tailwind CSS (tokens from `Design/design-system/`), Framer Motion (reduced-motion aware), Stories as typed TS data modules (`lib/stories.ts` + `lib/stories-expansion.ts`; MDX was planned but data modules won: typed, greppable, voice-lintable), Tally for pre-order, GA4 + Vercel Analytics, Vercel hosting. Mascot: rigged GLB (Tripo3D, idle animation) live in the hero via lazy `@google/model-viewer` with static-render fallback (`Mascot3D`); renders + parallax/tilt (`MascotScene`) elsewhere. The planned R3F slot was superseded by model-viewer.
- **Voice**: Brand Bible §1.6 + voice-lint §1.7 (zero em-dashes, en-dash only in number ranges, no hype, exact names: PlayOS, Lumi, Lori, Lua, Robu, Kheelona Magic Box, second person present tense). Home copy = PDF verbatim, Rs. → ₹.
- **Never invent**: testimonials, certifications, specs, ship date, contact email (blockers in `project-state.json`; render flagged placeholders).

## 8.2 Design System → Tailwind mapping
Source: `Design/design-system/colors_and_type.css` (+ its README). Do not invent values.

```
colors: {
  orange: '#EF762F', 'orange-deep': '#D85F1B', yellow: '#F1A23B',
  blue: '#29A0D7', 'blue-soft': '#3AA4E5', teal: '#1ABC9C', purple: '#8B5BFF',
  ink: { DEFAULT: '#272727', head: '#1C1C1C', muted: '#727272' },
  line: { DEFAULT: '#CFCFCF', soft: '#E2E2E2' },
  cream: '#FFF7EE', cool: '#EAF6FC',   // section washes (A base)
}
15%-alpha tints via Tailwind opacity modifiers (e.g. bg-orange/15). Usage ratio guide: 30% yellow / 30% white / 20% blue / 10% orange / 5% teal / 5% purple.
fonts (next/font/local, files in Design/design-system/fonts/):
  display: Glory variable (700-800 for headings)  → font-display
  text: Instrument Sans variable                  → font-sans
  accent: Instrument Serif italic (Google/next/font) → eyebrows only
radius: cards 22-28px (A language), pills for buttons; hairline borders NOT used (A has soft tinted fills instead)
shadow: '0 4px 4px rgba(0,0,0,.25)' on primary CTA + sticker elements only; tinted drop-shadows for mascot grounding
motion: ease-bounce cubic-bezier(0.34,1.56,0.64,1), ease-out cubic-bezier(0.2,0.8,0.2,1); 160/220/320ms; reveals ~650ms
type scale: h1 clamp(38px,4.5vw,58px) lh 1.08; h2 clamp(32px,4vw,50px); h3 clamp(24px,2.6vw,32px); body 18px lh 1.55; eyebrow = accent italic 21px
```
**Engineering gotchas (learned in concept QA, non-negotiable)**
- `overflow-x: clip` on body, never `hidden` (hidden makes body a scroll container, breaks wheel).
- Brand shape SVGs use `fill="currentColor"`: inline them as React components (preferred in Next) or bake fills; never raw `<img>` the originals.
- No `scroll-snap-type: x mandatory` on desktop rows (wheel trap). Mobile-only swipe rows are fine.
- Avoid class collisions with section names (`.safety` incident): components use scoped/Tailwind classes.
- Hero H1 max 3 lines at desktop.

## 8.3 Assets
- Mascot cutouts (transparent PNG, produced 2026-07-06): `design-concepts/assets/mascot-{hero-wink,curious,grumpy,sad,silly,joy,bliss}.png` → copy to `public/mascot/`. Sad uses the "scared" render (stand-in, flagged).
- Product cutouts: `lumi-blue.png` (584x843), `lumi-green.png` (small) → `public/product/`. More angles in `Design/product-images/`.
- Logos: `Design/design-system/assets/logo-wordmark.png` (white-bg baked: use on white nav), logo-mark. Footer on dark: Glory-bold text wordmark.
- Shapes: 7 primitives in `Design/design-system/assets/shapes/` → inline React components with color prop.
- Regenerating cutouts: see `design-concepts/README.md` (cutout.swift pipeline).

## 8.4 Component Plan (`components/`)
- **layout/**: `Navbar` (white, wordmark, 5 links, standing pre-order pill; mobile: logo + pill + sheet menu), `Footer` (dark #2A1608; nav links, quiet kheelona.ai line, contact placeholder), `Container`, `Section` (wash prop: white|cream|cool|orange|teal), `CurveDivider` (SVG, direction + fill props).
- **mascot/**: `MascotScene` — THE site-wide dimensional mascot. Props: pose, size, parallax depth. Behavior: idle float (CSS), scroll parallax (Framer Motion useScroll+useTransform), pointer perspective tilt on desktop (useMotionValue, never useState), tinted ground shadow. Reduced-motion → static image. `Mascot3D` (built 2026-07-06, supersedes the planned R3F slot): lazy `@google/model-viewer` loading `public/models/kheelona-mascot.glb` (rigged + idle animation, from Tripo3D — pipeline in `design-concepts/README.md`); static `<Image>` stays mounted until the model's `load` DOM event (attach via ref + addEventListener — React `on*` props do not bind on custom elements); gates: `pointer: fine`, no Save-Data, no reduced-motion.
- **ui/**: `Button` (primary orange pill w/ white border + shadow; ghost ink outline; on-dark white), `Eyebrow`, `FeelingCard` (pastel tint + mascot pose), `PendingCard` (dashed, TESTIMONIAL PENDING pattern), `CompareTable`, `StoryCard`, `FaqItem` (accordion), `TallyEmbed` (thin adapter: iframe embed w/ env URL + loading/error states + analytics events; flagged placeholder panel until `tally-form-url` blocker resolves).
- **sections/** (Home): Hero (split, wink mascot, sun glow, shapes), WhyWeExist (centered manifesto), Feelings (5 pastel staggered cards), MeetLumi (product blob scene + 2 tinted cards), PlayOS (cool wash, 2 white step cards, quiet kheelona.ai link), Compare (warm zebra table, orange Lumi column), SafetyStrip (teal band + bliss mascot), ParentVoices (3 PendingCards), Journal (2 story cards), **FinaleCTA (from Concept C: saturated orange, big Glory display, white pill button, character lineup along bottom edge)**.
- **C-style "bold block" accent language** (sparingly, 1-2 per page max): saturated color-block section with white text, used for: Lumi page five-feelings-deeper (C's full-color cards), PlayOS page architecture moment, Team "what we believe" band.

## 8.5 Pages (9 routes) — job, sections, keywords
Nav: Lumi · How it works (→/playos) · Safety · Stories · Team + pre-order button. Every page ends with FinaleCTA (or soft variant on secondary pages).
1. **/** Home: 11 sections per PDF, copy verbatim. KW: AI robot toy, talking toys, AI toys, brain development toys, voice toy for kids in multiple languages (+ per-section map in build prompt §3.1).
2. **/products/lumi**: hero shot + one-line promise; conversation demo (scripted exchange, styled chat bubbles, no fake precision); five feelings deeper (C-style color cards); parent app in full; what's in the box + specs (PENDING flags); safety strip → /safety; price + reserve; FAQ (FAQPage JSON-LD). KW: talking toys, robot toy, cognitive development toy for toddlers, developmental toys.
3. **/playos**: PlayOS in one breath; the voice path (wake word → on-device → safety layer → voice back; step diagram); safety architecture; data & privacy (region-pinned, parent-consented, deletable, never sold); the family (Lumi, Lori, Lua, Robu: "One soul. Many bodies."); made to be kept. Quiet "Building on PlayOS? See kheelona.ai". KW: brain development toys, cognitive development toy for toddlers, smart toys, interactive learning toy for curious kids.
4. **/safety**: "Safe in their hands. Careful with their words." Body (materials, standards PENDING); words (wake-word only, mics off, filters, no open internet); where a child's voice goes; the grown-up holds the keys; standards & certifications (PENDING). KW: AI toys, safe AI toy, toy to reduce screen time for toddlers in India.
5. **/team**: short manifesto; founder cards (Apoorva Sahu Founder/CEO; Aman Soni Co-founder/CTO, 14 patents filed; Kashyap C.R Co-founder/CHO, built at Intel — name Intel only); what we believe; light backed-by band (PENDING logos); gentle close. KW: AI robot toy.
6. **/stories**: index + 14 articles — 4 seed pieces in `lib/stories.ts` ("Why three to six are the years that matter most", "Screen-free does not mean silent.", "How children learn by talking.", "What to look for in a safe AI toy.") + 10 keyword-researched pieces in `lib/stories-expansion.ts` (2026-07-06 expansion: screen time, tantrums, phone weaning, talking, speech delay, brain, vocabulary, bilingual, kids+AI, busy hands). Soft pre-order close or no product mention. Article JSON-LD with hero image; 7 illustrated heroes in `public/stories/` (remaining prompts: `docs/stories-image-prompts.md`). All 14 verified 0% AI on QuillBot detector (qa-report). KW: per keyword map + autocomplete research.
7. **/privacy**, **/terms**: plain-language drafts, big COUNSEL-REVIEW banner comment + state blocker. Cover reservation fairness, price hold, data use, WhatsApp consent, deletion.
8. **/setup**: day-one steps, calm, short. Numbered steps + mascot.
Also: `sitemap.ts`, `robots.ts`, per-route metadata + OG images (1200x630, canvas-design later), 404 page, JSON-LD (Organization site-wide, Product on /products/lumi, FAQPage, Article).

## 8.6 Pre-order flow (Tally)
- Fields (locked): parent name, email, WhatsApp number, WhatsApp consent checkbox, child's birth month, city.
- Integration: Tally embed (popup or inline) via `TallyEmbed`; form URL in `NEXT_PUBLIC_TALLY_FORM_URL` (.env.local). Confirmation email configured in Tally (voice-linted copy supplied in `docs/copy-reference.md` when written).
- Every CTA opens the Tally flow (or scrolls to embedded form section on Home). GA4 events: `preorder_view`, `preorder_start`, `preorder_submit` (+ Vercel Analytics). Price-hold message restated in the form intro.
- **Blocker**: `tally-form-url` — build ships a flagged placeholder panel until founder provides it (S9 milestone).

## 8.7 Launch video (Remotion) — new deliverable
- Location: `launch-video/` (own package.json; excluded from Next build).
- Format: 1920x1080 30fps teaser ~25-30s (+ optional 1080x1920 vertical later). Brand tokens + Glory type + mascot cutouts + shape motifs.
- Beat sheet (voice-lint applies): (1) shapes drift on cream, eyebrow "For ages 3 to 6"; (2) one-idea headline lands; (3) mascot poses carousel with feeling names (Curious→Grumpy→Sad→Silly→Joy); (4) Lumi product reveal, "Screen-free. A real conversation."; (5) price card ₹4,999 + "We hold the price, you hold your place."; (6) logo + kheelona.com + Join the pre-order list.
- Embed on site later as `<video>` (poster + lazy) or hero background moment; never WebGL.

## 8.8 SEO & performance
- Keyword map: build prompt §3.1 (16 keywords, locked). Primary keyword in H1/first para/meta title per page. Meta titles 50-60 chars, descriptions 150-160, unique per page.
- Lighthouse gates (raised 2026-07-10, §8.13): A11y/BP/SEO = 100 all routes both form factors; Perf ≥95 desktop, ≥90 mobile, all routes.
- Images: next/image, AVIF/WebP, mascot PNGs pre-sized per breakpoint; fonts self-hosted with subset + `font-display: swap`; parallax/tilt only via transform/opacity; no layout animation.

## 8.9 QA plan (per sprint + full pass at S13)
Functional (nav, CTAs, accordion, Tally flow incl. error/loading), responsive 375/768/1280/1536, cross-browser (Chrome/Firefox/Safari + iOS), keyboard nav + focus visible + 4.5:1 contrast + ARIA, reduced-motion audit, copy QA vs `copy-reference.md` + voice-lint grep gate (`grep -rn '—' app/ components/ content/` must be empty), zero unconfirmed claims rendered as fact, no console errors, broken-link pass.

## 8.10 Sprint plan (auto-mode; pause at milestones)
| Sprint | Scope | Gate |
|---|---|---|
| S0 | Next.js scaffold + tokens + fonts + base layout/washes/curves | Auto |
| S1 | Navbar, Footer, Container/Section, Button, Eyebrow | Auto |
| S2 | MascotScene (parallax/tilt/float + reduced-motion + R3F slot) | Auto |
| S3 | Home: all 11 sections, PDF verbatim, FinaleCTA from C | Auto |
| S4 | /products/lumi (+FAQ, PENDING specs flags) | Auto |
| S5 | /playos | Auto |
| S6 | /safety | **Pause (trust page)** |
| S7 | /team | Auto |
| S8 | /stories + 4 seed articles (TS data modules; expanded to 14 on 2026-07-06) | Auto |
| S9 | Tally integration + analytics events | **Pause** |
| S10 | /privacy /terms /setup (counsel flags) | Auto |
| S11 | SEO: metadata, OG, sitemap, robots, JSON-LD | Auto |
| S12 | Performance pass + Lighthouse | **Pause** |
| S13 | Full QA plan | **Pause** |
| S14 | Vercel deploy + handoff docs | **Pause** |
Launch video runs as parallel workstream V1 (scaffold+render) before/alongside S3.
Before each sprint: snapshot (git init at S0; commit `pre-Sx`). Sprint report appended to `docs/qa-report.md`. State updated every sprint. Context-clear protocol every 2-3 sprints.

## 8.11 Launch checklist (S14)
sitemap+robots; favicon bundle (logo-mark); per-route OG; 404; canonical URLs; Search Console + GA4 verified; performance budget documented; zero placeholder assets in prod paths; zero unconfirmed claims; Privacy+Terms counsel-reviewed; Tally e2e (submit → confirmation email); asset licenses in README.


## 8.12 Visual rework addendum (2026-07-07, founder-directed)
- Assets: all mascot/product cutouts re-cut with true transparency via `tools/cutout` (Vision subject lift + neutral shadow/halo cleanup). No baked backgrounds anywhere; shadows are CSS-only.
- Motion: Reveal defaults to transform-only "rise" (content never hidden; fast scroll cannot blank a viewport); observer fires at viewport edge; 0.45s.
- Hero (home): slim verbatim copy + `components/three/HeroScene.tsx` (three/@react-three/fiber/@react-three/drei) playing the regenerated Tripo GLB idle clip, scroll-linked yaw + pointer tilt. Gating contract unchanged (pointer:fine, no Save-Data, no reduced-motion; static cutout is LCP + fallback). model-viewer removed. Remaining hero sentences staged in `StagedIntro.tsx`; 20s ProductFilm loop (`LaunchVideo.tsx`) follows.
- 3D models: `public/models/kheelona-mascot.glb` (idle "NlaTrack") and `public/models/lumi-plush.glb` (turntable moment on /products/lumi, `LumiTurntable.tsx`).
- Feelings (home): cast lineup on a shared ground with color ticks replaces the five tinted cards; curve dividers alternate direction site-wide.
- Video pipeline: `launch-video/src/ProductFilm.tsx` renders from real photoshoot cutouts in `launch-video/assets/product/`; output lives at `public/video/launch.mp4` (+poster).

## 8.13 Elevate + polish cycle addendum (2026-07-10, founder-approved)

Applies on top of the immersive redesign (`docs/redesign-plan-2026-07.md`). Founder decisions, locked:
1. **Elevate, not rebuild** — D1+D4 journey architecture and verbatim copy stay.
2. **Pragmatic hybrid libraries** — three/@react-three/fiber/@react-three/drei remain the only 3D stack (VengeanceUI and reactbits evaluated and rejected: unaudited/flashy, conflict with brand rule). Exactly two primitives vendored on Radix, restyled with `@theme` brand tokens: FAQ accordion (`@radix-ui/react-accordion`) and mobile-nav sheet (`@radix-ui/react-dialog`). **[SUPERSEDED IN PART, V6 §8.24-6: the FAQ moved to native `<details>` because the accordion kept its closed answers out of the HTML. `@radix-ui/react-accordion` is still a dependency, now used by `ArchitectureStack` alone.]** No shadcn CLI, no CVA/tailwind-merge/lucide. Micro-interactions via `motion` (160–320ms, `--ease-calm`).
3. **Lighthouse hard gates** — 100 A11y/BP/SEO on all 9 routes, both form factors; Perf ≥95 desktop / ≥90 mobile.
4. **Scope** — Home journey deep-polish + ambient 3D scenes on the 7 flat interior routes.

Mechanisms introduced this cycle:
- **Copy legibility ghost-fade** (`src/lib/three/exclusion.ts`): every floating shape's screen projection is tested per frame against measured `[data-content]` rects (document coords cached at measure time, zero DOM reads on the frame loop); a shape whose projection would cross copy fades to 14% opacity and returns when clear. (A placement-time clamp was designed first but rejected during implementation: the copy column spans ~83% of the viewport, so clamping either emptied the field or failed at some depths.) The Lumi plush additionally transit-fades between beats so it never crosses a neighboring section's copy.
- **Single three-stack entry** (`src/components/three/Stage.tsx`): every dynamic import of a WebGL surface goes through this one module. Sibling dynamic entries made the bundler emit twin chunks with duplicate three/fiber copies. Rule: never `dynamic(() => import(...))` any three-consuming module except Stage.tsx.
- **Hidden-tab caveat for 3D QA**: R3F boots on requestAnimationFrame, which Chrome freezes in hidden/occluded tabs. A backgrounded automation tab shows an inert 300x150 canvas and no `scene-3d` class — that is browser throttling, not a site bug. Verify 3D with a visible window.
- **AmbientStage** (`src/components/three/AmbientStage.tsx`): lighter per-route scene for interiors — static camera + pointer parallax, corridor-clamped shape field, wash colors measured from the page's own `[data-wash]` sections (`src/lib/three/ambient.ts`), per-route dressing in `src/lib/three/ambient-configs.ts` with `enabled:false` kill switch. No GLBs on interiors. Shared shell extracted from ThreeStage (`StageShell.tsx`, `backdrop.tsx`); `StageGate` takes `stage: "journey" | "ambient"`.
- **Mobile perf contract**: `lite` tier arms the 3D stage on first user signal (scroll/pointer) then idle, keeping three.js out of the Lighthouse trace; fonts are WOFF2 (unused Glory-Italic removed); AVIF enabled in `next.config.ts`; `LaunchVideo` uses `preload="none"`.
- **Token drift gate**: `tools/tokens/check-tokens.mjs` compares `Design/Kheelona-Design-System-v3/tokens/kheelona.css` ↔ `src/styles/globals.css` `@theme` ↔ `src/features/ambient-stage/lib/tokens.ts` and fails the site build on drift, and fails HARD when the v3 CSS is missing (repointed in CS3, 2026-08-23; curated wash intermediates whitelisted). [paths updated for the 2026-07-12 src/ reorg]
- **Review loop**: design panel note lives at `docs/design-review-2026-07-10.md`; approval loop capped at 3 iterations before founder escalation.

## 8.14 R5 calm pass (2026-07-10, founder-directed)

Founder review of the live R4 site rejected the busy journey ("too much going on... 3D artifacts fly, come and go") and issued a concrete punch list. Dispositions below are LAW; the R4 journey machinery is DORMANT, not deleted.

- **Home rides the ambient stage** (`<StageGate stage="ambient" />` in `app/page.tsx`, config under `"/"` in `ambient-configs.ts`): the calm /playos treatment the founder liked. The full journey (models, beat camera) returns by flipping the prop back to `journey`. The `<Beat>` wrappers stay so beat mapping still fits.
- **2D actors permanently**: hero mascot + Lumi are the DOM renders (the `scene-3d-full` art-handoff never fires under ambient); `/products/lumi` hero is a static 2D image (`LumiHero.tsx`), the R3F `LumiInset` dormant behind the Stage entry. "Dull 3D lighting" resolved itself: the GLBs no longer show anywhere.
- **Shape discipline**: densities cut ~35% (home 8, interiors 4-8), `BrandShape` base opacity 0.55, slower drift (0.35x freq, 0.04 wobble), lateral scatter pushed past the content column, ghost-fade floor 0.14 → 0.04 (`GHOST_OPACITY`). DOM `Shape` decorations at `opacity-25` (the DS decorative register).
- **Typography law**: ZERO italics anywhere (the Instrument Serif accent face is loaded `style: "normal"`; no italic font files ship). ALL text left-aligned (StagedIntro stagger indents flattened; `text-center` allowed only inside pill-button labels). Orphan control is global CSS: `h1-h4 { text-wrap: balance }`, `p { text-wrap: pretty }`.
- **White-label color system**: button labels and colored-band text are WHITE on fills where white passes 4.5:1 at any size — `--color-orange-cta #C25210` (4.66:1) and `--color-teal-deep #0F766E` (5.47:1), sanctioned site-only tokens guarded by `check-tokens.mjs` SITE_MAP. Applied to: Button primary (hover = lift, never a lighter fill), sticky mobile bar, compare-table Lumi column, finale band (consent line white too), safety band + /safety hero. `CurveDivider` teal/orange fills match the band paints. Raw `#EF762F`/`#1ABC9C` are decorative-only. `onDark` buttons = cocoa fill + white label. Saturated card fills → the DS 15%-alpha tints.
- **Feelings = boxed cards** (Home): white card, hairline `line-soft` border, `--radius-card`, uniform grid (2/3/5 cols), no stagger, no ground ellipse.
- **Sticky pre-order CTA is always visible**: mobile bar no longer ducks on scroll-down (hides only while `#reserve` is on screen); desktop keeps the persistent navbar pill.
- **Icon rule**: one SVG family (20-grid, stroke-2, round caps). Font-glyph checkmarks replaced with the check SVG; no emoji/glyph icons.
- **Brand assets**: `public/brand/logo-mark.png` was a broken Figma-panel screenshot; now a real crop of the K lockup. Current wordmark stays; founder uploads a NEW logo later (FOUNDER-TODO R5-a).
- **80/20 palette discipline**: shape palettes lean yellow/blue/orange; teal+purple ≤1 slot per palette (matches the DS 30/30/20/10/5/5 card).

## 8.15 R6 elegant motion (2026-07-10, founder-directed brainstorm)

R5 overshot the calm; founder wants tasteful 3D life back, sourced from polished registries. Locked decisions: shapes "present but polite"; all four surfaces (hero background, tilt cards, pop entrances, animated CTAs) applied elegantly site-wide; **Animate UI = the primary vendored registry**; actors stay 2D. Supersedes R4's "no component libraries" call (founder re-opened it).

- **Vendor registry law**: external components live under `src/components/vendor/<source>/`, copied source pinned to a commit, header comment records source+license+brand modifications, and `src/components/vendor/README.md` is the index (the founder's "centralized reusable database"). Animate UI license verified: MIT + Commons Clause — commercial use inside a product is explicitly permitted; reselling components is barred.
- **cn() upgraded** to clsx+tailwind-merge (vendored code assumes a merging cn; the R4 class-conflict foot-gun is closed). `lucide-react` is the icon family (hamburger/close/plus/check swapped; matches the DS iconography card).
- **Presence dial**: BrandShape baseOpacity 0.9 (ghost floor near copy stays 0.04); ambient densities home 11 / interiors 9-10 / legal 4; DOM hero shapes opacity-40.
- **Hero glow** — **REMOVED 2026-08-23**, and this entry stays only as the record of what R6 built. The mount went with a later hero rewrite and the component sat unimported until the doc-cleanup round deleted it; git history has it if the calm-glow treatment is ever wanted again. What it was (`vendor/animate-ui/backgrounds/hero-glow.tsx`): the Bubble background rebuilt calm — no goo/blur filters (compositor-only transforms), 3 warm brand blobs on 38-66s loops, reduced-motion renders static. Mounted section-local in the Home hero only.
- **TiltCard** (`ui/TiltCard.tsx` over vendored `primitives/tilt.tsx`): 5° pointer perspective on every card surface (feelings, journal, stories, team, product features+feelings, safety rules, playos principles). Renders a plain div unless `(hover:hover) and (pointer:fine) and (prefers-reduced-motion: no-preference)`. Tables never tilt.
- **Storybook pop entrances**: `data-reveal` CSS now settles from `perspective(700px) translateY rotateX(5deg) scale(0.98)` on the bouncy brand ease. Contracts unchanged: "rise" stays opacity-safe for LCP, no-JS fully visible, reduced-motion none.
- **CTA ripple**: press ripple grafted into `ui/Button.tsx` (adapted from Animate UI's ripple primitive, credited; CSS keyframe `--animate-ripple`); skipped under reduced motion. White-label fills and WCAG rules untouched.
- Perf: all new motion is transform/opacity-only; TBT unchanged (0ms); bundle adds ≈ tailwind-merge 3KB + lucide icons ~4KB.

## 8.16 R7 sister-site enrichment (2026-07-10, founder-directed)

kheelona.ai (the founder's B2B sister site, senior-designed) is the sanctioned reference for content AND design. Everything imported is founder-published there; statuses copied exactly (claims gate). Assets pulled from the private repo apoorva262/kheelona.ai via authenticated gh api into `public/{team,recognition,app}`.

- **Shared sections** (`components/sections/shared/`): RecognitionStrip (Recognised by / Backed by; NVIDIA Inception Program, Karnataka Elevate seal+text, nasscom, Founders Inc text-only), SafetyCallout (the "first question, answered" card, body line verbatim, teal-deep lead), ParentAppSection (For the grown-ups / "Parents stay in the loop.", 5 chips verbatim, real dashboard screenshot in `ui/PhoneFrame`), ParentQuotes (3 real early-tester quotes, parameterized title/eyebrow/count) — **the claims-testimonials blocker is RESOLVED** by these published quotes.
- **Home order**: Hero → RecognitionStrip → StagedIntro → Film → Why → Feelings → MeetLumi → PlayOS → Compare → SafetyCallout → SafetyStrip → ParentQuotes → ParentAppSection → Journal → Finale. New sections ride OUTSIDE the <Beat> map (journey stays dormant with untouched indices).
- **Team = full kheelona.ai parity in parent voice**: manifesto hero ("Every object a child holds is about to wake up."), founder cards with photos on brand tints, color top borders, LinkedIn chips (inline glyph; lucide has no brand icons), uppercase role + tag (the brain/the body/the business), full bios (facts as published: 14 patents; Intel + Thunderbolt 4/5; CA + 15 years scaling), upright-serif pull-quotes with color borders; Backed by row closes TODO(claims-backed-by).
- **Safety**: 4-step custody chain (wake word → device filter → voice brain → your app), "Nothing leaves without consent. Nothing stays you can't delete.", standards chips status-exact (COPPA 2026/GDPR-K/DPDP = Designed for; ISO 27001 = In progress).
- **Lumi**: pilot stats band verbatim (10 families daily / 1 school / 10 languages), "They think they are playing. The app shows you they are growing." app lead, metric specifics in the app intro, 2 ParentQuotes.
- **PlayOS**: "Safety is built in, not bolted on." + one-prompt customization card ("Your parenting philosophy, in one prompt").
- **3D**: 4 new brand shapes from the kheelona.ai kit merged into shape-paths.ts (3D-only; DOM Shape keeps its trio), ShapeField KINDS extended, corner clusters (their Cluster language) as ambient accents on home/team/playos.
- Gotcha for posterity: this Next build snapshots `public/` at BUILD time — new static assets 404 on a running `next start` until rebuild.

### 8.16.1 Pick-your-Lumi shelf + stats removal (2026-07-10, founder-directed)

- Home gains `PickYourLumi` (S06b, after MeetLumi): three SKU cards (Lumi Green / Lumi Pink / Lumi Blue), plush cutouts from `Design/product-images/generated-2026-07` on teal/purple/blue 15% tints, TiltCard + whole-card link to /products/lumi (no cart pre-launch; the reserve list is the buy). Reassurance line reused verbatim. Divider chain: MeetLumi(white) -> shelf(cream, from=white) -> PlayOS(cool, from=cream).
- The /products/lumi pilot-stats band (10 families / 1 school / 10 languages) REMOVED on founder direction (same day it shipped); ParentQuotes' heading still carries the 10-families stat.

### 8.16.2 Founder review round 2 (2026-07-10 evening)

- **MeetLumi absorbs the SKU shelf**: the single-plush portrait is gone; the founder-picked three-card format (Lumi Green/Pink/Blue on 15% tints, price + link to /products/lumi) lives INSIDE Meet Lumi, between the verbatim copy and the info cards. The standalone PickYourLumi section is deleted.
- **Feelings cards**: per-feeling 15% tints (the /products/lumi recipe) + one exact mascot render height (h-130/145) so the row reads in sync.
- **"The technology behind the talking" REPLACED by WhatLumiDoes** (kheelona.ai/lumi's parent-feature grid): eyebrow "What Lumi does all day", H2 "Not a speaker with a face. A companion with a memory.", six cards (Real conversation / Breathes / 10 languages / Answers every 'why?' / Parent app / Safe by design) with design-system shape-face characters (Shapes.tsx now reads all 7 kinds from lib/shape-paths with per-kind viewBoxes). PlayOS tech story lives on /playos; both sanctioned links kept in the section footer. PlayOSHome.tsx deleted.
- **WhyWeExist restaged as an editorial spread**: statement left, argument right, the strongest sentence in the accent register with an orange rule. Sentences verbatim, only presentation changed.

### 8.17 R9: friend-feedback round + Kheelu the narrator (2026-07-10/11)

External reviewer audit (~20 findings) + founder decisions (3 question batches). Full disposition table in qa-report.md R9. The law:

- **Brand hierarchy (the reviewer's biggest point):** the plush = **Lumi, the product** (a rotating SKU: looks change post-launch, core stays — NOT published on-site); the orange character = **Kheelu**, the permanent brand mascot and site narrator. Hero right side = lumi-blue plush (the new LCP element); MascotScene left the hero. Finale lineup product-forward: kheelu-joy · green · BLUE (center, tallest) · pink · kheelu-silly.
- **Kheelu narrator device:** `ui/KheeluSays.tsx` — pose render (~76–88px) + white speech-bubble card (hairline border, rotated-square tail), always above the section heading; one motif so "full narrator" stays calm. `home/KheeluIntro.tsx` (after the recognition strip) introduces him from the founder's card. Shared sections take the bubble via prop (`ParentAppSection kheelu`, `FinaleCTA kheeluLine`) so per-page single-moment budgets hold. Lines: copy-reference.md R9.
- **Feelings re-map (no new art):** Sad card now uses the serene `bliss` render on Home AND /products/lumi (the scared pose read panic — it became the narrator's "I will act them out for you" bubble). Grumpy render verified correct (reviewer misread it). Kheelu named in every alt.
- **Typography soften:** Instrument Serif ONLY in human-voice quotes (team + parent quotes). `Eyebrow` = 13px bold caps sans kicker in **orange-ink #b54a0d** — NEW guarded token (globals @theme + three/tokens.ts + check-tokens SITE_MAP, 17 mappings): 13px normal-size text needs 4.5:1 on EVERY wash (white 5.3 / cream 5.0 / cool 4.8 / sun 4.8); orange-cta only clears white (LH caught it on /products/lumi's cream hero). Accent leads (10-languages line, why-we-exist lead, safety-callout lead, playos "in one prompt", lumi app lead) = display font.
- **HowItWorks band** (`home/HowItWorks.tsx`, cool wash, after the feature grid, outside the Beat map): 4 step cards from `lib/setup-steps.ts` (shared with /setup — extracted so the sequences can never drift), link to /setup. B2B "Building on PlayOS?" line removed from the feature-grid footer (partner link lives in the footer only).
- **RecognitionStrip:** uniform h-14 cards / h-8 logos on one baseline; `safetyLine` prop (Home only) renders the four published safety proofs + /safety link under the badges.
- **Reserve anchor law enforced:** /privacy and /terms now mount `FinaleCTA variant="compact"` — the nav CTA anchors to #reserve, which was dead on those two routes.
- **Rhythm trims** (reviewer: near-blank viewports): StagedIntro pb-28→pb-20, WhyWeExist py-24→py-20, MeetLumi + Compare shorter tails.
- Legacy `ParentVoices.tsx` deleted (superseded by ParentQuotes in R7).
- Rollback flag: tag `r7-live-2026-07-10` on origin (pre-R9 live state).

### 8.18 R10: click reliability, Ria, stable ambient, hero fold (2026-07-11)

- **HARD RULE (new): tilt never wraps a whole-card link.** Root cause of the founder's intermittent story clicks: TiltContent springs rotateX/Y under the cursor, mousedown/mouseup element mismatch → dropped click, worst at edges. TiltCard removed from stories listing, Journal cards, MeetLumi SKU cards (hover-lift stays); rule documented in `ui/TiltCard.tsx`.
- **Team: Ria Mangala Rewari** (Head of Marketing · The voice · purple family) between Kashyap and Apoorva; photo founder-supplied transparent PNG (square-cropped 480px, `public/team/ria.png`); bio facts from her published profile; quote drafted from her own published clarity line (Ria sign-off flagged in FOUNDER-TODO). Manifesto + card heading now "a brain, a body, a business, and a voice"; meta description updated. All four LinkedIn URLs founder-confirmed.
- **Ambient stabilized** (founder: shapes "show up then go away"): the old fixed lateral offset (3.1–5.6) put NEAR shapes outside the frustum and FAR shapes inside the copy column (projection shrinks with depth) — lateral offset now scales with distance (`x = side·dist·(0.367+r1·0.102)`), landing every shape in the ~0.72–0.92 NDC margin band on 16:9; narrower windows push them outward (safe). Ghost ramp asymmetric (dim slowly λ3.2, recover λ6); every shape eases in from opacity 0 so the post-idle mount never pops. Densities unchanged — margin-lane correction alone raises visible presence. Journey retune note: dormant ShapeField shares this layout.
- **StagedIntro retired (founder pick: fold into hero)**: its three sentences continue the PDF hero paragraph inside the hero as a muted paragraph (lines 1+2 joined with a comma — sanctioned deviation, copy-reference). `<Beat id="intro">` removed; LaunchVideo gains `CurveDivider from="white" flip` (KheeluIntro white now precedes it).

### 8.19 R11: conversation hero, PlayOS platform page, consistency law (2026-07-11)

Founder round (one question batch: hero = "show the conversation", PlayOS = platform story without pricing, voice path moves to Meet Lumi, Voice SLM as a short note). Commits `7e4221b` + LCP fixes `9d0c2e5`/`9a62b59`.

- **Hero conversation device**: the hero DEMONSTRATES Lumi — plush + the moon exchange (reused verbatim from /products/lumi, Lumi's reply trimmed one sentence) in `home/HeroConversation.tsx`. Pure-CSS choreography (`.convo-*` in globals.css): SSR text, zero hydration next to the LCP. Left column = badge + PDF H1 + Reserve + one-line cap (CAP_LINE). The PDF lede is the demo's caption; the R10 folded paragraph lives in WhyWeExist.
- **LCP law (re-learned live)**: the hero's LARGEST element must be the priority plush image. Two live regressions caught by the mobile ×5 gate: (1) an opacity entrance on the conversation card made IT the mobile LCP (3.8s) → the choreography is gated `(prefers-reduced-motion: no-preference) and (min-width: 768px)`; (2) at 300px the plush tied the font-gated H1 for area → 340px mobile restores a ~30% margin. Any future hero change re-checks this before shipping.
- **PlayOS platform page** (nav tab now says PlayOS): flow mirrors founder-published kheelona.ai/playos in parent voice — hero "One soul. Many bodies." → family with real renders (lumi-blue + lori/lua/robu from the .ai repo, `public/products/`) → Magic Box module (real exploded photo) → platform parent app (3 PhoneFrame screens + 5 features + one-prompt band with the published example) → 6-step voice path → under the hood → six safety layers → privacy → "The brain keeps growing" (Voice SLM, parent-framed, no dates/API) → partners pointer to kheelona.ai. NO per-unit pricing, NO partnership CTAs on .com (founder decision). The old 4-step "path of one sentence" lives on /products/lumi directly under the conversation demo.
- **Component registry law (the R11 consistency refactor)**: new sections MUST use the shared molecules — `ui/SectionHeading` (eyebrow+title+lede trio; hero/section/minor scales), `ui/Card` (token card shell; `tilt={false}` for link-holding cards), `ui/StepList` (numbered border rows; `as="h2"` when steps sit under the h1), `ui/PageHero` (interior split hero), `ui/CheckList`, `ui/LegalDoc` (privacy/terms renderer). Hand-rolling one of these shapes is a review flag. Two sanctioned hand-rolled one-offs: KheeluIntro's greeting scale, WhyWeExist's editorial spread.
- **Copy/price constants law**: `lib/site.ts` owns LAUNCH_PRICE, LATER_PRICE, RESERVE_LABEL, RESERVE_LABEL_SHORT, PRICE_CAPTION, CAP_LINE. Visible rupee values and reserve labels import them; a price change is a one-file edit (metadata/FAQ/JSON-LD strings may stay literal).
- **Type scale (documented)**: display = SectionHeading's three clamps (+ home-hero 40..64); body 17 (prose) / 16 (card+step bodies) / 15 (captions, compact cards) / 13 (kickers + meta labels) / 12 (micro chips). Half-pixel sizes are retired.
- **Focus + targets**: the brand focus ring (`focus-visible:ring-2 ring-orange` + offset on light surfaces) rides Button, nav/footer links, and inline text links; nav/footer links carry vertical padding for the 24px target-size floor.
- **Audit dispositions**: seam fixed on lumi (`ParentQuotes from="white"`); two .ai-verbatim body contractions de-contracted (voice gate outranks the reference; founder can revert — FOUNDER-TODO); orange-deep links on tinted washes → orange-ink; KheeluSays bubble on the token radius; FinaleCTA moved to `sections/shared/`.

### 8.20 REVAMP 2026-07-24: theme B "Kheelu's Tour" + QA/launch strategy (founder brief)

The whole site re-themes onto wireframe direction B per the founder brief
(`Websit prompt based on B + inputs - 24-Jul.pdf`). Live status, locked decisions (colour/hero/
copy/fonts answers), architecture, and restart guide: **`docs/revamp-2026-07/WORKING.md`** — that
file leads while the revamp runs; this section records the QA/launch-readiness strategy, planned
BEFORE build as the brief requires. Where §8.12–8.19 conflict with the revamp (washes/dividers,
serif quotes, KheeluSays-per-section, StickyMobileCTA, ambient canvas), the revamp supersedes;
surviving laws are restated below.

**Laws that carry over unchanged**: voice-lint (zero em-dashes, no italics, exact names, Kheelu
bubble contraction exemption); never-invent-claims (`TODO(claims-*)` placeholders only); tilt
never wraps whole-card links; hero's LARGEST element = the priority product/hero image (mobile
LCP; hero motion desktop-gated + motion-ok); every page ends `FinaleCTA` id="reserve"; one CTA
verb; prices/CTA labels from `config/site`; registry molecules for new sections; every component
ships story + test; token lint gates the build; structural moves = zero user-facing change.

**QA plan (per milestone M1–M5, branch `revamp/kheelu-tour`)**
1. Every milestone: `npm test` green, `npm run build` green (includes token lint), new/changed
   components have colocated story + test, affected routes render on a local prod server.
2. New interactive surfaces get an explicit a11y pass when built, not at the end: KheeluGuide
   (exactly one tab stop; no live regions; hidden no-JS; reduced-motion static), FeelingsGallery
   dialog (focus trap/restore, Esc, Title/Description, ≥44px close, body scroll unlock verified
   against the `overflow-x: clip` footgun), ColorwayPicker (radiogroup + roving arrows), orbit
   (static grid fallback, DOM order = reading order).
3. Voice-lint sweep per milestone: em-dash/italic grep + names + contractions outside Kheelu
   lines; Kheelu `data-say`/poke lines ship only founder-approved (queue in WORKING.md).
4. CLS discipline: reveals transform/opacity only, below-fold rooms only for directional
   variants; orbit reserves height (aspect-ratio); hero content never opacity-hidden.
5. Full pass at M5: Lighthouse **100 A11y/BP/SEO on every route, both form factors; Perf ≥95
   desktop, ≥90 mobile** — mobile judged on devtools-throttled runs (×3–5 median), simulate
   recorded alongside (known lantern artifact, qa-report R11); full internal-href crawl 200s +
   #reserve anchor present everywhere; JSON-LD valid; sitemap/robots/OG intact; SSR/no-JS render
   check (all copy readable, guide absent, reveals visible); axe clean on all 10 routes.
6. Regression safety: tag master pre-merge (`pre-revamp-2026-07`); founder previews after Home
   (M2) and Home+Lumi (M3) on the demo-website Vercel pattern before the remaining routes build.

**M4 record (2026-07-25) — shared parts the interior routes added to the registry.** All 8
interior routes now run the room grammar, so these join §8.19's law:
- `templates/PageHero` IS the theme-B hero shell: it renders its own `<section>` on the
  SiteBackdrop (no wash, no divider), at RoomsTrack width so hero and room copy share one left
  edge, and takes `guide`/`say` like `Room`. New interior heroes use it; hand-rolling the grid
  is a review flag. Its media rides `Reveal mode="rise"` only (never opacity — hero LCP law).
- `molecules/AnswerBlock` owns the AEO pattern: a question-led H2/H3 plus a 40–60 word VISIBLE
  answer, composed from `SectionHeading` so the type scale stays in one place. FAQPage schema
  may only ever mirror these visible answers. The accordion `Faq` keeps the long lists, and a
  question must not appear in both places on one page.
- `SectionHeading` gained a fourth step, `nested` (clamp 21–26px), the default for `as="h3"`, so
  a nested question cannot compete with the room heading above it. Mirrored into
  `Design/design-system/colors_and_type.css` as a WEB NOTE (single-source mandate).
- `organisms/FamilyGrid` is the one companion lineup (Home + /playos previously duplicated it).
- `RevealObserver` re-arms on `usePathname()`. It sits in the persistent layout, so a mount-only
  effect left every client-navigated route's rooms stuck at `opacity: 0` — the same class of bug
  as the StickyMobileCTA lesson. Any future observer mounted in the layout must do the same.
- Every route ends `FinaleCTA bare variant="compact"` inside `Room fill="orange" id="reserve"`,
  including `not-found` (the navbar CTA is `#reserve`, so the 404 had a dead anchor before M4).

**M4-b mobile pass (2026-07-25) — two hard rules the revamp added.**
- **Never animate X on an element that spans the track width.** A room is full-bleed inside the
  track, so a ±46px X translate puts its box past a phone's screen edge, and mobile Chrome
  responds by widening the LAYOUT viewport. Every `position: fixed` element then sizes to that
  wider viewport, so the guide dock overhangs and its CTA falls off-screen, and the page pans.
  Sideways reveals are gated to ≥960px because RoomsTrack's `clamp(20px, 5vw, 64px)` gutter only
  absorbs 46px of travel at ~920px wide. Vertical settle below that.
- **Base-level element rules belong in `@layer base`.** Unlayered CSS outranks every Tailwind
  utility regardless of specificity. `p { text-wrap: pretty }` sat unlayered and silently beat
  `truncate` on the guide dock (text-wrap is a longhand of the white-space group), so the fixed
  bar ran to three lines. Utilities must be able to win.
- Corollary for narrow rooms: a room's content box is ~290px on a 390px phone, so any fixed-px
  child needs `max-w-full` AND `min-w-0` on its grid/flex item (max-width caps the used width,
  not the min-content contributed to track sizing), and long pill labels need
  `max-sm:whitespace-normal`. Wide data (the compare table) gets a stacked view below `sm` rather
  than a sideways scroll — one data source, two views, a test that they agree.


### 8.21 V3 CONTENT REPOSITIONING (2026-07-27/28, founder's YC application)

The founder shared the YC application, which reveals the company's real positioning, and directed
a content rewrite for one goal: **pre-bookings**. Mix: **40% fun, 20% brain development, 40%
education**, with the companion story still leading. Built spec:
**`docs/revamp-2026-07/BUILD-V3.md`** (it WINS over `copy-v2.md` and any older copy law).
Research: `docs/revamp-2026-07/benchmarks-v3.md` (7 reference sites + a 12-point winning-criteria
checklist, plus an Apple-tier pass). QA: `docs/qa-report.md` "V3".

**Locked founder decisions (do not re-ask)**: India-first, ₹4,999 first-500 / ₹9,999 after ·
Lumi ages **2 to 5**, platform arc **2 to 14** (the 3-to-10 law is RETIRED everywhere) · the .com
lineup is the pipeline **Lumi → Kheelu Speaker → AI books** (Lori/Lua/Robu live on kheelona.ai
only) · **Kheelona+** may only ever be described as "6 months included, monthly price announced
before launch" — no ₹ amount, no post-lapse claim · the mascot lends his name to the product line
(Kheelu Speaker, Kheelu mode) · no pilot-count claims of any kind · testimonials are three NAMED
placeholders until real quotes land · /team keeps four people.

**New laws this round adds to §8.19's registry**
- Registry molecules are now: `SectionHeading` · `Card` · `StepList` · `PageHero` · `CheckList` ·
  `LegalDoc` · `AnswerBlock` (question-led H2/H3 + a visible 40–60 word answer, M4) ·
  `FootnotesRow`/`Footnote` (small print for claims that invite a follow-up, V3) ·
  `KheelonaPlusBand` (the ONLY place subscription wording renders, V3) · `FamilyGrid` (the one
  pipeline lineup, shared by Home and /playos) · `LumiModes` (the three modes, shared by Home
  and /products/lumi). Hand-rolling any of these shapes is a review flag.
- **The three modes are the answer to "what does it do"** (founder, 2026-07-28): AI mode
  (conversation), Kheelu mode (stories that quiz back), Bluetooth mode (pair a phone, Lumi is
  the speaker). The parent verb is the heading, the product term is the label under it, so a
  small "AI mode" label never leads. Each fact is stated ONCE — Bluetooth left the
  what-it-does grid when it gained a mode card. **Bluetooth is a MODE, never what a family is
  left with if Kheelona+ lapses**: that is a post-lapse claim and V3-b still gates it.
- **Age copy renders from `config/site` constants** (`LUMI_AGES`, `PLATFORM_AGES`). A hardcoded
  age band is a bug; the final QA greps for one.
- **Subscription copy renders from `KHEELONA_PLUS_LINE`**, so a price cannot creep in via a call
  site. A test asserts the band never grows a ₹ amount and never claims post-lapse behaviour.
- **Every room on a conversion page owns one visual anchor** (the Apple-tier visual rule). One
  type-only moment per page is sanctioned; a second is a review flag.
- **LCP + reveals, generalised (V3 QA finding)**: a route with a **copy-only hero** has no priority
  image to win LCP, so its FIRST room owns the LCP and must ship `reveal="none"`. A directional
  reveal holds it at `opacity: 0` until hydration — that measured a 4.3s LCP and Lighthouse 85 on
  /stories mobile before the fix. Routes with a media hero are immune.
- **axe caveat for future sweeps**: axe skips `opacity: 0` subtrees, so a reveal-heavy page
  under-reports. Treat a clean axe run on an unrevealed page as unproven.
- **Never invent, extended**: no invented telemetry in a parent-dashboard mock (a filled-in
  dashboard reads as real data from a product that has not shipped — the pattern independent
  testers called misleading about a competitor), no "first in India" style superlative, and no
  third-party logo in a trust row without a documented relationship (one founder's employment
  history is not an institutional endorsement).

**SEO/AEO/GEO laws (V3 pass, 2026-07-28)**
- **All structured data comes from `lib/seo.ts`**, emitted as ONE `@graph` per page with the
  Organization and WebSite nodes attached by `@id`. Never hand-roll a JSON-LD island in a page file:
  the point is that every page contributes to one company entity.
- **Schema may only describe copy visible on the same page.** A FAQPage entry whose question is not
  in the DOM is spam to Google and a lie to a parent. `lib/seo.test.ts` guards the gated facts;
  visibility is verified in the QA sweep.
- **The founders are entities.** Their published credentials (14 patents filed, Thunderbolt 4/5
  compliance at Intel, CA with fifteen years) are the site's strongest E-E-A-T signal. Keep them
  in the Organization node and keep them accurate.
- **Titles carry the keyword, the visible hero carries the voice.** The Home title says "screen-free
  AI toy" because that is the search term; the H1 does not lead with AI because that is the voice
  rule. Both can be true at once, and a rewrite that drops the keyword from metadata is a
  regression (it happened once, on 2026-07-28, and was caught in the same session).
- **India is stated, not implied**: `addressCountry` IN, `areaServed`/`eligibleRegion` India,
  `inLanguage`/`lang` en-IN, `og:locale` en_IN.
- **Machine-readable files restate visible copy only**: `/llms.txt` and `/pricing.md` read prices
  from `config/site` and mark every gated item unannounced. An agent that cannot parse the price
  filters us out of AI-mediated buying, which is why `/pricing.md` exists.

**AEO plumbing (V3)**: `/llms.txt` route (visible-copy facts only, gated items marked
unannounced, prices from `config/site`), robots rules naming GPTBot/OAI-SearchBot/ChatGPT-User/
PerplexityBot/Perplexity-User/ClaudeBot/Claude-User/Claude-SearchBot/Google-Extended/
Applebot-Extended/CCBot, and one honest journal freshness signal ("Reviewed July 2026" +
`dateModified` at month precision — NOT per-article dates, which we do not have).

**Cleanup completed here (the old M5)**: the 15 retired components deleted with their tests and
stories, after stripping the dormant `KheeluSays`/`CurveDivider` call sites from six live
components; `teal-deep` and the teal wash removed (token-check 17). `features/ambient-stage/`
remains DORMANT and must not be deleted.

**Verified at completion**: tests 215/215, tsc clean, build green; axe zero violations on 10
routes × 2 viewports; Lighthouse A11y/BP/SEO **100 on all 18 runs**, Perf 99–100 (mobile judged
on devtools throttling); mobile overflow clean 320–430px; 23-href crawl 200s; `#reserve`
everywhere including the 404; all JSON-LD parses and mirrors visible copy only.

**Launch readiness (unchanged gates + revamp deltas)**: S14/§8.11 checklist still applies —
Tally URL + GA4 ID + Vercel/DNS + claims remain founder-gated (FOUNDER-TODO). Revamp deltas
before merge to master: founder sign-off on the full v1 preview; hero final art ingested (or
founder explicitly ships interim); the 3 app images requested only AFTER v1 deploy (brief
pointer 9); `Design/design-system/` updated with the new recipes (single-source-of-truth
mandate); docs current (this file, WORKING.md, copy-reference, project-state, qa-report).


**8.21-a THE APP LIVES AT THE REPO ROOT (2026-07-28, deploy law).** Vercel resolves a project's
framework from its Root Directory. The app sat in `site/` while that setting pointed at the repo
root, so every build failed with "No Next.js version detected" and nothing was ever live. The app
moved up: `package.json`, `next.config.ts`, `src/`, `public/`, `test/`, `.storybook/`, both
tsconfigs. Three path assumptions broke and are now fixed — the build script reached
`../tools/tokens/check-tokens.mjs` (outside the repo), the root `tsconfig.json` swept in
`launch-video/` (a separate Remotion project with uninstalled deps, so `tsc` failed on phantom
modules), and `.storybook` could not resolve `@/` (latent since the revamp: `next build` and
Vitest each resolve that alias their own way, Storybook never did). **Translating older docs: drop
the leading `site/`.** `docs/standards/STRUCTURE-MAP.md` carries the same rule.

**8.21-b A REDIRECT SOURCE MUST NEVER SHADOW A `public/` DIRECTORY (2026-07-28, hard rule).**
Next matches redirects BEFORE it serves `public/` files. The legacy Wix 301 `/product/:slug*`
therefore 308'd our own plush renders in `public/product/` to the product page, and the image
optimizer answered **400 for every product image** — the live preview was serving a blank home
hero, which is the mobile LCP element. Fix: `/product/:slug([^.]+)`, which cannot match a
filename (legacy slugs never contain a dot; asset filenames always do) while still redirecting
slugs, including multi-segment ones. `test/redirects-vs-assets.test.ts` cross-checks every
redirect source against every `public/` directory and fails on exactly this shape; it was verified
by reintroducing the bug. Adding a redirect whose first segment names an asset directory is a
review flag.

**8.21-c WEB ANALYTICS (2026-07-28, founder request).** `<Analytics />` from
`@vercel/analytics/next` is mounted as the **last element in the body** of `src/app/layout.tsx`.
Placement is deliberate: it injects its script client-side via an effect, and the body tail keeps
it behind the hero image, which owns mobile LCP (§8.19). It takes no env var and reports only from
a Vercel deployment with Web Analytics enabled; locally the injected
`/_vercel/insights/script.js` 404s, which is expected and harmless (Vercel serves that path at the
edge). Verified in Chrome: the script element is injected `defer async`, `window.va` is a function,
one pageview queued, hero image still loads.

**GA4 followed the same day** (founder chose manual over Tag Manager): `GoogleAnalyticsGate`
(`molecules/`) renders `<GoogleAnalytics>` from `@next/third-parties/google`, which is the approach
this Next version's own docs prescribe and which emits the same `gtag('config', ...)` as Google's
copy-paste snippet while loading after hydration instead of blocking in `<head>`. GTM was rejected
on the reason Google's dialog itself gives: it ships a container runtime several times gtag's size
to manage multi-team tag sprawl this repo does not have.

**8.21-c-i THE GA4 HOST GATE IS THE LAW HERE.** `GA4_MEASUREMENT_ID` is hardcoded in
`config/site.ts` on purpose (a measurement ID is a public client-side identifier, and the env var it
replaced was never read by anything, so keeping it meant a founder gate for no security gain). What
makes that safe is `GA4_HOSTS`: the tag fires only on `kheelona.com` and `www.kheelona.com`, so
localhost runs and preview deploys can never pollute the property. Rules:
- The host check runs in an **effect**, never during render. Reading `location` while rendering would
  force the whole site dynamic and lose 31 static pages, or mismatch on hydration. Verified after
  the change: every route still builds ○ static or ● SSG.
- **Add to `GA4_HOSTS` only for a real production domain.** `GoogleAnalyticsGate.test.tsx` asserts
  that no `vercel.app`, `localhost` or `127.0.0.1` entry is in that list, and that localhost, preview
  hosts, `kheelona.ai` and lookalikes like `kheelona.com.evil.example` all stay closed.
- Consequence to state, not discover: **GA4 reports nothing until DNS points at Vercel**, because the
  preview host is deliberately excluded.
- Proven end to end by temporarily allowing localhost and checking in Chrome: script loaded with
  `id=G-7LMKSFEXZ9`, `window.gtag` a function, `config G-7LMKSFEXZ9` in the dataLayer, `_ga` cookie
  set, hero image still loading. Reverted, and the guard test fails when the allowance is present.

**8.21-c-ii AHREFS WEB ANALYTICS (2026-07-30, founder request) — and why it is NOT host-gated.**
The tag is a raw `<script async>` in the root layout's `<head>`, so it appears in the SSR HTML of
every route. That is deliberate and it breaks the pattern GA4 follows: **Ahrefs verifies an
installation by fetching the page and looking for the tag**, so the deferred, client-side, host-gated
approach would leave it out of the HTML source and "Recheck installation" would keep failing. The
price is that localhost and preview page views reach the property. Accepted knowingly; if that noise
ever matters, move it to the `GA4_HOSTS` pattern and re-verify by another method. `async` keeps it
off the parser's critical path, so the hero image still owns LCP (§8.19).

Cookie behaviour was **observed, not quoted from the vendor**: on a clean load with the stale GA
cookies wiped, Ahrefs set no cookies, no localStorage and no sessionStorage. That is what licences
the sentence on /privacy. Never publish a vendor's privacy claim you have not watched happen.

Three tools now run: Vercel Web Analytics, Ahrefs, GA4. `test/analytics-tags.test.ts` guards the
pairing — it fails if a tag is added or removed without the privacy page changing to match.

Two consequences that are law, not preference:
1. **The privacy page has to say so, in the same commit.** /privacy promises plain words about what
   is collected. It names both tools, says which one sets cookies (GA4 does, Vercel's does not — the
   `_ga` cookie was observed, not assumed), states that neither sees anything typed into the
   reservation form because that form is a Tally iframe, and tells a reader how to opt out by
   blocking them. Any future measurement tool lands in that section as part of wiring it, never after.
2. **No consent gate ships today, and that is a decision, not an oversight.** GA4 sets cookies. The
   site is India-first with no cookie banner anywhere, and adding one is new UI that the founder has
   not asked for. Consent Mode without a banner is theatre: it either denies everything (measuring
   nothing) or grants everything (identical to no gate). So the honest position is disclosure on
   /privacy plus a documented opt-out, with a banner as an open founder decision. Counsel review of
   /privacy, already a launch gate, now has to cover the GA4 paragraph.

### 8.22 V4 TEAM-FEEDBACK ROUND (2026-07-30, spec BUILD-V4.md — every law here is founder-decided)

**8.22-a THE ACTION COLOUR IS BRAND ORANGE WITH INK LABELS (D1, supersedes R5's white-label law).**
**⚠ SUPERSEDED BY §8.29 ON 2026-08-24 — the labels are WHITE again. Kept as the record of what was
traded away, and of the arithmetic, which has not changed.** `--color-action` points at
`--color-orange` (#EF762F) and every label on it is `text-ink-head` (measured 5.9:1). White on
#EF762F is 2.9:1 and fails WCAG at every size, so **no live surface may put white text on the action
fill** — that includes buttons, the nav pill, the guide dock chip, and CompareTable's brand column.
The white keyline on buttons retired with the white labels (**that half of D1 survives §8.29**).
`orange-cta` (#C25210) stays DEFINED for the dormant 3D-scene CSS and ambient mirrors but has zero
live usages.

**8.22-b THE FINALE IS A WHITE ROOM ON EVERY ROUTE (D5).** The orange Room fill and Section wash are
retired; `id="reserve"` and the every-page-ends-with-FinaleCTA contract are unchanged. The plush
lineup left the finale — the form is the moment. Small print sits in ink-muted on white.

**8.22-c /PLAYOS SPEAKS TO INVESTORS (D6, supersedes the R11 parent-voice-only law).** Vision, moat,
and stack depth first; parents get a compact bridge room. Still no per-unit pricing there, and
kheelona.ai stays the only partner CTA. Architecture labels come ONLY from the team's published
diagram (docs/revamp-2026-07/team-feedback-2026-07-30.pdf p6) — with the one recorded deviation that
its "Age 3+" chip renders from `LUMI_AGES`.

**8.22-d KHEELU SAY LINES ARE ≤ 48 CHARACTERS (§5.1).** The guide now lives bottom-RIGHT (the team's
overlap finding: room copy is left-aligned) and shrinks below 1320px; the narrower bubble caps every
`data-say` line at 48 characters so it never wraps past two lines. All existing lines were shortened
in place and rejoin the sign-off queue.

**8.22-e QUOTED TOY SPEECH IN AUDIO TRANSCRIPTS carries the same exemption as ChatDemo**: the
exclamation marks and contractions inside `lib/audio-moments.ts` transcripts are sanctioned because
the text is exactly what the audio says (two punctuation-only edits recorded in BUILD-V4 D8). The
voice-lint QA allowlist covers them explicitly.

**8.22-f A MISSING AUDIO FILE MUST FOLD TO TRANSCRIPT-ONLY.** Learned live: a 404'd mp3 can hang at
`NETWORK_LOADING` forever without firing `error`, leaving a phantom playing state. `AudioMoments`
therefore treats "no data after 4s" as broken (cleared by `onPlaying`/`onLoadedData`), pauses the
element, and hides only the control — the transcript is the content, and it never disappears.
`preload="none"` is law (mobile data), and one voice plays at a time.

**8.22-g TWO NO-SHRINK LABELS IN ONE FLEX ROW ARE A VIEWPORT WIDENER** (the M4-b class, caught again
by the V4 probe: the ArchitectureStack waterline forced /playos to 439px on a 320px screen). Any row
of fixed-width text fragments must stack below `sm`. The V4 QA probe (iframe at 320/390 measuring
`scrollWidth`) is the cheap tripwire; run it on every layout change.

**8.22-h REGISTRY ADDITIONS**: `AudioMoments` (+ `lib/audio-moments.ts`, one data source for Home and
/products/lumi), `HowItWorksLoop` (zero-JS CSS cycle — the walking glow is an opacity-only overlay),
`ArchitectureStack` (composed on the same vendored Radix accordion as Faq; hover lifts, only tap
opens). Retired with their rooms: `Statement`, `LaunchVideo` (component only — the film files stay in
public/video/), `LearningRoom`, `BrainRoom`. The Home VideoObject left the JSON-LD with the film (D7).


### 8.23 V5 DESIGN/UX REVIEW ROUND (2026-07-31) — the end-to-end pass

Spec + evidence: `docs/revamp-2026-07/BUILD-V5.md`. Method note worth keeping: the Chrome extension's
window is locked ~390px and its tab runs hidden, which freezes reveals and defers painting, so this
review ran through a headless harness at exact viewports with reveals forced. **Any future visual
review should do the same** — screenshots of a hidden tab are not evidence.

**8.23-1 EVERY TAPPABLE SURFACE ANSWERS TOUCH.** New interactive surfaces compose `PRESS`,
`PRESS_LIFT`, `PRESS_TINT` or `LIFT_WHEN_CLOSED` from `src/lib/interactions.ts`. Hand-rolled
hover/active classes are a review flag (`test/interactions.test.ts` enforces it). The review that
produced this found **two** `active:` states in the whole codebase and four different hover
treatments across four card types, one with a hardcoded shadow — while `TiltCard`, the only card
interaction, renders a plain div on touch. Hover coverage read 19 · 6 · 3 · 0 · 0 · 0 across routes.
A hover-only affordance is incomplete by definition: the primary customer is on a phone.
COROLLARY: a card that does nothing when tapped must NOT get press feedback. Faking an affordance is
worse than having none — so static informational cards keep tilt (desktop depth) and nothing else.

**8.23-2 AN EMBEDDED FORM'S HEIGHT IS MEASURED WHERE IT SHIPS, AND RE-MEASURED WHEN ITS FIELDS
CHANGE.** Two traps, both hit on this component. (a) Measuring the form's own URL standalone reports
~721px because it renders in a 700px centred layout; inside our ~680px iframe the same form is
609px. Measure inside the real iframe (`scratchpad/iframe-measure.mjs`). (b) `documentElement.
scrollHeight` just reports the viewport the iframe was given — read the submit button's
`getBoundingClientRect().bottom` instead. That mistake is how a flat 900px got set and left 191px of
dead white on desktop, 93px on mobile, with the vendor badge floating in it. **Mobile needs the
TALLER frame** (730 vs 690): a narrow iframe wraps labels onto more lines, so the narrow form is the
tall one. The guard test brackets both sides — too short hides Submit, too tall looks unbuilt.

**8.23-3 A BRAND MARK NEEDS A JOB.** The four blob shapes mean "this card is a promise", rendered
through `molecules/PromiseMark` (fixed positional rotation, 0.22 opacity, 36px). They appear on
Home's trust room, /safety's data-custody promises, /playos's moat, and the reserve reassurances —
and nowhere else. Using them as background texture is a review flag: the calm law and the founder's
"keep it clean" both refuse decoration without a job.

**8.23-4 ONE IDEA, ONE STATEMENT, PER PAGE.** If a fact appears in an answer block, it does not also
become a card row and then a display line. /safety stated one promise FOUR times in a single fold
(85-word answer, four numbered steps, four label cards, closing display line) — and the steps
duplicated the previous section's cards nearly verbatim, "Not muted. Off." included. The
mechanisms live in one row, the data-custody facts in another, each said once.

**8.23-5 THE SAME CHARACTER NEVER APPEARS TWICE AT ILLUSTRATION SCALE IN ONE VIEWPORT.** REV-a's
final hero art contains Kheelu, so the persistent corner guide put him on screen twice on first
impression. The desktop guide now waits out any hero carrying `[data-hero-has-kheelu]` and fades in
after. Scope is deliberate: a 46px avatar inside the mobile dock is UI chrome, not a second
character, and the dock must keep its Reserve CTA.
ACCESSIBILITY COROLLARY, learned immediately: `aria-hidden` on a wrapper whose child is focusable is
a serious violation. Anything hidden this way also leaves the tab order.

**8.23-6 AXE IS BLIND TO UN-REVEALED ROOMS.** axe skips `opacity-0` subtrees, so every earlier sweep
on this site was structurally unable to see anything inside a room that had not revealed. Force
`.reveal-in` on all `[data-reveal]` before running it. Doing so immediately surfaced a real 13px
`text-ink-muted` contrast failure in `FootnotesRow` that three prior "zero violations" sweeps had
missed.

**8.23-7 MEASUREMENT DISCIPLINE, RE-CONFIRMED BY CONTROL.** Home's mobile LCP read 1.73s at the start
of this session and 2.31s at the end. A control build with the round's hero changes reverted measured
**2.31s** — identical. The delta was environment drift, not the change. When a perf number moves,
build the control before believing the story.

### 8.24 V6 GROWTH-ARC CONTENT ROUND (2026-07-31, spec BUILD-V6.md — founder-approved as written)

Spec + verbatim copy: `docs/revamp-2026-07/BUILD-V6.md` (its task-by-task plan `PLAN-V6.md` was deleted on 2026-08-23, fully executed; git history keeps it). The round exists
because parents who saw the live site asked "what will a kid who buys this at 2 GET at 5?" and the
site had no answer, and because the tutor hero confused readers. Chief-content-writer persona:
Joanna Wiebe / conversion method (customer language, benefit-led, objections answered head-on).

**8.24-1 AN OFFLINE CLAIM NAMES ITS MODE.** Founder-licensed fact (2026-07-31): open conversation
(AI mode) runs on home WiFi; Kheelu-mode stories and lessons and Bluetooth music work offline. No
surface may state a blanket "works offline" or "no internet needed" — the old flat "No" in the
internet FAQ was factually wrong and a post-purchase complaint in waiting. The precise admission
("For open conversation, yes…") is deliberately the FIRST clause: an honest yes converts better
than a broad claim a parent later catches. This also made the /playos "WiFi operated" chip
consistent instead of contradictory (inventory inconsistency #2, closed).

**8.24-2 THE OUTCOME ANSWER LIVES IN ONE PLACE AND DERIVES FROM `LUMI_AGES`.** The year-by-year
answer ("At 2 years" … "By 5 years", unit spelled out per the founder 2026-07-31) is data in `src/lib/growth-arc.ts`, rendered by `organisms/GrowthArc`
(Home room `id="growth"`) and echoed once, verbatim, after `/products/lumi`'s PacePanel. The band
endpoints parse from `LUMI_AGES` via `lumiAgeEndpoints()` — the hero H1, the arc eyebrow, the
kickers, and the PacePanel echo all render from it, and `growth-arc.test.ts` fails if the kickers
drift from the constant. Outcome claims in the arc trace to published facts plus the founder-licensed
SOFT school frame ("walks into their first classroom with them") — no skill guarantees, ever.
The old hero's tutor idea lives on in exactly four places (Compare's display line, PacePanel,
the arc's closing line, the Home metadata title); adding a fifth is a review flag.

**8.24-3 A REPEATED FACT REPEATS VERBATIM.** Three paraphrases of one price read like three offers.
Price/cap/hold facts render only from `CAP_LINE`, `PRICE_CAPTION`, and `PRICE_HOLD_LINE` (new);
the FinaleCTA lede is exactly `CAP_LINE + PRICE_HOLD_LINE`. `LANGUAGES_LINE` now DERIVES from
`LUMI_LANGUAGES` (one source; `test/config-copy.test.ts` guards both). Paraphrasing any of these
in new copy is a review flag.

**8.24-4 REGISTRY ADDITIONS.** `GrowthArc` joins the shared-organism registry (compose it, do not
hand-roll year-stage cards). Its cards are STATIC: tilt only, no press/lift (8.23-1 corollary).

**8.24-5 HARNESS NOTES (from re-building the §8.23 harness this round).** (a) Lazy images need
DWELL, not just scroll: a fast scroll pass loaded 8/19 story JPGs; ~400ms per 0.8-viewport step
loads all. (b) Await only VISIBLE images — lazy img tags inside display:none containers never fire
load/error and burn the whole decode cap; filter by checkVisibility(). (c) The Tally iframe NEVER
paints in the beyond-viewport region of full-page captures (Chromium behaviour for cross-origin
iframes) — judge the reserve form from an in-viewport clip, never from a full-page shot.
(d) Pages taller than ~16384 CSS px hit Chrome's texture cap; capture at a reduced
deviceScaleFactor so nothing clips. (e) **Axe needs a ~1.5s settle AFTER forcing reveals** — a run
fired mid-fade both invents failures and masks real ones; the settled re-run surfaced four REAL
pre-existing contrast failures on /products/lumi that every earlier "axe zero" sweep missed
(`text-blue` numerals at 2.68:1 and `text-ink-muted` at 4.31–4.37:1 on tinted washes — hence the
V6 rules: blue-ink is the numeral blue, and muted text does not sit on tinted washes). Harness:
session scratchpad `shot.mjs` + `axe-run.mjs` (§8.23 records the recipe if the scratchpad is gone).

**8.24-6 A DISCLOSURE'S CONTENT SHIPS IN THE MARKUP.** An accordion, FAQ or any collapse whose
closed panels are absent from the served HTML is a content bug, not a UI choice. `molecules/Faq`
was a Radix accordion rendering only the OPEN answer, so Home served eight questions and **one**
answer to every reader without JavaScript, AI crawlers included — and the FAQPage schema carried
all eight, which kept Google happy and hid the gap from three earlier QA sweeps. It is now the
browser's own `<details>`/`<summary>`: every answer is in the HTML, rows open with JS off,
exclusivity comes from the native `name` attribute, and the component ships zero client JS. The
question stays an `<h3>` inside the `<summary>` so the question-led outline the AEO work depends on
survives, and the summary keeps `PRESS_TINT` (§8.23-1). Height animation rides `::details-content`
behind an `@supports (interpolate-size: allow-keywords)` gate with `interpolate-size` scoped to the
disclosure rather than `:root`, so nothing else on the page gains keyword interpolation; where
unsupported the answer simply appears, which is also the reduced-motion state.
**Verification that actually catches this**: strip every `<script>` block from the served HTML
before counting answers — the JSON-LD will otherwise answer for the page and report a false pass.
EXCEPTION, deliberate: `ArchitectureStack` keeps the Radix accordion. Its rows are a layered
diagram where roving arrow keys earn the JavaScript, and its content is decorative chips rather
than prose an answer engine should quote.

**8.24-7 ONE KICKER LANGUAGE: SMALL UPPERCASE LABELS ARE `orange-ink`.** Every 12 to 13px uppercase
tracked label — section eyebrows, the growth-arc year markers, panel labels, chat-demo speaker
names — renders in `orange-ink` (#b54a0d, the only orange clearing 4.5:1 on every wash). Founder
call, 2026-07-31. It replaces the interim dark-ink fix applied when `ink-muted` was caught failing
contrast on tinted washes (4.31 to 4.37:1): dark ink passed but introduced a second visual language
for the same kind of label. `ink-muted` remains banned on any tinted wash at that size.

**8.24-7a THE NINE CALL SITES THAT ESCAPED IT (2026-08-12), AND THE TWO THAT WERE LIVE FAILURES.**
§8.24-7 was applied in V6 to the labels the round touched, and nine others kept `ink-muted`. Two of
them were failing WCAG AA on kheelona.com: the `RecognitionStrip` "Recognised by" label and the
kheelona.ai partner line, both on /playos's `cool` room at **4.37:1**. Four things to carry forward:

- **The axe route list is ALL 11 HTML ROUTES, not four.** V6's sweep covered `/`, `/products/lumi`,
  `/safety`, `/setup`. **`/playos` was never in it**, which is the whole reason a serious failure sat
  live through three "axe zero" rounds. A sweep that names its routes must name all of them.
- **`ink-muted` fails on `sun` too, not just `cool`.** Measured: white 4.81, cream 4.53, cool 4.37,
  sun 4.32. The earlier note said "tinted washes" without naming `sun`. `orange-ink` clears all four
  (5.32 / 5.01 / 4.83 / 4.77), which is exactly why it can be the one label colour.
- **A class-string guard is not enough on its own.** `RecognitionStrip` passed
  `color="text-ink-muted"` into `Eyebrow`, whose `text-[13px] … uppercase` cluster lives in
  `atoms/Eyebrow.tsx` — so the offending classes and the offending colour never appeared in the same
  string, and the obvious grep could not see the one site that was actually broken.
  `test/kicker-language.test.ts` therefore has **two** rules: className token sets, AND any
  `Eyebrow`/`eyebrowColor` handed `ink-muted`. Both were mutation-tested by reintroducing the real bug
  and watching them go red. `test/contrast-tokens.test.ts` holds the ratio matrix, reading the inks and
  `cream`/`cool` from `globals.css` and `sun` from `Room.tsx`'s `FILLS` map, because `sun` is a raw
  arbitrary value and `white` is not a token at all.
- **On a tinted wash there is no compliant *muted* ink.** The palette is ink / ink-head / ink-muted, so
  body copy that needs to sit quietly on `cool` or `sun` uses `ink` and gives up the de-emphasis. That
  is the V6 precedent from /products/lumi, applied again to /playos's partner line.

For the record on scope: this was reviewed by an independent development QA (which found both guard
designs above broken as first specified) and a marketing QA (verdict APPROVE, full scope: eyebrows are
already `orange-ink` site-wide, so the change makes nine stragglers match rather than introducing a
colour, and `orange-ink` small text cannot compete with the `action` CTA fill). **A text-colour change
has no SEO or AEO effect, and accessibility is not a direct Google ranking factor** — the reason to fix
it is that it is a real failure on a page parents read.

---

# §8.25 THE PRE-ORDER STORE (2026-08-22)

The site started charging money. That is the largest change since it went live, and it is bigger than
it looks: for a year "No payment now" was the central promise, urgency came entirely from "first 500
units", and the whole pre-order was a Tally iframe. This round retired all three and gave the repo its
first backend, first database, first secrets and first proxy.

Everything below is a law, not a note. Violating one is a review flag.

**8.25-a THE STORE IS A HOST REWRITE, NOT A SECOND APP.** `store.kheelona.com` is served by this repo:
`src/proxy.ts` (Next 16 renamed middleware to `proxy.ts`, see
`node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`) rewrites the store host onto
internal `/store/*` routes. The decisions live in `lib/store/host.ts` as a PURE FUNCTION so they are
unit tested rather than verified by deploying and clicking. Three rules the tests hold:
apex `/store/*` **308s to the store host** (one page, one URL); `store.kheelona.com/store/*` **404s**
(a doubled prefix must not quietly serve a real page from a third address); the matcher excludes
`/api`, `/_next` and any path containing a dot, because rewriting a file request breaks the assets the
store renders. A second repo was considered and rejected: the design system would have drifted from
the brand inside a month.

**8.25-b EVERY PRE-ORDER CTA REACHES THE STORE IN ONE TAP** (founder call, 2026-08-23; this REPLACES
the anchor-first law below, which held from 2026-08-22 to 2026-08-23). `PREORDER_HREF` is the absolute
store URL, so the navbar, the hero, Compare, the Kheelu dock and the finale all go to the same place
in one tap. `test/preorder-cta.test.ts` fails if any `href` points at `#reserve` again.

The law it replaces: the finale was the ONLY outbound link, and every other CTA anchored to `#reserve`
first, so a parent always read the price, the refund promise and the ship date before a payment form
could open. That reason was sound, and the reversal was accepted because **the store page carried all
three itself, above its own form** — a prose paragraph ("₹499 holds one at ₹4,999 ... refundable in
full until it does"), then `OrderSummary`. Measured on a 390px render before the change was accepted.

**⚠ THAT PARAGRAPH WAS REMOVED ON 2026-08-24 (founder decision), on `/store` and `/store/ideabaaz`
both.** This section quoted it by name, so the quotation above is history, not a description of the
page. One-tap CTAs are unchanged and still correct; what changed is WHERE the three facts are read:

| Fact | Where it lives now |
|---|---|
| The price | the `h1` ("Reserve Lumi for ₹499.") and `OrderSummary` |
| The refund promise | `PreorderForm`'s line directly under the submit button, and `OrderSummary` |
| The ship date | `OrderSummary` ONLY |

**The known cost, stated rather than discovered later.** `OrderSummary` is an `aside` that sits beside
the form on desktop but stacks BELOW it on a phone, so on mobile the ship date is now first read after
the form rather than before it. Above the form a phone shows the kicker, the price heading and the
plush. Nothing became untrue and no fact left the page — but **the store page is still the first thing
many parents read about the offer**, so this remains a conversion surface: a change to the `h1`,
`PreorderForm`'s reassurance line or `OrderSummary` is a conversion change, not a wording change.

`id="reserve"` stays on every page. It is layout, not a route: `LegalDoc` appends the finale, and the
mobile guide dock hides itself while that section is on screen.

**8.25-c MONEY HAS ONE SOURCE, IN PAISE.** Four integers in `config/site.ts`
(`LAUNCH_AMOUNT_PAISE`, `LATER_AMOUNT_PAISE`, `TOKEN_AMOUNT_PAISE`, and `BALANCE_AMOUNT_PAISE` which
is **derived**), and every rupee string comes from `formatInr`. Razorpay speaks paise integers, so
storing anything else means converting twice and rounding somewhere. `test/preorder-money.test.ts`
holds token + balance = price. This mattered less when nothing was charged: a disagreeing pair of
numbers was a copy bug, and is now a billing bug.

**8.25-c-i THE CLIENT NEVER SENDS A PRICE.** The request says which TIER; the server reads the amount
from its own table (`lib/store/tiers.ts`). A request carrying `amountPaise: 100` is charged ₹499, and
there is a test for exactly that in `create-order/route.test.ts`. Every other mistake in the payment
path can be corrected afterwards. A client-supplied price cannot be un-charged.

**8.25-d THE POLICY LAYER IS REQUIRED, AND /refund AND /shipping ARE REAL PAGES.** They were 301s to
`/terms` with a comment saying there was nothing to refund or ship because pre-orders took no payment.
That comment was true and is now the shape a payment gateway's review rejects. `test/policies.test.ts`
asserts the pages exist, are in the footer and the sitemap, and are **NOT** redirected: a future
tidy-up pass would otherwise see two legacy-looking entries in `next.config.ts` and "restore" them,
silently un-publishing the refund policy. The seller of record (`lib/legal.ts`: Kheelona Robotics
Private Limited, GSTIN, registered address, WhatsApp-only support) is ONE shared section rendered by
all four policy pages plus /contact plus the store footer plus both emails, and the guard fails any
page that hardcodes a copy of it.

**8.25-e THE DISCLOSURE LAW NOW COVERS PROCESSORS, NOT JUST TAGS.** §8.21-c said a measurement tool and
the sentence describing it ship in the same commit. Its reason is broader, so
`test/analytics-tags.test.ts` now also requires /privacy to name **Razorpay, Supabase, Resend and
Vercel**. They touch far more than a page view: a name, an email, a delivery address, a payment.

**8.25-f THE RETIRED PROMISES STAY RETIRED.** `test/preorder-copy.test.ts` scans every published file,
comments stripped, for "no payment", "first 500", "pay nothing" and "tally". It found three the manual
sweep missed, one of them a **hardcoded "1 September 2026"** in a Home FAQ answer that the
config-driven ship-date change could never have reached.

**8.25-g AN EVENT PRICE IS SIGNED, CAPPED AND DATED, AND NEEDS ALL THREE.** Signing stops anyone
minting a ₹99 link by guessing a slug. The cap and the expiry contain the leak signing cannot prevent,
because a printed QR code can be photographed and forwarded. The honest model is: unguessable, and
worthless once the event is over or the allocation is gone. Tier rows live in `event_tiers` so a booth
on Saturday needs a dashboard insert, not a Friday deploy. Runbook: `docs/preorder-events.md`;
generator: `npm run event-link -- <id>`.

**8.25-g-i A PUBLIC PARTNER PAGE MAY SIGN ITS OWN TIER, EYES OPEN** (founder, 2026-08-23; first use:
`/store/ideabaaz` for Ideabaaz Startup Fest). When a partner needs a URL people can hear on a stage
rather than scan, the route signs the tier server-side (`sign(secret, "event-link", id)`) and hands
the signature to the same form — the order path, §8.25-c-i and the amount-from-`event_tiers` rule are
untouched, and the page can only ever change sentences. What is deliberately given up is
unguessability: the page is exactly as public as a QR photographed into a group chat, which §8.25-g's
model already tolerates, so the containment must come from the OTHER two legs (expiry and/or cap,
plus the founder's manual close) and the decision to run capless is the founder's per event, not a
default. Such a page is never linked from the site, states the derived balance (the launch price
minus ITS token, so ₹99 honestly owes ₹4,900 — `balanceLabel`, threaded from the page, with the
receipt, thanks page and summary all deriving from the order row), and renders an honest ended state
in place of a refusal. Local QA of the live state needs `tools/qa/supabase-stub.mjs`, because a DUMMY
env can only ever show the not-open state.

**8.25-h VALIDATION IS ONE IMPLEMENTATION, RUN TWICE.** `features/preorder/lib/validate.ts` runs in the
browser as a courtesy and in the route handler as the only one that counts. Two implementations drift
until the form accepts what the server rejects with no explanation. The same rule covers lengths:
`CHILD_AGE_MAX` is named once and the route handler truncates at that number, because a form that
accepts 25 characters and a server that stores 20 is a server quietly editing a customer's answer.

**8.25-h-i THE CHILD'S AGE IS A BLANK, NOT A PICKER** (founder call, 2026-08-23). It was a six-option
dropdown ("Under 2" through "6 or older"). A parent whose child is two and a half, or who is buying
for two children, had no honest option to pick, and the picker cost a tap and a scroll on a phone for
a fact we read only when planning production. Validation is deliberately permissive, for the same
reason the email check is: the job is to notice an empty field, not to argue with how somebody writes
an age. "2.5", "nearly 4", "2 and 5" and "18 months" all pass, and there is a test naming each.

One consequence, and it is the reason this is a law and not a diff: **the field became free text that
we render into HTML.** `lib/email/templates.ts` now escapes every customer-typed value on the way into
the HTML half of both emails (name, age, address, the UTM blob) and leaves the plain-text half exactly
as typed. The audience is one parent plus us, so this is a correctness fix rather than a scripting one:
a bare `&` in "Sneha & Raj" is invalid HTML some clients mangle, and one `<` swallows the rest of a
receipt.

**8.25-i EMAIL TEMPLATES LIVE IN THE REPO, AND A FAILED EMAIL NEVER FAILS A PAYMENT.** Templates are
plain functions (`lib/email/templates.ts`) so the voice lint can read them, the prices are the same
constants the site renders, and a change to what we promise arrives as a reviewable diff. `sendEmail`
never throws: by the time it runs the money has moved and the row says so, and a 500 there would make
Razorpay retry a webhook for a payment recorded perfectly.

**8.25-j THE THROTTLE IS HONEST ABOUT WHAT IT IS.** In-memory, per serverless instance, defeatable by
anyone spread across cold starts. It exists for the ordinary case (a script or a stuck retry loop
filling the table) and it costs nothing. A real limiter needs shared state we have no reason to run
yet, and `rate-limit.ts` carries the note explaining that rather than implying more safety than it
has. Route tests must call `resetRateLimits()` in `beforeEach`, or a later test fails for the
previous test's reasons.

**8.25-k THE SUPABASE FREE TIER PAUSES AFTER A QUIET WEEK.** `/api/health` runs a trivial query that
touches Postgres, and a daily Vercel cron (`vercel.json`) hits it. Without that, the request that wakes
the project is a parent's first pre-order, and it fails while it wakes.

**8.25-l THE ROW IS WRITTEN BEFORE THE GATEWAY IS CALLED.** If the gateway then fails we hold a lead
with a working phone and email, which is exactly who to follow up. The other order leaves a Razorpay
order that can be paid with no local record of who paid it, which is the one failure here with no clean
recovery. Rows left at `status='created'` are the abandoned-payment list, and they are the reason the
form asks for contact details BEFORE the pay button.

**8.25-m THE WEBHOOK IS VERIFIED AGAINST THE RAW BODY, CLAIMS ITS EVENT ID, AND RELEASES THE CLAIM ON
FAILURE.** Re-serialising the parsed JSON changes the bytes, the HMAC stops matching, and the tempting
2am fix is to stop checking; handlers must read `await request.text()`. The event id in
`webhook_events` is the idempotency guard (its primary key makes a duplicate claim fail, and the retry
then returns 200 without emailing twice). If processing fails after claiming, the claim is DELETED and
the handler answers 500 so Razorpay retries: a swallowed failure there is a paid order nobody ever
hears about.

**8.25-n AN ADDRESS IS AUTHORISED BY A SIGNED TOKEN, AND ONLY THAT.** There are no accounts, so the
token bound to one order reference with an expiry is the whole authorisation. Wrong order, bad
signature and expired all return the SAME message, so a caller cannot learn which order references
exist. This is the one route where getting authorisation slightly wrong is a safety problem rather
than a billing one: it holds a family's home address.

**8.25-o FORM ATOMS: THE A11Y IS THE COMPONENT.** `atoms/Field.tsx` exists because the catalog had no
form until the store. Real `<label>` tied by id (placeholder-as-label is the most common way a form
becomes unusable), `aria-describedby` covering **both** hint and error, `aria-invalid` plus a written
sentence, and controls at 17px because **iOS Safari zooms the whole viewport when a focused input is
under 16px**, which mid-payment reads as the page breaking. There is no red in this palette and
inventing one is forbidden (§8.2), so errors use `orange-ink` and the wording carries the weight.

**8.25-p PAID IS DECIDED TWICE, ON PURPOSE, THROUGH ONE FUNCTION.** The browser callback confirms fast
(signature verified) so a parent sees "reserved" in the same second; the webhook confirms for certain,
because a browser can be closed or offline at the moment it matters. Both go through `markPaid`, whose
idempotency is a single Postgres statement (`.neq("status","paid")`), so whichever arrives second does
nothing and nobody is emailed twice.

**8.25-q THE CHECKOUT SCRIPT LOADS ON THE FIRST SUBMIT, NEVER ON PAGE LOAD.** Nobody who bounces should
pay for a payment library, and the standing LCP law is that the product image stays the largest and
earliest thing on the page.

**8.25-y A PAYMENT KEY IS NOT A PUBLIC IDENTIFIER.** This repo deliberately hardcodes three public
identifiers (GA4 measurement id, Ahrefs site key, and the retired Tally URL) with comments explaining
why that is safe. Those comments are correct and they are a precedent that must not be followed one
step further. `test/store-secrets.test.ts` asserts no secret is read through a `NEXT_PUBLIC_` name, no
secret is read outside `lib/store/env.ts`, no `"use client"` file reads one, and `.env.example`
documents every one with no values committed.

**8.25-z TWO KINDS OF PAGE MEANS TWO CHROMES, AND A ROUTE GROUP IS HOW.** Marketing chrome moved to
`components/templates/SiteChrome.tsx`, rendered by the `(site)` route group; the root layout keeps only
what both kinds share (the html element, the fonts, the three tags). **Found by looking at the page,
not by reasoning**: the first store screenshot had two headers, two footers, the mascot over a payment
form, and a navbar CTA pointing at `#reserve`, an anchor the store does not have. `SiteChrome` is a
component and not only a layout because a root-level `not-found.tsx` sits OUTSIDE the group and would
render with no chrome at all. A catch-all inside `/store` is also required: an unmatched store URL was
falling back to the ROOT not-found and serving the store's 404 in marketing chrome.

**8.25-aa THE STORE IS NOINDEX, AND ITS SEO SCORE IS SUPPOSED TO BE LOW.** Measured on the real server:
store **perf 100 / a11y 100 / best 96 / seo 66**, and the 66 is the noindex directive and nothing else.
The standing "SEO 90+ everywhere" gate does not apply to a checkout: an SEO score measures how findable
a page is, and this page must not be findable, or a thin transactional page competes with
/products/lumi. `/refund` and `/` measure 100 / 100 / 96 / 100 for comparison.

**8.25-bb MEASUREMENT: GREPPING HTML SOURCE FINDS STRINGS THAT ARE NOT ON THE PAGE.** A grep said the
store 404 still contained "Meet Lumi", which sent a chase after a bug that did not exist: the string was
in the RSC flight payload, not the DOM. Same trap as counting anything the JSON-LD also contains
(§8.24). Ask Chrome for `document.body.innerText` instead. Two more harness notes: **`localhost` does
not resolve in this headless Chrome** (use `127.0.0.1`, or `--host-resolver-rules` for a named host),
and **Lighthouse hits an HSTS interstitial on `kheelona.com`** because the real domain is HSTS, so use
`store.localhost` for the store's audit.

**8.25-cc THE QA HARNESS LIVES IN THE REPO, NOT IN A SCRATCHPAD.** §8.23 told each session to
re-create the headless harness from the docs if the scratchpad was gone, and the scratchpad is always
gone: it is session-scoped. That cost the same twenty minutes every round, and worse, each rebuild
re-learned the same traps by hitting them. It is now `tools/qa/`:

- `npm run qa:sweep` — axe (WCAG 2.0/2.1 A+AA) **plus** the voice lint across **every HTML route** at
  390px and 1280px. **The route list lives in the script**, which is the direct answer to §8.24-7a's
  most expensive lesson: a sweep that named four routes while the site had eleven let a real WCAG
  failure sit live through three "axe zero" rounds. Currently 34/34 clean (17 routes: the 2026-08-23
  security round added the store's /thanks, whose no-cookie state is now a real page rather than a 404).
- `npm run qa:text -- <url>` — the rendered text and every link. **Reach for this instead of grepping
  HTML** (§8.25-bb).
- `npm run qa:shot -- <url> <out.png> [width] [--full]` and `npm run qa:axe -- <url> [width]`.

`tools/qa/lib/resolve.mjs` locates puppeteer-core, axe-core and Chrome by searching the project's
`node_modules` and every npx cache entry, so **no cache hash is ever hardcoded again** (the old
scripts embedded one, and it changes). puppeteer-core and axe-core are deliberately NOT dependencies:
they are ~400MB of browser tooling for a dev-only harness and Vercel would install them on every
production build. `tools/qa/lib/browser.mjs` bakes in the four behaviours that are otherwise
re-derived each time: never the extension, third-party requests aborted (the Ahrefs tag never resolves
offline, so `networkidle0` hangs forever), reveals forced with a settle, and named hosts mapped to
127.0.0.1.

**8.25-dd THE GO-LIVE SEQUENCE IS A DOCUMENT, NOT A MEMORY.** `docs/store-go-live.md` takes the store
from "the founder's keys exist" to "the first real order landed", written for a session that did not
build it: every command copy-pasteable, every check with a stated pass condition. It exists because the
riskiest moment in this whole round is the one that happens after a conversation ends. It contains the
**test-mode payment end to end, which has never been run**, plus the two proofs that matter more than
the happy path (re-deliver a webhook and expect no second email; POST a bad signature and expect 400
with nothing written), the merge with a rollback tag created BEFORE the merge, and the fastest safe
stop: **remove `RAZORPAY_KEY_ID` in Vercel and redeploy**, which returns the store to "opening shortly"
and takes no money while every marketing page keeps working.

**8.25-ee A PAID ORDER MUST BE ABLE TO BECOME UNPAID.** The dispatch queue is literally
`where status = 'paid'` (the partial index in `0001_preorders.sql` says so), and the webhook originally
acted only on paid events. So a refunded order kept `status='paid'` and stayed in the queue: a Lumi
shipped to somebody who cancelled, followed by an invoice for ₹4,500. The only thing preventing that was
a human remembering to run an UPDATE by hand, every time, forever, which is not a control.

`refund.processed` now removes the order from the queue. Three details that matter:

- **`refund.processed`, never `refund.created`.** The latter is only the instruction; acting on it would
  clear an order before the money has left our account.
- **A PARTIAL refund is not a cancellation.** The first refund this store ever issued was ₹489 of ₹499,
  so this is not hypothetical: if any refund cleared the order, a ₹10 goodwill refund would silently
  cancel a live pre-order. Only a refund covering the full amount marks it `refunded`; anything less is
  logged loudly and left for a human, because there is no honest automatic answer to "they got some of
  it back".
- **`payment.failed` marks the row `failed`, but only while it is still `created`.** It separates "tried
  to pay us and the card was declined" from "filled the form and never came back", which are two
  different follow-up conversations, and the status guard means it can never contradict a real payment.

**8.25-ff ORPHANED PAYMENTS ARE RECOVERABLE, BECAUSE OUR REFERENCE TRAVELS WITH THE ORDER.**
`create-order` writes our row, then creates the gateway order, then attaches its id (§8.25-l). If that
last write fails, a real payment arrives for a gateway order id we have no row for, and the money is
unattributable — the one failure in this flow with no clean recovery. But the same function puts our
`order_ref` in the Razorpay order's **`receipt`** and in **`notes.order_ref`**, and Razorpay hands both
back in the webhook. `markPaid` therefore falls back to matching on our own reference before giving up,
and logs loudly when it rescues one. Keep sending both: `receipt` and `notes` are cheap, and they are the
only thread back to the customer if the id linkage breaks.

## 8.26 The unit cap (2026-08-23, founder-directed): ₹4,999 first 500, then ₹7,999 paid in full

The commercial model changed once, whole, on 2026-08-23: the 30 September date deadline was retired
ENTIRELY (₹9,999 with it), the ship date moved to 20 October 2026, and the urgency became a real unit
count. These laws sit ON TOP of §8.25; where they touch the same ground, this section wins.

**8.26-a THE CAP IS A LIVE COUNT OF THE PAID QUEUE, NOT A SECOND OPINION.** `lib/store/mode.ts` decides
the mode per request: `token` while fewer than `PREORDER_CAP_UNITS` paid, non-full-tier orders exist,
`full` after. `status='paid'` is the same predicate as the dispatch queue (§8.25-ee), so a refund
reopens a slot BY CONSTRUCTION — the founder chose live-count over a ratchet precisely because it needs
no new state and cannot disagree with the queue. `tier != 'full'` keeps post-cap orders from consuming
capped units. A missing count reads as 0: the failure direction offers the LOWER price, which costs
margin and never overcharges a parent.

**8.26-b THE COUNT NEVER LEAVES `mode.ts` (founder: NO PUBLIC COUNTER).** Only the MODE is exported,
and only `tiers.ts`, the store page and `/api/health` may import it. Anything that renders an EXISTING
order (thanks, receipts, the balance run) derives from the order ROW — its own `tier` and
`amount_paise` — so a mode flip can never rewrite what a customer already agreed to. The mode test
asserts the module's export surface, so a count-shaped export fails CI before a page can leak it.

**8.26-c BOTH FLIP DIRECTIONS ARE GATED AT THE PRICE CHOKE POINT.** `resolveTier` refuses `launch` in
full mode (`cap-reached`) and refuses `full` in token mode (`not-yet`). The second refusal is not
pedantry: after a refund reopens a slot, a stale full-mode page would otherwise charge ₹3,000 too much.
A raced submit is answered with refresh-the-page words, never a silent re-price — the price a parent
SAW is the only price they may be charged (§8.25-c-i).

**8.26-d OVERSHOOT IS TOLERATED, DELIBERATELY.** The count is read at order-creation; there are no
locks. Two concurrent checkouts at 499 can both get ₹4,999, and a Razorpay order created before the
flip can be paid after it — `markPaid` must NEVER re-check the cap, because refusing recorded money
violates §8.25-p and creates orphans (§8.25-ff). Worst case is single-digit extra units at ₹4,999,
which is cheaper than the shared-state infrastructure §8.25-j avoids.

**8.26-e A FULL-PAYMENT ORDER OWES NOTHING, BY DATA.** Post-cap orders pay `FULL_AMOUNT_PAISE` upfront
through the same route and are written with `balance_status='none'` (migration 0002 widened the CHECK),
which keeps them out of the balance-due ops query forever — no human filter to forget. Token and event
orders keep due → link_sent → paid. The refund promise covers every rupee of a full payment too
(founder-confirmed): /terms, /refund, the order summary and the receipt all say so.

**8.26-f AN EVENT TOKEN IS A TOKEN, WHATEVER THE PUBLIC MODE IS.** The signed branch of `resolveTier`
is untouched by the cap gate: a live ₹99 QR keeps working after the 500th unit sells, contained by its
own cap and expiry (§8.25-g). Event pages always render the token-shaped form and summary. Paid event
orders DO count toward the 500 (they consume real first-batch units). The id `full` is reserved before
the signed branch runs, so no dashboard row can ever shadow the public full tier.

**8.26-g STATIC MARKETING PAGES CANNOT FLIP THEMSELVES.** Home, /products/lumi, the legal pages,
llms.txt, pricing.md and the JSON-LD are static by design and phrase the offer so it stays true in both
modes where possible — but "₹499 reserves one of the first 500 units" goes stale the day the 500th
sells. The switch that protects money is fully server-side; the marketing sweep at sell-out is a NAMED
MANUAL TASK (FOUNDER-TODO), triggered by `/api/health`'s `preorder` field flipping to `full`. The
JSON-LD offer carries NO `priceValidUntil` any more: a unit-bounded offer has no honest validity date,
and a lapsed one would make Google drop the offer on a day nothing changed.

**8.26-h THE INVERSE LIST INVERTED ONCE, AND THE LINT MIRRORS THE TEST.** "first 500 units" left the
RETIRED list (test/preorder-copy.test.ts) and became LOAD-BEARING: the money test now REQUIRES it in
the offer line and bans month names from it. "30 September", "₹9,999" and "1 October 2026" took its
place — the old ship date banned by literal text because §8.25-f's worst find was a hardcoded date no
config change could reach. `tools/qa/sweep.mjs` carries the same list for rendered pages; the two lists
change together or the sweep lies.

## 8.27 Design authority note (2026-08-23)

Every `Design/design-system/...` path in the sections ABOVE this line describes the build
as it happened and stays as history. The design authority since CS3 of the v3 migration is
**`Design/Kheelona-Design-System-v3/`** (`tokens/kheelona.css` is canonical; the site's
extensions and the two v3 errata live in its `guidelines/site-extensions.md`). The old
folder is reference-only and is deleted at the engagement's close, with founder approval —
the token gate no longer reads it, so its deletion can no longer silently disable anything.

---

# §8.28 SECURITY HARDENING (2026-08-23)

The laws from the security engagement. Full record, findings register and gate log:
**`security-review.md`** at the repo root, which CLAUDE.md's banner tells every session to read
until sign-off. This section is the law; that file is the reasoning.

## 8.28-a Every HTML response carries the header set, and the CSP ships in two phases

`src/lib/security-headers.ts` is the only place headers are declared, wired through
`next.config.ts`'s `headers()`. One policy for BOTH hosts, deliberately: host-matched headers work,
but "the checkout got the marketing policy" is a failure mode worth designing out. The set is HSTS
with `includeSubDomains`, the CSP, `frame-ancestors 'none'` plus `X-Frame-Options: DENY`, `nosniff`,
`Referrer-Policy`, `Permissions-Policy`, and `Reporting-Endpoints`.

**`CSP_PHASE` is a two-step rollout and flipping it is a deliberate commit**, made only after
reading the `[csp] blocked=…` lines that `/api/csp-report` writes to the platform log from real
traffic. A wrong CSP on a live checkout looks to a parent exactly like a broken checkout.
`test/security-headers.test.ts` asserts which phase is live, so the flip cannot be a side effect.

**The compromise, stated so nobody "fixes" it in ignorance:** `script-src` carries `'unsafe-inline'`,
because Next's inline bootstrap differs per page and the alternative is a per-request nonce, which
forces every page dynamic and costs this site 31 prerendered pages and its LCP law. What survives is
the part that matters against skimming: an injected `<script src>` from an unknown origin is still
refused, and `connect-src`, `img-src` and `form-action` leave a script that does run nowhere to send
what it steals. Tightening further means moving the measurement tags out of the root layout so the
store alone can take a nonce, which is a structural change and a founder decision.

**`preload` on HSTS is deliberately absent.** It means a list compiled into browser binaries and
removal takes months. It needs its own decision.

## 8.28-b An order's credential never travels in a URL

The address token is the ONLY authorisation an order has: it reads a family's confirmation and
changes where their Lumi is delivered, for thirty days. It used to arrive as `/thanks?ref=&t=`, and
that page inherits three measurement tags, every one of which reports the URL it loaded on — so
`gtag` was copying each paid order's credential into the analytics property as `page_location`.

`src/proxy.ts` now claims it on arrival into an HttpOnly, Secure, SameSite=Lax cookie scoped to
`/thanks`, and 303s to a clean path (`src/lib/store/thanks-session.ts`). The redirect is 303 with
`private, no-store`, because a cached redirect would hand one customer's cookie to the next. Nothing
about the model moved: same signed, expiring, purpose-labelled token, same `verifyAddressToken`, and
`/api/preorder/address` still takes it in the POST body (§8.25-n intact).

**The general law: no page that carries a measurement tag may be reachable at a URL containing a
credential.** An event link's `sig=` is the one accepted exception, on the §8.25-g reasoning that a
printed QR is already semi-public — and even there, the CSP report route strips query strings before
logging.

## 8.28-c An order may not be marked paid by less than its own amount

`markPaid` compares the captured amount, and the comparison is a condition on the atomic UPDATE
rather than a read before it, because that single statement is what makes the function idempotent
when the browser callback and the webhook race. A short payment returns `short-paid`, is logged
loudly, stays out of the dispatch queue, and sends the customer nothing; the webhook answers 200,
because a retry would deliver the same short amount forever. The browser callback passes no amount
and takes no guard: its trustworthiness is its verified signature.

Nothing can produce a short payment today. The point is that the safety now lives in our data rather
than in a gateway dashboard setting nobody is watching.

## 8.28-d A rate limit keyed on a value the caller supplies is not a rate limit

Every throttle in the store keyed on the FIRST entry of `x-forwarded-for`, which is a chain each
proxy appends to and anyone may send. One varying header per request and every limit evaporated.
`clientKey` now prefers `x-real-ip`, then Vercel's own forwarded header, then the RIGHTMOST hop.

The in-app limiter is still in-memory and per instance, and that is honest rather than fixed: real
bounding belongs at the edge, and lives there now as a Vercel Firewall rule on `/api/preorder/`
POSTs. **That rule must never widen to `/api/`** — Razorpay's webhook retries and the daily health
cron both sit outside it on purpose, and throttling either costs money.

## 8.28-e Serialised data going into a script element is escaped at the boundary

`jsonLd()` in `src/lib/seo.ts` is the only way JSON-LD reaches a page. Every value is ours today, so
there is nothing to inject; the escaping is so that stays true the first time a value arrives from
somewhere else. A test fails if any page reintroduces a raw `JSON.stringify` inside an `__html`.

## 8.28-f A version bumped for an advisory gets a floor, or it slips back

`test/dependency-floor.test.ts` asserts the declared AND installed version of `next` stays at or
above the release that fixed nine advisories, with those advisories written out. A lockfile refresh
or a merge would otherwise re-open them silently. It compares numerically, because `"16.2.9" >
"16.2.12"` as strings is exactly the bug that would make such a guard pass while the hole stayed
open. Raising a floor is normal; lowering one means arguing it out loud.

## 8.28-g Two verification laws, both learned the hard way this round

**Build the control before believing a security assertion.** `npm run qa:payment` claims the CSP does
not disturb Razorpay Checkout. That claim was only worth having after removing Razorpay from
`script-src` and watching the probe fail — which also surfaced a second Razorpay host
(`cdn.razorpay.com/static/cx/razorpay-risk-detection/bundle.js`) that nothing in this repo mentions.
Same shape as §8.23's "build a control before believing a perf story".

**A probe may never be pointed at a measurement host.** `openPage` in `tools/qa/lib/browser.mjs`
aborts all third-party requests and takes an `allow` list for the ones under test. Allowing GA4 or
Ahrefs through would put QA traffic in the founder's real properties. It is also why GA4's
compatibility with the policy is left to production Report-Only rather than tested locally.

**And the trap that cost an hour:** `openPage` aborting third parties is why the Razorpay sheet
first looked broken. It was our own harness, not the policy. Check the harness before the finding.

---

# §8.29 THE ACTION FILL TAKES WHITE LABELS AGAIN (2026-08-24, founder-decided)

Supersedes **§8.22-a** (V4 D1) and restores the R5 white-label law that D1 retired. One decision,
taken with the arithmetic in front of it.

## 8.29-a WHITE ON BRAND ORANGE, AND THE NUMBER SAID OUT LOUD

`--color-action` still points at `--color-orange` (**#EF762F, unchanged** — the fill did not move, so
the token gate's mappings are untouched), and **every label on it is `text-white`**. That includes
buttons (both filled variants), the nav pill, the guide dock chip, CompareTable's brand column, the
`AudioMoments` play button, and the store's two submit buttons.

**White on #EF762F is 2.88:1. It fails WCAG AA at every size — it does not even reach the 3:1
large-text floor.** This is written here in full because the one way this decision goes wrong is
somebody finding the contrast later, assuming an oversight, and "fixing" it.

It is not an oversight. The founder was shown the ratio and the passing alternative — `orange-cta`
**#C25210**, which carries white at 4.66:1 and is still DEFINED in `globals.css` for exactly this
purpose — and chose to keep brand orange. The reasoning is brand fidelity: `.kh-button` in
`Design/Kheelona-Design-System-v3/tokens/kheelona.css` has always specified white on orange, and the
site now matches its own design system.

**This overrides, for this one pair only, the standing gate that accessibility outranks styling
preference.** Nothing else about that gate moves: every other pairing on the site still has to clear
4.5:1, and `orange-ink` #B54A0D (orange TEXT on a light wash) is untouched, because §8.29 governs
labels ON a fill, not orange type on paper.

## 8.29-b THE PALE TINTS ARE NOT ORANGE FILLS

`bg-orange/15` chips (`Hero`, `/team`, `/playos`) and the `--kh-*-tint` washes are light surfaces and
**keep ink text**. White on a 15% tint is invisible. "White on orange" means the solid brand fill and
nothing else.

## 8.29-c THE LABEL COLOUR IS `text-white`, NOT A NEW TOKEN, AND A TEST HOLDS THE LINE

A `--color-action-label` token was considered and rejected: `--color-action-ink` already exists and
means the opposite thing (orange type on a light wash, which must still clear 4.5:1). A second
ink-ish name beside it is the exact mix-up those slots exist to prevent, and on a live payment site
that mistake lands on a checkout button.

The rule is enforced instead by **`test/action-label.test.ts`**, which has two rules because one is
not enough: no class string may hold `bg-action` with an ink label, AND no call site may pass an ink
label into the `Button` atom through `className` — the composition blind spot that let a live WCAG
failure survive in `RecognitionStrip` for weeks (§8.24-7a). It strips comments before scanning, and
it was proven to go red before it was trusted (§8.28-g).

## 8.29-d THE ACCEPTED FAILURE STAYS VISIBLE, IT IS NOT SILENCED

`npm run qa:sweep` does **not** disable axe's `color-contrast` rule. Disabling it would blind the
sweep to every future contrast bug, and leaving it permanently red would train everyone to ignore the
gate — both are worse than the problem. Instead the sweep classifies: nodes reporting exactly
`fgColor #ffffff` on `bgColor #ef762f` are counted as **accepted** and printed on every run as
`(accepted: n white-on-orange, §8.29)`, with a summary line at the end. **Any other contrast pair,
including white on any other orange, still fails the sweep.**

The ratio itself is pinned as arithmetic in `test/contrast-tokens.test.ts`, alongside what was given
up (ink-head on the same fill, 5.99:1) and the passing alternative, so a future session can reverse
this in one informed step rather than re-deriving it.

---

# §8.30 THE PRODUCT ARTWORK HAS ONE SOURCE (2026-08-25, the dino to rabbit swap)

## 8.30-a `LUMI_ART` IS THE ONLY PLACE THE PLUSH IS DESCRIBED

Before this round the same asset was described **independently at ten call sites**: a hard-coded
`src`, a hard-coded `width`/`height` pair, and a differently-worded `alt` at each. Changing what the
product looked like was therefore a ten-file job with ten chances to leave one behind, and nine alt
strings still said "sky blue" and "striped party hat" long after neither was true of anything.

**Lumi is a ROTATING SKU** (brand law, founder 2026-07-10): its look is *expected* to change again.
So the artwork gets the treatment prices, CTA labels and ages already have — one source, never
inlined. `src/lib/lumi-art.ts` exports `LUMI_ART` (path, real pixel dimensions, the one description)
and `lumiAlt(clause)` for contextual variants. **Hand-coding a Lumi `src`, `width`, `height` or alt
anywhere else is a review flag**, guarded by `test/lumi-art.test.ts`.

**The rotation is still never published on-site** (§8.22 brand law). The new Lumi simply appears; no
page explains that it replaced anything.

## 8.30-b A `width`/`height` PAIR IS A CLAIM ABOUT A FILE, SO TEST IT AGAINST THE FILE

Next computes the layout box from those numbers before the image loads, so a stale pair is a CLS bug
rather than a cosmetic one. `test/lumi-art.test.ts` reads the PNG's IHDR chunk (no dependency: width
and height are big-endian uint32 at byte offsets 16 and 20) and fails if they drift, and it asserts
the file **exists** at all.

Until this round **nothing in the repo asserted that an image referenced by code existed, or that its
declared dimensions were real.** That gap is how `og.png` shipped a retired age band ("ages 3 to 6")
live on every social share through three copy rounds: **pixels carry claims, and the voice lint
cannot read them.**

## 8.30-c A CUTOUT HEURISTIC TUNED TO ONE PRODUCT COLOUR IS NOT SAFE ON THE NEXT

`tools/cutout` erases any pixel with `8 <= alpha < 240` where `min(r,g,b) > 170 && max-min < 24`. That
pass exists to kill neutral halo fringes and it worked well on a **blue** plush. Cream fur measures
**(236,225,213): min 213, spread 23** — inside the erase window. Run blind on the rabbit it would
have eaten the product's own edge.

So: **read the halo rule against the new product's actual pixel values before reaching for the
pipeline.** When a supplied cutout only needs its matte tightened, threshold the alpha directly
(`>= 250 -> 255`, `< 16 -> 0`, keep the anti-aliased band) rather than re-segmenting finished work.
**Verify by compositing over a dark plate and LOOKING** — `sips -g hasAlpha` is not proof, which
`logo-mark.png` proved by reporting alpha while carrying a baked white plate.

## 8.30-d A GUARD IS SCOPED TO THE CLAIM, NOT TO THE WORDS

`test/lumi-art.test.ts` first searched for `sky blue` and flagged three innocent lines, because
**"Why is the sky blue?" is the child's question and one of the site's strongest copy lines**. A
guard that cries wolf on the product's best writing gets deleted, not obeyed. It is now scoped to *a
plush described as* sky blue. Same family as §8.29-c's lesson that a guard must strip comments before
scanning, and it was proven red before it was trusted (§8.28-g).

## 8.30-e AN ARTWORK FLAG AND ITS ARTWORK TRAVEL TOGETHER

`data-hero-has-kheelu` makes `KheeluGuide` suppress the corner guide while the hero is on screen,
because two Kheelus in one viewport was the craft flaw V5-5 fixed. When the hero artwork became Lumi
alone, **the flag came off with it** — leaving it would have silenced the guide for no reason.
`HeroStage.test.tsx` asserts its absence, so restoring a Kheelu-bearing composite without restoring
the flag turns the suite red. **A behavioural flag that describes an asset is part of that asset's
swap, not separate from it.**

---

# §8.31 THE CREAM PLUSH HAS NO GROUND, AND THIS IS A KNOWN OPEN PROBLEM (2026-08-25)

**A brand-orange hero panel was built, shipped, and REVERTED at the founder's request the same day**
(`fd6f640`, reverted by `5f8400b`). The code is gone; the measurements are kept here because they were
expensive to get and they constrain whatever is tried next.

## 8.31-a THE PROBLEM IS REAL AND UNFIXED

The rabbit Lumi is cream and the site's wash is cream. Measured on the live render, the plush's edges
sit at **1.06–1.13:1** against the ground behind them. The blue dino it replaced measured **3.76:1**:
it carried its own contrast for free, and the swap silently spent that.

**The hero currently ships with this problem.** It is a deliberate founder call to accept it for now,
not an oversight. Anyone who notices the toy is hard to see against the background has noticed
correctly.

## 8.31-b WCAG CONTRAST RATIO IS A TEXT METRIC. DO NOT JUDGE AN OBJECT BY IT

The finding worth keeping, because the obvious reading of the numbers is wrong. WCAG's ratio is
**luminance-only**, designed for whether a reader can resolve letter shapes. What separates a
*photographed object* from its ground is perceptual distance across lightness **and hue and
saturation**. In CIE Lab:

| | luminance contrast | ΔE (perceptual) |
|---|---|---|
| cream rabbit on the cream wash (today) | 1.36:1 | **14.3** |
| the old blue dino on the cream wash | 1.59:1 | **31.4** |
| cream rabbit on brand orange `#EF762F` | 1.99:1 | **67.4** |

Brand orange scores badly by ratio and superbly by ΔE, because the fur is desaturated and the ground
is saturated. **Judging a product-on-ground decision by contrast ratio alone rejects the best option
and pushes toward a dark tone the brand does not want.**

## 8.31-c A PALE TINT MAKES IT WORSE, SO "A BIT DARKER" IS NOT AVAILABLE CHEAPLY

Every palette token composited at **15–35% over cream lands at roughly the fur's own luminance** and
drops separation to ~1.03–1.07 — *below* the untreated baseline. The intuitive fix is
counter-productive. Anything that works has to be a full-strength tone.

## 8.31-d WHATEVER IS TRIED NEXT MUST BE BOUNDED TO THE ART COLUMN

A radial glow was built first and rejected **on the render**: sized large enough to help, it reached
into the copy column and put ink body text on deep orange. Any future treatment needs horizontal
insets and a check that it overlaps zero text at 390, 768, 1024, 1280 and 1600 — and, if it ever
carries a label, §8.29 starts applying to it.

Also verified while the panel existed, and worth not re-deriving: **a solid background-colour div is
not an LCP candidate** (observed with a `PerformanceObserver`, not assumed — the plush stayed the only
LCP entry at both widths), and a label-free `aria-hidden` fill **adds no contrast nodes**, so
`qa:sweep` held at 34/34 with 79 accepted.

## 8.31-e OPTIONS ALREADY RENDERED AND MEASURED

If this is picked up again, these were built and looked at rather than imagined: brand orange flat
(ΔE 67.4), `orange-ink #B54A0D` (~4.0:1 luminance), `blue-ink #1B6E96` (~4.2:1, the strongest
numerically because cream against blue is the complementary pairing), a soft-vignetted orange, and
the footer cocoa `#2A1608` (~12:1, crisp but dark for a toy brand).
