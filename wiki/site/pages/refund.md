---
title: "Refunds (/refund): page copy, Gate A draft"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3 CTA rules, §4.4 footer, §5 policy-pages row, §7 search rules)
  - ../gate-a-open-items.md (§1 founder answers of 2026-10-11, §3 B44 and B47)
  - ../../decisions/D021-returns-policy.md, D022-warranty-replacement-refund.md, D023-new-order-delivery.md, D024-payment-methods-gst.md, D028-price-wording.md, D029-grievance-officer-legal-review.md, D032-grievance-block-and-call-line.md, D033-warranty-after-day-7.md, D041-gate-a-round-1.md, D042-policy-display-answers.md, D043-all-pages-as-mockups-before-build.md
  - ../../product/policies.md, ../../product/legal-requirements.md (H2, ECOM-04 to ECOM-10), ../../product/pricing.md, ../../product/facts.md, ../../product/claims.md
  - ../../brand/voice.md, ../../brand/messaging.md (confirmed candidate lines, words to stop using), ../content-boundary.md
  - ../../research/keyword-map.md (§4.1 row /refund, §5 per-page placements, §6.9 B9 and W1)
  - ../checkout.md (steps 11, 14, 15: order reference, receipt email, address link)
  - ../pages/home.md (CTA block, help line, trust row, fold 8 returns answer) and ../../../mockup/pages/home.html (built pattern)
  - "src/app/(site)/refund/page.tsx and src/lib/legal.ts at tag archive/pre-reset-2026-10-10 (the live page, read 2026-10-11)"
  - "https://razorpay.com/support/ (GET 2026-10-11: 'I Am A... Customer: I recently paid online via Razorpay')"
  - ../../qa/legal-review-pages-legal-b-2026-10-11.md (legal review; its fixes are applied below, see "Changes after the legal review")
---

