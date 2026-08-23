# Security review and hardening: kheelona.com + store.kheelona.com

**Status: MERGED AND LIVE. Nine findings closed, no CRITICAL or HIGH open. Three items are with the
founder and one is a deliberate second step.**
Opened and shipped 2026-08-23. Merge `b7be77e` (`--no-ff`, revertable with `git revert -m 1
b7be77e`); rollback tag **`pre-security-hardening-2026-08-23` = `05872e0`**, cut before the merge.
The `security-hardening` branch is merged and work continues on `main`.

**Closed:** F-01 the order credential in the `/thanks` URL (code fix **plus** the founder's secret
rotation, both confirmed on production) · F-02 the Next patch · F-03 the security headers, phase one
· F-05 the stored webhook payload (new rows by code, old rows pruned by the founder) · F-06 the
payment amount guard · F-07 the health throttle · F-08 the framework header · F-10 JSON-LD escaping ·
F-14 the rate-limit key.

**Still open, all of it either the founder's or deliberately staged:** F-04 (an edge rate-limit
rule), F-09 (HSTS scope), F-12 (DPDP wording, counsel's), and flipping the CSP from Report-Only to
enforcing once its reports have been read. See sections 5a and 5b.

This file is the engagement's memory. It is written so a session with no other context can pick the
work up: the architecture, every finding with its status, what was fixed and by which test, gate
results, and what is waiting on the founder. **Keep it current at all times.** Secret VALUES never
appear here, only locations.

---

## 0. Scope, roles, and the rules this engagement runs under

A defensive review of the live site that now takes real money from parents. Four roles, all played
in this session: NADIA finds and classifies, KAI fixes, RIA tests and gates, VERA triages and signs
off. Standards anchored to OWASP Top 10 / ASVS and, for the payment surface, PCI DSS (verify current
numbering before citing a control number in this file: nothing below leans on one).

**Never, in this engagement:** active attack traffic against production (no fuzzing, brute force,
load testing, or destructive exploitation); no copying, printing, or quoting real customer values;
no real cards and no real charges or refunds; no secrets written into any file; no pushes to `main`.
Read-only, non-intrusive prod checks are fine and were used (response headers, the public health
endpoint, public bundles).

**Escalate, never auto-execute:** rotating or revoking any secret; any Razorpay dashboard,
credential, or webhook change; anything run against the production database, migrations included;
DNS, TLS, hosting, CDN, or WAF changes; deleting data; anything that could take checkout offline;
legal or policy wording; enabling or removing a third-party integration.

---

## 1. Architecture and attack surface (NADIA, Phase 0)

### 1.1 What this is

One Next.js 16 app (App Router, `src/`-based atomic design) on Vercel, serving **two hosts from the
same deployment**:

| Host | Serves | Indexing |
|---|---|---|
| `kheelona.com` (apex, canonical; `www` 308s to it) | the marketing site, route group `src/app/(site)/` | indexed |
| `store.kheelona.com` | the checkout, `src/app/store/*`, reached by a host rewrite | `noindex, nofollow` |

The host split is a pure function, `src/lib/store/host.ts`, adapted by `src/proxy.ts` (Next 16's
renamed middleware). On the store host every path rewrites into `/store/...`; on the apex,
`/store/...` 308s out to the store host. The proxy also stamps the store's `x-robots-tag`.

### 1.2 The money path, end to end

1. **`/store` (or `/store/ideabaaz`, or `/store/e/[event]`)** renders server-side. It resolves a
   tier through `src/lib/store/tiers.ts` and hands the client a **tier id and display labels only**.
2. **`PreorderForm`** (client) validates with the same pure functions the server uses
   (`src/features/preorder/lib/validate.ts`) and POSTs `{tier, signature?, contact, utm}` to
   **`/api/preorder/create-order`**. It never sends an amount.
3. **`create-order`** re-resolves the tier server-side, validates, inserts our `preorders` row at
   `status='created'`, then creates the Razorpay order with **our** amount, then attaches the gateway
   order id. Returns the gateway order id, the public key id, the amount, and a signed address token.
4. **Razorpay Checkout** (`checkout.razorpay.com/v1/checkout.js`, loaded on first submit only) takes
   the card/UPI details **on Razorpay's own surface**. No card data ever reaches this app.
5. **`/api/preorder/confirm`** (fast path, browser) verifies Razorpay's checkout HMAC and calls
   `markPaid`. **`/api/razorpay/webhook`** (guaranteed path) verifies `x-razorpay-signature` against
   the RAW body, claims the event id in `webhook_events` for idempotency, and calls the same
   `markPaid`, plus `markRefunded` / `markFailed`.
6. **`/store/thanks?ref=…&t=…`** shows the confirmation and collects the delivery address, which
   POSTs to **`/api/preorder/address`**. Authorisation is the signed token, and nothing else.
7. Emails go out through Resend (`src/lib/email/`): one acknowledgement to the parent, one internal
   alert.

**Offer state** is decided per request in `src/lib/store/mode.ts` from a live count of the paid
queue: `token` (₹499 reserves one of the first 500 units at ₹4,999) or `full` (₹7,999 paid upfront).
The count never leaves that module.

### 1.3 Data stores and processors

- **Supabase Postgres** (`preorders`, `webhook_events`, `event_tiers`; `supabase/migrations/`).
  Accessed only by route handlers holding the service-role key.
- **Razorpay** — payments. **Resend** — email. **Vercel** — hosting. All four named on `/privacy`.
- PII held: parent name, phone, email, child's age (free text), delivery address, UTM blob. **No card
  number, PAN, or CVV anywhere** (verified by reading every write path). `webhook_events.payload` used
  to hold the whole Razorpay event, including the payer's email, phone and card metadata; since F-05
  it holds an allow-listed summary, and the old rows were pruned.

### 1.4 Secrets

Six required, read in exactly one place, `src/lib/store/env.ts`: `RAZORPAY_KEY_ID`,
`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `STORE_SIGNING_SECRET`; optional `RESEND_API_KEY`, `EMAIL_FROM`,
`ORDER_ALERT_EMAIL`. Set in the founder's Vercel dashboard. `.env` is gitignored and has never been
committed (checked across all refs). `test/store-secrets.test.ts` already guards: no `NEXT_PUBLIC_`
name, no read outside `env.ts`, nothing in a `"use client"` file, every name documented in
`.env.example` with no values.

Public identifiers deliberately hardcoded in `src/config/site.ts`: the GA4 measurement id and the
Ahrefs site key. Correct, and not a precedent for a payment key (§8.25-y).

### 1.5 Third-party scripts, by page (the Magecart inventory)

| Script | Where from | Loads on | Notes |
|---|---|---|---|
| `analytics.ahrefs.com/analytics.js` | `src/app/layout.tsx` `<head>` | **every page, both hosts, no gate** | must stay in SSR HTML for Ahrefs' own verification |
| Vercel Web Analytics | `@vercel/analytics/next`, end of `<body>` | every page | served from a **same-origin obfuscated path** (`/8f88bf018d5e772b/script.js`), not a CDN |
| GA4 `gtag.js` | `googletagmanager.com`, via `GoogleAnalyticsGate` | hosts in `GA4_HOSTS`, **which includes `store.kheelona.com`** | client-side host gate, fires after hydration |
| `checkout.razorpay.com/v1/checkout.js` | injected by `src/features/preorder/lib/checkout.ts` | store pages, **on first submit only** | pulls its own frames and `api.razorpay.com` |
| inline bootstrap | `src/app/layout.tsx` | every page | `document.documentElement.classList.add('js')`; matters for CSP (needs a nonce or hash) |

No `<iframe>` anywhere in the source. External hosts referenced across `src/`: kheelona.com,
store.kheelona.com, kheelona.ai, wa.me, linkedin, github, schema.org, scripts.sil.org (font
licences), plus the four above.

### 1.6 Accounts, sessions, CORS

There are **no user accounts and no sessions**. No auth cookie exists, so there is no session
fixation, logout, lockout, or cookie-flag surface, and classic CSRF has nothing ambient to ride.
API routes set no `Access-Control-Allow-Origin`, so a cross-origin browser POST of
`application/json` is blocked at the preflight. (`access-control-allow-origin: *` on the apex HTML
is Vercel's default for prerendered pages and carries no credentials.)

The only authorisation primitive in the system is the **signed address token**: HMAC-SHA256 over
`address-token:{orderRef}.{expiry}`, 96-bit truncation, timing-safe compare, 30-day TTL, separate
purpose label from event-link signatures (`src/lib/store/signing.ts`).

### 1.7 Live header observation (read-only, 2026-08-23)

Both hosts return only `strict-transport-security: max-age=63072000` from Vercel. **No CSP, no
`X-Frame-Options` / `frame-ancestors`, no `X-Content-Type-Options`, no `Referrer-Policy`, no
`Permissions-Policy`.** `next.config.ts` defines redirects and image formats and **no `headers()`
block at all**. The store additionally returns `x-robots-tag: noindex, nofollow`,
`cache-control: private, no-cache, no-store`, and `x-powered-by: Next.js`.
`/api/health` answered `ok:true, store:"ready", preorder:"token", razorpay:"live", email:"configured"`.

---

## 2. What is already right (do not "fix" these)

Recorded so a later session does not undo a deliberate control.

- **Price is server-authoritative, everywhere.** The client sends a tier id; `resolveTier` reads the
  amount from config or from `event_tiers`. `createRazorpayOrder` refuses a non-integer or
  non-positive amount. `test/preorder-money.test.ts` guards the money law.
- **RLS on all three tables with zero policies, plus grants revoked from `anon` and
  `authenticated`.** Two independent fail-closed layers on a table holding families' home addresses.
- **Webhook verifies the RAW body** before parsing, timing-safe, and releases its `webhook_events`
  claim on failure so Razorpay retries. Unsigned callers get a bare 400 with no detail.
- **`markPaid` is idempotent in one atomic UPDATE** (`.neq("status","paid")`), so the browser
  callback and the webhook cannot both act. Orphan recovery falls back to our own reference, which
  Razorpay echoes in `receipt` and `notes`.
- **A full refund removes the order from the dispatch queue; a partial refund deliberately does
  not** and is logged for a human (§8.25-ee, learned from a real ₹489-of-₹499 refund).
- **The address route authorises on the signed token alone**, and `/thanks` 404s rather than
  explaining, so order references cannot be probed.
- **Order references are unguessable** (30-symbol confusable-free alphabet, 8 characters) and reveal
  no order count; the DB primary key is never exposed.
- **Customer values are HTML-escaped** in both emails; the plain-text half is left as typed.
- **No raw SQL anywhere** — every query is a parameterised PostgREST filter. No user-controlled
  `fetch` target, so no SSRF surface in our own code.
- **Secrets discipline** as described in 1.4, already test-guarded.

---

## 3. Findings register

Severity: CRITICAL / HIGH / MEDIUM / LOW / INFO. Owner: **KAI** (we fix) or **HUMAN** (escalate).
Status: OPEN / IN PROGRESS / FIXED (with the test that proves it) / ACCEPTED / ESCALATED.

**No CRITICAL findings. In particular: no card data is stored anywhere, no secret is in a client
bundle or in git history, and no unauthenticated path writes to `preorders`.**

| id | severity | surface | title | owner | status |
|---|---|---|---|---|---|
| F-01 | HIGH | payment / privacy | The address token, which is the only authorisation on an order, is sent to third-party analytics inside the URL | KAI + HUMAN | **CLOSED** `84ae07e` + founder rotation, both confirmed on production |
| F-02 | HIGH | dependencies | Next.js 16.2.10 carries 9 advisories, 4 HIGH, all fixed in 16.2.11 | KAI | **FIXED** `120271f` (16.2.12) |
| F-03 | MEDIUM (HIGH on the payment page) | headers / skimming | No CSP, no frame-ancestors, no nosniff, no Referrer-Policy, no Permissions-Policy on either host | KAI | **FIXED, PHASE 1 OF 2** `02e1f2a` (CSP Report-Only; enforcing is a second deploy) |
| F-04 | MEDIUM | API abuse | Rate limiting is per-instance in-memory, so it does not bound abuse on serverless | HUMAN (WAF) | **ESCALATED** — belongs at the edge, see below |
| F-05 | MEDIUM | data protection | `webhook_events.payload` keeps the entire Razorpay event forever | KAI + HUMAN | **CLOSED** `8df8977` for new rows, founder pruned the old ones (count now 0) |
| F-06 | LOW-MEDIUM | payment integrity | `markPaid` never compares the captured amount to the order's amount | KAI | **FIXED** `5a668f0` |
| F-07 | LOW | API abuse / disclosure | `/api/health` is public, unthrottled, and does two DB counts per call | KAI | **FIXED** `2c2c210` |
| F-08 | LOW | hygiene | `x-powered-by: Next.js` advertises the framework | KAI | **FIXED** `02e1f2a` (with F-03) |
| F-09 | LOW | transport | HSTS has no `includeSubDomains` and no `preload` | HUMAN (decision) | **ESCALATED** |
| F-10 | LOW | XSS hardening | JSON-LD is injected with `dangerouslySetInnerHTML` and no `<` escaping | KAI | **FIXED** `86818a3` |
| F-14 | MEDIUM | API abuse | Every throttle keyed on the first entry of `x-forwarded-for`, which the caller supplies | KAI | **FIXED** `36d3836` |
| F-11 | INFO | event pricing | The Ideabaaz page publishes its own tier signature | — | ACCEPTED (documented §8.25-g-i) |
| F-12 | INFO | privacy / DPDP | No retention period and no grievance contact designated on `/privacy` | HUMAN + counsel | ESCALATED |
| F-13 | INFO | event pricing | An event link's `sig=` is reported to analytics as part of the page URL | — | ACCEPTED, same model as F-11; the CSP report route strips query strings from what it logs |

### Founder decisions taken during the engagement (2026-08-23)

| question | decision |
|---|---|
| Dynamic test environment | **Local only, with Razorpay TEST keys** the founder supplied. They live in a gitignored `.env.local` beside the read-only Supabase stub in `tools/qa/`. Never in Vercel, never committed, never a live key. |
| CSP rollout | **Report-Only first, then enforce** as a second deliberate deploy. |
| `STORE_SIGNING_SECRET` rotation | **Rotate right after the F-01 fix ships.** Founder-executed. Cheapest now, while the store is one day old. |
| Next.js version | **Patch to the latest 16.2.x**, not the 16.3.x that `npm audit fix --force` proposes. |

### F-01 · HIGH · The address token travels to Google Analytics and Ahrefs in the URL

**Where.** `src/features/preorder/components/PreorderForm.tsx:141` redirects the paying browser to
`/thanks?ref=<orderRef>&t=<addressToken>`; `src/lib/store/fulfil.ts:155` puts the same URL in the
acknowledgement email. `/store/thanks` runs under the root layout, so on `store.kheelona.com` it
loads GA4 (`src/config/site.ts:214` lists the store host in `GA4_HOSTS`) and Ahrefs
(`src/app/layout.tsx:86`, ungated by design).

**Why it matters, in business terms.** gtag's automatic page view reports `page_location` as the
full `location.href`, query string included. That token is the **entire** authorisation for reading
a family's confirmation page (their email, what they paid, their order reference, and their
delivery address once saved) and for **changing the delivery address**, and it is valid for 30 days.
So every paid order's access credential is being copied into the founder's GA4 property and into
Ahrefs, where it is readable by anyone with analytics access, retained by a third party, and
exportable. It also sits in browser history. This is the one finding where the exposure has already
happened for real orders, not just could.

It is also in direct tension with what `/privacy` promises about the measurement tools: "None of
them ever sees your name, your address, or anything else you typed into the pre-order form."

**Safe proof-of-issue.** Static, from the code above plus `@next/third-parties`' default
`send_page_view`. RIA to confirm dynamically on **local or staging only**, by loading a `/thanks`
URL built with a **synthetic** order reference and token and observing that the outbound
`/g/collect` request's `dl` parameter contains `t=`. No real order, no real token, ever.

**Recommended fix (KAI).** Take the token out of the address bar before any analytics runs. The
smallest change that does it: `/store/thanks` reads `?ref=&t=` server-side, sets a short-lived
`HttpOnly; Secure; SameSite=Lax` cookie scoped to the store host and the `/thanks` path, then
redirects to a clean `/thanks`; the page reads the cookie. Email links keep working exactly as
today (they hit the query form once and are immediately cleaned). `/api/preorder/address` keeps its
contract, since the token still travels in the POST body. Referrer and history exposure die with
the same change.

**Escalation attached to this one (HUMAN).** Tokens already sent to GA4 stay valid until they
expire. Fully closing that means **rotating `STORE_SIGNING_SECRET`**, which is founder-only, and
which will also invalidate every address link already emailed and any printed event QR link that
carries a `sig=`. Consequences and options go to the founder; the fix above does not depend on it.

### F-02 · HIGH · Next.js 16.2.10 carries known advisories

`npm audit` reports 9 high-severity entries; the ones that reach production code are all in `next`
and all fixed in **16.2.11**:

- HIGH `GHSA-6gpp-xcg3-4w24` middleware/proxy bypass in App Router — this app's host routing **and
  the store's `noindex` header** are exactly a proxy-layer decision.
- HIGH `GHSA-p9j2-gv94-2wf4` SSRF in rewrites via attacker-controlled destination hostname; HIGH
  `GHSA-89xv-2m56-2m9x` SSRF in Server Actions on custom servers; HIGH `GHSA-m99w-x7hq-7vfj` DoS in
  Server Actions.
- MODERATE: two cache-confusion advisories on requests with bodies, unbounded Server Action payload
  on Edge, image-optimizer DoS via SVG, and unauthenticated disclosure of internal Server Function
  endpoints.
- Transitively: `postcss <=8.5.22` (build-time only) and `sharp <0.35.0` (libvips CVEs; relevant
  only where image optimization runs in our own runtime rather than Vercel's platform optimizer).

**Applicability must be argued per advisory, not assumed** — this app uses no Server Actions today,
which lowers several of them, but the proxy-bypass and rewrite-SSRF entries land on code we run.

**Recommended fix.** Bump to the latest `16.2.x` (>= 16.2.11): a patch-level move inside the stated
range. **Not** the `16.3.2` that `npm audit fix --force` suggests: a minor bump on a live payment
site is a separate decision with its own regression risk. Requires the full gate set plus RIA's
payment regression.

### F-03 · MEDIUM overall, HIGH on the payment page · No security headers

**Evidence.** Section 1.7. `next.config.ts` has no `headers()`.

**Impact.** Three separate things. (a) **Skimming**: nothing constrains what script may execute on
the page where a parent types their name, phone, and email, and where a payment begins. A CSP is the
one control a payment-security reviewer looks for here, and we have none. (b) **Clickjacking**: the
store can be framed by any site, so a hostile page can overlay the real checkout. (c) MIME sniffing
and referrer leakage, both cheap to close.

**Recommended fix, in the order it must happen.** A wrong CSP on a live checkout is precisely the
"took checkout offline" outcome this engagement must not cause, so: build the policy from the
inventory in 1.5 → ship `Content-Security-Policy-Report-Only` first → watch reports → only then
enforce. `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and
`frame-ancestors 'none'` for the store can go in ahead of the CSP, since none of them can break a
script.

Two known wrinkles to plan for: the **inline** bootstrap script in `layout.tsx` and Next's own
inline scripts mean the policy needs a nonce (set in `src/proxy.ts`) or hashes; and **SRI is not
available for `checkout.razorpay.com/v1/checkout.js`**, which Razorpay updates in place without
publishing hashes. Same for gtag and Ahrefs. That is an accepted limitation to be recorded, with
the CSP allowlist standing in for integrity pinning.

### F-04 · MEDIUM · Rate limiting does not bound abuse · ESCALATED, with a reason

`src/lib/store/rate-limit.ts` is an in-memory fixed window, and says so in its own comment: it is
per serverless instance, so a caller spread across cold starts exceeds it. What that costs us is
junk `preorders` rows carrying plausible PII and real Razorpay order objects, created for free.
Not a path to money loss. (Its **key** was separately broken and is fixed: F-14.)

**Not fixed in code, deliberately.** The obvious in-app fix is a Postgres counter, and it is the
wrong one here: this project's own open note says a trivial Supabase query takes 250 to 975ms,
because the project is not in an Indian region. Putting another round trip of that size in front of
`create-order` would add half a second to the moment a parent taps pay, on the one path where
latency costs real money, to slow down an abuser who has other options anyway. Upstash would avoid
the latency but means new infrastructure and a new secret, which is escalate-only regardless.

**The recommendation, for the founder:** a Vercel Firewall rate-limit rule on the three store POST
routes (`/api/preorder/create-order`, `/api/preorder/confirm`, `/api/preorder/address`), which is
the right layer, costs no latency, and sees every request rather than one instance's share. WAF
configuration is on the escalate list, so it is the founder's to set. Until then the in-app limiter
is what there is, and it is now at least keyed on something a caller cannot choose.

### F-05 · MEDIUM · The whole Razorpay event payload is stored forever

`webhook_events.payload jsonb` (`supabase/migrations/0001_preorders.sql:120`) keeps the complete
event. Razorpay events carry the payer's email and contact and card **metadata** (network, last4,
issuer). None of it is needed for idempotency, which only needs the event id. Storing it enlarges
the blast radius of any database exposure and works against DPDP minimisation. To be explicit:
**last4 and network are not PAN and storing them is permitted**; the point is that they are not
needed.

