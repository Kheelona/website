---
title: Index
type: index
updated: 2026-10-11
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
- [strategy](site/strategy.md): Phase 2: messaging hierarchy as the parent meets it, the journey and objections, the one CTA ("Pre-order Kheelu") with its placement and sticky bar, the URL plan (drop `/playos` and the under-3 article), each page's purpose and cluster, and the fix for each top PostHog issue.
- [Gate A progress](site/gate-a-progress.md): every page mockup's copy/build/review/fix status, the app screenshots' state, and the resume plan (start here when resuming).
- [Gate A open items](site/gate-a-open-items.md): the founder's 2026-10-11 answers and every remaining website item on a logged working default (founder may override), plus founder to-dos and the stale-page backlog.
- [home copy](site/pages/home.md): Phase 3 homepage copy, nine folds phone-first, H1 options A-E, the D028 price sentence, sources per claim, open questions for Gate A.

## Design system (documents the DS in `design-system/`; never a copy)
- [overview](design-system/overview.md): what DS v11 contains and the rules a page builder follows.
- [component map](design-system/component-map.md): all 47 components, their props and the site sections they serve.
- [tokens](design-system/tokens.md): token families and naming, how to consume them, a Tailwind v4 bridge sketch.
- [motion](design-system/motion.md): the DS motion rules and what they do not cover.
- [gaps](design-system/gaps.md): DS gap register (G-01 to G-16).
- [manifest](design-system/manifest.md): SHA-256 of all 643 DS files; verify with `node scripts/ds-checksums.mjs`.

## Engineering
- [lessons](engineering/lessons.md): hard-won behaviour of this stack (Next 16, Vercel, store host, payments, tracking verification, SEO, QA, git).
- [phase 4 kickoff](engineering/phase-4-kickoff.md): what the Architect starts from after Gate A: the approved sources, hard constraints, the seven architecture decisions to make, and what carries into Phase 5.
- [artifacts](engineering/artifacts.md): every published Artifact (the Gate A mockup link), updated in place; check before publishing.
- Architecture, structure, catalogues and dependency register: from Phase 4.

## Research and QA (INTERNAL, D013)
- [PostHog audit](research/posthog-audit.md): 2026-09-19 to 10-10, verified by an independent re-run; funnel, device split (76% phone), top 10 issues by revenue impact, baseline for Phase 8, QA device list.
- [D2C benchmarks](research/d2c-benchmarks.md): 19 sites phone first, pattern library, adopt/adapt/avoid tied to positioning and PostHog; per-site notes in `raw/research/benchmarks/`.
- [keyword map](research/keyword-map.md): intent clusters with sourced volumes (Keyword Planner and GSC exports pending, C11), one primary cluster per URL, question bank, placement rules, GEO plan.
- [QA baseline](qa/baseline-2026-10-10.md): Lighthouse medians on production (mobile and desktop), CWV, links, metadata, JSON-LD, axe, phone first-screen checks: what the new site must beat.
- [rulings check](qa/rulings-check-2026-10-11.md): verification that D016-D029 reached every owner page; the queued fixes.
- [CMO review 2026-10-11](qa/cmo-review-2026-10-11.md): homepage copy against the positioning: ready after two fixes (F1 caring-adult implication, F2 voice heading vs D035); H1 pick A; should-fix S1-S12.
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
- [D030](decisions/D030-questions-scoped-to-the-website.md) questions to the founder are limited to what the website draft needs; operational matters are not asked (founder).
- [D031](decisions/D031-posthog-settings-and-replays.md) PostHog settings: conversion goal, revenue in INR, bots in the test filter, store URL authorised; paid-ad replays expire (founder, C13).
- [D032](decisions/D032-grievance-block-and-call-line.md) grievance block: acknowledge in 48 hours, resolve in one month; +91 91875 46483 takes calls (founder, L2).
- [D033](decisions/D033-warranty-after-day-7.md) a defect after day 7: repair, else replace; pickup free (founder, L5/F1).
- [D034](decisions/D034-origin-manufacturer-mrp.md) made in India; manufacturer Kheelona Robotics Pvt Ltd; MRP ₹7,999 (founder, F3/L4).
- [D035](decisions/D035-model-training-opt-out.md) Kheelona's own model trains on voice and transcripts by default, parents can opt out; disclosed on terms and privacy only; DPDP risk recorded (founder, F16).
- [D036](decisions/D036-launch-feature-claims.md) eight features confirmed for launch; the parent sets the child's age in the app (founder, F8).
- [D037](decisions/D037-delivery-date-in-schema.md) Product JSON-LD `availabilityStarts` 2026-11-15 (founder, F15).
- [D038](decisions/D038-trust-content-rulings.md) trust content: proof-gated recognition and bios, no advisor, no demo, tagline kept with alternatives, no pilot promise, Kheelona+ after 6 months undecided, no-ads line kept.
- [D039](decisions/D039-repo-and-setup-answers.md) raw files stay local; repo website set; Kheelona India unrelated; no Google Ads; no linked assets; security defaults; no YouTube yet.
- [D040](decisions/D040-films-move-to-new-site.md) the seven parent films move to the new site; film 6 caption (AI mode); film 1 label kept; subtitles as they are; proof line instead of an endorsement disclosure (risk recorded).
- [D041](decisions/D041-gate-a-round-1.md) Gate A round 1: Pre-order Kheelu, price (d), white on Chilli (exception), motion, URLs, crawlers, training clause kept, Kheelona+ unspecified, more children, box contents, friend allowed; new headline options; Gate A not yet approved.
- [D047](decisions/D047-vercel-build-and-data-regions.md) Vercel build command not overridden (keep off); Supabase ap-southeast-2 until moved before launch; toy server and memory on GCP India.
- [D046](decisions/D046-gate-a-approved.md) **Gate A approved** for the full page set, with final Home changes (store caption, equal phone sizes, Myra, guides fold); next Phase 4.
- [D045](decisions/D045-hero-headline.md) Home hero: "Kheelu answers every why. Then it asks one back." (Hand on "asks one back."); picker removed.
- [D044](decisions/D044-app-screens-on-the-site.md) real parent-app screens on the site: usage time confirmed, no games, 36-month retention (app to match), no 'seen only by you' banner, no AI summary, memory line, clean Hindi title; no Harvard logo.
- [D043](decisions/D043-all-pages-as-mockups-before-build.md) every page gets a lightweight mockup; the founder reviews the full set; approval opens the build (Gate A widened); articles: template + 3; legal: full drafts; store mocked; one link with an index.
- [D042](decisions/D042-policy-display-answers.md) no consent banner at launch (gate before May 2027), no exchanges, no payment fees, refunds start within 2 working days.

## Agents
- [roster](agents/roster.md): the eight-role team, their outputs and skills, and the run history.

## Legacy
- [memory summary](legacy/memory-summary.md): every legacy memory source, sorted into still true (with its new owner page), obsolete, needs a decision.
- [settled decisions](legacy/settled-decisions.md): about 75 founder decisions with dates, marked BINDS / OVERRIDDEN / MOOT.
- [laws summary](legacy/laws-summary.md): every old §8 law family classified still true, obsolete, or superseded by the brief.
- [clean-up](legacy/cleanup.md): what was deleted, kept or left for the founder, with evidence; the archive tags.
- [clean-up: public assets](legacy/cleanup-public-assets.md): every file in `public/` with its references and verdict.
