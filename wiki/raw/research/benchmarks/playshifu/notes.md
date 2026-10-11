---
title: "Benchmark capture: PlayShifu (playshifu.com, India)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.playshifu.com/ → ?country=IN (home, captured 2026-10-10)"
  - "https://www.playshifu.com/product/orboot-earth-globe-toy (hero product, out of stock: 'NOTIFY ME', captured 2026-10-10)"
  - "https://www.playshifu.com/product/plugo-animals-toy (in-stock product, captured 2026-10-10)"
  - "https://www.playshifu.com/checkout?country=IN (first checkout screen, 2026-10-10; nothing typed)"
  - "https://www.playshifu.com/sitemap.xml (product URLs, fetched 2026-10-10)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# PlayShifu (playshifu.com, India)

**Why it is here.** An Indian-founded maker of "phygital" learning toys (physical pieces plus a
tablet app), from the brief's starting set (brief §6). Kids / ed-tech group, Bengaluru address in the
footer. Its toys use a screen, so it sits on the "learning apps" side of SKM's category map
([positioning: category](../../../../brand/positioning.md#category-and-frame-of-reference)).

**How it was captured (2026-10-10).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent,
`en-IN`, Asia/Kolkata, Indian connection (the site added `?country=IN`). Phone 390 × 844 and
360 × 640, laptop 1440 × 900, 1x, scrolled viewport chunks. The flagship globe (Orboot Earth) was out
of stock, so an in-stock product (Plugo Animals) was captured as well, and used for the cart.

| Files | What |
|---|---|
| `phone-home-00..11.jpg` | Home, phone (8,984 px) |
| `phone-product-00..10.jpg` | Orboot Earth (out of stock), phone |
| `phone-product2-00..10.jpg` | Plugo Animals (in stock), phone (7,865 px) |
| `small360-*`, `laptop-*` | 360 × 640 first screens; laptop home and both products |
| `phone-cart-01..02.jpg` | Cart drawer → first checkout screen |

**Capture caveat.** On Home, most sections below the bundles stayed grey skeleton placeholders in
headless Chrome even after 20 s of slow scrolling (44 pulsing placeholders still on the page;
[phone-home-06](phone-home-06.jpg) to [10](phone-home-10.jpg)), and some product images were blank.
This may be an artefact of the headless browser; check on a real phone before drawing a conclusion
about the live site.

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg) | Capture lead | On landing, a modal: "A Little Gift From Us: 5% Off! Sign in now and save extra 5% on your first order. Yes, Let's Save! / Maybe later, I'm just exploring", plus a cookie bar "Reject All / Accept All" | none | "Yes, Let's Save!" |
| [01](phone-home-01.jpg) | Hero | Fixed yellow header with logo, country flag, account, cart **and a search field**; an auto-rotating image carousel ("New Launch: Meet Peppa Pig! … Shop Now" baked into the image) | none | image banner |
| [01](phone-home-01.jpg) | Route by age | "Shop By Age: 4-6 / 6-8 / 8-10 / 10+ Years" tiles | none | tiles |
| [02](phone-home-02.jpg) | Offer | "Buy More, Save More": bundle cards, each with rating and review count ("4.6 · 50 reviews"), "-20% ₹5118 ~~₹6397~~", "FREE GIFT worth up to ₹1000 with every order." | Ratings | "ADD TO CART" (outline) per card |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | UGC | "PlayShifu In The Wild: Check out our toys in action!" video row (not autoplaying) | Customer videos | none |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Why us | "The PlayShifu Advantage": AR + Phygital, Early Years Development ("children aged 2-12"), Designed by Experts, STEM Based, Parental Support & Moderation, Meaningful Screen Time | Claims only | none |
| [06](phone-home-06.jpg)–[07](phone-home-07.jpg) | Skills | "Super Skills": Collaboration, Creativity, Critical Thinking, Decision-Making, Emotional Intelligence, Fine Motor Skills | none | none |
| [11](phone-home-11.jpg) | Footer | Bengaluru address, phone, email, "Join our WhatsApp Community" | Address | WhatsApp |

**Headline formula.** No brand promise in the first screen: the hero is a promotional carousel and the
first headline is "Shop By Age". The site works as a catalogue.

## Product page (phone): fold map (Plugo Animals; Orboot Earth has the same layout)

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product2-01.jpg) | Title and gallery | Breadcrumb; "Plugo Animals \| Educational Animal Toy Set \| Ages 4+"; "4.6 · 30 reviews \| 79 people viewing right now"; gallery with a video thumbnail; six benefit bullets. **No price and no CTA in the first screen** | none (a floating "Chat with us" WhatsApp button) |
| [02](phone-product2-02.jpg) | Buy box | "-10% ₹3059 ~~₹3399~~"; quantity; "ADD TO CART" (purple) + "BUY NOW" (yellow); "Additional offers": "FREE GIFT worth up to ₹1000 with every order. No strings attached.", "Buy 2 toys get extra 8% off! \| Buy 2+ toys get extra 15% off!"; **"Shop with confidence": Free Delivery, Get in 4-5 Days · 6 Months Warranty · 30 Day Return (View Policy) · Cash on Delivery Available**; "Devices shown in images/videos are not included with the toy." | inline pair |
| [03](phone-product2-03.jpg) | Proof | "PlayShifu In The Wild" UGC videos; YouTube demo | sticky bar appears |
| [04](phone-product2-04.jpg)–[06](phone-product2-06.jpg) | Outcomes | "Super Skills: Your kid will unlock while playing" (General Knowledge, Language & Vocabulary…); "Free In-App Games: download the complimentary Plugo App"; "The PlayShifu Advantage" | sticky bar |
| [07](phone-product2-07.jpg) | Reviews | "Love From Parents ❤️ 4.6 out of 5, Based on 30 reviews" with the full 5-to-1-star histogram (23, 4, 1, 1, 1) and written reviews, including a mixed one ("the program lags sometimes") | sticky bar |
| [08](phone-product2-08.jpg) | FAQ | "Does Plugo Animals require a continuous internet connection to play?", "Are there in-app purchases or subscription fees?", "Will it work with my existing Plugo gamepad?" | sticky bar |
| [08](phone-product2-08.jpg)–[10](phone-product2-10.jpg) | Cross-sell, footer | "Parents also bought" | sticky bar |

