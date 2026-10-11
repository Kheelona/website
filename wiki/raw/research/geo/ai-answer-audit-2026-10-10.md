---
title: AI answer audit (raw capture, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - "Bing web search, cc=IN, en-IN, logged out, headless Chrome via tools/qa/lib/resolve.mjs: engine-captures-2026-10-10/render-engines.json (02:12 UTC), bing-brand.json (02:14-02:16 UTC), bing-prompts.json (02:20-02:22 UTC), bing-category.json (02:34-02:35 UTC), all 2026-10-11 UTC = 2026-10-10 evening PDT"
  - "WebSearch tool (Claude's web search, US index, provider not disclosed), queries quoted below, 2026-10-11 02:00-02:40 UTC"
  - "Perplexity, DuckDuckGo, Google, Brave: headless Chrome attempts, render-engines.json and scratch logs, 2026-10-11 02:12-02:25 UTC"
  - "PostHog project 617632 (US cloud), query-web-stats, date range 2026-09-19 to 2026-10-10, run 2026-10-11 ~02:45 UTC"
  - "Legacy baseline: git show archive/pre-reset-2026-10-10:docs/checkpoints/seo-aeo-geo-2026-09-11.md section 4"
---

# AI answer audit (raw capture, 2026-10-10)

What answer engines and search say about Kheelona and Kheelu today, which engine, when, and what
could not be tested. Every timestamp is UTC on 2026-10-11 (evening of 2026-10-10 in California).
Off-site sources these answers draw on are in [entity-consistency-2026-10-10.md](entity-consistency-2026-10-10.md).

## Summary

| Engine | Tested? | Knows the brand? | Wrong facts seen |
|---|---|---|---|
| Bing web search, AI summary (India) | Yes, once with a summary | Yes, "Kheelu ... by Kheelona, ages 3 and up" | Price "₹499", "lifetime subscription to Kheelona+", "adapting to learning pace" |
| Bing web search, results (India) | Yes, 17 queries | "Kheelona" yes; "Kheelu" alone no | Brand rewritten to "Khilona"; a "Kheelona India" toy seller and a 1970 film share the name |
| WebSearch tool (US index) | Yes, 11 queries | Partly | Stale `www.kheelona.com` snapshot: Lumi at "INR 2,999 (from Rs 5999)", pink/green/blue; "blue dinosaur plush" from kheelona.ai |
| Perplexity | **No**: logged-out answer asks to sign up | n/a | Last measured 2026-09-11 (below) |
| Google Search and AI Overviews | **No**: 429 "unusual traffic" | n/a | n/a |
| Bing Copilot Search | **No**: rendered no answer in 15 s or 45 s | n/a | n/a |
| ChatGPT, Gemini, Claude.ai, Meta AI, Copilot app | **No**: need a login (C11 territory) | n/a | n/a |
| DuckDuckGo, Brave Search | **No**: captcha / timeout; 429 | n/a | n/a |

**Category questions:** Kheelona appeared in **none** of the category answers we could run ("best
AI toy for a 4 year old in India" on Bing and WebSearch; "screen-free AI plush toy India ... Hindi"
on WebSearch). Engines name Amazon.in listings (Yumi Bear, FUNBUN, SIRO Smart Play Board, Miko 3),
AIVY (₹8,999), IFITech Buddy (₹9,990) and Pookie by Scoobies (₹6,999), per the WebSearch summaries
of 2026-10-11. Prices are as quoted by the engine, not checked here (Market Research owns them).

## 1. Bing (India market, logged out)

### 1a. AI summary, "What is Kheelu AI toy" (02:12 UTC, `render-engines.json`)

Verbatim:

> "Kheelu is an AI toy designed for children aged 3 and up, created by Kheelona. It interacts with
> children through conversation, stories, and games, adapting to their learning pace and language
> preferences. Kheelu listens and remembers, providing content that tracks a child's progress while
> ensuring safety and privacy by not connecting to the open internet. It includes features like
> memory technology, age-graded responses, and a parent app for monitoring. The toy is priced at
> ₹499 for the first 500 units, with a lifetime subscription to Kheelona+ that includes stories,
> lessons, and languages."

| Statement | Verdict | Truth (owner page) |
|---|---|---|
| "aged 3 and up", "created by Kheelona" | Right for the live site | Band moves to 3 to 7 on the new site ([facts](../../../product/facts.md#age)) |
| "priced at ₹499 for the first 500 units" | **Wrong** | ₹4,999 for the first 500; ₹499 is the refundable reservation ([pricing](../../../product/pricing.md)) |
| "a lifetime subscription to Kheelona+" | **Wrong** | 6 months of Kheelona+ included; Kheelu's smart features are lifetime; Kheelona+ price announced soon ([facts](../../../product/facts.md#kheelona)) |
| "adapting to their learning pace", "tracks a child's progress", "memory technology" | Unconfirmed claims | "Kheelu adapts" is NOT confirmed ([claims §3](../../../product/claims.md#3-not-confirmed-do-not-publish)); the wording matches the CB Insights profile word for word (entity file) |
| "not connecting to the open internet", "parent app" | Published, not re-confirmed | F8 |

**Why it is wrong, probably (inference):** the Home meta description reads "₹499 reserves one of
the first 500 units at ₹4,999", and the sanctioned Kheelona+ line puts "for life" and "Kheelona+"
in adjacent clauses. The engine fused both. Copy that states the price first and keeps "for life"
away from "Kheelona+" removes the trap. The same query re-run at 02:22 UTC showed **no** AI
summary, only results: summaries come and go per request.

### 1b. Results pages

- **"Kheelona" (02:14):** 1 kheelona.com, 2 kheelona.ai, 3 /products/kheelu, 4 khilonaghar.com
  (unrelated RC-toy shop), 5 kheelona.ai/team, 6 Instagram @kheelona ("🧠AI toys that develop
  brains ..."), 7 Wikipedia "Khilona (1970 film)", 8 LinkedIn company page, 9 App Store (US
  storefront), 10 YouTube "Khilona (1970) Full Movie". Also "Kheelona India (@kheelona_india)", a
  wooden-toy seller with 1,163 followers (ours has 116).
- **"What is Kheelona and what is the Kheelu AI toy?" (02:20):** kheelona.com (x5 pages),
  kheelona.ai (x2, one snippet about the Lori baby monitor's "HD IR camera"), **CB Insights**,
  Facebook, **YNOS** ("About KHEELONA ...").
- **Snippet risk:** Bing's snippet for `/products/kheelu` read "Kheelu reads, your child asks why,
  and Kheelu asks one back. **It works offline.**" (02:20). Lifted out of context, that is the
  blanket offline claim the per-mode rule forbids ([facts](../../../product/facts.md#modes-and-connectivity)).
- **"Kheelu" without "Kheelona" is not recognised.** "Kheelu toy price India" returned Duolingo,
  "Is Kheelu safe for kids" returned EPFO pages, "Kheelu AI toy age" returned Microsoft Copilot,
  "Kheelu Lumi same toy" returned Yahoo Mail (02:15-02:22). "Kheelona Lumi toy" was rewritten to
  "Including results for **Khilona** Lumi toy".
- **"best AI toy for a 4 year old in India" (02:21):** Amazon.in (x5), Flipkart, keyirobot.com,
  getskybuds.com and two roundups. Kheelona absent.
- **Unusable runs:** five category queries at 02:34-02:35 returned results matched to the first
  word only (OpenAI, dictionary pages): Bing degraded the session after ~15 queries. Kept in
  `bing-category.json` for honesty, not used as evidence.

## 2. WebSearch tool (Claude's web search, US index)

| Query (2026-10-11) | Kheelona-related results | What the engine's summary said |
|---|---|---|
| `Kheelona Kheelu` | none | "no results" for the pair |
| `Kheelona Lumi AI toy` | none | found other "Lumi" toys, incl. a Moldovan/Romanian talking toy |
| `Kheelona` (extended) | Play listing x2, Amazon.in "Kheelona India" cradle mobiles x2, two LinkedIn profiles, **github.com/Kheelona/website**, kheelona.ai, Tracxn | Correct product facts (Kheelu, renamed from Lumi, ₹499 token for one of the first 500 at ₹4,999), **taken from the public repo README** |
| `Kheelona Robotics Private Limited` | Play x2, Tracxn, LinkedIn, kheelona.ai | Bengaluru company; "products include Lumi and Lori" (from kheelona.ai nav) |
| `"kheelona.com" Lumi AI talking toy screen-free 10+ languages` | **`https://www.kheelona.com/` titled "Kheelona"**, kheelona.ai, Play | "the most intelligent AI-powered talking toy ... pre-order price of INR 2,999 (listed down from Rs 5999) and color options of pink, green, and blue"; kheelona.ai: "a soft blue dinosaur plush ... wearing a party hat" |
| `CNA Bengaluru Tech Week AI toy Kheelona Lumi` | LinkedIn, Play, kheelona.ai, www.kheelona.com | The CNA piece itself was not found; the same stale "Rs 2,999" snapshot |
| `best AI toy for a 4 year old in India` | none | Amazon.in listings, heycurio, aicloudraker, talkipal |
| `screen-free AI plush toy India talking toy ... Hindi` | none | AIVY, IFITech Buddy, Pookie |

Readings:
1. **This index holds a Wix-era snapshot of `www.kheelona.com`** (Lumi, ₹2,999, three colours).
   `www` has 308'd to the apex since 2026-07-28, so the fix on our side exists; the engine has not
   re-crawled. Nothing in this repo can force it.
2. **The public GitHub repo is a source answer engines read.** Its README states the offer
   correctly today, but the repo also exposes internal docs, and the wiki would join them if it
   were committed publicly ([Q1](../../../open-questions.md)). Its "website" field points at a dead
   Vercel deployment (entity file).
3. **kheelona.ai still describes Lumi as a blue dinosaur in a party hat** (its own image alt text,
   checked 2026-10-11), art the product left on 2026-08-25.

## 3. Engines that could not be tested

| Engine | What happened | Instrument for next time |
|---|---|---|
| Perplexity | `perplexity.ai/search?q=...` loaded, showed "Researched", then "Sign up and repeat your request." (02:12) | The founder runs the two legacy prompts in a private window (below) |
| Google Search + AI Overviews | 429 "Our systems have detected unusual traffic" (02:13) | Search Console (C11) has no AI Mode data for this property (legacy, 2026-09-11) |
| Bing Copilot Search | `bing.com/copilotsearch` rendered the query and nothing else after 15 s and 45 s (02:17, 02:19) | A real browser session |
| ChatGPT, Gemini, Claude.ai, Meta AI | Need a login; agents may not use the founder's browser | Founder, private window |
| DuckDuckGo | `html.duckduckgo.com` returned a duck-picking captcha; the JS page timed out | n/a |
| Brave Search | 429 | n/a |

**The two legacy prompts (unchanged since 2026-09-11, so results compare):**
1. `best AI toy for a 4 year old in India`: record products named, in order, and cited domains.
2. `What is Kheelona and what is the Kheelu AI toy?`: record name, age, plush or robot, beta or
   selling, founders, price.

**Last Perplexity measurement (2026-09-11, legacy checkpoint §4):** prompt 2 said "Lumi", "roughly
ages 2 to 8", "talking robot companion", "limited beta", two founders; 3 of 10 citations were
kheelona.com, the rest Play Store, YNOS, F6S, LinkedIn x2, Internshala, Common Sense. Prompt 1 named
YUMI, Pookie, Miko, AIVY, Mirana; Kheelona absent. **The 2026-10-03 re-measure was never run**
([memory summary](../../../legacy/memory-summary.md)); this audit replaces it only for Bing and the
WebSearch index.

**What changed since 2026-09-11, as far as reachable sources show:** the "limited beta" source
(`/privacy-policy`) now 308s; every other stale source is still stale (entity file), and three new
wrong statements appeared: price "₹499" (Bing AI), "lifetime subscription" (Bing AI), "₹2,999"
(stale www snapshot).

## 4. What AI assistants already send us (PostHog)

Read-only queries, project 617632, `WebStatsTableQuery`, `dateRange` 2026-09-19 (PostHog's first
day) to 2026-10-10, `filterTestAccounts` at the project default. Aggregates only.

**Query A** `{"kind":"WebStatsTableQuery","breakdownBy":"InitialReferringDomain","dateRange":{"date_from":"2026-09-19","date_to":"2026-10-10"},"limit":50}`

| First-touch referring domain | Visitors | Pageviews |
|---|---|---|
| `$direct` | 483 | 704 |
| l.facebook.com | 94 | 126 |
| www.google.com | 68 | 157 |
| **chatgpt.com** | **11** | **25** |
| www.bing.com | 4 | 5 |
| duckduckgo.com | 1 | 1 |
| perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com | 0 (absent) | 0 |

(22 rows, 774 visitors in total; the other rows are social, own hosts and local test hosts.)

**Query B** same, `"breakdownBy":"InitialUTMSource","limit":30`

| First-touch `utm_source` | Visitors | Pageviews |
|---|---|---|
| (none) | 487 | 773 |
| an | 100 | 135 |
| **chatgpt.com** | **77** | **134** |
| ig | 50 | 66 |
| th | 32 | 34 |
| fb | 16 | 17 |

**Query C** `"breakdownBy":"InitialPage","includeHost":true` with session filter
`$entry_utm_source = chatgpt.com`: `kheelona.com/` 63 visitors, `/products/kheelu` 14, `/refund` 1,
`/team` 1. (Same with `$entry_referring_domain = chatgpt.com`: `/` 10, `/refund` 1, `/team` 1.)

Readings:
- **ChatGPT is already the third-largest first-touch source: 77 of 762 visitors (10.1%) in three
  weeks**, behind untagged traffic (487) and Meta's `an` placement (100), and ahead of Instagram. Most arrive with no referrer
  (only 11 carry `chatgpt.com` as referrer), consistent with links opened from the ChatGPT app.
  That ChatGPT appends `utm_source=chatgpt.com` to its links is an inference from the tag, not
  verified here.
- **Every ChatGPT landing is a brand page** (Home, product, refund, team); **no journal article
  received one.** People ask ChatGPT about Kheelona by name (probably after an ad) and ChatGPT links
  the brand pages. The category answers that would bring new parents do not cite us (section 2).
- Search-engine referrals are small: Google 68, Bing 4, DuckDuckGo 1 visitors.
- Hand-off to the PostHog Analyst: do these sessions start checkout or pay? Not queried here.
