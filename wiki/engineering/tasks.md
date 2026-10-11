---
title: "Build tasks in dependency waves, with ownership, inputs, acceptance criteria and tests (Phase 5, final after QA round 1)"
type: plan
updated: 2026-10-12
sources:
  - architecture.md, structure.md, components.md, assets.md, dependencies.md, adr/ADR-001 to adr/ADR-013
  - ../qa/architecture-review-2026-10-12.md (blocking B1-B4, non-blocking N1-N26), ../qa/test-plan.md (§3 viewports, §4 suites, §6 payment procedure)
  - ../raw/brief/kickoff-brief.md (§7 Phase 5-8, §9)
  - ../decisions/D044-app-screens-on-the-site.md, ../decisions/D048-beta-deployment.md, ../decisions/D049-motion-picks.md, ../decisions/D050-whatsapp-chat-button.md
  - ../site/pages/*.md (copy, meta, cta values, placeholders), mockup/pages/*.html, mockup/partials/*.html
  - ../site/gate-a-progress.md (reviews and fixes carried into Phase 5)
  - "grep of every test file in test/ and src/**/*.test.* for each path this plan moves, rewrites or deletes (2026-10-12): results in the guard-test ownership table below"
  - "npm ls fflate nanoid js-yaml brace-expansion browserslist (2026-10-12): fflate arrives only through @react-three/drei and @types/three"
---

# Build tasks

The build in ten dependency waves. **Wave 1 is the foundation and lands first.** Inside a wave every
task can run in parallel: no two tasks in the same wave own the same file, and no task depends on another
task of its own wave. A wave starts when the previous wave has closed (below). Task ids keep their
round-1 numbers so the QA review's references stay valid; only wave numbers and contents changed.

Owners: **builder** (Phase 5 builder agents), **copywriter**, **main session**, **QA**, **founder**
(dashboard and facts only).

**What changed after QA round 1** ([review](../qa/architecture-review-2026-10-12.md)): the founder's
motion picks (D049) and WhatsApp bubble (D050) have owners and tests (B1); every existing guard test has
a named owner per wave, and two legacy guards that would have failed mid-build retire in wave 1 (B2); the
checkout freeze now covers the JSX contract and the six checkout test files (B3); beta isolation is a
gate before the first test payment (B4); wave 1 is genuinely independent (N25); the release track is
three single-task waves.

## How to read a task

- **Owns:** the only files or folders the task may create, edit or delete. Anything else is read-only for
  it. Catalogue rows in [components](components.md) and [assets](assets.md) marked with the task id are
  also its own. `package.json` and `package-lock.json` are owned by 1.1 (wave 1) and 6.3 (wave 7) only;
  no other task adds a dependency (ask the main session).
