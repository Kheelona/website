---
title: "QA review of the Phase 4 architecture plan, round 1 (2026-10-12)"
type: qa-architecture-review
updated: 2026-10-12
sources:
  - ../raw/brief/kickoff-brief.md (§4, §6 Architect and QA, §7 Phase 4, §8, §9)
  - ../engineering/architecture.md, ../engineering/structure.md, ../engineering/components.md, ../engineering/assets.md, ../engineering/dependencies.md, ../engineering/tasks.md, ../engineering/adr/ADR-001 to ADR-013
  - ../engineering/phase-4-kickoff.md, ../engineering/lessons.md
  - ../decisions/D040 to D049 (D049-motion-picks.md dated 2026-10-12)
  - ../site/tracking-inventory.md, ../site/checkout.md, ../site/url-map.md, ../site/content-boundary.md, ../site/gate-a-progress.md, ../site/gate-a-open-items.md, ../site/strategy.md (§3)
  - ../research/posthog-audit.md (§11 device, browser and viewport matrix)
  - ../design-system/motion.md, ../../mockup/APPROVAL.md (§6)
  - "mockup/pages/*.html, mockup/partials/*.html, mockup/css/*.css, mockup/mockup.css, mockup/mockup.js: grep of every mk- class (167 distinct block names) against components.md §7, 2026-10-12"
  - "Code read at reset/website-v2 HEAD 947af4e: src/proxy.ts:203, src/lib/store/host.ts:34-81, src/config/site.ts:21-25,138,266,300,413,449, src/app/layout.tsx, src/features/preorder/components/PreorderForm.tsx:192-269, src/app/store/thanks/page.tsx:60-101, src/app/store/page.tsx:45-52, src/lib/store/posthog-server.ts:86-122, src/lib/security-headers.ts, next.config.ts, vercel.json, package.json, .gitignore"
  - "Tests read: test/analytics-tags.test.ts:31-160, test/metadata-lengths.test.ts:50-65, test/policies.test.ts, test/internal-links.test.ts, test/machine-files.test.ts, test/stories-parse.test.ts:34-48, test/not-found-ssr.test.ts:32-38, src/components/molecules/PostHogGate.test.tsx:30-160, src/features/preorder/components/PreorderForm.test.tsx:54-70"
  - "git diff --stat archive/pre-reset-2026-10-10 HEAD over every frozen path in ADR-013 and src/config/site.ts: empty (byte-identical), 2026-10-12"
  - "node scripts/ds-checksums.mjs, run twice: 'design-system/ intact: 643 files match the manifest', exit 0 both times, 2026-10-12"
  - "node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md:291-293,1404 (priority deprecated in 16.0.0); 04-functions/unstable_cache.md:7 (replaced by use cache); 03-file-conventions/proxy.md:253-255 (Node.js runtime); 01-getting-started/11-css.md:400-458 (order verified on build)"
  - "node_modules/posthog-js/dist/module.mjs: before_send present (grep), 2026-10-12"
  - "https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation (fetched 2026-10-12): header or query x-vercel-protection-bypass; x-vercel-set-bypass-cookie sets a cookie through a redirect; VERCEL_AUTOMATION_BYPASS_SECRET is a system environment variable"
---

# QA review of the Phase 4 architecture plan, round 1

**Verdict: REVISE (round 1 of 2, brief §7 Phase 4).** The plan is strong and most of it can start as
written, but **four blocking items** must be fixed in the plan before wave 1 begins. Each one is
small to fix. After the Architect revises, QA re-reviews only the changed sections plus the
re-verification steps listed under each item. Non-blocking items are tracked here and in the
[test plan](test-plan.md); each names where it should be fixed.

## In one screen

