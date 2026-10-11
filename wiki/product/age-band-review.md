---
title: Age-band review (3 to 7)
type: product
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/brief/kickoff-brief.md (sections 2, 3, 9.3, 9.8; lines 17, 25, 58, 443, 497)
  - wiki/open-questions.md (section E; IDs F4, F5, F8, F9, G5, G8)
  - src/config/site.ts, src/lib/seo.ts, src/lib/product-facts.ts, src/lib/growth-arc.ts, src/lib/family.ts, src/lib/stories.ts, src/lib/stories-expansion.ts (tag archive/pre-reset-2026-10-10 = 77552ff, production on 2026-10-10)
  - src/app/(site)/**/page.tsx, src/app/layout.tsx, src/app/llms.txt/route.ts, src/app/pricing.md/route.ts, src/app/store/**, src/features/** (same tag)
  - src/lib/seo.test.ts lines 92-98 and package.json scripts (same tag)
  - docs/checkpoints/migration-to-new-dsx.md lines 49-51 (founder decision #8, 2026-08-23)
  - "git show archive/mid-version-2026-10-10:src/lib/{faq,comparison}.ts, MARKETING-TODO.md"
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx and Kheelona Positioning (1).pdf
  - "grep of src/ for: toddler, two-year, 2-year, year-old, aged N, ages N, under 3, small parts, choking, supervision (2026-10-10)"
  - Live pages and three journal articles, plain GET, fetched 2026-10-10 17:43 PDT; live sitemap.xml (35 URLs)
  - "Common Sense Media press release of 22 January 2026: https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks, fetched 2026-10-10"
---

# Age-band review (3 to 7)

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

Every place the site or its data states an age, or makes a claim that depends on age, checked against
the reset brief's band of **3 to 7** and its rule: **never imply the product suits children under 3**
(`wiki/raw/brief/kickoff-brief.md:17,25,58`). Product facts are on [facts.md](facts.md); claim
statuses on [claims.md](claims.md). Open items link to [open questions](../open-questions.md) by ID;
most of the wording calls here are G5.

**Verdicts.** OK = fine at 3 to 7 as written. CHANGE = must change, with how. NEEDS SKM = needs SKM's
(or the founder's) confirmation before anything ships.

## The band is decided: 3 to 7

| Source | Says | Date |
|---|---|---|
| Founder decision #8 | "Everything says 3+", no published ceiling | 2026-08-23 (`docs/checkpoints/migration-to-new-dsx.md:49-51`) |
| Mid version | Rendered the content doc's "3 to 7" as "3+"; "⛔ No age ceiling is published" | `mid:src/lib/comparison.ts:25-26`; `mid:MARKETING-TODO.md:30-31,125` |
| Positioning | Market to **4 to 7**; "3-year-olds only with a grown-up nearby"; not for under 3s or 8 and over | positioning docx ("Where I depart from the research", "Who it is not for (yet)"); PDF decision 4 |
| Reset brief | Parents of **3 to 7** year olds; "the 3–7 age band appears everywhere" | `kickoff-brief.md:17,25,497` |
| **Decision** | **The published band is 3 to 7, everywhere.** The brief overrides decision #8 and the positioning; no founder answer is needed | [open questions](../open-questions.md) section E |

Two different things are both called "age" here, and the new site should keep them apart:

1. **Who we market to:** parents of 3 to 7 year olds (decided).
2. **The toy's safety age grading:** the minimum age the toy is certified for. "3+" is the usual lower
   edge of toy-safety grading (`kickoff-brief.md:58`), but **no certificate exists yet**
   ([claims.md](claims.md#6-certifications)), so even "3+" is a design intent, not a tested grading
   ([open questions](../open-questions.md) F4).

**What the build does:** say "for ages 3 to 7" in copy; set schema `suggestedMinAge: 3` and
`suggestedMaxAge: 7`; and change the test in the same commit, because today
`expect("suggestedMaxAge" in KHEELU_PRODUCT.audience).toBe(false)` fails `npm test`
(`src/lib/seo.test.ts:97`). (`npm run build` runs no tests: it is `check-tokens.mjs && next build`,
`package.json:7`.) Split the one constant `KHEELU_AGES` into an audience band and a safety grading
so they cannot drift.

## 1. Data, constants and machine-readable files

| # | Where | What it says today | Live | Verdict | How |
|---|---|---|---|---|---|
| 1 | `src/config/site.ts:124` `KHEELU_AGES` | "3+"; rendered as "Ages 3+", "For ages 3+" across ~30 places | Both | CHANGE | Render "3 to 7" from a new audience constant (see "What the build does" above). One constant, so the change is cheap |
| 2 | `src/lib/seo.ts:306-311` Product `audience` | `suggestedMinAge: 3`, no max | Both | CHANGE | Add `suggestedMaxAge: 7`; update `seo.test.ts:92-98` in the same change |
| 3 | `src/lib/seo.ts:129,313` Organization and Product descriptions | "plush toy for ages 3+", "for children aged 3+" | Both | CHANGE | Render from the new audience constant |
| 4 | `src/lib/product-facts.ts:66` spec row "Age: 3+ years" (also JSON-LD `additionalProperty`) | "3+ years" | Both | CHANGE | Same |
| 5 | `src/app/llms.txt/route.ts:40,50,57` | "plush toy for ages 3+"; "Ranges of 2 to 5, 2 to 8 and 3 to 10 … are all wrong" | Both | CHANGE | State the chosen band as the correct fact; keep the list of wrong ranges |
| 6 | `src/app/pricing.md/route.ts:37,58` | "(the talking toy, ages 3+)"; "Kheelu Speaker, ages 5+" | Both | CHANGE | Speaker line depends on whether the family stays ([facts.md](facts.md#the-product-family)) |
| 7 | `src/app/layout.tsx:42,46` root default title and description | "ages 3+"; "talking friend for ages 3+" | Live (mid synced to Home) | CHANGE | n/a |
| 8 | `src/config/site.ts:164` WhatsApp share text | "for ages 3+" | Both | CHANGE | n/a |
| 9 | **Store form hint**, `src/features/preorder/components/PreorderForm.tsx:232` (live on store.kheelona.com) | "Kheelu is built for ages 3+. A number is fine, and so is **"nearly 3"**." | Both | **CHANGE** | "Nearly 3" invites an order for a child under 3. Say "Kheelu is built for children aged 3 to 7." This is copy inside the checkout, so the checkout owner makes the change without touching logic ([../site/checkout.md](../site/checkout.md)) |
| 10 | `src/app/store/e/[event]/page.tsx:101` event page | "A screen-free talking friend for ages 3+" | Both | CHANGE | n/a |
| 11 | `src/app/(site)/privacy/page.tsx:30` | "Kheelu is built for a narrow band of ages" | Both | OK at 3 to 7 | Becomes literally true with a ceiling. Counsel-gated page |

## 2. Marketing pages

| # | Where | What it says today | Live | Verdict | How |
|---|---|---|---|---|---|
| 12 | Home hero, `src/features/home/components/Hero.tsx:28`; `src/lib/growth-arc.ts:9-10` | "For ages 3+"; "A best friend at 3. A head start for school." | Live (mid retired the promise) | OK for the age; CHANGE the wording | "Head start for school" is an unanchored outcome claim ([claims.md](claims.md#8-brain-and-development-claims-with-their-anchors)); "best friend" is retired by the positioning ([../brand/voice.md](../brand/voice.md)) |
| 13 | Home growth arc, `src/lib/growth-arc.ts:28-49` | At 3, At 4, At 5, "Every year after" | Both | **CHANGE / NEEDS SKM** | Stops at 5 and then implies no ceiling. Needs a card each for 3, 4, 5, 6 and 7; the activities need SKM's (or an advisor's) sign-off. Positioning asks for an "age-by-age activity list for 4, 5, 6 and 7, signed off by the advisor"; mid listed the activities as unconfirmed (`mid:MARKETING-TODO.md:53`). Sign-off: [open questions](../open-questions.md) F9 |
| 14 | Home family band (`src/lib/family.ts`; live `/`) | "Starts talking at 3. Still teaching for years."; Kheelu 3+, Speaker 5+, AI books 3+ | Live (mid moved it to the product page) | CHANGE the wording | Numerically inside 3 to 7, but "for years" and "the school years" contradict the published ceiling. Whether the family stays at all is a messaging call ([facts.md](facts.md#the-product-family)); positioning: one product, one promise |
| 15 | Home FAQ "What is Kheelu?" (`src/app/(site)/page.tsx:77`) | "talks with children aged 3 and up" | Both | CHANGE | n/a |
| 16 | Home FAQ "What ages is Kheelu for?" (`page.tsx:92`) | "Ages 3+ … the wider family … keeps growing alongside" | Both (mid adds "learning toys for 5 and 6 year olds onward") | CHANGE | n/a |
| 17 | Home FAQ "Is an AI toy safe for a small child?" (`page.tsx:112-113`) | Mechanisms only; "small child" undefined | Both | NEEDS SKM (G5) | Does not address the Common Sense Media advice (section 4). Also carries the retired microphone wording ([claims.md](claims.md#41-the-retired-microphone-wording), row 6) |
| 18 | `/products/kheelu` title, meta, lede (`src/app/(site)/products/kheelu/page.tsx:42,48,164`) | "ages 3+"; "A talking friend for ages 3+" | Both | CHANGE | n/a |
| 19 | `/products/kheelu` FAQ "What ages is Kheelu for?" (`page.tsx:95`) | "Ages 3+ … learning toys for 5 and 6 year olds onward" | Both | CHANGE | The "5 and 6 year olds" phrase is an SEO keyword placement (owner: [../site/url-map.md](../site/url-map.md) / the keyword map) |
| 20 | `/products/kheelu` FAQ "best learning toys for 3-year-olds" (`page.tsx:99`) | "At 3, children learn through back-and-forth conversation … grows with your child from 3 up" | Both | OK at 3 to 7, except "grows with your child" | "From 3 up" reads as no ceiling; align to 3 to 7 in the rewrite. "Grows with your child" is BANNED (the "adapts" family, CTO ruling 2026-10-11, [claims §3](claims.md#3-not-confirmed-do-not-publish)) |
| 21 | `/products/kheelu` "birthday gift" FAQ and PacePanel | "the toy at 5 is not the toy they unwrapped at 3"; "First questions at 3 become stories …" | Both | OK at 3 to 7 | n/a |
| 22 | **`/safety` answer "Is an AI toy OK for a three-year-old?"** (`src/app/(site)/safety/page.tsx:101-111,273-282`) | Says child-development groups want what Kheelu does, and "we agree with most of what they ask for" | **Live, unsigned**: the code marks it `GATED:founder-signoff`, "comes out before the merge … unless they sign it off"; it shipped anyway. Mid removed it | **NEEDS SKM (G5)** | It answers the exact age question while leaving out the Common Sense Media advice (section 4). Do not carry it over; SKM writes a signed replacement |
| 23 | `/safety` FAQ "What should I look for in smart toys for **toddlers**?" (`safety/page.tsx:129`) | Toddler checklist | Both | **CHANGE** | "Toddler" usually means a child of about 1 to 3, so it implies under-3 use. Use "young children" or "3 to 7 year olds". It was an SEO keyword placement (2026-08-12), so the keyword map owner should know. Founder call: [open questions](../open-questions.md) G5 |
| 24 | `/safety` "Every answer is age-graded … tuned to your child's age" (`safety/page.tsx:37,94`) | Age-dependent safety claim | Both | NEEDS SKM (F8) | Confirm with the product team how the age is set and that grading covers 3 to 7 (mid: "describe the filter tests", `mid:MARKETING-TODO.md:101`) |
| 25 | `/safety` "Safe in their hands" (`safety/page.tsx:290-295`) | "Designed for small hands … completing formal toy-safety testing now" | Both | NEEDS SKM (F4) | No age grading or warning is stated anywhere (section 3) |
| 26 | `/team` title "Team: the parents building smart toys for **toddlers**" (`src/app/(site)/team/page.tsx:19`) | (the title itself) | Live; mid kept "toddlers" as "Our story: parents building smart toys for toddlers" (founder's SEO call, open) | **CHANGE** | Same reason as row 23. Mid left it for the founder (`mid:docs/checkpoints/cmo-merge-2026-10.md`, review round 1 notes); G5 |
| 27 | `/playos` (`src/app/(site)/playos/page.tsx:19,21,54,157`) | "ages 3+"; "one memory that travels from age 3"; "One friend from age 3 up" | Both | OK at 3 (minimum) | Reads as no ceiling; align to 3 to 7 if the page stays. Its future is [open questions](../open-questions.md) G8 ([../site/url-map.md](../site/url-map.md)) |
| 28 | `/ai-toys-for-kids-in-india` FAQ "What age is an AI toy for?" (`page.tsx:135`) | "Kheelu is for ages 3+ … some are sold from 2, some from 5" | Both | CHANGE | n/a |
| 29 | `/ai-toys-for-kids-in-india` FAQ "Are AI toys safe for a 3 year old?" (`page.tsx:122`) | "It depends entirely on the toy" | Both | NEEDS SKM (G5) | Same gap as row 17 (section 4) |
| 30 | Mid comparison row (`mid:src/lib/comparison.ts:51-53`) | "Made for ages 3+"; robot toys "Often made for 5 and up" | Mid only | CHANGE | Use the chosen band; the competitor cell is an unchecked market claim |

## 3. Safety statements, warnings and certifications

| # | Item | Finding | Verdict |
|---|---|---|---|
| 31 | Age grading on the toy | **No certificate exists**, so no tested age grading exists ([claims.md](claims.md#6-certifications)) | NEEDS SKM (F4): the grading and its basis (BIS standard, test lab) |
| 32 | Small-parts, choking or "not for under 3" warning | **None anywhere on the site** (grep of `src/` for small parts, choking, under 3, supervision: zero hits, 2026-10-10). Toy-safety standards normally drive these warnings from the test report | NEEDS SKM (F4): what warnings the test report requires, so the product page and checkout carry them |
| 33 | Battery warnings | The toy has a rechargeable battery and charger (live "What is in the box"; `/team` "the battery that lasts"). No battery warning or certification is published | NEEDS SKM (F4) |
| 34 | "3-year-olds only with a grown-up nearby" | Positioning's condition for selling to 3-year-olds. The brief moves the band to 3 to 7 but does not say whether this condition survives | NEEDS SKM (G5) |
| 35 | Speech recognition at 3 | Positioning: "speech recognition is weaker under 4". Mid wanted a pilot rate for "Does it understand a 3-year-old's speech?" (`mid:MARKETING-TODO.md:126`) | NEEDS SKM (G5): do not imply Kheelu understands every 3-year-old until there is a pilot number |
| 36 | Data from children | Age-independent, but every child in 3 to 7 is a child under DPDP; see [claims.md](claims.md#7-childrens-data-what-is-published-versus-documented) | NEEDS SKM / counsel (F5, F2) |

## 4. Common Sense Media and the 3 to 7 band

This page owns Common Sense Media's advice; other pages link here.

Common Sense Media, press release of 22 January 2026 (URL in the front matter; re-fetched
2026-10-10): parents should **"avoid giving AI toys—smart toys with voice-based interactions—to
children age 5 and under"** and "exercise extreme caution before purchasing them for children age 6
to 12"; the headline says "no child 5 and under should be given an AI toy companion". It also reports
"27% of AI toy outputs were inappropriate for kids". Our band of 3 to 7 puts ages 3, 4 and 5 inside
the "avoid" group and 6 and 7 inside "extreme caution". The positioning knows this ("safety groups
draw a line at 5") and uses it to justify starting at 4.

The live journal quotes this advice in three articles while selling to 3+:

| # | Article (live, in the sitemap) | What it says | Verdict |
|---|---|---|---|
| 37 | "What to look for in a safe AI toy" (`src/lib/stories.ts:123-160`) | "No child of five or under should be given one … We build an AI toy for children aged three and up, so you would expect us to argue. We mostly agree." | NEEDS SKM (G5) |
| 38 | "Should kids use AI?" (`src/lib/stories-expansion.ts:219-251`) | Same citation; "would not hand a chatbot to a four-year-old"; "built for ages three and up" | NEEDS SKM (G5) |
| 39 | "A toy that talks is not a toy that listens" (`stories-expansion.ts:307-340`) | Same citation; checklist "for a child under five" | NEEDS SKM (G5) |

**Recommendation:** keep citing the advice (removing it would look like hiding it, and answer engines
already have it), and give SKM one signed answer to reuse everywhere: why Kheelu's design differs from
the toys tested, and what a parent of a 3, 4 or 5 year old should do (for example, the positioning's
"with a grown-up nearby"). Customer-visible; SKM's call ([open questions](../open-questions.md) G5).

## 5. Journal articles about children under 3

| # | Article (live, in the sitemap) | Finding | Verdict | How |
|---|---|---|---|---|
| 40 | "Brain development toys for a two-year-old" (`/stories/brain-development-toys-for-a-2-year-old`; `src/lib/stories-expansion.ts:400-431`) | Written for parents of 2-year-olds. It carries an age note ("it is not the toy for a two-year-old today … Kheelu is there when your child turns 3"), but its last paragraph says "pre-orders are open" and the page ends on the standard pre-order finale (live fetch 2026-10-10) | **CHANGE** | Keep the URL (brief section 2). Remove the pre-order invitation from the body and lead the close with the age note; the page's next step should not be a purchase. SKM may prefer to retire the page to a 301; that is a URL decision ([../site/url-map.md](../site/url-map.md)). Both under-3 articles are [open questions](../open-questions.md) G5 |
| 41 | "Late talker? What helps a child find their words" (`/stories/talking-toys-and-late-talkers`; `stories-expansion.ts:374-399`) | Subject is "a quiet two-year-old". It positions Kheelu as adding turns for a late talker and closes "Pre-orders are open". Its age note says "not a treatment for speech delay" | **CHANGE / NEEDS SKM (G5)** | Two problems: under-3 audience, and a health-adjacent claim the positioning bans ("Speech delay, late talkers"; [claims.md](claims.md#4-retired-or-banned-wording)). Remove the Kheelu pitch and the pre-order close; keep the therapist advice. SKM decides whether the page stays |
| 42 | "Why the early years matter most" (slug `why-three-to-six-…`; `src/lib/stories.ts:48-73`) | "Somewhere between the second and fifth birthday, your child becomes a person." Describes development, then pitches Kheelu | OK at 3 to 7 | Describes children, not who the toy suits. Slug stays (URLs are kept) |
| 43 | "How much screen time is okay for a young child?" (slug `…-3-to-6-year-old`) | Quotes WHO (ages 2 to 4) and AAP (ages 2 to 5) | OK | Third-party guidance, sourced |
| 44 | "Raising a bilingual child in India" | "even two-year-olds adjust which language they use" (research statement) | OK | n/a |
| 45 | "Learning toys for a three-year-old" (`stories-expansion.ts:443-481`) | Inside the band. But "Between three and four a child's vocabulary roughly doubles" has no source, and the Romeo 2018 finding (children aged about 4.5 to 6.8) is presented as about three-year-olds | OK for age; CHANGE the two claims | Source or cut the vocabulary line; say the study was of 4 to 6 year olds ([claims.md](claims.md#8-brain-and-development-claims-with-their-anchors)) |
| 46 | "Does a three-year-old need an AI tutor?" | Inside the band | OK for age | "Tutor" wording is a messaging question ([../brand/voice.md](../brand/voice.md)) |
| 47 | Sleep guidance "children aged 3 to 6 need ten to thirteen hours" (`stories-expansion.ts:155-158`) | Sourced guidance, not our audience | OK | n/a |

## Summary

- **The band is decided:** 3 to 7, published everywhere ([open questions](../open-questions.md)
  section E).
- **CHANGE in the build:** every "3+" rendering (rows 1, 3-8, 10, 15-19, 28, 30); schema
  `suggestedMaxAge: 7` with its test (row 2); the store hint "nearly 3" (row 9); the growth arc that
  stops at 5 (row 13); "for years" in the family band (row 14); "toddlers" on `/safety` and `/team`
  (rows 23, 26); the sales close on the two-year-old and late-talker articles (rows 40, 41).
- **NEEDS SKM** ([open questions](../open-questions.md) G5 unless noted): the Common Sense Media
  answer (rows 17, 22, 29, 37-39); the "grown-up nearby" condition (row 34); speech recognition at 3
  (row 35); the under-3 articles (rows 40, 41); the toy's age grading, warnings and battery safety
  (rows 25, 31-33, F4); how a child's age is set (row 24: answered, a parent sets it in the app,
  [D036](../decisions/D036-launch-feature-claims.md)); the age-by-age activities for 3 to 7 (row 13: there is no advisor, [D038](../decisions/D038-trust-content-rulings.md), so
  only cited public sources).
- **Do not carry over:** the unsigned "Is an AI toy OK for a three-year-old?" answer (row 22).
