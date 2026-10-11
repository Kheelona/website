---
title: "Benchmark capture: KiwiCo (kiwico.com, US store)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.kiwico.com/ (home, phone and laptop, captured 2026-10-11 02:19-02:21 UTC, Indian connection)"
  - "https://www.kiwico.com/koala (product page, Koala Crate, ages 3-6; phone and laptop, captured 2026-10-11 02:20-02:21 UTC)"
  - "Product page → kiwico.com/get-started?storeId=25 (phone, captured 2026-10-11 02:26 UTC; stopped at the first screen asking for details)"
  - "Home and product page first screens at 360 × 640 (captured 2026-10-11 05:12 UTC, US connection)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-11 04:57 UTC, US connection"
---

# KiwiCo (kiwico.com, US store)

**Why it is here.** Kids / toy / ed-tech group, from the brief's starting set (brief §6, Market
Research). A subscription of hands-on STEM crates, one line per age band; the Koala Crate (ages 3 to 6)
overlaps Kheelona's 3 to 7.

**Store reached.** The US store in USD. The Indian connection was served USD prices, with an Indian flag
beside the "USD ($)" currency selector in the footer ([phone-pdp-12](phone-pdp-12.jpg)). Perks say "Free
shipping on any U.S. order".

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata. Phone 390 × 844 and laptop 1440 × 900 at 1x, scrolled viewport chunks, from an Indian
connection. Several images and videos had not painted when their screen was captured (noted below). The
360 × 640 first screens and Lighthouse came from a **US connection**, where the home hero did paint.

| Files | What |
|---|---|
| `phone-home-00..12.jpg` | Home, phone (8,305 px) |
| `phone-pdp-00..12.jpg` | Product page, Koala Crate, phone (8,855 px) |
| `laptop-home-00..10.jpg`, `laptop-pdp-00..10.jpg` | Laptop |
| `phone-flow-01..02.jpg` | Product page → first screen asking for details |
| `small360-{home,pdp}-00-first-load.jpg`, `-01.jpg` | 360 × 640 first screens (US connection) |
| `phone-home-scroll.webm` | Phone scroll of Home |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-first-load.jpg) | Hero | Sticky green promo bar "Start for $15 first crate (reg. $30) with code KIWICO15"; MENU, logo, search, cart. **The hero area is white**: its autoplaying video had not painted. A promo card ("Celebrate with us! Start for $15 first crate") at the foot; a floating "Get 40% off!" email pill | none | promo card |
| [small360-home-01](small360-home-01.jpg) | Hero, as painted (US connection) | "Tinker. Create. Innovate. Super fun, hands-on projects delivered every month."; a "KiwiCo turns 15" balloon | none | "Start exploring" |
| [02](phone-home-02.jpg) | Promos | "15 years calls for more fun! 15% OFF $49+ Store orders" with the code | Offer | Use code |
| [02](phone-home-02.jpg)–[03](phone-home-03.jpg) | How it works | "Fun & enriching projects for all ages": 1 Pick a subscription, 2 Receive a monthly crate, 3 Continue the fun | none | none |
| [03](phone-home-03.jpg)–[05](phone-home-05.jpg) | Lines by age | Eight crate cards, each led by its age band: "0–36 months" Panda, "Ages 3–6" Koala (Play & Learn), "Ages 6–9" Kiwi, … "Ages 12–100" Eureka; then "Shop by age" circles (images blank in capture) | Age bands | cards |
| [06](phone-home-06.jpg) | Inspire | "Designed to inspire" with topic tabs (playtime, physics, chemistry…) over videos (blank in capture) | none | none |
| [07](phone-home-07.jpg) | Mission and experts | "Every kid can be an innovator."; "Designed by experts: We're a team of real-life educators, engineers, and rocket scientists. We spend 1,000+ hours perfecting every single crate… Read about the University study on the educational value of our crates." | Expert team, study link | Learn more about our mission |
| [08](phone-home-08.jpg) | Scale | "Over 50 million crates delivered worldwide!" with stars "4.7 (49,836 reviews)" | Scale, rating | none |
| [09](phone-home-09.jpg) | FAQ | "How do KiwiCo subscriptions work and what is included?", **"Can I try a single crate before I commit to the subscription?"**, "What will my kids learn from KiwiCo crates?" | Objection FAQ | Help Center |
| [10](phone-home-10.jpg) | Close | "Getting started is easy!" 1 Pick your subscription, 2 Select your delivery plan, 3 Build your skills with every crate; "Pause, switch, or cancel anytime!"; email signup "get 40% off 1st crate*" | Cancel anytime | "Get started →" |
| [11](phone-home-11.jpg)–[12](phone-home-12.jpg) | Footer | Follower counts (188k, 960k, 1.3M, 349k, 141k); crate brands; "USD ($)" | Social counts | none |

