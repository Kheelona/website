# Store go-live runbook

**Read this the moment the founder says the dashboards are done.** It is written so a session with no
memory of building the store can take it from "keys exist" to "first real order landed" without
guessing. Every command is copy-pasteable and every check has a stated pass condition.

Current state: branch **`preorder-store`**, built and verified against test-shaped values, pushed to
GitHub, **not merged, not live**. The marketing site on kheelona.com is unaffected until step 5.

**DONE 2026-08-22:** `store.kheelona.com` is in DNS and added to the Vercel `website` project
(Production, Valid Configuration), and it answers **200**. Until the merge it serves the marketing home
page, because `main` has no `proxy.ts` yet — which is fine, and is what Razorpay's liveness check needs.

**A LOCAL-RESOLVER TRAP, so nobody re-diagnoses it:** `dig +short store.kheelona.com` returns the
record while `curl https://store.kheelona.com/` fails with `000` and `getaddrinfo` throws. That is this
machine's resolver being stale, NOT the domain being down. Confirm with the IP forced:

```
curl -sI --resolve store.kheelona.com:443:216.198.79.65 https://store.kheelona.com/
```

A 200 there means the host is live for the rest of the world.

**⚠ THE MERGE IS GATED ON THE KEYS BEING IN VERCEL, not on DNS.** With the domain live but no Razorpay
or Supabase values set, merging would replace today's working free-list form with the store's honest
"pre-orders open here shortly" state, so every CTA would reach a page that cannot take an order. That is
a downgrade for as long as it lasts. Order: keys into Vercel first, then merge, then the store works
from the first second.

**⚠ VERCEL PLAN.** The project is on **Hobby**. The daily `/api/health` cron fits Hobby's limits, but
Vercel's fair-use terms reserve Hobby for non-commercial projects, and this is about to take payments.
Worth moving to Pro before real orders arrive rather than after a suspension.

---

## ⚑ WHERE THIS ACTUALLY GOT TO (2026-08-22, ~22:30)

**THE STORE IS LIVE ON kheelona.com AND store.kheelona.com, ON LIVE RAZORPAY KEYS.** Merged to main,
deployed, and `/api/health` returns:

```
{"ok":true,"store":"ready","razorpay":"live","email":"missing","dbMs":248-718}
```

### Verified against production, by driving it

| Check | Result |
| --- | --- |
| All six env vars readable | ✅ `store: ready` |
| Razorpay mode | ⚠️ **`live`** — any payment from here is real money |
| Supabase write + live Razorpay API auth | ✅ create-order returned `KH-8FP8-PWDA` / `order_TStGXH3YHKnudP` |
| Amount decided server-side | ✅ 49900 paise, from our tier table |
| Signed address token issued | ✅ |
| Server-side validation | ✅ 422 with all five field messages |
| Webhook rejects a bad signature | ✅ 400, nothing written |
| store.kheelona.com serves the store | ✅ `x-matched-path: /store`, `noindex` |
| Marketing site on the paid copy | ✅ "first 500 units" and "No payment now" gone |
| /refund /shipping /terms /privacy | ✅ all 200 |

### ✅ FULLY VERIFIED WITH A REAL PAYMENT (2026-08-22, 23:29 IST)

A real ₹499 pre-order was placed by a colleague on live keys, order **KH-YPJ8-GHVT** /
`pay_TSuFkByRtMghiM` / `order_TSuFQjjtUuQaeP`, paid by UPI, then refunded. **Every part of the payment
path is now proven, not inferred:**

| Proof | Evidence |
| --- | --- |
| Card/UPI flow completes | ₹499 Captured in Razorpay |
| **Webhook secret matches** | all three deliveries returned **200** (a mismatch is a 400) |
| **Idempotency works under the real race** | `payment.captured` 23:29:01 and `order.paid` 23:29:02 both arrived; the first marked it paid and emailed, the second found no unpaid row and returned 200 with **no second email**. Exactly one receipt reached the customer. |
| Non-payment events ignored safely | `payment.authorized` recorded, acted on by nothing, 200 |
| Receipt email correct | order ref, ₹499 paid, ₹4,500 of ₹4,999, ships 1 October 2026, refund promise, Kheelona+, full seller block with GSTIN, "messages, not calls". From `hello@send.kheelona.com`, replies to `hello@kheelona.com` |
| Internal alert email | arrived |
| Razorpay fees | **₹0.00** — UPI is zero-MDR in India, so verification cost nothing |

**Two things this transaction taught, both now fixed or noted:**

1. **The greeting used the name verbatim**, so the first real receipt opened "Thank you, shweta." Fixed:
   the first letter is capitalised and the rest left as typed, because title-casing mangles d'Souza and
   van der Berg. Only reading the actual sent PDF found this — every test passed and the data was right.
2. **The refund was issued at ₹489, not ₹499.** Fees were ₹0.00 so a full refund cost nothing, and both
   the receipt and `/refund` promise "in full, no fee, no deduction". It was the founder's own account so
   the ₹10 is moot here, but **a partial refund on a real customer would contradict published policy.**
   Refund the full token amount, always.

