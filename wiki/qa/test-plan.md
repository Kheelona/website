---
title: "Test plan for the new kheelona.com: Phase 5 page checks, Phase 6 verification, beta, Gate B and Phase 8 smoke"
type: qa-test-plan
updated: 2026-10-12
sources:
  - ../raw/brief/kickoff-brief.md (§4, §6 QA, §7 Phases 5-8, §8, §9.1-9.12, §11)
  - architecture-review-2026-10-12.md (blocking B1-B4 and non-blocking N1-N26 this plan depends on)
  - ../engineering/architecture.md (§8 tracking, §9 SEO, §11 motion, §12 budget, §13 accessibility, §14 guardrails, §15 environments, §16 checkout), ../engineering/tasks.md (SCA, SPA, waves 5-7), ../engineering/structure.md (§5 page map)
  - ../site/tracking-inventory.md (rows 0-27 of the parity checklist; "What the new site must not change")
  - ../site/checkout.md ("What must not change", form and address fields, failure states, variants)
  - ../site/url-map.md (§4 redirects, §4d guessable 404s, §5 ad landing URLs)
  - ../site/content-boundary.md, ../site/strategy.md (§3 CTA rules), ../site/gate-a-progress.md (reviews not run; cross-page check not run)
  - ../research/posthog-audit.md (§11 recommended QA matrix: phones, browsers, laptops; issues 1-8)
  - baseline-2026-10-10.md (before figures; Lighthouse 13.4.1 and axe-core 4.12.1)
  - ../engineering/lessons.md (§1-§7 verification laws)
  - ../decisions/D021-D049 (policies, price wording D028, delivery D023 and D037, films D040, Gate A D041, motion D049, beta D048)
  - "Razorpay test details, fetched 2026-10-12: https://razorpay.com/docs/build/llm-docs/payments/payments/test-card-details.md (domestic test cards; OTP of 4-10 digits succeeds, fewer than 4 fails; mock bank page with Success and Failure) and https://razorpay.com/docs/build/llm-docs/payments/payments/test-upi-details.md (success@razorpay, failure@razorpay; in test mode a UPI cancellation results in a successful payment)"
  - "https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation (fetched 2026-10-12)"
---

# Test plan for the new kheelona.com

What QA verifies, how, with which tools, where, and what counts as a pass, from the first built page
(Phase 5) to the post-deploy smoke (Phase 8). Every brief §9 criterion has a test here, and every page
has acceptance criteria (§7). The Architect's guards (architecture §14) are QA's first instrument; QA
does not trust them until it has seen each one fail on a planted violation, and repeats every
"nothing fired" result with a control that shows the instrument records (lessons §7).

## 0. In one screen

- **Four environments:** local production build (L), local tracking probe under the real hostnames
  (LP), beta on betawebsite and betastore (B), production after Gate B (P). Tracking parity for GA4 and
  Meta is proven on LP before launch and on P after it, because beta has neither (D048).
- **Phones first:** the audit's matrix (§3), Chrome Android and WhatsApp's in-app browser before Safari.
- **The money path is tested in Razorpay test mode on betastore** with the five isolation preconditions
  of review item B4 recorded first (§6). Never a real order, never live keys, never production's
  database.
- **Exit:** every §9 criterion passes or the founder has waived it; no open S1 or S2 defect; DS
  checksums unchanged at the gate.

## 1. Scope, environments, evidence and defects

### 1.1 Environments

| Code | What | Build | Hosts | Tags | Used for |
|---|---|---|---|---|---|
| L | Local production build | `npm run build` (SITE_ENV `development`), `next start -p 3456` | `http://localhost:3456`, `http://store.localhost:3456` | none (hosts in no list) | Guards, visual and text parity, axe, sideways scroll, bytes, keyboard, redirects (Host header) |
| LP | Local tracking probe | same build | the real origins `https://kheelona.com`, `https://store.kheelona.com` served from the local build by Playwright request routing (§5.1) | gates open (real hostnames); every event-bearing request recorded and answered locally | Tracking parity rows 4-12, 14-18, CTA values, Lighthouse "tags loaded" profile |
| B | Beta | Vercel Preview from the `beta` branch (SITE_ENV `beta`) | `https://betawebsite.kheelona.com`, `https://betastore.kheelona.com` behind Vercel Authentication | PostHog only, `env=beta`; GA4, Meta Pixel, CAPI and Ahrefs absent | Real-host behaviour, noindex, store routing, test-mode payment, PostHog evidence, TTFB, founder review |
| P | Production | `main` after Gate B | `https://kheelona.com`, `www`, `https://store.kheelona.com` | all five tools | Phase 8 smoke, Lighthouse after, real beacons, first-real-order dedup |

`next dev` is used only for builder iteration, never for evidence, and only on `http://localhost:<port>`
(lessons §1: `127.0.0.1` does not hydrate under `next dev`).

### 1.2 Tools and versions

| Tool | Version | Why this version |
|---|---|---|
| Playwright (Chromium, WebKit) | as pinned by task 1.1 | screenshots, video, network capture, request routing, emulation |
| axe-core via `@axe-core/playwright` | 4.12.1 if the pin allows, else the pinned 4.12.x | same engine as the baseline (`baseline-2026-10-10.md`) for before/after |
| Lighthouse | 13.4.1 | same as the baseline; mobile form factor, median of 3, simulated and devtools-throttled runs both recorded (lessons §6) |
| jscpd | as pinned by 1.1 | duplicate code, threshold 1% on `src/` (tests excluded) |
| `npm audit` | npm 11 bundled with Node 24 | runtime high or critical advisories fail the gate |
| Repo guards | `npm run verify`, `npm run verify:e2e` | first instrument; each proven red before trusted |
| `node scripts/ds-checksums.mjs` | repo | before every gate |
| validator.schema.org and Google Rich Results Test | web | JSON-LD validity (content tests do not check validity, lessons §6) |
| HogQL through the PostHog MCP (read-only) | | PostHog-side evidence; no settings changes without the founder |

Until task 1.1 pins Playwright, axe and Lighthouse, QA runs them through `npx` with the exact versions
above. No bare `npm install`.

### 1.3 Evidence

- Screenshots, videos, HARs, Lighthouse JSON and axe JSON go to `wiki/raw/qa/<YYYY-MM-DD>/` (`visual/`,
  `axe/`, `lighthouse/`, `network/`, `payment/`, `smoke/`). They stay local and uncommitted (D039).
- Every result page cites its evidence file and the time (UTC). HAR files are scrubbed of the bypass
  secret and any cookie value before saving.
- Results: `results-<YYYY-MM-DD>.md` (Phase 6), `smoke-<YYYY-MM-DD>.md` (Phase 8).

### 1.4 Defects (`defects.md`)

| Severity | Meaning | Examples |
|---|---|---|
| S1 Blocker | Breaks a non-negotiable or a launch blocker | an ID, event name or parameter changed; a checkout logic or attribute change; price not matching the checkout; a placeholder, draft legal page or internal fact in production; a DS file changed; an existing URL that 404s or chains; beta indexable; GA4, Meta or CAPI firing on beta |
| S2 Major | A §9 criterion fails without a waiver | axe critical or serious (apart from the classified D041 exception); Lighthouse under 90; CWV over target; CTA not on the first phone screen; sideways scroll; visual parity over tolerance without an approved deviation; a broken keyboard path |
| S3 Minor | Visible but not a criterion failure | small spacing drift inside tolerance, a copy slip on a low-traffic page |
| S4 Trivial | Cosmetic, no user impact | |

