# Founder TODO — everything waiting on you (nothing here blocks the build)

Each item unlocks something specific. Ordered by launch impact.

## ✅ V6 — the growth-arc content round is MERGED AND LIVE on https://kheelona.com (2026-07-31)

Merged to `main` at your instruction ("make it live on demo and main both"), after the independent
content QA approved it and after its design-handoff items were built rather than handed over.
Rollback tag if ever needed: `v5-live-2026-07-31`. Records: `BUILD-V6.md` (spec), `QA-V6-note.md`
(the review), `HANDOFF-design-v6.md` (all five items closed), checkpoint
`docs/checkpoints/v6-content-2026-07-31.md`.

| # | What | Status |
|---|---|---|
| V6-a | Merge to `main` | **DONE at your order.** Both branches carry it, live-verified. |
| V6-b | Delete the Tally test rows | **DONE — you confirmed Tally is all clear (2026-07-31).** |

**Nothing on this page is waiting on you for V6.** The whole round is live and verified.

---

## 📋 THE ONLY THINGS STILL WAITING ON YOU (audited 2026-08-22, everything else on this page is closed)

The marketing site is live, converting, and correct as it stands. **THE STORE IS NOT LIVE**, and
section 0 below is the only thing standing between it and its first real pre-order. Everything from
section A onwards is the older queue, unchanged, and none of it blocks anything.

---

### 0. THE STORE IS LIVE (2026-08-22) — two things left, one of them urgent

`store.kheelona.com` and the paid copy on kheelona.com are **live, on LIVE Razorpay keys**. Merged,
deployed, and verified against production: the server chain creates real Razorpay orders and writes to
Supabase, the amount is decided server-side, validation and webhook signature rejection both behave.
Rollback tag: **`v6-live-2026-08-22`** (the last pre-store commit).

- [x] ~~Razorpay key id and secret~~ — done, and they are **live** keys
- [x] ~~Webhook created~~ — `store.kheelona.com/api/razorpay/webhook`, Enabled, `order.paid` + `payment.captured`
- [x] ~~Supabase project, migration, service key~~ — done, tables exist with RLS on
- [x] ~~`STORE_SIGNING_SECRET`~~ — done
- [x] ~~`store.kheelona.com` domain + DNS~~ — done, Valid Configuration on Production

#### ✅ Email — done and verified (2026-08-22)

`RESEND_API_KEY` is in Vercel and `/api/health` reports `email: "configured"`. A real receipt and a real
internal alert both arrived and read correctly. Root SPF, 2048-bit Google Workspace DKIM and DMARC were
also set up the same night, and `send.kheelona.com` is Resend-verified with its SPF and bounce-feedback
MX in place. Google Workspace mail was never touched.

#### ✅ The webhook secret — proven (2026-08-22)

A real payment produced three webhook deliveries, **all 200**. The secret matches between Razorpay and
Vercel. It also proved the idempotency guard under the real race: `payment.captured` and `order.paid`
arrived one second apart and exactly **one** receipt was sent.

#### 🟡 Two smaller things

- [ ] **Delete the test row.** `delete from preorders where order_ref = 'KH-8FP8-PWDA';` — it is
      `status='created'` and would otherwise look like a real abandoned lead.
- [x] ~~**GA4: tell it the two domains are one site.**~~ **DONE 2026-08-23**, minutes after the one-tap
      change, and verified on screen: the Google tag `G-7LMKSFEXZ9` (stream `kheelona.com`, ID
      15336032355, tag quality "Excellent", data flowing) now carries a Cross-domain Linking
      Configuration with **two rows, both `Exactly matches`: `kheelona.com` and `store.kheelona.com`**.

      Why it was needed: every pre-order button now crosses hosts in one tap, where before only the
      finale did. Without this GA4 counts that hop as a new session from a referral, so the store looks
      like it gets its traffic from your own site and the marketing pages get no credit for the
      conversion. It also stops the store link being logged as an **outbound click** by enhanced
      measurement, which would have inflated that metric from the day the change shipped.

      **The path, in case it ever has to be redone:** Admin → Data streams → click the EXISTING
      `kheelona.com` row (never "Add stream", which offers to create a second web stream and would
      split the data) → Google tag → **Configure tag settings** → Settings → **Configure your
      domains**. No code, no deploy. If a third host is ever added, it goes in this list and in
      `GA4_HOSTS` in `src/config/site.ts` on the same day.
- Supabase region: RAISED AND CLOSED (founder, 2026-08-22). A trivial query takes 250 to 975ms, which
  suggests the project is not in an Indian region, but the project cannot be moved. Not actionable, so
  it is recorded here rather than left as an open item. Worth remembering only as the explanation if
  checkout ever feels slow: each order makes two or three round trips.

#### 📧 Email authentication (done 2026-08-22) and the one dated follow-up

Set up for the first time on the day the store went live, and verified from DNS:

| Record | Value | State |
| --- | --- | --- |
| Root SPF | `v=spf1 include:_spf.google.com ~all` | ✅ one lookup, softfail |
| Root DKIM | selector `google`, 2048-bit | ✅ Workspace signing active |
| Root DMARC | `v=DMARC1; p=none; rua=mailto:dmarc@kheelona.com; fo=1;` | ✅ reporting, not yet enforcing |
| `send.kheelona.com` | Resend, Tokyo region | ✅ **Verified** (DKIM only) |

Google Workspace mail is untouched: the root MX still points at `smtp.google.com`, and Resend sends
from the `send.` subdomain precisely so the root's reputation is never at risk.

- [ ] **📅 5 SEPTEMBER 2026: tighten DMARC to `p=quarantine`.** The two-week observation window ends
      then. **Read the reports at `dmarc@kheelona.com` FIRST** and confirm Google Workspace and Resend
      are both passing; only then edit the existing `_dmarc` TXT in Cloudflare and change `p=none` to
      `p=quarantine`, keeping `rua` and `fo`. Never add a second DMARC or SPF record, and do not jump
      to `p=reject`. A scheduled agent will remind you:
      https://claude.ai/code/routines/trig_01T644UQuKPds5T1iV5abvqD
