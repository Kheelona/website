---
title: Product facts (verified)
type: product
updated: 2026-10-10
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
  - wiki/open-questions.md (IDs F1-F12, G3, G5, Q3, section E)
---

# Product facts (verified)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Every fact about Kheelu that the site may state, with where it comes from and where it is live.
Claims (what we may *say* about those facts, and what is banned) live in [claims.md](claims.md).
Every age statement is reviewed in [age-band-review.md](age-band-review.md). Prices, the offer,
GST and delivery cost live in [pricing.md](pricing.md); refund, returns, shipping and warranty terms
in [policies.md](policies.md); the checkout steps in [../site/checkout.md](../site/checkout.md).
Open items link to [open questions](../open-questions.md) by ID.

## How to read this page

- **Live** = on production today. Production is `77552ff` (tag `archive/pre-reset-2026-10-10`).
  Confirmed by fetch on 2026-10-10: `/how` returns 404 and `/faq` returns 308, which is the tag's
  routing, not the mid version's; `/api/health` reports `"preorder":"token"`.
- **Mid** = only on the unreleased mid version (tag `archive/mid-version-2026-10-10`, PR #16, never
  deployed). Cited as `mid:<path>:<lines>`.
- **Both** = the same on both.
- **Unpublished** = deliberately not stated anywhere.
- "Verified" means traced to a founder-sourced constant, a dated founder decision, or a fetched live
  page. **No product behaviour could be verified by inspection**: the toy has not shipped and no
  unit was available to this agent. Behaviour facts below are what the founder has approved for
  publication, not what was tested ([open questions](../open-questions.md) F8).

## Identity

| Fact | Value | Source | Status |
|---|---|---|---|
| Product name | **Kheelu** | `CLAUDE.md:690`; `src/lib/seo.ts` Product `name: "Kheelu by Kheelona"` | Both |
| Former name | **Lumi**, renamed 2026-09-05. Same product. Schema keeps `alternateName: "Lumi"` and the Product `@id` `…/products/lumi#product` on purpose (URL detail: [../site/url-map.md](../site/url-map.md)) | `CLAUDE.md` rename banner; `src/lib/seo.ts:280-302`; live `/llms.txt` line 12 | Both |
| Brand / maker | **Kheelona**; schema `manufacturer` points at the Kheelona Organization | `src/lib/seo.ts:303-304` | Both |
| What it is | A screen-free plush toy that talks with a child and answers back. "A plush toy, not a robot. No wheels, no face screen and no moving parts." | `src/app/llms.txt/route.ts:49,56` (live `/llms.txt` lines 13, 20) | Both |
| Look | Cream plush rabbit, one colourway ("Cream"), "with a speaker in its tummy and rainbow-lined ears" | `src/lib/kheelu-art.ts:27-29`; `src/app/(site)/products/kheelu/_components/ColorwayPicker.tsx:16-26` | Both |
| Schema category | "Screen-free AI toy" | `src/lib/seo.ts:305` | Both |

## Age

