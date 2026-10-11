---
title: "Benchmark capture: MyWonder (mywonder.in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://mywonder.in/ (home, captured 2026-10-10)"
  - "https://mywonder.in/pages/my-wonder-companion (product page, the target of every hero slide and 'Order Now'; captured 2026-10-10)"
  - "https://mywonder.in/cart and the Razorpay Magic Checkout it opens (captured 2026-10-10; stopped at the first field)"
  - "https://mywonder.in/policies/shipping-policy and https://mywonder.in/policies/refund-policy (GET, 2026-10-10)"
  - "https://mywonder.in/ raw HTML (GET, 2026-10-10): hero slide links and alt text, sticky button markup, 'Assist Me' link"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# MyWonder (mywonder.in)

**Why it is here.** SKM's positioning names MyWonder as the closest rival ("Speak, Listen, Learn"),
an AI companion at a price near Kheelu's ([positioning: competitors named](../../../../brand/positioning.md#competitors-named)).
Kids / toy / ed-tech group, Indian (Bengaluru venues on the site). Competitors are never named in
public copy (same section). Everything below is INTERNAL competitor intelligence
([content boundary](../../../../site/content-boundary.md)).

**How it was captured (2026-10-10, machine time; 2026-10-11 02:16 to 03:07 UTC).** Playwright 1.58.2
(Chromium 145), Android Chrome user agent, `en-IN`, Asia/Kolkata. Phone 390 × 844 and 360 × 640,
laptop 1440 × 900, all at 1x, as scrolled viewport chunks. `*-00-landed` is the first screen before
the site's "sotp" popup was closed (closed on every profile; it was not captured open). Text, prices
and positions were read from the live DOM at each chunk; quotes are copied from the page. Nothing
was typed anywhere.

| Files | What |
|---|---|
| `phone-home-00..12.jpg` | Home, phone (9,315 px, 13 screens) |
| `phone-product-00..08.jpg` | Product page "MyWonder Mega Starter Pack (Launch offer)", phone (6,348 px) |
| `small360-{home,product}-*.jpg` | First screen at 360 × 640 |
| `laptop-home-00..10.jpg`, `laptop-product-00..07.jpg` | Laptop |
| `phone-cart-01..04.jpg` | "Order Now" → Razorpay Magic Checkout; and the `/cart` page → its "Checkout" |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg), [01](phone-home-01.jpg) | Hook | A scrolling yellow announcement ticker: "Bengaluru residents - MyWonder is now available for trial and purchase at Param Science Exhibition Center & Coro Space Domlur". A two-slide auto-advancing hero carousel whose **headline, sub-points and "Order Now" button are drawn into the image** (both slide images have empty `alt`). Slide 1: "Develops Critical Thinking / Screen-Free / Builds Skills / Grows with child" over the yellow cube device. Slide 2: "Safe learning companion parents trust" over a mother and son, with "(Batch 1, 2 Sold Out. Batch 3 selling fast)" | "As Seen On Shark Tank India Season 5" badge; a round "Safe for Children" seal (no issuing body named) | The whole slide links to the product page. A floating **"Shop with AI"** pill and a **WhatsApp** button sit bottom right from first paint |
| [01](phone-home-01.jpg)–[02](phone-home-02.jpg) | Benefits | "Why Parents Choose MyWonder? Learning, Play & Growth": a looping video of a girl with a "Hi Wonder!" bubble; four colour-keyed lines: "Healthy Screen-Free Engagement", "Encourages Exploration & Imagination", "Listens, Responds and Grows", "Full Parental Control" | none | floats |
| [03](phone-home-03.jpg) | Demo | Autoplaying muted close-up video of the device; "Learn From Safe & Intelligent AI Companions. Speak - Listen - Learn" | none | **Sticky bottom bar appears**: thumbnail, "Launch Offer @ ₹5499 (Limited Units) / Includes MyWonderpod & 10 Learning Cards worth MRP ₹8,999." + "Order Now" |
| [03](phone-home-03.jpg)–[04](phone-home-04.jpg) | Content | Character cards, each with "Play Audio": "Astro The Explorer AI Companion: Learn about Space", "Riddles AI Companion", "Word Ladder AI Game: Improve Vocabulary", "The Wonder Lab AI Game: Imagine & Create" | Audio samples | "Learn More" |
| [04](phone-home-04.jpg)–[06](phone-home-06.jpg) | Content library | "Listen to 1000+ Hours of Audio From World's Best Publishers" (publisher logo row, e.g. hachette India); "Explore World of Audio for Growing Minds" with "Play Audio" cards | Publisher logos | "Learn More" |
| [06](phone-home-06.jpg) | Outcome | "Families Love MyWonder / Safe, Personal & Adaptive": LEARN, PLAY, GROW photo cards ("Sharpens Thinking, Boosts Creativity & more") | none | sticky bar |
| [07](phone-home-07.jpg) | Parent app | "Real time insights for Parents": an app mock-up ("10hr spent this week", interests by topic); "Activity Monitor \| Content Library \| Notifications \| Input Context" | App screenshot | sticky bar |
| [07](phone-home-07.jpg)–[08](phone-home-08.jpg) | Hear it | "Kids love MyWonder. Don't Miss This!": photo cards "Playing Quiz", "Solving Math", "Sharing Jokes", each with a play button and a waveform | Clips of children using it | sticky bar |
| [08](phone-home-08.jpg) | Backers | "MyWonder is backed by Antler. Google for Startups AI India Accelerator 2025 Alumni." with logos | Investor and accelerator logos | sticky bar |
| [09](phone-home-09.jpg) | Help | Instagram reel grid; "Need Assistance? Talk To Us" | none | **"Assist Me"** (opens a WhatsApp chat, `wa.me` link) |
| [09](phone-home-09.jpg)–[10](phone-home-10.jpg) | FAQ | "Questions?": "How does MyWonder work?" (open), "What makes MyWonder different from other toys?", "Is MyWonder safe for my child?", "How does MyWonder support a growing child?" | none | sticky bar |
| [10](phone-home-10.jpg)–[12](phone-home-12.jpg) | Footer | "curiosity is…" graphic; Help (Influencers, Retailers, Global Sales Enquiries), Company ("Why are we building MyWonder", News), Policies ("Exchange, Refunds & Cancellations"); "Built with ❤️ by parents with parents" | none | sticky bar |

