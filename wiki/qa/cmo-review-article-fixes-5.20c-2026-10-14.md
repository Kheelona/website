---
title: "CMO review of the fix pass: article copy for task 5.20c (the six AI, safety and learning guides), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - "../site/pages/story-questions-parents-ask-about-ai-toys.md, story-should-kids-use-ai.md, story-ai-toys-and-indias-data-law.md, story-does-a-three-year-old-need-an-ai-tutor.md, story-what-actually-builds-a-sharp-brain.md, story-why-three-to-six-are-the-years-that-matter-most.md (Copywriters' fix pass, task 5.20c; worktree w6-5.20c, `git diff` against 25ccba5)"
  - cmo-review-articles-5.19-2026-10-14.md (rounds 1 and 2; the findings this pass applies)
  - cmo-review-articles-5.18-2026-10-14.md (M13, one alt per photo)
  - ../engineering/tasks.md (§4.9 and 5.20, lines 1162-1235; the D025 ruling at line 1181; the photo pools at 1229-1235)
  - ../engineering/assets.md (rows for ira-01, advik-04, ira-04, tara-04, myra-04, tara-03, kabir-02)
  - ../open-questions.md (P21-P25)
  - ../decisions/D015, D016, D018, D025, D026, D029, D035
  - ../research/source-verification.md (C37 house line), ../product/claims.md §4
  - "test/guards/banned-phrases.data.ts (findBanned, 51 entries, over every quoted line of the six pages and the three new alts, node 24.13.0, 2026-10-14: 0 hits); test/guards/banned-phrases.test.ts:84-90 (pages named, not counted)"
  - "Counts (python3, session scratchpad, 2026-10-14): titles, metas, answers; card title and summary of each page against `card: {` in src/content/en-IN/stories/articles/<slug>.ts"
  - "design-system/project/03-cast.md:5-16, 93-126; 02-imagery.md:57; 04-kheelu.md:13 (read-only); Photo library files ira-01, ira-04, tara-04 (-web.webp, 1208 x 1500) viewed by eye"
  - "mockup/pages/home.html:171, mockup/pages/ai-toys-for-kids-in-india.html:101, src/content/en-IN/pages/home.ts:181 (the ira-01 alt); src/content/en-IN/stories/articles/*.ts `related` lists"
  - "Parallel fix passes read for overlaps only: worktrees w6-5.20a and w6-5.20b (story-how-children-learn-by-talking.md:381, 389-391; story-raising-a-bilingual-child-in-india.md:396; story-screen-time-rules-parents-swear-by.md:95)"
---

# CMO review of the fix pass: article copy for task 5.20c

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This review covers the fixes to
> the six guides the CMO approved in round 2 of the [5.19 review](cmo-review-articles-5.19-2026-10-14.md). It is a
> copy review before the build, so there are no screenshots, motion or Lighthouse results yet. It is input only:
> the founder alone signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)).

## Verdict

**PASS. Nothing blocks.** Both copy fixes the review asked for are applied word for word, and no other Copy line
moved. The findings that need the founder or counsel are left as they are and are labelled that way on each page.
The fix pass also made three changes the review did not ask for. Two are alt texts, each made the journal's one alt
for its photo. The third is the data-law guide's head photo. All three are sound. The three new items below are
minor, and two of them are notes-only.

