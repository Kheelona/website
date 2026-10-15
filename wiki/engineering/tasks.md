---
title: "Build tasks in dependency waves, with ownership, inputs, acceptance criteria and tests (Phase 5, final after QA round 1)"
type: plan
updated: 2026-10-14
sources:
  - ../decisions/D051-beta-without-store-integrations.md (beta without store integrations; task 2.10; 7.2 and 7.3 revised)
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
   the only literals are those in `test/guards/token-exceptions.ts`. Composition CSS ported from the mockup
   follows the rules of [mockup-css-mapping §5](mockup-css-mapping.md#5-rules-for-builders-porting-mockup-css)
   and the row for each value in its §3 (type by `ks-type-*` classes, fixed widths as exact `calc()` of
   space tokens, weights only in the named files); a page-only `mk-` name styled differently on two pages
   becomes a variant or its own `ks-` name (its §6.2). A value the guard refuses that has no row there goes
   to the main session.
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
| `test/security-headers.test.ts` | `next.config.ts` text (`securityHeaders`, `async headers()`, `poweredByHeader: false`) | Keep (1.3 keeps the three literals); **6.6** added the D054 item 9 assertions (the admitted hosts, no `upgrade-insecure-requests`, still Report-Only, the wildcard sources equal to the tag's) |
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
| `test/guards/visual-layer.test.ts` ("runs on the Next version its plugin objects were verified on": pins `16.3.8`) and `postcss.config.mjs` `tailwindByEntry` (throws at load if `@tailwindcss/postcss` changes shape) | `next` and `@tailwindcss/postcss` versions | **Whoever bumps `next` or `@tailwindcss/postcss`** re-runs the scratch `next build` check described in the test's message, then updates the pin in the same commit (main session, 2026-10-12) |
| `test/guards/generated-css.test.ts` (Devanagari coverage) | every Devanagari character in non-test `src/` files and `mockup/pages/*.html` against the Baloo 2 Devanagari subset | **Any task that adds Devanagari text** regenerates `public/fonts/baloo2-variable-devanagari.woff2` and `src/styles/generated/fonts.css` with `node scripts/assets/build-fonts.mjs` in the same commit (never by hand); the guard and the script stay 1.2's |
| `test/guards/client-icons.test.ts` (2.11) | every `"use client"` module and `*.client.tsx` under `src/`, their imports; its root list and `CLIENT_SAFE` list name files | Keep. A task that moves or renames a listed island or client-safe module updates both lists in the same commit; a task that adds a client-safe `ui` module adds it to `CLIENT_SAFE` (wave-2 close) |
| `src/lib/email/templates.test.ts` | email facts | Keep; **6.4** only with its reviewed diff |
| `test/email-delivery-line.test.ts` | the receipt's delivery row and order-number label against the `/thanks` card (`src/lib/offer/delivery-line.ts`, `confirmation.order`) | Keep (**6.4** wrote it; it sits outside `src/lib/email/` because a frozen folder cannot gain a file) |
| Tests of frozen code (`features/preorder/lib/*`, `lib/store/*` other than `posthog-server`, `app/api/**`, `lib/fbq`) | frozen modules | Keep |
| Tests of legacy components and modules (`atoms`, `molecules`, `organisms`, `templates`, `vendor`, `features/home`, `lib/{seo,stories,growth-arc}`, old product `_components`) | legacy | Deleted with their subjects: 5.2 (old product route), 6.3 (the rest) |
| `test/machine-files.test.ts` (`DATED`) and the routes' `LLMS_UPDATED` / `PRICING_UPDATED` | the bodies of `llms.txt` and `pricing.md`, built from faqs, trust, seller, offer, product, navigation, topics, routes, organization, policies, cta | **4.4** wrote them. **Main session**: in the same commit as any change to one of those modules (a founder filling an F4 placeholder too), bump the date constant(s) and re-pin `DATED` (wave-4 close); **4.5** item 6 |

**Batch 6b merge rulings (main session, 2026-10-14).** Edits outside a task's written Owns, accepted at the merge:
- **6.4:** the receipt's delivery row by `created_at` (D054 item 1, D023), with the rule moved to
  `src/lib/offer/delivery-line.ts` so `lib/email` imports no section (structure §6); the receipt's "Order number" label.
- **6.5:** `test/guards/redirect-hops.test.ts` (one LEGACY sample), `test/e2e/redirects.spec.ts` (one row), the
  `stories` key of `test/e2e/support/deviations.ts`, the new `src/content/en-IN/stories/parity-deviations.test.ts`, the
  hub and article route tests (20 guides), `test/machine-files.test.ts` (two sitemap floors): counts and V9 only.
- **6.6:** `test/guards/checkout-freeze.test.ts` gains the `RETIRED` map (a deletion only for a listed path whose
  reviewed patch cites its decision); the frozen `src/app/store/ideabaaz/page.test.tsx` and the page's signature fixture
  are deleted with the page (D054 item 7); 6.1's `test/store-env-beta.test.ts` and `test/e2e/store-secondary.spec.ts`
  follow; `test/guards/banned-phrases.data.ts` `us-program` allows exactly "NVIDIA Inception Program".
- **6.7:** `src/content/types.ts` `LegalTemplateCopy.grievanceNote` is optional (commit `7ce9c1c`); the main session
  moved `LegalTemplate.test.tsx` and its story to the Gate A words (`LEGAL_TEMPLATE_GATE_A_COPY` in
  `test/fixtures/legal`), and re-pinned `llms.txt` (`LLMS_UPDATED` 2026-10-14).

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
     DS gap G-20) in `src/components/chrome/WhatsAppFloat/whatsapp-float.css`, **plus the ten entries of
     [mockup-css-mapping §4](mockup-css-mapping.md#4-named-exceptions-for-token-exceptionsts)** (nine
     `CSS_EXCEPTIONS` and the per-file `MEDIA_EXCEPTIONS` `content-max-1200`; added after the 1.1 merge by the
     main session, commit `5c65999`, 2026-10-12, each proven red outside its files). Inline `style` is allowed only
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
  Offer); `placeholder()` and `{ph:}` produce `[PLACEHOLDER ID: note]`; `formatInr(10_000_000)` = "₹1,00,000" (the argument is **paise**, like every money constant in the frozen block; the DS helper takes rupees; spec corrected 2026-10-12 after the 1.6 review).
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
  `DoodleDefs` renders one hidden SVG holding `#ks-chalk`. motion.css draws every
  `.ks-doodle[data-draw] path:not(.ks-doodle__fill)` as a stroke, so any filled path must carry `ks-doodle__fill`
  (`build-doodles.mjs` adds it to generated doodles; architecture §11.2 row 3).
- **Test:** component tests (attributes, `sizes`, no `priority`); `motion-doodle.spec.ts` on the stories
  (pick 3): below the fold `stroke-dashoffset` goes 1 → 0 within `--duration-draw` after entering, staggered
  by order; drawn at once with reduced motion; drawn without JavaScript.

### 2.4 Primitives: content blocks (builder)

- **Owns:** `src/components/ui/{Card,TrustList,TrustLine,TickList,PriceSentence,HelpLine,SellerLines,OfferCard,FaqList,StepLoop,LanguageChips,CompareTable,List,Quote,EmptyState,DefinitionList,Breadcrumbs}/**`,
  `test/e2e/motion-faq.spec.ts`.
  (No `Tabs` here: built by 3.5 after N21 was corrected, wave-3 close.)
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
  effect; N7; a `useSyncExternalStore` read with a `false` server snapshot counts, wave-2 close ruling) and
  copies the store URL it is given.
- **Test:** component tests incl. user-agent and flag cases; stories.

### 2.6 Tracking runtime (builder)

