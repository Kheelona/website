---
title: Product facts (verified)
type: product
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - src/config/site.ts, src/lib/product-facts.ts, src/lib/legal.ts, src/lib/seo.ts, src/lib/kheelu-art.ts, src/lib/family.ts (tag archive/pre-reset-2026-10-10 = 77552ff, which was main and production on 2026-10-10)
  - src/app/(site)/**/page.tsx, src/app/llms.txt/route.ts, src/app/pricing.md/route.ts, src/app/store/page.tsx, src/components/organisms/RecognitionStrip.tsx (same tag)
  - CLAUDE.md lines 690-709 ("Locked product facts", same tag)
  - docs/checkpoints/migration-to-new-dsx.md lines 40-58 (founder decisions 2026-08-23)
  - docs/checkpoints/closed-rounds.md lines 312-316
  - 'git show archive/mid-version-2026-10-10:<path> for src/lib/product-facts.ts, src/lib/safety.ts, src/lib/faq.ts, src/lib/comparison.ts, docs/checkpoints/cmo-merge-2026-10.md, MARKETING-TODO.md'
  - "Live site, plain GET with a browser User-Agent, fetched 2026-10-10 17:43 PDT (2026-10-11 00:43 UTC): kheelona.com /, /products/kheelu, /safety, /team, /contact, /playos, /privacy, /terms, /refund, /shipping, /setup, /stories, /ai-toys-for-kids-in-india, /llms.txt, /pricing.md, /api/health, store.kheelona.com/"
  - kheelona.ai/safety, fetched 2026-10-10
  - wiki/open-questions.md (IDs F1-F12, G3, G5, G6, Q3, section E; section F rulings R1-R10, all answered 2026-10-10 and 2026-10-11)
  - wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md, wiki/decisions/D009-brief-readings.md (the Site column, 2026-10-10)
  - "wiki/decisions/D011, D015-D029 (the founder's rulings of 2026-10-10 and 2026-10-11, applied here 2026-10-11)"
---

# Product facts (verified)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Site column: [content boundary](../site/content-boundary.md) ([D013](../decisions/D013-internal-vs-external-content.md)).

Every fact about Kheelu that the site may state, with where it comes from and where it is live.
Claims (what we may *say* about those facts, and what is banned) live in [claims.md](claims.md).
Every age statement is reviewed in [age-band-review.md](age-band-review.md). Prices, the offer,
GST, delivery cost and the price wording ([D028](../decisions/D028-price-wording.md)) live in
[pricing.md](pricing.md); refund, returns, shipping, warranty, payment methods
([D024](../decisions/D024-payment-methods-gst.md)) and the grievance officer
([D029](../decisions/D029-grievance-officer-legal-review.md)) in [policies.md](policies.md); the
checkout steps in [../site/checkout.md](../site/checkout.md). Open items link to
[open questions](../open-questions.md) by ID.

## How to read this page

- **Live** = on production today. Production is `77552ff` (tag `archive/pre-reset-2026-10-10`).
  Confirmed by fetch on 2026-10-10: `/how` returns 404 and `/faq` returns 308, which is the tag's
  routing, not the mid version's; `/api/health` reports `"preorder":"token"`. Production is held
  unchanged until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)), so a live value
  that a ruling retires stays live until then; the Site column describes the new site.
- **Mid** = only on the unreleased mid version (tag `archive/mid-version-2026-10-10`, PR #16, never
  deployed). Cited as `mid:<path>:<lines>`.
- **Both** = the same on both.
- **Unpublished** = deliberately not stated anywhere.
- "Verified" means traced to a founder-sourced constant, a dated founder decision, or a fetched live
  page. **No product behaviour could be verified by inspection**: the toy has not shipped and no
  unit was available to this agent. Behaviour facts below are what the founder has approved for
  publication, not what was tested. On 2026-10-10 the founder confirmed the live, founder-approved
  behaviour claims as real ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), R1). That
  ruling is applied **row by row**: later rulings correct some rows (Story mode,
  [D027](../decisions/D027-story-mode-wording.md); listening,
  [D018](../decisions/D018-wake-up-button.md); the voice path,
  [D019](../decisions/D019-voice-providers.md)). Claims that are not live stay behind F8.
