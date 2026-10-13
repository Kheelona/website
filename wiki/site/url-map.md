---
title: URL map (live site inventory)
type: inventory
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - git tag archive/pre-reset-2026-10-10 (= 77552ff, production main)
  - git tag archive/mid-version-2026-10-10 (= 50827d1, the unreleased CMO merge, never deployed)
  - next.config.ts
  - vercel.json
  - src/proxy.ts
  - src/lib/store/host.ts
  - src/lib/trailing-slash.ts
  - src/config/site.ts
  - src/app/sitemap.ts
  - src/app/robots.ts
  - src/app/llms.txt/route.ts
  - src/app/pricing.md/route.ts
  - src/app/(site)/**/page.tsx
  - src/app/store/**/page.tsx
  - src/app/api/**/route.ts
  - src/lib/stories.ts
  - src/lib/stories-expansion.ts
  - src/lib/store/fulfil.ts
  - src/lib/seo.ts
  - test/redirects-vs-assets.test.ts
  - docs/utm-conventions.md
  - docs/preorder-events.md
  - docs/checkpoints/closed-rounds.md
  - CLAUDE.md (root, at the tag)
  - raw/brief/kickoff-brief.md (sections 6 and 7, Phase 1 remits)
  - "GET https://kheelona.com/sitemap.xml, /robots.txt, /llms.txt, /pricing.md (browser User-Agent), 2026-10-11 00:42 UTC"
  - "Crawl: GET of all 35 sitemap URLs plus every internal link found on them, one request at a time, 1 s apart, 2026-10-11 00:43-00:45 UTC"
  - "Targeted GETs: 70 redirect sources, store-host paths, machine routes, subdomains and guessable paths, redirects followed by hand, 2026-10-11 00:46-00:55 UTC"
  - "PostHog project 617632 (read-only HogQL on the sessions table and metaads_* warehouse tables), run 2026-10-11 00:50-00:57 UTC; queries in full under 'Queries used'"
---

# URL map (live site inventory)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

What every public URL of kheelona.com does today, so the reset can keep each one working (brief
section 2 "URLs" and 9.2: every existing URL answers 200 or 301s in **one** hop to its closest
equivalent). Snapshot of production on 2026-10-10 (US Pacific; 2026-10-11 00:42-00:57 UTC).
Tracking IDs, the PostHog proxy mechanics and cookies live in
[tracking-inventory](tracking-inventory.md); the checkout steps live in [checkout](checkout.md).

## At a glance

- **35 indexable URLs**: 13 marketing pages and 22 journal articles. All 35 answer **200**, each is
  self-canonical, `<html lang="en-IN">`, one `<h1>`. The live sitemap equals the code's list
  exactly (`src/app/sitemap.ts:7-26`, `:56-60`; diff run 2026-10-11).
- **Crawl found nothing outside the sitemap.** Every internal link on all 35 pages points at a
  sitemap URL or at `https://store.kheelona.com` (the only discovered extra). The crawler reads
  server HTML only; links injected by JavaScript would not be seen.
- **24 redirect rules** in `next.config.ts:84-194`, plus two in `src/proxy.ts` (trailing slash,
  `/store/*` on the apex) and two at Vercel's edge (`http`, `www`). On the apex every rule is
  **one hop, 308, query string kept**.