- **Owns:** `src/components/tracking/**` (including the moved tests), `src/lib/tracking/{track,internal-flag}.ts`,
  `src/components/molecules/{GoogleAnalyticsGate,MetaPixel,PostHogGate}.*` (move out, delete originals),
  `src/app/(site)/products/kheelu/_components/ViewContentTracker.*` (move out), the import lines of
  `src/app/layout.tsx` and `src/app/(site)/products/kheelu/page.tsx` that point at the moved files, **the
  `POSTHOG_HOSTS` line of `src/config/site.ts`** (with its doc comment and the `BETA_HOSTS` import line),
  `test/guards/{tracking-freeze,tracking-parity,posthog-init-fixture,cta-registry}.test.ts`,
  `test/guards/fixtures/tracking-diffs/*.patch`, `test/guards/fixtures/posthog-init/*.json`,
  `src/lib/tracking/{track,internal-flag}.test.ts` (added at the wave-2 close, 2026-10-12).
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
  BlogPosting, HowTo, **AboutPage and ContactPage** (as live; architecture §9.2, ruling 2026-10-12) take data only; `jsonLd()` escaping kept; Product `@id` unchanged; robots per §9.3 with
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
  (or `.next/server/route-cache` on Vercel, [lessons §1](lessons.md#1-nextjs-16-and-vercel-behaviour)) after `next build`; on beta and development prints the count and the list and exits 0.
  `build-steps.test.ts` asserts the required step files exist (prebuild 10, 20, 30; postbuild 10).
- **Test:** proven red (a planted `{ph:` in a fixture module with `KH_SITE_ENV=production`) and green;
  the excluded files never trip it.

### 1.1b Harness addendum (builder; runs with wave 2)

- **Why:** the minor findings of 1.1's last review (run `wf_7ba453ba-6cb`), left after 1.1 merged.
- **Owns:** `test/guards/no-off-token.test.ts` (no new exceptions in `token-exceptions.ts`), `playwright.config.ts`,
  `scripts/qa/lighthouse.mjs`, `test/e2e/support/**` where needed, `tsconfig.guards.json`,
  `test/{lighthouse-gating,playwright-projects}.test.ts` (Vitest excludes `test/e2e/**`; added at the wave-2 close).
- **Acceptance:**
  1. no-off-token also refuses Tailwind arbitrary modifiers (`text-sm/[17px]`, `bg-black/[0.37]`), arbitrary
     properties whose name has a digit or a capital (`[--ks-x2:3px]`), and a CSS named colour that reaches a
     colour attribute through a const (`const C = "red"; <path fill={C} />`) or an object property or spread
     (`<path {...{ fill: "red" }} />`); red table cases for each, green for `fill="currentColor"` and tokens.
  2. An opt-in WebKit project (`KH_WEBKIT=1`): iPhone emulation for the layout specs (no-sideways, first-screen,
     cta, axe, chrome) and WebKit at the laptop sizes (test plan §1.2, §3, §4.1 safe-area on WebKit); the
     config header documents `npx playwright install webkit` (approved: the browser for the pinned Playwright
     1.63.0, no npm change).
  3. `lighthouse.mjs`: the Best Practices allowance applies only when **every** run's failing audits are in
     the allowed list (union printed); **gating = the simulated median** (Lighthouse's default, PageSpeed's
     method); devtools-throttled medians are recorded and printed, with a warning below budget, never gating
     (lessons §6 "record both"; main session 2026-10-12).
  4. **Colocated tests and stories are type-checked** (2.8's finding: `tsconfig.vitest.json` inherits the `test`
     and `*.test.*` excludes and finds no inputs, so `npm run verify` never type-checks `src/**/*.test.tsx` or
     `*.stories.tsx`): extend `tsconfig.guards.json` (1.1 owns it) to include `src/**/*.test.{ts,tsx}`,
     `src/**/*.stories.tsx`, `src/**/*.test-d.tsx` and `test/**/*.ts(x)`, excluding by name only the legacy files
     that fail today (`test/utm.test.ts`, the frozen `PreorderForm.test.tsx`, the legacy stories and tests the
     review listed), each commented with the task that deletes or rewrites it (6.3, 2.6, 5.15); green at the end.
  5. `test/guards/jsonld-matches-page.test.ts`: the Product fixture uses `warranty` on the Offer (a
     `WarrantyPromise`), not the non-schema.org `hasWarranty` (2.7's finding).
- **Test:** `npm run verify` green; each new no-off-token case proven red; the WebKit project runs one spec
  green locally when installed.

### 1.2b Font scan robustness (builder; runs with wave 2)

- **Owns:** `scripts/assets/build-fonts.mjs`, `test/guards/generated-css.test.ts`.
- **Acceptance:** both Devanagari scans (the script's `devanagariSources()` and the test's restatement) skip
  dot-files and skip a file that vanishes between listing and reading (ENOENT), so a concurrent
  `buildComposeCss()` temp file can never fail them; the two stay identical; regenerated outputs are
  byte-identical (`--check` green).
- **Test:** whole Vitest suite and `npm run build` green.

**Wave 2 ownership check:** `src/config/site.ts` only in 2.6 (the `POSTHOG_HOSTS` line); `ui/` folders
distinct; the layout import lines only in 2.6; no task touches `src/lib/cn.ts`; 1.1b and 1.2b touch only
wave-1 tooling files no wave-2 task owns.

### 2.10 Beta never takes a payment (D051) (builder)

- **Goal:** the beta build cannot reach Razorpay, Supabase or email, whatever environment variables
  Vercel gives it ([D051](../decisions/D051-beta-without-store-integrations.md)).
- **Owns:** `src/lib/store/env.ts` (one early return), `test/store-env-beta.test.ts`,
  `test/guards/fixtures/authorised-diffs/src__lib__store__env.ts.patch` (regenerated and reviewed).
- **Acceptance:** `storeEnv()` returns null and `missingStoreEnv()` reports the store as not configured
  when `SITE_ENV === "beta"`; production, preview and development unchanged (truth table against the
  tag); the store page renders its not-configured state on beta and every store API route answers 503
  there (route tests with `KH_SITE_ENV=beta`); `/api/health` on beta reports `store: not-configured`;
  the reviewed patch carries D051 in its header; checkout-freeze green with the new patch.
- **Test:** `test/store-env-beta.test.ts`; the checkout guards.

### Wave 2 close: rulings and follow-up tasks (main session, 2026-10-12)

Wave 2 merged at `d87c71f` (twelve tasks, run `wf_2317874f-e7d`); `npm run verify` green (234 files, 3581 tests),
`next build` green, DS checksums intact. Rulings on the reviewers' open points:

- **Ghost buttons** keep the mockup's markup (`kh-btn kh-btn--ghost`): `Button/button.css` ports mockup.css:135
  verbatim onto `.kh-btn--ghost` (done by the main session at the close; architecture §4.4).
- **Client islands never import `Icon`, `Button` or `PreorderButton`** (each pulls the whole icon map, about
  10.6 KB gzip, against the §12 route budget): a server parent renders them and passes them in as children or
  props; icons inside an island come from the named path constants through `Glyph` or `IconButton` (task 2.11).
- **Placeholders guard:** the source scan skips files that never ship (tests, specs, type tests, stories,
  snapshots, fixtures) and prints them; the postbuild HTML scan still covers everything that ships (2.13).
- **MotionController** also takes targets added after it armed (2.12); the authoring rule stays: `data-reveal`
  and `data-draw` go on server-rendered elements with a static `className` (architecture §11.3).
- **Offer cache:** a Redeploy after the sell-out switch waits 300 s after `/api/health` shows `full`
  (architecture §15.5, ADR-005), because `unstable_cache` outlives a deployment.
- **Organization JSON-LD input:** `SiteShell` (3.1) maps the content's `OrganizationFacts` to
  `organizationNode()`'s input in a small tested function in its own folder; 4.4 reuses it. No type is renamed.
- **`stub.ts`** was deleted at the wave 5 part C merge, once 5.17-5.19 had rewritten the last stubs (it was 6.3's).
  The three stub titles too long for " · Kheelona" went with their rewrites.
- **Hero art layers** stay eager at `fetchPriority="low"` as the mockup has them (2.3's choice, accepted).
- **`useSyncExternalStore`** with a `false` server snapshot counts as "detected in an effect" (N7, ADR-003): later
  islands may follow 2.5's `InAppBrowserNote` pattern.
- **Numeric opacity modifiers** (`bg-surface/37`) are off-token: the DS has no opacity tokens (2.13).
- **2.7's offline schema.org vocabulary check** stays out of the repo (a 1.5 MB vocabulary file); the live
  validators run in Phase 6 QA.
- Stale comments about beta Razorpay payments inside frozen store tests stay (byte-identical to the tag).
- After 2.11 (merged `91208de`): `Alert`, `Select`, `Checkbox` and `field-parts` still draw their own `<svg class="kh-icon">`
  and carry stale "ui/Icon is task 2.2" comments; the main session switches them to `Glyph` at the wave-3 close (markup unchanged).

### 2.11 Client-safe icons (builder; runs with wave 3, before 3.1 and 3.3)

- **Why:** `Icon` and `IconButton` import the whole icon map (`src/assets/icons.generated.ts`, 30 KB, about
  10.6 KB gzip), so any client island using them ships all 76 paths (2.2 and 2.5 review findings).
- **Owns:** `scripts/assets/build-icons.mjs`, `src/assets/icons.generated.ts`, `test/guards/generated-icons.test.ts`,
  `src/components/ui/{Icon,IconButton,CopyLinkButton}/**`, `src/components/ui/Field/field-icons.{ts,test.ts}`,
  `src/components/ui/Alert/alert-icons.ts`, `test/guards/client-icons.test.ts` (new), and the catalogue rows
  `Icon`, `IconButton`, `CopyLinkButton`, `Field`, `Alert` (components.md) and the icons row (assets.md).
- **Acceptance:**
  1. The generator also emits one named constant per icon (`ICON_CARET_LEFT`: upper snake case of the file
     name) typed with a branded `IconPath`; `ICON_PATHS` is built from them with the same values; regenerating
     is byte-stable; the generated-icons guard covers the constants.
  2. `Glyph` (`ui/Icon/Glyph.tsx`, props `d: IconPath`, `label?`, `className?`) renders exactly the markup `Icon`
     renders today; `Icon` renders through it (its markup and tests unchanged).
  3. `IconButton` takes `icon: IconPath` (a named constant) and imports only `Glyph`, so a client island may use
     it; its tests and stories use the constants.
  4. `field-icons.ts` and `alert-icons.ts` re-export the named constants (no copied path data);
     `CopyLinkButton` draws its icon with `Glyph` and `ICON_COPY`, markup unchanged.
  5. `client-icons.test.ts`: from every module under `src/` that starts with `"use client"` (and every
     `*.client.tsx`), following relative and `@/` imports transitively (type-only imports skipped), no reachable
     module is `ui/Icon/Icon.tsx`, `ui/Button/**` or `ui/PreorderButton/**`, and none imports `ICON_PATHS`.
     Proven red by three plants (a client file importing `Icon`; one importing a helper that imports `Button`;
     one importing `ICON_PATHS`) and green on the tree.
  6. Proof on a production build that a client chunk carries only the paths it uses: a scratch client probe
     importing `ICON_CARET_LEFT`, `next build`, the chunk holds that path and not another icon's (Turbopack
     removes unused exports in production builds, `turbopackRemoveUnusedExports`,
     `node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md`); probe deleted, evidence reported.
- **Test:** `npm run verify` and `npm run build` green.

### 2.12 Wave-2 runtime follow-ups (builder; runs with wave 3)

- **Owns:** `src/components/ui/{MotionController,ArtBoard,Card,Photo,InAppBrowserNote}/**`,
  `test/e2e/{motion-reveal,motion-faq}.spec.ts`, the href handling in `src/components/ui/Button/Button.tsx`,
  `src/components/ui/RichText/RichText.tsx` and `src/components/ui/Logo/Logo.tsx` (with their tests), and the
  `InAppBrowserNoteContent` shape in `src/content/types.ts`.
- **Acceptance:**
  1. `MotionController` also handles `[data-reveal]` and `[data-draw]` nodes added after it armed (one
     `MutationObserver` on `document.body`, `childList` and `subtree`, disconnected on disarm): an added target on
     screen gets `is-in` at once (its doodle animations finished, as at arming); one below is observed. Unit cases
     insert a below-fold and an on-screen target after the first frame.
  2. `ArtBoard`: `lcp` only together with `hero` (typed; a type test refuses `lcp` alone).
  3. `Card`: link rows keyed by index and `href`; `links` is a readonly array.
  4. `Photo`: the `fetchPriority` doc comment and test name describe what the prop does, without citing N19.
  5. `InAppBrowserNoteContent` moves to `src/content/types.ts` (structure §6: `ui` may import `content/types`).
  6. `Button`, `RichText` and `Logo` route an `href` through `next/link` only when it starts with a single `/`;
     a protocol-relative `//host/path` is an external link (tests).
  7. `motion-faq.spec.ts` under the opt-in WebKit project (`KH_WEBKIT=1`): if WebKit lacks `::details-content`,
     the 7A case runs there too; if it has it, the spec's comment says so.
- **Test:** `npm run verify`; the touched e2e specs green.

### 2.13 Wave-2 guard and library follow-ups (builder; runs with wave 3)

- **Owns:** `scripts/guards/placeholders.mjs`, `test/guards/{placeholders,build-steps,asset-dupes,tracking-freeze,no-off-token}.test.ts`,
  `tsconfig.guards.json`, `test/guards/banned-phrases.data.ts` (the `lumi` entry), `src/content/en-IN/products/kheelu/product.{ts,test.ts}`
  (`alternateName` only), `src/lib/seo/**`.
- **Acceptance:**
  1. The placeholders source scan skips files that never ship (`*.test.*`, `*.spec.*`, `*.test-d.*`,
     `*.stories.*`, `__snapshots__/`, `__fixtures__/`) and prints their count as "not scanned (never shipped)";
     the draft pattern also matches a backtick-quoted `draft`; `build-steps.test.ts` refuses a `vercel-build` or
     `now-build` script in `package.json`.
  2. `asset-dupes.test.ts`: an explicit 30 s timeout on the hashing test.
  3. `tracking-freeze.test.ts`: `git diff --no-index` runs with the user's and the system's git configuration
     neutralised; proven by a run with a hostile global setting (`diff.interHunkContext=10`) giving the same result.
  4. `no-off-token` refuses numeric opacity modifiers on colour utilities (`bg-surface/37`, `text-text/50`,
     `bg-scrim/7.5`); red and green cases.
  5. `tsconfig.guards.json` drops every exclusion that matches no file (the moved `PostHogGate.test.tsx`), and a
     guard fails on an exclusion that matches no file. The remaining exclusions: a legacy file's line goes with
     the task that deletes or rewrites it (6.3, 5.15); the frozen tests (`PreorderForm.test.tsx`,
     `src/features/preorder/lib/analytics.test.ts`, `src/lib/email/templates.test.ts`, `test/analytics-tags.test.ts`)
     stay excluded for good, since they stay byte-identical to the tag (ruling, 2026-10-12); each line's comment says which.
  6. Product schema `alternateName: "Lumi"` (architecture §6.1, §9.2): the `lumi` entry of
     `banned-phrases.data.ts` also allows that one line in `product.ts`; `product.test.ts` asserts it; one commit.
  7. The SEO builders refuse bad data as the others do: `productNode` with no image or an out-of-range price
     throws; `blogPostingNode` takes the author's `@id` only from known ids (else the Organization) and takes
     `inLanguage` as data (default `en-IN`); `pageMeta` refuses a typed rupee amount in a title or description.
- **Test:** `npm run verify` green; each new refusal proven red once.

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
     `SITE_ENV === "beta"`, the gates last in `<body>`, no old fonts, and `data-scroll-behavior="smooth"` on
     `<html>` (the motion.css hook for the mockup's smooth anchor scrolling, architecture §11.3; added after
     the 1.2 review, 2026-10-12). **`test/analytics-tags.test.ts` stays
     green without edits:** the literal `<head>` and `</head>` remain in the file, the Ahrefs `<script async
     src="https://analytics.ahrefs.com/analytics.js">` stays inside them (wrapped in the beta condition),
     and `<Analytics />`, `<GoogleAnalyticsGate />`, `<MetaPixel />`, `<PostHogGate />` stay literal.
  2. `SiteShell`: `SkipLink`, `NavBar`, `main`, `Footer`, `NavDrawer`, optional `StickyBuyBar`,
     `MotionController`, `DoodleDefs`, `WhatsAppFloat` (site text), Organization and WebSite JSON-LD once.
  3. Sticky bar: hidden until the hero CTA leaves (or shown from first paint where the page has none);
     steps aside while any inline chilli CTA is on screen; hidden from 900 px; safe-area padding; slides up
     once (pick 4); publishes its state as `data-buybar` on `<html>` and its height as `--ks-buybar-h`; sets
     `inert` on the bar while `.is-hidden` (the DS hidden state is only opacity and pointer-events, so its CTA
     would stay in the tab order; architecture §5.3).
  4. Drawer: native `<dialog>`, focus inside, Escape and backdrop close, `aria-expanded`, panel slides from
     the side (pick 5); nav chilli button from 1024 px only.
  5. `WhatsAppFloat` per [architecture §5.3](architecture.md#53-the-whatsapp-bubble-d050): a real link named
     "Chat with us on WhatsApp", the D050 URL and text for its context, new tab with `rel="noopener"`, DS
     `kh-iconbtn kh-iconbtn--l` look with `--ks-wa-green`, `data-ph-capture-attribute-cta="whatsapp-float"`
     (with `ph-no-capture` in the `/thanks` context); lifts with the bar, hidden under an open dialog, label
     on laptop hover and focus; every page's last content keeps clear of it; no colour transition is added
     to `.ks-wa` (its hover colour change is instant, architecture §5.3).
  6. Store layout: noindex, policy links to `MARKETING_ORIGIN`; its signature fixture regenerated in the
     same commit and the diff reviewed (presentation only, ADR-013).
- **Wave-2 close notes (2026-10-12):** client islands (drawer controller, sticky bar) never import `Icon`,
  `Button` or `PreorderButton`; the server shell renders those and passes them in as children or props; an
  island's own icons use `IconButton` or `Glyph` with the named `ICON_*` constants (2.11; `client-icons` guard).
  The Organization JSON-LD input is mapped from `src/content/en-IN/organization.ts` by a small tested function in
  `src/layouts/SiteShell/` (4.4 reuses it). The WhatsApp bubble may be a server-rendered link; its lift and
  hide follow `--ks-buybar-h` and the open dialog in CSS where possible.
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
  verbatim D032; `SellerBlock` and `GrievanceBlock` take a context (contact: links 800; legal: links 700,
  [mockup-css-mapping §6.2](mockup-css-mapping.md#62-same-names-different-blocks)). `OfferCard` takes its
  button as an `action` node (2.4): `OfferSection`'s test asserts `data-ph-capture-attribute-cta` `finale` (Home)
  and `product-offer` (product page) on the card's button for each placement (wave-2 close note).
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
  720 px; `ModesSection` keeps `id="modes"` and `id="story-mode"`; `FaqSection` keeps `id="faq"` and gives
  its disclaimer its own `ks-` name (the product page's `mk-disclaimer` differs from the article one);
  `HeroSection`'s contact lead-link weight is scoped to the `contact` variant ([mockup-css-mapping §6.2](mockup-css-mapping.md#62-same-names-different-blocks)).
  Wave-2 close notes: the /safety `FeatureSplit` renders `<AppScreens variant="safety" …>` and never restyles the
  device (the values live in `app-screens.css`, mapping rows 54-57); contact route cards use `Card` `links`;
  `FilmsStrip`'s controls are `IconButton`s with the `ICON_*` constants (2.11), and the island never imports
  `Icon` or `Button` (`client-icons` guard).
- **Test:** component tests; `films.spec.ts` on the story (keyboard, playback, axe with the video mounted
  and unmounted); `motion-hero.spec.ts` (pick 2: hero `getAnimations()` empty, opacity 1, no transform,
  hero doodles plain images); `motion-films.spec.ts` (pick 8): the focused tile scales to `--ks-film-focus` over
  `--duration-base`, the others stay at 1, the scaled tile stays inside the strip, no document sideways
  scroll at either end on the whole viewport matrix; no scale with reduced motion.

### 3.4 Support sections (builder)

- **Owns:** `src/components/sections/{AnswerSection,StepsSection,ProductDetails,TopicSection,FoundersSection,RecognitionStrip,EmptyStateSection,ArticleHead,ArticleBody,SourcesSection,RelatedGuides}/**`.
- **Inputs:** product fold 7, guide, setup, team, stories hub, the three article mockups, 404.
- **Acceptance** (as built; the tabs follow in 3.5 after N21 was corrected): SCA; `ProductDetails` renders the three panels **stacked as approved** (N21: no tab list,
  no JavaScript; each panel with its heading, `meet-kheelu.css:81` spacing), keeps `id="specs"`, and shows
  placeholders visibly; `RecognitionStrip` and gated bios render nothing while gated; `ArticleBody` covers
  every block type the three article mockups use, with `ks-type-*` steps instead of pixel sizes; answer
  blocks 40-60 words (guard).
- **Test:** component tests; stories.

### Wave 3 close: rulings and follow-up tasks (main session, 2026-10-12)

2.11 merged `91208de`; 2.12, 2.13, 3.2 and 3.4 merged `3629d2e`, `2a51371`, `2a7cc40`, `d7e0bea` (run
`wf_3a360d0e-7b7`, all passed); `npm run verify` green after the four (255 files, 4014 tests; jscpd 0.88%).
3.1 and 3.3 merged `0632ed1`, `28b4440` (run `wf_8e83e0d9-f82`, both passed after one fix round).
Rulings on the reviewers' open points:

- **Product details are tabs, as approved** (P1 default, N21 corrected): the approved page's own script
  (`mockup/pages/meet-kheelu.html:397-439`, in the Gate A commit `42a65b3`) turns the stacked panels into DS
  tabs. Task 3.5 builds `ui/Tabs` and puts `ProductDetails` on it; without JavaScript the panels stay stacked.
- **Product close, "Delivery included anywhere in India":** each placement follows its mockup. The content keeps
  one icon per trust item (`package`); the product close passes `map-pin` for that item, as `meet-kheelu.html`
  draws it (5.2's config; 3.6 makes 3.2's tests pass `map-pin` instead of rewriting the mockup).
- **Seller sentences and no-wrap spans on the legal pages:** one helper owned by 4.3 (see 4.3).
- **`alternateName: "Lumi"`** may appear in any file (claims §4 row 19 allows it as an alternate name); no
  path-scoped allowance (2.13 finding 6, option a).
- **One of each helper:** the content-icon narrowing (`asIconName`) lives in `ui/Icon`; the single-slash
  site-path test (`isSitePath`) in `src/lib/links.ts`; the mockup comparison harness in `test/support/` (3.6).
- 3.4's edit of the components §7 mapping row (`mk-details` of the product becomes `ks-product-details`) is accepted.
- **Store footer payments line** ("No payment fees. Nothing recurring. Payments by Razorpay." and the chargeback
  link, `store.html:219`): the store layout's policy links are a frozen checkout contract, so the line renders as
  the last line of the store page's `main` (5.15; [deviations](../qa/deviations.md) V1).
- **Store metadata:** the root layout no longer supplies a description, Open Graph or Twitter defaults, so each
  store page sets its own through `pageMeta` (no robots): 5.15, 5.16 and 6.1.
- **WhatsApp bubble:** the lift subtracts the bottom inset and the right offset adds the right inset (architecture
  §5.3); the laptop label reads "Chat with us on WhatsApp" (P13 default); the store pages pass `href`, `chat` and
  `context` (3.1's API).
- **`ModesSection`'s bare DS image** goes through a bare form of `Photo` (no figure), not `next/image` directly
  (architecture §10).
- **Films strip with motion on** is taller than the mockup by design ([deviations](../qa/deviations.md) V2).
- **Article registry:** `src/content/en-IN/stories/articles/index.ts` (4.2) is the one list of article modules;
  the stories route and `SiteShell/sticky-bar-paths.ts` read it, so a new article needs no shell edit.
- **3.5 merged `075144c`** (first review). Left for the main session after 3.6 merges: `STORY_SPECS` in
  `test/e2e/support/projects.ts` gains `tabs` (and `tabs.spec.ts` reads its project's `baseURL`, as
  `motion-doodle.spec.ts` does); `ui/Tabs/approved-tabs.test-support.ts` reads the mockup through 3.6's shared
  harness; `SiteShell` and `StoreShell` take the GSTIN line from 4.3's `seller-lines` helper.
- 6.3 (exclusion lines of rewritten legacy files, `utm.test.ts` type errors), 4.2 (`knownAuthorIds`) and 4.3
  (seller-lines helper) are amended above and below.

### 3.5 Product details tabs (builder; wave-3 close)

- **Owns:** `src/components/ui/Tabs/**` (new), `src/components/sections/ProductDetails/**` (except its
  content-icon import line, which 3.6 changes), `test/e2e/tabs.spec.ts` (new); the `Tabs` and `ProductDetails`
  catalogue rows.
- **Inputs:** `mockup/pages/meet-kheelu.html:277-330` (markup) and `:397-439` (the tab script),
  `mockup/css/meet-kheelu.css` (`mk-details`, the `.kh-tabs:not(.is-tabs)` stacking), the DS Tabs CSS.
- **Acceptance:**
  1. `Tabs` (server) renders the mockup's DS Tabs markup from generic props (`label`, `panels[{ id, tabId, label,
     heading, content }]`): `div.kh-tabs[data-tabs]`, the `kh-tabs__list` tablist (hidden in the HTML) with
     `button.kh-tab` ids, `aria-controls`, `aria-selected` and `tabindex` as the mockup, then each
     `kh-tabs__panel` with its `h3.kh-subtitle[data-tab-heading]` heading and content.
  2. A client island (`Tabs.client.tsx`; never imports `Icon`, `Button` or `PreorderButton`) does what the page
     script does: panels get `role="tabpanel"`, `aria-labelledby` and `tabindex="0"`, headings `kh-sr`, the list
     is shown, `is-tabs` added, the first tab selected; click, ArrowLeft and ArrowRight (wrapping), Home and End
     select and focus; only the selected tab is in the Tab order.
  3. Without JavaScript the three panels show stacked with their headings and the tab row does not show (the DS
     `.kh-tabs__list { display: flex }` beats `hidden`, so a scoped rule hides the list until `is-tabs`).
  4. `ProductDetails` renders through `Tabs`, keeps `id="specs"` and the ids `panel-specs`, `panel-box`,
     `panel-safety`, `tab-specs`, `tab-box`, `tab-safety`; all three panels' text is in the server HTML; with
     JavaScript the fold matches the mockup's tabbed fold at 360, 390 and 1440.
- **Test:** component tests; `tabs.spec.ts` on the story: keyboard path, ARIA states, axe with and without
  JavaScript, no layout shift inside the first screen; `client-icons` guard green.

### 3.6 Wave-3 code follow-ups (builder; wave-3 close)

- **Owns:** the files each item names, their tests and catalogue rows.
- **Acceptance:**
  1. One `asIconName` (content `IconRef` to `IconName`, throws on a name the DS lacks) in `src/components/ui/Icon/`
     (server only); `sections/CtaBlock/icon-name.ts` and `sections/ArticleBody/content-icon.tsx` deleted with their
     tests moved; `CtaBlock`, `ArticleBody`, `EmptyStateSection` and the import line of `ProductDetails` use it.
  2. One `isSitePath(href)` in `src/lib/links.ts` (single leading `/`, not `//` or `/\`), used by `Button`, `Logo`,
     `RichText`, the parser in `src/lib/content/rich-text.ts` and `src/lib/seo/urls.ts` (which gains the
     backslash refusal); tests for both forms.
  3. `MotionController`: an added target with no layout box (`getClientRects().length === 0`, for example inside a
     `hidden` streaming holder) is observed, not shown; a unit case moves it below the fold afterwards.
  4. `Alert`, `Select`, `Checkbox` and `Field/field-parts` draw their icons through `Glyph` (markup unchanged,
     proven by their tests); the stale "ui/Icon is task 2.2" comments go.
  5. One mockup comparison harness: `sections/CtaBlock/mockup-fold.test-support.ts` and
     `sections/ArticleBody/__fixtures__/approved-fold.ts` merge into `test/support/` (no duplicated logic; every
     section test imports it); recorded in artifacts.md.
  6. 3.2's selling sections: `SellingHelpLine` takes `offer` (from `CtaBlock` and `OfferSection`); the
     `CloseSection` links variant passes the offer to its three `RichText` calls; `SellerBlock` and
     `GrievanceBlock` copy is typed `RichTextString`; `GrievanceBlock`'s types and test say the complaint-reference
     note shows on all four legal pages and compare the refund and shipping cards; `SellerBlock`'s test compares
     refund's and shipping's paragraphs with a sentence carrying their `{nowrap:…}` tokens; the product-close tests
     pass `map-pin` (ruling above) instead of rewriting the mockup.
  7. `seller.ts`: the phone link and the help line's call link put `{nowrap:…}` around the whole link, so the
     link carries `ks-nowrap` as in all 42 mockup uses (`<a class="mk-nowrap">`); every consumer's test green.
  8. `TYPED_AMOUNT` exported from `src/lib/seo/price-lead.ts` and imported by `src/content/en-IN/amounts.test.ts`.
  9. `test/guards/build-steps.test.ts` header names its exclusion and `vercel-build` checks.
  10. `ArtBoard` exports `ArtBoardBase`; its doc says wrappers omit `hero` and `lcp` and pass them literally.
  11. A `webkit-storybook` Playwright project on `KH_WEBKIT=1` (`test/e2e/support/projects.ts`,
      `test/playwright-projects.test.ts`); `motion-faq.spec.ts` drops its own WebKit launch.
  12. components §7 records 3.2's class renames (`mk-beside` to `ks-beside`, the four page CTA classes to
      `ks-cta__button`, and the rest of 3.2's list).
  13. Shell copy into content: `navigation.ts` labels for the store logo link ("Kheelona home") and the new-tab
      note (" (opens in a new tab)"); `StoreShell` and `SiteShell` read them; `STORE_COPY_PENDING_CONTENT` and
      (after item 7) `hoistNowrap` go. (The shells' typed "GSTIN " lead moves to 4.3's `seller-lines` helper at the
      close: the main session switches the two shells once both have merged.)
  14. Item 5's harness also takes `src/layouts/SiteShell/mockup-diff.ts` and its test.
  15. `StoreShell.test.tsx`: a case under `KH_SITE_ENV=beta` (fresh module import) asserts the five policy links
      and the logo link start with `https://betawebsite.kheelona.com`.
  16. WhatsApp bubble insets (architecture §5.3): `whatsapp-float.css` right offset plus
      `env(safe-area-inset-right)`; the lift in `src/motion/motion.css` subtracts `env(safe-area-inset-bottom)`.
  17. `seller.chat.shortLabel` reads "Chat with us on WhatsApp" (P13 default); the WhatsAppFloat, SiteShell and
      `chrome.spec.ts` label cases follow the content.
  18. `Photo` gains a bare form (the image alone, Photo's loading and `sizes` rules, no figure or crop);
      `ModesSection`'s `ks-know__img` uses it; assets.md's `kheelu-belly-module.png` row names it.
  19. `films.ts`: `filmsStrip` gains `of: "of"`; `FilmsStrip.stories.tsx` imports `films` and `filmsStrip`
      instead of retyping them, so the films specs test the content.
  20. Comments that still say the track padding alone holds the films growth (`films-strip.css:5-7`,
      `motion.css:166-168`) describe the frame margin (architecture §11.2 row 8).
  21. `chrome.spec.ts`: the block that strips the payments line from the store-footer golden cites
      [deviations](../qa/deviations.md) V1.
  22. Now that `ks-hero` exists (3.3), `ArticleHead` and `EmptyStateSection` (404) stories match the heights of
      their mockup folds (`story-*.html`, `404.html`) at 390 and 1440 within 2 percent (3.4 review finding 5).
- **Test:** `npm run verify` and the touched e2e specs green.

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
  `test/scalability-article.test.tsx`, `src/content/en-IN/stories/articles/index.ts` (new: the one registry of
  article modules, wave-3 close) and the article import in `src/layouts/SiteShell/sticky-bar-paths.ts` (reads the
  registry instead of importing the 21 modules).
- **Inputs (wave-3 close):** `blogPostingNode` needs `knownAuthorIds = personIds(<3.1's Organization mapper in
  `src/layouts/SiteShell/`>(organization))` (2.13): founder bylines resolve to Person nodes, `TEAM_BYLINE` to the Organization.
- **Acceptance:** 21 slugs from `routes.ts`, `export const dynamicParams = false;`; BlogPosting with the
  module's stored `published` and `updated` dates and BreadcrumbList from the visible crumbs; the close
  variant per article; stubs render their placeholder on beta and block production.
- **Test:** template tests; `scalability-article.test.tsx` renders a fixture article from content alone;
  `test/not-found-ssr.test.ts` green.

### 4.3 LegalTemplate (builder)

- **Owns:** `src/layouts/LegalTemplate/**`, `test/fixtures/legal/**`, `src/lib/content/seller-lines.{ts,test.ts}` (new, wave-3 close), `test/e2e/legal-template.spec.ts` (new; wave-4 close).
- **Inputs:** `mockup/pages/{privacy,terms,refund,shipping}.html` and the four page CSS files (merged).
- **Acceptance:** one CSS file replaces the four mockup copies, as **two families behind a two-value
  variant** (privacy and terms; refund and shipping: contents column, measure, close card, draft-note icon,
  sticky contents; [mockup-css-mapping §6.1](mockup-css-mapping.md#61-the-legal-css-is-two-families-not-four-copies)),
  with `ks-tools`/`ks-tool` (privacy's measuring tools) and the `ks-step` counter of the refund steps ported
  (§6.3-6.4); the refund and shipping h2 keep weight 700 at 1024 px as approved (§6.5); summary, contents with anchors, parts and
  sections, draft note while `status: draft`, last-updated line, the seller and grievance blocks; type
  steps by `ks-type-*`; visual parity on all four legal mockups with fixture content. Help lines use `HelpLine`
  `size` and omit `lead` where the mockup has none (2.4's note).
  **Wave-3 close (3.2 review):** `seller.ts` holds the facts, not the composed sentences. One tested helper,
  `src/lib/content/seller-lines.ts`, builds from `seller` the GSTIN line, the legal seller sentence
  ("<entity>, registered at <address>. GSTIN <gstin>.") and the grievance officer line, each with a `nowrap`
  option: the refund and shipping family wraps `No 51`, `(Old Site No 1)`, `Bengaluru 560041` and `Co-Founder` in
  `{nowrap:…}` as their mockups do (`refund.html:167,175`, `shipping.html:148,152`); privacy and terms do not.
  `GrievanceBlock` (legal context) shows the complaint-reference `note` on all four legal pages. Contact and the
  later pages reuse the helper (never a hard-coded GSTIN, 4.4's guard).
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
  3. The Organization JSON-LD input comes from the mapper 3.1 wrote in `src/layouts/SiteShell/`; nothing restates it.
- **Test:** the four rewritten tests, each proven red once.

### Wave 4 close: rulings and follow-up task (main session, 2026-10-13)

Run `wf_431ed8e5-d4c` (3.6, 4.1-4.4): all five passed (4.4 after one fix round). Merged `--no-ff` in order 3.6
`4af95da`, 4.1 `056d48b` (fixtures given 3.5's required `tabsLabel`), 4.2 `fc0af71` and 4.3 `c093d2e` (imports
re-pointed at 3.6's `asIconName` in `ui/Icon` and `test/support/mockup-compare.ts`; the no-op no-wrap hoists dropped;
the GSTIN literal taken out of a `seller-lines.ts` comment for 4.4's guard), 4.4 `c0633cd`. Close commit `7867b93`:
both shells read the GSTIN line from `seller-lines`, `sitemap.ts` reads the article registry, `tabs.spec.ts` is a
story spec. Rulings:

- **FAQPage on Home** carries the six Home answers plus fold 4's "What is Kheelu?" and `/safety` adds fold 2's four
  facts, as the copy pages say (architecture §9.2 corrected); 5.1 and 5.3 set `faq: true` on those entries.
- **Page modules import types only** from `layouts` and `components` (structure §6); legal shapes move into
  `content/types.ts` (4.5).
- **Accepted as built:** 4.2's one-line edit of `articles.test.ts` (the folder test lists `index.ts`); 4.3's
  `test/e2e/legal-template.spec.ts` (added to its Owns); 4.3's family names `reference` (privacy, terms) and
  `notice` (refund, shipping); the two connecting words in `seller-lines.ts`; 4.4's stricter date pin.
- **Machine-file pins:** any change to a module that `llms.txt` or `pricing.md` reads (faqs, trust, seller, offer,
  product, navigation, topics, routes, organization, policies, cta), including a founder filling an F4 placeholder,
  bumps `LLMS_UPDATED` and/or `PRICING_UPDATED` and re-pins `DATED` in `test/machine-files.test.ts` in the same
  commit (main session; guard-ownership row).
- **5.5** reads the journal close from `articlePageCopy.close` (4.2's registry), never retyped.
- **Campaigns** (before the first real one, not now): `CampaignEntry` becomes the whole page shape and campaign paths
  get a buy-bar placement (4.5 item 1 does the type; the placement waits for a campaign).

- **`verify:e2e` at the close (2026-10-13 12:20): red only where wave 5 clears it.** 866 passed, 524 skipped, failures
  only on the new `/stories/*` routes (the first new-design marketing routes): (1) text and visual parity of the three
  approved articles, whose bodies are `ARTICLE_PORT_PENDING` until **5.6**; (2) `perf-budget` on all 21 article routes
  (script about 250 KB against 130 KB; route-specific 103.5 KB against 25 KB). Measured on the built site: the article
  page's own chunk is about 6 KB; about 34 KB is the legacy root `not-found.tsx` boundary's chunks, present in every
  route's manifest (cleared by **5.10**); about 61 KB is Next prefetching the legacy pages the nav and crumbs link to
  (home, product, safety, team, contact, setup, the hub: cleared as **5.1-5.9** replace them). Ruling: the specs stay
  as they are; a wave-5 builder reports its route's own chunk sizes and does not chase legacy chunks; the full
  `verify:e2e` is the wave-5 close gate. 5.10 runs in part A so the not-found chunks go early.

### 4.5 Wave-4 code follow-ups (builder; with wave 5 part A)

- **Owns:** the files each item names, their tests and catalogue rows.
- **Acceptance:**
  1. `CampaignEntry` (`src/content/en-IN/campaigns/index.ts`) is the whole page shape (`PageContent`), and the
     campaign route reads it through `getCampaign` instead of re-implementing the lookup.
  2. Legal shapes in `src/content/types.ts`: `LegalPage` and its parts (hero eyebrow, `groups`, part `contents`,
     paragraph `id`, recipient `keys`, the seller `lead`, the `card` block), re-exported from
     `layouts/LegalTemplate/legal-template.types.ts`; prose that changes with the offer typed `Copy` where the
     template renders it with the offer (terms' full-mode paragraphs, 5.12).
  3. `src/content/en-IN/legal/shared.ts` (new): the template's shared words (draft note, "Last updated:", "On this
     page", the complaint-reference placeholder) from `test/fixtures/legal/index.ts`; `LegalTemplateCopy` takes
     `help: HelpLineCopy` (`seller.help`) so the reference close renders lead and contact from the one seller value;
     the fixtures drop their retyped support line.
  4. `legal-template.css`: the promise-link rule scoped to the reference family (mapping rows 22-23), with a test.
  5. `PageTemplate`: the AboutPage description is read off the page's `answer-section` fold (no separate copy);
     the template test's FAQ fixture names a price, so "both modes" is proven by the template's own tests;
     `scalability.test.tsx`'s campaign test is named for what it asserts; a `/lp/<unknown>` 404 case (rendered
     `<main>`) joins `test/e2e/redirects.spec.ts`.
  6. `test/machine-files.test.ts`: gated objects are not visible copy; a placeholder in mid-sentence is refused (no
     mangled sentence); `pricing.md`'s "About Kheelu" carries the Manufacturer declaration (architecture §9.3
     "made in India by Kheelona Robotics"), entity facts list it, pins and `PRICING_UPDATED` bumped.
  7. `MotionController`: the same no-box test at arming as for added targets, with a unit case.
  8. One mockup reader: the ui tests with their own (`Checkbox`, `Field`, `Select`, `PolicyLinks`,
     `InAppBrowserNote`) and `ui/Tabs/approved-tabs.test-support.ts` use `test/support/mockup-compare.ts`.
  9. Stale words: `WhatsAppFloat.tsx` lift comment (less the bottom inset); `playwright.config.ts` header names the
     `webkit-storybook` project; "Chat on WhatsApp" in `test/e2e/support/{axe,fixtures}.ts` and
     `src/content/types.test-d.ts` follows P13; `CopyLinkButton.client.tsx`'s "ui/Button is task 2.2" comment; the
     components.md SiteShell row says `ARTICLE_CLOSES` reads the article registry.
- **Test:** `npm run verify` and the touched e2e specs green.

### 4.6 Shared fixes found by wave 5 part A (builder; risk high, D052)

Wave 5 part A (run `wf_2de8d3c9-589`) merged in full on 2026-10-13 (`ef959af`): 4.5, 5.5 and 5.6 passed; 5.1, 5.2,
5.3 and 5.10 ran out of review rounds only on causes in shared files outside their Owns. Rulings: 5.2's edits outside
its Owns are accepted (`us-center` allows a string that is only `center`, a layout value; the eslint exception for the
legacy `Sheet.stories.tsx` until 6.3; `tracking-parity.test.ts` follows the removed `valuePaise` default).

- **Owns:** the files each item names, their tests and catalogue rows.
- **Acceptance:**
  1. `test/e2e/support/page-checks.ts` `norm`: a space before punctuation or a source marker (`[1]`) is dropped on both
     sides of the comparison (inline tags no longer split `12.[1] We`); two fixture cases in
     `test/guards/jsonld-matches-page.test.ts`; `src/content/en-IN/products/kheelu/page.test.tsx` stops pinning the
     one mismatch (`expect(jsonLdMismatches(html)).toEqual([])`); `jsonld-matches-page` and `content-integrity` green
     for `/products/kheelu` and `/safety`.
  2. Image ratio drift: `AppScreens` device images and `Photo`'s bare form (`ModesSection`'s `ks-know__img`) take an
     explicit `aspect-ratio` from the static import's width and height, so next/image's rounded renditions no longer
     move the folds below (never on cropped Photos or art-board layers); visual parity of `/`, `/products/kheelu` and
     `/safety` green at 360, 390 and 1440.
  3. `scripts/assets/build-doodles.mjs` rounds path coordinates to 2 decimals; `src/assets/doodles.generated.tsx`
     regenerated; the generated-doodles guard re-pinned; Home's HTML document within its 60 KB budget.
  4. `CardGrid` guides card link: a tap extension to 44 px (scoped to the guides variant, as the trust links); the
     first-screen tap-target check green on Home at 360.
  5. `test/e2e/chrome.spec.ts` sticky-bar cases: scroll past `#hero-cta` before expecting `shown` (the legacy Home had
     no hero CTA); the cases green on the new Home.
- **Test:** targeted checks (D052) plus the touched specs on `/`, `/products/kheelu` and `/safety`.
- **Merged** `200bd17` (passed its one review). **Open after part B1, for the next shared-fix task:** the legal "Also
  read" links (`.ks-also a`, `legal-template.css`) have the 44 px height but not the width, so a short label ("Terms")
  fails the tap-target check on `/privacy` and `/terms`: give them the invisible `::before` extension used on the trust
  and guides links. (Taken into 4.7, item 1.)

### 4.7 and 4.8 Shared fixes found by wave 5 part B (builders; risk high, D052; with wave 5 part C)

Wave 5 part B2 (run `wf_97020885-57b`) merged in full on 2026-10-14 (`eb47f13`, reconciliation `5c5f20d`): 5.13, 5.14
and 5.16 passed; 5.12 and 5.15 ended `fixed-unreviewed` and their last fixes (tests only) were checked at the merge.
The batch's merge gate is green (`npm run verify`: 5349 tests). Rulings at the merge: the amounts guard skips a
placeholder's note (terms placeholder 3, "delivery ₹0"); `jscpd:new` ignores the legacy playos page until 6.3;
PreorderForm's policy links on `MARKETING_ORIGIN` accepted (architecture §15.3); the full-mode "Until we dispatch your
Kheelu, all of it is refundable." recorded in store.md fold 3; /thanks keeps the one static title "Your Kheelu is
reserved · Kheelona" (the approved mockup's; noindex; per-state metadata would be a logic change under ADR-013).

Split in two so they run in parallel: **4.7** shared content, legal pages and chrome; **4.8** the store and `/thanks`
(checkout presentation, ADR-013). Both add rows to `test/e2e/support/deviations.ts`; the main session joins them at the merge.

#### 4.7 Shared content, legal pages and chrome

- **Owns:** the files each item names, their tests, stories and catalogue rows.
- **Acceptance:**
  1. Legal "Also read" links (`.ks-also a`, `legal-template.css`): the invisible `::before` tap extension of the
     trust and guides links, so a short label reaches 44 px wide; `first-screen.spec.ts` tap targets green on
     `/privacy`, `/terms`, `/refund` and `/shipping` at 360.
  2. A `launch` price key: `PriceKey` in `src/content/types.ts`, `offerPrices` in `src/lib/offer/offer.ts`
     (`LAUNCH_AMOUNT_PAISE` in both modes) and the rich-text price-key check. The reservation sentences that mean the
     launch total take `{price:launch}`: `refund.ts:129` (its full-mode stopgap goes: the approved sentence reads
     true in both modes), `shipping.ts:73` and `:116`, and any terms line that names a reservation's total in full mode
     (check `terms.ts:58`). The parity fixtures `test/fixtures/legal/{refund,shipping}.ts` follow. Tests render
     each line in both modes ("the remaining ₹4,500 of the ₹4,999 price" in full mode too).
  3. The WhatsApp bubble never covers a store form field on a phone (D050): below 900 px it steps aside while a field
     in `#details` has focus or `#details` crosses the bubble's band, as it already does for `html[data-buybar]`
     (`WhatsAppFloat`, `motion.css`); `chrome.spec.ts`'s never-covers case (`:431`) green unchanged on the store at
     every phone size.
  4. P15 default ([open questions](../open-questions.md)): the shared FAQ `returns-and-warranty` answer
     (`src/content/en-IN/faqs.ts:105`) reads "Arrived faulty? Tell us within 7 days for a replacement or a full
     refund." (60 words; `answer-length` green); `TEXT_DEVIATIONS` entries on each page that shows the answer, citing
     V6 (the main session adds the row at the merge); `jsonld-matches-page` green.
- **Test:** targeted checks (D052) plus the touched specs on `/privacy`, `/terms`, `/refund`, `/shipping`, the pages
  that show the FAQ, and `chrome.spec.ts` on the store at the phone sizes.

#### 4.8 Store and `/thanks` (checkout presentation)

- **Owns:** the files each item names, their tests, stories and catalogue rows; the PreorderForm, OrderSummary,
  AddressForm and `/thanks` signature fixtures and literal-only patches (reviewed; content reads and presentation
  imports only); the JSX contract fixtures are never edited.
- **Acceptance:**
  1. Store parity rows ([deviations](../qa/deviations.md) V1 and V4): `test/e2e/support/deviations.ts` gains a
     per-slug selector-hide rule for the visual pass (`.mk-inapp` in the mockup, `.ks-store-payments` in the build)
     and `TEXT_DEVIATIONS` entries for the note's lines (missing) and the payments line (moved), each citing its row;
     the store's visual and text parity green at 360, 390 and 1440.
  2. `/thanks` renders the payments line as the last line of its `main`, as the store page does (V1 extended):
     5.15's line moves out of `StoreDetails` into one shared piece that both pages use (no copy); the store page's
     output is unchanged.
  3. `/thanks` paid-state parity (V5): a paid-state composition of the five folds inside the store chrome (a story
     with fixture order data; no real order, no change to the page's logic) compared with `store-confirmation.html`
     at 360, 390 and 1440, as `legal-template.spec.ts` compares the template's story; the route specs keep the
     link-needed state.
  4. Client-safe words: `preorderFormCopy`, `orderSummaryCopy` and AddressForm's words move into words-only modules
     (type imports, plus `offer.ts` and `navigation.ts` where a price or link is needed), so the seller and
     organisation data leave the client chunks; signature fixtures regenerated and reviewed (content reads only);
     report the store's and `/thanks`'s script sizes before and after (the shared layer's own overrun is measured at M1).
- **Test:** targeted checks (D052) plus the store's and `/thanks`'s specs on the store host at 360, 390 and 1440;
  `checkout-jsx-contract`, `checkout-signature`, `checkout-freeze` green; `npm run qa:payment` reaches the open
  sandbox sheet (never a real order).

### 4.9 and 5.20 Follow-ups found by wave 5 part C (after M1; with wave 6)

Wave 5 part C (run `wf_242bc117-a1c`) merged in full on 2026-10-14 (`cf07677` to `b8af96b`, then the reconciliation
commit): 4.7 and 4.8 passed (risk high); 5.17, 5.18 and 5.19 ended `fixed-unreviewed` and their last fixes (an
`assets.md` row; a read time and an `assets.md` row; two content-integrity wordings with a unit test) were checked at
the merge. The CMO approved all 18 article copy pages (5.19 in its second review). Rulings at the merge:

- **Article dates:** every rewritten article's `updated` is the rewrite's date (2026-10-13), as 5.6 set it for the
  three approved guides (BlogPosting `dateModified` and the sitemap); `published` stays the live page's.
- **`stub.ts` deleted** (no open body remains, and `articles.test.ts`'s folder test asks for that), with
  `ArticleTemplate.test.tsx`'s stub block; 6.3's stub item is done.
- **Guards:** `banned-phrases.test.ts` names the 15 site copy pages and one `story-<slug>.md` per article slug instead
  of a count; `sticky-bar-paths.test.ts` pins the seven keep-close guides (B5); `PLAIN_CLOSE_ART` adds the
  hard-questions, should-kids and data-law guides (DS 02-imagery: no doodle on safety), and the template's doodle test,
  which passed vacuously (with two pages mounted, jsdom resolves `#close` to the first), now mounts one page at a time
  and was proven red.
- **`/thanks` parity:** the route's own visual and text parity runs skip on the build with a printed reason
  (`PARITY_ELSEWHERE`, [deviations V5](../qa/deviations.md)); `thanks-paid.spec.ts` proves the paid state.
- **P15 (V6):** `llms.txt` re-pinned to 2026-10-13; deviation V6 added.
- **D025 reading:** as written. The disclaimer is required on guides specifically about speech delay; 5.18 puts it on
  all six talking guides (allowed); the AI and brain guides need none.
- **Accepted from 4.7:** the bubble steps aside off the right edge (fields and the cover check can reach below the
  bottom edge, never past the right one) and is `inert` while aside. **From 4.8:** `src/app/store/page.tsx` (one import
  line) and its signature fixture are 4.8's (item 2 moved `StorePaymentsLine`); `visual-parity.spec.ts`'s two
  `hideDeviations` lines are 4.8's item 1. Script sizes (4.8 item 4, gzip, route chunks): store 17.50 → 15.54 KB,
  `/thanks` 11.73 → 10.04 KB; total script 174.4 KB and 168.9 KB against the 150 KB store budget (shared layer, M1).

#### 4.9 Shared fixes from part C and M1 (builder; risk high: chrome, shared template, headers, test harness)

1. **D050 gap on marketing pages** (found by 4.7): at 324 x 566 the resting bubble covers the hero price sentence on
   Home and `/products/kheelu`, and mid-page sweeps find it over `p.ks-price` while the bar has stepped aside and over
   `.kh-offer__prices` while lifted (360 to 412 too). D050: it never covers the price. Extend the step aside to the
   site context for the price sentences (re-measuring the band while the bar lifts it), or another fix that keeps the
   price clear; `chrome.spec.ts` gains a whole-page sweep at the seven phone sizes on Home and the product page, as
   4.7's store sweep. Report the script cost on marketing pages.
2. **`/thanks` address step:** the paid state renders `AddressForm`, and the bubble there keeps the plain link. Give
   the address step's section an id and add `thanks` to `STEP_ASIDE_FROM`, only if no frozen JSX contract fixture
   changes (ADR-013); otherwise report. Prove it on the `ThanksPaid` story.
3. **BlogPosting `citation`:** the copy pages say each article's source list is its BlogPosting `citation`;
   `articleGraph` emits none. Emit it from `article.sources` (jsonld-matches-page stays green).
4. **The 404's own JavaScript** (M1): 35.0 KB of route-specific script against the 25 KB budget, the only route over it
   (the others 14.4-22.6 KB); find what the not-found route loads beyond its layout and bring it under 25 KB.
5. **A console error on every page** (M1 Lighthouse, Best Practices 96): the report-only CSP carries
   `upgrade-insecure-requests` (`src/lib/security-headers.ts:179`, unchanged since the tag), which browsers ignore in a
   report-only policy and log as an error. Drop it from the report-only policy (HSTS already upgrades); the CSP tests
   follow. With the tags loading (lp-tags), the report-only CSP also refuses GA4's beacon to `www.google.com/g/collect`
   and a `dv-*.ecs.us-east-1.on.aws/events` beacon (Best Practices 70 against the B10 allowance of about 74): admit the
   GA4 host, identify which tag sends the AWS beacon before admitting it, and record both in the tracking inventory
   (no ID or event name changes).
6. **Test harness:** `test/e2e/support/routes.ts` `sweepRoutes` takes `buybar` from `ARTICLE_CLOSES`, so the specs
   prove the bar absent on the seven keep-close guides; `hideDeviations` takes a label so `thanks-paid.spec.ts` prints
   its own name. (The one copy-page reader for the three article tests moves to 6.3: 5.20 edits those tests.)

#### 5.20 Article copy fixes before Gate B (verifier, copywriter, CMO, builder; risk normal)

1. **Sources first: done 2026-10-14** ([source verification, 2026-10-14](../research/source-verification-2026-10-14.md),
   D026): Tisseron's 3-6-13-18 markers and the "De 3 à 6 ans" minutes (C34); the CDC "sentences with four or more
   words" item, a 4-year milestone only (C42); the CDC 30-month items match Zubler 2022 Table 4. Ready lines are on
   that page. The 3-6-9-12 article follows the founder's answer to P25 (the markers say no connected toys before 6).
2. **Copy:** the CMO reviews' minor fixes, each copy page first: 5.17 M1-M17 (M1 first: the 3-6-9-12 page names
   Tisseron's AI markers; the CMO would not show that page at Gate B without it), 5.18 M1, M3, M5, M7, M8, M9, M12,
   M13, and 5.19's remaining minors (`wiki/qa/cmo-review-articles-<task>-2026-10-14.md`). Fewer repeated head photos
   (advik-04, ira-04 and tara-04 each head four or five guides; tara-01 is unused) and one alt per photo. The
   founder's answers to [open questions §P](../open-questions.md) P17-P24 fold in here.
3. **Build:** each module follows its copy page word for word in the same commit (the article tests hold them
   together); assets.md rows follow the photos.

Run as three tasks with the copy stage in fix mode (`build-wave` `copy.mode: "fix"`): **5.20a** the six screen-time
guides (5.17's), **5.20b** the six talking guides (5.18's), **5.20c** the six AI, safety and learning guides (5.19's);
each has its own fix-pass CMO review page. Head photos come from separate pools so the three never clash: only five
DS scene photos have no Kheelu (the `-04` set, `03-cast.md:93`), and the talking and brain guides need them, so the
screen-time guides (5.20a: advik-01, advik-03, ira-02, kabir-03, myra-02, tara-01) and the AI guides (5.20c: ira-01,
ira-03, kabir-01, myra-03) move to unused photos with Kheelu where their page allows it (a grown-up in frame at 3),
and 5.20b spreads the `-04` set so no photo heads more than two talking guides.

## Wave 5: pages (after wave 4; all parallel)

**Run in three parts** (machine load: each task builds and runs Playwright on its own ports): **A** 4.5, 5.1, 5.2, 5.3,
5.5, 5.6, 5.10; **B** (after 4.5 merges: legal shapes) 5.4, 5.7, 5.8, 5.9, 5.11-5.14; **C** 5.15-5.19.
As run: B1 (4.6, 5.4, 5.7-5.9, 5.11), B2 (5.12-5.16), **C** (4.7, 4.8, 5.17-5.19). Part C's article tasks run a copy stage
first in the same worktree (`build-wave` `copy`): two copywriters write the six copy pages
(`wiki/site/pages/story-<slug>.md`, the approved articles' format), the CMO reviewer approves them
(`wiki/qa/cmo-review-articles-<task>-2026-10-14.md`; up to two reviews, brief Phase 5 step 1), then the builder commits the
pages and builds the modules from them. The founder signs off the copy on beta at Gate B (D015).

**QA from part B on ([D052](../decisions/D052-qa-checkpoints.md)):** a page task proves its SPA items for its own
route at the three approved widths with targeted checks; the full unit suite runs once per batch merge and the full
browser suite at milestone **M1** (end of wave 5). Review risk: `high` for 5.15 and 5.16 (checkout, under ADR-013)
and any task that touches shared guards, shared content or templates; `normal` for the other pages and the articles;
`mechanical` for renames, comments and moved files. Where a row or SPA item says "`npm run verify` green", read it as
the targeted checks for the task and the full suite at the merge gate.

Every page task: SPA (above); owns its content module(s) and route file(s); reads shared content
read-only (corrections to `faqs.ts`, `trust.ts`, `offer.ts`, `routes.ts` or `seller.ts` go to the main
session). Store tasks also own the checkout tests and signature fixtures named in their row; every
change to a checkout test is a literal-only patch in `test/guards/fixtures/authorised-diffs/`, reviewed by
QA; every signature fixture change is reviewed (only content reads and presentation imports may appear);
the JSX contract fixtures are never edited.

| Id | Page (owner) | Owns | Inputs | Page-specific acceptance (besides SPA) |
|---|---|---|---|---|
| 5.1 | Home `/` (builder) | `src/content/en-IN/pages/home.ts`, `src/app/(site)/page.tsx` | `mockup/pages/home.html`, [home copy](../site/pages/home.md), D045, D046 | Hero exactly D045 with the Hand accent; the hero art board's doodle still (pick 2), the imagination-frame and close doodles draw (pick 3); CTAs `hero` (arrow), `see-it-ask`, `safety`, `finale`, learn links; `ViewContentTracker` mounted (B9); sticky bar after the hero CTA; FAQPage = the six visible answers plus fold 4's "What is Kheelu?" (`faq: true` on that entry; wave-4 close, home copy fold 8); LCP image `fetchPriority="high"` |
| 5.2 | Product `/products/kheelu` (builder) | `src/content/en-IN/products/kheelu/page.ts`, `src/app/(site)/products/[slug]/page.tsx`, `src/app/(site)/products/kheelu/` (delete the old route and its colocated tests); the `LAUNCH_AMOUNT_PAISE` default of `valuePaise` in `src/components/tracking/ViewContentTracker.tsx` (removed once the legacy page is gone, so every mount passes the offer's value; wave-2 close) | `mockup/pages/meet-kheelu.html`, [meet-kheelu copy](../site/pages/meet-kheelu.md) | Product + Offer JSON-LD; fragments `#faq`, `#story-mode`, `#reserve`, `#offer`, `#specs`; sticky bar from first paint; `ViewContent` value 4999 in token mode; speech disclaimer (D025); declarations incl. MRP from `MRP_PRICE`; details as tabs (3.5; N21 corrected, P1): pass `ProductDetailsConfig.tabsLabel` ("Product details", the mockup's tablist name) from content, and add the JavaScript-off text deviation for this route to `test/e2e/support/deviations.ts` (and its allowance in `no-js.spec.ts`, whose N21 comment it corrects), citing [deviations](../qa/deviations.md) V3, approved by the main session (wave-3 close); `export const dynamicParams = false;` |
| 5.3 | Safety `/safety` (builder) | `pages/safety.ts`, `src/app/(site)/safety/page.tsx` | `mockup/pages/safety.html`, [safety copy](../site/pages/safety.md) | D020 order; certification "applied for, not yet granted", no ISI mark; FAQPage with fold 2's four facts (`faq: true` on the trust facts entry; wave-4 close) |
| 5.4 | Buyer's guide (builder) | `pages/ai-toys-for-kids-in-india.ts`, its route | mockup and copy of the same name; `css/ai-toys-for-kids-in-india.css` (the `mk-gd-*` rows of components §7) | No competitor names; answer-first hero; FAQPage; sources |
| 5.5 | Stories hub (builder) | `src/content/en-IN/stories/hub.ts`, `src/app/(site)/stories/page.tsx` | `mockup/pages/stories.html`, [stories copy](../site/pages/stories.md); the journal close and read times from `articlePageCopy` in the article registry (4.2), never retyped | All 21 guides under the four topics with anchors `#screen-time`, `#talking`, `#ai-and-safety`, `#learning`; cards read title and summary from the article modules; no "Rewritten in the build" labels |
| 5.6 | Three rewritten articles (builder) | `src/content/en-IN/stories/articles/{learning-toys-for-a-three-year-old,what-to-look-for-in-a-safe-ai-toy,talking-toys-and-late-talkers}.ts` | the three article mockups and copy pages | One in-text product link each (none pitching on the late-talker page, B5); D025 disclaimer on the late-talker page; sources with markers; the merged 2-year-old topic as an H2 on the 3-year-old article (D041) |
| 5.7 | Team (builder + copywriter) | `pages/team.ts`, its route | `mockup/pages/team.html`, [team copy](../site/pages/team.md), [CMO review](../qa/cmo-review-pages-help-2026-10-11.md) | CMO fix: first screen says what Kheelu is, the age band and the search term; bios and recognition gated (D038); founder photos only if supplied (B24) |
| 5.8 | Setup (builder + copywriter) | `pages/setup.ts`, its route | `mockup/pages/setup.html`, [setup copy](../site/pages/setup.md), CMO review | CMO fix: step 2 values; the screenshot without "Games" (1.5b); D018 wording; no chilli button |
| 5.9 | Contact (builder) | `pages/contact.ts`, its route | `mockup/pages/contact.html`, [contact copy](../site/pages/contact.md) | `#grievance` anchor; seller lines identical to the footer |
| 5.10 | 404 (builder) | `pages/not-found.ts`, `src/app/not-found.tsx` | `mockup/pages/404.html`, [404 copy](../site/pages/404.md) | HTTP 404, noindex, rendered on the server with chrome and the bubble |
| 5.11 | Privacy (builder) | `src/content/en-IN/legal/privacy.ts`, `src/app/(site)/privacy/page.tsx`, **`test/analytics-tags.test.ts`** | `mockup/pages/privacy.html`, [privacy copy](../site/pages/privacy.md), [inventory row 27](../site/tracking-inventory.md#parity-checklist-phase-6-qa) | Tools named one per block (never a count); `ORDER_DATA_LOCATION` placeholder until D047's move is confirmed; D035 training disclosure; `status: draft` until approved. **analytics-tags re-pinned in the same commit (B2c):** reads the rendered privacy text (or the content module's plain text); keeps the layout and payload assertions; re-pins each wording assertion to the approved sentence (below); keeps every anti-count assertion |
| 5.12 | Terms (builder) | `legal/terms.ts`, its route | mockup and copy | D035 and D041 AI-image disclosure; full-mode variants; draft until approved |
| 5.13 | Refund (builder) | `legal/refund.ts`, its route | mockup and copy; [legal review](../qa/legal-review-pages-legal-b-2026-10-11.md) | D042 lines; `refund-learn` close; draft until approved |
| 5.14 | Shipping (builder) | `legal/shipping.ts`, its route | mockup and copy; legal review | `shipping-learn` close; draft until approved |
| 5.15 | Store page restyle (builder) | `src/app/store/page.tsx`, `src/features/preorder/components/{PreorderForm,OrderSummary}.{tsx,test.tsx,stories.tsx}`, their three signature fixtures, the literal-only patches for the two tests, `src/components/sections/store/{StoreTop,StoreDetails}/**`, `src/content/en-IN/store/{store-page,in-app-note}.ts` | `mockup/pages/store.html`, [store copy](../site/pages/store.md), [checkout](../site/checkout.md), ADR-013 | JSX contract and signature guards green; pay button labels unchanged; refund promise beside it; films below every money answer; no `<video>` at rest; no import of a path 6.3 deletes (`atoms/Field`, `lib/cn`, `lib/interactions`, `molecules/PromiseMark`, `organisms/VideoMoments`, `lib/video-moments`, `lib/kheelu-art`); the bubble (store text); in-app note built with `enabled: false` (N7); `npm run qa:payment` reaches the open sandbox sheet; store noindex; wave-3 close: the payments line "No payment fees. Nothing recurring. Payments by Razorpay." with the chargeback link as the last line of `main` ([deviations](../qa/deviations.md) V1), description, Open Graph and Twitter through `pageMeta` (no robots), `WhatsAppFloat` with `href`, `chat` and `context` |
| 5.16 | Confirmation `/thanks` restyle (builder) | `src/app/store/thanks/page.{tsx,test.tsx}`, `src/features/preorder/components/AddressForm.{tsx,test.tsx,stories.tsx}`, their signature fixtures and literal-only patches, `src/components/sections/store/{ConfirmationHead,OrderRows,AddressStep,HelpBlock}/**`, `src/content/en-IN/store/confirmation.ts` | `mockup/pages/store-confirmation.html`, its copy | JSX contract and signature guards green; `ph-no-capture ph-mask` on the order container in the paid and created branches; the bubble with `ph-no-capture` (`/thanks` text); **delivery line (N9, F12):** `OrderRows` shows "Ships from 20 October 2026" (`SHIP_DATE_TEXT`, as today) for orders created before 2026-10-10 00:00 IST and the D023 line for later ones, chosen in `OrderRows/delivery-line.ts` (outside the frozen file), both cases tested, until F12 is answered; "Save my address" primary button (white on Blue question, architecture §13); no import of a path 6.3 deletes; wave-3 close: description, Open Graph and Twitter through `pageMeta` (no robots), `WhatsAppFloat` with `href`, `chat` and `context` |
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
  open here shortly."; the bubble (store text) with `href`, `chat` and `context`; description, Open Graph and
  Twitter through `pageMeta` (no robots; wave-3 close); no import of a path 6.3 deletes; axe and no-sideways green
  on the matrix; since 5.15, `OrderSummary` no longer prints `tierLabel` (store.md fold 4), so the event and partner
  pages show their price name ("Bangalore expo price", "Ideabaaz exclusive price") in their own heading (5.15 review).
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

- **Merged** `3e3aee1` (run `wf_146abbc8-31a`, fixed-unreviewed; main-session ruling `77841dd`: the delivery rule
  moved to `src/lib/offer/delivery-line.ts`, the receipt's "Order number" label, the patch regenerated). Left after the
  merge: the receipt footer's number as a `tel:` link (a new reviewed diff of the frozen template; after launch).

- **Gate:** the founder's answer on deliveries for orders placed before 10 October (F12). **Open since 2026-10-14**
  ([D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 1): keep the split as built (before
  10 October: "Ships from 20 October 2026"; later: the D023 line).
- **Owns:** label strings in `src/lib/email/templates.ts` only (facts and branching untouched),
  `src/lib/email/templates.test.ts` (literal-only), `src/components/sections/store/OrderRows/delivery-line.ts`,
  `test/guards/fixtures/authorised-diffs/{src__lib__email__templates.ts,src__lib__email__templates.test.ts}.patch`.
- **Acceptance:** "Due on dispatch" → "Due before delivery"; "Ships from" → the delivery line per F12; the
  `/thanks` rule in `delivery-line.ts` follows the same answer; "(messages, not calls)" removed per D032;
  email tests green; the patches reviewed.
- **Test:** `templates.test.ts`; freeze guard with the reviewed patches.

### 6.5 Remove the 3-6-9-12 article ([D053](../decisions/D053-remove-the-3-6-9-12-article.md)) (builder; risk normal; after the batch `wf_cd8260cf-e88` merges)

- **Merged** `c0bb934` (run `wf_146abbc8-31a`, passed). Deviation V9 filed. The forced related-guide swaps
  (busy-hands ↔ data-law, gentle-way → safe-AI-toy) are cross-topic; the CMO may ask for same-topic links later, which
  would change other guides' related lists.

- **Why:** the founder's answer to P25 (2026-10-14): Tisseron's AI markers advise no connected toys before 6, so the
  journal no longer explains his rule.
- **Owns:** `src/content/en-IN/routes.ts` (`ARTICLE_SLUGS`, 21 → 20) and `routes.test.ts`; `src/content/en-IN/stories/articles/`
  `screen-time-rules-parents-swear-by.ts` (delete), `index.ts` and its test, `articles.test.ts` (the counts), the
  related lists of `busy-hands-no-screens.ts`, `the-gentle-way-off-the-phone.ts` and `ai-toys-and-indias-data-law.ts`
  with their copy pages' related folds and their article tests; `src/content/en-IN/stories/hub.ts` and its test (the
  card leaves the screen-time topic); `src/config/redirects.ts` and its test (one hop, permanent, to
  `/stories#screen-time`); `test/e2e/support/routes.ts`; `wiki/site/pages/story-screen-time-rules-parents-swear-by.md`
  (delete) and the `story-*` rows that name it; `wiki/site/url-map.md`, `wiki/research/keyword-map.md` (the URL's row
  marked removed, D053); `wiki/engineering/assets.md` (advik-04's use).
- **Also (5.20a follow-up):** the screen-free toys guide's H1 puts its colon at the start of a line (the DS
  `.kh-hand` is inline-block): the accent takes the colon, `{hand:does not mean silent:}`, with the copy page's H1
  accent note (copywriter and CMO; `screen-free-does-not-mean-silent.ts` and its copy page join the Owns). The
  5.20a photo-pool test's map loses the 3-6-9-12 entry, and its `pooled` assertion stops filtering on `rules.slug`.
- **Acceptance:** 20 article routes, each with three related guides and at least three incoming links (articles.test);
  the old URL answers 308 to `/stories#screen-time` in one hop (redirects.spec); the hub shows the topic without the
  card (hub parity: a text and visual deviation row for the main session, V9); no page, sitemap entry, JSON-LD item or
  `llms.txt` line names the article (the main session re-pins `llms.txt` if it changes); the banned-phrases guard
  expects one copy page per remaining slug.
- **Test:** targeted checks (D052); the hub and the three changed articles at 360, 390 and 1440; `redirects.spec`,
  `links.spec` and `content-integrity` on the hub and the three articles.

### 6.6 The founder's answers of 2026-10-14 ([D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md)): team, `/ideabaaz`, the CSP (copywriter, CMO, builder; risk high; after the batch `wf_cd8260cf-e88` merges)

- **Merged** `b8d43dc` (run `wf_146abbc8-31a`, fixed-unreviewed; main-session rulings `ceb9ef7`, the /ideabaaz patch,
  and `0460724`: founder photos `alt=""` by the DS Avatar rule, the NVIDIA alt "NVIDIA Inception Program", Kashyap's
  line in the live bio's shape). Deviation V7 updated. The Karnataka seal's permission is on the Gate B list (7.3).

- **Why:** D054 items 7, 9 and 20.
- **Items:** (1) `/team`: the recognition strip as live (NVIDIA Inception, Karnataka Elevate and nasscom marks from
  `public/recognition/`, Founders Inc as text; heading "Recognised by."), the three background lines written by the
  copywriter from the live bios (facts only; claims §4 wording stays out; CMO review), and the three live photos
  (`apoorva.jpg`, `aman.jpg`, `kashyap.jpg` from the tag `archive/pre-reset-2026-10-10`, through the image pipeline)
  with the copy page's alts; the F11 gate and the B24 placeholder go; parity deviation V7 shrinks to what is still
  intentional (the main session rules it at the merge). (2) `store.kheelona.com/ideabaaz` answers the store's
  not-found page (404), no redirect: the partner route and its partner-only parts go through a reviewed authorised
  diff citing D054 (the route is checkout-frozen; the JSX contract fixtures are never edited: if one would change,
  report it); `url-map.md` row updated. (3) The report-only CSP: drop `upgrade-insecure-requests`, add
  `https://www.google.com` and the Meta gateway hosts of tracking-inventory §14a to the directives the M1 reports
  name, through a reviewed authorised diff citing D054; Report-Only stays.
- **Acceptance:** each item's unit tests; `/team` and the store's `/ideabaaz` at 360, 390 and 1440; checkout-freeze,
  checkout-jsx-contract and checkout-signature green with the reviewed patches; no tracking ID or event name changes;
  a Lighthouse lp-tags run on one page no longer reports the CSP console errors.

### 6.7 Page facts for the legal, setup and product pages ([D055](../decisions/D055-page-facts-legal-setup-product-2026-10-14.md), D054 items 12 and 19) (copywriter, CMO, builder; risk high; after the batch `wf_cd8260cf-e88` merges)

- **Merged** `fa957d0` (run `wf_146abbc8-31a`, fixed-unreviewed; the last fix, F4 slots hidden only inside a
  `withoutHiddenRows` call, read at the merge). Deviations V11-V16 filed; V8 shrunk to the colour. The production
  prebuild now lists 4 open items, the four legal drafts (D029 sign-off, Gate B).

- **Why:** the production build refuses every `{ph:…}` slot; the founder answered them (D055) or ruled them off the
  page (D054 item 19 for F4).
- **Items:** (1) Each D055 item in the copy pages `wiki/site/pages/{privacy,refund,shipping,terms,setup}.md` (and
  the product page's app line), then in the modules (`src/content/en-IN/legal/*.ts`, `policies.ts` where a constant
  moves, `pages/setup.ts`, `products/kheelu/*.ts`), word for word; every line the founder ruled off comes off, with
  no new claim. (2) The recipients table's regions for Razorpay, Resend, Google, Meta and Ahrefs, each from the
  provider's own published documents (URL and date in the copy page's notes; where none is published, what the
  provider does publish). (3) F4 (D054 item 19): a fact row, a safety line or a setup line whose value is still an F4
  placeholder renders nothing on every environment, and the production build no longer refuses it; the box contents
  stay; a unit test proves both. (4) P14 (D054 item 12): "What blocking can’t stop." in the copy page and
  `privacy.ts`. (5) "Last updated: 14 October 2026" on the four legal pages. (6) The parent-app links from the live
  site (tag `archive/pre-reset-2026-10-10`).
- **Acceptance:** `npm run build` with `SITE_ENV=production` lists no placeholder on these pages (the F4 rows hidden);
  each page's unit tests, with the text differences from the Gate A mockups returned as a list for the main session
  (deviation rows at the merge); `/privacy`, `/refund`, `/shipping`, `/terms`, `/setup` and `/products/kheelu` at 360,
  390 and 1440; the CMO checks every changed sentence against D055 (no claim beyond it); analytics-tags and
  content-integrity green.

**Wave 6 ownership check:** 6.1, 6.2 and 6.4 own disjoint files (6.2's `PreorderForm.tsx` is not in 6.1;
6.4's `delivery-line.ts` was 5.16's in the previous wave). A gated task whose gate has not opened simply
waits; it may run in any later wave before wave 8, alone with its own files.

## Wave 7: clean-up and dependency retirement (after wave 6)

### 6.3 Clean-up and dependency retirement (builder)

- **Merged** `4a05b92` (runs `wf_1dbdd8e9-45e`, whose builder lost its API connection after 21 commits, and
  `wf_b9732366-0d9`, resumed at "finish"; passed its review). Main-session rulings at the merge (2026-10-14):
  `public/product/lumi.png` deleted and 1.3's two redirect guards re-sampled (synthetic paths and every public file);
  accepted outside the written Owns: `test/guards/visual-layer.test.ts` reads the deleted `globals.css` at the freeze
  tag, the banned-phrases title, the content-integrity comments and dead skip, and the `NotFoundPanel` and store page
  signatures (their new `action` and `note` props choose what the panel shows; no checkout logic, the frozen
  `NotFoundPanel.test.tsx` and the contract fixtures unchanged); the store e2e checks run on 6.1's database stand-in
  (fake keys, a local stub) rather than with Supabase blank. The main session removed the two allowances 6.3 left
  stale (banned-phrases' `KHEELONA_PLUS_LINE` pending item; motion-properties' `globals.css` exemption; both proven
  red) and the stale comments in `AGENTS.md`, `postcss.config.mjs`, `.storybook/preview.tsx` and
  `tools/qa/supabase-stub.mjs`. Left for later tasks: `npm run qa:payment` against the Razorpay sandbox (7.1); the six
  dev-only high advisories (brace-expansion and braces under `eslint-config-next`; a package decision, never shipped;
  [dependencies](dependencies.md)); `README.md` and `docs/store-go-live.md` still describe the legacy site and its
  deleted QA tools (7.3); `Technical-Todo.md` stays until its open items reach open questions ([cleanup](../legacy/cleanup.md)).

- **Owns:** deletion of everything [structure §1](structure.md#1-the-tree) lists under "Removed during the
  build" (including `src/app/(site)/playos/`, `src/lib/cn.ts`, `src/lib/interactions.ts`, the legacy
  `src/lib/seo.ts` with its test, `src/styles/globals.css`), `package.json`, `package-lock.json`
  (retirements by name), `docs/standards/` (delete), the retired guard tests (`preorder-cta`,
  `action-label`, `kicker-language`, `kheelu-art`, `contrast-tokens`, `a11y-v4`, `config-copy` with the
  legacy copy constants it guards once nothing imports them), `test/stories-parse.test.ts`,
  `test/utm.test.ts`, `test/dependency-floor.test.ts`, `test/guards/legacy-paths.ts`,
  `tools/qa/{sweep,shot,text,axe-run}.mjs` (delete) and their npm scripts; (`src/content/en-IN/stories/articles/stub.ts`
  went at the wave 5 part C merge); one copy-page reader in `test/support/` for the three article tests
  (`screen-time-articles`, `talking-articles`, `ai-safety-and-learning`), which each carry their own (5.19 review);
  the old `src/components/molecules/*Gate*` entries of the set-state-in-effect override in `eslint.config.mjs`; the
  `tsconfig.guards.json` exclusion lines of the legacy files it deletes or rewrites (wave-3 close: 2.13's
  shrink-only guard in `test/guards/build-steps.test.ts` compares a rewritten `test/utm.test.ts` with the tag byte for byte).
- **Inputs:** [cleanup](../legacy/cleanup.md), [cleanup-public-assets](../legacy/cleanup-public-assets.md),
  [dependencies](dependencies.md), the guard-test ownership table.
- **Acceptance:** no file imports a deleted path (`tsc`, build); `LEGACY_PATHS` empty and every guard green
  over all of `src/` (no "pending" route left); `stories-parse` floor > 40 with
  `src/components/ui/Button/Button.stories.tsx` as its anchor; `utm.test` imports `CANONICAL_ORIGIN`, type-checks (today's
  10 type errors there fixed) and its `tsconfig.guards.json` line is removed (`build-steps.test.ts` `rewrittenLegacy`);
  retired packages removed one by one with the lockfile diff read; `dependency-floor` drops only the
  `fflate` floor, and only if `npm ls fflate` is empty after `three` leaves (evidence in the report);
  `npm audit` clean of high or critical runtime advisories; `jscpd` under threshold **with the legacy
  route-file entries removed from `package.json` `jscpd.ignore`** (`src/app/(site)/page.tsx`, `contact`, `safety`,
  `setup`, `playos/**`, `src/app/store/e/**`, `src/app/store/ideabaaz/page.tsx`; added by 1.1 because the legacy
  tree is 2.06% duplicated) **and `src/app/(site)/playos/**` removed from the `jscpd:new` script's `--ignore`**
  (added at the wave 5 part B2 merge: once 5.2 deleted the old product route, jscpd paired the legacy playos page
  with the legacy `LegalDoc.tsx` and reported it as a new clone); the `KHEELONA_PLUS_LINE` constant in `src/config/site.ts` ("lessons", claims §4 row
  10) deleted with the legacy `KheelonaPlusBand`, so banned-phrases prints it as resolved; asset-dupes green;
  every remaining file in `public/` referenced or marked FOUNDER in assets.md; the deleted list logged for
  the main session.
- **Follow-ups from the wave 6 batch** (`wf_cd8260cf-e88`, merged 2026-10-14): `track.ts` imports a client-only map
  of the new events instead of the whole `EVENTS` registry (about 2.3 KB gzip on three store chunks), with a
  tracking-registry assertion that the map equals `EVENTS` filtered to status "new" (6.2 note 2);
  `tools/qa/payment-probe.mjs` prints the analytics events through a gtag spy (6.2 note 1); `test/e2e/axe.spec.ts`'s
  skipped "store tier pages" case runs on store-secondary.spec's stand-in environment (6.1); the store page's own
  not-configured state reuses `NotFoundPanel` like the event pages (6.1); copy-page notes only: the early-years and
  should-kids pages' stale photo notes (5.20c CMO F1, F2), the bilingual page's tara-04 notes (5.20b CMO F2), and the
  talking-late guide added to source verification §7's CDC re-read list with source-verification-2026-10-14 linked
  from C42 (5.20b question 4).
- **Follow-ups from batch 6b** (`wf_146abbc8-31a`, merged 2026-10-14): `test/guards/legacy-paths.ts` still lists the store
  path `/ideabaaz`, and `test/e2e/axe.spec.ts`'s skipped store-tier block names it (6.6); the F11 "proof-gated"
  comments in `src/content/en-IN/organization.ts`, `src/layouts/SiteShell/site-graph.ts` and
  `src/lib/seo/schema/organization.ts` (6.6); the Storybook fixture `TopicSection.stories.tsx` `SCREEN_TIME_TOPIC` still
  shows the 3-6-9-12 card, `src/lib/stories-expansion.ts` and `public/stories/screen-time-rules-parents-swear-by.jpg`
  are legacy, `Technical-Todo.md` names the guide, the banned-phrases test title says 21 copy pages and
  `content-integrity.spec.ts` comments say 18 template articles (6.5); stale grievance-note comments in
  `src/components/sections/GrievanceBlock/legal-document.tsx` and `grievance-block.types.ts` (6.7).
- **Test:** `npm run verify` and `npm run verify:e2e` green.

## Wave 8: full verification on a local production build (after wave 7)

### 7.1 Full verification (QA; builders fix)

- **Owns:** QA's pages in `wiki/qa/`; fixes go back to the owning task's files.
- **Also (from 6.3, 2026-10-14):** run `npm run qa:payment` once against the Razorpay sandbox (the founder's test keys in
  `.env.local` and the Supabase stub): it must show `preorder_payment_window_opened` through the probe's new gtag spy
  (task 6.2 acceptance; 6.3 proved the spy on a local stand-in only).
- **Acceptance:** the [test plan](../qa/test-plan.md) §4, §5, §7-§9 on L and LP: `npm run verify` and
  `verify:e2e` green on every route and the viewport matrix; Lighthouse mobile median of 3 on the test
  plan's ten pages ≥ 90 in all four categories with the authoritative run per category (N18: Performance
  and Best Practices from the LP-tags profile, a local production build under the real hostnames with the
  tags loading and their beacons blocked; SEO from LP-tags; Accessibility from any; pre-approved
  exceptions aside); tracking probe rows of the inventory checklist that can run locally; CLS with fonts
  delayed (N17); DS checksums; the production dry run (`KH_SITE_ENV=production npm run build`) fails while
  placeholders or drafts remain and its list goes to the founder; CMO built-page pass on every page,
  including the reviews that did not run before approval.

### Wave 8 round 1: results and fixes (2026-10-14)

Round 1 of 7.1 ran on `a5124aa`: `verify:e2e` 1486 passed, 0 failed (the 21 stand-in store tests run separately: 283
passed); the QA agent's checks ([results](../qa/results-2026-10-14.md), [defects](../qa/defects.md)): no S1 or S2, three
S3 in the QA tools, two S4 ruled; three CMO built-page reviews ([A](../qa/cmo-review-built-a-2026-10-14.md),
[B](../qa/cmo-review-built-b-2026-10-14.md), [C](../qa/cmo-review-built-c-2026-10-14.md)): A and C 2 blocking each,
B none. The founder answered the reviews' questions ([D056](../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md)).
Rulings by the main session: QA-003 fixed at once (the Lighthouse block list); QA-004, the plan's wording follows the
original site (test plan §5.2 row 18); QA-005, the footer's "Grievance officer" links to `/contact#grievance` (7.1a);
CMO A M9 (laptop safety-card line length) and the test ideas (A M11, B T1, B T2) wait until after Gate B; CMO C m6
(the store dead end's words) stays as built (D054 item 7); CMO C m7 (a chargeback how-to line) goes on the Gate B list
(a new legal line). The fixes, built in parallel (each task's reviews per D052):

- **7.1a Chrome and interaction (builder; high).** A B1: the trust line's and help line's invisible 12 px tap
  extensions overlap (`src/components/ui/HelpLine/help-line.css`, `src/components/ui/TrustLine/trust-line.css`): 24 px
  (`--space-5`) between a trust line and a help line below it, no extension on wrapped or inline links (the help line
  at 360, `/setup`'s "Stuck?" paragraph); a tap-area test on the first phone screens; the frozen mockup has the same
  defect, so return a deviation row. C B1: the WhatsApp bubble never covers a price on the store or `/e/<tier>`
  (`WhatsAppFloat.tsx` store selector, plus `.ks-agree` and an open store FAQ in `test/e2e/chrome.spec.ts`
  `NEVER_COVERED`, with a 360/390/412 scroll sweep proven red against today's selector). B m5: under reduced motion
  the bubble waits for the buy bar to fade before it drops (`src/motion/motion.css`). A M1: smooth scrolling only
  after the first load, so a hash landing does not glide (`motion.css`, `src/app/layout.tsx`). A M2: Home's "See all
  questions" lands at the FAQ heading after a client navigation. A M10: the `/team` quote's "AS" badge under the
  founder photos (`team.ts`). C m8: the trust row's links land on their anchors (`src/content/en-IN/trust.ts`; each
  anchor must exist). QA-005. Owns those files and their tests, and the deviation rows for them.
- **7.1b Copy fixes (copywriter fix mode, CMO, builder; high).** Copy pages first: `meet-kheelu.md` (the films
  heading "Real families, in their own homes.", D056 item 2; the sources line in Home's short form, A M6), `safety.md`
  (A M4: the open FAQ's "follow below"), `stories.md` (B m1/A M5: the screen-time topic line), `home.md` (the FAQ's
  refund timing "reaches you within 7 working days", D056 item 4; the age-3 advice in one wording, A M8), `terms.md`
  (section 8's refund timing, D056 item 4), `setup.md` (the age-3 line, A M8). Then the modules (`products/kheelu/page.ts`,
  `FilmsStrip.stories.tsx`, `pages/safety.ts`, `stories/topics.ts`, `faqs.ts`, `legal/terms.ts`, `policies.ts`'s comment,
  `pages/setup.ts`), B m2 (the hub's empty sixth cell at 900 px and up, `TopicSection/topic-section.css`), and the
  parity rules for every changed approved line (deviation rows returned; V9 amended under the `stories` key).
- **7.1c Store fixes (copywriter fix mode, CMO, builder; high).** Copy pages `store.md` and `store-confirmation.md`
  first: C m1 (the refused event link's words, per reason, presentation-side over the frozen `tiers.ts` text), C m4
  (the `/thanks` "cannot open" state: the WhatsApp button and the call number), C m5 (the `/thanks` tab title on the
  no-order states). Then: C m2 (the age band on `/e/<tier>`), C m3 (`/e/<tier>` without keys renders the store's
  not-configured state, without the payments line), and the in-app browser note switched on (D056 item 3; deviation
  V4 retired). Checkout logic frozen (ADR-013): presentation files with their signatures, never a contract fixture.
- **7.1d The related-guide ring (copywriter fix mode, CMO, builder; normal).** CMO B m3's ring (the table in review B):
  14 slot changes across 10 articles, every article three related guides out and three in, the three mockup guides'
  lists unchanged, no head photo shared across a link (5.20a); copy pages' related folds first, then the modules.
- **7.1e QA tools (builder; normal).** QA-001: `test/e2e/support/lp.ts` lets redirect-followed requests and page-close
  beacons skip the probe's routing: route at the DNS level to a local proxy that forwards nothing off the machine.
  QA-002: `tracking-probe.spec.ts` can never see PostHog (posthog-js drops `navigator.webdriver` browsers): after QA-001,
  the probe runs as a non-webdriver Chromium. Nothing may reach production at any step.
- **7.1f Share images for the guides (builder; normal).** B m4: each of the 20 guides gets a 1200 × 630 share image cut
  from its head photo by the asset pipeline (task 1.5 item 3), set as the module's `meta.og` and the BlogPosting image;
  `og.png` stays the default elsewhere. Touches only the `meta` of each article module (7.1d edits the related lists).

**Wave 8 fix batch merged (2026-10-14; run `wf_4eb5e856-7af`, base `fdb7580`).** 7.1a, 7.1c, 7.1d, 7.1e and 7.1f passed
their reviews; 7.1b's last review fix (the age-3 line on `/safety` and `/setup` in the CMO's own words, copy review
minor 1) was checked by the main session against the CMO's text at the merge. Merge rulings by the main session:

- **Edits outside the written Owns, accepted** (each needed for an acceptance item; none weakens a guard): 7.1a's
  `StickyBuyBar.client.tsx` (B m5: the motion guard refuses a delayed transform under reduced motion, so `data-buybar`
  waits for the fade instead of a rule in `motion.css`), `MotionController.client.tsx` (M1: the attribute now arrives a
  frame after load), `Tabs.client.tsx` (M2's root cause), `Quote` and `FeatureSplit` (M10), the help-line spacing in
  `cta-block.css`, `offer-section.css` and `close-section.css`, `test/support/mockup-compare.ts` (`ruledLinkHref`, one
  central rule for the deep links) and the ripple test edits; 7.1b's route tests, the sample-page swaps in
  `test/e2e-harness.test.ts` and `store/parity-deviations.test.ts` (no page is without a rule since 7.1a's
  `TAP_AREA_HIDDEN`, so the sample is a page with no rule of its own: the buyer's guide's visual list stays empty);
  7.1c's `store/page.tsx` (its not-configured state moved to `_components/StoreNotConfigured.tsx`, markup unchanged,
  signature reviewed) and one test title in `StoreDetails.test.tsx`; 7.1f's two literals in `ArticleTemplate.test.tsx`,
  `talking-articles.test.tsx:313` (the exact card now pinned for all 20 guides in `share-cards.test.ts`) and the
  extended `generated-icons.test.ts` (1.5's guard).
- **Rulings:** the share cards are cut from the 2K masters (the 9:16 web files are 837 px wide; DS Photo library
  README: masters for crops); the head photo's alt stays the card's alt (one alt per photo); the store's step-aside
  covers the whole `.ks-faq` (meets D050; a narrower region is a later polish); the link-needed `/thanks` state keeps no
  `ph-no-capture`, as on the tag (QA-004 ruling stands; the cannot-open state carries it since 7.1c for its new help
  links); the `/thanks` bubble at rest at 360 px checked on the merged build (below).
- **Done by the main session at the merge** (copy review 7.1b minors 2 and 5; the reviews' follow-ups): the age-3
  sentence "If your child is 3, keep a grown-up nearby." on the product page's FAQ 3 and the buyer's guide's age answer
  (`faqs.ts`; copy pages `meet-kheelu.md`, `ai-toys-for-kids-in-india.md`; deviations V17 amended, V22), so every FAQ
  answer review A M8 named says it one way; Home's copy-page sources line in its short form; `llms.txt` and `pricing.md`
  re-pinned (`PRICING_UPDATED` 2026-10-14; the visible-copy line for the screen-time lead); deviation rows V17-V25
  written, V4 retired, V7 and V9 amended (`approvedBy` strings now cite V23 and V25); source markers' tap area cut to
  4 px above and below (`source-marker.css`; 7.1a's tap-area spec found neighbouring markers taking each other's taps,
  and now fails on it); `Tabs.client.tsx` compensates no target inside the tab box (review of 7.1a); stale Storybook
  literals (the screen-time line, the old age and "follow below" words) updated, and `TopicSection.test.tsx` applies
  the hub's copy fix; the shared-head-photo guard covers all 20 guides (review of 7.1d); `lp.ts` decodes a form's `data`
  only when it is PostHog's, and the probe waits for page-close beacons before it reads the log (review of 7.1e);
  `motion.css`, architecture §5.3, §11.3, §14 and §16.3, test plan §1.1, §4.6, §5.1, §5.2 row 18 and §6.4, `env.ts`,
  defects QA-001 to QA-005, store.md's 409 gap and event eyebrow, store-confirmation.md's tap-area sentence, assets.md
  §5, the index.
- **Follow-ups, not blocking:** `articles.test.ts`'s `SWAPS` and `LEGACY_RING` describe the stub era and check nothing
  (drop or relabel them); `photoFile()` exists in four test files (one shared helper with an artifacts.md row); each
  article module types its head photo's alt twice (`head.image.alt` and `meta.og.alt`; hoist one const); Meta's
  Conversions API gateway POSTs (`*.on.aws/events`, `*.run.app/events`) are refused by the probe, not recorded as Meta
  evidence; the 4:5 cards drop part of what their alt describes (advik-01's train, myra-04's crayon; a lower `focusY`
  would keep them); `tap-areas.spec.ts` and `anchors.spec.ts` are not wired into the WebKit projects.

## Wave 8b: the live site's changes (D057, D058; after wave 8, before beta QA and Gate B)

The live `main` gained PRs #18-#22 on 12-13 Oct ([reconciliation map](../qa/live-main-reconciliation-2026-10-14.md)):
the parent app on `/privacy` and `/terms`, claims withdrawn after a code check, and the journal written in the admin
dashboard. The founder ruled: follow the code check ([D058](../decisions/D058-follow-the-live-code-check-2026-10-14.md)),
and the journal comes from the dashboard ([D057](../decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md)
item 1).

### 8b.1 Claims and the parent app on the site's pages (copywriter fix mode, CMO, builder; risk high)

- **Copy pages first**, in four groups: `privacy.md` and `terms.md` (D058 items 1, 3-6, 9, plus #18's app sections:
  the reconciliation map §1 rows P3-P10 and T2-T7, in the rebuild's voice); `home.md` and `meet-kheelu.md`; `safety.md`
  and `setup.md`; `ai-toys-for-kids-in-india.md`, `team.md`, `stories.md`, `404.md`, `contact.md`, `store.md`. Every
  line D058 withdraws goes or takes the code-checked wording (map §2's table); what the live team added as true comes
  in where the page already speaks of it; Kheelona+ reads "Every Kheelu comes with 6 months of Kheelona+, our paid
  subscription, on top of the free parent app." with no feature list; Bluetooth mode and the languages stay; the
  grievance officer stays Aman Soni, aman@kheelona.com; 36 months then deleted stays.
- **Then the modules:** `policies.ts` (`RETENTION_LINE` without one-tap), `faqs.ts`, `products/kheelu/product.ts` and
  `page.ts`, `offer.ts`, `pages/home.ts`, `safety.ts`, `setup.ts`, `team.ts`, `ai-toys-for-kids-in-india.ts`, the stories
  hub and 404 modules, `legal/privacy.ts` and `legal/terms.ts`, `navigation.ts` (the footer's "No web browsing."), the
  store content; parity rules for every changed approved line (deviation rows returned); `llms.txt` and `pricing.md`
  hashes reported (the main session re-pins).
- **Not here:** the 20 guides (8b.2 moves them to the dashboard with the same corrections).
- **Done 2026-10-14** (run `wf_c359ee74-7a4`; merged `24ea2e4`): copy pages CMO-approved
  ([review](../qa/cmo-review-claims-8b.1-2026-10-14.md)), modules and parity rules
  [V26-V36](../qa/deviations.md); `llms.txt` and `pricing.md` re-pinned in the merge. Partly applied: D058 item 1's
  talk-time limit and WiFi-off-at-rest (no copy yet, [G28](../open-questions.md)). At the 8b.2a merge: V35's three
  entries come out of `deviations.ts` (8b.2a's own rule replaces them). Questions G26-G31.

### 8b.1b Follow-ups to 8b.1 and 8b.2a (builder; risk medium; after 8b.2a, before 8b.2e; then the founder's G26-G32)

- **Main-session rulings (2026-10-14):** `/safety` fold 4's screenshot alt drops "and to delete all chats", as Home's
  does ("…Chats are kept for 36 months, with a button to download your child’s data."); the D058 withdrawn claims
  become `claim` entries in
  `test/guards/banned-phrases.data.ts` (one tap, servers in India, closed or curated content library, age-graded,
  safety layer, quiet hours, topics are open, new-word count, four thinking skills, weekly report, about a minute of
  quiet, attack our own safety layer, keep none of it), with a field that exempts an entry on a mockup whose route
  carries a `CLAIM_FIXES` rule (the frozen mockups still print them; the guard's rule 3 is proven red without the
  field; the 20 guide modules green, the parents' advice lines allowed: "reach the open internet", "a closed set of
  material" until it goes, the AI-tutor checklist); 8b.2b's validator reads the same list; the guides' advice
  questions stop setting a bar D058 withdrew (safe-AI-toy fold 4 and should-kids fold 7: "…and how you delete it",
  the buyer's guide's check 4 wording; should-kids fold 7's first question loses "or only a closed set of material");
  Storybook stories and type fixtures take the D058 wording
  (TrustSection, TrustList, FeatureSplit, OfferCard, PriceSentence, ArticleBody stories; `PageTemplate/__fixtures__`;
  `content/types.test-d.ts`).
- **Then, as the founder answers:** G26 (the screenshot crop and the alts), G27 (`/setup` fold 6), G28 (the two
  live-team facts, copywriter first), G29 (the pre-launch test and "says when it doesn't know"), G30 (Kheelona+ never
  charges by itself), G31 (Aman's answers on `/privacy`), G32 (the providers' place in the four guides), each a
  `CLAIM_FIXES` edit (or, in a guide, its module before the export) with its deviation row amended.
- **Checkpoint (D052):** a CMO built-page review of the blocks hidden whole at 360, 390 and 1440: meet-kheelu fold 5's
  words column, `/safety` fold 4's controls list, both `/privacy` §7 lists and `/terms` `#account`.
- **Merged 2026-10-14** (`9908c4c`, run `wf_55e2af9d-ae9`, after the usage-limit pause; review passed in round 1):
  the `/safety` alt (deviation V28 amended), 11 D058 `claim` entries each citing a claims.md §4 row, exempt only through
  `findBannedOnMockup` on the 9 claim-fixed mockups (the copy pages, `src/`, the journal validator's rule 15 and the
  built pages get no exemption), the guides' advice questions (V37 amended), the stories' D058 wording. **Rulings at
  the merge:** `test/e2e/content-integrity.spec.ts` (its mockup calibration reads through `findBannedOnMockup`),
  `FaqList.stories.tsx` and `ModesSection.stories.tsx` accepted outside the written Owns; FeatureSplit's `skills`
  variant keeps its unit test and has no story until the weekly report ships (D058 item 8; an exception to SCA 3,
  as its only data is the withdrawn report). The review's minor findings go to 8b.1d.

### 8b.1d The D058 guard, narrowed; the claims register; the stories held to the mockups through their fixes (builder; risk medium; wave iii, beside 8b.2e)

- **Main-session rulings (2026-10-14, from 8b.1b's review):** (1) three entries also refuse parents' advice and would
  stop a dashboard post at the journal validator's rule 15: `new-word-count` ("Keep a notebook and track your child’s
  new words each week."), `minute-of-quiet` ("Sit together for a minute of quiet before bed.") and `topic-controls`
  ("Let your child choose which topics to talk about at bedtime."): tie each to the product (Kheelu, the app, the
  parent app, "it" as the toy) or keep the noun form, with each line in `NEAR_MISSES`; the buyer's-guide questions that
  set a withdrawn bar ("Ask whether its servers are in India") stay refused (8b.1b item 3). (2) Widen the entries to
  the plain rewordings the review found ("Your data stays in India.", "Data is stored on Indian soil.", "It goes quiet
  after 60 seconds.", "We try to break our own safety filters before every release.", "The providers retain
  nothing."), each in `VARIANTS`; D020's approved "They don’t keep it" stays green. (3) claims.md: each §1 and §2 row
  that still lists a withdrawn claim as confirmed gains "Withdrawn 2026-10-14 (D058): see §4 `<entry id>`". (4) The
  story data that still prints a withdrawn claim (ProductDetails.stories.tsx `PRODUCT_DETAILS`, FoundersSection
  .stories.tsx Aman's line, ArticleBody.stories.tsx `SAFE_AI_TOY_BODY`): each test that holds it to the frozen mockup
  applies the page's `CLAIM_FIXES` / `ARTICLE_CLAIM_FIXES` edits to the mockup fold first (as approved-articles.test.tsx
  does), and the story data takes the site's current words.
- **Owns:** `test/guards/banned-phrases.data.ts` and its test; `wiki/product/claims.md`; ProductDetails,
  FoundersSection and ArticleBody stories and tests. Not 8b.2e's files.

### 8b.2 The journal from the admin dashboard (architect, then builder; risk high)

- **Design first** (architect): how the rebuild reads the dashboard's published posts at build (main's
  `tools/blog/sync.mjs`, `validate.mjs`, `src/lib/stories.data.json`, the deploy hook) and renders them with its own
  article template; the post fields against the rebuild's `Article` model (head image, glance rows, sources and
  markers, FAQ, related ring, bylines, dates, share card); covers through `next/image` (`remotePatterns`); `VideoEmbed`
  and the `frame-src` change as a reviewed checkout-freeze patch; which guards run on the snapshot; the backend's
  publish-time voice law (no contractions, em dashes or exclamation marks) against the rebuild's copy; and how the 20
  rewritten guides, corrected per D058, reach the dashboard (an export an admin publishes).
- **Then the build**, per the design. **Designed 2026-10-14:** [ADR-014](adr/ADR-014-journal-from-the-dashboard.md) and
  [journal pipeline](journal-pipeline.md) (tasks 8b.2a-8b.2g in its §12; the backend changes for Aman in §13). The
  founder's answers: [D059](../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md) (the dashboard's voice
  check follows the DS; a DS photo first, uploads as fallback; the dashboard takes over after Gate B). Wave i (8b.2a,
  8b.2b, 8b.2c) runs with 8b.1; then 8b.2d; then 8b.2e.
- **Wave i merged 2026-10-14** (run `wf_fed52266-980`): 8b.2a `d4f411d` (the four guides; its last fix checked by the
  main session; deviation row V37, V35 retired; CMO [review](../qa/cmo-review-guides-d058-8b.2a-2026-10-14.md)), 8b.2b
  `1a9fc6d` (sync, validator, steps 15 and 20, `remotePatterns`), 8b.2c `d623cf0` (`ui/VideoEmbed`, the `frame-src`
  patch). Rulings and hand-offs: [journal pipeline](journal-pipeline.md) §9.2 (the providers' promise stays) and §12
  (8b.2d's play word and figure spacing; 8b.2e's dates and snapshot commit). Question G32.
- **Wave iii merged 2026-10-14** (run `wf_e07be4c1-904`): 8b.2e `3b1e070` (the snapshot is the journal; the 20
  modules deleted; review passed in round 1) and 8b.1d `792108b` (the claim guard ties each feature to the product;
  parents' advice passes; claims.md's withdrawn rows; the stories in the site's words; its last fix checked by the main
  session on 25 probe lines; `test/e2e/tabs.spec.ts` accepted outside the Owns). Rulings: [journal pipeline](journal-pipeline.md)
  §12 (8b.2e: the ruled list widened by four inert differences; article parity once a writer edits; 8b.2g's
  prerequisites). Follow-up: `withRouteFixes` (tabs.spec.ts) restates `withFacts` (test/support/mockup-facts.ts).
- **Wave ii merged 2026-10-14** (run `wf_55e2af9d-ae9`, resumed after the usage limit): 8b.2d `eab6e46` (the adapter,
  the photo table, the ring, the round trip over the 20 modules; review passed in round 2 after one blocking fix: a
  pasted full address to a product page or the store now refused on a talking guide). Rulings and hand-offs:
  [journal pipeline](journal-pipeline.md) §4, §5.1, §12 (8b.2d, 8b.2e) and §13 B2 (the answer card's detail; the
  listed set; the og type to 8b.2e). Next: 8b.2e with 8b.1d (wave iii).

### 8b.3 Merge `origin/main` into the rebuild (main session; after 8b.1 and 8b.2)

`main` cannot be force-pushed, so its commits are merged into the rebuild before Gate B: the rebuild's files win, the
legacy files it deleted stay deleted, `tools/blog/*` and the journal come in through 8b.2's design, and the rebuild's
CLAUDE.md stays (the journal paragraph lives in the wiki). Guards proven; then the beta push and wave 9.

- **Merged 2026-10-14** (`dae33e6`, `git merge -s ours origin/main` at `8c4718a`): every file of journal pipeline §11's
  table and the reconciliation map §4 resolves to the rebuild's, so the merge keeps the rebuild's tree (`git diff
  HEAD^1` empty). One clean change of main's also stays out: `src/config/site.ts` `GRIEVANCE_EMAIL` (connect@), since
  the grievance officer is aman@kheelona.com (D058 item 4, `seller.ts`). `origin/main` is now an ancestor, so the Gate B
  merge needs no force-push; if `main` gains commits before Gate B, merge them the same way after reading each.

## Wave 8c: the advisor's proposal, what we take (D061; after 8b, before Gate B)

The founder shared a marketing advisor's homepage proposal; six reviews, the CMO's decisions and two challengers chose
what to take ([the review](../research/advisor-homepage-proposal-review.md); the CMO's table with the copy:
[cmo-review-advisor-proposal-2026-10-15](../qa/cmo-review-advisor-proposal-2026-10-15.md)); the founder answered four
questions ([D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md)). Every change below departs from the
frozen Gate A mockup (D046), so each task adds its `test/e2e/support/deviations.ts` rules and drafts its deviation rows
in its notes (the main session writes wiki/qa/deviations.md; the founder signs at Gate B, D015). The Meta ads keep
landing on Home (D061 item 2): Home's first phone screen comes first. Budgets: HTML ≤ 60 KB gzip per page
(`perf-budget.spec.ts`; beta today Home 56.0 KB, product 52.2 KB), Lighthouse mobile ≥ 90. The four tasks run in
parallel worktrees; each owns its files so the merges stay mechanical.

### 8c.1 Kheelu on the first phone screen, Home and the product page (builder; risk high)

- **What (D061 item 1):** on phones only, a picture of Kheelu (the plush, recognisable) comes into the first screen of
  Home and of `/products/kheelu`, with the approved headline (D045), the CTA and the price sentence (D028). Laptops and
  tablets from 720 px stay exactly as built. Today at 390 × 844 only the top edge of Home's art board shows (sun at
  793 px, Kheelu at 916-1123 px) and at 360 × 590 it starts at 797 px; on the product page the Kheelu sticker spans
  793-1006 px at 390 × 844 and starts at 845 px at 360 × 590 (buyer's-advocate probes, 2026-10-15).
- **Inputs:** D045 (the fit: at 360 × 590 the h1 ends at 256 px, the CTA at 432 px, the price sentence at 508 px),
  D049 pick 2 (no hero motion: the hero, H1, price sentence and CTA never move), D050 (the WhatsApp bubble), DS
  `06-surfaces.md` and the hero pattern in `design-system/project/10-pages.md` (a real photo or a cast sticker on a
  brand-colour block, the CTA, a line of trust; `StickyBuyBar` appears after the hero scrolls away), components.md
  `HeroSection`, `ArtBoard`, `Photo`, `Sticker`; the CMO's screenshots in `wiki/raw/qa/2026-10-15/cmo/`
  (local only).
- **Owns:** `src/components/sections/HeroSection/**` (component, CSS, types, test, story); the hero blocks of
  `src/content/en-IN/pages/home.ts` and `src/content/en-IN/products/kheelu/page.ts` (hero only);
  `src/components/chrome/WhatsAppFloat/whatsapp-float.css` only if no hero layout keeps the bubble clear;
  `test/e2e/first-screen.spec.ts`; the hero rules in `test/e2e/support/deviations.ts`; HeroSection's row in
  components.md.
- **Acceptance:** (1) at 360 × 590, 390 × 844 and 412 × 915, on both pages: Kheelu wholly inside the first screen, and
  the h1, the CTA and the price sentence inside it too; report every measured box (top, bottom) before and after. If
  360 × 590 cannot hold all four within the DS, stop and report the options with screenshots under `blocked`; never
  improvise a layout the DS does not have. (2) Built only from DS parts and the approved hero assets (the art board's
  own Kheelu layer, the DS Kheelu photo or sticker): no new colour, font, radius or shadow; no new motion in the first
  screen (D049). (3) The WhatsApp bubble covers neither Kheelu nor the hero sticker "It asks. They think." at the three
  phone sizes; solve it in the hero layout first. (4) `StickyBuyBar` behaves as today. (5) Laptop and tablet
  (720, 1024, 1440) unchanged: visual parity green without new rules at those widths. (6) The LCP element is still the
  hero picture, sized and prioritised (`next/image` `priority`, correct `sizes`); Lighthouse mobile ≥ 90 on `/` and
  `/products/kheelu` (local profile); HTML budget green. (7) axe clean on both pages at 360 and 390; no sideways
  scroll. (8) `first-screen.spec.ts` asserts the new phone boxes (Kheelu, h1, CTA, price sentence) at the three sizes.

### 8c.2 The later price on the offer cards, and "Share Kheelu on WhatsApp" (builder; risk normal)

- **What:** (a) D061 item 3: on the Home (fold 9) and product-page (fold 3) offer cards, in **token mode only** (the
  first-500 price is live), the plain line "{price:headline} for the first 500 units. {price:full} once they are gone."
  through the DS OfferCard's later-price place; nothing in full mode; never a struck-through price, a counter or "save".
  (b) Under both offer cards, the text link "Know a parent who needs this? Share Kheelu on WhatsApp"
  (`WHATSAPP_SHARE_LABEL`, reused) with **new** share text in a content module (the founder signs it):
  "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back.
  {price:headline} (incl. GST); pre-order with {price:token} today, refundable until dispatch." followed by the
  kheelona.com address with the share UTM the campaign conventions use (`tools/utm/build-link.mjs`, tracking
  inventory). A new registered `cta` value `share-whatsapp`.
- **Inputs:** D028, D041 (as changed by D061 item 3), PRICE-01 and DARK-01/DARK-03 in
  `wiki/product/legal-requirements.md`, `src/content/en-IN/offer.ts`, `src/lib/offer/`, components.md `OfferCard`,
  `OfferSection`, `Button`; tracking inventory §6 and architecture §8.3 (the `cta` registry); D050 (WhatsApp green is
  the bubble's alone).
- **Owns:** `src/components/ui/OfferCard/**`, `src/components/sections/OfferSection/**`, `src/content/en-IN/offer.ts`,
  a new share module (for example `src/content/en-IN/share.ts`) and its test; `wiki/site/tracking-inventory.md` §6
  (the new row), `wiki/engineering/architecture.md` §8.3 (the new row), `test/guards/tracking-registry.test.ts`; the
  machine-file pins in `test/machine-files.test.ts` if llms.txt or pricing.md read a string you change (bump
  `LLMS_UPDATED` and re-pin `DATED`); the offer rules in `test/e2e/support/deviations.ts`. Not the page files: render
  the link from OfferSection's placement config.
- **Acceptance:** (1) the line shows on both cards in token mode and in neither in full mode (unit tests both ways).
  (2) A guard test: no `<s>`, `<del>`, `line-through` or struck price anywhere in `src/`. (3) Never edit or reuse
  `WHATSAPP_SHARE_HREF` (it is parity-pinned in `test/env.test.ts`, inside the frozen money block, ADR-013). (4) The
  share text has no "first 500", no "teaches", no typed ₹ (tokens only), passes `findBanned`, leads with the total
  (D028 for ad-like text). (5) The link renders through `Button` (the `cta` attribute written), in the DS link or
  secondary style, never WhatsApp green; 44 px tap area. (6) `share-whatsapp` registered in the inventory,
  architecture §8.3 and the registry guard, which stays green. (7) No other tracking ID, event or `cta` value changes.

### 8c.3 Parents' own words, the recognition strip, four steps and the example conversation (builder; risk high)

- **What:** (a) D061 item 4: below the film strip on Home (fold 2) and the product page (fold 2), two `Quote` cards,
  the words verbatim from the films' burned-in subtitles (punctuation as the subtitle, unless a site rule bars a
  character; the words never change):
  "They first thought it’s just another soft toy, but when it started speaking, they were very much surprised."
  (cite: Nikita, Parent; film `a-parent-speaks`) and "I would recommend everyone to have one — so that there is play
  away from the screen." (cite: Siddhant’s father, Parent; film `a-father-speaks`). Each has a "Watch the film" button
  that plays that film in the strip through the strip's own island (no video bytes before the tap; keyboard and
  screen-reader correct). The films' proof line covers them (D040: claim only what the films show). Lines left out on
  purpose: "completely safe", "more than an hour", "make him jump". (b) The "Recognised by." strip (`RecognitionStrip`
  with team.ts's items as built, D054 item 20; the names never retyped as a sentence) on Home after the films and on
  the product page after the films, before the offer. (c) Product page, its own fold just before fold 4 ("How it
  works"): `StepsSection` `four` with the heading "What happens when your child {hand:presses it.}" and the steps
  "Press and ask." / "Your child presses the wake-up button and asks. A light shows Kheelu is listening."; "Kheelu
  answers." / "It answers the question first."; "Then it asks one back." / "A question back, so your child does the
  thinking."; "Next time, it remembers." / "It remembers earlier conversations, so it can pick up where your child
  stopped. You can read every one of them." (D018, D017, D036: "remembers" sits next to the parent's control). (d)
  Right after the steps: the labelled example conversation, home.md fold 2 variant b word for word ("What
  {hand:asking back} sounds like." with "Illustrative example, not a recording." never removed), without the
  ImaginationFrame doodles unless the page stays inside its budget with them.
- **Inputs:** D040, D054 item 20, D036, D018; `wiki/site/pages/home.md` fold 2 variant b; components.md `Quote`,
  `FilmsStrip`, `RecognitionStrip`, `StepsSection`, `Card`; `src/content/en-IN/films.ts`, `pages/team.ts`.
- **Owns:** `src/app/(site)/page.tsx`, `src/app/(site)/products/[slug]/page.tsx`, `src/content/en-IN/films.ts` (the
  quotes, each tied to its film id), `src/components/sections/FilmsStrip/**` (the quotes and "Watch the film"), the
  non-hero blocks of `pages/home.ts` and `products/kheelu/page.ts` for these folds, the RecognitionStrip placement
  config, the fold rules in `test/e2e/support/deviations.ts`, components.md rows. A new component only if the
  catalogue has nothing for the exchange; register it.
- **Acceptance:** (1) the quotes match the subtitles exactly (a test holds the strings); "Watch the film" plays the
  right film (an e2e or component test). (2) Order on the product page at 390: hero, films with quotes, recognition
  strip, offer, steps and example, then the rest; report the offer card's top at 390 before and after. (3) HTML budget
  ≤ 60 KB on both pages; if Home goes over with the strip, the strip comes off Home (it stays on the product page) and
  you report it. (4) Lighthouse mobile ≥ 90 on both pages; axe clean; no sideways scroll; the marks load lazily. (5)
  `findBanned` passes every new line; nothing implies under 3. (6) Laptop layout follows the DS; visual and text
  parity green with the new fold rules only.

### 8c.4 The FAQ wording, a languages answer and the guard for stale facts (builder; risk normal)

- **What:** (a) `faqs.ts` `not-right-for-us`: the question becomes "What if my child doesn't like it?" (answer
  unchanged), everywhere it renders, structured data included. (b) If no FAQ on Home or the product page answers
  "Which languages does Kheelu speak?", add it to `faqs.ts` and the product page's FAQ list: 40-60 words from
  facts.md (the 8 named languages, up to 10 at launch, rendered from the languages source, never typed; switching
  mid-sentence as approved, D017, in AI mode as film 6's caption says). (c) `test/guards/banned-phrases.data.ts` gains
  entries for the advisor's stale facts: cash on delivery offered; "ships 20 Oct(ober)"; open-ended ages ("Ages 3+",
  "6+", "3 and up"); a part-price inside a button label ("Pre-order for ₹499"); "Real pilot homes"; "Backed by" for the
  programmes; "Safety certified". Each with a planted example, its variants and near misses; green on the whole tree,
  the journal snapshot and the approved fixtures (approved lines such as "nothing to pay at the door" and any
  "no cash on delivery" stay green).
- **Owns:** `src/content/en-IN/faqs.ts`, the product page's FAQ id list (one line in `products/kheelu/page.ts`),
  `test/guards/banned-phrases.data.ts` and its test (import-free, as now), `test/machine-files.test.ts` pins
  (`LLMS_UPDATED`, `DATED`), the FAQ rule in `test/e2e/support/deviations.ts`, the pinned tests that print the old
  question (`home.test.tsx`, FaqList test and story), `wiki/product/claims.md` §4 rows for the new entries.
- **Acceptance:** (1) the new question in the page, the FAQPage JSON-LD and llms.txt; pins bumped. (2) Every new guard
  entry proven red on its planted example and green on the tree. (3) The languages answer passes `findBanned` and
  states only facts.md.

### 8c.5 "Made in India" on the offer cards (main session or builder; risk low; after 8c.2 merges)

- **What (D061 item 10, confirming D034):** a perk "Made in India" (icon from the DS set, e.g. `map-pin` is taken:
  pick the closest DS icon) on the Home and product-page offer cards, from `offer.ts`'s perk list; the footer line and
  the product page's "Country of origin" already say it. A deviation row for the founder.
- **Owns:** `src/content/en-IN/offer.ts` (the perk), the offer card tests and story data, the offer rule in
  `test/e2e/support/deviations.ts`.
- **Acceptance:** the perk on both cards in both modes; `findBanned` green; text parity green with the new rule.

### 8c.6 The expert clip (builder; risk high; after 8c.3 merges)

- **What (D061 items 12-13):** a 34-second trimmed clip of the expert video, hosted like the films, on the product
  page. The cut and copy were proposed by the CMO and a claims review (workflow `wf_7be1470f-7e4`) and chosen by the
  founder. Source (local only, never committed):
  `wiki/raw/feedback/advisor-homepage-2026-10-12/expert-video/expert-720.mp4` (1280 × 720, 4:46) and `timed.txt`.
- **The cut:** source 0:00.0-0:24.5 then 1:34.0-1:43.2 (33.7 s). Stretch 1 ends 0.66 s before "Hey, I'm Dr.
  Chaitra" (0:25.16), so it is never heard; stretch 2 ends 0.9 s before "Here's the scary part" (1:44.08). Frame
  stretch 2 about 15% tighter so the join reads as a change of shot; a 0.1 s audio crossfade at the join, a 0.15 s
  fade-in, a 0.3 s fade-out. Landscape 16:9 from the 720p file; no blur or mask (the founder: show it as it is).
- **Burned-in captions, word for word** (DS 08-accessibility; DS body font; at most 2 lines; about 48-56 px tall at
  720p so they read at 360 px; white on a translucent dark box, clear of the bottom edge): "Hey, have you ever
  noticed, / in a room full of people," · "children can be completely / silent and isolated?" · "Not to the peaceful /
  kind of silence," · "but a heavy digital silence." · "You look around, and every child / is looking into a glowing
  screen." · "They aren’t talking. / They aren’t playing." · "They’re just consuming." · "I see this every single day
  / in my practice." · "A child with a tablet / isn’t busy." · "They’re often just alone / in the digital world" ·
  "that doesn’t talk back." (timings: the CMO's proposal in the workflow result; re-time against the audio). Also
  burn a small disclosure into the first 5 s: "Made with Kheelona. Chaitra was compensated." (the file can travel
  without the page).
- **The file:** H.264 + AAC, faststart, about 3 MB (the films' budget is ≤ 4 MB on play), in `public/video/expert/`
  with a poster (jpg and webp, the tight front frame at 0:00.2) like the films; a row in assets.md.
- **The fold (product page, its own fold `id="expert"`, right after the offer card and before 8c.3's steps fold):**
  eyebrow "A video from an expert"; H2 "Watching isn’t {hand:talking.}"; the poster with a "0:34 · With captions"
  chip; under it, visible before the tap and in body type: "Chaitra, therapist and developmental coach" and the
  disclosure "Kheelona made this video with Chaitra and compensated her for it." No other line: nothing says Kheelu
  fills the gap she describes. The play control's accessible name: "Play the video from an expert: Chaitra,
  therapist and developmental coach. 34 seconds, with captions." (it does not start with "Play:", so the films'
  autocapture measure stays comparable, D040). Plays only on tap, with sound; `preload="none"`; lazy poster; no
  autoplay, muted preview, loop or animated poster (D049). No new event names.
- **Home (optional):** one text link at the end of Home fold 3, "Watch a video from an expert", to
  `/products/kheelu#expert`, only if Home stays ≤ 60 KB HTML after 8c.3.
- **Never:** "Dr.", "doctor", "counsellor", "paediatrician", "recommended by", "approved by", "reviewed by an expert",
  a link to or embed of the full YouTube video, her and Kheelu in one sentence.
- **Owns:** `public/video/expert/**`; a content module for the clip (for example `src/content/en-IN/expert-video.ts`);
  the single-video player (extend FilmsStrip's island or a new `ui` component, after checking the catalogue; register
  it); the expert fold in `products/kheelu/page.ts` and the product page file; the optional Home link;
  `test/guards/banned-phrases.data.ts` and its test (entries: "Dr. Chaitra"/"Dr Chaitra"; expert-, therapist- or
  doctor-"approved" and "recommended by an expert/therapist/doctor"; "speaking fluently within weeks"; "demand of/for
  phones plummeted"; "four walls of loneliness"; "vocab deficiency"; "biological trade-off"; "ultimate brain
  exercise"); assets.md and components.md rows; the fold rule in `test/e2e/support/deviations.ts`.
- **Acceptance:** (1) a test pins the 11 caption strings and the copy; the final mp4, transcribed locally
  (`whisper-cli`, large-v3), holds no word outside the captions (no "Dr", no "scary"). (2) The file plays on tap only,
  no bytes before the tap but the lazy poster; keyboard and screen-reader correct. (3) Product page HTML ≤ 60 KB,
  Lighthouse mobile ≥ 90, axe clean, no sideways scroll at 360/390. (4) `findBanned` passes every new line and the new
  entries are proven red on planted examples. (5) A deviation row drafted for the founder.

## Wave 9: beta deploy and beta QA (after wave 8)

### 7.2 Beta deploy and beta QA (main session, founder, QA)

- **Owns:** the `beta` branch (the main session pushes it); the founder's dashboard steps
  ([architecture §15.4](architecture.md#154-founder-runbook-the-beta-vercel-dashboard-and-cloudflare-only-never-the-cli)).
- **No beta payment (D051).** The beta has no Supabase, Razorpay or email settings and the code refuses
  store keys there (2.10); the B4 preconditions and the test plan §6 payment are dropped. The founder's
  only dashboard step is the two domains ([architecture §15.4](architecture.md#154-founder-runbook-the-beta-vercel-dashboard-and-cloudflare-only-never-the-cli)).
- **Acceptance:** both beta hosts serve the build; every HTML route carries `x-robots-tag: noindex,
  nofollow` and the robots meta, and non-HTML files (`/llms.txt`, `/pricing.md`, `/sitemap.xml`, an image,
  a film) carry the header (N1); every CTA opens betastore; betastore shows the restyled not-configured
  screen and its API routes answer 503 (D051); no GA4, Meta Pixel, CAPI or Ahrefs requests from beta;
  PostHog events carry `env = beta`; no `$current_url` containing the bypass secret (N5; the harness sends the bypass header only on the first request to a beta host, reads each 3xx `Location` itself and aborts any hop that leaves the beta hosts, and warms each beta host's bypass cookie first; Playwright never routes redirect hops; confirmed by the main session 2026-10-12); axe and
  Lighthouse Accessibility on beta through the bypass cookie; region and timing: `x-vercel-id` names
  `bom1`; the store form (token and full mode, validation errors) and the `/thanks` states sent to the
  founder as phone screenshots from the local production build (D051). A guide shared from beta shows no preview image
  until the Gate B merge: `og:image` uses the canonical origin, and production does not serve the new share cards yet
  (task 7.1f; N8); say so in the founder notes.

## Wave 10: Gate B and release (after wave 9)

### 7.3 Gate B readiness pack and release (main session, founder)

- **Owns:** the readiness pack (main session's pages), the rollback tag, the merge to `main`.
- **Acceptance:** per [architecture §15.5](architecture.md#155-gate-b-release-to-production-and-rollback):
  founder prerequisites done (Supabase moved or `/privacy` naming its region, D055 item 24; placeholders answered
  (D054, D055) or ruled off; legal approved; the `www` switch declined, D054 item 21;
  no test payment anywhere but the local sandbox (D051; the founder's optional real order and refund
  after launch is their call); Gate B OK logged; rollback tag pushed before the merge; production build green
  (placeholder guard passes); smoke tests green; sitemap resubmitted; monitoring scheduled (24 hours,
  72 hours, 7 days).
- **The readiness pack lists for the founder:** the two wording changes accepted by D054 item 17 (done); the D055
  sentence that a deleted conversation stays in Kheelu's memory and the training data; the 5.20b items left with the
  main session (CMO 5.18 M6, the related-guide ring; M10, the bilingual guide's line "Most of the studies it draws on
  were done in North America and Europe.", traced only to the verifier's note); the bylines' named owners reading their
  pages (P17); "May 2027" re-read against the Gazette (P23); from batch 6b: Kashyap's background line as the main
  session ruled it (team.md ruling 7) (the Karnataka emblem stays, D056 item 5; the refund timing is aligned, D056
  item 4, task 7.1b); the four legal pages' D029 sign-off (their `status: "draft"` stops a production build); from
  wave 8: every line changed after Gate A for the founder's sign-off (D015: deviations V17-V22, the related-guide ring
  of 7.1d, the store words of 7.1c), [open questions](../open-questions.md) G19 (the films heading's "in their own
  homes"), G20 (`/terms` section 9's age line), G21 (the confirming `/thanks` tab title) and G22 (a refused event
  link's words; a precondition before any event tier is switched on again), and CMO C m7 (a chargeback how-to line,
  a new legal line).
- **Repo pages before the merge to `main` (from 6.3):** `README.md` (the public repo's front page) still describes the
  legacy site (PlayOS, Lumi, `docs/standards/`, `qa:sweep`), and `docs/store-go-live.md`'s steps run the deleted
  `tools/qa/{text,sweep}.mjs`: rewrite both for the new site, with Playwright equivalents for the go-live checks.

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
| 2 | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10 | wave 1 closed |
| 3 | 3.1, 3.2, 3.3, 3.4 | wave 2 closed |
| 4 | 4.1, 4.2, 4.3, 4.4 | wave 3 closed |
| 5 | 5.1-5.19 | wave 4 closed |
| 6 | 6.1, 6.2 (gated), 6.4 (gated) | wave 5 closed |
| 7 | 6.3 | wave 6 closed (gated tasks may still be waiting; they touch no file 6.3 deletes) |
| 8 | 7.1 | wave 7 closed |
| 9 | 7.2 | wave 8 closed and the two beta domains connected by the founder (D051: no payment on beta) |
| 10 | 7.3 | wave 9 closed and the founder's Gate B OK |
