---
title: "Buyer's guide (/ai-toys-for-kids-in-india): page copy, Gate A mockup draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.2-3.5 CTA rules, §4 URL plan, §5 the guide row, §7 search rules)
  - ../gate-a-open-items.md (working defaults B3, B14, B32)
  - ../../decisions/D017-live-behaviour-claims-confirmed.md, D018, D021, D023, D024, D027, D028, D032, D035, D036, D038, D041, D043
  - ../../product/claims.md (§1, §2, §3, §4), ../../product/facts.md, ../../product/pricing.md, ../../product/policies.md, ../../product/age-band-review.md (rows 28-29)
  - ../../brand/messaging.md (words to stop using, against the alternatives), ../../brand/voice.md
  - ../../research/keyword-map.md (§2.1 BUY-5, §2.2 CMP-3, §4.1 guide row, §5.1-5.2, §6.4), ../../research/source-verification.md (C31)
  - ../content-boundary.md, ../tracking-inventory.md (§6), ./home.md (CTA block, sticky bar), ./safety.md (the safety facts this page links to)
  - design-system/project/03-cast.md:100-126, assets/Kheelu/README.md, assets/Cast/README.md, 10-pages.md (read-only)
  - "Live source refreshed: src/app/(site)/ai-toys-for-kids-in-india/page.tsx (working tree, no local changes to src/ per git status 2026-10-11, so it matches tag archive/pre-reset-2026-10-10)"
---

