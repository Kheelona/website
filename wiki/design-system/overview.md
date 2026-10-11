---
title: Design system overview (v11)
type: design-system
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - design-system/README.md
  - design-system/project/README.md
  - design-system/project/00-how-to-use.md
  - design-system/project/01-writing.md
  - design-system/project/02-imagery.md
  - design-system/project/03-cast.md
  - design-system/project/04-kheelu.md
  - design-system/project/05-asset-playbook.md
  - design-system/project/06-surfaces.md
  - design-system/project/07-selling.md
  - design-system/project/08-accessibility.md
  - design-system/project/09-cast-photo-recipe.md
  - design-system/project/10-pages.md
  - design-system/project/tokens.json
  - design-system/project/tokens.css
  - design-system/project/design-system.json
  - design-system/project/components/ (bundle.css, bundle.js, index.d.ts, */README.md, */preview.html)
  - design-system/project/assets/*/README.md
  - design-system/renders/home-page-phone.jpg, home-page-desktop.jpg, home-page-desktop-top.jpg
  - .claude/settings.json (working tree, read 2026-10-10) and decisions/D005-ds-integrity-tooling.md
  - package.json (line 36, at the tag)
  - "Headless Chrome (tools/qa/lib/resolve.mjs) on design-system/site/home-page.html at 360x640, 390x844, 412x915, 1366x768, run 2026-10-10"
  - "axe-core 4.12.1, WCAG 2.0/2.1/2.2 A+AA tags, same page at 390 and 1366 px, run 2026-10-10"
  - "CoreText glyph check of design-system/project/fonts/*.woff2, run 2026-10-10"
---

# Design system overview (v11)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

DS citations (`design-system/…`; short forms such as `README.md:73` or `bundle.css:18` are files under
`design-system/project/`) refer to DS v11 as delivered and checksummed in the [manifest](manifest.md);
the DS is in no git tag ([D004](../decisions/D004-internal-material-uncommitted.md)).

How the new Kheelona design system (DS) is built and how a page builder must use it. This page
**describes** the DS; it does not copy it. **Values live in the DS** (`tokens.css`, `tokens.json`, the
chapter cited); a value appears here only where a gap needs it as evidence, and the gap page holds it.
Companion pages: [component map](component-map.md) · [tokens](tokens.md) · [motion](motion.md) ·
[gap register](gaps.md).

## At a glance

| | |
|---|---|
| Version | **v11, exported 10 Oct 2026** (`design-system/README.md:1`). Last change by the owner 2026-10-10 21:01 UTC, "v11: the astronaut helmet is worn" (`project/design-system.json`, `lastChange`) |
| Delivered as | A folder of 643 files, moved in byte-identical ([D003](../decisions/D003-inputs-moved-not-copied.md)); checksums in the [manifest](manifest.md) |
| Edit protection | `.claude/settings.json` denies **`Edit(/design-system/**)`**, anchored at the project root by the leading `/`. The brief's unanchored form `Edit(design-system/**)` also matched `wiki/design-system/` and blocked writing these pages, so it was anchored ([D005](../decisions/D005-ds-integrity-tooling.md)). Shell commands can still change files, so QA re-verifies the checksums before every gate (brief §4.1) |
| Source of truth | "The web version on claude.ai is the source of truth. If this copy and the web disagree, the web wins." (`design-system/README.md:26`; also `project/00-how-to-use.md:7`). Our copy is a frozen snapshot and no claude.ai link is in the repo ([G-15](gaps.md#g-15); freezing v11 is [open questions](../open-questions.md) G11) |
| Authority for us | Brief §3: the DS is source #2, after the founder's logged instructions, **for anything visual**. Brief §4.1: use only its tokens, components, type, colour, spacing, grid, icons, imagery and motion |
| Theme for the website | **Day only.** Marketing pages set `data-theme="light"` (`project/10-pages.md:22`); Bedtime is the parent app's night mode (`project/README.md:77`) |

## What it contains

| Part | Where | What it holds |
|---|---|---|
| Brand book | `project/README.md` + `project/00-…10-….md` | 12 chapters: Overview, How to use, Writing, Photography/chalk/crayon, The cast, Kheelu the product, Making new assets, Surfaces, Selling, Accessibility, Making cast photos, Pages |
| Tokens | `project/tokens.json` (master), `project/tokens.css` (generated) | Colour in Day and Bedtime, type, spacing, radius, shadow, size, stroke, motion, layers. See [tokens](tokens.md) |
| Components | `project/components/` | `bundle.js` (47 React components plus helpers on `window.Kheelona`), `bundle.css` (every `kh-` class), `index.d.ts` (every prop), and 54 folders: 47 components, 6 showcase page templates, and `Cover` (a cover card, no README). See [component map](component-map.md) |
| Assets | `project/assets/` | 224 files, 48.7 MB (`design-system/README.md:17`; recounted 2026-10-10: 232 files including 8 group READMEs). Table below |
| Fonts | `project/fonts/` | Baloo 2 (variable 400–800), Nunito (variable 200–1000), Kalam Regular and Bold; SIL OFL |
| Tools | `project/tools/` | `photo/` (face check, page-text clean-up, export, `library-log.json`) and `tokens/build_tokens_css.py` |
| Renders | `renders/` | Five JPEGs: home page desktop (full and top), phone, parent-app screens, campaign kit |
| Offline site | `index.html`, `site/` | Browsable brand book with 54 `live-*` previews. `site/runtime/` copies of `bundle.css`, `bundle.js` and `tokens.css` are byte-identical to `project/` (checked with `cmp`, 2026-10-10) and ship React 18.3.1 |

### Assets by group

| Group | Files | Formats | Web file | Notes |
|---|---|---|---|---|
| Logo | 14 | 7 SVG, 7 PNG | SVG | Day, Bedtime, Sticker, Ink, Chalk, K mark, app icon; PNG favicons, Apple touch icon, app icon, logo @2x |
| Kheelu | 5 | 3 PNG, 1 WebP, 1 JPG | `kheelu-front.webp` (no `-web` suffix; 175 KB, 1080×1324) | Front cut-out, sticker, square on cream, belly-unit crop. **Front view only** |
| Cast | 28 | 7 JPG, 14 PNG, 7 WebP | `*-portrait-web.webp` | 5 children and 2 parents × portrait, web portrait, cut-out, sticker. Cut-outs and stickers are PNG only ([G-14](gaps.md#g-14)) |
| Photo library | 50 | 25 JPG, 25 WebP | `*-web.webp` (52–155 KB) | 25 photos, 5 per child (3 with Kheelu, 2 without), in four aspect ratios |
| Doodles | 32 | SVG | SVG | 16 shapes in chalk (white) and ink; stroke paths with a grain filter |
| Crayon | 10 | SVG | SVG | Marks in Chilli, Blue, Sunshine; in code use `Mark` |
| Shapes | 9 | SVG | SVG | Cut-paper shapes; `rainbow-arch` is the only rainbow allowed in layouts |
| Icons | 76 | SVG | SVG (ink baked in) | Phosphor Bold; in code use `Icon` |

**The `-web.webp` rule:** `.jpg` for print and decks, `-web.webp` on the web
(`design-system/README.md:24`; `project/10-pages.md:67`). Stickers, cut-outs and the Kheelu sticker have
no web version, so the asset pipeline must make look-identical derivatives outside `design-system/`
(allowed by brief §4.1). The DS sets a hero-image budget (`project/06-surfaces.md:29`) that its own
hero board's sticker PNGs exceed many times over: sizes and evidence in [G-14](gaps.md#g-14).

## How it is meant to be used

- **Decision ladder** (`project/05-asset-playbook.md:5-13`): reuse → recompose from components and
  assets → adapt (crop, re-tone, translate) → generate with AI (cast protocol only) → commission. Write
  one line on why the rung above did not work.
- **Read order for agents** (`project/00-how-to-use.md:141`): Overview, How to use, the chapter for the
  job, then each component or asset-group README. Props are in `index.d.ts`.
- **Starting a web page** (`project/00-how-to-use.md:31`; `project/10-pages.md:3`): start from the
  closest page template (`HomePage`, `HomePageTrust`, `HomePageBuy`, `HomePagePhone`), keep its
  structure, swap the words and pictures.
- **Values:** tokens only, never pasted hex or one-off sizes; money through `Kheelona.formatINR`
  (`project/00-how-to-use.md:136`).
- **Changing the DS** is the owner's job only (`project/00-how-to-use.md:154-165`). For us: never; log a
  gap in [gaps.md](gaps.md) and ask (brief §4.1).
- **Ship gate** before anything goes out: brand, sales, truth and safety, accessibility, India fit
  (`project/05-asset-playbook.md:124-144`).

## How it is delivered for the web

| File | What it is | What it means for kheelona.com |
|---|---|---|
| `tokens.css` | CSS variables for every token (Day on `:root, [data-theme="light"]`, Bedtime on `[data-theme="dark"]`), 19 `kh-` type classes, 4 `@font-face` rules with relative `fonts/` URLs (`tokens.css:2-137`) | The token layer. See [tokens](tokens.md) |
| `components/bundle.css` | Every `kh-` class; reads `tokens.css` only (no hex values found). Also sets globals: `box-sizing`, `body` font and colours, `img { max-width: 100% }`, the `:focus-visible` ring (`bundle.css:1-21`) | The visual layer. Works without React: "the `kh-` classes in `bundle.css` style the same markup the components render" (`00-how-to-use.md:135`) |
| `components/bundle.js` | An IIFE that reads `window.React` (React 18.3.1 per `design-system.json` `libraries`) and puts 47 components on `window.Kheelona` (`bundle.js:1`, `:756`) | **Cannot be the site's renderer as delivered:** it renders in the browser only (brief §9.2 needs primary content in server HTML), expects React 18 on `window` while the stack runs React 19.2.4 (`package.json:36`), and is not an ES module. Its markup and behaviour are the reference to port. [G-16](gaps.md#g-16) |
| `components/index.d.ts` | Every prop and variant (435 lines). Page templates are not in it | The API contract for any port |
| `components/<Name>/README.md` | When to use, props, rules | Summarised in the [component map](component-map.md) |
| `components/<Name>/preview.html` | Live examples that expect the DS web runtime (`/_blob/<id>` asset URLs); the working offline copies are `site/live-*.html` (`design-system/README.md:23`) | Markup reference |

The DS's own minimal example loads `tokens.css`, `bundle.css`, React 18.3.1 UMD from jsDelivr, then
`bundle.js` (`00-how-to-use.md:89-131`).

## Rules a page builder must follow

Each rule is the DS's; follow the cited line for the exact value or wording.

### Colour roles (`project/README.md:25-78`)

- **18 colours.** Brand colours: **Chilli** (`chilli-500`, the logo's orange), **Kheelu Blue**
  (`blue-500`, the logo's sky blue), **Sunshine** (`sun-500`, the one accent), on cream (`fur-100`),
  white and ink (`ink-900`); plus working shades, status colours and four night tones. Names:
  [tokens](tokens.md).
- **Composition:** mostly cream, white and ink; a smaller share of Chilli and Kheelu Blue; one
  surprise (proportions at `README.md:9`).
- **Colour is a fill; words are ink.** On light grounds all text, links, eyebrows, handwritten accents
  and thin lines are ink; Chilli and Blue are never text on cream or white (`README.md:73`;
  `08-accessibility.md:27`).
- **Chilli means buying.** `cta` only for Pre-order, Reserve, Buy, **one per view** (`README.md:16`).
  The blue `primary` button **never appears on selling pages** (`07-selling.md:53`).
- On Chilli and Blue fills, text and icons are **white**; on Sunshine, **ink** (`README.md:15`). Both
  white pairs fail WCAG AA (see Accessibility below, [G-02](gaps.md#g-02) and
  [open questions](../open-questions.md) G2).
- One brand colour per block; never a chilli block beside a blue block (`README.md:74`).
- The rainbow lives on Kheelu's ears and feet and the `rainbow-arch` shape only; never a UI colour,
  block, gradient or text (`README.md:76`).

### Themes

Day (`data-theme="light"`) is the default and the only theme for marketing pages and artwork.
Bedtime (`data-theme="dark"`) is for the parent app at night and bedtime-story screens
(`README.md:77`; `00-how-to-use.md:133`; `10-pages.md:22`). The website needs no Bedtime work.

### Typography (`project/README.md:97-126`)

- Three families: **Baloo 2** (display, the speaking voice), **Nunito** (body), **Kalam** (one
  handwritten word or phrase, tilted as `README.md:103` says). Never a sentence in Kalam; at most one
  handwritten phrase per headline (`README.md:18`).
- 19 named styles from `kh-display-xl` to `kh-caption`; components use these styles only
  (`README.md:122`). Values: [`tokens.css:115-133`](../../design-system/project/tokens.css).
- **Responsive steps:** the hero headline is `kh-display-m` on phones, `kh-display-l` and then
  `kh-display-xl` on wider screens; section headings step from `kh-headline` to `kh-display-m`;
  `kh-lead` steps down on phones (`README.md:114`, `:120`). One hero headline per page.
- Weights: only those listed per family at `README.md:121`.
- Sentence case everywhere; uppercase only in the eyebrow style (`README.md:123`).
- Money in ₹ with Indian grouping (`Kheelona.formatINR`) and the two date formats, UI and long copy:
  `README.md:124-125`. Nunito carries the ₹ glyph (CoreText check).
- Indian scripts use the Baloo sister families and Noto Sans, which **are not in `fonts/`**; the shipped
  files cover Latin and Devanagari only (CoreText check: no Bengali, Telugu, Tamil or Kannada).
  [G-13](gaps.md#g-13); [open questions](../open-questions.md) G11.

### Spacing, grid and breakpoints

- Spacing scale `space-1` to `space-10` (`tokens.css:71-80`). Sections get `space-9` padding on desktop
  and `space-8` on phones; cards `space-5`; tiny nudges are the only exception (`README.md:130`).
- Grid as written: 12 columns at `content-max` with `space-7` gutters on desktop; 4 columns with a
  `space-4` gutter on phones; colour blocks may bleed (`README.md:131`).
- Grid as built: `kh-section`, `kh-container`, `kh-split` (two columns on wide screens), `kh-cols--2/3/4`
  (`10-pages.md:16-32`; `bundle.css:1121-1147`). There is no 12-column class.
- **No breakpoint tokens.** `bundle.css` hard-codes four widths, listed in [G-03](gaps.md#g-03). The
  website surface's width range and content width: `06-surfaces.md:9`; mobile first.

### Radius, lines, shadow, layers (`project/README.md:132-136`)

- Nothing has a sharp corner: cards `radius-l`; big colour panels `radius-xl`; inputs, alerts, menus
  `radius-m`; icon tiles and tooltips `radius-s`; buttons, chips, stickers `radius-pill`.
- Lines: `stroke-hair` for dividers and frames, `stroke-control` for inputs and secondary buttons,
  `stroke-focus` for focus rings and the selected-tab underline.
- Flat by default. `shadow-press` is the ink base edge under every button (it drops onto it when
  pressed); `shadow-lift` only for floating things (sticky buy bar, menus, dialogs, toasts);
  `shadow-sticker` for cut-outs.
- Layers in a fixed order: `z-sticky` < `z-popover` < `z-tooltip` < `z-overlay` < `z-toast`; dialogs
  use the browser's top layer.

### Tap targets and focus

- Anything a parent taps is at least `tap-min`; smaller visible controls extend their tap area
  invisibly; anything a child presses is `tap-kid` (`tokens.css:87-88`; `README.md:134`;
  `08-accessibility.md:33`). The DS floor is stricter than the brief's 44 × 44 px (§9.10). Exceptions:
  [G-01](gaps.md#g-01); [open questions](../open-questions.md) G11.
- Focus is always visible: a `stroke-focus` ring in the `focus` colour, offset from the element, ink on
  brand fills (`08-accessibility.md:34`; `bundle.css:18-20`).

### Icons (`project/README.md:146-153`)

Phosphor Bold only, 76 icons, via `Icon` (`currentColor`). Sizes `icon-s` to `icon-xl`
(`tokens.css:89-92`; where each is used: `README.md:149`); inside a circle or tile an icon is half the
container (`README.md:150`). No emoji on the website. Never icons that say "AI" (brains, chips,
sparkles, robots, wands). Missing icons: [G-12](gaps.md#g-12).

### Imagery

- **The children are AI-generated, illustrative characters**: "never present them as customers"
  (`design-system/README.md:24`). They are not customers, pilot families or real people; never give
  them testimonial quotes, star ratings or "real parent" labels, and never put them next to a real
  testimonial (`03-cast.md:5`, `:142`). Real testimonials use `Testimonial` with initials, never cast
  photos (`components/Testimonial/README.md`). Whether the site discloses that they are AI-generated
  is [open questions](../open-questions.md) G3.
- **The cast is fixed:** 5 children (Myra 3½, Advik 4, Ira 5, Tara 5½, Kabir 6) and Tara's parents
  Meera and Arnab (`03-cast.md:7-15`). Never invent recurring children. **Parents appear only with
  Tara** (`03-cast.md:80`). Match the child to the message; languages follow the character
  (`03-cast.md:77-84`).
- **Settings:** home, studio sweep or plain wall; never outdoors (`README.md:21`; `02-imagery.md:13`).
- **Never** mirror a photo, lighten skin, smooth faces or change features (`03-cast.md:139-141`).
- Per page: each child at most twice, at least three of the five (`10-pages.md:67`). Picture choice per
  section: `10-pages.md:54-65`.
- Keep part of every frame calm for text; never crop at the wrist, knee or neck (`02-imagery.md:35`).
- **Imagination layer** (the signature): chalk on dark, ink on light; 3–5 doodles with one hero; never
  across a face; Kheelu stays in front; the child's question as real text, in Kalam, lower case
  (`02-imagery.md:43-53`; `08-accessibility.md:48`). **Not on safety, pricing or data screens**
  (`02-imagery.md:57`).
- **Crayon marks:** one per headline; never under body copy or behind prices in the checkout
  (`02-imagery.md:74`). **Shapes:** at most two per view, never touching text (`02-imagery.md:76`).
- **Alt text:** who, what and the feeling in one sentence, no "image of" (`01-writing.md:111-113`);
  decorative doodles, marks and shapes get `alt=""` (`08-accessibility.md:47`).
- **Not in the DS:** real video, real team photos, the illustrated mascot, other product angles
  ([G-14](gaps.md#g-14)). Imagery beyond the DS is [open questions](../open-questions.md) G3.

### Kheelu, the product (`project/04-kheelu.md`)

- Always the real product photo: whole, upright, in focus; never redrawn, restyled or AI-generated
  (`README.md:20`; `04-kheelu.md:29-37`). The **belly unit is visible in every hero shot**
  (`04-kheelu.md:32`). One Kheelu per frame. No screens, glowing eyes, holograms or sparkles.
- Check every image against the anatomy table (`04-kheelu.md:5-15`).
- Names: Kheelona (company), Kheelu (toy), PlayOS, Kheelona+, Kheelu Speaker, AI books, the parent app,
  AI mode / Story mode / Bluetooth mode; never "Lumi" (`04-kheelu.md:39-50`).
- The **illustrated Kheelu mascot is not in the system**: "When its files are added, keep it to these
  five expressions. Never redraw it." (`04-kheelu.md:66`).
- The five feelings (Curious, Grumpy, Sad, Silly, Joy) and their icons (`04-kheelu.md:54-64`).
- The DS also lists product facts and claims (`04-kheelu.md:68-77`; `01-writing.md:63-71`). In this
  wiki they are owned by [product facts](../product/facts.md) and [claims](../product/claims.md).
  Where the DS's lines conflict with the positioning or a founder ruling (for example its wake-word line,
  `04-kheelu.md:73`, which uses wording retired in [claims §4](../product/claims.md#4-retired-or-banned-wording),
  and calling Kheelu a "friend"), the conflicts are listed in
  [brand voice](../brand/voice.md#where-they-conflict); the open one is
  [open questions](../open-questions.md) G5.

### Surfaces: the website (`project/06-surfaces.md:20-29`)

- Order sections as in Selling; alternate `surface` and `surface-band` bands, one colour moment each.
- Header: `AnnouncementBar` (offer and ship date) above `NavBar` (logo, five links, cta).
- Hero: `SectionHeading` hero with one `Hand` phrase, a real photo or a cast sticker on a brand block,
  the cta, and a trust line under it.
- Phones: `StickyBuyBar` after the hero scrolls away; the nav collapses to the menu button and
  `NavDrawer`.
- Links in body copy use the `link` colour and are always underlined.
- Performance: serve the web files, lazy-load below the fold, keep the hero image within the DS's
  budget (`06-surfaces.md:29`; [G-14](gaps.md#g-14)).
- WhatsApp share and OG image: one face, one line; sizes at `06-surfaces.md:15`.

### Selling (`project/07-selling.md`)

- **The parent's path:** each question a parent has maps to a component, from "What is this?" (hero) to
  "What does it cost, and is it risky?" (`OfferCard`, `StickyBuyBar`) (`07-selling.md:5-16`).
- **Product page skeleton**: 15 sections, a cta after the hero, safety, compare and close, and
  `StickyBuyBar` on phones throughout (`07-selling.md:18-38`). Fold by fold:
  [component map](component-map.md#page-templates).
- **Price and offer rules** (`07-selling.md:40-47`): lead with the barrier price where it helps and show
  the full price nearby; a struck-through price only if real and labelled as the later price, never
  "MRP" unless it is; "refundable" next to the deposit and "including GST" near the price; unit counts
  only from live inventory (our store never publishes the count: [G-08](gaps.md#g-08),
  [open questions](../open-questions.md) G9); countdowns only for a real deadline. Our price source of
  truth is [pricing](../product/pricing.md), not the DS's sample values ("correct on 8 Oct 2026",
  `README.md:23`).
- **CTA hierarchy** (`07-selling.md:49-55`): one `cta` per view; secondary buttons for learning actions;
  ghost buttons or text links for tertiary; the WhatsApp share as a secondary button with the WhatsApp
  icon. CTA wording: `01-writing.md:49-61`. The label candidates are owned by
  [messaging](../brand/messaging.md#cta-labels); the one label is [open questions](../open-questions.md)
  G1; the DS-versus-brief tension is [G-07](gaps.md#g-07).
- **Objections and proof** (`07-selling.md:57-66`). **Trust signals:** real pilot parents only, with
  consent and never with cast photos; recognitions as a quiet "Recognised by" row of names; policies
  linked near the price (`07-selling.md:68-73`).
- **Never:** fake reviews, fake scarcity, "just bought" pop-ups, fake countdowns, fear selling, selling
  to children, dark patterns (`07-selling.md:75-80`). Follow ASCI for advertising involving children
  (`01-writing.md:71`).

### Accessibility (`project/08-accessibility.md`)

- **Allowed contrast pairs** per theme: `08-accessibility.md:9-23`. Recomputed from the token hex values
  with the WCAG formula (2026-10-10): all pass AA ([gaps: checked](gaps.md#checked-no-gap-found)).
- **The two exceptions:** white on Chilli and white on Kheelu Blue, below AA, kept as brand decisions of
  9 and 10 Oct 2026, for short bold labels, icons with a word and big headlines only. The DS names the
  passing alternative, ink on the fill, which "needs the owner's OK" (`08-accessibility.md:25`).
  axe-core flags them as **serious**, which collides with brief §9.6. Ratios and evidence:
  [G-02](gaps.md#g-02); decision: [open questions](../open-questions.md) G2.
- **Not allowed:** white on Sunshine; small or long white text on Chilli or Blue; Chilli, Blue or
  Sunshine as text or thin lines on light grounds (`08-accessibility.md:27`).
- **Interaction:** `tap-min` targets, visible focus, status never by colour alone, visible form labels
  with `aria-describedby` hints, native `<dialog>`, the ARIA tabs pattern, tooltips never essential,
  polite toasts (`08-accessibility.md:31-43`).
- **Media and language:** captions on all video, never autoplay audio; mark other-language text with
  `lang` (`08-accessibility.md:45-56`).
- **Children's privacy:** real children only with written consent; never a real child's full name,
  school or exact location; conversation snippets clearly illustrative or consented
  (`08-accessibility.md:65-69`).

### Pages (`project/10-pages.md`)

- Build from components plus the layout classes (`kh-page`, `kh-section`, `kh-container`,
  `kh-section__head`, `kh-section__actions`, `kh-split`, `kh-cols`, `kh-photo`, `kh-trustline`,
  `kh-art`, `kh-device`) so a page never needs its own spacing (`10-pages.md:16-32`).
- Rhythm: alternate bands; one `cta` per view; one accent per headline; the hero is the only display-xl
  headline; **close every section with a button or a link** (`10-pages.md:34-40`).
- Scrapbook board: one brand block, one shape behind, the cut-outs (cast sticker bottom-aligned, Kheelu
  sticker tilted), one doodle, one sticker; stop when it feels full; place layers in %
  (`10-pages.md:42-52`).
- Phones: nav to the menu button and `NavDrawer`; hero words first, full-width cta, trust line, then the
  board; `StickyBuyBar` once the hero scrolls away, hidden while the `OfferCard` is on screen; splits
  stack; `ModeSwitch` drops its icons (`10-pages.md:69-74`).
- **The video section is left out of the templates** "because the templates don't use stand-in
  footage: add it only with real video" (`10-pages.md:14`; [open questions](../open-questions.md) G3).

## What we measured on the DS's own sample home page

Headless Chrome on `design-system/site/home-page.html` (the three home templates on one page),
2026-10-10, 1x, no browser chrome. These describe the DS templates, not our future build.

| Check | 360×640 | 390×844 | 412×915 | 1366×768 |
|---|---|---|---|---|
| Hero cta fully inside the first viewport | Yes, bottom at 572 px | Yes, 544 px | Yes, 544 px | Yes, 634 px |
| Chilli CTAs in the first viewport ([G-06](gaps.md#g-06)) | 2 (nav and hero) | 2 | 2 | 2 |
| Page scrolls sideways ([G-04](gaps.md#g-04)) | **Yes, 406 px wide** | **Yes, 406 px** | No | No |
| Interactive targets under 44 px ([G-01](gaps.md#g-01)) | AnnouncementBar link 65×20; FeatureCard link 24 tall; AppSummaryCard link 24 tall | same | same | same, plus nav link "Team" 41 wide |

axe-core 4.12.1 (WCAG A and AA tags): 11 serious `color-contrast` nodes at both widths, all white on
Chilli or Kheelu Blue; at 390 px also one serious `scrollable-region-focusable` on the ComparisonTable
wrapper. Causes and evidence: [gaps](gaps.md) (G-02, G-05).

## Related

- [Component map](component-map.md) · [Tokens](tokens.md) · [Motion](motion.md) · [Gaps](gaps.md) · [Manifest](manifest.md)
- Voice and copy rules from `01-writing.md`: [brand voice](../brand/voice.md)
- Audience ("who we sell to", `05-asset-playbook.md:50-54`): [audience](../brand/audience.md)
- Prices, offer and checkout: [pricing](../product/pricing.md), [checkout](../site/checkout.md)
