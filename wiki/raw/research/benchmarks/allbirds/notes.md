---
title: "Benchmark capture: Allbirds (allbirds.com, US store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.allbirds.com/ (home, phone and laptop, captured 2026-10-11 02:22-02:24 UTC, Indian connection)"
  - "https://www.allbirds.com/products/mens-tree-runner-nz-medium-grey (product page, phone and laptop, captured 2026-10-11 02:23-02:25 UTC)"
  - "Product page → cart drawer → Shopify checkout at allbirds.com/checkouts (phone, captured 2026-10-11 02:36 UTC; stopped at the first form)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:10-05:17 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:51 UTC, US connection"
---

# Allbirds (allbirds.com, US store)

**Why it is here.** Global DTC leader from the brief's starting set (brief §6, Market Research). One
hero product family, sold on comfort and materials rather than on discounts.

**Store reached.** There is no Indian store. The Indian connection got a "Where are we shipping to?"
modal preset to United States ([phone-home-00](phone-home-00-first-load.jpg)); the footer's country list
has no India. Everything below is the US store, in USD.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, as scrolled viewport chunks, from an Indian
connection (2026-10-11 02:22 UTC). The 360 × 640 first screens and Lighthouse were added on
2026-10-11 from a **US connection** (Cloudflare trace `loc=US`), which shows a different popup set.
`*-00-first-load` is the first screen before any popup was closed. Text was read from the live DOM.

| Files | What |
|---|---|
| `phone-home-00..07.jpg` | Home, phone (4,611 px) |
| `phone-pdp-00..10.jpg` | Product page, Men's Tree Runner NZ, phone (6,761 px) |
| `laptop-home-00..05.jpg`, `laptop-pdp-00..08.jpg` | Laptop |
| `phone-flow-01..07.jpg` | Size → add to cart → cart drawer → first checkout screen |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens, before and after popups (US connection) |
| `phone-home-scroll.webm` | Phone scroll of Home |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | Country gate | Modal "Where are we shipping to? Purchasing from your country's website is the best way to connect your feet to the world's most comfortable shoe." United States, CONFIRM | none | CONFIRM |
| [01](phone-home-01.jpg) | Hero | A dark announcement bar that rotates "Due to increased demand, orders may take up to 30 days to ship." and "Free ground shipping on orders over $100"; floating header; photo; eyebrow "ALL NEW DASHER NZ COLLECTION"; H1 "Wildly Comfortable. Super Natural." | none | "SHOP MEN" + "SHOP WOMEN" (equal pills) |
| [02](phone-home-02.jpg) | Route | Category tiles New Arrivals, Mens, Womens, Best Sellers; "BEST SELLERS" card carousel with NEW badges and prices ($75 to $105) | Best-seller label | product cards |
| [03](phone-home-03.jpg)–[05](phone-home-05.jpg) | Campaigns | Photo banners "Summer Travel Essentials", "New Arrivals", "Fresh Colors For Summer", each with SHOP MEN / SHOP WOMEN | none | outline pills |
| [05](phone-home-05.jpg)–[06](phone-home-06.jpg) | Values | Three cards: "WEAR ALL DAY COMFORT", "DESIGNED FOR EVERYDAY WEAR", "MATERIALS FROM THE EARTH" ("We replace petroleum-based synthetics with natural alternatives wherever we can. Like using wool, tree fiber, and sugarcane.") | Named materials | none |
| [06](phone-home-06.jpg)–[07](phone-home-07.jpg) | Footer | Email signup, Help / Shop / Company accordions, socials, "US" selector, policies | none | SIGN UP |

A floating "Shop Best Sellers" pill with a sparkle icon (an AI shopping assistant) sits over the content
from the first screen on.

