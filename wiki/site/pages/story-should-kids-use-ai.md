---
title: "Story: Should kids use AI? An honest answer from people who build it (/stories/should-kids-use-ai): page copy, Phase 5 draft (task 5.19)"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§3.2, §3.3, §5 /stories/* row)
  - ../gate-a-open-items.md (B3 Common Sense Media, B15 source markers, B28 journal photos)
  - ../pages/stories.md (fold 4 card, word for word; fold 6 journal close)
  - ../pages/story-what-to-look-for-in-a-safe-ai-toy.md (the AI-safety model: B3 answer, fold 5 fact wording)
  - ../pages/home.md (CTA block, sticky bar)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§4.2 LRN-14, §4.3, §5.1, §5.2, §6.5 AI5)
  - ../../research/source-verification.md (§4: C07, C11, C14, C16, C36; C37 on hold, not used)
  - "../../raw/research/sources/: C14-brookings-cognitive-stunting.md, C36-fairplay-ai-toys-advisory.md, C16-common-sense-press-release-2026-01-22.md, C16-common-sense-ai-toys-risk-assessment.md, C07-harvard-serve-and-return.md, C11-xu-2021-computers-and-education.md"
  - ../../product/claims.md (§1, §2, §4, §4.1 row 14, §8), ../../product/facts.md, ../../product/age-band-review.md (§4, row 38)
  - ../../brand/messaging.md (confirmed candidate lines; against the alternatives; objection answers), ../../brand/voice.md
  - ../../decisions/D016, D017, D018, D019, D020, D026, D035, D036, D038, D041
  - "src/lib/stories-expansion.ts:218-251 (the live article; input only); src/content/en-IN/stories/articles/should-kids-use-ai.ts (stub: card, related, dates); src/content/en-IN/policies.ts:49 (RETENTION_LINE)"
  - test/guards/banned-phrases.data.ts (every Copy block checked against it)
  - design-system/project/03-cast.md:123; 01-writing.md:111-113 (read-only)
  - ../../qa/cmo-review-articles-5.19-2026-10-14.md (round 1: B1, M1, M12 fixed in round 2; round 2: R2-1 fixed in task 5.20c)
  - ../../engineering/tasks.md (§4.9 and 5.20, task 5.20c, copy fixes and photo pools)
  - ../../qa/cmo-review-built-b-2026-10-14.md (m3, the related ring; applied in task 7.1d, see the foot of this page)
  - ../../decisions/D058 (items 1, 5, 6, 9), D059 (item 1: contractions stay); task 8b.2a, see the foot of this page
  - ../../qa/live-main-reconciliation-2026-10-14.md (§1 P11-P12; §2, origin/main c630a49 and dd04e6d)
  - ../../engineering/journal-pipeline.md (§9.2 row for this guide; §12, 8b.2a)
  - "the CMO review of task 8b.1 (wiki/qa/cmo-review-claims-8b.1-2026-10-14.md on 8b.1's branch: m6, m7, m12, m13) and 8b.1's safety.md (fold 2 item 2, question 7), for the forms reused here"
  - ../../qa/cmo-review-guides-d058-8b.2a-2026-10-14.md (m3, m6, m8; m5 with the review of task 8b.2a, round 2: the internet item follows /safety's title; see the foot of this page)
---

# Story: Should kids use AI? An honest answer from people who build it

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. Draft for the CMO review of task 5.19 and the founder's sign-off on
> beta at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `⁶` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
  Lines without a marker are our own voice and make no research claim.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL, then the mockup file in brackets. **This article has no mockup:** visual acceptance
  is template parity with `story-learning-toys-for-a-three-year-old.html` for the shared parts; every fold below
  maps to a block of the `Article` shape (`src/content/types.ts`) that `ArticleTemplate` renders.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/should-kids-use-ai` (no mockup; the hub links it from `stories.html#ai-and-safety`) |
| Page job | Answer "should kids use AI?" for a parent of a 3 to 7 year old: where the line sits between AI built for adults and a toy built for young children, what the worry is, what child-safety groups advise, what young children need from the adults around them, and how to judge any toy with AI inside. Then Kheelu's design, once, against those points. Route to the product page once |
| Primary cluster | **should kids use AI** (LRN-14); secondaries "is AI good for kids", "AI chatbots and children" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (47 characters) | Should kids use AI? An honest answer · Kheelona |
| Meta description (147 characters) | Should kids use AI? What child-safety groups advise, what young children need from the adults around them, and how to judge any toy with AI inside. |
| H1 | Should kids use AI? An honest answer from people who build it (the hub card title, word for word) |
| Byline line | Aman Soni · First published 28 Jul 2026 · 5 min read (byline: question 1) |
| Read time | 5 min (about 930 words in the article after task 5.20c, headings included, sources, related guides and close excluded; words ÷ 200, rounded, as `readingMinutes` in `src/lib/stories.ts:184-186` and the 5.6 pages: 927 ÷ 200 = 4.6, so 5; 928 after round 2, one word fewer in the answer since; round 1 was about 890, so 4). Task 8b.2a's fold 8 corrections add two words (+1, −4, −2, +5, +2), so about 929 and still 5 min. The build derives it from the module, so the byline follows the module |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 8 ("Kheelu" → `/products/kheelu`, `meet-kheelu.html`) |
| Module values kept from the stub | Card title and summary (hub copy, `stories.md` fold 4); `related` (three, below; since task 7.1d the CMO's ring, not the stub's); `published` 2026-07-28; `updated` as the main session's note for task 5.19 directs. The stub's `metaTitle` ("Should kids use AI?") gives way to the title above (the card title is 60 characters, so it cannot carry the brand) |
| Page settings | Template parity; `close: "journal"`, so the shell shows the phone buy bar; `active: "stories"`, chrome on |

**Overlap.** The safe-AI-toy article owns "what to look for" worry by worry, and the buyer's guide owns the "five
checks"; this page owns the yes-or-no question and the line between AI built for adults and a toy built for young
children. Its four questions in fold 7 are framed as a way to judge a design, not as a checklist, and it links to the
guide for the side-by-side comparison.

**What changed from the live article** (`src/lib/stories-expansion.ts:218-251`, input only): "We ... would not hand
one of those to a four-year-old" and "built for ages three and up" re-aged to 3 to 7
([age-band review](../../product/age-band-review.md) row 38); "more than a quarter of the replies ... from
self-harm to drugs" and "no child of five or under should be given one" replaced by the verified C16 lines; Fairplay
"told parents not to buy AI toys at all" corrected to "that season" (C36; it sets no age line) with the advisory
page's URL; the AAP line ("about an hour of good content" for two to five year olds) cut (C33: never "about an
hour"; the age range is outside the band); "Researchers at Harvard call the loop" replaced by C07's verified line
with its caring adult; Brookings (C14) and the Xu 2021 study (C11) added in their verified wording; "Does the company
earn more when your child spends more minutes?" cut, as on the safe-AI-toy page (no confirmed answer for Kheelu);
"Five good answers is a tool. Fewer is a slot machine with a cartoon on it" cut (the guide owns five checks); "The
only good answer is when your child says a wake word" (retired, [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)
row 14) replaced by the wake-up button facts; "what India's data-protection law now requires" cut (section 9 is
not in force yet, C20); "a friend that asks the next question" and "no ads, nothing sold" replaced by the confirmed
lines; the in-text "refundable ₹499 holds your place" cut (the close carries the price sentence from the offer).

---

## Fold 1 · Article head

**Fold job:** say what the page answers, and who is answering, in the first phone screen.

**Copy:**

> **Breadcrumb:** Stories › AI toys and safety
>
> **H1:** Should kids use AI? An honest answer from people who build it
>
> Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside.
>
> Aman Soni · First published 28 Jul 2026 · 5 min read

- **H1 accent:** `Hand` on "honest answer" (`{hand:honest answer}`).
- H1 and lead are the hub card's title and summary, word for word (`stories.md` fold 4; the stub module).
- Breadcrumb: "Stories" → `/stories`; "AI toys and safety" → `/stories#ai-and-safety` (from `hub.ts`, `topics.ts`).
- **Image** (`kh-photo --wide`, 16:9, the LCP image): `kabir-02-block-rocket-web.webp`. Alt: "A boy in round
  glasses and an olive T-shirt kneels on a patterned rug, grinning as he stacks wooden blocks into a tall tower, with
  Kheelu sitting beside it." (`03-cast.md:123`: "Curiosity and STEM"; a child thinking with his hands, the page's
  frame. Checked by eye 2026-10-13. The alt never describes Kheelu's light: no colour is specified, D018.)

---

## Fold 2 · The answer first

**Fold job:** answer the search in 40 to 60 words, then frame the rest of the page.

**Copy:**

> **H2:** Should kids use AI at all?
>
> Not the AI built for adults. Common Sense Media advises against AI toys at 5 and under, and extreme caution from 6 to 12.¹ If you choose AI for your child's play, it should be built for their age, unable to browse the internet and fully visible to you. It should ask your child questions, not just give answers.

- 59 words (marker excluded; 60 before task 5.20c). The `answer` block; no `detail`. Generic: no product in the answer, so it reads as useful to any parent.
- **Task 5.20c (CMO R2-1):** "If AI is part of a young child's play, it should be ..." became "If you choose AI for your
  child's play, it should be ...". Straight after Common Sense Media's advice, the old clause read as if the advice
  had already been set aside; the new one leaves the choice with the parent, as the B3 answer in fold 8 does ("so
  you can check it yourself and decide"). The CMO's wording, word for word.
- **Round 2 (CMO M12, the founder's option; question 3):** the block answer engines lift on its own now says what
  the main child-safety group advises, so it no longer gives only the conditions under which AI suits a young child.
  The CMO's draft named only the 5-and-under half; this keeps the 6-to-12 half too, because B3 is "cite it in full"
  and a parent of a 6 or 7 year old reads this block as well. To stay inside 60 words, "not just hand over answers,
  so your child still does the thinking" became "not just give answers" (fold 8 still carries "so your child does the
  thinking"). The sentence is the C16 line in short form, sourced to the press release, paragraph 1 (excerpt
  `C16-common-sense-press-release-2026-01-22.md:22-25`).
- "AI built for adults" is the hub card's own frame. The answer names no chatbot and states no chatbot's age rules:
  that line (C37) is on hold until the founder and counsel confirm what Kheelu's own providers' terms say
  ([source verification C37](../../research/source-verification.md#c37--can-a-young-child-use-a-chatbot)).
- "If you choose AI for your child's play, it should be built for their age ... and fully visible to you" is the C37
  house line (advice, no claim; [source verification C37](../../research/source-verification.md#c37--can-a-young-child-use-a-chatbot),
  "If AI is part of a young child's play, ..."), its opening turned to the parent's choice in task 5.20c (CMO R2-1),
  and extended with the confirmed contrast "other AI gives answers; Kheelu asks questions"
  ([messaging, against the alternatives](../../brand/messaging.md#against-the-alternatives)) in generic form. The
  house line is our own voice, so the change adds no research statement.

---

## Fold 3 · Who is answering (no heading)

**Copy:**

> We build a toy with AI inside, for children aged 3 to 7, so we may be the last people you should ask, or the first. Either way, here is our answer in full, including where child-safety groups disagree with us.

- An `ArticlePart` with no title. "A toy with AI inside" (not "we build AI"): Kheelu uses outside speech and AI
  providers ([D019](../../decisions/D019-voice-providers.md)), so nothing here may suggest Kheelona owns the model.

---

## Fold 4 · The worry

**Fold job:** name the worry about children and AI in a cited voice, then give the parent one thing to do.

**Copy:**

> **H2:** What is the worry about children and AI?
>
> In a May 2026 commentary for the Brookings Institution, Rebecca Winthrop, who directs its Center for Universal Education, described one worry about children and AI as "cognitive stunting": relying too heavily on AI "reduces children's opportunities to engage in effortful thinking".² She points to children's wide use of "general-purpose chatbots and AI companions not designed for learning", and calls the evidence early.²
>
> Give your child time to think before anyone, or anything, gives the answer.

- C14's verified line, with the commentary's own scope added from the same excerpt (C14:35-37). Never "Brookings
  warns": one author's commentary. Her ask for measurement is left out (stricter, and its wording carries a
  banned phrase). No Kheelu line in this fold
  ([source verification C14](../../research/source-verification.md#c14--cognitive-stunting)).
- The second paragraph is C14's house line (no marker).
- "AI companions not designed for learning" is a group a reader may put an AI toy in: it is quoted, not argued
  away here (fold 8 answers it with mechanisms).

---

## Fold 5 · What child-safety groups advise

**Fold job:** quote both warnings in full and in their real scope, before saying anything about Kheelu (B3).

**Copy:**

> **H2:** What do child-safety groups advise?
>
> In November 2025 Fairplay, a children's advocacy group, published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season.³
>
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.¹ When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.⁴
>
> Common Sense Media also says children aged 5 and under "cannot reliably distinguish AI from real people".⁴
>
> Most of these concerns are about how a toy is built, and those you can check. The age advice is about young children themselves, and only you can weigh it for yours.

- Paragraphs 1 and 2 are the verified C36 and C16 lines, verbatim. Never name the toys tested; never "at any age"
  for Fairplay; never "found" a result at ages 3 to 5 (the tests used accounts set to 6 to 13)
  ([source verification C16, C36](../../research/source-verification.md#c16--common-sense-media-on-ai-toys)).
- **Round 2 (CMO B1).** Paragraph 3 quotes the risk assessment ("Where they fall short", excerpt
  `C16-common-sense-ai-toys-risk-assessment.md:37-38`), as the approved safe-AI-toy page does (its fold 3). Paragraph 4
  replaces "Notice what these concerns are about: how a toy is built. That is something you can check.", which turned
  a firm age warning into a checklist: the 5-and-under advice rests on development, not on how a toy is built (the
  same excerpt, `:37-41`: "Developmentally inappropriate for target age groups"; "For children age 5 and under, AI
  toys are developmentally inappropriate"). Its first sentence keeps the approved "Most of these worries are about how
  a toy is built" (safe-AI-toy page fold 4); its second says where the advice comes from without arguing with it. No
  marker on paragraph 4: it makes no new research claim.
- The answer to this advice is the B3 paragraph, which opens fold 8, as on the safe-AI-toy page.

---

## Fold 6 · What young children need

**Fold job:** the research case for the adult in the loop, with its real ages and limits; no product in the fold.

**Copy:**

> **H2:** What does the research say young children need?
>
> Harvard's Center on the Developing Child says back-and-forth "serve and return" exchanges between a young child and a caring adult help build and strengthen neural connections in the child's brain. They also support the early language and social skills that later, more complex thinking builds on.⁵
>
> In a US study of 90 children aged between 3 and 6, children asked about a story by an adult researcher gave longer answers, using more different words, than children asked the same questions by a smart speaker. Both groups answered about equally accurately.⁶
>
> You can do it anywhere: answer your child, then ask one back. And the test for any AI near a young child is simple: does it leave more room for that back-and-forth with you, or less?

- Paragraph 1 is C07's verified line, with "a caring adult". Paragraph 2 is C11's verified line, "related" dropped
  (C10 is not on this page) and the ages written "between 3 and 6" (the study's own range, "aged three to six
  years"; the site guard bans the digits "3 to 6" as a retired product age range). Both stand on their sources;
  neither is an outcome claim for any toy ([D016](../../decisions/D016-brain-wording.md),
  [D025](../../decisions/D025-speech-and-language.md)).
- No Kheelu in this fold: no brain line shares a sentence or a paragraph with the product (D016). The C07 company
  line ("Kheelu is built around the same idea") is not used, so the research stays the parent's, not ours.
- Paragraph 3 opens with C07's house line; its second sentence is our own test, with no claim.

---

## Fold 7 · Not a yes or no, and how to judge (keyword map's H2)

**Fold job:** turn the page into questions a parent can put to any maker, then the page's conclusion.

**Copy:**

> **H2:** How do you judge anything with AI inside?
>
> Ask the same four questions of every maker, us included.
>
> - Can it reach the open internet, or only a closed set of material?
> - Is every reply checked for your child's age, and can the maker say how?
> - Can you read every conversation, and delete any of it yourself?
> - Does it talk with your child, in questions and turns, or perform at them?
>
> A maker who answers all four plainly is worth a closer look. For us, AI near a young child is not a simple yes or no. It is a question of who built it, and why.
>
> To compare toys side by side, use our guide to [AI toys for kids in India](https://kheelona.com/ai-toys-for-kids-in-india).

- A `list` block (bullets) between paragraphs. Four questions, never "five checks"; the microphone question is left
  to fold 8's facts and the guide, so this list does not shadow the guide's.
- **Round 2 (CMO M1):** "For us, ... not a simple yes or no" marks the conclusion as our view, two folds after a group
  that says no at 5 and under; it no longer reads as a fact set against theirs.
- Link: `/ai-toys-for-kids-in-india` → `ai-toys-for-kids-in-india.html`.

---

## Fold 8 · Where Kheelu stands (the one in-text product link)

**Fold job:** give the signed B3 answer once, then Kheelu's checkable facts in the founder's order (D020), each
matched to a point above.

**Copy:**

> **H2:** Where does Kheelu stand?
>
> Kheelu is made for children aged 3 to 7. Common Sense Media's advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us. Here is how we built [Kheelu](https://kheelona.com/products/kheelu) on each point above, so you can check it yourself and decide.
>
> **The microphone.** It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it's listening. It switches itself off after a couple of minutes of quiet.
>
> **Your child's voice.** To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **Every conversation.** You can read every conversation in the parent app. Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. Delete them all sooner by deleting your account.
>
> **Your data.** We don't sell your data. Your child's data is never used to advertise to them.
>
> **No web browsing.** Kheelu can't browse or search the internet. Its answers are generated by an AI model. On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google's safety filters on top.
>
> **Talking with, not at.** It answers your child, then asks a question back, so your child does the thinking.
>
> If your child is 3, keep a grown-up nearby while they play.
>
> Whether that is enough is your call, and the child-safety groups above are right to make companies earn it. The detail is on our [Safety page](https://kheelona.com/safety).

- **The first paragraph is the B3 answer, word for word** (safe-AI-toy page fold 5), its "each point above" now
  pointing at fold 7's four questions and fold 5's concerns.
- A `facts` block (`TrustList`, one column on phones), as fold 5 of the safe-AI-toy page, with the same icons for
  the same items (microphone, lock-simple, eye, hand-heart, wifi-slash) and `chat-circle` or `question` for the last
  (builder's pick from the DS icon set); bold lead-ins are the items' titles, not headings. No figure.
- **Wording held to the rulings, as on the safe-AI-toy page** (as corrected in task 8b.2a,
  [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)):
  - The microphone item is D018's (no wake-word phrase, no "no risk", no disconnect claim, the light's colour never
    named), with the live team's code-checked "a couple of minutes of quiet" (D058 item 1).
  - The voice item is D020's line less ", on servers in India" (D058 item 6). Its promise (D020 items 1-4) and its
    training clause scoped to the providers ([D041](../../decisions/D041-gate-a-round-1.md)) are unchanged; no place
    is named in its stead, as on `/safety` (task 8b.1, its question 7).
  - The retention sentence is `RETENTION_LINE` as task 8b.1 rewords it (its first sentence only; 8b.1 owns the
    words), then "Delete them all sooner by deleting your account.", the live team's deletion fact (D058 item 1) in
    the CMO's form for this place (review of task 8b.1, m7).
  - The internet item says how a reply is made, in the code-checked words (D058 item 1), keeping the approved "the
    age you enter in the parent app" ([D036](../../decisions/D036-launch-feature-claims.md) lines 27-28). The closed
    library and the age-graded layer are gone, and the D019 flag no longer arises: the item says an AI model makes
    the answers. Its first sentence says "browse or search", the code-checked fact's words (D058 item 1), as the
    hard-questions guide says it (the [CMO's review of task 8b.2a](../../qa/cmo-review-guides-d058-8b.2a-2026-10-14.md),
    m6); its title is "No web browsing.", the live footer's words and `/safety`'s since task 8b.1 (question 7).
  - No word "safe" about Kheelu.
- Links: `/products/kheelu` → `meet-kheelu.html`; `/safety` → `safety.html`.

---

## Fold 9 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list; each URL is a link):

> **Sources**
>
> ¹ Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 22 January 2026, paragraph 1. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
>
> ² Rebecca Winthrop, Brookings Institution, "Is it time to measure cognitive stunting?" (commentary), 2026, section "Cognitive stunting" and the section on early evidence. https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/
>
> ³ Fairplay, "AI Toys are NOT Safe for Kids" (advisory), 2025, opening paragraph. https://fairplayforkids.org/pf/aitoyadvisory/
>
> ⁴ Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "What we found" and "Where they fall short". https://institute.commonsensemedia.org/risk-assessments/ai-toys
>
> ⁵ Center on the Developing Child at Harvard University, "Serve and Return" (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts. https://developingchild.harvard.edu/key-concept/serve-and-return/
>
> ⁶ Xu, Wang, Collins, Lee and Warschauer, "Same benefits, different communication patterns: Comparing Children's reading with a conversational agent vs. a human partner", Computers & Education, 2021, Abstract and section 4.3. https://doi.org/10.1016/j.compedu.2020.104059

- Round 2: the notes are renumbered in reading order, because the answer block (fold 2) now cites the press release
  first; note 1 is reused in fold 5. Note 4 adds "Where they fall short" for fold 5's third paragraph (CMO B1).
- Note 2 names the second section by description: its title carries a phrase the site guard bans for product copy.
- The same list is the BlogPosting `citation` array. Re-read the Brookings commentary, both Common Sense Media
  pages and the Harvard page before publishing ([source verification §7](../../research/source-verification.md#7-before-any-line-is-published)).

---

## Fold 10 · Related guides

**Copy:**

> **H2:** Related guides
>
> - What to look for in a safe AI toy
> - The hard questions parents ask about AI toys
> - Does a three-year-old need an AI tutor?

| Title (each guide's own card) | Real URL | Mockup link | Why it is linked |
|---|---|---|---|
| What to look for in a safe AI toy | `/stories/what-to-look-for-in-a-safe-ai-toy` | `story-what-to-look-for-in-a-safe-ai-toy.html` | The next step after fold 7's four questions: it owns "what to look for", worry by worry, and what child-safety groups found (Overlap, above). New in task 7.1d |
| The hard questions parents ask about AI toys | `/stories/questions-parents-ask-about-ai-toys` | `stories.html#ai-and-safety` | The maker's answers to a parent's own questions (listening, the voice, the data): the questions fold 7 tells a parent to put to any maker. Kept from the stub |
| Does a three-year-old need an AI tutor? | `/stories/does-a-three-year-old-need-an-ai-tutor` | `stories.html#ai-and-safety` | The same yes-or-no question at age 3, about AI for learning. Kept from the stub |

- The ring from [CMO review B](../../qa/cmo-review-built-b-2026-10-14.md) m3 (its table, `:223-234`; task 7.1d), in
  its order; titles render from each module's card, as the hub prints them ([stories.md](stories.md) fold 4).
- Out: "Raising a bilingual child in India", a language guide, which the review found an off-topic first next step
  after an AI page (m3, `should-kids-390-motion-07.jpg`). It now takes its incoming links from the talking guides.
- No two linked guides share a head photo: `kabir-02` here; `tara-02`, `tara-03` and `myra-04` on the three guides.

---

## Fold 11 · Close (journal close block)

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

- `cta` = `finale`. Close art: plain, without the doodle (an AI-and-safety guide; `PLAIN_CLOSE_ART` in
  `stories/articles/index.ts` is outside this task's Owns: reported to the main session).

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; the shell's, because the close carries the button.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 47 characters; the keyword map's draft ([§5.2](../../research/keyword-map.md#52-per-page)) |
| Meta ≤ 155: primary plus a concrete fact | Yes | 147 characters; names what the page gives (what groups advise, what children need, how to judge). No statistic in the meta: it can carry no source marker |
| One H1 with the primary | Yes | "Should kids use AI? ..." (the hub card, word for word) |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 H2 "Should kids use AI at all?" and its 59-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2; fold 7 carries the keyword map's suggested H2 ("How do you judge anything with AI inside?") |
| Secondaries | Yes | "AI chatbots and children": fold 4 ("general-purpose chatbots"); "is AI good for kids": answered by fold 2 and fold 6, not forced into a heading |
| Alt text | Yes | Describes the scene |
| Density | Yes | "should kids use AI" twice in `<main>` (H1, fold 2 H2): about 0.8% of about 990 words with the close, counting its 4 words; "Kheelu" 9 times including the close and its button (under 1%). Task 8b.2a changes neither count (about 992 words now) |
| Words never placed | Yes | No chatbot brand or age rule (C37 on hold), no "Brookings warns", no wake-word line, no "safe" about Kheelu, "friend", "tutor", "lessons", "adapts", brain promise for Kheelu, health terms, competitor or tested-toy names, "five checks"; since task 8b.2a ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)), no "about a minute", "servers in India", "in one tap", "closed content library" or "age-graded safety layer", and no "No open internet." title (fold 7's "Can it reach the open internet" is advice about any toy; its closed-set clause is question 4) |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | As Home |
| In-text links (product, guide, Safety page) | text links | none (not buttons) | n/a |

## Placeholders

None. (A rewritten article module may hold no open placeholder: `articles.test.ts`. The chatbot age-rule line, which
would need the founder's and counsel's answer on Kheelu's own providers' terms (C37), is left out rather than held.)

## Questions for the founder (website only)

1. **Byline.** The live article is by Aman Soni. (a) Keep his name, after he reads and owns it; (b) "The
   Kheelona team". **Recommend (a)**: "from people who build it" is the card's promise, and a named co-founder
   keeps it.
2. **What general chatbots allow children to do (C37, on hold).** The verified line on ChatGPT, Copilot, Claude
   and Gemini age rules would answer "AI chatbots and children" directly, but it invites the question of what
   Kheelu's own providers' terms say about children. (a) Leave it out (as drafted); (b) add it once the founder
   and counsel confirm the answer about Kheelu's providers. **Recommend (a)** until that answer exists; the page
   makes its case without naming any chatbot.
3. **Common Sense Media in the answer block (round 2, CMO M12, your option).** The block answer engines lift on
   their own now says "Common Sense Media advises against AI toys at 5 and under, and extreme caution from 6 to 12."
   (a) Keep it (as now drafted); (b) the round-1 answer, which gave only the conditions for AI in a young child's
   play and left the advice to fold 5. **Recommend (a)**: on the page that answers "should my young child use AI at
   all", an answer lifted without the main child-safety advice reads as the maker's view alone. It is a second short
   form of the B3 citation, so it follows whatever you sign for B3.
4. **Fold 7's first question now points at the withdrawn library (new, task 8b.2a).** "Can it reach the open
   internet, or only a closed set of material?" sets "a closed set of material" as the good answer. Fold 8 no longer
   says Kheelu is one (D058 item 1: its answers are generated by an AI model), yet a parent reading the question and
   then "**No open internet.**" can still take Kheelu for the closed set. (a) "Can it reach the open internet?" (the
   approved opening, the closed-set clause cut); (b) keep it as approved: fold 8's body now says plainly how answers
   are made. **Recommend (a):** the question should not hold up as the standard a design D058 withdrew. Advice, no
   new claim; the module line is `should-kids-use-ai.ts:121`.
5. **Fold 7's deletion bar (new, task 8b.2a; the CMO's m13 on the buyer's guide).** "Can you read every
   conversation, and delete any of it yourself?" Kheelu's answer is now: delete them all by deleting your account;
   removing one chat hides it on that phone only (D058 item 1). (a) "Can you read every conversation, and how do you
   delete it?" (the CMO's m13 wording, as a question); (b) keep it as approved. **Recommend (a)**, with the buyer's
   guide and the safe-AI-toy guide's question 4, so no guide sets a bar its own answer misses. Module line `:123`.
6. **The deletion sentence in fold 8 (new, task 8b.2a).** As the safe-AI-toy guide's question 5: (a) "Delete them all
   sooner by deleting your account." (as drafted); (b) the buyer's guide's two sentences, "from our servers" waiting on
   the CTO (the CMO's m6); (c) none. **Recommend (a).** If the CTO answers privacy question 11 (c), this becomes
   "Delete them sooner by deleting your account." (the CMO's review of task 8b.2a, m3).
7. **The internet item's title (new, task 8b.2a; applied as `/safety`'s).** As the safe-AI-toy guide's question 3:
   task 8b.1 retitled `/safety`'s item and the footer "No web browsing." (its question 5, option (a), for your OK), so
   fold 8 now reads "**No web browsing.**" too (the review of task 8b.2a, round 2; the CMO's m5). **Follow your
   `/safety` answer:** if you keep `/safety`'s "No open internet.", this guide takes it back with it, so the site says
   it one way.

## Sources

| Claim | Source |
|---|---|
| H1, lead (hub card, word for word); published 28 Jul 2026; live byline | `stories.md` fold 4; stub module; `src/lib/stories-expansion.ts:224-225` |
| Related list (fold 10), its order and titles | [CMO review B](../../qa/cmo-review-built-b-2026-10-14.md) m3, the ring table (`:223-234`); [tasks](../../engineering/tasks.md) 7.1d; titles as the hub cards print them, [stories.md](stories.md) fold 4 |
| "If you choose AI for your child's play, it should be built for their age, unable to browse the internet and fully visible to you" (fold 2) | Our own voice, no research claim: the C37 house line ([source verification C37](../../research/source-verification.md#c37--can-a-young-child-use-a-chatbot)), its opening as the [CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#new-minor-items) R2-1 words it; "unable to browse the internet" is the confirmed fact in generic form ([D017](../../decisions/D017-live-behaviour-claims-confirmed.md)) |
| Rebecca Winthrop, Brookings, May 2026: "cognitive stunting"; "reduces children's opportunities to engage in effortful thinking"; "general-purpose chatbots and AI companions not designed for learning"; evidence early | [source verification C14](../../research/source-verification.md#c14--cognitive-stunting); excerpt `C14-brookings-cognitive-stunting.md:24-41` |
| "Give your child time to think before anyone, or anything, gives the answer" | C14 house line |
| Fairplay advisory, November 2025, more than 150 experts and organisations, "that season" | [source verification C36](../../research/source-verification.md#c36--fairplays-advisory) (SUPPORTED); excerpt `C36-fairplay-ai-toys-advisory.md` |
| Common Sense Media advice (fold 2 in short form, both halves; fold 5 in full); 27% of replies in tests of three toys; attachment, data, reliability | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys); excerpts `C16-common-sense-press-release-2026-01-22.md:22-32`, `C16-common-sense-ai-toys-risk-assessment.md:29-35`; owner [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band); cite in full: working default B3 |
| Children aged 5 and under "cannot reliably distinguish AI from real people" (fold 5) | `C16-common-sense-ai-toys-risk-assessment.md:37-38` ("Where they fall short"); as on the approved [safe-AI-toy page](story-what-to-look-for-in-a-safe-ai-toy.md#fold-3--what-child-safety-groups-say), fold 3 |
| "Most of these concerns are about how a toy is built, and those you can check. The age advice is about young children themselves" (fold 5) | Our own voice, no research claim: the approved "Most of these worries are about how a toy is built" ([safe-AI-toy page](story-what-to-look-for-in-a-safe-ai-toy.md#fold-4--what-to-look-for-warning-by-warning), fold 4); the ground of the age advice is the risk assessment's own (`C16-common-sense-ai-toys-risk-assessment.md:37-41`, development); [CMO review B1](../../qa/cmo-review-articles-5.19-2026-10-14.md#b1--should-kids-use-ai-fold-5-the-line-after-the-two-warnings-overstates-what-the-sources-say) |
| "For us, AI near a young child is not a simple yes or no" (fold 7) | Our own view, marked as ours ([CMO review](../../qa/cmo-review-articles-5.19-2026-10-14.md#minor) M1) |
| Harvard serve-and-return line, with "a caring adult" | [source verification C07](../../research/source-verification.md#c07--serve-and-return); excerpt `C07-harvard-serve-and-return.md:22-43`; [claims §8](../../product/claims.md#8-brain-and-development-claims-with-their-anchors) |
| Xu 2021: 90 children aged 3 to 6; adult questions drew longer answers with more different words than a smart speaker's; accuracy about equal | [source verification C11](../../research/source-verification.md#c11--an-adult-still-draws-out-more-words-ages-3-to-6); excerpt `C11-xu-2021-computers-and-education.md:24-35, 71-79` |
| "You can do it anywhere: answer your child, then ask one back" | C07 house line |
| B3 answer, word for word | [safe-AI-toy page](story-what-to-look-for-in-a-safe-ai-toy.md#fold-5--how-kheelu-is-built-against-each-worry-the-one-in-text-product-link), fold 5 paragraph 1 (draft for the founder's signature) |
| Wake-up button; light | [D018](../../decisions/D018-wake-up-button.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 73 |
| Off after a couple of minutes of quiet (was "about a minute", task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, line 29 (narrows [D018](../../decisions/D018-wake-up-button.md), its line 10); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 80; live `c630a49` (#19) |
| Providers line (reply only, keep nothing, never train, contracts), no place named (", on servers in India" out, task 8b.2a) | [D019](../../decisions/D019-voice-providers.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) items 1-4 (lines 13-17; item 6 withdrawn, its line 10); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 6 (lines 41-43); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 79; [D041](../../decisions/D041-gate-a-round-1.md) (training clause kept, scoped); [D035](../../decisions/D035-model-training-opt-out.md), kept by D058 item 5 (line 40) |
| Read every conversation; 36 months then deleted automatically | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7 (the 36 months stands, its line 10); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 9 (lines 47-48); `RETENTION_LINE`, `src/content/en-IN/policies.ts:50`, first sentence only (task 8b.1's words) |
| Delete them all sooner by deleting your account (was "You can delete any of them sooner, in one tap.", task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, lines 25-26 (narrows [D017](../../decisions/D017-live-behaviour-claims-confirmed.md), its line 10); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 77 (the live "Delete it all by deleting your account"); [map §1](../../qa/live-main-reconciliation-2026-10-14.md#1-18-dd04e6d-the-parent-app-on-privacy-and-terms-for-the-app-store-and-play) P11-P12, lines 40-41 (live `dd04e6d`); the CMO review of task 8b.1, m7 (this form) |
| We don't sell your data; never used to advertise to your child | [D020](../../decisions/D020-provider-terms-and-no-sale.md); [D038](../../decisions/D038-trust-content-rulings.md) (F17) |
| No web browsing; can't browse or search the internet (was "No open internet." and "can't browse the internet", task 8b.2a) | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71; "browse or search": the code-checked fact ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1; c630a49) and the approved [Safety page](safety.md)'s "can't browse or search the web" (the CMO's m6); the title: the live footer's "No web browsing." (D058 item 1; [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded), c630a49), as task 8b.1 set it on `/safety` and in the footer (question 7) |
| Answers generated by an AI model, given child-safety rules and the child's age on every conversation, with Google's safety filters on top (was the closed library and the age-graded layer, task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, lines 27-28 (withdraws [D036](../../decisions/D036-launch-feature-claims.md) #5 and the layer wording, D036 line 10); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) lines 76, 83; live `c630a49` (#19) |
| The age is the one a parent enters in the parent app | [D036](../../decisions/D036-launch-feature-claims.md) lines 27-28 (not withdrawn) |
| Answers, then asks a question back; "so your child does the thinking" | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [messaging, objection answers](../../brand/messaging.md#objection-answers) |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3") |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block), [phone sticky bar](home.md#phone-sticky-bar) |
| Cut live lines | [age-band review](../../product/age-band-review.md) row 38; [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) row 14; [source verification C33, C36, C20](../../research/source-verification.md#4-ready-to-use-website-lines) |
| Photo | DS `03-cast.md:123`; file checked by eye 2026-10-13 |

## Changes after approval (task 5.20c)

- **Fold 2, the answer (CMO round 2, R2-1).** "If AI is part of a young child's play," became "If you choose AI for
  your child's play,". Why: straight after Common Sense Media's advice, the old clause read as if the advice had been
  set aside; the B3 answer leaves that choice to the parent ("so you can check it yourself and decide", fold 8), and
  answer engines lift this block on its own
  ([CMO review, new minor items](../../qa/cmo-review-articles-5.19-2026-10-14.md#new-minor-items)). The CMO's words,
  unchanged. The answer is now 59 words; the read time stays 5 minutes (927 words). Fold 2's notes, the keyword
  table and the Sources table follow. No research statement is new or changed: the line is the C37 house line, our
  own voice.
- **Checked, already done in round 2 (no change):** B1 (fold 5, paragraphs 3 and 4; note ⁴), M1 (fold 7, "For us,
  ..."), M12 (Common Sense Media in the answer, both halves).
- **Left as they are, waiting on the founder:** the three short forms of the Common Sense Media citation (answer,
  fold 5, fold 8) follow whatever the founder signs for B3 (open question P21; this page's question 3). The C37
  chatbot line stays out (question 2; founder and counsel).
- **Not changed:** the head photo, `kabir-02`, which heads no other guide and is used nowhere else on the site, so
  it keeps its one alt and M11's repeat does not arise. Kabir is 6 (`03-cast.md:13`), so a child alone with Kheelu
  suits the page ([CMO review 5.20c](../../qa/cmo-review-article-fixes-5.20c-2026-10-14.md) F2, applied in task 6.3).
  D025: none needed (the main session's ruling at the wave 5 part C merge, R2-3).
- **For the builder:** `should-kids-use-ai.ts`, the answer's third sentence, word for word as fold 2, in the same
  commit (`ai-safety-and-learning.test.tsx`); `updated` stays 2026-10-13.

## Changes after approval (task 7.1d)

- **Fold 10, the related guides** ([CMO review B](../../qa/cmo-review-built-b-2026-10-14.md) m3, the ring table at
  `:223-234`; [tasks](../../engineering/tasks.md) 7.1d). Was: "Raising a bilingual child in India", "Does a
  three-year-old need an AI tutor?", "The hard questions parents ask about AI toys". Now: "What to look for in a safe
  AI toy", "The hard questions parents ask about AI toys", "Does a three-year-old need an AI tutor?". Why: the review
  found this page sending readers to the bilingual guide first, a language guide after an AI page
  (`should-kids-390-motion-07.jpg`). The CMO's rebalanced ring keeps three related guides out and three in for every
  guide (`articles.test.ts:109-113`), leaves the three mockup guides' lists unchanged, and links no two guides that
  share a head photo. Titles are the hub cards' ([stories.md](stories.md) fold 4).
- **Notes kept true:** fold 10's table (now with a "why" column) and notes; the At a glance row on module values; the
  Sources table (the related list has its own row now); the front matter's sources. No other Copy block changed.
- **What does not change:** the read time (5 min: the related guides sit outside the count) and the keyword table.
  The new titles add three words to `<main>` (still about 990) and carry no keyword, no "Kheelu" and no banned word; the
  one "safe" is the safe-AI-toy guide's own title, about AI toys, never about Kheelu. No placeholder.
- **For the builder:** `should-kids-use-ai.ts:28`, `related: ["what-to-look-for-in-a-safe-ai-toy",
  "questions-parents-ask-about-ai-toys", "does-a-three-year-old-need-an-ai-tutor"]`, and the module's header note if it
  describes the list, in the same commit as the other nine modules. Touch nothing else in the module: task 7.1f edits
  its `meta`.

## Changes after approval (task 8b.2a)

The founder's [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) (2026-10-14): the site follows the
live team's code check of 12 October (`origin/main` `c630a49`, #19; `dd04e6d`, #18). This guide's lines are the
ones [journal pipeline §9.2](../../engineering/journal-pipeline.md#92-the-d058-corrections-still-in-the-guides) lists
(`should-kids-use-ai.ts:150, 155, 157, 162`), all in fold 8, and the words are the same as on the safe-AI-toy guide,
whose facts this fold repeats. The live words come from D058's "In the site's words" and the
[reconciliation map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded).
The CMO review of task 8b.2a read c630a49 with git show (2026-10-14); the quoted words match (its m8). Row 5 is the
review's round 2 (the CMO's m5 and m6). Contractions stay
([D059](../../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md) item 1). Every other word of the Copy
blocks is as approved.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 8, "The microphone." | "after about a minute of quiet" becomes "after a couple of minutes of quiet" | D058 item 1, line 29; D018 line 10; map §2 line 80 (`c630a49`). Module `:150` |
| 2 | Fold 8, "Your child's voice." | ", on servers in India" comes out; nothing named in its place. The rest is D020's line word for word (D020 items 1-4) | D058 item 6, lines 41-43; D020 line 10; map §2 line 79. As `/safety` fold 2 item 2 (task 8b.1, its question 7). Module `:155` |
| 3 | Fold 8, "Every conversation." | The retention sentences are `RETENTION_LINE` without "You can delete any of them sooner, in one tap." (task 8b.1 owns the words). After it: "Delete them all sooner by deleting your account." | D058 item 1, lines 25-26; D017 line 10; D020 line 10; map §2 line 77 and §1 P11-P12 (`dd04e6d`). 36 months then deleted automatically stays (D058 item 9). The CMO's form for this place (review of task 8b.1, m7), so fold 7's third question keeps an answer (question 6). Module `:157` |
| 4 | Fold 8, "No open internet." | "Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app." becomes "Its answers are generated by an AI model. On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google's safety filters on top." "Kheelu can't browse the internet." stays here (row 5 changes it) | D058 item 1, lines 27-28; D036 line 10; map §2 lines 76, 83 (`c630a49`). The approved "the age you enter in the parent app" is kept (D036 lines 27-28). Module `:162` |
| 5 | Fold 8, the internet item | The title "No open internet." becomes "No web browsing."; "Kheelu can't browse the internet." becomes "Kheelu can't browse or search the internet." | The CMO's review of task 8b.2a: m6 ("browse or search", the code-checked fact's words, as the hard-questions guide says it) and m5 (the title follows `/safety`'s and the footer's "No web browsing.", task 8b.1, so the site says it one way; question 7). Module `:161-162` |
| 6 | Notes | At a glance (read time), the fold 8 rulings note, keyword placements (density, words never placed), questions 4-7 (new; 6 with the CMO's m3 note, 7 applied as `/safety`'s), the Sources rows for items 1-5, front matter | So the page stays true |

**Counts.** +1, −4, −2, +5, +2: the article is about 929 words and stays 5 min; "Kheelu" stays 9; "should kids use AI" stays 2.
The answer block (fold 2, 59 words) is unchanged and inside 40-60. The source markers ¹-⁶ and fold 9 are unchanged:
no changed line carried one. No placeholder. Every new and kept word passes `test/guards/banned-phrases.data.ts`,
and none says "safe" about Kheelu.

**Kept, as D058 and the task ask:** the providers' don't-keep and don't-train promise (D020 items 1-4), "We don't sell
your data", 36 months then deleted automatically (D058 item 9). Kheelona's own model and the parent's opt-out stay on
`/terms` and `/privacy` (D035, D058 item 5), and nothing here implies there is no training. Bluetooth mode and the
languages do not appear on this page. This guide never had the "attack our own safety layer" line.

**Not changed, checked:** the title, meta description, H1, lead, fold 2's answer ("unable to browse the internet" stays
true), folds 3 to 7, 9, 10 and 11, the B3 paragraph, "Talking with, not at.", the age-3 line and the closing line.
Fold 7's first and third questions are left for the founder (questions 4 and 5); the internet item's title follows
`/safety`'s (question 7).

**For the builder (not edited here):**
- `src/content/en-IN/stories/articles/should-kids-use-ai.ts`, word for word as fold 8 above:
  - `:150`: "about a minute" → "a couple of minutes".
  - `:155`: drop ", on servers in India".
  - `:157`: `` `You can read every conversation in the parent app. ${RETENTION_LINE} Delete them all sooner by deleting your account.` ``
    (`RETENTION_LINE` by import, never retyped; it carries 8b.1's words).
  - `:161-162`: the title "No web browsing." and the new internet body.
  - Curly apostrophes as the module already uses (’).
- `ai-safety-and-learning.test.tsx:262` checks only that the module prints `RETENTION_LINE`, so it holds; no other
  test or fixture holds this guide's changed words (grep, 2026-10-14). `updated` as the main session directs.
- Until task 8b.1's `RETENTION_LINE` lands in this branch, the built line still prints the one-tap clause; this page
  already quotes the line without it.

**For the Gate B pack:** this guide has no mockup, so there is no text-parity deviation; items 1-4 are changed
approved lines for the founder's sign-off ([D015](../../decisions/D015-founder-signs-off-copy.md)), with row 5's
title and first sentence.
