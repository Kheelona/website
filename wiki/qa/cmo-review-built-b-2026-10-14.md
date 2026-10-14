---
title: "CMO built-page review, group B: the journal (/stories and its 20 articles), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - "Local production build in the main checkout (branch reset/website-v2, .next BUILD_ID G4RikeesMHpGqaQPS4YHg built 13 Oct 19:02 PDT after f6eac29; later commits are log-only), served by `SUPABASE_URL= SUPABASE_SERVICE_ROLE_KEY= npx next start -p 3572`, stopped after the review"
  - "Screenshots: wiki/raw/qa/2026-10-14/cmo-built/b/ (805 files, local only, never committed, D039); Playwright 1.63.0 from the repo's own pin, scratch scripts in the session scratchpad cmo-b/ (extract.cjs, shoot.cjs, frames.cjs, chip.cjs, ring4.cjs)"
  - "Approved mockups (frozen, D046): mockup/stories.html (built from mockup/pages/stories.html), mockup/story-learning-toys-for-a-three-year-old.html, story-talking-toys-and-late-talkers.html, story-what-to-look-for-in-a-safe-ai-toy.html"
  - ../site/pages/stories.md, ../site/pages/story-*.md (the 20 copy pages), ../site/strategy.md (§3.3, §3.4, §5), ../site/content-boundary.md
  - ../brand/positioning.md, ../brand/voice.md, ../brand/messaging.md, ../brand/audience.md, ../product/claims.md (§1, §3, §4), ../product/facts.md (languages)
  - deviations.md (V9), cmo-review-articles-5.17-2026-10-14.md, cmo-review-articles-5.18-2026-10-14.md (M6, M10, M13), cmo-review-articles-5.19-2026-10-14.md, cmo-review-article-fixes-5.20a-2026-10-14.md (N1), 5.20b, 5.20c
  - "../decisions/D015, D016, D017, D018, D025, D027, D028, D050, D053, D054 (P17-P24), ../open-questions.md P17"
  - "src/content/en-IN/stories/topics.ts, hub.ts, articles/index.ts and the 20 article modules; src/components/sections/TopicSection/topic-section.css; src/motion/motion.css; src/layouts/ArticleTemplate/article-page.ts; src/content/en-IN/stories/articles/articles.test.ts:109-113 (three incoming links)"
  - "Lighthouse: the main session's M2 reports, lighthouse-reports/2026-10-13/ (local-simulate and lp-tags-simulate for /stories and the learning-toys guide), read, not re-run; log.md 2026-10-14 05:11"
---

# CMO built-page review, group B: the journal

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). Task 7.1 acceptance, the CMO pass on
> the built pages. The article copy was CMO-approved before the build (5.17-5.19, 5.20a-c); this pass reads the
> pages as a parent sees them. It is input only: the founder alone signs off copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)).

## Verdict

**Pass. No blocking issue on the hub or any of the 20 articles.** Five minor issues (m1-m5), two test ideas, two
items for the founder.

What holds on every page: the guide answers the parent's question in the first block of the reading column; the
research lines keep their real ages and limits; Kheelu is never the subject of a brain or language outcome; "not a
toy for children under 3" and "keep a grown-up nearby" sit beside every product line; the 13 journal-close guides
carry exactly one in-text product link and the 7 talking guides carry none (P19); no head photo repeats between two
guides that link to each other, and each photo has one alt across the journal (5.20a N1 holds); bylines, dates and
sources match the copy pages; no internal content, competitor name, placeholder or unfinished text in the body,
metadata or JSON-LD. The build matches the four approved mockups chunk for chunk, apart from V9.

