---
title: "CMO review, round 1: copy fixes of task 7.1b (D056 items 2 and 4; CMO A M4-M6, M8; B m1)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md (items 2 and 4)
  - ../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (item 5, the refund reaches the parent within 7 working days, bank time included)
  - ../decisions/D041-gate-a-round-1.md (line 33, "with a grown-up nearby" in age and safety answers)
  - ../decisions/D053-remove-the-3-6-9-12-article.md
  - ../decisions/D015-founder-signs-off-copy.md
  - cmo-review-built-a-2026-10-14.md (B2, M4, M5, M6, M8)
  - cmo-review-built-b-2026-10-14.md (m1, m2)
  - ../site/pages/meet-kheelu.md, safety.md, setup.md, stories.md, home.md, terms.md (worktree w8-7.1b, diff against fdb7580)
  - ../site/pages/refund.md (lines 111, 188, 257: the refund timing after a return)
  - ../site/pages/home.md line 220 (the founder, 2026-10-11, "Not every film was shot at home")
  - "src/content/en-IN/faqs.ts:41, 54, 86, 125, 151, 174; src/content/en-IN/pages/setup.ts:101; src/app/llms.txt/route.ts:42-53; test/guards/answer-length.test.ts (40-60 words, read 2026-10-14)"
  - mockup/home.html:187, mockup/pages/meet-kheelu.html:362 (the approved Harvard sources lines)
---

# CMO review, round 1: copy fixes of task 7.1b

**Verdict: PASS. No blocking issue; 5 minor.** Each fix was applied to the line it names, and only that line. No
copy line changed outside the fix list. No new or inflated claim, no age claim below 3, and no banned wording. The
refund timing on Home and `/terms` now matches `/refund` step 3 word for word.

The one real gap is M8. The age-3 advice is still worded two ways inside this task: Home says "If your child is 3,
keep a grown-up nearby.", while `/safety` and `/setup` add "while they play". The two FAQ answers this task did not
assign, the product page's and the buyer's guide's, keep their old wordings, so M8 is not closed. Below I pick the
one wording, with the word counts behind it.

This is a copy review: there is no built page, so no screenshots. The founder signs every line here off
([D015](../decisions/D015-founder-signs-off-copy.md)). This review does not replace that sign-off.

## What changed (every changed copy line; diff of the six pages against `fdb7580`)

| Page | Line | Before (approved) | After | Asked for by |
|---|---|---|---|---|
| meet-kheelu | 191, fold 2 H2 | Seven families, in their *own homes.* | Real families, in their *own homes.* | D056 item 2 (A B2) |
| meet-kheelu | 627, FAQ sources | …(Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. | …(Key Concepts). (URL unchanged) | A M6 |
| safety | 321, FAQ 1 | If your child is 3, we advise play with a grown-up nearby. … Its advice in full, and our answer, follow below. | If your child is 3, keep a grown-up nearby while they play. … Its advice in full, and our answer, are in the next question. | A M8; A M4 |
| safety | 333, FAQ 2 bullet | **At 3:** we advise play with a grown-up nearby. | **At 3:** keep a grown-up nearby while they play. | A M8 |
| setup | 195, fold 4 | …keep a grown-up nearby while they talk. | …keep a grown-up nearby while they play. | A M8 |
| stories | 115, fold 2 lead | How much, which rules hold up, and what to do when the screen goes off. | How much, what the guidelines say, and what to do when the screen goes off. | A M5, B m1 |
| home | 766, FAQ "What ages" | For 3-year-olds, we advise having a grown-up nearby. | If your child is 3, keep a grown-up nearby. | A M8 |
| home | 772, FAQ "not right for us" | …your refund is processed within 7 working days. | …your refund reaches you within 7 working days. | D056 item 4 |
| terms | 338-339, section 8 | …your refund is processed within 7 working days. | …your refund reaches you within 7 working days. | D056 item 4 |

Everything else in the diffs is notes, source rows, front matter, questions and the "Changes after approval (task
7.1b)" section that each page now has. B m2 (the empty cell on laptops) is a Builder fix with no copy, and no
page touched it.

## Verdict per page and criterion

Criteria: **1** does exactly what D056 or the finding asks, no more · **2** no new or inflated claim · **3** the
age-3 wording is one, plain and true (3 to 7; not for under 3) · **4** the refund timing matches `/refund` · **5** the films
heading claims no count · **6** every unchanged line is the approved line · **7** no banned wording · **8** it
serves a parent of a 3-7 year old (positioning, one next step, mobile).

