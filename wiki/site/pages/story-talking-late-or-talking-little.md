---
title: "Story: 3-year-old not talking in sentences? What to do (/stories/talking-late-or-talking-little): page copy, task 5.18 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 the other 20 articles kept and refreshed; §5 /stories/* row)
  - ../gate-a-open-items.md (B5 no pitch on the late-talker page, B15 source markers, B45 disclaimer in speech articles)
  - ../pages/stories.md (fold 3 card; the keep-reading close)
  - ../pages/story-talking-toys-and-late-talkers.md (the approved speech model; overlap)
  - ../content-boundary.md
  - ../../engineering/tasks.md (wave 5 part C; row 5.18; the note on the 18 articles without a mockup)
  - ../../research/keyword-map.md (§2.3 LRN-7, §4.2, §4.3 medium overlap, §5.1 rules 1-10, §5.2, §6.8 LD2)
  - ../../research/source-verification.md (§3.6, §3.7 C42, §4: C07, C40, C42; §5; §7)
  - ../../research/source-verification-2026-10-14.md (§2 the sentence item, a 4-year milestone only; §3 the 30-month items against Zubler Table 4)
  - ../../qa/cmo-review-articles-5.18-2026-10-14.md (M1, M2, M3, M4, M13; applied in task 5.20b)
  - "../../raw/research/sources/: C42-cdc-milestones-30-months-and-3-years.md, C42-cdc-milestones-4-years.md, C42-zubler-2022-pediatrics-milestones.md, C42-zubler-2022-table-4-cross-check.md, C42-asha-communication-milestones-2-to-4-years.md, C38-aap-asha-multiple-languages-faq.md, C07-harvard-serve-and-return.md"
  - ../../product/claims.md (§1 speech disclaimer, §4 health wording), ../../product/age-band-review.md (§5), ../../product/facts.md (team, byline)
  - ../../decisions/D016, D025, D026, D041
  - "src/lib/stories-expansion.ts:115-136 (the live article; input only, read in the w5c-5.18 worktree); src/content/en-IN/stories/articles/talking-late-or-talking-little.ts (stub: card, related, dates)"
  - "src/content/types.ts (Article, Answer, ProseBlock), src/layouts/ArticleTemplate/ArticleTemplate.tsx, src/content/en-IN/stories/articles/index.ts (articlePageCopy.keep), src/content/en-IN/stories/articles/talking-toys-and-late-talkers.ts (the approved speech module)"
  - "test/guards/banned-phrases.data.ts; test/e2e/content-integrity.spec.ts:25-60 (age band, under-3 words, percentages)"
  - design-system/project/03-cast.md:29-35,110 (read-only); photo checked by eye 2026-10-13
---

# Story: 3-year-old not talking in sentences? What to do

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review (task 5.18 copy stage) and the
> founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁸` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused
  when a source returns; in the module they are `[^n]`. Every statement about speech or language carries one
  ([D025](../../decisions/D025-speech-and-language.md)). Lines without a marker are plain advice in our own voice
  and make no research claim.
- There is no mockup for this article: visual acceptance is template parity with
  `story-learning-toys-for-a-three-year-old.html` (tasks.md, wave 5 note), and text parity is against this page.
  Links show the real URL only.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/talking-late-or-talking-little` |
| Page job | Answer "my 3-year-old is not talking in sentences: should I worry?" for a parent of a quiet 3 or 4 year old: what varies between children, the signs that deserve a professional look, and what helps at home. **No Kheelu pitch and no pre-order close** (B5, task 5.18 notes); the page ends on keep reading |
| Primary cluster | **3-year-old not talking in sentences** (LRN-7 · 3, 4); secondary "when to see a professional"; no product claims ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (58 characters) | 3-year-old not talking in sentences? What to do · Kheelona |
| Meta description (123 characters) | 3-year-old not talking in sentences? What varies between children, the signs worth a doctor's look, and what helps at home. |
| H1 | 3-year-old not talking in sentences? What to do (question 2) |
| Answer first | Fold 2: question H2 and a 60-word answer (its first sentence answers "sentences"), the D025 line directly under it |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read (question 4) |
| Read time | 3 min: about 648 words of body (answer, disclaimer, parts and headings; about 617 before task 5.20b), `round(words / 200)` as `src/lib/stories.ts:184-186` |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome (nav, drawer) keeps its own button |
| In-text product link | None (B5; question 1). One in-text link to a sibling guide, `/stories/talking-toys-and-late-talkers` (fold 7; CMO review 5.18 M3) |
| Card, related, dates (unchanged from the stub) | Card title "Talking late, or talking little?"; card summary "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home."; related `how-to-get-your-child-talking`, `how-children-collect-words`, `a-toy-that-talks-vs-a-toy-that-listens`; published `2026-07-28`; updated: see the builder notes |
| Template settings | `close: "keep"` (keep-reading close, so `sticky-bar-paths.ts` gives it no bar); `answer.detail` = one `disclaimer` block; topic `talking` (hub.ts), so the crumb reads "Talking and language" |

