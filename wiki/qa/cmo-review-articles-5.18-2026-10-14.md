---
title: "CMO review, round 1: task 5.18 article copy (talking and language, six guides), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - ../site/pages/story-talking-late-or-talking-little.md, story-how-to-get-your-child-talking.md, story-how-children-learn-by-talking.md, story-how-children-collect-words.md, story-raising-a-bilingual-child-in-india.md, story-a-toy-that-talks-vs-a-toy-that-listens.md (copywriters' drafts, task 5.18 copy stage, untracked in the w5c-5.18 worktree)
  - ../site/pages/story-talking-toys-and-late-talkers.md (the approved speech model), ../site/pages/stories.md (fold 3 cards)
  - "src/content/en-IN/stories/articles/<slug>.ts stubs (card, related, dates), src/content/types.ts (block kinds), src/assets/icons.generated.ts"
  - ../brand/positioning.md, messaging.md (claims guardrails, words to stop using), voice.md, audience.md
  - ../site/strategy.md (§4.1, §5 /stories/* row), ../site/content-boundary.md, ../site/gate-a-open-items.md (B3, B5, B14, B15, B45)
  - ../product/claims.md (§1, §4, §8), ../product/age-band-review.md (§4, §5)
  - ../research/keyword-map.md (§2.2-2.3, §4.2, §4.3, §5.1, §5.2, §6.6 SR1, §6.8), ../research/source-verification.md (§3.3, §3.6, §3.7, §4 C07-C10, C33, C38-C40, C42, §5, §7)
  - "../raw/research/sources/: C07-harvard-serve-and-return.md, C08-harvard-serve-return-shapes-brain-circuitry.md, C08-harvard-inbrief-science-of-ecd.md, C09-romeo-2018-psychological-science.md, C33 (via the C33 ready line), C38-aap-asha-multiple-languages-faq.md, C38-byers-heinlein-lew-williams-2013.md, C39-nep-2020-para-4-11.md, C40-asha-late-language-emergence.md, C40-cummins-2001-sprogforum-mother-tongue.md, C42-cdc-milestones-30-months-and-3-years.md, C42-zubler-2022-pediatrics-milestones.md, C42-asha-communication-milestones-2-to-4-years.md"
  - "../decisions/D013, D015, D016, D025, D026, D027, D041; ../engineering/tasks.md (wave 5 part C, rows 5.17-5.18)"
  - "Checks run 2026-10-14 in the worktree: findBanned() from test/guards/banned-phrases.data.ts over every Copy block (0 hits); content-integrity's UNDER_THREE, COMPETITORS and analytics regexes plus a wider brand list (0 hits); percentages (0); title and meta lengths; answer word counts (markers excluded); paragraph lengths; node scripts/ds-checksums.mjs (643 files intact)"
---

# CMO review, round 1: talking and language articles (task 5.18)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This reads the six draft
> copy pages as SKM would, phone first, before they are built (brief Phase 5 step 1). It is input only:
> the founder alone signs off copy, on beta at Gate B ([D015](../decisions/D015-founder-signs-off-copy.md)).
> There is no built page yet, so there are no screenshots: the visual, motion, Lighthouse and ad-landing
> checks wait for the build (template parity with `story-learning-toys-for-a-three-year-old.html`, tasks.md wave 5 note).

## Verdict

**Pass, round 1. No blocking issue.** Fourteen minor fixes (below); none needs a second CMO round, but the
copywriters should apply them before the builder takes the pages.

| Article (copy page) | Verdict | Minor fixes |
|---|---|---|
| `/stories/talking-late-or-talking-little` | **Pass** | M1, M2, M3, M4, M13 |
| `/stories/how-to-get-your-child-talking` | **Pass** | M5, M6, M13 |
| `/stories/how-children-learn-by-talking` | **Pass** | M7 |
| `/stories/how-children-collect-words` | **Pass** | M8, M9, M13, M14 |
| `/stories/raising-a-bilingual-child-in-india` | **Pass** | M6, M10, M11, M14 |
| `/stories/a-toy-that-talks-vs-a-toy-that-listens` | **Pass** | M12, M13, M14 |

What works, and should not be lost in the fixes: every page answers a real parent question in its first
screen, in 49 to 58 words; every research line is the verified wording with its real ages and limits
("aged 4 to 6", "a link, not cause and effect", "neither tested a toy", "He was writing about children at
school"); "a caring adult" survives everywhere; Kheelu is never the subject of a language or brain line;
the tone is calm and Indian without effort (tiffin, upma, the auto, Nani, Kannada and Tamil at home);
"None of this needs a purchase" and "No toy or screen replaces the people who talk with your child every
day" keep the parent central (voice rule 8). These read as the guides SKM's positioning asks for: useful
first, honest about the limit, no fear.

## Pass or fail by criterion

TL = talking-late · GT = how-to-get · LT = learn-by-talking · CW = collect-words · BI = bilingual · TT = toy-that-talks.

| # | Criterion | TL | GT | LT | CW | BI | TT | Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice, to parents of 3-7 and their real question (keyword map rows) | PASS (M1, M2) | PASS (M5) | PASS | PASS (M9) | PASS | PASS (M12) | LRN-7, LRN-6, LRN-11, LRN-9, LRN-10, BUY-9 primaries in title, H1 and answer H2; en-IN; no em dashes; one exclamation mark at most (LT, inside the child's words) |
| 2 | Answer first, 40 to 60 words | PASS (58) | PASS (49) | PASS (57) | PASS (56) | PASS (50) | PASS (54) | counted with markers removed |
| 3 | One idea per section, phone-first lines | PASS (M3) | PASS | PASS (M7) | PASS | PASS | PASS | longest paragraph LT L162, 74 words; all others ≤ 59 |
| 4 | Every statistic or research statement traced | PASS (M4) | PASS | PASS | PASS (M8) | PASS (M10) | PASS | claim trace below |
| 5 | D016 brain wording | PASS | PASS | PASS | PASS | n/a | PASS | brain lines credit "a caring adult" or "adults"; no brain line shares a sentence or paragraph with Kheelu |
| 6 | D025: disclaimer wherever speech or language is discussed; every such statement marked | PASS | PASS | PASS | PASS | PASS | PASS | D025's line verbatim under every answer; no outcome for Kheelu anywhere |
| 7 | D026 markers, public sources only | PASS | PASS | PASS | PASS | PASS | PASS | one statistic on the six pages ("3 in 4", TL fold 4, Zubler Table 1), marked and paired with an action; no "%" printed |
| 8 | No banned or retired wording (claims §4, banned-phrases data) | PASS | PASS | PASS | PASS | PASS | PASS | `findBanned()` over all Copy blocks: 0 hits; no "grows their vocabulary", "cognitive development", "lessons", "safe" alone about a toy, "talks back", tutor or teacher for Kheelu |
| 9 | Ages 3 to 7; nothing implying under 3 | PASS | PASS | PASS | PASS | PASS | PASS | content-integrity's UNDER_THREE regex: 0 hits; "3 to 7" in every page's keep-reading link; TL's "before they turn 3" states a milestone, not suitability (age-band review §5 row 42); BI's "infants" is the researchers' field (row 44) |
| 10 | No internal content | PASS | PASS | PASS | PASS | PASS | PASS | no survey figures, volumes, GSC data, unit counts or analytics words in any Copy block or meta |
| 11 | No competitor names | PASS | PASS | PASS | PASS | PASS | PASS | "smart speaker" stays generic (messaging, words to stop using) |
| 12 | At most one product link, no pitch on a speech page | PASS | PASS | PASS | PASS | PASS | PASS | zero product links, no CTA, no sticky bar (`close: "keep"`); Kheelu only in the D025 line. See founder Q1 below |
| 13 | Title ≤ 60, meta ≤ 155 | PASS (58 / 123) | PASS (45 / 147) | PASS (58 / 130) | PASS (49 / 148) | PASS (45 / 145) | PASS (57 / 150) | measured, " · Kheelona" included |
| 14 | Approved card title and summary unchanged | PASS | PASS | PASS | PASS | PASS | PASS | each copy page's card equals its stub and stories.md fold 3, word for word (curly quotes in GT's module) |
| 15 | Every fold maps to an Article template block | PASS | PASS | PASS | PASS (M14) | PASS (M14) | PASS (M14) | p (incl. `gut`), h3, list (bullets, tips, checks; items with lead and icon), callout, disclaimer, part: all in `src/content/types.ts`; every named icon exists in `icons.generated.ts` |
| 16 | One obvious next step | PASS | PASS (M6) | PASS | PASS | PASS (M6) | PASS | the keep-reading close on each; the nav keeps "Pre-order Kheelu" one tap away |
| 17 | Photos (DS library, no Kheelu, each child once a page) | PASS (M13) | PASS (M13) | PASS | PASS (M13) | PASS | PASS (M13) | DS `03-cast.md` table: all five chosen files are the no-Kheelu scenes |
| – | Visual (360/390/412/1366/1440), motion, Lighthouse, ad-landing | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN | NOT RUN | copy stage: no built page; template parity and the SPA checks at the build, QA's Lighthouse at M1 |

## Claim trace (every marked line, against its excerpt)

| Article | Line (copy page) | Source and excerpt | Verdict |
|---|---|---|---|
| TL | L123 "Most children put two or more words together, like "Doggie run", before they turn 3" | CDC 30 months, `C42-cdc-…md:20`; "most" = Zubler Table 1 "≥75%", `C42-zubler-…md:18` | Supported (M4: re-check the item before publishing) |
| TL | L123, L206-207 conversation of two exchanges; understood by others at 3; lost skills; "share your concerns … developmental screening" | `C42-cdc-…md:24-34` | Supported; same wording as the approved late-talker page |
| TL | L161 milestones set where "at least 3 in 4" reach them | `C42-zubler-…md:18` | Supported (D026: marked, paired with action) |
| TL | L163 ASHA chart "is not a screening or diagnostic tool" | `C42-asha-…md:28` | Supported, quote exact |
| TL | L208, L213 by 4 understood; audiologist or SLP assessment | `C42-asha-…md:20, 24` | Supported (citation format as the approved page) |
| TL, CW, BI | AAP and ASHA: "Speech or language problems are not caused by learning multiple languages"; totals across languages; mixing normal; by 3 can separate; home language will not stop English | `C38-aap-asha-…md:22, 25-33`; C40 ready line | Supported; BI never prints the AAP total next to the review's count-once method (C40 note) |
| TL, GT, CW, TT | Harvard: back-and-forth with a caring adult supports early language (and social) skills | `C07-harvard-serve-and-return.md:22-28` | Supported, caring adult kept |
| LT, TT | "help build (and strengthen) neural connections in the child's brain" | `C07-…md:36-43` | Supported; credited to the exchanges, never a toy (D016) |
| LT | "one of the most essential experiences in shaping the architecture of the developing brain" | `C08-harvard-serve-return-…md:21-22` | Supported, quote exact; nothing ranked (C08 caveat 1) |
| LT | "between children and their parents and other caregivers in the family or community" | `C08-harvard-inbrief-…md:23-24` | Supported, quote exact |
| GT, LT, CW, TT | Romeo 2018: 36 children aged 4 to 6; turns and Broca's area; adult words no such link; scores after income and education (LT, CW); turn definition; native English speakers (CW); link not cause; authors' suggestion | `C09-romeo-…md:23-41, 46-52, 57-64, 70-75` | Supported; the C09 ready line, never about 3-year-olds |
| TT | "Both are about adults talking with children; neither tested a toy" | `C07-…md:45-54`; `C09-…md:81` | Supported |
| TT | AAP asks parents to watch with their children and help them understand | C33 ready line (Media and Young Minds, Recommendations: Families) | Supported, the "hour" ceiling left out (C33 caveat) |
| LT, CW, BI | ASHA: a strong model in any language helps build a foundation for learning others | `C40-asha-late-language-emergence.md:26-27` | Supported (paraphrase as the C40 ready line) |
| BI | 2013 review: not more likely to have difficulties, delays or a disorder; fewer words per language, about the same counting each idea once | `C38-byers-heinlein-…md:25-35` | Supported, the C38 ready line |
| BI | L160 "Most of the studies it draws on were done in North America and Europe" | `C38-byers-heinlein-…md:52-53` (the verifier's note, not a passage) | Traced to a note only: M10 |
| BI | Cummins: concepts carry over; telling the time; written about school | `C40-cummins-…md:25-31, 49` | Supported; "argues", no "far faster" |
| BI | NEP 2020 para 4.11, wherever possible, Grade 5 and preferably Grade 8 and beyond; its reason quoted | `C39-nep-2020-para-4-11.md:26-30` | Supported, the C39 ready line; no "That is why" bridge |
| CW | L232 at 3 others can't understand most of the time, or lost words | `C42-cdc-…md:26-34` | Supported |

Unmarked lines were read as house voice: advice, scenes and definitions with no research claim. None
states a finding about children that needs a source.

## Minor fixes

Each: article and criterion, what is wrong (copy page and line), the fix, and who makes it.

**M1 · TL · voice and clarity · `story-talking-late-or-talking-little.md` L144.** "At every birthday party there
is one parent doing sums in their head. That child is narrating a whole film. Mine points and says "come"."
"That child" has no antecedent, and the voice jumps from "one parent" to "Mine" with no signal; on a phone
it takes two reads. **Fix (Copywriter):** replace the paragraph with: `At a birthday party, another child is
narrating a whole film, and yours points and says "come". Is that fine? Or is it something?`

**M2 · TL · the parent's real question · L121-123 and L199-215 (copywriter's Q5).** The H1 and answer H2 ask
about sentences; the answer and fold 6 give the verified milestones (joined words, short conversations,
being understood) but never say anything about sentences, because no read source gives a sentence
milestone. Honest, but a parent searching "not talking in sentences" does not get that word answered.
**Fix (main session, then Copywriter):** take Q5 option (b) before Gate B: have the CDC "milestones by 4
years" page read and saved as a source excerpt (D026, source verification §7), then add its sentence item
with a marker as a bullet in fold 6 and as one clause in the answer (keep the answer ≤ 60 words). Until
then, option (a) stands.

**M3 · TL · one idea per page, overlap · TL L199-215, L181-185 and L237-243 vs
`story-talking-toys-and-late-talkers.md` L124-135, L192-193 and L171-177; TL's overlap note L72-76.** Four of the five signs, the "These are US guides" line, the CDC and ASHA
paragraph and "If your gut says ask, ask" repeat the approved late-talker page word for word, fold 5
repeats its myth 1, and the fold 7 tips use the same icons in the same order. The copy page's overlap note
says the two pages "do not repeat each other line for line"; they do. The medical wording should stay
identical (precision beats variety), but the page should say where the deeper guide is: today TL never
links to the late-talker guide, although both answer one worry (keyword map §4.3, medium risk).
**Fix (Copywriter):** (1) correct the overlap note to say the signs are deliberately the same wording;
(2) end fold 7 with one in-text link, as CW fold 7 does: `For more on what helps a child who talks later
or less than others, read [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers).`

**M4 · TL · source trace · L123, L205, L262; the copy page's own note L276-279.** The two-word item rests on
the CDC 30-month page as read through a rendering tool, and unlike the 50-word and intelligibility items
it was not cross-checked against Zubler 2022 Table 4. **Fix (main session, source verification owner):**
before Gate B, check "two or more words together, with one action word" against Zubler Table 4 (30 months)
or a plain read of the CDC page, and record the result in source verification C42 (raw excerpts stay
unedited); add TL to the §7 re-read list for the CDC pages.

**M5 · GT · clarity · `story-how-to-get-your-child-talking.md` L233.** "If it's everywhere, not only after
school, read our guide on …": "it" has no clear referent. **Fix (Copywriter):** `If your child says very
little everywhere, not only after school, read our guide on [what varies between children, and when to ask
a professional](/stories/talking-late-or-talking-little).`

**M6 · GT and BI · one obvious next step · GT L263; BI L306-308.** The keep-reading close is these pages'
only next step, and the legacy ring sends a parent from a talking-habits guide to "What India's data law
asks of a toy that listens", and from the journal's most-searched language guide (GSC, keyword map LRN-10)
to two AI guides. The drafts rightly keep the stubs' lists (task notes; three incoming links each,
`articles.test.ts`). **Fix (main session, then Builder):** when 5.17-5.19 merge, rebalance the related ring
so GT offers `how-children-learn-by-talking` in place of the data-law guide, and BI offers
`how-children-collect-words` and `how-to-get-your-child-talking` in place of `should-kids-use-ai` and
`does-a-three-year-old-need-an-ai-tutor`, then re-pin the incoming-link counts. No copy change now.

**M7 · LT · phone-first lines · `story-how-children-learn-by-talking.md` L162.** The study paragraph is 74
words in four sentences, about eleven lines at 360 px. **Fix (Copywriter):** end L162 after "…parents'
education were taken into account.³" and open L164 with `The study shows a link, not cause and effect.³`
before "In the study, a turn was …".

**M8 · CW · prove it · `story-how-children-collect-words.md` L155.** "For words, that means saying the new word,
then giving your child a reason to use it." reads as the study's own advice on vocabulary; the study tested
no word-teaching technique (C09 caveats). **Fix (Copywriter):** `With a new word, one way to do that: say
it, then give your child a reason to use it.`

**M9 · CW · answer matches the heading · L230-232.** The H2 "What if your child seems to have few words?"
promises a word count; the answer (rightly, ages 3 to 7 only) gives being understood and losing words.
**Fix (Copywriter):** H2 `When should you ask your doctor?`; the paragraph stays as drafted.

**M10 · BI · every statement traced · `story-raising-a-bilingual-child-in-india.md` L160.** "Most of the studies
it draws on were done in North America and Europe.³" is traced to the verifier's note in the excerpt
(`C38-byers-heinlein-…md:52-53`, "What this source does and does not support"), not to a passage of the
review, yet it carries the review's marker. **Fix (main session, then Copywriter):** confirm it against the
review's reference list and record it in source verification C38; if it cannot be confirmed before Gate B,
cut the sentence (the paragraph stands without it).

**M11 · BI · byline accuracy · L98, L103-105.** "4 min read" rests on "about 700 words (3.5, rounded up)";
this review counts about 696 words from the H1 to fold 9 (3.48, which rounds to 3). **Fix (Builder):**
derive `readMinutes` from the final module text with the shared rule, `round(words / 200)`, and let the
byline follow it (3 min if the body is under 700 words).

**M12 · TT · answer first · `story-a-toy-that-talks-vs-a-toy-that-listens.md` L121.** The H2 asks "Are talking
toys good for a young child's language?" and the answer never says yes or no; answer engines quote the
first sentence. **Fix (Copywriter):** open the answer with `Not on their own: a toy can't do the talking
for you.` in place of "A toy can't do the talking for you." (the answer becomes 58 words).

**M13 · TL, GT, CW, TT · photos · TL L107 and TT L104 (`advik-04`), GT L99 and CW L100 (`ira-04`), LT L106 and BI
L106 (`tara-04`).** Three photos serve six guides, and two pairs that link to each other share a head photo
(TL's keep-reading lists TT; GT's lists CW), so a parent who taps "Keep reading" lands on the same picture.
The same photo also carries two different alts (ira-04 on GT and CW; tara-04 on LT and BI).
**Fix (Copywriter, then Builder):** CW takes `myra-04-drawing-at-home-web.webp` (Myra is the cast's
3-year-old, DS `03-cast.md` "age-3 messaging", for a 3-year-old's vocabulary; alt as the hub's
learning-toys card: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with
an orange crayon at a low table."); TT takes `ira-04-paper-crown-web.webp` with GT's alt (a child making
her own play, which suits "a toy that neither talks nor listens"); TL keeps `advik-04`; one alt per photo
across the journal (use LT's alt for tara-04 on BI too). Checked against every `related` list in
`src/content/en-IN/stories/articles/`: no talking guide, and not the learning-toys guide (head `myra-04`,
body `advik-04`, which links to TT), would then link to a guide with its own head photo. The photos the
5.17 and 5.19 copywriters pick are not known yet; the main session glances at the merge.

**M14 · CW, BI, TT · template mapping and text parity · CW L171-172, L188; BI L236-237, L250; TT L235, L250.**
`CalloutBlock` requires an `icon`, and a `tips` list needs one per item; these three pages leave the picks
to the builder, so there is nothing to check text parity against. **Fix (Copywriter):** name them, from
`icons.generated.ts`: CW tips in order `chat-circle-dots`, `info`, `eye`, `question`, `book-open`,
`arrow-counter-clockwise`, `users-three`, callout `star`; BI tips `music-notes`, `chat-circle-dots`,
`translate`, `book-open`, `users-three`, `heart`, callout `hand-heart`; TT callout `question` (its list is
`checks`, which needs none).

## The founder's questions: the CMO view

For the main session to carry to the founder with the copywriters' questions (the founder decides, D015).

- **Q1, no pitch.** Agree with (a) on TL (B5, a speech worry), GT, LT and BI: a pre-order button under a
  speech disclaimer would read as selling to a worried parent, and on LT a product line near Harvard's
  caring-adult words repeats the Home F1 problem ([CMO review 2026-10-11](cmo-review-2026-10-11.md)).
  CW: (a) as well. **TT is the exception worth a look at Gate B**: it is the one buying-intent page in the
  topic (BUY-9, "toys for language development"), its own checklist describes what a parent should look
  for, and with (a) a buyer's only route on is the safe-AI-toy guide or the nav. (a) is right for this
  build; if the founder wants (b) there later, the B3 Common Sense Media answer must come with it
  ([age-band review §4](../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band)), as the
  copywriter says. Note for the record: strategy §5 still says every article routes to the product page
  with one in-text link; the task 5.18 rule overrides it for this topic, and the strategy row should say so
  when the main session next edits it.
- **Q2, the D025 line on the habit guides.** (a): one line, said the same way on every talking guide,
  matches the approved late-talker page.
- **Q3 and Q4, H1 versus card title.** (a) for this build: each lead repeats the card's own line (LT's lead
  carries the same promise), so the parent who taps a card lands on its words. Align the card titles at the
  next hub edit (stories.md already expects the build to move cards to the keyword-map titles).
- **Q5, a sentence milestone (TL).** (b) before Gate B (M2).
- **Byline.** (a) "The Kheelona team" on all six, as on the approved speech page; no one on the team is a
  clinician.

## Not checked here

- Rendered pages, screenshots at 360/390/412/1366/1440 px, motion and Lighthouse: at the build (template
  parity, SPA items) and QA's M1 run. A round-2 CMO look at one built article on beta is worth it, since
  none of these 18 has a mockup.
- The `updated` date ruling (stub date or rewrite date) is the main session's, raised by every copywriter.
- Source re-reads before publishing (Harvard key concept pages, CDC pages): source verification §7.
