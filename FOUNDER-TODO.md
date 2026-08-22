# Founder TODO

**Nothing on this page blocks the site.** kheelona.com is live, indexed, and taking paid pre-orders,
and every open item below is either a fact only you have, an optional asset, or something dated.

Rewritten and re-audited **2026-08-23**. Completed items are one or two lines each; the long version
of any of them is in `docs/checkpoints/` (per round), `docs/checkpoints/closed-rounds.md` (the
round-by-round narrative) and `docs/qa-report.md` (what was verified and how).

Two rules that make this file worth keeping: **a decision recorded here is not re-asked**, and
anything that turns out wrong gets corrected here rather than argued twice.

---

# ⏳ OPEN

## Dated, and the only items with a clock on them

- [ ] **📅 5 September 2026: tighten DMARC to `p=quarantine`.** The two-week observation window ends
      then. **Read the reports at `dmarc@kheelona.com` FIRST** and confirm Google Workspace and Resend
      are both passing; only then edit the existing `_dmarc` TXT record in Cloudflare, changing
      `p=none` to `p=quarantine` and keeping `rua` and `fo`. Never add a second DMARC or SPF record,
      and do not jump straight to `p=reject`. A scheduled agent will remind you:
      https://claude.ai/code/routines/trig_01T644UQuKPds5T1iV5abvqD

- [ ] **Before the first Lumi ships: the post-dispatch returns and warranty terms.** They do not
      exist, because nothing has shipped, and `/refund` says exactly that rather than inventing a
      window. This is the one open item that will actually block a step.

- [ ] **Two rows in Supabase.** Delete my probe: `delete from preorders where order_ref =
      'KH-8FP8-PWDA';`. And close out Shweta's, whose refund predates the automatic handling:
      `update preorders set status = 'refunded' where order_ref = 'KH-YPJ8-GHVT';`

## Facts only you have. Each is a one-file edit the moment you say the word

- [ ] **The Kheelona+ ₹ price.** The last gated commercial fact on the site. Every surface says
      "pricing announced soon" and a ₹ amount stays forbidden until you set it.
- [ ] **Toy-safety certificates**, exact names and numbers when testing completes. Reinstates the
      standards FAQ and lets a badge appear. No badge appears before it is earned.
- [ ] **Final specs**: battery life, size and weight, materials, **the wake word**, charger details.
      Three pages currently promise these "before Lumi ships" (/safety, /products/lumi, /setup).
- [ ] **Is there a camera in Lumi? Yes or no** (the surviving half of REV-b). Still gated in code:
      `products/lumi/page.tsx` carries a comment saying the camera question is absent until you answer
      it. If the answer is no, that is a one-line trust differentiator on a screen-free toy for
      two-year-olds, and worth saying out loud rather than leaving unsaid.

## One content decision

- [ ] **Which page owns the shared beats.** Home and Meet Lumi still both carry the modes, the pilot
      quotes, the audio demos and a near-identical FAQ. Cutting the duplication needs your call on
      which page owns each. Then it is a short job. Open since V5.

## Two one-line confirmations

- [ ] **Ria reads her /team card once** (R10-a). Her bio and quote were drafted from her public
      profile and approved by you, but she has not read them herself.
- [ ] **One de-contracted line** (R11-b). The no-contractions rule overrode your published
      kheelona.ai phrasing on /safety: "Nothing stays that you cannot delete." Say the word and the
      contraction goes back as a sanctioned exception.

## Assets, whenever you want them. The site is complete without all of these

- [ ] **Real photography** (R9-a) — still the single strongest conversion lever anyone has named: the
      plush in a child's hands, a fabric macro, a breathing-motion loop, and where the mic and button
      sit. Drop them in `~/Downloads`.
- [ ] **Real testimonial quotes or faces.** Your standing decision is to keep the drafted
      placeholders; real ones swap in cleanly whenever.
- [ ] **The new logo** (R5-a). You said you would upload it later. Now slightly bigger than it was:
      the favicon and app icons were built from the current mark, so a new logo means one pass across
      the navbar, the icons, the share image and the schema logo together.