**Headline formula.** Three verbs then the delivery promise ("Tinker. Create. Innovate. Super fun,
hands-on projects delivered every month."), with an anniversary badge. The site is age-routed: every
product card leads with its age band.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-pdp-00-first-load.jpg) | Hero | Video area (white at first paint); Koala Crate logo; **"Ages 3–6"**; H "Wonder meets wow."; "Discover the world around you through play." | "Get started →" (inside the 390 × 844 first screen) |
| [01](phone-pdp-01.jpg)–[02](phone-pdp-02.jpg) | What arrives | "Every month, explore a new theme": a theme each month, hands-on toys and builds, a storybook ("join Kellan & friends") | "Get started →" with **"delivered monthly \| cancel anytime ⓘ"** under it, and "Give it as a gift →" |
| [03](phone-pdp-03.jpg) | Examples | "Check out some examples! Each crate dives into a new theme": video cards (Butterflies and Caterpillars, My Body and Me, Dinosaur Dig, a "Coming soon" card) | none |
| [04](phone-pdp-04.jpg) | FAQ | "What is Koala Crate?", "How often will my child receive a crate?", "What skills does my child develop with Koala Crate?" | "Get started →" + the same micro-line |
| [05](phone-pdp-05.jpg) | Perks and steps | "Get member perks with Koala Crate": Free shipping on any U.S. order, Bonus content, 10% off every order, Early access; "Getting started is easy!" 3 steps; "Pause, switch, or cancel anytime!" | "Get started →" |
| [06](phone-pdp-06.jpg) | Cross-sell | "Get started →" again, then "You might also like": Panda (0–36 months), Kiwi (6–9) | cards |
| [07](phone-pdp-07.jpg)–[08](phone-pdp-08.jpg) | Mission | As on Home, with the university study link | none |
| [08](phone-pdp-08.jpg)–[10](phone-pdp-10.jpg) | Reviews | "4.7, 9,381 reviews" with a distribution (72%, 23%, 3%, 1%, 1%); review cards with verified ticks, illustrated avatars, first name plus initial; pagination | none |
| [11](phone-pdp-11.jpg)–[12](phone-pdp-12.jpg) | Footer | Email offer ("*exclusions apply"), link groups, currency | none |

**CTA position and repetition.** One label, "Get started →", four times inline (first screen,
[02](phone-pdp-02.jpg), [04](phone-pdp-04.jpg), [06](phone-pdp-06.jpg)), with the same micro-line
under it: "delivered monthly | cancel anytime". **No sticky buy bar**: the sticky elements are
the promo bar at the top and the "Get 40% off!" email pill at the bottom left. At **360 × 640** the
product page's first screen shows the photo, logo, "Ages 3–6" and the headline but no CTA
([small360-pdp-01](small360-pdp-01.jpg)); on Home, "Start exploring" is inside it
([small360-home-01](small360-home-01.jpg)).

## Trust devices
- A reassurance micro-line under every CTA ("delivered monthly | cancel anytime").
- Ratings with large counts and a visible distribution; "Over 50 million crates delivered".
- An expert team and a linked university study on educational value.
- An FAQ that offers a lower-commitment path ("Can I try a single crate before I commit…?").

## Offers and guarantees
- Several offers at once: "$15 first crate (reg. $30)" with a code in a sticky bar, "Get 40% off!" for
  an email, "15% OFF $49+ Store orders", and member perks (10% off every order, free US shipping).
