---
title: "CMO review: the selling update as built (5b245a26), phone first"
type: qa
updated: 2026-10-15
sources:
  - ../site/d2c-conversion-plan-2026-10-15.md (v2, §1-§14)
  - cmo-review-d2c-plan-v2-2026-10-15.md (M1-M5, C1, m1-m14)
  - deviations.md (V49-V64)
  - ../decisions/D050-whatsapp-chat-button.md, D054 (item 16), D062, D064 (items 1-11), D065 (items 1-8)
  - ../raw/brief/kickoff-brief.md (section 4; section 6 CMO Reviewer)
  - ../brand/positioning.md, ../brand/messaging.md, ../site/strategy.md ("In one screen"), ../site/content-boundary.md
  - design-system/project/07-selling.md (CTA hierarchy; objections; skeleton line 38), 10-pages.md (lines 26, 38-40, 72), tokens.css (lines 71-80, 100-103), components/bundle.css (line 1122) (read-only)
  - "src at 5b245a26: components/sections/CtaBlock/CtaBlock.tsx, cta-block.css; content/en-IN/pages/home.ts (lines 105-106, 137, 190, 282, 341, 402), products/kheelu/page.ts (lines 131, 250, 424), pages/safety.ts (79, 279), setup.ts (173), team.ts (185), contact.ts (135), ai-toys-for-kids-in-india.ts (149, 220), stories/hub.ts (175), not-found.ts (50), cta.ts (36, 44-47); components/sections/FilmsStrip/films-strip.css (176-193); layouts/LegalTemplate/legal-template.css (52-56); lib/tracking/cta.ts (103-108)"
  - "Local production server (next start 16.3.8, port 3931) on the built .next of 5b245a26; Playwright 1.63.0 Chromium, 1x, viewport chunks only; reduced motion for stills, motion on where it matters; 2026-10-15"
  - "test/guards/banned-phrases.data.ts findBanned, run on the one copy line proposed here (clean)"
---

# CMO review: the selling update as built (5b245a26)

> A review only. Nothing in the repo was changed. Only the founder signs copy
> ([D015](../decisions/D015-founder-signs-off-copy.md)); these verdicts never replace the founder's.

## Verdict

**The site now sells, on every page and at every size. One major consistency failure, no blocking issues.**

- Every selling page carries the same words beside every button: "Pre-order Kheelu", then "₹499 today, refundable.
  ₹4,999 in total.", then "Full refund until dispatch · 7-day returns" and "Deliveries start mid-November".
- The phone buy bar is on screen from the first scroll and steps aside whenever an inline button shows.
- The five-second test passes on Home and the product page at 360, 390, 412 and 1440 px.
- Nothing internal leaks. No page scrolls sideways. All 110 internal links and every anchor resolve.

**What fails is the shape of the CTA block (CMO-1).** The same block renders in four different shapes on phones:

- full width with an arrow;
- full width without one;
- a narrow centred button;
- a narrow left-aligned button.

The narrow shapes are all on the blocks this update added. The founder asked for "consistency across pages", and on
the button that sells, the site is not consistent yet. One default in `CtaBlock` fixes it.

Eight minor findings follow. One ruling: **Home's phone length is accepted for launch**, with a guard and a
measurement (R1).

## Pass or fail, by criterion

