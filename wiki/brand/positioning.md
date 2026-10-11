---
title: Positioning (SKM, October 2026), with the 3–7 correction
type: brand
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - wiki/raw/positioning/Kheelona Positioning (1).pdf
  - wiki/raw/brief/kickoff-brief.md (sections 1, 2, 3)
  - tag archive/pre-reset-2026-10-10 (= 77552ff, production): src/config/site.ts, src/lib/product-facts.ts, src/app/(site)/{team,safety}/page.tsx
  - "git grep -i -E 'miko|mywonder|pookie|alexa' archive/pre-reset-2026-10-10 -- src public (2026-10-10)"
  - design-system/project/01-writing.md, 03-cast.md (read-only)
  - https://kheelona.com/ (homepage fetched 2026-10-10)
  - "Site markers (2026-10-10): wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md, wiki/product/claims.md section 8"
  - "Founder's rulings applied 2026-10-11: wiki/decisions/D016 (brain wording), D017 (live behaviour claims), D018 (wake-up button), D019 and D020 (voice providers), D021 and D022 (returns, warranty), D024 (GST), D026 (public statistics), D027 (Story mode), D028 (price wording); wiki/open-questions.md section F (R5 and R9, answered 2026-10-10)"
---

# Positioning

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)): it shapes what the site says and how; nothing here is published as is. What may be published: [content boundary](../site/content-boundary.md).

