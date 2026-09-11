# SEO / AEO / GEO round — 2026-09-11

**Status: MEASURED, NOTHING CHANGED YET.** This file is commit 0 of the round: the baseline, taken
before any code moved, so the 2026-10-03 re-measure has something honest to compare against. It is
appended on every commit that follows.

Previous round: `docs/checkpoints/seo-aeo-geo-2026-09-05.md` (shipped and verified six days ago).
Its laws are §8.35. Nothing below contradicts it; this is what happened next.

---

## 1. Search Console access, and a correction to record honestly

**First reading, which was wrong.** Search Console for `kheelona.com` could not be opened from any
of the four Google accounts signed into this Chrome profile, and on `connect@kheelona.com` the
property sat under a **"Not verified"** heading. `dig TXT kheelona.com` returned only the Facebook
verification and SPF records, with no `google-site-verification=` TXT and no verification `<meta>`
tag on the homepage. From that I concluded the domain property's verification had lapsed.

**That conclusion was wrong, and the reasoning was incomplete.** The founder granted access and the
property opened immediately, fully populated with three months of history. Verification was never
lost. The error: Google verifies a *domain* property by DNS TXT **or by a CNAME at a random
hostname** — and a random hostname is by definition not something `dig` can be pointed at. Absence of
a TXT record is therefore not evidence of anything. The rule worth keeping: **an account lacking
permission and a property lacking verification look identical from outside, and only one of them is
visible to DNS.** Ask before concluding.

**What was real, and remains open:**

- **Ahrefs' Google link is broken.** Its GSC Insights tab reads *"The linked Google Account doesn't
  allow access to the required data"* and its Search Console data **stops on 20 August 2026**. This
  is a separate OAuth connection from the founder's own login and needs re-authorising in Ahrefs.
- **Ahrefs Brand Radar AI visibility is paywalled** on the current (Basic) plan — AI Share of Voice,
  AI responses and Cited pages all read "Upgrade to unlock". The `AI responses: 2` figure recorded on
  2026-09-05 **cannot be re-read on this plan** and should not be carried as a trackable metric until
  that is resolved. The 2026-10-03 re-measure needs a replacement instrument for it; the Perplexity
  prompts in section 4 are that replacement, and they cost nothing.
- **Google Search Console has no "AI Mode" search type for this property.** The Search type filter
  offers only Web, Image, Video and News, and Search Appearance has two unlabelled rows
  (5 clicks / 186 impressions / position 7.2, and 1 / 34 / 7.2). The "168 generative-AI impressions"
  baseline in the 2026-09-05 record **cannot be reproduced from this interface today**. Treat it as
  unverifiable rather than as a number to beat.


---

## 2. Ahrefs, 2026-09-11 (own crawl, not Google-dependent)

| Metric | Value | Note |
|---|---|---|
| Domain Rating | **0** | unchanged from 2026-09-05 |
| Referring domains | **328** (−82 in 30d) | high for DR 0; quality unaudited |
| Organic traffic | **0** | |
| Organic keywords | **0** | |
| Health score | 99 (−1) | 114 crawled, 3 redirects, 0 broken, 4 blocked |

Ahrefs' stored GSC figures, window 27 Jul – **20 Aug** (stale, see above): 53 clicks,
635 impressions, CTR 8.3%, average position 6.6, 32.1% anonymised queries.

---

## 3. Indexing — and a second correction, because `site:` lied

**What I first reported, from `site:kheelona.com/stories`:** 10 results, therefore only 9 of the 19
journal articles were indexed, therefore five of the six articles expanded on 2026-09-05 were
invisible to Google.

**That was wrong.** URL Inspection on the flagship of those five,
`/stories/what-to-look-for-in-a-safe-ai-toy`, returns **"URL is on Google · Page is indexed."**
Search Console reports **37 indexed pages against a 31-URL sitemap**. Coverage is essentially
complete.

