---
title: "Meet Kheelu (/products/kheelu): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.1-3.5 CTA rules, §4 URL plan, §5 product-page row, §7 search rules)
  - ../gate-a-open-items.md (founder answers of 2026-10-11 and working defaults)
  - ../../decisions/D040-films-move-to-new-site.md, D041-gate-a-round-1.md, D042-policy-display-answers.md, D043-all-pages-as-mockups-before-build.md
  - ../../raw/feedback/2026-10-11-gate-a-answers.md (verbatim founder answers)
  - ../../product/claims.md (§1, §2, §3, §4, §6, §8), ../../product/facts.md, ../../product/pricing.md, ../../product/policies.md, ../../product/age-band-review.md
  - ../../brand/messaging.md (confirmed candidate lines, objection answers, words to stop using), ../../brand/voice.md, ../../brand/positioning.md, ../../brand/audience.md
  - ../../research/keyword-map.md (§4.1 BUY-4, §5.1-5.2, §6.2 TT2 and SP1, §7.1), ../../research/source-verification.md (§4 C07)
  - ../content-boundary.md, ../tracking-inventory.md (§6, the eight cta values)
  - ../pages/home.md (approved pattern: CTA block, price sentence, trust line, safety block, FAQ form)
  - "../../../mockup/pages/home.html (built Home: films markup lines 45-100, price sentence line 15, trust line line 16, help line line 17)"
  - "../../qa/cmo-review-2026-10-11.md (F1, F2, S1, S6, S8, S12 applied here)"
  - "design-system/project/07-selling.md, 10-pages.md, 03-cast.md:100-126, assets/Kheelu/README.md, assets/Cast/README.md (read-only)"
  - "decisions D016-D042; binding here: D016-D028, D032-D036, D040-D042"
  - "../../decisions/D054-founder-answers-open-questions-2026-10-14.md (item 19: F4 rows without a final value come off the page; the box contents stay; task 6.7)"
  - "../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (item 26: the parent app is for iPhone and Android; task 6.7)"
  - "../../raw/research/geo/site-files-2026-10-10/llms.txt (lines 86-87: the live site's iOS and Android listings for the parent app, captured 2026-10-10)"
  - "../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md (item 2: the films heading; task 7.1b)"
  - "../../qa/cmo-review-built-a-2026-10-14.md (B2 the films heading, M6 the sources line, M8 the age-3 line; task 7.1b)"
---

# Meet Kheelu (`/products/kheelu`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft: CMO
> review next, then the founder signs off at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md),
> [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes, sources and checklists are INTERNAL.
- `{price-source}` after an amount: written as it is today, rendered from the single price source
  ([pricing](../../product/pricing.md)): ₹499 = `TOKEN_PRICE`, ₹4,500 = `BALANCE_PRICE`, ₹4,999 =
  `LAUNCH_PRICE`, ₹7,999 = `FULL_PRICE`, "first 500 units" = `CAP_UNITS_TEXT`. In the mockup each is a
  `<span data-src="...">`. Never typed by hand.
- `{delivery-source}`: the one delivery value, "Deliveries start mid-November", `<span data-src="DELIVERY_TEXT">`
  ([D023](../../decisions/D023-new-order-delivery.md); schema date 2026-11-15, [D037](../../decisions/D037-delivery-date-in-schema.md)).
- **Token mode** = while ₹499 reservations are open; **full mode** = after the first 500 units (₹7,999 paid in
  full). Each price element below says what it becomes in full mode.
- `[PLACEHOLDER: ...]` = a fact we do not have. In the mockup:
  `<span class="mk-placeholder">[PLACEHOLDER: what is missing]</span>`. All are listed under [Placeholders](#placeholders).
- `¹` = a source marker ([D026](../../decisions/D026-public-statistics.md)); this page has one (FAQ 8).
- Word counts exclude markers; hyphenated words count as one.
- **One behaviour form** everywhere except the H1: "answers your child, then asks a question back"
  ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md); CMO review S6).

## At a glance

| Item | Draft |
|---|---|
| Real URL | `/products/kheelu` (mockup file `meet-kheelu.html`; nav label "Meet Kheelu", `active` = `meet-kheelu`) |
| Page job | The selling page and default ad landing: tell, prove and sell on one page ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline), line 205) |
| Primary search cluster | **toys that talk back** (BUY-4, [keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13), lines 140, 218) |
| Meta title (56 characters) | Kheelu by Kheelona: the toy that talks back, ages 3 to 7 |
| Meta description, token mode (152 characters) | Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. ₹4,999`{price-source}` (incl. GST); ₹499`{price-source}` refundable advance. |
| Meta description, full mode (146 characters) | Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. ₹7,999`{price-source}` (incl. GST), delivery included. |
| H1 (recommended, option A) | Kheelu talks back. The good kind. |
| CTA label, everywhere | Pre-order Kheelu → `store.html` (real: `https://store.kheelona.com`, same tab) ([D041](../../decisions/D041-gate-a-round-1.md) line 16) |
| Price sentence, token mode (option (d), 18 words) | Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST). |
| Price sentence, full mode | ₹7,999`{price-source}` (incl. GST), paid in full when you order. |
| Trust line (beside every CTA) | Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked |
| Full trust row (OfferCard and close) | 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India |
| Help line | Questions? WhatsApp or call +91 91875 46483 |
| Sticky bar | From first paint on phones (strategy §3.4, line 140); shared partial: "₹499 today" big, "refundable · ₹4,999 total (incl. GST)" small, "Pre-order Kheelu", `cta` = `sticky-bar`; steps aside while the hero button or the OfferCard button is on screen ([D041](../../decisions/D041-gate-a-round-1.md) lines 26-27) |
| OG | `og:title` = title; `og:description` = meta; image `kheelu-on-fur.jpg` (DS: "for listings, WhatsApp, email and OG images"); alt "Kheelu, the cream plush rabbit that talks back" |
| Meta JSON for the mockup | `{"title": "Kheelu by Kheelona: the toy that talks back, ages 3 to 7", "description": "<token-mode meta above>", "url": "/products/kheelu", "buybar": true, "active": "meet-kheelu", "css": <builder's call>}` |

Title and meta are machine-read, so they lead with ₹4,999 (incl. GST) and give the advance second
([D028](../../decisions/D028-price-wording.md); [pricing](../../product/pricing.md) lines 175-176). Only the
sentence beside a button leads with ₹499. The title pairs "Kheelu by Kheelona" (entity rule,
[keyword map](../../research/keyword-map.md) line 74) with the primary; the keyword map's own draft
("Kheelu, the toy that talks back, for ages 3 to 7 · Kheelona", 59) is the alternative.

---

## Shared blocks (as on Home, defined once)

**Compact CTA block** (hero, OfferCard, safety): the button, then directly under it the price sentence, then
the trust line. Every trust item links to its terms: delivery → `shipping.html`, returns and warranty →
`refund.html`, payment → `terms.html` (CMO mockup pass V4, M1).

> **[Pre-order Kheelu]**
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

**Full CTA block** (the close): the compact block, then the full trust row and the help line.

**Help line:** "Questions? WhatsApp or call +91 91875 46483" (WhatsApp → `https://wa.me/919187546483`, call →
`tel:+919187546483`), an inline action, never a floating bubble; tap area at least 44 px (CMO M3).

Sources for every item in these blocks: [home.md, CTA block](home.md#cta-block) (same claims, same owners:
D021, D022, D023, D024, D028, D032, D033; pricing lines 68-72, 238).

---

## Fold 1 · Hero

**Fold job:** say what Kheelu is, who it is for and the one action, with the full price sentence and the trust
line, inside the first phone screen (360 × 590).

**Copy (first screen, in this order):**

> **Eyebrow (age chip):** Ages 3 to 7
>
> **H1:** Kheelu talks back. *The good kind.*
>
> **Sub-line:** A screen-free plush toy from Kheelona. It answers your child, then asks a question back, so they do the thinking.
>
> **[Pre-order Kheelu]** (`cta` = `product-top`; no `id` on this button: the sticky bar shows from first paint)
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

**Copy (directly below the first screen):**

> Questions? WhatsApp or call +91 91875 46483

- **Budgets:** eyebrow 4 words; H1 6 words (33 characters, two lines at 360 px); sub-line 20 words in two
  sentences; price sentence 18; trust line 8. That is two words fewer above the button than Home's hero, which
  fitted at 360 × 590 (CMO mockup pass, criterion 1).
