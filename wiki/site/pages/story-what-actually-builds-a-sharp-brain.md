---
title: "Story: What actually builds a sharp brain in the early years (/stories/what-actually-builds-a-sharp-brain): page copy, task 5.19 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../engineering/tasks.md (Wave 5 table, row 5.19; the part C paragraph; the note on the 18 articles without a mockup)
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../pages/story-learning-toys-for-a-three-year-old.md (format, brain-line distance, age lines, close block, sticky bar)
  - ../pages/stories.md (fold 5 card: title and summary, kept word for word)
  - ../pages/home.md (CTA block, sticky bar, `{price-source}`)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§2.3 LRN-12, §4.2, §4.3, §5.1, §5.2, §6.6 BD1)
  - ../../research/source-verification.md (§3.1, §3.3, §3.7, §4: C01, C07, C08, C09, C43, C44; §5)
  - "../../raw/research/sources/: C03-nep-2020-para-1-2.md, C07-harvard-serve-and-return.md, C08-harvard-serve-return-shapes-brain-circuitry.md, C09-romeo-2018-psychological-science.md, C43-aasm-2016-pediatric-sleep-consensus.md, C43-kurdziel-2013-pnas-preschool-naps.md, C44-harvard-center-toxic-stress.md"
  - ../../product/claims.md (§1, §4, §8), ../../product/facts.md, ../../product/age-band-review.md (row 47)
  - ../../brand/voice.md (rules 2, 3, 4, 7), ../../brand/messaging.md (claims guardrails)
  - ../../decisions/D016, D017, D026, D041
  - "src/content/en-IN/stories/articles/what-actually-builds-a-sharp-brain.ts (stub: card, related, dates); src/lib/stories-expansion.ts:138-163 (the live article, input only); test/guards/banned-phrases.data.ts"
  - "design-system/project/03-cast.md:115 (Ira 04); assets/Photo library/ira-04-paper-crown-web.webp, checked by eye 2026-10-13 (read-only)"
---

# Story: What actually builds a sharp brain in the early years

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review of the task 5.19 copy stage
> and the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁷` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
  Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: visual acceptance is template parity with
  `story-learning-toys-for-a-three-year-old.html` ([tasks](../../engineering/tasks.md), the note under the Wave 5 table).
- Every fold maps to a block the article template renders (`Article` in `src/content/types.ts`;
  `src/layouts/ArticleTemplate/`): the head, the answer with its detail, parts with `p` and `list` blocks, the
  sources, the related guides and the `journal` close.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/what-actually-builds-a-sharp-brain` (no mockup) |
| Page job | Answer "how can I help my child's brain develop?" for a parent of a 3 to 7 year old with the four everyday things the sources point to (talk, sleep, calm, play), each sourced and each with something to do tonight; route to the product page once, calmly, in a fold with no brain line ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **how to develop a child's brain** (LRN-12: "how to develop child brain", "how to make child brain sharp", "brain development activities for 3 year olds at home"); no volume data ([keyword map §2.3, §4.2](../../research/keyword-map.md#42-journal-articles-22)). "Brain development" is a searched topic here, never what a toy does ([D016](../../decisions/D016-brain-wording.md)) |
| Title (49 characters) | How to help your child's brain develop · Kheelona |
| Meta description (144 characters) | How to help your child's brain develop, past the flashcards: back-and-forth talk, enough sleep, calm and free play, and how to get more of each. |
| H1 | What actually builds a sharp brain in the early years (the hub card title, as live; question 2) |
| Lead | The hub card summary, word for word |
| Byline line | Apoorva Sahu · First published 28 Jul 2026 · 3 min read (byline: question 1) |
| Read time | Derived at build: about 680 words in the head and reading column, so 3 minutes at 200 words a minute |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` (the shell's, because the close is `journal`) |
| In-text product link | One, in fold 7 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"`; `og: DEFAULT_OG`; `updated`: the rewrite's date, set by the builder; close art with its doodle (not in `PLAIN_CLOSE_ART`). The stub's meta title went without the brand (`UNBRANDED` in `articles.test.ts`, the card title is 53 characters); the rewrite's own title carries it at 49 |

