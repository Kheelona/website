---
title: "Legal review of the /refund and /shipping mockups (group legal-b), 2026-10-11"
type: qa
updated: 2026-10-11
sources:
  - ../../mockup/pages/refund.html and ../../mockup/pages/shipping.html (Gate A drafts, read 2026-10-11)
  - ../site/pages/refund.md and ../site/pages/shipping.md (copy sources and founder questions)
  - ../product/legal-requirements.md (§1 H2, H3; §2.1 to §2.8 rows; §3 dark-pattern checks; §4 /refund and /shipping checklists)
  - ../product/policies.md (Decided for the new site; Founder answers of 2026-10-11; Seller details)
  - ../decisions/D018 to D043 (read 2026-10-11; D021, D022, D023, D024, D028, D029, D030, D032, D033, D034, D035, D037, D041, D042 apply directly)
  - ../site/gate-a-open-items.md (§1, §3 B43, B44, B47; §5 lint backlog)
  - ../raw/feedback/2026-10-11-gate-a-answers.md (lines 59-65, Policy)
  - "Cross-page check: mockup/pages/home.html, meet-kheelu.html, store.html, store-confirmation.html, privacy.html, team.html, mockup/partials/footer.html, drawer.html, buybar.html; wiki/site/pages/terms.md, contact.md; wiki/brand/messaging.md (read 2026-10-11)"
  - "node mockup/build.mjs refund shipping && node mockup/tools/check.cjs <scratchpad>/pages-check/legal-b refund shipping (2026-10-11): screens at 360, 390 and 1440 px; no sideways scroll; 0 page errors; axe clean on phones; laptop shows only the D041 accepted exception"
---

# Legal review: /refund and /shipping mockups (2026-10-11)

**A check against the law's own text as recorded in [legal requirements](../product/legal-requirements.md),
not legal advice.** The founder approves these pages himself ([D029](../decisions/D029-grievance-officer-legal-review.md)).
INTERNAL page ([D013](../decisions/D013-internal-vs-external-content.md)). I edited no page; this is the review only.

## What you need to know

1. **Both pages: pass with fixes.** Every value matches the decisions and every other page (refund
   start 2 working days, bank 5-7 working days, refund 7 working days after a return reaches us, 7-day
   returns from delivery, 6-month warranty, free pickup, no exchanges, no payment fees, grievance 48 hours
   and one month, seller block). No em dashes, no banned words, no Kheelona+, no certification claim, no
   date tied to a licence. Both are easy to scan on a phone.
2. **One broken link to fix on /refund now.** The store footer and the confirmation page link to
   `refund.html#chargeback` (`store.html:218`, `store-confirmation.html:150`). That id does not exist, so the
   chargeback route (Rule 7(1)(c)) lands at the top of the page. Fix: add `id="chargeback"` to the chargeback
   paragraph in section 6 (`refund.html:123`).
3. **One wording conflict on /refund (Rule 7(4)).** Section 3 promises "a replacement or a full refund" for a
   faulty unit, with no time limit (`refund.html:92`). The warranty paragraph below it says that after day 7
   "we repair it, or replace it" (`:96`). So a parent with a fault in month 4 reads two different remedies.
   And nothing says what happens if the replacement fails too. The founder must rule on this (refund.md
   question 4).
4. **Three founder answers are needed before the founder can approve the text** (legal approval only; the
   placeholders are correct for Gate A):
   - Is a change-of-mind return refunded in full? The page says only "your refund".
   - What happens to a return that comes back damaged or incomplete? (Placeholder at `refund.html:86`.)
   - What happens to a parcel lost in transit? (Placeholder at `shipping.html:106`.)
5. **Another page breaks Rule 7(4).** The Meet Kheelu FAQ says "Arrived faulty? Tell us within 7 days and
   we replace it." (`meet-kheelu.html:357`). That offers a replacement only. It contradicts /refund and the
   legal review (H2), and `brand/messaging.md:252` still lists the line as publishable. Send this to that
   page's owner.

## Method

- Read both built pages line by line against legal requirements §4 (the /refund and /shipping checklists),
  every §2 row that names /refund or /shipping, the §3 dark-pattern table, policies "Decided for the new
  site", and D018 to D043.
- Checked every refund, return, warranty, delivery, payment, grievance and seller statement on the other
  built pages, the partials, and the terms and contact copy drafts.
- Built the pages and ran the check tool. I read the phone screenshots at 390 px (all 10 for /refund; the
  section shots for /shipping) and one laptop screenshot.

## /refund

### Requirement by requirement

