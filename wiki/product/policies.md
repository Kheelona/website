---
title: Policies and e-commerce disclosures
type: inventory
updated: 2026-10-10
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
  - "GET https://kheelona.com/{refund,shipping,terms,privacy,contact} and https://store.kheelona.com/ (browser UA, 2026-10-11 00:42-00:44 UTC)"
  - "https://www.legitquest.com/act/consumer-protection-e-commerce-rules-2020/91C8 (fetched 2026-10-11; secondary source, official PDFs unreachable)"
---

# Policies and e-commerce disclosures

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

What the site promises a buyer today about refunds, cancellation, returns, delivery, warranty,
payment and who is selling, with each item's status, then a check against the Consumer Protection
(E-Commerce) Rules 2020 as listed in brief §9.7. **This is a check against our own documents, not legal
advice.** Prices and GST: [pricing](pricing.md). The checkout flow: [checkout](../site/checkout.md).

All five policy pages answered 200 on 2026-10-11 and their live text matches the source. Each carries
a `TODO(counsel-review)` marker.

**Counsel review: the sources conflict, so treat it as unresolved.** The founder waived counsel review
on 2026-07-31 and the markers were kept "as a pointer, not a blocker"
(`docs/checkpoints/closed-rounds.md:110, 317`). The later re-rating of 2026-09-12, marked as the
founder's, assumes counsel is involved in the two items still open: for the DPDP lines "counsel lead time is the constraint" and
"wording is counsel's" (`Technical-Todo.md:35, 886-892`); for the returns and warranty terms, "draft,
have counsel look at it, and ship the page" (`Technical-Todo.md:827-829`). See
[settled decisions](../legacy/settled-decisions.md#privacy-and-data) and
[open questions](../open-questions.md) F2.

## Status at a glance

| Policy | Status | Where | What it says | Source |
|---|---|---|---|---|
| Refund (before dispatch) | **Published** | `/refund`, `/terms`, store summary, receipt email, `FinaleCTA` | Everything paid is refundable in full any time before dispatch: the ₹499 token or the whole price. No fee, no deduction, no reason needed. Ask on WhatsApp or email with the order number. Refunded to the same card, UPI ID or account, "usually … 5 to 7 working days once we start it" | `refund/page.tsx:32, 38-39`; `terms/page.tsx:60`; `OrderSummary.tsx:49-52`; `templates.ts:148` |
| Cancellation | **Published** | `/refund`, `/terms` | Same as refund. Not paying the balance is treated as a cancellation: asked twice over two weeks, then the unit is released and the token refunded. If Kheelona cannot deliver or the ship date moves, a full refund is offered | `refund/page.tsx:49, 55`; `terms/page.tsx:69-70` |
| Returns (after dispatch) | **Missing, honest placeholder** ([F1](../open-questions.md)) | `/refund` | "delivery, returns, and warranty terms … are not written yet, because nothing has shipped yet. We will publish them … before your Kheelu is dispatched." Also: "A damaged or faulty Kheelu is our problem to fix" | `refund/page.tsx:65-66` |
| Exchange | **Missing** ([F1](../open-questions.md)) | Nowhere | No exchange policy or mention on any page (grep of `src/app`, 2026-10-11) | – |
| Warranty | **Missing, placeholder** ([F1](../open-questions.md)) | `/products/kheelu` FAQ, spec table | "Warranty details land closer to launch." / "Terms land closer to launch." | `products/kheelu/page.tsx:102`; `product-facts.ts:88` |
| Shipping and delivery | **Published** | `/shipping`, `/terms`, store summary | Shipping starts 20 October 2026; pre-orders first, in order placed. Anywhere in India; delivery included; nothing collected at the door; no shipping outside India. No transit-time promise (deliberately: "a real tracking link" instead). Token orders dispatch once the balance is paid. Address changeable until dispatch | `shipping/page.tsx:32-61` |
| One unit per order | **Published** | `/terms` | One Kheelu per pre-order; more via WhatsApp | `terms/page.tsx:52` |
| Payment methods | **Partial**; only UPI proven ([below](#payment-methods); [F6](../open-questions.md)) | `/privacy`, `/refund`, `FinaleCTA` | "Razorpay takes the payment securely"; "Your card number, your UPI ID, and your bank details go to them". No list of methods, no fees, no chargeback info | `privacy/page.tsx:36`; `refund/page.tsx:39`; `FinaleCTA.tsx:116` |
| Seller details | **Published** | `/terms`, `/refund`, `/shipping`, `/privacy`, `/contact`, store footer, both emails | See below. One shared source (`SELLER_SECTION`) | `src/lib/legal.ts:18-24`; `site.ts:183-202` |
| Customer care | **Published** | same | WhatsApp and email; values on [facts](facts.md#support-channel) | `site.ts:174, 200-202` |
| Grievance officer | **Missing** ([F2](../open-questions.md)) | Nowhere | No name, designation or contact; flagged since 2026-08-23 for `/privacy` | `Technical-Todo.md:886-897` |
| Complaint handling times | **Missing** ([F2](../open-questions.md)) | Nowhere | No acknowledgement or resolution time stated; no complaint ticket number | grep, 2026-10-11 |
| Country of origin | **Missing** ([F3](../open-questions.md)), and `/contact` implies one: see the "designed and built here" row in [claims](claims.md#31-origin-designed-and-built-here) | – | Not stated | `product-facts.ts:42-46` |
| Total price incl. taxes | **Published** (single figure) | Store summary, `/terms`, `/shipping` | "All prices include GST." "Delivery in India is included." No tax breakup | [pricing](pricing.md#tax-delivery-mrp) |
| MRP | **Missing** ([F3](../open-questions.md)) | Nowhere | No MRP is defined | [pricing](pricing.md#tax-delivery-mrp) |
| Toy-safety certification (BIS/ISI) | **Status-honest placeholder** | `/products/kheelu`, spec table, AI-toys guide | "In progress … no badge is claimed before it is earned." Detail owned by [claims](claims.md) | `product-facts.ts:89-93`; `ai-toys…/page.tsx:116` |
| Governing law | **Published** | `/terms` | Indian law; courts at Bengaluru | `terms/page.tsx:82` |
| Data retention and deletion | **Partial** ([F2](../open-questions.md)) | `/privacy` | Order record kept for tax accounts even after a refund; everything else deleted on request. No retention period stated | `privacy/page.tsx:56, 196` |
| Consent | **Compliant with own design** | Store form | One required tick, **not pre-ticked** (live HTML), stored with a timestamp | `PreorderForm.tsx:236-241`; `create-order/route.ts:98-99` |

## Seller details (as published)

| Field | Value | Source |
|---|---|---|
| Legal entity | Kheelona Robotics Private Limited | `site.ts:183` |
| GSTIN | 29AAMCK1530E1ZN | `site.ts:184` |
| Registered address | 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India | `site.ts:185-193` |
| Support | WhatsApp and email, printed in the same block; values on [facts](facts.md#support-channel) | `site.ts:174, 200-202` |
| Website | kheelona.com; payments on store.kheelona.com | `site.ts:21` |

Founder-supplied 2026-08-22 from the GST registration certificate (`site.ts:178-182`).

## Payment methods

**Only UPI is proven**, by the one real order. Everything else is either implied by our copy or set in
the Razorpay dashboard, which the repo cannot see. Brief 9.1 says show only methods we actually offer,
so the enabled list is [open questions](../open-questions.md) F6.

| Method | Offered? | Evidence |
|---|---|---|
| UPI | **Yes, proven**: the one real order (₹499, 2026-08-22, refunded) was paid by UPI | `docs/store-go-live.md:62-76` |
| Cards | Implied by `/privacy` and `/refund` wording; **not proven** (F6) | `privacy/page.tsx:36`; `refund/page.tsx:39` |
| Google Pay (inside Razorpay on Android) | Allowed by the CSP; **not proven** (F6) | `src/lib/security-headers.ts:70-71, 164` |
| Net banking, wallets, EMI, Pay Later | **Not known from the repo** (F6). The code opens standard Razorpay Checkout with no method filter, so the Razorpay account settings decide | `src/features/preorder/lib/checkout.ts:81-95` |
| Cash on delivery | **No.** Payment is online and upfront; no COD path exists | `create-order/route.ts`; `PreorderForm.tsx` |
| Balance (₹4,500) | Manual Razorpay payment link, sent on WhatsApp and email before dispatch. What the code does with it: [checkout](../site/checkout.md#the-balance-step-4500) | `shipping/page.tsx:46-47`; `docs/store-go-live.md:96-97` |

Nothing is ever charged automatically and no card is stored (`terms/page.tsx:33`;
`shipping/page.tsx:47`).

## Check against the E-Commerce Rules 2020 (brief §9.7)

Kheelona sells its own stock on its own site (an inventory model). Rule wording is from a secondary
source (LegitQuest, fetched 2026-10-11) because the official PDFs did not load; amendments since 2020
were not checked.

| Requirement | Rule (per source) | Our status (IDs are in [open questions](../open-questions.md)) |
|---|---|---|
| Legal name, address, website, customer-care contacts | 4(2)(a)-(d) | **Met** on five pages, store footer and emails |
| Grievance officer's name, designation and contact displayed | 4(2)(d), 4(4) | **Not met** (F2) |
| Acknowledge complaints in 48 hours, resolve in one month | 4(5) | **Not stated** (F2) |
| No pre-ticked consent | 4(9) | **Met** |
| Refunds paid per RBI rules | 4(10) | Process stated ("5 to 7 working days once we start it"); start time not stated |
| Return, refund, exchange, warranty, delivery, return-shipping cost, payment modes, grievance mechanism | 7(1)(a) | Refund, cancellation, delivery **met**; returns, exchange, warranty, return-shipping cost (F1), grievance (F2) **not met** |
| Payment methods, their security, fees, chargeback options, payment provider contact | 7(1)(c) | **Partial**: Razorpay named, security described; methods (F6), fees, chargebacks, Razorpay contact not stated |
| Total price as a single figure with breakup of charges and taxes | 7(1)(e) | **Partial**: single GST-inclusive figure, delivery included; no tax breakup |
| Complaint ticket number | 7(1)(f) | **Not met** (WhatsApp and email only; F2) |
| Country of origin | brief §9.7 (source places it at 6(5)(d), seller duties) | **Not met** (F3); `/contact` implies one ([claims](claims.md#31-origin-designed-and-built-here)) |
| MRP inclusive of all taxes | brief §9.7 | **Not met** (F3): no MRP defined |
| Declarations usually shown beside the MRP on an e-commerce listing: manufacturer or importer name and address, net quantity, month and year of manufacture, consumer-care contact | Legal Metrology (Packaged Commodities) Rules 2011, not the E-Commerce Rules; rule text **not fetched or checked** | **Not checked** (F3). Our documents: a consumer-care contact is published (seller block); no manufacturer or importer address, net quantity or manufacture date appears on any page (grep of `src/` at the tag, 2026-10-10). The Product JSON-LD names Kheelona's own organisation as `manufacturer` (`seo.ts:304`) |

## Dates that matter

- **5 October 2026 has passed**: the founder's dated trigger moved returns/warranty terms and the two
  DPDP lines (retention period, grievance contact) on `/privacy` from LOW to HIGH on that day
  (`Technical-Todo.md:25-40`). Both are still open on 2026-10-10: [open questions](../open-questions.md)
  F1 and F2; whether they go out on production before Gate B is Q3.
- **20 October 2026** is the published ship date (`site.ts:138`). `/refund` promises the returns and
  warranty terms "before your Kheelu is dispatched" (`refund/page.tsx:65`), so the first dispatch
  without them makes `/refund` and `/products/kheelu` wrong (`Technical-Todo.md:823-831`). Whether the
  ship date still holds: F12.

## Proposals not in force

- **Positioning (SKM)** answers objections with "If it isn't loved, 15-day returns" and "[1-year]
  warranty and 15-day returns", the brackets marking "needs product confirmation"
  (`Kheelona Positioning Strategy.docx`, objection-answers table). Neither is site policy; both are
  held on [claims](claims.md#31-origin-designed-and-built-here) until F1 is answered.
- **DS** trust-signal and footer rules (policy links near the price; the footer's "made" line):
  [DS component map](../design-system/component-map.md). Any origin wording is held on
  [claims](claims.md#31-origin-designed-and-built-here) until F3 is answered.

## Related

[Pricing](pricing.md) · [Checkout](../site/checkout.md) · [Claims](claims.md) ·
[Product facts](facts.md) · [Settled decisions](../legacy/settled-decisions.md)
