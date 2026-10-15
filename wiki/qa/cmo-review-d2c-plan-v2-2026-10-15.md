---
title: "CMO review: the D2C conversion plan v2 (selling copy, page by page)"
type: qa
updated: 2026-10-15
sources:
  - ../site/d2c-conversion-plan-2026-10-15.md (v2, read in full, lines 1-1117)
  - ../decisions/D064-quick-batch-2-landing-page-and-motion-2026-10-15.md (items 1-11)
  - ../decisions/D065-selling-site-founder-answers-2026-10-15.md (items 1-8)
  - "The main session's nine rulings of 2026-10-15 and the claims guard's results (376 lines checked, 3 failures), relayed in this review's task text"
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6 CMO Reviewer)
  - ../brand/positioning.md, ../brand/messaging.md (taglines, against the alternatives, words to stop using, CTA labels), ../brand/voice.md (rules 1, 6, 8), ../brand/audience.md (objections, buying triggers)
  - ../site/strategy.md ("In one screen", §2, §3.2-3.4), ../site/content-boundary.md
  - ../product/claims.md (§1, §4 including the D058 and D061 rows, §6, §8), ../product/facts.md (Languages), ../product/legal-requirements.md (§3 dark-pattern checks, ECOM-08, LM-02)
  - ../decisions/D009, D016, D017, D018, D021, D023, D028, D041, D050, D054 (item 16), D058 (items 1-3, 7), D061
  - ../engineering/tasks.md (Q2.1, Q2.2, Q2.5, Q2.7, Q2.8)
  - design-system/project/03-cast.md (lines 1-5), tokens.css (lines 115-133) (read-only)
  - "src/content/en-IN at 90d1f36e: cta.ts (lines 36, 45), offer.ts, trust.ts, faqs.ts, films.ts, share.ts, policies.ts, legal/refund.ts (anchors before-dispatch, returns)"
  - "test/guards/banned-phrases.data.ts: findBanned run on the plan's flagged lines and on every replacement proposed here (all clean; part-price-button fires only when the button label and the price line are joined with a space)"
  - "Screenshots, Playwright 1.63.0 Chromium, 1x, viewport only: the plan's exact hero words injected into today's built Home and product heroes (local next-server 16.3.8 on port 3484), with the DS photo kabir-02-block-rocket-web.webp as a full-width 16:9 picture: ../raw/qa/2026-10-15/cmo/plan-v2/*.png"
---

# CMO review: the D2C conversion plan v2

> Review only. Nothing here changes the plan or the site. Only the founder signs copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)); the CMO's verdicts never replace the founder's. Fixes that
> change one of the main session's rulings are marked "ruling", because only the main session can amend its own
> rulings.

## Verdict

**FAIL as it stands, close to a pass.** v2 is faithful to D064, D065 and the nine rulings almost line by line, and it
sells: every selling page now ends in "Pre-order Kheelu" with the same short price line and the same risk-reversal
line. Eight of the eleven pages pass. Home and the product page fail on six specific items:

1. **The Home hero on a phone (M1).** I measured the plan's own words. The founder's H1 wraps to 5 lines at 360 and
   390 px, not the 4 lines the plan's table assumes. At 390 × 844 that pushes Kheelu out of the first screen, and at
   412 × 915 the WhatsApp bubble covers Kheelu.
2. **"Watch Kheelu with real children" (M2)** sits directly above an AI-made child.
3. **Two claims-guard findings, and I uphold both:** the link label "How Kheelu keeps your child safe" (M3) and "no
   class to get to" (M4).
4. **The product page's question 8 (M5)** asks a question its answer cannot answer yet.

All of them have exact fixes below, and none needs a new fact.

## Per page

