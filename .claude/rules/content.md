---
paths:
  - "src/content/**"
---

# Content modules

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- EXTERNAL items only (wiki/site/content-boundary.md); every line traces to wiki/site/pages/<slug>.md or a decision.
- Visible text follows the approved mockup; meta, alt text, full-mode variants follow the copy page.
- Amounts only as {price:…}; delivery as {delivery}; unknown facts as {ph:ID note}; never type ₹.
- FAQs live once in faqs.ts; answer-first blocks 40-60 words; en-IN spelling; ages 3 to 7, never anything implying under 3.
- The stories hub holds slug lists only; an article's card text, related links and dates live in its dashboard post
  (src/content/en-IN/stories/posts.generated.json; never hand-edit it, journal-pipeline §16).
