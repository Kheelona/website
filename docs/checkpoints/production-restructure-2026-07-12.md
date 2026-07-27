# Checkpoint: POC → production structure, tooling & docs

> **Path note (added 2026-07-28):** every `site/...` path and `cd site &&` command below
> predate the 2026-07-28 move of the app to the repo root. Drop the prefix when reading:
> `cd site && npm test` is now just `npm test`. See `docs/standards/STRUCTURE-MAP.md`.


**Sprint:** 2026-07-12 (merged + deployed 2026-07-13) · **Commits:** `b80142a`→`4f4afac` (6 phases) + `890a24a` (docs banner) · **Status:** MERGED to `demo-website` and LIVE · **Previous checkpoint:** `r11-hero-playos-consistency.md`

## What this was
A cleanup/organization sprint taking `site/` from POC to production grade, made compliant
with two founder-supplied standards. **HARD CONSTRAINT: zero user-facing change** — only
file locations, imports, and new dev-only files changed. No `.tsx` JSX/CSS body was edited.

## Shipped (all on `demo-website` now)
1. **`src/`-based atomic design** (`PROJECT_STRUCTURE.md`): everything moved under `site/src/`;
   components re-bucketed into `atoms/molecules/organisms/templates`; the 14 home sections →
   `features/home/` (barrel); the whole 3D stack (`three/*` + `lib/three/*` + `LumiInset`) →
   `features/ambient-stage/` (barrel, public entry `StageGate`); `lib/site.ts` → `config/site.ts`;
   `app/globals.css` → `styles/globals.css`; `@/* → src/*`. `LumiHero` colocated at its route
   `_components/`. vendor/ kept as-is.
2. **Standards are BINDING** (`COMPONENT_GUIDELINES.md`): search-before-build, token-driven,
   a Storybook story + a Vitest test per component. Enshrined in root `CLAUDE.md`
   ("Production structure & standards"). Guidelines live in `docs/standards/` +
   `STRUCTURE-MAP.md` (old→new path translation).
3. **Storybook 10 (`@storybook/nextjs-vite`) + Vitest 4 + RTL** (dev-only): 54 stories + 55
   tests, one per component (`get-strict-context` is test-only, non-visual util). Node ≥ 24
   (`.nvmrc`). Commands: `cd site && npm test` / `npm run storybook` / `npm run build-storybook`.

## Verification (the no-change proof)
Per-phase: `next build` green + token gate ok + **production CSS byte-identical** to the
pre-reorg baseline (normalized oracle — only Next's invisible next/font module-hash class
names differ). All moves byte-identical renames; every content change import-only (diff-audited).
Final gate: build green, **165 tests pass (55 files)**, Storybook builds, live `demo-website`
pages render pixel-identically (home + /playos verified).

## Test-infra lessons (in `site/test/setup.ts`; DON'T reintroduce)
- **Thenable trap:** a mock Proxy whose catch-all returns a function for `then` makes the
  module namespace look like a Promise → Vitest module resolution HANGS forever with no
  error. Guard `then`/`__esModule`/symbols in every mock Proxy (`@react-three/drei`, `motion`).
- Mock `next/dynamic` (StageGate's lazy Stage) and `three-stdlib` (heavy barrel, dormant
  journey geometry) or jsdom stalls.
- `tsconfig` excludes `*.test.tsx`, so declare the `@/` alias explicitly in `vitest.config.ts`
  (a tsconfig-based resolver skips test-origin `@/` imports).
- Pure R3F scene components only render in a Canvas → import-smoke tests; StageGate is testable.

## Folder cleanup (2026-07-13, local only — untracked/regenerable, GitHub unaffected)
Removed `site/.next`, `site/storybook-static`, `launch-video/node_modules`, `launch-video/out`,
`.DS_Store` (2.8G→1.7G). Kept `site/node_modules` (ready to run) and all committed assets.
To re-render the launch film: `cd launch-video && npm install`. NOT pruned (founder call):
`Design/product-images` (632M committed renders — trimming would need a git-history rewrite).

## Unchanged by this sprint
The founder launch queue still stands exactly as before: R11-a/b, R10-a, R9-a..c, R4-a..f,
R5-a (logo), Tally URL, GA4, claims/certs/ship-date/contact, legal counsel review. The live
site's appearance/behavior is identical to R11.
