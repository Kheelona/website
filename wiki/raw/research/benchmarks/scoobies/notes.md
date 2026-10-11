---
title: "Benchmark capture: Scoobies and Pookie (scoobies.co.in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://scoobies.co.in/ (home, captured 2026-10-10)"
  - "https://scoobies.co.in/pages/pookie (Pookie story page, the URL SKM's positioning cites; captured 2026-10-10)"
  - "https://scoobies.co.in/products/scoobies-pookie (Pookie Shopify product page, linked from the Home card; captured 2026-10-10, re-run with the store's own India and INR cookies)"
  - "Shopify checkout reached from both pages (captured 2026-10-10; stopped at the first form)"
  - "https://scoobies.co.in/policies/shipping-policy and https://scoobies.co.in/policies/refund-policy (GET, 2026-10-10)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10 (home and /pages/pookie only)"
---

# Scoobies and Pookie (scoobies.co.in)

**Why it is here.** SKM's positioning names **Pookie (Scoobies)** as an AI companion competitor, "a
friend-like companion that understands moods" ([positioning: competitors named](../../../../brand/positioning.md#competitors-named)).
Scoobies is an Indian kids' stationery, bags and toys brand; Pookie and its screen-enabled sibling
Kiki sit under a "Scoobies AI" menu. This folder is the Pookie benchmark: there is no separate Pookie
site. Everything below is INTERNAL competitor intelligence ([content boundary](../../../../site/content-boundary.md));
competitors are never named in public copy.

**Pookie is a plush rabbit.** A grey and white plush bunny holding a round lilac speaker disc; the
page says the AI module "fits effortlessly inside plush toys" ([product-05](phone-product-05.jpg)).
So the soft-rabbit form is not unique to Kheelu at this price.

**How it was captured (2026-10-10, machine time; 2026-10-11 02:20 to 03:09 UTC, re-run 04:53 to
04:59 UTC).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent, `en-IN`, Asia/Kolkata.
Phone 390 × 844 and 360 × 640, laptop 1440 × 900, all at 1x, as scrolled viewport chunks. Text and
positions were read from the live DOM at each chunk. On the re-run Shopify geolocated the capture
machine to the US (cookie `localization=US`) and the store's currency app (Doubly) showed prices in
USD, so those captures were discarded and repeated with the store's own cookies set to India and
INR (`localization=IN`, Doubly currency `INR`). The first run showed INR without this. Nothing was
typed anywhere.

| Files | What |
|---|---|
| `phone-home-00..08.jpg` | Home, phone (6,144 px) |
| `phone-product-00..11.jpg` | `/pages/pookie`, phone (8,514 px) |
| `phone-product2-00..08.jpg` | `/products/scoobies-pookie`, phone (6,524 px; re-run, INR) |
| `small360-{home,product,product2}-*.jpg` | First screen at 360 × 640 |
| `laptop-home-00..07.jpg`, `laptop-product-00..07.jpg`, `laptop-product2-00..05.jpg` | Laptop |
| `phone-cart-01..03.jpg` | "BUY NOW" on `/pages/pookie` → Shopify checkout |
| `phone-cart2-01..04.jpg` | "Add to cart" on the product page → added popup → "Check out" → Shopify checkout |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg), [01](phone-home-01.jpg) | Promotion | Header (menu, logo, search, cart, an India flag "INR" currency picker). A five-slide auto-rotating banner carousel with prev, next and **pause** controls; all text is in the images ("Perfect Return Gifts", "Bing-a-fetti Balls", and slide 5 "Meet Kiki & Pookie / Your Ai Playmates / SHOP NOW" with four round badges "Interactive Play · Real-time Responses · Kids-Safe AI Technology · Educational Companion") | none | Image banner |
| [01](phone-home-01.jpg)–[02](phone-home-02.jpg) | Route by category | Round category tiles ("For the Tiny Hands", "Creative Art & Craft", "Feel & Play Sensory Toys"…); two image tiles "Sensory Toys a fun feel explosion!" and "Best Sellers Scoobies' hottest hits!" | none | "SHOP NOW" in the images |
| [02](phone-home-02.jpg)–[04](phone-home-04.jpg) | Catalogue | Tabs "New Arrivals · Best Sellers · Trending"; two-up cards with a "New Arrival" or "-63% OFF" ribbon, stars with a count, struck and sale price, and an outline "Add to cart". Kiki "~~₹12,999.00 INR~~ ₹8,999.00 INR" (15); Pookie "~~₹8,999.00 INR~~ ₹6,999.00 INR" (15); then "Moving Fast" | Star ratings with counts | "Add to cart" per card |
| [04](phone-home-04.jpg)–[05](phone-home-05.jpg) | Social and retail | "Follow Scoobies on Instagram!" grid; a store photo "Welcome to the world of Scoobies! Locate a Scoobies Store" | Physical stores | "Locate a Scoobies Store" |
| [05](phone-home-05.jpg)–[08](phone-home-08.jpg) | Footer | "Best in Scoobies", "Company Info" (Our Story, In Media, Flagship Stores, Become a Franchise…), "Stay Connected" (Blogs, Celebrity Love…), "Quick Info" (Track Your Order, Exchange Policy, Shipping & Delivery), newsletter; "Payment methods" shows a single PayPal icon | none | newsletter |

