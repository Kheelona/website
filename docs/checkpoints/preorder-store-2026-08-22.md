# Checkpoint: paid pre-orders and the store (2026-08-22)

Branch `preorder-store`, four commits, **not merged and not live**. The marketing site on
kheelona.com is untouched in production until this branch merges.

## What changed, in one paragraph

The pre-order stopped being a free list. A parent now pays a **₹499 refundable token** that holds a
Lumi at **₹4,999**, with the **₹4,500 balance** due by a payment link before dispatch, taken through
**Razorpay** on **store.kheelona.com**, which is this same repo served through a host rewrite. Orders
live in **Supabase**, the confirmation email goes out through **Resend**, and events sell the same
reservation at ₹99 behind a signed QR link with a cap and an expiry.

## The decisions, and who made them

Every one of these is the founder's, taken in the brainstorm on 2026-08-22. They are recorded here
because re-litigating them later would waste a round.

| Decision | Answer |
| --- | --- |
| What the ₹499 is | A token adjusted against ₹4,999, **fully refundable until dispatch** |
| Where the store lives | **store.kheelona.com**, one repo, one Vercel project, host rewrite |
| Razorpay surface | Standard Checkout, server-created orders, HMAC-verified webhook |
| The free Tally list | **Retired.** Paid replaces it on every page |
| Ship date | Moved to **1 October 2026** (was 1 September) |
| Flow order | Contact details → pay → delivery address |
| Event pricing | ₹99 behind a **signed QR link**, with a cap and an expiry |
| Email | **Resend**, from `send.kheelona.com` |
| Policies | Canonical on kheelona.com; **real** `/refund` and `/shipping` |
| Support | **WhatsApp only**, +91 91875 46483, and every label says so |
| Urgency | **No unit cap.** ₹4,999 until **30 September 2026**, ₹9,999 after |
| After the deadline | The store offers the general-sale waitlist, by WhatsApp |
| Balance | Payment link before dispatch. Never automatic, no card on file |
| Data | Supabase; no Sheet mirror and no admin UI yet |
| Form fields | Bare essentials: name, WhatsApp, email, child's age |
| Refunds | By WhatsApp or email, manual, 5 to 7 working days |
| CTA | **"Pre-order Lumi"**, no number on the button |
| Rollout | Test keys → founder walks the flow → live-key flip |

Seller of record, founder-supplied from the GST certificate: **Kheelona Robotics Private Limited**,
GSTIN **29AAMCK1530E1ZN**, 5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th
Main, 5th Block Jayanagar, Bengaluru Urban, Karnataka 560041. This is the first phone number this site
has ever published; the one on the legacy Wix site was the canonical fake Indian number and was
deliberately never carried over.

## The four commits

1. **The promise.** Money gets one source in paise and every rupee string derives from it. "No payment
   now" and "first 500 units" leave every surface, including both machine routes and the Product
   schema. `PREORDER_OFFER_LINE` replaces `CAP_LINE` in the same slots. One CTA label,
   `PREORDER_LABEL`. `FinaleCTA` stops holding a form and starts handing over to the store, and its
   reassurance cards change, because "No payment today" was the strongest card there and is now false.
   `TallyEmbed` retires with its measured-iframe law.
2. **The policy layer.** `/refund` and `/shipping` become real pages and their 301s come out of
   `next.config.ts`. `/terms` is rewritten from a description of a free list into a contract.
   `/privacy` is rewritten around the payment stack. The seller of record is one shared section.
3. **The store.** `src/proxy.ts`, four API routes, the Supabase schema, the tier table, the signing
   layer, the email templates, three new form atoms, and the `features/preorder` feature.
4. **Chrome separation.** The `(site)` route group, `SiteChrome`, and a catch-all inside `/store`.

## Three things verification caught that reasoning had not

1. **The store inherited the marketing navbar**, including a "Pre-order Lumi" CTA pointing at
   `#reserve`, an anchor the store host has no page for. A dead CTA on the one page that takes money.
   Visible in the first screenshot; invisible in every test that passed at the time.
2. **An unmatched URL on the store host** was rewritten to `/store/<path>`, matched nothing, and fell
   back to the ROOT not-found, serving the store's 404 wearing marketing chrome. Someone unable to
   reach an order they had paid for was being shown the marketing navigation.
3. **`test/preorder-copy.test.ts` found three retired promises** the manual sweep missed, one of them a
   hardcoded "1 September 2026" in a Home FAQ answer that the config-driven ship-date change could
   never have reached.

## Measurements, on the real server

| Page | perf | a11y | best practices | seo |
| --- | --- | --- | --- | --- |
| store (`store.localhost`) | 100 | 100 | 96 | **66** |
| `/refund` | 100 | 100 | 96 | 100 |
| `/` | 100 | 100 | 96 | 100 |

The store's 66 is the `noindex` directive and nothing else, and it is correct: an SEO score measures
how findable a page is, and a checkout must not be findable or it competes with /products/lumi
(§8.25-aa). axe: zero violations on the store at 390px and 1280px and on all four policy pages, with
reveals forced and a 1.5s settle. Voice-lint: zero em-dashes and no hype across six rendered pages and
both email templates. 606 tests, 89 files. `next build` clean, all 5 API routes and 4 store routes
present.

Behaviour verified by driving the real server, not by reading code:

- store host root → rewrite to `/store` with `x-robots-tag: noindex`
- apex `/store` → 308 to the store host · `store.kheelona.com/store` → 404 · a marketing route on the
  store host → 404
- `/api/health` with no keys → 503 `not-configured`; with keys and an unreachable database → 503
  `database-unreachable`
- webhook with a bad signature → 400; with a valid signature and a broken database → **500, asking
  for a retry**, which is the behaviour that stops a paid order being lost
- `create-order` with no keys → 503 and a kind sentence; invalid input → 422 with all five field
  messages; valid input with a broken database → 500 and "not your fault"
- `/thanks` with no token and with a forged token → 404 both times, telling a prober nothing
- an unsigned event link → "That link will not work"
- the marketing home carries **exactly one** outbound store href (§8.25-b)

## What is still needed, and it is all founder dashboard work

FOUNDER-TODO.md section 0: Razorpay keys and webhook, a Supabase project plus the migration, Resend
DNS (optional to start), one `STORE_SIGNING_SECRET`, and `store.kheelona.com` added to the existing
Vercel project. **With no keys the store renders "pre-orders open here shortly" and takes no money**,
so this branch is safe to merge and deploy before any of it is done.

Two answers wanted, neither blocking: whether delivery is included in ₹4,999 (assumed yes, stated on
`/shipping`), and the CA's view on GST for the token (assumed none at receipt, tax invoice at dispatch).
One thing that must land before the first dispatch: the real post-dispatch returns and warranty terms,
which `/refund` currently and honestly says do not exist yet.

## Kheelu lines added this round, awaiting sign-off

Both carry the `GATED:kheelu-line` marker, both under 48 characters:

- `/refund` — "Changed your mind? That is allowed."
- `/shipping` — "I will help pack. Mostly by sitting in the box."

## What I would look at next

The store has no admin view, by the founder's choice: orders are read in the Supabase dashboard and
from the alert emails. That is right for the first weeks and will stop being right the moment two
people are handling dispatch. The second thing is the abandoned-payment list, which the flow order
deliberately creates (`status='created'` rows with a working phone and email) and which nothing yet
does anything with. A WhatsApp follow-up on those is probably the highest-value hour available after
launch.
