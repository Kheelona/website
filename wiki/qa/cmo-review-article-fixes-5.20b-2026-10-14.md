---
title: "CMO review, fix pass: task 5.20b article copy fixes (talking and language, six guides), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - ../site/pages/story-talking-late-or-talking-little.md, story-how-to-get-your-child-talking.md, story-how-children-learn-by-talking.md, story-how-children-collect-words.md, story-raising-a-bilingual-child-in-india.md, story-a-toy-that-talks-vs-a-toy-that-listens.md (task 5.20b fixes, uncommitted in the w6-5.20b worktree; read in full and as `git diff` against 25ccba5)
  - cmo-review-articles-5.18-2026-10-14.md (round 1; the fixes asked for, M1-M14)
  - ../research/source-verification-2026-10-14.md (§2 the sentence item and its ready lines, §3 the Zubler Table 4 cross-check)
  - "../raw/research/sources/: C42-cdc-milestones-4-years.md, C42-zubler-2022-table-4-cross-check.md, C42-cdc-milestones-30-months-and-3-years.md, C09-romeo-2018-psychological-science.md"
  - ../site/pages/story-talking-toys-and-late-talkers.md (the approved speech model; overlap), ../site/pages/stories.md (fold 3 cards and card 1 image)
  - ../brand/positioning.md, messaging.md, voice.md, audience.md; ../site/content-boundary.md; ../product/claims.md (§1, §4, §8)
  - ../research/keyword-map.md (§2.2 BUY-9, §2.3 LRN-6, LRN-7, LRN-9 to LRN-11, §4.3, §5)
  - ../engineering/tasks.md (5.20 items 1-3 and the photo-pool note)
  - "src/content/en-IN/stories/articles/*.ts (every guide's head photo, alt and related list), src/content/en-IN/stories/hub.ts (topic groups), src/layouts/ArticleTemplate/ (the keep close prints titles only), src/components/sections/ArticleHead/ArticleHead.tsx (portrait or wide from the photo's ratio)"
  - "design-system/project/03-cast.md:85-125 and design-system/site/thumbs/assets/Photo library/{advik,ira,kabir,myra,tara}-04-*-web.webp (read-only; the four photos with new or moved alts checked by eye)"
  - "Checks run 2026-10-14 in the worktree: findBanned() over every Copy block of the six pages (0 hits); content-integrity's UNDER_THREE and COMPETITORS regexes plus analytics and internal words (0 hits); percentages (0); answer and paragraph word counts (markers excluded); title and meta lengths; D025 line verbatim on all six; card, title, meta and H1 rows untouched in the diff; node scripts/ds-checksums.mjs (643 files intact)"
---

# CMO review, fix pass: talking and language articles (task 5.20b)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This checks that the round-1 fixes
> ([CMO review 5.18](cmo-review-articles-5.18-2026-10-14.md)) landed as asked and that nothing else got worse. It is
> input only: the founder alone signs off copy, on beta at Gate B ([D015](../decisions/D015-founder-signs-off-copy.md)).
> Copy stage: there is no built page, so there are no screenshots (nothing saved under `raw/qa/2026-10-14/cmo/` for
> this pass); the visual, motion, Lighthouse and ad-landing checks wait for the build.

## Verdict

