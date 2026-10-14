---
title: "CMO built-page review, group C (task 7.1): the four legal pages and the store host (store, /thanks, /e/<tier>, the store's not-found page, /ideabaaz)"
type: qa
updated: 2026-10-14
sources:
  - ../raw/brief/kickoff-brief.md (section 4 non-negotiables; section 6, CMO Reviewer)
  - ../brand/positioning.md, ../brand/messaging.md (confirmed candidate lines, words to stop using), ../brand/voice.md, ../brand/audience.md (objections)
  - ../site/strategy.md (§1, §2 rule for every page, §3.2, §5 store and policy rows, §6 issues 2-4 and 9), ../site/content-boundary.md, ../product/claims.md (§4)
  - ../decisions/D050-whatsapp-chat-button.md, D051-beta-without-store-integrations.md, D054-founder-answers-open-questions-2026-10-14.md (items 6, 7, 10, 12), D055-page-facts-legal-setup-product-2026-10-14.md (items 1-24)
  - ../site/pages/privacy.md, refund.md, shipping.md, terms.md, store.md, store-confirmation.md, 404.md
  - ../qa/deviations.md (V1, V4, V5, V10-V14), ../qa/cmo-review-page-facts-6.7-2026-10-14.md (B1, B2, M1-M14), ../qa/test-plan.md (§6.3, §6.4)
  - "mockup/pages/{privacy,refund,shipping,terms,store,store-confirmation}.html and their built copies mockup/*.html (frozen, D046)"
  - "Local production build, main checkout, branch reset/website-v2 at 229e6d3 (.next BUILD_ID G4RikeesMHpGqaQPS4YHg, built 2026-10-13 19:02 PDT); storybook-static built 19:02 PDT. Not rebuilt."
  - "Server A: next start -p 3573 with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY blank (legal pages, the store without keys, /thanks link-needed, the store dead end, /ideabaaz). Server B: next start -p 3593 against 6.1's read-only stand-in (test/e2e/support/store-stand-in.ts) on 3594 with fake values only (store token mode, the signed event page /e/kh-e2e-expo, the refused link, the /thanks cannot-open state from a fake-secret session). Storybook static on 3595 (story layouts-storeshell--thanks-paid, fixture test/fixtures/store/thanks-paid.ts). Nothing typed, ticked or submitted; no payment opened; every third-party request, /ingest and /_vercel aborted. All four servers stopped after capture (local clock 2026-10-13 19:20-19:55 PDT)."
  - "Screenshots: wiki/raw/qa/2026-10-14/cmo-built/c/ (515 files, local only, never committed, D039), Playwright 1.63.0, deviceScaleFactor 1, viewport chunks at 360x640, 390x844, 412x915, 1366x768, 1440x900; mockups at 390 and 1440; chunk heights in _chunk-log.txt"
---

# CMO built-page review, group C (2026-10-14)