**Fixed for every new delivery** (`8df8977`): the claim row now stores an allow-listed summary, the
event type plus the ids and amounts from the payment, order and refund entities. An allow-list, so a
field Razorpay adds next year does not quietly start being kept. Razorpay retains the full event on
their side, which is where a forensic question should be asked from anyway.

**Still with the founder**, because it writes to the production database: existing rows keep their
full payloads. The statement is in the founder action list below.

### F-06 · LOW-MEDIUM · `markPaid` does not check the captured amount

`src/lib/store/fulfil.ts:33`. Not exploitable today: the order is created server-side with our
amount, Razorpay enforces the order amount, and `partial_payment` is not enabled. But that safety
currently rests on a gateway dashboard setting nobody is watching. One comparison plus an alert
turns it into a property of our data. Cheap insurance, with a test.

### F-07 · LOW · `/api/health` is public, unthrottled, and touches the database twice

It reports readiness, the offer mode, whether Razorpay is in live or test mode, whether email is
configured, DB latency, and on failure the **names** of missing env vars. All of that is deliberate
and documented, and the founder uses it from a phone. The residual risks are mild cost and latency
amplification (two Postgres counts per anonymous call) and operational fingerprinting. Fix: apply
the existing `rateLimit` to it and keep the payload as it is. The daily Vercel cron must keep
working.

