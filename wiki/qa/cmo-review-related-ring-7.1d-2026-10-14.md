---
title: "CMO review, round 1: the related-guide ring on the article copy pages (task 7.1d, CMO B m3), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - "Copy pages in worktree w8-7.1d (uncommitted, git diff against fdb7580): ../site/pages/story-busy-hands-no-screens.md, story-the-gentle-way-off-the-phone.md, story-how-to-get-your-child-talking.md, story-ai-toys-and-indias-data-law.md, story-what-to-look-for-in-a-safe-ai-toy.md, story-should-kids-use-ai.md, story-questions-parents-ask-about-ai-toys.md, story-raising-a-bilingual-child-in-india.md; unchanged and read: story-learning-toys-for-a-three-year-old.md, story-screen-free-does-not-mean-silent.md, story-how-much-screen-time-for-a-3-to-6-year-old.md, story-does-a-three-year-old-need-an-ai-tutor.md, story-what-actually-builds-a-sharp-brain.md"
  - cmo-review-built-b-2026-10-14.md (m3, the ring table, lines 207-237)
  - cmo-review-articles-5.18-2026-10-14.md (M6, lines 143-150)
  - ../engineering/tasks.md (7.1d, lines 1574-1576)
  - ../site/pages/stories.md (folds 2 to 5, the hub card titles, lines 117-170)
  - "src/content/en-IN/stories/articles/*.ts (each module's card.title, related line, head photo import); src/content/en-IN/stories/hub.ts:116-119 (the hub reads card.title); src/layouts/ArticleTemplate/article-page.ts:49-51 (related guides render card.title); src/content/en-IN/stories/articles/articles.test.ts:100-113 (three out, at least three in), 183-210 (the legacy ring)"
  - "Ring check: a scratch script over the 20 modules' related lines, the in-text /stories links and the head photos (session scratchpad ring.mjs, run 2026-10-14), for three states: today's modules, the full m3 table, and the copy pages as they stand"
---

# CMO review: the related-guide ring (task 7.1d)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). A copy review of fixes to
> approved article copy, before the build: no built page and no screenshot yet. It is input only. The founder alone
> signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)).

## Verdict

**Fail: one blocking issue (B1).** The fix asked for is m3's ring: 14 slot changes across 10 articles
([tasks](../engineering/tasks.md) 7.1d: "14 slot changes across 10 articles … copy pages' related folds first").
Seven of the ten rows are applied, and all seven are right: the list and its order match the table, every title is
the hub card's word for word, each guide is a sensible next read for a parent on that page, there are three per guide,
no head photo is shared across a link, and no other Copy line changed. The safe-AI-toy page correctly keeps its
mockup list and records only the change to its incoming links.

**Three rows of the table are on no copy page:** `how-much-screen-time` (25), `ai-tutor` (25) and `sharp-brain`
(27). Those three pages still carry their stub lists. The task's page list named the learning-toys and screen-free
guides, whose lists the table leaves alone, and a file that does not exist (`story-hard-questions-to-ask-before-buying-an-ai-toy.md`).
It did not name these three. As the copy stands, the ring breaks: busy hands and the data-law guide would each have
only two incoming links, so `articles.test.ts:109-113` fails once the modules follow the copy, and tantrums and
screen-free would each have four. Two of the applied pages also describe incoming links that exist only once those
rows land.

Two minor issues: small miscounts and one loose phrase in the notes (n1), and a stale note on the safe-AI-toy page
from before this task (n2).

## Criteria

R1 the fix applied: the list and its order are the table's row · R2 on topic: each guide is the one a parent reading
this page would want next · R3 three related guides · R4 titles match the hub card word for word (`hub.ts:116-119`
and `article-page.ts:49-51` both read `card.title`) · R5 no head photo shared across a link, related or in-text (5.20a)
· R6 nothing else changed for the worse: Copy outside the related fold untouched, notes true, a "Changes after
approval (task 7.1d)" section citing CMO B m3.

P = pass; B1, n1, n2 = issues below; – = not applicable.

