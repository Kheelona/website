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
- 2026-09-05 · commit 3 (B1, B2, B3) · `ORGANIZATION.sameAs` = LinkedIn company, Instagram, Facebook, Play
  developer page, kheelona.ai (founder-confirmed; the two app listings go to llms.txt, they identify the
  app). Founders carry `@id` `https://kheelona.com/team#<slug>`; Ria Mangala Rewari is
  `ORGANIZATION.employee` with her own `@id` and LinkedIn; `AUTHORS` + `authorRef()` in `lib/seo`, and
  every BlogPosting/Blog `author` is now an `@id` reference to the entity on the same page (throws for a
  name not on /team). `memberOf` NVIDIA Inception Program + nasscom startups; Karnataka Elevate and
  Founders Inc stay visible-only. Tests: seo.test +5. Lesson: `tsc --noEmit` exits 0 on a syntax error
  in `*.test.ts` (tests are outside its include), so a vitest transform error is the only parse check
  those files get. Next: commit 4 (A1 redirects, A5 breadcrumbs, B4 llms/pricing).
- 2026-09-05 · commit 4 (A1, A5, B4) · `next.config.ts`: `/post/:slug*` → `/stories`, `/terms-conditions` →
  `/terms`, `/for-the-parents` → `/stories` (308, one hop; from GSC's 404 report). BreadcrumbList on
  `/privacy`, `/terms`, `/refund`, `/shipping` (the only routes without one). `llms.txt`: "Key answers in
  the journal" (six articles, restating visible copy only), "Official profiles" (five sameAs URLs + the
  two app listings), `Last updated: 2026-09-05` via `LLMS_UPDATED`. `pricing.md`: `Last updated` was
  "July 2026" and wrong for a month; now `PRICING_UPDATED = 2026-08-23`, the day the unit-cap offer
  landed. New `test/machine-files.test.ts` (5): ISO dates, only real slugs linked, every `sameAs` URL
  present in llms.txt, no em-dash, content types. **1132 tests / 113 files.** tsc 0. Build: see next
  line. Next: commit 5 (C2 RichParagraph + SourcesList + `sources` + `citation`).
- 2026-09-05 · commit 5 (C2) · `molecules/RichParagraph` (parses `[label](url)`; root-relative via
  `next/link`, https via `<a target=_blank rel="noopener noreferrer">`; nothing else is markup; `mailto:`,
  `javascript:` and `//host` stay literal) and `molecules/SourcesList` (labelled `<section>`, `<h2>`
  Sources, ordered list, host shown), each with story + test. `Story.sources?` and BlogPosting
  `citation` (CreativeWork name+url) from the SAME array (§8.35-c). `wordCount` counts a link by its
  label. `SectionHeading` gains an `id` prop. `test/internal-links` now also checks every inline internal
  link is a sitemap page, every external link and source is https, labels are real, no duplicate
  sources. The RichParagraph test caught a real hole in the first regex: `//host` parsed as internal; root-relative now means exactly one leading slash. **1144 tests / 115 files**, tsc 0. Next: commit 6 (C3, six articles, one commit each).
- 2026-09-05 · commit 6a (C3, article 1 of 6) · `screen-time-rules-parents-swear-by` expanded 339 → 809 body
  words: a 56-word direct answer first, six question-shaped H2s, inline links to the WHO 2019 guideline,
  IAP 2022, AAP 2016 and Tisseron's site, a four-entry Sources list (rendered + `citation`), question-led
  160-char description, `updated: 2026-09-05`. QuillBot AI Detector (model v7.1.0) on the plain text:
  **0% AI-generated, 100% human-written**, so no humaniser pass was needed; recorded as a heuristic, not a
  gate. New voice guard in `src/lib/stories.test.ts` over every article's title/description/headings/
  paragraphs/source labels: no em-dash, no exclamation mark, no contraction, no raw URL (+4 tests → **1154 / 115**; the commit 5 tree re-measures at 1150 with the JSON reporter, so the 1144 written there was a mis-read, and `test/stories-parse` counting one test per `*.stories.tsx` file explains why molecule stories move the total).
  `tools/seo/replace-story.py` is the session's block-replacement helper. Next: 6b
  (`how-much-screen-time-for-a-3-to-6-year-old`).
