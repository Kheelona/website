---
title: "Story: How to build a 3-year-old's vocabulary (/stories/how-children-collect-words): page copy, task 5.18 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 "the other 20 articles", §5 /stories/* row)
  - ../gate-a-open-items.md (B5, B14, B15, B28, B45)
  - ../pages/stories.md (fold 3 card, the journal and keep closes)
  - ../pages/story-talking-toys-and-late-talkers.md (the approved speech and language model, task 5.6)
  - ../../engineering/tasks.md (Wave 5 part C paragraph, row 5.18, the note on the 18 articles without a mockup)
  - ../../research/keyword-map.md (§2.3 LRN-9, §4.2, §5.1 rules 1-10, §5.2, §6.8 V1)
  - ../../research/source-verification.md (§3.3 C09, §3.6 C40 and C41, §3.7 C42; §4 ready lines C09, C40, C42; §5.1)
  - "../../raw/research/sources/: C38-aap-asha-multiple-languages-faq.md, C40-asha-late-language-emergence.md, C09-romeo-2018-psychological-science.md, C42-cdc-milestones-30-months-and-3-years.md"
  - ../../product/claims.md (§1 speech disclaimer, §4 incl. "grows their vocabulary", §8), ../../product/age-band-review.md
  - ../../decisions/D013, D015, D016, D025, D026, D041
  - "src/lib/stories-expansion.ts:164-186 (the live article; text and facts as input only), read in the task worktree at base aa4b39e"
  - "src/content/en-IN/stories/articles/how-children-collect-words.ts (stub: card, related list, dates); src/content/types.ts (Article shape); src/layouts/ArticleTemplate/ArticleTemplate.tsx"
  - test/guards/banned-phrases.data.ts (checked against every Copy block)
  - design-system/project/03-cast.md:116; 01-writing.md:19-26, 38, 111-113 (read-only)
---