| Article (copy page) | Fold | Now (after 7.1d) | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|---|---|
| busy-hands (`story-busy-hands-no-screens.md`) | 11 (L279-304) | gentle way, tantrums, early years | P | P | P | P | P | P (L437 waits on B1) |
| gentle-way (`story-the-gentle-way-off-the-phone.md`) | 11 (L288-312) | tantrums, busy hands, screen-free | P | P | P | P | P | P |
| get-talking (`story-how-to-get-your-child-talking.md`) | 10, keep reading (L263-294) | talking late, bilingual, collect words | P | P | P | P | P | P |
| data-law (`story-ai-toys-and-indias-data-law.md`) | 11 (L311-336) | safe AI toy, should kids, AI tutor | P | P | P | P | P | P (L499 waits on B1) |
| safe-ai-toy (`story-what-to-look-for-in-a-safe-ai-toy.md`) | 7, unchanged (mockup list) | hard questions, should kids, data law | P (no change asked) | P | P | P | P | P (n2 is older) |
| should-kids (`story-should-kids-use-ai.md`) | 10 (L324-344) | safe AI toy, hard questions, AI tutor | P | P | P | P | P | n1 |
| hard-questions (`story-questions-parents-ask-about-ai-toys.md`; the task named a file that does not exist) | 9 (L308-330) | safe AI toy, AI tutor, data law | P | P | P | P | P | n1 |
| bilingual (`story-raising-a-bilingual-child-in-india.md`) | 11, keep reading (L302-334) | late talker, get talking, learn by talking | P | P | P | P | P | P |
| learning-toys (`story-learning-toys-for-a-three-year-old.md`) | unchanged (mockup list) | sharp brain, toy that talks, screen time | P (no change asked) | P | P | P | P | P |
| screen-free (`story-screen-free-does-not-mean-silent.md`) | unchanged | learning toys, screen time, tantrums | P (no change asked) | P | P | P | P | P |
| screen-time (`story-how-much-screen-time-for-a-3-to-6-year-old.md`), not in the task's list | 12 (L308-324) | still the stub's: screen-free, tantrums, gentle way | **B1** | P (as it stands) | P | P | P | **B1** |
| ai-tutor (`story-does-a-three-year-old-need-an-ai-tutor.md`), not in the task's list | 8 (L309-325) | still the stub's: should kids, hard questions, early years | **B1** | P (as it stands) | P | P | P | **B1** |
| sharp-brain (`story-what-actually-builds-a-sharp-brain.md`), not in the task's list | 9 (L274-290) | still the stub's: learn by talking, learning toys, screen-free | **B1** | P (as it stands) | P | P | P | **B1** |

**The ring (scratch check over the 20 modules).** Under the full m3 table every guide has three out and three in,
and no head photo is shared across any related or in-text link. The three mockup lists stay as they are, and the
new links come to 14. With only the seven applied rows, it fails three-in:
`busy-hands-no-screens` 2 (tantrums, gentle way), `ai-toys-and-indias-data-law` 2 (safe AI toy, hard questions),
`screen-time-and-tantrums` 4, `screen-free-does-not-mean-silent` 4.

### Why each new list is the right next step (R2, judged as SKM)

- **Busy hands:** the seven-day plan, the off-switch meltdown and why play fills the early years all belong to a
  parent filling the day without a screen. Early years is the loosest of the three. The closer picks are out:
  screen-free shares `ira-02`, and the screen-time guide has no free slot. It still holds up, because its card
  promises "talk, play and sleep".
- **Gentle way:** all three are screen-time guides. Screen-free answers week 2's "someone to talk to" (fold 9, L258).
- **Get talking:** all three are talking guides with the keep-reading close and no pitch. The bilingual guide suits
  homes that speak more than one language, which is most of this audience.
- **Data law:** all three are AI-and-safety guides. The AI-tutor guide is less direct than the hard-questions guide
  would be ("what happens to the data"). Swapping them would break the in-counts, and the AI-tutor guide still gives
  a parent the age-3 view. Pass.