**Headline formula.** None: Home has no headline text, only banner images. Pookie appears on Home as
one slide of five and as one card among eight. No sticky element on Home; the header scrolls away.

## Pookie story page `/pages/pookie` (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-product-00-landed.jpg)/[01](phone-product-01.jpg) | Introduce | Cut-out photo of the plush; "I'm Pookie"; "Pookie brings play and learning together through interactive conversations, storytelling, and fun facts… travel-friendly"; "With a protective guardrail and a completely non-screen experience… Its emotionally smart AI which understand moods and responds like a real friend". **No price and no button in the first screen** | none |
| [02](phone-product-02.jpg) | Buy | "~~₹ 8,999~~ ₹ 6,999"; a purple **"BUY NOW"** (the only buy control on the page); a YouTube embed "Pookie by Scoobies AI" (click to play); "Artificial Intelligence and Privacy": "ScoobiesAI ensures every chat is safe, private…", links to its Terms and Privacy Policy | inline "BUY NOW" |
| [03](phone-product-03.jpg)–[04](phone-product-04.jpg) | Reassure | Three icon blocks: "Family-Friendly Screen-Light Play" ("keeping screen time low"), "Controlled by You" (limits, monitoring, "a secure app dashboard"), "Privacy You Can Trust" ("Conversations are encrypted… designed with Meta-powered child safety standards") | none |
| [04](phone-product-04.jpg)–[05](phone-product-05.jpg) | Form factor | "Made to move with your child's imagination": "Durable, lightweight, and perfectly kid-safe, ATMA fits effortlessly inside plush toys… in just three steps"; the parent app | none |
| [05](phone-product-05.jpg)–[06](phone-product-06.jpg) | Features | "Pookie Understands Your Child": "Safe & Smart AI: Built with Meta's child-safety guardrails…", "Playful Learning", "Emotion-Aware Companion: It listens, understands feelings, and responds with warmth, empathy, and cheerful energy", "Parent-Friendly Controls: …monitor chats, manage screen time" | none |
| [06](phone-product-06.jpg)–[08](phone-product-08.jpg) | FAQ | Age: "Perfect for kids and adults from 3 years and onwards"; internet: "Yes… a stable internet connection and can connect with a mobile hotspot"; privacy: "encrypted with banking-grade algorithms"; parental controls: "Parents can view and read chats and transcripts"; battery: "4-6 hours on a full charge" | "Learn More →" (black) |
| [08](phone-product-08.jpg)–[11](phone-product-11.jpg) | Footer | Same footer as Home | none |

No reviews, no rating, no delivery time, no returns or exchange terms, no warranty and no payment
options on this page. It calls the experience both "completely non-screen" and "Screen-Light".