- [x] ~~Add Resend's SPF and MX records~~ **DONE 2026-08-22**, verified in DNS: SPF
      `v=spf1 include:amazonses.com ~all` and MX `10 feedback-smtp.ap-northeast-1.amazonses.com`, both
      at **`send.send.kheelona.com`**. Bounce and complaint feedback now reaches Resend, so a receipt
      that fails to arrive will be visible instead of silent.

      **THE NAMING TRAP, so nobody re-diagnoses it:** the Resend domain is `send.kheelona.com`, and
      Resend's sending records live at `send` RELATIVE TO THAT, which makes the real hostname
      `send.send.kheelona.com`. The doubled label looks like a typo and is correct. Claude's first
      instruction said to use `send`, which was wrong; Resend's own "Auto configure" for Cloudflare
      gets it right.

      **"Enable Receiving" should stay OFF.** It is Resend's INBOUND email feature and would need an MX
      at `send.kheelona.com` pointing at `inbound-smtp…amazonaws.com`. The store only sends, and replies
      to receipts already go to hello@kheelona.com through the reply-to header. If that row ever shows
      Pending again, the fix is to turn the toggle off, not to add the record.

#### ✅ The store is fully verified (2026-08-22)

A real ₹499 UPI pre-order (`KH-YPJ8-GHVT`) proved the whole path on live keys, and was refunded after:
the payment captured, **all three webhook deliveries returned 200** (so the secret matches), the
idempotency guard held under the real race (`payment.captured` and `order.paid` one second apart, exactly
**one** receipt sent), both emails were correct, and the signed address link from that receipt was then
used to save a delivery address. Razorpay fees were **₹0.00**, because UPI is zero-MDR in India, so
verifying the whole thing cost nothing. **Nothing about the payment or fulfilment path is unproven.**

Two lessons from that single transaction, both worth keeping: the receipt greeted "Thank you, shweta"
because the code used the typed name verbatim (fixed, and found only by reading the sent PDF while every
test passed); and the refund was issued at ₹489 rather than ₹499, which on a real customer would
contradict both the receipt and `/refund` for no reason, since fees were zero. **Always refund the whole
token.**

#### Fixed after the first refund (2026-08-23)

Reading the code after your ₹499 refund turned up a real bug, now fixed: **a refunded order stayed in
the dispatch queue.** The queue is `status = 'paid'`, and the webhook only ever acted on payments, so
someone who cancelled and got their money back would still have been shipped a Lumi and invoiced
₹4,500. The only thing preventing it was remembering to run an `update` by hand — which is exactly what
I asked you to do for Shweta's order, and exactly why it needed fixing.

Now `refund.processed` removes the order automatically. Two deliberate limits: a **partial** refund does
NOT cancel an order (your ₹489-of-₹499 is precisely why — a ₹10 goodwill refund must not silently kill a
live pre-order), and `refund.created` is ignored because it is only the instruction, not the money
moving. Also added: `payment.failed` now marks a row `failed`, which separates "the card was declined"
from "never came back" in your follow-up list.

**You can still run that `update` for Shweta's row**, since her refund happened before this shipped:

```sql
update preorders set status = 'refunded' where order_ref = 'KH-YPJ8-GHVT';
```

Every refund from here handles itself.

#### The first real payment

No card payment has ever gone through this code, and the keys are live, so the first one is real money.
Recommended: add the Resend key, then **pre-order once yourself with your own card**, check it end to
end against `docs/store-go-live.md` step 4, and refund it from the dashboard. About ₹12 in gateway fees
Razorpay does not return, and it proves the card flow, the webhook secret and both emails in one go.

#### Answered, nothing further needed

- ✅ **Delivery is included** in ₹4,999, anywhere in India. Published on `/shipping`, in the `/terms`
  price clause, in the store's summary panel and in both machine routes.
- ✅ **Prices are GST-inclusive** (`TAX_LINE`, rendered from config in five places). You also confirmed
  GST is paid from the collected amount **under reverse charge**; that half is deliberately not
  published, being internal accounting no customer decision depends on. One note for the record, since
  it is your call: reverse charge is unusual on a B2C goods sale, where the seller normally collects
  under forward charge.
- ✅ **Both Kheelu lines**, in their contracted form: `/refund` "Changed your mind? That's allowed." and
  `/shipping` "I'll help pack. Mostly by sitting in the box."

#### Still open, and it blocks the first DISPATCH rather than the store opening

- [ ] **The post-dispatch returns and warranty terms do not exist yet**, because nothing has shipped.
      `/refund` says exactly that in plain words rather than inventing a window. They must be written
      before the first Lumi leaves.

#### Already decided, needing nothing from you

The ₹499 refundable token, the ₹4,500 balance by payment link before dispatch, the 30 September 2026
deadline, no unit cap, shipping from 1 October 2026, WhatsApp-only support on +91 91875 46483, one Lumi
per order, four form fields, and refunds by request within 5 to 7 working days. All of it is live in the
code and written into the policy pages.

---

### The older queue (nothing here blocks anything)

**A. Facts only you have** — each is a one-file edit the moment you say the word:
1. **The Kheelona+ price.** The last gated commercial fact. Every surface says "pricing announced soon"; a ₹ amount stays forbidden until you set it.
2. **Toy-safety certificates** — exact names and numbers when testing completes. Reinstates the standards FAQ and lets a badge appear (no badge appears before it is earned).
3. **Final specs** — battery life, size and weight, materials, **the wake word**, charger details. Three pages currently promise these "before Lumi ships" (/safety, /products/lumi, /setup).

**B. One content decision:**
4. **Which page owns the shared beats.** Home and Meet Lumi still both carry the modes, the pilot quotes, the audio demos and a near-identical FAQ. Cutting the duplication needs your call on which page owns each; then it is a short job.

