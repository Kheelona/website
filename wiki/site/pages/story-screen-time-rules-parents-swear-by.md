---
title: "Story: The 3-6-9-12 rule, and other screen rules parents swear by (/stories/screen-time-rules-parents-swear-by): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link; §5 /stories/* row)
  - ../pages/stories.md (fold 2 card, line 118; fold 6 journal close)
  - ../pages/story-learning-toys-for-a-three-year-old.md (format, close, sticky bar, age lines)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../url-map.md (§1b, line 128)
  - ../../research/keyword-map.md (§4.2 row LRN-2, line 251; §5.1; §5.2 line 366; §5.3 line 421; §6.7 SR2, lines 629-630)
  - ../../research/source-verification.md (§3.2 C31-C34, lines 118-121; §4 ready lines, lines 381-433)
  - "../../raw/research/sources/: C34-tisseron-3-6-9-12-balises.md, C31-who-2019-guidelines-under-5.md, C32-iap-2022-screen-time-digital-wellness.md, C33-aap-2016-media-and-young-minds.md, C33-aap-2016-school-aged-media-use.md"
  - ../../product/claims.md (§1, §4, §8), ../../product/facts.md, ../../product/age-band-review.md
  - ../../decisions/D016, D025, D026, D041
  - ../../brand/voice.md, ../../brand/messaging.md, ../content-boundary.md
  - "test/guards/banned-phrases.data.ts; test/e2e/content-integrity.spec.ts:25-41 (age band, under-3, analytics words)"
  - "src/lib/stories-expansion.ts:341-373 (the live article; legacy file, input only), read in the w5c-5.17 worktree 2026-10-14"
  - "src/content/en-IN/stories/articles/screen-time-rules-parents-swear-by.ts (stub: card, related, dates); src/content/types.ts:356-469 and src/layouts/ArticleTemplate/ArticleTemplate.tsx (the blocks the template renders)"
  - design-system/project/03-cast.md:110; 01-writing.md:19-26 (read-only)
  - "Task 5.20a fixes: ../../qa/cmo-review-articles-5.17-2026-10-14.md (M1, M2, M3); ../../research/source-verification-2026-10-14.md (§1a and §1b ready lines and caveats); ../../open-questions.md (P25, its working default)"
  - "../../raw/research/sources/: C34-tisseron-2020-ai-markers-3-6-13-18.md, C34-tisseron-3-6-ages-minutes-2026-10-14.md (task 5.20a)"
---

# Story: The 3-6-9-12 rule, and other screen rules parents swear by

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁶` (six since task 5.20a) are source markers under [D026](../../decisions/D026-public-statistics.md) and
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults), numbered in reading order and
  reused. Lines without a marker are plain advice in our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template, and
  each fold names the block it uses.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/screen-time-rules-parents-swear-by` (no mockup; template parity with `story-learning-toys-for-a-three-year-old.html`) |
| Page job | Answer "what is the 3-6-9-12 rule" exactly as its author set it out, with the AI markers he added in 2020, in full; say plainly where it differs from the WHO, IAP and AAP; give the screen rules that have a source behind them; no in-text product link (P25 working default, task 5.20a) |
| Primary cluster | **3-6-9-12 rule** (LRN-2; KP 10-100, GSC position 1.0); secondary "screen time rules" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (56 characters) | The 3-6-9-12 rule and other screen-time rules · Kheelona |
| Meta description (142 characters) | The 3-6-9-12 rule says no screens before 3. Where it comes from, how it compares with WHO, IAP and AAP advice, and which screen rules to keep. |
| H1 | The 3-6-9-12 rule, and other screen rules parents swear by (as live; the hub card title) |
| Card (hub, unchanged) | Title "The 3-6-9-12 rule, and other screen rules parents swear by"; summary "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say." ([stories.md](stories.md) fold 2, line 118; the stub) |
| Byline line | The Kheelona team · First published 30 Jul 2026 · 3 min read (byline: question 1) |
| Dates | `published` 2026-07-30 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | None. Fold 7's product line is dropped under the working default of [open question P25](../../open-questions.md) (task 5.20a); the close and the sticky bar stay as drafted (question 4) |
| Template settings | `close: "journal"` |

