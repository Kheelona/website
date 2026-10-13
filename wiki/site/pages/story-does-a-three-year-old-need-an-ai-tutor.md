---
title: "Story: Does a three-year-old need an AI tutor? (/stories/does-a-three-year-old-need-an-ai-tutor): page copy, task 5.19 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../engineering/tasks.md (Wave 5 table, row 5.19; the part C paragraph; the note on the 18 articles without a mockup)
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../pages/story-learning-toys-for-a-three-year-old.md, story-what-to-look-for-in-a-safe-ai-toy.md (format, age lines, close block, sticky bar)
  - ../pages/stories.md (fold 4 card: title and summary, kept word for word)
  - ../pages/home.md (CTA block, sticky bar, `{price-source}`)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§2.3 LRN-15, §4.2, §5.1, §5.2, §6.5 AT1)
  - ../../research/source-verification.md (§3.3, §3.5, §4: C07, C14, C31, C32; §5)
  - "../../raw/research/sources/: C07-harvard-serve-and-return.md, C14-brookings-cognitive-stunting.md, C31-who-2019-guidelines-under-5.md, C32-iap-2022-screen-time-digital-wellness.md"
  - ../../product/claims.md (§1, §2, §3, §4, §8), ../../product/facts.md, ../../product/age-band-review.md (row 46)
  - ../../brand/messaging.md (against the alternatives; words to stop using), ../../brand/voice.md
  - ../../decisions/D016, D017, D025, D026, D027, D036, D041
  - "src/content/en-IN/stories/articles/does-a-three-year-old-need-an-ai-tutor.ts (stub: card, related, dates); src/lib/stories-expansion.ts:281-305 (the live article, input only); test/guards/banned-phrases.data.ts"
  - "design-system/project/03-cast.md:105 (Myra 04); assets/Photo library/myra-04-drawing-at-home-web.webp, checked by eye 2026-10-14 (read-only)"
  - ../../qa/cmo-review-articles-5.19-2026-10-14.md (round 1: M5, M6, M7 fixed in round 2)
---

# Story: Does a three-year-old need an AI tutor?

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review of the task 5.19 copy stage
> and the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁴` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
  Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: visual acceptance is template parity with
  `story-learning-toys-for-a-three-year-old.html` ([tasks](../../engineering/tasks.md), the note under the Wave 5 table).
- Every fold maps to a block the article template renders (`Article` in `src/content/types.ts`;
  `src/layouts/ArticleTemplate/`): the head, the answer, parts with `p`, `h3`, `list`, `callout` blocks, the
  sources, the related guides and the `journal` close.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/does-a-three-year-old-need-an-ai-tutor` (no mockup) |
