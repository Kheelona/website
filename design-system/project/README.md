Kheelona makes Kheelu, a screen-free AI friend for children aged 3 and up, designed by parents in Bengaluru. The parent buys and the child plays. Every Kheelona surface (website, parent app, decks, ads, social posts, WhatsApp creatives, print) runs on this system: **cream like Kheelu's fur, the two colours of our logo, sunshine for ideas, and a little chalk magic for the thinking he sparks.**

New here? Start with **How to use this system**: where everything is, which part to use for each job, and how to change the system safely. Then read this page. The other sections go deeper: **Writing**, **Photography, chalk & crayon**, **The cast**, **Kheelu, the product**, **Making new assets (for agents)**, **Surfaces**, **Selling**, **Accessibility & inclusion**, **Making cast photos (step by step)**, and **Pages: putting it together**, which shows whole pages built from the system.

## The five principles

1. **Parent buys, child plays.** Speak to parents with calm proof. Show children with real joy. Never sell to the child.
2. **Low-key, but informative.** Quiet layouts and real facts. Use numbers, not adjectives: "Up to 10 languages", "₹499 today", "Ships 20 Oct 2026".
3. **Clean, but engaging.** About 80% of any layout is cream, white and ink, 15% is Chilli and Kheelu Blue, and 5% is one surprise: a sunshine sticker, a handwritten word or a chalk doodle.
4. **Tech, but fun. Never SaaS.** Show intelligence through the child's imagination (the chalk **Imagination layer**), never through circuits, glowing brains, robots, holograms, sparkles or blue-purple gradients.
5. **Every screen sells, and tells the truth.** Each screen has one chilli `cta`, real prices and real dates. No fake countdowns, invented scarcity or invented reviews.

## Rules an agent must not break

- Use tokens only. Never paste hex values. Text is `text` or `text-muted` on `surface`, `surface-raised` and `surface-band`. On Chilli (`chilli-500`) and Kheelu Blue (`blue-500`) fills, text, ticks and icons are white; on Sunshine (`sun-500`), they are `ink-900`.
- **Chilli means buying.** `cta` (chilli) is for buying actions only: Pre-order, Reserve, Buy. Use one per view. Everyday actions (Continue, Save, Connect) are Kheelu Blue `primary`, with white text.
- Use the `Logo` component or the Logo files. Never retype "Kheelona" in a font as a logo, recolour it or redraw it.
- Use one handwritten (`kh-hand-*`, Kalam) word or short phrase per headline, at most. Never set a sentence in Kalam.
- Use the cast in **The cast**. Never invent new recurring children, and never present the cast as real customers.
- Never redraw, restyle or AI-generate Kheelu from text. Use the product photos in **Kheelu**, or composite them.
- Photos are set at home, in a studio, or on a plain background. No beaches, parks, streets or other outdoor locations.
- Write "Kheelu" for the toy and "Kheelona" for the company and platform. Never write "Lumi", the toy's name until September 2026.
- Prices, dates and offers change. Check the store (store.kheelona.com) before publishing. The offer used across this system was correct on 8 Oct 2026: ₹499 refundable reserve, ₹4,999 for the first 500 units, ₹7,999 after that, ₹4,500 balance at dispatch, shipping from 20 Oct 2026, 6 months of Kheelona+ included, prices including GST.

## Colour

**The two colours of our logo, one accent, on cream.** A brand is remembered by a few colours used with discipline. Kheelona's palette is the logo's own orange and sky blue, Sunshine, and cream, white and ink:

| Colour | Token | Hex | Share of a layout | Its one job |
|---|---|---|---|---|
| **Chilli** | `chilli-500` | #EF762F | about 5% | The logo's orange. The buy button, with white text, and brand moments: colour blocks, stickers, artwork. Never another button or control. |
| **Kheelu Blue** | `blue-500` | #29A0D7 | about 10% | The logo's sky blue. Everyday buttons and selection (`primary`), colour blocks, stickers, avatars and artwork, always with white on it. |
| **Sunshine** | `sun-500` | #FFCF4D | about 5% | The one accent: highlighter swipes, stickers, badges, the idea, and warnings. |
| Cream | `fur-100` | #FBF5EB | most of it | Kheelu's fur: the page. |
| White | `white` | #FFFFFF | | Cards, sheets, menus, sticker outlines, and text on Chilli and Kheelu Blue. |
| Ink | `ink-900` | #2A2118 | | All text and icons on light grounds, and text on Sunshine. Warm near-black, never #000. |