**What changed from the live article** (`src/lib/stories-expansion.ts:115-136`): the title and H1 now carry the
searched words ("not talking in sentences", keyword map §5.2), and the answer comes first. The unsourced frame
("children spread themselves across a wide normal range, late talkers often catch up completely, and quiet is a
temperament") is cut; what varies is now the CDC's own rule for setting milestones and ASHA's own words about its
chart. The under-3 sign ("very few words by two and a half") becomes the CDC's two-word milestone, framed at 3. "Seems
not to understand simple things you say" is dropped (its CDC page, 18 months, has no excerpt and is under 3;
[source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech) note). "The worst case of
asking early is reassurance", "repetition is how words set" and "children speak more where speaking works" are cut
(no source); their tips stay as plain advice. The closing paragraph about talking toys and "our own product" is
gone (B5: no pitch). New: the two-languages section (C40), one research line (C07) and the D025 line. "Pediatrician"
is now "paediatrician"; the byline names the team (the live byline names a person removed from the site).

**Overlap.** `talking-toys-and-late-talkers` owns "late talker" (what helps); this page owns "3-year-old not
talking in sentences" (should I worry). Both carry a "when to ask" section, as the keyword map expects
([§4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags), SV-4, medium risk). The medical
wording is deliberately the same on both pages, because precision beats variety
([CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M3): four of fold 6's six signs,
"These are US guides …" and "If your gut says ask, ask" repeat the approved page word for word, and the CDC and
ASHA paragraph says the same in nearly the same words. Fold 5 repeats the approved page's myth 1 (the C40 line),
and fold 7's tips are the same seven habits with the same seven icons. Only this page has the two-word sign, the
sentence milestone by 4, the way milestones are set (fold 4) and its own scene. Fold 7 ends with an in-text link to
the late-talker guide, so a parent who wants more on what helps finds the deeper guide.

**Builder notes (module shape).** `head.title` "3-year-old not talking in sentences? {hand:What to do}"; `head.lead`
is the card summary, word for word; `head.author` `TEAM_BYLINE`; `head.readMinutes` 3; `head.image` the photo below.
`answer` = `{ question, answer, detail: [{ kind: "disclaimer", text }] }`. `body`: fold 3 is an untitled part; folds 4
to 7 are titled parts (`p`, `list`, `list` with `variant: "tips"` and the icons named, `p` with `variant: "gut"`).
`sources`: eight entries in marker order (seven before task 5.20b). `meta.og`: `DEFAULT_OG`. **Dates:** the main session's note keeps the stub's
dates; task 5.6 set `updated` to the rewrite's date on its three articles, so the main session rules which applies
here (the stub's `updated` is `2026-07-31`).
**Ruled at the wave 5 part C merge (main session):** `updated` is the rewrite's date, 2026-10-13, as task 5.6 set it; `published` stays the live page's.

---

## Fold 1 · Article head

**Fold job:** say what the page answers, and for which children, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** 3-year-old not talking in sentences? What to do
>
> A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "What to do".
- Breadcrumb: "Stories" → `/stories`; "Talking and language" → `/stories#talking` (template, from hub.ts and topics.ts).
- The lead is the approved hub card summary, word for word ([stories.md fold 3](stories.md#fold-3--talking-and-language-talking)),
  so a parent who tapped the card reads its own line under the new H1.
- Published date from the stub (`2026-07-28`, the live article's); the byline shows only "First published".
- **Image** (`kh-photo --wide`, 16:9): `advik-04-floor-train-web.webp`. Alt: "A boy in a green T-shirt lying on a red
  floor, smiling as he pushes a blue wooden train." (the alt the learning-toys page already uses for this photo).
  Advik is the cast's 4-year-old and "the quiet child who opens up" (`03-cast.md:34`); the photo is a "screen-free
  play" scene with no Kheelu (`03-cast.md:110`). **No Kheelu in any image on this page** (no pitch).
  CMO review M13 (task 5.20b): this page keeps `advik-04` and its one journal alt; the toy-that-talks guide, which
  this page lists, moves off it, so no guide this page links to (or that links here) opens on the same photo.

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer the worry in 40 to 60 words with the milestones and the action, then say once that a toy is
not a treatment.

**Copy:**

> **H2:** Should you worry if your 3-year-old is not talking in sentences?
>
> Sentences of four or more words are on the CDC's list of milestones by 4, not 3.¹ By 3, most children put two or more words together, like "Doggie run", hold a short back-and-forth conversation and are understood by others most of the time.² ³ ⁴ If your child isn't doing these yet, or has lost words, talk to your child's doctor.⁴
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 60 words (markers excluded), at the limit. The first sentence is the ready line of
  [source verification, 2026-10-14 §2](../../research/source-verification-2026-10-14.md#2-a-sentence-milestone-cdc-milestones-by-4-years-c42--supported-as-a-4-year-item-only),
  word for word, with its marker (note 1, the CDC's 4-year page): it answers the H2's own word, "sentences", first,
  and says only that the item sits at 4, never that a 3-year-old should talk in sentences or that most do (§2
  caveat 1). It carries no figure (§2 caveat 2). The full name, US Centers for Disease Control and Prevention, is in
  note 1 and in fold 4.
- "Most" rests on the milestone rule (note 3: set where at least 3 in 4 children reach it); the milestones are the
  CDC's (notes 2 and 4); the action is the CDC's "act early" (note 4).
- "By 3, most children put two or more words together" is the 30-month milestone (note 2; matched against Zubler
  2022 Table 4, note 3, [source verification, 2026-10-14 §3](../../research/source-verification-2026-10-14.md#3-the-cdc-30-month-items-against-zubler-2022-table-4-c42--supported)).
  "By 3" means what "before they turn 3" meant before task 5.20b, a framing §3 calls "on the safe side", and it
  names no age under 3: the page stays about 3 and 4 year olds (content-integrity's under-3 rule;
  [age-band review §5](../../product/age-band-review.md#5-journal-articles-about-children-under-3) row 42: describing
  children is not product suitability). The answer paraphrases the item, so it does not add "with one action word";
  fold 6 quotes the item exactly, with it.
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim, as on the approved
  late-talker page (working default B45), in `kh-body-s` italics directly under the answer. It is the only mention
  of Kheelu on the page. It also makes this a speech answer given "only with" the D025 line (tasks.md row 5.18).

---

## Fold 3 · The scene

**Fold job:** meet the parent where the worry starts, then promise the three things the page gives.

**Copy:**

> At a birthday party, another child is narrating a whole film, and yours points and says "come". Is that fine? Or is it something?
>
> Here is what varies between children, what deserves a professional look, and what helps at home either way.

- An untitled part. House voice, no claim; the scene is the live article's, re-cut for phones. The first paragraph
  is the CMO's wording (M1): "another child" and "yours" say who is who in one read.

---

## Fold 4 · What varies

**Fold job:** calm, sourced: milestones describe most children, and a milestone list is a way to start a
conversation, not a test.

**Copy:**

> **H2:** What varies from child to child?
>
> The milestones from the US Centers for Disease Control and Prevention (CDC) sit at the age by which at least 3 in 4 children reach each one.³ So they describe most children, not every child.
>
> The American Speech-Language-Hearing Association (ASHA) says its own milestone chart "is not a screening or diagnostic tool". It is meant to start a conversation with your child's doctor.⁵
>
> And watch your child at home, where they are most at ease, not only at a party.

- "3 in 4" is the AAP and CDC criterion for the checklists (Zubler 2022, Table 1, "≥75%"), written as a
  fraction so no percentage prints ([D026](../../decisions/D026-public-statistics.md): verified at the original, marked,
  and paired with what a parent can do: the next line and fold 6).
- "So they describe most children, not every child" follows from that rule; it makes no claim of its own.
- The last line is advice only.

---

## Fold 5 · Two languages at home

**Fold job:** answer the Indian parent's most common side-worry with the two professional bodies' own words.

**Copy:**

> **H2:** Two languages at home? Count every word
>
> Asked whether using more than one language can cause a speech or language disorder, the American Academy of Pediatrics and ASHA answer no: "Speech or language problems are not caused by learning multiple languages."⁶
>
> A child learning two languages may split their words across them. Counted together, the total should be about the same as for a child of the same age learning one language.⁶ So count the words in every language your child uses, and keep them all going.

- The verified C40 line ([source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay)),
  as on the approved late-talker page. "Keep them all going" is the C40 house line ("Keep both languages") for homes
  with more than two.
- No *paani* and *water* example: C40 warns not to mix the AAP and ASHA's raw totals with the review's
  count-each-idea-once method.

---

## Fold 6 · When to ask

**Fold job:** the sourced signs for 3 and 4, and the action to take; calm, not alarming.

**Copy:**

> **H2:** When is it worth a professional look?
>
> Talk to your child's doctor if:
>
> - at 3, your child doesn't yet put two or more words together, with one action word, like "Doggie run";²
> - at 3, your child doesn't yet keep up a short conversation with you, of at least two back-and-forth exchanges;⁴
> - at 3, other people still can't understand your child most of the time;⁴
> - by 4, your child doesn't yet say sentences of four or more words;¹
> - by 4, people can't yet understand most of what your child says;⁷
> - at any age, your child loses words or skills they used to have.⁴
>
> These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis.
>
> The CDC suggests you share your concerns with your child's doctor and ask about developmental screening.⁴ ASHA suggests an assessment by an audiologist, who checks hearing, or a speech-language pathologist if a child misses many of the milestones for their age.⁷
>
> If your gut says ask, ask.

- The first sign is the CDC's 30-month milestone in its own words, framed at 3 (a 3-year-old is past it); since
  2026-10-14 it is also matched against Zubler 2022 Table 4 at 30 months
  ([source verification, 2026-10-14 §3](../../research/source-verification-2026-10-14.md#3-the-cdc-30-month-items-against-zubler-2022-table-4-c42--supported)).
  The 3-year signs and "act early" are the CDC's; the sentence sign is the CDC's 4-year milestone; the other age-4
  sign and the assessment route are ASHA's (excerpts in the sources table).
- The sentence sign is the §2 ready line of
  [source verification, 2026-10-14](../../research/source-verification-2026-10-14.md#2-a-sentence-milestone-cdc-milestones-by-4-years-c42--supported-as-a-4-year-item-only),
  word for word (CMO review M2). It is framed "by 4" and never at 3, and it carries no figure: the item has no
  normative data and the experts flagged it for more research (§2 caveats 1 and 2), so it stands as one checklist
  item among the others.
- "Missing one is a reason to ask, not a diagnosis" is the verified C42 house sentence (no marker of its own).
  "Who checks hearing" says what an audiologist is; it makes no claim about the child.
- `list` (bullets); the last line is `p` with `variant: "gut"`, as on the approved late-talker page.
- No product claim anywhere in this fold ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 8).

---

## Fold 7 · What helps at home

**Fold job:** tips a parent can use tonight, framed as ways to have back-and-forth talk, never as treatments.

**Copy:**

> **H2:** What helps at home, either way
>
> Whatever the milestones say, keep the back-and-forth going. Harvard's Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language and social skills.⁸
>
> - Say what you're doing while you do it, in short sentences: "Shoes on. This foot. Now that one."
> - Offer a choice instead of a yes-or-no question: "Idli or dosa?" A choice asks for a word.
> - When your child says a word, say it back with one more: "Bus." "Big bus."
> - After you ask, wait. Count to five in your head before you help.
> - Read the same book again, and stop before a word your child knows.
> - Sing rhymes and leave the last word for your child.
> - Turn off the TV in the background while you talk and play.
>
> None of this needs a purchase. Grandparents, cousins and older children can all take a turn.
>
> For more on what helps a child who talks later or less than others, read [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers).

- The research line is C07's Key Takeaway 3 in the verified wording, keeping "a caring adult"; no brain line, and
  nothing about any toy ([D016](../../decisions/D016-brain-wording.md)).
- The last line is the CMO's wording (M3), word for word: one in-text link, to the approved late-talker guide, whose
  H1 is the link text ([story-talking-toys-and-late-talkers](story-talking-toys-and-late-talkers.md#fold-1--article-head)).
  It is an article link, not a product link (B5), and it makes no claim. Builder: a `p` after the tips, href
  `/stories/talking-toys-and-late-talkers` (the article test's `links` for this guide gains it).
- `list` with `variant: "tips"`; icons from the DS set (`src/assets/icons.generated.ts`), in order: `chat-circle-dots`,
  `question`, `plus`, `clock`, `book-open`, `music-notes`, `eye-slash`.
- Every tip is an example of back-and-forth talk; none claims an outcome ([D025](../../decisions/D025-speech-and-language.md)).
  The TV tip carries no reason, as on the approved late-talker page.

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 4 years, 2026 (reviewed 16 May), Language/Communication. https://www.cdc.gov/act-early/milestones/4-years.html
>
> ² US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 30 months, 2026 (reviewed 16 May), Language/Communication. https://www.cdc.gov/act-early/milestones/30-months.html
>
> ³ Zubler, Wiggins, Macias and colleagues, "Evidence-Informed Milestones for Developmental Surveillance Tools", Pediatrics, 2022, Table 1 and Table 4. https://pmc.ncbi.nlm.nih.gov/articles/PMC9680195/
>
> ⁴ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and "act early". https://www.cdc.gov/act-early/milestones/3-years.html
>
> ⁵ American Speech-Language-Hearing Association, "ASHA's Developmental Milestones: Birth to 5 Years", undated page. https://www.asha.org/public/speech/development/chart/
>
> ⁶ American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx
>
> ⁷ American Speech-Language-Hearing Association, "Communication Milestones: 3 to 4 Years" and "Communication Milestones: 2 to 3 Years", undated pages. https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/
>
> ⁸ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways. https://developingchild.harvard.edu/key-concept/serve-and-return/

- The same list is the BlogPosting `citation` array. Note 1 is new in task 5.20b, the note of the §2 ready lines in
  [source verification, 2026-10-14](../../research/source-verification-2026-10-14.md#2-a-sentence-milestone-cdc-milestones-by-4-years-c42--supported-as-a-4-year-item-only),
  word for word; the old notes 1 to 7 are now 2 to 8, unchanged.
- **Re-read the CDC and ASHA pages before publishing**
  ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)): cdc.gov refuses
  scripted requests (HTTP 403). On 2026-10-14 the 30-month, 3-year and 4-year pages were read twice, live through a
  rendering tool and as the Internet Archive's plain captures of the same 16 May 2026 review, and the two reads agree
  word for word (`C42-cdc-milestones-4-years.md:14-17, 41-60`). The two-word item (note 2) is now cross-checked
  against Zubler 2022 Table 4 at 30 months, like the other CDC items, so notes 2 and 3 both verify it
  ([source verification, 2026-10-14 §3](../../research/source-verification-2026-10-14.md#3-the-cdc-30-month-items-against-zubler-2022-table-4-c42--supported);
  `C42-zubler-2022-table-4-cross-check.md:32, 58-62`). Adding this article to the §7 re-read list for the CDC pages
  is the main session's (CMO review M4).
- Note 3 links the PubMed Central copy the verifier read (DOI 10.1542/peds.2021-052138).

---

## Fold 9 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase (B5).

**Copy:**

> **H2:** Keep reading
>
> - How to get your child talking
> - How children collect words
> - A toy that talks is not a toy that listens
>
> [All guides for parents of 3 to 7 year olds] → `/stories`

| Title (each guide's card title, read by the template) | Real URL |
|---|---|
| How to get your child talking | `/stories/how-to-get-your-child-talking` |
| How children collect words | `/stories/how-children-collect-words` |
| A toy that talks is not a toy that listens | `/stories/a-toy-that-talks-vs-a-toy-that-listens` |

- The related list is the stub's, unchanged. Heading and hub link are `articlePageCopy.keep` (shared, read-only);
  the hub link is a secondary button, never Chilli. Its words carry the age band "3 to 7" on the page.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 58 characters; the keyword map's own draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 123 characters; the primary first, then the three things the page gives |
| One H1 with the primary | Yes | "3-year-old not talking in sentences? What to do" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 (question form) and its 60-word answer, whose first sentence answers "sentences" |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 6 H2 carries the secondary ("a professional look") |
| Single age in headings | Yes | "3-year-old" in the H1 and the fold 2 H2 ([§3](../../research/keyword-map.md#3-clusters-by-age)) |
| Health terms only in a learn article, with public sources, beside the D025 line | Yes | "speech", "speech-language pathologist", "audiologist" appear only in marked sentences or the disclaimer; "speech delay" appears nowhere; "late talker" appears once, as the title of the guide that owns it, in fold 7's link to that guide ([§4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags); [§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "not talking in sentences" twice in `<main>` (H1, fold 2 H2): about 1% of about 870 words; "Kheelu" once (the D025 line) |
| No product pitch | Yes | No product link, CTA or sticky bar in the body; the one in-text link goes to a sibling guide |
| Words never placed | Yes | No toddler or under-3 age, no percentage, no competitor, no brain claim, no "lessons", no tutor or teacher for Kheelu |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar (B5) |
| Fold 7 in-text link to a sibling guide | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **No pitch on the talking-and-language guides.** This page discusses speech, so it carries the D025 line and,
   like the approved late-talker page (B5), no pitch. (a) No product link, no pre-order button, no sticky bar;
   Kheelu named only in the D025 line (as drafted); (b) the same, with the disclaimer reworded to name no product:
   "This guide is general information, not a diagnosis. If you're worried about your child's speech, talk to your
   paediatrician."; (c) the journal close with the pre-order button. **Recommend (a)**: a pre-order button under
   a speech disclaimer reads as selling to a worried parent; the nav keeps the button one tap away.
2. **H1 and title.** (a) "3-year-old not talking in sentences? What to do" (as drafted: the keyword map puts the
   searched words at the start of the title and the H1, and the lead under it is the hub card's own line);
   (b) keep the live and hub title "Talking late, or talking little?" as H1 and title, with the searched words only
   in the answer H2 and the meta; (c) "My 3-year-old is not talking in sentences. Should I worry?" (the parent's own
   words), with the answer H2 reworded; (d) as (a), and the hub card title changes to match at the next hub edit.
   **Recommend (a)**: the live page has the primary nowhere (keyword map §5.3, 0%), and the title is the strongest
   place for it.
3. **A sentence-length milestone. Done in task 5.20b (option (b), CMO review M2).** The CDC's 4-year page was read
   and saved as an excerpt on 2026-10-14 ([source verification, 2026-10-14 §2](../../research/source-verification-2026-10-14.md#2-a-sentence-milestone-cdc-milestones-by-4-years-c42--supported-as-a-4-year-item-only)):
   "Says sentences with four or more words" is a milestone by 4, and the CDC has none at 3. Its ready lines now open
   the answer and add a fold 6 sign, with marker ¹. Nothing to decide unless you would rather not show it (the
   page was complete without it).
4. **Byline.** The live byline names a person removed from the site at your request. (a) "The Kheelona team"
   (as drafted); (b) a co-founder who reads and owns it. **Recommend (a)** for a speech topic, where no one on the
   team is a clinician.

## Sources

| Claim | Source |
|---|---|
| Sentences of four or more words are on the CDC's list of milestones by 4, not 3 (answer); "by 4, your child doesn't yet say sentences of four or more words" (fold 6) | The two §2 ready lines of [source verification, 2026-10-14](../../research/source-verification-2026-10-14.md#2-a-sentence-milestone-cdc-milestones-by-4-years-c42--supported-as-a-4-year-item-only), word for word, with its note (note 1); excerpts `C42-cdc-milestones-4-years.md:21-23` (the 4-year item), `:33-35` (the same page's "act early": talk with your child's doctor) and `:56-60` (no sentence milestone at 3); `C42-zubler-2022-table-4-cross-check.md:36, 64-67` (4 years, weaker evidence) |
| Two or more words together, with one action word, like "Doggie run" (the 30-month milestone; "By 3" in the answer, "at 3, doesn't yet" in fold 6) | Excerpt `C42-cdc-milestones-30-months-and-3-years.md:16-20`, read again in plain text `C42-cdc-milestones-4-years.md:46-50`; matches Zubler 2022 Table 4 at 30 months, `C42-zubler-2022-table-4-cross-check.md:32, 58-62` ([source verification, 2026-10-14 §3](../../research/source-verification-2026-10-14.md#3-the-cdc-30-month-items-against-zubler-2022-table-4-c42--supported)); [source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech) |
| "Most": each milestone sits at the age by which at least 3 in 4 children reach it | `C42-zubler-2022-pediatrics-milestones.md:16-18` (Table 1, "≥75%"), re-found `C42-zubler-2022-table-4-cross-check.md:54`; C42 caveat 2 |
| At 3: a conversation of at least two back-and-forth exchanges; understood by others most of the time | `C42-cdc-milestones-30-months-and-3-years.md:22-26`; Zubler Table 4, `C42-zubler-2022-pediatrics-milestones.md:24` |
| Losing words or skills at any age; share your concerns with your child's doctor and ask about developmental screening | `C42-cdc-milestones-30-months-and-3-years.md:28-34` |
| ASHA's chart "is not a screening or diagnostic tool"; meant to start a conversation with your child's doctor | `C42-asha-communication-milestones-2-to-4-years.md:26-28` |
| By 4, people understand most of what a child says | `C42-asha-communication-milestones-2-to-4-years.md:22-24` |
| ASHA: an assessment by an audiologist or SLP if a child misses many milestones | `C42-asha-communication-milestones-2-to-4-years.md:20` (the 2 to 3 years page) |
| "These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis." | House sentence: [source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech); approved [late-talker page](story-talking-toys-and-late-talkers.md#fold-4--when-to-ask) |
| AAP and ASHA: learning more than one language does not cause speech or language problems; totals across languages | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay); `C38-aap-asha-multiple-languages-faq.md:20-28` |
| Harvard: back-and-forth with a caring adult supports early language and social skills | [source verification C07](../../research/source-verification.md#c07--serve-and-return); `C07-harvard-serve-and-return.md:22-28`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| The scene, the tips, "watch at home", "keep them all going", "If your gut says ask, ask", "None of this needs a purchase" | House voice: advice, no research claim (C40 house line for "keep them all going"); the scene's first paragraph is the CMO's wording ([CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M1) |
| Fold 7's link to "Late talker? What helps a child find their words" | [CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M3 (wording word for word); the guide's H1, [story-talking-toys-and-late-talkers](story-talking-toys-and-late-talkers.md#fold-1--article-head); keyword map [§4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags) (the two pages answer one worry) |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45 |
| No pitch, no pre-order close | Working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults); tasks.md row 5.18 and the task 5.18 notes |
| Ages 3 and 4 in the copy, 3 to 7 on the page; nothing implying under 3 | [content boundary](../content-boundary.md); [age-band review](../../product/age-band-review.md) §5; `test/e2e/content-integrity.spec.ts:25-49` |
| Cut lines (wide normal range, catch up, temperament, reassurance, repetition, the toy caution) | No public source read for any of them ([D025](../../decisions/D025-speech-and-language.md), [D026](../../decisions/D026-public-statistics.md)); the toy paragraph is a pitch (B5) |
| Card title and summary; related list; first-published date | Stub `src/content/en-IN/stories/articles/talking-late-or-talking-little.ts`; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking); `src/lib/stories-expansion.ts:116-123` |
| Byline | [facts, team](../../product/facts.md) (the live byline's author was removed from the site, lines 304-308); `TEAM_BYLINE` |
| Photo | DS `03-cast.md:34, 110`; file checked by eye 2026-10-13; kept under [CMO review 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) M13 |

## Changes after approval (task 5.20b)

The CMO passed this page in round 1 ([CMO review, task 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md)).
Task 5.20b applied the review's fixes for it on 2026-10-14 ([tasks](../../engineering/tasks.md), 5.20 item 2), with
the ready lines of [source verification, 2026-10-14](../../research/source-verification-2026-10-14.md) (D026). Every
other word of the Copy blocks is as approved. The module follows this page word for word in the same commit
(`talking-articles.test.tsx`); its `updated` stays 2026-10-13.

| Where | What changed | Why |
|---|---|---|
| Fold 2, the answer | Now: "Sentences of four or more words are on the CDC's list of milestones by 4, not 3.¹ By 3, most children put two or more words together, like "Doggie run", hold a short back-and-forth conversation and are understood by others most of the time.² ³ ⁴ If your child isn't doing these yet, or has lost words, talk to your child's doctor.⁴" (60 words). Gone: "Use milestones as a reason to ask, not to worry." The two milestone sentences became one, "before they turn 3" became "By 3", and the closing sentence is unchanged | M2: the H1 and H2 ask about sentences and the answer never said the word. The new first sentence is the §2 ready line, word for word, with its note. Keeping the answer at 60 words or fewer (M2) meant cutting the opening line, whose idea fold 6 keeps ("a reason to ask, not a diagnosis") |
| Fold 3, first paragraph | "At every birthday party there is one parent doing sums in their head. That child is narrating a whole film. Mine points and says "come". Is this fine? Or is it something?" became "At a birthday party, another child is narrating a whole film, and yours points and says "come". Is that fine? Or is it something?" | M1: "That child" had no antecedent and "Mine" switched voice; the CMO's wording, word for word |
| Fold 6, the list | New fourth sign: "by 4, your child doesn't yet say sentences of four or more words;¹" | M2: the §2 fold 6 ready line, word for word, framed by 4 and never at 3 (§2 caveat 1), with no figure (§2 caveat 2) |
| Fold 7, end | New last line: "For more on what helps a child who talks later or less than others, read [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers)." | M3 (2): the two pages answer one worry and this one never linked to the deeper guide; the CMO's wording, word for word. An article link, not a product link (B5) |
| Every marker and fold 8 | A new note ¹ (CDC, milestones by 4 years, the §2 note word for word); the old notes ¹ to ⁷ are now ² to ⁸, their text unchanged, and every marker in folds 2 and 4 to 7 moved with them | Markers are numbered in reading order (D026), and the new source is now read first |
| Overlap note (At a glance) | Now says the signs and the other medical lines are deliberately the same wording as the approved late-talker page, and names what only this page has | M3 (1): the old note said the two pages "do not repeat each other line for line"; they do, on purpose |
| Fold 8 notes, sources table | The two-word item is now recorded as cross-checked against Zubler 2022 Table 4 at 30 months; the CDC re-read note gives the 2026-10-14 double read | M4 and §3 caveat 1: the old note ("was not cross-checked against Zubler's table") was out of date. The answer paraphrases the item, so "with one action word" is not added there; fold 6 already quotes it exactly |
| Fold 1, photo note | No change of photo or alt; a note that M13 keeps `advik-04` here | M13: the toy-that-talks guide, which this page lists, moves off `advik-04` (its own copy page) |

**What follows from the changes.** The words a reader reads (head, answer and parts, as the article test counts
them) go up by about 31, from about 648 to about 679 (body about 617 to about 648), so the read time stays 3 min
(`round(words / 200)`) and the byline row does not change. The title (58 characters) and meta description (123) do
not change. Keyword placements: the primary stays in the title, H1 and fold 2 H2; the answer's first sentence now
carries "sentences"; "late talker" appears once, as the linked guide's title (keyword placements table). The only new
research statement is the CDC's sentence item, from the §2 ready lines with their note; nothing else was added as
research. No placeholder. Question 3 for the founder is now done (questions above).

**For the main session (not the founder).** (1) M4's second half: add this article to
[source verification §7](../../research/source-verification.md#7-before-any-line-is-published)'s re-read list for the
CDC pages, and link source verification 2026-10-14 from C42. (2) The builder's article test gains this page's one
in-text link (`/stories/talking-toys-and-late-talkers`) in its `links` list.
