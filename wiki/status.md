---
title: Status
type: status
updated: 2026-10-15
sources: [log.md, open-questions.md]
---

# Status (2026-10-15 15:50 IST)

**NOW: the selling update (D064, D065), in the quick-changes phase (D062): quick checks per batch, detailed QA and the
integrations once the founder calls the site final.** Summary to resume from: [project summary](engineering/project-summary.md).
Copy: [D2C plan v2](site/d2c-conversion-plan-2026-10-15.md) ([CMO review](qa/cmo-review-d2c-plan-v2-2026-10-15.md)).
**Wave q2a merged** (Q2.1 Kabir hero, films order, offer alignment; Q2.3 GSTIN and phone off; Q2.4 WhatsApp logo, footer
gaps; Q2.5 motion and the sticky laptop nav; Q2.6 the clip without burned words; Q2.8 the short price line): verify 6728
tests, build green; rows V49-V57. **The new cta values are registered** (`ffa029da`).
**Wave 2 running** (`wf_20668add-448`, base `ffa029da`): Q2.9 Home end to end (high), Q2.10 the product page, Q2.11
`/safety`, Q2.12 every other page's close and the footer's laptop rows. **Next:** merge them, verify and build,
screenshots at 360/390/412/1440 for consistency, push `beta`, check the deploy, report to the founder.
**Branch:** `reset/website-v2` (`721b2e5c`). **Beta (public, D060):** `beta` at `398c5ee` (wave 8c); betawebsite and
betastore.kheelona.com. **Production:** `main` `8c4718a`, untouched until Gate B. Beta QA (task 7.2) on hold.

**Rulings taken while the founder sleeps (to report):** the WhatsApp bubble stays persistent on Home's first phone screen
(D050; plan §13 item 7 is the founder's), with the hero photo cropped clear of it; the share text stays as D061 item 7
until the founder signs plan §1.7 (§13 item 9); §13 items 1-6 and 8 as recommended; the product page's statutory
"Consumer care" row keeps the phone.

**Waiting on the founder:** sign plan §1.7 (share text) and §13 item 7 (bubble); F7 (what keeps working after 6 months of
Kheelona+, and its price); G28's other half (Wi-Fi at rest, per-conversation limit) and G29's pre-launch test before
Gate B; G18, G21, G27, G32; the Vercel toolbar off for the beta project; sign V1-V57 and the legal pages at Gate B;
forward [For the advisor](brand/for-the-advisor.md) and [For Aman](engineering/for-aman.md) (G25 patch, G31, the
journal's backend changes); Meta automatic events off (D056); F4 values before dispatch; the WhatsApp ₹ check.
**Deferred to the final pass (D062):** full Playwright re-based on the approved beta (cta.spec, parity), Lighthouse on
mains power, the CMO's built-page review, beta QA, tracking evidence, accessibility, store and payment sandbox,
production integrations, legal sign-off, the Gate B pack; the buy bar's small line wraps at 360 (Q2.8 notes).

**Founder decisions so far:** D010-D065 + R1-R10 (see [index](index.md)). Latest: **D065 the site sells (promise, ages,
button and price line; G26, G28, G29, G30)**; D064 quick batch 2 (landing page, motion); D063; D062 quick changes until
final; D061 the advisor's proposal; D060 beta public.

**Traps:** read legacy files at tag `archive/pre-reset-2026-10-10` (D008); never `git add -A`; push only
`git push origin reset/website-v2:refs/heads/beta` (with the http buffer flags, build-runbook §5); the beta deploy check
waits ≥ 5 min after Ready (§5); raw screenshots and captures stay local (D039); the advisor's files stay local.
**Due:** production still shows 20 Oct (held, D011); new orders mid-Nov (D023); schema 2026-11-15 (D037).