- [ ] **og.png refresh** with the whisper hero artwork. Optional. The current card is accurate, just
      older art.

## Off-site, where I have no access

- [ ] **The Play Store listing still shows ₹2,999** (V3-h). It competes with your own live pricing in
      Google's index for your own brand name. The web half is done: the old Wix URLs are 301'd.
- [ ] **Investor "backed by" band on /team.** Names and logos when you are ready. Note the row is
      labelled "Recognised by" everywhere today, because NVIDIA Inception and nasscom are recognition
      programmes rather than backers.

## Parked, and fine to leave parked

- [ ] **Three R4 design calls** from the 2026-07-10 panel, each a yes or no: reorder Home so safety
      answers earlier than ~85% scroll depth (R4-a) · reuse the price band on Home after the compare
      table (R4-c) · a founder-credibility strip before the closing CTA (R4-e).
- [ ] **Backlinks** (V3-i), parked at your instruction. A new domain ranks on authority it does not
      have yet; the realistic first wave is directory and listing submissions plus any press from
      Elevate and NVIDIA Inception. Say the word and I produce the kit and tracker.
- [ ] **Two optional Ahrefs buttons** (V4-d): keyword volumes need a plan upgrade, and connecting
      Search Console inside the Ahrefs project would surface real query impressions. The strategy
      depends on neither. Worth knowing: you already rank **#1 in India for "raising bilingual child
      in india"**.
- [ ] **The Ahrefs tag is deliberately not host-restricted**, unlike GA4, because Ahrefs verifies by
      fetching the page. So local and preview page views appear in your Ahrefs numbers. Say the word
      and I restrict it and verify another way.

---

# ✅ CLOSED

## The store (2026-08-22 and 23)

| What | Outcome |
|---|---|
| Razorpay keys, webhook, secret | Done, on **live** keys. Webhook at `store.kheelona.com/api/razorpay/webhook`, subscribed to `order.paid` + `payment.captured`. |
| Supabase project, migration, service key | Done. Three tables, RLS on with zero policies. |
| `STORE_SIGNING_SECRET`, `store.kheelona.com` + DNS | Done. Valid configuration on production. |
| **The payment path, proven with real money** | A ₹499 UPI pre-order (`KH-YPJ8-GHVT`, refunded after). All three webhook deliveries returned **200**, so the secret matches. Idempotency held under the real race: `payment.captured` and `order.paid` one second apart, exactly **one** receipt. Both emails correct. The signed address link from that receipt was used to save an address. Razorpay fees **₹0.00**, because UPI is zero-MDR in India, so proving it cost nothing. |
| Email sending | `RESEND_API_KEY` in Vercel, `/api/health` reports `email: configured`, a real receipt and a real internal alert both arrived and read correctly. |
| Email authentication, built from nothing the same night | Root SPF (one lookup, softfail), 2048-bit Workspace DKIM, DMARC at `p=none` with reporting. `send.kheelona.com` Resend-verified with its SPF and bounce-feedback MX. Google Workspace mail never touched. **The trap, so nobody re-diagnoses it: the records live at `send.send.kheelona.com`, and the doubled label is correct, not a typo.** Resend's "Enable Receiving" stays **OFF**; it is the inbound feature and we only send. |
| **GA4 cross-domain** (2026-08-23) | Tag `G-7LMKSFEXZ9` now lists `kheelona.com` and `store.kheelona.com`, both `Exactly matches`. Needed because every CTA crosses hosts now; without it GA4 counts the hop as a new session from a referral, and enhanced measurement logs the store link as an outbound click. Path if ever redone: Data streams → the **existing** stream (never "Add stream", which offers a second one and splits the data) → Configure tag settings → Configure your domains. |
| Three defects found after launch, fixed the same night | The receipt greeted "Thank you, shweta" (typed name used verbatim). **A refunded order stayed in the dispatch queue**, which is `status='paid'`, so a cancelled customer would have been shipped a Lumi and invoiced ₹4,500. An orphaned payment had no recovery path. None was caught by a green test suite; each was found by looking at a real artefact. |
| One promise broken once, on your own card | The first refund went out at ₹489 of ₹499, while the receipt and `/refund` both say "in full, no fee". Fees were ₹0.00, so there was nothing to deduct. No copy changed, because the copy was right. **Always refund the whole token.** A partial refund deliberately does NOT cancel an order, which is exactly why. |
| Supabase region | Raised and closed by you. A trivial query takes 250 to 975ms, suggesting the project is not in an Indian region, but it cannot be moved. Recorded as the explanation if checkout ever feels slow: each order makes two or three round trips. |
| Delivery and tax | **Delivery is included** in ₹4,999, anywhere in India. **Prices are GST-inclusive**, and you confirmed GST is paid under **reverse charge** (deliberately not published, being internal accounting no customer decision depends on). One note for the record, since it is your call: reverse charge is unusual on a B2C goods sale. |
| The commercial model, all settled | ₹499 refundable token · ₹4,500 balance by payment link before dispatch · ₹4,999 until **30 September 2026**, ₹9,999 after · **no unit cap** · shipping from **1 October 2026** · WhatsApp-only support on +91 91875 46483 · one Lumi per order · four form fields · refunds by request in 5 to 7 working days. All live in code and in the policy pages. |

