# SEO / AEO / GEO round — 2026-09-05

**Status: OPEN.** Rollback tag **`pre-seo-round-2026-09-05`** = `5e7d2a1`. Plan approved by the founder
2026-09-05 (auto mode; a push to `main` auto-deploys). Developer handoff: `docs/seo/handoff-2026-09-05.md`.
Human-facing drafts (never sent by an agent): `docs/seo/outreach-drafts-2026-09-05.md`. Laws: **§8.35**.

**This file is a LIVING RECORD (founder directive 2026-09-05): every commit in the round appends a
line to the Running record below, in the same commit. If the session context is compressed, this file
plus `Technical-Todo.md` is enough to resume.**

## Why this round

kheelona.com is two months old, indexed, and taking paid pre-orders. The founder asked for a CMO-grade
pass over on-page SEO, technical SEO, content SEO, AEO and GEO with a 3 to 4 week horizon. The
plumbing was already good (all AI crawlers allowed, `llms.txt`, `pricing.md`, FAQPage on four routes,
BlogPosting, HowTo, breadcrumbs, one Organization per page, Ahrefs Health 100). The round is three
things: get the unindexed pages indexed, make the journal citable, give the entity corroboration.

## Baseline, measured 2026-09-05 (re-measure on 2026-10-03)

| Source | Baseline |
|---|---|
| GSC Performance, 3 months to 3 Sep | 174 clicks · 2.25k impressions · CTR 7.7% · position 6.2. 105 clicks on "kheelona". 700+ impressions on "lumi ai toy" variants (an unrelated product; fading after the rename). Non-brand: "36912 rule"/"3 6 9 12 rule" pos 1 to 10, "ai toys" pos 2, "ai educational toys" pos 12. |
| GSC Generative AI features, 3 months | **168 impressions**, 152 on `/`. |
| GSC Indexing (last update 28 Aug) | **37 indexed, 29 not.** 10 "Discovered, currently not indexed" since 29 Jun, never crawled: `/safety`, `/playos`, `/team`, `/privacy`, `/terms`, `/products/lumi`, `/stories/busy-hands-no-screens`, `/stories/how-to-get-your-child-talking`, `/stories/screen-time-and-tantrums`, `/stories/what-actually-builds-a-sharp-brain`. 10 legacy Wix 404s (`www./post/*` ×4, `/terms-conditions`, `/for-the-parents`, `/product-page/lumi-pink`, `/product-page/lumi-blue`, `/accessibility-statement`, `checkout.kheelona.com/`). 2 "Crawled, not indexed": `api.kheelona.com/`, an old `favicon.ico`. 3 redirects, 3 alternate-canonical, 1 noindex (store). |
| GSC Links | 99 external, 87 from google.com (the Play Store listing). Real referring domains: chrome-stats.com, kheelona.ai, addurl.in, dealroom.co. Internal links known to Google: 58. |
| GSC Sitemaps | `sitemap.xml` Success, 31 discovered, submitted and read 5 Sep. |
| Ahrefs Site Explorer | DR 0 · UR 0 · backlinks 402 (817 all time) · ref. domains 315 (469), 92% nofollow, spam profile (no action). Organic keywords 0, traffic 0. **AI responses 2 / 1 page: Google AI Mode 1, ChatGPT 0, Gemini 0, Perplexity 0, Copilot 0.** Crawled 137: 29 OK, 77 3xx, 31 404. |
| Ahrefs Site Audit (5 Sep) | Health 100, 0 errors, 13 warnings, 55 notices. Only: meta description too short ×3, title too long ×2, http→https chain ×1 (platform), slow page ×1, IndexNow 31 (not used). |
| Keyword Planner, India, Aug 2025 to Jul 2026 | "brain development toys" 1k to 10k · "ai robot toy" 100 to 1k · "3 6 9 12 rule" 10 to 100 · "toys to reduce screen time" 10 to 100. 21 other seeds ("ai toy for kids", "screen free toys", "educational toys for 3 year old", "talking toy for kids", "kheelona"...) returned no data on this account. **No head-term volume to chase in four weeks.** |
| Perplexity, "What is the best screen-free AI toy for a 3 year old in India?" | MyWonder Wonder (₹4,999, Bengaluru), ScoobiesAI Kiki & Pookie, Kanha AI (CoRover), Haivivi BubblePal. **Kheelona absent.** Every citation third-party: yourstory, zeenews, scoobies.co, emilyreviews. |
| Perplexity, "Are AI toys safe for a 3 year old? What should an Indian parent check before buying one?" | Consensus: Common Sense Media and Fairplay say no AI companion toy under 5. Cites institute.commonsensemedia, bbc, respawn.outlookindia, techradar, sc-aitc. **`/safety` not cited (and not indexed).** |
| Production HTML (baseline saved to the session scratchpad, 31 pages) | BlogPosting: no `datePublished`, `dateModified` hardcoded `2026-07-01` on all 19; `timeRequired` PT4M to PT6M on 208 to 428-word bodies; `og:type` website. Paragraphs are plain strings (no links, no sources). `Organization.sameAs` = kheelona.ai only. Legal pages: no BreadcrumbList. `src/lib/stories.ts` "reserve a spot on the list. It is free" (false: the token is ₹499). |
| Off-site | `admin.kheelona.com` 200 "Kheelona Admin Dashboard", robots.txt explicitly allows Googlebot and Bingbot, no noindex. `api.kheelona.com` 200 JSON, no robots directive, crawled by Google. Play Store listing text "App to Manage Lumi toy". Official profiles confirmed by the founder: LinkedIn company, Instagram, Facebook, Play developer page, Android app, iOS app. |

