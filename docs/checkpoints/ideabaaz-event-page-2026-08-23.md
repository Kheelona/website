# Checkpoint: the Ideabaaz partner page (2026-08-23, same day as the v3 migration)

**What shipped:** `store.kheelona.com/ideabaaz` — the first PUBLIC event tier (§8.25-g-i). The
Ideabaaz Startup Fest audience (26–30 Aug 2026, Bharat Mandapam, New Delhi) books Lumi for **₹99
instead of ₹499**, rendered as the struck-through ₹499 beside ₹99 with the fest's logo chip, on a
page that otherwise mirrors the regular store. The URL is shared by hand at the fest and linked
from nowhere; the store host is noindex besides.

## The founder's four decisions (this session)

1. **Last day 31 Aug 2026**, manual close, with `expires_on='2026-08-31'` as the backstop (dies
   ~05:30 IST on 1 Sep by the UTC-date comparison in `resolveTier`).
2. **A ₹99 booking owes ₹4,900** — the total stays ₹4,999. The discount is on the booking amount,
   never the price.
3. **No per-event cap** — containment is the close date plus the global 500.
4. Co-branding: the **on-black fest logo as its own chip** (same lockup as the social posts) +
   "Exclusive for the Ideabaaz audience". Page deliberately unlinked from everywhere.

## How it works (nothing new in the money path)

The route signs its own tier server-side (`sign(secret, "event-link", "ideabaaz")`) and feeds the
existing `resolveTier` → `PreorderForm` → `create-order` pipeline. §8.25-c-i intact: the page can
only change sentences. What is deliberately surrendered is unguessability — a public URL is a QR
already forwarded — so the tier's expiry and the founder's close carry the containment (§8.25-g-i).
Paid Ideabaaz orders count toward the 500 (§8.26-f).

## The derived balance (the general fix that came with it)

The copy machinery used to tell every token order "₹4,500 due, of the ₹4,999 price" — for a ₹99
token that arithmetic promises a ₹4,599 total nobody offered. Now every balance a customer reads
derives from what THEIR order paid (`LAUNCH_AMOUNT_PAISE - amount_paise`): `OrderSummary` and
`PreorderForm` take a server-computed `balanceLabel` (default unchanged), and the ack email plus
the thanks page derive from the order row. ₹499 orders still read ₹4,500 to the byte, pinned by
test. `docs/preorder-events.md`'s "₹4,500 deliberate" paragraph was rewritten — it is superseded.

## Files

New: `src/app/store/ideabaaz/page.tsx` (+ colocated test), `public/partners/ideabaaz-startup-fest.png`,
`tools/qa/supabase-stub.mjs` (local happy-path QA; a DUMMY env can only show the not-open state).
Touched: `OrderSummary.tsx`, `PreorderForm.tsx`, `templates.ts`, `store/thanks/page.tsx`,
`store/e/[event]/page.tsx` (all for the derived balance), `tools/qa/sweep.mjs` (route added, now
16×2), tests beside each. Laws: §8.25-g-i in `website-steps.md`; runbook section in
`preorder-events.md`; two dated founder items in `FOUNDER-TODO.md`.

## QA evidence (2026-08-23)

806/806 tests, tsc clean, build green (token gate ok), `qa:sweep` clean 32/32 on the DUMMY env.
(806, not the 804 a pre-staging run shows: the per-source-file sweep tests count files via
`git ls-files`, so the suite is only honest with new files staged — a small trap worth knowing.)
Against the stub: `qa:text` shows the full coherent money story (₹99 / ₹4,900 / ₹4,999, zero
₹4,500), axe 0 violations at 1280, full-page shots at 390 + 1280 reviewed. Ended state exercised
by killing the stub; not-open state covered by the sweep.

## Deployed and production-verified (same day, commit `afc9a05` on both branches)

Vercel picked the push up in under a minute. Verified live: `/api/health` green
(`preorder:"token"`, razorpay live, email configured), and
https://store.kheelona.com/ideabaaz serving HTTP 200 with the ended state — which is CORRECT
until the founder inserts the tier row (the founder confirmed the same view from their own
browser). The page reads the row per request (`force-dynamic`), so the ₹99 offer appears on
refresh the moment the INSERT runs, no deploy involved. Production re-verification of the live
offer state happens after that insert.

## Known characteristic, accepted

A transient Supabase failure renders the same "has ended" words as a real close (resolveTier
collapses row-missing and query-error into `unknown`, exactly as the signed `/e/[event]` page
always has). The refusal offers the regular price and WhatsApp, so nobody is stranded; fixing it
would mean changing `resolveTier`'s contract on the live payment path for a rare blip. Left alone
on purpose.

## Still with the founder (dated rows in FOUNDER-TODO)

Insert the tier row before 26 Aug (page shows "has ended" until then); close it on 31 Aug
(expiry backstops); optionally prove the event-tier flavour with one real ₹99 booking + refund
before the fest — that variant has never taken live money.
