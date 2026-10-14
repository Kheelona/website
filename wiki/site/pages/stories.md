---
title: "Stories hub (/stories): page copy, Gate A draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§2 rule for every page, §3.3 placement, §4.1 URL plan, §5 /stories row, §7)
  - ../gate-a-open-items.md (B5, B6, B28; §1 rows for D041)
  - ../url-map.md (§1b, the 22 live articles)
  - ../content-boundary.md
  - ../pages/home.md (CTA block, compact block, sticky bar, help line)
  - ../tracking-inventory.md (§6, the cta values)
  - ../../research/keyword-map.md (§4.1 /stories row, §4.2, §5.1, §5.2)
  - ../../product/claims.md (§1, §3.1, §4), ../../product/facts.md, ../../product/pricing.md
  - ../../decisions/D013, D016, D017, D028, D041, D043, D053
  - ../../qa/cmo-review-built-a-2026-10-14.md (M5), ../../qa/cmo-review-built-b-2026-10-14.md (m1) (task 7.1b)
  - ../pages/story-how-much-screen-time-for-a-3-to-6-year-old.md (the WHO, IAP and AAP guidance the screen-time lead points to)
  - "src/lib/stories.ts and src/lib/stories-expansion.ts at tag archive/pre-reset-2026-10-10 (titles, descriptions, themes; working tree read 2026-10-11, src/ unmodified per git status)"
  - design-system/project/03-cast.md:105,118,125; 01-writing.md:19-26,111-113; 10-pages.md:34-40,67 (read-only)
---