- **Site** says whether a fact may go on the new site: EXTERNAL (may be published as is), EXTERNAL IF CONFIRMED
  (useful to a parent, but waits on the named [open question](../open-questions.md)), INTERNAL
  (shapes strategy, never published) or BANNED (retired or ruled-out wording). Added 2026-10-10
  under [D013](../decisions/D013-internal-vs-external-content.md). **Rulings R1 to R10**
  ([open questions](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)
  section F) **are all answered** (2026-10-10 and 2026-10-11); every row that carried a "PENDING
  RULING" mark now names the decision that settled it. Where a ruling changed a value (listening,
  the voice path, Story mode, Kheelona+, retention, delivery), the row says so. All draft wording
  is still signed off by the founder at Gate A ([D015](../decisions/D015-founder-signs-off-copy.md)).

## Identity

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| Product name | **Kheelu** | `CLAUDE.md:690`; `src/lib/seo.ts` Product `name: "Kheelu by Kheelona"` | Both | EXTERNAL |
| Former name | **Lumi**, renamed 2026-09-05. Same product. Schema keeps `alternateName: "Lumi"` and the Product `@id` `…/products/lumi#product` on purpose (URL detail: [../site/url-map.md](../site/url-map.md)) | `CLAUDE.md` rename banner; `src/lib/seo.ts:280-302`; live `/llms.txt` line 12 | Both | EXTERNAL only as schema `alternateName` and in the "Is Kheelu the same as Lumi?" answer; BANNED as the current name |
| Brand / maker | **Kheelona**; schema `manufacturer` points at the Kheelona Organization | `src/lib/seo.ts:303-304` | Both | EXTERNAL (brand); the schema `manufacturer` claim is EXTERNAL IF CONFIRMED (F3) |
| What it is | A screen-free plush toy that talks with a child and answers back. "A plush toy, not a robot. No wheels, no face screen and no moving parts." | `src/app/llms.txt/route.ts:49,56` (live `/llms.txt` lines 13, 20) | Both | EXTERNAL. "No wheels, no face screen and no moving parts" is EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md); [claims §2](claims.md#2-published-product-behaviour-claims-live-not-re-confirmed)). Flag for Gate A: Kheelu has a physical wake-up button ([D018](../decisions/D018-wake-up-button.md)), so "no moving parts" must not read as "no button"; the founder may keep or drop the phrase ([D015](../decisions/D015-founder-signs-off-copy.md)) |
| Look | Cream plush rabbit, one colourway ("Cream"), "with a speaker in its tummy and rainbow-lined ears" | `src/lib/kheelu-art.ts:27-29`; `src/app/(site)/products/kheelu/_components/ColorwayPicker.tsx:16-26` | Both | EXTERNAL |
| Schema category | "Screen-free AI toy" | `src/lib/seo.ts:305` | Both | EXTERNAL |

## Age

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| Published age today | **"3+"**, no ceiling (founder decision #8, 2026-08-23) | `src/config/site.ts:119-124`; `docs/checkpoints/migration-to-new-dsx.md:49-51` | Both; superseded for the new site | The "no ceiling" framing is BANNED on the new site: superseded by 3 to 7 ([D009](../decisions/D009-brief-readings.md)). "3+" as a toy-safety age grade (possibly legally required; [age-band-review.md](age-band-review.md)) is EXTERNAL IF CONFIRMED (F4) |
| Schema audience today | `PeopleAudience`, `suggestedMinAge: 3`, no `suggestedMaxAge`, `audienceType: "Children"` | `src/lib/seo.ts:306-311`; live JSON-LD on `/` and `/products/kheelu` | Both | EXTERNAL once it states 3 to 7 (D009); the no-ceiling form is superseded |
| Band for the new site | **3 to 7**, published everywhere. Decided by the brief, overriding decision #8 and the positioning's 4 to 7 ([open questions](../open-questions.md) section E) | `wiki/raw/brief/kickoff-brief.md:17,25,497` | Neither yet | EXTERNAL |

Every place an age is stated, and what changes, is in [age-band-review.md](age-band-review.md).
**Who the site is for** (R9, founder 2026-10-10,
[open questions](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)):
parents of 3 to 7 year olds, and family buying for them; nothing else. The audience itself is owned
by [audience](../brand/audience.md).

## Modes and connectivity

Three modes (Story mode was "Kheelu mode" until 2026-09-05). Connectivity is stated **per mode**,
never as a blanket "works offline" (§8.24-1, `CLAUDE.md` V6 summary).

| Mode | What it does | Needs | Source | Status | Site |
|---|---|---|---|---|---|
| AI mode | Open conversation | Home WiFi. Live copy says "Kheelona's servers"; since 2026-10-10 the conversation is known to be processed by Kheelona's outside speech and AI providers, on servers in India ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | `src/lib/product-facts.ts:72,75-78`; `src/components/organisms/KheeluModes.tsx:35`; D019; D020 | Both (the provider fact: neither yet) | EXTERNAL. Never write "Kheelona's servers" where it could read as "only our own servers" (BANNED, [D019](../decisions/D019-voice-providers.md)); where the voice goes is the providers line below |
| Story mode | **Stories, poems and jingles** (founder, 2026-10-10, [D027](../decisions/D027-story-mode-wording.md)). Live copy says "stories and lessons a child can interrupt, question and be quizzed on"; **there is no interrupt-and-ask feature** (D027) | Works offline (D027's draft says "No WiFi needed", restating it) | same; `src/app/(site)/products/kheelu/page.tsx:237`; D027 | Live: the old description; the D027 description: neither yet | The mode name, "stories, poems and jingles" and "works offline" / "No WiFi needed": EXTERNAL ([D027](../decisions/D027-story-mode-wording.md)). "Lessons": BANNED (D027; the stop-word is on [messaging](../brand/messaging.md#words-to-stop-using)). "Interrupt, question and be quizzed on": BANNED (D027, which narrows [D017](../decisions/D017-live-behaviour-claims-confirmed.md)) |
| Bluetooth mode | Kheelu becomes the speaker for a paired phone | A paired phone only | same | Both | EXTERNAL |

**Inconsistency to fix:** `/playos` says the on-toy brain makes "answers come fast and work offline"
(`src/app/(site)/playos/page.tsx:109`), which contradicts the per-mode rule. Listed as retired
wording in [claims.md](claims.md#4-retired-or-banned-wording).

## Languages

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| Named languages | **8, "named and final"** (founder, 2026-07-31): English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French | `src/config/site.ts:141-157`; `docs/checkpoints/closed-rounds.md:313` | Both | EXTERNAL |
| Ceiling | "Up to 10" | same | Both | EXTERNAL |
| Switching | "Switches mid-sentence" | `src/lib/product-facts.ts:70` | Both | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)): a live, founder-approved behaviour claim that no later ruling contradicts |

Wording differs by page: "8 at launch … up to 10" (production spec table), "up to ten languages at
launch" (FAQs), "eight languages at launch" (journal, `src/lib/stories-expansion.ts` "questions
parents ask"), "8 named today, up to 10 at launch" (`mid:src/lib/product-facts.ts:70`). The facts do
not differ (8 named, ceiling 10); the new copy picks one wording and renders it from
`KHEELU_LANGUAGES` / `LANGUAGES_LINE`.

## What it listens for, and where the voice goes

| Fact | Value to publish | Source | Site |
|---|---|---|---|
| Listening | **No wake word.** A **wake-up button** turns the microphone on: one press starts a conversation, the microphone stays on through the back-and-forth and **switches itself off after about a minute** with no conversation; the next conversation needs another press. **A light on Kheelu shows while the microphone is on** (colour and pattern not specified, so copy never names one). Founder, 2026-10-10 ([D018](../decisions/D018-wake-up-button.md)); supersedes the production wording AND the 2026-10-04 wake-word wording (`mid:src/lib/product-facts.ts:76`) | [D018](../decisions/D018-wake-up-button.md) | EXTERNAL, within D018's wording rules: describe the mechanism ("the microphone stays off until someone presses the button, so nothing is recorded or sent"); never "no risk" or "zero risk"; no physical or electrical disconnect claim; never "nothing is ever recorded" (conversations are kept for parents, [D017](../decisions/D017-live-behaviour-claims-confirmed.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)). "Wake-up button" is the en-IN name. Draft lines are in D018. **Every wake-word line is BANNED**: the retired "The microphone is off. Not muted. Off." family and the 2026-10-04 "listens only for its wake word" line, with every live location in [claims.md](claims.md#41-the-retired-microphone-wording) |
| The wake word itself | **None: Kheelu has no wake word** ([D018](../decisions/D018-wake-up-button.md)). The live site still promises to publish one "before Kheelu ships" | `src/app/(site)/products/kheelu/page.tsx:339`; live `/setup`; D018 | "No wake word": EXTERNAL (D018). The live promise to publish a wake word is BANNED (it implies one; [claims 4.1](claims.md#41-the-retired-microphone-wording)). F4's "wake word" spec item is moot (D018) |
| First processing | "The first thinking happens on the toy itself, before anything is sent anywhere" (both versions) | live `/` and `/safety`; `mid:src/lib/safety.ts:44-45` | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)): live, founder-approved, and no later ruling contradicts it. Write it beside the providers line (next row) and never so it implies the voice stays on the toy ([D019](../decisions/D019-voice-providers.md)) |
| Where voice goes | **Multiple outside speech and AI providers, on servers in India for every provider** ([D019](../decisions/D019-voice-providers.md); [D020](../decisions/D020-provider-terms-and-no-sale.md) item 6). They process a child's voice **only to produce Kheelu's reply**, **do not keep it**, **never train on it**, and **contracts say so** (founder, 2026-10-10, D020 items 1-4). Was: production "Stays in your region"; mid "Kheelona's own servers, **in India**" (confirmed 2026-10-04, withdrawn by D019) | `src/lib/product-facts.ts:80`; `mid:src/lib/product-facts.ts:86-88`; `mid:docs/checkpoints/cmo-merge-2026-10.md:28`; D019; D020 | EXTERNAL in D020's wording and its guardrails: "trusted" describes our choice of provider, not a certification; if any provider ever moves processing abroad, this line changes first. BANNED: "stays in your region"; "only Kheelona's own servers" and any "only our own servers" or "never leaves Kheelona" wording; `/playos`'s "Nothing rented that matters" and its "own the model" family ([D019](../decisions/D019-voice-providers.md); [claims §4](claims.md#4-retired-or-banned-wording)) |
| Sold? | "Never sold, never used to advertise to your child" (both) | both product-facts files; [D020](../decisions/D020-provider-terms-and-no-sale.md) item 5 | "We don't sell your data": EXTERNAL (D020, confirmed for the new site; the live `/privacy` already states it: "We never sell your child's data", `src/app/(site)/privacy/page.tsx:189`; "your child's voice data is never sold", `:202`). "Never used to advertise to your child": EXTERNAL IF CONFIRMED: the answer to F5 (D019, D020) does not cover advertising, so it needs its own yes (no open-question ID yet) |
| Consent | "Nothing is collected without your say-so" (both) | `src/app/(site)/safety/page.tsx:43` | EXTERNAL IF CONFIRMED (G6, and the independent legal review of [D029](../decisions/D029-grievance-officer-legal-review.md), which covers DPDP verifiable parental consent for children's data). The answer to F5 does not cover consent |
| Deletion | Any conversation deletable in one tap in the parent app (both) | `src/lib/product-facts.ts:79`; [D017](../decisions/D017-live-behaviour-claims-confirmed.md) | EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), named in the ruling) |
| Model training | "A small voice model trained only for children … learns from conversations families separately opt into" (not changed on mid) | `src/app/(site)/playos/page.tsx:146-147,258` | Outside providers never train on a child's voice ([D020](../decisions/D020-provider-terms-and-no-sale.md)): EXTERNAL in D020's wording. "A small voice model trained only for children": BANNED as part of D019's "own the model" family (this page's reading: [D019](../decisions/D019-voice-providers.md) names the AI model as one of the outside providers; the founder may narrow it). "Learns from conversations families separately opt into": EXTERNAL IF CONFIRMED: R1 calls the live claims real (D017), but beside D019 and D020 it is unclear which model would learn and how that sits with "they never use it to train their AI"; needs the founder's answer (no open-question ID yet) |
| Retention period | **36 months**: Kheelona keeps conversation transcripts for 36 months, then deletes them automatically; parents can delete any conversation sooner, in one tap (founder, 2026-10-10, [D020](../decisions/D020-provider-terms-and-no-sale.md) item 7). The outside providers keep nothing (D020) | D020; grep of `src/` for retention, 2026-10-10: none (never published live) | EXTERNAL in D020's wording. The same period is the DPDP retention line on `/privacy`; its wording goes through the [D029](../decisions/D029-grievance-officer-legal-review.md) review and the founder's approval ([policies](policies.md)). Never "nothing is kept": transcripts are kept for parents |
| Product privacy policy | **Not published**: "A full product privacy policy will be published here before Kheelu ships." The facts it needs on processors, retention and training are now answered ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)) | `src/app/(site)/privacy/page.tsx:203` | EXTERNAL IF CONFIRMED: the founder approves it after the independent review against Indian law ([D029](../decisions/D029-grievance-officer-legal-review.md)) |