# Buyer's guide (`/ai-toys-for-kids-in-india`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text in the
> **Copy** blocks is for the site. All copy is a draft until the founder signs it off at Gate A
> ([D015](../../decisions/D015-founder-signs-off-copy.md), [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

Conventions as on [safety.md](safety.md#how-to-read-this-page): `{price-source}`, `{delivery-source}`, `¹ ²`
source markers. No `[PLACEHOLDER]` is needed on this page.

## At a glance

| Item | Draft |
|---|---|
| Page job | Help a parent choose any AI toy with five checks a maker can answer in a sentence, show how Kheelu answers each, and route them to the product page or the store. Written for answer engines as much as for people |
| Real URL | `/ai-toys-for-kids-in-india` (mockup file `ai-toys-for-kids-in-india.html`; nav `active`: none; footer "Read" column) |
| Primary search cluster | **AI toys for kids in India** (BUY-5, [keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)) |
| Secondaries placed | AI robot or AI plush (fold 4 H2, CMP-3); ai plush toy (fold 4); what age is an AI toy for (FAQ); best AI toy for a 3 to 7 year old (fold 1 lead, answered by the checks) |
| Title (55 characters) | AI toys for kids in India: how to choose one · Kheelona |
| Meta description, token mode (154 characters) | AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹4,999`{price-source}` (incl. GST); reserve with a refundable ₹499`{price-source}`. |
| Meta description, full mode (151 characters) | AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹7,999`{price-source}` (incl. GST), delivered anywhere in India. |
| H1 | Options in [fold 1](#fold-1--hero-answer-first); recommended **B** "AI toys for kids in India: five checks before you buy." |
| CTA | One: the close, **Pre-order Kheelu**, `cta` = `finale`; plus the phone sticky bar (`sticky-bar`), from first paint (no hero CTA) |
| Mockup meta | `{"title": "AI toys for kids in India: how to choose one · Kheelona", "description": "<token-mode meta above, amounts as text>", "url": "/ai-toys-for-kids-in-india", "buybar": true, "active": ""}` |

The meta is machine-read, so it leads with ₹4,999 (incl. GST) and gives the advance second
([D028](../../decisions/D028-price-wording.md); [keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 5).
It fixes the live meta's "3 to 5 year old" to 3 to 7 and drops its "wake-word mic"
([age-band review](../../product/age-band-review.md) row 28; [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 22).
No competitor is named anywhere on the page, and no competitor price appears (working default B14;
[claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) line 145: the live "around ₹14,000" line does not carry over).

---

## Fold 1 · Hero (answer first)

**Fold job:** give the whole answer in the first phone screen: five questions to put to any maker.

**Copy:**

> **Eyebrow:** A guide for parents
>
> **H1:** AI toys for kids in India: five checks before you buy.
>
> **Lead (answer-first, 59 words):** Before you buy an AI toy in India, put five questions to its maker. Does it have a screen or a camera? When is its microphone on? Can it reach the open internet? Can you read every conversation? Does it speak your family's languages? A good AI toy for a 3 to 7 year old answers all five plainly.

- **H1 accent:** `Hand` on "before you buy." (or on "how to choose one." with option A).
- **No CTA in the hero.** The sticky bar shows from first paint, so the first phone screen still carries the
  button and the D028 short price.
- **Image** (under the words on phones): a `kh-art` board: one brand block, one shape, `myra-sticker.png`
  bottom-aligned, `kheelu-front-sticker.png` tilted, `ink-question-mark.svg` as the one doodle (alt `""`).
  `role="img"` label: "A little girl in a white broderie top beside Kheelu, the cream plush rabbit." (Myra's sticker
  is cut from her portrait, `03-cast.md:106`; the builder confirms the outfit against the file. Myra may appear
  alone, [D041](../../decisions/D041-gate-a-round-1.md) line 28.)

**H1 options (founder picks; each starts with the primary or its close variant, no outcome claim):**

| | H1 | Why |
|---|---|---|
| A | AI toys for kids in India: how to choose one. | The live H1 and the title; the keyword map's "keep as live" |
| **B (recommended)** | AI toys for kids in India: five checks before you buy. | The hook is a short, specific list a parent can use on any toy, including ours; it promises exactly what the page delivers. The title keeps "how to choose one", so both phrasings are on the page |
| C | Choosing an AI toy in India? Ask these five questions first. | Warmest, question-led; loses the exact primary at the start ("AI toy in India" is the close variant) |
| D | AI toys for kids in India: what to ask before you pay. | Same promise as B, without the number |

**Sources, fold 1**

| Claim | Source |
|---|---|
| The five checks | live `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:74-100` (refreshed); [keyword map §6.4](../../research/keyword-map.md#64-buyers-guide-ai-toys-for-kids-in-india) AI7, line 571 |
| Ages 3 to 7 | [facts, age](../../product/facts.md#age) line 83 |
| Image | DS `03-cast.md:106`; `assets/Cast/README.md:10-12`; cast are AI-generated characters, never customers (`03-cast.md:5`) |

---

## Fold 2 · The five checks (category terms, no brands)

**Fold job:** set out each check as a neutral question a parent can put to any maker.

**Copy:**

> **Eyebrow:** The five checks
>
> **H2:** Five things to check before you buy an AI toy.
>
> **Lead:** Each one is a question a maker should answer in a sentence. If the answer is vague, ask again.
>
> **1 · Does it have a screen or a camera?**
> A screen gives your child something to watch. A camera can see your child and your home.
>
> **2 · When is the microphone on?**
> Ask what turns it on, how you can tell it's listening, and when it switches off.
>
> **3 · Can it reach the open internet?**
> A toy that can browse can land on things you'd never choose for your child. Ask where its answers come from.
>
> **4 · Can you read every conversation?**
> A summary shows you what the maker chose to show. Ask whether you can read every word, and delete it yourself.
>
> **5 · Does it speak your family's languages?**
> Ask which languages it speaks today, not which ones are coming.
>
> [Read more: what to look for in a safe AI toy] → `story-what-to-look-for-in-a-safe-ai-toy.html`

- **H2 accent:** `Mark` underline on "check". The H2 carries the close variant "buy an AI toy" ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 4).
- Component: a numbered list (`StepList` pattern, DS) or `kh-card` stack, one card per check on phones.
- **Refreshed from the live page:** check 1 was "When is the microphone on? ... Look for wake-word listening ... Off
  should mean off, not muted and waiting." (banned: [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)
  row 10); now a neutral question. The live check "Where does your child's voice go?" is replaced by the screen
  and camera check, and the voice path is left to `/safety`, where the providers line is stated in full, scoped
  as [D035](../../decisions/D035-model-training-opt-out.md) requires (CMO review F2 on Home). The live check "Is it
  built for your child's age?" moves to the FAQ. Languages is new (keyword map AI7).
- These are advice, not facts about other products: no brand, price or specification of any other toy.
- The link keeps the long-form article for evening reading (strategy §4.1: the article stays in v1); internal, no
  `cta` attribute.

**Sources, fold 2**

| Line | Source |
|---|---|
| The five questions | [keyword map §6.4](../../research/keyword-map.md#64-buyers-guide-ai-toys-for-kids-in-india) AI7, line 571; live check titles `page.tsx:77, 82, 87, 97` |
| "A camera can see your child and your home" | [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) B11, line 566 |
| "A toy that can browse can land on things..." | live `page.tsx:83` ("A toy that can browse can stumble"), reworded; advice |
| "A summary shows you what the maker chose to show" | live `page.tsx:88` ("A summary is not a transcript"), reworded; advice |

---

## Fold 3 · How Kheelu meets each check

**Fold job:** answer the five checks for Kheelu, with confirmed facts only, in the same order.

**Copy:**

> **Eyebrow:** Kheelu's answers
>
> **H2:** How Kheelu meets each check.
>
> **Lead:** Kheelu by Kheelona is a screen-free plush toy for children aged 3 to 7. Its answers, in the same order:
>
> **Screen or camera**
> Neither. No screen and no camera.
>
> **Microphone**
> On only after someone presses the wake-up button. A light shows whenever it's listening, and it switches itself off after about a minute of quiet.
>
> **Open internet**
> It can't browse the internet. Its answers come from a curated, closed content library, and when it doesn't know something, it says so.
>
> **Every conversation**
> Yes, in the parent app, word for word. Delete any of them in one tap.
>
> **Languages**
> Eight today: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French, with up to 10 at launch. It can switch between them mid-sentence.
>
> How Kheelu understands and answers your child, and how long conversations are kept, are on our safety page.
>
> [See the full safety facts] → `safety.html`

- **H2 accent:** `Hand` on "each check."
- Component: `TrustList` (`kh-trust`) with the check as `kh-trust__title`, or the `mk-compare-stack` card pattern
  Home uses on phones; one column on phones. Not a `ComparisonTable`: there is no other column.
- **Why the voice path is not on this page:** stating it here would mean either the providers line in full (a
  second home for it) or a shorter form that drops the scoping [D035](../../decisions/D035-model-training-opt-out.md)
  depends on. `/safety` owns it; the sentence above points there, naming only the reply path.
- **The closed library** sits on a page that calls Kheelu an AI toy throughout (FAQ 1), so it cannot be read as "no
  AI model involved" ([claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)
  line 114, Gate A flag).
- **Languages:** the eight named, the ceiling of 10, and mid-sentence switching; the native-script chips (`LanguageChips`)
  may replace the list on wider screens, as on Home.
- Internal link, no `cta` attribute.

**Sources, fold 3**

| Claim | Source |
|---|---|
| "Kheelu by Kheelona"; screen-free plush toy; ages 3 to 7 | [facts, identity](../../product/facts.md#identity) lines 70, 73; [facts, age](../../product/facts.md#age) line 83; [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) |
| No screen; no camera | [messaging #1](../../brand/messaging.md#proof-points) line 196; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 68 |
| Microphone on only after a press of the wake-up button; a light shows; off after about a minute of quiet | [D018](../../decisions/D018-wake-up-button.md) lines 24-28, 34; [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 73 |
| Can't browse the internet | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71 |
| Curated, closed content library | [D036](../../decisions/D036-launch-feature-claims.md) line 21; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 114 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) line 18; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 117 |
| Read every conversation, word for word; delete in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 72; [facts, parent app](../../product/facts.md#parent-app) lines 150-151 |
| Eight named languages; up to 10 at launch; switches mid-sentence | [facts, languages](../../product/facts.md#languages) lines 110-112 |

---

## Fold 4 · AI robot or AI plush?

**Fold job:** answer the robot-or-plush question by category, and say plainly that Kheelu is a plush rabbit, not a robot.

**Copy:**

> **Eyebrow:** Plush or robot
>
> **H2:** AI robot or AI plush?
>
> It depends on what you want your child to do. A robot toy with a screen often shows faces, games and videos, so your child watches. A plush toy that talks has no screen, so your child talks and listens instead. Kheelu is a soft plush rabbit, not a robot, with a speaker in its tummy.
>
> [See what Kheelu does] → `meet-kheelu.html`

Word count: 54 (answer-first).

- **H2 accent:** `Hand` on "AI plush?". "AI" here is the search phrase parents type (CMP-3), not Kheelu's headline noun.
- The robot sentence is a hedged category description ("often"), with no brand, price or specification: like
  Home's comparison cells, it has no public source, so the CMO Reviewer checks it for fairness.
- It also corrects an entity error answer engines make ("robot", "robotic": [keyword map §2.2](../../research/keyword-map.md#22-compare) CMP-3).
- "No moving parts" is not used (working default B32).
- **Image:** `kheelu-front.webp`, whole and upright. Alt: "Kheelu, the soft cream plush rabbit with rainbow ears
  and a speaker in its tummy." (DS `assets/Kheelu/README.md:5-6`; [facts, identity](../../product/facts.md#identity) line 74.)
- **The link** is the page's in-text product link ([strategy §3.3](../strategy.md#33-placement-and-repetition));
  internal, no `cta` attribute.

**Sources, fold 4**

| Claim | Source |
|---|---|
| The robot-or-plush answer | [keyword map §6.4](../../research/keyword-map.md#64-buyers-guide-ai-toys-for-kids-in-india) AI8, line 574 (reworded); category description, no public source (CMO fairness check) |
| Plush rabbit, not a robot; a speaker in its tummy | [facts, identity](../../product/facts.md#identity) lines 73-74 ("A plush toy, not a robot"; "with a speaker in its tummy") |
| No screen | [messaging #1](../../brand/messaging.md#proof-points) line 196 |

---

## Fold 5 · Questions parents ask

**Fold job:** answer the five questions an answer engine or a parent asks next, 40 to 60 words each.

**Copy:**

> **Eyebrow:** Questions
>
> **H2:** Questions parents ask.
>
> **What is an AI toy?**
> An AI toy uses artificial intelligence to talk with your child, so it can reply to what your child says instead of playing fixed, recorded phrases. Kheelu is one: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back, so they do the thinking.
>
> **Is an AI toy better than a tablet for a young child?**
> They do different things. A tablet gives your child something to watch, and both the WHO and the AAP put a ceiling on it: no more than an hour a day from age two until five.¹² Kheelu has no screen at all: it answers your child, then asks a question back, so your child talks instead of watching.
>
> **What age is an AI toy for?**
> Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby. You enter your child's age in the parent app, and every reply passes an age-graded safety layer set to that age. What child-safety groups advise is on our [safety page](../../../mockup/safety.html).
>
> **Does Kheelu need Wi-Fi?**
> Only for open conversation in AI mode, which uses your home Wi-Fi. Story mode's stories, poems and jingles need no Wi-Fi, and Bluetooth mode needs only a paired phone. So Kheelu still plays on a train or at a grandparent's home with no Wi-Fi.
>
> **How much is Kheelu?**
> Kheelu is ₹4,999`{price-source}` (incl. GST) for the first 500 units, with delivery anywhere in India included. A refundable ₹499`{price-source}` advance reserves yours today, and the remaining ₹4,500`{price-source}` is due before delivery. After the first 500, it is ₹7,999`{price-source}` (incl. GST), paid in full. You can pay by UPI, card or net banking, and you get a GST invoice.
>
> **Sources**
> ¹ World Health Organization, "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", 2019, Recommendations: sedentary time, p. 8. https://iris.who.int/handle/10665/311664
> ² American Academy of Pediatrics, Council on Communications and Media, "Media and Young Minds", Pediatrics, 2016, Recommendations: Families. https://doi.org/10.1542/peds.2016-2591

Word counts: 52 · 58 · 58 · 44 · 58.

**Full mode**, the price question becomes Home's full-mode answer ([home.md](home.md#fold-8--questions-parents-ask)):

> **How much is Kheelu?**
> Kheelu is ₹7,999`{price-source}` (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November`{delivery-source}`. If it isn't right for your family, you can return it within 7 days of delivery, no questions asked.

- **H2 accent:** `Hand` on "ask."
- `FAQ` component, all items closed (DS: first item open on safety pages only). All five, exactly as shown, make
  the page's FAQPage JSON-LD. The price answer is machine-read, so it leads with ₹4,999 (incl. GST); "first 500
  units" appears once, as an offer term, never a badge or counter ([D041](../../decisions/D041-gate-a-round-1.md)
  line 31).
- **Q2** carries the verified C31 sentence verbatim, with its two markers ([source verification](../../research/source-verification.md)
  lines 387-394). It never says "better": the live line "conversation is the thing that builds language and a
  screen mostly is not" is dropped (no anchor; the WHO grades its own evidence very low, C31 note line 394).
- **Q3** carries the founder's "grown-up nearby" at 3. Its last sentence links to `/safety`'s Common Sense Media
  answer and depends on founder question 1 on [safety.md](safety.md#questions-for-the-founder-website-only-d030):
  if that answer is left off the site, the sentence goes too. The live "some are sold from 2, some from 5" is
  dropped (an unsourced claim about other toys).
- **Q4:** the live "Story mode stories and lessons" is gone ("lessons" is banned, [D027](../../decisions/D027-story-mode-wording.md)).
- **Dropped from the live FAQ:** "Are AI toys safe for a 3 year old?" (`/safety` owns the safety cluster; the
  cannibalisation risk is High, [keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags));
  "What should an AI toy cost in India?" (its market range is a competitor price: INTERNAL); "What languages can
  it speak?" (fold 3); "When can I get one?" (the close's trust line; the live answer still says 20 October).
- No speech or language question ([D025](../../decisions/D025-speech-and-language.md)).
- **Image (laptop, beside the FAQ; under it on phones):** `ira-01-story-on-the-bed-web.webp` (DS: "Story mode,
  two-language stories", `03-cast.md:112`). Alt: "A laughing girl in a peach kurta sitting cross-legged on a
  block-print bedsheet, telling Kheelu a story with both hands." (the alt the mockup uses on Home).

**Sources, fold 5**

| Claim | Source |
|---|---|
| What an AI toy is (definition) | live `page.tsx:111-113` (refreshed: "with a language model inside it" dropped, because Kheelu's AI runs at outside providers, [D019](../../decisions/D019-voice-providers.md), and on-toy processing is not claimed, working default B31) |
| Answers your child, then asks a question back; so they do the thinking | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 70; [strategy](../strategy.md#in-one-screen) lines 31-32 |
| WHO and AAP: no more than an hour a day from two until five | [source verification](../../research/source-verification.md) C31, lines 381-394 (verified FAQ form, verbatim, with markers; "Where: the AI-toys guide FAQ") |
| Made for 3 to 7; not for under 3 | [facts, age](../../product/facts.md#age) line 83; [keyword map §7.1](../../research/keyword-map.md#7-geo-plan) |
| If your child is 3, a grown-up nearby (wording since the wave 8 merge, below) | [D041](../../decisions/D041-gate-a-round-1.md) line 33 |
| Parent enters the age in the app; every reply passes an age-graded safety layer set to it | [D036](../../decisions/D036-launch-feature-claims.md) lines 22, 25-26; [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) line 115 |
| AI mode on home Wi-Fi; Story mode (stories, poems and jingles) needs no Wi-Fi; Bluetooth needs a paired phone | [facts, modes and connectivity](../../product/facts.md#modes-and-connectivity) lines 98-100; [D027](../../decisions/D027-story-mode-wording.md); [keyword map §6.2](../../research/keyword-map.md#62-product-page-productskheelu-or-faq-if-g8-makes-it-a-page) B5, line 512 |
| Price, first 500 units, advance, balance, full price, delivery included, payment methods, GST invoice | [pricing](../../product/pricing.md) lines 68-72; [D028](../../decisions/D028-price-wording.md); [D024](../../decisions/D024-payment-methods-gst.md); approved Home answer, [home.md](home.md) lines 601-602; full mode lines 619-620 |
| Image | DS `03-cast.md:112` |

---

## Fold 6 · Close

**Fold job:** the one action, with the price sentence, delivery and returns beside it, and a person to ask.

**Copy:**

> **Eyebrow:** Pre-order
>
> **H2:** Five checks, answered. Now meet Kheelu.
>
> Bring it home and check all five answers for yourself.
>
> **[Pre-order Kheelu]** → `store.html` (real: `https://store.kheelona.com`, `PREORDER_HREF`, same tab)
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483

- **CTA:** `Button cta l block` on phones, `cta` = `finale` ([tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser) line 281).
- **Full mode:** the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in full when you order."
- **Links:** delivery → `shipping.html`; returns → `refund.html`; WhatsApp and call as on Home.
- **H2 accent:** `Hand` on "meet Kheelu."
- **One chilli button per phone view:** the sticky bar steps aside while this button is on screen (shared change,
  see [safety.md, notes for the builder](safety.md#notes-for-the-builder)).
- **Image:** a `kh-art` board with `kabir-sticker.png` and `kheelu-front-sticker.png`, one shape, one doodle.
  `role="img"` label: "A boy in a denim shirt beside Kheelu, the cream plush rabbit." (Kabir's sticker is cut from
  his portrait, `03-cast.md:126`; the builder confirms the outfit against the file.)
- "Check all five answers for yourself": every one can be checked once Kheelu is home (screen and camera,
  the button and light, browsing, the app, the languages).

**Sources, fold 6**

| Claim | Source |
|---|---|
| Label, price sentence, refundable until dispatch, full mode | [D041](../../decisions/D041-gate-a-round-1.md) lines 16, 18; [D028](../../decisions/D028-price-wording.md); [pricing](../../product/pricing.md) lines 68-72; [policies](../../product/policies.md#status-at-a-glance) line 74 |
| Deliveries start mid-November | [D023](../../decisions/D023-new-order-delivery.md) lines 10-14 |
| 7-day returns, no questions asked | [D021](../../decisions/D021-returns-policy.md) line 19 |
| WhatsApp or call +91 91875 46483 | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel) line 223 |

---

## Phone sticky bar, nav and footer (shared partials, not rewritten)

As on [safety.md](safety.md#phone-sticky-bar-nav-and-footer-shared-partials-not-rewritten): the bar shows from
first paint and steps aside while the close's button is on screen; `cta` = `sticky-bar`. No nav item is active
(the guide sits in the footer's "Read" column, [strategy §4.4](../strategy.md#44-navigation)).

---

## Keyword placements

Primary cluster: **AI toys for kids in India** ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13), line 220).

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary near the start | Yes | 55 characters, primary first (the keyword map's "keep") |
| Meta ≤ 155: primary, a concrete fact, ₹4,999 (incl. GST) before the advance | Yes | 154 token / 151 full; facts: five checks, ages 3 to 7, price |
| One H1 carrying the primary | Yes | Options A, B, D verbatim; C carries the close variant |
| Primary in the first ~100 words, answer-first | Yes | H1, then the 59-word lead ("an AI toy in India") |
| "3 to 7" in the first screen | Yes | Lead, last sentence |
| An H2 with the primary or a close variant | Yes | Fold 2 "...before you buy an AI toy."; fold 4 "AI robot or AI plush?" (the keyword map's H2) |
| Answer-first blocks, 40 to 60 words | Yes | Lead (59), fold 4 (54), five FAQs (44 to 58) |
| Alt text: primary only where true | Yes | No alt carries it (none of the images is "AI toys for kids in India") |
| Words never placed | Yes | No competitor names or prices, no "toddler", "best friend", "tutor", "lessons", "adapts", wake-word lines, "Internet access: None", "no moving parts", health terms |
| Density: primary 0.5% to 2% | Yes | 1 occurrence (H1) of 6 words in about 760 words of `<main>` = about 0.8% |
| Density: "Kheelu" ≤ 2% | Yes | About 13 of about 760 words = about 1.7% |

---

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (named on Home) |
| Laptop nav / phone drawer | Pre-order Kheelu | `navbar` / `navbar-mobile` | Existing (partials) |
| Internal links (folds 2, 3, 4, FAQ 3) | Read more · See the full safety facts · See what Kheelu does · safety page | none | Not money CTAs |

---

## Placeholders

None. Every claim on the page has a source above.

---

## Questions for the founder (website only, D030)

1. **The guide's H1.** Options A to D in [fold 1](#fold-1--hero-answer-first). **Recommend B**, "AI toys for kids
   in India: five checks before you buy."; A if you prefer the live wording (the title keeps it either way).
2. **The live page's "What Kheelu cannot claim yet" block** (no certificate, no family reviews, battery life
   unpublished). (a) Drop it here: the certification status lives on `/safety` (fold 6), linked from fold 3, and
   warranty is now decided; (b) keep a short version here too: "Its BIS licence has been applied for and is not
   yet granted, and battery life is not published yet." **Recommend (a)**: one owner page for the status, and
   the guide stays about choosing. (b) is honest too; if you want it, it needs a battery placeholder (F4).

---

## Notes for the builder

- **Source markers** (DS gap G-18): one note under the FAQ, two markers on Q2.
- **The sticky bar must step aside while the close's button shows** (no OfferCard on this page; shared request,
  as on `/safety`).
- **Live page changes, for the record:** the lede "There are maybe a dozen of these on sale in India now" (an
  unsourced market count) is gone; the `SpecTable` (with "Internet access: None" and the wake-word row) and the
  `CompareTable` are not carried over; the honest-limits block is founder question 2; the "Ask the hard ones"
  Kheelu speech bubble (`GATED:kheelu-line`, never signed) is not carried over.

---

## Changes after approval (task 7.1b)

Applied by the main session at the wave 8 merge (2026-10-14) from the CMO's built-page review
([review A](../../qa/cmo-review-built-a-2026-10-14.md) M8) and the CMO's copy review of task 7.1b
([minor 2](../../qa/cmo-review-copy-fixes-7.1b-2026-10-14.md)). Every other line stands word for word as approved at
Gate A (D046).

- **Fold 5, "What age is an AI toy for?" (review A M8).** "At 3, we advise play with a grown-up nearby." becomes "If your
  child is 3, keep a grown-up nearby.", the site's one wording for the age-3 advice (Home, the product page, `/safety`
  and `/setup` say it the same way), without the "we advise play" M8 rules out. Same word count: the answer stays at 58
  words. Built in `src/content/en-IN/faqs.ts` (`ai-toy-age`); parity deviation V22 (`COPY_FIXES` in
  `test/e2e/support/deviations.ts`). The founder signs it off at Gate B (D015).
