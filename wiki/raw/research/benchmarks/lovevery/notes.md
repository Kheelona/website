---
title: "Benchmark capture: Lovevery (lovevery.com, US store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://lovevery.com/ (home, phone and laptop, captured 2026-10-11 02:25-02:27 UTC, Indian connection; a second hero variant on the earlier pass the same night)"
  - "https://lovevery.com/products/the-play-kits/3-year-old (product page, served as /en-US/products/the-play-kits/3-year-old; phone and laptop, captured 2026-10-11 02:26-02:28 UTC)"
  - "Product page → kit selection → plan → cart → lovevery.com/checkout/information (phone, captured 2026-10-11 03:00 UTC; stopped at the first form)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:15-05:17 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:54-04:55 UTC, US connection"
---

# Lovevery (lovevery.com, US store)

**Why it is here.** Kids / toy / ed-tech group, from the brief's starting set (brief §6, Market
Research). It sells child development by age stage to the same buyer as Kheelona (an intentional parent),
which makes its framing and its claims the closest to Kheelona's positioning.

**Store reached.** US store in USD (region selector "United States"). Nothing India-specific.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, scrolled viewport chunks, from an Indian
connection. **Two hero variants** appeared minutes apart: `phone-home-variant-a-first-load.jpg`
("Experience the joy of learning through play") and the one in `phone-home-00..11.jpg` ("Raise curious,
capable kids with Lovevery"). The 360 × 640 first screens and Lighthouse came from a **US connection**.

| Files | What |
|---|---|
| `phone-home-00..11.jpg` | Home, phone, variant "Raise curious, capable kids" (7,942 px) |
| `phone-home-variant-a-first-load.jpg` | Home first screen, the other variant |
| `phone-pdp-00..09.jpg` | Product page, The Play Kits for 3-year-olds, phone (6,559 px) |
| `laptop-home-00..08.jpg`, `laptop-pdp-00..07.jpg` | Laptop |
| `phone-flow-01..12.jpg` | Get Started → kit → plan → cart → first checkout screen |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens, before and after closing the email popup (US connection) |
| `phone-home-scroll.webm` | Phone scroll of Home |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | Hero | Promo bar "Free Lovevery x Ergobaby Wrap for new Play Kits subscribers! Terms apply."; photo of a baby with a wooden ladybug; five stars and **"4.9/5 from 21K+ happy families" above the H1**; H1 "Raise curious, capable kids with Lovevery"; "The Play Kits make it easy to learn & grow."; "Shop by your child's age" chips (0-12 months, 1 year, 2 year, 3 year, 4 year) | Rating and count | "Explore The Play Kits" |
| [variant](phone-home-variant-a-first-load.jpg) | Hero (other variant) | Same photo; H "Experience the joy of learning through play"; then "Explore The Play Kits by Age" with round photo tiles | none | "Explore The Play Kits" |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | What you get | "Our award-winning Play Kits include: Playthings and books delivered every 2-3 months; The Play Guide…; Week-by-week developmental tips and activity ideas" | "award-winning" | header button |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Problem | A video still of a search box typing "What does a 6 month old baby play…" | Relatable moment | none |
| [04](phone-home-04.jpg)–[05](phone-home-05.jpg) | Chooser inline | "Choose Your Starting Play Kit / Select age:" tabs, month chips, a kit card ("The Looker Play Kit … helps them build new brain connections…") | none | "Continue" (grey until a kit is chosen) |
| [05](phone-home-05.jpg)–[06](phone-home-06.jpg) | Real families | "See How Real Families Play": customer video thumbnails with a pause control | Customer videos | none |
| [06](phone-home-06.jpg) | Stakes | "Invest now for the greatest impact on your child's future" and **"90% Ninety percent of your child's physical brain growth occurs by age 5."** No source is visible on the screen | Unsourced statistic | none |
| [07](phone-home-07.jpg) | Quality | "We're obsessed with building the best.": "Built for safety and tested through hundreds of hours of play studies", "Proven in the real world with millions of families", "Made with the premium, natural materials you would choose for your child" | Claims | "Explore The Play Kits" |
| [08](phone-home-08.jpg) | Lead capture | "We did all the research so you don't have to": email plus the child's birth date or due date (optional) | none | Sign Up |
| [09](phone-home-09.jpg)–[11](phone-home-11.jpg) | Footer | Reviews, Skills & Stages, Patents, Product Recalls, registries (Babylist, Amazon, Target), podcast, app, region | Patents, recalls page | none |

**Headline formula.** The parent's goal for the child, then the brand ("Raise curious, capable kids
with Lovevery"), with the proof (rating and count) placed above the headline. Lovevery was testing it
against an experience-led line at capture time.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg) | Hero | Photo of a girl playing; eyebrow "THE PLAY KITS FOR 3-YEAR-OLDS"; H1 "Discover the power of *I did it*" (the child's own words, in italics); "You can introduce learning … that will strengthen your bond and increase your child's confidence." | none in the first screen |
| [00](phone-pdp-00-first-load.jpg)–[02](phone-pdp-02.jpg) | Offer strip and kits | "Explore The Play Kits for 3-Year-Olds"; **"Easy 30-day returns \| Skip or cancel any time \| $132 per kit delivered every 3 months"**; four kits by month ("Months 37, 38, 39+ The Observer Play Kit", Storyteller, Problem Solver, Analyst) | kit cards |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Included | "Included with each Kit: The Play Guide. Essential guidance for supporting your child's development with ways to play and expert tips." | header button |
| [03](phone-pdp-03.jpg)–[04](phone-pdp-04.jpg) | Subscriber value | "Play Kit subscribers get the best of Lovevery": early access, a subscriber shop, "Tools to make parenting easier" | header button |
| [04](phone-pdp-04.jpg)–[05](phone-pdp-05.jpg) | How it works | "Find your starting Play Kit / Unbox, play, grow / Learn with your child" | header button |
| [05](phone-pdp-05.jpg) | Objection FAQ | "Why are The Play Kits a subscription?" (developmental windows), "How can I get a discount on The Play Kits?" ("You can save 5% on all Play Kits when you prepay…"), "Why can't I buy just one item from a Play Kit?" ("There are toy companies, and there are child development companies…") | header button |
| [06](phone-pdp-06.jpg)–[09](phone-pdp-09.jpg) | Lead capture, footer | Same as Home | header button |

No reviews and no buy box on this page: the price appears once, in the offer strip, and the purchase
happens in a separate chooser.

**CTA position and repetition.** The phone header gains a "Get Started" button once the hero scrolls
away ([flow-02](phone-flow-02-pdp-scrolled-sticky-cta.jpg)); there is no sticky bottom bar. A chat button
sits bottom right on every screen. At **360 × 640** the product page's first screen has no visible CTA,
and a floating "GET 10% OFF" tab and the chat button sit over the copy ([small360-pdp-01](small360-pdp-01.jpg));
on Home the "Explore The Play Kits" button is cut by the fold ([small360-home-01](small360-home-01.jpg)).
On first load the US connection got a full-screen popup asking for email and the child's date of birth
for 10% off ([small360-home-00](small360-home-00-first-load.jpg)).

## Trust devices
- Rating and count above the headline; "award-winning"; "millions of families"; patents and a product
  recalls page in the footer.
- The policy strip "Easy 30-day returns | Skip or cancel any time" next to the price.
- An FAQ that defends the business model in the parent's words ("Why can't I buy just one item?").
- A chat button on every page.

## Offers and guarantees
- A free gift for new subscribers (the Ergobaby wrap), added to the cart automatically.
- Prepay plans: on the plan step "$132 per Play Kit, Pay when each Play Kit ships" / **"Most popular:
  $114 … extra 13% off when you prepay for 3 kits" (pre-selected)** / "Best deal: $108 … extra 18% off
  when you prepay for 4 kits"; "Cancel or skip any time. Easy returns."; "Plans automatically renew."
- **The "Book Bundles $20/Kit" add-on is ticked by default** on the plan step, and arrives in the cart as
  "$60" ([flow-06](phone-flow-06-plan-options-scroll1.jpg), [flow-08](phone-flow-08-after-continue.jpg)).

## Product → cart → checkout (phone, 2026-10-11)
1. "Get Started" (header) → "Choose Your Starting Play Kit" ([flow-03](phone-flow-03-kit-selection.jpg)):
   age tabs, the 3-year-old's months pre-selected, kit carousel, Continue.
2. Continue → "Choose Your Subscription Plan" ([flow-05](phone-flow-05-after-continue.jpg)–[07](phone-flow-07-plan-options-scroll2.jpg)),
   as above, Continue.
3. Continue → "Your Cart (2)" ([flow-08](phone-flow-08-after-continue.jpg)–[09](phone-flow-09-cart-scroll1.jpg)):
   free wrap "FREE"; "The Observer Play Kit, 3-Kit Prepay, 37-45 months, $396 struck, $342"; "Book Bundle
   Add-On $60"; "Shipment schedule (3 kits)"; "You may also like"; "Shipping & taxes calculated at
   checkout, Subtotal $402.00"; "Continue to Checkout"; the auto-renew terms under the button.
4. Continue to Checkout → "Secure checkout" ([flow-10](phone-flow-10-after-continue-to-checkout.jpg)–[12](phone-flow-12-checkout-scroll2.jpg)):
   order summary; Express Checkout (PayPal); Customer Information (email); Shipping Address (country
   preset to Canada in our capture); "Add a gift message"; "Discount codes and gift cards can be applied in
   the next step"; "Continue to Shipping & Payment"; "Need help? Contact us". **Stopped here.**

Taps from product page to the first details screen: 4 (Get Started, Continue, Continue, Continue to
Checkout).

## India-specific patterns
- None. USD only, no COD, UPI, EMI or WhatsApp; support is the chat widget. Registries and "Education
  Savings Accounts" in the footer are US patterns.

## Motion on a phone
- **Calm:** no autoplay video on Home and no carousel library; CSS transitions of 700 ms (opacity,
  transform) in the scripted scroll (`phone-home-scroll.webm`); `prefers-reduced-motion` rules are
  present.
- **Slow and unstable:** both pages are very heavy, and the product page shifts badly as it loads (CLS
  below). Lighthouse warned that both pages loaded too slowly to finish.
- **Popups:** an email popup on first load, then a floating offer tab and a chat button that stay on
  screen.

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home (run warned the page loaded too slowly to finish) | 20 | 97 | 8.0 s | 3,420 ms | 0.197 | 35,860 KiB |
| Product page (same warning) | 14 | 97 | 9.7 s | 1,190 ms | 0.92 | 9,330 KiB |

## Laptop (1440 × 900)
Nav: Shop by Age, Shop by Category, Parenting, Gifting. The hero places stars, H1 and the button over
the photo ([laptop-home-00](laptop-home-00-first-load.jpg)). On the product page the "Get Started"
header button appears only after scrolling ([laptop-pdp-00](laptop-pdp-00-first-load.jpg),
[laptop-pdp-02](laptop-pdp-02.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** name the child's age on the page and speak to that stage. Kheelona's audience is 3 to 7 and
  "Is it right for my 3-year-old?" is an open objection ([audience: objections](../../../../brand/audience.md#objections));
  stage-specific content needs advisor sign-off (F9, G5 in [open questions](../../../../open-questions.md)).
- **Adopt:** an FAQ that answers the model in the parent's words. For Kheelona: "Why a ₹499 token?",
  "Why ₹4,999?" ([messaging: objection answers](../../../../brand/messaging.md#objection-answers)). Brief
  §9.1 (objection FAQ near the CTA).
- **Adopt:** the policy strip beside the price, with Kheelona's confirmed terms only: "7-day returns, no
  questions asked · 6-month warranty" ([D021](../../../../decisions/D021-returns-policy.md), [D022](../../../../decisions/D022-warranty-replacement-refund.md)) and the price from [pricing](../../../../product/pricing.md).
- **Adapt:** a headline in the child's own voice ("Discover the power of *I did it*"); Kheelona's line
  "It asks. They think." does the same ([positioning: in one line](../../../../brand/positioning.md#in-one-line)).
- **Avoid:** the "90% of brain growth by age 5" stake with no source on the screen; Kheelona may use the
  NEP 2020 figure only with its source and pending R6 ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails)).
- **Avoid:** pre-ticked add-ons and a pre-selected larger plan (brief §4.4; brief §9.1, nothing adds
  friction inside the checkout).
- **Avoid:** a product page with no CTA in the first phone screen and no sticky bar
  ([PostHog audit §8, issue 5](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)),
  and a 35 MB page (brief §9.5).

**Most transferable lesson.** Lovevery's product page opens with the child's age and the child's own
words ("The Play Kits for 3-year-olds: Discover the power of *I did it*"), then answers the questions
its business model raises in an FAQ; Kheelona can open its product page on the 3-to-7 child and answer
"why a token, why ₹4,999" the same way.