**"In India" holds for every provider** (founder, 2026-10-10, [D020](../decisions/D020-provider-terms-and-no-sale.md)
item 6), which closes the processor half of [open questions](../open-questions.md) F5. If any provider
ever moves processing abroad, the line changes first. What the live site says against what is now
documented: [claims.md](claims.md#7-childrens-data-what-is-published-versus-documented).

## Internet and camera

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| Open internet | Cannot browse or search; answers come from a closed library | `src/lib/product-facts.ts:74` | Both | "Cannot browse the internet": EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md), named in the ruling). "Answers come from a closed library": EXTERNAL (D017); flag for Gate A: beside the outside AI providers ([D019](../decisions/D019-voice-providers.md)) it must not suggest that no AI model is involved |
| Spec row wording | Production: "Internet access: None" (contradicts AI mode on WiFi). Mid: "Open internet: No … connects only to our own servers" | `src/lib/product-facts.ts:74`; `mid:src/lib/product-facts.ts:77-80` | Production wording is wrong | "Internet access: None": BANNED ([claims §4](claims.md#4-retired-or-banned-wording)). "Open internet: No": EXTERNAL (D017). "Connects only to our own servers": BANNED ([D019](../decisions/D019-voice-providers.md)) |
| Camera | **None** (founder-confirmed 2026-10-04) | `mid:src/lib/comparison.ts:86`; `mid:docs/checkpoints/cmo-merge-2026-10.md:28` | Mid only. Production never states it (live text checked 2026-10-10; "camera" appears only in video alt text) | EXTERNAL |

## Parent app

Published features (none verifiable until ship): daily summary; the full conversation log word for
word; delete any conversation in one tap; topic controls; quiet hours; language choice; a count of
new words learnt; "one simple thing to do together each day"; alerts ("if something ever needs your
attention, you hear about it first"); "parenting philosophy, in one prompt".
Sources: `src/lib/product-facts.ts:79`; `src/app/(site)/products/kheelu/page.tsx:297`;
`src/features/home/components/ParentAppSection.tsx:19,45`; live `/llms.txt` lines 36-40.
Status: Both (mid uses the same list; Home's card shows the real app screenshot,
`mid:docs/checkpoints/cmo-merge-2026-10.md:36-37`).

**Site:** EXTERNAL ([D017](../decisions/D017-live-behaviour-claims-confirmed.md)), feature by
feature: the ruling names reading every conversation and one-tap delete, and calls the other live
features real. Two wait on the independent legal review of
[D029](../decisions/D029-grievance-officer-legal-review.md): the **daily summary** and **alerts**,
because DPDP section 9 bars behavioural monitoring of children
([claims §7](claims.md#7-childrens-data-what-is-published-versus-documented)); they are EXTERNAL IF
CONFIRMED until it lands. Nothing that reads the child's mood ships (R5, BANNED).

**The parent app is part of Kheelona+**, which is included for 6 months (next section). Kheelu's
smart features keep working for life with no subscription
([D027](../decisions/D027-story-mode-wording.md)); what a parent keeps of the parent app after the 6
months is not stated ([open questions](../open-questions.md) F7).

## Kheelona+

This page owns the Kheelona+ terms; other pages link here.

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| The sanctioned wording, new site | "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. Kheelu's smart features keep working for life, with no subscription needed. Kheelona+ pricing will be announced soon." (founder, 2026-10-10, option b) | [D027](../decisions/D027-story-mode-wording.md) | Neither yet | EXTERNAL, verbatim only (D027; final copy sign-off at Gate A, [D015](../decisions/D015-founder-signs-off-copy.md)). It answers R10's Kheelona+ half: it cannot be read as a free lifetime subscription |
| The live wording | "Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Kheelu's smart features are yours for life, and Kheelona+ pricing is announced soon." (founder, 2026-07-31) | `src/config/site.ts:126-134` (`KHEELONA_PLUS_LINE`); `docs/checkpoints/closed-rounds.md:314` | Both (live) | BANNED on the new site: replaced by D027's line ("lessons" is dropped everywhere; Bing's AI read the old line as "a lifetime subscription", R10). The live constant is untouched until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)) |
| Renewal | "Nothing renews without you" | live `/`, `/products/kheelu` | Both | EXTERNAL IF CONFIRMED (F7): it sits outside the sanctioned line |
| Price after 6 months | **Unpublished and gated** (no ₹ amount may be stated) ([open questions](../open-questions.md) F7) | `src/config/site.ts:128-130`; `CLAUDE.md:704-707` | Unpublished | EXTERNAL IF CONFIRMED (F7) |
| "Free for life" | **NOT confirmed** (2026-10-04); the claim and its live variant are in [claims.md](claims.md#3-not-confirmed-do-not-publish) ([open questions](../open-questions.md) F7). The only sanctioned for-life wording is D027's "keep working for life, with no subscription needed", inside the line above | `mid:test/claims-gated.test.ts:18,29`; D027 | Banned on mid | EXTERNAL IF CONFIRMED (F7) |

## Ship date

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| Deliveries start, new orders | **Mid-November 2026**, with the same ₹499 advance (founder, 2026-10-10, [D023](../decisions/D023-new-order-delivery.md)) | D023 | Neither yet | EXTERNAL (D023): ONE content value that every surface renders, never hand-typed, so it can move as launch approaches. Say "deliveries start", never an arrival date or a transit time ([D022](../decisions/D022-warranty-replacement-refund.md) guardrail) |
| Shipping starts (live) | **20 October 2026** (`SHIP_DATE_TEXT`, `SHIP_DATE_ISO = 2026-10-20`). This is the dispatch start, not an arrival date | `src/config/site.ts:136-139`; `docs/checkpoints/migration-to-new-dsx.md:48`; live `/products/kheelu` price table | Both (live) | Production keeps it until Gate B, in checkout and the receipt email too ([D011](../decisions/D011-production-held-until-gate-b.md); [D023](../decisions/D023-new-order-delivery.md): accepted risk, do not re-raise). BANNED on the new site for new orders (D023). Whether existing token orders still dispatch from 20 October is not stated, so not published (F12) |
| History | 1 September → 1 October (2026-08-22) → 20 October (2026-08-23) → mid-November for new orders (2026-10-10, D023) | `docs/checkpoints/closed-rounds.md:312`; D023 | n/a | INTERNAL (the old dates are BANNED wording) |
| Order of dispatch | "Pre-orders are served first, in the order they were placed" | live `/`, `/shipping` | Both | EXTERNAL |
| Schema | `availability: PreOrder`, `availabilityStarts: 2026-10-20` | `src/lib/seo.ts` offers block | Both | `availability: PreOrder`: EXTERNAL. `availabilityStarts`: EXTERNAL IF CONFIRMED: the field needs an exact date and D023 gives only "mid-November"; never invent one (omit the field or ask the founder; no open-question ID yet) |

On 2026-10-11 the live date is nine days away. New orders deliver from mid-November
([D023](../decisions/D023-new-order-delivery.md)); whether existing token orders dispatch from 20
October, and when the balance links go out, is [open questions](../open-questions.md) F12. Of the
items promised "before Kheelu ships": returns and warranty are decided
([D021](../decisions/D021-returns-policy.md), [D022](../decisions/D022-warranty-replacement-refund.md);
terms on [policies](policies.md)); there is no wake word ([D018](../decisions/D018-wake-up-button.md));
the privacy facts are answered ([D019](../decisions/D019-voice-providers.md),
[D020](../decisions/D020-provider-terms-and-no-sale.md)) and the policy goes through the
[D029](../decisions/D029-grievance-officer-legal-review.md) review; battery life and certificates stay
open (F4). Live copy is not fixed before 20 October: Q3 was answered "hold everything until Gate B"
([D011](../decisions/D011-production-held-until-gate-b.md)).

## In the box

Kheelu, "a charger", "a quick-start card" (`src/app/(site)/products/kheelu/page.tsx`, "What is in
the box", live). Charger and cable type: unpublished (live `/setup`: "exact wake word and charger
details will be published … before Kheelu ships"; `mid:MARKETING-TODO.md:94`;
[open questions](../open-questions.md) F4). There is no wake word
([D018](../decisions/D018-wake-up-button.md)), so only the charger half of that promise still stands.

**Site:** EXTERNAL IF CONFIRMED (F4): box contents are on the sign-off list.

## Support channel

This page owns the support channel; other pages link here.

| Fact | Value | Source | Status | Site |
|---|---|---|---|---|
| WhatsApp | **+91 91875 46483, messages only, not calls**; every visible label must say so (founder, 2026-08-22) | `src/config/site.ts:195-202`; `src/lib/legal.ts:22` | Both | EXTERNAL, labelled "messages only" |
| Email | hello@kheelona.com (founder-confirmed monitored inbox, 2026-07-28) | `src/config/site.ts:173-174` | Both | EXTERNAL |
| Never publish | The legacy Wix number +91 98765 43210 (a placeholder) | `docs/checkpoints/closed-rounds.md:166` | n/a | BANNED |

`CLAUDE.md:700` says support is "WhatsApp only", but every live page also offers the email address
(`src/lib/legal.ts:22`). Read "WhatsApp only" as "the only phone channel". The grievance officer is
a separate, legally required contact, owned by [policies.md](policies.md)
([D029](../decisions/D029-grievance-officer-legal-review.md)).

## Seller of record

**Kheelona Robotics Private Limited**, Bengaluru (`src/config/site.ts:176-193`, founder-supplied
2026-08-22 from the GST certificate; rendered once through `SELLER_SECTION`, `src/lib/legal.ts:10-24`).
Status: Both. The GSTIN, registered address, where the block is printed, and the grievance officer
(named 2026-10-11, [D029](../decisions/D029-grievance-officer-legal-review.md)) are owned by
[policies.md](policies.md) ("Seller details (as published)").

**Site:** EXTERNAL (a required seller disclosure).

## The product family

`/` and `/products/kheelu` show **Kheelu Speaker (ages 5+, "coming soon")** and **AI books (3+,
"coming soon")**, neither purchasable (`src/lib/family.ts:40-47`; live `/pricing.md`). The
positioning wants "one product, one promise" (`wiki/raw/positioning/Kheelona Positioning Strategy.docx`,
"Market to ages 4 to 7. One product, one promise"). Whether the family stays is a messaging call for
[../brand/messaging.md](../brand/messaging.md).

**Site:** EXTERNAL IF CONFIRMED at Gate A: the future product pipeline is on the
[content boundary](../site/content-boundary.md#grey-decided-case-by-case-at-gate-a)'s grey list, and no
open-question ID covers it yet.

## Deliberately unpublished

Each of these is absent from production on purpose. Several were decided on 2026-10-10 and
2026-10-11 and may now go on the new site; their rows say so, and production keeps its placeholder
until Gate B ([D011](../decisions/D011-production-held-until-gate-b.md)). Never fill an open one with
a guess; a gap becomes a marked placeholder and an open question.

| Item | Where the gap is stated | Guard | Open question | Site |
|---|---|---|---|---|
| Battery life | `src/lib/product-facts.ts:38-39,87` ("Not announced yet") | `src/lib/seo.test.ts:387` bans "battery" in the spec table | F4 | EXTERNAL IF CONFIRMED (F4) |
| Warranty terms | `src/lib/product-facts.ts:40-41,88`; `/products/kheelu` FAQ (line 102); `/refund` | `src/lib/seo.test.ts:388` (the new site's guard must let the decided terms through) | **Answered** ([D022](../decisions/D022-warranty-replacement-refund.md)); still open in F1: the remedy for a defect found after the first 7 days, and whether pickup is free | EXTERNAL (D022): a 6-month warranty on manufacturing defects, in D022's wording; the terms are owned by [policies](policies.md) |
| Country of manufacture | `src/lib/product-facts.ts:42-46` ("this site has never made it"). `/contact` contradicts it today: [claims.md](claims.md#31-origin-designed-and-built-here) | `src/lib/seo.test.ts:389`; `mid:test/claims-gated.test.ts:26,30` | F3 | EXTERNAL IF CONFIRMED (F3) |
| Toy-safety certificates (incl. BIS/ISI) | `src/lib/product-facts.ts:89-92` ("In progress") | see [claims.md](claims.md#6-certifications) | F4 | EXTERNAL IF CONFIRMED (F4) |
| Size, weight, materials | `src/app/(site)/products/kheelu/page.tsx:339` | none | F4 | EXTERNAL IF CONFIRMED (F4) |
| Charger details | same; live `/setup` | none | F4 | EXTERNAL IF CONFIRMED (F4). The wake word that shared this row does not exist ([D018](../decisions/D018-wake-up-button.md)) |
| Kheelona+ price | `src/config/site.ts:128-130` | `CLAUDE.md:704-707` | F7 | EXTERNAL IF CONFIRMED (F7) |
| Returns window | `/refund` ("not written yet"); owned by [policies.md](policies.md) | none | **Answered** ([D021](../decisions/D021-returns-policy.md)) | EXTERNAL (D021): 7-day returns, no questions asked; the terms are owned by [policies](policies.md) |
| Data retention period | `Technical-Todo.md:27-36` (dated trigger, HIGH since 5 Oct 2026); `security-review.md:209` | none | **Answered** ([D020](../decisions/D020-provider-terms-and-no-sale.md)) | EXTERNAL (D020): see "Retention period" above |
| Grievance contact | same | none | F2, mostly answered ([D029](../decisions/D029-grievance-officer-legal-review.md) names the officer); the acknowledgement time is open | Owned by [policies](policies.md): the officer's name, designation and contact are EXTERNAL (D029); the response times are EXTERNAL IF CONFIRMED (F2) |
| Product privacy policy | `src/app/(site)/privacy/page.tsx:203` | none | F5's facts are answered ([D019](../decisions/D019-voice-providers.md), [D020](../decisions/D020-provider-terms-and-no-sale.md)); the policy waits on the [D029](../decisions/D029-grievance-officer-legal-review.md) review | EXTERNAL IF CONFIRMED (the D029 review and the founder's approval) |
| The live paid count (units left of 500) | never published, by design; owned by [pricing.md](pricing.md) | n/a | none (by design) | INTERNAL |

(F-numbers are in [open questions](../open-questions.md) section B.)

## Company facts the site uses as proof

Published on the live site; **none verified by this agent**.

**Recognition strip.** Four entries, rendered by `RecognitionStrip` on live `/`, `/team` and
`/playos` (`src/app/(site)/page.tsx:163`, `team/page.tsx:242`, `playos/page.tsx:273`). A text-only
fetch shows only two, because two are logos whose name is the image's alt text (confirmed on live
`/team`, 2026-10-10):

| Entry | How it renders | Also in | Site |
|---|---|---|---|
| NVIDIA Inception Program | Logo, `/recognition/nvidia-inception.png` | Organization schema `memberOf` (`src/lib/seo.ts:172-175`); `/llms.txt` | EXTERNAL IF CONFIRMED (F11, G3) |
| Karnataka Elevate | Seal plus text | `/llms.txt` | EXTERNAL IF CONFIRMED (F11, G3) |
| nasscom startups | Logo, `/recognition/nasscom.png` | Organization schema `memberOf`; `/llms.txt` | EXTERNAL IF CONFIRMED (F11, G3) |
| Founders Inc | Text only | `/llms.txt` | EXTERNAL IF CONFIRMED (F11, G3) |

Sources: `src/components/organisms/RecognitionStrip.tsx:15-29` (comment: "founder-published",
mirrored from kheelona.ai); `src/app/llms.txt/route.ts:114-115`. The schema comment
(`src/lib/seo.ts:168-171`) keeps Karnataka Elevate and Founders Inc out of `memberOf` "until the
founder names the relationship (award? grant? investor?)". **Unproven** until the founder supplies
an acceptance email or listing URL for each ([open questions](../open-questions.md) F11); whether
the logos appear on the new site at all is G3.

**Team.** CTO Aman Soni "holds 14 patents filed in his own name" (live `/team`, `/playos`); Kashyap
C.R "years at Intel leading Thunderbolt 4 and 5 compliance" (live `/team`; `CLAUDE.md` says this
mirrors his kheelona.ai bio). Three co-founders: Apoorva Sahu, Aman Soni, Kashyap C.R (live
`/llms.txt` line 16). Ria Mangala Rewari is on the live `/team` but was removed from the whole mid
version at the founder's request (`mid:docs/checkpoints/cmo-merge-2026-10.md`, review round 2).

**Site:** the three co-founders' names EXTERNAL (company basics); the patents and the Intel work
EXTERNAL IF CONFIRMED (F11, and the grey list); Ria Mangala Rewari BANNED (removed from the whole mid version
at the founder's request).