- 2026-09-05 · commit 6b (C3, 2 of 6) · `how-much-screen-time-for-a-3-to-6-year-old` 315 → 712 body words:
  61-word direct answer (WHO, IAP, under-two none), age-by-age table in prose, "what the hour replaces" now
  backed by Romeo et al. 2018 (36 children aged 4 to 6, conversational turns not word volume, Broca's
  area), the AAP's content and bedtime guidance, a 6pm section; five sources incl. the IAP full-text PDF.
  QuillBot detector: **0% AI-generated**. Suite green, count unchanged (1154). Next: 6c
  (`what-to-look-for-in-a-safe-ai-toy`).
- 2026-09-05 · commit 6c (C3, 3 of 6) · `what-to-look-for-in-a-safe-ai-toy` 292 → 860 body words. Faces the
  consensus Perplexity repeats: Fairplay's 20 Nov 2025 advisory (150+ signatories, do not buy AI toys) and
  Common Sense Media's 22 Jan 2026 assessment (none for 5 and under, extreme caution 6 to 12, >25% of
  logged replies inappropriate, voice/transcript/behaviour data collected, attachment by design), then
  "we mostly agree" in the words the founder already licensed on /safety, then the five checks, with
  India's DPDP Act 2023 §9 (verifiable parental consent; no tracking, behavioural monitoring or targeted
  ads at children) under check four. Kheelu is measured against the list using only published
  mechanisms; the camera question stays open (Technical-Todo) and is asked generically. Five sources.
  QuillBot detector: **0% AI-generated**. Suite green. Next: 6d (`should-kids-use-ai`).
- 2026-09-05 · commit 6d (C3, 4 of 6) · `should-kids-use-ai` 341 → 846 body words. Keeps the founder's
  honest "no, not that AI" opening (60-word direct answer), grounds it in Common Sense Media (Jan 2026)
  and Fairplay (Nov 2025), turns the fear into five design choices, brings in the AAP co-viewing guidance
  and Harvard's serve-and-return as what children actually need, restates the five-question test, and
  measures Kheelu against it with published mechanisms only ("whether that is enough is your call"). Five
  sources. QuillBot detector: **0% AI-generated**. Suite green. Next: 6e
  (`raising-a-bilingual-child-in-india`, adds the `LANGUAGES_LINE` import to the expansion file).
- 2026-09-05 · commit 6e (C3, 5 of 6) · `raising-a-bilingual-child-in-india` 292 → 751 body words (the article
  that already ranks #1 in India). 57-word direct answer; Byers-Heinlein and Lew-Williams 2013 (no higher
  rate of delay or disorder, conceptual vocabulary matches, code-mixing normal, two-year-olds adjust to
  the listener) linked and quoted in substance; NEP 2020 para 4.11 via the PIB release (home language as
  medium until at least Grade 5, preferably 8); Harvard serve and return. The languages line renders from
  `LANGUAGES_LINE` (import added to `stories-expansion.ts`), never inline. Three sources. QuillBot
  detector: **0% AI-generated**. Suite green. Next: 6f (`a-toy-that-talks-vs-a-toy-that-listens`, the
  category comparison; drops the unverifiable "India's bestselling talking toy" claim).
- 2026-09-05 · commit 6f (C3, 6 of 6) · `a-toy-that-talks-vs-a-toy-that-listens` 314 → 746 body words. The
  comparison piece: a 53-word direct answer, serve and return (Harvard) and Romeo et al. 2018 as the
  mechanism, then a category-by-category map as H2 blocks (apps and tablets, smart speakers, repeat and
  phrase toys, AI companion toys with the Common Sense Media finding, Kheelu), and the five-question
  checklist. No competitor is named. The old description's "India's bestselling talking toy" claim, which
  nothing could verify, is gone. Connectivity stated per §8.24-1 (WiFi for open conversation, Story mode
  and Bluetooth offline); languages from `LANGUAGES_LINE`. Four sources. QuillBot detector: **not scored**, the free plan
  allows five scans a day and the five earlier articles used them ("No more scans left today"); re-run
  tomorrow or on a paid plan if the founder wants the sixth number, it is a heuristic either way. Next: commit 7 (close the round: §8.35 laws, outreach drafts,
  production verification after the push, CLAUDE.md banner).

