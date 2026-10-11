---
title: "Home (/): page copy, Phase 3 draft"
type: page-copy
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§1 hierarchy, §2 journey, §3 CTA rules, §5 Home row, §7 search rules)
  - ../../brand/messaging.md (confirmed candidate lines, taglines, objection answers, against the alternatives, words to stop using, CTA labels)
  - ../../brand/voice.md, ../../brand/audience.md, ../../brand/positioning.md
  - ../../product/claims.md (§1, §2, §3, §4, §4.1, §5, §8), ../../product/facts.md, ../../product/pricing.md, ../../product/policies.md
  - ../../research/keyword-map.md (§4.1, §5, §6.1, §7.1), ../../research/source-verification.md (§4 C07, §7)
  - ../content-boundary.md, ../tracking-inventory.md (§6, the eight cta values)
  - ../../design-system/overview.md, ../../design-system/component-map.md, ../../design-system/gaps.md; design-system/project/01-writing.md, 03-cast.md:102-126, assets/Kheelu/README.md (read-only)
  - "src/lib/video-moments.ts:101-238 at tag archive/pre-reset-2026-10-10 (the seven consented films; working tree read 2026-10-11, same lines messaging.md cites)"
  - "decisions D015-D039; binding here: D016-D028, D032-D038"
---

# Home (`/`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside the
> **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft:
> CMO review next, then the founder signs off at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes, sources and checklists are INTERNAL.
- `{price-source}` after an amount: written as it is today, rendered by the build from the single price
  source ([pricing](../../product/pricing.md)): ₹499 = `TOKEN_PRICE`, ₹4,500 = `BALANCE_PRICE`,
  ₹4,999 = `LAUNCH_PRICE`, ₹7,999 = `FULL_PRICE`, "first 500 units" = `CAP_UNITS_TEXT`. Never typed by hand.
- `{delivery-source}`: the one delivery content value ([D023](../../decisions/D023-new-order-delivery.md)),
  which also sets the Product JSON-LD `availabilityStarts` 2026-11-15 ([D037](../../decisions/D037-delivery-date-in-schema.md)).
- **Token mode** = while ₹499 reservations are open; **full mode** = after the first 500 units, ₹7,999 paid
  in full. How the display follows the live mode is Gate A item G9.