| Criterion (brief §6) | Verdict | Evidence |
|---|---|---|
| Every page says what the positioning says, to parents of 3-7 | **Pass** | Every hero and close; the eyebrow "Screen-free AI toy · Ages 3 to 7" on Home, the product page and the store |
| No internal leakage (pages, metadata, JSON-LD) | **Pass** | Metas and JSON-LD of `/`, `/products/kheelu`, `/safety` and the guide. No rating, review count, survey figure, competitor or unit count beyond "first 500". "Lumi" is the toy's former name (`alternateName`); the 27% on `/safety` is the cited Common Sense Media study |
| One obvious next step on every screen | **Pass** | The bar on every selling page from the first scroll (Home, product, `/safety`, `/team`, `/contact`, the guide, the hub, the button-close articles). By design there is no bar on `/setup` and the talking guides (D054 item 16). See CMO-8 for the product page's longest stretch |
| Five-second offer test (Home, product) | **Pass** | `sheets/first-360-a.png`, `first-412.png`, `shots/home-390x844-00.png`, `home-1440x900-00.png`, `product-1440x900-00.png` |
| Each CTA block reads the same | **Words: pass. Shape: fail (CMO-1)** | `sheets/cta-blocks-390.png` |
| Visual, phone first (360, 390, 412; 1440) | **Pass, with minors** | No overlap except the accepted bubble; no cut-off text; `scrollWidth = clientWidth` on all 17 routes at 390 and on the 11 checked at 360 |
| Motion | **Pass** | The hero is still at first paint. Each accent writes once (240 ms rise, then an 800 ms draw: DS tokens). The laptop sticky scroll fills a six-step line and swaps the picture. No content is hidden from a fast scroller (every reveal block in view measured opacity 1 at 100 ms). `sheets/motion-phone.png`, `motion-laptop-asks.png` |
| Lighthouse | **Not re-run here** (QA owns it) | Home's HTML is 52 KB gzipped (budget 60). Phone LCP is the H1 (60 ms locally); laptop LCP is the Kabir photo |
| Ad-landing readiness | **Pass** | The H1 matches the meta. Refund, returns and delivery are one tap from every button (`/refund#before-dispatch`, `#returns`, `/shipping#when`). The footer carries Contact, Shipping, Refunds, Terms and Privacy. The laptop hero's film link plays film 1 in the strip (checked) |
| Consistency across pages | **Fail (CMO-1)**; minors CMO-2, CMO-3, CMO-6 | |

## Per page (390 × 844 unless stated)

| Page | Sells, next step obvious? | Verdict | Findings |
|---|---|---|---|
| `/` | Yes. Kheelu is in the first screen at 390 and 412. The offer heading is at screen 9.0, with six inline blocks and the bar | Pass once CMO-1 is fixed | CMO-1, CMO-5, CMO-7, CMO-9; R1 |
| `/products/kheelu` | Yes. The offer heading is at screen 3.0 | Pass once CMO-1 is fixed | CMO-1, CMO-2, CMO-3, CMO-6, CMO-8 |
| `/safety` | Yes. A button follows the four facts | Pass once CMO-1 is fixed | CMO-1 |
| `/setup` | Yes. Help comes first, then "Don't have Kheelu yet?" | Pass once CMO-1 is fixed | CMO-1, CMO-4 |
| `/team`, `/contact`, 404 | Yes | Pass once CMO-1 is fixed | CMO-1 |
| `/ai-toys-for-kids-in-india` | Yes. A button after the answers, and the boxed close | Pass | |
| `/stories` and the three button-close articles | Yes. The topic closes are as planned ("A toy you can check.", "A toy that talks, with no screen.", "A toy that asks back.") | Pass | |
| `/stories/talking-toys-and-late-talkers` | "Keep reading", with no button and no bar (D054 item 16) | Pass | |
| `/privacy`, `/refund` | Drafts. `/refund` ends "Still deciding? Meet Kheelu" | Pass | |
| Store `/`, `/thanks` | The new eyebrow, the trust line and "Questions? Message us on WhatsApp." The checkout is untouched | Pass | |

## Major

### CMO-1 · The CTA block comes in four shapes on phones (layout → Builder; test → QA)

The block's words match everywhere, but its button shape and alignment don't.

Measured at 390 × 844 (`btn x/w`, arrow, alignment of the price line):

