---
title: "Story: What India's data law asks of a toy that listens (/stories/ai-toys-and-indias-data-law): page copy, Phase 5 draft (task 5.19)"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../../decisions/D053-remove-the-3-6-9-12-article.md (task 6.5: the related list, fold 11)
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../gate-a-open-items.md (B15 source markers, B28 journal photos)
  - ../pages/stories.md (fold 4 card, word for word; fold 6 journal close)
  - ../pages/story-what-to-look-for-in-a-safe-ai-toy.md (links here from its fold 4; fact wording)
  - ../pages/privacy.md (what the privacy policy covers: training, consent, choices; its open items)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§4.1 /privacy row, §4.2 LRN-17, §5.1, §5.2, §6.5 DP1)
  - ../../research/source-verification.md (§3.7 and §4: C20; §7)
  - "../../raw/research/sources/: C20-dpdp-act-2023-official-text.md, C20-dpdp-commencement-gsr-843e-2025.md, C20-dpdp-rules-2025.md"
  - ../../product/claims.md (§1, §4, §7), ../../product/facts.md, ../../product/age-band-review.md (row 36)
  - ../../brand/messaging.md (confirmed candidate lines), ../../brand/voice.md
  - ../../decisions/D017, D018, D019, D020, D026, D029, D035, D038, D041
  - "src/lib/stories-expansion.ts:517-553 (the live article; input only); src/content/en-IN/stories/articles/ai-toys-and-indias-data-law.ts (stub: card, related, dates); src/content/en-IN/policies.ts:49 (RETENTION_LINE); src/content/en-IN/seller.ts:95 (help line)"
  - test/guards/banned-phrases.data.ts (every Copy block checked against it)
  - design-system/project/03-cast.md:112; 01-writing.md:111-113; assets/Photo library/ira-01-story-on-the-bed-web.webp, checked by eye (read-only)
  - ../../qa/cmo-review-articles-5.19-2026-10-14.md (round 1: M2, M3, M4, M11 fixed in round 2; M11 applied again in task 5.20c)
  - ../../engineering/tasks.md (§4.9 and 5.20, task 5.20c, copy fixes and photo pools), ../../engineering/assets.md (advik-04 and ira-01 rows)
---

