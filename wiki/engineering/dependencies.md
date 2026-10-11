---
title: "Dependency register (revised after QA round 1)"
type: catalogue
updated: 2026-10-12
sources:
  - ../raw/brief/kickoff-brief.md (§9.12 "Don't reinvent the wheel", licence and popularity rules)
  - adr/ADR-001-keep-the-stack.md, adr/ADR-007-motion-css-first.md, adr/ADR-010-media-pipeline.md, adr/ADR-011-guardrails-and-qa-harness.md
  - package.json, package-lock.json (reset/website-v2, 2026-10-12)
  - "node -p require('<pkg>/package.json').version and .license for each installed package; du -sh node_modules/<pkg>; grep of runtime imports in src/ excluding tests and stories (2026-10-12)"
  - lessons.md (§8 --save-exact, never a bare npm install, read the lockfile diff)
  - ../qa/test-plan.md (§1.2 tool versions), ../qa/architecture-review-2026-10-12.md
  - "test/dependency-floor.test.ts (transitive floors on postcss, sharp, nanoid, js-yaml, brace-expansion, fflate, browserslist; banned image-size); npm ls fflate (only via @react-three/drei and @types/three), 2026-10-12"
---

# Dependency register

Every library the site and its tooling use, why, what else was considered, its licence and size, and
its verdict for the reset. Brief §9.12 order: DS → native platform → the stack → very popular,
maintained, permissively licensed, light or tree-shakeable libraries → custom code (with the reason).
One library per job. **Installs:** by name only, `--save-exact`, lockfile diff read (lessons §8); never a
bare `npm install`. **Audit:** `npm audit` at every QA gate. Versions below are the installed ones;
"pin" means the exact version is written to `package.json` when the task touches it.

Size column: installed size on disk (not what ships); "ships" says what reaches a phone.

## 1. Runtime dependencies

| Package | Version | Licence | Size / ships | Why | Alternatives considered | Verdict |
|---|---|---|---|---|---|---|
| `next` | 16.3.4 (pinned) | MIT | 198 MB / framework runtime | The stack (brief §2) | none (no blocker found) | **Keep** |
| `react`, `react-dom` | 19.2.4 (pinned) | MIT | 7.1 MB / runtime | The stack | none | **Keep** |
| `@supabase/supabase-js` | 2.112.3 (`^`) | MIT | 8.6 MB / server only | Store database (frozen checkout) | none | **Keep**; pin exact in task 6.3 |
| `posthog-js` | 1.434.2 (pinned) | Apache-2.0 AND MIT | 28 MB / dynamic import after the host check | Tracking parity (inventory §6) | none (parity) | **Keep** |
| `posthog-node` | 5.52.4 (pinned) | MIT | 1.3 MB / server only | `purchase_confirmed` (inventory §7) | none | **Keep** |
| `@vercel/analytics` | 2.0.1 (`^`) | MIT | 620 KB / small script | Tracking parity (inventory §1) | none | **Keep**; pin exact in 6.3 |
| `@next/third-parties` | 16.2.12 (`^`) | MIT | 68 KB / GA4 loader | GA4 as documented by Next (inventory §3) | raw gtag snippet | **Keep**; pin exact in 6.3 |
| `clsx` | 2.1.1 (`^`) | MIT | 40 KB / < 1 KB | Conditional class joining, imported directly by new components (no wrapper) | template strings | **Keep**; pin exact in 6.3 |
| `tailwind-merge` | 3.6.0 | MIT | 1.0 MB | Only the legacy `src/lib/cn.ts` uses it (32 legacy files and, until 5.15 and 5.16, the checkout forms); with a layout-only Tailwind (ADR-002) utilities never conflict | `clsx` alone | **Retire** with `cn.ts` (6.3) |
| `motion` | 12.42.2 | MIT | 772 KB | Old components only (2 imports) | CSS presets + one observer (ADR-007); every D049 pick is CSS (stroke-dashoffset, grid rows on `::details-content`, transforms) | **Retire** (6.3) |
| `three`, `@react-three/fiber`, `@react-three/drei` | 0.185.1, 9.6.1, 10.7.7 | MIT | 25 MB + 5.1 MB | 0 imports; the 3D stage was deleted in Phase 0 | none needed | **Retire** (6.3). They (with `@types/three`) bring the only copies of `fflate`, so 6.3 also drops the `fflate` floor in `test/dependency-floor.test.ts`, with `npm ls fflate` empty as evidence; no other floor changes |
| `zustand` | 5.0.14 | MIT | 252 KB | 0 imports | none needed | **Retire** (6.3) |
| `lucide-react` | 1.24.0 | ISC | 39 MB | Old components only (9 imports); brief §9.12 allows one icon set | DS icons, generated (ADR-010) | **Retire** (6.3) |
| `@radix-ui/react-accordion`, `@radix-ui/react-dialog` | 1.2.16, 1.1.19 | MIT | 1.2 MB | Old components only | native `<details>` and `<dialog>` (DS, brief §9.12) | **Retire** (6.3) |

## 2. Development dependencies