**The law worth keeping: `site:` is not an indexing report.** It is a heavily truncated,
personalised, non-exhaustive convenience query, and on a small site it undercounts badly enough to
invent a crisis. When Search Console is available it is the only source; when it is not, the honest
statement is "unknown", not a `site:` count. This is the second wrong conclusion of the session and
both came from the same habit — treating a proxy as the measurement.

**The true finding is sharper, and worse.** From the Performance report, the complete list of pages
that earned **any** impression in three months:

| Page | Clicks | Impressions |
|---|---|---|
| `kheelona.com/` | 178 | **1,986** |
| `www.kheelona.com/product/bd99df2b-2e51-5698-8126-42fc63f959c1` (legacy Wix) | 5 | 314 |
| `/contact` | 3 | 183 |
| `/shipping` | 2 | 100 |
| `/stories/screen-time-rules-parents-swear-by` | 2 | 56 |
| `/stories/raising-a-bilingual-child-in-india` | 1 | 99 |
| `/products/lumi` | 1 | 40 |
| `checkout.kheelona.com/` | 1 | 24 |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` | 1 | 15 |
| `checkout.kheelona.com/product-page/lumi-green` | 1 | 7 |

That is the whole list; the clicks sum to the reported 192.

**So: 16 of the 19 journal articles are indexed and have earned zero impressions in three months.**
The homepage absorbs **87% of all impressions** (1,986 of 2,280), and it earns them for the wrong
product's name.

**Indexing is not the bottleneck. It is solved.** The bottleneck is that the pages answer questions
nobody is asking Google in India, from a domain with no authority to rank for the ones they are.
Any plan built on "get them indexed" is a plan aimed at a problem that no longer exists — including
the instinct to submit them all for indexing, which for 16 already-indexed pages is a no-op.

Two things here *are* worth acting on:

1. **`/products/kheelu` sits in "Crawled – currently not indexed"** while the old `/products/lumi`
   still holds the index entry and 40 impressions. Six days after a rename this is within the normal
   consolidation window, so it is a watch item, not yet a defect — but it is the one URL where
   Request Indexing is genuinely worth a click.
2. **Legacy Wix URLs are still earning impressions**: `www.kheelona.com/product/bd99df2b-…` is the
   site's **second-biggest page by impressions (314)**, and `checkout.kheelona.com` two more. The
   first redirects correctly to `/products/kheelu` (verified, 308 → 200), so that traffic is being
   passed on. The `checkout.` host has no DNS record at all and simply fails — nothing in this repo
   can redirect a hostname that does not resolve.


---

## 3b. Search Console, authoritative (3 months to 08 Sept 2026, read 2026-09-11)

**Performance:** 192 clicks · 2.28k impressions · CTR 8.4% · average position 6.1 · **44 queries in
total**. (2026-09-05 baseline: 174 clicks / 2.25k impressions.)

**Page indexing: 37 indexed, 29 not indexed across 7 reasons.**

| Reason | Pages | Reading |
|---|---|---|
| Not found (404) | 9 | **all stale — see below** |
| Page with redirect | 4 | expected |
| Alternative page with proper canonical tag | 3 | expected: `www/contact`, and two `?q={search_term_string}` URLs left over from the Wix era, correctly canonicalised |
| Excluded by `noindex` tag | 1 | the store, by design (§8.25-aa) |
| Duplicate without user-selected canonical | 1 | |
| **Crawled – currently not indexed** | **8** | Google fetched and declined |
| **Discovered – currently not indexed** | **3** | **down from 10** — the founder's indexing requests worked |

**The nine 404s were all tested against the live site, and eight of nine already redirect correctly**
(308 → 200): `/product-page/lumi-pink` and `/product-page/lumi-blue` → `/products/kheelu`,
`/terms-conditions` → `/terms`, `/accessibility-statement` → `/products/kheelu`, and four
`/post/...` Wix articles → `/stories`. Every one was last crawled between 16 March and 7 June, i.e.
**before** the 2026-09-05 redirects shipped. They are stale report entries and will clear on recrawl.
No code change is warranted, and this was checked rather than assumed.

The ninth is **`https://checkout.kheelona.com/`** (crawled 21 Aug), which has **no DNS record at
all** — `dig` returns nothing, so it does not even answer. A leftover Wix checkout subdomain. Nothing
in this repo can fix or redirect a hostname that does not resolve; it ages out of the index on its
own. Recorded so nobody spends an hour looking for a redirect rule to add.

