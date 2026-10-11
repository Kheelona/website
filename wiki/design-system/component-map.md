---
title: Design system component map
type: design-system
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - design-system/project/components/index.d.ts
  - design-system/project/components/*/README.md
  - design-system/project/components/bundle.js
  - design-system/project/components/bundle.css
  - design-system/project/components/HomePage/preview.html
  - design-system/project/components/HomePageTrust/preview.html
  - design-system/project/components/HomePageBuy/preview.html
  - design-system/project/components/HomePagePhone/preview.html
  - design-system/project/README.md
  - design-system/project/07-selling.md
  - design-system/project/10-pages.md
  - "Headless Chrome and axe-core 4.12.1 on design-system/site/home-page.html, 2026-10-10"
---

# Design system component map

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

DS citations (`design-system/…`; short forms such as `index.d.ts:92` or `bundle.css:336` are files under
`design-system/project/` and its `components/`) refer to DS v11 as delivered and checksummed in the
[manifest](manifest.md); the DS is in no git tag ([D004](../decisions/D004-internal-material-uncommitted.md)).
Sizes and other values are not copied here: follow the cited `index.d.ts`, `tokens.css` or `bundle.css` line.

Every component in DS v11: what it is for, its main props and variants, where it serves
kheelona.com, and phone notes. Props are summarised from `components/index.d.ts` (line numbers given);
the full rules are in each `components/<Name>/README.md`. How to deliver them for the web (the bundle
is client-only React 18): [overview](overview.md#how-it-is-delivered-for-the-web) and
[G-16](gaps.md#g-16).

**Site use:** **Site** = needed on kheelona.com · **Store** = likely on the checkout host
(store.kheelona.com; the journey is owned by [checkout](../site/checkout.md)) · **App** = parent-app
only · **Marketing** = social, decks, email, not web pages.

## Selling

| Component | Purpose | Key props and variants (`index.d.ts`) | Site sections | Phone notes |
|---|---|---|---|---|
| `OfferCard` | The pre-order box: price, later price, refundable reserve split, perks, one chilli cta | `product`, `price`, `was`, `deposit`, `balance`, `shipDate`, `perks[]`, `sticker` (text or false), `cta`, `href`, `fine`, `unitsLeft` + `unitsTotal` (live inventory only) (`:92-111`). Defaults are the DS's 8 Oct 2026 sample offer; default cta label at `bundle.js:292` (label candidates: [messaging](../brand/messaging.md#cta-labels)) | Close of every selling page; product page buy box (`OfferCard/README.md`). **Site** | One per page. Always renders the deposit split, so it cannot show a paid-in-full offer, and its unit counter must not be used ([G-08](gaps.md#g-08); [open questions](../open-questions.md) G9) |
| `StickyBuyBar` | Phone-only bottom bar: price, a note, a chilli button | `price` (string), `note`, `cta`, `href` (`:116-117`). Default cta label at `bundle.js:312` | Product and landing pages on phones (`StickyBuyBar/README.md`). **Site** | Show after the hero cta leaves, hide while the OfferCard is visible, leave page padding equal to its height (`StickyBuyBar/README.md`). None of this is built in: it is only `position: sticky; bottom: 0` (`bundle.css:414-430`) ([G-09](gaps.md#g-09)); its motion is [open questions](../open-questions.md) G4 |
| `AnnouncementBar` | Slim Sunshine strip above the nav for the offer and ship date | `items[]` (1–3 strings, dot-separated), `link` (`:113-114`) | Top of every page. **Site** | May wrap to two lines on phones. Its link has no tap extension ([G-01](gaps.md#g-01); [open questions](../open-questions.md) G11) |
| `ComparisonTable` | A fair category comparison, Kheelu's column highlighted | `columns[]`, `rows[{label, values[]}]` (values starting "Yes"/"No" get a tick/cross), `usIndex`, `caption`, `firstColumn` (`:119-127`) | "Why not a phone, or a regular toy?". **Site** | Scrolls sideways on phones (`bundle.css:336-337`); the scroll wrapper is not keyboard-focusable (axe serious) ([G-05](gaps.md#g-05); a stacked phone variant is [open questions](../open-questions.md) G11) |
| `TrustList` | 2×2 cream panels: icon in a Kheelu Blue circle, promise title, one-line mechanism | `items[{icon, title, body}]` (`:129-130`) | Safety section; safety page. **Site** | One column on phones (`bundle.css:354`) |
| `Testimonial` | Cream quote card, handwritten quote mark, initials avatar | `quote` or children, `name` (first name), `role` (default "Pilot parent"), `city`, `tone` (`:132-133`) | "What parents tell us". **Site, only with real quotes and consent** | Max three at once. Never with cast photos |

## Content

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `SectionHeading` (+ `Hand`, `Mark`) | Eyebrow, Baloo headline with at most one accent, Nunito lead | `eyebrow` (≤4 words), `title`, `lead`, `align` (left, center), `hero` (steps `kh-display-m` → `-l` → `-xl`, `:49`), `level` (1–3), `tone` (`:43-56`). `Hand({tone})`: Kalam −3°. `Mark({tone, kind})`: `underline`, `highlight`, `circle` (`:57-58`) | Opens every section; the hero (once per page). **Site** | Hero is `kh-display-m` on phones, section heads `kh-headline` (`README.md:120`) |
| `FeatureCard` | Card with icon circle, title, 1–2 sentences | `tone`, `variant` (`plain`, `tint`, `block`), `icon`, `title`, children, `link` (`:60-69`) | "What Kheelu does", "What's in the box", feature grids. **Site** | At most one `block` per row. Its `link` has no tap extension ([G-01](gaps.md#g-01); [open questions](../open-questions.md) G11) |
| `StepLoop` | 3 (max 4) numbered steps with handwritten numerals and drawn arrows | `steps[{title, body, tone}]` (`:71-72`) | How it works; reservation steps (reserve → we ship → pay balance). **Site** | Steps stack; arrows only on wider screens (`bundle.css:215-231`) |
| `AgeTimeline` | Four cards: age 3, 4, 5, every year after | `items[{age, title, body, note, tone}]` (`:74-75`) | Year by year; age-fit FAQ. **Site** | One column on phones, four on wide screens (`bundle.css:247`). Ages are props: the DS sample shows 3, 4, 5 and "every year after"; the published band is 3–7 ([open questions](../open-questions.md) section E) |
| `FeelingChip` | Kheelu's five feelings as chip or card | `feeling` (curious, grumpy, sad, silly, joy), `card`, `label`, `description`, `tone` (`:77-83`) | Feelings section. **Site** | Chips wrap |
| `LanguageChips` | Each language in its own script plus English name; dashed "coming" chip | `languages[{native, english, lang, soon}]` (`:85-87`). Default list: 8 languages plus "+2 more at launch" (`bundle.js:238-248`) | Hero languages row; languages section. **Site** | Native scripts need fonts the DS does not ship; default entries carry no `lang` ([G-13](gaps.md#g-13); [open questions](../open-questions.md) G11) |
| `FAQ` | Rounded accordion on native `<details>`, plus sign turns to a cross | `items[{q, a, open}]` (`:89-90`) | Questions near the cta; safety page; checkout reassurance. **Site, Store** | 5–8 items, answers under 60 words; first item open on safety pages only |
| `Badge` | Small status or category pill | `tone` (chilli, blue, sun, success, warning, danger, neutral), `variant` (soft, solid), `icon` (`:320-321`) | "Coming soon" (Kheelu Speaker, AI books), "First 500". **Site** | Labels, not buttons |
| `Sticker` | Tilted, white-outlined label or round price burst | `tone`, `tilt` (range at `:30`), `icon`, `hand`, `round` + `big` (`:28-41`) | Hero board ("₹499 reserves yours"), "Ages 3+", "First 500 only". **Site** | Max two per view; never over a face or the belly unit. Chilli and blue stickers carry white text, which fails AA ([G-02](gaps.md#g-02); [open questions](../open-questions.md) G2) |

## Brand

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `Logo` | The official wordmark or K mark | `variant` (auto, day, bedtime, sticker, ink, chalk), `mark`, `height` (default and minimum at `:248`), `title` (`:242-255`) | Header and footer (heights set at `bundle.js:724`, `:735`), favicon via the Logo files. **Site, Store** | Below the minimum height use the mark |
| `Icon` | 76 Phosphor Bold icons, `currentColor` | `name`, `label` (makes it `role="img"`) (`:238-239`) | Everywhere. **Site, Store** | Sizes `icon-s` to `icon-xl` (`tokens.css:89-92`; where each is used: `README.md:149`) |
| `ImaginationFrame` | A child with chalk or ink doodles and their question | `variant` (board, photo), `ink`, `photo` or `cutout`, `alt`, `question`, `questionAlign`, `doodles[{src, x, y, w, rotate, clip}]` (%), `tone` (`:135-155`) | The Imagination layer section; learning stories. **Site** | Scales by %. Not on safety, pricing or data screens |
| `CastCard` | Portrait card for a cast member | `name`, `age`, `city`, `languages`, `line`, `photo`, `tone`, `alt` (`:157-158`) | **Not for the public site** ("On the public site, use the cast inside layouts, not as 'meet our kids' cards", `CastCard/README.md`) | n/a |

## Actions

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `Button` | Pill button on an ink base edge | `variant`: `cta` (Chilli, buying only, one per view), `primary` (Blue, everyday, not on selling pages), `secondary` (ink outline), `ghost` (underlined text), `danger`; `size`: `s`, `m`, `l` (`s` keeps a full tap area, `:14`); `icon`, `iconEnd`, `href` (renders `<a>`), `block`, `loading`, `tone` (`:10-26`) | Every cta and secondary action. **Site, Store** | Hero cta is `l` and `block` on phones. Labels 2–4 words, verb first, `white-space: nowrap` (`bundle.css:93-107`) |
| `IconButton` | Round icon-only button | `icon`, `label` (required), `variant` (ghost, outline, primary), `size` (s, m, l; `s` keeps a full tap area, `:263`), `href` (`:258-267`) | Menu and close buttons; video play. **Site** | Never for buying |
| `Menu` | Button opening a short action list | `label` or `icon` + `ariaLabel`, `variant`, `size`, `items[]`, `align`, `defaultOpen` (`:269-282`) | Unlikely on the site. **App** | Up to 7 items |

## Forms

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `TextField` | Labelled input, hint or error, full tap height | `label`, `hint`, `error`, any `<input>` attribute (type, inputMode, autocomplete) (`:229-230`) | Checkout form fields, contact. **Store, Site** | Pass the right `type` and `autocomplete` (brief §9.10) |
| `TextArea` | Multi-line field with counter | `label`, `hint`, `error`, `maxLength`, `rows` (`:285-286`) | Contact, support. **Site** | |
| `Select` | Native dropdown, same pattern | `label`, `options[]`, `placeholder`, `hint`, `error` (`:288-295`) | State in an address form. **Store** | Stays native so phones show their picker |
| `Checkbox` | Box on a full tap-height row; indeterminate | `label`, `hint`, `indeterminate` (`:297-298`) | Consent ("never pre-ticked"). **Store** | Checked tick is white on Blue, below the non-text minimum ([G-02](gaps.md#g-02)) |
| `RadioGroup` | Native fieldset of radios | `label`, `name`, `options[]`, `value`, `inline` (`:300-310`) | "Delivery options at checkout" (`RadioGroup/README.md`). **Store** | Same white-on-Blue dot ([G-02](gaps.md#g-02)) |
| `Switch` | Immediate on/off setting | `label`, `hint` (`:312-313`) | **App** | |
| `Tag` | Toggle, removable or static chip | `selected`, `onClick`, `onRemove`, `icon` (`:315-316`) | Story filters on /stories, if wanted. **Site (optional)** | Tap areas extended to the full tap height (`bundle.css:862-868`) |

## Feedback and overlays

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `Alert` | Inline notice | `tone` (info, success, warning, danger), `title`, `action`, `onClose`, `icon` (`:323-324`) | Form-level errors in the checkout. **Store**. Never for marketing | `danger` uses `role="alert"` |
| `Toast` | Short message after an action, optional Undo | `tone`, `icon`, `action`, `onClose` (`:326-327`) | Possibly "Link copied" after a share. **App, Site (rare)** | Inside a `kh-toast-region` |
| `Tooltip` | Hover/focus label | `label`, `placement`, `open` (`:329-330`) | Rare; never essential information (not reachable by touch) | |
| `ProgressBar` (+ `Spinner`) | Known progress; indeterminate activity | `value`, `max`, `label`, `showValue`, `valueText`; `Spinner`: `size`, `label` (`:335-343`) | Checkout loading (`Button loading` uses the spinner); a step indicator if the checkout has steps. **Store** | The Blue fill is below 3:1 on its track ([G-02](gaps.md#g-02)), so write the value out |
| `Dialog` (+ `BottomSheet`) | Native `<dialog>` modal; sheet version for phones | `open`, `onClose`, `title`, `actions[]`, `sheet`, `inline` (`:346-361`) | Rare on the site ("Never open a dialog on page load or to sell something"). **Store (rare)** | No open or close animation in CSS ([motion](motion.md)) |
| `EmptyState` | Icon in a soft circle, title, one sentence, next step | `icon`, `tone`, `title`, `action` (`:332-333`) | The 404 page and empty search, composed. **Site** | |

## Navigation

| Component | Purpose | Key props and variants | Site sections | Phone notes |
|---|---|---|---|---|
| `NavBar` | Header: logo, up to five links, small chilli cta; menu button on phones | `links[{label, href, current}]`, `cta{label, href}`, `brand`, `homeHref`, `drawerNote` (`:232-233`) | Every page. The README fixes the five links as Meet Kheelu, PlayOS, Safety, Stories, Team and sends new pages to the footer (`NavBar/README.md`). **Site** | Links fold into the menu button on phones (`bundle.css:638-642`). Its cta sits in the same first view as the hero cta ([G-06](gaps.md#g-06); [open questions](../open-questions.md) G2) |
| `NavDrawer` | Phone menu panel from the right, links in Baloo 2, cta pinned at the bottom | `open`, `onClose`, `links[{…, icon}]`, `cta`, `note`, `homeHref`, `label`, `inline` (`:363-374`) | Phones, opened by `NavBar`. **Site** | Focus moves in, Tab stays inside, Escape or scrim closes. README says it "slides in", but no transition exists ([motion](motion.md)) |
| `Tabs` | Line or pill tabs, ARIA pattern | `tabs[{id, label, icon, count, content}]`, `value`, `variant` (line, pill), `label` (`:377-386`) | Product details (Specs / In the box / Safety), per `Tabs/README.md`. **Site** | 2–5 tabs, 1–2 word labels |
| `Footer` | Logo, promise line, "Designed by parents in Bengaluru", link columns, legal links | `brand`, `promise` (default "Wake-word listening. No open internet. You see everything."), `made`, `columns[]`, `legal[]` (`:235-236`) | Every page. Must link refund, shipping and privacy. **Site, Store** | Footer links are full tap-height rows (`bundle.css:651`) |
| `TabBar` | App bottom navigation | `items[]`, `value`, `onChange` (`:388-389`) | **App** | |

## App and marketing only (not for web pages)

| Component | Purpose | Note for the site |
|---|---|---|
| `AppSummaryCard` | "Today with Kheelu" card (`:196-209`) | May appear on the site as an **illustrative app screenshot, labelled as such** (`AppSummaryCard/README.md`). Its link has no tap extension ([G-01](gaps.md#g-01)) |
| `ParentControl` | Grouped settings switches (`:211-217`) | App |
| `ModeSwitch` | Segmented control for AI mode, Story mode, Bluetooth (`:219-227`) | Used on the site to **explain** the modes ("A day with Kheelu"); drop icons on phones (`10-pages.md:74`). The selected mode is white on Blue (axe flags it; [G-02](gaps.md#g-02)) |
| `ListItem` (+ `List`), `Avatar` | App rows and avatars (`:391-410`) | App |
| `SocialPost` (4:5), `DeckSlide` (16:9) | Marketing artboards (`:160-194`) | Not web pages; `SocialPost` could build a 1080×1080 share image |
| `formatINR` | ₹ with Indian grouping (`:412-413`) | Our build needs one ₹ formatter (brief §9.12); match its output: `formatINR(100000)` = "₹1,00,000" |

`Cover` (`components/Cover/preview.html`) is the DS's own 960×300 cover card: no README, not in the
bundle, not for the site.

## Layout classes (in `bundle.css`, no React)

`kh-page`, `kh-section` (+ `--band`, `--tight`), `kh-container`, `kh-section__head`,
`kh-section__actions` (+ `--center`), `kh-split` (+ `--wide-start`, `--wide-end`; ratios at `10-pages.md:27`),
`kh-cols--2/3/4`, `kh-photo` (+ `--wide`, `--square`, `--xl`), `kh-trustline`, `kh-art` (scrapbook
board, layers `img.kh-art__layer`), `kh-device` (phone frame for docs, "not part of the page",
`HomePagePhone/README.md`). Definitions: `10-pages.md:16-32`; CSS `bundle.css:1121-1174`.

## Page templates

Showcase pages, not bundle exports: "Copy the structure; swap the words, photos and stickers"
(`HomePage/README.md`). The three desktop parts together are the home page and follow the product-page
skeleton in `07-selling.md:18-38`; the video fold (skeleton step 4) is left out until real video exists
(`10-pages.md:14`). The copy, prices and claims in the templates are **sample content dated 8 Oct 2026**,
not approved copy for our site.

### HomePage: part 1 of 3, 1280 wide (`HomePage/preview.html`)

| # | Fold | Built from | Band |
|---|---|---|---|
| 1 | Offer strip ("First 500 Kheelus at ₹4,999 · Ships from 20 Oct 2026", link "Pre-order") | `AnnouncementBar` | Sunshine |
| 2 | Header (Meet Kheelu, PlayOS, Safety, Stories, Team; cta "Pre-order Kheelu") | `NavBar` | cream |
| 3 | Hero: eyebrow "Screen-free · Ages 3+", H1 "A best friend at 3. A *head start* for school.", lead; cta (`l`, arrow) and secondary "See how it works"; trust line (Screen-free · No open internet · Ships 20 Oct 2026); scrapbook board on Kheelu Blue (Myra sticker, Kheelu sticker, sun shape, question-mark doodle, round "₹499 reserves yours" sticker) | `kh-split--wide-start`, `SectionHeading` hero, `Button` ×2, `kh-trustline`, `kh-art kh-tone-blue`, `Sticker round` | cream |
| 4 | Languages: "Speaks the languages of your home" | `LanguageChips` | cream (same section) |
| 5 | How it works: "A loop that *learns* your child." Three steps; ghost "Read the science" | `SectionHeading` + `Mark`, `StepLoop`, `Button ghost` | band |
| 6 | Year by year: "It grows with them, *year by year.*" | `AgeTimeline` (4) | cream |
| 7 | A day with Kheelu: three 4:5 photos (Myra, Advik, Ira) with captions; mode switch and a note | `kh-cols--3`, `kh-photo` ×3, `ModeSwitch` | band |

### HomePageTrust: part 2 of 3, 1280 wide (`HomePageTrust/preview.html`)

| # | Fold | Built from | Band |
|---|---|---|---|
| 8 | What Kheelu does: "Small toy. *Big head start.*" Three cards (plain, tint, block) | `FeatureCard` ×3 | cream |
| 9 | The Imagination layer: Kabir with the worn chalk helmet, "how do astronauts sleep?"; ghost "See all stories" | `kh-split--wide-end`, `ImaginationFrame photo` (helmet with `clip`), `SectionHeading` | band |
| 10 | Safety: "Safety is not a feature. It is *the whole product.*" Four promises; secondary "See how we built safety in" and **cta**; "Recognised by" line | `TrustList`, `Button` secondary + cta | cream |
| 11 | Feelings: Tara photo, "Five feelings, *named out loud.*", five chips | `kh-split--wide-end`, `kh-photo`, `FeelingChip` ×5 | band |
| 12 | The parent app: "You see *everything.*" Tara and her mother photo; secondary "See what the app shows you"; app in a phone frame | `kh-split`, `kh-photo--wide`, `kh-device` + `AppSummaryCard` + `TabBar` | cream |

At phone widths the parent-app fold makes the page scroll sideways: the `kh-device` frame widens the
single-column `kh-split` (measurements in [G-04](gaps.md#g-04)).

### HomePageBuy: part 3 of 3, 1280 wide (`HomePageBuy/preview.html`)

| # | Fold | Built from | Band |
|---|---|---|---|
| 13 | Compare: "Why not a phone, or a regular toy?" 4 columns × 6 rows; **cta** | `ComparisonTable`, `Button cta` | band |
| 14 | Pilot parents: "What parents *tell us*", two quotes | `Testimonial` ×2 | cream |
| 15 | Questions: heading, ghost "See all questions", six FAQs (price, ages, languages, listening, internet, shipping), first open | `kh-split--wide-end`, `SectionHeading`, `FAQ` | band |
| 16 | Close: "Reserve yours for *₹499.*" Scrapbook board on Sunshine (Advik sticker, Kheelu sticker, flower shape, ink heart); offer card; "Know a parent who needs this?" and secondary "Share on WhatsApp" | `kh-split`, `kh-art kh-tone-sun`, `OfferCard`, `Button secondary` + `whatsapp-logo` | cream |
| 17 | Footer: three columns (Kheelu, Read, Help), legal line | `Footer` | band |

The templates add two folds that the `07-selling.md` skeleton does not list (8 "What Kheelu does" and 9
"The Imagination layer") and show two testimonials where the skeleton says three. CTAs appear after the
hero, safety, compare and close, as `10-pages.md:38` says.

### HomePagePhone: 390 wide, three frames (`HomePagePhone/preview.html`)

| Frame | Shows |
|---|---|
| 1 · The hero | `AnnouncementBar` ("First 500 at ₹4,999 · Ships 20 Oct 2026"), `NavBar` with cta and menu button, hero headline and lead, **full-width `l` cta**, trust line (wraps), the board under the words |
| 2 · Scrolled | How it works (band) with `StickyBuyBar` at the bottom: "₹4,999", "Reserve for ₹499 today", cta "Pre-order" |
| 3 · Menu open | `NavDrawer` over the scrim, five links with chevrons, cta "Pre-order Kheelu", note "Ships from 20 Oct 2026. Full refund until it ships." |

Render: `design-system/renders/home-page-phone.jpg`. The phone hero has two chilli buttons in one view
(nav and hero; [G-06](gaps.md#g-06), [open questions](../open-questions.md) G2), and the sticky bar's label differs from the hero's
([G-07](gaps.md#g-07), [open questions](../open-questions.md) G1).

### AppScreens and CampaignKit (not for the site)

- `AppScreens` (4 × 390): setup, today, conversations, settings in Bedtime (`AppScreens/README.md`).
- `CampaignKit` (1280): four `SocialPost`s, a 1200×630 WhatsApp preview and message, a `DeckSlide`, a
  600 px email, a 9:16 Story cover (`CampaignKit/README.md`). Its WhatsApp preview is the DS's pattern
  for our OG image.

## What the DS has no component for

Breadcrumbs, long-form article layout, video player, product gallery, spec table, checkout order
summary and confirmation, consent banner. See [G-11](gaps.md#g-11) for each, with what can be composed;
video and other imagery beyond the DS are [open questions](../open-questions.md) G3, a consent banner G6.
