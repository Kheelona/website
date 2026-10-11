---
title: Messaging hierarchy (from SKM's positioning)
type: brand
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - wiki/raw/positioning/Kheelona Positioning (1).pdf
  - wiki/raw/brief/kickoff-brief.md (sections 3, 6, 9.1)
  - tag archive/pre-reset-2026-10-10 (= 77552ff, production): src/config/site.ts, src/lib/product-facts.ts, src/lib/growth-arc.ts, src/lib/kheelu-art.ts, src/lib/stories-expansion.ts, src/lib/video-moments.ts, src/components/organisms/KheeluModes.tsx, src/app/(site)/{page,playos/page,refund/page,safety/page}.tsx
  - tag archive/pre-reset-2026-10-10: docs/checkpoints/migration-to-new-dsx.md:52 (founder decision #9, 2026-08-23)
  - tag archive/mid-version-2026-10-10: CLAUDE.md, src/config/site.ts, src/lib/safety.ts, src/lib/faq.ts, src/features/home/components/Hero.tsx
  - design-system/project/01-writing.md, 07-selling.md, components/{OfferCard,StickyBuyBar}/README.md, components/bundle.js (read-only)
  - https://kheelona.com/ (GET 2026-10-10, browser User-Agent)
  - "Site column (2026-10-10): wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md, wiki/product/claims.md (sections 1-4, 8), wiki/product/facts.md, wiki/open-questions.md (IDs F1-F13, G1-G11)"
  - "Founder's rulings D030-D039 applied 2026-10-11 (wiki/decisions/D032-D038; rulings check wiki/qa/rulings-check-2026-10-11.md)"
  - "Founder's rulings applied 2026-10-11: wiki/decisions/D015-founder-signs-off-copy.md and D016 to D028 (brain wording, live behaviour claims, wake-up button, voice providers, provider terms, returns, warranty, delivery, payment and GST, speech and language, public statistics, Story mode, price wording); wiki/open-questions.md section F (R5 and R9, answered 2026-10-10)"
---

# Messaging

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)): it shapes what the site says and how; nothing here is published as is. What may be published: [content boundary](../site/content-boundary.md).

Citation key (`docx §N L<n>`, `pdf p.N`, `Fig N`): see [positioning.md](positioning.md#the-two-source-documents).
DS citations (`01-writing.md`, `bundle.js`, component READMEs) are files in `design-system/project/` as delivered.
Product facts live in [../product/facts.md](../product/facts.md); claim rulings in
[../product/claims.md](../product/claims.md); prices in [../product/pricing.md](../product/pricing.md).

**Site column** (2026-10-10; the founder's rulings applied 2026-10-11). The lines on this page are
CANDIDATE copy; each candidate line and proof point is marked:
- **EXTERNAL**: may be published as is. A line drafted in a decision is EXTERNAL as a draft: the
  founder signs off final copy at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)).
- **EXTERNAL IF CONFIRMED (ID)**: useful to a parent, but waits on that
  [open question](../open-questions.md). "Source check" means public research this project has not
  yet read: the Copywriter reads and cites the original before use; no founder answer is needed.
  **"Pending source verification (D026)"** means a public statistic that may be used as SKM framed it
  only if the independent check against its ORIGINAL source ([source verification](../research/source-verification.md),
  finished 2026-10-11) supports it, and then only with a linked source marker ([D026](../decisions/D026-public-statistics.md)).
- **INTERNAL**: shapes strategy only; never on the site.
- **BANNED**: retired or ruled-out wording; never published.