| # | Severity | Issue | Where | Route |
|---|---|---|---|---|
| m1 | minor | The screen-time topic still promises "which rules hold up"; the guide that answered it left (D053), and the old 3-6-9-12 URL lands right on that promise | hub, fold 2; the 308 target | Copywriter, then founder sign-off; Builder (module, parity rule) |
| m2 | minor | On laptops the five screen-time guides leave an empty, bordered sixth cell: it reads unfinished | hub at 1366 and 1440 | Builder; main session (V9) |
| m3 | minor | The related ring sends busy-hands readers to the data-law and safe-AI-toy guides, and data-law readers to busy-hands and how-to-get-talking (6.5's swap); same family as M6 | busy-hands, data law (also should-kids, hard questions) | main session (ruling, with M6), Builder |
| m4 | minor | Every guide shares the same og:image, the product photo: a speech guide shared on WhatsApp previews as a product advert, against P19's "no pitch" | all 20 articles (meta and BlogPosting image) | Builder |
| m5 | minor | Reduced motion: the WhatsApp bubble drops instantly onto the still-visible buy bar and covers its Pre-order button for about 200 ms while the bar fades | every page with the bar (chrome) | Builder, QA |

## Criteria

C1 positioning and audience (3 to 7; the close says "answers, then asks a question back"; brain credited to
conversation) · C2 answer first · C3 calm phone reading (360/390/412) and laptop layout (1366/1440) · C4 one obvious
next step (related guides or keep reading; the one in-text product link where strategy §3.3 allows it) · C5 photos
(no head repeat between linked guides, one alt per photo, no Kheelu on the talking guides) · C6 byline, dates, sources
· C7 nothing unfinished or untrue, no internal leakage (body, meta, JSON-LD) · C8 chrome and the WhatsApp bubble (D050)
· C9 mockup or template match · C10 motion, on and reduced · C11 metadata and share preview.

P = pass; m# = minor issue below; – = not applicable.

### The hub, `/stories`

| C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 |
|---|---|---|---|---|---|---|---|---|---|---|
| m1 | P (says what it is and who for, topic chips in the first screen at 360) | P | P | P | P | P | P | m2 (V9 otherwise matches) | m5 | P |

- First screen at 360, 390 and 412: eyebrow, H1 "Guides for parents of 3 to 7 year olds", lede, "Written by the
  Kheelona team in Bengaluru.", four topic chips, buy bar. "Each one answers the question first, then shows its
  sources" is now true of all 20 (every article has an answer block and 1 to 8 numbered sources). The "Rewritten in the
  build" labels are gone. Chips jump to their topic; an article's topic crumb returns to it
  (`hub-390-chip-ai-and-safety.jpg`, `should-kids-390-crumb-to-hub-topic.jpg`). The old 3-6-9-12 URL answers 308 to
  `/stories#screen-time` and the 2-year-old URL 308 to the 3-year-old guide (`redirect-3-6-9-12-390.jpg`).
- The close's button steps the buy bar aside, so one chilli button per phone screen (`hub-390-motion-06.jpg`).
- Screenshots: `hub-{360,390,412,1366,1440}-{motion,reduced}-NN.jpg` (360: 00-09; 390: 00-08; 412: 00-07; 1366:
  00-06; 1440: 00-05); mockup `mockup-hub-390-motion-00..08.jpg`, `mockup-hub-1440-motion-00..05.jpg`.

### The 20 articles

Screenshots for every article: `<id>-390-motion-NN.jpg` and `<id>-1440-motion-NN.jpg`. The five family
representatives also have `<id>-{360,412,1366}-motion-NN.jpg` and `<id>-{360,390,412,1366,1440}-reduced-NN.jpg`
(marked ★). Reduced and motion-on chunks are pixel-identical at rest on all 257 pairs (one 0.01% JPEG speck on
`screen-time-1366-reduced-05.jpg`), so motion adds nothing but the bar and bubble transitions.

| id (route `/stories/…`) | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | Chunks (390 / 1440) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ★ learning-toys (`learning-toys-for-a-three-year-old`) | P | P | P | P | P | P | P | P | P (mockup) | m5 | m4 | 00-09 / 00-07 |
| ★ safe-ai-toy (`what-to-look-for-in-a-safe-ai-toy`) | P | P | P | P | P | P | P | P | P (mockup) | m5 | m4 | 00-09 / 00-06 |
| ★ late-talkers (`talking-toys-and-late-talkers`) | P | P | P | P (keep reading) | P | P | P | P | P (mockup) | P (no bar) | m4 | 00-07 / 00-05 |
| ★ screen-time (`how-much-screen-time-for-a-3-to-6-year-old`) | P | P | P | P | P | P | P | P | P (template) | m5 | m4 | 00-08 / 00-06 |
| tantrums (`screen-time-and-tantrums`) | P | P | P | P | P | P | P | P | P | m5 | m4 | 00-07 / 00-05 |
| gentle-way (`the-gentle-way-off-the-phone`) | P | P | P | P | P | P | P | P | P | m5 | m4 | 00-07 / 00-05 |
| busy-hands (`busy-hands-no-screens`) | P | P | P | m3 | P | P | P | P | P | m5 | m4 | 00-07 / 00-05 |
| screen-free (`screen-free-does-not-mean-silent`) | P | P | P | P | P | P | P | P | P | m5 | m4 | 00-07 / 00-05 |
| talking-late (`talking-late-or-talking-little`) | P | P | P | P (keep reading) | P | P | P | P | P | P (no bar) | m4 | 00-07 / 00-05 |
| get-talking (`how-to-get-your-child-talking`) | P | P | P | M6 (open, not re-raised) | P | P | P | P | P | P (no bar) | m4 | 00-06 / 00-05 |
| learn-by-talking (`how-children-learn-by-talking`) | P | P | P | P (keep reading) | P | P | P | P | P | P (no bar) | m4 | 00-06 / 00-04 |
| collect-words (`how-children-collect-words`) | P | P | P | P (keep reading) | P | P | P | P | P | P (no bar) | m4 | 00-07 / 00-05 |
| bilingual (`raising-a-bilingual-child-in-india`) | P | P | P | M6 (open, not re-raised) | P | P | M10 (open, not re-raised) | P | P | P (no bar) | m4 | 00-07 / 00-05 |
| toy-that-talks (`a-toy-that-talks-vs-a-toy-that-listens`) | P | P | P | P (keep reading) | P | P | P | P | P | P (no bar) | m4 | 00-07 / 00-05 |
| hard-questions (`questions-parents-ask-about-ai-toys`) | P | P | P | P (see m3 ring) | P | P (P17 open) | P | P | P | m5 | m4 | 00-08 / 00-06 |
| should-kids (`should-kids-use-ai`) | P | P | P | P (see m3 ring) | P | P (P17 open) | P | P | P | m5 | m4 | 00-09 / 00-06 |
| ★ data-law (`ai-toys-and-indias-data-law`) | P | P | P | m3 | P | P (P17, P23 open) | P | P | P | m5 | m4 | 00-08 / 00-06 |
| ai-tutor (`does-a-three-year-old-need-an-ai-tutor`) | P | P | P | P | P | P (P17 open) | P | P | P | m5 | m4 | 00-08 / 00-05 |
| sharp-brain (`what-actually-builds-a-sharp-brain`) | P | P | P | P | P | P (P17 open) | P | P | P | m5 | m4 | 00-08 / 00-05 |
| early-years (`why-three-to-six-are-the-years-that-matter-most`) | P | P | P | P | P | P (P17 open) | P | P | P | m5 | m4 | 00-07 / 00-05 |

### What a parent sees, page by page

| id | Byline · first published · read time | Head photo | In-text product link | Related or keep-reading guides |
|---|---|---|---|---|
| learning-toys | The Kheelona team · 11 Sep 2026 · 4 min | myra-04 (body: advik-04) | 1 | sharp-brain, toy-that-talks, screen-time |
| safe-ai-toy | Aman Soni · 28 Jul 2026 · 5 min | tara-02 (body: Kheelu's belly module) | 1 | hard-questions, should-kids, data-law |
| late-talkers | The Kheelona team · 30 Jul 2026 · 3 min | kabir-04 | 0 | talking-late, get-talking, bilingual, all guides |
| screen-time | The Kheelona team · 28 Jul 2026 · 4 min | advik-01 | 1 | screen-free, tantrums, gentle-way |
| tantrums | The Kheelona team · 28 Jul 2026 · 2 min | kabir-03 | 1 | screen-time, gentle-way, busy-hands |
| gentle-way | The Kheelona team · 28 Jul 2026 · 3 min | tara-01 | 1 | tantrums, busy-hands, safe-ai-toy |
| busy-hands | The Kheelona team · 28 Jul 2026 · 3 min | ira-02 | 1 | gentle-way, **data-law, safe-ai-toy** (m3) |
| screen-free | The Kheelona team · 28 Jul 2026 · 3 min | ira-02 | 1 | learning-toys, screen-time, tantrums |
| talking-late | The Kheelona team · 28 Jul 2026 · 3 min | advik-04 | 0 | get-talking, collect-words, toy-that-talks, all guides |
| get-talking | The Kheelona team · 28 Jul 2026 · 3 min | ira-04 | 0 | data-law (M6), talking-late, collect-words, all guides |
| learn-by-talking | The Kheelona team · 28 Jul 2026 · 3 min | kabir-04 | 0 | early-years, sharp-brain, learning-toys, all guides |
| collect-words | The Kheelona team · 28 Jul 2026 · 3 min | myra-04 | 0 | talking-late, toy-that-talks, late-talkers, all guides |
| bilingual | The Kheelona team · 28 Jul 2026 · 3 min | tara-04 | 0 | late-talkers, should-kids (M6), ai-tutor (M6), all guides |
| toy-that-talks | The Kheelona team · 30 Jul 2026 · 3 min | ira-04 | 0 | collect-words, late-talkers, bilingual, all guides |
| hard-questions | Aman Soni · 11 Sep 2026 · 4 min | tara-03 | 1 | ai-tutor, early-years, learn-by-talking |
| should-kids | Aman Soni · 28 Jul 2026 · 5 min | kabir-02 | 1 | bilingual, ai-tutor, hard-questions |
| data-law | Apoorva Sahu · 11 Sep 2026 · 3 min | ira-01 | 1 | safe-ai-toy, **get-talking, busy-hands** (m3) |
| ai-tutor | Apoorva Sahu · 30 Jul 2026 · 3 min | myra-04 | 1 | should-kids, hard-questions, early-years |
| sharp-brain | Apoorva Sahu · 28 Jul 2026 · 3 min | ira-04 | 1 | learn-by-talking, learning-toys, screen-free |
| early-years | Apoorva Sahu · 28 Jul 2026 · 3 min | tara-04 | 1 | screen-free, learn-by-talking, sharp-brain |

Every byline equals its copy page's byline line (P17 "as drafted"). Shared head photos (kabir-04, myra-04, ira-02,
ira-04, tara-04) sit only on guides that do not link to each other, by related list or in-text link (script check over
all 20; P24 "as built").

### Per-criterion notes

- **C1, positioning.** The journal close on 13 guides reads "A toy that asks back. Kheelu by Kheelona is a screen-free
  plush toy for ages 3 to 7. It answers your child, then asks a question back." with D028's price sentence. Brain
  lines credit "a caring adult" (Harvard) and "adults" (Romeo 2018, "aged 4 to 6", "a link, not cause and effect").
  The AI guides state Common Sense Media's advice against Kheelu's own age band before the product answer (B3, P21).
  Scans over every page's body, meta and JSON-LD: no banned or retired wording (claims §4), no under-3 suitability (the
  only hits are "not a toy for children under 3"), no percentages except Common Sense Media's sourced "27%", no
  Tisseron or 3-6-9-12 anywhere (D053).
