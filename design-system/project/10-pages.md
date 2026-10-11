# Pages: putting it together

The **Pages** group shows the system assembled into whole pages, with real photos, cut-outs, doodles and shapes. Start a new page from the closest one, keep its structure, and swap the words and pictures.

| Template | What it shows | Width |
|---|---|---|
| `HomePage` | Header, hero, languages, how it works, year by year, a day with Kheelu | 1280 |
| `HomePageTrust` | What Kheelu does, the Imagination layer, safety, feelings, the parent app | 1280 |
| `HomePageBuy` | Compare, pilot parents, questions, the offer and WhatsApp share, footer | 1280 |
| `HomePagePhone` | The hero, the scrolled page with the sticky buy bar, the menu open | 390 |
| `AppScreens` | Setup, today, conversations, and settings in the Bedtime theme | 4 × 390 |
| `CampaignKit` | Four posts, a WhatsApp share, a deck slide, an email, a Story cover | 1280 |

The three home page parts follow the product page skeleton in **Selling**. The video section is left out because the templates don't use stand-in footage: add it only with real video.

## The layout classes

Pages are built from components plus a few layout classes in `bundle.css`. They use tokens only, so a page never needs its own spacing.

| Class | Does | Notes |
|---|---|---|
| `kh-page` | The page wrapper: the cream ground and body text | Set `data-theme="light"` on it for marketing pages, which are always Day |
| `kh-section` | One band of the page: `space-9` top and bottom and `space-7` sides from 1024px, `space-8` and `space-4` on phones | Add `kh-section--band` for the cream band, `kh-section--tight` for a short strip |
| `kh-container` | Holds the content at `content-max` (1200px), centred | One per section |
| `kh-section__head` | The `SectionHeading` above a section's content | `space-7` below it |
| `kh-section__actions` | A row of buttons or chips after the content | Add `--center` under centred headings |
| `kh-split` | Two columns from 900px, stacked on phones | `--wide-start` (7:5) for heroes, `--wide-end` (5:7) for a picture beside words |
| `kh-cols--2`, `--3`, `--4` | Equal card or photo grids | Two columns from 720px; four from 1024px |
| `kh-photo` | A library photo at 4:5 with the card radius and a caption | `--wide` (16:9), `--square`, `--xl` (the big radius) |
| `kh-trustline` | Three short facts with icons under a hero cta | "Screen-free · No open internet · Ships 20 Oct 2026" |
| `kh-art` | A scrapbook board: one brand block holding layers placed in % | Add a tone class for the block; layers are `img.kh-art__layer` |
| `kh-device` | A phone frame for showing screens in docs, decks and posts | `__screen`, `__status`, `__body`, `__foot`; set `data-theme="dark"` on it for Bedtime |

## Rhythm

- **Alternate the bands.** `surface`, then `surface-band`, then `surface` again, each with one colour moment (a brand block, a photo, a sticker or a crayon mark).
- **Quiet panels look after themselves.** Cards and table headers that sit on the cream band switch to the page cream when their section is a band, so they never disappear.
- **One `cta` per view.** On the home page it comes after the hero, safety, compare and the close. Learning actions are secondary buttons; "read more" links are ghost buttons.
- **One accent per headline.** Each `SectionHeading` gets at most one `Hand` phrase or one `Mark`, and the hero is the only display-xl headline on the page.
- **Close every section** with a button or a link, so a parent always has a next step.

## The scrapbook board

The hero and the offer use a `kh-art` board. Build it in this order, and stop as soon as it feels full:

1. **The block:** one brand fill (`kh-tone-blue`, `-sun` or `-chilli`) at 1:1 or 4:5.
2. **One shape behind:** a cut-paper shape from **Shapes** in a different brand colour, in a corner.
3. **The cut-outs:** a cast sticker, bottom-aligned, and the Kheelu sticker, slightly tilted (−4° to −6°), in front of it.
4. **One doodle:** chalk (white) on Kheelu Blue, Chilli and dark grounds, ink on Sunshine and cream. Keep it near the child's head, where the idea is.
5. **One sticker:** a round price sticker or a word sticker, tilted, in a free corner.

Place every layer with `left`, `top` or `bottom` and `width` in %, so the board scales with its column. Never cover a face, and never put the full-colour logo on the block.

## Choosing pictures for a page

| Section | Use | Why |
|---|---|---|
| Hero | A cast sticker and the Kheelu sticker on a brand block, or a web-hero photo (`myra-02`, `kabir-02`, `kabir-04`, `advik-02`) | One child, real joy, Kheelu in view |
| A day with Kheelu | Three 4:5 photos with Kheelu: `myra-01`, `advik-01`, `ira-01` | Morning, afternoon and evening, three different children |
| Imagination | `kabir-01-imagining-space` with chalk doodles | The dark wall carries chalk |
| Feelings | `tara-01-naming-feelings` | Tara names big feelings |
| Parent app | `tara-02-evening-with-amma` | Parents appear only with Tara |
| Offer | A cast sticker and Kheelu on Sunshine, or `kheelu-on-fur.jpg` | Calm, product in focus |
| Email and WhatsApp | `myra-02-monsoon-window`, `kheelu-on-fur.jpg` | Must work as a small thumbnail |
| Story or Reel | A 9:16 photo: `myra-03`, `ira-03`, `tara-03`, `kabir-03` | Each keeps its top third calm for the words |

Across a page, use each child at most twice and show at least three of the five. Use the `-web.webp` files on the web and the `.jpg` files for print and decks.

## Phones

- The nav collapses to the menu button, which opens `NavDrawer`. The cta stays in the bar.
- Hero: the words first, a full-width cta, the trust line, then the board under them.
- `StickyBuyBar` appears once the hero has scrolled away and hides while the `OfferCard` is on screen.
- Two-column splits stack; photo grids become one column; drop the icons in `ModeSwitch` so the three modes fit on one row.

## The app

- Every screen is a stack inside the `kh-device` body with `TabBar` in the foot: Today, Conversations, Stories, Settings.
- Everyday actions are Kheelu Blue `primary` buttons with white text. Chilli appears only to buy, and never inside the child's data.
- Data screens (the log, summaries, settings) use no doodles, stickers or crayon marks.
- Bedtime is the same screens with `data-theme="dark"`: buttons and selection stay Kheelu Blue with white on it.

## Campaigns

- **Posts:** rotate the grounds Sunshine, Kheelu Blue, cream, Chilli, chalkboard. Chilli is for offers. Keep the footer pill on every post.
- **WhatsApp:** a 1200×630 preview (`kheelu-on-fur.jpg`, the logo, one line) and the message a parent would send themselves.
- **Email:** one 600px column of live text: the logo, one photo, a `SectionHeading`, two or three `FeatureCard`s and one cta.
- **Story or Reel cover:** a 9:16 photo with the words on its calm wall, in the safe zone (below the top 14%, above the bottom third): the logo and the offer on one row, then a two-line headline with one `Hand` phrase. On a dark wall the words are white, the `Hand` phrase Sunshine and the logo `chalk`; on a light wall, ink and the full-colour logo. Never cover a face or Kheelu.
- **Deck:** the statement slide on the chalkboard for the one line to remember.
