---
title: "Benchmark capture: Lenskart (lenskart.com)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.lenskart.com/ (home; captured 2026-10-11 02:22 UTC phone, 02:23 UTC laptop)"
  - "https://www.lenskart.com/lenskart-air-la-e13033-c1-eyeglasses.html (product page, Lenskart Air POP; captured 2026-10-11 02:25 UTC laptop, 02:27 UTC phone)"
  - "Lens step, cart and login sheet opened from that page (2026-10-11 03:08 UTC; stopped at the phone-number screen, nothing typed)"
  - "Lighthouse 13.4.1, 2026-10-11 04:53 and 04:58 UTC: not usable, the Indian site redirected to /en-us (see Motion)"
---

# Lenskart (lenskart.com)

**Why it is here.** India's largest D2C eyewear brand, from the brief's starting set (brief §6).
Indian D2C group. Relevant because eyewear is a considered purchase that a buyer cannot touch
online, which Lenskart answers with try-before-you-buy tools and assisted routes (home, store).

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844, laptop 1440 × 900, 1x, scrolled viewport chunks; copy from the live
DOM text. At capture time (02:22-03:08 UTC) the site served its Indian version (₹ prices, final URL
`lenskart.com/`). From 04:52 UTC the connection was US-based (Cloudflare trace `loc=US`) and
lenskart.com answered every request with a 302 to `/en-us/`, so **no 360 × 640 or slower re-capture
was possible** and the Lighthouse runs measured the US site.

| Files | What |
|---|---|
| `phone-home-01..03.jpg` | Home, phone: a short, app-like page (2,322 px, 3 screens) |
| `phone-pdp-01.jpg`, `-01b`, `-02..06` | Product page, phone (4,544 px at first; it grew and shrank as blocks lazy-loaded, and some screens show blank gaps) |
| `laptop-home-01..13.jpg`, `laptop-pdp-01`, `-01b`, `-02..04` | Laptop |
| `phone-flow-01..04.jpg` | Product page → lens step → cart → login sheet |

`*-01` is the first screen as landed: a "We value your privacy" consent card (powered by GoTrust)
offers "Allow Selection" and "Allow all" and no reject; it was hidden, not answered, for `*-01b`.

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [01](phone-home-01.jpg) | App push and promotions | Strip "4.5★ Rating \| 50M+ Downloads [Open in App]"; header with a "GET GOLD" membership badge; search with a rotating placeholder ("premium bestsellers", "night driving glasses"); a livestream banner ("Sounds of Shunya … Watch Live 11th OCT \| 7 - 8PM"); "Become a Hustlr Club Member / Your welcome gift? A FREE pair of Hustlr! / Claim Now" | App rating and downloads | "Claim Now", "Learn More" |
| [01](phone-home-01.jpg) | Route by need | "Eyeglasses with Power": Men, Women, Kids, On Sale ("Starts @₹800"); "Sunglasses" ("Starts @₹500") | none | tiles |
| [02](phone-home-02.jpg) | More routes | Contact lens tiles; a "RUN FOR FRAME / complete step goals & get a free frame" banner; "#Trending at Lenskart" (sub-brands); "Lenskart Specials" | none | "Shop Now" |
| [03](phone-home-03.jpg) | SEO and help | "Buy Eyewear from Lenskart" accordion; "Can we Help? Chat With Us"; social links | none | Chat With Us |

Fixed: a **bottom bar of services, not products: Home, Stores, AR Try on, Eye Test, Orders,
Assistant**. A side drawer (in the DOM, closed) carries "Talk to us" and a phone number.

**Headline formula.** None on the phone home: it is a launcher (search, offers, category tiles). The
laptop home is editorial instead: a campaign film, "We See You", "The frames made for every version
of you - the meeting, the wedding, the 11pm walk to the shop.", then "Come See Us." with the
services "Free Eye Test · Try at home · Free Repair · Buy Online, Pick Anytime"
([laptop-home-01](laptop-home-01.jpg); the film area was black in our capture).

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01b](phone-pdp-01b.jpg) | Buy box, top | Gallery with "4.8 ★ (14291)"; three try tools as buttons, **"Photos · 360 view · AR Try On"**; "Lenskart Air POP / Black Full Rim Square"; "₹1500 with Free BLU lenses / ~~₹2000~~ (25% OFF)"; "Nearby Stores", "Similar" | **Sticky bottom bar from first paint: "Buy at Home" and "Buy at Store" (small icon links) + "Select Lenses" (filled)** |
| 01b–[02](phone-pdp-02.jpg) | Choose and check | From the DOM (the screenshot shows a blank gap here): "Use code SINGLE for this price", frame colour, **"Few Left"**, frame size S/M/L with "Not sure about your size? Do face scan for perfect size [Scan Face]", **"Delivery Details: Enter pincode [Check] / Express delivery might be applicable"** | sticky bar |
| [02](phone-pdp-02.jpg) | Guarantees | **"We Assure you": "Easy 14 day Exchange", "365 days Warranty"**, each with "Learn More" | sticky bar |
| 02–[03](phone-pdp-03.jpg) | How it works, proof | "How to Buy Your Glasses" (five "Learn More" cards); "Get Inspired with looks"; "Rating & Reviews 4.8 / 14291 Reviews", 86% five-star, dated reviews; "Product Details" (+21 more) | sticky bar |
| [04](phone-pdp-04.jpg)–[06](phone-pdp-06.jpg) | Try again, browse | "Try and Explore this Frame": 360 VIEW and AR TRY ON tiles; "Shop by Looks"; "Similar Products"; "Explore More" links; footer "Can we Help? Chat With Us" | sticky bar |

