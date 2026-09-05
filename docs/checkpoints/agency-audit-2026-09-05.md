# Agency audit round, and the Lumi → Kheelu rename (2026-09-05)

**Commits:** `c5cca99` (correctness) → `500bccb` (rename) → `1d93609` (docs) → `0830317` (QA harness) → `584e724` (Site Audit fixes)
**Rollback tag:** `pre-kheelu-rename-2026-09-05` = `63f6e70`.
**Status:** merged to `main`, pushed, **NOT deployed**. The founder takes it live manually.

A digital marketing agency delivered a 16-item handoff ("Annexure A", version 2, 5 September 2026).
This is the CTO review of it, what was accepted, what was rejected and why, and what the review
found that the handoff did not.

---

## The four founder decisions taken in this round

1. **Rename Lumi → Kheelu**, resolving the name collision by renaming the **mode**. Product and
   mascot now share the name; `Kheelu mode` became **Story mode**. Kheelona, PlayOS, Kheelona+ and
   the Kheelu Speaker are untouched.
2. **The eight false payment claims ship as part of this release**, not as a separate hotfix.
3. **All four safety mechanisms are confirmed as built** and the copy stands unchanged: microphone
   off until the wake word, first processing on device, closed library with no open-internet access,
   conversations stay in region. Recorded here so the next session does not re-litigate it.
4. **The home hero is unchanged.** The agency's replacement H1 was declined.

Also settled: **no specs table** (D08), because no spec is signed off. Recorded as blocked, not
skipped.

---

## What the site was actually doing wrong

Verified against the live site and the source, not taken on the handoff's word.

### The eight false payment claims

Since the paid store opened on 2026-08-22 a pre-order costs a real ₹499. These were live:

| Where | What it said |
|---|---|
| `/products/lumi` FAQ | "Do I have to pay anything now?" → **"No."** — also inside the `FAQPage` JSON-LD |
| `/products/lumi` body | "Reserving now does not commit you to buy." |
| 3 articles | "the pre-order list is open, and **joining costs nothing**" |
| 4 articles | "the pre-order list is open" |

The agency found **one**. The other seven came from grepping the source, which they could not do.

`test/preorder-copy.test.ts` existed precisely to prevent this and passed through all eight, because
it banned the literal string `no payment` and the site had said the same thing eight other ways. It
now bans the **idea** — that reserving is free, that it is a list, that it carries no commitment —
and has been demonstrated to fail on the original copy before being accepted.

### Three gates that were green over their own bug

This is the pattern of the round, and it is the same lesson as the launch's three artefact-only
defects.

1. **`test/preorder-copy.test.ts`** — above.
2. **`test/metadata-lengths.test.ts`** — carried `ROOT_SEGMENT = {"src/app/(site)/page.tsx"}` on the
   theory that Next's `%s · Kheelona` template skips the segment that defines it. True of
   `app/page.tsx`; **false here**, because `(site)` is a route group and a route group *is* a
   metadata segment. So production served
   `Lumi: the screen-free AI toy with a tutor inside, ages 3+ · Kheelona · Kheelona` for months while
   the guard written to catch a doubled brand reported green. The exception is deleted; every route
   now writes a bare title and no page may contain the brand at all.
3. **The schema de-duplication** had no gate. `SiteChrome` called `graph()` and every page called it
   again, so all eleven marketing pages shipped **two** `ld+json` scripts each declaring the same
   `Organization` and `WebSite` `@id`. `graph()` is now split into `siteEntityGraph()` (SiteChrome
   only) and `pageGraph()` (page nodes, publisher by `@id` reference), and **deleted** rather than
   renamed so a stale call cannot compile. Both the call site and the return shape are pinned.

### Everything else found

- **The sitemap lied on every build.** `lastModified: new Date()` on all 31 URLs, one distinct
  timestamp between them, telling Google nineteen untouched articles changed on every deploy. The
  field is now omitted; we have no trustworthy per-page date and omitting beats guessing.
- **`website-hdn2.vercel.app` served a complete, indexable duplicate of the site** with no robots
  directive of any kind. Ahrefs had recorded real sessions on it. Now `noindex` by host, via a new
  `INDEXABLE_HOSTS` list in `config/site.ts`, applied as a header in `src/proxy.ts`.