# Story: What India's data law asks of a toy that listens

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. Draft for the CMO review of task 5.19 and the founder's sign-off on
> beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)). **Legal wording:** every line about the
> law goes through the founder and counsel ([D029](../../decisions/D029-grievance-officer-legal-review.md);
> [source verification C20](../../research/source-verification.md#c20--indias-data-law-and-children)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `³` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
  Every statement about the law carries one, and quotes the official text where it can. Lines without a marker
  are questions or advice in our own voice and say nothing about what the law requires.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL, then the mockup file in brackets. **This article has no mockup:** visual acceptance
  is template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts; every fold below
  maps to a block of the `Article` shape (`src/content/types.ts`) that `ArticleTemplate` renders.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/ai-toys-and-indias-data-law` (no mockup; the hub links it from `stories.html#ai-and-safety`; the safe-AI-toy article links it from its fold 4) |
| Page job | Explain, for a parent of a 3 to 7 year old, what India's data law says about a child's data, in the law's own words and in plain language: who counts as a child, consent, what a company must not do, and when it starts. Give the questions to ask any company. Then where Kheelona stands, in confirmed facts only, never as compliance. No legal advice. Route to the product page once |
| Primary cluster | **DPDP Act and children's data** (LRN-17); secondary "verifiable parental consent" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)); `/privacy` carries DPDP only as a secondary, so this page owns it ([§4.1](../../research/keyword-map.md#41-marketing-pages-13)) |
| Title (58 characters) | DPDP Act: what India's data law asks of AI toys · Kheelona |
| Meta description (142 characters) | The DPDP Act and children's data, in plain words: what India's law asks of a company from May 2027, and the questions to ask any AI toy maker. |
| H1 | What India's data law asks of a toy that listens (the hub card title, word for word; question 1) |
| Byline line | Apoorva Sahu · First published 11 Sep 2026 · 3 min read (byline: question 2) |
| Read time | 3 min (about 700 words in the article, headings included, close excluded; words ÷ 200, rounded, as `readingMinutes` in `src/lib/stories.ts:184-186`) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 9 ("Kheelu" → `/products/kheelu`, `meet-kheelu.html`) |
| Module values kept from the stub | Card title and summary (hub copy, `stories.md` fold 4); `related` (three, below; the stub's own swap note stands); `published` 2026-09-11; `updated` as the main session's note for task 5.19 directs |
| Page settings | Template parity; `close: "journal"`, so the shell shows the phone buy bar; `active: "stories"`, chrome on |

**What changed from the live article** (`src/lib/stories-expansion.ts:517-553`, input only): section 9 was
written as if in force; it is due in May 2027 (C20 caveat 1); "higher than the equivalent line in several other
countries" cut (unsourced); the readings of the law ("A tick box ... is not obviously consent", "the clause with the
sharpest teeth ... rules out the business model", "It does not define that phrase", "What the law does not do")
cut: they interpret the law, and the page gives no legal advice; the government's rules (consent measures,
exceptions, the same 18-month timetable) added from the official text; "Where we stand" rebuilt from confirmed facts
only: "consent is asked for from the parent account" cut (EXTERNAL IF CONFIRMED, G6; no consent flow exists yet,
[privacy copy](privacy.md) section 2), "voice data stays in your region" cut (BANNED,
[claims §4](../../product/claims.md#4-retired-or-banned-wording)), "we do not track your child, profile them" cut
(not confirmed; daily summaries and alerts wait on counsel's reading, [claims §7](../../product/claims.md#7-childrens-data-what-is-published-versus-documented)),
"which the law does not require of us" cut (a legal reading); the sources move from an Indian Kanoon mirror to the
official MeitY texts (C20 caveat 5), and the two Common Sense Media and Fairplay sources go (the rewrite does not
cite them).

---

## Fold 1 · Article head

**Fold job:** say what the page explains, in plain words, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › AI toys and safety
>
> **H1:** What India's data law asks of a toy that listens
>
> India's data law in plain words: what it asks of a company handling a child's data, and what you can ask for.
>
> Apoorva Sahu · First published 11 Sep 2026 · 3 min read

- **H1 accent:** `Hand` on "a toy that listens" (`{hand:a toy that listens}`).
- H1 and lead are the hub card's title and summary, word for word (the module keeps its curly apostrophes).
- Breadcrumb: "Stories" → `/stories`; "AI toys and safety" → `/stories#ai-and-safety` (from `hub.ts`, `topics.ts`).
- **Image** (`kh-photo`, 4:5, the LCP image; the head's portrait layout, the photo in the DS 4:5 frame beside the
  words): `ira-01-story-on-the-bed-web.webp`. Alt: "A laughing girl in a peach kurta sitting cross-legged on a
  block-print bedsheet, telling Kheelu a story with both hands." (`03-cast.md:112`; the approved alt of this photo
  on Home and the buyer's guide, `home.html:171`, `ai-toys-for-kids-in-india.html:101`, word for word: one alt per
  photo.) A child talking to a toy, the page's subject. The light on Kheelu is not lit in the photo, and the alt
  never describes it (D018). No imagination layer: a safety guide (DS `02-imagery.md`). Checked by eye in task 5.20c.
- **Task 5.20c (CMO M11, applied again):** round 2 gave this head `advik-04` because no other guide used it as a
  head then. It now heads three more (the 3-6-9-12 rule, since removed from the journal by D053; talking late; a toy that talks;
  [assets](../../engineering/assets.md)), and the talking and brain guides need the few photos without Kheelu
  ([tasks, 5.20](../../engineering/tasks.md): photo pools). So this page takes a photo from the AI guides' pool
  (ira-01, ira-03, kabir-01, myra-03), all with Kheelu. `ira-01` is 4:5, so the head shows it whole with no crop; it
  is daylight and Kheelu's light is not lit, so it does not read as a toy listening (the CMO's note on a glowing
  speaker ring, round 2); it heads no other guide. Not `ira-03` (evening, festive, the speaker ring glows), not
  `kabir-01` (the dark wall made for the Imagination layer's chalk, which a safety guide does not carry), not
  `myra-03` (a 3-year-old alone with Kheelu at bedtime). The cost: Kheelu is now in the head of the page about the
  law (question 6).
- **Round 2 (CMO M11), superseded above:** `tara-04-reading-nook` was also the early-years guide's head photo, so
  this page moved to `advik-04`, which the learning-toys guide then used only as an in-body figure (B28: DS library
  only).

---

## Fold 2 · The answer first

**Fold job:** state the law's child rules and their start date in 40 to 60 words, each sentence sourced.

**Copy:**

> **H2:** What does the DPDP Act say about children's data?
>
> India's Digital Personal Data Protection Act, 2023 (the DPDP Act) treats anyone under 18 as a child.¹ Section 9 says a company must get a parent's verifiable consent before processing a child's personal data, and must not track children, monitor their behaviour or aim targeted advertising at them.¹ Section 9 is due to come into force in May 2027.²

- 59 words (markers excluded). The `answer` block; no `detail`.
- Round 2 (CMO M4): the short name sits in brackets, so the block answer engines lift no longer stacks commas
  ("Act, 2023, the DPDP Act, treats"). Same words.
- C20's verified line, with "Under the current government notification," shortened to the bare date (the marker
  names the notification). Never "Kheelu complies with section 9"
  ([source verification C20](../../research/source-verification.md#c20--indias-data-law-and-children)).
- **Before publishing:** re-read the Gazette for any change to the commencement date. A reported "Removal of
  Difficulties" Order of 5 Oct 2026 was seen only in a law firm's summary; it is not reported to change any date
  (excerpt `C20-dpdp-commencement-gsr-843e-2025.md:27-31`). Question 3.

---

## Fold 3 · Who this is for (no heading)

**Copy:**

> This guide is for the parent standing in front of a toy that talks. It covers the part of the DPDP Act about children: what it says, when it starts, and what you can ask any company. It puts the law's own words into plain language. It is not legal advice.

- An `ArticlePart` with no title. "It is not legal advice" is the page's one limit line, early, as the main
  session's note asks (the legal pages carry their own draft note; this article is not a legal page).

---

## Fold 4 · Who counts as a child

**Copy:**

> **H2:** Who counts as a child?
>
> Anyone under 18. The Act defines a child as "an individual who has not completed the age of eighteen years".¹ So everything below applies to a 3-year-old and a teenager alike.

- Section 2(f), quoted. The age sentence describes the law's reach, not who Kheelu is for (Kheelu stays 3 to 7,
  [facts, age](../../product/facts.md#age)).

---

## Fold 5 · Consent

**Fold job:** the keyword map's H2; what the Act and the rules say about a parent's consent, nothing more.

**Copy:**

> **H2:** Consent has to come from you
>
> Section 9 says a company must get "verifiable consent of the parent" before it processes any personal data of a child.¹ The Digital Personal Data Protection Rules, 2025 add that the company must take "appropriate technical and organisational measures" to make sure it has that consent first.³
>
> So, once section 9 is in force, the yes has to come from you, the parent, before your child's data is used.¹

- Section 9(1) and rule 10(1), quoted from the official texts (excerpts `C20-dpdp-act-2023-official-text.md:26`,
  `C20-dpdp-rules-2025.md:22-24`). The rule's due-diligence detail (how a company checks the parent) is not quoted
  in the excerpt, so the page does not describe it.
- The last line restates section 9(1) in plain words; it adds no reading of "verifiable". **Round 2 (CMO M2):** it
  now carries the Act's marker, as the page's own rule asks of every statement about what the law requires, and says
  "once section 9 is in force", because section 9 is not in force until May 2027 (fold 7; excerpt
  `C20-dpdp-commencement-gsr-843e-2025.md:21, 25`). Counsel reads it with the rest of the page
  ([D029](../../decisions/D029-grievance-officer-legal-review.md)).

---

## Fold 6 · What a company must not do

**Copy:**

> **H2:** What a company must not do
>
> Section 9 sets two more limits. A company must not process personal data in a way that is "likely to cause any detrimental effect on the well-being of a child".¹ And it "shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children".¹
>
> The Rules list exceptions, such as a school tracking its pupils for their safety, or tracking a child's real-time location to keep them safe.³
>
> Whichever toy you choose, ask the company how it gets your consent, and whether it tracks your child or shows them ads.

- Sections 9(2) and 9(3) quoted (excerpt `C20-dpdp-act-2023-official-text.md:28-30`). The exceptions are the Fourth
  Schedule's Part A item 3(b) and Part B item 4 (excerpt `C20-dpdp-rules-2025.md:28-34`), given as examples
  ("such as"); the page does not say whether any exception covers a toy maker (that would be a legal reading).
- The last paragraph is C20's house line, verbatim (no marker).

---

## Fold 7 · When it starts

**Copy:**

> **H2:** When does it start?
>
> Not yet. The Act was published in August 2023, and the government is bringing it into force in stages.¹ ² Under its notification of November 2025, section 9 is due to come into force a year and a half later, in May 2027.² The rule on a parent's consent follows the same 18-month timetable.³
>
> Until then, the questions below are yours to ask, of any company.

- Gazette of 11 August 2023 and section 1(2) (different dates for different provisions); G.S.R. 843(E) of 13 November
  2025, clause (c) (sections 7 to 10 eighteen months from publication); rules 1(4) and 10 of the DPDP Rules, 2025
  (eighteen months). "May 2027" is the excerpt's own arithmetic; the notification gives the rule, not the day, so
  the page names the month only.
- "A year and a half later" replaced "18 months later" after approval, for the content-integrity rule on ages under
  three; same fact, for the founder at Gate B ([CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#after-approval-two-wording-changes-for-the-founder-at-gate-b-d015)).

---

## Fold 8 · What you can ask any company

**Fold job:** the card's promise ("what you can ask for"): questions, not rights, so the page gives no legal advice.

**Copy:**

> **H2:** What you can ask any company
>
> Ask before any toy that listens comes home, and expect a plain answer:
>
> - How do you get my consent, and how do you check it is me?
> - Where is my child's voice processed, and in which country?
> - Do you track my child, or show them ads?
> - Is my child's data ever sold?
> - Can I read what my child said, and delete it myself?
> - How long do you keep it?
>
> A vague answer is an answer.

- A `list` block (bullets) between two paragraphs. Each item is a question a parent may ask; none says the law gives
  a right to the answer. "A vague answer is an answer" is the safe-AI-toy page's line.
- Round 2 (CMO M3): "So is a privacy policy nobody could follow." is cut. It set up fold 9's privacy-policy pointer
  while that policy's consent section is still a placeholder (G6; [privacy copy](privacy.md)). Fold 9 still answers
  four of the six questions; consent and tracking wait on question 4.

---

## Fold 9 · Where we stand (the one in-text product link)

**Fold job:** answer the questions above that Kheelona can answer in confirmed facts today, in D020's order, and
point to the policy that covers the rest. Never a compliance claim.

**Copy:**

> **H2:** Where we stand
>
> We sell [Kheelu](https://kheelona.com/products/kheelu), a toy that listens, so these questions are for us too. Here is where we stand today.
>
> **Listening.** Kheelu's microphone turns on only when someone presses the wake-up button, and a light shows whenever it's listening.
>
> **Your child's voice.** To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **Every conversation.** You can read every conversation in the parent app. Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> **Your data.** We don't sell your data. Your child's data is never used to advertise to them.
>
> Everything we collect, what we use it for and the choices you have are set out in our [privacy policy](https://kheelona.com/privacy). If any of it reads as less than clear, tell us: WhatsApp or call +91 91875 46483.

- A `facts` block (`TrustList`, one column on phones) with the safe-AI-toy page's icons for the same four items
  (microphone, lock-simple, eye, hand-heart), between two paragraphs. Order: the wake-up button and light → the
  providers line → read and delete → no sale ([D020](../../decisions/D020-provider-terms-and-no-sale.md)).
- **Wording held to the rulings:** D018's mechanism (no wake-word phrase, no absolute, the light's colour never
  named); D020's providers line verbatim, its training clause scoped to the providers
  ([D041](../../decisions/D041-gate-a-round-1.md)); `RETENTION_LINE`; D020 and
  [D038](../../decisions/D038-trust-content-rulings.md)'s no-sale and advertising lines. The help line renders from
  `seller.help.contact`, never typed.
- **Deliberately not answered here** (no confirmed line; question 4): how Kheelona gets a parent's consent (G6; the
  [privacy copy](privacy.md) holds it as a placeholder, and no consent flow exists yet), and whether anything in
  the parent app counts as tracking or behavioural monitoring (daily summaries and alerts wait on counsel's reading,
  [claims §7](../../product/claims.md#7-childrens-data-what-is-published-versus-documented)). Nothing here says or
  implies that Kheelu meets section 9, and nothing implies there is no training use: the privacy policy, linked,
  states Kheelona's own model's training and its opt-out ([D035](../../decisions/D035-model-training-opt-out.md)).
- Links: `/products/kheelu` → `meet-kheelu.html`; `/privacy` → `privacy.html`; help line →
  `https://wa.me/919187546483`, `tel:+919187546483`.

---

## Fold 10 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Government of India, "The Digital Personal Data Protection Act, 2023" (No. 22 of 2023), 2023, sections 1(2), 2(f) and 9. https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf
>
> ² Ministry of Electronics and Information Technology, Government of India, Notification G.S.R. 843(E), 13 November 2025, clause (c). https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf
>
> ³ Ministry of Electronics and Information Technology, Government of India, "Digital Personal Data Protection Rules, 2025" (G.S.R. 846(E)), 2025, rules 1(4) and 10(1) and the Fourth Schedule. https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf

- Official MeitY texts only, never a mirror (C20 caveat 5). The same list is the BlogPosting `citation` array.

---

## Fold 11 · Related guides

**Copy:**

> **H2:** Related guides
>
> - What to look for in a safe AI toy
> - How to get your child talking
> - Busy hands, no screens

| Title (each guide's own card) | Real URL | Mockup link |
|---|---|---|
| What to look for in a safe AI toy | `/stories/what-to-look-for-in-a-safe-ai-toy` | `story-what-to-look-for-in-a-safe-ai-toy.html` |
| How to get your child talking | `/stories/how-to-get-your-child-talking` | `stories.html#talking` |
| Busy hands, no screens | `/stories/busy-hands-no-screens` | `stories.html#screen-time` |

- The stub's `related` list with one change (task 6.5, [D053](../../decisions/D053-remove-the-3-6-9-12-article.md)):
  the 3-6-9-12 guide left the journal, and the busy-hands guide takes its place, third. The guides the removed one
  offered (busy hands, the safe-AI-toy guide and this one) each need one more incoming link, and the other AI guides
  already have three; this list already offers the safe-AI-toy guide and cannot offer itself, so it takes busy hands,
  and every guide keeps three related guides and three incoming links (`articles.test.ts`). Its head photo
  (`ira-02`) is not this page's (`ira-01`), so no linked guide shares a head photo (task 5.20a's rule). Titles render
  from each module's card.

---

## Fold 12 · Close (journal close block)

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

- `cta` = `finale`. Close art: plain, without the doodle (a safety guide; `PLAIN_CLOSE_ART` in
  `stories/articles/index.ts` is outside this task's Owns: reported to the main session). The help line repeats
  fold 9's on purpose: it belongs to every CTA block ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)).

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; the shell's, because the close carries the button.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 58 characters; the keyword map's draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 142 characters; the fact is the May 2027 start (re-check before publishing, with fold 2) |
| One H1 with the primary | **Partly** | The H1 is the approved hub card title ("India's data law", not "DPDP Act"; question 1). The primary is in the title, the meta, the answer H2 and fold 3 |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "What does the DPDP Act say about children's data?" (both halves of the primary) and its 59-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2; fold 5 carries the keyword map's suggested H2 ("Consent has to come from you") and the secondary, "verifiable consent of the parent", in its first line |
| Alt text | Yes | Describes the scene (the approved alt of `ira-01`, task 5.20c); no keyword forced |
| Density | Yes | "DPDP Act" twice in `<main>` (fold 2, fold 3): about 0.6% of about 750 words with the close, counting its 2 words; "Kheelu" 6 times including the close and its button (under 1%) |
| Words never placed | Yes | No "complies", "compliant" or "meets section 9" about Kheelu; no consent or tracking claim for Kheelu; no "stays in your region", "only our own servers", "nothing is ever recorded", training claim, legal reading or advice; no competitor names |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (product, privacy, help line) | text links | none (not buttons) | n/a |

## Placeholders

None. (A rewritten article module may hold no open placeholder: `articles.test.ts`. The two answers Kheelona cannot
give yet, consent and tracking, are left out of fold 9 rather than held, and are question 4.)

## Questions for the founder (website only)

1. **H1 or keyword.** The keyword map wants "DPDP Act" in the H1; the H1 drafted here is the approved hub card
   title. (a) Keep the card title as the H1 (as drafted); (b) H1 "The DPDP Act: what India's data law asks of a toy
   that listens", card unchanged. **Recommend (a)**: "India's data law" is the words a parent uses, the card is
   approved, and the title tag and the answer H2 carry "DPDP Act" for search (same question as on the hard-questions
   page).
2. **Byline.** The live article is by Apoorva Sahu. (a) Keep the founder's name, after reading it; (b) "The
   Kheelona team". **Recommend (a)**: a named founder standing behind "where we stand" is accountable, and the page
   says plainly it is not legal advice. Choose (b) if counsel prefers no named person on a page about the law.
3. **The start date.** (a) Keep "May 2027" in the answer, the meta and fold 7, and re-read the Gazette before Gate B
   (as drafted); (b) say only "not in force yet", with no date. **Recommend (a)**: the date is what a parent needs,
   it is verified against the official notification, and the re-check is one step before publishing.
4. **Kheelona's answers on consent and tracking (fold 9).** The page tells parents to ask every company how it gets
   consent and whether it tracks a child, and Kheelona answers neither yet: no consent flow exists (G6), and whether
   daily summaries and alerts count as behavioural monitoring waits on counsel (D029). The model training on
   conversations by default ([D035](../../decisions/D035-model-training-opt-out.md)) is disclosed on `/privacy`,
   which fold 9 links, but not on this page. (a) As drafted: confirmed facts plus the privacy pointer, no consent or
   tracking line, counsel reads this page before Gate B; (b) add Kheelona's consent and tracking answers, and the
   training use in the privacy policy's words, once G6 and counsel's reading land; (c) cut fold 9 to one line
   pointing to the Safety page and the privacy policy. **Recommend (a) for beta, then (b)**: on a page about
   consent, the D035 misleading-by-omission risk is sharper than anywhere else on the site, and the honest fix is
   the answer itself, not a shorter section. The CMO agrees (round 1, M3). **Round 2:** if you want the gap said
   aloud on beta, the CMO offers one line for your signature, after fold 9's facts: "We will add our own answers to
   the first and third questions here before Kheelu ships." It is a commitment with a date, not a confirmed fact, so
   it is not in the copy unless you sign it.
5. **Section 9's start in fold 5 (round 2, CMO M2).** "So, once section 9 is in force, the yes has to come from you,
   the parent, before your child's data is used.¹" is a plain restatement of section 9(1) with its future start.
   Counsel reads it with the rest of the page before Gate B; no option to choose unless counsel changes it.
6. **The head photo (task 5.20c, CMO M11).** The page now opens on Ira telling Kheelu a story (`ira-01`), so the
   product is in the head of the page about the law, which rounds 1 and 2 avoided. (a) `ira-01` (as now drafted):
   from the AI guides' photo pool, uncropped, Kheelu's light not lit, heads no other guide; (b) back to `advik-04`
   (no Kheelu), making it the head of four guides and leaving the talking guides fewer photos without Kheelu;
   (c) a new DS scene photo without Kheelu, if you have one (open question P24). **Recommend (a)** for beta: a child
   talking to a toy is what the page is about, the photo makes no claim, and (c) replaces it the day such a photo
   exists.

## Sources

| Claim | Source |
|---|---|
| H1, lead (hub card, word for word); related list; published 11 Sep 2026; live byline | `stories.md` fold 4; stub module; `src/lib/stories-expansion.ts:529-531` |
| The Act treats anyone under 18 as a child; the definition, quoted | [source verification C20](../../research/source-verification.md#c20--indias-data-law-and-children); excerpt `C20-dpdp-act-2023-official-text.md:20-22` (section 2(f)) |
| Section 9(1): verifiable consent of the parent before processing a child's data | `C20-dpdp-act-2023-official-text.md:26` |
| Fold 5's plain restatement: once section 9 is in force, the yes comes from the parent before a child's data is used | `C20-dpdp-act-2023-official-text.md:26` (section 9(1)); the start: `C20-dpdp-commencement-gsr-843e-2025.md:21, 25`; [CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#minor) M2; counsel's read (D029) |
| Section 9(2): no processing likely to harm a child's well-being, quoted | `C20-dpdp-act-2023-official-text.md:28` |
| Section 9(3): no tracking, behavioural monitoring or targeted advertising directed at children, quoted | `C20-dpdp-act-2023-official-text.md:30`; C20 ready line |
| Published August 2023; in force in stages | `C20-dpdp-act-2023-official-text.md:10, 16-18` (Gazette 11 August 2023; section 1(2)); `C20-dpdp-commencement-gsr-843e-2025.md:17-21` |
| Section 9 due in May 2027 (18 months from the 13 November 2025 notification) | `C20-dpdp-commencement-gsr-843e-2025.md:21, 25`; C20 ready line; re-check: same file, lines 27-31 |
| Rule 10(1): "appropriate technical and organisational measures" for verifiable consent; same 18-month timetable | `C20-dpdp-rules-2025.md:16-24` |
| Exceptions: a school, for its pupils' safety; a child's real-time location, for their safety | `C20-dpdp-rules-2025.md:28-34` (Fourth Schedule, Part A item 3, Part B item 4) |
| "Whichever toy you choose, ask the company how it gets your consent, and whether it tracks your child or shows them ads." | C20 house line |
| Wake-up button; light | [D018](../../decisions/D018-wake-up-button.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Providers line, verbatim | [D019](../../decisions/D019-voice-providers.md), [D020](../../decisions/D020-provider-terms-and-no-sale.md); training clause scoped: [D035](../../decisions/D035-model-training-opt-out.md), [D041](../../decisions/D041-gate-a-round-1.md) |
| Read every conversation; 36 months; delete sooner in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) (`RETENTION_LINE`) |
| We don't sell your data; never used to advertise to your child | [D020](../../decisions/D020-provider-terms-and-no-sale.md); [D038](../../decisions/D038-trust-content-rulings.md) (F17) |
| The privacy policy sets out what is collected, its uses (training included) and a parent's choices | [privacy copy](privacy.md) (page job, sections 2-3); [D035](../../decisions/D035-model-training-opt-out.md) |
| Help line | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel) |
| Not answered: consent (G6), tracking and monitoring (counsel) | [claims §7](../../product/claims.md#7-childrens-data-what-is-published-versus-documented); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) (consent row); [privacy copy](privacy.md) open items 8 and the consent placeholder |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block), [phone sticky bar](home.md#phone-sticky-bar) |
| Cut live lines | [claims §4](../../product/claims.md#4-retired-or-banned-wording) ("stays in your region"); [claims §7](../../product/claims.md#7-childrens-data-what-is-published-versus-documented) (consent, monitoring); [source verification C20](../../research/source-verification.md#c20--indias-data-law-and-children) (not in force; mirror) |
| Photo | DS `03-cast.md:112` (Ira 01, with Kheelu, 4:5); alt from the approved mockups, word for word: Home fold 4 (`mockup/pages/home.html:171`; built, `src/content/en-IN/pages/home.ts:181`) and the [buyer's guide](ai-toys-for-kids-in-india.md) FAQ image (`mockup/pages/ai-toys-for-kids-in-india.html:101`); the AI guides' photo pool ([tasks, 5.20](../../engineering/tasks.md)); file checked by eye in task 5.20c |

## Changes after approval (task 5.20c)

- **Fold 1, the head photo (CMO round 1, M11, applied again).** `advik-04` became `ira-01-story-on-the-bed`, with
  this photo's approved alt, word for word. Why: M11 asked for "another DS library photo not used as an article
  head"; round 2 met it with `advik-04`, which headed no guide then, but after the screen-time and talking guides
  merged it heads three more ([assets](../../engineering/assets.md), the `advik-04` row), and task 5.20 asks for fewer
  repeated heads and sends the AI guides to a pool of photos with Kheelu (ira-01, ira-03, kabir-01, myra-03;
  [tasks, 5.20](../../engineering/tasks.md)) so the talking and brain guides keep the photos without Kheelu. Why
  `ira-01` over the other three: fold 1's notes. The head turns from the wide layout to the portrait one (the photo
  is 4:5, 1208 × 1500, so nothing is cropped). No Copy block changed, so word counts, the read time (3 minutes),
  keyword placements and source markers are as approved. Question 6 asks the founder to confirm the photo.
- **Checked, already done in round 2 (no change):** M2 (fold 5, "once section 9 is in force", with its marker), M3's
  cut ("So is a privacy policy nobody could follow." is gone from fold 8), M4 (fold 2, "(the DPDP Act)"). The two
  wordings changed after approval (fold 7, "a year and a half later") stand, for the founder at Gate B.
- **Left as they are, waiting on the founder and counsel (open question P23):** Kheelona's own consent and tracking
  answers stay off the page (M3's second half; question 4); the CMO's optional line ("We will add our own answers
  ...") is not added without the founder's signature; fold 5's restatement of section 9(1) and the "May 2027" date
  wait on counsel's read and a re-read of the Gazette (questions 3 and 5). No consent, tracking or compliance line
  was added.
- **For the builder:** `ai-toys-and-indias-data-law.ts` imports `@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp`
  in place of `advik-04` and takes the alt above, word for word, in the same commit
  (`ai-safety-and-learning.test.tsx`, "shows the copy page's head photo, with its alt"); `ArticleHead` picks the
  portrait layout from the photo's own shape. `updated` stays 2026-10-13. [Assets](../../engineering/assets.md): the
  `ira-01` row adds A (the data-law head); the `advik-04` row drops "the data law" and its "16:9 on the data-law
  head" note.
