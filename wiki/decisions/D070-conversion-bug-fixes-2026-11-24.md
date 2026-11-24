---
title: "D070: Fix the conversion bugs B1 to B7 on the current hosting, one pull request each"
type: decision
updated: 2026-11-24
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

**What did not change.** Prices, the tier table, the amount decided on the server, the webhook, the emails, the
tracking IDs and every existing event. The frozen checkout files change only by reviewed patches that name this
decision. The store rename (Kheelu to Khelu) and the five conversion changes of the same review wait for a separate
founder decision.

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