- **C2, answer first.** Every article opens its reading column with the answer card (54 to 114 words with the D025 line
  where it applies). At 1366 and 1440 the card is in the first screen (`safe-ai-toy-1440-motion-00.jpg`,
  `screen-time-1440-motion-00.jpg`). On phones the head photo comes first, as in the approved template; see test idea
  T1.
- **C3, calm reading.** Short paragraphs, numbered markers that jump to the sources, tinted cards for lists and
  "Try this", raw source URLs wrapped inside the column at 360 (`screen-time-360-motion-*.jpg`). Long H1s wrap to four
  or five lines at 360 and 390 and stay readable (`busy-hands-390-motion-00.jpg`, `screen-free-390-motion-00.jpg`).
- **C4, next step.** On journal-close guides: the in-text "Kheelu" link, related guides, then the close, whose button
  steps the bar aside. On the seven talking guides: "Keep reading" plus "All guides for parents of 3 to 7 year olds",
  no product link, no bar (B5, P19). See m3.
- **C6, sources and dates.** Dates render as "11 Sep 2026" (DS mechanics); JSON-LD `datePublished` matches and
  `dateModified` is 2026-10-12 or 2026-10-13 (see T2). Named bylines are Persons with `/team` ids in BlogPosting; team
  bylines point to the Organization.
