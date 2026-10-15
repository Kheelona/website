---
title: Status
type: status
updated: 2026-10-15
sources: [log.md, open-questions.md]
---

# Status (2026-10-16 03:10 IST)

**NOW: the selling update (D064, D065), in the quick-changes phase (D062): quick checks per batch, detailed QA and the
integrations once the founder calls the site final.** Summary to resume from: [project summary](engineering/project-summary.md).
Copy: [D2C plan v2](site/d2c-conversion-plan-2026-10-15.md) ([CMO review](qa/cmo-review-d2c-plan-v2-2026-10-15.md)).
**Wave q2a merged** (Q2.1 Kabir hero, films order, offer alignment; Q2.3 GSTIN and phone off; Q2.4 WhatsApp logo, footer
gaps; Q2.5 motion and the sticky laptop nav; Q2.6 the clip without burned words; Q2.8 the short price line): verify 6728
tests, build green; rows V49-V57. **The new cta values are registered** (`ffa029da`).
**Wave 2 (q2b) merged** (2026-10-15 19:10: Q2.9 Home end to end, Q2.10 the product page, Q2.11 `/safety`, Q2.12 every
other page's close and the footer's laptop rows; rows V58-V64; verify 6894 passed and 2 product-page parity tests red,
the build green). **Fix wave q2c merged** (verify 6917, build green; `5b245a26`): Q2.13 the offer cards, the product page,
the guide; Q2.14 the help line's words and tap target, the footer's parity rule, `/privacy` against G26. **Consistency review done** (`wf_78365aa5-dfe`: 16 serious findings, all confirmed;
rulings R1 Home's length accepted and guarded, R2 one CTA shape). **Fix wave q2d merged** (Q2.16 `1c615207`, Q2.15 `0f438089`). **D066** (the founder's
answers, 2026-10-16) **is being built as Q2.17** (`wf_c035e7f1-354`). **Next:** merge, verify and build, push `beta`,
check the deploy, report to the founder.
**Branch:** `reset/website-v2` (`0f438089`). **Beta (public, D060):** `beta` at `398c5ee` (wave 8c); betawebsite and
betastore.kheelona.com. **Production:** `main` `8c4718a`, untouched until Gate B. Beta QA (task 7.2) on hold.

**Overnight rulings, answered by the founder in D066:** the bubble after the hero on Home's phones (overturned); the
share text signed; one more button after the product compare table; only "See how Kheelu works" of three wordings;
Home's length kept; the pre-launch test line removed; G28's two lines added.

**Waiting on the founder:** F7 (what keeps working after the 6 months of Kheelona+, and its price; asked again before
Gate B); G18, G21, G32; for Aman G25, G31 and G33 (`/privacy` after G26); the Vercel toolbar off for the beta project;
sign V1-V64+ and the legal pages at Gate B; forward [For the advisor](brand/for-the-advisor.md) and
[For Aman](engineering/for-aman.md); Meta automatic events off (D056); F4 values before dispatch; the WhatsApp ₹ check.
**Deferred to the final pass (D062):** full Playwright re-based on the approved beta (cta.spec, parity), Lighthouse on
mains power, the CMO's built-page review, beta QA, tracking evidence, accessibility, store and payment sandbox,
production integrations, legal sign-off, the Gate B pack; the buy bar's small line wraps at 360 (Q2.8 notes).

**Founder decisions so far:** D010-D066 + R1-R10 (see [index](index.md)). Latest: **D066 the founder's answers on the built selling update**; **D065 the site sells (promise, ages,
button and price line; G26, G28, G29, G30)**; D064 quick batch 2 (landing page, motion); D063; D062 quick changes until
final; D061 the advisor's proposal; D060 beta public.

**Traps:** read legacy files at tag `archive/pre-reset-2026-10-10` (D008); never `git add -A`; push only
`git push origin reset/website-v2:refs/heads/beta` (with the http buffer flags, build-runbook §5); the beta deploy check
waits ≥ 5 min after Ready (§5); raw screenshots and captures stay local (D039); the advisor's files stay local.
**Due:** production still shows 20 Oct (held, D011); new orders mid-Nov (D023); schema 2026-11-15 (D037).
