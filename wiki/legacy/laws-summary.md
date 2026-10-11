---
title: Legacy laws, classified for the reset
type: legacy-summary
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - docs/website-steps.md at tag archive/pre-reset-2026-10-10 (77552ff), 3,393 lines, section 8
  - "git show archive/mid-version-2026-10-10:docs/website-steps.md (section 8.42, lines 3397-3505)"
  - docs/standards/PROJECT_STRUCTURE.md
  - docs/standards/COMPONENT_GUIDELINES.md
  - docs/standards/STRUCTURE-MAP.md
  - docs/checkpoints/blank-404s-2026-09-06.md
  - docs/checkpoints/agency-audit-2026-09-05.md
  - security-review.md
  - wiki/raw/brief/kickoff-brief.md
  - "code greps at 77552ff (= tag archive/pre-reset-2026-10-10), 2026-10-10: src/lib/security-headers.ts:46, src/lib/store/fulfil.ts:84, src/proxy.ts:203"
  - wiki/open-questions.md (IDs)
---

# Legacy laws, classified for the reset

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

The old site kept its rules ("laws") in `docs/website-steps.md` section 8, added round by round from
July to October 2026. This page sorts every law family into what still binds the rebuild and what the
reset replaces. The still-valid engineering lessons themselves are written up in
[engineering/lessons.md](../engineering/lessons.md). Founder decisions that were settled are in
[settled-decisions.md](settled-decisions.md); the wider memory inventory is in
[memory-summary.md](memory-summary.md).

## How to read this page

| Status | Meaning |
|---|---|
| **Still true** | Holds on the new site. Almost all are stack, checkout, tracking, SEO-plumbing or verification laws. |
| **Obsolete** | A design, copy or content law about something the reset replaces, or about something already deleted. |
| **Brief §x** | Superseded by that section of the [kickoff brief](../raw/brief/kickoff-brief.md), which now governs the same ground. |

- "L1981" means line 1981 of `docs/website-steps.md` at `archive/pre-reset-2026-10-10`.
- §8.42 exists only on the unreleased mid version (`git show archive/mid-version-2026-10-10:docs/website-steps.md`); its line numbers are from that file.
- Where one family mixes statuses, it is split into rows.

**Numbering quirks in the source.** Cite by line as well as by number:

- §8.30 is used twice: product artwork (L1215) and the Meta pixel (L1335).
- §8.37-i, -j and -k sit after §8.38 (L2701 to L2858), and §8.39-h comes before §8.39-g (L2953, L2967).
- The agency-audit checkpoint calls the indexable-hosts law "§8.31" (`docs/checkpoints/agency-audit-2026-09-05.md:223`). website-steps calls it §8.32-a (L1739).
- §8.38-h cites "§8.35-3" for the no-overrides rule (L2662). No such law exists; it means §8.33-c (L1904).

## The short version

