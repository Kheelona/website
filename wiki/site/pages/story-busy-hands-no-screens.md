---
title: "Story: Busy hands, no screens (/stories/busy-hands-no-screens): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link, §5 /stories/* row)
  - ../../engineering/tasks.md (wave 5 part C paragraph; task 5.17 row; the note on the 18 articles without a mockup)
  - ../pages/story-learning-toys-for-a-three-year-old.md (approved format, the age lines, the close)
  - ../pages/stories.md (fold 2 card 5: title and summary, kept word for word; fold 6 close)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../content-boundary.md
  - ../../research/keyword-map.md (§2.3 LRN-5, §3 age 3, §4.2, §5.1, §5.2, §6.7 ST5)
  - ../../research/source-verification.md (§3.2 C31; §4 C31; §5)
  - "../../raw/research/sources/C31-who-2019-guidelines-under-5.md"
  - ../../product/claims.md (§1, §4), ../../product/facts.md (identity, age), ../../product/age-band-review.md (row 43)
  - ../../brand/voice.md, ../../brand/messaging.md (CMO S6 on "asks a question back")
  - ../../decisions/D013, D015, D016, D017, D026, D041
  - "src/content/en-IN/stories/articles/busy-hands-no-screens.ts (stub: card, related, dates), read in the w5c-5.17 worktree 2026-10-14"
  - "src/lib/stories-expansion.ts:252-274 (the live article, legacy input only), read in the same worktree"
  - design-system/project/01-writing.md:19-26,111-113; 03-cast.md:115 (read-only)
---