**Headline formula.** Two-beat adjective pair, benefit then material ("Wildly Comfortable. Super
Natural."), under a collection eyebrow. No price, no proof and no single action in the hero: the CTA
splits the visitor by gender. Home is short (7 phone screens) and works as a router to products.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg)–[01](phone-pdp-01.jpg) | Title and gallery | Breadcrumb; H1 "Men's Tree Runner NZ"; "ALSO AVAILABLE IN: WOMEN'S SIZES"; "$100" with a "+ FREE SHIPPING" chip; gallery; colour swatches start at the foot. Tooltip bubbles ("Tree-based upper for lightweight comfort") float from an "Explore this product" AI pill | none in the first screen |
| [02](phone-pdp-02.jpg) | Choose | Swatch groups Tree / Jersey / Stripe (one SALE badge); size grid with sold-out sizes struck through; "The Tree Runner NZ fits true-to-size for most customers. Fit Guide"; "Free Shipping on Orders over $100" under the button | "SELECT A SIZE" (inactive until a size is picked) |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Why | "WHY WE LOVE THIS"; "THOUGHTFULLY DESIGNED" bullets naming each material (TENCEL Lyocell, SweetFoam, Merino-wool lining, Featherbed foam); "BEST FOR" chips; "View technical details" (includes "Country of Origin: Vietnam"); Materials and Care accordions | sticky bar appears |
| [04](phone-pdp-04.jpg)–[06](phone-pdp-06.jpg) | Lifestyle and feature | Photo cards ("Modern + Refined", "Travel Essentials"); "Breathable By Nature" section on an autoplaying, muted, looping video (Breathable, Lightweight, Supportive, Responsibly Sourced) | sticky bar |
| [06](phone-pdp-06.jpg)–[07](phone-pdp-07.jpg) | Cross-sell | "YOU MAY ALSO LIKE" carousel, "ADD TO CART" on each card | sticky bar |
| [07](phone-pdp-07.jpg) | Reviews | Heading "Reviews for Men's Tree Runner NZ"; **no rating or review text rendered in our capture** | sticky bar |
| [07](phone-pdp-07.jpg)–[10](phone-pdp-10.jpg) | Brand, footer | "Better Things in a Better Way", sustainability chips, the three value cards, footer | none |

**CTA position and repetition.** The button names the next step: "SELECT A SIZE" until a size is
picked, then "ADD TO CART - $100" ([flow-02](phone-flow-02-size-selected.jpg)). A sticky bottom bar
"Men's Tree Runner NZ $100 / SELECT A SIZE" appears once the inline button scrolls away
([03](phone-pdp-03.jpg)–[07](phone-pdp-07.jpg)) and hides at the footer ([08](phone-pdp-08.jpg)). At
**360 × 640** (US connection) the first screen of the product page shows title and price but no buy
button, and the "Shop with AI" pill sits where a sticky bar would ([small360-pdp-01](small360-pdp-01.jpg));
on Home the two hero pills are inside the first screen once popups are closed
([small360-home-01](small360-home-01.jpg)).

## Trust devices
- One reassurance repeated at every step: free shipping over $100 in the announcement bar, the price
  chip, under the button, and in the cart as a progress message ("You've earned free shipping!") with
  the struck shipping fee ("$5.00 FREE").
- An honest delivery expectation in the announcement bar: "Due to increased demand, orders may take
  up to 30 days to ship."