- **H1 accent:** `Hand` (Kalam) on "The good kind." Full stops in the headline (DS `01-writing.md`).
- **Trust items in the hero:** the trust line only (delivery, returns), as on Home (CMO M14); the full row sits
  under the OfferCard and at the close. The brief's "trust row" in the first screen is met by this line.
- **Full mode:** the price sentence only changes.
- **Image (the board, under the words on phones, DS `10-pages.md`):** brand block (Kheelu Blue or Sunshine),
  one shape, the **Myra** sticker (`Cast/myra-sticker.png`, 3½; allowed alone, [D041](../../decisions/D041-gate-a-round-1.md)
  line 28), the Kheelu sticker (`Kheelu/kheelu-front-sticker.png`, tilted, belly unit visible), one doodle
  (`Doodles/chalk-question-mark.svg` or similar), one DS sticker reading "**It asks.** They think." (the master
  line, usable, [D038](../../decisions/D038-trust-content-rulings.md); message match with ads). Never cover a
  face (CMO V2).
  - Board `aria-label` (layers `alt=""`): **"Kheelu, the cream plush rabbit that talks back, beside a smiling little girl."**
    (the keyword map's alt pattern, true of the picture, [keyword map](../../research/keyword-map.md) line 338).
    Builder: check the girl's description against the sticker and add her clothing if it helps.

### H1 options for Gate A

The founder rejected Home's hookless lines ("it lacks a hook, which a parent might look for",
[raw](../../raw/feedback/2026-10-11-gate-a-answers.md) line 22). Each option below has a hook, carries
"talks back" except D (the product page's H1 rule, [keyword map](../../research/keyword-map.md) line 338),
keeps "AI" out of the headline ([voice rule 1](../../brand/voice.md#voice-rules-from-the-positioning)) and makes
no outcome claim. The sub-line is the same for all four.

| | H1 | Words | The hook | Risk |
|---|---|---|---|---|
| **A (recommended, built)** | Kheelu talks back. *The good kind.* | 6 | Every parent of a 3 to 7 year old knows "don't talk back". This turns the phrase a parent dreads into the reason to buy, and the sub-line says what the good kind is at once | For half a second "talks back" can read as cheeky; the accent on "The good kind." and the sub-line close it |
| B | Some toys repeat. Kheelu *talks back.* | 6 | The contrast with the repeating parrot or cactus a parent may already own; the clearest of the four on a cold landing | Less warmth; "some toys repeat" is a category description (no brand), for the CMO's fairness check |
| C | Talks back. Asks back. *No screen.* | 6 | Three beats a parent can repeat; screen-free in the headline | No product name and no subject, so it leans on the eyebrow and sub-line (the CMO's "no referent" note on "It asks. They think.") |
| D | Every why gets an answer, *and a question back.* | 9 | The "why" years as a scene; the mechanism in one line | Off-keyword (no "talks back"), three lines at 360 px; a Home candidate more than a product-page one |

**Recommend A.** If A is chosen for Home as well, the product page takes B, so the two pages never share an H1.

**Sources, fold 1**

| Claim | Source |
|---|---|
| Ages 3 to 7 | [facts](../../product/facts.md) line 83 (band 3 to 7, brief §2) |
| Screen-free plush toy; talks with a child and answers back ("talks back") | [facts](../../product/facts.md) line 73 (EXTERNAL); [keyword map §7.1](../../research/keyword-map.md) line 715 |
| "from Kheelona" (Kheelu by Kheelona) | [facts](../../product/facts.md) lines 70, 72 |
| Answers, then asks a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims](../../product/claims.md) line 70 |
| "so they do the thinking" | [strategy](../strategy.md) line 31 ("In one screen" item 2); [messaging](../../brand/messaging.md) line 300 |
| CTA label and destination; no price on the button | [D041](../../decisions/D041-gate-a-round-1.md) line 16; [strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1) |
| Price sentence (d) | [D041](../../decisions/D041-gate-a-round-1.md) line 18; [D028](../../decisions/D028-price-wording.md); [pricing](../../product/pricing.md) lines 68-72, 175 |
| Refundable until dispatch | [policies](../../product/policies.md) line 74 |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md); [facts](../../product/facts.md) line 189 |
| 7-day returns, no questions asked | [D021](../../decisions/D021-returns-policy.md); [policies](../../product/policies.md) line 104 |
| WhatsApp or call +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts](../../product/facts.md) line 223 |
| "It asks. They think." sticker | [D038](../../decisions/D038-trust-content-rulings.md); [messaging](../../brand/messaging.md) line 74 |
| Board images | DS `assets/Cast/README.md`, `assets/Kheelu/README.md`; [D041](../../decisions/D041-gate-a-round-1.md) line 28 |

---

## Fold 2 · Proof: the seven parent films

**Fold job:** let a parent see real children talking with Kheelu before reading any claim about it.

Section `id="films"`. Founder: the films move to the new site ([D040](../../decisions/D040-films-move-to-new-site.md)
lines 15-21); the product page prefers them to the illustrative exchange (task brief).

**Copy:**

> **Eyebrow:** Real homes
>
> **H2:** Real families, in their *own homes.*
>
> **Lede (the proof line):** Watch the children do the thinking. Then hear from two of their parents.
>
> *(the films strip, exactly as on Home)*
>
> **Caption under the strip:** Shared with each family's written consent.

- **H2 accent:** `Hand` on "own homes."
- **The films:** reuse Home's markup and assets exactly (`mockup/pages/home.html` lines 43-107): the seven
  tiles in Home's order, the same chips, captions, durations, poster alt texts and play labels
  ("Play: {chip}. {caption}", "Previous video", "Next video", "1 of 7"). Film 6's caption is the founder's:
  "In AI mode, Arha switches to English, and Kheelu switches with her." (D040 line 23). Film 1 keeps "Learning
  by asking" (D040 line 24). Burned-in subtitles ship as they are (D040 line 25).
- **The proof line** answers the founder's "mention something like kids love it and parents approve it. Do
  proper copy writing" ([raw](../../raw/feedback/2026-10-11-gate-a-answers.md) line 39) while claiming only what
  the films show (D040 line 31): children talking things through with Kheelu (films 1, 2, 4, 5, 6) and two
  parents speaking to camera (films 3 and 7). It does not say the children love it or that parents approve,
  because the films show neither as a statement. Alternative: "Children talking things through with Kheelu,
  and two parents on what they noticed." (open question 2).
- **Consent caption:** states the founder's 2026-09-19 statement as published fact (open question 2).
- **No CTA here:** the OfferCard follows directly with its own button, and the sticky bar is on screen through
  this fold (strategy §3.3, line 130). The carousel controls close the section.
- **No DS cast photo in this fold** (never next to the films; task brief, DS `03-cast.md` line 142).
- **Tracking:** no new events; the play buttons keep the live labels so the audit's "Play:" count stays
  comparable (D040 lines 33-35).

**Sources, fold 2**

| Claim | Source |
|---|---|
| Seven films, chips, captions, alt texts, play labels | `mockup/pages/home.html` lines 45-100; [D040](../../decisions/D040-films-move-to-new-site.md) lines 21-25; [claims](../../product/claims.md) line 298 |
| H2 "Real families, in their own homes." (no count of families; task 7.1b) | [D056](../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md) item 2 (founder, 2026-10-14); [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) B2 (seven films, not seven families: Arha is in films 4 and 6). "In their own homes": question 8 |
| Two of the films are parents speaking | home.html lines 61-68 (film 3), 93-100 (film 7) |
| "do the thinking" | [strategy](../strategy.md) line 31 |
| Written consent held for every child | [D040](../../decisions/D040-films-move-to-new-site.md) line 22 (founder, 2026-09-19, in [settled decisions](../../legacy/settled-decisions.md)) |

---

## Fold 3 · Everything that comes with it (OfferCard)

**Fold job:** put the offer right after the first proof: what comes with Kheelu, what it costs today and in
total, the button and the risk reversal.

Section `id="offer"`.

**Copy:**

> **Eyebrow:** What you get
>
> **H2:** Everything that *comes with it.*
>
> **OfferCard**
> - product: Kheelu
> - price: ₹4,999`{price-source}` · incl. GST
> - split: Today, refundable · ₹499`{price-source}` · Before delivery · ₹4,500`{price-source}`
> - list:
>   - In the box: Kheelu plush toy, charger and quick-start card
>   - 6 months of Kheelona+ included: stories, poems, jingles, languages and the parent app
>   - Delivery anywhere in India, included
>   - Deliveries start mid-November`{delivery-source}`
>   - A GST invoice with every order
> - **[Pre-order Kheelu]** (`cta` = `product-offer`, new)
> - fine: Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking
>
> Questions? WhatsApp or call +91 91875 46483

- **H2 accent:** `Hand` on "comes with it." The heading avoids "Everything included": beside a 6-month
  Kheelona+ line, "everything included" can read as "nothing to pay later", which D041 leaves unsaid (open
  question 4). No price in the heading (D028: ₹499 never without the total).
- **Kheelona+:** only what is included at the start, in the founder's own words (the first clause of
  [D027](../../decisions/D027-story-mode-wording.md)'s line). Nothing about what happens after the 6 months, and
  no "for life" or "pricing announced soon" sentence ([D041](../../decisions/D041-gate-a-round-1.md) line 24;
  open question 3).
- **Box contents:** the founder's list ([D041](../../decisions/D041-gate-a-round-1.md) line 30), so Home's F4
  placeholder is no longer needed here.
- **Trust row under the card:** three items; "Delivery included anywhere in India" is already a perk in the card.
- **OfferCard settings:** `sticker` off (no "First 500" burst); `was` unset (no strike-through; MRP ₹7,999 sits
  in the declarations, fold 7, [D034](../../decisions/D034-origin-manufacturer-mrp.md) copy note);
  `unitsLeft`/`unitsTotal` never set (DS gap G-08). "Refundable" stays beside ₹499 in the split.
- **Full mode:** a composed block replaces the card (as on Home, G-08): price "₹7,999`{price-source}` (incl.
  GST)", the full-mode price sentence, the same list without the split, the button, the trust row.
