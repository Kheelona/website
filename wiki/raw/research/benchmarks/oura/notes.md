---
title: "Benchmark capture: Oura (ouraring.com)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://ouraring.com/ (home, phone and laptop, captured 2026-10-11 02:14-02:16 UTC, Indian connection)"
  - "https://ouraring.com/store (store page, phone and laptop, captured 2026-10-11 02:15-02:16 UTC, Indian connection)"
  - "https://ouraring.com/store/rings/oura-ring-4/silver (product page, phone and laptop, captured 2026-10-11 02:29-02:31 UTC, Indian connection; Add to Cart attempt 02:38 UTC)"
  - "Same product page → cart (ouraring.com/en/cart) → ouraring.com/checkout (phone, captured 2026-10-11 05:05-05:09 UTC, US connection; stopped at the first form)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:11 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:53 UTC, US connection"
---

# Oura (ouraring.com)

**Why it is here.** Global DTC leader from the brief's starting set (brief §6, Market Research): a
premium health device that sells an outcome, carries health claims under footnotes, and comes with a
subscription. Closest global analogue for "a ₹4,999 device whose value is what it does for you".

**Store reached, and why it matters.** The same URLs behave differently by country:
- **Indian connection:** a strip on every page, "Oura Ring is available in India at Cromā and Amazon.",
  and on the product page a **disabled "Add to Cart"** with "Available in India at Cromā and Amazon" under
  it. Price shown "$244.30" with "$349" struck through. Oura does not sell to India on its own site.
- **US connection:** no strip, "$349" without a strike-through, an "HSA/FSA eligible" chip, a warranty
  choice, and a working "Add to Cart". The cart and checkout below are from this connection.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, scrolled viewport chunks. The connection is
named on every row below.

| Files | What |
|---|---|
| `phone-home-00..11.jpg` | Home, phone (7,467 px). `00` is blank apart from the strip and the logo: the hero had not faded in |
| `phone-store-00..07.jpg` | `/store`, phone (4,858 px) |
| `phone-pdp-00..11.jpg` | Product page, Oura Ring 4 Silver, phone (8,164 px), Indian connection |
| `laptop-home-00..09.jpg`, `laptop-store-00..06.jpg`, `laptop-pdp-00..07.jpg` | Laptop |
| `phone-flow-01..02.jpg` | Indian connection: product page and the disabled Add to Cart |
| `phone-flow-03..11-us-*.jpg` | US connection: buy box → upsell sheet → cart → first checkout screen |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens (US connection) |
| `phone-home-scroll.webm` | Phone scroll of Home |

