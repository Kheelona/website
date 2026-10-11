---
title: "Benchmark capture: Yoto (uk.yotoplay.com, UK store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://yotoplay.com/ → redirected to https://uk.yotoplay.com/ (home, phone and laptop, captured 2026-10-11 02:04-02:08 UTC, Indian connection)"
  - "https://uk.yotoplay.com/players/yoto-player-4 (product page, Yoto Player 4th Gen, on pre-order; phone and laptop, captured 2026-10-11 02:04-02:09 UTC)"
  - "Product page → basket drawer → uk.yotoplay.com/pre-checkout → checkout.uk.yotoplay.com (phone, captured 2026-10-11 05:02-05:05 UTC, US connection; stopped at the first form)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:12 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:57-04:58 UTC, US connection"
---

# Yoto (uk.yotoplay.com, UK store)

**Why it is here.** Kids / toy group, from the brief's starting set (brief §6, Market Research): a
screen-free audio player for children. At capture time its new **Yoto Player 4th Gen was on
pre-order**, so this is the closest live example of what Kheelona is doing: selling a screen-free
children's device before it ships.

**Store reached.** No Indian store: `yotoplay.com` sent the Indian connection to the UK store, in GBP.
For the cart flow we opened the UK store directly from a US connection; the site then offered "Shop your
local site: Go to United States site / Stay on United Kingdom site", and we stayed on the UK site.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, scrolled viewport chunks, from an Indian
connection. The cart flow (missing from the first run, whose connection dropped), the 360 × 640 first
screens and Lighthouse were added from a **US connection**. Popups were closed as a visitor would
("Reject all", "Stay on United Kingdom site").

| Files | What |
|---|---|
| `phone-home-00..11.jpg` | Home, phone (7,072 px) |
| `phone-pdp-00..14.jpg` | Product page, Yoto Player 4th Gen, phone (9,758 px) |
| `laptop-home-00..10.jpg`, `laptop-pdp-00..12.jpg` | Laptop |
| `phone-flow-01..07.jpg` | Pre-order → basket drawer → checkout choice → first checkout screen and its scroll |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens (US connection) |
| `phone-home-scroll.webm` | Phone scroll of Home |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | Campaign hero | Strip "Autumn Sale: Up to 30% off \| Shop now"; header (menu, logo, search, account, wishlist, basket); photo of a child with a player; a deadline chip "Ends 9AM, Oct 12th"; H1 "Autumn savings: up to 30% off."; "Make Autumn sound even better with savings on select Yoto Players, Bundles, Accessories and Cards."; a Trustpilot badge "46.4K reviews" | Trustpilot count | "Explore the sale" + "Shop sale cards" |
| [00](phone-home-00-first-load.jpg)–[02](phone-home-02.jpg) | Licences and categories | A moving strip of character logos; sale tiles Yoto Players, Yoto Cards, Bundle & Save, Accessories | Licensed brands | tiles |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | What it is | "This is Yoto" cards: "Card in. Play begins. Pop in a Yoto Card and they're away, with stories, music, activities and even their own recordings…"; "1,000+ titles and counting"; "Built for the rhythm of family life"; "The way to waaay better bedtimes" | none | Compare Yoto players |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Range | "Find the right one for you": Yoto Mini 4th Gen £89.99 (Add to basket), Yoto Player 4th Gen £119.99 with an "Est. dispatch…" chip (**Pre-order**), Mini 2024 £51.99 (£64.99 struck), Player 3rd Gen £71.99 (£89.99 struck); feature icons each | Price | Add to basket / Pre-order / Find out more |
| [04](phone-home-04.jpg) | Awards | Award badges, including Junior Design Awards and MadeForMums Toy Awards 2024 | Awards | none |
| [05](phone-home-05.jpg)–[06](phone-home-06.jpg) | Content | "Discover a world of audio: From stories to songs, maths to meditation. For ages 0-12+" with age tick boxes (0-2, 3-5, 6-8, 9+) and Browse; Trending and Bestsellers card rows with Preview and price or credits | Content breadth | Add to basket |
| [07](phone-home-07.jpg) | Proof and guarantees | "Yoto in the wild": a Trustpilot review ("Love them", 5 stars, Verified) and "Rated 4.4 / 5 • 46,361 reviews"; then four cards: "Free shipping over £40", "Flexible payment plans: Split the cost with Klarna at checkout", "60-day free returns", "Product guarantee: Backed by a 2-year guarantee, so you can press play with confidence." | Trustpilot, guarantees | none |
| [08](phone-home-08.jpg)–[09](phone-home-09.jpg) | FAQ | "Questions? We're all ears": cards across players, Mini vs Player, the Green Button, old vs new, **"What age is Yoto for?"**, the display, "What else do I get when I buy a Yoto player?", "How can I ensure safe listening volumes for my child?", plugs | Objection FAQ | none |
| [10](phone-home-10.jpg)–[11](phone-home-11.jpg) | Footer | Help, Services, More From Us; "Privacy Policy", **"Kids Privacy Policy"** | Kids privacy | none |

