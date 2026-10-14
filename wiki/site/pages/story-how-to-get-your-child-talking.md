---
title: "Story: How to get your child to talk more (/stories/how-to-get-your-child-talking): page copy, task 5.18 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 the other 20 articles kept and refreshed; §5 /stories/* row)
  - ../gate-a-open-items.md (B5, B15, B45)
  - ../pages/stories.md (fold 3 card; the keep-reading close)
  - ../pages/story-talking-toys-and-late-talkers.md (the approved speech model)
  - ../pages/story-learning-toys-for-a-three-year-old.md (fold 4 "Try this" house line)
  - ../content-boundary.md
  - ../../engineering/tasks.md (wave 5 part C; row 5.18; the note on the 18 articles without a mockup)
  - ../../research/keyword-map.md (§2.3 LRN-6, §4.2, §5.1, §5.2, §6.8 LD1, LD4)
  - ../../research/source-verification.md (§3.3, §4: C07, C09, C10 house line; §5)
  - "../../raw/research/sources/: C07-harvard-serve-and-return.md, C09-romeo-2018-psychological-science.md"
  - ../../product/claims.md (§1 speech disclaimer, §4, §8), ../../product/facts.md (team, byline)
  - ../../brand/messaging.md (words to stop using), ../../brand/voice.md
  - ../../decisions/D016, D025, D026, D041
  - ../../qa/cmo-review-articles-5.18-2026-10-14.md (M5, M13; applied in task 5.20b)
  - "src/lib/stories-expansion.ts:91-113 (the live article; input only, read in the w5c-5.18 worktree); src/content/en-IN/stories/articles/how-to-get-your-child-talking.ts (stub: card, related, dates)"
  - "src/content/types.ts (Article, Answer, ProseBlock), src/layouts/ArticleTemplate/ArticleTemplate.tsx, src/content/en-IN/stories/articles/index.ts (articlePageCopy.keep), src/assets/icons.generated.ts (DS icon names)"
  - "test/guards/banned-phrases.data.ts; test/e2e/content-integrity.spec.ts:25-60"
  - design-system/project/03-cast.md:37-43,115 (read-only); photo checked by eye 2026-10-13
  - ../../qa/cmo-review-built-b-2026-10-14.md (m3, the related ring, folding in 5.18 M6; applied by task 7.1d to fold 10, see the foot of this page)
---

# Story: How to get your child to talk more

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review (task 5.18 copy stage) and the
> founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` and `²` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), in reading order; in the module they
  are `[^n]`. Every statement about speech or language carries one ([D025](../../decisions/D025-speech-and-language.md)).
  Lines without a marker are plain advice in our own voice and make no research claim.
- There is no mockup for this article: visual acceptance is template parity with
  `story-learning-toys-for-a-three-year-old.html` (tasks.md, wave 5 note), and text parity is against this page.
  Links show the real URL only.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/how-to-get-your-child-talking` |
