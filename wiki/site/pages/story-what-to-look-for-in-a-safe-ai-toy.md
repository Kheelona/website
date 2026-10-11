---
title: "Story: What to look for in a safe AI toy (/stories/what-to-look-for-in-a-safe-ai-toy): page copy, Gate A draft"
type: page-copy
updated: 2026-10-11
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
  (published `src/lib/stories.ts:129`; "Updated" added by the build; about 925 words).
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
- Links: `/stories/ai-toys-and-indias-data-law` → `stories.html#ai-and-safety` (not rewritten yet);
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
> **The microphone.** It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it's listening. It switches itself off after about a minute of quiet. Kheelu has no camera.
>
> **Your child's voice.** To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child's voice only to produce Kheelu's reply. They don't keep it, and they never use it to train their AI. Our contracts with them say so.
>
> **Every conversation.** You can read every conversation in the parent app. Your child's conversations stay in your parent app for 36 months, then they're deleted automatically. You can delete any of them sooner, in one tap.
>
> **Your data.** We don't sell your data. Your child's data is never used to advertise to them.
>
> **No open internet.** Kheelu can't browse the internet. Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app.
>
> **When it doesn't know.** It says so, instead of guessing.
>
> **A toy, and it says so.** It tells your child it's a toy, and never asks them to keep a secret from you.
>
> **Tested by us first.** We attack our own safety layer before every release.
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
- **Wording held to the rulings:** the microphone item is D018's lines (no wake-word phrase, no "no risk", no
  disconnect claim; the light's colour never named, [D018](../../decisions/D018-wake-up-button.md)); the voice item
  is D020's line verbatim, its training clause scoped to the providers as [D041](../../decisions/D041-gate-a-round-1.md)
  keeps it; the closed library and the age-graded layer sit after the providers line and omit "on the device and
  in the cloud", so nothing suggests no outside AI model is involved ([claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed),
  D019 flag); no word "safe" about Kheelu anywhere.
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
| Density | Yes | "safe AI toy" twice in `<main>` (H1, fold 2 H2) of about 925 words (under 1%); "Kheelu" about 11 times including the close and its button (1.2%, under the 2% flag), mostly in fold 5, where "it" already replaces other uses |
| Words never placed | Yes | No wake-word line, "safe" about Kheelu, "stays in your region", "only our own servers", health terms, competitor or tested-toy names |

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

## Sources

| Claim | Source |
|---|---|
| Fairplay advisory, November 2025, more than 150 experts and organisations, "that season" | [source verification C36](../../research/source-verification.md#c36--fairplays-advisory) (SUPPORTED); excerpt `C36-fairplay-ai-toys-advisory.md:21-32, 42-47` |
| Common Sense Media advice: 5 and under, extreme caution 6 to 12, "smart toys with voice-based interactions"; 27% of replies; attachment, data, reliability | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys); excerpts `C16-common-sense-press-release-2026-01-22.md:19-32`, `C16-common-sense-ai-toys-risk-assessment.md:26-35`; owner [age-band review §4](../../product/age-band-review.md#4-common-sense-media-and-the-3-to-7-band); cite in full: working default [B3](../gate-a-open-items.md#3-other-website-items-on-working-defaults) |
| "cannot reliably distinguish AI from real people" | `C16-common-sense-ai-toys-risk-assessment.md:37-38` |
| "collect extensive data in children's private spaces"; "create emotional attachment by design" | `C16-common-sense-press-release-2026-01-22.md:28, 31` |
| House line after the warnings | [source verification C16](../../research/source-verification.md#c16--common-sense-media-on-ai-toys) house line |
| Kheelu ages 3 to 7 | [facts, age](../../product/facts.md#age) |
| Wake-up button; light; off after about a minute of quiet | [D018](../../decisions/D018-wake-up-button.md) (draft lines); [claims §1](../../product/claims.md#1-confirmed-by-the-founder); [facts, listening](../../product/facts.md#what-it-listens-for-and-where-the-voice-goes) |
| No camera; says it is a toy; never asks a child to keep a secret | [claims §1](../../product/claims.md#1-confirmed-by-the-founder) (founder, 2026-10-04) |
| Providers line, verbatim (servers in India, reply only, keep nothing, never train, contracts) | [D019](../../decisions/D019-voice-providers.md), [D020](../../decisions/D020-provider-terms-and-no-sale.md); [messaging, confirmed candidate lines](../../brand/messaging.md#confirmed-candidate-lines) (Voice providers); training clause kept on customer pages: [D041](../../decisions/D041-gate-a-round-1.md); scope: [D035](../../decisions/D035-model-training-opt-out.md) |
| Read every conversation; 36 months then deleted automatically; delete sooner in one tap | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md); [D020](../../decisions/D020-provider-terms-and-no-sale.md) (retention line, verbatim); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| We don't sell your data; never used to advertise to your child | [D020](../../decisions/D020-provider-terms-and-no-sale.md); [D038](../../decisions/D038-trust-content-rulings.md) (F17); [claims §1](../../product/claims.md#1-confirmed-by-the-founder) |
| Can't browse the internet; curated, closed content library; age-graded safety layer set to the age a parent enters | [D017](../../decisions/D017-live-behaviour-claims-confirmed.md), [D036](../../decisions/D036-launch-feature-claims.md); [claims §1-§2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (Gate A flag met: written after the providers line); [keyword map §6.5](../../research/keyword-map.md#65-ai-and-safety-articles) AI4 |
| Says when it doesn't know | [D036](../../decisions/D036-launch-feature-claims.md); [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) |
| "We attack our own safety layer before every release" | [claims §2](../../product/claims.md#2-published-product-behaviour-claims-live-not-re-confirmed) (EXTERNAL, D017); red-teamed before launch [D036](../../decisions/D036-launch-feature-claims.md) |
| BIS licence applied for, not yet granted; no badge before it is earned | [claims §6](../../product/claims.md#6-certifications) (founder, 2026-10-11, L1; honest status EXTERNAL); DS `01-writing.md:36` |
| A grown-up nearby at 3 | [D041](../../decisions/D041-gate-a-round-1.md) ("Age 3": age and safety answers) |
| Help line | [D032](../../decisions/D032-grievance-block-and-call-line.md); [facts, support channel](../../product/facts.md#support-channel) |
| Close block, price sentence, sticky bar | [home, CTA block](home.md#cta-block), [phone sticky bar](home.md#phone-sticky-bar) |
| Replaced live lines | [claims §4.1](../../product/claims.md#41-the-retired-microphone-wording) rows 11-13; [claims §4](../../product/claims.md#4-retired-or-banned-wording) ("stays in your region"); [age-band review](../../product/age-band-review.md) row 37 |
| Published date 28 Jul 2026; live byline | `src/lib/stories.ts:128-129` |
| Photo | DS `03-cast.md:118`; `assets/Kheelu/README.md` (belly unit); files checked by eye 2026-10-11 |