- **Blocking 1. The founder's motion picks (D049, 2026-10-12) are not in the plan.** Four of the eight
  picks contradict the plan as written (doodles that draw themselves, the arrow nudge on the orange
  button, the smooth FAQ open, the films strip's focus scale).
- **Blocking 2. Task ownership collides with existing guard tests.** Task 1.3 cannot pass
  `npm run verify` in wave 1 without editing tests it does not own, and the kept `analytics-tags` guard
  asserts privacy wording that the approved privacy page does not contain (8 of its 10 wording checks).
- **Blocking 3. The checkout freeze proof has a hole where the restyle happens.** The "logic region"
  ends at the first `return (`, but the load-bearing checkout details (form `onChange` and `noValidate`,
  field names and `autocomplete`, the submit button, the `ph-no-capture ph-mask` container) live in the
  JSX after it.
- **Blocking 4. Beta isolation is "recommended", not required.** If the beta's Preview environment
  points at the production Supabase project, every beta test payment is counted toward the 500-unit
  cap that decides production's price, and lands in the dispatch queue.
- **What is already right** (verified, not taken on trust): the frozen checkout and tracking files are
  byte-identical to the tag today; the DS CSS-as-visual-layer choice (ADR-002) is the zero-drift answer
  the brief asks for; the `SITE_ENV` design, `isStoreHost`, the double switch-off of Meta CAPI on beta,
  the unchanged GA4 and Meta host lists, and the `vercel.json` rule set satisfy D048; every one of the
  18 approved pages maps to a route, content module, template and sections (structure §5).
- 26 non-blocking items follow, grouped by area. The most important: Next 16 deprecations (`priority`,
  `unstable_cache`), the Lighthouse runs on beta cannot pass SEO (noindex) and under-report the
  production tags, non-HTML files on beta carry no noindex header, a catalogue gap of 57 mockup
  classes (including the whole buyer's guide page CSS), the product page's approved stacked detail
  panels versus the planned Tabs island, and the PostHog filter that must exclude `env = beta` before
  the first beta payment, not at Gate B.

## How this review was done

1. Read the brief (§4, §6, §7, §9), the plan pages, all 13 ADRs, D040-D049, the inventories, lessons
   and the PostHog device matrix.
2. Checked claims against the code at `947af4e` (citations in the front matter). Re-ran the frozen-path
   diff against `archive/pre-reset-2026-10-10`: empty. Re-ran the DS checksums twice: 643 files match,
   exit 0 both times. A red-proof control on a scratch copy of the DS was not run: the copy command was
   refused by the permission rule that protects `design-system/` paths. The red proof is task 1.1's
   acceptance item 7 and is re-checked in Phase 6.
3. Grepped every `mk-` class in the mockup sources against the catalogue's mapping (components §7).
4. Grepped the guard phrases of the kept tests against the approved mockup and copy pages.
5. Read the installed Next 16 docs for every Next API the plan names.
6. No server was started and nothing was built (Phase 4 is pre-code). `lsof` showed nothing listening
   on 3000, 3456 or 3460.

---

## Blocking findings

### B1. D049 motion picks are missing from the plan

**Evidence.** D049 (founder, 2026-10-12) picks 1A 2A 3B 4A 5A 6B 7B 8B. The plan's sources stop at D048
(architecture front matter). A grep of `wiki/engineering/**` finds D049 only in the artifacts
catalogue (the motion options page); no plan page (architecture, ADRs, components, tasks) mentions it,
or "draw", "nudge", "grid-template-rows" or a focus scale. Picks 1, 2, 4 and 5 match the plan. Four do
not:

| Pick | D049 build spec | What the plan says | Conflict |
|---|---|---|---|
| 3B doodles draw themselves | Inline the doodle SVG; `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset` 1→0 over `duration-draw`, once on entry, staggered | ADR-010 and architecture §10: "DS SVGs (doodles…) as plain `<img>`"; §11 "only `transform` and `opacity` animate" | An `<img>` cannot be stroke-animated (motion.md:123); `stroke-dashoffset` is not transform or opacity; no inlining pipeline exists. Hero doodles (`ai-toys…html:18`, `team.html:15`) must stay still under pick 2A, so the rule is "draw below the first screen only" |
| 6B orange button | Arrow icon `translateX(5px)` on hover (pointer devices), `duration-fast` | §11 "Never animated: … any chilli button"; the off-token guard bans `px` outside media queries | `5px` is not a DS token (`--space-1` is 4 px, tokens.css:71) and the button is listed as never animated |
| 7B FAQ smooth open | `grid-template-rows: 0fr→1fr` over `duration-enter`, plus sign rotates 45° | FAQ is native `<details>` with no animation; transform/opacity only | Animating a native `<details>` body needs `::details-content` (newer browsers) or script; a fallback is required for older iOS Safari; a second founder-approved non-transform exception |
| 8B films focus grows | The film in focus scales 1.04-1.1 over `duration-base` | Films: native scroll-snap, no focus state | Needs focus detection (observer or scroll-snap events); a scaled tile at a strip edge can overflow (lessons §2, sideways scroll) |

**Why it blocks.** The founder asked for the site "with animation" (D048) and then chose these
specific animations (D049, the latest logged decision, which wins over the brief and the Gate A spec).
Building to the plan as written would ship the wrong motion and fail the guards the plan itself
defines (off-token, transform/opacity only).

**Required change.**
1. ADR-007 addendum and architecture §11: one row per D049 pick (implementation, tokens, reduced-motion
   behaviour, where it is forbidden: hero, h1, price sentence, offer card).
2. Two founder-approved exceptions to brief §9.11's "transform and opacity only", named in ADR-007:
   `stroke-dashoffset` (doodles) and `grid-template-rows` (FAQ). The motion guard allows exactly these
   two properties in exactly these two components.
3. The `5px` arrow distance: either log it as a G-10 motion addendum (D049 states it explicitly) and
   allow that one literal in `motion.css`, or use `var(--space-1)` and record the 1 px deviation.
   The main session decides; the off-token guard follows the decision. Scale values 1.04-1.1: pick one
   value and name it once in `motion.css`.
4. A generated doodle derivative: `scripts/assets/build-doodles.mjs` reads the DS SVGs and writes inline
   components with `pathLength="1"` added to stroke paths and `aria-hidden="true"`, outside
   `design-system/` (brief §4.1 derivatives), plus an asset row and a drift test. Decide what happens to
   the `feTurbulence` grain filter during the draw (paint cost on mid-range Android, motion.md:123).
5. Owners: 1.2 (presets), 1.5 or a new 1.5c (doodle derivatives), 2.2 (`Button` arrow), 2.3
   (`ArtBoard` and `ImaginationFrame` doodle layers), 2.4 (`FaqList`), 3.3 (`FilmsStrip` focus), each with
   acceptance criteria and a reduced-motion test.
6. Budget: inline SVG bytes count toward HTML weight (see N16).

**QA re-verification.** Each pick appears in §11 with an owner and a test; the guards encode the two
exceptions and nothing else; `wiki/design-system/motion.md` is updated by the main session.

### B2. Task ownership collides with existing guard tests

The plan's rule is that a task edits only the files it owns and finishes with `npm run verify` green
(tasks.md "How to read a task"). These collisions make that impossible:

| # | Task and change | Guard it breaks | Owner of the guard | Evidence |
|---|---|---|---|---|
| a | 1.3 (wave 1) changes `POSTHOG_HOSTS` to add the beta hosts | `expect([...POSTHOG_HOSTS]).toEqual([...GA4_HOSTS])` and "never names a preview or local host" | 2.6 (wave 2) moves the file | `src/components/molecules/PostHogGate.test.tsx:153,156` |
| b | 1.3 deletes `src/app/(site)/playos/` | `metadata-lengths` reads that file by path; `sitemap.ts` and `llms.txt/route.ts` still list `/playos` | 4.4 (wave 4) | `test/metadata-lengths.test.ts:54`; `grep -l playos src/app/sitemap.ts src/app/llms.txt/route.ts` |
| c | 5.11 makes `/privacy` a thin route over `content/en-IN/legal/privacy.ts` with the approved wording | `analytics-tags` reads `src/app/(site)/privacy/page.tsx` and asserts 10 wording patterns; 8 have no match in the approved privacy mockup (for example "PostHog now reports through our own address" against the approved "PostHog reports through our own address"; "Be aware of the gaps"; a lower-case "your browser can block…" against the approved capitalised sentence) | 2.6 | `test/analytics-tags.test.ts:32,87-160`; grep of `mockup/pages/privacy.html` and `wiki/site/pages/privacy.md`, 2026-10-12 |
| d | 5.1-5.14 make pages thin (titles in content modules) | `metadata-lengths` pulls `title:` literals out of `page.tsx` files; `policies` reads legal page files and imports `@/lib/legal` | 4.4, which "rewrites them for the new content" in wave 4, before that content exists (wave 5) | `test/metadata-lengths.test.ts:50-70`; `test/policies.test.ts` imports |
| e | 6.3 deletes the old components | `stories-parse` asserts more than 50 Storybook stories and the presence of `src/components/templates/PageHero.stories.tsx` | nobody (listed as "kept") | `test/stories-parse.test.ts:44-45` |

**Why it blocks.** Wave 1 cannot finish (item a, b), and the privacy rewrite in wave 5 meets a guard
whose wording the founder's approved copy does not use (item c). A builder under pressure would bend
the copy to the test or weaken the test. Item c is also a tracking-parity guard (brief §9.4, the
"/privacy changes in the same commit" rule), so it must be re-pinned, not dropped.

**Required change.**
- a: move the `POSTHOG_HOSTS` edit from 1.3 to 2.6 (the gate and its test change together), or give
  1.3 the two assertions. Recommendation: move it to 2.6.
- b: 1.3 adds the `/playos` redirect only (a redirect shadows the page file, so the old page is
  unreachable); 6.3 deletes the folder; 4.4 drops `/playos` from the sitemap and `llms.txt`.
- c: name the owner of the `analytics-tags` rewrite (recommendation: 5.11, same commit as the privacy
  content). Keep its layout assertions (`<Analytics />`, the Ahrefs tag with `async` in `<head>`, the
  three gates, case-for-case as `analytics-tags.test.ts:61-71`); read the privacy text from the rendered
  page or the content module; re-pin each wording assertion to the approved privacy text (each tool
  named, the cookie statement per tool, the Meta Pixel follows visits to other sites, the proxied
  PostHog, the server report to Meta that blocking cannot stop); keep the anti-count assertions.
- d: 4.4 writes `metadata-lengths` and `policies` data-driven over `content/en-IN/routes.ts` and the
  content modules: every present module is checked, an absent module is printed as "pending", and the
  guard fails on any present violation. Wave-5 tasks then never edit them.
- e: 6.3 owns `stories-parse` (new path, new count floor).
- General rule to add to tasks.md: before a task deletes or rewrites a file, it greps `test/` and
  `src/**/*.test.*` for the path and lists every hit in its Owns or hands it to the owner.

**QA re-verification.** A dry check: for each wave-1 task, the files it changes against every test that
reads them by path (`grep -rn` of each owned path in `test/` and colocated tests) shows no test owned
by a later task.

### B3. The checkout freeze proof misses the JSX contract

**Evidence.** ADR-013 defines the presentation files' logic region as "everything from the component's
opening line to its first `return (`, and every non-JSX helper". The details checkout.md lists as
load-bearing sit after that point:

- `PreorderForm.tsx:193` `<form onSubmit={onSubmit} onChange={onFirstChange} noValidate>`: the single
  `onChange` fires `preorder_form_started`;
- `:194-241` every field's `name`, `type`, `inputMode`, `autoComplete`, `maxLength`, `required`;
- `:255-269` `type="submit"`, `disabled={busy}` and the three state labels ("Pay ₹499 and reserve",
  "Setting up your payment…", "Opening the payment window…");
- `thanks/page.tsx`: the first `return (` is at `:90`, after `return <LinkNeeded />` (`:72`) and the
  order read (`:75`); the paid and confirming branches and the `ph-no-capture ph-mask` container come
  after it.

The existing component tests cover part of this (first keystroke fires once, no amount sent, the
PostHog id is sent: `PreorderForm.test.tsx:85-261`) but not `autocomplete`, `inputMode`, `noValidate`,
`maxLength`, or the `ph-no-capture ph-mask` class in every `/thanks` branch. Those test files are also
not owned or frozen by any task, so a restyle task could edit them.

**Why it blocks.** "Checkout logic stays as it is" is non-negotiable (brief §4.4), and the plan claims
the checkout is "frozen and proven frozen by tests" (architecture §1.8). As defined, the proof cannot
see the attributes the restyle is most likely to touch.

**Required change.**
1. Add `test/guards/checkout-jsx-contract.test.tsx` (owner 1.1, assertions active once 5.15 and 5.16
   land): render `PreorderForm` (token, full, event tier; idle, working, paying), `AddressForm`,
   `OrderSummary` and the `/thanks` page (paid, created, link needed, cannot open) and compare against a
   fixture taken from the tag: form attributes, every field's `name`, `type`, `inputMode`,
   `autocomplete`, `maxLength`, `required`; the submit button's type and its label per state; the refund
   promise beside the button; `ph-no-capture ph-mask` on the `/thanks` container in every branch;
   `noindex` on the store layout.
2. Define the logic region by syntax, not by the first `return (`: every statement that is not a JSX
   return, every JSX attribute whose value is an identifier, a call or a conditional, and every
   conditional that chooses between JSX branches.
3. Freeze the six existing checkout test files (`PreorderForm`, `AddressForm`, `OrderSummary`,
   `NotFoundPanel` tests, `store/thanks/page.test.tsx`, `store/ideabaaz/page.test.tsx`) in the freeze
   guard: they are the behavioural contract. A wording-only selector change needs a reviewed expected
   diff, like the D048 diffs. (Most selectors already use `exact: false`, `PreorderForm.test.tsx:56`, so
   the planned "Indian WhatsApp number" label still matches.)

**QA re-verification.** The contract test is proven red by removing `noValidate` and by dropping
`ph-no-capture` from one `/thanks` branch in a scratch commit (never kept).

### B4. Beta isolation must be a hard precondition, verified before the first test payment

**Evidence.** Architecture §15.4 step 1 makes a separate beta Supabase project "recommended"; step 4
says `ORDER_ALERT_EMAIL` should be "an inbox happy to receive test alerts"; §15.5 step 2 extends the
PostHog test-account filter to `env = beta` only at Gate B. Facts that make these load-bearing:

- The offer mode is a live count of paid non-full orders in Supabase (checkout.md "Variants";
  `mode.ts`). A test-mode payment on beta goes through `markPaid` like a real one. With a shared
  database it raises the count that flips **production** to ₹7,999, and puts a test order in the
  dispatch queue.
- `notifyPaid` sends `purchase_confirmed` to the production PostHog project (`posthog-server.ts:86-122`,
  key is a public constant). Since D031, `purchase_confirmed` is the marketing-analytics conversion goal
  and the revenue source. Beta payments carry `env: "beta"` (good) but count as revenue until a filter
  excludes them.
- Email templates are frozen, so a beta alert to the operations inbox is indistinguishable from a real
  order.

**Why it blocks.** A shared database lets beta testing change production's price and order queue,
which is checkout logic by outcome (brief §4.4), and D048's intent is that beta never touches production
data or analytics.

**Required change.** In §15.4 and task 7.2, make these **required** before any beta payment, each with
a check:

| Precondition | Who | How QA verifies |
|---|---|---|
| Beta uses its own Supabase project (`ap-south-1`), never production's | Founder | Founder confirms the beta `SUPABASE_URL` project ref differs from production's (recorded by the main session); QA's first beta order must not appear in production's admin view (founder spot check) |
| `RAZORPAY_KEY_ID` in Preview (scope `beta`) is `rzp_test_…` | Founder | `GET https://betastore.kheelona.com/api/health` shows `"razorpay":"test"`; the sheet shows Razorpay's test-mode banner |
| No `META_CAPI_TOKEN` or `META_CAPI_TEST_CODE` in Preview | Founder | `/api/health` shows `"capi":"missing"` on betastore |
| `ORDER_ALERT_EMAIL` and `EMAIL_FROM` in Preview point at a test inbox, or `RESEND_API_KEY` is absent | Founder | the alert for QA's test order arrives at the test inbox only |
| PostHog excludes `env = beta` (and `internal = true`) from the test-account filter and from revenue analytics | Founder or PostHog Analyst with the founder's OK (project settings) | a HogQL query of `purchase_confirmed` with the filter on returns no beta rows |

**QA re-verification.** The runbook and task 7.2 list these as gates; the test plan's beta payment
procedure refuses to start until all five are recorded ([test plan §6](test-plan.md#6-razorpay-test-mode-payment-on-betastore)).

---

## Non-blocking findings

Each has a recommended fix and a place. Severity: **H** = fix before the wave that needs it, **M** = fix
during the build, **L** = note.

### Tracking and beta (D048)

| # | Sev | Finding | Fix |
|---|---|---|---|
| N1 | H | **Non-HTML responses on beta carry no noindex header.** The proxy matcher excludes any path with a dot (`src/proxy.ts:203`), so `/llms.txt`, `/pricing.md`, `/sitemap.xml`, images and films on the beta hosts get no `x-robots-tag`. Only Vercel Authentication protects them. Brief §4.5: any staging URL is noindex | `next.config.ts` `headers()`: when `resolveSiteEnv(process.env) === "beta"`, add `X-Robots-Tag: noindex, nofollow` to `/:path*`. Call `resolveSiteEnv` directly: modules that `next.config.ts` imports see `SITE_ENV` as `development`, because the `env` inlining applies to the app bundles, not to the config's own imports. Task 1.3 |
| N2 | H | **The event registry omits two of the five browser tools.** Vercel Web Analytics and Ahrefs (inventory rows 1-2, parity rows 2-3) are not in architecture §8.2. The registry-to-inventory test then cannot cover them | Add both as `existing` destinations with automatic pageviews only; the registry test covers all 17 inventory rows. Task 1.4 |
| N3 | M | **`posthog.register({ env: "beta" })` is redundant and persistent.** `before_send` already stamps every event. A registered super property is stored in PostHog's persistence, and the PostHog cookie is cross-subdomain on `.kheelona.com` by default, so it may follow a tester to production | Drop `register` or use `register_for_session`; prove with a control: after a beta visit, the production page's PostHog persistence (with `/ingest` blocked) has no `env`. Task 2.6 |
| N4 | M | **Local runs send `purchase_confirmed` with no environment marker.** A sandbox payment completed against a local server reaches `notifyPaid`, which posts to the production project | Stamp `env: SITE_ENV` whenever `SITE_ENV !== "production"` (production payload unchanged, same authorised file). Until then, local probes stop at the open sheet (`qa:payment` does). Task 1.3 |
| N5 | M | **The Protection Bypass secret can leak.** Playwright's `extraHTTPHeaders` (Vercel's own example) sends it to every origin, including Razorpay; the `/ingest` rewrite forwards request headers; a query-string bypass on a page with PostHog would be captured in `$current_url`. Vercel also exposes it to deployments as `VERCEL_AUTOMATION_BYPASS_SECRET` | Add the name to `test/store-secrets.test.ts`; QA injects the header only for the two beta hosts and relies on the bypass cookie afterwards ([test plan §2.3](test-plan.md#23-beta)); after any real-device test with a query bypass, the founder rotates the secret |
| N6 | M | **Ahrefs off on beta** (ADR-008, flagged to the founder). QA agrees: the tag is ungated and has no environment field, so beta views would land in the production property | Keep the flag; recommendation for the founder: off on beta |
| N7 | L | **The in-app browser note (B12) is built unconditionally,** but B12's working default says "once QA's sandbox confirms" the in-app payment problem. Its "Copy link" copies `STORE_ORIGIN`; attribution cookies do not cross from a WhatsApp webview to Chrome, so the order loses its campaign either way | Gate the note on QA's in-app sandbox result ([test plan §6.4](test-plan.md#64-in-app-browsers-real-devices)); record the attribution loss in the founder question |
| N8 | L | `metadataBase` is `CANONICAL_ORIGIN` on beta, so a shared beta link previews the production `og:image` (old file or 404 for the new `/og/*.jpg`) | Accept, or use `MARKETING_ORIGIN` for `og:image` only on beta. Founder review only |

### Checkout

| # | Sev | Finding | Fix |
|---|---|---|---|
| N9 | H | **Delivery wording for existing token orders (F12).** Task 5.16 says "every row from the order row", but "Ships from" on `/thanks` and in the receipt prints the config value `SHIP_DATE_TEXT` ("20 October 2026", `site.ts:138`), not the row (checkout.md). The approved confirmation mockup shows the new delivery line. Rendering it for everyone changes what pre-10-October customers see before F12 is answered | 5.16 keeps the current value for orders created before 2026-10-10 until F12 is answered (a presentation choice from the row's `created_at`, or simply holds the old line), and the test plan covers both cases |
| N10 | M | **Production smoke cannot run "checkout in test mode"** (brief §7 Phase 8): production has live keys, and `qa:payment` refuses them. The plan's smoke stops at form validation | Founder waiver: payment proven on beta (same commit) the day before the merge; production smoke covers the form, the redirect matrix and the tags. Listed as a founder question |
| N11 | L | Beta's own Supabase is on the free tier and the daily `/api/health` cron runs only on production, so it pauses after a quiet week | QA wakes it (`/api/health`, `store: ready`) before each beta session; noted in the runbook |

### Next.js 16 specifics

| # | Sev | Finding | Fix |
|---|---|---|---|
| N12 | H | **`priority` on `next/image` is deprecated in Next 16** in favour of `preload`; the docs prefer `loading="eager"` or `fetchPriority="high"` in most cases (`image.md:291-293`, changelog `:1404`). ADR-010, architecture §10, components (`Photo`, `ArtBoard`) and task 2.3 all use `priority` | Replace with `fetchPriority="high"` plus `loading="eager"` on the one LCP image (for the hero art board, the largest layer). AGENTS.md: heed deprecations. Tasks 2.3, 5.x |
| N13 | M | **`unstable_cache` "has been replaced by `use cache` in Next.js 16"** (`unstable_cache.md:7`). The plan uses the non-Cache-Components model on purpose but does not say why | Record in ADR-005 why Cache Components stays off (the store's `force-dynamic`, route segment `revalidate`, no risk to checkout routes); add a guard that `next.config.ts` has no `cacheComponents` |
| N14 | M | **Offer staleness is longer than "within five minutes".** A page with `revalidate = 300` regenerates on the first request after expiry and serves the stale page to that visitor; the cached mode inside can itself be up to 300 s old. On a quiet page the first visitor after a sell-out sees ₹499 while the store charges ₹7,999 (the store refuses with "refresh" words, so no wrong charge) | State the real bound in ADR-005; add to the sell-out runbook: founder clicks Redeploy in Vercel after `/api/health` shows `full` (rebuilds every page in minutes, no new code) |
| N15 | L | Metadata merges per key: if `pageMeta` ever returned `robots`, it would replace the root's beta noindex | Guard: on a beta build, every route's HTML carries the noindex meta ([test plan §4.2](test-plan.md#42-seo)) |

### Performance

| # | Sev | Finding | Fix |
|---|---|---|---|
| N16 | M | **No HTML weight budget.** App Router pages inline the React Server Component payload, so long pages (legal, articles) carry their text roughly twice; D049 adds inline SVG; FAQ JSON-LD repeats answers | Add "HTML document (gzip) per route" to §12 (QA proposes ≤ 60 KB marketing, ≤ 90 KB legal and articles; the Architect sets the number) and to the perf spec |
| N17 | M | **Hero font shift risk.** Home's h1 carries a Kalam Bold accent (`kh-hand`, D045); the budget allows two preloads (Nunito, Baloo 2); dropping `next/font` also drops its automatic fallback metrics. A late Kalam swap can re-wrap the h1 and move the CTA (CLS) | Either preload the Kalam Bold subset on Home (a third preload, budget exception) or generate fallback `@font-face` metrics; QA measures CLS with fonts delayed ([test plan §4.4](test-plan.md#44-performance)) |
| N18 | M | **The Lighthouse runs on beta cannot pass and do not represent production.** Beta is noindex (SEO's `is-crawlable` audit fails on every page) and has no GA4, Meta or Ahrefs, so Performance and Best Practices read better than production (lessons §6: 96 local versus 74 production) | Name the authoritative run per category: Performance and Best Practices on a local production build under real hostnames with the tags allowed to load and only their beacons blocked, then production after deploy; SEO on the local production build (no noindex); Accessibility anywhere. Task 7.1, 7.2 text |
| N19 | L | Home's first three film posters are eager (as in the mockup) but sit below the 360 × 640 first screen, competing with the LCP image | Keep eager but `fetchPriority="low"`, or lazy with a dwell; measured by the perf spec |

### Fidelity and coverage

| # | Sev | Finding | Fix |
|---|---|---|---|
| N20 | H | **The catalogue's mockup-class mapping misses 57 of 167 `mk-` block names.** The whole buyer's guide CSS (`mk-gd-*`, 14 blocks in `css/ai-toys-for-kids-in-india.css`) has no row; also `mk-404`; `meet-kheelu.css` `mk-app-note`, `mk-app-split`, `mk-care`, `mk-faq`, `mk-faq-head`, `mk-hero-sticker`, `mk-know`, `mk-list-reset`, `mk-modes`, `mk-safety`, `mk-safety-split`, `mk-skills`; article classes `mk-article`, `mk-belly`, `mk-breakout`, `mk-checks`, `mk-gut`, `mk-keep`, `mk-lead`, `mk-part`, `mk-questions`; hub `mk-journal-intro`, `mk-later`, `mk-photo-myra`, `mk-written`; contact `mk-grievance`, `mk-routes`; seven `mk-setup-*`, `mk-steps-4`; store `mk-agree`, `mk-h2`, `mk-policy`; confirmation `mk-addr`, `mk-ghost-start`; legal `mk-step`, `mk-updated`, `mk-tools`, `mk-short-panel`; `mk-drawer-in` (`mockup.css`) | Add a row per block (or per file) to components §7 before wave 3; QA's check is mechanical (the grep in this review's sources) and is re-run at re-review |
| N21 | H | **Product details: the approved look is three stacked panels, not tabs.** In `meet-kheelu.html:279-311` the tab list is `hidden`, `mockup.js` has no tabs code, and `meet-kheelu.css:81` stacks panels under `.kh-tabs:not(.is-tabs)`. The founder approved what rendered: stacked. A Tabs island would change that fold and fail visual and text parity | Main session decides. QA recommends shipping as approved (stacked; tab list stays hidden; no Tabs JavaScript), which also keeps all specs visible without a tap and in no-JS text |
| N22 | M | Mockup-only markup must not ship: `data-src="…"` attributes naming internal constants (for example `meet-kheelu.html:355`), `mk-` classes, `mk-later` "Rewritten in the build" labels | Add to SCA: built HTML contains no `mk-` class and no `data-src`; QA scans every route |
| N23 | M | **The plan's viewports miss most of the measured laptop traffic.** Parity and axe run at 360, 390 and 1440 only. The audit (§11) shows 1920 wide is 22.5% of laptop sessions, 1536 × 730 and 1280 × 600 are short screens, and 402 × 714 is the current iPhone in Safari | Parameterise the e2e viewports; run no-sideways, CTA first-screen and axe on the audit matrix ([test plan §3](test-plan.md#3-viewports-and-browsers)); parity can stay at the three approved widths |

### Guards, acceptance criteria and process

| # | Sev | Finding | Fix |
|---|---|---|---|
| N24 | M | **Two §9.8 criteria have no guard:** en-IN spelling and "the 3-7 age band appears everywhere" (and never implies under 3) | Add US-spelling entries (color, center, favorite, program, -ize forms that en-IN spells -ise, as the copy pages use) to the banned-phrases data; an age-band test over the pages listed in [test plan §4.8](test-plan.md#48-content-integrity-and-the-content-boundary) |
| N25 | M | **Wave 1 is not independent.** 1.1's `predev` and `prebuild` call `assets:compose` (a 1.2 script) and the placeholder guard imports 1.3's `env.ts`; the 1.2 fixture page for the CSS-parity test has no owner; the placeholder guard's own patterns (`placeholder(`, `status: "draft"`) match its helper and the `LegalDoc` type | Order 1.1's scripts after 1.2 and 1.3 (or skip when the file is absent and print it); give the fixture to 1.1 under `test/e2e/fixtures/`; exclude the helper and `types.ts` from the source scan, prove red and green |
| N26 | L | Small inconsistencies: the scalability test renders "a campaign page and an article" (architecture §5) or "a campaign page and a product page" (task 4.1); the DS checksum prebuild reads `wiki/design-system/manifest.md`, so production builds depend on `wiki/` being in the deploy clone (record it so nobody adds a `.vercelignore` for `wiki/`); 7.2's "TTFB from India" has no method | Pick one fixture set (QA: both); record the manifest dependency in structure §8; TTFB method in [test plan §4.4](test-plan.md#44-performance) (`x-vercel-id` shows the function region; India timing from the founder's network) |

---

## Coverage checks

### D048 beta requirements

| Requirement (D048) | Where the plan meets it | Verdict |
|---|---|---|
| A pushed `beta` branch builds; `reset/*` does not | `vercel.json` with `"reset/*": false, "beta": true` (§15.3); "any true rule wins" cited from Vercel docs | Meets. Re-checked on the first push (a `reset/*` push makes no deployment) |
| betawebsite is the marketing host, betastore the store host | `isStoreHost` adds `betastore.kheelona.com` (`host.ts:34-36` today has two names); `routeForHost` sends apex `/store/*` to `STORE_URL`, which becomes the beta store in a beta build (`host.ts:81`) | Meets |
| Every CTA opens betastore | `STORE_URL = STORE_ORIGIN`, build-time; `PreorderButton` always renders `STORE_URL` | Meets |
| Razorpay test keys in Preview | Runbook step 4; `/api/health` check in step 8 | Meets; made a gate by B4 |
| Meta Pixel, CAPI and GA4 never fire on beta | GA4 and Meta host lists unchanged (`site.ts:266,300`); CAPI token read as absent on beta and not added to Preview | Meets (two independent switches for CAPI) |
| PostHog fires with `env=beta` on every event | `POSTHOG_HOSTS` gains the beta hosts; `before_send` stamp; server event stamped | Meets; see B2a (ownership), N3, B4 (filter) |
| Beta hosts noindex, nofollow | Proxy header for non-indexable hosts (HTML routes); root metadata `robots` on beta; Vercel Authentication | Partly: non-HTML files lack the header (N1) |
| Approval on beta is Gate B, then merge to `main` | §15.5: rollback tag first, merge, smoke, Instant Rollback | Meets |
| The approved animation is built | ADR-007 | **Does not meet: B1** |

### Tracking parity (inventory checklist rows 0-27)

| Rows | Plan mechanism | Verdict |
|---|---|---|
| 0 Measurement code unchanged | `tracking-freeze` byte-compare, reviewed expected diffs for the three D048 files and the PostHog gate | Meets; add the checkout tests (B3) |
| 1 Host gates | Host lists unchanged except PostHog plus beta; unit tests | Meets |
| 2-3 Vercel WA, Ahrefs | Kept in the layout; `analytics-tags` asserts both | Meets in code; registry gap N2 |
| 4-10 GA4 and PostHog funnel events | Frozen `analytics.ts`, spies against the registry, gate-open probe | Meets |
| 11-12 Meta PageView and ViewContent | Frozen gate; `ViewContentTracker` on `/` (B9) and `/products/kheelu`, value from the offer | Meets; row 12 expectation changes to "Home too" (working default B9) |
| 13 CAPI and dedup | `meta-capi.ts` frozen; `purchase_<ref>` unchanged; off on beta | Meets; dedup is provable only by unit tests, the gate-open probe and the first real order ("Multiple") |
| 14-18 PostHog init, autocapture, replay, `/thanks` suppression | Init options deep-equal a tag fixture; `cta` only through a typed `CtaId`; replay deny list unchanged | Meets; `/thanks` container covered once B3 lands |
| 19 `purchase_confirmed` | Frozen apart from the beta stamp | Meets; N4 for local runs |
| 20-23 Proxy, rewrites, cookies, claim | `proxy.ts`, `next.config.ts` rewrites unchanged | Meets |
| 24 Razorpay webhook | Frozen route; beta test webhook optional | Meets |
| 25 CSP | `security-headers.ts` frozen; new site adds no third-party origin; inline `style` (art-board %, `--kh-tilt`) and `data:` masks are already allowed (`style-src 'unsafe-inline'`, `img-src data:`) | Meets |
| 26 DNS verification | Untouched | Meets |
| 27 `/privacy` disclosure | `analytics-tags` | Meets once B2c re-pins it |
| New: CTA values, three B11 events, `?internal=1`, `env=beta` | Registry `new` status; 6.2 gated with expected diffs; Meta never receives the new names | Meets |

### Checkout "what must not change" (checkout.md)

| Item | Plan | Verdict |
|---|---|---|
| `src/lib/store/**`, `src/app/api/**`, `src/proxy.ts`, migrations | Frozen, byte-compare (today identical) | Meets |
| Money constants `site.ts:55-117` | Money block frozen; `MRP_*` added after it | Meets |
| `validate`, `checkout`, `analytics`, `india` | Frozen; B11 in gated 6.2 | Meets |
| Create-order body and the `/thanks?ref&t` redirect | Frozen logic | Meets |
| Email facts and branching | Frozen; 6.4 label strings gated on F12 | Meets |
| One-tap CTA to `STORE_URL`, no cart, no accounts | `PreorderButton` | Meets |
| Load-bearing JSX details (names, `autocomplete`, `noValidate`, single `onChange`, `ph-no-capture ph-mask`, inputs ≥ 16 px, refund promise beside the button, no video at rest, store noindex) | Listed in §16; proof incomplete | **B3** |
| Razorpay theme `#EF762F` | Stays (frozen file) | Meets |

### Pages and patterns

All 18 approved pages map to a route, a content module, a template and sections (structure §5); the 18
template articles, the event, partner, store not-found and not-configured pages are covered; the review
index is correctly not built. Patterns: every `mk-` helper in the kickoff list has a component (§5
table); the CSS mapping is incomplete (N20); the product details fold needs a decision (N21).

### Wave ownership

Same-wave tasks own disjoint files (checked task by task). Cross-wave partial ownership (2.6 edits the
import lines of `layout.tsx` before 3.1 owns it; 2.1 creates `stories/hub.ts` and the article stubs that
5.5, 5.6 and 5.17-5.19 later own; 6.2 edits `events.ts` and `privacy.ts` after 1.4 and 5.11) is safe
because waves are sequential. The conflicts are with **test files** (B2) and the unowned checkout tests
(B3).

### Brief §9 testability

Testable as written: 9.1 (CTA registry, first-screen boxes), 9.2 (metadata, JSON-LD, hops, no-JS
parity), 9.3 (answer length), 9.4 (freeze, parity, probes), 9.5 (bytes, Lighthouse once N18 is settled),
9.6 (axe with the D041 classifier, keyboard specs), 9.7 (content checks), 9.9 (off-token, theme,
checksums, visual parity), 9.10 (no-sideways, inputs), 9.11 (once B1 lands), 9.12 (`jscpd`,
asset hashes). Gaps: 9.8 spelling and age band (N24); 9.1 "one primary action per screen" needs a scroll
sweep, not only a per-page set (added in the test plan); 9.5 lab INP needs a method (test plan §4.4).

---

## Questions for the main session (options and QA's recommendation)

1. **Product details fold (N21).** (a) Ship stacked as approved; (b) build Tabs and record a deviation.
   **Recommend (a).**
2. **D049 arrow distance (B1.3).** (a) Allow `5px` as a logged G-10 addendum; (b) use `--space-1` (4 px).
   **Recommend (a)**: the founder named the value.
3. **White on Kheelu Blue** (architecture §13). (a) Ask the founder to extend D041's exception to the
   "Save my address" button and blue stickers; (b) restyle that button to a DS variant that passes.
   **Recommend asking (a) with (b) as the fallback**; QA reports it apart either way.
4. **Production smoke without test mode (N10).** (a) Founder waives "checkout in test mode" on
   production in favour of the beta payment on the same commit; (b) temporarily swap production to test
   keys during a low-traffic window. **Recommend (a)**: (b) would block real buyers.
5. **In-app browser payment checks** (audit issue 2; B12). WhatsApp's browser is 35.7% of phone
   sessions. (a) The founder runs a short scripted check on an Android phone in WhatsApp and Instagram
   (QA supplies the steps and a short-lived bypass link, rotated afterwards); (b) a paid device cloud
   (costs money, founder approval). **Recommend (a).**
6. **Ahrefs on beta (N6).** **Recommend off.**
