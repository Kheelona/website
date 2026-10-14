---
title: "QA defects register (Phase 6, task 7.1 onwards)"
type: qa-defects
updated: 2026-10-14
sources:
  - test-plan.md (§1.4 severity and record format, §5.1 LP method, §5.2 rows 17-18, §7.0)
  - results-2026-10-14.md (round 1 evidence, every row cited there)
  - "../raw/qa/2026-10-14/network/*.json (LP probe, 2026-10-14 02:13-02:35 UTC, local only, D039)"
  - "Scratch scripts (never in the repo): /private/tmp/claude-501/-Users-apoorvasahu-Documents-kheelona-com-website/a7840453-29e0-4cce-aaef-7d40bff98747/scratchpad/qa-7.1/{lp-probe,redirect-check,page-checks}.mjs"
  - "Code read at a5124aa: test/e2e/support/lp.ts, test/e2e/tracking-probe.spec.ts, scripts/qa/lighthouse.mjs:55-58, src/app/store/thanks/page.tsx:123-150 and 198, src/content/en-IN/navigation.ts:108, mockup/home.html (footer legal row), node_modules/posthog-js/dist/module.js (isLikelyBot)"
  - "git show archive/pre-reset-2026-10-10:src/app/store/thanks/page.tsx (lines 90-118, 190-197)"
---

# QA defects register

