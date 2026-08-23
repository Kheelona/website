# kheelona.com — session entry point

**🟢 THE v3 MIGRATION IS COMPLETE AND LIVE (2026-08-23, one day, merge `275ef01` onward).**
The record: `docs/checkpoints/migration-to-new-dsx.md` (the twelve founder decisions, dashboard, QA log, keyword
map) + `docs/checkpoints/v3-migration-2026-08-23.md`. New laws: **§8.26** (the unit-cap offer)
and **§8.27** (design authority = `Design/Kheelona-Design-System-v3/`; the old system is DELETED,
history keeps it at `pre-v3-migration-2026-08-23` = `b27fd25`, also the rollback tag). Facts in
sections below that still say ages 2 to 5 / 30 September / ₹9,999 / 1 October / zero italics are
PRE-MIGRATION history — the paragraph above each usually says so, and this block wins.

**🔒 A SECURITY REVIEW IS OPEN (from 2026-08-23, branch `security-hardening`). READ
`security-review.md` AT THE START OF EVERY SESSION until it is signed off.** It holds the
architecture map, the findings register with live status, the fixes and their tests, the gate log,
and what is waiting on the founder. Its rules bind while it is open: no active testing against
production, no real charges or refunds, no customer values copied anywhere, and secrets, gateway
config, prod DB, DNS/TLS and legal wording are ESCALATE-ONLY. Remove this block when the engagement
closes.

Pre-order marketing site for **Lumi**, Kheelona's screen-free talking AI toy for ages 3+
(India-first). One job: turn parents into paid pre-orders. A **₹499 refundable token** holds one of
the **first 500 units** at **₹4,999** (decided per request from the live paid count — once they are
gone, a pre-order is **₹7,999 paid in full**), the **₹4,500 balance** on token orders falls due
before dispatch, and the payment happens on **store.kheelona.com**, which this same repo serves.

## ⚠ STATE OF PLAY (2026-08-23 — **THE v3-MIGRATED SITE IS LIVE, ON LIVE KEYS**) — read this first
**THE SITE IS LIVE AT https://kheelona.com, indexed, and taking PAID pre-orders — every change from
here touches a live commercial site.** Latest checkpoint, read it before touching anything:
**`docs/checkpoints/v3-migration-2026-08-23.md`** (the whole 2026-08-23 engagement; the full tracker
is `docs/checkpoints/migration-to-new-dsx.md`). Before it: `one-tap-and-cleanup-2026-08-23.md`,
`preorder-store-2026-08-22.md`, `v6-content-2026-07-31.md`, `go-live-2026-07-28.md`.

**💳 THE OFFER (§8.26, unit-bounded since 2026-08-23).** A **₹499 refundable token** holds one of the
**first 500 units** at **₹4,999** (₹4,500 balance by payment link before dispatch); once they are
gone, a pre-order is **₹7,999 paid in full**. The mode is decided SERVER-SIDE per request from the
live paid count in `lib/store/mode.ts` — the count is never published, a refund reopens a slot, and
"30 September", "₹9,999" and "1 October 2026" are the banned phrases now (`test/preorder-copy.test.ts`
inverted once). Payment happens on **store.kheelona.com**, THIS repo through the host rewrite in
`src/proxy.ts`; orders in Supabase, receipts via Resend, events at ₹99 behind signed QR links.
Ship date **20 October 2026**. Rollback tag **`pre-v3-migration-2026-08-23`** = `b27fd25`.

**`/api/health` IS THE FIRST THING TO CHECK** on any store question: readiness, the offer MODE
(`preorder: token|full` — its flip to `full` triggers the manual sell-out copy sweep in
Technical-Todo), Razorpay mode, email, db latency, and the NAMES of any missing env vars.