**"Crawled – currently not indexed" (8), all last crawled 5 Sept 2026** — this is the bucket that
matters, because Google fetched these and chose not to index them:

`/stories/busy-hands-no-screens` · `/stories/how-to-get-your-child-talking` ·
`/stories/screen-time-and-tantrums` · `/stories/what-actually-builds-a-sharp-brain` · `/terms` ·
`/privacy` · **`/products/kheelu`** · `https://api.kheelona.com/`

**`/products/kheelu` is the page the whole site exists to sell from, and Google has crawled it and
not indexed it.** Google still lists the old `/products/lumi`. Six days after a rename that is within
the normal consolidation window, so it is not yet a defect — but it is the single most important URL
to watch, and if it has not flipped by the 2026-10-03 re-measure it is an emergency, not a footnote.

The four story URLs in this bucket appear as *indexed* in today's live `site:` query, so the Pages
report lags the index by several days. Where the two disagree, the `site:` result is the more recent.

### The query list is the finding

All 44 queries, read in full. Outside the brand name, **the site ranks for almost nothing Indian**:

| Cluster | Impressions (approx) | Reading |
|---|---|---|
| `kheelona` + misspellings (keelona, khilona, khelona, kholona, sheelona, khilana, khelna) | ~215 | navigation by people who already know us |
| **the "Lumi" cluster** — `ai lumi toy` (494), `lumi toy` (101), `lumi ai toy` (160), `lumi pink` (94), `ai lumi toys` (62), `lumitoy` (49), plus ~15 more | **~1,050** | **mistaken identity, see below** |
| `36912`, `36912 rule`, `what is the 3 6 9 12 rule for screen time?` | 9 | **the one real content signal** |
| `ai toys`, `ai educational toys`, `toy store near me` | 3 | category, negligible |

**The Lumi cluster is largely not our audience and largely not in India.** The tell is the language:
`lumi jucarie ai`, `jucarie lumi ai`, `lumi pink jucarie`, `ai lumi jucarie`, `pareri`,
`care este prețul real` are **Romanian** ("jucarie" = toy, "pareri" = reviews, "care este prețul
real" = what is the real price); `onde encontrar esta imagem` is Portuguese. Together with
`lumi pink` / `lumi blue` / `lumi green` / `lumi doll` / `toyvana lumi`, this is a **different
product's audience** finding us by name collision. CTR across the cluster is 0.8% to 3%.

Two consequences, and they point the same way:

1. **Netting out the name collision and the brand term, Indian category visibility is effectively
   zero.** That is a harder number than "under 100 organic visitors a month", and it is the honest
   starting point. It also means the 2026-09-05 rename costs us nothing real — the Lumi impressions
   will decay, and they were never going to convert.
2. **`36912` sits at average position 1.0.** A question-shaped query, answered by
   `screen-time-rules-parents-swear-by`, already ranking first on one variant with no authority
   behind it. That is what winning an answer-shaped query looks like on a DR 0 domain, and it is the
   template the rest of the round should copy.

---

## 4. GEO, measured on Perplexity (2026-09-11, free tier, India-flavoured prompts)

### 4a. Category prompt — "best AI toy for a 4 year old in India"

**Kheelona does not appear.** The answer recommends, in order:

| Rank | Product | Price | Age | Notes given |
|---|---|---|---|---|
| 1 | **YUMI AI Plushie** (`yumiai`) | ₹8,999 (from ₹14,999) | 4+ | 9 Indian languages, screen-free, 7-day battery, "designed and built in India" |
| 2 | **Pookie by Scoobies** (`scoobies`) | ₹6,999 | 3+ | emotion-aware, parent controls, encrypted chats |
| 3 | Miko Mini / Miko 3 | ₹13,999 | 5+ | STEM robot |
| — | AIVY (`aivytoys`) | ₹10,999 | — | "India's Own AI Plush Companion" |
| — | Mirana Moonwalker | ₹349 | 2+ | Amazon listing |

The 11 cited sources: `bestreviewsonline.in` (a "10 Best AI Robots For Kids in India" roundup),
`keyirobot` (another 2026 roundup), the brands' **own sites** (yumiai ×2, scoobies, miko, in.miko,
aivytoys), `amazon.in`, `flipkart`, and `economictimes`.