**What changed from the live article** (`src/lib/stories-expansion.ts:138-163`): "apps, flashcards, tonics, courses for
three year olds" (a description of a market we cannot source) is cut; "researchers count conversational turns, not
vocabulary drills" becomes the Romeo study with its real ages, 4 to 6, and its limit (C09); "Sleep is when the day's
learning gets filed, and children aged 3 to 6 need ten to thirteen hours" becomes the AASM's own ages and hours and
its association with learning and memory, plus one nap study (C43; [age-band review](../../product/age-band-review.md)
row 47; the live "3 to 6" is wrong at 6); "Play ... is where planning, memory, and self-control get their reps" (no
source) becomes NEP 2020's description of early learning and plain advice; "chronic stress is one of the few things
reliably shown to work against a growing brain" becomes Harvard's toxic-stress wording (C44); "Educational toys and
brain development toys can help, but only the ones that produce more of the four" and "Sharp grows in that soil" are
cut (outcome claims with no source). The dinner-table test stays, and so does "judge our toy with the same test",
now the page's one in-text product link. The live title (64 characters) is replaced by the keyword map's draft.

**Overlap.** `why-three-to-six-are-the-years-that-matter-most` owns the why (what the early years are); this page owns
the how. `how-children-learn-by-talking` owns "serve and return" (LRN-11): this page quotes the Center's 2011 line
once and puts the term in no heading. `learning-toys-for-a-three-year-old` owns "brain development toys for a
3-year-old": this page names no toy category in a heading ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags):
"the two brain articles" are a low, accepted overlap).

---

## Fold 1 · Article head

