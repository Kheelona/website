---
title: "CMO review, rounds 1 and 2: article copy for task 5.19 (six AI, safety and learning articles), 2026-10-14"
type: qa
updated: 2026-10-14
sources:
  - ../site/pages/story-questions-parents-ask-about-ai-toys.md, story-should-kids-use-ai.md, story-ai-toys-and-indias-data-law.md, story-does-a-three-year-old-need-an-ai-tutor.md, story-what-actually-builds-a-sharp-brain.md, story-why-three-to-six-are-the-years-that-matter-most.md (Copywriter drafts, task 5.19, 2026-10-14; untracked in worktree w5c-5.19)
  - ../site/pages/story-what-to-look-for-in-a-safe-ai-toy.md, story-learning-toys-for-a-three-year-old.md, story-talking-toys-and-late-talkers.md, stories.md, home.md (approved copy used as precedent)
  - "src/content/en-IN/stories/articles/{questions-parents-ask-about-ai-toys,should-kids-use-ai,ai-toys-and-indias-data-law,does-a-three-year-old-need-an-ai-tutor,what-actually-builds-a-sharp-brain,why-three-to-six-are-the-years-that-matter-most}.ts (stub modules: card title and summary); src/content/types.ts:358-470 (Article and prose blocks)"
  - ../brand/positioning.md, messaging.md, voice.md, audience.md
  - ../product/claims.md (§1-§4, §7, §8, D044 additions), ../product/facts.md (languages), ../product/age-band-review.md (§4)
  - ../research/source-verification.md (§4 ready lines C01, C02, C05, C07, C08, C09, C11, C14, C16, C20, C31, C32, C36, C37, C43, C44; §3 caveats; §5.5; §7)
  - "../raw/research/sources/: C16-common-sense-press-release-2026-01-22.md, C16-common-sense-ai-toys-risk-assessment.md, C14-brookings-cognitive-stunting.md, C05-harvard-brain-architecture.md, C05-ncf-fs-2022-brain-development.md, C02-nep-2020-para-4-1.md, C03-nep-2020-para-1-2.md, C07-harvard-serve-and-return.md, C08-harvard-serve-return-shapes-brain-circuitry.md, C20-dpdp-act-2023-official-text.md, C20-dpdp-commencement-gsr-843e-2025.md, C20-dpdp-rules-2025.md"
  - ../research/keyword-map.md (§2.3 LRN-12 to LRN-17, §4.2, §4.3, §5.1, §5.2, §6.5 AI3, DP1, AI5, AT1, §6.6 BD1, EY1)
  - ../site/strategy.md (§3.3, §5 /stories/* row), ../site/content-boundary.md, ../site/gate-a-open-items.md (B3, B15, B28, B34, B35, B37)
  - "../decisions/D015, D016, D018, D020, D025, D026, D035, D041, D044"
  - "test/guards/banned-phrases.data.ts (findBanned run over every quoted line of the six pages with node 24.13.0, 2026-10-14: 0 hits); test/guards/banned-phrases.test.ts:84-85"
  - "Character and word counts of every title, meta and answer block (python3 script in the session scratchpad, 2026-10-14); md5 of the close-block lines of all six pages (identical)"
  - design-system/project/03-cast.md:100-126 (read-only; photo table)
  - "Round 2: the six revised drafts (Copywriters' round 2, 2026-10-14); findBanned re-run (51 entries, node 24.13.0: 0 hits); counts, card and close checks re-run; photo sizes by sips (tara-03 837 × 1500, advik-04 1500 × 837); ../raw/qa/2026-10-14/cmo/5.19-r2-hard-questions-head-tara-03-4x5-centre-crop.jpg (local, uncommitted, D039)"
  - "Round 2: ../decisions/D025 (placement), ../brand/messaging.md:264, ../brand/voice.md rule 10, ../engineering/tasks.md row 5.18, ../site/strategy.md §4.1; ../decisions/D035 (customer-page training wording); ../raw/research/sources/C16-common-sense-ai-toys-risk-assessment.md:29-41"
---

# CMO review, round 1: article copy for task 5.19

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). A copy review before the build
> (brief Phase 5 step 1): there is no built page, so there are no screenshots, motion or Lighthouse results to
> judge yet; those come at the build checkpoint. This review reads the six drafts as SKM would. It is input
> only: the founder alone signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)), and where a
> page and a decision disagree, the decision wins.

## Verdict

| Article | Verdict | Blocking | Minor |
|---|---|---|---|
| [The hard questions parents ask about AI toys](../site/pages/story-questions-parents-ask-about-ai-toys.md) | **Pass with minor fixes** | none | M8, M9, M11 |
| [Should kids use AI? An honest answer from people who build it](../site/pages/story-should-kids-use-ai.md) | **FAIL** | **B1** | M1, M12 |
| [What India's data law asks of a toy that listens](../site/pages/story-ai-toys-and-indias-data-law.md) | **Pass with minor fixes** | none | M2, M3, M4, M11 |
| [Does a three-year-old need an AI tutor?](../site/pages/story-does-a-three-year-old-need-an-ai-tutor.md) | **Pass with minor fixes** | none | M5, M6, M7 |
| [What actually builds a sharp brain in the early years](../site/pages/story-what-actually-builds-a-sharp-brain.md) | **Pass** | none | none |
| [Why the early years matter most](../site/pages/story-why-three-to-six-are-the-years-that-matter-most.md) | **Pass with minor fixes** | none | M10, M11 |

**Round 1 fails on one blocking item (B1)**, a one-paragraph fix on the should-kids page. Everything else is
strong: all six pages are answer-first, honest, sourced line by line, on-voice, inside 3 to 7, carry the
approved card words unchanged, one in-text product link each, and the identical approved close. The guard is
clean on all six. M13 is not a copy defect: the banned-phrase test will go red with these files and needs the
main session.

## How this was checked

- **Guard:** `findBanned` from `test/guards/banned-phrases.data.ts`, run over every quoted line of the six
  pages (the same extraction `banned-phrases.test.ts:87-92` uses): **0 hits on all six.** A manual sweep for
  what the guard cannot catch (bare "safe" about Kheelu, "honestly", "toddler", "friend", "companion" for
  Kheelu, "tutor" for Kheelu, brain words near Kheelu, competitor and tested-toy names, chatbot brands,
  survey figures, unit counts): none found.
- **Counts** (characters for titles and metas; words for answers, markers excluded):

| Article | Title | Meta | Answer |
|---|---|---|---|
| Hard questions | 59 | 145 | 57 |
| Should kids use AI | 47 | 147 | 54 |
| Data law | 58 | 142 | 59 |
| AI tutor | 46 | 136 | 58 |
| Sharp brain | 49 | 144 | 58 |
| Early years | 57 | 151 | 56 |

- **Cards:** each H1 and lead compared with its stub module and [stories.md](../site/pages/stories.md) fold 4
  (lines 152-155) and fold 5 (lines 169-170): **all six word for word** (the modules' curly apostrophes aside).
- **Close:** the five close lines of all six pages hash identically, and match the hub close and the approved
  safe-AI-toy article (`stories.md:206-210`; `story-what-to-look-for-in-a-safe-ai-toy.md:272-276`): label
  "Pre-order Kheelu", the D041 price sentence with ₹4,999 (incl. GST) in it, the delivery and returns line,
  the help line. `cta` values `finale`, `sticky-bar`, `navbar`, `navbar-mobile` as Home.
- **Links:** exactly one in-text `/products/kheelu` link per page (the close's "See how it works" is the shared
  block). Other in-text links go to articles, `/privacy`, `/safety` or the buyer's guide.
- **Template:** every fold maps to a block in `src/content/types.ts:358-470` (`answer`, untitled and titled
  `part`, `p` with a bold `lead`, `h3`, `list` with `bullets` or `checks`, `questions`, `facts`, `callout`,
  `sources`, `related`, `close: "journal"`).
- **Traces:** every marked line was matched to its ready line in
  [source verification §4](../research/source-verification.md#4-ready-to-use-website-lines) and to the raw
  excerpt (table below).

## Pass/fail by criterion

| # | Criterion | Hard questions | Should kids | Data law | AI tutor | Sharp brain | Early years |
|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice: conversation and asking back as the mechanism, specifics over adjectives, the honest limit stated, a toy not a tutor, no fear | PASS | **FAIL** (B1) | PASS | PASS | PASS | PASS |
| 2 | Speaks to parents of 3 to 7 and answers the keyword-map row's real question (LRN-16, -14, -17, -15, -12, -13) | PASS | PASS | PASS (M3) | PASS (M5) | PASS | PASS |
| 3 | Answer first, 40 to 60 words, under a question-shaped H2 | PASS (57) | PASS (54; M12) | PASS (59; M4) | PASS (58) | PASS (58) | PASS (56) |
| 4 | One idea per section, phone-first lines | PASS (M9) | PASS | PASS | PASS | PASS | PASS (M10) |
| 5 | Every statistic or research statement traced (claims.md, source verification, raw excerpt) | PASS | **FAIL** (B1: a statement about what the sources' concerns are, not supported) | PASS (M2) | PASS | PASS | PASS |
| 6 | D016 brain wording: brain lines credit conversation with a caring adult; none shares a sentence, paragraph or fold with Kheelu | n/a | PASS (fold 6 vs fold 8) | n/a | PASS (folds 2-3 vs 6) | PASS (fold 7 brain-free) | PASS (fold 7 brain-free) |
| 7 | D025 speech and language | PASS | PASS | n/a | PASS | PASS | PASS |
| 8 | D026: every figure marked, linked in Sources, paired with something a parent can do | PASS | PASS (B1 rewrites the pairing) | PASS | PASS | PASS | PASS |
| 9 | No banned or retired wording (guard and manual) | PASS | PASS | PASS | PASS | PASS | PASS |
| 10 | Ages 3 to 7; nothing implies under 3; a grown-up nearby at 3 (D041) | PASS | PASS | PASS | PASS | PASS | PASS |
| 11 | No internal content, no competitor names | PASS | PASS | PASS | PASS | PASS | PASS |
| 12 | At most one product link, no pitch; close, label, price sentence and `cta` values as approved | PASS | PASS | PASS | PASS | PASS | PASS |
| 13 | Title ≤ 60, meta ≤ 155 | PASS | PASS | PASS | PASS | PASS | PASS |
| 14 | Card title and summary unchanged | PASS | PASS | PASS | PASS | PASS | PASS |
| 15 | Every fold maps to an Article block | PASS | PASS | PASS | PASS | PASS | PASS |
| 16 | One obvious next step (the journal close and the sticky bar; one in-text product link) | PASS | PASS | PASS | PASS | PASS | PASS |
| 17 | Visual, motion, Lighthouse, ad-landing readiness | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET |

Row 7: [D025](../decisions/D025-speech-and-language.md) places the disclaimer on Terms and `/products/kheelu`
and keeps a one-line in-article disclaimer only for "journal articles that are specifically about speech
delay". None of the six is. The C07 ("early language"), C09 (Broca's area) and C11 lines here stand on their
public sources and claim no outcome for Kheelu, exactly as on the approved learning-toys guide
(`story-learning-toys-for-a-three-year-old.md:138-140`), which ships them without the disclaimer. If the main
session reads D025 more strictly ("wherever language development is discussed"), the fix is the D025 line as a
`disclaimer` block under the C07 paragraph on the should-kids, tutor, sharp-brain and early-years pages, and
the learning-toys guide would need it too.

Row 17: there is no built page. Visual, motion and Lighthouse checks happen at the build checkpoint
(template parity with `story-learning-toys-for-a-three-year-old.html`). None of these articles is an ad
destination.

## Research lines traced

| Page, fold | Line (short) | Ready line | Raw excerpt | Verdict |
|---|---|---|---|---|
| Hard questions 4; Should kids 5 | Common Sense Media: avoid at 5 and under, extreme caution 6 to 12, "smart toys with voice-based interactions" | C16 | press release, paragraph 1 | Verbatim. Used under working default B3 (C16 itself is EXTERNAL IF CONFIRMED, G5; the founder signs B3 at Gate B) |
| Hard questions 7 | "create emotional attachment by design"; children 5 and under "cannot reliably distinguish AI from real people" | C16 | press release findings list; risk assessment, "Where they fall short" | Verbatim, as on the approved safe-AI-toy page |
| Should kids 5 | 27% of replies in tests of three toys; attachment, data, reliability | C16 | risk assessment, "What we found" | Verbatim; scoped to "three AI toys"; no toy named |
| Should kids 5 | Fairplay, November 2025, more than 150, "that season" | C36 | advisory | Verbatim |
| Should kids 4; AI tutor 5 | Winthrop, Brookings, May 2026, "cognitive stunting", "effortful thinking" | C14 | "Cognitive stunting" paras 1-2 | Verbatim; never "Brookings warns". Should kids adds the "general-purpose chatbots and AI companions not designed for learning" quote (framing question, `C14-brookings-cognitive-stunting.md:35-37`); the tutor page's "emerging" and "none of the findings she reports is about children as young as 3" match `:40-44` and `:63-64` and [§5.5](../research/source-verification.md#55-corrections-to-excerpt-files) |
| Should kids 6; AI tutor 3; Early years 4 | Harvard serve and return, "a caring adult", neural connections, early language | C07 | Key Takeaways 1, 3; body | Verbatim |
| AI tutor 2; Sharp brain 2; Early years 2 | Short forms of C07 (and C05 on the early-years page) | C07, C05 | as above | Faithful; "a caring adult" kept in each |
| Should kids 6 | Xu 2021: 90 children 3 to 6, longer answers, more different words, equal accuracy | C11 | Abstract, 4.3 | Verbatim ("aged between 3 and 6" to pass the dead-range guard) |
| Sharp brain 3 | "one of the most essential experiences"; a sound, a look or a gesture | C08 | 2011 page description | Verbatim; "especially in the earliest years" left out on purpose |
| Sharp brain 3 | Romeo 2018: 36 children aged 4 to 6, turns and Broca's area, a link not a cause | C09 | Abstract, Results | Verbatim; ages stated |
| Sharp brain 4; Early years 6 | AASM hours by age; association with attention, behaviour, learning, memory; Kurdziel nap study | C43 | AASM Recommendations; Kurdziel abstract | Verbatim |
| Sharp brain 5 | Toxic stress, scoped | C44 | Key Takeaways, Fast Facts | Verbatim |
| Sharp brain 6 | NEP 2020 "play-based, activity-based, and inquiry-based" | C01 (²) | NEP para 1.2 | Verbatim |
| Early years 3 | More than a million connections a second (an estimate); most active period; "new connections can form throughout life" | C05 | Fast Facts bullets 1-2 | Verbatim, attributed, called an estimate |
| Early years 3 | NCF-FS: most rapid in the first eight years | C05 (Indian) | s.1.1.3, p.17 | Verbatim |
| Early years 5 | Foundational Stage 3 to 8; "flexible, multilevel, play/activity-based learning" | C02 | NEP paras 4.1, 4.2 | Verbatim; not placed after any 85% line |
| AI tutor 4 | IAP: an hour a day at 3 and 4, sessions of 20 to 30 minutes, supervised; under two hours from 5 to 10, schoolwork counted. WHO: the same hour for watching screens, less is better | C32, C31 | IAP p.239; WHO p.8 | Faithful; WHO's "sedentary" scope respected |
| Data law 2, 4-7 | Under 18 is a child; s.9(1) "verifiable consent of the parent"; s.9(2), 9(3) quoted; rule 10(1); Fourth Schedule examples; s.1(2) stages; G.S.R. 843(E) 18 months, May 2027 | C20 | Act s.1(2), 2(f), 9; G.S.R. 843(E) (c); Rules 1(4), 10(1), Fourth Schedule | Verbatim quotes; official MeitY texts; re-read the Gazette before publishing (C20 caveat 3). One unmarked restatement: M2 |

Product lines (listening, providers, retention, no sale, no advertising, closed library, age-graded layer,
red-teaming, says when it doesn't know, says it's a toy, no secrets, languages and mid-sentence switching)
were each checked against [claims §1-§2](../product/claims.md#1-confirmed-by-the-founder), D018's FAQ and light
lines, D020's providers and retention lines, D038 and [facts, languages](../product/facts.md#languages). All
hold. "Instead of guessing" is already approved copy (`story-what-to-look-for-in-a-safe-ai-toy.md:192`,
`home.md:759`, `meet-kheelu.md:584`).

## Blocking

### B1 · Should kids use AI?, fold 5: the line after the two warnings overstates what the sources say

- **Criterion:** 5 (every research statement traced) and 1 (honesty, the B3 working default).
- **Where:** `story-should-kids-use-ai.md:169` ("Notice what these concerns are about: how a toy is built.
  That is something you can check."), with fold 7 at `:218` ("AI near a young child is not a yes or no.").
- **What is wrong:** the line tells a parent that the child-safety groups' concerns are about how a toy is
  built and can be checked. Common Sense Media's advice for ages 5 and under is not only about the build: its
  risk assessment says "Children age 5 and under cannot reliably distinguish AI from real people" and, for
  parents, "For children age 5 and under, AI toys are developmentally inappropriate -- choose traditional toys
  instead" (`C16-common-sense-ai-toys-risk-assessment.md:38` and `:41`, "Our recommendations"). The draft drops
  that quote, which the approved safe-AI-toy page keeps (`story-what-to-look-for-in-a-safe-ai-toy.md:117`), and
  turns the approved "**Most** of these worries are about how a toy is built" (`:136`) into all of them. On the
  one page whose job is "should my young child use AI at all", that reframes a categorical age warning as a
  checklist Kheelu passes, which the signed B3 answer in fold 8 then has to walk back.
- **Fix (Copywriter):** replace line 169 with two paragraphs, as the approved page does:
  > Common Sense Media also says children aged 5 and under "cannot reliably distinguish AI from real people".⁴
  >
  > Most of these concerns are about how a toy is built, and those you can check. The age advice is about young children themselves, and only you can weigh it for yours.

  Update note ⁴ (`:281`) to read `"What we found" and "Where they fall short"`, as the approved page's note ³
  does. In fold 7 (`:218`), mark the opinion as ours: "For us, AI near a young child is not a simple yes or
  no. It is a question of who built it, and why." (M1).

## Minor

| # | Article, criterion | File:line | What is wrong | Fix | Route |
|---|---|---|---|---|---|
| M1 | Should kids, 1 | `story-should-kids-use-ai.md:218` | "AI near a young child is not a yes or no" reads as a fact, two folds after a group that says no at 5 and under | "For us, AI near a young child is not a simple yes or no. It is a question of who built it, and why." (part of the B1 fix) | Copywriter |
| M2 | Data law, 5 | `story-ai-toys-and-indias-data-law.md:156` | "So the yes has to come from you, the parent, before your child's data is used." states what the law requires without a marker (the page's own rule at `:38-39` says unmarked lines never do), in the present tense for a section not in force until May 2027 | "So, once section 9 is in force, the yes has to come from you, the parent, before your child's data is used.¹" Counsel reads it with the rest of the page | Copywriter, counsel |
| M3 | Data law, 2 | `:209-218`, `:232-244` | Fold 8 asks parents to put six questions to every company; fold 9 answers four. Consent and tracking go unanswered on the page about consent, and `:218` ("So is a privacy policy nobody could follow.") sets up the privacy-policy pointer whose consent section is still a placeholder (G6). A careful parent will notice | Agree with the Copywriter's question 7 = (a) for beta only, with counsel's read, then (b) before production. Cut "So is a privacy policy nobody could follow." now. If the founder wants the gap said aloud on beta, a line for his signature: "We will add our own answers to the first and third questions here before Kheelu ships." | Copywriter, founder |
| M4 | Data law, 3 | `:110` | "Act, 2023, the DPDP Act, treats" stacks commas in the answer block that answer engines lift | "India's Digital Personal Data Protection Act, 2023 (the DPDP Act) treats anyone under 18 as a child.¹" (59 words still) | Copywriter |
| M5 | AI tutor, 2 | `story-does-a-three-year-old-need-an-ai-tutor.md:117`, `:135` | "A 3-year-old has no homework yet" and "has none of those" (homework, practice, tests) ring false to many Indian parents whose nursery or LKG child brings home worksheets | Answer: "No. A 3-year-old isn't ready for homework yet." (the keyword map's AT1 wording). Fold 3: "A 3-year-old doesn't need any of those." The card summary stays as approved | Copywriter |
| M6 | AI tutor, 1 | `:101-105` (Copywriter question 2) | The head photo is a 3-year-old asking Kheelu a question, under "Does a three-year-old need an AI tutor?" On a phone it reads as "here is the AI tutor", the frame the positioning refuses, and no grown-up is in frame on a page that advises one nearby at 3 | Choose question 2 option (b): a head photo without Kheelu (repeating `myra-04` is an acceptable cost), or a DS photo with a parent in frame | Copywriter, founder |
| M7 | AI tutor, 1 | `:232` | A page about AI for 3-year-olds that ends by pointing to an AI toy never says that child-safety groups advise against AI toys at this age; the pointer only says "For the safety questions" | Replace with: "What child-safety groups advise about AI toys at this age, and our answer, is in our guide to [what to look for in a safe AI toy](https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy)." No new source needed. Or the founder extends B3 to this page | Copywriter, founder |
| M8 | Hard questions, 2 | `story-questions-parents-ask-about-ai-toys.md:176-181` | The page owns "does an AI toy record your child", but "what is kept" answers with conversations only. The parent app's "Save voice recordings" switch (off keeps text only) is EXTERNAL ([claims, D044 additions](../product/claims.md#d044-additions-2026-10-11-what-the-real-app-screens-may-show)) and is the most direct honest answer; a parent who later finds it in the app may feel the article ducked it | After "in one tap.", add: "In the parent app, you choose whether voice recordings are saved; with it off, only the text is kept." Only once the founder confirms the default and how long saved recordings are kept; otherwise leave as drafted | Copywriter, founder |
| M9 | Hard questions, 4 | `:181` | Five sentences in one answer paragraph (retention, no sale, advertising, privacy pointer), about nine lines at 360 px; the DS asks for 2 to 3 | Split after "in one tap.": the no-sale, advertising and privacy sentences become their own paragraph in the same `questions` answer | Copywriter |
| M10 | Early years, 4 | `story-why-three-to-six-are-the-years-that-matter-most.md:139` | "you are still inside those years" puts the parent in their first eight years | "So if your child is between 3 and 7, they are still inside those years." | Copywriter |
| M11 | Data law, early years, hard questions: imagery | data law `:95-98`; early years `:101-104`; hard questions `:98-101` | `tara-04-reading-nook` is the head photo of two articles in this task. `advik-02-whispering-to-kheelu` (hard questions) is already the photo of /safety, Home, Meet Kheelu and /setup, so a parent arriving from /safety sees it again | Give the data-law page another DS library photo not used as an article head (without Kheelu, as the Copywriter intends). Consider an unused photo for the hard-questions head (B28: DS library only) | Copywriter, Builder |
| M12 | Should kids, 3 | `story-should-kids-use-ai.md:112` | The answer block, which answer engines lift on its own, gives the conditions under which AI suits a young child and never says that Common Sense Media advises against AI toys at 5 and under; fold 3 promises the disagreement up front | Founder's option: "Not the AI built for adults. Common Sense Media advises against AI toys at 5 and under.¹ If AI is part of a young child's play, it should be built for their age, unable to browse the internet and fully visible to you. It should ask your child questions, not just hand over answers, so your child does the thinking." (59 words; renumber the notes, Common Sense Media's press release becomes ¹) | Copywriter, founder |
| M13 | All six: build guard (not a copy defect) | `test/guards/banned-phrases.test.ts:84-85` | "covers the 18 copy pages" expects exactly 18 files in `wiki/site/pages`; with these six there are 24, so the test goes red as soon as the files are in the tree | The test's owner raises the count with the merge (guard-test ownership, `wiki/engineering/tasks.md`); never weaken the scan itself | Main session, QA |

## The Copywriters' questions: CMO input (the founder decides)

**Hard questions, should kids, data law**
1. H1 or keyword: **(a)**, card title as H1. Message match with the card the parent tapped matters more than
   the keyword in the H1; the title tag and the answer H2 carry it.
2. Bylines: **(a)** on all three, after each named founder reads and owns the page; for the data-law page,
   (b) only if counsel asks.
3. B3 on the hard-questions page: **(a)** is acceptable and the honest order. Note for the founder: (a) creates
   a second, shortened form of the signed answer (three sentences plus a new pointer sentence), so he signs
   two variants, not one; (b) would keep one answer reused verbatim, as B3 says.
4. Cut questions: **(b) for the shutdown question** once the founder gives a confirmed one-line answer (a fair
   question to a pre-launch company); (a) for the rest.
5. Chatbot age rules (C37): **(a)**, held (B37).
6. Start date: **(a)**, "May 2027", with the Gazette re-read before Gate B.
7. Consent and tracking on the data-law page: **(a) for beta, then (b)**; see M3.

**AI tutor**
1. Byline: **(a)**.
2. Head photo: **(b)**; see M6.

**Sharp brain**
1. Byline: **(a)**.
2. H1: **(a)**. "Sharp brain" is the parent's own search ("how to make child brain sharp") and the approved
   card; the title tag carries "brain develop".
3. Calm fold: **(a)**. Harvard's scoped definition is calmer than a vague "stress harms the brain", and the
   fold ends on what a parent can do (D026).

**Early years**
1. Byline: **(a)**.
2. NEP's 85% line: **(a), leave it out.** To the parent of a 6 or 7 year old, "before 6" reads as a deadline
   already missed, which is the fear this page exists to remove (voice rule 4); Harvard and the NCF make the
   point without it.
3. Slug: **(a)**, keep it; no visible copy repeats "three to six".

## What works, and should not be lost in the fixes

- **Honesty as the sell.** "Read every answer below as coming from an interested party", "You should hear
  that from us", "Judge it by the same test", "No toy replaces the people who talk with your child every day,
  ours included": this is the positioning's "state the honest limit" done well, and it is what earns the one
  product link on each page.
- **Mechanism, not adjectives.** Listening is always the wake-up button, the light and the minute of quiet;
  never "safe" about Kheelu.
- **Indian and phone-first.** The dosa exchange, Anganwadi and Grades 1 and 2, late dinners and family
  functions, "a dupatta that can be a cape or a river"; short house lines after every long source line.
- **Calm.** Every figure is followed by something a parent can do tonight; "Neither is a deadline."

## Not checked here

Screenshots at 360, 390, 412, 1366 and 1440 px, motion, Lighthouse and ad-landing readiness need the built
pages. They are due at the build checkpoint for task 5.19 (template parity with
`story-learning-toys-for-a-three-year-old.html`; evidence then under `wiki/raw/qa/<date>/cmo/`).

---

## Round 2

> The six drafts re-read after the Copywriters' round-2 fixes, with the same criteria and method as round 1.
> This is still a copy review before the build: no screenshots, motion or Lighthouse yet. It is input only; the
> founder signs off copy ([D015](../decisions/D015-founder-signs-off-copy.md)).

### Round 2 verdict

| Article | Verdict | Blocking | Minor still open |
|---|---|---|---|
| [The hard questions parents ask about AI toys](../site/pages/story-questions-parents-ask-about-ai-toys.md) | **PASS** | none | M8 (held for the founder) |
| [Should kids use AI? An honest answer from people who build it](../site/pages/story-should-kids-use-ai.md) | **PASS** (B1 closed) | none | R2-1 |
| [What India's data law asks of a toy that listens](../site/pages/story-ai-toys-and-indias-data-law.md) | **PASS** | none | M3 (held for the founder and counsel) |
| [Does a three-year-old need an AI tutor?](../site/pages/story-does-a-three-year-old-need-an-ai-tutor.md) | **PASS** | none | R2-2 |
| [What actually builds a sharp brain in the early years](../site/pages/story-what-actually-builds-a-sharp-brain.md) | **PASS** (unchanged since round 1) | none | none |
| [Why the early years matter most](../site/pages/story-why-three-to-six-are-the-years-that-matter-most.md) | **PASS** | none | none |

**Round 2 passes: no blocking issue remains.** B1 is fixed as asked, and all twelve copy minors from round 1
are closed except two that are rightly waiting on the founder (M3, M8). Two small new copy notes (R2-1, R2-2)
and two items for the main session (M13, R2-3) do not stop the build.

### What was re-checked

- **Guard:** `findBanned` (51 entries) over every quoted line of the six pages, using the same extraction as
  `banned-phrases.test.ts:87-92` (node 24.13.0): **0 hits on all six.** Manual sweep of the lines new in
  round 2 for what the guard cannot catch ("safe" about Kheelu, "honestly", "friend", "tutor" for Kheelu,
  brain words near Kheelu, competitor or tested-toy names, chatbot brands, survey figures, unit counts): none.
  "Safe" appears only in the safe-AI-toy guide's title, Fairplay's advisory title and the DPDP Rules'
  "to keep them safe".
- **Counts** (characters for the title and meta; words for the answer, markers excluded):

| Article | Title | Meta | Answer |
|---|---|---|---|
| Hard questions | 59 | 145 | 57 |
| Should kids use AI | 47 | 147 | **60** (was 54; at the limit) |
| Data law | 58 | 142 | 59 |
| AI tutor | 46 | 136 | 59 (was 58) |
| Sharp brain | 49 | 144 | 58 |
| Early years | 57 | 151 | 56 |

- **Cards:** each H1 and lead compared again with its stub module
  (`src/content/en-IN/stories/articles/<slug>.ts`, `card.title`, `card.summary`): **all six word for word**
  (the modules' curly apostrophes aside).
- **Close:** the five close lines of all six pages hash identically (`5de0b987…`), as in round 1: label
  "Pre-order Kheelu", ₹499 today, ₹4,500 before delivery, ₹4,999 in total (incl. GST), mid-November, 7-day
  returns, the help line; `cta` values `finale`, `sticky-bar`, `navbar`, `navbar-mobile`.
- **Links:** exactly one in-text `/products/kheelu` link per page, plus the close's shared "See how it works".
- **Template:** every fold still maps to an `Article` block (`src/content/types.ts:358-470`). The two head
  photo changes fit the head as built: `ArticleHead.tsx:44-53` puts a portrait image in the DS 4:5 frame and a
  wide one in the 16:9 frame.

### Round 1 items: status

| # | Status | Where | Check |
|---|---|---|---|
| B1 | **Closed** | `story-should-kids-use-ai.md:177`, `:179`; note ⁴ `:301` | The quote matches `C16-common-sense-ai-toys-risk-assessment.md:37-38` ("Where they fall short"). Paragraph 4 keeps the approved "Most of these … are about how a toy is built" and places the age advice where the source places it: "Developmentally inappropriate" (`:37-41`); "engagement-focused design and replacement of time spent engaging in more beneficial relationships" (`:29-32`); the excerpt's own note: the page "grounds the under-5 advice in development" (`:52-53`). It no longer reads as a checklist that Kheelu passes. |
| M1 | Closed | `story-should-kids-use-ai.md:236` | "For us, … not a simple yes or no" is now clearly our view |
| M2 | Closed | `story-ai-toys-and-indias-data-law.md:163` | Marker ¹ and "once section 9 is in force" added |
| M3 | **Half closed; the rest is the founder's** | data law `:222-229`, `:248-258`, question 4 `:385-397` | The line "So is a privacy policy nobody could follow." is cut. Kheelona's consent and tracking answers are rightly held: G6, counsel ([D029](../decisions/D029-grievance-officer-legal-review.md)). The page makes no compliance claim, and its providers line stays scoped to the providers, as [D035](../decisions/D035-model-training-opt-out.md) requires for customer pages. Counsel reads the page before Gate B |
| M4 | Closed | data law `:115` | "(the DPDP Act)" in brackets; still 59 words |
| M5 | Closed | AI tutor `:123`, `:146` | "isn't ready for homework yet" (the keyword map's AT1); "doesn't need any of those". The card summary is unchanged, as it must be |
| M6 | Closed | AI tutor `:102-111` | `myra-04` (4:5, no Kheelu, Myra 3½); the repeat with the learning-toys head is accepted |
| M7 | Closed | AI tutor `:245` | The pointer says what the guide holds (the groups' advice and our answer) and comes before the product line |
| M8 | **Held for the founder** | hard questions `:206-209`, question 5 `:409-417` | Correctly held. The line needs the switch's default, how long saved recordings are kept, and whether the switch affects training (D035). The CMO's input is unchanged: (b) once answered |
| M9 | Closed | hard questions `:192`, `:194` | Two paragraphs of two and three sentences |
| M10 | Closed | early years `:142` | "they are still inside those years" |
| M11 | Closed | data law `:96-103`; hard questions `:99-112` | Data law: `advik-04` (16:9, 1500 × 837, no Kheelu). Elsewhere it appears only as an in-body figure on the learning-toys guide, never as a head. Hard questions: `tara-03` (9:16, 837 × 1500), used on no other page. A centred 4:5 crop keeps both faces and Kheelu whole (evidence: `../raw/qa/2026-10-14/cmo/5.19-r2-hard-questions-head-tara-03-4x5-centre-crop.jpg`). It also puts a grown-up in frame, which this page needs |
| M12 | Closed, and better than asked | should kids `:113` | The answer carries both halves of the advice (5 and under; 6 to 12). The CMO's draft had only the first, and B3 is "cite it in full" |
| M13 | **Open (not copy)** | `test/guards/banned-phrases.test.ts:85` | `toBe(18)`; the worktree now holds 24 copy pages. The test's owner raises the count with the merge. Main session, QA |

### Pass/fail by criterion (round 2)

| # | Criterion | Hard questions | Should kids | Data law | AI tutor | Sharp brain | Early years |
|---|---|---|---|---|---|---|---|
| 1 | Positioning and voice | PASS | PASS (R2-1) | PASS | PASS (R2-2) | PASS | PASS |
| 2 | Parents of 3 to 7; the keyword-map row's real question (LRN-16, -14, -17, -15, -12, -13) | PASS | PASS | PASS (M3 open) | PASS | PASS | PASS |
| 3 | Answer first, 40 to 60 words, under a question H2 | PASS (57) | PASS (60) | PASS (59) | PASS (59) | PASS (58) | PASS (56) |
| 4 | One idea per section, phone-first lines | PASS | PASS | PASS | PASS | PASS | PASS |
| 5 | Every statistic or research statement traced | PASS | PASS | PASS | PASS | PASS | PASS |
| 6 | D016 brain wording | n/a | PASS | n/a | PASS | PASS | PASS |
| 7 | D025 speech and language (see R2-3) | PASS | PASS | n/a | PASS | PASS | PASS |
| 8 | D026: figures marked, linked, paired with an action | PASS | PASS | PASS | PASS | PASS | PASS |
| 9 | No banned or retired wording | PASS | PASS | PASS | PASS | PASS | PASS |
| 10 | Ages 3 to 7; nothing implies under 3; a grown-up nearby at 3 | PASS | PASS | PASS | PASS | PASS | PASS |
| 11 | No internal content, no competitor names | PASS | PASS | PASS | PASS | PASS | PASS |
| 12 | One product link, no pitch; close, price and `cta` as approved | PASS | PASS | PASS | PASS | PASS | PASS |
| 13 | Title ≤ 60, meta ≤ 155 | PASS | PASS | PASS | PASS | PASS | PASS |
| 14 | Card title and summary unchanged | PASS | PASS | PASS | PASS | PASS | PASS |
| 15 | Every fold maps to an Article block | PASS | PASS | PASS | PASS | PASS | PASS |
| 16 | One obvious next step | PASS | PASS | PASS | PASS | PASS | PASS |
| 17 | Visual, motion, Lighthouse, ad-landing readiness | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET | NOT YET |

### New or changed lines traced in round 2

| Page, line | Line (short) | Source | Verdict |
|---|---|---|---|
| Should kids `:113` | "Common Sense Media advises against AI toys at 5 and under, and extreme caution from 6 to 12.¹" | `C16-common-sense-press-release-2026-01-22.md:22-25` (paragraph 1: "avoid giving AI toys … to children age 5 and under, and exercise extreme caution … age 6 to 12") | Faithful short form, both halves, marked. It agrees with B3's own short form at `:257` |
| Should kids `:177` | Children aged 5 and under "cannot reliably distinguish AI from real people".⁴ | `C16-common-sense-ai-toys-risk-assessment.md:37-38` | Verbatim; note ⁴ names "Where they fall short" |
| Should kids `:179` | "Most of these concerns are about how a toy is built … The age advice is about young children themselves" | Our own voice; the approved safe-AI-toy page, fold 4; risk assessment `:29-32`, `:37-41`, `:52-53` | No research claim. It concedes rather than argues |
| Should kids `:236` | "For us, AI near a young child is not a simple yes or no." | Our own view, marked as ours | PASS |
| Data law `:115` | DPDP answer with "(the DPDP Act)" | C20 ready line; `C20-dpdp-act-2023-official-text.md:20-30`; `C20-dpdp-commencement-gsr-843e-2025.md:21, 25` | Unchanged in substance |
| Data law `:163` | "So, once section 9 is in force, the yes has to come from you …¹" | s.9(1), `C20-dpdp-act-2023-official-text.md:26`; G.S.R. 843(E) | Marked, in the right tense; counsel reads it |
| AI tutor `:123` | "A 3-year-old isn't ready for homework yet." | Keyword map AT1 (`keyword-map.md:592-593`) | Our own voice, no claim |
| AI tutor `:245` | "What child-safety groups advise about AI toys at this age, and our answer, is in our guide …" | Points to the approved safe-AI-toy guide, folds 3 and 5 | States where the advice is, not what it says; no new source needed |
| Early years `:142` | "So if your child is between 3 and 7, they are still inside those years." | NCF-FS, `C05-ncf-fs-2022-brain-development.md:27-30` (first eight years) | Plain arithmetic, no peak-age claim |

### New minor items

| # | Article, criterion | File:line | What is wrong | Fix | Route |
|---|---|---|---|---|---|
| R2-1 | Should kids, 1 (voice: the parent decides) | `story-should-kids-use-ai.md:113` | The sentence straight after the Common Sense Media advice, "If AI is part of a young child's play, it should be …", reads as if the advice had already been set aside. The B3 answer leaves that choice to the parent ("so you can check it yourself and decide", `:257`), and the answer block is the part answer engines lift on its own | "If you choose AI for your child's play, it should be built for their age, unable to browse the internet and fully visible to you." (answer 59 words) | Copywriter |
| R2-2 | AI tutor, 4 (phone-first clarity) | `story-does-a-three-year-old-need-an-ai-tutor.md:247` | "Kheelu is built around this list" now comes one paragraph after the list, because the M7 pointer sits between them. On a phone, "this list" points at the pointer paragraph | "[Kheelu](…) is built around the list above: a screen-free plush toy …". Keep the pointer where it is, so the advice comes before the product line | Copywriter |
| R2-3 | All six, 7 (D025): a reading to confirm, not a defect | the C07, C09 and C11 paragraphs (should kids `:204-206`; AI tutor `:123`, `:148`; sharp brain `:115`, `:135-137`; early years `:166`) | The round-2 brief asks for "the disclaimer present wherever speech or language development is discussed". [D025](../decisions/D025-speech-and-language.md) says less: the disclaimer goes on Terms and `/products/kheelu`, and inside "journal articles that are specifically about speech delay". [Messaging](../brand/messaging.md) line 264, [voice](../brand/voice.md) rule 10 and [tasks](../engineering/tasks.md) row 5.18 ("speech-delay answers only with the D025 disclaimer") all agree with D025. None of the six pages is about speech delay. Every language line carries a public-source marker and claims no outcome for Kheelu. So it is PASS under D025 as written, as in round 1 (row 7 note), and the decision wins. [Strategy §4.1](../site/strategy.md) ("refreshed to the rules (… D025 disclaimer)") is loose wording that fits D025 | None under D025. If the main session rules the wider reading instead, add a `disclaimer` block with D025's line after the first C07 paragraph on should kids (fold 6), AI tutor (fold 3), sharp brain (fold 3, after the Romeo paragraph) and early years (fold 4), and on the approved learning-toys guide for consistency | Main session (ruling); then Copywriter |

### For the founder's eye at Gate B (no change asked)

- **Hard-questions head photo.** `tara-03` is a bedtime scene, and Kheelu's speaker ring has the soft glow it
  has in most DS photos (`tara-01` too; `advik-02` does not). On the page about recording, a parent could take
  the scene as the toy listening at bedtime. The father in frame, and fold 5's "even if it's left in a corner,
  it doesn't stay listening", answer that. The CMO keeps it: a grown-up in frame matters more here. The
  alternative is `tara-01-naming-feelings` (4:5, unused, Tara alone with Kheelu).
- **Common Sense Media three times on the should-kids page** (answer, fold 5, fold 8). This is on purpose:
  the answer is lifted alone, fold 5 is the full citation, and fold 8 is the signed answer. Keep it.
  Whatever the founder signs for B3 applies to all three.

### The Copywriters' round-2 questions: CMO input (the founder decides)

- **Should kids, question 3** (Common Sense Media in the answer block): **(a)**, with R2-1.
- **Hard questions, question 5** (the "Save voice recordings" switch): **(b)** once the founder answers on
  the default, how long saved recordings are kept, and whether the switch affects training (as M8).
- **Data law, question 4:** **(a) for beta, then (b)**. The CMO's optional line ("We will add our own answers to
  the first and third questions here before Kheelu ships.") goes in only with the founder's signature.
  **Question 5:** counsel's read; no CMO change.
- **AI tutor, question 2:** **(b)**, as drafted. **Question 3:** **(a)**, the pointer. B3's signed answer stays
  on the pages about AI toys.

### Still not checked

Screenshots at 360, 390, 412, 1366 and 1440 px, motion, Lighthouse and ad-landing readiness come at the
task 5.19 build checkpoint. That is also when the `tara-03` crop and the `advik-04` 16:9 head are checked as
rendered.
