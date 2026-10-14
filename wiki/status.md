---
title: Status
type: status
updated: 2026-10-14
sources: [log.md, open-questions.md]
---

# Status (2026-10-14)

**Phase:** **5, build, wave 8 of 10 closed** (Phase 6 QA round 1 and its fixes done) (Gate A approved D046; Phase 4 plan done 2026-10-12). The
founder asked for the full website with animation on **betawebsite.kheelona.com** and
**betastore.kheelona.com** before it goes live (D048). Plan: [tasks](engineering/tasks.md) (10 waves),
[architecture](engineering/architecture.md), [QA review](qa/architecture-review-2026-10-12.md), [test plan](qa/test-plan.md).
After the build: Phase 6 QA, push `beta`, founder runbook (architecture §15.4), **Gate B** on beta, merge to `main`.
**Account:** apoorva@kheelona.com (since 00:00 2026-10-14). **Branch:** `reset/website-v2`, not pushed.
**RESUME FROM [build runbook](engineering/build-runbook.md) §4.** **Waves 1-4 closed** (verify 4570 tests; e2e red only on
`/stories/*` until wave 5, ruled). **Wave 5 closed at M1** (2026-10-14: full `verify:e2e` ruled; V7, V8; JS budget re-based on Lighthouse 92-98 mobile; see log). **Wave 6 closed at M2** (2026-10-14: batches `cb55153` and 6b; verify 5983 tests; `verify:e2e` 1485 passed after one flaky test made robust; Lighthouse ≥ 90 on every page, see log). **Wave 7 merged** (2026-10-14, `4a05b92`). **Wave 8 closed** (2026-10-14: round 1, D056, fix batch 7.1a-f merged, reconciliation `ec3991a`; verify 5467 tests; Playwright 1609 passed + stand-in 453; `qa:payment` clean on the sandbox; Lighthouse ≥ 92 on every page). **Wave 8b running** (D057, D058: the live `main` moved, PRs #18-#22): **8b.1 merged** (`24ea2e4`: claims and the parent app on the pages; V26-V36; verify 5512 tests; new questions G26-G31; follow-ups 8b.1b); 8b.2 the journal from the dashboard (designed: ADR-014, D059; **wave i merged**: 8b.2a guides, 8b.2b sync, 8b.2c video; **wave ii merged** (`9908c4c`: 8b.2d the adapter, 8b.1b the follow-ups; verify 6015 tests; targeted Playwright 459 + 61 passed); **wave iii merged** (8b.2e the journal now reads the snapshot, the 20 modules gone; 8b.1d the claim guard narrowed; verify 6038 tests); **8b.3 merged** (`dae33e6`: `origin/main` at `8c4718a` merged keeping the rebuild's tree). **8b close checkpoint passed** (full Playwright 1613, stand-in 453, `qa:payment` clean, Lighthouse local 94-98, CMO hidden-blocks review passed and its m1-m3 fixed; lp-tags `/stories` 88, to re-measure). **`beta` pushed `d79299d`, `f2491b0`: Vercel failed both** (the founder's build log: on Vercel, Next writes prerendered pages under `.next/server/route-cache`, and postbuild steps 10 and 20 read only `.next/server/app`); **fixed** (`scripts/prerendered.mjs`, both layouts; verify 6048; lessons §1): **`beta` `99afe51` deployed** (CI green). **Wave 9 (7.2): `beta` pushed** (2026-10-14, `82b9444`, then **`ac68650`** with 8b.1 and 8b.2 wave i: full Playwright 1609 passed, stand-in 453, `qa:payment` clean; CI green; Vercel deployed; both hosts behind Vercel login); **beta is public (D060)**; **beta QA ON HOLD** (founder, 2026-10-15; workflow `wf_9d6aaf76-174` stopped, resumable), no bypass secret needed. **Advisor's homepage proposal** (2026-10-12, shared 2026-10-15): under review (workflow `wf_13c2e74f-ae8`: six reviews, the CMO's decisions, two challengers); then founder questions, plan, build. **G25:** the live `main` has a critical Next.js hole (Aman to patch now).
**Incident 2026-10-12:** a push meant for `beta` landed on `main` (`24e92e3`, vercel.json only; production
healthy; [lessons](engineering/lessons.md)). `beta` exists on GitHub (builds nothing yet); **beta domains attached to branch `beta`** (founder, done).
**Done before wave 1:** dev tools pinned (Playwright 1.63.0, axe 4.12.1, Lighthouse 13.4.1, jscpd 5.3.2,
subset-font 2.9.0); **security patch next 16.3.4 → 16.3.8, sharp → 0.35.5** (npm audit: next's own critical
next/og RCE, high image SSRF, ISR cache poisoning; floors raised in test/dependency-floor.test.ts).
**Motion (D049):** 1A 2A 3B 4A 5A 6B 7B 8B. **WhatsApp bubble (D050):** `#25D366` (G-20). **Beta (D048, D051):**
no Supabase, Razorpay or email (the code refuses store keys there, task 2.10); Meta, GA4, Ahrefs off; PostHog
env=beta; noindex. Founder's only step (the two domains, architecture §15.4) is done.

**Waiting on the founder:** all build questions answered (D054, D055, 2026-10-14); G16-G17 answered (D056); open: G18 (one CSP host), G21 (a `/thanks` tab title), **G26-G30, G32 (8b.1, 8b.2a: the privacy screenshot, `/setup` fold 6, talk-time and WiFi lines, the pre-launch test, Kheelona+ charging, the providers' place in four guides)**; for Aman: **G31** (five `/privacy` facts); to-do: the app's grievance link to aman@ (D058); pass journal-pipeline §13 (backend changes B1-B5 and five questions) to Aman; to-do: Meta automatic events off in Events Manager (D056). Still to come: F4 spec values before
Gate B (rows without one come off the page), the setup light's colour, the C6 listing names; to-dos: WhatsApp calls (D032), provider contracts vs the Home safety line,
GST/HSN, app fixes (D044), section D checks (C1, C2, C4, C11, C12, C15, C18); the beta QA bypass secret (task 7.2).

**Founder decisions so far:** D010-D060 + R1-R10 (see index). Latest: **D060 the beta links open to the public** (founder turns off Vercel Authentication; then beta QA without the bypass secret); **D059 the journal's voice rule, uploads, timing**; D058 follow the live code check; D057 the journal from the dashboard and three wordings; D056 answers to the built-page reviews (wave 8); D055 page facts (task 6.7); D054 every open build question answered (tasks 6.4, 6.6); D053 remove the 3-6-9-12 article (task 6.5); D052 QA at checkpoints; D051 beta without store integrations;
D050 WhatsApp bubble; D049 motion picks; D048 beta hosts.

**Traps:** read legacy files at tag `archive/pre-reset-2026-10-10` (D008); never `git add -A`;
the DS deny rule stays anchored (D005); ~101 MB of raw screenshots/Lighthouse files stay
local and UNcommitted (founder, D039).
**Due:** production still shows 20 Oct (held, D011); new orders mid-Nov (D023); schema 2026-11-15 (D037).
