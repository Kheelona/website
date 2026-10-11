---
title: "On-page keyword placement and density, all 35 sitemap URLs (2026-10-10)"
type: raw-capture
updated: 2026-10-10
sources:
  - "GET of the 35 URLs in https://kheelona.com/sitemap.xml (list: ../geo/site-files-2026-10-10/sitemap.xml), browser User-Agent, Accept-Language en-IN, one request at a time, 2 s apart, 2026-10-11T02:58:22 to 2026-10-11T03:01:49 UTC; every response 200"
  - "Proposed primary terms: ../../../research/keyword-map.md (section 3)"
---

# On-page keyword placement and density (2026-10-10)

**What this is.** Today's live copy (production, tag `archive/pre-reset-2026-10-10`) measured against
the primary term the keyword map proposes for each URL: is the term in the `<title>`, the meta
description, the H1, any H2, the first 100 words of `<main>`, and any image alt text inside `<main>`;
and how dense it is. The reset rewrites every page, so this is a **baseline and sanity check**, not a
verdict on copy that is about to change.

**Method.** Server HTML only (no JavaScript run). Text = everything inside `<main>` minus `script`,
`style`, `noscript`, `svg` and `template` (so nav, footer and JSON-LD are excluded). Words = tokens
starting with a letter, digit or ₹ ("3+" counts as "3"). **Density = occurrences x words in the term
/ words in `<main>` x 100.** Matching is case-insensitive by regular expression; the exact patterns
are listed at the end. A looser "head" pattern is reported beside each primary so a near miss shows.

**Method files** (scratchpad, not in the repo): `scripts/fetch.py`, `scripts/parse.py`,
`scripts/density.py`, `out/pages.json`, `out/density.json`.

## 1. Titles, descriptions and H1 as served

Title length includes the ` · Kheelona` suffix (11 characters). Brief 9.2: title 60 or fewer,
description 155 or fewer.

