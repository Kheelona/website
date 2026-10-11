# How to use this system

Start here if you are new to Kheelona, or about to make something for it. This page covers people and AI agents alike. It shows where everything is, which part to use for each job, how to use it with or without code, and how to change the system without breaking it. The brand rules themselves are on the Overview page: read them next.

## What's where

- **This design-system page is the source of truth.** If anything else disagrees with it (an old export, a campaign file, a copy in a folder), this page wins. It is private until the owner shares it from the page's Share menu.
- **A local copy** sits in the `kheelona-DSX-v4` folder on the owner's Mac (synced to v6 on 9 Oct 2026). Use it to work offline or to hand files to a designer, then check here for anything newer.
- **The originals of the AI images** (cast portraits and the photo library) are in two ElevenLabs flows, linked from **The cast** and **Making cast photos (step by step)**.

| Path | What's in it |
|---|---|
| `README.md` | The Overview: principles, rules, colour, logo, type, layout, imagery, icons, motion |
| `00-…` to `09-….md` | The sections, including this one |
| `tokens.json` | Every design token: colour (Day and Bedtime themes), type, spacing, radius, shadow |
| `tokens.css` | The same tokens as CSS, for use outside this page (local copy; rebuild with `tools/tokens/`) |
| `fonts/` | Baloo 2, Nunito and Kalam, as web fonts |
| `components/` | `bundle.css` (every `kh-` class), `bundle.js` (React components on `window.Kheelona`), `index.d.ts` (every prop), and a folder per component with its guidelines and a live preview |
| `assets/` | Logo, Kheelu, Cast, Photo library, Doodles, Crayon, Shapes and Icons; each group has a README |
| `tools/photo/` | Scripts for making new cast photos: face check, page-text clean-up, export, and the photo log |
| `tools/tokens/` | The script that rebuilds `tokens.css` from `tokens.json` |

## Find the right part for the job

| I need to make… | Start with | Then read |
|---|---|---|
| An Instagram or Facebook post | `SocialPost` (4:5), one cast sticker or a 4:5 library photo, at most one Kheelu sticker | **Surfaces** → Social; **Making new assets (for agents)** → Recipes |
| A Story or Reel cover | `SocialPost` stretched to 1080×1920, or a 9:16 library photo | **Surfaces** → Sizes at a glance |
| A performance ad | `SocialPost` plus a price `Sticker` | **Selling** → Price and offer rules |
| A website section | `SectionHeading` plus `FeatureCard`, `StepLoop`, `AgeTimeline`, `TrustList`, `ComparisonTable` or `FAQ`; a 16:9 library photo | **Surfaces** → Website |
| The product page or any whole web page | The `HomePage`, `HomePageTrust` and `HomePageBuy` templates (Pages group) and the layout classes, with `StickyBuyBar` on phones | **Pages: putting it together**; **Selling** → Product page skeleton |
| A deck | `DeckSlide` (title, statement and facts layouts); 16:9 library photos | **Surfaces** → Decks |
| An email | A 600px column: one photo, `SectionHeading`, two or three `FeatureCard`s, one cta | **Making new assets (for agents)** → Recipes |
| A WhatsApp creative | `kheelu-on-fur.jpg` or a 1:1 `SocialPost`, one line and a link | **Surfaces** → WhatsApp |
| A parent-app screen | `TabBar`, `ListItem`, `AppSummaryCard`, `ParentControl`, `ModeSwitch`, the form controls; Bedtime theme at night | **Surfaces** → Parent app; the `AppScreens` template in **Pages: putting it together** |
| Print (inserts, cards) | The Ink logo, the brand fonts at 9pt or more | **Surfaces** → Print and packaging |
| Copy for anything | The voice, words, claims and CTA tables | **Writing** |
| A new photo of a child | The Photo library first; only then a new one | **Making cast photos (step by step)** |
| A picture of Kheelu | The Kheelu group. Never generate it | **Kheelu, the product** |
| The logo | The `Logo` component or the Logo group | Overview → Logo |
| An icon | `Icon` in code, or the Icons group | Overview → Iconography |

**Before anything goes out**, run the ship gate at the end of **Making new assets (for agents)**: brand, sales, truth and safety, accessibility and India fit.

## Choosing a photo

