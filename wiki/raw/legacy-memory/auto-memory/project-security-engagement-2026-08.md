---
name: project-security-engagement-2026-08
description: "The kheelona.com security review opened 2026-08-23 — branch security-hardening, what is fixed, and the founder actions still pending"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4dcce2f4-4de7-44a0-ae19-f7bc1f6b2233
  modified: 2026-08-23T08:11:07.829Z
---

A defensive security review of the live payment site, **2026-08-23**. **MERGED AND LIVE** as
`b7be77e` (`--no-ff`, so revertable with `git revert -m 1 b7be77e`); rollback tag
**`pre-security-hardening-2026-08-23` = `05872e0`**, cut before the merge. Branch
`security-hardening` is merged; work continues on `main`. The engagement's own record is
**`security-review.md` at the repo root**, and `CLAUDE.md` carries a banner telling every session to
read it until sign-off. Read that file rather than trusting this summary.

**BOTH HIGHs ARE CLOSED.** F-01 needed the founder's secret rotation on top of the code fix, and
that is done and PROVEN: the `Add it here` link in `KH-YPJ8-GHVT`'s 2026-08-22 acknowledgement email
(token minted under the old secret) now lands on "We need your link again". Note for any future
rotation: **I cannot verify a rotation myself** — never holding the production secret means I cannot
mint an old-secret token to watch it fail, so the decisive test always needs the founder's inbox.
**Vercel trap:** an env var only applies to deployments created after it changes, so a rotation
without a Redeploy silently leaves the old value running.

**Twelve findings, no CRITICAL.** Fixed with paired tests: F-01 (the address token, an order's only
credential, was riding in the `/thanks` URL and so reaching GA4 and Ahrefs as `page_location` — now
claimed by `src/proxy.ts` into an HttpOnly cookie with a 303 to a clean path), F-02 (Next 16.2.10 →
16.2.12, four HIGH advisories including a proxy-layer bypass; floor guarded by
`test/dependency-floor.test.ts`), F-03 + F-08 (all security headers, CSP in **Report-Only**, plus
`poweredByHeader: false`), F-05 (webhook rows store an allow-listed summary, not the payer's email,
phone and card metadata), F-06 (`markPaid` refuses an amount below the order's, as a condition on
the atomic UPDATE), F-07 (health throttled), F-10 (JSON-LD escaped), **F-14** (every throttle keyed
on the caller-suppliable first entry of `x-forwarded-for` — now `x-real-ip`, then the rightmost hop).

**Still the founder's, and none of it may be auto-executed:** prune old
`webhook_events.payload` rows (SQL is in security-review.md 5a step 3); decide on a Vercel Firewall
rate-limit rule (F-04, escalated on purpose — a Postgres counter would add 250-975ms to
create-order); decide HSTS `includeSubDomains` (F-09); take DPDP retention and grievance wording to
counsel (F-12). Done already: the merge, and the `STORE_SIGNING_SECRET` rotation.

**The CSP is half-shipped by design.** Report-Only first was the founder's call. Flipping
`CSP_PHASE` in `src/lib/security-headers.ts` to `"enforce"` is a separate small commit, to be made
only after reading the `[csp] blocked=…` lines from real traffic in the Vercel logs.

**New tooling worth remembering:** `npm run qa:payment` (`tools/qa/payment-probe.mjs`) drives the
real Razorpay **sandbox** in a real browser — form, create-order, the checkout sheet opening, CSP
violations, a signed webhook accepted and a forged one refused. It refuses to start on a live key.
It needed two fixes to existing tooling: `openPage` in `tools/qa/lib/browser.mjs` now takes
`allow: [hosts]` because it aborts ALL third-party requests by default (which is why the sheet
appeared broken at first — the harness, not the CSP), and the Supabase stub takes writes only under
`STUB_WRITABLE=1`. **Never allow a measurement host in a probe:** those tags report to the founder's
real GA4 and Ahrefs properties.

Founder-supplied **Razorpay TEST keys** live in a gitignored `.env.local`. Never in Vercel, never
committed, never a live key.

Two traps found the hard way this session: the **Write tool converts `\r`, `\n` and `\t` in file
content into real control bytes** (it left a raw NUL and 0x1F inside a regex in a route file, which
made Edit and grep unable to match it — build char classes from `codePointAt` instead), and a
**control run is worth doing on a security assertion**: removing Razorpay from `script-src` proved
the payment probe's CSP check was not vacuous, and revealed a second Razorpay host
(`cdn.razorpay.com/static/cx/razorpay-risk-detection/bundle.js`) that nothing in the repo mentions.

Related: [[project-kheelona-com-build-prompt]], [[feedback-founder-working-style]].

**2026-09-06: THE CSP REPORTS WERE FINALLY READ, AND THE POLICY WAS WRONG.** Production Report-Only was refusing three things the site needs, so **flipping to enforce would have silently broken the Meta Pixel and part of GA4**: `www.facebook.com` was missing from `frame-src` (the pixel's cookie-matching frame) and `form-action` (fbevents.js falls back to a form POST to /tr), and `www.googletagmanager.com` from `img-src` (GA4 beacons from the TAG host, not google-analytics.com). All three added with founder approval and pinned by `test/security-headers.test.ts`; `form-action` is flagged in code as the loosest line in the policy and goes if the pixel goes. **The flip still needs a FRESH observation window** — every report before this date was against a policy refusing things we need. **How to read the reports fast: Lighthouse's `errors-in-console` audit against PRODUCTION surfaces Report-Only violations directly**, far quicker than waiting on `/api/csp-report` in the Vercel log.
