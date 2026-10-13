---
title: "CMO review: task 6.7 page facts (D055; D054 items 12 and 19) on /privacy, /refund, /shipping, /terms, /setup and the product page, round 1"
type: qa
updated: 2026-10-14
sources:
  - ../decisions/D055-page-facts-legal-setup-product-2026-10-14.md (items 1-27, read in full)
  - ../decisions/D054-founder-answers-open-questions-2026-10-14.md (items 12 and 19)
  - ../decisions/D017-live-behaviour-claims-confirmed.md, D020-provider-terms-and-no-sale.md, D021-returns-policy.md, D024-payment-methods-gst.md, D033-warranty-after-day-7.md, D034-origin-manufacturer-mrp.md, D035-model-training-opt-out.md, D036-launch-feature-claims.md, D047-vercel-build-and-data-regions.md
  - "../site/pages/privacy.md, refund.md, shipping.md, terms.md, setup.md, meet-kheelu.md in the task 6.7 worktree, against HEAD bc645ea (git diff --word-diff, read 2026-10-14)"
  - ../../vercel.json (regions bom1, read in the worktree)
  - ../raw/research/geo/site-files-2026-10-10/llms.txt (lines 86-87, the app store links)
  - ../qa/cmo-review-pages-help-2026-10-11.md (M-S1, step 2 wording)
  - "design-system/project/04-kheelu.md (belly unit anatomy) and assets/Kheelu/README.md (read-only)"
  - "test/guards/banned-phrases.test.ts and test/analytics-tags.test.ts, run in the worktree: 2 files, 148 tests passed"
  - "the provider pages behind the Section 7 regions, re-read by this review from a US network (local clock 2026-10-13 13:55-14:01 PDT): resend.com/docs/dashboard/domains/regions; business.safety.google/adsprocessorterms/ and /adsservices/; ahrefs.com/legal/privacy-policy; razorpay.com/blog/why-a-local-payments-partner-wins-in-india-and-why-that-partner-is-razorpay/; razorpay.com/privacy/; facebook.com/privacy/policy/ (and ?section_id=9-HowDoWeTransfer); whatsapp.com/legal/privacy-policy"
---

# CMO review: task 6.7 page facts, round 1

**Verdict: FAIL, 2 blocking issues, both on `/privacy`.** `/refund`, `/shipping`, `/terms`, `/setup` and the
product page pass. Each one applies its D055 or D054 items, and only those. This is a copy review: nothing is built
yet, so there are no screenshots. Each verdict rests on the file and line it cites. The founder signs off copy
(D015); this review checks the copy against the decisions and does not replace that sign-off.

## The two blocking issues

### B1. `/privacy` Section 9 says deleting removes a conversation "from our servers". D055 does not say that (→ Copywriter; main session for the brief)

- **Where:** `wiki/site/pages/privacy.md:529`, "Deleting it also removes it from our servers." The same claim
  appears in the notes at :553-557, the sources row at :725, the CTO check at :831-834 and changes-table row 14 at :890.
