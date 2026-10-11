---
title: "D023: New orders: same ₹499 advance, deliveries start mid-November 2026"
type: decision
updated: 2026-10-10
sources: ["founder, 2026-10-10: 'For any new order delivery will start in mid Nov. We can keep same advance of ₹499 with new delivery date.'", ../product/pricing.md, ../site/checkout.md]
---

# D023: Delivery for new orders

**Confirmed by the founder (2026-10-10):** for any **new** order, delivery starts **mid-November
2026**, with the **same ₹499 advance** (the token offer and its pricing logic are unchanged; brief 4.4).

**EXTERNAL draft line (final sign-off at Gate A, D015):** "Reserve Kheelu with ₹499 today.
Deliveries start mid-November." The date is ONE content value (Phase 4 content model) that every
surface renders, so it can be moved as the launch approaches; never hand-typed.

**Not stated, so not published:** whether existing token orders still dispatch from 20 October,
and when and how token holders receive the ₹4,500 balance link (F12, still open).

**Live-site risk raised with the founder:** production renders `SHIP_DATE_TEXT` ("20 October
2026") on the marketing pages and in the store, and is held until Gate B (D011). From 20 October a
new buyer would read a date that has already passed.

**Founder's decision on that risk (2026-10-10): keep holding (option b).** New buyers keep seeing
"20 October 2026" in checkout and in their receipt email until the new site launches. Accepted
risk; do not re-raise. The new site renders the mid-November date from its content source.

**Approved by.** Founder. **Date.** 2026-10-10.
