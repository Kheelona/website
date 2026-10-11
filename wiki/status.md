---
title: Status
type: status
updated: 2026-10-11
sources: [log.md, open-questions.md]
---

# Status (2026-10-12)

**Phase:** **5, build, wave 1 of 10 nearly done** (Gate A approved D046; Phase 4 plan done 2026-10-12). The
founder asked for the full website with animation on **betawebsite.kheelona.com** and
**betastore.kheelona.com** before it goes live (D048). Plan: [tasks](engineering/tasks.md) (10 waves),
[architecture](engineering/architecture.md), [QA review](qa/architecture-review-2026-10-12.md), [test plan](qa/test-plan.md).
After the build: Phase 6 QA, push `beta`, founder runbook (architecture §15.4), **Gate B** on beta, merge to `main`.
**Account:** switching again (founder, ~16:00 2026-10-12). **Branch:** `reset/website-v2`, not pushed.
**RESUME FROM [build runbook](engineering/build-runbook.md) §4 "Wave 1 snapshot"**: 1.3, 1.4, 1.5, 1.5b, 1.6 passed;
1.1 still building in its worktree (uncommitted files); 1.2 needs one re-review; then merge, wave close, wave 2.
**Incident 2026-10-12:** a push meant for `beta` landed on `main` (`24e92e3`, vercel.json only; production
healthy; [lessons](engineering/lessons.md)). `beta` exists on GitHub (builds nothing yet); **beta domains attached to branch `beta`** (founder, done).
**Done before wave 1:** dev tools pinned (Playwright 1.63.0, axe 4.12.1, Lighthouse 13.4.1, jscpd 5.3.2,
subset-font 2.9.0); **security patch next 16.3.4 → 16.3.8, sharp → 0.35.5** (npm audit: next's own critical
next/og RCE, high image SSRF, ISR cache poisoning; floors raised in test/dependency-floor.test.ts).
**Motion (D049):** 1A 2A 3B 4A 5A 6B 7B 8B. **WhatsApp bubble (D050):** `#25D366` (G-20).
**Beta rules (D048, D051):** no Supabase, Razorpay or email on beta (the code refuses store keys there,
task 2.10); Meta, GA4, Ahrefs off; PostHog env=beta; noindex. Founder's only step: the two domains
(Cloudflare CNAMEs + Vercel, runbook architecture §15.4).

**Waiting on the founder:** Phase 4 questions P1-P11 ([open questions §P](open-questions.md); defaults apply);
to-dos: WhatsApp calls (D032),
F11 proof, C17 Supabase region, provider contracts vs the Home safety line, F4 specs, GST/HSN, section D
checks (C1, C2, C4, C8, C11, C12, C15, C18). Working defaults may be overridden (gate-a-open-items §2-3).

**Founder decisions so far:** D010-D051 + R1-R10 (see index). Latest: films move over; white on Chilli
accepted; Kheelona+ after 6 months unspecified; training clause kept; "friend" allowed; no consent banner
at launch; no exchanges; no fees.

**Traps:** read legacy files at tag `archive/pre-reset-2026-10-10` (D008); never `git add -A`;
the DS deny rule stays anchored (D005); ~101 MB of raw screenshots/Lighthouse files stay
local and UNcommitted (founder, D039).
**Due:** production still shows 20 Oct (held, D011); new orders mid-Nov (D023); schema 2026-11-15 (D037).
