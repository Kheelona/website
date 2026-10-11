---
title: Index
type: index
updated: 2026-10-10
sources: [raw/brief/kickoff-brief.md]
---

# Kheelona.com wiki: index

Every page, with one line on what it holds. Read [status](status.md) first, then this, then the
pages a task needs. Phase 0 pages cite legacy files at tag `archive/pre-reset-2026-10-10`
([D008](decisions/D008-citation-convention.md)).

## Start here
- [status](status.md): phase, last step, next step, blockers, what waits on the founder.
- [open questions](open-questions.md): everything waiting on the founder or SKM. A = answer now, B = facts to supply, C = Gate A decisions, D = founder-side checks, E = decided by the brief.
- [log](log.md): append-only history (`grep "^## \[" wiki/log.md | tail -20`).

## Raw sources (immutable)
- [kickoff brief](raw/brief/kickoff-brief.md): the founder's CTO brief, the standing source of truth; later instructions are logged in decisions.
- `raw/positioning/`: SKM's positioning (PDF and docx), October 2026.
- `raw/legacy-memory/auto-memory/`: the 16 project auto-memory files, byte-identical, archived 2026-10-10.
- `raw/posthog/`, `raw/research/`, `raw/feedback/`: filled from Phase 1 on.

## Brand
- [positioning](brand/positioning.md): SKM's positioning summarised, with the 3-7 correction and a table of where it bites.
- [messaging](brand/messaging.md): messaging hierarchy, taglines, hero, proof points (verified vs needs source), objection answers; owns the CTA-label candidates.
- [voice](brand/voice.md): voice rules from the positioning, agreements and conflicts with the DS writing and selling guides.
- [audience](brand/audience.md): parents of 3-7 year olds in India, personas, needs, objections, triggers.

## Product
- [facts](product/facts.md): every verified product fact with its source, marked Live / Mid / Both; owns support channel and Kheelona+ terms.
- [claims](product/claims.md): the claims register: confirmed, unconfirmed, retired or banned wording (with live locations), placeholders, certifications, children's data.
- [age-band review](product/age-band-review.md): 47 age statements and age-dependent claims checked against 3-7 and the under-3 rule.
- [pricing](product/pricing.md): the single price source, how the token/full mode is decided, every surface that renders price text, the sell-out sweep.
- [legal requirements](product/legal-requirements.md): what Indian law requires the site (and product) to publish: 65 verified rows, 2 blockers (BIS/ISI; 48-hour grievance acknowledgement); a check against the law's text, not legal advice. INTERNAL.
- [policies](product/policies.md): refund, returns, warranty, shipping, payment methods, seller, grievance officer, origin, MRP: status per item against the E-Commerce Rules.

## Site
- [url map](site/url-map.md): every indexable URL, store-host URL, machine route and redirect, with live status and hop counts; ad landing URLs.
- [tracking inventory](site/tracking-inventory.md): every tracking, ads and verification integration, its IDs, events, parameters, dedup and consent, plus the parity checklist. Blocks launch.
- [content boundary](site/content-boundary.md): what the website may publish (EXTERNAL, for the ICP) vs what stays INTERNAL; the rule every page and agent follows.
- [checkout](site/checkout.md): the journey from CTA tap to receipt, what must not change, and the brief's funnel mapped onto it (there is no cart).
- `site/pages/`: page copy, from Phase 3.

## Design system (documents the DS in `design-system/`; never a copy)
- [overview](design-system/overview.md): what DS v11 contains and the rules a page builder follows.
- [component map](design-system/component-map.md): all 47 components, their props and the site sections they serve.
- [tokens](design-system/tokens.md): token families and naming, how to consume them, a Tailwind v4 bridge sketch.
- [motion](design-system/motion.md): the DS motion rules and what they do not cover.
- [gaps](design-system/gaps.md): DS gap register (G-01 to G-16).
- [manifest](design-system/manifest.md): SHA-256 of all 643 DS files; verify with `node scripts/ds-checksums.mjs`.

## Engineering
- [lessons](engineering/lessons.md): hard-won behaviour of this stack (Next 16, Vercel, store host, payments, tracking verification, SEO, QA, git).
- Architecture, structure, catalogues and dependency register: from Phase 4.

## Research and QA (INTERNAL, D013)
- [PostHog audit](research/posthog-audit.md): 2026-09-19 to 10-10, verified by an independent re-run; funnel, device split (76% phone), top 10 issues by revenue impact, baseline for Phase 8, QA device list.
- [D2C benchmarks](research/d2c-benchmarks.md): 19 sites phone first, pattern library, adopt/adapt/avoid tied to positioning and PostHog; per-site notes in `raw/research/benchmarks/`.
- [keyword map](research/keyword-map.md): intent clusters with sourced volumes (Keyword Planner and GSC exports pending, C11), one primary cluster per URL, question bank, placement rules, GEO plan.
- [QA baseline](qa/baseline-2026-10-10.md): Lighthouse medians on production (mobile and desktop), CWV, links, metadata, JSON-LD, axe, phone first-screen checks: what the new site must beat.
- [rulings check](qa/rulings-check-2026-10-11.md): verification that D016-D029 reached every owner page; the queued fixes.
- [source verification](research/source-verification.md): 45 public claims checked against ORIGINAL sources and re-checked (D026): 1 supported as is, 38 only reworded, 4 not supported, 2 unverifiable; 26 ready footnoted site lines. Excerpts in `raw/research/sources/`.

