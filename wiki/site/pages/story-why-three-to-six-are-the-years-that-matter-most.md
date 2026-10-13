---
title: "Story: Why the early years matter most (/stories/why-three-to-six-are-the-years-that-matter-most): page copy, task 5.19 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../engineering/tasks.md (Wave 5 table, row 5.19; the part C paragraph; the note on the 18 articles without a mockup)
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../url-map.md (§1b; §4, the short redirect /stories/why-three-to-six-matters-most)
  - ../pages/story-learning-toys-for-a-three-year-old.md (format, brain-line distance, age lines, close block, sticky bar)
  - ../pages/stories.md (fold 5 card: title and summary, kept word for word)
  - ../pages/home.md (CTA block, sticky bar, `{price-source}`)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§2.3 LRN-13, §4.2, §4.3, §5.1, §5.2, §6.6 EY1)
  - ../../research/source-verification.md (§3.1, §3.3, §3.7, §4: C01, C02, C05, C07, C43; §5)
  - "../../raw/research/sources/: C05-harvard-brain-architecture.md, C05-ncf-fs-2022-brain-development.md, C07-harvard-serve-and-return.md, C02-nep-2020-para-4-1.md, C43-aasm-2016-pediatric-sleep-consensus.md, C01-nep-2020-para-1-1.md (read, not used: question 2)"
  - ../../product/claims.md (§1, §4, §8), ../../product/facts.md, ../../product/age-band-review.md (rows 42, 47)
  - ../../brand/voice.md (rules 2, 4, 7, 8), ../../brand/messaging.md (claims guardrails, the early years)
  - ../../decisions/D016, D017, D026, D041
  - "src/content/en-IN/stories/articles/why-three-to-six-are-the-years-that-matter-most.ts (stub: card, related, dates); src/lib/stories.ts:47-73 (the live article, input only); test/guards/banned-phrases.data.ts"
  - "design-system/project/03-cast.md:120 (Tara 04); assets/Photo library/tara-04-reading-nook-web.webp, checked by eye 2026-10-13 (read-only)"
  - ../../qa/cmo-review-articles-5.19-2026-10-14.md (round 1: M10, M11 fixed in round 2; round 2: no new finding on this page; R2-3 ruled at the merge, no change)
  - ../../qa/cmo-review-articles-5.18-2026-10-14.md (M13: one alt per photo across the journal; the alt of tara-04)
  - ../../engineering/tasks.md (§4.9 and 5.20: the part C rulings, "D025 reading: as written"; the 5.20 subsection, item 2 and the photo pools)
---

# Story: Why the early years matter most

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review of the task 5.19 copy stage
> and the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁵` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
  Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: visual acceptance is template parity with
  `story-learning-toys-for-a-three-year-old.html` ([tasks](../../engineering/tasks.md), the note under the Wave 5 table).
- Every fold maps to a block the article template renders (`Article` in `src/content/types.ts`;
  `src/layouts/ArticleTemplate/`): the head, the answer with its detail, parts with `p` blocks, the sources, the
  related guides and the `journal` close.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/why-three-to-six-are-the-years-that-matter-most` (no mockup; slug unchanged, question 3) |
