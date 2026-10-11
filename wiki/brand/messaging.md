---
title: Messaging hierarchy (from SKM's positioning)
type: brand
updated: 2026-10-10
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
---

# Messaging

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Citation key (`docx §N L<n>`, `pdf p.N`, `Fig N`): see [positioning.md](positioning.md#the-two-source-documents).
DS citations (`01-writing.md`, `bundle.js`, component READMEs) are files in `design-system/project/` as delivered.
Product facts live in [../product/facts.md](../product/facts.md); claim rulings in
[../product/claims.md](../product/claims.md); prices in [../product/pricing.md](../product/pricing.md).

## The hierarchy

| Level | Message | Cite |
|---|---|---|
| **Core message** | "One idea everywhere: Kheelu helps your child's brain grow, because it makes them think." | docx §9 L253; pdf p.10 ("One idea, said the same way everywhere") |
| **The promise** | Brain development | docx §1 L11 |
| **The proof of how** | Conversation: Kheelu asks, your child thinks | docx §1 L4, L11 |
| **The foundation** | Screen-free and safe (must be true everywhere, but do not set Kheelu apart) | docx §1 L11; §8 L228 |
| **The model parents repeat** | Four thinking skills: Words, Reasons, Stories, Questions | docx §1 L12; [positioning.md](positioning.md#the-four-thinking-skills) |
| **Pillars** | Makes them think · Builds four thinking skills · You see the growth · Foundation: a toy, not a friend | docx §8; [positioning.md](positioning.md#pillars-and-foundation) |

## Taglines and hero

**Taglines, in SKM's order** (docx §9 L254–269; pdf p.10):

| Line | Use | SKM's note | Before it can go live |
|---|---|---|---|
| **It asks. They think.** | Master line: ads, packaging, end cards | "Four words. Says the mechanism and answers the AI fear in one go. Check the trademark." | Trademark check (docx §12 L412); depends on product rule "ends most turns with a question" (L407) |
| **Helps your child's brain grow, one conversation at a time.** | Website hero, descriptor | "The core promise, with the how attached" | Advisor sign-off on "helps" (L274, L409) |
| **Other AI gives answers. Kheelu asks questions.** | Ads, comparison table, press | "Strong contrast; use as a second line" | Same product rule as the master line |
| **Puzzles build hands. Conversation builds thinking.** | Gifting, Amazon listing | "Stands Kheelu apart on the brain-development shelf" | – |
| Give a gift that grows young minds. | Gift buyers, corporate gifting | Supporting line on pdf p.10; gift message in docx §9 L291, §11 L397 | – |

**Website hero, exactly as SKM writes it** (docx §9 L270–274; pdf p.10):
- Headline (recommended): "Kheelu helps your child's brain grow, one conversation at a time."
- Sub-line: "A screen-free AI toy that asks your child questions, so they think, talk and wonder more."
- Short option: "The toy that makes your child think."

Three conditions sit on the hero:
1. **Advisor sign-off** on "helps" before launch (docx §9 L274); [open questions](../open-questions.md) F9.
2. **It may move after Gate 1 (1 November):** the winner of the three-line Meta test "leads from Gate 1"
   (docx §11 L383). If parents hear "brain development" as hype, lead with "It asks. They think." (§12 L418);
   if "Will AI make my child lazy?" comes up often, move the contrast line into the hero (§12 L417).
3. **It differs from an earlier founder ruling.** On 2026-10-04 the founder set brain claims as
   "research-anchored: conversation helps a young brain grow, Kheelu gives a child more of it, never 'Kheelu
   grows the brain'" (`mid:CLAUDE.md:21-22`; the mid hero lead: `mid:src/features/home/components/Hero.tsx:29-30`).
   SKM's line makes Kheelu the subject of "helps your child's brain grow". Ruling: [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors);
   open as [open questions](../open-questions.md) F9.

SKM describes "the current website line" as "Kheelu is an AI toy built to help your child's brain grow"
(docx §9 L274). **That line is not on the live site.** Live, 2026-10-10: title "Kheelu: the screen-free AI
toy with a tutor inside, ages 3+ · Kheelona"; H1 "A best friend at 3. A head start for school." The nearest
wording is on the unreleased mid version ("An AI toy built for the conversations that help a young brain
grow.", `mid:src/app/(site)/products/kheelu/page.tsx:138`), so SKM may have
reviewed that preview rather than production.

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

## Messages by audience

Source: docx §9 L277–298.

Who these people are: [audience.md](audience.md).

| Audience | Lead message | Proof to show | Proof exists? |
|---|---|---|---|
| Mothers (main buyer) | "Twenty minutes that are good for their brain." | Pilot video of a child explaining "because…" to Kheelu | Partly. Seven consented films of real children and parents are live (`src/lib/video-moments.ts:101-204`), for example "Kheelu asks her to explain carrom" (`:194`); none has been checked for a "because…" answer. Using them on the new site: [open questions](../open-questions.md) G3. DS cast photos are fictional and never stand in (DS `03-cast.md` L5) |
| Fathers | "See how your child's thinking grows, week by week." | The weekly report screenshot | No (report unconfirmed, #20) |
| Grandparents | "Kheelu asks questions in our language, so your grandchild thinks in it too." | 20-second clip in Kannada, Tamil or Hindi | Languages yes (`src/config/site.ts:145-154`); no such clip identified (the live films' labels name no Indian language). The line itself needs the advisor (#33, F9) |
| Gift buyers and corporate HR | "Give a gift that grows young minds." | Unboxing, advisor's name, 15-day returns | Advisor no (F9); 15-day returns no (#22, F1) |
| Preschools | "More thinking out loud for every child, with no screen in class." | Thinking Hour results | No |
| Investors and press | "Kheelona builds conversation-first brain-development products for the foundational years, starting with Kheelu." | Pilot numbers; Kheelona OS belongs here | Not a website audience |

## Against the alternatives

Source: docx §7 L197–225.

"What parents compare Kheelu with. These are the real alternatives for the same money and the same minutes."

| What parents do today | What they get | Where it falls short | What Kheelu says |
|---|---|---|---|
| Puzzles, activity books, STEM kits | Cheap, hands-on, "brain development" on the box | Can't talk, ask or explain; no progress to see | "Puzzles build hands. Conversation builds thinking." |
| Enrichment classes (phonics, abacus, early learning) | Structure, a teacher | Fixed time, travel, pressure, recurring fees | "Every day at home, at your child's pace." |
| Learning apps and videos | Feels educational | A screen; the child taps and watches | "Thinking out loud, not tapping on a screen." |
| Smart speakers and AI chatbots | Instant answers | Answers do the thinking for the child | "Other AI gives answers. Kheelu asks questions." |
| AI companion toys | A talking toy, games | Sold as a friend; parents worry about attachment and data | "A toy, not a friend. Built for your child's thinking." |
| Parent and grandparent conversation | The best thing there is | Not available every minute | "Never a replacement for you. Kheelu sends the conversation back to you." |

In public copy, name no brands: the docx's own row label "(Miko, MyWonder, Pookie)" is internal (docx §10
L372–374).

## Proof points

Checked against **production** code (tag `archive/pre-reset-2026-10-10` = `77552ff`) on 2026-10-10.
**VERIFIED-ON-SITE** = the site already states it, with the file and line. **NEEDS-SOURCE** = no published or
written source this agent could find. Notes say where the unreleased mid version or a founder ruling adds
something.

| # | Proof point, as the docs state it | Docs | Status | Evidence or note |
|---|---|---|---|---|
| 1 | Screen-free | docx §1 L7; Fig 3 | VERIFIED-ON-SITE | `src/lib/product-facts.ts:67` |
| 2 | A soft rabbit | docx §1 L7; §9 L276 | VERIFIED-ON-SITE | `src/lib/kheelu-art.ts:27` ("the cream talking plush rabbit") |
| 3 | English and the family's own language | docx §1 L7; §8 L241 | VERIFIED-ON-SITE | 8 languages named, up to 10: `src/config/site.ts:145–157`; `src/lib/product-facts.ts:68–71` |
| 4 | It only listens after its wake word | docx §9 L307; Fig 3 | VERIFIED-ON-SITE as a fact; **wording retired** | The live spec-table wording and SKM's "only listens after" both fall under the retired microphone wording. Ruling, the sanctioned replacement and every live location: [claims.md §4](../product/claims.md#41-the-retired-microphone-wording); [open questions](../open-questions.md) G5 |
| 5 | It can't browse the internet | docx §9 L307; Fig 3 | VERIFIED-ON-SITE | `product-facts.ts:74` |
| 6 | You can read every conversation | docx §9 L307; Fig 3 | VERIFIED-ON-SITE | `product-facts.ts:79` |
| 7 | It always says it's a toy, never asks for a secret | docx §9 L307; Fig 3 | NEEDS-SOURCE on the live site | Not in production code. Founder-confirmed 2026-10-04 on the mid version (`mid:CLAUDE.md:19-20`; `mid:src/lib/safety.ts:35-36`); see [claims.md §1](../product/claims.md#1-confirmed-by-the-founder) |
| 8 | Stories work offline | Fig 3; docx §8 L250 | VERIFIED-ON-SITE | `product-facts.ts:75–78` (Story mode offline; AI mode needs home Wi-Fi) |
| 9 | We never sell your child's data | docx §9 L311 | VERIFIED-ON-SITE | `product-facts.ts:80` |
| 10 | Delete any time | docx §9 L311 | VERIFIED-ON-SITE | `product-facts.ts:79` ("deletable in one tap") |
| 11 | Recordings kept for X days | docx §9 L311 (bracketed) | NEEDS-SOURCE | Not published anywhere found; [open questions](../open-questions.md) F5 |
| 12 | Voice is / is not used to train AI | docx §9 L311; §12 L411 | NEEDS-SOURCE | Not published. (`src/lib/seo.ts:70` says Kheelona trains its own small language model; it says nothing about children's voice data); F5 |
| 13 | Where the audio goes; "servers in India" only if true for the AI processing too | docx §10 L366–368; §12 L411 | NEEDS-SOURCE on the live site | Live and mid wording, and the founder's 2026-10-04 confirmation: [claims.md §7](../product/claims.md#7-childrens-data-what-is-published-versus-documented). SKM's outside-AI-provider test is not answered in writing: [open questions](../open-questions.md) F5 |
| 14 | Kheelu answers, then asks a question back | docx §1 L7; §8 L237 | VERIFIED-ON-SITE | `src/components/organisms/KheeluModes.tsx:35, 41`; `src/lib/growth-arc.ts:32`; `src/app/(site)/page.tsx:77` |
| 15 | Kheelu ends **most** turns with a question | docx §10 L376; §12 L407 | NEEDS-SOURCE | Product confirmation pending; the master line depends on it. [open questions](../open-questions.md) F8 |
| 16 | Kheelu hands the conversation back to family ("Tell Amma what we found out") | docx §9 L309; §10 L377; Fig 1 | NEEDS-SOURCE | Not on the site; F8 |
| 17 | Remembers what your child has learnt, so tomorrow builds on today | docx §2 L55; §9 L313 | VERIFIED-ON-SITE | `growth-arc.ts:37` ("remembers where your child stopped yesterday") |
| 18 | Grows with your child | docx §1 L7 | VERIFIED-ON-SITE | `growth-arc.ts:47` |
| 19 | Builds four thinking skills, at your child's level | docx §8 L241 | NEEDS-SOURCE | New model; needs the advisor-signed activity list, **ages 3 to 7 [3–7]**: [open questions](../open-questions.md) F9 |
| 20 | A weekly report on the four skills, compared only with your child's own past | docx §8 L245 | NEEDS-SOURCE | Live lists "Progress reports" as a parent-app feature on `/playos` (`src/app/(site)/playos/page.tsx:63, 68`), with nothing weekly or skill-based. The mid version said "The parent app counts the new words for you" (`mid:src/lib/faq.ts:85`), source not recorded. F8 |
| 21 | "You'll see in the report if they're still using it" | docx §9 L313 | NEEDS-SOURCE | The mid version recorded that usage time in the app "is NOT a published feature" (`mid:src/lib/faq.ts:87-88`). F8 |
| 22 | 15-day returns | docx §9 L292, L313, L317 | NEEDS-SOURCE; **conflicts with the site** | Live `/refund`: post-dispatch returns terms "are not written yet" (`src/app/(site)/refund/page.tsx:65`). See [../product/policies.md](../product/policies.md); [open questions](../open-questions.md) F1 |
| 23 | [1-year] warranty | docx §9 L317 (bracketed) | NEEDS-SOURCE; **conflicts with the site** | "Terms land closer to launch." (`product-facts.ts:88`); F1 |
| 24 | "₹499 reserves it, refundable until we ship" | docx §9 L319 | VERIFIED-ON-SITE, token mode only | `src/config/site.ts:69, 110–111`; `product-facts.ts:82`. After the first 500 units there is no token (`site.ts:65–66`) |
| 25 | ₹4,999 | docx §1 L4 | VERIFIED-ON-SITE, first 500 units | `site.ts:64, 86`; then ₹7,999 (`site.ts:67`) |
| 26 | A named child-development advisor | docx §11 L386–387; §12 L409 | NEEDS-SOURCE | None on the site; [open questions](../open-questions.md) F9 |
| 27 | Pilot counts, pilot videos, Thinking Hour results | docx §8 L239; §9 L283, L295 | NEEDS-SOURCE (counts, results) | No pilot counts or Thinking Hour results in any source reached. Videos: seven consented films are live (see [Messages by audience](#messages-by-audience)) |
| 28 | Research: serve and return (Harvard) | docx §4 L99–102 | VERIFIED-ON-SITE (cited) | `src/app/(site)/page.tsx:277–278`; `src/lib/stories-expansion.ts:215` |
| 29 | Research: Romeo 2018 (ages 4–6) | docx §4 L103–106 | VERIFIED-ON-SITE (journal) | `stories-expansion.ts:28, 40` ("36 children aged four to six") |
| 30 | Research: Xu 2022 | docx §4 L107–110 | NEEDS-SOURCE on the site | Cited by the docx (Joan Ganz Cooney Center, Oct 2024); not on the site |
| 31 | NEP 2020: over 85% of brain development by age 6 | docx §3 L67; §10 L330 | NEEDS-SOURCE on the site | The docx cites EducationWorld and requires "(with source)" in use. The site cites NEP 2020 only on mother tongue (`stories-expansion.ts:214`) |
| 32 | BIS date; outside safety test | docx §8 L251 | NEEDS-SOURCE | "In progress… no badge is claimed before it is earned" (`product-facts.ts:89–92`); [open questions](../open-questions.md) F4 |
| 33 | "Your grandchild thinks in it too" | docx §9 L288 | Languages VERIFIED; the implied language-development claim NEEDS-SOURCE | DS lists "mother-tongue education (as a claim)" as a phrase to avoid (`01-writing.md` L38); F9 |

## Not usable in copy until Q4

These figures and findings rest on three SKM documents that are not in the project: the **research brief
(30 May 2026)**, the **competitor review v9 (30 Sep 2026)** and the **90-day plan (7 Oct 2026)** (docx §13
L420). **NOT USABLE IN COPY**, attributed or not, until [open questions](../open-questions.md) Q4 delivers the documents and the
figure can be checked against them. Other brand pages mark them and link here.

| Figure or finding | Rests on | Docx |
|---|---|---|
| "70% of parents want an AI toy to help their child learn", "the top reason to buy" | Research brief | §2 L29; §3 L68 |
| 19% want a companion; 56% reject companionship | Research brief | §2 L29 |
| "Indian parents fear the screen more than AI" | Research brief | §2 L31 |
| The research's earlier positions (core age 6 to 8, exclude under 4; tutor framing; "demonstrably safe, screen-free, learning-first"; position against Miko on price) | Research brief ("Research says") | §2 L34–47 |
| "No screen does not separate Kheelu" | Competitor review v9 | §2 L46 |
| Pookie (Scoobies) at **₹6,999**, "a friend-like companion that understands moods" | Competitor review ("Scoobies Pookie page (from the competitor review)", §13 L436) | §2 L49; §3 L81–83 |
| Gate 1 on 1 November and the plan's channels (WhatsApp-assisted selling, Bengaluru demos, Story Hours) | 90-day plan | §11 L379 |

Not from these three, but also not in the project: "the deck" behind "10 new words learnt" (docx §8 L246;
§12 L408) and "maps your emotions and triggers" (§2 L50–54). Unsourced in the docx itself: the ₹1,599 "ChatGPT robots"
price (§5 L131) and the buyer age 28 to 40 (§6 L165).

## Objection answers

Source: docx §9 L299–319.

SKM: "Items in [brackets] need product confirmation." The objections themselves are on
[audience.md](audience.md#objections).

| Objection | SKM's answer | Blocked by |
|---|---|---|
| "Won't AI make my child think less?" | "That's exactly what we designed against. Most AI gives answers. Kheelu answers, then asks your child a question back, so they do the thinking." | – (asking back is on the site, #14) |
| "Does it really help the brain?" | "Research shows back-and-forth conversation helps young children's language and thinking, and that children understood stories better when an AI asked them questions. Kheelu is built around that. Our pilot results will be published, good or bad." | Publishing pilot results is a commitment the founder has not made in any source reached: [open questions](../open-questions.md) F10 |
| "Is it safe?" | "It only listens after its wake word, it can't browse the internet, you can read every conversation, and it always says it's a toy, never asks for a secret." | Wake-word wording (#4); "says it's a toy" not yet on the live site (#7) |
| "Will my child get attached?" | "Kheelu is a toy, not a friend. It ends chats by sending your child back to you, like 'Tell Amma what we found out about elephants.'" | Hand-back unconfirmed (#16) |
| "What happens to my child's voice and data?" | "We never sell your child's data. [Recordings kept for X days; delete any time. Voice is / is not used to train AI.]" | #11, #12, #13 (F5) |
| "Will my child use it after a week?" | "Kheelu remembers what your child has learnt, so each day builds on the last. You'll see in the report if they're still using it. If it isn't loved, 15-day returns." | #21 (F8), #22 (F1) |
| "Does it speak our language?" | "Tell me your language and I'll send a 20-second clip now." | WhatsApp sales script, not site copy; clips needed |
| "Will it break?" | "[1-year] warranty and 15-day returns." | #22, #23 (F1) |
| "Why ₹4,999?" | "It's there every day, it talks with your child in your language, and you see the progress. ₹499 reserves it, refundable until we ship." | "See the progress" (#20); ₹499 is token mode only (#24) |

## Claims guardrails

"A brain promise is only as strong as its weakest claim… Share these two tables with the designer, interns,
creators and founders." (docx §10 L321). Every brain claim is "worded so it can be backed up ('built to
support', not 'boosts'), signed off by the child-development advisor, and never uses fear" (docx §1 L14).

**What we can and cannot say about the brain** (docx §10 L323–346; pdf p.11)

| Topic | Say this | Never say this |
|---|---|---|
| The core promise | "Built to support your child's brain development through conversation" / "Helps your child's brain grow" (after advisor sign-off) | "Boosts IQ", "makes your child smarter", "develops the brain 2x faster", "genius" |
| The early years | "NEP 2020 notes that over 85% of brain development happens by age 6" (with source) | "Don't miss the window", "your child will fall behind" (fear; ASCI) |
| Conversation research | "Harvard research shows back-and-forth conversation helps build young children's brains. Kheelu is built around the same idea." | "Harvard-proven", "scientifically proven toy" |
| AI research | "Studies found children understood stories better when an AI asked them questions" (Xu, 2022) | "As good as a parent" |
| Results | Pilot numbers with the sample shown ("In our pilot of X children over Y weeks…") | Any percentage or improvement without our own data |
| Health | Nothing | Speech delay, late talkers, ADHD, autism, therapy |
| Memory and emotions | "Remembers what your child has learnt and loves" | "Maps emotions and triggers", "remembers life events and values", "long-term memory" |

**Added for 3 to 7 [3–7]** (this agent, from the brief §3 L58 and docx §2 L40, §4 L103): never present study
ages as covering 3-year-olds (Romeo 2018 studied 4 to 6); never use "toddler" or any wording that suggests
under 3; any "safe for" statement must match the toy-safety certification's age grade
([../product/age-band-review.md](../product/age-band-review.md); [open questions](../open-questions.md) G5).

## Words to stop using

Source: docx §10 L347–374.

| Stop saying | Say instead | Why (SKM) | Still live on kheelona.com (2026-10-10) |
|---|---|---|---|
| "AI toy" as the headline noun | "Brain-development toy"; "AI" in the sub-line | Keeps Kheelu out of the crowded AI-toy pile | Homepage title "Kheelu: the screen-free AI toy with a tutor inside" |
| Companion, friend, best friend | "A toy that talks with your child" | The framing safety groups and new laws target | H1 "A best friend at 3."; WhatsApp share text "A screen-free talking friend that teaches" (`src/config/site.ts:164`). The DS calls Kheelu a friend: [open questions](../open-questions.md) G5 |
| Tutor, teacher, syllabus, lessons | "Thinking skills", "learning through conversation" | Pulls us into edtech and adds pressure | Title "with a tutor inside"; "Story mode for stories and lessons" (`product-facts.ts:72`); Kheelona+ line "the stories, lessons, languages" (`site.ts:132`) |
| "Adapts to each kid" | "Asks back", "builds on what your child learnt yesterday" | Every rival says "adapts" | Not checked |
| "Safe" alone; "banking-grade" | The four specific safety behaviours | Specifics are believed; adjectives aren't | – |
| "Servers in India" | Only if true for the AI processing too | If audio goes to an outside AI provider abroad, the claim is false | See #13 above (F5) |
| Kheelona OS, wearables, robots | Just Kheelu | One product, one promise | `/playos` page and nav tab (`site.ts:31`); [open questions](../open-questions.md) G8 |
| Competitor brand names (including Alexa) | "Smart speaker", "robot toy with a screen" | Legal risk | None in live copy |

Also out (docx §2 L30; §11 L395): "AI best friend" content of any kind; "brain-boost" claims.

## CTA labels

**This section is the only owner of the CTA-label candidates.** The choice is made at Gate A:
[open questions](../open-questions.md) G1. The brief wants one primary label, the same everywhere (brief §9.1),
and "CTA labels exactly as the strategy defines them" (brief §6, Copywriter). **The positioning defines no
button label**: its only purchase wording is prose inside an objection answer, "₹499 reserves it, refundable
until we ship." (docx §9 L319).

| # | Label | Source | Used for | Status |
|---|---|---|---|---|
| 1 | "Pre-order Lumi" | **Founder decision #9, 2026-08-23**: "CTA label stays 'Pre-order Lumi' (no number on the button; price in the caption)" (`docs/checkpoints/migration-to-new-dsx.md:52`) | Every CTA | Founder decision; the product was renamed Kheelu on 2026-09-05, which gives #2 |
| 2 | **"Pre-order Kheelu"** | `PREORDER_LABEL` (`src/config/site.ts:90-94`: "founder-chosen 2026-08-22. No number on the button"); the price sits in `PRICE_CAPTION` (`:97`) | Every pre-order CTA | **Live** |
| 3 | "Reserve Kheelu for ₹499"; short form "Reserve ₹499" | `mid:src/config/site.ts:107, 109` (CMO merge, 2026-10-04; chosen to match the store's own "Reserve" wording, `:96-99`) | Long form everywhere; short form in the nav and sticky bar | **Never live.** Puts a number on the button, against #1. Token mode only, by its own comment (`mid:src/config/site.ts:102-106`) |
| 4 | "Pre-order Kheelu" | DS: "Any selling surface" (`01-writing.md:53`); "One cta per view" (`07-selling.md:51`) | Main action | DS default; same as #2 |
| 5 | "Pre-order for ₹499" | DS: "Showing the deposit" (`01-writing.md:54`); `OfferCard` default `cta` (`bundle.js:292`; its README names no default) | Offer card | DS default; token mode only |
| 6 | "Pre-order" | DS: "Sticky bar, small spaces" (`01-writing.md:55`); `StickyBuyBar` default `cta` (`bundle.js:312`; `StickyBuyBar/README.md:3`) | Sticky bar | DS default. The bar's default note beside it is "Reserve for ₹499 today" (`bundle.js:311`; README `:7`) |
| 7 | "Pre-order at kheelona.com" | DS: "Social and WhatsApp" (`01-writing.md:56`) | Off-site | DS; not a site label |
| – | "Reserve for ₹499" | DS: barrier-price example, "Lead with the barrier price where it helps" (`07-selling.md:42`) | Guidance, not a set label | Disagrees with #5 |

- The DS prescribing three labels against "same label everywhere" is DS gap
  [G-07](../design-system/gaps.md#g-07); component facts are on [component-map.md](../design-system/component-map.md).
- Any label carrying "₹499" (#3, #5, the sticky note) is false once the first 500 units are sold, because
  full-price orders take no token (`src/config/site.ts:65-66`).
- The store's own heading and pay button are checkout wording, restyle only:
  [checkout.md](../site/checkout.md#step-by-step).
- The PostHog `cta` attribute values are not the visible label:
  [tracking-inventory.md §6](../site/tracking-inventory.md#6-posthog-in-the-browser).

## Message testing

Source: docx §11 L383; §12 L413–418.

- Week 1: ten 15-minute parent calls; read the mechanism, outcome and contrast lines aloud; ask which they
  would forward to their partner and what they would doubt.
- Weeks 2–3: Meta test of the same three lines, equal budget. The docx judges on cost per WhatsApp lead and
  chat-to-paid rate (§11 L383) and elsewhere on lowest cost per fully paid sale (§12 L415).
- Weeks 2–4: pilot counts of questions Kheelu asked and answers children gave, to turn "It asks. They think."
  into "In our pilot, children answered X questions a session."
- Track how often "Will AI make my child lazy?" comes up on WhatsApp.