**Verdict: FAIL, 2 blocking issues** (one for the Builder and QA, one waiting on the founder's answer), 10 minor
issues. Every D055 fact on `/privacy`, `/refund`, `/shipping` and `/terms` is on the built page as the founder gave
it, with nothing softened or added. The deleted-conversation sentence D055 item 17 asks for is plain. The store
passes the five-second offer test at 360 px, has one orange button and looks calm. `/thanks` says what happened and
what comes next. Both not-found pages give the parent a way back.

This review checks the built pages against the positioning and the founder's decisions. Only the founder signs off
copy ([D015](../decisions/D015-founder-signs-off-copy.md)), and nothing here replaces that sign-off. Lighthouse is
the main session's and was not run. Parity, axe and the sideways-scroll checks are proven by the suites; my own
capture found no sideways scroll at any width (`_chunk-log.txt`).

**Not re-raised (known and open with the founder):** G16-G18; the D029 sign-off, including the "Draft for the
founder's approval; not legal advice." note at the top of all four legal pages (6.7 M8); the hidden F4 rows.

## Blocking

### B1. The WhatsApp bubble covers prices on the store and the event page at 360 and 412 px (→ Builder; QA for the guard)

- **Evidence:** I opened the store's four answers and scrolled in 40 px steps. At each step I tested whether the
  resting bubble (`a.ks-wa`) overlapped a "₹" amount in `<main>`.
  - **Store at 412 × 915:** the bubble covers "₹4,999" in the agreement card ("A refundable advance, part of the
    ₹4,999 price") at y = 720-760 (`store-bubble-over-price-412.jpg`). It covers "₹4,500" in the answer to "What am
    I paying today?" at y = 1400-1440 (`store2-bubble-over-price-412.jpg`).
  - **Event page:** at 360 × 640 it covers "₹4,999" in the open answer at y = 1760-1800
    (`event-bubble-over-price-360.jpg`). At 412 × 915 it covers "₹4,999" in the card at y = 720-760
    (`event-bubble-over-price-412.jpg`).
  - **Clean:** the store at 360 and 390, and `/thanks` (paid story) at 360, 390 and 412. The bubble was at rest in
    every capture, not caught mid-move.
- **Why it blocks:** [D050](../decisions/D050-whatsapp-chat-button.md) says on phones the bubble "never covers the
  bar, the price, a form field or the pay button". The marketing pages honour this: the bubble steps aside from
  `.ks-price` and the offer card (task 4.9). The store is the page where the money is read, and there it steps aside
  only from the form. Beta shows the store without keys (D051), so the founder cannot see this at Gate B, but
  production will show it.
- **Cause:** `src/components/chrome/WhatsAppFloat/WhatsAppFloat.tsx:42` sets `store: "#details"`. At < 900 px the
  agreement card (`.ks-agree`) and the questions (`.ks-faq`) render after `#details`, outside it. The guard's
  list in `test/e2e/chrome.spec.ts:358-370` (`NEVER_COVERED`) names neither, and the guard checks only at
  360 × 590.
- **Fix:**
  - **Builder:** change line 42 to `store: "#details, .ks-agree, .ks-faq",` and update the `store` bullet of the comment
    at :35-36 to match. This one change covers the store and `/e/<tier>`, since both use the `store` context.
  - **QA:** add `.ks-agree` and `.ks-faq details[open]` to `NEVER_COVERED`. Add a store and signed-event scroll
    sweep at 360, 390 and 412 with the four answers open. Prove the sweep red against today's selector before
    trusting it.

### B2. `/privacy`'s short version, its Section 8 and `/terms` §10 still read as if one tap deletes a conversation completely (→ founder's answer first, then Copywriter, then Builder)

- **Evidence:** Section 9 now says it plainly, as D055 item 17 asks: "It is not removed from Kheelu's memory, or from
  the data our model trains on." (`privacy-360-21.jpg`). But at 360 px a parent reaches that line on screen 22 of 30
  (18,612 px; `_chunk-log.txt`). Earlier lines say the opposite without the limit:
  - **Short version card 5, screen 3** (`privacy-360-02.jpg`): "You can read and delete every conversation. Delete
    any of them in one tap." Source: `src/content/en-IN/legal/privacy.ts:88`, copy `privacy.md:118`.
  - **Section 8, screen 21** (`privacy-360-20.jpg`): "You can delete any of them sooner, in one tap." Source: the
    shared `RETENTION_LINE`, `src/content/en-IN/policies.ts:49`.
  - **Section 8 list, screen 21:** "Conversation transcripts: 36 months, then deleted automatically, unless you delete
    them sooner." Source: `privacy.ts:409`, copy `privacy.md:501`. This implies deleting ends our keeping of the
    transcript. The founder took that question off the page (D055 item 17).
  - **New in this review:** `/terms` §10 (`terms-390-08.jpg`): "In the app, you can read every conversation and
    delete any of them in one tap." Source: `src/content/en-IN/legal/terms.ts:301`, copy `terms.md:381`.
- **Why it blocks (my escalation of 6.7 M1, which rated this minor):** the built page shows how few parents reach
  Section 9. Saying the honest limit where the claim is made is the voice rule ([voice](../brand/voice.md) rule 7).
  D055 item 17 asks that the one-tap delete "is not read as more than it is". On a children's-data policy, the
  summary is what parents read.
- **Fix:** the founder answers `privacy.md` questions 6 and 7 (both recommend (b)). Then the Copywriter:
  - **privacy.ts:88:** add "Deleting one doesn't remove it from Kheelu's memory or our training data."
  - **privacy.ts:409:** change the line to "36 months, then deleted automatically."
  - **terms.ts:301:** after "in one tap.", add "Deleting one doesn't remove it from Kheelu's memory or our training
    data."
  - **After the Section 9 paragraph (privacy.ts:434):** add question 7's line, "To take your child's conversations
    out of our training data, turn training off in the parent app."
  - Mirror each change in `privacy.md` and `terms.md`.
  - The shared `RETENTION_LINE` (`policies.ts:49`) renders on 9 surfaces: Home, the product page, `/safety`, four
    articles and `/privacy`. Whether those also take the limit is a site-wide founder call (main session). On
    `/privacy` itself, Section 8's lead can use its own line.
  - The Builder re-pins the parity rules for the changed sentences (`test/e2e/support/page-facts.ts`
    `PAGE_FACTS.privacy` and `.terms`), and the main session lists them under V11 and V14.

## Verdict per page and criterion

Key: **P** pass · **F** fail (blocking, above) · **m** pass with a minor issue (below) · n/a.

### The four legal pages

| Criterion | /privacy | /refund | /shipping | /terms | Screenshots |
|---|---|---|---|---|---|
| D055's facts exactly, nothing softened or added | P | P | P | P | text checked line by line below |
| Deleted-conversation sentence (D055 item 17) plain | P (Section 9) | n/a | n/a | n/a | `privacy-360-21` |
| No line reads as more than D055 allows | **F** (B2) | P | P | **F** (B2, §10) | `privacy-360-02`, `-20`; `terms-390-08` |
| Plain, honest English a parent can act on (short version first, contact in every section that needs it) | m (6.7 M2, M14 still open) | P | P | m (6.7 M7 still open) | `privacy-360-00…03`, `refund-390-00…01`, `shipping-360-00`, `terms-360-00…02` |
| Says the positioning to parents of 3-7 (ages, no banned words, D020 facts) | P | P | P | P | text dump; banned-word scan clean |
| One obvious next step (close: Meet Kheelu, no orange button or bar, by design) | P | P | P | P | `privacy-360-26`, `refund-360-11` |
| Matches the approved mockup with V10-V14 (phone first, laptop) | P | P | P | P | `privacy-*` vs `mock-privacy-390/1440-*`; `refund-390-00` vs `mock-refund-390-00`; `refund-1440-00` vs `mock-refund-1440-00`; `shipping-1440-00`; `terms-390-*` vs `mock-terms-390-*` |
| Internal leakage (page, meta, JSON-LD) | P | P | P | P | JSON-LD is Organization and WebSite only; "first 500 units" only as an offer term on /terms (D041) |
| Motion | P (none, as the mockup) | P | P | P | motion probe: no reveal, draw or animation on any of the four |

**How each page meets D055** (built text, read 2026-10-13 from server A):

- **/privacy.** Item 12: the training switch, the two founder sentences word for word, "changes nothing else", the
  purpose, "India, on Google Cloud". Item 13: recordings used for nothing else, kept 36 months. Item 14: first name
  and age, phone with a one-time code, device ID, Wi-Fi name "(not its password)", phone model and OS. Item 15: the
  consent sentences. Item 16: providers not named, no "on request". Item 17: Section 9. Items 18-21: account
  closure, unpaid and paid orders, PostHog 30 days. Item 22: two confirmed security lines. Item 23: the breach
  sentence. Item 24: the recipients' table, with Meta "The United States and other countries" (6.7 B2 applied).
  Items 7 and 8: no complaint reference; "Last updated: 14 October 2026". D054 item 10 (V10) is in Section 5;
  item 12, "What blocking can't stop.", is in Section 6.
- **/refund.** Items 1-8 all land: refund in full; free return leg; warranty from delivery; no repair-and-replace
  backstop, with the 7-day faulty line kept; "reaches you within 7 working days of your Kheelu reaching us";
  "we'll talk to you before deciding the refund"; no complaint reference; the date. `#chargeback` exists for the
  store's link.
- **/shipping.** Item 9: the lost-parcel slot is gone, and "If the tracking stops moving or the parcel doesn't reach
  you, call or message us with your order number." stays. Items 7 and 8 also apply.
- **/terms.** Item 10: only "Prices include GST." and "Every order gets a GST invoice." Item 11: the switch in the
  parent app. Items 7 and 8 also apply.

### The store host

| Criterion | Store (token mode) | /thanks paid (story) | /thanks without an order | /e/<tier> signed | Store not-found and /ideabaaz | Screenshots |
|---|---|---|---|---|---|---|
| Five-second offer test on a phone: price incl. GST, paid today, due, mid-November, returns | P (all in the first 360 × 640 screen) | P (order card on screens 1-2) | n/a | P (₹99 today, ₹4,900 before delivery, ₹4,999 incl. GST) | n/a | `store-360-00`, `store-390-00`, `thanks-paid-360-00…01`, `event-360-00` |
| One obvious next step per screen | P (one orange button: "Pay ₹499 and reserve") | P ("Save my address") | P (link-needed); m (cannot-open, m4) | P | P ("Go to the pre-order page", then WhatsApp with the order number) | `store-360-01`, `thanks-linkneeded-360-00`, `thanks-cannotopen-360-00`, `store-404-360-00`, `ideabaaz-360-00` |
| Buy in a few taps (4 fields, 1 tick, pay) | P | n/a | n/a | P | n/a | `store-360-00…01` |
| Calm, trustworthy look; seller, help and policies easy to find | P (header help, help line beside the button, seller and grievance footer, V1 payments line) | P | P | P | P | `store-360-02`, `-06`, `store-1366-00…01`, `store-1440-00` |
| Says what happened and what comes next | n/a | P (three steps, then help and the risk reversal) | P ("We need your link again." / "We cannot open that order right now.") | n/a | P | `thanks-paid-360-03…04`, `thanks-cannotopen-360-00` |
| Positioning, 3-7, D028 price wording | P | P | P | m (refused-link line, m1; the eyebrow loses "Ages 3 to 7", m2) | m (m6) | `event-refused-360-00` |
| Matches the approved mockup with V1, V4, V5 | P | P | n/a (no mockup) | n/a (no mockup; the store's folds) | n/a (no mockup) | `store-390-00` vs `mock-store-390-00` (V4: the note is off); `store-1440-00` vs `mock-store-1440-00`; `thanks-paid-1440-02` vs `mock-thanks-paid-1440-02` (V1) |
| D050 bubble never over a price, field or pay button | **F** (B1, at 412) | P | P | **F** (B1, at 360 and 412) | P | `store-bubble-over-price-412`, `store2-…-412`, `event-bubble-over-price-360`, `-412` |
| Internal leakage (page, meta, OG) | P (noindex; meta leads with ₹4,999 incl. GST, D028) | P | P | P (no amount in the meta) | P | text dump |
| Motion: elegant, never on price or CTA | P (only the films strip reveals; FAQ opens smoothly; reduced motion hides nothing) | P (bubble step-aside, 200 ms) | P | P (no reveals) | P | motion probe |

**Also checked, no issue found:**
- The store without keys, which is what the founder sees on betastore at Gate B (D051): "Pre-orders open here
  shortly.", a WhatsApp button and nothing charged (`store-noconfig-360-00`).
- The store's four answers match `/refund` on cancellation timing (`store-faq-open-390-00…02`).
- The event answers take the tier's ₹99 and ₹4,900 (`event-faq-open-390-*`).

## Minor issues

| # | Page | What is wrong | File and line | Fix (route) |
|---|---|---|---|---|
| m1 | /e/<tier>, refused link | "This link is not one of ours. You can pre-order at ₹499 on this page." This puts ₹499 next to a button with no ₹4,999 total ([D028](../decisions/D028-price-wording.md)). It would be false in full mode. "On this page" is wrong, because the button takes the parent to the store. The "expired" and "full" lines also say "on this page", and "cap-reached" says "Refresh this page" (`event-refused-360-00`) | Words in the frozen `src/lib/store/tiers.ts:133-145` (byte-identical to the tag); shown by `src/app/store/e/[event]/page.tsx:58` | Leave `tiers.ts` alone. Copywriter adds per-reason panel bodies to `src/content/en-IN/store/event-page.ts` `refused` with no amount and true in both modes. For example, "This link is not one of ours. The button below takes you to our store, at the usual price." and "This event link has expired. The button below takes you to our store, at the usual price." Builder passes them as `body` at page.tsx:58 instead of `tierRefusalMessage` (presentation only; regenerate and review the checkout signature, ADR-013) |
| m2 | /e/<tier> | The tier's name ("Bangalore expo price") replaces the eyebrow "Ages 3 to 7", so the age band leaves the first screen and appears only in the age hint (`event-360-00`) | `src/app/store/_components/TierCheckout.tsx:69` | Keep "Ages 3 to 7" and show the tier name with it. For example, eyebrow `{tier.label} · Ages 3 to 7`, or the tier name as a line under the H1 (Builder; Copywriter for the words) |
| m3 | /e/<tier> without keys (beta) | The only action is a muted text link, and the page still prints "No payment fees… Payments by Razorpay." where nothing can be paid. The store page's own not-configured state has a WhatsApp button and no payments line (`event-noconfig-360-00` vs `store-noconfig-360-00`) | `src/app/store/e/[event]/page.tsx:53` | Render what `src/app/store/page.tsx` `NotConfiguredState` renders (its secondary WhatsApp button as `action`, its note, the bubble, no `StorePaymentsLine`) (Builder) |
| m4 | /thanks, "We cannot open that order right now." | A parent who has paid and cannot see their order gets only a 14 px muted link, "Message us on WhatsApp…", and no call option. The link-needed state offers "WhatsApp or call +91 91875 46483" (`thanks-cannotopen-360-00`) | `src/app/store/thanks/page.tsx:125`; words `src/content/en-IN/store/confirmation.ts:99-102` | Pass the secondary WhatsApp button as `action`, as the store's not-configured state does. Add "or call +91 91875 46483" to the line, from the seller source (Builder; Copywriter for the line; presentation only, ADR-013) |
| m5 | /thanks, states without an order | The browser tab says "Your Kheelu is reserved · Kheelona" on "We need your link again." and "We cannot open that order right now." too. A parent whose payment failed would read "reserved" in the tab | `src/content/en-IN/store/confirmation.ts:61`; `src/app/store/thanks/page.tsx:89` | Use a title true in every state, "Your Kheelu pre-order · Kheelona", and update `store-confirmation.md` (Copywriter, then Builder) |
| m6 | Store not-found, including `/ideabaaz` | "The link may have expired, or it may never have been ours." A parent scanning an Ideabaaz QR code we printed reads "never ours", which can sound like a scam warning (`ideabaaz-360-00`). The founder accepted the page as built (D054 item 7), so this is optional | `src/content/en-IN/store/event-page.ts:98-99` | "The link may be old or mistyped. If you were trying to reach an order you have already placed, we can open it for you." (Copywriter; founder's call) |
| m7 | Store, `/thanks` payments line → `/refund#chargeback` | The link promises "How to raise a chargeback with your bank". The target says only that "You can also raise a dispute (a chargeback) with your bank or card issuer." | `src/content/en-IN/legal/refund.ts:233`; copy `refund.md:277` | Add one general how-to sentence that names no Kheelona fact: "To do that, contact your bank or card issuer (the number on your card, or your bank's app), say you want to dispute the payment, and give its date and amount." It is a new line on a legal page, so it needs the founder's OK (Copywriter, via the main session) |
| m8 | Store trust row (and every page's) | "6-month warranty" and "7-day returns" land at the top of `/refund`. The warranty is section 3, about 4 screens down at 360 px. Payment lands at the top of `/terms`. | `src/content/en-IN/trust.ts:11-29` (and `trust.test.ts:45`) | Deep links: returns → `/refund#returns`, warranty → `/refund#faulty`, payment → `/terms#payment`, deliveries → `/shipping#when`, delivery included → `/shipping#where`. This is `refund.md` shared request 2, optional, and the row is shared site-wide (Builder) |
| m9 | /privacy, /terms | Still on the built page from the 6.7 review, each waiting on a founder question in `privacy.md`. Listed so they are not lost; not re-raised. Consent says the same thing twice (`privacy.ts:181`, Q8, 6.7 M2). `/terms` "processed within 7 working days" vs `/refund` "reaches you" (`terms.ts:267`, 6.7 M7). The first-name purpose (Q10, M14). The Google Cloud row (Q9, M3). The Vercel region (M13) | as listed | As recommended in the 6.7 review, once the founder answers (main session → Copywriter) |
| m10 | Wiki | [deviations](deviations.md) V11 still says Meta's region is "the United States, Ireland and other countries". The build and `privacy.md:447` say "The United States and other countries" (6.7 B2 applied) | `wiki/qa/deviations.md:27` | Main session corrects V11 |

## Needs the founder

1. **B2: the delete limit.** Answer `privacy.md` questions 6 and 7 before Gate B. Decide whether the same one line
   also goes on `/terms` §10 and on the shared retention line that Home, the product page, `/safety` and four
   articles print.
2. **The in-app browser note has no way to be switched on.**
   - The note is built but off (V4). It ships only after QA's real-device check (test plan §6.4, working default B12).
   - That check cannot run on beta, which has no Razorpay (D051). The founder declined a check on real phones after
     launch (D054 item 6).
   - So the fix for the audit's #2 revenue leak never ships: unpaid orders came only from WhatsApp and Instagram
     browsers, and WhatsApp's browser is 35.7% of phone sessions ([strategy §6](../site/strategy.md#6-how-each-top-posthog-issue-gets-fixed)
     issue 2).
   - Choose: (a) switch it on now on that evidence (it is presentation only and shows only in those browsers);
     (b) accept that it stays off. **I recommend (a).** Words: `store.md` fold 2; switch:
     `src/content/en-IN/store/in-app-note.ts:12`.
3. **m6** (the /ideabaaz dead-end line) and **m7** (the chargeback how-to sentence) need the founder's yes: one
   changes a page the founder accepted as built, and the other adds a line to a legal page.

## Not reviewed here, and why

- **The store in full mode and the price-flip refusal.** The stand-in reports 0 paid orders, so only token mode
  renders. The frozen route tests and test plan §6.3 cover the rest.
- **The /thanks confirming state and full-mode order.** Both need an order. The copy is checked against
  `store-confirmation.md`.
- **Form error states.** Seeing them means pressing pay, which this review never does. The live words are on
  `store.md`.
- **Lighthouse.** The main session runs it.

## How this was captured

Playwright 1.63.0, scratch scripts in the session scratchpad (`cmo-c/`): `text.mjs`, `shots.mjs`, `faq.mjs`,
`bubble.mjs`, `bubble2.mjs`, `motion.mjs`, `cannot.mjs`. Viewport chunks at 1x, never one full-page image. Phones
were emulated as mobile with touch. Pages were captured after network idle, with 750 ms after each scroll for
reveals. The servers and stand-in are listed in the front matter, and all four were stopped after capture.
