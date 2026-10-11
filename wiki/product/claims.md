---
title: Claims register
type: product
updated: 2026-10-10
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
  - wiki/open-questions.md (IDs Q3, Q4, F1-F11, G3, G5, G6, section E)
---

# Claims register

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

What the site may say about Kheelu, what it may not, and why. The underlying facts are on
[facts.md](facts.md); every age statement is reviewed on [age-band-review.md](age-band-review.md).
Brand wording (friend, companion, tutor, AI toy as the headline noun) belongs to
[../brand/voice.md](../brand/voice.md) and [../brand/messaging.md](../brand/messaging.md); this page
lists only wording that makes a factual claim. Open items link to
[open questions](../open-questions.md) by ID.

**Status key.** CONFIRMED = the founder confirmed it, with a date. PUBLISHED = live, approved as copy
at the time, never re-confirmed as fact. NOT CONFIRMED = do not publish. RETIRED / BANNED = known
wrong or withdrawn. PLACEHOLDER = drafted, not real. "Live" means production today (`77552ff`, the
tag); "mid" means the unreleased mid version.

**Rule for the new site (brief section 4, item 2):** a claim ships only if it is CONFIRMED or
PUBLISHED and not contradicted below. Anything else is a marked placeholder plus an entry in
[../open-questions.md](../open-questions.md).

## 1. Confirmed by the founder

| Claim (wording that may ship) | Confirmed | Source | Live? |
|---|---|---|---|
| Kheelu has **no camera** | 2026-10-04 | `mid:docs/checkpoints/cmo-merge-2026-10.md:28`; `mid:src/lib/comparison.ts:86` | Mid only |
| Kheelu **says it is a toy** and **never asks a child to keep a secret** from a parent | 2026-10-04 | same; `mid:src/lib/safety.ts:33-37` | Mid only |
| Voice goes only to **Kheelona's own servers, in India** | 2026-10-04 | same; `mid:src/lib/safety.ts:47-50`; `mid:MARKETING-TODO.md:148` | Mid only (production says "your region"). **Re-check open**: section 7 and [open questions](../open-questions.md) F5 |
| Brain claims are **research-anchored**: conversation helps a young brain grow, and Kheelu gives a child more of it. Never "Kheelu grows the brain" | 2026-10-04 (decision 4) | `mid:docs/checkpoints/cmo-merge-2026-10.md:29`; `mid:test/claims-gated.test.ts:20-22` | Mid only |

