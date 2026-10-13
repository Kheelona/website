---
title: "CMO review, fix pass: the six screen-time articles (task 5.20a copy fixes), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - "../site/pages/story-how-much-screen-time-for-a-3-to-6-year-old.md, story-screen-time-rules-parents-swear-by.md, story-screen-time-and-tantrums.md, story-the-gentle-way-off-the-phone.md, story-busy-hands-no-screens.md, story-screen-free-does-not-mean-silent.md (Copywriters' fix pass, task 5.20a, uncommitted in worktree w6-5.20a; line numbers below refer to them as read on 13 Oct 2026; each change read as a diff against b8af96b..25ccba5, the approved round-1 copy)"
  - cmo-review-articles-5.17-2026-10-14.md (the findings M1 to M17 this pass applies)
  - "../research/source-verification-2026-10-14.md (§1a and §1b: ready lines, caveats 1-6 and 1-4); ../research/source-verification.md (C31 caveat 4, C32, C33, C34, C35)"
  - "../raw/research/sources/C34-tisseron-2020-ai-markers-3-6-13-18.md:29-116; C34-tisseron-3-6-ages-minutes-2026-10-14.md:31-43; C33-aap-2016-media-and-young-minds.md:61-68; C32-iap-2022-screen-time-digital-wellness.md:44-56"
  - "../open-questions.md P25 (the working default); ../engineering/tasks.md 5.20 (the head-photo pools, lines 1215-1236); ../engineering/assets.md §1 (photo uses; the tara-03 4:5 centred-crop precedent)"
  - "../brand/positioning.md (the age correction), ../brand/voice.md (rules 8, 11, 17; 'Feelings as a reason to buy', row 7 of the DS-vs-positioning table), ../brand/messaging.md, ../product/claims.md §4, ../site/content-boundary.md"
  - "design-system/project/03-cast.md:7-17, 89-126 (cast ages, 'Match child to message', the photo library table) and 01-writing.md Mechanics ('Use numerals for facts'), read-only; the six pool photos (advik-01, advik-03, ira-02, kabir-03, myra-02, tara-01, -web.webp) looked at by eye; node scripts/ds-checksums.mjs: 643 files match"
  - "test/guards/banned-phrases.data.ts (all 51 patterns; each catches its planted example) and test/e2e/content-integrity.spec.ts:25-41 (UNDER_THREE, COMPETITORS, ANALYTICS, PERCENT), run over every title, meta and Copy block of the six pages: node, scratchpad script, 13 Oct 2026 10:08 PDT"
  - "src/content/en-IN/stories/articles/<slug>.ts (the six related lists); src/content/en-IN/stories/articles/index.ts:106-137 (the journal close and the keep close); src/content/en-IN/stories/hub.ts:27-38 (the screen-time band features no photo); src/layouts/ArticleTemplate/article-page.ts:50-58 (related guides show titles only)"
  - "Sibling worktrees w6-5.20b and w6-5.20c: the head photos their copy pages name, read 13 Oct 2026 (the data-law guide moves to ira-01; advik-04 stays on the talking-late guide)"
  - "Evidence: wiki/raw/qa/2026-10-14/cmo/article-fixes-5.20a/ in the main checkout (local, uncommitted, D039)"
---

# CMO review, fix pass: the six screen-time articles (task 5.20a)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This review reads the copy as
> SKM would, against the positioning. It is input only: the founder alone signs off copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)), and where a page and a decision disagree, the decision
> wins. It is a copy review before the build, so there are no screenshots, motion or Lighthouse verdicts yet.

## Verdict

**Pass: no blocking issue on any of the six.** All 17 round-1 findings were handled as asked:

- **M1 to M15 are applied correctly, word for word where the round-1 review gave the words.**
- **M1** follows source verification §1a and §1b and the P25 working default. Fold 3 now carries all four
  of Tisseron's AI markers, "no connected toys before 6" among them, with no selection. Fold 4's "For the number of
  minutes, turn to the medical bodies" is now the §1b line, and the old question-3 note about it has gone. The
  product line is dropped. Two changes of form are both right: "three to six" is written in words because the
  repo's guard refuses the numeral range, and "Tisseron's" replaces "his".
- **M3 no longer applies** under P25, and the page says so.
- **M9's optional marker is left off** because its source passage is not filed. The page says so too, which is
  what the task asked for.