## Pookie product page `/products/scoobies-pookie` (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product2-01.jpg) | Gallery and title | Photo gallery with thumbnails (an infographic "Meet Pookie", a video, more); a long keyword title "Scoobies Pookie AI Learning Companion, Screen-Free Smart Toy with Interactive Stories", then "\|Conversations & Fun Facts, Emotion-Aware AI with Parental Controls, Safe & Portable for Kids"; the price line starts at the bottom edge | none |
| [02](phone-product2-02.jpg) | Buy box | "~~₹ 8,999.00 INR~~ ₹ 6,999.00 INR" with "-22% OFF"; "You Save (₹ 2,000.00 INR )"; "Tax Included."; stars "(15)"; **"Add to cart" (outline) + "Buy it now" (purple)**; quantity; accordions Synopsis, Product Description, Material ("Plush Toy + ABS Plastic"), **Shipping & Exchange** ("Delivery in 2-7 business days"; "We only offer exchanges; no returns or refunds are available"), Dimensions ("39x31.5x17.5cm"), Care Instructions | inline pair |
| [03](phone-product2-03.jpg) | Cross-sell | "You may also like": Kiki, a travel kit, magnetic tiles | none |
| [04](phone-product2-04.jpg)–[05](phone-product2-05.jpg) | Reviews | "15 Reviews", "Write a review"; two-up review cards, each a first name and initial, "Verified", a date (23/3/2026 to 25/5/2026), four or five stars and one or two sentences ("Lightweight, portable, and perfect for keeping kids entertained while traveling.") | none |
| [06](phone-product2-06.jpg)–[08](phone-product2-08.jpg) | Footer | Same footer | none |

**CTA position and repetition.** Story page: one "BUY NOW", on the second screen, never repeated, no
sticky bar. Product page: one inline pair, on the second screen, no sticky bar. At **360 × 640**
neither page shows a price or a buy control in the first screen
([small360-product-01](small360-product-01.jpg), [small360-product2-01](small360-product2-01.jpg)).
Home's first 360 × 640 screen is a product banner for squishy balls ([small360-home-01](small360-home-01.jpg)).

## Trust devices
- Review stars with counts on Home cards; 15 "Verified" reviews on the Shopify product page only, below
  the cross-sell, two screens below the button.
- Physical retail: "Flagship Stores", "Locate a Scoobies Store" with a store photo, "Store Locator".
- Footer links "In Media" and "Celebrity Love" (not opened).
- Privacy claims in brand terms ("Meta-powered child safety standards", "banking-grade algorithms")
  and a plain one ("Parents can view and read chats and transcripts").
- None at the point of decision on the story page.

## Offers and guarantees
- Strike-through price, "-22% OFF" and "You Save (₹ 2,000.00 INR )" on the product page; "Tax
  Included." under it.
- **Exchange only:** "We offer only exchange. There is no return or refund." Missing items within
  24 hours, other exchanges within 7 days, with an unboxing video required for missing items; sale
  items are not eligible (refund policy, GET 2026-10-10; repeated in the product page accordion).
- Shipping policy (GET 2026-10-10): delivery charge "varies with each product"; "Please enter your
  pincode on the product page… to know whether the product can be delivered to your location", and
  the same for COD. **No pincode field was found** on either Pookie page in this capture.

## Product → cart → checkout (phone, 2026-10-10)
1. **Story page:** "BUY NOW" goes straight to Shopify checkout, no cart
   ([cart-01](phone-cart-01-after-add.jpg), [cart-02](phone-cart-02-after-add-scroll1.jpg),
   [cart-03](phone-cart-03-after-add-scroll2.jpg)). **1 tap.**
2. **Product page:** "Add to cart" opens an "Item added to your cart" panel under the header with
   "View my cart (1)", a black "Check out" and "Continue shopping" ([cart2-01](phone-cart2-01-after-add.jpg));
   "Check out" opens the same checkout ([cart2-02](phone-cart2-02-checkout-first-screen.jpg)).
   **2 taps.**
3. The checkout's first screen: "Order summary ₹6,999.00"; Contact: Email with **"Email me with news
   and offers" ticked by default**; Delivery: Country India, first and last name, address, apartment,
   city, state, PIN code, phone; "Save this information", "Text me with news and offers"; "Shipping
   method: Enter your shipping address to view available shipping methods."; Payment: **"Cards, UPI,
   NB, Wallets, BNPL, EMI by PayU India"** with card and RuPay logos and "+10", a note under it
   "Choose this option ONLY if you have selected 'Prepaid' in Shipping Method", then **"Cash on
   Delivery"**; billing address; "Add discount"; "Total ₹6,999.00"; "Pay now". **Stopped here.**