**What changed from the live article** (`src/lib/stories-expansion.ts:341-373`): "the French psychiatrist"
becomes "the psychiatrist" ([source verification C34](../../research/source-verification.md#c34--the-3-6-9-12-rule),
caveat 1); "no personal games console before 6" becomes "no device or games console of their own", with the
family-tablet nuance from his own page (caveat 2); "the one the strongest research agrees with" and "the part
the medical bodies agree with" are reversed, because the first marker is stricter than the medical bodies
(caveat 3, NOT SUPPORTED); "four doorways: nursery, school, reading, secondary school" (could not verify,
caveat 4) and "He has since revised the later doorways" (not supported, caveat 5) are cut; the AAP's "about an
hour a day" becomes a ceiling (C33 caveat 1); the WHO's line for one-year-olds leaves (the page speaks to
parents of 3 to 7 year olds); the 20-20-20 paragraph (an eye-health claim with no verified source) and the
3-3-3 and 7-7-7 paragraph (no source) are cut (question 2); "the talking that a screen quietly eats" (no source)
is cut; the fridge line becomes a sourced checklist; the pre-order pitch with its typed advance ("Pre-orders
are open, and the ₹499 ...") goes, because the close carries the price; "a screen-free friend that talks,
tells stories" becomes the confirmed product line. Title from 69 to 56 characters.
(Task 5.20a then dropped that product line and added Tisseron's AI markers: see "Changes after approval" at the foot.)

---

## Fold 1 · Article head

**Fold job:** name the rule and promise the comparison, in the first phone screen. Renders as `ArticleHead`.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** The 3-6-9-12 rule, and other screen rules parents swear by
>
> Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.
>
> The Kheelona team · First published 30 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "parents swear by"; `nowrap` on "3-6-9-12 rule," (and on "3-6-9-12" in every heading).
- **Lead:** the hub card's summary, word for word.
- Breadcrumb: "Stories" → `/stories`; "Screen time" → `/stories#screen-time`.
- **Read time:** about 640 words in `<main>` before the sources and close (about 560 before task 5.20a); still 3 minutes at 200 words a minute.
- **Image** (after the lead, `kh-photo --wide`, 16:9): `advik-04-floor-train-web.webp`. Alt: "A boy in a green
  T-shirt lying on a red floor, smiling as he pushes a blue wooden train." (the approved alt;
  `03-cast.md:110`, "screen-free play"; file checked by eye 2026-10-14). No Kheelu in the photo.

---

## Fold 2 · The answer first

**Fold job:** define the rule in 40 to 60 words, exactly as its author set it out. Renders as `AnswerSection`.

**Copy:**

> **H2:** What is the 3-6-9-12 rule?
>
> It is a set of four age markers for screens, set out in 2008 by the psychiatrist Serge Tisseron: no screens before 3, no device or games console of their own before 6, the internet with an adult from 9, and alone from 12.¹ It is a framework, not a study.
>
> Below: where it comes from, how it compares with the WHO, the IAP and the AAP for children aged 3 to 7, and which other screen rules have a source behind them.

- Answer block: 51 words (marker excluded). C34's ready line; never "French", "four doorways" or "the one the
  strongest research agrees with" (C34 ready-line note).

---

## Fold 3 · Where it comes from

**Copy:**

> **H2:** Where does the 3-6-9-12 rule come from?
>
> Serge Tisseron set out the markers in 2008 to help parents know at what age, and how, to bring screens into their child's life.¹ The 3-6-9-12 association's site explains them, in French.
>
> The marker at 6 is about owning a device, not using one. A child may use a family tablet or games console if you allow it, but should not have their own, because a device of their own becomes very hard to limit.¹
>
> In 2020, he added a second set of markers, 3-6-13-18, for artificial intelligence.¹ For young children, they say no digital tool before 3 and no connected toys before 6: AI listens, but it does not understand the child, and may impose ways of thinking and values that are not the parents'.²
>
> The later markers are no internet or general-purpose chatbots before 12, except used with an adult, and no digital companion before 18.²
>
> If you are weighing an AI toy, our guide to [what to look for in a safe AI toy](https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy) sets out what to check first.

- C34:32-33 ("pour aider les parents à savoir à quel âge et de quelle façon introduire les écrans") and
  C34:39-42 (the family tablet or console, never owned, "très difficile d'en limiter la consommation");
  English renderings of the French, as the excerpt's translations.
- **Paragraphs 3 and 4 (task 5.20a, CMO M1):** the ready line of
  [source verification 2026-10-14 §1a](../../research/source-verification-2026-10-14.md#1a-the-3-6-13-18-markers-about-ai--supported),
  word for word, split after its second sentence for phone reading. All four markers, never a selection
  (§1a caveat 1; the working default of [open question P25](../../open-questions.md)): the one that applies to
  Kheelu's category, "no connected toys before 6", is in the paragraph a parent reads first. Marker ¹ is the
  balises page's opening paragraph ("En 2020, il crée les balises 3-6-13-18",
  `C34-tisseron-2020-ai-markers-3-6-13-18.md:106-107`); marker ² is the AI page's four markers (same file,
  lines 77-102, the English renderings its own). The year rests on the association's word (§1a caveat 2), so the
  line says only "In 2020, he added", and nothing here implies the wording dates from 2020. The 3 marker of the
  AI set ("no digital tool") stays apart from the 2008 one ("no screens"), §1a caveat 5. Not used: the AI page's
  EU AI Act quote (§1a caveat 4, not checked against the Act).
