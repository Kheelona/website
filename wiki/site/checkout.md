---
title: Checkout journey (store.kheelona.com)
type: inventory
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - src/app/store/page.tsx
  - src/app/store/layout.tsx
  - src/app/store/thanks/page.tsx
  - src/app/store/e/[event]/page.tsx
  - src/app/store/ideabaaz/page.tsx
  - src/app/store/[...rest]/page.tsx
  - src/app/api/preorder/create-order/route.ts
  - src/app/api/preorder/confirm/route.ts
  - src/app/api/preorder/address/route.ts
  - src/app/api/razorpay/webhook/route.ts
  - src/app/api/health/route.ts
  - src/features/preorder/components/{PreorderForm,OrderSummary,AddressForm}.tsx
  - src/features/preorder/lib/{checkout,validate,india,analytics}.ts
  - src/lib/store/{mode,tiers,env,razorpay,signing,order-ref,thanks-session,host,fulfil,rate-limit,http,meta-capi,posthog-server,db}.ts
  - src/lib/email/{templates,send}.ts
  - src/proxy.ts
  - src/config/site.ts
  - supabase/migrations/0001-0004
  - docs/store-go-live.md
  - docs/preorder-events.md
  - docs/website-steps.md §8.25, §8.26 (lines 709-1037)
  - Technical-Todo.md lines 1030-1040
  - "mid: diff of src/app/store, src/features/preorder, src/lib/store against the tag"
  - "https://razorpay.com/docs/webhooks/payment-links.md and https://razorpay.com/docs/webhooks/payments.md (fetched 2026-10-10)"
  - "GET https://kheelona.com/api/health, https://store.kheelona.com/, /thanks, /e/example, /ideabaaz, https://kheelona.com/store (browser UA, 2026-10-11 00:42-00:51 UTC)"
  - "wt: src/config/site.ts, src/features/preorder/components/OrderSummary.tsx, src/app/store/thanks/page.tsx, src/lib/email/templates.ts (working tree of reset/website-v2, read 2026-10-11)"
  - wiki/decisions/D011-production-held-until-gate-b.md
  - wiki/decisions/D021-returns-policy.md
  - wiki/decisions/D022-warranty-replacement-refund.md
  - wiki/decisions/D023-new-order-delivery.md
  - wiki/decisions/D024-payment-methods-gst.md
  - wiki/decisions/D027-story-mode-wording.md
  - wiki/decisions/D028-price-wording.md
  - wiki/decisions/D029-grievance-officer-legal-review.md
---

# Checkout journey

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`; `wt:path:line` refers to the working tree of `reset/website-v2`, read 2026-10-11.

Every step from a CTA tap on kheelona.com to the paid confirmation, the receipt email and the address
link. The tag is production `77552ff`. Prices, the mode and what the client
may send live on [pricing](../product/pricing.md); refund, shipping and seller policies on
[policies](../product/policies.md); event IDs and parameters on
[tracking inventory](tracking-inventory.md). This page names events only to place them in the journey.

## In one screen

- **There is no cart and no account.** A CTA goes straight to `https://store.kheelona.com` in one tap
  (`PREORDER_HREF = STORE_URL`, `src/config/site.ts:21-25`). The store page *is* the checkout: one
  form, then Razorpay's sheet.
- **One product, one unit per order, one price per request.** The server decides the amount from the
  tier; the browser never sends a price ([pricing](../product/pricing.md)).
- **Two ways an order becomes paid, one function:** the browser callback (fast) and the Razorpay
  webhook (guaranteed), both through the idempotent `markPaid` (`src/lib/store/fulfil.ts:58-196`).
- **The address comes after payment**, on `/thanks`, authorised only by a signed 30-day token
  (`src/lib/store/signing.ts:38-64`).
- **New-site copy rulings (2026-10-10/11)** change what the checkout SAYS, never how it works:
  the price sentence, the trust terms beside the pay button, the delivery date for new orders, and
  the receipt's Kheelona+ line ([below](#copy-the-new-checkout-carries)). Production keeps its text
  until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)).