**Headline formula.** A dated campaign with a deadline chip ("Autumn savings: up to 30% off.") rather
than a brand promise; the product idea ("Card in. Play begins.") comes in the second fold.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg) | Gallery and title | Gallery (first item an autoplaying muted video) with a chip **"Est. dispatch from 15 Oct"** on the image; thumbnails; "Yoto Player 4th Gen"; "£119.99"; "Meet our best Yoto Player yet." and a short description | sticky bar "£119.99 / Pre-order" from first paint |
| [02](phone-pdp-02.jpg) | Buy box | Four feature icons (stereo sound; Yoto Cards and Green Button playlists; full-panel night light; okay-to-wake light and clock); add-ons "Add on a 4th Gen Adventure Jacket for £24.99" and "Add on a Card Case for £19.99 (Full price £24.99)" with colour tiles | **"Pre-order"** (inline; the sticky bar hides here) |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Pre-order terms | A blue info box under the button: **"Est. dispatch from 15 October 2026. Pre-order now to secure the newest generation player. Payment taken today. Learn more"**; payment marks (G Pay, Shop Pay, PayPal, Visa, Mastercard, Amex); a three-part row "Free delivery over £40 · 60 day returns. Free & easy · Pay in 3 with Klarna"; "Compare the players" | none |
| [03](phone-pdp-03.jpg)–[06](phone-pdp-06.jpg) | Benefits and close-ups | Cards ("Audio kids control and parents trust", "Built for the rhythm of family life", "1,000+ titles, and counting", "The way to waaay better bedtimes"); "Take a closer look" image stack and a video with a play button | sticky bar |
| [07](phone-pdp-07.jpg) | Features | "Meet the Yoto Player": "Kids in control: … Safe, simple and one less job for you.", "Green means GO!", day and night settings, bedtime, the card library, free content, the app, record your own | Explore Yoto Cards / Try for free |
| [08](phone-pdp-08.jpg) | In the box | **"What's included?"** as image tiles: player and USB-C cable, a Welcome / Make Your Own card, a free digital card, free Yoto Daily and Yoto Radio | sticky bar |
| [08](phone-pdp-08.jpg)–[09](phone-pdp-09.jpg) | Reviews | "Tried, tested and loved": Trustpilot, "Rated 4.4 / 5 • 46,361 reviews" | sticky bar |
| [09](phone-pdp-09.jpg)–[10](phone-pdp-10.jpg) | Specs | "Technical Specifications" as an icon grid (size, speaker, weight, light, storage, WiFi, charging, Bluetooth, "Up to 16 hrs battery life", headphones, "Parental controls via Yoto App", okay-to-wake) and a "Tech Specs PDF" | sticky bar |
| [10](phone-pdp-10.jpg)–[11](phone-pdp-11.jpg) | Cross-sell | Bestsellers and Trending card rows | sticky bar |
| [12](phone-pdp-12.jpg)–[14](phone-pdp-14.jpg) | FAQ, footer | The same FAQ as Home | sticky bar to the end |

**CTA position and repetition.** One label for this product, **"Pre-order"**, in the range cards on
Home, the inline buy box and a sticky bottom bar ("£119.99 / Pre-order") that is on screen from first
paint, **hides while the inline button is visible** ([02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg)) and
returns after ([04](phone-pdp-04.jpg)). At **360 × 640** the sticky bar with price and "Pre-order" is
inside the first screen ([small360-pdp-01](small360-pdp-01.jpg)); on Home, "Explore the sale" is
([small360-home-01](small360-home-01.jpg)).

## Trust devices
- The dispatch date in four places: on the product image, under the button, in the basket drawer and on
  the checkout line item ("Est. dispatch from 15 Oct 2026").
- Payment marks and a three-part row (delivery, returns, instalments) directly under the button.
- Trustpilot rating and count in the hero and on the product page; award badges; a "Kids Privacy Policy"
  in the footer; an FAQ that includes "What age is Yoto for?" and safe listening volumes.
- "What's included?" shown as pictures of the box contents.

## Offers and guarantees
- Pre-order terms in one sentence: "Pre-order now to secure the newest generation player. Payment taken
  today." At checkout: "Your cart contains a pre-order. Available items ship first. Pre-orders follow
  later. Full payment will be taken when you place your order."
- "60-day free returns", "Backed by a 2-year guarantee", "Free shipping over £40", "Pay in 3 with Klarna".
- Sale prices are struck through on older players; the hero runs a dated sale.

## Product → cart → checkout (phone, US connection, 2026-10-11)
1. "Pre-order" (sticky bar, [flow-01](phone-flow-01-pdp.jpg)) opens an **"Added to Basket"** drawer at the
   bottom: thumbnail, "Yoto Player 4th Gen £119.99", the chip "Est. dispatch from 15 Oct 2026", and
   "View Basket (1)" + "Checkout"; above it the page swaps to a "Build your card collection" upsell row
   ([flow-02](phone-flow-02-added-to-basket.jpg)).
