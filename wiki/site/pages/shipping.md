---
title: "Shipping (/shipping): page copy, Gate A draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3 CTA rules, §4.4 footer, §5 policy-pages row, §6 issue 9, §7 search rules)
  - ../gate-a-open-items.md (§1 founder answers of 2026-10-11)
  - ../../decisions/D021-returns-policy.md, D022-warranty-replacement-refund.md, D023-new-order-delivery.md, D024-payment-methods-gst.md, D028-price-wording.md, D029-grievance-officer-legal-review.md, D032-grievance-block-and-call-line.md, D033-warranty-after-day-7.md, D037-delivery-date-in-schema.md, D042-policy-display-answers.md, D043-all-pages-as-mockups-before-build.md
  - ../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (items 7, 8 and 9, applied in task 6.7; see "Changes after approval (task 6.7)")
  - ../../product/policies.md, ../../product/legal-requirements.md (H3, ECOM-05 to ECOM-07), ../../product/pricing.md, ../../product/facts.md (ship date, support channel)
  - ../../brand/voice.md, ../../brand/messaging.md (confirmed candidate lines), ../content-boundary.md
  - ../../research/keyword-map.md (§4.1 row /shipping, §5 per-page placements, §6.2 G2, §6.9 SH1)
  - ../checkout.md (steps 11, 12, 14-16: address after payment, address link, balance link)
  - ../pages/home.md (CTA block, help line, fold 8 delivery answer) and ../../../mockup/pages/home.html (built pattern)
  - ./refund.md (the shared seller block and the refund terms this page links to)
  - "src/app/(site)/shipping/page.tsx, src/app/(site)/refund/page.tsx and src/lib/legal.ts at tag archive/pre-reset-2026-10-10 (the live pages, read 2026-10-11)"
  - ../../qa/legal-review-pages-legal-b-2026-10-11.md (legal review; its fixes are applied below, see "Changes after the legal review")
---

