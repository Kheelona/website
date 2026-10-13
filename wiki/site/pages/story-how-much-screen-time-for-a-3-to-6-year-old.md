---
title: "Story: Screen time for a 3-year-old, and up to age 7 (/stories/how-much-screen-time-for-a-3-to-6-year-old): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link; §5 /stories/* row)
  - ../pages/stories.md (fold 2 card, lines 117-119; fold 6 journal close)
  - ../pages/story-learning-toys-for-a-three-year-old.md (format, close, sticky bar, age lines)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../url-map.md (§1b, line 116)
  - ../../research/keyword-map.md (§4.2 row LRN-1, line 239; §5.1; §5.2 line 354; §5.3 line 409; §6.7 ST1, ST2, lines 623-627)
  - ../../research/source-verification.md (§3.2 C06, C31, C32, C33, lines 117-120; §4 ready lines, lines 260-271, 381-416)
  - "../../raw/research/sources/: C06-khobragade-shenoy-2025-cureus-under-five-screen-time.md, C31-who-2019-guidelines-under-5.md, C32-iap-2022-screen-time-digital-wellness.md, C33-aap-2016-media-and-young-minds.md, C33-aap-2016-school-aged-media-use.md"
  - ../../product/claims.md (§1, §4, §8), ../../product/facts.md, ../../product/age-band-review.md (row 43)
  - ../../decisions/D016, D025, D026, D041
  - ../../brand/voice.md, ../../brand/messaging.md, ../content-boundary.md
  - "test/guards/banned-phrases.data.ts; test/e2e/content-integrity.spec.ts:25-41 (age band, under-3, analytics words)"
  - "src/lib/stories-expansion.ts:9-42 (the live article; legacy file, input only), read in the w5c-5.17 worktree 2026-10-14"
  - "src/content/en-IN/stories/articles/how-much-screen-time-for-a-3-to-6-year-old.ts (stub: card, related, dates); src/content/types.ts:356-469 and src/layouts/ArticleTemplate/ArticleTemplate.tsx (the blocks the template renders)"
  - design-system/project/03-cast.md:120; 01-writing.md:19-26 (read-only)
---

# Story: Screen time for a 3-year-old, and up to age 7

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁵` are source markers under [D026](../../decisions/D026-public-statistics.md) and
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults): each links to its note in the
  "Sources" list at the foot of the article; numbered in reading order, reused when a source returns.
  Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template
  (`src/layouts/ArticleTemplate/`), and each fold below names the block it uses.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/how-much-screen-time-for-a-3-to-6-year-old` (no mockup; template parity with `story-learning-toys-for-a-three-year-old.html`) |
| Page job | Answer "how much screen time for a 3-year-old" and each age up to 7 from the WHO, IAP and AAP, sourced; give a parent something to do at 6 pm; route to the product page once, calmly ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **how much screen time for a 3-year-old** (LRN-1; KP no data, unmeasured); secondaries "screen time by age", "WHO, IAP and AAP guidance" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (56 characters) | Screen time for a 3-year-old, and up to age 7 · Kheelona |
| Meta description (132 characters) | Screen time for a 3-year-old: no more than an hour a day, say the WHO and the IAP. What changes up to age 7, and what to do at 6 pm. |
| H1 | Screen time for a 3-year-old, and up to age 7 (question 2) |
| Card (hub, unchanged) | Title "How much screen time is okay for a young child?"; summary "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm." ([stories.md](stories.md) fold 2, line 117; the stub) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 4 min read (byline: question 1) |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 10 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"` (related guides, then the journal close; the shell's sticky bar follows the close) |

