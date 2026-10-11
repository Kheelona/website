---
title: Pricing and offer source
type: inventory
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - src/config/site.ts
  - src/lib/store/mode.ts
  - src/lib/store/tiers.ts
  - src/app/api/preorder/create-order/route.ts
  - src/app/api/health/route.ts
  - src/lib/seo.ts lines 274-342
  - src/lib/product-facts.ts
  - src/app/pricing.md/route.ts
  - src/app/llms.txt/route.ts
  - src/components/molecules/PriceTable.tsx
  - src/components/organisms/FinaleCTA.tsx
  - src/features/preorder/components/{PreorderForm,OrderSummary}.tsx
  - src/lib/email/templates.ts
  - supabase/migrations/0001_preorders.sql, 0002_full_tier_balance.sql
  - test/preorder-money.test.ts
  - docs/website-steps.md §8.25-c, §8.26 (lines 760-771, 980-1037)
  - docs/checkpoints/closed-rounds.md lines 193-197, 284
  - Technical-Todo.md lines 1130-1143 (the sell-out sweep item)
  - src/lib/stories-expansion.ts, src/components/organisms/FamilyGrid.tsx, src/lib/product-facts.ts lines 81-82, 95-105
  - design-system/project/07-selling.md, design-system/project/01-writing.md
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - "mid: src/config/site.ts lines 96-109, CLAUDE.md lines 27-28"
  - "GET https://kheelona.com/api/health and https://store.kheelona.com/ (browser UA, 2026-10-11 00:42 UTC)"
---

# Pricing and offer source

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Where every price, offer and amount comes from, how the store picks the price per request, and which
on-site texts render from it. The checkout steps are on [checkout](../site/checkout.md); refund and
delivery terms on [policies](policies.md).

## Live state

| Check | Result | Source |
|---|---|---|
| Offer mode | **`token`**: ₹499 reserves one of the first 500 units at ₹4,999 | `GET https://kheelona.com/api/health`, 2026-10-11 00:42 UTC |
| Gateway | `razorpay: "live"` (real money) | same |
| Store page | h1 "Reserve Kheelu for ₹499.", button "Pay ₹499 and reserve" | `GET https://store.kheelona.com/`, same time |

The paid count behind the mode is **never published** (founder, 2026-08-23; `mode.ts:11-16`), so this
wiki records the mode only.

## The single source: `src/config/site.ts`

Amounts are integers in **paise**, defined once; every rupee string is derived with `formatInr`
(`site.ts:57-61`).

| Constant | Value | Rendered | Line |
|---|---|---|---|
| `LAUNCH_AMOUNT_PAISE` | 499,900 | `LAUNCH_PRICE` = ₹4,999 (price for the first 500 units) | `site.ts:64, 74` |
| `FULL_AMOUNT_PAISE` | 799,900 | `FULL_PRICE` = ₹7,999 (paid in full once the 500 are gone) | `site.ts:67, 75` |
| `TOKEN_AMOUNT_PAISE` | 49,900 | `TOKEN_PRICE` = ₹499 (refundable token) | `site.ts:69, 76` |
| `BALANCE_AMOUNT_PAISE` | derived: launch − token = 450,000 | `BALANCE_PRICE` = ₹4,500 | `site.ts:72, 77` |
| `PREORDER_CAP_UNITS` | 500 | `CAP_UNITS_TEXT` = "first 500 units" | `site.ts:86-88` |
| `TAX_LINE` | "All prices include GST." | – | `site.ts:102` |
| `SHIP_DATE_TEXT` / `_ISO` | "20 October 2026" / `2026-10-20` | – | `site.ts:138-139` |

Derived sentences (the only sanctioned phrasings, pinned by `test/preorder-money.test.ts:84-95`):

| Constant | Text | Line |
|---|---|---|
| `PRICE_CAPTION` | "₹499 now, ₹4,500 on dispatch. Fully refundable until we ship." | `site.ts:97` |
| `PREORDER_OFFER_LINES` / `_LINE` | "₹499 reserves one of the first 500 units at ₹4,999." + "₹7,999 once they are gone." | `site.ts:110-114` |
| `PRICE_HOLD_LINE` | "We hold the price, you hold your place." | `site.ts:117` |
| `WHATSAPP_SHARE_HREF` | "…Rs 499 reserves one of the first 500 units at Rs 4999, fully refundable: https://store.kheelona.com" ("Rs", not ₹, on purpose) | `site.ts:159-165` |

