---
title: Claims register
type: product
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - "git show archive/mid-version-2026-10-10:docs/checkpoints/cmo-merge-2026-10.md (founder decisions 2026-10-04, lines 22-38)"
  - "git show archive/mid-version-2026-10-10:test/claims-gated.test.ts (lines 17-31)"
  - "git show archive/mid-version-2026-10-10:MARKETING-TODO.md (lines 1-169)"
  - "git show archive/mid-version-2026-10-10:src/lib/{safety,faq,comparison,product-facts}.ts"
  - src/config/site.ts, src/lib/product-facts.ts, src/lib/seo.ts, src/lib/stories.ts, src/lib/stories-expansion.ts, src/app/(site)/**/page.tsx, src/features/home/components/TrustRoom.tsx, src/components/organisms/Footer.tsx (tag archive/pre-reset-2026-10-10 = 77552ff, production on 2026-10-10)
  - src/lib/seo.test.ts, test/preorder-copy.test.ts (same tag)
  - "git grep -n -i -E 'microphone|\\bmic\\b|wakes to a word|between wakes' over src/ at both tags, 2026-10-10"
  - CLAUDE.md lines 690-709, 799 (same tag); docs/checkpoints/closed-rounds.md lines 153-156, 312-316
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx ("Claims guardrails", "Open questions")
  - wiki/raw/positioning/Kheelona Positioning (1).pdf ("Six decisions this week")
  - Live kheelona.com pages, plain GET, fetched 2026-10-10 17:43 PDT
  - https://kheelona.ai/safety, fetched 2026-10-10
  - https://developingchild.harvard.edu/key-concept/serve-and-return/, fetched 2026-10-10
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/ (Romeo et al. 2018), fetched 2026-10-10
  - wiki/open-questions.md (IDs Q3, Q4, F1-F11, G3, G5, G6, G8, section E; section F rulings R1-R10, all answered 2026-10-10 and 2026-10-11)
  - wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md, wiki/decisions/D009-brief-readings.md (the Site column, 2026-10-10)
  - "wiki/decisions/D011, D015-D029 (the founder's rulings of 2026-10-10 and 2026-10-11, applied here 2026-10-11)"
  - wiki/brand/messaging.md proof point 14 (the live locations of "answers, then asks a question back")
---

# Claims register

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Site column: [content boundary](../site/content-boundary.md) ([D013](../decisions/D013-internal-vs-external-content.md)).

What the site may say about Kheelu, what it may not, and why. The underlying facts are on
[facts.md](facts.md); every age statement is reviewed on [age-band-review.md](age-band-review.md).
Brand wording (friend, companion, tutor, AI toy as the headline noun) belongs to
[../brand/voice.md](../brand/voice.md) and [../brand/messaging.md](../brand/messaging.md); this page
lists only wording that makes a factual claim. Open items link to
[open questions](../open-questions.md) by ID.

**Status key.** CONFIRMED = the founder confirmed it, with a date. PUBLISHED = live, approved as copy
at the time, never re-confirmed as fact. NOT CONFIRMED = do not publish. RETIRED / BANNED = known
wrong or withdrawn. PLACEHOLDER = drafted, not real. "Live" means production today (`77552ff`, the
tag); "mid" means the unreleased mid version. Production is held unchanged until Gate B
([D011](../decisions/D011-production-held-until-gate-b.md)), so a banned line that is "still live"
stays live until then; the Site column describes the new site.

**Site key** (added 2026-10-10 under [D013](../decisions/D013-internal-vs-external-content.md)). EXTERNAL = may
be published as is, within its wording rules. EXTERNAL IF CONFIRMED = useful to a parent, but waits on the
named open question. INTERNAL = shapes strategy, never on the site. BANNED = retired or ruled-out
wording, never published. **Rulings R1 to R10**
([open questions](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)
section F) **are all answered** (2026-10-10 and 2026-10-11): every row that carried a "PENDING RULING"
mark now names the decision that settled it. **R1 ([D017](../decisions/D017-live-behaviour-claims-confirmed.md))
is applied row by row:** a live, founder-approved behaviour claim is EXTERNAL only where no later ruling
contradicts it ([D027](../decisions/D027-story-mode-wording.md) for Story mode;
[D018](../decisions/D018-wake-up-button.md), [D019](../decisions/D019-voice-providers.md) and R5 for
others). All draft wording is signed off by the founder at Gate A
([D015](../decisions/D015-founder-signs-off-copy.md)).

**Rule for the new site (brief section 4, item 2):** a claim ships only if it is CONFIRMED or
PUBLISHED and not contradicted below. Anything else is a marked placeholder plus an entry in
[../open-questions.md](../open-questions.md).

## 1. Confirmed by the founder