| Page job | Give a parent of a 3 to 7 year old the habits that turn one-word answers into conversations: smaller questions, going first, waiting, following up, and games where talking is the turn. **No Kheelu pitch** (task 5.18 notes: no product pitch on the talking-and-language pages; question 1); the page ends on keep reading |
| Primary cluster | **how to get your child to talk more** (LRN-6 · 3 to 7); secondaries "conversation starters", "games that get a child talking" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22), §5.2) |
| Title (45 characters) | How to get your child to talk more · Kheelona |
| Meta description (147 characters) | How to get your child to talk more: better questions than "How was school?", the follow-up that keeps it going, and games that get a child talking. |
| H1 | How to get your child to talk more (question 3) |
| Answer first | Fold 2: question H2 and a 49-word answer, the D025 line directly under it |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read (question 4) |
| Read time | 3 min: about 553 words of body (answer, disclaimer, parts and headings; about 549 before task 5.20b), `round(words / 200)` as `src/lib/stories.ts:184-186` |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome (nav, drawer) keeps its own button |
| In-text product link | None (question 1). One in-text link to a sibling guide, `/stories/talking-late-or-talking-little` (fold 8) |
| Card, related, dates (unchanged from the stub, apart from related: task 7.1d) | Card title "How to get your child talking"; card summary "Better questions than "How was school?", and the small habits that turn one-word answers into conversations." (curly quotes in the module); related `talking-late-or-talking-little`, `raising-a-bilingual-child-in-india`, `how-children-collect-words` (CMO B m3's ring; fold 10); published `2026-07-28`; updated: see the builder notes |
| Template settings | `close: "keep"` (no sticky bar, `sticky-bar-paths.ts`); `answer.detail` = one `disclaimer` block; topic `talking` (crumb "Talking and language") |

**What changed from the live article** (`src/lib/stories-expansion.ts:91-113`): the H1 and title carry the searched
words ("talk more", keyword map §5.2) and the answer comes first. Unsourced claims about children are cut or turned
into plain advice: "broad questions are genuinely hard to answer" (also a DS avoid-word), "specific questions are
easier to enter … one good answer usually brings friends", "children join conversations more easily than they start
them", "the gap is where children decide to fill". "The same mechanism researchers keep finding at the center of
language growth" overstated the research (and spelt "center"); it is replaced by Harvard's own words (C07) and the
2018 study with its real ages and limits (C09). The closing Kheelu pitch ("That is the job we gave Kheelu: ask,
listen, ask again") is gone (no pitch). New: conversation starters for after school, the games section the keyword
map asks for, the D025 line, and a link to the "when to ask" guide. The byline names the team (the live byline names
a person removed from the site).

**Builder notes (module shape).** `head.title` "How to get your child to {hand:talk more}"; `head.lead` is the card
summary, word for word; `head.author` `TEAM_BYLINE`; `head.readMinutes` 3; `head.image` the photo below. `answer` =
`{ question, answer, detail: [{ kind: "disclaimer", text }] }`. `body`: fold 3 is an untitled part; folds 4 to 8 are
titled parts (`p`, `list`, `list` with `variant: "tips"` and the icons named). `sources`: two entries. `meta.og`:
`DEFAULT_OG`. **Dates:** the main session's note keeps the stub's dates; task 5.6 set `updated` to the rewrite's date
on its three articles, so the main session rules which applies (the stub's `updated` is `2026-09-05`).
**Ruled at the wave 5 part C merge (main session):** `updated` is the rewrite's date, 2026-10-13, as task 5.6 set it; `published` stays the live page's.

---

## Fold 1 · Article head

**Fold job:** say what the page gives, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** How to get your child to talk more
>
> Better questions than "How was school?", and the small habits that turn one-word answers into conversations.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "talk more".
- Breadcrumb: "Stories" → `/stories`; "Talking and language" → `/stories#talking`.
- The lead is the approved hub card summary, word for word ([stories.md fold 3](stories.md#fold-3--talking-and-language-talking)).
- Published date from the stub (`2026-07-28`); the byline shows only "First published".
- **Image** (`kh-photo`, 4:5): `ira-04-paper-crown-web.webp`. Alt: "A laughing girl with a long braid holds a yellow
  paper crown on her head, beside a low table scattered with crayons and paper scraps." Ira is the cast's storyteller,
  who "talks with both hands" (`03-cast.md:41`); the photo has no Kheelu (`03-cast.md:115`, "confidence and
  creativity"). **No Kheelu in any image on this page** (no pitch). CMO review M13 (task 5.20b): this page keeps
  `ira-04`, and its alt becomes the journal's one alt for this photo (the toy-that-talks guide takes it word for
  word); the collect-words guide, which this page lists, moves off `ira-04`, so no guide this page links to (or that
  links here) opens on the same photo.

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer in 40 to 60 words with the three habits, then say once that a toy is not a treatment.

**Copy:**

> **H2:** How can you get your child to talk more?
>
> Ask small, specific questions, wait for the answer, and follow up on whatever comes back. Instead of "How was school?", try "Who made you laugh today?" Harvard's Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language and social skills.¹
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 49 words (marker excluded). The first two sentences are advice; the third is C07's Key Takeaway 3 in the
  verified wording, keeping "a caring adult" ([source verification C07](../../research/source-verification.md#c07--serve-and-return)).
  It credits the adult, never a toy ([D016](../../decisions/D016-brain-wording.md)).
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim, as on the approved late-talker
  page, in `kh-body-s` italics under the answer: the task's rule puts it wherever language development is discussed
  (question 2 covers the wording). It is the only mention of Kheelu on the page.

---

## Fold 3 · The scene

**Fold job:** the moment every parent knows, then the turn to what works.

**Copy:**

> How was school? "Fine." What did you do? "Nothing." Two questions in, the conversation is over, and the child who once told you about every ant on the footpath now answers in one word.
>
> A whole day is a lot to sum up, and "fine" does the job. So ask about a smaller piece of it.

- An untitled part. House voice, no claim about children's minds (the live "the vault is rarely about you" and
  "broad questions are genuinely hard" are cut).

---

## Fold 4 · Conversation starters

**Fold job:** questions a parent can use at pick-up today.

**Copy:**

> **H2:** Conversation starters for after school
>
> Ask about one small, real moment instead of the whole day:
>
> - Who made you laugh today?
> - What was the best thing in your tiffin? And the worst?
> - Who did you sit next to? What did you talk about?
> - What was the hardest thing you did today?
> - What did you play outside? Who won?
> - On a day at home: "What did you and Nani see at the market?"
>
> One question a day is plenty. Keep the rest for tomorrow.

- `list` (bullets). The H2 carries the secondary "conversation starters" (LRN-6 phrasings). Advice only.

---

## Fold 5 · Go first, then wait

**Fold job:** two habits, in our own voice, with no claim attached.

**Copy:**

> **H2:** Go first, then wait
>
> Start with your own answer: "The worst thing in my lunch today was cold upma. What was yours?" Now your child knows the kind of answer you mean.
>
> Then wait. Count to five in your head before you ask again or answer for them. It will feel long. Wait anyway.

---

## Fold 6 · Follow up

**Fold job:** the follow-up as the habit that matters most, and the study behind turns, with its real ages and limits.

**Copy:**

> **H2:** Follow up on whatever comes back
>
> Whatever your child says, take it one step further, out of curiosity, not as a quiz: "He fell off the bench? What did your teacher do? And then?"
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.²
>
> In the study, a turn was an adult speaking and the child replying, or the other way round.² Its authors suggest encouraging parents to talk with their children in "more interactive, back-and-forth conversation".² Every follow-up is one more turn.

- The study paragraph is the verified C09 line ([source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6)),
  trimmed of its scores sentence (stricter, not looser); the turn definition and the authors' suggestion are the
  paper's own (Method; Discussion). Ages stay 4 to 6, never three-year-olds ([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- "Every follow-up is one more turn" is a house line in its own sentence, applying the study's definition.
- "Teacher" is the child's own teacher, never Kheelu ([messaging, words to stop using](../../brand/messaging.md#words-to-stop-using)).

---

## Fold 7 · Games

**Fold job:** play that makes talking the turn; the keyword map's H2.

**Copy:**

> **H2:** Games that get a child talking
>
> In each of these, your child has to talk to take their turn.
>
> - Describe it, don't point: "I spy something yellow that you peel before you eat it." Then swap.
> - Play shop. Your child runs it, and you keep asking: "Do you have a smaller one? How much is it?"
> - Read a picture book together, and pause once or twice to ask what your child thinks will happen next.
> - Make up a story in turns: you say one line, your child says the next.
> - Sing a rhyme and stop before the last word, so your child can fill it in.
> - On a call with a grandparent, let your child tell one thing from their day.

- `list` with `variant: "tips"`; icons from the DS set, in order: `eye`, `currency-inr`, `book-open`,
  `chat-circle-dots`, `music-notes`, `users-three`.
- The picture-book tip is the C10 house line, used without the study (as on the learning-toys page, fold 4).
- No claim that any game helps speech; the keyword map's "games that help speech" is met by "get a child talking".

---

## Fold 8 · If your child talks very little

**Fold job:** route a worried parent to the "when to ask" guide, without a speech claim here.

**Copy:**

> **H2:** What if your child talks very little?
>
> If your child says very little everywhere, not only after school, read our guide on [what varies between children, and when to ask a professional](/stories/talking-late-or-talking-little).

- Link → `/stories/talking-late-or-talking-little` (an article, not a product link). The D025 line in fold 2 already
  says "talk to your paediatrician", so this answer about speech sits on a page that carries it (tasks.md row 5.18).
- The line is the CMO's wording (M5), word for word: "your child says very little" names what "it" left unclear,
  and echoes the H2. Advice only, no marker.

---

## Fold 9 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ² Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract, Method and Discussion. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/

- The same list is the BlogPosting `citation` array. Re-read the Harvard page before publishing (it shows recent
  edits; [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 10 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase.

**Copy:**

> **H2:** Keep reading
>
> - Talking late, or talking little?
> - Raising a bilingual child in India
> - How children collect words
>
> [All guides for parents of 3 to 7 year olds] → `/stories`

| Title (each guide's card title, read by the template, as the hub prints it) | Real URL |
|---|---|
| Talking late, or talking little? | `/stories/talking-late-or-talking-little` |
| Raising a bilingual child in India | `/stories/raising-a-bilingual-child-in-india` |
| How children collect words | `/stories/how-children-collect-words` |

- The related list is the ring of [CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md), finding m3
  (task 7.1d; it folds in [CMO 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M6): the data-law
  guide, which the legacy ring gave this page as the guide before it in the live journal's order
  (`articles.test.ts:183-210`; the approved note called it a swap), leaves; talking late moves up to first; the bilingual
  guide comes in second; collect words stays third. Why each: all three are talking-and-language guides with the same
  keep-reading close and no pitch, so a parent who came for talking habits stays on the subject. Talking late is the
  "what varies, and when to ask" guide that fold 8 links; the bilingual guide is the journal's guide to two languages
  at home; collect words is about new words, in every language a home speaks. M6 had offered
  `how-children-learn-by-talking` in the data-law guide's place; the ring is m3's table, which keeps three related
  guides and three incoming links for every guide (`articles.test.ts:100-113`). None of the three shares this page's
  head photo (`ira-04`): talking late `advik-04`, bilingual `tara-04`, collect words `myra-04` (task 5.20a's rule).
- Heading and hub link are `articlePageCopy.keep` (shared, read-only); its words carry the age band "3 to 7".

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 45 characters; the keyword map's own draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 147 characters; the primary first, the "How was school?" swap and the games |
| One H1 with the primary | Yes | "How to get your child to talk more" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 ("How can you get your child to talk more?") and its 49-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 4 H2 carries "conversation starters"; fold 7 H2 is the map's "Games that get a child talking" |
| Health terms | Yes | "speech" only in the D025 line; no "speech delay", "therapy" or health promise ([§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "get your child to talk more" twice in `<main>` (H1, fold 2 H2): about 1.75% of about 690 words; "Kheelu" once (the D025 line) |
| No product pitch | Yes | No product link, CTA or sticky bar in the body |
| Words never placed | Yes | No under-3 age, no percentage, no competitor, no "lessons", no brain claim for any toy |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar |
| Fold 8 in-text link to a sibling guide | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **No pitch on the talking-and-language guides.** This page discusses language development, so it carries the
   D025 line and no pitch. (a) No product link, no pre-order button, no sticky bar; Kheelu named only in the D025
   line (as drafted); (b) the journal close with the pre-order button and sticky bar, still with no in-text product
   link, because this guide is about habits, not about speech delay; (c) as (b), plus one calm in-text product link.
   **Recommend (a)**: one rule for the whole talking topic (the other talking guides are drafted the same way), and
   a pre-order button under a speech disclaimer reads as selling to a worried parent.
2. **The D025 line on a habits guide.** (a) D025's line verbatim under the answer (as drafted); (b) a line that names
   no product: "This guide is general information, not a diagnosis. If you're worried about your child's speech,
   talk to your paediatrician."; (c) no line here (D025 asks it of articles "specifically about speech delay").
   **Recommend (a)**: the same line, said the same way, on every talking guide, and it tells a parent plainly that a
   toy is not a treatment.
3. **H1 and the hub card.** The hub card stays "How to get your child talking" (approved hub copy). (a) The H1 carries
   the searched words, "How to get your child to talk more" (as drafted); (b) the H1 stays "How to get your child
   talking" and "talk more" lives only in the title, meta and answer H2; (c) as (a), and the hub card title changes to
   match at the next hub edit. **Recommend (a)**: keyword map §5.1 rule 2, and the lead under the H1 is the card's own
   line.
4. **Byline.** The live byline names a person removed from the site at your request. (a) "The Kheelona team"
   (as drafted); (b) a co-founder who reads and owns it. **Recommend (a)**.

## Sources

| Claim | Source |
|---|---|
| Harvard: back-and-forth exchanges between a young child and a caring adult support early language and social skills | [source verification C07](../../research/source-verification.md#c07--serve-and-return); excerpt `C07-harvard-serve-and-return.md:22-28`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| Romeo 2018: 36 children aged 4 to 6; turns and Broca's-area activity during a story; no link with adult words; a link, not cause | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); `C09-romeo-2018-psychological-science.md:23-36, 57-64, 70-72` |
| A turn: an adult speaking and the child replying, or the other way round | `C09-romeo-2018-psychological-science.md:38-41` (Method) |
| Authors' suggestion: "more interactive, back-and-forth conversation" | `C09-romeo-2018-psychological-science.md:74-75` (Discussion) |
| "Pause once or twice to ask what your child thinks will happen next" | [source verification C10](../../research/source-verification.md#c10--questions-during-a-story-ages-3-to-6) house line, used without the study |
| The scene, the questions, go first, wait, follow up, the games, "Every follow-up is one more turn" | House voice: advice, no research claim; LD1 and LD4 drafts in [keyword map §6.8](../../research/keyword-map.md#68-talking-and-language) as input |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45; tasks.md row 5.18 |
| No pitch | Task 5.18 notes (no product pitch on the talking-and-language pages); working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults) |
| Cut lines (the vault, broad questions, joining vs starting, the gap, "the same mechanism … at the center of language growth", the Kheelu close) | No public source read for any of them ([D025](../../decisions/D025-speech-and-language.md), [D026](../../decisions/D026-public-statistics.md)); the close is a pitch |
| Ages 3 to 7 on the page; nothing implying under 3 | [content boundary](../content-boundary.md); [age-band review](../../product/age-band-review.md); `test/e2e/content-integrity.spec.ts:25-49` |
| Card title and summary; first-published date | Stub `src/content/en-IN/stories/articles/how-to-get-your-child-talking.ts`; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking); `src/lib/stories-expansion.ts:92-99` |
| Related list (fold 10) and its titles | [CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md) m3, the ring table (task 7.1d); titles: each guide's card title as the hub prints it (`src/content/en-IN/stories/hub.ts:116-119` reads it from the guide's module; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking) cards 2, 5 and 6) |
| Byline | [facts, team](../../product/facts.md) (the live byline's author was removed from the site, lines 304-308); `TEAM_BYLINE` |
| Photo | DS `03-cast.md:41-42, 115`; file checked by eye 2026-10-13 (and again 2026-10-14: the alt matches the photo); kept, with its alt as the journal's one alt for `ira-04`, under [CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M13 |
| Fold 8 line ("If your child says very little everywhere, …") | Advice, no research claim; the CMO's wording ([CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M5) |

## Changes after approval (task 5.20b)

The CMO passed this page in round 1 ([CMO review, task 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md)).
Task 5.20b applied the review's fixes for it on 2026-10-14 ([tasks](../../engineering/tasks.md), 5.20 item 2).
Every other word of the Copy blocks is as approved. The module follows this page word for word in the same commit
(`talking-articles.test.tsx`); its `updated` stays 2026-10-13.

| Where | What changed | Why |
|---|---|---|
| Fold 8, the line under the H2 | "If it's everywhere, not only after school, read our guide on …" became "If your child says very little everywhere, not only after school, read our guide on …"; the link words and the guide are unchanged, and the link is written as the path the module uses, `/stories/talking-late-or-talking-little` | M5: "it" had no clear referent; the CMO's wording, word for word |
| Fold 1, photo note | No change of photo or alt; a note that this alt is now the journal's one alt for `ira-04` | M13: the collect-words guide, which this page lists, moves off `ira-04`, and the toy-that-talks guide takes it with this alt (both on their own copy pages) |

**What follows from the changes.** The words a reader reads go up by 4 (body about 549 to about 553), so the read
time stays 3 min (`round(words / 200)`) and the byline row does not change. Title (45 characters), meta description
(147), keyword placements and sources do not change; no research statement was added, and there is no placeholder.
Not part of this task: M6, the related ring (this page still offers the data-law guide; the main session and
builder change it).

## Changes after approval (task 7.1d)

[CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md), finding m3, rebalances the journal's related
ring and folds in [CMO 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M6, which named this page:
14 slot changes across 10 guides ([tasks](../../engineering/tasks.md), 7.1d). On this page only fold 10's list
changed.

| Where | What changed | Why |
|---|---|---|
| Fold 10, keep reading | Was: "What India's data law asks of a toy that listens", "Talking late, or talking little?", "How children collect words". Now: "Talking late, or talking little?", "Raising a bilingual child in India", "How children collect words". The heading and the hub link are unchanged | M6 and m3: the only next step after a talking-habits guide sent a parent to the data-law guide (`get-talking` row of review B's table, "M6"); m3's ring row "how-to-get-talking (28)" keeps all three on talking and language. Titles are each guide's card title, as the hub prints them |
| At a glance, "Card, related, dates" row; fold 10's table and note; the Sources table (the related list now has its own row); front matter sources | The new list and its source | To keep the notes true |

**What follows from the change.** Checked against the whole ring after m3: every guide has three related guides and
three incoming links; this page is linked from the late-talker, talking-late and bilingual guides; no guide it links
to, or that links to it, shares its head photo (`ira-04`); fold 1's photo note stands. The keep-reading close sits
outside the body, so the body (about 553 words, 3 min), title (45 characters), meta (147), keyword placements (no
new title carries the primary, "speech" or "Kheelu") and research sources do not change. Still no product link, CTA
or sticky bar; no placeholder. For the builder: `how-to-get-your-child-talking.ts:28` becomes
`related: ["talking-late-or-talking-little", "raising-a-bilingual-child-in-india", "how-children-collect-words"]`, and
the header note's "related list … as the stub held them" (lines 10-11) follows.
