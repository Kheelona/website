---
title: "CMO review: Home copy before the mockup (Phase 3, step 1), 2026-10-11"
type: qa
updated: 2026-10-11
sources:
  - ../site/pages/home.md (Copywriter draft, 2026-10-11; line numbers below refer to it)
  - ../site/strategy.md (§1, §2, §3, §5 Home row, §7)
  - ../brand/positioning.md, ../brand/messaging.md, ../brand/voice.md, ../brand/audience.md
  - ../product/claims.md (§1-§5, §8), ../product/facts.md, ../product/pricing.md, ../product/policies.md
  - ../site/content-boundary.md
  - ../research/keyword-map.md (§4.1, §5.1, §5.2, §6.1, §7.1), ../research/source-verification.md (C07 caveats and ready lines)
  - ../decisions/D016-brain-wording.md to ../decisions/D039-repo-and-setup-answers.md
  - design-system/project/01-writing.md (mechanics, CTAs, Kheelu's voice) and 10-pages.md (phone hero order), read-only
  - raw/brief/kickoff-brief.md (§4, §6 CMO Reviewer, §7 Phase 3, §9.1-9.3, §9.8, §9.10)
  - "Word, character and density counts: python3 over the Copy blocks of home.md, 2026-10-11 (scratchpad script, not kept)"
---

# CMO review: Home copy, before the mockup

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)). This review reads the copy
> as SKM would, against the positioning. It is input only: the founder alone signs off copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)), and where a page and a decision disagree, the
> decision wins.

## Verdict

**Ready after fixes.** Two one-line copy fixes (F1, F2), both claims-and-trust issues, neither changing
length or layout, so the CTO can start `mockup/` now and drop the fixed lines in. The page says what the
positioning says, in the right order, to parents of 3 to 7 year olds: mechanism first, the promise only in
D016's conversation form, safety as checkable facts in D020's order, the offer beside every button. No
internal material leaks. **H1 pick: A, "Your child asks why. Kheelu asks back."**

**Not run (nothing exists yet):** visual inspection at 360, 390, 412, 1366 and 1440 px, comparison with the
mockup and the DS, motion, Lighthouse and speed. So no screenshots are saved under
`raw/qa/2026-10-11/cmo/`. These checks run on the mockup (Phase 3, step 3) and the build (Phase 7).

## Pass/fail

| # | Criterion | Verdict | Evidence (home.md line) | Fix |
|---|---|---|---|---|
| 1 | Message fidelity: mechanism first, promise only in D016's form, to parents of 3-7 | **PASS** | H1 145, sub-line 147, fold 3 H2 299, age chip 143, FAQ 557-558 | – |
| 2 | Five-second offer test on a phone (hero alone) | **PASS**, conditional on the 360 × 590 fit check | 143-153 | S2, OQ2 option (d) if the fit is tight |
| 3 | One next step per fold; "Pre-order Kheelu" everywhere; price sentence beside every CTA; machine-read lines lead with ₹4,999 | **PASS**, with two Gate A items | CTAs 116, 126-128, 149, 275, 464, 626; price 76, 151, 627; metas 48-49; FAQ 561 | Sticky-bar order (OQ10); drawer note S4 |
| 4 | Claims trace to confirmed sources; nothing banned; no internal leakage | **FAIL** (one line) | Fold 3 company card 303 | **F1** |
| 5 | Safety block in D020's order, full providers line; no voice-stays-on-toy or no-training implication | **FAIL** (one heading) | Fold 6 item 2 heading 450 | **F2**; also OQ4 view |
| 6 | Tone and voice: specific, calm, mechanism before outcome, no fear, plain en-IN, short phone lines, one idea per fold | **PASS**, polish listed | 147, 223, 353, 361, 448, 567, 570 | S1, S2, S5-S9 |
| 7 | Fold-7 comparison: fair, no brand, each cell defensible | **PASS** | 507-520 | Optional S11 |
| 8 | Answer-first FAQ: 6 questions, 40-60 words, parents' real questions, consistent with today's decisions | **PASS** (52, 49, 58, 55, 54, 52 words; full-mode price 54) | 552-579 | Recommended swap S12 |
| 9 | Keywords: title ≤ 60, meta ≤ 155, primary "Kheelu by Kheelona", name density | **PASS** (title 54; metas 150 and 147; density about 2.0%) | 47-49, 147, 348, 699-719 | – (rule 3 met in spirit only; see note) |
| – | Internal leakage (survey figures, competitor names or prices, unit counts, analytics) | **PASS** | all Copy blocks | – |
| – | Ad-landing readiness, copy part (message match, contact, policies) | **PASS** | 145, 157-159, 93-95, 669-683 | – |
| – | Visual (5 widths), motion, Lighthouse, speed | **NOT RUN** | no mockup or build yet | – |

## Failures and fixes (→ Copywriter)

### F1 · Fold 3 company card implies Kheelu supplies the caring-adult exchange