# Story: How to build a 3-year-old's vocabulary

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review, then the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md); tasks.md, Wave 5 part C).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁴` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused
  when a source returns; in the module each is `[^n]`. Every statement about speech or language carries one
  ([D025](../../decisions/D025-speech-and-language.md)). Lines without a marker are plain advice in our own voice
  and make no research claim.
- **No mockup exists for this article.** Text parity is against this page's Copy blocks; visual acceptance is
  template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts (tasks.md, the note
  below the Wave 5 table). Each fold names the template block that renders it (`src/content/types.ts`, `Article`).
- Links show the real path.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/how-children-collect-words` (no mockup) |
| Page job | Answer "how do I build my 3-year-old's vocabulary?" for a parent of a 3 to 7 year old: everyday habits first, the research behind talking together with its real limits, why every home language counts, and when to ask a doctor. **No Kheelu pitch and no pre-order close** (a talking-and-language page: B5 as extended by the task notes; D025); it ends on the keep-reading close |
| Primary cluster | **how to build a 3-year-old's vocabulary** (LRN-9, ages 3 and 4, no volume data); secondary "vocabulary in two languages" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (49 characters) | How to build a 3-year-old's vocabulary · Kheelona |
| Meta description (148 characters) | How to build a 3-year-old's vocabulary at home: everyday habits, what research says about talking together, and why every language you speak counts. |
| H1 | How to build a 3-year-old's vocabulary (question 2) |
| Card (hub, unchanged) | "How children collect words" · "How children pick up words at home, in every language you speak, without a single worksheet." (approved hub copy, [stories.md fold 3](stories.md#fold-3--talking-and-language-talking), word for word) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome keeps its own button |
| In-text product link | None (question 1) |
| Template settings | `close: "keep"` (keep-reading close, no pre-order button; the shell shows no phone buy bar for a keep close); crumb topic `talking`; `og: DEFAULT_OG` |
| Dates | `published: "2026-07-28"`, `updated: "2026-07-31"` as the stub holds them (task notes: dates stay); see the note for the main session at the foot |

**What changed from the live article** (`src/lib/stories-expansion.ts:164-186`): the answer comes first; the
title, H1 and meta now carry the measured question ("how to build a 3-year-old's vocabulary",
[keyword map §5.2](../../research/keyword-map.md#52-per-page)); "Between three and six the collection explodes ...
several a day" is cut (no source found, [source verification C41](../../research/source-verification.md#51-not-supported-4));
"words heard in moments that matter stick better" and "a new word needs a job within a day or two" lose their
unsourced reasons and survive only as plain tips; "let your child overhear real adult conversation, the original
vocabulary app" is cut (the study it leans on found no link between adult words, overheard speech included, and
Broca's-area activity: C09 caveat 3); "the brain does not file languages in separate purses ... a head start on
words in every language" is cut (NOT SUPPORTED, C40 caveat 1) and replaced by the AAP and ASHA count across
languages and ASHA's "strong model" line; "Marathi" becomes the verified line's Telugu or Bangla; a sourced "when
to ask" fold and the D025 line are added; the byline (a person removed from the site at the founder's request)
becomes the Kheelona team; US "memorized" goes with the rewrite.

**Overlap.** `how-to-get-your-child-talking` owns "how to get your child to talk more" (questions and habits for
conversation); this page owns vocabulary. `talking-toys-and-late-talkers` owns "late talker"; fold 7 here only
points to it. `raising-a-bilingual-child-in-india` owns two languages; fold 6 here keeps to counting words and
links there.

---

## Fold 1 · Article head

**Fold job:** say what the page answers, for which age, in the first phone screen.

**Renders as:** `head` (title, lead, author `TEAM_BYLINE`, readMinutes, image); the crumbs come from the template
(`articleTrail`: the hub, then the topic).

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** How to build a 3-year-old's vocabulary
>
> How children pick up words at home, in every language you speak, without a single worksheet.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "vocabulary". Builder: `{nowrap:3-year-old's}` as in the approved modules.
- **Lead:** the hub card's summary, word for word (as the late-talker page does).
- **Dates and read time:** "First published" is the stub's `published` (`2026-07-28`, the live date). Read time
  from the words: about 610 words in the article (head to fold 7), so 3 min (`readingMinutes`: words / 200, rounded).
- **Image** (`kh-photo`, 4:5): `ira-04-paper-crown-web.webp`. Alt: "A laughing girl with a long braid holds a yellow
  paper crown on her head, beside a low table scattered with paper scraps and crayons." (`03-cast.md:116`,
  "confidence and creativity"; no Kheelu in the photo; checked by eye.) No name or age in the alt (the cast is
  illustrative). **No Kheelu in any image on this page** (no pitch).

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer the search in 40 to 60 words, then say once, early, that a toy is not a treatment.

**Renders as:** `answer` { `question`, `answer`, `detail: [{ kind: "disclaimer" }]` }.

**Copy:**

> **H2:** How can you build a 3-year-old's vocabulary?
>
> Talk with your child all through the day, and use real words, not only simple ones. Name what they point at, explain a new word as you use it ("this mango is ripe, so it's soft"), read together, and wait for their answer. And count the words they know in every language you speak at home.¹
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 56 words (marker excluded). The marker is the AAP and ASHA guidance that counts a child's words across
  all their languages (excerpt `C38-aap-asha-multiple-languages-faq.md:25-28`); the rest is plain advice that
  folds 4 and 5 anchor.
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim, the in-article one-liner
  of working default B45, as on the approved late-talker page. It is the only mention of Kheelu on the page.

---

## Fold 3 · The scene

**Renders as:** `part` without a title, two `p`.

**Copy:**

> Chances are nobody sat your child down to teach them "auto", "gravy" or "cousin". The words arrived anyway: from the kitchen, the market, the back seat and the family video call.
>
> Here is what the research says about talk and words, and what you can do at home today.

---

## Fold 4 · What the research says

**Fold job:** the evidence behind "talk with your child", with its real ages and limits.

**Renders as:** `part` titled, three `p`.

**Copy:**

> **H2:** What does the research say about talk and words?
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. Turns also predicted the children's language scores once family income and parents' education were taken into account.²
>
> In the study, a turn was an adult speaking and the child replying, or the other way round. The children were native English speakers, and the study shows a link, not cause and effect.²
>
> Its authors suggest encouraging parents to talk with their children in "more interactive, back-and-forth conversation".² For words, that means saying the new word, then giving your child a reason to use it.

- Paragraph 1 is the verified C09 line ([source verification §4 C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6)),
  verbatim; its "language scores" sentence is kept here because this page is about words. Ages stay "4 to 6",
  never three-year-olds ([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- Paragraph 2: the turn definition (C09 ready line) and the honest limits from the paper itself ("native-English
  speakers", "causation cannot be implied").
- The last sentence is a house line: plain advice, no marker. No Kheelu in this fold
  ([D016](../../decisions/D016-brain-wording.md)).

---

## Fold 5 · Everyday ways to build vocabulary

**Fold job:** habits a parent can use tonight; advice only, no outcome promised.

**Renders as:** `part` titled; `list` (variant `tips`, one icon each, the builder picks from the icons the
approved modules use); `p`; `callout` (lead "Try this:").

**Copy:**

> **H2:** Everyday ways to build your child's vocabulary
>
> - Use your real words: "enormous" and "delicious", not only "big" and "nice".
> - Explain a new word in the same breath: "The dal is boiling. See the bubbles?"
> - Name what your child points at, then wait for them to try the word.
> - Hand a new word back as a question: "It was enormous? How enormous?"
> - Read together, and talk about the pictures as well as the words.
> - Use a new word again over the next few days, somewhere new.
> - At meals, ask your child what they think, and let them finish.
>
> None of this needs flashcards or a worksheet. It needs talk, a pause, and someone who listens to the answer.
>
> **Try this:** pick one new word from your day, like "drizzle" or "crowded", and use it at dinner, at bath time and at bedtime.

- Every tip is a way to have the back-and-forth fold 4 cites; none claims a result ([D025](../../decisions/D025-speech-and-language.md)).
  "Without a single worksheet" in the lead comes back in the closing line on purpose.
- Never "grow(s) your child's vocabulary" (banned row, [claims §4](../../product/claims.md#4-retired-or-banned-wording));
  "build" is the parent's verb and the searched phrase.

---

## Fold 6 · Any language counts

**Fold job:** answer the bilingual parent's worry about vocabulary in two languages, sourced.

**Renders as:** `part` titled, three `p` (one in-text link, not a product link).

**Copy:**

> **H2:** Any language counts
>
> Counting your child's vocabulary? Count every language. A bilingual child may split their words across two languages. Counted together, the total should be about the same as for a child of the same age learning one language.¹ Words collected in Telugu or Bangla count towards that total.¹
>
> A strong model in any language also helps build a foundation for learning others.³ So keep talking in the languages you know best, every day.
>
> For more on two languages at home, read [Raising a bilingual child in India](/stories/raising-a-bilingual-child-in-india).

- The H2 is the keyword map's ([§5.2](../../research/keyword-map.md#52-per-page)). The marked sentences are the
  verified C40 lines ([source verification §4 C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay)):
  the AAP and ASHA count raw totals across languages; ASHA's Practice Portal gives the "strong model" line.
  The review's count-each-idea-once method (C38) is not on this page, so the two methods never meet.
- "Counting your child's vocabulary? Count every language." and "keep talking in the languages you know best"
  are house lines.

---

## Fold 7 · When to ask

**Fold job:** a calm, sourced pointer for the worried parent, then the guide that owns the topic.

**Renders as:** `part` titled, two `p` (one in-text link to an article).

**Copy:**

> **H2:** What if your child seems to have few words?
>
> Every child is different. As a general guide, if your child is 3 or older and other people still can't understand them most of the time, or they lose words they used to have, talk to your paediatrician.⁴
>
> Our guide [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers) has the signs to look for, and what helps at home.

- The signs are the CDC's own milestone at 3 and its "act early" line, as on the approved late-talker page
  ([source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech)). This is a
  speech-delay answer, so it sits on a page with the D025 line (fold 2), as tasks.md row 5.18 requires.
- Nothing under 3 is named: the 30-month "about 50 words" milestone stays off this page (ages 3 to 7 only).

---

## Fold 8 · Sources (article foot)

**Renders as:** `sources[]` (citation, href) through `SourcesSection`; the same list is the BlogPosting
`citation` array.

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx
>
> ² Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract, Method, Results and Discussion. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/
>
> ³ American Speech-Language-Hearing Association, "Late Language Emergence" (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations. https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/
>
> ⁴ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and "act early". https://www.cdc.gov/act-early/milestones/3-years.html

- Re-read the CDC page before publishing (cdc.gov refused plain requests on 2026-10-10; read through a rendering
  tool, excerpt C42-cdc:12).

---

## Fold 9 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase.

**Renders as:** `close: "keep"` → `RelatedGuides` (keep variant): the heading and the hub link are the shared
`articlePageCopy.keep`; the three titles are the related modules' card titles.

**Copy:**

> **H2:** Keep reading
>
> - Talking late, or talking little?
> - A toy that talks is not a toy that listens
> - Late talker? What helps a child find their words
>
> [All guides for parents of 3 to 7 year olds] → `/stories`

| Title | Real URL |
|---|---|
| Talking late, or talking little? | `/stories/talking-late-or-talking-little` |
| A toy that talks is not a toy that listens | `/stories/a-toy-that-talks-vs-a-toy-that-listens` |
| Late talker? What helps a child find their words | `/stories/talking-toys-and-late-talkers` |

- The stub's `related` list, unchanged and in its order. The hub link is the secondary button, never Chilli.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 49 characters; the keyword map's own draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 148 characters; the three things the page gives |
| One H1 with the primary | Yes | "How to build a 3-year-old's vocabulary" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 question H2 and its 56-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 (question form); fold 5 "build your child's vocabulary" |
| Secondary "vocabulary in two languages" | Yes | Fold 6 ("Any language counts", the map's H2) |
| Single age in headings | Yes | "3-year-old" in the H1 and fold 2 H2 ([keyword map §3](../../research/keyword-map.md#3-clusters-by-age)) |
| Health terms only in a learn article, with public sources, beside the D025 line | Yes | "speech" only in the disclaimer; the doctor pointer carries the CDC marker ([§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | The full primary once (H1: 6 words of about 610, 1.0%); "3-year-old's vocabulary" twice (H1, fold 2 H2); "vocabulary" 4 times (0.7%); "Kheelu" once (the disclaimer) |
| Words never placed | Yes | No "grows their vocabulary", no product, no tutor, lessons, adapts, brain-development label, competitor names; no dead age range |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar (keep close) |

## Placeholders

None.

## Questions for the founder (website only)

1. **No pitch on the talking-and-language guides.** These pages discuss language development, so they carry the
   D025 line and, like the approved late-talker page (B5), no product pitch. (a) No product link, no pre-order
   button, no sticky bar; Kheelu named only in the D025 line (as drafted); (b) the same, with the disclaimer
   reworded to name no product ("This guide is general information, not a diagnosis. If you're worried about
   your child's speech, talk to your paediatrician."); (c) the journal close with the pre-order button and one
   in-text product link, as the learning-toys guide has. **Recommend (a)**: it matches the approved late-talker
   page, and a pre-order button under a speech disclaimer reads as selling to a worried parent.
2. **H1 and the hub card.** The hub card stays "How children collect words" (approved hub copy). (a) The H1 carries
   the searched question, "How to build a 3-year-old's vocabulary" (as drafted); (b) the H1 stays "How children
   collect words" and the question lives only in the title, meta and the answer H2; (c) as (a), and the hub card
   title changes to match at the next hub edit. **Recommend (a)**: the keyword map puts the primary in the H1
   (§5.1 rule 2), and the lead under it repeats the card's own line, so a parent who tapped the card lands on its
   words.

## Sources

| Claim | Source |
|---|---|
| Count a child's words across every language; the total about the same as a child learning one; Telugu or Bangla words count | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay) ready line; excerpt `C38-aap-asha-multiple-languages-faq.md:24-28` |
| A strong model in any language helps build a foundation for learning others | `C40-asha-late-language-emergence.md:23-27` (paraphrase, as in the C40 ready line) |
| Romeo 2018: 36 children aged 4 to 6; turns and Broca's area; no link with adult words; turns predicted language scores after income and education; a turn defined; native English speakers; a link, not cause; authors' suggestion | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); excerpt `C09-romeo-2018-psychological-science.md:23-41, 46-52, 57-64, 70-75` |
| At 3, others understand most of the time; losing words; talk with your child's doctor | [source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech); excerpt `C42-cdc-milestones-30-months-and-3-years.md:24-34` |
| "Every child is different" | House line, as on the approved [late-talker page](story-talking-toys-and-late-talkers.md#fold-4--when-to-ask) |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45 |
| No pitch on speech and language pages | Working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults); task notes (5.18, "no product pitch on these pages"); [B14](../gate-a-open-items.md#3-other-website-items-on-working-defaults) |
| Cut lines (vocabulary rate; separate purses; overheard talk) | [source verification §5.1](../../research/source-verification.md#51-not-supported-4) (C41); C40 caveat 1; C09 caveat 3 |
| Ages 3 to 7 only; nothing under 3 | [content boundary](../content-boundary.md); [age-band review](../../product/age-band-review.md) |
| Card title and summary; related list; dates | stub `src/content/en-IN/stories/articles/how-children-collect-words.ts`; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking); `src/lib/stories-expansion.ts:171-172` |
| Photo | DS `03-cast.md:116`; file checked by eye |

**For the main session (not the founder).** (1) `updated`: the task notes keep the stub's dates
(`2026-07-31`), while the approved task 5.6 modules set `updated` to the rewrite's date (BlogPosting
`dateModified`); the builder needs one ruling for all 18. (2) The head photo is chosen from the five DS scene
photos without Kheelu; the parallel copywriter may pick the same one for another article, which is allowed
(each child once per page) but worth a glance at the merge.
