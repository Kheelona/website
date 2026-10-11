# Surfaces

The same system, tuned for each place a parent meets Kheelona.

## Sizes at a glance

| Surface | Size | Theme | Notes |
|---|---|---|---|
| Website | 360–1440px wide, content max 1200px | Day | Mobile first: most Indian parents arrive on a phone |
| Parent app | 360–430pt wide | Day, plus Bedtime | 48pt touch targets, and 64pt for anything a child might press |
| Instagram / Facebook feed | 1080×1350 (4:5) | Day | `SocialPost` |
| Stories / Reels | 1080×1920 (9:16) | Day | Keep text and CTA in the safe zone: below the top 14%, above the bottom third. Check the app's current overlay before posting |
| YouTube / web video | 1920×1080 | Day | Burned-in captions, English plus the regional version |
| Deck | 1920×1080 (16:9) | Day, with chalkboard statement slides | `DeckSlide` |
| WhatsApp share / OG image | 1200×630, or 1080×1080 | Day | Must work as a thumbnail; one face, one line |
| Email | 600px column | Day | Live text, one cta |
| Marketplace listings | 2000×2000 | Day | Many marketplaces need a pure white main image; make a white-ground version from `kheelu-front.png` when needed |
| Print (quick-start card, inserts) | As specified by the printer | Day | CMYK conversion of cream and the brand colours needs a proof; no thin chalk lines |

## Website

**Feel:** a calm, cream page where every scroll gives one clear reason to believe, and the pre-order button is never far away.

- Order sections as in **Selling**, and start from the home page templates in **Pages: putting it together**. Alternate `surface` and `surface-band` bands, and give each band one colour moment.
- **Header:** `AnnouncementBar` (offer and ship date) above `NavBar` (logo, five links, cta).
- **Hero:** `SectionHeading` in hero size with one `Hand` phrase, a real photo or a cast sticker on a brand-colour block, the cta, and a line of trust under it ("Screen-free · No open internet · Ships 20 Oct 2026").
- **Phones:** `StickyBuyBar` appears after the hero scrolls away, and the nav collapses to the menu button, which opens `NavDrawer`.
- **Links:** `link` colour, always underlined in body copy.
- **Performance:** serve `*-portrait-web.webp` and `kheelu-front.webp`, lazy-load below the fold, and keep the hero image under 200 KB.

## Parent app

**Feel:** quiet, kind and factual. This is where the trust earned in marketing is kept. **No selling inside the child's data.**

- **Home:** `AppSummaryCard` ("Today with Kheelu": minutes, new words, topics, one "Try together tonight" idea, a link to the full conversation).
- **Controls:** `ParentControl` rows for quiet hours, topic filters, languages and daily summary. Every switch has a label and a hint in plain words.
- **Modes:** `ModeSwitch` (AI mode, Story mode, Bluetooth).
- **Navigation:** `TabBar` at the bottom (Today, Conversations, Stories, Settings), `Tabs` inside a screen, `ListItem` rows in `List` cards.
- **Forms:** `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup` and `Switch`, with real-world examples ("Myra", "14/02/2022"). Everyday actions are blue `primary` buttons; chilli never appears in the app except to buy.
- **Feedback:** `Alert` for device status ("Kheelu is updating"), `Toast` after an action ("Quiet hours saved", with Undo), `EmptyState` for empty screens, `ProgressBar` for setup.
- **Bedtime theme:** offer it automatically after 7 pm and in bedtime story screens. Grounds turn warm cocoa; buttons and selection stay Kheelu Blue (`blue-500`) with white on it, and Kheelu Blue, Chilli and Sunshine can also be text on night grounds.
- **Data screens** (conversation log, summaries) use no doodles, stickers or crayon marks. Clarity is the brand here.
- **Destructive actions** use a `danger` button, a confirm `Dialog` (or `BottomSheet` on phones) and plain verbs ("Delete conversation").
- Kheelona+ upsells live in Settings only, never in the summary or the log.

## Decks (sales, partners, investors, schools)

- Use 16:9 with the cream ground, ink text and an ink eyebrow; colour comes from the brand block. The footer shows the logo plus context.
- **Title slides:** use `DeckSlide` title with a cast sticker and Kheelu on a brand-colour block.
- **Statement slides:** use the chalkboard (`board`) for the one sentence you want remembered, with one `hand` phrase in `sun-500`.
- **Fact slides:** three numbers at most, each with a short label. Numbers come from approved facts only.
- Keep to one idea per slide and 30 words at most. Put details in the speaker notes.
- Investor decks may use PlayOS layer diagrams. Draw them with tokens (cream blocks, ink lines, brand-colour accents), never with stock 3D or gradient art.

## Social

- **Grid rhythm:** alternate grounds (sunshine → blue → cream → chilli → chalkboard) so the grid has a steady rhythm in the brand colours. Chilli grounds are for offers.
- **The footer pill** (the Day logo plus an optional chilli "Pre-order ₹4,999") sits on every post and makes the grid recognisable.
- **Content mix** (guide): 40% child moments (cast and real families with consent), 25% how it works and safety proof, 20% parenting value (bilingual homes, screen-free play), 15% offer and launch.
- **Carousels:** slide 1 is the hook (a question a parent asks), slides 2–4 are proof, the last slide is the cta and share.
- **Captions:** the first line is the hook, use one emoji at most, keep to 3–5 relevant hashtags, and avoid Hinglish in captions about safety or price.

## Video and audio

- Start with a child and Kheelu talking within the first 2 seconds.
- Kheelu's voice: warm, unhurried, gently Indian-English, never cartoonish or robotic. Record or design it once and reuse it. Never clone a real person's voice.
- Caption everything, and keep burned-in captions inside the safe zones in Nunito ExtraBold on a `white` pill.
- Chalk doodles may draw on over 600–900ms to show the idea forming.

## WhatsApp

- WhatsApp is where Indian parents recommend things. Make every page shareable: "Know a parent who needs this? Share Kheelu on WhatsApp."
- The share message is plain text a parent would send themselves: "Found this screen-free AI friend for kids, speaks Hindi and Tamil too. First 500 at ₹4,999: kheelona.com"
- Support chats use the first name, short answers and one link.

## Print and packaging

- Use the cream ground, ink text, Baloo 2 headlines and one Kalam line. Chilli, Kheelu Blue and sunshine blocks need a printed proof against the screen colours, because they shift in CMYK. One-colour jobs use the ink logo.
- Set the quick-start card in numbered steps (`StepLoop` style), with icons from the Icons group and the belly-unit photo for button positions.
- Safety and age marks follow the regulations. Never decorate them.