### F-08 · LOW · `x-powered-by: Next.js`

Set `poweredByHeader: false` in `next.config.ts`.

### F-09 · LOW · HSTS lacks `includeSubDomains` and `preload`

`max-age=63072000` is present on both hosts. Adding `includeSubDomains` binds **every** subdomain of
kheelona.com to HTTPS in every browser that has seen the header, so it is a founder decision, not a
silent hardening. Recommended after confirming no subdomain ever needs plain HTTP.

### F-10 · LOW · JSON-LD injection hygiene

Eleven `dangerouslySetInnerHTML` sites (listed by `grep -rn dangerouslySetInnerHTML src/`) inject
`JSON.stringify(...)` into `<script type="application/ld+json">`. Every value today is a static
constant or our own content, so there is nothing to inject, but the standard defence, replacing every
`<` in the serialised JSON with its `<` escape so no value can close the script tag, costs
nothing and removes the whole class. Do it once in a shared helper.

### F-11 · INFO · ACCEPTED · The Ideabaaz page publishes its own tier signature

`src/app/store/ideabaaz/page.tsx` computes the event-link signature server-side and uses it itself,
which makes the signature public by design: the page is a URL handed out at a fest, which is the
same trust level as a photographed QR. Containment is the expiry (`2026-08-31`), the founder's manual
close, and the global 500-unit cap. Deliberate, documented as §8.25-g-i, and re-checked after 31
August rather than treated as a defect.