Three readings, all of which point the same way:

1. **Brand-owned pages do get cited here.** Four of the eleven citations are a vendor's own site. So
   a page on kheelona.com is eligible to *be* the answer; it is not gated on press.
2. **Every cited competitor snippet is spec-dense** — a price, an age, a language count, a battery
   life, in the meta description. That is the shape a model lifts into a comparison table.
3. **The answer set turned over completely in six days.** On 2026-09-05 this round's predecessor
   recorded Perplexity naming MyWonder, ScoobiesAI and Kanha. Today it names YUMI, Pookie, AIVY and
   Miko. A category answer that unstable is a category answer that can be entered.

### 4b. Brand prompt — "What is Kheelona and what is the Kheelu AI toy?"

The entity **is** known. The answer is also **wrong in five ways that cost money**:

| What Perplexity says | The truth | Where it got it |
|---|---|---|
| "flagship product … called **Lumi**" | renamed **Kheelu** on 2026-09-05 | play.google, and the rest |
| "roughly ages **2–8**" | **3+**; "2 to 8" is a dead range guarded in `seo.test` | play.google / f6s |
| "talking **robot** companion" | a **plush** toy | LinkedIn "India's First Robotic brand" |
| "currently in a **limited beta** launch phase" | live, taking **paid pre-orders** | a "Privacy Policy (Beta)" page |
| founded "by Aman and Apoorva Sahu" | three co-founders; **Kashyap C.R** missing | ynos, f6s |

**Only 3 of the 10 citations are kheelona.com** (Home, /stories, and a privacy policy). The other
seven are third-party profiles — `play.google`, `ynos`, `f6s`, `linkedin` ×2, `internshala`,
`institute.commonsensemedia` — and every one of them is stale.

**The site is right. The web around the site is wrong, and the model believes the web.**

### 4c. The Play Store listing, read directly

`play.google.com/store/apps/details?id=com.kheelona.toyapp`, last updated 19 July 2026:

- The word **"Lumi" appears 7 times. "Kheelu" appears 0 times.**
- The description is literally **"App to Manage Lumi toy"**, and it is carried in `og:description`,
  `twitter:description`, `itemprop="description"` **and a `SoftwareApplication` JSON-LD block**. That
  is a machine-readable statement, from a Google-owned domain, that Kheelona's product is called Lumi.
- It publishes **+91 98965 97969**. The site publishes WhatsApp-only **+91 91875 46483**
  (`SUPPORT_WHATSAPP_DISPLAY`). Two different numbers for one company.
- Its privacy link points at `https://www.kheelona.com/privacy` — the `www` host, which 308s to the
  apex. One wasted hop on the single most trust-bearing outbound link Google holds about us.
- Correct on the listing: developer "Kheelona.com", "KHEELONA ROBOTICS PRIVATE LIMITED",
  Jayanagar Bengaluru 560041, "Rated for 3+".

