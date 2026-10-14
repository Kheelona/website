---
title: "Story: What to look for in a safe AI toy (/stories/what-to-look-for-in-a-safe-ai-toy): page copy, Gate A draft"
type: page-copy
updated: 2026-10-14
cites_at: archive/pre-reset-2026-10-10
sources:
  - ../strategy.md (§1 safety order, §3.3, §4.1 keep for v1, §5 /stories/* row, §7)
  - ../gate-a-open-items.md (B3 Common Sense Media, B15 source markers, B28; §1 D041 rows)
  - ../pages/home.md (fold 6 safety block wording, CTA block, sticky bar)
  - ../pages/stories.md (journal close block, card)
  - ../tracking-inventory.md (§6)
  - ../../research/keyword-map.md (§4.2, §4.3 high-risk overlap, §5.1, §5.2, §6.5 AI4)
  - ../../research/source-verification.md (§4: C16, C36, C20; §5)
  - "../../raw/research/sources/: C16-common-sense-press-release-2026-01-22.md, C16-common-sense-ai-toys-risk-assessment.md, C36-fairplay-ai-toys-advisory.md"
  - ../../product/claims.md (§1, §2, §4, §4.1, §6, §7), ../../product/facts.md, ../../product/age-band-review.md (§4, row 37)
  - ../../brand/messaging.md (confirmed candidate lines)
  - ../../decisions/D017, D018, D019, D020, D026, D035, D036, D038, D041, D043
  - "src/lib/stories.ts:122-156 at tag archive/pre-reset-2026-10-10 (the live article); working tree read 2026-10-11, src/ unmodified per git status"
  - design-system/project/03-cast.md:118; assets/Kheelu/README.md; 01-writing.md:19-26,111-113 (read-only)
  - ../../qa/cmo-review-built-b-2026-10-14.md (m3, the related ring: this page's list unchanged, its incoming links change; task 7.1d, see the foot of this page)
  - ../../qa/cmo-review-related-ring-7.1d-2026-10-14.md (n2: fold 4's stale link note, fixed; see the foot of this page)
  - ../../decisions/D058 (items 1, 5, 6, 9), D059 (item 1: contractions stay); task 8b.2a, see the foot of this page
  - ../../qa/live-main-reconciliation-2026-10-14.md (§1 P11-P12; §2, origin/main c630a49 and dd04e6d)
  - ../../engineering/journal-pipeline.md (§9.2 rows for this guide; §12, 8b.2a)
  - "the CMO review of task 8b.1 (wiki/qa/cmo-review-claims-8b.1-2026-10-14.md on 8b.1's branch: m6, m7, m11, m12, m13) and 8b.1's safety.md (fold 2 item 2, question 7), for the forms reused here"
  - ../../qa/cmo-review-guides-d058-8b.2a-2026-10-14.md (m3, m6, m8; m5 with the review of task 8b.2a, round 2: the internet item follows /safety's title; see the foot of this page)
---

# Story: What to look for in a safe AI toy

> **INTERNAL page** ([D013](../../decisions/D013-internal-vs-external-content.md)). Only the text inside
> the **Copy** blocks is meant for the site. All copy is a draft for CMO review and the founder's sign-off
> at Gate A ([D015](../../decisions/D015-founder-signs-off-copy.md)).

## How to read this page

- **Copy** blocks (quoted) are the words to publish. Notes and tables are INTERNAL.
- `¹` to `³` are source markers ([D026](../../decisions/D026-public-statistics.md), working default
  [B15](../gate-a-open-items.md#3-other-website-items-on-working-defaults)), numbered in reading order and reused.
- `{price-source}`, `{delivery-source}`: as on [Home](home.md#how-to-read-this-page).
- Links show the real URL, then the mockup file in brackets.

## At a glance

| Item | Draft |
|---|---|
| Real URL | `https://kheelona.com/stories/what-to-look-for-in-a-safe-ai-toy` (mockup `story-what-to-look-for-in-a-safe-ai-toy.html`) |
| Page job | Answer "what should I look for in an AI toy?" for a worried parent of a 3 to 7 year old: what child-safety groups say, quoted in full; what to check, worry by worry; then how Kheelu is built against each, in checkable facts. Route to the product page once |
| Primary cluster | **what to look for in a safe AI toy** (CMP-2); secondaries "what child-safety groups say about AI toys", "can an AI toy say something inappropriate" ([keyword map §4.2](../../research/keyword-map.md#42-journal-articles-22)) |
| Title (44 characters) | What to look for in a safe AI toy · Kheelona |
| Meta description (149 characters) | What to look for in a safe AI toy: what Common Sense Media and Fairplay advise, the checks to make before one comes home, and how Kheelu measures up. |
| H1 | What to look for in a safe AI toy |
| Byline line | Aman Soni · First published 28 Jul 2026 · 5 min read (byline: question 2) |
| CTA | The close only: "Pre-order Kheelu", `cta` = `finale`; phone sticky bar `sticky-bar` |
| In-text product link | One, in fold 5 ("Kheelu" → `/products/kheelu`, `meet-kheelu.html`) |
| Page settings for the mockup | `buybar: true`, `active: "stories"`, `chrome: true` |

**Overlap with the buyer's guide** ([keyword map §4.3](../../research/keyword-map.md#43-overlap-and-cannibalisation-flags),
high risk). The guide `/ai-toys-for-kids-in-india` owns the short "five checks" for comparing toys. This article
drops the "five checks" frame (title, meta, list) and owns the other half: what the child-safety groups say, and
a worry-by-worry list built from their own findings. It links to the guide for the side-by-side checklist. The
optional 301 into the guide stays a later call on Search Console data (C11).

**What changed from the live article** (`src/lib/stories.ts:122-156`): three retired microphone lines
(wake word, "off should mean off", "wake-word listening", [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording)
rows 11-13) replaced by the wake-up button facts; "voice data that stays in your region" (banned,
[claims §4](../../product/claims.md#4-retired-or-banned-wording)) replaced by D020's providers line; the
age claim "built for children aged three and up" replaced by 3 to 7; "We mostly agree" replaced by the B3 answer;
Common Sense Media quoted as its own pages say it (the 6 to 12 band, "smart toys with voice-based interactions");
the Fairplay URL moved to the advisory page the verification read; the DPDP paragraph replaced by a link to the
data-law guide (its legal wording goes through the founder's review, [source verification C20](../../research/source-verification.md#c20--indias-data-law-and-children));
"certifications will be published before Kheelu ships" replaced by the BIS status ([claims §6](../../product/claims.md#6-certifications)).

---

## Fold 1 · Article head

**Copy:**

> **Breadcrumb:** Stories › AI toys and safety
>
> **H1:** What to look for in a safe AI toy
>
> What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.
>
> Aman Soni · First published 28 Jul 2026 · 5 min read

- **H1 accent:** `Hand` on "look for".
- Breadcrumb: "Stories" → `/stories` (`stories.html`); "AI toys and safety" → `/stories#ai-and-safety`.
- Dates and read time: as on the [learning toys page](story-learning-toys-for-a-three-year-old.md#fold-1--article-head)
  (published `src/lib/stories.ts:129`; "Updated" added by the build; about 912 words since task 8b.2a, about 925
  before: still 5 min).
- **Image** (`kh-photo --wide`, 16:9): `tara-02-evening-with-amma-web.webp`. Alt: "A laughing girl holds Kheelu
  on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her."
  (`03-cast.md:118`: "the parent app, family proof"; parents appear only with Tara.) No imagination layer:
  this is a safety page (DS `02-imagery.md:57`).

---

## Fold 2 · The answer first

**Copy:**

> **H2:** What should you look for in a safe AI toy?
>
> Look for mechanisms you can check, not promises. Ask when the microphone is on, whether the toy can reach the open internet, where your child's voice goes and who keeps it, whether you can read and delete every conversation, and how replies are filtered for your child's age. Then weigh what child-safety groups say.

- 54 words. Generic advice; no product in the answer, so it reads as useful to any parent.

---

## Fold 3 · What child-safety groups say

**Fold job:** quote the two warnings in full, with their real scope, before saying anything about Kheelu
(working default B3: cite it in full).

**Copy:**

> **H2:** What do child-safety groups say about AI toys?
>
> In November 2025 Fairplay, a children's advocacy group, published an advisory signed by more than 150 experts and organisations telling parents not to buy AI toys that season.¹
>
> In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as "smart toys with voice-based interactions", to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.² When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.³
>
> Common Sense Media also says children aged 5 and under "cannot reliably distinguish AI from real people".³
>
> Before any AI toy comes home, ask what it does with your child's voice, what you can see as a parent, and how it handles a hard question.

- Paragraphs 1 and 2 are the verified C36 and C16 lines, verbatim. Paragraph 3 quotes the risk assessment
  (excerpt C16 risk assessment:38). The last line is C16's house line.
- Never name the toys tested; never "at any age" for Fairplay (it sets no age line); never "found" a result at
  ages 3 to 5 (the tests used accounts set to 6 to 13) ([source verification C16, C36](../../research/source-verification.md#c16--common-sense-media-on-ai-toys)).

---

## Fold 4 · What to look for, warning by warning

**Fold job:** turn the warnings into questions a parent can put to any maker.

**Copy:**

> **H2:** What to look for, warning by warning
>
> Most of these worries are about how a toy is built, so check the build. Put each question below to the maker and expect a plain answer.
>
> **When is the microphone on?**
> Look for a toy that listens only after you or your child start it, and that shows you when it is listening. Ask whether it has a camera at all. Common Sense Media found that AI toys "collect extensive data in children's private spaces".²
>
> **Can it reach the open internet?**
> Ask where its answers come from. A toy that can browse or search can stumble onto things your child should not hear, and a filter on top then has to catch everything. Look for a toy that cannot browse the internet at all.
>
> **Can you read and delete every conversation?**
> You would not leave your child with a babysitter who won't tell you how the afternoon went. Ask whether you can read every conversation, word for word, and delete any of it yourself, without emailing anyone. A summary is not the conversation.
>
> **Where does your child's voice go, and who keeps it?**
> Ask who processes your child's voice and in which country, whether any of it is kept and for how long, and whether it is ever sold or used to advertise to your child. A vague answer is an answer. For what India's data law asks of companies, read [What India's data law asks of a toy that listens](https://kheelona.com/stories/ai-toys-and-indias-data-law).
>
> **Is it built for your child's age?**
> Ask how replies are filtered for the age of the child playing, and who sets that age. Ask, too, what the toy does when it doesn't know something. The answer you want: it says so.
>
> **Does it pretend to be more than a toy?**
> Common Sense Media says AI toy companions "create emotional attachment by design".² Look for a toy that tells your child it is a toy, and never asks your child to keep a secret from you.
>
> To compare toys side by side, use the shorter checklist in our guide to [AI toys for kids in India](https://kheelona.com/ai-toys-for-kids-in-india).

- Six questions as `h3`s (or an `FAQ`-style list with all items open: they are read, not hunted). Each maps to a
  finding: data in private spaces, inappropriate replies, parent visibility, data handling, age, attachment
  (excerpt C16 press release:28-32).
- Links: `/stories/ai-toys-and-indias-data-law` → `stories.html#ai-and-safety` (the frozen mockup points to the hub
  topic; the guide itself was rewritten in task 5.19);
  `/ai-toys-for-kids-in-india` → `ai-toys-for-kids-in-india.html`.
- Deliberately not asked: "is it used to train AI?". Kheelona's own model trains on voice and transcripts by
  default, disclosed on `/terms` and `/privacy` only ([D035](../../decisions/D035-model-training-opt-out.md));
  asking parents to check training here, then answering only for the providers, would mislead by omission.
- "Does the company earn more when your child plays longer?" (live "should kids use AI" article) is left out:
  the site has no confirmed line to answer it for Kheelu.

---

## Fold 5 · How Kheelu is built against each worry (the one in-text product link)

**Fold job:** give the signed B3 answer once, then Kheelu's checkable facts in the founder's order
([D020](../../decisions/D020-provider-terms-and-no-sale.md)), each matched to a worry above.

**Copy:**

> **H2:** How is Kheelu built against each worry?
>
> Kheelu is made for children aged 3 to 7. Common Sense Media's advice covers that whole range: avoid AI toys at 5 and under, and use extreme caution at 6 and 7. You should hear that from us. Here is how we built [Kheelu](https://kheelona.com/products/kheelu) on each point above, so you can check it yourself and decide.
>
> **The microphone.** It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it's listening. It switches itself off after a couple of minutes of quiet. Kheelu has no camera.
>
> **Your child's voice.** To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **Every conversation.** You can read every conversation in the parent app. Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. Delete them all sooner by deleting your account.
>
> **Your data.** We don't sell your data. Your child's data is never used to advertise to them.
>
> **No web browsing.** Kheelu can't browse or search the internet. Its answers are generated by an AI model. On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google's safety filters on top.
>
> **When it doesn't know.** It says so, instead of guessing.
>
> **A toy, and it says so.** It tells your child it's a toy, and never asks them to keep a secret from you.
>
> **Certification.** Kheelu's toy-safety (BIS) licence has been applied for and is not yet granted. No badge appears before it is earned.
>
> If your child is 3, keep a grown-up nearby while they play.
>
> Whether that is enough is your call. The detail is on our [Safety page](https://kheelona.com/safety), and you can ask us anything: WhatsApp or call +91 91875 46483.

- **The first paragraph is the B3 answer** (draft for the founder's signature, question 1): it states the
  conflict plainly, claims nothing the facts below do not show, and leaves the decision with the parent. It is
  written to be reused word for word on `/safety` and `/ai-toys-for-kids-in-india` wherever Common Sense Media
  is cited.
- `TrustList`, one column on phones; bold lead-ins are `kh-label` style, not headings. Order: button and light →
  providers → read and delete → no sale ([D020](../../decisions/D020-provider-terms-and-no-sale.md)), then the
  other confirmed facts.
- **Wording held to the rulings** (as corrected in task 8b.2a, [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)):
  - The microphone item is D018's lines (no wake-word phrase, no "no risk", no disconnect claim; the light's colour
    never named, [D018](../../decisions/D018-wake-up-button.md)), with the live team's code-checked "a couple of
    minutes of quiet" (D058 item 1).
  - The voice item is D020's line less ", on servers in India" (D058 item 6: some processors work outside India, and
    `/privacy` names them). Its promise (reply only, keep nothing, never train, by contract: D020 items 1-4) and its
    training clause scoped to the providers, as [D041](../../decisions/D041-gate-a-round-1.md) keeps it, are
    unchanged. No place is named in its stead, as on `/safety` (task 8b.1, its question 7, endorsed by the CMO):
    "through Kheelona's servers" would let "They don't keep it" read as our servers, which keep conversations for the
    parent app. That leaves fold 4's "in which country" without an answer here (question 6).
  - The retention sentence is `RETENTION_LINE` as task 8b.1 rewords it: its first sentence only, the one-tap clause
    gone (8b.1 owns the words, `policies.ts:50`). After it, "Delete them all sooner by deleting your account." is the
    live team's deletion fact (D058 item 1) in the form the CMO set for this place on the product page (review of task
    8b.1, m7); it names no servers, so m6 does not reach it (question 5).
  - The internet item says how a reply is made, in the code-checked words (D058 item 1: an AI model, given
    child-safety rules and the child's age on every conversation, with Google's safety filters on top). The buyer's
    guide's form (task 8b.1), keeping this item's own approved "the age you enter in the parent app"
    ([D036](../../decisions/D036-launch-feature-claims.md) lines 27-28), so fold 4's "who sets that age" keeps its
    answer. The closed library and the age-graded layer are gone, and the old Gate A flag (D019: nothing may suggest
    no outside AI model) no longer arises, because the item now says an AI model makes the answers. Its first sentence
    says "browse or search", the code-checked fact's words (D058 item 1), as the hard-questions guide says it (the
    [CMO's review of task 8b.2a](../../qa/cmo-review-guides-d058-8b.2a-2026-10-14.md), m6). Its title is "No web
    browsing.", the live footer's words and `/safety`'s since task 8b.1, so the site says it one way (question 3).
  - "Tested by us first" is gone (D058 item 1). No other testing line replaces it here (question 7).
  - No word "safe" about Kheelu anywhere ("child-safety rules" and "Google's safety filters" are about the rules and
    the filters).
- Links: `/products/kheelu` → `meet-kheelu.html`; `/safety` → `safety.html`; help line → `https://wa.me/919187546483`,
  `tel:+919187546483`.
- **Image** beside or after the list: `kheelu-belly-module.png`. Alt: "Kheelu's tummy unit up close, with its
  speaker, light ring and buttons." The DS has no photo of the light lit as a documented state, so the copy never
  describes how it looks.

---

## Fold 6 · Sources (article foot)

**Copy** (`kh-body-s`, numbered list):

> **Sources**
>
> ¹ Fairplay, "AI Toys are NOT Safe for Kids" (advisory), 2025, opening paragraph. https://fairplayforkids.org/pf/aitoyadvisory/
>
> ² Common Sense Media, "Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks" (press release), 22 January 2026, paragraph 1 and the list of findings. https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks
>
> ³ Common Sense Media Youth AI Safety Institute, "AI Toys" (risk assessment), 2026, "What we found" and "Where they fall short". https://institute.commonsensemedia.org/risk-assessments/ai-toys

- The same list is the BlogPosting `citation` array. Re-read both Common Sense pages before publishing
  (the risk assessment says "Updated Jan 22, 2026").

---

## Fold 7 · Related guides

**Copy:**

> **H2:** Related guides
>
> - The hard questions parents ask about AI toys
> - Should kids use AI? An honest answer from people who build it
> - What India's data law asks of a toy that listens

| Title | Real URL | Mockup link |
|---|---|---|
| The hard questions parents ask about AI toys | `/stories/questions-parents-ask-about-ai-toys` | `stories.html#ai-and-safety` |
| Should kids use AI? An honest answer from people who build it | `/stories/should-kids-use-ai` | `stories.html#ai-and-safety` |
| What India's data law asks of a toy that listens | `/stories/ai-toys-and-indias-data-law` | `stories.html#ai-and-safety` |

Text links only, so the page keeps one DS child.

---

## Fold 8 · Close (journal close block)

**Copy** (identical to the [hub close](stories.md#fold-6--close-journal-close-block)):

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

- `cta` = `finale`. The help line repeats fold 5's on purpose: it belongs to every CTA block
  ([strategy §3.2](../strategy.md#32-what-sits-beside-every-cta)). Optional product image as on the hub.

## Phone sticky bar

As Home: **₹499`{price-source}` today** · **refundable · ₹4,999`{price-source}` total (incl. GST)** · **Pre-order Kheelu**,
`cta` = `sticky-bar`; steps aside while the close's button is on screen.

---

## Keyword placements

| Rule ([keyword map §5](../../research/keyword-map.md#5-placement-rules)) | Met | Where |
|---|---|---|
| Title ≤ 60, primary at the start | Yes | 44 characters, primary first |
| Meta ≤ 155: primary plus a concrete fact | Yes | 149 characters; names the two groups |
| One H1 with the primary | Yes | As live |
| Primary in an answer-first block in the first ~100 words | Yes | Fold 2 question H2 and 54-word answer |
| An H2 with the primary or a close variant | Yes | Fold 2 ("look for in a safe AI toy"); fold 4 ("What to look for") |
| Secondary "what child-safety groups say about AI toys" | Yes | Fold 3 H2 (the keyword map's suggested H2) |
| Not competing with `/safety` ("are AI toys safe") | Yes | That phrase appears nowhere in title, meta or headings (the live meta asked it) |
| Alt text | Yes | Describes the scene; no keyword forced |
| Density | Yes | "safe AI toy" twice in `<main>` (H1, fold 2 H2) of about 912 words (under 1%; about 925 before task 8b.2a); "Kheelu" about 11 times including the close and its button (1.2%, under the 2% flag; task 8b.2a removed none), mostly in fold 5, where "it" already replaces other uses |
| Words never placed | Yes | No wake-word line, "safe" about Kheelu, "stays in your region", "only our own servers", health terms, competitor or tested-toy names; since task 8b.2a ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md)), no "about a minute", "servers in India", "in one tap", "closed content library", "age-graded safety layer" or "attack our own safety layer", and no "No open internet." title (fold 4's question "Can it reach the open internet?" is advice about any toy, and stays) |

## CTA tracking values

| Position | Element | `cta` value | Status |
|---|---|---|---|
| Laptop nav, phone drawer (chrome) | Pre-order Kheelu | `navbar`, `navbar-mobile` | Existing |
| Close | Pre-order Kheelu | `finale` | Existing |
| Phone sticky bar | Pre-order Kheelu | `sticky-bar` | New (as Home) |

## Placeholders

None.

## Questions for the founder (website only)

1. **The Common Sense Media answer (B3), fold 5, first paragraph.** It will be reused word for word wherever the
   site cites Common Sense Media. (a) Approve as drafted; (b) the same without "You should hear that from us."
   (plainer, less personal); (c) do not cite Common Sense Media anywhere. **Recommend (a).** (c) is not
   recommended: answer engines already quote the advice, and leaving it out reads as hiding it
   ([age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band)).
2. **Byline.** The live article is by Aman Soni. (a) Keep his name on the rewrite, after he reads it;
   (b) "The Kheelona team". **Recommend (a)**: a named co-founder and CTO behind a safety guide is worth more
   than a team name.
3. **The internet item's title (new, task 8b.2a; applied as (b)).** Fold 5's "**No open internet.**" is the title
   the CMO asked `/safety` to change to "No web browsing." (review of task 8b.1, m12; `/safety` question 5), because
   Kheelu does use home Wi-Fi to reach the AI model its body now names. Task 8b.1 retitled `/safety`'s item and the
   footer on every page "No web browsing." (its question 5, option (a), for your OK), so this guide and the
   should-kids guide now take (b), "**No web browsing.**", and the site says it one way (the review of task 8b.2a,
   round 2; the CMO's m5). (a) would keep "**No open internet.**": it answers fold 4's own question, "Can it reach the
   open internet?", and its body says exactly what is true (the CMO let the buyer's guide's check 3 stand on that
   ground). **Follow your `/safety` answer:** if you keep `/safety`'s "No open internet.", both guides take it back
   with it. Fold 4's "a filter on top then has to catch everything" stays either way: it is about toys that browse,
   and Kheelu can't.
4. **Fold 4's deletion bar (new, task 8b.2a; the CMO's m13 on the buyer's guide).** "Ask whether you can read every
   conversation, word for word, and delete any of it yourself, without emailing anyone." Kheelu's answer is now:
   delete them all by deleting your account, in the app (D058 item 1); removing one chat hides it on that phone only.
   Fold 5 promises an answer "on each point above". (a) "…word for word, and how you delete it, without emailing
   anyone." (the CMO's m13 form for the buyer's guide); (b) keep it as approved: fold 5 now answers plainly and a parent
   can judge. **Recommend (a)**, with the buyer's guide, so no guide sets a bar its own answer misses. Fold 2's
   "whether you can read and delete every conversation" is met by account deletion and stays.
5. **The deletion sentence in fold 5 (new, task 8b.2a).** `RETENTION_LINE` loses "You can delete any of them sooner,
   in one tap." (task 8b.1). (a) "Delete them all sooner by deleting your account." (as drafted: the live team's fact,
   the CMO's m7 form); (b) the buyer's guide's "Removing a chat in the app hides it on that phone. Deleting your
   account deletes the conversations and recordings from our servers." (fuller, but "from our servers" waits on the
   CTO's answer to privacy question 11, the CMO's m6); (c) no deletion sentence, leaving fold 4's question unanswered.
   **Recommend (a).** If the CTO answers privacy question 11 (c), this becomes "Delete them sooner by deleting your
   account." (the CMO's review of task 8b.2a, m3).
6. **Where the providers work (new, task 8b.2a).** Fold 4 tells a parent to ask "in which country" and that "A vague
   answer is an answer"; the voice item now names no place (D058 item 6). (a) Leave it: `/privacy` names the
   processors and says some process data outside India, and fold 5 ends on the Safety page link; (b) add, after "Our
   contracts with them say so.": "Our [privacy policy](https://kheelona.com/privacy) names them, and some of them
   process it outside India." (D058 item 6, in the live `/privacy` words, map §1 P9). **Recommend (b)**: the guide asks
   for the country, so our own answer should give it. The data-law and hard-questions guides ask "in which country" too
   (`ai-toys-and-indias-data-law.ts:126`, `questions-parents-ask-about-ai-toys.ts:107`), so all four guides should
   take the same answer.
7. **"When it doesn't know" and testing (new, task 8b.2a; the CMO's m11 for task 8b.1).** "Tested by us first" is
   gone (D058). "It says so, instead of guessing." (D036 #3) stays, but the live team's own rewrite dropped every
   doesn't-know line, and the CMO asks you and Aman to confirm that the child-safety rules tell the model to say when
   it doesn't know. (a) Keep the item until that answer comes; if it is not confirmed, cut it, and fold 4's "The answer
   you want: it says so." then sets a bar Kheelu misses; (b) cut it now. Not offered: `/safety`'s "Before launch, we
   test it by trying to make it say things it shouldn't." in the gone item's place, which would be a new line here and
   waits on the same confirmation. **Recommend (a).**

## Sources

| Claim | Source |
|---|---|
| Fairplay advisory, November 2025, more than 150 experts and organisations, "that season" | [source verification C36](../../research/source-verification.md#c36--fairplays-advisory) (SUPPORTED); excerpt `C36-fairplay-ai-toys-advisory.md:21-32, 42-47` |
| Common Sense Media advice: 5 and under, extreme caution 6 to 12, "smart toys with voice-based interactions"; 27% of replies; attachment, data, reliability | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys); excerpts `C16-common-sense-press-release-2026-01-22.md:19-32`, `C16-common-sense-ai-toys-risk-assessment.md:26-35`; owner [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band); cite in full: working default [B3](../gate-a-open-items.md#3-other-website-items-on-working-defaults) |
| "cannot reliably distinguish AI from real people" | `C16-common-sense-ai-toys-risk-assessment.md:37-38` |
| "collect extensive data in children's private spaces"; "create emotional attachment by design" | `C16-common-sense-press-release-2026-01-22.md:28, 31` |
| House line after the warnings | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys) house line |
| Kheelu ages 3 to 7 | [facts, age](../../product/facts.md#age) |
| Wake-up button; light | [D018](../../decisions/D018-wake-up-button.md) (draft lines); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 73; [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) |
| Off after a couple of minutes of quiet (was "about a minute", task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, line 29 (narrows [D018](../../decisions/D018-wake-up-button.md), its line 10); [reconciliation map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 80; live `c630a49` (#19) |
| No camera; says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| Providers line (reply only, keep nothing, never train, contracts), no place named (", on servers in India" out, task 8b.2a) | [D019](../../decisions/D019-voice-providers.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) items 1-4 (lines 13-17; item 6 withdrawn, its line 10); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 6 (lines 41-43); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 79; [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines) (Voice providers); training clause kept on customer pages: [D041](../../decisions/D041-gate-a-round-1.md); scope: [D035](../../decisions/D035-model-training-opt-out.md), kept by D058 item 5 (line 40) |
| Read every conversation; 36 months then deleted automatically | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) item 7 (the 36 months stands, its line 10); [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 9 (lines 47-48); `RETENTION_LINE`, `src/content/en-IN/policies.ts:50`, first sentence only (task 8b.1's words) |
| Delete them all sooner by deleting your account (was "You can delete any of them sooner, in one tap.", task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, lines 25-26 (narrows [D017](../../decisions/D017-live-behaviour-claims-confirmed.md), its line 10); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) line 77 (the live "Delete it all by deleting your account"); [map §1](../../qa/live-main-reconciliation-2026-10-14.md#1-18-dd04e6d-the-parent-app-on-privacy-and-terms-for-the-app-store-and-play) P11-P12, lines 40-41 (live `dd04e6d`); the CMO review of task 8b.1, m7 (this form) |
| We don't sell your data; never used to advertise to your child | [D020](../../decisions/D020-provider-terms-and-no-sale.md); [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| No web browsing; can't browse or search the internet (was "No open internet." and "can't browse the internet", task 8b.2a) | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) line 71; [keyword map §6.5](../../research/keyword-map.md#65-ai-and-safety-articles) AI4; "browse or search": the code-checked fact ([D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1; c630a49) and the approved [Safety page](safety.md)'s "can't browse or search the web" (the CMO's m6); the title: the live footer's "No web browsing." (D058 item 1; [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded), c630a49), as task 8b.1 set it on `/safety` and in the footer (question 3) |
| Answers generated by an AI model, given child-safety rules and the child's age on every conversation, with Google's safety filters on top (was the closed library and the age-graded layer, task 8b.2a) | [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) item 1, lines 27-28 (withdraws [D036](../../decisions/D036-launch-feature-claims.md) #5 and the layer wording, D036 line 10); [map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded) lines 76, 83; live `c630a49` (#19) |
| The age is the one a parent enters in the parent app | [D036](../../decisions/D036-launch-feature-claims.md) lines 27-28 (not withdrawn) |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md) #3, line 20 (not withdrawn by D058; question 7); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) |
| BIS licence applied for, not yet granted; no badge before it is earned | [claims §6](../../product/claims.md#6-certifications) (founder, 2026-10-11, L1; honest status EXTERNAL); DS `01-writing.md:36` |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3": age and safety answers) |
| Help line | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel) |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block), [phone sticky bar](home.md#phone-sticky-bar) |
| Replaced live lines | [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) rows 11-13; [claims §4](../../product/claims.md#4-retired-or-banned-wording) ("stays in your region"); [age-band review](../../product/age-band-review.md) row 37 |
| Published date 28 Jul 2026; live byline | `src/lib/stories.ts:128-129` |
| Photo | DS `03-cast.md:118`; `assets/Kheelu/README.md` (belly unit); files checked by eye 2026-10-11 |

## Changes after approval (task 7.1d)

**No change to this page's Copy or to fold 7.** [CMO built-page review B](../../qa/cmo-review-built-b-2026-10-14.md),
finding m3, rebalances the journal's related ring (14 slot changes across 10 guides;
[tasks](../../engineering/tasks.md), 7.1d) and keeps the three approved mockup guides' related lists as they are. Fold 7
still offers "The hard questions parents ask about AI toys", "Should kids use AI? An honest answer from people who build
it" and "What India's data law asks of a toy that listens", in that order, as `story-what-to-look-for-in-a-safe-ai-toy.html`
shows them (`articles.test.ts:347-348`); each is the guide's card title, as the hub prints it.

What the ring changes is which guides link here. The busy-hands and gentle-way guides no longer do (busy hands had it
from the legacy ring; gentle way took it in task 6.5, when the 3-6-9-12 guide left, D053); the hard-questions and
should-kids guides now list it first,
and with the data-law guide that makes three incoming links (`articles.test.ts:100-113`). None of the three shares
this page's head photo (`tara-02`): hard questions `tara-03`, should kids `kabir-02`, data law `ira-01` (task 5.20a's
rule). No module change for this page.

**One stale note fixed** ([ring review](../../qa/cmo-review-related-ring-7.1d-2026-10-14.md) n2, from before this
task). Fold 4's link note said the data-law link goes to the hub topic because that guide was "not rewritten yet". It
now says the frozen mockup points to the hub topic, and the guide itself was rewritten in task 5.19
(`mockup/story-what-to-look-for-in-a-safe-ai-toy.html:97`; [the data-law page](story-ai-toys-and-indias-data-law.md)).
A note only: fold 4's Copy and the fold 7 "Mockup link" column are unchanged.

## Changes after approval (task 8b.2a)

The founder's [D058](../../decisions/D058-follow-the-live-code-check-2026-10-14.md) (2026-10-14): the site follows the
live team's code check of 12 October (`origin/main` `c630a49`, #19; `dd04e6d`, #18). This guide's lines are the
ones [journal pipeline §9.2](../../engineering/journal-pipeline.md#92-the-d058-corrections-still-in-the-guides) lists
(`what-to-look-for-in-a-safe-ai-toy.ts:142, 147, 152, 158, 162`). The live words come from D058's "In the site's
words" and the [reconciliation map §2](../../qa/live-main-reconciliation-2026-10-14.md#2-19-c630a49-claims-withdrawn-or-reworded);
The CMO review of task 8b.2a read c630a49 with git show (2026-10-14); the quoted words match (its m8). Row 6 is the
review's round 2 (the CMO's m5 and m6). Contractions stay
([D059](../../decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md) item 1). Every other word of the Copy
blocks is as approved.

| # | Where | What changed | Why (finding or source line) |
|---|---|---|---|
| 1 | Fold 5, "The microphone." | "after about a minute of quiet" becomes "after a couple of minutes of quiet" | D058 item 1, line 29; D018 line 10; map §2 line 80 (`c630a49`: a conversation "ends after ~2 minutes of quiet", map line 64). Module `:142` |
| 2 | Fold 5, "Your child's voice." | ", on servers in India" comes out; nothing named in its place. The rest is D020's line word for word: reply only, keep nothing, never train, by contract (D020 items 1-4) | D058 item 6, lines 41-43 (some processors work outside India; `/privacy` names them); D020 line 10; map §2 line 79. The same choice as `/safety` fold 2 item 2 (task 8b.1, its question 7, which the CMO endorsed). Module `:147` |
| 3 | Fold 5, "Every conversation." | The retention sentences are `RETENTION_LINE` without "You can delete any of them sooner, in one tap." (task 8b.1 owns the words). After it: "Delete them all sooner by deleting your account." | D058 item 1, lines 25-26; D017 line 10; D020 line 10; map §2 line 77 and §1 P11-P12 (`dd04e6d`). 36 months then deleted automatically stays (D058 item 9). The new sentence is the live team's fact in the CMO's form for this place (review of task 8b.1, m7), so fold 4's question about deleting keeps an answer (question 5). Module `:152` |
| 4 | Fold 5, "No open internet." | "Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app." becomes "Its answers are generated by an AI model. On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google's safety filters on top." "Kheelu can't browse the internet." stays here (row 6 changes it) | D058 item 1, lines 27-28; D036 line 10; map §2 lines 76, 83 (`c630a49`). The buyer's guide's form (task 8b.1), keeping this item's approved "the age you enter in the parent app" (D036 lines 27-28). Module `:158` |
| 5 | Fold 5, "Tested by us first." | The item comes out (title and body) | D058 item 1, line 30 ("'We attack our own safety layer before every release' goes"); map §2 line 82. Nothing replaces it (question 7). Module `:162` (the `magnifying-glass` fact) |
| 6 | Fold 5, the internet item | The title "No open internet." becomes "No web browsing."; "Kheelu can't browse the internet." becomes "Kheelu can't browse or search the internet." | The CMO's review of task 8b.2a: m6 ("browse or search", the code-checked fact's words, as the hard-questions guide says it) and m5 (the title follows `/safety`'s and the footer's "No web browsing.", task 8b.1, so the site says it one way; question 3). Module `:157-158` |
| 7 | Notes | Fold 1 (word count), fold 5 (the rulings note), keyword placements (density, words never placed), questions 3-7 (new; 3 applied as (b), 5 with the CMO's m3 note), the Sources rows for items 1-6, front matter | So the page stays true |

**Counts.** Item 1 +1 word, item 2 −4, item 3 −2, item 4 +5, item 5 −13, item 6 +2: about 925 → about 912 words, so the read
time stays 5 min (`readingMinutes`, ÷ 200). "Kheelu" count unchanged (11); "safe AI toy" unchanged (2). The answer
block (fold 2, 54 words) is unchanged and inside 40-60. The source markers ¹-³ and fold 6 are unchanged: no changed
line carried one. No placeholder. Every new and kept word passes `test/guards/banned-phrases.data.ts`, and none
says "safe" about Kheelu.

**Kept, as D058 and the task ask:** the providers' don't-keep and don't-train promise (D020 items 1-4), "We don't sell
your data", 36 months then deleted automatically (D058 item 9), and fold 4's training note (Kheelona's own model and
the parent's opt-out stay on `/terms` and `/privacy`, D035, D058 item 5). Bluetooth mode and the languages do not
appear on this page.

**Not changed, checked:** the title, meta description, H1, lead, fold 2's answer (advice to any maker), folds 3, 4, 6, 7
and 8, the B3 paragraph, "When it doesn't know." (question 7), "A toy, and it says so.", "Certification.", the age-3
line, the help line, the images and alts. Fold 4's "delete any of it yourself" is left for the founder (question 4);
the internet item's title follows `/safety`'s (question 3).

**For the builder (not edited here):**
- `src/content/en-IN/stories/articles/what-to-look-for-in-a-safe-ai-toy.ts`, word for word as fold 5 above:
  - `:142`: "about a minute" → "a couple of minutes".
  - `:147`: drop ", on servers in India".
  - `:152`: `` `You can read every conversation in the parent app. ${RETENTION_LINE} Delete them all sooner by deleting your account.` ``
    (`RETENTION_LINE` by import, never retyped; it carries 8b.1's words).
  - `:157-158`: the title "No web browsing." and the new internet body.
  - `:162`: remove the `magnifying-glass` fact.
  - Curly apostrophes as the module already uses (’).
- `src/content/en-IN/stories/articles/approved-articles.test.tsx:129-130` pins the retention string exactly
  (`` `You can read every conversation in the parent app. ${RETENTION_LINE}` ``): it takes the new sentence after
  `${RETENTION_LINE}`. No other test or fixture holds this guide's changed words (grep, 2026-10-14). `updated` as
  the main session directs.
- Until task 8b.1's `RETENTION_LINE` lands in this branch, the built line still prints the one-tap clause; this page
  already quotes the line without it.

**Deviations for the main session to list at Gate B** (the frozen `mockup/story-what-to-look-for-in-a-safe-ai-toy.html`
keeps the approved words): lines 111 (microphone), 112 (providers), 113 (retention), 115 (internet: title and body) and 118 (the
"Tested by us first." item, which the built page no longer has). Each is a changed approved line for the founder's
sign-off at Gate B ([D015](../../decisions/D015-founder-signs-off-copy.md)). `test/e2e/support/deviations.ts` is task
8b.1's file.