| Claim (wording that may ship) | Confirmed | Source | Live? | Site |
|---|---|---|---|---|
| Kheelu has **no camera** | 2026-10-04 | `mid:docs/checkpoints/cmo-merge-2026-10.md:28`; `mid:src/lib/comparison.ts:86` | Mid only | EXTERNAL |
| Kheelu **says it is a toy** and **never asks a child to keep a secret** from a parent | 2026-10-04 | same; `mid:src/lib/safety.ts:33-37` | Mid only | EXTERNAL |
| Kheelu **answers, then asks a question back** | 2026-10-10 ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) | D017; live at `src/components/organisms/KheeluModes.tsx:35, 41`, `src/lib/growth-arc.ts:32`, `src/app/(site)/page.tsx:77` ([messaging](../brand/messaging.md#proof-points) #14) | Live | EXTERNAL |
| Kheelu **cannot browse the internet** | 2026-10-10 ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) | D017; `src/lib/product-facts.ts:74`; `/safety` | Live | EXTERNAL. The rest of that live row ("closed library") is in section 2 |
| Parents can **read every conversation** in the app and **delete any conversation in one tap** | 2026-10-10 ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) | D017; `src/lib/product-facts.ts:79`; [facts](facts.md#parent-app) | Live | EXTERNAL |
| **No wake word: a wake-up button turns the microphone on**; one press starts a conversation; it switches itself off after about a minute of quiet; a light shows while it listens | 2026-10-10 ([D018](../decisions/D018-wake-up-button.md)) | D018 | Neither (the live site says the opposite: 4.1) | EXTERNAL, within D018's wording rules and draft lines: never "no risk" or "zero risk", no disconnect claim, never "nothing is ever recorded". The value is owned by [facts](facts.md#what-it-listens-for-and-where-the-voice-goes) |
| To understand and answer a child, Kheelu uses **trusted speech and AI providers, on servers in India**; they process the voice **only to produce Kheelu's reply**, **don't keep it**, **never train on it**, and **contracts say so** | 2026-10-10 ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | D019; D020 | Neither | EXTERNAL in D020's draft wording and guardrails ("trusted" is our choice, not a certification). **Replaces** the 2026-10-04 "Voice goes only to Kheelona's own servers, in India", withdrawn by D019 and now BANNED (section 4) |
| **We don't sell your data** | 2026-10-10 ([D020](../decisions/D020-provider-terms-and-no-sale.md)) | D020; live `src/app/(site)/privacy/page.tsx:189, 202` | Live (`/privacy`) | EXTERNAL |
| A child's data is **never used to advertise to your child**; Kheelu and the app show no ads | 2026-10-11 ([D038](../decisions/D038-trust-content-rulings.md), F17) | D038 | Neither | EXTERNAL |
| **Launch features** (D036): weekly four-skills report; remembers earlier conversations; says when it doesn't know; parent alerts; curated closed content library; age-graded safety layer set to the child's age (a parent sets the age in the app); red-teamed before launch; new-word count | 2026-10-11 ([D036](../decisions/D036-launch-feature-claims.md)) | D036 | Partly live (section 2) | EXTERNAL as product behaviour only: no learning-outcome claims (legal review L7), no "on-device-first" (D019) |
| A child's conversations stay in the parent app **for 36 months, then are deleted automatically**; parents can delete any sooner, in one tap | 2026-10-10 ([D020](../decisions/D020-provider-terms-and-no-sale.md)) | D020 | Neither | EXTERNAL in D020's wording; the matching DPDP line on `/privacy` goes through the [D029](../decisions/D029-grievance-officer-legal-review.md) review |
| **Story mode: stories, poems and jingles** a child enjoys and learns from; no WiFi needed | 2026-10-10 ([D027](../decisions/D027-story-mode-wording.md)) | D027 | Neither (live says "stories and lessons": section 2) | EXTERNAL in D027's draft; never "lessons", never interrupt-and-ask |
| Brain claims are **research-anchored**: conversation helps a young brain grow, and Kheelu gives a child more of it. Never "Kheelu grows the brain" | 2026-10-04 (decision 4); 2026-10-10 ([D016](../decisions/D016-brain-wording.md), R7) | `mid:docs/checkpoints/cmo-merge-2026-10.md:29`; `mid:test/claims-gated.test.ts:20-22`; D016 | Mid only | EXTERNAL, only in the anchored form ([section 8](#8-brain-and-development-claims-with-their-anchors)). "Brain development" may be a searched TOPIC in titles, headings and articles, never what Kheelu does (D016) |
| Speech and language disclaimer (draft): "Kheelu is a toy, not a therapy or treatment. If you're worried about your child's speech, talk to your paediatrician." | 2026-10-10 ([D025](../decisions/D025-speech-and-language.md), R4) | D025; a one-line disclaimer is live at `src/lib/stories-expansion.ts:377` | Live in one article | EXTERNAL, on **Terms** and **Meet Kheelu** (`/products/kheelu`) only, **not on Home**; journal articles about speech delay keep a one-line disclaimer inside the article. Every statement about speech or language cites a public source the Copywriter has read; never an outcome claim for Kheelu (D025) |

**Also founder-confirmed, owned on other pages:** the new Kheelona+ line
([facts.md](facts.md#kheelona), [D027](../decisions/D027-story-mode-wording.md)); the support channel
([facts.md](facts.md#support-channel)); deliveries for new orders from mid-November
([facts.md](facts.md#ship-date), [D023](../decisions/D023-new-order-delivery.md)) and the eight
languages ([facts.md](facts.md)); prices including GST, the GST invoice and the payment methods
(UPI, cards, net banking: [D024](../decisions/D024-payment-methods-gst.md); [pricing.md](pricing.md),
[policies.md](policies.md)); the price wording (₹499 first next to the CTA with the ₹4,999 total in
the same sentence; machine outputs lead with ₹4,999: [D028](../decisions/D028-price-wording.md),
[pricing.md](pricing.md)); returns, warranty, faulty units, pickup and refund
([D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md),
[policies.md](policies.md)); the grievance officer
([D029](../decisions/D029-grievance-officer-legal-review.md), [policies.md](policies.md)); seller
details ([policies.md](policies.md)); and the audience, parents of 3 to 7 year olds and family buying
for them (R9; [audience](../brand/audience.md)). The 2026-08-23 "3+, no ceiling" decision is
superseded for the new site: the published band is 3 to 7 ([open questions](../open-questions.md)
section E; [age-band-review.md](age-band-review.md)). Their Site values are set on those pages.

## 2. Published product-behaviour claims (live, not re-confirmed)

These are live and were approved as copy, but describe how the toy behaves. Nothing here can be
checked until units ship. **On 2026-10-10 the founder called them all real**
([D017](../decisions/D017-live-behaviour-claims-confirmed.md), R1 = c), so the heading's "not
re-confirmed" is history. D017 is applied **row by row**: a row is EXTERNAL only where no later
ruling contradicts it. [D027](../decisions/D027-story-mode-wording.md) narrowed D017 (Story mode has
no interrupt-and-ask feature); [D019](../decisions/D019-voice-providers.md) and R5 correct two more.
Claims that are not live (for example a weekly four-skills report) stay behind
[open questions](../open-questions.md) F8 (section 3).

| Claim as published | Where (live) | Site |
|---|---|---|
| The first thinking happens on the toy, before anything is sent | `/`, `/safety` (`src/app/(site)/safety/page.tsx:36,82,90`), `/products/kheelu` step 02 (`page.tsx:71`) | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)), **flag for Gate A** (D019): write it beside the providers line (section 1) and never so it implies the voice stays on the toy or that no outside AI model is involved ([D019](../decisions/D019-voice-providers.md)). Not "on-device-first processing" ([D036](../decisions/D036-launch-feature-claims.md)) |
| Answers come from a closed library; cannot browse or search | `src/lib/product-facts.ts:74`; `/safety` | "Cannot browse or search": EXTERNAL (D017, named; section 1). "Answers come from a closed library": EXTERNAL (D017); flag for Gate A: beside the outside AI providers (D019) it must not suggest that no AI model is involved |
| Every reply passes an **age-graded safety layer**, on the device and in the cloud | `src/app/(site)/safety/page.tsx:37,94`; `/llms.txt` line 27 | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md); confirmed for launch, set to the age a parent enters in the app, [D036](../decisions/D036-launch-feature-claims.md)), **flag for Gate A** (D019): "in the cloud" sits beside the outside AI providers, so it must not suggest that no outside AI model is involved |
| "We attack our own safety layer before every release" | `src/app/(site)/safety/page.tsx:94` | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) |
| When it does not know, it says so and moves on | `src/lib/stories-expansion.ts` ("questions parents ask") | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) |
| Remembers the words a child knows; picks up where they stopped | `/`, `/products/kheelu` | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); never as "long-term memory" (section 4) |
| "The feeling gets read … Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood" | `src/app/(site)/products/kheelu/page.tsx:72`. Conflicted with the positioning's ban on "maps emotions" (positioning docx, "Memory and emotions") | BANNED (R5, founder 2026-10-10: emotion reading is dropped from the new site, like "adapts"; section 4) |
| Parent app: full log, one-tap delete, topics, quiet hours, new-word count, daily summary, alerts | see [facts.md](facts.md#parent-app) | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); the new-word count and alerts are also confirmed for launch by [D036](../decisions/D036-launch-feature-claims.md). Except the **daily summary** and **alerts**: EXTERNAL IF CONFIRMED until the independent legal review of [D029](../decisions/D029-grievance-officer-legal-review.md) settles DPDP section 9 (behavioural monitoring; section 7) |
| PlayOS is "a small language model built only for children, not shrunk from adult AI"; "Own the model … Nothing rented that matters" | `src/app/llms.txt/route.ts:59`; `src/app/(site)/playos/page.tsx:146-147` | "Own the model … Nothing rented that matters": BANNED ([D019](../decisions/D019-voice-providers.md)). "A small language model built only for children, not shrunk from adult AI": BANNED as part of the same "own the model" family (this page's reading: D019 names the AI model among the outside providers; the founder may narrow it). `/playos` itself is grey at Gate A (G8) |
| The model "learns from conversations families separately opt into" | `src/app/(site)/playos/page.tsx:147,258` | BANNED: false under [D035](../decisions/D035-model-training-opt-out.md) (2026-10-11): Kheelona's own model trains on voice and transcripts **by default**, and parents can opt out. That is disclosed on `/terms` and `/privacy` only, by the founder's choice; customer pages say nothing about training and never imply there is none (D035) |
| "No wheels, no face screen and no moving parts" | `src/app/llms.txt/route.ts:49` | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); flag for Gate A: Kheelu has a physical wake-up button ([D018](../decisions/D018-wake-up-button.md)), so "no moving parts" must not read as "no button" |
| Story mode: "stories and lessons" a child "can interrupt, question and be quizzed on" | `src/lib/product-facts.ts:72`; `src/app/(site)/products/kheelu/page.tsx:237` ([facts](facts.md#modes-and-connectivity)) | BANNED ([D027](../decisions/D027-story-mode-wording.md)): there is no interrupt-and-ask feature, and "lessons" is dropped everywhere. This row is the one D027 removes from D017. The replacement is in section 1 |

## 3. Not confirmed: do not publish

| Claim | Why it is held | Source | Open question | Site |
|---|---|---|---|---|
| "Talking is free for life"; "talking, safety controls and the log are free for life" | NOT confirmed 2026-10-04. Only the Kheelona+ line ([facts.md](facts.md#kheelona)) is sanctioned; its "keep working for life, with no subscription needed" ([D027](../decisions/D027-story-mode-wording.md)) is the only for-life wording | `mid:test/claims-gated.test.ts:18,29`; `mid:MARKETING-TODO.md:92,150` | F7 | EXTERNAL IF CONFIRMED (F7) |
| "Kheelu keeps talking whether or not you renew" | The same claim in other words. **Live** in the journal | `src/lib/stories-expansion.ts:504` (live); banned at `mid:test/claims-gated.test.ts:29` | F7 | EXTERNAL IF CONFIRMED (F7) |
| "Kheelu helps your child's brain grow" (positioning's hero line) | Positioning allows it **only after a named child-development advisor signs off**; founder decision 4 bans it as written, and [D016](../decisions/D016-brain-wording.md) (R7 = b) keeps it banned | positioning docx ("Can claim after advisor sign-off"); `mid:test/claims-gated.test.ts:20-22`; D016 | R7 answered (D016); F9 answered: there is no advisor ([D038](../decisions/D038-trust-content-rulings.md)) | BANNED (D016; section 4) |
| Any pilot result ("children learnt X words", "answered X questions a session") | Needs pilot data with the sample shown | positioning docx ("Results") | none yet | EXTERNAL IF CONFIRMED (no ID yet): real pilot data with the sample shown |
| "Our pilot results will be published, good or bad" | Unsigned public commitment | `mid:test/claims-gated.test.ts:25`; positioning docx objection table repeats it | F10, answered | BANNED: the founder dropped the line ([D038](../decisions/D038-trust-content-rulings.md)) |
| "We plan to be here for years" | Unsigned continuity promise | `mid:test/claims-gated.test.ts:24` | none | EXTERNAL IF CONFIRMED (no ID yet): needs the founder's signature |
| Where Kheelu is made | See 3.1 below | | F3, answered | EXTERNAL: made in India; manufacturer Kheelona Robotics Pvt Ltd ([D034](../decisions/D034-origin-manufacturer-mrp.md)) |
| "[1-year] warranty", "15-day returns" | Bracketed in the positioning; the founder decided different terms: 7-day returns ([D021](../decisions/D021-returns-policy.md)) and a 6-month warranty ([D022](../decisions/D022-warranty-replacement-refund.md)) | positioning docx objection table; [policies.md](policies.md) | F1, answered (D021, D022) | BANNED (wrong numbers); the decided terms are owned by [policies.md](policies.md) |
| "Recordings kept for X days"; "voice is / is not used to train AI" | Was open in the positioning (2026-10-08). **Answered 2026-10-10** ([D020](../decisions/D020-provider-terms-and-no-sale.md)): transcripts kept 36 months, then deleted automatically; the outside providers never train on a child's voice | positioning docx objection table and "Decisions for the founders"; D020 | F5, answered | EXTERNAL only in D020's wording (section 1), scoped to the providers. Any "X days" form is BANNED. Any "not used to train AI" form is BANNED: Kheelona's own model trains by default ([D035](../decisions/D035-model-training-opt-out.md)) |
| "See how long your child talks" (usage time in the app) | **Confirmed for launch 2026-10-11** ([D044](../decisions/D044-app-screens-on-the-site.md)): the activity screen shows talking minutes per day and per chat | `mid:test/claims-gated.test.ts:27`; [D044](../decisions/D044-app-screens-on-the-site.md) | F8 | EXTERNAL (D044) |
| "Bedtime stories only after 7" | Unconfirmed parent-app control | `mid:test/claims-gated.test.ts:28` | F8 | EXTERNAL IF CONFIRMED (F8) |
| A weekly four-skills report for parents | In the positioning only, not live; **confirmed for launch 2026-10-11** | [positioning](../brand/positioning.md); [D036](../decisions/D036-launch-feature-claims.md) | F8, answered | EXTERNAL ([D036](../decisions/D036-launch-feature-claims.md)): what the report shows, never an outcome for the child |
| The **"adapts" family**: "Kheelu adapts", "at your child's pace", "grows with your child" (live, `src/lib/growth-arc.ts:47`) and any synonym ("adjusts to your child", "personalises itself", "tailors itself", "levels up with them") | Not confirmed: F8 was answered for eight features ([D036](../decisions/D036-launch-feature-claims.md)) and adaptation is not one of them; the positioning drops "adapts"; R5 bans emotion reading on the same footing. **CTO ruling, 2026-10-11** ([rulings check](../qa/rulings-check-2026-10-11.md) 1d) | `mid:MARKETING-TODO.md:52`; positioning docx ("Other words to stop using"); D036 | F8, answered | BANNED as written. Describe only the confirmed mechanisms: a parent sets the child's age in the app and the age-graded safety layer follows it, and Kheelu remembers earlier conversations ([D036](../decisions/D036-launch-feature-claims.md)). [Messaging](../brand/messaging.md) and [voice](../brand/voice.md) link here |
| Understands a 3-year-old's speech first time | Needs a pilot rate; positioning notes "speech recognition is weaker under 4". Speech wording also follows [D025](../decisions/D025-speech-and-language.md) | `mid:MARKETING-TODO.md:126`; positioning docx ("Where I depart from the research") | G5 | EXTERNAL IF CONFIRMED (G5) |
| "[X] of 500 left" | The live count is never published, by design | `mid:MARKETING-TODO.md:66`; [pricing.md](pricing.md) | none (by design) | INTERNAL (commercial; never published, by design) |
| Market price ranges in a comparison row | Need checked ranges and a "checked on" date. Note the live buyer's guide already states "around ₹14,000 for a robot with a screen" without a source | `mid:src/lib/comparison.ts:22-24`; `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:131` | Q4 (SKM's competitor review) | INTERNAL: competitor prices ([D013](../decisions/D013-internal-vs-external-content.md), which closed Q4); the live "around ₹14,000" line does not carry over |
| A named advisor, "Reviewed by [advisor]" | There is no advisor (founder, 2026-10-11) | `mid:MARKETING-TODO.md:70,82`; [D038](../decisions/D038-trust-content-rulings.md) | F9, answered | BANNED: every advisor reference is dropped (D038) |

### 3.1 Origin: "designed and built here"

This page owns the origin issue.

**Answered 2026-10-11 ([D034](../decisions/D034-origin-manufacturer-mrp.md)):** made in India;
manufacturer Kheelona Robotics Pvt Ltd. "Made in India" is now EXTERNAL (product page declarations
and spec table; the `seo.test.ts` ban changes with it in the build). "Built here" (Bengaluru) stays
out: where in India the factory is was not stated, so the new `/contact` uses the mid version's
"Kheelu is designed here, by parents who use it at home." The notes below are the history.

- **Where the toy is made has never been claimed, and is not known to this project.** The gap is
  deliberate (`src/lib/product-facts.ts:42-46`: "where the toy is MADE is a different claim and this
  site has never made it"); `src/lib/seo.test.ts:389` bans "made in|built in|manufactured in" in the
  spec table; the mid version banned "Made in Bengaluru / India", "designed and built here" and
  "built in Bengaluru" anywhere in copy (`mid:test/claims-gated.test.ts:26,30`).
- **Live contradiction:** the `/contact` lede reads "The toy is designed and built here, by parents
  who use it at home." (`src/app/(site)/contact/page.tsx:152`). "Built here" reads as a
  manufacture claim. The mid version changed it to "Kheelu is designed here, by parents who use it
  at home." (`mid:src/app/(site)/contact/page.tsx:152`).
- **Fine as written:** the footer's "Designed by parents in Bengaluru." (`src/components/organisms/Footer.tsx:36`,
  every page) and "We are a small team in Bengaluru" (`src/app/(site)/contact/page.tsx:26,96`).
- **May ship:** "designed in Bengaluru". Anything about where it is made, and the Legal Metrology
  declarations (country of origin, manufacturer or importer), waits on
  [open questions](../open-questions.md) F3.

**Site:** "designed in Bengaluru", the footer line and "a small team in Bengaluru" are EXTERNAL.
"Designed and built here", "built in Bengaluru" and "Made in Bengaluru / India" are BANNED. Where it
is made, and the Legal Metrology declarations, are EXTERNAL IF CONFIRMED (F3).

## 4. Retired or banned wording

"Live" in the last column means production still publishes it today, so the new site must not carry
it over. Live copy is not fixed before Gate B: Q3 was answered "hold everything"
([D011](../decisions/D011-production-held-until-gate-b.md)).

| Wording | Status and reason | Guard / source | Still live? | Site |
|---|---|---|---|---|
| "The microphone is off. Not muted. Off." and every variant | RETIRED 2026-10-04; and since 2026-10-10 there is no wake word at all ([D018](../decisions/D018-wake-up-button.md)). Full list of variants and locations in 4.1 | 4.1 | **Yes**, 15 places (plus rows 16-22 of the wake-word family) | BANNED: replace each with the D018 button wording (4.1) |
| "Listens only for its wake word, and records or sends nothing before it" (the 2026-10-04 replacement), "Kheelu wakes to a word", "Hey Kheelu" style prompts, a promise to publish the wake word, and any wording that implies a wake word | BANNED 2026-10-10: Kheelu has no wake word ([D018](../decisions/D018-wake-up-button.md)) | D018; `mid:src/lib/faq.ts:93-96`; `mid:src/lib/product-facts.ts:76` | The 2026-10-04 line: mid only. "Kheelu wakes to a word" and the wake-word promise: **yes** (4.1, rows 16-17) | BANNED |
| Absolutes about the microphone: "no risk", "zero risk", "the microphone is physically / electrically disconnected", "nothing is ever recorded" | D018 wording rules: an absolute safety claim needs substantiation under ASCI; no disconnect is confirmed; conversations ARE kept for parents ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | [D018](../decisions/D018-wake-up-button.md) | Not checked on the live site | BANNED |
| "Internet access: None" | Wrong: AI mode uses home WiFi. Say "cannot browse the internet" ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)) | `mid:src/lib/product-facts.ts:77-80` | Yes (spec table, JSON-LD, buyer's guide) | BANNED |
| "Stays in your region" / "Kheelona's own voice brain, stays in your region" / "Region-pinned" (the live `/safety` card title, `wt:src/app/(site)/safety/page.tsx:42`) | Superseded: voice is processed by outside providers on servers in India ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | `mid:docs/checkpoints/cmo-merge-2026-10.md:188-189`; D019 | Yes (`/safety`, `/privacy`, spec table, `/llms.txt`, journal) | BANNED |
| "Your child's voice goes only to Kheelona's own servers, in India"; "only our own servers"; "connects only to our own servers"; "never leaves Kheelona" | Confirmed 2026-10-04, withdrawn 2026-10-10: Kheelu uses multiple outside providers ([D019](../decisions/D019-voice-providers.md)) | D019; `mid:src/lib/safety.ts:47-50`; `mid:src/lib/product-facts.ts:77-80, 86-88` | Mid only | BANNED |
| "Own the model … Nothing rented that matters" and its "own the model" family (this page also reads "a small language model built only for children, not shrunk from adult AI" as part of it: section 2) | [D019](../decisions/D019-voice-providers.md) | D019; `src/app/(site)/playos/page.tsx:146-147`; `src/app/llms.txt/route.ts:59` | Yes (`/playos`, `/llms.txt`) | BANNED |
| "Answers … work offline" (PlayOS) | Wrong for AI mode | `mid:docs/checkpoints/cmo-merge-2026-10.md` commit 12 | Yes (`playos/page.tsx:109`) | BANNED |
| Emotion reading: "The feeling gets read … the answer meets the mood", mood reading, "maps emotions and triggers" | BANNED 2026-10-10 (R5, founder), like "adapts" | [open questions](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time) R5; positioning docx, "Claims guardrails" | Yes (`products/kheelu/page.tsx:72`) | BANNED |
| Story mode "stories and lessons" a child "can interrupt, question and be quizzed on"; "lessons" in any product claim | [D027](../decisions/D027-story-mode-wording.md): no interrupt-and-ask feature exists; "lessons" is dropped everywhere (the stop-word itself: [messaging](../brand/messaging.md#words-to-stop-using)) | D027 | Yes (`products/kheelu/page.tsx:237`; `KHEELONA_PLUS_LINE`, `src/config/site.ts:126-134`) | BANNED |
| "grows their vocabulary" (AI mode) | Not research-anchored (decision 4; [D016](../decisions/D016-brain-wording.md)) | same | Yes (`KheeluModes.tsx:35`) | BANNED |
| "cognitive development toy" | Retired on mid for "a screen-free AI toy" | same | Yes (`stories.ts:118`); `/playos` chip "Cognitive development" (`playos/page.tsx:47`) | BANNED |
| "Families already using Kheelu." | Kheelu has not shipped; only pilot families have used it | mid review round 2 | Yes (`store/page.tsx:116`) | BANNED |
| "Meet Kheelu on 20 October" | 20 October is when shipping **starts**, not delivery; new orders deliver from mid-November ([D023](../decisions/D023-new-order-delivery.md)) | `mid:test/claims-gated.test.ts:23` | No | BANNED |
| "Kheelu helps / grows / builds / develops / supports … brain"; "supports your child's brain development"; "helps your child's brain grow"; "brain-development toy" as a product label | Founder decision 4; [D016](../decisions/D016-brain-wording.md) (R7 = b) | `mid:test/claims-gated.test.ts:20-22`; D016 | No exact match live | BANNED. "Brain development" stays usable as a searched TOPIC in titles, headings and articles (D016; section 8) |
| "Made in Bengaluru", "built in Bengaluru", "designed and built here" | Where in India the factory is was not stated; "Made in India" itself is now EXTERNAL ([D034](../decisions/D034-origin-manufacturer-mrp.md), 3.1) | `mid:test/claims-gated.test.ts:26,30`; D034 | "Designed and built here": yes (`/contact`) | BANNED as written; say "Made in India" (D034) and "designed here, by parents" (3.1) |
| Dead age ranges "2 to 5", "2 to 14", "3 to 6", "3 to 10", "2 to 8" | Retired 2026-08-23 | `src/lib/seo.test.ts:92-98`; live `/llms.txt` line 14 | No (except third-party guidance quoted in the journal, which is fine) | BANNED |
| "30 September", "₹9,999", "1 October 2026"; "costs nothing", "pre-order list", "waitlist", "no commitment", "reserving is free" | Retired offer terms | `test/preorder-copy.test.ts:40-100` | No | BANNED |
| "Lumi" as the current name | Renamed 2026-09-05; allowed only as `alternateName` and in the "Is Kheelu the same as Lumi?" answer | `CLAUDE.md` rename banner | Only as allowed | BANNED as the current name; EXTERNAL only where allowed |
| Positioning's never-say list: "boosts IQ", "makes your child smarter", "develops the brain 2x faster", "genius", "don't miss the window", "your child will fall behind", "Harvard-proven", "scientifically proven toy", "as good as a parent", "maps emotions and triggers", "long-term memory", any health claim (speech delay, late talkers, ADHD, autism, therapy) | ASCI substantiation and anti-anxiety rules | positioning docx, "Claims guardrails" | Health: **yes**, see the late-talker article in [age-band-review.md](age-band-review.md) | BANNED. A disclaimer is not a health claim: [D025](../decisions/D025-speech-and-language.md) (R4) allows "Kheelu is a toy, not a therapy or treatment" in its wording and placement (section 1); any claim that Kheelu treats or helps a speech or health condition stays BANNED |

Price wording that lets a machine read ₹499 as the price ([D028](../decisions/D028-price-wording.md)),
published delivery or replacement timelines
([D022](../decisions/D022-warranty-replacement-refund.md); "free pickup" is now allowed,
[D033](../decisions/D033-warranty-after-day-7.md)), and wallets, EMI or Pay Later
([D024](../decisions/D024-payment-methods-gst.md)) are ruled out on [pricing.md](pricing.md) and
[policies.md](policies.md), which own them.

### 4.1 The retired microphone wording

This page is the only owner of this wording and its locations; other pages link here.

**Retired 2026-10-04, then superseded 2026-10-10.** On 2026-10-04 the founder retired "off, not
muted" (content doc v7 Appendix B) in favour of "listens only for its wake word, and records or
sends nothing before it" (`mid:src/lib/faq.ts:93-96`; `mid:src/lib/product-facts.ts:76`). On
2026-10-10 the founder dropped the wake word itself: Kheelu has a **wake-up button**, and the
microphone is on only after someone presses it ([D018](../decisions/D018-wake-up-button.md)). **Both
wordings are now BANNED.** **Say instead:** describe the button (the microphone stays off until
someone presses the wake-up button, so nothing is recorded or sent; it switches itself off after
about a minute of quiet; a light shows while it listens). D018 owns the draft lines and the wording
rules; the founder signs off final copy at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)).

**Site:** every location in the two tables below, and the source-document examples after them, are
BANNED. Each live location is replaced with the D018 button wording. The questions "When is the
microphone on?" and "Is Kheelu always listening?" stay EXTERNAL, answered in the D018 wording.
Production keeps all of them until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)).

Every location at the tag (`git grep` over `src/`, 2026-10-10). All are live on production (the
tag is the deployed commit; rows 3, 5, 11, 14 and 15 were also confirmed by a plain GET of
`/safety` and the three articles, 2026-10-10). "Fixed" in the Mid column means fixed to the
2026-10-04 wake-word line, which D018 bans too, so no mid line carries over.

| # | Where (tag) | Live on | Wording | Mid version | New site |
|---|---|---|---|---|---|
| 1 | `src/lib/product-facts.ts:73` | Spec table on `/ai-toys-for-kids-in-india` (`page.tsx:246`) **and the Product JSON-LD `additionalProperty`** on `/` and `/products/kheelu` (`src/lib/seo.ts:320`) | "Wakes to a word. Off the rest of the time, not muted." | Fixed (`:76`) | Replace with the D018 button wording |
| 2 | `src/app/(site)/safety/page.tsx:35` | `/safety`, "Listening starts with the wake word" | "The rest of the time, the microphone is off. Not muted. Off." | Fixed (`mid:src/lib/safety.ts:17-22`) | Replace with the D018 button wording (the heading too) |
| 3 | `src/app/(site)/safety/page.tsx:82` | `/safety`, answer "Are AI toys safe for children?" | "Kheelu's mic wakes to a word and is off otherwise." | Fixed (`mid:…/safety/page.tsx:89`) | Replace with the D018 button wording |
| 4 | `src/app/(site)/safety/page.tsx:86` | `/safety`, FAQ "Is Kheelu always listening?" | "the microphone is off, not muted. Off." | Fixed (`mid:src/lib/faq.ts:95`) | Replace with the D018 button wording (D018's FAQ draft) |
| 5 | `src/app/(site)/safety/page.tsx:129` | `/safety`, FAQ "smart toys for toddlers" | "a microphone that sleeps until a wake word" (softer variant) | Fixed (`mid:…/safety/page.tsx:126`) | Replace with the D018 button wording |
| 6 | `src/app/(site)/page.tsx:113` | `/`, FAQ "Is an AI toy safe for a small child?" | "the microphone is off the rest of the time" | Fixed (`mid:src/lib/faq.ts:37`) | Replace with the D018 button wording |
| 7 | `src/features/home/components/TrustRoom.tsx:29` | `/`, safety room | "the mic is off the rest of the time" | Fixed (reads `mid:src/lib/safety.ts`) | Replace with the D018 button wording |
| 8 | `src/app/(site)/products/kheelu/page.tsx:70` | `/products/kheelu`, step 01 | "Until then, the microphone is off." | Fixed (`:80`) | Replace with the D018 button wording |
| 9 | `src/app/llms.txt/route.ts:64` | `/llms.txt` | "The microphone wakes to a word and is off the rest of the time." | Fixed (`:65`) | Replace with the D018 button wording |
| 10 | `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:78` | buyer's guide, check 01 | "Off should mean off, not muted and waiting." | Fixed (`:83`) | Replace with the D018 button wording |
| 11 | `src/lib/stories.ts:137` | journal `what-to-look-for-in-a-safe-ai-toy` | "the microphone sleeps until a wake word" (softer variant) | **Not fixed** | Replace with the D018 button wording |
| 12 | `src/lib/stories.ts:141` | same article, check one | "Off should mean off, not muted and waiting." | Fixed | Replace with the D018 button wording |
| 13 | `src/lib/stories.ts:146` | same article, "How does Kheelu measure against the list?" | "wake-word listening with the microphone off the rest of the time" | Fixed | Replace with the D018 button wording |
| 14 | `src/lib/stories-expansion.ts:240` | journal `should-kids-use-ai` | "when your child says a wake word, and off the rest of the time" | **Not fixed** | Replace with the D018 button wording |
| 15 | `src/lib/stories-expansion.ts:497` | journal `questions-parents-ask-about-ai-toys`, "Does it record everything my child says?" | "A toy that wakes to a word is not listening between wakes." | **Not fixed** | Replace with the D018 button wording |

**Two more live wake-word lines** (fine under the 2026-10-04 ruling, banned by D018; not part of the
15):

| # | Where (tag) | Live on | Wording | New site |
|---|---|---|---|---|
| 16 | `src/app/(site)/products/kheelu/page.tsx:87` | `/products/kheelu` | "Kheelu wakes to a word" | Replace with the D018 button wording |
| 17 | `src/app/(site)/products/kheelu/page.tsx:339`; live `/setup` | `/products/kheelu`, `/setup` | the promise that the "exact wake word and charger details will be published … before Kheelu ships" | Drop the wake-word half (there is none, D018); the charger half stays a placeholder (F4, [facts](facts.md#in-the-box)) |
| 18 | `wt:src/components/organisms/Footer.tsx:31` | every page (footer) | "Wake-word listening. No open internet. You see everything." | Replace with the D018 button wording |
| 19 | `wt:src/lib/seo.ts:247` | setup steps in structured data (HowTo) | "teach your child the wake word" | Replace with the D018 button wording |
| 20 | `wt:src/lib/setup-steps.ts:10` | `/setup`, step 03 "Teach the hello." | "Show your child how to wake Kheelu up. One word, one friend, no manual required." | Replace with the D018 button wording (show the child the wake-up button) |
| 21 | `wt:src/app/(site)/safety/page.tsx:20` | `/safety` meta description | "wake-word mic, on-device thinking" | Replace with the D018 button wording; "on-device thinking" also carries the D019 Gate A flag (section 2) |
| 22 | `wt:src/app/(site)/ai-toys-for-kids-in-india/page.tsx:65` | buyer's guide meta description | "wake-word mic" | Replace with the D018 button wording |

Rows 18 to 22 come from the working tree (`wt:`, read with `grep`, 2026-10-11), which matches the tag
for the lines checked ([rulings check](../qa/rulings-check-2026-10-11.md) 1a). They were missed
because the original grep pattern did not catch "wake-word" or "wake Kheelu up".

The mid version's guard (`mid:test/claims-gated.test.ts:19`) matched only "the microphone is off",
"mic is off", "Not muted. Off" and "off the rest of the time, not muted", which is why rows 11, 14
and 15 survived there. A guard on the new site needs to catch "off the rest of the time", "off
otherwise", "sleeps until" and "not listening between wakes" as well, and after D018 every
wake-word phrase: "wake word", "wake-word", "wakes to a word", "wake Kheelu up", "listens only for its
wake word", "Hey Kheelu".

**Also in the source documents (not on the site; checked 2026-10-10):** the positioning's "It only
listens after its wake word" (`wiki/raw/positioning/Kheelona Positioning Strategy.docx`, paragraph
307), and the design system as delivered (working tree, not in the tag): "Not muted. Off." as the
house example of a short sentence (`design-system/project/01-writing.md:11`) and as the answer to "Is
it listening all the time?" (`07-selling.md:66`), "the microphone is off until the wake word"
(`04-kheelu.md:73`), and a CampaignKit social post "Not muted. / Off."
(`components/CampaignKit/preview.html:52`). All fall under D018's ban: the positioning line is not
carried over, and the design system's examples are logged for its owner as a gap (D018; G11). The
wake-word item in G5 is moot (D018).

**Still fine:** the question "When is the microphone on?" (`ai-toys-for-kids-in-india/page.tsx:77`,
`llms.txt/route.ts:88`), answered in the D018 wording. "Kheelu wakes to a word" on its own was
listed here as fine until 2026-10-10; it implies a wake word and is now row 16.

## 5. Placeholder content

| Item | Status | Source | Site |
|---|---|---|---|
| **Three testimonials on named people** (Shweta, Priyamvada, Gaurav, labelled "Pilot parent") | **Drafted words, not spoken.** The names are real; the quotes are not. The founder decided on 2026-07-28 to "let it be as it is" on the current site. **Decided by the brief: they do not move to the new site** ([open questions](../open-questions.md) section E) | `src/components/organisms/ParentQuotes.tsx:7-31`; `docs/checkpoints/closed-rounds.md:153-156,316`; live `/` and `/products/kheelu` | BANNED for the new site ([D009](../decisions/D009-brief-readings.md)) |
| Seven parent and child films | **Moving to the new site** ([D040](../decisions/D040-films-move-to-new-site.md), founder 2026-10-11). Real footage with burned-in captions (em dashes ship as they are). Written consent held per the founder (2026-09-19); the signed records stay with the founder. Film 6 caption now names AI mode; no endorsement-disclosure line (risk recorded in D040) | `src/lib/video-moments.ts:24,63,103-202` at tag `archive/pre-reset-2026-10-10`; [D040](../decisions/D040-films-move-to-new-site.md) | EXTERNAL (D040) |
| Pilot numbers, city and age per parent, written consent | Owed by the team | `mid:MARKETING-TODO.md:50,158` | EXTERNAL IF CONFIRMED (no ID yet): real data and written consent |
| Content doc v7 brackets: "[₹X/month]", "[X] of 500 left", "[1-year] warranty", "Safety tests: [status]", "Reviewed by [advisor]" | Never shipped; the mid version hid any block needing them | `mid:MARKETING-TODO.md:27-28,47,64-67,82` | BANNED as brackets. "[1-year] warranty" is superseded by the 6-month warranty ([D022](../decisions/D022-warranty-replacement-refund.md), on [policies.md](policies.md)); "[X] of 500 left" is INTERNAL; the rest fill only through their IDs (₹X/month F7, safety tests F4, advisor F9) |

## 6. Certifications

All open items here are [open questions](../open-questions.md) F4.

| Item | Status | Source | Site |
|---|---|---|---|
| Toy-safety certificate (any) | **None received.** Published as "In progress … no badge is claimed before it is earned" | `CLAUDE.md:707`; `src/lib/product-facts.ts:89-92`; live `/ai-toys-for-kids-in-india` ("no toy-safety certificate has been issued to us") | EXTERNAL IF CONFIRMED (F4); the honest "none issued yet" status line is EXTERNAL |
| **BIS / ISI mark** | **Under application, not granted** (founder, 2026-10-11, answer to L1; no licence number yet). **Not mentioned anywhere on kheelona.com** (grep of `src/`, 2026-10-10: zero). kheelona.ai/safety lists "BIS IS 9873 / EN 71 / ASTM F963 (scoped per product & region)". The positioning plans "Amazon listing (after BIS)" and asks for a "BIS date". Mid listed "BIS, toy lab, battery certification dates" as owed | kheelona.ai/safety (fetched 2026-10-10); positioning docx ("Amazon listing (after BIS)"); `mid:MARKETING-TODO.md:103,163` | EXTERNAL only after grant, as "BIS licence CM/L-number, IS 15644" ([legal requirements](legal-requirements.md) BIS-02); until then only the honest "applied for, not yet granted" status |
| BIS as a legal requirement | **Not verified here, and not legal advice.** This agent's understanding is that toys sold in India fall under the Toys (Quality Control) Order, 2020, which requires BIS certification. The D029 review has landed ([legal requirements](legal-requirements.md) BIS-01, a blocker): the Toys QCO bars import, sale or dispatch without the licence and ISI mark; the founder says the licence is under application (L1). The site makes no BIS claim until a licence number exists (BIS-02) | [D029](../decisions/D029-grievance-officer-legal-review.md), [legal requirements](legal-requirements.md) | INTERNAL (the legal analysis); the honest status "applied for, not yet granted" is EXTERNAL (row above) |
| Privacy frameworks on `/safety` | "COPPA (2026): Designed for", "GDPR-K: Designed for", "India DPDP: Designed for", "ISO 27001: In progress". These are self-assessed design targets, not certificates, and the page says so | `src/app/(site)/safety/page.tsx:55-62,296-301` | EXTERNAL IF CONFIRMED: the [D029](../decisions/D029-grievance-officer-legal-review.md) independent review checks these self-assessed labels before the founder approves them; the answers to F2 and F5 do not cover them |
| Battery safety certification | Unknown; no battery life published; `/team` still says "the battery that lasts" | `src/app/(site)/team/page.tsx:58`; `mid:MARKETING-TODO.md:163` | EXTERNAL IF CONFIRMED (F4); the live `/team` bio line "the battery that lasts" is also EXTERNAL IF CONFIRMED (F4), because battery life is unpublished |
| Safety-standards FAQ | Removed 2026-07-31 until the first certificate lands | `src/app/(site)/safety/page.tsx:131-133` | EXTERNAL IF CONFIRMED (F4) |

## 7. Children's data: what is published versus documented

Brief section 9.7: safety and privacy copy must describe **actual documented practice**. **No product
privacy policy exists** yet ("will be published here before Kheelu ships",
`src/app/(site)/privacy/page.tsx:203`). The founder answered the processor, retention and training
facts on 2026-10-10 ([D019](../decisions/D019-voice-providers.md),
[D020](../decisions/D020-provider-terms-and-no-sale.md)), named the grievance officer on 2026-10-11
([D029](../decisions/D029-grievance-officer-legal-review.md); 48-hour acknowledgement and a number
that takes calls, [D032](../decisions/D032-grievance-block-and-call-line.md)), ruled on model training
([D035](../decisions/D035-model-training-opt-out.md)), and approves the legal pages himself after an independent
review against Indian law (D029). Consent posture at launch is G6. "Documented" below means
founder-confirmed in a decision; the written policy is still to come.

| Data | What the site says | Documented practice? | Site |
|---|---|---|---|
| Child's age (asked of the parent at checkout) | Collected "because Kheelu is built for a narrow band of ages" | Yes: `/privacy` covers pre-order data (`privacy/page.tsx:29-30,43`) | EXTERNAL |
| Child's voice | Live: before the wake word (4.1); first processing on the toy; then "your region". Mid: "own servers, in India" (2026-10-04, withdrawn) | **Founder-confirmed 2026-10-10:** no wake word, the microphone is on only after a press of the wake-up button ([D018](../decisions/D018-wake-up-button.md)); multiple outside providers, on servers in India, processing only to reply, keeping nothing, never training, by contract (D019, D020). **Kheelona's own model trains on voice and transcripts by default; parents can opt out** ([D035](../decisions/D035-model-training-opt-out.md)). Not yet in a written policy | EXTERNAL in the D018 and D020 wording (section 1), with D020's never-train line scoped to the providers. "Your region", "Region-pinned" and "own servers, in India" are BANNED (section 4); any "not used to train AI" form is BANNED (D035) |
| Transcripts | Readable and deletable by the parent in the app | **Founder-confirmed:** read and delete in the app ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)); kept 36 months, then deleted automatically (D020) | EXTERNAL |
| Retention | Not stated anywhere live | **Founder-confirmed:** 36 months (D020). Was open at `Technical-Todo.md:35`; `security-review.md:209`, F-12 | EXTERNAL in D020's wording; the `/privacy` DPDP line goes through the D029 review |
| Model training | "Learns only from conversations families separately opt into" (`/playos`) | **Founder-confirmed 2026-10-11** ([D035](../decisions/D035-model-training-opt-out.md)): the outside providers never train (D020); Kheelona's own model trains on voice recordings and transcripts **by default**, and a parent can opt out | The providers line: EXTERNAL (D020). Training: stated on `/terms` and `/privacy` only (D035); customer pages neither mention it nor imply there is none. The live opt-in line: BANNED (false, section 2) |
| Behaviour signals (daily summary, alerts, "the feeling gets read") | Live features | **Partly.** The daily summary and alerts are real (D017; alerts confirmed for launch, [D036](../decisions/D036-launch-feature-claims.md)). The site's own journal says DPDP section 9 prohibits "behavioural monitoring" of children (`src/lib/stories-expansion.ts`, data-law article); the D029 review ([legal requirements](legal-requirements.md) L6) says daily summaries and alerts "need a reading" by counsel | Daily summary and alerts: EXTERNAL IF CONFIRMED (counsel's reading, L6). "The feeling gets read": BANNED (R5) |
| Consent | "Nothing is collected without your say-so"; consent "is asked for from the parent account" | **No** | EXTERNAL IF CONFIRMED (G6, and the D029 review of DPDP verifiable parental consent) |
| Grievance contact | Not published | **Named 2026-10-11** (D029; the details are owned by [policies.md](policies.md)); 48 hours to acknowledge, one month to resolve, +91 91875 46483 takes calls ([D032](../decisions/D032-grievance-block-and-call-line.md)) | EXTERNAL (D029, D032) |

## 8. Brain and development claims, with their anchors

The rule (founder decision 4, 2026-10-04, confirmed and extended by
[D016](../decisions/D016-brain-wording.md) on 2026-10-10; positioning "Claims guardrails"): say that
**research links back-and-forth conversation to young children's language and brain development,
and Kheelu is built to give a child more of it**. Never say Kheelu itself has been shown to do it,
and never call Kheelu the thing that develops the brain. **"Brain development" may be a TOPIC** in
titles, headings and articles so the site is found in search (D016's example: "Brain development at
3 to 7: why talking matters most"). **Public statistics** follow
[D026](../decisions/D026-public-statistics.md): used as SKM framed them only after an independent
check against the ORIGINAL public source ([source verification](../research/source-verification.md)), each
with a linked source marker, and paired with what a parent can do. **Speech and language**
statements cite a public source the Copywriter has read
([D025](../decisions/D025-speech-and-language.md)). R7 is answered (D016); there is no named advisor
([D038](../decisions/D038-trust-content-rulings.md)), so no line may rest on one.

| Anchor | What the source actually says | Checked | Used where | Site |
|---|---|---|---|---|
| Harvard Center on the Developing Child, "Serve and return" | Exchanges "play a key role in shaping brain architecture" and help "build and strengthen neural connections"; they are "between a young child and a caring adult" | Fetched 2026-10-10 | Live `/` ("the back and forth that builds language and thinking"), journal; mid quotes the source and its "caring adult" (`mid:docs/checkpoints/cmo-merge-2026-10.md:133-137`) | EXTERNAL, cited, keeping "a caring adult" |
| Romeo et al. 2018, *Psychological Science* (PMC5945324) | 36 children aged about 4.5 to 6.8; "Only conversational turns significantly predicted additional variance in verbal scores", with Broca's-area activation, independent of income and parental education | Fetched 2026-10-10 | Journal: "a 2018 study of 36 children aged four to six" (accurate). The three-year-old article attributes the finding to "researchers at MIT" for three-year-olds; the sample was 4 to 6 | EXTERNAL, cited, with the sample as it is (about 4 to 6, never "three-year-olds") |
| Xu et al. 2022, *Child Development* (University of California, Irvine, not Harvard) | 117 children aged 3 to 6 heard a picture book read by a smart speaker; those whose speaker asked questions understood the story better, about as well as with an adult asking. Not "learnt more words" | Verified 2026-10-10 ([source verification](../research/source-verification.md) C10: SUPPORTED-WITH-REWORDING; ready line there) | Positioning only | EXTERNAL in the verified line only. **Guard ([D027](../decisions/D027-story-mode-wording.md)):** cite Xu only for Kheelu asking back in conversation (AI mode); never pair it with stories or Story mode, never imply Kheelu asks questions during a story, and keep "the study used a smart speaker, not Kheelu" |
| NEP 2020, "over 85% of a child's brain develops by age 6" | NEP 2020 itself, para 4.1 (checked against the ministry text, not EducationWorld) | Verified 2026-10-10 ([source verification](../research/source-verification.md) C01: SUPPORTED-WITH-REWORDING) | Positioning only | EXTERNAL in the verified wording only ([D026](../decisions/D026-public-statistics.md)): keep the quote as quoted, with its marker; never "research shows" or "85% of the brain" |
| "2.2 hours of screen time, double the guideline" | The AIIMS Raipur meta-analysis (checked against the paper, not Pune Pulse) | Verified 2026-10-10 ([source verification](../research/source-verification.md) C06: SUPPORTED-WITH-REWORDING) | Positioning only | EXTERNAL in the verified wording only (D026): never "double", never "Indian children average" |
| WHO 2019, AAP 2016, IAP 2022 screen guidance | Cited with links in the journal | Not re-checked this session | Journal | EXTERNAL, cited (re-check the links before reuse) |
| Common Sense Media, 22 January 2026 | Advice against AI toys for young children: quoted and reviewed in [age-band-review.md](age-band-review.md#4-common-sense-media-and-the-3-to-7-band) | Fetched 2026-10-10 | Three live journal articles | EXTERNAL IF CONFIRMED (G5) |

**The six R7 lines, as settled by D016:**

| Line | Outcome |
|---|---|
| SKM's hero; "Kheelu helps your child's brain grow" | BANNED |
| "brain-development toy" | BANNED as a product label; usable as a searched topic phrase |
| "Built to support your child's brain development" | Reword to the conversation form |
| "a gift that grows young minds" | Reword to the conversation form |
| "good for their brain" | Not named in D016's list; under its rule it is reworded to the conversation form (credit conversation, never Kheelu) |
| "so they think, talk and wonder more" | EXTERNAL when it describes what conversation does |

**Live outcome claims with no research anchor** (PUBLISHED, reviewed under the rule above):
"A best friend at 3. A head start for school." (`src/lib/growth-arc.ts:9-10`, hero and meta,
retired on mid); "School teaches the class. Kheelu teaches your child." (`PacePanel.tsx:50`);
"Knowledge that sticks" (`src/app/(site)/page.tsx:139`); "A tutor runs out of time and patience.
Kheelu does not." (`Compare.tsx:32`); "grows their vocabulary" (`KheeluModes.tsx:35`);
"Between three and four a child's vocabulary roughly doubles" (unsourced,
`src/lib/stories-expansion.ts:456`).

**Site:** "grows their vocabulary" is BANNED (section 4; D016). "A best friend at 3. A head start for
school." is BANNED ("best friend"). "School teaches the class. Kheelu teaches your child." is BANNED
(teacher or tutor framing; Kheelu is not sold as a tutor, [D027](../decisions/D027-story-mode-wording.md)).
"A tutor runs out of time and patience. Kheelu does not." is BANNED ("tutor"). The stop-words are owned
by [messaging](../brand/messaging.md). "Knowledge that sticks" is BANNED: it is a learning-outcome claim
([legal requirements](legal-requirements.md) L7) and there is no advisor to anchor it
([D038](../decisions/D038-trust-content-rulings.md)). The vocabulary-doubling line is BANNED: the
independent check found no source ([source verification](../research/source-verification.md) C41,
NOT-SUPPORTED; D026).

## D044 additions (2026-10-11): what the real app screens may show

| Claim | Status | Source |
|---|---|---|
| Talking time per day and per chat | EXTERNAL | [D044](../decisions/D044-app-screens-on-the-site.md) |
| Save voice recordings (on/off; off keeps text only), download your child's data, share or favourite a conversation | EXTERNAL (launch features) | D044 |
| Kheelu remembers earlier chats | EXTERNAL (D036; shown in the transcript screen) | D036, D044 |
| Games | **NOT a launch feature: never claimed or shown** | D044 |
| Per-chat AI summary ("What … explored") | Real, but **not shown on the site** until the DPDP s.9 reading | D044; [legal requirements](legal-requirements.md) |
| "Chats are seen only by you" (the app's own banner) | **Not shown on the site** (contradicts the default training, D035) | D044 |
| Chat retention | 36 months, fixed; the app's "[30 days]" must change before launch | D044, D020 |

