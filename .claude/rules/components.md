---
paths:
  - "src/components/**"
  - "src/layouts/**"
---

# Components and layouts

Source: wiki/engineering/structure.md §9 (Phase 4 plan, 2026-10-12).

- Check wiki/engineering/components.md first; extend a variant before creating anything.
- Markup and classes follow the approved mockup; DS `kh-` classes and DS tokens only; composition classes are `ks-`.
- No Tailwind arbitrary values, no `(--var)` shorthand, no hex, no px, no inline styles (art-board %, --kh-tilt and --kh-ratio only); the only literals are in test/guards/token-exceptions.ts.
- Motion only through the class contract in architecture §11.3 (data-reveal, data-draw, ks-btn__arrow, ks-faq__clip, is-focus); never an entrance on a hero, h1, price, chilli button or offer card; hero doodles stay still.
- Data by props; no copy, prices or URLs typed in a component. CTA buttons use PreorderButton with a CtaId.
- No mk- class, data-src attribute or review-tool markup in shipped HTML.
- Images: no `priority` prop (deprecated in Next 16); the one LCP image uses loading="eager" and fetchPriority="high".
- Ship Name.test.tsx (and Name.stories.tsx for ui/ and sections/); update your catalogue row in the same commit.
