# kheelona.com — session entry point

Pre-order marketing site for **Lumi**, Kheelona's screen-free talking AI toy for ages 3 to 6 (India-first). One job: convert parents into the Tally pre-order list at ₹4,999 (₹9,999 after launch, no payment now).

## ⚠ STATE OF PLAY (2026-07-28) — read this first
**THE SITE IS LIVE AT https://kheelona.com. It is indexed and taking pre-orders, so every change you
make from here touches a live commercial site.** Latest checkpoint, read it before touching anything:
`docs/checkpoints/go-live-2026-07-28.md`.

**V4 (2026-07-30) IS BUILT ON `demo-website` AND WAITS FOR THE FOUNDER'S REVIEW + MANUAL MERGE**
(their explicit instruction — never merge it for them). It is the team-feedback round: brand-orange
CTAs with ink labels (the R5 white-label law is RETIRED), the tutor hero, real audio demos, a
How-It-Works loop, white finales, a VC-voiced /playos with the ArchitectureStack, five new stories,
and the §5.1 say-line cap. Spec: `docs/revamp-2026-07/BUILD-V4.md` (wins over BUILD-V3 where they
conflict); laws §8.22; founder queue FOUNDER-TODO V4-a..d (Tally 5-field edit, the four audio MP3s,
story heroes, optional Ahrefs buttons). `main` below still serves the live V3 site until that merge.

**The new site is MERGED TO `main` and is the only site.** The 2026-07 revamp (theme B
"Kheelu's Tour") plus the V3 repositioning (founder's YC application: 40% fun, 20% brain
development, 40% education) replaced the legacy Wix-backed commerce app that used to live at the
repo root. That old app is preserved at the tag **`pre-revamp-2026-07`** and its URLs are 301'd in
`next.config.ts`. The `revamp/kheelu-tour` branch is deleted; its history is inside `main`.

