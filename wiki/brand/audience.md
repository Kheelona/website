---
title: Audience (parents of 3–7 year olds in India)
type: brand
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - wiki/raw/brief/kickoff-brief.md (sections 1, 2, 6, 9.10)
  - wiki/raw/positioning/Kheelona Positioning Strategy.docx
  - wiki/raw/positioning/Kheelona Positioning (1).pdf
  - design-system/project/05-asset-playbook.md, 03-cast.md, 06-surfaces.md (read-only)
  - tag archive/pre-reset-2026-10-10 (= 77552ff, production): src/lib/stories-expansion.ts
  - "Site markers (2026-10-10): wiki/decisions/D013-internal-vs-external-content.md, wiki/site/content-boundary.md"
  - "Founder's rulings applied 2026-10-11: R9 (wiki/open-questions.md section F, answered 2026-10-10: parents of 3-7 year olds and family buyers only), wiki/decisions/D021-returns-policy.md, D025-speech-and-language.md, D026-public-statistics.md, D028-price-wording.md"
---

# Audience

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

> **INTERNAL page** ([D013](../decisions/D013-internal-vs-external-content.md)): it shapes what the site says and how; nothing here is published as is. What may be published: [content boundary](../site/content-boundary.md).

Citation key: [positioning.md](positioning.md#the-two-source-documents). **[3–7]** marks where the brief's
age correction changes the docs ([positioning.md](positioning.md#the-age-correction)).

**Who the site is for (founder, 2026-10-10, [R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time) = a).** The website speaks only to **parents of 3-7
year olds in India, and family buying for them**. Nothing else: **corporate gifting (HR) and preschools
are out of scope**, so the site has no section, message or page for either. The rule is applied on
[content boundary](../site/content-boundary.md) and follows from
[D013](../decisions/D013-internal-vs-external-content.md). Fathers are parents, and grandparents or
relatives buying for the child are family, so both are in scope. A preschool teacher, an influencer in
the docs, is not an audience the site addresses.

## At a glance

Site: **INTERNAL** (demographics, targeting and the brief's device estimate). The age band itself is
EXTERNAL and owned by [age-band-review.md](../product/age-band-review.md).

| | | Source |
|---|---|---|
| Who buys | Parents of children aged **3 to 7** (the docs say 4 to 7; the brief overrides) **[3–7]** | brief §2 L25; docx §1 L15 |
| Market | India; English (`en-IN`); prices in ₹ | brief §2 L26 |
| First buyers | The first 500: urban parents, mostly mothers, who already spend time and money on their child's development and want a better use of screen minutes. **Start in Bengaluru** | docx §6 L160; pdf p.7 |
| Devices | About 70% of visits on phones, 30% on laptops. This is the brief's figure ("we believe"), to be measured by the PostHog Analyst in `research/posthog-audit.md` (pending, Phase 1). The positioning docs say nothing about devices | brief §1 L17; §6 L178 |
| Not for (yet) | Children under 3; children 8 and over; families seeking help with a diagnosed speech or developmental condition ("Kheelu is not a therapy device, and we never market it as one"). Site, for the disclaimer: **EXTERNAL** on Terms and Meet Kheelu (`/products/kheelu`) only, **not on Home** ([D025](../decisions/D025-speech-and-language.md); the draft line is on [messaging.md](messaging.md#confirmed-candidate-lines)) | docx §6 L180; pdf p.7 |
| Not for the site at all | Corporate HR gifting; preschools and other institutions; investors and press | [R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time) (2026-10-10); [D013](../decisions/D013-internal-vs-external-content.md) |

On "not for": the 3 floor matches the site's "ages 3+" and must stay visible; nothing may suggest the toy
suits under-3s (brief §3 L58). The live journal already says "It is a toy that takes turns, not a treatment
for speech delay" (`src/lib/stories-expansion.ts:377`); journal articles about speech delay keep a
one-line disclaimer inside the article ([D025](../decisions/D025-speech-and-language.md)).

## Roles

Source: docx §6 L161–175.

Site: **INTERNAL** (buyer demographics and what each role must believe; they shape copy, they are not copy).
The site does not speak to corporate HR or preschools at all ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time), [above](#audience)); their lead
messages are INTERNAL on [messaging.md](messaging.md#messages-by-audience).

| Role | Who | What they need to believe |
|---|---|---|
| **Buyer** | Mother, 28 to 40, English plus a home language, already buys books, puzzles or enrichment classes | "This builds my child's thinking, and I'll be able to see it." |
| **User** | Child, ~~4~~ **3** to 7, in the "why?" years **[3–7]** | "It's fun, and it wants to hear what I think." |
| **Influencer** | Father, grandparents, preschool teacher | "It's serious about learning, and it's safe." |
| **Gift buyer** | Relatives, corporate HR (Diwali, Christmas). **Site: family only; corporate HR is out of scope ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time))** | "A gift that's good for the child's mind, not another gadget." |

## Personas

Site: **INTERNAL** (personas are never published, [content boundary](../site/content-boundary.md)).

The docs define audiences by role and message rather than as named personas. Their lead message and proof
for each are on [messaging.md](messaging.md#messages-by-audience) (docx §9 L277–298).

| Persona | Described as | Main concern the docs attach to them |
|---|---|---|
| The intentional mother (main buyer) | Above; urban, Bengaluru first | Doing "something real" for the brain in these years, without pressure (docx §6 L177) |
| The father | Influencer | Seeing progress: "week by week" (docx §9 L285) |
| Grandparents | Influencer and gift buyer | The home language (docx §9 L288) |
| Preschool teacher | Influencer; not an audience the site addresses ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) | "Serious about learning, and safe" (docx §6 L172) |
| Gift buyers and corporate HR | Relatives; companies at Diwali and Christmas. Corporate HR: out of scope for the site ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) | "Not another gadget" (docx §6 L175; §11 L396–397) |
| Preschools | An institutional audience. Out of scope for the site ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) | "No screen in class" (docx §9 L294) |

Investors and press are an audience in the docx (§9 L296–298) but not a website audience.

## Jobs Kheelu is hired for

Source: docx §6 L176–179; pdf p.7.

Site: **INTERNAL** (jobs to be done shape copy; the quoted parent voices are SKM's, not real parents).

1. **Grow my child's mind in the years that matter most.** "I keep hearing these years build the brain. I
   want to do something real about it, without pushing a 5-year-old into classes."
2. **Make my child think, not just watch.** "My child asks a hundred questions, then sits in front of
   cartoons. I want those questions answered and turned into more thinking." Preschoolers ask about 76
   information-seeking questions an hour (Chouinard 2007, cited in Lazaroff & Vlach 2022). Site, for the
   figure: **EXTERNAL IF CONFIRMED** (pending source verification, [D026](../decisions/D026-public-statistics.md): checked against Chouinard 2007
   itself, not the citing paper, and published only with a linked source marker;
   [positioning.md](positioning.md#the-evidence-as-skm-rates-it)).
3. **The 20-minute swap.** "When I'm cooking or on a call, give my child something good for their brain
   instead of the phone." SKM: "This is the everyday use, and the reason it gets used on Day 90."
   (As copy, "good for their brain" credits time with Kheelu, which [D016](../decisions/D016-brain-wording.md)'s rule rewords to the
   conversation form: [messaging.md](messaging.md#messages-by-audience).)

## Needs

Site: **INTERNAL** (audience analysis; each need is answered on the site only by an EXTERNAL fact or claim).

As the docs describe them:
- Support for the child's growing brain **without more screens** (docx §1 L7).
- Something they can **see working**: progress, compared only with their own child's past (docx §6 L166;
  §7 L196).
- **Safety they can check**: "Trust is the ceiling of the category, so safety has to be visible and
  specific" (docx §2 L32).
- **No pressure** on a young child; not a class or a tutor (docx §2 L43; §6 L177).
- **Their own language** at home (docx §1 L7; §9 L288).
- Something that **lasts past the first week**: "Design for Day 90, not Day 1, and never cloud-brick the
  toy" (docx §2 L33).
- To stay **the parent**: Kheelu hands the conversation back to family (docx §7 L225).

## Objections

Site: **INTERNAL** as a list (the questions copy must answer, not copy). Each answer's site status is on
[messaging.md](messaging.md#objection-answers).

The answers SKM wrote, and what blocks each, are on [messaging.md](messaging.md#objection-answers).

| Objection | Where the docs raise it |
|---|---|
| "Won't AI make my child think less?" / "Will AI make my child lazy?" ("will come up often now") | docx §9 L299, L302; §12 L417 |
| "Does it really help the brain?" (brain claims carry baggage from "midbrain activation") | docx §9 L304; §3 L88 |
| "Is it safe?" | docx §9 L306; §2 L32 |
| "Will my child get attached?" (the AI-companion backlash) | docx §9 L308; §3 L87 |
| "What happens to my child's voice and data?" | docx §9 L310 |
| "Will my child use it after a week?" | docx §9 L312; §2 L33 |
| "Does it speak our language?" | docx §9 L314 |
| "Will it break?" | docx §9 L316 |
| "Why ₹4,999?" (next to ₹99–₹429 puzzles) | docx §9 L318; §3 L70 |
| Another screen (parents "fear the screen more than AI": **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md))) | docx §2 L31 |

**[3–7] Objections the docs do not cover, now that 3-year-olds are core:** "Is it right for my 3-year-old?";
"Will it understand a 3-year-old?" (SKM notes "speech recognition is weaker under 4", docx §2 L40, with no
source); "Does a 3-year-old need me there?" (the docs' "with a grown-up nearby", docx §2 L39). These need
product facts before they can be answered: [open questions](../open-questions.md) G5.

## Buying triggers

Site: **INTERNAL** (triggers and channels from the 90-day plan; the advisor and the ₹499 token are
candidates marked on [messaging.md](messaging.md#proof-points), #24 and #26).

As the docs describe them. Several are channels in the 90-day plan; the website has to match them as a
landing page (brief §9.4), for its one audience only ([R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)): the school, preschool and corporate rows
below are offline channels or out of scope, never website sections.

| Trigger | Cite |
|---|---|
| Schools and preschools repeating "the early years build the brain" (NEP 2020) | docx §3 L67; §6 L177 |
| The daily moment: cooking or on a call, and the phone is the default | docx §6 L179 |
| The "why" years: a child full of questions, then cartoons | docx §6 L178 |
| Seeing a child think: ads open on "a child pausing, then answering 'because…'"; pilot videos | docx §11 L385, L388–389 |
| Hearing it in their language: a 20-second clip sent on WhatsApp | docx §9 L315 |
| Bengaluru demos; apartment and school Story Hours run as "Thinking Hours" | docx §11 L379, L390–391 |
| A named child-development advisor, in ads and on the website (none yet: F9) | docx §11 L386–387 |
| Gifting: Diwali, Christmas, corporate gifting (site: family gifting only; corporate gifting is out of scope, [R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time)) | docx §6 L174; §11 L396–397 |
| The low-risk start: "₹499 reserves it, refundable until we ship" (as copy, only in [D028](../decisions/D028-price-wording.md)'s form, with the ₹4,999 total in the same sentence) | docx §9 L319 |
| Instagram "Why question of the week" with an advisor tip | docx §11 L392–393 |

**Added by the founder (not in the docs):** the 7-day, no-questions-asked return exists so parents can
buy without risk, which makes it a line beside the CTA as well as a policy ([D021](../decisions/D021-returns-policy.md); the line is on
[messaging.md](messaging.md#confirmed-candidate-lines)).

## What the docs say about the market's parents

Site: **INTERNAL** as a section. The research-brief figures and the unsourced rows never go on the site;
the two public statistics (NEP 2020, AIIMS Raipur) are **EXTERNAL IF CONFIRMED** (pending source
verification, [D026](../decisions/D026-public-statistics.md)): usable as SKM framed them only if the independent check against the original
source (`research/source-verification.md`, not yet written) supports them, each with a linked source
marker on the page ([content boundary](../site/content-boundary.md), "Public research"). Both are
fear-based figures; the founder allows them over the DS no-fear rule, paired with what a parent can do (D026).

| Fact | Source given | Status and Site |
|---|---|---|
| 70% want an AI toy to help their child learn; 19% want a companion; 56% reject companionship | Kheelona research brief, 30 May 2026 (docx §2 L29; §3 L68) | **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md)) ([list](messaging.md#internal-research-figures)); sample size unknown |
| Indian parents fear the screen more than AI | Same research brief (docx §2 L31) | **INTERNAL** (research: shapes strategy, never on the site; [D013](../decisions/D013-internal-vs-external-content.md)) |
| Over 85% of a child's brain develops by age 6; foundational years 3 to 8 | NEP 2020 via EducationWorld (docx §3 L67) | Cited, not re-checked. **EXTERNAL IF CONFIRMED** (pending source verification, [D026](../decisions/D026-public-statistics.md): the NEP 2020 text itself, not EducationWorld, [claims.md §8](../product/claims.md#8-brain-and-development-claims-with-their-anchors)), with a linked source marker |
| Under-5s average about 2.2 hours of screen time a day | AIIMS Raipur meta-analysis via Pune Pulse, Jan 2026 (docx §3 L69) | Cited, not re-checked. **EXTERNAL IF CONFIRMED** (pending source verification, [D026](../decisions/D026-public-statistics.md): the study itself, not the news report), with a linked source marker. **[3–7]** the sample includes under-3s; use as a screen-time fact only |
| Buyer is a mother aged 28 to 40 | No source given (docx §6 L165) | Unsourced. **INTERNAL** (a buyer demographic) |
| "The pilot children are younger" than 7–8 | No data given (docx §2 L40) | Unsourced. **INTERNAL** (pilot data) |

## Compared with the design system's audience

Site: **INTERNAL** (audience analysis from two internal sources).

`design-system/project/05-asset-playbook.md` L50–54 also describes "who we sell to". Audience is the
positioning's call (brief §3 L52), so where they differ, the positioning wins, except where the founder
has ruled: [R9](../open-questions.md#f-content-rulings-from-the-d013-classification-pass-ask-one-at-a-time) limits the site to parents and family buyers, so on gift buyers the site follows the
DS's family-only list, not the positioning's corporate HR.

| | Positioning | Design system |
|---|---|---|
| Primary buyer | Mostly mothers, 28–40, English plus a home language, start in Bengaluru (docx §6 L160, L165) | "The intentional parent", 28–40, eight named metros, upper-middle-class, often two working parents (L52) |
| What they worry about | The brain years, screens, AI doing the thinking, attachment, data (docx §3; §9) | Screen time, school readiness, the home language fading, AI safety (L52) |
| What persuades them | Brain development through conversation; seeing the growth; safety as the foundation (docx §8) | "Safety proof, real children, and the parent app" (L52) |
| Gift buyers | Relatives and corporate HR; "good for the child's mind, not another gadget" (docx §6 L174–175) | Grandparents, aunts, uncles, relatives abroad; "joy, home languages and simplicity" (L53) |
| Also named | Father, preschool teacher (influencers); preschools | The existing owner (L54) |

**Imagery notes (visual, so the DS governs; flagged for the design-system agent):**
- The DS cast is five fictional children aged 3½ to 6 (`03-cast.md` L9–17). **[3–7]** No 7-year-old.
- Myra, 3½, is the cast's "age-3 messaging" child (`03-cast.md` L21–27). SKM's rule "never show [3-year-olds]
  alone in ads" (docx §2 L39) would limit how her photos are used, if the rule survives the 3–7 override
  ([open questions](../open-questions.md) G5).
- The DS also says the website is "mobile first: most Indian parents arrive on a phone" (`06-surfaces.md` L9),
  which agrees with the brief.
