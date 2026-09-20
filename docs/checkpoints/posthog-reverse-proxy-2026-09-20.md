# PostHog: the reverse proxy (2026-09-20)

**Status: BUILT AND LOCALLY VERIFIED. NOT YET DEPLOYED.**
Rollback tag **`pre-posthog-proxy-2026-09-20` = `e097ad8`**.
Baseline before the round: **1267 tests / 119 files**, `tsc` 0. After: **1295 / 122**, `tsc` 0.
Laws: **§8.39 a-g**. Round record for the original install: `posthog-2026-09-19.md`.

---

## Why this round exists

The founder opened PostHog's Web analytics and found Installation Health red: **6 of 7 checks
passed**, the failure being *"Reverse proxy … helps prevent ad blockers from blocking tracking. Some
metrics may not be accurate until this is configured."*

It is a **recommendation, not an error**. Event tracking read 4/4 and data was arriving correctly.
PostHog paints optional setup in the same red as a broken install, which is what made it look urgent.

## The decision, and why it was the founder's

The panel's own sentence is the whole issue: a reverse proxy exists to **stop an ad blocker working**.
`/privacy` told parents, in these words, that one did:

> "If you would rather not be counted, your browser can block the tools that only run in your
> browser… Private browsing, an ad blocker, or turning off third party cookies all work…"

PostHog is the tool that **records a parent's screen**. So the question was never technical, and it
was put to the founder with a recommendation *against* proxying. **The founder chose to proxy
everything and to state the consequence plainly on `/privacy`** (2026-09-20). Recorded here as a
decision taken with the cost in view, not an oversight.

The repo had already written the trigger down before the round started, in
`test/analytics-tags.test.ts`: *"If that ever changes — an ad integration, a reverse proxy sharing
identity, a cross-domain cookie — these two sentences become false and must be rewritten."* Reading
that note is what turned an obligation into a plan instead of a later surprise.

## What shipped

| File | Change |
|---|---|
| `src/config/site.ts` | `POSTHOG_PROXY_PATH`, `POSTHOG_ASSET_PROXY_PATH`, `POSTHOG_UI_HOST`, `isPostHogProxyPath()` |
| `next.config.ts` | `skipTrailingSlashRedirect: true`; `rewrites()` with two `beforeFiles` rules |
| `src/proxy.ts` | matcher excludes both prefixes; performs the trailing-slash redirect Next no longer does |
| `src/lib/trailing-slash.ts` | **new** — the redirect rule as a pure, tested function |
| `src/lib/store/host.ts` | `/ingest*` passes before any host rule |
| `PostHogGate.tsx` | `api_host` → proxy path, `asset_host` set, `ui_host` set |
| `src/app/(site)/privacy/page.tsx` | two paragraphs rewritten |
| `src/lib/security-headers.ts` | **deliberately untouched** |

## The three things that would have broken it

### 1. PostHog would have died silently on the store host

Next runs **proxy at step 3 and `beforeFiles` rewrites at step 4**, so `src/proxy.ts` sees
`/ingest/e/` first — and on the store host `routeForHost` maps every path into `/store/...`.
Unguarded, `/ingest/e/` became `/store/ingest/e/`: **analytics dead on the one host the pre-order
funnel runs on, with the marketing host looking perfectly healthy.** Caught by reading the routing
order in the installed docs before writing the rewrite, not by deploying.

### 2. Two overlapping rewrite rules would have put the recorder at risk

PostHog's guide nests assets under the ingestion prefix, which needs overlapping sources; the Next
docs say `beforeFiles` rules keep being evaluated after a match. If the ingestion rule won a
`/static/` path the recorder would 404 and **session replay would silently never start** — §8.38-b
again. Two non-overlapping prefixes remove the question rather than answering it.

Note `"/ingest-assets".startsWith("/ingest")` is **true**, which caught this round's own test on its
first run. `isPostHogProxyPath` matches exactly or on a `/` boundary.

### 3. Two §8.38 laws inverted, and assuming they held would have been silent in both directions

Read out of the installed SDK: `region` is a regex test on `api_host`, and a path makes it `"custom"`.

- **§8.38-b:** the asset origin stops being derived, so `asset_host` must be **configured**. Miss it,
  replay silently never starts.
- **§8.38-c:** `ui_host` must now be **set**, having been correctly unset before. The SDK derives it
  as `apiHost.replace(".i.posthog.com", ".posthog.com")`, which does nothing to `"/ingest"` — so
  every dashboard deep link, **including recording links**, would land nowhere.

## The trailing-slash half

PostHog ingests on `/e/`, `/s/`, `/i/` **with** the slash. `skipTrailingSlashRedirect` is the flag
that preserves them and it is **site-wide**, so it was paired with a redirect in `src/proxy.ts` for
every other path. A visitor and a crawler cannot tell the flag was flipped: `/team/` still 308s to
`/team`, **query strings and UTM parameters included** — ads are running and an untagged click is
untagged forever.

## Verification

**Local, with a control for every claim** (`next start` on :3456):

| Check | Direct to PostHog | Through `/ingest` |
|---|---|---|
| `GET /e/` | 400 | 400 |
| `POST /e/` with an event body | 200 | **200** |
| `recorder.js` | 131,370 bytes | **byte-identical** |

**The 400 was the finding.** On its own it reads as a broken proxy; beside its control it is PostHog
refusing a GET, relayed faithfully. A proxy standing in for a measurement is how this repo got three
things wrong in one day on 2026-09-12.

Regression probe: 11 marketing routes 200, both 404 shapes still render, three legacy redirects still
fire, store host serves at 200 including its dead ends, the apex still pushes `/store/thanks` to the
store host, and all four machine files 200. `qa:sweep` **clean, axe and voice, every route, both
widths** (90 accepted white-on-orange, §8.29). `npm test` 1295/122. `tsc` 0. `next build` passes.

**One synthetic event was written to the founder's project** while proving the POST path:
`$proxy_smoke_test`, `distinct_id: kheelona-proxy-check`. Filterable, and disclosed rather than left
to be discovered.

## STILL THE FOUNDER'S — two production checks after deploy

1. **Geography.** PostHog reads the visitor's country from the request IP, now via `x-forwarded-for`
   rather than directly. If that does not survive Vercel's edge, every visitor collapses to one
   location and **the Web analytics dashboard quietly becomes wrong** — a fix for "some metrics may
   not be accurate" making them less accurate. This is the one risk local testing cannot reach.
2. **Replay, with its control.** The recorder must load on `store.kheelona.com/` and **not** on
   `/thanks`. A change that killed replay everywhere would pass the negative check alone (§8.38).

Installation Health should then read **7 of 7**; PostHog detects the proxy from events arriving with
a custom `api_host`.

## Not done, on purpose

- **The CSP was not touched.** Both directives already carried `'self'`, so the policy string is
  unchanged and **the §8.28-a enforce clock does not reset for a third time.** Prune the two PostHog
  origins only once production shows nothing requests them directly.
- **No in-product opt-out was built.** It was offered and the founder chose plain disclosure. The
  page still points at deletion on request, which covers PostHog.
- **Vercel bandwidth was not measured.** All replay payloads now flow through Vercel. Worth a look at
  the founder's usage after a week of real traffic; session replay at 100% sampling is the heaviest
  thing PostHog sends.
