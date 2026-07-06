# Kheelona Marketing UI Kit

A clickable, hi-fi mock of the Kheelona marketing website — the one product surface implied by the brand book (no app code exists yet).

## Files

- `index.html` — the page itself (loads React via UMD + Babel, no build step).
- `components.jsx` — small reusable atoms: `Logo`, `Character`, `Shape`, `Marker`, `Tick`, `Cluster`, `Button`, `IconBadge`.
- `sections.jsx` — page sections: `Header`, `Hero`, `Story`, `ValueGrid`, `ProductCard`, `Audience`, `CTA`, `Footer`.
- `app.jsx` — composes the sections into a single page.

## What's interactive

- **Header nav** scrolls to the target section.
- **"Meet Kheelo" CTA** opens a fake order modal (just visual — no backend).
- **Newsletter input** validates and shows a success state inline.
- **Hover states** on cards, characters wobble slightly on hover.

## Caveats

- No real product photography exists — the kid illustration is the only photographic asset in the source Figma. The `ProductCard` uses a composed Character mascot in place of a product shot. Flagged.
- Functional icons use Lucide via CDN (substitution flag — see iconography card in design system).
- Copy is mostly lifted verbatim from the Figma's brand pages, lightly recomposed for a web context.