**What changed from the live article** (`src/lib/stories-expansion.ts:9-42`): the opening "For ages two to
four ... Under two: none" and the AAP's "video call ... for the very young" are gone (the page starts at 3;
[age-band review](../../product/age-band-review.md) row 43; keyword map §6 drafts no under-3 screen query);
"the [WHO guideline] is the one most others lean on" is cut ([source verification C31](../../research/source-verification.md#c31--the-who-guideline),
caveat 2); the AAP's "about an hour a day" becomes a ceiling (C33 caveat 1); "All three spend less ink on the
hour ..." becomes the AAP's own stated reason, quoted; "slow, simple programmes beat fast ones, because young
children cannot follow quick cuts" and "apps stuffed with distracting extras teach less" become the AAP's own
words; the Romeo paragraph leaves (one idea per fold; its "overheard" wording fails C09 caveat 3); "sleep is
when the day's learning gets filed away" (C43 caveat 2) and "It takes about a week to feel normal" (no source)
are cut; the age-6 and age-7 advice is added from the IAP and the AAP's 5-to-18 statement (the live article
stopped at 5); "a screen-free friend that talks, in the languages you speak at home" becomes the confirmed
product line. The live sources move to the copies the verifiers read (WHO IRIS, the IAP journal PDF, the AAP
DOIs). The live byline is a co-founder (question 1).

---

## Fold 1 · Article head

**Fold job:** say what the page answers and for which ages, in the first phone screen. Renders as `ArticleHead`.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** Screen time for a 3-year-old, and up to age 7
>
> What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm.
>
> The Kheelona team · First published 28 Jul 2026 · 4 min read

- **H1 accent:** `Hand` on "up to age 7"; `nowrap` on "3-year-old,".
- **Lead:** the hub card's summary, word for word (stub; [stories.md](stories.md) line 117), as the late-talker
  guide does.
- Breadcrumb links: "Stories" → `/stories`; "Screen time" → `/stories#screen-time` (topics.ts).
- **Read time:** about 750 words in `<main>` before the sources and close.
- **Image** (after the lead, `kh-photo`, 4:5): `tara-04-reading-nook-web.webp`. Alt: "A girl in a coral
  block-print kurta sits cross-legged in a window nook, reading a picture book aloud and pointing at the page."
  DS: "Reading and school readiness" (`03-cast.md:120`), no Kheelu (a parenting guide without selling); file
  checked by eye 2026-10-14. No name or age in the alt.

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, then frame the rest of the page. Renders as `AnswerSection`
(question, answer, two `p` details).

**Copy:**

> **H2:** How much screen time for a 3-year-old?
>
> No more than an hour a day, and less is better. The World Health Organization and the Indian Academy of Pediatrics both say so for three and four year olds.¹ ² What the screen replaces matters too: talking, play, sleep and moving about. When your child does watch, sit with them and talk about it.
>
> That hour is a ceiling, not a target.
>
> Below: what changes at each age up to 7, and what to do when the evening gets hard.

- Answer block: 54 words (markers excluded). The first two sentences are the WHO (3 to 4 years) and the IAP
  (24 to 59 months), C31 and C32; "less is better" is the WHO's words and the IAP's "the lesser, the better".
- "What the screen replaces matters too" and "sit with them" are house lines; folds 7 and 8 anchor them (the
  AAP's stated reason for the limit; its "coview").
- "A ceiling, not a target": the C33 note ("About an hour" softens a limit into a target).

---

## Fold 3 · Age 4

**Fold job:** the single age 4 in a heading, with what is new at 4. Renders as an `ArticlePart` (title, two `p`).

**Copy:**

> **H2:** How much screen time for a 4-year-old?
>
> The same hour. The WHO and the IAP set it for four year olds too.¹ ² The American Academy of Pediatrics sets no more than an hour a day of high-quality programmes for children aged two to five, watched together.³
>
> For this age, the IAP adds two details: no more than 20 to 30 minutes at a time, and a grown-up always supervising.²

- "20 to 30 minutes at a time" is the IAP's "each session not more than 20-30 min" (C32:45). The word
  "session" is avoided: the content-integrity guard reads it as an analytics word (`content-integrity.spec.ts:38`).
- Ages are written in words ("two to five"): the banned-phrases guard refuses the numeral form of that range.

---

## Fold 4 · Age 5

**Copy:**

> **H2:** How much screen time for a 5-year-old?
>
> The WHO's guideline stops at 4.¹ From 5 until 10, the IAP's limit is under two hours a day, the less the better, and that includes time on a screen for homework.²

- C31 caveat 4 (the WHO stops at age 4); C32:53-56 (5 to 10 years, homework included).

---

## Fold 5 · Ages 6 and 7

**Copy:**

> **H2:** How much screen time at 6 and 7?
>
> The IAP's limit of under two hours a day still applies, homework included.² The AAP's advice for children aged 5 to 18 sets no fixed number of hours: it asks families to place consistent limits on time and on the kinds of media used.⁴
>
> Agree the limit with your child, keep it the same every day, and keep screens from crowding out sleep and play.

- The AAP line is C33's ready line from the 5-to-18 statement, never "Media and Young Minds" (source
  verification §5.3: the age-6 advice was misattributed on the live site and in keyword-map ST2).
