---
title: Policies and e-commerce disclosures
type: inventory
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - src/app/(site)/refund/page.tsx
  - src/app/(site)/shipping/page.tsx
  - src/app/(site)/terms/page.tsx
  - src/app/(site)/privacy/page.tsx
  - src/app/(site)/contact/page.tsx
  - src/app/(site)/products/kheelu/page.tsx
  - src/app/store/layout.tsx
  - src/lib/legal.ts
  - src/config/site.ts
  - src/lib/product-facts.ts
  - src/lib/email/templates.ts
  - src/features/preorder/lib/checkout.ts
  - src/lib/security-headers.ts
  - docs/store-go-live.md
  - docs/checkpoints/closed-rounds.md lines 110, 317
  - Technical-Todo.md lines 25-40, 823-831, 886-897
  - src/lib/seo.ts line 304
  - wiki/design-system/component-map.md (Footer row)
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - wiki/decisions/D011-production-held-until-gate-b.md
  - wiki/decisions/D015-founder-signs-off-copy.md
  - wiki/decisions/D020-provider-terms-and-no-sale.md
  - wiki/decisions/D021-returns-policy.md
  - wiki/decisions/D022-warranty-replacement-refund.md
  - wiki/decisions/D023-new-order-delivery.md
  - wiki/decisions/D024-payment-methods-gst.md
  - wiki/decisions/D025-speech-and-language.md
  - wiki/decisions/D029-grievance-officer-legal-review.md
  - "GET https://kheelona.com/{refund,shipping,terms,privacy,contact} and https://store.kheelona.com/ (browser UA, 2026-10-11 00:42-00:44 UTC)"
  - "https://www.legitquest.com/act/consumer-protection-e-commerce-rules-2020/91C8 (fetched 2026-10-11; re-read about 06:00 UTC the same day for Rules 4(4), 4(5), 4(10), 7(1) and 7(4); secondary source, official PDFs unreachable)"
---

# Policies and e-commerce disclosures

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