**CTA position and repetition.** One filled button, "Select Lenses", on every phone screen, with
two assisted routes beside it. On laptop the same three trust items sit as an icon row directly
above the button: **"14 DAYS EXCHANGE · EASY RETURNS · 365 DAYS WARRANTY"**, then "SELECT LENSES"
([laptop-pdp-01b](laptop-pdp-01b.jpg)); details are accordions ("Delivery & Services", "Product
Details", "Rating & Reviews 4.8", "FAQ's", [laptop-pdp-02](laptop-pdp-02.jpg)). The DOM also holds
an assistant ("Need the perfect lenses? Ask B", in English and Hindi) with question chips: "Can I
add power lenses?", "Will this suit me?", "Buy 1 get 1 offer?", "Is it good for daily use?"
(their screen position was not captured).

## Trust devices
- Try-before-you-buy tools in the first screen (Photos, 360 view, AR Try On, face scan for size).
- Exchange, returns and warranty as short, numbered promises ("Easy 14 day Exchange", "365 days
  Warranty"), each linked to its terms.
- Rating count in the first screen (14,291); store network ("Nearby Stores", "Buy at Store").
- Footer: "Grievance Redressal", "Card EMI", "Co-browsing" (laptop).

## Offers and guarantees
- Strike-through price with a percentage; a code shown as the reason for the price ("Use code SINGLE
  for this price"); "with Free BLU lenses" as included value.
- Scarcity ("Few Left") and, in the cart, a **checkout timer** for a free gift ("Free gift for you!
  59:33 min left to checkout").
- Membership upsells everywhere (GOLD, Hustlr Club).

## Product → cart → checkout (phone)
1. **Select Lenses** → "Add Lens Details", step 1 of 3 (Power Type, Lenses, Add Power): "With Power
   (Most common)", "Zero Power", "Reading Power", "Progressive/Bifocals", "Frame Only"
   ([flow-02](phone-flow-02-after-add.jpg)).
2. **Frame Only** → "Cart (2 Items)" ([flow-03](phone-flow-03-step.jpg)): a free ₹100 LK Cash+ gift
   added automatically with the timer above; "Flat ₹500 OFF / COUPON : SINGLE" pre-applied; "Get
   ₹2000 Gift Voucher for ₹150"; "Become GOLD Max Member"; "Bill Details: You are saving ₹500 on this
   order / ₹1500 Total bill"; **"Login to proceed"**.
3. **Login to proceed** → sheet ([flow-04](phone-flow-04-checkout-first-screen.jpg)): "Login or signup to
   get started / Enter 10-digit phone number / Get OTP / OR USE **Whatsapp** · Email". **Stopped.**

Taps from product page to the first details screen: **3** for a frame only; a prescription adds the
lens and power steps.

## India-specific patterns
- **Pincode delivery check** in the buy box ("Express delivery might be applicable").
- **Assisted buying** as a first-class route: "Buy at Home" and "Buy at Store" in the sticky bar,
  "Eye Test" and "Stores" in the bottom bar.
- **WhatsApp as a login method** at the first details screen; phone OTP is the default.
- A support phone number ("Talk to us") in the drawer; "Card EMI" in the footer.
- **COD, UPI and EMI are not shown** before login.

## Motion on a phone
- **Elegant:** the phone home is short and light (three screens, ten videos present but none
  autoplaying in our capture); the sticky bar is static.
- **Gimmicky:** a rotating search placeholder; the cart's countdown timer.
- **Jumpy:** on the product page, blocks lazy-loaded and moved during our scripted scroll
  (layout-shift total 1.54 in the capture session; not a Lighthouse CLS), leaving blank gaps in
  [02](phone-pdp-02.jpg) and [03](phone-pdp-03.jpg). The phone CSS has no `prefers-reduced-motion` rules.
- **Lighthouse: not reported.** Both runs (and a rerun with an `en-IN` Accept-Language) were
  redirected to `/en-us`, a different page from the one captured. Gap below.

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adapt:** one filled CTA plus a small assisted route beside it. Lenskart's is "Buy at Home / Buy
  at Store"; Kheelona's would be a labelled WhatsApp link, matching the WhatsApp-assisted selling in
  the plan ([positioning: outside the website](../../../../brand/positioning.md#outside-the-website-summary))
  and the store visitors who stopped to ask on WhatsApp
  ([PostHog audit §8, issue 4](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
  Brief §9.1 keeps one primary action: the link must stay secondary.
- **Adapt:** "try before you buy" in the first screen. Kheelona's equivalent is hearing Kheelu talk
  (consented parent films, [open questions](../../../../open-questions.md) G3) and the refundable
  token ([audience: buying triggers](../../../../brand/audience.md#buying-triggers)).
- **Adopt:** guarantees as short numbered promises with a "Learn more" to the terms, once F1 is
  answered ([policies](../../../../product/policies.md)).
- **Avoid:** a consent banner with no reject option, cart timers, and membership upsells.
- **Avoid:** a login wall before payment. Kheelona has no account and asks for the address after
  payment ([checkout](../../../../site/checkout.md#in-one-screen)).

**Most transferable lesson.** Lenskart keeps one filled button ("Select Lenses") on every phone
screen and puts small assisted routes beside it ("Buy at Home", "Buy at Store"), so a hesitant buyer
gets help without leaving the page; for Kheelona that route is a labelled WhatsApp link.
