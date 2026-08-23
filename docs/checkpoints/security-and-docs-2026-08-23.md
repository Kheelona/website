# Checkpoint: the security engagement and the doc cleanup (2026-08-23, late)

The third and fourth rounds of a long day. Before them, same day: the v3 migration
(`v3-migration-2026-08-23.md`), the one-tap CTA round (`one-tap-and-cleanup-2026-08-23.md`) and the
Ideabaaz partner page (`ideabaaz-event-page-2026-08-23.md`).

**The security round's full record is `security-review.md` at the repo root**, which is deliberately
NOT a checkpoint: it stays live, `CLAUDE.md` carries a banner telling every session to read it, and
that banner comes off at sign-off. This file is the round record; that file is the detail.

---

## Round 3: security hardening (merged `b7be77e`, rollback tag `pre-security-hardening-2026-08-23`)

A defensive review of a site that had started taking real money the day before. **Fifteen findings,
no CRITICAL, twelve closed the same day**, both HIGHs confirmed on production. Laws: **§8.28**.

**The finding that mattered.** The address token is the only authorisation an order has — it reads a
family's confirmation and changes where their Lumi is delivered, for thirty days. It arrived as
`/thanks?ref=&t=`, and that page inherits three measurement tags, every one of which reports the URL
it loaded on. So `gtag` had been copying each paid order's credential into GA4 as `page_location`.
Anyone with analytics access could open a stranger's confirmation and re-point their delivery. Fixed
in code (the proxy claims it into an HttpOnly cookie, 303 to a clean path) **and** closed by the
founder rotating `STORE_SIGNING_SECRET`, which is what made the tokens already sitting in GA4 inert
rather than merely unreachable.

**The other eight fixes**, each with a paired test proven to fail before it passed: Next 16.2.10 →
16.2.12 (four HIGH advisories, one a proxy-layer bypass — the layer the host split runs on); the
complete absence of security headers, CSP included; `markPaid` never checking the captured amount;
`/api/health` unthrottled and touching Postgres twice per anonymous call; the whole Razorpay event
being stored forever with the payer's email, phone and card metadata; JSON-LD injected unescaped on
ten pages; `x-powered-by`; and **every throttle in the store keyed on the first entry of
`x-forwarded-for`**, which the caller supplies — one varying header and none of them existed.

**Three things the founder closed that I could not:** the secret rotation, pruning the old webhook
payloads, and an edge rate-limit rule (`store-post-throttle`, 20/min per IP on `/api/preorder/`
POSTs — which must never widen to `/api/`, because Razorpay's retries and the health cron sit outside
it on purpose).

**F-15, found by checking rather than by looking for it.** Before enabling HSTS `includeSubDomains`
I checked what it would bind, and found `admin.kheelona.com` serving a Firebase default certificate
that did not cover it: a surface named `admin` reachable only by clicking through a TLS warning. HSTS
makes such a warning un-clickable-through, so enabling it as asked would have hard-blocked that panel
for two years per browser. Fixed first (the founder added the custom domain properly), then shipped.

**Still open by design:** the CSP is in **Report-Only**, phase one of two. Flipping it needs a few
days of real traffic read from `/api/csp-report`'s log lines, because GA4 is the one third party a
local probe must never be pointed at. And F-12, the DPDP retention period and grievance contact on
`/privacy`, is founder-deferred to before shipment.

**New tooling: `npm run qa:payment`** drives the real Razorpay **sandbox** in a browser — form,
create-order, the checkout sheet opening, CSP violations, a signed webhook accepted and a forged one
refused. It must be green before the CSP is ever enforced.

### The three lessons worth more than the findings

1. **Build the control before believing a security assertion** (§8.28-g). "No CSP violations" was
   worthless until I removed Razorpay from `script-src` and watched the probe fail — which also
   surfaced a second Razorpay host (`cdn.razorpay.com/.../razorpay-risk-detection/bundle.js`) that
   nothing in this repo mentions.
