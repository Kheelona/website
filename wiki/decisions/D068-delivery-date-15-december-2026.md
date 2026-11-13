---
title: "D068: Deliveries start 15 December 2026"
type: decision
updated: 2026-11-10
sources: ["the founder's decision of 2026-11-10", D023-new-order-delivery.md, D037-delivery-date-in-schema.md, ../product/facts.md, ../product/claims.md, ../qa/deviations.md]
---

# D068: The public delivery date moves to 15 December 2026

**Context.** [D023](D023-new-order-delivery.md) set the public delivery line to "Deliveries start
mid-November" (2026) and [D037](D037-delivery-date-in-schema.md) set its structured-data date to
`2026-11-15`. The date has to be one the company can keep.

**Choice (the founder, 2026-11-10).** 15 December 2026 is the date to promise publicly. The wording is
exactly **"Deliveries start 15 December 2026"** (lower case, "deliveries start 15 December 2026", in the
middle of a sentence), and the Product JSON-LD `Offer.availabilityStarts` is `2026-12-15`. This supersedes
the date in D023 and D037 only.

**Unchanged.** The ₹499 refundable advance and every other term of D023: new orders, the order of
dispatch ("Pre-orders are served first, in the order they were placed"), delivery included anywhere in
India, no cash on delivery. The line still says "deliveries start", never an arrival date or a transit
time ([D022](D022-warranty-replacement-refund.md)). An order placed before 10 October 2026 keeps the line
it was sold with ([D054](D054-founder-answers-open-questions-2026-10-14.md) item 1); that split is untouched.

**Where it lives.** One content value, `DELIVERY_TEXT` (`src/content/en-IN/delivery.ts`), with
`DELIVERY_SCHEMA_DATE`, rendered by the store, `/thanks`, the receipt of a new order and the store's legal
content. The marketing pages are the redesign's HTML, so its sources, `seo.json`, `llms.txt`, `pricing.md`
and the story generator carry the same words, and the committed outputs are rebuilt. The change is the date
and nothing else: titles, canonicals, URLs and the pages' "updated" dates stay as they were (the legal pages
keep the founder's approved text and date, [D067](D067-legal-pages-approved-final-2026-10-22.md); only the
delivery sentence moves).

**Guard.** The retired date is banned in delivery wording by the `delivery-mid-november` entry of
`test/guards/banned-phrases.data.ts` ([claims §4](../product/claims.md)). It is scoped to delivery words, not
every "mid-November", because the journal sync fails the build on a banned phrase and a post about the
weather or a festival must pass. `llms.txt` names the old dates once, to say they are out of date. The
frozen mockups (D046) still print the old line, so the build's parity layer reads them with this date
applied (deviations V69).

**Risk recorded (kept from D037).** E-Commerce Rule 7(4) bars refusing a refund for goods "delivered late
from the stated delivery schedule"; a published date that slips gives buyers that claim, and the terms
already promise a full refund if the date moves. Any further move of the date goes back to the founder.

**Approved by.** Founder. **Date.** 2026-11-10.