# Story: Busy hands, no screens

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review (task 5.17 copy stage) and
> the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` is a source marker under [D026](../../decisions/D026-public-statistics.md): it links to its note in the
  "Sources" list at the foot of the article. Lines without a marker are plain advice in our own voice and make no
  research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template, and its
  visual acceptance is template parity with `story-learning-toys-for-a-three-year-old.html`
  ([tasks, wave 5 note](../../engineering/tasks.md)).
- Each fold names the template block it maps to (`Article` in `src/content/types.ts`).

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/busy-hands-no-screens` |
| Page job | Win "screen-free activities for kids at home" (and "activities for 3 year olds at home") with set-ups a parent of a 3 to 7 year old can use today, including on work days; route to the product page once, calmly ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **screen-free activities for kids at home** (LRN-5; KP no data, 2026-09-11, unmeasured); secondary "activities for 3 year olds at home" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (50 characters) | Screen-free activities for kids at home · Kheelona |
| Meta description (146 characters) | Screen-free activities for kids at home: ten-second setups, real jobs and quiet play for 3 to 7 year olds, including on the days you have to work. |
| H1 | Busy hands, no screens: screen-free activities for kids at home |
| Card (hub, unchanged) | Title "Busy hands, no screens"; summary "Screen-free ways to keep a young child busy at home, including on the days you have to work." ([stories §2](stories.md#fold-2--screen-time-screen-time), card 5) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read (byline: question 1) |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` as the stub holds it, 2026-07-31 (see the gentle-way page, question 3) |
| Related (unchanged) | `the-gentle-way-off-the-phone`, `screen-time-rules-parents-swear-by`, `what-to-look-for-in-a-safe-ai-toy` |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 9 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"` (pre-order close and sticky bar); breadcrumb topic "Screen time" (`/stories#screen-time`) |

**What changed from the live article** (`src/lib/stories-expansion.ts:252-274`): the answer comes first; two
set-ups are swapped for ones that suit a 3-year-old a parent cannot watch every second (painting the balcony floor and
sorting rajma become painting floor tiles with water and matching steel dabbas to their lids, `:269`); unsourced claims
are cut or turned into plain advice ("Expensive toys have one script. A cardboard box has forty.", `:269`; "Real jobs hold
attention longer than invented games because children can smell the difference", `:270`; "Busy hands last longest when
there is a voice keeping the mind company too", `:271`; the promise that "4pm gets easier for a year", `:272`); the
secondary keyword gets its own H2 for age 3, and ages 5 to 7 get theirs; the WHO's advice for quiet time is added, marked
([source verification C31](../../research/source-verification.md#c31--the-who-guideline)); "Building that voice is our whole
project" becomes one plain product line with the age limits and the grown-up-nearby advice; the author byline becomes
"The Kheelona team" (question 1).

---

## Fold 1 · Article head (`head`)

**Fold job:** say what the page gives, in the first phone screen, with the hub card's words.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** Busy hands, no screens: screen-free activities for kids at home
>
> Screen-free ways to keep a young child busy at home, including on the days you have to work.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "Busy hands" (`{hand:Busy hands}, no screens: …`).
- **H1:** the hub card's title word for word, then the primary (the gentle-way page, question 2, covers the pattern).
- **Lead:** the hub card's summary, word for word.
- Breadcrumb links: "Stories" → `/stories`; "Screen time" → `/stories#screen-time`.
- **Read time:** about 600 words in the article body.
- **Image** (`head.image`, `kh-photo`, 4:5): `ira-04-paper-crown-web.webp`. Alt: "A laughing girl in a sky-blue T-shirt
  puts on a yellow paper crown beside a craft table strewn with paper scraps, glue and crayons." The DS photo for
  "confidence and creativity" at a craft table (`03-cast.md:115`), no Kheelu. No name or age in the alt. File checked by
  eye 2026-10-14.

---

## Fold 2 · The answer first (`answer`)

**Fold job:** answer the search in 40 to 60 words, then say what the page holds.

**Copy:**

> **H2:** What are good screen-free activities for kids at home?
>
> Ones that start in seconds and need no grown-up to run them: dough, crayons and paper, a blanket fort, a box of blocks, real jobs like matching socks or washing potatoes, and stories told or played aloud. Set them up in the room where you are, and keep a few ready on one low shelf.
>
> Below: ten-second setups, real jobs, ideas by age, and what to do on the days you have to work.

- Answer: 55 words. `answer.question` is the H2, `answer.answer` the first paragraph, `answer.detail` one `p`.
- Built from the ST5 draft ([keyword map §6.7](../../research/keyword-map.md#67-screen-time)) and the live article's
  idea; advice only, so no marker. "Need no grown-up to run them" and "in the room where you are" sit together on
  purpose: the child plays on their own, with a grown-up nearby ([D041](../../decisions/D041-gate-a-round-1.md), "Age 3").

---

## Fold 3 · The scene (`part`, untitled)

**Copy:**

> It is 4 pm, your call starts in ten minutes, and a small person is circling your desk asking what they can do. The tablet would solve it in four seconds.
>
> Look at what the tablet offers: no setup, no grown-up needed, no way to get it wrong. An activity with the same three things has a fair chance against it.

- An untitled `part`, as the late-talker guide's scene. Our own reasoning, no research claim. Time written "4 pm"
  (DS `01-writing.md:24`).

---

## Fold 4 · Ten-second setups (`part` with a `list`)

**Copy:**

> **H2:** Ten-second setups
>
> Keep one low shelf of things that start at once and can stop anywhere:
>
> - a cup of water and a paintbrush, to "paint" the floor tiles
> - steel dabbas and their lids, to match up
> - old newspaper, to tear into the world's biggest salad
> - a bedsheet over two chairs: a house until dinner
> - dough, a small rolling pin and a few cutters
> - a cardboard box, which can be a car, a cave and a shop before lunch
>
> The plainer the thing, the more games it can be.

- `list`, `bullets` (or `tips` with DS icons, the builder's pick). The H2 is the keyword map's (§5.2).
- Every set-up uses large, everyday things a 3-year-old can use with a grown-up in the room: no balcony, nothing
  small enough to swallow, no knife.

---

## Fold 5 · Give them a real job (`part`)

**Copy:**

> **H2:** Give them a real job
>
> To a 4-year-old, matching every sock in the basket is not a chore. It is a promotion.
>
> Name the job and hand it over: "You're in charge of the potatoes." Washing vegetables, sorting spoons, watering the plants, guarding the dough while it rises. Let it be done their way.

- Advice and a light observation in our voice; the live claim that real jobs "hold attention longer" is not repeated.

---

## Fold 6 · Screen-free activities for a 3-year-old (`part`)

**Fold job:** give the age-3 searcher their own heading and plain, safe ideas.

**Copy:**

> **H2:** Screen-free activities for a 3-year-old at home
>
> Keep it big, simple and close to you: chunky crayons on a roll of paper taped to the floor, dough, stacking steel tumblers, pouring water between two cups over a basin, and dancing to a song you sing together.
>
> Keep small things out of reach, and stay in the same room.

- The secondary "activities for 3 year olds at home" as a single-age H2 ([keyword map §3](../../research/keyword-map.md#3-clusters-by-age)).
- The last line is plain safety advice, in step with D041's "with a grown-up nearby" at 3. It names no toy and implies
  nothing about younger children.

---

## Fold 7 · For a 5, 6 or 7-year-old (`part`)

**Copy:**

> **H2:** For a 5, 6 or 7-year-old: projects that last
>
> Try projects that can run all afternoon and wait for tomorrow: a cardboard-box city, a treasure hunt with picture clues, a comic about the family cat, a shop with price tags they draw or write themselves.
>
> Ask them to explain it to you at dinner. The telling is half the fun.

- Single ages in the H2, so the older half of the band has a heading too. Advice only; no claim about what a child
  of any age can do.

---

## Fold 8 · Quiet time (`part` with a `callout`)

**Fold job:** the one sourced line on the page: what the WHO encourages when a child is sitting still.

**Copy:**

> **H2:** Quiet time: a story instead of a show
>
> Some moments call for sitting still: after lunch, before bed, at the end of a long day.
>
> For three and four year olds, the World Health Organization says screen time spent sitting and watching should be no more than an hour a day, and less is better. When children are sitting still, it encourages "reading and storytelling with a caregiver".¹
>
> **Try this:** read a picture book once, then hand it over and let your child tell it back to you from the pictures.

- The WHO line is C31's verified wording, scoped to ages 3 and 4 (the WHO stops at 4) and to sedentary screen time
  ("time spent passively watching", the WHO's glossary), with its own words quoted for reading and storytelling.
  Nothing calls the evidence strong: the WHO grades it "very low quality" ([source verification C31](../../research/source-verification.md#c31--the-who-guideline)).
- **Try this** is a `callout` (lead "Try this:", icon the builder's pick, for example `book-open`).

---

## Fold 9 · On the days you have to work (the one in-text product link) (`part`)

**Fold job:** the work-day answer the hub card promises, then one calm product line with its age limits.

**Copy:**

> **H2:** On the days you have to work
>
> For the stretches you can't be interrupted, set the activity up in the room where you work, and add something that talks: a story, told or played aloud, in your home language, or a grandparent on a voice call.
>
> [Kheelu](https://kheelona.com/products/kheelu) is one more screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.
>
> Most of this page needs no technology at all: a shelf, a basket of socks, a cardboard box.

- Link target `/products/kheelu` (the page's one in-text product link, [strategy §3.3](../strategy.md#33-placement-and-repetition)).
- "Answers your child, then asks a question back": D017's form (CMO review S6). "In the room where you work" and
  "keep a grown-up nearby" keep the parent present on a work day; nothing suggests leaving a child alone with a toy.
- The page ends on the plain things, not the product.

---

## Fold 10 · Sources (`sources`)

**Copy** (`kh-body-s`, numbered list; the URL is a link):

> **Sources**
>
> ¹ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664

- The same list becomes the BlogPosting `citation` array. Citation wording as in
  [source verification §4](../../research/source-verification.md#c31--the-who-guideline).

---

## Fold 11 · Related guides (template, from `related`)

**Copy:**

> **H2:** Related guides
>
> - The gentle way off the phone: a seven-day plan
> - The 3-6-9-12 rule, and other screen rules parents swear by
> - What to look for in a safe AI toy

| Title (card title, from each module) | Real URL |
|---|---|
| The gentle way off the phone: a seven-day plan | `/stories/the-gentle-way-off-the-phone` |
| The 3-6-9-12 rule, and other screen rules parents swear by | `/stories/screen-time-rules-parents-swear-by` |
| What to look for in a safe AI toy | `/stories/what-to-look-for-in-a-safe-ai-toy` |

Text links only, so the page keeps one DS child. The list is the stub's, unchanged.

---

## Fold 12 · Close (journal close block, `close: "journal"`)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block); rendered from `articlePageCopy`):

> **H2:** A toy that asks back.
>
> Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.
>
> **[Pre-order Kheelu]** → `https://store.kheelona.com`, same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu`

- `cta` = `finale`. Full mode as on Home. Nothing here is typed in the article module: the close is shared.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; appears after the head, steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 50 characters, the §5.2 draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 146 characters; the set-ups, real jobs, quiet play, the age band and work days |
| One H1 with the primary | Yes | "Busy hands, no screens: screen-free activities for kids at home" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What are good screen-free activities for kids at home?" and its 55-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 6 H2 "Screen-free activities for a 3-year-old at home" carries the secondary |
| The §5.2 H2 ("Ten-second setups") | Yes | Fold 4 |
| Single ages in headings | Yes | "3-year-old" (fold 6); "5, 6 or 7-year-old" (fold 7) |
| Alt text describes the image | Yes | The paper-crown photo; no keyword forced |
| Density | Yes | "screen-free activities" 3 times in `<main>` (H1, fold 2 H2, fold 6 H2): about 1% of about 600 words; "Kheelu" 3 times including the close and its button (0.5%) |
| Words never placed | Yes | No brain or speech lines, no "tutor" or "lessons", no brand names, no price in the body |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |
| In-text link to the product page | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live article is by Apoorva Sahu, the founder, named on `/team`. (a) "The Kheelona team" (as
   drafted, like the other rewritten guides); (b) Apoorva Sahu, since he reads and signs off this copy at Gate B anyway.
   **Recommend (a)** for one voice across the journal; choose (b) if you want your name on the work-day guide, where a
   parent who also works from home is the most credible author.
2. **H1 pattern and `updated` date:** the same two questions as on the
   [gentle-way page](story-the-gentle-way-off-the-phone.md#questions-for-the-founder-website-only) (questions 2 and 3);
   one answer covers all three pages.

## Sources

| Claim | Source |
|---|---|
| WHO, ages 3 to 4: sedentary screen time no more than one hour a day, less is better; when sedentary, "reading and storytelling with a caregiver is encouraged"; sedentary screen time is passive watching | [source verification C31](../../research/source-verification.md#c31--the-who-guideline) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C31-who-2019-guidelines-under-5.md:39-44, 54-56` |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Not a toy for children under 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md); as on the [learning-toys guide](story-learning-toys-for-a-three-year-old.md#fold-12--where-kheelu-fits-the-one-in-text-product-link) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Set-ups, jobs, ideas by age, the work-day advice | Plain advice in our voice (no research claim); safety choices noted under folds 4 and 6 |
| Card title and summary, related list, dates | `src/content/en-IN/stories/articles/busy-hands-no-screens.ts` (stub); [stories §2](stories.md#fold-2--screen-time-screen-time) card 5; live dates `src/lib/stories-expansion.ts:259-260` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Cut live lines | `src/lib/stories-expansion.ts:269-272` (unsourced claims and a promise) |
| Photo | DS `03-cast.md:115` (Ira 04, "Confidence and creativity"); file checked by eye 2026-10-14 |