| Article | Verdict | Blocking | Minor (this pass) |
|---|---|---|---|
| [The hard questions parents ask about AI toys](../site/pages/story-questions-parents-ask-about-ai-toys.md) | **PASS** (no Copy change) | none | none |
| [Should kids use AI?](../site/pages/story-should-kids-use-ai.md) | **PASS** (R2-1 applied) | none | F2 (notes only) |
| [What India's data law asks of a toy that listens](../site/pages/story-ai-toys-and-indias-data-law.md) | **PASS** (head photo moved; no Copy change) | none | F3 (question 6 wording) |
| [Does a three-year-old need an AI tutor?](../site/pages/story-does-a-three-year-old-need-an-ai-tutor.md) | **PASS** (R2-2 applied) | none | none |
| [What actually builds a sharp brain](../site/pages/story-what-actually-builds-a-sharp-brain.md) | **PASS** (alt only) | none | none |
| [Why the early years matter most](../site/pages/story-why-three-to-six-are-the-years-that-matter-most.md) | **PASS** (alt only) | none | F1 (notes only; the merge) |

## What the pass was asked to do, and what it did

| Item | Page | Status | Check |
|---|---|---|---|
| **R2-1** | Should kids `:114` | **Applied, word for word** | "If you choose AI for your child's play, it should be built for their age, unable to browse the internet and fully visible to you." The answer is now 59 words, markers excluded. The choice stays with the parent, as in the B3 answer in fold 8. The C37 house line's opening is our own voice, so there is no new research statement (`source-verification.md` C37, "House line"). |
| **R2-2** | AI tutor `:256` | **Applied, word for word** | "built around the list above". The pointer to the safe-AI-toy guide stays between the checklist and the product line, so the groups' advice still comes first. It adds one word and no claim. |
| **R2-3** | AI tutor, sharp brain, early years, should kids | **Ruled, no change (correct)** | `tasks.md:1181`: "D025 reading: as written … the AI and brain guides need none". No changed line touches speech or language. |
| **M13** | Guard | **Closed by the main session** | `banned-phrases.test.ts:84-90` now names the 15 site pages and one `story-<slug>.md` per `ARTICLE_SLUGS` entry, instead of counting files. |
| **M3** (rest) | Data law | **Held for counsel and the founder (P23), correctly** | No consent, tracking or compliance line was added. The optional line "We will add our own answers …" is not in the Copy. Fold 5's restatement and "May 2027" wait on counsel and a re-read of the Gazette. |
| **M8** and the cut questions | Hard questions | **Held for the founder (P22), correctly** | No "Save voice recordings", shutdown or training line in any Copy block (grep of quoted lines). |
| **B3 short forms** | Hard questions fold 4; should kids answer, fold 5, fold 8 | **Held (P21), correctly** | Unchanged. They follow whatever the founder signs for B3. |
| **M11, applied again** | Data law, fold 1 | **Done; CMO agrees with option (a)** | See "The data-law head photo" below. |
| Already done in round 2 | all | **Confirmed** | B1, M1, M12 (should kids); M2, M4 and M3's cut line (data law); M9, M11 (hard questions); M5, M6, M7 (AI tutor); M10 (early years). Each copy page lists them in its "Changes after approval", and each is still in place. |
| Task 5.20 item 2, one alt per photo (not in the 5.19 review) | Sharp brain `:103-104`; early years `:104-105` | **Approved** | The `ira-04` and `tara-04` alts are now the journal's one alt for each photo. They match word for word `how-to-get-your-child-talking.ts:37` and `how-children-learn-by-talking.ts:36`, and 5.20b's bilingual guide (`:396`). Checked by eye against the files: the laughing girl, the long braid, the paper crown held on her head, the low table with crayons and scraps; the curly hair, the coral kurta, the window seat, reading aloud with one finger on the page. Both are accurate, with no Kheelu, no claim and no banned word. |

## How this was checked

- **Diff:** `git diff` in the worktree. Exactly **two quoted (Copy) lines changed** across the six pages, the R2-1 and
  R2-2 sentences. Every other change is in notes, alts, the Sources tables, front matter and the new "Changes after
  approval" sections.
- **Guard:** `findBanned` (51 entries) over every quoted line of the six pages, plus the three new alts and the two
  changed sentences: **0 hits.** A manual sweep of the changed lines found none of these: bare "safe" about Kheelu,
  "tutor" for Kheelu, brain words near Kheelu, under-3 wording, competitor or tested-toy names, survey figures, unit
  counts, "18 months" or "sessions" (the SPA 7 words).
- **Counts:** none of the titles or metas changed.

| Article | Title | Meta | Answer |
|---|---|---|---|
| Hard questions | 59 | 145 | 57 |
| Should kids | 47 | 147 | **59** (was 60) |
| Data law | 58 | 142 | 59 |
| AI tutor | 46 | 136 | 59 |
| Sharp brain | 49 | 144 | 58 |
| Early years | 57 | 151 | 56 |

- **Cards:** the H1 and lead of each page match `card.title` and `card.summary` in its module word for word (curly
  apostrophes and the `{hand:…}` accent aside), on all six.
- **Links:** one in-text `/products/kheelu` link per page in the Copy blocks, unchanged. The close blocks were not
  touched.
- **Modules:** not yet updated (`should-kids-use-ai.ts:45` still has "If AI is part …"; `does-a-three-year-old-need-an-ai-tutor.ts:131`
  still has "this list"; `ai-toys-and-indias-data-law.ts` still imports `advik-04`). That is right for this stage: each
  page's "For the builder" note asks for the module change in the same commit.

## Pass/fail by criterion (every changed line)

| # | Criterion | Hard questions | Should kids | Data law | AI tutor | Sharp brain | Early years |
|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice | PASS | PASS (R2-1 leaves the choice to the parent) | PASS | PASS | PASS | PASS |
| 2 | Parents of 3 to 7; the row's real question (LRN-16, -14, -17, -15, -12, -13) | PASS | PASS | PASS (M3 held) | PASS | PASS | PASS |
| 3 | Answer first, 40 to 60 words | PASS (57) | PASS (59) | PASS (59) | PASS (59) | PASS (58) | PASS (56) |
| 4 | One idea per section, phone-first lines | PASS | PASS | PASS | PASS (R2-2 fixes the phone reading) | PASS | PASS |
| 5 | Every statistic or research statement traced | PASS (none changed) | PASS (the changed clause is the C37 house line, our own voice) | PASS (none changed) | PASS (no claim) | PASS | PASS |
| 6 | D016 brain wording | n/a | PASS | n/a (no brain line; the new photo sits next to no brain line) | PASS | PASS (head still without Kheelu) | PASS (head still without Kheelu) |
| 7 | D025 speech and language | PASS (ruled) | PASS (ruled) | n/a | PASS (ruled) | PASS (ruled) | PASS (ruled) |
| 8 | D026 markers | PASS | PASS (¹ kept) | PASS | PASS | PASS | PASS |
| 9 | No banned or retired wording | PASS | PASS | PASS | PASS | PASS | PASS |
| 10 | Ages 3 to 7; nothing implies under 3 | PASS | PASS | PASS (Ira is 5, `03-cast.md:11`) | PASS | PASS | PASS |
| 11 | No internal content, no competitor names | PASS | PASS | PASS (question 6 is in the notes, not the Copy) | PASS | PASS | PASS |
| 12 | One product link, no pitch; close, price and `cta` as approved | PASS | PASS | PASS | PASS | PASS | PASS |
| 13 | Title ≤ 60, meta ≤ 155 | PASS | PASS | PASS | PASS | PASS | PASS |
| 14 | Card title and summary unchanged | PASS | PASS | PASS | PASS | PASS | PASS |
| 15 | Every fold maps to an Article block | PASS | PASS | PASS (`ArticleHead` takes the 4:5 photo in its portrait layout) | PASS | PASS | PASS |
| 16 | One obvious next step | PASS | PASS | PASS | PASS | PASS | PASS |
| 17 | Visual, motion, Lighthouse, ad-landing readiness | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET |

## The data-law head photo (M11 applied again; the page's question 6)

The move from `advik-04` to `ira-01-story-on-the-bed` is right, and **the CMO's input is option (a) for beta.**

- **The photo, checked by eye** (1208 × 1500, 4:5, shown whole with no crop). Ira, who is 5 (`03-cast.md:11`), laughs as she tells
  Kheelu a story with open hands, in daylight. Kheelu's belly unit shows the grey grille and no lit ring, so the photo
  does not read as the toy listening. The alt is the approved one from `home.html:171` and
  `ai-toys-for-kids-in-india.html:101`, word for word, so the photo still has one alt, and the alt does not describe
  the light (D018). The Imagination layer is not used, so the photo stays plain, as `02-imagery.md:57` asks for
  safety pages.
- **A stronger reason than the page gives.** The data-law guide and the 3-6-9-12 guide list each other in `related`
  (`ai-toys-and-indias-data-law.ts` and `screen-time-rules-parents-swear-by.ts:25`). The 3-6-9-12 guide still opens
  on `advik-04` (`story-screen-time-rules-parents-swear-by.md:95`, unchanged in w6-5.20a so far). Under `advik-04`, a
  parent who tapped between the two guides landed on the same picture, the repeat that 5.17 M16 and 5.18 M13 set out
  to remove. Option (b) would bring it back. See F3.
- **The pick from the pool holds.** `ira-03` (the speaker ring glows at dusk), `kabir-01` (the dark wall for the
  Imagination layer's chalk) and `myra-03` (a 3-year-old alone at bedtime) are each worse on this page. No guide uses
  `ira-01` as a head in any of the three worktrees. It is Home fold 4's photo and the buyer's guide's FAQ photo, and
  neither of those pages links here.
- **For the founder's eye.** With Kheelu beside the H1 "What India's data law asks of a toy that listens", a careful
  parent will read the page as "and does Kheelu meet it?". Fold 9 answers with confirmed facts only, makes no
  compliance claim, and leaves consent and tracking unanswered (P23). The photo makes no claim, but it makes that gap
  easier to see. The founder should weigh question 6 together with P23's optional line ("We will add our own answers
  to the first and third questions here before Kheelu ships."). If he does not sign that line, option (c), a DS scene
  without Kheelu (P24), is the cleaner long-term answer.

## Minor findings

| # | Article, criterion | File:line | What is wrong | Fix | Route |
|---|---|---|---|---|---|
| F1 | Early years, page accuracy (notes only; no Copy) | `story-why-three-to-six-are-the-years-that-matter-most.md:108-116`, `:409-412` | Written against the base, these notes will be wrong once 5.20b merges. 5.20b moves how children learn by talking from `tara-04` to `kabir-04` (w6-5.20b `story-how-children-learn-by-talking.md:381`). That ends the two-way repeat that the "Open, for the main session" paragraph raises. The fold 1 note (":109-112", "it also heads two talking guides … how children learn by talking") becomes untrue, and so does the alt's source (":113-114", "word for word as on the how-children-learn-by-talking guide"). The same alt stays on 5.20b's bilingual guide (`:396`). 5.20b's own note (`:389-391`) offers to move back to `tara-04` "if task 5.20c moves" this page. This page does not move, and should not. | At the merge, keep `tara-04` here (a brain guide keeps a head without Kheelu, D016) and keep 5.20b's `kabir-04` on how children learn by talking. Replace `:108-112` with: "Round 2 (CMO M11): `tara-04` heads this page alone among task 5.19's guides. After tasks 5.20a and 5.20b it heads this page and raising a bilingual child, which do not link to each other." In `:113-114`, name "the raising-a-bilingual-child guide" as the alt's source. Mark the `:409` paragraph "Closed by task 5.20b (how children learn by talking moved to `kabir-04`)". Delete 5.20b's `:389-391` offer. | Main session at the merge; Copywriter |
| F2 | Should kids, page accuracy (notes only; no Copy) | `story-should-kids-use-ai.md:460-462` | The note keeps `kabir-02` partly because the pool "has no grown-up in frame for a page that advises one nearby at 3". `kabir-02` has no grown-up either: Kabir, who is 6, is alone with Kheelu (`03-cast.md:13, 123`; only Tara's photos have a parent, `:50`). The real reason, given first, is enough. | "**Not changed:** the head photo, `kabir-02`, which heads no other guide and is used nowhere else on the site, so it keeps its one alt and M11's repeat does not arise. Kabir is 6, so a child alone with Kheelu suits the page." | Copywriter |
| F3 | Data law, question 6 for the founder (notes only) | `story-ai-toys-and-indias-data-law.md:415-421` (also `:103-112`) | Option (b) leaves out its biggest cost. This page and the 3-6-9-12 guide list each other, and that guide opens on `advik-04`, so (b) brings back the "tap a related guide, see the same picture" repeat. The founder should see this when he chooses. | In option (b), after "(no Kheelu),", add: "which the 3-6-9-12 guide, linked from this page and linking here, also opens on, so a parent moving between the two sees the same picture,". Add the same clause to the `:103-112` note. | Copywriter |

## The Copywriters' open questions: CMO input (the founder decides)

- **Data law, question 6 (head photo):** **(a)** for beta, with F3's addition. Weigh it with P23 (above). **(c)**
  when a DS scene without Kheelu exists (P24).
- **Hard questions, questions 4 and 5 (P22):** unchanged from round 2. **(b)** once the founder answers: the
  switch's setting at first setup, how long saved recordings are kept, whether the switch bears on training (D035),
  and a confirmed one-line shutdown answer. Until then, **(a)**.
- **Data law, questions 3-5 (P23):** unchanged. **(a)** for beta, then **(b)** before production. The optional line
  goes in only with the founder's signature. Counsel reads fold 5's restatement, and the Gazette is re-read for
  "May 2027" before Gate B.
- **B3 short forms (P21):** **(a)**. Both pages follow whatever the founder signs for B3. Common Sense Media three
  times on the should-kids page remains deliberate (round 2, "For the founder's eye").
- **P25 (Tisseron's AI markers)** touches none of these six Copy blocks. The data-law guide shows only the 3-6-9-12
  guide's related-card title (`:317`).

## For the builder (from the copy pages; no CMO change)

- `should-kids-use-ai.ts`: the answer's third sentence as `story-should-kids-use-ai.md:114`.
- `does-a-three-year-old-need-an-ai-tutor.ts:131`: "built around the list above".
- `ai-toys-and-indias-data-law.ts`: import `ira-01-story-on-the-bed-web.webp` and the alt as `:98-99`. `ArticleHead`
  switches to the portrait layout.
- `what-actually-builds-a-sharp-brain.ts` and `why-three-to-six-are-the-years-that-matter-most.ts`: the new alts.
- `assets.md`: the ira-01 row adds A (the data-law head). The advik-04 row drops "the data law" and "16:9 on the
  data-law head". The ira-04 and tara-04 rows drop "one alt per photo … wait on the copy-fix pass" once all three
  passes merge.
- `updated` stays 2026-10-13 in all six modules.

## Still not checked

Screenshots at 360, 390, 412, 1366 and 1440 px, motion, Lighthouse and ad-landing readiness need the built pages.
They come at the 5.20c build checkpoint. The data-law head should then be checked as rendered: the 4:5 portrait
layout beside the H1, LCP, and Kheelu's unlit ring at 360 px. None of these guides is an ad destination.
