---
title: "D070: Fix the conversion bugs B1 to B7 on the current hosting, one pull request each"
type: decision
updated: 2026-11-25
sources: ["the founder's approval in chat, 2026-11-24 (\"Yes, push to vercel. All major bugs, from B1 to B7 is approved.\")", D051-beta-without-store-integrations.md, D067-legal-pages-approved-final-2026-10-22.md, D069-openai-ads-measurement.md]
---

# D070: Fix the conversion bugs B1 to B7 on the current hosting, one pull request each

**Context.** A review of the customer journey on 24 November 2026 found bugs that lose parents between the first
page and a paid reservation: on phones the page jumps and scrolls by itself after a film is closed; a payment that
finishes outside the page (an in-app browser, a UPI app) never reaches the confirmation and address step; the form
forgets what was typed when a parent leaves to pay; the browser's own payment confirmation is cancelled by the move
to the confirmation page; the first Pre-order tap can wait up to two seconds and the store page is rendered on every
request; and a rejected claim was still the home page's headline.

**Choice.** The founder approved these fixes on 2026-11-24, each named one by one, and each ships as its own pull
request on the current hosting. The founder merges every pull request; nothing is deployed by anyone else.

- **B1.** Phones lose the "one swipe, one beat" scroll snap of 2026-10-23 and use the shorter phone chapter lengths;
  the films viewer keeps the page where it was when it opens and closes, on the home page and the product page. The
  founder checks it on a real phone on the preview before merging.
- **B2.** Razorpay can return a payment through our own server (a callback route, used in in-app browsers), and the
  store recovers the order this browser tab started: paid goes to the confirmation and address step, not paid offers
  to continue or start again. Merged only after test payments pass on a real iPhone and a real Android phone.
- **B3.** The store keeps the parent's name, phone number and email in this browser tab's session storage while the
  form is open, never the child's age, and deletes them on payment or after 30 minutes.
- **B4.** The browser's payment confirmation request is sent with `keepalive`, so the move to the confirmation page
  no longer cancels it.
- **B5.** A tap on a Pre-order link goes to the store at once, the click being reported by beacon, and the store's
  first screen is served from the offer cache (revalidated within the ADR-005 window) instead of being rendered for
  each request.
- **B7.** The rejected home headline and the other rejected lines are replaced with approved wording (the exact
  wording needs the founder's own OK before that pull request is merged); `/products/khelu` redirects permanently to
  `/products/kheelu`; the store sends an early page view and a signal when the payment window is left open.
  **Overtaken on 2026-11-24** (the founder's later answers, same day): the home headline and the other home lines stay
  as they are, and B7 part (a) changes only the language list (addendum "five UI/UX changes" below); the redirect's
  direction is reversed (addendum "`/products/khelu`" below).

**What did not change.** Prices, the tier table, the amount decided on the server, the webhook, the emails, the
tracking IDs and every existing event. The frozen checkout files change only by reviewed patches that name this
decision. The store rename (Kheelu to Khelu) and the five conversion changes of the same review wait for a separate
founder decision. **Overtaken on 2026-11-24:** the founder approved both the same day (the addenda below).

## Addendum 2026-11-24: the product page's address moves to `/products/khelu` (C4 PR 1; reverses the B7 redirect's direction)

The founder's answer in chat on 2026-11-24 ("Don't drop kheelu. Redirect it.", with the store rename approved): the product
page is served at `https://kheelona.com/products/khelu`, and `/products/kheelu` and every older product address keep
working through one permanent redirect to it. This replaces B7's `/products/khelu` to `/products/kheelu` redirect (pull
request 30 is reworked in place, so that direction never merges).

- **Page:** canonical, `og:url`, sitemap entry, Product and Offer `url`, breadcrumb, navigation, footer, every closing
  link, `llms.txt` and `pricing.md` links all use `/products/khelu`. Nothing visible changes: no heading, copy or link text.
  The Product's `@id` stays `https://kheelona.com/products/lumi#product` (it is an identifier, never "fixed" to the route;
  `src/lib/seo/urls.ts`, ADR-012).
- **Redirects:** `/products/kheelu` is a new source; `/products/lumi`, `/lumi`, `/kheelu`, `/products`, `/shop`, `/cart`,
  `/checkout/*`, `/product/*`, `/product-page/*`, `/category/*`, `/accessibility-statement`, `/playos`, `/faq` (to `#faq`)
  and `/pricing` (to `#offer`) now point straight at `/products/khelu`, on the apex and on `www`, with the query and
  fragment kept. Next answers 308, as for every rule on the site. No address is a chain.