What the site promises a buyer today about refunds, cancellation, returns, delivery, warranty,
payment and who is selling, with each item's status; then what the founder **decided for the new
site** on 2026-10-10 and 2026-10-11 ([below](#decided-for-the-new-site)); then a check against the
Consumer Protection (E-Commerce) Rules 2020 as listed in brief §9.7, each item marked confirmed or
still open. **This is a check against our own documents and the rules' text, not legal advice.**
Prices and GST: [pricing](pricing.md). The checkout flow: [checkout](../site/checkout.md).

**Production keeps its current policy text until Gate B** ([D011](../decisions/D011-production-held-until-gate-b.md)),
a founder-accepted risk. The decided terms are for the new site.

All five policy pages answered 200 on 2026-10-11 and their live text matches the source. Each carries
a `TODO(counsel-review)` marker.

**Legal review: settled 2026-10-11** ([D029](../decisions/D029-grievance-officer-legal-review.md)).
The founder approves privacy, terms, refund and shipping himself, after an independent review against
Indian law and practice run by the CTO's agents (a check against the law's own text, not legal
advice; `product/legal-requirements.md`, being written). History: before that the sources conflicted.
The founder waived counsel review on 2026-07-31 and the markers were kept "as a pointer, not a
blocker" (`docs/checkpoints/closed-rounds.md:110, 317`), while the re-rating of 2026-09-12 assumed
counsel for the DPDP lines ("counsel lead time is the constraint", "wording is counsel's",
`Technical-Todo.md:35, 886-892`) and for the returns and warranty terms ("draft, have counsel look at
it, and ship the page", `Technical-Todo.md:827-829`). See
[settled decisions](../legacy/settled-decisions.md#privacy-and-data).

## Status at a glance

What production says today. The new site's terms are in [Decided for the new site](#decided-for-the-new-site).

| Policy | Status | Where | What it says | Source |
|---|---|---|---|---|
| Refund (before dispatch) | **Published** | `/refund`, `/terms`, store summary, receipt email, `FinaleCTA` | Everything paid is refundable in full any time before dispatch: the ₹499 token or the whole price. No fee, no deduction, no reason needed. Ask on WhatsApp or email with the order number. Refunded to the same card, UPI ID or account, "usually … 5 to 7 working days once we start it" | `refund/page.tsx:32, 38-39`; `terms/page.tsx:60`; `OrderSummary.tsx:49-52`; `templates.ts:148` |
| Cancellation | **Published** | `/refund`, `/terms` | Same as refund. Not paying the balance is treated as a cancellation: asked twice over two weeks, then the unit is released and the token refunded. If Kheelona cannot deliver or the ship date moves, a full refund is offered | `refund/page.tsx:49, 55`; `terms/page.tsx:69-70` |
| Returns (after dispatch) | **Missing on production**, honest placeholder. **Decided** for the new site (D021) | `/refund` | "delivery, returns, and warranty terms … are not written yet, because nothing has shipped yet. We will publish them … before your Kheelu is dispatched." Also: "A damaged or faulty Kheelu is our problem to fix" | `refund/page.tsx:65-66` |
| Exchange | **Missing**; **no ruling** for the new site either | Nowhere | No exchange policy or mention on any page (grep of `src/app`, 2026-10-11) | – |
| Warranty | **Missing on production**, placeholder. **Decided** for the new site (D022), one point still open | `/products/kheelu` FAQ, spec table | "Warranty details land closer to launch." / "Terms land closer to launch." | `products/kheelu/page.tsx:102`; `product-facts.ts:88` |
| Shipping and delivery | **Published**. Production keeps "20 October 2026" until Gate B; new orders deliver from mid-November (D023) | `/shipping`, `/terms`, store summary | Shipping starts 20 October 2026; pre-orders first, in order placed. Anywhere in India; delivery included; nothing collected at the door; no shipping outside India. No transit-time promise (deliberately: "a real tracking link" instead). Token orders dispatch once the balance is paid. Address changeable until dispatch | `shipping/page.tsx:32-61` |
| One unit per order | **Published** | `/terms` | One Kheelu per pre-order; more via WhatsApp | `terms/page.tsx:52` |
| Payment methods | **Partial on production**; only UPI seen in a real order. **Confirmed** for the new site (D024): [below](#payment-methods) | `/privacy`, `/refund`, `FinaleCTA` | "Razorpay takes the payment securely"; "Your card number, your UPI ID, and your bank details go to them". No list of methods, no fees, no chargeback info | `privacy/page.tsx:36`; `refund/page.tsx:39`; `FinaleCTA.tsx:116` |
| Seller details | **Published** | `/terms`, `/refund`, `/shipping`, `/privacy`, `/contact`, store footer, both emails | See below. One shared source (`SELLER_SECTION`) | `src/lib/legal.ts:18-24`; `site.ts:183-202` |
| Customer care | **Published** | same | WhatsApp and email; values on [facts](facts.md#support-channel) | `site.ts:174, 200-202` |
| Grievance officer | **Missing on production**. **Confirmed** for the new site (D029) | Nowhere | No name, designation or contact; flagged since 2026-08-23 for `/privacy` | `Technical-Todo.md:886-897` |
| Complaint handling times | **Missing on production**. For the new site: resolution confirmed, acknowledgement **still open** (D029) | Nowhere | No acknowledgement or resolution time stated; no complaint ticket number | grep, 2026-10-11 |
| Country of origin | **Missing** ([F3](../open-questions.md)), and `/contact` implies one: see the "designed and built here" row in [claims](claims.md#31-origin-designed-and-built-here) | – | Not stated | `product-facts.ts:42-46` |
| Total price incl. taxes | **Published** (single figure). GST invoice **confirmed** for the new site (D024) | Store summary, `/terms`, `/shipping` | "All prices include GST." "Delivery in India is included." No tax breakup | [pricing](pricing.md#tax-delivery-mrp) |
| MRP | **Missing** ([F3](../open-questions.md)) | Nowhere | No MRP is defined | [pricing](pricing.md#tax-delivery-mrp) |
| Toy-safety certification (BIS/ISI) | **Status-honest placeholder** | `/products/kheelu`, spec table, AI-toys guide | "In progress … no badge is claimed before it is earned." Detail owned by [claims](claims.md) | `product-facts.ts:89-93`; `ai-toys…/page.tsx:116` |
| Governing law | **Published** | `/terms` | Indian law; courts at Bengaluru | `terms/page.tsx:82` |
| Data retention and deletion | **Partial on production**. Retention period **confirmed** for the new site (D020) | `/privacy` | Order record kept for tax accounts even after a refund; everything else deleted on request. No retention period stated | `privacy/page.tsx:56, 196` |
| Consent | **Compliant with own design** | Store form | One required tick, **not pre-ticked** (live HTML), stored with a timestamp | `PreorderForm.tsx:236-241`; `create-order/route.ts:98-99` |

## Decided for the new site

Founder rulings of 2026-10-10 and 2026-10-11. **Confirmed** means the founder has stated the fact;
**Still open** means no ruling yet, so nothing is published for it. Final copy is signed off by the
founder at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)); the draft lines are in each
decision, not repeated here. The returns, warranty and payment terms go on the policy pages AND next
to the CTA, from one content source (Phase 4; [D021](../decisions/D021-returns-policy.md)).

| Item | Term for the new site | Status | Decision |
|---|---|---|---|
| Returns | Within 7 days of delivery, no questions asked. Opened is fine if there is no physical damage and every component comes back, including the box. "Of delivery" is the applied reading (a pre-order cannot start the clock at payment); the founder may correct it | **Confirmed** | [D021](../decisions/D021-returns-policy.md) |
| Faulty on arrival | Replaced if reported within 7 days of receipt. No replacement timeline is published (it depends on where in India the parent is) | **Confirmed** | [D022](../decisions/D022-warranty-replacement-refund.md) |
| Warranty | 6 months on manufacturing defects; not drops, water or misuse | **Confirmed**. **Still open:** the remedy for a defect found after the first 7 days (repair or replace); until then the copy says only "6-month warranty on manufacturing defects" (F1) | [D022](../decisions/D022-warranty-replacement-refund.md) |
| Return pickup | We arrange it | **Confirmed**. **Still open:** who pays. Never write "free pickup" (F1) | [D022](../decisions/D022-warranty-replacement-refund.md) |
| Refund after a return | Within 7 working days of the unit reaching us, if it is eligible for return | **Confirmed** | [D022](../decisions/D022-warranty-replacement-refund.md) |
| Refund and cancellation before dispatch | The production terms (first two rows above) | No new ruling; unchanged | – |
| Exchange | None stated | **Still open** (not yet asked; Rule 7(1)(a) asks for exchange information) | – |
| Delivery, new orders | Deliveries start mid-November 2026, with the same ₹499 advance. One content value that every surface renders, never hand-typed (the date is owned on [facts](facts.md#ship-date)). Never a transit-time or replacement timeline | **Confirmed** | [D023](../decisions/D023-new-order-delivery.md) |
| Delivery, production | Production keeps showing "20 October 2026" on the marketing pages, in checkout and in the receipt email until Gate B. Founder-accepted risk; do not re-raise | **Confirmed** (held) | [D023](../decisions/D023-new-order-delivery.md), [D011](../decisions/D011-production-held-until-gate-b.md) |
| Delivery, existing token orders | Whether they still dispatch from 20 October; when and how the ₹4,500 balance link arrives | **Still open** (F12) | [D023](../decisions/D023-new-order-delivery.md) |
| Payment methods | UPI, debit and credit cards, net banking. Wallets, EMI and Pay Later are not offered, so the site never mentions them. No cash on delivery (production has no COD path; [below](#payment-methods)) | **Confirmed** | [D024](../decisions/D024-payment-methods-gst.md) |
| GST | Prices include GST and every price says "incl. GST" where it appears; every buyer gets a GST invoice. Detail: [pricing](pricing.md#tax-delivery-mrp) | **Confirmed** | [D024](../decisions/D024-payment-methods-gst.md) |
| Grievance officer | Aman Soni, Co-Founder and CTO, aman@kheelona.com. Where it is displayed is not decided (Rule 4(4) says "on its platform") | **Confirmed** | [D029](../decisions/D029-grievance-officer-legal-review.md) |
| Complaint resolution time | Within 30 days (note under the rules table) | **Confirmed** | [D029](../decisions/D029-grievance-officer-legal-review.md) |
| Complaint acknowledgement time | 5 days proposed; Rule 4(5) requires 48 hours. Nothing is published until the founder decides the wording | **Still open** (F2) | [D029](../decisions/D029-grievance-officer-legal-review.md) |
| Complaint ticket number | None stated | **Still open** (not yet asked; Rule 7(1)(f)) | – |
| Data retention | Conversation transcripts kept 36 months, then deleted automatically; a parent can delete any sooner, in one tap. The same period goes on `/privacy` as the DPDP retention line. Owned on [facts](facts.md) | **Confirmed** | [D020](../decisions/D020-provider-terms-and-no-sale.md) |
| Legal pages sign-off | The founder approves privacy, terms, refund and shipping after an independent review against Indian law and practice | **Confirmed** | [D029](../decisions/D029-grievance-officer-legal-review.md) |
| Speech and language disclaimer | On `/terms` and on Meet Kheelu (`/products/kheelu`); not on Home | **Confirmed** | [D025](../decisions/D025-speech-and-language.md) |
| Country of origin, MRP, manufacturer or importer, other Legal Metrology declarations | None stated | **Still open** (F3) | – |

## Seller details (as published)

| Field | Value | Source |
|---|---|---|
| Legal entity | Kheelona Robotics Private Limited | `site.ts:183` |
| GSTIN | 29AAMCK1530E1ZN | `site.ts:184` |
| Registered address | 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India | `site.ts:185-193` |
| Support | WhatsApp and email, printed in the same block; values on [facts](facts.md#support-channel) | `site.ts:174, 200-202` |
| Website | kheelona.com; payments on store.kheelona.com | `site.ts:21` |

Founder-supplied 2026-08-22 from the GST registration certificate (`site.ts:178-182`). No ruling
changes the seller details for the new site.

## Payment methods

**Confirmed for the new site** ([D024](../decisions/D024-payment-methods-gst.md), founder
2026-10-10): UPI, debit and credit cards, and net banking are enabled on Razorpay. Wallets, EMI and
Pay Later are not offered, so the site never mentions them. Brief 9.1 says show only methods we
actually offer.

On production only UPI has been seen in a real order. The code opens standard Razorpay Checkout with
no method filter, so the Razorpay account settings decide what the sheet shows
(`src/features/preorder/lib/checkout.ts:81-95`).

| Method | Offered? | Evidence |
|---|---|---|
| UPI | **Yes** (D024). The one real order (₹499, 2026-08-22, refunded) was paid by UPI | `docs/store-go-live.md:62-76` |
| Debit and credit cards | **Yes** (D024). Production `/privacy` and `/refund` wording implies it; no real card payment recorded | `privacy/page.tsx:36`; `refund/page.tsx:39` |
| Net banking | **Yes** (D024). No real payment recorded | founder, 2026-10-10 |
| Google Pay (inside Razorpay on Android) | Allowed by the CSP. Not ruled on separately: D024 names UPI, cards and net banking only | `src/lib/security-headers.ts:70-71, 164` |
| Wallets, EMI, Pay Later | **No** (D024); never mentioned on the site | founder, 2026-10-10 |
| Cash on delivery | **No.** Payment is online and upfront; no COD path exists | `create-order/route.ts`; `PreorderForm.tsx` |
| Balance (₹4,500) | Manual Razorpay payment link, sent on WhatsApp and email before dispatch. What the code does with it: [checkout](../site/checkout.md#the-balance-step-4500). Timing and channel for existing orders: F12 | `shipping/page.tsx:46-47`; `docs/store-go-live.md:96-97` |

Nothing is ever charged automatically and no card is stored (`terms/page.tsx:33`;
`shipping/page.tsx:47`).

## Check against the E-Commerce Rules 2020 (brief §9.7)

Kheelona sells its own stock on its own site (an inventory model). Rule wording is from a secondary
source (LegitQuest, fetched 2026-10-11 and re-read the same day) because the official PDFs did not
load; amendments since 2020 were not checked. The independent review against the official text is
`product/legal-requirements.md` (being written, [D029](../decisions/D029-grievance-officer-legal-review.md)).

| Requirement | Rule (per source) | Production today (IDs are in [open questions](../open-questions.md)) | New site (rulings 2026-10-10/11) |
|---|---|---|---|
| Legal name, address, website, customer-care contacts | 4(2)(a)-(d) | **Met** on five pages, store footer and emails | **Confirmed**: unchanged |
| Grievance officer's name, designation and contact displayed | 4(2)(d), 4(4) | **Not met** | **Confirmed**: Aman Soni, Co-Founder and CTO, aman@kheelona.com (D029). Where it is displayed: not decided |
| Acknowledge complaints in 48 hours, resolve in one month | 4(5) | **Not stated** | Resolve: **confirmed**, 30 days (note 1). Acknowledge: **still open**, 5 days proposed against the rule's 48 hours (F2) |
| No pre-ticked consent | 4(9) | **Met** | **Confirmed**: checkout logic unchanged (brief 4.4) |
| Refunds paid per RBI rules | 4(10) | Process stated ("5 to 7 working days once we start it"); start time not stated | After a return: **confirmed**, within 7 working days of the unit reaching us (D022). Before dispatch: production terms, no new ruling |
| Return, refund, exchange, warranty, delivery, return-shipping cost, payment modes, grievance mechanism | 7(1)(a) | Refund, cancellation, delivery **met**; returns, exchange, warranty, return-shipping cost, grievance **not met** | Returns, faulty-unit replacement, refund timing **confirmed** (D021, D022). Warranty **confirmed**, remedy after 7 days **still open** (F1). Delivery for new orders **confirmed** (D023); existing token orders **still open** (F12). Return shipping: we arrange pickup (**confirmed**), who pays **still open** (F1). Payment modes **confirmed** (D024). Grievance: officer **confirmed**, acknowledgement **still open** (F2). Exchange **still open** (not yet asked) |
| Payment methods, their security, fees, chargeback options, payment provider contact | 7(1)(c) | **Partial**: Razorpay named, security described; no list of methods, fees, chargebacks or Razorpay contact | Methods **confirmed** (D024). Fees, chargeback options and Razorpay's contact **still open** (not yet asked) |
| Total price as a single figure with breakup of charges and taxes | 7(1)(e) | **Partial**: single GST-inclusive figure, delivery included; no tax breakup | GST-inclusive single figure and a GST invoice with every order **confirmed** (D024). A breakup of charges and taxes on the site before purchase: **still open** (not yet asked) |
| Complaint ticket number | 7(1)(f) | **Not met** (WhatsApp and email only) | **Still open** (not yet asked) |
| No refusal to take back or refund goods that are defective or delivered late | 7(4) (note 2) | Before dispatch: full refund at any time, and if the ship date moves (cancellation row) | Returns 7 days, faulty replaced within 7 days, 6-month warranty (D021, D022). How a defect found after 7 days is handled: **still open** (F1) |
| Country of origin | brief §9.7 (source places it at 6(5)(d), seller duties) | **Not met**; `/contact` implies one ([claims](claims.md#31-origin-designed-and-built-here)) | **Still open** (F3) |
| MRP inclusive of all taxes | brief §9.7 | **Not met**: no MRP defined | **Still open** (F3) |
| Declarations usually shown beside the MRP on an e-commerce listing: manufacturer or importer name and address, net quantity, month and year of manufacture, consumer-care contact | Legal Metrology (Packaged Commodities) Rules 2011, not the E-Commerce Rules; rule text **not fetched or checked** here (the D029 review covers it) | **Not checked**. Our documents: a consumer-care contact is published (seller block); no manufacturer or importer address, net quantity or manufacture date appears on any page (grep of `src/` at the tag, 2026-10-10). The Product JSON-LD names Kheelona's own organisation as `manufacturer` (`seo.ts:304`) | **Still open** (F3) |

**Note 1, "30 days" and "one month".** Rule 4(5) says the officer "redresses the complaint within
one month from the date of receipt of the complaint". 30 days is the same or shorter in most months,
but if a month is read as a calendar month (our reading; the D029 review should confirm), a complaint
received on 1 February has until 1 March, 28 days later, so a published "30 days" would run past the
rule. Writing "within one month" matches the rule's own words. The acknowledgement time is the
separate open point above.

**Note 2, Rule 7(4).** The source quotes it as "No inventory e-commerce entity shall refuse to take
back goods", applying, among other cases, "if such goods or services are delivered late from the
stated delivery schedule"; per the source's summary it also covers defective, spurious or
misdescribed goods, with late delivery caused by force majeure excluded. The text as fetched sets no
time limit for defective goods. Two consequences for the record, not new decisions: (a) the 7-day
replacement window and the 6-month warranty describe our process and should not read as the only
remedy for a defective unit, which is why the open F1 point (remedy after 7 days) matters; (b) the
production "20 October" date (held under D023) sits alongside a production promise of a full refund
if the ship date moves. Both are for the D029 review to confirm against the official text.

## Dates that matter

- **5 October 2026 has passed**: the founder's dated trigger moved the returns and warranty terms and
  the two DPDP lines (retention period, grievance contact) on `/privacy` from LOW to HIGH on that day
  (`Technical-Todo.md:25-40`). For the new site they are now decided ([above](#decided-for-the-new-site);
  F1 and F2 each keep one open point). Production keeps its placeholders until Gate B
  ([D011](../decisions/D011-production-held-until-gate-b.md)).
- **20 October 2026** is production's published ship date (`site.ts:138`). New orders deliver from
  mid-November ([D023](../decisions/D023-new-order-delivery.md)), and production keeps showing
  20 October until Gate B (founder-accepted). `/refund` promises the returns and warranty terms
  "before your Kheelu is dispatched" (`refund/page.tsx:65`), so any dispatch before Gate B makes
  `/refund` and `/products/kheelu` on production wrong (`Technical-Todo.md:823-831`); D011 accepts
  that. Whether existing token orders dispatch from 20 October: F12.

## Proposals not in force

- **Positioning (SKM)** answered objections with "If it isn't loved, 15-day returns" and "[1-year]
  warranty and 15-day returns", the brackets marking "needs product confirmation"
  (`Kheelona Positioning Strategy.docx`, objection-answers table). **Superseded** by the founder's
  7-day returns and 6-month warranty ([D021](../decisions/D021-returns-policy.md),
  [D022](../decisions/D022-warranty-replacement-refund.md)); SKM's figures are never used.
- **DS** trust-signal and footer rules (policy links near the price; the footer's "made" line):
  [DS component map](../design-system/component-map.md). Any origin wording is held on
  [claims](claims.md#31-origin-designed-and-built-here) until F3 is answered.

## Related

[Pricing](pricing.md) · [Checkout](../site/checkout.md) · [Claims](claims.md) ·
[Product facts](facts.md) · [Settled decisions](../legacy/settled-decisions.md)
