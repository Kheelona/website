# Structure Map — POC → production reorg (2026-07-11)

This is the authoritative record of the production-structure sprint that made `site/`
compliant with [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) and
[`COMPONENT_GUIDELINES.md`](./COMPONENT_GUIDELINES.md). It maps every file's old location to
its new one so any stale path reference elsewhere can be resolved here.

**Hard rule of the sprint:** zero user-facing change. Only file locations, import
specifiers, and new dev-only files (Storybook/tests) changed. No JSX/CSS body was edited.

## Top-level move

Everything application code moved under `site/src/`. `public/`, all config files
(`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`,
`package.json`) stay at `site/` root (Next.js requirement). The path alias changed from
`@/* → ./*` to `@/* → ./src/*`, so aliased imports whose post-`@/` path is unchanged keep
working automatically.

## Components → atomic design

Classification follows the verified import graph (who imports whom). Single-route/single-
feature UI is colocated; multi-route UI is a global organism.

| Old path | New path | Level / reason |
|---|---|---|
| `components/ui/Button.tsx` | `src/components/atoms/Button.tsx` | atom |
| `components/ui/Eyebrow.tsx` | `src/components/atoms/Eyebrow.tsx` | atom |
| `components/ui/Shapes.tsx` | `src/components/atoms/Shapes.tsx` | atom (inline brand SVGs) |
| `components/layout/Container.tsx` | `src/components/atoms/Container.tsx` | layout atom |
| `components/layout/Section.tsx` | `src/components/atoms/Section.tsx` | layout atom (`[data-wash]` runtime contract, no import coupling) |
| `components/layout/Beat.tsx` | `src/components/atoms/Beat.tsx` | layout atom |
| `components/layout/CurveDivider.tsx` | `src/components/atoms/CurveDivider.tsx` | layout atom |
| `components/ui/Card.tsx` | `src/components/molecules/Card.tsx` | molecule (§8.19) |
| `components/ui/SectionHeading.tsx` | `src/components/molecules/SectionHeading.tsx` | molecule (§8.19) |
| `components/ui/StepList.tsx` | `src/components/molecules/StepList.tsx` | molecule (§8.19) |
| `components/ui/CheckList.tsx` | `src/components/molecules/CheckList.tsx` | molecule (§8.19) |
| `components/ui/PhoneFrame.tsx` | `src/components/molecules/PhoneFrame.tsx` | molecule |
| `components/ui/KheeluSays.tsx` | `src/components/molecules/KheeluSays.tsx` | molecule (narrator device) |
| `components/ui/Faq.tsx` | `src/components/molecules/Faq.tsx` | molecule (Radix accordion) |
| `components/ui/CompareTable.tsx` | `src/components/molecules/CompareTable.tsx` | molecule |
| `components/ui/TallyEmbed.tsx` | `src/components/molecules/TallyEmbed.tsx` | molecule |
| `components/ui/Reveal.tsx` | `src/components/molecules/Reveal.tsx` | molecule |
| `components/ui/RevealObserver.tsx` | `src/components/molecules/RevealObserver.tsx` | molecule (scroll-reveal effect) |
| `components/ui/Sheet.tsx` | `src/components/molecules/Sheet.tsx` | molecule (Radix dialog drawer) |
| `components/ui/TiltCard.tsx` | `src/components/molecules/TiltCard.tsx` | molecule |
| `components/layout/Navbar.tsx` | `src/components/organisms/Navbar.tsx` | organism (root layout) |
| `components/layout/Footer.tsx` | `src/components/organisms/Footer.tsx` | organism (root layout) |
| `components/layout/StickyMobileCTA.tsx` | `src/components/organisms/StickyMobileCTA.tsx` | organism (root layout) |
| `components/sections/shared/FinaleCTA.tsx` | `src/components/organisms/FinaleCTA.tsx` | organism (7 routes + LegalDoc) |
| `components/sections/shared/ParentQuotes.tsx` | `src/components/organisms/ParentQuotes.tsx` | organism (home + lumi) |
| `components/sections/shared/RecognitionStrip.tsx` | `src/components/organisms/RecognitionStrip.tsx` | organism (home + team) |
| `components/mascot/MascotScene.tsx` | `src/components/organisms/MascotScene.tsx` | organism (5 routes) |
| `components/ui/PageHero.tsx` | `src/components/templates/PageHero.tsx` | template (interior page skeleton) |
| `components/ui/LegalDoc.tsx` | `src/components/templates/LegalDoc.tsx` | template (legal page skeleton) |
| `components/vendor/animate-ui/**` | `src/components/vendor/animate-ui/**` | vendored (outside atomic taxonomy) |

