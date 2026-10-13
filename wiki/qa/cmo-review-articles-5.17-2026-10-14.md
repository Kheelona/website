---
title: "CMO review, round 1: the six screen-time articles (task 5.17 copy stage), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - ../site/pages/story-how-much-screen-time-for-a-3-to-6-year-old.md, story-screen-time-rules-parents-swear-by.md, story-screen-time-and-tantrums.md, story-the-gentle-way-off-the-phone.md, story-busy-hands-no-screens.md, story-screen-free-does-not-mean-silent.md (Copywriter drafts, task 5.17; line numbers below refer to them)
  - ../site/pages/stories.md (fold 2, the six cards); src/content/en-IN/stories/articles/<slug>.ts (the six stubs: card, related, dates)
  - ../site/pages/story-learning-toys-for-a-three-year-old.md and src/content/en-IN/stories/articles/learning-toys-for-a-three-year-old.ts (the approved precedent: format, product line, no D025 line)
  - ../brand/positioning.md, ../brand/messaging.md (claims guardrails, words to stop using), ../brand/voice.md, ../site/content-boundary.md, ../site/strategy.md (§3.3, §5 /stories/* row)
  - ../product/claims.md (§1, §2, §3, §4, §8), ../product/facts.md (identity, age, modes, parent app)
  - ../research/keyword-map.md (§4.2 rows LRN-1 to LRN-5, BUY-6; §5.1; §5.2; §6.7 ST1-ST6, SR2, SF1)
  - ../research/source-verification.md (§3.2 C06, C31-C35; §3.3 C07; §4 ready lines; §5; §7)
  - "../raw/research/sources/: C06, C07 (serve and return), C31, C32, C33 (both statements), C34, C35 (Hiniker and the release; Gavrilova and Veraksa)"
  - "../decisions/D015, D016, D017, D025, D026, D027, D028, D041, D044"
  - "test/guards/banned-phrases.data.ts (every pattern) and test/e2e/content-integrity.spec.ts:25-41 (UNDER_THREE, COMPETITORS, ANALYTICS, PERCENT), run over every Copy block, title and meta: node, scratchpad script, 13 Oct 2026 06:01 PDT; output saved as guard-scan.txt below"
  - "src/content/types.ts:294-299, 356-469 (Answer and the article blocks); src/assets/icons.generated.ts (every icon the drafts name exists); src/content/en-IN/stories/articles/index.ts:116-137 (the shared journal close)"
  - "design-system/project/03-cast.md:7-17, 100-126 and the photos myra-01-breakfast-why, tara-02-evening-with-amma and kabir-02-block-rocket (-web.webp), looked at by eye (read-only); mockup/pages/stories.html (which photos the hub bands use); node scripts/ds-checksums.mjs: 643 files match"
  - "Re-read by the CMO Reviewer, 13 Oct 2026 06:00 PDT: https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/ (HTTP 200); https://web.archive.org/web/20260608053003/https://www.3-6-9-12.org/les-balises-3-6-9-12/ (the live host did not resolve from this machine). Evidence: wiki/raw/qa/2026-10-14/cmo/articles-5.17/ in the main checkout (local, uncommitted, D039)"
---

# CMO review, round 1: the six screen-time articles (task 5.17)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This review reads the copy as
> SKM would, against the positioning. It is input only: the founder alone signs off copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)), and where a page and a decision disagree, the decision
> wins. This is a copy review before the build: there is no built page, so no screenshot, motion or
> Lighthouse verdict yet.

## Verdict

**Pass: no blocking issue on any of the six.** Every research line traces to an excerpt or to a source I
re-read; no banned or retired wording (the repo's own guard patterns find nothing); nothing breaches D016 or
D025; nothing implies under 3; no internal content or competitor names; every title is 60 characters or
fewer and every meta 155 or fewer; every page answers first in 40 to 60 words; every card title and summary
is the stub's, word for word; every fold maps to an existing template block. The copy is calm, specific and
Indian (steel dabbas, autos at the signal, the queue at the clinic), it never shames a parent, and each page
gives one useful thing to do tonight before it mentions Kheelu once.

Seventeen minor fixes follow, M1 to M17. **The most important is M1** (the 3-6-9-12 page leaves out
Tisseron's 2020 AI markers, which the paragraph it cites names). It is minor by the definition of blocking
for this review, but I would not show the page at Gate B without it.

| Article | Verdict | Blocking | Minor |
|---|---|---|---|
| How much screen time (`/stories/how-much-screen-time-for-a-3-to-6-year-old`) | **Pass** | 0 | M4, M5, M6, M7, M16 |
| The 3-6-9-12 rule (`/stories/screen-time-rules-parents-swear-by`) | **Pass** | 0 | **M1**, M2, M3 |
| Screen time and tantrums (`/stories/screen-time-and-tantrums`) | **Pass** | 0 | M7, M8, M9, M10, M16 |
| The gentle way off the phone (`/stories/the-gentle-way-off-the-phone`) | **Pass** | 0 | M11, M12, M16 |
| Busy hands, no screens (`/stories/busy-hands-no-screens`) | **Pass** | 0 | M13, M14, M15, M16 |
| Screen-free does not mean silent (`/stories/screen-free-does-not-mean-silent`) | **Pass** | 0 | M17 |

## Criteria, article by article

ST = how much screen time · RL = 3-6-9-12 rule · TT = tantrums · GW = gentle way · BH = busy hands ·
SF = screen-free does not mean silent. "Pass" with an M number = passes, with a minor fix.

| # | Criterion | ST | RL | TT | GW | BH | SF |
|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice, to parents of 3 to 7 (calm, specific, no fear, the parent central) | Pass | Pass, **M1**, M3 | Pass, M8 | Pass, M12 | Pass, M13, M14 | Pass, M17 |
| 2 | Answers the parent's real question (keyword-map row) | Pass (LRN-1; one H2 per age, 6 and 7 shared, accepted), M5 | Pass (LRN-2, SR2 corrected per C34) | Pass (LRN-4; ST3's countdown and "protest works" correctly dropped) | Pass (LRN-3, ST6 without the warning tip) | Pass (LRN-5, ST5; age-3 H2) | Pass (BUY-6, SF1, CMP-5, GFT-4; ST4 parked, agreed) |
| 3 | Answer first, 40 to 60 words | Pass (54) | Pass (51) | Pass (54) | Pass (56) | Pass (55) | Pass (57) |
| 4 | One idea per section; phone-first lines | Pass, M6 | Pass | Pass | Pass | Pass | Pass |
| 5 | Every statistic and research statement traced | Pass (C06, C31, C32, C33, line by line) | Pass (C34, C31-C33), M2 | Pass (C35; the routines line now re-read at source), M9 | Pass (C32, C33), M11 | Pass (C31) | Pass (C07 verbatim, "a caring adult" kept) |
| 6 | D016 brain wording | Pass | Pass | Pass | Pass | Pass | Pass (the one brain line is C07's, with no product in that fold or the next three) |
| 7 | D025 speech and language | Pass (none) | Pass (none) | Pass (none) | Pass (none) | Pass (none) | Pass (see note 1) |
| 8 | D026 markers (numbered, linked, publisher, title, year, section, URL) | Pass | Pass | Pass | Pass | Pass | Pass |
| 9 | No banned or retired wording (claims §4; banned-phrases.data.ts) | Pass (0 hits) | Pass (0) | Pass (0) | Pass (0) | Pass (0) | Pass (0) |
| 10 | Ages 3 to 7; nothing implying under 3 | Pass, M7 | Pass (both age lines) | Pass, M7 | Pass (both) | Pass (both) | Pass (both) |
| 11 | No internal content; no competitor names (incl. metadata) | Pass | Pass | Pass (release percentages left out) | Pass ("video app", no brand) | Pass | Pass (no story-player brand) |
| 12 | At most one product link; no pitch on a speech page | Pass (1) | Pass (1) | Pass (1) | Pass (1) | Pass (1) | Pass (1; not a speech page) |
| 13 | Title ≤ 60 · meta ≤ 155 (characters) | Pass (56 · 132) | Pass (56 · 142) | Pass (60 · 144), M10 | Pass (57 · 138) | Pass (50 · 146) | Pass (51 · 149) |
| 14 | Approved card title and summary unchanged | Pass | Pass | Pass | Pass | Pass | Pass (the lead extends the summary; the card itself is unchanged) |
| 15 | Every fold maps to a template block | Pass | Pass | Pass | Pass | Pass | Pass |
| 16 | Price and CTA | Pass (shared close, sticky bar, no price in the body) | Pass | Pass | Pass | Pass | Pass |
| 17 | Head photo (DS cast, fit, repetition) | M16 | Pass | M16 | M16 | M16 | M17 |
| – | Visual at 360 to 1440, motion, Lighthouse, ad-landing readiness | not run: no build yet | | | | | |

**Note 1 (D025 on SF).** Fold 4 cites Harvard on "early language and social skills". D025 puts the
disclaimer on Terms and Meet Kheelu, and inside journal articles **about speech delay**; this is not one, and
the founder-approved learning-toys guide carries the same C07 line, a product link and no disclaimer
(`learning-toys-for-a-three-year-old.ts`, fold 4 and fold 12). So it passes as D025 is written. The task's
check ("the disclaimer present wherever speech or language development is discussed") reads wider than
D025; if the founder wants that reading, it changes the learning-toys guide too, and the founder decides it
once for both.

**How the checks were run.** Every Copy block, title and meta of the six pages went through every pattern in
`banned-phrases.data.ts` and the content-integrity spec's under-3, competitor, analytics and percentage
patterns (`guard-scan.txt`: no hit on any page). Each marked line was read against its excerpt in
`raw/research/sources/`. The one line whose excerpt lacked the passage (TT fold 5) I re-read at source:
the University of Washington release says "Some things did make that switch easier, like having routines,
disengaging at a natural stopping point or simply having a battery die" and "Parents reported that screen
time transitions were easier when they were part of a routine" (`uw-news-2016-05-05-two-minute-warnings.txt`,
lines 18 and 44). The line is verified; M9 is only about filing the excerpt.

## Fixes

### M1 · RL · Tisseron's 2020 AI markers are left out, and the page endorses "no device of their own before 6" just before offering an AI toy at 3 → Copywriter; main session (verifier)

- **Where:** fold 3 (line 121), fold 4 (line 139: "As a place to start, yes"), fold 7 (line 202, the product line);
  question 3 (lines 297-302).
- **What is wrong:** note ¹ cites the page's "opening paragraph", and that paragraph says that in 2020
  Tisseron created the 3-6-13-18 markers "pour faire face aux risques de l'intelligence artificielle pour le
  développement, l'imagination et la santé mentale des enfants et des adolescents"
  (`raw/research/sources/C34-tisseron-3-6-9-12-balises.md:32-35`). A parent who taps the marker meets that
  sentence first. Our page says the rule holds up "as a place to start", renders the 6 marker as "no device
  … of their own before 6", and then offers Kheelu, a connected AI toy, from age 3, without a word on the
  AI markers. Nothing on the page is false, but it reads as leaving out the part that touches us. The
  brand's own bar is the safe-AI-toy guide's ("Common Sense Media's advice covers that whole range … You
  should hear that from us"). The draft's own recommendation, read them "before launch", is too late: the
  founder signs this copy off at Gate B and should decide with the facts.
- **Fix, now (verified by the saved excerpt; no new reading needed):** add a paragraph at the end of fold 3:
  > In 2020, he added a separate set of markers, 3-6-13-18, about the risks of artificial intelligence for
  > the development, imagination and mental health of children and teenagers.¹ If you are weighing an AI
  > toy, our guide to [what to look for in a safe AI toy](https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy) sets out what to check first.

  (52 words; passes every guard. It is a guide link, not a second product link.) In fold 7, say plainly what
  Kheelu is: "… is one screen-free option: an AI plush toy for ages 3 to 7 that answers your child, then asks
  a question back." ("Screen-free AI toy" is the EXTERNAL schema category, [facts](../product/facts.md#identity);
  "AI" in a sub-line is within voice rule 1.)
- **Fix, before Gate B (main session starts the verifier):** read and save the 3-6-13-18 markers; then the
  Copywriter states in one short fold what they say for ages 3 to 7, in the safe-AI-toy guide's tone. The
  verifier also confirms Tisseron's daily minutes for 3 to 6 on the live page: the Internet Archive capture
  of 8 June 2026 has "de une demi heure à 3 ans à 1 heure maximum par jour à 6 ans"
  (`tisseron-balises-wayback-20260608053003.txt`, line 16; the live host did not resolve from this machine).
  Once saved, C34's ready line ⁵ (half an hour a day at 3 to an hour at most at 6) can go into fold 5. It is
  the most useful number on the page for a parent of a 3 to 6 year old.

### M2 · RL · "a ceiling of one hour a day from age two" has no end age → Copywriter

- **Where:** line 139.
- **What is wrong:** source verification C31 caveat 4: "WHO stops at age 4: any 'from two' line ends 'until
  five'". As written, a parent can read the one-hour ceiling as running to 7, which fold 5 then contradicts
  (under two hours from 5). The C34 ready line has the same gap, so the verification page should be aligned too.
- **Fix:** "… each set a ceiling of one hour a day from age two until five.² ³ ⁴"

### M3 · RL · "the quiet after the screen goes off" is not the parent's problem, and the journal says the opposite → Copywriter

- **Where:** line 202. SF line 126 says "Take the tablet away and the first thing you notice is the noise."
- **What is wrong:** a parent's hard part is filling the time (or the tears), not the quiet; and two journal
  pages now disagree about what happens when the screen goes off.
- **Fix:** "If the hard part is filling the time after the screen goes off, [Kheelu](…) is one screen-free
  option: …" (rest unchanged, with M1's "an AI plush toy").

### M4 · ST · "For this age" puts the IAP's 20-to-30-minute rule at 4 only → Copywriter

- **Where:** line 134 (the age-4 fold).
- **What is wrong:** the IAP item covers 24 to 59 months (`C32…md:44-49`), so it applies at 3 as well, and the
  age-3 answer above it never mentions it. A parent of a 3-year-old who reads only the answer misses it.
- **Fix:** "For three and four year olds, the IAP adds two details: no more than 20 to 30 minutes at a time,
  and a grown-up always supervising.²"

### M5 · ST · the age-5 fold opens with what the WHO does not say, not the answer → Copywriter

- **Where:** line 148, under "How much screen time for a 5-year-old?"
- **Fix (answer first, same sources):** "Under two hours a day, says the IAP, from 5 until 10, and that includes
  time on a screen for homework. Less is better.² The WHO's guideline stops at 4.¹"

### M6 · ST · the AAP's three things to avoid read as a muddle on a phone → Copywriter

- **Where:** line 210, second sentence.
- **What is wrong:** the relative clause in the middle of the list ("fast-paced programmes, which young children
  do not understand as well, apps with …") makes "apps" read as part of the clause.
- **Fix:** "It also asks parents to avoid three things: fast-paced programmes (young children do not
  understand them as well), apps with lots of distracting content, and anything violent.³" (Same words as
  `C33…md:63-64`.)

### M7 · ST, TT · the product line drops "It is not a toy for children under 3" → Copywriter

- **Where:** ST line 254; TT line 189.
- **What is wrong:** the other four pages and the approved learning-toys guide carry both age lines. These two
  need it most: ST is the page parents of 2-year-olds land on from "screen time for a 3-year-old", and the TT
  study is of children aged 1 to 5 (its paper's subtitle says "Toddlers").
- **Fix:** add "It is not a toy for children under 3." before "If your child is 3, keep a grown-up nearby while
  they play." on both.

### M8 · TT · "Need something ready for that moment?" points at the tears → Copywriter

- **Where:** line 189, straight after the tip "If tears come, stay close, stay calm and keep to what you said."
- **What is wrong:** "that moment" reads as the meltdown, so the line reads as offering Kheelu to a crying
  child: a sale at the parent's hardest moment, the very worry in the draft's own question 2.
- **Fix (with M7):** "Looking for something to hand over when the screen goes dark? [Kheelu](…) is one
  screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is
  not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play." (54 words.)

### M9 · TT · the routines line is verified, but its passage is not filed; the autoplay tip has a source it doesn't cite → main session (verifier or QA); Copywriter

- **Where:** line 160 (routines, natural break); line 184 (autoplay tip).
- **What is wrong:** `raw/research/sources/C35-hiniker-2016-screen-time-tantrums.md` holds only the two-minute
  sentence of the release, so the evidence trail for line 160 runs through the verification page's caveat 6
  alone. I re-read the release (above); it also says autoplay was "a frustrating and driving force behind many
  of their battles" (`uw-news-…txt`, line 19).
- **Fix:** the verifier adds a new excerpt file (raw is append-only), for example
  `raw/research/sources/C35-uw-news-2016-release.md`, with the routine, natural-stopping-point and autoplay
  passages, and updates C35's excerpt column. Optional for the Copywriter: mark the autoplay tip
  "Turn off autoplay, so the next episode does not start on its own.²"

### M10 · TT · the meta promises a "why" the page does not give → Copywriter

- **Where:** line 49.
- **What is wrong:** "why a two-minute warning made children more upset" promises an explanation; the page
  reports the finding and says to watch your own child (rightly, as the paper was not read).
- **Fix (142 characters):** "Screen time tantrums: one study found a two-minute warning made children more
  upset. What helps instead, and how to make switching off boring."

### M11 · GW · the AAP's "do not disturb" is stretched to times the AAP did not name → Copywriter

- **Where:** line 227 ("… set their phones to "do not disturb" at those times.²"). "Those times" are mornings,
  the car and dinner (line 225).
- **What is wrong:** the AAP's "during these times" means bedrooms, mealtimes and parent–child playtimes
  (`C33…md:66-67`); mornings and the car are ours.
- **Fix:** "And keep the rule yourself: at meals and at playtime together, the American Academy of Pediatrics
  suggests parents set their phones to "do not disturb".²"

### M12 · GW · "someone to answer" makes Kheelu the someone → Copywriter

- **Where:** line 243, the sentence before the product line.
- **What is wrong:** read straight into "Kheelu … answers your child", the toy becomes the person the slot
  needed. Voice rule 8 (the parent stays central) and the Home review's F1 point the other way: never let
  Kheelu stand in for the adult.
- **Fix:** "Look at what your slots needed in the end: something to do, and someone to talk to, whether that is
  you, a grandparent or a sibling." (The product line after it stays as drafted.)

### M13 · BH · the work-call advice adds a talking activity to the room where you are on a call → Copywriter

- **Where:** line 231 ("For the stretches you can't be interrupted, set the activity up in the room where you
  work, and add something that talks …"), after the scene at line 123 ("your call starts in ten minutes").
- **What is wrong:** a story played aloud, a grandparent's call or a talking toy next to a work call is exactly
  what a parent cannot have. A working parent will stop believing the page here.
- **Fix:** "For the stretches you can't be interrupted, pick a quiet one and set it up in the room where you
  work: water and a brush, dough, crayons on a roll of paper. Save the ones that talk (a story played aloud,
  a grandparent on a voice call) for the stretches when you can listen with half an ear." Then: "[Kheelu](…)
  is one more screen-free option for those stretches: …" (rest unchanged).

### M14 · BH · water on floor tiles is a slip waiting to happen at 3 → Copywriter

- **Where:** line 140.
- **Fix:** "a cup of water and a paintbrush, to "paint" an old slate" (the darkened slate dries and starts again;
  a school slate is in most Indian homes).

### M15 · BH · "need no grown-up to run them" sits beside "stories told … aloud" → Copywriter

- **Where:** line 108 (the answer). A told story needs a teller.
- **Fix:** "… real jobs like matching socks or washing potatoes, and stories played aloud." (The answer goes
  from 55 to 53 words, inside 40 to 60.)

### M16 · ST, GW and TT, BH · two pairs of linked guides share a head photo → Copywriter (copy pages name the image), Builder

- **Where:** `tara-04-reading-nook` heads ST (line 94) and GW (line 95), which link to each other (ST fold 6 and
  both related lists); `ira-04-paper-crown` heads TT (line 91) and BH (line 93), and TT's related list sends
  readers to BH. Each pair also has two different alts for the same picture.
- **Fix:** BH takes `myra-04-drawing-at-home-web.webp` (DS `03-cast.md:105`: "Screen-free play, creativity,
  parenting posts without selling"; Myra is the age-3 cast, which suits the page's age-3 fold); GW takes
  `kabir-04-planet-book-web.webp` at `kh-photo --wide` (DS `03-cast.md:125`: "Curiosity and reading"; the plan
  still swaps a screen slot for a book). Both photos already appear elsewhere (the hub's topic bands, the
  learning-toys and late-talker heads), but on no page that BH or GW links to, which is the repetition a
  reader actually meets. New alts follow the DS pattern; no name or age.

### M17 · SF · the head photo shows the 3-year-old cast child alone with Kheelu at the breakfast table → Copywriter, Builder; founder (question 1)

- **Where:** line 98 (`myra-01-breakfast-why`), question 1 (line 326). Looked at by eye: Myra (3½, DS
  `03-cast.md:9`) kneels at the dining table talking to Kheelu beside her plate; no grown-up in frame.
- **What is wrong:** three things meet at the top of this one page: the page's only research line is about
  exchanges "between a young child and a caring adult" (fold 4), and the picture shows the exchange with the
  toy instead (the Home review's F1 point, made by a picture); the page's own product line says "If your
  child is 3, keep a grown-up nearby", and the picture shows a 3-year-old alone; and the cluster's advice is
  that meals and dinner are for talking together, while the picture puts a talking device at the plate.
- **Fix:** keep Kheelu in the head, as the draft wants, but use `kabir-02-block-rocket-web.webp` at
  `kh-photo --wide` (DS `03-cast.md:123`, "Curiosity and STEM"; looked at by eye: Kabir, 6, builds a tower
  of wooden blocks on a rug, Kheelu sitting beside the tower). It shows exactly what the page is about, a
  screen-free toy in use with Kheelu as one more toy in the room, with no meal, no 3-year-old alone and no
  child-and-toy exchange standing in for the adult. It is used nowhere else on the site. (Not `tara-02`,
  Kheelu with Tara's mum: the mother holds a phone, wrong for this page's title.) If the founder prefers no
  Kheelu (option b), use a no-Kheelu photo that none of the three related guides uses.

## The founder's questions: the CMO view (input only)

| Page · question | Recommendation | Why |
|---|---|---|
| All six · byline | (a) "The Kheelona team" | Matches the approved guides' `TEAM_BYLINE`. There is no advisor ([D038](../decisions/D038-trust-content-rulings.md)); a named co-founder over summaries of WHO, IAP and AAP advice invites "who checked this?" |
| ST · H1 vs card | (a), acceptable | The lead repeats the card's summary word for word, so message match holds. If the founder wants the card's own words in the H1 as on the other five: "How much screen time is okay for a 3-year-old, and up to age 7?" keeps "3-year-old" in the H1 and the exact query in the answer heading |
| GW, BH, SF · H1 pattern | (a) | The parent who tapped the card lands on its words, and the search term is in the H1 |
| RL · 20-20-20, 3-3-3, 7-7-7 | (a) leave out | Fold 6 delivers "other rules" with a source behind each; an eye-strain rule on a screen-limits page invites the wrong comparison |
| RL · Tisseron's other material | (b), **before Gate B**, plus M1's interim sentence now | See M1 |
| TT · product link | (a), with M7 and M8 | Facts only, after the help, pointing at the switch-off moment, not the tears |
| SF · head photo | neither as drafted; see M17 | |
| SF · a language page? | (a) | D025 as written, and the learning-toys precedent (note 1) |
| SF · where ST4 lives | (a) | A speech question needs the D025 line and no pitch; give it to a talking-and-language guide (task 5.18) |
| GW · `updated` date (main session) | (b) the rewrite's date | A July `dateModified` on a full rewrite under-reports it to search engines; task 5.6 set the precedent |

## For the main session (not copy failures)

- **Observation, TT note ²:** the University of Washington release page now shows a sidebar link to a UW video,
  "Curiosity, frustration and antipathy: How kids play with AI toys" (about a month old). A parent who taps
  the marker may see it. Nothing in our copy depends on it; the verifier may want to read it before Gate B so
  the founder is not surprised.
- **Fixes routed:** copy M1 to M8, M10 to M15 → Copywriter; photos M16, M17 → Copywriter and Builder;
  source trail M1 (reading) and M9 (filing) → the verifier or QA, started by the main session. No speed or
  tracking item (no build yet).
- **Round 2** needs only the changed lines, plus the M1 fold once the verifier has read 3-6-13-18.

## Evidence

`wiki/raw/qa/2026-10-14/cmo/articles-5.17/` in the main checkout (local, uncommitted, [D039](../decisions/D039-repo-and-setup-answers.md)):
- `guard-scan.txt`: titles, metas, answer word counts and guard hits, per page.
- `long-sentences.txt`: every Copy-block sentence of 26 words or more (mostly lists after a colon, which read
  well on a phone; none needed a fix beyond M6).
- `uw-news-2016-05-05-two-minute-warnings.html` (SHA-256
  `cd9d105d50c127a9daf59a2a1758ab62788f04ddb2949c29d4425eaca9c49e8b`) and its plain-text extract `.txt`.
- `tisseron-balises-wayback-20260608053003.html` (SHA-256
  `41862d160f87cf56d561de6413480bd6d9c85abfd30f3849034978a85cd8825d`) and its plain-text extract `.txt`.

No screenshots: there is no built page. Photos were judged by eye from `design-system/project/assets/Photo
library/` (myra-01, tara-02, kabir-02); `node scripts/ds-checksums.mjs` still reports 643 files intact.