- **Should kids / hard questions:** the safe-AI-toy guide comes first on both, which is the right next step after
  either page. On hard-questions a parent also meets it in fold 4's text. That repeats a link, but every link still
  goes to a useful page. Keep it (the copywriter's option (a)).
- **Bilingual:** late talker, get talking, learn by talking. This is M6's intent: talking guides, no AI, no pitch.
  It uses learn by talking where M6 named collect words, because collect words already has its three incoming
  links. The page says so (L331-333).

## Issues and fixes

### B1 (blocking) · screen-time, AI-tutor and sharp-brain · three rows of m3's table are on no copy page → main session (scope), then Copywriter (fix mode)

- **What is wrong:** `story-how-much-screen-time-for-a-3-to-6-year-old.md` L314-324, `story-does-a-three-year-old-need-an-ai-tutor.md`
  L315-325 and `story-what-actually-builds-a-sharp-brain.md` L280-290 still carry the stub lists, and each says
  "The stub's related list, unchanged". So the ring as the copy pages give it fails three-in (above). Two applied
  pages' notes describe that missing state as if it had landed: `story-busy-hands-no-screens.md` L437 ("linked from
  the screen-time, tantrums and gentle-way guides") and `story-ai-toys-and-indias-data-law.md` L499 ("linked from the
  safe-AI-toy, hard-questions and AI-tutor guides"). Neither is true until the screen-time and AI-tutor rows land.
  The seven applied pages need no change: their notes become true when B1 is fixed.
- **Fix:** run the same fix mode on the three pages: change only the related fold, give each title as the hub prints
  it, add a "why it is linked" note, the At a glance or Sources row, a front-matter source, and a "Changes after
  approval (task 7.1d)" section citing CMO B m3:
  1. **Screen time, fold 12:** "Busy hands, no screens" (`/stories/busy-hands-no-screens`), "Screen-free does not
     mean silent" (`/stories/screen-free-does-not-mean-silent`), "The gentle way off the phone: a seven-day plan"
     (`/stories/the-gentle-way-off-the-phone`). Out: tantrums, which stays an in-text link in this page's body. Why:
     busy hands gives the set-ups for the hours a limit frees. Photos: `advik-01` here; `ira-02`, `ira-02`,
     `tara-01`. Replace L324's "The stub's `related` list, unchanged" and split L417's Sources row as the other pages
     did. Builder: `how-much-screen-time-for-a-3-to-6-year-old.ts:25` →
     `related: ["busy-hands-no-screens", "screen-free-does-not-mean-silent", "the-gentle-way-off-the-phone"]`.
  2. **AI tutor, fold 8:** "Should kids use AI? An honest answer from people who build it" (`/stories/should-kids-use-ai`),
     "What India's data law asks of a toy that listens" (`/stories/ai-toys-and-indias-data-law`), "The hard questions
     parents ask about AI toys" (`/stories/questions-parents-ask-about-ai-toys`). Out: early years (it keeps three
     incoming links: learn by talking, busy hands, sharp brain). Why: the law behind any app or toy that handles a
     3-year-old's data, and all three now sit in AI and safety. Photos: `myra-04` here; `kabir-02`, `ira-01`, `tara-03`.
     The L117 photo note ("none of the three links to another") still holds. Replace L325 and split L424.
     Builder: `does-a-three-year-old-need-an-ai-tutor.ts:25` →
     `related: ["should-kids-use-ai", "ai-toys-and-indias-data-law", "questions-parents-ask-about-ai-toys"]`.
  3. **Sharp brain, fold 9:** "How children learn by talking" (`/stories/how-children-learn-by-talking`), "Learning
     toys for a 3-year-old, skill by skill" (`/stories/learning-toys-for-a-three-year-old`), "Why the early years
     matter most" (`/stories/why-three-to-six-are-the-years-that-matter-most`). Out: screen-free, which keeps three
     incoming links: screen time, gentle way, early years. Why: early years is the same talk-play-sleep subject told
     from the years' side, and it already links back here in its text. Photos: `ira-04` here; `kabir-04`, `myra-04`,
     `tara-04`. Replace L290 and split L377. Builder: `what-actually-builds-a-sharp-brain.ts:27` →
     `related: ["how-children-learn-by-talking", "learning-toys-for-a-three-year-old", "why-three-to-six-are-the-years-that-matter-most"]`.
  
  Then CMO round 2 on those three pages only. The Builder changes all ten modules in one commit, so the in-count test
  never sees a half ring.