- **Image (optional, after the card on phones):** `Kheelu/kheelu-on-fur.jpg`. Alt: "Kheelu by Kheelona: the
  cream plush rabbit with rainbow ears and a speaker in its tummy." No child here (the hero and the close carry
  the cast).
- **Sticky bar:** stays until the card's own button is on screen, then steps aside (D041 line 26).

**Sources, fold 3**

| Claim | Source |
|---|---|
| ₹4,999 incl. GST; ₹499 today, refundable; ₹4,500 before delivery | [pricing](../../product/pricing.md) lines 68-72, 175-178; [D028](../../decisions/D028-price-wording.md); [D024](../../decisions/D024-payment-methods-gst.md) |
| In the box: Kheelu plush toy, charger, quick-start card | [D041](../../decisions/D041-gate-a-round-1.md) line 30; [raw](../../raw/feedback/2026-10-11-gate-a-answers.md) line 54 |
| 6 months of Kheelona+ included: stories, poems, jingles, languages and the parent app | [D027](../../decisions/D027-story-mode-wording.md) lines 25-26 (first clause); [D041](../../decisions/D041-gate-a-round-1.md) line 24; [facts](../../product/facts.md) line 179 |
| Delivery anywhere in India, included | [pricing](../../product/pricing.md) line 238; [policies](../../product/policies.md) line 79 |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md) |
| GST invoice with every order | [D024](../../decisions/D024-payment-methods-gst.md); [policies](../../product/policies.md) line 116 |
| 6-month warranty | [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md); [policies](../../product/policies.md) line 106 |
| UPI, card or net banking | [D024](../../decisions/D024-payment-methods-gst.md); [policies](../../product/policies.md) line 115 |
| Trust row, help line | [Shared blocks](#shared-blocks-as-on-home-defined-once) |

---

## Fold 4 · How it works: three modes, and good to know

**Fold job:** answer "what does it do, and will it work in our home?": the mechanism once, the three modes,
the languages, and the honest limits in one box.

Section `id="modes"` (Home links here).

**Copy:**

> **Eyebrow:** How it works
>
> **H2:** A toy that talks back, not a toy that *repeats.*
>
> **Lead:** Kheelu is a screen-free plush toy for ages 3 to 7 that holds a back-and-forth conversation. It answers your child, then asks a question back, so they do the thinking.
>
> **AI mode**
> Open conversation, on your home Wi-Fi. It can't browse the internet.
>
> **Story mode**
> Stories, poems and jingles your child enjoys and learns from. No Wi-Fi needed.
>
> **Bluetooth mode**
> Pair your phone and use it as a speaker.
>
> **Up to 10 languages at launch**
> *(language chips)* English · हिन्दी Hindi · বাংলা Bengali · తెలుగు Telugu · தமிழ் Tamil · ಕನ್ನಡ Kannada · Español Spanish · Français French
> It can switch between them mid-sentence.
>
> **Good to know**
> - AI mode needs your home Wi-Fi. Story mode and Bluetooth mode work without it.
> - It can't browse the internet. When it doesn't know something, it says so.
> - Each conversation starts with a press of the wake-up button. It switches itself off after about a minute of quiet.
> - At setup, you enter your child's age in the parent app.
> - It charges with the charger in the box.
>
> [How setup works] → `setup.html`

- **H2:** the keyword map's own H2 for this page, carrying the primary ([keyword map](../../research/keyword-map.md)
  line 338). Accent `Hand` on "repeats." "Repeats" is a category description (talking toys that play back what
  a child says; no brand), for the CMO's fairness check.
- **Lead:** 30 words; the mechanism said once. The mode cards do not repeat it (CMO M5).
- **Modes:** on phones one compact row (`ModeSwitch` as an explainer, icons dropped, DS `10-pages.md`), three
  `FeatureCard`s on wider screens. Story mode is [D027](../../decisions/D027-story-mode-wording.md)'s line with the
  DS spelling "Wi-Fi" (working default A11). Non-breaking hyphen in "Wi-Fi" (CMO M11).
- **Languages:** the DS's own heading and the eight named chips only, each with its `lang` (gap G-13); no "+2
  more" chip.
- **Good to know:** composed from DS parts (a `kh-card kh-card--tint` with a list; the DS has no named
  component for it, and `Alert` is store-only). Five items, each a plain limit or fact. Not used here: the
  closed content library (claims flag: beside the outside AI providers it must not suggest no AI model is
  involved, [claims](../../product/claims.md) line 114); "remembers" (D036 wants it next to the parent's
  controls, so it sits in FAQ 7); anything about how well Kheelu understands a 3-year-old (working default B4).
- **The charging line (task 6.7):** its F4 slot (battery life per charge and charging time) is hidden until the
  founder sends final values ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19). The
  line keeps its confirmed half, "It charges with the charger in the box." (the box contents stay, D054 item 19), so
  Good to know still has five items.
- **Images:** `Photo library/advik-02-whispering-to-kheelu-web.webp` (16:9) beside or above the modes. Alt: "A
  boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window." In the Good to
  know box: `Kheelu/kheelu-belly-module.png` (DS: "for setup guides and how it works"). Alt: "Kheelu's tummy unit
  up close, with its speaker, light ring and buttons." The copy never describes what the light looks like (not
  specified, [D018](../../decisions/D018-wake-up-button.md) line 28).
- **No CTA** (strategy line 130); the link closes the section (DS `10-pages.md`).

**Sources, fold 4**