| Path | Title | Chars | Description chars | H1 |
|---|---|---|---|---|
| `/` | Kheelu: the screen-free AI toy with a tutor inside, ages 3+ · Kheelona | 70 **(over)** | 154 | A best friend at 3. A head start for school. |
| `/products/kheelu` | Meet Kheelu: the talking toy that teaches, ages 3+ · Kheelona | 61 **(over)** | 159 **(over)** | Meet Kheelu. The friend who listens first. |
| `/safety` | Are AI toys safe? How Kheelu is built to be · Kheelona | 54 | 159 **(over)** | Safe in their hands. Careful with their words. |
| `/ai-toys-for-kids-in-india` | AI toys for kids in India: how to choose one · Kheelona | 55 | 153 | AI toys for kids in India: how to choose one |
| `/playos` | PlayOS: one platform for childhood, ages 3+ · Kheelona | 54 | 154 | The operating system for childhood. |
| `/stories` | Stories: raising curious kids · Kheelona | 40 | 141 | Raising curious kids. |
| `/team` | Team: the parents building smart toys for toddlers · Kheelona | 61 **(over)** | 159 **(over)** | Every object a child holds is about to wake up. |
| `/setup` | Setup: day one with Kheelu · Kheelona | 37 | 124 | Day one takes minutes. |
| `/contact` | Contact: how to reach the team behind Kheelu · Kheelona | 55 | 149 | Talk to us. |
| `/privacy` | Privacy · Kheelona | 18 | 143 | Privacy, in plain words. |
| `/terms` | Terms · Kheelona | 16 | 123 | Pre-order terms, in plain words. |
| `/refund` | Refunds and cancellation · Kheelona | 35 | 138 | Refunds, in plain words. |
| `/shipping` | Shipping and delivery · Kheelona | 32 | 120 | Shipping, in plain words. |
| `/stories/why-three-to-six-are-the-years-that-matter-most` | Why the early years matter most · Kheelona | 42 | 96 | Why the early years matter most |
| `/stories/screen-free-does-not-mean-silent` | Screen-free does not mean silent · Kheelona | 43 | 84 | Screen-free does not mean silent |
| `/stories/how-children-learn-by-talking` | How children learn by talking · Kheelona | 40 | 104 | How children learn by talking |
| `/stories/what-to-look-for-in-a-safe-ai-toy` | What to look for in a safe AI toy · Kheelona | 44 | 151 | What to look for in a safe AI toy |
| `/stories/how-much-screen-time-for-a-3-to-6-year-old` | How much screen time is okay for a young child? · Kheelona | 58 | 157 **(over)** | How much screen time is okay for a young child? |
| `/stories/screen-time-and-tantrums` | Screen time and tantrums: what is actually happening · Kheelona | 63 **(over)** | 113 | Screen time and tantrums: what is actually happening |
| `/stories/the-gentle-way-off-the-phone` | The gentle way off the phone: a seven-day plan · Kheelona | 57 | 110 | The gentle way off the phone: a seven-day plan |
| `/stories/how-to-get-your-child-talking` | How to get your child talking · Kheelona | 40 | 112 | How to get your child talking |
| `/stories/talking-late-or-talking-little` | Talking late, or talking little? · Kheelona | 43 | 144 | Talking late, or talking little? |
| `/stories/what-actually-builds-a-sharp-brain` | What actually builds a sharp brain in the early years · Kheelona | 64 **(over)** | 128 | What actually builds a sharp brain in the early years |
| `/stories/how-children-collect-words` | How children collect words · Kheelona | 37 | 126 | How children collect words |
| `/stories/raising-a-bilingual-child-in-india` | Raising a bilingual child in India · Kheelona | 45 | 155 | Raising a bilingual child in India |
| `/stories/should-kids-use-ai` | Should kids use AI? An honest answer from people who build it · Kheelona | 72 **(over)** | 153 | Should kids use AI? An honest answer from people who build it |
| `/stories/busy-hands-no-screens` | Busy hands, no screens · Kheelona | 33 | 102 | Busy hands, no screens |
| `/stories/does-a-three-year-old-need-an-ai-tutor` | Does a three-year-old need an AI tutor? · Kheelona | 50 | 119 | Does a three-year-old need an AI tutor? |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` | A toy that talks is not a toy that listens · Kheelona | 53 | 160 **(over)** | A toy that talks is not a toy that listens |
| `/stories/screen-time-rules-parents-swear-by` | The 3-6-9-12 rule, and other screen rules parents swear by · Kheelona | 69 **(over)** | 160 **(over)** | The 3-6-9-12 rule, and other screen rules parents swear by |
| `/stories/talking-toys-and-late-talkers` | Late talker? What helps a child find their words · Kheelona | 59 | 129 | Late talker? What helps a child find their words |
| `/stories/brain-development-toys-for-a-2-year-old` | Brain development toys for a two-year-old: read this before the label · Kheelona | 80 **(over)** | 125 | Brain development toys for a two-year-old: read this before the label |
| `/stories/learning-toys-for-a-three-year-old` | Learning toys for a three-year-old, skill by skill · Kheelona | 61 **(over)** | 159 **(over)** | Learning toys for a three-year-old, skill by skill |
| `/stories/questions-parents-ask-about-ai-toys` | The hard questions parents ask about AI toys · Kheelona | 55 | 153 | The hard questions parents ask about AI toys |
| `/stories/ai-toys-and-indias-data-law` | What India's data law asks of a toy that listens · Kheelona | 59 | 158 **(over)** | What India's data law asks of a toy that listens |

## 2. The proposed primary term in today's copy

| Path | Proposed primary | Title | Meta | H1 | Any H2 | First 100 words | Alt in main | Occurrences | Words in main | Density % | Head term | Head occurrences | Head density % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Kheelu | yes | no | no | yes | yes | yes | 63 | 1942 | 3.24 | Kheelona | 6 | 0.31 |
| `/products/kheelu` | talking toy | yes | no | no | no | no | no | 0 | 1937 | 0.0 | talks back | 1 | 0.05 |
| `/safety` | are AI toys safe | yes | no | no | yes | yes | no | 1 | 1033 | 0.39 | AI toy(s) + safe(ty) in one heading or sentence | 1 | 0.1 |
| `/ai-toys-for-kids-in-india` | AI toys for kids | yes | no | yes | no | yes | no | 1 | 1559 | 0.26 | AI toy(s) | 8 | 0.51 |
| `/playos` | PlayOS | yes | no | no | no | yes | no | 4 | 587 | 0.68 | platform | 2 | 0.34 |
| `/stories` | parenting (guides) | no | no | no | no | no | no | 0 | 902 | 0.0 | stories | 1 | 0.11 |
| `/team` | founders | no | no | no | no | no | yes | 4 | 684 | 0.58 | team | 0 | 0.0 |
| `/setup` | set up Kheelu | yes | no | no | no | no | no | 0 | 239 | 0.0 | Kheelu | 11 | 4.6 |
| `/contact` | contact | yes | no | no | no | yes | no | 1 | 389 | 0.26 | WhatsApp | 5 | 1.29 |
| `/privacy` | privacy | yes | no | yes | no | yes | no | 2 | 1708 | 0.12 | data | 3 | 0.18 |
| `/terms` | pre-order terms | no | no | yes | no | yes | no | 1 | 749 | 0.27 | terms | 3 | 0.4 |
| `/refund` | refund | yes | yes | yes | no | yes | no | 7 | 579 | 1.21 | cancel | 4 | 0.69 |
| `/shipping` | shipping | yes | yes | yes | yes | yes | no | 5 | 513 | 0.97 | delivery | 4 | 0.78 |
| `/stories/why-three-to-six-are-the-years-that-matter-most` | early years | yes | no | yes | no | yes | no | 2 | 492 | 0.81 | brain | 3 | 0.61 |
| `/stories/screen-free-does-not-mean-silent` | screen-free toys | no | no | no | no | no | no | 0 | 448 | 0.0 | screen-free | 8 | 1.79 |
| `/stories/how-children-learn-by-talking` | serve and return | no | no | no | no | yes | no | 2 | 448 | 1.34 | conversation | 0 | 0.0 |
| `/stories/what-to-look-for-in-a-safe-ai-toy` | safe AI toy | yes | no | yes | no | yes | no | 2 | 1146 | 0.52 | AI toy(s) | 10 | 0.87 |
| `/stories/how-much-screen-time-for-a-3-to-6-year-old` | screen time for a 3 year old | no | no | no | no | no | no | 0 | 1003 | 0.0 | screen time | 6 | 0.6 |
| `/stories/screen-time-and-tantrums` | screen time tantrums | yes | no | yes | no | yes | no | 2 | 488 | 1.23 | tantrum(s) | 3 | 0.61 |
| `/stories/the-gentle-way-off-the-phone` | reduce screen time | no | no | no | no | no | no | 0 | 515 | 0.0 | phone | 7 | 1.36 |
| `/stories/how-to-get-your-child-talking` | get your child talking | yes | no | yes | no | yes | no | 1 | 499 | 0.8 | talk* | 6 | 1.2 |
| `/stories/talking-late-or-talking-little` | not talking (in sentences) | no | no | no | no | yes | no | 1 | 507 | 0.39 | talk* | 11 | 2.17 |
| `/stories/what-actually-builds-a-sharp-brain` | child brain development | no | no | no | no | no | no | 2 | 491 | 0.81 | brain | 7 | 1.43 |
| `/stories/how-children-collect-words` | vocabulary (3 year old) | no | yes | no | no | no | no | 1 | 454 | 0.22 | words | 18 | 3.96 |
| `/stories/raising-a-bilingual-child-in-india` | bilingual child | yes | no | yes | no | yes | no | 4 | 1009 | 0.79 | bilingual | 5 | 0.5 |
| `/stories/should-kids-use-ai` | should kids use AI | yes | yes | yes | no | yes | no | 2 | 1131 | 0.71 | AI | 23 | 2.03 |
| `/stories/busy-hands-no-screens` | screen-free activities | no | no | no | no | no | no | 0 | 496 | 0.0 | activit* | 1 | 0.2 |
| `/stories/does-a-three-year-old-need-an-ai-tutor` | AI tutor | yes | yes | yes | no | yes | no | 4 | 627 | 1.28 | tutor | 10 | 1.59 |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` | toys for language development | no | no | no | no | no | no | 0 | 1005 | 0.0 | talk* | 15 | 1.49 |
| `/stories/screen-time-rules-parents-swear-by` | 3-6-9-12 rule | yes | yes | yes | yes | yes | no | 6 | 1085 | 0.55 | screen rules | 17 | 1.57 |
| `/stories/talking-toys-and-late-talkers` | late talker | yes | no | yes | no | yes | no | 1 | 687 | 0.29 | talk* | 9 | 1.31 |
| `/stories/brain-development-toys-for-a-2-year-old` | brain development toys | yes | no | yes | no | yes | no | 1 | 559 | 0.54 | brain | 5 | 0.89 |
| `/stories/learning-toys-for-a-three-year-old` | learning toys for a 3 year old | yes | no | yes | no | yes | no | 1 | 985 | 0.61 | learning toy(s) | 1 | 0.1 |
| `/stories/questions-parents-ask-about-ai-toys` | does an AI toy record | no | no | no | yes | no | no | 2 | 1055 | 0.19 | AI toy(s) | 4 | 0.38 |
| `/stories/ai-toys-and-indias-data-law` | DPDP Act | no | no | no | no | yes | no | 3 | 867 | 0.35 | data | 9 | 1.04 |

