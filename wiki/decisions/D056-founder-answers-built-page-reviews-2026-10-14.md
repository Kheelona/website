---
title: "D056: The founder answers the questions from the built-page reviews (task 7.1)"
type: decision
updated: 2026-10-14
sources: ["founder's answers in the build session, 2026-10-14, to two rounds of questions after the task 7.1 reviews", ../qa/cmo-review-built-a-2026-10-14.md, ../qa/cmo-review-built-b-2026-10-14.md, ../qa/cmo-review-built-c-2026-10-14.md, ../qa/results-2026-10-14.md, ../qa/defects.md, ../site/pages/privacy.md, ../site/pages/team.md, ../site/pages/meet-kheelu.md, ../open-questions.md, D046-gate-a-approved.md, D054-founder-answers-open-questions-2026-10-14.md, D055-page-facts-legal-setup-product-2026-10-14.md]
---

# D056: The founder answers the questions from the built-page reviews

## Context

Task 7.1 (wave 8) ran the QA checks on the local production build and three CMO reviews of every built page on
2026-10-14. The reviews raised eight questions only the founder could answer. The main session asked them in two
rounds; each answer below is the founder's, with the option they picked.

## Choices

1. **The delete limit (privacy.md questions 6 and 7; CMO group C B2).** **Leave as is.** `/privacy` section 9 alone
   states that a deleted conversation is not removed from Kheelu's memory or the training data (D055 item 17); the
   short version, the shared retention line (`policies.ts` `RETENTION_LINE`, printed on Home, the product page,
   `/safety` and four guides) and `/terms` §10 keep their approved words. Offered and declined: the limit line
   everywhere, or on `/privacy` only.
2. **The product films heading (CMO group A B2).** "Seven families, in their own homes." becomes **"Real families, in
   their own homes."** (no count: seven films, but Arha appears in two and two show parents).
3. **The in-app browser note (B12, N7; deviation V4).** **Switch it on now**, on the PostHog audit's evidence (the #2
   revenue leak), without the real-device check that D051 and D054 item 6 rule out.
4. **Refund timing wording (G17; CMO 6.7 M7).** `/terms` and the FAQ (Home, the product page, `llms.txt`) say the
   refund **"reaches you within 7 working days"**, as `/refund` does (D055 item 5).
5. **The Karnataka mark on `/team` (G16).** **Keep the emblem**, as the live site shows it (D054 item 20); the
   founder's call on permission.
6. **The Kheelona+ line on the product page (CMO group A M3).** **Keep it** ("The parent app is part of Kheelona+,
   included for 6 months…"): the product page is where a parent checks what the price includes and for how long.
7. **An "examples" note on the app screenshots (CMO group A M7).** **As built**: only `/setup`'s caption has one.
8. **Meta's automatic events (QA C18 note).** The founder **turns off** automatic events and automatic advanced
   matching in Meta Events Manager (a dashboard setting, not code), restoring the setting the tracking inventory
   records ("Off"). Founder's to-do; no code change.

## Why

The founder's own answers, given on request.

## What it changes in the build

The task 7.1 fix batch (tasks.md "Wave 8 fixes"): items 2, 3 and 4 are built; items 1, 5, 6 and 7 close their
questions with no change; item 8 joins the founder's to-dos (status.md). V4 is retired when the note ships.

**Approved by.** Founder. **Date.** 2026-10-14.
