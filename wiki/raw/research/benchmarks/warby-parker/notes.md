---
title: "Benchmark capture: Warby Parker (warbyparker.com, US store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.warbyparker.com/ (home, phone and laptop, captured 2026-10-11 02:12-02:14 UTC, Indian connection)"
  - "https://www.warbyparker.com/eyeglasses/brimmer/black-walnut?w=medium (product page, phone and laptop, captured 2026-10-11 02:32-02:33 UTC; the first two tries the same night answered 403)"
  - "Select lenses and buy, step 1 (phone, captured 2026-10-11 02:40 UTC); later steps and /cart re-tried 2026-10-11 05:00-05:10 UTC from a US connection"
  - "Laptop home, re-take of the range that rendered blank (captured 2026-10-11 05:16 UTC, US connection)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:11 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:52 UTC, US connection"
---

# Warby Parker (warbyparker.com, US store)

**Why it is here.** Global DTC leader from the brief's starting set (brief §6, Market Research), known
for turning a considered purchase (prescription glasses) into a few guided taps.

**Store reached.** US store in USD; the footer offers only USA and Canada. The store locator measured
the nearest shop from our location ("Old Port - 7514.5 miles away", [phone-home-06](phone-home-06.jpg)).

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, scrolled viewport chunks, from an Indian
connection. The product page answered **403** to the first two automated visits and loaded on the third.
360 × 640 first screens, the laptop re-take and Lighthouse were added from a **US connection**.

| Files | What |
|---|---|
| `phone-home-00..12.jpg` | Home, phone (12 screens; the page grows as it lazy-loads) |
| `phone-pdp-00..15.jpg` | Product page, Brimmer in Black Walnut, phone (10,834 px) |
| `laptop-home-00..14.jpg` | Laptop home. **04–06 rendered blank and 07 repeats the top**: a capture fault |
| `laptop-home-retake-01..04.jpg` | Re-take of that range (2,370 to 4,740 px). This later load showed a different section order, so it does not join seamlessly with 08 |
| `laptop-pdp-00..09.jpg` | Laptop product page |
| `phone-flow-01..04.jpg` | Product page → lens step 1 → blank step 2 → `/cart` as served to us |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens (US connection) |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | Hero | Sticky header (menu, logo, account, cart) with a four-tab row: Eyeglasses, Sunglasses, Contacts, Style quiz. Photo of frames; H2 "New frames with fall-ish polish"; link "Shop Iris Edition"; line "Free shipping and free 30-day returns" | Guarantee line in the hero | "Start with a quiz" + "Shop eyeglasses" |
| [02](phone-home-02.jpg) | Editorial | "Dreamy, handcrafted details" (Shop Annie); "The best decade for minimalism" (Shop the '90s Edit) | none | Shop … |
| [03](phone-home-03.jpg) | Products | "Shop all new arrivals" carousel: each card has a favourite heart, "Try on", colour dots, price ($95) and "Select lenses and buy" | Price | Select lenses and buy |
| [04](phone-home-04.jpg)–[06](phone-home-06.jpg) | Range and UGC | "Turn any pair into a progressives pair"; "Shop by color"; "Warby in the wild" customer videos (blank while loading in our capture) | Customer videos | Shop … |
| [06](phone-home-06.jpg) | Stores | "Visit us in person", with the nearest store and its distance | Physical stores | Find a store / Book an exam |
| [06](phone-home-06.jpg)–[07](phone-home-07.jpg) | Insurance | "It's easy to use your insurance": an inline form (name, date of birth, zip) | Insurer names | Check my benefits |
| [08](phone-home-08.jpg)–[09](phone-home-09.jpg) | App and impact | "An eye-opening app experience" (virtual try-on); "Buy a Pair, Give a Pair"; "25,000,000 pairs of glasses (and counting) distributed to people in need" | Impact number | Download for iOS / Learn more |
| [09](phone-home-09.jpg)–[12](phone-home-12.jpg) | Footer | Newsletter; link groups incl. "Customer reviews"; "Need a hand?" with FAQ and Chat; app badges | Support | none |

**Headline formula.** A seasonal collection line, not a brand promise. The hero offers a guided path
(the quiz) beside a browse path, and puts the guarantee ("Free shipping and free 30-day returns") inside
the hero itself.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg)–[01](phone-pdp-01.jpg) | Buy box, top | Breadcrumb; H1 "Brimmer"; "Starting at $95"; "20% off extra pairs"; stars "(70)"; gallery with icons for frame measurements, a 3D viewer and "Try on" (virtual try-on); colour; width Narrow / Medium / Wide with a "Width guide" | none in the first screen |
| [02](phone-pdp-02.jpg) | Buy box, offer | "Select lenses and buy"; "Free shipping · Free returns" under it; a card **"Everything included for $95"**: single-vision prescriptions, polycarbonate lenses, anti-reflective and scratch-resistant coatings, free scratched lens replacement, FSA/HSA and insurance accepted | Select lenses and buy |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Terms | The same list expanded with conditions: "Free returns or exchanges: Within 30 days of purchase", "Free scratched lens replacement: Guaranteed for prescription lenses within six months of purchase", "Buy a Pair, Give a Pair" | sticky bar appears |
| [04](phone-pdp-04.jpg) | Detail | Accordions: "Prescription and lens types offered", "Need a prescription?", "Accessories"; "Similar to Brimmer" | sticky bar |
| [05](phone-pdp-05.jpg)–[11](phone-pdp-11.jpg) | Reviews | "Customer reviews: Overall Rating 4.4, 70 Reviews" with Quality 4.5 and Value 4.5 bars; a 5-to-1 star snapshot; sort and filters; each review has title, stars, name, age ("2 weeks ago"), prescription type and its own Quality / Fit / Value scores. A 1-star review ("Warby has jumped the Shark!") is shown in the first page of reviews | sticky bar |
| [12](phone-pdp-12.jpg)–[15](phone-pdp-15.jpg) | Footer | Newsletter, link groups | sticky bar stays |

