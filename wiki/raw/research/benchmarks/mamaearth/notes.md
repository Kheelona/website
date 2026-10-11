---
title: "Benchmark capture: Mamaearth (mamaearth.in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://mamaearth.in/ (home; captured 2026-10-11 02:12 UTC phone, 02:14 UTC laptop; re-captured 05:07-05:10 UTC phone and laptop; 360 × 640 at 05:02 UTC)"
  - "https://mamaearth.in/products/rice-face-wash-with-rice-water-niacinamide-for-glass-skin-150-ml (product page; captured 2026-10-11 02:13 UTC phone, 02:15 UTC laptop; re-captured 05:09 UTC phone; 360 × 640 at 05:02 UTC)"
  - "Cart page and GoKwik checkout opened from that page (2026-10-11 02:47 UTC and 05:06 UTC; stopped at the mobile-number screen, nothing typed)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), three runs per page, 2026-10-11 04:54-05:26 UTC"
---

# Mamaearth (mamaearth.in)

**Why it is here.** A leading Indian D2C personal-care brand that began with baby care and still
sells "by the parents and for the parents" (its own home copy), from the brief's starting set
(brief §6). Indian D2C group. Its buyer overlaps Kheelona's: urban mothers buying on phones.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, 1x, scrolled viewport chunks; copy
from the live DOM text. The first home and product captures (02:12-02:15 UTC) caught many sections
as grey loading skeletons, so both were re-captured at 05:07-05:10 UTC (`*-slow`) by scrolling to
absolute positions and waiting for images in view. The re-captures came from a US-based connection
(Cloudflare trace `loc=US`); prices and offers matched the first run.