Counts across the 35 URLs: primary in title **21**, meta description **6**, H1
**16**, any H2 **5**, first 100 words **23**, alt text **2**.

## 3. Words at 2% or more of a page

"Kheelu" as a share of words in `<main>`, every page where it reaches 2% or more:

| Path | "Kheelu" occurrences | Words in main | Density % |
|---|---|---|---|
| `/` | 63 | 1942 | 3.24 |
| `/products/kheelu` | 67 | 1937 | 3.46 |
| `/safety` | 27 | 1033 | 2.61 |
| `/setup` | 11 | 239 | 4.6 |
| `/contact` | 8 | 389 | 2.06 |
| `/terms` | 16 | 749 | 2.14 |
| `/refund` | 12 | 579 | 2.07 |
| `/shipping` | 12 | 513 | 2.34 |

Other single words at 2% or more of a page (stop words excluded): "words" on
`/stories/how-children-collect-words` (15 of 454, 3.3%), "language" on
`/stories/raising-a-bilingual-child-in-india` (21 of 1,009, 2.08%), and "read" / "minute" on the
`/stories` index (24 and 23 of 902, from the "N minute read" labels). All are the page's own topic or
its labels, not stuffing.

## 4. Patterns used

Each row: path, primary label, exact pattern, words in term, head label, head pattern.