| Shape | Where |
|---|---|
| Full width (x16 w358), arrow, lines start | Home `hero`, product `product-top`, `/safety` `finale`, guide `guide-answers`, the journal closes |
| Full width, **no arrow** | `/safety` `safety-facts` (the same page's close has the arrow) |
| Narrow (w217) centred, no arrow | Home `home-why`, `home-asks` and `safety`; `/setup`, `/team`, `/contact` and 404 `finale` |
| Narrow (w217) left, no arrow | Home `finale`, product `product-ask` and `product-foot` |

On top of that:
- Home's `home-asks` and `safety` blocks are centred under start-aligned headings. DS 10-pages.md:26 centres actions
  only "under centred headings".
- A parent who comes from Home to `/safety` sees a different button for the same action. On Home itself the button
  shrinks from the hero's 358 px to 217 px.

**Evidence:**
- `sheets/cta-blocks-390.png`: the 14 blocks cropped side by side.
- `shots/metrics-390x844-reduce-*.json`.
- The cause is that the update's new blocks are configured without `block`/`arrow`: `home.ts:106` (the `centred`
  helper), `:402`, `products/kheelu/page.ts:250`, `:424`, `safety.ts:79`, `setup.ts:173`, `team.ts:185`,
  `contact.ts:135`, `not-found.ts:50`. The older blocks have them: `home.ts:137`, `safety.ts:279`,
  `ai-toys-for-kids-in-india.ts:149`, `:220`, `hub.ts:175`.

**Fix (one rule, not per page):**
1. In `src/components/sections/CtaBlock` (`cta-block.types.ts` and `CtaBlock.tsx`), make `block` and `arrow` default
   to true for every `CtaBlock` button, and drop the per-page flags.
   - `cta-block.css:23-32` already makes `.ks-cta__button.kh-btn--block` inline from 720 px, so laptops don't change.
   - The offer-card button and the bar are not `CtaBlock`s and stay as built.
2. Set `align` from the section heading (DS 10-pages.md:26): centred only under a centred heading. Home's `safety`
   block (`home.ts:341`) becomes start-aligned. `home-asks` may stay centred, because it sits under the centred line
   "Other AI gives answers. Kheelu asks questions.".
3. QA adds one check, for example in `first-screen.spec` or a new `cta-shape.spec`. At 390 × 844, every
   `[data-ph-capture-attribute-cta]` inside `.kh-section__actions`:
   - is the column's width (± 1 px);
   - has the arrow;
   - has its `ks-price` as the next block (C1 still holds).
4. DS tokens only; no new token.

## Minor