- **C7, nothing untrue.** Product lines checked against claims §1 and facts: the wake-up button, light and minute of
  quiet (D018, including D018's own "Until the next press, nothing is heard, recorded or sent."), D020's providers line,
  36-month retention, "can't browse the internet", "says when it doesn't know", the BIS line ("applied for and is not
  yet granted"), Story mode as stories, poems and jingles (D027), eight named languages, up to 10, switching
  mid-sentence (facts.md:110-112), "We attack our own safety layer before every release" (claims §2, live, D017).
  Raw HTML holds no comments beyond React's markers and no internal words.
- **C8, chrome and bubble.** The bubble is on all 21 pages with D050's site text ("Hi Kheelona! I have a question about
  Kheelu."), `target=_blank`, `rel=noopener`; it lifts above the bar and drops when the bar steps aside
  (`frames-screen-time-close-390-motion-000ms.jpg`, `-060ms.jpg`). While scrolling it briefly sits over a line of text
  (the footer e-mail in `hub-390-motion-07.jpg`, the end of the close's phone number in
  `hard-questions-390-motion-06.jpg`, a card title in `hub-412-motion-00.jpg`): the trade-off D050 accepted for a
  floating bubble; it never covers the bar at rest, and the last screen clears it. Not raised. See m5 for the one
  moment it does cover the bar.
- **C9, mockups.** Build and mockup chunks match for the hub (`mockup-hub-390-motion-00/01.jpg` vs `hub-390-motion-00/01.jpg`),
  the learning-toys head (`mockup-learning-toys-390-motion-00/01.jpg`), the late-talker keep-reading end
  (`mockup-late-talkers-390-motion-05..07.jpg`, `-1440-motion-04.jpg`) and the safe-AI-toy head
  (`mockup-safe-ai-toy-1440-motion-00.jpg`). The 17 guides without a mockup follow the same template.
- **Lighthouse** (main session's M2 reports, read, not re-run; only two journal pages are in the set): `/stories`
  local median Performance 94, Accessibility 96, Best Practices 96, SEO 100, LCP 3.1 s simulated, CLS 0; learning-toys
  93 / 96 / 96 / 100, LCP 3.2 s. With tags: Performance 92-95, Best Practices 74 (known, M2). The simulated LCP sits
  above 2.5 s; the test plan's own CWV lab check is the authority, so this is for the main session to read, not a CMO
  failure.
- **Ad-landing readiness.** Journal pages are not ad destinations (strategy "In one screen" item 4; url-map §5). As
  search landings: title, H1 and answer heading carry the searched question (P18); contact is one tap away (bubble,
  the close's WhatsApp and call line, footer phone, e-mail and grievance link); policies are in the footer and the trust
  row (shipping, refunds, terms, privacy). Pass.

## Issues and fixes

### m1 · hub, fold 2 · the screen-time lead promises a guide that left → Copywriter, then founder; Builder

- **What a parent sees:** "Screen time. How much, which rules hold up, and what to do when the screen goes off."
  (`hub-390-motion-00.jpg`, `hub-1440-motion-00.jpg`). "Which rules hold up" was the 3-6-9-12 guide's job ("whether it
  holds up"); D053 removed it, and its old URL now lands on exactly this line (`redirect-3-6-9-12-390.jpg`), so the
  visitor who searched for the rule reads a promise nothing below keeps.
- **Fix:** `src/content/en-IN/stories/topics.ts:18` and `wiki/site/pages/stories.md:113`: "How much, what the
  guidelines say, and what to do when the screen goes off." (the screen-time guide gives the WHO, IAP and AAP limits age
  by age). The approved mockup keeps the old line (`mockup/pages/stories.html:34`, frozen), so the main session extends
  V9 with this sentence and the Builder adds it to the text-parity rule
  (`src/content/en-IN/stories/parity-deviations.test.ts`). A copy change: the founder signs it at Gate B (D015).

### m2 · hub at 1366 and 1440 · an empty bordered cell under the five screen-time guides → Builder; main session (V9)

- **What a parent sees:** two columns of guides, the fifth alone on the left and an empty white cell with its column
  rule on the right (`hub-1440-motion-01.jpg`, `hub-1366-motion-01.jpg`). It reads as a missing card. V9 describes the
  reflow to five rows but not this cell.
- **Fix:** `src/components/sections/TopicSection/topic-section.css`, inside the `@media (min-width: 900px)` block after
  line 88: let an odd last row span both columns and drop its rule:
  `.ks-topic__guides--two > li:last-child:nth-child(odd) { grid-column: 1 / -1; }` and
  `.ks-topic__guides--two > li:last-child:nth-child(odd) > .kh-listitem { border-right: 0; }` (DS layout only, no new
  value). The mockup's hidden row (V9 hide in `test/e2e/support/deviations.ts`) leaves the same empty cell on the
  mockup side, so the main session amends V9 for the laptop chunk and the parity run re-proves it. Alternative (a
  mockup change, the founder's): feature one screen-time guide as a photo card, as the other three topics do.

### m3 · busy-hands and data law · off-topic next steps in the related ring → main session (ruling, with M6), Builder

- **What a parent sees:** after "Busy hands, no screens" (screen-free activities at home), two of the three related
  guides are "What India's data law asks of a toy that listens" and "What to look for in a safe AI toy", then the
  pre-order close (`busy-hands-390-motion-04.jpg`, `-05.jpg`). After the data-law guide: "How to get your child
  talking" and "Busy hands, no screens" (`data-law-390-motion-05.jpg`, `-06.jpg`). Task 6.5 swapped the removed
  3-6-9-12 guide out of these two lists by pairing them with each other (module headers, `busy-hands-no-screens.ts:26`,
  `ai-toys-and-indias-data-law.ts:32`). The same ring also sends should-kids readers to the bilingual guide first and
  hard-questions readers to two learning guides (`should-kids-390-motion-07.jpg`, `hard-questions-390-motion-06.jpg`).
  This is M6's family; M6 itself (get-talking, bilingual) stays open and is not re-raised here.
- **Fix:** rebalance the ring once, with M6. A solver check over the 20 modules found a ring that removes all six
  off-topic links (get-talking → data law, bilingual → should-kids and AI tutor, busy-hands → data law, data law →
  busy-hands and get-talking) in 14 slot changes across 10 modules, keeping three related guides out and three in for
  every article (`articles.test.ts:109-113`), the three mockup guides' lists unchanged, and no head photo shared across
  a link:

  | Module (`related:` line) | Now | Proposed |
  |---|---|---|
  | how-much-screen-time (25) | screen-free, tantrums, gentle-way | busy-hands, screen-free, gentle-way (tantrums stays an in-text link) |
  | the-gentle-way (26) | tantrums, busy-hands, safe-ai-toy | tantrums, busy-hands, screen-free |
  | busy-hands (26) | gentle-way, data-law, safe-ai-toy | gentle-way, tantrums, early-years |
  | how-to-get-talking (28) | data-law, talking-late, collect-words | talking-late, bilingual, collect-words |
  | bilingual (30) | late-talkers, should-kids, ai-tutor | late-talkers, get-talking, learn-by-talking |
  | hard-questions (33) | ai-tutor, early-years, learn-by-talking | safe-ai-toy, ai-tutor, data-law |
  | should-kids (28) | bilingual, ai-tutor, hard-questions | safe-ai-toy, hard-questions, ai-tutor |
  | data-law (32) | safe-ai-toy, get-talking, busy-hands | safe-ai-toy, should-kids, ai-tutor |
  | ai-tutor (25) | should-kids, hard-questions, early-years | should-kids, data-law, hard-questions |
  | sharp-brain (27) | learn-by-talking, learning-toys, screen-free | learn-by-talking, learning-toys, early-years |

  The main session may prefer M6's own words for get-talking and bilingual (5.18 M6); any ring that keeps the four
  constraints will do. Update each module's header note and the copy pages' related lines.

### m4 · all 20 articles · one share image for every guide → Builder

- **What a parent sees:** sharing any guide (WhatsApp, the family group) previews `https://kheelona.com/og.png`, the
  studio product shot (all 21 pages' `og:image`; every module sets `meta.og: DEFAULT_OG`, for example
  `talking-toys-and-late-talkers.ts:20`, `busy-hands-no-screens.ts:20`). On the seven talking guides, which carry no
  pitch by the founder's ruling (P19), the shared card looks like a product advert above a speech-worry headline. The
  BlogPosting `image` reads the same value (`src/layouts/ArticleTemplate/article-page.ts:99`), so search engines get
  the product shot for every guide too. Task 1.5 item 3 planned OG images "1200 x 630 from DS photos with no text"; only
  `og.png` and `og/kheelu.jpg` exist.
- **Fix:** generate one 1200 × 630 OG image per article from its head photo with the existing asset pipeline
  (`scripts/assets/*`, outside `design-system/`, ≤ 200 KB), and set each module's `meta.og` to `{ image, alt }` with
  the head photo's alt (one alt per photo). The hub keeps `DEFAULT_OG`. Not a beta blocker; worth doing before Gate B,
  since most shares in this audience happen on WhatsApp.

### m5 · reduced motion · the bubble covers the bar's button for a moment → Builder, QA

- **What a parent sees (reduced motion on):** when the bar steps aside at the close, the bubble jumps down at once
  while the bar is still fading, so for about 200 ms it sits on the bar's "Pre-order Kheelu" button
  (`frames-screen-time-close-390-reduced-000ms.jpg`, `-060ms.jpg`; measured: bubble bottom at 828 px while the bar's
  opacity is 1.0, then 0.29). With motion on the two move together and nothing overlaps
  (`frames-screen-time-close-390-motion-000ms.jpg`). D050: the bubble never covers the bar. It affects every page with
  the bar, not only the journal.
- **Fix:** `src/motion/motion.css`, in the `prefers-reduced-motion` block (lines 243-246 set `.ks-wa { transition:
  none }`): add `html:not([data-buybar="shown"]) .ks-wa { transition: transform 0s linear var(--duration-base); }`, so
  the bubble still jumps without moving but only once the bar's fade has finished (the lift stays instant, before the
  bar fades in). QA adds the frame check to the bubble's motion spec.

## Test ideas (not failures)

- **T1, the answer on the first phone screen.** 13 of the 20 guides use a 4:5 head photo that fills the rest of the
  first phone screen, so at 390 the answer's heading starts 993 to 1,101 px down, about 1.2 screens
  (`get-talking-390-motion-00.jpg`, `ai-tutor-390-motion-00.jpg`); the seven wide (16:9) heads bring it to 746 to
  896 px, the edge of the first screen (`safe-ai-toy-390-motion-00.jpg`). The approved template does the same (`mockup-learning-toys-390-motion-00.jpg`).
  Test the wide crop on phones for the 4:5 guides and compare scroll depth to the answer in PostHog.
- **T2, show the update date.** Parents see only "First published 28 Jul 2026"; machines see `dateModified`
  2026-10-12 or -13. On research-heavy guides citing 2026 sources, "Updated 13 Oct 2026" beside it would add trust.

## For the founder

- **m1 is a copy change** to an approved line: the founder signs it (D015).
- **P17, a scope note (not a re-raise of the owner-read).** P17 as asked named "the three AI and data-law guides". As
  built, seven guides carry a named byline: Aman Soni on the safe-AI-toy, hard-questions and should-kids guides, and
  Apoorva Sahu on the data-law, AI-tutor, sharp-brain and early-years guides. All seven match their copy pages, so "as
  drafted" covers them; the two brain-development guides' own copy pages note that a named non-clinician author may read
  as more authority than the page claims. The founder may want the full list in front of him for the owner-read before
  Gate B.

## Evidence

- Folder: `wiki/raw/qa/2026-10-14/cmo-built/b/` (805 JPEGs, 1x, scrolled viewport chunks, never full-page; local only,
  D039). Names: `<id>-<width>-<motion|reduced>-NN.jpg`; `mockup-<id>-<width>-motion-NN.jpg` for the four approved
  mockups; `frames-screen-time-close-390-<motion|reduced>-<t>ms.jpg` for the bar and bubble transition;
  `hub-390-chip-ai-and-safety.jpg`, `should-kids-390-crumb-to-hub-topic.jpg`, `redirect-3-6-9-12-390.jpg`.
- Viewports: 360 × 800, 390 × 844, 412 × 915 (phone, touch), 1366 × 768, 1440 × 900.
- Not checked here (the suites own them): tracking parity, axe, sideways scroll, text parity. Lighthouse was read from
  the main session's reports, not run.
