---
title: "Benchmark capture: The Whole Truth (thewholetruthfoods.com)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://thewholetruthfoods.com/ (home; captured 2026-10-11 02:16 UTC phone with a 38 s load-and-scroll video, 02:17 UTC laptop; 360 × 640 at 05:02 UTC)"
  - "https://thewholetruthfoods.com/products/double-cocoa (product page, Double Cocoa Protein Bars Box of 10; captured 2026-10-11 02:53 UTC phone and laptop; 360 × 640 at 05:03 UTC)"
  - "Cart drawer and two-step checkout opened from that page (2026-10-11 02:56-03:03 UTC; the public Bengaluru GPO pincode 560001 was typed into the cart's delivery check; stopped at the address and payment form, nothing else typed)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), three runs per page, 2026-10-11 04:55-05:27 UTC"
---

# The Whole Truth (thewholetruthfoods.com)

**Why it is here.** An Indian clean-label food brand known for radical ingredient transparency, from
the brief's starting set (brief §6). Indian D2C group. Its whole site argues one point: you can
check what we say. That is Kheelona's foundation problem too ("safety has to be visible and
specific", [audience: needs](../../../../brand/audience.md#needs)).

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, 1x, scrolled viewport chunks; copy
from the live DOM text. The only text typed anywhere was the public GPO pincode 560001, because the
cart will not continue without one.

| Files | What |
|---|---|
| `phone-home-01..10.jpg`, `phone-home-scroll.webm` | Home, phone (8,276 px, 10 screens); 38 s video of the load and scroll |
| `phone-pdp-01..07.jpg` | Product page, phone (5,492 px, 7 screens) |
| `small360-{home,pdp}-01.jpg` | First screen at 360 × 640 |
| `laptop-home-01..08.jpg`, `laptop-pdp-01..06.jpg` | Laptop |
| `phone-flow-01..05.jpg` | Product page → delivery block → after add → cart drawer (pincode required) |
| `phone-flow-06..11.jpg` | Cart after pincode → checkout step 2/2 → scrolls (09 to 11 are the same screen: the page had ended) |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [01](phone-home-01.jpg) | Mission | Rotating black strip: "Orders dispatched within 48-72 hours" / "Earn 2% loyalty points on orders above ₹1,000" / "Discounts auto-applied in cart". Hero: **"We're re-building the world's trust in food."** / "We're a clean-label food brand" | none | Outline link **"Short story looong of why we exist →"**, not a buy button |
| [01](phone-home-01.jpg)–[02](phone-home-02.jpg) | The promise, then the range | "We make real food. Food so clean, we declare each and every ingredient, proudly, upfront."; category cards (Protein Powder "All the protein you need", Protein Bars "Clean. Meet protein.", Nut Spreads "Real nuts. Unreal taste.") | The ingredient promise | category cards |
| [02](phone-home-02.jpg) | Honesty about flaws | "Real food is flawed. And those flaws are perfect! Our food doesn't always look perfect. (But it tastes great!) Proof that we didn't tamper with nature." | Self-deprecation | none |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Authority | "We're also fixing food journalism."; "Truth Be Told: India's top health newsletter. Read by 50,000+."; "The Whole Truth Academy"; "ChemX: Found an ingredient you can't pronounce?"; one product promo ("Nuttin' comes close!" with "Shop Now") | Reader count | "Shop Now" |
| [05](phone-home-05.jpg) | Show the factory | "Real food made by real people."; **"Our Bada Barkhana in 3D: See where our protein powders are made"** (an interactive factory tour); "we literally have #nothingtohide. PS- Our Bada Barkhana is an FSSC certified facility :)" | Factory tour, certification | tour |
| [06](phone-home-06.jpg) | Social proof | "Real people. Real love. We're blessed! Because we have you"; "Head to our wall of infinite love (and we didn't even have to pay for it)" with celebrity photos | Unpaid celebrity fans | link |
| [08](phone-home-08.jpg)–[09](phone-home-09.jpg) | Community, press | "Come, join the fam!" (Instagram, YouTube, LinkedIn); press cards (Forbes, YourStory, The Economic Times and others) | Press | links |
| [09](phone-home-09.jpg)–[10](phone-home-10.jpg) | Pay, footer | "Securely pay using:" (card, UPI and wallet logos) **"Oh! and Cash On Delivery too :)"**; newsletter; footer with **"Why Prices Change", "Protein Test Reports", "Food Drink Test Reports", "Unauthorized Sellers"** and the regulator's "Food Safety Connect App" | Published test reports | links |