## Decisions
- [D001](decisions/D001-branch-and-archive.md) branch from production; archive production and the mid version as tags.
- [D002](decisions/D002-mid-version-identified.md) the mid version is PR #16.
- [D003](decisions/D003-inputs-moved-not-copied.md) inputs moved, not copied, into `wiki/raw` and `design-system/`.
- [D004](decisions/D004-internal-material-uncommitted.md) `wiki/` and `design-system/` held out of git pending Q1 (superseded by D010).
- [D005](decisions/D005-ds-integrity-tooling.md) DS integrity: checksum script, manifest, anchored deny rule.
- [D006](decisions/D006-cleanup-executed.md) Phase 0 clean-up executed: 423 files, 238 MB.
- [D007](decisions/D007-claude-md-keeps-pixel-id.md) the new CLAUDE.md names the live pixel id to keep the doc-versus-code guard.
- [D008](decisions/D008-citation-convention.md) Phase 0 pages cite legacy files at the archive tag.
- [D009](decisions/D009-brief-readings.md) four questions the brief already answers (age 3-7, testimonials, "You deploy", positioning vs rulings).
- [D010](decisions/D010-wiki-and-ds-committed-publicly.md) `wiki/` and `design-system/` are committed to the public repo (founder; supersedes D004).
- [D011](decisions/D011-production-held-until-gate-b.md) production held until Gate B; reviews happen locally (founder).
- [D012](decisions/D012-founder-answers-q2-q4-q5.md) PR #16 closed, remote branches deleted, pitch deck removed, caches deleted (founder).
- [D013](decisions/D013-internal-vs-external-content.md) the website publishes only external, buyer-facing content; research stays internal (founder; closes Q4).
- [D014](decisions/D014-branch-pushed-no-previews.md) the reset branch is pushed as a backup; Vercel builds are off for `reset/*` (founder).
- [D015](decisions/D015-founder-signs-off-copy.md) only the founder signs off copy; SKM's documents are input (founder).
- [D016](decisions/D016-brain-wording.md) brain wording: the promise is about conversation; "brain development" only as a search topic (founder, R7).
- [D017](decisions/D017-live-behaviour-claims-confirmed.md) live, founder-approved behaviour claims are confirmed (founder, R1).
- [D018](decisions/D018-wake-up-button.md) no wake word: the mic is on only after a press of the wake-up button; wording rules and draft lines (founder).
- [D019](decisions/D019-voice-providers.md) voice is processed by multiple outside providers; "only our own servers" retired (founder, R3).
- [D020](decisions/D020-provider-terms-and-no-sale.md) providers process voice only to reply, keep nothing, never train, by contract; we don't sell data (founder).
- [D021](decisions/D021-returns-policy.md) 7-day returns, no questions asked; opened is fine if undamaged and complete (founder).
- [D022](decisions/D022-warranty-replacement-refund.md) 6-month warranty on defects; replace if faulty within 7 days of receipt; pickup arranged; refund in 7 working days (founder).
- [D023](decisions/D023-new-order-delivery.md) new orders: same ₹499 advance, deliveries start mid-November 2026 (founder).
- [D024](decisions/D024-payment-methods-gst.md) UPI, cards, net banking; prices include GST; GST invoice with every order (founder).
- [D025](decisions/D025-speech-and-language.md) speech and language: public sources only; disclaimer on Terms and Meet Kheelu, not Home (founder, R4).
- [D026](decisions/D026-public-statistics.md) public statistics usable after independent source verification, each with a linked source marker (founder, R6).
- [D027](decisions/D027-story-mode-wording.md) Story mode = stories, poems and jingles; no "lessons"; no interrupt-and-ask feature (founder, R8).
- [D028](decisions/D028-price-wording.md) price wording: ₹499 first next to the CTA with the ₹4,999 total in the same sentence; machine outputs lead with ₹4,999 (founder, R10).
- [D029](decisions/D029-grievance-officer-legal-review.md) grievance officer Aman Soni; legal pages approved by the founder after an independent review against Indian law.

## Agents
- [roster](agents/roster.md): the eight-role team, their outputs and skills, and the run history.

## Legacy
- [memory summary](legacy/memory-summary.md): every legacy memory source, sorted into still true (with its new owner page), obsolete, needs a decision.
- [settled decisions](legacy/settled-decisions.md): about 75 founder decisions with dates, marked BINDS / OVERRIDDEN / MOOT.
- [laws summary](legacy/laws-summary.md): every old §8 law family classified still true, obsolete, or superseded by the brief.
- [clean-up](legacy/cleanup.md): what was deleted, kept or left for the founder, with evidence; the archive tags.
- [clean-up: public assets](legacy/cleanup-public-assets.md): every file in `public/` with its references and verdict.