- **Nothing in the changed lines** adds an unverified claim, a banned or retired phrase, a D016 or D025 breach,
  an under-3 implication, internal content or a competitor name. No title, meta, answer block, card title or
  card summary moved out of bounds. The repo's guard patterns find nothing on any page.

**M16 and M17 both took photos from the pool, but the result undoes M16.** The two Copywriters worked in
parallel, and each took a photo the other had already used:

- `advik-01-counting-carriages` now heads both the screen-time guide (ST) and the screen-free toys guide (SF).
- `tara-01-naming-feelings` now heads both the tantrums guide (TT) and the gentle-way guide (GW).

Both pairs link to each other, which is the exact repetition M16 asked to remove. Each photo again has two
different alts, and four copy pages say their photo "heads no other page". This is N1, the main finding of the
pass. The pool cannot supply five distinct photos that fit (see N1), so the main session has to rule on it.

**The most important item for Gate B is N3, on the 3-6-9-12 page (RL).** The in-text product line is gone, but
the journal close and the phone sticky bar still say "Pre-order Kheelu" and "a screen-free plush toy for ages 3
to 7". On a phone they stay on screen a few folds below "no connected toys before 6". The P25 default was meant
to prevent exactly that. I agree with the Copywriter's question 4 (b).

| Article | Verdict | Blocking | Minor |
|---|---|---|---|
| How much screen time (ST, `/stories/how-much-screen-time-for-a-3-to-6-year-old`) | **Pass** | 0 | N1 |
| The 3-6-9-12 rule (RL, `/stories/screen-time-rules-parents-swear-by`) | **Pass** | 0 | **N3**, N4, N5 |
| Screen time and tantrums (TT, `/stories/screen-time-and-tantrums`) | **Pass** | 0 | N1, N2 |
| The gentle way off the phone (GW, `/stories/the-gentle-way-off-the-phone`) | **Pass** | 0 | N1 (alt only, once TT moves) |
| Busy hands, no screens (BH, `/stories/busy-hands-no-screens`) | **Pass** | 0 | none (N1 touches its notes only if SF shares its photo) |
| Screen-free does not mean silent (SF, `/stories/screen-free-does-not-mean-silent`) | **Pass** | 0 | N1 |

## Were the asked-for fixes applied?

| Finding | Page | Asked | As applied (file:line) | Verdict |
|---|---|---|---|---|
| **M1** | RL | §1a markers in full in fold 3, with the safe-AI-toy guide link; the §1b minutes in place of "turn to the medical bodies"; the P25 default (no product line) | Fold 3 lines 128-132: the §1a ready line word for word, split after its second sentence, then the guide link. Fold 4 line 163: the §1b line. Fold 7 lines 237-239: house lines only. Note ¹ (line 255) now names the opening paragraph and "De 3 à 6 ans". New note ² (line 257) is §1a's note word for word. Markers renumbered in reading order | **Applied.** I checked each line against the excerpts (`C34-…-3-6-13-18.md:77-102, 106-107`; `C34-…-minutes-….md:37-39`). Putting the minutes in fold 4 rather than fold 5 is the right call: fold 5's heading names only the WHO, the IAP and the AAP, and §1b caveat 2 says the two numbers must never be merged. Polish: N4, N5 |
| M2 | RL | "from age two until five" | Line 161 | **Applied** |
| M3 | RL | "filling the time …" in the product line | The product line is dropped under P25 (a). The wording is kept ready in question 3 (b), lines 349-352 | **Not applicable; handled correctly** |
| M4 | ST | "For three and four year olds, the IAP adds two details …" | Line 140 | **Applied** |
| M5 | ST | Age 5: answer first | Line 156, M5's words exactly | **Applied** |
| M6 | ST | The AAP's three things to avoid, with the parenthesis | Line 221, the AAP's own sentence (`C33:63-64`) | **Applied** |
| M7 | ST, TT | Add "It is not a toy for children under 3." | ST line 268; TT line 199 | **Applied** |
| M8 | TT | "Looking for something to hand over when the screen goes dark?" | Line 199, M8's 54 words | **Applied** |
| M9 | TT | The verifier files the release passage; optional marker ² on the autoplay tip | The tip stays unmarked, and the page says why (lines 211-213, 341) | **Correctly left.** The source is not filed yet, so this is still the main session's job (see the last section) |
| M10 | TT | New meta | Line 50: 142 characters, M10's words | **Applied** |
| M11 | GW | "At meals and at playtime together, the AAP suggests …" | Line 233 | **Applied.** It now matches `C33:66-67` |
| M12 | GW | "… someone to talk to, whether that is you, a grandparent or a sibling." | Line 252 | **Applied** |
| M13 | BH | Quiet set-ups during a call; the talking ones for later; "for those stretches" | Lines 242-246 | **Applied.** "A quiet activity" for "a quiet one" is a fair change: "one" could read as a quiet stretch. The split into two paragraphs reads better on a phone |
| M14 | BH | Water painting on an old slate | Line 149; note at line 160 | **Applied** |
| M15 | BH | "stories played aloud" | Line 115; the answer is now 53 words | **Applied** |
| **M16** | ST, TT, GW, BH | Give each linked pair its own head photo; one alt per photo | ST: advik-01 (line 96). TT: tara-01 (line 93). GW: tara-01 (line 97). BH: ira-02 (line 95) | **Partly applied: see N1.** BH is fixed. ST and GW no longer share tara-04, and TT and BH no longer share ira-04. But TT and GW now share tara-01 (they link both ways), and ST now shares advik-01 with SF (they also link both ways) |
| **M17** | SF | No more 3-year-old alone at the breakfast table with the toy | advik-01 (line 100) | **The substance is applied** (a 4-year-old, no meal, no exchange with the toy in place of an adult). **But it clashes with ST: see N1** |