**Fold job:** say what the page answers, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › Learning and play
>
> **H1:** What actually builds a sharp brain in the early years
>
> Past the flashcards: the everyday things research points to, and how to get more of them at home.
>
> Apoorva Sahu · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "actually" (the page's promise: the plain answer).
- **Lead:** the hub card summary, verbatim ([stories.md fold 5](stories.md#fold-5--learning-and-play-learning); stub module).
  "The everyday things research points to" covers talk, sleep and calm, which rest on research; play rests on
  India's education policy, and fold 6 says so by naming it.
- Breadcrumb: "Stories" → `/stories`; "Learning and play" → `/stories#learning`.
- **Dates:** "First published" is the live `published` value (`2026-07-28`, `src/lib/stories-expansion.ts:145`). `updated`
  is the rewrite's date, set by the builder (after the live `2026-07-31`).
- **Image** (`kh-photo`, 4:5, the head's portrait layout): `ira-04-paper-crown-web.webp`. Alt: "A girl with a long braid,
  in a sky-blue T-shirt, laughs as she puts on a yellow paper crown, with crayons and paper scraps on the table beside
  her." (`03-cast.md:115`: "Confidence and creativity".) No Kheelu in the head photo of a brain article, as on the
  learning-toys guide.

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, then frame the four things the page covers.

**Copy:**

> **H2:** How can you help your child's brain develop?
>
> Talk with your child, and let them answer. Harvard's Center on the Developing Child says back-and-forth exchanges with a caring adult help build the connections in a young child's brain.¹ Add enough sleep, time to play with nothing planned, and a calm grown-up nearby on hard days. None of these is a flashcard, an app or a class.
>
> This page skips the flashcards. What the sources below point to is older and plainer: talk, sleep, calm and play. Here is each one, and how to get more of it at home.

- Answer: 58 words (marker excluded). The keyword map's BD1 draft, tightened: the Center is named as the source
  instead of "research links" ([source verification C07](../../research/source-verification.md#c07--serve-and-return)
  caveat 1); "a caring adult" kept; the Romeo citation moves to fold 3, where its ages can be given.
- The second paragraph is the answer's `detail` (one `p`), as on the learning-toys guide.
- No product anywhere in this fold ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 3 · Conversation

**Fold job:** the strongest of the four, with its two sources and their limits, then four habits.

**Copy:**

> **H2:** Conversation: the back-and-forth kind
>
> Harvard's Center on the Developing Child calls "serve and return", the back and forth between young children and the significant adults in their lives, "one of the most essential experiences in shaping the architecture of the developing brain".² When your child reaches out with a sound, a look or a gesture and you respond, that is serve and return.² By 3, that reaching out is often a question or a story.
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.³
>
> So aim for turns, not just words. A few ways to get more of them:
>
> - Answer a question, then ask one back: "What do you think?"
> - Give your child time to answer before you fill the silence.
> - Talk about what you're doing while you cook, walk or fold the washing, and leave gaps for your child to add something.
> - At bedtime, ask about the best and the hardest part of the day, and hear the whole answer.

- Paragraph 1 is C08's verified line, verbatim, quoting the Center's 2011 page; the last sentence is house voice for
  3 to 7 year olds (no marker). C08's "especially in the earliest years" is not quoted, so nothing ties the line to an
  age band.
- Paragraph 2 is C09's verified wording, as on the learning-toys guide: ages 4 to 6, never three-year-olds
  ([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- "Not just words": adult words also went with language scores on their own in that study, so the copy never says
  words don't matter ([source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6) caveat 3).
- `list`, plain bullets. Advice only; none promises an outcome.

---

## Fold 4 · Sleep

**Fold job:** the published hours by age, what they go with, and one habit.

**Copy:**

> **H2:** Sleep: more of it than you might think
>
> Children aged 3 to 5 need 10 to 13 hours of sleep in every 24, naps included, and children aged 6 to 12 need 9 to 12 hours. Getting the recommended hours regularly goes with better attention, behaviour, learning and memory.⁴
>
> In one small US study, preschoolers remembered more of a memory game they had learnt that morning after a nap than after staying awake.⁵
>
> So protect bedtime. Keep it about the same most nights, keep the last hour before it screen-free, and end the day with a story or a chat.

- C43's verified lines, verbatim ("learnt", en-IN, for the source's "learned"). "Goes with" is an association, never
  "sleep is when learning gets filed" ([source verification C43](../../research/source-verification.md#c43--sleep)).
- The last paragraph is house advice (no marker).

---

## Fold 5 · Calm

**Fold job:** what kind of stress matters, in the source's own terms, and what a parent can do: be there.

**Copy:**

> **H2:** Calm: a grown-up who steadies the hard days
>
> Not all stress is bad. But serious, ongoing adversity, such as abuse, neglect, violence or the strain of family hardship, can disrupt how a young child's brain develops when no caring adult is there to buffer it. Scientists call this toxic stress.⁶ Supportive relationships with caring adults help protect against it.⁶
>
> So calm does not mean a silent house, or a child who never cries. It means a grown-up who notices, comforts and stays. On a hard day, that comes first.

- C44's verified line, verbatim. It is about toxic stress, never everyday stress, and makes no ranking ("one of the
  few things reliably shown" is cut). The house paragraph pairs it with what a parent can do
  ([D026](../../decisions/D026-public-statistics.md): inform, never alarm). Question 3 covers the tone.

---

## Fold 6 · Play

**Fold job:** play as India's education policy describes early learning, then plain ideas for home.

**Copy:**

> **H2:** Play: time with nothing planned
>
> India's National Education Policy 2020 describes good early learning as "play-based, activity-based, and inquiry-based".⁷
>
> At home, that can be an afternoon with nothing on the calendar and a few open things within reach: blocks, a cardboard box, a dupatta that can be a cape or a river. Let your child decide what the game is, and join in when you're invited.

- C01's verified second line (NEP para 1.2, the same source as the learning-toys guide's note 3). A policy for
  Anganwadis, pre-schools and Grades 1 and 2, so the copy says "describes", never "research shows" or "NEP
  recommends" ([source verification C01-C03](../../research/source-verification.md#c01--nep-2020-the-first-six-years)).
- The second paragraph is advice only; the live article's "planning, memory, and self-control get their reps" had
  no source and is gone.

---

## Fold 7 · The dinner-table test (the one in-text product link)

**Fold job:** give the parent one test for anything sold as good for a young mind, then apply it to our own toy,
with its age limits. This fold holds no brain line; the nearest is fold 5.

**Copy:**

> **H2:** The dinner-table test
>
> A simple test for any toy, app or class: after ten minutes with it, does your child have something to tell you? Try it on what is already in your home: the blocks, the picture books, the cartoons.
>
> We make [Kheelu](https://kheelona.com/products/kheelu), a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. Judge it by the same test.
>
> It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play.

- The live H2 and test, kept; the live verdicts ("Blocks pass ... A cartoon marathon mostly fails") become the
  parent's own trial, so the page claims no result for any product.
- The Kheelu sentence carries only confirmed facts and no brain word, in its own paragraph and fold
  ([D016](../../decisions/D016-brain-wording.md); guard `kheelu-brain`). "Judge it by the same test" is the live article's
  honest line, kept.
- Age lines as on the learning-toys guide ([D041](../../decisions/D041-gate-a-round-1.md); [facts, age](../../product/facts.md#age)).
- Link: `/products/kheelu`, the page's one in-text product link ([strategy §3.3](../strategy.md#33-placement-and-repetition)).

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ² Center on the Developing Child at Harvard University, "Serve & Return Interaction Shapes Brain Circuitry", 2011, page description. https://developingchild.harvard.edu/resources/videos/serve-return-interaction-shapes-brain-circuitry/
>
> ³ Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract and Results. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/
>
> ⁴ Paruthi and colleagues for the American Academy of Sleep Medicine, "Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine", Journal of Clinical Sleep Medicine, 2016, Recommendations. https://doi.org/10.5664/jcsm.5866
>
> ⁵ Kurdziel, Duclos and Spencer, "Sleep spindles in midday naps enhance learning in preschool children", PNAS, 2013, Abstract and Results. https://doi.org/10.1073/pnas.1306418110
>
> ⁶ Center on the Developing Child at Harvard University, "Toxic Stress" (Key Concepts), 2024, updated 2025, Key Takeaways and Fast Facts. https://developingchild.harvard.edu/key-concept/toxic-stress/
>
> ⁷ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 1, para 1.2, p. 7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf

- The same list is the BlogPosting `citation` array. "Pediatric" in note 4 is part of the paper's title (a proper
  title, like "Indian Academy of Pediatrics"; the spelling guard only bans "pediatrician").
- Re-read the three Harvard pages before publishing (recent edits, [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 9 · Related guides

**Copy:**

> **H2:** Related guides
>
> - How children learn by talking
> - Learning toys for a 3-year-old, skill by skill
> - Screen-free does not mean silent

| Title (each guide's own card title, rendered from its module) | Real URL |
|---|---|
| How children learn by talking | `/stories/how-children-learn-by-talking` |
| Learning toys for a 3-year-old, skill by skill | `/stories/learning-toys-for-a-three-year-old` |
| Screen-free does not mean silent | `/stories/screen-free-does-not-mean-silent` |

The stub's related list, unchanged.

---

## Fold 10 · Close (journal close block)

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
| Title ≤ 60, primary at the start | Yes | 49 characters; the keyword map's draft ([§5.2](../../research/keyword-map.md#52-per-page)): "help your child's brain develop" |
| Meta ≤ 155: primary plus a concrete fact | Yes | 144 characters; the four things, in the page's order |
| One H1 with the primary | Partly | The H1 is the hub card title, "sharp brain", which matches the cluster's "how to make child brain sharp"; §5.2 asks for "brain develop" in the H1 (question 2) |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 question H2 "How can you help your child's brain develop?" and its 58-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2. §5.2's suggested H2 "Conversation, sleep, play and calm" is split into one H2 per thing (one idea per fold) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "brain develop" twice in `<main>` (fold 2 H2, fold 5) and "brain" 6 times in all, of about 680 words (under 1%); "Kheelu" 3 times (fold 7, the close's lead and its button: 0.4%) |
| Words never placed | Yes | No "brain-development toy" label, no brain line beside Kheelu, no "helps your child's brain grow", no "smarter", "boosts", "genius" or "fall behind", no health terms, no competitor names |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text link to the product page | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live article is by Apoorva Sahu, a co-founder named on `/team`. (a) Keep his name, after he reads
   the rewrite; (b) "The Kheelona team". **Recommend (a)**, as for the other two guides of this task; (b) if a named
   author on a brain-development topic feels like more authority than a non-clinician should claim.
2. **The H1.** (a) Keep the hub card title, "What actually builds a sharp brain in the early years" (as drafted): it is
   the title parents see on the hub, it matches the searched "how to make child brain sharp", and the primary is in
   the title tag, the meta and the answer heading; (b) an H1 with the keyword map's "brain develop", for example "How
   to help your child's brain develop", with the hub card unchanged, so the card and the page heading differ.
   **Recommend (a).**
3. **The calm fold names abuse, neglect and violence.** (a) Keep Harvard's definition of toxic stress, verbatim, with
   the house line after it (as drafted): it is the honest scope, and without it "stress harms the brain" would
   frighten every parent of a child who cries; (b) cut the research and keep only the house line. **Recommend (a).**

## Sources

| Claim | Source |
|---|---|
| Harvard: back-and-forth exchanges with a caring adult help build the connections in a young child's brain (fold 2) | [source verification C07](../../research/source-verification.md#c07--serve-and-return); excerpt `raw/research/sources/C07-harvard-serve-and-return.md:22-24, 36-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| "One of the most essential experiences in shaping the architecture of the developing brain"; a sound, a look or a gesture, and you respond | [source verification C08](../../research/source-verification.md#c08--one-of-the-most-essential-experiences) (ready line); excerpt `C08-harvard-serve-return-shapes-brain-circuitry.md:20-25` |
| Romeo 2018: 36 children aged 4 to 6; turns and Broca's area; no link with adult words; a link, not cause | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); excerpt `C09-romeo-2018-psychological-science.md:24-36, 58-64, 71-72` |
| AASM: 10 to 13 hours at 3 to 5, 9 to 12 at 6 to 12, naps included; the recommended hours go with better attention, behaviour, learning and memory | [source verification C43](../../research/source-verification.md#c43--sleep); excerpt `C43-aasm-2016-pediatric-sleep-consensus.md:16-20` |
| Nap study: preschoolers remembered more of a morning memory game after a nap | [source verification C43](../../research/source-verification.md#c43--sleep); excerpt `C43-kurdziel-2013-pnas-preschool-naps.md:17-23` |
| Toxic stress: not all stress is bad; serious, ongoing adversity without a caring adult can disrupt how a young child's brain develops; supportive relationships help protect | [source verification C44](../../research/source-verification.md#c44--stress); excerpt `C44-harvard-center-toxic-stress.md:16-30` |
| NEP 2020: early learning "play-based, activity-based, and inquiry-based" | [source verification C01](../../research/source-verification.md#c01--nep-2020-the-first-six-years) (note ²); excerpt `C03-nep-2020-para-1-2.md:16-21` |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Brain wording: a searched topic, never what Kheelu does; no brain line beside Kheelu | [D016](../../decisions/D016-brain-wording.md); [claims §4](../../product/claims.md#4-retired-or-banned-wording) row 15; [voice rules 2-4](../../brand/voice.md#voice-rules-from-the-positioning) |
| Not a toy for children under 3; a grown-up nearby at 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md); [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Cut lines ("sleep ... gets filed", "3 to 6 need ten to thirteen hours", "one of the few things reliably shown", "planning, memory, and self-control get their reps") | [source verification C43, C44](../../research/source-verification.md#3-every-claim) caveats; [age-band review](../../product/age-band-review.md) row 47 |
| Card title and summary, related list, first-published date | `src/content/en-IN/stories/articles/what-actually-builds-a-sharp-brain.ts` (stub); [stories.md fold 5](stories.md#fold-5--learning-and-play-learning); `src/lib/stories-expansion.ts:145` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Photo | DS `03-cast.md:11, 37-43, 115` (Ira, 5; confidence and creativity); file checked by eye 2026-10-13 |