| # | Pages · size | What | Evidence | Fix | Route |
|---|---|---|---|---|---|
| CMO-2 | `/products/kheelu` vs `/` · 1440 | The offer block differs between the two pages. Home's card is x120 w440, with the trust line in 2 rows and the share link on 1 line. The product page's card is x212 w432 (indented 92 px inside a 524 px column), with the trust and payment items in **3 rows** ("UPI, card or net banking" alone) and the share link on 2 lines | `shots/home-1440x900-08.png`, `product-1440x900-03.png`; `probe.mjs p2.js` | Give the product page's `.ks-offer-split` Home's offer column. The card and its trust line start at the container's edge and run Home's width, so both pages' blocks wrap identically. `OfferSection`, DS tokens only | Builder |
| CMO-3 | `/products/kheelu` · all sizes | "See how we built safety in" is a ghost text link with an arrow. On Home and `/team` the same link is the DS secondary button with the shield icon, which is DS 07-selling's own example of a secondary learning action | `sheets/product-390x844-sheet04.png` (right) vs `sheets/home-390x844-sheet04.png` (right); `cta.ts:36` vs `:44-47` | Render `product-safety-learn` as `variant: "secondary"` with `icon: "shield-check"`, as Home's `safety-learn` (`home.ts:341`). Label and `cta` value unchanged | Builder |
| CMO-4 | `/setup` · all sizes | "App Store" and "Google Play" in "Before you start." render in the browser's default blue, `rgb(0, 0, 238)`. It is the only unstyled link on the site | `shots/zoom-setup-store-links-390.png` (2x crop) | Style links inside `.kh-trust__body` as the legal pages already do (`legal-template.css:52-56`: `color: var(--link)`, weight 700, the DS underline offset), in `TrustList`'s own CSS so every page gets it | Builder |
| CMO-5 | `/` · < 720 px | **The two clip captions wrap narrower than their players.** The phone rule `padding-right: calc(var(--space-8) + …)` (`films-strip.css:188-193`) keeps captions out of the bubble's column. Under the centred 232 px languages poster, the caption is 168 px and 4 lines, though the poster never reaches the bubble. The expert credit leaves "coach" alone on its line | `sheets/home-390x844-sheet02.png` (left), `sheet03.png` (middle); `p3.js`: `kh-body w168 lines4`, `w294 lines2` | In `languages-section.css`, set `.ks-langs-film .ks-clip__credit { padding-right: 0; }` below 720 px (2 lines, about 48 px shorter). On `.ks-clip__credit > p`, add `text-wrap: balance` so the credit breaks evenly | Builder |
| CMO-6 | `/products/kheelu` · phones | **Two help-line wordings one screen apart:** the FAQ ends "Still have a question? Message us on WhatsApp." and the close says "Questions? Message us on WhatsApp.". Plan §1.1 asks for one wording everywhere | `sheets/product-390x844-sheet05.png` | Drop the FAQ's line. The close's help line follows within a screen, and the bubble is always on. Otherwise use the one wording. The founder signs | Copywriter, Builder |
| CMO-7 | `/` offer fold · all | **The lead "There every day at home, with no screen to switch off." has no subject.** Read under "What you get, and what you pay.", "There…" makes a parent stop and re-read | `sheets/home-390x844-sheet03.png` (middle) | "Kheelu is there every day at home, with no screen to switch off." (`findBanned`: clean). The founder signs | Copywriter |
| CMO-8 | `/products/kheelu` · phones | **The longest stretch with no inline block on the site.** From `product-ask` (5,908 px) to `product-foot` (13,546 px) is 7,638 px: 9.0 screens at 390 and 12.4 at 360 × 640. The bar carries the action throughout, but the compare table, a decision point (DS 07-selling.md:38 puts a CTA after Compare), has none | `shots/metrics-390x844-reduce-home_product.json`; `sheets/product-390x844-sheet04.png` | Add a `CtaBlock` after fold 8 (Compare), start-aligned and in CMO-1's shape. It needs a **new** `cta` value (for example `product-compare`), registered in `cta.ts` and the [tracking inventory](../site/tracking-inventory.md). `compare` is reserved and never reused (`cta.ts:103-108`). This changes the plan's fold list, so the main session decides | Main session; Builder; QA (tracking) |
| CMO-9 | `/` · phones | The laptop crop of the hero photo (`loading="eager"`, `fetchpriority="high"`) still downloads on phones, where it is `display: none` (`currentSrc` w=256), at high priority beside the H1, which is the phone LCP | `p6.js` output (390 × 844) | Serve the two crops as one art-directed `<picture>` (Next's `getImageProps`, a `<source media>` per crop), so each size downloads one photo, at high priority on laptops only (plan §1.6, CMO m14) | Architect, Builder |

## Rulings

**R1 · Home's phone length: accepted for launch, with no cuts. Guard it and measure it.**

Measured with reduced motion:

| Size | Page | Screens | Offer heading |
|---|---|---|---|
| 390 × 844 | 15,027 px | 17.8 | 7,569 px (screen 9.0) |
| 412 × 915 | 14,913 px | 16.3 | screen 8.1 |
| 360 × 640 | 15,523 px | 24.3 | screen 12.0 |
| 1440 × 900 | 11,893 px | 13.2 | screen 7.3 |

Where the 390 px goes:

| Fold | px |
|---|---|
| Hero | 804 |
| Films and quotes | 1,655 |
| Recognised by | 210 |
| Why it matters | 980 |
| Languages | 1,148 |
| Kheelu asks | 2,048 |
| Expert | 560 |
| Offer | 1,658 |
| Safety | 1,471 |
| A day | 1,619 |
| Questions | 918 |
| Close | 860 |
| Footer | 1,024 |

Why I accept it:
1. **The extra length over the plan's estimate is proof, not padding.**
   - The seven 9:16 film posters are 509 px tall each at 390.
   - The six points are stacked.
   - The two real app screens are 453 px each.
   - Getting the offer to screen 8 means cutting proof for a named objection. DS 07-selling's objection table answers
     "Will it speak our language?" with the two-language video, and "Can I see what it says?" with the parent app.
2. **A buy button is never more than a flick away.**
   - The bar, with the price and "refundable", is on screen from the first scroll.
   - Inline blocks sit at screens 0.5, 4.1, 7.8, 9.9, 12.2 and 15.8, so the largest gap is 3.7 screens.
   - The founder's complaint was missing CTAs, not length.
3. **The offer's position follows the founder's order.** D064 item 8 puts the expert clip right after "What is
   Kheelu?". Nothing above the offer can move or go without the founder.
4. **The DS's section padding is not the cause, and is read-only.** It is `--space-8` on phones (`bundle.css:1122`),
   about 1,500 px over 12 sections, and it is what keeps a long page readable. Don't cut it, and don't hide the
   films or the languages film on phones.

Conditions:
- (a) Home gains no fold unless one leaves. QA pins the length at 390 × 844: the offer heading at most 7,700 px and
  the page at most 15,500 px (today 7,569 and 15,027).
- (b) CMO-5 trims about 48 px as a side effect.
- (c) After launch (PostHog, `env=production`, existing capture only, no new event), compare how far paid phone
  sessions get: fold 5 (`#asks`) against the offer (`#offer`), from recordings and heatmaps. If many leave between
  them, run the plan review's test 3, "the offer card straight after fold 5". The fold order is the founder's call.

**R2 · The one CTA shape (for CMO-1): full width on phones, with the arrow, inline from 720 px.**

Why this shape:
- It is the hero's shape (DS 10-pages.md:72), and the approved mockup used it for four placements
  (`cta-block.css:23-26`).
- It is the largest thumb target at the decision point.
- The arrow carries the founder's micro-interaction (D064 item 10).
- The narrow 217 px button is the newer shape on this site, and it made the button smaller exactly where this update
  asked for more selling.

## Checked and not reported

- The narrow hero photo at 390 and 412 (x16 w294 / w316) is V49's deliberate bubble clearance.
- The phone thumbnails of "Kheelu asks" look soft in 1x captures but are sharp at 3x (`w=384`;
  `shots/zoom-home-asks-thumb-advik-dpr3.png`).
- The bar's "refundable ·" break at 360 is two deliberate no-wrap parts.
- The share text keeps "(incl. GST)", as the main session ruled (V58).
- Not reported, per the task's accepted list: the bubble on every page, the store's checkout copy, and the phone
  number on `/contact`, the legal pages and the product page's Consumer care row.

## Evidence

All under the CMO scratch folder (local only, not committed):
`/private/tmp/claude-501/-Users-apoorvasahu-Documents-kheelona-com-website/a7840453-29e0-4cce-aaef-7d40bff98747/scratchpad/consistency/CMO/`.

- `shots/<page>-390x844-NN.png`: chunk NN starts at NN × 700 px.
- `shots/<page>-360x640-00.png` and `shots/<page>-412x915-0N.png`.
- `shots/home-1440x900-NN.png` and `shots/product-1440x900-NN.png`: chunk NN starts at NN × 820 px.
- `sheets/*`: three chunks side by side, at 1x.
- `shots/metrics-*.json`: headings, CTAs and floating elements.
- The scripts: `capture.mjs`, `sections.mjs`, `rhythm.mjs`, `probe.mjs`, `links.mjs`, `drawer.mjs`, `motion.mjs`.

The main session may copy any of these into `raw/qa/2026-10-15/cmo/`, local and uncommitted (D039).