- **What is wrong:**
  1. **It is a claim D055 does not make.** Item 17 says two things only. The "how soon from servers and backups"
     point comes off, and a deleted conversation is **not** removed from Kheelu's memory or from the training data.
     Nothing in D055, D017 (one-tap delete, in the app only) or D020 says deleting reaches the servers. The founder
     ruled the servers question off the page, and this line puts it back with a stronger answer.
  2. **It contradicts D047 and the sentence after it.** By D047, Kheelu's memory sits on our Google Cloud servers in
     India ("For server & memory we are using GCP"). By D055 item 12, the training data does too ("India, on Google
     Cloud"). So "removes it from our servers" followed by "It is not removed from Kheelu's memory, or from the data
     our model trains on" says it is both gone from and still on our servers. A careful reader would take the first
     sentence as the promise.
  3. The copywriter took the wording from the task brief ("say plainly that deleting it removes it from the app and
     our servers"). They flagged it themselves as question Q4, and said it was not in D055's own text. Here the
     brief went further than the decision.
- **Fix (Copywriter):** replace privacy.md:528-530 with:

  > In the parent app, you can delete any conversation in one tap. It disappears from your app straight away.
  > It is not removed from Kheelu's memory, or from the data our model trains on.

  Then make the notes match:
  - :553-557: "it leaves the app and our servers" becomes "it leaves the app".
  - :725: "off the app and our servers" becomes "off the app".
  - :890: change-table row 14 drops the first sentence.
  - :831-834: the CTO check becomes "If the CTO confirms that deleting erases the transcript and the recording from
    the Google Cloud store, a line saying so needs the founder's answer first; it must not suggest that Kheelu's
    memory or the training data live anywhere else."
- **Fix (main session):** if the founder wants a server line, record the founder's answer and the CTO's confirmation
  first. Note in the task record that the brief's reading of item 17 went beyond the decision.

### B2. `/privacy` Section 7, the Meta row: no quote in the notes, and "Ireland" cannot be found in the sources it cites (→ Copywriter; main session for the source)

- **Where:** `privacy.md:447`, "Where" reads "The United States, Ireland and other countries". The note at :467
  cites Meta's section "How do we transfer information?" and the WhatsApp policy by URL only. The note itself says
  "its quote is a gap".
- **What is wrong:** the criterion is that every region carries its provider's quote and URL in the notes, and this
  row has no quote. I re-read both policies during this review (from a US network). Neither page, as served, names
  Ireland for this traffic:
  - **Meta Privacy Policy** (effective 23 July 2026, `https://www.facebook.com/privacy/policy/`, also with
    `?section_id=9-HowDoWeTransfer`): "Transferring, storing or processing your information across borders,
    including from and to the United States and other countries: We share information we collect globally, both
    internally across our offices and data centers and externally with our partners, third parties and service
    providers." The body of the transfer section did not render outside a browser.
  - **WhatsApp Privacy Policy** (`https://www.whatsapp.com/legal/privacy-policy`): "Your information may, for
    example, be transferred or transmitted to, or stored and processed in, the United States; countries or
    territories where the Meta Companies’ affiliates and partners, or our service providers are located; or any
    other country or territory globally where our Services are provided outside of where you live for the purposes
    as described in this Privacy Policy." Also: "WhatsApp uses Meta’s global infrastructure and data centers,
    including in the United States." The only "Ireland" on the page is "WhatsApp Ireland Limited", which serves
    the European Region and so does not apply to Indian users.

  A named country on a legal page with no traceable source is the kind of claim D055 item 24 rules out ("each region
  from the provider's own published documents, cited").
- **Fix, either one (Copywriter):**
  - **(a) Recommended.** Set the cell to **"The United States and other countries"**. Replace the :467 note with the
    two quotes above, their URLs and the read date, and add: "Meta's policy as served from a US network; QA re-reads
    it from India before Gate B, because Meta serves regional versions."
  - **(b)** Keep "Ireland" only if the main session supplies Meta's own sentence that names Ireland (the transfer
    section is said to list data-centre countries). That sentence must be saved under `wiki/raw/` with its read
    date and quoted word for word in the :467 row.

## Verdict per page and criterion

Key: **P** pass · **F** fail (blocking) · **m** pass with a minor issue (listed below) · n/a.

| Criterion | /privacy | /refund | /shipping | /terms | /setup | product page |
|---|---|---|---|---|---|---|
| 1. Each fix states exactly what D055 or D054 records, no more | **F** (B1) | P | P | P | P | P |
| 2. No contradiction with D020, D021, D024, D033, D035, D036, D047 | **F** (B1, against D047) | P | P | m (M7) | P | P |
| 3. Every line D055 rules off is gone, with no dangling reference | m (M6) | P | P | P | P | P |
| 4. Every region has its provider's quote and URL in the notes | **F** (B2); m (M4) | n/a | n/a | n/a | n/a | n/a |
| 5. Plain en-IN, phone-first; each legal sentence reads | m (M1-M3, M14) | P | P | P | m (M10) | P |
| 6. /privacy still names every tracking tool | P | n/a | n/a | n/a | n/a | n/a |
| 7. No banned or retired wording (guard test green) | P | P | P | P | P | P |
| 8. Every unchanged line is the approved line | P | P | P | P | P | P |
| 9. Says the positioning to parents of 3-7, one next step | P (policy page, no CTA by design) | P | P | P | m (M9, M11) | m (M12) |

### What passed, and why (per page)

**`/privacy`** (except B1 and B2). Every item from 7, 8 and 12-24 lands in the right place:
- **Training (item 12):** "with a switch in the parent app" appears in short-version item 4 (:115-116) and Section 3
  (:268). The purpose and "India, on Google Cloud" are verbatim (:266-267). The two founder sentences on data
  already used are word for word (:269-270), and the nothing-else line is at :271.
- **What the app and account keep:**
  - Recordings: used for nothing else and kept 36 months (:206-207, :498), item 13.
  - First name, phone number with one-time code, serial or device ID, Wi-Fi network name "(not its password)",
    and phone model and OS (:212-215), item 14. Scoping "not its password" to the account is right, because
    Kheelu itself has to hold the password.
  - Consent: item 15's two sentences, verbatim (:219-221).
  - The providers-names paragraph is gone entirely, and the row reads "Speech and AI providers" (:440), item 16.
- **Retention:**
  - Account closure (:499-500), item 18.
  - Unpaid orders, in both places (:303, :502), item 19.
  - Paid orders with no period (:501), item 20.
  - PostHog: 30 days only (:504), item 21.
- **Security and complaints:**
  - Security keeps its two confirmed lines (:584-585), item 22. The breach sentence is verbatim (:587), item 23.
  - Alerts slot gone (B34, final by D054 item 23).
  - Complaint-reference line gone (:651), item 7.
  - Date (:95), item 8.
- **Recipients and tools:**
  - Kheelona on Google Cloud, India; Supabase, Australia; Vercel's store server code, Mumbai, matching
    `vercel.json` `"regions": ["bom1"]` (item 24, D047).
  - D054 item 12's list lead "What blocking can't stop." is at :413, still pinned by `test/analytics-tags.test.ts`
    (green).
  - Every tool is still named in Sections 5 and 7.
- **Regions re-read from source.** Resend (word for word), Google DPT 10.1 (word for word; see M4), Ahrefs (word
  for word) and the Razorpay blog (word for word, dated November 21, 2025) all match their notes. Razorpay's
  privacy policy names no storage location, as the note says.
- **Untouched:** meta title, description, H1, every H2 and both answer-first blocks.

**`/refund`.**
- Item 1, change of mind refunded in full: :110, :188.
- Item 2, free return leg: Section 3, pickup.
- Item 3, warranty from delivery: the slot is gone and "from the day it's delivered" stays.
- Item 4, the backstop: off in both places. The D033 lead line and the 7-day line stay word for word.
- Item 5: "reaches you within 7 working days" (:111, :188, :257).
- Item 6, verbatim (:190).
- Item 7: the complaint-reference line is gone.
- Item 8: the date.
- The bank sentence now follows only the cancellation (:111, :256), and the old "Then your bank" item comes off.
  That is not an extra edit: under the return line it would have added bank days that item 5 already counts. The
  approved page's own note planned this exact outcome ("if it is when the money lands, the bank line applies to
  cancellations only").

**`/shipping`.**
- Item 9: the lost-parcel slot comes off, and "If it doesn't arrive." stays word for word, promising no remedy and
  no day count.
- Items 7 and 8 applied.
- The legal review's Rule 7(4) point stays recorded as an open question, not papered over.

**`/terms`.**
- Item 10: only "Prices include GST." and "Every order gets a GST invoice." (:229-232) remain. The two CA slots are
  gone in both modes.
- Item 11: "with a switch in the parent app" (:396), the same method as /privacy. "The full detail, including what
  happens when you turn it off" now points at real text on /privacy.
- Items 7 and 8 applied.

**`/setup`.**
- Item 25: "Press and hold the button on Kheelu's back. Hold it for 3 seconds, until its light starts pulsing."
  "Its light" is CMO M-S1's own wording and is already in `src/content/en-IN/pages/setup.ts:79`. Fold 5 adds
  "It's the button on Kheelu's back, the one you held during setup." (:217), which ties the two folds together.
- Item 26: both store links match the live site's `llms.txt` (lines 86-87).
- Item 27: the F4 charger slot is hidden, and "Charge Kheelu with the charger in the box." reads whole.
- Density of "Kheelu": 4.5% on recount, against the keyword map's 2% line. I agree with question 7 (a): on a how-to
  page each step should name the thing the parent is holding. QA re-measures on the built page.

**Product page.**
- Item 26: the parent-app row adds only "On iPhone and Android." (:517).
- D054 item 19: the eight F4 rows and lines are hidden whole. No label is left without its value, and the box
  contents stay.
- The charging line keeps its confirmed half (:326).

## Minor issues (none blocks)

| # | Page and criterion | What is wrong (file:line) | Fix (route) |
|---|---|---|---|
| M1 | /privacy, 5 (reads true) | Section 9 now says plainly that deleting does not reach Kheelu's memory or the training data. But short-version item 5 (:117, "Delete any of them in one tap"), Section 2 (:191) and the Section 8 answer-first block (:494-495, "You can delete any of them sooner, in one tap") still read like a full delete to a parent who stops reading early. Most parents stop at the short version | Founder OK at Gate B for the copywriter's question 6 (b): add "Deleting one doesn't remove it from Kheelu's memory or our training data." to short-version item 5. Also question 7 (b): add "To take your child's conversations out of our training data, turn training off in the parent app." after the Section 9 delete paragraph, which turns a limit into an action. Both are new lines, so they need the founder's yes first (main session → Copywriter) |
| M2 | /privacy, 5 | The consent paragraph (:219-221) says the same thing twice in a row: "A parent or guardian sets Kheelu up in the parent app. Setting Kheelu up in the parent app is how a parent or guardian agrees …" | Founder OK for question 8 (b): drop the approved first sentence. Item 15's two sentences then stand alone with no fact lost (main session → Copywriter) |
| M3 | /privacy, 5 | Section 7's lead "Each of these companies does one job for us." (:436) sits above a row whose "Who" is "Kheelona, on Google Cloud" (:441). Kheelona does not do a job for itself | Leave as D055 item 24 words it for now. At Gate B, offer the founder "Google Cloud, for Kheelona" in the Who cell (same facts, reads under the lead) (main session → Copywriter) |
| M4 | /privacy, 4 | Two gaps in the Google note (:466). (1) The quote starts partway into 10.1 with no ellipsis; the sentence begins "Subject to any provisions applicable to data transfers set out in the Additional Terms, …". (2) The note doesn't show that these Ads terms cover Google Analytics | Start the quote with "…" (or quote the whole sentence). Add: "Google Analytics is listed as a Processor Service under these terms (<https://business.safety.google/adsservices/>, read 2026-10-13)" (Copywriter) |
| M5 | /privacy, 4 | None of the provider pages is saved under `wiki/raw/` (copywriter's Q5). Google, Meta and Resend can change these pages without notice | Save each page under `wiki/raw/` with its read date before Gate B. Resend, Google DPT and adsservices, Ahrefs, the Razorpay blog and privacy policy, and WhatsApp all load without a login. Meta needs a browser and an Indian network. QA re-reads Meta from India (main session) |
| M6 | /privacy, 3 | Stale internal notes, none in a Copy block. :171-173 still says the P1 block carries "the placeholder it already carried"; it carries none. :589-590 still says "the breach line only once the runbook exists", although the 6.7 bullet below it records the founder's choice. :472 points to "the report's gaps", which is not a wiki page | Delete ", with the placeholder it already carried". Change :589-590 to "DATA-24 asked for the runbook first; the founder chose to publish the line now (D055 item 23, Risks)". Change :472 to point at M5 here, or at the main session's open item (Copywriter) |
| M7 | /terms, 2 | Section 8 (:336) keeps "your refund is processed within 7 working days". /refund now says "reaches you within 7 working days" (D055 item 5). The two don't contradict, but a parent comparing the pages sees two timings. The copywriter left it alone correctly, because no D055 item names /terms there | At Gate B, ask the founder to OK "your refund reaches you within 7 working days" on /terms, so it matches item 5 (main session → Copywriter) |
| M8 | all four legal pages, 5 | The fold 0 note "Draft for the founder's approval; not legal advice." (privacy :80, refund :72, shipping :70, terms :81) now sits above "Last updated: 14 October 2026". On a live page, that tells a parent the policy is unapproved | Founder decides at Gate B: keep it on beta, and drop it for production once the founder approves the text. Not part of this fix (main session) |
| M9 | /setup and product page, 9 | Fold 5 (:221) shows `kheelu-belly-module.png`, the front tummy unit, beside "It's the button on Kheelu's back". The DS anatomy gives that front unit eight buttons, including a power button and a play/pause. A parent showing a child "the wake-up button" from that photo will point at the front. The product page's Good to know box (:350) pairs the same photo with the wake-up line, which is less acute | Founder picks the copywriter's question 5 (b) for /setup: drop the photo from fold 5 until a back view exists, then (c). This is a parity deviation for the merge list. On the product page, keep the photo (Builder; founder to choose) |
| M10 | /setup, 5 | Fold 2 item 4 (:96) calls the app two names in a row: "…with the parent app installed. Get the Kheelona app for iPhone…". A parent may read these as two apps | Make the second sentence "It's called Kheelona: get it on the [App Store] for iPhone, or on [Google Play] for Android." It is a filled slot, so the copywriter may adjust it within item 26. The secondary keyword "Kheelona app" can stay in the link labels or the alt if the keyword map needs it (Copywriter) |
| M11 | /setup, 9 | The new store links lead to listings that still say Lumi, call Kheelu a "Smart Brain Development Toy" and claim "Boosts vocabulary". Those are claims the site bans, and the listings state the opposite data practices to /privacy (copywriter's question 6) | Founder's to-do C6, done before Gate B. If it isn't, the links still stand per D055 item 26, and the main session lists the risk at Gate B (main session) |
| M12 | product page, 9 | Hiding the net quantity and the size (D054 item 19) leaves the page without two Legal Metrology declarations that a selling page needs while it takes orders (copywriter's question 7) | Founder sends the net quantity and the size before Gate B (question 7 (b)). The rest stay hidden until final (main session) |
| M13 | /privacy, 5 | The Vercel row's "Where" (:445) covers only the store's server code. Hosting and Vercel Web Analytics have no region. That is true to D055 but incomplete for a careful reader | Leave as D055 states it. CTO check: if Vercel publishes where Web Analytics data is stored, add it with its quote (Copywriter, after the CTO) |
| M14 | /privacy, 5 | "Your child's first name: the parent app asks for it." (:212) is the only item under "What we keep, and why" that gives no reason. D055 item 14 gives none, so the page must not invent one | Ask the founder for the purpose in one line (for example, how Kheelu or the app uses it), then add it (main session → Copywriter) |

## Routing summary

- **Copywriter:** B1 (cut the sentence and align four notes); B2 (option (a): the cell and the note); M4; M6. Then
  M1, M2, M3, M7, M10 and M14, once the founder answers.
- **Main session:** B1 (the brief went beyond D055 item 17; a server line needs a founder answer first); B2 option
  (b) if it supplies Meta's Ireland sentence; M5 (save the provider pages under `raw/`); and the founder's questions
  for M1-M3, M7, M8, M10-M12 and M14.
- **Builder:** M9 if the founder picks (b). Nothing else changes in the modules beyond what the copy pages already
  list for task 6.7.

## Checks run

- `git diff --word-diff` of all six pages against HEAD `bc645ea`. Every Copy-block change maps to a D055 or D054
  item. No other approved line changed, apart from the /refund bank-line move and /setup's "its light", both
  explained above.
- `npx vitest run test/guards/banned-phrases.test.ts test/analytics-tags.test.ts` in the worktree: 148 tests passed.
  The guard scans every Copy block of `wiki/site/pages/*.md`.
- No `[PLACEHOLDER` left in any Copy block of the six pages. The only matches are the how-to-read legends and the
  settled-placeholder tables.
- Provider sources re-read. Results are under B2 and in the /privacy pass notes. My copies are in this session's
  scratchpad, not in the wiki.

---

## Round 2

**Verdict: PASS. No blocking issue remains.** B1 and B2 are fixed on `/privacy`, and so are the minor issues the
copywriter could fix without the founder (M4, M6, M10, M13). Every other changed line still holds against D055 and
D054 items 12 and 19. Nothing else changed for the worse. The open minor issues all wait on the founder or the main
session; none of them is a copy error. As in round 1, this is a copy review: nothing is built, so there are no
screenshots, and only the founder signs off the copy (D015).

**What round 2 checked** (all in the task 6.7 worktree, 2026-10-14):
- A word-level diff of every Copy-block line (quoted `>` lines) in the six pages against HEAD `bc645ea`.
- The full text of `privacy.md`, plus the full diffs of `setup.md` and `terms.md`. These three were edited after
  round 1, by file time.
- `refund.md`, `shipping.md` and `meet-kheelu.md` were last written before round 1 was filed. The round 1 passes
  stand for them.
- `npx vitest run test/guards/banned-phrases.test.ts test/analytics-tags.test.ts`: 2 files, 148 tests passed.
- `[PLACEHOLDER`: none left in any Copy block of the six pages.
- `vercel.json`: `"regions": ["bom1"]`.
- `wiki/raw/research/geo/entity-consistency-2026-10-10.md`, rows 1-2, and `site-files-2026-10-10/llms.txt`,
  lines 86-87. These back the `/setup` store line.

### The round 1 blocking issues

| # | Status | Evidence |
|---|---|---|
| B1 | **Fixed** | `privacy.md:532-533` now reads "In the parent app, you can delete any conversation in one tap. It disappears from your app straight away. It is not removed from Kheelu's memory, or from the data our model trains on." The first two sentences are the approved text. The third is D055 item 17, word for word in substance. The server claim is gone from the Copy block. The aligned notes are: the Section 9 note (:555-568, a "No server line" note that records why), the sources row (:735), the CTO check (:853-858) and change-table row 14 (:917), with the round 2 note at :924-926. Nothing left on the page says or implies that a deleted conversation leaves our servers, and nothing contradicts D047. |
| B2 | **Fixed** (option (a)) | `privacy.md:447`: Meta's "Where" is now "The United States and other countries". The note at :467 quotes the Meta Privacy Policy's transfer section and the WhatsApp Privacy Policy word for word, with both URLs and the read date. It explains why Ireland is not named, and asks QA to re-read the policy from an Indian network before Gate B. Both quotes match what round 1 read. The cell says no more than either source. |

**On the fix brief:** the brief for this task again asks the page to "say plainly that deleting it removes it from
the app and our servers". The copywriter correctly left out "and our servers". D055 item 17 does not record it, and
the blocking rule "a claim beyond D054 or D055" overrides the brief's wording. This is not a failure. The main
session should note in the task record that the brief's reading of item 17 went beyond the decision (round 1, B1).

### Round 1 minor issues fixed by the copywriter

- **M4.** `privacy.md:466`. The Google quote now opens with "…". The note gives 10.1's opening clause and adds the
  `adsservices` page, which lists Google Analytics as a Processor Service.
- **M6.**
  - :172-173 no longer mentions a P1 placeholder.
  - :598-599 now reads "DATA-24 asked for the incident runbook before any breach line; the founder chose to publish
    the line now (D055 item 23; see Risks)".
  - :471-474 points to M5 in this review instead of "the report's gaps".
- **M10.** `setup.md`, fold 2, item 4 now reads: "Keep your phone with you, with the parent app installed. It's
  called the Kheelona app: get it on the [App Store] for iPhone, or on [Google Play] for Android."
  - One app, one name. This is a filled slot, so the copywriter could word it within D055 item 26.
  - "The Kheelona app" matches what a parent finds in the stores: Google Play's title is "kheelona", and the App
    Store description says "The Kheelona App" (entity-consistency rows 1-2).
  - Both links match the live `llms.txt`.
- **M13.** `privacy.md:859-861` adds a CTO check on the Vercel Web Analytics region. The Vercel row's copy is
  unchanged.
- **M7 and M8.** On `/terms` these are notes only. Question 7 records the one-timing proposal, and the change list
  records the fold 0 draft note as the founder's call. The `/terms` Copy blocks are unchanged since round 1.

### Verdict per page and criterion, round 2

Key: **P** pass · **F** fail (blocking) · **m** pass with a minor issue (listed below) · n/a.

| Criterion | /privacy | /refund | /shipping | /terms | /setup | product page |
|---|---|---|---|---|---|---|
| 1. Each fix states exactly what D055 or D054 records, no more | P (B1 fixed) | P | P | P | P | P |
| 2. No contradiction with D020, D021, D024, D033, D035, D036, D047 | P | P | P | m (M7) | P | P |
| 3. Every line D055 rules off is gone, with no dangling reference | P (M6 fixed) | P | P | P | P | P |
| 4. Every region has its provider's quote and URL in the notes | P (B2 and M4 fixed); m (M5) | n/a | n/a | n/a | n/a | n/a |
| 5. Plain en-IN, phone-first; each legal sentence reads | m (M1, M2, M3, M14, M15) | P | P | P | P (M10 fixed) | P |
| 6. /privacy still names every tracking tool | P | n/a | n/a | n/a | n/a | n/a |
| 7. No banned or retired wording (guard test green) | P | P | P | P | P | P |
| 8. Every unchanged line is the approved line | P | P | P | P | P | P |
| 9. Says the positioning to parents of 3-7, one next step | P (policy page, no CTA by design) | P | P | P | m (M9, M11) | m (M12) |

**How each changed line stands.**
- **`/privacy`.** All 16 copy changes in the page's own change table (rows 1-16) map to D055 items 7, 8 and 12-24,
  or to D054 item 12. The word diff shows no other Copy-block change.
- **Regions.** Every "Where" cell has its source in the Section 7 notes:
  - Kheelona on Google Cloud: D047.
  - Supabase: D047 and item 24.
  - Vercel: `vercel.json`.
  - Razorpay, Resend, Google, Meta (and WhatsApp) and Ahrefs: each with a quote, URL and read date.
- **Tools.** Every tracking tool and processor is still named in Sections 5 and 7.
- **`/setup`.** The only Copy change since round 1 is item 4 (M10). Step 2 ("until its light starts pulsing") and
  fold 5 ("It's the button on Kheelu's back, the one you held during setup.") are as round 1 passed them.

### Minor issues still open (none blocks)

M1, M2, M3, M5, M7, M8, M9, M11, M12 and M14 are carried from round 1 unchanged. Each now has a founder question on
its page (privacy questions 6-10, terms question 7, setup questions 5-6) or sits with the main session. One new
minor issue:

| # | Page and criterion | What is wrong (file:line) | Fix (route) |
|---|---|---|---|
| M15 | /privacy, 5 (careful reader) | A careful reader meets three delete paths on this page and is told what only two of them reach. The one-tap delete does not reach Kheelu's memory or the training data (:532-533). Closing the account keeps conversations and recordings until their 36 months end (:503-504). The rights list still offers "delete your details or your child's" (:541, and :417 "You can ask us to delete your details"), with nothing about what a request reaches. A parent who wants everything gone cannot tell whether writing to us reaches Kheelu's memory or the training data. No sentence is false, and D055 does not answer this, so the page must not guess | Ask the founder one question: what does a deletion request to hello@kheelona.com reach (the app's transcripts and recordings, Kheelu's memory, the training data)? Record the answer, then add one sentence under "Asking us" in the founder's words (main session → founder → Copywriter). Until then, leave the page as it is |

### Routing summary, round 2

- **Copywriter:** nothing more in task 6.7. The round 2 fixes are complete. Questions 6-10 on `/privacy`, 7 on
  `/terms` and 5-7 on `/setup` wait on the founder.
- **Main session:**
  - Note that the fix brief's "and our servers" was correctly left out (B1).
  - M5: save the provider pages under `wiki/raw/` with their read dates. QA re-reads Meta from India before Gate B.
  - Put M15's question to the founder.
  - At Gate B, bring the founder questions for M1-M3, M7, M8, M9, M11, M12 and M14.
- **Builder:** carry the Copy blocks into `src/content/en-IN/legal/privacy.ts`, `terms.ts`, `shared.ts`
  (`grievanceNote` off) and `pages/setup.ts` as each page's "For the builder" note lists. Make M9's photo change
  only if the founder picks question 5 (b).