Everything else is a working shade, kept to the minimum. There are no tints, no light steps and no deep steps: quiet panels are cream, colour comes from one fill (a button, icon circle, badge, sticker or block), and words on light grounds are ink.

| Shade | Token | Hex | Use |
|---|---|---|---|
| Cream band | `fur-200` | #F3E8D7 | Alternating bands, input fills and every quiet panel: quotes, FAQs, tips, notices, offer details. |
| Line | `fur-300` | #E6D6BF | Hairlines and dividers; secondary text in Bedtime. |
| Control line | `fur-600` | #8C7A64 | Borders of inputs, toggles and checkboxes, in both themes. |
| Quiet ink | `ink-600` | #625547 | Secondary text in Day. |
| Success | `green-700` / `green-300` | #16705E / #7FD8C4 | App states, Day / Bedtime. |
| Error | `red-700` / `red-300` | #C4262E / #FF8A83 | App states and destructive actions, Day / Bedtime. A true red, well away from Chilli's orange. |
| Night | `night-100`, `-200`, `-300`, `-500` | #1B1611, #241E18, #30281F, #4B3F33 | Bedtime page, band, cards and hairlines. |

That's 18 colours in all (v6 used 45). The `kh-tone-chilli`, `kh-tone-blue` and `kh-tone-sun` classes pick each fill and the text that goes on it:

| On | Text | Contrast |
|---|---|---|
| Chilli `chilli-500` | White | 2.9:1, below WCAG AA. A brand decision (9 Oct 2026): keep it to short, bold words. |
| Kheelu Blue `blue-500` | White | 3.0:1, below WCAG AA. A brand decision (10 Oct 2026), as with Chilli: bold labels, icons and big words only. |
| Sunshine `sun-500` | `ink-900` | 10.8:1 |
| Cream, white and the band | `text`, `text-muted`, `success`, `danger`; `link` and the `deep-*` roles, which are ink here | 4.7:1 or more |

**Roles (what components use):**

| Role | Tokens | Use |
|---|---|---|
| Ground | `surface` (cream), `surface-raised` (white), `surface-band` (`fur-200`) | Pages, cards, bands and quiet panels |
| Text | `text` (`ink-900`), `text-muted` (`ink-600`) | All copy |
| Coloured text | `deep-blue`, `deep-chilli`, `deep-sun`: ink in Day; Kheelu Blue, orange and sunshine in Bedtime | Eyebrows, handwritten accents, icons in tiles, the current-tab underline |
| Lines | `border` for decoration, `border-strong` for controls | Dividers, inputs, toggles |
| Buy | `cta`, `on-cta` | The buy button, nothing else |
| Act and select | `primary` (Kheelu Blue), `on-primary` (white) | Continue, Save, Connect; checked boxes, radios and switches; the selected mode, tags and tab-bar item; progress bars |
| Link and focus | `link` (ink in Day, Kheelu Blue in Bedtime), `focus` (ink ring) | Inline links, always underlined; the keyboard ring |
| Status | `success`, `warning` (a Sunshine fill with ink on it), `danger` | App states only, always with an icon and a word |
| Chalk and scrim | `chalk` (white), `scrim` | Chalk lines and sticker outlines; behind dialogs, sheets and the menu drawer |

- **Colour is a fill; words are ink.** Kheelu Blue, Chilli and Sunshine appear as fills: buttons, selection, blocks, stickers, badges and icon circles. On cream, white and the band, text, links, eyebrows, handwritten accents and thin lines are ink, because all three are too light to read there (Kheelu Blue 2.7:1, Chilli 2.7:1, Sunshine 1.4:1). In Bedtime all three can be text.
- **One brand colour per block.** Pair a blue or chilli block with sunshine, never chilli with blue as two big blocks side by side (they already meet in the logo).
- **Chilli is for buying and brand moments.** Among buttons and controls, only the buy button is Chilli. Orange blocks, stickers and artwork are fine; orange text on cream or white is not.
- **The rainbow belongs to Kheelu.** It lives on the product (ears and foot pads) and the rainbow-arch shape. It is not a token, and never a UI, block, gradient or text colour.
- **Bedtime theme** (`dark`) is for the parent app's night mode and bedtime story screens: warm cocoa grounds; buttons and selection stay Kheelu Blue with white on it; Kheelu Blue, Chilli and Sunshine can also be text on night grounds. Marketing artwork (posts, slides) always uses the Day theme.
- **Contrast:** every text pair passes WCAG AA in both themes except white on Chilli (2.9:1) and white on Kheelu Blue (3.0:1), both kept as brand decisions. See **Accessibility & inclusion** for every number.

