---
title: "Story: Screen time and tantrums: what is actually happening (/stories/screen-time-and-tantrums): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link; §5 /stories/* row)
  - ../pages/stories.md (fold 2 card, line 119; fold 6 journal close)
  - ../pages/story-learning-toys-for-a-three-year-old.md (format, close, sticky bar, age lines)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../url-map.md (§1b, line 117)
  - ../../research/keyword-map.md (§4.2 row LRN-4, line 240; §5.1; §5.2 line 355; §5.3 line 410; §6.7 ST3, lines 632-633)
  - ../../research/source-verification.md (§3.2 C35, line 122; §4 C35 ready line, lines 435-447; §7)
  - "../../raw/research/sources/: C35-hiniker-2016-screen-time-tantrums.md, C35-gavrilova-veraksa-2024-screen-time-tantrums.md"
  - ../../product/claims.md (§1, §4), ../../product/facts.md, ../../product/age-band-review.md
  - ../../brand/messaging.md ("Added for 3 to 7": no "toddler"), ../../brand/voice.md, ../content-boundary.md
  - ../../decisions/D016, D025, D026, D041
  - "test/guards/banned-phrases.data.ts (us-ize: no quoted 'recognize'); test/e2e/content-integrity.spec.ts:34 (UNDER_THREE: 'toddlers')"
  - "src/lib/stories-expansion.ts:43-66 (the live article; legacy file, input only), read in the w5c-5.17 worktree 2026-10-14"
  - "src/content/en-IN/stories/articles/screen-time-and-tantrums.ts (stub: card, related, dates); src/content/types.ts:356-469 and src/layouts/ArticleTemplate/ArticleTemplate.tsx (the blocks the template renders)"
  - design-system/project/03-cast.md:13, 53-58, 92, 124 (kabir-03, task 5.20a fix pass; was :115, ira-04, and in the first 5.20a draft :117, tara-01); 01-writing.md:19-26 (read-only)
  - "Task 5.20a fixes: ../../qa/cmo-review-articles-5.17-2026-10-14.md (M7, M8, M9, M10, M16; 'How the checks were run'); ../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md (N1, N2: the head photo and its alt); ../../engineering/tasks.md (5.20, the head-photo pools); ../../engineering/assets.md (photo uses)"
---

# Story: Screen time and tantrums: what is actually happening

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` and `²` are source markers under [D026](../../decisions/D026-public-statistics.md) and
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults). Lines without a marker are plain
  advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template, and
  each fold names the block it uses.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/screen-time-and-tantrums` (no mockup; template parity with `story-learning-toys-for-a-three-year-old.html`) |
| Page job | Help a parent whose child melts down when the screen goes off: say it is common and studied, what one study found makes it easier or harder, and what to do tonight; route to the product page once, calmly |
| Primary cluster | **screen time tantrums** (LRN-4, ages 3 to 5; no volume data); secondary "tantrum when the phone is taken away" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (60 characters) | Screen time tantrums: why they happen, what helps · Kheelona |
| Meta description (142 characters) | Screen time tantrums: one study found a two-minute warning made children more upset. What helps instead, and how to make switching off boring. |
| H1 | Screen time and tantrums: what is actually happening (as live; the hub card title) |
| Card (hub, unchanged) | Title "Screen time and tantrums: what is actually happening"; summary "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive." ([stories.md](stories.md) fold 2, line 119; the stub) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 2 min read (byline: question 1) |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 6 ("Kheelu" → `/products/kheelu`) (question 2) |
| Template settings | `close: "journal"` |