# Stories hub (`/stories`): page copy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. Everything else is a note for the team. All copy is a draft:
> CMO review next, then the founder signs off at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md),
> [D043](../../decisions/D043-all-pages-as-mockups-before-build.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `{price-source}` and `{delivery-source}`: written as today, rendered from the single sources, exactly as on
  [Home](home.md#how-to-read-this-page) (`TOKEN_PRICE`, `BALANCE_PRICE`, `LAUNCH_PRICE`, `DELIVERY_TEXT`).
- Links show the real URL, then the mockup file in brackets.
- No `[PLACEHOLDER]` on this page: every line has a source (table at the end).

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories` (mockup `stories.html`) |
| Page job | The journal hub: let a parent of a 3 to 7 year old find the guide for their question in one tap, by topic, and leave every guide with a next step ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **parenting guides** (hub; links to every cluster owner; not a ranking target) ([keyword map §4.1](../../research/keyword-map.md#41-marketing-pages-13)) |
| Title (43 characters) | Parenting guides for ages 3 to 7 · Kheelona |
| Meta description (128 characters) | Parenting guides for 3 to 7 year olds, in plain words: screen time, talking and language, learning toys, and AI toys and safety. |
| H1 | Guides for parents of 3 to 7 year olds (option A, recommended; options under fold 1) |
| CTA | One: the close, "Pre-order Kheelu", `cta` = `finale`; plus the phone sticky bar (`sticky-bar`) |
| Page settings for the mockup | `buybar: true`, `active: "stories"`, `chrome: true` |

The meta carries no price: the hub is not a commercial page ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules)
rule 5 asks for the price line on commercial pages only).

**Count note.** The live journal has **22** articles ([url map §1b](../url-map.md#1b-journal-articles-22)).
Dropping `brain-development-toys-for-a-2-year-old` (301 to the 3-year-old article, [D041](../../decisions/D041-gate-a-round-1.md))
leaves **21**, all listed below: 3 rewritten now, 18 marked "Rewritten in the build". The task brief said 20 and 17;
the URL map and `src/lib/stories*.ts` (4 + 18 entries) give 21 and 18.

---

## Fold 1 · Intro and topics

**Fold job:** say what the journal is and who it is for, then let a phone user jump to a topic.

**Copy:**

> **Eyebrow:** Parenting guides
>
> **H1:** Guides for parents of 3 to 7 year olds
>
> **Lede:** Plain-words parenting guides on screen time, talking, play and AI toys. Each one answers the question first, then shows its sources.
>
> Written by the Kheelona team in Bengaluru.
>
> **Topics** *(jump links, one row of chips)*: Screen time · Talking and language · AI toys and safety · Learning and play

- **H1 accent:** `Hand` on "3 to 7 year olds".
- Chips link to `#screen-time`, `#talking`, `#ai-and-safety`, `#learning` (each chip at least 44 px tall,
  `kh-chip` as a link; DS gap G-19 composed on bands as in the mockup).
- **No image** in the intro: the three rewritten guides carry the page's only photos (fold 2 to 5), so each
  DS child appears once.
- "Each one answers the question first, then shows its sources" is true of the three rewritten guides and
  becomes true of all 21 once the build rewrites the other 18 (strategy §4.1: refreshed to the rules). If the
  build ships before every rewrite, cut that sentence.

**H1 options**

| | H1 | Why |
|---|---|---|
| **A (recommended)** | Guides for parents of 3 to 7 year olds | The brief's own wording; says who it is for in the first words; the eyebrow and the lede's first words carry "parenting guides" |
| B | Parenting guides for 3 to 7 year olds | Puts the hub's primary in the H1 ([keyword map §5.1](../../research/keyword-map.md#5-placement-rules) rule 2); slightly colder |
| C | Plain-words guides for parents of 3 to 7 year olds | Adds the promise of the lede; longest (two lines at 360 px) |

---

## Folds 2 to 5 · Guides by topic

**Fold job:** one band per topic; each guide is a card with its title and one line. Rewritten guides link to
their page; the 18 not yet rewritten show a quiet label and link nowhere.

Card pattern (copy):

> **Title** (h3)
> One-line summary.
> *Rewritten guide:* "Read the guide · {n} min read" → the guide
> *Not yet rewritten:* "Rewritten in the build" (quiet caption, no link)

Order of topics follows [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (screen time,
talking and language, AI and safety, learning toys). Inside a topic, the rewritten guide comes first so a
reviewer reaches it in one scroll.

### Fold 2 · Screen time (`#screen-time`)

> **H2:** Screen time
>
> How much, what the guidelines say, and what to do when the screen goes off.

- **Lead** (changed after approval, task 7.1b; see the foot): "what the guidelines say" is the job of guide 1,
  which gives the WHO, IAP and AAP limits age by age; "what to do when the screen goes off" is guides 3 and 4. The
  same lead prints on Home's screen-time guide card (fold 7b).

| # | Card title | One-line summary | State |
|---|---|---|---|
| 1 | How much screen time is okay for a young child? | What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm. | Rewritten in the build |
| 2 | The 3-6-9-12 rule, and other screen rules parents swear by | Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say. | **Removed** 2026-10-14 ([D053](../../decisions/D053-remove-the-3-6-9-12-article.md), task 6.5): the topic shows five guides; the URL answers one 308 to `/stories#screen-time`; parity deviation [V9](../../qa/deviations.md) |
| 3 | Screen time and tantrums: what is actually happening | Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive. | Rewritten in the build |
| 4 | The gentle way off the phone: a seven-day plan | A week-long plan to cut a young child's screen time without turning your home into a battlefield. | Rewritten in the build |
| 5 | Busy hands, no screens | Screen-free ways to keep a young child busy at home, including on the days you have to work. | Rewritten in the build |
| 6 | Screen-free does not mean silent | What a childhood full of talk looks like, without a single screen. | Rewritten in the build |

### Fold 3 · Talking and language (`#talking`)

> **H2:** Talking and language
>
> Getting your child talking, late talkers, new words and two languages at home.

| # | Card title | One-line summary | State |
|---|---|---|---|
| 1 | Late talker? What helps a child find their words | What helps a 3 to 7 year old who talks later or less than others, and when to ask your child's doctor. | **Rewritten** → `/stories/talking-toys-and-late-talkers` (`story-talking-toys-and-late-talkers.html`) · 3 min read |
| 2 | Talking late, or talking little? | A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home. | Rewritten in the build |
| 3 | How to get your child talking | Better questions than "How was school?", and the small habits that turn one-word answers into conversations. | Rewritten in the build |
| 4 | How children learn by talking | Serve and return, the back-and-forth between a young child and a caring adult, and how it looks at home. | Rewritten in the build |
| 5 | How children collect words | How children pick up words at home, in every language you speak, without a single worksheet. | Rewritten in the build |
| 6 | Raising a bilingual child in India | Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive. | Rewritten in the build |
| 7 | A toy that talks is not a toy that listens | Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare. | Rewritten in the build |

Card 1 image: `kabir-04-planet-book-web.webp`. Alt: "A boy in round glasses and a mustard T-shirt lies on a
striped rug, chin in his hands, wide-eyed over a picture book about planets."

### Fold 4 · AI toys and safety (`#ai-and-safety`)

> **H2:** AI toys and safety
>
> What to check before an AI toy comes home, and what the law asks of the company behind it.

| # | Card title | One-line summary | State |
|---|---|---|---|
| 1 | What to look for in a safe AI toy | What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up. | **Rewritten** → `/stories/what-to-look-for-in-a-safe-ai-toy` (`story-what-to-look-for-in-a-safe-ai-toy.html`) · 5 min read |
| 2 | The hard questions parents ask about AI toys | The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones. | Rewritten in the build |
| 3 | Should kids use AI? An honest answer from people who build it | Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside. | Rewritten in the build |
| 4 | What India's data law asks of a toy that listens | India's data law in plain words: what it asks of a company handling a child's data, and what you can ask for. | Rewritten in the build |
| 5 | Does a three-year-old need an AI tutor? | Tutoring apps promise homework help. Your child can't do homework yet. What help at 3 should look like. | Rewritten in the build |

Card 1 image: `tara-02-evening-with-amma-web.webp`. Alt: "A laughing girl holds Kheelu on the sofa while her
mother, a steel tumbler in one hand and a phone in the other, laughs with her."

### Fold 5 · Learning and play (`#learning`)

> **H2:** Learning and play
>
> What a young child is working on, and the toys and habits that serve it.

| # | Card title | One-line summary | State |
|---|---|---|---|
| 1 | Learning toys for a 3-year-old, skill by skill | What a 3-year-old is working on, and which kinds of toys serve each part of it. | **Rewritten** → `/stories/learning-toys-for-a-three-year-old` (`story-learning-toys-for-a-three-year-old.html`) · 4 min read |
| 2 | What actually builds a sharp brain in the early years | Past the flashcards: the everyday things research points to, and how to get more of them at home. | Rewritten in the build |
| 3 | Why the early years matter most | What the early years are for, and the ordinary things that fill them well: talk, play and sleep. | Rewritten in the build |

Card 1 image: `myra-04-drawing-at-home-web.webp`. Alt: "A little girl in a red polka-dot frock, tongue out in
concentration, scribbling with an orange crayon at a low table."

**Notes on the cards**

- **Titles** are the live titles ([url map §1b](../url-map.md#1b-journal-articles-22)), except the 3-year-old
  guide, which uses its rewritten title (numerals for facts, DS `01-writing.md:23`). The build updates each card
  title when its guide is rewritten to the keyword map's title draft.
- **Summaries** are new one-liners, written from each live description with these fixes: no under-3 ages
  (the live screen-time line named "two"); no counts that go stale ("Twelve questions", keyword map §5.1
  rule 1); no DS avoid-words ("genuinely"); en-IN spelling ("memorised" is gone with the rewrite); no unsourced
  claims ("the oldest learning technology in the world", "when a child's brain grows fastest": cut, see
  [source verification C05](../../research/source-verification.md#c05--the-early-years-and-brain-connections)).
- **Photos:** one DS child per rewritten guide (Kabir, Tara with Meera, Myra), each once on the page
  ([DS 10-pages.md:67](../../design-system/overview.md#imagery); the task's "each DS child at most once"). The
  18 other cards are text only. No author names on cards: two live bylines name a person removed from the
  site at the founder's request ([facts, team](../../product/facts.md#company-facts-the-site-uses-as-proof)).
- **Read times** are derived from the words at build (`readingMinutes`, `src/lib/stories.ts:184-186`); the
  numbers above are the estimates from this copy (about 690, 925 and 800 words).

---

## Fold 6 · Close (journal close block)

**Fold job:** give the parent who came to read a calm, one-tap way to the toy, with the price beside the button.

**Copy:**

> **H2:** A toy that asks back.
>
> Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.
>
> **[Pre-order Kheelu]** → `https://store.kheelona.com` (mockup `store.html`), same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu` (`meet-kheelu.html`)

- **H2 accent:** `Hand` on "asks back."
- **CTA:** `Button cta l block`, `cta` = `finale` (existing value: every page's FinaleCTA,
  [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser)).
- **Trust micro-line links:** delivery → `/shipping` (`shipping.html`); returns → `/refund` (`refund.html`), as on Home.
- **Help line:** WhatsApp `https://wa.me/919187546483`, call `tel:+919187546483`; inline, never a floating bubble.
- **Image (optional, on wider screens beside the block):** `kheelu-front.webp`. Alt: "Kheelu by Kheelona: the
  cream plush rabbit with rainbow ears and a speaker in its tummy." Product only, no child, so the per-page
  child rule holds.
- **Full mode** (after the first 500 units): the price sentence becomes "₹7,999`{price-source}` (incl. GST), paid in
  full when you order." Nothing else changes ([home, CTA block](home.md#cta-block)).

## Phone sticky bar

Same props as Home ([home, phone sticky bar](home.md#phone-sticky-bar)): price **₹499`{price-source}` today** · note
**refundable · ₹4,999`{price-source}` total (incl. GST)** · cta **Pre-order Kheelu**, `cta` = `sticky-bar`. Appears once
the intro scrolls away; steps aside while the close's button is on screen, so a phone view never shows two
Chilli buttons ([strategy §3.3-3.4](../strategy.md#33-placement-and-repetition)).

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary near the start | Yes | 43 characters, "Parenting guides" first |
| Meta ≤ 155 with the primary and a concrete fact | Yes | 128 characters; the age band and the four topics |
| One H1 carrying the primary | Partly with A, yes with B | A: "Guides for parents" (the eyebrow directly above reads "Parenting guides"); B carries it exactly |
| Primary in the first ~100 words | Yes | Eyebrow and the lede's first words ("Plain-words parenting guides") |
| One H2 per topic group | Yes | Four topic H2s |
| "3 to 7" in the first screen | Yes | H1 |
| Alt text: describe, keyword only where true | Yes | Three photo alts describe the scene; none stuffed |
| Links to every cluster owner | Partly | The 3 rewritten guides link now; the other 18 link once rewritten (build) |
| Words never placed (health terms, friend, tutor for Kheelu, brain-development toy, lessons, adapts, wake word) | Yes | "AI tutor" appears only as a live article title about tutors, never for Kheelu ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav (chrome) | Pre-order Kheelu | `navbar` | Existing |
| Phone drawer (chrome) | Pre-order Kheelu | `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |

## Placeholders

None.

## Questions for the founder (website only)

1. **"Rewritten in the build" on 18 cards.** (a) Show the label (as drafted), so the Gate A review shows the
   full list honestly; (b) hide the 18 cards in the mockup. **Recommend (a).** Not a launch question: at
   launch every card links.

## Sources

| Claim or element | Source |
|---|---|
| 21 kept guides, slugs and live titles | [url map §1b](../url-map.md#1b-journal-articles-22) (22 live); `src/lib/stories.ts:47-157`, `src/lib/stories-expansion.ts:8-554`; drop of the 2-year-old article: [D041](../../decisions/D041-gate-a-round-1.md), [strategy §4.1](../strategy.md#41-keep-merge-drop-gate-a-g8-with-g5) |
| One-line summaries (rewritten from the live descriptions) | `src/lib/stories.ts:51-52, 77-78, 101-102, 125-126`; `src/lib/stories-expansion.ts:12-13, 46-47, 70-71, 94-95, 118-119, 141-142, 167-168, 190-191, 221-222, 255-256, 284-285, 309-310, 344-345, 379-380, 445-446, 485-486, 526-527`; the three rewritten guides' own copy ([learning toys](story-learning-toys-for-a-three-year-old.md), [safe AI toy](story-what-to-look-for-in-a-safe-ai-toy.md), [late talker](story-talking-toys-and-late-talkers.md)) |
| "WHO, IAP and AAP" in the screen-time summaries | [source verification](../../research/source-verification.md) C31, C32, C33 (the guides cite them) |
| Screen-time lead, "what the guidelines say" (task 7.1b) | Guide 1 gives the WHO, IAP and AAP guidance age by age ([how much screen time](story-how-much-screen-time-for-a-3-to-6-year-old.md), at a glance and folds 2 to 5; [source verification](../../research/source-verification.md) C31, C32, C33); wording: [CMO built review A](../../qa/cmo-review-built-a-2026-10-14.md) M5, [B](../../qa/cmo-review-built-b-2026-10-14.md) m1 |
| "Serve and return ... between a young child and a caring adult" | [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) (Harvard row, keeping "a caring adult"); excerpt `raw/research/sources/C07-harvard-serve-and-return.md:23-24` |
| Topic groups | [strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline) (/stories row); live themes `src/lib/stories*.ts` (`theme` fields) |
| "Written by the Kheelona team in Bengaluru" | [claims §3.1](../../product/claims.md#31-origin-designed-and-built-here) ("a small team in Bengaluru", EXTERNAL) |
| Close: screen-free plush toy, ages 3 to 7, answers then asks a question back | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Price sentence, delivery, returns, help line, full mode | [home, CTA block](home.md#cta-block) sources: [D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md) (option d), [pricing](../../product/pricing.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md) |
| CTA label and cta values | [D041](../../decisions/D041-gate-a-round-1.md) (G1); [tracking inventory §6](../tracking-inventory.md#6-posthog-in-the-browser) |
| Photos and alts | DS `03-cast.md:105, 118, 125` (photo table); files checked by eye 2026-10-11; alt pattern `01-writing.md:111-113` |

## Changes after approval (task 7.1b)

Gate A approved this page ([D046](../../decisions/D046-gate-a-approved.md)). Two built-page reviews of 2026-10-14
found one stale line, and task 7.1b changed it that day. No other word in the Copy blocks changed, and the change
adds no new claim.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 2, the screen-time lead under the H2 | "How much, which rules hold up, and what to do when the screen goes off." becomes "How much, what the guidelines say, and what to do when the screen goes off." | [CMO built review A](../../qa/cmo-review-built-a-2026-10-14.md) M5 and [B](../../qa/cmo-review-built-b-2026-10-14.md) m1: "which rules hold up" was the 3-6-9-12 guide's job, and [D053](../../decisions/D053-remove-the-3-6-9-12-article.md) took that guide off the journal. Its old URL now lands on this line (308 to `/stories#screen-time`), so the line promised a guide that is gone. The new words are the reviews' own. Guide 1 keeps the promise: it gives the WHO, IAP and AAP guidance age by age ([how much screen time](story-how-much-screen-time-for-a-3-to-6-year-old.md); C31, C32, C33) |
| 2 | Notes | A note under the fold 2 lead; a sources-table row for the lead; front matter (`updated`, sources) | So the page stays true |

**Not changed:** title (43 characters), meta (128 characters), H1, lede, topic chips, every card title and
summary, the close, the sticky bar, the keyword placements (no placement uses this lead), the founder question.
The fold 2 lead is 15 words, as before.

**For the builder and the main session (not this page's edits):**

- `src/content/en-IN/stories/topics.ts:18` takes the new lead word for word. It feeds both the hub's fold 2 and
  Home's fold 7b screen-time card (`src/content/en-IN/pages/home.ts:350`).
- The approved mockups keep the old line and stay frozen: `mockup/pages/stories.html:34` (hub) and
  `mockup/pages/home.html:315` (Home card). That makes this a text-parity deviation on both routes. Review B
  suggests extending V9 ([deviations](../../qa/deviations.md)) and adding the sentence to
  `src/content/en-IN/stories/parity-deviations.test.ts`. Home needs a matching rule. The main session decides.
- `llms.txt` prints this lead (`test/machine-files.test.ts:438`), so its hash changes. The main session re-pins it at the merge.
- Storybook fixtures repeat the old line (`TopicSection.stories.tsx:16`, `CardGrid.stories.tsx:32`,
  `Card.stories.tsx:52`). They are not site text, but updating them keeps one wording.
- The founder signs this copy change at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).