- **`/lumi`, `/faq` and `/sitemap` all 404'd and all took real traffic.** Now 308s.
- **Two articles pitched a 3+ product to parents of under-threes** with no age statement:
  `brain-development-toys-for-a-2-year-old` and `talking-toys-and-late-talkers`. Both carry an age
  aside now. The late-talker one also says plainly that Kheelu is not a treatment for speech delay.

---

## Verdicts on all 16 items

| # | Item | Verdict |
|---|---|---|
| D01 | Move product URL | **Done.** `/products/lumi` → `/products/kheelu`, 308, query preserved. |
| D02 | New `kheelu.ts` fact module | **Rejected.** `config/site.ts` already does this in paise with a guard test; their version reintroduces float rupees and a second source. |
| D03 | Metadata + canonicals | **Mechanism accepted, copy rejected.** The title bug was real. Their replacement titles turn question-shaped headlines into category labels. |
| D04 | Rewrite home hero | **Declined by founder.** |
| D05 | Section IDs + anchor nav | **IDs done** (`#price`, `#how-it-works`, `#faq`, `#story-mode`). No anchor nav, no reorder. |
| D06 | Pre-order price table | **Done.** `PriceTable` molecule, every figure derived from config. |
| D07 | Fix the FAQ contradiction | **Done, ×8.** Their "one array for HTML and JSON-LD" already existed. |
| D08 | Specs table | **Blocked on product data.** Nothing published. |
| D09 | Safety disclosure | **Copy unchanged** per founder reconfirmation. Their claim-stripping declined: they had no visibility into what is founder-licensed here. |
| D10 | Product identity + dedupe | **Dedupe done.** `availabilityStarts` **kept** — they conflated it with a delivery promise; it is the schema property for when an offer becomes available. |
| D11 | Nav, breadcrumbs, links | **Partly.** Every article now links `/safety` (lowest exit rate on the site, 12.9%). No visible breadcrumb. Their "no doorway pages" advice agreed with and followed. |
| D12 | Sitemap and robots | **Done.** They found the `lastmod` bug. Their "no `llms.txt` needed" is wrong: we ship one and it is plausibly feeding the ChatGPT traffic. |
| D13 | Checkout noindex | **Already done.** Verified live before the round. |
| D14 | Article age CTAs | **Done.** |
| D15 | Perf gates | **No code change needed.** `preload="none"` already set. Gates re-measured. |
| D16 | Release test | **Intent accepted, Playwright rejected.** Folded into Vitest and `tools/qa/`. |

---

## What the Ahrefs export actually said

All 21 CSVs, fortnight to 2026-09-05, ~600 visitors.

- **A large share of the traffic is not human.** Mountain View is the **#1 city at 121 visitors**,
  ahead of Bengaluru's 94. OS "Unknown" is 96 visitors at 94.5% bounce and 772s duration; GNU/Linux
  is 42 at 97.6% bounce and **0s**. Roughly 140–190 of ~600 are machines.
- **That explains `/privacy`** being the #2 entry page at 78 visitors, 92.5% exit and 487s on page:
  a compliance scanner reading the policy end to end, not parents.
- **It also means home's 72% bounce is inflated**, since bots land on `/`. `ExitPages.csv` agrees the
  content works: `/safety` exits at 12.9%, `/playos` 21.8%, the product page 28.5%.
- **AI search is ~47% of search traffic.** ChatGPT 66–74 visitors against Google's 75, at 394s
  average duration. This is the single strongest argument against the agency's metadata rewrites.
- **No campaign tagging exists at all** → `docs/utm-conventions.md`, written this round.

**These files contain no keyword, backlink, ranking or Core Web Vitals data** — they are Ahrefs Web
Analytics, not Site Explorer or Site Audit. Indexing coverage and field CWV remain unverified.

---

## Ahrefs Site Audit, read from the dashboard (crawl of 2026-09-03)

The Web Analytics export carries no crawl data, so this came from the Site Audit
dashboard directly. Health Score **100**, **0 errors**, 45 warnings, 46 notices, 118 URLs.