| Claim | Source |
|---|---|
| Screen-free plush toy; ages 3 to 7 | [facts](../../product/facts.md) lines 73, 83 |
| Holds a back-and-forth conversation | [facts](../../product/facts.md) line 73 ("talks with a child and answers back"); Home comparison row "Holds a back-and-forth conversation: Yes" ([home.md](home.md) fold 7) |
| Answers, then asks a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims](../../product/claims.md) line 70 |
| AI mode on home Wi-Fi; can't browse the internet | [facts](../../product/facts.md) lines 98, 144; [claims](../../product/claims.md) line 71 |
| Story mode line; no Wi-Fi needed | [D027](../../decisions/D027-story-mode-wording.md) line 20; [claims](../../product/claims.md) line 79; [facts](../../product/facts.md) line 99 |
| Bluetooth mode: a speaker for a paired phone | [facts](../../product/facts.md) line 100 |
| Up to 10 languages at launch; the eight named; switches mid-sentence | [facts](../../product/facts.md) lines 110-112 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) line 19 (#3); [claims](../../product/claims.md) line 117 |
| One press per conversation; off after about a minute of quiet | [D018](../../decisions/D018-wake-up-button.md) lines 24-28; [claims](../../product/claims.md) line 73 |
| Parent enters the child's age in the app at setup | [D036](../../decisions/D036-launch-feature-claims.md) lines 25-26 |
| Charger in the box | [D041](../../decisions/D041-gate-a-round-1.md) line 30 |
| Battery life and charging time: hidden until final (task 6.7) | [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19 |
| Belly unit: speaker, light ring, buttons | DS `assets/Kheelu/README.md` line 9 |

---

## Fold 5 · The parent app: four thinking skills

**Fold job:** show what a parent actually sees: the weekly report on the four thinking skills, with real app
screens.

Section `id="app"` (Home links here).

**Copy:**

> **Eyebrow:** The parent app
>
> **H2:** Their week, in four *thinking skills.*
>
> Every week, the parent app gives you a report on four thinking skills: words, reasons, stories and questions, plus a new-word count. And you can read every conversation, word for word.
>
> *(chips)* Words · Reasons · Stories · Questions
>
> The parent app is part of Kheelona+, included for 6 months with every Kheelu.
>
> *(two real app screens, in the DS phone frame)*
>
> **Caption:** Real app screens, October 2026. Names changed; some content added for illustration.
>
> [See what we keep, and for how long] → `#safety`

- **H2 accent:** `Hand` on "thinking skills."
- **What the copy claims:** the weekly report on the four skills and the new-word count
  ([D036](../../decisions/D036-launch-feature-claims.md) #1, #8), and reading every conversation word for word
  ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)). The four skills are named, never described:
  what Kheelu does for each skill and what each part of the report shows beyond the new-word count are not
  confirmed ([positioning](../../brand/positioning.md) lines 220-229, F8). No outcome for the child, no age-by-age
  claims, no advisor (legal review L7; [D038](../../decisions/D038-trust-content-rulings.md)). The real screens
  carry the proof.
- **The Kheelona+ line:** Home's plain line (Home fold 5), kept for the same reason: it states the included
  period beside "read every conversation" without saying anything about after it (D041 line 24; open question 3).
- **Images:** `mockup/assets/app/app-transcript.webp` and `mockup/assets/app/app-activity.webp` (being produced;
  reference the paths). Draft alts, to check against the files when they land:
  - app-transcript: "A real parent-app screen showing a conversation between a child and Kheelu, word for word."
  - app-activity: "A real parent-app screen showing a child's week of activity."
  If the activity screen shows the four skills or the new-word count, add that to its alt. Do not use
  `AppSummaryCard` (its "Today with Kheelu" framing implies a daily summary, not cleared: claims line 120).
- **No CTA** (strategy line 130); the link points to the safety fold, which follows.

**Sources, fold 5**

| Claim | Source |
|---|---|
| Weekly report on four thinking skills; their names | [D036](../../decisions/D036-launch-feature-claims.md) line 16 (#1); [messaging](../../brand/messaging.md) line 65 ("the model parents repeat", EXTERNAL as what the report covers) |
| New-word count | [D036](../../decisions/D036-launch-feature-claims.md) line 24 (#8) |
| Read every conversation, word for word | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims](../../product/claims.md) line 72; [facts](../../product/facts.md) line 150 ("the full conversation log word for word") |
| Parent app is part of Kheelona+, included for 6 months | [D027](../../decisions/D027-story-mode-wording.md) lines 25-26; [facts](../../product/facts.md) line 168; Home fold 5 (`mockup/pages/home.html` line 213) |
| Screenshot caption | Task brief (founder's wording for the real app screens) |

---

## Fold 6 · Safety you can check

**Fold job:** answer "is it always listening, where does the voice go, can I check?" with short facts in the
founder's order, then the button.

Section `id="safety"`.

**Copy:**

> **Eyebrow:** Safety
>
> **H2:** Safety you can *check.*
>
> **You'll always see when it's listening.**
> Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it's listening. Left alone, it hears nothing and sends nothing.
>
> **How it understands and answers.**
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **You can read and delete every conversation.**
> Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> **We don't sell your data.**
> Your child's data is never used to advertise to them.
>
> *(facts row)* No camera · It can't browse the internet · It says it's a toy, and never asks your child to keep a secret from you
>
> **[Pre-order Kheelu]** (`cta` = `product-safety`, new) + compact CTA block
>
> [See how we built safety in] → `safety.html`

- **Order is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s** (lines 30-32): button and light →
  providers → read and delete → no sale. `TrustList`, one column on phones; icon above the title on phones so
  text takes the full width (CMO M13).
- **Item 1** is Home's (D018's sentences, the "Kheelu" in the heading replaced by "it"); no "wake word" phrase
  (working default A10). **Item 2** is D020's providers line in full and verbatim, with the CMO's F2 heading;
  the training clause is the founder's choice to keep ([D041](../../decisions/D041-gate-a-round-1.md) line 23) and
  stays scoped to the providers ([D035](../../decisions/D035-model-training-opt-out.md)). **Item 3** carries D020's
  retention line verbatim (it is not elsewhere on this page). Nothing says "nothing is ever recorded", "no
  risk", or that the microphone is disconnected. The word "safe" is not used.
- **Secondary link:** the DS's own learning action (`07-selling.md` line 52); suggested `cta` =
  `product-safety-learn` (new, optional).
- **Image (recommended):** `mockup/assets/app/app-privacy.webp` beside item 3, with the same caption as fold 5
  ("Real app screens, October 2026. Names changed; some content added for illustration."). Draft alt, to check
  against the file: "A real parent-app screen with privacy controls, including deleting conversations." No
  imagination layer on a safety block (DS `02-imagery.md` line 57).
- **Never animated:** the button, the price sentence and the facts row (CMO V3).

**Sources, fold 6**

| Claim | Source |
|---|---|
| Microphone on only after a press of the wake-up button; on while the child talks; off after about a minute of quiet; a light shows; left alone, hears and sends nothing | [D018](../../decisions/D018-wake-up-button.md) lines 24-28, 32-37; [claims](../../product/claims.md) line 73; [facts](../../product/facts.md) line 124 |
| Providers line | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 22-24; [D019](../../decisions/D019-voice-providers.md); [claims](../../product/claims.md) line 74; [messaging](../../brand/messaging.md) line 244 |
| Read and delete; 36 months, then deleted automatically | [D020](../../decisions/D020-provider-terms-and-no-sale.md) lines 26-27; [claims](../../product/claims.md) lines 72, 78 |
| We don't sell your data; never used to advertise | [D020](../../decisions/D020-provider-terms-and-no-sale.md) line 25; [D038](../../decisions/D038-trust-content-rulings.md); [claims](../../product/claims.md) lines 75-76 |
| No camera; says it's a toy; never asks for a secret | [claims](../../product/claims.md) lines 68-69 |
| Can't browse the internet | [claims](../../product/claims.md) line 71 |
| CTA block | [Shared blocks](#shared-blocks-as-on-home-defined-once) |

---

## Fold 7 · The details: specs, box, safety and declarations

**Fold job:** give the checkable details and the India declarations in one place, with only confirmed facts
and visible placeholders for the rest. *(Task 6.7: the rows and lines still waiting on F4 are now hidden, not
shown as placeholders, until the founder sends final values: [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md)
item 19.)*

Section `id="specs"`. `Tabs` (line tabs, ARIA pattern; DS: "Product details (Specs / In the box / Safety)").
Without JavaScript all three panels show, one under the other (builder).

**Copy:**

> **Eyebrow:** Details
>
> **H2:** The details, *in full.*
>
> **Tab: Specs**
> - Ages: 3 to 7
> - What it is: A cream plush rabbit with a speaker in its tummy and rainbow-lined ears
> - Screen: None
> - Camera: None
> - Microphone: On only after a press of the wake-up button; off after about a minute of quiet; a light shows while it's on
> - Modes: AI mode (home Wi-Fi) · Story mode (no Wi-Fi needed) · Bluetooth mode (a paired phone)
> - Open internet: It can't browse it
> - Languages: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French; up to 10 at launch
> - Parent app: Every conversation, word for word; a weekly report on four thinking skills; a new-word count. On iPhone and Android.
>
> **Tab: In the box**
> - Kheelu plush toy
> - Charger
> - Quick-start card
>
> **Tab: Safety**
> - Every reply passes an age-graded safety layer, set to the age you enter in the parent app.
> - Tested before launch by trying to make it say unsafe things.
> - Toy-safety certification (BIS): applied for, not yet granted. We show no mark until it is granted.
>
> **Declarations** *(always visible, under the tabs)*
> - MRP: ₹7,999`{price-source}` (incl. of all taxes)
> - Country of origin: India
> - Manufacturer: Kheelona Robotics Pvt Ltd, 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India
> - Consumer care: WhatsApp or call +91 91875 46483 · hello@kheelona.com
>
> [Read the returns and warranty terms] → `refund.html`

- **H2 accent:** `Hand` on "in full."
- **MRP** renders from `FULL_PRICE` and is labelled exactly "MRP"; never struck through beside ₹4,999 and
  never with a countdown ([D034](../../decisions/D034-origin-manufacturer-mrp.md) lines 24-25;
  [pricing](../../product/pricing.md) line 239).
- **The BIS line** is the honest status only, never a mark or a licence number until one exists
  ([claims](../../product/claims.md) line 309, BIS-02). Whether it shows here or only on `/safety` is open
  question 5.
- **"Tested before launch by trying to make it say unsafe things"** is D036's own gloss of "red-teamed"; it
  promises nothing about results.
- **Placeholders:** nine on this fold (see [Placeholders](#placeholders)); the mockup shows each in
  `mk-placeholder`. **Since task 6.7, none:** the parent-app slot is filled ("On iPhone and Android.",
  [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 26), and the eight F4 rows and lines
  (size and weight, materials, battery, charger; age grading and warnings, battery safety; net quantity, month and
  year of manufacture) are hidden until the founder sends final values
  ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19). Each comes back in its
  approved place, with its approved label, when its value arrives. The In the box tab stays as it is (D054 item 19).
- **The hidden declarations and certifications (task 6.7):** net quantity and dimensions (the size row) are
  declarations the Legal Metrology rules want on the selling page itself (only the month and year are exempt
  online), the charger and battery need
  BIS registration, and age grading and warnings come from the toy-safety test
  ([legal requirements](../../product/legal-requirements.md) H4 and H5;
  [L4](../../open-questions.md#l-legal-actions-from-the-indian-law-review-founders-ask-one-at-a-time): before the
  first dispatch). Hiding the rows says nothing untrue, but the page then lacks them: question 7.
- The link closes the section.

**Sources, fold 7**

| Claim | Source |
|---|---|
| Ages 3 to 7 | [facts](../../product/facts.md) line 83 |
| Cream plush rabbit, speaker in its tummy, rainbow-lined ears | [facts](../../product/facts.md) line 74 |
| No screen | [facts](../../product/facts.md) line 73 ("no face screen"); [messaging](../../brand/messaging.md) line 196 (screen-free) |
| No camera | [claims](../../product/claims.md) line 68 |
| Microphone row | [D018](../../decisions/D018-wake-up-button.md); [keyword map §7.2](../../research/keyword-map.md) line 738 (the D018 form for the spec row) |
| Modes; open internet "can't browse" | [facts](../../product/facts.md) lines 98-100, 145 ("Open internet: No", EXTERNAL) |
| Languages | [facts](../../product/facts.md) lines 110-111 |
| Parent app row | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D036](../../decisions/D036-launch-feature-claims.md) #1, #8 |
| Parent app: on iPhone and Android | [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 26 (founder, 2026-10-14); the live site's llms.txt, [raw capture](../../raw/research/geo/site-files-2026-10-10/llms.txt) lines 86-87 (an iOS listing on the App Store, an Android listing on Google Play) |
| Size, materials, battery, charger, age grading and warnings, battery safety: hidden until final (task 6.7) | [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19 |
| In the box | [D041](../../decisions/D041-gate-a-round-1.md) line 30 |
| Age-graded safety layer set to the parent's entry | [D036](../../decisions/D036-launch-feature-claims.md) lines 21, 25-26 (#6); [claims](../../product/claims.md) line 115 |
| Red-teamed before launch | [D036](../../decisions/D036-launch-feature-claims.md) line 23 (#7) |
| BIS: applied for, not yet granted | [claims](../../product/claims.md) lines 308-309 (EXTERNAL status line) |
| MRP ₹7,999 incl. all taxes; made in India; manufacturer | [D034](../../decisions/D034-origin-manufacturer-mrp.md) lines 15-18; [messaging](../../brand/messaging.md) line 256 |
| Registered address | [policies](../../product/policies.md) line 142 (seller details as published) |
| Net quantity, manufacture date still placeholders (task 6.7: hidden until final) | [D034](../../decisions/D034-origin-manufacturer-mrp.md) lines 20-21; [policies](../../product/policies.md) line 124; [D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19 |
| Consumer care | [facts](../../product/facts.md) lines 223-224; [D032](../../decisions/D032-grievance-block-and-call-line.md) |

---

## Fold 8 · Questions parents ask (8), then the speech disclaimer

**Fold job:** answer the eight questions a parent still has near the close, answer-first, 40 to 60 words each.

Section `id="faq"` (Home's "See all questions" links here; `/faq` 301s here, [strategy](../strategy.md) line 180).

**Copy:**

> **Eyebrow:** Questions
>
> **H2:** Questions parents *ask.*
>
> **Will Kheelu do the thinking for my child?**
> No. That is what it is built against. Most AI gives answers. Kheelu answers your child, then asks a question back, so they do the thinking. When it doesn't know something, it says so instead of guessing. It can't browse the internet, and you can read every conversation in the parent app.
>
> **What is the difference between a talking toy and a toy that talks back?**
> Many talking toys play recorded phrases or repeat what your child says. A toy that talks back replies to what your child says, so a conversation can go back and forth. Kheelu is a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back.
>
> **Is Kheelu right for a 3-year-old?**
> Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby. When you set it up, you enter your child's age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.
>
> **What does Kheelu cost, and what is the advance for?**
> Kheelu is ₹4,999`{price-source}` (incl. GST) for the first 500 units`{price-source}`, with delivery anywhere in India included. The ₹499`{price-source}` is a refundable advance to reserve yours; the remaining ₹4,500`{price-source}` is due before delivery. After the first 500, it is ₹7,999`{price-source}` (incl. GST), paid in full. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice.
>
> **When does delivery start?**
> Deliveries start mid-November`{delivery-source}`. Orders are sent in the order they were placed, and you get a tracking link when yours leaves us. Delivery is included anywhere in India, with nothing to pay at the door; we don't ship outside India. A reserved Kheelu is sent once the rest of the price is paid.
>
> **What if it isn't right for us, or stops working?**
> Return it within 7 days of delivery, no questions asked; opened is fine if it comes back undamaged and complete. Pickup is free. Arrived faulty? Tell us within 7 days and we replace it. The 6-month warranty covers manufacturing defects, not drops, water damage or misuse: we repair it, or replace it if the repair doesn't work.
>
> **Will my child still play with it after the first week?**
> No toy can promise that. Kheelu remembers earlier conversations, so it can pick up where your child stopped instead of starting over. Story mode adds stories, poems and jingles, with no Wi-Fi needed. You can read or delete any conversation in the parent app.
>
> **Can Kheelu help my child's speech?**
> Kheelu is a toy, not a therapy or treatment. Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult support early language and social skills.¹ Kheelu doesn't replace that time with you. If you're worried about your child's speech, talk to your paediatrician.
>
> **Sources**
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts). https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> **Speech disclaimer (visible, under the questions):** Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician.
>
> Still have a question? WhatsApp or call +91 91875 46483

*Built with one change (P15 default, [deviation V6](../../qa/deviations.md)): "Tell us within 7 days and we replace it." ships as "Tell us within 7 days for a replacement or a full refund." (D033, Rule 7(4); task 4.7). The quote above stays as approved at Gate A.*

Word counts: 52 · 51 · 57 · 60 · 53 · 57 · 44 · 53. Full-mode price answer below.

**Full mode**, question 4 becomes:

> **What does Kheelu cost?**
> Kheelu is ₹7,999`{price-source}` (incl. GST), paid in full when you order, with delivery anywhere in India included. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice. Deliveries start mid-November`{delivery-source}`. If it isn't right for your family, return it within 7 days of delivery, no questions asked. (53 words)

- **H2 accent:** `Hand` on "ask." `FAQ` component, all items closed (first-open is for safety pages only).
  These eight make the page's FAQPage JSON-LD, answers exactly as shown.
- **Why these eight, in this order:** the top objection first (thinking less, [audience](../../brand/audience.md)
  line 129), the page's primary cluster (TT2), fit at 3, price, delivery, risk (returns and warranty), the
  week-two objection SKM lists and no fold answers (CMO S12), and speech (SP1, product page only, beside the
  disclaimer). Wi-Fi, languages, listening and data are answered in folds 4 and 6, so they are not repeated.
  "Is Kheelu the same as Lumi?" stays on Home. No subscription question: the founder keeps the after-6-months
  topic off the site ([D041](../../decisions/D041-gate-a-round-1.md) line 24).
- **Not the same questions as Home.** Home asks "Won't an AI toy make my child think less?", "What ages is
  Kheelu for?", "How much is Kheelu, and how does the advance work?" and "When will my Kheelu arrive?"; this
  page asks the same things in different words, with differently built answers, so the two FAQPage blocks do
  not duplicate each other.
- **Price answer:** machine-read, so it leads with ₹4,999 (incl. GST) and gives the advance second, with
  "refundable" beside it (D028). "First 500 units" appears here once, as an offer term, never a badge or count
  ([D041](../../decisions/D041-gate-a-round-1.md) line 31). "No payment fees" is the founder's line
  ([D042](../../decisions/D042-policy-display-answers.md) line 14). The question says "the advance", not "₹499",
  because questions are machine-read too and ₹499 never appears without the total (D028).
- **Delivery answer:** no ₹499 without the total (D028), so the reserved-order sentence names no amount.
- **Age answer:** "with a grown-up nearby" at 3 ([D041](../../decisions/D041-gate-a-round-1.md) line 33); nothing
  about how well Kheelu understands a 3-year-old (working default B4); Common Sense Media is not cited here
  (open question 6).
- **Speech answer (SP1):** rebuilt from the keyword map's draft so no research sentence shares a sentence with
  Kheelu and nothing suggests Kheelu supplies the caring-adult exchange (CMO F1's rule; source verification
  C07: "never drop a caring adult"). The marked sentence is the verified C07 line, shortened to its second
  clause ("They also support the early language and social skills ..."), for the CMO to confirm against the
  ready line. No outcome is claimed for Kheelu ([D025](../../decisions/D025-speech-and-language.md)).
- **TT2's first sentence** ("Many talking toys play recorded phrases or repeat what your child says") is a
  category description with no source; it rests on what "talking toy" means in Indian search (the dancing
  cactus, [keyword map](../../research/keyword-map.md) line 77). For the CMO's fairness check.
- **The disclaimer** is [D025](../../decisions/D025-speech-and-language.md)'s line verbatim, visible without
  opening an answer (allowed on this page, not on Home). It sits directly under FAQ 8.
- **No CTA:** the close follows. The help line closes the section.

**Sources, fold 8**

| Answer | Source |
|---|---|
| 1 Thinking for my child | [messaging](../../brand/messaging.md) line 300 (EXTERNAL objection answer); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D036](../../decisions/D036-launch-feature-claims.md) line 19 (#3); [claims](../../product/claims.md) lines 71-72 |
| 2 Talking toy vs toy that talks back | [keyword map §6.2](../../research/keyword-map.md) lines 528-529 (TT2, adapted); [facts](../../product/facts.md) lines 73, 83; [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| 3 Right for a 3-year-old | [facts](../../product/facts.md) line 83; [keyword map §7.1](../../research/keyword-map.md) line 716 ("3 to 7; not for under 3"); [D041](../../decisions/D041-gate-a-round-1.md) line 33; [D036](../../decisions/D036-launch-feature-claims.md) lines 21, 25-26 |
| 4 Cost and the advance | [pricing](../../product/pricing.md) lines 68-72, 238; [D028](../../decisions/D028-price-wording.md); [D024](../../decisions/D024-payment-methods-gst.md); [D041](../../decisions/D041-gate-a-round-1.md) line 31; [D042](../../decisions/D042-policy-display-answers.md) line 14 |
| 5 Delivery | [D023](../../decisions/D023-new-order-delivery.md); [facts](../../product/facts.md) line 192 (order placed); [policies](../../product/policies.md) line 79 (anywhere in India, included, nothing at the door, no shipping abroad, tracking link, reserved units sent once the balance is paid); CMO S8 wording |
| 6 Returns and warranty | [D021](../../decisions/D021-returns-policy.md), [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md); [policies](../../product/policies.md) lines 104-107; [messaging](../../brand/messaging.md) lines 251-253 |
| 7 After the first week | [D036](../../decisions/D036-launch-feature-claims.md) line 17 (#2, beside the parent's controls as D036 asks); [claims](../../product/claims.md) line 118 (picks up where they stopped); [D027](../../decisions/D027-story-mode-wording.md); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| 8 Speech, and the disclaimer | [D025](../../decisions/D025-speech-and-language.md) lines 17-20; [claims](../../product/claims.md) line 81; [source verification §4](../../research/source-verification.md) lines 273-285 (C07); [claims](../../product/claims.md) line 357; [keyword map](../../research/keyword-map.md) lines 543-544 (SP1). The sources line is Home's short form (task 7.1b, [CMO review A](../../qa/cmo-review-built-a-2026-10-14.md) M6; `src/content/en-IN/pages/home.ts:157`); the full locator (undated, page metadata 2024, updated 2026; Key Takeaways and the paragraph after Fast Facts) stays in [source verification](../../research/source-verification.md) line 280 |
| Help line | [facts](../../product/facts.md) line 223; [D032](../../decisions/D032-grievance-block-and-call-line.md) |

---

## Fold 9 · Close

**Fold job:** one last, calm ask with everything beside the button: price, delivery, the full trust row and a
person to ask.

Section `id="close"`.

**Copy:**

> **Eyebrow:** Pre-order
>
> **H2:** Bring home a toy that *asks back.*
>
> For your own child, or as a gift for a 3 to 7 year old in the family.
>
> **[Pre-order Kheelu]** (`cta` = `product-foot`)
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}`.
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> Questions? WhatsApp or call +91 91875 46483

- **H2 accent:** `Hand` on "asks back." It closes the arc the H1 opened ("talks back" → "asks back").
- **The lede** speaks to the family buyers the site serves (R9) and touches the gift cluster (GFT-1/2, a
  product-page secondary) without a claim.
- **Full mode:** the price sentence only changes.
- **Image:** a board on Sunshine: the **Ira** sticker (`Cast/ira-sticker.png`), the Kheelu sticker, one shape,
  one ink doodle. On phones the button block comes first, then the board (CMO M6). Board `aria-label`: "A
  smiling girl beside Kheelu, the cream plush rabbit." (builder: add her clothing from the sticker if it helps).
- **Cast on this page:** Myra (hero), Advik (fold 4), Ira (close): three of five, each once (DS `10-pages.md`
  line 67; [D041](../../decisions/D041-gate-a-round-1.md) line 28). No cast photo beside the films.

**Sources, fold 9**

| Claim | Source |
|---|---|
| Ages 3 to 7; family buyers in scope | [facts](../../product/facts.md) line 83; [content boundary](../content-boundary.md) line 10 (R9) |
| Answers, then asks back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| CTA block, full trust row, help line | [Shared blocks](#shared-blocks-as-on-home-defined-once) |

---

## Keyword placements

Primary cluster for `/products/kheelu`: **toys that talk back** (BUY-4).

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules) lines 300-322; [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)) | Met | Where |
|---|---|---|
| Title ≤ 60 characters, primary near the start | Yes | 56 characters; "the toy that talks back" after the entity pair |
| Meta ≤ 155: primary, one concrete fact, ₹4,999 (incl. GST) before the advance | Yes | 152 (token), 146 (full); "toy that talks back", ages 3 to 7, the mechanism |
| One H1 carrying "talks back" | Yes | Options A, B, C; D does not (flagged) |
| Primary in the first paragraph | Partly | H1 carries "talks back"; the sub-line carries the descriptor and mechanism, not the phrase |
| Primary inside an answer-first block in the first ~100 words | No (exception, as on Home) | The answer-first blocks are fold 4's lead and FAQ 2; a question-shaped hero would cost conversion (CMO note on Home) |
| "3 to 7" once in the first screen | Yes | Age chip |
| An H2 with the primary or a close variant | Yes | Fold 4: "A toy that talks back, not a toy that repeats." |
| Alt text carries the primary only where true | Yes | Hero board label; OG image alt |
| Secondaries | Yes, mostly | Kheelu price (FAQ 4); talking toy vs toy that talks back (FAQ 2); plush toy that talks (fold 4, FAQ 2); how to pay (FAQ 4); speech beside the D025 disclaimer (FAQ 8); gift for a 3 to 7 year old (close lede). Not used: "ai plush toy" ("AI" stays out of headlines, voice rule 1) |
| Answer-first blocks, 40 to 60 words | Yes | Eight FAQs, 44 to 60 words |
| Entity facts identical: "Kheelu by Kheelona", 3 to 7, ₹4,999 (incl. GST) first in machine text, made in India by Kheelona Robotics | Yes | Title, meta, FAQ 4, declarations |
| Never placed: health terms as keywords, "best friend", tutor, "brain-development toy", lessons, adapts, wake-word lines, competitor names, free for life | Yes | None. "Speech" appears only in FAQ 8 and the D025 disclaimer, as the keyword map allows (SP1) |
| Density: primary 0.5-2%; "Kheelu" ≤ 2% of `<main>` | Primary about 0.8% ("toy(s) that talk(s) back" 3 times x 4 words in about 1,550 words); "Kheelu" about 2% (about 30, of which 5 are fixed film captions) | QA re-measures on the built page; "it" already replaces "Kheelu" where the subject is clear |

---

## CTA tracking values

Existing values stay on equivalent buttons ([tracking inventory §6](../tracking-inventory.md) lines 274-283).

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Hero | Pre-order Kheelu (no `id`) | `product-top` | Existing, same position |
| Fold 3, OfferCard | Pre-order Kheelu | `product-offer` | New (task brief) |
| Fold 6, safety | Pre-order Kheelu | `product-safety` | New (task brief) |
| Fold 9, close | Pre-order Kheelu | `product-foot` | Existing, same position |
| Phone sticky bar (shared partial) | Pre-order Kheelu | `sticky-bar` | New, as on Home |
| Laptop nav / phone drawer (shared partials) | Pre-order Kheelu | `navbar` / `navbar-mobile` | Existing |
| Fold 6 secondary | See how we built safety in | `product-safety-learn` | New, optional |
| Films | Play buttons | none (live `aria-label`s keep the "Play:" autocapture measure) | Unchanged (D040) |

`finale` (production's FinaleCTA, also on the product page today) is not used here: the close takes
`product-foot`, as the task brief sets; `finale` stays the close value on the other pages (G10 mapping).

---

## Placeholders

**None in the Copy blocks since task 6.7.** The approved table, with what became of each slot
([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 19: an F4 row without a final value
is hidden, the box contents stay; [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 26):

| Where | Placeholder | Needed (owner) | Now (task 6.7) |
|---|---|---|---|
| Fold 4 Good to know; fold 7 Specs | `[PLACEHOLDER F4: battery life per charge and charging time]` | Battery facts (founder, F4); fold 7 also asks for battery type | **Hidden** in both places; fold 4's line keeps "It charges with the charger in the box." |
| Fold 7 Specs | `[PLACEHOLDER: which phones the parent app runs on]` | Android and iPhone versions supported (founder; no open-question ID yet) | **Filled:** "On iPhone and Android." (D055 item 26; no version numbers, none given) |
| Fold 7 Specs | `[PLACEHOLDER F4: size and weight]` | Final specs (F4) | **Hidden** (the whole row); question 7 (dimensions) |
| Fold 7 Specs | `[PLACEHOLDER F4: outer fabric and filling]` | Final specs (F4) | **Hidden** (the whole row) |
| Fold 7 Specs | `[PLACEHOLDER F4: charger type and its BIS registration number]` | Charger details and BIS number ([D041](../../decisions/D041-gate-a-round-1.md) line 30, F4) | **Hidden** (the whole row); the charger stays in the box tab; question 7 (BIS registration) |
| Fold 7 Safety | `[PLACEHOLDER F4: toy-safety age grading and any required warnings]` | From the test report ([age-band review](../../product/age-band-review.md) rows 31-32, F4) | **Hidden** (the whole line); question 7 |
| Fold 7 Safety | `[PLACEHOLDER F4: battery safety certification]` | F4 ([claims](../../product/claims.md) line 312) | **Hidden** (the whole line); question 7 |
| Fold 7 Declarations | `[PLACEHOLDER F4: net quantity]` | [D034](../../decisions/D034-origin-manufacturer-mrp.md) lines 20-21 | **Hidden** (the whole row); question 7 |
| Fold 7 Declarations | `[PLACEHOLDER F4: month and year of manufacture]` | [D034](../../decisions/D034-origin-manufacturer-mrp.md) lines 20-21 | **Hidden** (the whole row); question 7 |

When a value arrives, its row or line returns in the approved place with the approved label, as one more change
after approval.

Pending assets (not placeholders in the copy, but needed for the mockup): `mockup/assets/app/app-transcript.webp`,
`app-activity.webp`, `app-privacy.webp` (being produced). Their draft alt texts must be checked against the
files.

No other claim on the page lacks a source.

---

## Questions for the founder (website only, D030)

Each with options and a recommendation.

1. **The H1.** A "Kheelu talks back. The good kind." · B "Some toys repeat. Kheelu talks back." · C "Talks
   back. Asks back. No screen." · D "Every why gets an answer, and a question back." **Recommend A** (the
   strongest hook, carries the page's search phrase, names the toy); B if A is used on Home, so the two pages
   never share an H1.
2. **The films' proof line and consent caption.** (a) "Watch the children do the thinking. Then hear from two
   of their parents." · (b) "Children talking things through with Kheelu, and two parents on what they
   noticed." Plus the caption "Shared with each family's written consent." (keep or drop). **Recommend (a) and
   keep the caption**: it says only what the films show, and the consent line answers the question a careful
   parent asks about children on a website.
3. **Kheelona+ on this page.** (a) As drafted: the OfferCard says "6 months of Kheelona+ included: stories,
   poems, jingles, languages and the parent app", and fold 5 keeps Home's plain line; no for-life or pricing
   sentence. (b) Also the rest of D027's line ("Kheelu's smart features keep working for life, with no
   subscription needed. Kheelona+ pricing will be announced soon."), which Home's close still shows. **Recommend
   (a)**, as D041 reads ("say only that every Kheelu comes with Kheelona+ included at the start"); if you agree,
   Home's close should drop the same two sentences so both pages say the same thing.
4. **The OfferCard heading.** (a) "Everything that comes with it." · (b) "Everything included." **Recommend
   (a)**: beside a 6-month Kheelona+ line, "Everything included" can read as "nothing to pay later", which is
   not decided.
5. **The BIS status on the product page.** (a) Show "Toy-safety certification (BIS): applied for, not yet
   granted. We show no mark until it is granted." in the Safety tab, as drafted. (b) Leave it to `/safety` only.
   **Recommend (a)**: the brief puts certification status at the point of decision, and the honest status is
   cleared to publish; but it is your call, because it tells every buyer the licence is not granted yet.
6. **The 3-year-old answer and Common Sense Media.** The answer states the band, "not for under 3" and "at 3,
   play with a grown-up nearby", and does not mention Common Sense Media's advice against AI toys at 5 and
   under. (a) Keep the product page factual and answer Common Sense Media once, on `/safety` (working default
   B3). (b) Add one sentence and a link to that answer here. **Recommend (a)**, with (b) once the signed
   `/safety` answer exists.
7. **The hidden declarations and certifications (new, task 6.7; L4).** D054 item 19 hides every F4 row still
   without a final value. Some of them are more than specs: the net quantity and the dimensions (the Legal Metrology
   rules want both on the selling page; only the month and year are exempt online,
   [legal requirements](../../product/legal-requirements.md) H4), the month and year of manufacture (on the box),
   the charger and battery BIS registration (H5) and the toy-safety age grading and warnings. (a) As D054 decides:
   hidden until each value arrives, all back before the first dispatch (mid-November); (b) the same, but the
   founder sends the net quantity and the size before Gate B, so the declarations the page must carry while it
   takes orders are there from launch. **Recommend (b)**: those two need no test report, only the final product;
   the others follow as (a).
8. **"In their own homes" on the films heading (new, task 7.1b).** D056 item 2 took the count out; the heading
   still says the films were shot in the families' own homes, and the eyebrow says "Real homes". On 2026-10-11 the
   founder answered "Not every film was shot at home" about these same seven films ([home.md](home.md) line 220),
   and Home's lede became "Real children, real families." for that reason. (a) Keep D056's words as applied, if
   every film was in fact shot in the family's own home. (b) H2 "Real children, *real families.*" (Home's
   founder-approved words, Hand on "real families."), eyebrow "Seven films" (the verified count, D040).
   **Recommend (b)**: every word is already verified, and nothing says where the films were shot. Under either
   option, film 2's chip "Real families" echoes the H2; a mild repeat.
9. **Answered at the wave 8 merge (2026-10-14):** the CMO's copy review of task 7.1b (minor 2) set the one wording, "If your child is 3, keep a grown-up nearby.", which keeps FAQ 3 at 59 words with no other word changed; see "Changes after approval (task 7.1b)". The question as asked: **The age-3 line in FAQ 3 (CMO review A M8; not changed here).** M8 asks for one age-3 sentence across the FAQ
   answers, this page's included (`src/content/en-IN/faqs.ts:86`, "At 3, play with a grown-up nearby."). Task 7.1b
   gave this page only D056 item 2 and M6, and the one wording is being set on [home.md](home.md) at the same time.
   The CMO's example, "If your child is 3, keep a grown-up nearby while they play." (the form the guides already
   use), takes this answer from 57 to 61 words, over the 60-word limit (keyword map §5;
   `src/content/en-IN/faqs.test.ts:173`). (a) The one wording, plus "At setup, you enter your child's age in the
   parent app," (fold 4's approved words) for "When you set it up, you enter your child's age in the parent app,":
   58 words, no fact lost. (b) The one wording, and drop "You can change it later.": 56 words, one fact lost.
   (c) Keep "At 3, play with a grown-up nearby." here as the one exception: it is already plain (no "we advise").
   **Recommend (a)**.

---

## Notes for the build and shared requests

- **Sticky bar from first paint** on this page only (Home shows it after the hero): the shared partial needs a
  per-page switch, or `buybar` meta plus a page flag (CTO). It steps aside while the hero button or the
  OfferCard button is on screen.
- **Tabs without JavaScript:** all three panels visible in order; with JS, the DS ARIA tabs pattern.
- **Anchors** Home already links to: `#modes`, `#app`, `#faq`; this page adds `#films`, `#offer`, `#safety`,
  `#specs`, `#close`.
- **Tracking inventory** needs the two new values (`product-offer`, `product-safety`, plus optional
  `product-safety-learn`) added to the G10 mapping (main session).
- **Never animated:** the hero, the H1, every price sentence, every chilli button, the OfferCard, the safety
  facts (CMO V3).
- **Production is untouched** until Gate B ([D011](../../decisions/D011-production-held-until-gate-b.md)).

## Changes after approval (task 6.7)

Applied from the founder's answers of 2026-10-14 ([D054](../../decisions/D054-founder-answers-open-questions-2026-10-14.md)
item 19, [D055](../../decisions/D055-page-facts-legal-setup-product-2026-10-14.md) item 26). Every other line of the
Copy blocks stands word for word as approved at Gate A (D046); the fold 8 note on deviation V6 is unchanged.

- **Fold 7, Specs, the parent-app row (D055 item 26).** The slot "[which phones the parent app runs on]" becomes
  "On iPhone and Android." It says only that: no app name, store links or version numbers (the founder gave none
  for this row; `/setup` carries the links).
- **Fold 4, Good to know (D054 item 19).** The F4 slot "[battery life per charge and charging time]" comes off,
  hidden until final values arrive. "It charges with the charger in the box." stays as approved.
- **Fold 7 (D054 item 19).** Hidden until final values arrive, each a whole row or line, since none reads without
  its value: Specs "Size and weight", "Materials", "Battery", "Charger"; Safety "Age grading and warnings",
  "Battery safety"; Declarations "Net quantity", "Month and year of manufacture". The In the box tab (Kheelu plush
  toy, charger, quick-start card), the three confirmed Safety lines, and MRP, origin, manufacturer and consumer care
  stay. The legal weight of some of these rows is question 7.
- **Notes kept true:** fold 7's fold job and placeholder note, fold 4's notes, both source tables, the Placeholders
  table (now with a "Now" column) and question 7 (new). Title, meta descriptions, H1 and every word count stated on
  the page are unchanged (the FAQ counts, the hero budgets and fold 4's 30-word lead are outside the change). The
  page loses 19 words of row labels and gains four, with no "Kheelu" among them, so the keyword table's
  "about 1,550" words and its densities hold at their stated precision (not recounted here).
- **For the builder (not edited here):** `src/content/en-IN/products/kheelu/product.ts` takes "On iPhone and
  Android." in place of the parent-app row's `{ph:…}` token and drops the four F4 spec rows, the two F4 safety lines
  and the two F4 declaration rows; `src/content/en-IN/products/kheelu/page.ts` drops the `{ph:F4 …}` token from the
  charging line. If anything else reads those rows (the Product JSON-LD or `llms.txt`, for example), it follows the
  module; not checked here.
  **Deviations for the main session to list at the merge** (D055, "What it changes in the build"): the Specs,
  Safety and Declarations panels are shorter than the mockup's (visual chunks below fold 7 move up; the V3
  JavaScript-off text pass changes too), and the parent-app row and the Good to know line differ from the mockup's
  placeholder text.

## Changes after approval (task 7.1b)

Applied from the founder's answer of 2026-10-14 ([D056](../../decisions/D056-founder-answers-built-page-reviews-2026-10-14.md)
item 2) and the CMO's built-page review ([review A](../../qa/cmo-review-built-a-2026-10-14.md) B2, M6). Every other
line of the Copy blocks stands word for word as approved at Gate A (D046) and as changed in task 6.7.

- **Fold 2, the films H2 (D056 item 2; review A B2).** "Seven families, in their *own homes.*" becomes "Real
  families, in their *own homes.*" The count was of families, and the source supports seven films only: Arha is in
  films 4 and 6, and the lede calls the two parents in films 3 and 7 "two of their parents". The Hand accent stays on "own homes."
  "In their own homes" is the founder's wording in D056; it sits against his 2026-10-11 answer that not every film
  was shot at home ([home.md](home.md) line 220), so it is question 8.
- **Fold 8, the sources line (review A M6).** The line takes Home's short form, "Center on the Developing Child at
  Harvard University, "Serve and Return" (Key Concepts).", as `src/content/en-IN/pages/home.ts:157` shows it; the
  link is unchanged. The dropped locator was a research note, not a claim, and stays in
  [source verification](../../research/source-verification.md) line 280. The FAQ 8 answer, its marker and the
  disclaimer are unchanged.
- **Notes kept true:** the fold 2 and fold 8 source tables, the front matter sources, and questions 8 and 9 (new).
  Title, meta descriptions, H1, the FAQ word counts and the keyword placements are unchanged: the H2 keeps its six
  words, and the sources line loses 14 words of `<main>` text with no "Kheelu" or primary phrase among them, so
  "about 1,550" words, the primary's "about 0.8%" and "Kheelu" at about 2% (still within the 2% ceiling) hold at
  their stated precision.
- **Not changed here, on purpose.** D056 item 4 (refund timing) names "the product page", but this page's FAQ
  gives no refund time (FAQ 6 covers the return window, the free pickup, the faulty-item remedy and the warranty;
  full-mode FAQ 4 the return window), so there is nothing to align. Review A M8 (one age-3 sentence) reaches FAQ 3
  (`faqs.ts:86`), but task 7.1b did not give it to this page and the CMO's wording would put the answer at 61
  words: question 9.
- **For the builder (not edited here):** `src/content/en-IN/products/kheelu/page.ts:106` takes "Real families, in
  their {hand:own homes.}"; so do the story `src/components/sections/FilmsStrip/FilmsStrip.stories.tsx:52` and the
  test fixture `src/components/sections/FilmsStrip/FilmsStrip.test.tsx:115`. `page.ts:279` takes the short citation; its `href` and link `label`
  (page.ts:280-281) stay. Do not change `faqs.ts:86` to an 11-word age-3 sentence without question 9's answer:
  `faqs.test.ts:173` fails at 61 words. (Superseded at the merge: FAQ 3 took the CMO's shorter wording, 59 words; next
  bullet.) **Deviations for the main session at the merge:** both lines differ from
  the approved mockup (`mockup/pages/meet-kheelu.html:36` and `:362`; text parity under the `meet-kheelu` key).
- **Fold 8, FAQ 3's age-3 sentence (review A M8; CMO copy review of task 7.1b, minor 2; main session at the wave 8
  merge, 2026-10-14).** "At 3, play with a grown-up nearby." becomes "If your child is 3, keep a grown-up nearby.",
  the site's one wording (Home, `/safety`, `/setup` and the buyer's guide say it the same way). The answer goes from 57
  to 59 words; no other word changes. Built in `src/content/en-IN/faqs.ts` (`right-for-a-three-year-old`); parity
  deviation V17 (`COPY_FIXES["meet-kheelu"]`). The founder signs it off at Gate B (D015).
