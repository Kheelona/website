---
title: "D054: The founder answers the open build questions (F4, F11, F12, F13, P1-P24, the CSP, the B11 privacy words, /ideabaaz, the Gate A defaults)"
type: decision
updated: 2026-10-14
sources: ["founder's answers in the build session, 2026-10-14, to seven rounds of questions asked at the founder's request ('ask me all the questions you have here')", ../open-questions.md, ../site/gate-a-open-items.md, ../site/tracking-inventory.md, ../site/pages/privacy.md, ../site/pages/team.md, ../engineering/tasks.md, D023-new-order-delivery.md, D038-trust-content-rulings.md, D039-repo-and-setup-answers.md, D041-gate-a-round-1.md]
---

# D054: The founder answers the open build questions

## Context

On 2026-10-14 the founder asked for every open question at once. The main session asked them in seven rounds:
the questions still open in [open questions](../open-questions.md) (F4, F11, F12, F13, G3, P1-P24), the
[Gate A working defaults](../site/gate-a-open-items.md) §2-3, the accidental `main` commit, and four new ones from the
batch `wf_cd8260cf-e88` (the report-only CSP, the privacy words for the B11 events, the store's secondary pages, the
journal's head photos). Each answer below is the founder's, with the option they picked.

## Choices

**Orders and the store**

1. **F12, orders reserved before 10 October.** The founder talks to those customers personally. Their `/thanks` keeps
   "Ships from 20 October 2026", the line they were sold with; every later order reads the D023 line (the split as
   built in `OrderRows/delivery-line.ts`). Task 6.4 is unblocked.
2. **F12, WhatsApp confirmations.** They are sent after each order; the form's promise stays.
3. **F12, balance payments.** Leave as is: no webhook change before launch (ADR-013); a proposal after launch.
4. **The accidental `main` commit `24e92e3`** (vercel.json only, 2026-10-12): leave it; the Gate B merge supersedes it.
5. **P3.** The D041 exception extends to white on Kheelu Blue ("Save my address" on `/thanks`, the blue stickers).
6. **P5.** No in-app browser check on real phones after launch. Accepted risk: payment in the WhatsApp and Instagram
   in-app browsers is proven only by the local sandbox (`npm run qa:payment`).
7. **The store's secondary pages (task 6.1).** The Ideabaaz partner page is not needed: `store.kheelona.com/ideabaaz`
   shows the store's not-found page, with no redirect (the founder chose this over a redirect to the store, knowing
   printed QR codes point there). The event pages and the store's not-found pages are accepted as built.
8. **F13.** The founder does not have the list of printed event tiers: every tier the store accepts today keeps
   working, unchanged.

**Tracking and privacy**

9. **The report-only CSP (amends [D039](D039-repo-and-setup-answers.md) C10).** Change three things in the
   Report-Only policy: drop `upgrade-insecure-requests`; admit Google Analytics' collect host (`www.google.com`) and
   the Meta pixel's gateway (`dv-c3e594c6d429469e90b54478358619c3.ecs.us-east-1.on.aws` and its run.app fallback;
   [tracking inventory §14a](../site/tracking-inventory.md)). It stays Report-Only, so nothing that loads today is
   blocked. `src/lib/security-headers.ts` is frozen (ADR-013), so the change goes through a reviewed authorised diff
   that cites this decision.
10. **The B11 privacy words (task 6.2), approved as written.** Google Analytics: "Counts visits and the steps of a
    pre-order: starting the form, being asked to correct an answer (which answers, never what you typed), opening and
    closing the payment window, a payment that fails (with Razorpay’s code for why), paying, and saving your address."
    PostHog, after its first sentence: "It is told the same steps of a pre-order as Google Analytics." The copy page and
    the privacy mockup take the same words.
11. **P11.** The "most detailed of the five" sentence about PostHog stays out.
12. **P14.** The privacy list lead "Two things blocking can’t stop." becomes "What blocking can’t stop."
    **P16.** Terms point 8 keeps "A toy, not a therapy." (the approved words).

**The journal**

13. **P23.** The data-law guide is published as built (confirmed facts and the pointer to `/privacy`); "May 2027" is
    re-read against the Gazette before Gate B. No counsel reads it before launch (B47).
14. **P17.** Bylines as drafted: "The Kheelona team" on the screen-time and talking guides; Aman Soni and Apoorva Sahu
    on the three AI and data-law guides, each only if that person reads and owns the page before Gate B.
15. **P22.** The voice-recording line stays out (the setup behaviour is not settled), and so do the five hard
    questions without a confirmed answer.
16. **P18-P21.** As built: the searched phrase in the H1 and the approved hub card titles; no pitch on the six
    talking guides; one calm product line on the tantrums guide; Common Sense Media's advice (B3) on the two other AI
    guides as on the safe-AI-toy guide.
17. **The two wording changes made after the CMO's approval** ("A year and a half later" on the data-law guide; "for
    no more than 20 to 30 minutes at a time" on the AI-tutor guide): accepted.
18. **P24.** The head photos as built by 5.20a-c (the data-law guide's head shows Kheelu, ira-01; one talking guide on
    kabir-04).

**Pages, assets and launch**

19. **F4.** The founder sends the spec values that are final, before Gate B. Any F4 row still without a final value at
    Gate B comes off the page instead of blocking the build; the box contents stay. Recorded with the answer: net
    quantity and month and year of manufacture are Legal Metrology declarations the listing needs before the first
    dispatch ([L4](../open-questions.md#l-legal-actions-from-the-indian-law-review-founders-ask-one-at-a-time)).
20. **F11, G3, B24, B25 (amends [D038](D038-trust-content-rulings.md) for these items).** Add the `/team` recognition
    strip now, as the live site shows it: the NVIDIA Inception, Karnataka Elevate and nasscom marks already in
    `public/recognition/`, with Founders Inc as text; and the founders' background lines, from the live bios. The
    founder photos are the live site's. The proof files are no longer a precondition. The question named two
    background lines and the photos of Aman and Apoorva; the page has three co-founders (Apoorva, Aman, Kashyap,
    [team copy page](../site/pages/team.md) fold 3), so all three lines and all three live photos (`apoorva.jpg`,
    `aman.jpg`, `kashyap.jpg`) apply, and the founder was told so. The lines keep only live facts; the live bio's
    retired wording stays out ("the small language model we train ourselves", [claims §4](../product/claims.md)).
21. **P10.** Keep www.kheelona.com on "Redirect" at Gate B (legacy www links keep two hops).
22. **P1, P2, P6, P9, P12, P13.** As built.
23. **The Gate A working defaults** ([gate-a-open-items](../site/gate-a-open-items.md) §2-3, A10-A17 and B2-B47) are
    final.

## Why

The founder's own answers, given on request. Where an answer changes a rule (D038's proof gate, D039's identical
CSP, B25's text-only strip), the latest logged decision wins (CLAUDE.md).

## What it changes in the build

- Task **6.4** runs (no longer gated). Task **6.6** (new, [tasks](../engineering/tasks.md)) carries items 7, 9 and
  20; task **6.7** carries 12 and 19 with the page facts of [D055](D055-page-facts-legal-setup-product-2026-10-14.md).
  The B11 words (10) landed with the 6.2 merge as deviation V10.
- The Lighthouse harness's block list (`scripts/qa/lighthouse.mjs`) takes the two beacon hosts, so local tag runs
  never reach production (found by task 4.9: M1's local runs sent 2 GA4 hits and 36 Meta gateway events).

**Approved by.** Founder. **Date.** 2026-10-14.