The **Photo library** has 25 photos, five of each child. Each photo is in two files: `.jpg` (full size, for decks, print and cropping) and `-web.webp` (1500px, for websites and email). The full table, with setting, outfit and best use for every photo, is in **The cast**.

| You need | Use |
|---|---|
| A web hero, text on the left | `myra-02-monsoon-window`, `ira-02-drawing-the-dragon`, `kabir-02-block-rocket`, `kabir-04-planet-book` |
| A web hero, text on the right | `advik-02-whispering-to-kheelu`, `advik-04-floor-train` |
| A 4:5 post with Kheelu | `myra-01-breakfast-why`, `advik-01-counting-carriages`, `ira-01-story-on-the-bed`, `tara-01-naming-feelings`, `kabir-01-imagining-space` |
| A Story or Reel (9:16) | `myra-03-bedtime-cuddle`, `ira-03-festive-evening-song`, `tara-03-bedtime-with-baba`, `kabir-03-homework-desk` |
| A child with the product, ready to cut out | `advik-03-studio-hug` (cream studio sweep) |
| A portrait for an avatar, sticker or cast card | the `-05-portrait` of each child (1:1, plain wall) |
| Parents and family proof | `tara-02-evening-with-amma`, `tara-03-bedtime-with-baba` |
| Childhood without selling | `myra-04-drawing-at-home`, `advik-04-floor-train`, `ira-04-paper-crown`, `tara-04-reading-nook`, `kabir-04-planet-book` |
| Chalk doodles over a photo (the Imagination layer) | `kabir-01-imagining-space` (dark wall), or any photo with a calm wall. Put the helmet on like a real one: the whole head inside the bubble, the collar at the neck, and Kheelu in front (see **Photography, chalk & crayon** → The Imagination layer) |
| A season or moment | Festive: `ira-03`. Monsoon: `myra-02`. Bedtime: `myra-03`, `tara-03`. School readiness: `kabir-03`, `tara-04` |

- Match the child to the message (character sheets in **The cast**), and keep the cast's balance across a campaign.
- Crop freely, but never mirror a photo, lighten skin or retouch faces.
- Write alt text that describes what is happening (**Writing** → Alt text). The children are illustrative: never present them as customers.

## Without code (Canva, Figma, Keynote, Google Slides)

1. **Install the fonts:** Baloo 2 (headings), Nunito (text) and Kalam (one handwritten word). They are in `fonts/` and free on Google Fonts.
2. **Add the colour swatches.** In code, always use the tokens; these hex values are only for tools that don't read tokens.

| Swatch | Hex | Use |
|---|---|---|
| Cream (`fur-100`) | #FBF5EB | The page, most of every layout |
| Cream band (`fur-200`) | #F3E8D7 | Alternating bands and quiet panels |
| White | #FFFFFF | Cards, sticker outlines, text on Chilli and Kheelu Blue |
| Ink (`ink-900`) | #2A2118 | All text and icons on light grounds; text on Sunshine |
| Ink, quiet (`ink-600`) | #625547 | Secondary text |
| Chilli (`chilli-500`) | #EF762F | The logo's orange: the buy button and brand blocks, with white text |
| Kheelu Blue (`blue-500`) | #29A0D7 | The logo's sky blue: everyday buttons, selection, brand blocks and stickers, always with white text |
| Sunshine (`sun-500`) | #FFCF4D | The one accent: highlights, stickers, badges |

That's every colour a design tool needs. The success and error colours (`green-700`, `red-700`) are for the parent app only.