### 4d. An unlocated "Beta" privacy policy

Perplexity cites **"Kheelona Robotics Privacy Policy (Beta)"**, quoting *"In this beta, you'll need
to email us for such requests"*, `legals@kheelona.com`, and a named **Grievance Officer**.

None of that is on the live page: `kheelona.com/privacy` contains no "beta", no "legals@", no
"Grievance Officer", and uses `hello@kheelona.com` eleven times. Checked and **not found** at
`kheelona.ai/privacy`, `kheelona.ai/privacy-policy`, `www.kheelona.com/privacy`,
`app.kheelona.com/privacy`. Location unknown; it is the source of the "limited beta" claim.

---

## 4e. Keyword Planner, India, Sept 2025 – Aug 2026 (read 2026-09-11)

Twenty candidate terms, all in the India location, all languages. The full result:

| Term | Avg. monthly searches (India) | Competition |
|---|---|---|
| **educational toys for 3 year olds** | **1k – 10k** | High (₹1.12–₹7.45) |
| **learning toys for 3 year olds** | **1k – 10k** | High (₹1.12–₹7.45) |
| **toys that talk back** | **100 – 1k** | High (₹1.23–₹8.61) |
| ai plush toy | 10 – 100 | High |
| are ai toys safe | 10 – 100, **three-month change +∞** | Low |
| ai toy for kids · ai toys for kids india · best ai toy for kids · ai toy india · ai learning toy · talking toy for kids · smart toys for kids · storytelling toy for kids · interactive toy for kids · screen free toys for toddlers · screen free activities for kids · screen time for kids · how much screen time for a 3 year old · best toys for 3 year olds india · toys for bilingual kids | **no data** (below 10) | — |

**This confirms the 2026-09-05 conclusion and corrects the part of it that was too pessimistic.**
That round wrote "no volume for the category in India" and stopped there. True of the AI-toy phrasings
— every single one returns no data. But three terms carry real Indian demand and were not tested:

1. **"educational toys for 3 year olds" and "learning toys for 3 year olds", 1k–10k each.** This is
   where Indian parents actually search for this product. `/products/kheelu` already carries "AI
   educational toy" in its meta description and a FAQ answer about learning toys for 3-year-olds,
   which was the right instinct; nothing else on the site reaches for it.
2. **"toys that talk back", 100–1k.** The plain-English description of exactly what Kheelu is, at
   meaningful volume. The site already has `a-toy-that-talks-vs-a-toy-that-listens`, which earns
   15 impressions — the topic is right and the page is not reaching the query.
3. **"are ai toys safe", small but with a three-month change of +∞** — it went from nothing to
   something inside the window, and competition is Low. `/safety` is literally titled
   "Are AI toys safe? How Kheelu is built to be". This is the cheapest win on the board.

**The strategic reading, and it is the whole basis of this round.** Nobody in India is typing "best
AI toy for a 4 year old" into Google — that term has no measurable volume. People *are* asking
Perplexity and ChatGPT exactly that, as section 4a shows, and getting a five-product answer that does
not include us. **The category's demand currently lives in answer engines, not in Google's query
stream.** That is not a reason to do less SEO; it is the reason AEO and GEO come first, and it is
now measured rather than asserted.

Search demand and answer-engine demand are therefore targeted separately:
- **Google** gets the terms that have volume: learning/educational toys for 3-year-olds, toys that
  talk back, are ai toys safe.
- **Answer engines** get the question they are actually being asked: how to choose an AI toy for a
  small child in India.

---

## 5. Production health at the time of measurement

`/api/health` → `{"ok":true,"store":"ready","preorder":"token","razorpay":"live","email":"configured","capi":"configured"}`.
Offer mode is still **token**, so the first 500 units have not sold out and no copy sweep is due.
All twelve marketing routes, `llms.txt`, `pricing.md`, `sitemap.xml` and `robots.txt` answer 200.

