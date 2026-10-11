---
title: "Benchmark capture: Smartivity (smartivity.in)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://smartivity.com/ → https://www.smartivity.in/ (home, captured 2026-10-10)"
  - "https://www.smartivity.in/products/solar-system (product page, marked Bestseller on Home, captured 2026-10-10)"
  - "https://www.smartivity.in/cart drawer and the Shopify checkout it opens (2026-10-10; stopped at the first form)"
  - "Lighthouse 13.4.1, mobile preset (simulated throttling), one run per page, 2026-10-10"
---

# Smartivity (smartivity.in)

**Why it is here.** An Indian maker of DIY wooden STEM kits, from the brief's starting set (brief §6).
Kids / toy group. It sits on the "brain-development shelf" that SKM wants Kheelu to join and stand out
on ([positioning: category](../../../../brand/positioning.md#category-and-frame-of-reference)), so its
buyers are Kheelona's buyers.

**How it was captured (2026-10-10).** Playwright 1.58.2 (Chromium 145), Android Chrome user agent,
`en-IN`, Asia/Kolkata, Indian connection. Phone 390 × 844 and 360 × 640, laptop 1440 × 900, 1x,
scrolled viewport chunks.

| Files | What |
|---|---|
| `phone-home-00..09.jpg` | Home, phone (6,954 px) |
| `phone-product-00..07.jpg` | Solar System product page, phone |
| `small360-*`, `laptop-*` | 360 × 640 first screens; laptop home and product |
| `phone-cart-01..03.jpg` | Cart drawer → Shopify checkout first screen |

## Home (phone): fold map

| Screen | Job | What it says or shows | Proof | CTA |
|---|---|---|---|---|
| [00](phone-home-00-landed.jpg)/[01](phone-home-01.jpg) | Hook | A fixed announcement bar that rotates: "💬 Chat with us: 8130949966 / 🎁 Birthday coming up? Shop birthday gifts → / 2 Days Express Delivery in Metros". A looping hero video of a child building; eyebrow "INDIA'S AWARD-WINNING LEARNING TOYS"; headline **"Smarter kids, through play."** | Award claim | Two age-routed buttons: "DIY Science Toys · 6–14 yrs →", "Learning Puzzles · 2–5 yrs →" |
| [01](phone-home-01.jpg) | Trust strip, right under the hero | "Designed by IIT Engineers: Real engineering in every kit · Free Delivery: Cash on delivery available · Loved in 20+ Countries · Made with Wood" | Origin, COD, reach, material | "Designed by IIT Engineers →" |
| [02](phone-home-02.jpg) | Route by age | "8+ Young Engineers · 6+ Curious Makers · 2–5 Ready to play" tiles | none | tiles |
| [02](phone-home-02.jpg)–[04](phone-home-04.jpg) | Bestsellers | Age filter chips (All, 8+, 6+, 2–5); cards with an age chip, stars **with the review count, even when it is 1** ("★★★★★(1)"), "-18% ₹699 ~~₹849~~", a round "+" quick add | Ratings | "+" quick add |
| [03](phone-home-03.jpg) | Offer | "BUNDLES: Sets of 2 to 4 kits, 10% or 15% off", "See them in action" short videos (muted, with an unmute button) | Product videos | "See bundles →" |
| [05](phone-home-05.jpg) | Gifting | "Birthday coming up? Shop birthday gifts" | none | button |
| [05](phone-home-05.jpg)–[06](phone-home-06.jpg) | Proof | "Proudly award-winning" (a TOTY finalist seal); "Over 10 million kits delivered worldwide!"; four short child and parent quotes | Award, volume, quotes | none |
| [07](phone-home-07.jpg)–[08](phone-home-08.jpg) | Reviews | "As featured in"; "Let our customers speak for us · from 8258 reviews": long reviews that name the child's age ("My almost 6 year old…", "my 7 year old kid…") | Reviews with ages | none |
| [08](phone-home-08.jpg)–[09](phone-home-09.jpg) | SEO block + footer | "India's No. 1 Educational & Learning Toys Store Online: Smartivity", "The Science Behind Smartivity" | none | none |

**Headline formula.** Outcome for the child + how ("Smarter kids, through play."), under an
authority eyebrow, then two buttons that sort the visitor by age.

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-product-01.jpg) | Title | Breadcrumb; chips "Ages 8+" and "Bestseller"; "Solar System / Learn Space Science, Astronomy"; "★★★★★ 1 review"; gallery. **A sticky black "ADD TO CART" bar from first paint**; the price sits just under it and is hidden on this screen | sticky bar |
| [02](phone-product-02.jpg) | Buy box | "-13% ₹996 ~~₹1149~~", "AGE 8+ · BUILD TIME 50mins", description; quantity; "ADD TO CART" (black) + "BUY IT NOW" (orange); **"2 DAYS EXPRESS DELIVERY IN METROS"**; a logo row "VISA · Mastercard · UPI · Paytm · GPay · PhonePe: All Payment Modes Accepted"; accordions "How to Play / Learn & Grow / What's in the Box" | inline pair |
| [03](phone-product-03.jpg)–[04](phone-product-04.jpg) | Reviews | "LOVE FROM OUR SMARTIVITY FAMILY": 1 verified review; histogram "5.00 out of 5, Based on 1 review"; "Write A Review", "Have A Question?" | sticky bar |
| [04](phone-product-04.jpg)–[05](phone-product-05.jpg) | Objection FAQ | DIY and assembly; instructions; glue; **"What can I do if any piece breaks…? We offer lifetime free parts replacement"**; materials (MDF); **"Are the products designed and made in India? Yes… 100% made in India… design patents"** | sticky bar |
| [05](phone-product-05.jpg)–[06](phone-product-06.jpg) | Cross-sell | "OTHER PARENTS LOVE THESE TOO" cards with their own "ADD TO CART" | sticky bar |
| [06](phone-product-06.jpg)–[07](phone-product-07.jpg) | Proof + footer | "Proudly award-winning"; footer | sticky bar |

**CTA position and repetition.** The sticky "ADD TO CART" is on every product screen, and at
360 × 640 it is in the first screen ([small360-product-01](small360-product-01.jpg)), but it carries
no price. Home has no product CTA in its first screen; its buttons route by age.

## Trust devices
- Authority eyebrow ("India's award-winning learning toys") and an origin claim ("Designed by IIT
  Engineers"), then "Made with Wood" and "Loved in 20+ Countries".
- Review counts shown honestly, including "(1)" and "Based on 1 review".
- Reviews that state the child's age and the parent's doubt ("Initially i was doubtful… there were no reviews").
- Payment-method logos next to the buy buttons; an FAQ that answers breakage and origin.

## Offers and guarantees
- Percent off plus strike-through on every price; bundles 10% or 15% off; a cart progress bar "Add
  ₹504 more to get 10% off" with 10% and 15% steps ([cart-01](phone-cart-01-after-add.jpg)).
- Guarantees as short lines under the cart button: "COD available · 10-day no-questions refund · 2 Days
  Express Delivery in Metros".

## Product → cart → checkout (phone, 2026-10-10)
1. "ADD TO CART" opens a cart drawer ([cart-01](phone-cart-01-after-add.jpg)): discount progress bar,
   "Product added to cart successfully", the item, "More toys for ages 8+", then "Delivery Free · To pay
   ₹996 · Total saving on MRP: ₹153" and a purple **"Confirm Order"** button carrying UPI-app icons,
   with "COD available · 10-day no-questions refund · 2 Days Express Delivery in Metros" under it.
2. "Confirm Order" opens the Shopify checkout ([cart-02](phone-cart-02-checkout-first-screen.jpg),
   [cart-03](phone-cart-03-checkout-scroll1.jpg)): "Email or mobile phone number", delivery address with
   PIN code and phone, "Message me on WhatsApp with news and offers", then Payment: "Cashfree Payments
   (UPI, Cards, Int'l cards, Wallets)" and "Cash on Delivery (COD)". **Stopped here.**

Taps from product page to the first details screen: 2.

## India-specific patterns
- **COD** promised on Home (trust strip), in the cart and in checkout.
- **UPI** shown as app logos on the product page and on the cart button; Cashfree in checkout.
- **Delivery:** "2 Days Express Delivery in Metros" in the announcement bar, buy box and cart; no pincode checker.
- **WhatsApp:** phone number in the announcement bar, WhatsApp opt-in in checkout.
- "Total saving on MRP" in the cart. No EMI seen.

## Motion on a phone
- **Elegant:** a short looping hero video of hands building (muted); a calm rotating announcement bar.
- **Busy:** a marquee and a "nudge" animation also run at load (8 animations running on Home).
- No scroll-jacking; carousels move on swipe.

| Lighthouse 13.4.1, mobile, one run (2026-10-10) | Perf | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|
| Home | 52 | 4.5 s | 550 ms | 0.002 | 5,494 KiB |
| Product page | 49 | 5.0 s | 620 ms | 0 | 3,878 KiB |

## Laptop (1440 × 900)
Same sections, wider grid. Product page in two columns: the buy box shows the price, both buttons,
the delivery line and the payment logos in the first screen ([laptop-product-01](laptop-product-01.jpg)).

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** a trust strip directly under the hero (origin, delivery, payment, material), with only
  confirmed facts. Brief §9.1; origin is unconfirmed for Kheelona (F3 in
  [open questions](../../../../open-questions.md), [claims: origin](../../../../product/claims.md#31-origin-designed-and-built-here)).
- **Adopt:** reviews that name the child's age, when real reviews exist (brief §9.8; ages 3 to 7 per
  [positioning: the age correction](../../../../brand/positioning.md#the-age-correction)).
- **Adopt:** payment methods shown as logos next to the CTA, only those Razorpay actually offers
  (F6; [policies: payment methods](../../../../product/policies.md#payment-methods)).
- **Adapt:** the authority eyebrow + outcome headline ("Smarter kids, through play.") is close to SKM's
  frame; Kheelona's version is the brain-development line ([positioning: in one line](../../../../brand/positioning.md#in-one-line)).
- **Adapt:** guarantees as one short line under the button ("10-day no-questions refund"), using the
  token's refund terms from [pricing](../../../../product/pricing.md).
- **Avoid:** a sticky bar that hides the price on the first screen; put the price in the bar
  (brief §9.1; [PostHog audit](../../../../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact) issue 5).

**Most transferable lesson.** Answer the Indian parent's checklist in one line under the button:
Smartivity's cart reads "COD available · 10-day no-questions refund · 2 Days Express Delivery in
Metros" and its product page shows the UPI app logos beside the CTA, so payment, refund and delivery
are settled before the tap.