| ID | Requirement | Verdict | Where (refund.html) |
|---|---|---|---|
| ECOM-01 | Legal name, address, website, customer-care email and phone | **Met** | §8 :138-139; footer. Launch dependency: +91 91875 46483 must take calls before go-live ([D032](../decisions/D032-grievance-block-and-call-line.md)) |
| ECOM-02 | Grievance officer's name, designation and contact | **Met** | §7 :131, D032 verbatim |
| ECOM-03, DATA-03 | Acknowledge in 48 hours, resolve in one month | **Met** | :131; "5 days" and "30 days" absent. From 1 Jan 2027 add "We send you a copy of your complaint as we recorded it." (G.S.R. 789(E)) |
| ECOM-04 | A ticket number for each complaint (Rule 7(1)(f)) | **Not met** (correctly not promised: none exists) | Founder question 7 below |
| ECOM-05 | Accurate return, refund, exchange, warranty, delivery, return-shipping cost, payment and grievance information (Rule 7(1)(a)) | **Met, with two gaps** | All topics covered §1-§7. Gaps: (a) the change-of-mind refund amount is not stated (:84, :113); (b) who pays to send a repaired or replacement Kheelu back (D033 covers only the pickup) |
| ECOM-06 | Never refuse to take back and refund defective, misdescribed or late goods (Rule 7(4)) | **Partly met** | Callout :92 and first-7-days :94 meet it; the date-moves and can't-supply refunds :73 meet the late case. Gap: the warranty paragraph :96 reads as repair or replace only after day 7, and "not as described" found after day 7 falls under no stage |
| ECOM-07 | Accurate delivery information | **Met** | :73 renders `DELIVERY_TEXT`; no arrival date |
| ECOM-08 | Total price and breakup | Not this page (store and product page; CA) | :71 gives the ₹4,999 total (incl. GST) |
| ECOM-09 | Methods, security, fees, recurring, chargeback, provider contact (Rule 7(1)(c)) | **Met** | §6 :121-123 (D042 line verbatim; Razorpay support link). Inbound `#chargeback` anchor broken (must-fix 1) |
| ECOM-10 | No cancellation charge; refund in reasonable time; refund start stated | **Met** | :68-69 ("no fee, no deduction"; "within 2 working days"); :112-114 |
| DARK-01 | No false urgency or scarcity | **Met** | None on the page; no pre-order button in the body |
| DARK-03 | Every price element upfront; "refundable" beside ₹499; no "just" or "only" | **Met** | :68, :71 |
| DARK-04 | Kheelona+ | Not on the page (D041) | Silent, as ruled |
| PRICE-01 | No struck-through price or "save" | **Met** | No MRP or saving shown |
| GST-01 | "GST invoice with every order" only once the CA has vouchers and invoices running | **Launch dependency** | :122 ([D024](../decisions/D024-payment-methods-gst.md) confirms the promise; the terms draft keeps the detail as a placeholder) |
| BIS-01, BIS-02 | No date tied to a licence; no certification claim | **Met** | None |
| DATA rows | No data claim beyond payment handling | **Met** | :122 ("go to Razorpay, not to us") matches /privacy; no retention or training line, as D035 allows |

### Legal requirements §4 checklist for /refund

| Checklist item | Verdict |
|---|---|
| Before dispatch: refundable any time, no fee, no reason, how to ask, refund start, bank time, same method | Met (:68-69, :110-114) |
| Unpaid balance treated as a cancellation; advance refunded | Met (:71) |
| Can't deliver or date moves: full refund | Met (:73) |
| Change of mind: 7 days from delivery, no questions asked, opened fine if undamaged and complete with the box | Met (:79, D021 verbatim plus D041 box contents) |
| Faulty, damaged, not as described: replacement or full refund; 7-day report for the on-arrival case; D021 conditions don't apply | Partly met. The remedy is stated (:92, :94), but the page never says the change-of-mind conditions don't apply here (should-fix 1) |
| Warranty: 6 months, manufacturing defects, not drops, water, misuse; remedy after day 7 | Met in content (:96, D022 and D033), but conflicts with :92 (must-fix 2) |
| Exchange stated | Met (:104, D042) |
| Return pickup and its cost | Met (:83, :98 "free", D033) |
| Refund after a return: 7 working days of the unit reaching us | Met (:84, :113, D022) |
| Defect period printed on the invoice | Not a page item (invoice template; founder and CA) |
| Same source for JSON-LD return policy | Build phase |
| Seller block and grievance block, with complaint reference | Blocks met; reference not met (ECOM-04) |

### Decisions