```
# path, primary term (label), exact regex, words in term, head label, head regex
  ("/", "Kheelu", r"\bkheelu\b", 1, "Kheelona", r"\bkheelona\b"),
  ("/products/kheelu", "talking toy", r"\btalking toys?\b", 2, "talks back", r"\btalks? back\b|\banswers back\b"),
  ("/safety", "are AI toys safe", r"\bare ai toys safe\b", 4, "AI toy(s) + safe(ty) in one heading or sentence", r"\bai toys?\b[^.?!]{0,40}\bsafe|\bsafe\w*[^.?!]{0,40}\bai toys?\b"),
  ("/ai-toys-for-kids-in-india", "AI toys for kids", r"\bai toys? for kids\b", 4, "AI toy(s)", r"\bai toys?\b"),
  ("/playos", "PlayOS", r"\bplayos\b", 1, "platform", r"\bplatform\b"),
  ("/stories", "parenting (guides)", r"\bparenting\b", 1, "stories", r"\bstor(y|ies)\b"),
  ("/team", "founders", r"\bfounders?\b|\bco-founders?\b", 1, "team", r"\bteam\b"),
  ("/setup", "set up Kheelu", r"\bset(ting)? ?up\b", 2, "Kheelu", r"\bkheelu\b"),
  ("/contact", "contact", r"\bcontact\b", 1, "WhatsApp", r"\bwhatsapp\b"),
  ("/privacy", "privacy", r"\bprivacy\b", 1, "data", r"\bdata\b"),
  ("/terms", "pre-order terms", r"\bpre-?order terms\b", 2, "terms", r"\bterms\b"),
  ("/refund", "refund", r"\brefund\w*\b", 1, "cancel", r"\bcancel\w*\b"),
  ("/shipping", "shipping", r"\bshipping\b|\bships\b", 1, "delivery", r"\bdeliver\w*\b"),
  ("/stories/why-three-to-six-are-the-years-that-matter-most", "early years", r"\bearly years\b", 2, "brain", r"\bbrain\b"),
  ("/stories/screen-free-does-not-mean-silent", "screen-free toys", r"\bscreen[- ]free toys?\b", 3, "screen-free", r"\bscreen[- ]free\b"),
  ("/stories/how-children-learn-by-talking", "serve and return", r"\bserve[- ]and[- ]return\b", 3, "conversation", r"\bconversation\w*\b"),
  ("/stories/what-to-look-for-in-a-safe-ai-toy", "safe AI toy", r"\bsafe ai toys?\b", 3, "AI toy(s)", r"\bai toys?\b"),
  ("/stories/how-much-screen-time-for-a-3-to-6-year-old", "screen time for a 3 year old", r"\bscreen time for (a )?(3|three)[- ]year[- ]olds?\b", 6, "screen time", r"\bscreen[- ]time\b"),
  ("/stories/screen-time-and-tantrums", "screen time tantrums", r"\bscreen[- ]time\b[^.?!]{0,30}\btantrums?\b|\btantrums?\b[^.?!]{0,30}\bscreen", 3, "tantrum(s)", r"\btantrums?\b"),
  ("/stories/the-gentle-way-off-the-phone", "reduce screen time", r"\b(reduc\w*|cut\w*|limit\w*) (down )?(on )?screen[- ]time\b", 3, "phone", r"\bphones?\b"),
  ("/stories/how-to-get-your-child-talking", "get your child talking", r"\bget(ting)? (your )?(child|children|kids?) (to )?talk\w*\b", 4, "talk*", r"\btalk\w*\b"),
  ("/stories/talking-late-or-talking-little", "not talking (in sentences)", r"\bnot talking\b|\bnot speaking\b|\blate talk\w*\b", 2, "talk*", r"\btalk\w*\b"),
  ("/stories/what-actually-builds-a-sharp-brain", "child brain development", r"\bbrain development\b|\bdevelop\w* (a |the |your child'?s )?brain\b", 2, "brain", r"\bbrain\w*\b"),
  ("/stories/how-children-collect-words", "vocabulary (3 year old)", r"\bvocabular\w*\b", 1, "words", r"\bwords?\b"),
  ("/stories/raising-a-bilingual-child-in-india", "bilingual child", r"\bbilingual (child|children|kids?)\b", 2, "bilingual", r"\bbilingual\w*\b"),
  ("/stories/should-kids-use-ai", "should kids use AI", r"\b(should )?(kids|children) use ai\b", 4, "AI", r"\bai\b"),
  ("/stories/busy-hands-no-screens", "screen-free activities", r"\bscreen[- ]free (activit\w*|play)\b", 3, "activit*", r"\bactivit\w*\b"),
  ("/stories/does-a-three-year-old-need-an-ai-tutor", "AI tutor", r"\bai tutors?\b", 2, "tutor", r"\btutor\w*\b"),
  ("/stories/a-toy-that-talks-vs-a-toy-that-listens", "toys for language development", r"\b(toys?|play)\b[^.?!]{0,25}\blanguage development\b|\blanguage development\b", 2, "talk*", r"\btalk\w*\b"),
  ("/stories/screen-time-rules-parents-swear-by", "3-6-9-12 rule", r"\b3[- ]6[- ]9[- ]12\b", 1, "screen rules", r"\bscreen[- ]time rules?\b|\brules?\b"),
  ("/stories/talking-toys-and-late-talkers", "late talker", r"\blate[- ]talk\w*\b", 2, "talk*", r"\btalk\w*\b"),
  ("/stories/brain-development-toys-for-a-2-year-old", "brain development toys", r"\bbrain[- ]development toys?\b", 3, "brain", r"\bbrain\w*\b"),
  ("/stories/learning-toys-for-a-three-year-old", "learning toys for a 3 year old", r"\b(learning|educational) toys? for (a )?(3|three)[- ]year[- ]olds?\b", 6, "learning toy(s)", r"\b(learning|educational) toys?\b"),
  ("/stories/questions-parents-ask-about-ai-toys", "does an AI toy record", r"\brecord\w*\b", 1, "AI toy(s)", r"\bai toys?\b"),
  ("/stories/ai-toys-and-indias-data-law", "DPDP Act", r"\bdpdp\b|\bdigital personal data protection\b", 1, "data", r"\bdata\b"),
```
