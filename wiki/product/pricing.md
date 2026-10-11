---
title: Pricing and offer source
type: inventory
updated: 2026-10-11
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
  - "GET https://kheelona.com/pricing.md and https://kheelona.com/llms.txt (browser UA, 2026-10-11 06:09 UTC)"
  - wiki/decisions/D011-production-held-until-gate-b.md
  - wiki/decisions/D023-new-order-delivery.md
  - wiki/decisions/D024-payment-methods-gst.md
  - wiki/decisions/D027-story-mode-wording.md
  - wiki/decisions/D028-price-wording.md
  - wiki/raw/research/geo/ai-answer-audit-2026-10-10.md
---

# Pricing and offer source

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Where every price, offer and amount comes from, how the store picks the price per request, which
on-site texts render from it, and how the new site must word the price
([D028](../decisions/D028-price-wording.md), [below](#price-wording-for-the-new-site-d028)). The
checkout steps are on [checkout](../site/checkout.md); refund and delivery terms on
[policies](policies.md). Production keeps its current text until Gate B
([D011](../decisions/D011-production-held-until-gate-b.md)).

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
| `TAX_LINE` | "All prices include GST." (new site: "incl. GST" beside every price, [D024](../decisions/D024-payment-methods-gst.md)) | – | `site.ts:102` |
| `SHIP_DATE_TEXT` / `_ISO` | "20 October 2026" / `2026-10-20`. Production keeps it until Gate B; new orders deliver from mid-November ([D023](../decisions/D023-new-order-delivery.md); the date is owned on [facts](facts.md#ship-date)) | – | `site.ts:138-139` |

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

## Price wording for the new site (D028)

Founder, 2026-10-11 ([D028](../decisions/D028-price-wording.md)), after Bing's AI said Kheelu is
"priced at ₹499" (`raw/research/geo/ai-answer-audit-2026-10-10.md`; [open questions](../open-questions.md) R10).
CTA labels themselves stay on [messaging](../brand/messaging.md#cta-labels).

| Where | Rule |
|---|---|
| Next to the CTA | Lead with ₹499, and in the SAME sentence say the ₹4,999 total (incl. GST) and that the ₹4,500 remainder is due before delivery. "Refundable" sits beside the advance wherever the advance appears. Draft sentence: D028 |
| Everything machines read: Product JSON-LD, `llms.txt`, `pricing.md`, page titles and meta descriptions, ad text | Lead with ₹4,999 (incl. GST); the advance comes second |
| Every amount | Rendered from the source on this page, never hand-typed, so the wording stays true in both modes: in full mode (₹7,999 paid in full) there is no advance to mention. How price display follows the live mode: G9 |
| Every price | Says "incl. GST" where it appears; the JSON-LD price stays the GST-inclusive amount ([D024](../decisions/D024-payment-methods-gst.md)) |

Production text read against the rule, as input for the new site's content model (production itself
is held until Gate B):

| Text | Kind | Against D028 |
|---|---|---|
| `PRICE_CAPTION` "₹499 now, ₹4,500 on dispatch. Fully refundable until we ship." (`site.ts:96-97`, "the standard reassurance caption under a pre-order button") | Beside a CTA | **Does not meet it**: no ₹4,999 total, no "incl. GST" |
| `PREORDER_OFFER_LINES[0]` "₹499 reserves one of the first 500 units at ₹4,999." (`site.ts:110-114`) | Beside a CTA | Order meets it (₹499 first, total in the same sentence); lacks "refundable" beside the advance and "incl. GST" |
| Store h1 "Reserve Kheelu for ₹499." beside the button "Pay ₹499 and reserve" ([live state](#live-state)) | Beside a CTA | The h1 carries no total; the sentence beside the pay button needs it. Checkout presentation may be restyled ([checkout](../site/checkout.md)) |
| D023's draft line "Reserve Kheelu with ₹499 today. Deliveries start mid-November." ([D023](../decisions/D023-new-order-delivery.md)) | New-site draft | Written before D028: used beside a CTA it needs the ₹4,999 total in the same sentence |
| `/pricing.md` lines 7-10 and `/llms.txt` lines 43-44 (live, 2026-10-11 06:09 UTC) | Machine | Order meets it (₹4,999 first). "All prices include GST." is a separate line (`/pricing.md` line 11, `/llms.txt` line 46), not with the leading price |
| `/products/kheelu` meta description "…₹499 reserves yours at ₹4,999." (`products/kheelu/page.tsx:48`) | Machine | **Does not meet it**: leads with ₹499, the shape the rule exists to stop |
| `/terms` meta description "…what the ₹499 buys…" (`terms/page.tsx:18`) | Machine | **Does not meet it**: names the advance only |
| Root and Home meta descriptions "Pre-order at ₹4,999 with a refundable ₹499." / "Pre-order at ₹4,999, ₹499 refundable." (`layout.tsx:46`; `(site)/page.tsx:60`) | Machine | Order meets it; no "incl. GST" |
| `/ai-toys-for-kids-in-india` meta description "…from ₹4,999." (`ai-toys…/page.tsx:65`) | Machine | Order meets it; no "incl. GST" |
| Product JSON-LD `Offer` `price: 4999` (`seo.ts:322-341`) | Machine | Meets it; GST-inclusive per D024 |

## Kheelona+ has no price

No ₹ amount exists for Kheelona+, and none is published until the founder sets one
([open questions](../open-questions.md) F7). Every Kheelu includes 6 months of it. The new site uses
the founder's new Kheelona+ line ([D027](../decisions/D027-story-mode-wording.md), option b), which
replaces `KHEELONA_PLUS_LINE`; the wording is owned on [facts](facts.md#kheelona). Production keeps
the old line until Gate B (D011): live `/llms.txt` line 45 still says "stories, lessons, language
packs, parent app" and "Kheelu's smart features are lifetime" (2026-10-11 06:09 UTC), the wording
Bing's AI read as "a lifetime subscription to Kheelona+" (R10).

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
missed them. On the new site D028 covers that day too: in full mode the price is ₹7,999 paid in full and
there is no advance to mention ([above](#price-wording-for-the-new-site-d028)). Whether the reset keeps a static price plus this manual sweep, or renders the offer from
a read-only block that follows the live mode, is a Gate A decision:
[open questions](../open-questions.md) G9.

## Tax, delivery, MRP

| Topic | What exists | Source |
|---|---|---|
| GST | Every published price is **GST-inclusive** (founder-confirmed 2026-08-22, again 2026-10-10 in [D024](../decisions/D024-payment-methods-gst.md)). "All prices include GST." appears on the store summary, `/terms`, `/shipping`, `PriceTable`, `/pricing.md`, `llms.txt`. **No GST breakup** is shown anywhere. New site: "incl. GST" beside every price, and the JSON-LD price stays the GST-inclusive amount (D024) | `site.ts:98-102`; `OrderSummary.tsx:102` |
| GST accounting | An internal accounting note exists and is deliberately unpublished (founder decision); not restated here | `docs/checkpoints/closed-rounds.md:284` |
| Tax invoice | **Every buyer gets a GST invoice** (founder, 2026-10-10, [D024](../decisions/D024-payment-methods-gst.md); F6 closed). This codebase does not generate it: the email is an acknowledgement, so the invoice is issued outside the repo; how and when is not documented | `templates.ts:96-185`; repo grep for "invoice", 2026-10-11 |
| Delivery | **Included anywhere in India** (founder-confirmed 2026-08-22). New orders deliver from mid-November 2026 with the same ₹499 advance ([D023](../decisions/D023-new-order-delivery.md); terms on [policies](policies.md#decided-for-the-new-site)) | `closed-rounds.md:193-197`; `OrderSummary.tsx:102` |
| MRP | **₹7,999 incl. all taxes** ([D034](../decisions/D034-origin-manufacturer-mrp.md), founder 2026-10-11), equal to the full price after the first 500. Not yet in `src/` (production held, D011). The DS says never call a price MRP unless it is; this one is; the disclosure check is on [policies](policies.md#check-against-the-e-commerce-rules-2020-brief-97) | repo grep, 2026-10-11; `design-system/project/07-selling.md:43` |
| Discounts / coupons | None. The only lower prices are signed event tiers | `tiers.ts` |
| Product feed (Merchant Center, Meta catalog) | None found in the repo; Meta Events Manager shows "No connected catalogs" | `docs/checkpoints/meta-pixel-migration-2026-09-20.md:240-241` |

## Structured data gap against brief §9.2

The `Offer` has price, currency, availability, start date, URL and region, but **no
`shippingDetails` and no `hasMerchantReturnPolicy`** (`seo.ts:322-341`). It also has no
`priceValidUntil` by design (`seo.ts:328-333`).

For the new site the return and warranty terms now exist ([policies](policies.md#decided-for-the-new-site);
[D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md)),
so `hasMerchantReturnPolicy` and the warranty fields can render from the same content source as the
page copy (D022). Both former open points are settled: return pickup is free ([D033](../decisions/D033-warranty-after-day-7.md)),
and `availabilityStarts` on the new site is **2026-11-15** ([D037](../decisions/D037-delivery-date-in-schema.md)),
rendered from the same content value as the page's "Deliveries start mid-November"
([D023](../decisions/D023-new-order-delivery.md)). Production keeps `2026-10-20` from `SHIP_DATE_ISO` until Gate B.

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
[Tracking inventory](../site/tracking-inventory.md) · [Legacy laws](../legacy/laws-summary.md) ·
[D023](../decisions/D023-new-order-delivery.md) · [D024](../decisions/D024-payment-methods-gst.md) ·
[D027](../decisions/D027-story-mode-wording.md) · [D028](../decisions/D028-price-wording.md)
