---
title: "Benchmark capture: boAt (boat-lifestyle.com)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.boat-lifestyle.com/ (home; redirected to /pages/grand-festive-sale26; captured 2026-10-11 02:07 UTC phone, 02:09 UTC laptop; 360 × 640 at 05:02 UTC)"
  - "https://www.boat-lifestyle.com/products/airdopes-181-pro-bluetooth-earbuds (product page; captured 2026-10-11 02:08 UTC phone, 02:10 UTC laptop; 360 × 640 at 05:02 UTC)"
  - "Cart drawer and GoKwik checkout opened from that page (2026-10-11 02:19 UTC and 04:53-04:56 UTC; stopped at the mobile-number screen, nothing typed)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), three runs per page, 2026-10-11 04:52-05:21 UTC"
---

# boAt (boat-lifestyle.com)

**Why it is here.** India's best-known D2C electronics brand, from the brief's starting set (brief §6).
Indian D2C group. Phone-first, deal-led, and the closest Indian benchmark for a gadget sold mostly
on phones through ads.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, all 1x, scrolled viewport chunks.
Copy below is read from the live DOM text of each capture, not retyped from images. During the
checkout probes (04:52 UTC on) the connection was US-based (Cloudflare trace `loc=US`); the store
served Indian prices and the GoKwik sheet as before.

| Files | What |
|---|---|
| `phone-home-01..13.jpg` | Home, phone (10,002 px, 13 screens). The home URL redirects to the festive-sale page |
| `phone-pdp-01..16.jpg` | Product page (Airdopes 181 Pro), phone (13,276 px, 16 screens) |
| `small360-{home,pdp}-01.jpg` | First screen at 360 × 640 |
| `laptop-home-01..12.jpg`, `laptop-pdp-01..12.jpg` | Laptop |
| `phone-flow-01-pdp-first`, `-02-pdp-delivery-check`, `-03-after-add-to-cart` | Product page, delivery check, cart drawer |
| `phone-flow-06-cart-drawer`, `-07-checkout-first-screen`, `-08-buy-now-first-screen` | Add To Cart → drawer → Pay Now → GoKwik; and Buy Now → GoKwik |
| `phone-flow-01-checkout-first-screen`, `-04-cart`, `-05-checkout-first-screen` | Earlier attempts that did **not** reach checkout: a product page after waiting, and Home (opening `/cart` directly shows Home; the cart is a drawer) |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [01](phone-home-01.jpg) | Offer | Sticky strip on every screen: "Grand Festive Sale Live Now \| Get additional 5% off on Prepaid Orders \| Code: FESTIVE \| Shop Now". Hero carousel (10 slides): "GRAND FESTIVE SALE 8th Oct to 15th Oct / Lowest Price Ever On Home Audio & Speakers / USE CODE : FESTIVE2000", "boAt Pay Later: Pay ₹1 Now + Rest in 3 months, No extra cost". Under it a bank-card offer strip ("Powered By Twid") and four icons (Free Extended Warranty, Custom Engraving, Exclusive Deals & Offers, Special Loyalty Rewards) | none | "Shop Now" inside the hero image |
| [01](phone-home-01.jpg)–[02](phone-home-02.jpg) | Catalogue | "Best Sellers", "Crazy Deals", "Lowest Ever Price" rails, three cards across: a yellow feature chip ("100 Hours Playback"), star rating, "Festive Price Live !!", ₹999 ~~₹4,990~~ 80% off | Rating on every card | Cart icon per card |
| [03](phone-home-03.jpg)–[05](phone-home-05.jpg) | More deals | "BIGGEST DEALS THIS SEASON" carousel, "First time on Discount", "Last Few Units Left!", a sub-brand banner (Nirvana) | Scarcity headings | Cart icon per card |
| [06](phone-home-06.jpg)–[10](phone-home-10.jpg) | Categories | "Categories" tiles, then rails per category (Personal Audio, Wearables, Wireless Speakers, Power Banks, Home Audio); "LAUNCH OFFERS LIVE" was still blank placeholders in our capture | none | Cart icon per card |
| [11](phone-home-11.jpg)–[13](phone-home-13.jpg) | Footer | Email sign-up, category accordion, Privacy, Terms, **Warranty Policy**, "D2D Paid Repair Service Policy", the company's address for queries | Policies | none |

Fixed on every screen: the offer strip, the header, and a **bottom bar: Home, Categories, Rewards,
Personalisation, Chat**. "Chat" opens WhatsApp (`api.whatsapp.com/send?...&text=Hi`, read from the
DOM 2026-10-11).