### F-12 · INFO · ESCALATED · DPDP notice gaps

`/privacy` is unusually good on processors and purpose, and it names Razorpay, Supabase, Resend and
Vercel plus all three measurement tools. Two things India's DPDP Act 2023 expects that it does not
currently state: a **retention period** (it says tax records are kept, without saying for how long)
and a designated **grievance contact** for data-principal requests. Wording is counsel's and the
founder's, never ours. Filed here so it is not lost.

---

## 4. Plan (VERA) — the order of work, and why

Money path first, then the surfaces around it, then hygiene. Each item is one fix, one paired test,
one commit on `security-hardening`, reviewed against GATE 2 before it goes into the founder's merge
queue.

1. **F-01** — the only finding with a real, already-happened exposure of customer data. Fix first.
2. **F-02** — a patch-level dependency bump that closes four HIGH advisories, one of which lands on
   the proxy layer this app's whole host split depends on. Early, because everything after it should
   be tested on the patched version.
3. **F-03** — headers. Safe subset first (`nosniff`, `Referrer-Policy`, `Permissions-Policy`,
   `frame-ancestors` for the store), then CSP in Report-Only, then enforcement as a separate,
   deliberate step.
4. **F-06** — the amount check, while attention is on the payment path.
5. **F-04**, **F-05**, **F-07** — abuse and retention.
6. **F-08**, **F-10** — hygiene, batched.
7. **F-09**, **F-12**, and the F-01 rotation question — escalations, tracked here until the founder
   decides.
