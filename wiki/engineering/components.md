---
title: "Components catalogue (seeded in Phase 4, revised after QA round 1; builders update their rows)"
type: catalogue
updated: 2026-10-12
sources:
  - architecture.md (§5, §11), structure.md (§5), adr/ADR-002, adr/ADR-003, adr/ADR-007
  - ../design-system/component-map.md (DS components, props in design-system/project/components/index.d.ts)
  - mockup/pages/*.html, mockup/partials/*.html, mockup/mockup.css, mockup/css/*.css, mockup/mockup.js ("grep of kh- and mk- classes per page, 2026-10-12: 167 mk- block names, every one mapped in §7")
  - ../site/pages/*.md (CTA tracking values, section notes)
  - ../decisions/D049-motion-picks.md, ../decisions/D050-whatsapp-chat-button.md
  - ../qa/architecture-review-2026-10-12.md (B1, N12, N20, N21, N22)
---

# Components catalogue

Everything the build creates, **seeded before any code exists** so no one builds a second copy after a
context reset (brief §9.12 "Catalogues"). **Check this page before creating anything.** If something
close exists, add a variant or a prop. Each task updates **only its own rows** (the Task column): set
Status and fix the path if it moved, in the same commit as the code. Status: `planned` → `built` (code
and test) → `done` (story where required, visual parity passed on the pages that use it).

Pages: H home, P product, S safety, G buyer's guide (`/ai-toys-for-kids-in-india`), SH stories hub, A
articles, T team, SU setup, C contact, 404, L legal pages (privacy, terms, refund, shipping), ST store,
TH confirmation (`/thanks`), EV event, partner and store not-found pages, all = every marketing page.

## 1. Primitives (`src/components/ui/`)

Data by props only; server components unless marked client. Story required. New code joins classes with
`clsx` directly (the legacy `src/lib/cn.ts` with `tailwind-merge` is not reused and goes in 6.3).

| Component | DS source and classes | Key props | Client | Used on | Task | Status |
|---|---|---|---|---|---|---|
| `Button` | DS Button: `kh-btn`, `kh-btn--cta`, `--primary`, `--secondary`, `--ghost`, `--danger`, `--s`, `--l`, `--block`; the arrow icon carries `ks-btn__arrow` (D049 pick 6 nudge hook) | `variant`, `size`, `block`, `href` (renders `<a>`), `icon`, `iconEnd`, `arrow`, `cta?: CtaId` (required on `cta` variant), `id`, `type`, `loading` | no | all | 2.2 | planned |
| `PreorderButton` | `Button` `cta` with `href = STORE_URL` and the one label from content | `cta: CtaId`, `size`, `block`, `id`, `arrow` (true on the Home hero, product hero and the guide, safety, stories and article closes) | no | H, P, S, G, SH, A, T, C, 404, chrome | 2.2 | planned |
| `IconButton` | DS IconButton: `kh-iconbtn`, `--primary`, `--outline`, `--l` | `icon`, `label` (required), `variant`, `size`, `onClick`, `disabled` | no | films, drawer, nav | 2.2 | planned |
| `Icon` | DS Icon: `kh-icon`, Phosphor Bold paths from `src/assets/icons.generated.ts` | `name: IconName`, `label?` (then `role="img"`) | no | all | 2.2 | planned |
| `RichText` | Renders the content inline syntax: `kh-hand`, `kh-mark`, `ks-nowrap`, links, `SourceMarker`, prices, `Placeholder` | `text`, `offer?`, `as` | no | all | 2.2 | planned |
| `Heading` | DS SectionHeading: `kh-heading`, `kh-heading--hero`, `--center`, `kh-eyebrow`, `kh-heading__title`, `kh-heading__lead` | `eyebrow`, `title`, `lead`, `level` (1-3), `align`, `hero`, `id`; `titleStepXl` (a `ks-type-*` step on an inner block span where a compound DS rule beats a class on the h1; mockup-css-mapping row 81) | no | all | 2.2 | planned |
| `Chip` | `kh-chip`, `kh-chips`; G-19 band fix (`ks-chip--on-band`) | `label`, `tone` | no | H, P, ST (films), SH | 2.2 | planned |
| `Sticker` | DS Sticker: `kh-sticker`, `--round`, `kh-tone-*`, `--kh-tilt` | `tone`, `tilt`, `round`, children | no | H, P, L (refund, shipping art) | 2.2 | planned |
| `Logo` | DS Logo: `kh-logo`, `kh-logo-link`, `kheelona-logo.svg` | `href`, `alt`, `height` | no | chrome, ST, TH | 2.2 | planned |
| `Placeholder` | `ks-placeholder` (from `mk-placeholder`) | `id`, `note` | no | wherever content has `{ph:}` | 2.2 | planned |
| `SourceMarker`, `SourcesNote` | `ks-src` (44 px tap area), `kh-caption` "Sources" (G-18, D026) | `n`, `href`; `sources[]`; `variant: "article"` (articles add `white-space: nowrap`; mockup-css-mapping §6.2) | no | H, P, G, A | 2.2 | planned |
| `Layout` family: `Section`, `Container`, `Split`, `Cols`, `SectionHead`, `Actions` | `kh-section` (`--band`, `--tight`), `kh-container`, `kh-split` (`--wide-start`, `--wide-end`), `kh-cols` (`--2`, `--3`, `--4`), `kh-section__head`, `kh-section__actions` (`--center`); `ks-list-reset` (from `mk-list-reset`) | `id`, `band`, `labelledBy`, `reveal`, variant props | no | all | 2.2 | planned |
| `Photo` | `kh-photo` (`--xl`, `--wide`, `--square`) + `next/image` from `@ds/…`; `ratio` sets the DS `--kh-ratio` variable inline (the one allowed photo style) | `image`, `alt`, `sizes`, `ratio?`, `lcp` (renders `loading="eager"` and `fetchPriority="high"`; no `priority`, deprecated in Next 16), `fetchPriority?`, `variant` | no | H, P, S, G, SU, SH, A | 2.3 | planned |
| `ArtBoard` | `kh-art`, `kh-art__layer`, `kh-tone-*`, optional `Sticker` (DS scrapbook board, `10-pages.md:42-52`); doodle layers through `Doodle` | `tone`, `label` (aria-label), `layers[{ image \| doodle, left, top \| bottom, width, rotate }]` in %, `sticker?`, `lcp`, `hero` (doodles stay still); `ratio` (inline `--kh-ratio`), `clamp` (`ks-art--clamp`, the 480 px tablet clamp inside 720-899; mockup-css-mapping §6.7) | no | H, P, S, G, T, SH, A, L | 2.3 | planned |
| `ImaginationFrame` | DS ImaginationFrame: `kh-imagine`, `__photo`, `__doodle`, `__question`; `ks-imagine-zoom` | `photo`, `alt`, `doodles[]` (drawn, staggered by order), `question`, `zoom` | no | H | 2.3 | planned |
| `Doodle`, `DoodleDefs` | `kh-art__layer` or `kh-imagine__doodle` + `ks-doodle`; inline SVG from `src/assets/doodles.generated.tsx` with `data-draw`, `data-draw-order`; or a plain decorative `<img>` of the DS file; `DoodleDefs` renders the one shared `#ks-chalk` grain filter (D049 pick 3) | `name: DoodleName`, `draw` (false in heroes, pick 2), `order` (1-5), position props | no | H, P, S, G, SH, A, T, L | 2.3 | planned |
| `AppScreens` | `kh-device`, `kh-device__screen` + `ks-shots`, `ks-shots__row`, `ks-shot` (D044, D046 equal sizes) | `screens[{ image, alt }]`, `caption`, `layout: "two" \| "one"`; `variant: "home" | "product"` (different row width, frame padding and radius from 720 px; mockup-css-mapping §6.2) | no | H, P, S, SU | 2.3 | planned |
| `Avatar` | `kh-avatar` | `initials` or `image`, `alt` | no | T | 2.3 | planned |
| `Card` | DS FeatureCard: `kh-card`, `--tint`, `--block`, `kh-tone-*`, `__icon`, `__title`, `__body`, `__link` (G-01 tap extension) | `tone`, `variant`, `icon`, `title`, `body`, `link?`, `as`; `titleType` (the `ks-type-*` step for hub card titles; mockup-css-mapping §3.5) | no | H, P, C, SH, T, A, L | 2.4 | planned |
| `TrustList` | DS TrustList: `kh-trust`, `__item`, `__icon`, `__title`, `__body` | `items[{ icon, title?, body }]`, `as`; `bodyType` (`ks-type-*` step; mockup-css-mapping §3) | no | H, P, S, G, L, A | 2.4 | planned |
| `TrustLine` | `kh-trustline` + `ks-trust` (linked items, 44 px tap areas, CMO V4) | `items[{ icon, label, href }]`, `center`, `newTab` (store) | no | every CTA block, ST | 2.4 | planned |
| `TickList` | `ks-ticks` (icon + text rows) | `items[{ icon, text }]` | no | P (box, safety panels), SU | 2.4 | planned |
| `PriceSentence` | `kh-body-s ks-price` (store: `kh-body`) | `offer`, `variant: "beside" \| "drawer" \| "offer-fine" \| "store"` | no | every CTA block, drawer, ST | 2.4 | planned |
| `HelpLine` | `kh-body-s ks-help` (tap areas) | `lead`, `contact` | no | CTA blocks, closes, ST | 2.4 | planned |
| `SellerLines` | the four seller lines (entity, GSTIN, registered address, contact) as in `partials/footer.html` `kh-footer__legal`, or as an `<address>` (store) | `seller`, `as: "spans" \| "address"` | no | Footer, StoreFooter, `SellerBlock` | 2.4 | planned |
| `OfferCard` | DS OfferCard: `kh-offer`, `__product`, `__prices`, `__price`, `__split`, `__list`, `__fine`; full mode omits `__split` (G-08) | `offer`, `items`, `cta: CtaId`, `id` | no | H, P | 2.4 | planned |
| `FaqList` | DS FAQ: `kh-faq`, `__item`, `__q`, `__sign`, `__a` (native `<details>`); each answer wrapped in `ks-faq__clip` for the D049 pick 7 open animation (CSS in `motion.css`) | `items: FaqItem[]`, `offer`, `firstOpen` | no | H, P, S, G, ST | 2.4 | planned |
| `StepLoop` | DS StepLoop: `kh-steps`, `kh-step` | `steps[{ title, body, tone }]`, `variant: "loop" \| "checks" \| "four"`; `checks` holds the guide's one-row rule from `min-width: 1200px` (`content-max-1200` media exception; mockup-css-mapping §4.2) | no | G, SU, TH | 2.4 | planned |
| `LanguageChips` | DS LanguageChips: `kh-langs`, `kh-lang`, `__native`, `__en` (each with `lang`, G-13) | `languages[]`, `note` | no | H, P | 2.4 | planned |
| `CompareTable` | DS ComparisonTable: `kh-compare-wrap` (focusable region), `kh-compare`, `is-us`, `kh-yes`, `kh-no`, `kh-some` | `columns`, `rows`, `usIndex`, `caption` | no | H (from 720 px), L (privacy recipients on laptops) | 2.4 | planned |
| `List` | `kh-list`, `kh-listitem` and its parts | `items[{ title, href, meta? }]` | no | SH, A, 404 | 2.4 | planned |
| `Quote` | `kh-quote` | `quote`, `cite` | no | T | 2.4 | planned |
| `EmptyState` | DS EmptyState: `kh-empty` (+ `ks-404` size, from `mk-404`) | `icon`, `title`, `body`, `variant` | no | 404 | 2.4 | planned |
| `DefinitionList` | `ks-specs`, `ks-specs--stack`, `ks-order__rows` (G-11 spec table and order rows, composed) | `rows[{ term, value }]`, `variant` | no | P (specs, declarations), TH | 2.4 | planned |
| `Breadcrumbs` | `ks-crumbs` (G-11, composed); returns its trail for BreadcrumbList | `trail[{ name, path }]` | no | A | 2.4 | planned |
| `Tabs` | none | none | no | **not built** (N21: the product details ship stacked as approved; a tabs island is a later option) | none | not built |
| `Field` | DS TextField: `kh-field`, `__label`, `__input` (≥ 16 px), `__hint`, `__error`; `tel-in` variant with `ks-tel`, `ks-tel__cc` (+91 decoration, `aria-hidden`, outside the input). `Field/field-parts.tsx` holds the label, hint and error pattern Select and Checkbox share (hint or error at `<id>-d`; each error mounts as a fresh `role="alert"`) | `label`, `hint`, `error`, `variant?: "tel-in"`, `id`, `className` (wrapper), `ref`; every input attribute forwarded unchanged (`name`, `type`, `inputMode`, `autoComplete`, `maxLength`, `required`, values, handlers; no default `type`) | no | ST, TH | 2.5 | built |
| `Select` | DS Select: `kh-field` + `kh-select`, `kh-select__input` (native), `kh-select__caret` | `label`, `options` (strings or `{ value, label, disabled }`), `placeholder` (disabled first option, chosen while nothing is saved), `hint`, `error`, `id`, `className`, `ref`; select attributes forwarded | no | TH | 2.5 | built |
| `Checkbox` | DS Checkbox: `kh-check`, `__input`, `__label`, `__box`, `__tick`, `__dash`, `__text`, `__hint`; `consent` adds `ks-consent` (from `mk-consent`: links in the sentence take `--link`); an error is the DS `kh-field__error` line under the row, outside the label | `label` (rich), `hint`, `error`, `consent`, `id`, `className`, `ref`; input attributes forwarded | no | ST | 2.5 | built |
| `Alert` | DS Alert: `kh-alert` (+ `kh-alert--success\|warning\|danger`; info has no modifier, as the mockup), `__icon`, `__content`, `__title`, `__body`; role `status`, `alert` for danger | `tone`, `title`, `children`, `action` (slot after the body), `icon` (override), `className` | no | ST, TH | 2.5 | built |
| `PolicyLinks` | `ks-policy` (from `mk-policy`): a labelled `<nav>` of the store's policy links, each `target="_blank"` with a `kh-sr` new-tab note | `label` (landmark name), `links[{ label, href }]`, `newTabNote` | no | ST, TH | 2.5 | built |
| `CopyLinkButton` | DS button `kh-btn kh-btn--secondary kh-btn--s` with the `copy` icon + `kh-label-s` polite live region (markup as the mockup; swap to `Button` and `Icon` once 2.2 merges). Imported from `CopyLinkButton.tsx`, which re-exports `CopyLinkButton.client.tsx` | `value`, `label`, `copiedMessage` | yes | ST | 2.5 | built |
| `InAppBrowserNote` | `ks-inapp`, `ks-inapp__action` + `Alert` + `CopyLinkButton`; server part renders nothing while `content.enabled` is false; client gate (`InAppBrowserNote.client.tsx`) shows the server-rendered note only when `in-app-browser.ts` matches Instagram, Facebook (`FBAN`, `FB_IAB`, `FBAV`) or WhatsApp, read after hydration (`useSyncExternalStore`, server snapshot false) (B12, N7); prints the store host in `strong.ks-nowrap` | `content` (`InAppBrowserNoteContent`: `enabled`, `title`, `body`, `copyLabel`, `copiedMessage`), `storeUrl` | yes | ST, EV | 2.5 | built |
| `MotionController` | `[data-reveal]` and `[data-draw]` presets in `src/motion/motion.css`; one observer | none | yes | site shell | 2.8 | planned |

## 2. Sections (`src/components/sections/`)

Generic folds configured from content; variants in `name.types.ts`. Story required.

| Section | Built from | Variants and key props | Client | Used on | Task | Status |
|---|---|---|---|---|---|---|
| `CtaBlock` | `Actions` + `PreorderButton` + `ks-beside` (`PriceSentence`, `TrustLine`, `HelpLine`) + optional secondary `Button` | `cta`, `arrow`, `align: "start" \| "center"`, `offer`, `trust`, `help`, `secondary?` | no | H ×3, P ×2, closes | 3.2 | planned |
| `OfferSection` | `Heading` + `OfferCard` + Kheelona+ line + full `TrustLine` + `HelpLine` + `ArtBoard` or `Photo` | `close` (H), `photo` (P); `cta` | no | H, P | 3.2 | planned |
| `CloseSection` | `Split`: `Heading` + `CtaBlock` (or links) + `ArtBoard` | `default`, `journal`, `guide` (tinted card, `ks-gd-close*`), `keep-reading` (no CTA, B5), `links` (setup, no CTA); `cta` | no | P, S, G, SH, A, T, C, SU, 404 | 3.2 | planned |
| `SellerBlock` | `ks-seller` section around `SellerLines` (character for character as the footer) | `seller` | no | C, L | 3.2 | planned |
| `GrievanceBlock` | D032 published wording, verbatim, in a `kh-card ks-grievance`; anchor `#grievance` | `grievance` | no | C, L | 3.2 | planned |
| `HeroSection` | `Section` + `Split` + `Heading` (hero) + `CtaBlock` or answer block + media (`ArtBoard`, `Photo`); doodles still (pick 2) | `art` (H), `product` (P, `ks-hero-sticker`), `answer` (S, G, T, SU), `contact` (C), `hub` (SH, topic tags, `ks-journal-intro`, `ks-written`); never revealed | no | H, P, S, G, T, SU, C, SH | 3.3 | planned |
| `FilmsStrip` | `ks-films`, `ks-film__*`, `Chip`, `IconButton`, native scroll-snap; `<video>` created on play only; the film in focus gets `is-focus` (pick 8) | `films`, `heading`, `proof`, `after?` (a `CtaBlock`), `posters: "eager-low" \| "lazy"` | yes (controls, playback, focus) | H, P, ST | 3.3 | planned |
| `FeatureSplit` | `Split` + `Heading` + body slot (rich text, `Card`, `TrustList`, `TickList`, `Quote`, `SourcesNote`) + media slot (`Photo`, `ArtBoard`, `ImaginationFrame`, `AppScreens`) | `imagination`, `app-screens` (P: `ks-app-split`, `ks-skills`, `ks-app-note`), `photo`, `pair`, `ticks`, `quote`; `mediaSide` | no | H, P, S, G, T, SU | 3.3 | planned |
| `ModesSection` | `Heading` + three `Card`s (`id="story-mode"` on Story mode) + `LanguageChips` (+ `Photo` on H; "Good to know" card `ks-know` and row cards `ks-modes` on P) | `home`, `product` | no | H, P | 3.3 | planned |
| `TrustSection` | `Heading` + `TrustList` + optional `AppScreens` + facts `TrustLine` + optional `CtaBlock` and secondary link | `safety` (P: `ks-safety-split`), `facts`, `never`, `meets` (G: `ks-gd-answers`, `ks-gd-pointer`); `cta?` | no | H, P, S, G | 3.3 | planned |
| `CompareByCategory` | `ks-compare-stack` cards below 720 px + `CompareTable` from 720 px (G-05) | `rows`, `columns`, `caption`, `link` | no | H | 3.3 | planned |
| `CardGrid` | `Cols` of `Card`s | `guides` (fold 7b, D046), `routes` (C, `ks-routes`), `plain` | no | H, C | 3.3 | planned |
| `FaqSection` | `Split` heading (`ks-faq-head`) + `FaqList` + more link (+ disclaimer slot) | `default`, `store` (`ks-faq`), `photo` (G: `ks-gd-faq`); `items`, `more?`, `disclaimer?` | no | H, P, S, G, ST | 3.3 | planned |
| `AnswerSection` | question heading + 40-60 word answer + optional detail (ports `mk-answer` on articles and `mk-team-answer` on team, structure §5) | `question`, `answer`, `detail?` | no | T, A | 3.4 | planned |
| `StepsSection` | `Heading` + `StepLoop` + optional tip (`ks-setup-tip`) | `steps`, `heading`, `variant` | no | G, SU, TH | 3.4 | planned |
| `ProductDetails` | `Split`: three **stacked** panels (specs `DefinitionList`, box `TickList`, safety `TickList`), each with its `kh-subtitle` heading, DS `kh-tabs` and `kh-tabs__panel` classes without `is-tabs` and without a tab list (N21) + declarations `Card` with `DefinitionList` and the care line (`ks-care`) | `specs`, `box`, `safety`, `declarations`, `link` | no | P | 3.4 | planned |
| `TopicSection` | topic heading (`id` = topic) + featured `Card` (`ks-photo-myra` art direction ported as is) + `List` | `topic`, `featured?`, `items` | no | SH | 3.4 | planned |
| `FoundersSection` | `ks-founder*`, `Avatar` or photo (B24), bios gated (D038) | `founders` | no | T | 3.4 | planned |
| `RecognitionStrip` | names as text only; renders nothing until each proof is filed (F11) | `items[{ name, gated }]` | no | T | 3.4 | planned |
| `EmptyStateSection` | `EmptyState` (`ks-404`) + `List` of links | `content` | no | 404 | 3.4 | planned |
| `ArticleHead` | `Breadcrumbs`, `Heading`, byline, updated date (`ks-story-head`, `ks-byline`) | `article` | no | A | 3.4 | planned |
| `ArticleBody` | `ks-prose` with `ks-type-*` steps; parts (`ks-part`); blocks `p` (incl. emphasis `ks-gut`), `h2`, `h3`, `list` (incl. `ks-checks`), `questions` (`ks-questions`), `quote`, `callout`, `figure` (`Photo`, incl. `ks-belly`), `facts` (`TrustList`, incl. `ks-breakout`), `disclaimer` | `blocks` | no | A | 3.4 | planned |
| `SourcesSection` | `ks-sources`, numbered notes with back-links (D026); `inline` variant (`ks-gd-sources`) | `sources`, `variant` | no | A, G | 3.4 | planned |
| `RelatedGuides` | `List` of related articles; `keep` variant (`ks-keep`, the late-talker close) | `items`, `variant` | no | A | 3.4 | planned |
| `StoreTop` | `ks-store-top*`: heading, product image, `PriceSentence` (`store`), `TrustLine` (new tab) | `content`, `offer` | no | ST, EV | 5.15 | planned |
| `StoreDetails` | `ks-details`, `ks-form`, `ks-pay-beside`, `ks-agree`, `ks-h2`: wraps `PreorderForm`, the beside block and the agreement card | `content`, `offer` | no | ST, EV | 5.15 | planned |
| `ConfirmationHead`, `OrderRows`, `AddressStep`, `HelpBlock` | `ks-thanks*`, `DefinitionList`, `AddressForm` (`ks-addr`, `ks-h2`), `HelpLine`, `PolicyLinks`, ghost link (`ks-ghost-start`); `OrderRows/delivery-line.ts` picks the delivery line by order date (N9, F12) | from the order row and content | no | TH | 5.16 | planned |

## 3. Chrome (`src/components/chrome/`)

| Component | DS source and classes | Key props | Client | Used on | Task | Status |
|---|---|---|---|---|---|---|
| `NavBar` | DS NavBar: `kh-nav`, `kh-nav__links`, `kh-nav__link` (`aria-current`), `kh-nav__end`, `kh-nav__menu`; `ks-nav-cta` (chilli button from 1024 px only, G-06, D041) | `links`, `active`, `cta = "navbar"` | no | all marketing | 3.1 | planned |
| `NavDrawer` | DS NavDrawer as native `<dialog>`: `kh-drawer`, `__panel`, `__head`, `__links`, `__link`, `__chev`, `__cta`, `__note`; slides from the side (pick 5, `ks-drawer-in` keyframes) | `links`, `offer`, `cta = "navbar-mobile"` | yes | all marketing | 3.1 | planned |
| `Footer` | DS Footer: `kh-footer`, `__top`, `__promise`, `__made`, `__cols`, `__col`, `__legal` (tap rows) with `SellerLines` | `columns`, `seller`, `promise` | no | all marketing | 3.1 | planned |
| `StickyBuyBar` | DS StickyBuyBar: `kh-buybar`, `__price`, `__big`, `__small` + `is-hidden`; behaviour G-09, D041; slides up once (pick 4); publishes `data-buybar` on `<html>` and `--ks-buybar-h` | `offer`, `mode: "after-hero" \| "first-paint"`, `cta = "sticky-bar"` | yes | H, P, S, G, SH, A (with close), T, C | 3.1 | planned |
| `WhatsAppFloat` | DS `kh-iconbtn kh-iconbtn--l` + `ks-wa`, `ks-wa__label`; `whatsapp-logo` icon; `--ks-wa-green` (D050, G-20); lifts with the bar; hidden under an open dialog | `context: "site" \| "store" \| "thanks"`, `chat` (number and texts from `seller.ts`); `cta = "whatsapp-float"`; `ph-no-capture` when `thanks` | yes (label, lift) | all pages, ST, TH, EV, 404 | 3.1 | planned |
| `SkipLink` | `kh-btn kh-btn--secondary ks-skip` | none | no | all | 3.1 | planned |
| `StoreHeader` | `ks-store-head`, `__in`, `__help` | `seller`, `support` | no | ST, TH, EV | 3.1 | planned |
| `StoreFooter` | `ks-store-foot`, `__in`; policy links to `MARKETING_ORIGIN`; `SellerLines` (`address`) | `seller`, `links` | no | ST, TH, EV | 3.1 | planned |

## 4. Tracking (`src/components/tracking/`)

| Component | What | Change from today | Task | Status |
|---|---|---|---|---|
| `GoogleAnalyticsGate` | GA4 on `GA4_HOSTS` after hydration | moved from `components/molecules/`; body unchanged | 2.6 | planned |
| `MetaPixel` | Meta Pixel on `META_PIXEL_HOSTS`, PageView on route change | moved; body unchanged | 2.6 | planned |
| `PostHogGate` | PostHog on `POSTHOG_HOSTS` (now incl. beta hosts) | moved; beta stamp `env: "beta"` through `before_send` only (no `register`); `?internal=1` flag; production init options equal the tag's | 2.6 | planned |
| `ViewContentTracker` | Meta `ViewContent` once per load | moved from the old product route; `valuePaise` prop from the offer; mounted on H and P | 2.6 | planned |

## 5. Layouts and templates (`src/layouts/`)

| Component | What | Task | Status |
|---|---|---|---|
| `SiteShell` | `SkipLink`, `NavBar`, `main`, `Footer`, `NavDrawer`, optional `StickyBuyBar`, `MotionController`, `DoodleDefs`, `WhatsAppFloat` (`site`), `body.ks-has-float`, Organization and WebSite JSON-LD once | 3.1 | planned |
| `StoreShell` | `StoreHeader`, `main`, `StoreFooter`, `body.ks-has-float`; noindex (each store page renders its own `WhatsAppFloat`) | 3.1 | planned |
| `PageTemplate` + `sections-registry.ts` | Renders `page.sections` (discriminated union) through the registry; emits the page's JSON-LD (FAQPage from the same items) | 4.1 | planned |
| `ArticleTemplate` | `ArticleHead`, `AnswerSection`, `ArticleBody`, `SourcesSection`, `RelatedGuides`, `CloseSection`; BlogPosting and BreadcrumbList | 4.2 | planned |
| `LegalTemplate` | Draft note while `status: draft`, hero, last-updated line (`ks-updated`), short version (`ks-short`, `ks-short-panel`), contents (`ks-toc`), parts and sections (`ks-doc*`, `ks-type-*` steps), tools list (`ks-tools`, privacy), close link; one CSS file replacing the four mockup copies | 4.3 | planned |

## 6. Checkout presentation (frozen logic, ADR-013)

| Component | Path | What changes | Proofs | Task | Status |
|---|---|---|---|---|---|
| `PreorderForm` | `src/features/preorder/components/PreorderForm.tsx` | JSX only: DS `Field`, `Checkbox`, `kh-btn--cta` pay button (labels unchanged), +91 decoration, "Indian WhatsApp number" label, beside block; imports of `atoms/Field`, `lib/cn`, `lib/interactions` replaced | signature fixture regenerated and reviewed; JSX contract unchanged; `PreorderForm.test.tsx` frozen except literal-only patches | 5.15 | planned |
| `OrderSummary` | `src/features/preorder/components/OrderSummary.tsx` | JSX only: composed summary card, delivery row; `molecules/PromiseMark` import replaced | same | 5.15 | planned |
| `AddressForm` | `src/features/preorder/components/AddressForm.tsx` | JSX only: DS `Field`, `Select`, primary button "Save my address" | same | 5.16 | planned |
| `NotFoundPanel` | `src/app/store/_components/NotFoundPanel.tsx` | JSX only: store chrome not-found | same | 6.1 | planned |

## 7. Mockup `mk-` helpers → where they go

All 167 `mk-` block names in the mockup sources, grouped by file. A block becomes the `ks-` block of the
same name inside the component named (architecture §4.4), unless marked "not built" or "not ported".
Built HTML never carries an `mk-` class (`test/guards/mockup-markup.test.ts`).

| Mockup class (file) | Goes to |
|---|---|
| `mk-hero`, `mk-price`, `mk-beside`, `mk-beside--center`, `mk-help`, `mk-trust`, `mk-nowrap` (`mockup.css`) | `HeroSection`, `PriceSentence`, `CtaBlock`, `HelpLine`, `TrustLine`, `RichText` |
| `mk-src` | `SourceMarker` |
| `mk-films*`, `mk-film*`, `mk-films-ctrl`, `mk-films-proof` | `FilmsStrip` |
| `.kh-buybar` transition and `is-hidden` | `StickyBuyBar` + `motion.css` |
| `dialog.kh-drawer`, `mk-drawer-in` (keyframes, `mockup.css`) | `NavDrawer` + `motion.css` (`ks-drawer-in`) |
| `[data-reveal]`, `.js-motion` | `motion.css` + `MotionController` |
| `mk-placeholder` | `Placeholder` |
| `mk-compare-stack`, `mk-compare-others` | `CompareByCategory` |
| `mk-shots`, `mk-shot`, `mk-app` | `AppScreens` |
| `mk-guides` | `CardGrid` (`guides`) |
| `mk-imagine-zoom` | `ImaginationFrame` (`zoom`) |
| `mk-facts` | `TrustSection` (facts line) |
| `mk-skip` | `SkipLink` |
| `mk-nav-cta` | `NavBar` |
| `mk-404` (`404.css`) | `EmptyState` / `EmptyStateSection` (`ks-404`) |
| `mk-doc*`, `mk-toc*`, `mk-doc-summary`, `mk-doc-close`, `mk-doc-hero`, `mk-doc-help`, `mk-doc-art`, `mk-draft`, `mk-short`, `mk-also`, `mk-recips*` (`privacy.css`, `terms.css`, `refund.css`, `shipping.css`) | `LegalTemplate` (one CSS file) |
| `mk-updated` (all four legal CSS files) | `LegalTemplate` (last-updated line) |
| `mk-short-panel` (`terms.css`) | `LegalTemplate` (short-version panel) |
| `mk-tools` (`privacy.css`) | `LegalTemplate` (tools list block) |
| `mk-step` (`refund.css`, `shipping.css`) | `LegalTemplate`: the CSS counter that numbers `.mk-doc__steps` on refund (ported as `ks-step` with `ks-doc__steps`; it is not dead CSS, [mockup-css-mapping §6.4](mockup-css-mapping.md#64-mk-step-is-a-live-counter-not-dead-css)) |
| `mk-story*`, `mk-prose`, `mk-crumbs`, `mk-byline`, `mk-answer`, `mk-sources`, `mk-notes*`, `mk-related`, `mk-facts-list`, `mk-disclaimer` (`stories.css`, article CSS; the product page's `mk-disclaimer` and `mk-sources` in `meet-kheelu.css` are different blocks with their own `ks-` names, mockup-css-mapping §6.2) | `ArticleHead`, `ArticleBody`, `Breadcrumbs`, `AnswerSection`, `SourcesSection`, `RelatedGuides` |
| `mk-part` (`stories.css`; all three articles) | `ArticleBody` (part wrapper, h2 scroll margin) |
| `mk-checks` (learning-toys article) | `ArticleBody` (`list` block, checks variant) |
| `mk-belly`, `mk-breakout`, `mk-questions` (safe-AI-toy article) | `ArticleBody` (`figure`, `facts` breakout, `questions` blocks) |
| `mk-gut`, `mk-keep` (late-talker article) | `ArticleBody` (emphasis paragraph); `RelatedGuides` (`keep` variant, the no-CTA close, B5) |
| `mk-article`, `mk-lead` (`stories.css`; no element uses them) | not ported (dead CSS) |
| `mk-topic*`, `mk-topics*`, `mk-guide`, `mk-card-links`, `mk-close`, `mk-close-art` (`stories.css`) | `TopicSection`, `HeroSection` (`hub`), `CloseSection` (`journal`) |
| `mk-journal-intro`, `mk-written` (`stories.css`, hub) | `HeroSection` (`hub`: centred heading, byline line) |
| `mk-photo-myra` (`stories.css`, hub) | `TopicSection` (featured photo art direction, ported as is) |
| `mk-later` (`stories.css`, hub: "Rewritten in the build") | not built (review label, N22) |
| `mk-specs`, `mk-ticks`, `mk-details`, `mk-declare`, `mk-panel-title` (`meet-kheelu.css`) | `DefinitionList`, `TickList`, `ProductDetails` |
| `mk-care` (`meet-kheelu.css`) | `ProductDetails` (consumer-care line in the declarations card) |
| `mk-offer-*`, `mk-close-*` (`meet-kheelu.css`) | `OfferSection` (`photo`), `CloseSection` |
| `mk-hero-sticker` (`meet-kheelu.css`) | `HeroSection` (`product`: sticker position on the art board) |
| `mk-modes`, `mk-know` (`meet-kheelu.css`) | `ModesSection` (`product`: row cards, "Good to know" card) |
| `mk-app-split`, `mk-app-note`, `mk-skills` (`meet-kheelu.css`) | `FeatureSplit` (`app-screens`, product: split, Kheelona+ note, skills chips) |
| `mk-safety` (Home and product section hook), `mk-safety-split` (`meet-kheelu.css`) | `TrustSection` (`safety`; the split with sticky screens on the product page) |
| `mk-faq-head` (`meet-kheelu.css`), `mk-faq` (`store.css`) | `FaqSection` (heading column; `store` variant without the max width) |
| `mk-list-reset` (`meet-kheelu.css`) | `Layout` (`ks-list-reset`, used by `LanguageChips` and chip lists) |
| `mk-sf-*` (`safety.css`) | `TrustSection`, `FeatureSplit` (`app-screens` one, `pair`), `CloseSection` |
| `mk-gd-hero-art` (`ai-toys-for-kids-in-india.css`) | `HeroSection` (`answer`: art board width from 720 to 899 px) |
| `mk-gd-checks` | `StepLoop` / `StepsSection` (`checks` variant: no connector) |
| `mk-gd-answers`, `mk-gd-pointer` | `TrustSection` (`meets`: the last item spans both columns; the pointer line) |
| `mk-gd-plush-art`, `mk-gd-plush-text` | `FeatureSplit` (`photo`, plush or robot: 4:3 art board, text measure) |
| `mk-gd-faq` | `FaqSection` (`photo` variant: head, body and photo grid areas) |
| `mk-gd-sources` | `SourcesSection` (`inline` variant) |
| `mk-gd-close`, `mk-gd-close-art`, `mk-gd-cta` | `CloseSection` (`guide`: tinted card, art board width, inline CTA from 720 px) |
| `mk-founder*`, `mk-team-*` (`team.css`) | `FoundersSection`, `FeatureSplit` (`quote`) |
| `mk-contact-*`, `mk-seller`, `mk-col` (`contact.css`) | `HeroSection` (`contact`), `CardGrid` (`routes`), `SellerBlock` |
| `mk-grievance`, `mk-routes` (`contact.css`) | `GrievanceBlock` (card); `CardGrid` (`routes`: two columns) |
| `mk-setup-copy`, `mk-tips`, `mk-try` (`setup.css`) | `FeatureSplit` (`ticks`), `StepsSection` |
| `mk-setup-hero` | `HeroSection` (`answer`: lead measure) |
| `mk-setup-split`, `mk-setup-belly`, `mk-setup-shot` | `FeatureSplit` (`photo`, setup: split, wake-up button photo size, activity screenshot size) |
| `mk-setup-tip`, `mk-steps-4` | `StepsSection` (Wi-Fi tip line; `four` variant in two columns) |
| `mk-setup-help`, `mk-setup-meet` | `CloseSection` (`links`: help and "Meet Kheelu" lines) |
| `mk-store-*`, `mk-form`, `mk-tel*`, `mk-consent`, `mk-pay-beside`, `mk-inapp*`, `mk-muted` (`store.css`) | `StoreHeader`, `StoreFooter`, `StoreTop`, `StoreDetails`, `Field` (`tel-in`), `Checkbox`, `InAppBrowserNote` |
| `mk-agree`, `mk-h2` (`store.css`) | `StoreDetails` (agreement card, section heading); `mk-h2` also `AddressStep` |
| `mk-policy` (`store.css`; store and confirmation) | `PolicyLinks` |
| `mk-thanks*`, `mk-order*` (`store-confirmation.css`) | `ConfirmationHead`, `OrderRows`, `AddressStep`, `StepsSection` |
| `mk-addr`, `mk-ghost-start` (`store-confirmation.css`) | `AddressStep` (form, button width); `HelpBlock` (ghost link flush start) |
| `mk-review-*`, `mk-h1*`, `mk-review-note`, `css/index.css` | not built (Gate A review tools). `mk-tool` is **not** a review tool: it is the privacy page's measuring-tool block, ported with `mk-tools` as `ks-tool(s)` in `LegalTemplate` ([mockup-css-mapping §6.3](mockup-css-mapping.md#63-mk-tool-is-privacy-content-not-a-review-tool)) |

## 8. Legacy components (deleted in task 6.3)

Everything under `src/components/{atoms,molecules,organisms,templates,vendor}` and
`src/features/home/components`, plus the old product route's `_components` (`ColorwayPicker`,
`PacePanel`; deleted with the old route in 5.2; `ViewContentTracker` moves to `tracking/` in 2.6), and
`src/lib/cn.ts`. None is reused: they are styled for the retired v3 DS. Their behaviour references kept:
`VideoMoments` (the film labels, now `FilmsStrip`), `ViewContentTracker`, the three gates.