**✅ THE PAYMENT PATH IS PROVEN WITH A REAL TRANSACTION** (2026-08-22, ₹499 UPI, KH-YPJ8-GHVT,
refunded after): webhooks 200, idempotency held under the real race (exactly ONE receipt), the signed
address link exercised. **Do not re-test it.** Detail: `docs/store-go-live.md` "⚑ WHERE THIS ACTUALLY
GOT TO". **The launch's lasting lesson: three defects shipped past a fully green suite and were found
only by looking at real artefacts** — a receipt greeting "shweta" (read the sent PDF), a refunded
order still in the dispatch queue (`status='paid'` IS the queue, §8.25-ee — and a PARTIAL refund is
NOT a cancellation), and an unrecoverable orphaned payment (§8.25-ff). **Always refund the whole
token.**

**🟡 STILL OPEN** (`Technical-Todo.md` is THE queue since 2026-08-23: one list, founder items and engineering items together, each tagged with who owns it): the **Ideabaaz partner page**
`store.kheelona.com/ideabaaz` (₹99 public event tier, §8.25-g-i, checkpoint
`ideabaaz-event-page-2026-08-23.md`) needs its tier row inserted before 26 Aug and closes 31 Aug —
both dated founder items; DMARC tightens to
`p=quarantine` on **5 September 2026** (scheduled agent + dated item); a trivial Supabase query takes
250–975ms, suggesting the project is not in an Indian region (raised, closed as not actionable); and
the standing **sell-out copy sweep** the day health first reports `preorder:"full"` (§8.26-g).

Store laws are `docs/website-steps.md` **§8.25 + §8.26** — read both before touching any of it. The
ones that bite: **the client never sends a price** (§8.25-c-i), **the cap is a live count of the paid
queue and never leaves `mode.ts`** (§8.26-a/b), **both flip directions are gated — a stale page is
refused with words, never re-priced** (§8.26-c), **paid is decided twice through one idempotent
`markPaid`, which never re-checks the cap** (§8.25-p, §8.26-d), **the webhook verifies the RAW body
and releases its claim on failure** (§8.25-m), **an address is authorised only by its signed token**
(§8.25-n), **every pre-order CTA reaches the store in ONE tap** (§8.25-b), **a full-payment order
owes nothing, by data** (§8.26-e), and **an event token is a token in either mode** (§8.26-f).

**Two traps that will otherwise waste an hour.** `send.send.kheelona.com` is **not a typo**: the Resend
domain is `send.kheelona.com` and its sending records sit at `send` relative to that, so the label
appears twice. And `webhook_events.order_ref` holds the **Razorpay** order id, not our `KH-` reference.

**The 2026-07-31 rounds (V4 → V5 → V6), compressed — all long since live, all superseded in part by
the 2026-08-23 migration; the checkpoints carry the detail.** V6 (growth-arc content; checkpoint
`v6-content-2026-07-31.md`, spec `BUILD-V6.md`, laws §8.24): shipped the outcome-arc hero — re-anchored
to "at 3 / for school" by the migration — the `GrowthArc` room, the mode-precise connectivity law
(AI mode = home WiFi; Kheelu-mode stories + Bluetooth work offline — NO blanket offline claim,
§8.24-1), the native-`<details>` FAQ (§8.24-6), orange-ink kickers (§8.24-7), and the rule that the
tutor narrative lives in exactly four places (Compare, PacePanel, the arc's closing line, the Home
meta title) — a fifth is a review flag. V5 (design/UX; `BUILD-V5.md`, §8.23): the one interaction
contract in `lib/interactions.ts`, `PromiseMark`, hero craft. V4 (team feedback; `BUILD-V4.md`,
§8.22): brand-orange CTAs with ink labels, the real-audio room, white finales, the VC-voiced /playos,
19 photographed journal articles. Round-era rollback tags: `v5-live-2026-07-31`,
`v4-live-2026-07-31`, `v3-live-2026-07-31`, then `v6-live-2026-08-22` (pre-store) and
`pre-v3-migration-2026-08-23` (pre-migration, the current one).

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
  hosts is the only reason GA4 survived this switch. **The pre-order form is OUR OWN since
  2026-08-22** (`src/features/preorder/`, paying through Razorpay on the store host; the Tally era
  and everything about its iframe is closed history — see `closed-rounds.md`). Analytics verified on
  the real domain. Treat every change from here as a change to a live commercial site: it takes real
  money.