8. **Sweep** (NADIA re-audit) then GATE 4 sign-off.

### Testing environment

Dynamic testing runs **local only** unless the founder provides otherwise: `npx next start -p 3456`
with `tools/qa/supabase-stub.mjs` for store pages that need a database row, reached over
`http://store.localhost:3456` (headless Chrome does not resolve bare `localhost`, and Lighthouse
hits an HSTS interstitial on the real hostname). The existing harness in `tools/qa/` gives axe and
voice sweeps over all 16 routes at 390 and 1280. The Vercel preview branch cannot exercise the store
host, so it is not a staging substitute.

**Anything that would touch the gateway needs Razorpay TEST keys**, which is an open question below.
Without them, payment-path verification stays at the unit and integration level (which is where the
existing 806 tests already live) and no live-gateway dynamic test runs at all.

---

## 5. Gate log

| gate | when | result |
|---|---|---|
| GATE 0 — discovery complete | 2026-08-23 | **PASS.** Architecture, money path, secrets locations and script inventory mapped (sections 1.1–1.7). No testing beyond read-only recon was performed. |
| GATE 1 — triage complete | 2026-08-23 | **PASS.** Twelve findings, each with severity, owner and a fix-or-escalate decision; order of work in section 4. |
| GATE 2 — F-01, the /thanks credential | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`84ae07e`). Paired test fails before / passes after, proven by reverting `host.ts` alone. 823/823, tsc 0, build 0, `qa:sweep` 34/34, and all three page states driven live against the local stub: 303 to a query-less `/thanks`, `Secure; HttpOnly; SameSite=lax; Path=/thanks`, `private, no-store`. |
| GATE 2 — F-02, the Next patch | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`120271f`). 826/826, tsc 0, build 0, `qa:sweep` 34/34, host routing and the F-01 claim re-driven on 16.2.12. `npm audit` no longer reports any advisory in `next` itself. |
| GATE 2 — F-03, the headers | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`02e1f2a`). 844/844, tsc 0, build 0, `qa:sweep` 34/34. All 16 routes loaded in a real browser produce **zero** resource violations under the policy; the only console line is Chrome noting `upgrade-insecure-requests` is inert in report-only mode. Collector round-tripped a report and stripped the query string from the logged URL. |
| GATE 2 — F-06, the amount guard | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`5a668f0`). 854/854, tsc 0, build 0. Four of the seven new `fulfil.test.ts` cases fail before the change. |
| GATE 2 — F-07, the health throttle | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`2c2c210`). 863/863, tsc 0, build 0, and the throttle driven live: twenty 200s then 429, with no further database calls once it trips. |
| GATE 2 — F-10, JSON-LD escaping | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`86818a3`). 863/863, tsc 0, build 0. Both `ld+json` blocks on a real `/products/lumi` response still parse and contain no bare angle bracket. |
| GATE 2 — F-14, the rate-limit key | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`36d3836`). 872/872, tsc 0, build 0. Four of eight new cases fail before the change. |
| GATE 2 — F-05, the payload summary | 2026-08-23 | **PASS → APPROVED-FOR-MERGE** (`8df8977`). 872/872, tsc 0, build 0. A delivery carrying an email, a phone and a full card block is stored with its ids and amount and none of those five values. |
| GATE 2 — the payment probe | 2026-08-23 | **PASS** (`d969005`). `npm run qa:payment` clean: the sandbox order is created, Razorpay's sheet opens, **zero policy violations**, a signed webhook is accepted and a forged one refused. Control run done first: with Razorpay removed from `script-src` the probe failed and named both blocked scripts, so the assertion is not vacuous. |
| GATE 3 — post-deploy verify | 2026-08-23 | **PASS.** Founder approved section 5a and asked for the merge; merged as `b7be77e` (`--no-ff`, so one revertable commit), rollback tag **`pre-security-hardening-2026-08-23` = `05872e0`** cut BEFORE the merge. Gates re-run on the merge result: 872/872 (exit 0), tsc 0, build 0. Live within ~60s. Verified read-only on production, no real order touched: all six headers present on both hosts and `x-powered-by` gone; a **synthetic** tokened `/thanks` URL answers `303` to a query-less `/thanks` with `Secure; HttpOnly; SameSite=lax; Path=/thanks; Max-Age=7200` and `private, no-store`; a bare `/thanks` renders "We need your link again" at 200 rather than a 404; `/api/health` still `ok:true, store:"ready", preorder:"token"` for the cron; all 12 marketing routes and all 3 store routes 200; the live store screenshotted at 390 with the form, the CTA and the whole ₹499 / ₹4,500 / ₹4,999 story intact. `demo-website` synced by merging main in. |
| GATE 3 — the rotation | 2026-08-23 | **PASS.** Founder rotated `STORE_SIGNING_SECRET` and redeployed. Health `ready` on both hosts, nothing else clobbered, the build serving normally. Decisive proof: the `Add it here` link in `KH-YPJ8-GHVT`'s acknowledgement email, whose token was minted under the OLD secret, now lands on "We need your link again". F-01 CLOSED, including the tokens already sitting in the analytics properties. |
| GATE 4 — engagement sign-off | — | **No CRITICAL or HIGH open, and both HIGHs are now fully closed.** Everything remaining is either the founder's (F-04, F-09, F-12, the payload prune) or the CSP's second, deliberate step. |

