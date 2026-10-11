---
title: "ADR-011: Guardrails as tests and scripts; Playwright and axe as pinned dev dependencies; visual and text parity against the frozen mockup; Storybook kept for primitives and sections"
type: adr
updated: 2026-10-12
sources:
  - ../../raw/brief/kickoff-brief.md (§6 Architect "Automated guardrails", §6 QA tools, §9.9, §9.12 "QA")
  - ../lessons.md (§2 sideways scroll by clientWidth; §7 the harness, proving guards red, "a gate that prints is not a gate")
  - ../../decisions/D041-gate-a-round-1.md (white on Chilli accepted exception), ../../decisions/D043-all-pages-as-mockups-before-build.md (mockup/tools/check.cjs)
  - mockup/tools/check.cjs, tools/qa/*.mjs, scripts/ds-checksums.mjs, test/*.test.ts (read 2026-10-12)
  - ../../qa/architecture-review-2026-10-12.md (B2, B3, N18, N22-N25), ../../qa/test-plan.md (§3, §4.4)
  - ../../research/posthog-audit.md (§11 device and viewport matrix)
---

# ADR-011: Guardrails and the QA harness

**Status:** accepted by the Architect, 2026-10-12.

## Context

The brief wants guardrails that keep the rules holding after launch: off-token lint, duplicate checks,
DS checksums, Lighthouse budgets, accessibility, broken links (§6), a copy-paste detector and asset
hash checks (§9.12), and a homepage matching the approved mockup within an agreed visual-diff tolerance
(§9.9). Today the mockup checker borrows Playwright and axe from the npx cache (`mockup/tools/check.cjs`)
and the legacy harness borrows puppeteer-core (lessons §7). There is no CI.

## Choice

- **Two runners.** Vitest (unit, component and repo guards, `test/` and colocated `*.test.tsx`) and
  Playwright (`test/e2e/*.spec.ts`: visual parity, text parity, axe, sideways scroll, tracking probes,
  performance bytes, redirects), both pinned dev dependencies, plus `@axe-core/playwright`, `jscpd` and
  `lighthouse`. `axe-core` is MPL-2.0, which brief §9.12's permissive list does not name, but it is a
  test-only tool the brief itself names for QA (§6), never shipped; recorded in the register.
- **Visual parity is measured against the frozen mockup itself.** For each page and viewport (360 x 640,
  390 x 844, 1440 x 900) the harness opens `mockup/<slug>.html` (file URL) and the built route on a local
  production server, forces reveals and reduced motion, hides mockup-only review tools, compares page
  height (within 2 percent) and then each screen-height chunk with Playwright's comparator
  (`maxDiffPixelRatio` 0.02 per chunk). A larger difference fails unless the task lists it as an approved
  deviation with its reason (for example a founder decision after Gate A or a corrected defect).
  Screenshots stay local (D039), never committed.
  The bubble the founder added after Gate A (D050) and its bottom clearance are hidden in parity runs and
  checked by their own spec; motion is neutralised (reduced motion, reveals forced, doodles drawn).
- **Viewports beyond the approved three (QA review N23).** Parity stays at the three approved widths,
  because those are the widths the founder approved. Everything that can break on other screens (sideways
  scroll, the first-screen CTA, axe, the laptop layout) runs on the PostHog audit's matrix: phones 320,
  324, 360 (640 and 590 tall), 390, 393, 402 x 714, 412; laptops 1280 x 600, 1366 x 768, 1440 (900 and
  800 tall), 1512 x 860, 1536 x 730, 1920 x 1080 (22.5 percent of laptop sessions). The support library
  exports the matrix once ([test plan §3](../../qa/test-plan.md#3-viewports-and-browsers)).
- **Text parity:** the visible text of `main` on the mockup and on the build, normalised, must match
  sentence for sentence, except resolved placeholders and listed deviations.
- **Lighthouse: which run counts (N18).** Beta is noindex, so its SEO score fails by design, and it has no
  GA4, Meta or Ahrefs, so it reads better than production. Performance and Best Practices count from a
  local production build under the real hostnames with the tags loading and only their beacons blocked,
  then from production after the deploy; SEO from that local build; Accessibility from any run.
- **Checkout proofs (B3):** a byte freeze that also covers the six checkout test files (literal-only
  reviewed patches allowed), a logic signature per presentation file, and a rendered JSX contract seeded
  from the tag ([ADR-013](ADR-013-checkout-restyle-boundary.md)).
- **Guards must never contradict approved copy:** the banned-phrases guard is run against the 18 approved
  mockup pages and every copy block as a green fixture, so a pattern that would hit approved wording fails
  in the guard's own test, not in a page task.
- **Every existing test has an owner** for every change that touches what it reads, wave by wave, and a
  task greps the tests before deleting or rewriting a file ([tasks](../tasks.md#guard-test-ownership)). Two
  legacy guards retire in wave 1 because they would fail mid-build on approved copy or pages
  (`preorder-copy`, ported into banned-phrases; `interactions`).
- **Guards are scripts that exit non-zero**, each proven red with a planted violation before it is
  trusted (lessons §7): DS checksums, placeholders, banned phrases and claims, off-token values, the
  tracking freeze and parity, CTA registry coverage, sideways scroll by `clientWidth`, axe with the D041
  exception classified narrowly and printed every run, redirect hop counts, internal links, metadata
  lengths and uniqueness, JSON-LD equals visible text, duplicate code (`jscpd`), duplicate assets
  (hash), performance bytes per route. Full table: [architecture §14](../architecture.md#14-guardrails-tests-and-scripts).
- **Where they run:** `npm run verify` (pre-merge, mandatory before any push to `beta` or `main`); the
  production build's prebuild and postbuild steps for the guards that must block a deploy
  (placeholders, DS checksums), run by `scripts/run-steps.mjs` from one file per step in
  `scripts/steps/<hook>/`, each owned by the task that writes its script (so `package.json` changes once
  and parallel tasks never share it); and a GitHub Actions workflow running `verify` on pushes to `beta` and
  `main` (public repo, no secrets, no cost).
- **Storybook stays** as the workbench for primitives and sections: every `ui/` and `sections/` component
  ships a story with its variants; chrome, layouts and pages do not. Stories load `src/styles/site.css`.

## Consequences

- The rules hold after the project: any later commit that breaks a token, a tracking call, a price
  source or a redirect fails `verify`.
- QA's Phase 6 suite reuses the same harness instead of a parallel one.
- The legacy `tools/qa/` harness keeps `qa:payment` (the sandbox probe) and the Supabase stub; its sweep
  and shot scripts are retired once the Playwright specs cover them (task 6.3).
