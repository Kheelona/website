---
title: Index
type: index
updated: 2026-10-14
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
- [for the advisor](brand/for-the-advisor.md): the facts and rules to write Kheelona copy from, for the marketing advisor (D061); the facts the October draft had out of date.
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
- [D2C conversion plan](site/d2c-conversion-plan-2026-10-15.md): the site planned to sell (v2 on D064, D065): the CTA system, every page's sections and exact copy, the first phone screens measured; built as the selling update.
- [home copy](site/pages/home.md): Phase 3 homepage copy, nine folds phone-first, H1 options A-E, the D028 price sentence, sources per claim, open questions for Gate A.
- Page copy, one page per route in `site/pages/`: the 15 site pages (for example [product](site/pages/meet-kheelu.md), [store](site/pages/store.md), [stories hub](site/pages/stories.md)) and one `story-<slug>.md` per journal article (21); the 18 rewrites were written and CMO-approved in wave 5 part C (2026-10-14), each with its sources and questions for the founder at the foot.

## Design system (documents the DS in `design-system/`; never a copy)
- [overview](design-system/overview.md): what DS v11 contains and the rules a page builder follows.
- [component map](design-system/component-map.md): all 47 components, their props and the site sections they serve.
- [tokens](design-system/tokens.md): token families and naming, how to consume them, a Tailwind v4 bridge sketch.
- [motion](design-system/motion.md): the DS motion rules and what they do not cover.
- [gaps](design-system/gaps.md): DS gap register (G-01 to G-20).
- [manifest](design-system/manifest.md): SHA-256 of all 643 DS files; verify with `node scripts/ds-checksums.mjs`.

## Engineering
- [lessons](engineering/lessons.md): hard-won behaviour of this stack (Next 16, Vercel, store host, payments, tracking verification, SEO, QA, git).
- [phase 4 kickoff](engineering/phase-4-kickoff.md): what the Architect starts from after Gate A: the approved sources, hard constraints, the seven architecture decisions to make, and what carries into Phase 5.
- [artifacts](engineering/artifacts.md): every published Artifact (the Gate A mockup link), updated in place; check before publishing.
- [project summary](engineering/project-summary.md): where the rebuild stands on 2026-10-15 (built, decided, quality, waiting on), and how the quick-changes phase runs (D062). Start here to resume.
- [architecture](engineering/architecture.md): the Phase 4 plan (2026-10-12): visual layer, components, content model, offer, tracking, SEO, media, motion (D049), performance, environments and beta (D048), release, rollback, checkout boundary.
- [build runbook](engineering/build-runbook.md): **read first when resuming the build**: the `build-wave` workflow, merge and wave close, resume after a break, wave progress.
- [tasks](engineering/tasks.md): the build in ten dependency waves with owners, owned files, acceptance criteria and the guard-test ownership table.
- [structure](engineering/structure.md): folders, naming, the mockup-to-route map, path-scoped rules (now in `.claude/rules/`).
- [mockup CSS mapping](engineering/mockup-css-mapping.md): every off-token value in the approved mockup CSS (189 detector rows) mapped to a DS token, `ks-type-*` class, exact `calc()` or one of ten named exceptions; rules for builders porting mockup CSS; legal CSS is two families; same-name collisions to scope.
- [components](engineering/components.md): component catalogue (check before creating anything).
- [assets](engineering/assets.md): asset catalogue (images, films, icons, doodles, fonts) and their pipelines.
- [dependencies](engineering/dependencies.md): dependency register: kept, added, retired.
- ADRs: [001 keep the stack](engineering/adr/ADR-001-keep-the-stack.md) · [002 visual layer](engineering/adr/ADR-002-visual-layer-ds-css.md) · [003 server-rendered ports](engineering/adr/ADR-003-server-rendered-ds-ports.md) · [004 content model](engineering/adr/ADR-004-content-model.md) · [005 offer follows live mode](engineering/adr/ADR-005-offer-follows-live-mode.md) · [006 tracking](engineering/adr/ADR-006-tracking-module-and-registry.md) · [007 motion](engineering/adr/ADR-007-motion-css-first.md) · [008 environments and beta](engineering/adr/ADR-008-environments-and-beta.md) · [009 region and Supabase](engineering/adr/ADR-009-region-and-supabase-move.md) · [010 media](engineering/adr/ADR-010-media-pipeline.md) · [011 guardrails](engineering/adr/ADR-011-guardrails-and-qa-harness.md) · [012 SEO and URLs](engineering/adr/ADR-012-seo-urls-and-schema.md) · [013 checkout boundary](engineering/adr/ADR-013-checkout-restyle-boundary.md). · [014 journal from the dashboard](engineering/adr/ADR-014-journal-from-the-dashboard.md)