## Launch (2026-07-28)

| What | Outcome |
|---|---|
| Vercel deploy | Live at https://kheelona.com. Root Directory cleared to the repo root, which was why nothing had deployed. Apex is canonical, `www` 308s to it. I have no Vercel access and never run its CLI: I push to GitHub and hand you any dashboard change. |
| DNS, Search Console, Bing | Pointed. Google verified as a **domain** property, sitemap processed, 24 pages discovered, matching the 24 the site emits. Bing submitted. |
| Analytics | Vercel Web Analytics (cookieless) plus GA4 `G-7LMKSFEXZ9`, both verified firing on the real domain. Manual gtag, not Tag Manager, because GTM would ship roughly three times the runtime to solve a problem you do not have. **GA4 fires only on the hosts in `GA4_HOSTS`**, so no test run of mine pollutes your reports. Expect one or two page views with hostname `localhost` dated 2026-07-28: that is me proving the wiring. |
| Ahrefs | Tag live in `<head>` on every route with your key; you clicked Recheck. |
| Contact | `hello@kheelona.com`, live in the footer and on /contact. The phone number on the old Wix site was `+91 98765 43210`, the canonical fake Indian number, and is never published. |

## The content rounds

| Round | Outcome |
|---|---|
| **V6** (2026-07-31) | The growth arc. Live. It answers the feedback you relayed, *"what will a kid who buys this at 2 get when they are 5"*, which the site genuinely had no answer to: the hero now leads with it and a Home room walks it year by year. Independent QA REJECTED the first pass over four real blockers and approved after fixes. Two of those blockers were live errors: the internet FAQ flatly said "Lumi plays offline" (AI mode needs home WiFi; Kheelu stories and Bluetooth work offline), and **/privacy described a form that no longer existed**, telling parents to leave a list by replying to emails they were never sent. That last one is what a DPDP complaint is made of. Also found afterwards: the FAQ was drawn by JavaScript and served **one** of eight answers to any reader without it, including the AI assistants the journal is written for. Now native `<details>`. |
| **V5** (2026-07-31) | The design review. Live. Your team's four observations all checked out and the numbers found each: the codebase had *two* press states and the card interaction was desktop-only, so phones answered almost nothing; the form's dead space measured 191px on desktop; the promise shapes meant nothing; /safety stated one promise **four times** in one fold. Two things nobody had flagged: Kheelu appeared twice in the hero, and Home and Meet Lumi were 60% the same page. |
| **V4** (2026-07-31, your merge order) | The team-feedback round. Live, and it also closed the Kheelu-line gate: every line ships as reviewed. You cut the form to five fields, dropped in all four audio clips, and generated **all twelve remaining story heroes**, so all 19 journal articles are photographed. One word changed to match your audio: the apples transcript says "4 apples". |
| **V3** (2026-07-28) | The repositioning from your YC application: 40% fun, 20% brain development, 40% education. Ages settled at **2 to 5** for Lumi and **2 to 14** for the platform arc. You generated the Kheelu Speaker and AI Book renders yourself. |
| **The revamp** (2026-07-24/25) | Theme B, "Kheelu's Tour", replacing the legacy Wix commerce app (preserved at tag `pre-revamp-2026-07`, its URLs 301'd). You flagged phones and they were fixed at 320/360/390/430px on every route. The three hi-fi wireframe drafts were deleted on 2026-08-23, a month and four rounds after you picked one; they are in git history. |
| **R4 to R11** (2026-07-10/11) | The polish, calm, sister-site and friend-feedback rounds. Kheelu became the site's narrator, the plush took the hero, italics went, all text went left-aligned. kheelona.ai became the sanctioned content reference, which closed the old testimonials and "backed by" blockers. Kashyap's bio names Thunderbolt 4/5, matching what you publish on kheelona.ai. Full disposition in `docs/design-review-2026-07-10.md` and `docs/qa-report.md`. |

## Facts you settled, and decisions not to re-raise

| Settled | Answer |
|---|---|
| Ship date | **1 October 2026** (moved from 1 September on 2026-08-22). Rendered everywhere from `SHIP_DATE_*`. |
| Languages | **Eight, named and final**: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, French. Published ceiling stays "up to 10" so two more slot in with no copy change. |
| Kheelona+ | 6 months included, **smart features are yours for life**, pricing "announced soon". The ₹ amount is still yours to set. |
| Certifications | None yet, so the standards FAQ is removed. The status-honest standards room stays. Reinstate when the first certificate lands. |
| **Testimonials** | The drafted quotes attributed to Shweta, Priyamvada and Gaurav **stay live as they are**. Raised once when the site went public, on the ground that nothing marks them as illustrative. Your call was to leave them. **Recorded so nobody re-raises it or "fixes" it.** |
| **Legal counsel review** | **Waived by you.** Recorded so nobody re-raises it. The `TODO(counsel-review)` markers stay in code as a pointer, not a blocker. |
| Article authors | All 19 carry bylines and Person schema, matched to topics. |
| Kheelu's lines | Every line ships as reviewed. Both store lines are live in their contracted form. |
| The launch film | The 25s "Two friends" film is **no longer on the site** (V4 retired the component; the files stay in `public/video/`). So the optional third Veo shot and the film approval are moot. |
| Backlinks, Ahrefs extras | Parked and closed respectively, at your instruction. |
| The three parent-app screenshots | Delivered and in use on Home and /setup. |
| The 3D mascot | Judged and final (v3: rigged, single face, procedural idle). Moot as a decision, because the whole 3D journey is **dormant**, one prop away (`<StageGate stage="journey" />`), and the site is 2D everywhere. |

## Known tradeoffs, recorded once

- The PDF's teal and terracotta section labels were darkened at label sizes. Accessibility is a locked
  90+ gate and it won.
- The store is deliberately `noindex`, so its Lighthouse SEO score of ~66 is **correct**, not a
  regression. Its accessibility, best practices and performance are held to the normal gate.
- Mobile Lighthouse "85" is stale: the product-first hero took it to 98-99 on devtools throttling.
  Simulate-mode medians on this site are a proven measurement artefact.

---

## Where the long version lives

- `docs/revamp-2026-07/WORKING.md` — read first on any resume. The live operating record.
- `docs/checkpoints/` — one file per round. Latest: `one-tap-and-cleanup-2026-08-23.md`.
- `docs/checkpoints/closed-rounds.md` — the round-by-round narrative, and every settled blocker.
- `docs/qa-report.md` — what was verified, how, and what it caught.
- `docs/website-steps.md` — the laws. §8.25 is the store.
- `docs/store-go-live.md` — the store runbook, already executed. Kept for a key rotation.