- **Where:** home.md:303.
- **Now:** "Kheelu is built to give your child more of that back-and-forth: it answers, then asks a question back."
- **Why it fails:** "that back-and-forth" points back to the Harvard sentence directly above it (301), which is
  about exchanges "between a young child and a caring adult". Read together, the card says Kheelu gives your
  child more of that caring-adult exchange. The C07 caveats rule exactly this out: never call Kheelu's loop
  serve and return, and keep the adult ([source verification, C07](../research/source-verification.md));
  "Never imply Kheelu is the caring adult" ([messaging, claims guardrails](../brand/messaging.md#claims-guardrails)).
  This is the most scrutinised sentence on the page (brain, Harvard and a toy within two lines), so it has to
  read only one way.
- **Fix (the verified C07 company line, minus its "turns" clause):** "Kheelu is built around the same idea: it
  answers your child, then asks a question back." (16 words; own card, no marker, as now.) If the founder
  prefers D016's own words: "Kheelu is built to give your child more back-and-forth conversation: it answers,
  then asks a question back." Either way, drop the pointer "that".

### F2 · Fold 6 item 2 heading promises a complete answer the block cannot give under D035

- **Where:** home.md:450 (heading); body 451 is D020's providers line, verbatim and correctly scoped.
- **Now:** "2 · Where your child's voice goes"
- **Why it fails:** the heading promises the whole journey of the child's voice; the body covers only the outside
  providers' reply path. Under [D035](../decisions/D035-model-training-opt-out.md), voice recordings and
  transcripts also reach Kheelona, whose own model trains on them by default. A parent reading "Where your
  child's voice goes … They don't keep it, and they never use it to train their AI" will conclude that nobody
  keeps it or trains on it. D035 bans exactly that implication on customer pages ("never imply the opposite"),
  and records the misleading-by-omission risk (CPA s.2(28)). The body is right; the heading breaks its scope.
  Item 2 is also the only heading in the block without a full stop (DS `01-writing.md`: full stops in headlines).
- **Fix:** retitle to the reply path and leave the body verbatim: **"2 · How it understands and answers."**
  (it matches the body's opening, "To understand and answer your child"; "it" rather than "Kheelu" keeps the
  name density at the limit). Add nothing about training: D035 keeps that to `/terms` and `/privacy`. The
  separate question of the training clause itself is OQ4 below (a founder call).

## Should-fix (→ Copywriter), not blocking the mockup

| # | Where | Now | Change | Why |
|---|---|---|---|---|
| S1 | Fold 6 item 1 body, 448 | Ends "…A light on Kheelu shows whenever it's listening." | Add D018's off-state sentence at the end: "Left alone, it hears nothing and sends nothing." | The fold's job is "is it always listening?" and the copy implies the answer without saying it. The line is a founder draft ([D018](../decisions/D018-wake-up-button.md)), about the off state only, so it stays within D018's rules. Its removal is not noted on the page (only the wake-word sentence is) |
| S2 | Hero sub-line, 147 | One 22-word sentence | "Kheelu by Kheelona is a screen-free plush toy. It answers your child, then asks a question back, so they do the thinking." (21 words) | Two short sentences scan faster on a phone; the descriptor lands first; primary term stays at the start; same claims |
| S3 | Price sentence, 52/76/151/627 | Option (a), 21 words | Put option (d) beside (a) at Gate A (see OQ2) | Three amounts in 21 words is the heaviest line in the first screen |
| S4 | Drawer note, 128 | "Deliveries start mid-November · 7-day returns, no questions asked" | Add the price sentence above that line | Brief §9.1 and strategy §3.2 put the price beside every CTA; the drawer has room. The laptop nav CTA stays exempt as a header pattern (G2) |
| S5 | Fold 4 language heading, 361-362 | "Eight languages, up to 10 at launch" plus an "Up to 10 at launch" chip | Heading "Up to 10 languages at launch" (the DS's own wording, `01-writing.md`), the 8 named chips, and drop the extra chip | DS numerals rule; "Eight … 10" mixes forms; the chip then repeats the heading |
| S6 | 147, 259, 303, 350, 353, 515, 555 | Five forms: "asks back", "asks them something back", "asks them a question back", "asks something back", "asks a question back" | Keep "asks back" in the H1 as the hook; use D017's "answers your child, then asks a question back" everywhere else. Cut the repeat from the AI mode card (353), which restates the answer block two lines above | Strategy: "one idea, said the same way everywhere"; entity consistency for answer engines |
| S7 | Fold 2 variant (a), 221-223 | H2 "See Kheelu ask, in real homes." then lede "Real children in real homes." | H2 "See Kheelu ask." and keep the lede | "Real homes" twice in two lines |
| S8 | FAQ 5, 567 | "Pre-orders are served first, in the order they were placed" | "Orders are sent in the order they were placed" | Every new order is a pre-order, so "first" has nothing to come before; the fact (order of dispatch, [facts, ship date](../product/facts.md#ship-date)) is unchanged |
| S9 | FAQ 6, 570 | "until 5 September 2026" | "until 5 Sep 2026" | DS mechanics: dates as "20 Oct 2026" |
| S10 | Fold 5, 405 and 409 | Two links in one fold ("see what's included" → `#close`, "See what the app shows you") | Make the Kheelona+ line plain text and specific: "The parent app is part of Kheelona+, included for 6 months with every Kheelu." Keep "See what the app shows you" as the fold's one link | One next step per fold; and it puts the 6-month condition beside "36 months" and "You see every conversation" until F7 is decided (Gate A item 1 below). Wording from [D027](../decisions/D027-story-mode-wording.md) |
| S11 | Fold 7 cell, 515 | Puzzles and activity books × "Asks your child a question back" = "No" | Optional: "Only printed ones" (starts with neither Yes nor No, like the other hedged cells) | "No" is defensible (a book cannot reply; SKM: they "can't talk, ask or explain"), but activity books are full of printed questions, and a parent who buys them may read "No" as unfair |
| S12 | FAQ 6, 569-570 | "Is Kheelu the same as Lumi?" | Recommended: replace with "Will my child still use it after the first week?" and move the Lumi answer to the product-page FAQ (8 questions), after Search & AI Visibility agrees (it is Home's BRD-2 secondary). Candidate answer to source-check (57 words): "Kheelu remembers earlier conversations, so it can pick up where your child stopped instead of starting over. Story mode adds stories, poems and jingles, with no Wi-Fi needed. You can read or delete any conversation in the parent app. And if it isn't right for your family, return it within 7 days of delivery, no questions asked." | Lumi is an entity question from search, not a parent objection; "Will my child use it after a week?" is one of SKM's listed objections (docx §9 L312; [audience](../brand/audience.md#objections)) and nothing on Home answers it. Sources: [D036](../decisions/D036-launch-feature-claims.md) #2 ("remembers" sits next to the parent's controls, as D036 asks), [claims §2](../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (picks up where they stopped), [D027](../decisions/D027-story-mode-wording.md), [D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D021](../decisions/D021-returns-policy.md). Never "grows with your child" |

## Notes per criterion

**1 · Message fidelity: PASS.** The order is the positioning's: the mechanism (hero, fold 2), why it
matters (fold 3, credited to conversation with its public source), what it is (fold 4), what the parent
sees (fold 5), checkable safety (fold 6), the alternatives by category (fold 7), objections (fold 8), the
offer (fold 9). The promise appears only as "Conversation helps a young brain grow." (299), D016's form,
never with Kheelu as its subject. The positioning's "who" is covered: screen-free (147, 350, 513), the
four thinking skills as what the report covers (401), home languages (361-363), and the parent at the
centre (the house line at 305, and fold 5). The age band is in the first screen and in FAQ 2 with "not a
toy for children under 3". Correctly absent: "brain-development toy", the hand-back (F8), "a toy, not a
friend" (G5), memory claims beyond what D036 confirms.

**2 · Five-second test: PASS, conditional.** From the hero alone a parent can tell who it is for (the
chip), what it is (the sub-line: "a screen-free plush toy"), what it costs (₹499 today, refundable;
₹4,999 in total incl. GST) and what happens next ("Pre-order Kheelu"; deliveries from mid-November; 7-day
returns). Two risks:
- The H1 does not say what Kheelu is, and on phones the DS puts the board under the words
  (`10-pages.md`, Phones: "the words first, a full-width cta, the trust line, then the board under them"),
  so at 360 × 590 the first screen may show no Kheelu at all. The sub-line carries "what it is" alone.
- 64 words sit above the board (chip 4, H1 7, sub-line 22, CTA 2, price 21, micro-line 8). If they push the
  micro-line out of 360 × 590, apply S2 and price option (d) before dropping the H1 to B; that also gives the
  CTO's mockup a chance to bring the top of the board into the first screen (a layout call for the CTO).

**H1 options, rated** (5 = best). "Clarity" is the five-second test on a cold phone landing; "strategy"
is mechanism first, the child doing the thinking, "Kheelu" in the H1, no "AI" headline noun, not "talks
back" (the product page's cluster).

| | H1 | Clarity | Strategy | Reading |
|---|---|---|---|---|
| **A** | Your child asks why. Kheelu asks back. | 4 | 5 | The "why" years every parent of a 3 to 7 year old lives with; the child goes first; two beats, the DS headline pattern. "Asks back" alone could suggest Kheelu dodges the question; the sub-line's "answers your child, then…" closes that at once |
| B | Your child asks. Kheelu asks back. | 3 | 4 | Loses "why", the recognition hook and an audience trigger. Fallback only |
| C | Kheelu answers. Then it asks back. | 3 | 4 | The most literal form of D017, no dodge reading, but it opens on an unknown name and leaves the child out |
| D | It asks. They think. | 1 | 3 | SKM's master line, usable with the trademark risk accepted (D038), but on a cold landing "it" and "they" have no referent and the H1 misses "Kheelu". Best where the product is already in the picture: ads, end cards, the OG image text |
| E | Kheelu asks back, so they think. | 3 | 4 | Mechanism plus payoff, but "they" has no antecedent |

**Pick: A.** If A does not fit at 360 px, shorten the sub-line and the price sentence first; go to B only
as a last resort.

**3 · Next step, label, price: PASS.** Every button reads "Pre-order Kheelu" (hero, fold 2, fold 6,
close, laptop nav, drawer, sticky bar). Every inline CTA carries the price sentence: ₹499 first,
"refundable" beside it, the ₹4,999 total (incl. GST) in the same sentence ([D028](../decisions/D028-price-wording.md)).
"Refundable" sits beside ₹499 everywhere it appears (76, 116, 561, 620). Machine-read text leads with
₹4,999 (incl. GST): both metas (48-49), the FAQ price answer that feeds FAQPage JSON-LD (561), and OG.
Every fold ends with a CTA or a link; no dead ends. The phone sticky bar is on screen through folds 3 to
5 and 7 to 8, so those folds keep a buy action without a second chilli button. Two Gate A items: the
sticky bar leads with ₹4,999 (OQ10, below), and the drawer note has no price (S4).

**4 · Claims and leakage: FAIL (F1 only).** Every other claim traces to an EXTERNAL row or a decision
and matches it: the mechanism (D017), modes, Wi-Fi and Bluetooth ([facts](../product/facts.md#modes-and-connectivity)),
Story mode (D027, verbatim apart from the Wi-Fi spelling), languages and switching mid-sentence (facts,
D017), the report, new-word count and age setting (D036), retention (D020, verbatim), button and light
(D018), providers (D019, D020), no sale and no advertising (D020, D038), no camera, says it's a toy, no
secrets (claims §1), returns, pickup and refund (D021, D022, D033), payment and GST (D024), delivery
(D023, with no date tied to the licence: D030, D037), the call line (D032), Kheelona+ (D027, verbatim),
made in India (D034). A scan of every Copy block found none of the banned words: no "adapts" family, no
bare "safe", friend or companion, lessons, wake word, tutor, emotion reading, "free for life" (only D027's
sanctioned "keep working for life, with no subscription needed"), advisor, pilot results, competitor
names, scarcity, COD, EMI or wallets, and no toddler or under-3 wording beyond the entity fact "not a toy
for children under 3". No internal leakage: no survey figures, competitor names or prices, unit counts
beyond the "first 500" offer term, analytics, or positioning-document language.

**Condition on fold 2 variant (a), the films:** films 3 and 7 are parents speaking to camera, which makes
them testimonials in effect. Whatever is said on camera is published copy ([D013](../decisions/D013-internal-vs-external-content.md);
brief §9.8; ASCI), so G3 needs, besides the consent record and the re-exported captions, a check that
nothing said goes beyond [claims](../product/claims.md): no "friend", no speech or vocabulary outcome, no
"tutor" or "teaches". The founder also confirms film 6's new caption against the film (Story mode has no
language-following or interrupt feature, D027), and may want the chip "Learning by asking" (film 1) read
against the legal review's L7 caution on learning outcomes.

**5 · Safety block: FAIL (F2 only).** The order is D020's (button and light, providers, read and delete,
no sale). The providers line is D020's in full and verbatim, its training clause scoped to "they", as
D035 directs. Nothing suggests the voice stays on the toy: the live "first thinking happens on the toy"
line is correctly left out (claims §2, the D019 flag). No absolutes ("no risk", "nothing is ever
recorded", disconnect claims). "Safe" never appears; "Safety" is a noun. BIS is deliberately absent from
Home (status-honest wording belongs on `/safety`, per strategy §5), which is right for the first page a
cold visitor sees. The heading of item 2 is the one fault (F2).

**6 · Tone and voice: PASS.** Specific, calm, mechanism before outcome, warm without friendship. No fear
anywhere: neither screen-time nor NEP figure is used on Home, which keeps the page within the DS no-fear
rule without needing D026's exception. Plain en-IN ("Center" is the proper name of the Harvard centre);
"Wi-Fi", "parent app", "Story mode", "AI mode", "Bluetooth mode" as the DS spells them; no exclamation
marks; full stops in headlines except F2's. One idea per fold holds; fold 4 pairs modes and languages
under one question ("will it work in our home?"), as the strategy sets. The illustrative exchange (253-263)
is good copy: Kheelu's sentences sit near the DS length for a 5-year-old, the science is right, the child
gets the last word, and the label is required and kept. Polish: S1, S2, S5-S9.

**7 · Comparison: PASS.** Categories only, no brand, price or research figure. The cells are fair, and
generous where it matters: smart speakers and chatbots get their tick for conversation, and "Varies" is
honest for both screen-free (speakers yes, chatbots mostly on screens) and reading conversations (some
keep a history). Hedged cells start with neither Yes nor No, so no category is crossed out on a row that
does not apply to it. AI companion toys, the closest category, are rightly absent: any cell about them
waits on G5. The H2 and the lead are messaging's two EXTERNAL lines. Optional S11.

**8 · FAQ: PASS.** Six questions, all 49-58 words, answer-first (FAQ 1 opens a little indirectly with
"That's exactly what Kheelu is designed against", SKM's own EXTERNAL answer; acceptable). Questions 1 to 5
are the audience's objections in decision order (think less, fit, price, risk, timing) and match today's
decisions: D028 price order, D024 methods and invoice, D021/D022/D033 returns, pickup and refund, D023
delivery with no licence-dependent date, D036 age setting. Question 6 (Lumi) is an entity question, not an
objection; S12 recommends swapping it for "Will my child still use it after the first week?", which no fold
answers.

**9 · Keywords: PASS.** Title "Kheelu by Kheelona: a screen-free plush toy that talks", 54 characters,
primary first (a brand page). Metas 150 (token) and 147 (full) characters, primary first, one concrete fact
(ages 3 to 7 and the mechanism), ₹4,999 (incl. GST) before the advance. H1 A carries "Kheelu"; the primary
opens the hero sub-line; "What is Kheelu?" is an H2 with a 60-word answer-first block; "3 to 7" is in the
first screen. "Kheelu" density measures about 2.0% of the main copy (28 of about 1,390 words, variant (b),
counting the two compact CTA blocks): at the keyword map's flag line, below its 3% rewrite line; F2's "it"
keeps it there. Keyword-map rule 3 (the primary inside an answer-first block in the first ~100 words) is met
in spirit only: the primary is in word 12, the answer-first block is fold 4. A question heading in the hero
would cost conversion, so this review recommends Search & AI Visibility accept the exception.

**Ad-landing readiness (copy part): PASS.** H1 A is the mechanism arm of SKM's planned Meta test, so a
mechanism ad lands on its own words. "Questions? WhatsApp or call +91 91875 46483" sits directly under the
first screen; returns, warranty, payment and delivery link to their policy pages from the trust row; the
footer carries the seller block and the grievance link. Dependency already flagged by the Copywriter: the
number must take calls before Gate B ([D032](../decisions/D032-grievance-block-and-call-line.md)).

## Views on the Copywriter's open questions (home.md:758-800)

- **OQ1, the H1:** A, as rated above. Keep "It asks. They think." for ads, end cards and the OG image text,
  which honours D038 without making a cold visitor guess.
- **OQ2, the price sentence:** (a) is better than (b) because "until dispatch" tells the parent when the
  refund applies; (c) breaks D028's own same-sentence rule and should not go forward. Add **(d)** for the
  founder: **"Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery:
  ₹4,999 in total (incl. GST)."** (18 words). It reads as a timeline (today, before delivery, total) and
  meets every D028 and [pricing](../product/pricing.md#price-wording-for-the-new-site-d028) condition: ₹499
  first, "refundable" beside it, the remainder before delivery, and the total with "incl. GST" in the same
  sentence. Preference: (d) beside every inline CTA; (a) is fine if the founder prefers it.
- **OQ3, films or the illustrative exchange:** (a), the films, because real children thinking out loud are
  the positioning's own creative rule (voice rule 16) and the films are the site's most-used interactive
  element ([strategy §2](../site/strategy.md#2-the-parents-journey-and-objections)). Lead
  with film 1 (Kheelu asks her to explain carrom: the child does the explaining). Conditions: the G3 consent
  record, the re-exported captions, the founder's check of film 6, and the claims check of films 3 and 7
  (criterion 4 note). Ship (b) if G3 does not clear in time; it is good copy as written.
- **OQ4, the training clause on Home:** the decisions allow (a). **CMO view: (b)**, dropping only "and they
  never use it to train their AI" on customer pages and keeping "They process your child's voice only to
  produce Kheelu's reply. They don't keep it. Our contracts with them say so." A parent will generalise the
  clause to "my child's voice is not used to train AI", which D035 makes false for Kheelona's own model; when
  they later read `/privacy`, the promise they felt on Home breaks, and trust is the category's ceiling
  (docx §2 L32). Everything left stays true, specific and checkable. F2 applies either way. The founder's
  call ([D015](../decisions/D015-founder-signs-off-copy.md)).
- **OQ7, the first-500 term:** (a). Once, in the price answer, as an offer term; never beside a CTA, never a
  badge, sticker, counter or "hurry" ([D034](../decisions/D034-origin-manufacturer-mrp.md) copy note;
  strategy §1). It is true, it tells the parent the price rises to ₹7,999, and it matches the entity fact
  ([keyword map §7.1](../research/keyword-map.md#71-entity-facts-each-with-one-source)). The count of units
  left stays INTERNAL ([content boundary](../site/content-boundary.md)).
- **Also:** OQ8 (no "wake word" on Home): agree with (a); the button line answers the question without
  introducing a concept. OQ9 ("learns from" in D027's line): keep, the founder's own words. OQ10 (sticky
  bar): (a) matches the DS pattern (price "₹4,999", note "Reserve for ₹499 today") and D028's purpose, but
  not its letter (₹499 first beside a CTA), so the founder must accept the deviation explicitly; if he does
  not, swap the props (price "₹499 today, refundable", note "₹4,999 total (incl. GST)"), which fits at 360
  as well. OQ5 (F7): see Gate A item 1.

## Gate A items this review raises (for the main session; not the Copywriter's to fix)

1. **Decide F7 at Gate A, not Gate B.** "You see every conversation" (fold 5 H2), the 36-month retention
   line, fold 6 item 3, fold 7's last row and the footer promise all assume the parent app stays available,
   while the app is part of Kheelona+, included for 6 months, with what follows undecided
   ([D038](../decisions/D038-trust-content-rulings.md), [facts](../product/facts.md#parent-app)). It is the
   positioning's "you see it" pillar; if it lapses at month 6 without a subscription, five lines become
   misleading. S10 puts the 6-month condition beside the claim in the meantime.
2. **OQ4, the training clause** (CMO view: drop it on customer pages).
3. **The sticky bar's price order** against D028's letter (OQ10).
4. **Films:** G3 plus the content check of films 3 and 7.

## Test ideas (after launch, not now)

- H1 A against C and D on the phone hero, aligned with SKM's three-line Meta test (mechanism, outcome in
  D016's form, contrast); judge on store taps per Home session.
- Price sentence (a) against (d).
- FAQ slot 6: Lumi against "Will my child still use it after the first week?" (FAQ opens per session, then
  store taps).

## Routing

All failures and should-fix items are copy, routed to the **Copywriter** (`site/pages/home.md`). The fit
check in criterion 2 is for the CTO's mockup. Gate A items go to the main session. No Builder, Architect or
QA items yet: visual, motion, speed and tracking checks start with the mockup.

## Mockup pass (visual)

*Added 2026-10-11, 06:40 PDT, by the CMO Reviewer. The copy review above is unchanged; this section
replaces only its "Not run" line for visual inspection and motion. Input for the founder, who alone signs
off ([D015](../decisions/D015-founder-signs-off-copy.md)).*

**What was reviewed.** `mockup/index.html` (md5 `62c6e13c…`, saved 06:14, with price sentence (d)),
`mockup.css`, `mockup.js`, against `design-system/project/10-pages.md`, the DS phone render
(`design-system/renders/home-page-phone.jpg`), [DS overview](../design-system/overview.md),
[motion](../design-system/motion.md), [strategy §3](../site/strategy.md#3-cta-strategy) and
[home copy](../site/pages/home.md). DS checksums: 643 files match (`node scripts/ds-checksums.mjs`,
06:36). The mockup changed during the first capture (price sentence (a) to (d)), so every image was
captured again on the current file.

**How.** Headless Chromium from the cached Playwright 1.58.2, `file://`, 1x, scrolled viewport chunks:
360 × 640 (22 chunks), the 360 × 590 first screen, 390 × 844 (16), 412 × 915 (14), 1366 × 768 (11),
1440 × 900 (10); stills with reduced motion; a 390 phone recording with motion allowed; a scroll scan
every 8 px at 360 × 590, 360 × 640, 390 × 844 and 412 × 915 counting the chilli buttons in view; a
layout probe (fold heights, tap targets, sideways overflow, link colours); a motion probe (what sits
inside a reveal, mid-transition frames); `?contrast=ink` at 360 and 1366. Scripts in the session
scratchpad, not kept. **Evidence:** `raw/qa/2026-10-11/cmo/` (99 files, local and uncommitted,
[D039](../decisions/D039-repo-and-setup-answers.md)); file names below are in that folder.

### Verdict (mockup)

**Ready after fixes.** Five must-fix items (V1-V5), all layout or motion in the mockup's own files, none
touching the copy, the DS or a decision. What already works: the phone first screen passes the
five-second test; no phone view ever shows two chilli buttons (0 of about 6,000 scanned positions);
the sticky bar reads in D028 order; bands alternate; one accent per headline; mechanism first in the
first 25% of the page; the G2 ink variant has no visual defect.

### Pass/fail (mockup)

| # | Criterion | Verdict | Screenshot | Fix |
|---|---|---|---|---|
| 1 | Five-second offer test, 360 × 590: what, who, price, next step | **PASS** | `phone-360x590-00.png` | Optional M14 (no Kheelu in the first screen) |
| 2 | One next step per screen; never two chilli buttons on a phone; sticky bar in D028 order | **PASS**, two should-fix | `phone-360-01.png`, `phone-360-03.png`, `phone-360-13.png`, `phone-360-offer-no-cta-in-view.png`, `phone-360-drawer-open.png` | M1, M2 |
| 3 | Visual fidelity to the DS: bands, accents, board, spacing, tap targets, no sideways scroll, laptop as enhancement | **FAIL** | `phone-360-compare-kheelu-column-off-screen.png`, `phone-360-hero-board.png`, `laptop-1366-fold5-heading-touches-cards.png`, `laptop-1366-00.png` | **V1, V2, V5**; M3, M4, M9-M11 |
| 4 | Message: mechanism first, what the eye lands on per fold, fold length | **FAIL** on fold 7 for phones only; tighten folds 4, 6 and the close | `phone-360-14.png`, `phone-360-05.png` to `-08.png`, `phone-360-17.png` | **V1**; M5, M6, M13 |
| 5 | Motion: below the fold only; nothing on hero, price or CTA; bar and drawer; reduced motion | **FAIL** | `motion-360-offer-reveal-030ms.png`, `motion-360-fold2-reveal-060ms.png`, `motion-phone-390-frames-1fps.png`, `motion-phone-390.webm` | **V3**; M12 |
| 6 | Ad-landing readiness: message match, contact, policies | **FAIL** (policies) | `phone-360-00.png`, `phone-360-18.png`, `phone-390-00.png` | **V4**; M3, M9 |
| 7 | G2 ink variant (`?contrast=ink`) | **PASS**, one note | `g2-ink-phone-360-first.png`, `g2-ink-phone-360-modes.png`, `g2-ink-phone-360-offer.png`, `g2-ink-laptop-1366-first.png` | – |
| – | Internal leakage (page text, title, meta) | **PASS** | text scan of `index.html` | – |
| – | Lighthouse and speed | **NOT RUN** (a `file://` mockup is not representative; Phase 7 on the build) | – | Speed note below |

### Must-fix before Gate A

**V1 · The phone comparison never shows Kheelu** (→ Builder, here the CTO)
- **Where:** fold 7, `.kh-compare-wrap` (`index.html` 257-268); DS `bundle.css:336-337` (`min-width: 640px`), gap [G-05](../design-system/gaps.md#g-05).
- **Now:** at 360, 390 and 412 the table is 640 px wide inside a 326, 356 or 378 px box. Kheelu's column starts at 520 px, so a parent sees "No, No, Nothing to read" for puzzles and a clipped apps column, and none of Kheelu's four ticks unless they swipe sideways. The caption is cut at 360 after "Kinds of products, not brands: wha".
- **Why it fails:** the fold's job is the contrast "Other AI gives answers. Kheelu asks questions."; on a phone it shows only what the alternatives lack. Brief §9.10: nothing scrolls sideways. `mockup/APPROVAL.md` §10 reports "Nothing scrolls sideways: none", which is true of the page but not of this box.
- **Fix:** below 720 px, compose a stacked comparison from DS parts: one block per "What matters" row, Kheelu's answer first, the three categories under it, with the DS `kh-yes`, `kh-no`, `kh-some` marks (the DS has no phone variant: G11 to the DS owner). Smallest acceptable fix for Gate A: make Kheelu the second column on every width, so it sits beside the fixed row label at 360. The laptop table is right as it is (`laptop-1366-07.png`).

**V2 · The phone hero board covers the boy's face** (→ Builder)
- **Where:** `mockup.css`, `.mk-hero .kh-art { --kh-ratio: 4 / 3; }` (phones; 1:1 from 720 px).
- **Now:** at 360 the 4:3 block cuts Advik's sticker 39 px above the board's top edge (his head is cut at the forehead), and the round "It asks. They think." sticker (204-321 px across, 8-125 px down) covers the right half of his face. Same at 390.
- **Why it fails:** DS `10-pages.md`, scrapbook board: the block is 1:1 or 4:5, and "Never cover a face". The 4:3 saves no first-screen space: the board starts at 860 px (360) and 784 px (390), below the first screen either way.
- **Fix:** drop the 4:3 override so phones use the DS 1:1, the composition that already works on laptop (`laptop-1366-00.png`: sticker above his head, face clear). Cost: about 82 px at 360. Evidence: `phone-360-hero-board.png`, `phone-390-hero-board.png`, `phone-360-01.png`.

**V3 · Section reveals animate the buttons, the price sentences and the offer card** (→ CTO, motion)
- **Where:** `data-reveal` sits on whole `<section>` elements (folds 2-9); `mockup.css` `.js-motion [data-reveal]`.
- **Now:** because the section is the reveal unit, the fold 2 and fold 6 "Pre-order Kheelu" buttons, their price sentences and the whole OfferCard (₹4,999, the ₹499 / ₹4,500 split, the finale button, the fine print) start at opacity 0, 16 px down, and fade in over 240 ms. Probe: the `see-it-ask`, `safety` and `finale` CTAs and 4 of the 5 price elements are inside a reveal. Arriving at the close, the OfferCard is at 22% opacity 30 ms in (`motion-360-offer-reveal-030ms.png`).
- **Why it fails:** strategy §8 "no entrance on the hero, price or CTA"; the approval pack's own spec (`mockup/APPROVAL.md` §6: "Never animated: the hero, the H1, the price sentence, any orange button, the offer card"); [motion](../design-system/motion.md) item 8 (never animate prices or pricing sections). The motion itself is good (240 ms, `space-4`, `ease-standard`, once); the scope is wrong.
- **Fix:** move `data-reveal` from the sections to the content blocks inside them (headings, figures, card grids, the FAQ list), never onto a `kh-section__actions` holding a chilli button, `.mk-beside`, `.kh-offer` or the fold 6 facts. Simplest: no reveals at all in fold 6 (safety) and the close; in fold 2 reveal only the figure and the exchange. Revealing inner blocks also stops the band colour sliding 16 px, which leaves a thin seam of the previous band during the fade (`motion-360-fold2-reveal-060ms.png`).

**V4 · The trust items don't link to their terms** (→ Builder)
- **Where:** every `ul.kh-trustline` (hero, fold 2, fold 6, close): no links.
- **Now:** returns, warranty, payment and delivery are plain text; the only routes to Refunds, Shipping and Terms are in the footer, which starts 12,332 px down a 360 phone.
- **Why it fails:** [home copy](../site/pages/home.md) line 95: "Each trust item links to its terms: returns and warranty → `/refund`; payment → `/terms`; delivery → `/shipping`"; strategy §3.2 (trust row "each linked to its terms"); DS `07-selling.md`, policies linked near the price. A parent from a Meta ad checking the return policy before paying ₹499 should reach it from beside the price.
- **Fix:** link each item as home.md:95 sets, in the DS link style (ink, underlined), each with a tap area of at least `tap-min` (the `.mk-src::before` technique already in `mockup.css`). If that looks busy on every row, do the hero and close rows at least.

**V5 · Fold 5's heading sits on its cards** (→ Builder)
- **Where:** fold 5 (`#app`): the `kh-heading` is followed directly by `ul.kh-trust` inside the split column, with no layout class between them.
- **Now:** 0 px between heading and first card at every width; at 1366 the Kalam "every" touches the first card. On laptop the illustrative app screen also hugs the left of its column, leaving about 200 px empty on the right.
- **Why it fails:** DS spacing comes from the layout classes (`kh-section__head`, `space-7` below a heading; `10-pages.md`, layout classes).
- **Fix:** put the heading in a `kh-section__head` (above the split, as folds 3, 6 and 7 do) and centre the app screen in its column on laptop. Evidence: `laptop-1366-fold5-heading-touches-cards.png`, `phone-360-09.png`.

### Should-fix (not blocking Gate A; before the build)

| # | Where | Now | Fix | Route | Screenshot |
|---|---|---|---|---|---|
| M1 | Folds 2 and 6, after the CTA | Button, then the learning link, then the price sentence (about 90 px from the button at 360) | Button, price sentence, trust row, then the learning link, as in the hero (strategy §3.2: the price sits beside every CTA) | Builder | `phone-360-03.png`, `phone-360-13.png` |
| M2 | Sticky bar at the close | The bar steps aside as soon as the OfferCard's top appears; the card's own button is 438 px lower, so no buy button is in view for 432 px of scroll at 360 × 640 (424 at 360 × 590, 400 at 390, 384 at 412), while the parent is reading the price | Hide the bar for the OfferCard's button (already watched as a `main .kh-btn--cta`) and drop `#offer` from the watch list; "never two chilli buttons" still holds. This departs from the DS letter ("hides while the OfferCard is on screen"): record it under [G-09](../design-system/gaps.md#g-09) at Gate A | CTO | `phone-360-offer-no-cta-in-view.png` |
| M3 | Help line, hero and close | "WhatsApp" 73 × 19 px and "call +91 91875 46483" 145 × 19 px: the main contact actions are below the 44 px floor (brief §9.10; DS `tap-min` 48 px); at 360 the number breaks across two lines ("91875 / 46483") | Invisible tap extension to `tap-min` (as `.mk-src::before`) and keep the number on one line | Builder | `phone-360-01.png`, `phone-360-19.png` |
| M4 | Hero CTA on laptop | `kh-btn--block` at every width: a 672 px chilli bar at 1366 and 1440, a stretched phone pattern | Full width below 720 px only (DS `10-pages.md`, Phones: "a full-width cta") | Builder | `laptop-1366-00.png`, `laptop-1440-00.png` |
| M5 | Fold 4, the longest fold (2,104 px at 360, 3.3 phone screens) | The three modes are described twice (lead and cards); the AI mode card repeats the mechanism | Copy: cut "It answers your child, then asks a question back." from the AI mode card (home.md:369; the unapplied half of S6). Layout: on phones show the three modes as one compact row (DS `10-pages.md`: ModeSwitch drops its icons so the modes fit on one row) and the photo at 16:9 (`kh-photo--wide`). Saves about 600 px; the 60-word answer-first lead stays for search | Copywriter, Builder | `phone-360-05.png` to `-08.png` |
| M6 | The close on phones | The board (the hero's Advik and Kheelu stickers again) comes before the OfferCard, so the price starts about 430 px into the fold | On phones put the OfferCard first; or use the DS's other offer picture, `kheelu-on-fur.jpg` (`10-pages.md`, choosing pictures), after the card | Builder | `phone-360-17.png` |
| M7 | Fold 8 on phones | "See all questions" sits above the six questions | Place it after the list | Builder | `phone-360-15.png` |
| M8 | Fold 6, item 2 | Heading shows without its full stop | "How it understands and answers." as home.md:473 has it | Builder | `phone-360-12.png` |
| M9 | Footer legal line | "Grievance officer" renders in the browser's default blue (rgb 0, 0, 238), not a DS colour, and is 16 px tall; the phone number and email are plain text | DS link colour, tap area to `tap-min`; number as `tel:`, email as `mailto:` | Builder | `phone-360-21.png`, `laptop-1366-10.png` |
| M10 | Fold 5 app screen | "Read this week's conversations" is a live link inside an illustration (24 px tall, goes to the product page) | Plain text: decorative art is not tappable (strategy §6, issue 10) | Builder | `phone-360-11.png` |
| M11 | AI mode card at 360 | "Wi-Fi" splits at its hyphen ("Wi- / Fi") | Non-breaking hyphen | Builder | `phone-360-07.png` |
| M12 | 1440 × 900 first view | Fold 2's top is at 787 px, inside the first view, so it fades in on load | Show anything already in view at load without a transition | CTO | `motion-1440-first-view-060ms.png` |
| M13 | Fold 6 cards at 360 (1,628 px) | The 48 px icon column leaves about 230 px for text; the providers card runs to 10 lines | Optional: on phones put the icon above the title (DS spacing tokens) so text takes the full width; about 250 px saved | Builder | `phone-360-11.png`, `phone-360-12.png` |
| M14 | Hero | No Kheelu in the first screen at 360 or 390 (board at 860 and 784 px); the hero carries five trust items where strategy §3.2 says two to four | Optional: keep four items (the first row plus one) and test lifting the board's top into 390 × 844 | Copywriter (which items), Builder | `phone-390-00.png`, `phone-360-01.png` |

### Notes per criterion

**1 · Five-second test: PASS.** At 360 × 590: "Ages 3 to 7" (who), the H1 and "a screen-free plush toy" (what),
the button at 404-460 px, the price sentence (d) at 476-536 px with ₹499 first and the ₹4,999 total in the
same sentence, and "Deliveries start mid-November" at 548-568 px. "7-day returns" is cut by 6 px at the
bottom edge. The one weakness: no Kheelu on screen at 360 or 390, so "what it is" rests on words alone
(the DS puts the board under the words on phones, `10-pages.md`; M14).

**2 · Next step: PASS.** The scan found 0 positions with two chilli buttons at 360 × 590, 360 × 640,
390 × 844 or 412 × 915, and 0 positions where the bar covers an inline button. The bar changes state 7
times on a full scroll (appears after the hero, steps aside for fold 2, fold 6 and the OfferCard, returns
over the footer). It reads "₹499 today" big and "refundable · ₹4,999 total (incl. GST)" small: D028's
letter, as the copy decided. The note wraps to two lines at all three widths, so the bar is 87 px tall
(15% of a 590 px screen): acceptable. The drawer carries the price sentence under its button (S4); the
page under it is behind the scrim. The phone nav is not sticky (as in the DS phone render), so the drawer
opens only near the top, where the hero button already hides the bar. Every fold ends with a button or a
link; on phones fold 5 ends with the app screen after its link (M5's reorder can fix this).

**3 · Visual fidelity: FAIL (V1, V2, V5).** Passing: bands alternate (plain, band, plain … close plain,
footer band); every headline has exactly one `kh-hand` or one `kh-mark`; the hero is the only display
headline (40 px on phones, 72 px on laptop); `mockup.css` uses tokens only (two inline `style` attributes,
`index.html` 161 and 279, are layout only); cast use meets the DS (Advik twice, Kabir, Ira: three of five,
none more than twice); the imagination frame in fold 2 follows the chalk rules (four doodles, the question
in Kalam, lower case). Laptop is a real enhancement (two-column hero, split folds, three-up cards, full
table, FAQ beside its heading), apart from M4 and V5. DS-native, no action: the wide gap inside Kalam
phrases ("asks  back") and the nav and footer starting at 24 px while the content starts at 83 px (1366)
and 120 px (1440), as in the DS components.

**4 · Message: FAIL on fold 7 (phones).** The positioning comes first, visually: the H1 and the button
own the first screen; fold 2 opens with the page's strongest picture, Kabir and the chalk question "why
does the moon follow our car?", which answers the H1's "why"; the promise appears only in D016's form,
credited to conversation. The first 25% of the page (about 3,400 px at 360, where most phone visits end:
strategy, "In one screen" #5) holds the hero, fold 2 with its button and price, and most of fold 3. Fold
lengths at 360 (13,604 px in total):

| Fold | Height (px) | 360 × 640 screens | Tighten? |
|---|---|---|---|
| Hero | 1,098 | 1.7 | M14, optional |
| 2 · See it ask | 1,458 | 2.3 | M1 only |
| 3 · Why it matters | 1,004 | 1.6 | No |
| 4 · What is Kheelu? | 2,104 | 3.3 | **Yes, M5 (about 600 px)** |
| 5 · Parent app | 1,518 | 2.4 | V5; optional reorder |
| 6 · Safety | 1,628 | 2.5 | **Yes, M13 (about 250 px)** |
| 7 · Compare | 974 | 1.5 | V1 |
| 8 · Questions | 926 | 1.4 | No |
| Close | 1,550 | 2.4 | **Yes, M6 (the price comes about 430 px sooner)** |
| Footer | 1,185 | 1.9 | One column at 360 (DS minimum 150 px per column); two from 390 |

**5 · Motion: FAIL (V3).** Correct: the hero, H1, hero price sentence, hero button and hero board load at
opacity 1 with no transform (probe); reveals use `duration-enter` (240 ms), `ease-standard`, `space-4`,
once each, below the fold on phones: quick and quiet, nothing gimmicky or looping. The bar fades and
slides in 200 ms (`motion-360-bar-enter-090ms.png`, `-390ms.png`). The drawer is a native dialog sliding
in from the right in 240 ms; Escape closes it, focus returns to Menu, `aria-expanded` resets
(`motion-360-drawer-100ms.png`). Reduced motion is respected: no reveal class, the bar fades only, the
drawer is static, smooth scrolling is off. The recording (20 s) shows the same. Small mismatch: the spec's
"stickers below the fold settle with `ease-bounce`" has nothing to act on, as Home has no sticker below
the fold.

**6 · Ad-landing readiness: FAIL (V4).** Message match holds: the H1 is the mechanism arm of the planned
Meta test, and the ad's own line, "It asks. They think.", is the board's sticker (second screen on phones;
fix V2 first, since it currently sits on the boy's face). Contact: the help line is in the first screen at
390 (628 px) and 412 (564 px), and in the second at 360 (684 px), with small targets (M3). Seller block,
GSTIN, address and grievance link are in the footer (M9). Speed (for the Architect and Builder, Phase 4-5,
[G-14](../design-system/gaps.md#g-14)): the hero board loads the 1.07 MB and 1.51 MB sticker PNGs eagerly,
even on phones where the board is below the first screen, and the fold 2 photo has no `loading="lazy"`.
On phones the largest first-screen element is the H1 text, which helps LCP; on laptop the board is in view.

**7 · G2 ink variant: PASS.** All seven chilli buttons (hero, fold 2, fold 6, close, sticky bar, drawer,
laptop nav) switch to ink labels at 5.49:1 (white is 2.88:1); the arrow follows the label; widths and
wrapping are unchanged and the orange stays. Note for the founder: the white glyphs on the Bluetooth card's
Chilli tile (2.88:1) and on the ten Kheelu Blue icon tiles (2.96:1) stay white. They are decorative
(`aria-hidden`), axe does not flag them, and the DS keeps icons white on fills; CMO view: leave them, the
buttons are the only words on a fill.

### Approval pack corrections (for the main session; not mine to edit)

- `mockup/APPROVAL.md` §6 says the price sentence, every orange button and the offer card are never
  animated; the build animates them (V3). §10 says nothing scrolls sideways; the comparison box does on
  phones (V1). Both become true once V1 and V3 are fixed.
- §10's `CMO_VISUAL` placeholder, suggested wording: "Ready after five layout and motion fixes (V1-V5),
  applied before you saw it; fourteen smaller items follow in the build."

### The three improvements that matter most

1. **Show Kheelu in the phone comparison (V1).** On 70%-phone traffic, the contrast fold currently shows
   only what the alternatives lack.
2. **Keep the buying block whole and still.** The price sentence directly under every button (M1), each
   trust item linked to its terms (V4), the bar staying until the OfferCard's own button arrives (M2), and
   no reveal on any button, price or the OfferCard (V3).
3. **Shorten the phone middle by about 1,300 px and fix the boards.** Modes said once (M5), the OfferCard
   before the repeated board (M6), full-width safety text (M13), and the hero board at the DS 1:1 with the
   boy's face clear (V2).

### Routing (mockup pass)

- **Builder (the CTO, for the mockup):** V1, V2, V4, V5, M1, M3, M4, M6-M11, M13, the layout half of M5
  and M14.
- **CTO (motion and behaviour):** V3, M2, M12.
- **Copywriter:** the AI mode card line (M5); which four trust items the hero keeps (M14).
- **Architect and Builder:** the speed note (eager sticker PNGs, lazy loading) for Phase 4-5.
- **Main session:** the approval pack corrections; M2's departure from the DS bar rule under G-09; V1's
  phone variant request to the DS owner (G11).