**Status: a proposal, not yet proven.** The deck calls itself a "Positioning proposal" (pdf p.1), and the
strategy says "The direction is set; the proof is not" (docx §12 L405). Most proof points still need
product work or sign-off; see [messaging.md, proof points](messaging.md#proof-points).

**Site markers on this page apply the founder's rulings of 2026-10-10 and 2026-10-11** (all ten in
[open questions, section F](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)
are answered), so no PENDING RULING mark remains. The mark key, and the new lines the rulings confirm,
are on [messaging.md](messaging.md#confirmed-candidate-lines).

## The two source documents

| | Strategy (docx) | Deck (pdf) |
|---|---|---|
| Title | Kheelona Positioning Strategy | "Brain development, built through conversation" |
| Byline | "Oct 8, 2026 · @NG" (L2) | "Nayantara · October 2026" (p.1) |
| Shape | 13 sections, 3 figures, a source list | 17 slides; slides 14–16 (future learning modules) are not in the docx |

The brief attributes both to SKM, the CMO (brief §1, §3). Neither document names SKM. Treat the docx as
the full statement and the pdf as its summary; differences are listed [at the end](#pdf-vs-docx).

**Citation key** (used on every brand page):
- `docx §N L<n>`: the docx's Nth Heading-2 section, line *n* of `textutil -convert txt -stdout`
  (436 lines). The docx's own cross-references ("section 5", "section 7") resolve with this numbering.
  §1 Recommendation (L3) · §2 Use brain development in these conditions (L17) · §3 Market (L64) ·
  §4 Science (L89) · §5 Category (L128) · §6 Who it's for (L159) · §7 Statement and alternatives (L181) ·
  §8 Pillars (L227) · §9 Messaging (L252) · §10 Claims guardrails (L320) · §11 90-day plan (L378) ·
  §12 Open questions (L404) · §13 Sources (L419).
- `Fig 1–3`: the docx's three embedded images (four-skills flow in §4, category map in §5, pillars in §8).
- `pdf p.N`: page N of 17.

## The age correction

The docs market to **4 to 7**. The brief overrides this to **3 to 7** (brief §2 L25) and warns it is not a
find-and-replace: three is the lower edge of toy-safety age grading, so every developmental claim, safety
statement and warning must be checked against "ages 3+", and nothing may imply suitability under 3
(brief §3 L58). In this wiki, **[3–7]** marks every place the correction changes something. The full list
is [below](#where-the-age-correction-bites); the product-wide age review is
[../product/age-band-review.md](../product/age-band-review.md).

## In one line

> **Kheelu is the brain-development toy that talks. It asks. They think.** (docx §1 L6, L8; pdf p.2)
>
> "Brain development is the promise. Conversation is the proof of how. Screen-free and safe are the
> foundation." (docx §1 L11; pdf p.2)

Site: "brain-development toy" is **BANNED** as a product label ([D016](../decisions/D016-brain-wording.md)); "brain development" is usable
only as a searched topic in titles, headings and articles. "It asks. They think." is **EXTERNAL**
([D038](../decisions/D038-trust-content-rulings.md): trademark risk accepted, alternatives welcome; asking back is confirmed, [D017](../decisions/D017-live-behaviour-claims-confirmed.md); the line makes
no "most turns" claim, which stays F8). The promise / proof / foundation sentence is the hierarchy, **INTERNAL**
([messaging.md](messaging.md#the-hierarchy)).

## Category and frame of reference

| | What the docs say | Cite | Site |
|---|---|---|---|
| **Own** | "The brain-development toy that talks." The noun is "brain-development toy", not "AI toy". "AI" stays, as the engine, not the headline | docx §1 L6, L13; §5 L134 | "Brain-development toy": **BANNED** as a product label ([D016](../decisions/D016-brain-wording.md)); "brain development" works as a searched topic in titles, headings and articles, never as what Kheelu is or does |
| **Refuse: AI toy** | "Compared on tech, priced against ₹1,599 'ChatGPT robots', blamed for every scandal" | docx §5 L131 | **INTERNAL** (strategy; ₹1,599 is an unsourced competitor price) |
| **Refuse: AI companion** | "The label regulators and safety groups now target" | docx §5 L132 | **INTERNAL** (strategy) |
| **Refuse: edtech or tutor** | Compared with apps and classes, under ASCI's education rules and parents' edtech distrust | docx §5 L133; §2 L41–43 | **INTERNAL** (strategy) |
| **Frame of reference** | The brain-development shelf parents already shop: puzzles, tangrams and activity books at ₹99 to ₹429. Kheelu "should join this shelf and stand apart on it" as the only product on it that talks, grows with the child and shows progress | docx §3 L70; §5 L135–136 | **INTERNAL** (strategy; ₹99 to ₹429 are competitor prices) |

**Why this shelf** (docx §5 L135–139): parents already shop it; Kheelu is the only one on it that talks,
which justifies ₹4,999 next to ₹400 puzzles; it matches the vision of "sharper minds"; it turns AI from a
fear into a reason (the AI lets the toy ask back); future products can sit on it too. Site: **INTERNAL** (strategy; "₹400 puzzles" is a competitor price).

**Category map** (Fig 2; pdf p.4). Vertical axis: sold on brain development (top) vs sold as fun, answers
or friendship (bottom). Horizontal: the child receives (left) vs the child does the thinking (right).

| | Child receives | Child does the thinking |
|---|---|---|
| **Sold on brain development** | Educational screens: learning apps and videos | **The brain-development shelf:** puzzles, activity books, STEM kits (build hands and focus, can't talk) **and Kheelu** (builds thinking through conversation) |
| **Sold as fun, answers or friendship** | Entertainment and answers: cartoons on the phone, story and audio players, smart speakers, chatbots | AI companions: Miko, MyWonder, Pookie ("they talk, but are sold as a friend") |

SKM's caveat: the map "places each brand by the words on its own site, not by testing" (docx §5 L142).
Site: **INTERNAL** (competitor intelligence: it names Miko, MyWonder and Pookie).

## The problem

**The market, October 2026** (docx §3 L64–84). Each bullet carries its site status:
- Parents are primed for "the early years build the brain": NEP 2020 says over 85% of a child's brain
  develops by age 6 and sets the foundational years at 3 to 8 (L67, via EducationWorld). **EXTERNAL** in the
  verified wording: checked against NEP 2020 para 4.1 itself, not EducationWorld
  ([source verification](../research/source-verification.md) C01, C02: SUPPORTED-WITH-REWORDING; [D026](../decisions/D026-public-statistics.md)), quoted as NEP says it,
  with a linked source marker ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)). The
  founder allows the figure despite the DS no-fear rule, paired with what a parent can do (D026).
- The Kheelona research brief (30 May 2026) found 70% of parents want an AI toy to help their child learn,
  the top reason to buy (L68). **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md)) ([list](messaging.md#internal-research-figures)).
- Indian children under 5 average about 2.2 hours of screen time a day, roughly double the guideline (L69,
  AIIMS Raipur meta-analysis via Pune Pulse, Jan 2026). **EXTERNAL** in the verified wording
  ([source verification](../research/source-verification.md) C06: SUPPORTED-WITH-REWORDING, against the study itself; [D026](../decisions/D026-public-statistics.md):
  with a linked source marker; never "double", never "Indian children average"), and as a
  screen-time fact only (the sample includes under-3s), paired with what a parent can do (D026).
- The "brain development" shelf is crowded, cheap and hands-only; none of it talks or shows a parent
  progress (L70). **INTERNAL** (competitor intelligence and prices).
- AI rivals sell friendship, not thinking; "nobody owns brain development through conversation" (L71–84).
  **INTERNAL** (competitor intelligence).

**Three forces to manage** (docx §3 L85–88; pdf p.3):
1. **AI's new fear, "cognitive stunting"**: Brookings (May 2026) warns that heavy AI use lets children skip
   effortful thinking. Kheelu's answer is its design: it asks, the child thinks.
2. **The backlash against AI companions**: SKM cites Common Sense Media's January 2026 advice and
   California's ban on companion-chatbot toys for under-16s from 2027 (L87). **[3–7]** Read the advice itself,
   and what it means for a band that starts at 3, on [age-band-review.md §4](../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band) rather than through SKM's
   "companion" summary. The answer is open: [open questions](../open-questions.md) G5.
3. **Scrutiny of claims**: ASCI requires substantiation and bars education ads that play on "parental or
   student anxieties" (Mar 2023); "midbrain activation" has made parents wary of brain claims.

Site: **INTERNAL** (strategy context: California's companion-chatbot toy ban, ASCI's rules and the
"midbrain activation" history). The Brookings finding is marked in the
[evidence table](#the-evidence-as-skm-rates-it).

"The answer to all three is the mechanism: **Kheelu asks, your child thinks.**" (pdf p.3)

## The promise

- **Core idea:** "Kheelu helps your child's brain grow, because it makes them think." (docx §9 L253)
  Site: **BANNED** (Kheelu as the subject of brain growth: [D016](../decisions/D016-brain-wording.md), settled, keeping founder decision 4
  of 2026-10-04; [claims.md §4](../product/claims.md#4-retired-or-banned-wording)). The promise credits
  conversation: conversation helps a young brain grow, and Kheelu gives a child more of it.
- **The answer to the AI fear:** "Kheelu doesn't think for your child, it makes them think." (docx §2 L25)
  Site: **EXTERNAL IF CONFIRMED** (F8), the same product rule ("most turns", #15) as the short hero
  option on [messaging.md](messaging.md#taglines-and-hero); the asking back it rests on is confirmed ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)).
- **Website hero:** "Kheelu helps your child's brain grow, one conversation at a time." (docx §1 L9;
  §9 L271). SKM: "'Helps' needs the advisor's sign-off before launch" (§9 L274; §4 L125). Exact hero,
  sub-line and taglines live in [messaging.md](messaging.md#taglines-and-hero). Site: **BANNED** as written
  ([D016](../decisions/D016-brain-wording.md): an advisor's sign-off does not reopen it).

## Positioning statement

Internal: "Every ad, script, caption and website line gets checked against it" (docx §7 L182). Site:
**INTERNAL** (a positioning statement, [content boundary](../site/content-boundary.md)); its claims are
marked one by one on [messaging.md](messaging.md#proof-points). As corrected:

> For Indian parents of **3 to 7** year olds **[3–7]** who want to support their child's growing brain
> without more screens, Kheelu is the brain-development toy that talks: a soft, screen-free AI rabbit that
> builds four thinking skills (words, reasons, stories and questions) through everyday conversation, in
> English and the family's own language. Unlike puzzles and activity books, it talks with your child and
> grows with them every day. Unlike AI that hands children answers, Kheelu asks back, so your child does
> the thinking. And parents see the growth in a simple weekly report.

Original: docx §1 L7 ("4 to 7"); pdf p.8. The statement as a table (docx §7 L183–196):

| Part | Kheelu |
|---|---|
| For | Indian parents of ~~4~~ **3** to 7 year olds **[3–7]** |
| Who | want to support their child's growing brain, without more screens |
| Kheelu is | the brain-development toy that talks: a soft, screen-free AI rabbit |
| That | builds four thinking skills (words, reasons, stories and questions) through everyday conversation, in English and the family's language |
| Unlike | puzzles and activity books, which can't talk or grow with the child; and AI that gives children answers or tries to be their friend |
| Because | Kheelu asks back, so your child does the thinking; it brings the family into the conversation; and parents see the growth in a weekly report, compared only with their child's own past |

One part of "Because" is not yet a product fact: asking back on MOST turns (asking back itself is
confirmed, [D017](../decisions/D017-live-behaviour-claims-confirmed.md); F8). The weekly skills report is confirmed for launch
([D036](../decisions/D036-launch-feature-claims.md)); "compared only with their child's own past" is not. See
[messaging.md, proof points](messaging.md#proof-points) #14, #15, #20. "Grows with them every day" and "builds four thinking skills" are
BANNED as written (the "adapts" family and a learning outcome, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)). The statement's "brain-development toy" is
BANNED as a product label ([D016](../decisions/D016-brain-wording.md)) if any of it is ever reused as copy.

## Reasons to believe

### The evidence, as SKM rates it

Source: docx §4 L94–122; pdf p.5.

SKM's strength ratings and the "how Kheelona uses it" column are INTERNAL. The Site column marks the
finding itself: public research is EXTERNAL when it is read at its source and cited on the page
([content boundary](../site/content-boundary.md), "Public research"); until it is read, it is
**EXTERNAL IF CONFIRMED** (source check: the Copywriter reads and cites the source before use).

| Finding | Source (as cited) | SKM's strength rating | How Kheelona uses it | [3–7] note | Site |
|---|---|---|---|---|---|
| "Serve and return" exchanges build neural connections and support early language | Harvard Center on the Developing Child | Strong, but about caring adults | The idea Kheelu is built around; never "Harvard-proven" | Covers early childhood broadly; holds at 3 | **EXTERNAL** (public; checked 2026-10-10), only in the [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors) form: cited, keeping "a caring adult". "Built around", never "Harvard-proven" |
| In 4 to 6 year olds, conversational turns, not words heard, predicted language scores and Broca's-area activity | Romeo et al. 2018, *Psychological Science* (via LENA) | Strong, but correlational and with adults | Why Kheelu asks back | **Study did not include 3-year-olds.** Never imply it did | **EXTERNAL** (public; checked 2026-10-10, [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)), always with the study's ages, 4 to 6 |
| Children who talked with an AI that asked questions during a story understood it better and learnt more words | Xu et al. 2022, *Child Development* (University of California, Irvine; SKM cites it via the Joan Ganz Cooney Center) | Good: direct evidence for AI that asks | "The closest evidence for Kheelu's design. Can be cited." | 117 children aged 3 to 6; a smart speaker, not Kheelu | **EXTERNAL** in the verified line only ([source verification](../research/source-verification.md) C10: SUPPORTED-WITH-REWORDING; not "learnt more words", not "Harvard"). **Guard ([D027](../decisions/D027-story-mode-wording.md)):** cite it only for Kheelu asking back in conversation; never pair it with stories or Story mode, which has no interrupt-and-ask feature |
| Children lead conversations and add ideas more with people than with AI | Xu et al. (as verified) | Good | Why Kheelu hands the conversation back to family | – | **EXTERNAL** in the verified wording ([source verification](../research/source-verification.md) C11: SUPPORTED-WITH-REWORDING); the hand-back it would justify stays F8 (#16) |
| Preschoolers ask about 76 information-seeking questions an hour | Lazaroff & Vlach 2022, citing Chouinard 2007 | Moderate | The "Questions" skill; the "why" years | – | **Not usable**: a public statistic under [D026](../decisions/D026-public-statistics.md), and the independent check could not verify it ([source verification](../research/source-verification.md) C13: COULD-NOT-VERIFY). Same marking as [audience.md](audience.md) |
| Over-reliance on AI lets children skip effortful thinking | Brookings, May 2026 | Early evidence, widely reported | The risk Kheelu's design answers | – | **EXTERNAL IF CONFIRMED** (source check: public, not yet read); a fear-based finding ("AI's new fear", [three forces](#the-problem)), so never as fear (ASCI; [voice.md](voice.md) rule 4). Quoted as a figure, it follows [D026](../decisions/D026-public-statistics.md): verified at its original source, with a linked marker |

The deck's "honest limit": "these studies are about conversation, mostly with adults. We say Kheelu is
*built around* this idea, not that Kheelu is proven. Our own pilot data comes next." (pdf p.5)

**What can be claimed** (docx §4 L123–127): *today*, Kheelu is built around back-and-forth conversation,
which research links to young children's language and brain development, and it asks questions so the
child does the thinking; *after advisor sign-off*, "Helps your child's brain grow" (now **BANNED** as
written, advisor or not: [D016](../decisions/D016-brain-wording.md)); *only with pilot data*,
any result; *never*, that Kheelu is proven to grow the brain, raise IQ or match a parent. The full
say / never-say table is in [messaging.md](messaging.md#claims-guardrails).

### The four thinking skills

Source: docx §1 L12; §4 L92–93; Fig 1; pdf p.6.

"Every feature, ad and report maps to one of them" (docx §1 L12). They map onto NEP 2020's early-years goals
(cognitive development, early language, communication) (§4 L93).

| Skill | Kheelu does | Your child practises | Report shows | [3–7] note | Site |
|---|---|---|---|---|---|
| **Words** | Uses a new word, then asks your child to use it too | Hears it, says it, uses it in their own sentence | New words used | No advisor exists ([D038](../decisions/D038-trust-content-rulings.md)); what "uses it in their own sentence" means at 3 rests on public sources only | **EXTERNAL IF CONFIRMED** (F8: what Kheelu does). The new-word count in the report is confirmed ([D036](../decisions/D036-launch-feature-claims.md)) |
| **Reasons** | Asks "why do you think that happened?" | Explains, gives a "because", weighs two ideas | Why-answers given | "Weighs two ideas" at 3: public sources only (no advisor, D038) | **EXTERNAL IF CONFIRMED** (F8). Asking back itself is confirmed ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) |
| **Stories** | In conversation (AI mode), asks "what happens next?" about what your child is telling it | Remembers, puts events in order, invents an ending | Stories told and retold | Sequencing at 3: public sources only (no advisor, D038) | **EXTERNAL IF CONFIRMED** (F8), as asking back in conversation only. SKM's "tells half a story, asks 'what happens next?'" is **BANNED** as written: it describes the interrupt-and-ask feature [D027](../decisions/D027-story-mode-wording.md) says does not exist |
| **Questions** | Answers, then invites "what else do you wonder?" | Asks more, and deeper, questions of their own | Questions asked | Natural fit at 3 (the "why" years) | **EXTERNAL IF CONFIRMED** (F8). Asking back is confirmed (D017) |

F8 still covers what Kheelu does in each row. The weekly report on the four skills and the new-word count
are confirmed ([D036](../decisions/D036-launch-feature-claims.md); [messaging.md](messaging.md#proof-points) #20); the per-skill "Report shows" items beyond
the new-word count are not. F9 is answered: there is no advisor ([D038](../decisions/D038-trust-content-rulings.md)), so age claims rest on cited public
sources only. **Stories row:** reworded as asking back in conversation (AI mode); never a Story-mode feature
([D027](../decisions/D027-story-mode-wording.md)).

Plus: "Kheelu regularly hands the conversation back to family: 'Tell Amma what we found out.'" (Fig 1; pdf p.6)
Site: **EXTERNAL IF CONFIRMED** (F8, the hand-back, #16).

## Pillars and foundation

Source: docx §8 L227–251; Fig 3; pdf p.9.

"Three pillars give parents a reason to choose Kheelu for their child's brain. The foundation gives them
permission to buy it" (L228). "Each pillar needs one piece of proof the team can show by launch. **None is
fully in place yet.**" (L231)

Band above the pillars: "It asks. They think. Kheelu helps your child's brain grow through conversation"
(Fig 3; the pdf p.9 shortens it to "Brain growth through conversation"). Site: **BANNED** (Kheelu as the
subject of brain growth, [D016](../decisions/D016-brain-wording.md), settled). The pdf's short form names no subject; it may be used only
where it plainly credits conversation, in D016's form with its cited anchor
([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)).

The pillars as a structure are **INTERNAL** ([messaging.md](messaging.md#the-hierarchy)); the Site column
marks each "What we claim" line.

| Pillar | What we claim | Why it's believable | Proof still needed (SKM) | Site |
|---|---|---|---|---|
| **Makes them think** | Kheelu asks your child questions back, so they do the thinking | Romeo 2018; Xu 2022 | Pilot counts: questions asked by Kheelu and answers given per session | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [messaging.md](messaging.md#proof-points) #14). Pilot counts only once real data exists (#27; no promise to publish them, [D038](../decisions/D038-trust-content-rulings.md)) |
| **Builds four thinking skills** | Words, reasons, stories, questions, at your child's level, in English and your home language | NEP 2020's early-years goals; the deck's age-adaptive design | Age-by-age activity list for 4, 5, 6 and 7, signed off by the advisor; language clips. **[3–7] needs a list for age 3 too** (no advisor exists, D038) | **BANNED** as written ("builds" is a learning outcome, "at your child's level" the "adapts" family: [messaging.md](messaging.md#proof-points) #19). The four skills named as what the weekly report covers: **EXTERNAL** ([D036](../decisions/D036-launch-feature-claims.md)) |
| **You see the growth** | A weekly report on the four skills, compared only with your child's own past | The deck's "10 new words learnt" update and "personal growth, not comparison" principle | Real app screenshots with the four skills (F8) | **EXTERNAL** as the weekly report ([D036](../decisions/D036-launch-feature-claims.md), #20); "compared only with your child's own past" stays F8 |
| **Foundation: a toy, not a friend** | Safe by design, and it brings the family into the conversation | The four safety behaviours on the site; offline stories; family hand-back prompts | Data answers (audio location, retention, training: F5); BIS date; outside safety test (F4) | "Safe by design": **BANNED** ("safe" as a bare adjective, [messaging.md](messaging.md#words-to-stop-using)). The family hand-back: **EXTERNAL IF CONFIRMED** (F8, #16). "A toy, not a friend": **EXTERNAL IF CONFIRMED** (G5). The data answers now exist ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md), [D035](../decisions/D035-model-training-opt-out.md); [messaging.md](messaging.md#proof-points) #11 to #13). BIS: licence under application, not granted (L1), so no BIS claim ([claims.md §6](../product/claims.md#6-certifications)); red-teaming before launch is confirmed ([D036](../decisions/D036-launch-feature-claims.md)) |

Foundation chips (Fig 3; pdf p.9): screen-free · wake word · no browsing · read every chat · never asks for
a secret · stories work offline. Each is checked against the site, with its Site value, in
[messaging.md, proof points](messaging.md#proof-points). The "wake word" chip is **BANNED**: Kheelu has no
wake word, and the chip becomes the wake-up button and its light ([D018](../decisions/D018-wake-up-button.md)). No browsing and read every
chat are **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); "stories work offline" is Story mode only (stories, poems and jingles,
[D027](../decisions/D027-story-mode-wording.md)). "The deck" in this table is an internal Kheelona deck that is not in `wiki/raw/`.

## Competitors named

Market-level benchmarking belongs to [D2C benchmarks](../research/d2c-benchmarks.md); this
is only what the positioning says. Prices are SKM's, from pages "opened 8 October 2026" (docx §13 L420),
and were not re-checked by this agent.

Every row is INTERNAL: competitor names and prices never go on the site ([D013](../decisions/D013-internal-vs-external-content.md)).

| Brand | How it describes itself (per SKM) | Price (per SKM) | Source cited | Site |
|---|---|---|---|---|
| Miko Mini | "AI-powered conversational robot", "a cherished companion", STEAM learning | ₹13,999 | in.miko.ai/products/miko-mini | **INTERNAL** (competitor intelligence) |
| MyWonder | "Learn From Safe & Intelligent AI Companions"; closest rival with "Speak, Listen, Learn" | ₹5,499 | mywonder.in | **INTERNAL** (competitor intelligence) |
| Pookie (Scoobies) | A friend-like companion that understands moods | ₹6,999 | scoobies.co.in/pages/pookie, "from the competitor review" (v9) | **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md)) ([list](messaging.md#internal-research-figures)) |
| "ChatGPT robots" | – | ₹1,599 | **No source given** (docx §5 L131) | **INTERNAL** (competitor price, unsourced) |

Rows: docx §3 L71–84; pdf p.4. The alternatives parents actually weigh, and the line for each, are in
[messaging.md](messaging.md#against-the-alternatives) (docx §7 L197–225).

**Never name competitors in public copy** (docx §10 L372–374: "Legal risk"; say "smart speaker", "robot
toy with a screen"). Production copy names none today (`git grep` of `src/` and `public/`, 2026-10-10: only
code comments, in 3 files: `src/components/molecules/CompareTable.tsx:32`,
`src/components/molecules/KheelonaPlusBand.tsx:7-8`, `src/lib/product-facts.ts:17-18`).

## Price story

Positioning only; the price facts live in [../product/pricing.md](../product/pricing.md).
- Do not position against Miko on price. Anchor "against what parents already spend on their child's mind"
  (docx §2 L47–49; pdf p.12): "a few months of an enrichment class **[check local fees before using a
  number]**, with the difference that it is there every day and shows progress" (docx §7 L226).
- SKM writes "At ₹7,999 after launch" (docx §2 L49). The site's rule is different: ₹7,999 applies **once the
  first 500 units are gone**, paid in full (`src/config/site.ts:63–67, 86, 110–113`). Copy must follow the
  site's rule.
- How the price is WRITTEN is the founder's ruling [D028](../decisions/D028-price-wording.md): next to the CTA, ₹499 first with the ₹4,999
  total in the same sentence; everything machines read leads with ₹4,999 (incl. GST, [D024](../decisions/D024-payment-methods-gst.md)). The
  candidate line: [messaging.md](messaging.md#confirmed-candidate-lines).

## Brand foundations

Source: docx §5 L143–158.

| Level | Current | SKM's recommendation | Site |
|---|---|---|---|
| Vision | To build sharper minds and bigger smiles for kids everywhere. | Keep | **INTERNAL** (not live) |
| Purpose | To make learning, curiosity, and meaningful conversation a natural part of childhood. | Keep | **INTERNAL** (a brand foundation statement, [content boundary](../site/content-boundary.md)) |
| Mission | We build safe, conversational AI tutors for kids, combining robotics, great content, and play. | **We make safe, screen-free toys that build young minds through conversation.** | Current: **BANNED** ("AI tutors", "robotics"). SKM's: **BANNED** as written: the toys are what "build young minds", which [D016](../decisions/D016-brain-wording.md) rewords to the conversation form; also drop the bare "safe" ([messaging.md](messaging.md#words-to-stop-using)) |
| Positioning | (none) | **The brain-development toy that talks. It asks. They think.** | As [in one line](#in-one-line): "brain-development toy" **BANNED** as a product label ([D016](../decisions/D016-brain-wording.md)); "It asks. They think." **EXTERNAL IF CONFIRMED** (F10; F8 for "most turns") |

## Tone

Specific, substantiated and calm: mechanism before outcome, warmth without friendship, AI as the engine,
never fear. Full rules and the comparison with the design system's writing guide: [voice.md](voice.md).

## What changes from earlier thinking

Source: docx §2 L34–62; pdf p.12. "Earlier thinking" is mostly the research brief's view ("Research says",
L35–47), which is not in the project and is not needed: its findings are INTERNAL
([D013](../decisions/D013-internal-vs-external-content.md)).

| Topic | Earlier thinking | SKM proposes | After the brief |
|---|---|---|---|
| Core age | 6 to 8; exclude under 4 | 4 to 7; 3-year-olds only "with a grown-up nearby", never shown alone in ads | **3 to 7** (brief §2). Whether the grown-up condition stays is open: [open questions](../open-questions.md) G5 |
| Framing | Tutor or teacher | Brain development through conversation | – |
| Differentiator | Safe and screen-free | Those are the foundation; thinking is the position ("No screen does not separate Kheelu", competitor review v9: **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md)); [list](messaging.md#internal-research-figures)) | – |
| Price story | Cheaper than Miko | Compared with enrichment spend, not robots | – |
| Deck language | "Maps your emotions and triggers", "remembers life events, values, emotions" | Learning progress only: "Remembers what your child has learnt and loves" (surveillance risk; DPDP) | Emotion reading of any kind is **BANNED** ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)); memory is EXTERNAL within the live claim ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [messaging.md](messaging.md#proof-points) #17) |
| Mission | "Safe, conversational AI tutors… combining robotics" | Rewritten (above) | SKM's rewrite needs the conversation form ([D016](../decisions/D016-brain-wording.md)) |
| Platform story | Kheelona OS, wearables, robots | Investors only; parents see one product | Live site has a `/playos` page and nav tab: [open questions](../open-questions.md) G8 |

## Two product rules that make the promise true

Source: docx §10 L375–377; §1 L16.

1. Kheelu ends most of its turns with a question, so the child talks and thinks more than the toy does.
2. Kheelu regularly hands the conversation back to family (Xu: children lead more with people than with AI).

SKM: "It only works if the product does it… Both need product sign-off this week" (docx §1 L16). Neither is
confirmed in any source this agent could reach: [open questions](../open-questions.md) F8. Site: both
**EXTERNAL IF CONFIRMED** (F8; [messaging.md](messaging.md#proof-points) #15, #16).

## Who it's for

See [audience.md](audience.md).

## Outside the website (summary)

The 90-day plan keeps its structure (WhatsApp-assisted selling, Bengaluru demos, Gate 1 on 1 November) and
changes what goes into each channel (docx §11 L379). The plan itself is not in the project and is INTERNAL
([D013](../decisions/D013-internal-vs-external-content.md)). Items that touch the website:
- A three-way Meta test of the mechanism, outcome and contrast lines; "the winner leads from Gate 1"
  (L383). The hero line may therefore change after 1 November.
- Put the child-development advisor's face and name "in at least one ad and on the website" (L386–387).
  Moot: there is no advisor ([D038](../decisions/D038-trust-content-rulings.md)).
- Amazon listing only "after BIS" (L398–399), which implies BIS certification is not yet in hand. Confirmed:
  the licence is under application, not granted (founder, 2026-10-11, L1).
- If parents hear "brain development" as hype, lead with "It asks. They think." and move the brain promise
  to the second line; if "Will AI make my child lazy?" comes up often, move the contrast line into the hero
  (docx §12 L417–418).
- Ads are published copy, so the outcome line in that test needs [D016](../decisions/D016-brain-wording.md)'s conversation form
  ([messaging.md](messaging.md#message-testing)). The site speaks only to parents of 3-7 year olds and
  family buyers ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)): corporate gifting and preschool channels in the plan stay off the website.

## Future learning modules

Source: pdf pp.14–16 only (not in the docx).

A four-step claim ladder: built on research ("Built to support…", today) → mapped to NCF Foundational Stage
2022 and NIPUN Bharat ("Aligned with NCF goals") → measured with families ("In our pilot, children…") →
tested independently ("Shown to improve…") (pdf p.14). Then eight possible modules with "could claim" lines,
for example "Builds early number sense" and "Gets children ready to read" (pp.15–16). Site: **INTERNAL**
(future plans, including "Aligned with NCF goals"): none of these is on the site now, and the deck itself
says "we only say what we've reached" (p.14). Curriculum mapping
and "Practise tables with Kheelu" also sit close to the edtech frame the docx refuses (docx §5 L133).

## Where the age correction bites

| # | Where | What the docs say | What changes at 3 | Status |
|---|---|---|---|---|
| 1 | Statement, "market to", first 500 buyers, User role (docx §1 L7, L15; §6 L160, L168; §7 L186; pdf pp.7–8) | 4 to 7 | Read as 3 to 7 | Applied on these pages |
| 2 | 3-year-olds "with a grown-up nearby", never alone in ads (docx §2 L39; §12 L410; pdf pp.12, 17) | A condition on selling to 3s | 3 is now core; the condition is undecided | **Open:** [open questions](../open-questions.md) G5 |
| 3 | "Speech recognition is weaker under 4" (docx §2 L40) | A reason to start at 4 | A 3-year-old may be understood less well; parents need honest expectations. No source given | **Open:** G5 |
| 4 | "Safety groups draw a line at 5"; SKM's citation of Common Sense Media (docx §2 L40; §3 L87) | A reason to start at 4 | What the advice covers across 3 to 7: [age-band-review.md §4](../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band); "a toy, not a friend" becomes load-bearing | Rule in [voice.md](voice.md); answer open: G5 |
| 5 | Evidence ages (docx §2 L40; §4 L103; pdf p.5 "ages 4 to 6") | Romeo 2018 studied 4–6 | The strongest study excludes 3; never cite study ages as if they cover 3 | Guardrail in [messaging.md](messaging.md#claims-guardrails) |
| 6 | Four skills, age-by-age list (docx §8 L243; Fig 1) | Ages 4, 5, 6, 7 | Add 3; "weighs two ideas", "puts events in order" at 3 rest on public sources (no advisor, [D038](../decisions/D038-trust-content-rulings.md)) | F9 answered (no advisor) |
| 7 | Toy safety: "BIS date; outside safety test" (docx §8 L251; §11 L398) | Proof still needed | The "3+" grade must match the certification's age grade; site says certification is in progress (`src/lib/product-facts.ts:89–92`) | See [../product/age-band-review.md](../product/age-band-review.md); BIS licence under application (L1) |
| 8 | "Not for now: under 3s" (docx §6 L180; pdf p.7) | Excludes under 3 | Aligns with "ages 3+" (`src/config/site.ts:124`); keep it visible | Keep |
| 9 | Under-5 screen-time statistic (docx §3 L69) | "Children under 5" | The sample includes under-3s; use only as a screen-time fact, never to suggest Kheelu suits under-3s | Guardrail |
| 10 | "Tutor… puts pressure on a 4-year-old" (docx §2 L43) | – | Stronger at 3 | No change |
| 11 | Soft rabbit "babyish" for 7–8 (docx §2 L40) | 7 is the top | Band spans 3 to 7; "at your child's level" must hold at both ends | Note |
| 12 | Kheelu's child-facing voice spec (DS `01-writing.md` L75–77) | Covers 3–6 | 7-year-olds not covered | Visual/DS: flagged for [../design-system/gaps.md](../design-system/gaps.md) |
| 13 | Live site says "smart toys for toddlers" (`src/app/(site)/team/page.tsx:19` title; `src/app/(site)/safety/page.tsx:129` FAQ) | Not in the docs | "Toddlers" commonly means under 3, which the positioning and brief exclude | **Open:** G5 |
| 14 | NEP foundational years 3 to 8 (docx §2 L40; §3 L67) | Supports the band | No change | – |

## PDF vs docx

- Statement: pdf drops the four skill names and ends "parents see the growth every week" (pdf p.8); docx
  says "in a simple weekly report" (L7).
- Pillar band: "Brain growth through conversation" (pdf p.9) vs "Kheelu helps your child's brain grow
  through conversation" (Fig 3).
- Supporting lines: the pdf lists "Give a gift that grows young minds." as a supporting line (p.10); the docx
  uses it as the gift-buyer message (§9 L291).
- "Say" list: pdf "Kheelu is built around research on back-and-forth conversation" (p.11); docx "Harvard
  research shows back-and-forth conversation helps build young children's brains. Kheelu is built around
  the same idea." (§10 L333). The docx "never say" adds ADHD and autism (L343).
- Ad-test winner: "lowest cost per paid sale" (pdf p.13; docx §12 L415) vs "judge on cost per WhatsApp lead
  and chat-to-paid rate" (docx §11 L383).
- Future learning modules: pdf only (pp.14–16).

## Open questions raised by this page

All tracked in [open questions](../open-questions.md): authorship and sign-off (Q4; its missing documents
are not needed, [D013](../decisions/D013-internal-vs-external-content.md); only the founder signs off copy,
[D015](../decisions/D015-founder-signs-off-copy.md)); the grown-up-nearby condition, speech recognition at 3, "toddlers" and "friend" (G5; the
wake-word wording is moot, [D018](../decisions/D018-wake-up-button.md)); the age-3 skills list (F9 answered: no advisor, [D038](../decisions/D038-trust-content-rulings.md); the hero is settled by
[D016](../decisions/D016-brain-wording.md)); the two product rules (F8; the weekly report is confirmed, [D036](../decisions/D036-launch-feature-claims.md)); data answers (F5, answered: [D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md));
returns and warranty (F1, answered: [D021](../decisions/D021-returns-policy.md),
[D022](../decisions/D022-warranty-replacement-refund.md), [D033](../decisions/D033-warranty-after-day-7.md)); BIS (L1: under application); the trademark check (F10: risk accepted, [D038](../decisions/D038-trust-content-rulings.md)); `/playos` (G8); the CTA label (G1).
