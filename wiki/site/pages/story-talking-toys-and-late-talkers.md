---
title: "Story: Late talker? What helps a child find their words (/stories/talking-toys-and-late-talkers): page copy, Gate A draft"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§4.1 keep for v1, rewrite to 3+; §5 /stories/* row)
  - ../gate-a-open-items.md (B4, B5, B14, B15, B45; §1 D041 rows)
  - ../pages/stories.md (card, related)
  - ../../research/keyword-map.md (§4.2, §4.3 medium overlap, §5.1 rules 8 and 10, §5.2, §6.8 LT5, LD2)
  - ../../research/source-verification.md (§4: C07, C09, C40, C42; §5)
  - "../../raw/research/sources/: C42-cdc-milestones-30-months-and-3-years.md, C42-asha-communication-milestones-2-to-4-years.md, C07-harvard-serve-and-return.md, C09-romeo-2018-psychological-science.md, C38-aap-asha-multiple-languages-faq.md, C40-asha-late-language-emergence.md"
  - ../../product/claims.md (§1 speech disclaimer, §4 health wording), ../../product/age-band-review.md (row 41)
  - ../../decisions/D016, D025, D026, D041, D043
  - "src/lib/stories-expansion.ts:374-398 at tag archive/pre-reset-2026-10-10 (the live article); working tree read 2026-10-11, src/ unmodified per git status"
  - design-system/project/03-cast.md:125; 01-writing.md:19-26,111-113 (read-only)
---

# Story: Late talker? What helps a child find their words

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁶` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)); every statement about speech or
  language carries one ([D025](../../decisions/D025-speech-and-language.md)). Lines without a marker are plain
  advice in our own voice and make no research claim.
- Links show the real URL, then the mockup file in brackets.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/talking-toys-and-late-talkers` (mockup `story-talking-toys-and-late-talkers.html`) |
| Page job | Help a worried parent of a 3 to 7 year old who talks later or less than others: what helps at home, what public guidance says, and when to ask a doctor. **No Kheelu pitch and no pre-order close** (working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults)); the page ends on a gentle link to the hub |
| Primary cluster | **late talker** (LRN-8); secondary "what helps a late talker", "when to ask a professional" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (59 characters) | Late talker? What helps a child find their words · Kheelona |
| Meta description (133 characters) | Late talker at 3 or older? What helps at home, what the research says about back-and-forth talk, and when to ask your child's doctor. |
| H1 | Late talker? What helps a child find their words |
| Byline line | The Kheelona team · First published 30 Jul 2026 · 3 min read (byline: question 2) |
| CTA | None in the page body. No finale CTA, no sticky bar. The site chrome (nav, drawer) keeps its own button |
| In-text product link | None (B5; question 1) |
| Page settings for the mockup | `buybar: false`, `active: "stories"`, `chrome: true` |

**What changed from the live article** (`src/lib/stories-expansion.ts:374-398`): re-aged from "a quiet
two-year-old" to 3 and older ([age-band review](../../product/age-band-review.md) row 41; G5 answered by D041
for the age band); the Kheelu pitch ("adding turns when yours run out") and "Pre-orders are open" are gone (B5);
"speech researchers consistently find" becomes the AAP and ASHA's own words ([source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay));
the unsourced "a late start is usually just that" and "the signal that matters is understanding" are cut;
the milestones now cite the CDC and ASHA pages for age 3 and 4 ([C42](../../research/source-verification.md#c42--when-to-ask-about-speech));
"melody carries words into memory" and "background TV quietly eats the turns" lose their unsourced reasons and
stay as plain tips; the Romeo study keeps its real ages and says it studied typically developing children.

**Overlap.** `talking-late-or-talking-little` owns "3-year-old not talking in sentences" (should I worry). This
page owns "late talker" (what helps). Both carry a "when to ask" section; the optional 301 of this page into
that one stays a later call ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags), SV-4).

---

## Fold 1 · Article head

**Copy:**

> **Breadcrumb:** Stories › Talking and language
>
> **H1:** Late talker? What helps a child find their words
>
> What helps a 3 to 7 year old who talks later or less than others, and when to ask your child's doctor.
>
> The Kheelona team · First published 30 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "find their words".
- Breadcrumb: "Stories" → `/stories`; "Talking and language" → `/stories#talking`.
- Published date `src/lib/stories-expansion.ts:383`; "Updated" added by the build. About 690 words.
- **Image** (`kh-photo --wide`, 16:9): `kabir-04-planet-book-web.webp`. Alt: "A boy in round glasses and a mustard
  T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets."
  (`03-cast.md:125`, "curiosity and reading".) **No Kheelu in any image on this page** (no pitch), and no
  imagination layer.

---

## Fold 2 · The answer first, and the one-line disclaimer

**Fold job:** answer in 40 to 60 words, and say once, early, that a toy is not a treatment.

**Copy:**

> **H2:** What helps a late talker?
>
> Talk with your child, wait, and follow their lead. Name what they look at, add one word to what they say, and give them time to answer before you fill the silence. If your child is 3 or older and other people still can't understand them most of the time, talk to your paediatrician.¹
>
> *Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.*

- Answer: 54 words (marker excluded). The milestone clause carries the CDC marker; the first two sentences are
  advice that fold 5 anchors to its sources.
- The disclaimer is [D025](../../decisions/D025-speech-and-language.md)'s line, verbatim, as the in-article
  one-liner D025 keeps for speech articles (working default B45), in `kh-body-s` italics directly under the
  answer. It is the only mention of Kheelu on the page (question 1 covers the wording).

---

## Fold 3 · The scene

**Copy:**

> Few silences are louder than a 3-year-old who says less than the cousins. The family group chat fills with advice, most of it confident and some of it wrong.
>
> Here is what public guidance says, and what you can do at home today.

---

## Fold 4 · When to ask

**Fold job:** give clear, sourced signs for age 3 and up, and the action to take; calm, not alarming.

**Copy:**

> **H2:** When should you ask a professional?
>
> As a general guide, talk to your child's doctor if:
>
> - at 3, other people still can't understand your child most of the time;¹
> - at 3, your child doesn't yet keep up a short conversation with you, of at least two back-and-forth exchanges;¹
> - by 4, people can't yet understand most of what your child says;²
> - at any age, your child loses words or skills they used to have.¹
>
> These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis.
>
> The US Centers for Disease Control and Prevention suggest you talk with your child's doctor, share your concerns and ask about developmental screening.¹ ASHA, the US association of speech and hearing professionals, suggests an assessment by an audiologist or a speech-language pathologist if a child misses many of the milestones for their age.²
>
> If your gut says ask, ask.

- The live article's under-3 sign ("very few words by two and a half") is dropped: the page is for 3 and up.
  The 3-year signs are the CDC's own milestones; the age-4 sign is ASHA's (excerpts in the sources table).
- "Missing one is a reason to ask, not a diagnosis" is the verified C42 house sentence (no marker of its own).
- No product claim anywhere in this fold ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 8).

---

## Fold 5 · What the research says helps

**Fold job:** the evidence behind "talk and wait", with its real limits.

**Copy:**

> **H2:** What does the research say helps?
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.³
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link.⁴ The children were typically developing, not late talkers, and the study shows a link, not cause and effect.⁴
>
> Its authors suggest encouraging parents to talk with their children in "more interactive, back-and-forth conversation".⁴ A turn can be tiny: your child points, you name the thing, they try the word, you smile and add one more.

- C07 and C09 verified lines; the limits sentence is the excerpt's own ("typically developing", "causation cannot
  be implied", C09:36, 71). The last sentence is a house illustration of a turn as the study defines it.

---

## Fold 6 · What helps at home

**Fold job:** tips a parent can use tonight, framed as ways to have that back-and-forth, not as treatments.

**Copy:**

> **H2:** What helps at home, every day
>
> - Talk about what you're doing, in short sentences: "The dal is boiling. Now the cooker. One whistle, two."
> - After you ask something, wait longer than feels natural. Count to five in your head.
> - Offer choices out loud: "The red cup or the blue cup?" A choice asks for a word.
> - Answer every try as if it were a full sentence, then add one word: "Ball? Yes, a big ball."
> - Read the same book again, and pause before a word your child knows so they can say it.
> - Sing together, and leave gaps for your child to fill.
> - Turn off the TV in the background while you play and talk.
>
> None of this needs a programme or a purchase. It needs turns, and anyone who loves your child can give them: parents, grandparents, cousins, the auntie next door.

- `kh-list` (DS list styles: gap G-11, composed). Every tip is an example of the back-and-forth fold 5 cites; none
  claims an outcome ([D025](../../decisions/D025-speech-and-language.md)).

---

## Fold 7 · Two myths

**Copy:**

> **H2:** Two myths worth dropping
>
> **Myth 1: a second home language causes speech delay.**
> Asked whether using more than one language can cause a speech or language disorder, the American Academy of Pediatrics and the American Speech-Language-Hearing Association answer no: "Speech or language problems are not caused by learning multiple languages."⁵ A bilingual child may split their words across two languages. Counted together, the total should be about the same as for a child of the same age learning one language.⁵ And a strong model in any language helps build a foundation for learning others.⁶ Keep both languages.
>
> **Myth 2: a talking toy will teach your child to talk.**
> A toy that plays recorded phrases or repeats your child's words gives them nothing new to answer. No toy replaces the people who talk with your child every day.

- Myth 1 is the verified C40 line with both its notes; "Keep both languages" is its house line.
- Myth 2 is our own voice and names no product, ours included; it promises nothing for any toy (B5, D025).

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list):

> **Sources**
>
> ¹ US Centers for Disease Control and Prevention, "Learn the Signs. Act Early.": milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and "act early". https://www.cdc.gov/act-early/milestones/3-years.html
>
> ² American Speech-Language-Hearing Association, "Communication Milestones: 3 to 4 Years" and "Communication Milestones: 2 to 3 Years", undated pages. https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/
>
> ³ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ⁴ Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract, Method and Discussion. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/
>
> ⁵ American Academy of Pediatrics and American Speech-Language-Hearing Association, "Young Children Learning Multiple Languages: Parent FAQs", HealthyChildren.org, 2025 (updated 20 November). https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx
>
> ⁶ American Speech-Language-Hearing Association, "Late Language Emergence" (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations. https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/

- Re-read the CDC and ASHA pages before publishing (the CDC page refused plain requests on 2026-10-10 and was
  read through a rendering tool, excerpt C42-cdc:12).

---

## Fold 9 · Close: keep reading (no CTA)

**Fold job:** end with a calm next step that is not a purchase (B5).

**Copy:**

> **H2:** Keep reading
>
> - Talking late, or talking little?
> - How to get your child talking
> - Raising a bilingual child in India
>
> [All guides for parents of 3 to 7 year olds] → `/stories` (`stories.html`)

| Title | Real URL | Mockup link |
|---|---|---|
| Talking late, or talking little? | `/stories/talking-late-or-talking-little` | `stories.html#talking` |
| How to get your child talking | `/stories/how-to-get-your-child-talking` | `stories.html#talking` |
| Raising a bilingual child in India | `/stories/raising-a-bilingual-child-in-india` | `stories.html#talking` |

- The hub link is a secondary button (`kh-btn--secondary`), never Chilli. No sticky bar (`buybar: false`).

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 59 characters ([§5.2](../../research/keyword-map.md#52-per-page) draft, "two-year-old" dropped from the meta) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 133 characters; the age (3 or older) and the three things the page gives |
| One H1 with the primary | Yes | As live |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What helps a late talker?" and its 54-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 |
| Health terms placed only in a learn article, with public sources, beside the D025 one-liner | Yes | "speech", "speech-language pathologist" appear only with markers; no "speech delay" keyword targeting beyond the myth heading, which states the myth to refute it ([§5.1](../../research/keyword-map.md#5-placement-rules) rules 8, 10) |
| Alt text | Yes | Describes the scene |
| Density | Yes | "late talker" 3 times in `<main>` (H1, fold 2 H2, fold 5) of about 690 words (under 1%); "Kheelu" once (the disclaimer) |
| No product pitch | Yes | No product link, CTA or sticky bar in the body |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing (site chrome, unchanged) |
| Page body | none | none | No finale CTA, no sticky bar (B5) |

## Placeholders

None.

## Questions for the founder (website only)

1. **How far "no pitch" goes (B5).** (a) No product link, no CTA, no sticky bar, and Kheelu named only in the
   D025 disclaimer (as drafted); (b) the same, with the disclaimer reworded to name no product: "This guide is
   general information, not a diagnosis. If you're worried about your child's speech, talk to your
   paediatrician."; (c) allow the one in-text product link every other guide has. **Recommend (a)**: on a site
   that sells a talking toy, saying plainly that it is not a treatment protects the parent and the company;
   (c) would read as selling to a worried parent.
2. **Byline.** The live byline names a person removed from the site at your request. (a) "The Kheelona team"
   (as drafted); (b) a co-founder who reads and owns it. **Recommend (a)** for a speech topic, where no one on
   the team is a clinician.

## Sources

| Claim | Source |
|---|---|
| At 3: talks well enough for others to understand most of the time; conversation of at least two back-and-forth exchanges | Excerpt `C42-cdc-milestones-30-months-and-3-years.md:24-26`; [source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech) |
| Losing skills at any age; "talk with your child's doctor, share your concerns, and ask about developmental screening" | `C42-cdc-milestones-30-months-and-3-years.md:30-34` |
| By 4, people understand most of what a child says | `C42-asha-communication-milestones-2-to-4-years.md:22-24` |
| ASHA: assessment by an audiologist or SLP if a child does not meet many milestones | `C42-asha-communication-milestones-2-to-4-years.md:20` (the 2 to 3 years page) |
| "Missing one is a reason to ask, not a diagnosis" | [source verification C42](../../research/source-verification.md#c42--when-to-ask-about-speech) house sentence; CDC "act early" (`C42-cdc:30-32`) |
| Harvard serve-and-return line, with "a caring adult" | [source verification C07](../../research/source-verification.md#c07--serve-and-return); `C07-harvard-serve-and-return.md:23-28, 37-43` |
| Romeo 2018: 36 children aged 4 to 6; turns and Broca's area; no link with adult words; typically developing; a link, not cause; authors' suggestion | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); `C09-romeo-2018-psychological-science.md:24-36, 58-64, 71-75` |
| Learning more than one language does not cause speech or language problems; totals across languages | [source verification C40](../../research/source-verification.md#c40--a-second-language-does-not-cause-delay); `C38-aap-asha-multiple-languages-faq.md:20-28` |
| A strong model in any language helps build a foundation for others | `C40-asha-late-language-emergence.md:23-27` (paraphrase, as in the C40 ready line) |
| Disclaimer line | [D025](../../decisions/D025-speech-and-language.md) (draft wording; one line inside speech articles); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); working default B45 |
| No pitch, no pre-order close | Working default [B5](../gate-a-open-items.md#3-other-website-items-on-working-defaults); [age-band review](../../product/age-band-review.md) row 41; [strategy §4.1](../strategy.md#41-keep-merge-drop-gate-a-g8-with-g5) |
| Ages 3 and up | [facts, age](../../product/facts.md#age); [D041](../../decisions/D041-gate-a-round-1.md) |
| Health wording rules | [claims §4](../../product/claims.md#4-retired-or-banned-wording) (no health claim for Kheelu); [D025](../../decisions/D025-speech-and-language.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) |
| Published date 30 Jul 2026 | `src/lib/stories-expansion.ts:383` |
| Photo | DS `03-cast.md:125`; file checked by eye 2026-10-11 |
