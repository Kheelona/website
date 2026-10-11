---
title: "Benchmark capture: tonies (tonies.com, EU English store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://tonies.com/ → redirected to https://tonies.com/en-eu/ (home, captured 2026-10-10)"
  - "https://tonies.com/en-eu/toniebox-2/toniebox-2-moon-grey/ (product page, captured 2026-10-10)"
  - "https://tonies.com/en-eu/toniebox-2/toniebox-2-sunset-red/ (first product tried; 'Notify me', out of stock, 2026-10-10)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# tonies (tonies.com, EU English store)

**Why it is here.** The screen-free audio player for children, from the brief's starting set
(brief §6, Market Research). Kids / toy group. Closest global analogue for "screen-free, the child
plays independently".

**Store reached.** There is no Indian store: `tonies.com` redirected an Indian visitor to the EU store
in English, priced in euros ("Shipping to 8 EU countries"). Everything below is that store.

**How it was captured (2026-10-10).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent,
`en-IN`, Asia/Kolkata. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, at 1x, scrolled viewport
chunks. `*-00-landed` shows the first screen before the consent dialog was closed with "Only
essential Cookies".

| Files | What |
|---|---|
| `phone-home-00..11.jpg` | Home, phone (8,595 px) |
| `phone-product-00..08.jpg` | Product page, Toniebox 2 Moon Grey, phone (5,652 px) |
| `small360-*`, `laptop-*` | 360 × 640 first screens; laptop home and product |
| `phone-cart-01..02.jpg` | Add to cart attempt (error toast) |
| `phone-cart2-01-after-add.jpg` | Retry of the same step later the same evening (same error toast) |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg) | Consent | Full-width consent dialog covers the bottom two-thirds of the first screen: "Accept all Cookies and continue / Only essential Cookies / More" | none | none |
| [01](phone-home-01.jpg) | Campaign hero | Promo strip "Toniebox 2: Create a Bundle & Save! 🎁"; hero carousel of campaigns. Slide 1: "Bring Harmony to Every Moment" (new songs and mindfulness Tonies). Other slides: a 15% "Play Set Bundle", a Pippi bundle (one line in Dutch), "Toniebox 2: Listen, play, grow" | none | "Shop the New Arrivals" (not the core product) |
| [02](phone-home-02.jpg) | Navigation | Category tiles: Toniebox 2, Tonies, Bundles, Tonieplay, Audio Content, Sale; "Discover our tonies® world" cards | none | "Discover Now" |
| [03](phone-home-03.jpg)–[05](phone-home-05.jpg) | How it works | "Discover two fun ways to play" with tabs "Tonies (Age 1-9)" and "Tonieplay (Age 3-9)"; three steps: "This is a Tonie / This is a Toniebox 2 / This is a Happy Listening" | Photo of a child | none |
| [05](phone-home-05.jpg) | **Try it** | "Give it a try: Pick a Tonie or Tonieplay game to give it a listen." Character discs (The Gruffalo, Frozen, Lilo & Stitch…) and a play button: an **in-page audio sampler** | The product's own sound | none |
| [06](phone-home-06.jpg) | Range by age | "Songs, stories, games and more / With 200+ Tonies…": chips Nursery, 3+, 4+, 5+, 6+ years | Range size | "Explore all Tonies" |
| [07](phone-home-07.jpg) | Shop | Product carousel: Toniebox 2 colours at €119.99 each; four of five read "Sold out, but back soon" | none | cart icon button |
| [07](phone-home-07.jpg) | Licences | Logo row: Disney, Paw Patrol, Peppa Pig… | Licensed brands | none |
| [08](phone-home-08.jpg) | FAQ | "What is Toniebox 2?", "Do I need WiFi to use the Toniebox 2?", "What age is the Toniebox 2 for?" | none | none |
| [09](phone-home-09.jpg) | Trust row | "Free shipping for orders from €50 on · Shipping to 8 EU countries · Secure payments with Adyen · 30 days happiness guarantee", each with "more on this" | Guarantee | newsletter "Subscribe" |

