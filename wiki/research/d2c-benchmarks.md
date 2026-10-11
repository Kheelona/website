---
title: D2C benchmarks (Phase 1)
type: research
updated: 2026-10-11
sources:
  - "raw/research/benchmarks/{allbirds,boat,kiwico,lenskart,lovevery,mamaearth,miko,mywonder,oura,playshifu,scoobies,skillmatics,smartivity,the-whole-truth,tonies,ultrahuman,wakefit,warby-parker,yoto}/notes.md, with the screenshots beside each (captured 2026-10-10 evening machine time = 2026-10-11 UTC; exact times per file)"
  - research/posthog-audit.md (PostHog project 617632, 2026-09-19 to 2026-10-10)
  - qa/baseline-2026-10-10.md (Lighthouse 13.4.1 medians and phone first-screen checks of the live site)
  - brand/positioning.md, brand/messaging.md, brand/audience.md
  - site/checkout.md, site/content-boundary.md
  - design-system/overview.md, design-system/component-map.md, design-system/gaps.md, design-system/motion.md
  - product/policies.md, product/pricing.md, product/facts.md, product/claims.md
  - decisions/D013, D016 to D024 (founder, 2026-10-10)
  - legacy/settled-decisions.md
---

# D2C benchmarks (Phase 1)

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)): benchmark research and
> competitor intelligence. Nothing here is published, and no brand on this page is ever named in site
> copy, metadata, schema or ads ([positioning L264](../brand/positioning.md#competitors-named)).

What 19 leading D2C sites do on a phone, from the first screen of Home to the first checkout screen
that asks for personal details, and what Kheelona should adopt, adapt or avoid. Each site's full
capture (fold maps, quotes, flow, India patterns, motion, Lighthouse, screenshots) is in its notes
file; this page synthesises them and links back. Prices, counts and claims of other brands are as
captured on the date shown and were not re-checked.

**How the captures were made** (detail in each notes file): Playwright 1.58.2 (Chromium), Android
Chrome user agent, `en-IN`, Asia/Kolkata; phone 390 × 844 first, then 360 × 640 first screens and
laptop 1440 × 900; scrolled viewport chunks at 1x; visitor only, stopping at the first screen that
asks for personal details. Lighthouse 13.4.1 mobile preset, simulated throttling: one run per page
for most sites, median of three for boAt, Mamaearth, The Whole Truth and Ultrahuman. Several flows,
360 × 640 screens and Lighthouse runs came from a US connection; each notes file says which. The
captures ran on the evening of 2026-10-10 machine time, which is 2026-10-11 in UTC.

## In one screen

1. **On a phone the buy action lives in a bottom bar.** Of the 17 product pages captured at
   360 × 640, 8 show a buy action in the first screen, and all 8 do it with a bottom bar that is on
   screen from first paint (Ultrahuman through its buy page); 6 of those bars carry the price. Our own
   data agrees: sticky elements gave 22 of 29 phone taps to the store
   ([PostHog §8, issue 5](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)), and at
   360 × 590 the live price caption hides behind our bar ([QA baseline §6](../qa/baseline-2026-10-10.md#primary-cta-in-the-first-screen)).
2. **Yoto is the pre-order model.** Dispatch date on the product image, "Payment taken today" under
   the button, the date again in the basket and on the order line. No benchmark sells a refundable
   token, so Kheelona's "₹499 now, refundable until we ship" has no direct model and has to be
   explained the same way, at every CTA.
3. **Reassurance travels with the button.** A micro-line under every CTA (KiwiCo), a short trust row
   (two to four items) directly under the buy button (Miko, PlayShifu, boAt, Lenskart, Warby,
   Skillmatics, Yoto), "Everything included for $95" (Warby), one risk reversal repeated three times (Wakefit). This
   is the answer to our biggest leak: 81 of 91 store visitors never touched the form
   ([PostHog §8, issue 4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
4. **Indian checkouts open on a mobile number** with +91 set and hide the payment methods until it is
   given (GoKwik on Skillmatics, boAt and Mamaearth; Razorpay Magic on MyWonder; OTP on Lenskart). The
   Whole Truth is the counter-example: guest checkout, every payment option visible before any detail.
   Kheelona already reaches its form in one tap, as fast as the fastest benchmark.
5. **Indian pages print the tax line under the price** ("MRP inclusive of all taxes", "Incl. of all
   taxes", "(Tax incl.)", "Tax Included."): 7 of the 12 Indian stores on the product page, 2 more in
   the cart. boAt also carries the Legal Metrology declarations as ordinary spec rows. Kheelona owes the same (brief 9.7); the values are now decided ([D034](../decisions/D034-origin-manufacturer-mrp.md)).
6. **The three kids' AI rivals named in the positioning sell friendship and proof nobody can check**:
   "cherished companion" and outcome percentages with no study (Miko), "Emotion-Aware Companion" and
   "responds like a real friend" (Pookie), an unnamed "Safe for Children" seal and "Batch 3 selling
   fast" (MyWonder). Only Miko puts returns and warranty under its button; MyWonder shows none near
   it and Pookie's terms (exchange only) sit in an accordion on a second page. "A toy, not a friend"
   and specific, checkable safety facts are open ground.
7. **Pookie is also a soft plush rabbit** (captured 2026-10-10): the form does not set Kheelu apart;
   the mechanism ("It asks. They think.") has to.
8. **Floating chat, AI and offer bubbles sit on top of the sticky CTA** on MyWonder ("Shop with AI"
   over "Order Now") and PlayShifu ("Chat with us" over "ADD TO CART"). Help belongs inline.
9. **None of the 19 is a performance model.** Lighthouse mobile Performance ran 14 to 77, and no
   measured page reached the brief's 2.5 s LCP (best 3.0 s). Kheelona's live Home, product page and
   store already measure 86, 90 and 85 (median of three) on the same Lighthouse version ([QA baseline §2](../qa/baseline-2026-10-10.md#2-lighthouse-medians-median-of-3-runs)).
   Copy the selling patterns, not the weight.
10. **Seven sites pre-tick a marketing opt-in at checkout**, and several add paid or optional lines
    late. Kheelona's consent tick is not pre-ticked and its checkout logic is frozen: keep both.

## 1. The sites

Groups: **G** global DTC leader · **IN** Indian D2C leader · **K** kids, toy or ed-tech (**P** = named
as a competitor in the [positioning](../brand/positioning.md#competitors-named)). 19 sites: 3 G, 6 IN,
10 K (3 of them P; 6 of the 10 K are Indian stores, so 12 of the 19 sell in India).

### 1.1 Register and fold maps in brief

Phone fold maps, first screen to footer. Full fold-by-fold tables, quotes and screenshots are in each
notes file.

| Site | Group | Captured | When (per notes) | Notes | Fold map in brief |
|---|---|---|---|---|---|
| Yoto | K | uk.yotoplay.com (no Indian store; GBP); Yoto Player 4th Gen, on pre-order | 2026-10-11 02:04-02:09 UTC; flow and 360 × 640 05:02-05:12 UTC (US) | [notes](../raw/research/benchmarks/yoto/notes.md) | **Home:** dated sale hero with deadline chip and Trustpilot count → licence strip, sale tiles → "This is Yoto" → range cards ("Pre-order" on the new player) → awards → content by age → Trustpilot plus four guarantee cards → FAQ (incl. "What age is Yoto for?"). **Product:** gallery with "Est. dispatch" chip, sticky "£119.99 / Pre-order" from first paint → buy box with add-ons → pre-order terms ("Payment taken today"), payment marks, delivery · returns · instalments row → benefits → "What's included?" as pictures → reviews → specs → FAQ |
| tonies | K | tonies.com/en-eu (no Indian store; EUR); Toniebox 2 | 2026-10-10; cart retry 2026-10-11 04:58 UTC | [notes](../raw/research/benchmarks/tonies/notes.md) | **Home:** consent dialog over two-thirds of the screen → campaign carousel → category tiles → how it works, by age → tap-to-listen sampler → range by age → shop carousel (four of five sold out) → licences → FAQ (Wi-Fi, age) → trust row ("30 days happiness guarantee"). **Product:** buy box with sticky "€119.99 incl. VAT · Add to shopping cart" → "Good to know" requirements → warning and specs → trust row → compare models → cross-sell |
| Lovevery | K | lovevery.com (US, USD); The Play Kits for 3-year-olds | 2026-10-11 02:25-03:00 UTC; 360 × 640 and Lighthouse 04:54-05:17 UTC (US) | [notes](../raw/research/benchmarks/lovevery/notes.md) | **Home:** "4.9/5 from 21K+ happy families" above the H1 "Raise curious, capable kids with Lovevery", age chips (two hero variants seen) → what you get → problem video → inline kit chooser → real-family videos → "Ninety percent of your child's physical brain growth occurs by age 5" (no source on screen) → quality claims → email capture. **Product:** eyebrow "The Play Kits for 3-year-olds", H1 in the child's words, no CTA → offer strip (30-day returns, skip or cancel, price) and kits by month → what's included → subscriber perks → how it works → business-model FAQ. No sticky bar |
| KiwiCo | K | kiwico.com (US, USD); Koala Crate, ages 3-6 | 2026-10-11 02:19-02:26 UTC; 360 × 640 and Lighthouse 04:57-05:12 UTC (US) | [notes](../raw/research/benchmarks/kiwico/notes.md) | **Home:** sticky promo-code bar; video hero (white at first paint), "Tinker. Create. Innovate." → promos → three steps → crate lines, each led by its age band → topic videos → experts and a linked university study → scale and rating → FAQ ("Can I try a single crate…?") → three steps, "Pause, switch, or cancel anytime!". **Product:** "Ages 3-6", headline, "Get started →" → what arrives monthly → examples → FAQ → perks and steps → cross-sell → mission → reviews with distribution. Four inline CTAs, each with "delivered monthly \| cancel anytime"; no sticky bar |
| Miko India | K, P | in.miko.ai; Miko Mini | 2026-10-10 | [notes](../raw/research/benchmarks/miko/notes.md) | **Home:** autoplaying video carousel "Ridiculously Smart. Seriously Fun." with no button; sticky price bar from first paint → creator videos → four "quotients" under a scroll-pinned robot → product card → kidSAFE+ COPPA safety → press logos → subscription upsell → influencer quotes → AI and privacy → CSR numbers → footer. **Product:** in-page tabs, "4.8 · 500+ Ratings", struck price → "Add To Cart" + "Buy Now" with a four-icon trust row under them → hardware → chips of questions a child might ask → features → "cherished companion" → subscription table in USD → parent zone → outcome percentages with no study → FAQ |
| MyWonder | K, P | mywonder.in; Mega Starter Pack (launch offer) | 2026-10-10 (2026-10-11 02:16-03:07 UTC) | [notes](../raw/research/benchmarks/mywonder/notes.md) | **Home:** ticker (Bengaluru trial venues); auto-advancing hero with headline and "Order Now" drawn into the image, Shark Tank badge, unnamed "Safe for Children" seal → benefits video → device demo; sticky offer bar from screen 3 → tap-to-hear character cards → audio library → outcomes → parent-app mock-up → clips of children → investor logos → WhatsApp "Assist Me" → FAQ. **Product:** price against a bundle "MRP", "39% Off", "Order Now" at the screen's bottom edge → terms as bullets (ages, Wi-Fi, languages, metered talk time) → bundle list → named testimonials → parent benefit → help. A floating "Shop with AI" pill covers the sticky button |
| Scoobies (Pookie) | K, P | scoobies.co.in; `/pages/pookie` and `/products/scoobies-pookie` | 2026-10-10 (2026-10-11 02:20-03:09 UTC; INR re-run 04:53-04:59) | [notes](../raw/research/benchmarks/scoobies/notes.md) | **Home:** no headline; five-slide banner carousel with a pause control (Pookie on slide 5) → category tiles → catalogue tabs with star counts → Instagram and store locator → footer. **Story page:** plush photo and intro, no price → price, one "BUY NOW", video, privacy → reassurance blocks → form factor → features ("Emotion-Aware Companion") → FAQ. **Shopify page:** price, "Tax Included.", "Add to cart" + "Buy it now", accordions (exchange only; 2-7 business days) → cross-sell → 15 reviews. No sticky bar on either |
| PlayShifu | K | playshifu.com (`?country=IN`); Plugo Animals, Orboot Earth | 2026-10-10 | [notes](../raw/research/benchmarks/playshifu/notes.md) | **Home:** 5% sign-in modal and cookie bar → promo carousel (text in image), search → "Shop By Age" → bundles with ratings and a free gift → customer videos → "The PlayShifu Advantage" → skills (many sections stayed skeletons in capture) → footer with a WhatsApp community. **Product:** title with "Ages 4+", rating, "79 people viewing right now", no price or CTA → price, two buttons, offers, "Shop with confidence" grid (4-5 days, 6-month warranty, 30-day return, COD) → customer videos → skills → reviews with the full histogram → FAQ (internet? subscription?) → cross-sell. Sticky "ADD TO CART" after the inline one leaves, covered by "Chat with us" |
| Skillmatics | K | skillmatics.in; Guess in 10 Junior (ages 3-6) | 2026-10-10 | [notes](../raw/research/benchmarks/skillmatics/notes.md) | **Home:** auto-rotating banners (text in image) and a sticky offer strip → "Shop By Age" → trending cards with age chips, prices, coupon → "1 Crore+ Happy Families" → blogs → SEO block with the H1 at the bottom. **Product:** title with ages, rating, "₹319 ~~₹374~~ Save 15%", "MRP inclusive of all taxes", no button → coins, coupon, "Add to Cart", "Get it between…" dates, "Free shipping · COD Available · 30-day returns", four skills → bundles, bulk gifting on WhatsApp → cross-sell → how to play → reviews naming the child's age. Sticky "Add to cart ₹319" after the inline one leaves |
| Smartivity | K | smartivity.in; Solar System kit | 2026-10-10 | [notes](../raw/research/benchmarks/smartivity/notes.md) | **Home:** rotating bar (chat number, gifts, 2-day metro delivery); looping hero video, eyebrow "India's award-winning learning toys", H1 "Smarter kids, through play.", two age-routed buttons → trust strip (IIT engineers, free delivery and COD, 20+ countries, wood) → age tiles → bestsellers with honest review counts → bundles → gifting → awards, volume, quotes → reviews naming ages → SEO. **Product:** age and "Bestseller" chips, "1 review", sticky "ADD TO CART" from first paint (no price) → price, two buttons, "2 days express delivery in metros", UPI app logos → reviews → FAQ (breakage, made in India) → cross-sell |
| boAt | IN | boat-lifestyle.com (home redirects to a festive-sale page); Airdopes 181 Pro | 2026-10-11 02:07-02:19 UTC; checkout and Lighthouse 04:52-05:21 UTC | [notes](../raw/research/benchmarks/boat/notes.md) | **Home:** sticky sale strip with a prepaid code; 10-slide sale hero (text in image), bank offers, four service icons → deal rails ("80% off", ratings) → scarcity rails → category rails → footer with warranty and repair policies; fixed bottom bar with a WhatsApp "Chat" tab. **Product:** H1 and spec subtitle, rating, countdown; sticky price + MRP + "Inclusive of all taxes" + "Add To Cart" + "Buy Now" from first paint → Pay Later and EMI, pre-filled pincode "By tomorrow", trust row (warranty, 7-day replacement, delivery, GST billing) → highlights → feature renders → spec table with the declarations → reviews incl. critical → FAQ |
| Lenskart | IN | lenskart.com; Lenskart Air POP frame | 2026-10-11 02:22-03:08 UTC (no 360 × 640; Lighthouse unusable) | [notes](../raw/research/benchmarks/lenskart/notes.md) | **Home (phone):** an app-like launcher: app strip with rating and downloads, search, livestream and membership banners, category tiles; fixed services bar (Stores, AR Try on, Eye Test, Orders, Assistant). **Product:** gallery with "4.8 ★ (14291)", Photos / 360 view / AR Try On, price with a code; sticky "Buy at Home" + "Buy at Store" + "Select Lenses" from first paint → size, face scan, pincode check, "Few Left" → "Easy 14 day Exchange", "365 days Warranty" → how to buy → reviews → try-on tiles → similar |
| Mamaearth | IN | mamaearth.in; Rice face wash 150 ml | 2026-10-11 02:12-02:47 UTC; complete re-capture 05:02-05:10 UTC | [notes](../raw/research/benchmarks/mamaearth/notes.md) | **Home (phone):** no hero: product cards with "Add to cart" from the first screen; sticky free-delivery strip, floating "ASK AI", bottom app bar → seasonal rail → bestsellers by need with percentage claims → why us → cause → long SEO text. **Product:** app strip, H1, rating, benefit chips, unit price, "M.R.P. … Incl. of all taxes"; sticky "Add to cart - ₹359" from first paint → variants, pincode delivery date, "7 days return and refund · FREE Shipping on orders above ₹399" → creator videos → infographics → accordions → a 19-question FAQ |
| The Whole Truth | IN | thewholetruthfoods.com; Double Cocoa protein bars, box of 10 | 2026-10-11 02:16-03:03 UTC; 360 × 640 and Lighthouse 05:02-05:27 UTC | [notes](../raw/research/benchmarks/the-whole-truth/notes.md) | **Home:** strip "Orders dispatched within 48-72 hours"; mission hero "We're re-building the world's trust in food." with a story link and no buy button → the ingredient promise and categories → "Real food is flawed" → newsletter and academy → factory tour (FSSC) → unpaid fans → press → payment logos and "Oh! and Cash On Delivery too :)" → footer with test reports. **Product:** jump tabs, title, auto-applied code price; sticky "ADD TO CART" + "BUY NOW" from first paint → "MRP inclusive of all taxes", pincode check, replacement policy, rating → "What's inside?" to 100% and "no hidden * marks either" → FAQ incl. "Who makes these bars I'm buying?" → verified reviews incl. a 4-star |
| Wakefit | IN | wakefit.co; orthopaedic memory foam mattress | 2026-10-11 02:30-03:14 UTC; blocked from 04:57 UTC | [notes](../raw/research/benchmarks/wakefit/notes.md) | **Home (first screen only):** app strip, search, category bubbles, sale carousel "Sit, feel, decide with 100 days easy return guarantee!", ticking "Sale Ends In". **Product:** pincode sheet over the page → gallery with "100 Days Free Return" badge, "4.86L" ratings, good-better-best series → "Price inclusive of all taxes", size, EMI and bank offers, "Try for 100 Days / Not satisfied? Get your money back"; sticky "Choose Size" + "Add To Cart" from here → direct-versus-platforms perks table → how it is made → demo, store and chat routes → FAQ → SEO → footer with support hours and manufacturer |
| Ultrahuman | IN | ultrahuman.com/in; Ring AIR story page `/in/ring/` and buy page `/in/ring/buy/` | 2026-10-11 02:19-03:12 UTC; complete story re-capture, 360 × 640 and Lighthouse 05:03-05:27 UTC | [notes](../raw/research/benchmarks/ultrahuman/notes.md) | **Home:** "Buy Ring PRO" in the header on every screen; dated sale hero with "Buy now" → 2-hour delivery → "Every reading, built on evidence" ("Read the science") → product sections each ending "Buy now" + "Learn more", with section-scoped sticky bars ("No mandatory subscription") → app, stores → live "nights tracked" counter → footer. **Story page:** video hero, "Find a store" + "Buy now" → accuracy → "Clinically validated … Read the study" → design story → features. **Buy page:** price "or ₹832/mo", dispatch date, pincode same-day check, "30-night risk free trial • Free returns"; sticky total "(Tax incl.)" + "Continue" from first paint → colour, sizing kit → protection upsell → summary → box, reviews → compare with named rivals |
| Allbirds | G | allbirds.com (no Indian store; US, USD); Men's Tree Runner NZ | 2026-10-11 02:22-02:36 UTC; 360 × 640 and Lighthouse 04:51-05:17 UTC (US) | [notes](../raw/research/benchmarks/allbirds/notes.md) | **Home:** country modal → bar with the real shipping delay ("may take up to 30 days to ship") → hero "Wildly Comfortable. Super Natural." with two equal pills → categories, best sellers → campaign banners → named materials → footer; a floating AI pill throughout. **Product:** H1, price with a free-shipping chip, no button at 360 → swatches, sizes, fit note, a button that names the next step ("SELECT A SIZE", then "ADD TO CART - $100") → named materials, origin in tech details → video feature → cross-sell → reviews (not rendered). Sticky bar after the inline button leaves |
| Warby Parker | G | warbyparker.com (US, USD); Brimmer, Black Walnut | 2026-10-11 02:12-02:40 UTC; 360 × 640, re-take and Lighthouse 04:52-05:16 UTC (US) | [notes](../raw/research/benchmarks/warby-parker/notes.md) | **Home:** four-tab row; seasonal hero with "Free shipping and free 30-day returns" and two buttons (quiz, shop) → editorial → new arrivals, each "Select lenses and buy" → customer videos → stores → insurance check → app and impact number → footer. **Product:** "Starting at $95", rating, try-on, width guide, no CTA at 360 → "Select lenses and buy", "Free shipping · Free returns", "Everything included for $95" → the same list with its conditions → accordions → reviews with sub-scores and a 1-star. Sticky "From $95 / pay over time" + button + "Try on" after |
| Oura | G | ouraring.com (India: add to cart disabled, "Available in India at Cromā and Amazon"; flow from a US connection); Oura Ring 4 | 2026-10-11 02:14-02:38 UTC (India); flow and 360 × 640 05:05-05:11 UTC (US) | [notes](../raw/research/benchmarks/oura/notes.md) | **Home:** availability strip, then an empty first screen while the hero fades in → "Wear your best life" + "Shop Now" → promise and health areas → "86% of Oura Members see their health improve¹" with the survey footnoted → member stories → feature with a wellness disclaimer → press → footnotes and payment marks. **Product:** gallery, title, price, no CTA at 360 → sizing kit, "Add to Cart" (disabled in India) → benefits, battery footnoted → FAQ (accuracy, "without a subscription?") → "What's Included", specs. Sticky "Add to Cart" after the buy box |

### 1.2 Side by side: the first phone screen and the button

"360" = the 360 × 640 first screen. The Kheelona row is production today, for comparison.

| Site | Home hero formula | Buy action in the 360 first screen: Home / Product | Phone sticky bar: when · what it carries | The line under the main button |
|---|---|---|---|---|
| Yoto | Dated sale + deadline chip | Yes / Yes | From first paint, steps aside while the inline button shows · price + "Pre-order" | "Est. dispatch from 15 October 2026 … Payment taken today"; delivery · returns · instalments row |
| tonies | Seasonal campaign carousel | No / Yes | From first paint · price "incl. VAT" + "Add to shopping cart" | Trust row lower down |
| Lovevery | Parent's goal + brand, rating above the H1 | Cut by the fold / No | None (header button after scroll) | "Easy 30-day returns \| Skip or cancel any time" strip by the price |
| KiwiCo | Three verbs + delivery promise | Yes / No (yes at 390 × 844) | None | "delivered monthly \| cancel anytime" under every CTA |
| Miko | Brand + two adjectives, no button | Yes (bar) / Yes (bar) | From first paint · struck and current price + "Add To Cart" | Four icons: warranty, money back, support, returns |
| MyWonder | Outcome claim drawn into an image | Drawn button, half covered / No | From screen 3 · offer + bundle line + "Order Now", covered by a floating pill | None |
| Scoobies (Pookie) | None (banners) | No / No | None | "Tax Included." (Shopify page only) |
| PlayShifu | Promo carousel, then "Shop By Age" | Not recorded / No | After the inline button leaves · quantity + "ADD TO CART", covered by chat | "Shop with confidence" grid |
| Skillmatics | Promo banners + sticky offer strip | No / No | After the inline button leaves · "Add to cart ₹319" | "Free shipping · COD Available · 30-day returns" |
| Smartivity | Authority eyebrow + outcome + age buttons | Age buttons only / Yes (bar, no price) | From first paint · "ADD TO CART", no price | Delivery line + UPI app logos |
| boAt | Sale event + superlative + code | Covered by a flash-sale sheet / Yes | From first paint · price, MRP, "Inclusive of all taxes", two buttons | Warranty · 7-day replacement · delivery · GST billing |
| Lenskart | Phone: launcher, no headline | Not captured / Not captured (bar from first paint at 390) | From first paint · "Buy at Home", "Buy at Store" + "Select Lenses" | "Easy 14 day Exchange · 365 days Warranty" |
| Mamaearth | None: a product shelf | Partly, under the strip / Yes | From first paint · "Add to cart - ₹359" | "7 days return and refund · FREE Shipping…" |
| The Whole Truth | Mission | No / Yes (bar; price below the screen) | From first paint · two buttons, no price | "MRP inclusive of all taxes", pincode check, replacement policy |
| Wakefit | Sale + risk reversal + entry price | Not captured / No (pincode sheet at 390) | From screen 2 · "Choose Size" + "Add To Cart" | "Try for 100 Days / Not satisfied? Get your money back" |
| Ultrahuman | Dated sale + "Buy now" | Yes / Yes | Buy page: from first paint · total "(Tax incl.)" + "Continue"; Home: bars scoped to each product section | "30-night risk free trial* • Free returns"; dispatch date |
| Allbirds | Benefit + material adjectives, two equal pills | Yes, after popups / No | After the inline button leaves · name, price, next-step label | "Free Shipping on Orders over $100" |
| Warby Parker | Seasonal line + guarantee in the hero, two buttons | Yes / No | After the inline button · "From $95 / pay over time" + button + "Try on" | "Free shipping · Free returns" + "Everything included for $95" |
| Oura | Aspiration, after a hero fade | Yes / No | After the buy box · name + "Add to Cart" | "Buy with confidence" card on `/store` |
| **Kheelona today** | "A best friend at 3. A head start for school." (wording banned for the new site, [messaging](../brand/messaging.md#taglines-and-hero)) | Yes / Yes ([QA baseline §6](../qa/baseline-2026-10-10.md#primary-cta-in-the-first-screen)) | On every page · "Pre-order Kheelu", no price, no `cta` tag | Price caption, hidden behind the bar at 360 × 590 |

### 1.3 Side by side: the buy path and India patterns

"Taps" = from the product page to the first screen asking for personal details. Lighthouse:
mobile Performance, LCP in brackets, Home / product page, as recorded in each notes file (runs and
connection there).

| Site | Taps | First thing asked | Payment methods shown before details | India patterns seen | Lighthouse |
|---|---|---|---|---|---|
| Yoto | 3 | Email, after a log-in-or-guest choice | Express buttons; marks under the button | None (UK store) | 49 (5.6 s) / 56 (44.7 s) |
| tonies | Cart not reachable | Not reached | Payment processor named | None (EU store) | 30 (19.6 s) / 35 (24.4 s) |
| Lovevery | 4 | Email | PayPal express | None (US store) | 20 (8.0 s) / 14 (9.7 s) |
| KiwiCo | 1 | The child's name | Not recorded | None (US store) | 42 (6.1 s) / 60 (3.0 s) |
| Miko | 3 | Email (Shopify) | None before the address | PIN code only inside checkout | 31 (11.4 s) / 59 (6.0 s) |
| MyWonder | 1 | Mobile number, +91 (Razorpay Magic) | None before the number | WhatsApp help; Bengaluru trial venues; "Taxes included" in cart | 55 (6.4 s) / 58 (5.8 s) |
| Scoobies (Pookie) | 1 (story) / 2 (product) | Email (Shopify) | Inside checkout: PayU (cards, UPI, net banking, wallets, BNPL, EMI) and COD | COD; pincode check promised by policy, absent on the page | 65 (4.3 s) / 42 (7.3 s) story page |
| PlayShifu | 2 | Email, then phone with +91 | Online (UPI, card, wallets, net banking) or COD | COD on the product page; delivery days; WhatsApp chat and order updates | 58 (6.2 s) / 51 (11.7 s) |
| Skillmatics | 3 | Mobile number, +91 (GoKwik) | UPI app icons on the checkout button | COD; delivery date range; WhatsApp | 29 (6.6 s) / 56 (4.6 s) |
| Smartivity | 2 | Email or mobile number | UPI app logos on the product page and cart button | COD; 2-day metro delivery; chat number | 52 (4.5 s) / 49 (5.0 s) |
| boAt | 1 (Buy Now) / 2 | Mobile number, +91 (GoKwik) | "UPI & Cards Accepted"; Pay Later and EMI beside the price | Prepaid discount; pincode date; WhatsApp tab; GST billing | 28 (8.5 s) / 36 (13.6 s) |
| Lenskart | 3 | Phone OTP, WhatsApp or email login | None before login | Pincode check; buy at home or store; WhatsApp login | Not usable |
| Mamaearth | 3 | Mobile number, +91 (GoKwik) | None before the number | Pincode date; prepaid discount; unit price | 36 (6.2 s) / 41 (5.8 s) |
| The Whole Truth | 3 + pincode | Name, mobile, email (guest, no OTP) | All of them, incl. a 0% EMI split and COD | Pincode delivery day; COD; dispatch window | 62 (5.7 s) / 47 (11.1 s) |
| Wakefit | Not reached | Not reached | EMI, card and UPI offers in the buy box | Pincode gate; EMI; GST offer; support hours | None (blocked) |
| Ultrahuman | 6 (from the buy page) | Email, optional GSTIN | Logo row before any field; EMI, CRED, UPI in the summary | Pincode same-day; GSTIN; toll-free number | 63 (6.4 s) / 77 (4.0 s) story page |
| Allbirds | 3 | Email | Express buttons | None (US store) | 50 (19.2 s) / 50 (15.4 s) |
| Warby Parker | Not reached | Not reached | Affirm and Klarna in the sticky bar | None (US store) | 49 (5.2 s) / 33 (10.8 s) |
| Oura | 3 (US) | Delivery address with email (US) | Affirm and Klarna under the checkout button | India: retail hand-off, button disabled | 58 (13.2 s) / 58 (9.5 s) |
| **Kheelona today** | **1** (CTA → store page, which is the form) | Name, WhatsApp number (Indian), email, child's age, consent tick ([checkout](../site/checkout.md#form-fields-store-page)) | Razorpay sheet after submit: UPI, cards, net banking ([D024](../decisions/D024-payment-methods-gst.md)) | No COD; delivery included anywhere in India; WhatsApp help on the store; "All prices include GST" ([policies](../product/policies.md#status-at-a-glance)) | 86 / 90; store 85 (median of 3, [QA baseline §2](../qa/baseline-2026-10-10.md#2-lighthouse-medians-median-of-3-runs)) |

## 2. Pattern library

Each pattern names the sites it was seen on (notes linked in section 1) and points to its verdict in
[section 3](#3-adopt-adapt-avoid-for-kheelona).

### 2.1 Hero patterns (Home, first phone screen)

| Pattern | Seen at | On a phone | Verdict |
|---|---|---|---|
| Sale or campaign hero, often dated or ticking | Yoto, tonies, boAt, Wakefit, Ultrahuman, Skillmatics, PlayShifu, Scoobies | The product promise drops to fold 2 or later; text is often drawn into the image | Avoid (X1, X4) |
| Promise hero: the parent's goal or the outcome, then the product | Lovevery (rating above the H1), Smartivity (authority eyebrow), Oura, Allbirds, Miko | Clear; only Lovevery and Smartivity put proof or authority in the same screen | Adapt (D3, D4) |
| Mission hero with no buy route | The Whole Truth | No buy action at 390 or 360 | Avoid for paid phone traffic (A13, X12) |
| Shelf or launcher instead of a hero | Mamaearth, Lenskart (phone) | Fast for repeat catalogue buyers; nothing explains a new category | Not applicable: one product in a new category ([positioning L72](../brand/positioning.md#category-and-frame-of-reference)) |
| Router hero: two equal buttons | Allbirds, Warby Parker, Smartivity (two age bands), Ultrahuman ("Buy now" + "Learn more" in every section) | Splits the first tap | Avoid (X14) |
| Age band as the first line | KiwiCo, Lovevery, Skillmatics and PlayShifu (in the title), Smartivity (chip) | The parent knows at a glance whether it fits | Adopt (A9) |

### 2.2 Proof and trust placement

| Where | What | Seen at | Verdict |
|---|---|---|---|
| Above or beside the headline | Rating and count | Lovevery, Yoto (Trustpilot), Miko, Lenskart, Wakefit, Warby Parker | Cannot copy yet ([section 4](#4-what-not-to-copy)) |
| Directly under the buy button | Three or four short guarantees, each linked to its terms | Miko, PlayShifu, boAt, Lenskart, Warby Parker, Skillmatics, Smartivity, Yoto; Oura's "Buy with confidence" card | Adopt (A5) |
| Mid product page | Specific, checkable facts instead of adjectives | The Whole Truth (ingredients to 100%), Allbirds (named materials), Ultrahuman ("Read the study"), Oura (footnoted samples) | Adopt (A7), adapt (D6) |
| Mid product page | Real people using the product, tap to play | Lovevery, MyWonder, PlayShifu, Warby Parker, Mamaearth (creators); tonies' tap-to-listen sampler | Adopt with the consented films (A10) |
| Lower product page | Reviews with distribution, negatives kept, the child's age named | KiwiCo, PlayShifu, Warby Parker, boAt, The Whole Truth; Skillmatics and Smartivity (ages) | Adapt when real (D9) |
| Footer | Kids privacy policy, test reports, recalls, grievance, manufacturer address | Yoto, The Whole Truth, Lovevery, Lenskart, Wakefit, Ultrahuman | Adopt the disclosures (A12) |
| Anywhere | Seals without an issuer, live viewer counts, unsourced percentages | MyWonder, PlayShifu, Miko, Lovevery, Mamaearth | Avoid (X2, X7, X9) |

### 2.3 Offer and guarantee framing

- **Pre-order told at every step** (Yoto): the dispatch date on the image, under the button, in the
  basket and on the order line, and "Payment taken today" in one sentence. → A4.
- **One reassurance repeated** from top bar to cart (Allbirds: free shipping; Wakefit: "Try for 100
  Days" three times; KiwiCo: the same micro-line under four CTAs). → A3.
- **The price turned into a list** of what it buys and what is guaranteed (Warby Parker: "Everything
  included for $95", then the same list with conditions: "Within 30 days", "within six months"). → A6.
- **Guarantees named warmly, terms a tap away** (tonies: "30 days happiness guarantee"; Lenskart: "Easy
  14 day Exchange" with "Learn More"). → A5.
- **The business model defended in an FAQ** (Lovevery: "Why can't I buy just one item?"; KiwiCo: "Can I
  try a single crate before I commit?"). → A8.
- **Barrier price beside the full price** (Warby Parker: "From $95 / pay over time" in the bar;
  Ultrahuman: "or ₹832/mo"; boAt: "₹1 now"). Kheelona's barrier price is the token, not EMI. → D2.
- **Stacked offers and urgency** (boAt codes and countdowns; Skillmatics coupon, coins, gift, bundles;
  Lenskart cart timer; MyWonder "Batch 3 selling fast"; "MRP" built from the sum of a bundle). → X1, X2, X10.
- **Terms hidden or late** (Scoobies: exchange only, in an accordion on a second page; MyWonder: 2-day
  windows, not near the button; Allbirds: a paid returns line that appears only at checkout). → X11.

### 2.4 CTA labels and repetition

- **One label, one destination** on the strongest sites: Yoto "Pre-order", MyWonder "Order Now",
  KiwiCo "Get started →" (four times on the product page), Warby Parker "Select lenses and buy",
  Lenskart "Select Lenses", Oura "Add to Cart". → A2.
- **The label names the next step** (Allbirds: "SELECT A SIZE" until a size is chosen, then "ADD TO CART
  - $100"). Kheelona has no choice to make before the store, so one fixed label fits.
- **Price inside the label** (Mamaearth "Add to cart - ₹359", Skillmatics "Add to cart ₹319") against
  founder decision #9 (no number on the button; price in the caption). → D2.
- **"Add to cart" plus "Buy now" pairs** (Miko, PlayShifu, Smartivity, Scoobies, boAt, The Whole Truth):
  a cart choice Kheelona does not have (no cart, [checkout](../site/checkout.md#in-one-screen)).
- **Repetition:** the bar repeats on every screen (Miko: all 18 product screens); inline buttons repeat
  after each persuasion block (KiwiCo, Ultrahuman). The DS asks for a CTA after the hero, safety,
  compare and close ([component map](../design-system/component-map.md#page-templates)).

### 2.5 Sticky bars on phones

| Variant | Seen at | Note |
|---|---|---|
| On screen from first paint | Yoto, tonies, Miko, Smartivity, boAt, Lenskart, Mamaearth, The Whole Truth, Ultrahuman (buy page) | The only way any product page got a buy action into the 360 first screen (8 of 8) |
| Steps aside while the inline button is visible | Yoto | Avoids two identical buttons on one screen |
| Appears after the inline button leaves | Allbirds, PlayShifu, Skillmatics, Warby Parker, Oura, Wakefit; MyWonder from screen 3 | The DS rule for `StickyBuyBar` ([component map](../design-system/component-map.md#selling)) |
| Scoped to a section | Ultrahuman (a bar per product section on Home) | Fits a multi-product page |
| Carries price and terms | Yoto, tonies ("incl. VAT"), Miko, boAt (MRP, "Inclusive of all taxes"), Mamaearth (in the label), Warby Parker ("pay over time"), MyWonder (offer and bundle), Ultrahuman ("Tax incl.") | 6 of the 8 first-screen bars carry the price |
| Covered by another floating element | MyWonder, PlayShifu | The bar sells only if nothing sits on it |
| None | Lovevery, KiwiCo, Scoobies | None of the three shows a buy action in the 360 product first screen |

### 2.6 Product-page structure

The common order on the strongest phone product pages (Yoto, Miko, boAt, Mamaearth, The Whole Truth,
Warby Parker): **gallery and title with rating → price and tax line → choice (if any) → button → trust
row → benefits → what is included → specs and declarations → reviews → FAQ → cross-sell**, with the bar
throughout. Variations worth knowing:

- **In-page jump tabs** at the top (Miko: Overview, Specification, Conversation…; The Whole Truth:
  Offers, FAQs, Reviews; Ultrahuman: a section-picker pill).
- **"Good to know" requirements** before the specs (tonies: Wi-Fi to set up, what is sold separately,
  a warning). → A14.
- **"What's included" as pictures** (Yoto, Oura, Ultrahuman). → A6.
- **Declarations as spec rows** (boAt: MRP, country of origin, marketed by, manufactured by,
  consumer-complaints contact). → A12.
- **Split story and buy pages** (Ultrahuman, Scoobies) or a product page with no buy box (Lovevery).
  → A13 (one page).
- **Comparison** of own models (tonies), of buying direct against other platforms (Wakefit), or against
  named rival devices (Ultrahuman). → D10.

### 2.7 FAQ placement

- **On the product page, near the buy box** (Oura: accuracy and "without a subscription?" right after
  the benefits; Lovevery after how it works; Wakefit mid-page) or **at the end** (Mamaearth: 19
  questions; PlayShifu after reviews). Home FAQs sit just before the footer (Yoto, tonies, KiwiCo,
  MyWonder).
- **Questions in the buyer's words**, including the uncomfortable one asked by the brand itself (The
  Whole Truth: "Who makes these bars I'm buying?") and the business-model one (Lovevery, KiwiCo).
- **Age, connectivity and subscription** are the recurring questions on kids' devices (Yoto and tonies:
  "What age…?"; tonies: "Do I need WiFi?"; PlayShifu: "continuous internet?", "subscription fees?";
  Pookie: internet and battery). → A8.

### 2.8 Checkout entry and India patterns

How the Indian patterns map to what Kheelona offers today:

| Pattern | Seen at | Kheelona today | Verdict |
|---|---|---|---|
| Mobile number first, +91 set | MyWonder, Skillmatics, boAt, Mamaearth, Lenskart | The form asks for an Indian WhatsApp number ([checkout](../site/checkout.md#form-fields-store-page)) | Adapt the label (D8) |
| Payment methods visible before any detail | The Whole Truth, Ultrahuman, Smartivity and Skillmatics (UPI logos), boAt | Methods appear only in the Razorpay sheet; UPI, cards, net banking offered ([D024](../decisions/D024-payment-methods-gst.md)) | Adopt as a line under the button (A5); icons are DS gap G-12 |
| COD | PlayShifu, Smartivity, Skillmatics, The Whole Truth, Scoobies | Not offered ([policies](../product/policies.md#payment-methods)) | Never shown (X15) |
| EMI, Pay Later, prepaid discounts | boAt, Wakefit, Ultrahuman, The Whole Truth, Mamaearth | Not offered ([D024](../decisions/D024-payment-methods-gst.md)) | Never shown (X15) |
| Pincode delivery check or gate | boAt, Mamaearth, The Whole Truth, Lenskart, Ultrahuman; Wakefit as a gate | Delivery included anywhere in India; no transit-time promise ([policies](../product/policies.md#status-at-a-glance)) | Say "anywhere in India" instead (A5); never a gate (X12) |
| Tax line under the price | Product page: Skillmatics, boAt, Mamaearth, The Whole Truth, Wakefit, Ultrahuman, Scoobies; cart: PlayShifu, MyWonder | "All prices include GST" exists; MRP undefined ([pricing](../product/pricing.md#tax-delivery-mrp)) | Adopt (A12) |
| GST invoice or GSTIN | boAt ("GST Billing"), Ultrahuman (optional GSTIN) | A GST invoice with every order ([D024](../decisions/D024-payment-methods-gst.md)) | Adopt in the trust row (A5) |
| WhatsApp help or login | boAt, PlayShifu, Skillmatics, MyWonder, Smartivity, Lenskart | WhatsApp, messages only today; calls and messages on the new site ([facts](../product/facts.md#support-channel), [D032](../decisions/D032-grievance-block-and-call-line.md)) | Adopt inline (A11) |
| Assisted and offline routes | Lenskart, Wakefit, Ultrahuman, MyWonder (Bengaluru venues), Scoobies (stores) | WhatsApp-assisted selling and Bengaluru demos are in the plan ([positioning L328](../brand/positioning.md#outside-the-website-summary)) | Adapt (D7) |
| Unit price, "You save", MRP struck through | Mamaearth, Skillmatics, Scoobies, Miko, MyWonder | No MRP and no discount exist | Not applicable |

**Not seen anywhere:** a capture inside WhatsApp's or Instagram's in-app browser, where all three of our
unpaid orders happened ([PostHog §6](posthog-audit.md#6-replays-of-drop-offs-26-reviewed)). The
benchmarks say nothing about that step; it stays with QA and G13.

### 2.9 Motion on a phone: what helps and what hurts

| Helps | Seen at |
|---|---|
| A sticky bar that never animates once shown, or slides in once | Miko, boAt, Mamaearth, Lenskart, The Whole Truth; Allbirds |
| The bar stepping aside while the inline button is on screen | Yoto |
| A drawer or bottom sheet instead of a new page | Yoto (basket), Allbirds (cart) |
| Short opacity and transform reveals on text below the fold | Ultrahuman, Lovevery (700 ms) |
| A pause control on the one self-moving element | Scoobies |
| A full-screen step with a progress bar for a configurator | Warby Parker |
| `prefers-reduced-motion` rules present | Yoto, Lovevery, boAt, Mamaearth, Ultrahuman, Warby Parker, MyWonder, Oura (product page) |

| Hurts | Seen at |
|---|---|
| A hero that fades in, leaving the first screen empty | Oura |
| An autoplay video hero that paints white first, or becomes the LCP | KiwiCo, Miko |
| Decoration pinned during scroll that covers the copy | Miko |
| Auto-advancing carousels, endless marquees and tickers with no pause | Miko, MyWonder, boAt (10 slides), Yoto (logo strip on 40 s and 28 s loops) |
| Ticking countdowns and counters | boAt, Wakefit, Lenskart (cart timer), Ultrahuman |
| Long skeleton shimmer | Mamaearth, PlayShifu |
| Floating widgets that cycle labels over the content | MyWonder, Allbirds |
| Font swaps and lazy blocks that make the page jump | The Whole Truth, Ultrahuman (fonts); Lenskart, Wakefit, Lovevery (product page CLS 0.92) |

## 3. Adopt, adapt, avoid for Kheelona

Each item is tied to a line in the [positioning](../brand/positioning.md) or a finding in the
[PostHog audit](posthog-audit.md) ("PH §8 #n" = section 8, issue n), and says whether the design
system can express it (a component on the [component map](../design-system/component-map.md)) or needs
a gap ([gap register](../design-system/gaps.md)). Copy for every item comes only from confirmed facts
([content boundary](../site/content-boundary.md)); labels and price text render from the checkout's own
source ([pricing](../product/pricing.md)).

### 3.1 Adopt

| ID | Do this on kheelona.com | Seen at | Tied to | Design system |
|---|---|---|---|---|
| A1 | **A phone sticky buy bar on Home and the product page** with the one CTA label and the price line, never covered by any floating element, carrying a PostHog `cta` value. Timing: D1 | Yoto, Miko, tonies, boAt, Mamaearth (8 of 8 product first screens with a buy action at 360) | [PH §8 #5](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): sticky elements gave 22 of 29 phone store taps; the phone buyer used the bar twice. [PH §9 gap 1](posthog-audit.md#9-instrumentation-gaps): the bar is untagged | [StickyBuyBar](../design-system/component-map.md#selling); show and hide not built: [G-09](../design-system/gaps.md#g-09); motion: [G-10](../design-system/gaps.md#g-10) |
| A2 | **One primary label and one destination** (the store) on every button, the nav, the bar and the finale; everything else is a text link | Yoto, MyWonder, KiwiCo, Warby Parker, Lenskart, Oura | [PH §5, CTA taps](posthog-audit.md#which-ctas-people-tap-h13-h14-h14b-h14h-human-sessions): `navbar-mobile` never tapped; 25 of 29 phone taps untagged. Label choice: G1 ([messaging](../brand/messaging.md#cta-labels)) | [Button](../design-system/component-map.md#actions) `cta`; the DS varies the label: [G-07](../design-system/gaps.md#g-07); nav plus hero chilli: [G-06](../design-system/gaps.md#g-06) |
| A3 | **The risk line under every CTA**, identical everywhere: in token mode [D028](../decisions/D028-price-wording.md)'s one sentence ([messaging, price next to the CTA](../brand/messaging.md#confirmed-candidate-lines): ₹499 first, the ₹4,999 total incl. GST in the same sentence, "refundable" beside the advance), then "Deliveries start mid-November" for new orders ([D023](../decisions/D023-new-order-delivery.md)), each from one content value | KiwiCo (micro-line under four CTAs), Allbirds, Wakefit, Yoto | [PH §8 #4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): 81 of 91 store visitors never touched the form; replays show they wanted a question answered. Also PH §8 #1 | [`kh-trustline`](../design-system/component-map.md#layout-classes-in-bundlecss-no-react), StickyBuyBar `note`, OfferCard `fine`. Token mode only: [G-08](../design-system/gaps.md#g-08) (G9) |
| A4 | **Pre-order disclosure at every step** (Yoto): the delivery date near the price, [D028](../decisions/D028-price-wording.md)'s one sentence ([messaging, price next to the CTA](../brand/messaging.md#confirmed-candidate-lines): ₹499 first, the ₹4,999 total incl. GST in the same sentence, "refundable" beside the advance) under the button, both again at the top of the store and in its summary; a three-step "reserve, we ship, pay the balance" block near the CTA (KiwiCo's three steps) | Yoto, KiwiCo, Oura (delivery first in the cart), Ultrahuman (dispatch date before any choice) | [PH §8 #4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): the store must explain the token and the ship date beside the form | [OfferCard](../design-system/component-map.md#selling) (`deposit`, `balance`, `shipDate`), [StepLoop](../design-system/component-map.md#content), Badge. Full-payment mode: [G-08](../design-system/gaps.md#g-08) |
| A5 | **A trust row directly under the button**, confirmed terms only, each linked to its terms and stated with its condition: "7-day returns, no questions asked" ([D021](../decisions/D021-returns-policy.md)) · "6-month warranty" ([D022](../decisions/D022-warranty-replacement-refund.md)) · "Pay by UPI, card or net banking · Price includes GST · GST invoice with every order" ([D024](../decisions/D024-payment-methods-gst.md)) · "Delivered anywhere in India, delivery included" ([policies](../product/policies.md#status-at-a-glance)) | Miko, PlayShifu, boAt, Lenskart, Warby Parker, Skillmatics, Smartivity, Yoto; tonies' and Lenskart's linked terms | [PH §8 #4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) (price incl. taxes, returns beside the form); [PH §8 #2](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) (3 of 5 orders lost at payment); [PH §8 #9](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) (29% of non-paid sessions outside India) | [TrustList](../design-system/component-map.md#selling) or `kh-trustline`; payment icons missing: [G-12](../design-system/gaps.md#g-12); inline link tap areas: [G-01](../design-system/gaps.md#g-01) |
| A6 | **"Everything included for ₹4,999"** under the CTA (Warby Parker): Kheelu, the box contents once F4 confirms them, six months of Kheelona+ in its sanctioned line only ([facts](../product/facts.md#kheelona)), delivery, the GST invoice. Box contents as pictures when the DS has the angles (Yoto) | Warby Parker, Yoto, Oura, Ultrahuman | [Positioning L272](../brand/positioning.md#price-story): anchor the price against what parents already spend on their child's mind, "there every day" | [OfferCard](../design-system/component-map.md#selling) `perks[]`; extra product angles: [G-14](../design-system/gaps.md#g-14) |
| A7 | **Safety told as checkable facts**, in the founder's order: the wake-up button and light ([D018](../decisions/D018-wake-up-button.md)) → providers on servers in India that keep nothing and never train, by contract ([D020](../decisions/D020-provider-terms-and-no-sale.md)) → parents read and delete every conversation ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) → "We don't sell your data"; plus no camera, says it is a toy, never asks for a secret ([claims §1](../product/claims.md#1-confirmed-by-the-founder)). Never the bare word "safe" | The Whole Truth ("What's inside?" to 100%), Allbirds (named materials), Ultrahuman | [Positioning L238](../brand/positioning.md#pillars-and-foundation): "Safe by design" is banned, name the behaviours; [L292](../brand/positioning.md#tone): specific, substantiated, calm | [TrustList](../design-system/component-map.md#selling) (icon, promise, one-line mechanism). The DS Footer's default promise still uses wake-word wording: G11 ([claims §4.1](../product/claims.md#41-the-retired-microphone-wording)) |
| A8 | **An objection FAQ near the CTA** on the product page and the store, 5 to 8 questions in the parent's words, answers under 60 words from confirmed facts: right for my 3-year-old? always listening? will AI make my child think less? needs Wi-Fi? what after six months? why a ₹499 token? what if we don't like it? who makes it and where does the voice go? | Lovevery, The Whole Truth, Oura, PlayShifu, Yoto, tonies, Mamaearth | [Positioning L113](../brand/positioning.md#the-problem) (AI's new fear) and [L126](../brand/positioning.md#the-problem) ("the answer to all three is the mechanism"); [PH §8 #4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) | [FAQ](../design-system/component-map.md#content) (5-8 items, answers under 60 words) |
| A9 | **The age band first**: "Ages 3 to 7" as the eyebrow or chip above the product headline and in Home's first screen; "not for under 3" kept visible | KiwiCo, Lovevery, Smartivity, Skillmatics, PlayShifu | [Positioning L48](../brand/positioning.md#the-age-correction) and [L355, L362](../brand/positioning.md#where-the-age-correction-bites) | [SectionHeading](../design-system/component-map.md#content) `eyebrow` (up to four words) or Badge |
| A10 | **Real children talking with Kheelu**: the consented parent films, high on the product page and Home, tap to play, captions burned in, no `<video>` element before play | Lovevery, MyWonder, PlayShifu, Warby Parker; tonies' tap-to-listen | [Positioning L61](../brand/positioning.md#in-one-line): "Conversation is the proof of how"; [PH §5, films](posthog-audit.md#customer-films-q27): the most-used interactive element; the phone buyer watched all six | **Gap**: no video player ([G-11](../design-system/gaps.md#g-11)), no video in the DS ([G-14](../design-system/gaps.md#g-14)); use of the films is G3. No audio-only sampler: the audio demos were removed by the founder ([settled decisions](../legacy/settled-decisions.md#content-and-pages)) |
| A11 | **WhatsApp help as an inline secondary action** (the number takes calls as well on the new site, so the "messages only" label goes, [D032](../decisions/D032-grievance-block-and-call-line.md)): beside the FAQ, under the store form, never a floating bubble | MyWonder ("Need Assistance? Talk To Us"), Lenskart (assisted routes beside the button), Wakefit, boAt | [PH §6](posthog-audit.md#6-replays-of-drop-offs-26-reviewed): 2 store visitors tapped "Need help? WhatsApp us"; 2 of 5 orders came from links sent in WhatsApp chats. [Positioning L328](../brand/positioning.md#outside-the-website-summary): WhatsApp-assisted selling | [Button](../design-system/component-map.md#actions) `secondary` with the `whatsapp-logo` icon |
| A12 | **India disclosures where buyers look**: "incl. GST" beside every price ([D024](../decisions/D024-payment-methods-gst.md)); MRP ₹7,999, "Made in India", manufacturer Kheelona Robotics Pvt Ltd and the consumer-care contact as ordinary spec rows (boAt), from [D034](../decisions/D034-origin-manufacturer-mrp.md) | boAt; the tax line on 7 of 12 Indian product pages | [PH §8 #4](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): price including taxes beside the form | **Gap**: no spec table ([G-11](../design-system/gaps.md#g-11)); compose with [Tabs](../design-system/component-map.md#navigation) (Specs / In the box / Safety) |
| A13 | **One product page that tells, proves and sells**, the default destination for ads and shares, with the CTA, price line and risk line inside 360 × 590; never a story page split from the buy page | For: Yoto, Miko, boAt. Against: Scoobies, Ultrahuman, Lovevery | [PH §8 #6](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): product-page sessions reached the store 14.8% vs 4.5% Home-only; [PH §8 #1](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): no paid session landed on it | The DS product-page skeleton ([page templates](../design-system/component-map.md#page-templates); [selling rules](../design-system/overview.md#selling-project07-sellingmd)) |
| A14 | **A "Good to know" box**: what each mode needs (AI mode on home Wi-Fi, Story mode offline, Bluetooth with a paired phone), the parent app, ages 3 to 7 ([facts](../product/facts.md#modes-and-connectivity)) | tonies, PlayShifu ("Devices shown… are not included"), Oura | [Positioning L240](../brand/positioning.md#pillars-and-foundation): the foundation chips (screen-free, no browsing, read every chat, stories work offline; the wake-word chip is replaced by [D018](../decisions/D018-wake-up-button.md)) | [FeatureCard](../design-system/component-map.md#content) `tint` or TrustList |
| A15 | **Motion that serves the sale**: the bar never animates after it appears; short opacity-and-transform reveals below the fold only; nothing on the hero, price or CTA; a pause on anything that moves by itself; reduced motion honoured | Miko, boAt, Mamaearth (static bars); Yoto (bar steps aside); Ultrahuman (short fades); Scoobies (pause) | [PH §8 #8](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): Home phone INP p75 546 ms; [PH §5, scroll](posthog-audit.md#scroll-depth-h19-h19b-human-sessions): paid phone Home median 7.8 s | **Gap**: reveals, bar and drawer motion undefined ([G-10](../design-system/gaps.md#g-10); spec at Gate A, [motion](../design-system/motion.md#what-the-gate-a-motion-spec-has-to-decide)) |

### 3.2 Adapt

| ID | Their pattern → Kheelona's version | Seen at | Tied to | Design system |
|---|---|---|---|---|
| D1 | **Sticky bar timing.** Benchmarks that reach the 360 screen show the bar from first paint; the DS shows it after the hero CTA leaves. Kheelona: on the product page, from first paint and stepping aside while the inline CTA or OfferCard is on screen (Yoto); on Home, the DS rule, provided the hero CTA sits inside 360 × 590 | Yoto; DS `StickyBuyBar` README | [PH §11](posthog-audit.md#11-devices-browsers-and-screen-sizes-for-qa): 360-wide viewports are 31.3% of phone sessions, minimum height 588; WhatsApp's in-app browser 35.7% | StickyBuyBar + [G-09](../design-system/gaps.md#g-09); decision: [OQ-1](#6-open-questions-raised-here) |
| D2 | **Price in the bar, not the label.** Mamaearth and Skillmatics put the price in the button; Warby Parker puts "From $95 / pay over time" beside it. Kheelona: the bar's note carries a compact form of [D028](../decisions/D028-price-wording.md)'s sentence with ₹499 first, for example "₹499 today, refundable, of ₹4,999 incl. GST" (never the total first beside the CTA; the exact bar wording is for the founder at Gate A; the token is our barrier price; EMI is not offered, [D024](../decisions/D024-payment-methods-gst.md)); the label stays the one label (founder decision #9, G1) | Mamaearth, Skillmatics, Warby Parker, Ultrahuman | [PH §8 #5](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact); [QA baseline §6](../qa/baseline-2026-10-10.md#primary-cta-in-the-first-screen): the caption hides behind the bar at 360 × 590 | StickyBuyBar `price`, `note`; OfferCard `deposit`, `balance` |
| D3 | **A headline in the child's own voice.** Lovevery's "Discover the power of *I did it*" → "It asks. They think.", built on the confirmed asking-back behaviour ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); usable, the founder accepts the trademark risk and invites alternatives ([D038](../decisions/D038-trust-content-rulings.md)) | Lovevery | [Positioning L59](../brand/positioning.md#in-one-line) | [SectionHeading](../design-system/component-map.md#content) `hero` with one `Hand` or `Mark` accent |
| D4 | **Outcome headline with authority.** Smartivity ("Smarter kids, through play." under "India's award-winning learning toys") → only the research-anchored form: conversation helps a young brain grow, Kheelu gives a child more of it, source cited on the page; "brain development" as a topic, never as Kheelu's effect ([D016](../decisions/D016-brain-wording.md)) | Smartivity, Lovevery | [Positioning L128](../brand/positioning.md#the-promise): SKM's hero is banned as written | SectionHeading `eyebrow` + `lead` |
| D5 | **Show the questions Kheelu asks.** Miko shows chips of questions a child might ask the robot ("Click me"); reverse them into what Kheelu asks back ("Why do you think that happened?", "What happens next?") | Miko | [Positioning L126](../brand/positioning.md#the-problem) ("Kheelu asks, your child thinks") and [the four thinking skills](../brand/positioning.md#the-four-thinking-skills) (no advisor, so no skills-by-age claims, [D038](../decisions/D038-trust-content-rulings.md)); the questions are asked back in conversation, never during a story ([D027](../decisions/D027-story-mode-wording.md)) | [Tag](../design-system/component-map.md#forms) (static) or Sticker; compose |
| D6 | **The claim with its study one tap away.** Ultrahuman ("Clinically validated … Read the study"), Oura (footnoted survey size and timing), KiwiCo (linked university study) → each research line carries its public source and link ([claims §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)); no Kheelona outcome number until pilot data exists, then with its sample | Ultrahuman, Oura, KiwiCo | [Positioning L188](../brand/positioning.md#the-evidence-as-skm-rates-it) ("built around… not proven") and [L119](../brand/positioning.md#the-problem) (ASCI substantiation) | Compose: SectionHeading `lead` + [Button](../design-system/component-map.md#actions) `ghost` (underlined link) |
| D7 | **Assisted and offline routes.** Lenskart (buy at home or store), Wakefit (live demo, store, chat), MyWonder (Bengaluru trial venues, schedule a call) → a Bengaluru demo line only when demos are real and scheduled, beside WhatsApp (A11). **Not in v1:** there is no demo venue ([D038](../decisions/D038-trust-content-rulings.md), F14) | Lenskart, Wakefit, MyWonder, Ultrahuman | [Positioning L328](../brand/positioning.md#outside-the-website-summary): Bengaluru demos | [FeatureCard](../design-system/component-map.md#content) with `link` (tap area: [G-01](../design-system/gaps.md#g-01)) |
| D8 | **Phone number first, +91 visible.** GoKwik and Razorpay Magic open on a mobile number with +91 set → presentation only: label the existing field as an Indian WhatsApp number with a visible +91 and a hint; validators unchanged (brief 4.4) | MyWonder, Skillmatics, boAt, Mamaearth | [PH §8 #3](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): half of form starters never submit, one rejected twice; [PH §8 #9](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) | [TextField](../design-system/component-map.md#forms) `label`, `hint`; a fixed +91 prefix is not a documented feature: [OQ-2](#6-open-questions-raised-here) |
| D9 | **Honest reviews, when they exist.** Warby Parker (sub-scores, a 1-star kept), PlayShifu (full histogram), Skillmatics and Smartivity (the child's age; "(1)" shown) → real, consented quotes only, first name, city and the child's age; nothing until then (the drafted testimonials do not move, [open questions §E](../open-questions.md#e-decided-by-the-brief-no-answer-needed-recorded-so-nobody-re-asks)) | Warby Parker, PlayShifu, Skillmatics, Smartivity, KiwiCo | [Positioning L223](../brand/positioning.md#pillars-and-foundation): "None is fully in place yet" | [Testimonial](../design-system/component-map.md#selling) (real quotes only, at most three, never with cast photos); [OQ-4](#6-open-questions-raised-here) |
| D10 | **A fair comparison by category.** tonies (own models), Wakefit (direct vs other platforms), Ultrahuman (named rivals) → categories only ("smart speaker", "robot toy with a screen", "learning apps", "puzzles"), never a brand | tonies, Wakefit, Ultrahuman | [Positioning L264](../brand/positioning.md#competitors-named) (never name competitors) and the [category map](../brand/positioning.md#category-and-frame-of-reference) | [ComparisonTable](../design-system/component-map.md#selling); sideways scroll on phones: [G-05](../design-system/gaps.md#g-05) |

### 3.3 Avoid

| ID | Avoid | Seen at | Tied to | Design system |
|---|---|---|---|---|
| X1 | Dated sales, deadline chips, countdowns, cart timers | Yoto, boAt, Wakefit, Lenskart, Ultrahuman | [Positioning L292](../brand/positioning.md#tone) (never fear) and [L119](../brand/positioning.md#the-problem) (ASCI); the offer is bounded by units, never by a clock ([pricing](../product/pricing.md#live-state)) | DS "never: fake countdowns" ([selling rules](../design-system/overview.md#selling-project07-sellingmd)) |
| X2 | Scarcity and activity nobody can check: "Batch 3 selling fast", a "people viewing right now" count that changed on every load, "Last Few Units Left!", "Few Left", a units-left counter | MyWonder, PlayShifu, boAt, Lenskart | [Positioning L119](../brand/positioning.md#the-problem); the paid count is never published ([pricing](../product/pricing.md#live-state)) | OfferCard `unitsLeft` must not be used ([G-08](../design-system/gaps.md#g-08)) |
| X3 | Floating chat, AI, offer or email bubbles over the bottom of the phone screen | MyWonder (over "Order Now"), PlayShifu (over "ADD TO CART" and "Proceed to Checkout"), Allbirds, Lovevery, Mamaearth, KiwiCo | [PH §8 #5](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact); [PH §5, CTA taps](posthog-audit.md#which-ctas-people-tap-h13-h14-h14b-h14h-human-sessions): 23% of phone Home click points land on fixed elements | No such component; none needed |
| X4 | Headline and button drawn into a carousel image with empty `alt` | MyWonder, Scoobies, Skillmatics, PlayShifu, boAt | [PH §8 #1](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): paid visitors leave Home in seconds; LCP inside in-app browsers | SectionHeading as real text; the image on a `kh-art` board |
| X5 | Heavy first screens: autoplay video heroes, a hero that fades in, pinned decoration over copy, long skeleton shimmer, font swaps and jumping blocks | KiwiCo, Miko, Oura, Mamaearth, PlayShifu, The Whole Truth, Ultrahuman, Lenskart, Wakefit, Lovevery | [PH §8 #1 and #8](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact); brief 9.11 (never hide the LCP or the CTA behind an entrance) | [G-10](../design-system/gaps.md#g-10) |
| X6 | Self-moving carousels, marquees and tickers without a pause | Yoto, MyWonder, boAt, Miko | [PH §8 #10](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): rage clicks on the film carousel, which gives no feedback at its end | [G-10](../design-system/gaps.md#g-10); brief 9.11 (pause anything over five seconds) |
| X7 | Outcome percentages and development statistics with no source on the page ("46%+ … 55%+", "Ninety percent … by age 5", "Up to 93% Less Hair Fall") | Miko, Lovevery, Mamaearth | [Positioning L191](../brand/positioning.md#the-evidence-as-skm-rates-it): results only with pilot data, never "proven" | n/a |
| X8 | Companion and friend framing ("cherished companion", "Miko is my best friend", "responds like a real friend", "Emotion-Aware Companion") | Miko, Scoobies (Pookie) | [Positioning L74](../brand/positioning.md#category-and-frame-of-reference) (refuse "AI companion") and [L238](../brand/positioning.md#pillars-and-foundation) ("a toy, not a friend") | The DS calls Kheelu a friend: G5 ([voice](../brand/voice.md#where-they-conflict)) |
| X9 | Safety seals and adjectives without an issuer ("Safe for Children" seal, "banking-grade algorithms", "Meta-powered child safety standards") | MyWonder, Scoobies (Pookie) | [Positioning L238](../brand/positioning.md#pillars-and-foundation): "Safe by design" banned; the BIS licence is under application, not granted (L1), so no seal or BIS claim ([claims §6](../product/claims.md#6-certifications)) | Never a Badge or Sticker shaped like a seal |
| X10 | Stacked offers: codes, coins, gifts, bundles, bank-offer prices, prepaid discounts | boAt, Skillmatics, PlayShifu, KiwiCo, Lenskart, Wakefit | [Positioning L272](../brand/positioning.md#price-story): anchor against enrichment spend, not discounts | OfferCard holds one offer |
| X11 | Pre-ticked opt-ins and add-ons, paid lines that appear late, upsell sheets between "buy" and payment | 7 sites pre-tick marketing consent (MyWonder, Skillmatics, boAt, Mamaearth, Scoobies, Allbirds, Ultrahuman); Lovevery, Allbirds, Oura, Ultrahuman, Lenskart (late lines and upsells) | [PH §8 #3](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) and [#2](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact); our tick is not pre-ticked ([policies](../product/policies.md#status-at-a-glance)); checkout logic frozen (brief 4.4) | [Checkbox](../design-system/component-map.md#forms): "never pre-ticked" |
| X12 | Anything that blocks the page before it can be read: a pincode gate, a country modal, a consent dialog over two-thirds of the screen, an email popup, a sign-in discount modal, a flash-sale sheet | Wakefit, Allbirds, tonies, Lovevery, PlayShifu, boAt | [PH §11](posthog-audit.md#11-devices-browsers-and-screen-sizes-for-qa): WhatsApp's in-app browser 35.7% of phone sessions, minimum height 588; [PH §8 #1](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) | DS: "never open a dialog on page load or to sell something" ([Dialog](../design-system/component-map.md#feedback-and-overlays)) |
| X13 | A login, OTP or account step before payment | Lenskart, Yoto (log-in-or-guest interstitial), MyWonder (cart login) | [PH §8 #2](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): 3 of 5 orders lost at the payment step; no accounts by design ([checkout](../site/checkout.md#in-one-screen)) | n/a |
| X14 | Two equal buttons in the first view, or a second chilli button beside the hero's | Allbirds, Warby Parker, Ultrahuman; the DS's own nav plus hero | [PH §5, CTA taps](posthog-audit.md#which-ctas-people-tap-h13-h14-h14b-h14h-human-sessions): `navbar-mobile` never tapped | [G-06](../design-system/gaps.md#g-06) (G2) |
| X15 | Badges for what we do not offer: COD, EMI, Pay Later, wallets, a pincode checker, transit promises ("By tomorrow", "2 Days Express", 2-hour delivery) | PlayShifu, Smartivity, Skillmatics, The Whole Truth, Scoobies, boAt, Wakefit, Ultrahuman | [PH §8 #2](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact); UPI, cards and net banking only ([D024](../decisions/D024-payment-methods-gst.md)); no transit-time promise ([D022](../decisions/D022-warranty-replacement-refund.md) guardrail) | n/a |
| X16 | Prices that follow geolocation into another currency, or a second currency on an Indian page | Scoobies (USD on the INR store), Miko ("$8.25/month") | [PH §8 #9](posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact): 29% of non-paid sessions outside India | `formatINR` ([component map](../design-system/component-map.md#app-and-marketing-only-not-for-web-pages)) |

## 4. What not to copy

### 4.1 Devices that need a claim we do not have

Brief 4.2: never invent reviews, ratings, counts, certifications, awards, press, endorsements, test
results, delivery promises or prices.

| Device | Seen at | Why Kheelona cannot use it now | What would unlock it |
|---|---|---|---|
| Star rating and review count in the hero or buy box | Lovevery, Yoto, Miko, KiwiCo, Warby Parker, PlayShifu, Lenskart, Wakefit | No reviews exist; the drafted testimonials do not move ([open questions §E](../open-questions.md#e-decided-by-the-brief-no-answer-needed-recorded-so-nobody-re-asks)) | Real, consented reviews after delivery ([OQ-4](#6-open-questions-raised-here)) |
| Customer, unit or usage counts ("1 Crore+ Happy Families", "Over 50 million crates", "25 Lakhs+ Customers", a live nights counter) | Skillmatics, KiwiCo, Smartivity, Wakefit, Lovevery, Ultrahuman | The paid count is never published; unit counts beyond "first 500" are INTERNAL ([pricing](../product/pricing.md#live-state)) | Nothing; keep out |
| Awards and "award-winning" | Yoto, Lovevery, Smartivity | None documented | A real award with its listing |
| Press, TV, investor and accelerator logos | Miko, MyWonder (Shark Tank, Antler, Google for Startups), The Whole Truth, Oura | The recognition strip is real by the founder's word but proof-gated ([D038](../decisions/D038-trust-content-rulings.md)) and grey ([content boundary](../site/content-boundary.md#grey-decided-case-by-case-at-gate-a)) | Each proof filed in `wiki/raw/`, then a quiet "Recognised by" row (DS selling rules) |
| Certification seals (kidSAFE+ COPPA, Made Safe, FSSC, "Safe for Children") | Miko, Mamaearth, The Whole Truth, MyWonder | No certificate received; the BIS licence is under application (L1; [claims §6](../product/claims.md#6-certifications)) | The licence number, once granted |
| Outcome numbers and pilot results | Miko, Oura (a footnoted member survey) | No pilot data ([messaging, claims guardrails](../brand/messaging.md#claims-guardrails)); the promise to publish results is dropped ([D038](../decisions/D038-trust-content-rulings.md)) | Real pilot data, with the sample shown |
| Experts and advisors ("Designed by experts", "Designed by IIT Engineers", "Clinical and Science Experts") | KiwiCo, Smartivity, Oura, Lovevery | There is no advisor ([D038](../decisions/D038-trust-content-rulings.md)); team credentials are proof-gated (F11, D038) | Proof for the team credentials; no advisor planned |
| Origin lines ("100% made in India", "Country Of Origin") | Smartivity, boAt, Allbirds | Now confirmed: made in India ([D034](../decisions/D034-origin-manufacturer-mrp.md)), so "Made in India" is usable as an ordinary declaration (A12); "100% made in India" style absolutes and "built here" are not ([claims §3.1](../product/claims.md#31-origin-designed-and-built-here)) | Done (D034) |
| A development statistic as the stakes ("Ninety percent … by age 5") | Lovevery | Public figures only at their own source, in their verified wording, with a linked marker ([D026](../decisions/D026-public-statistics.md); [source verification](source-verification.md)) | Done for the verified figures (D026) |
| Battery life and other spec numbers | Yoto, Scoobies (Pookie), Oura | Unpublished ([facts](../product/facts.md#in-the-box); F4) | F4 |
| Delivery speed ("By tomorrow", "2 Days Express", 2-hour) | boAt, Smartivity, Ultrahuman, Skillmatics | No transit-time promise ([policies](../product/policies.md#status-at-a-glance); [D022](../decisions/D022-warranty-replacement-refund.md)) | None planned; the delivery start date only ([D023](../decisions/D023-new-order-delivery.md)) |
| "No mandatory subscription", "free for life" | Ultrahuman | Not confirmed; only the sanctioned Kheelona+ line ([facts](../product/facts.md#kheelona); F7) | F7 |
| Influencer and creator quotes, follower counts | Miko, Mamaearth, MyWonder | None consented; the DS cast is never shown as customers ([DS overview](../design-system/overview.md#imagery)) | Consented creators (G3) |
| Longer guarantees seen elsewhere (365-day warranty, 30-day returns, 100-day trial, money back) | Lenskart, Warby Parker, Wakefit, Miko | Kheelona's are 7-day returns and a 6-month warranty ([D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md)); the remedy after 7 days and who pays pickup are still open (F1) | F1 |

### 4.2 Internal material we cannot publish (D013)

- **Anything on this page about another brand**: names, prices, offers, claims, scores. Never in a
  comparison table, FAQ, schema or ad ([D013](../decisions/D013-internal-vs-external-content.md);
  [positioning L264](../brand/positioning.md#competitors-named)). Ultrahuman's named-rival table is the
  pattern to refuse.
- **"Most popular" and "8 in 10 choose" nudges** (Lovevery's pre-selected plan, Ultrahuman's protection
  plan) would rest on our own sales or PostHog data, which are commercial internals.
- **Funnel, scroll or session figures** as social proof ("hundreds of parents visited this week").
- **SKM's research figures** as a stakes fold in the Lovevery style: INTERNAL
  ([messaging](../brand/messaging.md#internal-research-figures)).
- **Positioning artefacts**: the statement, pillars and category map shape copy and are never copy.
- **Audiences outside the ICP**: Skillmatics' bulk return-gift route and any corporate or preschool
  section (R9, [content boundary](../site/content-boundary.md)).

## 5. What this benchmark could not see

- **In-app browsers.** No site was captured inside WhatsApp's or Instagram's browser, where 35.7% and
  7.4% of our phone sessions ran and where all three unpaid orders happened
  ([PostHog §11](posthog-audit.md#11-devices-browsers-and-screen-sizes-for-qa)). QA covers this step.
- **No refundable-token pre-order** exists in the set; Yoto's pre-order takes full payment. The token's
  explanation has no proven model to copy.
- **Seven of the 19 checkouts are not Indian** (Yoto UK, tonies EU, Lovevery, KiwiCo, Allbirds and Warby
  Parker US, Oura US flow), so their payment and delivery patterns say nothing about India.
- **Incomplete captures:** Wakefit (Home first screen only; no cart, checkout or Lighthouse); tonies
  (cart unreachable); Warby Parker (cart and checkout not reached); Lenskart (no 360 × 640; Lighthouse
  measured the US site); Oura (Indian add to cart disabled); Ultrahuman's buy page and Pookie's Shopify
  page were not measured in Lighthouse.
- **Lighthouse figures are directional**: mostly single runs, some from a US connection, one test path.
  They rank no site.
- **No conversion data for any benchmark.** These are what leaders do, not proven lifts.
- **The payment step itself** (Razorpay or UPI intent screens) was never reached, by design.
- **Laptop at 1440 × 900 only**; PostHog's common laptop widths (1920, 1536, 1280) were not captured.

## 6. Open questions raised here

Returned to the orchestrator; none duplicates an existing ID.

- **OQ-1. Sticky bar timing on phones.** (a) DS rule only: after the hero CTA leaves, hidden while
  the OfferCard is visible. (b) Product page from first paint, stepping aside while the inline CTA or
  OfferCard is on screen (Yoto); Home on the DS rule if its hero CTA fits 360 × 590. (c) From first
  paint everywhere (Miko). **Recommendation (b).** Owner: founder (DS owner), at Gate A with G4 and
  G-09. Customer-visible.
- **OQ-2. The store's phone field.** (a) Label and hint only ("WhatsApp number, Indian mobile, 10
  digits"), no DS change. (b) A fixed +91 prefix inside the field, a DS request. **Recommendation (a)
  now, (b) as a DS request.** Presentation only; validators unchanged. Owner: founder.
  Customer-visible.
- **OQ-3. Where WhatsApp help sits.** (a) Inline secondary button beside the FAQ and under the store
  form. (b) A floating bubble. (c) Both. **Recommendation (a)**: the bubble covers the sticky bar on
  two benchmarks and the DS has no floating component. Owner: either. Customer-visible.
- **OQ-4. Collecting real reviews after the first deliveries.** (a) Ask each buyer on WhatsApp or by
  email after delivery, with explicit consent for first name, city and the child's age, shown with
  the DS Testimonial. (b) No reviews on the site until a third-party review service is set up.
  **Recommendation (a)**, starting with the first dispatches. Owner: founder. Customer-visible.

## Related

[PostHog audit](posthog-audit.md) · [keyword map](keyword-map.md) ·
[QA baseline](../qa/baseline-2026-10-10.md) · [positioning](../brand/positioning.md) ·
[messaging](../brand/messaging.md) · [audience](../brand/audience.md) ·
[checkout](../site/checkout.md) · [content boundary](../site/content-boundary.md) ·
[DS component map](../design-system/component-map.md) · [DS gaps](../design-system/gaps.md) ·
[DS motion](../design-system/motion.md)