**CTA position and repetition.** One label, "Select lenses and buy", on every product card and the
product page. From [03](phone-pdp-03.jpg) to the end a sticky bottom bar shows **"From $95 / pay over
time with Affirm or Klarna"** with "Select lenses and buy" and a secondary "Try on". At **360 × 640** no
CTA is visible in the product page's first screen ([small360-pdp-01](small360-pdp-01.jpg)); Home's two
hero buttons are inside it ([small360-home-01](small360-home-01.jpg)).

## Trust devices
- The guarantee in the hero and again directly under the buy button.
- "Everything included for $95": the price turned into a list of what is included and guaranteed.
- Reviews with a distribution, sub-scores and visible negative reviews.
- Virtual try-on, width guide and frame measurements before buying; physical stores; insurance check.
- Impact number ("25,000,000 pairs") and "Buy a Pair, Give a Pair"; FAQ and chat in the footer.

## Offers and guarantees
- Price floor ("Starting at $95"), "20% off extra pairs", buy now pay later (Affirm, Klarna) inside the
  sticky bar, insurance and FSA/HSA.
- Guarantees are stated with their conditions (30 days, six months), not as bare adjectives.

## Product → cart → checkout (phone)
1. "Select lenses and buy" opens a full-screen configurator with a progress bar
   ([flow-02](phone-flow-02-step1.jpg)): **"Have your prescription handy?"** with three choices: "Yes,
   Add it now: Select a prescription from your account, upload a photo, or enter it manually." / "No,
   Add it later: You can add it in cart or checkout … we'll need a valid prescription to fulfill your
   order." / "I don't need one: I'm buying non-prescription or readers."
2. After "I don't need one" the next step rendered blank apart from an "Add to Cart" label
   ([flow-03](phone-flow-03-step2.jpg)), in the first run and again on the US connection. In the re-try
   the site's own calls (`/wapi/v1/cart`, `/wapi/v1/cart/count`, the reviews feed) answered **403** to our
   headless browser, and `/cart` served "Warby Parker is currently down for scheduled maintenance. We
   should be back up and running shortly." with a phone number and email
   ([flow-04](phone-flow-04-cart-page-as-served.jpg)). We did not try to get round it.

**The cart and checkout were not reached** (see gaps). Taps observed: 2 (Select lenses and buy, a
prescription choice), with more lens steps after that.

## India-specific patterns
- None. US and Canada only, USD, no COD, UPI or WhatsApp. Affirm and Klarna are the instalment option
  (the US cousin of EMI) and they sit inside the sticky bar.

## Motion on a phone
- **Calm:** few moving parts; the site ships `prefers-reduced-motion` rules. The star rating animates
  in on first load.
- **Media:** "Warby in the wild" uses autoplaying, muted, looping videos that were still blank when
  scrolled to ([phone-home-05](phone-home-05.jpg)).
- **Elegant:** the configurator opens as a full-screen step with a progress bar instead of a new page;
  the sticky bar is static.
- **Slow:** a heavy main thread on both pages (Lighthouse TBT below).

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home | 49 | 100 | 5.2 s | 1,810 ms | 0 | 1,775 KiB |
| Product page | 33 | 100 | 10.8 s | 4,690 ms | 0 | 2,957 KiB |

## Laptop (1440 × 900)
An eight-item nav (Eyeglasses, Sunglasses, Contacts, Eye exams, Insurance, Accessories, Style quiz,
Intelligent Eyewear). The hero carries a four-part trust strip: "20% off first contacts order · Free
shipping · Free 30-day returns · Vision benefits accepted" ([laptop-home-00](laptop-home-00-first-load.jpg)).
The product page is two columns, and on scroll a top sticky bar shows the frame, "From $95", Affirm or
Klarna, "Try on" and "Select lenses and buy" ([laptop-pdp-02](laptop-pdp-02.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** an "Everything included for ₹4,999" list directly under the CTA, built only from confirmed
  facts ([facts](../../../../product/facts.md), [pricing](../../../../product/pricing.md); the Kheelona+
  line only in its sanctioned form). Brief §9.1.
- **Adopt:** a sticky bar that carries the payment terms beside the action, as "From $95 / pay over time"
  does; for Kheelona the token line, in token mode only (G1, G9 in
  [open questions](../../../../open-questions.md)). [PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact).
- **Adapt:** "Add it later": let the parent commit now and finish the hard part later. Kheelona's token
  is the same idea; say it beside the button in plain words (₹499 now, ₹4,500 before dispatch; see
  [pricing](../../../../product/pricing.md)).
- **Adapt:** guarantees stated with their conditions, as Warby states "30 days" and "six months". Kheelona
  now has them: 7-day returns, no questions asked ([D021](../../../../decisions/D021-returns-policy.md)), and a 6-month warranty on manufacturing
  defects ([D022](../../../../decisions/D022-warranty-replacement-refund.md)); the remaining F1 items stay unpublished.
- **Adapt:** reviews with sub-scores and negative reviews shown, but only when real reviews exist
  (brief §4.2; no fabricated social proof).
- **Avoid:** two hero buttons of equal weight (brief §9.1) and a main thread this heavy
  ([PostHog audit §8, issue 8](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact), phone INP).

**Most transferable lesson.** Warby Parker turns the price into a promise right under the button,
"Everything included for $95" plus "Free shipping · Free returns", so the parent reads what the money
buys and what is guaranteed before tapping.
