---
title: Tracking, ads and verification inventory
type: inventory
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - git tag archive/pre-reset-2026-10-10 (= 77552ff, production main)
  - git tag archive/mid-version-2026-10-10 (= 50827d1, the unreleased CMO merge, branch-only)
  - src/app/layout.tsx
  - src/config/site.ts
  - src/components/molecules/{GoogleAnalyticsGate,MetaPixel,PostHogGate}.tsx
  - src/components/atoms/Button.tsx
  - src/app/(site)/products/kheelu/_components/ViewContentTracker.tsx
  - src/lib/{fbq,posthog,campaign,click-id,security-headers}.ts
  - src/lib/store/{meta-capi,posthog-server,fulfil,host,thanks-session,env}.ts
  - src/lib/email/send.ts
  - src/features/preorder/lib/{analytics,checkout}.ts
  - src/features/preorder/components/{PreorderForm,AddressForm}.tsx
  - src/app/api/preorder/{create-order,confirm}/route.ts
  - src/app/api/razorpay/webhook/route.ts
  - src/app/store/thanks/page.tsx
  - src/app/(site)/privacy/page.tsx
  - src/proxy.ts
  - next.config.ts
  - docs/website-steps.md (§8.21-c, §8.30, §8.38, §8.39, §8.40, §8.41)
  - docs/posthog-settings.md
  - docs/utm-conventions.md
  - docs/store-go-live.md
  - docs/checkpoints/{meta-pixel-migration-2026-09-20,posthog-2026-09-19,posthog-reverse-proxy-2026-09-20,signup-analytics-2026-09-20,closed-rounds,one-tap-and-cleanup-2026-08-23,seo-aeo-geo-2026-09-11}.md
  - docs/seo/founder-actions-2026-09-11.md
  - CLAUDE.md (root, at the tag)
  - "GET https://kheelona.com/, https://store.kheelona.com/, https://kheelona.com/products/kheelu (browser User-Agent), 2026-10-11 00:43 UTC"
  - "GET of /.well-known/*, /ads.txt, /app-ads.txt, /robots.txt, /sitemap.xml, /llms.txt, /BingSiteAuth.xml on both hosts, 2026-10-11 00:43 UTC"
  - "GET https://kheelona.com/products/kheelu?utm_source=qa-inventory&utm_medium=test&placement=test&fbclid=QAinventoryTest123 (Set-Cookie check), 2026-10-11"
  - "dig +short TXT kheelona.com / store.kheelona.com / www.kheelona.com / _dmarc.kheelona.com, 2026-10-11"
  - "PostHog project 617632 (read-only): project-get; read-data-schema events; HogQL aggregates over events, last 30 days, run 2026-10-11 00:44-00:50 UTC; external-data-sources-list; metaads_* warehouse tables"
  - "PostHog project 617632 (read-only), 2026-10-11 ~01:40 UTC: actions-get-all, feature-flag-get-all, surveys-get-all, cdp-functions-list (all types), batch-exports-list, workflows-list, dashboards-get-all, execute-sql over system.insights"
  - "node_modules/@vercel/analytics/dist (2.0.1, the version locked at the tag), grep for vercel hosts, 2026-10-11"
---

# Tracking, ads and verification inventory

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

**What this is.** Everything that measures, attributes, pays or verifies on kheelona.com and
store.kheelona.com today, so the new site can reproduce it exactly. The brief makes parity a launch
blocker: same IDs, same event names, same parameters, same dedup, same consent behaviour
([brief §9.4](../raw/brief/kickoff-brief.md)).