CTA labels (live and proposed) are owned by [messaging](../brand/messaging.md#cta-labels).

Event prices (e.g. ₹99 at a stall) are **not** in config: they are rows in Supabase `event_tiers`
(`amount_paise`, `cap`, `expires_on`, `active`), read only on the server
(`0001_preorders.sql:128-136`; `docs/preorder-events.md:16-31`).

## How the price is decided (server only)

1. **Mode.** On every store-page request and every create-order, `preorderMode()` counts
   `preorders` rows with `status='paid'` and `tier != 'full'`. Fewer than 500 → `token`; otherwise
   `full`. A failed count reads as 0, so a fault offers the lower price, never overcharges. A refund
   reopens a slot (`mode.ts:30-40`; `docs/website-steps.md:986-992`).
2. **Tier.** `resolveTier` maps the requested tier to an amount from **our** side
   (`tiers.ts:59-127`):

   | Tier id | Allowed when | Charged now | Balance written | Source |
   |---|---|---|---|---|
   | `launch` | mode `token` (else refused `cap-reached`) | `TOKEN_AMOUNT_PAISE` ₹499 | `due` (₹4,500) | `tiers.ts:49-51, 66-69` |
   | `full` | mode `full` (else refused `not-yet`) | `FULL_AMOUNT_PAISE` ₹7,999 | `none` | `tiers.ts:53-55, 73-76`; `create-order/route.ts:84-88` |
   | any other id (event) | valid signature, active row, not expired, under its cap, amount > 0 | `event_tiers.amount_paise` | `due` (₹4,999 − token) | `tiers.ts:78-126` |

3. **Create the gateway order** for exactly that amount; Razorpay refuses a non-integer or ≤0 amount
   (`razorpay.ts:31-35`).
4. **Overshoot is tolerated** around the 500th sale (no locks), and `markPaid` never re-checks the
   cap (`docs/website-steps.md:1006-1010`, §8.26-d).

### What the client may and may not send

| May send | May not send (ignored or impossible) |
|---|---|
| `tier` (default `launch`), `signature` (event links), contact fields, `utm`, `phDistinctId` | Any amount. The API reads no price field; a request carrying `amountPaise: 100` is charged ₹499 (`docs/website-steps.md:767-770`; `create-order/route.test.ts`) |

`mode` and `amountLabel` reach the form as **display props** from the server; they change sentences,
never charges (`PreorderForm.tsx:51-63`). Existing orders (thanks page, receipt, balance) derive from
the order **row**, never the current mode, so a flip cannot rewrite what a parent agreed to
(`mode.ts:11-16`; `thanks/page.tsx:143-158`; `templates.ts:108-116`).

## Where price text appears, and whether it follows the mode

The store pages follow the live mode. **Every marketing surface is static and shows token-mode text**;
on the day `/api/health` reports `"preorder":"full"` they go stale until the manual sell-out sweep
([below](#sell-out-sweep-826-g)). The last column says whether the legacy sweep checklist names the surface.

| Surface | Renders | Mode-aware? | On the legacy sweep? |
|---|---|---|---|
| Store page h1, pay button, reassurance line, `OrderSummary` | tier amount + config | **Yes** (`store/page.tsx:49-95`) | Not needed |
| `/thanks`, receipt email | order row + `LAUNCH_AMOUNT_PAISE` | Row-based | Not needed |
| Event page `/e/<tier>` | event amount, balance = ₹4,999 − token | Always token shape, by design (§8.26-f, `docs/website-steps.md:1018-1022`) | Not needed |
| Home hero offer lines, Compare caption, FAQ | `PREORDER_OFFER_LINES`, `PRICE_CAPTION`, prices | No (`Hero.tsx:63`; `(site)/page.tsx:88-100, 248`; `Compare.tsx:35`) | **Yes** ("Home") |
| `/products/kheelu` FAQ, `PriceTable`, captions | prices, `PRICE_CAPTION` | No (`products/kheelu/page.tsx:104-130, 167-168, 340-363`; `PriceTable.tsx:35-42`) | **Yes** ("`/products/lumi`") |
| Spec table rows "Price" and "To reserve one" (also Product JSON-LD `additionalProperty`) | prices | No (`product-facts.ts:81-82, 99-105`) | No |
| `FinaleCTA` on every page ("Ask for your ₹499 back…", "₹499 now, ₹4,500 later", offer line) | `TOKEN_PRICE`, `BALANCE_PRICE`, `PREORDER_OFFER_LINE` | No (`FinaleCTA.tsx:30-33, 86`) | No |
| WhatsApp share text (`WHATSAPP_SHARE_HREF`, above) | token and launch amounts | No (used at `FinaleCTA.tsx:125`) | No |
| Home "family" card link label ("…reserve at ₹4,999") | `LAUNCH_PRICE` | No (`FamilyGrid.tsx:39`) | No |
| `/terms`, `/refund`, `/shipping`, `/contact` | config | Mostly phrased for both modes; token-only lines: `/terms` "That ₹499 is part of the price" (`terms/page.tsx:33`), `/contact` "A refundable ₹499 reserves one" (`contact/page.tsx:44`) | **Yes** ("`/terms`"; §8.26-g says "the legal pages") |
| `/ai-toys-for-kids-in-india`, journal articles | config | No (`ai-toys…/page.tsx:147`; `stories.ts:95, 119, 147`; `stories-expansion.ts:242, 303, 332, 365`) | No |
| `/pricing.md`, `/llms.txt` | config | No (`pricing.md/route.ts:39-42`; `llms.txt/route.ts:79-82`) | **Yes** |
| Product JSON-LD `Offer` | `price: 4999`, `INR`, `PreOrder`, `availabilityStarts: 2026-10-20`, India; offer description | No (`seo.ts:322-341`) | **Yes** ("the JSON-LD price") |
| Meta `ViewContent` value | `LAUNCH_AMOUNT_PAISE` (₹4,999) | No (`ViewContentTracker.tsx:55`) | **Yes** |
| Hand-typed meta descriptions and prose (six, [below](#rupee-amounts-typed-by-hand-outside-the-source)) | typed text | No | No |

"No" in the last column means the surface would go stale at sell-out and the legacy checklist does
not name it (found by `git grep` for every price constant and "₹" at the tag, 2026-10-10).

### Rupee amounts typed by hand (outside the source)

`site.ts:14-17` says nothing may hardcode a rupee amount and that `test/preorder-money.test.ts`
guards it. The test checks derivation and the sanctioned strings only (`preorder-money.test.ts:36-105`),
and these six strings are typed by hand. All are meta descriptions or prose:

| File:line | Text |
|---|---|
| `src/app/layout.tsx:46` | "…Pre-order at ₹4,999 with a refundable ₹499." |
| `src/app/(site)/page.tsx:60` | "…Pre-order at ₹4,999, ₹499 refundable." |
| `src/app/(site)/products/kheelu/page.tsx:48` | "…₹499 reserves yours at ₹4,999." |
| `src/app/(site)/terms/page.tsx:18` | "…what the ₹499 buys…" |
| `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:65` | "…from ₹4,999." |
| `src/lib/stories.ts:71` | "…a refundable ₹499." |

(Competitor and category figures such as "around ₹14,000" on `ai-toys…/page.tsx:131` are not our
prices and are out of scope here.) The reset should render all of these from config.

## Sell-out sweep (§8.26-g)

**Trigger:** `/api/health` reports `"preorder":"full"`, or the internal order alert. The store flips
to ₹7,999 by itself, server-side, per request; static pages cannot (`Technical-Todo.md:1130-1135`;
`docs/website-steps.md:1024-1030`). **Not triggered:** health reports `token` ([live state](#live-state)).

The legacy checklist, as written, mapped to the table above:

| # | Legacy item (`Technical-Todo.md:1130-1143`) | Row above | The change |
|---|---|---|---|
| 1 | Home | Home hero offer lines, Compare caption, FAQ | Replace "₹499 reserves one of the first 500 units" text with the full-price offer |
| 2 | `/products/lumi` (now `/products/kheelu`) | `/products/kheelu` FAQ, `PriceTable`, captions | Same |
| 3 | `/terms` ("the legal pages" in §8.26-g) | `/terms`, `/refund`, `/shipping`, `/contact` | Same, for the token-only lines |
| 4 | `llms.txt`, `pricing.md` | `/pricing.md`, `/llms.txt` | Same |
| 5 | "the JSON-LD price" | Product JSON-LD `Offer` | Price 7999 and the offer description |
| 6 | The Meta `ViewContent` value (added 2026-09-01, "the easiest to miss") | Meta `ViewContent` value | `LAUNCH_AMOUNT_PAISE` → `FULL_AMOUNT_PAISE`. If missed, every ViewContent under-reports by ₹3,000; the founder chose a value knowing it needs this step (§8.30-j; `Technical-Todo.md:1136-1143`) |
| 7 | Labels | – | The live label carries no price, so it is not on the list. The mid version's ₹499 labels were "line one of the §8.26-g sell-out sweep" (`mid:src/config/site.ts:102-106`; `mid:CLAUDE.md:27-28`). Any label chosen with a price joins the sweep; candidates on [messaging](../brand/messaging.md#cta-labels) |

Rows marked "No" in the last column above (spec rows, `FinaleCTA`, WhatsApp share text, the family
card label, the guide and journal, the six meta descriptions) also need the sweep; the legacy list
missed them. Whether the reset keeps a static price plus this manual sweep, or renders the offer from
a read-only block that follows the live mode, is a Gate A decision:
[open questions](../open-questions.md) G9.

## Tax, delivery, MRP

| Topic | What exists | Source |
|---|---|---|
| GST | Every published price is **GST-inclusive** (founder-confirmed 2026-08-22). "All prices include GST." appears on the store summary, `/terms`, `/shipping`, `PriceTable`, `/pricing.md`, `llms.txt`. **No GST breakup** is shown anywhere | `site.ts:98-102`; `OrderSummary.tsx:102` |
| GST accounting | An internal accounting note exists and is deliberately unpublished (founder decision); not restated here | `docs/checkpoints/closed-rounds.md:284` |
| Tax invoice | No GST invoice is generated by this codebase. The email is an acknowledgement. Whether an invoice is issued elsewhere is not documented: [open questions](../open-questions.md) F6 | `templates.ts:96-185`; repo grep for "invoice", 2026-10-11 |
| Delivery | **Included anywhere in India** (founder-confirmed 2026-08-22) | `closed-rounds.md:193-197`; `OrderSummary.tsx:102` |
| MRP | **Not defined anywhere.** No MRP string in `src/`. The DS says never call a price MRP unless it is. MRP is asked in [open questions](../open-questions.md) F3; the disclosure check is on [policies](policies.md#check-against-the-e-commerce-rules-2020-brief-97) | repo grep, 2026-10-11; `design-system/project/07-selling.md:43` |
| Discounts / coupons | None. The only lower prices are signed event tiers | `tiers.ts` |
| Product feed (Merchant Center, Meta catalog) | None found in the repo; Meta Events Manager shows "No connected catalogs" | `docs/checkpoints/meta-pixel-migration-2026-09-20.md:240-241` |

## Structured data gap against brief §9.2

The `Offer` has price, currency, availability, start date, URL and region, but **no
`shippingDetails` and no `hasMerchantReturnPolicy`** (`seo.ts:322-341`). Return terms do not exist yet
([policies](policies.md); [open questions](../open-questions.md) F1), so a return policy cannot be
marked up honestly today. It also has no `priceValidUntil` by design (`seo.ts:328-333`).

## The new design system's price rules (for the reset)

Owned by the DS: [overview, Selling](../design-system/overview.md#selling-project07-sellingmd)
(from `design-system/project/07-selling.md`). CTA labels: [messaging](../brand/messaging.md#cta-labels).

## Proposals and history that touch price (not in force)

- **Mid version** (never deployed): changed the CTA labels only ([messaging](../brand/messaging.md#cta-labels);
  sweep note in [row 7 above](#sell-out-sweep-826-g)). No amount changed (`mid:src/config/site.ts:96-109`).
- **Positioning** (SKM): "Why ₹4,999? … ₹499 reserves it, refundable until we ship" and "At ₹7,999 after
  launch" match config; it advises anchoring price against enrichment-class spend with a "[check local
  fees before using a number]" caveat (`Kheelona Positioning Strategy.docx`, positioning and objection
  sections). No price change proposed.

## Related

[Checkout](../site/checkout.md) · [Policies](policies.md) · [Product facts](facts.md) ·
[Tracking inventory](../site/tracking-inventory.md) · [Legacy laws](../legacy/laws-summary.md)