Not available and how to get it: measured volumes (ad spend or Ahrefs plan); ChatGPT visibility (the
extension is denied on chatgpt.com); Google AI Overview spot checks (www.google.com not permitted);
Gemini (prompt could not be submitted through the extension). None change the plan.

## The three things that matter (the judgement)

1. Ten pages Google has never crawled, `/safety` and `/playos` among them. Not indexed = not citable.
2. The journal is too thin and undated to be cited. Six articles get 700 to 900 words, direct answers,
   real sources, honest dates and read times.
3. Kheelona is an unconfirmed entity: `sameAs`, Person `@id`s, and the off-site list for the founder.

Deliberately NOT done: head-term chasing, a competitor-naming comparison page, aggregateRating/review,
IndexNow, anything parked by the founder (CTA contrast, pixel, backlinks beyond drafts).

## Running record (append one line per commit)

- 2026-09-05 · commit 0 · round opened: rollback tag `pre-seo-round-2026-09-05` = `5e7d2a1`; production
  baseline (31 heads + JSON-LD, sitemap, llms.txt, pricing.md, robots) saved to the scratchpad; this
  checkpoint, the handoff skeleton, Technical-Todo items, CLAUDE.md banner, project-state. Next: commit 1
  (the false "it is free" line + banned-idea pattern).
- 2026-09-05 · commit 1 (C1) · `src/lib/stories.ts` "reserve a spot on the list. It is free, and it holds
  the launch price" → "pre-orders are open, and a refundable ₹499 holds your place" (via `TOKEN_PRICE`).
  New banned-idea pattern `/(reserv\w*|spot|place)[\s\S]{0,60}\b(is|it is|it's) free\b/i` in
  `test/preorder-copy.test.ts` AND `tools/qa/sweep.mjs` (§8.26-h: the two lists move together). Proven
  red first: the first draft used `[^.]` and MISSED, because the false claim crossed a full stop; the
  lesson is that a banned-idea pattern must be allowed to span a sentence boundary. Gates: suite green.
  Next: commit 2 (A2/A3 dates and read time).
- 2026-09-05 · commit 2 (A2, A3, A4) · `Story` gains `published`/`updated` (ISO, from `git log`: 14 pieces
  2026-07-28, 5 on 2026-07-30; `updated` 2026-09-05 where the rename touched the body, 2026-07-31 for the
  seven it did not); the hand-set `minutes` is DELETED and `readingMinutes()` derives it (200 wpm, floor
  1); `wordCount()`, `formatStoryDate()`, `latestUpdated()` in `lib/stories`. BlogPosting carries
  `datePublished`/`dateModified`/derived `timeRequired`; the byline reads "Published 28 July 2026 ·
  Updated 5 September 2026"; the /stories lede derives "Last updated"; `sitemap.ts` emits `lastModified`
  for the 19 stories only; `pageMeta()` takes an optional `article` and emits `og:type article` +
  `article:published_time/modified_time/author`; `JOURNAL_REVIEWED` deleted (not renamed). Tests: new
  `src/lib/stories.test.ts` (9), `seo.test` +1 → **1122 tests / 112 files**. Gates: tsc 0, suite green,
  build (see next line). Next: commit 3 (B1/B2/B3 entity graph).