**Headline formula.** A seasonal campaign line ("Bring Harmony to Every Moment"), not the product
promise. The product promise ("Listen, play, grow") is a later carousel slide.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product-01.jpg) | Buy box | Breadcrumb; gallery; "Toniebox 2 Box Only Moon Grey"; five colour dots; a sticky bundle strip "Save up to €48.93 on Toniebox bundles!" above a **sticky bottom bar "€119.99 incl. VAT · Add to shopping cart"** | sticky bar |
| [02](phone-product-02.jpg) | Description | "Toniebox 2 is the kid-powered audio player… designed for ages 1-9+." **"Good to know: You'll need WiFi to set up your Toniebox 2 · … · Tonieplay Controller, Tonieplay Games and Tonies sold separately"**; five feature icons | sticky bar |
| [02](phone-product-02.jpg)–[03](phone-product-03.jpg) | Warnings and specs | "Warning! This toy produces flashes that may trigger epilepsy in sensitised individuals."; age 1+, dimensions, weight, battery; **Requirements: Wi-Fi, internet access, account, app**; a note on why the charging cable is short (child-safety standard for ages 1+) | sticky bar |
| [03](phone-product-03.jpg) | Trust row | Free shipping from €50, 8 EU countries, Adyen, 30 days happiness guarantee | sticky bar |
| [04](phone-product-04.jpg) | Compare | "Compare Models": Toniebox 2 vs Toniebox (no longer available): ages, Wi-Fi ("Works without Wi-Fi*", with a footnote that Wi-Fi is needed to set up and for a Tonie's first play), charging, app features | sticky bar |
| [05](phone-product-05.jpg)–[06](phone-product-06.jpg) | Cross-sell | "Recommended for you": Tonies at €16.99 with play buttons | sticky bar |

**CTA position and repetition.** One label, "Add to shopping cart", in a sticky bottom bar with the
price "incl. VAT" on every product screen; at 360 × 640 it is in the first screen
([small360-product-01](small360-product-01.jpg)). Home has no product CTA in its first screen
([small360-home-01](small360-home-01.jpg)).

## Trust devices
- A four-item trust row (shipping threshold, where it ships, payment processor, "30 days happiness
  guarantee"), each linked to its detail.
- Plain warnings and requirements on the product page, before the price is repeated.
- Licensed characters as recognition, not as reviews. No star ratings were seen on the product page.

## Offers and guarantees
- Price shown "incl. VAT" in the sticky bar.
- Bundles as the offer: "Save up to €48.93 on Toniebox bundles!", "Create your own bundle… savings up to 20%".
- The guarantee is named warmly ("happiness guarantee"), with the legal detail one tap away.

## Product → cart → checkout (phone, 2026-10-10)
1. Sunset Red (the "Buy Toniebox 2" target on the Toniebox 2 page) showed "Notify me": out of stock.
   Moon Grey was in stock.
2. "Add to shopping cart" on Moon Grey returned a toast, "An error has occurred. Please check your
   internet connection!", twice ([cart-01](phone-cart-01-after-add.jpg),
   [cart-02](phone-cart-02-sticky-bar-after-error.jpg)). The cart and checkout were not reachable from
   our Indian connection; the cause was not investigated (possibly the EU-only store).
3. Retried once later the same evening (2026-10-11 04:58 UTC) with the same result: the same toast
   ([cart2-01](phone-cart2-01-after-add.jpg)). The cart step stays unreachable from this capture setup;
   the cause is still not known.

## India-specific patterns
None: an EU store. No COD, UPI, EMI, pincode or WhatsApp.

## Motion on a phone
- **Calm.** No autoplay video; the hero carousel did not advance within 3 s; the only running
  animation at load was a loading spinner. Carousels move on swipe.
- **Elegant:** the sampler plays sound on a tap instead of moving anything.
- **Slow:** Lighthouse measured the slowest pages in this group (below).

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home (`/en-eu/`) | 30 | 19.6 s | 1,800 ms | 0.09 | 3,092 KiB |
| Product page | 35 | 24.4 s | 1,650 ms | 0.015 | 2,323 KiB |

## Laptop (1440 × 900)
The consent dialog becomes a bottom banner ([laptop-home-00](laptop-home-00-landed.jpg)). Product page
in two columns with thumbnails, buy box on the right and the bundle offer beside it
([laptop-product-01](laptop-product-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** let parents hear the product on the page ("Give it a try"): a tap-to-play sample of
  Kheelu asking a child a question. Tied to the positioning's "conversation is the proof of how"
  ([positioning: in one line](../../../../brand/positioning.md#in-one-line)); real recordings only (brief §9.8).
- **Adopt:** a "Good to know" box with honest requirements: Wi-Fi to set up, what is sold separately,
  the age grade and any warning. Tied to brief §9.7 (data and product checks) and the age correction
  ([positioning: the age correction](../../../../brand/positioning.md#the-age-correction)).
- **Adopt:** price written "incl. taxes" inside the sticky bar (brief §9.1: price inclusive of taxes next to the CTA).
- **Adapt:** a warm name for the guarantee, with the terms one tap away; only once returns are
  confirmed ([policies](../../../../product/policies.md), F1 in [open questions](../../../../open-questions.md)).
- **Avoid:** a seasonal campaign as the Home hero; the first screen should state the promise and carry
  the CTA ([PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  issues 1 and 5).
- **Avoid:** a consent dialog that covers two-thirds of the first phone screen (no consent banner today; G6 in [open questions](../../../../open-questions.md)).

**Most transferable lesson.** Let the parent hear it: tonies puts a tap-to-listen sampler on Home and
pairs it with a plain "Good to know" list of requirements on the product page, so the product sells
on its real experience and nothing surprises the buyer after delivery.
