---
title: "Mockup CSS mapping: every off-token value in the approved mockup CSS, and how the build reproduces it"
type: engineering
updated: 2026-10-12
sources:
  - mockup/mockup.css and mockup/css/*.css (approved at Gate A, ../decisions/D046-gate-a-approved.md); mockup/pages/*.html and the built mockup/*.html (element checks, 2026-10-12)
  - "Detector: a read-only replica of cssViolations() from test/guards/no-off-token.test.ts in the task 1.1 worktree .claude/worktrees/wf_20aaa1e8-c0f-1 (HEAD 614ca6d plus its uncommitted fix, read 2026-10-12), with a selector stack added, run over mockup/mockup.css and mockup/css/*.css: 189 rows, 135 declarations, the same totals as the guard's own calibration test"
  - test/guards/token-exceptions.ts (same worktree, read 2026-10-12)
  - design-system/project/tokens.css, tokens.json, components/bundle.css, 06-surfaces.md (read-only)
  - src/styles/generated/type-steps.css (task 1.2, merged ab4868e)
  - architecture.md (§4.1, §4.3, §4.4, §5, §14, §19), adr/ADR-002-visual-layer-ds-css.md (§4, §5), structure.md (§2, §5), components.md (§1, §2, §7), tasks.md (waves 1-5)
  - ../design-system/gaps.md (G-03); ../log.md entry "2026-10-11 10:55" (Kabir's frame zoomed on the founder's screenshot feedback)
---

# Mockup CSS mapping

**Status:** proposal by the Architect for the main session (2026-10-12). Nothing here is applied until the
main session has the task 1.1 owner add §4 to `test/guards/token-exceptions.ts`. Builders read this page
whenever the off-token guard refuses a value they copied from the mockup.

The guard `test/guards/no-off-token.test.ts` refuses every literal colour, length, font value, z-index,
scale and off-DS breakpoint in `src/`. Run over the approved mockup's own CSS it finds 189 rows. This page
lists each of them, says whether it is ported and where, and gives the DS token, DS class or generated
`ks-type-*` class that reproduces it exactly, or, where nothing in the DS can, the narrow named exception.

## 1. Summary

| | Detector rows | Declarations | Rows in §3 |
|---|---|---|---|
| Ported | 177 | 127 | 81 |
| Mockup-only (Gate A review tool) | 6 | 4 | 4 |
| Not ported: never renders, or restates the DS | 6 | 4 | 3 |
| **Total** | **189** | **135** | **88** |

The detector counts a declaration once per rule it breaks (a `font-size: 16px` is both a length and a font
literal), hence 189 rows for 135 declarations. §3 groups a declaration repeated with the same selector in
several files (the legal pages) into one row that cites every file and line: 87 groups, plus one split
(the two 1200 px queries go to different components) = 88 rows.

**How the 81 ported rows are reproduced:** 23 by a generated `ks-type-*` class in markup; 21 by a DS token,
an exact `calc()` of space tokens, a CSS keyword (`normal`, `initial`) or the already-allowed inline
`--kh-ratio` prop; 1 by the existing `outline-offset-2px` exception; 36 by **10 new named exceptions**
(9 declaration entries and 1 media-query entry, §4).

**The 1200 px breakpoint:** keep it exactly, as a media exception scoped to the two files that need it
(§4.2). Moving it to 1024 px leaves 360, 390, 1366 and 1440 unchanged but changes 1024-1199 px (iPads in
landscape, small laptops).

**Founder decisions:** none needed to apply this page. One optional question (the legal h2 weight, §6.5).
Four plan corrections for the main session (§6.1-6.4) and the timing point that **wave 2 already needs
these entries**, not only wave 3 (§7).

## 2. Method and the equality standard

- **The list** comes from a replica of the guard's own `cssViolations()` (same regular expressions, same
  line arithmetic) with a selector stack added. Declaration lines are the guard's. The two `@media` rows
  are cited at their own lines (`ai-toys-for-kids-in-india.css:21`, `stories.css:156`); the guard prints
  20 and 155 because it counts a prelude from the end of the previous statement (cosmetic; owner note, §5).
- **Every selector was checked against the pages** (`mockup/pages/*.html`, and the built pages for the
  `{{icon:…}}` injections). Copies that match no element on their own page are noted (§6.6).
- **Equality standard.** A mapping is accepted only if every computed property it touches equals the
  mockup's at **every** width, not only at 360, 390 and 1440. The facts used:
  1. **Load order.** The build loads tokens (including the `kh-` type classes), then `bundle.css`, then
     `type-steps.css` (`ks-type-*`), then `motion.css`, then the composition CSS (`ks-`), all unlayered
     ([architecture §4.1](architecture.md#41-the-one-css-entry)); the mockup loads `tokens.css`,
     `bundle.css`, `mockup.css`, then the page file, in the same order. So a `ks-type-*` class beats a
     single-class DS rule at equal specificity, **loses to a compound DS selector** (for example
     `.kh-heading--hero .kh-heading__title`, 0,2,0), and a `ks-` composition rule beats a `ks-type-*` class.
  2. **`ks-type-<style>` sets family, size, line height, weight (and tracking) together**
     (`type-steps.css:3-21`). Steps exist for `@sm` 720, `@lg` 900 and `@xl` 1024 only: no 768 step, no
     pointer step, and a class cannot reach a pseudo-element.
  3. **The DS has no weight tokens** (`tokens.css:70-114`). Weights live in the type styles
     (`tokens.css:115-133`), and `bundle.css` restates 500, 700 and 800 and the link underline offset 3px as
     literals (`bundle.css:54, 123, 169, 179, 210, 342-343, 387, 410, 561, 569, 651-653, 915`).
     [ADR-002 §5](adr/ADR-002-visual-layer-ds-css.md) already allows "the DS's own literals that composition
     repeats" (its one instance so far: `outline-offset: 2px`).
  4. `--content-max` is **1200px** (`tokens.css:94`; `06-surfaces.md:9` "content max 1200px").
     `.kh-art` reads `var(--kh-ratio, 1 / 1)` (`bundle.css:1164`); `.kh-photo img` reads
     `var(--kh-ratio, 4 / 5)` (`bundle.css:1151`).
  5. **Fixed widths as an exact `calc()` of space tokens**, the rule of
     [architecture §4.4(d)](architecture.md#44-composition-css-rules) and the mockup's own practice
     (`mockup.css:149, 153`; `meet-kheelu.css:22, 26-27, 40, 43, 50, 55, 59`; `setup.css:30, 33`;
     `stories.css:98, 145, 160`; `404.css:3`). The `calc()` is written in the declaration: the guard
     refuses a custom property holding a multiplier (`--x: calc(var(--space-10) * 3)`).

## 3. The list

Columns: **Source** (file:line, `css/` omitted); **Selector** as in the mockup; **Declaration**; **Goes to**:
the component named in [components §7](components.md#7-mockup-mk--helpers--where-they-go) and the task that
owns its composition CSS ([tasks](tasks.md)), or **M** (mockup-only) or **D** (not ported); **Mapping**,
with the computed equality. Component CSS file names are in §4.1. "720-899" means
`(min-width: 720px) and (max-width: 899px)`.

### 3.1 `mockup.css` (loaded by every page)

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 1 | mockup.css:30 | `.mk-help a` | `font-weight: 800` | HelpLine (2.4) | Exception `ds-weight-800` (weight-only: the link keeps the inherited `kh-body-s` size and line height) |
| 2 | mockup.css:35 | `.mk-src` | `font-weight: 800` | SourceMarker (2.2) | Exception `ds-weight-800` |
| 3 | mockup.css:132 | `.mk-imagine-zoom .kh-imagine__photo` | `transform: scale(1.32)` | ImaginationFrame `zoom` (2.3) | Exception `imagine-zoom`; `transform-origin: 52% 100%` ports as is (percent is allowed) |
| 4 | mockup.css:140 | `.mk-review-pill` | `z-index: 60` | **M**: Gate A headline picker ([architecture §4.4(a)](architecture.md#44-composition-css-rules)) | Not ported (it would be `var(--z-toast)`, 60) |
| 5 | mockup.css:140 | `.mk-review-pill` | `min-height: 40px` | **M** | Not ported |
| 6 | mockup.css:140 | `.mk-review-pill` | `font-size: 14px` | **M** | Not ported |
| 7 | mockup.css:143 | `#mk-h1 .kh-check__text strong` | `font: 800 18px/24px var(--font-display)` | **M**: headline picker sheet | Not ported |

### 3.2 Buyer's guide (`ai-toys-for-kids-in-india.css`)

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 8 | ai-toys-for-kids-in-india.css:9 | `.mk-gd-hero-art` in 720-899 | `width: min(100%, 480px)` | HeroSection `answer` (3.3), through ArtBoard `clamp` (2.3) | `width: min(100%, calc(var(--space-10) * 3 + var(--space-9)))`: 3 × 128 + 96 = 480 |
| 9 | ai-toys-for-kids-in-india.css:17 | `.mk-gd-checks .kh-step` in `(max-width: 719px)` | `grid-template-columns: 64px minmax(0, 1fr)` | StepLoop `checks` (2.4) | `var(--space-8) minmax(0, 1fr)`: 64, the numeral circle's width (`bundle.css:218`) |
| 10a | ai-toys-for-kids-in-india.css:21 | `@media (min-width: 1200px)` around `.mk-gd-checks` (five checks in one row) | the prelude | StepLoop `checks` (2.4) | Media exception `content-max-1200` (§4.2) |
| 11 | ai-toys-for-kids-in-india.css:30 | `.mk-gd-plush-art` | `--kh-ratio: 4 / 3` | FeatureSplit `photo` (3.3) | Exception `guide-plush-ratio`: the ratio changes at 900 px (row 13), which an inline prop cannot do |
| 12 | ai-toys-for-kids-in-india.css:31 | `.mk-gd-plush-art` in 720-899 | `width: min(100%, 480px)` | FeatureSplit (3.3), through ArtBoard `clamp` (2.3) | As row 8 |
| 13 | ai-toys-for-kids-in-india.css:32 | `.mk-gd-plush-art` in `(min-width: 900px)` | `--kh-ratio: 1 / 1` | FeatureSplit (3.3) | `--kh-ratio: initial`: `.kh-art` then takes its own fallback `1 / 1` (`bundle.css:1164`) |
| 14 | ai-toys-for-kids-in-india.css:39 | `.mk-gd-faq__photo` in 720-899 | `width: min(100%, 420px)` | FaqSection `photo` (3.3) | `min(100%, calc(var(--space-10) * 3 + var(--space-6) + var(--space-1)))`: 384 + 32 + 4 = 420 |
| 15 | ai-toys-for-kids-in-india.css:40 | `.mk-gd-faq__photo` in `(min-width: 900px)` | `width: min(100%, 360px)` | FaqSection `photo` (3.3) | `min(100%, calc(var(--space-10) * 3 - var(--space-5)))`: 384 − 24 = 360 |
| 16 | ai-toys-for-kids-in-india.css:50 | `.mk-gd-close-art` in 720-899 | `width: min(100%, 480px)` | CloseSection `guide` (3.2), through ArtBoard `clamp` (2.3) | As row 8 |

### 3.3 Safety (`safety.css`)

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 52 | safety.css:10 | `.mk-sf-belly` | `width: min(100%, 200px)` | TrustSection `facts` (3.3) | `min(100%, calc(var(--space-9) * 2 + var(--space-2)))`: 192 + 8 = 200 |
| 53 | safety.css:11 | `.mk-sf-belly` in `(min-width: 900px)` | `width: min(100%, 300px)` | TrustSection `facts` (3.3) | `min(100%, calc(var(--space-9) * 3 + var(--space-3)))`: 288 + 12 = 300 |
| 54 | safety.css:26 | `.mk-sf-shot .kh-device` | `width: min(100%, 272px)` | FeatureSplit `app-screens`, one screen (3.3) | `min(100%, calc(var(--space-10) * 2 + var(--space-4)))`: 256 + 16 = 272 (architecture §4.4(d)) |
| 55 | safety.css:28 | `.mk-sf-shot .kh-caption` | `max-width: 272px` | FeatureSplit (3.3) | `calc(var(--space-10) * 2 + var(--space-4))` = 272 |
| 56 | safety.css:29 | `.mk-sf-shot .kh-device` in `(min-width: 900px)` | `width: 300px` | FeatureSplit (3.3) | `calc(var(--space-9) * 3 + var(--space-3))` = 300 |
| 57 | safety.css:29 | `.mk-sf-shot .kh-caption` in `(min-width: 900px)` | `max-width: 300px` | FeatureSplit (3.3) | As row 56 |
| 58 | safety.css:52 | `.mk-sf-art` in 720-899 | `width: min(100%, 480px)` | CloseSection (3.2), through ArtBoard `clamp` (2.3) | As row 8 |

### 3.4 Product, contact, setup, team, store

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 17 | contact.css:7 | `.mk-hero .kh-heading__lead a` | `font-weight: 800` | HeroSection `contact` (3.3) | Exception `ds-weight-800`, in a rule scoped to the contact variant (§6.2) |
| 18 | contact.css:27 | `.mk-grievance a, .mk-seller a` | `font-weight: 800` | GrievanceBlock and SellerBlock, contact context (3.2) | Exception `ds-weight-800`, one rule in each file; not in their legal-page context (§6.2) |
| 19 | meet-kheelu.css:85 | `.mk-specs dt` | `font-weight: 800` | DefinitionList `ks-specs` (2.4) | Exception `ds-weight-800` |
| 20 | meet-kheelu.css:91 | `.mk-declare dd a` | `font-weight: 800` | ProductDetails, declarations card (3.4) | Exception `ds-weight-800` |
| 21 | meet-kheelu.css:98 | `.mk-disclaimer` (product FAQ) | `font-weight: 700` | FaqSection `disclaimer` (3.3) | Exception `ds-weight-700`; under its own name, not the article's (§6.2) |
| 59 | setup.css:9 | `.mk-setup-tip` | `font-weight: 700` | StepsSection tip (3.4) | Exception `ds-weight-700` |
| 60 | store-confirmation.css:23 | `.mk-order__rows dd` | `font-weight: 800` | DefinitionList `ks-order__rows` (2.4) | Exception `ds-weight-800` |
| 61 | store.css:21 | `.mk-policy a` | `font-weight: 800` | PolicyLinks (2.5) | Exception `ds-weight-800` |
| 62 | store.css:60 | `.mk-tel__cc` | `font-weight: 700` | Field `tel-in` (2.5) | Exception `ds-weight-700` |
| 85 | team.css:11 | `.mk-team-answer a` | `font-weight: 800` | AnswerSection, team (3.4; [structure §5](structure.md#5-mockup-page--route--content--template--sections) team row) | Exception `ds-weight-800` |

### 3.5 Stories hub and articles (`stories.css`; the three article files only `@import` it)

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 63 | stories.css:27 | `.mk-guide .kh-card__title` | `font-size: 20px` | TopicSection featured card (3.4), Card `titleType` (2.4) | Class `ks-type-subtitle` on the `h3.kh-card__title`: display 20/26 700, which equals `.kh-card__title` (`700 24px/30px` display, `bundle.css:207`) with the size and line height overridden; wins by load order at equal specificity |
| 64 | stories.css:27 | same | `line-height: 26px` | same | Same class |
| 65 | stories.css:30 | `.mk-guide:hover .kh-card__link` | `text-decoration-thickness: 2px` | TopicSection (3.4) | `var(--stroke-control)` = 2px (`tokens.css:96`), the DS's line-weight family; the DS draws underlines with stroke tokens too (`bundle.css:1016`) |
| 66 | stories.css:31 | `.mk-guide:focus-within` | `outline-offset: 2px` | TopicSection (3.4) | Existing exception `outline-offset-2px`; nothing to add |
| 67 | stories.css:40 | `.mk-guides .kh-listitem__title` | `font-size: 16px` | **D**: restates the DS | Not ported: `.kh-listitem__title` is already `700 16px/24px var(--font-body)` (`bundle.css:1102`) |
| 68 | stories.css:40 | same | `line-height: 24px` | **D** | Not ported (as row 67) |
| 69 | stories.css:47 | `.mk-close-art` | `--kh-ratio: 4 / 3` | CloseSection `journal` (3.2) | ArtBoard prop `ratio="4 / 3"` (2.3), rendered as inline `--kh-ratio`, which the guard already allows; one constant value renders the same because the board is hidden below 900 px (`stories.css:47, 143`) |
| 70 | stories.css:50 | `.mk-crumbs ol` | `font: 700 14px/20px var(--font-body)` | Breadcrumbs (2.4) | Class `ks-type-body-s` on the `ol` (body 14/20) plus `.ks-crumbs ol { font-weight: 700 }` (exception `ds-weight-700`): 700 14/20 body, the DS's own pairing (`bundle.css:1171`) |
| 71 | stories.css:61 | `.mk-prose` | `font-size: 16px` | ArticleBody `ks-prose` (3.4) | Classes `ks-type-body ks-type-body-l@xl` on the prose column: body 16/24 400 below 1024 px, 18/28 from 1024 (rows 83-84); family and weight equal what the column inherited (`bundle.css:7-15`) |
| 72 | stories.css:61 | same | `line-height: 24px` | same | Same classes |
| 73 | stories.css:64 | `.mk-prose a:not(.kh-btn):not(.mk-src)` | `font-weight: 700` | ArticleBody (3.4) | Exception `ds-weight-700` |
| 74 | stories.css:64 | same | `text-decoration-thickness: 2px` | ArticleBody (3.4) | `var(--stroke-control)` = 2px |
| 75 | stories.css:64 | same | `text-underline-offset: 3px` | ArticleBody (3.4) | Exception `ds-underline-offset-3px` |
| 76 | stories.css:95 | `.mk-facts-list .kh-trust__body` | `font-size: 16px` | ArticleBody `facts` (3.4), TrustList `bodyType` (2.4) | Class `ks-type-body` on each `p.kh-trust__body`: body 16/24 400, which stays 16/24 from 1024 px while the prose becomes 18/28, as in the mockup |
| 77 | stories.css:95 | same | `line-height: 24px` | same | Same class |
| 78 | stories.css:110 | `.mk-notes__n` | `font-weight: 800` | SourcesSection (3.4) | Exception `ds-weight-800` |
| 79 | stories.css:111 | `.mk-notes a, .mk-prose .mk-notes a:not(.mk-src)` | `font-weight: 400` | SourcesSection (3.4) | `font-weight: normal` (= 400). It still overrides row 73 because SourcesSection's file loads after ArticleBody's at equal specificity (§5 rule 8) |
| 80 | stories.css:120 | `.mk-gut` | `font-weight: 800` | ArticleBody (3.4) | Exception `ds-weight-800` |
| 81 | stories.css:148 | `.mk-story-head .kh-heading--hero .kh-heading__title` in `(min-width: 1024px)` | `font-size: 56px` | ArticleHead (3.4), through Heading `titleStepXl` (2.2) | Class `ks-type-display-l@xl` on an inner `<span class="ks-heading__step">` with `display: block` (Heading's CSS). On the `h1` itself the class would lose to the DS rule (0,2,0) that makes a hero title 72/74 at 1024 px (`bundle.css:178`). From 1024 px the span is display 56/58 800 with letter-spacing −0.01em of 56 px (−0.56 px), as the mockup; below 1024 px it inherits the `h1` (40/44, then 56/58 from 768). A block span keeps the `h1`'s 74 px strut out of its lines. Fallback: §4.4 |
| 82 | stories.css:148 | same | `line-height: 58px` | same | Same class |
| 83 | stories.css:149 | `.mk-prose` in `(min-width: 1024px)` | `font-size: 18px` | ArticleBody (3.4) | `ks-type-body-l@xl` (row 71) |
| 84 | stories.css:149 | same | `line-height: 28px` | same | Same class |
| 10b | stories.css:156 | `@media (min-width: 1200px)` around `.mk-breakout` (facts in two columns, out of the reading column) | the prelude | ArticleBody `facts` breakout (3.4) | Media exception `content-max-1200` (§4.2) |

### 3.6 Legal pages, merged into LegalTemplate (4.3)

Family A = privacy and terms; family B = refund and shipping. The four files are two families, not four
copies (§6.1): rows marked A or B apply to that family only.

| # | Source | Selector | Declaration | Goes to | Mapping |
|---|---|---|---|---|---|
| 22 | privacy.css:17, terms.css:17 | `.mk-doc-summary .kh-trust__body a` | `font-weight: 700` | LegalTemplate, A | Exception `ds-weight-700` |
| 23 | privacy.css:17, terms.css:17 | same | `text-underline-offset: 3px` | LegalTemplate, A | Exception `ds-underline-offset-3px` |
| 24 | privacy.css:24, terms.css:24, refund.css:31, shipping.css:31 | `.mk-toc a` | `font-weight: 700` | LegalTemplate | Exception `ds-weight-700` |
| 25 | privacy.css:25, terms.css:25, refund.css:32, shipping.css:32 | `.mk-toc a:hover` | `text-underline-offset: 3px` | LegalTemplate | Exception `ds-underline-offset-3px` |
| 26 | privacy.css:26, terms.css:26, refund.css:33, shipping.css:33 | `.mk-toc__n` | `font-weight: 800` | LegalTemplate | Exception `ds-weight-800` |
| 27 | privacy.css:28, terms.css:28, refund.css:35, shipping.css:35 | `.mk-doc__body` | `font-size: 16px` | LegalTemplate | Classes `ks-type-body ks-type-body-l@xl` on the body column: body 16/24 400, 18/28 from 1024 px (rows 38-39); family and weight equal what it inherited |
| 28 | same four | same | `line-height: 24px` | LegalTemplate | Same classes |
| 29 | privacy.css:38, terms.css:38, refund.css:44, shipping.css:44 | `.mk-doc a:not(.kh-btn)` | `font-weight: 700` | LegalTemplate | Exception `ds-weight-700` |
| 30 | same four | same | `text-underline-offset: 3px` | LegalTemplate | Exception `ds-underline-offset-3px` |
| 31 | privacy.css:42, terms.css:42 | `.mk-doc__part .mk-doc__answer` | `font-size: 18px` | LegalTemplate, A | Classes `ks-type-body-l ks-type-lead@xl` on the answer line: body 18/28 below 1024 px, body 20/30 500 from 1024 (rows 40-41) |
| 32 | privacy.css:42, terms.css:42 | same | `line-height: 28px` | LegalTemplate, A | Same classes |
| 33 | privacy.css:42, terms.css:42 | same | `font-weight: 500` | LegalTemplate, A | Exception `ds-weight-500-legal` in `.ks-doc__part .ks-doc__answer { font-weight: 500 }`; with row 31: 18/28 500 below 1024 px ("kh-body-l size, kh-lead weight", as `privacy.css:42` says) |
| 34 | privacy.css:54, terms.css:54 | `.mk-also a` | `font-weight: 800` | LegalTemplate, A | Exception `ds-weight-800` |
| 35 | privacy.css:54, terms.css:54 | same | `text-underline-offset: 3px` | LegalTemplate, A | Exception `ds-underline-offset-3px` |
| 36 | privacy.css:57, terms.css:57 | `.mk-doc-close .mk-help .kh-icon` | `vertical-align: -0.2em` | LegalTemplate, A | `calc(var(--space-1) * -1)`: the same rule sets `font-size: var(--icon-m)` (20 px), so −0.2em computes to −4 px |
| 37 | privacy.css:72 | `.mk-recips__k` | `font-weight: 700` | LegalTemplate (privacy recipients) | Exception `ds-weight-700` |
| 38 | privacy.css:85, terms.css:84, refund.css:68, shipping.css:68 | `.mk-doc__body` in `(min-width: 1024px)` | `font-size: 18px` | LegalTemplate | `ks-type-body-l@xl` (row 27) |
| 39 | same four | same | `line-height: 28px` | LegalTemplate | Same class |
| 40 | privacy.css:86, terms.css:85 | `.mk-doc__part .mk-doc__answer` in `(min-width: 1024px)` | `font-size: 20px` | LegalTemplate, A | `ks-type-lead@xl`: body 20/30 500 (`tokens.css:125`) |
| 41 | privacy.css:86, terms.css:85 | same | `line-height: 30px` | LegalTemplate, A | Same class |
| 42 | privacy.css:94, terms.css:94 | `.mk-toc a` in `(min-width: 1024px) and (pointer: fine)` | `font-size: 14px` | LegalTemplate, A | Exception `legal-toc-fine-size`. `ks-type-body-s@xl` would also shrink the rows on touch screens of 1024 px and wider, which the mockup keeps at 16/24 on purpose (`privacy.css:91-92`) |
| 43 | privacy.css:94, terms.css:94 | same | `line-height: 20px` | LegalTemplate, A | Exception `legal-toc-fine-line` |
| 44 | refund.css:12, shipping.css:12 | `.mk-doc-art` | `--kh-ratio: 16 / 10` | **D**: never renders | Not ported: below 900 px the board is `display: none` (`refund.css:17`); from 900 px row 45 applies |
| 45 | refund.css:14, shipping.css:14 | `.mk-doc-art` in `(min-width: 900px)` | `--kh-ratio: 4 / 3` | LegalTemplate hero, B | ArtBoard prop `ratio="4 / 3"` (2.3), inline; one constant renders the same because the board only shows from 900 px |
| 46 | refund.css:24, shipping.css:24 | `.mk-doc-help .kh-icon` | `vertical-align: -0.2em` | LegalTemplate, B | As row 36 |
| 47 | refund.css:54, shipping.css:54 | `.mk-doc__steps li::before` | `font: 800 16px/20px var(--font-display)` | LegalTemplate, B (numbered steps; live on refund only) | Exception `legal-step-numeral`: a pseudo-element takes no class |
| 48 | refund.css:69, shipping.css:69 | `.mk-doc__part h2` in `(min-width: 1024px)` | `font-size: 32px` | LegalTemplate, B | Class `ks-type-headline@xl` on the `h2.kh-title` plus `.ks-doc__part h2 { font-weight: 700 }` (exception `ds-weight-700`): display 32/38 **700** from 1024 px, as rendered (`kh-headline` alone is 800; §6.5) |
| 49 | refund.css:69, shipping.css:69 | same | `line-height: 38px` | LegalTemplate, B | Same |
| 50 | refund.css:70, shipping.css:70 | `.mk-doc__part .kh-subtitle` in `(min-width: 1024px)` | `font-size: 24px` | LegalTemplate, B | `ks-type-title@xl` on the `h3.kh-subtitle`: display 24/30 700 (`tokens.css:119`) |
| 51 | refund.css:70, shipping.css:70 | same | `line-height: 30px` | LegalTemplate, B | Same class |
| 86 | terms.css:65 | `.mk-short li::before` | `font: 800 16px/20px var(--font-display)` | LegalTemplate, terms short version | Exception `legal-step-numeral` |
| 87 | terms.css:66 | `.mk-short strong` | `font-weight: 800` | LegalTemplate, terms short version | Exception `ds-weight-800` |

## 4. Named exceptions for `token-exceptions.ts`

### 4.1 Declaration entries (append to `CSS_EXCEPTIONS`)

The component CSS files the entries name (kebab-case per [structure §2](structure.md#2-naming-conventions)):
`src/components/ui/{HelpLine/help-line, SourceMarker/source-marker, ImaginationFrame/imagination-frame,
DefinitionList/definition-list, Breadcrumbs/breadcrumbs, PolicyLinks/policy-links, Field/field,
StepLoop/step-loop}.css`; `src/components/sections/{HeroSection/hero-section, FeatureSplit/feature-split,
FaqSection/faq-section, GrievanceBlock/grievance-block, SellerBlock/seller-block, ProductDetails/product-details,
AnswerSection/answer-section, StepsSection/steps-section, ArticleBody/article-body,
SourcesSection/sources-section}.css`; `src/layouts/LegalTemplate/legal-template.css`.

```ts
  // From wiki/engineering/mockup-css-mapping.md §4 (2026-10-12): the approved mockup (D046) ported exactly.
  {
    id: "ds-weight-800",
    file: /^src\/(?:components\/ui\/(?:HelpLine\/help-line|SourceMarker\/source-marker|DefinitionList\/definition-list|PolicyLinks\/policy-links)|components\/sections\/(?:HeroSection\/hero-section|GrievanceBlock\/grievance-block|SellerBlock\/seller-block|ProductDetails\/product-details|AnswerSection\/answer-section|ArticleBody\/article-body|SourcesSection\/sources-section)|layouts\/LegalTemplate\/legal-template)\.css$/,
    property: /^font-weight$/,
    value: /^800$/,
    reason:
      "The DS's emphasis weight for links and labels, restated as bundle.css does (169, 210, 387, 410, 561); the DS has no weight tokens. Weight-only changes in the approved mockup: mockup.css:30,35; contact.css:7,27; meet-kheelu.css:85,91; store-confirmation.css:23; store.css:21; stories.css:110,120; team.css:11; privacy.css:26,54; terms.css:26,54,66; refund.css:33; shipping.css:33.",
  },
  {
    id: "ds-weight-700",
    file: /^src\/(?:components\/ui\/(?:Breadcrumbs\/breadcrumbs|Field\/field)|components\/sections\/(?:FaqSection\/faq-section|StepsSection\/steps-section|ArticleBody\/article-body)|layouts\/LegalTemplate\/legal-template)\.css$/,
    property: /^font-weight$/,
    value: /^700$/,
    reason:
      "The DS's bold weight for text links and row labels, restated as bundle.css does (54, 342, 343, 569, 651, 653); the DS has no weight tokens. Approved mockup: meet-kheelu.css:98; setup.css:9; store.css:60; stories.css:50 (with ks-type-body-s), 64; privacy.css:17,24,38,72; terms.css:17,24,38; refund.css:31,44 and 69 (keeps kh-title's 700 under ks-type-headline@xl); shipping.css:31,44,69.",
  },
  {
    id: "ds-weight-500-legal",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font-weight$/,
    value: /^500$/,
    reason: "kh-lead's weight (tokens.css:125; bundle.css:179) on the answer-first line at kh-body-l size below 1024 px: privacy.css:42, terms.css:42.",
  },
  {
    id: "ds-underline-offset-3px",
    file: /^src\/(?:layouts\/LegalTemplate\/legal-template|components\/sections\/ArticleBody\/article-body)\.css$/,
    property: /^text-underline-offset$/,
    value: /^3px$/,
    reason: "The DS's own link underline offset (bundle.css:123, 210, 410, 561, 652, 915), restated on the legal and article links: privacy.css:17,25,38,54; terms.css:17,25,38,54; refund.css:32,44; shipping.css:32,44; stories.css:64.",
  },
  {
    id: "legal-step-numeral",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font$/,
    value: /^800 16px\/20px var\(--font-display\)$/,
    reason: "Numerals in the Sunshine step circles, drawn by ::before, which no class can reach; the DS lets glyphs inside shapes leave the type scale (bundle.css:2-3; .kh-avatar 800 18px/1, .kh-step__num 700 34px/1). refund.css:54, shipping.css:54, terms.css:65.",
  },
  {
    id: "legal-toc-fine-size",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^font-size$/,
    value: /^14px$/,
    reason: "kh-body-s size (tokens.css:128) for the contents list inside (min-width: 1024px) and (pointer: fine) only; touch screens keep 16/24 and no generated type step is pointer-aware. privacy.css:94, terms.css:94.",
  },
  {
    id: "legal-toc-fine-line",
    file: /^src\/layouts\/LegalTemplate\/legal-template\.css$/,
    property: /^line-height$/,
    value: /^20px$/,
    reason: "kh-body-s line height (tokens.css:128), same query and lines as legal-toc-fine-size: privacy.css:94, terms.css:94.",
  },
  {
    id: "imagine-zoom",
    file: /^src\/components\/ui\/ImaginationFrame\/imagination-frame\.css$/,
    property: /^transform$/,
    value: /^scale\(1\.32\)$/,
    reason: "The founder's crop of Kabir's imagination frame (log 2026-10-11 10:55, screenshot feedback; mockup.css:130-132, approved D046), with transform-origin 52% 100%. Static: never transitioned.",
  },
  {
    id: "guide-plush-ratio",
    file: /^src\/components\/sections\/FeatureSplit\/feature-split\.css$/,
    property: /^--kh-ratio$/,
    value: /^4 \/ 3$/,
    reason: "The buyer's guide plush board is 4:3 on phones and the DS default 1:1 from 900 px (ai-toys-for-kids-in-india.css:30,32); an inline --kh-ratio cannot change at a breakpoint. The 900 px rule writes --kh-ratio: initial.",
  },
```

Every existing planted red case of the guard stays red with these entries: its default path is
`src/components/ui/Card/card.css`, which no entry names, and its font shorthand is `800 18px/24px`, not
`800 16px/20px` (regexes checked against those paths, 2026-10-12).

### 4.2 The 1200 px breakpoint

**The rules.** `ai-toys-for-kids-in-india.css:21` puts the guide's five checks in one row from 1200 px
(two columns from 720 px); `stories.css:156-161` lets the safe-AI-toy facts break out of the 700 px reading
column (`stories.css:60`) into two columns with `margin-inline: calc(var(--space-10) * -1)` and shrinks the
belly unit (`stories.css:158-160`). 1200 is not one of the DS's four widths (720, 768, 900, 1024; G-03),
but it is the DS's **content-max** (`tokens.css:94`); CSS cannot read `var(--content-max)` in a media query.

**Could a DS breakpoint express it?** With `(min-width: 1024px)` instead:

- **Unchanged** at 360, 390, 1366 and 1440: both queries are true or both false there, and every
  declaration inside is already a token.
- **Changed at 1024-1199 px.** (1) The five checks go into one row instead of two columns: from 1024 px the
  section has 48 px side padding (`bundle.css:1125-1126`), so the content is 928 px at 1024 and each
  column (928 − 4 × 32) / 5 = **160 px** wide (195 px at 1199), holding a 64 px numeral, a 24/30 title and
  body text. (2) The facts break out early: at 1024 px the reading column has only 114 px of room each side
  inside the 928 px content box, so the 956 px list overhangs the content edge by **14 px each side** up to
  about 1056 px; the belly unit drops to 160 px. iPads in landscape (1024, 1180 and 1194 CSS px) and small
  laptops sit in this range. That is a visual change outside the approved screenshots and would need the
  founder's OK.
- A container query cannot reproduce it either: the allowed container widths map to viewport widths 96 px
  wider (the section padding), so `@container (min-width: 1024px)` means a 1120 px viewport.

**Recommendation: keep 1200 px exactly**, as a media exception scoped to the two files (an Architect-route
answer to G-03; no founder decision). `MEDIA_LENGTHS` is global, so this needs a small per-file mechanism
in `token-exceptions.ts`:

```ts
/** @media preludes allowed in one file only, beyond MEDIA_LENGTHS. `prelude` matches the whole
 *  prelude, trimmed, with runs of whitespace collapsed to one space. */