**C. Two one-line confirmations:**
5. **R10-a — Ria reads her /team card once.** Her bio and quote were drafted from her public profile and approved by you, but she has not read them herself.
6. **R11-b — two de-contracted lines.** The no-contractions rule overrode your published kheelona.ai phrasing in one surviving spot on /safety ("Nothing stays that you cannot delete."). Say the word and the contraction goes back as a sanctioned exception.

**D. Assets, whenever you want them** (the site is complete without all four):
7. **R9-a real photography** — still the single strongest conversion lever anyone has identified: the plush in a child's hands, a fabric macro, a breathing-motion loop, and where the mic and button sit. Drop them in `~/Downloads`.
8. **Real testimonial quotes / faces** — your standing decision is to keep the drafted placeholders (V3-a); real ones swap in cleanly whenever.
9. **R5-a the new logo** — you said you would upload it later. **Now newly relevant: the favicon and app icons were just built from the current mark, so a new logo means one pass to redo the navbar, the icons, the share image and the schema logo together.**
10. **og.png refresh** with the whisper hero artwork (optional — the current card is accurate, just older art).

**E. Off-site, only you can do:**
11. **The Play Store listing still showing ₹2,999** (V3-h). It competes with the live pricing in Google's index.
12. **Investor "backed by" band on /team** — names and logos when you are ready to show them. Note the row is currently labelled "Recognised by" everywhere, because NVIDIA Inception and nasscom are recognition programmes, not backers.

**F. Parked R4 design calls** (from the 2026-07-10 panel; the site ships fine without them, and two have since been overtaken): R4-a reorder Home so safety answers earlier than ~85% scroll depth · R4-c reuse the price band on Home after the compare table · R4-e a founder-credibility strip before the closing CTA.

**Worth doing once on your phone:** open the FAQ on Home. It now works with JavaScript switched
off, because the answers are in the page rather than being drawn by script — see below.

**What it fixes.** The feedback you relayed — *"it's good that you are teaching, but what will a kid
who buys this at 2 get when they are 5?"* — was true: the site had no answer anywhere. Now the hero
leads with it ("A best friend at 2. A head start by 5."), a new Home room walks it year by year
(At 2 years → At 3 years → At 4 years → By 5 years, hedged with "Every child grows at their own pace. Lumi follows theirs."),
and a new FAQ carries the question in parents' own words. The confusing tutor hero is gone but the
tutor narrative is not — it lives in the comparison, the pacing panel, the new room's closing line,
and the Google title, per your note.

**Two things worth knowing, because they were wrong on the live site:**
1. **The old internet FAQ was factually wrong.** It said "No. Lumi plays offline." Your answer set
   the record: AI mode runs on home WiFi; Kheelu-mode stories and Bluetooth music work offline. Every
   surface now names the mode, which also makes /playos's "WiFi operated" chip consistent instead of
   contradictory.
2. **/privacy described a form that no longer exists** — it listed email and your child's birth
   month, which the five-field Tally form stopped collecting, and it told parents to leave the list
   by "replying to any email" they were never sent. Found by the independent content QA, not by us.
   Fixed to the five real fields with a WhatsApp-or-email exit that works. This is the kind of thing
   a DPDP complaint is made of, so it is the single most valuable fix in the round.

Also fixed while in there: four **real contrast failures live on kheelona.com today** on Meet Lumi
(pale blue numerals, grey text on tinted panels) that three earlier accessibility sweeps could not
see, because the checker skips content that has not faded in yet.

**One more thing that was quietly broken, found after the QA passed.** The FAQ was drawn by
JavaScript, and it only put the *open* answer into the page. So Home was serving eight questions and
**one** answer to anyone whose browser had JavaScript off, and to the AI assistants that read pages
without running it — exactly the audience the journal and the answer-style copy are written for.
Google was fine, because the structured data carried all eight, which is why three earlier reviews
missed it. It is now built on the browser's own accordion: all eight answers are in the page, they
open with JavaScript off, and the page ships less code than before. Nothing you read on screen
changed.

