# kheelona.com — Master Blueprint (`website-steps.md`)

> Phase 8 output. The single source of truth for implementation. If reality diverges, update this file first. Approved direction: **Concept A (Storybook) base + Concept C bold moments** (see `docs/checkpoints/phase-2-ux-discovery.md`).

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
- 3D models: `site/public/models/kheelona-mascot.glb` (idle "NlaTrack") and `site/public/models/lumi-plush.glb` (turntable moment on /products/lumi, `LumiTurntable.tsx`).
- Feelings (home): cast lineup on a shared ground with color ticks replaces the five tinted cards; curve dividers alternate direction site-wide.
- Video pipeline: `launch-video/src/ProductFilm.tsx` renders from real photoshoot cutouts in `launch-video/assets/product/`; output lives at `site/public/video/launch.mp4` (+poster).

## 8.13 Elevate + polish cycle addendum (2026-07-10, founder-approved)

Applies on top of the immersive redesign (`docs/redesign-plan-2026-07.md`). Founder decisions, locked:
1. **Elevate, not rebuild** — D1+D4 journey architecture and verbatim copy stay.
2. **Pragmatic hybrid libraries** — three/@react-three/fiber/@react-three/drei remain the only 3D stack (VengeanceUI and reactbits evaluated and rejected: unaudited/flashy, conflict with brand rule). Exactly two primitives vendored on Radix, restyled with `@theme` brand tokens: FAQ accordion (`@radix-ui/react-accordion`) and mobile-nav sheet (`@radix-ui/react-dialog`). No shadcn CLI, no CVA/tailwind-merge/lucide. Micro-interactions via `motion` (160–320ms, `--ease-calm`).
3. **Lighthouse hard gates** — 100 A11y/BP/SEO on all 9 routes, both form factors; Perf ≥95 desktop / ≥90 mobile.
4. **Scope** — Home journey deep-polish + ambient 3D scenes on the 7 flat interior routes.

Mechanisms introduced this cycle:
- **Copy legibility ghost-fade** (`site/lib/three/exclusion.ts`): every floating shape's screen projection is tested per frame against measured `[data-content]` rects (document coords cached at measure time, zero DOM reads on the frame loop); a shape whose projection would cross copy fades to 14% opacity and returns when clear. (A placement-time clamp was designed first but rejected during implementation: the copy column spans ~83% of the viewport, so clamping either emptied the field or failed at some depths.) The Lumi plush additionally transit-fades between beats so it never crosses a neighboring section's copy.
- **Single three-stack entry** (`site/components/three/Stage.tsx`): every dynamic import of a WebGL surface goes through this one module. Sibling dynamic entries made the bundler emit twin chunks with duplicate three/fiber copies. Rule: never `dynamic(() => import(...))` any three-consuming module except Stage.tsx.
- **Hidden-tab caveat for 3D QA**: R3F boots on requestAnimationFrame, which Chrome freezes in hidden/occluded tabs. A backgrounded automation tab shows an inert 300x150 canvas and no `scene-3d` class — that is browser throttling, not a site bug. Verify 3D with a visible window.
- **AmbientStage** (`site/components/three/AmbientStage.tsx`): lighter per-route scene for interiors — static camera + pointer parallax, corridor-clamped shape field, wash colors measured from the page's own `[data-wash]` sections (`site/lib/three/ambient.ts`), per-route dressing in `site/lib/three/ambient-configs.ts` with `enabled:false` kill switch. No GLBs on interiors. Shared shell extracted from ThreeStage (`StageShell.tsx`, `backdrop.tsx`); `StageGate` takes `stage: "journey" | "ambient"`.
- **Mobile perf contract**: `lite` tier arms the 3D stage on first user signal (scroll/pointer) then idle, keeping three.js out of the Lighthouse trace; fonts are WOFF2 (unused Glory-Italic removed); AVIF enabled in `next.config.ts`; `LaunchVideo` uses `preload="none"`.
- **Token drift gate**: `tools/tokens/check-tokens.mjs` compares `Design/design-system/colors_and_type.css` ↔ `site/app/globals.css` `@theme` ↔ `site/lib/three/tokens.ts` and fails the site build on drift (curated wash intermediates whitelisted).
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

- **Vendor registry law**: external components live under `site/components/vendor/<source>/`, copied source pinned to a commit, header comment records source+license+brand modifications, and `site/components/vendor/README.md` is the index (the founder's "centralized reusable database"). Animate UI license verified: MIT + Commons Clause — commercial use inside a product is explicitly permitted; reselling components is barred.
- **cn() upgraded** to clsx+tailwind-merge (vendored code assumes a merging cn; the R4 class-conflict foot-gun is closed). `lucide-react` is the icon family (hamburger/close/plus/check swapped; matches the DS iconography card).
- **Presence dial**: BrandShape baseOpacity 0.9 (ghost floor near copy stays 0.04); ambient densities home 11 / interiors 9-10 / legal 4; DOM hero shapes opacity-40.
- **Hero glow** (`vendor/animate-ui/backgrounds/hero-glow.tsx`): the Bubble background rebuilt calm — no goo/blur filters (compositor-only transforms), 3 warm brand blobs on 38-66s loops, reduced-motion renders static. Mounted section-local in the Home hero only.
- **TiltCard** (`ui/TiltCard.tsx` over vendored `primitives/tilt.tsx`): 5° pointer perspective on every card surface (feelings, journal, stories, team, product features+feelings, safety rules, playos principles). Renders a plain div unless `(hover:hover) and (pointer:fine) and (prefers-reduced-motion: no-preference)`. Tables never tilt.
- **Storybook pop entrances**: `data-reveal` CSS now settles from `perspective(700px) translateY rotateX(5deg) scale(0.98)` on the bouncy brand ease. Contracts unchanged: "rise" stays opacity-safe for LCP, no-JS fully visible, reduced-motion none.
- **CTA ripple**: press ripple grafted into `ui/Button.tsx` (adapted from Animate UI's ripple primitive, credited; CSS keyframe `--animate-ripple`); skipped under reduced motion. White-label fills and WCAG rules untouched.
- Perf: all new motion is transform/opacity-only; TBT unchanged (0ms); bundle adds ≈ tailwind-merge 3KB + lucide icons ~4KB.

## 8.16 R7 sister-site enrichment (2026-07-10, founder-directed)

kheelona.ai (the founder's B2B sister site, senior-designed) is the sanctioned reference for content AND design. Everything imported is founder-published there; statuses copied exactly (claims gate). Assets pulled from the private repo apoorva262/kheelona.ai via authenticated gh api into `site/public/{team,recognition,app}`.

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