- **Chains exist only through `www` and `http`**: `https://www.kheelona.com/privacy-policy` takes
  2 hops, `http://www.kheelona.com/product-page/…` takes 3. See [section 4](#4-redirects).
- **No redirect shadows a `public/` folder** (checked live and guarded by
  `test/redirects-vs-assets.test.ts:27-58`).
- **PostHog landing data covers 2026-09-19 10:52 to 2026-10-10 23:02 UTC only** (PostHog was
  installed 2026-09-19), 873 sessions with a pageview. 80.9% land on `/`. The site has been live
  since 2026-07-28 (`CLAUDE.md:664`), so **the first ~7 weeks of landings are not on this page**;
  that window (GA4, Search Console, Ahrefs) is handed to Phase 1's PostHog Analyst and Search & AI
  Visibility agents ([brief §6](../raw/brief/kickoff-brief.md)). Nor does traffic show which event
  tiers were ever printed on QR codes: [open questions](../open-questions.md) F13.

## 1. Indexable marketing URLs

All live checks: GET with a browser User-Agent, 2026-10-11 00:43-00:45 UTC. "Title" is the live
`<title>`; "Chars" counts it including the ` · Kheelona` suffix (brief 9.2 asks for 60 or fewer).
"Landings" = PostHog sessions whose first pageview was this path, out of **873**
(2026-09-19 10:52 to 2026-10-10 23:02 UTC, query A).

### 1a. Pages (13)

| Path | Purpose (from live H1 and meta description) | Live | In sitemap | Title (live) | Chars | Landings |
|---|---|---|---|---|---|---|
| `/` | Home: "A best friend at 3. A head start for school." Pre-order pitch | 200 | yes (1.0) | Kheelu: the screen-free AI toy with a tutor inside, ages 3+ · Kheelona | 70 | 706 (80.9%) |
| `/products/kheelu` | Product page: "Meet Kheelu", price, modes, FAQ (`#faq`), reserve (`#reserve`) | 200 | yes (0.9) | Meet Kheelu: the talking toy that teaches, ages 3+ · Kheelona | 61 | 31 (3.6%) |
| `/safety` | How Kheelu answers the AI-toy safety questions | 200 | yes (0.8) | Are AI toys safe? How Kheelu is built to be · Kheelona | 54 | 2 (0.2%) |
| `/playos` | Platform page ("The operating system for childhood") | 200 | yes (0.8) | PlayOS: one platform for childhood, ages 3+ · Kheelona | 54 | 1 (0.1%) |
| `/ai-toys-for-kids-in-india` | Buyer's guide, written for answer engines | 200 | yes (0.8) | AI toys for kids in India: how to choose one · Kheelona | 55 | 7 (0.8%) |
| `/stories` | Journal index ("Raising curious kids") | 200 | yes (0.7) | Stories: raising curious kids · Kheelona | 40 | 0 |
| `/team` | The people behind Kheelu | 200 | yes (0.6) | Team: the parents building smart toys for toddlers · Kheelona | 61 | 7 (0.8%) |
| `/setup` | Day one with Kheelu | 200 | yes (0.5) | Setup: day one with Kheelu · Kheelona | 37 | 0 |
| `/contact` | How to reach the team | 200 | yes (0.4) | Contact: how to reach the team behind Kheelu · Kheelona | 55 | 3 (0.3%) |
| `/privacy` | Privacy policy | 200 | yes (0.3) | Privacy · Kheelona | 18 | 42 (4.8%), see note |
| `/terms` | Pre-order terms | 200 | yes (0.3) | Terms · Kheelona | 16 | 0 |
| `/refund` | Refunds and cancellation | 200 | yes (0.3) | Refunds and cancellation · Kheelona | 35 | 1 (0.1%) |
| `/shipping` | Shipping and delivery | 200 | yes (0.3) | Shipping and delivery · Kheelona | 32 | 0 |

Route files: `src/app/(site)/<path>/page.tsx` on `archive/pre-reset-2026-10-10`.

**Note on `/privacy`.** 38 of the 44 sessions that viewed `/privacy` have no recognisable browser
or OS (desktop, `$browser` null), one pageview each, spread 2026-09-19 to 2026-10-10, all
"direct" (query E). That pattern looks automated (a checker revisiting a privacy link); the source
is **not verified**. Treat `/privacy` landings as mostly non-human. Only 11 of the 714 sessions
that viewed `/` show the same pattern.

### 1b. Journal articles (22)

Data source: `STORIES = [...CORE, ...EXPANSION]` (`src/lib/stories.ts:161`; slugs at
`src/lib/stories.ts:49,75,99,123` and `src/lib/stories-expansion.ts`). Unknown slugs are a routing
404 (`dynamicParams = false`, `src/app/(site)/stories/[slug]/page.tsx:38`); live
`/stories/no-such-slug` → 404. All 22 are in the sitemap at priority 0.6 with a `lastmod`.

| `/stories/…` | Title (live) | Chars | Landings |
|---|---|---|---|
| `why-three-to-six-are-the-years-that-matter-most` | Why the early years matter most · Kheelona | 42 | 0 |
| `screen-free-does-not-mean-silent` | Screen-free does not mean silent · Kheelona | 43 | 0 |
| `how-children-learn-by-talking` | How children learn by talking · Kheelona | 40 | 0 |
| `what-to-look-for-in-a-safe-ai-toy` | What to look for in a safe AI toy · Kheelona | 44 | 1 |
| `how-much-screen-time-for-a-3-to-6-year-old` | How much screen time is okay for a young child? · Kheelona | 58 | 0 |
| `screen-time-and-tantrums` | Screen time and tantrums: what is actually happening · Kheelona | 63 | 0 |
| `the-gentle-way-off-the-phone` | The gentle way off the phone: a seven-day plan · Kheelona | 57 | 0 |
| `how-to-get-your-child-talking` | How to get your child talking · Kheelona | 40 | 1 |
| `talking-late-or-talking-little` | Talking late, or talking little? · Kheelona | 43 | 0 |
| `what-actually-builds-a-sharp-brain` | What actually builds a sharp brain in the early years · Kheelona | 64 | 1 |
| `how-children-collect-words` | How children collect words · Kheelona | 37 | 0 |
| `raising-a-bilingual-child-in-india` | Raising a bilingual child in India · Kheelona | 45 | 0 |
| `should-kids-use-ai` | Should kids use AI? An honest answer from people who build it · Kheelona | 72 | 1 |
| `busy-hands-no-screens` | Busy hands, no screens · Kheelona | 33 | 0 |
| `does-a-three-year-old-need-an-ai-tutor` | Does a three-year-old need an AI tutor? · Kheelona | 50 | 0 |
| `a-toy-that-talks-vs-a-toy-that-listens` | A toy that talks is not a toy that listens · Kheelona | 53 | 1 |
| `screen-time-rules-parents-swear-by` | The 3-6-9-12 rule, and other screen rules parents swear by · Kheelona | 69 | 0 |
| `talking-toys-and-late-talkers` | Late talker? What helps a child find their words · Kheelona | 59 | 0 |
| `brain-development-toys-for-a-2-year-old` | Brain development toys for a two-year-old: read this before the label · Kheelona | 80 | 0 |
| `learning-toys-for-a-three-year-old` | Learning toys for a three-year-old, skill by skill · Kheelona | 61 | 2 |
| `questions-parents-ask-about-ai-toys` | The hard questions parents ask about AI toys · Kheelona | 55 | 0 |
| `ai-toys-and-indias-data-law` | What India's data law asks of a toy that listens · Kheelona | 59 | 0 |

- **Titles over 60 characters (brief 9.2):** `/` (70), `/products/kheelu` (61), `/team` (61) and
  six articles (61-80). Recorded only; the reset rewrites titles.
- **`brain-development-toys-for-a-2-year-old`** is a URL and title aimed at two-year-olds, while
  the brief says never imply the product suits under-3s. Whether the copy does is for
  [age-band review](../product/age-band-review.md); the URL itself is part of
  [open questions](../open-questions.md) G5.
- 16 of 22 articles and the `/stories` index had **zero** PostHog landings in the window.

## 2. Store host: `store.kheelona.com` (noindex)

The same app serves this host: every path is rewritten to `/store/<path>` (`src/lib/store/host.ts:53-77`),
and the response carries `x-robots-tag: noindex, nofollow` (`src/proxy.ts:84-94`) plus
`<meta name="robots" content="noindex, nofollow">` (`src/app/store/layout.tsx:28-30`). Not in the
sitemap. What each step does is on [checkout](checkout.md); this table is the URL list.

| URL | Purpose | Live (2026-10-11) | Must keep working because |
|---|---|---|---|
| `https://store.kheelona.com/` | Pre-order page (form + Razorpay). H1 "Reserve Kheelu for ₹499." | 200, noindex | Every "Pre-order" CTA on the site links here (`src/config/site.ts:21-25`); 62 landings (7.1%) |
| `/thanks` | Order confirmation and address form | 200 bare ("We need your link again."), noindex | Razorpay success redirect, and **receipt emails** link `store.kheelona.com/thanks?ref=…&t=…` (`src/lib/store/fulfil.ts:304`); the proxy swaps the token for a cookie and 303s to `/thanks` (`src/proxy.ts:60-82`). Not tested live with a token (it is a customer credential) |
| `/e/<tier>?sig=<sig>` | Signed event price (QR at a stall) | `/e/example` → 200 "That link will not work." | **Printed QR codes** carry the full URL (`docs/preorder-events.md:39-44`); which tiers were ever printed: [F13](../open-questions.md) |
| `/ideabaaz` | Retired partner page: the store's not-found panel since task 6.6 ([D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 7: not needed; no redirect, the founder's choice over a redirect to the store, knowing printed QR codes point here) | Live: 200 "The Ideabaaz exclusive has ended." (the tag's `src/app/store/ideabaaz/page.tsx:23-24`). New site: no route, so the `[...rest]` catch-all answers, as every store dead end: 200 in the store chrome, noindex, "That page is not here." (the status is the store dead end's, `src/lib/store/host.ts:69-74`) | Printed QR codes point here: they keep reaching the store's own page, with its button to the pre-order page and the WhatsApp line |
| any other path, e.g. `/no-such-page`, `/store`, `/products/kheelu` | Store's own not-found panel | **200**, noindex ("That page is not here.") | 200 rather than 404 is a known Vercel constraint (`src/lib/store/host.ts:69-74`) |
| `/thanks/` | trailing slash | 308 → `/thanks` (1 hop) | |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt` | Served identically to the apex (dotted paths skip the proxy, `src/proxy.ts:203`) | 200 | Harmless: the store's robots.txt allows crawling so crawlers can see the noindex |

On the apex, `/store` and `/store/*` 308 to the store host (`src/lib/store/host.ts:79-82`; live:
`/store` → `https://store.kheelona.com/`, `/store/thanks` → `…/thanks`, 1 hop each).

## 3. API and machine routes that must keep working

| Path | Method | Live | What it is | Who depends on it |
|---|---|---|---|---|
| `/sitemap.xml` | GET | 200, 35 URLs | `src/app/sitemap.ts` | Search Console, crawlers; robots.txt names it |
| `/robots.txt` | GET | 200 | `src/app/robots.ts`: `*` allowed, plus explicit allow for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Claude-SearchBot, Google-Extended, Applebot-Extended, CCBot (`:10-22`) | Brief 9.3: keep what it allows until the founder decides ([G7](../open-questions.md)) |
| `/llms.txt` | GET | 200, "Last updated: 2026-09-11" | `src/app/llms.txt/route.ts` (static) | Answer engines; it links 24 site URLs incl. `/pricing.md` and 10 articles |
| `/pricing.md` | GET | 200, "Last updated: 2026-08-23" | `src/app/pricing.md/route.ts` (static) | AI agents comparing prices; linked from llms.txt |
| `/api/health` | GET | 200 JSON (`store: ready`, `preorder: token`, `razorpay: live`) | Readiness and offer mode | **Vercel cron daily 04:00 UTC** (`vercel.json:3-7`); ops checks |
| `/api/preorder/create-order` | POST | not called (POST) | Creates the Razorpay order | Store form ([checkout](checkout.md)) |
| `/api/preorder/confirm` | POST | not called | Verifies payment signature, marks paid | Store form after payment |
| `/api/preorder/address` | POST | not called | Saves the delivery address | `/thanks` form |
| `/api/razorpay/webhook` | POST | not called | Payment webhook | **Razorpay dashboard**: configured as `store.kheelona.com/api/razorpay/webhook`, subscribed to `order.paid` and `payment.captured` (`docs/checkpoints/closed-rounds.md:274`); detail in [tracking-inventory §10](tracking-inventory.md#10-razorpay). Unknown: `refund.processed`, `payment.failed` ([C4](../open-questions.md)) |
| `/api/csp-report` | POST | not called | CSP violation reports | The CSP's `report-uri` (`src/lib/security-headers.ts:35,182`) |
| `/ingest/*`, `/ingest-assets/*` | GET/POST | `/ingest/e/` → 400 (PostHog's own answer to a bare GET), `/ingest-assets/static/recorder.js` → 200, store host `/ingest/e/` → 400 | PostHog reverse proxy (`next.config.ts:55-66`) | PostHog SDK. Mechanics: [tracking-inventory §8](tracking-inventory.md#8-posthog-reverse-proxy-and-routing) |
| `/favicon.ico`, `/icon.png`, `/apple-icon.png`, `/og.png` | GET | 200 each | `src/app/` file conventions and `public/og.png` | Browsers, share cards |

**Asset URLs that structured data or emails point at** (deleting them breaks something outside
the page): `/brand/logo-mark.png` (Organization logo, `src/lib/seo.ts:126`), `/video/launch.mp4`
and `/video/launch-poster.jpg` (VideoObject, `src/lib/seo.ts:268-269`), `/product/lumi.png`
(product art, `src/lib/kheelu-art.ts:22`). The Product JSON-LD `@id` is
`https://kheelona.com/products/lumi#product` (`src/lib/seo.ts:289`): an identifier, not a link, and
the legacy laws say it must not change (see [laws summary](../legacy/laws-summary.md)). Whether any
asset URL is also linked from social posts or partner pages is [open questions](../open-questions.md) C9.

`/.well-known/*` and verification files: none exist; owned by
[tracking-inventory §13](tracking-inventory.md#13-not-present-checked).

**Other hosts (not in this repo; listed so the reset does not disturb them):**

| Host | Live (2026-10-11) | Note |
|---|---|---|
| `api.kheelona.com` | 200 JSON "Kheelona Backend Express API running", `x-robots-tag: noindex, nofollow` | A separate backend |
| `admin.kheelona.com` | 200, title "Kheelona Admin Dashboard", noindex | A separate app |
| `website-hdn2.vercel.app` | 404 | The retired `demo-website` preview, gone as intended |
| `website-git-redesign-mockup-2026-10-apoorvas-projects-5e91bf12.vercel.app` | 302 to Vercel SSO login, `x-robots-tag: noindex` | The mid version's preview ([D002](../decisions/D002-mid-version-identified.md)); seen once as a referrer in PostHog |

## 4. Redirects

All live results: GET, redirects followed by hand, 2026-10-11 00:46-00:55 UTC. Next emits **308**
for `permanent: true`; a 308 is the permanent equivalent of the brief's "301". Query strings
survive (live: `/products/lumi?utm_source=url-inventory-check` → `/products/kheelu?utm_source=url-inventory-check`).

### 4a. Platform and code-level

| Source | Target | Code | Hops (live) | Defined in | Why |
|---|---|---|---|---|---|
| `http://kheelona.com/*` | `https://kheelona.com/*` | 308 | 1 | Vercel (not in repo) | HTTPS |
| `https://www.kheelona.com/*` | `https://kheelona.com/*` | 308 | 1 | Vercel domain setting (not in repo; the response carries Vercel's `refresh` header and none of the app's security headers) | Apex is canonical |
| `http://www.kheelona.com/` | `https://kheelona.com/` | 308, 308 | **2** | Vercel | http → https www → apex |
| any path ending in `/` (except `/` and `/ingest*`) | same path without it, query kept | 308 | 1 | `src/proxy.ts:47-52`, `src/lib/trailing-slash.ts:18-29` | One URL per page, since `skipTrailingSlashRedirect` is on for PostHog (`next.config.ts:30`) |
| `/store`, `/store/*` (apex) | `https://store.kheelona.com/*` | 308 | 1 | `src/lib/store/host.ts:79-82` | One address per store page |
| `store.kheelona.com/thanks?ref=…&t=…` | `/thanks` (cookie set) | 303 | 1 | `src/proxy.ts:60-82` | Takes the credential out of the URL. Never permanent |

### 4b. `next.config.ts` rules (24), all permanent (308), all one hop on the apex

| Source | Target | Live check | Line | Why it exists |
|---|---|---|---|---|
| `/stories/why-three-to-six-matters-most` | `/stories/why-three-to-six-are-the-years-that-matter-most` | 308 → 200 | 86-90 | Short slug people type and share (UX panel 2026-07-10) |
| `/products/lumi` | `/products/kheelu` | 308 → 200 (also `/products/lumi/`) | 107 | Lumi → Kheelu rename 2026-09-05; printed QR codes, WhatsApp forwards, inbound links. "There is no date at which removing it is safe" (`:104-106`) |
| `/product-page/:slug*` | `/products/kheelu` | 308 → 200 | 115 | Legacy Wix product pages (old ₹2,999 price still indexed then) |
| `/product/:slug([^.]+)` | `/products/kheelu` | 308 → 200; `/product/lumi.png` → 200 image | 122 | Legacy Wix; `[^.]+` stops it eating `public/product/` |
| `/shop` | `/products/kheelu` | 308 → 200 | 123 | Legacy Wix |
| `/category/all-products` | `/products/kheelu` | 308 → 200 | 129 | Legacy Wix, "still taking real landings" (`:124-125`) |
| `/category/:slug([^.]+)` | `/products/kheelu` | 308 → 200 (`/category/toys`) | 130 | Other Wix category slugs |
| `/accessibility-statement` | `/products/kheelu` | 308 → 200 | 137 | Wix page; 19 entrances in two weeks of Ahrefs data; founder chose the product page (2026-08-12) |
| `/post/:slug*` | `/stories` | 308 → 200 | 143 | Wix blog posts (Search Console 404 report, 2026-09-05) |
| `/terms-conditions` | `/terms` | 308 → 200 | 144 | Wix |
| `/privacy-policy` | `/privacy` | 308 → 200 | 165 | Wix; Perplexity was citing the dead Wix "Privacy Policy (Beta)" from `www.kheelona.com/privacy-policy` (`:145-164`). "Never delete this" |
| `/for-the-parents` | `/stories` | 308 → 200 | 166 | Wix |
| `/lumi` | `/products/kheelu` | 308 → 200 | 175 | Typed by people (Ahrefs, fortnight to 2026-09-05) |
| `/faq` | `/products/kheelu#faq` | 308 → 200 | 176 | Typed by people; the product page carries `id="faq"` (live). **The mid version removed this and made `/faq` a page** (section 7; [G8](../open-questions.md)) |
| `/sitemap` | `/sitemap.xml` | 308 → 200 | 177 | Typed by people |
| `/blog` | `/stories` | 308 → 200 | 178 | Guessable |
| `/blog/:slug*` | `/stories` | 308 → 200 | 179 | Guessable |
| `/about` | `/team` | 308 → 200 | 180 | Guessable |
| `/community` | `/stories` | 308 → 200 | 181 | Guessable |
| `/login` | `/` | 308 → 200 | 189 | Wix account route, no equivalent (brief: no accounts) |
| `/signup` | `/` | 308 → 200 | 190 | Wix account route |
| `/account/:path*` | `/` | 308 → 200 | 191 | Wix account routes |
| `/cart` | `/products/kheelu` | 308 → 200 | 192 | Wix store |
| `/checkout/:path*` | `/products/kheelu` | 308 → 200 | 193 | Wix store |

`/refund` and `/shipping` **used to** redirect to `/terms`; both became real pages on 2026-08-22
and the comment says not to restore the redirects (`next.config.ts:182-187`). `/category/all-products`
is also matched by the `/category/:slug` rule below it; harmless.

### 4c. Flags

- **Chains (brief 9.2 says none).** Every legacy rule above is one hop on `https://kheelona.com`, but
  the Wix site lived on **`www`**, and the www → apex hop happens at Vercel's edge before the app's
  rules run. Live: `https://www.kheelona.com/privacy-policy` → `https://kheelona.com/privacy-policy`
  → `/privacy` (**2 hops**); `https://www.kheelona.com/products/lumi` (2 hops);
  `http://www.kheelona.com/product-page/kheelu-plush` (**3 hops**). Three Meta ad creatives also
  point at `https://www.kheelona.com/` and one at `http://Kheelona.com/` (section 5c), so those ad
  clicks start with an extra hop. One-hop www legacy redirects: [open questions](../open-questions.md) G8.
- **Shadowing `public/`.** `public/` holds `app brand mascot models partners product products
  recognition stories team video` and `og.png` (`git ls-tree` of `public/` at the tag, 2026-10-11). Only `/product/:slug`
  and `/category/:slug` are wildcards over a name that is (or could be) a folder, and both use
  `[^.]+`; live `/product/lumi.png` still answers 200 `image/png`. Exact-match sources
  (`/products/lumi`, `/stories/why-three-to-six-matters-most`) match no file. The PostHog rewrites
  use `/ingest*`, which is not a folder. No shadow found. The guard is
  `test/redirects-vs-assets.test.ts:27-58`.
- **Fragment target.** `/faq` depends on `id="faq"` staying on the product page; the new page must
  keep that id or the redirect must change in the same commit.

### 4d. URLs that 404 today (no handler)

| Path | Live | Seen as a landing in PostHog? |
|---|---|---|
| `/jobs` | 404 | yes, 2 sessions (direct) |
| `/careers` | 404 | yes, 1 session (direct) |
| `/kheelu` | 404 | no. The product's own name; `/lumi` redirects but `/kheelu` does not. The CMO mockup proposed it as a route (`mid:test/cmo-merge-routes.test.ts:9-10`) |
| `/products` | 404 | no |
| `/pricing` | 404 | no (`/pricing.md` exists) |
| `/how`, `/story` | 404 | no (mid-version routes, section 7) |

The 404 page is the marketing one, title "Page not found · Kheelona", server-rendered. Whether to
redirect the guessable ones (`/kheelu`, `/careers`) is [open questions](../open-questions.md) G8.

## 5. Ad and campaign landing URLs

### 5a. Documented (`docs/utm-conventions.md`)

- Rule 3: tag "the destination a parent should land on, not the home page"; a Story-mode ad goes to
  `/products/kheelu#story-mode` (`:38-39`). The product page carries `id="story-mode"` (live).
- Worked examples (`:47-56`): `https://kheelona.com/products/kheelu?utm_source=instagram&utm_medium=paid_social&utm_campaign=2026-10-launch&utm_content=rabbit-hero-a`;
  `https://kheelona.com/?utm_source=instagram&utm_medium=organic_social&utm_campaign=2026-09-bio`;
  `https://kheelona.com/products/kheelu?utm_source=qr&utm_medium=print&utm_campaign=2026-09-ideabaaz`.
- Meta URL parameters (`:111-118`): `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_id={{campaign.id}}&placement={{placement}}`.
  How these survive to the order: [tracking-inventory §9](tracking-inventory.md#9-attribution-across-kheelonacom--storekheelonacom).

### 5b. Seen in PostHog (session entry, 2026-09-19 10:52 to 2026-10-10 23:02 UTC)

Aggregates only (queries B, C, D). Campaign names from the Meta Ads warehouse table
`metaads_campaigns` (query G).

| Landing URL | utm_source / medium / campaign | Click id | Sessions | Days seen |
|---|---|---|---|---|
| `kheelona.com/` | `an` / `paid` / `120248101035710340` ("20260918_Kids_Interaction_Video Campaign") | fbclid | 96 | 09-19 to 09-23 |
| `kheelona.com/` | `ig` / `paid` / `120248133156820340` ("20260920_Kids_Interaction_Video Campaign Campaign") | fbclid | 37 | 09-21 to 09-22 |
| `kheelona.com/` | `th` / `paid` / `120248133156820340` | fbclid (1 without) | 33 | 09-21 to 09-22 |
| `kheelona.com/` | `fb` / `paid` / `120248101035710340` | fbclid | 11 | 09-19 to 09-20 |
| `store.kheelona.com/` | `an` / `paid` / `120248101035710340` | fbclid (1 without) | 12 | 09-19 to 09-23 |
| `kheelona.com/` | `fb` or `an` / `paid` / `120248133156820340` | fbclid | 7 | 09-20 |
| `store.kheelona.com/` | `fb` / `paid` / `120248101035710340` | fbclid | 1 | 09-19 to 09-20 |
| `kheelona.com/` | none | fbclid only | 215 | 09-19 to 10-08 (205 in the week of 09-21) |
| `store.kheelona.com/` | none | fbclid only | 2 | |
| `kheelona.com/` | none | gclid only | 2 | |
| `store.kheelona.com/` (15), `kheelona.com/` (1) | `ig` / `social`, `utm_content=link_in_bio` (Instagram's own bio-link tagging) | fbclid | 16 | 09-19 to 10-06 |
| `kheelona.com/` (66), `/products/kheelu` (15), `/refund` (1), `/team` (1) | `chatgpt.com` (appended by ChatGPT) | none | 83 | 09-20 to 10-10 |

- **197 paid-tagged sessions, all 2026-09-19 to 2026-09-23, all on `/` or the store root.** None on
  `/products/kheelu`, despite rule 3.
- **Zero session entries with the convention `utm_source=facebook`**, and the `placement`
  parameter never arrived; `utm_id` and `utm_content` did (query D). The founder's re-tag
  (`CLAUDE.md:143-146`; [open questions](../open-questions.md) C5) cannot be confirmed from traffic
  because no paid landing has happened since 2026-09-23.
- 219 sessions carry a click id but no UTM; where they came from is **not verifiable** from PostHog
  alone (no referrer on 210 of them).
- Weekly split (query F): fbclid-without-UTM 11 / 205 / 0 / 1 and paid-tagged 124 / 73 / 0 / 0 for
  the weeks starting 09-14 (partial, from 09-19), 09-21, 09-28, 10-05.

### 5c. Configured in Meta (warehouse sync, query H)

Destinations on the 67 synced ad creatives in `metaads_ad_creatives`. This is ad configuration,
not traffic, and the last sync's view rather than Ads Manager.

| Destination | Creatives |
|---|---|
| `https://kheelona.com/products/kheelu` (no tags on the creative) | 22 |
| `https://kheelona.com/products/kheelu?utm_source=facebook&utm_medium=paid_social&…&placement={{placement}}` | 7 |
| none resolvable on the creative (3 of these carry the convention in `url_tags`) | 24 |
| `https://www.kheelona.com/` | 3 |
| `http://Kheelona.com/` | 1 |
| Instagram profile, Messenger, WhatsApp (`api.whatsapp.com/send`) | 10 |

All 7 campaigns in `metaads_campaigns` were `PAUSED` at the last sync; the newest are
"2026-09-preorder-traffic" and "2026-09-Click-to-Whatsapp" (both started 2026-09-21). Ad status
detail: [tracking-inventory, live snapshot](tracking-inventory.md#live-snapshot-posthog-last-30-days).

## 6. URLs the brief names

| URL (brief section 2) | Live | In sitemap | Notes |
|---|---|---|---|
| `/` | 200 | yes | 80.9% of landings |
| `/products/kheelu` | 200 | yes | Old `/products/lumi` 308s here |
| `/safety` | 200 | yes | |
| `/stories` | 200 | yes | Plus 22 article URLs, section 1b |
| `/team` | 200 | yes | `/about` 308s here |
| `/playos` | 200 | yes | The brief allows proposing to drop or merge it; if dropped, it 301s to its closest page ([G8](../open-questions.md)) |

"All others" are the remaining 29 indexable URLs in section 1, the store URLs in section 2 and
the machine routes in section 3.

## 7. Mid version routes (NOT LIVE)

From `archive/mid-version-2026-10-10` (`50827d1`, branch `redesign-mockup-2026-10`, PR #16). None
of this was deployed ([D002](../decisions/D002-mid-version-identified.md)).

| Route | On the mid tag | Live today |
|---|---|---|
| `/how` | New page, title "How Kheelu helps: serve and return, simply explained" (`mid:src/app/(site)/how/page.tsx:13-18`); in its sitemap at 0.7 (`mid:src/app/sitemap.ts:14`) | **404** |
| `/faq` | New page, title "Questions parents ask about Kheelu" (`mid:src/app/(site)/faq/page.tsx:13-18`); in its sitemap at 0.7 (`mid:src/app/sitemap.ts:15`); its 308 removed (`mid:next.config.ts:174-176`) | **308 → `/products/kheelu#faq`** |
| `/kheelu`, `/story` | Proposed by the CMO mockup, **not built** (`mid:test/cmo-merge-routes.test.ts:9-10`) | 404 |

Every other mid-version route file is the same list as production (`git ls-tree` diff of
`src/app`, 2026-10-10). Whether `/how` and `/faq` become real pages is
[open questions](../open-questions.md) G8.

## Queries used (PostHog project 617632, read-only)

Project timezone UTC (`project-get`). The test-account filter excludes cohort 580233
"Internal / Test users", which has **0 members** ([open questions](../open-questions.md) C7), so
every count includes internal and verification traffic (PostHog shows referrers `localhost:3456`, `127.0.0.1:3456` and the mid-version
preview). Range requested: last 90 days, `2026-07-12 00:00` to `2026-10-11 00:00` UTC; data exists
only from `2026-09-19 10:52:42` to `2026-10-10 23:02:02` UTC.

- **A. Landing paths by host**
  `SELECT $entry_hostname AS host, $entry_pathname AS landing_path, count() AS sessions, round(100 * count() / sum(count()) OVER (), 1) AS pct_of_all FROM sessions WHERE $start_timestamp >= toDateTime('2026-07-12 00:00:00') AND $start_timestamp < toDateTime('2026-10-11 00:00:00') AND $pageview_count > 0 GROUP BY host, landing_path ORDER BY sessions DESC LIMIT 100`
  (window check: `SELECT min($start_timestamp), max($start_timestamp), count(), countIf($pageview_count > 0) …` same range → 1,175 sessions, 873 with a pageview)
- **B. Campaign landings**
  `SELECT $entry_hostname, $entry_pathname, coalesce($entry_utm_source,''), coalesce($entry_utm_medium,''), coalesce($entry_utm_campaign,''), coalesce($entry_fbclid,'') != '' AS has_fbclid, coalesce($entry_gclid,'') != '' AS has_gclid, count() FROM sessions WHERE <range> AND $pageview_count > 0 AND (coalesce($entry_utm_source,'') != '' OR coalesce($entry_utm_campaign,'') != '' OR coalesce($entry_fbclid,'') != '' OR coalesce($entry_gclid,'') != '') GROUP BY 1,2,3,4,5,6,7 ORDER BY count() DESC LIMIT 200`
- **C. Untagged and organic-social landings by referrer**: as B with `coalesce($entry_referring_domain,'')` and `utm_content` for `ig`/`social`, filtered to `utm_source = '' OR utm_medium = 'social'`.
- **D. Custom parameters and dates**: as B grouped by source, campaign, `extractURLParameter($entry_current_url,'placement')`, `extractURLParameter($entry_current_url,'utm_id') != ''`, `utm_content != ''`, with `min/max(toDate($start_timestamp))`.
- **E. `/privacy` traffic shape**: `SELECT properties.$browser, properties.$os, properties.$device_type, min(toDate(timestamp)), max(toDate(timestamp)), count(), uniq($session_id) FROM events WHERE event = '$pageview' AND timestamp >= '2026-09-19' AND timestamp < '2026-10-11' AND properties.$host = 'kheelona.com' AND properties.$pathname = '/privacy' GROUP BY 1,2,3`; and sessions per path with `properties.$browser IS NULL`.
- **F. Weekly split**: `toStartOfWeek($start_timestamp, 1)` with `countIf` for fbclid-without-UTM, `utm_medium = 'paid'`, `utm_source = 'chatgpt.com'`, same range.
- **G. Campaign names**: `SELECT id, name, effective_status, objective, start_time, stop_time FROM metaads_campaigns ORDER BY start_time DESC LIMIT 20`.
- **H. Creative destinations**: `SELECT coalesce(nullIf(link_url,''), nullIf(JSONExtractString(object_story_spec,'link_data','link'),''), nullIf(JSONExtractString(object_story_spec,'video_data','call_to_action','value','link'),''), '(none in creative)') AS destination, coalesce(url_tags,''), count() FROM metaads_ad_creatives GROUP BY 1,2`.

## What this page could not verify

- **Google Search Console** (indexed URLs, landing pages from Google search) was not reachable from
  this session; Phase 1's Search & AI Visibility agent owns it.
- **Landing URLs before 2026-09-19** (site live since 2026-07-28, `CLAUDE.md:664`; ads ran from
  2026-09-02, query G) are not in PostHog. `metaads_ad_stats_by_link_url` holds one row with no URL;
  24 creatives have no resolvable destination. Handed to Phase 1 (PostHog Analyst, Search & AI
  Visibility), which can ask the founder for GA4 and Search Console exports.
- **Vercel domain settings** (how `www` and `http` redirect) are the founder's dashboard; inferred
  from response headers only.
- **Razorpay webhook subscriptions beyond `order.paid` and `payment.captured`**: whether
  `refund.processed` and `payment.failed` are subscribed ([C4](../open-questions.md)). The host
  itself is recorded (section 3).
- Not exercised by design: POST API routes, `/thanks` with a real token, `/e/<tier>` with a real
  signature.
- The crawler parses server HTML; client-injected links are not covered.
- The source of the automated `/privacy` visits and of the 219 click-id-only sessions is unknown.
