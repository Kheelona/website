---
title: Engineering lessons a rebuild on this stack must not relearn
type: engineering
updated: 2026-10-10
cites_at: archive/pre-reset-2026-10-10
sources:
  - docs/website-steps.md at tag archive/pre-reset-2026-10-10 (77552ff), section 8
  - "git show archive/mid-version-2026-10-10:docs/website-steps.md (section 8.42)"
  - "git show archive/mid-version-2026-10-10:docs/checkpoints/cmo-merge-2026-10.md"
  - "git show archive/mid-version-2026-10-10:CLAUDE.md"
  - docs/checkpoints/*.md (blank-404s, dependency-sweep, agency-audit, posthog x2, signup-analytics, meta-pixel x2, preorder-store, one-tap-and-cleanup, security-and-docs, go-live, repo-root-move, production-restructure, v4-merge, v6-content, white-cta-labels)
  - docs/qa-report.md (skimmed; lesson sections read)
  - docs/store-go-live.md
  - security-review.md (sections 1 and 2)
  - CLAUDE.md at 77552ff
  - tools/qa/*.mjs, tools/qa/lib/*.mjs, tools/tokens/check-tokens.mjs, package.json, vercel.json, .nvmrc
  - "code greps at 77552ff (= tag archive/pre-reset-2026-10-10), 2026-10-10"
  - wiki/open-questions.md (section E, C10)
  - "lsof on ports 3456, 3460, 54321, 2026-10-10"
---

# Engineering lessons a rebuild on this stack must not relearn

Plain `path:line` citations on this page refer to tag `archive/pre-reset-2026-10-10`; `mid:path` refers to `archive/mid-version-2026-10-10`.

## What you need to know

- The reset keeps Next.js 16 on Vercel, both hosts, the checkout logic and every tag, so these lessons still apply.
- Deleting the old DS folder breaks `npm run build` unless the token gate goes in the same commit (trap 1).
- Previews carry no GA4, pixel or PostHog and are already noindex: prove tracking on a local build under the real hostnames, then on production.
- Some behaviour exists only on Vercel's edge; a green suite or `next start` does not prove it.
- The repo is public: never `git add -A`; stage by name, and stage deletions before running the guard tests.

The reset keeps Next.js 16 on Vercel, the URLs, the store on `store.kheelona.com`, the checkout logic
and all tracking ([brief §2](../raw/brief/kickoff-brief.md)). These are the lessons from the old
project that still apply to that stack. Each one cost a defect, a deploy or an hour to learn. Every
law is classified in [legacy/laws-summary.md](../legacy/laws-summary.md).

This page does not list ids, events, URLs or prices. For those see
[site/tracking-inventory.md](../site/tracking-inventory.md), [site/url-map.md](../site/url-map.md),
[site/checkout.md](../site/checkout.md) and [product/pricing.md](../product/pricing.md).

**Source key.** WS = `docs/website-steps.md` at `archive/pre-reset-2026-10-10`, "L" = line.
MID = a file read with `git show archive/mid-version-2026-10-10:<path>` (written `mid:` on other pages).
CP = `docs/checkpoints/`. Code references (`src/`, `package.json`, `tools/`, `next.config.ts`,
`vercel.json`) are files at tag `archive/pre-reset-2026-10-10` (= `77552ff`), read on 2026-10-10.

## Five traps specific to this reset

1. **Deleting the old design system breaks the build.** `npm run build` is
   `node tools/tokens/check-tokens.mjs && next build` (`package.json:7`), and that script exits 1 when
   `Design/Kheelona-Design-System-v3/tokens/kheelona.css` is missing (`tools/tokens/check-tokens.mjs:22-29`).
   The commit that deletes the old DS must also remove or repoint the gate, or every build fails,
   Vercel previews included. *Code read 2026-10-10; WS §8.13 L145.*
2. **Previews show no GA4, Meta pixel or PostHog, and that is correct.** Every tag except Ahrefs is
   gated to production hostnames. Tracking parity has to be proven another way (section 5). *WS §8.21-c-i
   L441, §8.30-b L1349; MID cmo-merge-2026-10.md L57-60.*
3. **Previews are already `noindex`.** `src/proxy.ts` adds `x-robots-tag: noindex, nofollow` to every
   host not in `INDEXABLE_HOSTS`, which covers `*.vercel.app` (brief §4.5). The rebuild must keep it.
   *WS §8.32-a L1739.*
4. **Some behaviour exists only on Vercel's edge.** A rewrite carrying a 4xx status and the `/ingest`
   external rewrite cannot be verified with `next start`. Plan a production check for each. *WS §8.34-f
   L2071, §8.39-g L2967.*
5. **The guard tests read the git index, not the disk.** Nine test files list files with `git ls-files`
   (`test/{stories-parse,security-headers,store-secrets,kheelu-art,utm,preorder-cta,not-found-ssr,preorder-copy}.test.ts`,
   `src/lib/seo.test.ts`). Stage new files and deletions before running the suite. *WS §8.37-i L2746-2755.*

## 1. Next.js 16 and Vercel behaviour

- **Read the installed Next docs, not memory.** Next 16 renamed middleware to `src/proxy.ts` and changed
  other conventions; `AGENTS.md` says to read `node_modules/next/dist/docs/` before writing Next code.
  *WS §8.25-a L719; AGENTS.md.*
- **A thrown `notFound()` never server-renders.** It answers with an empty
  `<html id="__next_error__">` shell: no CSS, no text, no `lang`. A URL that matches no route renders
  fine. For dynamic routes use `export const dynamicParams = false` (as
  `src/app/(site)/stories/[slug]/page.tsx:38` does); in the store, render a page rather than throw.
  *WS §8.34-a L1981; CP blank-404s-2026-09-06.md L22-69.*
- **On Vercel, `NextResponse.rewrite(url, { status: 4xx })` throws the destination away** and serves
  the root `/404`, which put marketing chrome on the payment host. `next start` honours it, so only a
  deploy showed the difference. Store dead ends now answer 200 in store chrome. The response header
  `x-matched-path` shows which route really served a request. *WS §8.34-f L2071-2101; CP
  blank-404s-2026-09-06.md L169-217.*
- **`next start` is not the deployment target.** Status overrides, header rewriting, redirect chains
  and external rewrites are verified only on production; until then, say "pending deploy". *WS §8.34-f
  L2092-2098.*
- **Routing order is headers, then redirects, then the proxy, then `beforeFiles` rewrites**, so the
  proxy sees `/ingest/...` before the rewrite does. *WS §8.39-b L2885-2888.*
- **Redirects match before files in `public/`.** A redirect source that names an asset folder 308s the
  images (it once blanked the hero, the mobile LCP element). Use a source that cannot match a filename,
  such as `/product/:slug([^.]+)` (`next.config.ts:122`); `test/redirects-vs-assets.test.ts` guards it.
  *WS §8.21-b L414.*
- **`skipTrailingSlashRedirect` is site-wide.** PostHog needs `/e/` with its slash, so `src/proxy.ts`
  performs the trailing-slash 308 for every other path, in one hop, keeping the query string (an
  untagged ad click is untagged forever). *WS §8.39-e L2933; `src/lib/trailing-slash.ts`.*
- **A route group is a metadata segment.** The `%s · Kheelona` title template applies to
  `app/(site)/page.tsx`, so page titles must not include the brand; it doubled on production for months.
  *WS §8.32-d L1791.*
- **Next merges metadata shallowly.** A page's `openGraph` replaces the layout's completely, so a helper
  that returns a metadata sub-object must return all of it. All 31 pages once lost `og:image` this way.
  *WS §8.32-i L1849.*
- **Read `window.location` in an effect, never during render**, or prerendered pages turn dynamic. Every
  host gate does this (`src/components/molecules/GoogleAnalyticsGate.tsx:41`). *WS §8.21-c-i L446.*
- **A per-request CSP nonce would make every page dynamic.** That is why `script-src` carries
  `'unsafe-inline'`; tightening it is a structural, founder-level change. *WS §8.28-a L1069-1075.*
- **`next dev` on `127.0.0.1` does not hydrate** (Next 16 blocks cross-origin dev requests). Test client
  behaviour on `http://localhost:<port>`. *WS §8.37-e L2482-2507.*
- **A running `next start` serves `public/` as it was at build time**, and the image-optimiser cache
  (`.next/cache/images`) survives rebuilds. Rebuild after adding assets; clear the cache after replacing
  one. *WS §8.16 L187; CP v4-merge-2026-07-31.md L57-58; CLAUDE.md L817.*
- **`NEXT_PUBLIC_` values are inlined at build time and cannot be Vercel secrets, and a Vercel
  variable applies only to deployments created after it changes.** Public ids stay hardcoded in
  `src/config/site.ts`; secrets stay server-only; redeploy after every env change. *WS §8.30-c L1355,
  §8.38-a L2549-2560; CP go-live-2026-07-28.md L66-67.*
- **Vercel sends its own HSTS header, and a browser obeys only the first**, so the site must end up with
  exactly one. *CP security-and-docs-2026-08-23.md L121-123.*
- **Vercel Web Analytics loads from an obfuscated per-project path**, not `/_vercel/insights/`. Check
  `window.va` or `window.vai`. *CP go-live-2026-07-28.md L59-62.*
- **Vercel reads `package.json` from the project's Root Directory**, which is why the app sits at the
  repo root. *WS §8.21-a L403.*
- **Deleting a branch does not retire its preview.** Vercel keeps serving the last deployment for an
  alias until the deployment or project is deleted in the dashboard. *CLAUDE.md L657-663.*
- **The free Supabase tier pauses after a quiet week.** `vercel.json` runs a daily cron on `/api/health`
  so a parent's first order is not the request that wakes it. *WS §8.25-k L846; vercel.json.*

## 2. Front end, CSS and performance

- **The hero's largest element must be the priority image.** An entrance animation on any hero element
  can make that element the LCP (3.8 s on phones once). A route with a text-only hero must ship its
  first section without a reveal. A plain colour block is not an LCP candidate. *WS §8.19 L228, §8.21
  L347, §8.31 L1323; docs/qa-report.md L674-677.*
- **Measure bytes, not attributes.** `currentSrc` is empty for an image that has not loaded, and Next
  sets `src` to the largest candidate, so reading attributes once suggested a 3,840 px image on a phone
  that was never requested. *docs/qa-report.md L1308-1321.*
- **`overflow-x: clip` on the body, never `hidden`**, and no mandatory horizontal scroll-snap on desktop
  rows (it traps the mouse wheel). *WS §8.2 L46-48.*
- **Never animate X on an element as wide as the page.** Mobile Chrome widens the layout viewport and
  every fixed element overhangs. Two no-shrink labels in one row do the same. Probe `scrollWidth` at
  320 and 390 px. *WS §8.20 L294-299, §8.22-g L532-535.*
- **Put base element CSS in `@layer base`**: unlayered CSS beats every Tailwind utility. Narrow grid and
  flex children need `max-w-full` and `min-w-0`. *WS §8.20 L300-308.*
- **An observer mounted in the layout must re-arm on `usePathname()`**, or client-navigated pages stay
  hidden. *WS §8.20 L287-289.*
- **Never wrap a whole-card link in a pointer-tracked transform** (tilt); it drops clicks. *WS §8.18 L218.*
- **`aria-hidden` on a wrapper with a focusable child is a serious axe violation.** *WS §8.23-5 L589-590.*
- **Inputs at 16 px or more** (the store uses 17 px): iOS Safari zooms the page when a smaller input
  takes focus. *WS §8.25-o L873-874.*
- **A `<video>` element at rest is a critical axe violation** (`video-caption` has no matcher), so mount
  it on play. An animated WebP goes in a plain `<img>`, not `next/image`, which re-encodes it to a still.
  *WS §8.37-a L2416-2432, §8.37-c L2463-2465.*
- **Media that fails must fold to the copy beside it.** A 404'd audio file can hang without firing
  `error`. Use `preload="none"`. *WS §8.22-f L522-530.*
- **Load heavy third-party SDKs with a dynamic import inside the host-gated effect.** posthog-js and
  rrweb (292K) are not in the root bundle, verified from the build manifest
  (`src/components/molecules/PostHogGate.tsx:50`). *CP posthog-2026-09-19.md L282-296.*
- **Judge a product image against its background by perceptual distance (ΔE), not the WCAG ratio**,
  which is a text metric. *WS §8.31-b L1293-1308.*
- **Template assets fail silently.** The site wore Vercel's favicon for weeks because the file returned
  200. `sips -g hasAlpha` is not proof of transparency; the iOS icon must be opaque. *docs/qa-report.md
  L1024-1058.*

- **Check sideways scroll against `clientWidth`, never `innerWidth`.** In Playwright's phone emulation
  (`isMobile: true`) a page that overflows widens the layout viewport, so `innerWidth` grows with the
  overflow and `scrollWidth > innerWidth` stays false. Mockup v2 had a 4 px overflow at 360 px (a long
  ghost link) that this hid; v3 briefly had 1,921 px. Also, an absolutely positioned child of a
  horizontal scroller escapes it unless an ancestor inside the scroller is positioned (the film tiles'
  hidden labels). *2026-10-11, mockup v3; `mockup/mockup.css` `.mk-film`.*

## 3. Routing and the store.kheelona.com host

- **One deployment serves two hosts.** `routeForHost` in `src/lib/store/host.ts` (a pure, unit-tested
  function) decides and `src/proxy.ts` applies it: on the store host, paths rewrite into `/store/...`;
  on the apex, `/store/*` 308s to the store host. *WS §8.25-a L718-727; security-review.md L59-71.*
- **The proxy matcher must be a literal that Next can analyse statically.** It excludes `_next/`, `api/`,
  `ingest/`, `ingest-assets/` and any path with a dot (`src/proxy.ts:203`). Because it cannot import
  constants, `routeForHost` also passes the PostHog paths, and a test runs the matcher's regex against
  real paths. Without both, PostHog dies on the store host only. *WS §8.39-b L2885-2899.*
- **Two chromes: marketing pages live in the `(site)` route group; the store has its own.** The root
  `not-found.tsx` sits outside the group, so the store needs its own catch-all
  (`src/app/store/[...rest]`) and `not-found.tsx`. *WS §8.25-z L896-903.*
- **A path compared with `usePathname()` must be the path the browser reports.**
  `store.kheelona.com/thanks` is rewritten from `/store/thanks`, so the browser sees `/thanks`. The
  replay deny list held only the file path, and session replay recorded the confirmation page for about
  15 minutes. Derive such paths from `routeForHost`. *WS §8.38-i L2676-2699; CP posthog-2026-09-19.md
  L358-415.*
- **The confirmation link's token is claimed into an HttpOnly cookie scoped to `/thanks`, then a 303
  (`private, no-store`) to a clean URL**, because pages with measurement tags report their own URL. A
  303 with `Set-Cookie` there is correct. *WS §8.28-b L1080-1096; docs/store-go-live.md L373-384.*
- **Attribution crosses hosts in first-party cookies set by the proxy**: `kh_utm` (first touch wins) and
  the raw `fbclid`. The CTA that crosses hosts carries no query string. *WS §8.40-f L3047-3059, §8.41-f
  L3237-3254.*
- **The index list and the measurement list differ on purpose.** `INDEXABLE_HOSTS` excludes the store
  (noindex) and includes loopback (so local Lighthouse SEO is not falsely 69); `GA4_HOSTS` includes the
  store and excludes loopback. A new production host goes in both. *WS §8.32-a L1751-1760.*
- **GA4 needs both hosts under "Configure your domains"**, or the hop to the store reads as a referral.
  The founder set this on 2026-08-23. *CP one-tap-and-cleanup-2026-08-23.md L134-137.*
- **Testing the store locally needs a store hostname**: `curl -H "Host: store.kheelona.com"` or
  `http://store.localhost:<port>`. If `curl https://store.kheelona.com` fails while `dig` resolves, the
  local resolver is stale; force it with `curl --resolve`. *CLAUDE.md L817-823; docs/store-go-live.md
  L15-23.*

## 4. Store and payment invariants

The checkout logic does not change (brief §4.4). The flow is in [site/checkout.md](../site/checkout.md).

- **The client never sends a price.** It sends a tier id and the server reads the amount; a request
  carrying `amountPaise: 100` is charged the real price. *WS §8.25-c-i L767-770.*
- **Money is whole paise from one source**, and the balance is derived. *WS §8.25-c L760-765.*
- **Write our order row before creating the gateway order, and put our reference in the gateway order's
  `receipt` and `notes`**, so an orphaned payment can still be matched. *WS §8.25-l L850, §8.25-ff L971.*
- **The webhook verifies the raw body** (`await request.text()`), claims the event id for idempotency,
  and on failure deletes the claim and answers 500 so Razorpay retries. *WS §8.25-m L856-862.*
- **`markPaid` is one atomic UPDATE guarded by an allow-list** (`.in("status", PAYABLE_STATUSES)`,
  `src/lib/store/fulfil.ts:84`) with the amount check inside it. Never a negation: `.neq("status","paid")`
  would have let a retry put a refunded order back in the dispatch queue. It never re-checks the
  500-unit cap. *WS §8.25-p L877, §8.28-c L1098, §8.30-s L1671-1681, §8.26-d L1006-1010.*
- **Paid is decided twice on purpose**: the browser confirm route for speed, the webhook for certainty,
  both through `markPaid`. The receipt, the server Purchase and `purchase_confirmed` hang off
  `notifyPaid`, reached only when `markPaid` wins, so each fires once; it must never throw. *WS §8.25-p
  L877-883, §8.30-l L1476-1481, §8.40-b L3007-3015.*
- **Only `refund.processed` for the full amount removes an order from the queue** (never
  `refund.created`). A partial refund is logged for a human. Always refund the whole token. *WS §8.25-ee
  L952-969; docs/store-go-live.md L83-86.*
- **The offer mode comes from a live count in `lib/store/mode.ts`, and the count never leaves it.** Both
  flip directions are refused at the price choke point with refresh-the-page words; a missing count
  reads as 0, the cheaper price. *WS §8.26-a to c L986-1004.*
- **Static pages cannot flip themselves at sell-out.** A manual copy sweep is triggered when
  `/api/health` reads `preorder:"full"`, and ViewContent's value goes stale the same day. *WS §8.26-g
  L1024-1030, §8.30-j L1424-1432.*
- **An address is authorised by its signed token alone**, and every failure returns the same message.
  *WS §8.25-n L864-868.*
- **One validation implementation runs in the browser and on the server**, length caps are named once,
  and customer text is HTML-escaped in emails. *WS §8.25-h, h-i L813-831.*
- **`sendEmail` never throws**, and email templates are code in the repo. *WS §8.25-i L833-837.*
- **Razorpay Checkout loads on the first submit, never on page load.** *WS §8.25-q L885-887.*
- **Secrets are read only in `src/lib/store/env.ts`**, never under a `NEXT_PUBLIC_` name, never in a
  `"use client"` file; missing keys render an honest "opening shortly" state. `META_CAPI_TOKEN` is a
  secret too. *WS §8.25-y L889-894, §8.30-l L1492-1499; test/store-secrets.test.ts.*
- **Fastest safe stop: remove `RAZORPAY_KEY_ID` in Vercel and redeploy.** The store stops taking money
  and marketing pages keep working. *WS §8.25-dd L949-950; docs/store-go-live.md L346-348.*
- **Migrations are applied by hand in the Supabase dashboard, before deploying code that writes a new
  column**, or every pre-order returns 500. The `qa:payment` stub validates no columns, so it cannot
  catch this. *WS §8.40-i L3104-3115.*
- **Row-level security is on with zero policies, on purpose**; only the service-role key reads the
  tables. *docs/store-go-live.md L167-168; security-review.md L165-166.*
- **Rate limits key on `x-real-ip`, then the platform header, then the rightmost hop**, never the first
  `x-forwarded-for` entry. The Vercel Firewall rule covers `/api/preorder/` POSTs and must never widen
  to `/api/` (webhook retries and the cron sit outside it). Route tests call `resetRateLimits()`.
  *WS §8.28-d L1110-1119, §8.25-j L843-844.*
- **Never place a real paid order to test.** `npm run qa:payment` drives the Razorpay sandbox, stops at
  the open payment sheet, and refuses a non-test key. *tools/qa/payment-probe.mjs L18-20, L54-58;
  brief §4.4.*
- **Two names mislead**: `webhook_events.order_ref` holds the Razorpay order id, and
  `send.send.kheelona.com` is a correct DNS name. *CLAUDE.md L624-626.*
- **Known open bug**: `maybeSingle()` returns null both for a missing row and a failed query, so
  `/thanks` cannot tell an outage from a deleted order. Logic stays unchanged until the founder
  approves a fix ([open questions](../open-questions.md) C10). *WS §8.34-b L2026-2029.*

## 5. Tracking: how to verify it, and how not to

What tracks, with which ids and events, is in
[site/tracking-inventory.md](../site/tracking-inventory.md). Brief §9.4 keeps all of it.

- **Prove parity on a local production build served under the real hostnames**, mapped to 127.0.0.1,
  with every measurement request aborted so nothing is delivered, plus a control run on a host in no
  list. Then check again on production. *MID cmo-merge-2026-10.md L297-299.*
- **Never let a probe reach a measurement host.** `tools/qa/lib/browser.mjs` aborts all third-party
  requests unless named in `allow`. If the payment sheet "looks broken" in the harness, check that
  first. *WS §8.28-g L1143-1149; tools/qa/lib/browser.mjs L44-76.*
- **The Meta pixel sends through `document.createElement('img')` with `src` set.** The resource
  timeline, the extension's network panel and hooks on `fetch`, `sendBeacon`, XHR and `new Image()` all
  show zero; only a hook on `HTMLImageElement.prototype.src` sees it. Restore hooks after the flush and
  prove the page did not reload. `fbq` de-duplicates a repeated PageView within one page load. The
  cheap check is `fbq.getState().pixels[0].eventCount`: 1 on a normal page, 2 on the product page.
  *WS §8.41-h L3285-3324.*
- **Meta drops headless Chrome as a bot.** Set a real desktop user agent, or no `facebook.com/tr`
  request appears. *WS §8.41-g L3260-3283.*
- **`curl` cannot see the pixel and `window.posthog` is undefined, both correctly**: the pixel mounts
  after hydration and PostHog is an ES-module install. *CLAUDE.md L36, L248.*
- **Events Manager lists only the pixels the selected ad account can use** (the `act=` URL
  parameter). Prefer its hourly CSV export to the dashboard, name the page as well as the setting, and
  allow up to 30 minutes of reporting lag. *WS §8.41-a L3161-3177, §8.41-i L3358-3393, §8.41-g
  L3281-3283.*
- **"Browser • Server" is not proof that our server sent an event.** Meta's business-level Conversions
  API mirrors browser events into every connected dataset; our server sends Purchase only. *WS §8.41-i
  L3326-3364.*
- **A CAPI token can be business-scoped and cannot read dataset metadata.** Test one by POSTing with a
  `test_event_code`. `META_CAPI_TEST_CODE` must never be set in production. *WS §8.41-c L3194-3206,
  §8.30-l L1498-1499.*
- **`capi: "configured"` on `/api/health` means a token is present, not that it works.** Every branch
  logs `[meta-capi] SENT|SKIPPED|REJECTED|UNCONFIRMED|FAILED`; a log that fires only on failure cannot
  answer "did it work". *WS §8.30-q L1613-1635.*
- **Events fired at mount must wait for `fbq`** (`whenFbqReady`), because the pixel loads after the host
  check. *WS §8.30-k L1443-1452.*
- **Browser and server Purchase share `purchaseEventId()`**; never change its shape while events are in
  flight, or one sale counts twice. *WS §8.30-l L1459-1465.*
- **Grep the source, not the bundle.** Two things in the same built chunk say nothing about what calls
  what. *WS §8.30-p L1594-1598.*
- **Revenue is counted on the server.** `purchase_confirmed` comes from `notifyPaid`, and its gap from
  the browser `purchase` is the client loss rate. In a serverless handler, posthog-node needs
  `await client.flush()` (`src/lib/store/posthog-server.ts:114`). *WS §8.40-b to d L3007-3032.*
- **A mock cannot tell you where a third party keeps its data.** The first campaign reader mocked
  PostHog's getter, passed its tests, and did nothing on production; dumping real browser storage found
  it. *WS §8.40-f L3061-3083.*
- **Behind the `/ingest` proxy, PostHog's `asset_host` and `ui_host` must be set** (the direct-install
  rules invert). The two prefixes must never overlap. `/ingest/array/<token>/config.js` reaching the
  ingestion host is fine, and `GET /ingest/e/` answering 400 is PostHog's correct reply. *WS §8.39-c, d,
  g, h L2901-2988.*
- **Session replay starts off at init and is switched on per allowed route.** `/thanks` is denied, and
  its container carries `ph-no-capture` (`src/app/store/thanks/page.tsx:118`), never per-field classes.
  A restyle must keep that class on the container. *WS §8.38-d, e L2599-2628.*
- **An empty list means nothing until the instrument has been shown to record.** Generate a session
  first, then trust the silence. *CP posthog-2026-09-19.md L518-537.*
- **A campaign key not in `CAMPAIGN_KEYS` (`src/lib/campaign.ts`) is dropped everywhere.** Check the
  repo names a parameter before adding it to an ad. *WS §8.40-j L3117-3151.*
- **Derive abandonment from the funnel**; `pagehide` is unreliable on mobile Safari. *WS §8.40-g
  L3085-3093.*
- **When a tool is added, removed, re-routed, or its payload changes, `/privacy` changes in the same
  commit**; `test/analytics-tags.test.ts` enforces the pairing. Never put a count of tools in copy a
  parent reads. *WS §8.21-c L475-479, §8.30-n L1514-1535, §8.39-a L2868-2883, §8.38-g L2643-2655.*
- **Read a new measurement asset's settings against the old one**; the defaults differ. *WS §8.41-e
  L3219-3235.*
- **Freeze the tracking layer and prove the freeze** with a diff test against a tag. The mid version
  froze 13 paths and 15 config constants this way. *MID website-steps.md §8.42-g L3450-3457.*

## 6. SEO infrastructure

URLs and redirects are in [site/url-map.md](../site/url-map.md).

- **All JSON-LD goes through `src/lib/seo.ts`** and is escaped at the boundary (`jsonLd()`). The site
  chrome emits the Organization and WebSite graph once; pages emit only their own nodes. *WS §8.21
  L360-362, §8.28-e L1121-1125, §8.32-e L1804-1811.*
- **Schema describes only what is visible on the same page, and content tests do not check validity.**
  Run a validator or Ahrefs Site Audit after every schema change; `contactOption: "WhatsApp"` was an
  error on every page. *WS §8.21 L363-365, §8.32-h L1836-1847.*
- **The Product `@id` stays as it is after a rename, and so do asset filenames**; `alternateName`
  carries the old name. *WS §8.32-b L1762-1773, §8.36-a L2281-2295.*
- **Every legacy redirect points straight at the final URL** (one hop), and any retired URL that
  something still cites gets a 301 or 308, audited in families. A 404 does not correct a stale index.
  *WS §8.32-b L1775-1777, §8.36-g L2358-2376.*
- **Sitemap `lastmod` only where a real, git-derived date exists.** `new Date()` told Google every page
  changed on every deploy. *WS §8.35-a L2191-2202; CP agency-audit-2026-09-05.md L72-74.*
- **FAQ and disclosure content must be in the HTML** (native `<details>`). To verify, strip `<script>`
  blocks before counting, or the JSON-LD answers for the page. *WS §8.24-6 L651-667.*
- **Open Graph must be complete on every page, and share cards are invisible to local gates.** Read Site
  Audit's social panel after metadata changes. Images carry claims too: `og.png` once showed a retired
  age band. *WS §8.32-i L1849-1862; docs/qa-report.md L1417-1423; CP v4-merge-2026-07-31.md L55-56.*
- **`src/lib/product-facts.ts` feeds both the visible spec table and `Product.additionalProperty`**;
  unannounced specs are absent, not guessed. *WS §8.36-b L2304-2312.*
- **A unit-bounded offer carries no `priceValidUntil`.** *WS §8.26-g L1028-1030.*
- **Machine files (`/llms.txt`, `/pricing.md`) restate visible copy only**, read prices from config, and
  carry a dated `*_UPDATED` constant. *WS §8.21 L375-377, §8.35-a L2199-2200.*
- **Cloudflare prepends its own block to robots.txt and blocks AI crawlers we allow.** Keep the apex,
  `www` and `store` DNS-only. Never pair `Disallow` with `noindex`. *WS §8.36-h L2378-2403.*
- **`site:` is not an indexing report; Search Console is.** *WS §8.36-f L2347-2356.*
- **Run Lighthouse on production.** Local runs miss the host-gated tags: best practices read 96 locally
  and 74 on production (the pixel's third-party cookie). A Lighthouse audit is pass or fail, so count
  audits that flip, not items fixed. On mobile, record devtools-throttled and simulated runs. *WS
  §8.34-g, h L2103-2170; docs/qa-report.md L674-677.*

## 7. Testing and the QA harness

- **The unit suite cannot see a framework regression.** `test/setup.ts` mocks `next/link`,
  `next/image`, `next/navigation`, `next/dynamic`, `motion/react` and the 3D stack (L56-157). Gate a
  framework or dependency change on before-and-after diffs of the build output and server responses
  (route manifest, head markup, CSS, proxy matrix by curl, `qa:payment`), captured before you start.
  *WS §8.33-d L1920-1939.*
- **Stage before testing, and reconcile the count.** Guard tests read the git index; `git stash pop`
  does not restore it. A test count that does not add up is a finding: five destroyed tests once hid
  behind a green run. *WS §8.37-i L2735-2755, §8.30-q-i L1645-1648; CP signup-analytics-2026-09-20.md
  L294-296.*
- **Prove every guard red before trusting it.** Plant the violation; prove a guard over an empty list on
  fixtures; strip comments; scope it to the claim (ban the idea, let patterns span sentences, match
  whole words); check props passed through composition, not just class strings. *WS §8.28-g L1137,
  §8.29-c L1194-1198, §8.30-d L1258, §8.30-s-i L1726-1730, §8.32-c L1779-1789, §8.35-f L2240-2246,
  §8.37-g L2521-2531; MID §8.42-h L3459.*
- **A test that restates the code's assumption proves nothing**, and one that models the framework
  wrongly reports green over its own bug. Derive expected values from the real routing or filesystem.
  *WS §8.38-i L2689-2695, §8.32-d L1800-1802, §8.34-c L2046-2047.*
- **Pin the claim, not the grammar.** *WS §8.38-g L2652-2655.*
- **Nothing type-checks story or test files.** `tsc` excludes both; `test/stories-parse.test.ts` exists
  for stories, and a syntax error in `*.test.ts` surfaces only as a Vitest transform error. When writing
  about comment syntax, use line comments. *WS §8.33-e L1941-1957, §8.35-f L2245-2247.*
- **Vitest traps.** A mock Proxy that returns a function for `then` hangs module resolution;
  `vi.stubGlobal` is not undone by `restoreAllMocks`; declare the `@/` alias in `vitest.config.ts` and
  in Storybook. *CP production-restructure-2026-07-12.md L37-45; WS §8.37-j L2801-2804; CP
  repo-root-move-2026-07-28.md L42-48.*
- **Colocated route tests are named `route.test.ts`.** Search by path, and never write to a path you
  have not confirmed is absent. *WS §8.30-q-i L1637-1653.*
- **The harness is `tools/qa/`.** `qa:sweep` runs axe (WCAG 2.0 and 2.1, A and AA) and a banned-phrase
  lint over 18 routes at 390 and 1280 px, 36 runs (`tools/qa/sweep.mjs` L24-56); `qa:text` prints
  rendered text and links; `qa:shot` and `qa:axe` drive one route; `qa:payment` uses the sandbox;
  `supabase-stub.mjs` feeds local store pages. Built in: never the browser extension, third parties
  aborted, reveals forced with a 1.5 s settle, hostnames mapped to 127.0.0.1 only for local targets (any
  explicit port counts as local). puppeteer-core and axe-core are borrowed, not dependencies. *WS
  §8.25-cc L919-940; tools/qa/lib/browser.mjs L1-89; tools/qa/lib/resolve.mjs L1-12.*
- **Harness screenshots are server-render evidence only**; they never wait for React. Drive a plain
  puppeteer session for clicks and state. *WS §8.37-f L2509-2519.*
- **axe needs care.** It skips `opacity: 0` (force reveals, then wait 1.5 s); a sweep must name every
  route; a component never rendered on a route is ungated. *WS §8.23-6 L592, §8.24-5 L644, §8.24-7a
  L681-684, §8.36-c L2314-2322.*
- **Accepted exceptions are classified narrowly and printed every run**, never switched off. *WS §8.29-d
  L1200-1211.*
- **Harness quirks.** `localhost` does not resolve under the harness's host mapping (use `127.0.0.1` or
  `store.localhost`); Lighthouse hits an HSTS interstitial on `kheelona.com`; the Ahrefs tag never
  resolves offline, so `networkidle0` hangs; lazy images need dwell and only visible ones should be
  awaited; cross-origin iframes do not paint below the viewport; full-page captures over about 16k px
  clip or tile, so capture viewport-sized chunks; interpolated JSX text is split by `<!-- -->` in server
  HTML. *WS §8.25-bb L911-917, §8.24-5 L637-649; MID CLAUDE.md L56-60; CP v6-content-2026-07-31.md
  L89-91.*
- **Check for a stale server before trusting a local render** (`lsof -iTCP:<port>`; kill by PID, not job
  number). Nothing was listening on 3456, 3460 or 54321 on 2026-10-10. *CP v4-merge-2026-07-31.md L63-64;
  CP white-cta-labels-2026-08-24.md L118-122; MID cmo-merge-2026-10.md L287-290; lsof 2026-10-10.*
- **Repeat a check before believing it, and test races on production and under throttling**
  (1.2 Mbps / 150 ms reproduced a production-only bug). `ResizeObserver` cannot see transforms or
  scroll-snap. *WS §8.37-k L2838-2858.*
- **Build a control before believing a perf, security or "it does not fire" result, and treat
  verification tools as code.** A probe once minted a 43-character HMAC where the app truncates to 16.
  *WS §8.23-7 L598-601, §8.28-g L1137-1141, §8.41-h L3319-3324; CP blank-404s-2026-09-06.md L252-255.*
- **A gate that prints is not a gate.** A merge once went out over a red suite because the command
  printed the summary instead of failing. *docs/qa-report.md L1202-1205.*
- **Look at real artefacts.** Three launch defects (a receipt greeting, a refunded order still queued,
  an unrecoverable orphan) passed every test and were found by reading the sent email and the data.
  *CLAUDE.md L600-604; CP preorder-store-2026-08-22.md L15-20.*

## 8. Git, dependencies and repo hygiene

- **The GitHub repo is public. Never `git add -A` or `git add -- .`.** Stage by name and account for
  every `??` line. On 2026-09-06 an untracked folder holding investor material was pushed this way; the
  recovery needed a history rewrite and a force-push, which brief §4.6 now forbids, so prevention is the
  only control left. *CLAUDE.md L420-430; CP blank-404s-2026-09-06.md L6-13; CP
  signup-analytics-2026-09-20.md L297-299.*
- **Anything committed stays in public history**, including footage of real children. *WS §8.37-h
  L2533-2539.*
- **Use `--save-exact` on every install** (`save-prefix` is `^` and there is no `.npmrc`), and never run
  a bare `npm install`: it would have moved 23 packages, the Supabase client among them. Name every
  package and read the lockfile diff. *WS §8.33-b L1890-1902.*
- **Dependency floors check every copy in `package-lock.json`**, per major line, and can assert absence;
  exemptions are path-exact and carry a reason. *WS §8.33-a L1871-1888, §8.38-h L2657-2674, §8.28-f
  L1127-1133.*
- **No `overrides` that fight a parent package's own pin**; prefer the upgrade upstream tested. *WS
  §8.33-c L1904-1918.*
- **`npm update --package-lock-only` is a silent no-op** (npm 11.6.2), and `launch-video/` is a separate
  manifest. *WS §8.33-f L1959-1972.*
- **Create the rollback tag before the merge, on the live commit.** A tag once landed on the very merge
  it was meant to escape. *docs/store-go-live.md L271-281; docs/qa-report.md L1206-1208.*
- **A commit message is a claim.** Grep the prose after a find-and-replace. *WS §8.30-s-i L1703-1709.*
- **Node 24** (`.nvmrc`); a README once said 18. *CP security-and-docs-2026-08-23.md L99-100.*
- **The old token gate runs first in every build.** See trap 1 at the top of this page. *package.json:7;
  tools/tokens/check-tokens.mjs:22-29.*
- **The Vercel dashboard and every environment variable have been the founder's** (never the Vercel
  CLI), and `main` auto-deploys on push. Decided: brief §2's "You deploy" means merging to `main` after
  the founder's explicit OK at Gate B ([open questions](../open-questions.md) section E).
  *CLAUDE.md L389, L674-676.*

## Not verified for this page

- No tests, builds, servers or harness runs; code facts were checked by reading files and grepping.
- Vercel-side behaviour (4xx rewrites, the duplicate HSTS header, the Web Analytics path) is taken from
  the checkpoints, not re-checked on production today.
- `docs/qa-report.md` (1,681 lines) was skimmed by heading; only its lesson sections were read.