- **The store and checkout laws (§8.25, §8.26), security (§8.28), the Meta pixel (the second §8.30) and PostHog (§8.38 to §8.41) are still true almost without exception.** They are the logic and tracking that brief §2, §4.3, §4.4 and §9.4 keep.
- **SEO plumbing (§8.21's SEO laws, §8.32, §8.35, §8.36) and the dependency and verification laws (§8.33, §8.34, §8.37-e/f/k) are still true.**
- **Nearly everything in §8.1 to §8.24, plus §8.29, §8.31 and §8.42-i, is design, copy or content**, so it is obsolete or now governed by the brief and the new design system.
- Three laws need a founder decision before they carry over ([open questions](../open-questions.md)): the Lighthouse best-practices exception (§8.34-h, G10), sell-out price staleness on static pages (§8.26-g, G9), and whether the real-family videos stay (§8.37, G3). The old 2.88:1 CTA contrast (§8.29) is gone with the old orange, but the new DS repeats it: [DS gaps](../design-system/gaps.md) G-02, decided at Gate A as G2.

## §8.1 to §8.20: the July 2026 build and design rounds

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.1 (L17) | Job, audience 3 to 6, stack incl. Tally, Framer Motion, model-viewer | Brief §1, §2 | Audience is now 3 to 7 and the goal is sales; Tally retired 2026-08-22 |
| 8.2 (L24) | Old DS → Tailwind token map, type scale, motion values | Brief §4.1, §9.12 | Tokens come only from the new `design-system/` |
| 8.2 gotchas (L45-50) | `overflow-x: clip` not `hidden` on body; no mandatory x scroll-snap on desktop rows; inline SVGs use `currentColor`; scoped class names | Still true | Browser behaviour, not design |
| 8.3 (L52) | Mascot and product cutouts in `public/` | Brief §2 (Imagery) | Only imagery from the DS zip |
| 8.4 (L59) | Component plan (Navbar, MascotScene, FeelingCard and so on) | Obsolete | Component set is rebuilt |
| 8.5 (L66) | Nine routes with sections and keywords | Obsolete | URLs: brief §2 and [url-map](../site/url-map.md); keywords: the new keyword map |
| 8.6 (L78) | Tally pre-order flow and its events | Obsolete | Replaced by the store (§8.25) |
| 8.7 (L84) | Remotion launch video | Obsolete | Component retired in V4 (§8.22-h) |
| 8.8 (L90) | Meta lengths, Lighthouse gates, image and font rules | Brief §9.2, §9.5 | Brief sets title ≤ 60, description ≤ 155, Lighthouse ≥ 90 on mobile |
| 8.9 (L95) | QA plan | Brief §6 (QA), §9 | |
| 8.10 (L98) | Sprint plan | Obsolete | History |
| 8.11 (L119) | Launch checklist | Brief §7 (Phase 8) | The Gate B pack replaces it |
| 8.12 (L123) | Cutouts, 3D hero, launch-film pipeline | Obsolete | 3D and cutout art are not in the new DS |
| 8.13 (L131) | Lighthouse 100 gates, Radix primitives, ghost-fade, AmbientStage | Brief §9.5, §9.11, §9.12 | |
| 8.13 token gate (L145) | `check-tokens.mjs` fails the build on palette drift, and when the v3 DS CSS is missing | Brief §4.1, §9.9 | Replaced by DS checksums and off-token lint. **It still runs inside `npm run build`**: see [lessons](../engineering/lessons.md), section 8 |
| 8.13 hidden tabs (L142) | Hidden tabs freeze `requestAnimationFrame`; verify motion in a visible or headless window | Still true | Browser behaviour |
| 8.14 (L148) | Zero italics, left-aligned, white-label colours, icon rule, sticky CTA | Brief §4.1, §9.1 | Visual rules come from the DS; the mobile sticky buy bar is now §9.1 and §9.10 |
| 8.15 (L163) | Vendored Animate UI registry, `cn()` with tailwind-merge, lucide icons, CTA ripple | Brief §9.11, §9.12 | One motion library, headless libraries only, one icon set |
| 8.16, 8.16.1, 8.16.2 (L176-199) | Sister-site content import, SKU shelf, feature grid | Obsolete | Content |
| 8.16 gotcha (L187) | A running `next start` serves `public/` as snapshotted at build time | Still true | |
| 8.17 (L201) | Kheelu the narrator, feelings cards, `orange-ink` kicker token | Obsolete | Narrator retired on the mid version; all tokens replaced |
| 8.18 tilt (L218) | Tilt never wraps a whole-card link | Still true | Pointer-tracked transforms drop clicks |
| 8.18 rest (L219-221) | Ria on /team, ambient tuning, StagedIntro fold | Obsolete | Content and design |
| 8.19 (L223-229) | Hero conversation device; PlayOS page flow | Obsolete | Content |
| 8.19 LCP (L228) | The hero's largest element must be the priority image | Still true | Same rule as brief §9.11 ("never hide the hero") |
| 8.19 registry, constants (L230-231) | Shared molecules; prices and CTA labels from one config file | Brief §9.12 | Same principle, new component system and content model |
| 8.19 focus, targets (L233) | Brand focus ring; 24 px target floor | Brief §9.6, §9.10 | Brief sets 44 × 44 px |
| 8.20 (L236-291) | Theme B revamp, its QA plan, M4 registry (PageHero, AnswerBlock, FamilyGrid) | Obsolete | AnswerBlock's 40-60 word answer lives on as brief §9.3 |
| 8.20 observer (L287) | A layout-mounted observer must re-arm on `usePathname()` | Still true | Client navigation does not remount the layout |
| 8.20 M4-b (L293-308) | Never animate X on a full-width element; base CSS in `@layer base`; `max-w-full` plus `min-w-0` on narrow children | Still true | Mobile Chrome widens the layout viewport; unlayered CSS beats utilities |

## §8.21 to §8.24: content rounds (July 2026) with engineering sub-laws

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.21 decisions (L320) | Ages 2 to 5, ₹9,999 after launch, platform arc 2 to 14 | Obsolete | Replaced on 2026-08-23, and the age by brief §2 (3 to 7) |
| 8.21 registry, modes, visual anchors (L328-346) | V3 molecules; three modes as "what it does"; one anchor per room | Obsolete | Content and design; mode facts live in [product facts](../product/facts.md) |
| 8.21 age and subscription copy (L341-344) | Render ages and Kheelona+ wording from constants | Brief §2, §9.12 | Principle kept in the new content model; the age value changes to 3 to 7 |
| 8.21 copy-only hero (L347) | A route with a text-only hero ships its first section without a reveal | Still true | A reveal held LCP at opacity 0 (4.3 s) |
| 8.21 axe caveat (L351) | axe skips `opacity: 0` subtrees | Still true | |
| 8.21 never invent (L353) | No invented telemetry, superlatives, or logos without a relationship | Brief §4.2, §9.8 | Same rule, broader |
| 8.21 SEO/AEO laws (L359-377) | All JSON-LD from `lib/seo.ts` in one graph; schema describes visible copy only; founders as entities; India stated; machine files restate visible copy | Still true | Brief §9.2 and §9.3 ask for the same. "Titles carry the keyword" moves to the new keyword map |
| 8.21 AEO plumbing (L379) | `/llms.txt`; robots.txt allows the named AI crawlers | Still true until Gate A | Brief §9.3: keep the current robots policy until the founder decides (G7) |
| 8.21-a (L403) | The app lives at the repo root | Still true | Vercel reads `package.json` from the Root Directory |
| 8.21-b (L414) | A redirect source must never shadow a `public/` directory | Still true | Redirects match before static files |
| 8.21-c (L425) | Vercel Analytics last in body; a tool and its /privacy sentence ship in one commit; no consent banner | Still true | Brief §9.4: consent behaviour stays as it is |
| 8.21-c-i (L441) | GA4 fires only on production hosts, checked in an effect | Still true | |
| 8.21-c-ii (L458) | Ahrefs tag in the server-rendered `<head>`, not host-gated | Still true | Ahrefs verifies by fetching the HTML |
| 8.22-a, b, c, d, e, h (L489-542) | Ink CTA labels; white finale; investor /playos; say lines ≤ 48 chars; audio exemption; V4 registry | Obsolete | Design and content |
| 8.22-f (L522) | A media file that fails folds to the copy beside it; `preload="none"` | Still true | |
| 8.22-g (L532) | Two no-shrink labels in a row widen the viewport; probe `scrollWidth` at 320 and 390 px | Still true | |
| 8.23-1 (L552) | Every tappable surface answers touch, via shared presets | Brief §9.10, §9.11 | "Nothing depends on hover"; one set of motion presets |
| 8.23-2 (L562) | Measure an embedded form's height inside its iframe | Obsolete | Tally gone |
| 8.23-3, -5 (L572, L584) | A brand mark needs a job; the same character never twice in view | Obsolete | Design |
| 8.23-5 corollary (L589) | `aria-hidden` on a wrapper with a focusable child is a serious violation | Still true | |
| 8.23-4 (L578) | One idea, one statement per page | Brief §6 (Copywriter) | "One idea per fold" |
| 8.23-6 (L592) | axe is blind to un-revealed sections; force reveals first | Still true | |
| 8.23-7 (L598) | Build a control before believing a perf story | Still true | |
| 8.24-1 (L610) | An offline claim names its mode | Still true | Claim accuracy; facts in [product claims](../product/claims.md) |
| 8.24-2, -4 (L618, L634) | Growth arc in one place | Obsolete | Content |
| 8.24-3 (L628) | A repeated fact repeats verbatim, from one constant | Brief §9.12 | Content model |
| 8.24-5 (L637) | Harness notes: lazy images need dwell; await visible images only; cross-origin iframes do not paint off-viewport; very tall pages clip; axe needs a 1.5 s settle | Still true | |
| 8.24-6 (L651) | A disclosure's content ships in the HTML (native `<details>`); strip `<script>` before counting | Still true | Matches brief §9.2 and §9.12 |
| 8.24-7, -7a (L669-705) | One kicker colour (`orange-ink`) | Obsolete | Design. 7a's testing lessons (a sweep must name every route; class-string guards miss composition) are still true |

## §8.25 and §8.26: the store

Brief §2 and §4.4 keep the checkout logic, so these all still hold. The step-by-step flow is in
[site/checkout.md](../site/checkout.md) and the price sources in
[product/pricing.md](../product/pricing.md).

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.25-a (L718) | The store is a host rewrite in `src/proxy.ts`, decided by a pure function | Still true | |
| 8.25-b (L729) | Every pre-order CTA reaches the store in one tap; the store page carries price, refund promise and ship date | Still true | A restyle must keep those three facts on the store page |
| 8.25-c, c-i (L760, L767) | Money in paise from one source; the client never sends a price | Still true | |
| 8.25-d (L772) | /refund and /shipping are real pages; one shared seller block | Still true | |
| 8.25-e (L782) | /privacy names every processor | Still true | |
| 8.25-f (L787) | Retired promises are banned by a test, comments stripped | Still true | The banned list itself is content: [product claims](../product/claims.md) |
| 8.25-g, g-i (L792, L799) | Event prices are signed, capped and dated; a partner page may sign its own tier | Still true | |
| 8.25-h, h-i (L813, L819) | One validation run twice; child's age is free text, escaped in email HTML | Still true | |
| 8.25-i (L833) | Email templates live in the repo; a failed email never fails a payment | Still true | |
| 8.25-j (L839) | The in-memory throttle is honest about its limits | Still true | |
| 8.25-k (L846) | A daily cron keeps the free-tier Supabase awake | Still true | |
| 8.25-l (L850) | Our row is written before the gateway order | Still true | |
| 8.25-m (L856) | Webhook verifies the raw body, claims the event id, releases the claim on failure | Still true | |
| 8.25-n (L864) | An address is authorised by a signed token only | Still true | |
| 8.25-o (L870) | Form atoms: real labels, hint and error in `aria-describedby`, 17 px controls | Still true | The error colour now comes from the new DS (brief §4.1) |
| 8.25-p (L877) | Paid is decided twice, through one idempotent `markPaid` | Still true | |
| 8.25-q (L885) | The checkout script loads on first submit | Still true | |
| 8.25-y (L889) | A payment key is not a public identifier | Still true | |
| 8.25-z (L896) | Two chromes via the `(site)` route group; a catch-all inside /store | Still true | |
| 8.25-aa (L905) | The store is noindex and its Lighthouse SEO of about 66 is correct | Still true | Needs sign-off under brief §9.5 if the store counts as a top-5 page (G10) |
| 8.25-bb (L911) | Grepping HTML finds strings in the RSC payload; read `innerText` instead | Still true | |
| 8.25-cc (L919) | The QA harness lives in `tools/qa/` | Still true | Brief §6 names Playwright; the Architect decides whether to port it |
| 8.25-dd (L942) | The go-live runbook; fastest safe stop is removing `RAZORPAY_KEY_ID` and redeploying | Still true | |
| 8.25-ee (L952) | `refund.processed` removes an order from the queue; a partial refund is not a cancellation | Still true | |
| 8.25-ff (L971) | Orphaned payments are recovered through `receipt` and `notes.order_ref` | Still true | |
| 8.26-a to f (L986-1022) | Live-count mode; the count never leaves `mode.ts`; both flips gated; overshoot tolerated; full orders owe nothing; event tokens unaffected | Still true | |
| 8.26-g (L1024) | Static pages cannot flip at sell-out: a manual sweep when `/api/health` reads `preorder:"full"`; no `priceValidUntil` | Still true | In tension with brief §9.1 (price from the checkout's source): [open questions](../open-questions.md) G9 |
| 8.26-h (L1032) | The banned list in the test and in `qa:sweep` change together | Still true | |

## §8.27 to §8.31: design authority, security, CTA colour, artwork

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.27 (L1039) | Design authority is `Design/Kheelona-Design-System-v3/` | Brief §3, §4.1 | `design-system/` is now the authority |
| 8.28-a (L1056) | One header set for both hosts; CSP rolled out in two phases; `'unsafe-inline'` compromise; no HSTS preload | Still true | The CSP is still Report-Only (`CSP_PHASE = "report"`, `src/lib/security-headers.ts:46`) |
| 8.28-b (L1080) | An order credential never sits in a URL a measurement tag can report | Still true | |
| 8.28-c (L1098) | `markPaid` refuses a short payment | Still true | |
| 8.28-d (L1110) | Rate limits key on trusted headers; the firewall rule never widens to `/api/` | Still true | |
| 8.28-e (L1121) | JSON-LD is escaped at the boundary | Still true | |
| 8.28-f (L1127) | Advisory floors on `next` | Still true | |
| 8.28-g (L1135) | Build the control; never point a probe at a measurement host; check the harness first | Still true | |
| 8.29-a, b (L1158, L1181) | White labels on brand orange at an accepted 2.88:1 | Brief §4.1, §9.6 | Overridden: the old orange is gone. The new DS has the same problem (white on Chilli 2.88:1): [DS gaps](../design-system/gaps.md) G-02, [open questions](../open-questions.md) G2 |
| 8.29-c (L1187) | A guard needs two rules: class strings, and props passed through composition | Still true | Testing lesson |
| 8.29-d (L1200) | An accepted failure is classified narrowly and printed, never silenced | Still true | QA method |
| 8.30-a, art (L1217) | Product art described in one file | Brief §9.12 | Each DS asset is referenced from one place |
| 8.30-b, art (L1233) | Test declared `width`/`height` against the real file | Still true | A stale pair is a layout-shift bug |
| 8.30-c, art (L1245) | Cutout halo heuristic tuned to one product colour | Obsolete | No cutout pipeline when imagery comes only from the DS |
| 8.30-d, art (L1258) | Scope a guard to the claim, not the words | Still true | |
| 8.30-e, art (L1266) | An artwork flag travels with its artwork | Obsolete | Guide and flag are gone; the principle survives as §8.42-c |
| 8.31-a, c, d, e (L1283-1333) | Cream plush on a cream ground; options measured | Obsolete | New DS imagery |
| 8.31-b (L1293) | WCAG ratio is a text metric; judge an object on its ground by ΔE | Still true | |
| 8.31-d note (L1323) | A solid colour block is not an LCP candidate | Still true | |

## §8.30 (second use): the Meta pixel

Brief §9.4 keeps every tag, id, event and parameter, so all of these still hold. Ids and events are
listed in [site/tracking-inventory.md](../site/tracking-inventory.md).

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.30-a, b (L1345, L1349) | The pixel mounts last in body; host-gated by the same list as GA4 | Still true | |
| 8.30-c (L1355) | The id is hardcoded; a `NEXT_PUBLIC_` variable cannot be a Vercel secret | Still true | |
| 8.30-d (L1363) | No `<noscript>` pixel | Still true | It cannot be host-gated |
| 8.30-e (L1368) | One funnel, defined once in `features/preorder/lib/analytics.ts` | Still true | |
| 8.30-f (L1375) | Purchase value is the amount collected | Still true | |
| 8.30-g, m, n, o, r (L1383, L1504-1569, L1655) | /privacy must match what is sent; advanced matching stays on (founder); an opt-out must not overstate itself | Still true | New copy must keep these disclosures accurate |
| 8.30-h (L1395) | The CSP carries exact Facebook origins | Still true | |
| 8.30-i (L1403) | Verify through the `fbq` queue without sending anything | Still true | |
| 8.30-j (L1412) | ViewContent on the product page, at the headline price, stale at sell-out | Still true | The mid version also added it to Home; production does not have that (G10) |
| 8.30-k (L1443) | Events fired at mount wait for `fbq` (`whenFbqReady`) | Still true | |
| 8.30-l (L1454) | Server Purchase from `notifyPaid`, shared `purchase_<ref>` event id, no public endpoint | Still true | |
| 8.30-p (L1576) | "Purchase fires on /thanks" is false; grep the source, not the bundle | Still true | |
| 8.30-q, q-i (L1613, L1637) | Every server-event outcome logs; colocated route tests are `<dir>/route.test.ts` | Still true | |
| 8.30-s, s-i (L1671, L1699) | Idempotency guards are allow-lists; mutation-test new behaviour; a commit message is a claim | Still true | |

## §8.32 to §8.36: audit, dependencies, 404s, journal, answer engines

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.32-a (L1739) | Only `INDEXABLE_HOSTS` are indexed; every other host gets `x-robots-tag: noindex` | Still true | This already makes `*.vercel.app` previews noindex, as brief §4.5 requires |
| 8.32-b (L1762) | A renamed product keeps its `@id` and asset filenames; redirects are one hop | Still true | |
| 8.32-c (L1779) | Ban the claim, not one phrasing of it | Still true | |
| 8.32-d (L1791) | A route group is a metadata segment (title template) | Still true | |
| 8.32-e (L1804) | One publisher per page | Still true | |
| 8.32-f (L1813) | Segment out bots before reading behaviour | Still true | |
| 8.32-g (L1828) | Erratum to the artwork §8.30-e | Obsolete | |
| 8.32-h (L1836) | Schema content tests are not schema validity checks | Still true | |
| 8.32-i (L1849) | Next merges metadata shallowly | Still true | |
| 8.33-a to f (L1871-1972) | Floors check every copy; `--save-exact`; no overrides; a green suite cannot validate a bump; story files are unparsed; count the manifests | Still true | |
| 8.34-a (L1981) | A thrown `notFound()` never server-renders; use `dynamicParams = false` | Still true | Its "store uses a 404-status rewrite" half is superseded by §8.34-f |
| 8.34-b (L2014) | Store dead ends are one component, with no "buy again" for a payer | Still true | |
| 8.34-c (L2035) | `STORE_PAGES` guard walks the filesystem | Obsolete | The list was deleted the same day (`docs/checkpoints/blank-404s-2026-09-06.md:197`); "write a mirror-guard from the filesystem" is still true |
| 8.34-d, e (L2049, L2059) | A detector matches both directions; a doc is not a mechanism (`npm run utm`) | Still true | |
| 8.34-f (L2071) | Vercel discards a rewrite's destination when it carries a 4xx; `next start` is not the target | Still true | |
| 8.34-g (L2103) | A local Lighthouse score is not this site's score | Still true | Tags are host-gated |
| 8.34-h (L2134) | Production best-practices of 74 is a founder decision (the Meta pixel) | Brief §9.5 | Needs a root cause and fresh sign-off (pre-approval at Gate A: G10) |
| 8.35-a to f (L2191-2247) | Dates from git; read time derived; sources as data; bylines as entities; `sameAs` confirmed only; banned patterns span sentences | Still true | Journal plumbing; authors per [settled decisions](settled-decisions.md) |
| 8.35-g (L2249) | The journal's voice is guarded at the data | Still true | Mechanism only; the voice rules come from [brand/voice](../brand/voice.md) |
| 8.35-h (L2257) | What the round chose not to do | Obsolete | Round record |
| 8.36-a to h (L2281-2403) | A rename has two halves; `product-facts.ts` is the one spec source; an unrendered component is ungated; measure answer engines directly; know a page's channel; `site:` is not indexing; a 404 does not fix a stale index; Cloudflare appends to robots.txt | Still true | |

## §8.37 to §8.41: video, PostHog, proxy, signups, pixel migration

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.37-a, b, d (L2416, L2434, L2467) | No `<video>` at rest; captions burned in; an empty library renders nothing and is never seeded | Still true, if the videos stay | Brief §2 limits imagery to the DS zip: [open questions](../open-questions.md) G3 |
| 8.37-c, j (L2447, L2762) | Carousel motion switch; the count picks the treatment | Brief §9.11 | Pause rule and motion presets now come from the brief |
| 8.37-e, f (L2482, L2509) | `next dev` on 127.0.0.1 does not hydrate; harness screenshots are server-render evidence | Still true | |
| 8.37-g (L2521) | A guard over an empty list proves itself on fixtures | Still true | |
| 8.37-h (L2533) | Video in a public repo is permanent | Still true | |
| 8.37-i (L2701) | Audio demos removed; the room's content kept | Obsolete | Its testing lessons (deletions move parameterised counts; `git ls-files` reads the index) are still true |
| 8.37-k (L2807) | Repeat checks, test on production, throttle; `ResizeObserver` cannot see transforms | Still true | |
| 8.38-a, d to i (L2549, L2599-2699) | Public PostHog key; replay per route; `ph-no-capture` on the container; funnel defined explicitly; no counts in copy; narrow exemptions; config paths are browser paths | Still true | |
| 8.38-b, c (L2564, L2589) | Asset origin derived; `ui_host` left unset | Still true, inverted by §8.39-d | Behind the `/ingest` proxy both must be configured |
| 8.39-a to h (L2868-2988) | A reverse proxy is a privacy change; proxy runs before rewrites; two non-overlapping prefixes; trailing-slash redirect restored; no CSP change; verify with the control | Still true | |
| 8.40-a to j (L2997-3151) | Check a brief against the code; server-side `purchase_confirmed`; `await flush()`; device-id stitching; `kh_utm` edge cookie; derived abandonment; `data-ph-capture-attribute-cta`; migrations gate deploys; `CAMPAIGN_KEYS` | Still true | |
| 8.41-a to i (L3161-3393) | Ad-account scope; business-scoped CAPI token; pixel-id guard; fresh-asset defaults; raw `fbclid`; headless filtered; `<img>` beacon; Meta mirroring | Still true | 8.41-b is a settled founder decision ([settled decisions](settled-decisions.md)) |

## §8.42: the unreleased mid version (CMO merge, 2026-10-04)

Only on `archive/mid-version-2026-10-10`, lines 3397 to 3505. The mid version itself is archived and
deleted under brief §2; what remains useful is its method.

| § (line) | Law, in one line | Status | Why |
|---|---|---|---|
| 8.42-a (L3402) | A mockup is two diffs (design and content); separate them before merging either | Still true | Method |
| 8.42-b (L3411) | Keep the URL, change the label | Brief §2 | Same rule |
| 8.42-c (L3418) | A retired component takes its contracts with it (the sticky bar must hide at `#reserve`) | Still true | |
| 8.42-d (L3426) | A claim in a mockup is a question for the founder | Brief §4.2 | The 2026-10-04 confirmations are recorded in [product claims](../product/claims.md) |
| 8.42-e (L3435) | Check a paraphrase against its source | Still true | Brief §9.8 |
| 8.42-f (L3443) | Retire inaccurate wording everywhere, schema included | Still true | Method. The retired microphone wording is still live on production; wording and locations: [product claims](../product/claims.md) §4 (only owner). Fixing it before launch: [open questions](../open-questions.md) Q3(a) |
| 8.42-g (L3450) | Freeze the tracking layer and prove the freeze | Still true | The natural way to prove brief §9.4 parity |
| 8.42-h (L3459) | Every guard is proven against a planted violation | Still true | |
| 8.42-i (L3467) | One orange; bold "display orange" accepted at 2.88:1 | Brief §4.1, §9.6 | The new DS decides; its own contrast gap is [G-02](../design-system/gaps.md) (G2) |
| 8.42-j (L3495) | One source per shared fact (`lib/safety.ts`, `lib/faq.ts`, `lib/comparison.ts`) | Brief §9.12 | Same principle; those files exist only on the mid version |

## docs/standards

| Document | Rule, in one line | Status | Why |
|---|---|---|---|
| `PROJECT_STRUCTURE.md` | Atomic design (`components/{atoms,molecules,organisms,templates}`), `features/`, `@/*` alias | Brief §9.12 | The brief's tree (`components/ui`, `sections`, `content/`, `motion/`); the Architect maps it onto Next's `app/` |
| `PROJECT_STRUCTURE.md` §1 | `app/` for routing only; server components by default; client components as leaves; colocate | Still true | Next App Router practice |
| `COMPONENT_GUIDELINES.md` | Search before you build; reuse, extend, compose; token-driven; a story and a test per component | Brief §4.10, §9.12 | Same principle, with wiki catalogues; keeping Storybook is the Architect's call |
| `STRUCTURE-MAP.md` | Old to new path translation (July reorg, repo-root move) | Obsolete | Still needed to read old docs and checkpoints |

## Conflicts found while classifying

- **§8.34-a vs §8.34-f.** L2006-2009 says the store answers 404 through a status rewrite; L2071-2098 and `docs/checkpoints/blank-404s-2026-09-06.md:169-217` say that failed on Vercel and the store answers 200. The later text is right.
- **`security-review.md` §2 vs the code.** It says `markPaid` guards with `.neq("status","paid")`; the code uses an allow-list, `.in("status", PAYABLE_STATUSES)` (`src/lib/store/fulfil.ts:84`), since 2026-09-02 (§8.30-s, L1671).
- **CTA colour has changed three times** (§8.22-a ink labels, §8.29 white at 2.88:1, mid §8.42-i one orange). The new DS decides now, and its white-on-Chilli cta repeats the 2.88:1 failure ([DS gaps](../design-system/gaps.md) G-02; G2).
- **Lighthouse targets**: §8.13 says 100 for accessibility, best practices and SEO; `CLAUDE.md` says 90+; brief §9.5 says ≥ 90 for all four on mobile (median of 3), and production best practices is 74 by founder decision (§8.34-h; G10).
- **Tap targets**: §8.19 sets a 24 px floor; brief §9.10 sets 44 × 44 px.
