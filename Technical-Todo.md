# Technical TODO — the one open-items list

**Nothing on this page blocks the site.** kheelona.com is live, indexed, and taking paid pre-orders.

Created **2026-08-23** at the founder's instruction, merging what used to be two lists: the
founder-gated queue from `FOUNDER-TODO.md` (now a pointer) and the engineering items that were
scattered across `docs/design-review-2026-07-10.md` and `docs/qa-report.md`. One list, one place to
look.

**Two rules carried over from the old file, because they are what made it worth keeping:** a
decision recorded here is not re-asked, and anything that turns out wrong gets corrected here rather
than argued twice.

**Where the settled decisions went:** the old `✅ CLOSED` half — testimonials, the waived counsel
review, the ship-date history, the GST note, the store launch record — is now in
`docs/checkpoints/closed-rounds.md`. **Search that file before re-asking the founder anything.**

**Who owns what:** 🧑 needs the founder (a fact, an account, a decision, or money). 🤖 is mine to do
on request.

---

## 📅 Dated. The only items with a clock on them

- [ ] 🧑 **31 August 2026: close the Ideabaaz page.** In Supabase:
      `update event_tiers set active = false where id = 'ideabaaz';`
      The `expires_on` backstop kills it anyway from ~05:30 IST on 1 September, so nothing breaks if
      this slips a night (§8.25-g-i). Afterwards, the conversion readout:
      `select count(*), sum(amount_paise) / 100 as rupees from preorders where tier = 'ideabaaz' and status = 'paid';`
      Remember these bookings each consume a first-500 unit at ₹4,999, and each still owes ₹4,900
      before dispatch.

- [ ] 🧑 **5 September 2026: tighten DMARC to `p=quarantine`.** The two-week observation window ends
      then. **Read the reports at `dmarc@kheelona.com` FIRST** and confirm Google Workspace and
      Resend are both passing; only then edit the existing `_dmarc` TXT record in Cloudflare,
      changing `p=none` to `p=quarantine` and keeping `rua` and `fo`. Never add a second DMARC or SPF
      record, and do not jump straight to `p=reject`. A scheduled agent will remind you:
      https://claude.ai/code/routines/trig_01T644UQuKPds5T1iV5abvqD

- [ ] 🧑 **Before shipment: the two DPDP lines on `/privacy`.** India's DPDP Act 2023 expects a
      stated **retention period** and a designated **grievance contact** for data requests.
      `/privacy` has neither today: it says tax records are kept without saying for how long, and it
      gives WhatsApp and an email without naming anyone as the person answering. Founder decision
      2026-08-23: leave both until before shipment, which is reasonable while nothing has shipped.
      Wording is counsel's (the page is already counsel-gated). Finding **F-12** in
      `security-review.md`.

- [ ] 🧑 **Before the first Lumi ships: the post-dispatch returns and warranty terms.** They do not
      exist, because nothing has shipped, and `/refund` says exactly that rather than inventing a
      window. **This is the one open item that will actually block a step.**

## 🔁 Standing, triggered by an event rather than a date

- [ ] 🤖 **The sell-out copy sweep, the day the 500th unit sells.** The store flips to ₹7,999
      full-payment BY ITSELF (server-side, per request). The static marketing pages cannot flip
      themselves: Home, `/products/lumi`, `/terms`, `llms.txt`, `pricing.md` and the JSON-LD price
      will still read "₹499 reserves one of the first 500 units". The trigger is `/api/health`
      reporting `"preorder":"full"`, or the internal order alert. The day it happens, ask for the
      sweep: it is a one-session edit (§8.26-g).

## 🔐 Open in the security engagement

Owned by `security-review.md`, which stays until sign-off. **Pointer, not a copy** — do not maintain
the same item in two files.

- [ ] 🤖 **Flip the CSP from Report-Only to enforcing.** After a few days of real traffic, read the
      `[csp] blocked=… directive=…` lines in the Vercel logs; if clean, flip `CSP_PHASE` in
      `src/lib/security-headers.ts` to `"enforce"` and update the phase assertion in
      `test/security-headers.test.ts`. GA4 is the one third party the local payment probe cannot test
      without putting QA traffic in the founder's property, which is exactly what Report-Only covers.

## 🧑 Facts only the founder has. Each is a one-file edit on the word

- [ ] **The Kheelona+ ₹ price.** The last gated commercial fact on the site. Every surface says
      "pricing announced soon" and a ₹ amount stays forbidden until it is set.
- [ ] **Toy-safety certificates**, exact names and numbers when testing completes. Reinstates the
      standards FAQ and lets a badge appear. No badge appears before it is earned.
- [ ] **Final specs**: battery life, size and weight, materials, **the wake word**, charger details.
      Three pages currently promise these "before Lumi ships" (`/safety`, `/products/lumi`, `/setup`).
- [ ] **Is there a camera in Lumi? Yes or no** (the surviving half of REV-b). Still gated in code:
      `products/lumi/page.tsx` carries a comment saying the camera question is absent until it is
      answered. If the answer is no, that is a one-line trust differentiator on a screen-free toy for
      young children, and worth saying out loud rather than leaving unsaid.

## 🧑 Two rows in Supabase

- [ ] Delete my probe: `delete from preorders where order_ref = 'KH-8FP8-PWDA';`
      And close out Shweta's, whose refund predates the automatic handling:
      `update preorders set status = 'refunded' where order_ref = 'KH-YPJ8-GHVT';`

## 🧑 One content decision

- [ ] **Which page owns the shared beats.** Home and Meet Lumi still both carry the modes, the pilot
      quotes, the audio demos and a near-identical FAQ. Cutting the duplication needs a call on which
      page owns each. Then it is a short job. Open since V5.