## India-specific patterns
- **COD** and **UPI, net banking, wallets, BNPL and EMI** (PayU) are both offered, but only inside
  checkout, and the COD choice depends on a "Prepaid" shipping method the buyer has not seen yet.
- **Email first**, not mobile first (standard Shopify checkout); PIN code in the address form.
- **Pincode delivery check** promised by the shipping policy but not present on the product pages.
- **No WhatsApp** button or link on Home or either Pookie page.
- Delivery "2-7 business days" only inside an accordion; "Tax Included." on the product page.
- A currency picker listing 160+ currencies (including Bitcoin); prices follow the visitor's
  geolocation, so a parent abroad (or behind a VPN) sees USD on an Indian store.

## Motion on a phone
- **Calm, and the one moving element can be paused:** the Home carousel rotates on its own (the
  first screen changed within 3 s) but shows a pause button. Apart from it nothing moves: no running
  CSS animations and no animation library on Home or either Pookie page; the story page's video is a
  click-to-play YouTube embed.
- **Plain rather than elegant:** the story page is a long static read with one button.
- **Unstable:** the story page shifts as it loads (CLS 0.258 below).

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home | 65 | 4.3 s | 420 ms | 0.003 | 5,489 KiB |
| `/pages/pookie` | 42 | 7.3 s | 460 ms | 0.258 | 5,643 KiB |

The Shopify product page was not measured.

## Laptop (1440 × 900)
Two-row navigation with "Scoobies AI" as a menu item ([laptop-home-00](laptop-home-00-landed.jpg),
which landed on the "Meet Kiki & Pookie" slide). The story page puts the price and "BUY NOW" in the
first screen beside the photo ([laptop-product-00](laptop-product-00-landed.jpg)); the product page
is two columns with a vertical thumbnail strip, price, stars and the button pair in the first screen
([laptop-product2-01](laptop-product2-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** one product page that carries the story, the proof and the terms together. Scoobies splits
  them: the story page has no reviews, delivery or returns, and the reviews and terms live on a second
  page. Tied to [PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  issue 6 (the product page sends three times more visitors to the store) and brief §9.1.
- **Adopt:** a pause control on anything that moves on its own (brief §9.11).
- **Adapt:** the FAQ answers the plain questions a parent asks of an AI plush (internet needed? battery?
  can I read the chats?). Kheelona's answers come only from [facts](../../../../product/facts.md) and
  [claims](../../../../product/claims.md); battery runtime is unconfirmed (F4 in
  [open questions](../../../../open-questions.md)).
- **Avoid:** "responds like a real friend" and "Emotion-Aware Companion". The foundation is "a toy, not
  a friend" ([positioning: pillars](../../../../brand/positioning.md#pillars-and-foundation);
  [messaging: against the alternatives](../../../../brand/messaging.md#against-the-alternatives)), and
  mood reading is unconfirmed for Kheelu (F8).
- **Avoid:** payment options, delivery time and the returns position hidden until checkout or inside
  an accordion. Brief §9.1 puts them next to the CTA; Kheelona's refund-before-dispatch is its
  strongest term ([policies: status at a glance](../../../../product/policies.md#status-at-a-glance)).
- **Avoid:** a pre-ticked marketing opt-in at checkout (Kheelona's consent tick is not pre-ticked,
  same page).
- **Avoid:** prices that follow geolocation into a foreign currency. PostHog audit issue 9: 29% of
  non-paid sessions are outside India.
- **Positioning note:** Pookie is also a soft rabbit, sold at ₹6,999 as a friend. The rabbit is not the
  difference; "It asks. They think." is ([positioning: in one line](../../../../brand/positioning.md#in-one-line)).

**Most transferable lesson.** Do not split the story from the buy box: the Pookie page SKM cites tells
the story with one "BUY NOW" and no proof, while the reviews, "Tax Included.", the delivery time and
the exchange-only terms sit on a separate Shopify page, so a parent landing from an ad sees none of
them before paying.
