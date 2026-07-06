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
- Lighthouse gates: A11y/BP/SEO ≥90 all pages; Perf ≥90 desktop (mobile: aim 90, static fallbacks where parallax hurts).
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