| Fact | Value | Source | Status |
|---|---|---|---|
| Published age today | **"3+"**, no ceiling (founder decision #8, 2026-08-23) | `src/config/site.ts:119-124`; `docs/checkpoints/migration-to-new-dsx.md:49-51` | Both; superseded for the new site |
| Schema audience today | `PeopleAudience`, `suggestedMinAge: 3`, no `suggestedMaxAge`, `audienceType: "Children"` | `src/lib/seo.ts:306-311`; live JSON-LD on `/` and `/products/kheelu` | Both |
| Band for the new site | **3 to 7**, published everywhere. Decided by the brief, overriding decision #8 and the positioning's 4 to 7 ([open questions](../open-questions.md) section E) | `wiki/raw/brief/kickoff-brief.md:17,25,497` | Neither yet |

Every place an age is stated, and what changes, is in [age-band-review.md](age-band-review.md).

## Modes and connectivity

Three modes (Story mode was "Kheelu mode" until 2026-09-05). Connectivity is stated **per mode**,
never as a blanket "works offline" (§8.24-1, `CLAUDE.md` V6 summary).

| Mode | What it does | Needs | Source | Status |
|---|---|---|---|---|
| AI mode | Open conversation | Home WiFi and Kheelona's servers | `src/lib/product-facts.ts:72,75-78`; `src/components/organisms/KheeluModes.tsx:35` | Both |
| Story mode | Stories and lessons a child can interrupt, question and be quizzed on | Works offline | same; `src/app/(site)/products/kheelu/page.tsx:237` | Both |
| Bluetooth mode | Kheelu becomes the speaker for a paired phone | A paired phone only | same | Both |

**Inconsistency to fix:** `/playos` says the on-toy brain makes "answers come fast and work offline"
(`src/app/(site)/playos/page.tsx:109`), which contradicts the per-mode rule. Listed as retired
wording in [claims.md](claims.md#4-retired-or-banned-wording).

## Languages

| Fact | Value | Source | Status |
|---|---|---|---|
| Named languages | **8, "named and final"** (founder, 2026-07-31): English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French | `src/config/site.ts:141-157`; `docs/checkpoints/closed-rounds.md:313` | Both |
| Ceiling | "Up to 10" | same | Both |
| Switching | "Switches mid-sentence" | `src/lib/product-facts.ts:70` | Both |

Wording differs by page: "8 at launch … up to 10" (production spec table), "up to ten languages at
launch" (FAQs), "eight languages at launch" (journal, `src/lib/stories-expansion.ts` "questions
parents ask"), "8 named today, up to 10 at launch" (`mid:src/lib/product-facts.ts:70`). The facts do
not differ (8 named, ceiling 10); the new copy picks one wording and renders it from
`KHEELU_LANGUAGES` / `LANGUAGES_LINE`.

## What it listens for, and where the voice goes

| Fact | Value to publish | Source |
|---|---|---|
| Listening | "Listens only for its wake word. Nothing is recorded or sent before it." (the production wording was retired as inaccurate; it and every live location: [claims.md](claims.md#41-the-retired-microphone-wording)) | `mid:src/lib/product-facts.ts:76` |
| The wake word itself | **Unpublished**: "published … before Kheelu ships" ([open questions](../open-questions.md) F4) | `src/app/(site)/products/kheelu/page.tsx:339`; live `/setup` |
| First processing | "The first thinking happens on the toy itself, before anything is sent anywhere" (both versions) | live `/` and `/safety`; `mid:src/lib/safety.ts:44-45` |
| Where voice goes | Production: "Stays in your region". Mid: "Kheelona's own servers, **in India**" (founder-confirmed 2026-10-04) | `src/lib/product-facts.ts:80`; `mid:src/lib/product-facts.ts:86-88`; `mid:docs/checkpoints/cmo-merge-2026-10.md:28` |
| Sold? | "Never sold, never used to advertise to your child" (both) | both product-facts files |
| Consent | "Nothing is collected without your say-so" (both) | `src/app/(site)/safety/page.tsx:43` |
| Deletion | Any conversation deletable in one tap in the parent app (both) | `src/lib/product-facts.ts:79` |
| Model training | "A small voice model trained only for children … learns from conversations families separately opt into" (not changed on mid) | `src/app/(site)/playos/page.tsx:146-147,258` |
| Retention period | **Unpublished** ([open questions](../open-questions.md) F2, F5) | grep of `src/` for retention, 2026-10-10: none |
| Product privacy policy | **Not published**: "A full product privacy policy will be published here before Kheelu ships." ([open questions](../open-questions.md) F5) | `src/app/(site)/privacy/page.tsx:203` |

Whether "in India" holds for every processor, including any outside AI or speech provider, is
[open questions](../open-questions.md) F5; the conflict is laid out in
[claims.md](claims.md#7-childrens-data-what-is-published-versus-documented).

## Internet and camera

| Fact | Value | Source | Status |
|---|---|---|---|
| Open internet | Cannot browse or search; answers come from a closed library | `src/lib/product-facts.ts:74` | Both |
| Spec row wording | Production: "Internet access: None" (contradicts AI mode on WiFi). Mid: "Open internet: No … connects only to our own servers" | `src/lib/product-facts.ts:74`; `mid:src/lib/product-facts.ts:77-80` | Production wording is wrong |
| Camera | **None** (founder-confirmed 2026-10-04) | `mid:src/lib/comparison.ts:86`; `mid:docs/checkpoints/cmo-merge-2026-10.md:28` | Mid only. Production never states it (live text checked 2026-10-10; "camera" appears only in video alt text) |

## Parent app

Published features (none verifiable until ship; [open questions](../open-questions.md) F8): daily
summary; the full conversation log word for word; delete any conversation in one tap; topic
controls; quiet hours; language choice; a count of new words learnt; "one simple thing to do
together each day"; alerts ("if something ever needs your attention, you hear about it first");
"parenting philosophy, in one prompt".
Sources: `src/lib/product-facts.ts:79`; `src/app/(site)/products/kheelu/page.tsx:297`;
`src/features/home/components/ParentAppSection.tsx:19,45`; live `/llms.txt` lines 36-40.
Status: Both (mid uses the same list; Home's card shows the real app screenshot,
`mid:docs/checkpoints/cmo-merge-2026-10.md:36-37`).

**The parent app is part of Kheelona+**, which is included for 6 months only (next section). What a
parent keeps after that is not stated ([open questions](../open-questions.md) F7).

## Kheelona+

This page owns the Kheelona+ terms; other pages link here.

| Fact | Value | Source | Status |
|---|---|---|---|
| The only sanctioned wording | "Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Kheelu's smart features are yours for life, and Kheelona+ pricing is announced soon." (founder, 2026-07-31) | `src/config/site.ts:126-134` (`KHEELONA_PLUS_LINE`); `docs/checkpoints/closed-rounds.md:314` | Both |
| Renewal | "Nothing renews without you" | live `/`, `/products/kheelu` | Both |
| Price after 6 months | **Unpublished and gated** (no ₹ amount may be stated) ([open questions](../open-questions.md) F7) | `src/config/site.ts:128-130`; `CLAUDE.md:704-707` | Unpublished |
| "Free for life" | **NOT confirmed** (2026-10-04); the claim and its live variant are in [claims.md](claims.md#3-not-confirmed-do-not-publish) ([open questions](../open-questions.md) F7) | `mid:test/claims-gated.test.ts:18,29` | Banned on mid |

## Ship date

| Fact | Value | Source | Status |
|---|---|---|---|
| Shipping **starts** | **20 October 2026** (`SHIP_DATE_TEXT`, `SHIP_DATE_ISO = 2026-10-20`). This is the dispatch start, not an arrival date | `src/config/site.ts:136-139`; `docs/checkpoints/migration-to-new-dsx.md:48`; live `/products/kheelu` price table | Both |
| History | 1 September → 1 October (2026-08-22) → 20 October (2026-08-23) | `docs/checkpoints/closed-rounds.md:312` | n/a |
| Order of dispatch | "Pre-orders are served first, in the order they were placed" | live `/`, `/shipping` | Both |
| Schema | `availability: PreOrder`, `availabilityStarts: 2026-10-20` | `src/lib/seo.ts` offers block | Both |

Today is 2026-10-10, ten days before this date. Whether it still holds is
[open questions](../open-questions.md) F12. Several items are promised "before Kheelu ships" and
none is published yet: warranty and returns (F1), battery life, wake word and certificates (F4),
the product privacy policy (F5). Fixing live copy before 20 October is Q3.

## In the box

Kheelu, "a charger", "a quick-start card" (`src/app/(site)/products/kheelu/page.tsx`, "What is in
the box", live). Charger and cable type: unpublished (live `/setup`: "exact wake word and charger
details will be published … before Kheelu ships"; `mid:MARKETING-TODO.md:94`;
[open questions](../open-questions.md) F4).

## Support channel

This page owns the support channel; other pages link here.

| Fact | Value | Source | Status |
|---|---|---|---|
| WhatsApp | **+91 91875 46483, messages only, not calls**; every visible label must say so (founder, 2026-08-22) | `src/config/site.ts:195-202`; `src/lib/legal.ts:22` | Both |
| Email | hello@kheelona.com (founder-confirmed monitored inbox, 2026-07-28) | `src/config/site.ts:173-174` | Both |
| Never publish | The legacy Wix number +91 98765 43210 (a placeholder) | `docs/checkpoints/closed-rounds.md:166` | n/a |

`CLAUDE.md:700` says support is "WhatsApp only", but every live page also offers the email address
(`src/lib/legal.ts:22`). Read "WhatsApp only" as "the only phone channel".

## Seller of record

**Kheelona Robotics Private Limited**, Bengaluru (`src/config/site.ts:176-193`, founder-supplied
2026-08-22 from the GST certificate; rendered once through `SELLER_SECTION`, `src/lib/legal.ts:10-24`).
Status: Both. The GSTIN, registered address, where the block is printed, and the missing grievance
officer are owned by [policies.md](policies.md) ("Seller details (as published)").

## The product family

`/` and `/products/kheelu` show **Kheelu Speaker (ages 5+, "coming soon")** and **AI books (3+,
"coming soon")**, neither purchasable (`src/lib/family.ts:40-47`; live `/pricing.md`). The
positioning wants "one product, one promise" (`wiki/raw/positioning/Kheelona Positioning Strategy.docx`,
"Market to ages 4 to 7. One product, one promise"). Whether the family stays is a messaging call for
[../brand/messaging.md](../brand/messaging.md).

## Deliberately unpublished

Each of these is absent on purpose. Never fill one with a guess; a gap becomes a marked placeholder
and an open question.

| Item | Where the gap is stated | Guard | Open question |
|---|---|---|---|
| Battery life | `src/lib/product-facts.ts:38-39,87` ("Not announced yet") | `src/lib/seo.test.ts:387` bans "battery" in the spec table | F4 |
| Warranty terms | `src/lib/product-facts.ts:40-41,88`; `/products/kheelu` FAQ (line 102); `/refund` | `src/lib/seo.test.ts:388` | F1 |
| Country of manufacture | `src/lib/product-facts.ts:42-46` ("this site has never made it"). `/contact` contradicts it today: [claims.md](claims.md#31-origin-designed-and-built-here) | `src/lib/seo.test.ts:389`; `mid:test/claims-gated.test.ts:26,30` | F3 |
| Toy-safety certificates (incl. BIS/ISI) | `src/lib/product-facts.ts:89-92` ("In progress") | see [claims.md](claims.md#6-certifications) | F4 |
| Size, weight, materials | `src/app/(site)/products/kheelu/page.tsx:339` | none | F4 |
| Wake word, charger details | same; live `/setup` | none | F4 |
| Kheelona+ price | `src/config/site.ts:128-130` | `CLAUDE.md:704-707` | F7 |
| Returns window | `/refund` ("not written yet"); owned by [policies.md](policies.md) | none | F1 |
| Data retention period, grievance contact | `Technical-Todo.md:27-36` (dated trigger, HIGH since 5 Oct 2026); `security-review.md:209` | none | F2 |
| Product privacy policy | `src/app/(site)/privacy/page.tsx:203` | none | F5 |
| The live paid count (units left of 500) | never published, by design; owned by [pricing.md](pricing.md) | n/a | none (by design) |

(F-numbers are in [open questions](../open-questions.md) section B.)

## Company facts the site uses as proof

Published on the live site; **none verified by this agent**.

**Recognition strip.** Four entries, rendered by `RecognitionStrip` on live `/`, `/team` and
`/playos` (`src/app/(site)/page.tsx:163`, `team/page.tsx:242`, `playos/page.tsx:273`). A text-only
fetch shows only two, because two are logos whose name is the image's alt text (confirmed on live
`/team`, 2026-10-10):

| Entry | How it renders | Also in |
|---|---|---|
| NVIDIA Inception Program | Logo, `/recognition/nvidia-inception.png` | Organization schema `memberOf` (`src/lib/seo.ts:172-175`); `/llms.txt` |
| Karnataka Elevate | Seal plus text | `/llms.txt` |
| nasscom startups | Logo, `/recognition/nasscom.png` | Organization schema `memberOf`; `/llms.txt` |
| Founders Inc | Text only | `/llms.txt` |

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
