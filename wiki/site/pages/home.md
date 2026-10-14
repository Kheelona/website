---
title: "Home (/): page copy, Phase 3 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§1 hierarchy, §2 journey, §3 CTA rules, §5 Home row, §7 search rules)
  - ../../brand/messaging.md (confirmed candidate lines, taglines, objection answers, against the alternatives, words to stop using, CTA labels)
  - ../../brand/voice.md, ../../brand/audience.md, ../../brand/positioning.md
  - ../../product/claims.md (§1, §2, §3, §4, §4.1, §5, §8), ../../product/facts.md, ../../product/pricing.md, ../../product/policies.md
  - ../../research/keyword-map.md (§4.1, §5, §6.1, §7.1), ../../research/source-verification.md (§4 C07, §7)
  - ../content-boundary.md, ../tracking-inventory.md (§6, the eight cta values)
  - ../../design-system/overview.md, ../../design-system/component-map.md, ../../design-system/gaps.md; design-system/project/01-writing.md, 03-cast.md:102-126, assets/Kheelu/README.md (read-only)
  - "src/lib/video-moments.ts:101-238 at tag archive/pre-reset-2026-10-10 (the seven consented films; working tree read 2026-10-11, same lines messaging.md cites)"
  - "decisions D015-D041; binding here: D016-D028, D032-D038, D040, D041"
  - ../../raw/feedback/2026-10-11-gate-a-answers.md (the founder's Gate A answers, round 1, verbatim)
  - "Gate A round 2 inputs, 2026-10-11: 15 hero candidates, the CMO's ranking (measured in the mockup at 360/390/412 x 590 and 1366/1440 x 768) and the compliance check, relayed by the main session"
  - ../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md (item 4, the FAQ's refund timing; task 7.1b)
  - ../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (item 5, the refund reaches the parent within 7 working days, bank time included)
  - ../../qa/cmo-review-built-a-2026-10-14.md (M8, one wording for the age-3 advice; task 7.1b)
  - "src/content/en-IN/faqs.ts:41, 86, 125, 151, 174 and test/guards/answer-length.test.ts (40-60 words per answer), read 2026-10-14 for the M8 word counts"
---

# Home (`/`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft:
> CMO review next, then the founder signs off at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes, sources and checklists are INTERNAL.
- `{price-source}` after an amount: written as it is today, rendered by the build from the single price
  source ([pricing](../../product/pricing.md)): ₹499 = `TOKEN_PRICE`, ₹4,500 = `BALANCE_PRICE`,
  ₹4,999 = `LAUNCH_PRICE`, ₹7,999 = `FULL_PRICE`, "first 500 units" = `CAP_UNITS_TEXT`. Never typed by hand.
- `{delivery-source}`: the one delivery content value ([D023](../../decisions/D023-new-order-delivery.md)),
  which also sets the Product JSON-LD `availabilityStarts` 2026-11-15 ([D037](../../decisions/D037-delivery-date-in-schema.md)).
- **Token mode** = while ₹499 reservations are open; **full mode** = after the first 500 units, ₹7,999 paid
  in full. How the display follows the live mode is Gate A item G9.
- `[PLACEHOLDER: …]` = a fact we do not have. None on this page since Gate A round 2; see [Placeholders](#placeholders).
- `¹` = a source marker under [D026](../../decisions/D026-public-statistics.md), linking to the fold's
  Sources note. Home carries one marked line (fold 3).
- Word counts exclude markers. Hyphenated words count as one.
- Alt texts for DS photos are written from the DS photo table (`03-cast.md:102-126`) and the Kheelu asset
  README; the mockup checks each against the file and rewrites it if a different asset is chosen. They
  describe what is shown without the cast's names or ages: the cast is illustrative and never presented as
  customers ([DS overview, imagery](../../design-system/overview.md#imagery)).

## At a glance

| Item | Draft |
|---|---|
| Title (54 characters) | Kheelu by Kheelona: a screen-free plush toy that talks |
| Meta description, token mode (150 characters) | Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹4,999`{price-source}` (incl. GST); reserve with a refundable ₹499`{price-source}`. |
| Meta description, full mode (147 characters) | Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹7,999`{price-source}` (incl. GST), delivered anywhere in India. |
| H1 | The founder picks from five options in [Gate A round 2](#gate-a-round-2-2026-10-11); recommended H1-1 "Shh. Your child is explaining the moon to Kheelu." (round 1's A to E were all rejected, [D041](../../decisions/D041-gate-a-round-1.md)) |
| CTA label, everywhere | Pre-order Kheelu ([strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1); G1) |
| Price sentence, token mode (18 words; option (d), OQ2) | Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST). |
| Price sentence, full mode (8 words) | ₹7,999`{price-source}` (incl. GST), paid in full when you order. |
| Delivery line | Deliveries start mid-November`{delivery-source}`. |
| Trust row | 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India |
| Help line | Questions? WhatsApp or call +91 91875 46483 |
| OG | `og:title` = title; `og:description` = meta; image `kheelu-on-fur.jpg` (DS, "for … OG images"), alt as the hero product alt below |

Title and meta are machine-read, so they lead with ₹4,999 (incl. GST) and give the advance second
([D028](../../decisions/D028-price-wording.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 5).
Only the sentence next to the CTA leads with ₹499. The meta keeps "asks back" rather than the page's one
behaviour form ("answers your child, then asks a question back"): the full form would take the token-mode meta
to 161 characters, over the 155 limit, and the CMO review exempts the H1 and the meta (S6).

---

## Gate A round 2 (2026-10-11)

The founder answered the Gate A pack on 2026-10-11 ([raw, verbatim](../../raw/feedback/2026-10-11-gate-a-answers.md);
[D040](../../decisions/D040-films-move-to-new-site.md), [D041](../../decisions/D041-gate-a-round-1.md)). Gate A is
**not approved yet**: the founder reviews the revised mockup first. This section holds the copy for that review;
the folds below are updated to match.

### Hero: five options for the founder

**The brief (founder, verbatim):** "Think like a copy writter / story teller and try to write on this. I don't
like the current one, it lacks a hook, which a parent might look for. Concept wise it's good, but taste is
missing, give me few options to choose from." Rejected so far: "Your child asks why. Kheelu asks back." and round
1's B to E (the old table in [fold 1](#fold-1--hero)).

**How the five were chosen.** 15 candidates were written, ranked by the CMO (each swapped into the mockup and
measured at 360, 390 and 412 × 590, the top five also at 1366 and 1440 × 768) and checked for compliance.
Dropped: #3 (bedtime reads as a Story-mode question, which [D027](../../decisions/D027-story-mode-wording.md)
rules out; failed), #10 (an unsourced comparison, and Kheelu's feelings as a selling point; failed), #13 (reads as a
learning outcome within a day, legal review L7; failed), #14 (Kheelu "takes" the child's questions off the parent,
the replacement framing [voice rule 8](../../brand/voice.md#voice-rules-from-the-positioning) rules out; failed),
#8 (casts the answers as the child's pleasure, which undersells the child's thinking), #2 (the same overheard scene as
H1-1; one is enough), #4 (the same idea as H1-2, done less well), #15 (on an AI toy page "wants to know what your
child thinks" can read as data collection). Moved to other folds: #7 and #9 (below).

**Rules every option follows.** The concept is kept: the H1 is the hook; the sub-line says what Kheelu is and the
confirmed mechanism. Outcome first, "AI" nowhere in the H1 ([voice rule 1](../../brand/voice.md#voice-rules-from-the-positioning)).
No fear, guilt, "best friend", "boosts", "adapts", "smart", tutor or lesson framing, and no brain claim
([claims §3, §4, §8](../../product/claims.md#4-retired-or-banned-wording)). One `Hand` (Kalam) span of one to three
words, ending **before** any punctuation (Kalam sets a visible gap before "?" and around quotes; CMO). Curly
apostrophes throughout. The age chip ("Ages 3 to 7"), the button and the price sentence are unchanged.

| ID | H1 (chars) | `Hand` on | Sub-line | Angle | The hook, for the founder | Fit at 360 × 590 (CMO, measured) | "Kheelu" in H1 |
|---|---|---|---|---|---|---|---|
| **H1-1 (recommended)** | Shh. Your child is explaining the moon to Kheelu. (49) | "explaining" | Sub A | Story: an overheard scene, outcome first | Every parent has stood in a doorway holding their breath while their child explains something with total confidence; this puts that moment first. | H1 3 lines at 360, 390, 412, 1366 and 1440 px; with Sub A the delivery line ends at 584 px, inside the first screen | Yes |
| H1-2 | You know their whys. Now hear their becauses. (45) | "becauses" | Sub B | Contrast: recognition, then a payoff for the parent | You hear "why?" all day; the made-up word "becauses" is the small surprise, and the reward is hearing your child's own reasons. | H1 3 lines at every width; with Sub B the price sentence ends at 536 px and the delivery line at 612 px, below the first screen at 360 px | No (founder's OK needed, see below) |
| H1-3 | Why? Why? Why? Kheelu has a question too. (41) | "a question too" (the three whys stay in Baloo 2) | Sub A | Recognition: the why years, then a twist | Every parent of a 3 to 7 year old knows the triple why; the turn is that the toy has a question of its own. | H1 3 lines at 360, 390 and 412 px; delivery line at 584 px with Sub A | Yes |
| H1-4 | Your child has questions. Kheelu has follow-ups. (48) | "follow-ups" | Sub A | Wit: deadpan | A dry joke a working parent gets at once; "answers your child first" underneath shows it never dodges the question. | H1 3 lines at every width; delivery line at 584 px with Sub A | Yes |
| H1-5 | Kids have the best theories. Kheelu asks to hear them. (54) | "theories" | Sub A | Delight: pride in the child's own ideas | Every parent has a favourite wild theory from their child, and here is a toy that asks to hear it. | H1 4 lines at 360 px only (3 from 390 px); price sentence inside the first screen; delivery line estimated about 628 px at 360 px (not measured with Sub A) | Yes |

**The two sub-lines.**
- **Sub A** (21 words; for H1s that name Kheelu): "A screen-free plush toy by Kheelona. It answers your child first, then
  asks a question back, so they do the thinking." Measured at 3 lines, which lifts the delivery line inside 360 × 590,
  as [strategy, in one screen](../strategy.md#in-one-screen) item 5 asks (the current build misses it at 612 px).
  "First" keeps H1-3 and H1-4 from reading as a toy that dodges the question. Trade-off: the sub-line no longer
  opens with "Kheelu by Kheelona" verbatim (H1 "Kheelu" + sub-line "by Kheelona"); the title and meta still carry it
  verbatim, which meets [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow). Founder's OK needed.
- **Sub B** (22 words; for H1-2, whose H1 has no "Kheelu"): "Kheelu by Kheelona is a screen-free plush toy. It
  answers your child’s questions, then asks one back, so they do the thinking." It must open with the product name,
  so it runs 4 lines at 360 px.

**Recommendation: H1-1.** The CMO's first pick was H1-2 (8.5); H1-1 scored 8.5 once fixed. I break the tie for
H1-1 on four measured or rule-based grounds: it names Kheelu, so it needs no exception to the keyword rule
([keyword map §5.2](../../research/keyword-map.md#52-per-page)); with Sub A it is the only top option that also gets
the delivery line onto the first phone screen; it shows a child thinking, which is the positioning's own creative rule
([voice rule 16](../../brand/voice.md#voice-rules-from-the-positioning)); and the parent is in the room, which sits
well with "a grown-up nearby" for 3-year-olds ([D041](../../decisions/D041-gate-a-round-1.md)). The scene is the one
film 1 shows for real (Kheelu asks a girl to explain carrom). Swap if the founder prefers: "the moon" → "carrom"
(true to film 1) or "rain" (a monsoon touch). **Second choice: H1-2**, if the founder accepts an H1 without
"Kheelu" and the delivery line just below the first screen at 360 px.

**Watch-outs, option by option** (compliance, non-blocking): H1-1 and H1-2: supporting art never shows a 3-year-old
alone with the toy. H1-2: "hear" means in the room; the app shows conversations to read, never recordings
([messaging #11](../../brand/messaging.md#proof-points)), and nothing extends "becauses" into a reasoning-skill gain
(L7). H1-4: one follow-up per question is what is confirmed; "interview" stays out of the copy. H1-5: "asks to hear
them" describes film 1; never claim it always asks for theories. "Kids" departs from the DS's "your child"
(`01-writing.md` L19) but is not banned.

**Hero art to match the choice (Builder):** H1-1 → `advik-02-whispering-to-kheelu` (alt: "A boy in a mustard
shirt leaning close to whisper to Kheelu, on a cane chair by a tall window."). H1-2 and H1-3 →
`myra-01-breakfast-why` (Myra may appear on her own, [D041](../../decisions/D041-gate-a-round-1.md); alt: "A little
girl in a mustard floral frock at the breakfast table, asking Kheelu a question in the morning light."). H1-4 and
H1-5 → the current sticker board or `advik-02`. The "It asks. They think." sticker may stay as the master line's home
([D038](../../decisions/D038-trust-content-rulings.md)).

**Lines kept for other places:** "Kheelu has answers. It wants your child’s, too." (candidate 7) for the "think less"
objection on the product page or a fold-2 line; keep a closed-library fact within reach, never "ask it anything"
([claims §1](../../product/claims.md#1-confirmed-by-the-founder), [§2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)).
"After Kheelu answers, it’s your child’s turn." (candidate 9) for how-it-works on the product page, never beside the
Romeo 2018 finding.

| Claim in the five options | Source |
|---|---|
| Answers first, then asks a question back (all sub-lines; "follow-ups", "a question too") | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| "so they do the thinking" | [strategy, in one screen](../strategy.md#in-one-screen) item 2; [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 |
| A child explaining something to Kheelu (H1-1); Kheelu asking to hear the child's idea (H1-5) | Film 1, "Kheelu asks her to explain carrom" (`src/lib/video-moments.ts:190-203` at the tag; [D040](../../decisions/D040-films-move-to-new-site.md)) |
| Screen-free plush toy, by Kheelona | [facts, identity](../../product/facts.md#identity); [messaging, proof points](../../brand/messaging.md#proof-points) #1, #2 |
| The why phase, "becauses", kids' theories | Scene-setting about children, not claims about the product; "becauses" echoes the positioning's creative note (a child pausing, then answering "because…", [voice rule 16](../../brand/voice.md#voice-rules-from-the-positioning)) |

### Fold 2: the films (variant (a), chosen, D040)

> **H2:** Kheelu asks. Watch them think.
>
> **Lede:** Real children in real homes. Press play on any of them.
>
> *(under the film strip)* **Proof line:** Kids doing the talking. Parents, in their own words.

- **H2 accent:** `Hand` on "think" (full stop outside the span). The eyebrow stays "See it ask", so the fold reads
  as set-up then payoff. The H2 keeps the round 1 idea (see Kheelu ask, in real homes: the lede still says "real
  homes") and sharpens it with the payoff a parent is looking for. If H1-2 is chosen, "hear" appears in the hero
  only; nothing here repeats it.
- **Lede:** the live, founder-approved `videoLede()` text, verbatim (`src/lib/video-moments.ts:232-238` at the tag).
- **Proof line:** the founder asked for "something like kids love it and parents approve it"
  ([D040](../../decisions/D040-films-move-to-new-site.md)). It claims only what the films show: children talking with
  Kheelu (films 1, 2, 5) and two parents speaking to camera (films 3, 7). It never says "approve" or "love", which
  would claim every parent's verdict. "Doing the talking" echoes the hero's "so they do the thinking". "In their own
  words" restates film 3's live, founder-approved chip "In a parent’s words" (`video-moments.ts:135-147`).
  If the founder cannot confirm the two parent films were unscripted, use "Children doing the talking. Parents
  having their say." (no authenticity claim).
- No endorsement-disclosure line, by the founder's direction; the risk is recorded in D040.

### Mockup edits for the founder's other answers (D041)

Applied to `mockup/index.html` by the main session from the exact find/replace pairs returned with this round;
the folds below now carry the same words.

| # | Where | Change | Source |
|---|---|---|---|
| a1 | Fold 5 | The line "The parent app is part of Kheelona+, included for 6 months with every Kheelu." is removed | [D041](../../decisions/D041-gate-a-round-1.md) F7: "No need to specify things after 6 months … ignore this line of discussion at most places" |
| a2 | Fold 9 | The Kheelona+ line keeps only its first sentence: "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app." "Keep working for life, with no subscription needed" and "pricing will be announced soon" go: both discuss what happens after the six months. This is the page's one Kheelona+ mention, where the offer is listed | D041 F7; [D027](../../decisions/D027-story-mode-wording.md) (the sentence kept, verbatim) |
| b | Fold 9, OfferCard | The placeholder becomes "In the box: Kheelu plush toy, charger and quick-start card" | D041 ("Kheelu plush toy, Charger, quick start card"); spelling "quick-start card" as on [facts, in the box](../../product/facts.md#in-the-box) |
| c | Fold 8, price answer | "first 500 units" stated once; the MRP added once in D034's wording; the closing "After the first 500 …" sentence removed (a second mention). No badge, counter or strike-through | D041; [D034](../../decisions/D034-origin-manufacturer-mrp.md); [D028](../../decisions/D028-price-wording.md) (still leads with ₹4,999) |
| d | Fold 8, age answer | Adds "For 3-year-olds, we advise having a grown-up nearby." | D041 ("Advise 'with a grown-up nearby' in age and safety answers") |

**Why "6 months" stays in a2:** it is the founder's confirmed term (D027), and without a duration "Every Kheelu
comes with Kheelona+" can read as included for good, which is unconfirmed ([claims §3](../../product/claims.md#3-not-confirmed-do-not-publish),
"free for life", F7). The founder may still drop the duration (question 4 below). The legal review's L7 risk (the
site should say what stops) is recorded in D041 and accepted by the founder.

### Questions for the founder (round 2)

1. **Which hero?** H1-1 to H1-5. **Recommend H1-1.**
2. **Only if H1-2:** OK an H1 without "Kheelu" (keyword rule), with the delivery line just below the first phone
   screen at 360 px? **Recommend yes if you love H1-2;** otherwise H1-1.
3. **The short sub-line (Sub A)** for H1s that name Kheelu, so the delivery line fits on the first phone screen, though
   "Kheelu by Kheelona" is then split across the H1 and the sub-line? **Recommend yes.**
4. **Kheelona+ at the close:** (a) "Every Kheelu comes with 6 months of Kheelona+: …" or (b) "Every Kheelu comes with
   Kheelona+ included: …" (no duration). **Recommend (a):** (b) can read as included for good.
5. **Were the two parent films (3, 7) unscripted?** If yes, the proof line says "Parents, in their own words"; if not
   sure, "Parents having their say". **Recommend** answering yes or no; the line changes in one place.
6. **Were films 1 (playmat) and 5 (floor) shot at home?** The lede says "real homes". If not, the lede becomes "Real
   children, real families. Press play on any of them." **Recommend** confirming; no change if yes.

---


### Hero chosen (2026-10-11, [D045](../../decisions/D045-hero-headline.md))

**H1: "Kheelu answers every why. Then it asks one back."** (Hand: "asks one back."), with the short sub-line. It replaces H1-1 to H1-5 above; the mockup's headline picker is removed.

### Founder answers after round 2 (2026-10-11, main session)
- The parent films are the parents' own words: the proof line stays "Kids doing the talking. Parents, in their own words."
- Not every film was shot at home: the lede becomes "Real children, real families. Press play on any of them.", film 2's chip "Real homes" becomes "Real families", and its alt text drops "at home" ("Children talking to the cream Kheelu plush.").
- The Kheelona+ line at the close keeps "6 months of Kheelona+" (option a). The short hero sub-line is approved.
- The founder picks the hero from H1-1 to H1-5 in the mockup (the "Headline" picker); H1-1 shows by default.

## Shared blocks (defined once, reused)

### CTA block

Every chilli button on Home is followed by this block, rendered from one component so the words never
drift ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

**Copy (full block, used at the close):**

> **[Pre-order Kheelu]** → `https://store.kheelona.com` (`PREORDER_HREF`), same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}`.
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> Questions? WhatsApp or call +91 91875 46483

**Compact block** (hero first screen, fold 2, fold 6): the button, the price sentence, then the micro-line

> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

(8 words; it carries delivery and returns, the two items brief §9.1 puts next to the CTA). In the hero the
compact block is followed only by the help line; the 6-month warranty, payment and delivery-included items
appear in the full row at the close (CMO mockup pass, M14).

**Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order."
Everything else is unchanged.

**Links and rendering.** Every trust item links to its terms, wherever it appears (full row, micro-line,
drawer note): returns and warranty → `/refund`; payment → `/terms`; delivery (the start date and "delivery
included") → `/shipping`. The mockup now does this everywhere. The help line's WhatsApp and call links render from the support source
([facts, support channel](../../product/facts.md#support-channel)). The help line is an inline secondary
action, never a floating bubble ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

| Claim in the block | Source |
|---|---|
| "Pre-order Kheelu", no price on the button, store destination | [strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1); [messaging, CTA labels](../../brand/messaging.md#cta-labels) #2 |
| ₹499 first, "refundable" beside it, ₹4,500 before delivery and the ₹4,999 total (incl. GST) in the same sentence (option (d), OQ2) | [D028](../../decisions/D028-price-wording.md); [pricing, price wording](../../product/pricing.md#price-wording-for-the-new-site-d028); amounts from [pricing, single source](../../product/pricing.md) |
| Refundable until dispatch | [policies, status at a glance](../../product/policies.md#status-at-a-glance) (refund before dispatch: published, no new ruling) |
| ₹7,999 paid in full, no advance (full mode) | [pricing](../../product/pricing.md) (`full` tier, balance none); [D028](../../decisions/D028-price-wording.md) |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md); [facts, ship date](../../product/facts.md#ship-date) |
| 7-day returns, no questions asked | [D021](../../decisions/D021-returns-policy.md); [policies, decided](../../product/policies.md#decided-for-the-new-site) |
| 6-month warranty | [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md) |
| UPI, card or net banking; incl. GST | [D024](../../decisions/D024-payment-methods-gst.md); [policies, payment methods](../../product/policies.md#payment-methods) |
| Delivery included anywhere in India | [pricing, tax, delivery, MRP](../../product/pricing.md#tax-delivery-mrp); [policies](../../product/policies.md#status-at-a-glance) (shipping) |
| WhatsApp or call +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md) (takes calls; "messages only" retired); [facts, support channel](../../product/facts.md#support-channel) |

### Phone sticky bar

Appears once the hero CTA leaves the screen ([strategy §3.4](../strategy.md#34-phone-sticky-bar-benchmarks-a1-d1)).
`StickyBuyBar` props:

> price: **₹499`{price-source}` today** · note: **refundable · ₹4,999`{price-source}` total (incl. GST)** · cta: **Pre-order Kheelu**

Full mode (unchanged): price "₹7,999`{price-source}` (incl. GST)", note "Paid in full · Deliveries start mid-November`{delivery-source}`".
`cta` value: `sticky-bar` (new). The bar must step aside while any inline chilli CTA (hero, fold 2, fold 6,
the OfferCard) is on screen, so a phone view never shows two chilli buttons
([strategy §3.3](../strategy.md#33-placement-and-repetition); DS gap [G-09](../../design-system/gaps.md#g-09), motion G4).
**D028 order:** ₹499 leads, "refundable" sits beside it and the ₹4,999 total (incl. GST) follows in the same
unit, so the bar meets D028's letter, not only its purpose (CMO review, OQ10). This departs from the
strategy §3.4 draft (total as the big price) and from the DS default (price "₹4,999", note "Reserve for ₹499
today"); the mockup checks the props fit at 360 px beside the full label.

### Navigation

- Laptop `NavBar`: Meet Kheelu · Safety · Stories · Team, plus **Pre-order Kheelu** (`cta` = `navbar`).
- Phone: logo and menu button; `NavDrawer` with the same four links and **Pre-order Kheelu**
  (`cta` = `navbar-mobile`). Drawer `note`, under the CTA:

  > Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
  >
  > Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

  Full mode: the full-mode price sentence, then the same line. The drawer CTA now carries the price beside it
  like every other chilli button (brief §9.1, strategy §3.2; CMO review S4). The laptop nav CTA stays exempt
  as a header pattern (G2).
- No `AnnouncementBar` on phones: it would eat the first-screen budget. If the laptop uses one: "Deliveries
  start mid-November · 7-day returns, no questions asked" (no price).

Sources: [strategy §4.4](../strategy.md#44-navigation), [§3.3](../strategy.md#33-placement-and-repetition).

---

## Fold 1 · Hero

**Fold job:** say what Kheelu is, who it is for and the one action, inside the first phone screen (360 × 590).

> **Round 1 result ([D041](../../decisions/D041-gate-a-round-1.md)):** the founder rejected the H1 below and options
> B to E ("it lacks a hook"). The H1 and sub-line are re-chosen from the five options in
> [Gate A round 2](#gate-a-round-2-2026-10-11); everything else in this fold stands.

**Copy (first screen, in this order):**

> **Eyebrow (age chip):** Ages 3 to 7
>
> **H1:** Your child asks why. Kheelu asks back.
>
> **Sub-line:** Kheelu by Kheelona is a screen-free plush toy. It answers your child, then asks a question back, so they do the thinking.
>
> **[Pre-order Kheelu]**
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

**Copy (directly below the first screen):**

> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu`

- **Trust items in the hero (CMO mockup pass, M14):** only the micro-line under the price sentence
  (delivery · returns), then the help line. The row "6-month warranty · UPI, card or net banking · Delivery
  included anywhere in India" has moved out of the hero: five trust items there exceeded the two to four in
  [strategy §3.2](../strategy.md#32-what-sits-beside-every-cta). The full four-item row stays at the close
  (fold 9). The micro-line's items link to their terms: delivery → `/shipping`, returns → `/refund`.

Budgets: eyebrow 4 words; H1 7; sub-line 22 words in two short sentences (CMO review S2: the descriptor lands
first and scans faster on a phone; it replaces the earlier one-sentence budget); price sentence 18 (option (d)); micro-line 8.
Full mode swaps the price sentence only.

- **H1 accent:** `Hand` on "asks back."
- **CTA:** Pre-order Kheelu, `Button cta l block`, `cta` = `hero` (existing value, same position).
  Secondary: "See how it works", ghost link to the product page (strategy: Home's first screen reaches the
  store or the product page in one tap); suggested `cta` = `hero-learn` (new, optional, G10).
- **Fit check for the mockup:** the 7-word H1 may take three lines at 360 px. If it pushes the micro-line
  below 590 px, use alternative B (6 words, two lines). "See how it works" sits inside the first screen
  only if it fits; otherwise it opens the space below.
- **Images** (the board sits under the words on phones, DS `10-pages.md:69-74`):
  - Kheelu cut-out (`kheelu-front.webp`, or a look-identical sticker derivative). Alt: "Kheelu by Kheelona:
    the cream plush rabbit with rainbow ears and a speaker in its tummy."
  - Suggested cast photo `myra-01-breakfast-why` (the DS's photo for "why" messages). Alt: "A little girl
    in a mustard floral frock at the breakfast table, asking Kheelu a question in the morning light."
    The child is 3½ in the cast, so this rides on G5 (open question 12). Fallback
    `advik-02-whispering-to-kheelu`. Alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on
    a cane chair by a tall window."

**H1 options for Gate A** ([D038](../../decisions/D038-trust-content-rulings.md): the tagline is usable,
alternatives invited). All are mechanism-first, carry no outcome claim, keep "AI" out of the headline
([voice rule 1](../../brand/voice.md#voice-rules-from-the-positioning)) and avoid "talks back", which is the
product page's cluster ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags)).

| | H1 | Words | Why |
|---|---|---|---|
| **A (recommended)** | Your child asks why. Kheelu asks back. | 7 | The mechanism as a scene every parent of a 3 to 7 year old lives daily; the child goes first; names Kheelu, as the H1 rule wants ([keyword map §5.2](../../research/keyword-map.md#52-per-page)); the sub-line adds "answers, then" |
| B | Your child asks. Kheelu asks back. | 6 | Same idea in two phone lines; loses the "why" a parent recognises |
| C | Kheelu answers. Then it asks back. | 6 | The most literal form of the confirmed behaviour ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)); nobody can read it as dodging the question, but it is the least warm |
| D | It asks. They think. | 4 | SKM's master line, usable with the trademark risk accepted (D038); shortest and quotable, but names neither Kheelu nor the child, so it misses the H1 keyword rule and leaves the sub-line to explain everything |
| E | Kheelu asks back, so they think. | 6 | Mechanism plus the payoff in the strategy's own frame ("so they do the thinking"); plainer than A, keeps the product name first |

**Sources, fold 1**

| Claim | Source |
|---|---|
| Ages 3 to 7 | [facts, age](../../product/facts.md#age) (band 3 to 7, brief §2); [age-band review](../../product/age-band-review.md) |
| Answers, then asks a question back ("asks back") | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); [messaging, proof points](../../brand/messaging.md#proof-points) #14 |
| "so they do the thinking" | [strategy, in one screen](../strategy.md#in-one-screen) item 2; [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 (EXTERNAL) |
| Screen-free plush toy; cream rabbit, rainbow ears, speaker in its tummy | [facts, identity](../../product/facts.md#identity); [messaging, proof points](../../brand/messaging.md#proof-points) #1, #2; DS `01-writing.md:113` |
| "Kheelu by Kheelona" | [facts, identity](../../product/facts.md#identity); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) |
| CTA block items | [CTA block sources](#cta-block) |
| Images | DS `assets/Kheelu/README.md`; `03-cast.md:102`, `:108` |

---

## Fold 2 · See it ask

**Fold job:** let a parent see the mechanism working before reading any claim about it.

**Chosen: variant (a), the seven films** ([D040](../../decisions/D040-films-move-to-new-site.md), founder
2026-10-11). All seven move to the new site; the founder's 2026-09-19 consent statement stands (signed records stay
with the founder); the burned-in subtitles ship as they are; no endorsement-disclosure line (risk recorded in D040).
Variant (b) leaves Home and is kept for the product-page outline. The CTA and links below are unchanged.

### Variant (a): with the films (CHOSEN, D040)

**Copy** (Gate A round 2; the round 1 H2 was "See Kheelu ask, in real homes."):

> **H2:** Kheelu asks. Watch them think.
>
> **Lede:** Real children in real homes. Press play on any of them.
>
> *(under the film strip)* **Proof line:** Kids doing the talking. Parents, in their own words.

- **H2 accent:** `Hand` on "think". Why the H2 and the proof line read this way, and the fallback proof line:
  [Gate A round 2, fold 2](#fold-2-the-films-variant-a-chosen-d040).
- **Films, phone order** (one tile at a time; this order keeps the founder's 2026-09-19 instruction that the
  montage holds index 1 and the parent film sits to its right on laptop). Chips and captions are the live,
  founder-approved labels, with one rewritten; alt texts are the live ones, verbatim.

| # | Film id | Chip | Caption (copy) | Poster alt | Source (`src/lib/video-moments.ts`, at the tag) |
|---|---|---|---|---|---|
| 1 | `learning-by-asking` | Learning by asking | Kheelu asks her to explain carrom, and thanks her for the reminder. | A young girl on a playmat holding the cream Kheelu plush. | `:190-203` |
| 2 | `first-conversations` | Real homes | Children asking Kheelu their own questions, in their own languages. | Children at home, talking to the cream Kheelu plush. | `:121-134` |
| 3 | `a-parent-speaks` | In a parent's words | Nikita on what changed when the toy spoke back. | A parent speaking to camera at home. | `:135-147` |
| 4 | `a-mother-joins-in` | A mother joins in | Arha's mother asks the questions, and Kheelu answers her by name. | A girl and her mother on a sofa with the cream Kheelu plush. | `:102-115` |
| 5 | `counting-out-loud` | Counting out loud | Three bricks and two more, worked out on the floor with Kheelu. | A boy on the floor with Lego bricks and the cream Kheelu plush. | `:176-189` |
| 6 | `a-story-in-two-languages` | Two languages | In AI mode, Arha switches to English, and Kheelu switches with her. (the founder's caption, D040) | A girl on a sofa beside the cream Kheelu plush. | `:148-161` |
| 7 | `a-father-speaks` | A father's view | Siddhant's father on what play away from a screen looks like. | A father seated at home, speaking to camera. | `:162-175` |

- **Why film 6 is rewritten:** the live caption "Arha would rather speak English today, so the story follows
  her" can read as Story mode responding to the child, which [D027](../../decisions/D027-story-mode-wording.md)
  says does not exist, and "follows her" sits close to the banned "adapts" family
  ([claims §3](../../product/claims.md#3-not-confirmed-do-not-publish)). The founder wrote the new caption
  on 2026-10-11: it was AI mode that changed the language, not Story mode, so D027 holds
  ([D040](../../decisions/D040-films-move-to-new-site.md)).
- First names only, as live; no surnames, schools or places ([DS 08-accessibility](../../design-system/overview.md#accessibility-project08-accessibilitymd)).
  Captions are burned in; no autoplay audio.
- Lede source: `videoLede()`, `src/lib/video-moments.ts:232-238` (seven films, so the plural form).

### Variant (b): without the films (not on Home; kept for the product-page outline, D040)

**Copy:**

> **H2:** What asking back sounds like.
>
> *Illustrative example, not a recording.*
>
> **Your child:** "Why does the moon follow our car?"
>
> **Kheelu:** "The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?"
>
> **Your child:** "My shadow?"
>
> It answers first, then asks a question back. That's how your child ends up doing the thinking.

- **H2 accent:** `Hand` on "asking back".
- The label is required, sits above the exchange and is never removed: the exchange is written by us, not
  spoken by a child, and Kheelu's lines show the confirmed pattern only (answer, then one question back;
  DS Kheelu voice, `01-writing.md:77-78`). Kheelu's sentences stay within the DS length for a 5-year-old.
- **Image (optional):** `kabir-01-imagining-space` in an `ImaginationFrame`, the child's question in Kalam,
  lower case: "why does the moon follow our car?". Alt: "A boy in a rust T-shirt holding Kheelu in front of a
  dark wall, with chalk stars and a moon drawn around his question." Doodles are decorative (`alt=""`).

### CTA (both variants)

> **[Pre-order Kheelu]** + compact CTA block
>
> [See what else it does] → `/products/kheelu`

- `cta` = `see-it-ask` (new: the belief-fold CTA in [strategy §3.3](../strategy.md#33-placement-and-repetition)).
  Link: suggested `see-it-ask-learn` (new, optional).

**Sources, fold 2**

| Claim | Source |
|---|---|
| Film chips, captions, alt texts, lede | `src/lib/video-moments.ts` (lines in the table) at tag `archive/pre-reset-2026-10-10`; use decided by [D040](../../decisions/D040-films-move-to-new-site.md) ([claims §5](../../product/claims.md#5-placeholder-content)); film 6's caption is the founder's (D040) |
| H2 "Kheelu asks. Watch them think." | Asking back: [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); the thinking frame: [strategy, in one screen](../strategy.md#in-one-screen) item 2; shown in film 1 (`:190-203`) |
| Proof line "Kids doing the talking. Parents, in their own words." | What the films show: children talking with Kheelu (films 1, 2, 5), parents speaking to camera (films 3, 7); "in their own words" restates film 3's live, founder-approved chip "In a parent’s words" (`:135-147`); [D040](../../decisions/D040-films-move-to-new-site.md) (claim only what the films show). Unscripted: founder to confirm (round 2, question 5) |
| Answer first, then a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Illustrative snippets allowed when labelled | DS `08-accessibility.md:65-69` via [DS overview](../../design-system/overview.md#accessibility-project08-accessibilitymd) |
| "doing the thinking" | [strategy, in one screen](../strategy.md#in-one-screen) item 2 |

---

## Fold 3 · Why conversation matters

**Fold job:** give the one reason it matters, credited to conversation, never to Kheelu, with its public source.

**Copy:**

> **H2:** Conversation helps a young brain grow.
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> *(own card, no marker)* Kheelu is built around the same idea: it answers your child, then asks a question back.
>
> You can do it anywhere, too: answer your child, then ask one back.
>
> **Sources**
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts). https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> [Read more: how children learn by talking] → `/stories/how-children-learn-by-talking`

- **H2 accent:** `Mark` underline on "Conversation" (the subject of the promise is conversation, not the toy).
- **No CTA** (strategy: Home CTAs sit at the hero, after fold 2, after safety, and at the close).
- **No image**: a text fold; the imagination layer is not needed here.
- **How the promise is held to D016:** the H2 is the founder-confirmed form ([claims §1](../../product/claims.md#1-confirmed-by-the-founder),
  [D016](../../decisions/D016-brain-wording.md)); its anchor is the marked line directly beneath (same source).
  The marked line is the ready C07 line verbatim, keeping "a caring adult". The company line sits in its own
  card with no marker and no brain word, so no brain claim shares a sentence with Kheelu
  ([source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines)). It is the
  verified C07 company line without its "turns" clause, and it has no pointer back to the Harvard sentence: the
  earlier "more of that back-and-forth" read as Kheelu supplying the caring-adult exchange, which C07's caveats
  and messaging ("never imply Kheelu is the caring adult") rule out (CMO review F1). The house line gives the
  parent something to do (D026).
- **Deliberately not used on Home:** Xu 2022 (a picture book read by a smart speaker: pairing it with Kheelu
  implies the Story-mode questioning D027 rules out); Romeo 2018 (a language line, and the speech disclaimer is
  not on Home, [D025](../../decisions/D025-speech-and-language.md)); NEP 2020's 85% (its ready line belongs in an
  early-years article, never near Kheelu); C05's million-connections estimate (ready, but a second idea in a
  one-idea fold).
- The marker needs a DS pattern that does not exist yet (DS gap [G-18](../../design-system/gaps.md#g-18); open
  question G15). Re-read the Harvard page before publishing: it shows recent edits
  ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

**Sources, fold 3**

| Claim | Source |
|---|---|
| Conversation helps a young brain grow | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) and [§8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors); [D016](../../decisions/D016-brain-wording.md) |
| The Harvard line, verbatim, with marker | [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines), C07 (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C07-harvard-serve-and-return.md` |
| "Kheelu is built around the same idea" | C07 company line, [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines) (its "turns" clause dropped); [voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning) ("built around", not "proven"); [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| Answers, then asks a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| House line | C07 house line, [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines) |

---

## Fold 4 · What is Kheelu? Modes and languages

**Fold job:** answer "what is it, and will it work in our home?": the three modes, Wi-Fi, the languages.

**Copy:**

> **H2:** What is Kheelu?
>
> Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home Wi-Fi, Story mode for stories, poems and jingles with no Wi-Fi needed, and Bluetooth mode, which makes it a speaker for your phone.
>
> **AI mode**
> Open conversation, on your home Wi-Fi. It can't browse the internet.
>
> **Story mode**
> Stories, poems and jingles your child enjoys and learns from. No Wi-Fi needed.
>
> **Bluetooth mode**
> Pair your phone and use it as a speaker.
>
> **Up to 10 languages at launch**
> *(language chips)* English · हिन्दी Hindi · বাংলা Bengali · తెలుగు Telugu · தமிழ் Tamil · ಕನ್ನಡ Kannada · Español Spanish · Français French
> It can switch between them mid-sentence.
>
> [See what each mode does] → `/products/kheelu#modes`

- **H2 accent:** `Hand` on "Kheelu?". The H2 is question-shaped and the paragraph under it is the
  answer-first block (59 words), so it feeds FAQPage JSON-LD with the six questions in fold 8.
- **Behaviour form:** the lead uses the page's one form, "answers your child, then asks a question back" (CMO
  review S6). The AI-mode card no longer repeats it: the mechanism is already in the lead two lines above, and
  fold 4 was the longest fold on phones (CMO mockup pass, M5).
- **Components:** on phones the three modes show as one compact row (`ModeSwitch` as an explainer, icons
  dropped, DS `10-pages.md`; M5), or three `FeatureCard`s on wider screens;
  `LanguageChips` with the eight named languages only. The heading "Up to 10 languages at launch" is the DS's
  own wording (`01-writing.md:23`, numerals for facts) and carries the ceiling, so the DS default "+2 more at
  launch" chip is dropped and no extra chip replaces it (CMO review S5): "up to 10" is a ceiling, not a promise
  of two more. Native scripts need fonts the DS does not ship (gap [G-13](../../design-system/gaps.md#g-13));
  each chip carries its `lang`.
- **Story mode line:** [D027](../../decisions/D027-story-mode-wording.md) verbatim except "No WiFi needed" →
  "No Wi-Fi needed" (DS spelling, `01-writing.md:25`); for the founder at Gate A.
- **No CTA.** Link anchor (`#modes`) is for the Architect to match on the product page.
- **No image:** the mockup dropped fold 4's photo (`ira-01-story-on-the-bed`) to shorten the fold (M5), so
  no alt text is needed. With one photo fewer, the mockup re-checks the DS's per-page cast rule (at least three
  of the five children, each at most twice, `10-pages.md:67`) across the hero, fold 2, fold 5 and the close.

**Sources, fold 4**

| Claim | Source |
|---|---|
| Screen-free plush rabbit that talks; ages 3 to 7; "Kheelu by Kheelona" | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [keyword map §6.1](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B1 (updated) |
| Three modes; AI mode on home Wi-Fi; Bluetooth makes it a speaker for a paired phone | [facts, modes and connectivity](../../product/facts.md#modes-and-connectivity) |
| Cannot browse the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Story mode line; works without Wi-Fi | [D027](../../decisions/D027-story-mode-wording.md); [facts, modes](../../product/facts.md#modes-and-connectivity) |
| Up to 10 languages at launch; the eight named | [facts, languages](../../product/facts.md#languages) (`src/config/site.ts:141-157`) |
| Switches mid-sentence | [facts, languages](../../product/facts.md#languages) (`src/lib/product-facts.ts:70`; D017) |

---

## Fold 5 · What parents see

**Fold job:** show that the parent stays in the loop: what the app shows, what is kept, and for how long.

**Copy:**

> **H2:** You see every conversation.
>
> - Read every conversation in the parent app, word for word.
> - Every week, the app gives you a report on four thinking skills (words, reasons, stories and questions) and a new-word count.
> - You set your child's age in the app, and the age-graded safety layer follows it.
> - Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> *Illustrative screen* (label on the app image)
>
> [See what the app shows you] → `/products/kheelu#app`

- **H2 accent:** `Hand` on "every conversation".
- The report is described as what it shows, never as an outcome for the child; no age-by-age claims, no
  "progress" or "growth" words ([D036](../../decisions/D036-launch-feature-claims.md); legal review L7).
- The retention line is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s, verbatim.
- Not used: parent alerts and the daily summary (wait on counsel's DPDP reading, L6:
  [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)); "remembers"
  (confirmed, but a second idea here).
- **No Kheelona+ line in this fold** (Gate A round 2, [D041](../../decisions/D041-gate-a-round-1.md) F7). The
  round 1 draft had "The parent app is part of Kheelona+, included for 6 months with every Kheelu." here (CMO
  review S10). The founder asked not to discuss what happens after the six months "at most places", so the page's
  one Kheelona+ mention now sits at the close, where the offer is listed. The legal review's L7 risk (the parent
  app is part of Kheelona+, so this fold's H2 and the 36-month line assume it stays available) is recorded in D041
  and accepted by the founder.
- **No CTA.**
- **Images:** the DS phone frame (`kh-device`) with a weekly-report screen, labelled "Illustrative screen".
  Do not use `AppSummaryCard` as delivered: its "Today with Kheelu" framing implies a daily summary, which is
  not cleared (L6). Alt for the frame: "An illustrative parent-app screen showing a weekly report on four
  thinking skills." Optional photo `tara-02-evening-with-amma`. Alt: "A girl and her mother on a sofa in the
  evening lamp light, with Kheelu between them."

**Sources, fold 5**

| Claim | Source |
|---|---|
| Read every conversation; word for word | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [facts, parent app](../../product/facts.md#parent-app) ("the full conversation log word for word", live) |
| Weekly report on four thinking skills; new-word count | [D036](../../decisions/D036-launch-feature-claims.md) #1, #8; skill names: [messaging, hierarchy](../../brand/messaging.md#the-hierarchy) ("the model parents repeat", EXTERNAL as what the report covers) |
| Parent sets the age; the age-graded safety layer follows it | [D036](../../decisions/D036-launch-feature-claims.md); wording from [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) ("say instead") |
| 36 months, deleted automatically; delete sooner in one tap | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7, verbatim line; [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
---

## Fold 6 · Safety you can check

**Fold job:** answer "is it always listening, where does the voice go, can I check?" with facts in the founder's order.

**Copy:**

> **H2:** Safety you can check.
>
> **1 · You'll always see when it's listening.**
> Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it's listening. Left alone, it hears nothing and sends nothing.
>
> **2 · How it understands and answers.**
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **3 · You can read every conversation.**
> In the parent app. Delete any of them in one tap.
>
> **4 · We don't sell your data.**
> Your child's data is never used to advertise to them.
>
> **Three more facts:**
> - No camera.
> - It can't browse the internet.
> - It says it's a toy, and never asks your child to keep a secret from you.
>
> **[Pre-order Kheelu]** + compact CTA block
>
> [See how we built safety in] → `/safety`

- **H2 accent:** `Hand` on "check". "Safety" as a noun; the word "safe" appears nowhere in the copy.
- **Order is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s:** button and light → providers line
  → read and delete → no sale. Component: `TrustList` (one column on phones). Item 1 is
  [D018](../../decisions/D018-wake-up-button.md)'s heading and body sentences verbatim, with "Kheelu" in the
  heading replaced by "it" (density) and D018's opening sentence about a wake word left out (open question 8).
  It ends with D018's off-state sentence, "Left alone, it hears nothing and sends nothing.", so the fold
  answers "is it always listening?" in words (CMO review S1); the sentence is about the off state only and
  says nothing about what is kept once a conversation starts (conversations are kept for parents, D017, D020).
  Item 2's heading, "How it understands and answers.", names only the reply path the body covers (it echoes
  the body's opening, "To understand and answer your child"). The earlier "Where your child's voice goes"
  promised the voice's whole journey, which under [D035](../../decisions/D035-model-training-opt-out.md) also
  includes Kheelona's own model, and so implied nobody else keeps or trains on it (CMO review F2). Item 2's
  body is D020's providers line in full, verbatim; its training clause is scoped to the providers, as D035
  requires (open question 4). Nothing on the page mentions training otherwise, and nothing says "nothing is
  ever recorded", "no risk" or that the microphone is disconnected.
- Item 3 repeats fold 5's read-and-delete fact on purpose: D020 puts it in the safety block, and the block is
  reused on the product page.
- **CTA:** Pre-order Kheelu, `cta` = `safety` (new). Secondary link uses the DS's own second action
  (`01-writing.md:53`); suggested `safety-learn` (new, optional).
- **Image:** `kheelu-belly-module.png` (derivative; DS: "the belly unit (speaker, light ring, buttons)"). Alt:
  "Kheelu's tummy unit up close, with its speaker, light ring and buttons." No imagination layer on a safety
  block (DS `02-imagery.md:57`). The DS has no photo of the light lit yet (Kheelu README), so the copy never
  describes what the light looks like.

**Sources, fold 6**

| Claim | Source |
|---|---|
| Microphone on only after a press of the wake-up button; on while the child talks; off after about a minute of quiet; a light shows; left alone, it hears and sends nothing | [D018](../../decisions/D018-wake-up-button.md) (draft lines, including the body's last sentence); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Trusted providers, servers in India, reply only, keep nothing, never train, by contract | [D019](../../decisions/D019-voice-providers.md), [D020](../../decisions/D020-provider-terms-and-no-sale.md) items 1-4, 6; scoped per [D035](../../decisions/D035-model-training-opt-out.md) |
| Read every conversation; one-tap delete | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 5 |
| Never used to advertise to your child | [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| No camera; says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| Cannot browse the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| Belly unit has a speaker, light ring and buttons | DS `assets/Kheelu/README.md` |

---

## Fold 7 · Compared by category

**Fold job:** place Kheelu among what families already use, by kind of product, never by brand.

**Copy:**

> **H2:** Other AI gives answers. Kheelu asks questions.
>
> Thinking out loud, not tapping on a screen.
>
> | | Puzzles and activity books | Learning apps and videos | Smart speakers and chatbots | Kheelu |
> |---|---|---|---|---|
> | Screen-free | Yes | No | Varies | Yes |
> | Holds a back-and-forth conversation | No | Rarely: mostly tapping and watching | Yes | Yes |
> | Asks your child a question back | No | Some ask quiz questions | Usually just answers | Yes, after it answers |
> | You can read every conversation | Nothing to read | Nothing to read | Varies | Yes, in the parent app |
>
> *Caption:* Kinds of products, not brands: what each one usually does.
>
> [How to choose an AI toy] → `/ai-toys-for-kids-in-india`

- **H2 accent:** `Hand` on "asks questions". The H2 and the lead are messaging's two EXTERNAL comparison lines.
  If the founder picks a contrast line as the H1 at Gate A, this H2 changes.
- `ComparisonTable`, `usIndex` = 4. Cells starting "Yes" or "No" get a tick or a cross; "Nothing to read",
  "Varies" and the hedged cells deliberately start with neither, so a category is never marked down for a row
  that does not apply to it. Smart speakers and chatbots get their tick for conversation: the table stays fair.
- The category cells are plain descriptions with no brand, price or research figure; no public source is cited
  for them, so the CMO Reviewer checks each for fairness (gap list).
- On phones the table scrolls sideways and its scroll area is not keyboard-focusable (DS gap
  [G-05](../../design-system/gaps.md#g-05), High): a stacked phone variant is open question G11.
- **No CTA** (strategy §3.3). If the founder wants one here, as production had, it takes `cta` = `compare`.
  The link to the buyer's guide is an internal link; suggested `compare-learn` (new, optional).
- **No image.**

**Sources, fold 7**

| Claim | Source |
|---|---|
| "Other AI gives answers. Kheelu asks questions." | [messaging, taglines](../../brand/messaging.md#taglines-and-hero) (EXTERNAL; "other AI" is a category) |
| "Thinking out loud, not tapping on a screen." | [messaging, against the alternatives](../../brand/messaging.md#against-the-alternatives) (EXTERNAL) |
| The four categories, no brands | [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (Home row); [messaging, words to stop using](../../brand/messaging.md#words-to-stop-using) (no competitor names) |
| Kheelu column: screen-free; conversation; asks back; read every conversation | [messaging, proof points](../../brand/messaging.md#proof-points) #1; [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |

---

## Fold 8 · Questions parents ask

**Fold job:** answer the six questions left after folds 1 to 7, near the close, in 40 to 60 words each.

**Copy:**

> **H2:** Questions parents ask.
>
> **Won't an AI toy make my child think less?**
> That's exactly what Kheelu is designed against. Most AI gives answers. Kheelu answers your child, then asks a question back, so they do the thinking. It can't browse the internet, and when it doesn't know something, it says so instead of guessing. You can read every conversation in the parent app.
>
> **What ages is Kheelu for?**
> Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. When you set it up, you enter your child's age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.
>
> **How much is Kheelu, and how does the advance work?**
> Kheelu is ₹4,999`{price-source}` (incl. GST) for the first 500 units`{price-source}`, with delivery anywhere in India included. Its MRP is ₹7,999`{price-source}` (incl. of all taxes). A refundable ₹499`{price-source}` advance reserves yours today, and the remaining ₹4,500`{price-source}` is due before delivery. You can pay by UPI, card or net banking, and you get a GST invoice.
>
> **What if it isn't right for us?**
> Return it within 7 days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free. Once it reaches us and qualifies for return, your refund reaches you within 7 working days. Until we dispatch it, everything you've paid is refundable in full.
>
> **When will my Kheelu arrive?**
> Deliveries start mid-November`{delivery-source}`. Pre-orders are served first, in the order they were placed, and you get a tracking link when it leaves us. Delivery is included anywhere in India, with nothing to pay at the door. We don't ship outside India. A reserved Kheelu is sent once the rest of the price is paid.
>
> **Is Kheelu the same as Lumi?**
> Yes. Kheelu is the toy that was called Lumi until 5 September 2026: the same product from Kheelona, with a new name. You may still see the old name on some older listings. A toy sold as Lumi by any other company is a different product, and Kheelona does not make it.
>
> [See all questions] → `/products/kheelu#faq`

Word counts: 51 · 58 · 54 · 55 · 54 · 52 (age and price answers updated in Gate A round 2; the age answer's 3-year-old
sentence and the returns answer's refund timing changed in task 7.1b, see [Changes after approval](#changes-after-approval-task-71b)).

**Full mode**, the price question becomes:

> **How much is Kheelu?**
> Kheelu is ₹7,999`{price-source}` (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November`{delivery-source}`. If it isn't right for your family, you can return it within 7 days of delivery, no questions asked. (54 words)

- **H2 accent:** `Hand` on "ask".
- `FAQ` component, all items closed (DS: first item open on safety pages only). These six plus fold 4's
  "What is Kheelu?" make the FAQPage JSON-LD, with answers exactly as shown.
- **Order:** "See all questions" follows the six questions, on phones too (CMO mockup pass, M7; the mockup had
  placed it above the list).
- **Why these six:** the top objection (thinking less), fit (age), price and the advance, risk (returns),
  timing (delivery), and the Lumi entity question the keyword map wants on Home. Wi-Fi, languages, listening,
  data and the subscription are answered in folds 4 to 6 and 9, so no answer appears twice. The CMO review's
  S12 (swap the Lumi question for "Will my child still use it after the first week?") was declined: Lumi is
  Home's keyword-map secondary (BRD-2, [keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13))
  ([strategy §2](../strategy.md#2-the-parents-journey-and-objections)). No speech or language question on Home
  ([D025](../../decisions/D025-speech-and-language.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 10).
- The price answer is machine-read, so it leads with ₹4,999 (incl. GST) and gives the advance second
  ([D028](../../decisions/D028-price-wording.md)). It states the first-500 term once, as an offer term, never as a
  count, badge or counter ([D041](../../decisions/D041-gate-a-round-1.md)), and names the MRP once in
  [D034](../../decisions/D034-origin-manufacturer-mrp.md)'s wording, with no strike-through (D034's copy note). The
  round 1 closing sentence ("After the first 500, it is ₹7,999 (incl. GST), paid in full.") is gone: it was a second
  mention of the term. The build renders the MRP from its own value if one is added; today it equals `FULL_PRICE`
  ([pricing, MRP](../../product/pricing.md#tax-delivery-mrp)).
- The age answer advises a grown-up nearby for 3-year-olds ([D041](../../decisions/D041-gate-a-round-1.md)), in the
  one plain sentence chosen for the site's age-3 advice ("If your child is 3, keep a grown-up nearby."; CMO built-page
  review A, M8; task 7.1b). It still makes no claim about how well Kheelu understands a 3-year-old (G5).
- The returns answer's refund timing is `/refund`'s, word for word: the refund "reaches you within 7 working days"
  of the return reaching us, bank time included ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md)
  item 5; [D056](../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md) item 4).
- **No CTA:** the close follows directly. Link: suggested `faq-more` (new, optional).

**Sources, fold 8**

| Answer | Source |
|---|---|
| Thinking less | [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 (EXTERNAL); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) (browse, read); [D036](../../decisions/D036-launch-feature-claims.md) #3 (says it doesn't know rather than guess) |
| Ages | [facts, age](../../product/facts.md#age); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) ("3 to 7; not for under 3"); [D036](../../decisions/D036-launch-feature-claims.md) #6 and the age setting; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (every reply passes the layer); [D041](../../decisions/D041-gate-a-round-1.md) (a grown-up nearby for 3-year-olds); the sentence's wording: [CMO built-page review A](../../qa/cmo-review-built-a-2026-10-14.md) M8 (one wording on every page) |
| Price and advance | [pricing](../../product/pricing.md) (amounts, first 500, delivery included); [D041](../../decisions/D041-gate-a-round-1.md) (first 500 once, no badge or counter); [D034](../../decisions/D034-origin-manufacturer-mrp.md) (MRP ₹7,999 incl. of all taxes); [D028](../../decisions/D028-price-wording.md); [D024](../../decisions/D024-payment-methods-gst.md) (methods, GST, invoice); [keyword map §6.2](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B3 |
| Returns | [D021](../../decisions/D021-returns-policy.md) (policy line; "of delivery" is D021's reading); [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md) (pickup free, refund within 7 working days of reaching us); [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 5 (the refund reaches the parent within those 7 working days, bank time included) and [D056](../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md) item 4 (worded "reaches you within 7 working days", as [refund.md](refund.md) step 3); [policies](../../product/policies.md#status-at-a-glance) (refundable in full before dispatch) |
| Delivery | [D023](../../decisions/D023-new-order-delivery.md); [facts, ship date](../../product/facts.md#ship-date) (served in order placed); [policies](../../product/policies.md#status-at-a-glance) (shipping: anywhere in India, included, nothing at the door, no shipping abroad, tracking link, reserved units dispatch once the balance is paid) |
| Lumi | [facts, identity](../../product/facts.md#identity) (renamed 2026-09-05; EXTERNAL in this answer); [keyword map §6.1](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B2 |

---

## Fold 9 · Close (OfferCard)

**Fold job:** put everything a parent needs to say yes in one place: what comes with it, the price, the button, the risk reversal, a person to ask.

**Copy:**

> **H2:** What you get, and what you pay.
>
> **OfferCard**
> - product: Kheelu
> - price: ₹4,999`{price-source}` incl. GST
> - deposit / balance: ₹499`{price-source}` today, refundable · ₹4,500`{price-source}` before delivery
> - shipDate: Deliveries start mid-November`{delivery-source}`
> - perks:
>   - In the box: Kheelu plush toy, charger and quick-start card
>   - Delivery anywhere in India, included
>   - A GST invoice with every order
> - cta: Pre-order Kheelu
> - fine: Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> Questions? WhatsApp or call +91 91875 46483

- Section id `close` (available as an anchor; fold 5 no longer links here, CMO review S10).
- **H2 accent:** `Hand` on "what you pay". No price in the heading: the DS template's "Reserve yours for ₹499"
  would put ₹499 in a sentence without the total ([D028](../../decisions/D028-price-wording.md)).
- **CTA:** Pre-order Kheelu, `cta` = `finale` (existing value; this is the page's close, the FinaleCTA position).
- **OfferCard settings:** `sticker` = false (no "First 500" burst); `was` unset (no strike-through, no MRP
  beside the launch price on Home: [D034](../../decisions/D034-origin-manufacturer-mrp.md)'s copy note);
  `unitsLeft` and `unitsTotal` never set (the count is never published, DS gap
  [G-08](../../design-system/gaps.md#g-08)). `fine` takes a string only, which suits the price sentence (no
  marker needed). The designer checks that the card's own deposit wording keeps "refundable" next to ₹499.
- **Full mode:** the OfferCard cannot show a paid-in-full offer (G-08, G9). Until G9 is decided, a composed
  block replaces it: price "₹7,999`{price-source}` (incl. GST)", the full-mode price sentence, the same perks,
  the Kheelona+ line, the button, the trust row and the help line.
- **The Kheelona+ line** is the first sentence of [D027](../../decisions/D027-story-mode-wording.md)'s line,
  verbatim, and the page's only Kheelona+ mention. Its other two sentences ("Kheelu's smart features keep working
  for life, with no subscription needed." and "Kheelona+ pricing will be announced soon.") are dropped: both discuss
  what happens after the six months, which the founder asked to leave out ([D041](../../decisions/D041-gate-a-round-1.md),
  F7). "6 months" stays so the line cannot read as included for good (round 2, question 4).
- **Box contents** are the founder's list ([D041](../../decisions/D041-gate-a-round-1.md)). The charger's BIS
  registration number belongs in the product page's declarations, not here.
- **Order on phones:** the OfferCard comes first, then the board. With the board first, the price started
  about 430 px into the fold (CMO mockup pass, M6).
- **Image:** `advik-03-studio-hug` (DS: "child-with-product cut-out, ads on colour blocks"). Alt: "A boy in a
  red polo T-shirt hugging Kheelu against a cream background." If the board repeats the hero's stickers, the
  CMO's alternative is the DS offer picture `kheelu-on-fur.jpg` after the card (M6). Its alt: "Kheelu by
  Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy."

**Sources, fold 9**

| Claim | Source |
|---|---|
| Price, advance, balance, price sentence | [CTA block sources](#cta-block); [pricing](../../product/pricing.md) |
| In the box: Kheelu plush toy, charger and quick-start card | [D041](../../decisions/D041-gate-a-round-1.md) (founder, 2026-10-11); [facts, in the box](../../product/facts.md#in-the-box) (specs otherwise still F4) |
| Delivery included anywhere in India | [pricing, tax, delivery, MRP](../../product/pricing.md#tax-delivery-mrp) |
| GST invoice with every order | [D024](../../decisions/D024-payment-methods-gst.md) |
| Kheelona+ line (first sentence only) | [D027](../../decisions/D027-story-mode-wording.md); [D041](../../decisions/D041-gate-a-round-1.md) (F7: nothing about after the six months); [facts, Kheelona+](../../product/facts.md#kheelona) |
| Trust row, help line | [CTA block sources](#cta-block) |

---

## Footer

**Fold job:** the seller's legal identity, the policies and a way to complain, on every page.

Referenced, not rewritten:
- **Seller block:** rendered from the single seller source, as published
  ([policies, seller details](../../product/policies.md#seller-details-as-published)).
- **Grievance line:** a link to `/contact`, where the [D032](../../decisions/D032-grievance-block-and-call-line.md)
  block lives ([strategy §4.4](../strategy.md#44-navigation)).
- **Columns:** Kheelu (Meet Kheelu, Safety, Setup) · Read (Stories, buyer's guide) · Help (Contact, Shipping,
  Refunds, Terms, Privacy) ([strategy §4.4](../strategy.md#44-navigation)).

New copy for two `Footer` props:

> **promise:** Press to talk. No open internet. You read every conversation.
>
> **made:** Designed by parents in Bengaluru. Made in India.
>
> **support:** WhatsApp or call +91 91875 46483 · hello@kheelona.com

- The DS default `promise` ("Wake-word listening. No open internet. You see everything.") is banned
  ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 18) and must not ship.

| Claim | Source |
|---|---|
| "Press to talk" | [D018](../../decisions/D018-wake-up-button.md) short line |
| No open internet | [facts, internet and camera](../../product/facts.md#internet-and-camera) ("Open internet: No", EXTERNAL); DS `01-writing.md:35` |
| You read every conversation | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| Designed by parents in Bengaluru | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) (EXTERNAL) |
| Made in India | [D034](../../decisions/D034-origin-manufacturer-mrp.md) |
| Support channels | [facts, support channel](../../product/facts.md#support-channel); [D032](../../decisions/D032-grievance-block-and-call-line.md) |

---

## Keyword placements

Primary cluster for `/`: **Kheelu by Kheelona** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)).

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules); [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)) | Met | Where |
|---|---|---|
| Title ≤ 60 characters, primary near the start | Yes | 54 characters, primary first (a brand page, so brand first) |
| Meta ≤ 155 characters: primary, one concrete fact, ₹4,999 (incl. GST) before the advance | Yes | 150 (token) / 147 (full); age band and the mechanism as facts |
| One H1, carrying "Kheelu" | Yes, unless H1-2 is chosen | Round 2: H1-1, H1-3, H1-4 and H1-5 carry it; H1-2 does not (founder's OK needed, round 2 question 2) |
| Primary in the first paragraph | Yes with Sub B; split with Sub A | Sub B (H1-2) opens "Kheelu by Kheelona". With Sub A, "Kheelu" is in the H1 and "by Kheelona" opens the sub-line; title and meta carry the primary verbatim, which meets [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow) (round 2 question 3) |
| Primary in an answer-first block in the first ~100 words | Partly | The sub-line is word 12 of the page's main text; the answer-first block with the primary is fold 4 ("What is Kheelu?"), below the first ~100 words |
| "3 to 7" once in the first screen | Yes | Age chip |
| An H2 with the primary or a close variant ("What is Kheelu?") | Yes | Fold 4 H2 |
| Alt text carries the primary only where true | Yes | Hero product image alt; OG image alt |
| Descriptor "a screen-free plush toy that talks" (SV-2) | Yes | Title, verbatim; sub-line and fold 4 near-verbatim |
| Secondary: "Is Kheelu the same as Lumi?" | Yes | Fold 8, question 6 |
| Secondary: "screen-free", price | Yes | Sub-line, fold 4, fold 7; price in meta, CTA block, fold 8 |
| Answer-first blocks, 40 to 60 words | Yes | Fold 4 (59) and six FAQs (49 to 58) |
| Entity facts identical: "Kheelu by Kheelona", 3 to 7, ₹4,999 (incl. GST) first in machine text, no mention of the unrelated "Kheelona India" | Yes | Title, meta, sub-line, fold 4, fold 8; "made in India" in the footer |
| Words never placed as keywords (health terms, friend, tutor, brain-development toy, lessons, adapts, wake-word lines, competitor names, free for life) | Yes | None on the page |
| Density: "Kheelu" ≤ 2% of `<main>` words | Just over the flag line | About 29 of about 1,345 words (2.2%) with variant (b), after the CMO fixes (fold 5's Kheelona+ line adds one); about 2.3% with the films (their live captions name Kheelu). Below the 3% rewrite line. Already cut: "it" in FAQ answers, the safety headings, the close heading. QA re-measures on the built page |

---

## CTA tracking values

Existing values stay on equivalent buttons ([tracking inventory §6](../tracking-inventory.md); G10 maps them).

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav | Pre-order Kheelu | `navbar` | Existing |
| Phone drawer | Pre-order Kheelu | `navbar-mobile` | Existing |
| Hero | Pre-order Kheelu | `hero` | Existing, same position |
| Fold 2 (belief) | Pre-order Kheelu | `see-it-ask` | New |
| Fold 6 (safety) | Pre-order Kheelu | `safety` | New |
| Fold 9 (close, OfferCard) | Pre-order Kheelu | `finale` | Existing, same position |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (the mid version's name for the same bar) |
| Fold 7 | none; reserved if a store CTA is added | `compare` | Existing |
| Secondary links (optional) | See how it works · See what else it does · See how we built safety in · How to choose an AI toy · See all questions | `hero-learn` · `see-it-ask-learn` · `safety-learn` · `compare-learn` · `faq-more` | New, optional |

`home-arc` (production's growth-arc section) has no equivalent on the new Home; it is left unused rather
than repurposed (G10).

---

## Placeholders

None. The one placeholder (the box contents in the OfferCard) was filled from the founder's list in Gate A round 2
([D041](../../decisions/D041-gate-a-round-1.md)). No claim on the page lacks a source.

---

## Open questions

Each with options and a recommendation. Gate A items are marked.

**Status after the founder's round 1 answers (2026-10-11, [D040](../../decisions/D040-films-move-to-new-site.md),
[D041](../../decisions/D041-gate-a-round-1.md)):** 1 all rejected; new options in
[Gate A round 2](#gate-a-round-2-2026-10-11). 2 (d) chosen. 3 (a) chosen: the films, with the founder's film 6
caption. 4 (a) kept. 5 the founder: say nothing about after the six months at most places (applied in folds 5 and
9). 6 filled from the founder's box list. 7 (a), once in the price answer. 10 (a). 12 Myra may appear on her own.
8, 9 and 11 are unchanged. The round 2 questions are listed in that section.

1. **The hero H1 (Gate A, D038).** Options A to E in [fold 1](#fold-1--hero). **Recommend A**, "Your child asks
   why. Kheelu asks back."; B if A pushes the micro-line out of the first screen at 360 px.
2. **The price sentence (Gate A, D028).** (a) The first draft: "Reserve yours for ₹499 today, refundable until
   dispatch, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST) before delivery." (21 words);
   (b) the CTO's one-sentence form on [messaging](../../brand/messaging.md#confirmed-candidate-lines)
   ("Reserve Kheelu for ₹499 today, refundable, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST)
   before delivery.", 19 words); (c) D028's own two-sentence draft, which breaks its same-sentence rule;
   (d) the CMO's: "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery:
   ₹4,999 in total (incl. GST)." (18 words). (d) reads as a timeline (today, before delivery, total) and meets
   every D028 condition: ₹499 first, "refundable" beside it, the remainder before delivery, the total with
   "incl. GST" in the same sentence. The CMO prefers (d) beside every inline CTA and rates (a) fine; (c) should
   not go forward. **Recommend (d)**, with the CMO: the same facts as (a) in three fewer words, which eases the
   360 × 590 fit. The page and the mockup now show (d) everywhere the token-mode sentence appears (CTA block,
   hero, compact blocks, OfferCard `fine`, drawer note); (a) stays the alternative. The sentence is one content
   value, so going back to (a) is one change.
3. **The films in fold 2 (Gate A, G3).** (a) Use the seven films, once a consent record is seen and the captions
   are re-exported without em dashes, with film 6's caption rewritten; (b) use the illustrative exchange;
   (c) films, with the exchange kept for the product page. **Recommend (a)**, with (b) shipping if G3 is not
   cleared by the mockup. The founder also confirms film 6's new caption against the film. Films 3
   (`a-parent-speaks`) and 7 (`a-father-speaks`) are parents speaking to camera, so what they say is published
   copy too: their words must stay within [claims](../../product/claims.md) (no outcome promised for the child,
   nothing retired or banned), checked against the films before G3 clears (CMO review).
4. **The providers line's training clause on Home (D020, D035).** (a) Keep D020's line verbatim, its "they never
   use it to train their AI" scoped to the providers, as D035 directs; (b) drop that clause on customer pages,
   removing the misleading-by-omission risk D035 records, while every remaining word stays true.
   **Recommend (a)**, as the decisions stand; the founder may prefer (b) once he sees it on the page beside a
   training disclosure that lives only on `/terms` and `/privacy`. **CMO view: (b)**, dropping only "and they
   never use it to train their AI" on customer pages and keeping "They process your child's voice only to
   produce Kheelu's reply. They don't keep it. Our contracts with them say so.": a parent will generalise the
   clause to "my child's voice is not used to train AI", which D035 makes false for Kheelona's own model. Item
   2's new heading (CMO F2) applies either way. The founder's call ([D015](../../decisions/D015-founder-signs-off-copy.md)).
5. **What keeps working after the six months of Kheelona+ (Gate A, F7).** Fold 4 (Story mode content,
   languages) and fold 5 (the parent app, "You see every conversation") describe Kheelona+ features; the legal
   review (L7) says the site must say what stops. (a) Ship the sanctioned line only, as drafted; (b) the founder
   decides F7 and one line is added under the Kheelona+ line at the close. The CMO wants F7 decided **at Gate
   A, not Gate B**, because five lines assume the parent app stays available: fold 5's H2 ("You see every
   conversation"), the 36-month retention line, fold 6 item 3, fold 7's last row and the footer promise. If the
   app lapses at month 6 without a subscription, all five become misleading. **Recommend (b), decided at Gate
   A**, with the CMO. Until then, fold 5's plain line ("The parent app is part of Kheelona+, included for 6
   months with every Kheelu.") keeps the 6-month condition beside the claim.
6. **Box contents (F4).** (a) Fill the placeholder once specs are signed off; (b) the perk reads "The plush
   toy" only. **Recommend (b) for the mockup, (a) when F4 lands.**
7. **The first-500 term on Home.** (a) State it once, in the price answer (an offer term that matches the
   entity fact in [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) and tells a parent the price
   rises); (b) leave it to the product page. **Recommend (a)**, never as a badge, sticker or counter.
8. **"No wake word" on Home.** D018's drafts open with "Kheelu has no wake word, so it never listens for one."
   (a) Leave the phrase off Home: the button lines say everything, and the new site's guard list matches
   "wake word" ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)); (b) restore the
   sentence with a guard exception. **Recommend (a).**
9. **Founder wording points in D027's Story-mode line.** "No WiFi needed" rendered "No Wi-Fi needed" (DS
   spelling); "enjoys and learns from" kept as written, though it leans towards the learning-outcome language
   L7 warns about. **Recommend:** Wi-Fi spelling yes; keep "learns from" (the founder's own words).
10. **The sticky bar's price order (strategy §3.4, flagged for D028; Gate A).** Now drafted in D028's order:
    (a) price "₹499 today", note "refundable · ₹4,999 total (incl. GST)" (applied after the CMO review);
    (b) the strategy and DS order, price "₹4,999 (incl. GST)" with the note "₹499 today, refundable", which
    meets D028's purpose but not its letter (₹499 first beside a CTA), so the founder would have to accept the
    departure explicitly. **Recommend (a)**, as applied; the mockup confirms it fits at 360 px beside the full
    label.
11. **The help line's calls (D032).** The number must answer calls before this copy goes live. Not a choice; a
    dependency for the founder before Gate B.
12. **A 3½-year-old in the hero photo (G5).** SKM's "never show 3-year-olds alone in ads" may or may not survive
    the 3 to 7 band. (a) `myra-01-breakfast-why` (the DS's "why" photo, matches the H1); (b)
    `advik-02-whispering-to-kheelu` (age 4). **Recommend (a) if G5 drops the rule, else (b).**

---

## Gaps and notes for the next steps

- **Source markers** need a DS pattern (gap [G-18](../../design-system/gaps.md#g-18), open question G15): an
  inline marker with a 48 px tap area and a "Sources" note in `kh-body-s`. Home needs one (fold 3).
- **The Harvard page** must be re-read before publishing ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).
- **Category cells in fold 7** have no public source; they are plain descriptions for the CMO Reviewer to
  check for fairness.
- **DS components to adjust by composition, not by editing the DS:** `LanguageChips` with the eight named
  chips only (no "+2 more at launch" chip; the heading carries "Up to 10"); `AppSummaryCard` avoided (daily-summary framing); `OfferCard` `sticker` off and no counter; `Footer`
  `promise` replaced; `ComparisonTable` stacked phone variant (G-05, G11); sticky bar stepping aside beside
  inline CTAs (G-09, G4).
- **Two chilli buttons on laptop** (nav plus hero) is G2 / G-06, decided at Gate A.
- **The illustrative app screen** for fold 5 needs a weekly-report screen; the DS renders folder has
  parent-app screens to check against before drawing anything new.
- **Speech disclaimer** is deliberately absent from Home ([D025](../../decisions/D025-speech-and-language.md)).
- **Production is untouched** until Gate B ([D011](../../decisions/D011-production-held-until-gate-b.md)): this
  copy is for the new site only.

---

## Changes after approval (task 7.1b)

Two lines of the Gate A-approved copy ([D046](../../decisions/D046-gate-a-approved.md)) change, both in fold 8; every
other word stands as approved. The frozen mockup (`mockup/home.html`) is not edited: the builder carries the two
lines into `src/content/en-IN/faqs.ts` (ids `what-ages`, line 41, and `not-right-for-us`, line 54), and the main
session adds the text-parity deviation rows under the `home` key. The FAQPage JSON-LD and `llms.txt` read the same
answers, so they change with them.

- **Fold 8, "What if it isn't right for us?"** "your refund is processed within 7 working days" becomes "your refund
  reaches you within 7 working days": the money reaches the parent within 7 working days of the return reaching us,
  bank time included, as `/refund` step 3 says it ([D056](../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md)
  item 4; [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 5; [refund.md](refund.md)
  step 3). Same promise, no new claim; still 55 words.
- **Fold 8, "What ages is Kheelu for?"** "For 3-year-olds, we advise having a grown-up nearby." becomes "If your child is 3,
  keep a grown-up nearby." ([CMO built-page review A](../../qa/cmo-review-built-a-2026-10-14.md) M8: the age-3 advice
  is worded five ways; one plain sentence everywhere, never "we advise play"). The advice is still D041's; the band
  stays 3 to 7, and the sentence before it still says Kheelu is not a toy for children under 3. 57 → 58 words.
- **Why this sentence and not the review's example.** M8's example, "If your child is 3, keep a grown-up nearby while
  they play." (12 words), would take three of the FAQ answers it names over the 60-word answer guard
  (`test/guards/answer-length.test.ts`): Home 61, the product page 62 (`faqs.ts:86`), the buyer's guide 61
  (`faqs.ts:174`). The 9-word sentence is the example's own opening, the same words 12 journal guides already print
  before "while they play" (for example [story-should-kids-use-ai.md](story-should-kids-use-ai.md)), and it fits every answer M8 names: Home 58, product 59, `/safety` 47 (`faqs.ts:125`,
  before its M4 change), guide 58. `faqs.ts:151` is a list item in the `/safety` detail ("At 3: …"), not an
  answer-first block.
- **Not changed on this page.** The other M8 lines (`faqs.ts:86`, `:125`, `:151`, `:174`, `pages/setup.ts:101`) are
  copy on [meet-kheelu.md](meet-kheelu.md), [safety.md](safety.md), [ai-toys-for-kids-in-india.md](ai-toys-for-kids-in-india.md)
  and [setup.md](setup.md), not on Home. The historical record of Gate A round 2 (the table "Mockup edits for the
  founder's other answers", row d) keeps the words as they were applied then. [terms.md](terms.md) section 9 still
  prints Home's approved age sentence; whether it follows is a question on that page.
- **Notes updated to match:** fold 8 word counts, the age-answer and refund notes under fold 8, and the Ages and
  Returns rows of its sources. Title, meta, H1, H2s, CTAs and keyword placements are unchanged (FAQ answers still
  51 to 58 words, inside the 40 to 60 rule).
- **Wave 8 merge (main session, 2026-10-14).** The CMO's copy review of task 7.1b (minor 2) carried the same sentence
  to the product page's FAQ 3 and the buyer's guide's age answer, so every FAQ answer M8 names now says it one way. Its
  minor 5: fold 7's sources line on this page now prints the short form that `mockup/home.html:187` and
  `src/content/en-IN/pages/home.ts:157` already show (the dropped locator was a research note, kept in
  [source verification](../../research/source-verification.md)); no page text changes.
