# Checkpoint — app moved to the repo root, and the bug that surfaced doing it

**Date**: 2026-07-28 · **Branch**: `main` (`707ec46`, docs `186d283`) · **Also on**: `demo-website` (merged, `8fd3f4c`)

## What triggered it

The founder sent a Vercel build log reading **"No Next.js version detected"** and reported that
neither the production site nor the preview was going live.

Vercel decides whether a project is a Next.js app by reading `package.json` from the project's
**Root Directory**. That setting was the repo root; the app was one level down in `site/`. So the
detection could never succeed. The founder chose to move the app to the repo root rather than
change the setting, which also removes the mismatch permanently.

## The move

Everything in `site/` is now at the repo root: `package.json`, `package-lock.json`,
`next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, both tsconfigs,
`.nvmrc`, `.storybook/`, `src/`, `public/`, `test/`. `site/` no longer exists. 279 tracked files
moved as renames, so history follows them.

Four files collided with root counterparts, resolved deliberately:

| File | Resolution |
|---|---|
| `.gitignore` | root keeps its project rules; `site/`'s Next and tooling rules merged in |
| `CLAUDE.md` | root wins (it is the project instructions); it now carries the `@AGENTS.md` import that `site/CLAUDE.md` existed to provide |
| `README.md` | root wins; the Next.js boilerplate README dropped |
| `.DS_Store` | deleted |

`.env.example` was never tracked. It is now, since it documents the two `NEXT_PUBLIC_*` vars a
fresh clone and a Vercel project both need.

## Three path assumptions the move broke

Each was found by running a gate, not by reading the code:

| Symptom | Cause | Fix |
|---|---|---|
| `npm run build` → `Cannot find module /Users/apoorvasahu/Documents/tools/tokens/check-tokens.mjs` | the build script ran `../tools/...`, which now resolves outside the repo; `check-tokens.mjs` also read `site/src/...` | drop the `../`; update the checker's two read paths |
| `tsc` → 4 errors in `launch-video/` | at the root, `tsconfig.json`'s `**/*.ts` include sweeps in sibling projects. `launch-video/` is a separate Remotion project whose deps are intentionally not installed | exclude `launch-video tools docs design-concepts 3d-handoff` |
| `build-storybook` → `Rolldown failed to resolve "@/components/atoms/Room"` | Storybook never resolved the `@/` alias. Only one story imports through it, so nobody noticed: `next build` resolves it via tsconfig, Vitest declares it explicitly in `vitest.config.ts`, Storybook did neither | declare the alias in `.storybook/main.ts` `viteFinal` |

The Storybook break was **latent since the revamp**, not caused by the move. It is the reason the
alias is now declared in all three places that need it.

## The regression that mattered

Unrelated to the move, introduced with the legacy Wix 301s in the previous session, and **already
live on the founder's review URL**:

Next matches `redirects()` **before** it serves `public/` files. The redirect
`/product/:slug*` → `/products/lumi` therefore matched `public/product/lumi-blue-2.png`. Every
product image 308'd to the product page, and `/_next/image?url=%2Fproduct%2F...` answered **400 at
every width**. Chrome confirmed it visually: the home hero rendered a broken-image placeholder with
alt text where the plush belongs — and that image is the **mobile LCP element**.

**Fix**: `source: "/product/:slug([^.]+)"`. A pattern that cannot match a dot cannot match a
filename, so assets fall through to `public/`, while legacy slugs still redirect, including
multi-segment ones. Legacy Wix product slugs never contain a dot.

**Guard**: `test/redirects-vs-assets.test.ts` cross-checks every redirect `source` against every
`public/` directory and fails when a parameterised source shadows one. It distinguishes literal
sources, which can only shadow one exact filename — that distinction came from the test itself
flagging the literal `/stories/why-three-to-six-matters-most` redirect, which is safe because no
extensionless file of that name exists. Proven by reintroducing the bug (2 failures) and reverting
(12 passes). Vitest's `include` now covers `test/` as well as `src/`.

Recorded as law: `docs/website-steps.md` §8.21-b. A redirect whose first segment names an asset
directory is a review flag.

## Verified

- **237 tests** (225 + 12 new), `tsc` clean, `npm run build` green (token-check 17), `build-storybook` succeeds
- 11 routes 200 (`/`, `/products/lumi`, `/playos`, `/safety`, `/setup`, `/team`, `/stories`, `/contact`, `/privacy`, `/terms`) plus `/nope` → 404
- 24 sitemap URLs; `/llms.txt`, `/pricing.md`, `/robots.txt`, `/sitemap.xml` all 200
- All 14 legacy redirects 308 to the right destinations
- `public/product/*.png` 200 raw **and** 200 through the optimizer at w=384/828/1200
- JSON-LD graph intact: Home (Product, FAQPage, VideoObject, Organization, WebSite, BreadcrumbList, Offer, Brand, PeopleAudience), article (BlogPosting, BreadcrumbList)

## Not done, and not doable in code

**Vercel's Root Directory still says `site`**, which no longer exists. It must be cleared to the
repo root and redeployed. Polled the preview for roughly four minutes after pushing: the edge `age`
header kept climbing and `/product/lumi-blue-2.png` still 308'd, so no rebuild landed. Claude has
no Vercel access, and the founder's standing instruction is that Vercel is theirs — push to GitHub
and hand over the dashboard change.

Tracked as **FOUNDER-TODO #0** and as the `vercel-root-directory` blocker in `project-state.json`.

## Known, deliberately not touched

`npx eslint src` reports 28 findings (19 `react-hooks/immutability`, 3 `set-state-in-effect`,
3 `next/no-img-element`, 1 each `refs` / `exhaustive-deps` / `no-unused-vars`). These are React
Compiler rules from Next 16's shared config, they predate the move, and they are not part of any
gate — the gates are `npm test`, `tsc`, and `npm run build`. Folding an unrelated lint cleanup into
a deploy fix would have hidden both.
