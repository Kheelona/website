---
title: "D037: Product JSON-LD availabilityStarts = 2026-11-15"
type: decision
updated: 2026-10-11
sources: ["founder's answer to F15, 2026-10-11 05:50 PDT", D023-new-order-delivery.md, ../product/pricing.md, ../product/legal-requirements.md]
---

# D037: The first-delivery date in structured data (F15)

**Context.** [D023](D023-new-order-delivery.md): new orders deliver from mid-November 2026. The
Product JSON-LD `Offer.availabilityStarts` takes a date, not "mid-November"; production's is
`2026-10-20` (held until Gate B, [D011](D011-production-held-until-gate-b.md)).

**Options.** Leave the date out of the schema (recommended, because the BIS licence is pending);
15 Nov 2026; 30 Nov 2026.

**Choice: 15 November 2026** (`availabilityStarts: 2026-11-15`) on the new site. Page text keeps
"Deliveries start mid-November" (D023), from the same content source as the date.

**Risk recorded.** E-Commerce Rule 7(4) bars refusing a refund for goods "delivered late from the
stated delivery schedule"; a published date that slips gives buyers that claim (the terms already
promise a full refund if the date moves). The BIS licence is under application (L1), and no copy may
make the date depend on it. The existing-order part of F15 is operational
([D030](D030-questions-scoped-to-the-website.md)).

**Approved by.** Founder. **Date.** 2026-10-11.