### n1 (minor) · should-kids, hard-questions · word counts and one loose phrase in the notes → Copywriter

- `story-should-kids-use-ai.md` L486: "The new titles add two words". They add three: 21 → 24 words, split on
  spaces, the way the bilingual and data-law pages count. **Fix:** "add three words".
- `story-questions-parents-ask-about-ai-toys.md` L488-489: "the seven extra title words … about 957 words". The
  titles add eight words (18 → 26), so the total is about 958. **Fix:** "the eight extra title words … about 958
  words". The verdicts stand: under 4.5 minutes, "about 950".
- Same page, L327-329: "Each keeps three incoming links from the learning and talking guides". Early years' three
  incoming links include busy hands, a screen-time guide, and that link exists only after B1. **Fix:** "Early years
  keeps three incoming links (learn by talking, busy hands, sharp brain), and learn by talking keeps three (early
  years, bilingual, sharp brain)."

### n2 (minor, from before this task) · safe-ai-toy · a stale link note → Copywriter, next pass on the page

- `story-what-to-look-for-in-a-safe-ai-toy.md` L162: "`/stories/ai-toys-and-indias-data-law` → `stories.html#ai-and-safety`
  (not rewritten yet)". The data-law guide was rewritten in task 5.19. The fold 7 "Mockup link" column (L255-257)
  is right: the frozen mockup does point to the hub topic (`mockup/story-what-to-look-for-in-a-safe-ai-toy.html:97`).
  **Fix:** "(the frozen mockup points to the hub topic; the guide itself was rewritten in task 5.19)". 7.1d did not
  cause this.

## Checked and holding

- **Titles (R4):** all 21 new title lines match each module's `card.title` and [stories.md](../site/pages/stories.md)
  folds 2 to 5 word for word. The copy pages' straight apostrophe in "India's" against the module's curly one is
  how the wiki spells it. It is not a difference, because the template renders the module's text.
- **History notes:** the busy-hands, gentle-way and data-law pages trace each removed link correctly: the legacy ring
  (`articles.test.ts:183-210`), then task 6.5's swaps. Get-talking's correction holds: its data-law link came from the
  pure ring, the guide just before it, not from a swap.
- **Card numbers in the new Sources rows:** gentle way "§2 cards 3, 5 and 6", get talking "fold 3 cards 2, 5 and 6",
  data law "fold 4 cards 1, 3 and 5" all match stories.md L119-155.
- **No leakage, no claims:** the only new parent-facing words are guide titles that already appear on the hub. No
  keyword, "Kheelu", banned word or under-3 wording comes in. "AI tutor" on the data-law page is only that guide's
  title.
- **Folds outside the related list:** in the eight diffs, every hunk sits in the front matter, At a glance, the
  related fold, the Sources table, the bilingual note for the main session (now marked resolved) or the new foot
  section. No other Copy block changed.

## For the main session and the founder

- **The copywriters' two questions.** (1) Get talking: sign the table as applied, option (a). The bilingual guide is
  as on-topic as M6's learn-by-talking, and the table already meets every constraint. (2) Hard questions: keep the
  safe-AI-toy guide in the list as well as in fold 4, option (a). Both are the founder's to sign at Gate B (D015).
- **Builder notes the copywriters raised:** `articles.test.ts` still pins task 6.5's swap comments and the stub ring
  test (L276-282). Each page's foot section gives the module line and the header-note lines to update.

## Round 2

> Same scope and criteria as round 1 (R1 to R6 above): fixes to approved copy, before the build. No built page and no
> screenshot yet. Input only; the founder signs off copy (D015).