| Page job | Answer "does my 3-year-old need an AI tutor?" honestly, first: no. Then say what help at 3 looks like (sourced), what the screen guidance says about a tutoring app, the worry about AI that hands over answers, and what to look for instead. Route to the product page once, calmly, without calling Kheelu a tutor ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **AI tutor for a 3-year-old** (LRN-15; autocomplete "ai for kids learning"); no volume data ([keyword map §2.3, §4.2](../../research/keyword-map.md#42-journal-articles-22)). "Tutor" is a stop-word for Kheelu: the page discusses tutors and never calls Kheelu one |
| Title (46 characters) | Does a 3-year-old need an AI tutor? · Kheelona |
| Meta description (136 characters) | Does a 3-year-old need an AI tutor? No. What help at 3 looks like, what the WHO and IAP say about screens, and what to look for instead. |
| H1 | Does a three-year-old need an AI tutor? (the hub card title, as live) |
| Lead | The hub card summary, word for word |
| Byline line | Apoorva Sahu · First published 30 Jul 2026 · 3 min read (byline: question 1) |
| Read time | Derived at build: about 680 words in the head and reading column after round 2 (+7 words), so 3 minutes at 200 words a minute |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` (the shell's, because the close is `journal`) |
| In-text product link | One, in fold 6 ("Kheelu" → `/products/kheelu`) |
| Other in-text link | Fold 6: `/stories/what-to-look-for-in-a-safe-ai-toy` |
| Template settings | `close: "journal"`; `og: DEFAULT_OG`; `updated`: the rewrite's date, set by the builder; close art with its doodle (this is not a safety guide, so it stays out of `PLAIN_CLOSE_ART`) |

**What changed from the live article** (`src/lib/stories-expansion.ts:281-305`): "hundreds of them a day" is cut
(no source; [source verification C13](../../research/source-verification.md#52-could-not-verify-2)); "the research on
early learning keeps arriving at the same place" becomes Harvard's own words with a marker (C07); "small children
learn least that way" is cut (no source) and replaced by the IAP and WHO limits (C31, C32); "the years before
school are when a child learns faster than they ever will again" is cut (C05 allows only the attributed "builds
connections", and that belongs to the early-years guide); the checklist loses "A pace set by the child, not by a
lesson plan" ("lesson" is banned everywhere, [D027](../../decisions/D027-story-mode-wording.md); the "at your
child's pace" family is banned, [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish)); the pitch
loses "moves at your child's pace" (same ban), "a screen-free friend" and "the tutor you were actually searching
for" (Kheelu is never a tutor, [messaging](../../brand/messaging.md#words-to-stop-using)) and its typed price (amounts
render only in the close, [pricing](../../product/pricing.md)). "Children have grown up brilliantly for millennia
without one" goes: the answer already says no. The live byline is kept (question 1).

**Overlap.** `should-kids-use-ai` (LRN-14) owns "should kids use AI" and chatbots; this page owns "AI tutor for a
3-year-old" and cites the Brookings commentary once (C14), which that guide may cite too (reported to the main
session). `how-much-screen-time-for-a-3-to-6-year-old` owns screen time by age: this page quotes the IAP and WHO
limits only as they bear on a tutoring app, under a heading about tutoring apps, never "screen time for a
3-year-old".

---

## Fold 1 · Article head

**Fold job:** say what the page answers and for which age, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › AI toys and safety
>
> **H1:** Does a three-year-old need an AI tutor?
>
> Tutoring apps promise homework help. Your child can't do homework yet. What help at 3 should look like.
>
> Apoorva Sahu · First published 30 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "AI tutor?"; `{nowrap:three-year-old}` so the age never breaks across lines.
- **Lead:** the hub card summary, verbatim ([stories.md fold 4](stories.md#fold-4--ai-toys-and-safety-ai-and-safety); stub module).
- Breadcrumb: "Stories" → `/stories`; "AI toys and safety" → `/stories#ai-and-safety` (the topic `hub.ts` lists the
  guide under; `topics.ts`).
- **Dates:** "First published" is the live `published` value (`2026-07-30`, `src/lib/stories-expansion.ts:288`,
  kept in the stub). `updated` is the rewrite's date, set by the builder (after the live `2026-09-05`).
- **Image** (`kh-photo`, 4:5, the head's portrait layout): `myra-04-drawing-at-home-web.webp`. Alt: "A little girl in
  a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table." (`03-cast.md:105`:
  "Screen-free play, creativity, parenting posts without selling"; the alt is the approved one from the learning-toys
  guide, word for word.) Myra is the cast's 3½-year-old, so the photo matches the page's age. Checked by eye 2026-10-14.
- **Round 2 (CMO M6; question 2, option (b)):** the round-1 photo, `myra-01-breakfast-why` (Myra asking Kheelu a
  question), sat under "Does a three-year-old need an AI tutor?" and on a phone read as "here is the AI tutor", the frame
  the positioning refuses, with no grown-up in frame on a page that advises one nearby at 3. `myra-04` is the only age-3
  photo without Kheelu that the head can show uncropped (`myra-05` is a 1:1 portrait), and it is also the learning-toys
  guide's head; the CMO accepts the repeat. The hub shows no image on this card (only card 1 of each topic has one,
  [stories.md](stories.md#fold-4--ai-toys-and-safety-ai-and-safety)), so the repeat is between the two articles only.

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, with the reason, before anything else.

**Copy:**

> **H2:** Does a 3-year-old need an AI tutor?
>
> No. A 3-year-old isn't ready for homework yet. Help at 3 is simpler: someone who answers their questions, asks one back and waits for the reply. Harvard's Center on the Developing Child says back-and-forth exchanges like these, with a caring adult, help build a young child's brain and support early language.¹ Look for play that invites talk, not drills.

- 59 words (marker excluded). **Round 2 (CMO M5):** "has no homework yet" became "isn't ready for homework yet", the
  keyword map's AT1 wording ([§6.5](../../research/keyword-map.md#65-ai-and-safety-articles), AT1: "is not ready for
  homework"): many nursery
  and LKG children in India do bring worksheets home, so "has no homework" would read as untrue to their parents. The
  card summary ("Your child can't do homework yet") stays word for word.
- The keyword map's AT1 draft, tightened: "Research links" becomes "Harvard's Center on the
  Developing Child says", because the source is the Center's summary page, not a study
  ([source verification C07](../../research/source-verification.md#c07--serve-and-return) caveat 1); "a caring adult" kept.
- No product in the answer, so it reads as useful to any parent and can feed the BlogPosting's main entity.
- The brain clause is about conversation with an adult, never a toy ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 3 · What help looks like at 3

**Fold job:** replace the tutor picture with the one the source gives, and show it in one everyday exchange.

**Copy:**

> **H2:** What does help look like at 3?
>
> A tutor, in the usual sense, helps a child keep up with school: homework, practice, tests. A 3-year-old doesn't need any of those. What they have is questions.
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> At 3, the serve is often a question. A good return answers it, then asks one back:
>
> **Your child:** Why is the dosa round?
>
> **You:** Because we spread the batter round and round. What shape would you make?
>
> **Your child:** A star!
>
> **You:** How would we flip a star?
>
> Four turns, and your child did half the thinking. That is what help looks like at 3: a patient grown-up who answers the fourth "why" as kindly as the first.
>
> **Try this:** after your child's next "why", answer in a sentence, then ask, "What do you think?" Count to five before you say more.

- Paragraph 1, round 2 (CMO M5): "has none of those" became "doesn't need any of those", for the same reason as the
  answer: it says what a 3-year-old needs, not what their nursery sends home.
- Paragraph 2 is the verified C07 line, verbatim, as on the approved learning-toys page.
- The four exchange lines are `p` blocks with a bold `lead` ("Your child:", "You:"). The exchange is between a child and
  a parent, never Kheelu, so nothing pairs the brain line with the product ([D016](../../decisions/D016-brain-wording.md)).
  It makes no science claim (the dosa answer is how the batter is spread).
- "The fourth why as kindly as the first" keeps the live article's best image, as plain voice.
- **Try this:** a `callout` (icon `question`, tone `sun`, as the learning-toys "Try this"). "Count to five" is the house
  tip the late-talker page uses.

---

## Fold 4 · A tutoring app on a tablet

**Fold job:** the screen guidance a parent needs before buying a tutoring app, sourced, with one thing to do.

**Copy:**

> **H2:** What about a tutoring app on a tablet?
>
> A tutoring app on a phone or tablet is screen time.
>
> For three and four year olds, the Indian Academy of Pediatrics says no more than an hour of screen time a day, in sessions of no more than 20 to 30 minutes, always supervised by a caregiver.² The World Health Organization's limit for watching screens at this age is the same hour, and it adds that less is better.³
>
> That hour covers every screen in the day, so a tutoring app shares it with everything else. From five to ten, the IAP's limit is under two hours a day, and it counts screen time for schoolwork too.²
>
> If a screen is part of your child's day, sit with them and talk about what you see.

- The IAP lines are C32's verified wording (excerpt `C32-iap-2022-screen-time-digital-wellness.md:44-49, 53-56`): the
  24 to 59 month band covers "three and four year olds"; the 5 to 10 band counts "time spent on screen at home to
  complete educational and extra-curricular assignments", which is why it matters on a tutoring page.
- The WHO's limit is for **sedentary** screen time, "passively watching screen-based entertainment" (excerpt
  `C31-who-2019-guidelines-under-5.md:39-44, 54-56`), so the copy says "for watching screens" and puts the IAP, whose
  limit covers every screen, first. Nothing calls the evidence strong: the WHO grades it "very low quality".
- Age words, not digits, for the IAP's bands ("five to ten"): the dead-range guard bans "2 to 5" and "3 to 6"
  (`banned-phrases.data.ts`, `dead-age-ranges`).
- "Sit with them and talk about what you see" is the approved learning-toys house line, reworded; no marker.

---

## Fold 5 · AI that hands over the answers

**Fold job:** the honest worry about AI and children's thinking, attributed to one author, with its real scope, then
a habit a parent can keep.

**Copy:**

> **H2:** What about AI that does the thinking for them?
>
> In a May 2026 commentary for the Brookings Institution, Rebecca Winthrop, who directs its Center for Universal Education, described one worry about children and AI as "cognitive stunting": relying too heavily on AI "reduces children's opportunities to engage in effortful thinking".⁴
>
> She calls the evidence emerging, and none of the findings she reports is about children as young as 3.⁴
>
> Whatever that evidence shows in time, the habit is easy to keep at home: give your child time to think before anyone, or anything, gives the answer. That is the case for a question back. It hands the thinking to your child.

- Paragraph 1 is C14's verified line, verbatim. Its ready line goes on "asks for ways to measure children's cognitive
  development"; that phrase is banned by the guard (`cognitive-development`, claims §4 row "cognitive development
  toy"), so paragraph 2 says the scope plainly instead ("emerging", excerpt `C14-brookings-cognitive-stunting.md:39-45`;
  no finding at ages 3 to 7, [source verification §5.5](../../research/source-verification.md#55-corrections-to-excerpt-files)).
- Never "Brookings warns" (one author's view); no Kheelu line in this fold (C14 rule).
- "Give your child time to think before anyone, or anything, gives the answer" is C14's house line.

---

## Fold 6 · What to look for instead (the one in-text product link)

**Fold job:** a checklist a parent can use on any AI toy or app for a young child, then one calm line on how Kheelu
is built against it, with its age limits.

**Copy:**

> **H2:** What to look for instead
>
> If you are weighing an AI toy or app for a young child, look for these:
>
> - Talk, not taps: your child speaks and listens, with no screen to watch.
> - It answers, then asks your child something back.
> - It says when it doesn't know, instead of guessing.
> - It can't browse the open internet.
> - You can read every conversation.
>
> What child-safety groups advise about AI toys at this age, and our answer, is in our guide to [what to look for in a safe AI toy](https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy).
>
> [Kheelu](https://kheelona.com/products/kheelu) is built around this list: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. It can't browse the internet, it says when it doesn't know, and you can read every conversation in the parent app. It is a toy, not a tutor, and it tells your child it's a toy.
>
> It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play.

- The H2 is the keyword map's for this URL ([§5.2](../../research/keyword-map.md#52-per-page)).
- `list`, variant `checks` (as the learning-toys "short rule"). Every item is a criterion Kheelu meets by a confirmed
  claim, so "built around this list" claims nothing more: screen-free ([facts](../../product/facts.md#identity)); answers,
  then asks a question back, cannot browse the internet, parents read every conversation
  ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)); says when it doesn't know
  ([D036](../../decisions/D036-launch-feature-claims.md)). "And waits" is left out of item 2 on purpose: no ruling says
  how long Kheelu waits for an answer.
- "Built around" is the approved form ([voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning)). Fold 6 holds no
  brain line; the nearest is fold 3, three folds up ([D016](../../decisions/D016-brain-wording.md)).
- "A toy, not a tutor" keeps the stop-word rule ([messaging](../../brand/messaging.md#words-to-stop-using);
  [D027](../../decisions/D027-story-mode-wording.md): Kheelu is not sold as a tutor); "it tells your child it's a toy" is
  confirmed ([claims §1](../../product/claims.md#1-confirmed-by-the-founder)). No word "safe" about Kheelu.
- The age lines are the learning-toys page's: not for under 3 (entity fact) and a grown-up nearby at 3
  ([D041](../../decisions/D041-gate-a-round-1.md)).
- **Round 2 (CMO M7):** the pointer to the safe-AI-toy guide now says what is there: child-safety groups' advice on AI
  toys at this age (that guide's fold 3, Common Sense Media and Fairplay) and our answer (its fold 5, the B3 answer). A
  page about AI for 3-year-olds that points to an AI toy no longer leaves that advice unmentioned. No new source: the
  line states no finding, it says where the finding is. The other route, citing Common Sense Media here in full with
  the B3 answer, is question 3.
- Links: `/stories/what-to-look-for-in-a-safe-ai-toy` (an article link, not a product link); `/products/kheelu`, the
  page's one in-text product link ([strategy §3.3](../strategy.md#33-placement-and-repetition)).

---

## Fold 7 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ² Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
>
> ³ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
>
> ⁴ Rebecca Winthrop, Brookings Institution, "Is it time to measure cognitive stunting?", 2026, section "Cognitive stunting" and the section on early evidence. https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/

- The same list is the BlogPosting `citation` array. Note 4 names the second section by description: its real title
  contains the banned phrase "cognitive development", which the guard would catch in the citation string.
- Re-read the Harvard page and the Brookings commentary before publishing (both show recent edits,
  [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 8 · Related guides

**Copy:**

> **H2:** Related guides
>
> - Should kids use AI? An honest answer from people who build it
> - The hard questions parents ask about AI toys
> - Why the early years matter most

| Title (each guide's own card title, rendered from its module) | Real URL |
|---|---|
| Should kids use AI? An honest answer from people who build it | `/stories/should-kids-use-ai` |
| The hard questions parents ask about AI toys | `/stories/questions-parents-ask-about-ai-toys` |
| Why the early years matter most | `/stories/why-three-to-six-are-the-years-that-matter-most` |

The stub's related list, unchanged (task instruction; `articles.test.ts` keeps every article at three incoming links).

---

## Fold 9 · Close (journal close block)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block); rendered from
`articlePageCopy.close`, never retyped):

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

- `cta` = `finale`. Trust items link to `/shipping` and `/refund`. Full mode as on Home.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; appears after the head, steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 46 characters; the keyword map's draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 136 characters; the direct answer and the WHO and IAP guidance |
| One H1 with the primary | Yes | "Does a three-year-old need an AI tutor?" (hub card title, as live) |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 question H2 (numeral form, so both spellings are on the page) and its 59-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 6 "What to look for instead" (§5.2 H2) |
| Single age in headings | Yes | "3" in the H1 and two H2s ([§3](../../research/keyword-map.md#3-clusters-by-age)) |
| Alt text | Yes | Describes the scene (the approved alt of `myra-04`); no keyword forced |
| Density | Yes | "AI tutor" twice in `<main>` (H1, fold 2 H2) of about 670 words (0.6%); "Kheelu" 3 times (fold 6, the close's lead and its button: 0.4%) |
| Not competing with the screen-time guide | Yes | No heading carries "screen time for a 3-year-old" |
| Words never placed | Yes | Kheelu never called a tutor or teacher; no "lessons", no "adapts" family, no brain line beside Kheelu, no "cognitive development", no health terms, no competitor or app names |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (fold 6) | text links | none (not buttons) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live article is by Apoorva Sahu, a co-founder named on `/team`. (a) Keep his name, after he reads
   the rewrite; (b) "The Kheelona team". **Recommend (a)**: a named co-founder behind an honest "no" on AI tutors is
   worth more to a parent, and to search engines judging who stands behind advice, than a team name. The same
   question applies to the two learning guides of this task.
2. **Head photo (round 2: now drafted as (b)).** (a) Myra at breakfast, asking Kheelu a question (`myra-01`, the
   round-1 draft); (b) a photo without Kheelu: the only age-3 one the head can show uncropped is Myra drawing
   (`myra-04`), already the head of the learning-toys guide (as now drafted); (c) a DS photo with a parent in frame:
   `tara-02` (Tara with her mother; already the head of the safe-AI-toy guide and the photo of /safety and the hub's
   AI card) or `tara-03` (Tara with her father at bedtime; proposed in round 2 for the hard-questions head). Both
   are of Tara, 5½, with Kheelu in frame. **Recommend (b)**, with the CMO (M6): under "Does a three-year-old need an AI
   tutor?", a 3-year-old talking to Kheelu reads on a phone as "here is the AI tutor", the frame the page refuses,
   and shows no grown-up on a page that advises one nearby at 3. The repeated photo is the smaller cost.
3. **Common Sense Media on this page (round 2, CMO M7).** (a) Fold 6 points to the safe-AI-toy guide for what
   child-safety groups advise at this age and our answer (as now drafted); (b) extend B3 here: cite Common Sense
   Media's advice in full in fold 6, with the signed answer. **Recommend (a)**: the page's subject is tutoring, not
   AI toys; the pointer is honest about where the advice is, and B3's single signed answer stays on the pages that
   are about AI toys.

## Sources

| Claim | Source |
|---|---|
| Harvard serve-and-return line, verbatim, with "a caring adult" (folds 2, 3) | [source verification C07](../../research/source-verification.md#c07--serve-and-return) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C07-harvard-serve-and-return.md:22-28, 36-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| "Harvard's Center ... says", never "research shows" | [source verification C07](../../research/source-verification.md#c07--serve-and-return) caveat 1 |
| IAP: at most an hour a day for 24 to 59 months, sessions of 20 to 30 minutes, always supervised; under two hours at 5 to 10, schoolwork included | [source verification C32](../../research/source-verification.md#c32--the-indian-academy-of-pediatrics); excerpt `C32-iap-2022-screen-time-digital-wellness.md:44-49, 53-56` |
| WHO: no more than an hour of sedentary screen time at 3 and 4, less is better; sedentary means passive watching | [source verification C31](../../research/source-verification.md#c31--the-who-guideline); excerpt `C31-who-2019-guidelines-under-5.md:39-44, 54-56` |
| Brookings: Rebecca Winthrop, May 2026, "cognitive stunting", "reduces children's opportunities to engage in effortful thinking"; evidence emerging; no finding at 3 | [source verification C14](../../research/source-verification.md#c14--cognitive-stunting) and §5.5; excerpt `C14-brookings-cognitive-stunting.md:24-45, 51-65` |
| House line "Give your child time to think before anyone, or anything, gives the answer" | [source verification C14](../../research/source-verification.md#c14--cognitive-stunting) house line |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Cannot browse the internet; parents read every conversation in the parent app | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md); [claims §1, §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) |
| Tells your child it's a toy | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| "A toy, not a tutor"; never "tutor" for Kheelu | [messaging, words to stop using](../../brand/messaging.md#words-to-stop-using); [D027](../../decisions/D027-story-mode-wording.md); [keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22) |
| "Built around" | [voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning) |
| Not a toy for children under 3; a grown-up nearby at 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md); [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Cut lines ("hundreds of them a day"; "learn least that way"; "learns faster than they ever will again"; "a pace set by the child"; "lesson plan"; "moves at your child's pace") | [source verification C13, C05](../../research/source-verification.md#5-do-not-use); [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) ("adapts" family); [D027](../../decisions/D027-story-mode-wording.md) ("lessons") |
| Card title and summary, related list, first-published date | `src/content/en-IN/stories/articles/does-a-three-year-old-need-an-ai-tutor.ts` (stub); [stories.md fold 4](stories.md#fold-4--ai-toys-and-safety-ai-and-safety); `src/lib/stories-expansion.ts:288` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Photo | DS `03-cast.md:9, 21-27, 105` (Myra, 3½; Myra 04, no Kheelu); alt from the approved [learning-toys guide](story-learning-toys-for-a-three-year-old.md) fold 1; file checked by eye 2026-10-14 |
| "isn't ready for homework yet"; "doesn't need any of those" | [keyword map §6.5](../../research/keyword-map.md#65-ai-and-safety-articles) AT1; [CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#minor) M5 |
| "What child-safety groups advise about AI toys at this age, and our answer, is in our guide" | The approved [safe-AI-toy guide](story-what-to-look-for-in-a-safe-ai-toy.md#fold-3--what-child-safety-groups-say), fold 3 (the advice) and fold 5 (the B3 answer); [CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#minor) M7 |