- **Live today: token mode, live Razorpay keys, email and CAPI configured**
  (`/api/health`, fetched 2026-10-11 00:42 UTC:
  `{"ok":true,"store":"ready","preorder":"token","razorpay":"live","email":"configured","capi":"configured"}`).

## The brief's funnel, mapped

The brief's funnel is landing → product page → add to cart → checkout started → purchase
(brief §9.1). Kheelona has **no cart step**, so "add to cart" has no equivalent event in any tool.

| Brief stage | What it is here | Host and path | Events fired today (names only) |
|---|---|---|---|
| Landing | Any marketing page | `kheelona.com/*` | Page views; the proxy stores UTMs and `fbclid` in first-party cookies (`src/proxy.ts:38-45, 111-185`) |
| Product page | `/products/kheelu` | `kheelona.com` | Meta `ViewContent` (`src/app/(site)/products/kheelu/_components/ViewContentTracker.tsx:51-55`) |
| Add to cart | **No cart.** Nearest signals: CTA tap, store page view, first keystroke in the form | `store.kheelona.com/` | PostHog autocapture with `cta` attribute (`src/components/atoms/Button.tsx:86`); `preorder_form_started` (`src/features/preorder/lib/analytics.ts:64-67`) |
| Checkout started | Validated submit, server order, Razorpay sheet | `store.kheelona.com/` + Razorpay modal | `preorder_start`, then `begin_checkout` + Meta `InitiateCheckout` (`analytics.ts:70-79`) |
| Purchase | Razorpay success | `store.kheelona.com/thanks` | Browser: `purchase` (GA4, PostHog), Meta `Purchase` with `eventID`. Server: Meta CAPI `Purchase`, PostHog `purchase_confirmed` (`fulfil.ts:338-351`) |
| (after purchase) | Address saved | `store.kheelona.com/thanks` | `preorder_address_saved` (`analytics.ts:126-129`) |

Note: `begin_checkout` / `InitiateCheckout` fire **before** Razorpay's script loads and the sheet opens
(`PreorderForm.tsx:138-141`), so they also count attempts where the sheet failed to open. The comment
at `analytics.ts:74` says "the sheet actually opened"; the code does not wait for that. Do not change
it (tracking parity); read the funnel with it in mind.

## Step by step