**Sources for this round.** The 11 copy pages changed in worktree w8-7.1d (`git diff` against `fdb7580`, read
2026-10-14), with `story-learning-toys-for-a-three-year-old.md` and `story-screen-free-does-not-mean-silent.md`
(unchanged); [review B](cmo-review-built-b-2026-10-14.md) m3, the ring table, lines 223-234;
[stories.md](../site/pages/stories.md) folds 2 to 5 (lines 115-170, card titles and numbers); `src/content/en-IN/stories/hub.ts:26-65`
(topics) and `:116-119`; `src/layouts/ArticleTemplate/article-page.ts:49-58` (related guides render `card.title` as
text links, no photo); the 20 modules' `card.title`, `related:` line, head-photo import, in-text `/stories/` links and
header notes. Ring check: a scratch script (session scratchpad `ring2.mjs`, run 2026-10-14). It reads the related fold
of all 20 copy pages, maps each title to its slug by the module's `card.title`, and compares each list with m3's row,
or with the module where the table leaves the list alone. It then counts links out and in and checks head photos
across every related and in-text link.

**The page list for this round** again names `story-hard-questions-to-ask-before-buying-an-ai-toy.md`, which does not
exist, and leaves out the three B1 pages and `story-questions-parents-ask-about-ai-toys.md`. All four were changed, so
I reviewed the files as they stand.

### Verdict, round 2

**Pass: no blocking issue.** B1 is fixed. The screen-time, AI-tutor and sharp-brain pages now carry m3's rows, word
for word and in the table's order, so all ten rows of the table are on their copy pages. n1 and n2 are fixed as asked.
The ring check finds no problem across the 20 copy pages:

- every page's list matches m3's row (10 pages) or keeps its module's list (the other 10, as the table requires);
- every title is the hub card's title, word for word;
- every guide has three related guides out and three in;
- no head photo is shared across any related or in-text link;
- the change against today's modules comes to 14 slots across 10 articles, as review B counts it.

The two notes that waited on B1 are now true. Busy hands, L437, is "linked from the screen-time, tantrums and
gentle-way guides". Data law, L499, is "linked from the safe-AI-toy, hard-questions and AI-tutor guides". No new issue.

### Criteria, round 2

P = pass; – = not applicable. The seven rows marked "as round 1" did not change after round 1, apart from n1's two
notes. The ring check and the diffs show nothing new on them.

| Article (copy page) | Fold | Now | R1 | R2 | R3 | R4 | R5 | R6 |
|---|---|---|---|---|---|---|---|---|
| busy-hands | 11 | gentle way, tantrums, early years | P | P | P | P | P | P (L437 now true) |
| gentle-way | 11 | tantrums, busy hands, screen-free | P | P | P | P | P | P |
| get-talking | 10, keep reading | talking late, bilingual, collect words | P | P | P | P | P | P |
| data-law | 11 | safe AI toy, should kids, AI tutor | P | P | P | P | P | P (L499 now true) |
| safe-ai-toy | 7, unchanged | hard questions, should kids, data law | P (no change asked) | P | P | P | P | P (n2 fixed: L163-164, foot L373-377) |
| should-kids | 10 | safe AI toy, hard questions, AI tutor | P | P | P | P | P | P (n1 fixed: L486 "add three words") |
| hard-questions (`story-questions-parents-ask-about-ai-toys.md`) | 9 | safe AI toy, AI tutor, data law | P | P | P | P | P | P (n1 fixed: L327-329, L489-490 "eight extra title words … about 958") |
| bilingual | 11, keep reading | late talker, get talking, learn by talking | P | P | P | P | P | P |
| learning-toys | unchanged | sharp brain, toy that talks, screen time | P (no change asked) | P | P | P | P | P |
| screen-free | unchanged | learning toys, screen time, tantrums | P (no change asked) | P | P | P | P | P |
| **screen-time** (`story-how-much-screen-time-for-a-3-to-6-year-old.md`) | 12 (L311-342) | busy hands, screen-free, gentle way | **P** (was B1) | P | P | P | P | P |
| **ai-tutor** (`story-does-a-three-year-old-need-an-ai-tutor.md`) | 8 (L312-343) | should kids, data law, hard questions | **P** (was B1) | P | P | P | P | P |
| **sharp-brain** (`story-what-actually-builds-a-sharp-brain.md`) | 9 (L278-307) | learn by talking, learning toys, early years | **P** (was B1) | P | P | P | P | P |

### The three B1 pages, judged as SKM (R2) and checked line by line

