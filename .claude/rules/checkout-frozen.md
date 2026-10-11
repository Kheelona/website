---
paths:
  - "src/lib/store/**"
  - "src/app/api/**"
  - "src/proxy.ts"
  - "src/features/preorder/**"
  - "src/lib/email/**"
  - "src/app/store/**"
---

# Checkout is frozen

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- Checkout logic is frozen (ADR-013): logic files byte-identical to archive/pre-reset-2026-10-10; presentation files change markup, classes, copy and presentation imports only.
- The six checkout test files change only by literal-only reviewed patches; the JSX contract fixtures are never edited; a restyle regenerates its file's logic signature and the diff is reviewed.
- Any other change needs a founder decision ID in the commit and an updated reviewed patch.
- Run test/guards/checkout-*.test.ts(x) and `npm run qa:payment` (test keys only; never a real order).