- **Vercel is the founder's** — never run the Vercel CLI. Push to GitHub and hand over any dashboard
  change. Same shape as the Gemini gate.
- **Verifying Vercel Web Analytics**: it loads from a per-project **obfuscated path**
  (`/8f88bf018d5e772b/script.js`), not `/_vercel/insights/`, because Vercel randomizes it to survive
  ad blockers. Grep for `window.vai` or that hash, never the literal insights path, or you will
  wrongly conclude it is missing.
- **Live testimonials are drafted words on named people** (Shweta, Priyamvada, Gaurav, "Pilot
  parent"). Raised with the founder when the site went public; **their decision is to leave them
  as-is** (`docs/checkpoints/closed-rounds.md`, the Testimonials row in the archived FOUNDER-TODO block). Do not re-raise it and
  do not remove them.
- **Spec precedence**: the 2026-08-23 migration record (`docs/checkpoints/migration-to-new-dsx.md`,
  §8.26/§8.27) wins over `BUILD-V6.md`, which wins over BUILD-V5 → BUILD-V4 → BUILD-V3 →
  `copy-v2.md` and older copy laws. On any resume: this file's banner → `docs/project-state.json` →
  the latest checkpoint. `docs/revamp-2026-07/WORKING.md` is the revamp-era operating record
  (kept, not deleted; its sibling `WORKING-history-2026-07.md` is evidence, NOT law — it still says
  ages 3 to 10 under a heading that says *Locked decisions*).
- **Locked product facts (as revised by the 2026-08-23 migration)**: Lumi is ages **3+** — no
  published ceiling anywhere; `PLATFORM_AGES` is deleted and every age renders from `LUMI_AGES`
  ("2 to 5", "2 to 14", "3 to 6" and "3 to 10" are ALL dead ranges, guarded in `seo.test`). The .com
  line-up is the pipeline Lumi → Kheelu Speaker → AI books (chips 3+/5+/3+). Lumi has **three
  modes**: AI mode, Kheelu mode, Bluetooth mode. **Shipping starts 20 October 2026** (render from
  `SHIP_DATE_TEXT`/`SHIP_DATE_ISO`, never inline). **The offer is UNIT-BOUNDED (§8.26)**: ₹4,999 for
  the **first 500 units** (a ₹499 refundable token + ₹4,500 balance before dispatch), then
  **₹7,999 paid in full** — the mode is decided server-side per request from the live paid count in
  `lib/store/mode.ts`, the count is NEVER published, a refund reopens a slot, and "30 September",
  "₹9,999" and "1 October 2026" are the banned phrases now (`test/preorder-copy.test.ts` inverted
  once, 2026-08-23). Support is **WhatsApp only** on
  +91 91875 46483, and every visible label must say so. Seller of record: **Kheelona Robotics Private
  Limited**, GSTIN 29AAMCK1530E1ZN, Jayanagar Bengaluru 560041 (`lib/legal.ts`). **Eight languages are named and final**
  (English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French — render from
  `LUMI_LANGUAGES`/`LANGUAGES_LINE`); the published ceiling stays "up to 10". **Kheelona+** may
  only ever be described per `KHEELONA_PLUS_LINE`: 6 months included, **Lumi's smart features are
  lifetime** (the sanctioned post-lapse answer since 2026-07-31), pricing "announced soon" — a ₹
  amount for it is STILL gated. Certifications: none received; the safety-standards FAQ is
  removed until the first certificate lands (the status-honest standards room stays). Testimonial
  words are placeholders (V3-a). Contact is `hello@kheelona.com`; the phone number on the legacy
  site was a placeholder and must never be published.
- **Two hard rules from the mobile pass**: never animate X on an element spanning the track width
  (it widens the layout viewport on phones), and base-level element CSS belongs in `@layer base`.
- **One from the QA pass**: a route with a copy-only hero must ship its first room reveal-free, or
  it owns the LCP while invisible.
- **Two from the deploy pass (2026-07-28)**: the app lives at the **repo root**, not `site/`
  (Vercel reads `package.json` from the Root Directory — that mismatch was why nothing deployed);
  and **a redirect source must never shadow a `public/` directory**, because redirects match before
  static files (`/product/:slug*` blanked every product image incl. the hero — hence
  `/product/:slug([^.]+)` and `test/redirects-vs-assets.test.ts`). Both in §8.21-a/b.
- New laws are consolidated in `docs/website-steps.md` §8.21 + §8.22 (V4) + **§8.23 (V5, the
  design/UX review round)**: every tappable surface answers touch via `lib/interactions.ts`
  (hand-rolled hover/active is a review flag), an embedded form's height is measured inside the
  shipping iframe, a brand mark needs a job (`PromiseMark`), one idea one statement per page, the
  same character never doubles at illustration scale, **axe is blind to un-revealed rooms — force
  `.reveal-in` before running it**, and build a control before believing a perf story.
- **Visual reviews run headless, not through the extension.** Its window is locked ~390px and its tab
  runs hidden, which freezes IntersectionObserver reveals and defers image/media painting — a
  screenshot from it is not evidence. **THE HARNESS IS IN THE REPO SINCE 2026-08-22 (`tools/qa/`), so
  stop re-creating it in a scratchpad**: `npm run qa:sweep` runs axe + the voice lint over all 15 HTML
  routes at 390 and 1280 (clean 30/30), and `qa:shot` / `qa:text` / `qa:axe` drive one route.
  `tools/qa/lib/resolve.mjs` finds puppeteer-core, axe-core and Chrome by itself, so no cache hash is
  ever hardcoded again. **Reach for `qa:text` whenever you want to know what a page SAYS** — grepping
  HTML source also searches the RSC payload and finds strings that are not on the page (§8.25-bb).

## Who you work for
**Apoorva Sahu** (apoorva@geekyants.work) — Founder & CEO of Kheelona (kheelona.com + sister site kheelona.ai), also a Director at GeekyAnts. Full authority on brand, product, and copy; defer to them on brand calls. Co-founders: Aman Soni (CTO, 14 patents filed), Kashyap C.R (Chief Hardware Officer, built at Intel — his published kheelona.ai bio names Thunderbolt 4/5, mirrored on /team). Team also includes Ria Mangala Rewari (Head of Marketing, not a co-founder; added R10).

## Resume protocol
1. Read `docs/project-state.json` (`current_phase`, `last_handoff`, `blockers`).
2. Follow the "For AI: How to Resume" table in `README.md`.
3. Open items ALL live in `Technical-Todo.md` (one list since 2026-08-23; `FOUNDER-TODO.md` is now
   just a pointer, kept because 82 references name it). Settled decisions live in
   `docs/checkpoints/closed-rounds.md` — never re-ask what's already settled there or in
   checkpoints. **The live queue is its ⏳ OPEN half** (the ✅ CLOSED half is one or two lines per
   finished item). Nothing in it blocks the site. The two highest-value items are the Kheelona+ ₹
   amount and real photography.

## Source-of-truth precedence
1. `kheelona homepage website content.pdf` — Home copy, verbatim (Rs. → ₹ is the one sanctioned deviation).
2. `website-builder-prompt-final-kheelona.md` — master build spec (Brand Bible §1, voice rules §1.7, keyword map §3.1).
3. `Design/Kheelona-Design-System-v3/` — tokens/fonts/logo/guidelines, THE design authority since
   2026-08-23 (`tokens/kheelona.css` is canonical, the build gate reads it and fails hard without
   it; the site's extensions + two v3 errata live in its `guidelines/site-extensions.md`). The OLD
   system `Design/design-system/` was DELETED with founder approval at the migration's close —
   git history keeps it. Em-dashes stay banned regardless of any DS doc (Brand Bible wins).

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
0. **Two chromes since 2026-08-22 (§8.25-z).** Marketing routes live in the `(site)` route group and
   get `SiteChrome` (navbar, footer, mascot, Organization schema). `/store/*` gets its own minimal
   chrome and is `noindex`. The ROOT layout is only what both share: the html element, the fonts, the
   three measurement tags. A new marketing page goes inside `(site)`; a route group is not a path
   segment, so URLs are unaffected.
1. New UI: search the catalog first (Storybook + `docs/standards`); reuse/extend/compose
   before creating. Place by scope: generic → `src/components/{atoms|molecules|organisms|templates}`;
   one route → that route's `_components/`; one feature → `src/features/<f>/` (imported via its
   `index.ts` barrel).
2. Token-driven only; prices/CTA labels from `@/config/site`; the shared molecules
   (SectionHeading/Card/StepList/PageHero/CheckList/LegalDoc, plus V3's AnswerBlock/
   FootnotesRow/KheelonaPlusBand/FamilyGrid/LumiModes — §8.19 + §8.21) are the registry. Age copy
   comes from `LUMI_AGES` ("3+"; `PLATFORM_AGES` is deleted) and subscription copy from
   KHEELONA_PLUS_LINE, never inline.
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
- **Accessibility 90+ outranks any styling preference** (spec §3). Lighthouse gates: A11y/BP/SEO 90+
  everywhere, Perf 90+ desktop. **ONE SANCTIONED EXCEPTION**: the store is `noindex`, so its SEO score
  is ~66 by design and that is correct, not a regression (§8.25-aa). Its a11y, best-practices and perf
  are held to the normal gate and currently measure 100 / 96 / 100.

@AGENTS.md

## Commands (app code lives in `src/`)
- Dev: `npm run dev` (port 3000)
- Prod: `npx next build && npx next start -p 3456` (local prod URL the founder uses: http://localhost:3456). If a replaced `public/` image serves stale through `/_next/image`, `rm -rf .next/cache/images` — the optimizer cache survives rebuilds (qa-report 2026-07-31). Check `lsof -iTCP:3456` for stale servers from old sessions.
- Test: `npm test` (Vitest; a test per component) · Storybook: `npm run storybook` / `npm run build-storybook`
- **Store, locally**: the host rewrite needs a store hostname, so
  `curl -H "Host: store.kheelona.com" localhost:3456/` or open `http://store.localhost:3456`.
  Headless Chrome here does NOT resolve `localhost` (use `127.0.0.1`) and Lighthouse hits an HSTS
  interstitial on `kheelona.com` (use `store.localhost`) — §8.25-bb.
- Event links: `STORE_SIGNING_SECRET=… npm run event-link -- <tier-id>` (runbook:
  `docs/preorder-events.md`)
- Deploy target: Vercel, project Root Directory = **repo root** (the app moved out of
  `site/` on 2026-07-28; paths in older docs and checkpoints that say `site/...` now mean
  the repo root). Env vars and DNS were founder-gated and are **DONE** since 2026-07-28; any NEW
  variable still has to be added in the dashboard by the founder, never by the CLI.

## Env
Root `.env` (gitignored, DUMMY values until the founder fills them) and `.env.example`, which
documents every variable. `TRIPO_API_KEY` is unused (the mascot pipeline went through the Tripo web
UI, see `design-concepts/README.md`); `NEXT_PUBLIC_TALLY_FORM_URL` is retired with the Tally form.

**THE STORE'S SIX VARIABLES ARE REAL SECRETS** and none may ever take a `NEXT_PUBLIC_` name:
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `STORE_SIGNING_SECRET` (plus optional `RESEND_API_KEY`, `EMAIL_FROM`,
`ORDER_ALERT_EMAIL`). This repo hardcodes three PUBLIC identifiers in `config/site.ts` with comments
explaining why that is safe; those comments are correct and are **not** a precedent for a payment key
(§8.25-y, guarded by `test/store-secrets.test.ts`). All six are read in exactly one place,
`lib/store/env.ts`, which returns null when any is missing so the store renders an honest "opening
shortly" state instead of crashing.
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
- `docs/project-state.json` — machine-readable status, always current. **Live state only since
  2026-08-23**: 28 closed round records and 17 settled blockers moved verbatim to
  `docs/checkpoints/closed-rounds.md`, which is the file to search before re-asking the founder
  anything. The file went from 80K to 28K, and it is step 1 of the resume protocol.
- `docs/website-steps.md` — blueprint (law; if reality diverges, update it first)
- `docs/qa-report.md` — sprint logs, Lighthouse, AI-detection verification of all 19 articles
- `docs/copy-reference.md` — copy provenance + sanctioned deviations
- `docs/design-review-2026-07-10.md` — R4 panel findings, every item dispositioned (FIXED/FOUNDER/DEFERRED/REJECTED); §8.13 in website-steps.md is the matching spec. 3D QA gotcha: hidden tabs freeze rAF, so the canvas looks dead in background automation tabs — verify with a visible window
- `docs/stories-image-prompts.md` — HISTORICAL since 2026-07-31: all 19 journal articles are photographed; the doc keeps the style block for any future article's hero prompt
- **`docs/store-go-live.md`** — the runbook for taking the store live, **already executed** on
  2026-08-22. Kept for the day a key has to be rotated or re-issued, and because it records what the
  real payment actually proved. It is written for a session with no memory of building the store.
- `docs/preorder-events.md` — how to run a ₹99 event price: create the tier row, generate the signed
  link with `npm run event-link`, print the QR, and read the event's conversion afterwards.
- `docs/checkpoints/` — per-phase snapshots. **Latest: `v3-migration-2026-08-23.md`** (the whole
  2026-08-23 engagement: the unit-cap store, ages 3+, the v3 re-skin, and its gotchas), with the
  full engagement tracker beside it as **`docs/checkpoints/migration-to-new-dsx.md`** (the twelve founder decisions,
  dashboard, QA log, SEO keyword map). Before them: `one-tap-and-cleanup-2026-08-23.md`,
  `preorder-store-2026-08-22.md` (the store round), `go-live-2026-07-28.md` (the launch),
  `repo-root-move-2026-07-28.md` (why the app sits at the repo root). Also here:
  **`closed-rounds.md`**, the 28 pre-store round records and 17 settled blockers that used to bloat
  `project-state.json` — search it before re-asking the founder anything
- `design-concepts/README.md` — 3 archived concepts, mascot cutout pipeline, Tripo3D 2D→3D pipeline (v2 runs incl. Janus fix + Lumi plush), engineering gotchas (overflow-x clip, scroll-snap wheel trap)
- `AGENTS.md` — Next.js 16 breaking-changes warning (read `node_modules/next/dist/docs/` before writing Next code)
- `tools/cutout/` — offline background removal (Swift + Apple Vision; compile with `swiftc -O main.swift -o cutout`). Every mascot/product cutout and video asset goes through it; never ship art with baked backgrounds. For thin pale details the Vision mask drops (hat ribbons), use `keycut.swift` (region-grow color-key; hybrid mode takes a Vision `--no-crop` alpha for the body: `keycut in.png out.png 24 vision-nocrop.png`).
- **Visuals: the calm ambient treatment** (R5, founder 2026-07-10 — the R4 flying journey overwhelmed; punch-list law §8.14). A fixed canvas sky glides the page's own washes behind SSR DOM, with a few translucent shapes that ghost to 4% under copy. The whole 3D stack lives in **`src/features/ambient-stage/`** (imported through its `index.ts`); the full 3D journey (GLBs in `public/models/`, mascot rigged clip-less + procedural idle) is DORMANT, one prop away: `<StageGate stage="journey" />`. **Never `dynamic(() => import(...))` any three-consuming module except `Stage.tsx`** — sibling entries emit twin chunks with duplicate three copies. 3D QA needs a VISIBLE window: hidden tabs freeze rAF, so the canvas looks dead in background automation.
- **Styling laws that still bind** (violating one is a review flag): italics ONLY as the v3
  editorial accent (founder decision #11, 2026-08-23, reversing the old zero-italics law:
  Instrument Serif ITALIC via `--font-editorial`, for editorial section titles and pull-quotes,
  one per composition, specced per page — never body copy or UI); all text left-aligned; **CTAs are brand orange `#EF762F` via the `action` token with `ink-head` labels — NO white text on the action fill anywhere** (V4 D1, §8.22-a; white measures 2.9:1 and the R5 white-label law is retired; `orange-cta #C25210` survives only as a dormant token; token-check is 16 mappings against v3); the finale is a WHITE room on every route (D5); serif ONLY in human quotes; 13px sans kickers in `orange-ink #b54a0d`, the only orange passing 4.5:1 on every wash; one CTA verb and one destination (every "Pre-order Lumi" button goes straight to `STORE_URL`, §8.25-b); every page ends with `FinaleCTA` (`id="reserve"`, which the mobile guide hides against and `LegalDoc` appends); Kheelu say lines ≤ 48 characters and the guide docks bottom-RIGHT (§8.22-d); **tilt never wraps a whole-card link** (`molecules/TiltCard.tsx`, §8.18 — pointer-tracked transforms drop clicks); **the priority plush image must stay the hero's LARGEST element** (it owns mobile LCP; two live regressions taught this, qa-report R11); nav tab is "PlayOS" and /playos is the VC-voiced platform page (V4 D6 — vision, moat, ArchitectureStack; still no per-unit pricing, kheelona.ai stays the only partner CTA); mobile perf verifies record BOTH Lighthouse throttling methods (simulate amplifies a headless artifact — judge by devtools numbers).
- **Registry law** (§8.19 + §8.21 + §8.22-h): new sections compose the shared molecules — `SectionHeading`/`Card`/`StepList`/`PageHero`/`CheckList`/`LegalDoc` plus V3's `AnswerBlock`/`FootnotesRow`/`KheelonaPlusBand`/`FamilyGrid`/`LumiModes` plus V4's `AudioMoments` (data ONLY from `lib/audio-moments.ts`)/`HowItWorksLoop`/`ArchitectureStack` — and take prices, CTA labels, ages and subscription copy from `@/config/site`. Hand-rolling those shapes is a review flag.
- **Retired in V3-5, do not resurrect or cite**: `MascotScene`, `KheeluSays`, `HeroConversation`, `KheeluIntro`, `WhyWeExist`, `Feelings`, `MeetLumi`, `WhatLumiDoes`, `HowItWorks`, `SafetyCallout`, `SafetyStrip`, `StickyMobileCTA`, `CurveDivider`, `Beat`, and the `teal-deep` token. **Retired in the v3
  migration (2026-08-23)**: the `line-soft` and `orange-deep` tokens (merged into `line` and
  `orange-ink`), `PLATFORM_AGES`, `isPreorderOpen`/`PREORDER_DEADLINE_*`, and the old
  `Design/design-system/` folder itself. **Retired in V4** (team feedback): `Statement`, `LaunchVideo` (component only — the film files stay in `public/video/`), `LearningRoom`, `BrainRoom`, the hero fact bubbles, the orange Room fill/Section wash, and the launch film's VideoObject in Home's JSON-LD. Older §8.x entries and checkpoints still name them because they describe what shipped at the time. Plan + architecture: `docs/redesign-plan-2026-07.md`. `public/video/launch.{mp4,jpg}` = the "Two friends" film (source `launch-video/src/FilmTwoFriendsVeo.tsx`).
- `gemini-handoff/` — founder generation kit (refs + seeds + prompts); product renders staged in `Design/product-images/generated-2026-07/`