# Refunds (`/refund`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft: CMO
> review next, then the founder approves it as a legal page after the independent review
> ([D029](../../decisions/D029-grievance-officer-legal-review.md)) and signs it off at Gate A
> ([D015](../../decisions/D015-founder-signs-off-copy.md), [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).
> This is a plain-language check against the rules' own text, not legal advice.

## How to read this page

Same conventions as [home.md](home.md#how-to-read-this-page): **Copy** blocks are the words to publish;
`{price-source}` marks an amount rendered from the single price source (₹499 = `TOKEN_PRICE`, ₹4,500 =
`BALANCE_PRICE`, ₹4,999 = `LAUNCH_PRICE`); `{delivery-source}` marks the one delivery value (D023, D037);
`[PLACEHOLDER: …]` is a fact we do not have (rendered as `<span class="mk-placeholder">`); curly apostrophes
throughout. Support and grievance contacts render from the support source
([facts, support channel](../../product/facts.md#support-channel)) and the one grievance value
([D032](../../decisions/D032-grievance-block-and-call-line.md)); the seller block from the single seller source
([policies, seller details](../../product/policies.md#seller-details-as-published)).

**Both offer modes.** Every price line is written conditionally ("the refundable ₹499 advance, or the whole price
if you paid in full"; "on a reservation"), so the page stays true when the store moves to ₹7,999 paid in full and
existing reservations still exist. No full-mode variant is needed.

## At a glance

| Item | Draft |
|---|---|
| Page job | Tell a parent, before and after buying, exactly how to get money back, return Kheelu, claim the warranty and complain, so the 7-day returns line beside every CTA can be checked; meet E-Commerce Rule 7(1)(a) and 7(1)(c) |
| Real URL | `https://kheelona.com/refund` (mockup file `refund.html`) |
| Primary search cluster | **Kheelu refund policy** (trust); secondaries: cancel a pre-order, 7-day returns, Kheelu warranty ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13), line 228) |
| Title (47 characters) | Kheelu returns, refunds and warranty · Kheelona |
| Meta description (144 characters) | Kheelu refund policy: cancel before dispatch for a full refund, return it within 7 days of delivery, no questions asked, and a 6-month warranty. |
| H1 (recommended) | Refunds, returns and warranty, in plain words. (`Hand` on "plain words") |
| H1 options | (1) Refunds, returns and warranty, in plain words. (2) Refunds, in plain words. (the live H1, `refund/page.tsx:91`) (3) Changed your mind? Here’s how refunds work. |
| Page meta for the build | `{"title": "Kheelu returns, refunds and warranty · Kheelona", "description": "<meta above>", "url": "/refund", "buybar": false, "active": "", "css": false}` (add `"css": true` only if the builder needs page composition for the jump list or numbered sections) |
| CTA | No "Pre-order Kheelu" button in the page body (strategy §5 policy row: "Link back to the product page"); the close links to Meet Kheelu. The nav (`navbar`) and drawer (`navbar-mobile`) keep theirs. Founder question 6 |
| Sticky bar | Off (`buybar: false`) |

The title and meta carry no price, so D028's machine-read rule is not triggered. "Kheelu" is 1 of 24 words in the
meta and appears 15 times in about 1,090 words of copy, placeholders left out (1.4%, under the 2% ceiling of
[keyword map §5](../../research/keyword-map.md#5-placement-rules)).

---

## Fold 0 · Draft note

**Copy:**

> Draft for the founder’s approval; not legal advice.

- A quiet `kh-body-s` line (or a `Tag`) at the very top of `<main>`, above the H1. Not an `Alert`: the DS keeps
  `Alert` for checkout errors, "never for marketing" ([component map](../../design-system/component-map.md), Alert row).
- Removed at launch, once the founder approves the page (D029).

## Fold 1 · Hero

**Fold job:** say what the page is, in the parent's words, and set the calm tone.

**Copy:**

> **H1:** Refunds, returns and warranty, in plain words.
>
> Kheelu’s refund policy: you can change your mind. This page explains exactly how, and what happens to your money.
>
> Last updated: [PLACEHOLDER: the date the founder approves this page]

- `SectionHeading`, `level` 1, `hero` (the page's one display headline), `Hand` on "plain words".
- The lede is the live page's founder-approved lede (`refund/page.tsx:92`) with the primary cluster in front,
  which puts "Kheelu refund policy" (as "Kheelu’s refund policy") in the first paragraph.
- **Optional Kheelu note** (founder question 7): `kheelu-front-sticker.png` (DS, "for crayon blocks") with a
  `Sticker` reading "Changed your mind? That’s allowed." (the live Kheelu line, founder-approved 2026-08-22,
  `refund/page.tsx:95-99`). The image is decorative (`alt=""`) because the sticker carries the words. No cast
  photo on this page. It shows from 900 px up only: on phones the stacked hero pushed the short version below
  the first screen (legal review, /refund should-fix 8).

## Fold 2 · The short version

**Fold job:** the plain-English summary: everything a parent needs in six lines, before any detail.

**Copy:**

> **H2:** The short version.
>
> - **Before dispatch: a full refund.** Cancel any time before your Kheelu leaves us and get back everything you’ve paid. No fee, no reason needed.
> - **After delivery: 7 days to return.** No questions asked. Opened is fine, if everything comes back undamaged. We arrange the pickup, free. [PLACEHOLDER: confirm a change-of-mind return is refunded in full]
> - **When your money comes back.** After a cancellation, we start your refund within 2 working days. After a return, it’s processed within 7 working days of your Kheelu reaching us. Then your bank takes 5-7 working days.
> - **Faulty or not as described?** You can have a replacement or a full refund.
> - **6-month warranty.** On manufacturing defects. We repair it, or replace it if the repair doesn’t work. [PLACEHOLDER: confirm a full refund if neither works]
> - **No exchanges. No payment fees.** Nothing recurring, and nothing is ever charged automatically.
>
> To cancel, return or claim: call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com, with your order number.

- `TrustList` (one column on phones, two on laptops: six items fill three even rows), icons from
  `design-system/project/assets/Icons`: arrow-counter-clockwise, package, clock, shield-check, calendar-check,
  currency-inr (each file checked).
- The help line is the DS's inline secondary action (as Home's `mk-help`), never a floating bubble; the number and
  the email are `tel:`/WhatsApp and `mailto:` links rendered from the support source.
- Item 3 (refund timing) is section 5 in one line (legal review, /refund should-fix 7): D042 for the cancellation,
  D022 for the return; "processed" stays D022's word until the founder answers question 10.
- Item 4 is [D033](../../decisions/D033-warranty-after-day-7.md)'s line verbatim (Rule 7(4)).
- The item 2 and item 5 placeholders are founder questions 1 and 4; the same answers fill section 2 and section 3.

## Fold 3 · On this page

**Copy:**

> **On this page**
> 1. Cancelling before dispatch
> 2. 7-day returns, no questions asked
> 3. Faulty, damaged or not as described
> 4. Exchanges
> 5. How and when your money comes back
> 6. Payments, fees and chargebacks
> 7. Complaints
> 8. Who you’re buying from

- A `<nav aria-label="On this page">` with an ordered list of in-page links (`#before-dispatch`, `#returns`,
  `#faulty`, `#exchanges`, `#refund-timing`, `#payments`, `#complaints`, `#seller`). Each link a full 44 px row
  (DS footer-link pattern), so a phone reader can jump without scrolling 1,000 words. Works without JavaScript.

## Fold 4 · The full policy (sections 1 to 8)

Each numbered section is its own `<section aria-labelledby>` with an H2 carrying the id above. Body in DS body
type, 2 to 3 sentence paragraphs (`01-writing.md` L22). The sections alternate nothing: one quiet surface for the
whole policy, so it reads as one document.

### Section 1 · Cancelling before dispatch (`#before-dispatch`)

**Copy:**

> **H2:** 1. Cancelling before dispatch.
>
> Everything you’ve paid to pre-order is refundable in full at any time before your Kheelu is dispatched: the refundable ₹499`{price-source}` advance, or the whole price if you paid in full. There is no fee, no deduction, and no reason you have to give.
>
> To cancel, call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com, with your order number (it starts with KH-). A message or an email is enough: you never have to call. We start your refund within 2 working days of your request; your bank takes 5-7 working days.
>
> **H3:** If you don’t pay the balance
>
> On a reservation, the remaining ₹4,500`{price-source}` of the ₹4,999`{price-source}` price (incl. GST) is due before delivery, by a payment link we send on WhatsApp and by email. Not paying it counts as a cancellation, and we treat it exactly like one: we ask you twice over two weeks, and if we don’t hear from you, we release your Kheelu and refund your ₹499`{price-source}` in full. Nothing is ever charged automatically.
>
> **H3:** If the date moves, or we can’t deliver
>
> Deliveries start mid-November`{delivery-source}`. If that date moves, you hear it from us first, and you can cancel for a full refund, even if you were happy to wait before. If we can’t supply your Kheelu for any reason, you get back everything you’ve paid: the money, not a credit or a voucher.

- "A message or an email is enough: you never have to call." keeps the live page's ease-of-cancellation signal
  ("We never make you call a number to cancel something you did in two taps", which the legal review §3 said to
  keep; legal review, /refund should-fix 5). It stays true with D032's call line: calling is offered, never required.

### Section 2 · 7-day returns (`#returns`)

**Copy:**

> **H2:** 2. 7-day returns, no questions asked.
>
> Changed your mind? Return your Kheelu within 7 days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged: the plush toy, the charger and the quick-start card, in their box.
>
> **How a return works**
> 1. Call or message us on WhatsApp, or email us, within 7 days of delivery, with your order number.
> 2. We arrange the pickup from your address, free.
> 3. Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days. [PLACEHOLDER: confirm how much comes back, for example “a full refund of everything you paid”]
>
> [PLACEHOLDER: what happens if a returned Kheelu comes back damaged or with something missing, and what counts as damage on a plush toy a child has played with for a few days]

- The H2 carries the keyword map's H2 for this page, "7-day returns, no questions asked"
  ([keyword map §5](../../research/keyword-map.md#5-placement-rules), line 348).
- The first paragraph is D021's policy line verbatim, plus the box contents the founder confirmed ([D041](../../decisions/D041-gate-a-round-1.md)).
- "Your refund is processed", not "a full refund", follows Home's approved returns answer. How much comes back is
  founder question 1 (legal review, /refund must-fix 3); the answer goes into step 3, summary item 2 and the
  "Returned" line of section 5.
- The second placeholder is founder question 2 (legal review, /refund must-fix 4): it must be filled before the
  founder approves this page as legal text.

### Section 3 · Faulty, damaged or not as described (`#faulty`)

**Copy:**

> **H2:** 3. Faulty, damaged or not as described.
>
> **Faulty or not as described? You can have a replacement or a full refund.**
>
> **H3:** In the first 7 days
>
> If your Kheelu arrives damaged or faulty, or isn’t what we described, tell us within 7 days of receiving it, and you can have a replacement or a full refund. The conditions in section 2 (undamaged, complete, in the box) are for change-of-mind returns only: they don’t apply to a faulty, damaged or not-as-described Kheelu.
>
> **H3:** The 6-month warranty
>
> Kheelu has a 6-month warranty on manufacturing defects, from the day it’s delivered. [PLACEHOLDER: confirm the warranty starts on the delivery date] If a defect shows up after the first 7 days, we repair it, or replace it if the repair doesn’t work. [PLACEHOLDER: confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”] The warranty doesn’t cover drops, water damage or misuse.
>
> **H3:** Pickup and timing
>
> Pickup is free for every faulty unit and every warranty claim. [PLACEHOLDER: confirm that sending the repaired or replacement Kheelu back to you is free too] How long a repair or a replacement takes depends on where in India you are, so we don’t promise a number of days. To claim, call or message us on WhatsApp, or email us, with your order number and what’s wrong.

- The lead line is D033's Rule 7(4) line verbatim and is set as a short bold paragraph, so it reads as the remedy
  for every defect, with the 7-day window and the warranty as the process (policies note 2(a); legal review H2).
- "The conditions in section 2 ... are for change-of-mind returns only" is legal review H2's required line
  ([legal requirements](../../product/legal-requirements.md) line 156: "D021 conditions for change-of-mind returns
  only"), which D033 adopts for the copy (legal review, /refund should-fix 1).
- "From the day it’s delivered" is the applied reading (D022's first 7 days run "of receipt"; D033's 6 months
  follow them), now flagged on the page so it is not approved unnoticed; founder question 3 (should-fix 2).
- The warranty backstop placeholder is founder question 4 (legal review, /refund must-fix 2): today the callout
  promises "a replacement or a full refund" with no time limit, while the warranty paragraph offers only repair,
  then replacement, after day 7. The recommended line keeps D033's process and never refuses a refund for a
  defective unit (Rule 7(4)).
- The return-leg placeholder is founder question 8 (should-fix 4): D033 makes the pickup free but says nothing
  about sending the repaired or replacement unit back.
- No repair or replacement timeline (D022 guardrail). "Damaged" joins "faulty" from the live page's own line
  ("A damaged or faulty Kheelu is our problem to fix", `refund/page.tsx:66`).

### Section 4 · Exchanges (`#exchanges`)

**Copy:**

> **H2:** 4. Exchanges.
>
> No exchanges: return it within 7 days and order again. If your Kheelu is faulty or not as described, that isn’t an exchange: section 3 gives you a replacement or a full refund.

### Section 5 · How and when your money comes back (`#refund-timing`)

**Copy:**

> **H2:** 5. How and when your money comes back.
>
> Every refund goes back to the card, UPI ID or bank account you paid from, because that’s the only place a payment can be reversed to.
>
> - **Cancelled before dispatch:** we start your refund within 2 working days of your request.
> - **Returned, faulty or not as described:** your refund is processed within 7 working days of your Kheelu reaching us. [PLACEHOLDER: confirm whether the 7 working days is when we start the refund, before your bank’s 5-7, or when the money reaches you]
> - **Then your bank:** once we’ve started it, your bank takes 5-7 working days.

- "5-7 working days" is D042's wording as the founder chose it. The bank time is a general statement about
  banks (D042; the live page's "that last part is your bank's timing", `refund/page.tsx:39`), so it is applied to
  both cases.
- The placeholder is founder question 10 (legal review, /refund should-fix 3): "processed" (returns) and "start"
  (cancellations) sit in one list. If the 7 working days is the start, the line becomes "we start your refund within
  7 working days of your Kheelu reaching us"; if it is when the money lands, the bank line applies to cancellations
  only.

### Section 6 · Payments, fees and chargebacks (`#payments`)

**Copy:**

> **H2:** 6. Payments, fees and chargebacks.
>
> No payment fees. Nothing recurring. Payments by Razorpay.
>
> You can pay by UPI, debit or credit card, or net banking. Prices include GST, and every order comes with a GST invoice. Your card number, UPI ID and bank details go to Razorpay, not to us, and nothing is ever charged automatically.
>
> If a payment goes wrong, call or message us with your order number. You can also raise a dispute (a chargeback) with your bank or card issuer. Razorpay’s own customer support is at razorpay.com/support: choose “Customer”.

- The first line is D042's verbatim. "razorpay.com/support" links to `https://razorpay.com/support/`, which on
  2026-10-11 offered "I Am A... Customer: I recently paid online via Razorpay"; this meets Rule 7(1)(c)'s "contact
  information of the relevant payment service provider" (legal review ECOM-09). Founder question 5.
- Never mention wallets, EMI, Pay Later or cash on delivery as options (D024).
- The third paragraph carries `id="chargeback"`: the store footer and the confirmation page link to
  `refund.html#chargeback` (Rule 7(1)(c)), and that id did not exist (legal review, /refund must-fix 1).

### Section 7 · Complaints (`#complaints`)

**Copy:**

> **H2:** 7. Complaints.
>
> If you’re unhappy with how we’ve handled a refund, a return or a repair, you can make a formal complaint to our grievance officer.
>
> **Grievance Officer:** Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.
>
> [PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]

- The block is D032's published wording verbatim, rendered from the one grievance value shared with /contact,
  /terms, /privacy and the store footer. Never "5 days" or "30 days".
- No complaint reference number is promised: none exists yet (Rule 7(1)(f), still open; the
  [Gate A sweep](../gate-a-open-items.md#5-stale-pages-found-by-the-sweep-lint-backlog) says promise nothing until it exists).
  The placeholder line under the block is the same one /privacy and /terms carry, so the founder sees the open
  item (ECOM-04) on every policy page; it promises nothing. Once a reference exists it becomes "You get a complaint
  reference to track it." ([legal requirements](../../product/legal-requirements.md) line 491), and from
  1 January 2027 the block adds "We send you a copy of your complaint as we recorded it." (G.S.R. 789(E);
  legal review, /refund should-fix 6). The label is bold, as on /privacy and /terms.

### Section 8 · Who you're buying from (`#seller`)

**Copy:**

> **H2:** 8. Who you’re buying from.
>
> Kheelona Robotics Private Limited, registered at 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India. GSTIN 29AAMCK1530E1ZN.
>
> Customer care: call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com. You order on kheelona.com and pay on store.kheelona.com.

- The live `SELLER_SECTION` (`src/lib/legal.ts:18-24`) with D032's change: the number takes calls, so "takes
  messages, not calls" is retired. Rendered from the single seller source, the same block as /shipping, /terms and
  /privacy.

## Fold 5 · Close

**Fold job:** no dead end: send the parent back to the selling page.

**Copy:**

> **H2:** Still deciding?
>
> See what Kheelu does, what you get and what you pay.
>
> **[Meet Kheelu]** → `meet-kheelu.html` (real URL `/products/kheelu`)
>
> [Shipping and delivery] → `shipping.html`

- `Button` `variant="secondary"` (ink outline), not `cta`: this page has no chilli button in its body (strategy
  §5). Suggested `data-ph-capture-attribute-cta="refund-learn"` (new, optional; not a pre-order CTA, so no price
  sentence beside it). The second link is a ghost button or a plain text link.
- If the founder wants a pre-order close here (question 6), it becomes Home's full CTA block: "Pre-order Kheelu"
  (`cta` = `finale`) with the exact price sentence, the delivery line and the trust row, and the sticky bar
  stays off so a phone view never shows two chilli buttons.

## Footer

The shared footer partial (seller line, Help column with Refunds and Shipping, the grievance-officer link to
`/contact`). No page-specific footer copy.

## CTA and link tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav (shared partial) | Pre-order Kheelu | `navbar` | Existing |
| Phone drawer (shared partial) | Pre-order Kheelu | `navbar-mobile` | Existing |
| Close | Meet Kheelu (secondary) | `refund-learn` | New, optional |

No `finale`, `product-top` or `product-foot` button on this page (none of those positions exists here).

---

## Sources

Plain `path:line` citations to `src/` refer to tag `archive/pre-reset-2026-10-10`.

| Claim on the page | Source |
|---|---|
| Title, H1 word "Refunds", H2 "7-day returns, no questions asked", meta terms, primary cluster | [keyword map](../../research/keyword-map.md) lines 228, 348 |
| Lede ("you can change your mind … what happens to your money") | `src/app/(site)/refund/page.tsx:92` (live, founder-approved 2026-08-22) |
| Everything paid is refundable in full before dispatch: the ₹499 advance or the whole price; no fee, no deduction, no reason | `refund/page.tsx:32`; [policies](../../product/policies.md) lines 74, 110 (published, no new ruling) |
| Ask on WhatsApp or by email with the order number | `refund/page.tsx:38`; channel values [facts](../../product/facts.md) lines 223-224 |
| WhatsApp number takes calls as well as messages | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts](../../product/facts.md) line 223 |
| The order number starts with KH- | [checkout](../checkout.md) line 108 (receipt "Your Kheelu is reserved (KH-…)") |
| "We start your refund within 2 working days of your request; your bank takes 5-7 working days" | [D042](../../decisions/D042-policy-display-answers.md) line 15; [policies](../../product/policies.md) line 131; founder's raw answer, [raw](../../raw/feedback/2026-10-11-gate-a-answers.md) line 65 |
| ₹4,500 balance of the ₹4,999 price (incl. GST), due before delivery, by a payment link on WhatsApp and email | [pricing](../../product/pricing.md) lines 68-71, 235; [policies](../../product/policies.md) line 168; `src/app/(site)/shipping/page.tsx:46` |
| Not paying the balance is a cancellation: asked twice over two weeks, unit released, advance refunded; nothing charged automatically | `refund/page.tsx:49`; [policies](../../product/policies.md) lines 75, 170 |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md); [facts](../../product/facts.md) line 189 |
| If the date moves, we tell you first and you can cancel for a full refund; if we can't supply, all money back, not a credit or voucher | `refund/page.tsx:55`; [policies](../../product/policies.md) line 75; legal review ECOM-06 and ECOM-07 ([legal requirements](../../product/legal-requirements.md) lines 374-375: "keep the late-delivery full refund") |
| 7-day returns of delivery, no questions asked; opened is fine; send back everything in the box, undamaged | [D021](../../decisions/D021-returns-policy.md) (policy line verbatim); [policies](../../product/policies.md) line 104; window from delivery, [Gate A items](../gate-a-open-items.md) line 91 (B44) |
| Box contents: plush toy, charger, quick-start card | [D041](../../decisions/D041-gate-a-round-1.md) line 30; [Gate A items](../gate-a-open-items.md) line 37 |
| We arrange the pickup, free | [D022](../../decisions/D022-warranty-replacement-refund.md) item 3; [D033](../../decisions/D033-warranty-after-day-7.md); [policies](../../product/policies.md) line 107 |
| Refund processed within 7 working days of the unit reaching us, if it qualifies for return | [D022](../../decisions/D022-warranty-replacement-refund.md) item 4; [policies](../../product/policies.md) line 109; wording rule [messaging](../../brand/messaging.md) (confirmed lines, "Pickup and refund") |
| "Faulty or not as described? You can have a replacement or a full refund." | [D033](../../decisions/D033-warranty-after-day-7.md) (Rule 7(4)); [policies](../../product/policies.md) line 108; legal review H2 ([legal requirements](../../product/legal-requirements.md) lines 142-158) |
| Faulty on arrival: tell us within 7 days of receiving it | [D022](../../decisions/D022-warranty-replacement-refund.md) item 2; [policies](../../product/policies.md) line 105 |
| "Damaged or faulty" | `refund/page.tsx:66` ("A damaged or faulty Kheelu is our problem to fix") |
| 6-month warranty on manufacturing defects; not drops, water damage or misuse | [D022](../../decisions/D022-warranty-replacement-refund.md) item 1 and its warranty line; [policies](../../product/policies.md) line 106 |
| After the first 7 days: repair, or replace if the repair fails | [D033](../../decisions/D033-warranty-after-day-7.md); [messaging](../../brand/messaging.md) (confirmed lines, "Warranty": "After the first 7 days, we repair it, or replace it if the repair doesn't work") |
| Warranty counted from delivery | Applied reading of D022 (7 days "of receipt") and D033 ("after the first 7 days and within 6 months"); flagged on the page; founder question 3 |
| No repair or replacement timeline, because it depends on where in India you are | [D022](../../decisions/D022-warranty-replacement-refund.md) item 2 and guardrails |
| "No exchanges: return it within 7 days and order again" | [D042](../../decisions/D042-policy-display-answers.md) line 13; [policies](../../product/policies.md) line 111 |
| Refund to the card, UPI ID or account you paid from, the only place a payment can be reversed to | `refund/page.tsx:39` |
| "No payment fees. Nothing recurring. Payments by Razorpay", with how to raise a chargeback | [D042](../../decisions/D042-policy-display-answers.md) line 14; [policies](../../product/policies.md) line 130; legal review ECOM-09 ([legal requirements](../../product/legal-requirements.md) line 377) |
| UPI, debit or credit card, net banking; prices include GST; GST invoice with every order | [D024](../../decisions/D024-payment-methods-gst.md); [policies](../../product/policies.md) lines 115-116 |
| Card number, UPI ID and bank details go to Razorpay, not to us; nothing charged automatically | `src/app/(site)/privacy/page.tsx:36`; `src/app/(site)/terms/page.tsx:33`; [policies](../../product/policies.md) lines 81, 170 |
| Razorpay's customer support at razorpay.com/support, "Customer" option | `https://razorpay.com/support/` (GET 2026-10-11) |
| Grievance block, verbatim | [D032](../../decisions/D032-grievance-block-and-call-line.md); [policies](../../product/policies.md) lines 117-119 |
| Complaint-reference placeholder under the block (same line as /privacy and /terms) | Rule 7(1)(f), ECOM-04 ([legal requirements](../../product/legal-requirements.md) line 363); [policies](../../product/policies.md) line 120 (still open) |
| "A message or an email is enough: you never have to call." | Live line "We never make you call a number to cancel something you did in two taps" ([legal requirements](../../product/legal-requirements.md) line 482: "Passes; Keep"); channels [facts](../../product/facts.md) lines 223-224 |
| Change-of-mind conditions (undamaged, complete, in the box) don't apply to a faulty, damaged or not-as-described unit | Legal review H2 ([legal requirements](../../product/legal-requirements.md) line 156); [D033](../../decisions/D033-warranty-after-day-7.md) ("What the copy still needs") |
| Summary item "When your money comes back" | Section 5 in one line: [D042](../../decisions/D042-policy-display-answers.md) line 15 (cancellation start, bank time); [D022](../../decisions/D022-warranty-replacement-refund.md) item 4 (return) |
| Seller name, address, GSTIN; order on kheelona.com, pay on store.kheelona.com | `src/lib/legal.ts:18-24`; [policies](../../product/policies.md) lines 140-144 |
| "Changed your mind? That's allowed." (optional sticker) | `refund/page.tsx:95-99` (founder-approved 2026-08-22) |

## Placeholders

| Where | Placeholder | Needed |
|---|---|---|
| Fold 1 | `[PLACEHOLDER: the date the founder approves this page]` | The approval date (D029); set at sign-off |
| Fold 2, item 2 | `[PLACEHOLDER: confirm a change-of-mind return is refunded in full]` | Question 1 |
| Fold 2, item 5 | `[PLACEHOLDER: confirm a full refund if neither works]` | Question 4 |
| Section 2, step 3 | `[PLACEHOLDER: confirm how much comes back, for example “a full refund of everything you paid”]` | Question 1 (the answer also goes into section 5's "Returned" line) |
| Section 2 | `[PLACEHOLDER: what happens if a returned Kheelu comes back damaged or with something missing, and what counts as damage on a plush toy a child has played with for a few days]` | The founder's rule (question 2); needed before legal approval |
| Section 3, warranty | `[PLACEHOLDER: confirm the warranty starts on the delivery date]` | Question 3 |
| Section 3, warranty | `[PLACEHOLDER: confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”]` | Question 4 (Rule 7(4)); needed before legal approval |
| Section 3, pickup | `[PLACEHOLDER: confirm that sending the repaired or replacement Kheelu back to you is free too]` | Question 8 |
| Section 5 | `[PLACEHOLDER: confirm whether the 7 working days is when we start the refund, before your bank’s 5-7, or when the money reaches you]` | Question 10 |
| Section 7 | `[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]` | Question 9 (Rule 7(1)(f)); the same line as /privacy and /terms |

## Questions for the founder (website only, D030)

1. **Change-of-mind returns: refunded in full?** D021 says "no questions asked" and "without risk"; D022 says the
   refund is processed within 7 working days, but no ruling says "in full" for a change-of-mind return. The copy
   says "your refund is processed", like Home. Recommended: yes, in full (no deduction, pickup free), and the copy
   then says "a full refund of everything you paid" in section 2, section 5 and the summary. Rule 7(1)(a) asks for
   accurate refund information; beside "no questions asked", readers assume a full refund.
2. **A return that comes back damaged or incomplete** (the section 2 placeholder), and what counts as "undamaged"
   for a plush toy played with for a week. Options: (a) we tell you what we found and send it back to you, free,
   no refund; (b) a partial refund (needs a stated rule and amount, and invites disputes); (c) refund anyway.
   Recommended: (a), with "normal play marks are not damage; torn, broken, wet or missing parts are".
3. **Warranty start.** The copy says 6 months "from the day it’s delivered", the same reading D021 applies to the
   7 days. Confirm, or name another start (for example the invoice date).
4. **A fault found after day 7.** "Faulty or not as described? You can have a replacement or a full refund." leads
   section 3 with no time limit (D033's text; Rule 7(4) sets none), while the warranty paragraph offers only
   repair, then replacement, after day 7, and nothing says what happens if the replacement fails too. Is it repair,
   then replace, then a full refund if neither works? Or a full refund at any time in the 6 months? Recommended:
   the first, with the line "If a repair and a replacement don’t put it right, you get a full refund." (now a
   placeholder in section 3 and summary item 5); it keeps the page within Rule 7(4).
5. **Razorpay's support link** on the page (Rule 7(1)(c) asks for the payment provider's contact). Recommended: yes,
   `razorpay.com/support`.
6. **A pre-order button on the policy pages?** The strategy's policy row says link back to the product page;
   strategy §3.3 also says "every other page" ends with the finale CTA. Recommended: no pre-order button and no
   sticky bar on /refund and /shipping (a parent checking terms is not pushed); the close links to Meet Kheelu.
7. **Kheelu's two old one-liners** ("Changed your mind? That’s allowed." here; "I’ll help pack. Mostly by sitting
   in the box." on /shipping), approved by you on 2026-08-22: keep as small stickers, or drop for plain policy
   pages? Recommended: keep (warmth on a dry page; no claim in them). They now show on laptops and tablets
   from 900 px only, so on phones the short version starts in the first screen.
8. **Sending a repaired or replacement Kheelu back: free?** D033 makes the pickup free but is silent on the
   return leg (Rule 7(1)(a) asks for delivery information). Recommended: yes.
9. **A complaint reference.** Can the 48-hour acknowledgement carry one, for example the order number plus a
   complaint number? Rule 7(1)(f) requires a ticket number for each complaint (ECOM-04). Until it exists the page
   promises nothing and shows the same placeholder as /privacy and /terms.
10. **"Refund within 7 working days of the unit reaching us"** (D022): is that when we start the refund (the bank
    then adds 5-7 working days), or when the money lands? Recommended wording if it is the start: "we start your
    refund within 7 working days of your Kheelu reaching us".

## Notes for the build

- Section ids: `before-dispatch`, `returns`, `faulty`, `exchanges`, `refund-timing`, `payments`, `complaints`,
  `seller`; plus `chargeback` on section 6's third paragraph (linked from the store footer and the confirmation
  page). Home's trust links point at `refund.html`; once built, the returns item can point at
  `refund.html#returns` and the warranty item at `refund.html#faulty` (shared request 2).
- DS parts: `SectionHeading`, `TrustList`, `Button` (secondary, ghost), `Sticker` (optional), plain lists and
  paragraphs. No `OfferCard`, no `FAQ` (the summary already answers the keyword map's B9 and W1, and the full
  text is visible, not collapsed), no photos.
- Machine-read: if the build adds a `hasMerchantReturnPolicy` to the Product JSON-LD, it renders from the same
  content values as sections 2 and 3 ([keyword map](../../research/keyword-map.md) line 740). The policy page
  itself carries only `BreadcrumbList`, as the live page does (`refund/page.tsx:84-89`).

## Shared requests (for the main session)

1. **Contact page:** give the grievance block an id (suggested `grievance`) so /shipping and the footer can link
   to `contact.html#grievance`.
2. **Home and the shared trust row:** link "7-day returns, no questions asked" to `refund.html#returns` and
   "6-month warranty" to `refund.html#faulty`, instead of the page top (optional; the page works either way).
3. **Meet Kheelu (legal must-fix on that page):** `meet-kheelu.html:357` "Arrived faulty? Tell us within 7 days and
   we replace it." offers a replacement only, which contradicts this page, legal review H2 and D033 (Rule 7(4)).
   Change it to "Arrived faulty? Tell us within 7 days and you can have a replacement or a full refund.", and
   retire the D022 line at `wiki/brand/messaging.md:252` (legal review, /refund should-fix 10).

## Changes after the legal review (2026-10-11)

From [the legal review](../../qa/legal-review-pages-legal-b-2026-10-11.md); copy and mockup changed together.

- Must-fix 1: `id="chargeback"` on section 6's chargeback paragraph.
- Must-fix 2, 3 and 4: founder answers needed, so each is a visible placeholder (questions 1, 2, 4).
- Should-fix 1, 5 and 7: applied (change-of-mind conditions line, "you never have to call", the refund-timing
  summary item).
- Should-fix 2, 3 and 4: flagged on the page as placeholders (questions 3, 10, 8).
- Should-fix 6: the /privacy and /terms complaint-reference placeholder added under the grievance block; the
  full line waits for a reference to exist (question 9).
- Should-fix 8: the hero art is hidden below 900 px.
- Should-fix 9 (launch dependencies: the number takes calls, D032; the GST invoice line only once the CA has
  invoicing running, GST-01) and 10 (Meet Kheelu, messaging) are not edits to this page.
