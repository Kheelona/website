---
name: project-meta-pixel-2026-09
description: The Meta Pixel — migrated to 1051265191046395 on 2026-09-20 and fully re-verified, the settled decisions not to re-ask, and the verification traps that make a working pixel read as dead
metadata:
  type: project
---

**The Meta Pixel is `1051265191046395` since 2026-09-20** (migrated from `1045085251085243`, retired).
Laws **§8.41 a-i**; checkpoint `docs/checkpoints/meta-pixel-migration-2026-09-20.md`; rollback tags
`pre-meta-clickid-2026-09-20` = `b1078de`, `pre-meta-pixel-migration-2026-09-20` = `06a93b8`.
See [[project-posthog-2026-09]] for the other measurement work of the same week.

## Settled, do NOT re-ask

- **Which pixel.** The portfolio had two: the old one held every event and both integrations but was
  **not assigned to the ad account**; the new one was assigned and had never received an event.
  **The founder chose the ad account's pixel for OWNERSHIP** — ads and measurement on one account,
  one thing everywhere — and accepted losing the history explicitly. I recommended the opposite
  twice. **Decided.**
- **The old pixel cannot be deleted** (Meta offers none for a pixel with history). Every connection
  was removed instead, which achieves the same outcome.
- The **Traffic** campaign objective, and **AAM on with all fields** (§8.30-o), were both raised and
  left alone by the founder.

## 🔴 The traps, which is why this memory exists

- **Events Manager shows different pixels from different screens, and that is not a bug.** It lists
  only the pixels the *selected ad account* can use — the URL's `act=` parameter is the whole
  explanation. **Find the scope selector before concluding anything is broken.**
- **A CAPI token can be BUSINESS-scoped.** Both tokens tested posted to *both* pixels, so the Vercel
  secret needed no change at cutover and an elaborate coordination plan was deleted. A CAPI token
  also **cannot read dataset metadata** (`(#100) Missing Permission`) — the only way to learn what one
  authorises is to POST a test event with a `test_event_code`.
- **A fresh pixel's defaults are NOT the old pixel's settings, and the one that mattered had a name
  one word from the one I checked.** "Track events automatically without code" was already off, while
  **"Automatic events" was ON** (Meta's AI adding standard events beside ours: no shared `event_id`,
  and a value it infers rather than the amount collected). So was the page/product detail AI. Both
  turned off; the allow list restored. **Read a new asset's settings against the old one.**
- **`curl` cannot see the pixel and that is CORRECT** — it is host-gated and mounts after hydration,
  so it never reaches the server HTML. Same shape as `window.posthog` being undefined. Use a browser.
- **A "currently receiving events" banner is a 28-day window, not live status.** The event list
  underneath is the truth.
- **`capi: "configured"` means a token is PRESENT, not that it WORKS.** After the founder rotated it,
  validity is unproven until a real order: success is Purchase with connection method **"Multiple"**,
  failure is **"Browser"** only plus `[meta-capi] REJECTED` in the Vercel log.

## The defect the migration exposed

**Nothing in the suite failed when the pixel id changed** — only a shape regex existed, so the id
could drift from all five documents describing it while the build stayed green.
`test/meta-pixel-id.test.ts` now requires `CLAUDE.md` and §8.30 to name the live id and fails on a
stale one beside it unmarked. **`docs/checkpoints/` is exempt: a checkpoint records what was true on
its own date.**

## Also shipped that day: the ad click id (§8.41-f)

`src/proxy.ts` remembers the raw `fbclid` at landing; `readFbAttrib` builds an `fbc` **only when
Meta's `_fbc` is absent**, so a blocked pixel no longer loses the click. **The cookie holds the RAW id,
never a built value** — one builder exists, so there is no competing value to prefer by mistake. **A
missing `fbc` is strictly safer than a malformed one**: Meta accepts a broken one with a 200 and
matches nobody. A hypothesis was disproved first — `_fbc` is scoped to `.kheelona.com` and DOES reach
the store host, so this is resilience, not a routing fix.


## Verified end to end on 2026-09-20 night, and the two laws that came out of it

**It is correctly installed.** One pixel initialises on the apex and on `store.kheelona.com`,
`ViewContent` fires on `/products/kheelu`, the allow list / first-party cookies / automatic advanced
matching are on, all three "automatic" toggles are off, and **Meta's Diagnostics reads "No errors at
this time."**

**🔴 §8.41-h — THE PIXEL SENDS THROUGH AN `<img>` BEACON, so almost every instrument reads zero while
it works.** `performance.getEntriesByType('resource')`, the browser extension's network panel, and
hooks on `fetch`, `sendBeacon`, XHR and `new Image()` ALL captured nothing. Only a hook on
**`HTMLImageElement.prototype.src`** caught the real request. Three companions, each of which produced
a wrong answer first: **`fbq` de-duplicates a repeated `PageView` within one page load**, so
re-firing one is a no-op that proves nothing (a URL change via `pushState` does fire a fresh one); a
hook probe **must prove the page did not reload**, because a full load wipes the hooks and reads
exactly like a dead pixel; and **`fbq.getState().pixels[0].eventCount` is the cheap honest check** — 1
on an ordinary page, 2 on `/products/kheelu`.

**🔴 §8.41-i — META MIRRORS BROWSER EVENTS INTO THE SERVER CHANNEL, to EVERY dataset connected to the
business-level Conversions API.** An hourly CSV export showed `server_received_count` tracking
`browser_received_count` almost 1:1 for `PageView`, while this application sends **only `Purchase`**
server-side. **That is what kept the RETIRED pixel receiving** after its own integrations were removed
and its id was gone from every bundle. Closed by excluding dataset `1045085251085243` in
**Business Manager → Your Conversions API connections → Manage Datasets**. Two consequences worth
carrying: **"Browser • Server" on an event row is not proof that YOUR server sent it**, and a retired
pixel is not retired until it leaves that business connection. **"Automatically connect only your
datasets" is ON**, so a new pixel in this portfolio starts mirroring the moment it exists — and that
name collides with "Automatically include more detailed page and product info" on the pixel's own
Settings page (correctly Off), so **always cite the PAGE when naming a Meta setting**.

**THE METHOD LESSON, and it is the third costume of the same law (§8.34-f, §8.38-i, §8.41-g): an
absence measured by the wrong instrument is not an absence. Build the control first.** In this round a
chunk grep read as "the old pixel id is gone from production" until the control showed it had not
found the **new** id either, so it had proven nothing. The same discipline made a wrong explanation
cheap to drop: the retired pixel's traffic was first attributed to my own verification runs, on
timestamp correlation, **labelled as an inference rather than a finding** — and the CSV replaced it
without argument. **Correlation between two things you did yourself is the easiest false explanation
to believe, because you were there for both.**

**Still open and founder-owned:** the rotated CAPI token has never carried a real order, so
`capi: "configured"` still means PRESENT not WORKING — Purchase showing **"Multiple"** settles it.
And check that the old pixel's "last received" keeps ageing; the same-session check was inconclusive
because the instrument had not moved for the control either.