**CTA position and repetition.** The buy box sits on the second phone screen. A sticky bottom bar
(quantity + "ADD TO CART") appears only after the inline button scrolls away, from
[03](phone-product2-03.jpg) on. **The floating "Chat with us" button sits on top of that sticky "ADD TO
CART" and hides most of its label** ([03](phone-product2-03.jpg)–[08](phone-product2-08.jpg)). At
360 × 640 neither price nor CTA is in the first screen ([small360-product2-01](small360-product2-01.jpg)).

## Trust devices
- Ratings with counts on every card and at the top of the product page; a full histogram with low
  ratings shown.
- "Shop with confidence" icon grid beside the buy box: delivery time, warranty, returns, COD.
- A disclaimer that the tablet in the photos is not included, plus a "Device Compatibility" panel.
- A live-viewer counter, "N people viewing right now": the number changed on every load, minutes
  apart on 2026-10-10 (Orboot Earth: 100 in [phone-product-01](phone-product-01.jpg), 82 in
  [small360-product-01](small360-product-01.jpg); Plugo Animals: 79 in
  [phone-product2-01](phone-product2-01.jpg), 92 in [small360-product2-01](small360-product2-01.jpg)).

## Offers and guarantees
- Percentage off plus strike-through on every price; "SuperSaver" bundle badges.
- A free gift "worth up to ₹1000 with every order. No strings attached." on cards, product page and
  cart (where the gift is chosen: [cart-01](phone-cart-01-after-add.jpg)).
