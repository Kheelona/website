---
title: "Story: The hard questions parents ask about AI toys (/stories/questions-parents-ask-about-ai-toys): page copy, Phase 5 draft (task 5.19)"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../gate-a-open-items.md (B3 Common Sense Media, B15 source markers, B28 journal photos)
  - ../pages/stories.md (fold 4 card, word for word; fold 6 journal close)
  - ../pages/story-what-to-look-for-in-a-safe-ai-toy.md (the AI-safety model: B3 answer, fact wording, link back)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§4.2 LRN-16, §4.3 high-risk overlap, §5.1, §5.2, §6.5 AI3)
  - ../../research/source-verification.md (§4: C16, C11 house line; §3.5)
  - "../../raw/research/sources/: C16-common-sense-press-release-2026-01-22.md, C16-common-sense-ai-toys-risk-assessment.md, C11-xu-2021-computers-and-education.md"
  - ../../product/claims.md (§1, §2, §3, §4, §4.1 row 15, §7), ../../product/facts.md, ../../product/age-band-review.md (§4)
  - ../../brand/messaging.md (confirmed candidate lines; objection answers), ../../brand/voice.md
  - ../../decisions/D016, D017, D018, D019, D020, D026, D027, D035, D036, D038, D041
  - "src/lib/stories-expansion.ts:482-515 (the live article; input only); src/content/en-IN/stories/articles/questions-parents-ask-about-ai-toys.ts (stub: card, related, dates); src/content/en-IN/policies.ts:49 (RETENTION_LINE); src/content/en-IN/products/kheelu/product.ts:65-85 (modes, languages); src/content/en-IN/seller.ts:95"
  - test/guards/banned-phrases.data.ts (every Copy block checked against it)
  - design-system/project/03-cast.md:15, 119; 01-writing.md:111-113 (read-only)
  - ../../qa/cmo-review-articles-5.19-2026-10-14.md (round 1: M9, M11 fixed in round 2; M8 held, question 5)
---

# Story: The hard questions parents ask about AI toys

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. Draft for the CMO review of task 5.19 and the founder's sign-off on
> beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` and `²` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL, then the mockup file in brackets. **This article has no mockup:** visual acceptance
  is template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts
  ([tasks, wave 5](../../engineering/tasks.md)); every fold below maps to a block of the `Article` shape
  (`src/content/types.ts`) that `ArticleTemplate` renders.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/questions-parents-ask-about-ai-toys` (no mockup; the hub links it from `stories.html#ai-and-safety`) |
| Page job | Answer the questions a parent of a 3 to 7 year old asks before a talking toy comes home, led by "does it record my child?", straight and in the maker's own voice: what to ask any maker first, then how Kheelu answers, the hardest question included. Route to the product page once |
| Primary cluster | **does an AI toy record your child** (LRN-16); secondaries "is it always listening", "what happens to the data" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (59 characters) | Does an AI toy record your child? Hard questions · Kheelona |
| Meta description (145 characters) | Does an AI toy record your child? Kheelu only listens when someone presses its wake-up button. The hard questions parents ask, answered straight. |
| H1 | The hard questions parents ask about AI toys (the hub card title, word for word; question 1) |
| Byline line | Aman Soni · First published 11 Sep 2026 · 4 min read (byline: question 2) |
| Read time | 4 min (about 890 words in the article, headings included, close excluded; words ÷ 200, rounded, as `readingMinutes` in `src/lib/stories.ts:184-186` and the 5.6 pages) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 4 ("Kheelu" → `/products/kheelu`, `meet-kheelu.html`) |
| Module values kept from the stub | Card title and summary (hub copy, `stories.md` fold 4); `related` (three, below); `published` 2026-09-11; `updated` as the main session's note for task 5.19 directs (the 5.6 modules set it to the rewrite's date) |
| Page settings | Template parity; `close: "journal"`, so the shell shows the phone buy bar; `active: "stories"`, chrome on |

