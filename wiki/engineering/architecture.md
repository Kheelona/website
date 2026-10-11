---
title: "Architecture of the new kheelona.com (Phase 4 plan, revised after QA round 1)"
type: engineering
updated: 2026-10-12
sources:
  - ../raw/brief/kickoff-brief.md (§4, §6 Architect, §7 Phase 4-5, §9)
  - phase-4-kickoff.md, lessons.md
  - ../decisions/D040-films-move-to-new-site.md to ../decisions/D050-whatsapp-chat-button.md (D049 motion picks and D050 WhatsApp bubble, 2026-10-12)
  - ../qa/architecture-review-2026-10-12.md (B1-B4, N1-N26), ../qa/test-plan.md
  - ../site/strategy.md, ../site/tracking-inventory.md, ../site/checkout.md, ../site/url-map.md, ../site/content-boundary.md, ../site/gate-a-progress.md, ../site/gate-a-open-items.md, ../site/pages/*.md
  - ../product/pricing.md, ../product/claims.md, ../product/policies.md
  - ../design-system/overview.md, ../design-system/component-map.md, ../design-system/tokens.md, ../design-system/motion.md, ../design-system/gaps.md (G-10, G-20)
  - ../../mockup/APPROVAL.md, mockup/pages/*.html, mockup/partials/*.html, mockup/mockup.css, mockup/css/*.css, mockup/mockup.js, mockup/build.mjs, mockup/tools/check.cjs, mockup/_work/motion/motion.css (local D049 reference)
  - "Code audit of the working tree of reset/website-v2 (HEAD 947af4e) against tag archive/pre-reset-2026-10-10: package.json, next.config.ts, vercel.json, src/**, test/**, tools/**, scripts/** (2026-10-12)"
  - "design-system/project/assets/Doodles/*.svg read 2026-10-12: stroked paths (fill none, stroke-width 4.2-4.6), some filled dots, and one identical feTurbulence filter id=chalk in every file"
  - node_modules/next/dist/docs/01-app (css, images incl. image.md:265-293 preload and priority deprecation, fonts, metadata, proxy, caching without cache components, unstable_cache.md:7, generate-static-params.md:292-310, use-pathname.md:37,115, route segment config, env), Next 16.3.4
  - "Vercel docs fetched 2026-10-12: git configuration, assign a domain to a Git branch, deployment protection, protection bypass for automation, function regions, system environment variables"
  - "gzip -9 of the built mockup pages, 2026-10-12: home.html 71,670 B raw / 14,752 B gzip; meet-kheelu.html 73,607 / 15,610; privacy.html 45,980 / 11,996; store.html 32,881 / 7,950"
  - "grep of every chilli button in mockup/pages and partials, 2026-10-12: arrows on hero (Home), product-top, and the finale buttons of the guide, safety, stories and the two article mockups"
  - "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/ (fetched 2026-10-12): lists no hex value; the logo pack is the source for WhatsApp green"
---

# Architecture of the new kheelona.com

The plan for building the 18 approved pages ([D046](../decisions/D046-gate-a-approved.md)) on the
existing stack, with the founder's chosen motion ([D049](../decisions/D049-motion-picks.md)) and WhatsApp
bubble ([D050](../decisions/D050-whatsapp-chat-button.md)), ready for the beta
([D048](../decisions/D048-beta-deployment.md)) and then Gate B. **No application code is written by this
plan.** Decisions with alternatives are in [`adr/`](adr/); the folder tree and naming are in
[structure](structure.md); every component to build is in [components](components.md); assets in
[assets](assets.md); libraries in [dependencies](dependencies.md); the build in waves in [tasks](tasks.md).

## 1. In one screen

1. **Same stack** (Next 16.3.4, React 19, Tailwind 4, Vercel, Supabase, Razorpay); unused libraries
   retire ([ADR-001](adr/ADR-001-keep-the-stack.md)).
2. **The look is the design system's own CSS.** `tokens.css` (as a font-less derivative) and
   `bundle.css` (as is) load first, then the composition CSS ported from the mockup (`mk-` becomes
   `ks-`), then a layout-only Tailwind with no preflight, whose utilities cannot override a DS class
   ([ADR-002](adr/ADR-002-visual-layer-ds-css.md)). Built markup uses the mockup's classes, so fidelity is
   checked by screenshot diff against the mockup files themselves.
3. **Primitives → sections → templates → pages**, all server-rendered ports of the mockup markup; small
   client islands only for the drawer, films, sticky bar, reveals and doodle drawing, the WhatsApp bubble
   and the store's helpers ([ADR-003](adr/ADR-003-server-rendered-ds-ports.md)). A page is a content
   module listing sections.
4. **One content model** in `src/content/en-IN/`: copy, FAQs, trust items, policy constants, the seller
   block and support chat, delivery, product facts, articles, legal documents; prices only as tokens
   resolved from the checkout's own constants; **a production build that fails on any placeholder**
   ([ADR-004](adr/ADR-004-content-model.md)). The offer follows the live store mode within about ten
   minutes, or at once after a Redeploy ([ADR-005](adr/ADR-005-offer-follows-live-mode.md)).
5. **One tracking module**: registries of every destination, event and CTA value; the proven funnel
   frozen byte for byte and proven against the registry; new events through one dispatcher
   ([ADR-006](adr/ADR-006-tracking-module-and-registry.md)).
6. **Motion** is the approved spec plus the founder's eight picks, as CSS presets on DS tokens and one
   observer; `transform` and `opacity` only, with exactly two founder-approved exceptions
   (`stroke-dashoffset` for the doodles, `grid-template-rows` for the FAQ)
   ([ADR-007](adr/ADR-007-motion-css-first.md)).
7. **One build-time `SITE_ENV`** drives store links, analytics gating and noindex; beta builds from the
   `beta` branch onto betawebsite and betastore with Razorpay test keys, its own Supabase project, no GA4
   or Meta, PostHog tagged `env=beta`, and five isolation checks before the first test payment
   ([ADR-008](adr/ADR-008-environments-and-beta.md)). Functions run in Mumbai; Supabase moves there before
   launch ([ADR-009](adr/ADR-009-region-and-supabase-move.md)).
8. **Checkout logic is frozen and proven frozen** by a byte freeze, a logic signature per presentation
   file, a rendered JSX contract and the six checkout test files frozen; only presentation changes
   ([ADR-013](adr/ADR-013-checkout-restyle-boundary.md)).

## 2. Stack audit (2026-10-12)

| Area | What exists | Verdict |
|---|---|---|
| Framework | Next 16.3.4 (App Router, `src/proxy.ts` replaces middleware), React 19.2.4, TypeScript 5.9.3, Node 24 | Keep |
| Styling | Tailwind 4.3.2 via `@tailwindcss/postcss`; `src/styles/globals.css` maps the **retired v3** DS (orange-ink, Glory, Instrument fonts), with arbitrary values throughout old components | Replace with the bridge in §4 |
| Fonts | `next/font/local` with the v3 fonts in `src/app/fonts/` | Replace with the DS fonts (§10) |
| Routes | `(site)` group with 14 pages incl. `/playos`; `store/` group (store, `/thanks`, `/e/[event]`, `/ideabaaz`, catch-all); API routes; `robots.ts`, `sitemap.ts`, `llms.txt`, `pricing.md` | Keep the shape; rebuild the pages; `/playos` redirects (wave 1), its folder goes in 6.3 |
| Components | Atomic folders (`atoms`, `molecules`, `organisms`, `templates`, `vendor`) and `features/home`, styled for the v3 DS; `src/lib/cn.ts` with `tailwind-merge` imported by 32 files incl. the checkout forms | Replace with `ui`, `sections`, `chrome`, `layouts` (§5); new code imports `clsx` directly; delete in 6.3 |
| Checkout | `src/features/preorder/**`, `src/lib/store/**`, `src/app/api/**`, `src/proxy.ts`: byte-identical to the tag `archive/pre-reset-2026-10-10` (`git diff --stat`, 2026-10-12; QA re-ran it, empty) | Frozen; presentation restyled (§16) |
| Tracking | Five browser tools plus CAPI and server PostHog, gated by host lists in `src/config/site.ts` ([inventory](../site/tracking-inventory.md)) | Keep; registries around it (§8) |
| Content | Prices in `src/config/site.ts` (paise); copy hard-coded in pages; articles in `src/lib/stories*.ts`; facts in `src/lib/product-facts.ts`; several now-banned lines | New content model (§6); money stays |
| Tests | Vitest + jsdom + RTL; 31 repo tests in `test/`; colocated component tests; Storybook 10. Several read files this plan changes; each has a named owner per wave ([tasks, guard-test ownership](tasks.md#guard-test-ownership)) | Keep the runner and the guards that still apply; add Playwright (§14) |
| QA tools | `tools/qa/` (puppeteer-core and axe borrowed from the npx cache), `mockup/tools/check.cjs` | Promote Playwright, axe and Lighthouse to pinned dev dependencies |
| Deploy | Vercel; `main` auto-deploys; `vercel.json` cron on `/api/health` daily and `reset/*` builds off; functions in `iad1` (default); no CI | Add `beta`, `regions: ["bom1"]`, a CI workflow (§15) |
| Unused libraries | `three`, `@react-three/*`, `zustand` (0 imports); `lucide-react`, `motion`, `@radix-ui/*`, `tailwind-merge` (old components only) | Retire in 6.3 ([dependencies](dependencies.md)) |

## 3. Principles this plan enforces

| Brief rule | How the architecture makes it hold |
|---|---|
| DS is the only visual source, never edited (§4.1) | DS CSS imported from `design-system/` read-only; derivatives generated into `src/styles/generated/`, `src/assets/*.generated.*`, `public/fonts/`, `public/og/`; `scripts/ds-checksums.mjs` in `verify` and the production prebuild. Two founder exceptions only: the D049 motion literals and WhatsApp green (D050, G-20), each named once |
| No invented claims (§4.2) | Content holds only what the approved copy holds; placeholders are a type that production refuses; banned-phrases guard (green on every approved page by construction) |
| Tracking parity (§4.3, §9.4) | Frozen funnel, registries, freeze and parity tests (§8) |
| Checkout logic unchanged (§4.4) | Byte freeze, logic signatures, the rendered JSX contract, the frozen checkout tests (§16) |
| Production untouched until Gate B (§4.5) | `beta` branch and hosts; `main` only after the founder's OK; noindex on every beta response and Vercel Authentication |
| No secrets (§4.7) | Env names unchanged; beta secrets only in Vercel Preview scoped to `beta`; `test/store-secrets.test.ts` also bans reading the protection-bypass secret |
| Build once (§4.10) | One component per pattern with variants; the four duplicated legal-page CSS files merge into one template; one formatter for ₹ and dates; `jscpd` and asset-hash guards |
| Everything in its place (§4.11) | [structure](structure.md) plus path-scoped rules (structure §9) |

## 4. Visual layer and the token bridge

Decision and options: [ADR-002](adr/ADR-002-visual-layer-ds-css.md).

### 4.1 The one CSS entry

`src/styles/site.css`, imported once by `src/app/layout.tsx`:

```css
/* Layer order first (a layer statement may precede @import); DS and composition CSS stay unlayered */
@layer theme, utilities;
/* 1. DS tokens without @font-face (generated derivative of design-system/project/tokens.css) */
@import "./generated/ds-tokens.css";
/* 2. DS fonts, same family names, pointing at public/fonts (generated) */
@import "./generated/fonts.css";
/* 3. DS components, imported as delivered (read-only) */
@import "../../design-system/project/components/bundle.css";
/* 4. Generated responsive type steps, from the kh- type classes in tokens.css */
@import "./generated/type-steps.css";
/* 5. Shared motion presets (§11) */
@import "../motion/motion.css";
/* 6. Composition classes (ks-), collected from colocated component CSS (generated manifest) */
@import "./generated/compose.css";
/* 7. Tailwind: theme and utilities only, in layers, no preflight */
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@import "./tailwind-theme.css";
@source "../**/*.{ts,tsx}";
@source not "../**/*.{test,stories}.tsx";
```

Layers 1-6 are unlayered, exactly as the mockup loads them, so the cascade the founder approved is the
cascade that ships. Tailwind's utilities live in a layer, and unlayered CSS beats any layer, so a
utility can only fill a property nothing else sets. The order is checked twice: by compiling `site.css`
in Vitest (`test/guards/visual-layer.test.ts`) and on `next build` output (Next docs, CSS "Ordering and
Merging": order follows import order; dev can differ).

### 4.2 The Tailwind theme (`src/styles/tailwind-theme.css`)

```css
@theme inline {
  --*: initial;                                   /* drop every Tailwind default */
  /* colours: DS roles only (theme-safe: inline emits var(--role)) */
  --color-surface: var(--surface);  --color-surface-band: var(--surface-band);
  --color-surface-raised: var(--surface-raised);  --color-text: var(--text);
  --color-text-muted: var(--text-muted);  --color-border: var(--border);
  --color-link: var(--link);  /* … each of the 21 roles, none of the primitives */
  /* spacing: DS numbering, so p-5 means space-5 */
  --spacing-1: var(--space-1); /* … */ --spacing-10: var(--space-10);
  --container-content: var(--content-max);
  /* breakpoints: the four widths bundle.css hard-codes (G-03), verified by test */
  --breakpoint-sm: 720px; --breakpoint-md: 768px; --breakpoint-lg: 900px; --breakpoint-xl: 1024px;
}
```

Radius, shadow, easing, font and type are deliberately absent (they collide with DS names and belong
to `kh-` classes). `test/guards/tailwind-theme.test.ts` asserts: every colour maps to a DS role; the
four breakpoints equal the `min-width` values parsed from `bundle.css`; no other namespace exists.

### 4.3 Generated derivatives

`scripts/assets/build-ds-css.mjs` writes, with a header naming source and script:

- `src/styles/generated/ds-tokens.css`: `tokens.css` minus its four `@font-face` lines (the test
  re-derives and compares).
- `src/styles/generated/type-steps.css`: for each of the 19 `kh-` type classes, a class
  `ks-type-<style>` plus responsive copies spelled `ks-type-<style>@<bp>` inside the matching media query,
  copying the declarations from `tokens.css`. This replaces the mockup's restated pixel sizes (legal
  pages, article prose, card titles on the hub) without a single typed value.

`scripts/assets/build-compose-css.mjs` writes `src/styles/generated/compose.css`: one `@import` per
colocated component CSS file, ordered ui → sections → chrome → layouts, alphabetical within a layer. It
runs in the `predev` and `prebuild` hooks (`scripts/run-steps.mjs`, structure §1); the file is git-ignored.

### 4.4 Composition CSS rules

- Prefix `ks-`, BEM like the DS. One file per component that needs it, colocated
  (`Button/button.css` is never needed; `FilmsStrip/films-strip.css` is).
- Port rule: each mockup `mk-` block moves to the component that renders it, renamed `ks-`, with the
  same declarations (every one of the 167 blocks is mapped in [components §7](components.md#7-mockup-mk--helpers--where-they-go)),
  except (a) the Gate A review tool (`mk-review-*`, `mk-h1*`, `mk-tool`, `mk-review-note`, `mk-later`),
  dropped; (b) pixel type sizes, replaced by `ks-type-*` classes in markup; (c) the four copies of the
  legal-page CSS, merged into `LegalTemplate/legal-template.css`; (d) `272px` widths in `safety.css`,
  expressed with `var(--space-10)` multiples as `mockup.css` already does; (e) dead mockup CSS with no
  element (`mk-article`, `mk-lead`, `mk-step`), not ported.
- Allowed literals, listed once in `test/guards/token-exceptions.ts`: the four DS breakpoints and their
  `max-width` neighbours, `outline-offset: 2px` (the DS's own focus-ring value), zero values, and the
  three founder exceptions: `--ks-nudge: 5px` and `--ks-film-focus: 1.05` (D049, in `src/motion/motion.css`)
  and `--ks-wa-green` (D050, DS gap G-20, in `WhatsAppFloat/whatsapp-float.css`). Generated files are
  exempt and checked by their drift tests. `test/guards/no-off-token.test.ts` scans `src/**/*.css` and
  `src/**/*.tsx`.
- Inline `style` only for art-board layer positions in percent (and their rotation), the DS sticker tilt
  variable (`--kh-tilt`), which the DS specifies (`10-pages.md:42-52`), and the DS photo ratio variable
  (`--kh-ratio`, read by `.kh-photo img` in `bundle.css`, used once in the mockup for the setup
  screenshot); all passed as typed props. The mockup's other three inline styles (`margin: 0` beside a
  tilt, a list reset, `align-self: start`) become composition classes (inventory of every `style=` in the
  mockup pages, 2026-10-12).

## 5. Component system

Decision: [ADR-003](adr/ADR-003-server-rendered-ds-ports.md). Catalogue with DS classes, props and pages:
[components](components.md).

### 5.1 Layers

| Layer | Folder | What lives there | Examples |
|---|---|---|---|
| Primitives | `src/components/ui/` | Ports of DS components and the small site primitives every section shares | `Button`, `PreorderButton`, `Icon`, `Heading`, `RichText`, `Card`, `TrustList`, `TrustLine`, `PriceSentence`, `OfferCard`, `FaqList`, `Photo`, `ArtBoard`, `ImaginationFrame`, `Doodle`, `AppScreens`, `CompareTable`, `Field`, `Placeholder`, `SourceMarker`, layout primitives (`Section`, `Container`, `Split`, `Cols`) |
| Sections | `src/components/sections/` | One fold each, generic and configured by props from content; a page needing something new adds a variant | `HeroSection`, `CtaBlock`, `FilmsStrip`, `FeatureSplit`, `ModesSection`, `TrustSection`, `CompareByCategory`, `CardGrid`, `StepsSection`, `FaqSection`, `OfferSection`, `CloseSection`, `AnswerSection`, `ProductDetails`, `TopicSection`, `FoundersSection`, `RecognitionStrip`, `GrievanceBlock`, `SellerBlock`, `EmptyStateSection`, `ArticleHead`, `ArticleBody`, `SourcesSection`, `RelatedGuides`, and the store sections |
| Chrome | `src/components/chrome/` | Parts every page of one host shares | `NavBar`, `NavDrawer`, `Footer`, `StickyBuyBar`, `WhatsAppFloat`, `StoreHeader`, `StoreFooter`, `SkipLink` |
| Tracking | `src/components/tracking/` | The gates and mount-time trackers | `GoogleAnalyticsGate`, `MetaPixel`, `PostHogGate`, `ViewContentTracker` |
| Layouts and templates | `src/layouts/` | Page shells and page templates | `SiteShell`, `StoreShell`, `PageTemplate`, `ArticleTemplate`, `LegalTemplate` |
| Pages | `src/app/**/page.tsx` | Thin: load content, compute the offer, export metadata, render a template | `src/app/(site)/safety/page.tsx` |

### 5.2 The mockup's composed patterns

Each becomes a component once (kickoff §3, decision 1):

| Mockup pattern | Component | Rule it carries |
|---|---|---|
| Price sentence (`mk-price`) | `ui/PriceSentence` | Always the exact D028 text for the current mode; amounts from the offer |
| Trust line (`kh-trustline mk-trust`) | `ui/TrustLine` | Items from `content/en-IN/trust.ts`; each links to its terms with a 44 px tap area (CMO V4) |
| Compact CTA block (`kh-section__actions` + `mk-beside`) | `sections/CtaBlock` | Button, then directly under it the price sentence, trust line, help line, optional secondary link |
| Phone sticky bar (`kh-buybar`) | `chrome/StickyBuyBar` | Hidden until the hero CTA leaves (or from first paint where there is none); steps aside while any inline chilli CTA is on screen, including the offer card's; hidden at 900 px and up; safe-area padding (G-09, D041); slides up once (D049 pick 4) |
| Films strip (`mk-films`) | `sections/FilmsStrip` | Rewrite of the live `VideoMoments`; labels "Play: {chip}. {caption}", "Previous video", "Next video" (D040); `<video>` only on play; the film in focus grows (pick 8) |
| App-screen device frame (`mk-shots`) | `ui/AppScreens` | DS `kh-device`; two equal phones or one at the same size (D046); caption from content |
| FAQ block (`kh-faq`) | `ui/FaqList` + `sections/FaqSection` | The FAQPage JSON-LD is the plain-text serialisation of the same items; answers open smoothly (pick 7) |
| OfferCard (`kh-offer`) | `ui/OfferCard` | Token mode shows the split; full mode omits it (G-08, composed) |
| Phone comparison stack (`mk-compare-stack`) | `sections/CompareByCategory` | Cards below 720 px, DS table from 720 px (G-05) |
| Source markers (`mk-src`) | `ui/SourceMarker` + `ui/SourcesNote` | Short linked label, 44 px tap area, "Sources" note (G-18, D026) |
| Guides cards (fold 7b) | `sections/CardGrid` (variant `guides`) | Topics and links from the stories content (D046) |
| Doodles (`kh-art__layer`, `kh-imagine__doodle` SVGs) | `ui/Doodle` | Plain `<img>` in a hero (pick 2: still); inline generated SVG that draws itself below the first screen (pick 3) |
| Product details (DS Tabs markup, tab list hidden) | `sections/ProductDetails` | **Stacked panels as approved** (N21): the mockup hides the tab list and `mockup.js` has no tabs code, so the build ships three stacked panels with their headings and no JavaScript |
| Legal layout (`mk-doc`, `mk-toc`) | `layouts/LegalTemplate` | Summary, contents, parts and sections; draft note while `status: draft` |

### 5.3 The WhatsApp bubble (D050)

`chrome/WhatsAppFloat` (a server component with one small client part for the laptop label and the lift):

- **Markup:** a real `<a>` named "Chat with us on WhatsApp", `href="https://wa.me/919187546483?text=<encoded
  pre-filled text>"`, `target="_blank"`, `rel="noopener"`; the DS look of `kh-iconbtn kh-iconbtn--l` (56 px,
  the DS's own size) with the DS `whatsapp-logo` icon in white, `shadow-lift`, the DS focus ring, and the
  background `--ks-wa-green` (the founder's brand exception; the exact value is WhatsApp's brand green from
  its logo pack, recorded in [G-20](../design-system/gaps.md#g-20) by the main session); margins reset
  (the DS gives icon buttons negative margins for in-flow use).
- **Contexts and text:** `site` ("Hi Kheelona! I have a question about Kheelu."), `store` ("Hi Kheelona! I
  need help with my pre-order."), `thanks` ("Hi Kheelona! I have a question about my order."), all from
  `content/en-IN/seller.ts`; never an order number or personal data.
- **Where it renders:** `SiteShell` (context `site`, every marketing page and the 404); each store page
  renders its own (store page, event and partner pages, store not-found: `store`; `/thanks`: `thanks`).
  Pages render it rather than `StoreShell`, because a layout cannot know its page and `usePathname()` after
  the proxy's host rewrite risks a hydration mismatch (Next `use-pathname.md:37,115`).
- **Position and motion:** phones bottom right, `var(--space-4)` from the edges plus
  `env(safe-area-inset-bottom)`; from 900 px, `var(--space-5)`. While the buy bar shows,
  `html[data-buybar="shown"] .ks-wa` lifts by `--ks-buybar-h` (both published by `StickyBuyBar`) over
  `duration-base`; it drops back when the bar steps aside; on laptops a "Chat on WhatsApp" label slides
  out on hover or keyboard focus (opacity and transform, `duration-base`); no entrance animation; nothing
  moves with reduced motion. Hidden while any modal dialog is open (`html:has(dialog[open]) .ks-wa`; the
  modal's top layer and `inert` cover it anyway).
- **Never covers content:** shells add `ks-has-float` to `<body>`, giving the last content a bottom
  padding of `calc(var(--space-8) + var(--space-4) + env(safe-area-inset-bottom))`, so it never covers the
  bar, the price, a form field or the pay button.
- **Tracking:** `data-ph-capture-attribute-cta="whatsapp-float"` (new value, §8.3). On `/thanks` the
  element also carries `ph-no-capture`, so `/thanks` keeps zero autocapture events (inventory row 18). No
  Meta or GA4 event.
- **Fidelity:** a post-Gate A addition, so the visual-parity runs hide the bubble and its padding and a
  dedicated spec (task 3.1) checks it.

### 5.4 The scalability test

The brief's test (§6) holds by construction: `PageTemplate` renders `page.sections`, a discriminated
union of section configs; a new campaign page is a content module plus a line in the campaign registry
(route `src/app/(site)/lp/[slug]/page.tsx`, `dynamicParams = false`, empty at launch); a new product is a
module in `content/en-IN/products/` (route `products/[slug]`); a new story is a module in
`content/en-IN/stories/articles/` plus its slug in `routes.ts` and a topic list. `test/scalability.test.tsx`
(task 4.1) renders a fixture campaign page and a fixture product page from content alone, and
`test/scalability-article.test.tsx` (task 4.2) renders a fixture article.

## 6. Content model

Decision: [ADR-004](adr/ADR-004-content-model.md). Folder detail: [structure §3](structure.md#3-src-in-detail).

### 6.1 Modules

| Module (`src/content/en-IN/`) | Holds | Owner page for the facts |
|---|---|---|
| `offer.ts` | The D028 price sentence per mode, sticky-bar lines, offer-card lists, the Kheelona+ line ("Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app", D041 F7), "first 500 units" once (in the price FAQ) | [pricing](../product/pricing.md) |
| `cta.ts` | The one label "Pre-order Kheelu" (D041), secondary link labels | [messaging](../brand/messaging.md) |
| `delivery.ts` | `DELIVERY_TEXT` "Deliveries start mid-November" and `DELIVERY_SCHEMA_DATE` 2026-11-15 | [D023](../decisions/D023-new-order-delivery.md), [D037](../decisions/D037-delivery-date-in-schema.md) |
| `policies.ts` | `RETURN_DAYS` 7 (from delivery), `WARRANTY_MONTHS` 6, grievance acknowledgement 48 hours and resolution one month, `RETENTION_MONTHS` 36, refund start "within 2 working days", bank "5-7 working days", refund after return "within 7 working days", no exchanges, no payment fees, free pickup | [policies](../product/policies.md), D021, D022, D032, D033, D042 |
| `seller.ts` | Legal entity, GSTIN, registered address, manufacturer, origin "Made in India", grievance officer (Aman Soni, Co-Founder and CTO, email), support line "+91 91875 46483 (WhatsApp or call)", email, and the **support chat** (number `919187546483` and the three D050 pre-filled texts) | [policies](../product/policies.md), D029, D032, D034, D050. Reads the existing seller constants in `site.ts` where they exist, so the store footer and emails stay identical |
| `trust.ts` | The trust items (id, icon, label, terms link): returns, warranty, payment methods, delivery included, deliveries start | strategy §3.2 |
| `navigation.ts` | Nav (Meet Kheelu, Safety, Stories, Team), drawer, footer columns, legal links | strategy §4.4, `mockup/partials/` |
| `organization.ts` | Organization and WebSite schema facts: name, legal name, `sameAs` (founder-confirmed list), contact point, founders' names; **no** `memberOf` until F11 proof (D038) | [facts](../product/facts.md) |
| `products/kheelu/product.ts` | Product facts: specs rows, in the box, safety rows, declarations (MRP from `MRP_PRICE`, origin, manufacturer, consumer care), languages with `lang` codes, modes, schema fields (`@id` `…/products/lumi#product`, `alternateName` Lumi, ages 3-7) | [facts](../product/facts.md), D034, D036 |
| `products/kheelu/page.ts` | The product page's sections | [meet-kheelu copy](../site/pages/meet-kheelu.md) |
| `films.ts` | The seven films: id, chip, caption, duration, poster, video URL, alt, loading | [D040](../decisions/D040-films-move-to-new-site.md) |
| `faqs.ts` | Every FAQ item once, by id; pages reference ids, so the same answer never exists twice | page copy |
| `pages/<slug>.ts` | One per marketing page: meta (title, description per mode, OG image and alt), sections | `site/pages/<slug>.md` |
| `stories/topics.ts`, `stories/hub.ts`, `stories/articles/<slug>.ts` | Topic groups and the hub as **slug lists only**; one module per article with its blocks, sources, `related` slugs (three, so every article keeps three incoming links), `card` (title and summary the hub shows), and stored `published` and `updated` dates (written from git history when the article changes, never computed at build: Vercel's clone may be shallow) | stories copy |
| `legal/<slug>.ts` | Privacy, terms, refund, shipping: summary, contents, parts, sections; `status: draft \| approved`; `approvedOn` | legal copy; founder approval (D029) |
| `store/*.ts` | Store page, confirmation, event and partner pages, in-app note (with `enabled`, false until QA's in-app check, N7) | store copy |
| `routes.ts` | The URL plan: every indexable route, its content module, sitemap priority, nav and footer membership | [url map](../site/url-map.md), strategy §4 |

Shapes live in `src/content/types.ts`; each module ends with `satisfies <Type>`.

### 6.2 Rich text, tokens and placeholders

One inline syntax for every content string, parsed by `ui/RichText` and serialised to plain text by
`lib/content/plain-text.ts` (JSON-LD, meta, `llms.txt`):

| Token | Renders | Example |
|---|---|---|
| `{hand:…}` | `<span class="kh-hand">` (one per headline, DS rule) | `Then it {hand:asks one back.}` |
| `{mark:…}` | `<span class="kh-mark">` | `{mark:Conversation} helps a young brain grow.` |
| `{nowrap:…}` | `<span class="ks-nowrap">` | `{nowrap:call +91 91875 46483}` |
| `[label](href)` | link (internal `next/link`, external `<a>`) | |
| `[^1]` | `SourceMarker` to the section's sources | |
| `{price:token}`, `{price:balance}`, `{price:headline}`, `{price:full}`, `{price:mrp}` | the amount from the offer | `Kheelu is {price:headline} (incl. GST)` |
| `{delivery}` | `DELIVERY_TEXT` | |
| `{ph:ID note}` | `Placeholder`: `[PLACEHOLDER ID: note]` | `{ph:F4 size and weight}` |

The placeholder guard (`scripts/guards/placeholders.mjs`, task 2.9) fails the build when
`resolveSiteEnv(process.env)` is `production` and any `{ph:`, `placeholder(`, `[PLACEHOLDER` or
`status: "draft"` remains in `src/` (the two files that define them, `src/lib/content/placeholder.ts` and
`src/content/types.ts`, are excluded), then scans the prerendered HTML after `next build`. On beta and
development it prints the count and the list, so the founder sees every open fact in place. Proof-gated
items (founder bios, recognition: D038, F11) are `gated` and never render until the proof is filed.

Today's open facts the guard will hold back (from the copy pages): product specs F4 (size, weight,
materials, battery, charger and its BIS number, net quantity, manufacture date, age grading and
warnings), the parent app's supported phones, the order-data location (D047), privacy details (provider
names, retention of recordings, opt-out mechanics, security practices, breach notice), complaint reference
mechanics, GST documents and price breakup, legal approval dates, setup facts (wake-up button position,
charger, app store links C6), founder photos (B24).

### 6.3 Copy precedence and the boundary

Builders take visible text from the approved mockup page and everything else (full-mode variants, meta,
alt text, schema) from the copy page; a founder decision after Gate A overrides both; a conflict is
reported, never resolved silently. `src/content/**` is EXTERNAL only
([content boundary](../site/content-boundary.md)); ESLint bars imports from `wiki/`, `mockup/` and DS
markdown; the banned-phrases guard covers leakage.

## 7. The offer and the live mode

Decision: [ADR-005](adr/ADR-005-offer-follows-live-mode.md).

- `lib/offer/get-offer.ts`: `unstable_cache(() => preorderMode(storeEnv()), ["offer-mode"], { revalidate: 300, tags: ["offer"] })`;
  no store env → `token`; errors → `token` (as `mode.ts`). Cache Components stay off (`next.config.ts`
  has no `cacheComponents`, guarded), because the store relies on `force-dynamic` and route-segment
  `revalidate`, and the empty campaign route needs an empty `generateStaticParams`, which Cache Components
  refuse (Next `generate-static-params.md:310`).
- `lib/offer/offer.ts`: the view model (`mode`, `headlinePaise`, formatted amounts, `mrp`, the sentence
  and sticky lines from `content/en-IN/offer.ts`, `availabilityStarts`).
- Pages that show a price export `revalidate = 300`; the store keeps `force-dynamic` and its own mode read.
- In full mode: price sentence "₹7,999 (incl. GST), paid in full when you order."; the offer card hides
  the split; the sticky bar shows "₹7,999" and "incl. GST"; JSON-LD price 7999; `ViewContent` value 7999.
- **Staleness bound (N14):** a page regenerates on the first request after its 300 s window and serves the
  stale copy to that request, and the cached mode inside can itself be up to 300 s old, so a quiet page
  can show token text for about ten minutes, longer if nobody visits. No wrong charge is possible (the
  store decides per request and refuses a stale token order with "refresh" words). The sell-out runbook
  therefore ends with the founder clicking **Redeploy** in Vercel once `/api/health` shows `full`, which
  rebuilds every page in minutes with no code change.
- Acceptance: the route manifest of `next build` shows marketing pages as static with revalidation.

## 8. Tracking module and event registry

Decision: [ADR-006](adr/ADR-006-tracking-module-and-registry.md). IDs and parameters are owned by the
[tracking inventory](../site/tracking-inventory.md); this section assigns them to code.

### 8.1 Files

| File | Role | Change |
|---|---|---|
| `src/lib/tracking/destinations.ts` | The 17 destinations of the inventory (§8.2) | New |
| `src/lib/tracking/events.ts` | Event registry (data) | New |
| `src/lib/tracking/cta.ts` | CTA value registry and the `CtaId` type | New |
| `src/lib/tracking/track.ts` | Dispatcher for **new** events: GA4 `window.gtag?.("event", …)`, Meta `fbTrack`, PostHog `phCapture` per the registry | New |
| `src/lib/tracking/internal-flag.ts` | `?internal=1` / `?internal=0` → PostHog `register({ internal: true })` / `unregister("internal")` (B46) | New |
| `src/features/preorder/lib/analytics.ts`, `src/lib/fbq.ts`, `src/lib/posthog.ts`, `src/lib/campaign.ts`, `src/lib/click-id.ts`, `src/proxy.ts`, `src/lib/store/{meta-capi,fulfil}.ts` | The proven funnel, cookies, server events | Frozen, byte-identical |
| `src/components/tracking/GoogleAnalyticsGate.tsx`, `MetaPixel.tsx` | Gates | Moved from `components/molecules/` (2.6), bodies unchanged |
| `src/components/tracking/PostHogGate.tsx` | Gate | Moved; on beta hosts adds only `before_send` stamping `env: "beta"` (no `register`, N3) and the internal flag; production init options equal the tag's (fixture test) |
| `src/components/tracking/ViewContentTracker.tsx` | Meta `ViewContent` on mount | Moved; `valuePaise` from the page (offer); mounted on `/` and `/products/kheelu` |
| `src/lib/store/posthog-server.ts`, `src/lib/store/env.ts` | Server events | D048 diffs only (§15.3) |

### 8.2 Destinations and event registry

**Destinations** (`destinations.ts`, one row per row of the inventory's "At a glance" table; the
registry test fails if a row is missing, N2):

| # | Destination | ID | Kind | Gate | Events in this registry |
|---|---|---|---|---|---|
| 1 | Vercel Web Analytics | Vercel project | browser | none (reports only from a Vercel deployment) | automatic pageviews only |
| 2 | Ahrefs Web Analytics | `N7vd/jLtIIlHqzFqu57UBg` | browser | none on production (on purpose); absent on beta (§15.3) | automatic pageviews only |
| 3 | Google Analytics 4 | `G-7LMKSFEXZ9` | browser | `GA4_HOSTS` | `page_view` and the funnel below |
| 4 | Meta Pixel | `1051265191046395` | browser | `META_PIXEL_HOSTS` | `PageView`, `ViewContent`, `InitiateCheckout`, `Purchase` |
| 5 | Meta Conversions API | same pixel, Graph `v21.0` | server | token present (absent on beta) | `Purchase` |
| 6 | PostHog browser | project `617632` | browser | `POSTHOG_HOSTS` | SDK events and the funnel below |
| 7 | PostHog server | same project | server | none | `purchase_confirmed` |
| 8 | PostHog reverse proxy | `/ingest`, `/ingest-assets` | proxy | n/a | carries 6 |
| 9 | PostHog ← Meta Ads warehouse sync | ad account `1195520716116929` | dashboard | n/a | none (not in code) |
| 10 | Edge attribution cookies | `kh_utm`, `kh_fbclid` | cookie | `.kheelona.com` | none (set by `proxy.ts`) |
| 11 | Razorpay Checkout and webhooks | webhook URL | server | n/a | none (payments) |
| 12 | Resend | n/a | server | n/a | none (emails) |
| 13 | Google Search Console | `sc-domain:kheelona.com` | dns | n/a | none |
| 14 | Bing Webmaster Tools | unknown | none | n/a | none |
| 15 | Meta domain verification | DNS TXT | dns | n/a | none |
| 16 | Merchant Center, feeds, Google Ads, other pixels | none found | none | n/a | none |
| 17 | `/.well-known/*` and verification files | none exist | none | n/a | none |

**Events:**

| Event | Destinations | Parameters (unchanged) | Fired by | Status |
|---|---|---|---|---|
| pageview | Vercel WA, Ahrefs | automatic | their scripts in the root layout | Existing |
| `page_view` | GA4 (config) | automatic | `GoogleAnalyticsGate` | Existing |
| `PageView` | Meta | none; one per load, one per client route change | `MetaPixel` | Existing |
| `ViewContent` | Meta | `content_name: "Kheelu"`, `content_ids: ["lumi"]`, `content_type: "product"`, `value` (offer headline, 4999 in token mode), `currency: "INR"` | `ViewContentTracker` on `/products/kheelu`; **also `/` (B9, new placement, same payload)** | Existing (+ Home) |
| `preorder_form_started` | GA4, PostHog | `tier` | `analytics.ts` | Existing, frozen |
| `preorder_start` | GA4, PostHog | `tier` | `analytics.ts` | Existing, frozen |
| `begin_checkout` / `InitiateCheckout` | GA4, PostHog / Meta | `currency`, `value` (rupees), `tier` / `content_category` | `analytics.ts` | Existing, frozen |
| `purchase` / `Purchase` | GA4, PostHog / Meta (eventID `purchase_<ref>`) | `transaction_id`, `currency`, `value`, `tier` / `order_id`, `content_category` | `analytics.ts` | Existing, frozen |
| `preorder_address_saved` | GA4, PostHog | `transaction_id` | `analytics.ts` | Existing, frozen |
| `preorder_dismissed` | GA4, PostHog | `tier` | `analytics.ts` | Existing, frozen |
| `Purchase` (CAPI) | Meta server | as inventory §5 | `meta-capi.ts` via `notifyPaid` | Existing, frozen; off on beta |
| `purchase_confirmed` | PostHog server | as inventory §7 (+ `env: SITE_ENV` on every non-production build) | `posthog-server.ts` via `notifyPaid` | Existing |
| `$pageview`, `$pageleave`, `$autocapture`, `$exception`, `$web_vitals`, replay | PostHog | SDK; `cta` promoted from `data-ph-capture-attribute-cta` | `PostHogGate` | Existing |
| `preorder_payment_window_opened` | GA4, PostHog | `tier` | right after `checkout.open()` in `checkout.ts` (line 97 at the tag) | **New (B11), task 6.2, gated** |
| `preorder_payment_failed` | GA4, PostHog | `tier`, `reason_code`, `reason` (Razorpay `error.code`, `error.reason`; no free text) | `checkout.on("payment.failed", …)` before `open()` | **New (B11), task 6.2, gated** |
| `preorder_form_rejected` | GA4, PostHog | `tier`, `fields` (comma-joined field names, no values) | `PreorderForm` submit when validation fails | **New (B11), task 6.2, gated** |

No event fires Meta for the three new names: Meta receives only its fixed conversion events.

### 8.3 CTA values (`data-ph-capture-attribute-cta`), reconciled from the mockups

| Value | Status | Element | Pages |
|---|---|---|---|
| `hero` | Existing | Home hero button (`id="hero-cta"`, arrow) | `/` |
| `navbar` | Existing | Laptop nav button (shown from 1024 px; G-06, D041) | every marketing page |
| `navbar-mobile` | Existing | Drawer button | every marketing page |
| `finale` | Existing | Close button | `/`, `/safety`, `/ai-toys-for-kids-in-india`, `/stories`, articles with a close, `/team`, `/contact`, 404 |
| `product-top` | Existing | Product hero button (no `id`, arrow) | `/products/kheelu` |
| `product-foot` | Existing | Product close button | `/products/kheelu` |
| `home-arc`, `compare` | Existing, **reserved** | No equivalent button (A16); never reused | none |
| `sticky-bar` | New (the mid version's name) | Phone sticky bar | pages with the bar: `/`, `/products/kheelu`, `/safety`, `/ai-toys-for-kids-in-india`, `/stories`, articles with a close, `/team`, `/contact` |
| `see-it-ask` | New | Home belief-fold button | `/` |
| `safety` | New | Home safety-fold button | `/` |
| `product-offer` | New | Product offer-card button | `/products/kheelu` |
| `product-safety` | New | Product safety-fold button | `/products/kheelu` |
| `hero-learn`, `see-it-ask-learn`, `safety-learn`, `compare-learn`, `faq-more` | New, secondary | Home ghost and secondary links | `/` |
| `product-safety-learn` | New, secondary | Product safety secondary link | `/products/kheelu` |
| `refund-learn`, `shipping-learn` | New, secondary | "Meet Kheelu" close links | `/refund`, `/shipping` |
| `whatsapp-float` | New (D050) | The WhatsApp bubble (not a chilli button) | every page (with `ph-no-capture` on `/thanks`) |

Not tagged (as live or as the copy says): the store's pay button, contact buttons, film play buttons
(their `aria-label`s carry the "Play:" measure, D040), `/privacy` and `/terms` closes.
`test/guards/cta-registry.test.ts` checks the registry (the eight existing values byte for byte; `Button`
refuses a `cta` variant without a `CtaId`); `test/e2e/cta.spec.ts` loads every page and asserts that every
chilli button carries a registered value and that the set of values found equals the registry's live set
for that page.

### 8.4 Rules

- Consent: unchanged; no banner at launch ([D042](../decisions/D042-policy-display-answers.md)); a
  consent gate before 13 May 2027 plugs into the gates and the dispatcher (§17).
- `/privacy` changes in the same commit as any tracking change. `test/analytics-tags.test.ts` keeps
  guarding the pairing: its layout and payload assertions stay; task 5.11 re-pins its wording assertions
  to the approved privacy text in the same commit as the privacy content ([tasks 5.11](tasks.md#wave-5-pages-after-wave-4-all-parallel)).
- CSP: no new third-party origin (`wa.me` is a link, not a fetch); the policy and its Report-Only phase
  stay (`src/lib/security-headers.ts`, frozen).
- Replay deny list and `ph-no-capture ph-mask` on the `/thanks` order container stay; the bubble carries
  `ph-no-capture` on `/thanks`.
- Parity proof for QA: inventory checklist rows 0-27, plus `test/guards/tracking-freeze.test.ts`,
  `tracking-parity.test.ts`, `posthog-init-fixture.test.ts`, `tracking-registry.test.ts`, and the probes of
  the [test plan §5](../qa/test-plan.md#5-tracking-parity-evidence-94-blocks-launch).

## 9. SEO, AEO and GEO infrastructure

Decision: [ADR-012](adr/ADR-012-seo-urls-and-schema.md).

### 9.1 Metadata

`lib/seo/metadata.ts` `pageMeta({ title, description, path, og, article? })` returns title
(`{ absolute }`), description (mode-resolved), `alternates.canonical`, the complete `openGraph` (type,
url, title, description, siteName "Kheelona", locale `en_IN`, image) and `twitter`
(`summary_large_image`), and **never a `robots` key**: Next merges metadata key by key, so a page-level
`robots` would replace the root's beta noindex (N15; unit-tested). Root layout: `lang="en-IN"`,
`metadataBase` = `CANONICAL_ORIGIN`, and `robots: noindex, nofollow` only when `SITE_ENV === "beta"`.
Guards: titles ≤ 60 characters, descriptions ≤ 155, both unique across routes, one `h1` per page,
heading order. On beta, `og:image` resolves against the production origin (accepted, N8: a shared beta
link may preview the old image).

### 9.2 Structured data per page type

| Page | Nodes (besides Organization and WebSite from the shell) |
|---|---|
| `/` | FAQPage (the six Home answers); the Product node lives on the product page only |
| `/products/kheelu` | Product + Offer (+ return policy, shipping details, warranty), FAQPage |
| `/safety`, `/ai-toys-for-kids-in-india` | FAQPage |
| `/stories/<slug>` | BlogPosting (headline, description, image, `datePublished`, `dateModified` from the module's stored dates, author, publisher), BreadcrumbList (visible crumbs) |
| `/setup` | HowTo (from the same steps) |
| `/team`, `/contact`, legal pages, `/stories` | none beyond the shell |

Product fields: `@id` `https://kheelona.com/products/lumi#product` (never changes, lessons §6), `name`
"Kheelu by Kheelona", `alternateName` "Lumi", `brand` Kheelona, `manufacturer` the Organization,
`countryOfOrigin` IN, `audience` `suggestedMinAge` 3 and `suggestedMaxAge` 7, `image` (stable `/media/`
URLs), `additionalProperty` from announced specs only (placeholders absent), `offers`: `price` (offer
headline: 4999 or 7999), `priceCurrency` INR, `availability` PreOrder, `availabilityStarts` 2026-11-15,
`eligibleRegion` IN, no `priceValidUntil`, `hasMerchantReturnPolicy` (7 days from delivery, `FullRefund`,
free return pickup), `shippingDetails` (rate 0 INR, destination IN; no delivery-time claim, D022), warranty
6 months. Offer description leads with ₹4,999 (D028). All rendered from content and policy constants;
`test/guards/jsonld-matches-page.test.ts` checks that every FAQ answer, price and policy number in JSON-LD
appears in the visible text of the same page.

### 9.3 Machine files

- `robots.ts`: `*` allow; GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot,
  Claude-User, Claude-SearchBot, Google-Extended, Applebot-Extended, CCBot allow; **Bytespider disallow
  `/`** (D041); sitemap `https://kheelona.com/sitemap.xml`.
- `sitemap.ts`: from `content/routes.ts`; canonical 200 URLs only (no `/playos`, no 2-year-old article);
  `lastModified` only from real dates (the articles' stored dates; a marketing page joins when its module
  carries one).
- `llms.txt` and `pricing.md`: rebuilt from content; entity facts identical to the pages (Kheelu by
  Kheelona, ages 3 to 7, ₹4,999 incl. GST first, made in India by Kheelona Robotics, the rename note,
  support "WhatsApp or call"); no `/playos`; no banned lines; `LLMS_UPDATED` and `PRICING_UPDATED` bumped
  with content.

### 9.4 URLs and redirects

| Change | Rule | Source |
|---|---|---|
| `/playos` | 308 → `/products/kheelu` (from wave 1; the page file is deleted in 6.3) | D041 |
| `/stories/brain-development-toys-for-a-2-year-old` | 308 → `/stories/learning-toys-for-a-three-year-old` | D041 |
| `/kheelu`, `/products` | 308 → `/products/kheelu` | strategy §4.2; url-map §4d |
| `/careers`, `/jobs` | 308 → `/team` | strategy §4.2; url-map §4d (`/jobs` 2 landings) |
| `/pricing` | 308 → `/products/kheelu#offer` | url-map §4d |
| The 24 existing rules | unchanged | url-map §4b |
| `www.kheelona.com/*` | host-matched twins of every rule, absolute apex destinations, then a catch-all; one hop once the founder switches `www` to serve the project | url-map §4c |
| `/faq` | stays → `/products/kheelu#faq`; the product page keeps `#faq`, `#story-mode`, `#reserve`, `#offer` | url-map §4b, `docs/utm-conventions.md` |

Next emits 308 for `permanent: true`, the permanent equivalent of the brief's 301 (url-map §4). Rules keep
the `[^.]+` guard where a source could shadow `public/` (`test/redirects-vs-assets.test.ts`).
`test/guards/redirect-hops.test.ts` simulates every legacy family on both hosts and asserts one hop. The 404
page renders on the server (root `not-found.tsx`), answers 404 with noindex, and never relies on a thrown
`notFound()` in a dynamic route (`dynamicParams = false`, lessons §1).

### 9.5 Answer engines

Answer-first blocks (question heading, 40-60 word answer, then detail) are content shapes (the answer
block of `HeroSection` variant `answer`, `AnswerSection`, and FAQ items), checked by
`test/guards/answer-length.test.ts`. All primary content is server HTML; `test/e2e/no-js.spec.ts` loads
each page with JavaScript disabled and checks text parity (except interactive extras; doodles stay drawn
and the details panels stay visible without JavaScript).

## 10. Media pipeline

Decision: [ADR-010](adr/ADR-010-media-pipeline.md). Catalogue: [assets](assets.md).

- DS rasters via `import x from "@ds/assets/…"` and `next/image` inside `Photo`, `ArtBoard`,
  `ImaginationFrame`, `AppScreens` only; `sizes` per layout. **No `priority` prop** (deprecated in Next
  16 in favour of `preload`; the docs prefer `loading="eager"` or `fetchPriority="high"`, `image.md:289-293`,
  N12): a page's one LCP image takes `loading="eager"` and `fetchPriority="high"`; everything below the
  first phone screen lazy-loads.
- Doodles: `scripts/assets/build-doodles.mjs` (task 1.5) reads the 11 DS doodles the pages use and writes
  `src/assets/doodles.generated.tsx`: inline SVG components with `aria-hidden="true"`, `focusable="false"`,
  class `ks-doodle`, `pathLength="1"` on every stroked path, filled shapes marked `ks-doodle__fill`, DS
  paths and colours verbatim, and the per-file grain filter replaced by one shared `#ks-chalk` filter
  rendered once by `ui/Doodle/DoodleDefs` (every DS doodle carries the same `feTurbulence` filter with the
  same id, which would otherwise repeat on a page). `ui/Doodle` renders the plain `<img>` of the DS file in
  heroes (still, pick 2) and the inline component below the first screen (draws, pick 3). The grain filter
  stays on during the draw (fidelity); the performance trace decides (no frame over 50 ms at CPU 4x, test
  plan §4.7); the fallback, if it fails, applies the filter only once the draw ends.
- Other DS SVGs (shapes, logo) as plain `<img>` from static imports, decorative ones `alt=""`.
- Icons generated into `src/assets/icons.generated.ts`.
- Fonts generated into `public/fonts/` and `src/styles/generated/fonts.css` (licence check first);
  **three preloads**, the faces every hero uses: Nunito Latin, Baloo 2 Latin, and the Kalam face of
  `kh-hand` (Latin), because almost every approved h1 carries a Kalam accent and a late swap could re-wrap
  the h1 and move the CTA (N17); together ≤ 130 KB. If QA's delayed-font run still shows CLS over 0.1,
  generated fallback `@font-face` metrics are the next step.
- OG and stable machine images generated into `public/og.png`, `public/og/`, `public/media/`,
  `public/brand/logo-mark.png`; app icons into `src/app/icon.png`, `src/app/apple-icon.png`.
- Films unchanged at `public/video/moments/*.mp4` (2.0-3.9 MB each); posters through `next/image`; the
  first three on Home eager as in the mockup but `fetchPriority="low"` so they never compete with the LCP
  image (N19), the rest lazy; `<video>` only on play, `preload="none"`, native controls, `playsinline`, one
  at a time, paused when scrolled away, poster restored on end.
- App screenshots: final files in `src/assets/app/` (the D044 round-2 edits happen first, task 1.5b).
- `test/guards/asset-dupes.test.ts` hashes every file in `public/` and `src/assets/` and fails on
  duplicates or on any byte-copy of a DS file outside the generated folders.

## 11. Motion

Decision: [ADR-007](adr/ADR-007-motion-css-first.md) (with its D049 addendum). Sources: the Gate A spec
(`mockup/APPROVAL.md` §6, D041 G4) and the founder's picks (D049, the latest decision, which wins where
they differ). The main session records the result in [design-system/motion](../design-system/motion.md).

### 11.1 Approach

CSS presets on DS tokens in `src/motion/motion.css` (task 1.2) and one `IntersectionObserver`
(`ui/MotionController`, task 2.8) for reveals and doodle draws; the sticky bar, drawer, films strip and
WhatsApp bubble carry their own few lines. The `motion` library is not used (ADR-007).

### 11.2 What moves (D041 G4 and D049)

| # | Place and pick | Implementation | Tokens | Reduced motion | Owner |
|---|---|---|---|---|---|
| 1 | Sections on scroll: **A fade and rise** | `[data-reveal]`: `opacity 0; translateY(var(--space-4))` only under `html.js-motion`; `.is-in` → none; once; anything in view at load is marked `is-in` before `js-motion` is added | `--duration-enter`, `--ease-standard` | visible at once | 1.2, 2.8 |
| 1b | Stickers settling inside a revealed block (Gate A spec) | transform transition when the block becomes `is-in` | `--duration-enter`, `--ease-bounce` | none | 1.2 |
| 2 | Hero picture: **A still** | nothing: the hero section, h1, price sentence and CTA have no entrance motion; hero doodles are plain `<img>` | none | same | 3.3, 2.3 |
| 3 | Doodles: **B draw themselves** (below the first screen only) | `.ks-doodle[data-draw] path[pathLength]` `stroke-dasharray: 1`; under `html.js-motion` `stroke-dashoffset: 1` until `.is-in`, then `@keyframes ks-draw` 1 → 0 once; `ks-doodle__fill` shapes fade in at the end; `[data-draw-order="2".."5"]` delay `calc(var(--duration-base) * 2 * (n - 1))` (400 ms steps, inside D049's 300-600 ms); without JavaScript the doodle is drawn | `--duration-draw`, `--ease-standard`, `--duration-fast` | drawn at once | 1.5, 2.3, 2.8 |
| 4 | Phone buy bar: **A slide up** | `.kh-buybar.is-hidden` ↔ shown: opacity and `translateY(100%)`, once; afterwards it only steps aside (G-09) | `--duration-base`, `--ease-standard` | fades without moving | 3.1 |
| 5 | Phone menu: **A slide from the side** | native `<dialog>` `showModal()`; panel keyframe from `translateX(100%)`; DS scrim on `::backdrop` fades | `--duration-enter`, `--ease-standard` | appears without sliding | 3.1 |
| 6 | Orange button: **B press and arrow nudge** | `@media (hover: hover) and (pointer: fine)`: `.kh-btn--cta:hover .ks-btn__arrow { transform: translateX(var(--ks-nudge)) }`, `--ks-nudge: 5px` (the value D049 names, one literal); press is the DS's own `:active` (`translateY(4px)`, shadow removed). Applies to every chilli button with an arrow (Home hero, product hero, the guide, safety, stories and article closes): hover and press are feedback the visitor starts, not arrival motion, so pick 2 is not affected (question to the main session) | `--duration-fast`, `--ease-standard` | no nudge (the DS press stays: it is the tap state, not an animation) | 2.2 |
| 7 | FAQ answers: **B smooth open** | native `<details>`; `@supports selector(::details-content)`: `.kh-faq__item::details-content { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--duration-enter) var(--ease-standard), content-visibility var(--duration-enter) allow-discrete }`, `[open]` → `1fr`; the answer sits in `ks-faq__clip` (`overflow: hidden; min-height: 0`) so the DS padding does not leak; `.kh-faq__sign` gets a transform transition (the DS rotates it 45° when open, with no transition). Where `::details-content` is unsupported (older iOS Safari), the answer opens instantly, the 7A behaviour | `--duration-enter`, `--ease-standard` | instant | 2.4 |
| 8 | Parent films strip: **B focus grows** | native scroll-snap; one `IntersectionObserver` per strip with the track as root and a `rootMargin` that narrows it to its central band; the tile most inside the band gets `is-focus`; `.ks-film.is-focus .ks-film__frame { transform: scale(var(--ks-film-focus)) }`, `--ks-film-focus: 1.05` (one value inside D049's 1.04-1.1); the track has `padding-block: var(--space-3); margin-block: calc(var(--space-3) * -1)` so a scaled tile is not clipped and the layout box does not change; end detection tolerates half a tile; nothing overflows the document (lessons §2) | `--duration-base`, `--ease-standard` | no scale | 3.3 |
| D050 | WhatsApp bubble | lift with the bar (`translateY(calc(var(--ks-buybar-h) * -1))` while `html[data-buybar="shown"]`); laptop label slides out on hover or focus (opacity and transform) | `--duration-base`, `--ease-standard` | nothing moves | 3.1 |
| – | Tap feedback | the DS's own button, icon-button and focus transitions (`bundle.css`) | `--duration-fast`, `--duration-base` | DS | – |
| – | Films buttons | scroll by one tile, smooth unless reduced motion | none | instant scroll | 3.3 |

**Never animated on arrival or scroll:** the hero section, any `h1`, the price sentence, any chilli button,
the offer card and the store form (`test/guards/no-reveal-on-money.test.tsx`). Nothing loops; nothing
moves for more than five seconds; nothing flashes; no scroll-jacking.

### 11.3 Class contract between motion.css and components

`motion.css` (1.2) is written before the components exist, so the hooks are fixed here:

| Hook | Set by | Meaning |
|---|---|---|
| `html.js-motion` | `MotionController` | motion is armed (absent without JavaScript or with reduced motion) |
| `[data-reveal]`, `.is-in` | page content; `MotionController` | a block that reveals once |
| `.ks-doodle[data-draw]`, `[data-draw-order="1".."5"]`, `.ks-doodle__fill` | `Doodle` (generated SVG) | a doodle that draws once, and its order |
| `.ks-btn__arrow` | `Button` (`arrow`) | the arrow that nudges |
| `.ks-faq__clip`, `.kh-faq__item::details-content`, `.kh-faq__sign` | `FaqList` | the FAQ open animation |
| `.ks-film`, `.ks-film__frame`, `.is-focus` | `FilmsStrip` | the film in focus |
| `.kh-buybar.is-hidden`, `html[data-buybar="shown" \| "aside" \| "hidden"]`, `--ks-buybar-h` | `StickyBuyBar` | bar state and height, read by the bubble |
| `dialog.kh-drawer[open]` | `NavDrawer` | drawer panel and scrim |
| `.ks-wa`, `.ks-wa__label`, `body.ks-has-float` | `WhatsAppFloat`, shells | bubble, label and clearance |

### 11.4 Exceptions and guards

- **Two founder-approved exceptions** to brief §9.11's "transform and opacity only" (D049):
  `stroke-dashoffset` (pick 3, only in `.ks-doodle` rules) and `grid-template-rows` with a discrete
  `content-visibility` transition (pick 7, only in `.kh-faq__item::details-content` rules). The DS button's
  hover `filter` is the DS's own and paint-only.
- `test/guards/motion-properties.test.ts` (1.2) fails on any other animated property, any non-token
  duration or easing, any infinite iteration, and any animation not neutralised under
  `prefers-reduced-motion: reduce`; `test/guards/token-exceptions.ts` allows exactly the two D049 literals.
- One Playwright spec per pick, owned by the task that builds the behaviour and run on its stories from
  wave 2 (`motion-reveal` 2.8, `motion-doodle` 2.3, `motion-button` 2.2, `motion-faq` 2.4, `motion-hero` and
  `motion-films` 3.3, the bar, drawer and bubble cases in `chrome.spec.ts` 3.1), each with reduced motion on
  and off (test plan §4.7); `test/e2e/motion.spec.ts` (1.1) sweeps every built route (nothing running after
  6 s, heroes still, reduced motion leaves nothing running).

## 12. Performance budget (phones first)

Measured on a local production build with Playwright at 390 x 844, CPU 4x and a 4G profile
(`test/e2e/perf-budget.spec.ts` counts **transferred bytes per resource type**, not attributes, lessons §2),
and by Lighthouse mobile (median of 3).

| Budget | Marketing pages | Store |
|---|---|---|
| HTML document (gzip, N16) | ≤ 60 KB per route (the approved mockup's built Home is 14.8 KB gzip and the product page 15.6 KB; the App Router inlines the server-component payload, roughly doubling text, plus inline doodles and JSON-LD) | ≤ 45 KB |
| First-load JavaScript (gzip), excluding the post-hydration tags | ≤ 130 KB total; ≤ 25 KB route-specific beyond the shared framework chunks | ≤ 150 KB |
| CSS (gzip) | ≤ 35 KB | ≤ 35 KB |
| Fonts on first view | ≤ 130 KB, three preloads (§10) | same |
| Images above the fold at 390 px | ≤ 250 KB; LCP image ≤ 200 KB (DS hero budget, `06-surfaces.md:29`) | ≤ 120 KB |
| Images on first load in total (lazy excluded) | ≤ 400 KB | ≤ 200 KB |
| Films | never preloaded; ≤ 4 MB each on play; posters ≤ 40 KB each at tile size | after the form only |
| Lighthouse mobile | ≥ 90 Performance, Accessibility, Best Practices, SEO; aim 95 | same, with the pre-approved exceptions |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (lab before launch, PostHog field after) | TTFB ≤ 800 ms from India |

**Which Lighthouse run counts (N18):** beta is noindex (SEO's crawlability audit fails by design) and has no
GA4, Meta or Ahrefs, so it reads better than production. Authoritative runs: Performance and Best Practices
from the **LP-tags** profile (a local production build served under the real hostnames, tags allowed to
load, only their beacons blocked), then production after the deploy; SEO from LP-tags; Accessibility from
any. Beta runs are recorded but do not decide. Pre-approved exceptions (working default B10): Best
Practices about 74 on production (the Meta pixel's third-party cookie); store SEO about 66 (noindex on
purpose). Third-party tags load after hydration on production hosts only (GA4 and Meta
`afterInteractive`, PostHog by dynamic import), as today.

**TTFB and region:** `x-vercel-id` on marketing and store responses names the function region (`bom1`);
QA records `curl -w` timings from its network with the location; the founder runs the same one-line
command from an Indian network on beta and on production (test plan §4.4).

## 13. Accessibility (WCAG 2.2 AA)

- axe (WCAG 2.0, 2.1, 2.2 A and AA plus best practice) on every route at 360, 390, 1440 and 1920
  (templates also at 412), reveals forced, doodles drawn and reduced motion on, plus the states of test
  plan §4.5 (drawer open, FAQ open, a film playing, store form with errors): zero critical or serious,
  except the **D041 accepted exception** (white on Chilli on `.kh-btn--cta`), classified by selector and
  printed separately every run, never switched off.
- **White on Kheelu Blue** (the confirmation's "Save my address" button, `kh-btn--primary`; blue stickers
  and the primary icon button) fails the same way (G-02) but D041 names only Chilli. It is reported apart
  and **put to the founder** (questions). The WhatsApp bubble's white glyph on green is below 3:1 and
  accepted with the D050 brand exception; the link has a text name.
- Tap targets ≥ 44 px (the mockup's `::before` tap extensions on trust links, help links, source markers and
  footer links are ported); nothing scrolls sideways on the audit's viewport matrix (test plan §3: 320 to
  412 on phones, 1280 to 1920 on laptops, including the short 1536 x 730 and 1280 x 600 screens and 402 x
  714, N23), checked as `scrollWidth > clientWidth` (lessons §2); keyboard: skip link, drawer focus inside
  the dialog and Escape, FAQ with Enter or Space, films buttons, the bubble reachable after the page
  content, visible DS focus ring; forms keep labels, hints by `aria-describedby`, inputs ≥ 16 px, the right
  `type`, `inputMode` and `autocomplete`; language chips carry `lang` (G-13); films have burned-in captions
  and no `<video>` at rest; decorative art `alt=""` and doodles `aria-hidden`.

## 14. Guardrails (tests and scripts)

Decision: [ADR-011](adr/ADR-011-guardrails-and-qa-harness.md). Every guard is proven red with a planted
violation before it is trusted, exits non-zero on failure, and prints accepted exceptions. Owners per task:
[tasks](tasks.md); owners of the existing tests per wave: [guard-test ownership](tasks.md#guard-test-ownership).

| Guard | File | Runs in |
|---|---|---|
| DS checksums (643 files) | `scripts/ds-checksums.mjs` (exists), via `scripts/steps/prebuild/10-ds-checksums.mjs` | `verify`, production prebuild |
| Placeholders and draft legal docs | `scripts/guards/placeholders.mjs` (prebuild step 30, postbuild step 10) | `verify` (report), production prebuild and postbuild (fail) |
| Banned words and claims, en-IN spelling | `test/guards/banned-phrases.test.ts` + `banned-phrases.data.ts` (each entry cites its [claims §4](../product/claims.md#4-retired-or-banned-wording) row; green on every approved page by construction) | `verify` |
| Age band, internal material, mockup-only markup in rendered HTML | `test/e2e/content-integrity.spec.ts`; `test/guards/mockup-markup.test.ts` (source) | `verify:e2e`, `verify` |
| Off-token values, arbitrary Tailwind, inline styles | `test/guards/no-off-token.test.ts` with `token-exceptions.ts` | `verify` |
| Motion properties and reduced motion | `test/guards/motion-properties.test.ts`, `test/e2e/motion.spec.ts` (page sweep) and `test/e2e/motion-*.spec.ts` (one per pick, on stories), `test/guards/no-reveal-on-money.test.tsx` | `verify`, `verify:e2e` |
| Tailwind theme equals DS; CSS order | `test/guards/tailwind-theme.test.ts`, `test/guards/visual-layer.test.ts` | `verify` |
| Generated files up to date | `test/guards/{generated-css,generated-icons,generated-doodles}.test.ts` | `verify` |
| Checkout: byte freeze (incl. the six checkout tests, literal-only patches), logic signatures, JSX contract | `test/guards/checkout-freeze.test.ts`, `checkout-signature.test.ts`, `checkout-jsx-contract.test.tsx` | `verify` |
| Tracking: freeze, parity, PostHog init fixture, registries, CTA values | `test/guards/{tracking-freeze,tracking-parity,posthog-init-fixture,tracking-registry,cta-registry}.test.ts` | `verify` |
| Environment and config | `test/env.test.ts`, `test/store-env-beta.test.ts`, `test/guards/next-config.test.ts` (beta noindex header, no `cacheComponents`), `test/guards/build-steps.test.ts` | `verify` |
| Existing repo guards kept | `analytics-tags` (re-pinned in 5.11), `campaign-cookie`, `click-id`, `meta-pixel-id`, `posthog-proxy`, `preorder-money`, `proxy-trailing-slash`, `trailing-slash`, `redirects-vs-assets` (1.3), `schema-coverage`, `security-headers`, `store-host` (1.3), `store-secrets` (1.3), `utm` (6.3 import), `dependency-floor`, `not-found-ssr`, `stories-parse` (6.3 floor) | `verify` |
| Repo guards rewritten for the new site | `machine-files`, `metadata-lengths`, `internal-links`, `policies` (4.4, data-driven); `video-assets` (3.3) | `verify` |
| Repo guards retired | wave 1 (1.1): `preorder-copy` (terms ported into banned-phrases), `interactions` (would fail when 5.2 and 5.5 replace its subjects); wave 7 (6.3): `action-label`, `contrast-tokens`, `kicker-language`, `kheelu-art`, `config-copy`, `a11y-v4` (old design; replaced by the axe spec and the D041 classifier), `preorder-cta` (replaced by `cta-registry` and the e2e CTA spec) | removed by their owners |
| Visual parity with the mockup | `test/e2e/visual-parity.spec.ts` (approved widths) and `test/e2e/chrome.spec.ts` (chrome elements, the bubble) | `verify:e2e` |
| Text parity, and with JavaScript off | `test/e2e/text-parity.spec.ts`, `test/e2e/no-js.spec.ts` | `verify:e2e` |
| Accessibility | `test/e2e/axe.spec.ts` (D041 classifier) | `verify:e2e` |
| Sideways scroll (`clientWidth`) and first screen | `test/e2e/no-sideways.spec.ts`, `test/e2e/first-screen.spec.ts` (viewport matrix) | `verify:e2e` |
| Performance bytes and HTML weight | `test/e2e/perf-budget.spec.ts` | `verify:e2e` |
| Redirect hops, internal links, 404s | `test/guards/redirect-hops.test.ts`, `test/e2e/links.spec.ts`, `test/e2e/redirects.spec.ts` | `verify`, `verify:e2e` |
| JSON-LD equals visible text | `test/guards/jsonld-matches-page.test.ts` | `verify` |
| Duplicate code and assets | `jscpd` on `src/` (threshold 1 percent, tests excluded), `test/guards/asset-dupes.test.ts` | `verify` |
| Lighthouse | `scripts/qa/lighthouse.mjs` (median of 3, mobile, thresholds §12, LP-tags profile) | QA |
| Tracking probes | `test/e2e/tracking-probe.spec.ts` (real origins served from the local build through Playwright routing, every measurement request recorded and answered locally, plus a control) | QA |
| Payment sandbox | `npm run qa:payment` (exists) | QA, store tasks |

`npm run verify` = lint, typecheck, Vitest, the guards, `jscpd`, DS checksums. `npm run verify:e2e` =
build, start on port 3456 with host mapping, Playwright. CI (`.github/workflows/verify.yml`) runs `verify`
on pushes to `beta` and `main`.

## 15. Environments, beta, release and rollback

### 15.1 Environments

| Environment | Branch | Hosts | `SITE_ENV` | Store keys and data | Analytics | Indexing |
|---|---|---|---|---|---|---|
| Development | any, local | `localhost:3000`, `store.localhost:3000` | `development` | `.env.local` test keys, Supabase stub | none (hosts not in lists) | loopback indexable (lessons §3) |
| Local production check (L, LP) | local | `localhost:3456`; LP serves the real origins from the local build through Playwright routing | `development` (or `KH_SITE_ENV=production` for the dry run) | test keys, stub; never a completed payment (N4) | LP: gates open, every request recorded and answered locally | as production |
| Preview | `reset/*` | none | `preview` | n/a | n/a | builds off (D014) |
| **Beta** | `beta` | betawebsite.kheelona.com, betastore.kheelona.com | `beta` | **none (D051):** no Supabase, Razorpay or email; the code treats beta as not configured (task 2.10) | PostHog with `env=beta`; GA4, Meta Pixel, CAPI, Ahrefs off; Vercel Analytics (Preview) | noindex header on every response + meta; Vercel Authentication |
| Production | `main` | kheelona.com, www, store.kheelona.com | `production` | live keys (unchanged) | all, as today | apex indexable; store noindex |

### 15.2 `SITE_ENV`

`src/config/env.ts` (pure, unit-tested, erasable-only TypeScript with **no imports**, because
`next.config.ts` imports it by relative path, where Next resolves no `@/` alias, and Node scripts import
it with type stripping):

```ts
export type SiteEnv = "production" | "beta" | "preview" | "development";
export function resolveSiteEnv(e: Record<string, string | undefined>): SiteEnv {
  const forced = e.KH_SITE_ENV;
  if (forced === "production" || forced === "beta" || forced === "preview" || forced === "development") return forced;
  if (e.VERCEL === "1" && !e.VERCEL_ENV)
    throw new Error("Vercel system environment variables are off: enable them in Settings → Environment Variables");
  if (e.VERCEL_ENV === "production") return "production";
  if (e.VERCEL_GIT_COMMIT_REF === "beta") return "beta";
  if (e.VERCEL_ENV === "preview") return "preview";
  return "development";
}
export const SITE_ENV = (process.env.KH_SITE_ENV ?? "development") as SiteEnv; // inlined at build
export const CANONICAL_ORIGIN = "https://kheelona.com";          // every environment
export const HOSTS = {
  production: { marketing: "kheelona.com", store: "store.kheelona.com" },
  beta: { marketing: "betawebsite.kheelona.com", store: "betastore.kheelona.com" },
} as const;
const pair = SITE_ENV === "beta" ? HOSTS.beta : HOSTS.production;
export const MARKETING_ORIGIN = `https://${pair.marketing}`;
export const STORE_ORIGIN = `https://${pair.store}`;
export const BETA_HOSTS = [HOSTS.beta.marketing, HOSTS.beta.store] as const;
export const isBetaHost = (h: string) => (BETA_HOSTS as readonly string[]).includes(h.split(":")[0].toLowerCase());
```

`next.config.ts` adds `env: { KH_SITE_ENV: resolveSiteEnv(process.env) }` (the documented build-time
inlining, Next docs `env.md`), so server and client code see the same value. Inside `next.config.ts`
itself (and anything it imports), `SITE_ENV` still reads `development`: the inlining applies to the app
bundles only, so the config calls `resolveSiteEnv(process.env)` directly wherever it needs the answer (N1).

### 15.3 Beta per D048: the exact code changes

| File | Change | Class | Task |
|---|---|---|---|
| `src/config/env.ts` | New (above) | new | 1.3 |
| `next.config.ts` | `env` as above; redirects from `src/config/redirects.ts`; `headers()` gains `{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }` when `resolveSiteEnv(process.env) === "beta"`, so files with a dot in the path (`/llms.txt`, `/pricing.md`, `/sitemap.xml`, images, films), which the proxy matcher skips (`src/proxy.ts:203`), are noindex too (N1); security headers and the literals `securityHeaders`, `async headers()`, `poweredByHeader: false` unchanged; no `cacheComponents` | config | 1.3 |
| `src/config/site.ts` | `export const STORE_URL = STORE_ORIGIN;` (was the literal; production value identical); add `MRP_AMOUNT_PAISE = 799_900` and `MRP_PRICE` after the money block (D034); `GA4_HOSTS`, `META_PIXEL_HOSTS`, `INDEXABLE_HOSTS` **unchanged** | config (money block untouched) | 1.3 |
| `src/config/site.ts` | `export const POSTHOG_HOSTS = [...GA4_HOSTS, ...BETA_HOSTS] as const;` (was `GA4_HOSTS`), in the same commit as the gate test that asserts it (B2a) | config | 2.6 |
| `src/lib/store/host.ts` | `isStoreHost`: `name === "store.kheelona.com" \|\| name === "betastore.kheelona.com" \|\| name === "store.localhost"` | authorised (D048) | 1.3 |
| `src/lib/store/env.ts` | `metaCapiToken: SITE_ENV === "beta" ? null : real(process.env.META_CAPI_TOKEN)` and the same for `metaCapiTestCode` (the existing SKIPPED log fires) | authorised (D048) | 1.3 |
| `src/lib/store/posthog-server.ts` | properties gain `...(SITE_ENV !== "production" ? { env: SITE_ENV } : {})`: `beta` on beta, and a marker on preview and local runs too, so a sandbox order completed against a local server can never look like production revenue (N4); production payload unchanged | authorised (D048) | 1.3 |
| `src/components/tracking/PostHogGate.tsx` | on a beta host: init options gain `before_send: (ev) => (ev ? { ...ev, properties: { ...ev.properties, env: "beta" } } : ev)`; **no `register`** (a registered super property persists in PostHog's cross-subdomain storage and could follow a tester to production, N3); production options unchanged | tracking | 2.6 |
| `src/app/layout.tsx` | Ahrefs `<script>` rendered unless `SITE_ENV === "beta"` (flagged to the founder), still literally inside `<head>` with `async`; `metadata.robots` noindex when beta | layout | 3.1 |
| `src/app/store/layout.tsx` | policy links use `MARKETING_ORIGIN + path` (beta links to beta pages) | presentation | 3.1 |
| `test/store-secrets.test.ts` | `VERCEL_AUTOMATION_BYPASS_SECRET` (the system variable Vercel exposes) is never read in `src/` and never has a `NEXT_PUBLIC_` form (N5) | test | 1.3 |
| `vercel.json` | below | config | 1.3 |

Unchanged on purpose: `src/proxy.ts` (beta hosts are not in `INDEXABLE_HOSTS`, so the existing noindex
header applies to HTML routes; the store host check comes from `host.ts`); GA4 and Meta gates (their host
lists exclude beta); `fulfil.ts`, `meta-capi.ts`, `templates.ts` (they read `STORE_URL`, right on both).

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["bom1"],
  "crons": [{ "path": "/api/health", "schedule": "0 4 * * *" }],
  "git": { "deploymentEnabled": { "reset/*": false, "beta": true } }
}
```

Vercel's rule "if a branch matches multiple rules and at least one is true, it deploys" means `beta`
builds and `reset/website-v2` does not; `main` builds by default. Crons run on production only.

Tests (1.3, 2.6): `resolveSiteEnv` truth table; `isStoreHost` for all four names; `routeForHost` on
`betawebsite.kheelona.com/store/x` redirects to `https://betastore.kheelona.com/x` in a beta build and to
production in a production build; the beta header rule present only for a beta `resolveSiteEnv`;
`shouldLoadGa4` and `shouldLoadMetaPixel` false on both beta hosts, `shouldLoadPostHog` true; CAPI token null
on beta; `purchase_confirmed` payload identical to the tag in production and with `env` elsewhere; the
PostHog persistence control (N3).

### 15.4 Founder runbook: the beta (Vercel dashboard and Cloudflare only; never the CLI)

**Revised by [D051](../decisions/D051-beta-without-store-integrations.md) (2026-10-12):** the beta runs
without store integrations. No Supabase project, Razorpay keys, email settings or PostHog filter; the
store code refuses store keys on beta (task 2.10), so betastore shows the "Pre-orders open here shortly"
screen and can never take a payment. The founder's only steps are the two domains. (The earlier B4
isolation checks are void.)

kheelona.com's DNS is on Cloudflare (nameservers `abby` and `yichun.ns.cloudflare.com`, checked
2026-10-12); `store.kheelona.com` is a CNAME to this project's Vercel target
`6eb2cd39f8ca1fdf.vercel-dns-017.com`.

1. **Vercel, first domain:** vercel.com → the kheelona project → Settings → Domains → Add Domain → type
   `betawebsite.kheelona.com` → Add. When asked where to connect it, choose **Preview** and type the Git
   branch **`beta`** → Save. (If the dialog has no branch field: add it, then click Edit on the domain and
   set Git Branch to `beta`.) If Vercel refuses because the branch does not exist yet, stop and tell the
   main session, which pushes a `beta` branch whose `vercel.json` keeps beta builds off until the new site
   is ready.
2. **Vercel, second domain:** the same for `betastore.kheelona.com`, Preview, branch `beta`.
3. **Cloudflare:** dash.cloudflare.com → kheelona.com → DNS → Records → Add record: Type **CNAME**, Name
   **`betawebsite`**, Target = the value Vercel shows for that domain (expected
   `6eb2cd39f8ca1fdf.vercel-dns-017.com`, the same as `store`), Proxy status **DNS only** (grey cloud, as
   for the apex, `www` and `store`; lessons §6), TTL Auto → Save. Repeat with Name **`betastore`**. If
   Vercel also shows a TXT verification record, add it as shown.
4. **Check:** within minutes Vercel shows "Valid Configuration" for both and issues the certificates.
   Until the first beta deployment the domains show a Vercel "not found" page; that is expected.
5. **Protection:** leave Deployment Protection as it is (Standard Protection with Vercel Authentication):
   the beta asks for a Vercel login, which keeps it private. For the automated checks of wave 9, the
   founder creates a "Protection Bypass for Automation" secret then (Settings → Deployment Protection) and
   puts it in the local `.env.local` as `VERCEL_AUTOMATION_BYPASS_SECRET` (never in the repo or the wiki).
6. **Deploy:** the main session pushes `beta` when wave 8 closes; Vercel builds it as a Preview.
7. **What the founder checks on beta:** every page against the mockup on a phone; every orange button
   opens betastore (never store.kheelona.com); betastore shows the restyled not-configured screen; the
   store form and `/thanks` states arrive as screenshots from the local build (D051).

### 15.5 Gate B, release to production and rollback

1. **Readiness pack** (main session, brief §7 Phase 8): beta previews of every page, QA results,
   Lighthouse before and after (authoritative runs per §12), tracking-parity evidence, the redirect matrix,
   risks, rollback plan, proposed low-traffic IST window.
2. **Founder prerequisites:** Supabase moved to Mumbai (§15.6) and `ORDER_DATA_LOCATION` confirmed; every
   placeholder answered or its sentence cut (the production build refuses otherwise); legal pages approved;
   no test payment anywhere but the local sandbox (D051: production has live keys and `qa:payment` refuses
   them, N10; an optional real order and refund after launch is the founder's call); optional:
   `www` switched from "Redirect" to serving the project (one-hop `www` legacy URLs, ADR-012).
3. **Gate B OK** recorded as a decision by the main session.
4. **Rollback point first** (lessons §8): `git tag archive/pre-v2-launch-<YYYY-MM-DD> origin/main`, push the
   tag; note the current production deployment in Vercel.
5. **Merge:** `beta` into `main` (no force-push, no history rewrite); push `main`; Vercel builds
   production; prebuild guards run (placeholders, DS checksums); if the build fails, production stays on the
   previous deployment.
6. **Smoke tests on production** (QA, test plan §10): key pages 200 with new content; the redirect matrix;
   store loads with live mode and the form validates (no real order); every tag firing with a real user
   agent (GA4 `collect`, `fbq` event count 1 and 2, `/ingest/e/`); noindex on the store; robots and sitemap;
   Search Console sitemap resubmitted.
7. **Rollback** if checkout, payments, purchase tracking or a key page fails: the founder clicks **Instant
   Rollback** to the previous production deployment in Vercel (seconds), then the main session reverts the
   merge with `git revert -m 1 <merge>` and pushes, writes an incident page, fixes on the branch and returns
   to Gate B. Payment emergency stop: remove `RAZORPAY_KEY_ID` from Production and redeploy (the store shows
   "opening shortly"; lessons §4).
8. **Monitoring** for 7 days per brief Phase 8 (reports at 24 hours, 72 hours, 7 days).
9. **Sell-out, whenever it happens:** `/api/health` shows `full` → the founder clicks Redeploy on the
   production deployment, so every page carries the full-mode price at once (§7, N14) → spot-check Home,
   product, `llms.txt`.

### 15.6 Supabase move to Mumbai (D047)

Founder, before Gate B (decision: [ADR-009](adr/ADR-009-region-and-supabase-move.md)): new project in
`ap-south-1` → migrations 0001-0004 by hand → pause orders (remove `RAZORPAY_KEY_ID` in Production,
redeploy) → copy `preorders`, `event_tiers`, `webhook_events` (data only) → compare row counts and the paid
non-full count → set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` → restore `RAZORPAY_KEY_ID` → redeploy →
`/api/health` shows `store: ready` and the same mode → keep the old project paused 30 days. The main session
then sets `ORDER_DATA_LOCATION` to India in `src/content/en-IN/legal/privacy.ts`.

## 16. Checkout restyle boundary

Decision: [ADR-013](adr/ADR-013-checkout-restyle-boundary.md).

### 16.1 Scope

The restyle covers the store page, `/thanks`, the event page `/e/[event]`, the partner page `/ideabaaz`,
and the store not-found and not-configured states, inside the new `StoreShell` (store header and footer
from `mockup/pages/store.html`). The event and partner pages have no mockup: they reuse the store page's
layout and components. Presentation imports change (the DS `Field`, `clsx`, the new sections) and every
import of a path 6.3 deletes (`atoms/Field`, `lib/cn`, `lib/interactions`, `molecules/PromiseMark`,
`organisms/VideoMoments`, `lib/video-moments`, `lib/kheelu-art`) goes in the same task.

### 16.2 The JSX contract

Four proofs, each a guard ([tasks 1.1](tasks.md#11-toolchain-qa-harness-and-guard-skeletons-builder)):

1. **Byte freeze** of the logic files, and of the six checkout test files (`PreorderForm`, `OrderSummary`,
   `AddressForm`, `NotFoundPanel`, `store/thanks/page`, `store/ideabaaz/page`). A test file may change only
   by a **literal-only** reviewed patch: its token stream is unchanged once string, template and regex
   literals are masked, so a selector can follow approved copy ("Indian WhatsApp number" still matches
   `exact: false`) but no assertion can be added, removed or weakened.
2. **Logic signature** per presentation file (`checkout-signature`): from the TypeScript AST, every
   statement outside JSX (declarations, hooks, handlers, awaits, early-return conditions), the conditions
   and `.map` callees inside JSX expression containers, and the contract attributes, normalised; compared
   with a stored signature seeded from the tag. A restyle regenerates it in the same commit and the diff is
   reviewed: only content reads (`copy.*`, `content.*`) and presentation imports may appear. This replaces
   round 1's "everything up to the first `return (`", which missed the `/thanks` page (first `return (` at
   line 90, after an early return and the order read) and every JSX attribute.
3. **Rendered contract** (`checkout-jsx-contract`): renders, against fixtures seeded from the tag, and is
   never edited:

   | Component and states | Asserted |
   |---|---|
   | `PreorderForm`: token, full and event tiers; idle, working, paying, with a failure | `<form>` has `noValidate`; one change handler (first keystroke fires `preorder_form_started` once); fields `parentName`, `phone`, `email`, `childAge`, `accepted` with their `type`, `inputMode`, `autocomplete`, `maxLength`, `required` exactly as at the tag (`PreorderForm.tsx:193-241`); submit `type="submit"`, `disabled` while busy, labels "Pay ₹499 and reserve" (token) or the full-mode equivalent, "Setting up your payment…", "Opening the payment window…"; a refund sentence in the same block as the button; the policy links |
   | `OrderSummary`: token, full, event | the amounts and refund lines come from config (values equal), the delivery row present |
   | `AddressForm`: empty, saved | fields and `autocomplete`, the "Save my address" submit, the saved state |
   | `/thanks`: paid, created (confirming), link needed, cannot open | `ph-no-capture ph-mask` on the order container in the paid and created branches (exactly the branches that carry it at the tag); no order data in the other two |
   | Store layout | `robots` noindex; policy links |

   Input font size ≥ 16 px is checked in the browser (`test/e2e/axe.spec.ts` companion check on the store).
4. **Behaviour:** the six checkout tests stay green, and `npm run qa:payment` reaches the open Razorpay sheet
   in test mode after every store task.

### 16.3 Load-bearing details and two presentation rules

Kept: field `name`s and `autocomplete`; `noValidate` with the shared validators; one `onChange` on the
form; the pay button's labels; the refund promise beside it; `ph-no-capture ph-mask` on the `/thanks`
order container; store noindex; inputs at 16 px or more; no `<video>` before play; Razorpay theme `#EF762F`.

- **Delivery line on `/thanks` (N9, F12 open):** orders created before 2026-10-10 00:00 IST keep "Ships
  from 20 October 2026" (`SHIP_DATE_TEXT`, as today); later orders show the D023 delivery line. The choice
  lives in `sections/store/OrderRows/delivery-line.ts`, outside the frozen page, and both cases are tested.
  When the founder answers F12, task 6.4 updates that file and the email labels together.
- **In-app browser note (B12, N7):** built (2.5, 5.15) but `enabled: false` until QA's real-device check
  (test plan §6.4) confirms the payment problem in WhatsApp or Instagram; then the main session enables it.
  "Copy link" copies the store URL; the campaign cannot follow (attribution cookies do not cross from the
  in-app browser to Chrome), recorded in the founder question.

## 17. Room for deferred features (not built now)

| Feature | Where it plugs in |
|---|---|
| Hindi (and other languages) | `src/content/hi-IN/` with the same types; a `[locale]` route segment and `hreflang` later; Devanagari font subset already generated |
| More products | `src/content/en-IN/products/<slug>/`; route `products/[slug]` exists; checkout tiers are the store's (founder decision when it comes) |
| Campaign landing pages | `src/content/en-IN/campaigns/<slug>.ts` and the `lp/[slug]` route (empty registry at launch) |
| Accounts and login | none in v1 (brief §2); the store host and API routes are where it would attach |
| Consent gate before 13 May 2027 (D042) | the three gates and `track.ts` read one consent state; `/privacy` changes in the same commit |
| Kheelona+ pricing | a new constant beside the money block and a content line, when the founder sets a price |
| Product details as tabs | only if the founder asks (N21): a client island over the same stacked markup |

## 18. Brief §9 coverage

| Standard | Mechanism (this page) | Guard | Tasks |
|---|---|---|---|
| 9.1 Conversion | One label and destination (`PreorderButton`), CTA block beside every button, sticky bar, offer card, FAQ near the close, no dead ends, the WhatsApp bubble for questions | CTA registry, text parity, first screen at 360 x 590 and 360 x 640, scroll sweep for one primary action per phone screen (test plan §4.1) | 3.1, 3.2, 3.3, 5.x |
| 9.2 SEO | §9 | metadata, JSON-LD, redirect hops, links, no-JS parity, `pageMeta` without `robots` | 1.3, 2.7, 4.4, 5.x |
| 9.3 AEO/GEO | answer-first shapes, `llms.txt`, robots policy, entity facts from one source | answer length, banned phrases | 4.4 |
| 9.4 Tracking parity | §8 | freeze, parity, registries (17 destinations), CTA registry, probes | 1.4, 2.6, 5.11, 6.2 |
| 9.5 Performance | §12 | perf bytes incl. HTML weight, Lighthouse (authoritative runs), CLS with fonts delayed | all; 7.1 |
| 9.6 Accessibility | §13 | axe with the D041 classifier on the viewport matrix, no-sideways, keyboard specs | all; 7.1 |
| 9.7 India e-commerce | seller, grievance, origin, MRP, policies, certification status from content | placeholders guard; legal approval status | 2.1, 5.x |
| 9.8 Content integrity | content model, copy precedence, placeholders, en-IN spelling, the 3-7 band | banned phrases (incl. US spellings), content-integrity spec (age band, internal material), placeholders, text parity | 1.1, 2.1, 2.9, 5.x |
| 9.9 DS compliance | §4 | off-token with named exceptions, Tailwind theme, CSS order, DS checksums, visual parity | 1.2, all |
| 9.10 Mobile first | phone layouts first, the viewport matrix, sticky bar, bubble clearance, tap targets, input types | visual parity at 360 and 390, no-sideways, first screen, perf | all |
| 9.11 Motion | §11 (Gate A spec plus the eight D049 picks; two named exceptions) | motion-properties, motion spec per pick, no-reveal-on-money | 1.2, 1.5, 2.2, 2.3, 2.4, 2.8, 3.1, 3.3 |
| 9.12 Libraries, reuse, structure | [dependencies](dependencies.md), [structure](structure.md), catalogues | `jscpd`, asset dupes, catalogue check in review | all |

## 19. Known mockup items to carry or correct

| Item | Handling |
|---|---|
| Gate A review tools (headline picker on Home, safety and the buyer's guide; review notes on the store; "Rewritten in the build" labels on the hub) | Not built; `mockup-markup` guard |
| Legal "draft" notes | Rendered while `status: draft` (beta); production refuses a draft |
| Store-confirmation placeholders (order number, email) | Come from the order row in the real page |
| D044 round-2 edits (transcript, activity screenshots) | Task 1.5b before the screens ship |
| `id="story-mode"` and `id="reserve"` missing on the product mockup | Added (fragment parity, url-map §5a); no visual change |
| Product details tab list hidden in the mockup | Shipped stacked, no tab list in the HTML (N21) |
| Team and setup CMO fixes (first screen must say what Kheelu is; setup step 2 values) | Copy tasks in wave 5 ([gate-a-progress](../site/gate-a-progress.md)) |
| Post-Gate A additions: D049 motion, D050 bubble and its bottom clearance | Hidden or neutralised in visual-parity runs; verified by their own specs |
| Reviews not run before approval (meet-kheelu, safety, buyer's guide, stories and articles, store, privacy and terms legal check) | CMO and legal passes on the built pages (Phase 5 and 7), tracked by the main session |

## 20. Open points for the founder

Listed with options and a recommendation in the report to the main session: white on Kheelu Blue (§13);
Ahrefs on beta (§15.3, recommended off); the waiver of "checkout in test mode" on production (§15.5); the
in-app browser check on real phones and the campaign loss in "Copy link" (§16.3); the product details as
stacked panels (§5.2); the 5 px arrow nudge and its use on the two hero buttons (§11.2); the `www` domain
switch for one-hop legacy URLs (§9.4); the receipt email and `/thanks` delivery wording for orders placed
before 10 October (F12, §16.3); the WhatsApp number taking calls before go-live (D032); WhatsApp green's
exact value for G-20 (§5.3).