D021, D022 (no repair or replacement timeline: met at :98), D023, D024 (no wallets, EMI or Pay Later), D028,
D029 and D032 (block verbatim), D033 (free pickup; "replacement or a full refund" line verbatim), D041 (box
contents; no Kheelona+) and D042 (all three lines verbatim): **all applied**. D035: no training or
retention claim, and nothing that implies the opposite. There is one decision-level conflict, inside the
page: D033 contains both the after-day-7 process and the Rule 7(4) line, and the page does not reconcile
them (must-fix 2).

### Unsourced or applied readings presented as settled

- "6-month warranty ... from the day it's delivered" (:96). This is an applied reading of D022 (first 7 days
  "of receipt") and D033 ("after the first 7 days and within 6 months"). It is reasonable, it favours the
  buyer, and it is founder question 3 in refund.md. It is not marked on the page, so the founder may approve
  it without noticing (should-fix 2).
- Everything else is sourced. "KH-" order prefix: checkout.md. "Asked twice over two weeks", "not a credit
  or a voucher" and "you hear it from us first": the live /refund. Razorpay "Customer" option: GET
  2026-10-11.

### Misleading by omission and dark patterns

- "Your refund is processed within 7 working days" (:84, :113) never says how much. With "no questions
  asked" and D021's "without risk", a parent reads it as a full refund. If any deduction is ever made, the
  page misleads by omission (must-fix 3).
- "Undamaged" (:79) is undefined for a plush toy a 3-year-old has played with for a week. A rejected
  "no questions asked" return over play marks would be a dispute and a misleading-claim risk. Fold this
  into the section 2 placeholder answer (founder question 2).
- "Processed" (returns) and "start" (cancellations) sit in the same list (:112-114). The next line says
  "once we've started it, your bank takes 5-7 working days". If "processed" means the money lands, the bank
  line adds time the founder never stated; if it means started, use the same word (should-fix 3).
- The live line "We never make you call a number to cancel something you did in two taps" (legal review §3:
  "Passes; keep") was dropped. A short "a message or an email is enough; you never have to call" keeps that
  ease-of-cancellation signal (should-fix 5).
- No confirmshaming, false urgency, hidden cost or forced action. The close uses a secondary button and no
  chilli button.

### Plain-English summary against the full text

