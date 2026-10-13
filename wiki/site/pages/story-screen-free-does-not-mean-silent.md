---
title: "Story: Screen-free does not mean silent (/stories/screen-free-does-not-mean-silent): page copy, task 5.17 draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.3 one in-text product link, §5 /stories/* row)
  - ../../engineering/tasks.md (wave 5 part C paragraph; task 5.17 row; the note on the 18 articles without a mockup)
  - ../pages/story-learning-toys-for-a-three-year-old.md (approved format, the "wait, not perform" rule, the age lines, the close)
  - ../pages/stories.md (fold 2 card 6: title and summary, kept word for word; fold 6 close)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../content-boundary.md
  - ../../research/keyword-map.md (§2.1 BUY-6, §2.2 CMP-5, §2.4 GFT-4, §4.2, §5.1, §5.2, §6.7 SF1, SB1, ST4)
  - ../../research/source-verification.md (§3.3 C07; §4 C07; §5)
  - "../../raw/research/sources/C07-harvard-serve-and-return.md"
  - ../../product/claims.md (§1, §4, §8), ../../product/facts.md (identity, age, modes and connectivity)
  - ../../brand/voice.md, ../../brand/messaging.md (CMO S6 on "asks a question back")
  - ../../decisions/D013, D015, D016, D017, D025, D026, D027, D041
  - "src/content/en-IN/stories/articles/screen-free-does-not-mean-silent.ts (stub: card, related, dates), read in the w5c-5.17 worktree 2026-10-14"
  - "src/lib/stories.ts:74-97 (the live article, legacy input only), read in the same worktree"
  - design-system/project/01-writing.md:19-26,111-113; 03-cast.md:102 (read-only)
---

# Story: Screen-free does not mean silent

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for the CMO review (task 5.17 copy stage) and
> the founder's sign-off on beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` is a source marker under [D026](../../decisions/D026-public-statistics.md): it links to its note in the
  "Sources" list at the foot of the article. Lines without a marker are plain advice in our own voice and make no
  research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL. There is no mockup for this article: it renders through the article template, and its
  visual acceptance is template parity with `story-learning-toys-for-a-three-year-old.html`
  ([tasks, wave 5 note](../../engineering/tasks.md)).
- Each fold names the template block it maps to (`Article` in `src/content/types.ts`).

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/screen-free-does-not-mean-silent` |
| Page job | Win "screen-free toys" for parents of 3 to 7 year olds: what counts, how to choose, a story box or a toy that talks back, and what a home full of talk looks like (the hub card's promise); route to the product page once, calmly ([strategy §5](../strategy.md#5-each-page-purpose-primary-cluster-outline)) |
| Primary cluster | **screen-free toys** (BUY-6; KP no data, 2026-09-05); secondaries "story box or a toy that talks back" (CMP-5), "screen-free gifts" (GFT-4) ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (51 characters) | Screen-free toys for a home full of talk · Kheelona |
| Meta description (149 characters) | Screen-free toys for 3 to 7 year olds: which ones get a child talking, a story box or a toy that talks back, and what a home full of talk looks like. |
| H1 | Screen-free does not mean silent: a guide to screen-free toys |
| Card (hub, unchanged) | Title "Screen-free does not mean silent"; summary "What a childhood full of talk looks like, without a single screen." ([stories §2](stories.md#fold-2--screen-time-screen-time), card 6) |
| Byline line | The Kheelona team · First published 28 Jul 2026 · 3 min read |
| Dates | `published` 2026-07-28 (live, unchanged); `updated` 2026-10-13, the rewrite's date (main-session ruling at the wave 5 part C merge, as task 5.6 set it for the three approved guides) |
| Related (unchanged) | `learning-toys-for-a-three-year-old`, `how-much-screen-time-for-a-3-to-6-year-old`, `screen-time-and-tantrums` |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 8 ("Kheelu" → `/products/kheelu`) |
| Template settings | `close: "journal"` (pre-order close and sticky bar); breadcrumb topic "Screen time" (`/stories#screen-time`) |

**Title.** The keyword map's draft, "Screen-free toys that still talk with your child · Kheelona" (59), promises a page
about toys that talk; this page covers every kind of screen-free toy and names talking toys as one. "Screen-free toys
for a home full of talk" keeps the primary first and the hub card's idea ([keyword map §5.2](../../research/keyword-map.md#52-per-page):
the Copywriter owns the words).