It independently confirmed two fixes from this round before they deployed: the crawl records the
home title as `... ages 3+ · Kheelona · Kheelona`, and the structured-data panel lists
`Organization` and `WebSite` **twice each** on the same page.

It also found **three real defects that neither the agency handoff nor the source review caught**,
all now fixed.

### Open Graph was incomplete on 31 of 31 pages

`og:type` missing everywhere — and on inspection so were `og:site_name`, `og:locale` and, most
expensively, **`og:image`**.

Cause: **Next merges metadata shallowly.** A page's `openGraph` REPLACES the root layout's rather
than merging into it, and `pageMeta()` returned `openGraph: { url: path }`. So every page that used
the helper — which is every marketing page — deleted the four fields the layout had set.

The cost was not theoretical. `og.png` existed and was declared in the layout, and **no page ever
carried it**: every WhatsApp, Facebook and LinkedIn share of this site rendered with a blank preview
card, on a product whose India referral loop is a WhatsApp share (`WHATSAPP_SHARE_HREF`). `pageMeta`
now returns the complete card, and four assertions pin the fields that were being dropped.

A side effect worth noting: `og:title` no longer carries the brand suffix, because `pageMeta` sets
it explicitly rather than inheriting the template. That is an improvement, not a loss — the brand is
carried by `og:site_name`, which is what a share card renders it from.

### `contactOption: "WhatsApp"` was an invalid value, on every page

The one schema.org **error** in the crawl, ×31. `contactOption` takes a `ContactPointOption`, an
enumeration with exactly two members: `HearingImpairedSupported` and `TollFree`. "WhatsApp" is
neither. The code comment claiming it was "the honest way to say that in schema" was simply wrong.
Replaced with `url: SUPPORT_WHATSAPP_HREF`, which is valid, names the exact channel, and is
followable by a parser and clickable by a person.

### `founders` is deprecated, superseded by `founder`

Four warnings per page, ×31. Same value, current property name.

**Why the suite missed all three:** it asserted what the schema *says* — no gated facts, no invented
numbers, the right age band — and never whether schema.org *accepts* it. Content guards and validity
guards are different jobs, and this repo only had the first.

### Read and deliberately not actioned

- **"Title too long" ×3 and "Meta description too short" ×3.** These land on copy already recorded as
  founder decisions: `STORY_TITLE_CAP = 80` exists because a story's title is also its H1 and its
  card label, and Home is over budget on purpose (2026-08-12). Ahrefs' thresholds are soft; the
  decisions are explicit. Churning approved editorial to satisfy a linter would be the wrong trade.
- **"Redirect chain" ×1** — `http://www.kheelona.com` → `https://www.kheelona.com` → `https://kheelona.com`.
  Two hops, and it is Vercel domain configuration rather than anything in this repo. Only affects
  someone typing `http://www`. Logged for the founder; low value.
- **"Noindex page" ×1 / "Nofollow page" ×1** — the store, correct by design (§8.25-aa).

---

## Confirmed by a post-deploy Ahrefs crawl (2026-09-05, 19:00 IST)

Triggered from the dashboard after the site went live, because the scheduled weekly crawl was not due
until 10 September and the 3 September one describes the pre-change site. **This is independent
third-party confirmation across all 31 pages, not our own measurement repeated.**

| Ahrefs metric | 3 Sep crawl | 5 Sep crawl |
|---|---|---|
| Incomplete Open Graph tags | **31** | **0** (delta −31) |
| Basic OG implementation | Incomplete 31 | **Complete 31** |
| `og:type` distribution | **Missing 31** | **website 31** |
| Structured data schema.org validation error | **31** | **absent from the issue list** |
| Total issues | 91 | **70** |
| Warnings | 45 | **13** |
| Health Score / Errors | 100 / 0 | **100 / 0** |
| Title too long | 3 | **2** |

All nine Open Graph tags now report "Set" on every page: `og:title`, `og:type`, `og:image`,
`og:url`, `og:description`, `og:image:width`, `og:image:height`, `og:locale`, `og:site_name`. Twitter
cards read Complete 31, "summary with large image" 31.