## Home sections → `features/home/` (imported only by `app/page.tsx`)

`Hero, HeroConversation, KheeluIntro, WhyWeExist, LaunchVideo, Feelings, MeetLumi,
WhatLumiDoes, HowItWorks, Compare, SafetyCallout, SafetyStrip, Journal, ParentAppSection`
→ `src/features/home/components/*` with a `src/features/home/index.ts` barrel.
(`HeroConversation` is imported by `Hero`, so it is home-internal.)

## 3D / ambient stack → `features/ambient-stage/`

| Old path | New path |
|---|---|
| `components/three/{StageGate,Stage,StageShell,AmbientStage,ThreeStage,actors,backdrop}.tsx` | `src/features/ambient-stage/components/*` |
| `components/product/LumiInset.tsx` | `src/features/ambient-stage/components/LumiInset.tsx` (dormant 3D; was re-exported by Stage) |
| `lib/three/{ambient,ambient-configs,exclusion,shape-geometry,store,tier,tokens}.ts` | `src/features/ambient-stage/lib/*` |

Public API: `src/features/ambient-stage/index.ts` exports `StageGate` (+ `Stage`, `LumiInset`).
`store.ts` (zustand) is ambient-only → stays inside the feature, NOT a global `stores/`.
`actors.tsx`/`backdrop.tsx` optionally renamed to PascalCase per §8.

## Product (single route)

| Old path | New path |
|---|---|
| `components/product/LumiHero.tsx` | `src/app/products/lumi/_components/LumiHero.tsx` (colocated; only /products/lumi uses it) |

## lib / config / styles

| Old path | New path | Reason |
|---|---|---|
| `lib/site.ts` | `src/config/site.ts` | app constants (nav/prices/CTA) → config |
| `lib/{cn,setup-steps,shape-paths,stories,stories-expansion}.ts` | `src/lib/*` | shared utils/data; `shape-paths` used by both the ambient feature and the `Shapes` atom → stays global |
| `app/globals.css` | `src/styles/globals.css` | Tailwind entry + `@theme` tokens (+ explicit `@source`) |
| `app/fonts/*.woff2` | `src/app/fonts/*.woff2` | travel with `layout.tsx` |
| `app/**` route files | `src/app/**` | routing layer |

## Folders intentionally NOT created

`hooks/`, `services/`, `stores/`, `providers/`, `types/` — no code needs them today
(no shared hooks, no data/API layer, the only store is feature-scoped, no context
providers, types are colocated). CLAUDE.md documents them as the sanctioned homes for when
such code first appears — creating empty folders now would be cargo-culting.

## Config / tooling edits (beyond moves)

- `site/tsconfig.json` — `"@/*": ["./*"]` → `["./src/*"]`.
- `tools/tokens/check-tokens.mjs` — the two hard-coded paths now point at
  `site/src/styles/globals.css` and `site/src/features/ambient-stage/lib/tokens.ts`.
- `site/app/layout.tsx` (→ `src/app/layout.tsx`) — `globals.css` import path; fonts stay
  relative (`./fonts/*`).
- New dev-only: `.storybook/`, `vitest.config.ts`, `test/`, `.nvmrc`, `site/package.json`
  devDeps, `.gitignore` additions. None reach the route graph, so `next build` is unchanged.

## Not touched

`docs/checkpoints/*` are dated historical snapshots and are left as-is; their path
references reflect the pre-reorg tree. Use this map to translate them.
