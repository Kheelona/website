---
title: "Story: Busy hands, no screens (/stories/busy-hands-no-screens): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../decisions/D053-remove-the-3-6-9-12-article.md (task 6.5: the related list, fold 11)
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
  - design-system/project/01-writing.md:19-26,111-113; 03-cast.md:9-13, 79-81, 113 (read-only)
  - ../../qa/cmo-review-articles-5.17-2026-10-14.md (M13, M14, M15, M16; applied by task 5.20a, see the foot of this page)
  - ../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md (N1: the screen-free toys guide shares ira-02, with this alt)
  - ../../engineering/tasks.md (5.20, the screen-time photo pool) and ../../engineering/assets.md (§1, the pool photos' other uses)
  - ../../qa/cmo-review-built-b-2026-10-14.md (m3, the related ring; applied by task 7.1d to fold 11, see the foot of this page)
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
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| Related | `the-gentle-way-off-the-phone`, `screen-time-and-tantrums`, `why-three-to-six-are-the-years-that-matter-most` (CMO B m3's ring, task 7.1d; fold 11) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 9 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"` (pre-order close and sticky bar); breadcrumb topic "Screen time" (`/stories#screen-time`) |

**What changed from the live article** (`src/lib/stories-expansion.ts:252-274`): the answer comes first; two
set-ups are swapped for ones that suit a 3-year-old a parent cannot watch every second (painting the balcony floor and
sorting rajma become painting an old slate with water and matching steel dabbas to their lids, `:269`); unsourced claims
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
- **Read time:** about 620 words in the article body.
- **Image** (`head.image`, `kh-photo kh-photo--wide`, 16:9): `ira-02-drawing-the-dragon-web.webp`. Alt: "A laughing
  girl in a yellow frock lies on her tummy on a rug, a blue crayon in her hand, a big drawing of a green dragon in front
  of her and Kheelu sitting beside her." The DS photo for "Creativity and imagination" (`03-cast.md:113`): crayons on a
  big sheet of paper on the floor, one of this page's own set-ups, with Kheelu as one more thing in the room, not the
  activity. The child is the cast's 5-year-old (`03-cast.md:11`), so no grown-up is needed in frame (the page's age-3
  line; voice rule 17). From task 5.20's screen-time pool. It also heads the screen-free toys guide, with this alt word
  for word (the photo's one alt); the two guides link to each other in neither direction
  ([CMO fix pass](../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md) N1;
  [assets §1](../../engineering/assets.md#1-design-system-assets-used-by-the-approved-pages)). The photo is 16:9, so the
  head takes the wide layout (two even columns, the 16:9 frame), as the safe-AI-toy guide's head; the photo's shape
  sets it. No name or age in the alt; the light on Kheelu is not described (D018). File checked by eye 2026-10-14.

---

## Fold 2 · The answer first (`answer`)

**Fold job:** answer the search in 40 to 60 words, then say what the page holds.

**Copy:**

> **H2:** What are good screen-free activities for kids at home?
>
> Ones that start in seconds and need no grown-up to run them: dough, crayons and paper, a blanket fort, a box of blocks, real jobs like matching socks or washing potatoes, and stories played aloud. Set them up in the room where you are, and keep a few ready on one low shelf.
>
> Below: ten-second setups, real jobs, ideas by age, and what to do on the days you have to work.

- Answer: 53 words. `answer.question` is the H2, `answer.answer` the first paragraph, `answer.detail` one `p`.
- Built from the ST5 draft ([keyword map §6.7](../../research/keyword-map.md#67-screen-time)) and the live article's
  idea; advice only, so no marker. "Need no grown-up to run them" and "in the room where you are" sit together on
  purpose: the child plays on their own, with a grown-up nearby ([D041](../../decisions/D041-gate-a-round-1.md), "Age 3").
  "Stories played aloud", not "told": a told story needs a teller, which the list's "need no grown-up" rules out
  (CMO M15).

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
> - a cup of water and a paintbrush, to "paint" an old slate
> - steel dabbas and their lids, to match up
> - old newspaper, to tear into the world's biggest salad
> - a bedsheet over two chairs: a house until dinner
> - dough, a small rolling pin and a few cutters
> - a cardboard box, which can be a car, a cave and a shop before lunch
>
> The plainer the thing, the more games it can be.

- `list`, `bullets` (or `tips` with DS icons, the builder's pick). The H2 is the keyword map's (§5.2).
- Every set-up uses large, everyday things a 3-year-old can use with a grown-up in the room: no balcony, nothing
  small enough to swallow, no knife, and no water on the floor. The water painting goes on an old slate: the wet slate
  darkens, dries and starts again, and nobody slips on wet tiles (CMO M14, whose reason for a slate is that a school
  slate is a common thing in Indian homes; the copy makes no claim about it).

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
> For the stretches you can't be interrupted, pick a quiet activity and set it up in the room where you work: water and a brush, dough, crayons on a roll of paper.
>
> Save the ones that talk (a story played aloud, a grandparent on a voice call) for the stretches when you can listen with half an ear.
>
> [Kheelu](https://kheelona.com/products/kheelu) is one more screen-free option for those stretches: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.
>
> Most of this page needs no technology at all: a shelf, a basket of socks, a cardboard box.

- Link target `/products/kheelu` (the page's one in-text product link, [strategy §3.3](../strategy.md#33-placement-and-repetition)).
- "Answers your child, then asks a question back": D017's form (CMO review S6). "In the room where you work" and
  "keep a grown-up nearby" keep the parent present on a work day; nothing suggests leaving a child alone with a toy.
- Quiet set-ups for the call, talking ones for later (CMO M13): a story played aloud, a grandparent on a call or a
  toy that talks back cannot sit beside a work call, so the page no longer suggests one there. "Water and a brush"
  is fold 4's slate painting. Kheelu talks, so its line now says "for those stretches", the ones when you can listen
  with half an ear.
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
> - Screen time and tantrums: what is actually happening
> - Why the early years matter most

| Title (card title, from each module, as the hub prints it) | Real URL |
|---|---|
| The gentle way off the phone: a seven-day plan | `/stories/the-gentle-way-off-the-phone` |
| Screen time and tantrums: what is actually happening | `/stories/screen-time-and-tantrums` |
| Why the early years matter most | `/stories/why-three-to-six-are-the-years-that-matter-most` |

Text links only, so the page keeps one DS child. The list is the related ring of
[CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md), finding m3 (task 7.1d): the gentle-way plan stays
first, and the tantrums and early-years guides take the places of the data-law and safe-AI-toy guides, which m3 found
off-topic after a guide on screen-free activities at home (task 6.5 had put the data-law guide in the removed
3-6-9-12 guide's place, [D053](../../decisions/D053-remove-the-3-6-9-12-article.md)). Why each: the gentle-way plan
fills the times the phone comes out, one slot at a time, with set-ups like these; the tantrums guide covers the moment
the screen goes off; the early-years guide is about the ordinary things that fill those years well, play among them.
Every guide keeps three related guides and three incoming links (`articles.test.ts:100-113`), and none of the three
shares this page's head photo (`ira-02`): gentle way `tara-01`, tantrums `kabir-03`, early years `tara-04` (task
5.20a's rule).

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
| Alt text describes the image | Yes | The dragon-drawing photo as it is, Kheelu named; no keyword forced |
| Density | Yes | "screen-free activities" 3 times in `<main>` (H1, fold 2 H2, fold 6 H2): about 1% of about 620 words; "Kheelu" 3 times including the close and its button (0.5%) |
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
| Set-ups, jobs, ideas by age, the work-day advice (quiet set-ups during a call, talking ones for later) | Plain advice in our voice (no research claim); safety choices noted under folds 4 and 6; the work-day split under fold 9 (CMO M13) |
| Card title and summary, dates | `src/content/en-IN/stories/articles/busy-hands-no-screens.ts` (stub); [stories §2](stories.md#fold-2--screen-time-screen-time) card 5; live dates `src/lib/stories-expansion.ts:259-260` |
| Related list (fold 11) and its titles | [CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md) m3, the ring table (task 7.1d); titles: each guide's card title as the hub prints it (`src/content/en-IN/stories/hub.ts:116-119` reads it from the guide's module; [stories](stories.md) folds 2 and 5) |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Cut live lines | `src/lib/stories-expansion.ts:269-272` (unsourced claims and a promise) |
| Photo | DS `03-cast.md:113` (Ira 02, "Creativity and imagination, web hero"; Ira is 5, `03-cast.md:11`); task 5.20's screen-time pool ([tasks](../../engineering/tasks.md), 5.20); also the screen-free toys guide's head, with the same alt, and neither guide links to the other ([CMO fix pass](../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md) N1; [assets §1](../../engineering/assets.md#1-design-system-assets-used-by-the-approved-pages)); file checked by eye 2026-10-14 |

## Changes after approval (task 5.20a)

The CMO approved this page in round 1 with four minor fixes for it
([CMO review, 5.17](../../qa/cmo-review-articles-5.17-2026-10-14.md): M13, M14, M15, M16). Task 5.20a applied them,
and nothing else in the Copy blocks changed. No research statement was added or changed.

1. **Fold 9, the work-day advice (M13).** Was one paragraph: "For the stretches you can't be interrupted, set the
   activity up in the room where you work, and add something that talks: a story, told or played aloud, in your home
   language, or a grandparent on a voice call." Now two, in the CMO's words: "… pick a quiet activity and set it up in the
   room where you work: water and a brush, dough, crayons on a roll of paper." and "Save the ones that talk (a story
   played aloud, a grandparent on a voice call) for the stretches when you can listen with half an ear." The product line
   after them now reads "… is one more screen-free option for those stretches: …" (rest unchanged). Why: the page's own
   scene is a parent whose call starts in ten minutes; something that talks beside a work call is the one thing that
   parent cannot have. "In your home language" went with the old sentence, as the CMO's fix has it. One word differs
   from the CMO's text: "a quiet activity" for "a quiet one", because "one" straight after "the stretches" can read as a
   quiet stretch. Split into two paragraphs for the phone (one idea each).
2. **Fold 4, the first set-up (M14).** Was: "a cup of water and a paintbrush, to "paint" the floor tiles". Now: "… to
   "paint" an old slate". Why: water on floor tiles is a slip waiting to happen at 3; the slate dries and starts again.
   The "What changed from the live article" paragraph and fold 4's note follow.
3. **Fold 2, the answer (M15).** Was: "… and stories told or played aloud." Now: "… and stories played aloud." Why: the
   answer lists things that "need no grown-up to run them", and a told story needs a teller. The answer is 53 words
   (was 55), inside 40 to 60.
4. **Fold 1, the head photo and its alt (M16).** Was the paper-crown photo (`ira-04`), which also heads the tantrums
   guide, whose related list sends readers here, with a different alt there. Now `ira-02-drawing-the-dragon`, with its
   own alt. Why: M16 asked for a head that no linked guide shares. The CMO suggested `myra-04`, but task 5.20 moves the
   screen-time guides off the no-Kheelu set (`-04`, `-05`), which the talking guides need, onto a pool of unused photos
   with Kheelu ([tasks](../../engineering/tasks.md), 5.20). From that pool, `ira-02` shows one of this page's own set-ups
   (crayons on a big sheet on the floor) with Kheelu as one more thing in the room; Ira is 5, so the page's age-3 line
   needs no grown-up in frame. The pool's 3-year-old photo (`myra-02`) shows Myra alone with Kheelu, which this page's
   age-3 line rules out (voice rule 17). The photo is 16:9, so the head takes the wide layout. At the fix pass
   ([CMO](../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md) N1) the screen-free toys guide took `ira-02` too, with
   this page's alt word for word; the two guides link to each other in neither direction. This page's Copy is unchanged.
5. **Notes kept true:** read time about 620 words (3 min, unchanged); the answer's word count; the keyword table's alt
   and density rows; the Sources table's work-day and Photo rows; the front matter's sources.

## Changes after approval (task 7.1d)

[CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md), finding m3 (which folds in
[CMO 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md) M6), rebalances the journal's related ring: 14 slot changes
across 10 guides ([tasks](../../engineering/tasks.md), 7.1d). On this page only fold 11's list changed.

1. **Fold 11, related guides (m3).** Was: "The gentle way off the phone: a seven-day plan", "What India's data law asks
   of a toy that listens", "What to look for in a safe AI toy". Now: "The gentle way off the phone: a seven-day plan",
   "Screen time and tantrums: what is actually happening", "Why the early years matter most". Why: after a guide on
   screen-free activities at home, two of the three next steps were about data law and AI toys
   (`busy-hands-390-motion-04.jpg`, `-05.jpg`): the safe-AI-toy guide from the legacy ring, and the data-law guide from
   the swap task 6.5 made when the 3-6-9-12 guide left (D053). The titles are each guide's card title, as the hub
   prints them.
2. **Checked against the whole ring after m3:** every guide has three related guides and three incoming links; this
   page is linked from the screen-time, tantrums and gentle-way guides; no guide it links to, or that links to it,
   shares its head photo (`ira-02`); the screen-free toys guide, which shares `ira-02`, still links to it in neither
   direction (fold 1's note stands).
3. **Notes kept true:** the At a glance "Related" row, fold 11's table and note, the Sources table (the related list
   now has its own row), the front matter's sources. No other Copy block changed: the body (about 620 words, 3 min),
   title, meta, keyword placements (neither new title carries the primary or "Kheelu", so the density row stands) and
   research sources are as approved. No placeholder.
4. **For the builder:** `busy-hands-no-screens.ts:26` becomes `related: ["the-gentle-way-off-the-phone",
   "screen-time-and-tantrums", "why-three-to-six-are-the-years-that-matter-most"]`, and the header note's words on the
   data-law guide (lines 10-12) follow.