**Headline formula.** Event + superlative + coupon code ("Lowest Price Ever On Home Audio &
Speakers / USE CODE : FESTIVE2000"). No product promise; the page is a catalogue of discounts.

**At 360 × 640** ([small360-home-01](small360-home-01.jpg)) a "FLASH SALE / Get 2000 Off, For a
limited period / FESTIVE2000 / Shop Now / Sale ends in 02:27:48" bottom sheet covered the lower half
of the first screen. It did not appear in the 390 × 844 capture.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-pdp-01.jpg) | Buy box | Breadcrumb; H1 "boAt Airdopes 181 Pro"; spec subtitle "Wireless Earbuds with 100 Hours Playback, Quad Mics with ENx™, BEAST™ Mode, ASAP™ Charge"; chip "Get 5% OFF on purchase of 2 or more items"; gallery with "4.6 (95)" and a ticking countdown ("16h : 21m : 05s"); "Festive Price Live !!"; ₹999 ~~₹4,990.00~~ 80% Off | **Sticky buy bar from first paint**: "Earn upto 49 boAt reward points on this product" / "₹999 ~~₹4990~~ 80% OFF Inclusive of all taxes" / **Add To Cart** (black) + **Buy Now** (green) |
| [02](phone-flow-02-pdp-delivery-check.jpg) | Pay, deliver, guarantee | "₹1 now + ₹499/month (2 months) via boAt Pay Later / UPI & Cards Accepted \| By snapmint / BUY ON EMI"; colour swatches; **"Check Delivery: 122008 [Change] / Free delivery \| By tomorrow"** (pincode pre-filled, not typed by us); "Redeem upto 10% off additionally with boAt rewards"; **trust row: "12+3 Months Warranty (i) · 7-day Replacement · Free Express Delivery* · GST Billing"** | sticky bar |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Feature summary | "Quick Product Highlights" image tiles; an icon grid (Nonstop music 100 hours, IPX5, Quad Mics, ASAP Fast charge) | sticky bar |
| [04](phone-pdp-04.jpg)–[09](phone-pdp-09.jpg) | Feature story | Full-width renders, one benefit each ("Super Charged Up, Extended Playback", "Say Goodbye to Dropped Calls", "Beast Mode with 50ms of Super Low Latency", "Solid Build and Distinctive Dual-Tone Metallic Colors") | sticky bar |
| [10](phone-pdp-10.jpg)–[11](phone-pdp-11.jpg) | Specs and declarations | "Product Specifications": name, box contents, dimensions, **"MRP(Inclusive All Taxes) ₹4,990", "Country Of Origin India", "Marketed By", "Manufactured by", "For consumer complaints contact us at" (phone, email, address)**, "Net Quantity", then tech specs | sticky bar |
| [11](phone-pdp-11.jpg)–[12](phone-pdp-12.jpg) | Reviews | "Customer Reviews / Verified Reviews: Based on 95 reviews", dated, including 2- and 4-star reviews with complaints left in | sticky bar |
| [13](phone-pdp-13.jpg)–[16](phone-pdp-16.jpg) | FAQ, footer | Four FAQs (waterproof, mobile charger, battery, "Is there a warranty for the product? How do I claim warranty?"), long description, footer | sticky bar |

**CTA position and repetition.** The sticky bar (price, MRP, "Inclusive of all taxes", Add To Cart,
Buy Now) is on all 16 phone screens and inside the first 360 × 640 screen
([small360-pdp-01](small360-pdp-01.jpg)). The labels never change. On laptop there is no sticky bar:
the gallery is sticky and the buy box sits on the right ([laptop-pdp-01](laptop-pdp-01.jpg)), with a
WhatsApp float and a chat float at the bottom right.

**Phone width.** From screen 2 on, the fixed bars measured 402 px wide on the 390 px screen and the
header's cart icon is clipped at the right edge ([phone-pdp-04](phone-pdp-04.jpg)): the page
overflows sideways.

## Trust devices
- A four-icon guarantee row directly under the price and delivery check: warranty, replacement,
  delivery, GST billing.
- Star rating and count on the gallery and on every home card; verified reviews that keep the
  critical ones.
- The Legal Metrology declarations (MRP inclusive of taxes, country of origin, marketer,
  manufacturer, consumer-complaints contact) presented as ordinary rows of the spec table.
- Warranty Policy and a paid-repair policy in the footer; WhatsApp in the bottom bar.

## Offers and guarantees
- Every price is struck through with a percentage off; "Festive Price Live !!" on every card.
- Stacked codes: FESTIVE (5% prepaid), FESTIVE2000, DROP50, "5% off on 2 or more"; reward points on
  the buy bar; bank-card offers; ₹1-now Pay Later.
- Urgency everywhere: countdowns on the gallery and the flash-sale sheet, "Last Few Units Left!".