**Overlap** ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags), high risk
with `/safety`, the buyer's guide and the safe-AI-toy article). This page owns "does an AI toy record your child"
and the parent's own questions in the first person; it carries no checklist frame, never the "five checks"
(the buyer's guide owns them), and links to the safe-AI-toy article for what child-safety groups found. The phrase
"are AI toys safe" (`/safety`'s primary) appears nowhere in its title, meta or headings.

**What changed from the live article** (`src/lib/stories-expansion.ts:482-515`, input only):
"A toy that wakes to a word is not listening between wakes" (retired, [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)
row 15) replaced by D018's FAQ wording; "Not in our experience of watching children with prototypes" (a pilot
claim with no data, [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish)) cut; "Kheelu keeps
talking whether or not you renew" and the "lifetime" line (F7, NOT CONFIRMED; [D041](../../decisions/D041-gate-a-round-1.md)
asks for no after-6-months lines) cut with their question; the shutdown, shared-profiles and business-model
questions cut (no confirmed answer: question 4); "A talking toy adds turns to the hours when you cannot be in the
room" cut (reads as unsupervised use; a grown-up nearby at 3, D041); "The research on early language points at
conversational turns with people" cut (unsourced); "Honestly, you cannot verify this" reworded (DS `01-writing.md`
avoids "honestly"); "twelve questions" dropped (no counts, [keyword map §5.1](../../research/keyword-map.md#5-placement-rules)
rule 1); the hardest question (Common Sense Media's advice) added up front with the B3 answer; the live sources
(Romeo, Fairplay's old URL, an Indian Kanoon mirror of the DPDP Act) replaced by the two Common Sense Media pages
the text now cites (the data law is owned by [its own article](story-ai-toys-and-indias-data-law.md)).

---

## Fold 1 · Article head

**Fold job:** say what the page answers, and who is answering, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › AI toys and safety
>
> **H1:** The hard questions parents ask about AI toys
>
> The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones.
>
> Aman Soni · First published 11 Sep 2026 · 4 min read

- **H1 accent:** `Hand` on "hard questions" (`{hand:hard questions}`).
- H1 and lead are the hub card's title and summary, word for word (`stories.md` fold 4; the stub module).
- Breadcrumb: "Stories" → `/stories` (`stories.html`); "AI toys and safety" → `/stories#ai-and-safety`
  (from `hub.ts` and `topics.ts`, never typed).
- **Image** (`kh-photo`, the head's portrait layout, the page's LCP image): `tara-03-bedtime-with-baba-web.webp`.
  Alt: "A father in glasses laughs as he reads a picture book aloud at bedtime, while his daughter, tucked in under a
  patchwork quilt, hugs Kheelu and smiles up at him." (`03-cast.md:119`: "Bedtime stories, the father's view"; checked
  by eye 2026-10-14; no name or age in the alt, as the 5.6 pages; the light on Kheelu is not described, D018.) No
  imagination layer: a safety page (DS `02-imagery.md`).
- **Crop (builder):** the master is 9:16, so the head treats it as a portrait and shows it in the DS 4:5 frame. A
  centred 4:5 crop of the web file (837 × 1500) keeps rows 227 to 1273, which holds the father's head, both faces and
  Kheelu whole and off the edge, as the DS asks (`03-cast.md`, "Crop freely, but keep faces and Kheelu whole and off
  the edge"). If the builder's crop cuts either, pin the focal point rather than change the photo.
- **Round 2 (CMO M11, "consider"):** the round-1 photo, `advik-02-whispering-to-kheelu`, is already the photo of
  /safety, Home, Meet Kheelu and /setup, so a parent arriving from /safety would see it again. `tara-03` is used on no
  page yet, and it puts a grown-up in frame on a page that asks for one nearby at 3 and says no toy replaces the
  people who talk with your child. The 4:5 alternative with no crop is `tara-01-naming-feelings` (also unused; Tara
  alone with Kheelu).

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, honestly, with the mechanism.

**Copy:**

> **H2:** Does an AI toy record your child?
>
> Any AI toy has to capture your child's voice to answer, so yes, while it is listening. What matters is when it listens and what is kept. Kheelu's microphone turns on only when someone presses the wake-up button, and switches itself off after about a minute of quiet. You can read every conversation in the parent app.

- 57 words. The `answer` block (`question`, `answer`); no `detail`.
- "Yes, while it is listening" is the plain answer to the search: conversations ARE kept for parents
  ([D018](../../decisions/D018-wake-up-button.md): never "nothing is ever recorded"). The microphone clause is
  D018's mechanism; "read every conversation" is [D017](../../decisions/D017-live-behaviour-claims-confirmed.md).
- No training line, and nothing that implies there is none ([D035](../../decisions/D035-model-training-opt-out.md)).

---

## Fold 3 · Who is answering (no heading)

**Fold job:** declare the interest before the answers, and say how each answer is built.

**Copy:**

> We make Kheelu, a screen-free plush toy for children aged 3 to 7, so read every answer below as coming from an interested party. Each one says what to ask any maker first, then how Kheelu answers. We start with the question that is hardest for us.

- An `ArticlePart` with no title (as fold 3 of the late-talker page).

---

## Fold 4 · The hardest question (the one in-text product link)

**Fold job:** put the child-safety advice that covers Kheelu's whole age band first, cited in full, with the signed
B3 answer, before any reassurance.

**Copy:**

> **H2:** Should a young child have an AI toy at all?
>
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.¹
>
> Kheelu is made for children aged 3 to 7. Common Sense Media's advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us.
>
> The answers below show how we built [Kheelu](https://kheelona.com/products/kheelu) on each worry, so you can check it yourself and decide. If your child is 3, keep a grown-up nearby while they play.
>
> What child-safety groups found, worry by worry, is in [What to look for in a safe AI toy](https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy).

- Paragraph 1 is the verified C16 line, first sentence, verbatim. Never "found" a result at 3 to 5; never name
  the toys tested ([source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys)).
- Paragraph 2 is the **B3 answer's first three sentences, word for word** (safe-AI-toy page fold 5). Its fourth
  sentence ("Here is how we built Kheelu on each point above") cannot stand here, because the answers come after
  it; paragraph 3 says the same thing pointing down (question 3).
- Links: `/products/kheelu` → `meet-kheelu.html` (the page's one product link,
  [strategy §3.3](../strategy.md#33-placement-and-repetition)); `/stories/what-to-look-for-in-a-safe-ai-toy` →
  `story-what-to-look-for-in-a-safe-ai-toy.html`.

---

## Fold 5 · Listening and your child's voice

**Fold job:** own the primary cluster: when it listens, where the voice goes, what is kept, how you can tell.

**Copy:**

> **H2:** Listening and your child's voice
>
> **Is it always listening?**
> Ask what turns the microphone on, what turns it off, and how you can tell. A toy that waits to hear its name has to listen all the time to catch it.
>
> Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after about a minute of quiet. Until the next press, nothing is heard, recorded or sent.
>
> **Where does my child's voice go, and what is kept?**
> Ask who processes your child's voice and in which country, what is kept and for how long, and whether any of it is sold. A vague answer is an answer.
>
> To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> We don't sell your data. Your child's data is never used to advertise to them. Everything we collect, and what we use it for, is in our [privacy policy](https://kheelona.com/privacy).
>
> **How can I tell when it is listening?**
> You can't check a microphone from the sofa. So prefer a sign you can see over a promise you have to trust.
>
> A light on Kheelu shows whenever it's listening. It switches its microphone off after about a minute of quiet, so even if it's left in a corner, it doesn't stay listening.

- A `questions` block: three items, each question an `h3`, each answer two to four paragraphs (the first: what to
  ask any maker; then Kheelu's answer). All items open: they are read, not hunted.
- **Round 2 (CMO M9):** the second item's last answer paragraph is split after "in one tap.", so retention is one
  paragraph and the no-sale, advertising and privacy sentences another: two or three sentences each, as the DS asks
  for phones. Same words.
- **Not changed in round 2 (CMO M8, question 5):** the parent app's "Save voice recordings" switch would be the most
  direct answer to "does it record my child", and the switch itself is confirmed for launch
  ([claims, D044 additions](../../product/claims.md#d044-additions-2026-10-11-what-the-real-app-screens-may-show)).
  But neither its default nor how long saved recordings are kept is on record, so the line waits for the founder.
- Order follows [D020](../../decisions/D020-provider-terms-and-no-sale.md): the wake-up button, the providers line,
  read and delete, no sale.
- **Wording held to the rulings:** the second paragraph is D018's FAQ draft ("Is Kheelu always listening?")
  verbatim after its "No."; the providers line is D020's, verbatim, its training clause scoped to the providers as
  [D041](../../decisions/D041-gate-a-round-1.md) keeps it; the retention sentences are `RETENTION_LINE`
  (`policies.ts:49`), never retyped; "We don't sell your data." and the advertising line are D020 and
  [D038](../../decisions/D038-trust-content-rulings.md) verbatim; the light's colour is never named (D018).
- **The privacy pointer** answers "what is kept" in full without a training line on this page: `/privacy` states
  what Kheelona collects, what it is used for (including its own model's training, opt-out) and the choices a
  parent has ([privacy copy](privacy.md), [D035](../../decisions/D035-model-training-opt-out.md)). Link:
  `/privacy` → `privacy.html`.
- "A toy that waits to hear its name": describes how any name-triggered toy works, names no product and implies
  nothing about Kheelu, which has no wake word (the guard's allowed form "no wake word" is the only use of the
  phrase).

---

## Fold 6 · What it says to your child

**Fold job:** the content worry: what stops a bad reply, and what happens when it does not know.

**Copy:**

> **H2:** What it says to your child
>
> **What if my child asks it something upsetting?**
> Listen for a mechanism, not a reassurance: how every reply is checked for your child's age, and who sets that age.
>
> Kheelu can't browse the internet. Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app. We attack our own safety layer before every release, and you can read every conversation afterwards.
>
> **What if it gets something wrong?**
> Any AI toy can get something wrong, so ask what it does when it isn't sure.
>
> When Kheelu doesn't know, it says so, instead of guessing. If an answer ever sounds odd, look it up together. That is a good conversation too.

- A `questions` block, two items.
- The closed library and the age-graded layer sit after the providers line (fold 5) and omit "on the device and
  in the cloud", so nothing suggests no outside AI model is involved
  ([claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed), D019 flag).
- "Any AI toy can get something wrong" is a general statement about toys that generate replies; it claims no
  error rate for Kheelu. No "alerts" here: their trigger is not defined and they wait on counsel's reading
  ([D036](../../decisions/D036-launch-feature-claims.md); [claims §7](../../product/claims.md#7-childrens-data-what-is-published-versus-documented)).

---

## Fold 7 · Your family and the toy

**Fold job:** the questions about the child and the home: replacing you, attachment, two languages.

**Copy:**

> **H2:** Your family and the toy
>
> **Will it replace talking with my child?**
> No. No toy replaces the people who talk with your child every day. Be wary of any toy that suggests it can.
>
> Kheelu answers your child, then asks a question back, so your child does the thinking. And after any story, from a book, a speaker or a toy, ask your child to tell it back to you.
>
> **Can my child get too attached to it?**
> Common Sense Media says AI toy companions "create emotional attachment by design".¹ It also says children aged 5 and under "cannot reliably distinguish AI from real people".² So choose a toy that says plainly what it is, and talk about it together the way you would about a character in a book.
>
> Kheelu tells your child it's a toy, and never asks them to keep a secret from you.
>
> **Does it work if we speak two languages at home?**
> If your family mixes languages mid-sentence, ask whether a toy can keep up, or needs a setting changed in an app first.
>
> Kheelu can switch languages mid-sentence. It speaks English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French, with up to 10 languages at launch.

- A `questions` block, three items.
- "No toy replaces the people who talk with your child every day" is the approved late-talker page's line (its
  fold 7); "so your child does the thinking" is the confirmed objection answer
  ([messaging, objection answers](../../brand/messaging.md#objection-answers), D017). The story line is the C11
  **house line**, used without the study (no marker), as the learning-toys page uses C10's.
- The two quotes are the verified Common Sense Media findings, as the safe-AI-toy page quotes them
  (press release findings list; risk assessment, "Where they fall short"). "Talk about it together the way you
  would about a character in a book" is the AI6 house line ([keyword map §6.3](../../research/keyword-map.md#63-safety-safety)).
- The language list renders from `product.languages` and `product.languageCeiling` (`product.ts`), never typed;
  "switches mid-sentence" is EXTERNAL ([facts, languages](../../product/facts.md#languages); D017).

---

## Fold 8 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 22 January 2026, paragraph 1 and the list of findings. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
>
> ² Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "Where they fall short". https://institute.commonsensemedia.org/risk-assessments/ai-toys

- The same list is the BlogPosting `citation` array. Re-read both Common Sense Media pages before publishing
  (the risk assessment says "Updated Jan 22, 2026";
  [source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 9 · Related guides

**Copy:**

> **H2:** Related guides
>
> - Does a three-year-old need an AI tutor?
> - Why the early years matter most
> - How children learn by talking

| Title (each guide's own card) | Real URL | Mockup link |
|---|---|---|
| Does a three-year-old need an AI tutor? | `/stories/does-a-three-year-old-need-an-ai-tutor` | `stories.html#ai-and-safety` |
| Why the early years matter most | `/stories/why-three-to-six-are-the-years-that-matter-most` | `stories.html#learning` |
| How children learn by talking | `/stories/how-children-learn-by-talking` | `stories.html#talking` |

- The stub's `related` list, unchanged; the titles render from each module's card (`relatedGuides`), never typed.

---

## Fold 10 · Close (journal close block)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block); rendered from
`articlePageCopy.close`, never retyped):

> **H2:** A toy that asks back.
>
> Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.
>
> **[Pre-order Kheelu]** → `https://store.kheelona.com` (`store.html`), same tab
>
> Reserve yours for ₹499`{price-source}` today, refundable until dispatch, then pay ₹4,500`{price-source}` before delivery: ₹4,999`{price-source}` in total (incl. GST).
>
> Deliveries start mid-November`{delivery-source}` · 7-day returns, no questions asked
>
> Questions? WhatsApp or call +91 91875 46483
>
> [See how it works] → `/products/kheelu` (`meet-kheelu.html`)

- `cta` = `finale`. Close art: plain, without the doodle, as the safe-AI-toy page (a safety guide; the slug joins
  `PLAIN_CLOSE_ART` in `stories/articles/index.ts`, a file outside this task's Owns: reported to the main session).

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; the shell's, because the close carries the button; steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 59 characters; the keyword map's own draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 145 characters; the fact is the wake-up button ([D018](../../decisions/D018-wake-up-button.md)'s alternative heading line) |
| One H1 with the primary | **Partly** | The H1 is the approved hub card title, which lacks "record" (question 1). The primary is in the title, the meta and the answer H2 |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "Does an AI toy record your child?" (exact) and its 57-word answer, about 30 words below the H1 |
| An H2 with the primary or a close variant | Yes | Fold 2 |
| Secondaries | Yes | "Is it always listening?" (fold 5 h3, exact); "what happens to the data": fold 5 h3 "Where does my child's voice go, and what is kept?" |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | The primary once in `<main>` (fold 2 H2, 6 words of about 950 with the close: 0.6%); "Kheelu" 16 times including the close and its button (about 1.7%, under the 2% flag); "it" stands in wherever the subject is clear |
| Words never placed | Yes | No wake-word line (only "no wake word"), no "safe" about Kheelu, "stays in your region", "only our own servers", "nothing is ever recorded", "no risk", training claims, "lessons", "adapts", "friend", health terms, competitor or tested-toy names, counts in the title |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (product, safe-AI article, privacy) | text links | none (not buttons) | n/a |

## Placeholders

None. (A rewritten article module may hold no open placeholder: `articles.test.ts`, "once written, holds no open
placeholder and cites its sources". Every line without a confirmed source was cut instead, and is listed in the
questions below.)

## Questions for the founder (website only)

1. **H1 or keyword (this page and the data-law page).** The keyword map wants the primary ("record") in the H1;
   the H1 drafted here is the approved hub card title. (a) Keep the card title as the H1 (as drafted): the page a
   parent lands on is titled as the link they tapped, and the title tag and the answer H2 carry "does an AI toy
   record your child"; (b) H1 "Does an AI toy record your child? The hard questions parents ask", card unchanged;
   (c) change the card and the H1 together. **Recommend (a)**: the card is approved copy, and the answer H2 sits
   about 30 words under the H1, so search engines still read the question first.
2. **Byline.** The live article is by Aman Soni. (a) Keep his name, after he reads and owns the answers;
   (b) "The Kheelona team". **Recommend (a)**, as on the safe-AI-toy page: a named co-founder behind the
   maker's answers is worth more than a team name.
3. **The Common Sense Media answer here (fold 4).** (a) The B3 answer's first three sentences verbatim, then a
   pointer down to the answers (as drafted); (b) the B3 paragraph whole, which needs the answers above it, so this
   question would move to the end of the page; (c) leave Common Sense Media to the safe-AI-toy page and link to it.
   **Recommend (a)**: the card promises "the uncomfortable ones", and this is the most uncomfortable; leading with
   it is the honest order. It follows whatever the founder decides for B3 (safe-AI-toy page, question 1).
4. **Questions cut for want of a confirmed answer.** "Does the company earn more when my child plays longer?",
   "What happens to my child's data if the company shuts down?", "Can other children use it (separate
   profiles)?", "Do I have to keep paying?" and "What if we have no internet?". (a) Leave them out (as drafted);
   (b) the founder gives a one-line confirmed answer to any of the first three, and it goes in as a question here.
   **Recommend (b) for the shutdown question** (a parent's fair question to a pre-launch company, and deletion is
   already a confirmed fact) and (a) for the rest: the subscription question is ruled out by
   [D041](../../decisions/D041-gate-a-round-1.md) ("no after-6-months lines"), and connectivity is the product
   page's FAQ.
5. **The "Save voice recordings" switch (round 2, CMO M8).** The page owns "does an AI toy record your child", and
   the parent app's switch (off keeps text only) is a confirmed launch feature (D044). The line would go after "in
   one tap.": "In the parent app, you choose whether voice recordings are saved; with it off, only the text is
   kept." It needs two answers that are on no page yet: is the switch on or off when a parent first sets up Kheelu,
   and how long are saved recordings kept (the same 36 months as conversations, or another period)? Please also say
   whether the switch has any bearing on the training of Kheelona's own model ([D035](../../decisions/D035-model-training-opt-out.md)),
   because a parent may read "off" as "not used", and this page says nothing about training. (a) Leave the line out
   (as drafted); (b) add it once you answer the two questions. **Recommend (b)**: it is the most direct honest answer
   to the page's own question, and a parent who later finds the switch in the app may feel the article ducked it.

## Sources

| Claim | Source |
|---|---|
| H1, lead (hub card, word for word); related list; published 11 Sep 2026; live byline | `stories.md` fold 4; stub module; `src/lib/stories-expansion.ts:488-490` |
| Common Sense Media advice: 5 and under, extreme caution 6 to 12, "smart toys with voice-based interactions" | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys); excerpt `C16-common-sense-press-release-2026-01-22.md:22-25`; owner [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band); cite in full: working default B3 |
| B3 answer (first three sentences) | [safe-AI-toy page](story-what-to-look-for-in-a-safe-ai-toy.md#fold-5--how-kheelu-is-built-against-each-worry-the-one-in-text-product-link), fold 5 paragraph 1 (draft for the founder's signature, its question 1) |
| "create emotional attachment by design"; "cannot reliably distinguish AI from real people" | `C16-common-sense-press-release-2026-01-22.md:28`; `C16-common-sense-ai-toys-risk-assessment.md:37-38` |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3") |
| Kheelu: screen-free plush toy, ages 3 to 7 | [facts, identity](../../product/facts.md#identity), [age](../../product/facts.md#age) |
| No wake word; wake-up button; on while your child talks; off after about a minute of quiet; nothing heard, recorded or sent until the next press; the light | [D018](../../decisions/D018-wake-up-button.md) (FAQ draft and light line, verbatim); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) |
| Providers line, verbatim | [D019](../../decisions/D019-voice-providers.md), [D020](../../decisions/D020-provider-terms-and-no-sale.md); [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines); training clause scoped to the providers: [D035](../../decisions/D035-model-training-opt-out.md), [D041](../../decisions/D041-gate-a-round-1.md) |
| Read every conversation; 36 months then deleted automatically; delete sooner in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7 (`RETENTION_LINE`, `policies.ts:49`) |
| We don't sell your data; never used to advertise to your child | [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 5; [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| The privacy policy sets out what is collected, its uses and a parent's choices | [privacy copy](privacy.md) (page job; section 3, Kheelona's own model); [D035](../../decisions/D035-model-training-opt-out.md) |
| Can't browse the internet; curated, closed content library; age-graded safety layer set to the age a parent enters | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md), [D036](../../decisions/D036-launch-feature-claims.md) items 5-6; [claims §1-§2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) |
| "We attack our own safety layer before every release" | [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (D017); red-teamed before launch, [D036](../../decisions/D036-launch-feature-claims.md) item 7 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) item 3 |
| Answers, then asks a question back; "so your child does the thinking" | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [messaging, objection answers](../../brand/messaging.md#objection-answers) ("Won't AI make my child think less?") |
| "No toy replaces the people who talk with your child every day" | [late-talker page](story-talking-toys-and-late-talkers.md#fold-7--two-myths), fold 7 (approved) |
| "After any story ... ask your child to tell it back to you" | [source verification C11](../../research/source-verification.md#c11--an-adult-still-draws-out-more-words-ages-3-to-6) house line (no marker, no study) |
| Says it's a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| "Talk about it together the way you would about a character in a book" | [keyword map §6.3](../../research/keyword-map.md#63-safety-safety) AI6 (house line) |
| Eight named languages, up to 10 at launch; switches mid-sentence | [facts, languages](../../product/facts.md#languages); `product.ts:72-85` |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block), [phone sticky bar](home.md#phone-sticky-bar) |
| Cut live lines | [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 15; [claims §3](../../product/claims.md#3-not-confirmed-do-not-publish) (F7; pilot claims); [D041](../../decisions/D041-gate-a-round-1.md) (Kheelona+ after 6 months; age 3) |
| Photo | DS `03-cast.md:15, 119` (Tara 03, with her father, Arnab); file checked by eye 2026-10-14; unused elsewhere on the site (grep of `wiki/site/pages` and `src/`, 2026-10-14) |

## Changes after approval (task 5.20c)

- **No Copy block changed.** The CMO's round 2 left this page one open minor, M8, and it needs the founder's answer
  ([CMO review, round 2 verdict](../../qa/cmo-review-articles-5.19-2026-10-14.md#round-2-verdict)). The module needs
  no change.
- **Checked, already done in round 2 (no change):** M9 (fold 5, the answer split after "in one tap.") and M11 (the
  head photo is `tara-03`, with its alt).
- **Left as they are, waiting on the founder (open question P22):** the "Save voice recordings" line (M8; question
  5: its setting at first setup, how long saved recordings are kept, and whether the switch bears on training,
  D035), and the shutdown question with the other cut questions (question 4). No recording, shutdown or training
  line was added. The B3 short form in fold 4 follows whatever the founder signs for B3 (open question P21;
  question 3).
- **Head photo, checked again for task 5.20's photo pools:** `tara-03` stays. It heads no other guide and is used
  nowhere else on the site, so it keeps its one alt; it is in no task's pool; and it puts a grown-up in frame, which
  this page needs (it advises a grown-up nearby at 3) and none of the AI guides' pool photos has. The CMO keeps it, with the bedtime
  glow noted for the founder at Gate B ([CMO review, for the founder's eye](../../qa/cmo-review-articles-5.19-2026-10-14.md#for-the-founders-eye-at-gate-b-no-change-asked)).
  D025: none needed (the main session's ruling at the wave 5 part C merge, R2-3).