- Specific materials with names instead of adjectives; a fit note ("true-to-size for most
  customers"); country of origin in the technical details.
- Refund policy, privacy and terms in the footer and at checkout. No star rating near the buy box.

## Offers and guarantees
- Free shipping above a threshold is the main offer; SALE swatches on some colours.
- From the US connection, the first screen was covered by "Unlock 10% Off Your Order: When you sign up
  for email and texts", then by a cookie consent with Accept / Decline
  ([small360-home-00](small360-home-00-first-load.jpg)).
- At checkout the order summary carries a **"Free Returns Coverage $2.98"** line that was not shown in
  the cart drawer we captured, so the total became $102.98
  ([flow-07](phone-flow-07-checkout-order-summary-open.jpg)); "Email me with news and offers" is ticked
  by default ([flow-04](phone-flow-04-checkout-first-screen.jpg)).

## Product → cart → checkout (phone, 2026-10-11)
1. Tap a size: the button becomes "ADD TO CART - $100" ([flow-02](phone-flow-02-size-selected.jpg)).
2. Add to cart opens a drawer ([flow-03](phone-flow-03-cart-drawer.jpg)): "CART (1) You've earned free
   shipping!" with a progress bar, the line item with a quantity stepper, "RECOMMENDED FOR YOU" socks,
   "Subtotal $100 / Shipping $5.00 FREE", "PROCEED TO CHECKOUT", and express buttons (Amazon Pay, G Pay,
   PayPal, Shop Pay).
3. Shopify checkout ([flow-04](phone-flow-04-checkout-first-screen.jpg)–[07](phone-flow-07-checkout-order-summary-open.jpg)):
   collapsed order summary ($102.98); Express checkout (Shop Pay, PayPal, G Pay); Contact (email);
   Delivery (country preset United States, name, address, city, state, ZIP); "Shipping method: Enter
   your shipping address to view available shipping methods."; Payment (card, Shop Pay "Pay in full or
   in installments", PayPal); "Pay now". **Stopped here.**

Taps from product page to the first details screen: 3 (size, Add to cart, Proceed to checkout).

## India-specific patterns
- None. No Indian store, no INR, no COD, UPI or WhatsApp support. Instalments only through Shop Pay.
- The country gate is the only acknowledgement of a foreign visitor.

## Motion on a phone
- **Calm:** no autoplay video on Home, five swipe carousels, CSS transitions only (opacity 300 ms,
  border colours 200 ms) in the scripted scroll (`phone-home-scroll.webm`). No `prefers-reduced-motion`
  rules found in its CSS.
- **Gimmicky:** the AI assistant pill cycles prompt bubbles ("Perfect for everyday warm-weather wear",
  "What sizes are available for these sneakers?") over the copy and sits over the bottom of the screen
  on every page ([phone-pdp-04](phone-pdp-04.jpg), [flow-03](phone-flow-03-cart-drawer.jpg)).
- **Elegant:** the sticky bar slides in only after the inline button leaves, and never animates
  afterwards; the drawer opens over the page without a reload.
- **Slow:** see Lighthouse below (LCP is the hero image).

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home | 50 | 100 | 19.2 s | 430 ms | 0.005 | 6,481 KiB |
| Product page | 50 | 100 | 15.4 s | 330 ms | 0.104 | 6,683 KiB |

## Laptop (1440 × 900)
Same sections. Top nav New Arrivals / Shop All / Men / Women; the hero puts the headline and the two
pills bottom right ([laptop-home-00](laptop-home-00-first-load.jpg)). The product page is two columns
and the whole buy column is sticky while the gallery scrolls ([laptop-pdp-00](laptop-pdp-00-first-load.jpg),
[laptop-pdp-02](laptop-pdp-02.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** repeat the one reassurance that matters at every step (bar, beside the price, under the
  button, in the store). For Kheelona that is the refundable token and the delivery date: "₹499 reserves
  it, refundable until we ship" ([messaging: objection answers](../../../../brand/messaging.md#objection-answers),
  token mode only) and "Deliveries start mid-November" for new orders ([D023](../../../../decisions/D023-new-order-delivery.md)).
  Brief §9.1 (price, offer, delivery and returns next to the CTA).
- **Adopt:** a sticky bar with name, price and the one action once the inline button leaves the screen.
  [PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact).
- **Adapt:** name the specifics instead of adjectives, as Allbirds names its materials; for Kheelona
  the specific safety behaviours instead of "safe"
  ([messaging: words to stop using](../../../../brand/messaging.md#words-to-stop-using)).
- **Avoid:** a paid or pre-ticked line that appears only at checkout, and pre-ticked marketing consent.
  Brief §4.4 (checkout logic unchanged) and the consent posture at G6
  ([open questions](../../../../open-questions.md)).
- **Avoid:** a floating assistant or chat pill over the bottom of the phone screen, where the sticky
  CTA lives (brief §9.10, thumb reach).
- **Avoid:** two equal hero CTAs (brief §9.1, one primary action per screen).

**Most transferable lesson.** Allbirds repeats a single reassurance (free shipping over $100) from the
announcement bar to the cart, and puts its real delivery wait in the same bar; Kheelona can carry
"refundable until we ship" and its delivery date with the same persistence beside every CTA.
