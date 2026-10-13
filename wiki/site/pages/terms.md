---
title: "Terms (/terms): page copy, Gate A draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3, §5 policy-pages row, line 213)
  - ../gate-a-open-items.md (the founder's 2026-10-11 answers and working defaults B13, B43, B44, B47)
  - ../../product/legal-requirements.md (§2.1, §2.2, §2.3, DATA-13, DATA-30, §3 dark-pattern checks, §4 /terms checklist lines 516-530, grievance block lines 489-492)
  - ../../product/policies.md, ../../product/pricing.md, ../../product/facts.md, ../../product/claims.md
  - ../checkout.md (form fields, steps 11, 14, 16)
  - ../../research/keyword-map.md (§4 line 227, §5.2 line 347, §6 B9, W1, SH1)
  - ../pages/home.md (CTA block, price sentence, age answer line 751, Kheelona+ line 830)
  - ../../brand/voice.md, ../../brand/messaging.md, ../content-boundary.md
  - "src/app/(site)/terms/page.tsx and src/lib/legal.ts at tag archive/pre-reset-2026-10-10 (git show, 2026-10-11)"
  - "https://razorpay.com/support/ (GET 2026-10-11 from a US network: 200 after a geo-redirect to /us/support/; QA re-checks from India)"
  - "decisions D020-D043; binding here: D020, D021, D022, D023, D024, D025, D027, D028, D029, D032, D033, D035, D036, D040, D041, D042"
  - ../../raw/feedback/2026-10-11-gate-a-answers.md (lines 32, 62-64)
  - ../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (items 7, 8, 10 and 11, applied in task 6.7; see "Changes after approval (task 6.7)")
  - "../../qa/cmo-review-page-facts-6.7-2026-10-14.md (M7: question 7, one refund timing; M8: the fold 0 draft note at Gate B)"
---

# Terms (`/terms`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. Draft for the founder's
> approval under [D029](../../decisions/D029-grievance-officer-legal-review.md): a check against the law's own
> text, not legal advice. No lawyer reviews it before launch (B47), so nothing the legal review marks
> "counsel advised" is written here as settled.

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes, sources and checklists are INTERNAL.
- `{price-source}` after an amount: rendered from the single price source
  ([pricing](../../product/pricing.md)): ₹499 = `TOKEN_PRICE`, ₹4,500 = `BALANCE_PRICE`, ₹4,999 =
  `LAUNCH_PRICE`, ₹7,999 = `FULL_PRICE`, "first 500 units" = `CAP_UNITS_TEXT`. Never typed by hand.
- `{delivery-source}` = the one delivery value ([D023](../../decisions/D023-new-order-delivery.md)), the same
  `DELIVERY_TEXT` Home renders.
- `{support-source}`, `{grievance-source}`, `{seller-source}`: as on [privacy.md](privacy.md#how-to-read-this-page).
- **Token mode** = while ₹499 reservations are open; **full mode** = after the first 500 units, ₹7,999 paid in
  full. Sections that change by mode give both versions; the build renders the live one (G9).
- `[PLACEHOLDER: …]` = a fact we do not have; renders as a visible `<span class="mk-placeholder">`. None left
  on this page: the five Gate A ones were filled or taken off by
  [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md), listed under [Placeholders](#placeholders).
- **Drafter's addition** = wording no decision covers yet (listed for the founder's OK).
- No accordions: every term stays visible ("burying them here would be a way of hiding them",
  `terms/page.tsx:76` at the tag).

## At a glance

| Item | Draft |
|---|---|
| Page job | State the pre-order deal and the rules for using Kheelu and its app so plainly that a parent trusts it before paying: total price upfront, cancel and refund, delivery, payment, returns, ages, the training opt-out, the speech disclaimer, the AI-image note, rights, law, who is selling, how to complain |
| Real URL | `https://kheelona.com/terms` (mockup file `terms.html`) |
| Primary search cluster | **Kheelu pre-order terms** (trust; secondary: what the ₹499 advance buys, always after ₹4,999, [D028](../../decisions/D028-price-wording.md)) ([keyword map §4](../../research/keyword-map.md#4-one-primary-cluster-per-url), line 227) |
| Meta title (33 characters) | Kheelu pre-order terms · Kheelona |
| Meta description, token mode (140 characters) | Kheelu pre-order terms: ₹4,999`{price-source}` (incl. GST), reserved with a refundable ₹499`{price-source}` advance. Paying, delivery, cancelling, returns and using Kheelu. |
| Meta description, full mode (140 characters) | Kheelu pre-order terms: ₹7,999`{price-source}` (incl. GST), paid in full when you order. Paying, delivery, cancelling, returns and using Kheelu and its app. |
| H1 | Recommended **"Pre-order terms, in plain words."** (live H1, carries "pre-order terms"); options below |
| CTA | **None.** No "Pre-order Kheelu" button and no sticky bar on policy pages; the close links back to the product page ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline), line 213). The price still appears only as the full D028 sentence or with the total in the same sentence |
| Anchors other pages link to | `#payment` (Home's trust row links "UPI, card or net banking" here, [home.md, CTA block](home.md#cta-block)); `#price`, `#cancel`, `#delivery`, `#returns`, `#training` |
| Mockup meta | `{"title": "Kheelu pre-order terms · Kheelona", "description": "<token-mode meta>", "url": "/terms", "buybar": false, "active": "", "css": true}` |
| Images | None (text-only policy page) |
| Length | About 1,800 words of copy at Gate A. Task 6.7 takes out the five placeholders' wording (84 words) and adds 10 ("14 October 2026"; "with a switch in the parent app") |

The meta descriptions are machine-read, so they lead with the total and give the advance second
([D028](../../decisions/D028-price-wording.md)). They leave out "first 500 units" so no search snippet reads as
an urgency line (D041 keeps that phrase to one place a page).

**H1 options**

1. **Pre-order terms, in plain words.** (recommended: the live H1; carries the keyword)
2. Kheelu pre-order terms, in plain words.
3. The deal, in plain words.

---

## Fold 0 · Draft note (very top of `<main>`)

**Copy:**

> Draft for the founder's approval; not legal advice.

## Fold 1 · Header

`section aria-labelledby="terms-title"`

**Copy:**

> *(eyebrow)* Terms
>
> # Pre-order terms, in plain words.
>
> What you pay and when, how to cancel, when Kheelu arrives, and the rules for using Kheelu and its parent
> app. A fair deal should survive being written clearly.
>
> Last updated: 14 October 2026

The date is the founder's ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 8), the
same on all four legal pages.

## Fold 2 · The short version

`section aria-labelledby="short-title"`. Eight items, a short title and one or two lines each; a numbered list in
a cream panel (`kh-body-l`).

**Copy (token mode):**

> ## The short version.
>
> 1. **What you pay.** Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay
>    ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
> 2. **Changed your mind before dispatch?** Cancel any time for a full refund, no reason needed. We start it
>    within 2 working days.
> 3. **When it comes.** Deliveries start mid-November`{delivery-source}`, anywhere in India. Delivery is
>    included.
> 4. **After delivery.** 7-day returns, no questions asked, and a 6-month warranty on manufacturing defects.
> 5. **Paying.** UPI, card or net banking, through Razorpay. No payment fees. Nothing recurring.
> 6. **Who it's for.** You must be 18 or over to pre-order. Kheelu is made for children aged 3 to 7.
> 7. **Our own model.** Kheelona's own model learns from your child's conversations unless you turn it off.
> 8. **A toy, not a therapy.** Indian law applies, and you can always file a consumer complaint where you live.

**Full mode:** item 1 becomes "**What you pay.** ₹7,999`{price-source}` (incl. GST), paid in full when you
order." Item 2 becomes "Cancel any time before dispatch for a full refund, no reason needed. We start it within 2
working days." Everything else is unchanged.

Notes: item 1 is the exact Home price sentence (option (d), [D041](../../decisions/D041-gate-a-round-1.md)) and
its full-mode form ([home.md, at a glance](home.md#at-a-glance)). There is no CTA beside it, so no trust row is
required; items 3 and 4 carry the same facts.

## Fold 3 · On this page

`nav aria-label="On this page"`, 44 px rows.

**Copy:**

> **On this page**
>
> *Your pre-order*
> 1. What these terms cover → `#scope`
> 2. Who can pre-order → `#who-can`
> 3. What a pre-order is → `#preorder`
> 4. The price → `#price`
> 5. Paying → `#payment`
> 6. Cancelling before dispatch → `#cancel`
> 7. Delivery → `#delivery`
> 8. Returns, faulty units and warranty → `#returns`
>
> *Using Kheelu*
> 9. Who Kheelu is for → `#ages`
> 10. The parent app → `#account`
> 11. Conversations and Kheelona's own model → `#training`
> 12. A toy, not a therapy → `#toy`
> 13. Images on this website → `#images`
>
> *The legal part*
> 14. Your rights, the law and the courts → `#law`
> 15. Changes to these terms → `#changes`
> 16. Who you're buying from, and complaints → `#contact`

---

## Part one · Your pre-order

### Section 1 · What these terms cover (`#scope`)

**Copy:**

> ## What these terms cover.
>
> These terms are an agreement between you and Kheelona Robotics Private Limited ("Kheelona", "we"). Part one
> covers a pre-order placed on our store at store.kheelona.com. Part two covers using Kheelu and its parent app.
> Our [Privacy](../../../mockup/privacy.html), [Refunds](../../../mockup/refund.html) and [Shipping](../../../mockup/shipping.html) pages are part of these terms
> too.
>
> When you tick the box at checkout, you accept these terms and our refund policy.

### Section 2 · Who can pre-order (`#who-can`)

**Copy:**

> ## Who can pre-order.
>
> You must be 18 or over to pre-order. You need an Indian mobile number for WhatsApp and a delivery address in
> India: we don't ship outside India yet.
>
> Each pre-order is for one Kheelu. If you want more than one, for siblings or as a gift, message us on WhatsApp
> at +91 91875 46483`{support-source}` and we'll sort it out with you.

Notes: 18 or over is legal review DATA-13 (a drafter's addition; DPDP s.2(f) makes anyone under 18 a child).
The Indian-number rule is the store's own validation ([checkout](../checkout.md), line 121; the fixed +91 label
is G13). "We don't ship outside India" is live ([policies](../../product/policies.md), line 79).

### Section 3 · What a pre-order is (`#preorder`)

**Copy:**

> ## What a pre-order is.
>
> A pre-order reserves one Kheelu for you. Pre-orders are served first, in the order they were placed.
>
> In the box: the Kheelu plush toy, a charger and a quick-start card. Every Kheelu comes with 6 months of
> Kheelona+: stories, poems, jingles, languages and the parent app.
>
> When your payment goes through, you see a confirmation page, and we email you a confirmation with your order
> number.

Notes:
- The Kheelona+ sentence is the first sentence of [D027](../../decisions/D027-story-mode-wording.md)'s line,
  verbatim, as on Home ([home.md](home.md), line 830). Nothing about what happens after the six months
  ([D041](../../decisions/D041-gate-a-round-1.md) F7). The legal review's checklist asks `/terms` for the full
  Kheelona+ terms (DARK-04); the founder ruled otherwise, risk recorded in D041.
- The confirmation is an acknowledgement, not a GST document ([pricing](../../product/pricing.md); legal review
  GST-01), so the page says "confirmation", never "receipt" or "invoice".

### Section 4 · The price (`#price`)

**Copy (token mode):**

> ## The price.
>
> While the first 500 units`{price-source}` last, counted by paid pre-orders, Kheelu costs
> ₹4,999`{price-source}` in total (incl. GST). You reserve yours for ₹499`{price-source}` today, refundable until
> dispatch, and pay the remaining ₹4,500`{price-source}` before delivery. The advance is part of the
> ₹4,999`{price-source}`, not on top of it.
>
> After that, Kheelu costs ₹7,999`{price-source}` (incl. GST), paid in full when you order, with no advance and
> no balance.
>
> Your price is fixed on the day you pre-order. It does not move afterwards, in either direction.
>
> Prices include GST. Delivery anywhere in India is included, so the price is the whole cost of Kheelu arriving
> at your door. Nothing is collected at the door.
>
> Every order gets a GST invoice.

**Copy (full mode):** the first two paragraphs become

> Kheelu costs ₹7,999`{price-source}` (incl. GST), paid in full when you order. There is no advance and no
> balance.

The rest is unchanged.

Notes:
- "First 500 units" appears once on this page (D041's spirit: never a badge or counter; legal review DARK-01: true
  while the paid count is real). No MRP here: the MRP ₹7,999 belongs in the product page's declarations block
  only, never framed as a saving (legal review §3, LM-02, [D034](../../decisions/D034-origin-manufacturer-mrp.md)).
- Never "just ₹499" or "only ₹499" (DARK-03).
- GST: only what [D024](../../decisions/D024-payment-methods-gst.md) confirms, prices include GST and a GST invoice
  with every order ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 10). The two
  slots that waited on the CA (which GST documents and when, GST-01; the price breakup, ECOM-08) came off the page.

### Section 5 · Paying (`#payment`)

**Copy:**

> ## Paying.
>
> You can pay by UPI, debit or credit card, or net banking. Razorpay takes the payment on its own secure form:
> your card number, UPI ID and bank details go to Razorpay, never to us.
>
> No payment fees. Nothing recurring. Nothing is ever charged automatically, and we don't keep your card.
>
> *(token mode only)* The ₹4,500`{price-source}` balance is paid by a payment link we send you on WhatsApp and by
> email before dispatch. We dispatch a reserved Kheelu once the balance is paid.
>
> If a payment goes wrong, tell us first and we'll sort it out. You can also raise a dispute (a chargeback) with
> your bank or card issuer. Razorpay's own help is at [razorpay.com/support](https://razorpay.com/support/).

Notes:
- Methods: [D024](../../decisions/D024-payment-methods-gst.md). Wallets, EMI and Pay Later are never mentioned.
- "No payment fees. Nothing recurring." and the chargeback line: [D042](../../decisions/D042-policy-display-answers.md).
  "Payments by Razorpay" is carried by the sentence above. Razorpay's contact is E-Commerce Rule 7(1)(c)
  (legal review ECOM-09). The link answered 200 from a US network after a geo-redirect; QA re-checks it from India.
- "Tell us first" is a drafter's addition; it never blocks the chargeback.

### Section 6 · Cancelling before dispatch (`#cancel`)

**Copy:**

> ## Cancelling before dispatch.
>
> You can cancel at any time before your Kheelu is dispatched, and we refund everything you've paid: the whole
> advance, or the whole price if you paid in full. No fee, no deduction, and you don't have to tell us why.
>
> To cancel, message or call us on +91 91875 46483, or email hello@kheelona.com`{support-source}`, with your
> order number. We start your refund within 2 working days of your request; your bank takes 5-7 working days.
> The money goes back to the card, UPI ID or account you paid from.
>
> *(token mode only)* If you don't pay the balance, we remind you twice over two weeks. After that, we release
> your Kheelu and refund your advance in full.
>
> All the detail is on our [Refunds](../../../mockup/refund.html) page.

### Section 7 · Delivery (`#delivery`)

**Copy:**

> ## Delivery.
>
> Deliveries start mid-November`{delivery-source}`. We deliver anywhere in India and send you a tracking link when
> your Kheelu ships. You can change your address any time before dispatch.
>
> If the delivery date moves, you hear it from us first, your price stays exactly as it is, and you can cancel
> for a full refund at that point, even if you were happy to wait before. If we cannot supply your Kheelu at
> all, you get back everything you've paid.
>
> Before dispatch, details such as specifications can still change while we finish testing and certification.
> Your price and your money can't change without your say.
>
> All the detail is on our [Shipping](../../../mockup/shipping.html) page.

Notes:
- No arrival date and no transit time ([D022](../../decisions/D022-warranty-replacement-refund.md) guardrail;
  [facts, ship date](../../product/facts.md#ship-date)). No date tied to a licence, and no BIS or ISI claim
  (legal review BIS-01, BIS-02; [D030](../../decisions/D030-questions-scoped-to-the-website.md)). The schema date
  2026-11-15 ([D037](../../decisions/D037-delivery-date-in-schema.md)) is not printed here.
- The date-moves promise is the live term (`terms/page.tsx:70`) and matches E-Commerce Rule 7(4) (legal review
  ECOM-06, ECOM-07).

### Section 8 · Returns, faulty units and warranty (`#returns`)

**Copy:**

> ## Returns, faulty units and warranty.
>
> **Changed your mind?** Return Kheelu within 7 days of delivery, no questions asked. Opened is fine. Just send
> back everything that came in the box, undamaged.
>
> **Faulty, damaged or not as described?** You can have a replacement or a full refund. If it arrives faulty,
> tell us within 7 days of receiving it.
>
> **Warranty.** 6-month warranty on manufacturing defects. It doesn't cover drops, water damage or misuse. If a
> defect shows up after the first 7 days, we repair it, or replace it if the repair fails.
>
> We arrange the pickup, free, for returns we accept, faulty units and warranty claims. Once your Kheelu reaches
> us and qualifies for return, your refund is processed within 7 working days.
>
> No exchanges: return it within 7 days and order again.
>
> All the detail is on our [Refunds](../../../mockup/refund.html) page.

Notes:
- [D021](../../decisions/D021-returns-policy.md) (change of mind, "of delivery", B44); D021's conditions apply to
  change-of-mind returns only. [D033](../../decisions/D033-warranty-after-day-7.md) ("Faulty or not as
  described? You can have a replacement or a full refund."; repair, else replace; free pickup).
  [D022](../../decisions/D022-warranty-replacement-refund.md) (warranty scope; refund in 7 working days; the
  7-day report for on-arrival faults). [D042](../../decisions/D042-policy-display-answers.md) (no exchanges).
- The on-arrival 7-day line follows the faulty-unit remedy, so it never reads as the only remedy for a defect
  (legal review ECOM-06, policies note 2).

---

## Part two · Using Kheelu

### Section 9 · Who Kheelu is for (`#ages`)

**Copy:**

> ## Who Kheelu is for.
>
> Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. For 3-year-olds, we advise
> having a grown-up nearby.
>
> When you set Kheelu up, you enter your child's age in the parent app. Every reply passes an age-graded safety
> layer set to that age. You can change it later.

Notes: Home's age answer, verbatim ([home.md](home.md), line 751); [D041](../../decisions/D041-gate-a-round-1.md)
(grown-up nearby); [D036](../../decisions/D036-launch-feature-claims.md) (the safety layer, the parent sets the
age).

### Section 10 · The parent app (`#account`)

**Copy:**

> ## The parent app.
>
> The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the
> account.
>
> In the app, you can read every conversation and delete any of them in one tap. Conversations are deleted
> automatically after 36 months.
>
> How we handle your child's data is on our [Privacy](../../../mockup/privacy.html) page, which is part of these terms.

Notes: the account-holder line is legal review DATA-30 (a drafter's addition). Reading and deleting:
[D017](../../decisions/D017-live-behaviour-claims-confirmed.md); 36 months:
[D020](../../decisions/D020-provider-terms-and-no-sale.md). Nothing about Kheelona+ after six months (D041).

### Section 11 · Conversations and Kheelona's own model (`#training`)

**Copy:**

> ## Conversations and Kheelona's own model.
>
> Kheelona's own AI model learns from your child's voice recordings and conversation transcripts. This is on by
> default, and you can turn it off at any time with a switch in the parent app. Our outside speech and AI
> providers never train on your child's voice.
>
> The full detail, including what happens when you turn it off, is on our [Privacy](../../../mockup/privacy.html#training)
> page.

Notes: [D035](../../decisions/D035-model-training-opt-out.md) (terms and privacy only; never on customer pages);
the providers clause is [D020](../../decisions/D020-provider-terms-and-no-sale.md), scoped to the providers. "With
a switch in the parent app" is [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 11,
the same method /privacy states (item 12); what happens after a parent turns it off stays on /privacy only.

### Section 12 · A toy, not a therapy (`#toy`)

**Copy:**

> ## A toy, not a therapy.
>
> Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your
> paediatrician.
>
> Kheelu uses AI to understand and answer your child. Its stories and answers come from a curated, closed
> content library, and every reply passes an age-graded safety layer. We test it before launch by trying to make
> it say unsafe things, and when it isn't sure, it says it doesn't know rather than guess. Even so, an answer can sometimes be wrong. Kheelu doesn't
> replace you: stay close, and read its conversations in the parent app.

Notes:
- The first paragraph is [D025](../../decisions/D025-speech-and-language.md)'s disclaimer, verbatim (on `/terms`
  and the product page only).
- The second paragraph uses only [D036](../../decisions/D036-launch-feature-claims.md)'s confirmed behaviours
  (closed library, safety layer, red-teamed, says it doesn't know). It opens with D020's "to understand and
  answer your child, Kheelu uses … AI providers" in short, so the closed library never reads as "no AI model is
  involved" ([facts](../../product/facts.md), line 144 flag). "An answer can sometimes be wrong" and
  "doesn't replace you" are drafter's additions (a plain limit, voice rule 8 in [voice](../../brand/voice.md)).
  "Kheelu's stories" here means its content, not a claim that Story mode adapts (D027).

### Section 13 · Images on this website (`#images`)

**Copy:**

> ## Images on this website.
>
> This website may use AI-generated images, including pictures of children and families. They are
> illustrations, not photos of our customers. Our films are different: they show real pilot families, filmed
> with their permission.

Notes: [D041](../../decisions/D041-gate-a-round-1.md) (disclose on the Terms page, not the footer; raw
`2026-10-11-gate-a-answers.md:32`, "we might use AI generated images"); [policies](../../product/policies.md),
line 133; films: [D040](../../decisions/D040-films-move-to-new-site.md) and legal review DARK-02's line.

---

## Part three · The legal part

### Section 14 · Your rights, the law and the courts (`#law`)

**Copy:**

> ## Your rights, the law and the courts.
>
> These terms are governed by Indian law, and the courts at Bengaluru have jurisdiction. This does not limit
> your right to file a consumer complaint where you live, under the Consumer Protection Act, 2019.
>
> Nothing in these terms takes away your rights as a consumer, or your right to complain to the Data Protection
> Board of India once the Digital Personal Data Protection Act's duties apply in May 2027.
>
> If any part of this page is unclear enough to argue about, we will read it the way a careful parent would, not
> the way a lawyer would like us to.

Notes: live `terms/page.tsx:82-83`; legal review TERMS-01 (the consumer-complaint sentence, verbatim) and DATA-30
(no waiver of a Board complaint; "May 2027" because the exact day is a counsel point, DATA-00).

### Section 15 · Changes to these terms (`#changes`)

**Copy:**

> ## Changes to these terms.
>
> When these terms change, we update the date at the top. A change never touches the price or the refund promise
> of an order you've already placed without your say. If a change affects your order, we tell you first.

Notes: "without your say" is the live promise (`terms/page.tsx:70`); "we tell you first" is a drafter's
addition.

### Section 16 · Who you're buying from, and complaints (`#contact`)

**Copy:**

> ## Who you're buying from, and complaints.
>
> **Seller:** Kheelona Robotics Private Limited, registered at 5th Floor, No 51 (Old Site No 1), Kokarya Business
> Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India. GSTIN
> 29AAMCK1530E1ZN.`{seller-source}`
>
> **Customer care:** WhatsApp or call +91 91875 46483, or email hello@kheelona.com.`{support-source}`
>
> **Grievance Officer:** Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every
> complaint within 48 hours and resolve it within one month of receiving it.`{grievance-source}`

Notes: seller block from `src/lib/legal.ts:18-24` minus the retired "messages, not calls" line
([D032](../../decisions/D032-grievance-block-and-call-line.md)); registered office only (B43). The
complaint-reference placeholder under the grievance block came off until a system issues a reference
([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 7; ECOM-04 still open); in the build
it is the shared `grievanceNote` in `src/content/en-IN/legal/shared.ts`, one change for all four legal pages. From 1 January
2027 the grievance block adds "We send you a copy of your complaint as we recorded it." and the yearly
dark-pattern self-audit certificate appears here or in the footer (legal review ECOM-03, ECOM-13): dated tasks,
not copy for today.

## Close

**Copy:**

> **[Meet Kheelu]** → `meet-kheelu.html` (real URL `/products/kheelu`), `kh-btn--secondary`, no `cta` value
>
> Also read: Privacy → `privacy.html` · Refunds → `refund.html` · Shipping → `shipping.html`
>
> Questions? WhatsApp or call +91 91875 46483`{support-source}`

---

## Sources

Plain `path:line` = tag `archive/pre-reset-2026-10-10`. Wiki paths are relative to `wiki/`.

| Claim on the page | Source |
|---|---|
| Draft note; founder approves; no lawyer; counsel points not settled | [D029](../../decisions/D029-grievance-officer-legal-review.md); gate-a-open-items.md:94 (B47) |
| Lede "A fair deal should survive being written clearly." | `terms/page.tsx:103` |
| "Last updated: 14 October 2026" | [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 8 |
| Price sentence (token) and full-mode form | [D028](../../decisions/D028-price-wording.md); [D041](../../decisions/D041-gate-a-round-1.md) (option (d)); site/pages/home.md:54-55 |
| Amounts, cap, counted by paid pre-orders, full price after | product/pricing.md:54, 68-72; `terms/page.tsx:32-34, 40` |
| Advance is part of the price | `terms/page.tsx:33` |
| Price fixed on the day you order | `terms/page.tsx:40` |
| Prices incl. GST; delivery included; nothing collected at the door | [D024](../../decisions/D024-payment-methods-gst.md); `terms/page.tsx:46`; product/policies.md:79, 87 |
| GST invoice with every order (nothing more on GST until the CA confirms it) | [D024](../../decisions/D024-payment-methods-gst.md); [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 10 |
| 18 or over | product/legal-requirements.md:442 (DATA-13), 523 |
| Indian mobile number; India only | site/checkout.md:121; product/policies.md:79 |
| One Kheelu per pre-order; more via WhatsApp | `terms/page.tsx:52`; product/policies.md:80 |
| Served in the order placed | product/facts.md:192 |
| Box contents | [D041](../../decisions/D041-gate-a-round-1.md) ("Kheelu plush toy, Charger, quick start card") |
| Kheelona+ first sentence only | [D027](../../decisions/D027-story-mode-wording.md):24-27; [D041](../../decisions/D041-gate-a-round-1.md) F7; site/pages/home.md:830 |
| Confirmation page and email | site/checkout.md:105, 108 |
| Tick box accepts terms and refund policy | site/checkout.md:124 |
| Methods UPI, cards, net banking; Razorpay form | [D024](../../decisions/D024-payment-methods-gst.md); product/policies.md:115, 149-166; `privacy/page.tsx:36` |
| No payment fees; nothing recurring; chargeback | [D042](../../decisions/D042-policy-display-answers.md); product/policies.md:130; product/legal-requirements.md:377 (ECOM-09) |
| Nothing charged automatically; no card kept | `terms/page.tsx:33`; product/policies.md:170-171 |
| Balance by payment link on WhatsApp and email; dispatch after balance | product/policies.md:79, 168; site/checkout.md:110 |
| Cancel before dispatch, full refund, no fee, no reason | `terms/page.tsx:60`; product/policies.md:74 |
| Refund starts within 2 working days; bank 5-7 working days; same method | [D042](../../decisions/D042-policy-display-answers.md); product/policies.md:74, 131 |
| Unpaid balance treated as cancellation | product/policies.md:75 |
| Deliveries start mid-November, one value | [D023](../../decisions/D023-new-order-delivery.md); product/facts.md:189; product/policies.md:112 |
| Tracking link; address change before dispatch | product/policies.md:79; research/keyword-map.md (SH1) |
| Date moves: told first, price held, cancel for refund; cannot supply: full refund | `terms/page.tsx:69-70`; product/policies.md:75 |
| Returns 7 days of delivery, opened fine, complete and undamaged | [D021](../../decisions/D021-returns-policy.md):18-21; product/policies.md:104; gate-a-open-items.md:91 (B44) |
| Faulty or not as described: replacement or full refund | [D033](../../decisions/D033-warranty-after-day-7.md):20-23; product/policies.md:108; product/legal-requirements.md:374 (ECOM-06) |
| On-arrival fault within 7 days of receipt | [D022](../../decisions/D022-warranty-replacement-refund.md) item 2; product/policies.md:105 |
| 6-month warranty, exclusions, repair else replace | [D022](../../decisions/D022-warranty-replacement-refund.md) item 1; [D033](../../decisions/D033-warranty-after-day-7.md); product/policies.md:106 |
| Free pickup; refund within 7 working days of the unit reaching us | [D033](../../decisions/D033-warranty-after-day-7.md); [D022](../../decisions/D022-warranty-replacement-refund.md) item 4; product/policies.md:107, 109 |
| No exchanges | [D042](../../decisions/D042-policy-display-answers.md); product/policies.md:111 |
| Ages 3 to 7; not under 3; grown-up nearby; age set in the app; safety layer | site/pages/home.md:751; product/facts.md:83; [D041](../../decisions/D041-gate-a-round-1.md); [D036](../../decisions/D036-launch-feature-claims.md):22, 25-26 |
| Adult account holder; privacy part of the terms | product/legal-requirements.md:459 (DATA-30), 524 |
| Read and delete every conversation; 36 months | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7 |
| Own-model training, on by default, opt-out; providers never train | [D035](../../decisions/D035-model-training-opt-out.md):14-29; [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 3 |
| Turned off with a switch in the parent app | [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 11 (as on /privacy, item 12) |
| Speech disclaimer | [D025](../../decisions/D025-speech-and-language.md):19-20; product/policies.md:123 |
| Closed library, safety layer, red-teamed, says it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md):18, 21-23 |
| AI-generated images disclosure | [D041](../../decisions/D041-gate-a-round-1.md); raw/feedback/2026-10-11-gate-a-answers.md:32; product/policies.md:133 |
| Films: real pilot families, with permission | [D040](../../decisions/D040-films-move-to-new-site.md); product/legal-requirements.md:387 (DARK-02) |
| Indian law, Bengaluru courts; consumer complaint where you live | `terms/page.tsx:82`; product/policies.md:90; product/legal-requirements.md:367 (TERMS-01) |
| No waiver of a Board complaint; May 2027 | product/legal-requirements.md:459 (DATA-30), 423 (DATA-00) |
| Careful-parent reading | `terms/page.tsx:83` |
| Seller block | product/policies.md:140-144; `src/lib/legal.ts:18-24` |
| Customer care calls and messages; email | product/facts.md:223-224; [D032](../../decisions/D032-grievance-block-and-call-line.md) |
| Grievance block | [D032](../../decisions/D032-grievance-block-and-call-line.md):20-22; product/policies.md:117-119; product/legal-requirements.md:489-492 |
| No CTA on policy pages; link to the product page | site/strategy.md:213 |
| Meta title and H1 keyword | research/keyword-map.md:227, 347 |

## Placeholders

None left. Each of the five Gate A placeholders was filled or taken off the page by
[D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) (task 6.7):

| # | Where | Was | Now |
|---|---|---|---|
| 1 | Header | Last-updated date | "14 October 2026" (item 8) |
| 2 | Section 4 | Which GST documents and when (receipt voucher, tax invoice) | Off the page; "Every order gets a GST invoice." stays (item 10) |
| 3 | Section 4 | Price breakup: taxable value, GST rate and amount, delivery ₹0 | Off the page (item 10) |
| 4 | Section 11 | How a parent turns training off | "with a switch in the parent app" (item 11) |
| 5 | Section 16 | Complaint reference | Off the page until a system issues one (item 7) |

## Drafter's additions (need the founder's OK)

1. "You must be 18 or over to pre-order." (DATA-13)
2. The parent-app account holder is 18 or over and looks after the account (DATA-30).
3. "If a payment goes wrong, tell us first and we'll sort it out." (before the chargeback line)
4. "Even so, an answer can sometimes be wrong. Kheelu doesn't replace you: stay close, and read its
   conversations in the parent app."
5. "If a change affects your order, we tell you first."

## Questions for the founder (website only)

The questions shared with `/privacy` are on [privacy.md](privacy.md#questions-for-the-founder-website-only)
(1: the opt-out method and purpose; 4: the drafter's additions on both pages; 5: no pre-order button on the policy
pages). Two more for this page:

6. **The GST line before your CA confirms.** (a) Keep "Every order gets a GST invoice." with the placeholder for
   the document details, as drafted; (b) hold the whole line until the CA has vouchers and invoices running (legal
   review GST-01). **Recommend (a)**: you confirmed the invoice (D024) and Home's trust copy already depends on it;
   the placeholder keeps the unconfirmed part visible.

7. **One refund timing on both pages** (new, [CMO review](../../qa/cmo-review-page-facts-6.7-2026-10-14.md) M7).
   Section 8 here says "Once your Kheelu reaches us and qualifies for return, your refund is processed within 7
   working days." `/refund` now says "your refund reaches you within 7 working days" (D055 item 5: bank time
   included). They don't contradict, but a parent comparing the pages sees two timings. (a) Keep the approved
   "is processed"; (b) "your refund reaches you within 7 working days", so the sentence matches `/refund` step 3
   word for word ([refund.md](refund.md) line 188). **Recommend (b)**: one promise, worded once, and it is the one
   the founder gave. Not applied: D055 names no line on `/terms` here.

Answered on 2026-10-14 ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md)): question 6 by
item 10 (the invoice line stays; the documents-and-timing and price-breakup slots come off), and privacy.md
question 1's "how" by item 11 (a switch in the parent app). The questions stay above as asked.

## Checks before sign-off (CTO or QA, not founder questions)

- Razorpay's support link from an Indian network.
- The store's tick-box wording still says "the pre-order terms and the refund policy" (Section 1 quotes it).
- Every amount, the cap and the delivery text render from their sources in both modes (G9).

## Risks recorded, not re-raised

- Kheelona+ terms after six months are not stated ([D041](../../decisions/D041-gate-a-round-1.md); legal review
  DARK-04, L7).
- Opt-out training default vs DPDP consent ([D035](../../decisions/D035-model-training-opt-out.md)).
- A published delivery start that slips gives buyers the Rule 7(4) refund claim, which the terms already honour
  ([D037](../../decisions/D037-delivery-date-in-schema.md)).
- No GST document timing (GST-01) and no price breakup (ECOM-08) on the page until the CA confirms them
  ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 10).

## Keyword placements

| Place | Carries |
|---|---|
| Meta title | "Kheelu pre-order terms" |
| H1 | "pre-order terms" |
| Meta description | ₹4,999 (incl. GST) first, then "refundable ₹499 advance" (D028) |
| H2 | "What a pre-order is." / "The price." (what the advance buys, after the total) |
| Banned words checked | No "lessons", "best friend", "free" beside Kheelona+, "just/only ₹499", wake-word lines, "region", "MRP" framed as a saving, em dashes |

The keyword placements are unchanged by task 6.7 (no change touches the title, meta, H1 or H2s).

## Changes after approval (task 6.7)

The founder's answers of 2026-10-14 ([D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md),
items 7, 8, 10 and 11) applied to the Gate A-approved copy ([D046](../../decisions/D046-gate-a-approved.md)). Only
the five slots changed; every other word stands as approved. The mockup (`mockup/pages/terms.html`) is not edited:
the builder carries these changes into `src/content/en-IN/legal/terms.ts` and lists the text differences for the
main session.

- **Fold 1, "Last updated".** The date slot becomes "14 October 2026" (item 8).
- **Section 4, GST.** "Every order gets a GST invoice." and "Prices include GST." stay; the documents-and-timing
  slot and the price-breakup paragraph come off (item 10; only what D024 confirms). Both modes: the full-mode copy
  replaces the first two paragraphs only, so it changes the same way.
- **Section 11, training.** The how-to slot becomes "with a switch in the parent app": "This is on by default, and
  you can turn it off at any time with a switch in the parent app." (item 11, as on /privacy; the colon before the
  slot goes with it).
- **Section 16.** The complaint-reference slot under the grievance block comes off (item 7); in the build it is the
  shared `grievanceNote` in `src/content/en-IN/legal/shared.ts`, one change for all four legal pages.
- **Notes.** How to read this page (no placeholders left), the fold 1 date note, the section 4, 11 and 16 notes,
  the Sources rows, the Placeholders table, the answered questions, Length, and a new line under Risks (GST-01,
  ECOM-08 off the page) now match the copy.
- **Not changed.** Fold 0's draft note stays (no fix in task 6.7 removes it; whether it stays on production is the
  founder's call at Gate B, CMO review M8). Section 8 keeps its approved "your refund is processed within 7 working
  days" (no D055 item reaches /terms there; question 7, from CMO review M7). Title, meta, H1 and close are
  unchanged.