- **Screen time (fold 12).** A parent who has just read "how much screen time" needs two things next: a way to cut
  back and something to fill the freed hour. This list gives both. The gentle-way plan is the way to cut back, and fold
  6 already links it in the text (L197). Busy hands gives the set-ups; its card reads "Screen-free ways to keep a young
  child busy at home". Screen-free shows the talk-filled day that fold 7 asks for ("Is there room for talking, playing,
  moving about and sleep?", L213). Tantrums leaves the list but stays one tap away in fold 10's text (L275, "If
  switching off ends in tears most evenings"), so the note at L330-331 is true. Busy hands and screen-free share
  `ira-02`. The rule is about photos across a link (tasks.md 7.1d, L1576: "no head photo shared across a link"),
  neither of the two links to the other, and the related list is text only, so a parent never sees the two photos side
  by side. The page says so at L339-340. Pass.
- **AI tutor (fold 8).** The page says no to the tutor and gives a checklist for any AI toy or app (fold 6, L249). The
  next questions are whether AI suits children at all (should kids), what to ask a maker (hard questions) and what the
  law asks of the company (data law). All three sit in AI toys and safety, this page's own topic (`hub.ts:51-58`;
  breadcrumb L92). Early years leaves the list, and it keeps three incoming links: learn by talking, busy hands and
  sharp brain. Fold 1's `myra-04` note (L117-120) still holds: the AI-tutor, collect-words and learning-toys guides
  carry that photo, and none of them links to another. Pass.
- **Sharp brain (fold 9).** All three are learning guides. Early years is this page's twin: its card says "talk, play
  and sleep", and its fold 4 already links here in the text (`story-why-three-to-six-are-the-years-that-matter-most.md`
  L177). The two guides now point to each other, and the Overlap note (L78-82) still divides them: the early-years
  guide owns the why, this page the how. Screen-free leaves the list and keeps three incoming links: screen time,
  gentle way and early years. Pass.
- **Facts in the new notes, all checked true:**
  - Card numbers in the Sources rows: screen time "fold 2, cards 4, 5 and 6" (L434); AI tutor "fold 4 cards 2, 3 and
    4" (L441); sharp brain "fold 3 card 4, fold 5 cards 1 and 3" (L393). Each matches stories.md L117-170.
  - Title word counts: 22 → 18 (screen time), 26 → 30 (AI tutor) and 18 → 19 (sharp brain), split on spaces.
  - "Without this row" counts: busy hands 2 and tantrums 4; data law 2; screen-free 4.
  - Builder lines: the `related:` lines are at `.ts:25`, `:25` and `:27`, and the header-note lines are 10-11, 9-10
    and 9-10, as each foot section says.
- **R6 on the three pages:** every hunk sits in the front matter, the related fold, the Sources table (the related
  list now has its own row) or the new "Changes after approval (task 7.1d)" section, which cites CMO B m3 and ring
  review B1. No Copy block outside the related fold changed. The At a glance tables have no related row to update.
  Body counts, read times, keyword and density rows still hold. No leakage and no claim: the only new parent-facing
  words are three hub card titles.

### Issues, round 2

None blocking and none minor. Round 1's B1, n1 and n2 are closed.

### For the main session and the founder

- **Still the founder's to sign at Gate B (D015):** the copywriters' two questions from round 1. My recommendation is
  unchanged: option (a) on both. Get talking keeps the table's bilingual guide. Hard questions keeps the safe-AI-toy
  guide both in its list and in fold 4's text.
- **Builder:** change all ten `related:` lines and their header notes in one commit, as each foot section gives them,
  so the in-count test (`articles.test.ts:109-113`) never sees half a ring. `articles.test.ts` still holds task 6.5's
  swap comments and the stub ring test (`SWAPS` with its comment at L211-216, the test at L276-282). Check them in the same commit.
- **Workflow:** round 2's page list repeated round 1's wrong file name and left out the pages B1 named. Pass the real
  file names (`story-questions-parents-ask-about-ai-toys.md` and the three B1 pages) to the next step.
- **This page's title** still reads "round 1". If the index line should say "rounds 1 and 2", that edit is the main
  session's.