- `[PLACEHOLDER: …]` = a fact we do not have. One on this page; listed under [Placeholders](#placeholders).
- `¹` = a source marker under [D026](../../decisions/D026-public-statistics.md), linking to the fold's
  Sources note. Home carries one marked line (fold 3).
- Word counts exclude markers. Hyphenated words count as one.
- Alt texts for DS photos are written from the DS photo table (`03-cast.md:102-126`) and the Kheelu asset
  README; the mockup checks each against the file and rewrites it if a different asset is chosen. They
  describe what is shown without the cast's names or ages: the cast is illustrative and never presented as
  customers ([DS overview, imagery](../../design-system/overview.md#imagery)).

## At a glance

| Item | Draft |
|---|---|
| Title (54 characters) | Kheelu by Kheelona: a screen-free plush toy that talks |
| Meta description, token mode (150 characters) | Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹4,999`{price-source}` (incl. GST); reserve with a refundable ₹499`{price-source}`. |
| Meta description, full mode (147 characters) | Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹7,999`{price-source}` (incl. GST), delivered anywhere in India. |
| H1 (recommended) | Your child asks why. Kheelu asks back. |
| CTA label, everywhere | Pre-order Kheelu ([strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1); G1) |
| Price sentence, token mode (18 words; option (d), OQ2) | Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST). |
| Price sentence, full mode (8 words) | ₹7,999`{price-source}` (incl. GST), paid in full when you order. |
| Delivery line | Deliveries start mid-November`{delivery-source}`. |
| Trust row | 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India |
| Help line | Questions? WhatsApp or call +91 91875 46483 |
| OG | `og:title` = title; `og:description` = meta; image `kheelu-on-fur.jpg` (DS, "for … OG images"), alt as the hero product alt below |

Title and meta are machine-read, so they lead with ₹4,999 (incl. GST) and give the advance second
([D028](../../decisions/D028-price-wording.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 5).
Only the sentence next to the CTA leads with ₹499. The meta keeps "asks back" rather than the page's one
behaviour form ("answers your child, then asks a question back"): the full form would take the token-mode meta
to 161 characters, over the 155 limit, and the CMO review exempts the H1 and the meta (S6).

---

## Shared blocks (defined once, reused)

### CTA block

Every chilli button on Home is followed by this block, rendered from one component so the words never
drift ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

**Copy (full block, used at the close):**

> **[Pre-order Kheelu]** → `https://store.kheelona.com` (`PREORDER_HREF`), same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}`.
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> Questions? WhatsApp or call +91 91875 46483

**Compact block** (hero first screen, fold 2, fold 6): the button, the price sentence, then the micro-line

> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

(8 words; it carries delivery and returns, the two items brief §9.1 puts next to the CTA). In the hero the
compact block is followed only by the help line; the 6-month warranty, payment and delivery-included items
appear in the full row at the close (CMO mockup pass, M14).

**Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order."
Everything else is unchanged.

**Links and rendering.** Every trust item links to its terms, wherever it appears (full row, micro-line,
drawer note): returns and warranty → `/refund`; payment → `/terms`; delivery (the start date and "delivery
included") → `/shipping`. The mockup now does this everywhere. The help line's WhatsApp and call links render from the support source
([facts, support channel](../../product/facts.md#support-channel)). The help line is an inline secondary
action, never a floating bubble ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

| Claim in the block | Source |
|---|---|
| "Pre-order Kheelu", no price on the button, store destination | [strategy §3.1](../strategy.md#31-the-one-action-and-its-label-gate-a-g1); [messaging, CTA labels](../../brand/messaging.md#cta-labels) #2 |
| ₹499 first, "refundable" beside it, ₹4,500 before delivery and the ₹4,999 total (incl. GST) in the same sentence (option (d), OQ2) | [D028](../../decisions/D028-price-wording.md); [pricing, price wording](../../product/pricing.md#price-wording-for-the-new-site-d028); amounts from [pricing, single source](../../product/pricing.md) |
| Refundable until dispatch | [policies, status at a glance](../../product/policies.md#status-at-a-glance) (refund before dispatch: published, no new ruling) |
| ₹7,999 paid in full, no advance (full mode) | [pricing](../../product/pricing.md) (`full` tier, balance none); [D028](../../decisions/D028-price-wording.md) |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md); [facts, ship date](../../product/facts.md#ship-date) |
| 7-day returns, no questions asked | [D021](../../decisions/D021-returns-policy.md); [policies, decided](../../product/policies.md#decided-for-the-new-site) |
| 6-month warranty | [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md) |
| UPI, card or net banking; incl. GST | [D024](../../decisions/D024-payment-methods-gst.md); [policies, payment methods](../../product/policies.md#payment-methods) |
| Delivery included anywhere in India | [pricing, tax, delivery, MRP](../../product/pricing.md#tax-delivery-mrp); [policies](../../product/policies.md#status-at-a-glance) (shipping) |
| WhatsApp or call +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md) (takes calls; "messages only" retired); [facts, support channel](../../product/facts.md#support-channel) |

### Phone sticky bar

Appears once the hero CTA leaves the screen ([strategy §3.4](../strategy.md#34-phone-sticky-bar-benchmarks-a1-d1)).
`StickyBuyBar` props:

> price: **₹499`{price-source}` today** · note: **refundable · ₹4,999`{price-source}` total (incl. GST)** · cta: **Pre-order Kheelu**

Full mode (unchanged): price "₹7,999`{price-source}` (incl. GST)", note "Paid in full · Deliveries start mid-November`{delivery-source}`".
`cta` value: `sticky-bar` (new). The bar must step aside while any inline chilli CTA (hero, fold 2, fold 6,
the OfferCard) is on screen, so a phone view never shows two chilli buttons
([strategy §3.3](../strategy.md#33-placement-and-repetition); DS gap [G-09](../../design-system/gaps.md#g-09), motion G4).
**D028 order:** ₹499 leads, "refundable" sits beside it and the ₹4,999 total (incl. GST) follows in the same
unit, so the bar meets D028's letter, not only its purpose (CMO review, OQ10). This departs from the
strategy §3.4 draft (total as the big price) and from the DS default (price "₹4,999", note "Reserve for ₹499
today"); the mockup checks the props fit at 360 px beside the full label.

### Navigation

- Laptop `NavBar`: Meet Kheelu · Safety · Stories · Team, plus **Pre-order Kheelu** (`cta` = `navbar`).
- Phone: logo and menu button; `NavDrawer` with the same four links and **Pre-order Kheelu**
  (`cta` = `navbar-mobile`). Drawer `note`, under the CTA:

  > Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
  >
  > Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

  Full mode: the full-mode price sentence, then the same line. The drawer CTA now carries the price beside it
  like every other chilli button (brief §9.1, strategy §3.2; CMO review S4). The laptop nav CTA stays exempt
  as a header pattern (G2).
- No `AnnouncementBar` on phones: it would eat the first-screen budget. If the laptop uses one: "Deliveries
  start mid-November · 7-day returns, no questions asked" (no price).

Sources: [strategy §4.4](../strategy.md#44-navigation), [§3.3](../strategy.md#33-placement-and-repetition).

---

## Fold 1 · Hero

**Fold job:** say what Kheelu is, who it is for and the one action, inside the first phone screen (360 × 590).

**Copy (first screen, in this order):**

> **Eyebrow (age chip):** Ages 3 to 7
>
> **H1:** Your child asks why. Kheelu asks back.
>
> **Sub-line:** Kheelu by Kheelona is a screen-free plush toy. It answers your child, then asks a question back, so they do the thinking.
>
> **[Pre-order Kheelu]**
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked

**Copy (directly below the first screen):**

> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu`

- **Trust items in the hero (CMO mockup pass, M14):** only the micro-line under the price sentence
  (delivery · returns), then the help line. The row "6-month warranty · UPI, card or net banking · Delivery
  included anywhere in India" has moved out of the hero: five trust items there exceeded the two to four in
  [strategy §3.2](../strategy.md#32-what-sits-beside-every-cta). The full four-item row stays at the close
  (fold 9). The micro-line's items link to their terms: delivery → `/shipping`, returns → `/refund`.

Budgets: eyebrow 4 words; H1 7; sub-line 22 words in two short sentences (CMO review S2: the descriptor lands
first and scans faster on a phone; it replaces the earlier one-sentence budget); price sentence 18 (option (d)); micro-line 8.
Full mode swaps the price sentence only.

- **H1 accent:** `Hand` on "asks back."
- **CTA:** Pre-order Kheelu, `Button cta l block`, `cta` = `hero` (existing value, same position).
  Secondary: "See how it works", ghost link to the product page (strategy: Home's first screen reaches the
  store or the product page in one tap); suggested `cta` = `hero-learn` (new, optional, G10).
- **Fit check for the mockup:** the 7-word H1 may take three lines at 360 px. If it pushes the micro-line
  below 590 px, use alternative B (6 words, two lines). "See how it works" sits inside the first screen
  only if it fits; otherwise it opens the space below.
- **Images** (the board sits under the words on phones, DS `10-pages.md:69-74`):
  - Kheelu cut-out (`kheelu-front.webp`, or a look-identical sticker derivative). Alt: "Kheelu by Kheelona:
    the cream plush rabbit with rainbow ears and a speaker in its tummy."
  - Suggested cast photo `myra-01-breakfast-why` (the DS's photo for "why" messages). Alt: "A little girl
    in a mustard floral frock at the breakfast table, asking Kheelu a question in the morning light."
    The child is 3½ in the cast, so this rides on G5 (open question 12). Fallback
    `advik-02-whispering-to-kheelu`. Alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on
    a cane chair by a tall window."

**H1 options for Gate A** ([D038](../../decisions/D038-trust-content-rulings.md): the tagline is usable,
alternatives invited). All are mechanism-first, carry no outcome claim, keep "AI" out of the headline
([voice rule 1](../../brand/voice.md#voice-rules-from-the-positioning)) and avoid "talks back", which is the
product page's cluster ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags)).

| | H1 | Words | Why |
|---|---|---|---|
| **A (recommended)** | Your child asks why. Kheelu asks back. | 7 | The mechanism as a scene every parent of a 3 to 7 year old lives daily; the child goes first; names Kheelu, as the H1 rule wants ([keyword map §5.2](../../research/keyword-map.md#52-per-page)); the sub-line adds "answers, then" |
| B | Your child asks. Kheelu asks back. | 6 | Same idea in two phone lines; loses the "why" a parent recognises |
| C | Kheelu answers. Then it asks back. | 6 | The most literal form of the confirmed behaviour ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)); nobody can read it as dodging the question, but it is the least warm |
| D | It asks. They think. | 4 | SKM's master line, usable with the trademark risk accepted (D038); shortest and quotable, but names neither Kheelu nor the child, so it misses the H1 keyword rule and leaves the sub-line to explain everything |
| E | Kheelu asks back, so they think. | 6 | Mechanism plus the payoff in the strategy's own frame ("so they do the thinking"); plainer than A, keeps the product name first |

**Sources, fold 1**

| Claim | Source |
|---|---|
| Ages 3 to 7 | [facts, age](../../product/facts.md#age) (band 3 to 7, brief §2); [age-band review](../../product/age-band-review.md) |
| Answers, then asks a question back ("asks back") | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); [messaging, proof points](../../brand/messaging.md#proof-points) #14 |
| "so they do the thinking" | [strategy, in one screen](../strategy.md#in-one-screen) item 2; [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 (EXTERNAL) |
| Screen-free plush toy; cream rabbit, rainbow ears, speaker in its tummy | [facts, identity](../../product/facts.md#identity); [messaging, proof points](../../brand/messaging.md#proof-points) #1, #2; DS `01-writing.md:113` |
| "Kheelu by Kheelona" | [facts, identity](../../product/facts.md#identity); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) |
| CTA block items | [CTA block sources](#cta-block) |
| Images | DS `assets/Kheelu/README.md`; `03-cast.md:102`, `:108` |

---

## Fold 2 · See it ask

**Fold job:** let a parent see the mechanism working before reading any claim about it.

Whether the seven consented parent films can be used is Gate A item **G3** (consent flags are in code; no
consent record has been seen, and the burned-in captions still carry em dashes: [claims §5](../../product/claims.md#5-placeholder-content)).
Two variants; the CTA and links are the same in both.

### Variant (a): with the films

**Copy:**

> **H2:** See Kheelu ask, in real homes.
>
> **Lede:** Real children in real homes. Press play on any of them.

- **H2 accent:** `Hand` on "ask".
- **Films, phone order** (one tile at a time; this order keeps the founder's 2026-09-19 instruction that the
  montage holds index 1 and the parent film sits to its right on laptop). Chips and captions are the live,
  founder-approved labels, with one rewritten; alt texts are the live ones, verbatim.

| # | Film id | Chip | Caption (copy) | Poster alt | Source (`src/lib/video-moments.ts`, at the tag) |
|---|---|---|---|---|---|
| 1 | `learning-by-asking` | Learning by asking | Kheelu asks her to explain carrom, and thanks her for the reminder. | A young girl on a playmat holding the cream Kheelu plush. | `:190-203` |
| 2 | `first-conversations` | Real homes | Children asking Kheelu their own questions, in their own languages. | Children at home, talking to the cream Kheelu plush. | `:121-134` |
| 3 | `a-parent-speaks` | In a parent's words | Nikita on what changed when the toy spoke back. | A parent speaking to camera at home. | `:135-147` |
| 4 | `a-mother-joins-in` | A mother joins in | Arha's mother asks the questions, and Kheelu answers her by name. | A girl and her mother on a sofa with the cream Kheelu plush. | `:102-115` |
| 5 | `counting-out-loud` | Counting out loud | Three bricks and two more, worked out on the floor with Kheelu. | A boy on the floor with Lego bricks and the cream Kheelu plush. | `:176-189` |
| 6 | `a-story-in-two-languages` | Two languages | A story in two languages, with Arha. (new caption, see below) | A girl on a sofa beside the cream Kheelu plush. | `:148-161` |
| 7 | `a-father-speaks` | A father's view | Siddhant's father on what play away from a screen looks like. | A father seated at home, speaking to camera. | `:162-175` |

- **Why film 6 is rewritten:** the live caption "Arha would rather speak English today, so the story follows
  her" can read as Story mode responding to the child, which [D027](../../decisions/D027-story-mode-wording.md)
  says does not exist, and "follows her" sits close to the banned "adapts" family
  ([claims §3](../../product/claims.md#3-not-confirmed-do-not-publish)). The new caption only restates the
  film's own id and chip. Founder to confirm against the film (open question 3).
- First names only, as live; no surnames, schools or places ([DS 08-accessibility](../../design-system/overview.md#accessibility-project08-accessibilitymd)).
  Captions are burned in; no autoplay audio.
- Lede source: `videoLede()`, `src/lib/video-moments.ts:232-238` (seven films, so the plural form).

### Variant (b): without the films

**Copy:**

> **H2:** What asking back sounds like.
>
> *Illustrative example, not a recording.*
>
> **Your child:** "Why does the moon follow our car?"
>
> **Kheelu:** "The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?"
>
> **Your child:** "My shadow?"
>
> It answers first, then asks a question back. That's how your child ends up doing the thinking.

- **H2 accent:** `Hand` on "asking back".
- The label is required, sits above the exchange and is never removed: the exchange is written by us, not
  spoken by a child, and Kheelu's lines show the confirmed pattern only (answer, then one question back;
  DS Kheelu voice, `01-writing.md:77-78`). Kheelu's sentences stay within the DS length for a 5-year-old.
- **Image (optional):** `kabir-01-imagining-space` in an `ImaginationFrame`, the child's question in Kalam,
  lower case: "why does the moon follow our car?". Alt: "A boy in a rust T-shirt holding Kheelu in front of a
  dark wall, with chalk stars and a moon drawn around his question." Doodles are decorative (`alt=""`).

### CTA (both variants)

> **[Pre-order Kheelu]** + compact CTA block
>
> [See what else it does] → `/products/kheelu`

- `cta` = `see-it-ask` (new: the belief-fold CTA in [strategy §3.3](../strategy.md#33-placement-and-repetition)).
  Link: suggested `see-it-ask-learn` (new, optional).

**Sources, fold 2**

| Claim | Source |
|---|---|
| Film chips, captions, alt texts, lede | `src/lib/video-moments.ts` (lines in the table) at tag `archive/pre-reset-2026-10-10`; use is G3 ([claims §5](../../product/claims.md#5-placeholder-content); [messaging, proof points](../../brand/messaging.md#proof-points) #27) |
| Answer first, then a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Illustrative snippets allowed when labelled | DS `08-accessibility.md:65-69` via [DS overview](../../design-system/overview.md#accessibility-project08-accessibilitymd) |
| "doing the thinking" | [strategy, in one screen](../strategy.md#in-one-screen) item 2 |

---

## Fold 3 · Why conversation matters

**Fold job:** give the one reason it matters, credited to conversation, never to Kheelu, with its public source.

**Copy:**

> **H2:** Conversation helps a young brain grow.
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> *(own card, no marker)* Kheelu is built around the same idea: it answers your child, then asks a question back.
>
> You can do it anywhere, too: answer your child, then ask one back.
>
> **Sources**
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> [Read more: how children learn by talking] → `/stories/how-children-learn-by-talking`

- **H2 accent:** `Mark` underline on "Conversation" (the subject of the promise is conversation, not the toy).
- **No CTA** (strategy: Home CTAs sit at the hero, after fold 2, after safety, and at the close).
- **No image**: a text fold; the imagination layer is not needed here.
- **How the promise is held to D016:** the H2 is the founder-confirmed form ([claims §1](../../product/claims.md#1-confirmed-by-the-founder),
  [D016](../../decisions/D016-brain-wording.md)); its anchor is the marked line directly beneath (same source).
  The marked line is the ready C07 line verbatim, keeping "a caring adult". The company line sits in its own
  card with no marker and no brain word, so no brain claim shares a sentence with Kheelu
  ([source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines)). It is the
  verified C07 company line without its "turns" clause, and it has no pointer back to the Harvard sentence: the
  earlier "more of that back-and-forth" read as Kheelu supplying the caring-adult exchange, which C07's caveats
  and messaging ("never imply Kheelu is the caring adult") rule out (CMO review F1). The house line gives the
  parent something to do (D026).
- **Deliberately not used on Home:** Xu 2022 (a picture book read by a smart speaker: pairing it with Kheelu
  implies the Story-mode questioning D027 rules out); Romeo 2018 (a language line, and the speech disclaimer is
  not on Home, [D025](../../decisions/D025-speech-and-language.md)); NEP 2020's 85% (its ready line belongs in an
  early-years article, never near Kheelu); C05's million-connections estimate (ready, but a second idea in a
  one-idea fold).
- The marker needs a DS pattern that does not exist yet (DS gap [G-18](../../design-system/gaps.md#g-18); open
  question G15). Re-read the Harvard page before publishing: it shows recent edits
  ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

**Sources, fold 3**

| Claim | Source |
|---|---|
| Conversation helps a young brain grow | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) and [§8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors); [D016](../../decisions/D016-brain-wording.md) |
| The Harvard line, verbatim, with marker | [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines), C07 (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C07-harvard-serve-and-return.md` |
| "Kheelu is built around the same idea" | C07 company line, [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines) (its "turns" clause dropped); [voice rule 7](../../brand/voice.md#voice-rules-from-the-positioning) ("built around", not "proven"); [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| Answers, then asks a question back | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| House line | C07 house line, [source verification §4](../../research/source-verification.md#4-ready-to-use-website-lines) |

---

## Fold 4 · What is Kheelu? Modes and languages

**Fold job:** answer "what is it, and will it work in our home?": the three modes, Wi-Fi, the languages.

**Copy:**

> **H2:** What is Kheelu?
>
> Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7. It answers your child, then asks a question back. It has three modes: AI mode for open conversation on home Wi-Fi, Story mode for stories, poems and jingles with no Wi-Fi needed, and Bluetooth mode, which makes it a speaker for your phone.
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
> [See what each mode does] → `/products/kheelu#modes`

- **H2 accent:** `Hand` on "Kheelu?". The H2 is question-shaped and the paragraph under it is the
  answer-first block (59 words), so it feeds FAQPage JSON-LD with the six questions in fold 8.
- **Behaviour form:** the lead uses the page's one form, "answers your child, then asks a question back" (CMO
  review S6). The AI-mode card no longer repeats it: the mechanism is already in the lead two lines above, and
  fold 4 was the longest fold on phones (CMO mockup pass, M5).
- **Components:** on phones the three modes show as one compact row (`ModeSwitch` as an explainer, icons
  dropped, DS `10-pages.md`; M5), or three `FeatureCard`s on wider screens;
  `LanguageChips` with the eight named languages only. The heading "Up to 10 languages at launch" is the DS's
  own wording (`01-writing.md:23`, numerals for facts) and carries the ceiling, so the DS default "+2 more at
  launch" chip is dropped and no extra chip replaces it (CMO review S5): "up to 10" is a ceiling, not a promise
  of two more. Native scripts need fonts the DS does not ship (gap [G-13](../../design-system/gaps.md#g-13));
  each chip carries its `lang`.
- **Story mode line:** [D027](../../decisions/D027-story-mode-wording.md) verbatim except "No WiFi needed" →
  "No Wi-Fi needed" (DS spelling, `01-writing.md:25`); for the founder at Gate A.
- **No CTA.** Link anchor (`#modes`) is for the Architect to match on the product page.
- **No image:** the mockup dropped fold 4's photo (`ira-01-story-on-the-bed`) to shorten the fold (M5), so
  no alt text is needed. With one photo fewer, the mockup re-checks the DS's per-page cast rule (at least three
  of the five children, each at most twice, `10-pages.md:67`) across the hero, fold 2, fold 5 and the close.

**Sources, fold 4**

| Claim | Source |
|---|---|
| Screen-free plush rabbit that talks; ages 3 to 7; "Kheelu by Kheelona" | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [keyword map §6.1](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B1 (updated) |
| Three modes; AI mode on home Wi-Fi; Bluetooth makes it a speaker for a paired phone | [facts, modes and connectivity](../../product/facts.md#modes-and-connectivity) |
| Cannot browse the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Story mode line; works without Wi-Fi | [D027](../../decisions/D027-story-mode-wording.md); [facts, modes](../../product/facts.md#modes-and-connectivity) |
| Up to 10 languages at launch; the eight named | [facts, languages](../../product/facts.md#languages) (`src/config/site.ts:141-157`) |
| Switches mid-sentence | [facts, languages](../../product/facts.md#languages) (`src/lib/product-facts.ts:70`; D017) |

---

## Fold 5 · What parents see

**Fold job:** show that the parent stays in the loop: what the app shows, what is kept, and for how long.

**Copy:**

> **H2:** You see every conversation.
>
> - Read every conversation in the parent app, word for word.
> - Every week, the app gives you a report on four thinking skills (words, reasons, stories and questions) and a new-word count.
> - You set your child's age in the app, and the age-graded safety layer follows it.
> - Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> The parent app is part of Kheelona+, included for 6 months with every Kheelu.
>
> *Illustrative screen* (label on the app image)
>
> [See what the app shows you] → `/products/kheelu#app`

- **H2 accent:** `Hand` on "every conversation".
- The report is described as what it shows, never as an outcome for the child; no age-by-age claims, no
  "progress" or "growth" words ([D036](../../decisions/D036-launch-feature-claims.md); legal review L7).
- The retention line is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s, verbatim.
- Not used: parent alerts and the daily summary (wait on counsel's DPDP reading, L6:
  [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)); "remembers"
  (confirmed, but a second idea here).
- **The Kheelona+ line in this fold** is plain text, not a link, so the fold keeps one next step ("See what the
  app shows you"), and it puts the 6-month condition beside "You see every conversation" and the 36-month line
  until F7 is decided (CMO review S10). It restates only the first clause of
  [D027](../../decisions/D027-story-mode-wording.md)'s line; the full sanctioned line still appears once, at the
  close. Nothing is said about what a parent keeps after the six months (F7, open question 5).
- **No CTA.**
- **Images:** the DS phone frame (`kh-device`) with a weekly-report screen, labelled "Illustrative screen".
  Do not use `AppSummaryCard` as delivered: its "Today with Kheelu" framing implies a daily summary, which is
  not cleared (L6). Alt for the frame: "An illustrative parent-app screen showing a weekly report on four
  thinking skills." Optional photo `tara-02-evening-with-amma`. Alt: "A girl and her mother on a sofa in the
  evening lamp light, with Kheelu between them."

**Sources, fold 5**

| Claim | Source |
|---|---|
| Read every conversation; word for word | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [facts, parent app](../../product/facts.md#parent-app) ("the full conversation log word for word", live) |
| Weekly report on four thinking skills; new-word count | [D036](../../decisions/D036-launch-feature-claims.md) #1, #8; skill names: [messaging, hierarchy](../../brand/messaging.md#the-hierarchy) ("the model parents repeat", EXTERNAL as what the report covers) |
| Parent sets the age; the age-graded safety layer follows it | [D036](../../decisions/D036-launch-feature-claims.md); wording from [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) ("say instead") |
| 36 months, deleted automatically; delete sooner in one tap | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7, verbatim line; [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| Parent app is part of Kheelona+, included for 6 months with every Kheelu | [D027](../../decisions/D027-story-mode-wording.md) ("Every Kheelu comes with 6 months of Kheelona+: … and the parent app"); [facts, Kheelona+](../../product/facts.md#kheelona), [parent app](../../product/facts.md#parent-app) |

---

## Fold 6 · Safety you can check

**Fold job:** answer "is it always listening, where does the voice go, can I check?" with facts in the founder's order.

**Copy:**

> **H2:** Safety you can check.
>
> **1 · You'll always see when it's listening.**
> Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it's listening. Left alone, it hears nothing and sends nothing.
>
> **2 · How it understands and answers.**
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **3 · You can read every conversation.**
> In the parent app. Delete any of them in one tap.
>
> **4 · We don't sell your data.**
> Your child's data is never used to advertise to them.
>
> **Three more facts:**
> - No camera.
> - It can't browse the internet.
> - It says it's a toy, and never asks your child to keep a secret from you.
>
> **[Pre-order Kheelu]** + compact CTA block
>
> [See how we built safety in] → `/safety`

- **H2 accent:** `Hand` on "check". "Safety" as a noun; the word "safe" appears nowhere in the copy.
- **Order is [D020](../../decisions/D020-provider-terms-and-no-sale.md)'s:** button and light → providers line
  → read and delete → no sale. Component: `TrustList` (one column on phones). Item 1 is
  [D018](../../decisions/D018-wake-up-button.md)'s heading and body sentences verbatim, with "Kheelu" in the
  heading replaced by "it" (density) and D018's opening sentence about a wake word left out (open question 8).
  It ends with D018's off-state sentence, "Left alone, it hears nothing and sends nothing.", so the fold
  answers "is it always listening?" in words (CMO review S1); the sentence is about the off state only and
  says nothing about what is kept once a conversation starts (conversations are kept for parents, D017, D020).
  Item 2's heading, "How it understands and answers.", names only the reply path the body covers (it echoes
  the body's opening, "To understand and answer your child"). The earlier "Where your child's voice goes"
  promised the voice's whole journey, which under [D035](../../decisions/D035-model-training-opt-out.md) also
  includes Kheelona's own model, and so implied nobody else keeps or trains on it (CMO review F2). Item 2's
  body is D020's providers line in full, verbatim; its training clause is scoped to the providers, as D035
  requires (open question 4). Nothing on the page mentions training otherwise, and nothing says "nothing is
  ever recorded", "no risk" or that the microphone is disconnected.
- Item 3 repeats fold 5's read-and-delete fact on purpose: D020 puts it in the safety block, and the block is
  reused on the product page.
- **CTA:** Pre-order Kheelu, `cta` = `safety` (new). Secondary link uses the DS's own second action
  (`01-writing.md:53`); suggested `safety-learn` (new, optional).
- **Image:** `kheelu-belly-module.png` (derivative; DS: "the belly unit (speaker, light ring, buttons)"). Alt:
  "Kheelu's tummy unit up close, with its speaker, light ring and buttons." No imagination layer on a safety
  block (DS `02-imagery.md:57`). The DS has no photo of the light lit yet (Kheelu README), so the copy never
  describes what the light looks like.

**Sources, fold 6**

| Claim | Source |
|---|---|
| Microphone on only after a press of the wake-up button; on while the child talks; off after about a minute of quiet; a light shows; left alone, it hears and sends nothing | [D018](../../decisions/D018-wake-up-button.md) (draft lines, including the body's last sentence); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Trusted providers, servers in India, reply only, keep nothing, never train, by contract | [D019](../../decisions/D019-voice-providers.md), [D020](../../decisions/D020-provider-terms-and-no-sale.md) items 1-4, 6; scoped per [D035](../../decisions/D035-model-training-opt-out.md) |
| Read every conversation; one-tap delete | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| We don't sell your data | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 5 |
| Never used to advertise to your child | [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| No camera; says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| Cannot browse the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| Belly unit has a speaker, light ring and buttons | DS `assets/Kheelu/README.md` |

---

## Fold 7 · Compared by category

**Fold job:** place Kheelu among what families already use, by kind of product, never by brand.

**Copy:**

> **H2:** Other AI gives answers. Kheelu asks questions.
>
> Thinking out loud, not tapping on a screen.
>
> | | Puzzles and activity books | Learning apps and videos | Smart speakers and chatbots | Kheelu |
> |---|---|---|---|---|
> | Screen-free | Yes | No | Varies | Yes |
> | Holds a back-and-forth conversation | No | Rarely: mostly tapping and watching | Yes | Yes |
> | Asks your child a question back | No | Some ask quiz questions | Usually just answers | Yes, after it answers |
> | You can read every conversation | Nothing to read | Nothing to read | Varies | Yes, in the parent app |
>
> *Caption:* Kinds of products, not brands: what each one usually does.
>
> [How to choose an AI toy] → `/ai-toys-for-kids-in-india`

- **H2 accent:** `Hand` on "asks questions". The H2 and the lead are messaging's two EXTERNAL comparison lines.
  If the founder picks a contrast line as the H1 at Gate A, this H2 changes.
- `ComparisonTable`, `usIndex` = 4. Cells starting "Yes" or "No" get a tick or a cross; "Nothing to read",
  "Varies" and the hedged cells deliberately start with neither, so a category is never marked down for a row
  that does not apply to it. Smart speakers and chatbots get their tick for conversation: the table stays fair.
- The category cells are plain descriptions with no brand, price or research figure; no public source is cited
  for them, so the CMO Reviewer checks each for fairness (gap list).
- On phones the table scrolls sideways and its scroll area is not keyboard-focusable (DS gap
  [G-05](../../design-system/gaps.md#g-05), High): a stacked phone variant is open question G11.
- **No CTA** (strategy §3.3). If the founder wants one here, as production had, it takes `cta` = `compare`.
  The link to the buyer's guide is an internal link; suggested `compare-learn` (new, optional).
- **No image.**

**Sources, fold 7**

| Claim | Source |
|---|---|
| "Other AI gives answers. Kheelu asks questions." | [messaging, taglines](../../brand/messaging.md#taglines-and-hero) (EXTERNAL; "other AI" is a category) |
| "Thinking out loud, not tapping on a screen." | [messaging, against the alternatives](../../brand/messaging.md#against-the-alternatives) (EXTERNAL) |
| The four categories, no brands | [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (Home row); [messaging, words to stop using](../../brand/messaging.md#words-to-stop-using) (no competitor names) |
| Kheelu column: screen-free; conversation; asks back; read every conversation | [messaging, proof points](../../brand/messaging.md#proof-points) #1; [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |

---

## Fold 8 · Questions parents ask

**Fold job:** answer the six questions left after folds 1 to 7, near the close, in 40 to 60 words each.

**Copy:**

> **H2:** Questions parents ask.
>
> **Won't an AI toy make my child think less?**
> That's exactly what Kheelu is designed against. Most AI gives answers. Kheelu answers your child, then asks a question back, so they do the thinking. It can't browse the internet, and when it doesn't know something, it says so instead of guessing. You can read every conversation in the parent app.
>
> **What ages is Kheelu for?**
> Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. When you set it up, you enter your child's age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.
>
> **How much is Kheelu, and how does the advance work?**
> Kheelu is ₹4,999`{price-source}` (incl. GST) for the first 500 units`{price-source}`, with delivery anywhere in India included. A refundable ₹499`{price-source}` advance reserves yours today, and the remaining ₹4,500`{price-source}` is due before delivery. After the first 500, it is ₹7,999`{price-source}` (incl. GST), paid in full. You can pay by UPI, card or net banking, and you get a GST invoice.
>
> **What if it isn't right for us?**
> Return it within 7 days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free. Once it reaches us and qualifies for return, your refund is processed within 7 working days. Until we dispatch it, everything you've paid is refundable in full.
>
> **When will my Kheelu arrive?**
> Deliveries start mid-November`{delivery-source}`. Pre-orders are served first, in the order they were placed, and you get a tracking link when it leaves us. Delivery is included anywhere in India, with nothing to pay at the door. We don't ship outside India. A reserved Kheelu is sent once the rest of the price is paid.
>
> **Is Kheelu the same as Lumi?**
> Yes. Kheelu is the toy that was called Lumi until 5 September 2026: the same product from Kheelona, with a new name. You may still see the old name on some older listings. A toy sold as Lumi by any other company is a different product, and Kheelona does not make it.
>
> [See all questions] → `/products/kheelu#faq`

Word counts: 51 · 49 · 58 · 55 · 54 · 52.

**Full mode**, the price question becomes:

> **How much is Kheelu?**
> Kheelu is ₹7,999`{price-source}` (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November`{delivery-source}`. If it isn't right for your family, you can return it within 7 days of delivery, no questions asked. (54 words)

- **H2 accent:** `Hand` on "ask".
- `FAQ` component, all items closed (DS: first item open on safety pages only). These six plus fold 4's
  "What is Kheelu?" make the FAQPage JSON-LD, with answers exactly as shown.
- **Order:** "See all questions" follows the six questions, on phones too (CMO mockup pass, M7; the mockup had
  placed it above the list).
- **Why these six:** the top objection (thinking less), fit (age), price and the advance, risk (returns),
  timing (delivery), and the Lumi entity question the keyword map wants on Home. Wi-Fi, languages, listening,
  data and the subscription are answered in folds 4 to 6 and 9, so no answer appears twice. The CMO review's
  S12 (swap the Lumi question for "Will my child still use it after the first week?") was declined: Lumi is
  Home's keyword-map secondary (BRD-2, [keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13))
  ([strategy §2](../strategy.md#2-the-parents-journey-and-objections)). No speech or language question on Home
  ([D025](../../decisions/D025-speech-and-language.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 10).
- The price answer is machine-read, so it leads with ₹4,999 (incl. GST) and gives the advance second
  ([D028](../../decisions/D028-price-wording.md)). It states the first-500 term once, as an offer term, never as a
  count (open question 7).
- The age answer makes no claim about how well Kheelu understands a 3-year-old and no claim about a grown-up
  nearby: both wait on G5.
- **No CTA:** the close follows directly. Link: suggested `faq-more` (new, optional).

**Sources, fold 8**

| Answer | Source |
|---|---|
| Thinking less | [messaging, objection answers](../../brand/messaging.md#objection-answers) row 1 (EXTERNAL); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) (browse, read); [D036](../../decisions/D036-launch-feature-claims.md) #3 (says it doesn't know rather than guess) |
| Ages | [facts, age](../../product/facts.md#age); [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) ("3 to 7; not for under 3"); [D036](../../decisions/D036-launch-feature-claims.md) #6 and the age setting; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (every reply passes the layer) |
| Price and advance | [pricing](../../product/pricing.md) (amounts, first 500, full tier, delivery included); [D028](../../decisions/D028-price-wording.md); [D024](../../decisions/D024-payment-methods-gst.md) (methods, GST, invoice); [keyword map §6.2](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B3 |
| Returns | [D021](../../decisions/D021-returns-policy.md) (policy line; "of delivery" is D021's reading); [D022](../../decisions/D022-warranty-replacement-refund.md), [D033](../../decisions/D033-warranty-after-day-7.md) (pickup free, refund within 7 working days of reaching us); [policies](../../product/policies.md#status-at-a-glance) (refundable in full before dispatch) |
| Delivery | [D023](../../decisions/D023-new-order-delivery.md); [facts, ship date](../../product/facts.md#ship-date) (served in order placed); [policies](../../product/policies.md#status-at-a-glance) (shipping: anywhere in India, included, nothing at the door, no shipping abroad, tracking link, reserved units dispatch once the balance is paid) |
| Lumi | [facts, identity](../../product/facts.md#identity) (renamed 2026-09-05; EXTERNAL in this answer); [keyword map §6.1](../../research/keyword-map.md#6-question-bank-answer-first-drafts) B2 |

---

## Fold 9 · Close (OfferCard)

**Fold job:** put everything a parent needs to say yes in one place: what comes with it, the price, the button, the risk reversal, a person to ask.

**Copy:**

> **H2:** What you get, and what you pay.
>
> **OfferCard**
> - product: Kheelu
> - price: ₹4,999`{price-source}` incl. GST
> - deposit / balance: ₹499`{price-source}` today, refundable · ₹4,500`{price-source}` before delivery
> - shipDate: Deliveries start mid-November`{delivery-source}`
> - perks:
>   - The plush toy, plus [PLACEHOLDER F4: the rest of the box (the live page lists a charger and a quick-start card; specs are not signed off)]
>   - Delivery anywhere in India, included
>   - A GST invoice with every order
> - cta: Pre-order Kheelu
> - fine: Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. Kheelu's smart features keep working for life, with no subscription needed. Kheelona+ pricing will be announced soon.
>
> 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · Delivery included anywhere in India
>
> Questions? WhatsApp or call +91 91875 46483

- Section id `close` (available as an anchor; fold 5 no longer links here, CMO review S10).
- **H2 accent:** `Hand` on "what you pay". No price in the heading: the DS template's "Reserve yours for ₹499"
  would put ₹499 in a sentence without the total ([D028](../../decisions/D028-price-wording.md)).
- **CTA:** Pre-order Kheelu, `cta` = `finale` (existing value; this is the page's close, the FinaleCTA position).
- **OfferCard settings:** `sticker` = false (no "First 500" burst); `was` unset (no strike-through, no MRP
  beside the launch price on Home: [D034](../../decisions/D034-origin-manufacturer-mrp.md)'s copy note);
  `unitsLeft` and `unitsTotal` never set (the count is never published, DS gap
  [G-08](../../design-system/gaps.md#g-08)). `fine` takes a string only, which suits the price sentence (no
  marker needed). The designer checks that the card's own deposit wording keeps "refundable" next to ₹499.
- **Full mode:** the OfferCard cannot show a paid-in-full offer (G-08, G9). Until G9 is decided, a composed
  block replaces it: price "₹7,999`{price-source}` (incl. GST)", the full-mode price sentence, the same perks,
  the Kheelona+ line, the button, the trust row and the help line.
- **The Kheelona+ line** is [D027](../../decisions/D027-story-mode-wording.md)'s, verbatim, and appears once on
  the page. Nothing is said about what happens after the six months (F7).
- **Order on phones:** the OfferCard comes first, then the board. With the board first, the price started
  about 430 px into the fold (CMO mockup pass, M6).
- **Image:** `advik-03-studio-hug` (DS: "child-with-product cut-out, ads on colour blocks"). Alt: "A boy in a
  red polo T-shirt hugging Kheelu against a cream background." If the board repeats the hero's stickers, the
  CMO's alternative is the DS offer picture `kheelu-on-fur.jpg` after the card (M6). Its alt: "Kheelu by
  Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy."

**Sources, fold 9**

| Claim | Source |
|---|---|
| Price, advance, balance, price sentence | [CTA block sources](#cta-block); [pricing](../../product/pricing.md) |
| Box contents | [facts, in the box](../../product/facts.md#in-the-box) (EXTERNAL IF CONFIRMED, F4): placeholder |
| Delivery included anywhere in India | [pricing, tax, delivery, MRP](../../product/pricing.md#tax-delivery-mrp) |
| GST invoice with every order | [D024](../../decisions/D024-payment-methods-gst.md) |
| Kheelona+ line | [D027](../../decisions/D027-story-mode-wording.md); [facts, Kheelona+](../../product/facts.md#kheelona) |
| Trust row, help line | [CTA block sources](#cta-block) |

---

## Footer

**Fold job:** the seller's legal identity, the policies and a way to complain, on every page.

Referenced, not rewritten:
- **Seller block:** rendered from the single seller source, as published
  ([policies, seller details](../../product/policies.md#seller-details-as-published)).
- **Grievance line:** a link to `/contact`, where the [D032](../../decisions/D032-grievance-block-and-call-line.md)
  block lives ([strategy §4.4](../strategy.md#44-navigation)).
- **Columns:** Kheelu (Meet Kheelu, Safety, Setup) · Read (Stories, buyer's guide) · Help (Contact, Shipping,
  Refunds, Terms, Privacy) ([strategy §4.4](../strategy.md#44-navigation)).

New copy for two `Footer` props:

> **promise:** Press to talk. No open internet. You read every conversation.
>
> **made:** Designed by parents in Bengaluru. Made in India.
>
> **support:** WhatsApp or call +91 91875 46483 · hello@kheelona.com

- The DS default `promise` ("Wake-word listening. No open internet. You see everything.") is banned
  ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 18) and must not ship.

| Claim | Source |
|---|---|
| "Press to talk" | [D018](../../decisions/D018-wake-up-button.md) short line |
| No open internet | [facts, internet and camera](../../product/facts.md#internet-and-camera) ("Open internet: No", EXTERNAL); DS `01-writing.md:35` |
| You read every conversation | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md) |
| Designed by parents in Bengaluru | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) (EXTERNAL) |
| Made in India | [D034](../../decisions/D034-origin-manufacturer-mrp.md) |
| Support channels | [facts, support channel](../../product/facts.md#support-channel); [D032](../../decisions/D032-grievance-block-and-call-line.md) |

---

## Keyword placements

Primary cluster for `/`: **Kheelu by Kheelona** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)).

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules); [strategy §7](../strategy.md#7-search-and-ai-visibility-rules-the-pages-follow)) | Met | Where |
|---|---|---|
| Title ≤ 60 characters, primary near the start | Yes | 54 characters, primary first (a brand page, so brand first) |
| Meta ≤ 155 characters: primary, one concrete fact, ₹4,999 (incl. GST) before the advance | Yes | 150 (token) / 147 (full); age band and the mechanism as facts |
| One H1, carrying "Kheelu" | Yes | Recommended H1 and alternatives B, C, E. Alternative D does not carry it |
| Primary in the first paragraph | Yes | Hero sub-line opens "Kheelu by Kheelona" |
| Primary in an answer-first block in the first ~100 words | Partly | The sub-line is word 12 of the page's main text; the answer-first block with the primary is fold 4 ("What is Kheelu?"), below the first ~100 words |
| "3 to 7" once in the first screen | Yes | Age chip |
| An H2 with the primary or a close variant ("What is Kheelu?") | Yes | Fold 4 H2 |
| Alt text carries the primary only where true | Yes | Hero product image alt; OG image alt |
| Descriptor "a screen-free plush toy that talks" (SV-2) | Yes | Title, verbatim; sub-line and fold 4 near-verbatim |
| Secondary: "Is Kheelu the same as Lumi?" | Yes | Fold 8, question 6 |
| Secondary: "screen-free", price | Yes | Sub-line, fold 4, fold 7; price in meta, CTA block, fold 8 |
| Answer-first blocks, 40 to 60 words | Yes | Fold 4 (59) and six FAQs (49 to 58) |
| Entity facts identical: "Kheelu by Kheelona", 3 to 7, ₹4,999 (incl. GST) first in machine text, no mention of the unrelated "Kheelona India" | Yes | Title, meta, sub-line, fold 4, fold 8; "made in India" in the footer |
| Words never placed as keywords (health terms, friend, tutor, brain-development toy, lessons, adapts, wake-word lines, competitor names, free for life) | Yes | None on the page |
| Density: "Kheelu" ≤ 2% of `<main>` words | Just over the flag line | About 29 of about 1,345 words (2.2%) with variant (b), after the CMO fixes (fold 5's Kheelona+ line adds one); about 2.3% with the films (their live captions name Kheelu). Below the 3% rewrite line. Already cut: "it" in FAQ answers, the safety headings, the close heading. QA re-measures on the built page |

---

## CTA tracking values

Existing values stay on equivalent buttons ([tracking inventory §6](../tracking-inventory.md); G10 maps them).

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav | Pre-order Kheelu | `navbar` | Existing |
| Phone drawer | Pre-order Kheelu | `navbar-mobile` | Existing |
| Hero | Pre-order Kheelu | `hero` | Existing, same position |
| Fold 2 (belief) | Pre-order Kheelu | `see-it-ask` | New |
| Fold 6 (safety) | Pre-order Kheelu | `safety` | New |
| Fold 9 (close, OfferCard) | Pre-order Kheelu | `finale` | Existing, same position |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (the mid version's name for the same bar) |
| Fold 7 | none; reserved if a store CTA is added | `compare` | Existing |
| Secondary links (optional) | See how it works · See what else it does · See how we built safety in · How to choose an AI toy · See all questions | `hero-learn` · `see-it-ask-learn` · `safety-learn` · `compare-learn` · `faq-more` | New, optional |

`home-arc` (production's growth-arc section) has no equivalent on the new Home; it is left unused rather
than repurposed (G10).

---

## Placeholders

| Where | Placeholder | Needed |
|---|---|---|
| Fold 9, OfferCard perk 1 | `[PLACEHOLDER F4: the rest of the box (the live page lists a charger and a quick-start card; specs are not signed off)]` | Signed-off box contents ([facts, in the box](../../product/facts.md#in-the-box); F4) |

No other claim on the page lacks a source.

---

## Open questions

Each with options and a recommendation. Gate A items are marked.

1. **The hero H1 (Gate A, D038).** Options A to E in [fold 1](#fold-1--hero). **Recommend A**, "Your child asks
   why. Kheelu asks back."; B if A pushes the micro-line out of the first screen at 360 px.
2. **The price sentence (Gate A, D028).** (a) The first draft: "Reserve yours for ₹499 today, refundable until
   dispatch, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST) before delivery." (21 words);
   (b) the CTO's one-sentence form on [messaging](../../brand/messaging.md#confirmed-candidate-lines)
   ("Reserve Kheelu for ₹499 today, refundable, and pay the remaining ₹4,500 of the ₹4,999 total (incl. GST)
   before delivery.", 19 words); (c) D028's own two-sentence draft, which breaks its same-sentence rule;
   (d) the CMO's: "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery:
   ₹4,999 in total (incl. GST)." (18 words). (d) reads as a timeline (today, before delivery, total) and meets
   every D028 condition: ₹499 first, "refundable" beside it, the remainder before delivery, the total with
   "incl. GST" in the same sentence. The CMO prefers (d) beside every inline CTA and rates (a) fine; (c) should
   not go forward. **Recommend (d)**, with the CMO: the same facts as (a) in three fewer words, which eases the
   360 × 590 fit. The page and the mockup now show (d) everywhere the token-mode sentence appears (CTA block,
   hero, compact blocks, OfferCard `fine`, drawer note); (a) stays the alternative. The sentence is one content
   value, so going back to (a) is one change.
3. **The films in fold 2 (Gate A, G3).** (a) Use the seven films, once a consent record is seen and the captions
   are re-exported without em dashes, with film 6's caption rewritten; (b) use the illustrative exchange;
   (c) films, with the exchange kept for the product page. **Recommend (a)**, with (b) shipping if G3 is not
   cleared by the mockup. The founder also confirms film 6's new caption against the film. Films 3
   (`a-parent-speaks`) and 7 (`a-father-speaks`) are parents speaking to camera, so what they say is published
   copy too: their words must stay within [claims](../../product/claims.md) (no outcome promised for the child,
   nothing retired or banned), checked against the films before G3 clears (CMO review).
4. **The providers line's training clause on Home (D020, D035).** (a) Keep D020's line verbatim, its "they never
   use it to train their AI" scoped to the providers, as D035 directs; (b) drop that clause on customer pages,
   removing the misleading-by-omission risk D035 records, while every remaining word stays true.
   **Recommend (a)**, as the decisions stand; the founder may prefer (b) once he sees it on the page beside a
   training disclosure that lives only on `/terms` and `/privacy`. **CMO view: (b)**, dropping only "and they
   never use it to train their AI" on customer pages and keeping "They process your child's voice only to
   produce Kheelu's reply. They don't keep it. Our contracts with them say so.": a parent will generalise the
   clause to "my child's voice is not used to train AI", which D035 makes false for Kheelona's own model. Item
   2's new heading (CMO F2) applies either way. The founder's call ([D015](../../decisions/D015-founder-signs-off-copy.md)).
5. **What keeps working after the six months of Kheelona+ (Gate A, F7).** Fold 4 (Story mode content,
   languages) and fold 5 (the parent app, "You see every conversation") describe Kheelona+ features; the legal
   review (L7) says the site must say what stops. (a) Ship the sanctioned line only, as drafted; (b) the founder
   decides F7 and one line is added under the Kheelona+ line at the close. The CMO wants F7 decided **at Gate
   A, not Gate B**, because five lines assume the parent app stays available: fold 5's H2 ("You see every
   conversation"), the 36-month retention line, fold 6 item 3, fold 7's last row and the footer promise. If the
   app lapses at month 6 without a subscription, all five become misleading. **Recommend (b), decided at Gate
   A**, with the CMO. Until then, fold 5's plain line ("The parent app is part of Kheelona+, included for 6
   months with every Kheelu.") keeps the 6-month condition beside the claim.
6. **Box contents (F4).** (a) Fill the placeholder once specs are signed off; (b) the perk reads "The plush
   toy" only. **Recommend (b) for the mockup, (a) when F4 lands.**
7. **The first-500 term on Home.** (a) State it once, in the price answer (an offer term that matches the
   entity fact in [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) and tells a parent the price
   rises); (b) leave it to the product page. **Recommend (a)**, never as a badge, sticker or counter.
8. **"No wake word" on Home.** D018's drafts open with "Kheelu has no wake word, so it never listens for one."
   (a) Leave the phrase off Home: the button lines say everything, and the new site's guard list matches
   "wake word" ([claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)); (b) restore the
   sentence with a guard exception. **Recommend (a).**
9. **Founder wording points in D027's Story-mode line.** "No WiFi needed" rendered "No Wi-Fi needed" (DS
   spelling); "enjoys and learns from" kept as written, though it leans towards the learning-outcome language
   L7 warns about. **Recommend:** Wi-Fi spelling yes; keep "learns from" (the founder's own words).
10. **The sticky bar's price order (strategy §3.4, flagged for D028; Gate A).** Now drafted in D028's order:
    (a) price "₹499 today", note "refundable · ₹4,999 total (incl. GST)" (applied after the CMO review);
    (b) the strategy and DS order, price "₹4,999 (incl. GST)" with the note "₹499 today, refundable", which
    meets D028's purpose but not its letter (₹499 first beside a CTA), so the founder would have to accept the
    departure explicitly. **Recommend (a)**, as applied; the mockup confirms it fits at 360 px beside the full
    label.
11. **The help line's calls (D032).** The number must answer calls before this copy goes live. Not a choice; a
    dependency for the founder before Gate B.
12. **A 3½-year-old in the hero photo (G5).** SKM's "never show 3-year-olds alone in ads" may or may not survive
    the 3 to 7 band. (a) `myra-01-breakfast-why` (the DS's "why" photo, matches the H1); (b)
    `advik-02-whispering-to-kheelu` (age 4). **Recommend (a) if G5 drops the rule, else (b).**

---

## Gaps and notes for the next steps

- **Source markers** need a DS pattern (gap [G-18](../../design-system/gaps.md#g-18), open question G15): an
  inline marker with a 48 px tap area and a "Sources" note in `kh-body-s`. Home needs one (fold 3).
- **The Harvard page** must be re-read before publishing ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).
- **Category cells in fold 7** have no public source; they are plain descriptions for the CMO Reviewer to
  check for fairness.
- **DS components to adjust by composition, not by editing the DS:** `LanguageChips` with the eight named
  chips only (no "+2 more at launch" chip; the heading carries "Up to 10"); `AppSummaryCard` avoided (daily-summary framing); `OfferCard` `sticker` off and no counter; `Footer`
  `promise` replaced; `ComparisonTable` stacked phone variant (G-05, G11); sticky bar stepping aside beside
  inline CTAs (G-09, G4).
- **Two chilli buttons on laptop** (nav plus hero) is G2 / G-06, decided at Gate A.
- **The illustrative app screen** for fold 5 needs a weekly-report screen; the DS renders folder has
  parent-app screens to check against before drawing anything new.
- **Speech disclaimer** is deliberately absent from Home ([D025](../../decisions/D025-speech-and-language.md)).
- **Production is untouched** until Gate B ([D011](../../decisions/D011-production-held-until-gate-b.md)): this
  copy is for the new site only.
