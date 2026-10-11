---
title: "Legacy search evidence: Search Console and Keyword Planner, as recorded 2026-09-05 and 2026-09-11"
type: raw-capture
updated: 2026-10-10
sources:
  - "archive/pre-reset-2026-10-10:docs/checkpoints/seo-aeo-geo-2026-09-05.md L19-37 (baseline table)"
  - "archive/pre-reset-2026-10-10:docs/checkpoints/seo-aeo-geo-2026-09-11.md L57-58, L70-97, L121-194, L196-262, L269-310"
  - "archive/pre-reset-2026-10-10:docs/seo/handoff-2026-09-11.md L19-22, L118, L174"
  - "archive/pre-reset-2026-10-10:CLAUDE.md L361-367"
  - wiki/legacy/memory-summary.md (row on SEO findings, L180-181, L291)
---

# Legacy search evidence (Search Console, Keyword Planner), September 2026

**Why this file exists.** Search Console and Keyword Planner need the founder's login; fresh exports
are requested as [open question C11](../../../open-questions.md). Until they arrive, the only
measured volumes for this project are the ones the two September SEO rounds read by hand. They are
copied here, with their dates, so Phase 1 can cite them. **Treat every figure as dated evidence,
not as current.** Nothing below was re-measured on 2026-10-10.

The 2026-10-03 re-measure the September rounds scheduled was **not done** (listed as past due in
[memory summary](../../../legacy/memory-summary.md)).

## 1. Keyword Planner, India

### 1a. Read 2026-09-11; window Sept 2025 to Aug 2026; India, all languages; 20 terms
(`seo-aeo-geo-2026-09-11.md` L269-281)

| Term | Avg. monthly searches (India) | Competition (top-of-page bid range) |
|---|---|---|
| educational toys for 3 year olds | **1k-10k** | High (₹1.12-₹7.45) |
| learning toys for 3 year olds | **1k-10k** | High (₹1.12-₹7.45) |
| toys that talk back | **100-1k** | High (₹1.23-₹8.61) |
| ai plush toy | 10-100 | High |
| are ai toys safe | 10-100, three-month change **+∞** | Low |
| ai toy for kids · ai toys for kids india · best ai toy for kids · ai toy india · ai learning toy · talking toy for kids · smart toys for kids · storytelling toy for kids · interactive toy for kids · screen free toys for toddlers · screen free activities for kids · screen time for kids · how much screen time for a 3 year old · best toys for 3 year olds india · toys for bilingual kids | **no data** (the round read this as below 10) | – |

### 1b. Read 2026-09-05; window Aug 2025 to Jul 2026; India; 25 seeds
(`seo-aeo-geo-2026-09-05.md` L30)

| Term | Avg. monthly searches (India) |
|---|---|
| brain development toys | **1k-10k** |
| ai robot toy | 100-1k |
| 3 6 9 12 rule | 10-100 |
| toys to reduce screen time | 10-100 |
| 21 other seeds, named examples: "ai toy for kids", "screen free toys", **"educational toys for 3 year old"**, "talking toy for kids", "kheelona" | no data "on this account" |

### 1c. A conflict between the two reads (unresolved)

**"educational toys for 3 year old" (singular) returned no data on 2026-09-05, while "educational
toys for 3 year olds" (plural) returned 1k-10k on 2026-09-11.** The windows differ by one month and
the phrasing by one letter. Keyword Planner normally groups close variants, so the likelier
explanation is a difference in how each read was run (account, match settings, or which variant
Keyword Planner reported), but neither checkpoint records enough to tell. **Do not cite the 1k-10k
figure for the singular phrasing**; the fresh export under C11 should include both forms.

Also unmeasured in either read: every age above 3 (4, 5, 6, 7), every "gift for N year old" phrase,
"brain development toys for 3 year old", speech and language terms, and story or audio player
terms.

## 2. Search Console, kheelona.com

### 2a. Performance, 3 months to 08 Sept 2026 (read 2026-09-11; `…09-11.md` L121-194)

192 clicks · 2.28k impressions · CTR 8.4% · average position 6.1 · **44 queries in total**.
(Baseline 3 months to 3 Sept, read 2026-09-05: 174 clicks · 2.25k impressions · CTR 7.7% ·
position 6.2; `…09-05.md` L23.)