**What "today" means.** Production is tag `archive/pre-reset-2026-10-10` (= `77552ff`). File and line
references below are to that commit. Anything that exists only on the unreleased mid version (tag
`archive/mid-version-2026-10-10` = `50827d1`) is in [Branch-only, not live](#branch-only-not-live).

**Two things that look like gaps and are not.**

1. The Meta Pixel, GA4 and PostHog mount in the browser **after hydration** and only on production
   hostnames, so `curl` never shows them. That is correct (`GoogleAnalyticsGate.tsx:38-47`,
   `MetaPixel.tsx:70-93`, `PostHogGate.tsx:41-157`; `CLAUDE.md:36-37` on curl, `CLAUDE.md:248` and
   `docs/website-steps.md:3076-3077` on `window.posthog` being undefined while PostHog runs).
2. The Meta Pixel sends through an `<img>` beacon, so the resource timeline, an extension network
   panel and `fetch`/`sendBeacon`/XHR hooks all show **zero** while it works. Only a hook on
   `HTMLImageElement.prototype.src`, or `fbq.getState().pixels[0].eventCount`, proves it
   (`docs/website-steps.md` §8.41-h, from line 3285). Headless Chrome is filtered by Meta as a bot,
   so set a real user agent (§8.41-g, line 3260).

---

## At a glance

| # | Destination | Public ID | Loads from | Host-gated? | Live evidence |
|---|---|---|---|---|---|
| 1 | Vercel Web Analytics | Vercel project (no ID in code) | `src/app/layout.tsx:101` | No (only reports from a Vercel deployment) | Not checked here (dashboard only) |
| 2 | Ahrefs Web Analytics | `N7vd/jLtIIlHqzFqu57UBg` | `src/app/layout.tsx:88-92` (SSR `<head>`) | **No, on purpose** | Script present in SSR HTML of both hosts, 2026-10-11; site ownership verified through Search Console (section 12) |
| 3 | Google Analytics 4 | `G-7LMKSFEXZ9` (stream 15336032355) | `src/components/molecules/GoogleAnalyticsGate.tsx:46` | Yes, `GA4_HOSTS` | Not checked here (needs a browser); admin state is [C1](../open-questions.md) |
| 4 | Meta Pixel (browser) | `1051265191046395` | `src/components/molecules/MetaPixel.tsx:81-90` | Yes, `META_PIXEL_HOSTS` = `GA4_HOSTS` | Verified 2026-09-20 per §8.41; not re-checked here |
| 5 | Meta Conversions API (server) | same pixel, Graph API `v21.0` | `src/lib/store/meta-capi.ts:227-296` | Server only | Not verifiable here (Vercel logs) |
| 6 | PostHog browser SDK | project `617632`, key `phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726` (public) | `src/components/molecules/PostHogGate.tsx:50-152` | Yes, `POSTHOG_HOSTS` = `GA4_HOSTS` | Events arriving, see [live snapshot](#live-snapshot-posthog-last-30-days) |
| 7 | PostHog server event | same project | `src/lib/store/posthog-server.ts:87-122` | Server only | `purchase_confirmed` x2 in last 30 days |
| 8 | PostHog reverse proxy | `/ingest`, `/ingest-assets` | `next.config.ts:32-67` | n/a | Country resolution works (IN 928 of 1,159 pageviews) |
| 9 | PostHog ← Meta Ads warehouse sync | ad account `1195520716116929` | PostHog dashboard (not in repo) | n/a | Syncing every 6h, status Completed |
| 10 | Edge attribution cookies `kh_utm`, `kh_fbclid` | n/a | `src/proxy.ts:127-185` | `.kheelona.com` | Set-Cookie observed on production, 2026-10-11 |
| 11 | Razorpay Checkout + webhooks | webhook `store.kheelona.com/api/razorpay/webhook` | `src/features/preorder/lib/checkout.ts:13`, `src/app/api/razorpay/webhook/route.ts` | n/a | Not exercised (no payments) |
| 12 | Resend (order emails) | n/a | `src/lib/email/send.ts:30` | Server only | No tracking in our payload |
| 13 | Google Search Console | domain property `sc-domain:kheelona.com` | DNS TXT | n/a | TXT present 2026-10-11 |
| 14 | Bing Webmaster Tools | unknown | unknown | n/a | No file or meta tag found |
| 15 | Meta domain verification | DNS TXT token | DNS TXT | n/a | TXT present 2026-10-11 |
| 16 | Merchant Center, product feeds, Google Ads, other pixels | **none found** | n/a | n/a | n/a |
| 17 | `/.well-known/*` and verification files | **none exist** | n/a | n/a | All 404 on both hosts, 2026-10-11 |

Host list shared by GA4, the Meta Pixel and PostHog: `["kheelona.com", "www.kheelona.com",
"store.kheelona.com"]` (`src/config/site.ts:266`, `:300`, `:413`). `www` 308s to the apex at Vercel,
so in practice the tags run on the apex and the store host. Localhost, `*.vercel.app` previews and
any other host load none of the three.

---

## 1. Vercel Web Analytics

- **ID:** none in code; it reports to the Vercel project the deployment belongs to.
- **Loads:** `<Analytics />` from `@vercel/analytics/next` (`^2.0.1`, `package.json:29`), last
  element in `<body>` (`src/app/layout.tsx:4`, `:101`). The script is served from a per-project
  obfuscated same-origin path, not `/_vercel/insights/` (`CLAUDE.md:676-679`).
- **Host gating:** none in code. It reports only from a Vercel deployment with Web Analytics on
  (`docs/website-steps.md` §8.21-c, line 425). Whether preview deployments are counted separately in
  the dashboard was **not verified**.
- **Events:** automatic pageviews only. No `track()` call exists anywhere in `src/`; the only import
  of `@vercel/analytics` is `<Analytics />` (`git grep` at the tag, 2026-10-11).
- **Cookies:** none (observed and recorded in §8.21-c; `/privacy` says so, `src/app/(site)/privacy/page.tsx:70`).

## 2. Ahrefs Web Analytics

- **ID:** `N7vd/jLtIIlHqzFqu57UBg` (`src/config/site.ts:309`).
- **Loads:** raw `<script src="https://analytics.ahrefs.com/analytics.js" data-key=… async>` in the
  root layout `<head>` (`src/app/layout.tsx:88-92`), so it is in the SSR HTML of every route on both
  hosts. Confirmed in the live HTML of `/`, `/products/kheelu` and `store.kheelona.com/` on
  2026-10-11.
- **Host gating:** **deliberately none.** Ahrefs verifies an install by fetching the page and looking
  for the tag; a client-side gate would fail its check. Cost: local and preview views reach the
  property (§8.21-c-ii, `docs/website-steps.md` line 458).
- **Events:** automatic pageviews only.
- **Cookies:** none observed (§8.21-c-ii).
- **How ownership is verified (two separate checks):** (1) the Web Analytics install check fetches
  the page and looks for the tag; the founder clicked "Recheck installation"
  (`docs/checkpoints/closed-rounds.md:82`, `:294`). (2) The Ahrefs project's own ownership is
  **linked to Google Search Console**, not a DNS record, file or meta tag: Settings → Ownership
  verification → Google Search Console read "Website verified via Google Search Console." on
  2026-09-11, the day the founder also re-linked Ahrefs' separate GSC data connection
  (`docs/checkpoints/seo-aeo-geo-2026-09-11.md:402-411`; `docs/seo/founder-actions-2026-09-11.md:116-118`,
  `:140-150`). So it rides on the GSC domain property (section 12) and on the tag staying in the SSR
  `<head>`; the new site keeps both and needs no new file.

## 3. Google Analytics 4

- **ID:** `G-7LMKSFEXZ9`, web stream "kheelona.com" id `15336032355`, enhanced measurement ON
  (`src/config/site.ts:254-266`).
- **Loads:** `GoogleAnalyticsGate` renders `<GoogleAnalytics gaId=…>` from `@next/third-parties/google`
  after a host check in an effect (`GoogleAnalyticsGate.tsx:16-18`, `:38-47`; mounted
  `src/app/layout.tsx:104`). Manual gtag install, **not** Google Tag Manager (founder decision
  2026-07-28, §8.21-c).
- **Host gating:** `GA4_HOSTS` (apex, www, store).
- **Automatic events:** `page_view` from `gtag('config')`, plus whatever enhanced measurement is
  switched on in the GA4 admin (scroll, outbound clicks, form interactions and so on). The exact
  enhanced-measurement toggles are a dashboard setting and were **not verified**.
- **Custom events** (one helper, `track()`, `src/features/preorder/lib/analytics.ts:43-47`):

| Event | Parameters | Fired at | Triggered by |
|---|---|---|---|
| `preorder_form_started` | `tier` | `analytics.ts:65` | first change to any field, `PreorderForm.tsx:78-82`, `onChange` on `<form>` `:193` |
| `preorder_start` | `tier` | `analytics.ts:71` | valid submit, `PreorderForm.tsx:111` |
| `begin_checkout` | `currency: "INR"`, `value` (rupees), `tier` | `analytics.ts:76` | create-order answered OK, `PreorderForm.tsx:139` |
| `purchase` | `transaction_id` (order ref `KH-…`), `currency: "INR"`, `value` (rupees), `tier` | `analytics.ts:90-95` | Razorpay `onPaid`, `PreorderForm.tsx:154-155` |
| `preorder_address_saved` | `transaction_id` | `analytics.ts:127` | address saved on /thanks, `AddressForm.tsx:79` |
| `preorder_dismissed` | `tier` | `analytics.ts:132` | Razorpay sheet closed, `PreorderForm.tsx:147-148` |

- **Value rule:** the amount actually collected, from the server's create-order response, in rupees
  (₹499 token, ₹7,999 full, ₹99 event tier). Never the ₹4,999 headline (§8.30-f). Prices themselves:
  [pricing](../product/pricing.md).
- **No server-side GA4.** There is no Measurement Protocol call; a payer who closes the tab before
  `onPaid` runs is never reported to GA4 (§8.40-b, `docs/website-steps.md` line 3007).
- **Cross-host:** both hosts share the registrable domain `kheelona.com`. gtag's default cookie
  domain should put `_ga` on `.kheelona.com` so one client id spans both hosts; **not verified in
  this inventory**.
- **Configure your domains (cross-domain): set by the founder on 2026-08-23.** The tag lists
  `kheelona.com` and `store.kheelona.com`, both "Exactly matches"; without it GA4 counts the hop to
  the store as a referral (`docs/checkpoints/one-tap-and-cleanup-2026-08-23.md:134-137`;
  `docs/checkpoints/closed-rounds.md:280`; [lessons](../engineering/lessons.md)). It lives on the
  existing stream, so the new site inherits it. Everything else in the GA4 admin (key events,
  enhanced-measurement toggles, unwanted referrals) is unread: [open questions](../open-questions.md) C1.

## 4. Meta Pixel (browser)

- **ID:** `1051265191046395` since 2026-09-20. `1045085251085243` is **retired** (§8.41; checked in
  every bundle by the 2026-09-20 round). Business portfolio `1804686660128463`; ad account
  `1195520716116929` (`src/config/site.ts:268-300`; §8.41-a, line 3161).
- **Loads:** inline Meta snippet via `next/script` `strategy="afterInteractive"`, loading
  `https://connect.facebook.net/en_US/fbevents.js`, then `fbq('init', '1051265191046395')` and
  `fbq('track', 'PageView')` (`MetaPixel.tsx:81-89`), mounted last in `<body>` (`layout.tsx:110`).
  **No `<noscript>` image** on purpose (§8.30-d).
- **Host gating:** `META_PIXEL_HOSTS` = `GA4_HOSTS`, checked in an effect (`MetaPixel.tsx:19-21`, `:73-75`).
  Meta's own traffic allow list is "kheelona.com and subdomains" and Meta blocks other domains
  (`docs/checkpoints/meta-pixel-migration-2026-09-20.md:237`, `:278`).
- **Helper:** every call goes through `fbTrack(event, params, eventId?)` (`src/lib/fbq.ts:20-27`).
  Mount-time events wait for the `fbq` stub with `whenFbqReady` (`fbq.ts:66-88`), or they are
  silently dropped (§8.30-k).

| Event | Parameters | eventID | Fired at | When |
|---|---|---|---|---|
| `PageView` | none | none | `MetaPixel.tsx:88` | every full page load |
| `PageView` | none | none | `MetaPixel.tsx:43` | each client-side route change (first run skipped, `:38-42`) |
| `ViewContent` | `content_name: "Kheelu"`, `content_ids: ["lumi"]`, `content_type: "product"`, `value: 4999`, `currency: "INR"` | none | `ViewContentTracker.tsx:50-57` | once per load of `/products/kheelu` only (`products/kheelu/page.tsx:149`) |
| `InitiateCheckout` | `currency: "INR"`, `value` (rupees), `content_category: <tier>` | none | `analytics.ts:77` | beside GA4 `begin_checkout` |
| `Purchase` | `currency: "INR"`, `value` (rupees), `content_category: <tier>`, `order_id: <order ref>` | `purchase_<order ref>` | `analytics.ts:96-112` | Razorpay `onPaid` |

- `ViewContent` value is `LAUNCH_AMOUNT_PAISE / 100` (₹4,999), the headline price, deliberately not
  what checkout collects; it must switch to `FULL_AMOUNT_PAISE` in the sell-out sweep
  (`ViewContentTracker.tsx:14-28`; §8.30-j, line 1412). `content_ids` still says `"lumi"` (the
  pre-rename id); keep it as is for parity.
- **Not fired, deliberately:** `InitiateCheckout` on CTA clicks, `Lead` on /contact, `Purchase` on
  /thanks (§8.30-j, §8.30-p).
- **Meta-side settings that ride on the pixel ID** (dashboard, not code; the new site inherits them
  automatically if the ID is unchanged), recorded in §8.41-i addendum (line 3372) and the migration
  checkpoint (`:104-108`, `:155-156`, `:277-278`):

| Setting | State |
|---|---|
| Automatic advanced matching | **On**, all seven fields (founder decision 2026-09-02, §8.30-o) |
| First-party cookies | On |
| Automatic events | Off |
| Track events automatically without code | Off |
| Automatically include more detailed page and product info | Off |
| Traffic permissions allow list | kheelona.com and subdomains |
| Business Manager → Conversions API connections → "Automatically connect only your datasets" | On: Meta mirrors browser events into the server channel (§8.41-i). Retired pixel excluded 2026-09-20 |

## 5. Meta Conversions API (server-side Purchase)

- **Endpoint:** `POST https://graph.facebook.com/v21.0/1051265191046395/events`
  (`meta-capi.ts:42`, `:241-242`).
- **Secrets (names only):** `META_CAPI_TOKEN` (real secret, optional; absent means skipped and logged)
  and `META_CAPI_TEST_CODE` (development only; in production it would divert real conversions to the
  test stream) (`src/lib/store/env.ts:103-104`; §8.30-l).
- **Event:** one name only, `Purchase` (`meta-capi.ts:183`). Payload (`purchasePayload`,
  `meta-capi.ts:158-209`):
  - `event_id: purchase_<order ref>` (same function as the browser, `fbq.ts:41-43`)
  - `event_time`: `paid_at` in seconds; `action_source: "website"`; `event_source_url: "https://store.kheelona.com"`
  - `user_data`: SHA-256 of `em` (email), `ph` (digits only), `fn` (first token of the name); plus
    `fbp`, `fbc`, `client_ip_address`, `client_user_agent` as captured at order time
  - `custom_data`: `currency: "INR"`, `value` (rupees collected), `order_id`, `content_category: <tier>`
- **Where it fires:** `notifyPaid()` (`src/lib/store/fulfil.ts:324-358`, call at `:341`), reached
  only after `markPaid` returns `"paid"`, from either the webhook (`webhook/route.ts:133-134`) or the
  browser confirm route (`confirm/route.ts:45-46`). One atomic UPDATE wins, so it fires exactly once.
  **No public CAPI endpoint exists, by design** (§8.30-l).
- **Dedup with the browser:** Meta merges a browser and server event with the same `event_name` and
  `event_id` within 48 hours. Both sides derive `purchase_<order ref>` independently. Success on a
  real order = Purchase on the pixel with connection method "Multiple" (`CLAUDE.md:82-86`). Whether
  the two September orders show "Multiple" is [open questions](../open-questions.md) C2.
- **Logging:** every outcome logs `[meta-capi] SENT|SKIPPED|REJECTED|UNCONFIRMED|FAILED purchase_<ref>`
  (`meta-capi.ts:227-296`); `/api/health` reports `capi: configured|missing`, presence only (§8.30-q).
- **Server PageViews you may see in Events Manager are not ours.** They are Meta's business-level
  mirroring (§8.41-i).

## 6. PostHog in the browser

- **Project / key:** `617632`, US cloud; key in `src/config/site.ts:329` (a public write-only project
  key, §8.38-a). Package `posthog-js` `1.434.2` exact (`package.json:34`).
- **Loads:** dynamic `import("posthog-js")` only after the host check passes (`PostHogGate.tsx:45-52`),
  mounted last in `<body>` (`layout.tsx:118`). The gate hands the instance to `src/lib/posthog.ts`
  (`registerPostHog`, `:35-37`).
- **Init options** (`PostHogGate.tsx:53-148`), each one load-bearing:

| Option | Value | Line |
|---|---|---|
| `api_host` | `/ingest` (same-origin, reverse proxy) | 62 |
| `asset_host` | `/ingest-assets` | 74 |
| `ui_host` | `https://us.posthog.com` | 84 |
| `custom_campaign_params` | `["utm_id", "placement"]` (added to PostHog's built-in `utm_*` and click-id list) | 102 |
| `autocapture` | `true` | 109 |
| `capture_exceptions` | `true` (error tracking) | 113 |
| `disable_session_recording` | `true`, then started per route | 119, 162-165 |
| `session_recording.maskAllInputs` | `true` | 127 |
| `session_recording.maskTextSelector` | `.ph-mask` | 134 |
| `person_profiles` | `"identified_only"`; nothing calls `identify()` | 141 |
| `capture_pageview` | `"history_change"` | 147 |

- **Session replay deny list:** `POSTHOG_REPLAY_DENY_PATHS = ["/thanks", "/store/thanks"]`, browser
  paths, prefix match (`src/config/site.ts:449-463`). `/thanks` is the one that matters because the
  store host rewrites it (§8.38-i, line 2676).
- **Autocapture suppression:** the /thanks page container carries `ph-no-capture ph-mask`
  (`src/app/store/thanks/page.tsx:118`).
- **CTA identifier:** `Button` writes `data-ph-capture-attribute-cta={track}`, which PostHog promotes
  to a top-level `cta` property on `$autocapture` (`src/components/atoms/Button.tsx:54-69`, `:86`;
  §8.40-h). The eight values on production are listed **only here**; other pages link to this table.
  Which new CTA carries which value is [open questions](../open-questions.md) G10.

| `cta` value | Where | File |
|---|---|---|
| `hero` | Home hero | `src/features/home/components/Hero.tsx:52` |
| `home-arc` | Home growth arc | `src/app/(site)/page.tsx:247` |
| `compare` | Home comparison | `src/features/home/components/Compare.tsx:34` |
| `navbar` | desktop nav | `src/components/organisms/Navbar.tsx:59` |
| `navbar-mobile` | mobile menu | `src/components/organisms/Navbar.tsx:91` |
| `finale` | every page's FinaleCTA | `src/components/organisms/FinaleCTA.tsx:111` |
| `product-top` | /products/kheelu | `src/app/(site)/products/kheelu/page.tsx:167` |
| `product-foot` | /products/kheelu | `src/app/(site)/products/kheelu/page.tsx:363` |

- **New values placed after Gate A** (not on production; no approved mockup carries them). Every value the rebuild
  places is in [architecture §8.3](../engineering/architecture.md#83-cta-values-data-ph-capture-attribute-cta-reconciled-from-the-mockups);
  these are the ones a founder decision added after the mockups were frozen (D046). The eight above never change.
  `test/guards/tracking-registry.test.ts` holds this table to the registry (`src/lib/tracking/cta.ts`).

| New `cta` value | Where | Decision |
|---|---|---|
| `whatsapp-float` | The WhatsApp chat bubble, every page (`src/components/chrome/WhatsAppFloat/WhatsAppFloat.tsx`) | [D050](../decisions/D050-whatsapp-chat-button.md) |
| `share-whatsapp` | The "Know a parent who needs this? Share Kheelu on WhatsApp" link under the offer card on `/` and `/products/kheelu` (`src/components/sections/OfferSection/OfferSection.tsx`, task 8c.2) | [D061](../decisions/D061-advisor-proposal-what-we-take-2026-10-15.md) |
| `hero-film` | Home hero link "Watch Kheelu ask, in a 30-second film", laptops only (the selling update, task Q2.9) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `home-why` | Home's "Why it matters" button (Q2.9) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `home-asks` | Home's sticky-scroll section button (Q2.9) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `home-asks-learn` | Home's sticky-scroll link "See how it works" to `/products/kheelu#modes` (Q2.9) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `home-offer` | Home's offer-card button, the offer moved up (Q2.9) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `product-ask` | The product page's button after "What asking back sounds like." (Q2.10) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `safety-facts` | `/safety`'s button after the four facts (Q2.11) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |
| `guide-answers` | The buyer's guide's button after "How Kheelu meets each check." (Q2.12) | [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md) |

- **A placement added after Gate A to an existing value:** `finale` on `/setup` (its new close, the selling update,
  task Q2.12; [D065](../decisions/D065-selling-site-founder-answers-2026-10-15.md)). The value and its meaning are unchanged; `src/lib/tracking/cta.ts` holds it under `finale.added`.
- **Values that stop firing with the selling update** (they stay registered and are never reused): `see-it-ask`,
  `see-it-ask-learn`, `compare-learn`, `faq-more`, `hero-learn` (Home) and `product-safety` (the product page);
  [architecture §8.3](../engineering/architecture.md#83-cta-values-data-ph-capture-attribute-cta-reconciled-from-the-mockups).

- **Custom funnel events:** the same six names and parameters as GA4 (table in section 3), fired by
  `phCapture` beside each `track()` call (`analytics.ts:66`, `:72`, `:78`, `:113-118`, `:128`, `:133`).
  The `begin_checkout` PostHog payload equals GA4's; `purchase` carries `transaction_id`, `currency`,
  `value`, `tier`.
- **Device id to the server:** `phDistinctId()` (`src/lib/posthog.ts:86-95`) is sent with the
  create-order request (`PreorderForm.tsx:126`) and stored on the order (see section 9).
- **Project-level settings (dashboard, delivered to the SDK as remote config; read 2026-10-11 via
  `project-get`):** web vitals autocapture **on**, exception autocapture on, console-log capture on,
  network performance capture on, session recording on with retention **30d** and no sampling,
  heatmaps on, dead-click capture on, `anonymize_ips: false`, test-account filter excludes cohort
  580233, authorised URL `https://kheelona.com`. These carry over if the key and SDK stay. The
  test-account cohort has 0 members, so internal traffic is counted ([open questions](../open-questions.md) C7).
- **Project configuration a redesign could break: only GeoIP; nothing depends on page markup.**
  0 actions, 0 feature flags, 0 surveys, 0 destinations, 0 batch exports, 0 workflows; 1
  transformation "GeoIP" (`template-geoip`, enabled), on which section 8's country data depends; 10
  saved insights and 2 dashboards, all generic `$pageview` / `$autocapture` templates with no URL,
  path or selector filter (read-only MCP, 2026-10-11: `actions-get-all`, `feature-flag-get-all`,
  `surveys-get-all`, `cdp-functions-list`, `batch-exports-list`, `workflows-list`,
  `dashboards-get-all`, `execute-sql` on `system.insights`; matches the reviewer's check).

## 7. PostHog server event

- **Event:** `purchase_confirmed`, deliberately not `purchase`, so browser and server never
  double-count; the gap between the two is the client-event loss rate (§8.40-c;
  `src/lib/store/posthog-server.ts:43`).
- **Payload** (`posthog-server.ts:53-85`): `distinctId` = stored `ph_distinct_id`, else the order ref;
  properties `transaction_id`, `currency: "INR"`, `value` (rupees), `tier`, `source: "webhook"`, the
  order's campaign keys spread flat (`utm_*`, `utm_id`, `placement`), and
  `$process_person_profile: false`; `timestamp` = `paid_at`.
- **Sends direct to `https://us.i.posthog.com`**, not through `/ingest`, with `flushAt: 1` and an
  awaited `flush()` (`posthog-server.ts:97-114`; §8.40-d).
- **Fires from:** `notifyPaid()` beside the Meta CAPI call (`fulfil.ts:350`), so it has the same
  exactly-once guarantee.

## 8. PostHog reverse proxy and routing

- **Rewrites** (`next.config.ts:55-66`, `beforeFiles`): `/ingest-assets/:path*` →
  `https://us-assets.i.posthog.com/:path*`; `/ingest/:path*` → `https://us.i.posthog.com/:path*`. Two
  non-overlapping prefixes on purpose (§8.39-c, line 2901).
- **`skipTrailingSlashRedirect: true`** (`next.config.ts:30`) so PostHog's `/e/`, `/s/`, `/i/` keep
  their slash; `src/proxy.ts:47-52` restores the 308 for every other path **with the query string**.
- **Proxy matcher excludes the PostHog paths** (`src/proxy.ts:203`) and `routeForHost` passes them
  (`src/lib/store/host.ts:51`), so the store host never rewrites `/ingest/e/` into `/store/...` (§8.39-b).
- **Geography works through the proxy.** PostHog `$pageview` countries over the last 30 days: IN 928,
  US 132, then 18 other countries (HogQL aggregate, 2026-10-11). Visitors do not collapse to one
  location, which closes the open geo check in `CLAUDE.md:194-199`. Country comes from the GeoIP
  transformation (section 6).

## 9. Attribution across kheelona.com → store.kheelona.com

Ads land on `kheelona.com`; every pre-order CTA goes to `https://store.kheelona.com` with **no query
string** (`PREORDER_HREF = STORE_URL`, `src/config/site.ts:21-25`). Attribution survives the hop
through first-party cookies on `.kheelona.com`, read server-side when the order is created.

| Carrier | Set by | Contents | Attributes | Read by |
|---|---|---|---|---|
| `kh_utm` | edge, `src/proxy.ts:163-185` | JSON of any of `CAMPAIGN_KEYS`: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `placement` (`src/lib/campaign.ts:49-60`), values capped at 120 chars | `.kheelona.com`, Secure, HttpOnly, SameSite=Lax, session; **first touch wins** | `create-order` (`route.ts:107`), falls back to the store URL's own params |
| `kh_fbclid` | edge, `src/proxy.ts:127-145` | raw `{id, ts}` of the landing `fbclid`, never a built `fbc` (`src/lib/click-id.ts:27`, `:52-55`) | same as above; first touch wins | `readFbAttrib` builds `fbc` = `fb.1.<ts>.<fbclid>` **only if Meta's `_fbc` is absent** (`meta-capi.ts:112-129`, `click-id.ts:64-69`) |
| `_fbp`, `_fbc` | Meta Pixel | Meta's own ids, on `.kheelona.com` (measured, §8.41-f) | Meta's | `readFbAttrib` (`meta-capi.ts:89-138`) |
| PostHog cookie | PostHog SDK | anonymous device id | `.kheelona.com` (`src/lib/campaign.ts:11-13`) | browser, sent as `phDistinctId` |
| `kh_order` | edge, claim step | order session for /thanks, 2 h | path `/thanks`, HttpOnly | /thanks page (`src/lib/store/thanks-session.ts:24-31`) |

- **Stored on the order row** by `create-order`: `utm` (`:107`), `fb_attrib` = `{fbp, fbc, ip, ua}`
  (`:113`), `ph_distinct_id` (`:119`). Migrations `0003_fb_attrib.sql` and `0004_ph_distinct_id.sql`
  are applied by hand in Supabase (§8.40-i). The internal alert email prints `Source` from `utm`
  (`src/lib/email/templates.ts:204`).
- **Live check, 2026-10-11:** a tagged GET of `/products/kheelu` returned both `Set-Cookie: kh_utm=…`
  and `Set-Cookie: kh_fbclid=…` with `Domain=.kheelona.com; Secure; HttpOnly; SameSite=lax`; a tagged
  `/team/` returned a 308 to `/team?utm_source=…` and still set `kh_utm`; `www` 308s to the apex with
  the query intact.
- **The credential never reaches analytics.** The email link `store.kheelona.com/thanks?ref=…&t=…` is
  consumed at the edge: 303 to clean `/thanks` plus the `kh_order` cookie (`host.ts:59-63`,
  `proxy.ts:60-82`; security finding F-01), so no tag ever reports the token in `page_location`.
- **What is not carried:** `gclid` and other non-Meta click ids are not stored on the order (only
  PostHog's built-in campaign capture sees them). No Google Ads account or tag exists on the site.
- Campaign tagging rules for ads: `docs/utm-conventions.md:102-165` (`utm_source=facebook`,
  `utm_medium=paid_social`, `utm_campaign={{campaign.name}}`, `utm_content={{ad.name}}`,
  `utm_id={{campaign.id}}`, `placement={{placement}}`). See the live snapshot below for how far the
  ads actually follow it.

## 10. Razorpay

- **Checkout script:** `https://checkout.razorpay.com/v1/checkout.js`, loaded on demand
  (`src/features/preorder/lib/checkout.ts:13`, `:54`); our `order_ref` travels in `notes` (`:89`) and
  in the Razorpay order's `receipt` and `notes.order_ref` (`src/lib/store/razorpay.ts:46-47`).
  Razorpay sets its own cookies during payment (`/privacy`, `privacy/page.tsx:37`).
- **Webhook:** `https://store.kheelona.com/api/razorpay/webhook`, subscribed to `order.paid` and
  `payment.captured` (`docs/checkpoints/closed-rounds.md:274`; `docs/store-go-live.md:172-183`). The
  handler also acts on `refund.processed` and `payment.failed` (`webhook/route.ts:27-32`); whether
  those two are subscribed in the dashboard is **not recorded anywhere**
  ([open questions](../open-questions.md) C4).
- **Signature:** `x-razorpay-signature` HMAC over the raw body (`route.ts:42-50`); dedup on
  `x-razorpay-event-id` in `webhook_events` (`:53-82`).
- Analytics consequence: a paid event leads to `notifyPaid` → Meta CAPI `Purchase` + PostHog
  `purchase_confirmed` (sections 5 and 7). Checkout steps themselves: [checkout](./checkout.md).
- **Balance revenue is tracked by no tool.** The ₹4,500 balance is collected by a manual Razorpay
  payment link ([checkout](./checkout.md), step 16). That page is Razorpay's, so no GA4, Pixel or
  PostHog event fires, and the webhook never reaches `notifyPaid`, so there is no CAPI `Purchase`
  and no `purchase_confirmed` either. Why, with the code trail:
  [checkout, the balance step](./checkout.md#the-balance-step-4500). How the links are
  created and whether they carry `order_ref`: [open questions](../open-questions.md) F12.

## 11. Resend (order emails)

- `POST https://api.resend.com/emails` with `from`, `to`, `subject`, `html`, `text`, `reply_to` only
  (`src/lib/email/send.ts:30-43`). No tracking flags, tags or UTM-tagged links in our payload; links
  are WhatsApp, `mailto:` and the signed /thanks link (`templates.ts:46-47`, `:121`).
- Resend's own open and click tracking is a per-domain dashboard setting; its state was **not
  verified**.

## 12. Search Console, Bing and Meta domain verification

| Property | Method | Evidence |
|---|---|---|
| Google Search Console, domain property `sc-domain:kheelona.com` | DNS | `closed-rounds.md:78`; TXT `google-site-verification=LjTlYbqoTytrMngNiD4B5c9szrA6MB7Va2G5Xkk6RRQ` on `kheelona.com` (dig, 2026-10-11) |
| Bing Webmaster Tools | unknown | "submitted" (`closed-rounds.md:78`, `:292`); no `BingSiteAuth.xml` (404), no `msvalidate` meta tag, no Bing TXT record |
| Meta Business Manager domain `kheelona.com` | DNS TXT | `facebook-domain-verification=0enw2ff8e81tw7yesr8ptk9tienpo5` (dig, 2026-10-11); no meta tag needed or present (§8.30, line 1341) |
| Ahrefs project ownership | Linked Google Search Console account (no DNS, file or tag of its own) | "Website verified via Google Search Console.", 2026-09-11 (`docs/checkpoints/seo-aeo-geo-2026-09-11.md:408-411`); details in section 2 |

- **No verification meta tags** in the live HTML of `/`, `/products/kheelu` or `store.kheelona.com/`
  (2026-10-11). The store carries `<meta name="robots" content="noindex, nofollow">` and
  `x-robots-tag: noindex, nofollow`.
- Other DNS TXT on the apex: SPF `v=spf1 include:_spf.google.com ~all`; DMARC
  `v=DMARC1; p=none; sp=quarantine; …` (dig, 2026-10-11). Not tracking, but must not be disturbed.
- A TXT absence would not prove a property unverified (a GSC domain property can verify by CNAME,
  §8.36-f, `docs/website-steps.md` line 2354).

## 13. Not present (checked)

- **`/.well-known/`**: `security.txt`, `apple-app-site-association`, `assetlinks.json`,
  `traffic-advice` and the directory itself all 404 on both hosts; `public/` has no `.well-known`
  folder (2026-10-11). Whether to publish `security.txt` is part of [open questions](../open-questions.md) C10.
- **`/ads.txt`, `/app-ads.txt`**: 404 on both hosts.
- **Merchant Center / product feed:** no feed route, no feed file, no Merchant Center verification
  in code or DNS. (Product JSON-LD exists on the product page, owned elsewhere.) The founder still
  has to confirm no Google Ads or Merchant Center account exists ([open questions](../open-questions.md) C3).
- **Google Tag Manager, Google Ads (`AW-`), TikTok, LinkedIn, Microsoft Clarity, Hotjar, affiliate
  or marketplace tags:** none in `src/` (`git grep` at the tag, 2026-10-11).
- **Do Not Track / Global Privacy Control:** nothing reads either.

## 14. Security telemetry that touches tracking

- **CSP is still Report-Only** in production (`CSP_PHASE = "report"`, `src/lib/security-headers.ts:46`;
  live header `content-security-policy-report-only`, 2026-10-11). Reports go to `/api/csp-report`. The
  policy allow-lists every tracking origin (`security-headers.ts:50-99`): Ahrefs, googletagmanager,
  google-analytics (+ regional), vitals.vercel-insights.com, `*.razorpay.com`, `*.rzp.io`,
  pay.google.com, connect.facebook.net, www.facebook.com (also in `form-action` and `frame-src`),
  us.i.posthog.com, us-assets.i.posthog.com. A new site that drops an origin silently loses events
  the day the CSP is enforced. Keeping Report-Only with an identical policy through launch is
  [open questions](../open-questions.md) C10.
- **`vitals.vercel-insights.com` is allowed (`connect-src` only, `security-headers.ts:64`, `:171`) but
  nothing loads from it.** `@vercel/speed-insights` is not a dependency (`package.json:22-41`, no
  match in `package-lock.json`), and the installed `@vercel/analytics` 2.0.1 never names that host
  (grep of its `dist/`, 2026-10-11). The code comment calls it Web Analytics' fallback host
  (`security-headers.ts:61-63`). This is a harmless allowance, **not a missing integration**: there
  is no Speed Insights to carry over.
- `/api/health` reports `capi`, `email`, Razorpay mode and store readiness (§8.30-q).

### 14a. Hosts the Report-Only CSP refuses with the tags loading (task 4.9 item 5, 2026-10-13)

With the tags loading on a local production build (LP-tags), the Report-Only policy reports two beacon hosts that
none of its directives names, and logs an error for its own `upgrade-insecure-requests` (M1,
[log 2026-10-14 08:40](../log.md); Lighthouse Best Practices 70 against B10's about 74). Both are sent by tags already
in this inventory; no ID, event name or parameter is involved, and none changed.

| Host | Sent by | How identified | In the CSP |
|---|---|---|---|
| `https://www.google.com/g/collect` | GA4 (`gtag.js`, section 3): the hits carry its own measurement ID, `tid=G-7LMKSFEXZ9` | M1's LP-tags Lighthouse reports (`lighthouse-reports/2026-10-13/lp-tags-*`, local only, D039; read 2026-10-13): two fetches, on Home and the store, each a Content-Security-Policy issue; a headless LP-tags probe on 2026-10-13 saw the same tag report only to `www.google-analytics.com/g/collect` (allowed) | no: `img-src` and `connect-src` name `www.googletagmanager.com` and the google-analytics hosts only |
| `https://dv-c3e594c6d429469e90b54478358619c3.ecs.us-east-1.on.aws/` (`/events`), fallback `https://bded8a3c6ae-1-1053047382554.us-central1.run.app` | the Meta Pixel (section 4): its OpenBridge gateway, named by the pixel's own configuration, which `fbevents.js` loads | the configuration `fbevents.js` requested in the 2026-10-13 LP-tags probe (`connect.facebook.net/signals/config/1051265191046395?v=2.9.419&r=stable&domain=kheelona.com…`), fetched and read the same day: `config.set("1051265191046395", "openbridge", {"endpoints":[{"endpoint":"https://dv-c3e594c6d429469e90b54478358619c3.ecs.us-east-1.on.aws/", …, "fallbackDomain":"https://bded8a3c6ae-1-1053047382554.us-central1.run.app"}]})`; the baseline saw it on production too ([baseline §7.2](../qa/baseline-2026-10-10.md)). Whether it is the business's Conversions API connection is [open questions](../open-questions.md) C18 | no: not in `connect-src` |

**The policy now admits both (task 6.6, merged 2026-10-14).** The founder amended [D039](../decisions/D039-repo-and-setup-answers.md) C10
([D054](../decisions/D054-founder-answers-open-questions-2026-10-14.md) item 9): the Report-Only policy drops
`upgrade-insecure-requests` and admits `www.google.com` and the Meta gateway (`dv-c3e594c6d429469e90b54478358619c3.ecs.us-east-1.on.aws`
and its `run.app` fallback). It stays Report-Only, so nothing that loads today is blocked. `src/lib/security-headers.ts` is
frozen (ADR-013), so the change went through a reviewed authorised diff citing D054 (task 6.6, commit `4ffa0f0`);
`test/security-headers.test.ts` proves the hosts admitted, the directive gone, the header still Report-Only, and the
policy's wildcard sources equal to the tag's. No ID, event name or parameter changed. Before the policy is ever enforced,
`upgrade-insecure-requests` comes back for the enforced header only (6.6 note: it is dropped unconditionally today;
a new reviewed diff). The table above records what task 4.9 found before the change.

**LP-tags delivered them.** The LP-tags profile blocks the tags' beacons so a local run sends nothing
(`scripts/qa/lighthouse.mjs` `BLOCKED`: google-analytics and analytics.google collect, `facebook.com/tr`, PostHog's
capture paths, Ahrefs' API), but neither host above is in that list: M1's 30 LP-tags reports record the gateway's
`/events` answered 200 in 36 requests and the two `www.google.com/g/collect` hits answered 204 (read 2026-10-13), so those
local loads reached Meta's gateway and GA4.

**At M2 (2026-10-14, LP-tags, 30 reports after task 6.6):** no CSP console error is left on any page. Two things remain,
neither an ID, event or parameter change:
- One run of three on `/privacy` reported a Report-Only violation for `https://connect.facebook.net//log/error?p=capig_pixel&pn=openbridge3…`,
  the Meta Pixel's own diagnostic log of its OpenBridge state (`arm_state=armed`, pixel `1051265191046395`, event
  `PageView`). `connect.facebook.net` is in `script-src` but not in `connect-src`. Report-Only blocks nothing, so it is
  delivered; admitting it is a reviewed diff of the frozen `security-headers.ts` with a decision ID (open question G18).
- Every LP-tags page logs a 404 for `/_vercel/insights/script.js` (Vercel Web Analytics, section 1): `next start` has no
  Vercel edge to serve it. The Lighthouse harness names this console error apart and allows it on LP-tags only
  (`scripts/qa/lighthouse.mjs`; any other console error, or the same one on production, still fails).

## 15. Consent behaviour today (state exactly as it is)

- **There is no consent banner, no Consent Mode, and no in-product opt-out.** All five tools load on
  the first page view on production hosts. This was a recorded decision: "No consent gate ships
  today, and that is a decision, not an oversight" (§8.21-c, `docs/website-steps.md` lines 480-486).
- **Disclosure instead:** `/privacy` "How we measure visits" names the tools, which set cookies, that
  the Meta Pixel follows visitors across sites, the hashed details our server sends to Meta, the
  `kh_utm`/click-id cookie, the stored PostHog id, and that blocking cannot stop the proxied PostHog
  or the server-side Meta report (`src/app/(site)/privacy/page.tsx:68-180`, section "How we measure visits"). The policies page itself
  is covered in [policies](../product/policies.md).
- **What limits collection:** host gating; PostHog replay masks all inputs and never runs on /thanks;
  `ph-no-capture` on /thanks; no `identify()`; PostHog stores IPs (`anonymize_ips: false`); Meta
  automatic advanced matching is on with all fields (§8.30-o).
- The brief keeps consent behaviour exactly as it is; any compliance concern goes to Gate A, not into
  code ([brief §9.4](../raw/brief/kickoff-brief.md)). The Gate A item is
  [open questions](../open-questions.md) G6.

## Live snapshot: PostHog, last 30 days

Aggregates only, HogQL over `events`, run 2026-10-11 00:44-00:50 UTC. Counts include internal and
verification traffic ([open questions](../open-questions.md) C7).

| Event | Count | Hosts | First / last seen (UTC) |
|---|---|---|---|
| `$pageview` | 1,159 | apex 1,049 · store 110 | 2026-09-19 / 2026-10-10 |
| `$web_vitals` | 1,001 | apex 869 · store 132 | 2026-09-19 / 2026-10-10 |
| `$pageleave` | 876 | | 2026-09-19 / 2026-10-11 |
| `$autocapture` | 750 | | 2026-09-19 / 2026-10-10 |
| `$dead_click` / `$dead_swipe` / `$rageclick` | 89 / 61 / 13 | | |
| `$exception` | 37 | apex | 2026-09-20 / 2026-10-06 |
| `preorder_form_started` | 11 | store | 2026-09-20 / 2026-10-05 |
| `preorder_start` / `begin_checkout` | 6 / 6 | store | to 2026-10-02 |
| `preorder_dismissed` | 3 | store | to 2026-10-02 |
| `purchase` | 2 | store | 2026-09-25, 2026-09-27 |
| `purchase_confirmed` | 2 | none (server) | 2026-09-25, 2026-09-27 |
| `preorder_address_saved` | 2 | store | 2026-09-25, 2026-09-27 |
| `proxy_geo_check`, `$proxy_smoke_test`, `$recording_observed` | 2 each | | 2026-09-20 only (setup tests) |

- `$autocapture` with a `cta` property: `navbar` 11, `finale` 7, `hero` 5, `product-top` 3 (all apex).
- `purchase_confirmed` carries `utm_source` among its properties, so the `kh_utm` → order → server
  event chain has worked on at least one real order.
- **Paid traffic tagging:** pageviews carrying `fbclid` mostly arrive as `utm_source` `an` / `ig` /
  `th` / `fb` with `utm_medium=paid` (last seen 2026-09-23); the convention `facebook` /
  `paid_social` appears on 2 pageviews (2026-09-20) and **`placement` has never arrived**. 232 more
  pageviews carry `fbclid` with no UTM at all. The founder's ad re-tag is
  [open questions](../open-questions.md) C5.
- **PostHog ← Meta Ads warehouse source** (`external-data-sources-list`): source type MetaAds, account
  `1195520716116929`, created 2026-09-20, 27 schemas, 6-hourly sync, status Completed, last run
  2026-10-11 00:45 UTC. It is not in the repo or the docs. In its synced `metaads_ads` table, of 14
  ads none is `ACTIVE`: 7 `WITH_ISSUES` (destination `https://kheelona.com/products/kheelu`, no URL
  tags on the creative), 4 `PAUSED`, 3 `CAMPAIGN_PAUSED` (2 carry the convention tags). Other creative
  destinations seen: `https://www.kheelona.com/`, Instagram profile, Messenger, WhatsApp. Read this as
  the last sync's view, not as Ads Manager.

## Branch-only, not live

From `archive/mid-version-2026-10-10` (`50827d1`). None of this is in production.

- **`ViewContent` also on Home** (founder request recorded on the branch 2026-10-02), same payload;
  component moved to `mid:src/components/molecules/ViewContentTracker.tsx`, mounted at
  `mid:src/app/(site)/page.tsx:79` and `mid:src/app/(site)/products/kheelu/page.tsx:127`. Whether the
  new site does this is [open questions](../open-questions.md) G10.
- **Two new `cta` values:** `home-reserve` (`mid:src/features/home/components/PriceRoom.tsx:48`) and
  `sticky-bar` (`mid:src/components/organisms/StickyReserveBar.tsx:67`). All eight production values
  were kept (`home-arc` moved to `mid:src/features/home/components/HowItWorks.tsx:91`).
- The CTA label changed on the branch (candidates and decision: [messaging](../brand/messaging.md));
  the measurement code itself was frozen byte-identical to the pre-merge tag by
  `mid:test/analytics-freeze.test.ts` (a useful pattern for this reset's QA, see checklist item 0).
- `/faq` lost its 308 and became a page (`mid:next.config.ts:174-176`); no tracking effect. URL detail:
  [URL map, section 7](./url-map.md#7-mid-version-routes-not-live).

---

## Parity checklist (Phase 6 QA)

Run on the new build, with the old tag as the control. "Gate-open probe" means a local production
build with the host gate temporarily allowed for the test host and all third-party requests aborted,
reading the queued calls (`fbq` queue, `dataLayer`, PostHog capture hooks) so nothing reaches the real
properties (method of §8.30-i, line 1403). "Production" means after the Gate B deploy.

| # | Destination | Event / behaviour | Parameters that must match | Fired from (old) | How QA proves it |
|---|---|---|---|---|---|
| 0 | All | Measurement code unchanged | byte-identical, or a reviewed diff | files in this page's sources | Diff against `archive/pre-reset-2026-10-10` (model: `mid:test/analytics-freeze.test.ts`); all guard tests green: `analytics-tags`, `campaign-cookie`, `click-id`, `meta-pixel-id`, `posthog-proxy`, `preorder-cta`, `utm`, plus component tests |
| 1 | Host gates | GA4, Pixel, PostHog load only on apex, www, store | `GA4_HOSTS` list | `site.ts:266`, `:300`, `:413` | Unit tests; on a preview URL: no `fbq`, no `gtag`, no `/ingest` requests |
| 2 | Vercel WA | pageview | none | `layout.tsx:101` | Production: script requested from the obfuscated path, pageviews in Vercel dashboard |
| 3 | Ahrefs | pageview; tag in SSR `<head>` | `data-key="N7vd/jLtIIlHqzFqu57UBg"`, `async` | `layout.tsx:88-92` | `curl` the HTML of every route on both hosts; Ahrefs "Recheck installation" |
| 4 | GA4 | config / `page_view` | `G-7LMKSFEXZ9` | `GoogleAnalyticsGate.tsx:46` | Gate-open probe: `dataLayer` has `config G-7LMKSFEXZ9`; production: `collect?…tid=G-7LMKSFEXZ9&en=page_view`, GA4 Realtime |
| 5 | GA4 + PostHog | `preorder_form_started` | `tier` | `analytics.ts:65-66` | Probe on store: type one character, one event each, payloads identical |
| 6 | GA4 + PostHog | `preorder_start` | `tier` | `analytics.ts:71-72` | Probe: valid submit (sandbox) |
| 7 | GA4 + Pixel + PostHog | `begin_checkout` / `InitiateCheckout` | GA4/PH: `currency`, `value` (rupees), `tier`; Meta: `currency`, `value`, `content_category` | `analytics.ts:76-78` | `npm run qa:payment` (Razorpay sandbox) with gate-open probe; value = 499 not 49900 |
| 8 | GA4 + Pixel + PostHog | `purchase` / `Purchase` | GA4/PH: `transaction_id`, `currency`, `value`, `tier`; Meta: `currency`, `value`, `content_category`, `order_id`, **eventID `purchase_<ref>`** | `analytics.ts:90-118` | Sandbox payment with probe: fbq queue shows `eventID` = `purchase_<ref>`; first real order after deploy: Events Manager Purchase with connection "Multiple" |
| 9 | GA4 + PostHog | `preorder_address_saved` | `transaction_id` | `analytics.ts:127-128` | Sandbox: save address on /thanks |
| 10 | GA4 + PostHog | `preorder_dismissed` | `tier` | `analytics.ts:132-133` | Sandbox: close the sheet |
| 11 | Meta Pixel | init + `PageView` on load, one more per client route change, no double on landing | pixel `1051265191046395` | `MetaPixel.tsx:43`, `:87-88` | Production, real UA: `fbq.getState().pixels[0].eventCount` = 1 on an ordinary page; `HTMLImageElement.prototype.src` hook shows `facebook.com/tr …ev=PageView`; `pushState` adds exactly one |
| 12 | Meta Pixel | `ViewContent` on `/products/kheelu` (and Home only if the founder confirms, [G10](../open-questions.md)) | `content_name: "Kheelu"`, `content_ids: ["lumi"]`, `content_type: "product"`, `value: 4999`, `currency: "INR"` | `ViewContentTracker.tsx:50-57` | Production: `eventCount` = 2 on the product page; image-beacon hook shows `ev=ViewContent` with these params |
| 13 | Meta CAPI | server `Purchase` | `event_id purchase_<ref>`, `action_source website`, `event_source_url https://store.kheelona.com`, hashed `em`/`ph`/`fn`, `fbp`, `fbc`, IP, UA, `custom_data` 4 fields | `meta-capi.ts:158-209` via `fulfil.ts:341` | `meta-capi.test.ts` payload test; never with a test code in production; first real order: Vercel log `[meta-capi] SENT purchase_<ref> events_received=1` |
| 14 | PostHog | `$pageview` (history change), `$pageleave`, `$autocapture` | campaign props incl. `utm_id`, `placement` | `PostHogGate.tsx:53-148` | Production: requests go to `/ingest/e/` (none to `*.posthog.com` from the page); events in PostHog live view from both hosts |
| 15 | PostHog | `$autocapture.cta` | the 8 existing values (section 6) on equivalent CTAs, mapped per [G10](../open-questions.md); new values allowed | `Button.tsx:86` | DOM check that every money CTA carries `data-ph-capture-attribute-cta`; HogQL count by `cta` after deploy |
| 16 | PostHog | `$exception`, `$web_vitals`, `$rageclick`, `$dead_click` | dashboard-enabled | init + project settings | HogQL: each appears from the new build within a day of traffic |
| 16a | PostHog | GeoIP transformation still enabled; country populated | `$geoip_country_code` on new-build events | project pipeline (section 6) | `cdp-functions-list` shows "GeoIP" enabled; HogQL country breakdown after deploy is not one location |
| 17 | PostHog | session replay | starts on store `/`, never on `/thanks` | `PostHogGate.tsx:162-165`, `site.ts:449` | Production with control: recorder script loads on `store.kheelona.com/` and NOT on `/thanks` (§8.39-g) |
| 18 | PostHog | `/thanks` autocapture suppressed | `ph-no-capture ph-mask` container | `thanks/page.tsx:118` | DOM check; no `$autocapture` with `$host=store` and path `/thanks` carrying page text |
| 19 | PostHog server | `purchase_confirmed` | `transaction_id`, `currency`, `value`, `tier`, `source: "webhook"`, campaign keys, `$process_person_profile: false`; distinct id = `ph_distinct_id` | `posthog-server.ts:53-85` via `fulfil.ts:350` | `posthog-server.test.ts` (flush pinned); first real order: one `purchase_confirmed` per `purchase` |
| 20 | Reverse proxy | `/ingest`, `/ingest-assets` rewrites; trailing slash kept | destinations as section 8 | `next.config.ts:55-66` | `GET /ingest/e/` answers 400 on apex, store AND direct to PostHog (control); recorder byte-identical through proxy |
| 21 | Edge cookies | `kh_utm`, `kh_fbclid` | 7 campaign keys; raw fbclid + ts; `.kheelona.com`, HttpOnly, session, first touch | `proxy.ts:127-185` | `curl -D -` a tagged landing on apex and store, and a tagged trailing-slash URL; second tagged landing must not overwrite |
| 22 | Order row | `utm`, `fb_attrib`, `ph_distinct_id` stored | as section 9 | `create-order/route.ts:107-119` | Sandbox order via `qa:payment` against the Supabase stub; remember the stub validates no columns (§8.40-i) |
| 23 | Thanks claim | `?ref&t` consumed, 303 to clean `/thanks` | `kh_order` cookie, 2 h | `host.ts:59-63`, `proxy.ts:60-82` | `curl` the claim URL: 303, `Set-Cookie: kh_order`, `cache-control: private, no-store`; no analytics request contains `t=` |
| 24 | Razorpay | webhook verified, idempotent, `notifyPaid` once | events `order.paid`, `payment.captured` (+ refund, failed: [C4](../open-questions.md)) | `webhook/route.ts` | `qa:payment` sandbox; webhook URL in the Razorpay dashboard unchanged |
| 25 | CSP | every tracking origin still allowed | origin list in section 14 | `security-headers.ts:107-185` | Header string equal to the old one or a reviewed superset; no new `csp-report` entries for tracking origins |
| 26 | Verification | GSC, Meta domain | DNS TXT unchanged | DNS | `dig TXT kheelona.com` before and after; GSC and Meta Domains screens still "verified" |
| 27 | Privacy disclosure | `/privacy` matches what is collected | same-commit rule §8.21-c | `privacy/page.tsx` | `analytics-tags.test.ts` green |

## What the new site must not change

1. **IDs:** GA4 `G-7LMKSFEXZ9`; Meta Pixel `1051265191046395`; PostHog project `617632` and its
   `phc_` key; Ahrefs `N7vd/jLtIIlHqzFqu57UBg`; the Vercel project; the DNS verification TXT records.
2. **Host lists:** GA4, Pixel and PostHog run on exactly apex, www and store; never a preview or
   localhost. Ahrefs stays ungated in the SSR `<head>`.
3. **Event names and parameters**, exactly as in the tables above, including Meta's `content_ids:
   ["lumi"]`, values in rupees (paise / 100), value = amount collected (ViewContent = headline price).
4. **Dedup:** `purchaseEventId()` = `purchase_<order ref>` on both browser and server, and the
   `KH-XXXX-XXXX` order reference it is built from.
5. **Server sends only from `notifyPaid()` behind `markPaid`**; no public CAPI or analytics endpoint;
   `purchase_confirmed` keeps its name and its awaited flush.
6. **Attribution plumbing:** `kh_utm` and `kh_fbclid` (names, `.kheelona.com`, HttpOnly, session,
   first touch), the seven `CAMPAIGN_KEYS`, raw-fbclid storage with one `fbc` builder, `_fbp`/`_fbc`
   capture at create-order, `ph_distinct_id` on the order, `custom_campaign_params`.
7. **PostHog init options** as listed in section 6; no `identify()`; replay deny list as browser
   paths; `ph-no-capture ph-mask` on the /thanks container; the `data-ph-capture-attribute-cta`
   attribute and the eight existing values (new values may be added).
8. **Routing that tracking depends on:** `/ingest` and `/ingest-assets` rewrites, the matcher
   exclusion and `routeForHost` pass, `skipTrailingSlashRedirect` plus the query-preserving 308, the
   store host rewrite (so the browser path is `/thanks`), the apex `/store/*` 308, and the
   `/thanks?ref&t` claim.
9. **Mount pattern:** host check in an effect, `afterInteractive`, tags last in `<body>`, no
   `<noscript>` pixel, `whenFbqReady` for any mount-time Meta event.
10. **The Razorpay webhook URL** `store.kheelona.com/api/razorpay/webhook`, and `/api/*` staying outside
    the proxy matcher.
11. **CSP origins** (and its Report-Only phase until the separate enforce decision).
12. **Consent behaviour:** no banner and no gating change without the founder (brief §9.4).
13. **The /privacy rule:** any tracking change ships with its `/privacy` change in the same commit
    (§8.21-c), guarded by `test/analytics-tags.test.ts`.
14. **PostHog's "GeoIP" transformation** (`template-geoip`, enabled) stays on: country data depends
    on it. Nothing else in the PostHog project depends on page markup (section 6).

## What this inventory could not verify

- GA4 admin settings (enhanced-measurement toggles, key events, unwanted referrals, data retention;
  cross-domain is recorded, section 3) and whether `_ga` is shared across both hosts
  ([C1](../open-questions.md)).
- Whether `refund.processed` and `payment.failed` are subscribed on the Razorpay webhook
  ([C4](../open-questions.md)).
- Whether the Meta CAPI token works: the two September orders should have logged
  `[meta-capi] SENT …` in Vercel; the logs were not accessible here ([C2](../open-questions.md)).
- Bing Webmaster Tools verification method; Resend open/click tracking state.
- Meta custom conversions: the warehouse lists a `custom_conversions` schema but no table; their rules
  (which may reference URLs or event parameters) were not readable ([C2](../open-questions.md)).
- Vercel Web Analytics dashboard data and whether previews are counted separately.

Related pages: [URL map](./url-map.md) · [checkout](./checkout.md) · [pricing](../product/pricing.md) ·
[policies](../product/policies.md) · [laws summary](../legacy/laws-summary.md) ·
[engineering lessons](../engineering/lessons.md)
