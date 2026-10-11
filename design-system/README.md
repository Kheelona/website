# Kheelona design system (v11, exported 10 Oct 2026)

Open **index.html** in any browser to browse everything offline. Keep the folder together: the pages load files from `project/` and `site/`.

## What's inside

| Folder | What it holds |
|---|---|
| `index.html` | The start page of the offline site |
| `site/home-page.html` | The whole sample home page (the three home page templates on one page). Narrow the window to see the phone layout |
| `site/` | The offline site: brand book, components with live previews, page templates, assets and tokens |
| `project/` | The design system's own files, exactly as published |
| `project/README.md`, `project/00-…10-….md` | The brand book: Overview, How to use this system, Writing, Photography, chalk & crayon, The cast, Kheelu, Making new assets, Surfaces, Selling, Accessibility & inclusion, Making cast photos, Pages |
| `project/tokens.json`, `project/tokens.css` | Every token (colour in Day and Bedtime, type, spacing, radius, shadow, size, stroke, motion, layers), and the same as CSS variables |
| `project/components/` | `bundle.js` (React components on `window.Kheelona`), `bundle.css` (every `kh-` class), `index.d.ts` (every prop), and a folder per component with its guidelines (`README.md`) and preview (`preview.html`) |
| `project/fonts/` | Baloo 2, Nunito and Kalam (SIL Open Font License) |
| `project/assets/` | 224 files with their real names (48.7 MB): Logo (14), Kheelu (5), Cast (28), Photo library (50), Doodles (32), Crayon (10), Shapes (9), Icons (76) |
| `project/tools/` | Scripts for new cast photos (face check, page-text clean-up, export, photo log) and for rebuilding `tokens.css` |
| `renders/` | Images of the home page (desktop and phone), the parent app screens and the campaign kit |

## Notes

- The previews inside `project/components/*/preview.html` are the design system's own files and expect its web runtime. The working offline copies are `site/live-*.html`.
- Photos: use the `.jpg` files for print and decks, and the `-web.webp` files on the web. The children are illustrative (AI-generated): never present them as customers.
- React 18.3.1 (MIT licence) is included in `site/runtime/` so the previews work offline.
- The web version on claude.ai is the source of truth. If this copy and the web disagree, the web wins.