---

## 6. Running record

*(appended per commit from here)*

- **commit 0 — `80fb405`.** Baseline only, no site change. Two wrong conclusions recorded rather
  than quietly fixed: "Search Console verification lapsed" (it had not; domain properties verify by
  CNAME too, so `dig TXT` proves nothing) and "9 of 19 articles indexed" (`site:` undercounts; URL
  Inspection and GSC both say indexed). §8.36-f.
- **commit 1 — `7a38300`.** `Product.alternateName: "Lumi"`, `isFamilyFriendly`, and the published
  specification as `additionalProperty`, from the new one-source `src/lib/product-facts.ts` which
  also feeds the new `SpecTable` molecule. Three specs deliberately absent (battery, warranty,
  manufacturing origin) with tests that fail if a number ever appears in them. §8.36-a/b.
- **commit 2 — `2a7a96d`.** `/ai-toys-for-kids-in-india`, the buyer's guide: five numbered checks,
  the spec table, the category comparison, what Kheelu cannot claim yet, 7 FAQs. Plus the "Is Kheelu
  the same as Lumi?" FAQ on the product page and the "facts commonly wrong elsewhere" section in
  `llms.txt`. **The gate earned its keep here**: `CompareTable` had never been rendered on any route,
  and its first placement on a cool room failed four contrast nodes that `test/contrast-tokens.test.ts`
  had banned all along. Moved to cream. §8.36-c.
- **commit 3 — `0eb985a`.** Three articles, one per channel, chosen from Keyword Planner and the
  Perplexity measurements rather than instinct: `learning-toys-for-a-three-year-old` (SEO, the only
  terms with real Indian volume), `questions-parents-ask-about-ai-toys` (AEO, twelve self-contained
  answers, zero question overlap with the guide), `ai-toys-and-indias-data-law` (GEO, definitional
  and jurisdictional). Every citation already verified in this repo. §8.36-e.
- **commit 4 — this one.** The laws (§8.36), the developer handoff, the founder drafts that nothing
  sends, and the queue and state files.

---

## 7. Production verification (2026-09-11, after deploy)

Deployed from `b5c795c`, live ~60 seconds after the push. Every acceptance check in the handoff was
**run**, not asserted. One of my own numbers was wrong and was corrected before shipping: the guide
emits 9 `Question` nodes, not the 10 I first wrote (7 FAQs + 2 answer blocks, because the shared
question moved into `ANSWERS`).

| Check | Expected | Actual |
|---|---|---|
| `/ai-toys-for-kids-in-india` | 200 | **200** |
| `Product.alternateName` | `"Lumi"` | **present** |
| `PropertyValue` nodes on `/products/kheelu` | 14 | **14** |
| `llms.txt` corrections | 6 bullets, dated 2026-09-11 | **6, dated** |
| `Question` nodes on the guide | 9 | **9** |
| Three new articles | 200 each | **200, 200, 200** |
| `sitemap.xml` | 35 URLs | **35** |

**Google Rich Results Test on `/products/kheelu`: 4 valid items, ZERO errors** — Product snippets,
Merchant listings, Breadcrumbs, Organization. The non-critical warnings on the two Product items are
the standard missing-`review`/`sku`/`gtin` set, which this product deliberately does not have.
FAQPage is not reported because Google retired FAQ rich results for most sites; the markup is still
read by answer engines, which is who it was for.

**Lighthouse, production, desktop, on the new route:** performance **91**, accessibility **96**,
SEO **100**, best-practices **74**. All three gates cleared, and 74 is exactly the sanctioned §8.34-h
figure — the whole gap is the Meta Pixel's third-party cookie, and no configuration passes it while
the pixel runs.

**`qa:sweep`: clean on axe and voice, 18 routes, both widths.** `npm test`: 1176 pass.

### Indexing requested, five URLs, all confirmed

