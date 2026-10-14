---
title: "Folder structure and naming conventions (final, Phase 4, revised after QA round 1)"
type: engineering
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (§4.10, §4.11, §9.12 "Folder structure")
  - architecture.md, adr/ADR-002 to adr/ADR-013
  - mockup/build.mjs, mockup/pages/*.html (meta comments: title, url, buybar, active, chrome), mockup/partials/*.html
  - "git ls-files src test tools scripts docs public at reset/website-v2 HEAD 947af4e (2026-10-12)"
  - node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md, 03-api-reference/03-file-conventions/{src-folder,route-groups,proxy,not-found}.md
  - ../qa/architecture-review-2026-10-12.md (B1-B3, N22, N25, N26), ../decisions/D049-motion-picks.md, ../decisions/D050-whatsapp-chat-button.md
  - "Inventory of every style= attribute in mockup/pages/*.html (2026-10-12): art-board positions, --kh-tilt, one --kh-ratio, three one-off layout styles"
---

# Folder structure and naming

Where every kind of file lives, how it is named, and how each approved mockup page maps to a route,
a content module, a template and its sections. This page replaces `docs/standards/` (the pre-reset
atomic-design standard) once task 6.3 deletes it; until then new code follows this page. Builders
check [components](components.md) and [assets](assets.md) before creating anything.

## 1. The tree

The brief's starting layout (§9.12) mapped onto Next 16's conventions (`src/app` is the routing
folder; `src/proxy.ts` replaces middleware; route groups in parentheses add no URL segment).

```
CLAUDE.md, AGENTS.md         project schema and the Next 16 warning (main session owns them)
.claude/                     agents/, rules/ (path-scoped reminders, §9), settings.json (DS edit deny)
.github/workflows/verify.yml CI: `npm run verify` on pushes to beta and main (task 1.1)
design-system/               DS v11 exactly as delivered; read-only; checksummed (D005)
wiki/                        project memory; committed (D010); never imported by src/, never served
mockup/                      the approved Gate A reference, frozen (D046); never deployed, never imported by src/
  pages/ partials/ css/      the sources the visual and text parity specs open as file URLs
  _work/                     local only, never committed (D039)
public/                      served as is
  fonts/                     generated DS font files (task 1.2)
  og.png, og/                generated Open Graph images (1200 x 630) (task 1.5)
  media/                     generated stable-URL images for JSON-LD (task 1.5)
  brand/logo-mark.png        generated; URL kept (Organization logo)
  video/moments/             the seven parent films and posters (D040), URLs unchanged
  team/, recognition/, partners/   founder-gated or kept files (cleanup verdicts), until decided
scripts/                     build pipeline and guards (run by npm scripts, prebuild, CI)
  run-steps.mjs              runs scripts/steps/<hook>/*.mjs in name order for predev, prebuild, postbuild (task 1.1)
  steps/                     one file per step, owned by the task that writes its script:
    predev/20-compose-css.mjs              (1.2)
    prebuild/10-ds-checksums.mjs           (1.1)  prebuild/20-compose-css.mjs (1.2)  prebuild/30-placeholders.mjs (2.9)
    postbuild/10-placeholders-html.mjs     (2.9)
    prebuild/15-journal-sync.mjs  postbuild/20-journal-pages.mjs   (8b.2b; the journal, ADR-014)
  journal/sync-posts.mjs     the dashboard's posts into the committed snapshot; the API only on a production build with
                             JOURNAL_SOURCE "api", or BLOG_SYNC=on (8b.2b; journal-pipeline §2)
  assets/                    build-ds-css, build-compose-css, build-fonts (1.2); build-icons, build-doodles, build-og (1.5)
  guards/                    placeholders.mjs (2.9)
  qa/                        lighthouse.mjs (1.1)
  ds-checksums.mjs, wiki-lint.mjs   (exist)
tools/                       operator tools run by hand
  qa/                        payment-probe.mjs (qa:payment), supabase-stub.mjs, lib/ (kept); sweep, shot, text, axe-run (retired in 6.3)
  store/event-link.mjs, utm/build-link.mjs   (kept)
supabase/migrations/         frozen; applied by hand in the dashboard
test/                        repo-level tests
  *.test.ts                  existing guards that still apply, each with an owner per wave (tasks: guard-test ownership)
  guards/                    new guards (Vitest), legacy-paths.ts, token-exceptions.ts, banned-phrases.data.ts
    fixtures/                authorised-diffs/ (reviewed patches), checkout-signatures/, checkout-contract/ (seeded from the tag)
  e2e/                       Playwright: support/ (1.1) and one *.spec.ts per rule, each owned by one task
  fixtures/legal/            fixture content for the legal template's parity run (4.3)
  fixtures/store/            the /thanks paid-state order for the ThanksPaid story and thanks-paid.spec.ts (4.8)
src/
  app/                       routes only: thin page files, layouts, route handlers, file conventions
  components/
    ui/                      primitives: DS component ports and small shared primitives
    sections/                one fold each, configured from content
      store/                 store-only sections (presentation of the checkout)
    chrome/                  NavBar, NavDrawer, Footer, StickyBuyBar, WhatsAppFloat (D050), StoreHeader, StoreFooter, SkipLink
    tracking/                analytics gates and mount-time trackers
  layouts/                   page shells (SiteShell, StoreShell) and templates (PageTemplate, ArticleTemplate, LegalTemplate), sections-registry.ts
  content/
    types.ts                 shared content shapes
    en-IN/                   every word, fact and FAQ the site publishes (EXTERNAL only)
  config/
    site.ts                  money (frozen block), IDs, host lists, legacy constants the checkout imports
    env.ts                   SITE_ENV and origins (D048)
    redirects.ts             the one redirect table (ADR-012)
    journal.ts               the journal's source switch, API, image folder and snapshot path; no imports (8b.2b, ADR-014)
  lib/
    tracking/                destination, event and CTA registries, dispatcher, internal flag
    seo/                     metadata, JSON-LD escaping, schema builders
    offer/                   cached live mode, offer view model, the order's delivery row (delivery-line.ts, used by /thanks and the receipt)
    content/                 rich-text parser, plain-text serialiser, placeholder helper
    journal/                 the dashboard post contract (post.ts) and its validator (validate.ts, no imports) (8b.2b);
                             the adapter into Article comes with 8b.2d (journal-pipeline §4)
    format/                  the one ₹ and date formatter
    store/ email/            checkout server code (frozen, ADR-013)
    fbq.ts posthog.ts campaign.ts click-id.ts trailing-slash.ts security-headers.ts   (frozen)
  features/preorder/         the checkout: components (presentation restyled), lib (frozen)
  motion/                    motion.css (shared presets and the D049 picks); controllers live with their components
  styles/
    site.css                 the one CSS entry
    tailwind-theme.css       the token bridge
    generated/               ds-tokens.css, fonts.css, fonts.generated.ts (the three preloads), type-steps.css, compose.css (generated)
  assets/                    non-DS media imported statically (app/ screenshots), icons.generated.ts, doodles.generated.tsx
  proxy.ts                   host routing (frozen)
```

New code joins classes with `clsx` directly; there is no shared `cn` helper (the legacy `src/lib/cn.ts`,
built on `tailwind-merge` and imported by 32 legacy files and the checkout forms, stays untouched until the
forms are restyled, then goes in 6.3).

Removed during the build (the old `src/app/(site)/products/kheelu/` folder with its colocated tests in
5.2; everything else in 6.3, in wave 7): `src/app/(site)/playos/` (redirected since wave 1),
`src/components/{atoms,molecules,organisms,templates,vendor}`, `src/features/home`, `src/app/fonts/`,
`src/styles/globals.css`, `src/lib/cn.ts`, the old `src/lib` content files (`family`, `feelings`,
`growth-arc`, `interactions`, `kheelu-art`, `kheelu-poses`, `shape-paths`, `legal`, `setup-steps`,
`product-facts`, `stories`, `stories-expansion`, `video-moments`, and the legacy `seo.ts` with its test),
`docs/standards/`, the retired guard tests, `tools/qa/{sweep,shot,text,axe-run}.mjs`, and the public files
marked DELETE-WITH-REBUILD in [cleanup-public-assets](../legacy/cleanup-public-assets.md). Two legacy
guard tests go earlier, in wave 1 (1.1): `test/preorder-copy.test.ts` and `test/interactions.test.ts`.
`Design/` (local leftovers, untracked) is the founder's to delete.

**Before deleting, moving or rewriting any file**, a task greps `test/` and `src/**/*.test.*` for the path
and for every exported name it removes, and handles each hit as [tasks](tasks.md#how-to-read-a-task) says.

## 2. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component folder | PascalCase, one folder per component | `src/components/ui/OfferCard/` |
| Component file | `Name.tsx`; client part `Name.client.tsx` (only file with `"use client"`) | `FilmsStrip.tsx`, `FilmsStrip.client.tsx` |
| Test | `Name.test.tsx` beside the component; route tests `route.test.ts` | `OfferCard.test.tsx` |
| Story | `Name.stories.tsx` for `ui/` and `sections/` only | `Button.stories.tsx` |
| Component CSS | kebab-case of the component, only if needed; classes `ks-<block>__<el>--<mod>` | `films-strip.css`, `.ks-films__frame` |
| Section config type | `name.types.ts` beside the section | `hero-section.types.ts` |
| Imports | `@/…` for `src`, `@ds/…` for `design-system/project/…`; no layer-level barrel files. Exception: `next.config.ts` and everything it imports (`src/config/env.ts`, `src/config/redirects.ts`) use relative paths only, because Next resolves no alias in the config's import graph; `env.ts` has no imports at all and stays erasable-only TypeScript so Node scripts can import it | `import { Button } from "@/components/ui/Button/Button"`; in `next.config.ts`: `import { resolveSiteEnv } from "./src/config/env"` |
| Content module | kebab-case file, camelCase export, ends with `satisfies Type` | `pages/ai-toys-for-kids-in-india.ts` exports `aiToysPage` |
| Content ids | kebab-case strings, stable | FAQ `price-and-advance`, trust `returns-7-days` |
| CTA values | kebab-case, from `lib/tracking/cta.ts` only | `see-it-ask` |
| Event names | as the registry; new ones snake_case with the `preorder_` prefix on the store | `preorder_payment_failed` |
| Scripts | kebab-case `.mjs`, verb first | `build-icons.mjs` |
| Guards | `test/guards/<rule>.test.ts`; e2e `test/e2e/<rule>.spec.ts` | `no-off-token.test.ts` |
| Build steps | `scripts/steps/<hook>/<NN>-<name>.mjs`, two-digit order, one file per step | `prebuild/30-placeholders.mjs` |
| Guard fixtures | `test/guards/fixtures/<kind>/<repo path with "/" as "__">.<ext>` | `authorised-diffs/src__lib__store__host.ts.patch`, `checkout-signatures/src__app__store__layout.tsx.json` |
| Motion hooks | `data-reveal`, `data-draw`, `data-draw-order`, state classes `is-in`, `is-focus`, `is-hidden`; `ks-` custom properties for the named founder exceptions | `--ks-nudge`, `--ks-film-focus`, `--ks-wa-green` |
| Generated files | header comment "GENERATED by scripts/…, do not edit; source …"; `*.generated.ts(x)` or under `generated/` | `icons.generated.ts`, `doodles.generated.tsx` |
| Branches | `reset/website-v2` (work, builds off), `beta` (beta deploy), `main` (production) | |
| Commits | imperative summary; a decision ID when a frozen file changes; stage by name only | `Store page restyle (presentation only)` |

## 3. `src` in detail

### 3.1 `src/app` (routes)

| Route file | URL | Notes |
|---|---|---|
| `layout.tsx` | all | `<html lang="en-IN">`, `site.css`, the three font preloads, metadata base, robots noindex on beta, Ahrefs (not on beta, still literally inside `<head>`), the tracking gates last in `<body>` |
| `not-found.tsx` | any unmatched URL | wraps itself in `SiteShell` (outside the route group); content `pages/not-found.ts` |
| `(site)/layout.tsx` | marketing | `SiteShell` (chrome, Organization and WebSite JSON-LD, sticky bar slot, `MotionController`, `DoodleDefs`, the WhatsApp bubble) |
| `(site)/page.tsx` | `/` | |
| `(site)/products/[slug]/page.tsx` | `/products/kheelu` | `generateStaticParams` from the product registry; `dynamicParams = false` |
| `(site)/safety/page.tsx`, `ai-toys-for-kids-in-india/`, `team/`, `setup/`, `contact/` | as named | |
| `(site)/privacy/`, `terms/`, `refund/`, `shipping/` `page.tsx` | legal | `LegalTemplate` |
| `(site)/stories/page.tsx` | `/stories` | |
| `(site)/stories/[slug]/page.tsx` | `/stories/<slug>` | 21 slugs from `routes.ts`; `dynamicParams = false` |
| `(site)/lp/[slug]/page.tsx` | campaign pages | empty registry at launch; `dynamicParams = false` |
| `store/layout.tsx` | store host | `StoreShell`, noindex metadata |
| `store/page.tsx`, `store/thanks/page.tsx`, `store/e/[event]/page.tsx`, `store/ideabaaz/page.tsx`, `store/[...rest]/page.tsx`, `store/not-found.tsx` | store host paths | presentation only (ADR-013); each renders its own WhatsApp bubble (a layout cannot know its page, D050) |
| `api/**` | API | frozen |
| `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`, `pricing.md/route.ts` | machine files | from content (ADR-012) |
| `icon.png`, `apple-icon.png` | icons | generated from DS logo files |

Page files stay thin: import the content module, `getOffer()`, export `metadata` (via `pageMeta`) and
`revalidate = 300` where prices render, render a template. No copy in route files.

### 3.2 `src/components`

- `ui/`: no knowledge of pages or content locales; data by props only; server components unless named
  `*.client.tsx`.
- `sections/`: one fold each; props typed by `name.types.ts`; may render several `ui` components; may
  read the offer passed as a prop; never fetch.
- `chrome/`: shared across one host's pages; reads `content/en-IN/navigation.ts` and `seller.ts` through
  props from the shell.
- `tracking/`: the only place analytics SDKs mount.

### 3.3 `src/content/en-IN`

```
offer.ts cta.ts delivery.ts policies.ts seller.ts trust.ts navigation.ts organization.ts films.ts faqs.ts routes.ts
products/kheelu/product.ts      products/kheelu/page.ts      products/index.ts
pages/home.ts safety.ts ai-toys-for-kids-in-india.ts team.ts setup.ts contact.ts not-found.ts
stories/topics.ts stories/hub.ts (slug lists only) stories/articles/<slug>.ts (21; each with card, related, dates)
legal/privacy.ts terms.ts refund.ts shipping.ts
store/store-page.ts confirmation.ts event-page.ts partner-page.ts in-app-note.ts
campaigns/index.ts (empty registry)
```

Every amount is a `{price:…}` token; every unknown fact a `{ph:…}` placeholder; every FAQ lives once in
`faqs.ts` and pages reference ids.

## 4. Where does X go?

| I need to add… | Put it in | Also |
|---|---|---|
| A new fold variant | the section's props and its `name.types.ts` | story and test; catalogue row |
| A new page | `src/content/en-IN/pages/<slug>.ts` + a thin `src/app/(site)/<slug>/page.tsx` + a line in `routes.ts` | only if the URL plan allows (strategy §4) |
| A campaign landing page | `src/content/en-IN/campaigns/<slug>.ts` + one registry line | no new component |
| A product | `src/content/en-IN/products/<slug>/` + one registry line | checkout tiers are a founder decision |
| A story | `src/content/en-IN/stories/articles/<slug>.ts` + its slug in `routes.ts` and the hub topic | `published` and `updated` written from git history when the article changes (stored, not computed at build) |
| A price or amount | never: use `{price:…}`; a new amount goes in the money block of `src/config/site.ts` only by founder decision | |
| A policy number (days, months, hours) | `src/content/en-IN/policies.ts` | owner page [policies](../product/policies.md) first |
| A tracking event or CTA value | `src/lib/tracking/events.ts` or `cta.ts` | parity test; `/privacy` in the same commit if a tool changes |
| A redirect | `src/config/redirects.ts` | hop test |
| A DS image | import from `@ds/assets/…` inside `Photo`, `ArtBoard`, `ImaginationFrame` or `AppScreens` | [assets](assets.md) row |
| A doodle that draws | add its file to `scripts/assets/build-doodles.mjs`'s list and regenerate; render it with `Doodle draw` below the first screen only | [assets](assets.md) row |
| A new motion | a preset in `src/motion/motion.css` on DS tokens, `transform` and `opacity` only; anything else is a founder decision and an ADR-007 addendum | motion-properties guard |
| A non-DS image | `src/assets/` (static import) or `public/` only when a stable URL is required | [assets](assets.md) row |
| An icon | it must be one of the 76 DS icons (`IconName`); otherwise a DS gap | |
| A colour, space, radius, shadow, duration | never: DS tokens only; missing → DS gap | |
| A build or guard script | `scripts/` | npm script; prove it red |
| An operator tool | `tools/` | |
| A temporary or scratch file | nowhere in the repo (the session scratchpad) | |

## 5. Mockup page → route → content → template → sections

Mockup shared parts: `partials/nav.html` → `chrome/NavBar`; `partials/drawer.html` →
`chrome/NavDrawer`; `partials/footer.html` → `chrome/Footer`; `partials/buybar.html` →
`chrome/StickyBuyBar` (pages whose meta says `"buybar": true`); pages with `"chrome": false` (store,
confirmation) use `StoreShell`. Added after Gate A on every page: the WhatsApp bubble (D050,
`chrome/WhatsAppFloat`). Motion per D049 on every page: heroes still, doodles below the first screen draw.

Section names are the generic sections in [components §2](components.md#2-sections-srccomponentssections); a page that needs
something new adds a **variant** to an existing section, never a new section, unless the main session
agrees a new one.

| Mockup | URL | Content module | Template | Sections, in fold order | Sticky bar | Task |
|---|---|---|---|---|---|---|
| `home.html` | `/` | `pages/home.ts` | `PageTemplate` | HeroSection `art` (CTA `hero`) · FilmsStrip + CtaBlock (`see-it-ask`) · FeatureSplit `imagination` (why conversation, sources) · ModesSection `home` · FeatureSplit `app-screens` (parent app) · TrustSection `safety` + CtaBlock (`safety`) · CompareByCategory · CardGrid `guides` · FaqSection · OfferSection `close` (`finale`) | after the hero CTA leaves | 5.1 |
| `meet-kheelu.html` | `/products/kheelu` | `products/kheelu/page.ts` + `product.ts` | `PageTemplate` | HeroSection `product` (`product-top`) · FilmsStrip · OfferSection `photo` (`product-offer`) · ModesSection `product` (good to know) · FeatureSplit `app-screens` (four skills) · TrustSection `safety` + CtaBlock (`product-safety`) · ProductDetails (three panels stacked, as approved) · FaqSection (+ speech disclaimer, D025) · CloseSection (`product-foot`) | from first paint (steps aside for inline CTAs) | 5.2 |
| `safety.html` | `/safety` | `pages/safety.ts` | `PageTemplate` | HeroSection `answer` · TrustSection `facts` (D020 order, in full) · TrustSection `never` · FeatureSplit `app-screens` (one screen, controls) · FeatureSplit `pair` (retention, certification) · FaqSection · CloseSection (`finale`) | yes | 5.3 |
| `ai-toys-for-kids-in-india.html` | `/ai-toys-for-kids-in-india` | `pages/ai-toys-for-kids-in-india.ts` | `PageTemplate` | HeroSection `answer` · StepsSection `checks` (five checks) · TrustSection `meets` · FeatureSplit `photo` (plush or robot) · FaqSection `photo` · SourcesSection `inline` · CloseSection `guide` (`finale`) | yes | 5.4 |
| `stories.html` | `/stories` | `stories/hub.ts`, `stories/topics.ts` | `PageTemplate` | HeroSection `hub` (topic tags) · TopicSection × 4 · CloseSection `journal` (`finale`) | yes | 5.5 |
| `story-learning-toys-for-a-three-year-old.html` | `/stories/learning-toys-for-a-three-year-old` | `stories/articles/<slug>.ts` | `ArticleTemplate` | ArticleHead (crumbs, byline) · AnswerSection · ArticleBody · SourcesSection · RelatedGuides · CloseSection `journal` | yes | 5.6 |
| `story-what-to-look-for-in-a-safe-ai-toy.html` | `/stories/what-to-look-for-in-a-safe-ai-toy` | same | `ArticleTemplate` | same | yes | 5.6 |
| `story-talking-toys-and-late-talkers.html` | `/stories/talking-toys-and-late-talkers` | same | `ArticleTemplate` | same, with the D025 disclaimer; close RelatedGuides `keep` (no CTA, B5) | no | 5.6 |
| (template) the 18 other articles | `/stories/<slug>` | same | `ArticleTemplate` | as the template | per article | 5.17-5.19 |
| `team.html` | `/team` | `pages/team.ts` | `PageTemplate` | HeroSection `answer` (product art, no CTA) · AnswerSection · FoundersSection (bios gated, D038) · FeatureSplit `quote` (why we build) · RecognitionStrip (gated, F11) · CloseSection (`finale`) | yes | 5.7 |
| `setup.html` | `/setup` | `pages/setup.ts` | `PageTemplate` | HeroSection `answer` · FeatureSplit `ticks` (before you start, with the Wi-Fi tip, as `setup.html` fold 2; 4.1 review) · StepsSection `four` (four steps) · FeatureSplit `photo` (child's age) · FeatureSplit `photo` (wake-up button, D018) · FeatureSplit `photo` (the activity screenshot as a photo) · CloseSection `links` (no CTA) | no | 5.8 |
| `contact.html` | `/contact` | `pages/contact.ts` | `PageTemplate` | HeroSection `contact` · CardGrid `routes` · GrievanceBlock (`#grievance`) · SellerBlock · CloseSection (`finale`) | yes | 5.9 |
| `404.html` | unmatched | `pages/not-found.ts` | `PageTemplate` | EmptyStateSection · CloseSection (`finale`) | no | 5.10 |
| `privacy.html`, `terms.html`, `refund.html`, `shipping.html` | `/privacy`, `/terms`, `/refund`, `/shipping` | `legal/<slug>.ts` | `LegalTemplate` | draft note (while draft) · hero · last updated · short version · contents · parts and sections (tools list on privacy) · seller and grievance blocks · close link (`refund-learn`, `shipping-learn`; none on privacy and terms) | no | 5.11-5.14 |
| `store.html` | `store.kheelona.com/` | `store/store-page.ts` | `StoreShell` | StoreTop · InAppBrowserNote (`enabled: false` until QA's device check) · StoreDetails (`PreorderForm` + beside block + agreement card) · OrderSummary · FaqSection `store` · FilmsStrip (below every money answer) · WhatsApp bubble (`store`) | no | 5.15 |
| `store-confirmation.html` | `store.kheelona.com/thanks` | `store/confirmation.ts` | `StoreShell` | ConfirmationHead · OrderRows (from the order row; delivery line by order date until F12) · AddressStep (`AddressForm`) · StepsSection (what happens next) · HelpBlock (`PolicyLinks`) · WhatsApp bubble (`thanks`, `ph-no-capture`) | no | 5.16 |
| (no mockup) | `/e/<tier>`, `/ideabaaz`, store not-found, not-configured | `store/event-page.ts`, `partner-page.ts` | `StoreShell` | reuse the store sections | no | 6.1 |
| `index.html` | none (the Gate A review index) | | | not built | | |

## 6. Dependency directions

`app` → `layouts` → `sections` → `ui`; `chrome` and `tracking` are used by `layouts`; everything may use
`lib`, `content/types` and `config`. `ui` never imports `content/en-IN`, `sections`, `layouts` or
`app`. Only `app` and `layouts` import `content/en-IN`. Nothing in `src` imports `wiki/`, `mockup/` or
DS markdown (ESLint `no-restricted-imports`, task 1.1). Frozen files keep their existing imports.
**Page modules and types (wave-4 close, 4.1 and 4.3 reviews):** a content page module (`content/en-IN/pages/*.ts`,
`legal/*.ts`) may import **types only** from `layouts` and `components` (`import type { PageContent }` from
`layouts/PageTemplate/page-template.types`, a section's config type), because section configs live with their sections
(§2); it never imports a value from them. Legal shapes that content writes (`LegalPage` and its parts) move into
`content/types.ts` (task 4.5), so legal modules need no layout import.

## 7. Frozen zones

Byte-identical to `archive/pre-reset-2026-10-10` (ADR-013): `src/lib/store/**` except `host.ts`,
`env.ts`, `posthog-server.ts` (D048 diffs); `src/app/api/**`; `src/proxy.ts`;
`src/features/preorder/lib/**`; `src/lib/{fbq,posthog,campaign,click-id,trailing-slash,security-headers}.ts`;
`src/lib/email/**`; `supabase/migrations/**`; the money block of `src/config/site.ts`; and the six
checkout test files (`src/features/preorder/components/{PreorderForm,OrderSummary,AddressForm}.test.tsx`,
`src/app/store/_components/NotFoundPanel.test.tsx`, `src/app/store/{thanks,ideabaaz}/page.test.tsx`),
which change only by literal-only reviewed patches. Presentation files under a logic signature and the
rendered JSX contract: `src/app/store/**` (pages, layout, not-found, `_components`),
`src/features/preorder/components/{PreorderForm,OrderSummary,AddressForm}.tsx`. Reviewed patches and
signatures live in `test/guards/fixtures/`.

## 8. Generated, committed or ignored

| Output | Committed? | Why |
|---|---|---|
| `src/styles/generated/ds-tokens.css`, `type-steps.css`, `fonts.css`, `fonts.generated.ts` | Yes | deterministic, reviewed in diffs; a test regenerates and compares |
| `src/styles/generated/compose.css` | No (git-ignored) | changes whenever a component adds CSS; generated by the `predev` and `prebuild` steps |
| `src/assets/icons.generated.ts`, `src/assets/doodles.generated.tsx` | Yes | deterministic; drift tests |
| `public/fonts/*`, `public/og*`, `public/media/*`, `public/brand/logo-mark.png`, `src/app/icon.png`, `apple-icon.png` | Yes | Vercel must serve them; the script reproduces them |
| `test/guards/fixtures/{checkout-signatures,checkout-contract}/*` | Yes | seeded from the tag; signatures change only with a reviewed restyle, contract fixtures never |
| Playwright screenshots, traces, reports, goldens; Lighthouse output | No | local only (D039); git-ignored |

**The deploy needs `wiki/`.** The DS checksum step of the production prebuild reads
`wiki/design-system/manifest.md`, so Vercel's clone must contain `wiki/` (it is committed, D010). Never
add `wiki/` to a `.vercelignore`; the step fails with a clear message if the manifest is missing (N26).

## 9. Proposed path-scoped reminders for `.claude/rules/` (for the main session to add)

```markdown
# .claude/rules/components.md  (paths: src/components/**, src/layouts/**)
- Check wiki/engineering/components.md first; extend a variant before creating anything.
- Markup and classes follow the approved mockup; DS `kh-` classes and DS tokens only; composition classes are `ks-`.
- No Tailwind arbitrary values, no `(--var)` shorthand, no hex, no px, no inline styles (art-board %, --kh-tilt and --kh-ratio only); the only literals are in test/guards/token-exceptions.ts.
- Motion only through the class contract in architecture §11.3 (data-reveal, data-draw, ks-btn__arrow, ks-faq__clip, is-focus); never an entrance on a hero, h1, price, chilli button or offer card; hero doodles stay still.
- Data by props; no copy, prices or URLs typed in a component. CTA buttons use PreorderButton with a CtaId.
- No mk- class, data-src attribute or review-tool markup in shipped HTML.
- Images: no `priority` prop (deprecated in Next 16); the one LCP image uses loading="eager" and fetchPriority="high".
- Ship Name.test.tsx (and Name.stories.tsx for ui/ and sections/); update your catalogue row in the same commit.
```

```markdown
# .claude/rules/content.md  (paths: src/content/**)
- EXTERNAL items only (wiki/site/content-boundary.md); every line traces to wiki/site/pages/<slug>.md or a decision.
- Visible text follows the approved mockup; meta, alt text, full-mode variants follow the copy page.
- Amounts only as {price:…}; delivery as {delivery}; unknown facts as {ph:ID note}; never type ₹.
- FAQs live once in faqs.ts; answer-first blocks 40-60 words; en-IN spelling; ages 3 to 7, never anything implying under 3.
- The stories hub holds slug lists only; an article's card text, related links and dates live in its own module.
```

```markdown
# .claude/rules/checkout-frozen.md  (paths: src/lib/store/**, src/app/api/**, src/proxy.ts, src/features/preorder/**, src/lib/email/**, src/app/store/**)
- Checkout logic is frozen (ADR-013): logic files byte-identical to archive/pre-reset-2026-10-10; presentation files change markup, classes, copy and presentation imports only.
- The six checkout test files change only by literal-only reviewed patches; the JSX contract fixtures are never edited; a restyle regenerates its file's logic signature and the diff is reviewed.
- Any other change needs a founder decision ID in the commit and an updated reviewed patch.
- Run test/guards/checkout-*.test.ts(x) and `npm run qa:payment` (test keys only; never a real order).
```

```markdown
# .claude/rules/tracking.md  (paths: src/lib/tracking/**, src/components/tracking/**, src/lib/fbq.ts, src/lib/posthog.ts)
- IDs, event names and parameters never change (wiki/site/tracking-inventory.md); new events are additions in events.ts; every inventory destination stays in destinations.ts.
- New events go through track.ts; the frozen funnel stays byte-identical.
- Beta: PostHog gets env=beta through before_send only (never posthog.register); GA4, Meta and CAPI never on beta hosts.
- A tool change ships with its /privacy change in the same commit (test/analytics-tags.test.ts).
```

```markdown
# .claude/rules/config-and-env.md  (paths: next.config.ts, vercel.json, src/config/**)
- SITE_ENV comes from src/config/env.ts only; next.config.ts calls resolveSiteEnv(process.env) directly and imports by relative path.
- The money block of src/config/site.ts is frozen; host lists change only as architecture §15.3 says.
- No cacheComponents; the beta noindex header rule stays; the store's six secrets never take a NEXT_PUBLIC_ name.
```

```markdown
# .claude/rules/styles.md  (paths: src/styles/**, src/motion/**, scripts/assets/**)
- design-system/ is read-only; derivatives are generated outside it by scripts/assets/*.
- The Tailwind theme maps DS roles, spacing and the four DS breakpoints only; nothing else.
- Motion: transform and opacity only, DS duration and easing tokens, neutralised under prefers-reduced-motion; the only exceptions are stroke-dashoffset in .ks-doodle rules and grid-template-rows in .kh-faq__item::details-content (D049, ADR-007).
- Generated files are never edited by hand.
```

```markdown
# .claude/rules/tests-and-scripts.md  (paths: test/**, scripts/**)
- A guard must exit non-zero and must be proven red with a planted violation before it is trusted.
- Before deleting, moving or rewriting a file, grep test/ and src/**/*.test.* for its path and exported names; edit a test only if your task owns it (wiki/engineering/tasks.md, guard-test ownership).
- Never weaken a guard to make a task pass; a guard that contradicts approved copy goes to the main session.
- Stage new and deleted files before running guards that read the git index.
- Accepted exceptions (D041 white on Chilli; the named token exceptions) are classified narrowly and printed every run.
- A build step is one file in scripts/steps/<hook>/, owned by the task that writes its script.
```

## 10. Lines proposed for `CLAUDE.md` and `AGENTS.md` (main session)

- CLAUDE.md, under "Everything in its place": "Folder structure, naming and the mockup-to-route map:
  wiki/engineering/structure.md. Catalogues: components.md, assets.md, artifacts.md, dependencies.md."
- AGENTS.md: replace the paragraph pointing at `docs/standards/` with "Structure: wiki/engineering/structure.md;
  components ship a colocated Vitest test (and a story for ui/ and sections/)."