Query clusters as the round grouped them (impressions approximate, L169-174):

| Cluster | Impressions | Reading recorded at the time |
|---|---|---|
| `kheelona` and misspellings (keelona, khilona, khelona, kholona, sheelona, khilana, khelna) | ~215 | navigation by people who already know the brand |
| "Lumi" cluster: `ai lumi toy` (494), `lumi ai toy` (160), `lumi toy` (101), `lumi pink` (94), `ai lumi toys` (62), `lumitoy` (49), ~15 more | **~1,050** | name collision with another product; much of it Romanian ("jucarie", "pareri") or Portuguese; CTR 0.8% to 3% |
| `36912`, `36912 rule`, `what is the 3 6 9 12 rule for screen time?` | 9 | average position **1.0**, answered by `/stories/screen-time-rules-parents-swear-by` |
| `ai toys`, `ai educational toys`, `toy store near me` | 3 | category, negligible (on 09-05: "ai toys" position 2, "ai educational toys" position 12) |

### 2b. Pages that earned any impression in those 3 months (`…09-11.md` L80-95)

| Page | Clicks | Impressions |
|---|---|---|
| `/` | 178 | 1,986 (87% of all) |
| `www.kheelona.com/product/bd99df2b-…` (legacy Wix, redirects) | 5 | 314 |
| `/contact` | 3 | 183 |
| `/shipping` | 2 | 100 |
| `/stories/raising-a-bilingual-child-in-india` | 1 | 99 |
| `/stories/screen-time-rules-parents-swear-by` | 2 | 56 |
| `/products/lumi` | 1 | 40 |
| `checkout.kheelona.com/` | 1 | 24 |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` | 1 | 15 |
| `checkout.kheelona.com/product-page/lumi-green` | 1 | 7 |

16 of the then 19 journal articles were indexed and earned **zero** impressions.

### 2c. Other Search Console readings

- Generative AI features, 3 months to 3 Sept: **168 impressions**, 152 on `/` (`…09-05.md` L24).
  **Caveat recorded six days later:** the 09-11 round could not reproduce this figure from the
  Search Console interface and found **no "AI Mode" search type** for the property (`…09-11.md`
  L38-41). Treat 168 as unverified.
- Ahrefs' stored GSC data stopped on 20 August 2026 (`…09-11.md` L30-31). Ahrefs' stored window 27 Jul to 20 Aug: 53 clicks,
  635 impressions, CTR 8.3%, position 6.6, 32.1% anonymised queries (L57-58).

## 3. Answer engines, as measured then (Perplexity, free tier)

| Date | Prompt | Result recorded |
|---|---|---|
| 2026-09-05 | "What is the best screen-free AI toy for a 3 year old in India?" | MyWonder (₹4,999), ScoobiesAI Kiki and Pookie, Kanha AI (CoRover), Haivivi BubblePal. Kheelona absent (`…09-05.md` L31) |
| 2026-09-05 | "Are AI toys safe for a 3 year old? What should an Indian parent check before buying one?" | consensus: Common Sense Media and Fairplay advise no AI companion toy under 5; `/safety` not cited (L32) |
| 2026-09-11 | "best AI toy for a 4 year old in India" | YUMI AI Plushie (₹8,999), Pookie (₹6,999), Miko Mini / Miko 3 (₹13,999), AIVY (₹10,999), Mirana Moonwalker (₹349). Kheelona absent. 4 of 11 citations were brands' own sites (`…09-11.md` L198-224) |
| 2026-09-11 | "What is Kheelona and what is the Kheelu AI toy?" | entity known but wrong five ways (Lumi, ages 2-8, robot, limited beta, two founders); 7 of 10 citations third-party (L226-242) |

Current answer-engine captures belong to the GEO work in
[`../geo/`](../geo/) (2026-10-10), not to this file.

## 4. What the September rounds concluded (their words, for context only)

- "Nobody in India searches Google for this category. Every 'AI toy' phrasing returns no volume"
  (`handoff-2026-09-11.md` L22; `CLAUDE.md` L366).
- "The category's demand currently lives in answer engines, not in Google's query stream"
  (`…09-11.md` L299-300).
- The terms with volume were judged to be learning / educational toys for 3-year-olds, toys that
  talk back, and are AI toys safe (L305-307).

Phase 1 re-tests these against fresh sources; see the other captures in this folder.
