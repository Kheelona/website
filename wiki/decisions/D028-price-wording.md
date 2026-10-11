---
title: "D028: Price wording: lead with ₹499 next to the CTA, always state the ₹4,999 total in the same sentence; machine outputs lead with ₹4,999"
type: decision
updated: 2026-10-11
sources: ["founder's answer to R10, 2026-10-11 (option a)", ../product/pricing.md, D024-payment-methods-gst.md]
---

# D028: How the price is written

**Context.** Bing's AI said Kheelu is "priced at ₹499", most likely from "₹499 reserves it"
wording. The DS selling guide says lead with the barrier price and show the full price nearby.

**Choice (founder, 2026-10-11, option a).**
- **Next to the CTA:** lead with ₹499, and in the SAME sentence say the total. Draft: "Reserve for
  ₹499 today. Kheelu is ₹4,999 in total (incl. GST); the remaining ₹4,500 is due before delivery."
  ("Refundable" is stated beside the advance wherever the advance appears.)
- **Everything machines read** (Product JSON-LD, `llms.txt`, `pricing.md`, page titles and meta
  descriptions, ad text): lead with ₹4,999 (incl. GST); the advance comes second.
- **Every amount renders from the checkout's own source** ([pricing](../product/pricing.md)), never
  hand-typed, so the wording stays true in both offer modes (token now; ₹7,999 paid in full after
  the first 500, when there is no advance to mention). How price display follows the live mode is
  Gate A item G9.

This closes R10 (the Kheelona+ half was [D027](D027-story-mode-wording.md)).

**Approved by.** Founder. **Date.** 2026-10-11.
