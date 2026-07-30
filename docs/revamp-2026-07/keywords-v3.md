# Keyword map v3 — the V4 CMO pass (2026-07-30)

Method: Ahrefs (founder's account, project `Kheelona`) for the site baseline, then the
sanctioned Google-India validation (autocomplete + People-also-ask + live SERPs in Chrome,
per the 2026-07-06 approval). **Ahrefs Keywords Explorer and CSV export are paywalled on
the current plan** — noted for the founder; volumes below are demand signals (autocomplete
presence, PAA presence, SERP composition), not numbers.

## The Ahrefs baseline (2 days after launch — expected, recorded so growth is measurable)

| Metric | Value | Note |
|---|---|---|
| Domain Rating | 0 | Young domain, junk profile (below) |
| Organic keywords / traffic | 0 / 0 | Indexed (24 pages in GSC) but not ranking-tracked yet |
| AI citations (Ahrefs "AI responses", new index) | **0 pages** across AI Overviews, ChatGPT, Gemini, Perplexity, Copilot | The AEO baseline. llms.txt + answer blocks aim exactly here |
| Backlinks / ref. domains | 491 / 341 | **Almost all Ahrefs-flagged SPAM** (rankyour.website, buybacklinks.agency, pbnseolinks.shop…) plus storeleads.app (DR 76, a store-directory scraper from the Wix era). Nothing to leverage, nothing urgent to fix — Google ignores most of this. The genuine-backlinks campaign (FOUNDER-TODO V3-i) remains the real play |
| Site Audit | Health 100 · 82 crawled · 4 blocked · 3 redirects | Healthy |
| GSC Insights in Ahrefs | Not connected | Optional founder hookup: Ahrefs → project settings → connect Google Search Console; it surfaces real query impressions young sites already get |

## The headline finding

**kheelona.com already ranks #1 organic in India for "raising bilingual child in india"**
(the journal article, above Reddit and every parenting site, 2 days after launch —
screenshot: `docs/snapshots/serp-bilingual-no1-2026-07-30.jpg`). The AI Overview on that
SERP cites a competitor (Fundaspring), not us — closing that gap is what the answer-block
format is for. Conclusion: the journal strategy works; feed it.

## Demand validated this pass (Google India)

1. **"ai tutor for kids"** — autocomplete: `free · homeschool · reading · math` + sibling
   `ai teacher for kids`; related: **"AI tutor with voice"**. Every ranker (Khanmigo,
   MeraTutor CBSE, Synthesis, LittleLit) is an APP for school-age homework. **Nobody owns
   pre-school, screen-free, voice-first, in-a-toy.** The V4 hero claims exactly this open
   ground.
2. **"talking toy for kids"** — the India SERP is wall-to-wall ₹279–699 dancing-cactus
   repeat-toys (35k Flipkart ratings). PAA: *What toys help children learn to talk? · Are
   talking toys good for babies?* — speech-development intent hiding inside a commodity
   query. Differentiation story: repeats vs answers.
3. **"how to reduce screen time for 3 year old"** — PAA is dominated by NAMED RULES
   (*3-3-3 rule · 3-6-9-12 rule · 7-7-7 rule · how much for a 3-year-old*). No journal
   article covers the named rules yet.
4. **"best toys for 2 year old india"** — AI Overview + commerce SERP; related search
   **"toys for 2 year old for brain development"** is the intent worth answering
   editorially (labels vs serve-and-return).
5. **Bilingual PAA**: *Does growing up bilingual delay speech?* — the anxiety adjacent to
   our #1 article, unanswered by us.

## Page map (v3 → v4 deltas only; the rest of the v2 map stands)

| Page | Primary | Woven in | Change shipped |
|---|---|---|---|
| Home | screen-free AI toy | **ai tutor for kids**, talking toy that teaches | Title/H1 now carry the tutor family (D2) |
| /products/lumi | talking toy for kids | AI toy for ages 2 to 5 | Title gains "talking toy" (was "talking plush friend") |
| /playos | — (VC page, SEO secondary) | AI platform for children | D6 rebuild |
| /safety | are AI toys safe | (unchanged) | — |
| /stories | five new pieces below | | V4-7 |

## The five new stories (slugs live in `src/lib/stories-expansion.ts`)

| Slug | Target | Evidence |
|---|---|---|
| `does-a-three-year-old-need-an-ai-tutor` | ai tutor for kids (+voice) | probe 1 |
| `a-toy-that-talks-vs-a-toy-that-listens` | talking toy for kids | probe 2 |
| `screen-time-rules-parents-swear-by` | 3-6-9-12 / named rules | probe 3 |
| `talking-toys-and-late-talkers` | toys that help children talk · bilingual speech-delay myth | probes 2 + 5 |
| `brain-development-toys-for-a-2-year-old` | toys for 2 year old brain development | probe 4 |

Rules held: useful-first, scene-first, question-led headings, one soft invite at most,
zero em-dashes/italics/exclamations, no invented statistics (named screen rules are
attributed or explicitly flagged as folklore), no medical claims.

## For the founder (optional, none blocking)

- Ahrefs plan: Keywords Explorer + exports are locked; upgrade only if you want volume
  numbers — the strategy does not depend on them.
- Connect GSC to Ahrefs (GSC Insights tab) for real query impressions.
- The spam backlink profile needs no action now; revisit only if Search Console flags a
  manual action (none expected).
