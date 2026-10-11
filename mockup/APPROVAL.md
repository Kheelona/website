# Gate A: homepage mockup, approval pack

For the founder. Prepared by the CTO, 2026-10-11. Nothing here is live: production is untouched until
Gate B ([D011](../wiki/decisions/D011-production-held-until-gate-b.md)). The brief stops here until you
approve (brief §7, Phase 3 step 5).

## 1. How to view it

- **On your phone:** the private link in §1a (published as a claude.ai Artifact, private to you).
- **On this machine:** open `mockup/index.html` in Chrome (no server or build needed).
- **The contrast option (decision 3):** add `?contrast=ink` (local file) or `#ink` (private link) to the address.
- The orange buttons go to the real store, `https://store.kheelona.com`. Other links point at today's
  live pages, which the reset will replace.

### 1a. Private link

**https://claude.ai/artifact/W6XpUUMXhdubxb4fvJpYxa** (private to you; every revision updates this same link). Add `#ink` to the end of the link to see the contrast option (decision 3).

## 2. Screenshots (phone first)

All in `mockup/screenshots/`. Phones: 360 × 640 (the most common width in our PostHog data, with the
smallest screens), the 360 × 590 first screen (WhatsApp's in-app browser height), 390 and 412.
Laptops: 1366 and 1440. Motion: `motion-phone-390.webm` (scroll, sticky bar, menu drawer).

| Screen | Phone 360 | Phone 390 | Laptop |
|---|---|---|---|
| First screen | `phone-360x590-00.png` (360 × 590), `phone-360-00.png` | `phone-390-00.png` | `laptop-1366-00.png`, `laptop-1440-00.png` |
| Hero board, see it ask | `phone-360-01.png`, `phone-360-02.png`, `phone-360-03.png` | `phone-390-01.png`, `phone-390-02.png` | `laptop-1366-01.png` |
| Why it matters, modes, parent app | | `phone-390-04.png` | `laptop-1366-03.png` |
| Safety | | `phone-390-08.png` | `laptop-1366-05.png` |
| Comparison (phone stack, Kheelu first) | `phone-360-compare.png` | | |
| Close and footer | `phone-360-18.png`, `phone-360-19.png` | | `laptop-1440-07.png` |
| Motion | `motion-phone-390.webm`: scroll, reveals, the sticky bar stepping aside for each orange button, the menu drawer | | |

## 3. Decisions for you (seven, each with my recommendation)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| 1 | **The one button label** (G1) | (a) "Pre-order Kheelu" everywhere, sticky bar included; (b) "Reserve Kheelu" | **(a).** It is today's label (your choice of 2026-08-22, no price on the button), stays true after the first 500 sell out, and matches the store. One label everywhere is a brief rule; the design system's three labels would break it (gap G-07) |
| 2 | **The hero headline and the price sentence** (D038, D028) | H1: (A) "Your child asks why. Kheelu asks back." (B) "Your child asks. Kheelu asks back." (C) "Kheelu answers. Then it asks back." (D) "It asks. They think." (E) "Kheelu asks back, so they think." Price sentence: (a) "Reserve yours for ₹499 today, refundable until dispatch, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST) before delivery." or (d) "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST)." | **H1 (A)**, the Copywriter's and the CMO reviewer's pick: every parent knows the "why" stage, and it names Kheelu. "It asks. They think." stays as the sticker on the hero board and for ads and packaging. **Price (d)** (the Copywriter's and CMO's pick, shown in the mockup): one sentence of 18 words, ₹499 first with "refundable until dispatch", the ₹4,999 total in the same sentence |
| 3 | **Button contrast** (G2) | (a) White on Chilli, the design system's brand rule: axe flags 4-5 buttons as serious (2.87:1), so the site misses brief §9.6 ("zero serious"); (b) ink on Chilli, the design system's own named alternative (5.5:1), needs the DS owner's OK; view it with `?contrast=ink` | **(b).** Zero axe issues, same orange buttons, darker label. If you keep (a), I record it as your accepted exception, as on production since 2026-08-24 |
| 4 | **Real films and photos** (G3) | (a) The seven consented parent films in fold 2 (once a consent record is on file and the captions are re-exported); (b) the illustrative conversation now in the mockup; also: disclose that the design system's children are AI-generated? | **(a) once the consent record is seen; (b) until then.** Films 3 and 7 are parents speaking to camera, so their words must stay within confirmed claims. On disclosure: yes, a short line on `/team` or the footer ("Illustrations and photos of children are created for Kheelona"), because the DS photos look real |
| 5 | **Motion** (G4; the DS has none for reveals) | Approve the spec in §6, or adjust it | **Approve.** Opacity and short upward reveals below the fold only, never on the hero, price or button; the sticky bar fades in once and steps aside for inline buttons; the drawer slides in; reduced motion turns movement off; nothing loops |
| 6 | **URLs and AI crawlers** (G8, G5, G7) | Drop `/playos` (301 to `/products/kheelu`) and fold `/stories/brain-development-toys-for-a-2-year-old` into the 3-year-old article (301); no new pages in v1. AI crawlers: allow all, block Bytespider | **Approve both.** `/playos` carries banned lines and draws 1 landing; the 2-year-old URL implies under-3 use, which the brief forbids. ChatGPT already sends 10% of our visitors and one of the two paid orders |
| 7 | **Two lines about data and Kheelona+** (F7; D035) | (i) What keeps working after the 6 included months of Kheelona+: the site must say it (legal review L7), and five lines assume the parent app stays available. (ii) The providers line on Home ends "and they never use it to train their AI": keep it (true of the providers, as D035 directs) or drop that clause on customer pages so no parent reads it as "nobody trains on my child's voice" | (i) **Decide now**, e.g. "After 6 months, Kheelu keeps talking and the parent app keeps showing conversations; stories, poems, jingles and extra languages need Kheelona+." Only you know the plan. (ii) **Drop the clause on customer pages**; it stays true and complete on `/privacy` |

## 4. The homepage, fold by fold

Copy: [`wiki/site/pages/home.md`](../wiki/site/pages/home.md) (sources per claim). Strategy:
[`wiki/site/strategy.md`](../wiki/site/strategy.md).

| # | Fold | Its job | Why (positioning · research · PostHog) |
|---|---|---|---|
| 1 | Hero: "Ages 3 to 7", H1, one-line explanation, button, price sentence, delivery and returns | What it is, who it's for, what it costs, in the first phone screen | Positioning: mechanism first ("It asks. They think."). PostHog: 90% of measured phone Home views never pass 25% of the page; paid visitors leave in 8 s; the CTA and price sentence fit inside 360 × 590 |
| 2 | See it ask | Show the mechanism before any claim | Films were the most-used element on the live site; the phone buyer watched all six. Until G3, a labelled illustrative exchange |
| 3 | Why conversation matters | The one reason it matters, credited to conversation (D016), with its Harvard source | Positioning's promise in the founder's form; source verification (C07) |
| 4 | What is Kheelu? Modes and languages | "Will it work in our home?" and the answer-first block for search and AI answers | Keyword map: "Kheelu by Kheelona" entity; 8 languages; Story mode offline |
| 5 | You see every conversation | Parents stay in the loop: log, weekly report, age setting, 36-month retention | Audience: "something I can see working"; D017, D036, D020 |
| 6 | Safety you can check | Checkable facts in your order (D020): button and light, providers, read and delete, no sale | Trust is the category's ceiling; the AI-toy rivals sell friendship and unchecked seals |
| 7 | Compared by category | Place Kheelu among what families already use, no brands | Positioning's alternatives; "Other AI gives answers. Kheelu asks questions." |
| 8 | Questions parents ask (6) | The remaining objections, 40-60 words each | Audience objections; keyword map question bank; one FAQ per question across the page |
| 9 | Close | Everything to say yes: price, what's included, button, Kheelona+ line, trust row, a person to ask | Benchmarks: reassurance travels with the button; 81 of 91 store visitors left without starting the form |

## 5. The button (CTA strategy)

One action (open the store), one label, the price sentence beside every button, delivery and returns
under it, and a trust row (7-day returns, 6-month warranty, UPI/card/net banking, delivery included).
Home has four inline buttons (hero, after "see it ask", after safety, the close) and, on phones, a
sticky bar that appears once the hero button scrolls away and steps aside whenever another orange
button or the offer card is on screen, so a phone screen never shows two. Laptop nav keeps its button
(it earned 11 of 24 laptop taps). Full detail: [strategy §3](../wiki/site/strategy.md#3-cta-strategy).

## 6. Motion spec (decision 5; DS gap G-10)

All timings are DS tokens. Interface feedback: the DS's own press, hover and state motion
(`duration-fast`, `duration-base`). Section reveals: below the fold only, opacity plus a short upward
move (`space-4`), `duration-enter`, `ease-standard`, once per section. Stickers below the fold settle
with `ease-bounce` (the DS's entrance easing). Sticky bar: fades and slides up once with
`duration-base`, then never animates except to step aside. Menu: native `<dialog>`, panel slides in
with `duration-enter` over the DS scrim. Never animated: the hero, the H1, the price sentence, any
orange button, the offer card. Only `transform` and `opacity` move, so nothing shifts the layout. With
reduced motion on, nothing moves and reveals are plain fades. No carousels move by themselves; nothing
loops. Recorded in `wiki/design-system/motion.md` once you approve.

## 7. Site map and URL plan

All 35 URLs keep working: each returns 200 with new content or 301s in one hop
([URL map](../wiki/site/url-map.md)).

| URL | Plan | Redirect |
|---|---|---|
| `/`, `/products/kheelu`, `/safety`, `/ai-toys-for-kids-in-india`, `/stories`, `/team`, `/setup`, `/contact`, `/privacy`, `/terms`, `/refund`, `/shipping` | Keep, new content | – |
| `/playos` | Drop (decision 6) | 301 → `/products/kheelu` |
| `/stories/brain-development-toys-for-a-2-year-old` | Merge (decision 6) | 301 → `/stories/learning-toys-for-a-three-year-old` |
| The other 21 articles | Keep, refreshed to the rules | – |
| `/kheelu`, `/careers` (404 today) | Add | 301 → `/products/kheelu`, `/team` |
| `www` and `http` chains (2-3 hops) | Fix to one hop | Host-matched rules |
| `/faq`, `/e/<tier>` | Keep as they are | unchanged |

## 8. Every other page, in short

| URL | H1 (direction) | Folds | Button | Primary search cluster |
|---|---|---|---|---|
| `/products/kheelu` | Meet Kheelu, the toy that talks back, then asks back | Hero with price and trust row · films or sample exchange · offer card ("everything included") · three modes and a Good-to-know box · the four skills as the weekly report shows them · safety facts · specs and India declarations (MRP ₹7,999, made in India, manufacturer) · FAQ (8) · speech disclaimer · close | Sticky from first paint; hero, offer card, safety, close | toys that talk back |
| `/safety` | Are AI toys safe? How Kheelu works | Answer first · the D020-order facts in full · what we never do · parent controls · retention · certification status ("applied for, not yet granted") · questions | Close, sticky | are AI toys safe |
| `/ai-toys-for-kids-in-india` | AI toys for kids in India: how to choose one | Answer first · five checks · how Kheelu meets each · plush or robot · questions | Close, sticky | AI toys for kids in India |
| `/stories` | Guides for parents of 3 to 7 year olds | Articles by topic | Close | parenting guides (hub) |
| `/stories/*` (21) | Each article's own | Article · one link to the product page · related | Close, sticky | one each |
| `/team` | The parents building Kheelu | Founders · why · bios once proof is filed | Close | Kheelona founders |
| `/setup` | Day one with Kheelu | Wake-up button · parent app · setting your child's age | Contact link | how to set up Kheelu |
| `/contact` | Talk to the team behind Kheelu | WhatsApp and calls · email · grievance officer (48 hours, one month) · seller details | Close | contact Kheelona |
| `/privacy`, `/terms`, `/refund`, `/shipping` | Plain titles | Plain-English summary, then the full text from D018-D037 and the legal review; training disclosed on `/terms` and `/privacy` (D035) | Link to the product page | their own |
| store | Reserve your Kheelu (restyle only) | Price sentence, delivery, trust row and 3-4 FAQs beside the form; "Indian WhatsApp number" with +91; in-app-browser hint | Pay button (logic unchanged) | noindex |

## 9. Tracking parity

Every tracking ID and event name stays exactly as it is
([tracking inventory](../wiki/site/tracking-inventory.md)): GA4 `G-7LMKSFEXZ9`, Meta Pixel
`1051265191046395` and its server-side Conversions API, PostHog `617632` (browser and the server
`purchase_confirmed`), Ahrefs, Vercel Analytics, the `kh_utm` / `kh_fbclid` attribution cookies,
Razorpay webhooks, and the three domain verifications. The eight existing PostHog `cta` values stay on
their equivalent buttons (`hero`, `navbar`, `navbar-mobile`, `finale` on Home); new buttons get new
values (`see-it-ask`, `safety`, `sticky-bar`), which adds data and changes nothing existing (G10). QA
proves parity in Phase 6 with captured network requests per event (the parity checklist in the
inventory).

## 10. Checks run before you saw it

| Check | Result |
|---|---|
| Design-system compliance | Only DS tokens and classes; `mockup.css` holds no colour, size or timing of its own (the only numbers are the DS's 720 and 1024 px breakpoints). DS checksums: 643 files match |
| Phone first screen | At 360 × 590: age, H1, the one-line explanation, the button, the full price sentence and the delivery line |
| Nothing scrolls sideways | 360, 390, 412, 1366, 1440: none |
| Accessibility (axe-core 4.12.1, 360 and 1366 px) | Only decision 3's white-on-Chilli buttons (serious, 2.87:1); 0 violations with `?contrast=ink`. Every link is a 44 px tap target. Headings in order, alt text on every image, visible focus (DS ring), skip link, native `<dialog>` and `<details>` |
| CMO review | Copy: ready after two fixes, both applied. Visual: ready after five layout and motion fixes (V1-V5), all applied before you saw it, plus most of the fourteen smaller items ([review](../wiki/qa/cmo-review-2026-10-11.md)) |
| Placeholders | One, marked: box contents (F4, specs not final) |
| Proofreading | en-IN, no em dashes in copy, one CTA label |

## 10a. What the CMO's visual pass changed

The comparison on phones is now one card per row with Kheelu's answer first (the table hid Kheelu off
screen); the hero board uses the DS's 1:1 frame so the boy's face is clear; no button, price or the offer
card ever animates; every trust item links to its terms; the parent-app heading has its space back; the
price sentence now sits straight under each button; the sticky bar stays until the offer card's own button
is on screen (a small, logged departure from the DS rule, gap G-09); the fold-4 photo and the repeated
mode description are gone; the close shows the offer before the picture. Still open for the build: the
heavy sticker PNGs (G-14) and a DS phone pattern for the comparison (G11).

## 11. What I need from you, in one message

Your answers to the seven decisions in §3 (a one-line "go with your recommendations" works), and any
change you want to the copy or the look. I iterate on your feedback, log each round, and start Phase 4
(architecture) only after your explicit approval.