**What remains, all known and none of it new:** the three accepted short meta descriptions and two
long titles (founder-recorded editorial decisions, §8.32 notes); one nofollow and one noindex page,
which are the store by design (§8.25-aa); the single `http://www` → `https://www` → apex redirect
chain, which is Vercel domain configuration rather than anything in this repo; one slow page; and 31
"changed pages not submitted to IndexNow", which is informational because this site does not use
IndexNow. "Meta description changed ×8" and "Title tag changed ×4" are the rename itself showing up
in a diff against the pre-rename crawl.

Crawl credits used: the account showed 4,936 remaining, so the quota concern raised before triggering
it was unfounded — worth knowing next time.

---

## New laws

**§8.31 (crawl hosts).** Only `INDEXABLE_HOSTS` may be indexed; every other host serving this app
gets `x-robots-tag: noindex, nofollow` from the proxy. It is deliberately **not** the same list as
`GA4_HOSTS`: that list answers "where is measurement real" and includes the store; this one answers
"where is indexing wanted" and must not. Loopback **is** on the indexable list, because no crawler
can reach it and serving noindex there scored a local Lighthouse SEO of 69 instead of 100 — a gate
manufacturing its own failure.

**§8.32 (a renamed product keeps its `@id`).** `KHEELU_PRODUCT["@id"]` is still
`https://kheelona.com/products/lumi#product` and must stay. It is an opaque stable identifier, not a
link: it is how a consumer that already knows this product recognises it as the same one. The
navigable address (`offers.url`, the canonical) moved. Never surface it in the UI, never "fix" it to
match the route. Asset filenames follow the same principle: `/product/lumi.png` and the audio demos
keep their names.

**§8.33 (ban the idea, not the phrasing).** A retired-copy guard that matches one wording is a
spell-checker. `test/preorder-copy.test.ts` let eight live instances of "a pre-order is free"
through because it matched `no payment`. Retired-promise patterns must cover the claim, and each new
pattern must be shown to fail on the original copy before it is trusted.

---

## Verification

| Gate | Before | After |
|---|---|---|
| Vitest | 985 pass | **1002 pass** |
| `qa:sweep` | clean 34/34, 79 accepted | **clean 34/34, 79 accepted** |
| Lighthouse home (desktop) | 99/96/96/100 | **98/96/96/100** |
| Lighthouse product | 99/96/96/100 | **99/96/96/100** |
| Lighthouse store | 90/96/96/66 | **90/96/96/66** |
| Duplicate entities | 2× on 11 pages | **0** |
| Sitemap `lastmod` | 31 entries, 1 distinct | **0 (omitted)** |
| Internal links reaching a redirect | — | **0**, crawled across all 31 routes |
| Redirect hops | — | **1** for every legacy route |
| `og:image` on a page | **absent, all 31** | **present, all 31** |
| `og:type` / `og:site_name` / `og:locale` | **absent, all 31** | **present, all 31** |
| schema.org validation errors | **1 × 31 pages** | **0** |
| schema.org deprecation warnings | **4 × 31 pages** | **0** |

Store perf of 90 is **not a regression**: a control build of `63f6e70` measures 90 with the same
4.2s Speed Index. The 100 recorded in `CLAUDE.md` was measured on production behind Vercel's CDN;
localhost is 90 either way. Built the control rather than believing the story, per §8.28.

The `qa:sweep` run caught a defect this round introduced: `PriceTable` first shipped `text-ink-muted`
on the sun wash at **4.19:1**, which fails AA and is *not* the §8.29 accepted pair. Fixed to
`text-ink` before commit.

---

## Open, for the founder

- **The art has not been reconciled.** Kheelu is a cream rabbit in the hero and a Foxy-Deer in the
  corner guide. Users never see either named, so nothing reads as broken today, but the two want
  resolving before `gemini-handoff/hero-2026-08/` is used.
- **Specs (D08)** stay blocked until dimensions, weight, battery with test conditions, charging,
  materials, box contents and warranty are signed off.
- **`/privacy`'s traffic** is bot-dominated. Nothing to fix; do not read it as parent behaviour.
- **Ahrefs Site Audit and Search Console** were not consulted this round. Indexing coverage and
  field Core Web Vitals remain genuinely unverified, and no file in the export can settle them.
- **After deploy:** submit the sitemap in GSC, inspect `/products/kheelu`, and keep the
  `/products/lumi` history alongside it when comparing organic performance.