All five summary items (:37-41) are faithful. Item 4 ("We repair it, or replace it if the repair doesn't
work") carries the same conflict with item 3 as the body (must-fix 2). The summary leaves out refund
timing, the most-asked money question; one line would help (should-fix 7).

### Phone readability

Good. There is a one-line draft note, an H1, a "Last updated" placeholder, a five-item summary and a
contents list (8 links, 44 px rows). Then come numbered H2 sections with H3 sub-heads, a 3-step return list
and paragraphs of 2 to 4 sentences. It works without JavaScript. The page is 7,993 px tall at 390 px, with
no sideways scroll and no axe findings. One note: the decorative Kheelu art pushes the summary heading below
the first phone screen (about 830 px down). Moving or hiding the art on phones would put the summary in the
first view (should-fix 8).

## /shipping

### Requirement by requirement

| ID | Requirement | Verdict | Where (shipping.html) |
|---|---|---|---|
| ECOM-01 | Seller details | **Met** | §7 :113-114 |
| ECOM-02, ECOM-03 | Grievance officer displayed; 48 hours and one month | **Met at platform level, not on the page** | :115 links to /contact; the footer links too. Rule 4(4) is platform-wide and D032 does not list /shipping, but legal requirements §4 lists "Seller block and grievance block" for /shipping (should-fix 1) |
| ECOM-05 | Delivery and shipment, payment modes, return-shipping cost | **Met** | §1-§4; payment modes :82; free pickup for damaged units :105, with links to /refund |
| ECOM-06 | Rule 7(4): late, defective goods | **Partly met** | Date moves :103, can't supply :104 and damaged on arrival :105 are met. Lost in transit is a placeholder (:106, must-fix 1) |
| ECOM-07 | Accurate delivery information | **Met** | :38 and :68 render `DELIVERY_TEXT`; no arrival date, transit time or schema date (D022, D037). The BIS-dependent date is an accepted risk (D030, D037); the date-moves refund (:103) is the mitigation and must stay |
| ECOM-08 | Total incl. taxes, delivery charges | **Met for this page** | "Delivery is included in the price, and prices include GST" (:75). The tax breakup belongs to the store and product page (CA) |
| ECOM-09 | Payment information | **Met by link** | Methods :82; fees and chargeback are on /refund §6 |
| DARK-01 | No false urgency | **Passes** | "the earlier you pre-order, the earlier yours leaves us" (:68) is true (dispatch follows order date); it is the page's one sales nudge (optional should-fix 4) |
| DARK-03 | Price elements upfront | **Met** | :41 and :82 put "refundable" beside ₹499 and the ₹4,999 total (incl. GST) in the same sentence |
| BIS-01 | No date tied to a licence | **Met** | None |

### Legal requirements §4 checklist for /shipping

| Checklist item | Verdict |
|---|---|
| Anywhere in India; not outside India | Met (:75-76) |
| Delivery start from one content value; accurate; independent of a licence | Met (:68). Existing token orders (F12) are out of scope (D030) |
| Cost: delivery included, incl. GST, nothing at the door | Met (:39, :75) |
| ₹4,500 balance by link before dispatch; nothing automatic; no card on file | Met (:82-84) |
| Tracking at dispatch; no transit-time promise | Met (:90-91) |
| Changing the address before dispatch | Met (:97) |
| Late delivery: cancel for a full refund | Met (:103) |
| Return pickup: link to /refund | Met (:105, :107) |
| Seller block and grievance block | Seller met; grievance is a link only (should-fix 1) |

### Decisions

D021, D022 (no transit time), D023 (one delivery value), D024 (methods; "no cash on delivery" stated as an
absence, which policies allows), D028, D033 (free pickup), D037 (schema date not printed) and D041 (no
Kheelona+): **all applied**. No contradiction.

### Unsourced facts

None. Every line traces to the live /shipping or /refund, checkout.md or a decision, as shipping.md's
source table records.

### Misleading by omission

- A dispatched parcel that never arrives is not covered by any ruling. The placeholder is correct; the
  answer must keep a full-refund option (Rule 7(4)) (must-fix 1).
- "If you're abroad and want one, message us and we'll tell you whether we can help" (:76) sits next to "We
  don't ship outside India" and hints at an exception that nobody has decided. Better: say a buyer abroad can
  send one to an address in India, which matches terms.md:178 ("a delivery address in India")
  (should-fix 5).

### Plain-English summary against the full text

All five items (:38-42) are faithful. Item 5 ("Refundable until dispatch") also covers the date-moves case.

### Phone readability

Good. It has the same structure as /refund: summary, contents list (7 links), numbered H2 sections, and bold
leads in §6 so the five cases scan as one list. It is 6,653 px tall at 390 px, with no sideways scroll and
no axe findings. The same hero-art note applies (should-fix 6).

## Cross-page consistency

Pages checked: Home, Meet Kheelu, the store, store confirmation, /privacy, /team, the footer, the drawer and
the sticky bar (built), plus the terms and contact drafts.

| Value | Agrees everywhere? |
|---|---|
| Refund start 2 working days, bank 5-7 (D042) | Yes (store FAQ, terms.md:282) |
| Refund 7 working days after a return reaches us (D022) | Yes (Home FAQ, terms.md:331-332) |
| 7-day returns from delivery; opened fine if undamaged and complete (D021) | Yes |
| 6-month warranty; after day 7, repair or replace (D022, D033) | Yes (Meet Kheelu FAQ, terms.md:328) |
| Faulty or not as described: replacement or full refund (D033) | **No: Meet Kheelu FAQ `meet-kheelu.html:357` says "we replace it" only**; `messaging.md:252` still lists that line as EXTERNAL |
| Free pickup (D033) | Yes |
| No exchanges; no payment fees (D042) | Yes |
| Grievance block, 48 hours, one month (D032) | Yes (store and confirmation footers, /privacy, contact.md, terms.md) |
| Seller details | Yes (footer partial, store footer) |
| "We don't ship outside India" | Built pages yes; **terms.md:179 adds "yet"**, which shipping.md dropped on purpose (no plan is confirmed) |
| Chargeback anchor | **No: `refund.html#chargeback` is linked 4 times (store and confirmation pages and their drafts) but the id doesn't exist** |

## Findings to act on

### /refund: must fix

1. Add `id="chargeback"` to the chargeback paragraph in section 6 (`refund.html:123`), or ask the main session
   to repoint `store.html:218` and `store-confirmation.html:150` to `#payments`. Adding the id is cheaper and
   needs no edit outside this group.
2. Reconcile section 3. The callout and short-version item 3 promise "a replacement or a full refund" with no
   time limit (Rule 7(4)); the warranty paragraph and item 4 offer only repair, then replacement, after day 7.
   This needs the founder's ruling (question 3). The recommended wording keeps D033's process and adds a
   backstop to the warranty paragraph: "If a repair and a replacement don't put it right, you get a full
   refund." Then the page never refuses a refund for a defective unit, and the callout stays true.
3. **Founder answer needed:** state the amount refunded on a change-of-mind return (question 1). The
   recommended wording is "a full refund of everything you paid", in §2 step 3, §5 and the summary.
4. **Founder answer needed:** fill the section 2 placeholder (`:86`, question 2) before the page is approved
   as legal text.

### /refund: should fix

1. Say that the change-of-mind conditions don't apply to a faulty or damaged Kheelu (legal requirements §4).
   Example: "The 'undamaged and complete' conditions above are for change-of-mind returns only."
2. Warranty start "from the day it's delivered": get the founder's confirmation (question 4), or mark it as an
   applied reading in the mockup.
3. Use one verb for refund timing in §5. If D022's 7 working days is when the refund starts, write "we start
   your refund within 7 working days of your Kheelu reaching us" (question 8).
4. Say whether sending a repaired or replacement Kheelu back is free (question 5). Rule 7(1)(a) asks for
   delivery information.
5. Add an ease-of-cancellation line, for example "A message or an email is enough: you never have to call."
   This replaces the live line that legal review §3 said to keep.
6. Complaint reference (ECOM-04, Rule 7(1)(f)): unmet. Once a reference exists, the grievance block adds
   "You get a complaint reference to track it." (question 7). From 1 Jan 2027, also add the
   copy-of-complaint line.
7. Short version: add one line on refund timing (2 working days to start after a cancellation, 7 working
   days after a return reaches us, then the bank's 5-7).
8. Phones: move or hide the decorative art so the short version starts in the first screen.
9. Launch dependencies (not page edits): the number takes calls before go-live (D032); the GST invoice line
   only once the CA has vouchers and invoices running (GST-01).
10. CROSS-PAGE, for the Meet Kheelu owner: `meet-kheelu.html:357` "Arrived faulty? Tell us within 7 days and
    we replace it." must become "...and you can have a replacement or a full refund" (Rule 7(4); legal review
    H2; D033). Retire the D022 line at `brand/messaging.md:252`. This is a legal must-fix on that page.

### /shipping: must fix

1. **Founder answer needed:** fill the lost-in-transit placeholder (`:106`). The recommended wording is "we send
   a replacement, or refund you in full if you'd rather", with no day count (Rule 7(4); D022 guardrail).

### /shipping: should fix

1. Show the one-value grievance block in §7 (legal requirements §4 lists it for /shipping), or at least point
   the link at `contact.html#grievance` once contact gets that id (refund.md shared request 1).
2. In the build, the meta description's "mid-November" must render from the delivery source, not be typed
   by hand ([D023](../decisions/D023-new-order-delivery.md)).
3. CROSS-PAGE, for the terms owner: terms.md:179 "we don't ship outside India yet" should drop "yet" to match
   /shipping, Home and the store.
4. Optional: drop "so the earlier you pre-order, the earlier yours leaves us" (`:68`). It is true and passes
   the false-urgency test, but strategy §5 keeps policy pages free of sales pushes.
5. Replace "If you're abroad ... we'll tell you whether we can help" (`:76`) with a line that matches the terms
   (an Indian delivery address), so it doesn't hint at an undecided exception.
6. Phones: the same hero-art note as /refund.
7. Launch dependency: the number takes calls (D032).

## Questions for the founder (website only, D030)

1. Is a change-of-mind return refunded in full? (Recommended: yes, nothing deducted, pickup free.)
2. What happens to a return that comes back damaged or with parts missing? What counts as "damaged" for a
   plush toy that has been played with for a week? (Recommended: we tell you what we found and send it back
   to you, free. Normal play marks are not damage; torn, broken, wet or missing parts are.)
3. A fault found after day 7: is it repair, then replace, then a full refund if neither works? Or is a full
   refund available at any time in the 6 months? (Recommended: the first; it keeps the page within Rule 7(4).)
4. Does the 6-month warranty start on the delivery date? (Recommended: yes.)
5. Is sending a repaired or replacement Kheelu back to the parent free? (Recommended: yes.)
6. What happens to a parcel lost in transit? (Recommended: a replacement, or a full refund if the parent
   prefers; no day count.)
7. Can the 48-hour acknowledgement carry a complaint reference, for example the order number plus a
   complaint number? Rule 7(1)(f) requires a ticket number for each complaint.
8. "Refund within 7 working days of the unit reaching us": is that when we start the refund (the bank then
   adds 5-7 working days), or when the money lands?