| Page job | Answer "why do the early years matter so much?" for a parent of a 3 to 7 year old: what is being built (sourced, calm, never a deadline), and the three ordinary things the hub card promises, talk, play and sleep; route to the how-to guide and, once, to the product page ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **why the early years matter** (LRN-13); secondaries "foundational stage (NEP 2020)", "early childhood development"; no volume data ([keyword map §2.3, §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (57 characters) | Why the early years matter most for your child · Kheelona |
| Meta description (151 characters) | Why the early years matter most: what Harvard's Center on the Developing Child says about the young brain, and why talk, play and sleep fill them well. |
| H1 | Why the early years matter most (the hub card title, as live) |
| Lead | The hub card summary, word for word |
| Byline line | Apoorva Sahu · First published 28 Jul 2026 · 3 min read (byline: question 1) |
| Read time | Derived at build: about 560 words in the head and reading column, so 3 minutes at 200 words a minute |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` (the shell's, because the close is `journal`) |
| In-text product link | One, in fold 7 ("Kheelu" → `/products/kheelu`) |
| Other in-text link | Fold 4: `/stories/what-actually-builds-a-sharp-brain` (the how-to guide) |
| Template settings | `close: "journal"`; `og: DEFAULT_OG`; `updated`: the rewrite's date, set by the builder; close art with its doodle (not in `PLAIN_CLOSE_ART`) |

**What changed from the live article** (`src/lib/stories.ts:47-73`): the opening "Somewhere between the second and
fifth birthday" is cut (it starts the page below 3); "a child's brain builds connections faster than it ever will
again" becomes Harvard's own words, attributed, called an estimate, with the Center's "new connections can form
throughout life" ([source verification C05](../../research/source-verification.md#c05--the-early-years-and-brain-connections));
"brain development toys and worksheets are not what the research keeps pointing at. It keeps pointing at
conversation" becomes the C07 line with its marker; "Every answered question teaches two things at once ... That is
the whole engine" is cut (no source); "Feelings are the fast lane ... Children learn fastest from exchanges that feel
good" is cut ([source verification C45](../../research/source-verification.md#51-not-supported-4), NOT-SUPPORTED); the
pitch ("a talking toy that keeps the conversation going when your hands are full ... a refundable ₹499") becomes one
in-text product line, with the price only in the close; play and sleep are added because the hub card promises them,
sleep in the AASM's own ages (C43; [age-band review](../../product/age-band-review.md) row 47). The slug stays.

**Overlap.** `what-actually-builds-a-sharp-brain` owns the how (it gets the in-text link from fold 4); this page owns
the why and keeps each of talk, play and sleep to one short fold. `how-children-learn-by-talking` owns "serve and
return": the term is in no heading here. `learning-toys-for-a-three-year-old` also cites the Foundational Stage; this
page quotes NEP para 4.2 ("play/activity-based") rather than para 1.2, so the two guides do not repeat each other
([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags): "the two brain articles", a low,
accepted overlap).

---

## Fold 1 · Article head

**Fold job:** say what the page answers, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › Learning and play
>
> **H1:** Why the early years matter most
>
> What the early years are for, and the ordinary things that fill them well: talk, play and sleep.
>
> Apoorva Sahu · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "matter most".
- **Lead:** the hub card summary, verbatim ([stories.md fold 5](stories.md#fold-5--learning-and-play-learning); stub module).
- Breadcrumb: "Stories" → `/stories`; "Learning and play" → `/stories#learning`.
- **Dates:** "First published" is the live `published` value (`2026-07-28`, `src/lib/stories.ts:55`). `updated` is the
  rewrite's date, set by the builder (after the live `2026-09-05`).
- **Image** (`kh-photo`, 4:5, the head's portrait layout): `tara-04-reading-nook-web.webp`. Alt: "A girl with curly hair,
  in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page."
  (`03-cast.md:120`: "Reading and school readiness"; Tara is 5½, inside the band.) No Kheelu in the head photo
  of a brain article, as on the learning-toys guide.
- Round 2 (CMO M11): `tara-04` is now this page's head alone among the six guides of task 5.19; the data-law article,
  which also used it in round 1, moved to `advik-04`. Across the journal it also heads two talking guides once tasks
  5.20a and 5.20b land (how children learn by talking, and raising a bilingual child; the screen-time guides move to
  photos with Kheelu), and how children learn by talking is in this page's related list and lists this page in its
  own: see "Changes after approval" below.
- **Task 5.20c (one alt per photo):** the alt is now the journal's one alt for `tara-04`, word for word as on the
  how-children-learn-by-talking guide ([CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md) M13;
  [tasks](../../engineering/tasks.md) 5.20 item 2). The photo stays: brain guides keep a head photo without Kheelu
  ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, then frame the page.

**Copy:**

> **H2:** Why do the early years matter so much?
>
> Because so much is built in them. Harvard's Center on the Developing Child calls the early years the most active period for building connections in the brain,¹ and says back-and-forth exchanges with a caring adult help build them.² What fills these years well is ordinary: talk, play and sleep, with the people who love your child.
>
> None of it needs a class or a kit. Here is what is being built, and the three ordinary things that fill these years well.

- Answer: 56 words (markers excluded). The keyword map's EY1 draft, with its open `[CITE: NEP 2020]` resolved:
  the NEP line moves to fold 5, where it describes play, not the brain (C02 caveat 1: a school stage, never a
  statement about brain years). Both Harvard clauses are verified lines in short form (C05, C07), each with its own
  marker; "a caring adult" kept.
- The second paragraph is the answer's `detail` (one `p`).
- No product in this fold ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 3 · What is being built

**Fold job:** the sourced picture of the early years, then the calm reading of it: busy years, not a deadline.

**Copy:**

> **H2:** What happens in a young child's brain?
>
> Harvard's Center on the Developing Child estimates that more than a million new connections form in the brain every second in the first few years of life.¹ The early years are the most active period for building those connections, but new connections can form throughout life.¹
>
> India's National Curriculum Framework for the Foundational Stage says brain development is most rapid in the first eight years of a child's life.³ So if your child is between 3 and 7, they are still inside those years.
>
> Both describe how busy these years are. Neither is a deadline.

- Paragraph 1: C05's verified line ("estimates", attributed, "the first few years of life", never a peak age band)
  and the rest of the same Fast Facts bullet, verbatim (excerpt `C05-harvard-brain-architecture.md:22-27`).
- Paragraph 2: C05's Indian alternative, verbatim (excerpt `C05-ncf-fs-2022-brain-development.md:27-30`); "the first
  eight years" is birth to 8, so "still inside those years" is plain arithmetic for 3 to 7, not a claim that these
  ages are the peak (C05 caveat 3). Round 2 (CMO M10): "they are", not "you are", so the sentence is about the
  child's first eight years, not the parent's.
- The last two sentences are house voice, resting on "new connections can form throughout life": the page informs,
  never alarms ([voice rule 4](../../brand/voice.md#voice-rules-from-the-positioning); never "don't miss the window").
- NEP's "over 85% ... prior to the age of 6" is left out on purpose (question 2).

---

## Fold 4 · Talk

**Fold job:** the first ordinary thing, with its source, and a pointer to the how-to guide.

**Copy:**

> **H2:** Talk: answer, then ask one back
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.²
>
> Between 3 and 7, a serve is often a question, a story or a complaint about a sibling. Your return is your attention and a reply. Try ending it with a question back, then wait.
>
> For more ways to do this every day, read our guide to [what actually builds a sharp brain](https://kheelona.com/stories/what-actually-builds-a-sharp-brain).

- Paragraph 1 is the verified C07 line, verbatim. Paragraph 2 is house advice (no marker).
- The link goes to the how-to guide (also in the related list); it is an article link, not the product link. Its text
  is shorter than the guide's title so "early years" is not repeated once more (density, below).

---

## Fold 5 · Play

**Fold job:** play as India's school system frames the years from 3 to 8, then three plain ideas.

**Copy:**

> **H2:** Play, and plenty of it
>
> India's National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage of school education: three years of Anganwadi or pre-school, then Grades 1 and 2.⁴ It describes those five years as "flexible, multilevel, play/activity-based learning".⁴
>
> At home, play needs very little: a pretend shop, a cardboard box that becomes a bus, a tower built only to be knocked down. Let your child lead, and join in when you're asked.

- Sentence 1 is C02's verified line ([source verification C02](../../research/source-verification.md#c02--the-foundational-stage));
  sentence 2 quotes para 4.2 of the same page of NEP, verbatim (excerpt `C02-nep-2020-para-4-1.md:35-37`). A policy for
  Anganwadis, pre-schools and schools: "describes", never "NEP recommends" or anything about toys.
- This fold is about play, in its own fold after the brain lines, and follows no 85% line (C02 caveat 1: never
  read the school stage as a statement about brain years).

---

## Fold 6 · Sleep

**Fold job:** the published hours for the band, and one habit.

**Copy:**

> **H2:** Sleep, the part that's easiest to cut
>
> Children aged 3 to 5 need 10 to 13 hours of sleep in every 24, naps included, and children aged 6 to 12 need 9 to 12 hours.⁵
>
> Late dinners, family functions and screens all eat into it. So keep bedtime steady, most nights.

- C43's verified hours, verbatim, with the AASM's own age bands (the live "3 to 6" is wrong at 6, row 47). The
  association with learning and memory and the nap study are left to the how-to guide, so the two pages do not repeat.

---

## Fold 7 · What these years don't need (the one in-text product link)

**Fold job:** take the pressure off, sum up, and say once, calmly, where Kheelu fits, with its age limits. This fold
holds no brain line; the nearest is fold 4, three folds up.

**Copy:**

> **H2:** What these years don't need
>
> A packed timetable. Flashcards before breakfast. The worry that you have already missed something.
>
> What fills these years well is ordinary: talk, play and sleep, most days, with the people who love your child.
>
> [Kheelu](https://kheelona.com/products/kheelu) is built around the first of those: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. No toy replaces the people who talk with your child every day, ours included.
>
> It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play.

- "Built around" is the approved form ([voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning)); the Kheelu
  sentence carries only confirmed facts and no brain word ([D016](../../decisions/D016-brain-wording.md); guard
  `kheelu-brain`).
- "No toy replaces the people who talk with your child every day" is the approved late-talker page's house line;
  "ours included" applies it to Kheelu, which limits the claim rather than adding one
  ([voice rule 8](../../brand/voice.md#voice-rules-from-the-positioning)).
- Age lines as on the learning-toys guide ([D041](../../decisions/D041-gate-a-round-1.md); [facts, age](../../product/facts.md#age)).
- Link: `/products/kheelu`, the page's one in-text product link ([strategy §3.3](../strategy.md#33-placement-and-repetition)).

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Brain Architecture" (Key Concepts), 2024, updated 2026, Fast Facts. https://developingchild.harvard.edu/key-concept/brain-architecture/
>
> ² Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ³ National Steering Committee for National Curriculum Frameworks, "National Curriculum Framework for Foundational Stage 2022", 2022, section 1.1.3, p. 17. https://ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf
>
> ⁴ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 4, paras 4.1 and 4.2, p. 11. https://ncert.nic.in/pdf/nep/NEP_2020.pdf
>
> ⁵ Paruthi and colleagues for the American Academy of Sleep Medicine, "Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine", Journal of Clinical Sleep Medicine, 2016, Recommendations. https://doi.org/10.5664/jcsm.5866

- The same list is the BlogPosting `citation` array. Re-read the two Harvard pages before publishing (recent edits,
  [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 9 · Related guides

**Copy:**

> **H2:** Related guides
>
> - Screen-free does not mean silent
> - How children learn by talking
> - What actually builds a sharp brain in the early years

| Title (each guide's own card title, rendered from its module) | Real URL |
|---|---|
| Screen-free does not mean silent | `/stories/screen-free-does-not-mean-silent` |
| How children learn by talking | `/stories/how-children-learn-by-talking` |
| What actually builds a sharp brain in the early years | `/stories/what-actually-builds-a-sharp-brain` |

The stub's related list, unchanged (its one swap, `screen-free-does-not-mean-silent` for
`questions-parents-ask-about-ai-toys`, keeps three incoming links on that guide: `articles.test.ts`).

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
| Title ≤ 60, primary at the start | Yes | 57 characters; the keyword map's draft ("for a child", 54) made parent-first: "for your child" |
| Meta ≤ 155: primary plus a concrete fact | Yes | 151 characters; names the source and the three things |
| One H1 with the primary | Yes | "Why the early years matter most" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 question H2 and its 56-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2 "Why do the early years matter so much?" (§5.2's suggested "What fills the early years" becomes the answer's last sentence and fold 7's summary line, to keep the term's density down) |
| Secondary "foundational stage (NEP 2020)" | Yes | Fold 5, with its marker |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "early years" 6 times (H1, lead, fold 2 H2, answer, fold 3, the related title): 12 words of about 560 in the head and reading column (2.1%, at the 2% flag), about 1.5% of `<main>` with the sources, related guides and close (about 800 words); under the 3% rewrite line ([§5.1](../../research/keyword-map.md#51-rules-for-every-page) rule 7). The lead and the related title are fixed copy, so fold 3's heading, fold 3's last line, fold 4's link text and fold 7's heading say "these years" or "a young child's brain" instead. "Kheelu" 3 times (0.5%) |
| Words never placed | Yes | No "don't miss the window", "fall behind" or deadline wording; no 85% line; no peak age band; no brain line beside Kheelu; no health terms; no competitor names |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (folds 4, 7) | text links | none (not buttons) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** The live article is by Apoorva Sahu, a co-founder named on `/team`. (a) Keep his name, after he reads
   the rewrite; (b) "The Kheelona team". **Recommend (a)**, as for the other two guides of this task.
2. **NEP's 85% line.** Your ruling D026 allows it, verified: "over 85% of a child's cumulative brain development
   occurs prior to the age of 6". (a) Leave it out (as drafted); (b) add it to fold 3 with its marker, quoted exactly,
   followed by Harvard's "new connections can form throughout life". **Recommend (a)**: NEP cites no source for the
   figure (no scientific original was found, [source verification C01](../../research/source-verification.md#c01--nep-2020-the-first-six-years)),
   and to a parent of a 6 or 7 year old, "before 6" reads as a deadline already passed, which this page exists to undo.
   Harvard's and the NCF's lines make the same point without one.
3. **The slug.** `why-three-to-six-are-the-years-that-matter-most` says ages 3 to 6 matter most, which no source says
   ([source verification C05](../../research/source-verification.md#c05--the-early-years-and-brain-connections) caveat 4).
   (a) Keep it (as drafted): no visible copy repeats it, URLs keep their equity, and the
   [age-band review](../../product/age-band-review.md) row 42 already ruled "Slug stays"; (b) move the page to
   `/stories/why-the-early-years-matter-most` with a one-hop redirect, plus the existing short link
   `/stories/why-three-to-six-matters-most` repointed in one hop. **Recommend (a)**: the page had no landings in the
   audit window ([url map §1b](../url-map.md#1b-journal-articles-22)), so either is cheap, but (b) adds redirects for
   a phrase readers only see in the address bar.

## Sources

| Claim | Source |
|---|---|
| Harvard: the early years are the most active period for building connections in the brain; an estimated million new connections a second in the first few years; new connections can form throughout life | [source verification C05](../../research/source-verification.md#c05--the-early-years-and-brain-connections) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C05-harvard-brain-architecture.md:22-27` |
| NCF-FS 2022: brain development is most rapid in the first eight years | [source verification C05](../../research/source-verification.md#c05--the-early-years-and-brain-connections) (Indian alternative); excerpt `C05-ncf-fs-2022-brain-development.md:27-30` |
| Harvard serve-and-return line, verbatim, with "a caring adult" (folds 2, 4) | [source verification C07](../../research/source-verification.md#c07--serve-and-return); excerpt `C07-harvard-serve-and-return.md:22-28, 36-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| NEP 2020: Foundational Stage, ages 3 to 8, three years of Anganwadi or pre-school then Grades 1 and 2; "flexible, multilevel, play/activity-based learning" | [source verification C02](../../research/source-verification.md#c02--the-foundational-stage); excerpt `C02-nep-2020-para-4-1.md:23-37` |
| AASM: 10 to 13 hours at 3 to 5, 9 to 12 at 6 to 12, naps included | [source verification C43](../../research/source-verification.md#c43--sleep); excerpt `C43-aasm-2016-pediatric-sleep-consensus.md:16-18` |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| "Built around"; "No toy replaces the people who talk with your child every day" | [voice rules 7, 8](../../brand/voice.md#voice-rules-from-the-positioning); [late-talker page fold 7](story-talking-toys-and-late-talkers.md#fold-7--two-myths) |
| Brain wording: a searched topic, never what Kheelu does; no brain line beside Kheelu; no fear | [D016](../../decisions/D016-brain-wording.md); [claims §4](../../product/claims.md#4-retired-or-banned-wording) rows 15 and 20; [messaging, claims guardrails](../../brand/messaging.md#claims-guardrails) ("The early years") |
| Not a toy for children under 3; a grown-up nearby at 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md); [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Cut lines ("builds connections faster than it ever will again" unattributed; "Children learn fastest from exchanges that feel good"; "the whole engine") | [source verification C05, C45](../../research/source-verification.md#5-do-not-use) |
| NEP 85% (not used) | [source verification C01](../../research/source-verification.md#c01--nep-2020-the-first-six-years); [D026](../../decisions/D026-public-statistics.md); question 2 |
| Slug kept | [age-band review](../../product/age-band-review.md) row 42; [url map §1b, §4](../url-map.md#1b-journal-articles-22) |
| Card title and summary, related list, first-published date | `src/content/en-IN/stories/articles/why-three-to-six-are-the-years-that-matter-most.ts` (stub); [stories.md fold 5](stories.md#fold-5--learning-and-play-learning); `src/lib/stories.ts:55` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Photo | DS `03-cast.md:12, 45-51, 120` (Tara, 5½; reading); file checked by eye 2026-10-13 |
| Alt of the head photo (task 5.20c) | The how-children-learn-by-talking guide's alt for `tara-04`, word for word ([story-how-children-learn-by-talking.md](story-how-children-learn-by-talking.md) fold 1); [CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md) M13 |

## Changes after approval (task 5.20c)

The copy the CMO approved in round 2 of the [5.19 review](../../qa/cmo-review-articles-5.19-2026-10-14.md) ("PASS",
no minor still open). The founder signs off the copy at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

| What | Change | Why |
|---|---|---|
| Fold 1, head photo alt | "A girl with curly hair, in a coral block-print kurta, sits cross-legged in a window nook, reading a picture book aloud and pointing at the page." became "A girl with curly hair, in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page." | One alt per photo across the journal ([tasks](../../engineering/tasks.md) 5.20 item 2; CMO review 5.18 M13 names this alt for `tara-04`). The photo, its file and its scene are unchanged |
| Fold 1 notes; Sources table; front matter | Updated to match; the round-2 M11 note now says `tara-04` is this page's head alone among task 5.19's six guides, not across the journal | So the page stays true |

**Checked and already done** (round 2, nothing to change): M10 ("they are still inside those years", fold 3) and M11
(`tara-04` no longer shared with the data-law guide).

**No Copy block changed.** Read time (3 minutes), counts and keyword placements are as approved.

**Not changed:** R2-3 (D025 disclaimer after the fold 4 C07 paragraph). The main session ruled at the part C merge:
"D025 reading: as written … the AI and brain guides need none" ([tasks](../../engineering/tasks.md), §4.9 and 5.20).
The head photo stays `tara-04` (main session: brain guides keep their `-04` heads; D016). No research line was added
or changed. Founder questions P21 to P23 do not touch this page.

**Open, for the main session (not changed here):** this page and how children learn by talking share the `tara-04`
head and link to each other both ways (this page's related list; that guide's related list, `how-children-learn-by-talking.ts:26`),
so a parent who taps "Related guides" lands on the same picture: the repeat that CMO reviews 5.17 M16 and 5.18 M13
set out to remove. The 5.18 review left the 5.19 picks to the merge. Options are in this task's report.

**For the builder:** the module `why-three-to-six-are-the-years-that-matter-most.ts` takes the new alt in the same
commit (`ai-safety-and-learning.test.tsx` reads the alt from fold 1); `updated` stays 2026-10-13.