### NADIA's re-audit of the fixes themselves (2026-08-23)

Every change was re-read for new surface, because a fix that opens something is the worst outcome
of an engagement like this.

- **New public endpoint**, `/api/csp-report`: unauthenticated POST by necessity. Bounded at 30 a
  minute per caller, body capped, no database access, three allow-listed fields logged with control
  characters stripped and query strings removed. It cannot cost us anything.
- **New cookie**, `kh_order`: HttpOnly, Secure off only on a literal localhost host, SameSite=Lax,
  scoped to `/thanks`, two hours. It carries a credential the browser already had. Its redirect is
  303 with `private, no-store`, so no cache can hand one customer's cookie to another.
- **`clientKey` now prefers `x-real-ip`**, which the platform sets. Worth stating plainly: on a
  deployment where no proxy sets that header, a client could send it. This app is served by Vercel,
  which does, and the fallback chain is safe in either case.
- **The JSON-LD change alters output on ten pages**: verified by parsing the real responses, not by
  reading the diff.
- **The writable Supabase stub is local tooling only**, off unless `STUB_WRITABLE=1`, and cannot
  reach a real database: its URL is the loopback address.
- **`.env.local` holding the test keys is gitignored** and confirmed absent from `git status` after
  every commit in this branch.

Baseline before any change: `npm test` was green at 806/806 on `main@05872e0`. The count rises with
each fix's paired tests; per the standing trap, it is only honest with new files staged.

