---
title: Site strategy (Phase 2)
type: strategy
updated: 2026-10-11
sources:
  - raw/brief/kickoff-brief.md (§1, §2, §7 Phase 2-3, §9)
  - brand/messaging.md, brand/audience.md, brand/positioning.md, brand/voice.md
  - research/posthog-audit.md (§3-§8, human-session figures of 2026-10-11)
  - research/d2c-benchmarks.md (§3 adopt, adapt, avoid)
  - research/keyword-map.md (§4 one primary cluster per URL, §4.3-4.4, §6, §7)
  - site/url-map.md, site/checkout.md, site/tracking-inventory.md, site/content-boundary.md
  - product/claims.md, product/facts.md, product/pricing.md, product/policies.md, product/legal-requirements.md
  - design-system/component-map.md, design-system/overview.md, design-system/gaps.md
  - decisions/D013-D039
---

# Site strategy (Phase 2)

What the new kheelona.com says, to whom, in what order, with which single action, on which URLs, and
how each money leak PostHog found gets fixed. The CTO writes this page (brief §7, Phase 2). It sets
rules for the Copywriter (Phase 3 and 5), the mockup and the Architect. **It quotes no new facts**:
every fact links to its owner page, and copy lines are drafts the founder signs off at Gate A
([D015](../decisions/D015-founder-signs-off-copy.md)). Items marked **(Gate A)** are recommendations
that go into `mockup/APPROVAL.md`.

## In one screen

1. **One job:** move a parent of a 3-7 year old from "what is this?" to the store in as few taps as
   possible, on a phone first. The store (`store.kheelona.com`) is the checkout; there is no cart
   ([checkout](checkout.md#in-one-screen)).
2. **One idea, said the same way everywhere:** *Kheelu answers your child, then asks them something
   back, so they do the thinking.* The promise credits conversation, never Kheelu
   ([D016](../decisions/D016-brain-wording.md)); the mechanism is confirmed
   ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)).
3. **One action, one label, one destination:** "Pre-order Kheelu" to the store, on every button, the
   nav and the phone sticky bar **(Gate A, G1)**. The price sentence sits beside it, never inside it
   ([D028](../decisions/D028-price-wording.md)).