2. "Checkout" → an interstitial **"How would you like to Checkout?"**: "Check out faster, earn Yoto tokens
   and use your Yoto Club discount. Log in / Sign up" or **"Guest Checkout"** ([flow-03](phone-flow-03-pre-checkout-choice.jpg)).
3. "Guest Checkout" → Shopify checkout on `checkout.uk.yotoplay.com` ([flow-04](phone-flow-04-checkout-first-screen.jpg)–[07](phone-flow-07-checkout-scroll3.jpg)):
   order summary £119.99; Express checkout (Shop Pay, PayPal, G Pay); Contact (email; the newsletter box
   is not ticked); Delivery (country preset United Kingdom; name, address, city, postcode, phone, with
   "Please enter a UK phone number in case our delivery partner needs to contact you about your order.");
   shipping method after the address; Payment (card, Shop Pay "Pay in full or in installments", PayPal,
   "Pay with Klarna"); the order summary repeats the dispatch chip, the pre-order notice above, "Free
   Standard Shipping only applies to orders above £40…", and **"Total GBP £119.99, Including £20.00 in
   taxes"**; "Pay now"; links to Refund policy, Shipping, Privacy policy, Terms of service, Cancellations,
   Contact. **Stopped here.**

Taps from product page to the first details screen: 3 (Pre-order, Checkout, Guest Checkout).

## India-specific patterns
- No Indian store; an Indian visitor lands on the UK site in GBP. No UPI, COD or WhatsApp.
- Patterns that carry over: instalments named at three points (the guarantees card, the row under the
  button, checkout), the way EMI is shown on Indian sites; and a total stated as including tax, as MRP
  must be in India (brief §9.7).

## Motion on a phone
- **Continuous:** the character-logo strip scrolls on an infinite CSS loop (40 s and 28 s cycles), with
  no pause control seen (`phone-home-scroll.webm`); the page holds many swipe rows.
- **Media:** the product gallery opens on an autoplaying muted video.
- **Elegant:** the sticky bar steps aside when the inline button is on screen; the basket opens as a
  bottom drawer instead of a page; `prefers-reduced-motion` rules are present.
- **Slow:** a heavy product page, and Home shifts as it loads (Lighthouse below).

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home | 49 | 90 | 5.6 s | 270 ms | 0.309 | 3,423 KiB |
| Product page (LCP element: a gallery image) | 56 | 90 | 44.7 s | 410 ms | 0 | 14,440 KiB |

## Laptop (1440 × 900)
The nav labels each category with a "Sale" chip. The product page is two columns, and a full-width bar
with "£119.99" and "Pre-order" sits under the header from first paint ([laptop-pdp-00](laptop-pdp-00-first-load.jpg));
the dispatch box, payment marks and the three-part row sit under the inline button
([laptop-pdp-02](laptop-pdp-02.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** the pre-order disclosure set. State the dispatch date on the product image, under the
  button, in the store and on the order line, and say in one sentence what is paid today. For Kheelona:
  ₹499 today, refundable until we ship, ₹4,500 before dispatch ([pricing](../../../../product/pricing.md);
  [messaging: objection answers](../../../../brand/messaging.md#objection-answers); delivery for new
  orders from mid-November, [D023](../../../../decisions/D023-new-order-delivery.md), rendered from one content value). Brief §9.1 (delivery next to the CTA).
- **Adopt:** the sticky "price + Pre-order" bar from first paint that steps aside for the inline button.
  [PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact).
- **Adopt:** a three-part row under the button (delivery, returns, how you can pay), only with what we
  offer: 7-day returns ([D021](../../../../decisions/D021-returns-policy.md)), and UPI, the only proven method today (F6;
  [policies](../../../../product/policies.md#payment-methods)).
- **Adopt:** "What's included?" as pictures of the box contents, once F4 confirms them
  ([facts](../../../../product/facts.md)).
- **Adapt:** Trustpilot-style rating and count in the hero only when real reviews exist (brief §4.2).
- **Avoid:** a dated sale with a deadline chip as the hero; Kheelona never publishes the paid count
  behind its 500-unit offer ([pricing](../../../../product/pricing.md)), and its claims never use fear
  ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails)).
- **Avoid:** an endless logo marquee (brief §9.11: anything that moves for more than five seconds can be
  paused) and a log-in interstitial before checkout (brief §9.1, fewest taps).

**Most transferable lesson.** Yoto sells a pre-order honestly at every step: the dispatch date sits on
the product image, under the button with "Payment taken today", in the basket and on the checkout line,
so the parent never has to wonder when it ships or what they are paying now; Kheelona's ₹499 token
needs exactly this.