**Not yet covered by any automated regression, and known:** an end-to-end sandbox payment run. The
existing money-path tests (137 across 12 files) are unit and integration level. With the founder's
test keys now available, building that run is RIA's next piece of work, and it is also the only way
to confirm the CSP does not disturb the Razorpay checkout sheet before the policy starts enforcing.

---

## 5a. What the founder has to do (nothing here may be auto-executed)

In the order it matters. Nothing on this list is something I may do: each one is a secret, a
production database write, hosting configuration, or legal wording.

1. ~~**Merge `security-hardening` into `main`.**~~ **DONE 2026-08-23**, founder-approved after
   reviewing this section: merge `b7be77e`, live in about a minute, GATE 3 passed (see the gate log).
   Rollback: `git revert -m 1 b7be77e`, or the tag `pre-security-hardening-2026-08-23`.
2. ~~**Rotate `STORE_SIGNING_SECRET`**~~ **DONE AND CONFIRMED 2026-08-23.** The founder rotated the
   value and redeployed. Verified from outside: health `ready` on both hosts with `razorpay:"live"`
   and `email:"configured"`, so no neighbouring variable was clobbered, and the redeployed build
   serves the proxy claim, all 15 routes, all six headers and a working order form.
   **The decisive test passed too, and only the founder could run it:** the `Add it here` link in the
   acknowledgement email for `KH-YPJ8-GHVT` (2026-08-22, the ₹499 proof order) now lands on
   "We need your link again". That link's token was minted under the OLD secret, so its death is
   proof the running deployment is using the new one. **F-01 is therefore fully closed:** the tokens
   sitting in GA4 and Ahrefs from before the fix are now inert, not merely unreachable.
   This is what makes F-01 fully closed rather than merely stopped: the address tokens already sent
   to GA4 stay valid for their thirty days otherwise. **What it breaks, so it is not a surprise:**
   every `/thanks` link already emailed stops working, and any printed event QR carrying a `sig=`
   stops working. The Ideabaaz page is unaffected, because it signs its own tier per request. With
   the store one day old this costs almost nothing; in a month it will not be cheap.
3. ~~**Prune the old webhook payloads**~~ **DONE 2026-08-23.** Founder ran it in the Supabase SQL
   editor; `select count(*) from public.webhook_events where payload ? 'payload'` now returns **0**,
   so no row holds a full Razorpay event any more. F-05 is fully closed: new rows are summaries by
   code, old rows are pruned. The statement, kept for reference and safe to re-run:
   ```sql
   update public.webhook_events
      set payload = jsonb_build_object('event', event_type, 'pruned', true)
    where payload is not null
      and payload ? 'payload';
   ```
   (The `payload ? 'payload'` test matches only the old full-event shape, so re-running it is safe.)
4. **Decide on a Vercel Firewall rate-limit rule** for the three store POST routes (F-04). This is
   the real fix for abuse bounding, and it is at your layer, not in the code.
5. **Decide on HSTS `includeSubDomains`** (F-09). It binds every subdomain of kheelona.com to HTTPS
   in every browser that has seen the header. Say yes and I will add it to the header block; say no
   and I will record why.
6. **Counsel, when convenient** (F-12): `/privacy` states no retention period and designates no
   grievance contact, both of which India's DPDP Act expects. Wording is yours and counsel's.
7. **GA4, your call:** the property holds page URLs containing address tokens from before this fix.
   After the rotation in step 2 they are inert. If you would rather they were gone, that is a
   retention or deletion action in the GA4 admin, and it is yours to take.