- Volume discount ladder (8% for 2, 15% for more); a 5% sign-in offer in the landing modal.

## Product → cart → checkout (phone, 2026-10-10)
1. "ADD TO CART" opens a right-hand cart drawer ([cart-01](phone-cart-01-after-add.jpg)): item,
   "Select a free gift of your choice" (a ₹999 game shown as "Free"), "View All Offers", and a purple
   bottom bar "To Pay (Inc. of all taxes) ~~₹3399~~ ₹3059 · Proceed to Checkout →". The floating "Chat
   with us" button overlaps "Proceed to Checkout".
2. "Proceed to Checkout" opens PlayShifu's own one-page checkout ([cart-02](phone-cart-02-checkout-first-screen.jpg)):
   Order Items, Contact Information (Email, Country Code "+91", Phone Number), Delivery Address (Name,
   Address, Landmark, Country, Zipcode, City, State), then Payment: "Online Payment (UPI, Card,
   Wallets, NetBanking)… you will be redirected" or "Cash On Delivery (COD)", and an Order Summary
   with "Delivery FREE" and "* Order updates will be sent via WhatsApp." **Stopped here.**

Taps from product page to the first details screen: 2.

## India-specific patterns
- **COD** offered on the product page and in checkout; **UPI, cards, wallets, net banking** named in checkout (Razorpay).
- Delivery promise "Get in 4-5 Days" (no pincode check); "Free Delivery".
- **WhatsApp:** floating "Chat with us" (AiSensy) on every page, a "WhatsApp Community", and order
  updates by WhatsApp. No EMI seen.
- Price "Inc. of all taxes" in the cart bar.

## Motion on a phone
- **Gimmicky:** a sign-in discount modal on landing; a live-viewer counter.
- **Slow:** skeleton placeholders pulsing for a long time (see the capture caveat).
- **Neutral:** the hero image carousel auto-rotates (the first screen changed within 3 s); UGC videos wait for a tap.

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home | 58 | 6.2 s | 120 ms | 0.13 | 2,050 KiB |
| Product page (Plugo Animals) | 51 | 11.7 s | 110 ms | 0.131 | 3,268 KiB |

## Laptop (1440 × 900)
Search bar in the header; a wide promotional hero "Play More, Pay Less… Place your first order today!
SHOP NOW" ([laptop-home-01](laptop-home-01.jpg)). Product page in two columns with the buy box,
offers and "Shop with confidence" on the right, so price and CTA are in the first screen
([laptop-product2-01](laptop-product2-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** an objection FAQ beside the product that answers internet and subscription questions
  directly ("Does it need a continuous internet connection?", "Are there subscription fees?"). Tied to
  brief §9.1 (FAQ near the CTA) and to the open Kheelona+ terms (F7 in [open questions](../../../../open-questions.md)).
- **Adopt:** say what is in the box and what is not ("Devices shown… are not included"). Brief §9.7.
- **Adopt:** a confidence grid next to the buy box (delivery time, warranty, returns, payment
  methods), filled only with confirmed facts ([policies](../../../../product/policies.md); F1, F6).
- **Avoid:** a floating chat button that covers the primary CTA or the checkout button (brief §9.1
  "one primary action per screen"; [PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) issue 5).
- **Avoid:** a randomised "people viewing right now" counter (brief §4.2 and §9.8: no fabricated social proof).
- **Avoid:** a product page whose first phone screen has no price and no CTA (brief §9.10).

**Most transferable lesson.** Put the reassurance next to the buy button: PlayShifu's "Shop with
confidence" grid (delivery days, warranty, 30-day return, COD) and its "Inc. of all taxes" cart bar
answer the Indian buyer's checklist at the point of decision; but its floating chat button hiding the
sticky "ADD TO CART" shows what to avoid.
