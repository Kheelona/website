---
title: "D069: Measure the ChatGPT advertising with OpenAI's Ads Measurement Pixel"
type: decision
updated: 2026-11-13
sources: ["the founder's request and approval of the /privacy wording, 2026-11-13", ../site/tracking-inventory.md, ../engineering/architecture.md, D054-founder-answers-open-questions-2026-10-14.md, D067-legal-pages-approved-final-2026-10-22.md]
---

# D069: OpenAI's Ads Measurement Pixel and Conversions API measure the ChatGPT advertising

**Context.** The founder asked (2026-11-13) for the advertising Kheelona runs inside ChatGPT to be measured, so the
company can see which ad clicks become paid pre-orders. OpenAI's Ads Manager gives each website a Measurement Pixel
(an `oaiq` script) and a Conversions API (events from our server). Until this decision no OpenAI tool was on the site:
inventory row 16 ("other pixels: none found") was true at the freeze tag.

**Choice.** One pixel, `CtmHigpYxafJN3qgbj3xnv` (a public identifier, like the GA4 and Meta IDs), on the three
production hosts only, the `META_PIXEL_HOSTS` list reused: `kheelona.com`, `www.kheelona.com`, `store.kheelona.com`.
Beta, `*.vercel.app` previews and localhost load nothing, and neither does a team device (`?internal=1`, or PostHog's
stored `internal` flag).

- **Events.** `page_viewed` once per full load of an allowed page; `checkout_started` when the Razorpay sheet opens;
  `order_created` when a payment succeeds, with the raw order reference as its event id. Amounts are what was collected,
  as integers in paise (₹499 = 49900), in currency `INR`; OpenAI's documentation lists no currencies, so the first live
  event in Ads Manager's Test view is the check that INR is accepted.
- **Server Conversions API (optional).** `src/lib/ads/openai-capi.ts` sends `order_created` from `notifyPaid`, once per
  paid order, de-duplicated with the browser event by pixel, event name and id. It makes **no request** unless
  `OPENAI_ADS_CAPI_KEY` is set (a Vercel production secret, read inside the function, never in the repository), the build
  is production, and the order carries an OpenAI click or browser reference, so buyers who never met an OpenAI ad or the
  pixel are never reported and test orders never are. It sends the order id, the time, the amount, SHA-256 of the email
  and phone, the IP address and user agent the order was created from, and the click and browser references. Never a
  name, an address, a child's age or free text.
- **Ad click carried to the store.** OpenAI appends `oppref` to an ad click. The marketing page keeps it in our own
  session cookie `kh_oppref` on `.kheelona.com` (a first-party cookie, written only for a valid token, latest click wins),
  and the store hands it to the pixel and to `create-order`. The order stores it, with OpenAI's browser reference, under
  `oai_oppref` / `oai_obref` **inside the existing `fb_attrib` JSONB**. No new column and no migration: a migration is
  applied by hand, and code that inserted a new column ahead of it would answer every pre-order with a 500. Meta's reader
  picks only its own four keys, so its payload is unchanged.

**Automatic advanced matching.** OpenAI's pixel can scan a page's form fields and text for emails, phone numbers and
names and send hashes of them. It is switched on for this pixel by OpenAI, there is no option for it in the SDK and no
switch in Ads Manager, and OpenAI's own documentation says it needs no code change. Our pages show the company's support
email and phone, which a scanner could report as if they were a buyer's (the trap Meta's automatic matching was, F4).
`src/lib/ads/openai-pixel.ts` therefore keeps one reviewed constant, `OPENAI_AAM_POLICY`:

- `"verified-pages"` (the default): the SDK loads only on `/` and `/products/kheelu` of the marketing site and on the
  store's `/` (`OPENAI_PIXEL_PAGES`); every other page (`/contact`, the legal pages, `/team`, `/stories/**`, the store's
  `/thanks`, 404s) gets no queue stub and no SDK. A network probe against the live SDK, with matching forced on and every
  collector answered locally, found no hash of any contact detail those pages show in the events from `/`,
  `/products/kheelu`, `/contact`, `/privacy`, `/terms`, `/team`, `/shipping` and the store's `/`. On the store, once a parent
  types into the form, the scanner adds hashes of what was typed: buyer data only.
- `"require-off"`: fetch the pixel's configuration first and load the SDK only when OpenAI reports matching **off**;
  anything else (on, missing, an error, a timeout) loads nothing and logs one `console.warn`. Implemented and tested as
  the alternative; switching is one line.

Neither mode sends a `user` object from the browser, and the pixel is never mounted in the parent app.

**Content security policy.** Report-Only, phase unchanged: `script-src` gains `https://bzrcdn.openai.com`, `connect-src`
gains it and `https://bzr.openai.com`, `img-src` gains `https://bzr.openai.com`. Exact origins, no wildcard.

**The privacy page (approved 2026-11-13).** `/privacy` is a legal page approved as final ([D067](D067-legal-pages-approved-final-2026-10-22.md))
and names every measurement tool; repo rule §8.21-c says a tool and its sentence ship together. The founder approved the
OpenAI wording on 2026-11-13, and it ships in the same pull request, in both sources of the page
(`redesign/pages/privacy.html` with its built `redesign/privacy/index.html`, and `src/content/en-IN/legal/privacy.ts`):
two tool blocks, "OpenAI Ads Measurement Pixel" and "OpenAI Conversions API"; `kh_oppref` in "Our own cookies"; "a Meta or
OpenAI cookie" in the order paragraph; "the reports our server sends to Meta and OpenAI" under "What blocking can't stop";
an OpenAI row in the recipients table, linking OpenAI's own privacy policy for where the data is held; and one sentence that
we also advertise to parents in ChatGPT. The page makes no claim that a visitor can opt out of OpenAI's tools, and says
plainly that on the reservation page OpenAI's script reads the email address and phone number typed into the form and
that we cannot switch that off. **"Last updated" is the founder's date** ([D055](D055-page-facts-legal-setup-product-2026-10-14.md) item 8,
D067): it moves from 14 October to **13 November 2026** on `/privacy` only (`approvedOn: "2026-11-13"`, the page's sitemap
`lastmod` and WebPage `dateModified` with it); terms, refund and shipping keep 14 October. The tracking inventory records the
OpenAI rows as "added after the tag (D069)".

**Not in scope.** Refunds are not reported to OpenAI (its API has no refund event). The parent app, the Meta, GA4 and
PostHog IDs, events and payloads, the store's checkout, `proxy.ts` and the attribution cookies `kh_utm` / `kh_fbclid` are
untouched.

**Rollback.** Revert the merge commit. Nothing in the database changes (`oai_*` keys in `fb_attrib` are inert). To stop
the server path alone, remove `OPENAI_ADS_CAPI_KEY` from Vercel and redeploy. In `verified-pages` mode the browser pixel
has no switch outside the code (the configuration is not consulted); in `require-off` mode, turning OpenAI's matching on
stops it on the next page load.

**Approved by.** Requested by the founder, 2026-11-13; live only when the founder merges the pull request. **Date.** 2026-11-13.