export type MediaException = { id: string; file: RegExp; prelude: RegExp; reason: string };

export const MEDIA_EXCEPTIONS: readonly MediaException[] = [
  {
    id: "content-max-1200",
    file: /^src\/components\/(?:ui\/StepLoop\/step-loop|sections\/ArticleBody\/article-body)\.css$/,
    prelude: /^@media \(min-width: 1200px\)$/,
    reason: "Approved mockup (D046): the buyer's guide's five checks in one row (ai-toys-for-kids-in-india.css:21) and the safe-AI-toy facts breaking out of the reading column (stories.css:156) from 1200 px, the DS content-max (tokens.css:94; 06-surfaces.md:9). A media query cannot read var(--content-max). DS gap G-03.",
  },
];
```

and in `cssViolations()` of `no-off-token.test.ts`, where a `@media` or `@container` prelude is read:

```ts
const normal = prelude.replace(/\s+/g, " ");
const media = MEDIA_EXCEPTIONS.find((e) => e.file.test(path) && e.prelude.test(normal));
if (media) applied.push(`${path}: ${normal} (${media.id})`);
else for (const bad of mediaViolations(prelude)) {
  violations.push({ line: lineAt(text, start + buf.indexOf(prelude)), rule: "media query off the DS breakpoints", text: bad });
}
```

(`start + buf.indexOf(prelude)` also corrects the line printed for a prelude.) The existing planted case
`@media (min-width: 1200px)` in `Card/card.css` stays red.

### 4.3 What needed no exception

| Value | Answer | Rows |
|---|---|---|
| Fixed widths 480, 420, 360, 300, 272, 200 px | Exact `calc()` of `--space-9`/`--space-10` plus smaller space tokens | 8, 12, 14-16, 52-58 |
| `64px` column | `var(--space-8)` | 9 |
| `vertical-align: -0.2em` at a 20 px icon | `calc(var(--space-1) * -1)` = −4 px | 36, 46 |
| `text-decoration-thickness: 2px` | `var(--stroke-control)` | 65, 74 |
| `font-weight: 400` | `normal` | 79 |
| `--kh-ratio: 1 / 1` on an art board | `initial` (the DS default) | 13 |
| `--kh-ratio: 4 / 3` that never changes where the board shows | ArtBoard `ratio` prop, inline (already allowed) | 45, 69 |
| `outline-offset: 2px` | Existing `outline-offset-2px` | 66 |
| Type sizes and line heights | Generated `ks-type-*` classes in markup | 27-28, 31-32, 38-41, 48-51, 63-64, 70-72, 76-77, 81-84 |

### 4.4 Fallback if the Heading inner step (row 81) is not wanted

Two entries instead, mirroring the mockup rule in ArticleHead's CSS:

```ts
  { id: "article-title-size", file: /^src\/components\/sections\/ArticleHead\/article-head\.css$/, property: /^font-size$/, value: /^56px$/,
    reason: "kh-display-l (tokens.css:116) for the guide title from 1024 px, where the DS hero step (bundle.css:178) would make it 72 px: stories.css:148." },
  { id: "article-title-line", file: /^src\/components\/sections\/ArticleHead\/article-head\.css$/, property: /^line-height$/, value: /^58px$/,
    reason: "kh-display-l line height (tokens.css:116), same rule: stories.css:148." },
