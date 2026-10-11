---
title: Content boundary (internal vs external)
type: policy
updated: 2026-10-10
sources: [../decisions/D013-internal-vs-external-content.md, ../raw/brief/kickoff-brief.md]
---

# Content boundary: what the website may publish

The website is a **sales site for the ICP**: parents of 3-7 year olds in India, and family buying
for them, deciding whether to buy Kheelu (confirmed as the ONLY audience by the founder on 2026-10-10, R9: no corporate-gifting or preschool sections) ([D013](../decisions/D013-internal-vs-external-content.md)).
Everything published (pages, metadata, JSON-LD, `llms.txt`, `pricing.md`, emails, ad copy) is
**EXTERNAL**. Everything else in this wiki is **INTERNAL**: it shapes decisions and is never
published. Test for anything in doubt: *does a parent need this to decide, trust or buy?*

## EXTERNAL: may be published (and only if also verified)

| Category | Rule | Owner page |
|---|---|---|
| What Kheelu is and does | Verified facts only: modes, languages, connectivity, how a child uses it, what parents control | [facts](../product/facts.md) |
| Age | 3 to 7, everywhere; never imply suitability under 3 | [age review](../product/age-band-review.md) |
| Safety and privacy practice | Only documented, founder-confirmed practice (what it listens for, where voice goes, what is stored) | [claims](../product/claims.md) |
| Price, offer, delivery, returns, warranty, payment methods | Rendered from the checkout's own source; never hand-typed | [pricing](../product/pricing.md), [policies](../product/policies.md) |
| Seller, support and grievance details | Exactly as required and confirmed | [policies](../product/policies.md), [facts](../product/facts.md) |
| Claims and benefits | CONFIRMED claims only, with their wording rules (e.g. "conversation helps a young brain grow; Kheelu gives a child more of it") | [claims](../product/claims.md) |
| Proof | Real and consented only (consented parent films, real quotes with recorded consent); never fabricated, never AI-generated people presented as customers | [claims](../product/claims.md), [DS overview](../design-system/overview.md) |
| Public research | General statements anchored to a PUBLIC source and cited on the page (e.g. WHO or IAP screen-time guidance) | [claims](../product/claims.md) |
| Answers to parents' questions | FAQ and answer-first blocks built from the rows above | the page specs in `site/pages/` (Phase 3) |
| Company basics | Who makes it, where the team is, how to reach us | [facts](../product/facts.md) |

## INTERNAL: never published

| Category | Examples | Where it lives |
|---|---|---|
| Positioning and strategy | SKM's positioning document itself, positioning statements, pillars, the messaging hierarchy as a document, the 90-day plan | [positioning](../brand/positioning.md), [messaging](../brand/messaging.md) |
| Internal research figures | Survey percentages (e.g. "70% want it to help their child learn"), buyer demographics, "parents fear the screen more than AI" | [positioning](../brand/positioning.md), [audience](../brand/audience.md) |
| Personas and audience analysis | Personas, jobs to be done, triggers, objection lists (they shape copy; they are not copy) | [audience](../brand/audience.md) |
| Competitor intelligence | Competitor names, prices, reviews, the competitor review v9 | [positioning](../brand/positioning.md), `research/d2c-benchmarks.md` |
| Commercial internals | The live paid count, unit counts beyond "first 500", sales targets, margins, funnel and conversion data | [pricing](../product/pricing.md), `research/posthog-audit.md` |
| Analytics and SEO research | PostHog data, keyword volumes, benchmarks, QA reports | `research/`, `qa/` |
| Deliberations | Open questions, decisions, legal and claims debates, legacy records | [open questions](../open-questions.md), `decisions/`, `legacy/` |
| Investor and partner material | Pitch decks, fundraising, platform vision aimed at partners | not in this repo (D012) |

## Grey: decided case by case at Gate A

Content on today's site aimed at investors or partners rather than parents: the `/playos` platform
page, the recognition and partner logos, team-bio credentials (patents, Intel), and the future
product pipeline (Kheelu Speaker, AI books). Each stays only if it helps a parent trust or decide,
and gets a short, parent-facing framing. Otherwise it belongs on kheelona.ai
([open questions](../open-questions.md) G3, G8).

## How it is enforced

- Copywriter: every claim links to an EXTERNAL row on its owner page; anything else is a
  placeholder or is cut.
- CMO Reviewer and QA: check every page, its metadata and JSON-LD for internal leakage (survey
  figures, competitor names or prices, unit counts, analytics).
- Architect: the content model (`src/content/`) holds EXTERNAL items only.