**What changed from the live article** (`src/lib/stories-expansion.ts:43-66`; it had no sources list): "The
tantrum after the screen is so common it has its own research literature" becomes the verified C35 line
([source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch), caveat 1:
"only a few studies"); "it is most houses some evenings" is cut (caveat 2); the unsourced mechanism ("Fast,
bright, always-rewarding video sets a pace no living room can match", "a small brain being asked to change gears
at highway speed", "Each yes resets the peak, and the fall gets steeper") is cut, and the "why" is told in our
own voice, as an observation, not a finding; "Announce the landing before takeoff" stays as agreeing the plan
before the screen goes on, never a countdown (caveat 5: two-minute warnings made children more upset); "Children
leave screens easily for things that want them back" and "Calm holds attention longer than parents expect"
(no source) are cut; "our little talking friend" becomes the confirmed product line. The keyword map's ST3
draft ("warn before the screen goes off", "giving in teaches that protest works") is not used: the first runs
against the study, the second has no source.

---

## Fold 1 · Article head

**Fold job:** name the moment every parent knows, in the first phone screen. Renders as `ArticleHead`.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** Screen time and tantrums: what is actually happening
>
> Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.
>
> The Kheelona team · First published 28 Jul 2026 · 2 min read

- **H1 accent:** `Hand` on "what is actually happening".
- **Lead:** the hub card's summary, word for word.
- Breadcrumb: "Stories" → `/stories`; "Screen time" → `/stories#screen-time`.
- **Read time:** about 490 words in `<main>` before the sources and close (about 470 before task 5.20a); still
  2 minutes.
- **Image** (after the lead, `kh-photo`, 4:5): `kabir-03-homework-desk-web.webp`. Alt: "A boy in round glasses and
  a white school shirt grins, one finger at his nose, as he writes in an exercise book at a wooden desk by a window,
  Kheelu sitting at the far end of the desk." DS: "School readiness" (`03-cast.md:124`); Kabir is 6
  (`03-cast.md:13`), not the 3-year-old cast, so no grown-up is needed in frame (tasks.md 5.20). The master is
  9:16, so the head shows it in the DS 4:5 frame as a centred crop that keeps the boy's face, the book and Kheelu,
  as the `tara-03` head on the hard-questions guide does (assets.md). An ordinary moment after the screen goes off,
  which is the page's own advice, with Kheelu at the far end of the desk as one more thing in the room; nothing in
  the photo or the alt says the toy calms a child or ends a tantrum. Task 5.20a fix pass (CMO N1, N2): from the
  5.20a pool, the alt the CMO's word for word; it heads no other guide (assets.md), so no guide this one links to,
  or that links here, shares it. File checked by eye 2026-10-14 and again at the fix pass. No name or age in the
  alt; Kheelu's light is not described (D018).

---

## Fold 2 · The answer first

**Fold job:** what to do, in 40 to 60 words, then a hook to the counter-intuitive finding. Renders as
`AnswerSection`.

**Copy:**

> **H2:** What helps with screen time tantrums?
>
> Make switching off part of a routine. Agree the limit before the screen goes on, stop at a natural break such as the end of an episode, and have something ready for your child's hands the moment it goes dark. If tears come anyway, stay calm, stay close and keep to what you said.
>
> One common tip is missing on purpose: the two-minute warning. More on that below.

- Answer block: 54 words. Advice in our voice; fold 5 anchors "routine" and "a natural break" to the study's
  release (note ²). No countdown tip anywhere (C35 ready-line note).

---

## Fold 3 · The scene

**Fold job:** say "this is normal" before any research. Renders as an untitled `ArticlePart`.

**Copy:**

> The video ends. You say that's enough for today. And a child who sat quietly for half an hour is suddenly on the floor in tears.
>
> If this is your house some evenings, you are not alone.

- The second line is the house half of C35's ready line.

---

## Fold 4 · Why at the off switch

**Fold job:** the card's "why", honestly: what the research shows, then our own observation, marked as ours
by having no marker.

**Copy:**

> **H2:** Why the meltdown comes at the off switch
>
> Screen time tantrums are common enough that researchers have studied them: a 2016 University of Washington study of families with children aged 1 to 5 found that "transitioning away from screens is often painful".¹
>
> Think about what the off switch asks of a young child: to stop something they enjoy, right now, at a moment they did not choose. That is hard at any age.
>
> It does not happen every evening, though. The study's senior author said that most of the time these transitions "actually go pretty smoothly", even if parents find that hard to see.² It is the hard evenings that stay with you.

- The H2 is the keyword map's (§5.2). Paragraph 1 is C35's verified line, with the study's ages as the study
  had them (every study line states its ages); "screen time tantrums" for "meltdowns at the off switch" is the
  paper's own term.
- The senior author's words are from the university's release (C35:44-46). Its "which can be hard for parents to
  recognize" is paraphrased, not quoted: the quote's US spelling would trip the en-IN guard (`us-ize`).
- The release's diary percentages are not used (C35 caveat 3: from the release, not the paper; and D026).

---

## Fold 5 · What makes it easier

**Copy:**

> **H2:** What makes taking the phone away easier?
>
> How the screen ends makes a difference. In the same study, routines and stopping at a natural break made the switch easier.²
>
> One well-meant habit made it harder: children given a two-minute warning by their parents were more upset when the screen went away.² That is one study, so watch your own child. If the countdown sets off the storm, drop it.

- The H2 carries the secondary ("tantrum when the phone is taken away").
- C35's ready line, split in two. "Routines and stopping at a natural break" rests on the verification's
  reading of the release (C35 caveat 6 and ready line); the saved excerpt holds the two-minute sentence
  (C35:48-49) but not this one, so the release is re-read before publishing (notes below).
- Task 5.20a: the CMO re-read the release at source and confirmed this line ("Some things did make that switch
  easier, like having routines, disengaging at a natural stopping point …";
  [CMO review 5.17](../../qa/cmo-review-articles-5.17-2026-10-14.md), "How the checks were run"). Filing that
  passage as a new excerpt in `raw/research/sources/` is still open (M9, the verifier's); the line is unchanged.

---

## Fold 6 · Making switching off boring (the one in-text product link)

**Fold job:** the card's "how": habits for tonight; then one calm product line with its age limits; then the
screen-time guide. Renders as an `ArticlePart`: `p`, `list` (variant `tips`), two `p`.

**Copy:**

> **H2:** How to make switching off boring
>
> Boring is the goal: an ending so routine that there is nothing to fight about.
>
> - Agree the plan out loud before the screen goes on: "One episode, then we water the plants."
> - Stop at the end of an episode or a song, never halfway through.
> - Turn off autoplay, so the next episode does not start on its own.
> - Keep the same order every day, so the ending is no surprise.
> - Have something ready for their hands the moment the screen goes dark: dough, crayons, a job in the kitchen.
> - If tears come, stay close, stay calm and keep to what you said.
>
> Looking for something to hand over when the screen goes dark? [Kheelu](https://kheelona.com/products/kheelu) is one screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.
>
> How much screen time suits each age is a separate question. Our guide, [How much screen time is okay for a young child?](https://kheelona.com/stories/how-much-screen-time-for-a-3-to-6-year-old), sets out the WHO, IAP and AAP advice, age by age.

- Tip icons: `calendar-check`, `pause`, `gear`, `clock`, `puzzle-piece`, `heart`.
- All tips are house advice; none is a countdown, and none has the parent switch off mid-episode.
- Product line: facts only; it claims nothing about tantrums or behaviour. Links: `/products/kheelu` (the page's
  one product link); `/stories/how-much-screen-time-for-a-3-to-6-year-old`.
- Task 5.20a: the product line opens "Looking for something to hand over when the screen goes dark?" (was "Need
  something ready for that moment?", which, straight after "If tears come", read as offering Kheelu to a crying
  child: CMO M8), and carries both age lines, "It is not a toy for children under 3." before the grown-up line
  (CMO M7; the study's children were 1 to 5). 54 words, the CMO's wording.
- The autoplay tip stays unmarked, as house advice. CMO M9 offers marker ² for it (the release calls autoplay "a
  frustrating and driving force behind many of their battles"), but that passage is in no saved excerpt and no
  ready line yet, so it is not added as research until the verifier files it (M9).

---

## Fold 7 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Hiniker, Suh, Cao and Kientz (University of Washington), "Screen Time Tantrums", CHI 2016 conference proceedings, pp. 648-660, 2016, abstract. https://doi.org/10.1145/2858036.2858278
>
> ² University of Washington News (Jennifer Langston), "Two-minute warnings make kids' 'screen time' tantrums worse", 2016, the university's release about the study. https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/

- **Note ¹ gives the paper's main title only.** Its subtitle names "Toddlers and Preschoolers": the word
  "toddler" is banned on the site ([messaging, "Added for 3 to 7"](../../brand/messaging.md#claims-guardrails)) and
  the content-integrity guard flags it (`content-integrity.spec.ts:34`). The DOI links the full record, and the
  text states the study's ages (1 to 5).
- Note ² is the university's own account of its study (the full paper could not be read); cited by name, as the
  C35 ready line says.

---

## Fold 8 · Related guides

**Copy:**

> **H2:** Related guides
>
> - How much screen time is okay for a young child?
> - The gentle way off the phone: a seven-day plan
> - Busy hands, no screens

| Title (each guide's own card) | Real URL |
|---|---|
| How much screen time is okay for a young child? | `/stories/how-much-screen-time-for-a-3-to-6-year-old` |
| The gentle way off the phone: a seven-day plan | `/stories/the-gentle-way-off-the-phone` |
| Busy hands, no screens | `/stories/busy-hands-no-screens` |

The stub's `related` list, unchanged.

---

## Fold 9 · Close (journal close block)

As on the [screen-time guide](story-how-much-screen-time-for-a-3-to-6-year-old.md#fold-13--close-journal-close-block):
the hub's close from `articlePageCopy`, `cta` = `finale`; amounts from the offer.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 60 characters, the §5.2 draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 142 characters; the two-minute-warning finding, reported as found, with no "why" the page does not give (CMO M10) |
| One H1 with the primary | Yes (close variant) | As live, the card title: "Screen time and tantrums" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What helps with screen time tantrums?" and its 54-word answer |
| An H2 the keyword map names | Yes | Fold 4 "Why the meltdown comes at the off switch" (§5.2) |
| Secondary "tantrum when the phone is taken away" | Yes | Fold 5 H2 |
| "3 to 7" on the page | Yes | Fold 6 product line; the close |
| Alt text | Yes | Describes the scene |
| Density | Yes | "screen time tantrums" twice in `<main>` (fold 2 H2, fold 4): about 1.2% of about 490 words; "Kheelu" 3 times with the close |
| Words never placed | Yes | No "cartoon addiction" (the secondary reads as a clinical label, and no source covers it: §5.1 rule 8); no "toddler"; no countdown tip; no brain, speech or health line; no percentages |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (product, one guide) | text links | none | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** As on the [screen-time guide](story-how-much-screen-time-for-a-3-to-6-year-old.md#questions-for-the-founder-website-only)
   (the live byline is Kashyap C.R). **Recommend "The Kheelona team"** unless Kashyap reads and owns the rewrite.
2. **A product link on a tantrums page.** (a) One calm line after the tips, facts only (as drafted; strategy §3.3
   gives every journal article one); (b) no product link, as on the late-talker guide. **Recommend (a)**:
   tantrums are not a health topic, and the line promises nothing about behaviour; (b) only if the founder
   reads it as selling to a parent at a hard moment. (Task 5.20a: the head photo now shows Kheelu, from the
   5.20a pool: at the far end of a homework desk, not in a calm child's arms, CMO fix pass N2. If the founder
   picks (b), the head goes back to a photo without Kheelu, so the page carries no product at all.)

**For QA before publishing:** re-read the University of Washington release and save the passage on routines
and natural breaks to the C35 excerpt (it is in the verification's reading, source verification C35 caveat 6,
but not in the saved excerpt). Task 5.20a: the CMO re-read it at source and confirmed the line; the excerpt file
is still to be filed (CMO M9, the verifier's), with the autoplay passage if fold 6's tip is to carry marker ².

## Sources

| Claim | Source |
|---|---|
| Screen time tantrums are common enough that researchers have studied them; a 2016 University of Washington study of families with children aged 1 to 5; "transitioning away from screens is often painful" | [source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch) (ready line); excerpt `raw/research/sources/C35-hiniker-2016-screen-time-tantrums.md:26-33`; "only a few studies" (so never "its own literature"): `C35-gavrilova-veraksa-2024-screen-time-tantrums.md:27-29` |
| The senior author: most of the time these transitions "actually go pretty smoothly", hard for parents to see | `C35-hiniker-2016-screen-time-tantrums.md:44-46` (the release) |
| Routines and stopping at a natural break made the switch easier | [source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch), caveat 6 and ready line (the release); not in the saved excerpt (QA note above) |
| Children given a two-minute warning were more upset when the screen went away | `C35-hiniker-2016-screen-time-tantrums.md:48-49` (the release); C35 caveat 5 |
| Kheelu: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Not a toy for children under 3 (task 5.20a, CMO M7) | [facts, age](../../product/facts.md#age) (band 3 to 7, brief §2); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan); [content boundary](../content-boundary.md) (never imply under 3); the same line and sources as the approved [learning-toys guide](story-learning-toys-for-a-three-year-old.md) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Meta: one study found a two-minute warning made children more upset | `C35-hiniker-2016-screen-time-tantrums.md:48-49` (the release); C35 caveat 5 (CMO M10's wording) |
| Card title and summary, related list, published date | the stub module; [stories.md](stories.md) fold 2 (line 119); `src/lib/stories-expansion.ts:50` |
| Cut lines | [source verification C35](../../research/source-verification.md#c35--tantrums-at-the-off-switch) caveats 1, 2, 5; no source for the live mechanism lines |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources |
| Photo | DS `03-cast.md:13, 124` (kabir-03; task 5.20a, CMO M16 and fix pass N1, N2; the alt is the fix-pass review's); 9:16 master in the 4:5 head as a centred crop, as `tara-03` ([assets.md](../../engineering/assets.md)); file checked by eye 2026-10-14 |

## Changes after approval (task 5.20a)

The CMO approved this page in round 1 with five minor fixes ([CMO review 5.17](../../qa/cmo-review-articles-5.17-2026-10-14.md):
M7, M8, M9, M10, M16). Task 5.20a applied four of them on 2026-10-14 and left M9's optional marker, whose source
is not yet filed. No new research statement was added.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 6, product line | "Need something ready for that moment?" becomes "Looking for something to hand over when the screen goes dark?" | M8: after the tip "If tears come…", "that moment" read as the meltdown, so the line offered Kheelu to a crying child |
| 2 | Fold 6, product line | Adds "It is not a toy for children under 3." before the grown-up line | M7 (the study's children were 1 to 5); [facts, age](../../product/facts.md#age), as the approved learning-toys guide. With row 1, the CMO's 54-word line |
| 3 | At a glance, meta description | "Screen time tantrums: one study found a two-minute warning made children more upset. What helps instead, and how to make switching off boring." (142 characters; was 144) | M10: the old meta promised a "why" the page does not give |
| 4 | Fold 1, head photo and alt | `ira-04-paper-crown` becomes `kabir-03-homework-desk` (the 9:16 master as a 4:5 centred crop), with the fix-pass review's alt | M16 (this guide and the busy-hands guide, which it links to, shared a photo and had two alts for it); the 5.20a pool in [tasks.md 5.20](../../engineering/tasks.md); unused elsewhere ([assets.md](../../engineering/assets.md)); not the 3-year-old cast, so no grown-up is needed in frame. The first fix-pass draft took `tara-01-naming-feelings`, which the gentle-way guide also took (the two link both ways, with two alts), and a calm child holding Kheelu at the head of a meltdown guide made feelings a reason to buy ([voice](../../brand/voice.md), row 7): [CMO fix pass](../../qa/cmo-review-article-fixes-5.20a-2026-10-14.md) N1 and N2 |
| 5 | Not changed: fold 6's autoplay tip | Left without marker ² | M9's optional marker needs the release's autoplay passage, which is in no saved excerpt and no ready line ([source verification](../../research/source-verification.md) C35; [2026-10-14](../../research/source-verification-2026-10-14.md) does not cover C35). It can be added once the verifier files the excerpt M9 asks for |
| 6 | Notes | Read time (about 490 words, still 2 minutes), the fold 1, 5 and 6 notes, keyword placements, question 2 (a note on the photo), the QA note, the sources table | So the page stays true |

**Not changed:** title, H1, lead, byline, dates (`updated` stays 2026-10-13), the answer, folds 3 to 5, the tips,
the sources list, related guides, the close and the sticky bar.

**For the builder (same commit as this page):** the module follows the meta, fold 1 (photo import and alt) and
fold 6's product line word for word. assets.md: add `kabir-03-homework-desk-web.webp` (head of this guide, 4:5
centred crop of the 9:16 master) and take this guide off the `ira-04` row.