- **Work on `main`.** `demo-website` exists only as the Vercel preview branch
  (https://website-hdn2.vercel.app) and additionally carries the `/a` `/b` `/c` wireframe drafts.
  Keep it in sync by MERGING main into it, never force-push.
- **🟢 THE SITE IS LIVE TO CUSTOMERS** at **https://kheelona.com** (2026-07-28). The apex is the
  canonical host and `www` 308s to it — settled deliberately, because every URL the code emits
  (sitemap, canonicals, robots, WhatsApp share, every JSON-LD `@id`) is apex. It was briefly the
  other way round, which would have made Search Console report 24 redirects instead of 24 pages.
  **If the canonical host ever changes, `GA4_HOSTS` must change with it** — that list covering both
  hosts is the only reason GA4 survived this switch. **The pre-order form works everywhere**
  (V4-a, 2026-07-31: the founder cut Tally `Y5XW7J` to 5 fields — parent name, kid's age, city,
  WhatsApp number, WhatsApp consent — and the URL is now the hardcoded public `TALLY_FORM_URL` in
  `config/site.ts`, so the preview and local builds render the REAL form; a valid
  `NEXT_PUBLIC_TALLY_FORM_URL` still overrides. Preview/local submissions are REAL Tally entries —
  delete test rows there. Iframe re-measured at 827px → `h-[900px]`, guard test ≥860).
  Both analytics tools verified on the real domain.
  Treat every change from here as a change to a live commercial site: it takes real reservations.
- **Vercel is the founder's** — never run the Vercel CLI. Push to GitHub and hand over any dashboard
  change. Same shape as the Gemini gate.
- **Verifying Vercel Web Analytics**: it loads from a per-project **obfuscated path**
  (`/8f88bf018d5e772b/script.js`), not `/_vercel/insights/`, because Vercel randomizes it to survive
  ad blockers. Grep for `window.vai` or that hash, never the literal insights path, or you will
  wrongly conclude it is missing.
- **Live testimonials are drafted words on named people** (Shweta, Priyamvada, Gaurav, "Pilot
  parent"). Raised with the founder when the site went public; **their decision is to leave them
  as-is** (FOUNDER-TODO V3-a). Do not re-raise it and do not remove them.
- **The spec that built this**: `docs/revamp-2026-07/BUILD-V4.md` (the 2026-07-30 team-feedback
  round; wins over BUILD-V3, which wins over `copy-v2.md` and older copy laws). Status and the restart guide: `docs/revamp-2026-07/WORKING.md` — **read it first on any resume,
  and do not delete it** (an older note said to remove it after founder approval; it is now the
  site's operating record).
- **Locked product facts**: Lumi is ages **2 to 5**, the platform arc is **2 to 14** (both "3 to 6"
  and "3 to 10" are dead — render ages from `LUMI_AGES`/`PLATFORM_AGES`). The .com line-up is the
  pipeline Lumi → Kheelu Speaker → AI books. Lumi has **three modes**: AI mode, Kheelu mode,
  Bluetooth mode. Kheelona+ may only ever be described as "6 months included, monthly price
  announced before launch" — no ₹ amount, and no claim about what happens if it lapses (V3-b).
  Testimonial words are placeholders (V3-a). Contact is `hello@kheelona.com`; the phone number on
  the legacy site was a placeholder and must never be published.
- **Two hard rules from the mobile pass**: never animate X on an element spanning the track width
  (it widens the layout viewport on phones), and base-level element CSS belongs in `@layer base`.
- **One from the QA pass**: a route with a copy-only hero must ship its first room reveal-free, or
  it owns the LCP while invisible.
- **Two from the deploy pass (2026-07-28)**: the app lives at the **repo root**, not `site/`
  (Vercel reads `package.json` from the Root Directory — that mismatch was why nothing deployed);
  and **a redirect source must never shadow a `public/` directory**, because redirects match before
  static files (`/product/:slug*` blanked every product image incl. the hero — hence
  `/product/:slug([^.]+)` and `test/redirects-vs-assets.test.ts`). Both in §8.21-a/b.
- New laws are consolidated in `docs/website-steps.md` §8.21.

## Who you work for
**Apoorva Sahu** (apoorva@geekyants.work) — Founder & CEO of Kheelona (kheelona.com + sister site kheelona.ai), also a Director at GeekyAnts. Full authority on brand, product, and copy; defer to them on brand calls. Co-founders: Aman Soni (CTO, 14 patents filed), Kashyap C.R (Chief Hardware Officer, built at Intel — his published kheelona.ai bio names Thunderbolt 4/5, mirrored on /team). Team also includes Ria Mangala Rewari (Head of Marketing, not a co-founder; added R10).

## Resume protocol
1. Read `docs/project-state.json` (`current_phase`, `last_handoff`, `blockers`).
2. Follow the "For AI: How to Resume" table in `README.md`.
3. Founder-gated items live in `FOUNDER-TODO.md` — never re-ask what's already settled there or in checkpoints.

## Source-of-truth precedence
1. `kheelona homepage website content.pdf` — Home copy, verbatim (Rs. → ₹ is the one sanctioned deviation).
2. `website-builder-prompt-final-kheelona.md` — master build spec (Brand Bible §1, voice rules §1.7, keyword map §3.1).
3. `Design/design-system/` — tokens/fonts (note: capital-D `Design/`, and its README's "em-dash preferred" is OVERRIDDEN by the Brand Bible).

## Production structure & standards (BINDING LAW, 2026-07-12)
The app is now a **`src/`-based atomic-design** Next.js project. Two standards in
`docs/standards/` govern EVERY future change to the app (non-negotiable):
- `PROJECT_STRUCTURE.md` — where code lives (`src/`; components in
  atoms/molecules/organisms/templates; self-contained `features/`; `config/ lib/ styles/`;
  `@/* → src/*`; naming).
- `COMPONENT_GUIDELINES.md` — search-before-build / reuse-extend-compose; token-driven;
  every component ships a Storybook story + a Vitest test.
- `STRUCTURE-MAP.md` — old→new path translation (paths in older docs/checkpoints/bullets
  below predate the reorg; translate through this).

Rules for any change:
1. New UI: search the catalog first (Storybook + `docs/standards`); reuse/extend/compose
   before creating. Place by scope: generic → `src/components/{atoms|molecules|organisms|templates}`;
   one route → that route's `_components/`; one feature → `src/features/<f>/` (imported via its
   `index.ts` barrel).
2. Token-driven only; prices/CTA labels from `@/config/site`; the shared molecules
   (SectionHeading/Card/StepList/PageHero/CheckList/LegalDoc, plus V3's AnswerBlock/
   FootnotesRow/KheelonaPlusBand/FamilyGrid/LumiModes — §8.19 + §8.21) are the registry. Age copy comes
   from LUMI_AGES/PLATFORM_AGES and subscription copy from KHEELONA_PLUS_LINE, never inline.
3. Every new/changed component ships a colocated `X.stories.tsx` + `X.test.tsx`
   (`npm test`, `npm run storybook`). Node ≥ 24 (`.nvmrc`). Storybook/Vitest are
   dev-only and MUST never affect `next build`.
4. Structural work keeps the no-user-facing-change discipline: prove it (build + generated-CSS
   parity + a route render), never assume it.

## Hard gates (non-negotiable)
- **Gemini generation goes through the founder, never Claude** (founder directive 2026-07-07): for ANY Gemini image/video generation, prepare reference images + copy-paste prompts (pattern: `gemini-handoff/README.md`), hand them to the founder, and ingest the results from `~/Downloads`. Do not drive gemini.google.com yourself.
- **Voice-lint**: zero em-dashes (en-dash only inside number ranges), no hype, rarely lead with "AI", exact names (PlayOS, Lumi, **Kheelu** = the brand mascot, Lori, Lua, Robu, Kheelona Magic Box), second person present tense. ONE exemption: Kheelu's quoted speech (KheeluSays bubbles) may use contractions — his founder-published card voice (copy-reference.md R9).
- **Brand law (founder, 2026-07-10)**: the plush = **Lumi, the product** — a rotating SKU whose look changes post-launch (core/AI stays); NEVER publish the rotation strategy on-site. The orange character = **Kheelu**, the permanent mascot and site narrator. The product owns the hero; Kheelu narrates (all speech lines founder-approved before shipping — pattern: list them in the plan).
- **Never invent claims**: testimonials, certifications, specs, ship date, contact email → flagged placeholders + blockers only.
- **Accessibility 90+ outranks any styling preference** (spec §3). Lighthouse gates: A11y/BP/SEO 90+ everywhere, Perf 90+ desktop.

@AGENTS.md

## Commands (app code lives in `src/`)
- Dev: `npm run dev` (port 3000)
- Prod: `npx next build && npx next start -p 3456` (local prod URL the founder uses: http://localhost:3456)
- Test: `npm test` (Vitest; a test per component) · Storybook: `npm run storybook` / `npm run build-storybook`
- Deploy target: Vercel, project Root Directory = **repo root** (the app moved out of
  `site/` on 2026-07-28; paths in older docs and checkpoints that say `site/...` now mean
  the repo root). Env vars + DNS are still founder-gated, FOUNDER-TODO #2.

## Env
Root `.env` (gitignored, DUMMY values until founder fills them): `TRIPO_API_KEY` (unused — mascot pipeline went through the Tripo web UI instead, see `design-concepts/README.md`), `NEXT_PUBLIC_TALLY_FORM_URL` (`.env.example` mirrors it). Since V4-a the form URL DEFAULTS to the public
`TALLY_FORM_URL` constant in `config/site.ts` (same public-identifier rationale as the GA4 ID), so
the real form renders on preview and localhost too; a valid env value overrides, a DUMMY one falls
through to the constant, and the placeholder card survives only if the constant is ever blanked.
- **Analytics needs NO env var** (three tools; laws in §8.21-c, c-i, c-ii). **Ahrefs** is a raw
  `<script async>` in the layout's `<head>` and is deliberately NOT host-gated, because Ahrefs
  verifies by fetching the page and looking for the tag. **Adding or removing any measurement
  tool means changing /privacy in the SAME commit** — `test/analytics-tags.test.ts` enforces it. Vercel Web Analytics =
  `<Analytics />` from `@vercel/analytics/next`; GA4 = `GoogleAnalyticsGate`, a manual gtag install
  via `@next/third-parties` (NOT Tag Manager). Both sit last in the body of `src/app/layout.tsx` so
  they never compete with the hero LCP. **The GA4 ID is hardcoded in `config/site.ts`**
  (`GA4_MEASUREMENT_ID` — a public client-side identifier, not a secret) and fires ONLY on
  `GA4_HOSTS`, so localhost and preview deploys never pollute the founder's property. Add a host
  there when a production domain goes live; the guard test asserts no preview or local host is in
  that list. `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is RETIRED (nothing ever read it). What both tools
  collect is stated on /privacy, which is counsel-gated.

## Docs map
- `docs/standards/` — BINDING production standards: `PROJECT_STRUCTURE.md`, `COMPONENT_GUIDELINES.md`, and `STRUCTURE-MAP.md` (old→new path translation for the `src/` reorg). See the "Production structure & standards" section above.
- `docs/project-state.json` — machine-readable status, always current
- `docs/website-steps.md` — blueprint (law; if reality diverges, update it first)
- `docs/qa-report.md` — sprint logs, Lighthouse, AI-detection verification of all 14 articles
- `docs/copy-reference.md` — copy provenance + sanctioned deviations
- `docs/design-review-2026-07-10.md` — R4 panel findings, every item dispositioned (FIXED/FOUNDER/DEFERRED/REJECTED); §8.13 in website-steps.md is the matching spec. 3D QA gotcha: hidden tabs freeze rAF, so the canvas looks dead in background automation tabs — verify with a visible window
- `docs/stories-image-prompts.md` — ready prompts for the 7 journal articles still missing hero images
- `docs/checkpoints/` — per-phase snapshots. **Latest: `go-live-2026-07-28.md`** (the launch: the
  sequence, the three real findings, the live-setup gotchas, and the decisions not to re-litigate).
  Before it: `repo-root-move-2026-07-28.md` (why the app sits at the repo root, and the redirect
  that blanked every product image)
- `design-concepts/README.md` — 3 archived concepts, mascot cutout pipeline, Tripo3D 2D→3D pipeline (v2 runs incl. Janus fix + Lumi plush), engineering gotchas (overflow-x clip, scroll-snap wheel trap)
- `AGENTS.md` — Next.js 16 breaking-changes warning (read `node_modules/next/dist/docs/` before writing Next code)
- `tools/cutout/` — offline background removal (Swift + Apple Vision; compile with `swiftc -O main.swift -o cutout`). Every mascot/product cutout and video asset goes through it; never ship art with baked backgrounds. For thin pale details the Vision mask drops (hat ribbons), use `keycut.swift` (region-grow color-key; hybrid mode takes a Vision `--no-crop` alpha for the body: `keycut in.png out.png 24 vision-nocrop.png`).
- **Visuals: the calm ambient treatment** (R5, founder 2026-07-10 — the R4 flying journey overwhelmed; punch-list law §8.14). A fixed canvas sky glides the page's own washes behind SSR DOM, with a few translucent shapes that ghost to 4% under copy. The whole 3D stack lives in **`src/features/ambient-stage/`** (imported through its `index.ts`); the full 3D journey (GLBs in `public/models/`, mascot rigged clip-less + procedural idle) is DORMANT, one prop away: `<StageGate stage="journey" />`. **Never `dynamic(() => import(...))` any three-consuming module except `Stage.tsx`** — sibling entries emit twin chunks with duplicate three copies. 3D QA needs a VISIBLE window: hidden tabs freeze rAF, so the canvas looks dead in background automation.
- **Styling laws that still bind** (violating one is a review flag): zero italics; all text left-aligned; **CTAs are brand orange `#EF762F` via the `action` token with `ink-head` labels — NO white text on the action fill anywhere** (V4 D1, §8.22-a; white measures 2.9:1 and the R5 white-label law is retired; `orange-cta #C25210` survives only as a dormant token; token-check is 17 mappings); the finale is a WHITE room on every route (D5); serif ONLY in human quotes; 13px sans kickers in `orange-ink #b54a0d`, the only orange passing 4.5:1 on every wash; one CTA verb (nav = "Reserve at ₹4,999"); every page ends with `FinaleCTA` (`id="reserve"`, the nav CTA's anchor); Kheelu say lines ≤ 48 characters and the guide docks bottom-RIGHT (§8.22-d); **tilt never wraps a whole-card link** (`molecules/TiltCard.tsx`, §8.18 — pointer-tracked transforms drop clicks); **the priority plush image must stay the hero's LARGEST element** (it owns mobile LCP; two live regressions taught this, qa-report R11); nav tab is "PlayOS" and /playos is the VC-voiced platform page (V4 D6 — vision, moat, ArchitectureStack; still no per-unit pricing, kheelona.ai stays the only partner CTA); mobile perf verifies record BOTH Lighthouse throttling methods (simulate amplifies a headless artifact — judge by devtools numbers).
- **Registry law** (§8.19 + §8.21 + §8.22-h): new sections compose the shared molecules — `SectionHeading`/`Card`/`StepList`/`PageHero`/`CheckList`/`LegalDoc` plus V3's `AnswerBlock`/`FootnotesRow`/`KheelonaPlusBand`/`FamilyGrid`/`LumiModes` plus V4's `AudioMoments` (data ONLY from `lib/audio-moments.ts`)/`HowItWorksLoop`/`ArchitectureStack` — and take prices, CTA labels, ages and subscription copy from `@/config/site`. Hand-rolling those shapes is a review flag.
- **Retired in V3-5, do not resurrect or cite**: `MascotScene`, `KheeluSays`, `HeroConversation`, `KheeluIntro`, `WhyWeExist`, `Feelings`, `MeetLumi`, `WhatLumiDoes`, `HowItWorks`, `SafetyCallout`, `SafetyStrip`, `StickyMobileCTA`, `CurveDivider`, `Beat`, and the `teal-deep` token. **Retired in V4** (team feedback): `Statement`, `LaunchVideo` (component only — the film files stay in `public/video/`), `LearningRoom`, `BrainRoom`, the hero fact bubbles, the orange Room fill/Section wash, and the launch film's VideoObject in Home's JSON-LD. Older §8.x entries and checkpoints still name them because they describe what shipped at the time. Plan + architecture: `docs/redesign-plan-2026-07.md`. `public/video/launch.{mp4,jpg}` = the "Two friends" film (source `launch-video/src/FilmTwoFriendsVeo.tsx`).
- `gemini-handoff/` — founder generation kit (refs + seeds + prompts); product renders staged in `Design/product-images/generated-2026-07/`
