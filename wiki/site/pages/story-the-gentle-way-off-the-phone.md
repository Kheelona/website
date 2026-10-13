---
title: "Story: The gentle way off the phone (/stories/the-gentle-way-off-the-phone): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link, §5 /stories/* row)
  - ../../engineering/tasks.md (wave 5 part C paragraph; task 5.17 row; the note on the 18 articles without a mockup)
  - ../pages/story-learning-toys-for-a-three-year-old.md (approved format, the age lines, the close)
  - ../pages/stories.md (fold 2 card 4: title and summary, kept word for word; fold 6 close)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../content-boundary.md
  - ../../research/keyword-map.md (§2.3 LRN-3, §4.2, §5.1, §5.2, §6.7 ST6)
  - ../../research/source-verification.md (§3.2 C32, C33, C35; §4 C32, C33; §5)
  - "../../raw/research/sources/: C32-iap-2022-screen-time-digital-wellness.md, C33-aap-2016-media-and-young-minds.md, C35-hiniker-2016-screen-time-tantrums.md"
  - ../../product/claims.md (§1, §4), ../../product/facts.md (identity, age, parent app), ../../product/age-band-review.md (row 43)
  - ../../brand/voice.md, ../../brand/messaging.md (words to stop using; CMO S6 on "asks a question back")
  - ../../decisions/D013, D015, D016, D017, D025, D026, D041
  - "src/content/en-IN/stories/articles/the-gentle-way-off-the-phone.ts (stub: card, related, dates), read in the w5c-5.17 worktree 2026-10-14"
  - "src/lib/stories-expansion.ts:67-90 (the live article, legacy input only), read in the same worktree"
  - design-system/project/01-writing.md:19-26,33,111-113; 03-cast.md:9-13, 79-81, 117 (read-only)
  - ../../qa/cmo-review-articles-5.17-2026-10-14.md (M11, M12, M16; applied by task 5.20a, see the foot of this page)
  - ../../engineering/tasks.md (5.20, the screen-time photo pool) and ../../engineering/assets.md (§1, the pool photos' other uses)
---

# Story: The gentle way off the phone

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review (task 5.17 copy stage) and
> the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` and `²` are source markers under [D026](../../decisions/D026-public-statistics.md): each links to its note
  in the "Sources" list at the foot of the article; numbered in reading order, reused when a source returns.
  Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template, and its
  visual acceptance is template parity with `story-learning-toys-for-a-three-year-old.html`
  ([tasks, wave 5 note](../../engineering/tasks.md)).
- Each fold names the template block it maps to (`Article` in `src/content/types.ts`).

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/the-gentle-way-off-the-phone` |
| Page job | Win "how to reduce screen time" for parents of 3 to 7 year olds with a calm plan they can start today, anchored in the Indian Academy of Pediatrics' and the American Academy of Pediatrics' published advice; route to the product page once, calmly ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **how to reduce screen time** (LRN-3; KP 10-100 "toys to reduce screen time", 2026-09-05); secondary "stop mobile addiction in a child" is deliberately not placed (see keyword placements) ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (57 characters) | How to reduce screen time: a gentle 7-day plan · Kheelona |
| Meta description (138 characters) | How to reduce screen time gently: a seven-day plan for 3 to 7 year olds, and the screen-free times the Indian Academy of Pediatrics names. |
| H1 | The gentle way off the phone: a seven-day plan to reduce screen time |
| Card (hub, unchanged) | Title "The gentle way off the phone: a seven-day plan"; summary "A week-long plan to cut a young child's screen time without turning your home into a battlefield." ([stories §2](stories.md#fold-2--screen-time-screen-time), card 4) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read (byline: question 1) |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| Related (unchanged) | `screen-time-and-tantrums`, `busy-hands-no-screens`, `screen-time-rules-parents-swear-by` |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 9 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"` (pre-order close and sticky bar); breadcrumb topic "Screen time" (`/stories#screen-time`) |

**What changed from the live article** (`src/lib/stories-expansion.ts:67-90`): the answer comes first; the
brand name of a video app is gone from the opening scene (`:82`); three unsourced generalisations are cut or
turned into plain advice ("Going cold turkey usually fails", `:83`; "You will usually find two or three, not ten",
`:84`; "Children accept rules they can predict far better than moods they cannot", `:87`); the plan now rests on
the published guidance, each line marked: the Indian Academy of Pediatrics' limits and its three screen-free times,
and the American Academy of Pediatrics' screen-free rooms and times "for children and parents"
([source verification C32, C33](../../research/source-verification.md#32-screen-time)); no countdown or warning tip
appears, because the one study read found two-minute warnings made young children more upset
([C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch)); the closing "anyone or anything that
genuinely listens" (an implied pitch with no age line, and a DS avoid-word) becomes one plain product line with the
age limits; the author byline becomes "The Kheelona team" (question 1).

---

## Fold 1 · Article head (`head`)

**Fold job:** say what the page gives and to whom, in the first phone screen, with the hub card's words.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** The gentle way off the phone: a seven-day plan to reduce screen time
>
> A week-long plan to cut a young child's screen time without turning your home into a battlefield.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "gentle way" (`The {hand:gentle way} off the phone: …`).
- **H1:** the hub card's title word for word, then the primary ("to reduce screen time"), so a parent who tapped the
  card lands on its words and the search term sits in the one H1 (question 2).
- **Lead:** the hub card's summary, word for word.
- Breadcrumb links: "Stories" → `/stories`; "Screen time" → `/stories#screen-time` (from `topics.ts`).
- **Read time:** about 660 words in the article body.
- **Image** (`head.image`, `kh-photo`, 4:5): `tara-01-naming-feelings-web.webp`. Alt: "A curly-haired girl in denim
  dungarees sits on a wooden floor by a sunlit window lined with potted plants, Kheelu in her lap, touching its nose
  with one finger." The DS photo for "Feelings" and hero shots (`03-cast.md:117`), with Kheelu: a calm, quiet moment
  at home with no screen in sight, for the plan whose aim is a week without fights. The child is the cast's 5½-year-old
  (`03-cast.md:12`), so no grown-up is needed in frame (the page's age-3 line; voice rule 17). It is from task 5.20's
  screen-time pool and heads no other page ([assets §1](../../engineering/assets.md#1-design-system-assets-used-by-the-approved-pages)).
  No name or age in the alt (the cast is illustrative); the light on Kheelu is not described (D018). File checked by
  eye 2026-10-14.

---

## Fold 2 · The answer first (`answer`)

**Fold job:** answer the search in 40 to 60 words, then hand over to the plan.

**Copy:**

> **H2:** How do I reduce my child's screen time?
>
> Go slowly, and fill the gap before you take anything away. Find the times of day the phone usually comes out, replace them one at a time with play, stories, songs or a small job, and stop screens at a natural break, not mid-episode. Keep meals and the hour before bed screen-free, for the grown-ups too.
>
> Here it is as a seven-day plan. Start on any day of the week.

- Answer: 56 words. `answer.question` is the H2, `answer.answer` the first paragraph, `answer.detail` one `p`.
- The ST6 question from the [keyword map §6.7](../../research/keyword-map.md#67-screen-time), with two fixes: its
  "warn before the screen goes off" is dropped (C35: two-minute warnings made children more upset), and its
  unsourced "children notice the screen habits of the grown-ups around them" becomes plain advice ("for the
  grown-ups too"), which fold 4 anchors to the AAP.
- Advice in our voice, so no marker here; fold 4 carries the markers for meals, bed and the grown-ups.

---

## Fold 3 · Why replace before you remove (`part`)

**Fold job:** name the parent's situation without blame, and set up the plan's one idea.

**Copy:**

> **H2:** Why replace before you remove?
>
> Nobody plans for their 4-year-old to find the video app faster than they can. It happens one busy evening at a time.
>
> The phone came in because it solved something: a work call, a bored child, the queue at the clinic. Take it away without replacing what it did, and the gap turns into a fight.
>
> So this plan replaces first and removes second.

- No research claim: a scene and our own reasoning. No "addiction", no "detox" (DS `01-writing.md:33`: don't shame
  parents).

---

## Fold 4 · What are you aiming for? (`part`)

**Fold job:** give the published target and the times to start with, sourced, then lower the pressure.

**Copy:**

> **H2:** What are you aiming for?
>
> The Indian Academy of Pediatrics says at most one hour of supervised screen time a day from two to five. From five to ten, it says less than two hours a day, including screens used for homework. For both ages, it adds: "the lesser, the better".¹
>
> For children aged two to five, it also says not to use screens during meals, within an hour before sleep, or "during surface travel": in the car, on the bus, on the train.¹
>
> The American Academy of Pediatrics asks families of young children to keep bedrooms, mealtimes and playtime together screen-free, for parents as well as children.²
>
> You don't need to get there this week. The plan starts with one slot. For the numbers age by age, read [How much screen time is okay for a young child?](https://kheelona.com/stories/how-much-screen-time-for-a-3-to-6-year-old)

- Paragraph 1 is C32's verified line (limits, "supervised", "the lesser, the better" in both bands, the 5 to 10
  band counting homework screens). Paragraph 2 is the IAP's own item for 24 to 59 months, quoted ("during surface
  travel") with a plain gloss. Paragraph 3 is the AAP's "Keep bedrooms, mealtimes, and parent–child playtimes screen
  free for children and parents", from "Media and Young Minds" (ages 0 to 5, hence "families of young children").
- Ages are written in words ("two to five"), as the guidance states them; nothing implies Kheelu suits a child
  under 3 (third-party guidance, [age-band review](../../product/age-band-review.md) row 43).
- The link goes to the screen-time-by-age guide (task 5.17, the other copywriter): one next step for the fold. The
  card title is the hub's (`stories.md` fold 2 card 1).

---

## Fold 5 · Days 1 and 2 (`part`)

**Copy:**

> **H2:** Days 1 and 2: notice when the phone comes out
>
> Change nothing yet. Notice when the phone appears: the morning rush, the cooking hour, the car, the queue at the clinic.
>
> Each one is a job the phone was hired to do. Write them down. That list is your plan for the week.

---

## Fold 6 · Days 3 and 4 (`part`)

**Copy:**

> **H2:** Days 3 and 4: replace the easiest slot
>
> Pick the slot where the stakes are lowest. Fill it with something that talks back or keeps hands busy. A story, told or played aloud, in your home language. A grandparent on a voice call. A puzzle you started together at breakfast, waiting on the table.
>
> Leave the hard slots alone for now. One calm win is worth more than three fights.
>
> Need more ideas for the slot? Try [Busy hands, no screens](https://kheelona.com/stories/busy-hands-no-screens).

- Advice only. The link is this task's own article (also in the related list): the one next step for the fold.

---

## Fold 7 · Days 5 and 6 (`part` with a `callout`)

**Copy:**

> **H2:** Days 5 and 6: shrink the rest, don't snatch
>
> In the slots that are left, end the screen at a natural break: the end of an episode, not the middle of a scene.
>
> Then land it somewhere: a job, a snack, a spot-the-crow contest at the window. Have the next thing ready before the screen goes dark.
>
> **Try this:** before the screen goes on, say where it will land: "One episode, then we water the plants."
>
> If switching off is the hard part, read [Screen time and tantrums](https://kheelona.com/stories/screen-time-and-tantrums).

- **Try this** is a `callout` (lead "Try this:", icon the builder's pick from the DS set, as the learning-toys page's
  `book-open`).
- Plain advice, no marker. The natural-break line is not attributed to research here: C35's ready line belongs to
  the tantrums guide, which this fold links to. "Say where it will land before the screen goes on" agrees the end at
  the start; it is not a countdown, which C35 advises against ([source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch): "Never a countdown tip").

---

## Fold 8 · Day 7 (`part`)

**Copy:**

> **H2:** Day 7: say the new rules out loud
>
> Tell your child what changed, in the language you speak at home: mornings are for songs now, the car is for spotting autos, dinner is for talking.
>
> Say it the same way every time, so it sounds like a rule, not a mood. And keep the rule yourself: at meals and at playtime together, the American Academy of Pediatrics suggests parents set their phones to "do not disturb".²

- The marker covers the AAP's "Parents can set a 'do not disturb' option on their phones during these times." The
  AAP's "these times" are the ones its sentence before names: mealtimes and parent–child playtimes (bedrooms are a
  place). So the line names meals and playtime together, not the mornings and the car of the line above, which are our
  own advice (CMO M11; excerpt `C33-aap-2016-media-and-young-minds.md:66-67`).

---

## Fold 9 · Week 2, and where Kheelu fits (the one in-text product link) (`part`)

**Fold job:** reassure without a promise, then one calm, honest product line with its age limits.

**Copy:**

> **H2:** Week 2: expect a wobble
>
> Some days will slip: a long journey, a sick day, a deadline. It happens. Go back to your list and pick up where you stopped.
>
> Look at what your slots needed in the end: something to do, and someone to talk to, whether that is you, a grandparent or a sibling.
>
> For the slots where your hands are full, [Kheelu](https://kheelona.com/products/kheelu) is one screen-free option. It is a plush toy for ages 3 to 7 that answers your child, then asks a question back, and you can read every conversation in the parent app. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.

- Link target `/products/kheelu` (the page's one in-text product link, [strategy §3.3](../strategy.md#33-placement-and-repetition)).
- "Someone to talk to" names the people a slot needs (you, a grandparent, a sibling) before the product line, so the
  toy that "answers your child" is never read as the someone the slot was missing (CMO M12; voice rule 8, the parent
  stays central).
- "Answers your child, then asks a question back" is D017's form, said the same way everywhere (CMO review S6).
  "Read every conversation in the parent app" keeps the parent in charge (D017). "Where your hands are full" sits
  beside "keep a grown-up nearby", so nothing suggests leaving a child alone with the toy.
- No brain or language line anywhere on this page ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 10 · Sources (`sources`)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
>
> ² American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591

- The same list becomes the BlogPosting `citation` array. Citation wording as in
  [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines) (C32, C33).

---

## Fold 11 · Related guides (template, from `related`)

**Copy:**

> **H2:** Related guides
>
> - Screen time and tantrums: what is actually happening
> - Busy hands, no screens
> - The 3-6-9-12 rule, and other screen rules parents swear by

| Title (card title, from each module) | Real URL |
|---|---|
| Screen time and tantrums: what is actually happening | `/stories/screen-time-and-tantrums` |
| Busy hands, no screens | `/stories/busy-hands-no-screens` |
| The 3-6-9-12 rule, and other screen rules parents swear by | `/stories/screen-time-rules-parents-swear-by` |

Text links only (no photos), so the page keeps one DS child. The list is the stub's, unchanged.

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
| Title ≤ 60, primary at the start | Yes | 57 characters, "How to reduce screen time" first (the §5.2 draft) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 138 characters; the plan, the age band, the IAP's screen-free times |
| One H1 with the primary | Yes | "… a seven-day plan to reduce screen time" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "How do I reduce my child's screen time?" (close variant, the ST6 question) and its 56-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2 |
| The §5.2 H2 ("Day one") | Yes, adapted | "Days 1 and 2: …", "Days 3 and 4: …", "Days 5 and 6: …", "Day 7: …" (numerals, DS `01-writing.md:23`) |
| Alt text describes the image | Yes | The naming-feelings photo as it is, Kheelu named; no keyword forced |
| Density | Yes | "reduce screen time" once in `<main>` (H1) plus the close variant in the fold 2 H2: about 0.9% of about 660 words; "Kheelu" 3 times including the close and its button (0.5%) |
| Secondary "stop mobile addiction in a child" | Not placed, on purpose | DS `01-writing.md:33` says "screen-free", never "screen addiction" ("Don't shame parents"); the page answers the same intent in the answer block |
| Words never placed | Yes | No countdown or warning tip (C35), no "addiction" or "detox", no brain or speech lines, no app or competitor brand names, no price in the body |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |
| In-text links (product page, two guides) | text links | none (not buttons) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live article is by Kashyap C.R, a co-founder named on `/team`. (a) "The Kheelona team" (as
   drafted; the rewrite is new words); (b) Kashyap C.R, after he reads and owns the rewrite. **Recommend (a)**, unless
   Kashyap wants his name on it, as Aman Soni kept his on the safe-AI-toy guide.
2. **H1 pattern (same on all three task 5.17 pages written here).** (a) The hub card's title, then the primary
   (as drafted: "The gentle way off the phone: a seven-day plan to reduce screen time"); (b) the card title alone,
   with the primary only in the title tag, meta and answer H2 (misses keyword rule 2); (c) the keyword map's title as
   the H1 ("How to reduce screen time: a gentle 7-day plan"), so the page head no longer matches the hub card the
   parent tapped. **Recommend (a)**: card and head match, and the search term is in the H1. It runs to three lines on a
   phone.
3. **`updated` date (for the main session).** (a) Keep the stub's 2026-07-31, as the task note says; (b) the rewrite's
   merge date, as task 5.6 set for the three approved guides (`updated` is the BlogPosting `dateModified` and the
   sitemap `lastmod`; the byline shows only "First published"). **Recommend (b)**: a full rewrite with a July
   `dateModified` under-reports the change to search engines, and 5.6 set the precedent. Drafted as (a) until the main
   session rules.

## Sources

| Claim | Source |
|---|---|
| IAP: at most one hour of supervised screen time a day for 24 to 59 months, sessions supervised; under two hours a day for 5 to 10, including screen time for school and extra-curricular assignments; "the lesser, the better" in both | [source verification C32](../../research/source-verification.md#c32--the-indian-academy-of-pediatrics) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C32-iap-2022-screen-time-digital-wellness.md:30-34, 44-49, 53-56` |
| IAP: "Do not use screen media during meals, within one hour before sleep, or during surface travel" (24 to 59 months) | excerpt `C32-iap-2022-screen-time-digital-wellness.md:51` (p. 239, item 2) |
| AAP: "Keep bedrooms, mealtimes, and parent–child playtimes screen free for children and parents"; "Parents can set a 'do not disturb' option on their phones during these times" (fold 8 names those times: meals and playtime together, CMO M11) | [source verification C33](../../research/source-verification.md#c33--the-american-academy-of-pediatrics); excerpt `C33-aap-2016-media-and-young-minds.md:66-68` (Recommendations: Families; the statement covers ages 0 to 5, line 12) |
| No countdown tip; the natural-break line kept as plain advice | [source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch) ("Never a countdown tip"); excerpt `C35-hiniker-2016-screen-time-tantrums.md:48-49` |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Parents read every conversation in the parent app | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)); [facts, parent app](../../product/facts.md#parent-app) |
| Not a toy for children under 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md) (never imply under 3); as on the [learning-toys guide](story-learning-toys-for-a-three-year-old.md#fold-12--where-kheelu-fits-the-one-in-text-product-link) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Card title and summary, related list, dates | `src/content/en-IN/stories/articles/the-gentle-way-off-the-phone.ts` (stub); [stories §2](stories.md#fold-2--screen-time-screen-time) card 4; live dates `src/lib/stories-expansion.ts:74-75` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Cut live lines | `src/lib/stories-expansion.ts:82-88` (unsourced generalisations; "genuinely", DS `01-writing.md:26`) |
| Photo | DS `03-cast.md:117` (Tara 01, "Feelings … hero shots"; Tara is 5½, `03-cast.md:12`); task 5.20's screen-time pool ([tasks](../../engineering/tasks.md), 5.20); used on no other page ([assets §1](../../engineering/assets.md#1-design-system-assets-used-by-the-approved-pages)); file checked by eye 2026-10-14 |

## Changes after approval (task 5.20a)

The CMO approved this page in round 1 with three minor fixes for it
([CMO review, 5.17](../../qa/cmo-review-articles-5.17-2026-10-14.md): M11, M12, M16). Task 5.20a applied them,
and nothing else in the Copy blocks changed. No new research statement was added.

1. **Fold 8, the "do not disturb" line (M11).** Was: "… the American Academy of Pediatrics suggests parents set their
   phones to "do not disturb" at those times.²" Now: "… at meals and at playtime together, the American Academy of
   Pediatrics suggests parents set their phones to "do not disturb".²" Why: "those times" pointed back to mornings, the
   car and dinner, but the AAP's "during these times" means mealtimes and parent–child playtimes
   (`C33-aap-2016-media-and-young-minds.md:66-67`). Same source and marker; the line now says only what the source says.
2. **Fold 9, the sentence before the product line (M12).** Was: "… something to do, and someone to answer." Now:
   "… something to do, and someone to talk to, whether that is you, a grandparent or a sibling." Why: read straight into
   "Kheelu … answers your child", the old line made the toy the someone the slot needed (voice rule 8: the parent stays
   central). The product line after it is unchanged.
3. **Fold 1, the head photo and its alt (M16).** Was the reading-nook photo (`tara-04`), which also heads the
   screen-time-by-age guide this page links to (fold 4), with a different alt there. Now `tara-01-naming-feelings`, with
   its own alt. Why: M16 asked for a head that no linked guide shares. The CMO suggested `kabir-04`, but task 5.20 moves
   the screen-time guides off the no-Kheelu set (`-04`, `-05`), which the talking guides need, onto a pool of unused
   photos with Kheelu ([tasks](../../engineering/tasks.md), 5.20). From that pool, `tara-01` fits a calm, gentle plan; Tara
   is 5½, so the page's age-3 line needs no grown-up in frame. The photo is still 4:5, so the head keeps its layout.
4. **Notes kept true:** read time about 660 words (3 min, unchanged); the keyword table's alt and density rows; the
   Sources table's AAP and Photo rows; the front matter's sources.
