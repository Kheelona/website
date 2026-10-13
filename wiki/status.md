---
title: Status
type: status
updated: 2026-10-12
sources: [log.md, open-questions.md]
---

# Status (2026-10-12)

**Phase:** **5, build, wave 5 of 10 running** (Gate A approved D046; Phase 4 plan done 2026-10-12). The
founder asked for the full website with animation on **betawebsite.kheelona.com** and
**betastore.kheelona.com** before it goes live (D048). Plan: [tasks](engineering/tasks.md) (10 waves),
[architecture](engineering/architecture.md), [QA review](qa/architecture-review-2026-10-12.md), [test plan](qa/test-plan.md).
After the build: Phase 6 QA, push `beta`, founder runbook (architecture §15.4), **Gate B** on beta, merge to `main`.
**Account:** apoorva@geekyants.work (since 13:00 2026-10-13). **Branch:** `reset/website-v2`, not pushed.
**RESUME FROM [build runbook](engineering/build-runbook.md) §4.** **Waves 1 and 2 closed** (wave 2 at 22:30: twelve tasks
merged, verify 3581 tests, `next build` green; rulings `610f141`). **Waves 3 and 4 closed** (templates, stories route, legal
template, machine files; verify 4570 tests; e2e red only on `/stories/*` until wave 5, ruled). **Wave 5 part A merged** (Home, product,
safety, hub, 3 articles, 404). Part B1 merged (shared fixes, guide, team, setup,
contact); privacy finishing. **Part B2 running** (`wf_97020885-57b`: terms, refund, shipping, store page, /thanks); then the 18 articles.
**Incident 2026-10-12:** a push meant for `beta` landed on `main` (`24e92e3`, vercel.json only; production
healthy; [lessons](engineering/lessons.md)). `beta` exists on GitHub (builds nothing yet); **beta domains attached to branch `beta`** (founder, done).
**Done before wave 1:** dev tools pinned (Playwright 1.63.0, axe 4.12.1, Lighthouse 13.4.1, jscpd 5.3.2,
subset-font 2.9.0); **security patch next 16.3.4 → 16.3.8, sharp → 0.35.5** (npm audit: next's own critical
next/og RCE, high image SSRF, ISR cache poisoning; floors raised in test/dependency-floor.test.ts).
**Motion (D049):** 1A 2A 3B 4A 5A 6B 7B 8B. **WhatsApp bubble (D050):** `#25D366` (G-20). **Beta (D048, D051):**
no Supabase, Razorpay or email (the code refuses store keys there, task 2.10); Meta, GA4, Ahrefs off; PostHog
env=beta; noindex. Founder's only step (the two domains, architecture §15.4) is done.

**Waiting on the founder:** Phase 4 questions P1-P13 ([open questions §P](open-questions.md); defaults apply);
to-dos: WhatsApp calls (D032),
F11 proof, C17 Supabase region, provider contracts vs the Home safety line, F4 specs, GST/HSN, section D
checks (C1, C2, C4, C8, C11, C12, C15, C18). Working defaults may be overridden (gate-a-open-items §2-3).

**Founder decisions so far:** D010-D052 + R1-R10 (see index). Latest: **D052 QA at checkpoints** (from wave 5 part B); D051 beta without store integrations;
D050 WhatsApp bubble; D049 motion picks; D048 beta hosts.

**Traps:** read legacy files at tag `archive/pre-reset-2026-10-10` (D008); never `git add -A`;
the DS deny rule stays anchored (D005); ~101 MB of raw screenshots/Lighthouse files stay
local and UNcommitted (founder, D039).
**Due:** production still shows 20 Oct (held, D011); new orders mid-Nov (D023); schema 2026-11-15 (D037).
