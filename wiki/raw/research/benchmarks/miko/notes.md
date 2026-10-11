---
title: "Benchmark capture: Miko India (in.miko.ai)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://in.miko.ai/ (home, captured 2026-10-10)"
  - "https://in.miko.ai/products/miko-mini (product page, captured 2026-10-10)"
  - "https://in.miko.ai/cart and the Shopify checkout it opens (captured 2026-10-10; stopped at the first form)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# Miko India (in.miko.ai)

**Why it is here.** An AI companion robot that SKM's positioning names as a competitor
([positioning: competitors named](../../../../brand/positioning.md#competitors-named)). Kids / toy /
ed-tech group. Competitors are never named in public copy (same section).

**How it was captured (2026-10-10).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent,
`en-IN`, Asia/Kolkata, from an Indian connection. Phone 390 × 844 and 360 × 640, laptop 1440 × 900,
all at 1x, as scrolled viewport chunks (one per screen height). `*-00-landed` is the first screen
before any popup was closed. Text and positions were read from the live DOM at each chunk; prices and
quotes below are copied from the page, not retyped from images.

| Files | What |
|---|---|
| `phone-home-00..14.jpg` | Home, phone (11,148 px tall, 14 screens) |
| `phone-product-00..18.jpg` | Product page (Miko Mini), phone (14,490 px, 18 screens) |
| `small360-{home,product}-*.jpg` | First screen at 360 × 640 |
| `laptop-home-00..12.jpg`, `laptop-product-00..14.jpg` | Laptop; the home footer is past chunk 12 and was not captured |
| `phone-cart-01..06.jpg` | Add to cart → cart → first checkout screen |
| `phone-home-scroll.webm` | 15 s phone scroll of Home (1.3 MB), to show the scroll-pinned robot |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg), [01](phone-home-01.jpg) | Hook | Autoplaying, muted hero video carousel. "Meet Miko / Ridiculously Smart. Seriously Fun." over a child with the robot; a second slide shows parents | none | No button in the hero. A **sticky bottom bar from first paint**: "Miko Mini · ~~Rs. 16,999~~ Rs. 13,999 · Add To Cart" |
| [02](phone-home-02.jpg) | Social proof | "Loved by the kids": a row of creator videos with play buttons | Influencer videos | sticky bar |
| [02](phone-home-02.jpg)–[05](phone-home-05.jpg) | Benefits | Four "quotients": Intelligent, Emotional, Social, Physical, one line each ("Helps kids with problem solving abilities, critical thinking and analyzing power"). A robot image is pinned while the page scrolls and slides over the text | none | sticky bar |
| [06](phone-home-06.jpg) | Product card | "Miko Mini / AI powered conversational learning robot for kids that is small in size but big on personality." Price, "Learn More" + "Add to cart"; a rotating "Bestseller" ring | Bestseller badge | inline Add to cart |
| [06](phone-home-06.jpg)–[07](phone-home-07.jpg) | Safety | "Serious about your family's security: A closed system with enhanced encryption…" and a kidSAFE+ COPPA seal | Certification seal | none |
| [07](phone-home-07.jpg) | Press | "Everybody's talking about Miko": logo wall (Disney Accelerator, Yahoo!, Entrepreneur India…) | Press logos | none |
| [08](phone-home-08.jpg) | Upsell | "Power up your Miko experience with Miko Max": video with licensed cartoon characters | Licensed brands | "Discover Max" |
| [08](phone-home-08.jpg) | UGC | "Kids have fun with Miko Mini": tabs Kids / Influencers, quote cards with handles | Influencer quotes | none |
| [09](phone-home-09.jpg)–[11](phone-home-11.jpg) | Parent reassurance | "Artificial Intelligence and Privacy": Useful for Parents, Better Parenting Tools, "Safe, Secure & Private: kidSAFE+ COPPA certified device…" | Certification claim | none |
| [11](phone-home-11.jpg)–[12](phone-home-12.jpg) | Brand / CSR | "5,000 Mikos donated to kids in need · 500k people empowered by technology · 2030 year to achieve carbon neutrality" (no source on the page) | Numbers | none |
| [12](phone-home-12.jpg)–[14](phone-home-14.jpg) | Footer | Policies, Track Order, Retailers (Amazon, Hamleys), "Miko Mini vs Miko 3", INR selector | Retail presence | sticky bar |

**Headline formula.** Brand name plus a two-beat adjective rhythm ("Ridiculously Smart. Seriously
Fun."). No audience, no outcome and no price in the hero; the price and the CTA live in the sticky bar.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product-01.jpg) | Buy box, top | Sticky header with in-page tabs "Overview · Specification · Conversation · Features · Miko Max · Testimonial · FAQs"; gallery; "Miko Mini"; "4.8 · 500+ Ratings"; ~~Rs. 16,999.00~~ Rs. 13,999.00 "Sale"; "Shipping calculated at checkout." | sticky bar |
| [02](phone-product-02.jpg) | Buy box, rest | Four icon bullets; "Miko Mini is bundled with a 2-year Miko Max subscription, offering access to premium content from Disney, Paramount…"; colour (Purple, Blue); **"Add To Cart" (outline) + "Buy Now" (filled)**; a four-icon trust row right under them: "1 Year Warranty · 30 days Money Back Guarantee · 24/7 Customer Support · 30 Days Hassle Free Return" | inline pair |
| [03](phone-product-03.jpg) | Hardware | "Hardware Built for Worry-Free Playtime", "Advanced Sensors for Responsive Playtime" | sticky bar |
| [03](phone-product-03.jpg)–[04](phone-product-04.jpg) | Demo of talk | "Nurturing the Young Minds, With More Conversations & Endless Fun!": chips of questions a child might ask ("Why should I listen to my parents?", "How should I deal with a bully?") with a "Click me" pointing hand | sticky bar |
| [04](phone-product-04.jpg)–[07](phone-product-07.jpg) | Features | "Game for Anything", "Study Buddy: Friendly AI that creates personalized plans for reading, writing…", "Simply Secure", "Parents in Control" | "Learn More" |
| [08](phone-product-08.jpg)–[09](phone-product-09.jpg) | Personality | "More Expressions, More Personality… it becomes a cherished companion" (pinned section) | sticky bar |
| [10](phone-product-10.jpg)–[11](phone-product-11.jpg) | Subscription | Free vs Max table, "Max Users: Starting at $8.25/month" (US dollars on the INR store) | "Subscribe Now" |
| [11](phone-product-11.jpg)–[13](phone-product-13.jpg) | Parent zone | Parent app: learning plans, progress reports, screen-time balance, "kidSAFE+ COPPA certified platform" | sticky bar |
| [13](phone-product-13.jpg) | UGC | Influencer quotes with follower counts ("@onecolorfulmom 62.1K Followers: 'Miko is my best friend.'") | sticky bar |
| [14](phone-product-14.jpg)–[15](phone-product-15.jpg) | Outcomes | "Over a three-month period, kids who actively used Miko experienced: 46%+ in physical activity, 55%+ in speaking proficiency, 55%+ engagement with academic activities". No study, sample or source is given on the page | sticky bar |
| [16](phone-product-16.jpg) | FAQ | Six questions (size and weight, battery life, how it works, set-up, who to speak to, Mini vs Miko 3) + "More FAQs" | sticky bar |

**CTA position and repetition.** Home: the sticky bar is on all 14 phone screens; one inline "Add to
cart". Product page: the sticky bar is on all 18 screens; the inline pair appears once. Same label
("Add To Cart") everywhere; "Buy Now" only in the buy box. At **360 × 640** the sticky bar (price and
"Add To Cart") is inside the first screen on both pages ([home](small360-home-01.jpg),
[product](small360-product-01.jpg)).

## Trust devices
- Rating and count at the top of the product page ("4.8 · 500+ Ratings").
- kidSAFE+ COPPA seal and wording, repeated on Home and the product page.
- Press logo wall; influencer quotes with follower counts; retailers (Amazon, Hamleys) in the footer.
- A warranty, guarantee, support and returns row **directly under the buy buttons**.

## Offers and guarantees
- Strike-through price with a "Sale" chip, the same pair in the sticky bar.
- Included value framed as a bundle: "a 2-year Miko Max subscription".
- Guarantees as four short icon labels; the policy text sits behind footer links.

## Product → cart → checkout (phone, 2026-10-10)
1. "Add To Cart" on the product page: no drawer; the header cart icon shows "1" ([cart-01](phone-cart-01-after-add.jpg)).
2. Cart page ([cart-02](phone-cart-02-cart.jpg)): line item, quantity stepper, "Estimated total Rs. 13,999.00 / Taxes, Discounts and shipping calculated at checkout", black "Check out" button.
3. Shopify checkout ([cart-05](phone-cart-05-checkout-first-screen.jpg), [cart-06](phone-cart-06-checkout-scroll1.jpg)): "Order summary ₹13,999.00", Contact (Email, "Sign in"), Delivery (name, address, city, state, PIN code, phone), "Shipping method: Enter your shipping address to view available shipping methods." **Stopped here.**

Taps from product page to the first details screen: 3 (Add To Cart, cart icon, Check out).

## India-specific patterns
- PIN code appears only inside checkout; no delivery estimate by pincode on the product page.
- No COD, UPI, EMI or WhatsApp support shown on the product page, the cart or the first checkout
  screen. Payment methods are not visible before an address is entered.
- Prices are written "Rs." on the site and "₹" in checkout.

## Motion on a phone
- **Gimmicky:** a robot image pinned during scroll slides over the "quotient" copy and hides it
  ([03](phone-home-03.jpg), [04](phone-home-04.jpg), `phone-home-scroll.webm`).
- **Heavy:** four autoplaying, muted, looping videos on Home; the hero video was the LCP element in our capture.
  The first screen changed between t = 0 and t = 3 s (hero carousel).
- **Small loops:** a rotating "Bestseller" ring; a pointing-hand "Click me" loop and 14 pulse loops on the
  product page (GSAP is loaded there).
- **Elegant:** the sticky bar is static and never animates in, so it is always there to tap.

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home | 31 | 11.4 s | 270 ms | 0.569 | 17,368 KiB |
| Product page (run warned the page loaded too slowly to finish) | 59 | 6.0 s | 20 ms | 0 | 7,555 KiB |

## Laptop (1440 × 900)
Same sections. The hero is full-width video; the sticky bar runs full width with a product thumbnail
([laptop-home-00](laptop-home-00-landed.jpg)). The product page is two columns, buy box on the right,
trust icons under the buttons, in-page tab bar ([laptop-product-01](laptop-product-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** a sticky bottom bar with name, price and the one CTA label from first paint on Home and the
  product page. Tied to brief §9.1 and §9.10 and to [PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  (sticky elements gave 22 of 29 phone taps to the store).
- **Adopt:** the trust row directly under the buy button, using only confirmed terms
  ([policies](../../../../product/policies.md); returns and warranty are still open, F1 in
  [open questions](../../../../open-questions.md)). Brief §9.1.
- **Adapt:** the "questions a child might ask" chips, reversed: show the questions Kheelu asks the
  child ("It asks. They think.", [positioning: in one line](../../../../brand/positioning.md#in-one-line)).
- **Avoid:** "cherished companion" and "best friend" framing ([messaging: against the alternatives](../../../../brand/messaging.md#against-the-alternatives): "A toy, not a friend").
- **Avoid:** outcome percentages with no study on the page ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails); brief §4.2).
- **Avoid:** scroll-pinned decoration that covers copy, and autoplay video as the hero on phones
  (brief §9.11, §9.5; [PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) issue 8, phone INP).
- **Avoid:** a second currency on an Indian page (the $8.25/month subscription line).

**Most transferable lesson.** The sticky bar does the selling: name, struck and current price and
"Add To Cart" sit in the first 360 × 640 screen of both Home and the product page, even though the
hero itself has no button.