```

Recommended against: ADR-002 §5 says type sizes are never restated, and the inner step reproduces the
title exactly with a class that already exists.

## 5. Rules for builders porting mockup CSS

These bind every task that writes composition CSS: 2.2-2.5, 3.1-3.4, 4.2-4.3, 5.15-5.16. Wave-5 page
tasks own content and routes only (tasks, wave 5).

1. **Where it goes.** Each `mk-` block becomes the `ks-` block of the component
   [components §7](components.md#7-mockup-mk--helpers--where-they-go) names, with the same declarations,
   then the Mapping column of §3. Never port an **M** or **D** row. In the mockup every page loaded only
   `mockup.css` and its own file; the build loads all composition CSS on every page, so a page-only rule
   is scoped to its variant (§6.2).
2. **Type.** Never type `font-size`, `line-height` or a `font` shorthand. Put `ks-type-<style>` (and its
   `@sm`, `@lg`, `@xl` copies) on the element, chosen so family, size, line height, weight and tracking all
   equal the mockup's **computed** values; check in the browser, not by the mockup's comment
   (`refund.css:69` says kh-headline, the page renders 700). A `ks-type-*` class beats a single-class DS
   rule and loses to a compound one: there, put it on an inner block element (Heading `titleStepXl`), never
   `!important`. The only typed type values are the three legal entries (a pseudo-element and a
   pointer-only query). Families only as `var(--font-display)`, `var(--font-body)`, `var(--font-hand)`.
3. **Weights.** `font-weight: 800` and `700` only in the files of `ds-weight-800` and `ds-weight-700`;
   `500` only in `legal-template.css`; 400 is written `normal`; 600 and 900 never.
4. **Lengths.** DS tokens. A fixed width is an exact `calc()` of space tokens equal to the mockup's pixel
   value, written in the declaration, with the sum in a comment (`/* 3 × 128 + 96 = 480 */`). Underlines:
   thickness `var(--stroke-control)` or `var(--stroke-focus)`; offset `var(--space-1)` as the mockup does,
   3px only in the two files of `ds-underline-offset-3px`. An em nudge at a fixed icon size becomes the
   equal space token.
5. **Breakpoints.** `min-width` 720, 768, 900, 1024 and `max-width` 719, 767, 899, 1023; 1200 only in
   `step-loop.css` and `article-body.css`; `(pointer: fine)` and `(prefers-reduced-motion: reduce)` freely;
   no range syntax, no height queries.
6. **Ratios.** A fixed ratio is the ArtBoard or Photo `ratio` prop (inline `--kh-ratio`). A board takes its
   ratio from one place only, prop or class. 1:1 on an art board is the DS default (omit it, or
   `--kh-ratio: initial`). A ratio that changes at a breakpoint exists only on the guide's plush board.
7. **Layers and transforms.** `z-index` only `var(--z-*)`. A static transform only for the imagination
   zoom; anything that moves belongs to `motion.css` ([architecture §11.3](architecture.md#113-class-contract-between-motioncss-and-components)).
8. **Overrides across components** follow the compose order (ui, sections, chrome, layouts; alphabetical
   within a layer, [architecture §4.3](architecture.md#43-generated-derivatives)): SourcesSection's
   `.ks-notes a { font-weight: normal }` resets ArticleBody's prose links because it loads later at equal
   specificity (`stories.css:64, 111`). Keep such a pair where the order holds, or make the later rule more
   specific, and say so in a comment.
9. **When the guard refuses a value,** find its row here. If it is not here, stop and ask the main session.
   Never edit `token-exceptions.ts`, never add a literal as a `var()` fallback, never use a Tailwind
   arbitrary value.
10. **Proof.** Visual parity at 360, 390 and 1440 (SPA 1) is the final check; for each `ks-type-*` mapping
    the component test may also compare the computed font values with the mockup element's.

**Owner note (for the main session).** `test/guards/token-exceptions.ts` and
`test/guards/no-off-token.test.ts` belong to task 1.1 (tasks 1.1 "Owns"); no builder edits them. The main
session has the 1.1 owner:

- append the nine entries of §4.1 to `CSS_EXCEPTIONS` (`ds-weight-800`, `ds-weight-700`,
  `ds-weight-500-legal`, `ds-underline-offset-3px`, `legal-step-numeral`, `legal-toc-fine-size`,
  `legal-toc-fine-line`, `imagine-zoom`, `guide-plush-ratio`);
- add `MediaException`, `MEDIA_EXCEPTIONS` (`content-max-1200`) and the guard change of §4.2, printing the
  applied media exceptions with the others;
- prove each of the 10 new ids red outside its files and green inside them, keeping every existing planted
  case unchanged (row 66 reuses the existing `outline-offset-2px`);
- if the row-81 inner step is declined, add the two entries of §4.4 as well.

## 6. Mockup items to correct rather than port, and plan corrections

### 6.1 The legal CSS is two families, not four copies

[Architecture §3 and §4.4(c)](architecture.md#44-composition-css-rules) and the LegalTemplate row of
components §5 say the four legal files are duplicates merged into one. They are two families. Besides the
A and B rows of §3.6: the contents number column is 3.5ch in A and 3ch in B (`privacy.css:24`,
`refund.css:31`); the body column has a measure only in B (`refund.css:35`), while A puts the measure on
paragraphs and lists (`privacy.css:33`) and on the cards (`privacy.css:45`); the close card has a gap and
no action margin in A, an action margin in B (`privacy.css:51-52`, `refund.css:62-63`); the draft note has
an icon only in B (`refund.css:9-10`); the sticky contents list scrolls inside a max height only in A
(`privacy.css:84`); terms adds its short-version panel and part groups (`terms.css:62-74, 95-97`).
**Recommendation:** LegalTemplate (4.3) takes a two-value variant (the names are 4.3's). Unifying the two is
a visual change on two of the four pages and needs the founder's OK.

### 6.2 Same names, different blocks

Each pair below never met in the approved render (each page loaded one page file). In one global
`compose.css` they would, so each needs its own `ks-` name or a variant:

| Name | Where | What would leak |
|---|---|---|
| `mk-disclaimer` | `meet-kheelu.css:98-99` (icon grid, 700) and `stories.css:78` (italic, muted) | Row 21's 700 onto the article disclaimer |
| `mk-sources` | `meet-kheelu.css:100` and `stories.css:105-106` | Margins, rule and colour across product and articles |
| `mk-details` | `meet-kheelu.css:79` and `store.css:81` (a white card from 720 px) | The store card onto the product details |
| `mk-seller` | `contact.css:27-28` and `store.css:15-17` | The store's muted colour and measure onto contact |
| `mk-shots`, `mk-shot` | `mockup.css:148-155` (Home) and `meet-kheelu.css:49-60` (product: other row width, frame padding and radius from 720 px) | One page's frame onto the other: AppScreens needs a Home and a product variant (2.3) |
| `mk-src` | `stories.css:72` adds `white-space: nowrap` on articles only | Nowrap onto Home's markers: a SourceMarker variant, or prove Home unchanged at 360 |
| `.mk-hero .kh-heading__lead a` | `contact.css:7` | 800 onto any future hero lead link: scope to HeroSection `contact` |
| GrievanceBlock, SellerBlock | contact: `kh-card mk-grievance` / `mk-seller`, links 800 (`contact.css:27`); legal: `kh-card mk-doc__card`, links 700 (`privacy.html:289-293`, `privacy.css:38`) | A context prop (3.2), so legal pages keep 700 |

### 6.3 `mk-tool` is privacy content, not a review tool

[Architecture §4.4(a)](architecture.md#44-composition-css-rules), ADR-002 §4 and the last row of
components §7 drop `mk-tool` with the Gate A review tools, while components §7 also maps `mk-tools` to
LegalTemplate. `privacy.css:62-65` styles the privacy page's seven measuring-tool blocks (task 5.11: "Tools
named one per block"). Correct the three places: port `.mk-tools` and `.mk-tool` as `ks-tools`, `ks-tool`.

### 6.4 `mk-step` is a live counter, not dead CSS

Architecture §4.4(e), ADR-002 §4 and components §7 call `mk-step` dead CSS. It is the CSS counter of
`.mk-doc__steps` (`refund.css:52-54`), which numbers three steps on `refund.html`; only a `.mk-step` class
does not exist. Port the counter (renamed `ks-step`) with `.ks-doc__steps` and row 47.

### 6.5 The legal h2 at 1024 px renders 700, not kh-headline

`refund.css:69` and `shipping.css:69` step the `h2.kh-title` to 32/38 with the comment "kh-headline"; the
weight stays 700 because the rule sets only size and line height (kh-headline is 800, `tokens.css:118`).
Row 48 ports what renders. **Optional question for the founder (or DS owner):** switch to true kh-headline
(drop the 700 rule; a weight change on refund and shipping at 1024 px and wider, listed as a parity
deviation). Recommendation: keep it as approved.

### 6.6 Copies with no element (merged, harmless)

`terms.css:17, 42, 85` match nothing on `terms.html` (no summary links, no answer lines) and
`shipping.css:52-54` nothing on `shipping.html` (no numbered steps); the same rules are live on privacy and
refund, so the merged rule ports once. Rows 44 and 67-68 are not ported at all (D).

### 6.7 Two generalisations of the plan

Architecture §4.4(d) names only the 272 px widths; the same rule covers the 480, 420, 360, 300 and 200 px
widths here. The four 480 px tablet clamps (rows 8, 12, 16, 58) live once, in ArtBoard (`clamp` prop,
class `ks-art--clamp` inside 720-899), not in three sections.

## 7. Follow-ups for the main session

1. **Apply §4 before wave 2 composes CSS.** HelpLine, SourceMarker, ImaginationFrame, DefinitionList,
   Breadcrumbs, StepLoop, PolicyLinks and Field (tasks 2.2-2.5) already need `ds-weight-*`,
   `imagine-zoom` and `content-max-1200`; the build runbook says "before wave 3".
2. **Wording to amend** so the plan and the guard agree: [ADR-002 §5](adr/ADR-002-visual-layer-ds-css.md)
   (add the DS weights and the 3px link offset to "the DS's own literals that composition repeats"; the
   three type values no class can reach; the founder's zoom; the plush ratio; the 1200 px media
   exception), [architecture §4.4](architecture.md#44-composition-css-rules) "Allowed literals" and items
   (a), (d), (e), and [tasks](tasks.md) 1.1 acceptance 11 ("lists exactly").
3. **Catalogue rows** ([components](components.md)): Heading `titleStepXl` (2.2); ArtBoard `ratio` and
   `clamp`, AppScreens Home and product variants (2.3); Card `titleType`, TrustList `bodyType`, StepLoop
   `checks` holding the 1200 px rule (2.4); SourceMarker article variant (2.2); GrievanceBlock and
   SellerBlock context (3.2); HeroSection contact scoping, FaqSection's own disclaimer name (3.3);
   LegalTemplate's two families (4.3); in components §7, `mk-tool` and `mk-step` (this page §6.3-6.4) and
   `mk-team-answer` → AnswerSection (structure §5 team row).