- **Paragraph 5:** the CMO's link to the safe-AI-toy guide (M1, "Fix, now"; kept by P25's working default). A
  guide link, not a product link; the guide is also in the related list (fold 9).

---

## Fold 4 · Does it hold up

**Fold job:** the card's promise, "whether it holds up", answered honestly.

**Copy:**

> **H2:** Does the 3-6-9-12 rule hold up?
>
> As a place to start, yes, with two differences worth knowing. Its first marker, no screens before 3, is stricter than the medical bodies. The World Health Organization, the Indian Academy of Pediatrics and the American Academy of Pediatrics each set a ceiling of one hour a day from age two until five.³ ⁴ ⁵
>
> For ages three to six, Tisseron's markers set a daily limit that rises from half an hour at 3 to an hour at most at 6, and treat screen time as time shared with a parent.¹
>
> Its later markers, at 6, 9 and 12, are about owning a device and going online.¹

- C34's ready line, trimmed of its under-two detail (the WHO and IAP "no screens under two", the AAP's video-call
  exception): the comparison needs only the ceiling from two until five (CMO M2; source verification C31
  caveat 4: the WHO stops at 4, so a "from two" line ends "until five"; the IAP's band is 24 to 59 months and the
  AAP's 2 to 5 years), and the page speaks to parents of 3 to 7 year olds. "As a place to start, yes" is our
  judgement, stated as ours.
- **Paragraph 2 (task 5.20a, CMO M1):** the ready line of
  [source verification 2026-10-14 §1b](../../research/source-verification-2026-10-14.md#1b-de-3-à-6-ans-the-daily-minutes--supported),
  with two changes of form only: the range in words ("three to six"), because the banned-phrases guard refuses
  its numeral form (`dead-age-ranges`), and "Tisseron's" for "his", because in this fold "his" would follow no
  name. Excerpt: `C34-tisseron-3-6-ages-minutes-2026-10-14.md:37-39` ("de une demi heure à 3 ans à 1 heure maximum
  par jour à 6 ans. L'écran est un temps de partage avec un parent."). It replaces "For the number of minutes,
  turn to the medical bodies.", which §1b caveat 3 found out of date: his markers do give minutes for the
  ages from 3 to 6. It sits here, not in fold 5 as §1b suggests, so the two numbers stay under separate headings
  and are never merged (§1b caveat 2); fold 5's heading names only the WHO, the IAP and the AAP.
- **"Two differences"** (was "one difference"): this fold now shows two places where the rule is stricter than the
  medical bodies, no screens before 3 and the daily minutes from 3 to 6 (§1b caveat 2). The word "stricter" is
  used only for the first, as C34's ready line has it. The later-markers sentence moves below the minutes so the
  two differences sit together.

---

## Fold 5 · What the medical bodies say

**Copy:**

> **H2:** What do the WHO, the IAP and the AAP say?
>
> At 3 and 4, the WHO and the IAP both say no more than an hour of screen time a day, and less is better.³ ⁴ The AAP sets the same hour for children aged two to five, of high-quality programmes, watched together.⁵
>
> From 5 to 10, the IAP says under two hours a day, homework on a screen included.⁴ For children aged 5 to 18, the AAP sets no fixed number of hours: it asks families to place consistent limits on time and on the kinds of media used.⁶
>
> Our guide to [how much screen time is okay for a young child](https://kheelona.com/stories/how-much-screen-time-for-a-3-to-6-year-old) goes through it age by age.

- The same sourced lines as the screen-time guide, shortened; that guide owns the age-by-age detail, so this
  fold links to it rather than repeating it.

---

## Fold 6 · The rules with a source

**Fold job:** deliver "other screen rules parents swear by" with only the rules a public body states.
Renders as an `ArticlePart`: `p`, `list` (variant `checks`), `p`.

**Copy:**

> **H2:** Which screen time rules have a source behind them?
>
> Beyond the hour, the IAP and the AAP each add a few habits for children under five. Each rule below carries its source:
>
> - No screens at meals.⁴ ⁵
> - No screens in the hour before sleep.⁴ ⁵
> - No screens in the bedroom.⁵
> - Watch together, and talk about what you see.⁴ ⁵
> - No more than 20 to 30 minutes at a time.⁴
> - No screens on car, bus or train journeys.⁴
> - Skip fast-paced programmes and apps full of distractions.⁵
>
> When a new rule turns up in the family group chat, check it against this list.

- IAP C32:45-51 (24 to 59 months); AAP C33:61-68 (0 to 5). "Surface travel" is written as car, bus and train
  journeys; "each session not more than 20-30 min" as "at a time" (the guard reads "session" as an analytics word).

---

## Fold 7 · Which rule to keep

**Copy:**

> **H2:** So which rule should your family keep?
>
> The one you can hold. A loose rule kept for a year beats a strict one dropped by Thursday.
>
> Start with the hour and one habit from the list. Add another when the first one sticks.

- House lines only. **No product line** (task 5.20a): the working default of
  [open question P25](../../open-questions.md) drops it, as on the talking guides, rather than offer Kheelu, a
  connected AI plush toy, a few lines after an expert's "no connected toys before 6" (fold 3). The page names
  Kheelu only in the shared journal close. If the founder chooses P25 (b), the line returns as question 3 words
  it, with both age lines (D041).

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Serge Tisseron, association 3-6-9-12, "Les balises 3-6-9-12+" (in French), undated page, opening paragraph and sections "Les repères 3-6-9-12 en 2008" and "De 3 à 6 ans". https://www.3-6-9-12.org/les-balises-3-6-9-12/
>
> ² Serge Tisseron, association 3-6-9-12, "Les balises 3-6-13-18 et l'IA" (in French), undated page, the four markers. https://www.3-6-9-12.org/les-balises-3-6-13-18/
>
> ³ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
>
> ⁴ Indian Academy of Pediatrics, "Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents", Indian Pediatrics, 2022, p. 239. https://www.indianpediatrics.net/mar2022/235.pdf
>
> ⁵ American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591
>
> ⁶ American Academy of Pediatrics, Council on Communications and Media, "Media Use in School-Aged Children and Adolescents", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2592

- The same list is the BlogPosting `citation` array.
- Task 5.20a: note ¹ now names the three parts of the balises page the copy cites (the opening paragraph for "In
  2020, he added", §1a note ¹; "De 3 à 6 ans" for the minutes, §1b note ¹; the 2008 section as before), so one
  page keeps one number; "on the 2008 markers" leaves it, since the note now covers more. Note ² is §1a's note ²,
  word for word. The WHO, IAP and AAP notes move from ² to ⁵ to ³ to ⁶ (reading order, D026, B15).

---

## Fold 9 · Related guides

**Copy:**

> **H2:** Related guides
>
> - Busy hands, no screens
> - What to look for in a safe AI toy
> - What India's data law asks of a toy that listens

| Title (each guide's own card) | Real URL |
|---|---|
| Busy hands, no screens | `/stories/busy-hands-no-screens` |
| What to look for in a safe AI toy | `/stories/what-to-look-for-in-a-safe-ai-toy` |
| What India's data law asks of a toy that listens | `/stories/ai-toys-and-indias-data-law` |

The stub's `related` list, unchanged (the live journal's ring).

---

## Fold 10 · Close (journal close block)

As on the [screen-time guide](story-how-much-screen-time-for-a-3-to-6-year-old.md#fold-13--close-journal-close-block):
the hub's close from `articlePageCopy`, `cta` = `finale`; amounts from the offer.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 56 characters, the §5.2 draft |
| Meta ≤ 155: primary plus a concrete fact | Yes | 142 characters; "no screens before 3" |
| One H1 with the primary | Yes | As live, the card title |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What is the 3-6-9-12 rule?" (SR2) and its 51-word answer |
| An H2 with the primary | Yes | Folds 2, 3 and 4 |
| Secondary "screen time rules" | Yes | Fold 6 H2 |
| "3 to 7" on the page | Yes | Fold 2 detail; the close (fold 7's product line is gone, task 5.20a) |
| Alt text | Yes | Describes the scene |
| Density | Yes | "3-6-9-12 rule" 5 times in `<main>` (H1, lead, three H2s): about 1.6% of about 640 words, under the 2% flag; "Kheelu" twice, both in the close (was 3 with the product line) |
| Words never placed | Yes | No under-3 ages as a target, no "toddler", no "French", no unsourced rules, no brain or health line, no competitor names, no "session"; no "3 to 6" in numerals (fold 4 writes "three to six"); no product line beside Tisseron's markers (P25) |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (two guides: the safe-AI-toy guide in fold 3, the screen-time guide in fold 5; no product link since task 5.20a) | text links | none | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Byline.** As on the [screen-time guide](story-how-much-screen-time-for-a-3-to-6-year-old.md#questions-for-the-founder-website-only)
   (the live byline is Kashyap C.R). **Recommend "The Kheelona team"** unless Kashyap reads and owns the rewrite.
2. **Rules with no verified source.** The live page also covered 20-20-20 (eyes) and the 3-3-3 and 7-7-7 rules.
   (a) Leave them out (as drafted); (b) verify 20-20-20 against an eye-care body's own page and add a short
   fold saying it is about tired eyes, not about how much a child should watch. **Recommend (a)**: the card's
   "other screen rules" is met by fold 6, where every rule has a source.
3. **Tisseron's AI markers and the product line ([open question P25](../../open-questions.md), before Gate B).**
   (The draft's question 3, "Tisseron's other material", is answered: the verifier read and saved both the AI
   markers and the daily minutes, [source verification 2026-10-14](../../research/source-verification-2026-10-14.md)
   §1a and §1b, and task 5.20a put both on the page.) His 3-6-13-18 page says "no connected toys before 6" and
   criticises talking plush toys offered from age 3 as an alternative to screens; Kheelu is in that category.
   (a) As built, P25's working default: the four markers in full (fold 3), the link to the safe-AI-toy guide, and
   no product line; (b) keep a product line, worded as CMO M1 and M3 ask ("If the hard part is filling the time
   after the screen goes off, Kheelu is one screen-free option: an AI plush toy for ages 3 to 7 that answers your
   child, then asks a question back. It is not a toy for children under 3, and if your child is 3, keep a grown-up
   nearby while they play."), with a signed answer to the markers, as B3 does for Common Sense Media; (c) take
   the article off the journal. **Recommend (a)**: the page stays useful and honest, it ranks for the rule's own
   name, and a parent weighing an AI toy is sent to the guide that sets out what to check.
4. **The close and the sticky bar under P25 (a).** (a) Keep the journal close and the phone sticky bar (as built:
   the working default names only the product line); (b) the keep close, with no pre-order button and no sticky
   bar, as on the talking guides. **Recommend (b)** once the founder confirms P25 (a): on a phone the sticky bar's
   "Pre-order Kheelu" stays on screen beside "no connected toys before 6", which is the pitch the default sets
   out to avoid; the safe-AI-toy guide the page links to keeps its journal close. (b) changes a template setting
   and the shared sticky-bar route list, so it is the main session's to make.
5. **Head photo.** (a) Keep `advik-04-floor-train` (as built; no Kheelu); (b) one of task 5.20a's unused photos
   with Kheelu. **Recommend (a)** while P25 (a) stands: a photo of a child with a connected toy at the head of a
   page that quotes "no connected toys before 6" would undo the reason the product line went. If the founder picks
   P25 (b), (b) becomes possible (a grown-up in frame if the child is the 3-year-old).

## Sources

| Claim | Source |
|---|---|
| Set out in 2008 by the psychiatrist Serge Tisseron; no screens before 3, no device or console of their own before 6, the internet with an adult from 9, alone from 12; a framework, not a study | [source verification C34](../../research/source-verification.md#c34--the-3-6-9-12-rule); excerpt `raw/research/sources/C34-tisseron-3-6-9-12-balises.md:21-22, 37-52` |
| To help parents know at what age, and how, to bring screens into a child's life | `C34-tisseron-3-6-9-12-balises.md:32-33` |
| The marker at 6: a family tablet or console allowed, never owned, because then it is very hard to limit | `C34-tisseron-3-6-9-12-balises.md:39-42, 48-50`; C34 caveat 2 |
| In 2020 he added a second set of markers, 3-6-13-18, for artificial intelligence; no digital tool before 3, no connected toys before 6 (AI listens but does not understand the child, and may impose ways of thinking and values that are not the parents'); no internet or general-purpose chatbots before 12, except used with an adult; no digital companion before 18 | [source verification 2026-10-14 §1a](../../research/source-verification-2026-10-14.md#1a-the-3-6-13-18-markers-about-ai--supported) (ready line; caveats 1-5); `C34-tisseron-2020-ai-markers-3-6-13-18.md:77-102` (the markers), `:106-107` (the year, on the balises page) |
| The first marker is stricter: the WHO, IAP and AAP set a ceiling of one hour a day from two until five | C34 ready line and caveat 3; C31 caveat 4 ("until five"; CMO M2); `C31-who-2019-guidelines-under-5.md:36-37`; `C32-iap-2022-screen-time-digital-wellness.md:44-46`; `C33-aap-2016-media-and-young-minds.md:61` |
| For ages 3 to 6, his markers set a daily limit rising from half an hour at 3 to an hour at most at 6, and treat screen time as time shared with a parent | [source verification 2026-10-14 §1b](../../research/source-verification-2026-10-14.md#1b-de-3-à-6-ans-the-daily-minutes--supported) (ready line; caveats 1-3); `C34-tisseron-3-6-ages-minutes-2026-10-14.md:37-39` |
| At 3 and 4: WHO and IAP, no more than an hour, less is better; AAP, one hour of high-quality programmes for two to five, watched together | [C31](../../research/source-verification.md#c31--the-who-guideline), [C32](../../research/source-verification.md#c32--the-indian-academy-of-pediatrics), [C33](../../research/source-verification.md#c33--the-american-academy-of-pediatrics); `C31:39-43`, `C32:44-46`, `C33-aap-2016-media-and-young-minds.md:61-62` |
| IAP: 5 to 10, under two hours, homework included; AAP: 5 to 18, consistent limits, no fixed number | `C32:53-56`; `C33-aap-2016-school-aged-media-use.md:28-34` |
| Checklist: meals, the hour before sleep, bedroom, watch together, 20 to 30 minutes at a time, travel, fast-paced programmes and distracting apps | `C32-iap-2022-screen-time-digital-wellness.md:44-51`; `C33-aap-2016-media-and-young-minds.md:61-68` |
| (Fold 7's product line and its age lines: dropped in task 5.20a, P25 working default. The close names Kheelu with its own sources, row "Close block" below; the wording for P25 (b) rests on [facts, identity](../../product/facts.md#identity) ("Screen-free AI toy", the schema category), [age](../../product/facts.md#age), [D017](../../decisions/D017-live-behaviour-claims-confirmed.md), [claims §1](../../product/claims.md#1-confirmed-by-the-founder) and [D041](../../decisions/D041-gate-a-round-1.md)) | n/a |
| Card title and summary, related list, published date | the stub module; [stories.md](stories.md) fold 2 (line 118); `src/lib/stories-expansion.ts:348` |
| Cut lines | [source verification C34](../../research/source-verification.md#c34--the-3-6-9-12-rule) caveats 1-5; C33 caveat 1 |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources |
| Photo | DS `03-cast.md:110`; file checked by eye 2026-10-14 |

## Changes after approval (task 5.20a)

The CMO approved this page in round 1 with three minor fixes ([CMO review 5.17](../../qa/cmo-review-articles-5.17-2026-10-14.md),
M1 to M3). Task 5.20a applied them on 2026-10-14, M1 first, with the ready lines of
[source verification 2026-10-14](../../research/source-verification-2026-10-14.md) and the working default of
[open question P25](../../open-questions.md). Nothing else in the Copy blocks changed.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 3, three new paragraphs | Tisseron's 2020 AI markers, all four ("no digital tool before 3 and no connected toys before 6 … no internet or general-purpose chatbots before 12, except used with an adult, and no digital companion before 18"), then the link to the safe-AI-toy guide | M1 (fold 3; "Fix, before Gate B": state what the markers say for ages 3 to 7); §1a ready line, word for word, split after its second sentence; §1a caveat 1 and P25's working default (in full, never selectively); the link is M1's "Fix, now", kept by P25 |
| 2 | Fold 4, paragraph 2 | "For the number of minutes, turn to the medical bodies." becomes "For ages three to six, Tisseron's markers set a daily limit that rises from half an hour at 3 to an hour at most at 6, and treat screen time as time shared with a parent.¹" | M1 (the daily minutes, "the most useful number on the page"); §1b ready line and caveat 3 (the old line is out of date). Form only: the range in words (`dead-age-ranges` guard), the name for "his". Placed in fold 4, not fold 5, so the two numbers sit under separate headings (§1b caveat 2) |
| 3 | Fold 4, paragraph 1 | "one difference worth knowing" becomes "two differences worth knowing"; the later-markers sentence moves below the minutes | Keeps the fold true once the minutes are on it (§1b caveat 2: his limit is stricter than the bodies' ceiling) |
| 4 | Fold 4, paragraph 1 | "from age two" becomes "from age two until five" | M2; source verification C31 caveat 4 |
| 5 | Fold 7 | The product line is removed (it named Kheelu, the page's one product link, and both age lines) | P25's working default: drop the article's product line, as on the talking guides. So M1's fold-7 wording ("an AI plush toy for ages 3 to 7") and M3 ("filling the time after the screen goes off") are not applied: the line they fix is gone. Both are kept, ready, in question 3 (b) |
| 6 | Fold 8, sources | Note ¹ names the opening paragraph and the sections "Les repères 3-6-9-12 en 2008" and "De 3 à 6 ans"; new note ², "Les balises 3-6-13-18 et l'IA"; the WHO, IAP and AAP notes become ³ to ⁶, and the markers in folds 4 to 6 follow | D026 and B15 (one number per source, in reading order); §1a notes ¹ ², §1b note ¹ |
| 7 | Notes | At a glance (page job, in-text product link), the "what changed" paragraph, read time (about 640 words, still 3 minutes), the fold 3, 4, 7 and 8 notes, keyword placements, CTA values, questions 3 (replaced: answered and now P25), 4 and 5 (new), the sources table | So the page stays true |

**Not changed:** title, meta, H1, lead (the card's summary), byline, dates (`updated` stays 2026-10-13), related
guides, the close and the sticky bar (question 4), and the head photo `advik-04` (M16 and M17 do not name this page;
question 5 says why no photo with Kheelu goes here while P25 (a) stands).

**For the builder (same commit as this page):** the module follows folds 3, 4, 5, 6, 7 and 8 word for word, with six
sources. Under P25's working default this article has no product link, so the check in
`screen-time-articles.test.tsx` that every screen-time article links the product page exactly once needs this
article's exception (none here), as the talking guides have; the rest of that test holds. `close` stays `"journal"`
unless the main session takes question 4 (b).

**For the main session:** CMO M2 also asks that C34's ready line in [source verification](../../research/source-verification.md#c34--the-3-6-9-12-rule)
gain "until five"; that page is not this task's to edit.