### Still not covered by that test

- **The address step from the email link.** The test order never added a delivery address, so the signed
  `/thanks?ref=…&t=…` path from a real email is still unexercised. The link in that receipt is live and
  valid for 30 days if you want to prove it.
- **The balance run.** Collecting ₹4,500 by payment link before dispatch is a manual process with no
  tooling. `balance_status` on every row tracks it: `due` → `link_sent` → `paid`.

### Clean up this test row

```sql
delete from preorders where order_ref = 'KH-8FP8-PWDA';
-- or: delete from preorders where email = 'zz-test-delete-me@kheelona.com';
```

It is `status = 'created'`, so it would otherwise sit in the abandoned-payment list and be mistaken for
a real lead.

### The recommended next move

Add `RESEND_API_KEY` first, then place **one real pre-order yourself with your own card** and check the
five rows in step 4's table, then refund it from the Razorpay dashboard. That single transaction proves
the card flow, the webhook secret, and both emails at once, and it costs about ₹12 in gateway fees
Razorpay does not return on a refund.

---

## Step 0 — where the values go

Nine variables. Six are required; three are optional and the store works without them.

| Variable | Required | From |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | yes | Razorpay → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | yes | same, shown once at generation |
| `RAZORPAY_WEBHOOK_SECRET` | yes | Razorpay → Settings → Webhooks, whatever secret you type there |
| `SUPABASE_URL` | yes | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | same page, the **service_role** key |
| `STORE_SIGNING_SECRET` | yes | `openssl rand -base64 48` |
| `RESEND_API_KEY` | no | Resend → API Keys |
| `EMAIL_FROM` | no | defaults to `Kheelona <hello@send.kheelona.com>` |
| `ORDER_ALERT_EMAIL` | no | defaults to `hello@kheelona.com` |

They go in **two** places, and both matter:

- **Vercel** → the project → Settings → Environment Variables, for the deployed site. Founder-only:
  never run the Vercel CLI (standing rule).
- **local `.env`** (gitignored), so the steps below can be verified before anything is deployed. Use
  the **test** Razorpay keys locally, always.

Sanity check before going further:

```
npm test                 # expect 610 passed
npx tsc --noEmit         # expect silence
npx next build           # expect "Compiled successfully"
```

---

## Step 1 — create the database

Supabase → SQL editor → paste **all** of `supabase/migrations/0001_preorders.sql` → Run.

Verify, in the same editor:

```sql
select table_name from information_schema.tables
where table_schema = 'public' order by 1;
-- expect exactly: event_tiers, preorders, webhook_events

select relname, relrowsecurity from pg_class
where relname in ('preorders','webhook_events','event_tiers');
-- expect relrowsecurity = true on all three
```

**RLS on with zero policies is correct, not a mistake.** Only the service-role key reads these tables;
if a policy ever appears here, someone has opened a door that was deliberately shut (§8.25 preamble).

---

## Step 2 — point the webhook somewhere reachable

Razorpay → Settings → Webhooks → Add.

- While testing, before the domain exists:
  `https://website-hdn2.vercel.app/api/razorpay/webhook`
- Once `store.kheelona.com` resolves:
  `https://store.kheelona.com/api/razorpay/webhook`

Either works, because the proxy's matcher deliberately excludes `/api`, so the handler answers on any
host. Subscribe to **`order.paid`** and **`payment.captured`**, and set the secret to the same value as
`RAZORPAY_WEBHOOK_SECRET`.

---

## Step 3 — verify locally, before any deploy

```
npx next build && npx next start -p 3456      # lsof -iTCP:3456 first
```

```
curl -s localhost:3456/api/health
```

**Pass:** `{"ok":true,"store":"ready","razorpay":"test","email":"configured"|"missing","dbMs":<n>}`

- `"store":"not-configured"` → a required variable is missing or still says DUMMY.
- `"store":"database-unreachable"` → the URL or the service key is wrong, or the migration never ran.
- `"razorpay":"live"` on a local run → **stop**: you are about to test with real money.

Then the store page itself:

```
curl -s -H "Host: store.kheelona.com" localhost:3456/ | grep -c "Pay ₹499 and reserve"
```

**Pass:** `1`. If it prints 0 and the page says "pre-orders open here shortly", the keys are not being
read.

---

## Step 4 — the test payment, end to end

**This has never been run. It is the one gate that cannot be skipped.** It needs a deployed URL,
because a webhook cannot reach localhost.

1. Push the branch and let Vercel build the preview (`website-hdn2.vercel.app`). Confirm the preview's
   environment has the **test** keys.
2. Open the preview's store page. Locally that is `http://store.localhost:3456`; on the preview, the
   store host is not mapped yet, so use the internal path `…vercel.app/store`, which is the same page
   (the apex 308 to the store host only applies once the domain exists).
3. Fill the form with a real email you can read. Submit.
4. Pay with Razorpay's test instruments. Confirm the current list in the dashboard's own test-mode
   docs before relying on these:
   - card `4111 1111 1111 1111`, any future expiry, any CVV
   - or UPI ID `success@razorpay`
