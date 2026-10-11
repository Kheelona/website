---
paths:
  - "src/styles/**"
  - "src/motion/**"
  - "scripts/assets/**"
---

# Styles, motion and asset scripts

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- design-system/ is read-only; derivatives are generated outside it by scripts/assets/*.
- The Tailwind theme maps DS roles, spacing and the four DS breakpoints only; nothing else.
- Motion: transform and opacity only, DS duration and easing tokens, neutralised under prefers-reduced-motion; the only exceptions are stroke-dashoffset in .ks-doodle rules and grid-template-rows in .kh-faq__item::details-content (D049, ADR-007).
- Generated files are never edited by hand.