| Page | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| meet-kheelu | PASS | PASS (minor 3: "own homes") | n/a here (minor 2: FAQ 3 not yet changed) | n/a (no refund timing on the page) | PASS | PASS | PASS | PASS |
| safety | PASS | PASS | **FAIL, minor 1** (second wording) | n/a | n/a | PASS | PASS | PASS |
| setup | PASS | PASS | **FAIL, minor 1** (second wording) | n/a | n/a | PASS | PASS | PASS |
| stories | PASS | PASS | n/a | n/a | n/a | PASS | PASS | PASS |
| home | PASS | PASS | PASS (the one wording, below) | PASS | n/a | PASS (minor 5: a record drift that predates this task) | PASS | PASS |
| terms | PASS | PASS | n/a this task (minor 4: section 9) | PASS | n/a | PASS | PASS | PASS |

### Notes per page

- **meet-kheelu.** The H2 now claims no count, as D056 item 2 asks, and the Hand accent stays on "own homes." The
  sources line is now word for word the approved Home form (`mockup/home.html:187`, `home.ts:157`), and the dropped locator
  still sits in source verification. The page says nothing about refund timing, so D056 item 4 has nothing to align
  here; the copywriter checked that, and so did I (no "working days" in any Copy block).
- **safety.** On M4 (the CMO decides): I pick **option (a), the copy fix**, as applied. "Its advice in full, and
  our answer, are in the next question." tells a parent where the answer is. It is also true in the JSON-LD, where
  `age-three` is followed directly by `child-safety-groups` (`safety.ts:171`). It keeps the DS's first-item-open
  pattern and keeps the fold short on a phone. Opening both items would add the whole second answer (five bullets,
  two sources) to the phone fold, for no gain the copy fix does not already give. Not a claim; the founder signs it.
- **setup.** The line moves from "while they talk" to "while they play". That fixes the oddest of the five wordings,
  but the result is not Home's sentence (minor 1).
