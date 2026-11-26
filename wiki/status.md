---
title: Status
type: status
updated: 2026-11-26
sources: [log.md, open-questions.md, decisions/D070-conversion-bug-fixes-2026-11-24.md, decisions/D071-test-store-razorpay-test-mode.md, decisions/D072-address-open-ended-pin-matches-state.md, decisions/D073-in-app-note-off-all-browsers.md, decisions/D074-refund-event.md, decisions/D075-session-id-on-orders.md, decisions/D076-store-db-nightly-sheet-copy.md, ../supabase/functions/db-backup/README.md]
---

# Status (2026-11-26 19:40 IST)

**NOW: conversion is the priority this week (the founder, 24 Nov).** Every change is its own pull request; the founder
merges, and a merge to `main` is live on Vercel. **Live since 24 Nov:** the bug fixes B1-B7 and the UI/UX changes C1-C6
and C3b, #29-#44 ([D070](decisions/D070-conversion-bug-fixes-2026-11-24.md) and its addenda); the product page is
`/products/khelu`, and `/products/kheelu` and every older product address answer one 308 to it. **Live since 25 Nov:**
the address fix ([D072](decisions/D072-address-open-ended-pin-matches-state.md), #50).
**Merged 26 Nov (one [log](log.md) entry each):** C2 (#52): the in-app browser note is off for every in-app browser
([D073](decisions/D073-in-app-note-off-all-browsers.md)) after the phone tests passed (iPhone 25 Nov, Android 26 Nov);
K-66 (#53): `/khelu` answers one 308 to `/products/khelu`; refunds reach PostHog as `purchase_refunded` (#54,
[D074](decisions/D074-refund-event.md)); the order keeps the PostHog session id (#55,
[D075](decisions/D075-session-id-on-orders.md); migration 0005 applied by hand on the test and production projects first);
analytics tags only in production builds (#56, K-187); the nightly copy of the store database (#57,
[D076](decisions/D076-store-db-nightly-sheet-copy.md)).
**Store database copy:** live on production since 26 Nov 19:24 (cron `kheelona-db-backup`, 02:00 IST; first night 27 Nov).
The founder skipped the test round and the restore drill (accepted risk), so a restore from the sheet is **not yet
proven** (`supabase/functions/db-backup/README.md`, "As deployed").
**Test store:** betastore.kheelona.com takes Razorpay Test Mode payments only, on its own Supabase project, with email
off ([D071](decisions/D071-test-store-razorpay-test-mode.md); #45-#49); `beta` follows `main` through `test-store-sync` (#45).
**Next:** watch real in-app payments after C2 (a B2 revert brings the note back); check the first nightly copy (27 Nov).
**Branch:** `main` `4ca1d1b5` (production, Vercel). Pull request branches `growth/<week>/<ID>-<slug>`.

**On hold until Monday 30 November (the founder, 24 Nov; rediscussed then):** the move to AWS (CLAUDE.md "Hosting"),
the claims, safety and legal review (the legal pages' "pilot families" wording waits for it; whether `/privacy` names
Google Workspace for the sheet copy, D076), and workspace housekeeping.

**Waiting on the founder:** the 30 November review of the holds; a restore drill, whenever chosen, to prove the copy;
the older items in [open questions](open-questions.md).

**Founder decisions so far:** D010-D076 + R1-R10 (see [index](index.md)). Latest: **D076** the nightly sheet copy;
**D075** the session id on the order; **D074** the refund event; **D073** the in-app note off; D072 the PIN check.

**Traps:** the repo is public: stage files by name, never `git add -A`; never write the production Supabase project id,
the backup sheet's id or any secret here; push only with an explicit destination; only the founder merges; pay only on
the test store; frozen files change only by reviewed patches; a migration runs by hand (test, then production) BEFORE
its code merges; the Lighthouse gate holds, apart from the one-time exceptions B5b and C3 (see the [log](log.md)).
**Due:** the holds are rediscussed on 30 November 2026; deliveries start 15 December 2026 (D068).
