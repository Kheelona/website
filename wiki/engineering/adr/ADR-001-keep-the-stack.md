---
title: "ADR-001: Keep the stack; retire the libraries the new design no longer uses"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§2 "Stack", §9.12)
  - ../dependencies.md
  - package.json, package-lock.json, node_modules/*/package.json (read 2026-10-12)
  - "grep of every runtime import under src/ excluding tests and stories, 2026-10-12"
---

# ADR-001: Keep the stack

**Status:** accepted by the Architect, 2026-10-12. No founder approval needed: nothing changes in the
stack (brief §2 "a stack change needs my approval").

## Context

The brief keeps the current stack unless the Architect finds a blocking reason (§2). The audit
(2026-10-12) found Next.js 16.3.4, React 19.2.4, Tailwind CSS 4.3.2, TypeScript 5.9.3, Supabase
(`@supabase/supabase-js` 2.112.3), Razorpay Checkout (script, no SDK), PostHog (`posthog-js` 1.434.2,
`posthog-node` 5.52.4), GA4 through `@next/third-parties` 16.2.12, Vercel Web Analytics 2.0.1, Vitest 4,
Storybook 10, all on Vercel with Node 24 (`.nvmrc`).

Nothing in the approved mockups needs anything the stack cannot do: the mockups are plain HTML on the
design system's own CSS (`mockup/build.mjs`), and the stack renders the same markup on the server.

Several installed libraries have **no runtime import left** in `src/` or are replaced by native
platform features the brief ranks higher (§9.12 order: DS, native, stack, popular library):

| Library | Runtime imports today | Why it goes |
|---|---|---|
| `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` | 0 | The 3D stage was deleted in Phase 0; the new design has no 3D |
| `zustand` | 0 | No client state store is needed |
| `lucide-react` | 9 (old components only) | Brief §9.12: one icon set; the DS ships 76 Phosphor icons |
| `motion` | 2 (old components only) | The approved motion spec is CSS plus one small observer ([ADR-007](ADR-007-motion-css-first.md)) |
| `@radix-ui/react-accordion`, `@radix-ui/react-dialog` | 1 and 2 (old components only) | Native `<details>` and `<dialog>`, as the DS and brief §9.12 prefer |
| `tailwind-merge` | 1 (`src/lib/cn.ts`) | With a layout-only Tailwind ([ADR-002](ADR-002-visual-layer-ds-css.md)) no utility conflicts need merging; `clsx` stays |

## Options

1. Keep everything as installed. Dead weight in the lockfile and a 3D library one import away from the
   phone bundle.
2. **Keep the stack; retire the unused libraries in the clean-up task after the old components are
   deleted; add only test tooling.**
3. Change the framework (for example a static-site generator). Not justified: no blocker, and the
   store, API routes, proxy and tracking all depend on Next.

## Choice

Option 2. Retirements happen in task 6.3 (clean-up), after every page that imported them is replaced,
each by name (`npm uninstall <name>`), with the lockfile diff read. New development dependencies (test
and asset tooling) are pinned with `--save-exact` and recorded in [dependencies](../dependencies.md).

## Consequences

- No framework migration risk; the checkout, proxy and tracking code keep running as they do.
- The phone bundle loses no runtime feature, only libraries already unused.
- Storybook stays as the component workbench ([ADR-011](ADR-011-guardrails-and-qa-harness.md)).
- Any new library after this plan follows brief §9.12 and needs a row in the register before it lands.