| Files | What |
|---|---|
| `phone-home-slow-01..20.jpg` | Home, phone, complete (15,372 px, 20 screens). Use these |
| `phone-home-01..18.jpg` | Home, first run: screens 03 to 08 are mostly loading skeletons |
| `phone-pdp-slow-01..10.jpg` | Product page, phone, complete (7,490 px, 10 screens). Use these |
| `phone-pdp-01..08.jpg` | Product page, first run: screens 03 and 04 are blank |
| `small360-{home,pdp}-01.jpg` | First screen at 360 × 640 |
| `laptop-home-slow-01..14.jpg`, `laptop-pdp-01..10.jpg` | Laptop (`laptop-home-01..08` from the first run are skeletons) |
| `phone-flow-01..05.jpg` | Product page → delivery check → after add → cart page → cart again (the first run's Checkout tap did not open the sheet) |
| `phone-flow-06-cart-loaded`, `-07-checkout-first-screen` | Cart page → GoKwik sheet |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [01](phone-home-slow-01.jpg) | Sell immediately | **No hero.** Sticky "Discover Our Goodness" header with search (typing placeholder); category icon tabs (Best Sellers, B1G1 FREE, Hair, Face, Lipstick, New Launch, Baby…); "Discover our customer's most-loved products": product cards with a badge ("Best Seller", "Most Loved Sunscreen", "No. 1 Face Wash"), "For All Skin types", a benefit line, rating and review count, size, ₹359 ~~₹449~~ 20% OFF | Badges, ratings on every card | **"Add to cart" on every card** |
| [02](phone-home-slow-02.jpg) | Seasonal | Banner carousel; "Monsoon Is Here / Your good to go products for rainy days" rail | Ratings | Add to cart |
| [03](phone-home-slow-03.jpg)–[05](phone-home-slow-05.jpg) | Bestsellers by need | "Our Face Bestsellers / Formulated with love and the goodness of natural ingredients" (tabbed), Hair, Baby; claim lines on cards ("Gives up to 94% Stronger Hair \| Up to 93% Less Hair Fall \| Made Safe Certified"); "Shop By Ingredients" (Rice, Vitamin C, Ubtan, Rosemary, Beetroot, Onion) | Certification name on cards; percentage claims | Add to cart |
| [06](phone-home-slow-06.jpg) | Why us | "Why Mamaearth?" icon row (toxin-free products, tree plantation, made safe); "Just Launched" | Values | Add to cart |
| [07](phone-home-slow-07.jpg)–[08](phone-home-slow-08.jpg) | Range and cause | "Our Makeup Bestsellers / All-new colorcare range that's 100% toxin-free" ("Notify Me" on a sold-out item); "we plant goodness / Plant a tree with your next purchase" | Cause | Add to cart |
| [09](phone-home-slow-09.jpg)–[20](phone-home-slow-20.jpg) | SEO | Long text: "Get your hands on Nature-Inspired Mamaearth Products", "Asia's first brand to be accoladed with Made Safe Certification", "We are a brand by the parents and for the parents", "Get extra 5% OFF on prepaid orders up to ₹50", founders' names, app download, range descriptions, "Mamaearth Products Price List in India" | Certification and founder claims in text | links |

Fixed on every screen: **"Add ₹399 more to get FREE delivery"** strip, a floating **"ASK AI"**
button, and a bottom bar (Home, Category, B1G1, Profile, Get App, Cart). At 360 × 640 the first
cards' "Add to cart" buttons sit under that strip and bar, only partly visible
([small360-home-01](small360-home-01.jpg)).

**Headline formula.** None on the phone: the first screen is already a shelf with prices and
"Add to cart". The laptop home has a hero banner ("Up to 100%* Damage Repair / Smooth, Shiny Hair /
SHOP NOW") with an asterisked test footnote ([laptop-home-slow-01](laptop-home-slow-01.jpg)).

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-pdp-slow-01.jpg) | Buy box | App strip "For better experience download our Mamaearth app [Get App]"; H1 "Rice Dewy Bright Face Wash With Rice Water & Niacinamide for Glass Skin - 150 ml"; "4.5 \| 364 Reviews"; benefit chips (For all skin types, Bright Skin, Even Skin Tone, Cleansing); gallery with "Best Seller" and a floating creator-video bubble; "Net content: 150ml (USP: ₹2.39/ml)"; "₹359 M.R.P. ~~₹449~~ 20% off Incl. of all taxes" | **Sticky bar from first paint: "Add to cart - ₹359" + Cart** |
| [02](phone-pdp-slow-02.jpg) | Choose, deliver, return | "Select Variants" cards (150 ml "Best Seller"; 200 ml and packs badged "Buy 1 Get 1 FREE", each with a unit price); **"Get lightning-fast delivery / Check estimated delivery date [Enter your pincode] Check"**; **"7 days return and refund (i) · FREE Shipping on orders above ₹399"**; "Glass Skin Starts in the Sink": creator videos | sticky bar |
| [03](phone-pdp-slow-03.jpg)–[04](phone-pdp-slow-04.jpg) | Explain | Infographic images: "Why you'll love our Rice Dewy Bright Face Wash", key ingredients, how to use in three steps, "Our Goodness Promises" (Made Safe, Best of Nature, Cruelty-Free, Plastic Positive, we plant goodness) | sticky bar |
| [05](phone-pdp-slow-05.jpg) | Why us | "Why Mamaearth? We are made-safe, non-toxic and natural": "Happy customers: 2.5 million customers trust and love our made-safe products", "Natural ingredients", "Tree plantation: We've planted 8,00,000+ trees" | sticky bar |
| [05](phone-pdp-slow-05.jpg)–[06](phone-pdp-slow-06.jpg) | Details | Accordions: Product description, Key Ingredients, How to use, Suitable for, Ingredients List | sticky bar |
| [06](phone-pdp-slow-06.jpg)–[10](phone-pdp-slow-10.jpg) | Objections | **FAQ, 19 questions in the buyer's words**: "Does This Work For Dry Skin?", "Can Men Use It?", "Can This Irritate My Sensitive Skin?", "Can teenagers use … safely?"; then "Disclaimer And Additional Information", footer | sticky bar |

**CTA position and repetition.** "Add to cart - ₹359" (price inside the label) on all 10 phone
screens and inside the first 360 × 640 screen ([small360-pdp-01](small360-pdp-01.jpg)). On laptop
the buy box is sticky beside the gallery and a full-width bottom bar repeats the product name and
"Add to cart - ₹359" ([laptop-pdp-01](laptop-pdp-01.jpg)).

## Trust devices
- Certification name repeated on cards, in the promises row and in the SEO text ("Made Safe").
- Ratings and review counts on every card; creator videos ("Glass Skin Starts in the Sink").
- A 19-question FAQ written as the buyer would ask it.
- Return window and free-shipping threshold printed under the delivery check.
- Unit selling price (₹ per ml) beside every price.

## Offers and guarantees
- Strike-through MRP with a percentage; "Buy 1 Get 1 FREE" on variants; free-delivery progress strip;
  a 5% prepaid discount (in SEO copy); coupons auto-applied at checkout ("MEAUTO20").
- "7 days return and refund" with an info icon, beside the delivery check.
- **The numbers do not agree across steps.** The product page says "FREE Shipping on orders above
  ₹399" ([slow-02](phone-pdp-slow-02.jpg)); with a ₹359.20 item in the cart, the cart says "Unlock FREE
  delivery: Add item worth ₹640 more for FREE delivery" and "To Pay ₹381.24"
  ([flow-06](phone-flow-06-cart-loaded.jpg)); the checkout then shows "₹359.20" and "₹89.80 saved so far"
  against the cart's "You saved ₹107.76" ([flow-07](phone-flow-07-checkout-first-screen.jpg)). The
  difference is not itemised on either first screen.

## Product → cart → checkout (phone)
1. **"Add to cart - ₹359"**: stays on the page; a toast "Item added to your cart" and a badge on the
   cart icon ([flow-03](phone-flow-03-after-add.jpg)).
2. **Cart** → cart page ([flow-06](phone-flow-06-cart-loaded.jpg)): "You saved ₹107.76 on this order",
   "Available offers for you (2)" (REDEEM35, B1G1), the item, the free-delivery upsell, a "Lightning
   Sale! / Buy Again" cross-sell rail, sticky "To Pay ₹381.24 [Checkout]".
3. **Checkout** → GoKwik sheet ([flow-07](phone-flow-07-checkout-first-screen.jpg)): coupon "MEAUTO20"
   applied, "Login to Redeem Mamacash", **"Login to continue: +91 Enter Mobile Number"**, pre-ticked
   "Send me order updates & offers - (no spam)", "Continue", "Powered by GoKwik: PCI DSS Certified,
   Secured Payments, Verified Merchant". **Stopped.**

Taps from product page to the first details screen: **3** (Add to cart, Cart, Checkout).

## India-specific patterns
- **Pincode delivery-date check** in the buy box; free-shipping threshold; return window.
- **Prepaid incentive** (5% off up to ₹50, stated in the home copy).
- **Mobile number first** (+91) through GoKwik; **COD, UPI and EMI are not shown** before a number.
- **Unit price** (₹/ml) and "Incl. of all taxes" beside every price; MRP labelled as M.R.P.
- No WhatsApp link on the page (DOM check, 2026-10-11); help is the "ASK AI" assistant.
- App push on every product page ("For better experience download our Mamaearth app").

## Motion on a phone
- **Slow:** the heaviest product page in this group (10,789-13,468 KiB) and the highest blocking time
  on Home (median 1,830 ms) in Lighthouse (below). In our first capture whole sections were still grey
  skeletons after about a second per screen.
- **Busy:** hundreds of running animations on Home (353 in the first capture, mostly skeleton
  shimmer and carousels); a typing search placeholder; a floating creator-video bubble on the gallery.
- **Elegant:** the sticky "Add to cart - ₹359" bar never moves; layout shift stayed low (CLS 0 and
  0.01 in Lighthouse); the CSS carries 16 `prefers-reduced-motion` rules.

Median of three runs, range in brackets.

| Lighthouse 13.4.1, mobile, 3 runs (2026-10-11 04:54-05:26 UTC) | Perf | LCP | TBT | CLS | Page weight | A11y |
|---|---|---|---|---|---|---|
| Home | 36 (27-37) | 6.2 s (5.3-11.7) | 1,830 ms (1,450-2,470) | 0 | 7,261-7,533 KiB | 97 |
| Product page | 41 (40-42) | 5.8 s (5.5-6.0) | 1,030 ms (940-1,050) | 0.01 | 10,789-13,468 KiB | 92 |

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** an FAQ in the parent's own words near the CTA (brief §9.1). The questions exist
  already ([audience: objections](../../../../brand/audience.md#objections)); answers must come from
  confirmed facts ([messaging: objection answers](../../../../brand/messaging.md#objection-answers)).
- **Adopt (as a rule):** every price, threshold and saving rendered from one source, so the product
  page, the store and the payment sheet always agree (brief §9.1; [pricing](../../../../product/pricing.md)).
- **Adapt:** the return window printed right under the buy box, once F1 is answered
  ([open questions](../../../../open-questions.md); [policies](../../../../product/policies.md)).
- **Adapt:** the price inside the sticky CTA label ("Add to cart - ₹359") is one candidate for G1;
  founder decision #9 put the price in the caption instead ([messaging: CTA labels](../../../../brand/messaging.md#cta-labels)).
- **Avoid:** skeleton-heavy, animation-heavy pages; Kheelona's phone INP is already over budget
  ([PostHog audit §8, issue 8](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
- **Avoid:** unsourced percentage claims on cards ("Up to 93% Less Hair Fall") without the study on
  the page ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails)).

**Most transferable lesson.** Mamaearth's free-delivery threshold and totals change between the
product page (₹399), the cart ("₹640 more", ₹381.24) and the checkout (₹359.20): a parent sees three
different stories in three taps. Kheelona's price, token, refund and ship-date lines must come from
the store's own source on every surface.