**What changed from the live article** (`src/lib/stories.ts:74-97`): the answer comes first; "Parents worry that
screen-free means a quieter, duller childhood" (a claim about parents, `:90`) becomes "You may worry"; "Language grows
when children speak" (`:90`, a language statement with no source, [D025](../../decisions/D025-speech-and-language.md)) is
replaced by Harvard's serve-and-return line, marked ([source verification C07](../../research/source-verification.md#c07--serve-and-return));
"A toy that beeps and plays jingles is a screen without the picture" (`:92`) is cut: it is unsourced, and Kheelu's own
Story mode plays jingles; "Boredom is where imagination clocks in for work" (`:93`) becomes advice; the pitch "a
screen-free friend that listens first and talks back … pre-orders are open, and a refundable ₹499 holds your place"
(`:95`: a price with no total, against [D028](../../decisions/D028-price-wording.md), and no age line) becomes one product
line inside the story-box fold, with the age limits; the live byline names a person removed from the site
([facts, company](../../product/facts.md#company-facts-the-site-uses-as-proof)), so it becomes "The Kheelona team".

---

## Fold 1 · Article head (`head`)

**Fold job:** say what the page gives, in the first phone screen, with the hub card's words.

**Copy:**

> **Breadcrumb:** Stories › Screen time
>
> **H1:** Screen-free does not mean silent: a guide to screen-free toys
>
> What a childhood full of talk looks like, without a single screen, and how to choose screen-free toys that add to it.
>
> The Kheelona team · First published 28 Jul 2026 · 3 min read

- **H1 accent:** `Hand` on "does not mean silent" (`Screen-free {hand:does not mean silent}: …`).
- **H1:** the hub card's title word for word, then the primary (the gentle-way page, question 2, covers the pattern).
- **Lead:** the hub card's summary, word for word, extended by one clause, as the learning-toys guide extends its own.
- Breadcrumb links: "Stories" → `/stories`; "Screen time" → `/stories#screen-time`.
- **Read time:** about 650 words in the article body.
- **Image** (`head.image`, `kh-photo`, 4:5): `myra-01-breakfast-why-web.webp`. Alt: "A little girl in a mustard frock
  kneels on her chair at the breakfast table, hands open mid-question, talking to Kheelu beside her steel plate." The DS
  photo for the age-3 "why" moment (`03-cast.md:102`): a talking breakfast table with no screen in sight. It shows
  Kheelu, on the one guide whose topic is screen-free toys (question 1). File checked by eye 2026-10-14.

---

## Fold 2 · The answer first (`answer`)

**Fold job:** answer "what are screen-free toys?" in 40 to 60 words, useful to any parent, with no product in it.

**Copy:**

> **H2:** What are screen-free toys?
>
> Toys that keep a child busy without a display: blocks, puzzles, crayons and dough, pretend-play sets, picture books, puppets, and audio or talking toys. The best ones give your child something to do or say, not just something to watch. A simple test in the shop: will this toy wait for my child, or perform at them?

- Answer: 57 words. `answer.question` is the H2 (the SF1 question), `answer.answer` the paragraph.
- SF1's draft named Kheelu inside the answer; here the answer stays generic, as on the safe-AI-toy guide, and the
  product comes once, in fold 8. The test repeats the learning-toys guide's rule ("toys that wait for your child over
  toys that perform at them"), so the journal says it one way.

---

## Fold 3 · The scene (`part`, untitled)

**Copy:**

> Take the tablet away and the first thing you notice is the noise. Not the TV kind. The good kind: questions, made-up songs, a running commentary on the ants.
>
> You may worry that screen-free means a quieter, duller childhood. It doesn't have to. A screen mostly asks a child to watch. Play asks them to do things, and talk asks them to answer.

- An untitled `part`. Our own voice; no research claim, no claim about what parents in general think.

---

## Fold 4 · What a childhood full of talk looks like (`part` with a `list`)

**Fold job:** deliver the hub card's promise: the habits, with the one research line behind them.

**Copy:**

> **H2:** What does a childhood full of talk look like?
>
> It sounds like turns: your child says something, you answer, they answer back.
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.¹
>
> At home, that comes from small habits, not a curriculum:
>
> - Say what you're doing while you cook: "Onions first. Now the tomatoes. Smell that?"
> - Ask questions with no wrong answer: "What would the cat say if it could talk?"
> - Let the silly voice read the bedtime story.
> - Now and then, answer a question with a question: "Why do you think the moon follows the car?"
> - Leave gaps in songs for your child to fill.

- The research paragraph is C07's verified line, verbatim, keeping "a caring adult". It credits conversation with an
  adult, never a toy, and no product appears in this fold or the next three ([D016](../../decisions/D016-brain-wording.md);
  [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors)).
- `list`, `tips` with DS icons (for example `chat-circle-dots`, `question`, `book-open`, `music-notes`, as on the
  late-talker guide), or `bullets`: the builder's pick. Every item is a habit, not an outcome
  ([D025](../../decisions/D025-speech-and-language.md): no language outcome is promised for anything, the product included).

---

## Fold 5 · Leave room for boredom (`part`)

**Copy:**

> **H2:** Leave room for boredom
>
> When your child says "I'm bored", wait a few minutes before you fix it. The floor may become lava. The sofa may become a ship.
>
> Screen-free does not mean silent, and it does not mean joyless. Often it means the sound in your home is your child thinking out loud.

- Advice, then the live article's closing thought, softened with "often". No research claim.

---

## Fold 6 · How to choose screen-free toys (`part` with a `list`)

**Copy:**

> **H2:** How do you choose screen-free toys?
>
> Ask one question in the shop: what will my child do with this, and what will they say?
>
> - Blocks and boxes: they build, then tell you what it is.
> - Pretend-play sets: someone has to be the doctor, and someone has to say what's wrong with teddy.
> - Puppets: a second voice for a quiet child.
> - Picture books: read together, then let them tell it back.
> - Simple board games: "My go. Now yours."
>
> A toy that plays the same recorded sentence at every press makes noise, but it can't answer back.

- `list`, `bullets`. Advice only. The last line echoes the learning-toys guide's language fold, so the two guides agree.

---

## Fold 7 · A screen-free gift (`part`)

**Copy:**

> **H2:** Looking for a screen-free gift?
>
> Choose something your child can do, build or say, rather than watch: a box of blocks, a puppet, a book you'll read together, crayons with a roll of paper. Then play with it together, the first time at least.

- The GFT-4 secondary. No product here: the page's one product line is in fold 8.

---

## Fold 8 · Story box or a toy that talks back? (the one in-text product link) (`part`)

**Fold job:** answer the comparison plainly, leave the choice with the parent, then one honest product line with its
age limits.

**Copy:**

> **H2:** Story box or a toy that talks back?
>
> They do different jobs. A story box or audio player plays stories your child listens to. A toy that talks back holds a conversation: your child asks, it answers, then it asks a question back.
>
> Both are screen-free. Choose by what you want more of at home: listening, or talking.
>
> [Kheelu](https://kheelona.com/products/kheelu) does both. In Story mode it plays stories, poems and jingles, with no Wi-Fi needed. In AI mode it talks with your child on your home Wi-Fi: it answers your child, then asks a question back. It is made for ages 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.

- The keyword map's H2 for this URL (§5.2) and its SB1 answer, with the categories named generically (no brand of
  story player, [messaging, words to stop using](../../brand/messaging.md#words-to-stop-using)).
- Link target `/products/kheelu` (the page's one in-text product link, [strategy §3.3](../strategy.md#33-placement-and-repetition)).
- **Story mode** is D027's description ("stories, poems and jingles", "No WiFi needed", spelled "Wi-Fi" per the DS).
  **Asking back belongs to AI mode only**, in its own sentence: nothing says or implies that Kheelu asks questions
  during a story ([D027](../../decisions/D027-story-mode-wording.md)). "Answers your child, then asks a question back" is
  D017's form (CMO review S6).
- Four folds separate this product line from the fold 4 brain line ([D016](../../decisions/D016-brain-wording.md)), and
  it makes no language claim (question 2).

---

## Fold 9 · Sources (`sources`)

**Copy** (`kh-body-s`, numbered list; the URL is a link):

> **Sources**
>
> ¹ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/

- The same list becomes the BlogPosting `citation` array. Re-read the Harvard page before publishing: it shows recent
  edits ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 10 · Related guides (template, from `related`)

**Copy:**

> **H2:** Related guides
>
> - Learning toys for a 3-year-old, skill by skill
> - How much screen time is okay for a young child?
> - Screen time and tantrums: what is actually happening

| Title (card title, from each module) | Real URL |
|---|---|
| Learning toys for a 3-year-old, skill by skill | `/stories/learning-toys-for-a-three-year-old` |
| How much screen time is okay for a young child? | `/stories/how-much-screen-time-for-a-3-to-6-year-old` |
| Screen time and tantrums: what is actually happening | `/stories/screen-time-and-tantrums` |

Text links only, so the page keeps one DS child. The list is the stub's, unchanged.

---

## Fold 11 · Close (journal close block, `close: "journal"`)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block); rendered from `articlePageCopy`):

> **H2:** A toy that asks back.
>
> Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.
>
> **[Pre-order Kheelu]** → `https://store.kheelona.com`, same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu`

- `cta` = `finale`. Full mode as on Home. Nothing here is typed in the article module: the close is shared.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; appears after the head, steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 51 characters, "Screen-free toys" first |
| Meta ≤ 155: primary plus a concrete fact | Yes | 149 characters; the age band, the story-box question, the talking home |
| One H1 with the primary | Yes | "… a guide to screen-free toys" |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What are screen-free toys?" (SF1) and its 57-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 H2; fold 6 H2 "How do you choose screen-free toys?"; fold 7 H2 carries "screen-free gift" (GFT-4) |
| The §5.2 H2 ("Story box or a toy that talks back?") | Yes | Fold 8 (CMP-5) |
| Alt text: "screen-free play" only if true | Yes | The breakfast photo is described as it is; Kheelu named, no keyword forced |
| Density | Yes | "screen-free toys" 4 times in `<main>` (H1, lead, fold 2 H2, fold 6 H2): about 1.2% of about 650 words; "Kheelu" 3 times including the close and its button (0.5%) |
| ST4 "Is screen time bad for my child's speech?" | Not answered here, on purpose | A speech question needs the D025 one-line disclaimer, and a speech page carries no pitch; this page has the one product link. Question 3 |
| Words never placed | Yes | No speech or health terms, no language outcome for Kheelu, no "lessons" or interrupt-a-story line, no brand of story player, no price in the body |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |
| In-text link to the product page | text link | none (not a button) | n/a |

## Placeholders

None.

## Questions for the founder (website only)

1. **Head photo with Kheelu.** (a) Myra at breakfast, talking to Kheelu (as drafted: this guide's topic is screen-free
   toys, and the product is named once in the body); (b) a photo without Kheelu, as the other screen-time guides use
   (the two unused no-Kheelu photos already head the gentle-way and busy-hands guides, so this would repeat a photo from
   another guide). **Recommend (a).**
2. **Is this a "language page"?** Fold 4 cites Harvard on language and social skills. (a) No: it is a screen-free toys
   guide in the Screen time topic; keep the one product link, four folds from the research line, with no language claim
   and no D025 line (as drafted); (b) treat it as a language page: add the D025 one-line disclaimer and drop the product
   link. **Recommend (a)**: the page discusses talk at home, not speech delay, which is where D025 asks for the
   disclaimer, and the product line describes the modes only.
3. **Where ST4 lives (for the main session).** The keyword map assigns "Is screen time bad for my child's speech?" to
   this URL. (a) Leave it unanswered here (as drafted) and offer it to a talking-and-language guide (task 5.18, for
   example `a-toy-that-talks-vs-a-toy-that-listens`), with the D025 disclaimer and no pitch; (b) answer it here, which
   needs the D025 line and turns this into a page with no product link. **Recommend (a).**

## Sources

| Claim | Source |
|---|---|
| Harvard serve-and-return line, verbatim, with "a caring adult" | [source verification C07](../../research/source-verification.md#c07--serve-and-return) (SUPPORTED-WITH-REWORDING, EXTERNAL); excerpt `raw/research/sources/C07-harvard-serve-and-return.md:22-28, 36-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| Kheelu: screen-free plush toy, ages 3 to 7 | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age) |
| Story mode: stories, poems and jingles, no Wi-Fi needed | [D027](../../decisions/D027-story-mode-wording.md); [facts, modes](../../product/facts.md#modes-and-connectivity); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| AI mode: open conversation on home Wi-Fi; answers, then asks a question back | [facts, modes](../../product/facts.md#modes-and-connectivity); [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| "Kheelu does both" (story box and a toy that talks back) | [keyword map §6.7](../../research/keyword-map.md#67-screen-time) SB1, built only from the two rows above |
| Not a toy for children under 3 | [facts, age](../../product/facts.md#age); [content boundary](../content-boundary.md); as on the [learning-toys guide](story-learning-toys-for-a-three-year-old.md#fold-12--where-kheelu-fits-the-one-in-text-product-link) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3" row) |
| Habits, the toy test, the gift advice | Plain advice in our voice (no research claim); the "wait, not perform" rule is the [learning-toys guide](story-learning-toys-for-a-three-year-old.md#fold-11--a-short-rule)'s |
| Card title and summary, related list, dates | `src/content/en-IN/stories/articles/screen-free-does-not-mean-silent.ts` (stub); [stories §2](stories.md#fold-2--screen-time-screen-time) card 6; live dates `src/lib/stories.ts:81-82` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block) and [phone sticky bar](home.md#phone-sticky-bar) sources ([D028](../../decisions/D028-price-wording.md), [D041](../../decisions/D041-gate-a-round-1.md), [D023](../../decisions/D023-new-order-delivery.md), [D021](../../decisions/D021-returns-policy.md), [D032](../../decisions/D032-grievance-block-and-call-line.md)) |
| Cut live lines | `src/lib/stories.ts:90, 92, 93, 95` (a claim about parents, an unsourced language line, a line that contradicts Story mode, a price with no total) |
| Byline | Live author removed from the site: [facts, company](../../product/facts.md#company-facts-the-site-uses-as-proof) |
| Photo | DS `03-cast.md:102` (Myra 01, "Age-3 'why' messages"); file checked by eye 2026-10-14 |