**Headline formula.** An outcome claim drawn into a hero image ("Develops Critical Thinking"; "Safe
learning companion parents trust"), then three short benefit chips. No price in the hero; the price
arrives with the sticky bar on the fourth screen.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [00](phone-product-00-landed.jpg)/[01](phone-product-01.jpg) | Buy box | Ticker; gallery led by a 5-second video (child in a park holding the device, native controls); "MyWonder Mega Starter Pack (Launch offer)"; "₹5,499"; "MRP ~~₹8,999~~ ₹5,499" with a "39% Off" chip; full-width yellow **"Order Now"** at the bottom edge of the screen (y 803 of 844). The "Shop with AI" pill covers part of the price chip | inline "Order Now" |
| [02](phone-product-02.jpg) | Terms in bullets | "Note: Launch offer price only. Price may be revised higher in the future."; "Designed for children between 3 to 10 years. Connects over Wi-fi."; "Speaks English & Hindi. Other indian languages coming soon!"; **"Includes 2500 minutes of FREE talk-time. Additional talk-time at Rs 1/minute."**; "Includes:" accordion of the pod and nine content cards (Aru the Naturalist, Astro the Space Explorer, Math Battle…) | none |
| [03](phone-product-03.jpg) | Bundle, safety | Rest of the card list ("Feelings Detector", "Make Your Own"); "Safe, Independent Play for Children" | **Sticky bar appears** ("Launch Offer @ ₹5,499 (Limited units) / Includes MyWonder Pod & 10 cards worth ₹8,999/-" + "Order Now"); its button sits under the "Shop with AI" pill |
| [04](phone-product-04.jpg) | Testimonials | Audio-clip cards; "Loved Across Homes": nine cards with a name, an occupation and a city ("Subhashini, Tech Professional, Canada"; "Lakshmi and Praveen, Media Professional, Bengaluru: '...My 3 year old daughter was totally enthralled speaking to myWonder…'"). No stars, no dates | sticky bar |
| [05](phone-product-05.jpg) | Parent benefit | "Rediscover the Joy of Parenting": "Designed for Independent Child Interaction" ("play and learn without constant adult supervision"), "A Trusted Companion for Good Habits", "Encouraging Autonomy" ("allowing parents the freedom to take a moment for themselves"), "Monitoring Progress with the Parent App" | sticky bar |
| [06](phone-product-06.jpg) | Problem, help | "In an era dominated by screens, children miss out on meaningful play."; "Need Assistance? Talk To Us" | "Schedule Phone Call" |
| [07](phone-product-07.jpg)–[08](phone-product-08.jpg) | Footer | Policies | sticky bar |

**CTA position and repetition.** One label, "Order Now", everywhere. Home: drawn into both hero
images, then the sticky bar from screen 03 to the end (10 of 13 screens); no inline button in the
DOM above the fold. Product page: one inline button in the first 390 × 844 screen, then the sticky
bar from screen 03 to the end (6 of 9 screens). At **360 × 640** the product page shows neither the
price nor the button in the first screen ([small360-product-00](small360-product-00-landed.jpg));
Home shows the drawn "Order Now" inside the hero image, half covered by the floating pill
([small360-home-01](small360-home-01.jpg)). On both pages the floating "Shop with AI" pill (and, on
Home, the WhatsApp button) sits on top of the sticky bar's "Order Now" in every phone screenshot
where the bar shows (for example [home-04](phone-home-04.jpg), [product-03](phone-product-03.jpg)).

## Trust devices
- Shark Tank India badge in the hero; "Safe for Children" seal with no certifying body named.
- Investor and accelerator logos (Antler, Google for Startups) and a publisher logo row.
- Named testimonials with occupation and city, several naming the child's age (3, 7, 8).
- A parent-app mock-up; tap-to-hear audio of characters and of children using the device.
- Help routes: WhatsApp ("Assist Me"), "Schedule Phone Call", physical trial venues in Bengaluru.
- No warranty, returns or delivery promise near the CTA; no star ratings.

## Offers and guarantees
- A permanent "Launch Offer" against an "MRP ₹8,999" that is the sum of the bundle ("Includes
  MyWonderpod & 10 Learning Cards worth MRP ₹8,999"); "39% Off" chip; "You have saved ₹3,500 so far"
  in checkout.
- Scarcity without a number to check: "(Limited Units)", "(Batch 1, 2 Sold Out. Batch 3 selling fast)",
  "Price may be revised higher in the future."
- Usage is metered and disclosed on the product page: 2,500 free minutes, then "Rs 1/minute".
- Policies (GET, 2026-10-10): cancellation "within 2 days of placing the order"; damaged, defective or
  "not as shown" items reported "within 2 days of receipt"; approved refunds processed in "1-2 days";
  orders handed to the courier "within 0-7 days"; warranty complaints referred to "manufacturers".
  None of this is shown near the button.

## Product → cart → checkout (phone, 2026-10-10)
1. **"Order Now" on the product page opens Razorpay Magic Checkout over the page**, no cart
   ([cart-01](phone-cart-01-order-now-loading.jpg) loading, [cart-02](phone-cart-02-order-now-razorpay-magic.jpg)):
   MyWonder header, a language icon, step bar "Contact › Address › Payment", "You have saved ₹3,500
   so far", order summary (~~₹8,999~~ ₹5,499, Qty. 1), a banner "Your Amex card is welcomed at 1M+
   locations", then **"Contact details: Enter mobile number to continue"** with "+91" and a flag, a
   **pre-ticked** "Send me offers and order updates", "Secured by Razorpay", "Continue". **Stopped here.**
2. The `/cart` page ([cart-03](phone-cart-03-cart-page.jpg)): line item, quantity stepper, "Estimated
   total ₹5,499.00 / Taxes included. Discounts and shipping calculated at checkout.", "Checkout".
   "Checkout" opened a Razorpay login sheet instead ([cart-04](phone-cart-04-cart-checkout-razorpay-login.jpg)):
   "Hello again! Curiosity is Wonderful.", "Login with Phone: +91 Mobile number", a pre-ticked "Send
   me offers and updates", "Login with Razorpay". **Stopped here.**

Taps from product page to the first details screen: **1** ("Order Now"). From Home: 2 (hero slide →
product page → "Order Now"); the Home sticky bar's "Order Now" is a `<button>` (`sticky-buy-now`) and
was not tapped in this capture.

## India-specific patterns
- **Mobile-number-first checkout** (Razorpay Magic), "+91" pre-set, three visible steps.
- **No payment methods visible** before a mobile number is entered: COD, UPI, EMI and wallets were
  not seen on the product page, cart or first checkout screen.
- **No pincode check** and no delivery date on the product page or cart.
- **WhatsApp:** floating button on Home; "Assist Me" opens a WhatsApp chat; a phone-call booking on
  the product page. **Offline:** trial and purchase at two Bengaluru venues, in the ticker.
- "Taxes included" in the cart; prices written "₹5,499", "₹5499" and "Rs 1/minute" on the same site.

## Motion on a phone
- **Busy:** the hero carousel advances on its own (the first screen changed between t = 0 and
  t = 3 s); the announcement ticker scrolls without stopping; two autoplaying, muted, looping videos
  on Home; the floating pill switches its label between "Shop with AI" and "Shop Best Sellers"
  ([home-04](phone-home-04.jpg), [home-05](phone-home-05.jpg)). Swiper carousels throughout; GSAP is
  loaded on the product page. The CSS includes a `prefers-reduced-motion` rule.
- **Obstructive:** the two floating widgets cover the sticky bar's button on every screen where the
  bar shows.
- **Slow:** the hero is one large image with its text drawn in; it was the LCP element on Home in
  our capture.

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home | 55 | 6.4 s | 200 ms | 0.002 | 17,572 KiB |
| Product page | 58 | 5.8 s | 120 ms | 0.011 | 14,067 KiB |

## Laptop (1440 × 900)
Floating rounded header with "MyWonder Pod · Learning Experts & Games · Immersive Audio". The laptop
hero image (also with empty `alt`) adds three chips, "Full Parental Control · Child Progress Insights
· Safe by Design", under "Safe learning companion parents trust" ([laptop-home-00](laptop-home-00-landed.jpg)).
The product page is two columns with the "Order Now" and the launch-price note in the first screen
([laptop-product-00](laptop-product-00-landed.jpg)); the sticky offer bar runs full width further down.

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** short, real clips of a child talking with the toy, playable on the page. Tied to
  "Conversation is the proof of how" ([positioning: in one line](../../../../brand/positioning.md#in-one-line))
  and the buying trigger "Hearing it in their language" ([audience: buying triggers](../../../../brand/audience.md#buying-triggers)).
  Real, consented recordings only (brief §9.8; imagery is G3 in [open questions](../../../../open-questions.md)).
- **Adopt:** the sticky bar states price and what is included in one line. Kheelona's version states
  the token, the price it holds and the refund in the same line, from [pricing](../../../../product/pricing.md).
  Tied to [PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)
  issue 5 and brief §9.1.
- **Adapt:** "Need Assistance? Talk To Us" opening WhatsApp, as an inline block beside the FAQ and the
  CTA rather than a floating button. Support is WhatsApp only ([facts: support channel](../../../../product/facts.md#support-channel));
  two store visitors asked on WhatsApp before leaving (PostHog audit issue 4).
- **Adapt:** the parent's "20-minute swap" job ([audience: jobs](../../../../brand/audience.md#jobs-kheelu-is-hired-for))
  is what "Rediscover the Joy of Parenting" sells, but say it without "no adult supervision": Kheelu
  hands the conversation back to family ([positioning: two product rules](../../../../brand/positioning.md#two-product-rules-that-make-the-promise-true)),
  and the 3-year-old wording is open (G5).
- **Avoid:** floating chat or AI widgets that sit on top of the sticky CTA. PostHog audit issue 5:
  the sticky bar gave 14 of 29 phone store taps.
- **Avoid:** the headline and the button drawn into a carousel image with empty `alt`: no text for
  screen readers or search, and the image becomes the slow LCP. Brief §9.5, §9.6; PostHog audit
  issue 1 (paid visitors leave Home in seconds).
- **Avoid:** scarcity that cannot be checked ("Batch 3 selling fast", "Price may be revised higher").
  Kheelona's unit count is never published ([pricing](../../../../product/pricing.md)) and brief §4.2
  bans invented claims.
- **Avoid:** a pre-ticked marketing opt-in at checkout. Kheelona's consent tick is not pre-ticked
  ([policies: status at a glance](../../../../product/policies.md#status-at-a-glance)).
- **Note:** MyWonder discloses metered talk time on the product page. What a Kheelu parent keeps after
  the six included months may be said only through the sanctioned line
  ([facts: Kheelona+](../../../../product/facts.md#kheelona); F7).

**Most transferable lesson.** A sticky offer bar only sells if nothing covers it: MyWonder's bar
carries the price, the offer and the bundle, but its own floating "Shop with AI" pill and WhatsApp
button sit on the "Order Now" button on every phone screen where the bar shows.