Fixed: header and strip at the top; a bottom bar **HOME, SHOP, SEARCH, REORDER, NEXT GEN** (the
kids' range). There is no buy button anywhere on Home's first screen, at 390 × 844 or at
360 × 640 ([small360-home-01](small360-home-01.jpg)).

**Headline formula.** A mission, not a product: "We're re-building the world's trust in food." The
same line leads the laptop home ([laptop-home-01](laptop-home-01.jpg)).

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-pdp-01.jpg) | Buy box | Sticky jump tabs "Offers · FAQs · Reviews"; H1 "Double Cocoa Protein Bars Box of 10"; gallery with "Bestseller"; the pack itself says "The Whole Truth is that this bar contains ~~zero~~ sugar" with "All the sugar is from raw, whole dates. No hidden substitutes. We swear!"; "₹1,105 ~~₹1,300~~ ₹195 OFF / using code CLEANEST (auto-applied)" | **Sticky bar from first paint: ADD TO CART (outline) + BUY NOW (filled)** |
| [02](phone-pdp-02.jpg) | Choose, deliver, review | "MRP inclusive of all taxes"; BOX OF 5 / BOX OF 10 ("Best Deal"); ADD TO CART; **"Delivery Options [Enter pincode] Check"**; "Free Shipping on orders above ₹500"; "Replacement and cancellation policy" (link); "4.7 out of 5 · 431 verified reviews"; a handwritten line, "They lied when they said healthy can't be this tasty." | sticky bar |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | **What's inside** | "What's inside?": every ingredient with its share, adding up to 100% (cashews 35%, dates 27%, whey protein concentrate 17%, almonds 10%, cocoa powder 6%, cocoa butter 5%); Nutritional Facts and Product Details accordions; "no added refined sugar · no preservatives · … · no false claims · no half-truths / and no hidden * marks either" | sticky bar |
| [03](phone-pdp-03.jpg)–[04](phone-pdp-04.jpg) | Objections | "Got questions? Lets dive in!": "I don't go to the gym. Are protein bars for me?", "Is the protein veg?", "Does the bar have sugar?", **"Who makes these bars I'm buying?"** | sticky bar |
| [05](phone-pdp-05.jpg)–[06](phone-pdp-06.jpg) | Proof | "Verified Reviews 4.7 out of 5 / Based on 431 reviews": named reviewers, dates, verified ticks, a 4-star review included | sticky bar |
| [06](phone-pdp-06.jpg)–[07](phone-pdp-07.jpg) | Pay, footer | Payment logos and "Oh! and Cash On Delivery too :)"; newsletter; footer | sticky bar |

**CTA position and repetition.** The sticky ADD TO CART / BUY NOW bar is on all 7 phone screens and
in the first 360 × 640 screen; the price is not in that first small screen (it sits under the gallery,
[small360-pdp-01](small360-pdp-01.jpg)). After a tap the bar turns into a quantity stepper plus
"GO TO CART" ([flow-03](phone-flow-03-after-add.jpg)).

## Trust devices
- **Exact, checkable facts**: ingredient percentages that sum to 100%, "no hidden * marks", a factory
  tour, an FSSC-certified facility, test reports and an "Unauthorized Sellers" page in the footer.
- An FAQ that asks the awkward question itself ("Who makes these bars I'm buying?").
- Verified, dated reviews including imperfect ones; press; unpaid celebrity fans, said plainly.
- Operational promises in the top strip ("Orders dispatched within 48-72 hours").