**Pass. No blocking issue.** Every fix asked for is applied, word for word where the review gave words. The one
departure (the serve-and-return guide's photo) follows M13's own rule better than M13's letter did, and I agree with
it. Two minor fixes remain (F1, F2). Neither needs another CMO round.

| Article (copy page) | Fixes asked | Applied | Verdict | Minor fixes now |
|---|---|---|---|---|
| `/stories/talking-late-or-talking-little` (TL) | M1, M2, M3, M4, M13 | All | **Pass** | F1 (optional) |
| `/stories/how-to-get-your-child-talking` (GT) | M5, M13 | All | **Pass** | none |
| `/stories/how-children-learn-by-talking` (LT) | M7, M13 | All (M13 differently, see below) | **Pass** | none |
| `/stories/how-children-collect-words` (CW) | M8, M9, M13 | All | **Pass** | none |
| `/stories/raising-a-bilingual-child-in-india` (BI) | M13 (alt) | All | **Pass** | F2 (notes only) |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` (TT) | M12, M13 | All | **Pass** | none |

M6 and M10 stay with the main session, as the task says. BI L160 ("Most of the studies it draws on were done in North
America and Europe.³") is therefore unchanged and still traced to the verifier's note only, so M10 still applies
before Gate B.

## Each fix, checked

| Fix | Page and line | What landed | Check |
|---|---|---|---|
| M1 | TL L164 | "At a birthday party, another child is narrating a whole film, and yours points and says "come". Is that fine? Or is it something?" | The review's wording, word for word. 24 words; who is who is clear on one read |
| M2, answer | TL L133 | Opens "Sentences of four or more words are on the CDC's list of milestones by 4, not 3.¹" | The §2 ready line word for word, with its note. 60 words (markers out). Answers the H2's own word first. Never says a 3-year-old should talk in sentences or that most do (§2 caveat 1), and gives no figure (§2 caveat 2). The cut "Use milestones as a reason to ask, not to worry." costs no calm: the first sentence itself says "not 3" |
| M2, fold 6 | TL L229 | "- by 4, your child doesn't yet say sentences of four or more words;¹" | The §2 bullet word for word, framed by 4. Fits the "Talk to your child's doctor if:" list. The CDC 4-year page's own "act early" covers it (`C42-cdc-milestones-4-years.md:33-35`) |
| M2, note | TL L297 | New note ¹ (CDC, milestones by 4 years) | The §2 note word for word. Old ¹-⁷ became ²-⁸ with their text unchanged. Every marker in folds 2 and 4-7 was checked against the new numbering. New numbers first appear in reading order (D026) |
| M3 (1) | TL L74-83 | The overlap note now says the medical wording is deliberately the same | Accurate. Four of fold 6's six signs match the approved page's four, word for word. "These are US guides …" and "If your gut says ask, ask" match too. The seven tips are the same habits with the same seven icons (`talking-toys-and-late-talkers.ts:109-115`, `talking-late-or-talking-little.ts:125-131`; the order differs and the note does not claim it) |
| M3 (2) | TL L276 | "For more on what helps a child who talks later or less than others, read [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers)." | The review's wording, word for word. An article link, not a product link (B5). The anchor is the H1 of the guide that owns "late talker", so it helps that guide rank and does not compete with it (keyword map §4.3) |
| M4 | TL L145-151, L316-324, L411 | The Zubler Table 4 cross-check is recorded at 30 months. "with one action word" is not added to the answer because the answer paraphrases the item; fold 6 L226 quotes it exactly | Correct reading of §3, which says both lines "stand as written". Cited lines are right: `C42-zubler-2022-table-4-cross-check.md:32, 58-62` and `C42-cdc-milestones-4-years.md:46-50` (the plain re-read of the 30-month item). Adding TL to source verification §7 is the main session's job, and it is flagged |
| M5 | GT L238 | "If your child says very little everywhere, not only after school, read our guide on [what varies between children, and when to ask a professional](/stories/talking-late-or-talking-little)." | The review's wording, word for word. The href is now the path the module uses (it was the absolute URL), so the guide is the same |
| M7 | LT L175, L177 | The study paragraph ends "…taken into account.³". The next paragraph opens "The study shows a link, not cause and effect.³" | As asked. 65 words in three sentences (was 74 in four). The limit is still read before the definition, and no word changed |
| M8 | CW L161 | "With a new word, one way to do that: say it, then give your child a reason to use it." | The review's wording, word for word. It no longer reads as the study's advice (C09 tested no word-teaching method). No marker, correctly |
| M9 | CW L238 | H2 "When should you ask your doctor?" | As asked. The paragraph is unchanged and still carries the CDC marker. The H2 never held the primary keyword, so no keyword placement moves |
| M12 | TT L128 | "Not on their own: a toy can't do the talking for you. …" | The review's wording, word for word. 58 words. Answer engines now quote a direct answer. It promises nothing for any toy, and the C07 line after it credits "a caring adult" |
| M13, TL | TL L115-120 | Keeps `advik-04` and its journal alt | As asked |
| M13, GT | GT L101-107 | Keeps `ira-04`; its alt becomes the journal's one alt for that photo | As asked |
| M13, CW | CW L103-110 | `myra-04-drawing-at-home-web.webp` with the hub's learning-toys alt | As asked. The alt is word for word as `learning-toys-for-a-three-year-old.ts:37` and `does-a-three-year-old-need-an-ai-tutor.ts:35`. Checked by eye: no Kheelu, and the alt describes the photo |
| M13, TT | TT L107-114 | `ira-04-paper-crown-web.webp` with GT's alt, so the head goes portrait | As asked. The template picks portrait from the photo's ratio (`ArticleHead.tsx:44`; 1208×1500). This is the same head shape as the learning-toys guide, the template's parity page. Checked by eye: no Kheelu, alt accurate |
| M13, BI | BI L110-115 | Keeps `tara-04` and takes the alt approved for it in 5.18 (LT's old alt) | As asked. The alt is accurate by eye (curly hair, coral kurta, window seat, one finger on the page). The notes are stale: see F2 |
| M13, LT | LT L109-122 | **Moved** from `tara-04` to `kabir-04-planet-book-web.webp` (16:9, wide head), with the alt the approved late-talker guide and the hub already use | **Agreed** (open question 1 below). `tara-04` also heads `why-three-to-six-are-the-years-that-matter-most` (`why-three-to-six-…ts:2`), which is first in LT's "Keep reading" and links back to LT (`…:27`). Keeping it would break the very rule M13 set. The alt is word for word as `talking-toys-and-late-talkers.ts:36` and stories.md L140-141. Checked by eye: no Kheelu, accurate |

**Nothing else changed in the Copy blocks.** The diff touches no card row, title, meta, H1, lead, related list or
keep-reading list. The remaining changed lines are internal: notes, tables, front matter and each page's new "Changes
after approval (task 5.20b)" section.

## Pass or fail by criterion (changed lines, and the pages as a whole)

| # | Criterion | TL | GT | LT | CW | BI | TT | Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice, to parents of 3-7, their real question | PASS (F1) | PASS | PASS | PASS | PASS | PASS | TL now answers LRN-7's own word ("sentences") first and calmly. CW's H2 asks what its paragraph answers. TT answers its yes-or-no H2 (BUY-9). en-IN; no em dash; no new exclamation mark |
| 2 | Answer first, 40-60 words | PASS (60) | PASS (49) | PASS (57) | PASS (56) | PASS (50) | PASS (58) | Counted with markers removed. TL is at the limit, so any later addition must cut a word |
| 3 | One idea per section, phone-first lines | PASS | PASS | PASS | PASS | PASS | PASS | LT's long paragraph is now 65 words (M7). TL's new fold 7 line is one sentence. TL fold 6 has six short bullets |
| 4 | Every statistic or research statement traced | PASS | PASS | PASS | PASS | PASS (M10 open) | PASS | Claim trace below. The only new research statement is the CDC sentence item. BI L160 is unchanged and stays with M10 |
| 5 | D016 brain wording | PASS | PASS | PASS | PASS | n/a | PASS | Brain lines are unchanged. LT's split keeps the Broca's-area line with "adults" and away from Kheelu |
| 6 | D025: the disclaimer wherever speech or language is discussed | PASS | PASS | PASS | PASS | PASS | PASS | The D025 line appears verbatim once under each answer (grep); the new TL speech lines carry markers |
| 7 | D026 markers, public sources | PASS | PASS | PASS | PASS | PASS | PASS | The new item carries its marker (¹). Renumbering is in reading order. No figure is attached to the 4-year item. No "%" anywhere |
| 8 | No banned or retired wording | PASS | PASS | PASS | PASS | PASS | PASS | `findBanned()` over all six pages' Copy blocks: 0 hits |
| 9 | Ages 3-7; nothing implying under 3 | PASS | PASS | PASS | PASS | PASS | PASS | UNDER_THREE: 0 hits. "By 3" restates the old "before they turn 3" (a milestone, not suitability; age-band review §5 row 42). The new sign is framed "by 4" |
| 10 | No internal content | PASS | PASS | PASS | PASS | PASS | PASS | No survey figure, volume, GSC figure, unit count or analytics word in any Copy block |
| 11 | No competitor names | PASS | PASS | PASS | PASS | PASS | PASS | 0 hits, including a wider brand list |
| 12 | At most one product link, no pitch on a speech page | PASS | PASS | PASS | PASS | PASS | PASS | Zero `/products` links on all six. Kheelu appears only in the D025 line. TL's new link goes to a guide |
| 13 | Title ≤ 60, meta ≤ 155 | PASS (58/123) | PASS (45/147) | PASS (58/130) | PASS (49/148) | PASS (45/145) | PASS (57/150) | Measured; unchanged |
| 14 | Approved card title and summary unchanged | PASS | PASS | PASS | PASS | PASS | PASS | No card row changed in the diff |
| 15 | Every fold maps to an Article template block | PASS | PASS | PASS | PASS | PASS | PASS | TL's link is a `p` with an inline link, as GT fold 8 and CW fold 7 already use. The new sign is a `list` item. CW's change is a part title. TT's change is the `answer` string |
| 16 | One obvious next step | PASS | PASS | PASS | PASS | PASS | PASS | The keep-reading close on each. TL gains a contextual next step for the worried parent: the deeper guide |
| 17 | Photos: the `-04` set, no Kheelu, one alt per photo, no repeat across links | PASS | PASS | PASS | PASS | PASS (F2 notes) | PASS | Photo map below |
| – | Visual (360/390/412/1366/1440), motion, Lighthouse, ad-landing | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN | Copy stage. The head-shape changes (TT portrait, LT wide) show at the build's template parity |

## Claim trace (new or changed research lines)

| Article | Line | Source and excerpt | Verdict |
|---|---|---|---|
| TL | L133 "Sentences of four or more words are on the CDC's list of milestones by 4, not 3.¹" | `C42-cdc-milestones-4-years.md:23` ("Says sentences with four or more words"), `:56-60` (no sentence item at 3); Zubler Table 4 `C42-zubler-2022-table-4-cross-check.md:36` (4 y, footnote e) | Supported, as §2's ready line; no figure attached |
| TL | L133 "By 3, most children put two or more words together, like "Doggie run", hold a short back-and-forth conversation and are understood by others most of the time.² ³ ⁴" | CDC 30 months `C42-cdc-milestones-4-years.md:50` and `C42-cdc-milestones-30-months-and-3-years.md:16-20`; Zubler Table 4 `…table-4-cross-check.md:32, 34`; "most" = Table 1 "≥75%", `:54`; CDC 3 years `C42-cdc-milestones-30-months-and-3-years.md:22-26` | Supported. The merge of two approved sentences changes no claim |
| TL | L133 "…talk to your child's doctor.⁴" | CDC 3-year "act early" | Supported (unchanged) |
| TL | L229 "by 4, your child doesn't yet say sentences of four or more words;¹" | `C42-cdc-milestones-4-years.md:23, 35` | Supported, as §2's ready line |
| LT | L177 "The study shows a link, not cause and effect.³" | `C09-romeo-2018-psychological-science.md:70-72` | Supported (moved, not changed) |

## Photo map after 5.20b (the talking topic)

The keep-reading close prints titles only (`RelatedGuides` `keep`, `article-page.ts:50-58`), so the only repeat a
parent can meet is a head photo on the next page. Links are taken from the current modules; in-text links come from
the copy pages.

| Guide | Head | Links to (close; in-text) | Linked from | Repeat |
|---|---|---|---|---|
| TL | `advik-04` | GT `ira-04`, CW `myra-04`, TT `ira-04`; late-talker `kabir-04` | GT `ira-04` (close and in-text), CW `myra-04`, late-talker `kabir-04` | none |
| GT | `ira-04` | data-law `advik-04`, TL `advik-04`, CW `myra-04`; TL | data-law `advik-04`, TL `advik-04`, late-talker `kabir-04` | none |
| LT | `kabir-04` | why-three-to-six `tara-04`, sharp-brain `ira-04`, learning-toys `myra-04` | questions-parents `tara-03`, sharp-brain `ira-04`, why-three-to-six `tara-04` | none |
| CW | `myra-04` | TL `advik-04`, TT `ira-04`, late-talker `kabir-04`; BI `tara-04`, late-talker | TL `advik-04`, GT `ira-04`, TT `ira-04` | none |
| BI | `tara-04` | late-talker `kabir-04`, should-kids `kabir-02`, ai-tutor `myra-04` | TT `ira-04`, should-kids `kabir-02`, late-talker `kabir-04`, CW in-text `myra-04` | none |
| TT | `ira-04` | CW `myra-04`, late-talker `kabir-04`, BI `tara-04`; safe-AI `tara-02` | TL `advik-04`, CW `myra-04`, learning-toys `myra-04` | none |

Across the seven talking guides (with the approved late-talker guide), no photo heads more than two: `ira-04` (GT,
TT) and `kabir-04` (LT, late-talker), each pair unlinked. That meets tasks.md 5.20. M6's proposed ring (GT offers LT;
BI offers CW and GT) would create no repeat either. All five heads are `-04`, none shows Kheelu, and each carries the
one journal alt that GT, CW, TT, BI, LT and the late-talker guide now share. The 5.17 and 5.19 pages still carry other
alts for `ira-04` and `tara-04` (sharp-brain, busy-hands, tantrums, why-three-to-six, how-much-screen-time,
gentle-way). Those belong to 5.20a and 5.20c (see open question 3).

## Minor fixes

**F1 · TL · clarity, phone first (optional) · `story-talking-late-or-talking-little.md` L133.** "Sentences of four
or more words are on the CDC's list of milestones by 4, not 3." puts two counts side by side, "four … words" and
"4, not 3". A parent skimming on a phone can read "4, not 3" as four words rather than three, not as an age. The
meaning is correct. **Fix (Copywriter):** write "by age 4, not 3.¹" and, to stay at 60 words, end the answer
"…or has lost words, talk to their doctor.⁴". The CDC's page is titled "Milestones by 4 Years", so the source needs no
re-check. Leave fold 6's bullet as it is: inside a list of "at 3" and "by 4" signs it reads as an age. If the copywriter
keeps the line as written, that is acceptable: it is the verifier's ready line, and the H2's "3-year-old" primes the
reading.

**F2 · BI · notes only (no Copy change) · `story-raising-a-bilingual-child-in-india.md` L22, L113-114, L380,
L396.** The notes say BI's alt is "word for word as on how-children-learn-by-talking" and that "`tara-04` heads two of
the six talking guides (that one and this)". LT now heads on `kabir-04`, so LT no longer carries this alt, and `tara-04`
heads only BI among the six. The alt itself is right. **Fix (Copywriter):** reword the notes to "the alt approved for
`tara-04` in task 5.18 (how-children-learn-by-talking's former alt; CMO review M13)". Say `tara-04` heads one of the
six talking guides (this one). Point the front-matter source at the 5.18 CMO review instead of LT's fold 1.

## The copywriters' open questions: the CMO view

For the main session (the founder decides copy, D015).

1. **LT's head photo.** (a) Keep `kabir-04`. Going back to `tara-04` (b) puts the same picture on LT and on the first
   guide in its "Keep reading", which links straight back: the exact repeat M13 exists to stop. The remaining cost is
   that the hub's talking fold shows `kabir-04` on its featured card (the late-talker guide), and LT, a text card in
   that fold, opens on the same photo. That is weaker than a keep-reading repeat: the hub photo labels a different
   guide, and the H1 tells the parent where they are. There is no need for (c) after 5.20c either.
2. **TL's answer at 60 words.** (a) As written. Its first sentence is itself the calm line ("by 4, not 3"), and fold 6
   keeps "a reason to ask, not a diagnosis". (c) would break the 40-60 rule that answer engines reward. Apply F1 if
   the copywriter agrees.
3. **One alt per photo on the 5.20c pages.** (a) Adopt these alts word for word. `what-actually-builds-a-sharp-brain`
   takes GT's `ira-04` alt; `why-three-to-six-are-the-years-that-matter-most` takes BI's `tara-04` alt. 5.20a's
   screen-time guides move off the `-04` set under the task's photo pools, so their alts fall away. The main session
   checks the three merges together.
4. **M4's second half.** Agree: at the 5.20b merge, add TL to source verification §7's CDC re-read list and link
   source verification 2026-10-14 from C42.

## Not checked here

- Rendered pages, screenshots at 360/390/412/1366/1440 px, motion and Lighthouse: at the build. TT's head turns
  portrait and LT's turns wide, so the first phone screen of each changes shape. The builder's template parity shows
  both. A round-2 CMO look at one built talking guide on beta is still worth doing.
- M6 (the related ring) and M10 (BI L160): the main session's. The modules, tests and `assets.md` rows: the builder's,
  in the same commit as each module (tasks.md 5.20 item 3).