## 🧑 Two one-line confirmations

- [ ] **Ria reads her /team card once** (R10-a). Her bio and quote were drafted from her public
      profile and founder-approved, but she has not read them herself.
- [ ] **One de-contracted line** (R11-b). The no-contractions rule overrode the published
      kheelona.ai phrasing on `/safety`: "Nothing stays that you cannot delete." Say the word and the
      contraction goes back as a sanctioned exception.

## 🧑 Assets, whenever. The site is complete without all of these

- [ ] **Real photography** (R9-a) — still the single strongest conversion lever anyone has named: the
      plush in a child's hands, a fabric macro, a breathing-motion loop, and where the mic and button
      sit. Drop them in `~/Downloads`.
- [ ] **Real testimonial quotes or faces.** The standing decision is to keep the drafted
      placeholders (see `closed-rounds.md`, and do not re-raise it); real ones swap in cleanly
      whenever.

## 🧑 Off-site, where I have no access

- [ ] **The Play Store listing still shows ₹2,999** (V3-h). It competes with the live pricing in
      Google's index for the brand's own name. The web half is done: the old Wix URLs are 301'd.
      (This is also the last live item from `qa-report.md`'s "Not done" block.)
- [ ] **Search Console verification and sitemap submission** for anything new — needs founder account
      access. The domain property and the 24-page sitemap are already done; this is for future
      additions.
- [ ] **Investor "backed by" band on /team.** Names and logos when ready. Note the row is labelled
      "Recognised by" everywhere today, because NVIDIA Inception and nasscom are recognition
      programmes rather than backers.

## 🛠 Engineering, deferred. All five predate the v3 migration

These come from the R4 design panel (`docs/design-review-2026-07-10.md`, 2026-07-10) and were
dispositioned DEFERRED there. **The 2026-08-23 v3 migration replaced the entire design system**, so
each needs a look before it is worked: some may be resolved, moot, or wrong now.

- [ ] 🤖 **Neutral audit in the shape dressing** (Design #7). PlayOS clouds were retinted white
      because cream read as gray under the cool sky; the wider neutral audit was left for the next
      dressing pass. *Verify still applicable under v3 tokens.*
- [ ] 🤖 **Canopy placement retune across the wash seam** (Design #5). The corridor fade partly
      addressed it; the retune needs an unhurried composition pass at three widths.
      *Verify still applicable.*
- [ ] 🤖 **Dead zones after the hero and before the journal** (Design #9, UX #9). Pacing interacts
      with beat mapping, so it was scheduled to happen alongside the safety-reorder decision (now
      R4-a, parked below) so beats are retuned once rather than twice. *Still coupled to R4-a.*
- [ ] 🤖 **Journal cards should use each article's hero art** (Design #14). Blocked at the time on
      seven missing journal heroes; **all 19 articles are photographed since V4**, so this one is
      probably now doable and is the most likely of the five to be worth doing.
- [ ] 🤖 **Consolidate six body-copy sizes** (UI #11). Judged a worthwhile token consolidation but a
      10+ file sweep, deferred as unnecessary risk late in that cycle. *Verify against the v3 type
      scale first — it may already be resolved or may need redoing differently.*

## 🅿️ Parked, and fine to leave parked

- [ ] 🧑 **Three R4 design calls** from the 2026-07-10 panel, each a yes or no: reorder Home so safety
      answers earlier than ~85% scroll depth (R4-a) · reuse the price band on Home after the compare
      table (R4-c) · a founder-credibility strip before the closing CTA (R4-e).
- [ ] 🧑 **Backlinks** (V3-i), parked at the founder's instruction. A new domain ranks on authority it
      does not have yet; the realistic first wave is directory and listing submissions plus any press
      from Elevate and NVIDIA Inception. Say the word and I produce the kit and tracker. (The
      `directory-submissions` skill is installed and ready.)
- [ ] 🧑 **Two optional Ahrefs buttons** (V4-d): keyword volumes need a plan upgrade, and connecting
      Search Console inside the Ahrefs project would surface real query impressions. The strategy
      depends on neither. Worth knowing: kheelona.com already ranks **#1 in India for "raising
      bilingual child in india"**.
- [ ] 🧑 **The Ahrefs tag is deliberately not host-restricted**, unlike GA4, because Ahrefs verifies
      by fetching the page. So local and preview page views appear in the Ahrefs numbers. Say the
      word and I restrict it and verify another way.

---

## Recovering anything removed in the 2026-08-23 cleanup

Deleted deliberately, all recoverable from git history, listed so nobody wonders where they went:

| Removed | Why | Recover from |
|---|---|---|
| `docs/revamp-2026-07/PLAN-V6.md` | A 618-line step-by-step build plan, fully executed on 2026-07-31. Its 60 unticked boxes were executed steps, not open work. The spec (`BUILD-V6.md`) and the checkpoint survive. | the cleanup commit's parent |
| `docs/revamp-2026-07/HANDOFF-design-v6.md` | A design micro-polish list the file itself records as implemented the same day it was written. | same |
| `docs/revamp-2026-07/QA-V6-note.md` | An independent content review whose four blockers were all fixed. Compressed to one line in `docs/qa-report.md` before removal. | same |
| `src/components/vendor/animate-ui/backgrounds/hero-glow.tsx` | The only source file in the tree with no importer. | same |
| `public/brand/kheelona-wordmark-white.svg` | Unreferenced. A dark-background wordmark variant, if one is ever wanted again. | same |
| `public/products/lori.png`, `lua.png`, `robu.png` | The pre-V3 line-up characters. The published line-up is Lumi → Kheelu Speaker → AI books. | same |