8. **Come back to me in a few days** for the CSP's second half. Once real traffic has run under
   Report-Only, I read the reports (they land in the Vercel logs as `[csp] blocked=… directive=…`)
   and flip the policy to enforcing as one small commit. Enforcing without reading them first is the
   one way this work could break your checkout.

## 5b. How to rotate `STORE_SIGNING_SECRET` (step 2 above)

**Why this and not just the code fix.** The code fix stopped new tokens reaching the analytics
tools. It cannot reach back into GA4 and Ahrefs, where page URLs containing address tokens from
before today already sit. Those tokens stay valid for thirty days from when each was minted, and
each one opens one order's confirmation and can change its delivery address. Rotating the secret is
what makes them all worthless in one step, because every token is an HMAC under it.

**One value, two uses** (`src/lib/store/signing.ts`): address tokens and event-link signatures.
Both die on rotation. That is the whole cost, and it is spelled out below.

### The five steps

1. **Generate a new value, locally, and never paste it back into this chat or into any file in the
   repo.** In this session, prefix with `!` to run it here, or use any terminal:

   ```
   openssl rand -base64 48
   ```

   Any long random string is fine. It is never typed by a human again, so length costs nothing.

2. **Replace it in Vercel.** Project → **Settings** → **Environment Variables** → find
   `STORE_SIGNING_SECRET` → Edit → paste the new value → Save. Keep it on the same environments it
   is on today (Production at minimum). It must NOT be renamed and must never gain a
   `NEXT_PUBLIC_` prefix; `test/store-secrets.test.ts` fails the build if that ever happens.

3. **Redeploy, or nothing changes.** This is the step that gets skipped: on Vercel an environment
   variable is applied when a deployment is created, so editing it does not affect the running
   deployment. Go to **Deployments**, find the current Production one, open the **⋯** menu and choose
   **Redeploy**. Build cache on or off makes no difference here.

4. **Check it took.** `curl -s https://kheelona.com/api/health` should still answer
   `{"ok":true,"store":"ready",…}`. That proves all six secrets are present and none is a
   placeholder. If it says `not-configured`, it will name exactly which variable is missing.

5. **Tell me it is done** and I will re-verify the live behaviour: a `/thanks` link minted under the
   old secret must now land on "We need your link again", and a freshly minted one must work.

### What breaks the moment you redeploy, and what does not

| | |
|---|---|
| **Breaks** | Every `/thanks` link already emailed. A parent clicking one sees "We need your link again", which offers WhatsApp. |
| **Breaks** | Any printed event QR carrying a `sig=`. **None exists today:** the Ideabaaz tier row is not inserted yet and `blr-oct-expo` is only a local QA fixture. |
| **Safe** | The Ideabaaz page. It signs its own tier server-side on every request, so it re-signs under the new secret automatically. |
| **Safe** | Payments, orders, receipts, refunds, the webhook, the dispatch queue. None of them touch this secret. |
| **Safe** | Addresses already saved. This is about the link, not the data. |

**Cost today: as close to nothing as it will ever be.** The store is one day old and its only real
order was the ₹499 proof, which was refunded. Every week from here adds orders whose links would
break, so this is the cheap moment.

**If a real customer is ever stranded by it:** the flow already handles that in words a parent can
act on. Both the confirmation page and the acknowledgement email say to message WhatsApp, and
support adds the address by hand. There is no tool today for re-minting a single address link; say
the word and I will add `npm run address-link -- KH-XXXX-XXXX` for the day it is needed.

## 6. Open questions for the founder

Answers change the work, so they are asked rather than guessed. Four are being put to the founder
now; the rest are recorded so they are not lost.

**Answered already, from the repository, with evidence — flagged for confirmation only:**

1. **Gateway**: Razorpay. Checkout is **ours** for the details form, **Razorpay's** for the payment
   itself (their `checkout.js` modal). Live keys are in production (`/api/health` says
   `razorpay:"live"`).
2. **Card data**: never touched. Card, UPI and bank details go to Razorpay's own surface; we hold a
   payment id and an amount. PCI scope is therefore the minimum, and the controls that matter are
   the ones around the page, which is why F-03 is rated as it is.
3. **Backend and database**: yes, Next route handlers plus Supabase Postgres.
4. **Accounts**: none. Guest checkout, with a signed token standing in for authentication.
5. **Branch and merges**: `security-hardening`, founder merges. Note the trade-off that
   `security-review.md` lives on this branch, so a session working on `main` will not see it until
   the branch merges.
6. **Known history**: three defects found after launch, each by looking at a real artefact, all
   fixed (a receipt greeting "shweta"; a refunded order left in the dispatch queue; an orphaned
   payment with no recovery path). No prior pentest.

**Being asked now:** Razorpay TEST keys and where dynamic tests may run; CSP rollout appetite;
whether to rotate `STORE_SIGNING_SECRET` after F-01; how far the F-02 dependency bump should go.

**Still open, non-blocking:**

- Who owns DNS for kheelona.com, and is Vercel's WAF / Firewall enabled on the project (and on which
  plan)? Needed so F-09 and any future rate-limit-at-the-edge recommendation reach the right place.
- Is there any GA4 data-retention or deletion step the founder wants to take for the tokens already
  collected (a founder-side action in the GA4 admin; see F-01)?
- Does the founder want a `.well-known/security.txt` published, now that the site takes money?