Not the sixteen that were already indexed — submitting those is a no-op, and saying so is the point
of section 3. Each returned **"Indexing requested. URL was added to a priority crawl queue."**

`/ai-toys-for-kids-in-india` · `/products/kheelu` · `/stories/ai-toys-and-indias-data-law` ·
`/stories/questions-parents-ask-about-ai-toys` · `/stories/learning-toys-for-a-three-year-old`

**A good correction while doing it: `/products/kheelu` now reads "URL is on Google · Page is
indexed".** The Pages report had it in "Crawled – currently not indexed", which was already stale by
the time it was read. The rename has consolidated. It was still worth the request, because the page
changed materially today.

### One thing found and deliberately not fixed

`npm audit` reads **2 moderate** on the site manifest, both in `@vitest/mocker` / `vitest`
(GHSA-82fw-gwwq-j7x9, path traversal in the test mocker). `launch-video` still reads 0.

**Dev-only — vitest never reaches a production build** — and the fix is a patch inside the pinned
major, `4.1.10 → 4.1.11`. It was left alone anyway. This repo's dependency laws exist because a
careless install once moved 23 packages including `@supabase/supabase-js` on the payment path, and
folding a dependency change into an SEO round is how that discipline erodes. It is queued in
`Technical-Todo.md` with the exact command, as a two-minute job with its own verification.

### Ahrefs' Google link, fixed the same evening

The founder re-linked it after the diagnosis, and it was verified rather than assumed:

- Dashboard → GSC Insights: the **red banner is gone** (it had read "The linked Google Account
  doesn't allow access to the required data" on every load since 20 August).
- Settings → Ownership verification → Google Search Console: **"Website verified via Google Search
  Console."**, `connect@kheelona.com`, **no error text**. The same panel twenty minutes earlier read
  "Website not found. Your website needs to be verified in the Google Search Console of a Google
  Account that's connected with your workspace."

Data has not backfilled yet — the chart still ends 20 August — because Ahrefs refetches on its own
schedule rather than on reconnect. The connection was the broken thing and it is fixed.

**The law (§8.36-d, extended): ownership verification and the data integration are two different
things sharing one Google account, and the first going green is not evidence about the second.**
The founder's first fix was ownership verification, which showed a clean green banner while the data
pull stayed broken. Only opening the integration's own "Show details" gave the real error, and it
named a different failure entirely.

### The "Beta" privacy policy, found — and it was our 404, not a page to take down

Section 4d recorded this as unlocated. It is now located, and the diagnosis was wrong in an
instructive way.

**The citation URL is `https://www.kheelona.com/privacy-policy`.** Read straight out of the
Perplexity thread's own links in one query, after five rounds of path-guessing
(`/privacy`, `kheelona.ai/privacy`, `kheelona.ai/privacy-policy`, `www.kheelona.com/privacy`,
`app.kheelona.com/privacy`) had all missed it. **Ask the source what it cited before guessing where
it lives.**

**The document is gone and was never ours.** `git log --all -S` finds that wording in no commit on
any branch, and it is absent from the `pre-revamp-2026-07` tag, so it belonged to the Wix site that
predates this repo entirely. There was nothing for the founder to take down.

**What was actually broken was in this repo.** `/privacy-policy` had no redirect and answered 404,
while its sibling `/terms-conditions` received one in the 2026-09-05 round. The pair was split and
nobody noticed.

**§8.36-g, the law this produces: a 404 does not correct a stale index.** It leaves the crawler
holding the last thing it saw, indefinitely. A retired URL that an answer engine still cites needs a
**301/308 to the page that supersedes it**, not silence. The cost here was an AI telling parents that
a company taking real payments since 2026-08-22 is "currently in a limited beta launch phase".

Fixed in `next.config.ts` with a 308 to `/privacy`, pinned by a test in
`test/redirects-vs-assets.test.ts` that treats the two legacy legal URLs as a pair. 1179 tests pass.