| # | Step | Host / URL | What the parent sees or does | What happens on the server | Source |
|---|---|---|---|---|---|
| 1 | Taps a pre-order CTA (label: [messaging](../brand/messaging.md#cta-labels)) | `kheelona.com/<page>` → `https://store.kheelona.com` | 6 store links on Home, 5 on `/products/kheelu` (live, 2026-10-11) | None; plain link, no query string carried | `site.ts:21-25, 94`; live HTML |
| 2 | Request reaches the store host | `store.kheelona.com/` | Nothing visible | `src/proxy.ts` rewrites the host onto internal `/store/*`, adds `x-robots-tag: noindex, nofollow`; apex `/store/*` 308s to the store host (live: `kheelona.com/store` → 308) | `src/proxy.ts:84-94`; `src/lib/store/host.ts:39-85` |
| 3 | Store page renders | `store.kheelona.com/` (`force-dynamic`) | Kicker "Pre-order", h1 "Reserve Kheelu for ₹499." (token) or "Pre-order Kheelu for ₹7,999." (full), small product image, the form, then "What you are agreeing to" (`OrderSummary`), then the video section. Own chrome: wordmark, "Need help? WhatsApp us", policy links to kheelona.com, seller block | `preorderMode()` counts paid non-full orders on every request; tier chosen; amount formatted on the server | `src/app/store/page.tsx:45-126`; `layout.tsx:33-95` |
| 4 | Fills the form (4 fields + 1 tick, table below) | same | First change to any field | `preorder_form_started` (client) | `PreorderForm.tsx:77-82, 193-241` |
| 5 | Taps "Pay ₹499 and reserve" (or "Pay ₹7,999 and pre-order") | same | Errors shown inline and scrolled into view; button reads "Setting up your payment…" | Client validates with the same functions the server uses; `preorder_start`; `POST /api/preorder/create-order` with contact fields, `tier`, optional `signature`, `utm`, `phDistinctId`. **No amount.** | `PreorderForm.tsx:84-128`; `validate.ts:58-92` |
| 6 | (server) create-order | `/api/preorder/create-order` | – | Rate limit (8/min per IP, per instance) → `resolveTier` (price, cap, expiry) → validate → insert `preorders` row `status='created'` **first** → create Razorpay order (`receipt` and `notes.order_ref` = our ref) → attach `rzp_order_id` → return `orderRef`, `razorpayOrderId`, `keyId`, `amountPaise`, signed `addressToken`, prefill | `create-order/route.ts:38-176`; `razorpay.ts:27-56`; `rate-limit.ts:20-42` |
| 7 | Razorpay sheet opens | Razorpay modal over the store page | Button: "Opening the payment window…". Razorpay's own UI, prefilled name/email/phone, header tinted `#EF762F`, name "Kheelona", description "Kheelu pre-order KH-…" | `checkout.js` loaded on first submit only (never on page load); `begin_checkout` + `InitiateCheckout` | `src/features/preorder/lib/checkout.ts:13-99` |
| 8 | Pays: UPI, debit or credit card, or net banking (founder, [D024](../decisions/D024-payment-methods-gst.md); [policies](../product/policies.md#payment-methods)). Only UPI has been seen in a real order | Razorpay | – | Razorpay captures | – |
| 9 | Success | browser | Redirect to `/thanks?ref=KH-…&t=<token>` | `onPaid`: browser `purchase` + Meta `Purchase`; background `POST /api/preorder/confirm` (verifies Razorpay's HMAC, then `markPaid` + `notifyPaid`) | `PreorderForm.tsx:154-173`; `confirm/route.ts:21-62` |
| 10 | Token leaves the URL | `store.kheelona.com/thanks` | Lands on a clean `/thanks` | Proxy validates the `ref` + token shape, sets HttpOnly cookie `kh_order` (2 h, path `/thanks`), 303 to `/thanks`, `cache-control: private, no-store` | `proxy.ts:60-82`; `thanks-session.ts:24-56` |
| 11 | Confirmation page | `store.kheelona.com/thanks` | "Pre-order confirmed / Your Kheelu is reserved." (or "Confirming your payment" until paid), order number, paid today, due on dispatch, ships from, then the address form | Reads the order **row** (never the current mode), verifies the token from the cookie. "Ships from" is the config value `SHIP_DATE_TEXT`, not the row (`wt:src/app/store/thanks/page.tsx:159`) | `thanks/page.tsx:60-185` |
| 12 | Enters address (table below) | same | "Save my address" → "We have your address." | `POST /api/preorder/address` with `orderRef`, `token`, address; allowed while `created` or `paid`; `preorder_address_saved` | `AddressForm.tsx:40-87`; `address/route.ts:24-88` |
| 13 | (server) Webhook, the guaranteed path | `POST /api/razorpay/webhook` (any host; `/api` is outside the proxy matcher) | – | Verify HMAC on the raw body → claim event id in `webhook_events` → `order.paid` / `payment.captured` → `markPaid`; `refund.processed` → `markRefunded`; `payment.failed` → `markFailed`; on error, release the claim and answer 500 so Razorpay retries | `webhook/route.ts:34-170` |
| 14 | Receipt and alerts, exactly once | Email | Acknowledgement email "Your Kheelu is reserved (KH-…)": what was paid, what is due and when, ships-from date, address link if none yet, refund promise, Kheelona+ line, seller block. From `Kheelona <hello@send.kheelona.com>` by default, reply-to `hello@kheelona.com` | `notifyPaid` runs only when `markPaid` returns `paid`: receipt to the parent, internal alert to `ORDER_ALERT_EMAIL`, Meta CAPI `Purchase`, PostHog `purchase_confirmed`. Never throws | `fulfil.ts:324-358`; `templates.ts:103-185`; `env.ts:100-104` |
| 15 | Weeks later | Email link → `store.kheelona.com/thanks?ref=…&t=…` | Same `/thanks` page; can add or change the address | New token minted per email (30-day expiry) | `fulfil.ts:297-305` |
| 16 | Balance (token orders only) | Off-site | "₹4,500 balance … by a payment link we send you" on WhatsApp and email | **No code.** A manual Razorpay payment link; `balance_status` `due → link_sent → paid` is updated by hand. What the webhook does with it: [below](#the-balance-step-4500) | `docs/store-go-live.md:96-97, 370-371`; `0001_preorders.sql:58-59` |

No "WhatsApp confirmation" is sent by code: the only automatic message is the email. The form hint
promises "Where we send your confirmation" on WhatsApp (`PreorderForm.tsx:209-213`); any WhatsApp
message is manual. Whether any is sent: [open questions](../open-questions.md) F12.

### Form fields (store page)

| Label | `name` | Input | `inputMode` | `autocomplete` | Required | Validation (same in browser and server) | Server stores |
|---|---|---|---|---|---|---|---|
| Your name | `parentName` | text, maxLength 80 | – | `name` | yes | 2-80 chars | `parent_name` |
| WhatsApp number | `phone` | `tel` | `tel` | `tel` | yes | Indian mobile, 10 digits starting 6-9; accepts +91, 0, spaces | `phone` (normalised to 10 digits) |
| Email | `email` | `email` | `email` | `email` | yes | permissive `x@y.z` | `email` (lower-cased) |
| Your child's age | `childAge` | text, maxLength 20 | – | none | yes | 1-20 chars, free text | `child_age` |
| "I accept the pre-order terms and the refund policy, and I am happy to hear about my own order on WhatsApp." | `accepted` | checkbox, **not pre-ticked** (live HTML) | – | – | yes | must be ticked | `wa_consent=true`, `terms_accepted_at` |

Sources: `PreorderForm.tsx:194-241`; `validate.ts:41-92`; `create-order/route.ts:65-99`. Silently
captured with the order: campaign cookie or URL UTMs, Meta `_fbp`/`_fbc`/IP/UA, PostHog device id
(`create-order/route.ts:100-119`; columns from migrations 0003, 0004).

### Address fields (`/thanks`)

| Label | `name` | Input | `autocomplete` | Required | Validation |
|---|---|---|---|---|---|
| Flat or house, and street | `line1` | text, max 120 | `address-line1` | yes | 5-120 chars |
| Landmark or area | `line2` | text, max 120 | `address-line2` | no | ≤120 |
| PIN code | `pincode` | text, `inputMode=numeric`, max 6 | `postal-code` | yes | `^[1-9]\d{5}$` |
| City or town | `city` | text, max 60 | `address-level2` | yes | 2-60 |
| State | `state` | select of 36 states and UTs | none | yes | must be in the list |

Sources: `AddressForm.tsx:117-163`; `validate.ts:94-118`; `india.ts:6-43`.

## Failure and edge states (all render a page, none throw)

| Situation | What the parent sees | Source |
|---|---|---|
| Store keys missing | "Pre-orders open here shortly." + WhatsApp button; APIs answer 503 | `store/page.tsx:128-149`; `http.ts:15-19` |
| Price flipped while the page was open (either direction) | 409 with "refresh this page" words; never re-priced silently | `tiers.ts:66-76, 133-146` |
| Too many tries | 429 "That was a lot of tries. Give it a minute and start again." | `create-order/route.ts:42-49` |
| DB insert fails | 500 "Something broke on our side…" | `create-order/route.ts:124-130` |
| Razorpay order create fails | 502 "…Nothing has been charged." The `created` row stays as a lead | `create-order/route.ts:165-175` |
| Sheet closed | "You closed the payment window, and nothing was charged…"; `preorder_dismissed` | `PreorderForm.tsx:147-153` |
| Script blocked / offline | "The payment window would not open…" | `PreorderForm.tsx:176-187` |
| Paid, webhook not yet in | "Thank you. We are confirming it now." | `thanks/page.tsx:121-140` |
| Bare `/thanks` or expired cookie | "We need your link again." (live, 200) | `thanks/page.tsx:190-216` |
| Signed link, order will not load | "We cannot open that order right now." | `thanks/page.tsx:89-97` |
| Unknown store path | Store-chrome not-found panel at 200, noindex | `store/[...rest]/page.tsx`; `host.ts:64-76` |

## Variants

| Variant | URL | Charged now | Balance | Form/summary shape | Source |
|---|---|---|---|---|---|
| **Token mode** (live) | `store.kheelona.com/` | ₹499 | ₹4,500 before dispatch | token | `store/page.tsx:49-50` |
| **Full mode** (after 500 paid launch-tier orders) | `store.kheelona.com/` | ₹7,999 | none (`balance_status='none'`) | full | `mode.ts:30-40`; `create-order/route.ts:84-88` |
| **Event tier (QR)** | `store.kheelona.com/e/<tier>?sig=<16 chars>` | `event_tiers.amount_paise` (e.g. ₹99) | ₹4,999 minus that token | always token, whatever the public mode | `e/[event]/page.tsx:29-128`; `docs/preorder-events.md` |
| **Partner page** | `store.kheelona.com/ideabaaz` | was ₹99; **ended 31 Aug 2026**, renders "The Ideabaaz exclusive has ended." (live) | – | – | `ideabaaz/page.tsx:15-78` |

Event links are HMAC-signed (`sign(secret, "event-link", id)`), capped and dated; a bad or missing
signature shows "This link is not one of ours…" (live, `/e/example`). Paid event orders count toward
the 500. Mode, cap and amount rules: [pricing](../product/pricing.md).

## Idempotency and money safety (logic, keep)

- Our row is written **before** the gateway call, so a failed gateway leaves a lead, never an
  unrecorded Razorpay order (`create-order/route.ts:25-34`).
- `markPaid` is one atomic `UPDATE … WHERE status IN ('created','failed')`; the second path to arrive
  matches nothing, so no second email, Meta or PostHog purchase. Proven by a real ₹499 UPI order on
  2026-08-22 (two paid webhooks one second apart, one receipt) (`fulfil.ts:31-93`;
  `docs/store-go-live.md:62-76`).
- A short payment is refused and logged; money for a refunded or cancelled order is never
  resurrected and raises an internal alert (`fulfil.ts:86-134, 213-236`).
- Orphan recovery: if the gateway id never reached our row, the webhook matches on `notes.order_ref`
  / `receipt` (`fulfil.ts:136-193`).
- Only a **full** `refund.processed` removes an order from the dispatch queue; a partial refund is
  left for a human (`fulfil.ts:238-283`).
- The address token is bound to one order ref, expires in 30 days, and every failure returns the same
  message (`address/route.ts:39-47`).

## The balance step (₹4,500)

**What exists.** No code. The copy promises the rest "by a link we send you. Never automatic"
(`OrderSummary.tsx:46`; `shipping/page.tsx:46-47`). The runbook calls it a manual run with no tooling,
tracked by `balance_status` `due → link_sent → paid` (`docs/store-go-live.md:96-97, 370-371`). Code
writes that column once, at create-order (`due`, or `none` for a full-price order,
`create-order/route.ts:88`); nothing sets `link_sent` or `paid` (`git grep` at the tag). On event
tiers the amount owed is ₹4,999 minus the token paid (`templates.ts:112-116`).

**What happens when a parent pays the link** (our code traced at the tag; Razorpay's side from its
docs, not tested). A payment link makes its own Razorpay order: in Razorpay's `payment_link.paid`
sample the payment's `order_id` is a new `order_…`, the link's `reference_id` becomes that order's
`receipt`, and the UPI sample shows the link's `notes` repeated on the order and the payment. The docs do not
say whether a link payment also emits `payment.captured` or `order.paid`.

| Event that reaches `/api/razorpay/webhook` | Path through our handler | Result |
|---|---|---|
| `payment_link.paid` (if subscribed) | Not in `PAID_EVENTS`; claimed in `webhook_events`, then `note: "ignored"` (`webhook/route.ts:27, 105-109`) | Nothing on the order |
| `payment.captured` or `order.paid` (the runbook subscribes these, `docs/store-go-live.md:181-183`) | `markPaid` looks up the link's order id, finds no `preorders` row (`fulfil.ts:76-134`), tries orphan recovery by `order_ref` (`fulfil.ts:136-193`), returns `unknown`; the handler logs `[webhook] paid an order id we do not have` and answers 200 (`webhook/route.ts:115-142, 162`) | Nothing on the order; one log line |
| Either, with no order id at all | `[webhook] paid event carried no order id`, 200 (`webhook/route.ts:110-113`) | Same |

**If the link carries `order_ref`** (as `notes.order_ref`, or as `reference_id`, which arrives as the
order's `receipt`): the handler reads it (`webhook/route.ts:126-130`) and tries recovery, but recovery
only updates a row whose status is `created` or `failed`. A token order whose balance is due is
already `paid`, so nothing matches, the follow-up lookup sees `paid`, and the result is still
`unknown` with the same log line, now wrong because the order exists (`fulfil.ts:142-195`). One
difference: if that order was refunded or cancelled, the result is `not-payable` and an internal
alert email goes to `ORDER_ALERT_EMAIL` (`fulfil.ts:176-183, 213-236`; `webhook/route.ts:143-155`).
So `order_ref` on the link helps a person reconcile in Razorpay's dashboard; it changes nothing in
our code.

**Consequences (record only; logic stays, brief 4.4):**

- `balance_status` stays `due`; no receipt email; `notifyPaid` never runs, so no Meta CAPI and no
  PostHog `purchase_confirmed`. The parent pays on Razorpay's hosted page, not our store, so no
  browser `purchase` fires either.
- **No analytics event records balance revenue.** Every purchase event carries the amount collected at
  checkout (₹499 on a token order), and the code says the balance "is never reported here"
  (`analytics.ts:31-37`; `meta-capi.ts:194-198`; `posthog-server.ts:64-67`). Per-event fields:
  [tracking inventory](tracking-inventory.md).
- The only record our system keeps is the `webhook_events` summary row: event type, Razorpay order
  and payment ids, amount and `receipt`, but not `notes` (`webhook/route.ts:62-75, 204-219`).
- Each balance payment by `payment.captured`/`order.paid` writes the log line the code calls "the one
  line in the store worth an alert" (`webhook/route.ts:139-141`), so a real orphaned payment would be
  harder to spot among them (our reading of the code).

How the links are created, whether they carry `order_ref`, and how the balance should be reported:
[open questions](../open-questions.md) F12. Which events the webhook is subscribed to: C4.

## What must not change, and what the reset restyles

Brief §4.4: logic stays; restyle only.

| Must NOT change (logic; founder approval needed) | Free to restyle (presentation) |
|---|---|
| `src/lib/store/**`, `src/app/api/**`, `src/proxy.ts`, `supabase/migrations/**` | Store page layout, kicker, h1 wording, image, video section (`src/app/store/page.tsx`) |
| Money constants and derivations in `src/config/site.ts:55-117` | Store chrome: header, footer layout (`src/app/store/layout.tsx`); keep the seller block and policy links |
| `features/preorder/lib/{validate,checkout,analytics,india}.ts` (validation, payload, event names) | Markup and styling of `PreorderForm`, `OrderSummary`, `AddressForm`, `NotFoundPanel`, `/thanks`, event and partner pages |
| The request body to create-order (fields, `tier`, `signature`, `utm`, `phDistinctId`) and the redirect to `/thanks?ref=&t=` | Copy of hints, errors and reassurance lines (facts must still come from config or the order row) |
| Email templates' facts and branching (paid / due / ships from / refund promise derived from the row) | Email visual layout (`templates.ts:35-56`) |
| One-tap CTA to `STORE_URL`; no cart; no accounts | CTA label text ([messaging](../brand/messaging.md#cta-labels); [open questions](../open-questions.md) G1) |

**Load-bearing details inside the presentation layer** (a restyle must keep them):

- Field `name`s and `autocomplete` values above; `noValidate` with the shared validators; the single
  `onChange` on the `<form>` that fires `preorder_form_started` (`PreorderForm.tsx:193`).
- The `data-ph-capture-attribute-cta` attribute on every CTA, with each value unchanged (`Button.tsx:86`;
  the values: [tracking inventory](tracking-inventory.md#6-posthog-in-the-browser)).
- `ph-no-capture ph-mask` on the `/thanks` container and `/thanks` in the replay deny list
  (`thanks/page.tsx:117-119`; `site.ts:449`).
- Store `noindex` (`layout.tsx:28-31`) and policy links pointing at `kheelona.com`.
- Inputs at ≥16px (17px today) so iOS Safari does not zoom mid-payment (`docs/website-steps.md:870`, §8.25-o;
  `src/components/atoms/Field.tsx:32`).
- No `<video>` element until play is pressed (CLAUDE.md, §8.37-a).
- The refund promise next to the pay button and the ship date in the summary (§8.25-b,
  `docs/website-steps.md:744-748`).
- Razorpay theme colour `#EF762F` is presentation but lives in a logic file (`checkout.ts:92`);
  changing it to a new DS token is a one-line change worth a founder nod.

The mid version (`archive/mid-version-2026-10-10`) changed only presentation in the checkout (labels,
kicker style, tier label "Pre-order price" → "Refundable deposit", store heading text); no payment,
pricing or order logic (diff of `src/app/store`, `src/features/preorder`, `src/lib/store`, 2026-10-11).

## Copy the new checkout carries

Founder rulings of 2026-10-10 and 2026-10-11 for the store page, `/thanks` and the receipt on the new
site. All are copy or presentation (brief 4.4): no payment, pricing or order logic changes. The terms
are owned on [policies](../product/policies.md#decided-for-the-new-site) and the price wording on
[pricing](../product/pricing.md#price-wording-for-the-new-site-d028); this table only places them in
the journey. Final copy is signed off at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)).

| Where in the journey | What it carries | Status | Decision |
|---|---|---|---|
| Beside the pay button (step 5) | The price sentence: ₹499 first, the ₹4,999 total (incl. GST) in the same sentence, the ₹4,500 due before delivery, "refundable" beside the advance. Today's h1 "Reserve Kheelu for ₹499." and `PRICE_CAPTION` carry no total | **Confirmed** | [D028](../decisions/D028-price-wording.md) |
| Beside the pay button | The refund-before-dispatch promise (kept, §8.25-b) and the trust terms: 7-day returns, no questions asked; 6-month warranty; pay by UPI, card or net banking; price includes GST; GST invoice with every order | **Confirmed** | [D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md), [D024](../decisions/D024-payment-methods-gst.md) |
| Beside the pay button and in the summary (steps 3, 5) | Delivery for new orders: deliveries start mid-November, from the one content value (owned on [facts](../product/facts.md#ship-date)) | **Confirmed** | [D023](../decisions/D023-new-order-delivery.md) |
| Production store, `/thanks` and receipt (steps 3, 11, 14) | Keep "20 October 2026" until Gate B; founder-accepted risk, not re-raised | **Held** | [D023](../decisions/D023-new-order-delivery.md), [D011](../decisions/D011-production-held-until-gate-b.md) |
| Existing token orders (steps 11, 15) | The summary, `/thanks` and the receipt print `SHIP_DATE_TEXT` from config, not from the order row (`wt:src/features/preorder/components/OrderSummary.tsx:55, 73`; `wt:src/app/store/thanks/page.tsx:159`; `wt:src/lib/email/templates.ts:136`). Changing the value therefore changes what an existing token holder sees on `/thanks` and in any later email. Whether those orders still dispatch from 20 October: F12 | **Still open** | [D023](../decisions/D023-new-order-delivery.md) |
| Order summary and receipt (steps 3, 14) | The Kheelona+ line. The checkout prints the short constant `KHEELONA_PLUS_SHORT`, "Every Kheelu includes 6 months of Kheelona+." (`wt:src/config/site.ts:134`; `wt:src/features/preorder/components/OrderSummary.tsx:98`; `wt:src/lib/email/templates.ts:149`), not the full `KHEELONA_PLUS_LINE`, so it carries neither "lessons" nor "lifetime". Whether it moves to the new line (owned on [facts](../product/facts.md#kheelona)) is copy for Gate A | New line **confirmed**; its use in checkout not ruled on | [D027](../decisions/D027-story-mode-wording.md) |
| Payment sheet (steps 7-8) | No wallet, EMI or Pay Later badge anywhere. The sheet shows what the Razorpay account enables; `checkout.ts` sets no method filter and is logic, so none is added | **Confirmed** | [D024](../decisions/D024-payment-methods-gst.md) |
| Store chrome (beside the seller block and policy links) | The grievance officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com. Where it is displayed is not decided. The acknowledgement time is not published until decided (5 days proposed; Rule 4(5) says 48 hours) | Officer **confirmed**; acknowledgement **still open** (F2) | [D029](../decisions/D029-grievance-officer-legal-review.md) |

## Testing a restyle without real money

`npm run qa:payment` drives Razorpay's **sandbox** in a browser, refuses a live key, and stops at the
open sheet; run it with `node tools/qa/supabase-stub.mjs` and test keys in `.env.local`
(`tools/qa/payment-probe.mjs:1-28`). Never place a real order (brief §4.4). Guard tests to keep green:
`create-order/route.test.ts`, `webhook/route.test.ts`, `address/route.test.ts`, `src/lib/store/*.test.ts`,
`test/{preorder-money,preorder-cta,preorder-copy,store-host,store-secrets,policies}.test.ts`.

## Known open issues in the logic (record only; not for the reset to fix)

- `markRefunded` finds orders by payment id, so a `refund.processed` arriving before
  `payment.captured` would be missed (`Technical-Todo.md:1030-1040`).
- The runbook subscribes the webhook to `order.paid` and `payment.captured` only
  (`docs/store-go-live.md:181-183`); whether `refund.processed` and `payment.failed` are subscribed in
  the Razorpay dashboard is not recorded anywhere. If not, refunds never leave the dispatch queue
  automatically ([open questions](../open-questions.md) C4).
- The rate limit is in-memory per serverless instance (`rate-limit.ts:1-13`).
- The balance run and abandoned-order follow-up are manual with no tooling
  (`docs/store-go-live.md:332-341, 365-371`); the webhook logs balance payments as unknown orders
  ([balance step](#the-balance-step-4500)).

## Open questions

In [open questions](../open-questions.md): F12, partly answered by
[D023](../decisions/D023-new-order-delivery.md) (new orders deliver from mid-November with the same
₹499 advance); still open: whether existing token orders dispatch from 20 October, the balance-link
timing and channel, WhatsApp order confirmations, and balance measurement. F1: who pays the return
pickup, and the warranty remedy after the first 7 days. F2: the complaint acknowledgement time. Also
the CTA label (G1), the "nearly 3" store hint (Q3 a), webhook subscriptions (C4). Payment methods
(F6) are answered ([D024](../decisions/D024-payment-methods-gst.md)).

## Related

[Pricing](../product/pricing.md) · [Policies](../product/policies.md) ·
[Tracking inventory](tracking-inventory.md) · [URL map](url-map.md) ·
[Legacy laws](../legacy/laws-summary.md) · [DS component map](../design-system/component-map.md)