| Package | Version | Licence | Size | Why | Alternatives considered | Verdict |
|---|---|---|---|---|---|---|
| `tailwindcss`, `@tailwindcss/postcss` | 4.3.2 (`^4`) | MIT | 840 KB, 3.1 MB | The token bridge's layout utilities (ADR-002) | DS CSS only | **Keep**; pin exact in 1.1 |
| `typescript` | 5.9.3 (`^5`) | Apache-2.0 | | Types | none | **Keep** |
| `eslint`, `eslint-config-next` | 9.39.4, 16.3.4 | MIT | | Lint, `no-restricted-imports` for the content boundary | none | **Keep** |
| `vitest` | 4.1.11 | MIT | 2.9 MB | Unit, component and guard tests | Jest | **Keep** |
| `@testing-library/react`, `jest-dom`, `user-event`, `jsdom` | 16.3.2, 6.9.1, 14.6.7, 27.4.0 | MIT | | Component tests | none | **Keep** |
| `@vitejs/plugin-react`, `vite-tsconfig-paths` | 6.0.3, 5.1.4 | MIT | | Vitest and Storybook transforms; `vite-tsconfig-paths` is unused by `vitest.config.ts` today | explicit aliases | **Keep** `@vitejs/plugin-react`; **retire** `vite-tsconfig-paths` if still unused after 1.1 |
| `storybook`, `@storybook/nextjs-vite`, `@storybook/addon-a11y`, `@storybook/addon-docs` | 10.6.0 | MIT | 22 MB + 6.1 MB | Workbench for primitives and sections (ADR-011) | none (already in the stack) | **Keep** |
| `@types/node`, `@types/react`, `@types/react-dom` | as installed | MIT | | Types | | **Keep**; `@types/three` **retire** (6.3) |
| `@playwright/test` | latest stable at install, pinned | Apache-2.0 | browser download | Visual and text parity, axe runs, sideways scroll on the viewport matrix, perf bytes, motion cases, tracking probes, redirects (ADR-011); today borrowed from the npx cache | puppeteer-core (used by `tools/qa/` today) | **Add** (1.1) |
| `@axe-core/playwright` with `axe-core` 4.12.1 | pinned at install | MPL-2.0 | 2.9 MB | Accessibility checks; the brief names axe-core for QA (§6); 4.12.1 is the baseline's engine, so before and after compare | none comparable | **Add** (1.1). Licence note: MPL-2.0 is not in §9.12's permissive list; test-only, never shipped, named by the brief, so recorded as an accepted tooling exception |
| `jscpd` | pinned at install | MIT | | Copy-paste detector (brief §9.12 "QA") | none | **Add** (1.1) |
| `lighthouse` | 13.4.1, pinned | Apache-2.0 | | Lighthouse medians in `scripts/qa/lighthouse.mjs` (brief §9.5); 13.4.1 is the baseline's version | PageSpeed API (needs a key and the live URL) | **Add** (1.1). It brings many transitive packages: `test/dependency-floor.test.ts` must stay green without edits (npm `overrides` if a copy falls below a floor, or drop it and report) |
| `sharp` | 0.35.4, pinned as a direct dev dependency | Apache-2.0 | 1.3 MB + 26 MB native | `build-og.mjs` (crops and the K-mark PNG); already present as Next's optional dependency (and a transitive floor in `dependency-floor`), imported directly only with an explicit entry | none | **Add** explicitly (1.1) |
| `subset-font` | pinned at install | verify at install (expected BSD-3-Clause or MIT) | | Latin and Devanagari subsets of the DS fonts (`build-fonts.mjs`, task 1.2); a family whose OFL text declares a Reserved Font Name ships as a byte-identical copy instead | `fonttools` (Python, not in the Node toolchain); byte-identical copies (no subset) | **Add** (1.1, which owns `package.json` in wave 1). If its licence is not permissive, 1.1 stops and asks the main session |

## 3. Platform features used instead of libraries

| Need | Native feature | Brief reference |
|---|---|---|
| FAQ accordion and its smooth open (D049 pick 7) | `<details>` and `<summary>` (DS FAQ); `::details-content` with a `grid-template-rows` transition where supported, instant elsewhere | §9.12 rung 2 |
| Menu drawer | `<dialog>` with `showModal()` and `::backdrop` | §9.12 rung 2 |
| Film carousel | CSS scroll-snap plus two buttons | §9.12 rung 2 |
| Reveals, doodle draws, films focus, sticky bar visibility | `IntersectionObserver`, CSS transitions and keyframes (`stroke-dashoffset` with `pathLength="1"` for the doodles) | §9.11 |
| Images | `next/image` (AVIF, WebP, srcset) | §9.12 rung 3 |
| Redirects, rewrites, headers | `next.config.ts`, `src/proxy.ts` | rung 3 |
| Caching the live mode | `unstable_cache` and route `revalidate` (Next's previous caching model) | rung 3 |
| Structured data | hand-built JSON-LD with escaping (`src/lib/seo/jsonld.ts`), no schema library | rung 5, small and already proven in `src/lib/seo.ts` |
| Rich text in content | a small inline parser (`src/lib/content/rich-text.ts`) instead of MDX | rung 5: one syntax, a plain-text serialiser for JSON-LD, no new build step (ADR-004) |
| Product details | three stacked panels as approved, no JavaScript (N21); a tabs island only if the founder asks later | rung 1 |

## 4. Rules for adding a library later

A new row here first: the job, why the DS, the platform and the stack cannot do it, two alternatives,
licence (MIT, Apache-2.0, BSD or ISC), maintenance (a release in the last six months), weekly downloads
among the top in its category, and its shipped size. Libraries never bring their own look (no styled UI
kits); headless only. The QA gate runs `npm audit` and fails on high or critical advisories in runtime
dependencies.
