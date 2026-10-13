---
title: Keyword map (Phase 1)
type: research
updated: 2026-10-14
sources:
  - ../decisions/D053-remove-the-3-6-9-12-article.md (the 3-6-9-12 article's rows marked removed; task 6.5)
  - raw/research/serp/legacy-gsc-keyword-planner-2026-09.md
  - raw/research/serp/google-trends-in-2026-10-10.md
  - raw/research/serp/google-autocomplete-in-2026-10-10.md
  - raw/research/serp/youtube-autocomplete-in-2026-10-10.md
  - raw/research/serp/amazon-in-2026-10-10.md
  - raw/research/serp/firstcry-suggest-2026-10-10.md
  - raw/research/serp/flipkart-2026-10-10.md
  - raw/research/serp/competitor-pages-2026-10-10.md
  - raw/research/serp/posthog-search-referrers-2026-10-10.md
  - raw/research/serp/websearch-communities-2026-10-10.md
  - raw/research/serp/onpage-keyword-placement-2026-10-10.md
  - raw/research/geo/README.md
  - raw/research/geo/question-bank-2026-10-10.md
  - raw/research/geo/ai-answer-audit-2026-10-10.md
  - raw/research/geo/entity-consistency-2026-10-10.md
  - raw/research/geo/machine-readability-2026-10-10.md
  - raw/research/geo/ai-crawler-policy-2026-10-10.md
  - "raw/qa/2026-10-10/html/ (35 sitemap URLs + store home, server HTML, 2026-10-11 02:47-02:50 UTC; qa/baseline-2026-10-10.md): the density source for section 5.3, re-parsed 2026-10-11 with the patterns in section 5.3 (script in the session scratchpad, phase1c/sv/qa_pages.py + phase1b/search-visibility/density2.py, not in the repo); every figure matched the earlier 02:58-03:01 UTC capture behind onpage-keyword-placement-2026-10-10.md"
  - "research/posthog-audit.md section 4, 'By source (Q6)': 83 of 802 human sessions from ChatGPT, the traffic share used on this page"
  - "decisions D011, D013, D015-D029 and open-questions.md section F (R5, R9), the founder's rulings of 2026-10-10/11"
  - site/url-map.md
  - site/content-boundary.md
  - brand/positioning.md
  - brand/messaging.md
  - product/facts.md
  - product/claims.md
  - product/pricing.md
  - product/policies.md
  - product/age-band-review.md
  - research/posthog-audit.md
  - engineering/lessons.md (section 6)
---

# Keyword map (Phase 1)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). Keyword data,
> volumes, competitor names and analytics never go on the site. Only the answer drafts in
> [section 6](#6-question-bank-answer-first-drafts) and the GEO items in [section 7](#7-geo-plan)
> are written for publication, and they use EXTERNAL facts only
> ([content boundary](../site/content-boundary.md)).

**What this page owns:** the keyword clusters, the one primary cluster per URL, placement rules,
the question bank and the GEO plan. It does not own facts (see [facts](../product/facts.md)),
claims ([claims](../product/claims.md)), prices ([pricing](../product/pricing.md)), URLs
([url map](../site/url-map.md)) or tracking ([tracking inventory](../site/tracking-inventory.md)).

**The one caveat that governs everything below.** The only measured search volumes for this project
are two hand reads of Keyword Planner and one of Search Console, made in September 2026
([legacy capture](../raw/research/serp/legacy-gsc-keyword-planner-2026-09.md)). Fresh exports are
[open question](../open-questions.md) C11; the seed list for that export is
[section 9](#9-seed-list-for-the-c11-keyword-planner-export). Every other signal here (Trends,
autocomplete, marketplace suggestions, PostHog) shows **that** people type a phrase or **which page**
they land on, never **how many**. Where there is no volume, the table says "no volume data".

## In one screen

1. **Volume sits in three places, all age 3 or category-wide** (Keyword Planner, India, read
   2026-09-11 and 2026-09-05): "learning toys for 3 year olds" and "educational toys for 3 year
   olds" 1k-10k each; "brain development toys" 1k-10k; "toys that talk back" 100-1k. "are ai toys
   safe" is small (10-100) but rising. **Every "AI toy" phrasing returned no data.** Ages 4 to 7 were
   never measured.
2. **Search and ChatGPT already sell.** Of the two paid orders between 2026-09-19 and 2026-10-10, one
   came from a Google organic session and one from a ChatGPT-referred session
   ([PostHog audit §4](posthog-audit.md#by-source-q6-sessions-internal-excluded)). ChatGPT brought 83 of
   802 human sessions (10.3%; same table, Q6, internal excluded). Every search and AI landing was a
   brand page; **no journal article received one**.
3. **"Kheelu" alone is not a known entity.** Google autocomplete reads it as "kheel" (a puffed-rice
   sweet) and Bing returns unrelated pages; "Kheelona" is recognised but collides with "khilona"
   (Hindi for toy) on Amazon.in, FirstCry and Bing. Always pair them: **"Kheelu by Kheelona"**.
4. **Parents type single ages, not ranges.** "3 to 7" is never predicted; "for 3 year old (boy /
   girl)" is. Treat 3 to 7 as the entity fact, and single ages as the keywords.
5. **"Talking toy" is a trap**: in India it means a dancing cactus or an NCERT Class 3 English chapter.
   **"Toy that talks back" is the product-fit phrase with volume.**
6. **The category heads are marketplace territory**: their Amazon.in first pages are led by ₹113 to
   ₹699 items with thousands bought a month. A ₹4,999 product page will not win them; journal pages
   can, and must route to the product page.
7. **The live pages under-use their own primaries**: the proposed primary is absent from 9 of 35
   pages, in only 7 meta descriptions and 2 alt texts, while the product name "Kheelu" passes 2% on 8
   pages (Home 3.24%, product page 3.46%, `/setup` 4.6%).
8. **Four pages answer the same AI-toy safety question**, and two answer late talking; both are
   cannibalisation risks with a merge option for Gate A ([section 4.3](#43-overlap-and-cannibalisation-flags)).
9. **Answer engines repeat wrong facts we can trace**: "priced at ₹499" and "a lifetime subscription
   to Kheelona+" (Bing's AI summary), copied text from an unclaimed CB Insights profile, "Lumi"
   on our own sister site and both app listings, "robotic" on LinkedIn.
10. **The positioning's category noun, "brain-development toy", matches a 1k-10k head term**, but that
    term's demand is baby-first, and [D016](../decisions/D016-brain-wording.md) bans it as Kheelu's
    label: "brain development" is a searched TOPIC only (titles, headings, articles). Home's
    descriptor is therefore "a screen-free plush toy that talks" (SV-2).
11. **AI-crawler policy (G7): allow everything, disallow Bytespider** (recommended option 2).
12. **Hinglish and Hindi learn-intent demand is visible** (teaching a child to talk, screen time,
    phone habits) and unmeasured; a future opportunity, not a launch item.
13. **The founder's rulings of 2026-10-10/11 (D016-D029) filled every placeholder this page carried
    about listening, voice, retention, returns, warranty, payment, delivery, Story mode, Kheelona+ and
    price wording**; six new answer drafts use them (AL1, VP1, RT1, W1, PM1, SP1). What stays open
    is in [section 10](#10-open-questions-raised-here).

## 1. Evidence base and how volumes are labelled

| Signal | What it measures | Window and date | File |
|---|---|---|---|
| Keyword Planner, India (legacy) | Avg. monthly searches, in ranges | Sept 2025 to Aug 2026, read 2026-09-11 (20 terms); Aug 2025 to Jul 2026, read 2026-09-05 (25 seeds) | [legacy capture §1](../raw/research/serp/legacy-gsc-keyword-planner-2026-09.md) |
| Search Console, kheelona.com (legacy) | Clicks and impressions | 3 months to 08 Sept 2026, read 2026-09-11 | same, §2 |
| Google Trends, India | Interest relative to the peak of one comparison (0-100); **not volume**, not comparable across comparisons | 12 months and 5 years to the week of 11 Oct 2026, captured 2026-10-11 02:09-02:23 UTC | [trends](../raw/research/serp/google-trends-in-2026-10-10.md) |
| Google and YouTube autocomplete, India | Phrasings Google predicts, in order; no volume | 2026-10-11 02:00-02:39 UTC | [google](../raw/research/serp/google-autocomplete-in-2026-10-10.md), [youtube](../raw/research/serp/youtube-autocomplete-in-2026-10-10.md) |
| Amazon.in suggestions and "bought in past month" badges | Shopper phrasing; product sales (not searches) | 2026-10-11 02:28-02:37 UTC | [amazon](../raw/research/serp/amazon-in-2026-10-10.md) |
| FirstCry suggestions | Category naming and stock; no volume | 2026-10-11 02:31-02:34 UTC | [firstcry](../raw/research/serp/firstcry-suggest-2026-10-10.md) |
| Flipkart | **Not captured** (POST-only API) | 2026-10-11 | [flipkart](../raw/research/serp/flipkart-2026-10-10.md) |
| Competitor pages | Titles, H1, H2, schema they target; no rankings | 2026-10-11 02:24-02:38 UTC | [competitor pages](../raw/research/serp/competitor-pages-2026-10-10.md) |
| PostHog | Referrers and landing pages; no search terms reach it | 2026-09-19 to 2026-10-10 | [posthog referrers](../raw/research/serp/posthog-search-referrers-2026-10-10.md), [audit](posthog-audit.md) |
| Quora, FirstCry Parenting, Momspresso; Bing People Also Ask | Real question wording | 2026-10-10 / 2026-10-11 UTC | [communities](../raw/research/serp/websearch-communities-2026-10-10.md), [question bank raw](../raw/research/geo/question-bank-2026-10-10.md) |

**Labels used in every table.** `KP 1k-10k (2026-09-11)` = Keyword Planner India range and read date.
`GSC n impr. (3 mo to 08 Sep)` = Search Console impressions. `Trends n` = relative interest in the named
comparison. `AC` = autocomplete shows the phrasing. `Amazon badge` = product sales. **"no volume data"** =
nothing measured. Keyword Planner's "no data" is recorded as **"KP no data"**, which the September
rounds read as under 10 a month; for screen-time terms that reading is implausible against
autocomplete depth, so treat it as **unmeasured**, not zero, until C11.

**One known conflict:** "educational toys for 3 year old" (singular) read **no data** on 2026-09-05
while the plural read **1k-10k** on 2026-09-11. Cite the range for the plural only; C11 must export
both forms.

## 2. Keyword clusters by intent

Fit is how well the cluster matches a ₹4,999 screen-free plush toy for 3 to 7 year olds, sold on a
sales site. "Owner" is the URL whose **primary** it is ([section 4](#4-one-primary-cluster-per-url)).

### 2.1 Buy

| ID | Cluster | Phrasings seen (source) | Volume (source, date) | Other evidence | Fit | Owner |
|---|---|---|---|---|---|---|
| BUY-1 | Learning / educational toys for a 3-year-old | learning toys for 3 year old(s), educational toys for 3 year old(s), learning toys for 3 + year old (AC; Amazon) | **KP 1k-10k** each, plural (2026-09-11) | Trends related "educational toys for 3 year olds" 9; Amazon first page: 40 of 48 listings badged, top items ₹259-₹699 | Medium: real volume, but the results page sells cheap toys; a guide can rank and route | `/stories/learning-toys-for-a-three-year-old` |
| BUY-2 | Learning toys for 4, 5, 6, 7 year olds | learning toys for 4 / 5 / 6 / 7 year old (boy, girl), educational toys for 5 year old, learning toys for 4+ year old (AC; Amazon) | no volume data | Trends related: for 5 year old 10, for 4 year olds 8, for 7 year olds 3, for 6 year olds 2 (same scale as age 3's 9); rising: "for 3 4 year olds" +300%, "for 4 year olds" +90% | Medium, same caveat as BUY-1 | NEW page (proposed, [4.4](#44-new-pages-proposed-and-rejected)) |
| BUY-3 | Brain development toys | brain development toys, ... for 3 / 4 / 5 year old, toys for 3 year old for brain development (AC) | **KP 1k-10k** head (2026-09-05); age forms unmeasured | Trends avg 4 vs "learning toys" 22; related queries baby-first (baby 100, for 2 year old 30, for 3 year old 13); Amazon "for 3 year old": 41 of 48 badged, ₹113-₹267 | Low to medium: demand skews under 3 (never imply suitability under 3), and [D016](../decisions/D016-brain-wording.md) allows the phrase as a topic only, never as Kheelu's label | secondary on `/stories/learning-toys-for-a-three-year-old`; head held by no page ([4.3](#43-overlap-and-cannibalisation-flags)) |
| BUY-4 | Toys that talk back | toys that talk back (to kids), ai toys that talk back, talking toy with ai, interactive talking toys, plush / soft toy that talks (AC) | **KP 100-1k** (2026-09-11; competition High) | none conflicting | **High**: the closest product-fit phrase with measured volume | `/products/kheelu` |
| BUY-5 | AI toy for kids (India) | ai toys for kids (india), best ai toy for kids, ai robot for kids india, ai plush toys for kids, ai toys for kids under 5 years (AC; Amazon) | **KP no data** for ai toy for kids, ai toys for kids india, best ai toy for kids, ai toy india, ai learning toy (2026-09-11); **KP 10-100** ai plush toy (2026-09-11); **KP 100-1k** ai robot toy (2026-09-05) | Trends "ai toys" 34 but its related queries are AI news; Amazon's "ai toys for kids" page led by a karaoke mic and an RC car; AI companions there carry no badge | Medium for answer engines, low for Google | `/ai-toys-for-kids-in-india` |
| BUY-6 | Screen-free toys and audio players | screen free toys for 3 / 4 / 5 / 7 year olds, screen free gifts for kids, screen free audio player for kids, story box for kids, kids audio player (AC; Amazon) | **KP no data** "screen free toys" (2026-09-05) | Trends "screen free toys" avg 0; Amazon "screen free audio player for kids": a ₹3,190 story player at 500+ bought in past month | Medium: the nearest screen-free talking products that do sell sit here | `/stories/screen-free-does-not-mean-silent` |
| BUY-7 | Talking toy for kids | talking toy for kids (price), talking toys (AC) | **KP no data** (2026-09-11) | AC and Trends dominated by a dancing-cactus mimic toy and the NCERT Class 3 chapter "Talking Toys" | **Low: avoid as a primary**; use "talks back" | none (secondary only) |
| BUY-8 | Smart / interactive toys | smart toys for kids, interactive toys for kids (AC) | **KP no data** (2026-09-11) | Trends: smart toys 12; "interactive toys" related queries are pet toys | Low | none |
| BUY-9 | Language and speech toys | toys for language development, speech development toys for 3 / 4 year olds, language development toys for 3 year old (AC) | no volume data | AC also shows "with speech delay", "speech therapy toys", "for late talkers" | Medium for language development; **health forms are never buy targets** ([claims §4](../product/claims.md#4-retired-or-banned-wording)); speech content follows [D025](../decisions/D025-speech-and-language.md) (public sources only, no outcome claim for Kheelu) | `/stories/a-toy-that-talks-vs-a-toy-that-listens` |
| BRD-1 | Brand: Kheelona and Kheelu | kheelona, kheelona india, kheelona toys, kheelu toys india; misspellings keelona, khelona, khilona (AC; GSC) | **GSC ~215 impr.** for kheelona plus misspellings (3 mo to 08 Sep); **KP no data** "kheelona" (2026-09-05) | Trends Kheelona 0; Bing and autocomplete do not know "Kheelu" alone; Amazon.in and FirstCry read "kheelona" as "khilona" | Highest intent | `/` |
| BRD-2 | The old name, Lumi | lumi ai toy, ai lumi toy, lumi toy, lumi ai toy box (AC; GSC) | **GSC ~1,050 impr.** (3 mo to 08 Sep), mostly another product's buyers (Romanian, Portuguese), CTR 0.8%-3% | A European "LUMI" talking plush exists (entity file row 15) | Defensive only: answer "Is Kheelu the same as Lumi?" | secondary on `/` |

### 2.2 Compare

| ID | Cluster | Phrasings seen | Volume | Other evidence | Fit | Owner |
|---|---|---|---|---|---|---|
| CMP-1 | Are AI toys safe | are ai toys safe (for kids / children), is ai safe for kids, ai smart toy safety (AC) | **KP 10-100**, three-month change +∞, competition Low (2026-09-11) | National news in India (a minister's statement, UPSC explainers) per the communities capture | **High** for trust | `/safety` |
| CMP-2 | How to choose an AI toy / what to look for | what to look for in a safe AI toy, ai toy for kids reddit (AC) | no volume data | The live buyer's guide and the journal article both carry "five checks" | Medium | `/stories/what-to-look-for-in-a-safe-ai-toy` (merge option, 4.3) |
| CMP-3 | AI robot vs plush | ai robot for kids (india), ai robot toy price (AC) | **KP 100-1k** "ai robot toy" (2026-09-05) | LinkedIn calls Kheelona "robotic"; Perplexity called Kheelu a "robot" (2026-09-11) | Medium, and it corrects an entity error | secondary on `/ai-toys-for-kids-in-india` |
| CMP-4 | Talking toy vs toy that talks back | toys that talk back, toy that talks back to you (AC) | inside BUY-4's KP 100-1k | none | High | secondary on `/products/kheelu` |
| CMP-5 | Story box or audio player vs a toy that talks | story box for kids (yoto / with cards), kids audio player, yoto player india price, toniebox price in india (AC) | no volume data | Story players sell on Amazon.in (badges above); the two global players searched for do not sell in India directly | Medium | secondary on `/stories/screen-free-does-not-mean-silent` |
| CMP-6 | Competitor names (a finding about demand only) | miko robot price in india, miko 3 review, is miko worth it, miko mini vs miko 3, playshifu vs osmo, yoto player india (AC; YouTube AC adds "miko robot hindi / tamil") | no volume data | Trends Miko 67 (ambiguous: an anime character shares the name), Skillmatics 25, Smartivity 17, Kheelona 0 | **Gate A decides whether the site ever names a competitor** ([messaging](../brand/messaging.md#words-to-stop-using) bans it today). This map assigns no URL | none |
| CMP-7 | Smart speaker for a child | alexa for kids (english improvement), echo dot kids (AC; Amazon) | no volume data | Parents look for a voice assistant for the child | Medium, answered generically ("smart speaker") | secondary on `/stories/a-toy-that-talks-vs-a-toy-that-listens` |

### 2.3 Learn

| ID | Cluster | Phrasings seen | Volume | Owner |
|---|---|---|---|---|
| LRN-1 | Screen time by age | how much screen time for 3 / 4 / 5 year old, screen time for 3-4 year old; Bing PAA "How much screen time should a 3 year old have?" and "... 4 year old ..." | **KP no data** "how much screen time for a 3 year old", "screen time for kids" (2026-09-11), treat as unmeasured | `/stories/how-much-screen-time-for-a-3-to-6-year-old` |
| LRN-2 | 3-6-9-12 rule | 3 6 9 12 rule (screen time) | **KP 10-100** (2026-09-05); **GSC 9 impr., position 1.0** (3 mo to 08 Sep) | none: `/stories/screen-time-rules-parents-swear-by` was **removed** ([D053](../decisions/D053-remove-the-3-6-9-12-article.md), task 6.5) and 308s to `/stories#screen-time` |
| LRN-3 | Reducing screen time, phone habits | how to reduce screen time for kids / toddlers, how to stop mobile addiction in child, my child is addicted to mobile phone | **KP 10-100** "toys to reduce screen time" (2026-09-05); rest no volume data | `/stories/the-gentle-way-off-the-phone` |
| LRN-4 | Tantrums at switch-off | (Quora) "dissuade a three-year-old from using a smartphone ... control his tantrums"; cartoon addiction in children (AC) | no volume data | `/stories/screen-time-and-tantrums` |
| LRN-5 | Screen-free activities at home | activities for 3 year olds at home, screen free activities for kids (at home, indoors) | **KP no data** "screen free activities for kids" (2026-09-11) | `/stories/busy-hands-no-screens` |
| LRN-6 | Getting a child to talk more | how to make child talk more, how to get your child to talk more, conversation starters with children | no volume data | `/stories/how-to-get-your-child-talking` |
| LRN-7 | Not talking in sentences (health-adjacent) | my 3 year old is not talking (properly / yet / in sentences), speech delay in 3 year old | no volume data | `/stories/talking-late-or-talking-little` (no product claims) |
| LRN-8 | Late talker (health-adjacent) | toys for late talkers, late talker | no volume data | `/stories/talking-toys-and-late-talkers` (G5: under-3 framing) |
| LRN-9 | Vocabulary | how to increase 3 year old vocabulary, what vocabulary should a 3 year old have | no volume data | `/stories/how-children-collect-words` |
| LRN-10 | Bilingual child | how to raise a bilingual child, how to teach mother tongue to a child, how to teach your child 3 languages | **KP no data** "toys for bilingual kids" (2026-09-11); **GSC 99 impr.** on the page (3 mo to 08 Sep), the most of any article | `/stories/raising-a-bilingual-child-in-india` |
| LRN-11 | Serve and return | serve and return (interaction, child development, examples, harvard) | no volume data | `/stories/how-children-learn-by-talking` |
| LRN-12 | Brain development, the how | how to develop child brain, how to make child brain sharp, brain development activities for 3 year olds at home | no volume data | `/stories/what-actually-builds-a-sharp-brain` |
| LRN-13 | Why the early years matter | (no autocomplete seed captured) | no volume data | `/stories/why-three-to-six-are-the-years-that-matter-most` |
| LRN-14 | Kids and AI | should kids use ai, is ai good for kids, ai for kids | no volume data | `/stories/should-kids-use-ai` |
| LRN-15 | AI tutor | ai for kids learning, ai robot for kids learning | no volume data | `/stories/does-a-three-year-old-need-an-ai-tutor` |
| LRN-16 | AI toy privacy: does it record | (Common Sense Media and Fairplay guides; the live article's own question) | no volume data | `/stories/questions-parents-ask-about-ai-toys` |
| LRN-17 | India's data law and children | (the live article; national AI-toy news) | no volume data | `/stories/ai-toys-and-indias-data-law` |

### 2.4 Gift

| ID | Cluster | Phrasings seen | Volume | Fit | Owner |
|---|---|---|---|---|---|
| GFT-1 | Gift for a 3 to 7 year old | gift for 3 / 4 / 5 / 6 / 7 year old (boy / girl), ... india, ... blinkit, ... instant delivery (AC); gift for 4 year old (Amazon: 45 of 48 badged) | no volume data | Low to medium: **price-capped** ("under 500", "under 200") far below ₹4,999 | secondary on `/products/kheelu` and the NEW 4-7 page |
| GFT-2 | Birthday gift by age | birthday gift for 3 year old boy, ... 4 year old girl, ... 5 year old boy (AC) | no volume data | Medium | secondary on `/products/kheelu` |
| GFT-3 | Seasonal | diwali gift for kids, children's day gift (14 November) (AC) | no volume data; Trends: no Diwali lift visible for category heads (week of 19-25 Oct 2025: 8) | Medium for ads and FAQ, low for SEO | FAQ only (question G2) |
| GFT-4 | Educational / screen-free gift | educational gift for kids, screen free gifts for kids (AC) | no volume data | Medium | secondary on `/stories/screen-free-does-not-mean-silent` |

## 3. Clusters by age

| Age | What parents type (source) | Volume | Notes |
|---|---|---|---|
| **3** | learning / educational toys for 3 year old(s); brain development toys for 3 year old; how much screen time for 3 year old; my 3 year old is not talking; how to increase 3 year old vocabulary; gift for 3 year old (boy / girl); activities for 3 year olds at home (AC); "3 + year old" (Amazon) | **KP 1k-10k** learning and educational toys, plural (2026-09-11) | The only measured age. Under-3 queries sit beside every age-3 query, so copy must say the age plainly |
| **4** | learning toys for 4 year old (girl / boy), toys for 4 year old (birthday), gift for 4 year old girl; Bing PAA "How much screen time should a 4 year old have?"; "4+ year old", "4-5 year old" (Amazon) | no volume data | Trends related "educational toys for 4 year olds" 8, rising +90%; "3 4 year olds" +300% |
| **5** | learning toys for 5 year old, educational toys for 5 year old, stem toys for 5 year old, best toys for 5 year old india, birthday gift for 5 year old boy (AC) | no volume data | Trends related "educational toys for 5 year old" 10, the highest single age in that list |
| **6** | learning toys for 6 year old(s), educational toys for 6 year old girls in india, gift for 6 year old (AC) | no volume data | Trends related 2. FirstCry buckets 4-6 and 6-8 |
| **7** | learning toys for 7 year old(s) (thin: Google falls back to other ages), toys for 7 year old, gift for 7 year old (AC) | no volume data | Trends related 3. Quora: "toys that I can buy for my 7 year old kid in India" |
| **3 to 7** | not a phrase anyone types: "learning toys for 3 to 7 year old" falls back to "3 to 4", "3 to 5" (AC); marketplaces bucket 2-4 / 4-6 / 6-8 (FirstCry) and 3-5 / 6-9 (a large Indian games brand's own pages) | none | **Use "3 to 7" as the entity fact** (title or first line, schema, llms.txt); **use single ages in H2s** so each age query has a matching heading |

Modifiers to expect on every age query: **boy / girl** first, then **india**, a retailer
(**amazon, flipkart, blinkit, meesho**), a price cap (**under 500 / 200**), and **for brain
development**. Health modifiers (**with speech delay, with autism**) appear early in the list and are
**never targeted** ([claims §4](../product/claims.md#4-retired-or-banned-wording)).

## 4. One primary cluster per URL

Primary = the cluster this URL must win and no other URL targets. Secondaries may appear on
several pages. Brand words ("Kheelu", "Kheelona") appear everywhere and are not counted as shared.

### 4.1 Marketing pages (13)

| URL | Primary cluster (term to place) | Intent · age | Volume (source, date) | Secondaries |
|---|---|---|---|---|
| `/` | **Kheelu by Kheelona** (BRD-1) | buy, navigational · 3 to 7 | GSC ~215 impr. brand plus misspellings (3 mo to 08 Sep); KP no data (2026-09-05) | "Is Kheelu the same as Lumi?" (BRD-2); "ai khilona" (AC); the category descriptor chosen at Gate A ([open question](#10-open-questions-raised-here) SV-2); price; "screen-free" |
| `/products/kheelu` | **toys that talk back** (BUY-4) | buy · 3 to 7 | KP 100-1k (2026-09-11) | Kheelu price; ai plush toy (KP 10-100); talking toy with ai, plush toy that talks; birthday gift for a 4 or 5-year-old (GFT-2); talking toy vs toy that talks back (CMP-4); how to pay (PM1); can Kheelu help my child's speech (SP1, beside the [D025](../decisions/D025-speech-and-language.md) disclaimer) |
| `/safety` | **are AI toys safe** (CMP-1) | compare · 3 to 7 | KP 10-100, rising (2026-09-11) | is Kheelu safe; does Kheelu have a camera; is it always listening (AL1); where does my child's voice go (VP1); is ai safe for kids |
| `/ai-toys-for-kids-in-india` | **AI toys for kids in India** (BUY-5) | compare, buy · 3 to 7 | KP no data (2026-09-11) | best AI toy for a 4 year old in India (the answer-engine prompt); AI robot or plush (CMP-3, KP 100-1k "ai robot toy"); ai plush toy; what age is an AI toy for |
| `/playos` | **PlayOS** (navigational) | trust | no volume data; 1 PostHog landing | grey page, G8: keep, merge or 301 |
| `/stories` | **parenting guides** (hub) | learn · 3 to 7 | no volume data; 0 search or AI landings | links to every cluster owner; not a ranking target |
| `/team` | **Kheelona founders** | trust | no volume data; 3 organic + 1 ChatGPT landings | who makes Kheelu; Kheelona Robotics Private Limited; the three founders' names |
| `/setup` | **how to set up Kheelu** | post-purchase | no volume data | Kheelona app; connect Kheelu to WiFi |
| `/contact` | **contact Kheelona** | trust | GSC 183 impr. on the page (3 mo to 08 Sep; queries not recorded) | Kheelona WhatsApp, Kheelona email, customer care |
| `/privacy` | **Kheelona privacy policy** | trust | no volume data | children's data; how long conversations are kept (RT1); DPDP (secondary; the article owns DPDP) |
| `/terms` | **Kheelu pre-order terms** | trust | no volume data | what the ₹499 advance buys (after ₹4,999, [D028](../decisions/D028-price-wording.md)); carries the [D025](../decisions/D025-speech-and-language.md) speech disclaimer (copy, not a keyword) |
| `/refund` | **Kheelu refund policy** | trust | no volume data; 1 ChatGPT landing | cancel a pre-order; 7-day returns ([D021](../decisions/D021-returns-policy.md)); Kheelu warranty (W1, [D022](../decisions/D022-warranty-replacement-refund.md)) |
| `/shipping` | **Kheelu delivery and shipping** | trust | GSC 100 impr. on the page (3 mo to 08 Sep) | when will Kheelu be delivered ([D023](../decisions/D023-new-order-delivery.md)); delivery in India |

### 4.2 Journal articles (22)

| URL `/stories/…` | Primary cluster (term to place) | Cluster · age | Volume | Secondaries |
|---|---|---|---|---|
| `why-three-to-six-are-the-years-that-matter-most` | **why the early years matter** | LRN-13 · 3 to 7 | no volume data | foundational stage (NEP 2020); early childhood development |
| `screen-free-does-not-mean-silent` | **screen-free toys** | BUY-6 · 3 to 7 | KP no data (2026-09-05) | story box or toy that talks back (CMP-5); screen-free audio player; screen-free gifts (GFT-4) |
| `how-children-learn-by-talking` | **serve and return** | LRN-11 · 3 to 7 | no volume data | how children learn language; conversation with a child |
| `what-to-look-for-in-a-safe-ai-toy` | **what to look for in a safe AI toy** | CMP-2 · 3 to 7 | no volume data | what child-safety groups say about AI toys; can an AI toy say something inappropriate |
| `how-much-screen-time-for-a-3-to-6-year-old` | **how much screen time for a 3-year-old** (and 4 to 7 as H2s) | LRN-1 · 3, 4, 5, 6, 7 | KP no data (2026-09-11), unmeasured | screen time by age; WHO, IAP and AAP guidance |
| `screen-time-and-tantrums` | **screen time tantrums** | LRN-4 · 3 to 5 | no volume data | tantrum when the phone is taken away; cartoon addiction |
| `the-gentle-way-off-the-phone` | **how to reduce screen time** | LRN-3 · 3 to 7 | KP 10-100 "toys to reduce screen time" (2026-09-05) | stop mobile addiction in a child |
| `how-to-get-your-child-talking` | **how to get your child to talk more** | LRN-6 · 3 to 7 | no volume data | conversation starters; games that help speech |
| `talking-late-or-talking-little` | **3-year-old not talking in sentences** | LRN-7 · 3, 4 | no volume data | when to see a professional (no product claims) |
| `what-actually-builds-a-sharp-brain` | **how to develop a child's brain** | LRN-12 · 3 to 7 | no volume data | brain development activities at home; "बच्चों का दिमाग तेज करने के उपाय" (Hindi, future) |
| `how-children-collect-words` | **how to build a 3-year-old's vocabulary** | LRN-9 · 3, 4 | no volume data | vocabulary in two languages |
| `raising-a-bilingual-child-in-india` | **raising a bilingual child** | LRN-10 · 3 to 7 | GSC 99 impr. (3 mo to 08 Sep) | will English confuse my child; mother tongue |
| `should-kids-use-ai` | **should kids use AI** | LRN-14 · 3 to 7 | no volume data | is AI good for kids; AI chatbots and children |
| `busy-hands-no-screens` | **screen-free activities for kids at home** | LRN-5 · 3 to 7 | KP no data (2026-09-11) | activities for 3 year olds at home |
| `does-a-three-year-old-need-an-ai-tutor` | **AI tutor for a 3-year-old** | LRN-15 · 3 | no volume data | "tutor" is a stop-word for Kheelu ([messaging](../brand/messaging.md#words-to-stop-using)); the article may discuss tutors, never call Kheelu one |
| `a-toy-that-talks-vs-a-toy-that-listens` | **toys for language development** | BUY-9 · 3 to 7 | no volume data | are talking toys good for speech; smart speaker for a child (CMP-7) |
| `screen-time-rules-parents-swear-by` (**removed**, [D053](../decisions/D053-remove-the-3-6-9-12-article.md): 308 to `/stories#screen-time`) | **3-6-9-12 rule** | LRN-2 · 3 to 7 | KP 10-100 (2026-09-05); GSC 9 impr., position 1.0 | screen time rules |
| `talking-toys-and-late-talkers` | **late talker** | LRN-8 · today "a quiet two-year-old" | no volume data | G5 decides its age; merge option in 4.3 |
| `brain-development-toys-for-a-2-year-old` | **brain development toys for a 2-year-old** (as live) | BUY-3 · **under 3** | KP 1k-10k for the head only (2026-09-05) | G5 decides; recommended 301 in 4.3 |
| `learning-toys-for-a-three-year-old` | **learning toys for a 3-year-old** | BUY-1 · 3 | KP 1k-10k (2026-09-11) | educational toys for 3 year olds (KP 1k-10k); brain development toys for 3 year old (BUY-3) |
| `questions-parents-ask-about-ai-toys` | **does an AI toy record your child** | LRN-16 · 3 to 7 | no volume data | is it always listening; what happens to the data |
| `ai-toys-and-indias-data-law` | **DPDP Act and children's data** | LRN-17 · 3 to 7 | no volume data | verifiable parental consent |

**Pages proposed at Gate A ([G8](../open-questions.md)), if they become pages:** `/faq` primary
**Kheelu questions** (price, age, WiFi, subscription, delivery, refunds, "same as Lumi"; the product
page then keeps four or five buying questions and links to it, so no question is answered in two
places); `/how` primary **how Kheelu works** (three modes, WiFi, what the parent sees). Neither has
volume data. `/faq` is typed by people today (it 308s to `/products/kheelu#faq`,
[url map §4b](../site/url-map.md)).

### 4.3 Overlap and cannibalisation flags

**No-shared-primaries check: passed.** The 35 primaries above (plus the two G8 pages and the one new
page) are all different phrases. Four overlaps of **intent** remain, ranked:

| Risk | Pages | Why | Recommendation |
|---|---|---|---|
| **High** | `/safety` (are AI toys safe) · `/ai-toys-for-kids-in-india` (how to choose) · `/stories/what-to-look-for-in-a-safe-ai-toy` (what to look for) · `/stories/questions-parents-ask-about-ai-toys` (does it record) | The guide and the article both carry "five checks"; the article's meta asks "Are AI toys safe for a three-year-old?", which is `/safety`'s primary | **Merge the article into the guide** with a one-hop 301, keeping its Common Sense Media and Fairplay section and sources as an H2 there (open question SV-3). If kept, it must drop the five-check list and own only "what child-safety groups say about AI toys" |
| **Medium** | `/stories/talking-late-or-talking-little` (3 and 4) · `/stories/talking-toys-and-late-talkers` (a two-year-old) | One worry, two pages; one framed under 3 (G5) | If G5 retires the under-3 framing, 301 the second into the first (SV-4) |
| **Medium** | `/stories/learning-toys-for-a-three-year-old` · `/stories/brain-development-toys-for-a-2-year-old` | Same buying intent (marketplace results overlap); one is under 3 | If G5 retires under-3 articles, 301 the second into the first, which then carries "brain development toys for a 3-year-old" as an H2 (SV-4) |
| **Low** | `/` and `/products/kheelu` on brand queries | Both carry "Kheelu" | Accepted: brand results showing both pages help. Home's descriptor must not be "talks back" ([4.1](#41-marketing-pages-13), SV-2) |

Lower still, and acceptable with the distinct primaries above: the three screen-habit articles
(reduce, tantrums, activities) and the two brain articles (why the early years, how to develop).

### 4.4 New pages: proposed and rejected

| Candidate | Evidence | Verdict |
|---|---|---|
| **`/stories/learning-toys-for-4-to-7-year-olds`** (one page, an H2 per age 4, 5, 6, 7) | Trends puts "educational toys for 5 year old" (10) and "for 4 year olds" (8) level with "for 3 year olds" (9) in the same comparison, and age 3 measures KP 1k-10k; autocomplete completes every age 4 to 7; Amazon.in shoppers type "4+ year old"; no existing page targets 4 to 7, and the band is 3 to 7 | **Propose, conditional on C11**: build it if the export shows 100 or more a month for any single-age phrase from 4 to 7 (SV-5). Kheelu-specific lines wait on F9 |
| A separate "brain development toys for a 3-year-old" page | KP 1k-10k for the head only; demand baby-first; overlaps BUY-1 | **Rejected for now**: fold into the 3-year-old article (4.3); revisit if C11 shows the age-3 form above 1k on its own |
| A gift page (gift for N year old) | Autocomplete only; queries are capped at ₹200-₹500 | **Rejected**: gift phrases go in the product page FAQ and the 4-7 page |
| A story-box comparison page | Amazon badges show story players sell; no volume data | **Rejected**: covered by `screen-free-does-not-mean-silent` (secondary CMP-5) |
| Competitor "vs" or "alternative" pages | Real demand for one competitor's price and reviews | **Not this map's call**: naming competitors is a Gate A question; banned today |
| `/kheelu` (the product's own name) | 404 today; guessable | A redirect, not a page: G8 |

## 5. Placement rules

### 5.1 Rules for every page

1. **Title** (60 characters or fewer, counting " · Kheelona"): the primary term near the start.
   Brand last unless the page is a brand page. No count of anything ("12 questions"): counts in copy
   go stale.
2. **H1**: the primary term, or its question form for an article ("How much screen time for a
   3-year-old?"). One H1.
3. **First ~100 words**: the primary term inside an answer-first block (a question-shaped heading,
   then a 40 to 60 word answer; brief 9.3). The age band "3 to 7" appears once in the first screen on
   commercial pages.
4. **At least one H2**: the primary or a close variant; on age pages, one H2 per single age.
5. **Meta description** (155 or fewer): the primary term, one concrete fact, and on commercial pages
   the price line rendered from config ([pricing](../product/pricing.md)). Titles, metas, schema,
   `llms.txt` and ads lead with **₹4,999 (incl. GST)** and give the advance second, so no engine reads
   ₹499 as the price ([D028](../decisions/D028-price-wording.md)). Only the line next to the CTA
   leads with ₹499, with the ₹4,999 total in the same sentence.
6. **Alt text**: describe the image; include the primary only where it is true of the picture (for
   example, the hero plush: "Kheelu, the cream plush rabbit that talks back"). Never stuff.
7. **Density**: optimise for intent and coverage, then check. Primary term 0.5% to 2% of the words in
   `<main>`; flag anything above 2% and rewrite above 3%. The same applies to the product name.
8. **Words never placed as keywords**: health terms (speech delay, autism, therapy) on commercial
   pages or beside the product (learn articles may name a worry parents type, with public sources,
   [D025](../decisions/D025-speech-and-language.md)); "best friend", "tutor" or "teacher" for Kheelu;
   "brain-development toy" as Kheelu's label, and any promise that Kheelu grows or develops the brain
   ("brain development" is a topic only, [D016](../decisions/D016-brain-wording.md)); "lessons" and
   any interrupt-a-story feature ([D027](../decisions/D027-story-mode-wording.md)); emotion or mood
   reading and "adapts" (R5); competitor names; "free for life"; every wake-word line, the retired
   microphone wording included ([D018](../decisions/D018-wake-up-button.md),
   [claims §4.1](../product/claims.md#41-the-retired-microphone-wording)); "only our own servers"
   and "Nothing rented that matters" ([D019](../decisions/D019-voice-providers.md)).
9. **Hyphens**: "3-year-old" and "3 year old" are the same words to search engines; use correct
   en-IN grammar ("a 3-year-old", "3 to 7 year olds"); the button is the "wake-up button" (D018).
10. **Disclaimers are copy, not keywords**: the speech line ("Kheelu is a toy, not a therapy or
   treatment...") sits on `/products/kheelu` and `/terms` only, never on Home; journal articles about
   speech delay keep their own one-line disclaimer ([D025](../decisions/D025-speech-and-language.md)).
   Speech and language questions therefore never go in Home's FAQ.

### 5.2 Per page

Title drafts show where the term goes; the Copywriter owns the words. Character counts include
" · Kheelona".

| URL | Title draft (chars) | H1 carries | An H2 carries | Meta carries | Alt text |
|---|---|---|---|---|---|
| `/` | "Kheelu by Kheelona: a screen-free plush toy that talks" (54). The "brain-development toy" variant is out ([D016](../decisions/D016-brain-wording.md)) | "Kheelu" | "What is Kheelu?" | "Kheelu by Kheelona", ages 3 to 7, ₹4,999 line | hero plush: "Kheelu, the cream plush rabbit from Kheelona" |
| `/products/kheelu` | "Kheelu, the toy that talks back, for ages 3 to 7 · Kheelona" (59) | "talks back" | "A toy that talks back, not a toy that repeats" | "toy that talks back", ₹4,999 line | "Kheelu, the cream plush rabbit that talks back" |
| `/safety` | "Are AI toys safe? How Kheelu answers each check · Kheelona" (58) | "Are AI toys safe?" | "Is Kheelu safe for my child?" | "are AI toys safe", no camera | the calm plush image, no keyword |
| `/ai-toys-for-kids-in-india` | keep "AI toys for kids in India: how to choose one · Kheelona" (55) | as live | "AI robot or AI plush?" | fix "3 to 5" to 3 to 7 | as live |
| `/playos` | "PlayOS: the platform inside Kheelu · Kheelona" (45) | "PlayOS" | (G8) | "PlayOS" | as live |
| `/stories` | "Parenting guides for ages 3 to 7 · Kheelona" (43) | "parenting guides" | one per topic group | "parenting guides" | none |
| `/team` | "Kheelona founders: the team behind Kheelu" (41) | "founders" | "The founders" | "Kheelona", three co-founders | names as live, minus the removed bio |
| `/setup` | "How to set up Kheelu on day one · Kheelona" (42) | "set up" | each step | "set up Kheelu" | as live |
| `/contact` | "Contact Kheelona: WhatsApp and email support" (44) | "Contact" | "WhatsApp (call or message) or email" ([D032](../decisions/D032-grievance-block-and-call-line.md)) | WhatsApp, email | none |
| `/privacy` | "Kheelona privacy policy, in plain words" (39) | "Privacy" | as live | "privacy policy" | none |
| `/terms` | "Kheelu pre-order terms · Kheelona" (33) | "pre-order terms" | as live | "pre-order terms" | none |
| `/refund` | "Kheelu returns, refunds and warranty · Kheelona" (47) | "Refunds" | "7-day returns, no questions asked" ([D021](../decisions/D021-returns-policy.md)) | "refund", 7-day returns, 6-month warranty | none |
| `/shipping` | "Kheelu shipping and delivery in India · Kheelona" (48) | "Shipping" | "Where we deliver" | "delivery in India" | none |
| `why-three-to-six-…` | "Why the early years matter most for a child · Kheelona" (54) | "early years" | "What fills the early years" | "early years" | as live |
| `screen-free-does-not-mean-silent` | "Screen-free toys that still talk with your child · Kheelona" (59) | "Screen-free toys" | "Story box or a toy that talks back?" | "screen-free toys" | the blanket fort: add "screen-free play" only if true |
| `how-children-learn-by-talking` | "Serve and return: how children learn by talking · Kheelona" (58) | "serve and return" | "What is serve and return?" | "serve and return" | as live |
| `what-to-look-for-in-a-safe-ai-toy` | "What to look for in a safe AI toy: five checks · Kheelona" (57), or merge (SV-3) | as live | "What child-safety groups say" | "safe AI toy" | as live |
| `how-much-screen-time-…` | "Screen time for a 3-year-old, and up to age 7 · Kheelona" (56) | "screen time for a 3-year-old" | one H2 per age 3, 4, 5, 6, 7 | "screen time for a 3-year-old" | as live |
| `screen-time-and-tantrums` | "Screen time tantrums: why they happen, what helps · Kheelona" (60) | as live | "Why the meltdown comes at the off switch" | "screen time tantrums" | as live |
| `the-gentle-way-off-the-phone` | "How to reduce screen time: a gentle 7-day plan · Kheelona" (57) | "reduce screen time" | "Day one" | "reduce screen time" (already) | as live |
| `how-to-get-your-child-talking` | "How to get your child to talk more · Kheelona" (45) | "talk more" | "Games that get a child talking" | "talk more" | as live |
| `talking-late-or-talking-little` | "3-year-old not talking in sentences? What to do · Kheelona" (58) | "not talking in sentences" | "When to ask a professional" | same | as live |
| `what-actually-builds-a-sharp-brain` | "How to help your child's brain develop · Kheelona" (49) | "brain develop" | "Conversation, sleep, play and calm" | same | as live |
| `how-children-collect-words` | "How to build a 3-year-old's vocabulary · Kheelona" (49) | "vocabulary" | "Any language counts" | "vocabulary" (already) | as live |
| `raising-a-bilingual-child-in-india` | keep (45) | as live | as live | as live | as live |
| `should-kids-use-ai` | "Should kids use AI? An honest answer · Kheelona" (47) | as live | "How do you judge anything with AI inside?" | as live | as live |
| `busy-hands-no-screens` | "Screen-free activities for kids at home · Kheelona" (50) | "Screen-free activities" | "Ten-second setups" | same | as live |
| `does-a-three-year-old-need-an-ai-tutor` | "Does a 3-year-old need an AI tutor? · Kheelona" (46) | as live | "What to look for instead" | as live | as live |
| `a-toy-that-talks-vs-…` | "Toys for language development: talk or listen? · Kheelona" (57) | "language development" | "What listening does for language" | same | as live |
| `screen-time-rules-parents-swear-by` (**removed**, [D053](../decisions/D053-remove-the-3-6-9-12-article.md)) | "The 3-6-9-12 rule and other screen-time rules · Kheelona" (56) | as live | as live | as live | as live |
| `talking-toys-and-late-talkers` | G5 first; if kept, "Late talker? What helps a child find their words · Kheelona" (59) | as live | as live | drop "two-year-old" if re-aged | as live |
| `brain-development-toys-for-a-2-year-old` | G5 first (recommended 301) | n/a | n/a | n/a | n/a |
| `learning-toys-for-a-three-year-old` | "Learning toys for a 3-year-old, skill by skill · Kheelona" (57) | as live | "Brain development toys for a 3-year-old: what the label means" | "learning toys for a 3-year-old" | add one, with the toy named |
| `questions-parents-ask-about-ai-toys` | "Does an AI toy record your child? Hard questions · Kheelona" (59) | "record" | "Does it record everything my child says?" (already) | "record" | none |
| `ai-toys-and-indias-data-law` | "DPDP Act: what India's data law asks of AI toys · Kheelona" (58) | "DPDP Act" | "Consent has to come from you" | "DPDP Act" | none |
| NEW `learning-toys-for-4-to-7-year-olds` | "Learning toys for 4 to 7 year olds, age by age · Kheelona" (57) | the four ages | one H2 per age 4, 5, 6, 7 | ages 4 to 7 | one per age |
| `/faq` (G8) | "Kheelu questions: price, age, WiFi, delivery · Kheelona" (55) | "Kheelu questions" | one per question | price line | none |
| `/how` (G8) | "How Kheelu works: three modes, one toy · Kheelona" (49) | "How Kheelu works" | one per mode | modes | per mode |

### 5.3 Current density on the live pages

**Density source: [raw/qa/2026-10-10/html/](../raw/qa/2026-10-10/html/)**, the QA baseline's
server-HTML snapshots of all 35 sitemap URLs (2026-10-11 02:47-02:50 UTC, the evening of 2026-10-10 in
California; [QA baseline](../qa/baseline-2026-10-10.md)), text inside `<main>` only (scripts, styles,
SVG and templates removed). Re-parsed on 2026-10-11 with the same parser and patterns; every figure
below matched the first run on a separate GET of the same 35 URLs at 02:58-03:01 UTC (every response
200), so the table cites the QA capture, which is in the wiki. **Density = occurrences x words in the term / words in `<main>`
x 100.** Matching is case-insensitive by regular expression; the primary patterns are the ones in the
[raw placement capture §4](../raw/research/serp/onpage-keyword-placement-2026-10-10.md), except
`/products/kheelu` (`\btoys? that talks? back\b`, 4 words) and `/team` (`\b(co-)?founders?\b`).
"Head" is a looser pattern reported so a near miss shows. This is a baseline: the reset rewrites
every page.

| URL | Primary | Title | Meta | H1 | H2 | First 100 | Alt | Occ. | Words | Density % | Head: occ. (%) | "Kheelu" % | Flag |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Kheelu (brand) | yes | no | no | yes | yes | yes | 63 | 1942 | **3.24** | Kheelona 6 (0.31) | 3.24 | **over 3%: rewrite** |
| `/products/kheelu` | toys that talk back | no | no | no | no | no | no | 0 | 1937 | 0.0 | talks / answers back 1 (0.05) | **3.46** | primary absent; Kheelu over 3% |
| `/safety` | are AI toys safe | yes | no | no | yes | yes | no | 1 | 1033 | 0.39 | 1 (0.1) | 2.61 | Kheelu over 2% |
| `/ai-toys-for-kids-in-india` | AI toys for kids | yes | no | yes | no | yes | no | 1 | 1559 | 0.26 | AI toy(s) 8 (0.51) | 1.54 | - |
| `/playos` | PlayOS | yes | no | no | no | yes | no | 4 | 587 | 0.68 | platform 2 (0.34) | 1.36 | - |
| `/stories` | parenting guides | no | no | no | no | no | no | 0 | 902 | 0.0 | stories 1 (0.11) | 0.67 | primary absent |
| `/team` | Kheelona founders | no | no | no | no | no | yes | 4 | 684 | 0.58 | team 0 (0.0) | 1.17 | - |
| `/setup` | set up Kheelu | yes | no | no | no | no | no | 0 | 239 | 0.0 | Kheelu 11 (4.6) | **4.6** | primary absent; **Kheelu over 3%** |
| `/contact` | contact Kheelona | yes | no | no | no | yes | no | 1 | 389 | 0.26 | WhatsApp 5 (1.29) | 2.06 | Kheelu over 2% (mild) |
| `/privacy` | privacy policy | yes | no | yes | no | yes | no | 2 | 1708 | 0.12 | data 3 (0.18) | 0.64 | - |
| `/terms` | pre-order terms | no | no | yes | no | yes | no | 1 | 749 | 0.27 | terms 3 (0.4) | 2.14 | Kheelu over 2% (mild) |
| `/refund` | refund | yes | yes | yes | no | yes | no | 7 | 579 | 1.21 | cancel 4 (0.69) | 2.07 | Kheelu over 2% (mild) |
| `/shipping` | shipping, delivery | yes | yes | yes | yes | yes | no | 5 | 513 | 0.97 | deliver 4 (0.78) | 2.34 | Kheelu over 2% (mild) |
| `why-three-to-six-…` | early years | yes | no | yes | no | yes | no | 2 | 492 | 0.81 | brain 3 (0.61) | 1.63 | - |
| `screen-free-does-not-mean-silent` | screen-free toys | no | no | no | no | no | no | 0 | 448 | 0.0 | screen-free 8 (1.79) | 1.79 | primary absent |
| `how-children-learn-by-talking` | serve and return | no | no | no | no | yes | no | 2 | 448 | 1.34 | conversation 0 (0.0) | 1.79 | - |
| `what-to-look-for-in-a-safe-ai-toy` | safe AI toy | yes | no | yes | no | yes | no | 2 | 1146 | 0.52 | AI toy(s) 10 (0.87) | 0.87 | - |
| `how-much-screen-time-…` | screen time for a 3-year-old | no | no | no | no | no | no | 0 | 1003 | 0.0 | screen time 6 (0.6) | 0.8 | primary absent |
| `screen-time-and-tantrums` | screen time tantrums | yes | no | yes | no | yes | no | 2 | 488 | 1.23 | tantrum(s) 3 (0.61) | 1.43 | - |
| `the-gentle-way-off-the-phone` | reduce screen time | no | yes | no | no | no | no | 0 | 515 | 0.0 | phone 7 (1.36) | 1.36 | absent from body |
| `how-to-get-your-child-talking` | get your child to talk | yes | no | yes | no | yes | no | 1 | 499 | 0.8 | talk* 6 (1.2) | 1.6 | - |
| `talking-late-or-talking-little` | not talking (in sentences) | no | no | no | no | no | no | 0 | 507 | 0.0 | talk* 11 (2.17) | 1.38 | primary absent |
| `what-actually-builds-a-sharp-brain` | develop a child's brain | no | no | no | no | no | no | 2 | 491 | 0.81 | brain 7 (1.43) | 1.43 | - |
| `how-children-collect-words` | vocabulary | no | yes | no | no | no | no | 1 | 454 | 0.22 | word(s) 18 (3.96) | 1.54 | "word(s)" high but it is the topic; vary |
| `raising-a-bilingual-child-in-india` | bilingual child | yes | no | yes | no | yes | no | 4 | 1009 | 0.79 | bilingual 5 (0.5) | 0.79 | - |
| `should-kids-use-ai` | should kids use AI | yes | yes | yes | no | yes | no | 2 | 1131 | 0.71 | AI 23 (2.03) | 0.8 | - |
| `busy-hands-no-screens` | screen-free activities | no | no | no | no | no | no | 0 | 496 | 0.0 | activit* 1 (0.2) | 1.41 | primary absent |
| `does-a-three-year-old-need-an-ai-tutor` | AI tutor | yes | yes | yes | no | yes | no | 4 | 627 | 1.28 | tutor* 10 (1.59) | 1.28 | - |
| `a-toy-that-talks-vs-…` | language development | no | no | no | no | no | no | 0 | 1005 | 0.0 | talk* 15 (1.49) | 0.9 | primary absent |
| `screen-time-rules-parents-swear-by` | 3-6-9-12 rule | yes | yes | yes | yes | yes | no | 6 | 1085 | 0.55 | rule(s) 17 (1.57) | 0.74 | - |
| `talking-toys-and-late-talkers` | late talker | yes | no | yes | no | yes | no | 1 | 687 | 0.29 | talk* 9 (1.31) | 1.46 | - |
| `brain-development-toys-for-a-2-year-old` | brain development toys | yes | no | yes | no | yes | no | 1 | 559 | 0.54 | brain 5 (0.89) | 1.97 | - |
| `learning-toys-for-a-three-year-old` | learning toys for a 3-year-old | yes | no | yes | no | yes | no | 1 | 985 | 0.61 | learning / educational toy(s) 1 (0.1) | 0.81 | - |
| `questions-parents-ask-about-ai-toys` | does an AI toy record | no | no | no | yes | no | no | 2 | 1055 | 0.19 | AI toy(s) 4 (0.38) | 1.04 | - |
| `ai-toys-and-indias-data-law` | DPDP Act | no | no | no | no | yes | no | 3 | 867 | 0.35 | data 9 (1.04) | 0.81 | - |

**Reading.** Nothing is stuffed with a category term: the highest primary density outside Home is
1.34%. The problem is the opposite. The primary is in **20 of 35 titles, 7 meta descriptions, 16
H1s, 5 H2s, 22 first-100-word blocks and 2 alt texts**, and absent altogether from 9 pages. Only
`/shipping` and the 3-6-9-12 article carry it in title, meta, H1, an H2 and the first 100 words. The
one repetition problem is the **product name**: "Kheelu" passes 3% on Home, the product page and
`/setup`, and 2% on five more. On the new site, use "it" and "your child's Kheelu" more often, and
keep "Kheelu" under 2%.

## 6. Question bank: answer-first drafts

Each draft is 40 to 60 words, counted with bracketed markers removed (all 59). Every draft speaks
to parents of 3 to 7 year olds and to family buying for them, and to no one else (R9,
[open questions](../open-questions.md) section F). Final wording is the founder's sign-off at Gate A
([D015](../decisions/D015-founder-signs-off-copy.md)).

**Facts come only from** EXTERNAL rows of [facts](../product/facts.md), [pricing](../product/pricing.md),
[policies](../product/policies.md) and the CONFIRMED rows of
[claims](../product/claims.md#1-confirmed-by-the-founder) (no camera; says it is a toy; never asks a
child to keep a secret), **plus the founder's rulings of 2026-10-10/11, cited here by decision while
those owner pages are being updated**:

| Topic | Ruling the drafts follow | Decision |
|---|---|---|
| Brain | Conversation helps a young brain grow and Kheelu gives a child more of it; "brain development" only as a topic | [D016](../decisions/D016-brain-wording.md) |
| Behaviour | Answers, then asks a question back; cannot browse the internet; parents read every conversation; one-tap delete. The other live rows are now ruled by the claims owner ([claims §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)): "switches languages mid-sentence" EXTERNAL; "no wheels, no face screen and no moving parts", the closed library and the age-graded safety layer EXTERNAL with a Gate A flag (the wake-up button; D019's outside providers). Confirmed for launch: weekly four-skills report, remembers earlier conversations, says when it doesn't know, parent alerts, curated closed content library, age-graded safety layer set to the age a parent enters in the app, red-teamed before launch, new-word count. The "adapts" family ("grows with your child", "at your child's pace") is BANNED | [D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D036](../decisions/D036-launch-feature-claims.md) |
| Listening | No wake word; the microphone turns on only when someone presses the wake-up button, stays on through the conversation, switches itself off after about a minute of quiet; a light shows while it listens. No "no risk" absolutes, no hardware-disconnect claim | [D018](../decisions/D018-wake-up-button.md) |
| Voice and data | Trusted speech and AI providers, on servers in India, process voice only to produce the reply, keep nothing, never train on it, by contract; we don't sell your data; transcripts kept 36 months, then deleted automatically; one-tap delete sooner. Kheelona's own model trains on voice and transcripts by default, parents can opt out: stated on `/terms` and `/privacy` only (P1), never on customer pages, which also never imply there is no training. Never used to advertise to your child | [D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md), [D035](../decisions/D035-model-training-opt-out.md), [D038](../decisions/D038-trust-content-rulings.md) |
| Returns, warranty | 7-day returns, no questions asked (opened is fine if undamaged and complete with the box); 6-month warranty on manufacturing defects (not drops, water, misuse); faulty on arrival replaced if reported within 7 days of receipt; after day 7, repaired, or replaced if the repair fails; free pickup; refund within 7 working days of the unit reaching us if eligible; faulty or not as described: replacement or full refund; no timelines published | [D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md), [D033](../decisions/D033-warranty-after-day-7.md) |
| Delivery | New orders: same ₹499 advance, deliveries start mid-November 2026 (one content value; Product JSON-LD `availabilityStarts` 2026-11-15). Production keeps "20 October 2026" until Gate B, an accepted risk | [D023](../decisions/D023-new-order-delivery.md), [D037](../decisions/D037-delivery-date-in-schema.md), [D011](../decisions/D011-production-held-until-gate-b.md) |
| Payment | UPI, debit and credit cards, net banking (nothing else is mentioned); prices include GST; a GST invoice with every order | [D024](../decisions/D024-payment-methods-gst.md) |
| Speech | Public sources only, never an outcome claim for Kheelu; the disclaimer sits on `/terms` and `/products/kheelu`, not Home | [D025](../decisions/D025-speech-and-language.md) |
| Statistics | A figure ships only after independent verification against its original source, with a linked marker | [D026](../decisions/D026-public-statistics.md) |
| Story mode, Kheelona+ | Stories, poems and jingles; no "lessons"; no interrupt-and-ask feature; the new Kheelona+ line | [D027](../decisions/D027-story-mode-wording.md) |
| Price | These drafts feed FAQPage JSON-LD, which machines read, so every price statement leads with ₹4,999 (incl. GST) and the advance comes second, with "refundable" beside it | [D028](../decisions/D028-price-wording.md) |
| Complaints | Grievance officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483; complaints acknowledged within 48 hours and resolved within one month. The WhatsApp number takes calls on the new site, so "messages only" goes | [D029](../decisions/D029-grievance-officer-legal-review.md), [D032](../decisions/D032-grievance-block-and-call-line.md) |
| Origin, MRP | Made in India; manufacturer Kheelona Robotics Pvt Ltd; MRP ₹7,999 (incl. of all taxes) | [D034](../decisions/D034-origin-manufacturer-mrp.md) |
| Trust content | No advisor; no demo venue; no pilot-results promise; recognition and team bios only once proof is filed; "It asks. They think." usable; Kheelona+ after the 6 months is undecided (only the sanctioned line); BIS licence under application, so no BIS claim | [D038](../decisions/D038-trust-content-rulings.md), [claims §6](../product/claims.md#6-certifications) |
| Entity | "Kheelona India" (cradle mobiles) is not connected to Kheelona Robotics | [D039](../decisions/D039-repo-and-setup-answers.md) |
| Emotion | "The feeling gets read", mood reading and "maps emotions" are banned, like "adapts" | R5 ([open questions](../open-questions.md) F) |

Founder-drafted lines from the decisions are kept verbatim, contractions included. Research is
cited only in its anchored form
([claims §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)): Harvard's "serve
and return" with its caring adult, Romeo et al. 2018 with its ages of about 4 to 6. Markers:

- `[PLACEHOLDER ID: …]`: a fact, claim or ruling the founder or SKM owes, with its
  [open-questions](../open-questions.md) ID. The copy around it reads correctly once it is filled or
  cut.
- `[CITE: …]`: a public source (WHO, AAP, IAP, NEP, DPDP Act, Tisseron, a provider's terms) the
  Copywriter reads at source and links on the page before use (content boundary, "Public research").
  **Any figure** under a CITE also passes [D026](../decisions/D026-public-statistics.md): checked against
  its original source in [source verification](source-verification.md) (finished 2026-10-11: SUPPORTED or
  SUPPORTED-WITH-REWORDING rows, in their verified wording only) and shown with a superscript marker
  linking to it.

Prices and the delivery date render from one content source, never hand-typed: price lines are the
token-mode wording and change at sell-out ([pricing](../product/pricing.md), G9); "mid-November
2026" is the D023 value. Question IDs follow the
[raw bank](../raw/research/geo/question-bank-2026-10-10.md); B12, AI7, AI8, AT1, BD1, BD2, EY1, LT4,
LT5, SF1, SB1, SH1, SR1, SR2, ST6, V1, C1, P1 and DP1 were new in Phase 1, and AL1, VP1, RT1, W1, PM1
and SP1 are new on 2026-10-11. Every question was seen in the source named, unless marked "inferred".

### 6.1 Home `/`

**B1. What is Kheelu?** (brand · learn; Bing and WebSearch probes; 66 ChatGPT landings on `/`) · 60 words
> Kheelu is a screen-free plush toy from Kheelona, a Bengaluru company, for children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home WiFi, Story mode for stories, poems and jingles with no WiFi needed, and Bluetooth mode, which makes it a speaker for your phone.

**B2. Is Kheelu the same as Lumi?** (brand; Bing rewrote "Kheelona Lumi toy" to "Khilona"; GSC ~1,050 "Lumi" impressions; both app listings still say Lumi) · 48 words
> Yes. Kheelu is the toy that was called Lumi until 5 September 2026: the same product with a new name. Some older app-store listings and directory pages still say Lumi. Toys sold under the name Lumi by other companies are different products, and Kheelona does not make them.

**B12. Is Kheelu a robot?** (brand; LinkedIn "Robotic brand"; Perplexity "talking robot companion", 2026-09-11) · 56 words
> No. Kheelu is a soft, cream plush rabbit that talks, not a robot. It has no screen, no camera, no wheels and no moving parts. Your child talks to it like a favourite toy, and Kheelu answers, then asks a question back. It also tells stories, and it can play your music over Bluetooth.

*"No moving parts": EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) with a Gate A flag: it sits beside the physical wake-up button ([claims §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)).*

### 6.2 Product page `/products/kheelu` (or `/faq`, if G8 makes it a page)

**B3. How much does Kheelu cost in India?** (buy; Bing's AI summary said "priced at ₹499") · 57 words
> ₹4,999 including GST, for the first 500 units, with delivery anywhere in India included. A refundable ₹499 advance reserves one today, and the remaining ₹4,500 is due before delivery. Once those 500 are gone, Kheelu is ₹7,999, paid in full. You can pay by UPI, card or net banking, and every order comes with a GST invoice.

**B4. What ages is Kheelu for?** (buy; off-site sources say 3+, 4+ and 2 to 8) · 47 words
> Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If you are choosing for a two-year-old, wait until they turn 3. Your child can talk with it in English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish or French. [PLACEHOLDER F9: what Kheelu offers at 3, 5 and 7, signed off by the advisor.] [PLACEHOLDER F4: toy-safety age grading and any required warnings.] [PLACEHOLDER G5: whether a grown-up stays nearby at 3.]

**B5. Does Kheelu need Wi-Fi or the internet?** (buy; competitor FAQs; live Home FAQ) · 49 words
> Only for open conversation. AI mode runs on your home Wi-Fi, and Kheelu cannot browse the internet. Story mode's stories, poems and jingles need no Wi-Fi, and Bluetooth mode needs only a paired phone, so Kheelu still plays on a train or at a grandparent's home with no WiFi.

**B6. Does Kheelu need a subscription?** (buy; Bing's AI summary invented "a lifetime subscription to Kheelona+") · 51 words
> Not to keep it working. Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. Kheelu's smart features keep working for life, with no subscription needed. Kheelona+ pricing will be announced soon. So Kheelona+ is included for 6 months; it is not a lifetime subscription. [PLACEHOLDER F7: what a family keeps after the 6 months, beyond the smart features.]

The middle three sentences are the new Kheelona+ line, verbatim
([D027](../decisions/D027-story-mode-wording.md)): it replaces the live `KHEELONA_PLUS_LINE` on the
new site (owner: [facts](../product/facts.md#kheelona)), and "keep working for life, with no
subscription needed" cannot be read as a free lifetime subscription, which closes SV-6.

**B7. Which languages does Kheelu speak?** (buy; competitor pages lead with language counts) · 47 words
> English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French are named today, with up to 10 languages at launch. So your child can talk with Kheelu in the language a grandparent speaks at home and in the English they hear at school. It can switch languages mid-sentence.

**B8. When will I get Kheelu?** (buy; brief 9.1, delivery next to the CTA) · 56 words
> Deliveries for new orders start in mid-November 2026, and pre-orders are served first, in the order they were placed. Kheelu is ₹4,999 including GST; if you reserve with the refundable ₹499 advance, the remaining ₹4,500 is due before delivery. Delivery anywhere in India is included, and you get a tracking link when your Kheelu leaves us.

**TT2. What is the difference between a talking toy and a toy that talks back?** (compare; AC "toys that talk back to kids", "ai toys that talk back"; KP 100-1k) · 57 words
> Most talking toys play fixed phrases or repeat what your child says. A toy that talks back listens and gives a new answer each time, so your child can ask why and answer a question in return. Kheelu is a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back.

**TT3. Is Kheelu OK for my 2-year-old?** (age guard; AC "talking toy for baby", Bing "talking toys for toddlers 1-3") · 50 words
> No. Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. [PLACEHOLDER F4: toy-safety age grading and required warnings.] For a two-year-old, research points to everyday talk with a caring adult: talking, reading and singing with you, and waiting for them to answer (Harvard Center on the Developing Child).

**G1. Is Kheelu a good birthday gift for a 4 or 5-year-old?** (gift; AC "birthday gift for 5 year old boy", "gift for 4 year old girl") · 59 words
> Yes, if you want a gift that talks back instead of a screen. Kheelu is a screen-free plush toy for ages 3 to 7 that answers your child, asks a question back and plays stories, poems and jingles. It costs ₹4,999 including GST and delivery, with 7-day returns, no questions asked. Deliveries for new orders start in mid-November 2026.

**G2. Will Kheelu arrive in time for Diwali?** (gift; inferred from seasonal gift articles and AC "diwali gift for kids") · 60 words
> We cannot promise a delivery date. Deliveries for new orders start in mid-November 2026, and pre-orders are served in the order they were placed, so check that against your festival plans. If you need Kheelu by a date, message us on WhatsApp (messages only) or email hello@kheelona.com before you reserve. Everything you pay is refundable in full until we dispatch.

**PM1. How can I pay for Kheelu?** (buy; inferred from brief 9.1 and E-Commerce Rules 7(1)(c), which put payment methods next to the CTA) · 57 words
> Online, on store.kheelona.com, by UPI, debit or credit card, or net banking. Kheelu is ₹4,999 including GST: a refundable ₹499 advance reserves it, and the remaining ₹4,500 is due before delivery. Every order comes with a GST invoice. Razorpay takes the payment, so your card number, UPI ID and bank details go to them, not to us.

**SP1. Can Kheelu help my child's speech?** (product page only, beside the D025 disclaimer; inferred from AC "speech development toys for 3 / 4 year olds", "toys for speech delay" and G14) · 58 words
> Kheelu is a toy, not a therapy or treatment. Research links back-and-forth conversation with a caring adult to young children's language development (Harvard Center on the Developing Child; Romeo et al. 2018, children aged about 4 to 6), and Kheelu gives your child more conversation, alongside yours. If you're worried about your child's speech, talk to your paediatrician.

### 6.3 Safety `/safety`

**AI1. Are AI toys safe for kids?** (compare; AC "are ai toys safe for kids"; KP 10-100, rising) · 54 words
> Not all of them, so check before you buy. Ask whether the toy has a camera, when its microphone listens, where your child's voice goes, whether it can reach the open internet, and whether you can read and delete every conversation. A toy that answers all five plainly, in writing, is easier to trust. [PLACEHOLDER G5: how the site cites Common Sense Media's January 2026 advice on AI toys for children aged 5 and under.]

**AI2. Is Kheelu safe for my child?** (buy; Bing "Is Kheelu safe for kids" found nothing about us; block order per D020: button and light, the full providers line, read and delete, no sale) · 57-word answer, then 47 words of detail (the full D020 line is verbatim, so the block runs past 60)
> Kheelu's microphone turns on only when someone presses its wake-up button, and a light shows while it listens. To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI.
>
> Our contracts with them say so. You can read and delete every conversation in the parent app. We don't sell your data. Kheelu has no camera and always says it is a toy. Its toy-safety (BIS) licence has been applied for and is not yet granted.

**AL1. Is Kheelu always listening?** (trust; a `/safety` secondary in 4.1; the FAQ D018 drafts, kept verbatim with its light line) · 56 words
> No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after about a minute of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it's listening.

**VP1. Where does my child's voice go?** (trust; a `/safety` secondary in 4.1; the check AI1 and AI7 tell parents to make; D020's line, verbatim) · 51 words
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so. We don't sell your data.

**AI6. Will my child think an AI toy is a person?** (learn; Common Sense Media press release, 22 Jan 2026; AC "do ai robots have feelings") · 58 words
> It can happen, so choose a toy that says plainly what it is. Kheelu tells your child it is a toy, and it never asks a child to keep a secret from a parent. Talk about Kheelu together the way you would about a character in a book, and keep play in the rooms where the family is.

**B11. Does Kheelu have a camera?** (trust; engines mix Kheelu with the sister site's camera products) · 57 words
> No. Kheelu has no camera and no screen, so it cannot see your child or your home. Its microphone turns on only when someone presses the wake-up button. Some smart toys and robots do carry cameras, so before you buy any connected toy, ask what it can see, when it listens and where your child's voice goes.

### 6.4 Buyer's guide `/ai-toys-for-kids-in-india`

**AI7. What should I check before buying an AI toy in India?** (compare; the legacy answer-engine prompt "best AI toy for a 4 year old in India") · 60 words
> Check five things before you pay. Does it have a screen or a camera? When does its microphone listen, and where does your child's voice go? Can it reach the open internet? Does it speak the languages your family speaks? Can you read and delete every conversation? A good AI toy for a 3 to 7-year-old answers all five plainly.

**AI8. AI robot or AI plush: which suits a young child?** (compare; AC "ai robot for kids india"; KP 100-1k "ai robot toy") · 60 words
> It depends on what you want your child to do. A robot toy with a screen often shows faces, games and videos, so your child watches. A plush toy that talks has no screen, so your child talks and listens instead. Kheelu is a plush rabbit, not a robot, for ages 3 to 7, with no screen and no camera.

### 6.5 AI and safety articles

**AI4. Can an AI toy say something inappropriate to my child?** (`what-to-look-for-in-a-safe-ai-toy`; Quora; a Bing news result on an AI teddy bear) · 62 words
> It can happen with any toy that makes up its own answers, so ask how the maker filters replies and test it yourself before your child does. Kheelu cannot browse the internet. Its answers come from a curated, closed content library, every reply passes an age-graded safety layer set to the age you enter in the parent app, and you can read every conversation. [PLACEHOLDER G5: Common Sense Media's January 2026 test finding.]

*Closed library and age-graded layer: EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D036](../decisions/D036-launch-feature-claims.md)) with a Gate A flag: beside D019's outside AI providers they must not suggest that no outside AI model is involved ([claims §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)).*

**AI3. Does an AI toy record everything my child says?** (`questions-parents-ask-about-ai-toys`; Common Sense Media and Fairplay guides) · 59 words
> Some do, so ask when the microphone listens and what happens to what it hears. Kheelu has no wake word: its microphone turns on only when someone presses the wake-up button, and it switches itself off after about a minute of quiet. Conversations stay in your parent app for 36 months, unless you delete them sooner, in one tap.

**DP1. What does India's data law say about children's data?** (`ai-toys-and-indias-data-law`; national AI-toy news) · 53 words
> India's Digital Personal Data Protection Act, 2023 treats anyone under 18 as a child. A company must get a parent's verifiable consent before it processes a child's personal data, and it may not track or behaviourally monitor children or target advertising at them. [CITE: DPDP Act 2023, section 9, read at source.] Ask any AI toy maker how it meets these rules.

**AI5. Should my young child use an AI chatbot?** (`should-kids-use-ai`; Quora "Is ChatGPT AI good for kids?"; AC "should kids use ai") · 56 words
> Not on their own. General chatbots are built for adults, and the best-known ones set a minimum age of 13 or older in their own terms [CITE: each provider's terms of use, read at source]. If AI is part of a young child's play, it should be built for their age, unable to reach the open internet, and fully visible to you as a parent.

**AT1. Does a 3-year-old need an AI tutor?** (`does-a-three-year-old-need-an-ai-tutor`; AC "ai for kids learning") · 57 words
> No. A 3-year-old is not ready for homework, and help at this age means something simpler: someone who talks with them, asks questions and waits for the answer. Research links that back-and-forth with a caring adult to young children's language and brain development (Harvard Center on the Developing Child). Look for play that invites talk, not drills.

### 6.6 Learning toys and brain development

**LT1. What are the best learning toys for a 3-year-old?** (`learning-toys-for-a-three-year-old`; KP 1k-10k; Quora; AC) · 58 words
> Toys that get your child building, pretending and talking: blocks, simple puzzles, pretend-play sets, art supplies and picture books. Research links back-and-forth talk with a caring adult to language development (Harvard Center on the Developing Child), so the best toys get your child talking with you. Check that the box says 3 and up, and avoid small parts.

**BD2. What are brain development toys for a 3-year-old?** (same page; KP 1k-10k head; AC second completion) · 53 words
> Any toy that gets a 3-year-old thinking, talking and doing: blocks, puzzles, pretend play, picture books and simple turn-taking games. The words brain development on a box prove nothing on their own. What matters is whether the toy makes your child try, ask and explain, and whether you talk together while they play.

**LT3. Do learning toys actually work?** (same page; Quora "What kind of toys help toddlers learn faster?") · 57 words
> No toy teaches on its own. Children learn most through play and conversation with the people around them, and research links back-and-forth talk to young children's language and brain development (Harvard Center on the Developing Child; Romeo et al. 2018, children aged about 4 to 6). The best learning toys get your child doing, talking and asking.

**LT2. What are good learning toys for a 4 or 5-year-old?** (NEW 4-7 page; AC; Trends related 4 and 5) · 47 words
> At 4 and 5, look for toys with rules, choices and stories: simple board games, building sets, bigger puzzles, early science kits and story cards your child can retell. Toys that ask your child to explain, plan or invent do more than toys that only light up. [PLACEHOLDER F9: age-by-age activities for 4 and 5, signed off by the advisor.]

**LT4. What are good learning toys for a 6 or 7-year-old?** (NEW 4-7 page; AC; Quora "toys ... for my 7 year old kid in India") · 51 words
> At 6 and 7, children enjoy rules, challenges and stories of their own: board and word games, construction sets, simple science kits, and chapter books read aloud together. Choose toys that ask your child to talk, plan and invent, not just watch or tap, and play the first round with them. [PLACEHOLDER F9: what Kheelu offers at 6 and 7, signed off by the advisor.]

**BD1. How can I help my child's brain develop?** (`what-actually-builds-a-sharp-brain`; AC "how to develop child brain"; Hindi "बच्चों का दिमाग तेज करने के उपाय") · 58 words
> Talk with your child a lot, and let them answer. Research links back-and-forth conversation with a caring adult to young children's language and brain development (Harvard Center on the Developing Child; Romeo et al. 2018, children aged about 4 to 6). Add sleep, active play, reading together and time to explore. No toy or app replaces those exchanges.

**EY1. Why do the early years matter so much?** (`why-three-to-six-…`; inferred from the article's own question) · 60 words
> Because so much is built in them. Harvard's Center on the Developing Child describes everyday back-and-forth with a caring adult as one of the ways the connections in a young child's brain are built. India's National Education Policy 2020 treats ages 3 to 8 as the foundational stage [CITE: NEP 2020, read at source]. What fills those years well is ordinary: talk, play, sleep and family.

**SR1. What is serve and return?** (`how-children-learn-by-talking`; AC "serve and return fosters brain development by") · 57 words
> Serve and return is the back-and-forth between a young child and a caring adult. The child serves with a look, a sound, a word or a question, and the adult returns it with attention and a reply. Harvard's Center on the Developing Child says these exchanges help build and strengthen the connections in a young child's brain.

### 6.7 Screen time

**ST1. How much screen time is OK for a 3-year-old?** (`how-much-screen-time-…`; Bing PAA; Quora; AC) · 44 words
> Less is better at 3, and an hour a day is the usual upper limit. [CITE: WHO 2019, no more than one hour of sedentary screen time a day at ages 3 to 4, read at source.] What the screen replaces matters as much as the minutes: talking, play, sleep and moving about. When your child does watch, sit with them and talk about it together.

**ST2. How much screen time for a 5, 6 or 7-year-old?** (same page; Bing AC "how much screen time for 6 year old") · 55 words
> At 5, most guidance still says about an hour a day; from 6, it asks families to set consistent limits instead of a fixed number. [CITE: AAP 2016 and IAP 2022, read at source.] Keep screens away from meals and the hour before bed, and make sure sleep, outdoor play, homework and conversation come first. Then judge the rest by what your child watches.

**SR2. What is the 3-6-9-12 rule?** (`screen-time-rules-parents-swear-by`, **removed** with its page, [D053](../decisions/D053-remove-the-3-6-9-12-article.md); KP 10-100; GSC position 1.0) · 52 words
> It is a set of four age markers for screens, proposed by the French psychiatrist Serge Tisseron in 2008: no screens before 3, no personal games console before 6, the internet with an adult from 9, and on their own from 12. It is a rule of thumb, not a research finding. [CITE: Tisseron, as cited in the article, read at source.]

**ST3. How do I get my 3-year-old off the phone without tantrums?** (`screen-time-and-tantrums`; Quora; FirstCry Parenting) · 58 words
> Cut back slowly, warn before the screen goes off, and use the same short phrase every time. Stay calm through the protest; giving in teaches that protest works. Then fill the gap with something that answers back: talk, stories, songs and play with you. A screen-free toy that talks can help in the moments your hands are full.

**ST6. How do I reduce my child's screen time?** (`the-gentle-way-off-the-phone`; AC "how to reduce screen time for kids", "how to stop mobile addiction in child") · 54 words
> Go slowly and plan what fills the gap. Cut a little each day, keep screens away from meals and bedtime, warn before the screen goes off, and have something ready instead: play, stories, songs or helping you cook. Do it as a family, because children notice the screen habits of the grown-ups around them.

**ST5. What can my child do at home instead of screens?** (`busy-hands-no-screens`; Quora; ParentCircle) · 56 words
> Anything that asks something back: board games and word games, building sets, crafts, simple cooking, treasure hunts with clues, and reading aloud together. Let your child explain the rules, tell the story or make up the clues, because talking it through is part of the fun. Keep one screen-free hour a day as a family habit.

**ST4. Is screen time bad for my child's speech?** (`screen-free-does-not-mean-silent`; Quora; Momspresso) · 58 words
> Long hours can crowd out the talk that builds language. A screen talks at a child and never waits for a reply, while research links back-and-forth conversation with a caring adult to young children's language development (Harvard Center on the Developing Child; Romeo et al. 2018, children aged about 4 to 6). Swap some screen time for talk.

**SF1. What are screen-free toys?** (same page; AC "screen free toys for 3 year olds") · 54 words
> Toys that keep a child busy without a display: blocks, puzzles, art kits, pretend-play sets, books, and audio or talking toys. The best ones get your child doing or talking rather than watching. Kheelu is one: a screen-free plush toy for children aged 3 to 7 that talks with your child and answers back.

**SB1. Story box or a toy that talks back: which is better?** (same page; Amazon story players with badges; AC "story box for kids") · 56 words
> They do different jobs. A story box plays stories your child listens to. A toy that talks back holds a conversation: your child asks, it answers, then it asks a question back. Kheelu does both: Story mode plays stories, poems and jingles with no WiFi needed, and AI mode talks with your child on home WiFi.

### 6.8 Talking and language

**LD1. How can I help my 3-year-old talk more?** (`how-to-get-your-child-talking`; AC "how to make child talk more") · 54 words
> Talk with your child, not at them. Ask open questions, wait for the answer, and build on what they say. Read the same books often and let them finish the lines. Research links these back-and-forth turns to language development (Harvard Center on the Developing Child). If you are worried about speech, ask your paediatrician.

**LD4. What games help a young child's speech?** (same page; Quora "games and activities to encourage toddler speech development") · 56 words
> Games where your child has to talk to take a turn: describe-and-guess, pretend shop, what-happens-next with a picture book, and songs with gaps for them to fill. The talking is the point, so pause and wait for the answer. Research links these turns of conversation to young children's language development (Harvard Center on the Developing Child).

**LD2. My 3-year-old is not speaking in sentences. Should I worry?** (`talking-late-or-talking-little`; Quora; Momspresso; AC). Names no product; the article keeps its D025 one-line disclaimer · 58 words
> Children reach speech milestones at different times, so one missed milestone is not a diagnosis. If your child is not joining words together, is hard to understand, or does not seem to follow what you say, ask your paediatrician about a hearing check and a speech and language assessment. Meanwhile, keep talking, reading and singing together every day.

**LT5. What helps a late talker?** (`talking-toys-and-late-talkers`; AC "toys for late talkers"). Names no product as help; the article keeps its D025 one-line disclaimer · 57 words
> Talk, wait and follow your child's lead. Name what they look at, add one word to what they say, and give them time to reply before you fill the silence. If your child has few words or is hard to understand, ask your paediatrician. A toy can add to talk with you, but it cannot replace it. [PLACEHOLDER G5: this article's age.]

**TT1. Are talking toys good for a young child's language?** (`a-toy-that-talks-vs-a-toy-that-listens`; Quora; AC "toys for language development") · 60 words
> Only if they wait for your child to talk. A toy that plays recordings or repeats words talks at a child. What builds language is back-and-forth: a question, a wait, an answer, another question. Research links those turns to young children's language development (Harvard Center on the Developing Child). A talking toy can add to your conversations, not replace them.

**V1. How can I build my 3-year-old's vocabulary?** (`how-children-collect-words`; AC "how to increase 3 year old vocabulary") · 57 words
> Use new words in everyday talk and explain them as you go: this mango is ripe, so it is soft and sweet. Read together, name what your child points at, and ask them to tell you about their day. Children collect words from conversation, in every language you speak at home, so keep using all of them.

**LD3. Will English confuse my child if we speak Hindi, Tamil or Kannada at home?** (`raising-a-bilingual-child-in-india`; FirstCry Parenting; Quora) · 49 words
> No. Young children can learn two or more languages, and mixing words early on is normal. Your home language is a foundation for English, not a rival, so keep using it every day, and let grandparents use theirs. [CITE: the bilingual research cited in the article, read at source.] Kheelu speaks English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.

### 6.9 Trust pages

**B10. Who makes Kheelu?** (`/team`; a ChatGPT landing on `/team`; YNOS lists two founders) · 52 words
> Kheelona Robotics Private Limited, a small company in Bengaluru with three co-founders: Apoorva Sahu, Aman Soni and Kashyap C.R. Kheelu is designed in Bengaluru. You pay for a pre-order on store.kheelona.com, and the team answers messages on WhatsApp (call or message) or at hello@kheelona.com. Kheelu is made in India by Kheelona Robotics.

**B9. Can I get my money back?** (`/refund`; a ChatGPT landing on `/refund`) · 58 words
> Yes. Until we dispatch it, everything you pay is refundable in full, with no reason needed. After delivery, you can return Kheelu within 7 days, no questions asked: opened is fine, if everything that came in the box comes back undamaged. We arrange the pickup, and your refund is processed within 7 working days of it reaching us.

**W1. What warranty does Kheelu have?** (`/refund`; inferred from brief 9.7 and E-Commerce Rules 7(1)(a); D022's and D033's lines, near verbatim) · 60 words
> A 6-month warranty on manufacturing defects. It doesn't cover drops, water damage or misuse. If your Kheelu arrives faulty, tell us within 7 days of receiving it and we'll replace it. After that, we repair it, or replace it if the repair doesn't work. Pickup is free. Call or message us on WhatsApp, or email hello@kheelona.com, with your order number.

**SH1. Do you deliver everywhere in India, and what does delivery cost?** (`/shipping`; GSC 100 impressions on the page) · 55 words
> Yes, anywhere in India, with delivery included in the price and nothing to pay at the door. Kheelu does not ship outside India. Deliveries for new orders start in mid-November 2026, and a reserved Kheelu is sent once the rest of the ₹4,999 (incl. GST) is paid. You get a tracking link when it ships.

**C1. How do I contact Kheelona?** (`/contact`; GSC 183 impressions on the page; four emails and three phones exist off-site) · 56 words
> Call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com, with your order number if you have one. We are a small team in Bengaluru and we answer our own messages. For a formal complaint, contact our grievance officer, Aman Soni, Co-Founder and CTO, at aman@kheelona.com. We acknowledge every complaint within 48 hours.

**P1. What does Kheelona do with my child's data?** (`/privacy`; the two app listings declare opposite data practices) · 60 words
> We don't sell your data. Trusted speech and AI providers, on servers in India, process your child's voice only to produce Kheelu's reply; they don't keep it or train on it, and our contracts say so. Kheelona's own model learns from conversations unless you opt out [PLACEHOLDER D035: how a parent opts out]. Conversations stay in your parent app for 36 months, then are deleted automatically.

*P1 is the `/privacy` answer, where the training disclosure belongs ([D035](../decisions/D035-model-training-opt-out.md)); it never appears on customer pages. "Card, UPI and bank details go to Razorpay, not us" moves to the detail below the answer.*

**RT1. How long are my child's conversations kept?** (`/privacy`; the Common Sense Media and Fairplay guides tell parents to ask, AI3; D020's retention line, verbatim) · 55 words
> For 36 months, unless you delete them sooner. You can read every conversation in the parent app. Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap. The speech and AI providers that help Kheelu reply keep none of it.

**Seen and deliberately not drafted:** "gift for 3 year old girl under 500" (price far below ₹4,999, and
₹499 must never read as the price); "learning toys for 3 year old with speech delay / with autism"
(health targeting is banned); "talking toy for baby" and every under-3 screen-time query (TT3 is the
only answer); "ai toys for kids reddit", "are ai toys real" (navigational or vague); competitor price
and review questions (Gate A).

## 7. GEO plan

### 7.1 Entity facts, each with one source

Every page, the JSON-LD, `llms.txt`, `pricing.md` and every off-site profile states these the same
way. The wording to publish is on the owner page; this table only points at it.

| Fact | State it as | Single source | Wrong today on |
|---|---|---|---|
| Brand and company | Kheelona; Kheelona Robotics Private Limited, Bengaluru; three co-founders | [facts](../product/facts.md), [policies](../product/policies.md) (seller) | YNOS ("Khaeelon", two founders) |
| Product name | **Kheelu by Kheelona**, called Lumi until 5 September 2026 | [facts](../product/facts.md) | kheelona.ai, Play, App Store, YNOS, LinkedIn posts |
| What it is | A screen-free plush toy that talks with a child and answers back; a plush, not a robot | [facts](../product/facts.md) | LinkedIn ("Robotic"), kheelona.ai ("breathes"), App Store ("dance sessions") |
| Age | **3 to 7**; not for under 3 | [facts](../product/facts.md#age), [age review](../product/age-band-review.md) | every source (3+, 4+, 2 to 8, none); `llms.txt` "3 to 5" line |
| Price | **₹4,999 (incl. GST) first**, for the first 500 units, then ₹7,999 paid in full; the refundable ₹499 advance and the ₹4,500 due before delivery come second; delivery in India included | [pricing](../product/pricing.md); wording [D028](../decisions/D028-price-wording.md) | Instagram and Facebook ("₹499" alone); Bing AI ("priced at ₹499"); a stale index ("₹2,999") |
| Kheelona+ | The new line only: 6 months included (stories, poems, jingles, languages, parent app); smart features keep working for life, with no subscription needed; pricing announced soon | [facts](../product/facts.md#kheelona); line [D027](../decisions/D027-story-mode-wording.md) | Bing AI ("lifetime subscription"); the live `KHEELONA_PLUS_LINE` (held until Gate B, D011) |
| Safety and data | No camera; says it is a toy; never asks a child to keep a secret (CONFIRMED). No wake word: a press of the wake-up button turns the microphone on, it switches itself off after about a minute of quiet, a light shows while it listens ([D018](../decisions/D018-wake-up-button.md)). Trusted speech and AI providers on servers in India process voice only to reply, keep nothing, never train on it, by contract; we don't sell your data; transcripts deleted automatically after 36 months; parents read and one-tap delete every conversation ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | [claims §1](../product/claims.md#1-confirmed-by-the-founder), [facts](../product/facts.md#what-it-listens-for-and-where-the-voice-goes) (rows being updated to D018-D020) | no source states them; `llms.txt` and schema carry the retired microphone wording; live copy says voice "stays in your region" and `/playos` says "Nothing rented that matters" (all held until Gate B, D011) |
| Modes and connectivity | AI mode on home WiFi (cannot browse the internet, D017); Story mode: stories, poems and jingles, no WiFi needed, never "lessons" and no interrupt-and-ask ([D027](../decisions/D027-story-mode-wording.md)); Bluetooth mode with a paired phone; never a blanket "works offline" | [facts](../product/facts.md#modes-and-connectivity) | YNOS ("offline learning"); Bing's snippet "It works offline"; the live Story mode line ("lessons it can interrupt, question and be quizzed on") |
| Languages | 8 named, up to 10 | [facts](../product/facts.md) | Instagram ("every language") |
| Delivery | Deliveries for new orders start mid-November 2026, one content value ([D023](../decisions/D023-new-order-delivery.md)); never a delivery or replacement timeline ([D022](../decisions/D022-warranty-replacement-refund.md)) | [facts](../product/facts.md#ship-date) | production and checkout say "20 October 2026" until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md), accepted) |
| Returns, warranty, payment | 7-day returns, no questions asked (opened is fine if undamaged and complete); 6-month warranty on manufacturing defects; faulty on arrival replaced if reported within 7 days of receipt; after day 7, repaired or replaced; free pickup; refund within 7 working days of the unit reaching us; UPI, cards and net banking; prices include GST; GST invoice | [policies](../product/policies.md); [D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md), [D033](../decisions/D033-warranty-after-day-7.md), [D024](../decisions/D024-payment-methods-gst.md) | live `/refund` and `/products/kheelu` say the terms are coming (held until Gate B) |
| Support | WhatsApp +91 91875 46483 (calls and messages on the new site) and hello@kheelona.com; grievance officer Aman Soni, Co-Founder and CTO, aman@kheelona.com, 48-hour acknowledgement, resolved within one month | [facts](../product/facts.md#support-channel), [policies](../product/policies.md); [D029](../decisions/D029-grievance-officer-legal-review.md), [D032](../decisions/D032-grievance-block-and-call-line.md) | Play, Facebook and kheelona.ai list other emails and phones; no grievance officer published anywhere |
| Certification | None issued yet | [claims §6](../product/claims.md#6-certifications) | App Store and Instagram imply outcomes, not certificates |

### 7.2 Schema to add or fix

Detail and evidence: [machine readability](../raw/research/geo/machine-readability-2026-10-10.md).
Rules that bind (from [lessons §6](../engineering/lessons.md#6-seo-infrastructure)): all JSON-LD from
one module; schema states only what is visible on the same page; validate after every change; the
Product `@id` stays `https://kheelona.com/products/lumi#product`; a unit-bounded offer carries **no**
`priceValidUntil`.

| Node | Change | Waits on |
|---|---|---|
| Product `audience` | `suggestedMinAge: 3`, **`suggestedMaxAge: 7`** (the legacy test that bans the max changes with it) | nothing (brief) |
| Product `additionalProperty` | Age "3 to 7 years"; **add "Camera: None"**; remove "Microphone: … not muted", "Internet access: None" and any wake-word row (the 2026-10-04 line included); add the microphone row in the D018 form (on only after a press of the wake-up button, off after about a minute of quiet), "Open internet: cannot browse" (D017) and the voice row in the D020 form (trusted providers, servers in India, nothing kept, never used for training); never "only our own servers" | final wording at Gate A (D015) |
| Product `description` | 3 to 7; no "best friend" ("friend" allowed, D041); no "lessons" (D027), no mood reading (R5), no brain-growth promise (D016) | G5 |
| Product `offers` | price from the live offer mode, not a constant (G9), the GST-inclusive amount (D024; `priceSpecification.valueAddedTaxIncluded: true`); keep INR and `PreOrder`; add `seller` (the Organization); add `shippingDetails` (free delivery in India, **no** handling or transit time, since none is published, D022); **`hasMerchantReturnPolicy` is now possible** (D021, D022): `MerchantReturnFiniteReturnWindow`, `merchantReturnDays: 7` counted from delivery (D021's reading), `returnMethod: ReturnByMail` as the nearest value to a pickup we arrange, `returnFees: FreeReturn` (free pickup, [D033](../decisions/D033-warranty-after-day-7.md)); `availabilityStarts: 2026-11-15` ([D037](../decisions/D037-delivery-date-in-schema.md)); every value from the same content source as the visible policy text | G9 |
| Product `alternateName` | keep "Lumi" | nothing |
| FAQPage (Home, product, `/faq`) | rebuild from section 6; add "Is Kheelu the same as Lumi?" to Home too (Home takes most AI landings); never the same question on two pages once `/faq` exists; no speech or language question on Home, and SP1 only on `/products/kheelu`, beside the D025 disclaimer | G8 |
| Organization | description 3 to 7; `memberOf` only with proof (F11: the founder says all are real and files the proof, [D038](../decisions/D038-trust-content-rulings.md)); remove the removed team member; `sameAs` points at profiles **after** they are corrected (7.5); add the App Store listing once fixed | F11, C6 |
| Article / BlogPosting | every story: author Person `@id`, git-derived dates, `citation` from its sources (as live) | nothing |
| BreadcrumbList | every page below Home | nothing |
| VideoObject | only for consented films used on the page (G3), with transcript | G3 |
| Never | AggregateRating or Review (no real reviews), any certification | brief 9.2 |

### 7.3 `llms.txt` and `pricing.md`

Today's file has the right shape: a summary, a "facts commonly wrong elsewhere" block, modes,
the price, key answers and official profiles. Changes for the new site
([machine readability](../raw/research/geo/machine-readability-2026-10-10.md), ten points, plus point 8 from the 2026-10-10/11 rulings):

1. Ages: every "3+" and the "3 to 5" line become **3 to 7**.
2. Remove the retired microphone line, any wake-word line (the 2026-10-04 one included),
   "Conversations stay in the family's region", any "only our own servers" line and "Nothing rented
   that matters" ([D018](../decisions/D018-wake-up-button.md), [D019](../decisions/D019-voice-providers.md)).
   Add, in the D020 safety-block order: the confirmed claims (no camera; says it is a toy; never asks
   for a secret); the wake-up button and light (D018); the providers line, "we don't sell your data"
   and the 36-month retention ([D020](../decisions/D020-provider-terms-and-no-sale.md)); parents read
   and delete every conversation ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)).
3. "Support is WhatsApp only" becomes "WhatsApp (calls and messages) or email" ([D032](../decisions/D032-grievance-block-and-call-line.md)).
4. New "commonly wrong" lines the audit justifies: **Kheelu costs ₹4,999 (incl. GST); ₹499 is a
   refundable advance, not the price** ([D028](../decisions/D028-price-wording.md)); **Kheelona+ is
   included for 6 months; Kheelu's smart features keep working for life, with no subscription
   needed** (the [D027](../decisions/D027-story-mode-wording.md) line, so no engine reads a lifetime
   subscription); **Kheelu is not a robot** (keep); and, subject to SV-7, that a "Lumi" toy sold in
   Europe, a "Kheelona India" seller (not connected, [D039](../decisions/D039-repo-and-setup-answers.md)) and the @KHEELONA YouTube
   channel are not this company.
5. Lead the summary with "Kheelu by Kheelona" so the unknown product name sits beside the known
   brand.
6. "Key answers" lists the cluster owners from section 4, not a hand-picked nine.
7. Price lines lead with ₹4,999 (incl. GST), the advance second (D028), and follow the live mode at
   sell-out (G9 and the sell-out sweep in [pricing](../product/pricing.md)).
8. Add the buying answers engines are asked, from the same content source as the pages: Story mode
   as stories, poems and jingles (D027); deliveries for new orders from mid-November 2026 (D023);
   7-day returns, the 6-month warranty and free pickup ([D021](../decisions/D021-returns-policy.md), [D033](../decisions/D033-warranty-after-day-7.md),
   [D022](../decisions/D022-warranty-replacement-refund.md)); UPI, cards and net banking, GST included,
   a GST invoice ([D024](../decisions/D024-payment-methods-gst.md)). No delivery or replacement
   timeline (D022), and no speech or health claim (D025).
9. "Last updated" derived from content, not hand-set (today 2026-09-11; `pricing.md` 2026-08-23).
10. Only EXTERNAL facts (no research figures, competitors or unit counts) and only what visible pages
   say.
11. `/llms-full.txt` is optional; not recommended until the journal is rewritten.

### 7.4 AI-crawler policy (G7, for Gate A)

**Recommendation: option 2. Keep today's allow-all file and add `User-Agent: Bytespider`
`Disallow: /`.** Until the founder decides, the new site serves today's `robots.txt` byte for byte
(brief 9.3). Evidence and the other two options:
[crawler policy](../raw/research/geo/ai-crawler-policy-2026-10-10.md).

Why: ChatGPT already brings 83 of 802 human sessions (10.3%, 2026-09-19 to 2026-10-10;
[PostHog audit §4](posthog-audit.md#by-source-q6-sessions-internal-excluded), Q6) and one of the two
paid orders; the GEO problem is **stale** facts, which only fresh crawls fix;
blocking Google-Extended also drops Gemini grounding; two user-fetch agents ignore robots.txt anyway;
nothing on the site is secret. Bytespider has no Indian answer-engine role we know of and its
compliance is disputed. Keep the explicit `Allow` groups, the `Sitemap:` line, and the apex,
`www` and `store` **DNS-only** in Cloudflare (proxying prepends a block on GPTBot, ClaudeBot,
Google-Extended and CCBot). QA checks the served file.

### 7.5 Off-site sources, in priority order (founder-side: C6)

Ranked by how directly each feeds today's wrong answers. Evidence: [entity consistency](../raw/research/geo/entity-consistency-2026-10-10.md),
[AI answer audit](../raw/research/geo/ai-answer-audit-2026-10-10.md).

| # | Source | What is wrong | Fix | Why this rank |
|---|---|---|---|---|
| 1 | **kheelona.ai** (own sister site) | "Lumi" 28 times on Home; blue-dinosaur alt text; "breathes"; a special-needs FAQ; "demo units" | Kheelu (formerly Lumi), cream rabbit art, no breathing claim, remove the special-needs answer, point to the pre-order | Our own domain, the largest "Lumi" source; ranks second for "Kheelona" on Bing |
| 2 | **CB Insights** (unclaimed) | "adapting to their learning pace", "memory technology that tracks a child's progress" | Claim the profile; replace with the 7.1 facts | **Bing's AI summary copied it word for word** |
| 3 | **Google Play** listing | "App to Manage Lumi toy" (also in its JSON-LD), outcome claims, "No data collected" | Name and description (legacy drafts need 3 to 7 first); review Data safety against the app | A Google-owned page with structured data |
| 4 | **App Store** (India) | "Lumi", "Smart Brain Development Toy", "dance sessions", privacy labels that contradict Play | Subtitle, description, labels | Same reach on Apple surfaces |
| 5 | **Instagram bio** | "AI toys that develop brains", "speeks in every language", "Reserve now at ₹499/-" | Price first ("₹4,999; ₹499 reserves"), no brain claim, 8 languages | The "₹499" source behind "priced at ₹499" |
| 6 | **LinkedIn** About and tagline; **Facebook** | "India's First Robotic brand"; "Sharpest Minds"; a third phone and a second address | One set of words from 7.1 | Feeds "robot" |
| 7 | **YNOS**, **F6S**, **Crunchbase**, **Tracxn** | Misspelt name, two founders, "Kheelu Mode is a startup", offline-only | "Suggest edits" (YNOS); check F6S and Crunchbase by hand | Directory citations seen in Perplexity (2026-09-11) |
| 8 | **GitHub repo** `Kheelona/website` | "website" field points at a dead Vercel URL | Set it to https://kheelona.com | Answer engines read the README |
| 9 | **YouTube** | @KHEELONA is not ours; no official channel | An official channel for the consented films (G3), with Hindi and regional titles later (SV-8) | YouTube autocomplete shows toy reviews in Hindi and Tamil |
| 10 | **Marketplaces** (Amazon.in after BIS, per the positioning) | n/a yet | Same 7.1 facts in title and bullets; "Kheelu by Kheelona" so "khilona" search finds it | Marketplace pages lead the category results |
| 11 | **Earned third-party pages** (Indian buying guides, parenting sites, press) | Kheelona is in none of the category answers we could run | Outreach is the founder's; the journal's job is to be the most citable source on each learn cluster | 4 of 11 citations in a September answer were brands' own sites; the rest were roundups and listings |

### 7.6 Measuring GEO (baseline exists for Bing only)

- **Monthly, by the founder in a private window** (agents may not use logged-in browsers): the two
  legacy prompts, "best AI toy for a 4 year old in India" and "What is Kheelona and what is the
  Kheelu AI toy?", in Perplexity, ChatGPT, Gemini and Google AI Mode; record products named, the
  name, age, plush or robot, price, founders and cited domains. The 2026-10-03 re-measure was missed.
- **PostHog**: first-touch `utm_source=chatgpt.com` visitors and their landing pages, weekly; any
  journal landing from an assistant is the first sign the learn pages are being cited.
- **Search Console** (C11): Generative AI impressions if the property shows them (unverified in
  September), plus queries per cluster owner.

## 8. Hindi and Hinglish: a future opportunity

Not a launch item: the brief sets English (`en-IN`). Recorded so a later phase starts from evidence.

| Phrase (as typed) | Intent | Source |
|---|---|---|
| bacche ko bolna kaise sikhayen (jaldi, english, 4 / 5 saal); बच्चे को बोलना कैसे सिखाएं | learn: teaching a child to talk | Google AC (hl=en-IN and hl=hi); YouTube AC adds "sikhane wala video" |
| bacchon ka screen time kitna hona chahiye; बच्चों का स्क्रीन टाइम कितना होना चाहिए | learn: screen time | Google AC |
| mobile ki aadat kaise chhudayen (bacchon ko / se) | learn: phone habits | Google AC |
| बच्चों का दिमाग तेज करने के उपाय; dimag tez karne wale khilone in hindi | learn and buy: brain | Google AC |
| bolne wala khilona (price, ka naam); baat karne wala khilona; बात करने वाला खिलौना | buy: a talking toy | Google AC (cactus and parrot toys fill it today) |
| ai khilona | buy | Google AC (from "khilona ai") |
| story audio player for kids hindi; learning toys for 3 + year old hindi; bilingual books for kids hindi english | buy | Amazon.in suggestions |
| toy review in hindi / tamil / malayalam; miko robot hindi / tamil | compare | YouTube AC |

**No volume data** for any of these. **What it means:** learn intent in Hinglish is deep, and the
buy phrase "bolne wala khilona" has no AI-toy answer yet; "bacchon ke liye ai khilona" returns
nothing. Kheelu speaks Hindi, which no English page can show a Hindi searcher. The brand name sits one
letter from "khilona", which makes Hindi search both a risk (marketplaces rewrite the brand) and an
opening. **When it is taken up:** separate `hi-IN` pages with `hreflang`, never mixed-script copy on
`en-IN` pages; start with three learn articles (talking, screen time, brain) and a Hindi product
summary; native-speaker review; the DS fonts cover Devanagari but not the other scripts the
language chips show ([G11](../open-questions.md)); add the Hinglish seeds to the C11 export first.

## 9. Seed list for the C11 Keyword Planner export

India, all languages, last 12 months, with monthly breakdown. Ask for both singular and plural
where marked.

- **Age 3 (both forms):** learning toys for 3 year old(s) · educational toys for 3 year old(s) ·
  toys for 3 year old · brain development toys for 3 year old · gift for 3 year old · birthday gift
  for 3 year old boy · birthday gift for 3 year old girl · how much screen time for 3 year old · my
  3 year old is not talking in sentences · how to increase 3 year old vocabulary · activities for 3
  year olds at home · montessori toys for 3 year old
- **Ages 4 to 7, each age:** learning toys for N year old · educational toys for N year old · toys
  for N year old · gift for N year old · birthday gift for N year old boy / girl · how much screen
  time for N year old (N = 4, 5, 6, 7)
- **Category:** toys that talk back · toy that talks back to kids · ai toys that talk back · talking
  toy with ai · talking toy for kids · plush toy that talks · ai plush toy · ai toy for kids · ai
  toys for kids india · best ai toy for kids · ai robot for kids · ai robot toy · smart toys for kids
  · screen free toys · screen free toys for kids · kids audio player · story box for kids · screen
  free audio player for kids · toys for language development · speech development toys · brain
  development toys · learning toys · educational toys · interactive talking toy
- **Compare and safety:** are ai toys safe · are ai toys safe for kids · is ai safe for kids · what
  to look for in an ai toy · ai robot vs plush toy · alexa for kids · echo dot kids
- **Learn:** screen time for kids · how to reduce screen time for kids · how to stop mobile
  addiction in child · 3 6 9 12 rule · how to make child talk more · late talker · serve and return
  · how to raise a bilingual child · should kids use ai · how to develop child brain · screen free
  activities for kids · dpdp act children
- **Gift and season:** gift for kids · educational gift for kids · screen free gifts for kids ·
  diwali gift for kids · children's day gift
- **Brand and collisions:** kheelona · kheelona toy · kheelu · kheelu toy · kheelu price · kheelona
  kheelu · lumi ai toy · khilona ai · ai khilona
- **Hinglish and Hindi:** bolne wala khilona · baat karne wala khilona · bacche ko bolna kaise
  sikhaye · bacchon ka screen time · mobile ki aadat kaise chhudaye · बच्चों का दिमाग तेज करने के उपाय
- **Competitor names (demand only, never on the site):** the five brand seeds already in the
  Trends capture, plus their "price in india" forms.

From **Search Console**, ask for queries and pages for the last 16 months, with the "Lumi" and brand
clusters separated, and the Generative AI search appearance if it exists.

## 10. Open questions raised here

Returned to the orchestrator, who owns [open questions](../open-questions.md); IDs are temporary.

| ID | Question | Recommendation | Owner |
|---|---|---|---|
| SV-1 | G7: AI-crawler policy | Option 2 (allow all, disallow Bytespider) | founder |
| SV-2 | Home's search descriptor | **Settled by [D016](../decisions/D016-brain-wording.md)**: "brain-development toy" cannot label Kheelu, so "a screen-free plush toy that talks"; final words at Gate A (D015) | founder (D015) |
| SV-3 | Merge `what-to-look-for-in-a-safe-ai-toy` into `/ai-toys-for-kids-in-india` (301) | Merge | founder (G8) |
| SV-4 | 301s for the under-3 articles if G5 retires them | `brain-development-toys-for-a-2-year-old` → `learning-toys-for-a-three-year-old`; `talking-toys-and-late-talkers` → `talking-late-or-talking-little` | SKM / founder (G5) |
| SV-5 | New page for learning toys at 4 to 7 | Build if C11 shows 100 or more a month for any single age | either |
| SV-6 | May the Kheelona+ line be split so "for life" is not next to "Kheelona+"? | **Answered by [D027](../decisions/D027-story-mode-wording.md)** (the new line) and [D028](../decisions/D028-price-wording.md) (R10). Closed | founder |
| SV-7 | May `llms.txt` and the Lumi answer name other businesses (the European Lumi, "Kheelona India", the @KHEELONA channel)? Is "Kheelona India" connected? | Describe them without links in `llms.txt` only. **"Kheelona India" answered 2026-10-11: not connected** ([D039](../decisions/D039-repo-and-setup-answers.md)) | founder (naming them in `llms.txt`: Gate A) |
| SV-8 | An official YouTube channel for the consented films | Yes, after G3 | founder |
| SV-9 | Product `offers.availabilityStarts` needs an exact date, and D023 gives "mid-November 2026" | **Answered 2026-10-11:** `availabilityStarts: 2026-11-15` ([D037](../decisions/D037-delivery-date-in-schema.md)), from the same content value as "mid-November" | closed |
| SV-10 | D017 row checks this page waits on (claims §2, facts): "no wheels, no face screen and no moving parts" (a wake-up button may read as one), "switches languages mid-sentence", and the "closed library" and "age-graded safety layer" lines, which describe answers that now come through outside AI providers (D019) | **Applied 2026-10-11** ([claims §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)): mid-sentence switching EXTERNAL; no moving parts, closed library and age-graded layer EXTERNAL with a Gate A flag. B7, B12 and AI4 carry the lines | closed (Gate A flags remain) |

## 11. Gaps

- **No fresh volumes.** Search Console and Keyword Planner are September reads (C11). Ages 4 to 7,
  gift, speech, story-player and Hinglish phrases were never measured.
- **Google's own results were not readable**: no People Also Ask, no rankings, no AI Overviews (429
  "unusual traffic"). Bing showed People Also Ask for one seed of seven.
- **Not reached:** Reddit (blocked), Flipkart suggestions (POST-only), Trends age comparisons and
  5-year seasonality (429), Perplexity, ChatGPT, Gemini and Copilot answers (login or no render).
- **Density is a baseline**, measured by regular expression on copy that the reset rewrites
  ([raw/qa/2026-10-10/html/](../raw/qa/2026-10-10/html/)).
- **Every figure under a `[CITE]` passes D026's independent check**: [source verification](source-verification.md)
  (finished 2026-10-11) clears a statistic only in its verified wording; check each section 6 figure (for
  example ST1's hour a day) against it before it ships.
- **The owner pages were mid-update** when the drafts were refreshed (2026-10-11): facts, claims and
  policies still showed the pre-ruling values, so the drafts cite D016-D029 directly. Re-read them
  against the owner pages once those land.
- **Who ranks in India for each cluster is unknown**; competitor pages were read for their targeting,
  not their positions.
- **Seasonality** cannot be read at this volume; the February peak in Trends is unexplained.

## Related

- [URL map](../site/url-map.md) (every URL, redirect and landing count)
- [PostHog audit](posthog-audit.md) (landing pages and the funnel by source)
- [Positioning](../brand/positioning.md) and [messaging](../brand/messaging.md) (the category noun and
  the words to stop using)
- [Claims](../product/claims.md) and [age-band review](../product/age-band-review.md) (what the drafts
  may say)
- [Content boundary](../site/content-boundary.md) (what may be published)
