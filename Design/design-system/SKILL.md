---
name: kheelona-design
description: Use this skill to generate well-branded interfaces and assets for Kheelona, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `ui_kits/`, `slides/`).

**Kheelona in one sentence.** AI-powered, screen-free educational toys for kids 3–12 — Pixar-feeling characters built from rounded geometric shapes with cartoon faces, anchored by an orange + sky-blue palette and the Glory / Instrument Sans type pair.

If creating visual artifacts (slides, mocks, throwaway prototypes, marketing pages):
- Copy assets out of `assets/` (logo, shapes, hero illustration) into the new artifact rather than referencing them across folders.
- Pull tokens from `colors_and_type.css` — do not invent new hex values or typefaces.
- The brand voice talks UP to parents and ALONGSIDE kids — never baby-talk, never emoji, never hype-marketing.
- The decorative "playmat cluster" (a 3×3 of 15%-alpha brand shapes bleeding off a corner) is the only background motif. Use it sparingly — never on consecutive spreads.
- For functional UI icons, use Lucide via CDN at stroke-width 2. For decorative iconography, compose from the shape + face primitives.

If working on production code, copy assets and read the rules in `README.md` to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface, what success looks like, variations), and act as an expert designer who outputs HTML artifacts _or_ production code depending on the need.

## Quick start checklist

1. Link `colors_and_type.css` (and the local `fonts/` if creating production code).
2. Use semantic CSS variables: `var(--kh-orange)`, `var(--kh-font-display)`, `var(--kh-shadow)`, etc.
3. For mascots / characters, mask a brand shape via `assets/shapes/*.svg` and overlay an inline SVG face (see `ui_kits/marketing/components.jsx` → `Character`).
4. Headings use Instrument Sans 700 with tracking −2% to −3%. Body uses Instrument Sans Regular with normal tracking.
5. Buttons are pill-rounded with a 2px white inset border and the default shadow.
6. Cards use a 1px `#CFCFCF` border and a 10px radius — no shadow unless floating above another card.
