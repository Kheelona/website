---
title: "Story: Learning toys for a 3-year-old (/stories/learning-toys-for-a-three-year-old): page copy, Gate A draft"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3, §4.1 merge of the 2-year-old article, §5 /stories/* row, §7)
  - ../gate-a-open-items.md (B15, B28; §1 D041 rows "Age 3", "Children")
  - ../pages/home.md (CTA block, sticky bar, help line, alt patterns)
  - ../pages/stories.md (journal close block, card)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§4.2, §4.3, §5.1, §5.2, §6.6 LT1, BD2, LT3)
  - ../../research/source-verification.md (§4: C01, C02, C06, C07, C09, C10, C31, C32, C33; §5)
  - "../../raw/research/sources/: C02-nep-2020-para-4-1.md, C03-nep-2020-para-1-2.md, C07-harvard-serve-and-return.md, C09-romeo-2018-psychological-science.md, C31-who-2019-guidelines-under-5.md, C32-iap-2022-screen-time-digital-wellness.md, C33-aap-2016-media-and-young-minds.md"
  - ../../product/claims.md (§1, §3, §4, §8), ../../product/facts.md, ../../product/age-band-review.md (rows 40, 45)
  - ../../decisions/D016, D017, D026, D028, D036, D041, D043
  - "src/lib/stories-expansion.ts:442-474 at tag archive/pre-reset-2026-10-10 (the live article) and :400-424 (the merged 2-year-old article); working tree read 2026-10-11, src/ unmodified per git status"
  - design-system/project/03-cast.md:105,110; 01-writing.md:19-26,111-113 (read-only)
---

# Story: Learning toys for a 3-year-old, skill by skill

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁷` are source markers under [D026](../../decisions/D026-public-statistics.md) and
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults): each links to its note in the
  "Sources" list at the foot of the article; numbered in reading order, reused when a source returns.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL, then the mockup file in brackets.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/learning-toys-for-a-three-year-old` (mockup `story-learning-toys-for-a-three-year-old.html`) |
| Page job | Win the measured "learning toys for a 3-year-old" search with a useful, sourced guide; receive the 301 from the dropped 2-year-old article; route to the product page once, calmly ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **learning toys for a 3-year-old** (BUY-1, Keyword Planner 1k-10k, 2026-09-11); secondaries "educational toys for 3 year olds", **"brain development toys for a 3-year-old"** (gained from the merge) ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22), [§4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags)) |
| Title (57 characters) | Learning toys for a 3-year-old, skill by skill · Kheelona |
| Meta description (148 characters) | Learning toys for a 3-year-old, skill by skill: language, turn-taking, pretend play, hands and numbers, plus what the WHO and IAP say about screens. |
| H1 | Learning toys for a 3-year-old, skill by skill |
| Byline line | The Kheelona team · First published 11 Sep 2026 · 4 min read (byline: question 1) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 12 ("Kheelu" → `/products/kheelu`, `meet-kheelu.html`) |
| Page settings for the mockup | `buybar: true`, `active: "stories"`, `chrome: true` |

**What changed from the live article** (`src/lib/stories-expansion.ts:442-474`): the unsourced "vocabulary
roughly doubles" line is cut ([source verification C41](../../research/source-verification.md#51-not-supported-4));
the Romeo study is no longer "researchers at MIT" on three-year-olds but a study of 4 to 6 year olds
([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors); age-band review row 45);
unsourced development claims ("the foundation of both empathy and narrative", "the ₹200 option is as good as
the ₹2,000 one") are cut or turned into plain advice; the answer comes first; the merged 2-year-old article's
topic becomes an H2 about the label, and the page says plainly that Kheelu is not for children under 3. The
author byline (a person removed from the site at the founder's request) is replaced.

---

## Fold 1 · Article head

**Fold job:** say what the page answers and for which age, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › Learning and play
>
> **H1:** Learning toys for a 3-year-old, skill by skill
>
> What a 3-year-old is working on, and which kinds of toys serve each part of it, without the word "educational" doing all the work.
>
> The Kheelona team · First published 11 Sep 2026 · 4 min read

- **H1 accent:** `Hand` on "skill by skill".
- Breadcrumb links: "Stories" → `/stories` (`stories.html`); "Learning and play" → `/stories#learning`
  (`stories.html#learning`). Composed from DS parts (gap G-11).
- **Dates:** "First published" is the live `published` value (`src/lib/stories-expansion.ts:449`). The build adds
  "Updated {date}" when this rewrite goes live (`updated`, a substantive edit, `src/lib/stories.ts:18-22`); the
  mockup shows no updated date rather than invent one.
- **Read time:** derived from the words at build (`src/lib/stories.ts:184-186`); about 800 words here.
- **Image** (after the dek, `kh-photo`, 4:5): `myra-04-drawing-at-home-web.webp`. Alt: "A little girl in a red
  polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table." The DS photo
  for "screen-free play, creativity, parenting posts without selling" (`03-cast.md:105`); the cast's oldest
  3-year-old matches the page's age. No name or age in the alt (the cast is illustrative).

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, then frame the rest of the page.

**Copy:**

> **H2:** What are the best learning toys for a 3-year-old?
>
> Toys that get your child building, pretending and talking: blocks, simple puzzles, pretend-play sets, crayons and dough, and picture books you read together. Research links back-and-forth talk between a young child and a caring adult to early language and brain development,¹ so the best toys are often the ones you play with together, out loud.
>
> The word "educational" on a box says little about the toy inside. A shape sorter is educational. So is a tablet full of phonics videos. They are not the same purchase.
>
> A better question: what is my 3-year-old working on right now, and does this toy help or get in the way? Here is that list, skill by skill.

- Answer block: 55 words (markers excluded). It feeds the Article page's main entity; not a FAQ block.
- The research clause credits conversation with a caring adult, never a toy ([D016](../../decisions/D016-brain-wording.md));
  its marker is Harvard (note 1).

---

## Fold 3 · What a 3-year-old is working on

**Fold job:** anchor "skill by skill" in a public Indian source, without claiming any toy meets it.

**Copy:**

> **H2:** What is a 3-year-old working on?
>
> India's National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage: three years of Anganwadi or pre-school, then Grades 1 and 2.²
>
> For these early years, it describes learning that is "play-based, activity-based, and inquiry-based", covering languages, numbers and counting, colours and shapes, puzzles, drawing, craft, drama and puppetry, music and movement.³
>
> It is written for Anganwadis and pre-schools, not for toy shops. Here is what those kinds of play look like at home, skill by skill.

- The policy line is C02's verified wording; the list is NEP para 1.2 itself, trimmed (excerpt C03:18-21).
- Never "NEP recommends" a toy, never "aligned with NEP", and never the 85% figure here
  ([source verification C01-C03](../../research/source-verification.md#c01--nep-2020-the-first-six-years)).

---

## Fold 4 · Language

**Fold job:** the big skill: explain what helps language, with the study's real ages, then give the test.

**Copy:**

> **H2:** Language: does the toy make a turn?
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca's area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.⁴
>
> So the test for a language toy is simple: does it make a turn? A picture book you read together makes plenty. A puppet makes as many as you have patience for. A toy that plays a recorded sentence at the press of a button can't answer back, however many words the sentence has.
>
> **Try this:** when you read together, pause once or twice and ask what your child thinks will happen next.

- Both research paragraphs are the verified C07 and C09 lines (C09 trimmed of its scores sentence, which
  makes it stricter, not looser). Ages stay "4 to 6", never three-year-olds ([claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- No Kheelu in this fold: no brain line shares a sentence or a paragraph with the product ([D016](../../decisions/D016-brain-wording.md)).
- "Try this" is the C10 house line used without the study (Xu is never paired with stories on a page that
  mentions Kheelu, [D027](../../decisions/D027-story-mode-wording.md) guard).

---

## Fold 5 · Taking turns

**Fold job:** one plain idea a parent can act on tonight.

**Copy:**

> **H2:** Taking turns: games with a "your go, my go" rhythm
>
> Look for games where your child has to wait, watch and then go: simple board games with two rules, picture matching, rolling a ball back and forth. Play them together and say the turns out loud: "My go. Now yours."

- Advice only, no developmental claim (the live "they are skills, and they are practised" had no source).

---

## Fold 6 · Pretend play

**Copy:**

> **H2:** Pretend play: props that leave the story to your child
>
> A cardboard kitchen, a doctor set, a box of mismatched figures. Open props let your child decide who is cooking and what is wrong with teddy. A toy kitchen that plays its own sounds and names its own characters decides some of that for them.

- **Image** after this fold (`kh-photo --wide`, 16:9): `advik-04-floor-train-web.webp`. Alt: "A boy in a green
  T-shirt lying on a red floor, smiling as he pushes a blue wooden train." (`03-cast.md:110`, "screen-free play").

---

## Fold 7 · Hands

**Copy:**

> **H2:** Hands: plain things do the job
>
> Threading beads, stacking cups, dough, chunky crayons, tongs and a bowl of pom-poms. None of them needs a battery or a screen.

---

## Fold 8 · Numbers

**Copy:**

> **H2:** Numbers: count real things together
>
> Count spoons at dinner, steps to the door, autos at the signal. Ask, "Which pile has more?" Any toy with parts you can count will do.

---

## Fold 9 · The brain-development label (merged topic)

**Fold job:** own "brain development toys for a 3-year-old" honestly: the phrase as a topic, conversation as
the mechanism, and a clear line for anyone shopping for a younger child.

**Copy:**

> **H2:** Brain development toys for a 3-year-old: what the label means
>
> The words "brain development" on a box prove nothing on their own. What matters is whether a toy gets your child trying, asking and explaining, and whether you talk together while they play.
>
> Harvard's centre describes the same back-and-forth from infancy: exchanges between a young child and a caring adult that help build and strengthen the connections in the child's brain.¹ So for a younger child the rule is the same: fewer toys that perform, more time playing and talking together.

- "Brain development" is used as a searched TOPIC in the heading, never as what a toy or Kheelu does
  ([D016](../../decisions/D016-brain-wording.md); [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- "From infancy" rests on Harvard's own example ("When an infant or young child babbles, gestures, or cries,
  and an adult responds", excerpt C07:37-43). The paragraph names no product, so it implies nothing about
  Kheelu and children under 3; fold 12 states that Kheelu is not for them.
- This H2 is what visitors from the 301'd URL `/stories/brain-development-toys-for-a-2-year-old` land on in
  intent ([strategy §4.1](../strategy.md#41-keep-merge-drop-gate-a-g8-with-g5)).

---

## Fold 10 · Screens

**Fold job:** give the published screen guidance for age 3, sourced, with one thing to do.

**Copy:**

> **H2:** What about screens?
>
> For three and four year olds, the World Health Organization and the Indian Academy of Pediatrics both say no more than an hour of screen time a day, and less is better.⁵ ⁶
>
> The American Academy of Pediatrics asks parents to watch with their children, help them understand what they are seeing, and switch screens off an hour before bedtime.⁷
>
> When your child does watch, sit with them and talk about it.

- C06's verified second half (the WHO's "less is better" and the IAP's one hour for 24 to 59 months) and C33's
  verified line. The Indian meta-analysis figure (C06 first half) is left out: one idea per fold.
- The WHO grades its own evidence "very low quality" (excerpt C31:44), so nothing here calls the evidence strong.

---

## Fold 11 · A short rule

**Copy:**

> **H2:** A short rule for the toy shop
>
> - Check the age on the box.
> - Prefer toys that wait for your child over toys that perform at them.
> - Prefer open ends over scripts.
> - Prefer anything that makes a turn.

---

## Fold 12 · Where Kheelu fits (the one in-text product link)

**Fold job:** one calm, honest sentence about the product, with its age limits, then a route to the buyer's guide.

**Copy:**

> [Kheelu](https://kheelona.com/products/kheelu) is built around that last rule: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play.
>
> Choosing any AI toy? Our guide to [AI toys for kids in India](https://kheelona.com/ai-toys-for-kids-in-india) sets out what to check first.

- Link targets: `/products/kheelu` → `meet-kheelu.html` (the page's one in-text product link,
  [strategy §3.3](../strategy.md#33-placement-and-repetition)); `/ai-toys-for-kids-in-india` → `ai-toys-for-kids-in-india.html`.
- "Built around" is the approved form ([voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning);
  C07 company line). It sits three folds away from any brain line.
- The age lines: "not a toy for children under 3" (entity fact, [keyword map §7.1](../../research/keyword-map.md#7-geo-plan);
  TT3) and "with a grown-up nearby" at 3 ([D041](../../decisions/D041-gate-a-round-1.md), age answers).

---

## Fold 13 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ² Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 4, para 4.1, p. 11. https://ncert.nic.in/pdf/nep/NEP_2020.pdf
>
> ³ Ministry of Human Resource Development (now Ministry of Education), Government of India, "National Education Policy 2020", 2020, chapter 1, para 1.2, p. 7. https://ncert.nic.in/pdf/nep/NEP_2020.pdf
>
> ⁴ Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, "Beyond the 30-Million-Word Gap: Children's Conversational Exposure Is Associated With Language-Related Brain Function", Psychological Science, 2018, Abstract and Results. https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/
>
> ⁵ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
>
> ⁶ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
>
> ⁷ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591

- Marker pattern: as composed in the Home mockup (DS gap G-18, working default B15): a short linked marker
  with a 44 px tap area, notes in `kh-body-s`.
- The same list becomes the BlogPosting `citation` array (one source of truth, `src/lib/stories.ts:40-44`).

---

## Fold 14 · Related guides

**Copy:**

> **H2:** Related guides
>
> - What actually builds a sharp brain in the early years
> - A toy that talks is not a toy that listens
> - How much screen time is okay for a young child?

| Title | Real URL | Mockup link |
|---|---|---|
| What actually builds a sharp brain in the early years | `/stories/what-actually-builds-a-sharp-brain` | `stories.html#learning` (not rewritten yet) |
| A toy that talks is not a toy that listens | `/stories/a-toy-that-talks-vs-a-toy-that-listens` | `stories.html#talking` (not rewritten yet) |
| How much screen time is okay for a young child? | `/stories/how-much-screen-time-for-a-3-to-6-year-old` | `stories.html#screen-time` (not rewritten yet) |

Text links only (no photos), so the page keeps two DS children.

---

## Fold 15 · Close (journal close block)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block)):

> **H2:** A toy that asks back.
>
> Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.
>
> **[Pre-order Kheelu]** → `https://store.kheelona.com` (`store.html`), same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu` (`meet-kheelu.html`)

- `cta` = `finale`. Trust items link to `/shipping` and `/refund`. Full mode as on Home.
- Optional product image `kheelu-front.webp`, alt "Kheelu by Kheelona: the cream plush rabbit with rainbow ears
  and a speaker in its tummy."

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; appears after the head, steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 57 characters |
| Meta ≤ 155: primary plus a concrete fact | Yes | 148 characters; the five skills and the WHO/IAP guidance |
| One H1 with the primary | Yes | "Learning toys for a 3-year-old, skill by skill" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 (question form) and its 54-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 9 H2 carries the merged secondary "brain development toys for a 3-year-old" (strategy §4.1) |
| Single age in headings (parents type single ages) | Yes | "3-year-old" in H1 and two H2s ([keyword map §3](../../research/keyword-map.md#3-clusters-by-age)) |
| Alt text names the toy where true | Yes | Hero alt names the crayon; the train alt names the train |
| Density | Yes | "learning toys for a 3-year-old" twice in `<main>` (H1, fold 2 H2): about 1.3% of about 800 words, counting its 5 words; "Kheelu" 3 times including the close and its button (0.4%) |
| Words never placed | Yes | No "brain-development toy" as Kheelu's label, no promise that Kheelu develops the brain, no tutor, lessons, adapts, friend, health terms or competitor names |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |
| In-text link to the product page | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline for this guide.** The live byline names a person removed from the site at your request.
   (a) "The Kheelona team" (as drafted); (b) one of the three co-founders, who reads and owns it.
   **Recommend (a)** for the mockup; (b) if a co-founder wants their name on it (a named author helps search
   engines judge who stands behind advice).

## Sources

| Claim | Source |
|---|---|
| Harvard serve-and-return line, verbatim, with "a caring adult" (folds 2, 4, 9) | [source verification C07](../../research/source-verification.md#c07--serve-and-return) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C07-harvard-serve-and-return.md:23-28, 37-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| "Research links back-and-forth talk ... to early language and brain development" | Same source (Key Takeaways 1 and 3); [keyword map §6.6](../../research/keyword-map.md#66-learning-toys-and-brain-development) LT1, LT3 drafts |
| "From infancy" | `C07-harvard-serve-and-return.md:37-43` ("When an infant or young child babbles ...") |
| Romeo 2018: 36 children aged 4 to 6; turns, Broca's area; no link with adult words; a link, not cause and effect | [source verification C09](../../research/source-verification.md#c09--turns-not-just-words-ages-4-to-6); excerpt `C09-romeo-2018-psychological-science.md:24-36, 58-64, 71-72`; ages rule [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| NEP 2020 Foundational Stage, ages 3 to 8 | [source verification C02](../../research/source-verification.md#c02--the-foundational-stage); excerpt `C02-nep-2020-para-4-1.md:25-33` |
| NEP 2020 "play-based, activity-based, and inquiry-based" and its list | [source verification C01](../../research/source-verification.md#c01--nep-2020-the-first-six-years) (note ²); excerpt `C03-nep-2020-para-1-2.md:18-21` |
| WHO and IAP: no more than an hour a day at 3 and 4, less is better | [source verification C06](../../research/source-verification.md#c06--screen-time-in-india) (second half), C31, C32; excerpts `C31-who-2019-guidelines-under-5.md:39-43`, `C32-iap-2022-screen-time-digital-wellness.md:44-46` |
| AAP: watch together, help them understand, screens off an hour before bed | [source verification C33](../../research/source-verification.md#c33--the-american-academy-of-pediatrics); excerpt `C33-aap-2016-media-and-young-minds.md:61-68` |
| "Pause and ask what happens next" (house line) | [source verification C10](../../research/source-verification.md#c10--questions-during-a-story-ages-3-to-6) house line (used without the study) |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| "Built around" | [voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning); C07 company line |
| Not a toy for children under 3 | [facts, age](../../product/facts.md#age) (band 3 to 7, brief §2); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan); [content boundary](../content-boundary.md) (never imply under 3) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Cut lines (vocabulary doubling; "researchers at MIT") | [source verification §5.1, §5.3](../../research/source-verification.md#5-do-not-use) (C41 NOT-SUPPORTED; C09 misattribution); [age-band review](../../product/age-band-review.md) row 45 |
| Merge of the 2-year-old article; H2 "brain development toys for a 3-year-old" | [D041](../../decisions/D041-gate-a-round-1.md); [strategy §4.1](../strategy.md#41-keep-merge-drop-gate-a-g8-with-g5); [keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags), [§5.2](../../research/keyword-map.md#52-per-page) |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Published date 11 Sep 2026 | `src/lib/stories-expansion.ts:449` |
| Photos | DS `03-cast.md:105, 110`; files checked by eye 2026-10-11 |
