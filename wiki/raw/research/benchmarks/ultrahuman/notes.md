---
title: "Benchmark capture: Ultrahuman India (ultrahuman.com/in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.ultrahuman.com/in/ (home; captured 2026-10-11 02:19 UTC phone with a 39 s load-and-scroll video, 02:20 UTC laptop; 360 × 640 at 05:03 UTC)"
  - "https://www.ultrahuman.com/in/ring/ (product story page, Ring AIR; captured 2026-10-11 02:20 UTC phone and 02:21 UTC laptop; complete phone re-capture 05:06 UTC; 360 × 640 at 05:03 UTC)"
  - "https://www.ultrahuman.com/in/ring/buy/ (buy page; captured 2026-10-11 02:20 UTC phone, 02:21 UTC laptop; 360 × 640 at 05:03 UTC)"
  - "Buy page → cart drawer → Shopify checkout (2026-10-11 03:10-03:12 UTC; stopped at the contact and delivery form, nothing typed)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), three runs per page, 2026-10-11 04:56-05:27 UTC"
---

# Ultrahuman India (ultrahuman.com/in)

**Why it is here.** An Indian wearable (smart ring) brand that sells a ₹20,000-class device online
in India and abroad, from the brief's starting set (brief §6; it stands in for Oura on the Indian
list). Indian D2C group. A connected device that has to prove its claims, sold with a configurator.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, 1x, scrolled viewport chunks; copy
from the live DOM text. The cookie banner ("Cookies with a purpose") offers **Reject**, which was
used. The first phone capture of `/in/ring/` skipped from about 5,900 px to the footer while the page
grew; the 05:06 UTC re-capture (`phone-pdp-slow`) is complete. It came from a US-based connection
(Cloudflare trace `loc=US`); the `/in/` store and ₹ prices were served unchanged.

| Files | What |
|---|---|
| `phone-home-01`, `-01b`, `-02..14`, `phone-home-scroll.webm` | Home, phone (11,574 px, 14 screens) |
| `phone-pdp-slow-01`, `-01b`, `-02..23` | Ring AIR story page, phone, complete (19,093 px). `phone-pdp-01..09` is the incomplete first run |
| `phone-buy-01`, `-01b`, `-02..16` | Buy page, phone (first 16 screens of 24,456 px) |
| `small360-{home,pdp,buy}-01`, `-01b` | First screens at 360 × 640 |
| `laptop-home-*`, `laptop-pdp-*`, `laptop-buy-*` | Laptop |
| `phone-flow-01..07.jpg` | Buy page → configurator steps → cart drawer → Shopify checkout |

The site splits the product page in two: a long **story page** (`/in/ring/`, no price anywhere in its
text) and a **buy page** (`/in/ring/buy/`, a configurator). Both are mapped below.

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [01b](phone-home-01b.jpg) | Offer | Rotating strip: "Free 2-hour delivery on Ring AIR. Select cities, 11 AM to 7 PM" / "Introducing Pulsomics. Contribute to science."; header with a **"Buy Ring PRO" button on every screen**, a country flag, bag and menu. Hero card: **"EXCLUSIVE SALE / Save 30% on Ring AIR. Limited time offer until October 18"** | none | **"Buy now"** in the hero |
| [02](phone-home-02.jpg) | Delivery speed, flagship | "RING AIR / DELIVERED IN 2 HOURS / Free delivery in select cities, from 11 AM to 7 PM."; "RING PRO / Power Moves. / The biggest leap in power and signal, ever." | none | "Buy now"; "Buy now" + "Explore" |
| [04](phone-home-04.jpg) | Evidence | **"Every reading, built on evidence. / The science behind Ultrahuman, explained."**; "Category-Defining Battery Life: up to 15 days" | Science page | "Read the science" |
| [05](phone-home-05.jpg)–[07](phone-home-07.jpg) | Ring PRO | "PRO beyond measure" (movement, sleep, workout, recovery, cycle cards); "Ring PRO / More power to you"; "Up to 45 Days combined battery life with the PRO Charger"; "A closer look" spec list | Specs | **A bar scoped to the section: "Ring PRO [Buy now] [Learn more]"** |
| [08](phone-home-08.jpg)–[09](phone-home-09.jpg) | Ring AIR | "Compact powerhouse of health tracking"; "AS LIGHT AS 2.4 grams"; "11x lighter", "Up to 6 days", **"No mandatory subscription: Precision health tracking and core features without recurring monthly charges."** | Specs | section bar "Ring AIR [Buy now] [Learn more]" |
| [10](phone-home-10.jpg)–[11](phone-home-11.jpg) | App, stores | "Ultrahuman experience, reimagined." (App Store, Play Store); a video: "The world's sleep, on a single system. Millions already track their sleep on one system. Find a store near you" | none | "Find a store" |
| [12](phone-home-12.jpg) | Scale | Live counters "130,436,029 Nights of sleep tracked" (ticking while on screen), "180+ Countries with active ring users"; "SCIENCE PARTNERS" | Usage counter | none |
| [13](phone-home-13.jpg)–[14](phone-home-14.jpg) | Footer | Support email and a toll-free number; "ISO27001, GDPR, and HIPAA compliant"; registered address and CIN; "Find a store" | Compliance claims | none |