## Product → cart → checkout (phone)
1. **Buy Now** → GoKwik sheet in one tap ([flow-08](phone-flow-08-buy-now-first-screen.jpg)).
2. Or **Add To Cart** → "Your Cart" drawer ([flow-06](phone-flow-06-cart-drawer.jpg)): line item,
   quantity, "5% off on Prepaid Orders / Code: FESTIVE [Apply]", "View all coupons", "₹ 999 Inclusive
   of all taxes", **Pay Now**.
3. GoKwik sheet ([flow-07](phone-flow-07-checkout-first-screen.jpg)): "100% Secured Payment", "Add GST
   at next step", "Order Summary ₹3,991 saved so far · 1 item ~~₹4,990~~ ₹999", coupon field ("9
   coupons available"), "Login to Redeem Giftcard Balance / boAt Rewards / Partner Offers", **"Login to
   continue: +91 Enter Mobile Number"**, a pre-ticked "Send me order updates & offers - (no spam)",
   "Continue", "Powered By GoKwik: PCI DSS Certified, Secured Payments, Verified Merchant". **Stopped.**

Taps from product page to the first details screen: **1** (Buy Now) or 2 (Add To Cart, Pay Now).

## India-specific patterns
- **Prepaid offer**: 5% off prepaid in the sticky strip, the cart and the checkout.
- **Pincode delivery estimate** on the product page, pre-filled, with a date ("By tomorrow").
- **Pay Later / EMI** (₹1 now, snapmint) beside the price; **UPI** named ("UPI & Cards Accepted").
- **WhatsApp** as the "Chat" tab on every phone screen.
- **GST** both as a trust icon ("GST Billing") and at checkout ("Add GST at next step").
- **Mobile number first** (+91) at checkout, through GoKwik. **COD** is not shown before a number
  is entered.

## Motion on a phone
- **Gimmicky:** ticking countdowns (gallery, flash-sale sheet), an auto-rotating 10-slide hero, a
  bottom-sheet popup over the first screen at 360 × 640.
- **Slow:** the slowest product-page LCP in this group on Lighthouse (below); the home page also
  shifts (CLS up to 0.375).
- **Elegant:** the sticky buy bar is static and always tappable; the CSS carries 18
  `prefers-reduced-motion` rules.

Three runs per page, because the first ran beside a checkout probe and the results varied widely.
Median first, then the range.

| Lighthouse 13.4.1, mobile, 3 runs (2026-10-11 04:52-05:21 UTC) | Perf | LCP | TBT | CLS | Page weight | A11y |
|---|---|---|---|---|---|---|
| Home (the festive-sale page it redirects to) | 28 (20-39) | 8.5 s (7.7-11.9) | 670 ms (630-790) | 0.367 (0.16-0.375) | 6,609-7,069 KiB | 84 |
| Product page | 36 (35-39) | 13.6 s (8.6-13.6) | 680 ms (560-700) | 0.191 | 8,016-8,448 KiB | 95 |

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** the declarations block as normal spec rows (MRP inclusive of taxes, country of origin,
  manufacturer or importer, consumer-care contact). Kheelona owes the same facts
  ([open questions](../../../../open-questions.md) F3; [policies](../../../../product/policies.md)).
- **Adopt:** a short trust row directly under the price, using only confirmed terms (returns and
  warranty are still F1). Brief §9.1.
- **Adapt:** "Buy Now goes straight to payment details in one tap". Kheelona already does this: the
  CTA reaches the store in one tap and there is no cart ([checkout](../../../../site/checkout.md#in-one-screen)).
  Keep it.
- **Adapt:** WhatsApp as a persistent help tab, labelled as WhatsApp, messages only (Kheelona's only phone channel,
  [facts: support channel](../../../../product/facts.md#support-channel)); WhatsApp's in-app browser is the
  largest single source of phone sessions, 35.7%
  ([PostHog audit §11](../../../../research/posthog-audit.md#11-devices-browsers-and-screen-sizes-for-qa)).
- **Avoid:** countdowns, flash-sale sheets and stacked codes. The token offer is bounded by units,
  never by a clock, and the count is never published ([pricing](../../../../product/pricing.md)).
- **Avoid:** Pay Later, EMI or COD badges unless the method is enabled (only UPI is proven,
  [policies: payment methods](../../../../product/policies.md#payment-methods); F6).
- **Avoid:** sideways overflow on phones (brief §9.10).

**Most transferable lesson.** boAt shows that the India declarations (MRP inclusive of taxes,
country of origin, manufacturer, consumer-complaints contact) can live in the product page's spec
table, with a four-icon guarantee row right under the price: compliance and reassurance in the
places a buyer already looks.