**Also founder-confirmed, owned on other pages:** the Kheelona+ line
([facts.md](facts.md#kheelona)), the support channel ([facts.md](facts.md#support-channel)), the ship
date and the eight languages ([facts.md](facts.md)), prices including GST ([pricing.md](pricing.md)),
seller details ([policies.md](policies.md)). The 2026-08-23 "3+, no ceiling" decision is superseded
for the new site: the published band is 3 to 7 ([open questions](../open-questions.md) section E;
[age-band-review.md](age-band-review.md)).

## 2. Published product-behaviour claims (live, not re-confirmed)

These are live and were approved as copy, but describe how the toy behaves. Nothing here can be
checked until units ship, and shipping starts in ten days. **Each needs the product team's yes before
it goes on the new site** ([open questions](../open-questions.md) F8).

| Claim as published | Where (live) |
|---|---|
| The first thinking happens on the toy, before anything is sent | `/`, `/safety` (`src/app/(site)/safety/page.tsx:36,82,90`), `/products/kheelu` step 02 (`page.tsx:71`) |
| Answers come from a closed library; cannot browse or search | `src/lib/product-facts.ts:74`; `/safety` |
| Every reply passes an **age-graded safety layer**, on the device and in the cloud | `src/app/(site)/safety/page.tsx:37,94`; `/llms.txt` line 27 |
| "We attack our own safety layer before every release" | `src/app/(site)/safety/page.tsx:94` |
| When it does not know, it says so and moves on | `src/lib/stories-expansion.ts` ("questions parents ask") |
| Remembers the words a child knows; picks up where they stopped | `/`, `/products/kheelu` |
| "The feeling gets read … Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood" | `src/app/(site)/products/kheelu/page.tsx:72`. **Conflicts with the positioning's ban on "maps emotions"** (positioning docx, "Memory and emotions") |
| Parent app: full log, one-tap delete, topics, quiet hours, new-word count, daily summary, alerts | see [facts.md](facts.md#parent-app) |
| PlayOS is "a small language model built only for children, not shrunk from adult AI"; "Own the model … Nothing rented that matters" | `src/app/llms.txt/route.ts:59`; `src/app/(site)/playos/page.tsx:146-147` |
| The model "learns from conversations families separately opt into" | `src/app/(site)/playos/page.tsx:147,258` |
| "No wheels, no face screen and no moving parts" | `src/app/llms.txt/route.ts:49` |

## 3. Not confirmed: do not publish

| Claim | Why it is held | Source | Open question |
|---|---|---|---|
| "Talking is free for life"; "talking, safety controls and the log are free for life" | NOT confirmed 2026-10-04. Only the Kheelona+ line ([facts.md](facts.md#kheelona)) is sanctioned | `mid:test/claims-gated.test.ts:18,29`; `mid:MARKETING-TODO.md:92,150` | F7 |
| "Kheelu keeps talking whether or not you renew" | The same claim in other words. **Live** in the journal | `src/lib/stories-expansion.ts:504` (live); banned at `mid:test/claims-gated.test.ts:29` | F7 |
| "Kheelu helps your child's brain grow" (positioning's hero line) | Positioning allows it **only after a named child-development advisor signs off**; founder decision 4 bans it as written. No advisor is named | positioning docx ("Can claim after advisor sign-off"); `mid:test/claims-gated.test.ts:20-22` | F9 |
| Any pilot result ("children learnt X words", "answered X questions a session") | Needs pilot data with the sample shown | positioning docx ("Results") | none yet |
| "Our pilot results will be published, good or bad" | Unsigned public commitment | `mid:test/claims-gated.test.ts:25`; positioning docx objection table repeats it | F10 |
| "We plan to be here for years" | Unsigned continuity promise | `mid:test/claims-gated.test.ts:24` | none |
| Where Kheelu is made | See 3.1 below | | F3 |
| "[1-year] warranty", "15-day returns" | Bracketed in the positioning; no policy exists | positioning docx objection table; [policies.md](policies.md) | F1 |
| "Recordings kept for X days"; "voice is / is not used to train AI" | Open in the positioning (2026-10-08) | positioning docx objection table and "Decisions for the founders" | F5 |
| "See how long your child talks" (usage time in the app) | Not a published feature | `mid:test/claims-gated.test.ts:27` | F8 |
| "Bedtime stories only after 7" | Unconfirmed parent-app control | `mid:test/claims-gated.test.ts:28` | F8 |
| "Kheelu adapts" | Not confirmed by the product team; positioning also drops "adapts" | `mid:MARKETING-TODO.md:52`; positioning docx ("Other words to stop using") | F8 |
| Understands a 3-year-old's speech first time | Needs a pilot rate; positioning notes "speech recognition is weaker under 4" | `mid:MARKETING-TODO.md:126`; positioning docx ("Where I depart from the research") | G5 |
| "[X] of 500 left" | The live count is never published, by design | `mid:MARKETING-TODO.md:66`; [pricing.md](pricing.md) | none (by design) |
| Market price ranges in a comparison row | Need checked ranges and a "checked on" date. Note the live buyer's guide already states "around ₹14,000 for a robot with a screen" without a source | `mid:src/lib/comparison.ts:22-24`; `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:131` | Q4 (SKM's competitor review) |
| A named advisor, "Reviewed by [advisor]" | No advisor named | `mid:MARKETING-TODO.md:70,82` | F9 |

### 3.1 Origin: "designed and built here"

This page owns the origin issue.

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

## 4. Retired or banned wording

"Live" in the last column means production still publishes it today, so the new site must not carry
it over. Fixing live copy before 20 October is [open questions](../open-questions.md) Q3.

| Wording | Status and reason | Guard / source | Still live? |
|---|---|---|---|
| "The microphone is off. Not muted. Off." and every variant | RETIRED 2026-10-04. Full list of variants and locations in 4.1 | 4.1 | **Yes**, 15 places |
| "Internet access: None" | Wrong: AI mode uses home WiFi. Say "cannot reach the open internet" | `mid:src/lib/product-facts.ts:77-80` | Yes (spec table, JSON-LD, buyer's guide) |
| "Stays in your region" / "Kheelona's own voice brain, stays in your region" | Superseded by "our own servers, in India" (pending the section 7 re-check, F5) | `mid:docs/checkpoints/cmo-merge-2026-10.md:188-189` | Yes (`/safety`, `/privacy`, spec table, `/llms.txt`, journal) |
| "Answers … work offline" (PlayOS) | Wrong for AI mode | `mid:docs/checkpoints/cmo-merge-2026-10.md` commit 12 | Yes (`playos/page.tsx:109`) |
| "grows their vocabulary" (AI mode) | Not research-anchored (decision 4) | same | Yes (`KheeluModes.tsx:35`) |
| "cognitive development toy" | Retired on mid for "a screen-free AI toy" | same | Yes (`stories.ts:118`); `/playos` chip "Cognitive development" (`playos/page.tsx:47`) |
| "Families already using Kheelu." | Kheelu has not shipped; only pilot families have used it | mid review round 2 | Yes (`store/page.tsx:116`) |
| "Meet Kheelu on 20 October" | 20 October is when shipping **starts**, not delivery | `mid:test/claims-gated.test.ts:23` | No |
| "Kheelu helps / grows / builds / develops / supports … brain"; "supports your child's brain development"; "helps your child's brain grow" | Founder decision 4 | `mid:test/claims-gated.test.ts:20-22` | No exact match live |
| "Made in Bengaluru / India", "designed and built here" | Origin never claimed; see 3.1 | `mid:test/claims-gated.test.ts:26,30` | "Designed and built here": yes (`/contact`) |
| Dead age ranges "2 to 5", "2 to 14", "3 to 6", "3 to 10", "2 to 8" | Retired 2026-08-23 | `src/lib/seo.test.ts:92-98`; live `/llms.txt` line 14 | No (except third-party guidance quoted in the journal, which is fine) |
| "30 September", "₹9,999", "1 October 2026"; "costs nothing", "pre-order list", "waitlist", "no commitment", "reserving is free" | Retired offer terms | `test/preorder-copy.test.ts:40-100` | No |
| "Lumi" as the current name | Renamed 2026-09-05; allowed only as `alternateName` and in the "Is Kheelu the same as Lumi?" answer | `CLAUDE.md` rename banner | Only as allowed |
| Positioning's never-say list: "boosts IQ", "makes your child smarter", "develops the brain 2x faster", "genius", "don't miss the window", "your child will fall behind", "Harvard-proven", "scientifically proven toy", "as good as a parent", "maps emotions and triggers", "long-term memory", any health claim (speech delay, late talkers, ADHD, autism, therapy) | ASCI substantiation and anti-anxiety rules | positioning docx, "Claims guardrails" | Health: **yes**, see the late-talker article in [age-band-review.md](age-band-review.md) |

### 4.1 The retired microphone wording

This page is the only owner of this wording and its locations; other pages link here.

**Retired 2026-10-04** (founder, content doc v7 Appendix B): a wake-word toy listens for its word, so
"off" and "not muted" were never accurate. **Say instead:** Kheelu **listens only for its wake word,
and records or sends nothing before it** (`mid:src/lib/faq.ts:93-96`;
`mid:src/lib/product-facts.ts:76`). The final wording is part of
[open questions](../open-questions.md) G5.

Every location at the tag (`git grep` over `src/`, 2026-10-10). All are live on production (the
tag is the deployed commit; rows 3, 5, 11, 14 and 15 were also confirmed by a plain GET of
`/safety` and the three articles, 2026-10-10).

| # | Where (tag) | Live on | Wording | Mid version |
|---|---|---|---|---|
| 1 | `src/lib/product-facts.ts:73` | Spec table on `/ai-toys-for-kids-in-india` (`page.tsx:246`) **and the Product JSON-LD `additionalProperty`** on `/` and `/products/kheelu` (`src/lib/seo.ts:320`) | "Wakes to a word. Off the rest of the time, not muted." | Fixed (`:76`) |
| 2 | `src/app/(site)/safety/page.tsx:35` | `/safety`, "Listening starts with the wake word" | "The rest of the time, the microphone is off. Not muted. Off." | Fixed (`mid:src/lib/safety.ts:17-22`) |
| 3 | `src/app/(site)/safety/page.tsx:82` | `/safety`, answer "Are AI toys safe for children?" | "Kheelu's mic wakes to a word and is off otherwise." | Fixed (`mid:…/safety/page.tsx:89`) |
| 4 | `src/app/(site)/safety/page.tsx:86` | `/safety`, FAQ "Is Kheelu always listening?" | "the microphone is off, not muted. Off." | Fixed (`mid:src/lib/faq.ts:95`) |
| 5 | `src/app/(site)/safety/page.tsx:129` | `/safety`, FAQ "smart toys for toddlers" | "a microphone that sleeps until a wake word" (softer variant) | Fixed (`mid:…/safety/page.tsx:126`) |
| 6 | `src/app/(site)/page.tsx:113` | `/`, FAQ "Is an AI toy safe for a small child?" | "the microphone is off the rest of the time" | Fixed (`mid:src/lib/faq.ts:37`) |
| 7 | `src/features/home/components/TrustRoom.tsx:29` | `/`, safety room | "the mic is off the rest of the time" | Fixed (reads `mid:src/lib/safety.ts`) |
| 8 | `src/app/(site)/products/kheelu/page.tsx:70` | `/products/kheelu`, step 01 | "Until then, the microphone is off." | Fixed (`:80`) |
| 9 | `src/app/llms.txt/route.ts:64` | `/llms.txt` | "The microphone wakes to a word and is off the rest of the time." | Fixed (`:65`) |
| 10 | `src/app/(site)/ai-toys-for-kids-in-india/page.tsx:78` | buyer's guide, check 01 | "Off should mean off, not muted and waiting." | Fixed (`:83`) |
| 11 | `src/lib/stories.ts:137` | journal `what-to-look-for-in-a-safe-ai-toy` | "the microphone sleeps until a wake word" (softer variant) | **Not fixed** |
| 12 | `src/lib/stories.ts:141` | same article, check one | "Off should mean off, not muted and waiting." | Fixed |
| 13 | `src/lib/stories.ts:146` | same article, "How does Kheelu measure against the list?" | "wake-word listening with the microphone off the rest of the time" | Fixed |
| 14 | `src/lib/stories-expansion.ts:240` | journal `should-kids-use-ai` | "when your child says a wake word, and off the rest of the time" | **Not fixed** |
| 15 | `src/lib/stories-expansion.ts:497` | journal `questions-parents-ask-about-ai-toys`, "Does it record everything my child says?" | "A toy that wakes to a word is not listening between wakes." | **Not fixed** |

The mid version's guard (`mid:test/claims-gated.test.ts:19`) matched only "the microphone is off",
"mic is off", "Not muted. Off" and "off the rest of the time, not muted", which is why rows 11, 14
and 15 survived there. A guard on the new site needs to catch "off the rest of the time", "off
otherwise", "sleeps until" and "not listening between wakes" as well.

**Also in the source documents (not on the site; checked 2026-10-10):** the positioning's "It only
listens after its wake word" (`wiki/raw/positioning/Kheelona Positioning Strategy.docx`, paragraph
307), and the design system as delivered (working tree, not in the tag): "Not muted. Off." as the
house example of a short sentence (`design-system/project/01-writing.md:11`) and as the answer to "Is
it listening all the time?" (`07-selling.md:66`), "the microphone is off until the wake word"
(`04-kheelu.md:73`), and a CampaignKit social post "Not muted. / Off."
(`components/CampaignKit/preview.html:52`). Both conflict with the founder's 2026-10-04 accuracy
ruling; per [open questions](../open-questions.md) section E that is a Gate A conflict, not resolved
silently (G5).

**Not variants (fine as written):** the question "When is the microphone on?"
(`ai-toys-for-kids-in-india/page.tsx:77`, `llms.txt/route.ts:88`) and "Kheelu wakes to a word"
on its own (`src/app/(site)/products/kheelu/page.tsx:87`).

## 5. Placeholder content

| Item | Status | Source |
|---|---|---|
| **Three testimonials on named people** (Shweta, Priyamvada, Gaurav, labelled "Pilot parent") | **Drafted words, not spoken.** The names are real; the quotes are not. The founder decided on 2026-07-28 to "let it be as it is" on the current site. **Decided by the brief: they do not move to the new site** ([open questions](../open-questions.md) section E) | `src/components/organisms/ParentQuotes.tsx:7-31`; `docs/checkpoints/closed-rounds.md:153-156,316`; live `/` and `/products/kheelu` |
| Seven parent and child films | Real footage with burned-in captions; `consentOnFile: true` is a code flag per film. **No consent record was seen by this agent.** Captions still contain em dashes (founder to re-export). Use on the new site is [open questions](../open-questions.md) G3 | `src/lib/video-moments.ts:24,63,103-202`; `CLAUDE.md` video banner |
| Pilot numbers, city and age per parent, written consent | Owed by the team | `mid:MARKETING-TODO.md:50,158` |
| Content doc v7 brackets: "[₹X/month]", "[X] of 500 left", "[1-year] warranty", "Safety tests: [status]", "Reviewed by [advisor]" | Never shipped; the mid version hid any block needing them | `mid:MARKETING-TODO.md:27-28,47,64-67,82` |

## 6. Certifications

All open items here are [open questions](../open-questions.md) F4.

| Item | Status | Source |
|---|---|---|
| Toy-safety certificate (any) | **None received.** Published as "In progress … no badge is claimed before it is earned" | `CLAUDE.md:707`; `src/lib/product-facts.ts:89-92`; live `/ai-toys-for-kids-in-india` ("no toy-safety certificate has been issued to us") |
| **BIS / ISI mark** | **Not mentioned anywhere on kheelona.com** (grep of `src/`, 2026-10-10: zero). kheelona.ai/safety lists "BIS IS 9873 / EN 71 / ASTM F963 (scoped per product & region)". The positioning plans "Amazon listing (after BIS)" and asks for a "BIS date". Mid listed "BIS, toy lab, battery certification dates" as owed | kheelona.ai/safety (fetched 2026-10-10); positioning docx ("Amazon listing (after BIS)"); `mid:MARKETING-TODO.md:103,163` |
| BIS as a legal requirement | **Not verified here, and not legal advice.** This agent's understanding is that toys sold in India fall under the Toys (Quality Control) Order, 2020, which requires BIS certification. Confirm with SKM or counsel before the site says anything | none (flagged) |
| Privacy frameworks on `/safety` | "COPPA (2026): Designed for", "GDPR-K: Designed for", "India DPDP: Designed for", "ISO 27001: In progress". These are self-assessed design targets, not certificates, and the page says so | `src/app/(site)/safety/page.tsx:55-62,296-301` |
| Battery safety certification | Unknown; no battery life published; `/team` still says "the battery that lasts" | `src/app/(site)/team/page.tsx:58`; `mid:MARKETING-TODO.md:163` |
| Safety-standards FAQ | Removed 2026-07-31 until the first certificate lands | `src/app/(site)/safety/page.tsx:131-133` |

## 7. Children's data: what is published versus documented

Brief section 9.7: safety and privacy copy must describe **actual documented practice**. Today the
only documents are marketing pages; **no product privacy policy exists** ("will be published here
before Kheelu ships", `src/app/(site)/privacy/page.tsx:203`). Processors, retention, training and
the policy date are [open questions](../open-questions.md) F5; the grievance contact and counsel
review are F2; consent posture at launch is G6.

| Data | What the site says | Documented practice? |
|---|---|---|
| Child's age (asked of the parent at checkout) | Collected "because Kheelu is built for a narrow band of ages" | Yes: `/privacy` covers pre-order data (`privacy/page.tsx:29-30,43`) |
| Child's voice | Before the wake word: see 4.1. First processing on the toy; then "your region" (live) or "own servers, in India" (mid, confirmed 2026-10-04) | **No.** And the record conflicts: the positioning (sources opened 2026-10-08) still asks "where does the child's audio go, **including any outside AI provider**", says "Servers in India: only if true for the AI processing too", and the mid version's own list asked to "check the AI vendor's terms" (`mid:MARKETING-TODO.md:59,128`), while `/playos` says "Nothing rented that matters" (F5) |
| Transcripts | Readable and deletable by the parent in the app | **No** |
| Retention | Not stated anywhere | **No** (`Technical-Todo.md:35`; `security-review.md:209`, F-12) |
| Model training | "Learns only from conversations families separately opt into" (`/playos`) | **No** |
| Behaviour signals (daily summary, alerts, "the feeling gets read") | Live features | **No.** The site's own journal says DPDP section 9 prohibits "behavioural monitoring" of children (`src/lib/stories-expansion.ts`, data-law article). Whether these features count is a counsel question, not ours (F2) |
| Consent | "Nothing is collected without your say-so"; consent "is asked for from the parent account" | **No** |
| Grievance contact | Not published | **No** (F2) |

## 8. Brain and development claims, with their anchors

The rule (founder decision 4, 2026-10-04; positioning "Claims guardrails"): say that **research links
back-and-forth conversation to young children's language and brain development, and Kheelu is built
to give a child more of it**. Never say Kheelu itself has been shown to do it. An advisor's sign-off
on stronger wording is [open questions](../open-questions.md) F9.

| Anchor | What the source actually says | Checked | Used where |
|---|---|---|---|
| Harvard Center on the Developing Child, "Serve and return" | Exchanges "play a key role in shaping brain architecture" and help "build and strengthen neural connections"; they are "between a young child and a caring adult" | Fetched 2026-10-10 | Live `/` ("the back and forth that builds language and thinking"), journal; mid quotes the source and its "caring adult" (`mid:docs/checkpoints/cmo-merge-2026-10.md:133-137`) |
| Romeo et al. 2018, *Psychological Science* (PMC5945324) | 36 children aged about 4.5 to 6.8; "Only conversational turns significantly predicted additional variance in verbal scores", with Broca's-area activation, independent of income and parental education | Fetched 2026-10-10 | Journal: "a 2018 study of 36 children aged four to six" (accurate). The three-year-old article attributes the finding to "researchers at MIT" for three-year-olds; the sample was 4 to 6 |
| Xu et al. 2022, *Child Development* | Per the positioning: children understood stories better and learnt more words when an AI asked questions; children lead more with people | Not checked | Positioning only |
| NEP 2020, "over 85% of a child's brain develops by age 6" | Per the positioning, via EducationWorld | Not checked | Positioning only; quote only with the source |
| WHO 2019, AAP 2016, IAP 2022 screen guidance | Cited with links in the journal | Not re-checked this session | Journal |
| Common Sense Media, 22 January 2026 | Advice against AI toys for young children: quoted and reviewed in [age-band-review.md](age-band-review.md#4-common-sense-media-and-the-3-to-7-band) | Fetched 2026-10-10 | Three live journal articles |

**Live outcome claims with no research anchor** (PUBLISHED, need review under the rule above):
"A best friend at 3. A head start for school." (`src/lib/growth-arc.ts:9-10`, hero and meta,
retired on mid); "School teaches the class. Kheelu teaches your child." (`PacePanel.tsx:50`);
"Knowledge that sticks" (`src/app/(site)/page.tsx:139`); "A tutor runs out of time and patience.
Kheelu does not." (`Compare.tsx:32`); "grows their vocabulary" (`KheeluModes.tsx:35`);
"Between three and four a child's vocabulary roughly doubles" (unsourced,
`src/lib/stories-expansion.ts:456`).