3. **Use the type styles** in Overview → Typography: sizes, weights and line heights.
4. **Take the files** from the asset groups: the logo as SVG (or the PNG at 2x where SVG isn't accepted), photos as `.jpg`, cut-outs and stickers as PNG, and doodles, crayon marks and shapes as SVG.
5. **Set the size** from **Surfaces** → Sizes at a glance: posts 1080×1350, Stories 1080×1920, slides 1920×1080.
6. **Check it** against the ship gate before it goes out.

## In code (websites, emails, prototypes)

Load four things in this order: `tokens.css`, `components/bundle.css`, React 18.3.1 with ReactDOM, then `components/bundle.js`. Every component is then on `window.Kheelona`. This example was tested on 9 Oct 2026, with the files laid out as in the local copy:

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="components/bundle.css">
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="components/bundle.js"></script>
  <script>
    const h = React.createElement;
    const { SectionHeading, Hand, Button } = window.Kheelona;

    function Hero() {
      return h('main', { style: { maxWidth: 'var(--content-max)', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' } },
        h(SectionHeading, {
          hero: true, level: 1,
          eyebrow: 'Screen-free',
          title: ['Learning starts with ', h(Hand, null, 'feeling understood.')],
          lead: 'A screen-free AI friend for ages 3+ that listens, remembers and grows with your child.'
        }),
        h('img', {
          src: 'assets/Photo library/tara-01-naming-feelings-web.webp',
          alt: 'Tara, five, explains something to Kheelu by the window',
          style: { display: 'block', width: '100%', maxWidth: 560, borderRadius: 'var(--radius-xl)', margin: 'var(--space-6) 0' }
        }),
        h(Button, { variant: 'cta', size: 'l', href: 'https://store.kheelona.com' }, 'Pre-order Kheelu')
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(h(Hero));
  </script>
</body>
</html>
```

- **Themes:** `data-theme="light"` is Day, the default. `data-theme="dark"` is Bedtime, for the parent app at night and bedtime-story screens. Marketing artwork always stays in Day.
- **Props:** every component's props are in `components/index.d.ts`, and its do's and don'ts are in `components/<Name>/README.md`. The previews on this page show the states.
- **Without React** (plain HTML, email): the `kh-` classes in `bundle.css` style the same markup the components render. Open a component's preview to copy its structure.
- **Values:** use tokens only, never pasted hex values or one-off sizes: colour, spacing, radius, stroke, size, motion (`duration-*`, `ease-*`) and layer (`z-*`) tokens, and the type styles. Format money with `Kheelona.formatINR(4999)`, which gives "₹4,999".
- **When `tokens.json` changes**, rebuild the CSS: `python3 tools/tokens/build_tokens_css.py`.

## For AI agents

**Read in this order:** the Overview (README), this page, the section for your job, then the README of each component or asset group you will use. Props are in `components/index.d.ts`.

**Reading files:** every file on this page is at `project/<path>`, for example `project/03-cast.md`. Photos, logos and other images are uploads: `design-system.json` lists each asset group's files with their upload IDs, served at `/_blob/<id>`. The local copy has the same files at the same paths.

**The rules that most often get broken:**

- Tokens only, never hex values; one chilli `cta` per view, for buying only.
- The official logo files or the `Logo` component; never retype or recolour the logo.
- Only the cast; never present them as real customers; parents appear only with Tara.
- Kheelu only from the product photos; never generate it.
- Home, studio or plain-wall settings; never outdoors.
- Prices, dates and offers checked against store.kheelona.com on the day.

### Changing the system

Only change the system when the owner asks.

1. **Edit the files** under `project/`. Keep the README lists, the counts and each group's README in step with what you change.
2. **Upload new images** to this page's asset store (the Artifact tool's publish with `asset: true`, up to 25 files per call). Note each file's upload ID.
3. **Register them** in `design-system.json`: under `assetGroups.<Group>`, add the file name to `order` and an entry to `files` (`{"name", "blob": "<upload id>", "size", "type"}`). Add a new group to `groups` as well.
4. **Stamp the change:** update `lastChange` in `design-system.json` (`by`, `at`, `via`, and a one-line `note`).
5. **Publish** with `root` set to the folder that contains `project/`, `file_path` set to `project/design-system.json`, and every changed file listed in `files`. Files you leave out are kept.
6. **Check it:** open the changed component previews in both themes and re-run the contrast checks in **Accessibility & inclusion** if you touched a colour.
7. **Sync the local copy:** copy the changed and new files into `kheelona-DSX-v4`. Never delete anything there or in the asset store without the owner's OK; move retired files to a `_retired-<version>/` folder instead.
8. **Log it** in the version history below.

## Version history

The page's own version history counts every publish, so its numbers run ahead of these.

- **v11, 10 Oct 2026:** the astronaut helmet is worn. On `HomePageTrust` it had sat on top of Kabir's head with its rim across his glasses; now the bubble holds his whole head, the collar sits at his neck and the helmet passes behind Kheelu. `ImaginationFrame` doodles take a new `clip` option (a CSS `clip-path`) for that; **Photography, chalk & crayon**, the `ImaginationFrame` guide and this page say how to place a helmet or crown. The planet doodle moved to the top left, clear of the helmet.
- **v10, 10 Oct 2026:** white on Kheelu Blue. Text, ticks, dots, thumbs and icons on every Kheelu Blue fill (buttons, selection, blocks, stickers, avatars) are white, 3.0:1: a brand decision like white on Chilli, flagged in **Accessibility & inclusion**. New **Pages: putting it together** section and six showcase pages (`HomePage`, `HomePageTrust`, `HomePageBuy`, `HomePagePhone`, `AppScreens`, `CampaignKit`) built from the components and 26 assets (8 library photos, 6 cast stickers and portraits, 2 Kheelu files, 6 doodles, 4 shapes), with crayon marks from the `Mark` helper. New layout classes in `bundle.css`: `kh-section`, `kh-container`, `kh-split`, `kh-cols`, `kh-photo`, `kh-trustline`, `kh-art` and `kh-device`; quiet panels switch to cream on band sections. Story and Reel covers put the words on the photo's calm top third, in a safe zone below the top 14% and above the bottom third; the old “middle 60%” rule put them over the child and Kheelu in every 9:16 library photo.
- **v9, 10 Oct 2026:** one blue. The deep blue (#00668E) is gone and Kheelu Blue (#29A0D7, the logo's sky blue) does every blue job, always with ink on it: everyday buttons, checked boxes, radios and switches, the selected mode, tags and tab-bar item, progress bars. Blue text and lines on light grounds (eyebrows, links, handwritten accents, the selected-tab underline) are now ink in Day, as orange text has been since v7; Bedtime keeps them blue. Ticks on the OfferCard and ComparisonTable are Kheelu Blue instead of the app's success green. 18 colours. Removed token: `blue-700`; code that used it should use `primary` (fills) or `deep-blue` (text).
- **v8, 10 Oct 2026:** a consistency audit. Components now use the type scale only (no more 11, 15 or 19px text, 13px only in the eyebrow style, and no 600 weights), with one emphasized weight per style; new `kh-label-l` for large buttons; `kh-headline` is 800, as every component already set it; the hero headline steps 40 → 56 → 72px. New token families for motion (`duration-*`, `ease-*`) and layers (`z-*`), and `stroke-focus` (3px). Spacing, radii and strokes in components are all tokens; chips are 40px tall; icons sit at half their circle or tile; small controls, nav and footer links keep 48px tap areas. No colour values changed. The README's motion, iconography, layout and typography rules are rewritten to match.
- **v7, 9 Oct 2026:** the palette narrowed to the logo's own colours. Chilli is now the logo's orange (#EF762F) and Kheelu Blue its sky blue (#29A0D7), with one deep blue (#00668E) for buttons, links and blue text; Sunshine stays as the one accent. 19 colours in all, down from 45. Quiet panels are now the cream band instead of tints; buttons share one ink edge; error red moved away from the buy colour; feeling chips have cream dots. The logo set, shapes and crayon marks are recoloured to match the website. White text on Chilli (2.9:1) is a brand decision, flagged in **Accessibility & inclusion**. Removed tokens: `chilli-100`, `chilli-300`, `chilli-600`, `chilli-800`, `blue-100`, `blue-300`, `blue-900`, `sun-100`, `sun-800`, `rainbow-*`, `green-100`, `red-100`, `tint-chilli`, `tint-blue`, `tint-sun`, `success-tint`, `warning-tint`, `danger-tint`, `cta-hover`, `cta-edge`, `primary-hover`, `primary-edge`, `brand-warm`, `brand-cool`, `accent`, `shadow-press-primary` and `shadow-press-ink`. Code that used them needs the new names (see Overview → Colour).
- **v6, 9 Oct 2026:** the Photo library (25 cast photos, 5 per child); **Making cast photos (step by step)** with its helper scripts; this guide.
- **v5, 9 Oct 2026:** the palette locked to the logo (Chilli, Kheelu Blue, Sunshine on cream, white and ink); the official logo set; 21 new basic components (menus, dialogs, tabs, form controls, alerts and more); doodles, crayon marks and shapes recoloured; Bedtime contrast fixes.
- **v1 to v4, 8–9 Oct 2026:** the first system: tokens, the brand book, the cast, the Kheelu product files, doodles, crayon marks, shapes, icons and the first 26 components.
