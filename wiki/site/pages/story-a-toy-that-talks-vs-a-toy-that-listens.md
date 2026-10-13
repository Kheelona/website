---
title: "Story: Toys for language development: talk or listen? (/stories/a-toy-that-talks-vs-a-toy-that-listens): page copy, task 5.18 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 "the other 20 articles", §5 /stories/* row)
  - ../gate-a-open-items.md (B3, B5, B14, B15, B28, B45)
  - ../pages/stories.md (fold 3 card, the keep close)
  - ../pages/story-talking-toys-and-late-talkers.md (the approved speech and language model, task 5.6)
  - ../pages/story-learning-toys-for-a-three-year-old.md (fold 4: the same C07 and C09 lines)
  - ../pages/story-how-to-get-your-child-talking.md (fold 1: the alt for ira-04)
  - ../pages/story-what-to-look-for-in-a-safe-ai-toy.md (owns Common Sense Media and Fairplay, with the B3 answer)
  - ../../engineering/tasks.md (Wave 5 part C paragraph, row 5.18, the note on the 18 articles without a mockup)
  - ../../research/keyword-map.md (§2.2 CMP-4, CMP-7, §4.2, §4.3, §5.1 rules 1-10, §5.2, §6.8 TT1)
  - ../../research/source-verification.md (§3.2 C33, §3.3 C07 and C09, §3.5 C16; §4 ready lines C07, C09, C33; §5.3)
  - "../../raw/research/sources/: C07-harvard-serve-and-return.md, C09-romeo-2018-psychological-science.md, C33-aap-2016-media-and-young-minds.md"
  - ../../product/claims.md (§1 speech disclaimer, §4, §8 incl. the Xu guard), ../../product/age-band-review.md (row 39, §4)
  - ../../brand/messaging.md (words to stop using: competitor names, "smart speaker")
  - ../../decisions/D013, D015, D016, D025, D026, D027, D041
  - "src/lib/stories-expansion.ts:306-340 (the live article; text and facts as input only), read in the task worktree at base aa4b39e"
  - "src/content/en-IN/stories/articles/a-toy-that-talks-vs-a-toy-that-listens.ts (stub: card, related list, dates); src/content/types.ts (Article shape); src/layouts/ArticleTemplate/ArticleTemplate.tsx"
  - test/guards/banned-phrases.data.ts (checked against every Copy block)
  - design-system/project/03-cast.md:37-43, 115; 01-writing.md:19-26, 111-113 (read-only)
  - ../../qa/cmo-review-articles-5.18-2026-10-14.md (M12, M13: applied in task 5.20b, see the foot of this page)
---

# Story: Toys for language development: talk or listen?

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review, then the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md); tasks.md, Wave 5 part C).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `³` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused
  when a source returns; in the module each is `[^n]`. Every statement about speech or language carries one
  ([D025](../../decisions/D025-speech-and-language.md)). Lines without a marker are plain advice or plain
  description in our own voice and make no research claim.
- **No mockup exists for this article.** Text parity is against this page's Copy blocks; visual acceptance is
  template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts (tasks.md, the note
  below the Wave 5 table). Each fold names the template block that renders it (`src/content/types.ts`, `Article`).