A floating **"Pre-Purchase Consultation"** chat button appears from screen 12.

**Headline formula.** Offer with a dated end ("Save 30% on Ring AIR. Limited time offer until
October 18"), then a delivery promise ("DELIVERED IN 2 HOURS"). Every product section ends in the
same two buttons, "Buy now" and "Learn more".

## Story page `/in/ring/` (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01b](phone-pdp-slow-01b.jpg) | Hero | Video: "The world's most comfortable sleep tracker. / Ultrahuman Ring AIR® / Accurately tracks sleep, HRV, temperature, and movement with daily actionable health insights." | **"Find a store" + "Buy now"**; header "Buy Ring AIR" on every screen |
| [02](phone-pdp-slow-02.jpg) | Accuracy | "Accuracy at its core": "Precision engineering at the UltraFactory" (integrated production facility, performance testing); "Trusted by the World's #1 Ranked Cycling Team and more" (named teams) | header button |
| [03](phone-pdp-slow-03.jpg)–[04](phone-pdp-slow-04.jpg) | **Claims with their study** | "More accurate from the Finger than the Wrist"; **"Clinically validated: The cutting-edge Metabolic Score … novel research demonstrates a link between Metabolic Score, insulin sensitivity, and inflammation. / Scientific Reports, part of the nature group / [Read the study →]"** | "Read the study" |
| [05](phone-pdp-slow-05.jpg)–[15](phone-pdp-slow-15.jpg) | Design story | Full-screen dark visuals: "A sublime design wonder", "Beautiful from the inside", "Strong from the outside" (titanium, tungsten carbide coating), "Recharge at your own pace", "Precision in miniature" (11x lighter) | header button |
| [16](phone-pdp-slow-16.jpg)–[19](phone-pdp-slow-19.jpg) | What you get | Feature cards with app screens: "Wake up to your sleep insights", "Temperature tracking made easy", "Listen to your body clock", "Maximize recovery with key HRV insights", "The only nudges that you need" | header button |
| [20](phone-pdp-slow-20.jpg)–[23](phone-pdp-slow-23.jpg) | Cross-sell, footer | "Discover metabolic health with M1" ("Explore Ultrahuman M1"); footer | header button |

## Buy page `/in/ring/buy/` (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01b](phone-buy-01b.jpg) | Price and promise | "Shipping to India" bar; "Ring AIR / ~~₹28,499~~ ₹19,949.30 **or ₹832/mo**"; "Trade-in. Save up to ₹9,000* [Opt in]"; **"Dispatched by Oct 17 (after size selection)"**; "Same day delivery available. Order within 11:09:48 / [Enter 6-digit pincode] Check / Applicable in select cities."; "EXCLUSIVE OFFER APPLIED / Special pricing for the Heroes Of The World"; gallery "Real-life Images" with **"30-night risk free trial* • Free returns"** under it | **Sticky bottom bar from first paint: "Total" + card logos + "₹19,949.30 (Tax incl.)" + "Continue"** |
| [02](phone-buy-02.jpg) | Configure | "Colour. Choose your favourite finish." (5 finishes); "Size. Sizing kit recommended for best fit." with a free **Sizing Kit** ("Perfect ring fit", "no guesswork"; "Yours to keep and share", "no returns required") or "I know my ring size" | sticky bar |
| [03](phone-buy-03.jpg) | Upsell | Trade-in; "UltrahumanX Coverage. Protect your new Ring." 1 Year ₹2,988 / 2 Year ₹4,440 ("8 IN 10 CHOOSE 2 YEARS", "Save 25%"); "I don't want theft & loss protection" | sticky bar |
| [04](phone-buy-04.jpg) | Summary | "Almost there. Here's your order summary." line items and total; "Add to cart"; **"No cost EMI starting at ₹ 832/month · CRED pay \| Save and earn rewards · Easy payments with UPI"**; "Every order supports a woman or child with essential nutrition. In partnership with Vitamin Angels" | Add to cart |
| [05](phone-buy-05.jpg)–[08](phone-buy-08.jpg) | Box, reviews | "What's in the box"; "Don't take our word for it. Read what people have to say" (short reviews with first names or handles); "Unmatched Accuracy", "11x Lighter", "Ultimate Comfort" | sticky bar |
| [09](phone-buy-09.jpg)–[16](phone-buy-16.jpg) | Depth | Sleep and recovery features; "Science-backed coaching" ("on us"); **"How we compare"**: a table against named rival devices, switchable | sticky bar; an in-page section picker pill (Overview, Reviews, What's in the box, Compare) |

**CTA position and repetition.** Home: "Buy now" in the hero and in every product section, plus the
header button on every screen; all inside the first 360 × 640 screen
([small360-home-01b](small360-home-01b.jpg)). Story page: "Buy now" in the hero and the header
button throughout ([small360-pdp-01b](small360-pdp-01b.jpg)). Buy page: the sticky total and
"Continue" on every screen, price inside the first 360 × 640 screen
([small360-buy-01b](small360-buy-01b.jpg)). On laptop the buy page is two columns with a full-width
bottom bar ("Dispatched by Oct 17 … ₹19,949.30 (Tax incl.) Continue") and "Talk to an expert" in
the header ([laptop-buy-01b](laptop-buy-01b.jpg)).

## Trust devices
- **Claims carry their evidence one tap away**: "Read the science", "Read the study" with the
  journal named beside the claim.
- Risk reversal under the gallery ("30-night risk free trial* • Free returns"); a free sizing kit
  that removes the fit risk; a dispatch date before any choice is made.
- Proof of scale (a live counter, countries), named sports teams, reviews, "What's in the box".
- "No mandatory subscription" stated as a feature; compliance and company identity in the footer.
- A pre-purchase consultation and "Talk to an expert" as routes to a person.

## Offers and guarantees
- A sale with an end date rather than a clock on Home; strike-through price; "or ₹832/mo" beside the
  price; trade-in credit; a protection plan upsell with a "most people choose" nudge.
- A cause attached to every order (Vitamin Angels).

## Product → cart → checkout (phone)
1. Home "Buy now" or the header button → buy page ([flow-01](phone-flow-01-pdp-first.jpg)).
2. **Continue** (colour), **Sizing Kit**, **"I don't want to trade in"**, **"I don't want theft & loss
   protection"** ([flow-02](phone-flow-02-after-add.jpg) to [flow-05](phone-flow-05-step.jpg)).
3. **Add to cart** → drawer "Your cart" ([flow-06](phone-flow-06-step.jpg)): "Make this a gift", the
   ring ("Size not confirmed"), the sizing kit ("Ships immediately", Free), "Total (2 items)
   ₹19,949.30", **Checkout**.
4. Shopify checkout ([flow-07](phone-flow-07-checkout-first-screen.jpg)): "Order summary ~~₹28,499.00~~
   ₹19,949.30"; **a row of payment logos before any field** (Visa, Mastercard, Apple Pay, Google Pay,
   Paytm, PayU, RuPay); Contact: Email, a pre-ticked "Email me with news and offers", **GSTIN
   (optional)**; Delivery: country India, name, address. **Stopped.**

Taps from the buy page to the first details screen: **6**, every one a decision.

## India-specific patterns
- "Shipping to India" with a country flag; ₹ prices marked "(Tax incl.)".
- **No-cost EMI** beside the headline price; **UPI** and **CRED pay** named in the summary.
- **Pincode check for same-day or 2-hour delivery** in select cities, with a countdown to the
  cut-off; a named dispatch date.
- **GSTIN** field at checkout; a toll-free support number.
- COD: not offered on the captured pages. WhatsApp: no link on the buy page (DOM check, 2026-10-11);
  help is an on-site chat and the pre-purchase consultation.

## Motion on a phone
- **Elegant:** short fade-in reveals on text as sections enter (seen in `phone-home-scroll.webm`);
  section-scoped sticky bars that appear only while their product is on screen; the CSS has 23 to 30
  `prefers-reduced-motion` rules; the best Lighthouse scores in this group (below).
- **Heavy:** four autoplaying videos on Home and two on the story page; a 19,093 px dark
  scroll-telling story page with animated rings; grey placeholders while images load.
- **Gimmicky:** the ticking "nights tracked" counter and the same-day cut-off countdown.
- **Font swap:** the hero's "EXCLUSIVE SALE" paints in a fallback face, then switches to the
  condensed web font (scroll video, first seconds after paint).

Median of three runs, range in brackets. The buy page was not measured.

| Lighthouse 13.4.1, mobile, 3 runs (2026-10-11 04:56-05:27 UTC) | Perf | LCP | TBT | CLS | Page weight | A11y |
|---|---|---|---|---|---|---|
| Home | 63 (62-67) | 6.4 s (5.7-6.7) | 220 ms (210-240) | 0 | 6,839-7,671 KiB | 89 |
| Story page `/in/ring/` | 77 (77-77) | 4.0 s (3.8-4.0) | 150 ms (70-160) | 0.004 | 6,777-6,937 KiB | 89 |

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** every research-anchored claim sits beside its public source with a "Read the study"
  link: "conversation helps a young brain grow; Kheelu gives a child more of it", cited to the study
  itself ([claims §8](../../../../product/claims.md#8-brain-and-development-claims-with-their-anchors);
  [content boundary: public research](../../../../site/content-boundary.md);
  [positioning: reasons to believe](../../../../brand/positioning.md#reasons-to-believe)).
- **Adopt:** a dispatch or ship date and the risk reversal beside the price, before any choice
  (Kheelona: the ship date and "refundable until we ship", from the store's source,
  [pricing](../../../../product/pricing.md)).
- **Adapt:** "No mandatory subscription" stated as a feature. Kheelona's Kheelona+ line is
  sanctioned wording only, and "talking is free for life" is not confirmed
  ([facts: Kheelona+](../../../../product/facts.md#kheelona); [open questions](../../../../open-questions.md) F7).
- **Adapt:** section-scoped sticky bars and short fade-in reveals as the motion reference for Gate A
  ([motion](../../../../design-system/motion.md); G4), without autoplay video on phones.
- **Avoid:** a six-decision configurator with upsells before checkout; Kheelona has one product and
  one price per request, and the store is one tap away ([checkout](../../../../site/checkout.md#in-one-screen)).
- **Avoid:** splitting the story and the price across two pages; Kheelona's product page already
  sends three times more visitors to the store than Home
  ([PostHog audit §8, issue 6](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
- **Avoid:** named rival devices in a comparison table (never on Kheelona's site,
  [positioning: competitors named](../../../../brand/positioning.md#competitors-named)).

**Most transferable lesson.** Ultrahuman puts the study next to the claim ("Clinically validated …
Scientific Reports, part of the nature group · Read the study"): for Kheelona, each
research-anchored brain line should carry its public source and a link on the page, so the claim
can be checked where it is read.