## Logo

The official wordmark is the kheelona.com logo in its own colours: **Chilli**, the logo's orange (#EF762F), for the K, e, e, o and a; **Kheelu Blue**, the logo's sky blue (#29A0D7), for the K's ear, h, l and n; and a white star in the o. v5 had recoloured it to darker shades for contrast; v7 (9 Oct 2026) returned it to the website's colours, so the site and the system match. As a logotype it is exempt from contrast rules: it measures 2.7:1 on cream and 6.1:1 or better on night grounds, so keep it 20px tall or more.

| Variant | Use on |
|---|---|
| **Day** (`kheelona-logo.svg`) | Cream, white and light photos. The default |
| **Bedtime** (`-bedtime`) | Night grounds, the chalkboard, dark photos. Since v7 it uses the same colours as Day |
| **Sticker** (`-sticker`) | Sunshine, chilli and blue blocks and busy photos: Day colours on a white cut-out |
| **Ink** (`-ink`) | One-colour print, stamps, embossing |
| **Chalk** (`-chalk`) | All white, on photos or dark fills where colour would clash |
| **Mark** (`kheelona-mark.svg`, `kheelona-app-icon.svg`) | App icon, favicon, avatars, anywhere under 20px tall |

- In code, use `Logo` (`variant="auto"` works in both themes). PNG exports (favicons, Apple touch icon, app icon, logo at 2x) are in the Logo group.
- **Clear space** is the height of the K's ear on every side. **Minimum size** is 20px tall on screen and 6mm in print; below that, use the mark.
- Never stretch, rotate, outline, add effects, swap the two colours, or put the full-colour logo directly on chilli or blue.

## Typography

Three voices, one family each, all Indian-friendly and free (SIL Open Font License):

- **Baloo 2** (`--font-display`): the speaking voice. Rounded, warm, confident. From Ek Type, a Mumbai foundry. It covers Latin and Devanagari, and its sister families cover Bengali (Baloo Da 2), Telugu (Baloo Tammudu 2), Tamil (Baloo Thambi 2), Kannada (Baloo Tamma 2) and more.
- **Nunito** (`--font-body`): the explaining voice, for everything you read in full.
- **Kalam** (`--font-hand`): the child's hand. It is an Indian handwriting face with Latin and Devanagari. Use it for one word or phrase, tilted −2° to −4°.

| Style | Size / line | Use |
|---|---|---|
| `kh-display-xl` | 72/74, 800 | Web hero at 1024px and up, once per page |
| `kh-display-l` | 56/58, 800 | Tablet hero, deck title slides |
| `kh-display-m` | 40/44, 800 | Section headings; the phone hero |
| `kh-headline` | 32/38, 800 | Phone H2, deck slide titles, social headlines, big stat numbers |
| `kh-title` / `kh-subtitle` | 24/30 and 20/26, 700 | Card titles, FAQ questions, dialog titles |
| `kh-price` | 44/46, 800 | Prices |
| `kh-hand-l` / `kh-hand-m` / `kh-note` | 44, 28, 20 | Handwritten accents and photo notes |
| `kh-lead` | 20/30, 500 (18/28 on phones) | Hero subheads and intros, at most 60 characters a line |
| `kh-body-l` / `kh-body` / `kh-body-s` | 18/28, 16/24, 14/20 | Reading and UI text |
| `kh-label-l` / `kh-label` / `kh-label-s` | 18/22, 16/20 and 14/18, 800 | Large, regular and small buttons; tabs, nav links, tags, chips, form labels |
| `kh-eyebrow` | 13/16, 800, +0.08em, uppercase | Kicker above headings, in a deep-* colour |
| `kh-caption` | 12/16, 700 | Captions, attributions, timestamps, legal lines; badges and counters at 800 |

- **Responsive steps:** the hero headline is `kh-display-m` on phones, `kh-display-l` from 768px and `kh-display-xl` from 1024px. Section headings are `kh-headline` on phones and `kh-display-m` from 768px.
- **Weights:** each style has its own weight plus one emphasized weight for a row title or a stressed word: body text 400 → 700, captions 700 → 800, titles 700 → 800. Nunito uses only 400, 500 (lead), 700 and 800; Baloo 2 uses 700 and 800; Kalam 400 and 700. Never 300 or 600.
- **Nothing in between:** components use these sizes and line heights only. The exceptions are glyphs inside shapes (avatar initials at 3/8 of the circle, step numbers, the quote mark) and artboard text in `SocialPost`, `DeckSlide` and `ImaginationFrame`, which scales with its frame.
- Use **sentence case** everywhere, including buttons and headings ("Pre-order Kheelu", not "Pre-Order Kheelu"). Uppercase belongs to the eyebrow style only (13/16, 800, +0.08em), which also sets footer column headings and app section labels.
- **Money:** use the ₹ sign and Indian digit grouping: ₹4,999, ₹1,00,000 (`Kheelona.formatINR`). Don't write "Rs." or "INR 4999".
- **Dates:** write "20 Oct 2026" in UI and "20 October 2026" in long copy. Never write 10/20/2026.
- For Indian scripts, set headlines in the matching Baloo sister family and body text in the matching Noto Sans. Never fake-bold or squash them.

## Layout and shape

- Spacing uses a 4px base: `space-1` to `space-10`. Sections get `space-9` (96px) of padding on desktop and `space-8` (64px) on phones. Cards get `space-5`. Components use these steps only; 1–2px nudges that line up an icon or a hairline are the one exception.
- The web grid is 12 columns at `content-max` (1200px) with `space-7` gutters on desktop, and 4 columns on phones with a `space-4` gutter. Colour blocks may bleed full-width.
- Everything is soft like plush. Cards use `radius-l`, big colour panels and social tiles use `radius-xl`, inputs, alerts and menus use `radius-m`, 40px icon tiles and tooltips use `radius-s`, and buttons, chips and stickers use `radius-pill`. Nothing has a sharp corner.
- **Lines:** `stroke-hair` (1px) with `border` for dividers and card, list and table frames; `stroke-control` (2px) with `border-strong` or ink for inputs, toggles, tags and secondary buttons; `stroke-focus` (3px) for focus rings and the selected tab or nav underline.
- **Tap targets:** anything a parent taps is at least `tap-min` (48px). Smaller visible controls (small buttons and icon buttons, tags, toast buttons, nav links) extend their tap area invisibly to 48px. Anything a child presses is at least `tap-kid` (64px).
- **Layers** stack in a fixed order: `z-sticky` (the sticky buy bar) under `z-popover` (menus) under `z-tooltip` under `z-overlay` (the menu drawer) under `z-toast`. Dialogs and sheets use the browser's top layer.
- Layouts are flat. Every button has the same chunky toy-like ink base edge (`shadow-press`) and drops 4px onto it when pressed. `shadow-lift` is only for things that float (the sticky buy bar, menus, dialogs, toasts, a product on a plain ground). Cut-outs get `shadow-sticker` with a `chalk` outline (`stroke-sticker`).
- Compose like a child's scrapbook, but tidy: **one** big colour block, **one** cut-out (child or Kheelu), **one** handwritten accent and **one** doodle per view. When it feels busy, remove the doodle first.

## Imagery, in brief

- **Photography:** the same cast in different rooms and clothes, like one family photographed by a parent who is good with a camera. Real Indian homes, a studio sweep or a plain wall; eye level, window light, warm film colour, natural skin. Never glossy, never posed like a catalogue, never outdoors. See **Photography, chalk & crayon** and the photo library in **The cast**.
- **The Imagination layer** is Kheelona's signature. A white chalk drawing over a child shows the idea a conversation with Kheelu sparked, for example an astronaut helmet when Kabir asks how astronauts sleep. Use chalk on the ink "chalkboard" block or on dark photos, and the ink doodles on light photos. Assets are in **Doodles**; the component is `ImaginationFrame`.
- **Crayon marks** (Crayon group, or the `Mark` helper) underline, circle or highlight one word in chilli, blue or sunshine. **Cut-paper shapes** (Shapes group) sit behind products and children.
- **Kheelu** always appears as the real product photo: whole, upright and in focus (Kheelu group).

## Iconography

- **Phosphor Icons, Bold weight** (MIT licence), rounded and friendly at small sizes. Use `Icon` from the bundle (76 icons, `currentColor`), or the SVG files in the Icons group, which have `ink-900` (#2a2118) baked in because `<img>` cannot inherit colour. For other colours, use the bundle or the `@phosphor-icons/core` package.
- Sizes: `icon-s` 16 in chips, badges and captions; `icon-m` 20 in buttons, rows and table cells; `icon-l` 24 standalone, in the nav and the tab bar; `icon-xl` 40 for spot icons in empty states.
- Inside a circle or tile, an icon is **half the container**: 16 in 32 (FAQ sign, feeling chips), 20 in 40 (list and settings tiles, small icon buttons), 24 in 48 (icon buttons, trust list), 28 in 56 (feature cards, feeling cards, large icon buttons), 40 in 80 (empty states). The one exception is the warning dot in alerts: 16 in a 24px Sunshine circle, to line up with the other alert icons.
- Feelings use the smiley set: Curious `question`, Grumpy `smiley-angry`, Sad `smiley-sad`, Silly `smiley-wink`, Joy `smiley`.
- Never use emoji in the UI, ads or the website. One emoji is fine in an organic social caption.
- Never use icons that say "AI": brains, chips, sparkles, robots or magic wands.

## Motion

Motion is quick and gentle, like a toy that wobbles back into place.

- Presses, hovers and tooltips: `duration-fast` (120ms, `ease-standard`); a pressed button moves down 4px onto its edge. State changes (switches, carets, accordion signs, progress bars): `duration-base` (200ms). Entrances: `duration-enter` (240ms) with a small overshoot, `ease-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Chalk doodles may "draw on" over 600–900ms (`duration-draw` is 800ms) using a stroke reveal, once per view, never on a loop.
- Respect `prefers-reduced-motion`: drop movement and keep opacity fades only. Spinners slow down instead of stopping.

## Components

`components/bundle.js` exposes `window.Kheelona` (React 18). `bundle.css` holds every class (prefix `kh-`), so the same markup works in plain HTML, emails or decks. Each component's README covers when to use it, its props and the do's and don'ts.

- **Brand:** `Logo`, `Sticker`, `ImaginationFrame`, `CastCard`, `Icon`
- **Actions:** `Button` (cta, primary, secondary, ghost, danger; loading), `IconButton`, `Menu`
- **Forms:** `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Tag`
- **Feedback:** `Alert`, `Toast`, `Tooltip`, `ProgressBar` (+ `Spinner`)
- **Overlays:** `Dialog` (+ `BottomSheet`)
- **Navigation:** `NavBar`, `NavDrawer`, `Tabs`, `Footer`
- **Content:** `SectionHeading` (+ `Hand`, `Mark`), `FeatureCard`, `StepLoop`, `AgeTimeline`, `FeelingChip`, `LanguageChips`, `FAQ`, `Badge`
- **Selling:** `OfferCard`, `AnnouncementBar`, `StickyBuyBar`, `ComparisonTable`, `TrustList`, `Testimonial`
- **Marketing:** `SocialPost` (4:5), `DeckSlide` (16:9)
- **App:** `AppSummaryCard`, `ParentControl`, `ModeSwitch`, `TabBar`, `ListItem` (+ `List`), `Avatar`, `EmptyState`
- **Pages** (showcase templates, not exports): `HomePage`, `HomePageTrust`, `HomePageBuy`, `HomePagePhone`, `AppScreens`, `CampaignKit`
- **Layout classes** (in `bundle.css`): `kh-section`, `kh-container`, `kh-split`, `kh-cols`, `kh-photo`, `kh-trustline`, `kh-art` (scrapbook board), `kh-device` (phone frame). See **Pages: putting it together**.

## Assets

- **Logo**: the wordmark in Day, Bedtime, Sticker, Ink and Chalk, the K mark, the app icon, and PNG exports.
- **Kheelu**: product photos (cut-out, sticker, on cream, belly unit).
- **Cast**: 5 children and 2 parents, each as a portrait, web version, cut-out and sticker.
- **Photo library**: 25 photos of the cast, 5 per child (3 with Kheelu, 2 without), at home, in the studio or on a plain wall. Each is a 2K JPEG plus a 1500px WebP.
- **Doodles**: 16 chalk and 16 ink line drawings for the Imagination layer.
- **Crayon**: 10 textured marks in chilli, blue and sunshine.
- **Shapes**: 9 cut-paper shapes.
- **Icons**: 76 Phosphor Bold SVGs in ink.

Each group's README lists what is in it and when to use it.

**Tools:** `tools/photo/` has the scripts used to check, clean up and export cast photos, and a log of every library photo. `tools/tokens/` rebuilds `tokens.css` from `tokens.json`.
