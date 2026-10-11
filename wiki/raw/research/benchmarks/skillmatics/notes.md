---
title: "Benchmark capture: Skillmatics India (skillmatics.in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.skillmatics.in/ (home, captured 2026-10-10)"
  - "https://www.skillmatics.in/products/guess-in-10-junior-community-helpers-card-game-of-smart-questions-ages-3-6 (product page, captured 2026-10-10)"
  - "Cart drawer and GoKwik checkout opened from that page (2026-10-10; stopped at the mobile-number screen, nothing typed)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# Skillmatics India (skillmatics.in)

**Why it is here.** An Indian brand of learning games and activity kits, from the brief's starting set
(brief §6). Kids / toy group. Like Smartivity it is the "brain-development shelf" (puzzles, activity
books) that SKM wants Kheelu to join ([positioning: category](../../../../brand/positioning.md#category-and-frame-of-reference)).
The product chosen, "Guess in 10 Junior" (ages 3-6), is a game of asking questions: the nearest
shelf neighbour to "It asks. They think."

**How it was captured (2026-10-10).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent,
`en-IN`, Asia/Kolkata, Indian connection. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, 1x,
scrolled viewport chunks. The cart drawer is rendered inside a shadow root, so the "Checkout" button
was tapped by its on-screen position, as a visitor would.

| Files | What |
|---|---|
| `phone-home-00..06.jpg` | Home, phone (4,471 px) |
| `phone-product-00..08.jpg` | Product page, phone |
| `small360-*`, `laptop-*` | 360 × 640 first screens; laptop home and product |
| `phone-cart-01..03.jpg` | Product page after add → cart drawer → GoKwik checkout |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg)/[01](phone-home-01.jpg) | Promotion | Auto-rotating image banners ("FESTIVE PLAY SALE: SAVE UP TO 20%", "Exciting New Launches", "Save BIG on Birthday Return Gifts"), text baked into the images; a **sticky bottom offer strip "Add any 2 products to get FLAT 20% OFF"** | none | "Shop now" inside the image |
| [01](phone-home-01.jpg) | Route by age | "Shop By Age": 0-3, 3+, 6+, 10+ years tiles | none | tiles |
| [02](phone-home-02.jpg) | Catalogue | "Now Trending" with age tabs (All Ages, 0-3, 3+, 6+, 10+); cards with "Bestseller", an age chip ("Ages: 6 - 36 Months"), "₹449 ~~₹599~~ Save 25%", a coupon line "Buy any 2 \| Get FLAT 20% OFF \| Use Code: BYOB20" | Bestseller tag | "Add to Cart" per card |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | More catalogue | "Handpicked For You", "Recently Viewed Products" | none | Add to Cart |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Proof | "1 Crore+ Happy Families": photo carousel with parent quotes | Volume claim, quotes | none |
| [04](phone-home-04.jpg) | Content | "Blogs" carousel | none | none |
| [05](phone-home-05.jpg)–[06](phone-home-06.jpg) | SEO block | H1 at the bottom: "Best Kids Educational Toys Brand In India: Skillmatics", then long text on cognitive skills and safety ("non-toxic, environmentally friendly… materials") | Claims | "SIGN UP" (newsletter) |

**Headline formula.** No brand headline in the first screen: a promotional banner, then "Shop By Age".
The page's H1 sits at the bottom inside an SEO text block.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product-01.jpg) | Title and price | Gallery (box shows "3-6 YEARS"); "Guess in 10 Junior: Community Helpers \| Trivia Card Game (ages 3-6)"; "★ 33 reviews"; **"₹319 ~~₹374~~ Save 15%" and "MRP inclusive of all taxes"**; sticky offer strip at the bottom. No buy button in the first screen | none |
| [02](phone-product-02.jpg) | Buy box | "Earn upto 31 Play Coins on this purchase"; coupon box "Buy any 2 \| Get FLAT 20% OFF \| Use Code: BYOB20"; quantity + **"Add to Cart"**; **"Get it between: Tue, Oct 13 - Fri, Oct 16"** and "Note: In Mumbai? Order by 2 PM and get it today! Subject to stock availability."; "Get a FREE GIFT on orders above Rs. 1,499"; **"Free shipping on all orders · COD Available · 30-day returns"**; "Build Your Collection" (other editions); "More Available Offers"; "Develop Key Skills: Creative Thinking · Social & Communication · Decision Making · Problem Solving" | inline "Add to Cart" |
| [03](phone-product-03.jpg) | About + bundles | Tabs "About / Delivery & Returns"; "Planning return gifts? Enjoy special pricing! Connect Now" (WhatsApp); "Bundle & Save Up To 20%" with two bundles | sticky bar appears |
| [04](phone-product-04.jpg) | Cross-sell | "You May Also Like" cards; "Join our WhatsApp Community… Your FREE GIFT awaits!" | sticky bar |
| [05](phone-product-05.jpg) | How to play | "Exciting Game Of Questions… This game is designed such that the players need not be able to read to play the game!"; "35 Game Cards & 10 Guider Tiles · Global Bestseller" | sticky bar |
| [06](phone-product-06.jpg) | Reviews | "Customer Reviews 4.7 · 33 reviews", sort options, reviews that name the child's age ("My 3 year old recognised the police officer and firefighter immediately", "my 3 year old uses the picture tiles to ask questions all by himself") | sticky bar |

**CTA position and repetition.** First screen: price and tax line, no button. Once the inline
button scrolls away, a sticky bar **with the price inside the button** appears ("Add to cart ₹319
~~₹374~~", [03](phone-product-03.jpg) onwards). The offer strip is sticky from first paint on Home and
the product page. At 360 × 640 neither page shows a buy button in the first screen
([home](small360-home-01.jpg), [product](small360-product-01.jpg)).

## Trust devices
- "MRP inclusive of all taxes" under the price.
- Delivery window by date range, with a same-day note for one city.
- "Free shipping · COD Available · 30-day returns" as one icon row under the button.
- Reviews from parents of 3-year-olds; "1 Crore+ Happy Families"; "Global Bestseller".
- Review counts vary widely between sibling editions (33, 38 and 25,436 reviews on three versions of
  the same game, same page); a careful reader may notice.

## Offers and guarantees
- Stacked offers: % off + strike-through, a coupon code (BYOB20), loyalty coins, a free gift above
  ₹1,499, bundles up to 20%, return-gift pricing on WhatsApp.
- The guarantee is a short "30-day returns" label; details sit in the "Delivery & Returns" tab.

## Product → cart → checkout (phone, 2026-10-10)
1. "Add to Cart": the page stays; the sticky bar turns into "₹319 ~~₹374~~ · View Cart (1)" ([cart-01](phone-cart-01-after-add.jpg)).
2. "View Cart" opens a drawer ([cart-02](phone-cart-02-cart-drawer.jpg)): "Get a FREE GIFT on all
   orders above ₹1,499", a progress bar "You're ₹1180 away from a gift", the item with an add-on
   checkbox, coupon field, "View all offers: Coupons · Payment Offers (9)", "People Also Bought",
   "₹55.00 Saved so far!", "Estimated Total ₹319.00 (15% OFF)" and an orange **"Checkout"** button
   with Paytm, PhonePe and Google Pay icons, "Powered by GoKwik".
3. "Checkout" opens GoKwik ([cart-03](phone-cart-03-checkout-first-screen.jpg)): "₹55 saved so far · 1
   item · ₹319", coupon field "9 coupons available", "Login to Redeem Gift Card / Play Coins", **"Login
   to continue: +91 Enter Mobile Number"**, a pre-ticked "Send me order updates & offers - (no spam)",
   "Continue", and PCI DSS / secured payments / verified merchant badges. **Stopped here.**

Taps from product page to the first details screen: 3 (Add to Cart, View Cart, Checkout).

## India-specific patterns
- **Mobile-number-first checkout** (GoKwik) with "+91" pre-filled: the first question is the phone number, not email.
- **COD** on the product page; **UPI app icons** on the checkout button.
- **Delivery estimate by date range** and a city same-day note; no pincode field seen before checkout.
- **WhatsApp:** floating button on every page, "Connect Now" for bulk return gifts, a WhatsApp Community.
- "MRP inclusive of all taxes"; coupons and loyalty coins. No EMI seen.

## Motion on a phone
- **Neutral:** an auto-rotating image carousel on Home (first screen changed within 3 s); a floating
  WhatsApp button with a gentle "float" loop; an animated progress bar in the cart.
- **Slow:** the heaviest main thread in the group (below), and a short Home page (4,471 px) that is
  mostly product grids.

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home (run warned the page loaded too slowly to finish) | 29 | 6.6 s | 2,430 ms | 0 | 7,006 KiB |
| Product page (same warning) | 56 | 4.6 s | 400 ms | 0.003 | 6,327 KiB |

## Laptop (1440 × 900)
Mega-menu navigation; product page in two columns with price, tax line, coupon box, "Add to Cart",
delivery window, free gift and the shipping/COD/returns row all in the first screen
([laptop-product-01](laptop-product-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** "MRP inclusive of all taxes" right under the price (brief §9.1, §9.7).
- **Adopt:** the price inside the sticky button ("Add to cart ₹319") so price and action are one thing
  on a phone ([PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  issue 5; brief §9.10). For Kheelona the label and price come from one source
  ([messaging: CTA labels](../../../../brand/messaging.md#cta-labels), [pricing](../../../../product/pricing.md)).
- **Adopt:** a "Develop Key Skills" row of four named skills, matching SKM's four thinking skills
  once the advisor signs them off at age 3 (F9 in [open questions](../../../../open-questions.md)).
- **Adapt:** the delivery window as dates ("Get it between…") next to the CTA, from the confirmed ship
  date and lead time (F12; brief §9.1).
- **Adapt:** mobile-number-first, "+91" pre-filled; Kheelona's store already asks for an Indian
  WhatsApp number ([PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  issue 3: label it as such). Checkout logic stays unchanged (brief §4.4).
- **Avoid:** stacked offers (coupon + coins + gift + bundle + %): one offer, stated once
  ([positioning: price story](../../../../brand/positioning.md#price-story)).
- **Avoid:** a pre-ticked marketing opt-in (DPDP posture is G6 in [open questions](../../../../open-questions.md)).

**Most transferable lesson.** Make the price and the tax line part of the buying unit: "₹319 ~~₹374~~
Save 15% / MRP inclusive of all taxes" under the title, and a sticky "Add to cart ₹319" button, so a
parent never scrolls to find what it costs.