Severity, owner routing and the record format are the [test plan §1.4](test-plan.md#14-defects-defectsmd).
Round 1 is task 7.1 on the local production build (L) and the local tracking probe (LP), 2026-10-14; the full
evidence is in [results 2026-10-14](results-2026-10-14.md).

**Round 1 in one line:** no S1 or S2 defect. Three S3 defects, all in QA instruments (two in the repo's LP
harness, one in the Lighthouse block list), none in the site. Two S4 items need a main-session ruling: each matches
the approved mockup or the tag, and differs from the test plan's wording.

| ID | Sev | Where | Owner | Status, round 1 (2026-10-14) |
|---|---|---|---|---|
| QA-001 | S3 | `test/e2e/support/lp.ts` (LP harness) | Task 1.1 (QA harness); main session assigns | Open |
| QA-002 | S3 | `test/e2e/tracking-probe.spec.ts` parity rows (row 14) | Task 1.1 (QA harness) | Open |
| QA-003 | S3 | `scripts/qa/lighthouse.mjs` `BLOCKED` (LP-tags profile) | Main session (Lighthouse owner, M1/M2) | Open. **Fix before the next LP-tags run** |
| QA-004 | S4 | `/thanks`, the two non-order states | Main-session ruling; a fix would go to the `/thanks` restyle owner (4.8/5.16) | Open, ruling needed |
| QA-005 | S4 | Footer "Grievance officer" link, every marketing page | Main-session ruling; a fix would be task 3.1's `navigation.ts` | Open, ruling needed |

## QA-001 (S3): redirect hops and page-unload beacons escape the LP harness's routing

- **Where:** `test/e2e/support/lp.ts` (`serveRealOriginsLocally`), used by `test/e2e/tracking-probe.spec.ts`.
- **What:** the harness serves `https://kheelona.com` and `https://store.kheelona.com` by fulfilling each request
  from the local server, and relies on that routing alone to keep requests off production. Two kinds of request
  never reach the route handler:
  1. **A redirect hop.** When a route fulfils a 3xx, Chromium follows the `Location` itself and the follow-up
     request goes straight to the network. Proven in isolation (`redirect-check.mjs`): the handler saw only
     `https://qa-redirect.example/a`, and the hop to `/b` went to the network (`net::ERR_CONNECTION_REFUSED`
     under host-resolver isolation), for both a 308 and a 303 with `Set-Cookie`.
  2. **Keepalive and `sendBeacon` requests sent while a page unloads.** In the round 1 flows run, 15 PostHog
     POSTs to `/ingest/i/v0/e/` and `/ingest/s/` (including the `$autocapture` that carries `cta: "hero"`) bypassed
     routing and reached the host-resolver target instead (`lp-probe-flows-1791945038330.json`, `proxyEscaped`).
- **Why it matters:** `lp.ts` launches no host-resolver isolation, so in its runs both kinds go to the real
  hosts: a redirect such as `/team/` → `/team` or the `/thanks?ref&t` 303 claim would load the document from
  **production**, and an unload beacon to `https://kheelona.com/ingest/...` reaches production, whose `/ingest`
  rewrite forwards it to PostHog project 617632. Nothing leaked in round 1. The QA probe used total isolation
  (below), and the repo spec's current rows load no redirecting URL. PostHog was also silent there (QA-002).
  Fixing QA-002 alone would start the leak.
- **Steps to reproduce:** run `node redirect-check.mjs` (scratch path above): one route, a fulfilled 308 to a
  second URL, then `page.goto` the first. Only the first URL reaches the handler.
- **Expected:** every request the page makes under the real origins stays on the machine (test plan §5.1).
- **Actual:** redirect hops and unload beacons leave the routing.
- **Fix (what round 1 used, proven):** launch Chromium with `--host-resolver-rules="MAP * 127.0.0.1:<port>,
  EXCLUDE localhost, EXCLUDE *.localhost, EXCLUDE 127.0.0.1"`. Serve that port with a local TLS proxy (throwaway
  self-signed certificate, `ignoreHTTPSErrors: true`) that forwards only `kheelona.com` and `store.kheelona.com` to
  the local build. The proxy answers every `/ingest` non-download path, every `/_vercel` path and every other host
  locally, and never forwards them. Fetch the tags' script and config downloads from Node and serve them from a cache, so
  Chromium itself resolves nothing. With this in place an escaped request is recorded and answered locally, not
  lost and not delivered.
- **Evidence:** `../raw/qa/2026-10-14/network/lp-probe-flows-1791945038330.json` (`proxyEscaped`, 15 entries, every
  host `kheelona.com` or `store.kheelona.com`, none forwarded); `redirect-check.mjs` output in the results page §2.

## QA-002 (S3): the repo's tracking probe cannot see PostHog, so row 14 cannot pass

- **Where:** `test/e2e/tracking-probe.spec.ts` "parity rows" (opt-in, `KH_TRACKING_PROBE=1`; skipped in the main
  e2e run).
- **What:** posthog-js drops every event when it thinks the browser is a bot. Its `isLikelyBot` ends
  `return !!navigator.webdriver` (`node_modules/posthog-js/dist/module.js`), and Playwright's browser reports
  `navigator.webdriver === true`. In Playwright's default headless shell PostHog also sent nothing with webdriver set
  to false. The spec's assertion "row 14: PostHog $pageview recorded" therefore cannot pass as written, whatever the
  site does.
- **Control (repeated):** same page (`/safety`), same harness. Default headless shell: no PostHog request.
  `channel: "chromium"` with `navigator.webdriver` true: no PostHog request. `channel: "chromium"` with
  `navigator.webdriver` false: `$pageview` recorded. Evidence: `control-posthog-headless-shell-webdriver-true.json`,
  `control-posthog-chromium-webdriver-true.json`, `control-posthog-chromium-webdriver-false.json`.
- **Expected:** the instrument records PostHog when the site sends it (lessons §7: prove the instrument records).
- **Fix:** launch with `channel: "chromium"` and an init script that makes `navigator.webdriver` read `false` (a
  parent's browser reports false). Land QA-001's isolation **first**: once PostHog records, its unload beacons
  escape routing.

## QA-003 (S3): the Lighthouse LP-tags block list misses three vendor diagnostic endpoints

- **Where:** `scripts/qa/lighthouse.mjs:58` (`BLOCKED`, LP-tags profile only).
- **What:** with the tags loading under the real hostnames, the LP probe saw three request types that are neither
  script nor config downloads and are not in `BLOCKED`. In LP-tags they would leave the machine:
  - `https://www.googletagmanager.com/td?id=G-7LMKSFEXZ9&...` (GA4 tag diagnostics; `/terms`,
    `control-posthog-headless-shell-webdriver-true.json`);
  - `https://www.googletagmanager.com/a?id=G-7LMKSFEXZ9&...` (GA tag telemetry; 5 requests on `/shipping`,
    `lp-probe-controls-control-host-pages-1791945304121.json`);
  - `https://connect.facebook.net//log/error?p=capig_pixel&pn=openbridge3&...` (the Meta Pixel's OpenBridge log, the
    G18 call). Seen on `/safety` and `/` in two round 1 debugging runs, 02:21 and 02:24 UTC; those superseded files
    were pruned and two later re-runs of four pages did not reproduce it. M2 saw it on `/privacy` too
    ([tracking inventory §14a](../site/tracking-inventory.md)).
  All three are intermittent, none is a GA4 collect hit or a Meta event, and the probe answered each one locally.
  They are still requests to Google and Meta from a local QA run, and the brief for this run allows only script and
  config downloads off the machine.
- **Steps:** LP probe pages run; read `answeredUnknown` per page in the files above.
- **Fix:** add `"*googletagmanager.com/td*"`, `"*googletagmanager.com/a?*"` and `"*connect.facebook.net/log/*"` (it
  is requested with a double slash, `//log/`, so match on `log/` without a leading slash) to `BLOCKED` before the next
  LP-tags run. Re-check the list against `answeredUnknown` after any tag update.

## QA-004 (S4, ruling): `/thanks` non-order states do not carry `ph-no-capture ph-mask`

- **Where:** `store.kheelona.com/thanks`, "We need your link again." (no cookie, bad or expired token) and "We cannot
  open that order right now." (store database error).
- **What:** test plan §5.2 row 18 says the container carries `ph-no-capture ph-mask` "in every branch". The build
  puts it on the order branch only (`src/app/store/thanks/page.tsx:150`, paid and confirming states). The tag does
  exactly the same: `ph-no-capture ph-mask` sits on the order branch only (`archive/pre-reset-2026-10-10`
  `thanks/page.tsx:118`), and the link-needed (`:190-197`) and error (`:90-92`) states have none. Neither state prints an order detail. The
  LP run also shows suppression working where it matters: no `$autocapture` was sent on the paid `/thanks`, even
  after the "Save my address" click (`lp-store.json`).
- **Options:** (a) correct the plan's wording to "every branch that prints order data" (tag parity, nothing to
  change; **recommended**); (b) add the class to the two other states, a presentation-only change under ADR-013 with
  its reviewed diff.

## QA-005 (S4, ruling): the footer's "Grievance officer" link opens `/contact`, not `/contact#grievance`

- **Where:** every marketing page, footer legal row (`src/content/en-IN/navigation.ts:108`).
- **What:** test plan §7.0 asks for a footer "`#grievance` link". The approved mockup links `contact.html` with no
  fragment, and the build follows it (`navigation.test.ts:72-73` pins it to the mockup). `/contact` has the
  `id="grievance"` block with the D032 wording, so the link lands at the top of the contact page, not on the
  officer's details.
- **Options:** (a) keep it as approved and correct the plan; (b) point it at `/contact#grievance` (one line, plus
  the pinned test), so a parent looking for the grievance officer lands on the block (**recommended**, low risk,
  needs the main session's OK because it departs from the approved mockup).