# Shipping (`/shipping`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft: CMO
> review next, then the founder approves it as a legal page after the independent review
> ([D029](../../decisions/D029-grievance-officer-legal-review.md)) and signs it off at Gate A
> ([D015](../../decisions/D015-founder-signs-off-copy.md), [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).
> This is a plain-language check against the rules' own text, not legal advice.

## How to read this page

Same conventions as [home.md](home.md#how-to-read-this-page) and [refund.md](refund.md#how-to-read-this-page):
`{price-source}` (₹499 = `TOKEN_PRICE`, ₹4,500 = `BALANCE_PRICE`, ₹4,999 = `LAUNCH_PRICE`), `{delivery-source}`
(the one delivery value, which also sets the Product JSON-LD `availabilityStarts` 2026-11-15,
[D037](../../decisions/D037-delivery-date-in-schema.md)), `[PLACEHOLDER: …]`, curly apostrophes.

**Both offer modes.** The balance lines are conditional ("If you reserved with the refundable ₹499 advance …";
"If you paid the full price when you ordered …"), so the page stays true after the first 500 units without a
variant.

**The date.** The page says only "Deliveries start mid-November", never an arrival date, a transit time or the
schema date ([D022](../../decisions/D022-warranty-replacement-refund.md) guardrail; D037 keeps 2026-11-15 in
structured data only). Nothing ties the date to any certificate or licence ([D037](../../decisions/D037-delivery-date-in-schema.md) risk note).

## At a glance

| Item | Draft |
|---|---|
| Page job | Answer "when will it come, where do you deliver, what does delivery cost, how do I track it, what if it's late" for a parent before and after buying, and meet E-Commerce Rule 7(1)(a) on delivery and shipment |
| Real URL | `https://kheelona.com/shipping` (mockup file `shipping.html`) |
| Primary search cluster | **Kheelu delivery and shipping** (trust); secondaries: when will Kheelu be delivered, delivery in India ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13), line 229) |
| Title (48 characters) | Kheelu shipping and delivery in India · Kheelona |
| Meta description (143 characters) | Kheelu delivery and shipping in India: deliveries start mid-November`{delivery-source}`, delivery is included anywhere in India, and you get tracking at dispatch. |
| H1 (recommended) | Shipping and delivery, in plain words. (`Hand` on "plain words") |
| H1 options | (1) Shipping and delivery, in plain words. (2) Shipping, in plain words. (the live H1, `shipping/page.tsx:80`) (3) Shipping anywhere in India, included in the price. |
| Page meta for the build | `{"title": "Kheelu shipping and delivery in India · Kheelona", "description": "<meta above>", "url": "/shipping", "buybar": false, "active": "", "css": false}` |
| CTA | No "Pre-order Kheelu" button in the page body (strategy §5 policy row); the close links to Meet Kheelu. Founder question 6 on [refund.md](refund.md#questions-for-the-founder-website-only-d030) covers both pages |
| Sticky bar | Off (`buybar: false`) |

The meta carries no price (D028 not triggered) and puts "delivery in India" and the primary cluster in the
first words ([keyword map §5](../../research/keyword-map.md#5-placement-rules), line 349). "Kheelu" appears 11 times
in about 840 words of copy, placeholders left out (1.3%, under the 2% ceiling).

---

## Fold 0 · Draft note

**Copy:**

> Draft for the founder’s approval; not legal advice.

- Same treatment as [refund.md fold 0](refund.md#fold-0--draft-note): a quiet `kh-body-s` line or a `Tag`, never an `Alert`.

## Fold 1 · Hero

**Fold job:** say what the page is and that delivery costs nothing extra.

**Copy:**

> **H1:** Shipping and delivery, in plain words.
>
> How Kheelu delivery and shipping work: when it leaves, where it goes, and what it costs to get to you. Which is nothing extra.
>
> Last updated: 14 October 2026

- `SectionHeading`, `level` 1, `hero`, `Hand` on "plain words".
- The date is the founder's ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 8),
  the same on all four legal pages.
- The lede is the live founder-approved lede (`shipping/page.tsx:81`) with the primary cluster in front.
- **Optional Kheelu note** ([refund.md](refund.md#questions-for-the-founder-website-only-d030) question 7):
  `kheelu-front-sticker.png`, `alt=""`, with a `Sticker` reading "I’ll help pack. Mostly by sitting in the box."
  (the live Kheelu line, founder-approved 2026-08-22, `shipping/page.tsx:84-86`). The DS has no packaging photo
  yet (`assets/Kheelu/README.md`: "Still needed: … the packaging"), so no box picture. It shows from 900 px up
  only, so on phones the short version starts in the first screen (legal review, /shipping should-fix 6).

## Fold 2 · The short version

**Fold job:** the plain-English summary in five lines.

**Copy:**

> **H2:** The short version.
>
> - **Deliveries start mid-November`{delivery-source}`.** Pre-orders are served first, in the order they were placed.
> - **Anywhere in India, included.** Delivery is in the price. Nothing to pay at the door.
> - **Tracking from dispatch.** When your Kheelu leaves us, we send you the courier and the tracking details.
> - **Reserved with the refundable ₹499`{price-source}`?** Before dispatch, we send a payment link for the remaining ₹4,500`{price-source}` of the ₹4,999`{price-source}` price (incl. GST).
> - **Refundable until dispatch.** Change your mind before it leaves us, and you get back everything you’ve paid.
>
> Questions about delivery? Call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com.

- `TrustList`, one column on phones. Suggested icons (builder checks each file exists): truck for delivery,
  map-pin for "anywhere in India", package for tracking, credit-card for the balance, arrow-counter-clockwise for
  the refund. Item 1 renders the delivery value inside `<span data-src="DELIVERY_TEXT">`.
- Item 4 keeps "refundable" beside ₹499 and the ₹4,999 total (incl. GST) in the same sentence (D028).
- The summary answers the keyword map's SH1 ("Do you deliver everywhere in India, and what does delivery cost?").

## Fold 3 · On this page

**Copy:**

> **On this page**
> 1. When your Kheelu ships
> 2. Where we deliver, and what it costs
> 3. The balance, before dispatch
> 4. Dispatch and tracking
> 5. Your delivery address
> 6. If delivery is late, or something goes wrong
> 7. Who you’re buying from, and complaints

- `<nav aria-label="On this page">`, in-page links `#when`, `#where`, `#balance`, `#tracking`, `#address`,
  `#problems`, `#seller`, each a 44 px row.

## Fold 4 · The full policy (sections 1 to 7)

Each section is its own `<section aria-labelledby>` with the H2 carrying the id. One quiet surface for the whole
policy.

### Section 1 · When your Kheelu ships (`#when`)

**Copy:**

> **H2:** 1. When your Kheelu ships.
>
> Deliveries start mid-November`{delivery-source}`. Pre-orders are served first, in the order they were placed.
>
> We can’t promise an arrival date, because how long delivery takes depends on where you are. If you need it by a particular date, call or message us before you pre-order.

- Covers the "when will Kheelu be delivered" secondary and the gift-date question (keyword map G2) without naming
  a festival.
- "So the earlier you pre-order, the earlier yours leaves us" is dropped: true, but the page's one sales push, and
  strategy §5 keeps policy pages free of them (legal review, /shipping should-fix 4).

### Section 2 · Where we deliver, and what it costs (`#where`)

**Copy:**

> **H2:** 2. Where we deliver, and what it costs.
>
> Anywhere in India, to the address you give us. Delivery is included in the price, and prices include GST, so the amount you see is the amount you pay: nothing added at the door, and nothing to settle with the courier.
>
> Every order is paid online, so there’s no cash on delivery. We don’t ship outside India: your delivery address needs to be in India.

- The H2 carries the keyword map's H2, "Where we deliver" (line 349).
- The live page's "We do not ship outside India yet" loses "yet" (no future plan is confirmed) and "honestly"
  (DS `01-writing.md` L26).
- "If you’re abroad and want one, message us and we’ll tell you whether we can help" is replaced: it hinted at an
  exception nobody has decided (legal review, /shipping should-fix 5). The new line matches the terms ("a delivery
  address in India", [terms](terms.md) line 178). The review's other idea, "a buyer abroad can send one to an
  address in India", is not used: the terms also ask for an Indian mobile number, and no ruling says payments from
  abroad work, so it would be a new claim.

### Section 3 · The balance, before dispatch (`#balance`)

**Copy:**

> **H2:** 3. The balance, before dispatch.
>
> If you reserved with the refundable ₹499`{price-source}` advance, the remaining ₹4,500`{price-source}` of the ₹4,999`{price-source}` price (incl. GST) is due before delivery. When your Kheelu is ready to leave us, we send you a payment link on WhatsApp and by email. Pay it by UPI, card or net banking, and your Kheelu is dispatched.
>
> If you paid the full price when you ordered, nothing more is due: your Kheelu just ships.
>
> Nothing is ever charged automatically, and we never keep a card on file. If you decide not to pay the balance, that counts as a cancellation and your ₹499`{price-source}` is refunded in full ([see the refund policy](../../../mockup/refund.html#before-dispatch)).

### Section 4 · Dispatch and tracking (`#tracking`)

**Copy:**

> **H2:** 4. Dispatch and tracking.
>
> We message you before your Kheelu is dispatched, so a delivery never turns up out of the blue. Once it’s on its way, we send you the courier and the tracking details.
>
> We don’t promise a number of days in transit. It depends on where you are, and we’d rather send you a real tracking link than a promise about days.

- No courier is named and no transit time is given: neither is decided (D022 guardrail; the live page's own
  reasoning, `shipping/page.tsx:53-55`).

### Section 5 · Your delivery address (`#address`)

**Copy:**

> **H2:** 5. Your delivery address.
>
> You add your delivery address on the confirmation page, right after you pay. You can change it any time before dispatch: use the address link in your order email, or call or message us on WhatsApp, or email us, with your order number. If you’ve moved since you pre-ordered, tell us before you pay the balance.

- The email's address link carries a token that expires after 30 days and a fresh one comes with each email
  ([checkout](../checkout.md) lines 108-109), so the copy always offers the WhatsApp and email route too.

### Section 6 · If delivery is late, or something goes wrong (`#problems`)

**Copy:**

> **H2:** 6. If delivery is late, or something goes wrong.
>
> **If the date moves.** If deliveries can’t start when we said, you hear it from us first, and you can cancel for a full refund, even if you were happy to wait before.
>
> **If we can’t deliver.** If we can’t supply your Kheelu for any reason, you get back everything you’ve paid: the money, not a credit or a voucher.
>
> **If it arrives damaged.** Tell us within 7 days of receiving it, and you can have a replacement or a full refund. We arrange the pickup, free.
>
> **If it doesn’t arrive.** If the tracking stops moving or the parcel doesn’t reach you, call or message us with your order number.
>
> **And once it arrives,** you can still return it within 7 days of delivery, no questions asked ([see the refund policy](../../../mockup/refund.html#returns)).

- Only what the policies say: the live cancellation terms for a moved date or a failed supply (unchanged for the
  new site), the faulty-or-damaged remedy (D022, D033) and the 7-day return (D021). These carry Rule 7(4)'s
  "delivered late" case (legal review H3, ECOM-07). A parcel lost after dispatch is covered by no ruling, and the
  founder took its slot off the page ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md)
  item 9; question 1 below; legal review, /shipping must-fix 1). The "If it doesn’t arrive." line stays word for
  word: it tells the parent to call or message with the order number and promises no remedy and no day count. The
  legal review asked for a remedy with a full-refund option (Rule 7(4)); see the open question at hand-off.
- Bold leads, not H3s, so the five cases scan as one list on a phone.

### Section 7 · Who you're buying from, and complaints (`#seller`)

**Copy:**

> **H2:** 7. Who you’re buying from, and complaints.
>
> Kheelona Robotics Private Limited, registered at 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India. GSTIN 29AAMCK1530E1ZN.
>
> Customer care: call or message us on WhatsApp at +91 91875 46483, or email hello@kheelona.com. You order on kheelona.com and pay on store.kheelona.com.
>
> If you’re unhappy with how we’ve handled your delivery, you can make a formal complaint to our grievance officer (also on the [contact page](../../../mockup/contact.html#grievance)).
>
> **Grievance Officer:** Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.

- The seller block is the same single-source block as [refund.md section 8](refund.md#section-8--who-youre-buying-from-seller).
- The grievance block is the one D032 value, verbatim, as on /refund, /terms and /privacy, in a card. D032 does not
  list /shipping (Rule 4(4) is platform-wide, so a link was legally enough), but legal requirements §4 lists
  "Seller block and grievance block" for /shipping, so the page now shows it (legal review, /shipping should-fix 1).
  The complaint-reference placeholder that stood under it on all four legal pages came off until a system issues a
  reference ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 7; Rule 7(1)(f),
  ECOM-04, still open); in the build it is the optional `grievanceNote` of `LegalTemplateCopy`,
  left out of `src/content/en-IN/legal/shared.ts` while D055 item 7 stands. The contact link points at
  `contact.html#grievance` (that id exists on the contact mockup).

## Fold 5 · Close

**Copy:**

> **H2:** Still deciding?
>
> See what Kheelu does, what you get and what you pay.
>
> **[Meet Kheelu]** → `meet-kheelu.html` (real URL `/products/kheelu`)
>
> [Refunds, returns and warranty] → `refund.html`

- `Button` `variant="secondary"`; suggested `data-ph-capture-attribute-cta="shipping-learn"` (new, optional). The
  second link is a ghost button or text link. The pre-order alternative is as on [refund.md fold 5](refund.md#fold-5--close).

## Footer

The shared footer partial. No page-specific footer copy.

## CTA and link tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav (shared partial) | Pre-order Kheelu | `navbar` | Existing |
| Phone drawer (shared partial) | Pre-order Kheelu | `navbar-mobile` | Existing |
| Close | Meet Kheelu (secondary) | `shipping-learn` | New, optional |

---

## Sources

Plain `path:line` citations to `src/` refer to tag `archive/pre-reset-2026-10-10`.

| Claim on the page | Source |
|---|---|
| Title, H1 word "Shipping", H2 "Where we deliver", meta "delivery in India", primary cluster | [keyword map](../../research/keyword-map.md) lines 229, 349 |
| Lede ("where it goes, when it leaves … Which is nothing extra") | `src/app/(site)/shipping/page.tsx:81` (live, founder-approved 2026-08-22), reordered |
| "Last updated: 14 October 2026" | [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 8 |
| Deliveries start mid-November, new orders; one content value; never an arrival date or transit time | [D023](../../decisions/D023-new-order-delivery.md); [facts](../../product/facts.md) line 189; [policies](../../product/policies.md) line 112; [D037](../../decisions/D037-delivery-date-in-schema.md) (schema date only) |
| Pre-orders served first, in the order placed | `shipping/page.tsx:32`; [facts](../../product/facts.md) line 192 |
| No arrival-date promise; time depends on where you are; ask before you pre-order if you need a date | `shipping/page.tsx:55`; [keyword map](../../research/keyword-map.md) line 538 (G2 draft); [D022](../../decisions/D022-warranty-replacement-refund.md) guardrails |
| Anywhere in India; delivery included; prices include GST; nothing added at the door or paid to the courier | `shipping/page.tsx:39`; [pricing](../../product/pricing.md) lines 235, 238; [policies](../../product/policies.md) line 79 |
| No cash on delivery; paid online | [policies](../../product/policies.md) lines 115, 167 ([D024](../../decisions/D024-payment-methods-gst.md)) |
| No shipping outside India; the delivery address must be in India | `shipping/page.tsx:40`; [policies](../../product/policies.md) line 79; [terms](terms.md) line 178 ("a delivery address in India") |
| Refundable ₹499 advance; ₹4,500 balance of ₹4,999 (incl. GST) due before delivery | [pricing](../../product/pricing.md) lines 68-71; [D028](../../decisions/D028-price-wording.md) |
| Balance by a payment link on WhatsApp and email, when the Kheelu is ready to leave; dispatched once paid | `shipping/page.tsx:46-47`; [policies](../../product/policies.md) line 168; [checkout](../checkout.md) line 110 |
| Pay the link by UPI, card or net banking | [D024](../../decisions/D024-payment-methods-gst.md) (methods enabled on Razorpay); [policies](../../product/policies.md) line 115 |
| Paid in full: nothing more due, it just ships | `shipping/page.tsx:46-47`; [pricing](../../product/pricing.md) line 103 (`full` tier, balance none) |
| Nothing charged automatically; no card on file | `shipping/page.tsx:47`; [policies](../../product/policies.md) line 170 |
| Not paying the balance is a cancellation; advance refunded in full | `src/app/(site)/refund/page.tsx:49`; [policies](../../product/policies.md) line 75 |
| We message you before dispatch; courier and tracking details once dispatched | `shipping/page.tsx:33, 55`; [policies](../../product/policies.md) line 79 |
| No transit-time promise; "a real tracking link" instead | `shipping/page.tsx:53-55`; [policies](../../product/policies.md) line 79; [D022](../../decisions/D022-warranty-replacement-refund.md) guardrails |
| Address added on the confirmation page right after payment; changeable before dispatch by the email link or by message | [checkout](../checkout.md) lines 62, 106, 108-109; `shipping/page.tsx:61`; [policies](../../product/policies.md) line 79 |
| Tell us before paying the balance if you have moved | `shipping/page.tsx:61` |
| Date moves: told first, can cancel for a full refund; cannot supply: all money back, not a credit or voucher | `refund/page.tsx:55`; [policies](../../product/policies.md) lines 75, 110; legal review ECOM-06, ECOM-07 ([legal requirements](../../product/legal-requirements.md) lines 374-375) |
| Refundable in full until dispatch | `refund/page.tsx:32`; [policies](../../product/policies.md) line 74 |
| Arrives damaged: tell us within 7 days of receiving it; replacement or full refund; free pickup | [D022](../../decisions/D022-warranty-replacement-refund.md) item 2; [D033](../../decisions/D033-warranty-after-day-7.md); [policies](../../product/policies.md) lines 105, 107, 108 |
| If the tracking stops moving or the parcel doesn't arrive: call or message us with the order number (no remedy, no day count) | Approved Gate A line ([D046](../../decisions/D046-gate-a-approved.md)), kept as the founder's ruling leaves it ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 9); channels [facts](../../product/facts.md) lines 223-224 |
| 7-day returns of delivery, no questions asked | [D021](../../decisions/D021-returns-policy.md); [policies](../../product/policies.md) line 104 |
| WhatsApp takes calls as well as messages; email | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts](../../product/facts.md) lines 223-224 |
| Seller name, address, GSTIN; order on kheelona.com, pay on store.kheelona.com | `src/lib/legal.ts:18-24`; [policies](../../product/policies.md) lines 140-144 |
| Grievance block, verbatim; also on /contact | [D032](../../decisions/D032-grievance-block-and-call-line.md); [policies](../../product/policies.md) lines 117-119; [legal requirements](../../product/legal-requirements.md) §4 (/shipping: "Seller block and grievance block") |
| "I'll help pack. Mostly by sitting in the box." (optional sticker) | `shipping/page.tsx:84-86` (founder-approved 2026-08-22) |

## Placeholders

None left. Each of the three Gate A placeholders was filled or taken off the page by
[D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) (task 6.7):

| Where | Was | Now |
|---|---|---|
| Fold 1 | The approval date | "14 October 2026" (item 8) |
| Section 6 | What we do if a parcel is lost in transit | Off the page; the "If it doesn’t arrive." line stays word for word (item 9) |
| Section 7 | Complaint reference | Off the page until a system issues one (item 7) |

## Questions for the founder (website only, D030)

Answered on 2026-10-14 ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md)): question 1
(item 9: the lost-parcel line comes off, none of the wording below is used) and, from question 2, the complaint
reference (item 7: no line until a reference exists). The questions stay below as asked.

1. **A parcel lost in transit** (the section 6 placeholder). No ruling covers a Kheelu that is dispatched and never
   arrives. Recommended: "we send a replacement, or refund you in full if you'd rather", with no day count (D022
   guardrail). Rule 7(4) bars refusing a refund for goods delivered late, so a refund option should stay.
2. Shared with /refund: the pre-order button and sticky bar on policy pages (refund.md question 6), the optional
   Kheelu one-liner (question 7) and the complaint reference (question 9).

## Notes for the build

- Section ids: `when`, `where`, `balance`, `tracking`, `address`, `problems`, `seller`. Home's delivery links point
  at `shipping.html`; the delivery-included item can point at `shipping.html#where` once built (optional).
- DS parts: `SectionHeading`, `TrustList`, `Button` (secondary, ghost), `Sticker` (optional), lists and
  paragraphs. No photos, no `OfferCard`, no `FAQ`.
- If the Product JSON-LD gains `shippingDetails`, it says free delivery in India with no handling or transit time
  ([keyword map](../../research/keyword-map.md) line 740), from the same content values as sections 1 and 2.
- The meta description's "mid-November" renders from the delivery source, never typed by hand
  ([D023](../../decisions/D023-new-order-delivery.md); legal review, /shipping should-fix 2). The mockup's meta
  comment cannot do this, so it carries the text; the build must not.

## Changes after the legal review (2026-10-11)

From [the legal review](../../qa/legal-review-pages-legal-b-2026-10-11.md); copy and mockup changed together.

- Must-fix 1: founder answer needed; the placeholder now drops "by when" and keeps the refund option visible.
- Should-fix 1: the grievance block is shown in section 7 (heading and contents entry now "Who you’re buying
  from, and complaints"); the contact link points at `contact.html#grievance`.
- Should-fix 2: build note added (the meta's delivery text comes from the delivery source).
- Should-fix 4 and 5: applied (sales push dropped; the abroad line replaced by the terms' wording).
- Should-fix 6: the hero art is hidden below 900 px.
- Should-fix 3 (terms.md "yet") and 7 (the number takes calls before go-live, D032) are not edits to this page.

## Changes after approval (task 6.7)

The founder's answers of 2026-10-14 ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md),
items 7, 8 and 9) applied to the Gate A-approved copy ([D046](../../decisions/D046-gate-a-approved.md)). Only the
three slots changed; every other word stands as approved. The mockup (`mockup/pages/shipping.html`) is not edited:
the builder carries these changes into `src/content/en-IN/legal/shipping.ts` and lists the text differences for the
main session.

- **Fold 1, "Last updated".** The date slot becomes "14 October 2026" (item 8).
- **Section 6, "If it doesn’t arrive."** The lost-parcel slot comes off (item 9; legal review, /shipping must-fix 1).
  Its sentence stays word for word: "If the tracking stops moving or the parcel doesn’t reach you, call or message
  us with your order number."
- **Section 7.** The complaint-reference slot under the grievance block comes off (item 7); in the build it is the
  optional `grievanceNote` of `LegalTemplateCopy`, left out of `src/content/en-IN/legal/shared.ts` while D055 item 7
  stands, one change for all four legal pages.
- **Notes.** The notes under fold 1, section 6 and section 7, the Sources rows, the Placeholders table (none left)
  and the answered questions now match the copy. The word count ("about 840 words, placeholders left out") and the
  keyword density (11 "Kheelu"s, 1.3%) are unchanged: the slots were never counted, and the date adds three words.
- **Not changed.** Fold 0's draft note stays (no fix in task 6.7 removes it; open question at hand-off). Title,
  meta, H1 and CTA are unchanged.