## Research and QA (INTERNAL, D013)
- [PostHog audit](research/posthog-audit.md): 2026-09-19 to 10-10, verified by an independent re-run; funnel, device split (76% phone), top 10 issues by revenue impact, baseline for Phase 8, QA device list.
- [advisor's homepage proposal review](research/advisor-homepage-proposal-review.md): the advisor's 37 recommendations (2026-10-12) reviewed by six specialists, decided by the CMO, challenged twice; what wave 8c builds (D061).
- [D2C benchmarks](research/d2c-benchmarks.md): 19 sites phone first, pattern library, adopt/adapt/avoid tied to positioning and PostHog; per-site notes in `raw/research/benchmarks/`.
- [keyword map](research/keyword-map.md): intent clusters with sourced volumes (Keyword Planner and GSC exports pending, C11), one primary cluster per URL, question bank, placement rules, GEO plan.
- [QA baseline](qa/baseline-2026-10-10.md): Lighthouse medians on production (mobile and desktop), CWV, links, metadata, JSON-LD, axe, phone first-screen checks: what the new site must beat.
- [rulings check](qa/rulings-check-2026-10-11.md): verification that D016-D029 reached every owner page; the queued fixes.
- [CMO review 2026-10-11](qa/cmo-review-2026-10-11.md): homepage copy against the positioning: ready after two fixes (F1 caring-adult implication, F2 voice heading vs D035); H1 pick A; should-fix S1-S12.
- [architecture review 2026-10-12](qa/architecture-review-2026-10-12.md): QA on the Phase 4 plan: blocking B1-B4 (motion picks, guard ownership, checkout JSX freeze, beta isolation), all folded into the final tasks.
- CMO reviews of the article copy, wave 5 part C (2026-10-14): [screen time, 5.17](qa/cmo-review-articles-5.17-2026-10-14.md) · [talking and language, 5.18](qa/cmo-review-articles-5.18-2026-10-14.md) · [AI, safety and learning, 5.19](qa/cmo-review-articles-5.19-2026-10-14.md): all approved; minor fixes queued as task 5.20.
- CMO reviews of the Gate A mockups and copy fixes (2026-10-11 to 10-14): [/team, /setup, /contact, 404](qa/cmo-review-pages-help-2026-10-11.md) · [legal review of /refund and /shipping](qa/legal-review-pages-legal-b-2026-10-11.md) (pass with fixes) · article fix passes [5.20a](qa/cmo-review-article-fixes-5.20a-2026-10-14.md) · [5.20b](qa/cmo-review-article-fixes-5.20b-2026-10-14.md) · [5.20c](qa/cmo-review-article-fixes-5.20c-2026-10-14.md) · [/team, 6.6](qa/cmo-review-team-6.6-2026-10-14.md) · [page facts, 6.7](qa/cmo-review-page-facts-6.7-2026-10-14.md).
- Phase 6 round 1 (task 7.1, wave 8, 2026-10-14): [results](qa/results-2026-10-14.md) (local build and tracking probe: no S1 or S2; parity rows pass; redirects 256/256) · [defects](qa/defects.md) (QA-001 to QA-005: all fixed or ruled by the wave 8 fix batch) · CMO built-page reviews [A, marketing pages](qa/cmo-review-built-a-2026-10-14.md) · [B, the journal](qa/cmo-review-built-b-2026-10-14.md) · [C, store and legal](qa/cmo-review-built-c-2026-10-14.md) (4 blocking, all fixed) · the fix batch's copy reviews: [7.1b copy fixes](qa/cmo-review-copy-fixes-7.1b-2026-10-14.md) · [7.1c store fixes](qa/cmo-review-store-fixes-7.1c-2026-10-14.md) · [7.1d related-guide ring, rounds 1 and 2](qa/cmo-review-related-ring-7.1d-2026-10-14.md) (all approved).
- [journal pipeline](engineering/journal-pipeline.md): task 8b.2's design (ADR-014): the dashboard's posts as a committed snapshot, the adapter to the rebuild's `Article`, images, VideoEmbed, guards, the migration of the 20 guides, the merge with `main`, tasks 8b.2a-g, the backend changes for Aman (§13).
- [For Aman](engineering/for-aman.md): one page the founder forwards to the CTO: patch the live site's packages now (G25), the journal's backend changes (§13), five `/privacy` facts (G31), the model's doesn't-know rule (G29), the app's grievance link, and what happens after Gate B.
- [live-site reconciliation map, 2026-10-14](qa/live-main-reconciliation-2026-10-14.md): what `main` changed since the branch point (#18 app privacy/terms, #19 claims withdrawn after a code check, #20-#22 the dashboard journal), mapped line by line against the rebuild; the merge conflicts; the founder's items (G24).
- [CMO review: the D2C plan v2, 2026-10-15](qa/cmo-review-d2c-plan-v2-2026-10-15.md): close; five fixes (the first phone screen measured, the hero link, the safety label, the offer lead, the Kheelona+ FAQ) applied in the plan.
- [CMO review: wave 8c as built on beta, 2026-10-15](qa/cmo-review-wave-8c-2026-10-15.md): passed, 12 minor; m1 Home's hydration error on Vercel (task 8c.7), m2-m11 the product page (task 8c.8), m9 a founder question, m12 the Vercel toolbar.
- [CMO review: the advisor's homepage proposal, 2026-10-15](qa/cmo-review-advisor-proposal-2026-10-15.md): AP-01..AP-37 decided (0 adopted as written, 7 adapted, 12 already, 15 rejected, 3 for the founder), the copy for each adapted item, the plan.
- [CMO review: claims and the parent app, task 8b.1, 2026-10-14](qa/cmo-review-claims-8b.1-2026-10-14.md): the twelve copy pages after D058, two rounds, passed; its open items are G26-G31 in [open questions](open-questions.md)
- [CMO review: the four safety guides after D058, task 8b.2a, 2026-10-14](qa/cmo-review-guides-d058-8b.2a-2026-10-14.md): the safe-AI-toy, should-kids, hard-questions and data-law guides in the code-checked words; passed; G32 from it
- [CMO review: the four blocks the visual pass hides whole, wave 8b close, 2026-10-14](qa/cmo-review-hidden-blocks-8b-2026-10-14.md): the product page's words column, `/safety`'s parent controls, `/privacy` §7, `/terms` `#account` at 360, 390 and 1440; passed; m1-m3 on `/safety` fold 4 fixed at once
- [Gate B readiness pack (draft)](qa/gate-b-pack.md): what the founder answers, signs or does before the rebuild goes live: open questions G18-G32, For Aman, the lines to sign (V7-V37), the prerequisites (legal sign-off, F4 values, the bypass secret), and the main session's steps before the merge.
- [test plan](qa/test-plan.md): Phase 6 verification: viewports, suites, tracking parity evidence, the Razorpay test-mode payment on betastore.
- [deviations](qa/deviations.md): approved departures from the Gate A mockups (V1 store payments line in the page, V2 films strip with motion on, V3 product details without JavaScript, V4 retired, V5 /thanks paid state proved by its story, V6 the P15 FAQ sentence, V7 /team, V8 /setup step 2, V9 the 3-6-9-12 guide and the topic line, V10-V16 the founder's page facts, V17-V22 the wave 8 copy fixes, V23 help lines and tap areas, V24 deep links, V25 the in-app note); parity treats anything else over tolerance as a defect.
- [source verification](research/source-verification.md): 45 public claims checked against ORIGINAL sources and re-checked (D026): 1 supported as is, 38 only reworded, 4 not supported, 2 unverifiable; 26 ready footnoted site lines. Excerpts in `raw/research/sources/`.
- [source verification, 2026-10-14](research/source-verification-2026-10-14.md): task 5.20 step 1: Tisseron's 2020 AI markers (including "no connected toys before 6", P25) and daily minutes; the CDC sentence item at 4 years; the 30-month items against Zubler 2022. All SUPPORTED, with ready lines.

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
- [D050](decisions/D050-whatsapp-chat-button.md) persistent WhatsApp chat bubble on every page: bottom right, lifts above the phone buy bar, WhatsApp green (approved DS exception), pre-filled text per context, cta whatsapp-float.
- [D051](decisions/D051-beta-without-store-integrations.md) the beta runs without Supabase, Razorpay or email; the code refuses store keys there; no PostHog filter; store form reviewed from local screenshots.
- [D052](decisions/D052-qa-checkpoints.md) QA at checkpoints: targeted checks per task, review depth by risk (high, normal, mechanical), the full unit suite once per batch merge, the full browser suite at milestones M1-M3, deep QA in waves 8-9
- [D053](decisions/D053-remove-the-3-6-9-12-article.md) remove the 3-6-9-12 article from the journal: its author's AI markers advise no connected toys before 6 (P25); 20 articles; the old URL redirects to the hub's screen-time topic (task 6.5)
- [D054](decisions/D054-founder-answers-open-questions-2026-10-14.md) the founder answers every open build question (F4, F11-F13, P1-P24, the CSP, the B11 privacy words, `/ideabaaz`, the Gate A defaults made final); tasks 6.4 and 6.6
- [D055](decisions/D055-page-facts-legal-setup-product-2026-10-14.md) the founder fills the facts the legal, setup and product pages waited on (privacy, refund, shipping, terms, setup, app links); lines without a confirmed fact come off; task 6.7
- [D056](decisions/D056-founder-answers-built-page-reviews-2026-10-14.md) the founder answers the built-page reviews: delete limit left as is, "Real families", the in-app note on, refund "reaches you", the Karnataka emblem and the Kheelona+ line kept, Meta automatic events off (founder);
- [D057](decisions/D057-journal-from-dashboard-and-three-wordings-2026-10-14.md) the journal comes from the admin dashboard (the rebuild renders its posts); the films heading "Real children, real families." under "Seven films"; `/terms` takes the one age-3 sentence; a refused event link "This link is incomplete, or not one of ours."
- [D058](decisions/D058-follow-the-live-code-check-2026-10-14.md) the site follows the live team's code check of 12 Oct (no one-tap delete, no closed library, no topics or quiet hours, no new-word count, a couple of minutes of quiet, processors named); Bluetooth and the languages stay; the app is free, Kheelona+ paid on top; 36 months then deleted; Aman stays the grievance officer.
- [D065](decisions/D065-selling-site-founder-answers-2026-10-15.md) the site sells: the direct promise within D016, ages 3 to 7, "Pre-order Kheelu" with a short price line (GST only at checkout), first 500 on offer cards only; G26, G28, G29, G30 answered.
- [D064](decisions/D064-quick-batch-2-landing-page-and-motion-2026-10-15.md) quick batch 2: a shorter landing page (safety on /safety, the languages before a sticky-scroll "What is Kheelu?", the expert clip on Home without burned-in words), the Kabir hero on Home, three motion patterns site-wide.
- [D063](decisions/D063-quick-batch-1-choices-2026-10-15.md) quick batch 1: the hero photo (Advik studio hug), the phone number only on /contact and the legal pages, the GSTIN off the site, the year-by-year section adapted to the claims rules.
- [D062](decisions/D062-quick-visual-changes-until-final-2026-10-15.md) quick visual changes from here on, batch by batch; detailed QA and integrations once the website is final (D052 paused until then).
- [D061](decisions/D061-advisor-proposal-what-we-take-2026-10-15.md) the advisor's proposal: Kheelu on the first phone screen (Home, product), ads stay on Home, the later price as a plain line on the offer cards, parents' own words from the films; what else we take and don't.
- [D060](decisions/D060-beta-open-to-the-public-2026-10-14.md) the beta links open to the public: the founder turns off Vercel Authentication; noindex, no payment, kheelona.com unchanged until Gate B.
- [D059](decisions/D059-journal-voice-uploads-and-timing-2026-10-14.md) the dashboard's voice check follows the DS (contractions allowed); a DS photo first, uploads as fallback with consent checked; the dashboard takes over after Gate B.
- [D049](decisions/D049-motion-picks.md) motion picks: reveals fade-and-rise, hero still, doodles draw themselves, buy bar slides up, menu from the side, button arrow nudge, FAQ smooth open, films focus grows.
- [D048](decisions/D048-beta-deployment.md) beta at betawebsite/betastore.kheelona.com from a pushed `beta` branch; Razorpay test mode; Meta/GA4 off on beta, PostHog tagged beta; approval there = Gate B.
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
