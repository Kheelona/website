---
title: "D055: The founder fills the facts the legal, setup and product pages were waiting on (privacy, refund, shipping, terms)"
type: decision
updated: 2026-10-14
sources: ["founder's answers in the build session, 2026-10-14, to ten rounds of questions on the placeholders the production build refuses (the build's placeholder report at the wave 6 merge)", D054-founder-answers-open-questions-2026-10-14.md, D020-provider-terms-and-no-sale.md, D021-returns-policy.md, D024-payment-methods-gst.md, D033-warranty-after-day-7.md, D035-model-training-opt-out.md, D036-launch-feature-claims.md, D047-vercel-build-and-data-regions.md, ../site/pages/privacy.md, ../site/pages/refund.md, ../site/pages/shipping.md, ../site/pages/terms.md, ../site/pages/setup.md]
---

# D055: Page facts for the legal, setup and product pages

> **Narrowed 2026-10-14 by [D058](D058-follow-the-live-code-check-2026-10-14.md):** items 13 (the WiFi name stays on the phone), 16 (the processors are named) and 18 (deleting the account deletes the data) follow the live team's code check.

## Context

After D054, the wave 6 merge build listed about 55 placeholders that a production build refuses, most of them on
`/privacy`, `/refund`, `/shipping`, `/terms` and `/setup`. They are facts only Kheelona can give (the CTO was to draft
the privacy ones, L6). The founder chose to answer them in the session, one by one. Answers that an earlier decision
already settled were not asked again: parent alerts are off in v1 (B34, final by D054); conversations, the toy's server
and its memory are on Google Cloud in India (D047); the store's server code runs in Mumbai (`vercel.json`, `bom1`).

## Choices

**/refund**

1. A change-of-mind return is refunded in full: everything the parent paid.
2. Sending the repaired or replacement Kheelu back to the parent is free, like the pickup.
3. The warranty starts on the delivery date.
4. **Not confirmed, so the lines come off:** "If a repair and a replacement don't put it right, you get a full
   refund" (and its twin, "a full refund if neither works"). Recorded with the answer: the legal review asked for a
   refund option for faulty units (E-Commerce Rules 7(4); L5); the 7-day line for a Kheelu that arrives faulty
   ("a replacement or a full refund", P15, D033) stays.
5. After a return, **the money reaches the parent within 7 working days** of the Kheelu reaching Kheelona (bank time
   included).
6. A Kheelu returned with something missing or damaged beyond normal play: "we'll talk to you before deciding the
   refund".

**All four legal pages**

7. The complaint reference number line comes off until a system issues one (it was an L2 recommendation).
8. "Last updated": 14 October 2026.

**/shipping**: 9. The lost-parcel line comes off.

**/terms**: 10. GST: only what D024 confirms (prices include GST; a GST invoice); the documents-and-timing slot and
the price-breakup slot come off. 11. Training is turned off with a switch in the parent app (as on `/privacy`).

**/privacy**

12. Training (D035): turned off with a switch in the parent app. Recordings and transcripts already used: "We take
    them out of our training data. A model already trained keeps what it learned, but they are never used again."
    Turning it off changes nothing else about Kheelu or the app. Purpose: "To make Kheelu better at understanding and
    answering children aged 3 to 7." Where: India, on Google Cloud.
13. Voice recordings are used for nothing else (besides replying and training) and are kept 36 months, like
    transcripts.
14. The parent app asks for the child's first name and age. The parent signs in with a phone number and a one-time
    code. The app keeps Kheelu's serial or device ID, the name of the Wi-Fi network Kheelu joins, and the phone's
    model and operating system (not the Wi-Fi password).
15. Consent: "Setting Kheelu up in the parent app is how a parent or guardian agrees to this policy. A separate
    consent step, with a check that you are the parent or guardian, comes before May 2027."
16. The speech and AI providers are not named, and the page makes no "on request" line. (A parent's right under the
    DPDP Act to ask who their data was shared with applies anyway once its duties start.)
17. Deleting a conversation: the "how soon from servers and backups" point comes off. A deleted conversation is
    **not** removed from Kheelu's memory or from the model's training data; the page says so plainly, so the one-tap
    delete is not read as more than it is (the founder sees the sentence at Gate B).
18. Closing a parent-app account: conversations and recordings are kept until their 36 months end.
19. Unpaid orders: "We keep them until you ask us to delete them" (true today; nothing deletes them automatically).
20. Paid orders: "as long as Indian tax law requires, even after a refund", with no period.
21. PostHog: only the 30 days for screen recordings; the other-events point comes off.
22. Security: no written policy yet, so the detail slot comes off and the section keeps its confirmed lines.
23. A data breach: "If your data is ever exposed, we tell you without delay, and the Data Protection Board as the
    law requires."
24. The recipients table: conversations and the parent app, "Kheelona, on Google Cloud", in India (D047); the store's
    server code in India (Mumbai); Supabase: the founder chose not to answer the move question ("Ignore this"), so the
    page states the fact D047 records, Australia (Sydney), until the founder says it has moved; Razorpay, Resend,
    Google, Meta and Ahrefs: each region from the provider's own published documents, cited.

**/setup and the product page**

25. One button on Kheelu's back wakes it and, held for 3 seconds, starts setup. The light's colour is still unconfirmed,
    so the step says "until its light starts pulsing" (deviation V8 shrinks to the colour).
26. The parent app: linked on the App Store and Google Play (the live site's links), for iPhone and Android. The
    listing names still need the C6 fix (founder's to-do).
27. The F4 slots on `/setup` (charger, charging time) follow D054 item 19: hidden until the founder sends final values.

## Why

The founder's answers, given in the session on request. Where an answer leaves a line out, the page says less rather
than guess (brief 4.2: no invented claims).

## What it changes in the build

Task **6.7** ([tasks](../engineering/tasks.md)): copy pages first (copywriter), the CMO's check, then the modules
(builder); the deviations each change implies are listed by the main session at the merge.

**Approved by.** Founder. **Date.** 2026-10-14.