- **Test-file rule (B2).** Before a task deletes, moves or rewrites a file, or removes an exported name,
  it runs `grep -rln "<path or name>" test src --include=*.test.* --include=*.ts` and lists every hit in its
  report. Each hit must be in its own Owns or in the [guard-test ownership](#guard-test-ownership) table
  with an owner in an earlier wave; otherwise the task stops and asks the main session. A task never
  weakens a guard it does not own.
- **Inputs:** what to read first, besides [architecture](architecture.md) and [structure](structure.md).
- **Acceptance:** all must hold before the task is marked done; the report lists evidence.
- **Test:** the tests the task adds or must keep green.
- **Every task:** stages files by name (never `git add -A` or `.`), commits with a clear message, never
  pushes to `main`, never runs the Vercel CLI, never runs a bare `npm install`, and runs `npm run verify`
  green on its own tree before reporting. Screenshots and reports stay local (D039).
- **Wave close (main session):** after the last task of a wave reports, the main session runs
  `npm run verify` (and from wave 3 on, `npm run verify:e2e`) on the integrated branch, routes any failure
  to the task that owns the failing file, and only then starts the next wave. This is where parallel
  tasks meet (for example 1.1's freeze guard reading 1.3's reviewed diffs).

### Standard component acceptance (SCA)

1. Markup, classes, ARIA and order match the mockup element it ports (cite the mockup file and fold).
2. DS classes and tokens only; composition classes `ks-`; `test/guards/no-off-token.test.ts` green;
   the only literals are those in `test/guards/token-exceptions.ts`.
3. Colocated `Name.test.tsx` covers every variant and the accessibility contract (roles, labels, focus);
   `Name.stories.tsx` for `ui/` and `sections/` shows every variant.
4. Server component unless the catalogue row says client; client parts in `*.client.tsx`.
5. No copy, price or URL typed in the component; data by props.
6. **No mockup-only markup** (N22): no `mk-` class, no `data-src` attribute, no review-tool element or
   "Rewritten in the build" label (`test/guards/mockup-markup.test.ts`).
7. **Motion only through the class contract** of [architecture §11.3](architecture.md#113-class-contract-between-motioncss-and-components);
   reduced motion moves nothing (the component's own `test/e2e/motion-*.spec.ts` where it animates).
8. Catalogue row updated in the same commit.

### Standard page acceptance (SPA)

1. **Visual parity** with the mockup page at the three approved widths: `npm run test:visual -- <slug>`
   at 360 x 640, 390 x 844 and 1440 x 900, reduced motion on, reveals forced, doodles drawn, the D050
   WhatsApp bubble and its bottom padding hidden (they have their own spec, task 3.1): page height within
   2 percent and every screen-height chunk at most 2 percent differing pixels, or each exceeding chunk
   listed as a deviation with its reason (a founder decision after Gate A, a corrected defect, the D044
   screenshot edits, a resolved placeholder).
2. **Text parity:** `npm run test:text -- <slug>` green (mockup `main` text equals build `main` text,
   normalised; same with JavaScript disabled).
3. **Accessibility:** `test/e2e/axe.spec.ts` at 360, 390, 1440 and 1920 (templates also 412): zero
   critical or serious apart from the classified D041 exception (white on Chilli); white on Kheelu Blue
   printed apart until the founder rules; keyboard path (skip link, drawer, FAQ, films, bubble).
4. **Mobile and laptop layout** on the audit matrix (test plan §3): no sideways scroll at 320, 324, 360,
   390, 402, 412 and every laptop size (`scrollWidth > clientWidth` false, also with the drawer open and
   the films strip at each end); tap targets ≥ 44 px; Home and product: h1, CTA, price sentence and
   delivery line inside 360 x 590 and 360 x 640.
5. **SEO:** title and description exactly as the copy page (≤ 60 and ≤ 155, unique), canonical, one h1,
   heading order, Open Graph and Twitter complete, JSON-LD per [architecture §9.2](architecture.md#92-structured-data-per-page-type)
   matching visible text, internal links resolve.
6. **Tracking:** CTA values exactly as [architecture §8.3](architecture.md#83-cta-values-data-ph-capture-attribute-cta-reconciled-from-the-mockups);
   sticky bar per the page's mockup meta.
7. **Content:** every visible line from the mockup (copy page for what the mockup does not show); every
   amount a `{price:…}` token; placeholders exactly those the copy page lists, each rendering visibly;
   banned phrases, en-IN spelling and age band green (`test/e2e/content-integrity.spec.ts`).
8. **Performance:** `test/e2e/perf-budget.spec.ts` within [architecture §12](architecture.md#12-performance-budget-phones-first)
   for the route, including the HTML document budget.
9. **Motion:** reveals only where the mockup has `data-reveal`; doodles draw only below the first
   screen; never on the first section, h1, price, chilli button or offer card
   (`test/guards/no-reveal-on-money.test.tsx`); reduced motion: nothing moves.

---

## Guard-test ownership

Every existing test that reads a file this plan changes, and who may edit it (B2). "Keep" means no task
edits it and every task keeps it green. Waves are sequential, so an owner in a later wave never collides
with an earlier one.

| Test | Reads | Owner and action |
|---|---|---|
| `test/analytics-tags.test.ts` | `src/app/layout.tsx` text, `src/app/(site)/privacy/page.tsx` text, `meta-capi.ts` payload | **5.11**: re-pin the privacy wording to the approved text (mapping in 5.11); layout and payload assertions unchanged. 3.1 must keep the layout assertions green without editing them |
| `test/policies.test.ts` | `next.config.ts` redirect sources (text), `@/lib/legal`, legal page files, `sitemap.ts` | **1.3**: the `redirectSources` line only (read `@/config/redirects`). **4.4**: rewrite data-driven |
| `test/metadata-lengths.test.ts` | title literals in page files, `@/lib/stories`, `/playos` path | **4.4**: rewrite data-driven over `routes.ts` (legacy routes "pending" while in `LEGACY_PATHS`) |
| `test/internal-links.test.ts` | `@/lib/stories`, `RichParagraph`, `sitemap.ts` | **4.4**: rewrite over the article modules' `related` lists |
| `test/machine-files.test.ts` | `llms.txt` and `pricing.md` routes, `@/lib/seo`, `@/lib/stories` | **4.4**: rewrite |
| `test/redirects-vs-assets.test.ts` | `next.config.ts` text, `public/` folders | **1.3**: read the redirect table module |
| `test/store-host.test.ts` | `host.ts`, store routing | **1.3** |
| `test/store-secrets.test.ts` | `src/` scan, `.env.example`, `.gitignore`, `vercel.json` | **1.3**: add the platform secret (N5); keep the cron assertion |
| `test/security-headers.test.ts` | `next.config.ts` text (`securityHeaders`, `async headers()`, `poweredByHeader: false`) | Keep (1.3 keeps the three literals) |
| `test/posthog-proxy.test.ts` | `next.config.ts` (import), `site.ts`, `proxy.ts` | Keep (1.3 keeps the rewrites) |
| `src/components/molecules/PostHogGate.test.tsx` (moves to `tracking/`) | `POSTHOG_HOSTS` equals `GA4_HOSTS` | **2.6**: move with the component; the host assertions change with `POSTHOG_HOSTS` in the same commit (B2a) |
| `GoogleAnalyticsGate.test.tsx`, `MetaPixel.test.tsx`, `ViewContentTracker.test.tsx` | the gates | **2.6**: move with the components |
| `test/video-assets.test.ts` | `@/lib/video-moments`, `public/video` | **3.3**: rewrite over `content/en-IN/films.ts` (no `launch.mp4` assertion; 6.3 deletes it) |
| `test/not-found-ssr.test.ts` | dynamic routes need `export const dynamicParams = false;`, store files never call `notFound()` | Keep (4.1, 4.2, 5.2, 6.1 satisfy it) |
| `test/preorder-copy.test.ts` | retired offer terms over all of `src/` | **1.1**: retire, terms ported to banned-phrases. It would fail on approved copy ("No payment fees" on terms and confirmation; "replacement Kheelu back to you is free" on refund) |
| `test/interactions.test.ts` | seven legacy files must import `lib/interactions` | **1.1**: retire (5.2 and 5.5 replace two of those files; the motion guards replace it) |
| `test/dependency-floor.test.ts` | `package.json`, lockfile, `node_modules` | 1.1 keeps it green without editing (npm `overrides` if a new dev tool brings a low copy). **6.3**: drop the `fflate` floor when its last copy leaves with `three` (never lower a floor) |
| `test/stories-parse.test.ts` | story count > 50, `PageHero.stories.tsx` | **6.3**: new floor and path (B2e) |
| `test/utm.test.ts` | `SITE_URL` from `@/lib/seo` | **6.3**: import `CANONICAL_ORIGIN` from `@/config/env` when `seo.ts` goes |
| `test/preorder-cta.test.ts`, `action-label`, `kicker-language`, `kheelu-art`, `contrast-tokens`, `a11y-v4`, `config-copy` | legacy files and classes | **6.3**: retire with their subjects (they cannot fail before 6.3 deletes the legacy code) |
| Six checkout tests: `PreorderForm`, `OrderSummary`, `AddressForm`, `NotFoundPanel`, `store/thanks/page`, `store/ideabaaz/page` | checkout behaviour and copy | **Frozen** (B3). Only literal-only reviewed diffs: **5.15** (PreorderForm, OrderSummary), **5.16** (AddressForm, thanks), **6.1** (NotFoundPanel, ideabaaz) |
| `src/lib/store/posthog-server.test.ts` | server event payload | **1.3** |
| `src/lib/email/templates.test.ts` | email facts | Keep; **6.4** only with its reviewed diff |
| Tests of frozen code (`features/preorder/lib/*`, `lib/store/*` other than `posthog-server`, `app/api/**`, `lib/fbq`) | frozen modules | Keep |
| Tests of legacy components and modules (`atoms`, `molecules`, `organisms`, `templates`, `vendor`, `features/home`, `lib/{seo,stories,growth-arc}`, old product `_components`) | legacy | Deleted with their subjects: 5.2 (old product route), 6.3 (the rest) |

---

## Wave 1: foundation (lands first; all parallel)

### 1.1 Toolchain, QA harness and guard skeletons (builder)

- **Goal:** the scripts, configs, harness and guards every later task uses to prove its work.
- **Owns:** `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`,
  `playwright.config.ts`, `eslint.config.mjs`, `.gitignore`, `.storybook/main.ts`,
  `.github/workflows/verify.yml`, `scripts/run-steps.mjs`, `scripts/steps/prebuild/10-ds-checksums.mjs`,
  `scripts/qa/lighthouse.mjs`, `test/e2e/support/**`,
  `test/e2e/{visual-parity,text-parity,no-js,axe,no-sideways,first-screen,perf-budget,links,cta,motion,content-integrity,tracking-probe,redirects}.spec.ts`,
  `test/guards/{legacy-paths,token-exceptions,banned-phrases.data}.ts`,
  `test/guards/{no-off-token,banned-phrases,checkout-freeze,checkout-signature,asset-dupes,answer-length,jsonld-matches-page,mockup-markup}.test.ts`,
  `test/guards/{no-reveal-on-money,checkout-jsx-contract}.test.tsx`,
  `test/guards/fixtures/{checkout-signatures,checkout-contract}/**`, and the deletion of
  `test/preorder-copy.test.ts` and `test/interactions.test.ts`.
- **Inputs:** [ADR-011](adr/ADR-011-guardrails-and-qa-harness.md), [ADR-013](adr/ADR-013-checkout-restyle-boundary.md),
  `mockup/tools/check.cjs` (viewport, reveal-forcing, `clientWidth` and D041 classifier logic),
  [lessons §7](lessons.md), [claims §4](../product/claims.md#4-retired-or-banned-wording), [test plan §1.2, §3](../qa/test-plan.md#3-viewports-and-browsers).
- **Acceptance:**
  1. Dev dependencies added by name with `--save-exact`: `@playwright/test`, `@axe-core/playwright` with
     `axe-core` 4.12.1 (the baseline's engine), `lighthouse` 13.4.1 (the baseline's), `jscpd`,
     `sharp` 0.35.4 (direct, for `build-og.mjs`), `subset-font` (its licence read at install; stop and ask
     if not MIT, BSD, ISC or Apache-2.0); `tailwindcss` and `@tailwindcss/postcss` pinned exact. Lockfile
     diff read and summarised. `test/dependency-floor.test.ts` green **without editing it**: a new copy
     below a transitive floor, or the banned `image-size`, is fixed with an `overrides` entry or by
     dropping that tool and reporting.
  2. npm scripts: `verify` (lint, typecheck, Vitest, `jscpd`, DS checksums), `verify:e2e` (build, start on
     port 3456 with host mapping, Playwright), `test:visual`, `test:text`, `guards`, `assets:css`,
     `assets:fonts`, `assets:compose`, `assets:icons`, `assets:og`, `assets:doodles`, and
     `predev`, `prebuild`, `postbuild` = `node scripts/run-steps.mjs <hook>`. The runner executes every
     `scripts/steps/<hook>/*.mjs` in name order and stops at the first non-zero exit; each step file is
     owned by the task that writes its script (10-ds-checksums here; 20-compose-css by 1.2;
     30-placeholders and postbuild 10-placeholders-html by 2.9), so no task waits on another inside wave 1
     (N25). `build` stays `next build` (D047). The storybook scripts run the `predev` hook first.
  3. The DS checksum step fails with a clear message if `wiki/design-system/manifest.md` is missing: the
     production build depends on `wiki/` being in the deploy clone (N26; structure §8).
  4. `@ds/*` alias in `tsconfig.json`, Vitest and Storybook; Vitest excludes `test/e2e/**`.
  5. ESLint `no-restricted-imports`: `src/` may not import `wiki/`, `mockup/` or `design-system/**/*.md`;
     `ui/` may not import `content/en-IN`, `sections`, `layouts` or `app`.
  6. E2E support: every mockup slug mapped to its URL (structure §5); production server on port 3456 with
     real hostnames mapped to 127.0.0.1; third-party requests aborted; reveals forced, doodles drawn,
     reduced motion on, review tools hidden, the D050 bubble hidden for parity runs; `VIEWPORTS` = the
     test plan §3 matrix (N23) and `APPROVED_WIDTHS` = 360 x 640, 390 x 844, 1440 x 900; page height, then
     each chunk; the protection-bypass header added only for requests to the two beta hosts (never
     `extraHTTPHeaders`, N5); a second Playwright project serves a static Storybook build, so component
     tasks in waves 2 and 3 can test behaviour on their stories before any page exists. `motion.spec.ts`
     (owned here) is the page-level sweep: on every built route nothing animates after 6 s, the hero has
     no running animation, and reduced motion leaves no running animation; the per-pick cases live in
     specs owned by the component tasks.
  7. `banned-phrases.data.ts`: every banned row of claims §4 (a sync test fails if a row has no entry);
     the retired offer terms of `preorder-copy.test.ts` ported with patterns tightened so approved copy
     passes ("no payment" not followed by "fees"; the "reserving is free" pattern with word boundaries so
     "replacement" does not match) and its README front-door check kept; US spellings that en-IN spells
     otherwise (color, center, favorite, program, -ize forms the copy spells -ise), applied to
     `src/content/**` strings and to rendered text only (N24). **Every entry is red on its planted example
     and green on all 18 approved mockup pages and every copy block in `wiki/site/pages/*.md`**, so the
     guard can never contradict approved copy.
  8. `checkout-freeze` byte-compares the frozen list ([ADR-013](adr/ADR-013-checkout-restyle-boundary.md),
     class 1) with `archive/pre-reset-2026-10-10`, accepting only the reviewed patches in
     `test/guards/fixtures/authorised-diffs/`. It also freezes the six checkout test files, whose only
     allowed change is a **literal-only** reviewed patch (token streams equal after masking string,
     template and regular-expression literals).
  9. `checkout-signature` computes the logic signature of each presentation file (ADR-013 class 3) and
     compares it with `test/guards/fixtures/checkout-signatures/<path, "/" as "__">.json`, seeded from the
     current tree (byte-identical to the tag, proven by item 8 in the same run).
  10. `checkout-jsx-contract` renders each checkout component and the `/thanks` page in each state and
     compares the contract with `test/guards/fixtures/checkout-contract/*.json`, seeded the same way
     (states and attributes in [architecture §16.2](architecture.md#162-the-jsx-contract)). Proven red in a
     scratch commit (never kept): remove `noValidate`; drop `ph-no-capture` from the paid branch.
  11. `legacy-paths.ts` lists the legacy paths the new-design guards skip and the routes still served by
     legacy pages (emptied by 6.3). `token-exceptions.ts` lists exactly: the four DS breakpoints and their
     `max-width` neighbours, `outline-offset: 2px`, zero values, `--ks-nudge: 5px` (D049 pick 6) and
     `--ks-film-focus: 1.05` (D049 pick 8) in `src/motion/motion.css`, and `--ks-wa-green` (one hex, D050,
     DS gap G-20) in `src/components/chrome/WhatsAppFloat/whatsapp-float.css`. Inline `style` is allowed only
     for art-board positions (percent and rotation), `--kh-tilt` and `--kh-ratio`. Files under `generated/`
     and `*.generated.*` are exempt from the off-token scan (their drift tests compare them with the DS).
  12. `mockup-markup` scans `src/` for `mk-`, `data-src` and review-tool markup (N22).
  13. `test/preorder-copy.test.ts` and `test/interactions.test.ts` deleted, with the reason in the commit
     (guard-test ownership table).
  14. Each guard proven red with a planted violation (recorded), then green on the current tree.
  15. CI workflow runs `npm run verify` on pushes to `beta` and `main`, checks out with `fetch-depth: 0`
     (the freeze guards read the tag), and uses no secrets.
  16. `.gitignore` adds `src/styles/generated/compose.css`, `test-results/`, `playwright-report/`,
     `test/e2e/.goldens/` and Lighthouse output; keeps `^\.env` (store-secrets reads it).
- **Test:** the guards themselves; `npm run verify` green; `test:visual home` of the mockup against itself
  gives zero difference (harness calibration).

### 1.2 Visual layer: token bridge, DS CSS, fonts, type steps, motion presets (builder)

- **Goal:** the CSS entry that makes built markup look exactly like the mockup, with every approved motion
  preset.
- **Owns:** `src/styles/site.css`, `src/styles/tailwind-theme.css`, `src/styles/generated/**`,
  `src/motion/motion.css`, `public/fonts/**`, `scripts/assets/{build-ds-css,build-compose-css,build-fonts}.mjs`,
  `scripts/steps/predev/20-compose-css.mjs`, `scripts/steps/prebuild/20-compose-css.mjs`,
  `postcss.config.mjs`, `.storybook/preview.tsx`,
  `test/guards/{tailwind-theme,generated-css,visual-layer,motion-properties}.test.ts`. Not
  `src/styles/globals.css` (legacy pages and `contrast-tokens` read it until 6.3).
- **Inputs:** [ADR-002](adr/ADR-002-visual-layer-ds-css.md), [ADR-007](adr/ADR-007-motion-css-first.md),
  [architecture §4, §11](architecture.md#4-visual-layer-and-the-token-bridge), `design-system/project/tokens.css`,
  `components/bundle.css`, `mockup/mockup.css`, `mockup/_work/motion/motion.css` (local reference of the
  D049 options), [D049](../decisions/D049-motion-picks.md), [D050](../decisions/D050-whatsapp-chat-button.md).
- **Acceptance:**
  1. `site.css` imports in the order of architecture §4.1; no Tailwind preflight; DS and composition CSS
     unlayered. `visual-layer.test.ts` compiles `site.css` through `@tailwindcss/postcss` in Node and
     asserts the order of the output and that `p-[13px]` and `bg-red-500` produce no CSS; the order is
     confirmed again on `next build` output (reported).
  2. `ds-tokens.css` equals `tokens.css` minus its four `@font-face` rules; `type-steps.css` holds
     `ks-type-<style>` and `ks-type-<style>@sm|lg|xl` copied from the 19 `kh-` type classes (both
     re-derived by `generated-css.test.ts`).
  3. Tailwind theme per architecture §4.2 (colours map only to DS roles; the four breakpoints equal the
     `min-width` values parsed from `bundle.css`; no other namespace).
  4. Fonts: each family's OFL text checked for a Reserved Font Name (cite the source); Latin plus ₹ subsets
     per face and a Baloo 2 Devanagari subset behind `unicode-range`; same family names as `tokens.css`;
     `font-display: swap`; `src/styles/generated/fonts.generated.ts` exports the **three** preload files
     (Nunito Latin, Baloo 2 Latin, the Kalam face `kh-hand` uses, Latin; N17); the three together
     ≤ 130 KB, or the overrun reported to the main session.
  5. `motion.css` implements every row of architecture §11.2 (all eight D049 picks and the D050 bubble)
     on exactly the class contract of §11.3, DS tokens only plus the two named D049 literals, with the
     reduced-motion block.
  6. `motion-properties.test.ts`: animated properties are only `transform` and `opacity`, except
     `stroke-dashoffset` inside `.ks-doodle` rules and `grid-template-rows` (with discrete
     `content-visibility`) inside `.kh-faq__item::details-content` rules (the two founder-approved
     exceptions, ADR-007); every duration and easing is a DS token or a token expression; no infinite
     iteration; every animation and transition is neutralised under `prefers-reduced-motion: reduce`.
     Proven red with a `width` transition and an `infinite` animation.
  7. The compose manifest is written in the fixed order; an empty manifest is allowed; the predev and
     prebuild step files call it.
  8. `.storybook/preview.tsx` imports `src/styles/site.css`.
- **Test:** the four guards.

### 1.3 Environments, hosts, redirects and region (D048, D041, D047) (builder)

- **Goal:** one build-time `SITE_ENV`; beta hosts and store links right; the URL plan's redirects; the
  function region; beta noindex on every response.
- **Owns:** `src/config/env.ts`, `src/config/redirects.ts`, `src/config/site.ts` (the `STORE_URL` line and
  the new `MRP_*` constants only), `next.config.ts`, `vercel.json`, `src/lib/store/host.ts`,
  `src/lib/store/env.ts`, `src/lib/store/posthog-server.ts`, `src/lib/store/posthog-server.test.ts`,
  `test/env.test.ts`, `test/store-env-beta.test.ts`, `test/store-host.test.ts`,
  `test/redirects-vs-assets.test.ts`, `test/store-secrets.test.ts`, `test/policies.test.ts` (the
  `redirectSources` line only), `test/guards/{redirect-hops,next-config}.test.ts`,
  `test/guards/fixtures/authorised-diffs/{src__lib__store__host.ts,src__lib__store__env.ts,src__lib__store__posthog-server.ts}.patch`.
- **Inputs:** [ADR-008](adr/ADR-008-environments-and-beta.md), [ADR-009](adr/ADR-009-region-and-supabase-move.md),
  [ADR-012](adr/ADR-012-seo-urls-and-schema.md), [architecture §15.2-15.3, §9.4](architecture.md#153-beta-per-d048-the-exact-code-changes),
  [url map §4](../site/url-map.md#4-redirects), D048.
- **Acceptance:**
  1. Exactly the changes of architecture §15.3 for these files, nothing else. The money block of
     `site.ts` byte-identical. **`POSTHOG_HOSTS` is not changed here** (2.6 changes it with its test, B2a).
     **The `/playos` page file is not deleted** (its redirect shadows it; 6.3 deletes the folder; B2b).
  2. `env.ts` is erasable-only TypeScript with no imports; `next.config.ts` imports it and
     `redirects.ts` by relative path (Next does not resolve `@/` aliases in the config's own import
     graph); `scripts/guards/placeholders.mjs` (2.9) can import it under Node 24 type stripping.
  3. `resolveSiteEnv` truth table tested (production, beta, preview, development, override, the
     system-variables-off error).
  4. With `KH_SITE_ENV=production` (and unset), `STORE_URL`, `GA4_HOSTS`, `META_PIXEL_HOSTS`,
     `INDEXABLE_HOSTS` and the `routeForHost` matrix equal the tag's; with `KH_SITE_ENV=beta`, `STORE_URL`
     is `https://betastore.kheelona.com` and `betawebsite.kheelona.com/store/x` redirects there.
  5. `isStoreHost` true for `store.kheelona.com`, `betastore.kheelona.com`, `store.localhost`; false for
     `betawebsite.kheelona.com` and the apex.
  6. CAPI token and test code absent when `SITE_ENV=beta`, unchanged otherwise. `purchase_confirmed`:
     production payload deep-equal to the tag; `env: SITE_ENV` added on every non-production build (beta,
     preview, development; N4). The three reviewed patches written.
  7. Redirect table: the 24 rules unchanged, the new rules of architecture §9.4, `www` twins and the
     catch-all; the hop simulator shows one hop for every legacy family on both hosts; the `[^.]+` guard
     holds; `/playos` reaches `/products/kheelu` in one hop while its page file still exists.
  8. `next.config.ts`: `env.KH_SITE_ENV`; redirects from the table; `headers()` adds
     `X-Robots-Tag: noindex, nofollow` to `/:path*` when `resolveSiteEnv(process.env) === "beta"`, calling
     the function directly (inside the config, `SITE_ENV` still reads `development`; N1); the security
     headers unchanged and the literals `securityHeaders`, `async headers()`, `poweredByHeader: false`
     kept; no `cacheComponents` key (N13). `next-config.test.ts` asserts all of it.
  9. `vercel.json` exactly as architecture §15.3 (the cron stays: `store-secrets` reads it).
  10. `store-secrets`: `VERCEL_AUTOMATION_BYPASS_SECRET` is never read in `src/` and never has a
     `NEXT_PUBLIC_` form (N5); existing assertions unchanged.
  11. `policies.test.ts` reads `redirectSources` from `@/config/redirects` (it would otherwise pass
     vacuously); `redirects-vs-assets` reads the table module.
- **Test:** the listed tests; `npm run qa:payment` still reaches the open sandbox sheet.

### 1.4 Tracking registries (builder)

- **Goal:** the destination, event and CTA registries as data, proven equal to the inventory.
- **Owns:** `src/lib/tracking/{destinations,events,cta}.ts`, `test/guards/tracking-registry.test.ts`.
- **Inputs:** [ADR-006](adr/ADR-006-tracking-module-and-registry.md), [architecture §8.2-8.3](architecture.md#82-destinations-and-event-registry),
  [tracking inventory](../site/tracking-inventory.md), D050.
- **Acceptance:** `destinations.ts` has the 17 rows of the inventory's "At a glance" table (N2), each with
  its ID, kind (browser, server, proxy, cookie, dns, dashboard, none) and gate; every existing event,
  parameter and destination present with status `existing`; the eight existing CTA values byte for byte;
  `home-arc` and `compare` reserved; new values (including `whatsapp-float`, D050) and the three B11
  events marked `new`; `CtaId` exported; the registry-to-inventory test fails if a name, ID or parameter is
  edited or a row is missing.
- **Test:** `tracking-registry.test.ts`, proven red by renaming one parameter and deleting the Ahrefs row.

### 1.5 Asset pipeline: icons, doodles, Open Graph and stable images, app icons (builder)

- **Goal:** generated assets the primitives and machine files need, including the inline doodles that
  draw themselves (D049 pick 3).
- **Owns:** `scripts/assets/{build-icons,build-doodles,build-og}.mjs`, `src/assets/icons.generated.ts`,
  `src/assets/doodles.generated.tsx`, `public/og.png`, `public/og/**`, `public/media/**`,
  `public/brand/logo-mark.png`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico`
  (delete), `test/guards/{generated-icons,generated-doodles}.test.ts`.
- **Inputs:** [ADR-010](adr/ADR-010-media-pipeline.md), [assets §1, §3](assets.md), `mockup/build.mjs`
  (icon extraction), `design-system/project/06-surfaces.md` (OG size), D049.
- **Acceptance:**
  1. 76 icons generated with the same path extraction as `mockup/build.mjs`; `IconName` union exported.
  2. Doodles: the 11 DS doodles the approved pages use ([assets §1](assets.md#1-design-system-assets-used-by-the-approved-pages))
     become one component each in `doodles.generated.tsx`: root `<svg class="ks-doodle" aria-hidden="true"
     focusable="false">` with the DS `viewBox`; `<title>`, `role` and `aria-label` removed; the per-file
     `<defs>` grain filter removed and `filter="url(#chalk)"` rewritten to `url(#ks-chalk)` (one shared
     filter, rendered once by `ui/Doodle/DoodleDefs`); the script fails if any doodle's filter differs from
     the shared one; `pathLength="1"` on every stroked path; filled shapes marked `ks-doodle__fill`; DS
     paths and colours verbatim; `DoodleName` union exported.
  3. OG images 1200 x 630 from DS photos with no text, each ≤ 200 KB; `logo-mark.png` and `og.png` keep
     their URLs; app icons opaque.
  4. Every generated file carries its header; drift tests regenerate in memory and compare; nothing
     written into `design-system/`; DS checksums unchanged.
- **Test:** `generated-icons.test.ts`, `generated-doodles.test.ts`, `scripts/ds-checksums.mjs`.

### 1.5b Parent-app screenshots, D044 round 2 (main session)

- **Goal:** final transcript and activity screens, then all three in their site location.
- **Owns:** `src/assets/app/**`.
- **Inputs:** [D044](../decisions/D044-app-screens-on-the-site.md), [gate-a-progress](../site/gate-a-progress.md)
  (app screenshots table), the local masters in `mockup/_work/appshots/` (never committed).
- **Acceptance:** three WebP files at 576 x 1209 (privacy padded to that size, D046); content matches D044
  row by row; reviewed by the main session against D044 before commit; no masters or demo video staged.
- **Test:** visual check by the main session; `asset-dupes` guard (after wave close).

### 1.6 Content contracts: types, rich text, plain text, placeholders, formatters (builder)

- **Goal:** the shared shapes and the inline-syntax tooling every later content and UI task builds on.
- **Owns:** `src/content/types.ts`, `src/lib/content/**` (`rich-text.ts`, `plain-text.ts`,
  `placeholder.ts`), `src/lib/format/**` (`inr.ts` re-exporting `formatInr`; `date.ts` with the DS's two
  date formats), and their colocated tests.
- **Inputs:** [ADR-004](adr/ADR-004-content-model.md), [architecture §6](architecture.md#6-content-model),
  `src/config/site.ts` (`formatInr`), DS `README.md:124-125`.
- **Acceptance:** types for the Offer view model, mode variants, Meta, FaqItem, TrustItem, Film, ImageRef,
  DoodleRef, SupportChat (D050), Article blocks (with `related` and `card`), LegalDoc (with `status`),
  Gated, Placeholder; the parser handles every token of architecture §6.2 and rejects unknown tokens with
  a message; the serialiser turns any content string into the exact visible text (prices resolved by an
  Offer); `placeholder()` and `{ph:}` produce `[PLACEHOLDER ID: note]`; `formatInr(100000)` = "₹1,00,000".
- **Test:** unit tests per token; a round-trip test (parse → render → text equals serialiser output).

**Wave 1 ownership check:** `package.json` and the e2e support only in 1.1; the two `.storybook` files
split (1.1 `main.ts`, 1.2 `preview.tsx`); the `scripts/steps/` files and `test/guards/` files are
distinct per task; `src/config/site.ts` only in 1.3. No wave-1 change breaks a test owned by a later
task (dry check in the guard-test ownership table: 1.3 leaves `POSTHOG_HOSTS` and the `/playos` file
alone; 1.2 leaves `globals.css` alone; 1.1 deletes only the two tests it owns).

## Wave 2: content data, primitives and shared modules (after wave 1)

### 2.1 Content model data (builder, with copy from the wiki)

- **Goal:** every shared content module filled from the approved copy, plus the offer view model.
- **Owns:** `src/content/en-IN/{offer,cta,delivery,policies,seller,trust,navigation,organization,films,faqs,routes}.ts`,
  `src/content/en-IN/products/{index.ts,kheelu/product.ts}`, `src/content/en-IN/stories/{topics,hub}.ts`,
  `src/content/en-IN/stories/articles/*.ts` (21 modules), `src/content/en-IN/campaigns/index.ts` (empty),
  `src/lib/offer/**`, and their tests.
- **Inputs:** all `wiki/site/pages/*.md`, [pricing](../product/pricing.md), [policies](../product/policies.md),
  [facts](../product/facts.md), D021-D037, D040-D046, D050, `mockup/pages/*.html` (visible wording wins).
- **Acceptance:**
  1. Every FAQ item of every page once in `faqs.ts`, word for word as the mockup; ids stable.
  2. Policy constants, seller block, delivery values and trust items match their owner pages; seller
     strings equal the existing `site.ts` constants where both exist; `seller.ts` carries the D050
     support chat (number `919187546483`, the three pre-filled texts: site, store, `/thanks`; never an
     order number).
  3. Offer view model: token and full mode outputs match the copy pages' price sentence, sticky lines and
     offer-card lists; `headlinePaise` 499900 in token mode; `getOffer()` returns `token` with no store
     env and on any error; cache key and `revalidate: 300` per ADR-005.
  4. `routes.ts` lists every indexable URL of the URL plan (the marketing pages without `/playos`, 21
     articles) with sitemap priority and nav membership.
  5. Article modules: the 18 not yet rewritten are stubs (title and card summary from the hub copy, body
     `{ph:ARTICLE rewrite pending}`) with `related` set to the legacy ring (`getRelatedStories`), so every
     article keeps three incoming links; the hub module holds topic groups as slug lists only (cards read
     title and summary from each article module, so a rewrite never edits `hub.ts`).
  6. No ₹ typed anywhere; EXTERNAL only; banned phrases green on every module.
- **Test:** content shape tests (`satisfies`), offer tests (both modes); FAQ answer lengths by the
  answer-length guard.

### 2.2 Primitives: actions, text and layout (builder)

- **Owns:** `src/components/ui/{Button,PreorderButton,IconButton,Icon,RichText,Heading,Chip,Sticker,Logo,Placeholder,SourceMarker,Layout}/**`,
  `test/e2e/motion-button.spec.ts`.
  Not `src/lib/cn.ts` (legacy, with `tailwind-merge`; 32 legacy files and the checkout forms import it until
  5.15, 5.16 and 6.3): new code imports `clsx` directly.
- **Inputs:** [components §1](components.md#1-primitives-srccomponentsui) rows for 2.2; DS `index.d.ts`;
  the mockup markup of each; D049 pick 6.
- **Acceptance:** SCA; `Button` with `variant="cta"` refuses to compile without a `CtaId`; `PreorderButton`
  always renders `href = STORE_URL`, the one label and `data-ph-capture-attribute-cta`; with `arrow`, the
  arrow icon carries `ks-btn__arrow` (the D049 nudge hook) and the button renders exactly the mockup's
  markup otherwise; `RichText` renders each token exactly as the mockup (`kh-hand`, `kh-mark`, source
  markers with 44 px tap area).
- **Test:** component tests; stories; `motion-button.spec.ts` on the story (pick 6: hover moves the arrow by
  `--ks-nudge` with a fine pointer, nothing on touch, nothing with reduced motion).

### 2.3 Primitives: media and doodles (builder)

- **Owns:** `src/components/ui/{Photo,ArtBoard,ImaginationFrame,AppScreens,Avatar,Doodle}/**` (`Doodle`
  includes `DoodleDefs`, the shared grain filter), `test/e2e/motion-doodle.spec.ts`.
- **Inputs:** [ADR-010](adr/ADR-010-media-pipeline.md), [architecture §10, §11](architecture.md#10-media-pipeline),
  D049 picks 2 and 3, Next `image.md` (`preload`, `fetchPriority`).
- **Acceptance:** SCA; rasters through `next/image` with `sizes` required; **no `priority` prop**
  (deprecated in Next 16, N12): the one LCP image per page takes `loading="eager"` and
  `fetchPriority="high"`, everything else lazy; art-board layers positioned only by typed % props;
  `AppScreens` sizes equal for one and two phones (D046); `Doodle` renders a plain decorative `<img>` from
  the DS file when `draw` is false (hero boards, pick 2) and the generated inline SVG with `data-draw` and
  `data-draw-order` (1-5) when true; `ArtBoard` and `ImaginationFrame` doodle layers use `Doodle`;
  `DoodleDefs` renders one hidden SVG holding `#ks-chalk`.
- **Test:** component tests (attributes, `sizes`, no `priority`); `motion-doodle.spec.ts` on the stories
  (pick 3): below the fold `stroke-dashoffset` goes 1 → 0 within `--duration-draw` after entering, staggered
  by order; drawn at once with reduced motion; drawn without JavaScript.

### 2.4 Primitives: content blocks (builder)

- **Owns:** `src/components/ui/{Card,TrustList,TrustLine,TickList,PriceSentence,HelpLine,SellerLines,OfferCard,FaqList,StepLoop,LanguageChips,CompareTable,List,Quote,EmptyState,DefinitionList,Breadcrumbs}/**`,
  `test/e2e/motion-faq.spec.ts`.
  (No `Tabs`: the product details ship stacked as approved, N21; see 3.4.)
- **Acceptance:** SCA; `PriceSentence` renders the offer's sentence for both modes exactly as D028 and the
  full-mode text; `OfferCard` omits the split in full mode; `FaqList` uses native `<details>`, wraps each
  answer in `ks-faq__clip` (so the D049 pick 7 grid-rows animation does not leak the DS padding) and
  exposes the plain-text items for JSON-LD; `CompareTable` wrapper is a focusable region (G-05);
  `LanguageChips` sets `lang`.
- **Test:** component tests; stories; Storybook a11y addon with no new violations; `motion-faq.spec.ts` on
  the story (pick 7): in a browser with `::details-content` the answer's row grows `0fr → 1fr` over
  `--duration-enter` and the sign turns 45°; without support (WebKit build that lacks it, or the feature
  disabled) it opens instantly; reduced motion: instant.

### 2.5 Primitives: forms and store helpers (builder)

- **Owns:** `src/components/ui/{Field,Select,Checkbox,Alert,PolicyLinks,CopyLinkButton,InAppBrowserNote}/**`.
- **Acceptance:** SCA; inputs ≥ 16 px; labels visible, hints by `aria-describedby`, errors announced;
  `Field` forwards `name`, `type`, `inputMode`, `autoComplete`, `maxLength` and `required` unchanged;
  `tel-in` shows +91 as decoration only; `PolicyLinks` renders the store's policy links as `mk-policy`
  does in `store.html` and `store-confirmation.html`; `InAppBrowserNote` renders only when its content's `enabled` flag
  is true **and** the user agent is an Instagram, Facebook or WhatsApp in-app browser (detected in an
  effect; N7) and copies the store URL it is given.
- **Test:** component tests incl. user-agent and flag cases; stories.

### 2.6 Tracking runtime (builder)

- **Owns:** `src/components/tracking/**` (including the moved tests), `src/lib/tracking/{track,internal-flag}.ts`,
  `src/components/molecules/{GoogleAnalyticsGate,MetaPixel,PostHogGate}.*` (move out, delete originals),
  `src/app/(site)/products/kheelu/_components/ViewContentTracker.*` (move out), the import lines of
  `src/app/layout.tsx` and `src/app/(site)/products/kheelu/page.tsx` that point at the moved files, **the
  `POSTHOG_HOSTS` line of `src/config/site.ts`**, `test/guards/{tracking-freeze,tracking-parity,posthog-init-fixture,cta-registry}.test.ts`.
- **Inputs:** [ADR-006](adr/ADR-006-tracking-module-and-registry.md), [architecture §8, §15.3](architecture.md#8-tracking-module-and-event-registry),
  [inventory parity checklist](../site/tracking-inventory.md#parity-checklist-phase-6-qa).
- **Acceptance:**
  1. Gate bodies byte-identical to the tag except the reviewed diffs: PostHog beta stamp and internal flag;
     `ViewContentTracker` value from a `valuePaise` prop.
  2. `POSTHOG_HOSTS = [...GA4_HOSTS, ...BETA_HOSTS]`; the moved `PostHogGate.test.tsx` asserts exactly that
     and still that no preview, local or `vercel.app` host is listed (B2a).
  3. Production PostHog init options deep-equal a fixture taken from the tag; on beta the only addition is
     `before_send`, which stamps `env: "beta"`. **No `posthog.register`** (N3): proven with a control (after a
     beta-host visit, the production page's PostHog persistence, with `/ingest` blocked, holds no `env`).
  4. `shouldLoadGa4` and `shouldLoadMetaPixel` false on both beta hosts; `shouldLoadPostHog` true.
  5. `track()` sends only to the destinations the registry lists; Meta never receives the new names.
  6. Spies prove every `preorderAnalytics` call emits exactly the registry's names and parameters (rupees,
     eventID `purchase_<ref>`).
  7. `?internal=1` registers `internal: true`, `?internal=0` unregisters it; no event is renamed.
- **Test:** the listed guards; every existing tracking test green.

### 2.7 SEO library (builder)

- **Owns:** `src/lib/seo/**` (new modules imported by explicit path; no index file), `src/app/robots.ts`.
  The legacy `src/lib/seo.ts` and its test stay for the old pages (deleted in 6.3).
- **Inputs:** [ADR-012](adr/ADR-012-seo-urls-and-schema.md), [architecture §9](architecture.md#9-seo-aeo-and-geo-infrastructure),
  the existing `src/lib/seo.ts`.
- **Acceptance:** `pageMeta` returns absolute titles and complete Open Graph and Twitter objects and
  **never a `robots` key** (so the root's beta noindex cannot be replaced, N15); builders for Organization,
  WebSite, Product + Offer (+ return policy, shipping details, warranty), FAQPage, BreadcrumbList,
  BlogPosting, HowTo take data only; `jsonLd()` escaping kept; Product `@id` unchanged; robots per §9.3 with
  Bytespider disallowed.
- **Test:** unit tests per builder; `pageMeta` has no `robots` for any input; schema.org validator on a
  fixture (report); robots snapshot.

### 2.8 Motion runtime (builder)

- **Owns:** `src/components/ui/MotionController/**`, `test/e2e/motion-reveal.spec.ts`.
- **Acceptance:** one `IntersectionObserver` for `[data-reveal]` and `[data-draw]`; in-view elements marked
  `is-in` before `js-motion` is added to `<html>`; unobserves after reveal; re-arms on `usePathname()`
  change; does nothing with reduced motion or without `IntersectionObserver`; no layout shift.
- **Test:** component test with a mocked observer; `motion-reveal.spec.ts` on the demo story with reduced
  motion on and off (reveals once, in-view blocks shown without a fade); the re-arm after a client
  navigation is checked again on built pages in `motion.spec.ts` at wave 5 close.

### 2.9 Build-time content guards: placeholders (builder)

- **Owns:** `scripts/guards/placeholders.mjs`, `scripts/steps/prebuild/30-placeholders.mjs`,
  `scripts/steps/postbuild/10-placeholders-html.mjs`, `test/guards/{placeholders,build-steps}.test.ts`.
- **Inputs:** [architecture §6.2](architecture.md#62-rich-text-tokens-and-placeholders), 1.3's `env.ts`,
  1.6's placeholder syntax.
- **Acceptance:** fails the build when `resolveSiteEnv(process.env)` is `production` (imported from
  `src/config/env.ts`, no second copy of the rule) and any `{ph:`, `placeholder(`, `[PLACEHOLDER` or
  `status: "draft"` remains in `src/` (excluding `src/lib/content/placeholder.ts` and
  `src/content/types.ts`, which define them; N25), then scans the prerendered HTML in `.next/server/app`
  after `next build`; on beta and development prints the count and the list and exits 0.
  `build-steps.test.ts` asserts the required step files exist (prebuild 10, 20, 30; postbuild 10).
- **Test:** proven red (a planted `{ph:` in a fixture module with `KH_SITE_ENV=production`) and green;
  the excluded files never trip it.

**Wave 2 ownership check:** `src/config/site.ts` only in 2.6 (the `POSTHOG_HOSTS` line); `ui/` folders
distinct; the layout import lines only in 2.6; no task touches `src/lib/cn.ts`.

## Wave 3: chrome, shells and sections (after wave 2)

### 3.1 Chrome, shells and the WhatsApp bubble (builder)

- **Owns:** `src/components/chrome/**` (including `WhatsAppFloat`), `src/layouts/{SiteShell,StoreShell}/**`,
  `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/store/layout.tsx`,
  `test/guards/fixtures/checkout-signatures/src__app__store__layout.tsx.json`, `test/e2e/chrome.spec.ts`.
- **Inputs:** `mockup/partials/{nav,drawer,footer,buybar}.html`, `mockup/mockup.js`, `mockup/pages/store.html`
  (store header and footer), [architecture §5.3, §11, §15.3](architecture.md#53-the-whatsapp-bubble-d050),
  D049 picks 4 and 5, [D050](../decisions/D050-whatsapp-chat-button.md).
- **Acceptance:**
  1. SCA for each chrome part. Root layout: `lang="en-IN"`, `site.css`, the three font preloads from
     `fonts.generated.ts`, `metadataBase` = `CANONICAL_ORIGIN`, `robots: noindex, nofollow` when
     `SITE_ENV === "beta"`, the gates last in `<body>`, no old fonts. **`test/analytics-tags.test.ts` stays
     green without edits:** the literal `<head>` and `</head>` remain in the file, the Ahrefs `<script async
     src="https://analytics.ahrefs.com/analytics.js">` stays inside them (wrapped in the beta condition),
     and `<Analytics />`, `<GoogleAnalyticsGate />`, `<MetaPixel />`, `<PostHogGate />` stay literal.
  2. `SiteShell`: `SkipLink`, `NavBar`, `main`, `Footer`, `NavDrawer`, optional `StickyBuyBar`,
     `MotionController`, `DoodleDefs`, `WhatsAppFloat` (site text), Organization and WebSite JSON-LD once.
  3. Sticky bar: hidden until the hero CTA leaves (or shown from first paint where the page has none);
     steps aside while any inline chilli CTA is on screen; hidden from 900 px; safe-area padding; slides up
     once (pick 4); publishes its state as `data-buybar` on `<html>` and its height as `--ks-buybar-h`.
  4. Drawer: native `<dialog>`, focus inside, Escape and backdrop close, `aria-expanded`, panel slides from
     the side (pick 5); nav chilli button from 1024 px only.
  5. `WhatsAppFloat` per [architecture §5.3](architecture.md#53-the-whatsapp-bubble-d050): a real link named
     "Chat with us on WhatsApp", the D050 URL and text for its context, new tab with `rel="noopener"`, DS
     `kh-iconbtn kh-iconbtn--l` look with `--ks-wa-green`, `data-ph-capture-attribute-cta="whatsapp-float"`
     (with `ph-no-capture` in the `/thanks` context); lifts with the bar, hidden under an open dialog, label
     on laptop hover and focus; every page's last content keeps clear of it.
  6. Store layout: noindex, policy links to `MARKETING_ORIGIN`; its signature fixture regenerated in the
     same commit and the diff reviewed (presentation only, ADR-013).
- **Test:** component tests; `chrome.spec.ts` on any built marketing route (the chrome is the shell's): element parity of nav, drawer, footer and
  buy bar with the same elements of `mockup/home.html` at the approved widths (the first pixel proof of the
  visual layer); sticky-bar state at each scroll position; drawer keyboard path; one chilli button per
  phone view; the bubble never overlaps the bar, the price, a field or the pay button at 360 x 590, lifts
  and drops with the bar, is hidden with the drawer open, and moves nothing with reduced motion.

### 3.2 Selling sections (builder)

- **Owns:** `src/components/sections/{CtaBlock,OfferSection,CloseSection,SellerBlock,GrievanceBlock}/**`.
- **Inputs:** Home folds 1, 2, 6, 9; product folds 3, 9; closes on safety, guide, stories, team, contact,
  404; legal sections with the seller and grievance blocks; [components §2](components.md#2-sections-srccomponentssections).
- **Acceptance:** SCA; CTA block order: button, price sentence, trust line, help line, secondary (CMO
  mockup pass); arrowed buttons exactly where the mockup has them (Home hero, product hero, the guide,
  safety, stories and article closes); full-mode rendering of every price-bearing part; grievance wording
  verbatim D032.
- **Test:** component tests in both modes; stories.

### 3.3 Story sections (builder)

- **Owns:** `src/components/sections/{HeroSection,FilmsStrip,FeatureSplit,ModesSection,TrustSection,CompareByCategory,CardGrid,FaqSection}/**`,
  `test/video-assets.test.ts` (rewritten for the films content), `test/e2e/{films,motion-films,motion-hero}.spec.ts`.
- **Inputs:** Home folds 1-8, product folds 1-6 and 8, safety, guide, team, setup, contact hero variants;
  `mockup/mockup.js` (films); D040, D045, D046; D049 picks 2 and 8.
- **Acceptance:** SCA; sections that show a CTA take it as a `cta` slot (a node composed by the registry in
  4.1), so this task never imports 3.2; `HeroSection` never carries `data-reveal` or a drawing doodle
  (pick 2); `FilmsStrip`: no `<video>` at rest, one film at a time, pause when scrolled away, poster back on
  end, position text "1 of 7" (phone) and "1–3 of 7" (laptop), buttons disabled at the ends (tolerant of
  half a tile), labels exactly "Play: {chip}. {caption}", "Previous video", "Next video"; posters lazy
  except the first three on Home, which stay eager with `fetchPriority="low"` (N19); the film in focus
  takes `is-focus` (pick 8, [architecture §11.2](architecture.md#112-what-moves-d041-g4-and-d049)) from one
  observer whose root is the strip's central band; `CompareByCategory` stack below 720 px and table from
  720 px; `ModesSection` keeps `id="modes"` and `id="story-mode"`; `FaqSection` keeps `id="faq"`.
- **Test:** component tests; `films.spec.ts` on the story (keyboard, playback, axe with the video mounted
  and unmounted); `motion-hero.spec.ts` (pick 2: hero `getAnimations()` empty, opacity 1, no transform,
  hero doodles plain images); `motion-films.spec.ts` (pick 8): the focused tile scales to `--ks-film-focus` over
  `--duration-base`, the others stay at 1, the scaled tile stays inside the strip, no document sideways
  scroll at either end on the whole viewport matrix; no scale with reduced motion.

### 3.4 Support sections (builder)

- **Owns:** `src/components/sections/{AnswerSection,StepsSection,ProductDetails,TopicSection,FoundersSection,RecognitionStrip,EmptyStateSection,ArticleHead,ArticleBody,SourcesSection,RelatedGuides}/**`.
- **Inputs:** product fold 7, guide, setup, team, stories hub, the three article mockups, 404.
- **Acceptance:** SCA; `ProductDetails` renders the three panels **stacked as approved** (N21: no tab list,
  no JavaScript; each panel with its heading, `meet-kheelu.css:81` spacing), keeps `id="specs"`, and shows
  placeholders visibly; `RecognitionStrip` and gated bios render nothing while gated; `ArticleBody` covers
  every block type the three article mockups use, with `ks-type-*` steps instead of pixel sizes; answer
  blocks 40-60 words (guard).
- **Test:** component tests; stories.

## Wave 4: templates and machine files (after wave 3)

### 4.1 PageTemplate, section registry, campaign route (builder)

- **Owns:** `src/layouts/PageTemplate/**`, `src/layouts/sections-registry.ts`,
  `src/app/(site)/lp/[slug]/page.tsx`, `test/scalability.test.tsx`.
- **Acceptance:** the registry maps every section kind to its component with typed configs (a
  discriminated union); the template emits the page's own JSON-LD (FAQPage from the same items); the
  campaign route builds with an empty registry (`generateStaticParams` returns `[]`, which Next 16 allows
  only with Cache Components off; `export const dynamicParams = false;`).
- **Test:** `scalability.test.tsx` renders a fixture **campaign page and a fixture product page** from
  content alone (the article half is 4.2's, N26); template tests.

### 4.2 ArticleTemplate and the stories route (builder)

- **Owns:** `src/layouts/ArticleTemplate/**`, `src/app/(site)/stories/[slug]/page.tsx`,
  `test/scalability-article.test.tsx`.
- **Acceptance:** 21 slugs from `routes.ts`, `export const dynamicParams = false;`; BlogPosting with the
  module's stored `published` and `updated` dates and BreadcrumbList from the visible crumbs; the close
  variant per article; stubs render their placeholder on beta and block production.
- **Test:** template tests; `scalability-article.test.tsx` renders a fixture article from content alone;
  `test/not-found-ssr.test.ts` green.

### 4.3 LegalTemplate (builder)

- **Owns:** `src/layouts/LegalTemplate/**`, `test/fixtures/legal/**`.
- **Inputs:** `mockup/pages/{privacy,terms,refund,shipping}.html` and the four page CSS files (merged).
- **Acceptance:** one CSS file replaces the four mockup copies; summary, contents with anchors, parts and
  sections, draft note while `status: draft`, last-updated line, the seller and grievance blocks; type
  steps by `ks-type-*`; visual parity on all four legal mockups with fixture content.
- **Test:** template tests; visual parity against the four mockups using fixture content copied from them.

### 4.4 SEO wiring and the data-driven page guards (builder)

- **Owns:** `src/app/sitemap.ts`, `src/app/llms.txt/route.ts`, `src/app/pricing.md/route.ts`,
  `test/machine-files.test.ts`, `test/metadata-lengths.test.ts`, `test/internal-links.test.ts`,
  `test/policies.test.ts`.
- **Inputs:** [architecture §9.3](architecture.md#93-machine-files), D028, [claims §4](../product/claims.md#4-retired-or-banned-wording).
- **Acceptance:**
  1. Sitemap = `routes.ts` canonical URLs only (no `/playos`, no 2-year-old article), `lastModified` only
     from stored dates; `llms.txt` and `pricing.md` restate visible copy only, ₹4,999 (incl. GST) first,
     the rename note, no `/playos`, no banned lines, dated constants; both mode-aware.
  2. The four guards are **data-driven over `routes.ts` and the content modules** (B2d), so wave-5 tasks
     never edit them: for each route, a present content module is checked (title ≤ 60 and description
     ≤ 155 exactly as the copy page, both unique; no doubled brand in the rendered title; legal modules
     render the shared seller block and never hard-code the GSTIN; `/refund` and `/shipping` absent from
     the redirect table and present in the sitemap and footer navigation; every article has at least three
     incoming `related` links); a route still served by a legacy page and listed in `LEGACY_PATHS` prints
     "pending"; any other missing module fails. Once 6.3 empties `LEGACY_PATHS`, "pending" is impossible.
- **Test:** the four rewritten tests, each proven red once.

## Wave 5: pages (after wave 4; all parallel)

Every page task: SPA (above); owns its content module(s) and route file(s); reads shared content
read-only (corrections to `faqs.ts`, `trust.ts`, `offer.ts`, `routes.ts` or `seller.ts` go to the main
session). Store tasks also own the checkout tests and signature fixtures named in their row; every
change to a checkout test is a literal-only patch in `test/guards/fixtures/authorised-diffs/`, reviewed by
QA; every signature fixture change is reviewed (only content reads and presentation imports may appear);
the JSX contract fixtures are never edited.

| Id | Page (owner) | Owns | Inputs | Page-specific acceptance (besides SPA) |
|---|---|---|---|---|
| 5.1 | Home `/` (builder) | `src/content/en-IN/pages/home.ts`, `src/app/(site)/page.tsx` | `mockup/pages/home.html`, [home copy](../site/pages/home.md), D045, D046 | Hero exactly D045 with the Hand accent; the hero art board's doodle still (pick 2), the imagination-frame and close doodles draw (pick 3); CTAs `hero` (arrow), `see-it-ask`, `safety`, `finale`, learn links; `ViewContentTracker` mounted (B9); sticky bar after the hero CTA; FAQPage = the six visible answers; LCP image `fetchPriority="high"` |
| 5.2 | Product `/products/kheelu` (builder) | `src/content/en-IN/products/kheelu/page.ts`, `src/app/(site)/products/[slug]/page.tsx`, `src/app/(site)/products/kheelu/` (delete the old route and its colocated tests) | `mockup/pages/meet-kheelu.html`, [meet-kheelu copy](../site/pages/meet-kheelu.md) | Product + Offer JSON-LD; fragments `#faq`, `#story-mode`, `#reserve`, `#offer`, `#specs`; sticky bar from first paint; `ViewContent` value 4999 in token mode; speech disclaimer (D025); declarations incl. MRP from `MRP_PRICE`; details stacked (N21); `export const dynamicParams = false;` |
| 5.3 | Safety `/safety` (builder) | `pages/safety.ts`, `src/app/(site)/safety/page.tsx` | `mockup/pages/safety.html`, [safety copy](../site/pages/safety.md) | D020 order; certification "applied for, not yet granted", no ISI mark; FAQPage |
| 5.4 | Buyer's guide (builder) | `pages/ai-toys-for-kids-in-india.ts`, its route | mockup and copy of the same name; `css/ai-toys-for-kids-in-india.css` (the `mk-gd-*` rows of components §7) | No competitor names; answer-first hero; FAQPage; sources |
| 5.5 | Stories hub (builder) | `src/content/en-IN/stories/hub.ts`, `src/app/(site)/stories/page.tsx` | `mockup/pages/stories.html`, [stories copy](../site/pages/stories.md) | All 21 guides under the four topics with anchors `#screen-time`, `#talking`, `#ai-and-safety`, `#learning`; cards read title and summary from the article modules; no "Rewritten in the build" labels |
| 5.6 | Three rewritten articles (builder) | `src/content/en-IN/stories/articles/{learning-toys-for-a-three-year-old,what-to-look-for-in-a-safe-ai-toy,talking-toys-and-late-talkers}.ts` | the three article mockups and copy pages | One in-text product link each (none pitching on the late-talker page, B5); D025 disclaimer on the late-talker page; sources with markers; the merged 2-year-old topic as an H2 on the 3-year-old article (D041) |
| 5.7 | Team (builder + copywriter) | `pages/team.ts`, its route | `mockup/pages/team.html`, [team copy](../site/pages/team.md), [CMO review](../qa/cmo-review-pages-help-2026-10-11.md) | CMO fix: first screen says what Kheelu is, the age band and the search term; bios and recognition gated (D038); founder photos only if supplied (B24) |
| 5.8 | Setup (builder + copywriter) | `pages/setup.ts`, its route | `mockup/pages/setup.html`, [setup copy](../site/pages/setup.md), CMO review | CMO fix: step 2 values; the screenshot without "Games" (1.5b); D018 wording; no chilli button |
| 5.9 | Contact (builder) | `pages/contact.ts`, its route | `mockup/pages/contact.html`, [contact copy](../site/pages/contact.md) | `#grievance` anchor; seller lines identical to the footer |
| 5.10 | 404 (builder) | `pages/not-found.ts`, `src/app/not-found.tsx` | `mockup/pages/404.html`, [404 copy](../site/pages/404.md) | HTTP 404, noindex, rendered on the server with chrome and the bubble |
| 5.11 | Privacy (builder) | `src/content/en-IN/legal/privacy.ts`, `src/app/(site)/privacy/page.tsx`, **`test/analytics-tags.test.ts`** | `mockup/pages/privacy.html`, [privacy copy](../site/pages/privacy.md), [inventory row 27](../site/tracking-inventory.md#parity-checklist-phase-6-qa) | Tools named one per block (never a count); `ORDER_DATA_LOCATION` placeholder until D047's move is confirmed; D035 training disclosure; `status: draft` until approved. **analytics-tags re-pinned in the same commit (B2c):** reads the rendered privacy text (or the content module's plain text); keeps the layout and payload assertions; re-pins each wording assertion to the approved sentence (below); keeps every anti-count assertion |
| 5.12 | Terms (builder) | `legal/terms.ts`, its route | mockup and copy | D035 and D041 AI-image disclosure; full-mode variants; draft until approved |
| 5.13 | Refund (builder) | `legal/refund.ts`, its route | mockup and copy; [legal review](../qa/legal-review-pages-legal-b-2026-10-11.md) | D042 lines; `refund-learn` close; draft until approved |
| 5.14 | Shipping (builder) | `legal/shipping.ts`, its route | mockup and copy; legal review | `shipping-learn` close; draft until approved |
| 5.15 | Store page restyle (builder) | `src/app/store/page.tsx`, `src/features/preorder/components/{PreorderForm,OrderSummary}.{tsx,test.tsx,stories.tsx}`, their three signature fixtures, the literal-only patches for the two tests, `src/components/sections/store/{StoreTop,StoreDetails}/**`, `src/content/en-IN/store/{store-page,in-app-note}.ts` | `mockup/pages/store.html`, [store copy](../site/pages/store.md), [checkout](../site/checkout.md), ADR-013 | JSX contract and signature guards green; pay button labels unchanged; refund promise beside it; films below every money answer; no `<video>` at rest; no import of a path 6.3 deletes (`atoms/Field`, `lib/cn`, `lib/interactions`, `molecules/PromiseMark`, `organisms/VideoMoments`, `lib/video-moments`, `lib/kheelu-art`); the bubble (store text); in-app note built with `enabled: false` (N7); `npm run qa:payment` reaches the open sandbox sheet; store noindex |
| 5.16 | Confirmation `/thanks` restyle (builder) | `src/app/store/thanks/page.{tsx,test.tsx}`, `src/features/preorder/components/AddressForm.{tsx,test.tsx,stories.tsx}`, their signature fixtures and literal-only patches, `src/components/sections/store/{ConfirmationHead,OrderRows,AddressStep,HelpBlock}/**`, `src/content/en-IN/store/confirmation.ts` | `mockup/pages/store-confirmation.html`, its copy | JSX contract and signature guards green; `ph-no-capture ph-mask` on the order container in the paid and created branches; the bubble with `ph-no-capture` (`/thanks` text); **delivery line (N9, F12):** `OrderRows` shows "Ships from 20 October 2026" (`SHIP_DATE_TEXT`, as today) for orders created before 2026-10-10 00:00 IST and the D023 line for later ones, chosen in `OrderRows/delivery-line.ts` (outside the frozen file), both cases tested, until F12 is answered; "Save my address" primary button (white on Blue question, architecture §13); no import of a path 6.3 deletes |
| 5.17 | Articles: screen time (copywriter, then builder) | `src/content/en-IN/stories/articles/{how-much-screen-time-for-a-3-to-6-year-old,screen-time-rules-parents-swear-by,screen-time-and-tantrums,the-gentle-way-off-the-phone,busy-hands-no-screens,screen-free-does-not-mean-silent}.ts` | the article template, the three approved articles, `src/lib/stories*.ts` (legacy text as input only), [claims](../product/claims.md), [source verification](../research/source-verification.md) | Rewritten to the template and rules (3-7, D016, D025, D026 markers); `related` keeps three incoming links per article; CMO approval before merge (brief Phase 5 step 1); titles ≤ 60 |
| 5.18 | Articles: talking and language (copywriter, then builder) | `…/articles/{talking-late-or-talking-little,how-to-get-your-child-talking,how-children-learn-by-talking,how-children-collect-words,raising-a-bilingual-child-in-india,a-toy-that-talks-vs-a-toy-that-listens}.ts` | as 5.17 | as 5.17; speech-delay answers only with the D025 disclaimer |
| 5.19 | Articles: AI, safety and learning (copywriter, then builder) | `…/articles/{questions-parents-ask-about-ai-toys,should-kids-use-ai,ai-toys-and-indias-data-law,does-a-three-year-old-need-an-ai-tutor,what-actually-builds-a-sharp-brain,why-three-to-six-are-the-years-that-matter-most}.ts` | as 5.17 | as 5.17; no competitor names; brain wording per D016 |

**Test for every wave-5 task:** the SPA specs for its route(s) plus its unit tests; store tasks add
`checkout-jsx-contract`, `checkout-signature`, `checkout-freeze` and `qa:payment`.

The 18 articles without a mockup: visual acceptance is template parity (a rendered article compared with
`story-learning-toys-for-a-three-year-old.html` chunk by chunk for the shared parts: head, answer block,
body styles, sources, close) and SPA items 2-9.

**5.11 privacy re-pin (B2c).** Of the 35 positive wording patterns in `analytics-tags.test.ts`
(`toMatch`/`toContain` on the privacy text, tool-name loops excluded), 22 have no match in the approved
privacy page (each pattern run against the visible text of `mockup/pages/privacy.html`, 2026-10-12),
although every disclosure is still there in new words. 5.11 re-pins them to the approved sentences, for example: per-tool
cookies ("It sets no cookies and does not follow you to other sites." for Vercel and Ahrefs; "It sets
cookies in your browser…" for GA4; "It sets a cookie and does follow you to other sites." for the Meta
Pixel); the server report ("our own server reports it to Meta: one-way codes of your email, phone number
and first name…"; "the report our server sends to Meta … comes from us, not from your browser"); the proxy
("PostHog reports through our own address, so an ad blocker usually can't tell it apart from the site
itself"); replay ("Anything you type is hidden before the recording leaves your browser, and nothing is
recorded on the order confirmation page"); PostHog reach ("It does not follow you to other sites and is
never used to advertise to you"); the stored identifier ("the anonymous identifier PostHog gave your
browser"; "It identifies a browser, not a person"); the cookies (`kh_utm` "remembers which campaign
brought you, for as long as your visit lasts"; `kh_fbclid` "which advertisement click"; "Meta can match
that click back to your account"); blocking ("Your browser can block the tools that load from another
company's address"). Apostrophes are normalised before matching. "most detailed of the five" is not
re-pinned: the approved copy does not carry it and it is a count, which the file itself bans. The
processor names, the payload key allow-list and every `not.toContain` stay.

## Wave 6: store extras and gated changes (after wave 5; all parallel)

### 6.1 Store secondary pages (builder)

- **Owns:** `src/app/store/e/[event]/page.tsx`, `src/app/store/ideabaaz/page.{tsx,test.tsx}`,
  `src/app/store/[...rest]/page.tsx`, `src/app/store/not-found.tsx`,
  `src/app/store/_components/NotFoundPanel.{tsx,test.tsx}`, their signature fixtures and literal-only
  patches, `src/content/en-IN/store/{event-page,partner-page}.ts`.
- **Acceptance:** JSX contract and signature guards green; reuse `StoreTop` and `StoreDetails`; the event
  page keeps token shape and signature handling; `/ideabaaz` keeps "The Ideabaaz exclusive has ended." and
  its logo (B29); store dead ends answer 200 in store chrome; the not-configured state reads "Pre-orders
  open here shortly."; the bubble (store text); no import of a path 6.3 deletes; axe and no-sideways green
  on the matrix.
- **Test:** the two frozen tests (with their reviewed patches); `not-found-ssr`; e2e on each path.

### 6.2 New checkout events (B11) (builder; gated)

- **Gate:** starts only after the main session confirms B11 (working default; the founder may override).
- **Owns:** `src/features/preorder/lib/checkout.ts`, `src/features/preorder/components/PreorderForm.tsx`
  and its signature fixture, `src/lib/tracking/events.ts` (status change only),
  `test/guards/fixtures/authorised-diffs/{src__features__preorder__lib__checkout.ts,src__features__preorder__components__PreorderForm.tsx}.patch`,
  the events wording in `src/content/en-IN/legal/privacy.ts` (same commit, analytics-tags rule).
- **Acceptance:** the three events of architecture §8.2 fire to GA4 and PostHog only, with the listed
  parameters and no personal data; every existing event unchanged (parity spies); the JSX contract
  unchanged; `qa:payment` shows `preorder_payment_window_opened`, a forced sandbox failure shows
  `preorder_payment_failed` with Razorpay's code.
- **Test:** tracking parity, the reviewed patches, the sandbox probe, `checkout-jsx-contract`.

### 6.4 Receipt email and `/thanks` wording alignment (builder; gated on F12)

- **Gate:** the founder's answer on deliveries for orders placed before 10 October (F12).
- **Owns:** label strings in `src/lib/email/templates.ts` only (facts and branching untouched),
  `src/lib/email/templates.test.ts` (literal-only), `src/components/sections/store/OrderRows/delivery-line.ts`,
  `test/guards/fixtures/authorised-diffs/{src__lib__email__templates.ts,src__lib__email__templates.test.ts}.patch`.
- **Acceptance:** "Due on dispatch" → "Due before delivery"; "Ships from" → the delivery line per F12; the
  `/thanks` rule in `delivery-line.ts` follows the same answer; "(messages, not calls)" removed per D032;
  email tests green; the patches reviewed.
- **Test:** `templates.test.ts`; freeze guard with the reviewed patches.

**Wave 6 ownership check:** 6.1, 6.2 and 6.4 own disjoint files (6.2's `PreorderForm.tsx` is not in 6.1;
6.4's `delivery-line.ts` was 5.16's in the previous wave). A gated task whose gate has not opened simply
waits; it may run in any later wave before wave 8, alone with its own files.

## Wave 7: clean-up and dependency retirement (after wave 6)

### 6.3 Clean-up and dependency retirement (builder)

- **Owns:** deletion of everything [structure §1](structure.md#1-the-tree) lists under "Removed during the
  build" (including `src/app/(site)/playos/`, `src/lib/cn.ts`, `src/lib/interactions.ts`, the legacy
  `src/lib/seo.ts` with its test, `src/styles/globals.css`), `package.json`, `package-lock.json`
  (retirements by name), `docs/standards/` (delete), the retired guard tests (`preorder-cta`,
  `action-label`, `kicker-language`, `kheelu-art`, `contrast-tokens`, `a11y-v4`, `config-copy` with the
  legacy copy constants it guards once nothing imports them), `test/stories-parse.test.ts`,
  `test/utm.test.ts`, `test/dependency-floor.test.ts`, `test/guards/legacy-paths.ts`,
  `tools/qa/{sweep,shot,text,axe-run}.mjs` (delete) and their npm scripts.
- **Inputs:** [cleanup](../legacy/cleanup.md), [cleanup-public-assets](../legacy/cleanup-public-assets.md),
  [dependencies](dependencies.md), the guard-test ownership table.
- **Acceptance:** no file imports a deleted path (`tsc`, build); `LEGACY_PATHS` empty and every guard green
  over all of `src/` (no "pending" route left); `stories-parse` floor > 40 with
  `src/components/ui/Button/Button.stories.tsx` as its anchor; `utm.test` imports `CANONICAL_ORIGIN`;
  retired packages removed one by one with the lockfile diff read; `dependency-floor` drops only the
  `fflate` floor, and only if `npm ls fflate` is empty after `three` leaves (evidence in the report);
  `npm audit` clean of high or critical runtime advisories; `jscpd` under threshold; asset-dupes green;
  every remaining file in `public/` referenced or marked FOUNDER in assets.md; the deleted list logged for
  the main session.
- **Test:** `npm run verify` and `npm run verify:e2e` green.

## Wave 8: full verification on a local production build (after wave 7)

### 7.1 Full verification (QA; builders fix)

- **Owns:** QA's pages in `wiki/qa/`; fixes go back to the owning task's files.
- **Acceptance:** the [test plan](../qa/test-plan.md) §4, §5, §7-§9 on L and LP: `npm run verify` and
  `verify:e2e` green on every route and the viewport matrix; Lighthouse mobile median of 3 on the test
  plan's ten pages ≥ 90 in all four categories with the authoritative run per category (N18: Performance
  and Best Practices from the LP-tags profile, a local production build under the real hostnames with the
  tags loading and their beacons blocked; SEO from LP-tags; Accessibility from any; pre-approved
  exceptions aside); tracking probe rows of the inventory checklist that can run locally; CLS with fonts
  delayed (N17); DS checksums; the production dry run (`KH_SITE_ENV=production npm run build`) fails while
  placeholders or drafts remain and its list goes to the founder; CMO built-page pass on every page,
  including the reviews that did not run before approval.

## Wave 9: beta deploy and beta QA (after wave 8)

### 7.2 Beta deploy and beta QA (main session, founder, QA)

- **Owns:** the `beta` branch (the main session pushes it); the founder's dashboard steps
  ([architecture §15.4](architecture.md#154-founder-runbook-the-beta-vercel-dashboard-only-never-the-cli)).
- **Gate before any beta payment (B4):** all five recorded by the main session; QA refuses to start the
  payment procedure without them:

  | Precondition | Who | Check |
  |---|---|---|
  | Beta uses its own Supabase project (`ap-south-1`), never production's | Founder | The beta `SUPABASE_URL` project ref differs from production's (recorded); QA's first beta order is absent from production's admin view (founder spot check) |
  | `RAZORPAY_KEY_ID` in Preview (branch `beta`) is `rzp_test_…` | Founder | `GET https://betastore.kheelona.com/api/health` shows `"razorpay":"test"`; the sheet shows Razorpay's test banner |
  | No `META_CAPI_TOKEN` or `META_CAPI_TEST_CODE` in Preview | Founder | `/api/health` on betastore shows `"capi":"missing"` |
  | `ORDER_ALERT_EMAIL` and `EMAIL_FROM` in Preview point at a test inbox, or `RESEND_API_KEY` is absent | Founder | The alert for QA's test order arrives at the test inbox only |
  | PostHog's test-account filter and revenue analytics exclude `env = beta` (and `internal = true`) | Founder, or the PostHog analyst with the founder's OK | A HogQL query of `purchase_confirmed` with the filter on returns no beta rows |

- **Acceptance:** both beta hosts serve the build; every HTML route carries `x-robots-tag: noindex,
  nofollow` and the robots meta, and non-HTML files (`/llms.txt`, `/pricing.md`, `/sitemap.xml`, an image,
  a film) carry the header (N1); every CTA opens betastore; the beta database is awake (`store: ready`,
  N11); the test-mode payment of [test plan §6](../qa/test-plan.md#6-razorpay-test-mode-payment-on-betastore)
  completes to `/thanks`; no GA4, Meta Pixel, CAPI or Ahrefs requests from beta; PostHog events carry
  `env = beta`; no `$current_url` containing the bypass secret (N5); axe and Lighthouse Accessibility on
  beta through the bypass cookie; region and timing: `x-vercel-id` names `bom1` on marketing and store
  responses, `curl -w` timings from QA's network, and the founder runs the same one-line command from an
  Indian network (N26); the founder's in-app browser check on a real Android phone in WhatsApp and
  Instagram ([test plan §6.4](../qa/test-plan.md#64-in-app-browsers-real-devices)) decides whether the
  in-app note is enabled; the bypass secret rotated after any real-device test that used a query bypass.

## Wave 10: Gate B and release (after wave 9)

### 7.3 Gate B readiness pack and release (main session, founder)

- **Owns:** the readiness pack (main session's pages), the rollback tag, the merge to `main`.
- **Acceptance:** per [architecture §15.5](architecture.md#155-gate-b-release-to-production-and-rollback):
  founder prerequisites done (Supabase moved, placeholders answered, legal approved, optional `www` switch,
  the waiver of "checkout in test mode" on production in favour of the beta payment on the same commit
  recorded, N10); Gate B OK logged; rollback tag pushed before the merge; production build green
  (placeholder guard passes); smoke tests green; sitemap resubmitted; monitoring scheduled (24 hours,
  72 hours, 7 days).

---

## D049 and D050 owners (B1)

| Pick | What | Presets (1.2) | Owner of the behaviour | Test |
|---|---|---|---|---|
| 1A | Sections fade and rise, below the fold, once | `[data-reveal]`, `.is-in` | 2.8 (`MotionController`); pages place `data-reveal` as the mockup | `motion-reveal.spec.ts`; `no-reveal-on-money`; `motion.spec.ts` (page sweep) |
| 2A | Hero still | none (absence) | 3.3 (`HeroSection`), 2.3 (hero doodles as `<img>`) | `motion-hero.spec.ts`; `motion.spec.ts` (every route's hero) |
| 3B | Doodles draw themselves below the fold | `.ks-doodle[data-draw]`, `[data-draw-order]` | 1.5 (generated doodles), 2.3 (`Doodle`), 2.8 (observer) | `motion-doodle.spec.ts`; `generated-doodles` drift test |
| 4A | Phone buy bar slides up once | `.kh-buybar.is-hidden` | 3.1 (`StickyBuyBar`) | `chrome.spec.ts` |
| 5A | Phone menu slides from the side | `dialog.kh-drawer[open]` | 3.1 (`NavDrawer`) | `chrome.spec.ts` |
| 6B | Orange button: arrow nudge on hover, DS press | `.ks-btn__arrow`, `--ks-nudge` | 2.2 (`Button`, `PreorderButton`) | `motion-button.spec.ts` |
| 7B | FAQ answers open smoothly | `.kh-faq__item::details-content`, `.ks-faq__clip`, `.kh-faq__sign` | 2.4 (`FaqList`) | `motion-faq.spec.ts` (with and without support) |
| 8B | Film in focus grows | `.ks-film.is-focus`, `--ks-film-focus` | 3.3 (`FilmsStrip`) | `motion-films.spec.ts`; `no-sideways` at both ends |
| D050 | WhatsApp bubble lifts with the bar; laptop label | `.ks-wa`, `html[data-buybar="shown"]`, `.ks-wa__label` | 3.1 (`WhatsAppFloat`, `StickyBuyBar`); 5.10, 5.15, 5.16, 6.1 render it on their routes | `chrome.spec.ts` bubble cases |

## Dependency summary

| Wave | Tasks | Starts after |
|---|---|---|
| 1 | 1.1, 1.2, 1.3, 1.4, 1.5, 1.5b, 1.6 | Phase 4 QA approval of this plan |
| 2 | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 | wave 1 closed |
| 3 | 3.1, 3.2, 3.3, 3.4 | wave 2 closed |
| 4 | 4.1, 4.2, 4.3, 4.4 | wave 3 closed |
| 5 | 5.1-5.19 | wave 4 closed |
| 6 | 6.1, 6.2 (gated), 6.4 (gated) | wave 5 closed |
| 7 | 6.3 | wave 6 closed (gated tasks may still be waiting; they touch no file 6.3 deletes) |
| 8 | 7.1 | wave 7 closed |
| 9 | 7.2 | wave 8 closed and the five B4 preconditions recorded before any beta payment |
| 10 | 7.3 | wave 9 closed and the founder's Gate B OK |