Also from that pass: every small uppercase label on the site is now the same brand orange, and two
things I had flagged for the design team turned out to need nothing once measured (the year-by-year
card grid and the hero's balance at tablet widths).

**No decisions needed.** Every word was approved in the spec before it was built (`BUILD-V6.md` §2),
and the independent QA's verdict is APPROVE (`QA-V6-note.md`). Your V5 open decision — which page
owns the modes, quotes, audio and FAQ — is still open and still a short job when you want it.

## ✅ THE GREAT CLEARANCE (2026-07-31) — you answered almost everything in one message

| Gate | Your answer | Now live |
|---|---|---|
| REV-a final hero art | generated | The whisper artwork IS the hero (single image, interim two-cutout composition retired) |
| Ship date | "Shipping starting 1st Sep" | FAQ on Home + /products/lumi, `availabilityStarts: 2026-09-01` in the Product schema, llms.txt, pricing.md — all from `SHIP_DATE_*` constants |
| Languages | 8 named, final | Named in both FAQs, footnote 1, llms.txt, pricing.md via `LANGUAGES_LINE`; ceiling stays "up to 10" so two more slot in with zero copy changes |
| Kheelona+ (V3-b) | smart features lifetime; AI pricing open-ended | `KHEELONA_PLUS_LINE` now says "smart features are yours for life" + "pricing announced soon". A ₹ amount is STILL gated — say the number when you have it |
| Certifications | none yet, drop from FAQ | The standards FAQ entry is removed (the status-honest standards room stays); reinstate when the first certificate lands |
| Counsel review | "Remove this point" | Waived by you, 2026-07-31 — recorded here so nobody re-raises it |
| Article authors (V3-f) | assign from /team | All 19 articles carry bylines + Person schema (Apoorva 5, Ria 7, Kashyap 4, Aman 3, matched to topics) |
| Backlinks (V3-i) | ignore for now | Parked at your instruction |
| Ahrefs extras (V4-d) | not required | Closed |
| Play Store ₹2,999 listing (V3-h) | you will take it down | With you |

**Still open, the short list**: the Kheelona+ ₹ amount when you decide it (one-constant edit) ·
the first toy-safety certificate when it lands (reinstates the FAQ + the badge) · real
testimonial quotes whenever you want to swap them in (V3-a stays your standing decision) ·
R9-a real photography (optional polish) · og.png can be refreshed with the new whisper artwork
(optional, the current card is accurate).

## ✅ #0 — LAUNCH IS DONE (2026-07-28). Nothing here blocks anything.

**https://kheelona.com is live and taking reservations.** Everything that was blocking has cleared,
in this order, all on 2026-07-28:

| Was blocking | Now |
|---|---|
| Vercel Root Directory said `site` | cleared to the repo root; builds succeed |
| kheelona.com DNS | pointed; apex is the canonical host, `www` 308s to it |
| Pre-order form | live — Tally `Y5XW7J`, `NEXT_PUBLIC_TALLY_FORM_URL` set in production |
| Analytics | Vercel Web Analytics + GA4 `G-7LMKSFEXZ9`, both verified firing on the live domain |
| Search Console | domain property verified, sitemap processed, 24 pages discovered |
| Bing Webmaster | sitemap submitted |

Two things about the live setup worth remembering rather than rediscovering:
- **The preview (website-hdn2.vercel.app) still shows the "opens soon" card**, because the Tally env
  var is scoped to production only. That is expected, not a fault.
- **GA4 only fires on `kheelona.com` and `www.kheelona.com`** by design, so no localhost run or
  preview deploy pollutes your reports. If the canonical host ever changes, `GA4_HOSTS` in
  `src/config/site.ts` must change with it, or the tag goes silently dead.

## ✅ #0b — DONE (2026-07-31): you clicked Recheck installation

The tag is live on https://kheelona.com with your key `N7vd/jLtIIlHqzFqu57UBg`, in `<head>` on all 24
routes, verified in the served HTML. Ahrefs just needs you to press its button.

Worth knowing: unlike GA4, this one is **not** restricted to the live domain, because Ahrefs verifies
by fetching the page and looking for the tag, and a restricted tag would be invisible to that check.
So local and preview page views will show up in your Ahrefs numbers. Small, and it is the price of a
verify button that works. Say the word if you would rather have it clean and I will restrict it and
verify another way.

## ✅ V5 — the end-to-end design review is MERGED AND LIVE on https://kheelona.com (2026-07-31)

Merged at your instruction the same day it was built. Spec `docs/revamp-2026-07/BUILD-V5.md`,
record `docs/checkpoints/v5-merge-2026-07-31.md`. Rollback tag if ever needed: `v4-live-2026-07-31`.
**Worth doing once on your phone:** tap a story card, a feeling, a colour swatch, an FAQ row — they
answer now, which they never did before.

Your team's four observations all checked out, and the numbers found each one:
- **Micro-interactions inconsistent** → the whole codebase had *two* press states, and the card
  interaction was desktop-only, so phones answered almost nothing. There is now one contract used
  everywhere. **On your phone: tap a story card, a feeling, a colour swatch, an FAQ row** — they all
  respond now. Static cards deliberately do not: pretending a card is tappable is worse than nothing.
- **Form white space** → measured 191px of dead space on desktop, 93px on mobile. It came from
  measuring the form on its own page instead of inside our embed. Fixed, and the section now carries
  three answers (no payment today / first 500 / ships 1 Sep) instead of padding.
- **The promise section's elements used nowhere else** → they now mean one thing, "this is a
  promise", and appear on /safety, /playos and the reserve section too.
- **/safety too wordy** → it stated one promise *four times* in a single fold, and one row repeated
  the previous section almost verbatim. Cut. The main answer went 85 → 57 words, which also makes it
  more quotable by AI search.

Two things I found that nobody had flagged: **Kheelu was appearing twice in the hero** (the new
artwork contains him and the corner guide showed him too — he now waits), and **Home and Meet Lumi
were 60% the same page**, so the duplicate feelings section came off the product page.

**One decision left for you (not urgent):** Home and Meet Lumi still share the modes, the quotes, the
audio demos and a near-identical FAQ. Cutting further needs your call on which page owns each beat —
tell me and it is a short job.

## ✅ V4 — MERGED AND LIVE ON https://kheelona.com (2026-07-31, your order)

Everything below shipped. Spec: `docs/revamp-2026-07/BUILD-V4.md`; the merge record:
`docs/checkpoints/v4-merge-2026-07-31.md`. Your merge order also **closed V3-d — the Kheelu
lines are live as reviewed**. Rollback tag if ever needed: `v3-live-2026-07-31`.
Still worth 2 minutes: the two one-listen audio checks in V4-b below, and deleting any Tally
test rows you made while reviewing.

**✅ V4-a — DONE (2026-07-31).** You cut `Y5XW7J` to the 5 fields (parent name, kid's age, city,
WhatsApp number, WhatsApp consent) and Claude re-measured the live embed (827px, was 886) and set
the iframe to 900px with the guard test at ≥860. The form URL is now a hardcoded public constant
(`TALLY_FORM_URL` in `config/site.ts`), so the REAL form renders on the preview and localhost too —
which you asked for. **Heads-up: submissions from the preview are real Tally entries; delete test
rows in Tally after reviewing.** (The old V3-e colour-field note stays optional.)

**✅ V4-b — DONE (2026-07-31).** You dropped the four MP3s in ~/Downloads and they now live in
`public/audio/` (128kbps, 6.5–11.2s each). All four cards play on the site, one voice at a time.
**One word changed to match your audio**: the apples transcript says "4 apples" (the team doc said
"40", but your MP3's own filename — the TTS prompt — says four, and 4 is the better number for a
2-to-5-year-old anyway). If the audio actually says forty, tell Claude and it is a one-word flip.
Worth one listen: whether the knight clip really ends with "Choose one." (its filename truncates
mid-sentence; the on-site transcript keeps the full line from your doc).

**✅ V4-c — FULLY DONE (2026-07-31, two batches).** You generated all TWELVE story heroes (five
from the kit, then the remaining seven from the chat prompts) — **all 19 journal articles are now
photographed** and the /stories index leads every card with its story's own image. Nothing left in
the journal's art queue. ✅ V3-c (the pipeline renders) also cleared the same day — see its entry
below. **The one piece of art still open anywhere: REV-a, the final hero artwork.**

**V4-d — Ahrefs, two optional buttons.** (1) Keywords Explorer and CSV export are locked on the
current plan — upgrade only if you want volume numbers; the strategy does not depend on them.
(2) Connecting Search Console inside the Ahrefs project (GSC Insights tab) would surface real
query impressions. Also: `docs/snapshots/serp-bilingual-no1-2026-07-30.jpg` — you rank #1 in India
for "raising bilingual child in india" already; the journal works.

**✅ V3-d — CLOSED by your merge order (2026-07-31).** Every Kheelu line is live as it stood on
the preview you reviewed. If any line ever reads wrong, it is a one-string edit — just say which.

## THE REVAMP (2026-07-24) — theme B + V3 are BUILT, MERGED to `main` and verified; these are yours

Status + everything already decided: `docs/revamp-2026-07/WORKING.md`.

**► REVIEW URL: https://website-hdn2.vercel.app** — but read #0 first. It is currently serving a
**pre-fix bundle** (last successfully built 2026-07-25), so the home hero shows a broken image
where Lumi should be. That is fixed and pushed; it reaches the URL when the Root Directory setting
is cleared. The whole site is rebuilt on theme B plus the V3 repositioning: Home,
/products/lumi, and all 8 interior routes. What to know while you look:
- Visitor counting is now live through Vercel Web Analytics, which needs nothing from you beyond
  keeping it enabled in the dashboard. GA4 is a separate, optional thing and is NOT wired (item 8).
- The reserve panel still shows the "opens soon" card, because the two
  `NEXT_PUBLIC_*` env vars are not set in Vercel (items 1 and 2 below).
- The Home hero uses INTERIM composed art until REV-a lands, so Kheelu appears twice there.
- Gated copy is deliberately live on this preview and does not reach `main` until you sign off:
  every Kheelu speech line, and the /safety answer block "Is an AI toy OK for a three-year-old?".
- Wireframe B is still at /b if you want to compare.
- One thing to judge: at around 1200px browser width the Kheelu guide covers the first ~100px of
  the room text column and hides a few words per line. It is clean on wider screens. Say the
  word and he shrinks and shifts on narrow desktops.
- **Phones were fixed on 2026-07-25** after you flagged them: the page no longer slides sideways,
  the bottom Kheelu bar is one line with its Reserve button fully on screen, nothing is cropped
  on the right, and the "How Lumi compares" table is now one card per claim instead of a table
  you had to swipe. Checked at 320/360/390/430px on every route. **Please re-check on your own
  phone** — that is the one thing emulation cannot confirm.

**V3 IS BUILT AND LIVE ON THE PREVIEW (2026-07-28).** The repositioning from your YC
application shipped: the site now argues 40% fun / 20% brain development / 40% education with
the friend story still leading. New on the site — a Learning room that shows Kheelu mode as a
real exchange (Lumi tells the tortoise story, the child interrupts, Lumi asks one back), a
short brain-development room on serve and return, the pipeline (Lumi → Kheelu Speaker → AI
books) with age chips reading 2 to 14, Kheelona+ stated plainly as "6 months included, price
announced before launch", the tutor line under the comparison, footnotes on the two claims that
invite a follow-up, a WhatsApp share link at the finale, and "Designed by parents in
Bengaluru." in the footer. Lumi's age band now reads 2 to 5 everywhere.

Spec: `docs/revamp-2026-07/BUILD-V3.md`. **Your gates, all of which BLOCK merge to main
(the preview is fine):**
- **V3-a. Real testimonials — FOUNDER DECIDED 2026-07-28: the drafted quotes STAY LIVE as they
  are.** Raised once, when the site went public, on the ground that three quotes attributed to
  named people (Shweta, Priyamvada, Gaurav, labelled "Pilot parent") read as real endorsements
  and are not marked as illustrative. The founder's call is to leave them. Recorded so nobody
  re-raises it or "fixes" it. Real quotes are still welcome and swap in cleanly.
- **V3-a (original wording). Real testimonials** — the site will carry three named quote slots (Shweta,
  Priyamvada, Gaurav) with clearly-marked placeholder text you asked for. Send each person's
  real words + consent and they replace the placeholders verbatim.
- **V3-b. Kheelona+ facts** — the site says only "6 months included, monthly price announced
  before launch." Two facts stay yours: (1) the ₹ monthly price, (2) what Lumi does if the
  subscription lapses. Nothing about either is claimed until you state them.
- **✅ V3-c. DONE (2026-07-31)** — you generated the Kheelu Speaker + AI Book renders yourself; both went through the house cutout pipeline and now render on the Home family room (the 'In the workshop' placeholders are gone). Sources staged in Design/product-images/generated-2026-07/. Original ask, for the record: Kheelu Speaker + AI book renders via the Gemini kit the build will
  prepare (`gemini-handoff/pipeline-2026-07/`); calm placeholders until then.
- **V3-d. Kheelu lines v3** — three new guide lines join the existing sign-off queue (list in
  BUILD-V3.md §6.4): "This is the part where the games are secretly lessons.", "The Speaker is
  my cousin. Louder, and better at maths.", and "I only ever have one child to keep up with."
  (the last one on the new pace panel).
- **V3-f. Named article authors (the biggest remaining authority win)** — AI engines and Google
  both weight named authors with credentials. The 14 journal articles are currently attributed to
  "Kheelona" as an organisation. Tell me who wrote each one (or who should be credited as the
  reviewer) and the bylines plus author schema go in. Aman's 14 patents and Kashyap's Intel
  background are exactly the credentials that make a piece citable.
- **V3-g. Search Console + Bing — ✅ DONE 2026-07-28.** Google Search Console verified as a DOMAIN property (`sc-domain:kheelona.com`, so apex + www + http/https are all covered) and `sitemap.xml` processed successfully: **24 discovered pages**, matching the 24 the site emits. Bing Webmaster Tools submitted and processing. Nothing left here for you.
  the domain or submit the sitemap without your account. Once kheelona.com points at Vercel: add
  the property, verify, submit `https://kheelona.com/sitemap.xml`, and check the Coverage report.
  Until this is done Google discovers us slowly and we are blind to what it thinks.
- **V3-h. The ₹2,999 problem is now the biggest active SEO liability (was REV-c)** — the old Wix
  pages and the Play Store listing still show ₹2,999 in Google's index, competing with our own
  pricing for our own brand name. Two halves: the Play Store copy is yours to edit; the 301
  redirects from `/product-page/lumi-*` are mine, and I can only add them once DNS points at
  Vercel.
- **V3-i. Backlinks, when you want the campaign** — a new domain ranks on authority it does not have
  yet. The realistic first wave is directory and listing submissions (Product Hunt, BetaList, Indian
  startup directories, AI-toy roundups, FirstCry-style retail listings) plus any press from the
  Karnataka Elevate and NVIDIA Inception programmes. I have a `directory-submissions` skill ready
  for this; say the word and I will produce the submission kit and tracker.

- **V3-e (small, yours)**: the site lets parents pick a Lumi colour, but the Tally form has
  no colour field, so the preference is lost. Consider adding one (blue/green/pink) to the
  form. And once the V3-c/REV-a art lands, the share image (`og.png`) gets refreshed to match.
- **The Apple-tier pass verdict (benchmarks-v3.md Pass 2)**: the site structure is at tier;
  the gap only you can close is ASSET QUALITY. The two highest-leverage items on this whole
  list are REV-a (final hero art) and R9-a (real photos of Lumi in children's hands). They
  are worth more than any further copy round.
- Superseded by your V3 answers: REV-b(1) subscription (now published per V3-b wording) and
  the "ten families" line (removed; no pilot counts anywhere). REV-b(4) stays open for the
  NAMED language list only.

- **REV-a. Hero art (the one that unblocks the new Home hero)** — run the kit in
  `gemini-handoff/hero-2026-07/README.md` (3 reference images + one prompt + a 4K follow-up),
  drop the result in `~/Downloads`, say "hero art is in". Until then previews use interim
  composed art.
- **REV-b. Four product facts the new copy needs** (research memo `docs/revamp-2026-07/research.md`):
  (1) subscription: yes/no, and what stays free — "no subscription" is the incumbent's sorest
  point in Indian reviews, we can only say it if true; (2) camera: yes/no — if none, it is a
  one-line trust differentiator; (3) ship window (existing item 5 — never invented); (4) the 10
  languages, named (existing item 7).
- **REV-c. Stale ₹2,999 price in Google's index** — the old Wix site (kheelona.com/product-page/
  lumi-pink, "Kheelona Robotics") and the Play Store listing (com.kheelona.toyapp) still show
  ₹2,999. Until the new site ships with 301s from `/product-page/lumi-*` and the Play Store
  copy is updated to ₹4,999, search engines and AI answers can quote the old price against us.
  Play Store edit is yours; the 301s are queued in the build.
- **REV-d. 3 mobile app images — NOW ASKABLE (the gate cleared).** Your brief said to ask only
  after the v1 deploy; that deploy happened 2026-07-25 (link above). Drop them in `~/Downloads`
  and say "app images are in". They land in the parent-app rooms on Home, /playos, and
  /products/lumi, which currently reuse the three existing dashboard screenshots.

## THE REDESIGN (2026-07-08/09) — DONE and on master; deploying is yours

Direction picked (Lumi's World + pop-up elements), both models generated and verified, Home rebuilt as the immersive journey, ribbon nav removed on your feedback. Merged to `master`, temp-live for feedback per your call.

**Deployed (2026-07-10; branch updated to the theme-B revamp on 2026-07-25):** https://website-hdn2.vercel.app — GitHub `Kheelona/website`, branch `demo-website`, Vercel Root Directory = repo root (was `site`; the app moved on 2026-07-28). That URL now serves the revamp, not this redesign; the redesign remains on `main`. Still yours when ready: the two `NEXT_PUBLIC_*` env vars in Vercel (the Tally URL makes the reserve form go live; the GA4 id measures nothing until GA4 is actually
wired, item 8 — visitor counting already works through Vercel Web Analytics) and pointing kheelona.com DNS when this stops being temporary. The wireframe round (`design-concepts/round-2-immersive/`) and model kit (`3d-handoff/`) stay in the repo as the design record.

Everything below is the pre-existing launch list; it all carries over to the redesigned site unchanged.

## R7 SISTER-SITE ENRICHMENT (2026-07-10) — done; two old blockers RESOLVED

kheelona.ai became the sanctioned content/design reference on your direction. Team page now has photos, full bios, pull-quotes, LinkedIn; Home gained the recognition strip, the safety callout, the parent-app section (real dashboard), and three REAL early-tester quotes from your published site — the testimonials placeholder blocker and the "backed by" TODO are both closed. One flag for your eyes in the visual pack: Kashyap's bio now names Thunderbolt 4/5 (your kheelona.ai bio publishes it; the old rule here was "name only Intel") — say the word if you want it trimmed.

## R5 CALM PASS (2026-07-10) — done on your feedback; one new item for you

Your review landed: home is now the calm ambient treatment (the /playos register you preferred), 2D mascot + 2D Lumi everywhere (3D one prop-flip away), no italics, all text left-aligned, white button/band text on accessible deep fills, feelings boxed, sticky pre-order bar never hides, shapes fewer/fainter/never over text.

- **R5-a. New Kheelona logo** — you said you'll upload it later; the current wordmark stays until then. When it lands in `~/Downloads`, Claude swaps navbar, share image, and structured-data mark in one pass.

## R4 POLISH CYCLE (2026-07-10) — six decisions parked for you (site ships fine without them)

The design panel review (`docs/design-review-2026-07-10.md`) surfaced these; each is a quick call or an asset, none blocks the deploy:

- **R4-a. Reorder Home so Safety follows "Meet Lumi"** — the panel's strongest structural note: for Indian parents, safety is the gating objection and it currently answers at ~85% scroll depth. One yes/no from you; the section + 3D beat swap is ready work.
- **R4-b. Warm Lumi "beauty shot" for the /products/lumi hero** — the current render reads cool; a warm 2D shot would sell the hug. Claude prepares the Gemini prompt kit on your go.
- **R4-c. Reuse the price band ("Under ₹4 a day…", "Reserving now does not commit you to buy.") on Home after the compare table** — copy already exists on /products/lumi; this is a placement approval.
- **R4-d. Hero composition: bring the Lumi plush in next to Robu** — first-time visitors reserve Lumi but meet only the mascot in frame one. Staging change to the founder-blessed hero, so it's yours.
- **R4-e. Founder strip in the Home finale** — your real credibility (14 patents, Intel) is only on /team; a compact strip before the closing CTA would put humans behind the mic. New Home section, needs your yes.
- ~~**R4-f. 7 journal hero images**~~ — **DONE 2026-07-31**: all 19 articles carry real photography; zero placeholder cards remain.


## 0. Gemini assets — GENERATED, awaiting ingest (state as of 2026-07-07 night)
You generated 5 of 6 items; they sit in `~/Downloads` (3 image fixes + Veo shots 1-2). Claude's next session starts by ingesting them (exact steps in `docs/project-state.json` → `last_handoff.next_action`).
- **Still yours, when Gemini video credits reset (~24h from 2026-07-07 night)**: optional SHOT 3 "Cuddle" — attach `gemini-handoff/seed-3-cuddle.png`, prompt in `gemini-handoff/README.md`. The film works with 2 shots; this adds the cozy ending.
- **Then yours: approve the rebuilt V2 film** when Claude sends it.
- Settled this round: film = V2 "Two friends" Veo rebuild — **now LIVE on the site** (2026-07-08); the site was **2D everywhere** at that point (superseded 2026-07-09 by the immersive R3F redesign now on master); pink approved (cutout fixed); your 3 regenerated images ingested (green/right/left all pass); repo cleaned of superseded drafts/renders/teasers; **standing rule: all Gemini generation is done by you from Claude-prepared prompt kits, never by Claude directly** (in CLAUDE.md).
- Optional, whenever credits allow: SHOT 3 "Cuddle" (`gemini-handoff/seed-3-cuddle.png` + prompt in the README there) to extend the film's ending.

## 1. ✅ DONE 2026-07-28 — Tally form link (unlocked: the site actually converting)
Live: `https://tally.so/r/Y5XW7J`, set as `NEXT_PUBLIC_TALLY_FORM_URL` in Vercel production. All six
fields present and correctly typed, Submit reachable (the iframe was raised 560px → 960px on the day,
because the form measures 886px and Submit had been below the frame's own fold). Your Tally consent
wording matches the site line. `preorder_view` now reaches GA4.

<details><summary>Original instructions, kept for reference</summary>

Create the Tally form with exactly these fields: parent name, email, WhatsApp number, WhatsApp consent checkbox, child's birth month, city. Turn on the confirmation email. Then paste the share URL into `.env` at the repo root as `NEXT_PUBLIC_TALLY_FORM_URL=` (and into Vercel env settings when deploying). The reserve panel on every page switches from the "opens soon" card to the live form automatically.
- Also confirm: the consent text in Tally should match the site's promise "Your WhatsApp number is only for updates about your reservation. You can leave the list anytime." If your Tally wording differs, tell Claude and the site line gets updated.
</details>

## 2. ✅ DONE 2026-07-28 — Vercel deploy (unlocked: the site being live)
Live at https://kheelona.com, apex canonical, `www` 308s to it, Root Directory = repo root.
Env vars set in production. Claude has NO Vercel access and never runs the Vercel CLI: it pushes to
GitHub and hands you any dashboard change.

<details><summary>Original instructions</summary>

Run `vercel` (or connect the GitHub repo in the Vercel dashboard) with Root Directory = the repo root (leave it empty). Add the env vars from `.env`. Point kheelona.com DNS at Vercel. Claude can drive everything after `vercel login` happens in your terminal (`! npx vercel login`).
</details>

## 3. CLOSED BY YOUR DECISION 2026-07-28 — Testimonials
The three drafted quotes attributed to Shweta, Priyamvada and Gaurav ("Pilot parent") **stay live as
they are**. Raised once when the site went public, on the ground that nothing marks them as
illustrative; your call was to leave them. Recorded so it is not re-raised. Real quotes still swap in
cleanly whenever you have them: paste them to Claude.

<details><summary>Original ask</summary>

Three real quotes, each with parent name, child age, city, and written consent. The section is already built (`ParentVoices`) and unmounts itself until quotes exist; paste them to Claude and it goes live on Home.
</details>

## 4. Certifications + specs (unlocks: Safety page completeness + specs blocks)
- Toy-safety standards/certificates once testing completes (exact names and numbers).
- Final specs: battery life, size and weight, materials, the wake word, charger details.
- These fill the flagged "published before Lumi ships" spots on /safety, /products/lumi, /setup.

## 5. ✅ DONE 2026-07-31 — Ship date
**1 September 2026**, published everywhere from `SHIP_DATE_*` constants: both FAQs, the Product
schema's `availabilityStarts`, llms.txt, pricing.md, and the reserve cards. /privacy and /terms now
state it too (V6 fixed those two, which had still hedged it).

## 6. ✅ DONE 2026-07-28 — Contact email
`hello@kheelona.com`, founder-confirmed, live in the footer and on /contact. The phone number beside
it on the legacy Wix site was `+91 98765 43210`, the canonical fake Indian number, and is never
published. If a real phone line appears it needs the same confirmation before it goes on the site.

## 7. ✅ DONE 2026-07-31 — The languages list
**Eight named and final** (English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French) from
`LUMI_LANGUAGES`, with the published ceiling kept at "up to 10" so two more slot in with no copy
change. V6 also caught and fixed the one journal sentence that had flatly claimed ten.

## 8. GA4 — ✅ DONE 2026-07-28, nothing left for you (unlocks: conversion funnels)
**Both analytics tools are wired and verified.** Vercel Web Analytics (cookieless) and GA4
(`G-7LMKSFEXZ9`, your `kheelona.com` stream) are both in the app layout. You do not need to paste
an ID anywhere: it is in the code, because a measurement ID is a public identifier, not a secret.

Manual gtag install, not Tag Manager, for the reason Google's own dialog recommends it: GTM would
ship a container runtime roughly three times the size to solve a problem you do not have, and this
site's mobile performance was won back a point at a time.

**The tag only fires on kheelona.com and www.kheelona.com.** Not on localhost, not on preview
deploys. Without that, every test run of mine would land in your reports and you could not trust
the numbers. One consequence worth knowing: **your GA4 reports will stay empty until DNS points at
Vercel**, because that is the only place the tag runs. The preview URL will never report.

While proving the wiring works I briefly allowed localhost and loaded the real tag, so **expect one
or two page views with a hostname of `localhost` in your property**, dated 2026-07-28. That is me,
not a visitor. It also means the "Data collection isn't active" warning on your stream should now
have cleared, which is the confirmation that the ID and the snippet are right. Filter it out under
Admin, Data Streams, your stream, Configure tag settings, Define internal traffic if you want the
history perfectly clean.

GA4 would add what Vercel Analytics does not do: custom conversion events and funnels. **Correcting
an older claim on this line: GA4 is NOT wired.** There is no gtag snippet anywhere in the app; the
`preorder_view` stub in `TallyEmbed` pushes to a `window.gtag` that nothing defines. So setting
`NEXT_PUBLIC_GA4_MEASUREMENT_ID` today measures nothing. If you want GA4, create the property and
share the `G-...` id, and the snippet plus consent handling gets built then. If you do not, Vercel
Analytics is enough to see whether the pre-order page is working. Either way: verify Search Console
after deploy (V3-g).

## 9. Judge the 3D mascot (regenerated 2026-07-07)
The two-faced v1 was regenerated from cleaned multi-view inputs; the new model (idle animation, single face, sharper texture) is live in the home hero, and a Lumi plush 3D turntable is on /products/lumi. Judge both on http://localhost:3456. Retry credits remain (745 left) if anything bothers you.

## 10. WAIVED BY YOU 2026-07-31 — Legal counsel review
You said to remove this gate. Recorded so nobody re-raises it. Worth knowing: V6 rewrote /privacy's
collection list to match the real five-field form and gave /terms a hold that matches the 500 cap, so
both pages are more defensible than when this gate was written. The `TODO(counsel-review)` markers
stay in code as a pointer, not a blocker.

## 11. Investor "backed by" band (optional, /team)
Names/logos when you are ready to show them.

## Known tradeoffs already documented
- ~~Mobile Lighthouse 85~~ — STALE. Fixed by the R9 product-first hero: mobile reads 98-99 on
  devtools throttling. Simulate-mode medians on this site are a proven measurement artifact (qa-report R11).
- The finale renders the Tally form instead of the PDF's plain button: deliberate conversion decision, recorded in the copy reference.
- PDF's teal/terracotta section-label colors were swapped to a darker accent at label sizes: accessibility (WCAG AA) is a locked 90+ gate and won.

## R9 FRIEND-FEEDBACK ROUND (2026-07-10/11) — done; three items for you

Your friend's audit is fully dispositioned (docs/qa-report.md R9). Kheelu now narrates the site, the plush owns the hero, the 500-unit cap is live, one CTA verb everywhere. New items only you can unlock:

- **R9-a. Real photography** (your friend's strongest conversion point: "renders build the vibe; real photography builds the purchase decision"). Shot list, in priority order: (1) the plush in a child's hands — scale; (2) fabric/texture macro; (3) a short loop of the breathing motion (phone video is fine); (4) where the mic and button sit. When files land in ~/Downloads, Claude builds a "the real thing" strip on /products/lumi and swaps the trust moments on Home.
- **R9-b. Testimonial faces** — the three pilot quotes are live but anonymous. One real first name + photo (or a 20-second parent video) with written consent turns the weakest trust signal into the strongest. Ties into existing item 3.
- ~~**R9-c. Kheelu voice check**~~ — **CLOSED 2026-07-31**: your V4 merge order also closed the Kheelu-line gate (V3-d), so every line ships as reviewed. The one new V6 line ("From first words to big ideas. I'm there.") you signed off at spec review.
- Resolved this round: the mascot's public name is **Kheelu** (your card); urgency = "first 500 units at ₹4,999" (your number, now on hero/finale/mid-page).

## R10 (2026-07-11) — one item for you
- **R10-a. Ria's sign-off on her card**: bio + quote were drafted from her public profile and approved by you in the plan; have Ria read her card on /team once — any wording change is a one-line edit. Also say the word if you want a different photo crop.

## R11 (2026-07-11) — two items for you
- ~~**R11-a. Read the two new pages live**~~ — **SUPERSEDED**: that Home hero (the moon exchange) was replaced by V4's tutor hero and then V6's outcome hero; the moon exchange now lives on /products/lumi. /playos was rebuilt for investors in V4. Nothing to check here.
- **R11-b. Two de-contracted lines**: the voice gate (no contractions outside Kheelu) outranked your published .ai phrasing in two spots — "whether it is safe" (Home safety callout) and "Nothing stays that you cannot delete." (/safety). If you prefer the original contractions as sanctioned exceptions, say so and they go back in one line each.
- Also for your eyes: Ria's photo is re-cut on a pale lavender background (the checkerboard in the source file was baked-in fake transparency); her card sign-off (R10-a) still stands.