4. **The product page becomes the selling page and the default ad destination.** Product-page
   sessions reached the store 3x as often as Home-only sessions (14.8% vs 4.5%,
   [audit §8 #6](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
   Home's first screen sends a parent to the store or the product page in one tap.
5. **The first phone screen and the sticky bar do the selling.** 90% of measured phone Home views
   never pass 25% of the page; the guide's bottom bar gave 14 of 18 phone store taps once tags went
   live ([audit §8 #5](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)).
   CTA, price sentence and one trust line fit inside 360 × 590 (WhatsApp's in-app browser height).
6. **Reassurance travels with the button**: the price sentence, delivery, returns, warranty and
   payment methods sit beside every CTA and again beside the store form
   ([benchmarks A3-A5](../research/d2c-benchmarks.md#31-adopt)), because 81 of 91 store visitors never
   started the form.
7. **Safety is told as checkable facts in the founder's order**, never as the word "safe"
   ([D020](../decisions/D020-provider-terms-and-no-sale.md)).
8. **URLs:** all 35 stay or 301 in one hop. Two drops recommended: `/playos` and the under-3 article
   **(Gate A, G8 with G5)**. No new pages in v1.

## 1. Messaging hierarchy (external form)

The internal hierarchy and every line's status live on [messaging](../brand/messaging.md#the-hierarchy).
This is the order a parent meets it on the site.

| Level | What the parent must take away | Allowed wording comes from | Proof shown |
|---|---|---|---|
| **Mechanism (lead)** | Kheelu answers, then asks your child something back, so they do the thinking | "It asks. They think." (usable, trademark risk accepted, [D038](../decisions/D038-trust-content-rulings.md)); "Other AI gives answers. Kheelu asks questions." ([messaging, taglines](../brand/messaging.md#taglines-and-hero)) | The consented films if G3 allows; otherwise an illustrative exchange, clearly marked |
| **Why it matters (the promise)** | Back-and-forth conversation helps a young brain grow; Kheelu gives your child more of it | Only the [claims §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors) form, with its public source linked ([D016](../decisions/D016-brain-wording.md), [D026](../decisions/D026-public-statistics.md)) | A source marker on the page (G15) |
| **What it is** | A soft, screen-free plush toy that talks, for ages 3 to 7, in 8 languages | Descriptor "a screen-free plush toy that talks" ([keyword map SV-2](../research/keyword-map.md#in-one-screen)); "AI toy" only in a sub-line ([messaging, words](../brand/messaging.md#words-to-stop-using)); languages from [facts](../product/facts.md#languages) | Kheelu art from the DS; language chips |
| **What you see as a parent** | You can read every conversation, delete any in one tap, and get a weekly report on four thinking skills with a new-word count | [D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D036](../decisions/D036-launch-feature-claims.md); never an outcome for the child (legal review L7) | DS app frame (`kh-device`, fixed for phones: G-04) |
| **Foundation: checkable safety** | Mic on only after the wake-up button, with a light; providers in India that reply only, keep nothing, never train; parents read and delete; we don't sell data | The [D020](../decisions/D020-provider-terms-and-no-sale.md) order, lines on [messaging](../brand/messaging.md#confirmed-candidate-lines). Training by Kheelona's own model is disclosed on `/terms` and `/privacy` only, and no page implies there is none ([D035](../decisions/D035-model-training-opt-out.md)) | Link to `/safety` |
| **The offer** | ₹499 today, refundable; ₹4,999 in total incl. GST; deliveries from mid-November; 7-day returns; 6-month warranty; UPI, cards, net banking | [D028](../decisions/D028-price-wording.md), [D023](../decisions/D023-new-order-delivery.md), [D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md), [D033](../decisions/D033-warranty-after-day-7.md), [D024](../decisions/D024-payment-methods-gst.md); amounts render from [pricing](../product/pricing.md) | OfferCard, trust row |
| **Who is behind it** | Parents in Bengaluru; the founders; the seller's legal details | [facts, company](../product/facts.md#company-facts-the-site-uses-as-proof); recognition and bios only once proof is filed ([D038](../decisions/D038-trust-content-rulings.md)) | `/team`, footer seller block |

**Never on the site:** Kheelu as the subject of brain growth; "brain-development toy" as a label;
"adapts" and its family; "safe" alone; emotion reading; "lessons"; wake-word lines; "best friend" ("friend" itself is allowed since 2026-10-11, [D041](../decisions/D041-gate-a-round-1.md))
(pending G5); a named advisor; pilot results or a promise to publish them; competitor names;
scarcity counts, countdowns or "selling fast". The full list: [claims §4](../product/claims.md#4-retired-or-banned-wording)
and [messaging, words to stop using](../brand/messaging.md#words-to-stop-using).

**Tone:** specific, calm, mechanism before outcome, never fear ([voice](../brand/voice.md)).

## 2. The parent's journey and objections

The objections are listed on [audience](../brand/audience.md#objections); their allowed answers on
[messaging](../brand/messaging.md#objection-answers). The journey below assigns each question to the
place that answers it, so no screen has to answer everything and no answer appears twice.

| Stage | Where the parent is | Their question | Answered by (section and page) | Evidence |
|---|---|---|---|---|
| 1. Landing | An ad (Meta, phone, in-app browser), Google, ChatGPT, a WhatsApp link | "What is this, and is it for my child?" | Hero: age chip "Ages 3 to 7", descriptor, the mechanism line, CTA with the price sentence. Home and product page | Paid phone visitors leave Home in 8 s ([audit §8 #1](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)) |
| 2. Belief | Scrolling a little, or tapping a film | "Does it actually do something good?" / "Won't AI make my child think less?" | "See it ask": films or an illustrative exchange; the conversation research line with its source | Films are the most-used interactive element ([audit §5](../research/posthog-audit.md#customer-films-q27)) |
| 3. Fit | Thinking about their own home | "Does it speak our language? Does it need Wi-Fi? Is it right for my 3-year-old?" | Modes and languages section; FAQ. The 3-year-old answer stays within G5 | 3-7 band; 3 is new to the positioning ([audience](../brand/audience.md#objections)) |
| 4. Safety | Worried | "Is it always listening? Where does the voice go? Can I see what it says?" | Safety facts (D020 order) on Home, product page; full detail on `/safety`; the parent app section | Trust is the category's ceiling ([audience, needs](../brand/audience.md#needs)) |
| 5. Risk and price | Close to deciding | "Why ₹4,999? What is the ₹499? What if we don't like it? When does it come?" | OfferCard and the trust row beside every CTA; FAQ near the close | 81 of 91 store visitors never started the form ([audit §8 #4](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)) |
| 6. Trust in the seller | Checking before paying | "Who are these people? Is this a real company?" | `/team`; seller block and grievance officer (D032) in the footer and policy pages; recognition once proven | E-Commerce Rules ([policies](../product/policies.md)) |
| 7. Checkout | On the store | "What am I paying now? Is my number right? Will this work in WhatsApp?" | Store restyle: the same price sentence, delivery and returns beside the form; +91 label; in-app-browser hint (G13) | Issues 2-4 and 9 ([audit §8](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)) |

**Rule for every page:** one obvious next step per screen; every page ends with the CTA or a link to
the product page (brief §9.1, DS `10-pages.md:34-40`). No dead ends; nothing sends a store visitor
back to the marketing site mid-purchase.

## 3. CTA strategy

### 3.1 The one action and its label (Gate A, G1)

- **Action:** open the store, `https://store.kheelona.com` (`PREORDER_HREF`), in the same tab. One
  destination for every CTA ([benchmarks A2](../research/d2c-benchmarks.md#31-adopt)).
- **Label, recommended: "Pre-order Kheelu"** everywhere, including the sticky bar. Why:
  - It is the live, founder-chosen label (2026-08-22, "no number on the button";
    [messaging #2](../brand/messaging.md#cta-labels)), so no habit or ad has to change.
  - It stays true in both offer modes. Labels carrying "₹499" become false once the first 500 units
    are sold ([pricing](../product/pricing.md)).
  - [D028](../decisions/D028-price-wording.md) puts the price beside the button, not on it.
  - The DS's three labels ("Pre-order Kheelu", "Pre-order for ₹499", "Pre-order") break the brief's
    "same label everywhere"; using the full label in the bar settles DS gap G-07 without changing the
    DS (the bar's `cta` prop takes any string). Checked at 360 px in the mockup.
- Alternative for the founder: "Reserve Kheelu" (matches the store's own "Reserve" wording and D023's
  verb). Not recommended: changing the label costs continuity for no measured gain.

### 3.2 What sits beside every CTA

| Element | Rule | Owner |
|---|---|---|
| Price sentence | Token mode: ₹499 first, "refundable" beside it, the ₹4,999 total (incl. GST) in the SAME sentence. Full mode: "₹7,999, incl. GST". Rendered from the price source, never typed | [D028](../decisions/D028-price-wording.md); [pricing](../product/pricing.md); mode display G9 |
| Delivery | "Deliveries start mid-November" for new orders, from one content value (schema date 2026-11-15) | [D023](../decisions/D023-new-order-delivery.md), [D037](../decisions/D037-delivery-date-in-schema.md) |
| Trust row (2-4 items, each linked to its terms) | 7-day returns, no questions asked · 6-month warranty · UPI, card or net banking · delivery included anywhere in India | [D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md), [D024](../decisions/D024-payment-methods-gst.md), [policies](../product/policies.md) |
| Help | "Questions? WhatsApp or call +91 91875 46483" as an inline secondary action, never a floating bubble | [D032](../decisions/D032-grievance-block-and-call-line.md); [benchmarks A11, X3](../research/d2c-benchmarks.md#31-adopt) |

### 3.3 Placement and repetition

| Page | CTA positions (each a `cta` tracking value, G10) |
|---|---|
| **Home** | Hero (inside 360 × 590); after "see it ask" (the belief fold); after the safety facts; the close (OfferCard). Laptop nav keeps its CTA (`navbar` was the top laptop source, 11 of 24 taps). Phone nav: logo and menu only; the drawer keeps the CTA (`navbar-mobile`, never tapped in the window, kept for parity) |
| **Product page** | Hero (inside 360 × 590); the OfferCard after the first proof; after safety; the close. Phone sticky bar from first paint |
| **Every other page** | The close (finale CTA) and the phone sticky bar; journal articles add one in-text link to the product page |
| **Store** | Its own pay button only (checkout wording, restyle only, [checkout](checkout.md#what-must-not-change-and-what-the-reset-restyles)) |

Never two chilli buttons in one phone view (the DS's nav plus hero pattern is gap G-06, decided at
Gate A with G2). The laptop first view keeps nav CTA plus hero CTA, because the nav CTA earns taps;
this is part of the G2 decision.

### 3.4 Phone sticky bar (benchmarks A1, D1)

- **Product page:** on screen from first paint; it steps aside (opacity and transform only) while the
  hero CTA or the OfferCard is on screen, so one CTA shows at a time.
- **Home and other pages:** appears once the hero CTA leaves the screen (the DS rule).
- Contents: price "₹4,999 incl. GST" and a note "₹499 today, refundable" (one line, the D028 sentence
  in short form, checked for D028 at Gate A), plus "Pre-order Kheelu". It never animates after it
  appears, is never covered by any floating element, honours the safe-area inset, and carries its own
  `cta` value (today's bar is untagged: [audit §9](../research/posthog-audit.md#9-instrumentation-gaps)).
- DS gaps: show/hide behaviour G-09; motion G-10 (spec at Gate A, G4).

### 3.5 Tracking rules for CTAs

Every existing event name, parameter and ID stays ([tracking inventory](tracking-inventory.md)). The
eight existing `cta` values stay on their equivalent buttons; new buttons (sticky bar, belief fold,
safety fold) get new values, listed at Gate A (G10). New events (sheet opened, payment failed with
reason, form rejected with field name) are additions only (G12).

## 4. Site map and URL plan

Every current URL is on the [URL map](url-map.md#1-indexable-marketing-urls). Brief §2 allows
dropping or merging one or two pages, each with a one-hop 301.

### 4.1 Keep, merge, drop (Gate A, G8 with G5)

| URL | Verdict | Why | Redirect |
|---|---|---|---|
| All 13 marketing pages except `/playos` | **Keep**, new content | Existing URLs keep their equity; each has its own cluster (§5) | – |
| `/playos` | **Drop** (recommended) | Platform story is for investors (positioning; [content boundary](content-boundary.md)); its signature lines are banned ("own the model", D019; the opt-in training line, D035); viewed in 24 human sessions, 1 landing ([audit §8 #6](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact)) | 301 → `/products/kheelu` |
| `/stories/brain-development-toys-for-a-2-year-old` | **Merge** (recommended) | The URL targets under-3s, which the brief forbids implying ([keyword map SV-4](../research/keyword-map.md#43-overlap-and-cannibalisation-flags)) | 301 → `/stories/learning-toys-for-a-three-year-old`, which gains "brain development toys for a 3-year-old" as an H2 |
| `/stories/what-to-look-for-in-a-safe-ai-toy` | Keep for v1; merge later if C11 data shows cannibalisation | High intent overlap with `/ai-toys-for-kids-in-india` (SV-3), but the brief caps drops at one or two | Optional 301 → `/ai-toys-for-kids-in-india` |
| `/stories/talking-toys-and-late-talkers` | Keep for v1; rewrite to 3+ (G5) | Medium overlap with `talking-late-or-talking-little` | Optional 301 later |
| The other 20 articles | **Keep**, refreshed to the rules (age band, banned words, D016, D025 disclaimer) | Each owns a distinct cluster | – |

### 4.2 Redirect hygiene (Phase 4)

- Keep all 24 `next.config.ts` rules and the proxy rules; every one stays one hop
  ([URL map §4](url-map.md#4-redirects)).
- Remove the 2-3 hop chains through `www` and `http` with host-matched rules that go straight to the
  final URL (Architect; no Vercel CLI, any dashboard change is the founder's).
- Add one-hop redirects for guessable 404s: `/kheelu` → `/products/kheelu`, `/careers` → `/team`
  ([URL map §4d](url-map.md#4d-urls-that-404-today-no-handler)).
- `/faq` keeps its redirect to `/products/kheelu#faq`. Event-tier QR routes `/e/<tier>` keep working
  (F13 not asked; the safe default keeps every route).

### 4.3 New pages

None in v1. `/faq` and `/how` as pages have no volume data; the product page FAQ carries FAQPage
schema. `/stories/learning-toys-for-4-to-7-year-olds` is built only if the C11 Keyword Planner export
shows 100+ a month for a single-age phrase ([keyword map §4.4](../research/keyword-map.md#44-new-pages-proposed-and-rejected)).

### 4.4 Navigation

- **Laptop nav:** Meet Kheelu · Safety · Stories · Team, plus the CTA. PlayOS leaves the nav.
- **Phone:** logo, menu button, `NavDrawer` with the same four links and the CTA.
- **Footer:** Kheelu (Meet Kheelu, Safety, Setup), Read (Stories, buyer's guide), Help (Contact,
  Shipping, Refunds, Terms, Privacy); the seller block; the grievance officer's line links to
  `/contact` (D032).

## 5. Each page: purpose, primary cluster, outline

The primary clusters are owned by [keyword map §4](../research/keyword-map.md#4-one-primary-cluster-per-url);
placement rules by [§5](../research/keyword-map.md#5-placement-rules). Folds are phone order.

| URL | Purpose | Primary cluster | Folds (phone order) | CTA |
|---|---|---|---|---|
| `/` | Ad and brand landing; say what Kheelu is and send the parent to the store or the product page in one tap | Kheelu by Kheelona | Hero · see it ask · why conversation (sourced) · modes and languages · what parents see (app, weekly report) · safety facts · compare by category · FAQ (6) · close (OfferCard) | Hero, belief, safety, close; sticky after hero |
| `/products/kheelu` | The selling page and default ad destination: tell, prove and sell on one page | toys that talk back | Hero (age chip, descriptor, mechanism, CTA, price sentence, trust row) · films or sample exchange · OfferCard with "everything included" · how it works (three modes, Good-to-know box) · the four skills as what the weekly report shows (no age-by-age claims, no advisor) · safety facts · specs and India declarations (tabs: Specs, In the box, Safety; MRP ₹7,999, made in India, manufacturer, D034; placeholders for F4) · FAQ (8) · speech disclaimer (D025) · close | Sticky from first paint; hero, OfferCard, safety, close |
| `/safety` | Answer "are AI toys safe?" with checkable facts | are AI toys safe | Answer-first block · the D020-order facts, each expanded · what we never do (camera, browsing, ads, sale) · parent controls · retention · certification status ("applied for, not yet granted"; no ISI claim, L1, BIS-02) · questions · close | Close, sticky |
| `/ai-toys-for-kids-in-india` | Buyer's guide written for answer engines; routes to the product page | AI toys for kids in India | Answer-first · five checks to make (category terms, no brands) · how Kheelu meets each (facts only) · plush or robot · questions · close | Close, sticky |
| `/stories` | Journal hub | parenting guides (hub) | Intro · articles by topic (screen time, talking and language, AI and safety, learning toys) | Close |
| `/stories/*` (21 after the merge) | Win learn-intent searches; route to the product page | One cluster each ([keyword map §4.2](../research/keyword-map.md#42-journal-articles-22)) | Article (DS gap: long-form layout, G-11) · one in-text product link · related articles · close | Close, sticky |
| `/team` | Trust: who makes Kheelu | Kheelona founders | The three founders · why we build it · proof-gated bios (D038) · close | Close |
| `/setup` | Post-purchase day one | how to set up Kheelu | Steps with the wake-up button wording (D018), the parent app, setting the child's age (D036) | Link to contact |
| `/contact` | Reach the team; grievance officer | contact Kheelona | WhatsApp and calls, email, grievance officer block (D032), seller block | Close |
| `/privacy`, `/terms`, `/refund`, `/shipping` | Legal and policy pages, rewritten from D018-D037 and the [legal review](../product/legal-requirements.md); founder approves (D029) | their own trust clusters | Plain-English summary first, then the full text; grievance block (D032); training disclosure on `/terms` and `/privacy` (D035) | Link back to the product page |
| store (`store.kheelona.com`) | Checkout: restyle only | noindex | Price sentence, delivery, trust row, 3-4 question FAQ beside the form; +91 WhatsApp label; in-app-browser hint (G13) | Pay button (unchanged logic) |

## 6. How each top PostHog issue gets fixed

Issues as ranked on [audit §8](../research/posthog-audit.md#8-top-10-issues-ranked-by-estimated-revenue-impact).

| # | Issue | The fix in the new site | Where | Phase |
|---|---|---|---|---|
| 1 | Paid clicks do not land; paid visitors leave Home in seconds | Product page as the ad destination (founder sets it in Meta, C5); CTA, price sentence and trust line in the first 360 × 590; server-rendered content; LCP ≤ 2.5 s inside in-app browsers; no hero entrance animation | Product page, Home hero | 3 (mockup), 4 (budget), 5 |
| 2 | Orders created but not paid, all in in-app browsers | Sandbox QA of the Razorpay sheet in WhatsApp, Instagram, Facebook browsers; presentation-only "open in Chrome or Safari" hint with copy-link on the store (G13); new events for sheet opened and payment failed (G12) | Store | 4-6 |
| 3 | Half of form starters never submit | Presentation only: "Indian WhatsApp number" label with a visible +91; field-linked, announced errors; correct input types and autocomplete; the refund promise and "you pay ₹499 on the next step" beside the button | Store | 5 |
| 4 | Store visitors read and leave | The store answers the buying questions beside the form: price sentence, what the refundable ₹499 means, delivery, returns, 3-4 FAQs, one help link; nothing links away mid-purchase | Store | 5 |
| 5 | Phones decide on the first screen and the sticky bar | §3.3-3.4: sticky bar with its own `cta` value; first-screen CTA on Home and product page | Home, product page | 3, 5 |
| 6 | Product page converts 3x better than Home | Product page becomes the full selling page; Home's hero and belief fold link to it; PlayOS leaves the nav | Home, nav | 3, 5 |
| 7 | The store is the slowest page | Architecture choice for the store's server response (render region near India: C17 needed); perf budget includes the store; no logic change | Store | 4 |
| 8 | Home is sluggish on phones (INP 546 ms) | INP ≤ 200 ms budget; no 3D canvas or scripted reveals on phones; CSS-first motion | All | 4, 5 |
| 9 | Outside-India visitors meet an India-only rule | "Indian WhatsApp number" label; "Delivered anywhere in India" beside the CTA | Store, trust row | 5 |
| 10 | Small frustrations | Film carousel with position and end state; decorative art not tappable; tap targets ≥ 44 px; the whole consent row toggles | Home, store | 5 |

## 7. Search and AI visibility rules the pages follow

- Titles ≤ 60 characters, meta ≤ 155, one H1, the page's primary cluster in title, H1 or first
  paragraph and meta ([keyword map §5](../research/keyword-map.md#5-placement-rules)).
- Answer-first blocks (a question heading, a 40-60 word answer, then detail) on Home's FAQ, the
  product page, `/safety` and the guide ([keyword map §6](../research/keyword-map.md#6-question-bank-answer-first-drafts)).
- Entity facts identical everywhere: "Kheelu by Kheelona", ages 3 to 7, ₹4,999 incl. GST first in
  machine-read outputs (D028), made in India by Kheelona Robotics (D034), and nothing that conflates
  Kheelona with the unrelated "Kheelona India" seller (D039).
- All primary content in server HTML; `llms.txt` rewritten from the new facts; AI-crawler policy at
  Gate A (G7, recommended: allow, block Bytespider).
- Product JSON-LD: price 4999 INR, PreOrder, `availabilityStarts` 2026-11-15 (D037), return policy
  and warranty from the same content source as the copy (D021, D022, D033).

## 8. Constraints carried into Phase 3 and 4

- DS only: tokens, components, cast and art from `design-system/`; gaps logged, never improvised
  ([gaps](../design-system/gaps.md)). Phone first at 360, 390, 412; laptop 1366, 1440.
- Motion: no entrance on the hero, price or CTA; opacity and transform only; reduced motion honoured;
  spec proposed at Gate A (G4, DS gap G-10).
- Checkout logic, prices and tracking unchanged; copy changes on the store are presentation only.
- Production stays as it is until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)).

## 9. Decisions this strategy needs at Gate A

Carried into `mockup/APPROVAL.md` (at most seven reach the founder, brief §7):
G1 the CTA label (§3.1) · the hero headline (the tagline or an alternative, D038) · G2 contrast and the
two-chilli first view · G3 films and photos beyond the DS · G4 the motion spec · G8/G5 the URL plan
(§4.1) · G7 the AI-crawler policy. Also flagged, with a recommendation: F7 what keeps working after
six months of Kheelona+ (the legal review says the site must say it), and G6 consent with D035's
training risk.

## Related

[messaging](../brand/messaging.md) · [audience](../brand/audience.md) · [PostHog audit](../research/posthog-audit.md) ·
[benchmarks](../research/d2c-benchmarks.md) · [keyword map](../research/keyword-map.md) · [URL map](url-map.md) ·
[checkout](checkout.md) · [tracking inventory](tracking-inventory.md) · [open questions](../open-questions.md)
