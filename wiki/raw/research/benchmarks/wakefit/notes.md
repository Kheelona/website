---
title: "Benchmark capture: Wakefit (wakefit.co)"
type: benchmark-capture
updated: 2026-10-10
sources:
  - "https://www.wakefit.co/ (home; first screen only, captured 2026-10-11 03:13 UTC phone and 03:14 UTC laptop)"
  - "https://www.wakefit.co/mattress/orthopaedic-memory-foam-mattress/WOMFM72605 (product page; captured 2026-10-11 02:30 UTC laptop, 02:45 UTC phone)"
  - "Pincode entry sheet on that page (2026-10-11 02:43 UTC; the public Bengaluru GPO pincode 560001 was typed; nothing else)"
  - "Blocked from 2026-10-11 04:57 UTC: Lighthouse and a browser got a 'UH - OH!' page; curl got a Cloudflare 'Just a moment...' 403 (about 05:01 UTC)"
---

# Wakefit (wakefit.co)

**Why it is here.** An Indian D2C mattress and furniture brand, from the brief's starting set
(brief §6). Indian D2C group. A high-ticket product bought without touching it, sold online with a
long risk-free trial: the nearest Indian pattern to asking a parent for ₹4,999 before shipping.

**How it was captured.** Playwright 1.58.2 (Chromium), Android Chrome user agent, `en-IN`,
Asia/Kolkata, 1x, scrolled viewport chunks; copy from the live DOM text. The site is behind bot
protection: early runs got 403s, and the product page was captured only after a slower retry. On
the phone product page the pincode sheet was hidden (not answered) to capture the folds under it.
**Not captured:** Home beyond its first screen, Add To Cart, the cart and the checkout. From 04:57 UTC
(US-based connection, Cloudflare trace `loc=US`) every request got the "UH - OH! We can't seem to
find the page" page or a Cloudflare challenge, so these could not be completed. No Lighthouse figures
are reported: both runs measured that error page.

| Files | What |
|---|---|
| `phone-home-01.jpg`, `laptop-home-01.jpg` | Home, first screen only |
| `phone-pdp-01.jpg`, `-01b`, `-02..16` | Product page, phone (14,826 px). `01` is as landed, under the pincode sheet |
| `laptop-pdp-01..10.jpg` | Product page, laptop (`01` shows the same pincode modal) |
| `phone-flow-01..03.jpg` | Pincode sheet → public pincode typed → after "Confirm pincode" the page showed "UH - OH!" |

## Home (phone and laptop): first screen only

| Screen | Job | What it says or shows | Proof used | CTA |
|---|---|---|---|---|
| [phone 01](phone-home-01.jpg) | Offer and routes | Strip "Wakefit App is Live - Download and experience our Beta App on Android"; header with search ("Search for Sofa Set"), cart and a ₹0 wallet; category bubbles (Mattress, Beds, Chairs, Sofa, Bedding); hero carousel "Great Indian Home Days / **Sit, feel, decide with 100 days easy return guarantee!** / Office Chairs Starting from ₹3,799"; a ticking **"Sale Ends In: 07 : 15 : 16 : 42"** with bank logos and "Flat 15% OFF"; "Shop By Categories" | The return guarantee | category bubbles and tiles |
| [laptop 01](laptop-home-01.jpg) | Same, plus why us | Adds a **"Why Wakefit?" row: "25 Lakhs+ Customers · Free Shipping · Free Installation · Best Warranty"** | Customer count, service promises | nav, tiles |

