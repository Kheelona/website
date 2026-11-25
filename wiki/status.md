---
title: Status
type: status
updated: 2026-11-25
sources: [log.md, open-questions.md, decisions/D070-conversion-bug-fixes-2026-11-24.md, decisions/D071-test-store-razorpay-test-mode.md, decisions/D072-address-open-ended-pin-matches-state.md]
---

# Status (2026-11-25 22:36 IST)

**NOW: conversion is the priority this week (the founder, 24 Nov).** Every change is its own pull request; the founder
merges, and a merge to `main` is live on Vercel. **Live since 24 Nov:** the bug fixes B1-B7 and the UI/UX changes C1-C6
and C3b, pull requests #29-#44 ([D070](decisions/D070-conversion-bug-fixes-2026-11-24.md) and its addenda; one
[log](log.md) entry each). The product page's address is `/products/khelu`; `/products/kheelu` and every older product
address answer one 308 to it. **Live since 25 Nov:** the address fix ([D072](decisions/D072-address-open-ended-pin-matches-state.md), #50).
**Test store:** betastore.kheelona.com takes Razorpay Test Mode payments only, on its own Supabase project, with email
off ([D071](decisions/D071-test-store-razorpay-test-mode.md); #45-#49). Branch `beta` follows `main` through the
`test-store-sync` workflow (#45). `verify` runs green on `main` again since #48 (25 Nov).
**Phone tests on the test store:** the iPhone rows passed on 25 Nov (Safari, inside LinkedIn, inside Instagram); the
Android rows, the back-out and the app switch are pending.
**Next:** the Android rows, then C2's last step: the in-app browser notice goes, app by app, only for the apps whose
test passes. A revert of B2 is prepared in case a must-pass row fails.
**Branch:** `main` `8945216b` (production, Vercel). Pull request branches `growth/<week>/<ID>-<slug>`.

**On hold until Monday 30 November (the founder, 24 Nov; rediscussed then):** the move to AWS (CLAUDE.md "Hosting"),
the claims, safety and legal review (the legal pages' "pilot families" wording waits for it), and workspace housekeeping.

**Waiting on the founder:** the Android phone tests, then C2 app by app; the 30 November review of the holds; the older
items in [open questions](open-questions.md).

**Founder decisions so far:** D010-D072 + R1-R10 (see [index](index.md)). Latest: **D072** the address form takes any
house/street and city, and the PIN code must belong to the picked state; **D071** the test store takes Razorpay Test
Mode payments (D051 superseded); **D070** the conversion fixes B1-B7, with addenda for `/products/khelu`, the store's
"Khelu" and the reservation page, and the 24 November UI/UX changes in the [log](log.md); D069 OpenAI's measurement;
D068 deliveries start 15 December 2026; D067 the legal pages final.

**Traps:** the repo is public: stage files by name, never `git add -A`; push only with an explicit destination; a
merge to `main` deploys, so only the founder merges; never test-buy from a pull request preview (its Pre-order opens
the live store): pay on the test store; frozen checkout and tracking files change only by reviewed patches
(`test/guards/fixtures/authorised-diffs/`); built redesign pages are committed; the Lighthouse gate holds, apart from
the founder's two one-time exceptions (B5b, C3; see the [log](log.md)).
**Due:** the holds are rediscussed on 30 November 2026; deliveries start 15 December 2026 (D068).