Each defect records: ID, severity, page and viewport, owner (brief §8 routing: copy to Copywriter,
layout to Builder, speed to Architect and Builder, tracking to Builder and QA), steps to reproduce,
expected, actual, evidence file, and its status per round (open, fixed, re-test round n, closed or
reopened). A defect that fails three rounds is escalated with the root cause and options.

### 1.5 When each part runs

| Moment | Runs |
|---|---|
| Each Phase 5 page task | The task's own SPA evidence (tasks.md), then QA spot-checks: visual and text parity at 360 × 640, axe at 360, CTA values, sticky bar behaviour |
| Phase 6 (wave 7 task 7.1) | All of §4-§5 and §7-§9 on L and LP; defects to `defects.md` |
| Beta (task 7.2) | §2.3 preconditions, §4.2 noindex checks, §5.3, §6, Lighthouse and axe through the bypass, TTFB |
| Phase 7 regression | The suites touching whatever the CMO fixes changed |
| Gate B pack | Results summary, Lighthouse before and after, parity evidence, redirect matrix, placeholder list from a production dry-run build (§2.2) |
| Phase 8 (after the merge) | §10 smoke within the deploy window |

## 2. Preconditions

### 2.1 Every run

1. `node scripts/ds-checksums.mjs` prints "643 files match" and exits 0, run twice.
2. `lsof -nP -iTCP:3456 -iTCP:3000 -sTCP:LISTEN` is empty, or the listener is the server QA started
   for this run (kill stale ones by PID).
3. `git status` shows no stray file QA created; QA writes nothing outside `wiki/qa/` and
   `wiki/raw/qa/<date>/`.
4. Fresh browser profile per run; a real desktop or Android Chrome user agent for anything involving
   Meta (Meta drops headless Chrome, lessons §5).
5. The frozen-path diff against `archive/pre-reset-2026-10-10` is empty apart from the reviewed expected
   diffs (`test/guards/fixtures/authorised-diffs/`).

### 2.2 Local production build (L, LP)

- Build after the last change and after adding any asset (a running `next start` serves `public/` as
  it was at build time); clear `.next/cache/images` after replacing an image (lessons §1).
- `.env.local` holds Razorpay **test** keys only; the store runs against `tools/qa/supabase-stub.mjs`.
  Local runs never complete a payment (they stop at the open sheet, as `qa:payment` does), because a
  paid local order would send `purchase_confirmed` to the production PostHog project without an
  environment marker (review N4).
- **Production dry run before Gate B:** `KH_SITE_ENV=production npm run build` must fail while any
  placeholder or draft legal document remains, and its printed list is the founder's to-do list in the
  Gate B pack. After the founder's answers it must pass.

### 2.3 Beta

1. The five isolation preconditions of review item B4 are recorded by the main session (separate
   Supabase project, test Razorpay keys, no CAPI token or test code in Preview, test inbox for alerts,
   PostHog filter and revenue analytics excluding `env = beta`). QA does not start §6 without them.
2. `GET https://betastore.kheelona.com/api/health` (through the bypass) shows `"ok":true`,
   `"store":"ready"`, `"razorpay":"test"`, `"capi":"missing"`. If `store` is not ready, the beta database
   may be paused (no cron on Preview): wake it and re-check.
3. **Bypass secret handling** (review N5): QA receives the "Protection Bypass for Automation" secret
   privately and keeps it in an environment variable, never in a file in the repo or the wiki. Playwright
   adds `x-vercel-protection-bypass` and `x-vercel-set-bypass-cookie: true` only to requests whose host is
   `betawebsite.kheelona.com` or `betastore.kheelona.com` (a `page.route` on those two hosts), never through
   `extraHTTPHeaders`, so the secret never reaches Razorpay or any other origin. After the first document
   request on each host, the bypass cookie carries the session. No query-string bypass on any page that
   loads PostHog. After the run: a HogQL query for `$current_url` containing `x-vercel-protection-bypass`
   returns zero rows.
4. Reviewers use a private window (attribution cookies are on `.kheelona.com`, ADR-008).

### 2.4 Production (after the Gate B OK)

- The rollback tag exists on the live commit before the merge (lessons §8); the previous production
  deployment is noted.
- Smoke inside the agreed low-traffic IST window; QA's own production hits are timed so the founder can
  exclude them from traffic counts (as the baseline did).

## 3. Viewports and browsers

From the PostHog audit's recommended matrix (§11), phones first:

| Group | Viewports (CSS px) | Used for |
|---|---|---|
| Phones | **360 × 640**, **360 × 590** (short in-app browser), 324 × 566, 390 × 844, 393 × 695, **402 × 714**, 412 × 780 | first screen, sticky bar, visual parity (360 and 390, the approved widths), axe (360, 390), sideways scroll (all, plus 320) |
| Laptops | **1440 × 900** (approved width), 1440 × 800, **1920 × 1080**, 1536 × 730, 1280 × 600, 1512 × 860, 1366 × 768 (brief default; under 2% of laptop sessions) | visual parity (1440), axe (1440, 1920), sideways scroll and laptop layout (all) |

| Browser | How | Priority |
|---|---|---|
| Chrome on Android | Playwright Chromium, mobile emulation, CPU 4x and a 4G profile for timing | 1 |
| WhatsApp in-app browser (Android) | real device, founder-run script (§6.4); user agent emulation for the in-app note | 2 |
| Safari on iPhone | Playwright WebKit with iPhone emulation for layout; real iPhone by the founder on beta for `<dialog>`, sticky bar safe-area, scroll-snap, FAQ animation fallback | 3 |
| Instagram in-app (Android, iOS) | real device (§6.4) | 4 |
| Chrome on iPhone, Samsung Internet | spot checks on beta | 5 |
| Laptop Chrome, Edge, Safari | Playwright Chromium and WebKit at the laptop sizes | after phones |

## 4. Suites by brief §9

Where: L, LP, B, P as in §1.1. "Guard" means the Architect's test (architecture §14), run and also
proven red once.

### 4.1 Conversion (§9.1)

| Check | How | Where | Pass |
|---|---|---|---|
| One label, one destination | Every `.kh-btn--cta` on every route: text exactly "Pre-order Kheelu", `href` exactly `STORE_URL` (`https://store.kheelona.com` on L, LP, P; `https://betastore.kheelona.com` on B), same tab | L, B | 100% |
| One primary action per phone screen | Scroll sweep at 360 × 640 in 100 px steps on every page with the bar: count chilli buttons intersecting the viewport (inline plus sticky bar) | L, B | exactly one at every step after the hero CTA leaves (Home) or from first paint (product); never two; laptops may show nav plus hero (D041) |
| CTA on the first small-phone screen | Bounding boxes on Home and product at 360 × 590 and 360 × 640 | L | h1, CTA, price sentence and delivery line bottoms ≤ viewport height (D045 measured 584 px at 590) |
| Sticky bar behaviour | Product: visible at first paint, steps aside while the hero CTA or the offer card's button is on screen; others: appears after the hero CTA leaves; hidden from 900 px; never covered; safe-area padding on WebKit | L, B | as stated, per page (§7) |
| Price, delivery, returns beside every CTA | DOM order inside each CTA block: button, price sentence, trust line, help line (CMO mockup pass) | L | every CTA block |
| Price matches the checkout | Price sentence, sticky bar, offer card, JSON-LD `price`, `llms.txt`, `pricing.md`, Meta `ViewContent` value all equal the store's amounts for the current mode (token: ₹499 today, ₹4,500 balance, ₹4,999 total; full: ₹7,999) | L (stub in each mode), B | identical everywhere |
| Trust signals real | Trust items only from `content/en-IN/trust.ts`; each links to its terms; no payment method not offered (D024: UPI, card, net banking; no COD, EMI or wallet badge) | L | |
| FAQ near the close | Home, product, safety, guide: FAQ section directly before the close | L | |
| No dead ends | The last section before the footer of every marketing page contains a link or button to a next step | L | every page |
| Fewest taps | CTA → store page → form → pay: no interstitial, no cart, no account | B | 1 tap to the store |