**Headline formula.** Sale event + risk reversal + entry price ("Great Indian Home Days / Sit, feel,
decide with 100 days easy return guarantee! / Starting from ₹3,799").

## Product page (phone): fold map

| Screen | Job | What it says or shows | CTA |
|---|---|---|---|
| [01](phone-pdp-01.jpg) | **Pincode gate** | A bottom sheet over the dimmed page: "Enter your pincode to check fastest delivery option / Pincode / We deliver across 12000+ cities / Confirm pincode" (laptop: a centred modal, [laptop-pdp-01](laptop-pdp-01.jpg)) | Confirm pincode |
| [01b](phone-pdp-01b.jpg) | Buy box, top | Gallery with a **"100 Days Free Return"** badge and "4.5 ★ \| 4.86L" (lakh ratings); H1 "Wakefit ShapeSense Orthopedic Classic Memory Foam Mattress \| 10 Years Warranty"; **"Choose Series" good-better-best cards with "Compare Series"**: Essential "Best Value" ~~₹12,670~~ ₹7,838 "With bank offer ₹7,054"; Classic "Bestseller" ~~₹16,665~~ ₹8,436 "With bank offer ₹7,592"; Infiniti "Advanced" ₹16,611 | none in this screen |
| [02](phone-pdp-02.jpg) | Size, delivery, pay | "Price inclusive of all taxes"; "Choose Size / Order any size: Queen \| 72" x 60" x 5"" with "Confirm … size fits your bed before purchasing"; "Enter Pincode"; "BIGDAYS sale ends on 18th Oct"; offer cards: "Lowest Price ₹2,450/months(3) EMI", "Card Offer ₹7,592", "UPI-Snapmint ₹2,812/months(2) No Cost EMI" (the DOM also lists "UPI Offer ₹8,269" and "GST Offer: 18% Off on business purchases"); **"Try for 100 Days / Not satisfied? Get your money back"** | **Sticky bar from here on: "Choose Size" (outline) + "Add To Cart" (filled)** |
| [02](phone-pdp-02.jpg)–[03](phone-pdp-03.jpg) | Why buy direct | "Exclusive purchase perks only at Wakefit.co": a table, Benefits × "Wakefit.co & Stores" × "Other Platforms" (100 Days Free Trial, "Upto 2% Assured Cashback", "Free Next Day Delivery", "See more") | sticky bar |
| [03](phone-pdp-03.jpg)–[04](phone-pdp-04.jpg) | How it is made | "Built Layer by Layer for Better Back Support" (four numbered layers); "The Sweet Spot Between Comfort and Support" (a firmness scale, Soft to Firm, this one Medium Firm) | sticky bar |
| [04](phone-pdp-04.jpg)–[05](phone-pdp-05.jpg) | Assisted routes | "More ways to explore": "Live Product Demo", "Store Near Me", "Chat with us"; "Find my Mattress" (a quiz); "Customer Testimonials" (video) | sticky bar |
| [06](phone-pdp-06.jpg) | Objections | FAQs: "What thickness is suited…", "How is the mattress delivered?", "Is the mattress cover water proof?", "Can I use the mattress immediately or should I put out the mattress in the sun for any smells to go?"; "View All FAQ's" | sticky bar |
| [07](phone-pdp-07.jpg)–[08](phone-pdp-08.jpg) | Cross-sell | "You May Also Like", "Similar Products" (screen 07 was still a skeleton) | sticky bar |
| [09](phone-pdp-09.jpg)–[13](phone-pdp-13.jpg) | SEO | Long copy ("The Design Of Orthopedic Mattress", "Buy Memory Foam Mattress Online From Wakefit": "we have serviced over 8 lakh customers, sold over 18 lakh products…"), a long FAQ | sticky bar |
| [13](phone-pdp-13.jpg)–[16](phone-pdp-16.jpg) | Footer | "Payment, Returns & Refunds", "Warranty"; **"Contact us at +91 … / We are here to help you every day between 9:30 AM to 7:30 PM"**; "Registered Office, Manufacturer & Packer" with address; CIN | sticky bar |

**CTA position and repetition.** The first phone screen is the pincode sheet, then a buy box with no
button; the sticky "Choose Size / Add To Cart" bar appears from the second screen and stays to the
end. So the primary CTA is **not** in the first phone screen.

## Trust devices
- Risk reversal stated three times in plain words: "100 days easy return guarantee" (home hero),
  "100 Days Free Return" (gallery badge), "Try for 100 Days / Not satisfied? Get your money back"
  (buy box). Warranty length in the product name ("10 Years Warranty").
- Rating volume in Indian units ("4.86L"), customer counts ("25 Lakhs+ Customers").
- A direct-versus-marketplace perks table; stores, a live demo and chat as routes to a person.
- Support hours and the manufacturer's address in the footer.

## Offers and guarantees
- Strike-through prices with percentages; a bank-offer price under every series price; EMI shown as
  the "Lowest Price"; sale countdowns and an end date ("BIGDAYS sale ends on 18th Oct").
- The guarantee is framed as a trial ("Try for 100 Days"), not as a return policy.

## Product → cart → checkout (phone)
1. On entry, the pincode sheet ([flow-01](phone-flow-01-pdp-pincode-sheet.jpg)).
2. With the public pincode 560001 and "Confirm pincode" ([flow-02](phone-flow-02-pdp-pincode-typed.jpg)),
   the page became "UH - OH! We can't seem to find the page you are looking for / Go To
   Orthopaedic-Memory-Foam-Mattress" ([flow-03](phone-flow-03-pdp-after-pincode.jpg)). Whether this is
   bot protection or a real dead end for that pincode could not be told apart.
3. Add To Cart, cart and checkout: **not captured** (see above).

## India-specific patterns
- **Pincode first**: a delivery check demanded before the page can be read ("We deliver across
  12000+ cities").
- **EMI and no-cost EMI** (including "UPI-Snapmint"), card and UPI offers, a **GST offer for
  businesses**, all in the buy box.
- Phone support with stated hours; "Store Near Me" and a "Live Product Demo".
- COD and WhatsApp: not seen in the captured pages; "Chat with us" is an on-site chat.

## Motion on a phone
- **Jumpy:** content moved a great deal while the product page loaded and scrolled (layout-shift
  total 3.00 in the phone capture session and 2.02 on laptop; not Lighthouse CLS); screen 07 was
  still a skeleton.
- **Gimmicky:** ticking sale countdowns; four autoplaying videos on the product page.
- **Blocking:** a modal sheet over the product page on arrival.
- No Lighthouse figures (error page; see above). The CSS has one `prefers-reduced-motion` rule.

## For Kheelona (candidates for the adopt / adapt / avoid list)
- **Adopt:** the risk reversal in plain words, repeated where the decision happens (hero, gallery,
  buy box). Kheelona's is the refundable ₹499 token ("₹499 reserves it, refundable until we ship",
  [audience: buying triggers](../../../../brand/audience.md#buying-triggers)), rendered from the store's
  source ([pricing](../../../../product/pricing.md)) and only with confirmed refund terms
  ([policies](../../../../product/policies.md)).
- **Adapt:** "More ways to explore" (demo, store, chat) as one quiet row near the FAQ: for Kheelona,
  WhatsApp and Bengaluru demos ([positioning: outside the website](../../../../brand/positioning.md#outside-the-website-summary)).
- **Avoid:** a pincode gate, or any modal, before the product page can be read: 35.7% of phone
  sessions arrive in WhatsApp's in-app browser, where a blocking sheet costs the first screen
  ([PostHog audit §11](../../../../research/posthog-audit.md#11-devices-browsers-and-screen-sizes-for-qa);
  brief §9.1, §9.10).
- **Avoid:** EMI framed as "Lowest Price", bank-offer prices beside the real price, and countdowns.

**Most transferable lesson.** Wakefit sells a high-ticket product sight unseen by repeating one
plain risk reversal at every decision point ("Try for 100 Days / Not satisfied? Get your money
back"); Kheelona should repeat its refundable-token promise the same way, while avoiding Wakefit's
pincode gate in front of the page.