- One H2 for both ages: their guidance is the same, and two folds would repeat each other (keyword
  placements, below).

---

## Fold 6 · If your child watches more

**Fold job:** one sourced figure, paired with what a parent can do (D026), calm rather than alarming.

**Copy:**

> **H2:** What if your child watches more than that?
>
> You are not alone. Across 10 studies from India, covering 2,857 children under five, children averaged about 2.2 hours of screen time a day. That is more than the guidelines advise.⁵
>
> Cut back a little at a time, and have something ready to fill the gap. Our seven-day plan, [The gentle way off the phone](https://kheelona.com/stories/the-gentle-way-off-the-phone), shows one way to do it.

- C06's verified line, as worded: never "double", never "Indian children average"; "about 2.2"; "studies from
  India" ([source verification C06](../../research/source-verification.md#c06--screen-time-in-india)).
- Link: `/stories/the-gentle-way-off-the-phone`, by its approved card title (being rewritten in the same task).

---

## Fold 7 · What the hour leaves room for

**Copy:**

> **H2:** What the hour leaves room for
>
> The AAP says the one-hour limit for young children is there to leave them "ample time to engage in other activities important to their health and development".³ And when a young child is sitting still, the WHO encourages reading and storytelling with a caregiver.¹
>
> So look at the whole day, not just the minutes. Is there room for talking, playing, moving about and sleep?

- Replaces the live "All three spend less ink on the hour" (not in the documents) with the AAP's own reason
  (C33:44-46) and the WHO's own line (C31:42-43).

---

## Fold 8 · What they watch

**Copy:**

> **H2:** Does it matter what they watch?
>
> Yes. The AAP says well-designed programmes "can improve cognitive, literacy, and social outcomes for children 3 to 5 years of age".³ It also asks parents to avoid fast-paced programmes, which young children do not understand as well, apps with lots of distracting content, and anything violent.³
>
> And it asks parents to watch with their children and help them understand what they are seeing.³
>
> **Try this:** after an episode, ask your child to tell you what happened, and which part they liked best.

- C33:36-37 and 61-64, the exact forms the C33 caveat names. The "can improve" line is said of ages 3 to 5,
  so the page does not claim more for screens than the AAP does, and does not hide it either.
- "Try this" is a `callout` (icon `chat-circle-dots`), a house line.

---

## Fold 9 · Meals and bedtime

**Copy:**

> **H2:** What about meals and bedtime?
>
> For children under five, the IAP and the AAP both say no screens at meals and none in the hour before sleep.² ³ The AAP also asks families to keep bedrooms screen-free.³ The IAP adds car, bus and train journeys to the screen-free list.²
>
> If your evening wind-down leans on a screen, move the screen earlier and put a bath, a story or a song in its place.

- IAP C32:51 ("during meals, within one hour before sleep, or during surface travel"; "surface travel" written
  as car, bus and train journeys); AAP C33:66-68.

---

## Fold 10 · What to do at 6 pm (the one in-text product link)

**Fold job:** habits a parent can use tonight; then one calm product line with its age limits; then the
tantrums guide. Renders as an `ArticlePart`: `p`, `list` (variant `tips`), three `p`.

**Copy:**

> **H2:** What do you do at 6 pm?
>
> Knowing the number does not cook dinner. A few habits worth trying:
>
> - Decide when screen time ends before it starts, and tell your child.
> - End at a natural break, such as the end of an episode, not halfway through.
> - Put something your child enjoys straight after it, so the end is also a start.
> - Keep the screen in a room you share, not the bedroom.
> - Sit with them for a few minutes of it, and talk about what you see.
>
> Looking for something to follow the screen? [Kheelu](https://kheelona.com/products/kheelu) is one screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. If your child is 3, keep a grown-up nearby while they play.
>
> If switching off ends in tears most evenings, read [Screen time and tantrums: what is actually happening](https://kheelona.com/stories/screen-time-and-tantrums).

- Tip icons: `calendar-check`, `pause`, `smiley`, `house`, `users-three` (DS icons, `icons.generated.ts`).
- The tips are house advice; folds 8 and 9 carry the sources for the bedroom and watching together.
- Product line: facts only (screen-free plush toy, ages 3 to 7, answers then asks back); no outcome, no
  brain or speech line anywhere near it ([D016](../../decisions/D016-brain-wording.md),
  [D025](../../decisions/D025-speech-and-language.md)). The grown-up line at 3 is [D041](../../decisions/D041-gate-a-round-1.md)'s.
- Links: `/products/kheelu` (the page's one product link, [strategy §3.3](../strategy.md#33-placement-and-repetition));
  `/stories/screen-time-and-tantrums`.

---

## Fold 11 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
>
> ² Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
>
> ³ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Preschool Media and Learning, Conclusions and Recommendations: Families. https://doi.org/10.1542/peds.2016-2591
>
> ⁴ American Academy of Pediatrics, Council on Communications and Media, "Media Use in School-Aged Children and Adolescents", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2592
>
> ⁵ Khobragade and Shenoy, AIIMS Raipur, "Screen Time Among Under-Five Children in India: A Systematic Review and Meta-Analysis", Cureus, 2025, Results. https://doi.org/10.7759/cureus.85458

- The same list is the BlogPosting `citation` array. Re-read the AAP pages before publishing (read from the
  publisher's archived full text; the live site answered 403, source verification §7).

---

## Fold 12 · Related guides

**Copy:**

> **H2:** Related guides
>
> - Screen-free does not mean silent
> - Screen time and tantrums: what is actually happening
> - The gentle way off the phone: a seven-day plan

| Title (each guide's own card) | Real URL |
|---|---|
| Screen-free does not mean silent | `/stories/screen-free-does-not-mean-silent` |
| Screen time and tantrums: what is actually happening | `/stories/screen-time-and-tantrums` |
| The gentle way off the phone: a seven-day plan | `/stories/the-gentle-way-off-the-phone` |

The stub's `related` list, unchanged; the template words each link from its guide's card.

---

## Fold 13 · Close (journal close block)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block), from `articlePageCopy`):

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

- `cta` = `finale`. Every amount renders from the offer (`{price:…}` tokens), never typed.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; appears after the head, steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 56 characters, the §5.2 draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 132 characters; "no more than an hour a day", WHO and IAP |
| One H1 with the primary | Yes | "Screen time for a 3-year-old, and up to age 7" (§5.2: H1 carries "screen time for a 3-year-old") |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "How much screen time for a 3-year-old?" (the exact query) and its 54-word answer |
| One H2 per single age (§5.1 rule 4; §5.2 "one H2 per age 3, 4, 5, 6, 7") | Mostly | 3 (fold 2), 4 (fold 3), 5 (fold 4); 6 and 7 share fold 5, because their guidance is identical |
| "3 to 7" on the page | Yes | Fold 10 product line; the close |
| Alt text | Yes | Describes the scene; no keyword forced (the photo is not about screens) |
| Density | Yes | "screen time for a 3-year-old" twice in `<main>` (H1, fold 2 H2): about 1.3% of about 750 words; "Kheelu" 3 times with the close and its button (0.4%) |
| Words never placed | Yes | No under-3 ages or "toddler"; no "addiction"; no brain, speech or health line; no competitor names; no "session" |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (product, two guides) | text links | none (not buttons) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live byline is Kashyap C.R, a co-founder named on `/team`. (a) "The Kheelona team" (as
   drafted); (b) Kashyap C.R, once he has read the rewrite and owns it. **Recommend (a)** for the build; (b) if
   Kashyap wants his name on it (a named author helps search engines judge who stands behind advice).
2. **H1 and the hub card.** (a) The H1 carries the search term, "Screen time for a 3-year-old, and up to age 7",
   while the hub card keeps its approved "How much screen time is okay for a young child?" (as drafted);
   (b) the H1 repeats the card title, and the search term sits only in the title and the answer heading.
   **Recommend (a)**: the keyword map asks for the term in the H1 (§5.1 rule 2, §5.2), and the card stays word
   for word.

**For the main session (not the founder): `updated`.** Architecture §6.1 stores `updated` from git history
when an article changes, and task 5.6 stored the rewrite's date (its test asks for a date after the live
one). The note for 5.17 keeps the stub's dates. `published` stays 2026-07-28 either way; `updated` needs one
ruling for the six articles.

## Sources

| Claim | Source |
|---|---|
| WHO: at 3 and 4, no more than an hour of sedentary screen time a day, less is better | [source verification C31](../../research/source-verification.md#c31--the-who-guideline); excerpt `raw/research/sources/C31-who-2019-guidelines-under-5.md:39-43` |
| IAP: two to five, at most one hour of supervised screen time a day, "the lesser, the better"; 20 to 30 minutes at a time; always supervised | [source verification C32](../../research/source-verification.md#c32--the-indian-academy-of-pediatrics); `C32-iap-2022-screen-time-digital-wellness.md:44-49` |
| AAP: two to five, no more than one hour a day of high-quality programmes, watched together, help them understand; avoid fast-paced programmes, distracting apps, violence | [source verification C33](../../research/source-verification.md#c33--the-american-academy-of-pediatrics); `C33-aap-2016-media-and-young-minds.md:61-64` |
| The WHO's guideline stops at age 4 | C31 caveat 4; `C31-who-2019-guidelines-under-5.md:10-11, 39` |
| IAP: 5 to 10, under two hours a day, homework included, the less the better | C32; `C32-iap-2022-screen-time-digital-wellness.md:53-56` |
| AAP: 5 to 18, no fixed number; consistent limits on hours and types of media | C33 ready line; `C33-aap-2016-school-aged-media-use.md:28-34` |
| 10 studies from India, 2,857 children under five, about 2.2 hours a day, more than the guidelines advise | [source verification C06](../../research/source-verification.md#c06--screen-time-in-india); `C06-khobragade-shenoy-2025-cureus-under-five-screen-time.md:27-32, 46-47` |
| AAP: the limit leaves "ample time to engage in other activities important to their health and development" | `C33-aap-2016-media-and-young-minds.md:44-46` |
| WHO: reading and storytelling with a caregiver when sedentary | `C31-who-2019-guidelines-under-5.md:42-43` |
| AAP: well-designed programmes "can improve cognitive, literacy, and social outcomes for children 3 to 5 years of age" | `C33-aap-2016-media-and-young-minds.md:36-37`; C33 caveat 2 |
| No screens at meals and in the hour before sleep (IAP, AAP); bedrooms screen-free (AAP); travel (IAP) | `C32-iap-2022-screen-time-digital-wellness.md:51`; `C33-aap-2016-media-and-young-minds.md:66-68` |
| "A ceiling, not a target" | C33 note (`C33-aap-2016-media-and-young-minds.md:72-73`) |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Card title and summary, related list, published date | the stub module; [stories.md](stories.md) fold 2 (line 117); `src/lib/stories-expansion.ts:16` |
| Cut lines | [source verification](../../research/source-verification.md) C31 caveat 2, C33 caveat 1, C09 caveat 3, C43 caveat 2; [age-band review](../../product/age-band-review.md) row 43 |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Photo | DS `03-cast.md:120`; file checked by eye 2026-10-14 |