- The guarantee is flexibility rather than returns: "Pause, switch, or cancel anytime!"

## Product → cart → checkout (phone, 2026-10-11)
1. "Get started →" on the product page goes straight to a guided sign-up with a progress bar and a back
   arrow ([flow-02](phone-flow-02-first-personal-details-screen.jpg)): **"Who is this for? This is who
   we'll address the crates to!"** with "Child's first name*" and "Child's last name*", "Continue →",
   and "Buying for multiple children? You'll be able to add them later!" This is the first screen asking
   for personal details. **Stopped here.** The page's markup already held the next step, an add-on offer
   ("Extend the fun & learning!": books, Plus products, "No thanks").

Taps from product page to the first details screen: 1. There is no cart step before the sign-up.

## India-specific patterns
- None. USD shown to an Indian connection; no COD, UPI, EMI or WhatsApp. Perks are US-only.

## Motion on a phone
- **Slow:** the hero is an autoplaying, muted, looping video, and at our capture times the first phone
  screen showed only the promo bar and a white area ([phone-home-00](phone-home-00-first-load.jpg),
  [phone-pdp-00](phone-pdp-00-first-load.jpg)); lazy images and the topic videos were also blank when
  scrolled to ([phone-home-05](phone-home-05.jpg), [06](phone-home-06.jpg)).
- **Calm otherwise:** the scripted scroll recorded no running CSS animations, the topic videos do not
  autoplay, and no `prefers-reduced-motion` rules were found in its readable CSS
  (`phone-home-scroll.webm`).
- **Persistent overlays:** the email pill stays over the bottom left of every screen.

| Lighthouse 13.4.1, mobile, one run (2026-10-11, US connection) | Perf | A11y | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|
| Home | 42 | 83 | 6.1 s | 1,580 ms | 0.061 | 14,251 KiB |
| Product page (LCP element: a heading) | 60 | 86 | 3.0 s | 1,560 ms | 0.061 | 14,756 KiB |

## Laptop (1440 × 900)
Nav: Subscriptions, Ages, Gifting, Education, a search box, "USD", Sign in. The home hero is white at
first paint as on the phone ([laptop-home-00](laptop-home-00-first-load.jpg)); the product page hero is
split, with "Ages 3–6", the headline and "Get started →" on the right ([laptop-pdp-00](laptop-pdp-00-first-load.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** the same one-line reassurance under every CTA. For Kheelona: "refundable until we ship" and
  the delivery date for new orders ([D023](../../../../decisions/D023-new-order-delivery.md): "Deliveries start mid-November", one content value), token
  mode only ([messaging: objection answers](../../../../brand/messaging.md#objection-answers); G1 in
  [open questions](../../../../open-questions.md)). Brief §9.1.
- **Adopt:** a three-step "how buying works" block near the CTA: reserve with ₹499, pay the ₹4,500
  balance before dispatch, Kheelu arrives ([pricing](../../../../product/pricing.md),
  [checkout](../../../../site/checkout.md)). It answers the store-page doubts in
  [PostHog audit §8, issue 4](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact).
- **Adapt:** the age band as the first thing above the product headline ("Ages 3–6"); Kheelona's "ages
  3+" or "3 to 7" from the age review ([age band review](../../../../product/age-band-review.md); brief
  §9.8, the age band everywhere).
- **Adapt:** a linked study beside an educational claim, only in the form the guardrails allow
  ([messaging: claims guardrails](../../../../brand/messaging.md#claims-guardrails)).
- **Avoid:** several codes and discounts at once; Kheelona has one offer ([pricing](../../../../product/pricing.md)).
- **Avoid:** a video hero that leaves the first phone screen blank, and no sticky CTA on the product page
  (brief §9.11; PostHog audit §8, issues 1 and 5).

**Most transferable lesson.** KiwiCo puts the same small reassurance ("delivered monthly | cancel
anytime") directly under every "Get started" button; Kheelona can put "₹499, refundable until we ship"
under every pre-order button so the risk answer travels with the action.