- **stories.** These are the reviews' own words. "What the guidelines say" is kept by guide 1, whose card reads
  "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age" (stories.md line 123). Still 15
  words. No copy page repeats the old line; only `src/content/en-IN/stories/topics.ts:18` (the builder's) and the
  frozen mockups do.
- **home.** The refund sentence is `/refund` step 3's (`refund.md:188`), apart from the approved "it", and the
  promise is D055 item 5's: money in hand within 7 working days, bank time included. That is a stronger risk reversal,
  and it is sourced, not inflated. The age sentence is plain, keeps "It is not a toy for children under 3." just before it, and
  drops "we advise". Both answers are inside 40-60 words (58 and 55). Both FAQs feed `llms.txt` (`what-ages`,
  `not-right-for-us`, `route.ts:42-53`), so its hash changes at the merge; home.md says so.
- **terms.** Section 8 now matches `/refund` step 3 word for word, with the same word count. Section 6's cancellation
  line is a different case and already matches `/refund`. Leaving section 9 alone was right, because no fix names
  `/terms` (minor 4).

## M8: the one wording (the CMO's pick)

**"If your child is 3, keep a grown-up nearby."** Under a "At 3:" lead: **"keep a grown-up nearby."**

It is the only sentence that fits every FAQ answer M8 names without changing any other approved word. The longer
form I offered as an example in review A breaks the 60-word guard (`test/guards/answer-length.test.ts`; counted
with the guard's rules):

| Answer (M8's list) | With the 9-word sentence | With "…while they play." (12 words) |
|---|---|---|
| Home, `faqs.ts:41` | 58 | 61 (over) |
| Product, `faqs.ts:86` | 59 | 62 (over) |
| `/safety` FAQ 1, `faqs.ts:125` (with M4) | 50 | 53 |
| Buyer's guide, `faqs.ts:174` | 58 | 61 (over) |

Fitting the long form would mean trimming other approved words in three answers ("When you set it up" and the like). No finding asked
for that. The short sentence is the long one's opening, it keeps D041's advice ("with a grown-up nearby"), and it says nothing new.
Every journal guide's closing line begins with the same nine words and adds "while they play"
(for example `story-should-kids-use-ai.md:279`). That is the same sentence with an added clause, outside M8's list,
and it can stay or be trimmed later (group B, main session).

## Issues and fixes

| # | Severity | Page, criterion | What is wrong (file:line) | Fix | Route |
|---|---|---|---|---|---|
| 1 | minor | safety, setup · 3 (one wording) | `safety.md:321` "If your child is 3, keep a grown-up nearby while they play.", `safety.md:333` "**At 3:** keep a grown-up nearby while they play." and `setup.md:195` "…keep a grown-up nearby while they play." differ from Home's `home.md:766` "If your child is 3, keep a grown-up nearby.": two wordings, and M8 asks for one | `safety.md:321`: "If your child is 3, keep a grown-up nearby." (FAQ 1 goes back to 50 words). `safety.md:333`: "**At 3:** keep a grown-up nearby." `setup.md:195`: "Kheelu is made for children aged 3 to 7. If your child is 3, keep a grown-up nearby." Then update the notes: safety line 341-342 ("Word counts: 50 · …; M8 takes three words out, M4 adds three"), the keyword row at line 463, the source row at line 378, the fold 7 M8 note and its Changes section; setup's fold 4 note, source row and Changes section (three words fewer, still about 460). Builder: `faqs.ts:125`, `:151`, `pages/setup.ts:101`, `FaqSection.stories.tsx:49, :63` | Copywriter, then Builder |
| 2 | minor | meet-kheelu (and the buyer's guide) · M8 not applied to all the answers it names | M8 names `faqs.ts:86` and `:174`, but their copy pages are unchanged: `meet-kheelu.md:609` "At 3, play with a grown-up nearby." and `ai-toys-for-kids-in-india.md:257` "At 3, we advise play with a grown-up nearby." (the "we advise play" M8 says never to use). Question 9's "57 to 61 words" is 62 by the guard's count | `meet-kheelu.md:609`: "If your child is 3, keep a grown-up nearby." (57 → 59 words; no other word changes, so question 9's options (a)-(c) are not needed: mark it answered by this review). `ai-toys-for-kids-in-india.md:257`: "If your child is 3, keep a grown-up nearby." (58 words, unchanged count). Add a "Changes after approval (task 7.1b)" entry on each, citing CMO A M8. Builder: `faqs.ts:86`, `:174` (neither is in `llms.txt`) | Main session assigns; Copywriter, then Builder |
| 3 | minor | meet-kheelu · 2 (true) | `meet-kheelu.md:188-190`: eyebrow "Real homes", H2 "Real families, in their *own homes.*" D056's words, applied correctly, and they state no count. But the founder said on 2026-10-11 "Not every film was shot at home" (`home.md:220`), which is why Home's lede became "Real children, real families." The words are not new (Gate A, then D056, the latest decision), so this does not block. My B2 fix offered them and missed the conflict | Put meet-kheelu question 8 to the founder before Gate B. CMO recommendation: option (b), H2 "Real children, *real families.*" (Hand on "real families."; Home's approved words) and eyebrow "Seven films" (D040). Apply it only on the founder's answer; until then, D056 stands | Main session to the founder; then Copywriter and Builder |
| 4 | minor | terms · 3 (one wording across the site) | `terms.md:368-369` section 9, "For 3-year-olds, we advise having a grown-up nearby.", was Home's answer verbatim and is now a third wording. Correctly left alone, because no fix names `/terms` | The founder takes terms question 8, option (b), with the one wording: "If your child is 3, keep a grown-up nearby." Then `legal/terms.ts` follows | Main session to the founder; Copywriter, then Builder |
| 5 | minor | home · 6 (the record matches the approved copy) | `home.md:496` still prints the long Harvard sources form, while the approved mockup (`mockup/home.html:187`) and the build (`home.ts:157`) show the short one, which meet-kheelu now cites as "Home's short form". This predates task 7.1b; nothing on the page changes | `home.md:496`: "¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts). https://developingchild.harvard.edu/key-concept/serve-and-return/" (corrects the record to the approved mockup; no copy change) | Copywriter |

## For the main session (no fix needed in the copy)

- **Founder sign-off ([D015](../decisions/D015-founder-signs-off-copy.md)):** M4 (option a), M5/m1, M6 and M8 (the
  one wording above) are copy changes to approved lines. D056 items 2 and 4 are already the founder's. Questions for
  him: meet-kheelu 8 (films) and terms 8 (section 9). Safety question 4 is answered here (option a), subject to his sign-off.
- **Deviation rows** (text parity against the frozen mockups): `meet-kheelu` (`mockup/pages/meet-kheelu.html:36,
  :362`), `safety` (`mockup/safety.html:173, :183`), `setup` (`mockup/setup.html:92`), `stories` and `home`
  (`mockup/pages/stories.html:34`, `mockup/pages/home.html:315`; V9 extension, as in review B), `home` FAQ (age,
  refund) and `terms` (section 8). Each page lists its rows.
- **Builder carries** what each page's "For the builder" note lists, including `stories/topics.ts:18` (it feeds Home's card
  too) and `faqs.ts:54` and `legal/terms.ts:267` (refund). `llms.txt` is re-pinned: `what-ages`, `not-right-for-us`
  and the screen-time lead change it.
- **Journal guides:** they carry the one wording plus "while they play". That can stay, or be trimmed in a group B
  batch.