## Offers and guarantees
- One discount, auto-applied and explained ("using code CLEANEST (auto-applied)", "Discounts
  auto-applied in cart"); no countdowns.
- Free shipping threshold, a replacement and cancellation policy one tap from the buy box, and
  loyalty points.

## Product → cart → checkout (phone)
1. **ADD TO CART** → the bar shows a stepper and **GO TO CART** ([flow-03](phone-flow-03-after-add.jpg)).
2. **GO TO CART** → drawer "Your items (1 item)" ([flow-05](phone-flow-05-checkout-first-screen.jpg)):
   "You saved 15% on this order", a "REWARDS UNLOCKED! (Pick any one!)" cross-sell, "CLEANEST
   applied", **"Enter delivery pincode … Please add your pincode to continue"**, price summary,
   card logos, "100% secured payments", sticky "₹1,105 [CONTINUE]".
3. With the public pincode 560001: **"Yay! Your pincode is eligible for delivery. Saturday,
   17 October"** ([flow-06](phone-flow-06-cart-after-public-pincode.jpg)).
4. **CONTINUE** → "Address / Payment, Step 2/2" ([flow-07](phone-flow-07-checkout-first-screen.jpg),
   [08](phone-flow-08-checkout-scroll.jpg)): "LOGIN to checkout faster" (optional), Customer Info (Full
   Name, Mobile Number, Email Address), Address Info, then on the same page **"Select Payment Mode":
   Online Payment ("credit/debit card, net-banking, UPI, wallets"); "Pay ₹368 now, rest over 2 months"
   (0% interest EMIs); Cash on Delivery ("Pay in cash or pay in person at the time of delivery with
   GPay/PayTM/PhonePe")**; "Delivery by Saturday, 17 October"; sticky "PAY ₹1,105". **Stopped.**

Taps from product page to the first details screen: **3** (ADD TO CART, GO TO CART, CONTINUE), plus
the pincode. Guest checkout: no OTP or login wall, and every payment option is visible before any
detail is entered.

## India-specific patterns
- **Pincode delivery date** on the product page and required in the cart, with a named day.
- **COD** offered and advertised ("Oh! and Cash On Delivery too :)"), including paying by UPI app at
  the door.
- **0% EMI split** ("Pay ₹368 now, rest over 2 months") as a payment mode.
- UPI, Paytm, GPay and PhonePe logos; "MRP inclusive of all taxes".
- Dispatch window stated up front (48-72 hours). No WhatsApp link on the page (DOM check,
  2026-10-11).

## Motion on a phone
- **Elegant:** almost no motion; hand-drawn underlines and arrows are static; the sticky bar never
  animates.
- **Font swap:** in the scroll video the hero's sub-line paints in a fallback font, then switches
  to the monospace web font, and the block reflows (`phone-home-scroll.webm`, about seconds 6-7).
- **Slow:** the product page's largest paint is late on Lighthouse (below), and both pages score
  the lowest accessibility in this group (79).

Median of three runs, range in brackets.

| Lighthouse 13.4.1, mobile, 3 runs (2026-10-11 04:55-05:27 UTC) | Perf | LCP | TBT | CLS | Page weight | A11y |
|---|---|---|---|---|---|---|
| Home | 62 (56-71) | 5.7 s (4.3-6.1) | 350 ms (260-530) | 0.003 | 3,257-3,259 KiB | 79 |
| Product page | 47 (46-50) | 11.1 s (11.1-11.9) | 580 ms (500-630) | 0-0.003 | 3,450-3,461 KiB | 79 |

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** safety and privacy stated as exact, checkable facts in a "what's inside" block, the way
  TWT lists ingredients: what Kheelu listens for, where the voice goes, what it never asks a child,
  using only confirmed wording ([claims: confirmed](../../../../product/claims.md#1-confirmed-by-the-founder);
  [audience: needs](../../../../brand/audience.md#needs)).
- **Adopt:** an FAQ that asks the hard question itself ("Who makes these bars I'm buying?" becomes
  "Who makes Kheelu, and where does my child's voice go?"), answered from
  [facts](../../../../product/facts.md#what-it-listens-for-and-where-the-voice-goes).
- **Adapt:** operational promises in a thin top strip (TWT: dispatch window). Kheelona's is the ship
  date and the refundable token, rendered from the store's source ([pricing](../../../../product/pricing.md)).
- **Adapt:** showing where it is made (TWT's factory tour) only if the facts exist; origin is
  unconfirmed today ([claims §3.1](../../../../product/claims.md#31-origin-designed-and-built-here); F3).
- **Avoid:** a home first screen with no buy route; Kheelona's phone visitors decide on the first
  screen ([PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
- **Avoid:** advertising COD or EMI: Kheelona has no COD and only UPI is proven
  ([policies: payment methods](../../../../product/policies.md#payment-methods)).

**Most transferable lesson.** The Whole Truth turns trust into facts a buyer can check on the page
(ingredients to the percent, "no hidden * marks", test reports, "Who makes these bars I'm
buying?"); Kheelona's safety and privacy story should be told the same way, as specific confirmed
facts rather than reassurance.