### 4.2 SEO

| Check | How | Where | Pass |
|---|---|---|---|
| Every existing URL 200 or one-hop 308 | §8 matrix | L (Host header), B, P | no 404, no chain (platform exception: `http://` adds Vercel's HTTPS hop; `www` is one hop only after the founder switches it to serve the project) |
| Title ≤ 60, description ≤ 155, unique | Parse `<title>` and `<meta name="description">` of every route; compare with the copy page | L | 100%, exact text as the copy page |
| One h1, logical heading order | DOM walk | L | no skipped level |
| Canonical and `lang` | `<link rel="canonical">` = `https://kheelona.com/<path>` on every environment; `<html lang="en-IN">` | L, B | |
| Open Graph and Twitter complete | `og:title`, `og:description`, `og:url`, `og:image` (1200 × 630, ≤ 200 KB, fetchable on P), `og:site_name`, `og:locale` `en_IN`, `twitter:card` `summary_large_image` on every route (Next merges metadata shallowly, lessons §1) | L, P | every route |
| Alt text | Every `<img>`: meaningful alt, or `alt=""` with decorative role; no file names as alt | L | |
| Internal links and breadcrumbs | Crawl every internal link: 200 or a single 308 to a 200; breadcrumbs visible on articles and equal to BreadcrumbList | L | |
| Sitemap | `/sitemap.xml`: canonical 200 URLs only (no `/playos`, no 2-year-old article, no store URLs); `lastmod` only where a stored date exists | L, P | |
| robots.txt | `*` allowed; GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, Applebot-Extended, CCBot allowed; Bytespider `Disallow: /`; sitemap URL (D041) | L, P | |
| 404 page | Unknown path: HTTP 404, server-rendered with chrome and CSS (not the empty `__next_error__` shell), `noindex`; unknown article slug the same (`dynamicParams = false`) | L, P | |
| JSON-LD | Per page type (§7); validator.schema.org with zero errors; Rich Results Test for Product, FAQPage, BreadcrumbList, BlogPosting; every FAQ answer, price and policy number in JSON-LD appears in the visible text (strip `<script>` blocks before counting, lessons §6); no ratings or reviews | L (HTML), P (live validators) | zero errors |
| Server HTML holds the content | Fetch each route with JavaScript disabled; visible text equals the JS-on text except interactive extras | L | |
| **Beta noindex** | Every HTML route on both beta hosts: `x-robots-tag: noindex, nofollow` and `<meta name="robots" content="noindex, nofollow">`; non-HTML (`/llms.txt`, `/pricing.md`, `/sitemap.xml`, an image, a film): the header too (review N1); robots.txt still readable (never `Disallow` with noindex) | B | 100%; S1 if any HTML route lacks it |
| Production indexing | Apex pages have no noindex; store has both header and meta noindex | P | |

### 4.3 AEO and GEO (§9.3)

- Answer-first blocks: question heading, then a 40-60-word answer (guard counts words; QA re-counts on
  the rendered text of each page listed in §7).
- Entity facts identical in pages, JSON-LD, `llms.txt` and `pricing.md`: "Kheelu by Kheelona", ages 3 to
  7, ₹4,999 (incl. GST) first, made in India, support "WhatsApp or call +91 91875 46483".
- `/llms.txt` and `/pricing.md`: 200, plain text, restate visible copy only, dated `*_UPDATED` constant,
  no banned line, no internal fact (§4.8), mode-aware.
- Sources: every statistic on a page carries a source marker that links to a visible source (D026).

### 4.4 Performance

| Check | How | Where | Pass |
|---|---|---|---|
| Lighthouse mobile, median of 3 | Pages: Home, product, store, `/ai-toys-for-kids-in-india`, `/team`, `/safety`, `/stories`, `/privacy`, `/contact`, `/stories/learning-toys-for-a-three-year-old` (the baseline's set with `/playos` replaced). Profiles: (1) **LP-tags**: Chrome with host-resolver rules to the local build, tags allowed to load, beacons blocked with Lighthouse's blocked URL patterns (`*google-analytics.com/g/collect*`, `*facebook.com/tr*`, `*/ingest/e/*`, `*/ingest/s/*`, `*/ingest/i/*`, Ahrefs' event endpoint as observed), fresh profile; (2) **B** through the bypass cookie; (3) **P** after deploy | LP, B, P | ≥ 90 in all four, aiming 95. Authoritative: Performance and Best Practices from LP-tags then P (the HTTPS audit flip on the `http://` LP origin is listed and discounted); SEO from LP-tags (B is noindex by design and cannot pass SEO); Accessibility from any. Pre-approved exceptions (B10): Best Practices about 74 on P (Meta's third-party cookie), store SEO about 66 (noindex) |
| Before and after | Same 10 pages against `baseline-2026-10-10.md` (Home 86, store 85, guide 80, product 90 mobile Performance) | P | reported in the Gate B pack (LP-tags) and Phase 8 (P) |
| Core Web Vitals, lab | Playwright at 390 × 844, CPU 4x, 4G: LCP and CLS from `PerformanceObserver`; INP from Event Timing entries over a fixed script of interactions (open and close the drawer, open a FAQ, films next, play a film, type in the store form) | L | LCP ≤ 2.5 s, CLS ≤ 0.1, every interaction ≤ 200 ms |
| Font shift | Same run with font requests delayed 1.5 s: CLS on Home's hero (the Kalam accent, review N17) | L | CLS ≤ 0.1 |
| Bytes per route | HAR transfer sizes by type (bytes, not attributes, lessons §2), compared with architecture §12, plus the HTML document budget once set (review N16) | L | within budget |
| LCP element | The LCP element is the intended hero image or heading, loaded with `fetchPriority="high"` (review N12), never under `data-reveal` | L | |
| Films | No `<video>` at rest; posters only; a film ≤ 4 MB transferred on play; no film bytes before play | L | |
| TTFB and region | `x-vercel-id` on store and marketing responses names the function region `bom1` (ADR-009); `curl -w` timings from QA's network (recorded with location); the founder runs the same one-line command from an Indian network on beta and on P | B, P | store TTFB ≤ 800 ms from India |
| Field data | PostHog `$web_vitals` p75 by page and device for 7 days after launch | P | reported at 24 h, 72 h, 7 days |

### 4.5 Accessibility (§9.6)

| Check | How | Where | Pass |
|---|---|---|---|
| axe | WCAG 2.0, 2.1 and 2.2 A and AA plus best practice; every route at 360, 390, 1440 (templates also 412 and 1920); reveals forced and a 1.5 s settle (axe skips `opacity: 0`); states: drawer open, FAQ open, a film playing (video mounted), sticky bar shown, store form with errors, `/thanks` address form; reduced motion on and off | L, B | zero critical or serious, apart from the D041 white-on-Chilli exception classified by selector (`.kh-btn--cta`) and printed every run; white on Kheelu Blue printed separately until the founder rules (review question 3) |
| Keyboard | Tab sweep of every route: skip link first and working; every interactive element reachable in a sensible order with a visible DS focus ring; drawer opens with Enter or Space, focus moves inside, background inert, Escape and the backdrop close it, focus returns to the menu button, `aria-expanded` toggles; FAQ items toggle with Enter or Space; films previous and next buttons disable at the ends, play buttons named "Play: {chip}. {caption}"; store form fully operable, errors announced and focus moved to the first error | L | every route |
| Contrast | From axe plus a token check of text on band surfaces | L | |
| Reduced motion | §4.7 | L | |
| Language | Language chips carry `lang` (G-13); `<html lang="en-IN">` | L | |
| Media | Films have burned-in captions; no autoplay; decorative art `alt=""` and no focusable child inside an `aria-hidden` wrapper (lessons §2) | L | |

### 4.6 Mobile first (§9.10)

- No sideways scroll: `document.documentElement.scrollWidth > clientWidth` is false on every route at 320,
  324, 360, 390, 402, 412 and every laptop size; check after forcing reveals, with the drawer open, and
  with the films strip scrolled to each end and its focused tile scaled (D049 pick 8). Never `innerWidth`
  (lessons §2).
- Tap targets: for every link and button, sample points on the edge of a 44 × 44 box centred on it;
  `document.elementFromPoint` must return the element or a descendant (this counts the ported `::before`
  tap extensions). A DS component that fails is logged as a DS gap, not patched.
- Nothing depends on hover: every hover rule in the compiled CSS reviewed; no content or control appears
  only on hover; the D049 arrow nudge sits under `@media (hover: hover)`.
- Forms: computed input font-size ≥ 16 px; types, `inputMode` and `autocomplete` exactly as §9.
- Phone images: at 390 px no image transfers more than about twice its rendered CSS width × DPR; DS
  stickers never served at source size.

### 4.7 Motion (§9.11, D041 G4, D049)

| D049 pick | Test | Reduced motion |
|---|---|---|
| 1A reveals | Below-the-fold sections fade and rise by `space-4` over `duration-enter`, once; anything in view at load is shown without a fade; the first section, h1, price sentence, chilli buttons and offer card never carry `data-reveal` (guard plus DOM scan); client navigation re-arms reveals (navigate Home → product → back) | visible at once or plain fade, no movement |
| 2A hero still | At first paint the hero's computed `opacity` is 1 and `transform` none; no animation on hero elements (`element.getAnimations()` empty) | same |
| 3B doodles draw | Below-the-fold doodles start at `stroke-dashoffset` 1 and reach 0 within `duration-draw` after entering, staggered; hero doodles are fully drawn at first paint; doodles are `aria-hidden` | drawn at once |
| 4A sticky bar | Slides up once (`translateY(100%)` to 0, `duration-base`), then only steps aside | fades only |
| 5A drawer | Panel slides from the right over `duration-enter`; scrim fades | appears without sliding |
| 6B orange button | On pointer devices the arrow moves by the approved distance on hover; the DS press on tap; nothing on touch-only devices | no nudge |
| 7B FAQ | Answer opens with the grid-rows animation where supported and instantly elsewhere; plus turns to a cross | instant |
| 8B films focus | The film in focus scales to the approved value over `duration-base`; no sideways scroll at the strip's ends | no scale |

Also: only `transform` and `opacity` animate apart from the two founder-approved exceptions
(`stroke-dashoffset`, `grid-template-rows`) found by sampling `getAnimations()` and computed transitions;
nothing loops (after 6 s, `document.getAnimations()` returns nothing running); nothing moves for more
than five seconds; nothing flashes; no scroll-jacking; smooth scrolling off under reduced motion. A
performance trace at CPU 4x during reveals and the doodle draw shows no frame over 50 ms caused by
them, and motion adds zero CLS.

### 4.8 Content integrity and the content boundary

Run on every page, its metadata, JSON-LD, `llms.txt`, `pricing.md` and the store pages (QA brief: Phases
3, 6 and 8).

| Check | How | Pass |
|---|---|---|
| Internal material ([content boundary](../site/content-boundary.md)) | Scan rendered text and machine files for: competitor names (the brief's list: Yoto, tonies, Lovevery, KiwiCo, Miko, PlayShifu, Smartivity, Skillmatics, boAt, Lenskart, Mamaearth, The Whole Truth, Wakefit, Allbirds, Warby Parker, Oura, plus every brand in `research/d2c-benchmarks.md`); any percentage (each one reviewed: allowed only with a public source marker, D026); unit counts other than "first 500 units" once in the price FAQ (D041); analytics words (sessions, conversion, funnel, bounce, PostHog figures); "PostHog" outside `/privacy`; positioning language (pillars, personas) | zero hits outside the allowed cases; any hit is a defect (S1 in production) |
| Placeholders and drafts | On B: the list of visible `[PLACEHOLDER …]` markers per page equals the copy pages' lists; on the production dry run (§2.2): build fails until none remain; draft legal documents refused | |
| No invented claims | Banned-phrases guard green; every claim sentence on Home, product, safety and the guide traced to a `claims.md` row or a decision (sample of all, recorded) | 100% traced |
| Mockup-only markup | No `mk-` class, no `data-src` attribute, no "Rewritten in the build" label in production HTML (review N22) | zero |
| en-IN spelling | US-spelling list over rendered text (review N24) | zero |
| Age band | "3 to 7" (or the copy's form) present on Home, product, safety, the guide, the hub, each article, team, setup, `llms.txt`, Product JSON-LD `audience` (3-7) and the Home and product meta descriptions; nothing implies under 3 ("2-year-old", "toddler", "18 months", "baby") | |
| Cross-page facts (the check that never ran at Gate A) | Price sentence identical to D028 for the mode on every page; delivery line identical (D023); trust items identical; seller lines identical in the footer, `/contact`, the store footer and the legal pages; support number and grievance officer identical (D029, D032); returns 7 days from delivery, warranty 6 months, refunds start within 2 working days (D021, D022, D042) | identical |
| India e-commerce (§9.7) | Seller name, GSTIN, registered address, grievance officer with contact and response times; return, refund, exchange (none) and shipping policies reachable from every page footer and the store; country of origin "Made in India"; MRP ₹7,999 inclusive of all taxes on the product page; total price incl. GST beside every CTA; BIS status worded exactly as `/safety` ("applied for, not yet granted"), no ISI mark | present and consistent |
| Children's data copy | `/privacy` and `/safety` describe only documented practice (D019, D020, D035, D047 order-data location) | each statement traced |

### 4.9 Design-system compliance and reuse (§9.9, §9.12)

- DS checksums unchanged (before every gate).
- Off-token guard green; independently, the compiled CSS contains no hex, `rgb()` or pixel value outside
  `tokens.css`, `bundle.css`, the four breakpoints and the D049 exception; built HTML has no Tailwind
  arbitrary-value class (`[…]`) and no `style` attribute other than art-board percentages and `--kh-tilt`.
- Only DS components and assets: every `<img>` source is a DS asset (or its generated derivative) or an
  allowed non-DS file (films and posters D040, app screens D044, team photos B24, Ideabaaz logo B29).
- Visual parity of the homepage with the approved mockup within the agreed tolerance (page height ±2%,
  each screen-height chunk ≤ 2% differing pixels at Playwright's default per-pixel threshold), at 360,
  390 and 1440, with fonts loaded (`document.fonts.ready`), reveals forced, reduced motion on and lazy
  images scrolled in. **Calibration first:** mockup against itself must give zero; a first Home run
  with chunk diffs saved; if raster recompression alone exceeds the tolerance, those image regions are
  masked and their boxes compared instead (position and size within 1 px), recorded as a method note.
  Every other page uses the same harness; a chunk over tolerance is a defect unless the main session
  lists it as an approved deviation.
- `jscpd` under 1% on `src/`; asset hash duplicates zero; every component folder has a catalogue row
  with the right status; every `public/` file is referenced or marked FOUNDER; the dependency register
  matches `package.json`; new packages pinned exact.
- `npm audit --omit=dev`: no high or critical advisories; dev advisories reported.

## 5. Tracking parity evidence (§9.4, blocks launch)

The checklist and IDs are owned by the [tracking inventory](../site/tracking-inventory.md#parity-checklist-phase-6-qa);
this section says how QA captures each row's evidence.

### 5.1 Instruments and controls

| Destination | Instrument | Control that proves the instrument records |
|---|---|---|
| GA4 | `window.dataLayer` contents (the `config G-7LMKSFEXZ9` entry and each `event`), plus every `*google-analytics.com/g/collect*` request recorded by Playwright routing and answered 204 locally (the body holds batched events) | the same probe against a build of the tag `archive/pre-reset-2026-10-10` shows the same entries |
| Meta Pixel | `fbq.getState().pixels[0].eventCount` (1 on an ordinary page, 2 with ViewContent) and a hook on `HTMLImageElement.prototype.src` installed by `addInitScript` (the pixel beacons through an `<img>`; fetch, XHR and `sendBeacon` hooks see nothing, lessons §5); Playwright routing of `www.facebook.com/tr*` answered 204 as a second instrument | the tag build shows `ev=PageView` and, on the product page, `ev=ViewContent` |
| PostHog | Playwright routing of `/ingest/**`: event-bearing paths (`/ingest/e/`, `/ingest/i/…`, `/ingest/s/` replay, batch endpoints, exact paths recorded as observed) answered 204 and their bodies decompressed (gzip or base64) and saved; config paths allowed | the tag build shows `$pageview` and `$autocapture` with `cta` |
| Ahrefs, Vercel WA | Ahrefs: SSR `<head>` contains the script with `data-key` and `async` (curl); its event request recorded and answered 204. Vercel: the script requested from the obfuscated same-origin path and `window.va` or `window.vai` present (lessons §1) | tag build |
| Server events | Unit tests (`meta-capi.test.ts`, `posthog-server.test.ts`) for payload shape; beta: HogQL for `purchase_confirmed` with `env = 'beta'`; production: Vercel log lines `[meta-capi] SENT purchase_<ref>` (founder, dashboard) and Events Manager "Multiple" on the first real order | |
| Edge cookies | `curl -D -` of tagged landings (Set-Cookie for `kh_utm`, `kh_fbclid`: `Domain=.kheelona.com; Secure; HttpOnly; SameSite=lax`); a second tagged landing must not overwrite | tag behaviour recorded in the inventory, 2026-10-11 |

**How LP serves the real origins.** Chrome is not pointed at `http://kheelona.com:3456` (Secure cookies
would be refused over plain HTTP). Instead Playwright routes every request for `https://kheelona.com/*`
and `https://store.kheelona.com/*` to the local server, passing the original hostname as the `Host`
header, and fulfils the response, so the page runs on the real HTTPS origin, the host gates open,
cookies behave as on production, and nothing leaves the machine except script and config downloads.
Before relying on it, QA proves the method with two controls: a request whose response shows the store
host was routed to `/store/*` (so the `Host` header arrived), and a tagged landing whose `kh_utm` cookie
is then present in the browser context (so `Set-Cookie` from a fulfilled response is honoured). If
either fails, the fallback is a local TLS-terminating proxy with a trusted test certificate.
`/ingest/**` is answered before it reaches the local server (whose rewrite would forward to PostHog). A
**control host** run (`http://localhost:3456`) must show no `fbq`, no `gtag` and no `/ingest` requests.

### 5.2 Rows and where each is proven

| Row | What | LP | B | P |
|---|---|---|---|---|
| 0 | Measurement code unchanged | freeze and parity guards green; diff empty apart from reviewed diffs | | |
| 1 | Host gates | control host loads nothing; unit tests | GA4 and Meta absent; PostHog present | all three present on apex and store |
| 2 | Vercel WA pageview | script on LP (no reporting locally) | present (Preview) | script requested; dashboard pageviews (founder) |
| 3 | Ahrefs | in SSR `<head>` of every route on L | **absent** (founder decision pending, review N6) | in SSR `<head>` of every route on both hosts (curl) |
| 4 | GA4 `page_view` | `dataLayer` config `G-7LMKSFEXZ9`; collect with `en=page_view` | **zero** google requests | collect `tid=G-7LMKSFEXZ9&en=page_view`; Realtime |
| 5-6 | `preorder_form_started`, `preorder_start` (`tier`) | one each, GA4 and PostHog payloads identical | PostHog only, `env=beta` | GA4 and PostHog |
| 7 | `begin_checkout` / `InitiateCheckout` | `currency INR`, `value` 499 (not 49900), `tier`; Meta `content_category` (sandbox sheet via `qa:payment`-style run stopped at the open sheet) | PostHog only | form up to the open sheet is not run on P (review N10) |
| 8 | `purchase` / `Purchase` with eventID `purchase_<ref>` | not completed locally (§2.2); payload shape by spies | PostHog `purchase`, `transaction_id` = `KH-…`, value 499 (§6) | first real order: Events Manager Purchase "Multiple" |
| 9 | `preorder_address_saved` | | §6 | |
| 10 | `preorder_dismissed` | close the sandbox sheet | §6 run D | |
| 11 | Meta `PageView` | `eventCount` 1 on an ordinary page; `pushState` adds exactly one; no double on landing | **zero** facebook requests | real UA: `eventCount` 1; image hook shows `ev=PageView` |
| 12 | Meta `ViewContent` | `/products/kheelu` and `/` (B9): `content_name Kheelu`, `content_ids ["lumi"]`, `content_type product`, `value 4999` (token), `currency INR`; `eventCount` 2 | zero | `eventCount` 2 on both pages |
| 13 | CAPI `Purchase` | unit test payload; never a test code in production | **off**: `capi: missing`, no Meta request from the server (founder log check: `SKIPPED`) | first real order: log `SENT … events_received=1` |
| 14 | PostHog `$pageview`, `$pageleave`, `$autocapture` with campaign keys incl. `utm_id`, `placement` | bodies show them; requests only to `/ingest/` (none to `*.posthog.com` from the page) | events with `env=beta` from both hosts (HogQL) | live view from both hosts |
| 15 | `$autocapture.cta` | every chilli button carries a registered value; the set per page equals §7; `home-arc` and `compare` appear nowhere | HogQL counts by `cta` with `env=beta` after QA's sweep | HogQL by `cta` after launch |
| 16-16a | `$exception`, `$web_vitals`, `$rageclick`, `$dead_click`; GeoIP | | appear with `env=beta` | appear within a day; country not one location |
| 17 | Replay starts on store `/`, never on `/thanks` | | recorder loads on betastore `/`, not on `/thanks` (with control) | same on store.kheelona.com |
| 18 | `/thanks` autocapture suppressed | container has `ph-no-capture ph-mask` in every branch | no `$autocapture` with page text on `/thanks` | same |
| 19 | `purchase_confirmed` | unit test | one per beta purchase, `env=beta`, `source webhook`, campaign keys, `$process_person_profile false` | one per `purchase` |
| 20 | `/ingest`, `/ingest-assets` rewrites, trailing slash kept | not verifiable on `next start` (lessons §1) | `GET /ingest/e/` answers 400 on both beta hosts and direct (control) | same on apex and store |
| 21 | Edge cookies | curl on L with Host headers | curl on beta hosts (cookies on `.kheelona.com`) | curl tagged landings on apex, store, a trailing-slash URL |
| 22 | Order row `utm`, `fb_attrib`, `ph_distinct_id` | stub records the insert | `purchase_confirmed` carries the landing's `utm_source` (§6) | |
| 23 | `/thanks?ref&t` claim | curl on L: 303, `Set-Cookie: kh_order`, `cache-control: private, no-store` | same on betastore; no analytics request contains `t=` | same |
| 24 | Webhook | route tests | optional test webhook delivery log (founder) | URL unchanged in the dashboard |
| 25 | CSP | header string equals the tag's | no new `csp-report` entries for tracking origins | same |
| 26 | DNS verification | | | `dig TXT kheelona.com` before and after |
| 27 | `/privacy` disclosure | `analytics-tags` re-pinned (review B2c) green; each tool named | | |
| New | CTA values; B11 `preorder_payment_window_opened`, `preorder_payment_failed` (`reason_code`, `reason`), `preorder_form_rejected` (`fields`, no values); `?internal=1` and `?internal=0` | GA4 and PostHog only; Meta never receives them | PostHog with `env=beta`; `internal` registered and cleared | after launch |

### 5.3 Beta capture (one session per host)

A full HAR of a scripted walk (every marketing page at 390 × 844, then the store and `/thanks` through
§6) must contain **zero** requests to `googletagmanager.com`, `google-analytics.com`,
`connect.facebook.net`, `facebook.com`, `analytics.ahrefs.com` or `graph.facebook.com`, and must contain
`/ingest/` event requests whose decoded bodies carry `env: "beta"` on every event. A HogQL query over the
session's time window returns the same events with `env = 'beta'` and none without it.

### 5.4 Production capture (Phase 8)

Real desktop and Android user agents, every tag allowed (this is the one run that reaches the real
properties; QA's hits are timed and listed): GA4 collect with `tid=G-7LMKSFEXZ9`; Meta `eventCount` and
image-beacon URLs with `id=1051265191046395`; PostHog `/ingest/` requests from both hosts; Ahrefs and
Vercel WA scripts; edge cookies; replay control; the redirect matrix. The first real order after launch
is checked for: one `purchase` and one `purchase_confirmed`, Events Manager Purchase with connection
"Multiple", the `[meta-capi] SENT` log line (founder).

## 6. Razorpay test-mode payment on betastore

### 6.1 Preconditions

The five B4 items recorded (§2.3), `/api/health` as in §2.3 step 2, the bypass routing in place, a test
inbox address from the main session for the parent email field (never a real parent's address), test
names such as "QA Test Parent".

### 6.2 Run A: happy path (UPI), Chromium at 390 × 844, real Android Chrome user agent

| Step | Action | Capture and pass condition |
|---|---|---|
| 1 | Open `https://betawebsite.kheelona.com/products/kheelu?utm_source=qa-beta&utm_medium=test&utm_campaign=qa-<date>&utm_id=qa1&placement=qa&fbclid=QAbeta<timestamp>` | `Set-Cookie` for `kh_utm` and `kh_fbclid` on `.kheelona.com`; PostHog `$pageview` with the campaign keys and `env=beta`; no GA4, Meta or Ahrefs request |
| 2 | Tap the hero CTA (`product-top`) | navigation to exactly `https://betastore.kheelona.com/` in one tap; `$autocapture` with `cta = product-top` |
| 3 | Type one character in "Your name" | exactly one `preorder_form_started` (`tier: launch`) |
| 4 | Fill the four fields, tick the box, tap "Pay ₹499 and reserve" | `preorder_start`; `POST /api/preorder/create-order` body has the contact fields, `tier`, `utm` (if the URL carried one), `phDistinctId`, and **no amount**; response `amountPaise` 49900; Razorpay `checkout.js` requested only now (not on page load); button labels move through "Setting up your payment…" and "Opening the payment window…" |
| 5 | Sheet opens | Razorpay's test-mode banner visible; prefilled name, email, phone; `begin_checkout` with `value` 499; `preorder_payment_window_opened` if task 6.2 has landed |
| 6 | Pay by UPI `success@razorpay` | `purchase` with `transaction_id` `KH-…`, `currency INR`, `value` 499, `tier launch`; `POST /api/preorder/confirm` 200 |
| 7 | Redirect | `/thanks?ref=KH-…&t=…` answers 303 with `Set-Cookie: kh_order` (path `/thanks`, HttpOnly) and `cache-control: private, no-store`, then a clean `/thanks`; no analytics request contains `t=` |
| 8 | Confirmation page | "Pre-order confirmed" state with the order number, amount paid and the delivery line (see N9 for older orders); container carries `ph-no-capture ph-mask`; PostHog replay recorder not loaded on `/thanks` |
| 9 | Save an address (PIN with `inputMode=numeric`, state from the select) | `preorder_address_saved` with `transaction_id`; "We have your address." |
| 10 | Server side | HogQL: one `purchase_confirmed` for that `transaction_id` with `env = 'beta'`, `value` 499, `tier launch`, `source webhook`, `utm_source = qa-beta`, `$process_person_profile false`; receipt email at the test inbox with a `https://betastore.kheelona.com/thanks?ref=…` link; internal alert at the test inbox only |
| 11 | Whole run | HAR: zero GA4, Meta, Ahrefs requests; every PostHog event carries `env=beta` |

### 6.3 Other runs

| Run | How | Pass |
|---|---|---|
| B card success | Visa `4100 2800 0000 1007`, any future expiry, any CVV, an OTP of 4-10 digits on Razorpay's mock bank page | same as A from step 6 |
| C payment failure | UPI `failure@razorpay`, or a card OTP of fewer than 4 digits, or the mock bank page's Failure button | no `purchase`; the order stays unpaid; the parent sees Razorpay's failure and can retry; `preorder_payment_failed` with Razorpay's `error.code` and `error.reason`, no free text (when 6.2 has landed) |
| D dismiss | Close the sheet without paying (not a UPI cancel: in test mode a UPI cancellation counts as a success) | `preorder_dismissed` once; the copy says nothing was charged |
| E validation | Submit empty, then an invalid phone and PIN | errors tied to fields and announced, focus on the first error, no create-order request; `preorder_form_rejected` with field names only (when 6.2 has landed) |
| F second click and refresh | Tap Pay twice quickly; refresh `/thanks` | one order; `/thanks` stable; one receipt |
| G event tier (optional) | A signed `/e/<tier>` link created by the founder for the beta project | token shape kept; a bad signature shows "This link is not one of ours…" |
| H webhook (optional) | If the founder adds the test webhook (architecture §15.4 step 7): Razorpay's test delivery log shows 200; a redelivery sends no second receipt | idempotent |

Full mode and the price-flip refusal cannot be reached on beta without 500 paid orders; they are
covered locally with the Supabase stub reporting each mode (both renderings) and by the frozen route
tests. No refunds are run, even in test mode, unless the founder asks.

### 6.4 In-app browsers (real devices)

Audit issue 2: the three unpaid orders were all in WhatsApp or Instagram browsers; WhatsApp's browser
is 35.7% of phone sessions. Working default B12 makes the in-app note depend on this check. The founder
runs a QA-written script on an Android phone (and an iPhone for Instagram): open a betastore link from a
WhatsApp chat and from an Instagram DM, fill the form, open the sheet, pay by UPI `success@razorpay`
(test mode), and report what happened at each step with screenshots. Access uses a short-lived bypass
secret created for this test and revoked afterwards (review question 5). Result decides whether the
in-app note ships (main session).

### 6.5 Local sandbox (every store task in Phase 5)

`npm run qa:payment` against the stub with test keys: reaches the open sandbox sheet; refuses a live key.
Its webhook signing step uses the local secret, so it is a local check only, not a beta one.

## 7. Per-page acceptance criteria

### 7.0 Common to every marketing page

Visual and text parity with its mockup (§4.9); `lang="en-IN"`; title and description exactly as the copy
page; canonical; Open Graph and Twitter complete; one h1; Organization and WebSite JSON-LD once (from the
shell); skip link; nav with `aria-current`; laptop nav button (`navbar`) only from 1024 px; drawer button
`navbar-mobile`; footer with seller lines, policy links and `#grievance` link; axe clean (§4.5); keyboard
path; no sideways scroll; tap targets; no placeholder on production; no internal material; reveals per the
mockup's `data-reveal` and never on the first section; ends with a next step.

### 7.1 Pages

| Page | URL | Mockup | `cta` values on the page | Sticky bar | JSON-LD (besides the shell) | Page-specific checks |
|---|---|---|---|---|---|---|
| Home | `/` | `home.html` | `hero` (`id="hero-cta"`), `see-it-ask`, `safety`, `finale`; secondary `hero-learn`, `see-it-ask-learn`, `safety-learn`, `compare-learn`, `faq-more`; `navbar`, `navbar-mobile`, `sticky-bar` | after the hero CTA leaves | FAQPage = the six visible answers | Hero exactly D045 with the Hand accent on "asks one back."; first screen at 360 × 590 (§4.1); films strip: no `<video>` at rest, labels "Play: {chip}. {caption}", "Previous video", "Next video", position text "1 of 7" (phone) and "1–3 of 7" (laptop), one film at a time, pauses when scrolled away; guides fold 7b links to `/stories#screen-time`, `#talking`, `#learning`; comparison as cards below 720 px and table from 720 px; Meta `ViewContent` (B9) |
| Product | `/products/kheelu` | `meet-kheelu.html` | `product-top`, `product-offer`, `product-safety`, `product-foot`; secondary `product-safety-learn`; `navbar`, `navbar-mobile`, `sticky-bar` | from first paint; steps aside for the hero CTA and the offer card's button | Product + Offer: `@id` `https://kheelona.com/products/lumi#product`, `name` "Kheelu by Kheelona", `alternateName` "Lumi", `price` 4999 (token) or 7999 (full), `priceCurrency` INR, `availability` PreOrder, `availabilityStarts` 2026-11-15, `eligibleRegion` IN, no `priceValidUntil`, return policy (7 days from delivery, full refund, free pickup), shipping (0 INR, IN, no delivery-time claim), warranty 6 months, `audience` 3-7, no rating; FAQPage | Fragments `#faq`, `#story-mode`, `#reserve`, `#offer`, `#specs` exist (`/faq` redirect lands on `#faq`); `ViewContent` value 4999 (token); speech disclaimer (D025); declarations incl. MRP ₹7,999 inclusive of all taxes, origin, manufacturer, consumer care; F4 placeholders visible on beta only; details fold per the N21 decision |
| Safety | `/safety` | `safety.html` | `finale`, `sticky-bar`, nav values | yes | FAQPage | D020 order in full; certification "applied for, not yet granted", no ISI mark; app screen the same size as the Home parent-app screen (D046); age 3 "with a grown-up nearby" (D041) |
| Buyer's guide | `/ai-toys-for-kids-in-india` | `ai-toys-for-kids-in-india.html` | `finale`, `sticky-bar`, nav values | yes | FAQPage | No competitor names; answer-first hero 40-60 words; five checks; sources with markers; all `mk-gd-*` compositions ported (review N20) |
| Stories hub | `/stories` | `stories.html` | `finale`, `sticky-bar`, nav values | yes | none beyond the shell | 21 guides under four topics with anchors `#screen-time`, `#talking`, `#ai-and-safety`, `#learning`; every guide linked once rewritten; no "Rewritten in the build" label in production |
| Article, learning toys at 3 | `/stories/learning-toys-for-a-three-year-old` | `story-learning-toys-for-a-three-year-old.html` | `finale`, `sticky-bar`, nav values | yes | BlogPosting (headline, description, image, stored `datePublished` and `dateModified`, author, publisher), BreadcrumbList = visible crumbs | One in-text product link; the merged 2-year-old topic as an H2 (D041); `/stories/brain-development-toys-for-a-2-year-old` 308s here |
| Article, safe AI toy | `/stories/what-to-look-for-in-a-safe-ai-toy` | `story-what-to-look-for-in-a-safe-ai-toy.html` | same | yes | same | One in-text product link; sources |
| Article, late talkers | `/stories/talking-toys-and-late-talkers` | `story-talking-toys-and-late-talkers.html` | nav values only (no pre-order close, B5) | no | same | D025 disclaimer; "keep reading" close; no product pitch |
| The 18 template articles | `/stories/<slug>` (5.17-5.19) | template parity with the learning-toys article for the shared parts | per article | per article | BlogPosting, BreadcrumbList | Titles ≤ 60; 3-7 framing; D016 brain wording; D025 on speech answers; D026 markers; CMO approval recorded before merge |
| Team | `/team` | `team.html` | `finale`, `sticky-bar`, nav values | yes | none | First screen says what Kheelu is, the age band and the search term (CMO fix); bios and recognition render nothing until their proof is filed (D038, F11); founder photos only if supplied (B24) |
| Setup | `/setup` | `setup.html` | nav values only (no chilli button) | no | HowTo built from the same visible steps | D018 wake-up button wording; step 2 values per the CMO fix; the activity screen without "Games" (D044) |
| Contact | `/contact` | `contact.html` | `finale`, `sticky-bar`, nav values | yes | none | `#grievance` anchor with D032 wording verbatim; seller lines identical to the footer; WhatsApp and call links work (`tel:`, `https://wa.me/…`) |
| 404 | any unmatched path | `404.html` | `finale`, nav values | no | none | HTTP 404, noindex, server-rendered with chrome |
| Privacy | `/privacy` | `privacy.html` | nav values only | no | none | Tools named one per block, never a count; order-data location placeholder until the D047 move is confirmed; D035 training disclosure; draft note on beta while draft; production refuses a draft; `analytics-tags` re-pinned (B2c) |
| Terms | `/terms` | `terms.html` | nav values only | no | none | D035 opt-out and the D041 AI-image disclosure; full-mode variants; draft rules as above |
| Refund | `/refund` | `refund.html` | `refund-learn` link | no | none | D042 lines (no exchanges, no payment fees, refund starts within 2 working days, bank 5-7 working days); draft rules |
| Shipping | `/shipping` | `shipping.html` | `shipping-learn` link | no | none | Delivery wording D023; draft rules |

### 7.2 Store pages (store.kheelona.com, betastore on B)

| Page | Mockup | Checks |
|---|---|---|
| Store `/` | `store.html` | `force-dynamic`; noindex header and meta; StoreShell header and footer with policy links to `MARKETING_ORIGIN` (betawebsite on B); the price sentence (store variant) matches the server's amount for the mode; the form contract of §9; pay button labels unchanged and carrying no `cta` attribute; refund promise beside it; FAQ (store variant); films below every money answer with no `<video>` at rest; in-app note only for Instagram, Facebook or WhatsApp user agents and only if §6.4 says so; not-configured state reads "Pre-orders open here shortly." when keys are absent (L, keys removed) |
| Confirmation `/thanks` | `store-confirmation.html` | every order fact from the order row, apart from the delivery line rule in review N9 (test both an order created before 2026-10-10 and a new one, with the stub); `ph-no-capture ph-mask` on the container in every branch; "Save my address" primary button (white on Blue reported per question 3); the three non-paid states ("We are confirming it now", "We need your link again", "We cannot open that order right now") render with store chrome |
| Event `/e/<tier>` | none (reuses store parts) | token shape and signature handling unchanged; bad signature message unchanged |
| Partner `/ideabaaz` | none | "The Ideabaaz exclusive has ended." and its logo (B29) |
| Unknown store path | none | 200 in store chrome, noindex (lessons §1: a 4xx rewrite loses the store chrome on Vercel; verified on B, not only on `next start`) |

### 7.3 Machine files

`/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/pricing.md`: §4.2 and §4.3; on B also the noindex header
(review N1).

## 8. Redirect matrix

Run with `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'`, one request per hop, on L (with
`Host` headers for apex, `www` and store), on B (betawebsite for apex rules, betastore for store rules)
and on P. Each source is also requested with a query string (`?utm_source=qa-redirect`), which must
survive, and with a trailing slash.

| Family | Sources | Expected |
|---|---|---|
| The 24 existing rules (url-map §4b) | `/stories/why-three-to-six-matters-most`, `/products/lumi`, `/product-page/x`, `/product/x`, `/shop`, `/category/all-products`, `/category/toys`, `/accessibility-statement`, `/post/x`, `/terms-conditions`, `/privacy-policy`, `/for-the-parents`, `/lumi`, `/faq`, `/sitemap`, `/blog`, `/blog/x`, `/about`, `/community`, `/login`, `/signup`, `/account/x`, `/cart`, `/checkout/x` | one 308 to the url-map target, which answers 200 |
| New (D041, url-map §4d) | `/playos`, `/stories/brain-development-toys-for-a-2-year-old`, `/kheelu`, `/products`, `/careers`, `/jobs`, `/pricing` | one 308 to `/products/kheelu`, the 3-year-old article, `/products/kheelu`, `/products/kheelu`, `/team`, `/team`, `/products/kheelu#offer` |
| Assets not shadowed | `/product/lumi.png` (while it exists), every `public/` folder name | 200 asset or 404 after its planned deletion, never a 308 |
| Trailing slash | `/team/`, `/team/?utm_source=x` | one 308 to `/team` keeping the query; `/ingest/e/` keeps its slash |
| Apex `/store` | `/store`, `/store/x` on the marketing host | one 308 to the store host (betastore on B) |
| `www` twins | every family on `www.kheelona.com` | on L by Host header: one 308 to the absolute apex target; on P one hop only after the founder switches `www` to serve the project, else two hops recorded as the known exception |
| `http` | `http://kheelona.com/x` | Vercel's HTTPS hop, then as above (platform exception) |
| Claim | `store/thanks?ref=…&t=…` | 303 to `/thanks` with `kh_order` |
| Unknown | `/no-such-page`, `/stories/no-such-slug`, `/products/no-such` | 404 page, server-rendered |

## 9. Checkout invariants checklist

On top of the guards (`checkout-freeze`, `checkout-logic-region`, the JSX contract from review B3, the
frozen checkout tests):

| Invariant | Check |
|---|---|
| Form | One `<form>` with `noValidate` and a single `onChange` (typing in any field first fires `preorder_form_started` once) |
| Fields | `parentName` text maxLength 80 `autocomplete=name`; `phone` `type=tel` `inputMode=tel` `autocomplete=tel`; `email` `type=email` `inputMode=email` `autocomplete=email`; `childAge` text maxLength 20; `accepted` checkbox not pre-ticked; all required; inputs ≥ 16 px; the +91 decoration not part of the value |
| Address | `line1` `address-line1` (5-120), `line2` `address-line2` optional, `pincode` `inputMode=numeric` max 6 `postal-code`, `city` `address-level2`, `state` select of 36 |
| Money | The browser never sends an amount (request bodies inspected); the amount shown equals the server's; balance derived |
| Flow | Create-order before the sheet; `checkout.js` only on first submit; redirect `/thanks?ref&t` then the 303 claim |
| Labels | "Pay ₹499 and reserve" / "Pay ₹7,999 and pre-order", "Setting up your payment…", "Opening the payment window…" |
| Failure states | Every state in checkout.md "Failure and edge states" renders a page with the expected words (stub-driven on L) |
| Store host | noindex; dead ends 200 in store chrome; policy links to the marketing host |
| Razorpay theme | `#EF762F` unchanged |
| `qa:payment` | reaches the open sandbox sheet; refuses a live key |

## 10. Phase 8 smoke on production

Within the deploy window, in this order; a failure in checkout, payments, purchase tracking or a key page
means immediate rollback (brief §7 Phase 8, §8):

1. Key pages 200 with new content: Home, product, store, `/thanks` (link-needed state), safety, guide,
   stories, one article, contact, privacy.
2. Store: `/api/health` shows `store: ready`, `razorpay: live`, the expected mode, `capi: configured`;
   the form validates and shows errors; **no submit** (no real order; the founder's waiver for test mode on
   production, review question 4).
3. Redirect matrix (§8) on apex and `www`.
4. Tags firing with a real user agent (§5.4); edge cookies; replay control on the store.
5. noindex on the store; robots and sitemap; Search Console sitemap resubmitted (or exact steps to the
   founder).
6. Lighthouse P runs started (report follows); PostHog live view shows events from both hosts with no
   `env` property.
7. Monitoring due dates (24 h, 72 h, 7 days) handed to the main session.

## 11. What cannot be proven before launch, and how it is covered

| Item | Why | Covered by |
|---|---|---|
| GA4 and Meta events from the new site reaching the real properties | Beta has neither (D048); local runs must not deliver | LP payload parity against the tag build; P smoke; first real order |
| Browser-server Purchase dedup | CAPI is off on beta | unit tests; LP eventID check; first real order "Multiple" (founder) |
| `/ingest` external rewrite, 4xx rewrites | Vercel edge only (lessons §1) | B and P checks |
| Production Best Practices with the Meta cookie | tags absent on beta | LP-tags run, then P (pre-approved exception B10) |
| `www` one hop | needs the founder's domain switch | L by Host header, P after the switch |
| Payment on production | live keys only | beta payment on the same commit; founder waiver |
| Field Core Web Vitals | needs traffic | PostHog after launch (24 h, 72 h, 7 days) |
| In-app browser payment behaviour | real webviews only | §6.4 founder-run script |

## 12. This plan depends on

Review items B1-B4 being fixed in the architecture (motion tests in §4.7 follow D049; the JSX contract
in §9; the re-pinned `analytics-tags` guard; the beta preconditions in §2.3), and the main session's
answers to the review's questions (product details fold, arrow distance, white on Kheelu Blue, the
production test-mode waiver, in-app device checks, Ahrefs on beta). QA updates this plan when they land.