5. **Check all five, in order:**

| Check | Pass condition |
| --- | --- |
| The browser lands on `/thanks` | Heading reads "Your Lumi is reserved." (not "We are confirming it now") |
| The database | `select order_ref, status, amount_paise, rzp_payment_id from preorders order by id desc limit 1;` → `status = 'paid'`, `amount_paise = 49900` |
| The parent's email | Arrives, names the order reference, says ₹4,500 on dispatch and 1 October 2026, carries the address link |
| The internal alert | Arrives at `ORDER_ALERT_EMAIL` with the number and the address flag |
| The address step | Saving it returns "We have your address." and `select address from preorders …` is populated |

If `/thanks` says "We are confirming it now" and stays that way, the webhook is not arriving: check the
Razorpay dashboard's webhook delivery log for the response code. A 400 means the secret does not match.

### The two proofs that matter more than the happy path

Razorpay's dashboard can re-deliver a webhook. Do both:

- **Idempotency.** Re-deliver the same event. **Pass:** the response is 200, `paid_at` does not change,
  and **no second email arrives**. This is the guard that stops a parent being emailed twice.
- **Tamper.** From a terminal, POST the same body with a wrong signature:

  ```
  curl -i -X POST https://website-hdn2.vercel.app/api/razorpay/webhook \
    -H "x-razorpay-signature: deadbeef" -H "x-razorpay-event-id: manual-1" \
    -d '{"event":"order.paid"}'
  ```

  **Pass:** `HTTP/2 400` and nothing written to either table.

### Then clean up

```sql
delete from preorders where email = '<the address you tested with>';
delete from webhook_events where order_ref is null or id like 'manual%';
```

Test rows in a table the founder will read as demand data are worse than no test at all.

---

## Step 5 — merge, tag, deploy

```
git checkout main
git tag v6-live-2026-08-22            # rollback point: the last pre-store commit
git merge --no-ff preorder-store
git push origin main --tags
```

The tag is the rollback point and it is created **before** the merge, on the commit that is currently
live. Do not skip it.

Then in Vercel: add **`store.kheelona.com`** as a domain on the existing project (not a new project),
and add the DNS record it asks for. One project serves both hosts, by design.

---

## Step 6 — smoke the live site

```
curl -sI https://store.kheelona.com/            # 200, x-robots-tag: noindex
curl -sI https://kheelona.com/store             # 308 → https://store.kheelona.com/
curl -s  https://kheelona.com/api/health        # {"ok":true,...,"razorpay":"live"}
curl -sI https://kheelona.com/refund            # 200, not a redirect to /terms
curl -sI https://kheelona.com/shipping          # 200
curl -s  https://kheelona.com/ | grep -c "store.kheelona.com"
```

That last one counts links in the HTML **source**, which includes the RSC payload, so it will read more
than one. To count what a reader can actually click:

```
node tools/qa/text.mjs https://kheelona.com/ | grep -c "https://store.kheelona.com"
```

**Pass:** exactly 1, the finale button (§8.25-b).

Then the full sweep against production:

```
SWEEP_BASE=https://kheelona.com SWEEP_STORE=https://store.kheelona.com node tools/qa/sweep.mjs
```

**Pass:** "clean: axe and voice, every route, both widths".

Finally, switch Razorpay to **live** keys in Vercel, redeploy, and confirm
`/api/health` reports `"razorpay":"live"`. Nothing before this point should have used a live key.

---

## Step 7 — watch the first real order

Sit with the first one rather than trusting it:

- the row appears with `status='paid'` and the right amount
- both emails arrive
- the address lands
- the Razorpay dashboard shows the payment captured

Then check the abandoned list, which is the flow's deliberate by-product:

```sql
select count(*) from preorders where status = 'created';
```

Those are people who filled the form and did not pay, **with a working phone and email**. Following
them up on WhatsApp is probably the highest-value hour available after launch, and nothing automated
does it yet.

---

## If it goes wrong

**The store is broken but the site is fine.** Remove `RAZORPAY_KEY_ID` in Vercel and redeploy: the
store returns to "pre-orders open here shortly" and takes no money, while every marketing page keeps
working. That is the fastest safe stop and it needs no code change.

**The site itself is wrong.** Roll back to the tag:

```
git revert --no-commit -m 1 <merge-commit>
git commit -m "Roll back the store merge"
git push origin main
```

**A payment was taken that should not have been.** Refund it from the Razorpay dashboard, then set the
row to `status='refunded'` so the queue and any future count stay honest.

---

## Still open after all of this

- **The post-dispatch returns and warranty terms do not exist.** `/refund` says so honestly. They must
  be written before the first Lumi is dispatched, not before the store opens.
- **No admin view**, by the founder's choice: orders are read in the Supabase dashboard and from the
  alert emails. Right for the first weeks; wrong the moment two people handle dispatch.
- **Nothing chases an abandoned payment.** See step 7.
- **The balance run** (₹4,500 by payment link before dispatch) is a manual process with no tooling
  yet. `balance_status` exists on every row to track it: `due` → `link_sent` → `paid`.