## Criteria, article by article (changed lines)

"Pass" means the changed lines pass. An N number is a minor fix. Unchanged lines keep their round-1 verdicts.

| # | Criterion | ST | RL | TT | GW | BH | SF |
|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice, to parents of 3 to 7 | Pass | Pass, **N3** | Pass, N2 | Pass | Pass | Pass |
| 2 | Answers the parent's real question (keyword-map row) | Pass (LRN-1) | Pass (LRN-2; the AI markers belong to the rule's own history) | Pass (LRN-4) | Pass (LRN-3) | Pass (LRN-5) | Pass (BUY-6) |
| 3 | Answer first, 40 to 60 words | Pass (54) | Pass (51) | Pass (54) | Pass (56) | Pass (53, was 55) | Pass (57) |
| 4 | One idea per section; phone-first lines | Pass | Pass, N4. Fold 3 now carries two related ideas (the 2008 markers and the 2020 set); I accept that, because the AI set is part of where the rule comes from, and a separate H2 would amplify it beyond what P25 asks | Pass | Pass | Pass (M13 split for the phone) | Pass |
| 5 | Every statistic and research statement traced | Pass (C31, C32, C33) | Pass (§1a, §1b, C31-C33; each sentence checked against its excerpt) | Pass (C35; M9 correctly unmarked) | Pass (C33:66-67) | Pass (no research line) | Pass (unchanged) |
| 6 | D016 brain wording | Pass | Pass | Pass | Pass | Pass | Pass |
| 7 | D025 speech and language | Pass (none) | Pass (none) | Pass (none) | Pass (none) | Pass ("in your home language" removed with M13; no language claim) | Pass (round-1 note 1 stands) |
| 8 | D026 markers (numbered in reading order, linked, publisher, title, year or "undated", section, URL) | Pass | Pass (¹ to ⁶ renumbered in reading order; ¹ names all three sections it now covers) | Pass | Pass | Pass | Pass |
| 9 | No banned or retired wording | Pass (0 hits) | Pass (0; "three to six" is needed: "3 to 6" trips `dead-age-ranges`) | Pass (0) | Pass (0) | Pass (0) | Pass (0) |
| 10 | Ages 3 to 7; nothing implying under 3 | Pass (M7 added) | Pass ("3 to 7" still in fold 2; "from age two until five" describes the bodies, not our audience) | Pass (M7 added) | Pass | Pass | Pass |
| 11 | No internal content; no competitor names (incl. metadata) | Pass | Pass (Tisseron's page names no brand, and nor does ours) | Pass | Pass | Pass | Pass |
| 12 | At most one product link; no pitch on a speech page | Pass (1) | Pass (0 in text), but see **N3** for the close | Pass (1) | Pass (1) | Pass (1) | Pass (1) |
| 13 | Title ≤ 60 · meta ≤ 155 | Pass (56 · 132) | Pass (56 · 142) | Pass (60 · **142**, M10) | Pass (57 · 138) | Pass (50 · 146) | Pass (51 · 149) |
| 14 | Card title and summary unchanged | Pass | Pass | Pass | Pass | Pass | Pass |
| 15 | Every fold maps to a template block | Pass | Pass (fold 3 is still an `ArticlePart` of paragraphs; fold 7 is paragraphs only) | Pass | Pass | Pass (the head becomes the 16:9 wide layout, a variant that exists) | Pass |
| 16 | Price and CTA | Pass | Pass as configured; **N3** (placement) | Pass | Pass | Pass | Pass |
| 17 | Head photo (DS cast, fit, repetition, alt) | **N1** | Pass (advik-04 kept; question 5 (a) is right while P25 (a) stands) | **N1**, N2 | **N1** | Pass | **N1** |
| – | Visual at 360 to 1440, motion, Lighthouse, ad-landing readiness | not run: no build | | | | | |

## Fixes

### N1 · ST, SF and TT, GW · two pairs of linked guides share a head photo again → main session (ruling), Copywriter (copy pages), Builder (modules, assets.md)

- **Where:**
  - `advik-01-counting-carriages` heads ST (`story-how-much-screen-time-for-a-3-to-6-year-old.md:96-101`) and SF
    (`story-screen-free-does-not-mean-silent.md:100-106`). ST's related list sends readers to SF, and SF's sends
    them to ST.
  - `tara-01-naming-feelings` heads TT (`story-screen-time-and-tantrums.md:93-99`) and GW
    (`story-the-gentle-way-off-the-phone.md:97-102`). TT's related list sends readers to GW, and GW sends them to TT
    from its related list and from a link in the text.
  - Each photo has two different alts: ST "navy-and-white striped T-shirt … red floor" against SF "navy striped
    T-shirt … red-oxide floor"; TT "sits cross-legged … touching Kheelu's nose" against GW "curly-haired … Kheelu
    in her lap, touching its nose".
  - The four pages say their photo "heads no other page" or is "on no page this guide links to" (ST:101, TT:99,
    GW:102 and 389, SF:106 and 366).
  - Evidence: `head-photos-and-links.txt`.
- **What is wrong:**
  - M16's point was that a reader who taps from one guide to a linked one meets the same picture with a
    different description. That is now true of two new pairs, so the fix does not hold.
  - tasks.md 5.20 also asks for "one alt per photo".
  - A small detail of fact: in tara-01 the finger touches Kheelu's chin, below the nose
    (`tara-01-naming-feelings-hand-detail.jpg`).
- **Why the pool cannot cover all five:**
  - The 5.20a pool has four scene photos that fit: advik-01, tara-01, ira-02, and kabir-03, which works in the 4:5
    head frame as a centred crop. That crop keeps the boy's face, the book and Kheelu
    (`kabir-03-homework-desk-4x5-centre-crop.jpg`). The tara-03 head on the hard-questions guide already shows a
    9:16 photo this way, as assets.md §1 records.
  - The other two do not fit. advik-03 is the DS's studio product cut-out, "best for" ads and marketplace
    listings, so at the head of a parenting guide it reads as an advert. myra-02 shows the 3-year-old alone, which
    every one of these pages rules out with its own line "If your child is 3, keep a grown-up nearby".
  - ST cannot take kabir-03, because the DS says not to put "the 6-year-old on the age-3 card" (`03-cast.md`, "Match
    child to message"), and ST's H1 is "Screen time for a 3-year-old".
  - Five guides need a head, so either one repeat between guides that do not link to each other, or one photo
    from outside the pool, cannot be avoided.
- **Fix (recommended):**
  1. **TT moves to `kabir-03-homework-desk-web.webp`** in the 4:5 head frame (centred crop, as tara-03). Alt:
     "A boy in round glasses and a white school shirt grins, one finger at his nose, as he writes in an exercise
     book at a wooden desk by a window, Kheelu sitting at the far end of the desk." Kabir is 6, so no grown-up is
     needed in frame. The scene reads as "switching off is followed by something ordinary", which is the page's
     own advice. Moving TT rather than GW also settles N2.
  2. **GW keeps tara-01.** Its alt becomes the one alt for this photo, with "touching its chin" for "touching its
     nose".
  3. **ST keeps advik-01**, and ST's alt becomes the one alt for this photo.
  4. **SF takes `ira-02-drawing-the-dragon-web.webp`**, shared with BH. SF and BH link to each other in neither
     direction (SF: learning toys, ST, TT; BH: GW, RL, safe AI toy). Use BH's alt word for word, in the 16:9 wide
     head. Crayons on a big sheet, with Kheelu sitting beside the child as one more thing in the room, pass SF's
     own test (a screen-free toy in use, the toy waiting rather than performing) as well as advik-01 does.
  5. **Correct the "heads no other page" notes** on ST, TT, GW, SF and BH, and update the assets.md rows.
- **Fix (alternative, main session):** widen the pool by one photo for SF, but only one that heads no guide SF
  links to and that passes M17's three tests. I found none among the unused photos with Kheelu: advik-02 shows
  the child talking to the toy, and tara-02 shows a parent holding a phone. If the founder prefers no Kheelu on
  SF (its question 1 (b)), the head would come from the `-04` set that 5.20b is spreading.

### N2 · TT · a "Feelings" photo of a calm child holding Kheelu sits at the head of the tantrums guide → Copywriter; founder (TT question 2, P20)

- **Where:** `story-screen-time-and-tantrums.md:93-99`. The DS gives tara-01's use as "Feelings ('Learning
  starts with feeling understood')" (`03-cast.md:117`).
- **What is wrong:**
  - The copy is careful: the product line claims nothing about behaviour, and question 2 asks whether to have a
    product link at all.
  - The picture does what the words avoid. A quiet child holding the toy, at the top of a page about
    meltdowns, reads as the toy settling the meltdown.
  - That makes feelings a reason to buy. The voice page rules this out (voice.md, DS-vs-positioning table row 7:
    "do not make them a selling argument"), and it borders on R5's ban on emotion claims (voice rule 11).
- **Fix:** as N1 step 1 (TT moves to kabir-03, and GW keeps tara-01). If the founder takes TT question 2 (b) (no
  product link), use a photo without Kheelu, as the page's note at line 304 already says.

### N3 · RL · the journal close and the sticky bar still pitch Kheelu beside "no connected toys before 6" → main session (template setting and route list), then Builder; founder (P25)

- **Where:**
  - At a glance, lines 56 and 58 (`close: "journal"`, sticky bar `sticky-bar`); folds 10 and the sticky bar
    (lines 295-303).
  - The close's own words (`src/content/en-IN/stories/articles/index.ts:119-123`): "A toy that asks back." and
    "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7", next to a "Pre-order Kheelu" button and the price.
  - On a phone the sticky bar is on this route's list, so it can be on screen while the parent reads fold 3
    (the Copywriter's question 4).
- **What is wrong:**
  - P25's default drops the product line "rather than pitching Kheelu beside an expert who advises against it"
    (`open-questions.md`, P25).
  - Tisseron's page criticises talking plush toys "offered from age three as an alternative to screens"
    (`C34-…-3-6-13-18.md:44-46`). The close describes exactly that, so it is a sharper pitch than the line that
    was dropped.
  - Nothing in the close is false, and the CTA is the approved one. The problem is where it sits. Under P25 (a),
    the copy fix is undone by the close and the bar.
- **Fix:**
  1. Take the Copywriter's question 4 (b): `close: "keep"` for this article ("Keep reading", "All guides for parents of
     3 to 7 year olds", which keeps "3 to 7" on the page).
  2. Take this route out of the phone sticky-bar route list, and update `sticky-bar-paths.test.ts` to match.
  3. The safe-AI-toy guide this page links to keeps its journal close, so the path to buying is one tap away for a
     parent who wants it.
  4. If the founder picks P25 (b) instead (the product line back, with a signed answer), the journal close returns
     with it.
  5. I would not show this page at Gate B under (a) without this change.

### N4 · RL · "two differences worth knowing", but only the first is named; words and numerals mixed in one sentence → Copywriter

- **Where:** fold 4, lines 161-165.
- **What is wrong:**
  - Paragraph 1 promises two differences and names one ("is stricter than the medical bodies").
  - Paragraph 2 gives Tisseron's minutes but never says this is the second difference, so a parent has to compare
    half an hour with an hour for themselves.
  - "For ages three to six, … at 3 … at 6" mixes words and numerals in one sentence. The DS says "Use numerals for
    facts" (`01-writing.md`, Mechanics).
  - In paragraph 3, "Its later markers" now follows a sentence about "Tisseron's markers".
- **Fix** (guard-checked: no hit; "stricter" is the verifier's own comparison, §1b caveat 2: "It is stricter than
  the medical bodies' ceiling of one hour from two until five"; "Between 3 and 6" passes `dead-age-ranges`, where
  "3 to 6" does not):
  - Paragraph 2: "The second is the daily limit. Between 3 and 6, Tisseron's markers set a stricter one, rising
    from half an hour at 3 to an hour at most at 6, and treat screen time as time shared with a parent.¹"
  - Paragraph 3: "The rule's later markers, at 6, 9 and 12, are about owning a device and going online.¹"

### N5 · RL · "In 2020, he added …": "he" is two paragraphs away from the name → Copywriter

- **Where:** fold 3, line 128.
- **What is wrong:** fold 3 names Serge Tisseron in paragraph 1, and paragraph 2 has no "he". On a phone,
  paragraph 3's "he" lands a screen later. The Copywriter changed "his" to "Tisseron's" in fold 4 for the same
  reason.
- **Fix (form only, as in fold 4; the rest of the §1a line unchanged):** "In 2020, Tisseron added a second set of
  markers, 3-6-13-18, for artificial intelligence.¹"

## The Copywriters' open questions: the CMO view (input only)

| Question | Recommendation | Why |
|---|---|---|
| P25 (RL, founder) | (a), **with N3** | The page stays honest and useful, and it keeps its ranking for the rule's own name. A parent weighing an AI toy goes to the guide on what to check. (a) holds only if the close and the bar stop pitching too. (b) is defensible only with a signed answer to "no connected toys before 6" for our 3-to-5-year-olds, which is the founder's and SKM's to write, not the Copywriter's |
| RL close and sticky bar | (b) | N3 |
| RL head photo | (a) keep advik-04 | No Kheelu at the head of a page that quotes "no connected toys before 6". advik-04 then heads RL and the talking-late guide only, and they do not link to each other (5.20c moves the data-law guide to ira-01) |
| TT head photo with Kheelu | Neither tara-01 nor a pool-less option: kabir-03 (N1, N2) | The meltdown page should not show a calm child holding the toy |
| Pool clash | N1 | Two pairs clash. The pool has four fitting photos for five guides |
| M9 (TT) | (a) the verifier files `C35-uw-news-2016-release.md` | Then marker ² can go on the autoplay tip. I re-read the passage in round 1 (`uw-news-2016-05-05-two-minute-warnings.txt`, line 19) |

## For the main session (not copy failures)

- **N1 needs a ruling**: either one repeat between two unlinked guides, as recommended, or one photo from outside
  the pool. Once the photos are settled, the Copywriter changes the five copy pages, and the Builder updates the
  modules and assets.md.
- **N3** changes a template setting and the shared sticky-bar route list, so it is yours, then the Builder's.
- **Still open from round 1:**
  - M9's excerpt file (the verifier).
  - C34's ready line in [source verification](../research/source-verification.md) needs "until five" (M2's
    second half; the RL page notes it at line 412).
  - The UW release's sidebar link to an AI-toy video (round-1 observation).
- **Routing:** copy N1 (pages), N2, N4, N5 → Copywriter; N1 (modules, assets.md) and N3 → Builder, after the main
  session; nothing for speed or tracking (no build yet).
- **Round 2** needs only N1's photos and alts, and the N4 and N5 lines if they are taken.

## Evidence

`wiki/raw/qa/2026-10-14/cmo/article-fixes-5.20a/` in the main checkout (local, uncommitted,
[D039](../decisions/D039-repo-and-setup-answers.md)):

- `guard-scan.txt`: title, meta, guard hits, under-3, competitor, analytics and percentage checks, and the
  product-link count per page (SHA-256 `72f8db65c01f8d4fb24cc59acc5e72bc1596ef2960b13bde308bef4f3b9cb798`).
- `head-photos-and-links.txt`: the head photo each copy page names, and each guide's related list
  (`86ad34afb8e3792b7c36667c7dee1465c6ee21f05870dcd420f57f424fbfb86f`).
- `kabir-03-homework-desk-4x5-centre-crop.jpg`: the 4:5 centred crop N1 proposes for TT
  (`a9a197026a9bb4ca33918588760be7585e7b9c2adb762ddeaef2c2469a05aca4`).
- `tara-01-naming-feelings-hand-detail.jpg`: where the finger touches, for the alt
  (`9b6c8bf91f062945fbb08ed0ce815088caa75770b856193ef40e3fabc231e310`).

There are no screenshots, because nothing is built yet. Photos were judged by eye from `design-system/project/assets/Photo
library/`, and `node scripts/ds-checksums.mjs` still reports all 643 files intact.