2. **Check the harness before the finding.** The payment sheet first looked broken under the CSP. It
   was `openPage` aborting all third-party requests, which is its documented behaviour.
3. **A probe may never be pointed at a measurement host**, because those tags report to the founder's
   real properties. That is why GA4's CSP compatibility is left to production Report-Only.

### Two operational traps recorded

**A Vercel environment variable only applies to deployments created after it changes**, so a
rotation without a redeploy silently leaves the old secret running and everything still works. And
**I can never verify a rotation myself**: never holding the production secret means I cannot mint an
old-secret token and watch it die, so the decisive test always needs the founder's inbox. Here it was
the `Add it here` link in `KH-YPJ8-GHVT`'s receipt, which now correctly refuses.

---

## Round 4: the documentation and cleanup round

**The gap that justified it:** the security round's laws existed only in code comments.
`docs/website-steps.md` is the law file every session reads, and it knew nothing about the CSP's
rollout phase or why `/thanks` no longer takes a token in its URL. **§8.28** fixes that in seven
parts, including the `'unsafe-inline'` compromise stated plainly so nobody "fixes" it in ignorance.

**One list instead of two** (founder's call). `Technical-Todo.md` now holds every open item,
founder-gated and engineering together, each tagged with who owns it. `FOUNDER-TODO.md`'s settled
half moved verbatim into `closed-rounds.md`; the file itself is a six-line pointer rather than
deleted, because **82 references across 29 files name it** — four in `src/` comments, seventeen in
frozen checkpoints that name items by id (`R4-a`, `V3-a`, `REV-b`). Deleting it would have meant
either falsifying history or leaving seventy dangling pointers.

**Deleted:** `PLAN-V6.md` (618 lines, a fully executed plan whose 60 unticked boxes were executed
steps), `HANDOFF-design-v6.md`, `QA-V6-note.md` (compressed into `qa-report.md` first, keeping its
two real catches), the dead vendored `HeroGlowBackground` and its stale registry row, and an
unreferenced white wordmark. Net −1,217 / +546 lines.

**Not deleted despite approval:** `public/products/lori|lua|robu.png`. `src/lib/family.ts:3-5` says
in code that those renders stay for parity with kheelona.ai, and an earlier round the same day
recorded the same decision. Flagged in `Technical-Todo.md` rather than silently reversed.

**Four doc-vs-code contradictions fixed**, the worst being **README telling a new developer "Node
18+"** when `.nvmrc` pins 24 — the kind of error that costs somebody an afternoon. Also a stale sweep
count, a four-day-old ship date in the store runbook, and `supabase/README.md` describing a webhook
payload column that no longer holds what it said.

**Then every Technical-Todo item was verified against the code, config and live site**, which found
three wrong: journal cards using each article's hero art had been **done for weeks** (19/19 articles
carry heroes; V4 shot the seven that had blocked it in July); a "Search Console" item that described
routine operations rather than a task; and the Ahrefs host-gating trade-off listed as if someone had
forgotten it. Two items were re-rated down after consulting the design system and the code
respectively — the type-scale consolidation (v3's `site-extensions.md:27` **sanctions** a fluid scale,
so it is cosmetic, not non-compliance) and the Home ↔ Meet Lumi overlap (its V5-era "60% the same
page" premise died when V6 restructured Home, and the FAQ near-duplicates are deliberate, with the
SEO reasoning in code comments).

**Standing after both rounds: 25 open items — 0 critical, 2 high, 3 medium, 20 low.** Neither HIGH is
actionable now: the CSP flip is time-gated on purpose, and the returns and warranty terms need facts
that will not exist until October.

## Gates

869 tests across 100 files, tsc 0, build 0, `qa:sweep` clean 34/34 over 17 routes, `qa:payment`
clean. Production re-verified read-only after every deploy: all seven headers on both hosts, exactly
**one** `Strict-Transport-Security` header carrying `includeSubDomains` (the platform sends its own,
and a browser obeys only the first, so a duplicate would have made it cosmetic), health green, 15/15
routes 200, and the live store screenshotted with its form and CTA intact.