- Links show the real path.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/a-toy-that-talks-vs-a-toy-that-listens` (no mockup) |
| Page job | Answer "are talking toys good for my child's language?" for a parent of a 3 to 7 year old: what research credits (people, not toys), how the kinds of talking toy differ, and a checklist for any of them. **No Kheelu pitch and no pre-order close** (a talking-and-language page: B5 as extended by the task notes; D025); AI toys are routed to the safe-AI-toy guide; the page ends on the keep-reading close |
| Primary cluster | **toys for language development** (BUY-9, no volume data); secondaries "are talking toys good for speech", "smart speaker for a child" (CMP-7) ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (57 characters) | Toys for language development: talk or listen? · Kheelona |
| Meta description (150 characters) | Toys for language development: why a toy that repeats is a mirror, what research says about back-and-forth talk, and how screens and speakers compare. |
| H1 | Toys for language development: talk or listen? (question 2) |
| Card (hub, unchanged) | "A toy that talks is not a toy that listens" · "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare." (approved hub copy, [stories.md fold 3](stories.md#fold-3--talking-and-language-talking), word for word) |
| Byline line | The Kheelona team · First published 30 Jul 2026 · 3 min read (byline: question 3) |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome keeps its own button |
| In-text product link | None (question 1). One in-text link to another guide (fold 6) |
| Template settings | `close: "keep"` (keep-reading close, no pre-order button; no phone buy bar); crumb topic `talking`; `og: DEFAULT_OG` |
| Dates | `published` 2026-07-30 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |

**What changed from the live article** (`src/lib/stories-expansion.ts:306-340`): the title, H1 and meta now
carry the keyword map's primary ("toys for language development", [§5.2](../../research/keyword-map.md#52-per-page)),
which the live page never used (density 0.0, §5.3); the answer now credits what the research credits, a caring
adult, and promises nothing for any toy; "it is the return that builds vocabulary, logic and confidence" is cut
(C07 caveat 6); the Romeo study's "words they overheard" becomes "adult words" (C09 caveat 3); "migrate to the
bottom of the basket by month two", "hilarious, for about a week" and "safe, simple, offline and cheap" are cut (no
source; "safe" alone is banned); the AAP's "about an hour a day" is dropped, and only its watch-together line kept
(C33 caveat 1: a ceiling, not a target); the smart-speaker claims ("reach the open internet, answer anything, not
filtered") become a check the parent makes; the Common Sense Media paragraph (and its "advised against ... any child
of five or under") leaves this page for the safe-AI-toy guide, which quotes it in full with the signed answer (B3),
and the link label "the five checks for a safe AI toy" goes (that guide dropped its five checks); the Kheelu
section, the languages line, "Open conversation runs on your home WiFi" and "pre-orders are open ... a refundable
₹499" are cut (no pitch); the checklist's "for a child under five" becomes "any talking toy" (age-band review row
39), and "until recently that did not exist at toy prices" is cut; the byline (Aman Soni) becomes the Kheelona
team (question 3).

**Overlap.** `/products/kheelu` owns "toys that talk back" and "talking toy vs toy that talks back" (BUY-4, CMP-4):
this page says "listens", never "talks back". `screen-free-does-not-mean-silent` owns story boxes (CMP-5); this page
leaves them out. `what-to-look-for-in-a-safe-ai-toy` owns AI-toy safety; fold 6 links to it.

---

## Fold 1 · Article head

**Fold job:** say what the page answers in the first phone screen.

**Renders as:** `head` (title, lead, author `TEAM_BYLINE`, readMinutes, image); crumbs from the template.

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** Toys for language development: talk or listen?
>
> Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare.
>
> The Kheelona team · First published 30 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "talk or listen?".
- **Lead:** the hub card's summary, word for word.
- **Dates and read time:** "First published" is the stub's `published` (`2026-07-30`, the live date). Read time
  from the words: about 650 words in the article (head to fold 7; head, answer and parts, as the article test counts
  them, 648 after task 5.20b), so 3 min (`readingMinutes`: words / 200, rounded).
- **Image** (`kh-photo`, 4:5): `ira-04-paper-crown-web.webp`. Alt: "A laughing girl with a long braid holds a yellow
  paper crown on her head, beside a low table scattered with crayons and paper scraps." (`03-cast.md:115`,
  "confidence and creativity"; Ira is the cast's storyteller, `03-cast.md:37-43`; no Kheelu in the photo; checked by
  eye 2026-10-14.) The alt is the journal's one alt for this photo, word for word as on
  [how-to-get-your-child-talking](story-how-to-get-your-child-talking.md#fold-1--article-head) (CMO review M13).
  A child making her own play out of paper and crayons: nothing in the frame talks or listens but her. The photo is
  portrait, so the head takes the portrait layout, as on the learning-toys guide. No name or age in the alt.
  **No Kheelu in any image on this page** (no pitch).

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer the search in 40 to 60 words, honestly, then say once, early, that a toy is not a treatment.

**Renders as:** `answer` { `question`, `answer`, `detail: [{ kind: "disclaimer" }]` }.

**Copy:**

> **H2:** Are talking toys good for a young child's language?
>
> Not on their own: a toy can't do the talking for you. Harvard's Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language skills.¹ A toy that plays recordings or repeats your child's words can't take a real turn. Choose toys that give you both something to talk about.
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 58 words (marker excluded). It opens with a direct answer to the H2, "Not on their own", because answer
  engines quote the first sentence (CMO review M12). The marked sentence is the C07 line, trimmed (Key Takeaways 1
  and 3); the rest is house advice. "Not on their own" is a house line with no marker: it promises nothing for any
  toy, and the C07 line after it credits a caring adult. The answer changes the keyword map's TT1 draft, whose "A
  talking toy can add to your conversations" and "Only if they wait for your child to talk" promise something for a
  toy that no source here tested.
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim (working default B45), as on
  the approved late-talker page. It is the only mention of Kheelu on the page.

---

## Fold 3 · The scene

**Renders as:** `part` without a title, two `p`.

**Copy:**

> Walk down a toy aisle and the talking toys line up: phones with phrase buttons, dolls with a handful of sentences, plush toys that sing when squeezed, a cactus that repeats whatever your child says.
>
> They all talk. Listening is a different thing.

- Generic kinds of toy, no brand ([messaging, words to stop using](../../brand/messaging.md#words-to-stop-using)).

---

## Fold 4 · Talking versus listening

**Fold job:** define the two words the card title turns on, in plain description.

**Renders as:** `part` titled, two `p`.

**Copy:**

> **H2:** A toy that talks is not a toy that listens
>
> A toy that talks plays sounds at your child: a recorded phrase, a song, or your child's own words played back. A toy that listens has to understand what your child said, and answer it.
>
> A toy that repeats is a mirror. It can be funny, but it can't answer a question, and it never asks one of its own. A toy with a handful of sentences has nothing new to say once your child has heard them all.

- The hub card's title becomes this H2, so a parent who tapped the card finds its words on the page.
- Description by definition, no claim about any toy's effect on language.

---

## Fold 5 · What the research credits

**Fold job:** the evidence on language, with the limit that matters here: it is about people.

**Renders as:** `part` titled, three `p`.

**Copy:**

> **H2:** What helps language development?
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.²
>
> Both are about adults talking with children; neither tested a toy.¹ ² So ask one thing of any toy: will it get your child talking, and give the two of you more to talk about?

- The verified C07 and C09 lines, as on the approved learning-toys page (fold 4). Ages stay "4 to 6"
  ([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- "Neither tested a toy" is what both excerpts record (C07: nothing about toys or devices; C09: "Nothing in the study
  measures a toy or a device"), so it carries both markers. The question after it is a house line.
- No Kheelu in this fold, and no toy as the subject of a brain line ([D016](../../decisions/D016-brain-wording.md)).
- Not used: the Xu smart-speaker studies (C10, C11). They are about a speaker asking questions during a story, and
  claims §8 keeps Xu off pages that mention Kheelu next to stories (the D027 guard); their age range also trips the
  dead-age-range guard as written.

---

## Fold 6 · The kinds compared

**Fold job:** walk through what a parent will meet, kind by kind, with one sourced line and checks instead of
claims.

**Renders as:** `part` titled; four `h3`, each followed by one `p` (the last with an in-text link to a guide).

**Copy:**

> **H2:** Screens, speakers and talking toys: how do they compare?
>
> **Videos and cartoons**
>
> A video plays on whether your child answers or not. The American Academy of Pediatrics asks parents to watch with their children and help them understand what they are seeing.³ The talking about it is the part that's yours.
>
> **Smart speakers**
>
> A smart speaker answers questions, which a button toy can't. Before your child talks to one alone, check its settings: what it can search, what it can play, and what it keeps of your child's voice.
>
> **Talking toys that repeat or play phrases**
>
> They can't answer a question they've never heard, so a conversation stops after one line. Keep them for the giggle, and do the talking yourself.
>
> **Toys that use AI to answer**
>
> Some newer toys use AI to understand your child and reply. They raise questions a button toy never did: when the microphone is on, where your child's voice goes, and whether you can read every conversation. Before one comes home, read [What to look for in a safe AI toy](/stories/what-to-look-for-in-a-safe-ai-toy).

- The H2 follows the card summary's order ("screens, speakers and talking toys"). The four kinds are `h3`s.
- Videos: the C33 line as the approved learning-toys page uses it (fold 10), without the bedtime clause.
- Smart speakers: the generic category, never a brand ([messaging](../../brand/messaging.md#words-to-stop-using));
  the live page's claims about what they reach and filter had no source, so the copy asks the parent to check.
- AI toys: no Common Sense Media or Fairplay figures here. The safe-AI-toy guide quotes both in full, with the
  founder's signed answer (B3); quoting them here without that answer would be half of it (question 1). The three
  questions are the ones that guide puts to any maker. Nothing on this page describes Kheelu.

---

## Fold 7 · A checklist for any talking toy

**Fold job:** something to take to the shop; checks only, no claims.

**Renders as:** `part` titled; `list` (variant `checks`); `p`; `callout` (lead "Try this:").

**Copy:**

> **H2:** A short checklist for any talking toy
>
> - Does it reply, or only repeat?
> - Does it ask your child something back, and wait for the answer?
> - Does it speak the language you speak at home?
> - Can you see afterwards what it said?
> - Does it work without a screen?
> - Does it leave room for you to join in?
>
> Whatever you choose, no toy replaces the people who talk with your child every day.
>
> **Try this:** when a toy talks, pause it and ask your child what it should say next.

- The live H2, kept. "For a child under five" is gone (age-band review row 39); the live "can it answer something
  it has never heard before ... until recently that did not exist at toy prices" is cut (a market claim with no
  source). The closing line is the approved late-talker page's house line (its myth 2).

---

## Fold 8 · Sources (article foot)

**Renders as:** `sources[]` (citation, href) through `SourcesSection`; the same list is the BlogPosting
`citation` array.

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ² Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract, Results and Discussion. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/
>
> ³ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591

- Re-read the Harvard page before publishing (it shows recent edits; [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 9 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase.

**Renders as:** `close: "keep"` → `RelatedGuides` (keep variant): heading and hub link from
`articlePageCopy.keep`; titles are the related modules' card titles.

**Copy:**

> **H2:** Keep reading
>
> - How children collect words
> - Late talker? What helps a child find their words
> - Raising a bilingual child in India
>
> [All guides for parents of 3 to 7 year olds] → `/stories`

| Title | Real URL |
|---|---|
| How children collect words | `/stories/how-children-collect-words` |
| Late talker? What helps a child find their words | `/stories/talking-toys-and-late-talkers` |
| Raising a bilingual child in India | `/stories/raising-a-bilingual-child-in-india` |

- The stub's `related` list, unchanged and in its order. The first title is the words guide's card title (the hub
  copy), not its new H1.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 57 characters; the keyword map's own draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 150 characters; the three things the page gives |
| One H1 with the primary | Yes | "Toys for language development: talk or listen?" |
| Primary in an answer-first block in the first ~100 words | Yes | H1, then the fold 2 question H2 ("a young child's language") and its 58-word answer |
| An H2 with the primary or a close variant | Yes | Fold 5 "What helps language development?" |
| Secondaries | Yes | "are talking toys good for speech": fold 2 H2 (as "language"; "speech" stays in the disclaimer only); "smart speaker for a child": fold 6 `h3` |
| Not competing with `/products/kheelu` | Yes | "talks back" appears nowhere ([§4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags)) |
| Health terms only beside the D025 line, with public sources | Yes | ([§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "toys for language development" once (H1: 4 words of about 650, 0.6%); "language development" twice (H1, fold 5 H2); "Kheelu" once (the disclaimer) |
| Words never placed | Yes | No product, no competitor or brand names (generic "smart speaker"), no wake-word line, no "safe" about any toy, no tutor, lessons, adapts; no dead age range |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar (keep close) |

## Placeholders

None.

## Questions for the founder (website only)

1. **No pitch, and AI toys on this page.** The keyword map files this page under buying intent (BUY-9), and the
   live version ended with a Kheelu section and the pre-order line. It is also a language page, so it carries the
   D025 line. (a) No product link, no pre-order button, no sticky bar; Kheelu named only in the D025 line; AI toys
   routed to the safe-AI-toy guide, where Common Sense Media is quoted in full with your signed answer (as drafted);
   (b) as (a), plus one calm factual line on Kheelu with the one in-text product link and the journal close; that
   line would then need the Common Sense Media answer (B3) on this page too; (c) as (b), without the B3 answer.
   **Recommend (a)**: a pitch under a speech disclaimer reads as selling to a worried parent, and (c) would cite a
   toy against the advice without saying so. The guide one tap away carries the product and the answer.
2. **H1 and the hub card.** The hub card stays "A toy that talks is not a toy that listens" (approved hub copy).
   (a) The H1 carries the searched phrase, "Toys for language development: talk or listen?", and the card's title
   is fold 4's H2 (as drafted); (b) the H1 stays the card's title and the phrase lives only in the title, meta and
   fold 5's H2; (c) as (a), and the hub card title changes to match at the next hub edit. **Recommend (a)**: the
   keyword map puts the primary in the H1 (§5.1 rule 2), and the live page never carried it.
3. **Byline.** The live article is by Aman Soni. (a) "The Kheelona team" (as drafted); (b) Aman Soni, after he
   reads it. **Recommend (a)** for a language topic, as on the late-talker page: no one on the team is a
   clinician, and a co-founder's name on a no-pitch guide adds little.

## Sources

| Claim | Source |
|---|---|
| "Not on their own: a toy can't do the talking for you." (the answer's opening) | House line, no marker ([CMO review M12](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes)); it makes no claim for any toy, and the C07 line that follows credits a caring adult |
| Harvard serve-and-return line, with "a caring adult"; support for early language skills (answer, trimmed) | [source verification C07](../../research/source-verification.md#c07--serve-and-return); excerpt `C07-harvard-serve-and-return.md:22-28, 36-43` |
| Romeo 2018: 36 children aged 4 to 6; turns and Broca's area; no link with adult words; a link, not cause | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); excerpt `C09-romeo-2018-psychological-science.md:23-36, 57-64, 70-72` |
| Neither source tested a toy | `C07-harvard-serve-and-return.md:45-54`; `C09-romeo-2018-psychological-science.md:77-81` |
| AAP: watch together, help them understand what they are seeing | [source verification C33](../../research/source-verification.md#c33--the-american-academy-of-pediatrics); excerpt `C33-aap-2016-media-and-young-minds.md:58-64` |
| The three questions for an AI toy | [safe-AI-toy guide, fold 4](story-what-to-look-for-in-a-safe-ai-toy.md#fold-4--what-to-look-for-warning-by-warning) (house questions, no claim) |
| "No toy replaces the people who talk with your child every day" | House line from the approved [late-talker page](story-talking-toys-and-late-talkers.md#fold-7--two-myths) |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45 |
| No pitch on speech and language pages; Common Sense Media cited in full where cited | Working defaults [B5, B3](../gate-a-open-items.md#3-other-website-items-on-working-defaults); task notes (5.18); [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) |
| Cut lines | [source verification](../../research/source-verification.md) C07 caveat 6, C09 caveat 3, C33 caveat 1; [age-band review](../../product/age-band-review.md) row 39; [claims §4](../../product/claims.md#4-retired-or-banned-wording) ("safe" alone) |
| Card title and summary; related list; dates | stub `src/content/en-IN/stories/articles/a-toy-that-talks-vs-a-toy-that-listens.ts`; [stories.md fold 3](stories.md#fold-3--talking-and-language-talking); `src/lib/stories-expansion.ts:313-314` |
| Photo and alt | DS `03-cast.md:37-43, 115`; alt as on [how-to-get-your-child-talking](story-how-to-get-your-child-talking.md#fold-1--article-head), word for word; file checked by eye 2026-10-14; [CMO review M13](../../qa/cmo-review-articles-5.18-2026-10-14.md#minor-fixes) |

**For the main session (not the founder).** (1) `updated`: the same ruling as the other 17 (stub date or rewrite
date). (2) The head photo is `ira-04` since task 5.20b (CMO review M13). Among the six talking guides it also heads
`how-to-get-your-child-talking`, which this page does not link to and which does not link here. Every guide linked
from here, or linking here, has a different head photo (`advik-04`, `myra-04`, `kabir-04`, `tara-04`, and
`tara-02` on the safe-AI-toy guide). Outside the talking topic, `what-actually-builds-a-sharp-brain` (task 5.19)
also uses `ira-04`, with a different alt; one alt per photo across the journal means it should take this one
(raised with the main session in task 5.20b).

## Changes after approval (task 5.20b)

The CMO passed this page in round 1 ([CMO review, task 5.18](../../qa/cmo-review-articles-5.18-2026-10-14.md)).
Task 5.20b applied the review's fixes for it on 2026-10-14 ([tasks](../../engineering/tasks.md), 5.20 item 2).
Every other word of the Copy blocks is as approved. The module follows this page word for word in the same commit
(`talking-articles.test.tsx`).

| Where | What changed | Why |
|---|---|---|
| Fold 2, the answer's first sentence | "A toy can't do the talking for you." became "Not on their own: a toy can't do the talking for you." The answer goes from 54 to 58 words (markers excluded) | M12: the H2 asks a yes-or-no question, and answer engines quote the first sentence; now that sentence answers it. A house line with no marker, and it makes no claim for any toy |
| Fold 1, head photo and alt | `advik-04-floor-train-web.webp` (16:9) became `ira-04-paper-crown-web.webp` (4:5), with the alt `how-to-get-your-child-talking` gives that photo. The head moves from the wide layout to the portrait one | M13: `advik-04` also headed `talking-late-or-talking-little`, which links here, so a parent tapping "Keep reading" landed on the same picture. `ira-04` has no Kheelu (`03-cast.md:115`) |

**What follows from the changes.** The words a reader reads (head, answer and parts, as the article test counts
them) go from about 644 to 648, so the read time stays 3 min (`round(words / 200)`) and the byline row does not
change. The fold 1 read-time note and the density row now use that count (about 650) in place of the draft's
estimate of about 660. In the keyword placements, the answer is now 58 words (still 40 to 60); nothing else moves. No research
statement, marker or source was added, and there is no placeholder. For the builder: the head photo changes shape,
so its `assets.md` row follows the photo (tasks.md 5.20 item 3). Not part of this task: M14 (the module already uses
the CMO's callout icon, and the article test holds it).