- **Tracking:** the OpenAI pixel's verified pages, ViewContent's paths and the CTA placements follow the page; event names
  and payloads are unchanged (ViewContent still sends `content_name "Kheelu"`).
- **Not changed here:** image file names containing "kheelu", the store's visible "Kheelu" wording (C1 PR 1), any page layout.

## Addendum 2026-11-24: the store says "Khelu" (C1 PR 1; the store rename the founder approved in chat)

The founder's answer in chat on 2026-11-24, "Approved: The store name: 'Kheelu' → 'Khelu'" (decision notes
`2026-11-13-a2-store-rename-approved` and `2026-11-24-go-5-ui-ux-changes-keep-headline-rename-redirect`): every place the
store shows the toy's name reads "Khelu", as the marketing pages already do ("Khelu by Kheelona").

- **Changed (a like-for-like word swap, nothing else):** the store page and its titles, descriptions and share-card alt;
  `/thanks` in every state; the event page; the store's not-found page; the films strip, the FAQ answers and the Kheelona+
  sentence the store reads; the order email (subject, heading, body, plain text); the Razorpay payment sheet's description
  (`Khelu pre-order KH-…`); the refusal create-order returns when the 500-unit price has just run out.
- **Frozen files, by reviewed patches that name this decision:** `src/lib/email/templates.ts`,
  `src/features/preorder/lib/checkout.ts`, `src/lib/store/tiers.ts`, the literal-only patch of `src/app/store/thanks/page.test.tsx`;
  the store layout's signature fixture. No logic changes.
- **Not changed on purpose:** event names and payloads (ViewContent still sends `content_name "Kheelu"`, `content_ids ["lumi"]`),
  product and tier IDs, database values, image file names and the `Kheelu/` asset folder, CSS class names, every URL, code
  comments, and the marketing `src/content` pages the redesign replaced (not served).
- **Mockups:** the frozen mockups keep Gate A's "Kheelu"; the comparisons read their name as the build's (deviations.md V71).
- **Guard:** `test/store-rename-khelu.test.tsx` renders every store surface and fails on any "Kheelu" a buyer could see.

## Addendum 2026-11-24 (written 2026-11-25): the five UI/UX changes, the home lines kept, B7a narrowed, the films lead removed

The founder's answers in chat on 2026-11-24, given one by one (growth-team decision notes
`2026-11-24-go-5-ui-ux-changes-keep-headline-rename-redirect` and `2026-11-24-returns-7-days-no-pilot-wording-two-tap-path`).
Each change shipped as its own pull request; the details and merge times are in the [log](../log.md) entries of 2026-11-25 22:30.

- **"Go" on five UI/UX changes, in order:** (C1) the reservation page as one clean page with Pay always on screen;
  (C2) a payment that can't lose a parent: B2 to B4, then the in-app browser notice goes app by app once the test
  payments pass ("UPI first" skipped: it needed a new label); (C3) a short, normally scrolling phone home page with the
  existing decision sections moved up; (C4) decision content first on the product page; (C5) the Pre-order button kept
  with engaged visitors (the films viewer; Team, Safety, Privacy). UI/UX only: no new copy and no design-system edit,
  apart from the store's "Khelu" and B7a's language line. Later the same day: on phones only, the films right after the
  demo (C3b).
- **Kept, as the founder's informed exception on kheelona.com only:** the home H1 "An AI toy that supports brain
  development.", the footer line "We make AI toys that develop brains." and the home section "Talking helps young
  brains grow.". The founder was told they are rejected wording ([claims](../product/claims.md) §4) and kept them;
  they stay rejected for every other use (ads, social, new pages, the store). This overtakes B7's "the rejected home
  headline and the other rejected lines are replaced".
- **B7a narrowed to one change:** the language list that named Spanish and French becomes, word for word, "Speaks
  English, Hindi, Kannada and 7 more Indian languages." everywhere it appeared (pages, structured data, `llms.txt`);
  where it answers a question (three places) it reads "Khelu speaks English, Hindi, Kannada and 7 more Indian
  languages." (#33).
- **The home films lead removed, not rewritten:** "Seven short films with our pilot families, and a word from an
  expert." (C6, #41). The founder's rule of the same day: customers are no longer called "pilot family", "pilot
  parent" or "pilot"; proof is framed as Khelu in use with families, and any count or exact wording of that is a claim
  that needs the founder's one-by-one sign-off. The legal pages' "pilot families" wording waits for the legal review,
  on hold until 2026-11-30.
- **Two one-time exceptions to the Lighthouse gate:** B5b (the cached store page, lab LCP 0.78 to 0.91 s) and C3 (home
  performance 95 to 94, lab LCP 2.83 to 2.97 s). Every other pull request keeps the gate.