## Home (phone, Indian connection): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | First paint | Availability strip and logo only; the rest of the screen is empty | none | none |
| [01](phone-home-01.jpg) | Hero | Photo of a hand with the ring; H1 "Wear your best life"; "Get a clearer picture of your health with the world's smallest smart ring." | Superlative in the sub-line | "Shop Now" |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | Promise and areas | "Understand your body. Own your health." ("Oura gives you insights unique to your body, so every day adds up to a longer, healthier life."); "Why Oura" / "How It Works"; a carousel of health areas (Sleep and Rest, Wellness and Longevity, Activity and Fitness, Heart Health, Women's Health, Stress) | none | Why Oura, How It Works |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Outcome statistic | **"86% of Oura Members see their health improve¹"**; "Track over 50 health metrics…"; "Available on iOS and Android". Footnote 1 at the foot of the page: "Based on a 2026 survey with 3,501 Oura members after using Oura Ring for 30 days." ([09](phone-home-09.jpg)) | Footnoted survey | Explore Membership |
| [04](phone-home-04.jpg)–[05](phone-home-05.jpg) | Stories | "Real members, real stories of impact": quote cards tagged Heart Health, Symptom Radar, Women's Health, each with a photo and first name plus initial ("Tim S.", "Tabitha P.", "Ashley W.") | Named member quotes | none |
| [06](phone-home-06.jpg) | Feature | "New features: Meet Health Radar" with footnote 2, a disclaimer that the features "are intended for general wellness purposes only" and do not diagnose or treat | Disclaimer | Explore |
| [07](phone-home-07.jpg)–[08](phone-home-08.jpg) | Press | "In the news": "How Oura Measures Sleep and Validates Accuracy" (Read More), then cards from The Guardian, Esquire and CNET | Press | Read More |
| [09](phone-home-09.jpg)–[11](phone-home-11.jpg) | Footer | Both footnotes; PayPal, Apple Pay and G Pay marks with "Instant Checkout"; links incl. "Clinical and Science Experts"; newsletter | Payment marks | none |

**Headline formula.** An aspiration as the H1 ("Wear your best life"), then the mechanism and the
product in the sub-line. Every number on the page carries a footnote with its sample and timing.

**`/store`** ([phone-store-00](phone-store-00-first-load.jpg)–[07](phone-store-07.jpg)): "Your health
journey starts here"; "Oura Ring 4 From $244.30"; a **"Buy with confidence"** card: "Free, easy returns
within 30 days of purchase", "Free trial month for new Oura Members", "Limited 1-year warranty, Extended
options available", "24/7 support, Get help when you need it"; accessories; a partner offer; footnotes;
"Major Cards Accepted".

## Product page (phone, Indian connection): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg)–[01](phone-pdp-01.jpg) | Gallery and title | Gallery (includes an autoplaying, muted, looping video); "Oura Ring 4 / Smart insights, made personal"; finish swatches; "Silver – $244.30 $349" | none in the first screen |
| [02](phone-pdp-02.jpg) | Buy box | "Size / Find your fit" with "Free Sizing Kit" selected; grey, disabled "Add to Cart"; "Available in India at Cromā and Amazon" | Add to Cart (disabled) |
| [03](phone-pdp-03.jpg)–[05](phone-pdp-05.jpg) | Benefits | Smart Sensing, titanium, "5-8 days** of battery life" (footnoted), "Oura Membership grows with you", six health areas | sticky bar |
| [06](phone-pdp-06.jpg)–[07](phone-pdp-07.jpg) | FAQ near the buy box | "How accurate is the Oura Ring?" (answer cites "independent, peer-reviewed studies", Learn More), water use, what it tracks, "Can I use Oura Ring without a subscription?", sizing | sticky bar |
| [07](phone-pdp-07.jpg)–[09](phone-pdp-09.jpg) | Box and specs | "What's Included: Oura Ring 4, Size-specific charger, USB-C cable"; specs (sensors, compatibility, weight and dimensions, battery, materials, connectivity); footnotes on auto-renewal and battery life | sticky bar |
| [10](phone-pdp-10.jpg)–[11](phone-pdp-11.jpg) | Footer | Payment marks, links | none |

**CTA position and repetition.** One label, "Add to Cart", in the buy box and in a sticky bottom bar
"Oura Ring 4 / Add to Cart" from [03](phone-pdp-03.jpg) to [09](phone-pdp-09.jpg) (disabled on the
Indian connection). At **360 × 640** (US connection) the product page's first screen shows the gallery,
"HSA/FSA eligible" and the name, but no price and no CTA ([small360-pdp-01](small360-pdp-01.jpg));
Home's "Shop Now" is inside the first screen ([small360-home-01](small360-home-01.jpg)).

## Trust devices
- Footnoted numbers (survey size and timing) and a wellness disclaimer on the same page as the claim.
- "Buy with confidence": returns, trial month, warranty, 24/7 support, in one card on the store page.
- Named member stories by health area; press; "Clinical and Science Experts" in the footer.
- An accuracy FAQ beside the buy box; box contents and full specs.
- For India: an honest availability strip that names where to buy instead of a broken checkout.

## Offers and guarantees
- Indian connection: a struck "$349" with "$244.30".
- US connection: warranty choice beside the button ("1-year protection plan, Included with purchase /
  Upgrade to 2-year $45 / Upgrade to 3-year $60, Most popular", [flow-04](phone-flow-04-us-warranty-and-add-to-cart.jpg));
  a membership trial added to the cart as a free line; Affirm ("Zero interest or as low as $30/mo") and
  Klarna ("From $31/month, or 4 payments at 0% interest") under the checkout button.
- The membership terms are long legal text in the cart and in footnotes: it auto-renews, and prepaid
  memberships "are non-refundable after 30 days".

## Product → cart → checkout (phone, US connection, 2026-10-11)
1. "Add to Cart", with the default Free Sizing Kit and 1-year plan
   ([flow-03](phone-flow-03-us-buy-box.jpg), [flow-04](phone-flow-04-us-warranty-and-add-to-cart.jpg)),
   opens a bottom sheet upsell: "One year of Oura Membership" ("hassle-free"), "HSA/FSA eligible",
   "Prepay now for 12 months $69.99", with "Skip for Now" and "Add to Cart" ([flow-05](phone-flow-05-us-membership-upsell.jpg)).
2. "Skip for Now" lands on **Review Cart** ([flow-06](phone-flow-06-us-cart.jpg)–[08](phone-flow-08-us-cart-scroll2.jpg)):
   a delivery card first, **"Free standard shipping. Estimated delivery by Oct 15. Faster delivery and
   pickup at checkout."**; lines "Oura Ring 4 Silver $349", "Oura Membership FREE ($5.99 struck): New
   members receive a free trial month. $5.99 USD/month afterwards.", "Oura Sizing Kit Included"; add-ons;
   "Subtotal $349 USD"; "This is a gift" tick box; Checkout / PayPal / G Pay; Affirm and Klarna lines;
   card marks.
3. "Checkout" opens **Secure Checkout** ([flow-09](phone-flow-09-us-checkout-first-screen.jpg)–[11](phone-flow-11-us-checkout-scroll2.jpg)):
   order details $349; Express checkout (G Pay); "Delivery Address" with a "Delivery Estimates" link;
   country, name, email, address, city, state, zip, phone; "Next: Shipping Method"; then Shipping,
   Billing Address and Payment as later steps. The country list has no India. **Stopped here.**

Taps from product page to the first details screen: 3 (Add to Cart, Skip for Now, Checkout).

## India-specific patterns
- Retail handoff instead of selling: Cromā and Amazon named in a strip and under a disabled button.
  The Cromā Oura page answered "Access Denied" to our headless browser in the first run, so the handoff
  itself was not followed.
- No INR, UPI, COD, EMI or WhatsApp on ouraring.com. Affirm and Klarna are the US instalment options.

## Motion on a phone
- **Slow and hidden:** the hero fades in after first paint, so the first phone screen is empty
  ([phone-home-00](phone-home-00-first-load.jpg); laptop the same, [laptop-home-00](laptop-home-00-first-load.jpg)).
- **Reveals:** smooth scroll behaviour; during the scripted scroll 15 animations of 500 ms and 13 of
  600 ms ran (section reveals), plus colour transitions (`phone-home-scroll.webm`). No
  `prefers-reduced-motion` rules were found in Home's readable CSS; the product page has them.
- **Elegant:** the upsell arrives as a bottom sheet over the page, and the sticky bar is static.
- **Media:** the product gallery autoplays a muted, looping video.

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home (LCP element: the cookie banner text) | 58 | 100 | 13.2 s | 160 ms | 0.001 | 1,873 KiB |
| Product page | 58 | 95 | 9.5 s | 280 ms | 0 | 4,623 KiB |

## Laptop (1440 × 900)
Nav: Shop, Your Health, Why Oura, For Organizations. The home hero is blank at first paint too. The
store page leads with a very large serif headline ([laptop-store-00](laptop-store-00-first-load.jpg)); the
product page is two columns with the disabled Add to Cart and the retailer line on the Indian connection
([laptop-pdp-00](laptop-pdp-00-first-load.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** every number on the page footnoted with its sample and timing, on the same page. For
  Kheelona that means no outcome figure until pilot data exists, and then "In our pilot of X children
  over Y weeks" ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails), the
  Results row; F10 in [open questions](../../../../open-questions.md)).
- **Adopt:** one "Buy with confidence" card beside the buy box with returns, warranty and support, using
  only confirmed terms: 7-day returns, no questions asked ([D021](../../../../decisions/D021-returns-policy.md)); 6-month warranty ([D022](../../../../decisions/D022-warranty-replacement-refund.md)); WhatsApp
  support ([policies](../../../../product/policies.md)). Brief §9.1.
- **Adopt:** a delivery estimate as the first thing in the cart. For Kheelona, the delivery date for new
  orders ([D023](../../../../decisions/D023-new-order-delivery.md)) at the top of the store page ([PostHog audit §8, issue 4](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
- **Adapt:** the availability strip. Oura tells Indian visitors where they can buy; Kheelona should
  state where it delivers beside the CTA (PostHog audit §8, issue 9).
- **Adapt:** the membership shown as an included line in the cart; Kheelona's included Kheelona+ months
  may be shown only in the sanctioned wording and never with a price (F7; [facts](../../../../product/facts.md)).
- **Avoid:** an entrance fade on the hero, which leaves the first phone screen empty (brief §9.11:
  never hide the LCP element or the primary CTA behind an entrance animation).
- **Avoid:** an upsell sheet between "add" and the cart (brief §9.1, fewest taps; §4.4 checkout
  unchanged).

**Most transferable lesson.** Oura sells an outcome with numbers, and every number carries a footnote
with its sample size and timing on the same page; Kheelona's brain-development promise needs exactly
this discipline, and until pilot data exists, no number at all.
