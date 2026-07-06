# Design Concepts (Phase 2 approval gate)

Three styled homepage concepts, built 2026-07-06. Same locked content on all three (PDF copy verbatim, ₹ standardized), same design tokens (`Design/design-system/`), different visual treatment. The approved concept becomes the visual direction for the full Next.js build.

## How to view
- **Live (scroll them)**: `cd design-concepts && python3 -m http.server 8765`, then open `http://127.0.0.1:8765/concept-a.html` (or `-b` / `-c`). A server may already be running from the build session.
- **Full-page previews**: `preview-concept-a/b/c.png` (desktop 1280px).
- **Mobile harness**: `mobile-preview.html` shows all three at 375px side by side.

## The three concepts
| | A · Storybook | B · Playmat | C · Sunshine |
|---|---|---|---|
| Feel | Warm illustrated storybook (yunastories north star) | Brand-book literal: white canvas + shape clusters | Bold color-blocked editorial |
| Backgrounds | Alternating warm/cool washes, curved dividers | White with 15%-alpha shape clusters bleeding off corners | Full-saturation yellow/blue/ink color blocks |
| Cards | Soft tinted, rounded 22px, no borders | Hairline #CFCFCF borders, 10px radius, no shadows | Saturated color cards, white text |
| Feelings section | Staggered pastel cards | Hairline cards with tinted face chips | Full-color 5-card row (swipe on mobile) |
| Compare table | Warm zebra + orange Lumi column | Hairline table + orange-tint Lumi column | Dark ink section, table as a design moment |
| Mascot staging | Hero wink + floating, teal safety scene | Sitting hero on squircle mat | Dancing hero cropped on yellow, footer lineup |

## Shared, non-negotiable (from the build spec)
- All 11 Home sections in PDF order, blue-box copy verbatim (Rs. → ₹ per prompt §1.10).
- Nav: Lumi, How it works, Safety, Stories, Team + standing "Join the pre-order list" button.
- Footer: full nav + quiet kheelona.ai partner line + contact placeholder.
- Voice-lint clean: zero em-dashes, no hype, exact names.
- Testimonials render as flagged PENDING placeholders (never invented).
- `prefers-reduced-motion` respected; reveal animations degrade to static.

## Asset pipeline notes
- `assets/mascot-*.png` are cutouts produced from `Design/mascot-3d-images/` (white background removed via border flood-fill; interior whites like eyes preserved; stray fragments erased). Tool: scratchpad `cutout.swift` from the 2026-07-06 session; regenerate by re-running it against the originals.
- **Sad card uses the "scared" render** (closest available pose). A true Sad pose from the 3D artist would upgrade it.
- `assets/*--{color}.svg` are brand-shape variants with fill + 15% alpha baked in (originals use `fill="currentColor"`, which does not work in `<img>`).
- `assets/lumi-blue.png` / `lumi-green.png` are trimmed product cutouts (originals were transparent already).
- Fonts are local copies of the design-system variable TTFs. Instrument Serif (eyebrows) loads from Google Fonts; falls back to Georgia italic offline.

## Known trade-offs (fine for concepts, revisit in build)
- Mascot cutouts keep a faint natural ground shadow; on saturated backgrounds (Concept A safety strip) a slight white halo can show at the feet.
- Concept C feelings row horizontally scrolls below 1100px; static 5-col grid above (a `scroll-snap x mandatory` row traps the mouse wheel, so snap is desktop-disabled).
- `body { overflow-x: clip }` (not `hidden`) is load-bearing: `hidden` makes body a scroll container and breaks wheel scrolling.