| Page | Sells to a parent on a phone? | Verdict | Must-fix | Minor |
|---|---|---|---|---|
| §1 Site-wide (button, price line, risk reversal, bar, nav, share) | Yes. One label, one short price line, one risk-reversal line | **Pass, one build condition** | C1 | m9, m11, m13 |
| §2 Home | Yes once M1 is fixed. In 5 seconds the eyebrow and H1 say what it is and who it is for, and the button carries the price and the risk reversal. Proof comes right under the hero, there are six buttons plus the bar, and the offer card is about screen 8 (the plan's estimate) | **Fail** | M1, M2, M3, M4 | m1-m5, m14 |
| §3 Product page | Yes. The first screen passes as measured at 360, 390 and 412 px. The offer card is fold 3 | **Fail** (M3 shared, M5) | M3, M5 | m7, m8, m9, m10, m12 |
| §4 `/safety` | Yes. The new button after the four facts sits where a worried parent is most convinced | **Pass** | | m6 |
| §5 `/setup` | Yes, for its job (help first, then a close for people who don't own one yet) | **Pass** | | |
| §6 The guide | Yes | **Pass** | | |
| §7 The journal closes | Yes. The talking guides rightly keep D054 item 16 (the founder's decision outranks ruling 8) | **Pass** | | |
| §8 `/team` | Yes | **Pass** | | |
| §9 `/contact` | Yes | **Pass** | | |
| §10 The store's first screen | Yes | **Pass** | | m9 |
| §11 Tracking values | No ID or event name changes. Eight new `cta` values to register | **Pass** | | note under M1 |

## Must-fix

### M1 · Home hero, first phone screen: Kheelu out of view at 390 × 844 and under the bubble at 412 × 915 (layout → Builder; the link on phones → main session, ruling 4; the bubble → founder, D050)

**What I measured** (the plan's exact words injected into today's built hero; DS type 40/44 px):

| Size | H1 lines | Button | Price line | Trust rows | Link | Photo | Result |
|---|---|---|---|---|---|---|---|
| 360 × 590 | 5 | 436-492 | 508-528 | 540-604 | 628-676 | 708- | The risk-reversal row is in, but the delivery row ends at 604 (still meets strategy "In one screen" #5: one trust line inside) |
| 390 × 844 | 5 | 436-492 | 508-528 | 540-604 | 628-676 | 708-927 | **Kheelu is below the fold**: only the boy's head shows, so Q2.1's acceptance fails |
| 412 × 915 | 4 | 392-448 | 464-484 | 496-560 | 584-632 | 664-896 | **The WhatsApp bubble sits on Kheelu** (bottom right of the photo) |

Screenshots: [360](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-plan-v2-sim-360x590.png),
[390](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-plan-v2-sim-390x844.png) and
[412](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-plan-v2-sim-412x915.png). Today's hero, for comparison:
[390](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-built-today-390x844.png).

**Why it matters.** The buyer is on a phone in an ad's in-app browser and reads "soft plush rabbit" but never sees one.
Showing the toy on the first screen is the whole reason for the Kabir photo (D064 item 4; Q2.1). The founder's H1
cannot shrink (D065 item 1). Kheelu sits in the frame's bottom-right third, which is exactly where the bubble lives
(D050).

**Fix:**
1. **Phones (< 900 px):** the hero has no secondary link. The photo follows the trust line directly. Fold 2's films
   start right under the photo, so the proof is one thumb-scroll away. Measured with this change: the photo sits at
   628-847 at 390 × 844 (Kheelu in view, 3 px of feet aside) and at 584-816 at 412 × 915
   ([390](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-fix-no-link-bubble-later-390x844.png),
   [412](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-fix-no-link-bubble-later-412x915.png)).
2. **On Home's phone first screen, the WhatsApp bubble enters with the phone buy bar,** once the hero button leaves.
   Otherwise it covers Kheelu at every phone size
   ([without this step](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-fix-no-phone-link-390x844.png)). It also removes a
   second, green action that competes with the one orange button on the first screen. This changes D050's
   "persistent", so it is the founder's call. If the founder says no, the Builder crops so the bubble's 72 × 72 px
   corner clears Kheelu's face at 390 and 412.
3. **Laptops keep the link:** at 1366 × 768 everything fits, with the link at 676-724
   ([1366](../raw/qa/2026-10-15/cmo/plan-v2/home-hero-plan-v2-sim-1366x768.png)). `hero-film` then fires on laptops only;
   the registry note says so (Builder and QA).
4. **The Copywriter corrects §2.0's table** to these measured values. `first-screen.spec` pins all three sizes: at
   360 × 590 the button, the price line and the risk-reversal row stay inside; at 390 × 844 and 412 × 915 Kheelu
   stays wholly in view and clear of any floating element.

If the main session keeps the link on phones, no layout keeps the link, the delivery row and Kheelu inside
390 × 844 with this H1. In that case it is choosing the link over the product. My recommendation is to show the
product.

### M2 · "Watch Kheelu with real children" sits beside an AI-made child (copy → Copywriter; ruling 4 → main session)

On every hero layout, the only child visible is Kabir, who is AI-made. A label saying "real children" right next to
him reads as a label on him. That is exactly what DS 03-cast forbids ("never give them … 'real parent' labels",
lines 3-5), what ruling 7 rules out, and what the content boundary rules out ("never AI-generated people presented as
customers"). The plan raises this itself (§13 item 6) but recommends keeping the label; I don't agree.

**Fix:** wherever the link stays (laptops, under M1), use **"Watch Kheelu ask, in a 30-second film"**. Render the
length from `films.ts` (film 1, "Learning by asking", 0:30), so the number is never typed. The plan's own fallback,
"Watch the seven films", is also acceptable. Both pass `findBanned`. "Real" keeps its place one fold down, in
"Real children, real families.", directly over the real posters, where it is true and next to the proof.

### M3 · "How Kheelu keeps your child safe" (Home fold 8 `safety-learn`; product fold 9 `product-safety-learn`) (copy → Copywriter; ruling 8 → main session)

**Upheld.** The label promises an outcome ("keeps your child safe"), not a behaviour:
- voice rule 6 names behaviours instead of saying "safe";
- messaging bans "Safe" used alone;
- D018 and ASCI rule out absolute safety claims;
- the BIS licence is applied for, not granted (claims §6).

It is also not "the product page's words", as the plan says: both links read "See how we built safety in" at HEAD
(`cta.ts:36`, `:45`).

**Fix:** keep the built **"See how we built safety in"** on both links. It is approved at Gate A, the two links still
match, and neither the label nor the tracking value changes. The plan then drops "(new label)" from §11 for both
values. Edit §2's link list, Home fold 8, product fold 9, §12 and §13 item 6 to match.

### M4 · Offer lead "There every day at home: no class to get to, and no screen to switch off." (Home fold 7) (copy → Copywriter)

**Upheld.** "No class to get to" puts Kheelu in an enrichment class's role. That is teacher or tutor framing, which
claims §8 bans, and D063 item 4 already cut a classroom outcome. The phrase also comes from messaging's INTERNAL
"Where it falls short" column; only "Every day at home" is EXTERNAL.

**Fix:** "There every day at home, with no screen to switch off." (`findBanned`: clean.)

### M5 · Product FAQ 8 "What happens after the 6 months of Kheelona+?" does not say what happens (copy → Copywriter)

The answer is true (D058 item 3; D065 item 6) but leaves the question open: does Kheelu keep talking? That is the
worst doubt to raise at the decision point. It is also the gap legal-requirements §3 flags for Kheelona+ ("what keeps
working with no subscription"). F7 is open, so the fix is to ask the question this answer does answer.

**Fix:**
- **Question:** "Will Kheelona+ charge me after the 6 months?"
- **Answer:** "No, not unless you sign up for it yourself. Every Kheelu comes with 6 months of Kheelona+, our paid
  subscription, on top of the free parent app. Nothing renews without you."
- Keep the id `after-six-months`. Both strings pass `findBanned`.
- §13 item 1's (b) still applies before Gate B. Once F7 is decided, add what keeps working and restore the "what
  happens after" question.

## Build condition

**C1 · The price line renders as its own block after every button, including in the nav drawer (layout → Builder;
test → QA).**

The guard's third finding is upheld as a build rule, not a copy change:
- Joined with a space, "Pre-order Kheelu ₹499 today, refundable." fires `part-price-button`. I reproduced it.
- Joined with a line break, it is clean.
- The rendered check (`test/e2e/content-integrity.spec.ts`) reads `innerText`, so the price line must be a `<p>` after
  the button, never a span inside or right after the label.
- The risk is highest in the drawer (§1.3). A unit test on `CtaBlock` and the drawer pins it.

## Minor

| # | Where | Finding | Fix | Route |
|---|---|---|---|---|
| m1 | Home fold 10 | "FAQPage: the ten answers below", but the table has eight | Say "eight" | Copywriter |
| m2 | Home FAQ 2 and 3 | Both end with "Until we dispatch it, everything you’ve paid is refundable in full." | Cut it from question 3's token answer. Question 2 and the trust line carry it | Copywriter |
| m3 | Home fold 5, phones (stacked) | Advik's AI photo (point 4) sits directly above the real transcript of a boy named Aarav (point 5), so a parent may read Advik as the child in the transcript (ruling 7) | Swap the pictures of points 3 and 4. Advik whispering to Kheelu fits "It answers, then asks one back", and a girl above a boy's transcript cannot be read as him | Copywriter, Builder |
| m4 | Home hero alt | The DS photo shows a tall block tower on a patterned rug, not a rocket on a dhurrie | "A boy in glasses and an olive T-shirt stacking wooden blocks into a tall tower on a patterned rug, with Kheelu, the cream plush rabbit from Kheelona, beside him." The Builder checks it against the crop | Copywriter, Builder |
| m5 | Home fold 5 point 6 | The age lines are in a different order from FAQ `what-ages`, which says the same thing two folds later | "Made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. You set your child’s age in the parent app, and Kheelu’s AI is given child-safety rules for that age." (clean) | Copywriter |
| m6 | `/safety` fold 3, sixth item | "No endless talking." can read as the unconfirmed half of G28 ("a single conversation cannot run on without end", §1.4) | "**No talking all day.** Each Kheelu has a daily limit on how long it talks." (clean) | Copywriter |
| m7 | Product fold 5 H2 | The change to "Kheelu asks. Your child thinks." cites D064 item 7 and ruling 1, but both cover Home only. It would be the page's fourth "asks" heading, and Home's link lands on `#modes`, not here | Keep the built "What happens when your child presses it.", or list the change as the Copywriter's proposal for the founder rather than a ruling | Copywriter |
| m8 | The two offer cards | The perks come in different orders on Home and the product page; same section, two orders | One order on both cards, Home's (delivery first, because "when does it come?" is the first pre-order doubt). One perk list in `offer.ts` | Copywriter, Builder |
| m9 | The help line | §1.1 says closes and the store only, but product fold 3 (the offer card) carries it. The store reads "Need help?" while the closes read "Questions?" | Drop it from the product card (the bubble and the close carry it, and there is less under the button). Use one wording everywhere: "Questions? Message us on WhatsApp." | Copywriter, Builder |
| m10 | "Recognised by" | Home shows it as a small label under the quotes; the product page shows it as a separate fold | The same small-label strip on both pages, with no heading (ruling 1's style) | Builder |
| m11 | §1.7 the WhatsApp share text | It now leads with ₹499. The message is read cold, out of context, like the metas, which in this same plan lead with the total (D028's rule for text read away from the page) | Token: "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. {price:headline} in total; {price:token} today reserves yours, refundable." (clean). Full mode as planned. The founder signs | Copywriter |
| m12 | §3.0 the product page's first-screen table | Measured at 360 × 590: the H1 is 3 lines, not 2, and the board starts at 540, not 456. The button, price line and both trust rows stay inside | Correct the table ([360](../raw/qa/2026-10-15/cmo/plan-v2/product-hero-plan-v2-sim-360x590.png), [390](../raw/qa/2026-10-15/cmo/plan-v2/product-hero-plan-v2-sim-390x844.png)) | Copywriter |
| m13 | Home fold 9, "What it never says" | "Bluetooth music (an open code-check risk)" is stale: D058 item 2 keeps Bluetooth mode, and FAQ 1 says "a speaker for your phone" | Drop the caution, or name exactly what is unconfirmed | Copywriter |
| m14 | Ruling 9, "LCP is the hero picture" | At 360 × 590 the photo is below the fold, and at 390 the 5-line H1 is probably the largest element, so the LCP will be text on small phones | Measure the LCP element at 360, 390, 412, 1366 and 1440 px. Keep the photo eager with high priority on laptops; don't give it priority at sizes where it starts below the fold | Architect, Builder |

## The claims guard's three results

| Guard finding | CMO verdict |
|---|---|
| "How Kheelu keeps your child safe" | **Upheld** → M3 (keep "See how we built safety in") |
| "There every day at home: no class to get to, …" | **Upheld** → M4 |
| Button and price line joined | **Upheld as a build rule** → C1. The copy stays |

Nothing else in v2 crosses a claim line. I checked:
- D058's withdrawals: there is no one-tap delete and no place for the servers. "Delete all chats" carries G26's words.
- D061's offer and claim entries.
- The brain rule: one line, in D016's form, with its marker.
- The age band: "3 to 7" and "under 3" only.
- Nothing says "Wi‑Fi off at rest", and nothing new uses the pre-launch test.
- First 500 appears on the offer cards only, in token mode.
- No "incl. GST" appears on a selling page. The exception is the product Details' "MRP … (incl. of all taxes)", a
  legal declaration (LM-02; brief §9.7) that stays.
- The phone number appears only on `/contact` and the legal pages, and the GSTIN is off.
- No internal content: no survey figure, competitor or count; the compare table names categories only.

## Faithfulness to D064, D065 and the rulings

| Source | Held? |
|---|---|
| D065 item 1: the eyebrow and H1 | Yes, word for word. The lead is 2 lines at 360, 390 and 412 (measured), names Kheelu and does not repeat the H1 |
| D065 items 2-8 | Yes. 3 to 7 everywhere. The short line follows Q2.8's words. "First 500" appears on the cards only (the FAQ rewrites and the guide's `how-much` swap remove it elsewhere). G28, G30, G26 and G29 use the founder's words. Nobody is said to set the daily limit |
| D064 items 1, 2, 4, 5, 7, 8, 9, 10, 11 | Yes. I checked the film order against `films.ts`: 1, 4, 7, 2, 5, 6, 3 of today's list. The expert clip drops "With captions" and keeps the disclosure |
| Ruling 1 (Home order and exits) | Yes. Eleven folds in the ruled order, the compare table on the product page, three exits |
| Rulings 2, 3, 5, 6, 9 | Yes. The risk-reversal line's two links land on `refund.ts` anchors that exist (`before-dispatch`, `returns`), and the claim matches part 1 ("refundable in full at any time before … dispatched") |
| Ruling 4 | As written, but M1 and M2 ask the main session to amend it (no link on phones; another label) |
| Ruling 7 | Yes, except the hero link (M2) and m3. Each cast child appears once per page on Home, the product page and `/safety` |
| Ruling 8 | Yes on structure. M3 asks the main session to amend the link label |

**Consistency across pages:**
- The button, the price line, the risk-reversal line and the delivery item are identical everywhere they show.
- Both safety links match each other (once M3 is fixed, they match the built label).
- Three things differ: the help line (m9), the offer cards' perk order (m8) and the "Recognised by" style (m10).

## For the founder (notes, not failures)

- **The H1's "answers every why"** sits beside "when it doesn’t know something, it says so instead of guessing". It is
  the founder's chosen H1 (D065 item 1), and point 4 and the FAQ carry the honest limit. Accepted.
- **GST:** "{price:headline} in total" keeps the total upfront beside every button, which is what the
  dark-pattern check needs (legal-requirements §3). Tax moves to checkout by D065 item 3. No change.
- **F7 before Gate B:** what keeps working after six months of Kheelona+ (the plan's §13 item 1). M5 bridges the gap
  until then.
- **The expert clip has no captions** (D064 item 8, the founder's accepted risk). On a muted phone feed, only its
  poster, H2 and credit carry it.

## Worth testing after launch (PostHog, env=production)

1. **The hero's secondary link on phones, on or off** (if the main session keeps it): first-screen store taps, and
   whether fold 2 is reached.
2. **The hero lead:**
   - A: "Kheelu by Kheelona is a soft plush rabbit. You can read every chat."
   - B: "Kheelu by Kheelona is a soft plush rabbit, with no screen. You read every chat."
3. **The offer card placement** (fold 7 against right after fold 5): time to the first store tap from paid phone
   sessions.