**All ten content rulings are answered** ([open questions, section F](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time):
R1 to R9 on 2026-10-10, R10 on 2026-10-11) and this page applies them, so no PENDING RULING mark
remains. Each changed value names the decision (Dnnn) or ruling (Rn) it follows. The new lines those
rulings confirm are under [confirmed candidate lines](#confirmed-candidate-lines).

A line that mixes clauses takes the strictest mark, and the note names the clause; a cell that covers
two separate items (a "stop" and a "say instead", say) marks each. The column applies
rulings owned elsewhere ([claims.md](../product/claims.md), [facts.md](../product/facts.md), the
decisions); it does not change them.

## The hierarchy

The hierarchy as a document is INTERNAL ([content boundary](../site/content-boundary.md)); the Site column
marks the wording at each level.

| Level | Message | Cite | Site |
|---|---|---|---|
| **Core message** | "One idea everywhere: Kheelu helps your child's brain grow, because it makes them think." | docx §9 L253; pdf p.10 ("One idea, said the same way everywhere") | **BANNED** as written: Kheelu as the subject of brain growth ([D016](../decisions/D016-brain-wording.md), settled; founder decision 4, 2026-10-04; [claims.md §4](../product/claims.md#4-retired-or-banned-wording)). Promises credit conversation: conversation helps a young brain grow, and Kheelu gives a child more of it ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)) |
| **The promise** | Brain development | docx §1 L11 | **INTERNAL** as a level. On the site only in D016's conversation form, and "brain development" as a search TOPIC in titles, headings and articles (D016's example: "Brain development at 3 to 7: why talking matters most"), never as what Kheelu does ([D016](../decisions/D016-brain-wording.md)) |
| **The proof of how** | Conversation: Kheelu asks, your child thinks | docx §1 L4, L11 | **EXTERNAL**: asking back is confirmed ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [#14](#proof-points)). How often it asks ("most turns") is #15, still F8 |
| **The foundation** | Screen-free and safe (must be true everywhere, but do not set Kheelu apart) | docx §1 L11; §8 L228 | "Screen-free": **EXTERNAL** (#1). "Safe" on its own: **BANNED** ([words to stop using](#words-to-stop-using)); name the behaviours instead, in the order [D020](../decisions/D020-provider-terms-and-no-sale.md) sets ([confirmed candidate lines](#confirmed-candidate-lines)) |
| **The model parents repeat** | Four thinking skills: Words, Reasons, Stories, Questions | docx §1 L12; [positioning.md](positioning.md#the-four-thinking-skills) | **EXTERNAL** as the four skills the weekly parent-app report covers ([D036](../decisions/D036-launch-feature-claims.md)); never an outcome promised for the child (legal review L7), and no advisor sign-off is claimed (there is none, [D038](../decisions/D038-trust-content-rulings.md)) |
| **Pillars** | Makes them think · Builds four thinking skills · You see the growth · Foundation: a toy, not a friend | docx §8; [positioning.md](positioning.md#pillars-and-foundation) | **INTERNAL** as a structure; each pillar's claim is marked under [proof points](#proof-points) (#14 to #20) and "a toy, not a friend" under [against the alternatives](#against-the-alternatives) |

## Taglines and hero

**Taglines, in SKM's order** (docx §9 L254–269; pdf p.10):

| Line | Use | SKM's note | Before it can go live | Site |
|---|---|---|---|---|
| **It asks. They think.** | Master line: ads, packaging, end cards | "Four words. Says the mechanism and answers the AI fear in one go. Check the trademark." | Trademark check (docx §12 L412); depends on product rule "ends most turns with a question" (L407) | **EXTERNAL** ([D038](../decisions/D038-trust-content-rulings.md): the founder accepts the trademark risk and invites alternatives, which the Copywriter proposes for Gate A). The behaviour it names is confirmed (asks back, [D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14); the line makes no "most turns" claim (#15 stays F8) |
| **Helps your child's brain grow, one conversation at a time.** | Website hero, descriptor | "The core promise, with the how attached" | Advisor sign-off on "helps" (L274, L409) | **BANNED** as written ([D016](../decisions/D016-brain-wording.md), settled: Kheelu as the subject of brain growth, whatever an advisor says) |
| **Other AI gives answers. Kheelu asks questions.** | Ads, comparison table, press | "Strong contrast; use as a second line" | Same product rule as the master line | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md): answers, then asks a question back, #14; the line makes no claim about how often). "Other AI" is a category, not a brand |
| **Puzzles build hands. Conversation builds thinking.** | Gifting, Amazon listing | "Stands Kheelu apart on the brain-development shelf" | – | **EXTERNAL IF CONFIRMED** (source check): SKM's copy, not a confirmed claim. "Conversation builds thinking" credits conversation, not Kheelu, so [D016](../decisions/D016-brain-wording.md) allows it; the page cites its anchor, Harvard or Romeo ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)) |
| Give a gift that grows young minds. | Gift buyers, corporate gifting | Supporting line on pdf p.10; gift message in docx §9 L291, §11 L397 | – | **BANNED** as written: [D016](../decisions/D016-brain-wording.md) requires it reworded to the conversation form (Kheelu is never what grows the mind). Gift lines speak to family buyers only; corporate gifting is out of scope ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time), [audience.md](audience.md#roles)) |

**Website hero, exactly as SKM writes it** (docx §9 L270–274; pdf p.10):
- Headline (recommended): "Kheelu helps your child's brain grow, one conversation at a time."
  Site: **BANNED** as written ([D016](../decisions/D016-brain-wording.md), settled).
- Sub-line: "A screen-free AI toy that asks your child questions, so they think, talk and wonder more."
  Site: **EXTERNAL**: [D016](../decisions/D016-brain-wording.md) allows "so they think, talk and wonder more" because it describes what
  conversation does, and the asking clause is confirmed ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14). "AI toy" sits in the sub-line,
  where it is fine ([words to stop using](#words-to-stop-using)).
- Short option: "The toy that makes your child think."
  Site: **EXTERNAL IF CONFIRMED** (F8): SKM's product rule "ends most turns with a question" (#15),
  as for the master line.

Three conditions sit on the hero:
1. **Advisor sign-off** on "helps" before launch (docx §9 L274). Moot: [D016](../decisions/D016-brain-wording.md) bans the hero as
   written whatever an advisor says, and there is no advisor ([D038](../decisions/D038-trust-content-rulings.md), F9 answered).
2. **It may move after Gate 1 (1 November):** the winner of the three-line Meta test "leads from Gate 1"
   (docx §11 L383). If parents hear "brain development" as hype, lead with "It asks. They think." (§12 L418);
   if "Will AI make my child lazy?" comes up often, move the contrast line into the hero (§12 L417).
   An ad is published copy ([D013](../decisions/D013-internal-vs-external-content.md)), so the outcome arm of that test needs the conversation form
   ([message testing](#message-testing)).
3. **It differed from an earlier founder ruling, and the ruling stands.** On 2026-10-04 the founder set
   brain claims as "research-anchored: conversation helps a young brain grow, Kheelu gives a child more
   of it, never 'Kheelu grows the brain'" (`mid:CLAUDE.md:21-22`; the mid hero lead:
   `mid:src/features/home/components/Hero.tsx:29-30`). SKM's line makes Kheelu the subject of "helps
   your child's brain grow". [D016](../decisions/D016-brain-wording.md) (2026-10-10) keeps the 2026-10-04 rule; the anchored form is on
   [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors).

SKM describes "the current website line" as "Kheelu is an AI toy built to help your child's brain grow"
(docx §9 L274). **That line is not on the live site.** Live, 2026-10-10: title "Kheelu: the screen-free AI
toy with a tutor inside, ages 3+ · Kheelona"; H1 "A best friend at 3. A head start for school." The nearest
wording is on the unreleased mid version ("An AI toy built for the conversations that help a young brain
grow.", `mid:src/app/(site)/products/kheelu/page.tsx:138`), so SKM may have
reviewed that preview rather than production.

Site, line by line:
- SKM's "current website line", "Kheelu is an AI toy built to help your child's brain grow": **BANNED**
  (Kheelu as the subject of brain growth, [D016](../decisions/D016-brain-wording.md)).
- Live title "…the screen-free AI toy with a tutor inside, ages 3+": **BANNED** ("tutor", [words to stop
  using](#words-to-stop-using); "3+" with no ceiling is superseded by 3 to 7,
  [D009](../decisions/D009-brief-readings.md)).
- Live H1 "A best friend at 3. A head start for school.": **BANNED** ("best friend",
  [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- Mid line "An AI toy built for the conversations that help a young brain grow.": **EXTERNAL** (the
  [D016](../decisions/D016-brain-wording.md) form, [claims.md §1](../product/claims.md#1-confirmed-by-the-founder)).

## The 20-second pitch

Source: docx §9 L275–276. For a WhatsApp voice note or the demo table, verbatim:

> "These early years are when a child's brain grows fastest, and research shows back-and-forth conversation
> is one of the best things for it. Kheelu is a soft rabbit with no screen. Your child asks it anything, in
> English or your home language. It answers, then asks them something back: why do you think that? What
> happens next? So your child does the thinking. Each week you see their new words, the questions they asked
> and the stories they told."

Flags: the last sentence depends on the weekly report (NEEDS-SOURCE below). "Asks it anything" should be
read alongside the closed library: Kheelu answers from a closed library and cannot browse
(`src/lib/product-facts.ts:74`).

Site: **EXTERNAL IF CONFIRMED** in its last sentence only: the weekly report and the new-word count are
confirmed ([D036](../decisions/D036-launch-feature-claims.md)), but "the questions they asked and the stories they told" goes beyond
them (F8). It is a WhatsApp and demo script, not page copy. On the site: the first sentence needs its public source cited on the page and keeps
[D016](../decisions/D016-brain-wording.md)'s form, conversation as what helps ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors));
"It answers, then asks them something back" is **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14); "asks it anything" needs
the qualifier that Kheelu cannot browse the internet (**EXTERNAL**, [D017](../decisions/D017-live-behaviour-claims-confirmed.md), #5).

## Messages by audience

Source: docx §9 L277–298.

Who these people are: [audience.md](audience.md).

The audience split itself is INTERNAL ([audience.md](audience.md)); the Site column marks each lead
message. **The site speaks only to parents of 3-7 year olds and family buying for them**
([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time), 2026-10-10): no corporate-gifting or preschool sections.

| Audience | Lead message | Proof to show | Proof exists? | Site |
|---|---|---|---|---|
| Mothers (main buyer) | "Twenty minutes that are good for their brain." | Pilot video of a child explaining "because…" to Kheelu | Partly. Seven consented films of real children and parents are live (`src/lib/video-moments.ts:101-204`), for example "Kheelu asks her to explain carrom" (`:194`); none has been checked for a "because…" answer. Using them on the new site: [open questions](../open-questions.md) G3. DS cast photos are fictional and never stand in (DS `03-cast.md` L5) | **BANNED** as written: a brain benefit credited to time with Kheelu, which [D016](../decisions/D016-brain-wording.md)'s rule rewords to the conversation form. (R7 listed "good for their brain"; D016's text does not name it, so this applies its rule.) The films: G3 |
| Fathers | "See how your child's thinking grows, week by week." | The weekly report screenshot | The report is confirmed for launch ([D036](../decisions/D036-launch-feature-claims.md)); no screenshot yet | **Reword**: describe the weekly report (D036), not growth: "thinking grows" promises an outcome (legal review L7). EXTERNAL once reworded, for example "Every week, the parent app shows your child's conversations across the four thinking skills." |
| Grandparents | "Kheelu asks questions in our language, so your grandchild thinks in it too." | 20-second clip in Kannada, Tamil or Hindi | Languages yes (`src/config/site.ts:145-154`); no such clip identified (the live films' labels name no Indian language) | **BANNED** as written: "so your grandchild thinks in it too" is a language outcome credited to Kheelu ([D025](../decisions/D025-speech-and-language.md); #33). "Kheelu asks questions in our language" alone is **EXTERNAL** (languages #3; asking back [D017](../decisions/D017-live-behaviour-claims-confirmed.md)) |
| Gift buyers and corporate HR | "Give a gift that grows young minds." | Unboxing, advisor's name, 15-day returns | No advisor ([D038](../decisions/D038-trust-content-rulings.md)). Returns are 7 days, not 15 (#22, [D021](../decisions/D021-returns-policy.md)) | The line: **BANNED** as written ([D016](../decisions/D016-brain-wording.md), [taglines](#taglines-and-hero)). Family gift buyers are in scope, with a conversation-form line. Corporate HR: **INTERNAL**, out of scope ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) |
| Preschools | "More thinking out loud for every child, with no screen in class." | Thinking Hour results | No | **INTERNAL**: out of scope ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time): the site is only for parents and family buyers) |
| Investors and press | "Kheelona builds conversation-first brain-development products for the foundational years, starting with Kheelu." | Pilot numbers; Kheelona OS belongs here | Not a website audience | **INTERNAL** (investor material, [content boundary](../site/content-boundary.md)) |

## Against the alternatives

Source: docx §7 L197–225.

"What parents compare Kheelu with. These are the real alternatives for the same money and the same minutes."

The Site column marks the line in "What Kheelu says". The rows compare categories only; the first three
columns are SKM's analysis (INTERNAL).

| What parents do today | What they get | Where it falls short | What Kheelu says | Site |
|---|---|---|---|---|
| Puzzles, activity books, STEM kits | Cheap, hands-on, "brain development" on the box | Can't talk, ask or explain; no progress to see | "Puzzles build hands. Conversation builds thinking." | **EXTERNAL IF CONFIRMED** (source check: cite the Harvard or Romeo anchor on the page; [D016](../decisions/D016-brain-wording.md) allows it), as in [taglines](#taglines-and-hero) |
| Enrichment classes (phonics, abacus, early learning) | Structure, a teacher | Fixed time, travel, pressure, recurring fees | "Every day at home, at your child's pace." | "Every day at home": **EXTERNAL**. "At your child's pace": **BANNED** (the "adapts" family, CTO ruling 2026-10-11, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)) |
| Learning apps and videos | Feels educational | A screen; the child taps and watches | "Thinking out loud, not tapping on a screen." | **EXTERNAL** (screen-free, #1) |
| Smart speakers and AI chatbots | Instant answers | Answers do the thinking for the child | "Other AI gives answers. Kheelu asks questions." | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14), as in [taglines](#taglines-and-hero) |
| AI companion toys | A talking toy, games | Sold as a friend; parents worry about attachment and data | "A toy, not a friend. Built for your child's thinking." (the founder allowed "friend" on 2026-10-11, [D041](../decisions/D041-gate-a-round-1.md); this contrast line stays usable) | **EXTERNAL IF CONFIRMED** (G5: dropping "friend" against the DS, [voice.md](voice.md#where-they-conflict) #1) |
| Parent and grandparent conversation | The best thing there is | Not available every minute | "Never a replacement for you. Kheelu sends the conversation back to you." | **EXTERNAL IF CONFIRMED** (F8: the hand-back, #16, is in the positioning only, not live) |

In public copy, name no brands: the docx's own row label "(Miko, MyWonder, Pookie)" is **INTERNAL**
(competitor intelligence, [D013](../decisions/D013-internal-vs-external-content.md); docx §10 L372–374).

## Proof points

Checked against **production** code (tag `archive/pre-reset-2026-10-10` = `77552ff`) on 2026-10-10.
**VERIFIED-ON-SITE** = the site already states it, with the file and line. **NEEDS-SOURCE** = no published or
written source this agent could find. Notes say where the unreleased mid version or a founder ruling adds
something. **Site** applies [claims.md](../product/claims.md) and the founder's rulings: a behaviour
claim that is live and founder-approved is EXTERNAL, row by row ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), narrowed by [D027](../decisions/D027-story-mode-wording.md)); a claim
that appears only in the positioning stays EXTERNAL IF CONFIRMED (F8).

| # | Proof point, as the docs state it | Docs | Status | Evidence or note | Site |
|---|---|---|---|---|---|
| 1 | Screen-free | docx §1 L7; Fig 3 | VERIFIED-ON-SITE | `src/lib/product-facts.ts:67` | **EXTERNAL** |
| 2 | A soft rabbit | docx §1 L7; §9 L276 | VERIFIED-ON-SITE | `src/lib/kheelu-art.ts:27` ("the cream talking plush rabbit") | **EXTERNAL** |
| 3 | English and the family's own language | docx §1 L7; §8 L241 | VERIFIED-ON-SITE | 8 languages named, up to 10: `src/config/site.ts:145–157`; `src/lib/product-facts.ts:68–71` | **EXTERNAL**, rendered from the language list ([facts.md](../product/facts.md)) |
| 4 | It only listens after its wake word | docx §9 L307; Fig 3 | **No longer a fact**: Kheelu has no wake word ([D018](../decisions/D018-wake-up-button.md)) | A wake-up button turns the microphone on instead ([D018](../decisions/D018-wake-up-button.md); the listening row on [facts.md](../product/facts.md#what-it-listens-for-and-where-the-voice-goes)). The retired live wording and its 15 locations: [claims.md §4.1](../product/claims.md#41-the-retired-microphone-wording) | **BANNED**: every wake-word line, including the 2026-10-04 replacement "listens only for its wake word, and records or sends nothing before it" ([D018](../decisions/D018-wake-up-button.md)). Use the button and light lines under [confirmed candidate lines](#confirmed-candidate-lines) (**EXTERNAL**) |
| 5 | It can't browse the internet | docx §9 L307; Fig 3 | VERIFIED-ON-SITE | `product-facts.ts:74` | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)). Never "Internet access: None" ([claims.md §4](../product/claims.md#4-retired-or-banned-wording)) |
| 6 | You can read every conversation | docx §9 L307; Fig 3 | VERIFIED-ON-SITE | `product-facts.ts:79` | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md): parents read every conversation in the app) |
| 7 | It always says it's a toy, never asks for a secret | docx §9 L307; Fig 3 | NEEDS-SOURCE on the live site | Not in production code. Founder-confirmed 2026-10-04 on the mid version (`mid:CLAUDE.md:19-20`; `mid:src/lib/safety.ts:35-36`); see [claims.md §1](../product/claims.md#1-confirmed-by-the-founder) | **EXTERNAL** (founder-confirmed 2026-10-04, [claims.md §1](../product/claims.md#1-confirmed-by-the-founder)) |
| 8 | Stories work offline | Fig 3; docx §8 L250 | VERIFIED-ON-SITE | `product-facts.ts:75–78` (Story mode offline; AI mode needs home Wi-Fi) | **EXTERNAL**, mode by mode only: Story mode (stories, poems and jingles, [D027](../decisions/D027-story-mode-wording.md)) works offline; AI mode needs home Wi-Fi; never a blanket "works offline" |
| 9 | We never sell your child's data | docx §9 L311 | VERIFIED-ON-SITE | `product-facts.ts:80`; confirmed for the new site as "We don't sell your data." ([D020](../decisions/D020-provider-terms-and-no-sale.md)) | **EXTERNAL** (the live, documented `/privacy` states it, `src/app/(site)/privacy/page.tsx:189`; [D020](../decisions/D020-provider-terms-and-no-sale.md)) |
| 10 | Delete any time | docx §9 L311 | VERIFIED-ON-SITE | `product-facts.ts:79` ("deletable in one tap") | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md): one-tap delete; the retention line beside it, #11) |
| 11 | Recordings kept for X days | docx §9 L311 (bracketed) | **Answered** ([D020](../decisions/D020-provider-terms-and-no-sale.md)) | Conversation transcripts: 36 months, then deleted automatically ([D020](../decisions/D020-provider-terms-and-no-sale.md) item 7) | **EXTERNAL** in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s retention line ([confirmed candidate lines](#confirmed-candidate-lines)). Say "conversations", never "recordings": D020 sets the period for transcripts, and no decision states one for audio |
| 12 | Voice is / is not used to train AI | docx §9 L311; §12 L411 | **Answered** ([D020](../decisions/D020-provider-terms-and-no-sale.md), [D035](../decisions/D035-model-training-opt-out.md)) | The outside speech and AI providers never train on it, by contract (D020). Kheelona's own model trains on voice and transcripts by default; parents can opt out (D035) | **EXTERNAL** in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s providers line, scoped to the providers. Training is stated on `/terms` and `/privacy` only (D035); customer pages never mention it and never imply there is none. Any "not used to train AI" form is **BANNED** |
| 13 | Where the audio goes; "servers in India" only if true for the AI processing too | docx §10 L366–368; §12 L411 | **Answered** ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | Multiple outside speech and AI providers ([D019](../decisions/D019-voice-providers.md)), processing on servers in India for every provider, only to produce the reply, keeping nothing, by contract ([D020](../decisions/D020-provider-terms-and-no-sale.md)). SKM's test is met | **EXTERNAL** in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s providers line. "Only Kheelona's own servers" and "never leaves Kheelona" are **BANNED** ([D019](../decisions/D019-voice-providers.md)); so is "region-pinned" ([voice.md](voice.md#where-they-conflict) #11) |
| 14 | Kheelu answers, then asks a question back | docx §1 L7; §8 L237 | VERIFIED-ON-SITE | `src/components/organisms/KheeluModes.tsx:35, 41`; `src/lib/growth-arc.ts:32`; `src/app/(site)/page.tsx:77` | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)). "Most turns" is #15 |
| 15 | Kheelu ends **most** turns with a question | docx §10 L376; §12 L407 | NEEDS-SOURCE | Product confirmation pending; the master line depends on it. [open questions](../open-questions.md) F8 | **EXTERNAL IF CONFIRMED** (F8: positioning only, not live, so [D017](../decisions/D017-live-behaviour-claims-confirmed.md) does not cover it) |
| 16 | Kheelu hands the conversation back to family ("Tell Amma what we found out") | docx §9 L309; §10 L377; Fig 1 | NEEDS-SOURCE | Not on the site; F8 | **EXTERNAL IF CONFIRMED** (F8) |
| 17 | Remembers what your child has learnt, so tomorrow builds on today | docx §2 L55; §9 L313 | VERIFIED-ON-SITE | `growth-arc.ts:37` ("remembers where your child stopped yesterday") | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md): memory is a live, founder-approved claim, [claims.md §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)), within the live claim: the words a child knows and where they stopped. Never "long-term memory". SKM's "and loves" goes beyond the live claim: **EXTERNAL IF CONFIRMED** (F8) |
| 18 | Grows with your child | docx §1 L7 | VERIFIED-ON-SITE | `growth-arc.ts:47` | **BANNED** (the "adapts" family, CTO ruling 2026-10-11, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)). Say instead what is confirmed: a parent sets the child's age in the app and the age-graded safety layer follows it; Kheelu remembers earlier conversations ([D036](../decisions/D036-launch-feature-claims.md)) |
| 19 | Builds four thinking skills, at your child's level | docx §8 L241 | Partly answered | No advisor exists ([D038](../decisions/D038-trust-content-rulings.md)); the weekly report on the four skills is confirmed ([D036](../decisions/D036-launch-feature-claims.md)) | **BANNED** as written: "builds" is a learning outcome (legal review L7) and "at your child's level" is the "adapts" family ([claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)). EXTERNAL: the four skills named as what the weekly report covers (#20) |
| 20 | A weekly report on the four skills, compared only with your child's own past | docx §8 L245 | **Confirmed for launch** ([D036](../decisions/D036-launch-feature-claims.md)) | The weekly four-skills report and the new-word count are confirmed (D036). "Compared only with your child's own past" was not part of the answer | **EXTERNAL**: a weekly report on the four thinking skills, and a new-word count (D036). "Compared only with your child's own past": **EXTERNAL IF CONFIRMED** (F8) |
| 21 | "You'll see in the report if they're still using it" | docx §9 L313 | NEEDS-SOURCE | The mid version recorded that usage time in the app "is NOT a published feature" (`mid:src/lib/faq.ts:87-88`). F8 | **EXTERNAL IF CONFIRMED** (F8); usage time is not a published feature ([claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)) |
| 22 | 15-day returns | docx §9 L292, L313, L317 | **Wrong figure**: returns are 7 days ([D021](../decisions/D021-returns-policy.md)) | Live `/refund`: post-dispatch returns terms "are not written yet" (`src/app/(site)/refund/page.tsx:65`), held until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)). The new terms: [D021](../decisions/D021-returns-policy.md), owned by [../product/policies.md](../product/policies.md) | "15-day returns": **BANNED** (not the policy). "7-day returns, no questions asked": **EXTERNAL** ([D021](../decisions/D021-returns-policy.md)) |
| 23 | [1-year] warranty | docx §9 L317 (bracketed) | **Wrong figure**: the warranty is 6 months ([D022](../decisions/D022-warranty-replacement-refund.md)) | Live: "Terms land closer to launch." (`product-facts.ts:88`). The new terms: [D022](../decisions/D022-warranty-replacement-refund.md) | "1-year warranty": **BANNED**. "6-month warranty on manufacturing defects", not drops, water or misuse: **EXTERNAL** ([D022](../decisions/D022-warranty-replacement-refund.md)) |
| 24 | "₹499 reserves it, refundable until we ship" | docx §9 L319 | VERIFIED-ON-SITE, token mode only | `src/config/site.ts:69, 110–111`; `product-facts.ts:82`. After the first 500 units there is no token (`site.ts:65–66`) | **EXTERNAL**, token mode only, and only in [D028](../decisions/D028-price-wording.md)'s form: ₹499 first, the ₹4,999 total (incl. GST) in the same sentence, "refundable" beside the advance. Never on its own: that is the wording an answer engine read as the price (D028). Amounts render from the checkout's own source ([pricing.md](../product/pricing.md)) |
| 25 | ₹4,999 | docx §1 L4 | VERIFIED-ON-SITE, first 500 units | `site.ts:64, 86`; then ₹7,999 (`site.ts:67`) | **EXTERNAL** for the first 500 units, with "incl. GST" wherever it appears ([D024](../decisions/D024-payment-methods-gst.md)), rendered from the checkout's own source. Machine-read outputs (Product JSON-LD, `llms.txt`, `pricing.md`, titles, meta descriptions, ad text) lead with it, the advance second ([D028](../decisions/D028-price-wording.md)). Any unit count beyond "first 500" is INTERNAL |
| 26 | A named child-development advisor | docx §11 L386–387; §12 L409 | **Answered: none** ([D038](../decisions/D038-trust-content-rulings.md)) | None exists; every advisor reference is dropped | **BANNED** (D038) |
| 27 | Pilot counts, pilot videos, Thinking Hour results | docx §8 L239; §9 L283, L295 | NEEDS-SOURCE (counts, results) | No pilot counts or Thinking Hour results in any source reached. Videos: seven consented films are live (see [Messages by audience](#messages-by-audience)) | Films: **EXTERNAL IF CONFIRMED** (G3). Counts and Thinking Hour results: only once real pilot data exists (the promise to publish them is dropped, [D038](../decisions/D038-trust-content-rulings.md)), with its sample shown ([claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)); the raw pilot data stays INTERNAL |
| 28 | Research: serve and return (Harvard) | docx §4 L99–102 | VERIFIED-ON-SITE (cited) | `src/app/(site)/page.tsx:277–278`; `src/lib/stories-expansion.ts:215` | **EXTERNAL** (public research, checked 2026-10-10), only in the [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors) form: cited, keeping "a caring adult"; "built around", never "Harvard-proven" |
| 29 | Research: Romeo 2018 (ages 4–6) | docx §4 L103–106 | VERIFIED-ON-SITE (journal) | `stories-expansion.ts:28, 40` ("36 children aged four to six") | **EXTERNAL** (public research, checked 2026-10-10, [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)), always with its ages, 4 to 6 |
| 30 | Research: Xu 2022 | docx §4 L107–110 | Verified 2026-10-10 ([source verification](../research/source-verification.md) C10: SUPPORTED-WITH-REWORDING) | University of California, Irvine (not Harvard); 117 children aged 3 to 6; a smart speaker, not Kheelu; not "learnt more words" | **EXTERNAL** in the verified line only ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)). **Guard ([D027](../decisions/D027-story-mode-wording.md)):** cite Xu only for Kheelu asking back in conversation; never pair it with stories or Story mode, and never follow it with "Kheelu is built around that" |
| 31 | NEP 2020: over 85% of brain development by age 6 | docx §3 L67; §10 L330 | Verified 2026-10-10 ([source verification](../research/source-verification.md) C01: SUPPORTED-WITH-REWORDING) | Checked against NEP 2020 para 4.1 itself, not EducationWorld | **EXTERNAL** in the verified wording only ([D026](../decisions/D026-public-statistics.md)): quoted as NEP says it, with a linked source marker, paired with what a parent can do; never "research shows" or "85% of the brain" |
| 32 | BIS date; outside safety test | docx §8 L251 | **BIS licence under application, not granted** (founder, 2026-10-11, L1) | "In progress… no badge is claimed before it is earned" (`product-facts.ts:89–92`); [claims.md §6](../product/claims.md#6-certifications) | **BANNED** until a licence number exists (BIS Act s.17(2)); the honest status "applied for, not yet granted" is **EXTERNAL** ([claims.md §6](../product/claims.md#6-certifications)). The red-teaming claim is separate and confirmed ([D036](../decisions/D036-launch-feature-claims.md)) |
| 33 | "Your grandchild thinks in it too" | docx §9 L288 | Languages VERIFIED; the implied language-development claim NEEDS-SOURCE | DS lists "mother-tongue education (as a claim)" as a phrase to avoid (`01-writing.md` L38); F9 | **BANNED** as written: a language outcome credited to Kheelu, which [D025](../decisions/D025-speech-and-language.md) rules out as [D016](../decisions/D016-brain-wording.md) does for the brain. The languages themselves are EXTERNAL (#3) |

## Confirmed candidate lines

The new lines from the founder's rulings of 2026-10-10 and 2026-10-11, quoted from the decision that
owns each. The facts behind a line live in that decision and on the owner page named; read the decision
before reusing a line. All are **EXTERNAL as drafts**: the founder signs off final copy at Gate A
([D015](../decisions/D015-founder-signs-off-copy.md)). Amounts, dates and periods render from one content source (Phase 4), never hand-typed
([D023](../decisions/D023-new-order-delivery.md), [D028](../decisions/D028-price-wording.md)).

| Topic | Candidate line (draft, verbatim from the owner) | Owner | Site and wording rules |
|---|---|---|---|
| Listening, short | "No wake word. Press to talk. Off after a minute of quiet." | [D018](../decisions/D018-wake-up-button.md); [facts.md](../product/facts.md#what-it-listens-for-and-where-the-voice-goes) | **EXTERNAL**. The button is the "wake-up button" (en-IN, hyphenated) |
| Listening, safety heading | "You'll always see when Kheelu is listening." (alternative: "Kheelu only listens when someone presses its button.") | [D018](../decisions/D018-wake-up-button.md) | **EXTERNAL** |
| The light | "A light on Kheelu shows whenever it's listening." | [D018](../decisions/D018-wake-up-button.md) | **EXTERNAL**. Never name a colour or pattern: none is specified |
| Listening, body and FAQ | The body line and the answer to "Is Kheelu always listening?", as drafted in D018 | [D018](../decisions/D018-wake-up-button.md) | **EXTERNAL**. Describe the mechanism, never an absolute: no "no risk" or "zero risk"; never "nothing is ever recorded" (conversations are kept for parents, [D017](../decisions/D017-live-behaviour-claims-confirmed.md)); no claim that the microphone is physically or electrically disconnected unless the founder confirms it |
| Voice providers | "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India." (the line continues in D020: reply only, keep nothing, never train, by contract) | [D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md) | **EXTERNAL**, the full line verbatim. "Trusted" describes our choice of provider, not a certification. If any provider ever moves processing abroad, this line changes first (D020). BANNED: "only Kheelona's own servers", "never leaves Kheelona", "Nothing rented that matters" and its "own the model" family ([D019](../decisions/D019-voice-providers.md)) |
| No sale | "We don't sell your data." | [D020](../decisions/D020-provider-terms-and-no-sale.md) | **EXTERNAL** (the live "We never sell your child's data" says the same, #9) |
| Retention | "Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap." | [D020](../decisions/D020-provider-terms-and-no-sale.md) | **EXTERNAL**. The same period goes on `/privacy` (legal pages approved by the founder under [D029](../decisions/D029-grievance-officer-legal-review.md)), beside the training disclosure ([D035](../decisions/D035-model-training-opt-out.md)) |
| Safety block order | The wake-up button and light, then the providers line, then parents read and delete every conversation in the app, then "We don't sell your data." | [D020](../decisions/D020-provider-terms-and-no-sale.md) (with [D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D018](../decisions/D018-wake-up-button.md)) | **EXTERNAL** as an order. It replaces SKM's "Is it safe?" list ([objection answers](#objection-answers)) |
| Returns, near the CTA | "7-day returns, no questions asked." | [D021](../decisions/D021-returns-policy.md); [policies.md](../product/policies.md) | **EXTERNAL**: a conversion line beside the CTA as well as a policy (D021) |
| Returns, policy | "Changed your mind? Return Kheelu within 7 days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged." | [D021](../decisions/D021-returns-policy.md) | **EXTERNAL**. "Of delivery" is D021's reading, which the founder may correct |
| Returns and warranty, near the CTA | "7-day returns, no questions asked · 6-month warranty" | [D022](../decisions/D022-warranty-replacement-refund.md) | **EXTERNAL** |
| Warranty | "6-month warranty on manufacturing defects. It doesn't cover drops, water damage or misuse." | [D022](../decisions/D022-warranty-replacement-refund.md) | **EXTERNAL**. Add the remedy after day 7 when the policy needs it: "After the first 7 days, we repair it, or replace it if the repair doesn't work." ([D033](../decisions/D033-warranty-after-day-7.md)) |
| Faulty on arrival | "Arrived faulty? Tell us within 7 days of receiving it and we'll replace it." | [D022](../decisions/D022-warranty-replacement-refund.md) | **EXTERNAL**; never a replacement timeline |
| Pickup and refund | "We arrange the pickup, free. Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days." | [D022](../decisions/D022-warranty-replacement-refund.md), [D033](../decisions/D033-warranty-after-day-7.md) | **EXTERNAL**. "Free" pickup is confirmed (D033); never a delivery or replacement timeline. "Within 7 working days of the unit reaching us", never "of receipt" |
| Faulty or not as described | "Faulty or not as described? You can have a replacement or a full refund." | [D033](../decisions/D033-warranty-after-day-7.md) (E-Commerce Rule 7(4)) | **EXTERNAL** on the policy pages (draft; the founder approves the legal pages, [D029](../decisions/D029-grievance-officer-legal-review.md)) |
| Grievance officer | "Grievance Officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it." | [D032](../decisions/D032-grievance-block-and-call-line.md); [policies.md](../product/policies.md) | **EXTERNAL** on /contact, /refund, /terms, /privacy and the store footer, from one content value. Never "5 days" or "30 days". The WhatsApp number takes calls on the new site, so the "messages only" label goes |
| Origin and MRP | "Made in India." · "MRP ₹7,999 (incl. of all taxes)" | [D034](../decisions/D034-origin-manufacturer-mrp.md) | **EXTERNAL** in the product-page declarations block. "MRP" labels only the real MRP; no strike-through urgency ([pricing.md](../product/pricing.md)) |
| No advertising | "Your child's data is never used to advertise to them." (the live idea: never used to advertise to your child) | [D038](../decisions/D038-trust-content-rulings.md) (F17) | **EXTERNAL** |
| Launch features | Weekly four-skills report · remembers earlier conversations · says when it doesn't know · parent alerts · curated, closed content library · age-graded safety layer set to the age a parent enters in the app · red-teamed before launch · new-word count | [D036](../decisions/D036-launch-feature-claims.md) | **EXTERNAL** as product behaviour only, never as an outcome for the child |
| Payment and GST, near the CTA | "Pay by UPI, card or net banking · Price includes GST · GST invoice with every order" | [D024](../decisions/D024-payment-methods-gst.md); [policies.md](../product/policies.md#payment-methods) | **EXTERNAL**. Every price shows "incl. GST". Never mention wallets, EMI or Pay Later: they are not offered |
| Delivery, new orders | "Reserve Kheelu with ₹499 today. Deliveries start mid-November." | [D023](../decisions/D023-new-order-delivery.md) | **EXTERNAL** on the new site in this pairing only: D028's one-sentence price line (below), then "Deliveries start mid-November." The date renders from one content value, which also sets the Product JSON-LD `availabilityStarts` 2026-11-15 ([D037](../decisions/D037-delivery-date-in-schema.md)). Never lead with "₹499 today" alone ([D028](../decisions/D028-price-wording.md)). Production keeps "20 October 2026" until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md), [D023](../decisions/D023-new-order-delivery.md): an accepted risk, not re-raised) |
| Story mode | "**Story mode:** Stories, poems and jingles your child enjoys and learns from. No WiFi needed." | [D027](../decisions/D027-story-mode-wording.md); [facts.md](../product/facts.md#modes-and-connectivity) | **EXTERNAL**. "Lessons" is BANNED everywhere, and so is any claim that a story can be interrupted and questioned: there is no such feature ([D027](../decisions/D027-story-mode-wording.md)). Quoted here as the founder wrote it; the copy renders "No Wi-Fi needed" (the DS spelling, [voice.md](voice.md#ds-mechanics-that-apply-the-positioning-is-silent)), subject to the founder's OK at Gate A |
| Kheelona+ | "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. Kheelu's smart features keep working for life, with no subscription needed. Kheelona+ pricing will be announced soon." | [D027](../decisions/D027-story-mode-wording.md); [facts.md](../product/facts.md#kheelona) | **EXTERNAL**, verbatim. It replaces the live `KHEELONA_PLUS_LINE` on the new site only (production is untouched until Gate B, [D011](../decisions/D011-production-held-until-gate-b.md)). Still no ₹ amount for Kheelona+, and "talking is free for life" stays unconfirmed: what keeps working after the 6 months is not decided ([D038](../decisions/D038-trust-content-rulings.md), F7, a Gate A item) |
| Price, next to the CTA | **One-sentence form (CTO, 2026-10-11, for Gate A):** "Reserve Kheelu for ₹499 today, refundable, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST) before delivery." D028's own two-sentence draft: "Reserve for ₹499 today. Kheelu is ₹4,999 in total (incl. GST); the remaining ₹4,500 is due before delivery." | [D028](../decisions/D028-price-wording.md); [pricing.md](../product/pricing.md) | **EXTERNAL**, token mode only. The one-sentence form meets D028's rule (₹499 first, the ₹4,999 total in the same sentence, "refundable" beside the advance); the founder picks at Gate A. Paired with the delivery line (above). Machine-read outputs lead with ₹4,999 (incl. GST). How the display follows the live offer mode is G9 |
| Speech and language disclaimer | "Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician." | [D025](../decisions/D025-speech-and-language.md) | **EXTERNAL** on Terms and Meet Kheelu (`/products/kheelu`) only, **not on Home**. Journal articles about speech delay keep a one-line disclaimer inside the article |
| Behaviour, confirmed | Answers, then asks a question back · cannot browse the internet · parents read every conversation in the app · one-tap delete | [D017](../decisions/D017-live-behaviour-claims-confirmed.md) | **EXTERNAL**: [proof points](#proof-points) #14, #5, #6, #10 |

## Internal research figures

These figures and findings rest on SKM's internal documents: the **research brief (30 May
2026)**, the **competitor review v9 (30 Sep 2026)** and the **90-day plan (7 Oct 2026)** (docx §13 L420),
none of which is in the project. Each is **INTERNAL (research: shapes strategy, never on the site;
[D013](../decisions/D013-internal-vs-external-content.md))**, attributed or not. Q4 is closed: the
documents are not needed. Other brand pages mark these figures and link here.

| Figure or finding | Rests on | Docx | Site |
|---|---|---|---|
| "70% of parents want an AI toy to help their child learn", "the top reason to buy" | Research brief | §2 L29; §3 L68 | **INTERNAL** (research: shapes strategy, never on the site; D013) |
| 19% want a companion; 56% reject companionship | Research brief | §2 L29 | **INTERNAL** (research: shapes strategy, never on the site; D013) |
| "Indian parents fear the screen more than AI" | Research brief | §2 L31 | **INTERNAL** (research: shapes strategy, never on the site; D013) |
| The research's earlier positions (core age 6 to 8, exclude under 4; tutor framing; "demonstrably safe, screen-free, learning-first"; position against Miko on price) | Research brief ("Research says") | §2 L34–47 | **INTERNAL** (research: shapes strategy, never on the site; D013) |
| "No screen does not separate Kheelu" | Competitor review v9 | §2 L46 | **INTERNAL** (research: shapes strategy, never on the site; D013) |
| Pookie (Scoobies) at **₹6,999**, "a friend-like companion that understands moods" | Competitor review ("Scoobies Pookie page (from the competitor review)", §13 L436) | §2 L49; §3 L81–83 | **INTERNAL** (research: shapes strategy, never on the site; D013). A competitor name and price |
| Gate 1 on 1 November and the plan's channels (WhatsApp-assisted selling, Bengaluru demos, Story Hours) | 90-day plan | §11 L379 | **INTERNAL** (research: shapes strategy, never on the site; D013). A plan |

Not from these three, but also not in the project, and also **INTERNAL**: "the deck" behind "10 new words
learnt" (docx §8 L246; §12 L408). From the same deck, "maps your emotions and triggers" (§2 L50–54) is
**BANNED** ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time): emotion reading of any kind; [claims guardrails](#claims-guardrails)). Unsourced in
the docx itself, and **INTERNAL**: the ₹1,599 "ChatGPT robots" price (§5 L131; a competitor price) and
the buyer age 28 to 40 (§6 L165; a demographic).

## Objection answers

Source: docx §9 L299–319.

SKM: "Items in [brackets] need product confirmation." The objections themselves are on
[audience.md](audience.md#objections).

| Objection | SKM's answer | Blocked by | Site |
|---|---|---|---|
| "Won't AI make my child think less?" | "That's exactly what we designed against. Most AI gives answers. Kheelu answers, then asks your child a question back, so they do the thinking." | – (asking back is confirmed, #14) | **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14). "Most AI" is a category |
| "Does it really help the brain?" | "Research shows back-and-forth conversation helps young children's language and thinking, and that children understood stories better when an AI asked them questions. Kheelu is built around that. Our pilot results will be published, good or bad." | The pilot promise is dropped ([D038](../decisions/D038-trust-content-rulings.md)); Xu verified with rewording (#30) | Clause by clause: the conversation clause, cited, in the [D016](../decisions/D016-brain-wording.md) form, then "Kheelu is built to give your child more of that back-and-forth": **EXTERNAL** ([claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)). The Xu clause: **EXTERNAL** only as its own verified line (#30), and **never followed by "Kheelu is built around that"**: read together they say Kheelu asks questions during stories, which [D027](../decisions/D027-story-mode-wording.md) rules out. The pilot sentence: **BANNED** (D038) |
| "Is it safe?" | "It only listens after its wake word, it can't browse the internet, you can read every conversation, and it always says it's a toy, never asks for a secret." | The wake-word clause is no longer true (#4, [D018](../decisions/D018-wake-up-button.md)) | **BANNED** as written: there is no wake word ([D018](../decisions/D018-wake-up-button.md)). Answer in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s order instead ([confirmed candidate lines](#confirmed-candidate-lines)): the wake-up button and light, the providers line, parents read and delete every conversation, "We don't sell your data". "It can't browse the internet" ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #5) and "it always says it's a toy, never asks for a secret" (#7) are also **EXTERNAL**. No "no risk" absolutes ([D018](../decisions/D018-wake-up-button.md)) |
| "Will my child get attached?" | "Kheelu is a toy, not a friend. It ends chats by sending your child back to you, like 'Tell Amma what we found out about elephants.'" | Hand-back unconfirmed (#16) | **EXTERNAL IF CONFIRMED** (F8: the hand-back, #16; G5: "not a friend"). That Kheelu says it is a toy is **EXTERNAL** (#7) |
| "What happens to my child's voice and data?" | "We never sell your child's data. [Recordings kept for X days; delete any time. Voice is / is not used to train AI.]" | Answered ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | **EXTERNAL** in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s lines ([confirmed candidate lines](#confirmed-candidate-lines)): the providers line, "We don't sell your data", the 36-month retention line and one-tap delete ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)). SKM's brackets do not survive as written: "recordings" becomes "conversations" (#11), and the training clause is the providers' promise (#12) |
| "Will my child use it after a week?" | "Kheelu remembers what your child has learnt, so each day builds on the last. You'll see in the report if they're still using it. If it isn't loved, 15-day returns." | #21 (F8) | Memory: **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #17, within the live claim). The report sentence: **EXTERNAL IF CONFIRMED** (F8, #21). "15-day returns": **BANNED** (the policy is 7 days, [D021](../decisions/D021-returns-policy.md)); "7-day returns, no questions asked" is **EXTERNAL** |
| "Does it speak our language?" | "Tell me your language and I'll send a 20-second clip now." | WhatsApp sales script, not site copy; clips needed | **INTERNAL**: a WhatsApp sales move, not site copy. On the site the answer is the language list (EXTERNAL, #3) |
| "Will it break?" | "[1-year] warranty and 15-day returns." | Answered ([D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md)) | **BANNED** as written: both figures are wrong. **EXTERNAL**: "7-day returns, no questions asked · 6-month warranty", with the faulty-on-arrival line ([D022](../decisions/D022-warranty-replacement-refund.md)) |
| "Why ₹4,999?" | "It's there every day, it talks with your child in your language, and you see the progress. ₹499 reserves it, refundable until we ship." | ₹499 is token mode only (#24) | "You see the progress": **EXTERNAL** only as the weekly report and new-word count ([D036](../decisions/D036-launch-feature-claims.md), #20), never a promised outcome (legal review L7). The ₹499 sentence is **EXTERNAL** in token mode only, and only in [D028](../decisions/D028-price-wording.md)'s form, with the ₹4,999 total in the same sentence (#24) |

## Claims guardrails

"A brain promise is only as strong as its weakest claim… Share these two tables with the designer, interns,
creators and founders." (docx §10 L321). Every brain claim is "worded so it can be backed up ('built to
support', not 'boosts'), signed off by the child-development advisor, and never uses fear" (docx §1 L14).
The founder's rulings tighten this: promises credit conversation, never Kheelu ([D016](../decisions/D016-brain-wording.md)); speech and
language claims use public sources only and never promise an outcome ([D025](../decisions/D025-speech-and-language.md)); public statistics are
used only after independent verification, each with a linked marker ([D026](../decisions/D026-public-statistics.md)).

**What we can and cannot say about the brain** (docx §10 L323–346; pdf p.11). Every entry under "Never
say this" is **BANNED** ([claims.md §4](../product/claims.md#4-retired-or-banned-wording) carries the list); the Site column marks the "Say this" line.

| Topic | Say this | Never say this | Site ("Say this") |
|---|---|---|---|
| The core promise | "Built to support your child's brain development through conversation" / "Helps your child's brain grow" (after advisor sign-off) | "Boosts IQ", "makes your child smarter", "develops the brain 2x faster", "genius" | "Built to support…": **BANNED** as written; [D016](../decisions/D016-brain-wording.md) requires it reworded to the conversation form. "Helps your child's brain grow": **BANNED** ([D016](../decisions/D016-brain-wording.md), settled, advisor or not) |
| The early years | "NEP 2020 notes that over 85% of brain development happens by age 6" (with source) | "Don't miss the window", "your child will fall behind" (fear; ASCI) | **EXTERNAL** in the verified wording ([source verification](../research/source-verification.md) C01; [D026](../decisions/D026-public-statistics.md), #31) |
| Conversation research | "Harvard research shows back-and-forth conversation helps build young children's brains. Kheelu is built around the same idea." | "Harvard-proven", "scientifically proven toy" | **EXTERNAL** only in the [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors) form: cited, keeping "a caring adult", which SKM's wording drops (Harvard source checked 2026-10-10). Never imply Kheelu is the caring adult |
| AI research | "Studies found children understood stories better when an AI asked them questions" (Xu, 2022) | "As good as a parent" | **EXTERNAL** only in the verified line (#30), cited for asking back in conversation, never paired with stories or Story mode ([D027](../decisions/D027-story-mode-wording.md)) |
| Results | Pilot numbers with the sample shown ("In our pilot of X children over Y weeks…") | Any percentage or improvement without our own data | Only once real pilot data exists (no promise to publish it, [D038](../decisions/D038-trust-content-rulings.md)), with its sample shown ([claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)) |
| Health | Nothing | Speech delay, late talkers, ADHD, autism, therapy | Health claims stay **BANNED**. Speech and language may be discussed with public sources the Copywriter has read and cites, never as an outcome for Kheelu; the disclaimer ("a toy, not a therapy or treatment") is **EXTERNAL** on Terms and `/products/kheelu`, not on Home ([D025](../decisions/D025-speech-and-language.md); [confirmed candidate lines](#confirmed-candidate-lines)) |
| Memory and emotions | "Remembers what your child has learnt and loves" | "Maps emotions and triggers", "remembers life events and values", "long-term memory" | **EXTERNAL** within the live memory claim ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #17); "and loves": **EXTERNAL IF CONFIRMED** (F8). Emotion reading of any kind ("the feeling gets read", reading the child's mood, "maps emotions and triggers") is **BANNED** ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) |

**Added for 3 to 7 [3–7]** (this agent, from the brief §3 L58 and docx §2 L40, §4 L103): never present study
ages as covering 3-year-olds (Romeo 2018 studied 4 to 6); never use "toddler" or any wording that suggests
under 3; any "safe for" statement must match the toy-safety certification's age grade
([../product/age-band-review.md](../product/age-band-review.md); [open questions](../open-questions.md) G5).
Site: "toddler" and any under-3 wording are **BANNED** (the age rule on
[content boundary](../site/content-boundary.md)); the live "toddlers" pages are G5.

## Words to stop using

Source: docx §10 L347–374.

| Stop saying | Say instead | Why (SKM) | Still live on kheelona.com (2026-10-10) | Site |
|---|---|---|---|---|
| "AI toy" as the headline noun | "Brain-development toy"; "AI" in the sub-line | Keeps Kheelu out of the crowded AI-toy pile | Homepage title "Kheelu: the screen-free AI toy with a tutor inside" | Stop: **BANNED** as the headline noun only ("AI toy" in a sub-line is fine). Say: "brain-development toy" is **BANNED** as a product label ([D016](../decisions/D016-brain-wording.md); the mid version also retired "cognitive development toy", [claims.md §4](../product/claims.md#4-retired-or-banned-wording)); "brain development" is usable only as a searched TOPIC in titles, headings and articles ([D016](../decisions/D016-brain-wording.md)) |
| Companion, friend, best friend | "A toy that talks with your child" | The framing safety groups and new laws target | H1 "A best friend at 3."; WhatsApp share text "A screen-free talking friend that teaches" (`src/config/site.ts:164`). The DS calls Kheelu a friend: [open questions](../open-questions.md) G5 | Stop: **BANNED** in the positioning; the founder rules against the DS's "friend" at G5. Say: **EXTERNAL** |
| Tutor, teacher, syllabus, lessons | "Thinking skills", "learning through conversation" | Pulls us into edtech and adds pressure | Title "with a tutor inside"; "Story mode for stories and lessons" (`product-facts.ts:72`); Kheelona+ line "the stories, lessons, languages" (`site.ts:132`) | Stop: **BANNED**, with no exception: "lessons" is dropped everywhere, including the Story-mode spec and the Kheelona+ line, which [D027](../decisions/D027-story-mode-wording.md) replaces (production keeps the old line until Gate B, [D011](../decisions/D011-production-held-until-gate-b.md)). Say: "learning through conversation" **EXTERNAL**; "thinking skills" **EXTERNAL** as what the weekly report covers ([D036](../decisions/D036-launch-feature-claims.md)); for Story mode, "stories, poems and jingles" **EXTERNAL** ([D027](../decisions/D027-story-mode-wording.md)) |
| "Adapts to each kid" | "Asks back", "builds on what your child learnt yesterday" | Every rival says "adapts" | "Grows with your child" (`growth-arc.ts:47`) | Stop: **BANNED**, with the whole "adapts" family ("at your child's pace", "grows with your child", "at your child's level"; CTO ruling 2026-10-11, [claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)); emotion and mood reading are banned the same way ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)). Say: "asks back" **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #14); "builds on what your child learnt yesterday" **EXTERNAL** ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), #17), within the live claim (picks up where they stopped) |
| "Safe" alone; "banking-grade" | The four specific safety behaviours | Specifics are believed; adjectives aren't | – | Stop: **BANNED**. Say: the behaviours, in [D020](../decisions/D020-provider-terms-and-no-sale.md)'s order ([confirmed candidate lines](#confirmed-candidate-lines)) |
| "Servers in India" | Only if true for the AI processing too | If audio goes to an outside AI provider abroad, the claim is false | See #13 above | **EXTERNAL**: it holds for every provider ([D020](../decisions/D020-provider-terms-and-no-sale.md) item 6), said inside D020's providers line; if any provider ever moves processing abroad, the line changes first. "Kheelona's own servers", "only our own servers" and "never leaves Kheelona" are **BANNED** ([D019](../decisions/D019-voice-providers.md)) |
| Kheelona OS, wearables, robots | Just Kheelu | One product, one promise | `/playos` page and nav tab (`site.ts:31`); [open questions](../open-questions.md) G8 | Stop: **BANNED** on selling pages; `/playos` is a grey case for Gate A (G8, [content boundary](../site/content-boundary.md#grey-decided-case-by-case-at-gate-a)). Its "Nothing rented that matters" and the "own the model" family are **BANNED** wherever they appear ([D019](../decisions/D019-voice-providers.md)) |
| Competitor brand names (including Alexa) | "Smart speaker", "robot toy with a screen" | Legal risk | None in live copy | Stop: **BANNED** (and INTERNAL: competitor intelligence). Say: the generic categories are **EXTERNAL** |

Also out, and **BANNED** (docx §2 L30; §11 L395): "AI best friend" content of any kind; "brain-boost" claims.

**Banned by the founder's rulings (2026-10-10/11):** every wake-word line, and "Hey Kheelu" style
prompts wherever they imply one; "no risk" or "zero risk"; "nothing is ever recorded" ([D018](../decisions/D018-wake-up-button.md)). "Only
our own servers", "never leaves Kheelona", "Nothing rented that matters" ([D019](../decisions/D019-voice-providers.md)). Reading the child's
feelings or mood, in any words ([R5](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)). "Lessons", and any claim that a story can be interrupted,
questioned or quizzed on ([D027](../decisions/D027-story-mode-wording.md)). "Kheelu grows / helps grow / develops your child's brain", and
"brain-development toy" as a product label ([D016](../decisions/D016-brain-wording.md)). Wallets, EMI and Pay Later, which are not offered
([D024](../decisions/D024-payment-methods-gst.md)). Any "not used to train AI" or "your child's voice is never used" form
([D035](../decisions/D035-model-training-opt-out.md)). The "adapts" family ([claims.md §3](../product/claims.md#3-not-confirmed-do-not-publish)). Any advisor
reference and the pilot-results promise ([D038](../decisions/D038-trust-content-rulings.md)). "Free pickup" is now allowed
([D033](../decisions/D033-warranty-after-day-7.md)). **Waiting on the founder, so not published:** any claim that the microphone is
physically or electrically disconnected ([D018](../decisions/D018-wake-up-button.md)).

## CTA labels

**This section is the only owner of the CTA-label candidates.** The choice is made at Gate A:
[open questions](../open-questions.md) G1. The brief wants one primary label, the same everywhere (brief §9.1),
and "CTA labels exactly as the strategy defines them" (brief §6, Copywriter). **The positioning defines no
button label**: its only purchase wording is prose inside an objection answer, "₹499 reserves it, refundable
until we ship." (docx §9 L319).

| # | Label | Source | Used for | Status | Site |
|---|---|---|---|---|---|
| 1 | "Pre-order Lumi" | **Founder decision #9, 2026-08-23**: "CTA label stays 'Pre-order Lumi' (no number on the button; price in the caption)" (`docs/checkpoints/migration-to-new-dsx.md:52`) | Every CTA | Founder decision; the product was renamed Kheelu on 2026-09-05, which gives #2 | **BANNED**: "Lumi" as the current name ([claims.md §4](../product/claims.md#4-retired-or-banned-wording)) |
| 2 | **"Pre-order Kheelu"** | `PREORDER_LABEL` (`src/config/site.ts:90-94`: "founder-chosen 2026-08-22. No number on the button"); the price sits in `PRICE_CAPTION` (`:97`) | Every pre-order CTA | **Live** | **EXTERNAL IF CONFIRMED** (G1) |
| 3 | "Reserve Kheelu for ₹499"; short form "Reserve ₹499" | `mid:src/config/site.ts:107, 109` (CMO merge, 2026-10-04; chosen to match the store's own "Reserve" wording, `:96-99`) | Long form everywhere; short form in the nav and sticky bar | **Never live.** Puts a number on the button, against #1. Token mode only, by its own comment (`mid:src/config/site.ts:102-106`) | **EXTERNAL IF CONFIRMED** (G1); token mode only |
| 4 | "Pre-order Kheelu" | DS: "Any selling surface" (`01-writing.md:53`); "One cta per view" (`07-selling.md:51`) | Main action | DS default; same as #2 | **EXTERNAL IF CONFIRMED** (G1), as #2 |
| 5 | "Pre-order for ₹499" | DS: "Showing the deposit" (`01-writing.md:54`); `OfferCard` default `cta` (`bundle.js:292`; its README names no default) | Offer card | DS default; token mode only | **EXTERNAL IF CONFIRMED** (G1); token mode only |
| 6 | "Pre-order" | DS: "Sticky bar, small spaces" (`01-writing.md:55`); `StickyBuyBar` default `cta` (`bundle.js:312`; `StickyBuyBar/README.md:3`) | Sticky bar | DS default. The bar's default note beside it is "Reserve for ₹499 today" (`bundle.js:311`; README `:7`) | **EXTERNAL IF CONFIRMED** (G1); the "₹499" note beside it is token mode only, and on its own breaks [D028](../decisions/D028-price-wording.md) (no total in the sentence) |
| 7 | "Pre-order at kheelona.com" | DS: "Social and WhatsApp" (`01-writing.md:56`) | Off-site | DS; not a site label | **EXTERNAL IF CONFIRMED** (G1), off-site only |
| – | "Reserve for ₹499" | DS: barrier-price example, "Lead with the barrier price where it helps" (`07-selling.md:42`) | Guidance, not a set label | Disagrees with #5 | **EXTERNAL IF CONFIRMED** (G1); token mode only |

- The DS prescribing three labels against "same label everywhere" is DS gap
  [G-07](../design-system/gaps.md#g-07); component facts are on [component-map.md](../design-system/component-map.md).
- Any label carrying "₹499" (#3, #5, the sticky note) is false once the first 500 units are sold, because
  full-price orders take no token (`src/config/site.ts:65-66`).
- [D028](../decisions/D028-price-wording.md) sets the wording NEXT TO the CTA (₹499 first, the ₹4,999 total in the same sentence); it does
  not choose the label, which stays G1. A label carrying "₹499" cannot hold the total itself, so it
  depends on that sentence beside it. The drafts in [D023](../decisions/D023-new-order-delivery.md) and D028 both use the verb "Reserve".
- The store's own heading and pay button are checkout wording, restyle only:
  [checkout.md](../site/checkout.md#step-by-step).
- The PostHog `cta` attribute values are not the visible label:
  [tracking-inventory.md §6](../site/tracking-inventory.md#6-posthog-in-the-browser).

## Message testing

Source: docx §11 L383; §12 L413–418.

Site: **INTERNAL** (90-day plan: shapes strategy, never on the site;
[D013](../decisions/D013-internal-vs-external-content.md)). The lines under test are marked in
[taglines and hero](#taglines-and-hero); a pilot figure such as "children answered X questions a session"
is #27. An ad is published copy, so SKM's outcome line ("Kheelu helps your child's brain grow") is
BANNED in a Meta test too ([D016](../decisions/D016-brain-wording.md)): the outcome arm needs the conversation form.

- Week 1: ten 15-minute parent calls; read the mechanism, outcome and contrast lines aloud; ask which they
  would forward to their partner and what they would doubt.
- Weeks 2–3: Meta test of the same three lines, equal budget. The docx judges on cost per WhatsApp lead and
  chat-to-paid rate (§11 L383) and elsewhere on lowest cost per fully paid sale (§12 L415).
- Weeks 2–4: pilot counts of questions Kheelu asked and answers children gave, to turn "It asks. They think."
  into "In our pilot, children answered X questions a session."
- Track how often "Will AI make my child lazy?" comes up on WhatsApp.
