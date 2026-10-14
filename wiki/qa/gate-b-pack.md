---
title: "Gate B readiness pack (draft, kept current until Gate B)"
type: qa
updated: 2026-10-14
sources: [../engineering/tasks.md, ../engineering/architecture.md, deviations.md, ../open-questions.md, ../status.md, ../engineering/for-aman.md, ../decisions/D015-founder-signs-off-copy.md, ../decisions/D029-grievance-officer-legal-review.md]
---

# Gate B readiness pack (draft)

What the founder answers, signs or does before the rebuild replaces the live site. Task 7.3 in
[tasks](../engineering/tasks.md); the release steps are [architecture §15.5](../engineering/architecture.md#155-gate-b-release-to-production-and-rollback).
**Draft:** wave 8b (the live site's changes) is still being built; the QA evidence (beta previews, Lighthouse before
and after, tracking parity, the redirect matrix) is added after beta QA (task 7.2). Each item links to the page that
holds it.

## 1. Questions waiting on the founder

From [open questions](../open-questions.md) §G, each with how it is built until answered:

- **G18** one CSP host (`connect.facebook.net` for connections).
- **G21** the `/thanks` tab title while a payment is confirming (built "Your Kheelu pre-order · Kheelona").
- **G22 part 1** (a precondition, not a question): a reviewed map from the create-order error to per-reason words
  before any event tier is switched on again.
- **G26** the privacy-centre screenshot's "Delete all chats" button: crop it, or confirm it deletes from the servers.
- **G27** `/setup` fold 6's two deletion sentences: drop them.
- **G28** the daily talk-time limit and "WiFi off at rest": add them in the live team's words.
- **G29** "Tested before launch…" and "When it doesn't know something, it says so": confirm, or they come off.
- **G30** Kheelona+ never starts charging without the parent's own sign-up: confirm.
- **G32** where the providers work, in the four safety guides: add the `/privacy` sentence.
- **CMO C m7** a chargeback how-to line (a new legal line).

## 2. For Aman

One page to forward: [For Aman](../engineering/for-aman.md): the live site's security patch now (G25), the journal's
backend changes, five `/privacy` facts (G31), the model's doesn't-know rule (G29), the app's grievance link.

## 3. Lines to sign (D015)

Every line changed after Gate A is a row in [deviations](deviations.md), with why, who decided it and what the
founder sees: **V7-V37** (V4 and V35 retired). The founder's own decisions behind them: D054-D058. The groups:

- the founder's page facts and answers: V7-V16 (team, privacy, refund, shipping, terms, setup, product);
- wave 8's built-page fixes: V17-V25 (the films heading, the age-3 sentence, refund timing, tap areas, deep links,
  the in-app note);
- the live team's code check (D058): V26-V34, V36, V37 (Home, the product page, `/safety`, `/setup`, `/team`, the
  buyer's guide, `/privacy`, `/terms`, the store's small print, the footer, the safe-AI-toy guide), and the three
  guides with no mockup (their copy pages' "Changes after approval (task 8b.2a)" sections).
- Main-session parity rulings, for information: V1-V6.

Also from earlier waves (tasks 7.3): the related-guide ring (7.1d); CMO 5.18 M6 and M10 (the bilingual guide's
studies line); the bylines' owners reading their pages (P17); "May 2027" re-read against the Gazette (P23); Kashyap's
background line (team.md ruling 7); D055's sentence that a deleted conversation stays in Kheelu's memory and the
training data; four D058 changes applied for the founder's OK (privacy RT1's second sentence; `/safety`'s
"No web browsing."; the buyer's guide's check 4; `/terms` §10's order), each listed on its copy page; the journal's
derived read times on two guides with no mockup (the-gentle-way-off-the-phone 3 → 4 min, should-kids-use-ai 5 → 4 min,
[journal pipeline §4](../engineering/journal-pipeline.md#4-field-map-a-post-to-an-article-question-2)).

## 4. Founder prerequisites

- **Legal sign-off (D029)** of `/privacy`, `/terms`, `/refund` and `/shipping`: their `status: "draft"` stops a
  production build until signed.
- **F4 values** (D054 item 19): every spec row without one stays hidden; net quantity and the month and year of
  manufacture are needed before the first dispatch.
- **The setup light's colour** (V8) and **the C6 listing names**.
- **Supabase's region** stays Australia unless the founder moves it (D055 item 24; `/privacy` names it).
- **Beta QA access:** the Vercel bypass secret in `.env.local` as `VERCEL_AUTOMATION_BYPASS_SECRET` (task 7.2).
- **Meta automatic events off** in Events Manager (D056).
- **Founder to-dos** carried in [status](../status.md): WhatsApp calls (D032), provider contracts against the
  providers' keep-nothing line, GST/HSN, app fixes (D044), section D checks (C1, C2, C4, C11, C12, C15, C18).
- No test payment anywhere but the local sandbox (D051).

## 5. Before the merge to `main` (main session)

- Wave 8b: 8b.1, 8b.1b, 8b.1d, 8b.2a-8b.2e and 8b.3 merged (2026-10-14; `origin/main` at `8c4718a` merged in, so the Gate B
  merge is a fast-forward or a plain merge). Still to come: 8b.1c (the founder's answers to G26-G32), 8b.2f (the dry run
  with Aman); 8b.2g is after Gate B.
- Beta QA (task 7.2), with the bypass secret; Lighthouse before and after; tracking parity evidence.
- Lighthouse with the tags (lp-tags) on `/stories`: 87 and then 88 (median of 5) at the 8b close, against the 90 budget,
  measured on battery; the gap is the tags' main-thread time (240-410 ms of blocking; about 2 ms without them) and an LCP
  that lands at 2.6 s or 3.2 s by run. Re-measure on mains power; if still below 90, look at when the tags load on the
  hub. Every other page passes (local 94-98; with the tags, home 92 and the store 91 on 5 runs).
- `README.md` and `docs/store-go-live.md` rewritten for the new site (from task 6.3).
- Release steps 3-8 of [architecture §15.5](../engineering/architecture.md#155-gate-b-release-to-production-and-rollback):
  Gate B OK logged as a decision, the rollback tag pushed first, the merge, smoke tests, the sitemap resubmitted,
  monitoring for 7 days.
