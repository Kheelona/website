# Meta: pixel migration and the ad click id (2026-09-20)

**Status: CODE READY, NOT YET PUSHED — gated on the founder's Meta settings.**
Laws **§8.41 a-f**. Rollback tags `pre-meta-clickid-2026-09-20` = `b1078de` and
`pre-meta-pixel-migration-2026-09-20` = `06a93b8`.

---

## Why this round exists

The founder asked to "do pixel setup and connect it with Meta". **The pixel was already set up and
connected** — dataset `1045085251085243`, 1.6K events, Pixel + Conversions API, domain verified. So
the round became something else entirely.

Then Events Manager showed a *different* pixel depending on which screen it was opened from, and
nobody could say which was real.

| | Kheelona Dataset | Kheelona Website pixel |
|---|---|---|
| ID | `1045085251085243` | **`1051265191046395`** |
| Events | 1.6K / 28 days | 0, never received one |
| Integrations | Pixel + Conversions API | none |
| Assigned to ad account `1195520716116929` | **no** | **yes** |

**Events Manager lists only the pixels the selected ad account can use** (§8.41-a). The URL's `act=`
parameter was the entire explanation. Confirmed from both sides: the empty pixel's Sharing panel named
the ad account, the live one's listed none.

## The decision, and that it was the founder's

I recommended the opposite — keep the configured pixel, assign it to the ad account, change no code —
and put it **twice**. The founder chose to migrate the site to the ad account's pixel so ads and
measurement live on one account permanently, and accepted losing the event history explicitly.

When the data argument was withdrawn ("I am completely okay to lose old data"), **the recommendation
did not change but its reason did, and the weaker reason was dropped rather than repeated**: keeping
the old pixel meant reconfiguring nothing; switching means rebuilding the Conversions API, the allow
list, advanced matching and first-party cookies. Recorded so it is not re-litigated (§8.41-b).

---

## What shipped

### Commit 1 (`06a93b8`) — the ad click id

`fbc` reaches Meta only if its pixel set `_fbc`, so a blocked pixel loses the click id. `src/proxy.ts`
now remembers the raw `fbclid` at landing; `readFbAttrib` builds an `fbc` **only when Meta's cookie is
absent**.

**A hypothesis was disproved first and it saved a wasted fix.** `_fbc` was suspected of being a
cross-host casualty like §8.40-f. Measured in a real browser on production: scoped to `.kheelona.com`,
and it **does** reach the store host. Low coverage was mostly low paid volume.

Five mutations caught: the subdomain index, building a best effort instead of refusing, the component
order, accepting a malformed id from the cookie, and inverting the precedence.

### Commit 2 — the migration

One line of code. `META_PIXEL_ID` → `1051265191046395`; the CAPI endpoint interpolates the same
constant, so **browser and server move together and cannot split**. Five documentation references,
with the checkpoint annotated rather than rewritten.

Plus **`test/meta-pixel-id.test.ts`**, which exists because of a real defect this exposed:
**nothing in the suite failed when the pixel id changed** (§8.41-d). The only assertion was a shape
regex, so the id could drift from every document while the build stayed green.

---

## The two findings worth more than the change itself

### 1. The CAPI token is BUSINESS-scoped, which deleted the hardest part of the plan

The plan assumed per-dataset tokens and built an ordering around swapping the Vercel secret at the
exact moment of deploy, with a broken window either side. **Verified instead of assumed: both supplied
tokens posted successfully to BOTH pixels** (`events_received: 1`, via `test_event_code=TEST81201`, so
nothing touched live data).

So the production token needed no change, there was **no cutover window at all**, and the entire
coordination problem evaporated. Also learned: a CAPI token **cannot read dataset metadata**
(`(#100) Missing Permission`), so the only way to discover what one authorises is to POST a test event.

### 2. A fresh pixel's defaults are not the old pixel's settings

Two were on that the old one never had, and **the one that mattered had a name one word away from the
one I had told the founder to check**:

- **"Automatic events" — ON.** Not the same as "Track events automatically without code", which was
  already off. It lets Meta's AI add and manage standard events, which would place AI-invented
  Purchases beside our explicit ones: no shared `event_id`, so no deduplication, and an inferred value
  rather than the amount actually collected (§8.30-f). **Founder turned it off.**
- **"Automatically include more detailed page and product info" — ON.** AI sending Meta extra page
  data including reviews and pricing. **Founder turned it off**, matching what `/privacy` describes.

Also restored: the **allow list** (`kheelona.com` and subdomains), which the old pixel had and a fresh
pixel does not.

---

## Founder actions

| | Status |
|---|---|
| Conversions API connected on the new pixel | ✅ done |
| First-party cookies ON, advanced matching ON with all fields | ✅ already correct |
| "Track events automatically without code" OFF | ✅ already correct |
| **"Automatic events" OFF** | 🔴 requested |
| **"Automatically include more detailed page and product info" OFF** | 🔴 requested |
| **Allow list: `kheelona.com` and subdomains** | 🔴 requested |
| Delete `1045085251085243` | after production verification |
| Regenerate the CAPI token + **Redeploy** | independent of this migration; both supplied tokens are in a chat transcript and are business-scoped |

## Verification

**Gates:** 1361 → **1397 tests / 126 files**, `tsc` 0, build passes, `qa:sweep` clean 36/36 with the
accepted contrast count unchanged at 90, `qa:payment` clean 10/10.

**Meta's own verdict on our built `fbc`**, before any push: a Purchase carrying
`fb.1.<ts>.IwAR0kheelonaFbcCheck` returned `events_received: 1` with an **empty `messages` array** —
a malformed value normally draws a warning there.

**Production, after the push:** the tag reads `fbq('init', '1051265191046395')`; the new pixel receives
PageView; a Purchase shows integration **"Multiple"** (the single best proof that pixel id, token and
allow list are all correct together); and **the control — the old pixel stops receiving**, without
which we would not know traffic had moved rather than doubled.

---

## 🟢 DEPLOYED AND VERIFIED ON PRODUCTION, 2026-09-20

Commits `06a93b8` (click id) then `c2dc4dd` (migration).

**The tag moved, proven in a real browser.** `curl` shows nothing and **that is correct** — the pixel
is host-gated and mounted client-side after hydration, so it never appears in the server HTML. The
same shape as the `window.posthog` lesson: the absence reads as failure while everything works.
Headless Chrome on production:

| Host | `fbq('init', …)` |
|---|---|
| `kheelona.com` | **1051265191046395** |
| `store.kheelona.com` | **1051265191046395** |

The old id appears nowhere in the served page or the built bundle.

**Meta is receiving.** The new pixel went from "never received events" to:

| Event | Status | Connection | Count |
|---|---|---|---|
| PageView | Active | **Browser • Server** | 4 |
| Purchase | Active | Server | 3 |

"Browser • Server" on PageView is the meaningful line: the browser tag is reaching the new pixel.

**Founder's Meta settings, verified read-only after they were made** (the three the founder authorised
me to click, and nothing else): "Automatic events" **Off**, "Automatically include more detailed page
and product info" **Off**, allow list **`kheelona.com and subdomains`**. Unchanged and already correct:
first-party cookies On, automatic advanced matching On with all parameters, "Track events
automatically without code" Off, Conversions API connected.

### 🔴 Synthetic data written while verifying, disclosed rather than left to be found

**CORRECTED 2026-09-20: the PageViews are NOT mine.** Headless Chrome is filtered as a bot by Meta's
script and never reaches them (§8.41-g), so the verification runs contributed nothing. The PageView
count is real human traffic and must not be discounted as test noise.

**The 3 Purchase events above are mine**, not real orders. They were sent to prove the token
authorises this pixel and that our built `fbc` is accepted — each with `test_event_code=TEST81201`, so
they are test-stream events and do not feed ad optimisation, but they do appear in the overview count.
The 4 PageViews are from the headless browser checks. **No real order has been placed since the
cutover.** Ignore both when reading the first day's numbers.

### One recommendation changed, and it is expected

Events Manager now says "low coverage of **fbp**" where it previously said **fbc**. That is an artefact
of the only server events on this pixel being my test payloads, which carried no `fbp`. It should
resolve on the first real order, whose `fb_attrib` carries `_fbp` from `create-order`. **Do not act on
it yet** — re-read it after real traffic.

## Still the founder's

1. **Delete `1045085251085243`.** The new pixel is proven receiving, so the gate on this is passed.
2. **Regenerate the CAPI token and press Redeploy.** Both tokens used this round are in a chat
   transcript and are **business-scoped**, so deleting the old pixel does not neutralise them. A Vercel
   variable only applies to deployments created after it changes, so the Redeploy is not optional.

---

## Post-cutover verification, after the founder's token rotation and redeploy

**Founder completed both outstanding actions.** `META_CAPI_TOKEN` updated in Vercel and a redeploy
run (`Redeploy of BcuHVxLTj`, Ready). The old pixel could not be deleted — Meta offers no delete for a
pixel with history — so **all its connections were disconnected instead**, which achieves the same
outcome: nothing can send to it and no ad account can select it.

| Check | Result |
|---|---|
| `fbq('init', …)` on both hosts | **1051265191046395** |
| `/api/health` | `capi: "configured"` after the redeploy |
| New pixel | PageView **Browser • Server**, Purchase Server |
| Old pixel, last PageView | **5 hours ago — before the migration deployed 4 hours ago** |

**The old dataset's "currently receiving event data" banner is a 28-day window, not live status.**
Its event list tells the real story: last PageView 5 hours ago, i.e. before cutover. It has gone quiet.
Worth recording because the banner reads like a contradiction and is not one.

### 🔴 The one thing still unproven, stated plainly

**`capi: "configured"` proves a token is PRESENT, not that it WORKS.** The token I validated against
both pixels has been replaced by one I have never seen, which was the entire point of rotating it. Its
validity is therefore unverified and **cannot be verified without a real order**.

**What success looks like:** the first real pre-order produces a Purchase on the new pixel with
connection method **"Multiple"** (browser plus server, deduplicated on `event_id`).

**What failure looks like:** Purchase shows **"Browser"** only, and the Vercel runtime log carries
`[meta-capi] REJECTED` with Meta's reason. The fix would be one more token, and no code change.

**Not actionable yet:** Events Manager now recommends improving `fbp` coverage. That is an artefact of
the only server events on this pixel being test payloads with no `fbp`; a real order carries it from
`readFbAttrib`. Re-read after real traffic rather than acting on it.

---

## A display panel that reads like a fault and is not (and a hypothesis I got wrong)

The new pixel's overview shows **"0 Websites — No websites found"** while the old one showed
`kheelona.com +1 more`. **I guessed it was the date filter** — the screen defaulted to
Aug 23 – Sep 19 while every event on this pixel is from Sep 20. **Tested it by switching the range to
Today, and the panel still read "No websites found". The hypothesis was wrong.**

The remaining explanation is that Meta derives that panel from a periodic aggregation which has not
run for a pixel a few hours old, whereas the old one had weeks of history. **That is an inference,
not something proven**, and it is written down as an inference deliberately.

**What IS established is that nothing is being dropped:**

- PageView **16 and climbing**, last received minutes ago, connection **Browser • Server**.
- The allow list is `kheelona.com and subdomains`, and Meta **blocks** events from domains not on it.
  Events are being accepted, so the domain is being recognised on them.

**"No connected catalogs" is unrelated and normal.** A catalog is Meta's product feed for dynamic
catalog ads; the store sells one product on Traffic campaigns, so there is nothing to feed. **The old
pixel said exactly the same thing** — it appears in its overview beside the populated Websites line,
which is what proves the two are independent.

**Re-check the Websites panel after a day of real traffic.** If it is still empty then, it is worth a
proper look; today it is simply too new to conclude from.

---

## Full installation check, 2026-09-20 ~23:20 IST (founder asked: "is the pixel properly installed?")

Checked in the founder's own Chrome (real user agent, §8.41-g) and read-only in Events Manager.
**Verdict: correctly installed on both hosts, correctly configured on Meta's side, no errors.**

### The site half — all green

| Check | Result |
|---|---|
| Pixels initialised, apex | exactly one: `1051265191046395` |
| Pixels initialised, `store.kheelona.com` | exactly one: `1051265191046395` |
| `fbevents.js` + `signals/config/<id>` | both load on both hosts |
| `_fbp` / `_fbc` cookies | both set (`_fbc` written after arriving with an `fbclid`) |
| fbq queue | drained to 0 |
| Wire capture, store host | `www.facebook.com/tr/` · `ev=PageView` · `dl=store.kheelona.com` · 77 params |
| `cd[...]` automatic params | **absent** — independent confirmation that "Automatic events" is off |
| `ViewContent` on `/products/kheelu` | fires — `eventCount` is **2** on a clean load |
| Old pixel id in production JS chunks | **zero** (control: the new id was found in one chunk) |

The wire capture was taken with the send **blocked**, so the check added nothing to live data.

### Meta's half — all green

- **Diagnostics: "No errors at this time."**
- Shared with ad account **Kheelona Meta `1195520716116929`** — the reason the migration happened.
- Automatic events **Off**; "Automatically include more detailed page and product info" **Off**;
  "Track events automatically without code" **Off**.
- First-party cookies **On**. Automatic advanced matching **On**, all seven fields.
- Traffic permissions allow list: **`kheelona.com` and subdomains**, added Sep 20.
- Conversions API: **Business connected, Active**.

### Two things recorded rather than resolved

1. **The retired pixel `1045085251085243` shows `PageView … last received 1 hour ago`.** It is NOT our
   code: production JS ships only the new id (proven with a control), and kheelona.ai — the obvious
   suspect — carries **no pixel at all**. The timestamps match my own verification rounds almost
   exactly (Purchase "5 hours ago" ≈ the 18:18 migration validation; PageView "1 hour ago" ≈ the 22:22
   token-rotation verification), so the likely source is my own test traffic. **That is an inference
   from timestamp correlation, not a finding** — Meta does not expose a per-event source here.
   The actionable part is real: the business-level CAPI integration still lists **two** datasets
   connected, the new pixel and the old one, which is how anything can still reach the old dataset at
   all. Removing the old dataset from that integration is the last thread if "one thing everywhere"
   is to be literally true.
2. **The date filter could not be changed.** It reads `Aug 23 – Sep 19` and does not respond to
   clicks, so the table's totals (PageView 16, Purchase 3) are for that labelled window. The activity
   chart nonetheless plots **today**, Sunday, climbing 3 → 12 between 5 PM and 9 PM. The founder asked
   for today's range in the previous session and it is still not applied; this is a Meta UI problem,
   not a data problem. **"0 Websites / No websites found" also persists** — the old dataset lists
   "kheelona.com +1 more" after weeks of history while this pixel is hours old, so "not enough history
   yet" is the remaining explanation. **Stated as an inference**: the date-range hypothesis for this
   same panel was tested and disproved earlier today.

### Still unproven, unchanged, and not a defect

**The rotated CAPI token has still never carried a real order.** `capi: "configured"` means present,
not working. Success on the first real pre-order = Purchase with connection method **"Multiple"**;
failure = **"Browser"** only plus `[meta-capi] REJECTED` in the Vercel log, fixed by one more token
and no code change.

### 🔴 CORRECTION, same evening: the retired pixel's traffic is Meta mirroring, not my testing

The founder set the date range to **Sep 18 – Sep 20** (PageView total moved 16 → **26**, so today's
events do count) and exported the hourly CSV. It shows `server_received_count` tracking
`browser_received_count` nearly 1:1 for `PageView` — 2/2 at 18:30, 6/6 at 21:30, 9/7 at 22:30 IST.

**This application sends exactly one server-side event name, `Purchase`.** So those server PageViews
are not ours. They come from Meta's own **"Conversions API • Web-only · Business connected · Active"**
connection, opted in on Sep 20 from Events Manager, which lists **Datasets connected (2): the new
pixel and the retired `1045085251085243`.** Its "last received" read 1 minute ago while pages were
being loaded and 16 minutes ago after that stopped.

**This replaces the explanation written a few hours earlier in this same file** (that the old pixel's
recent events were my verification traffic). That was timestamp correlation, was labelled an
inference, and is now superseded. Law **§8.41-i**.

**Founder action, and it is the last one for "one thing everywhere":** remove
`Kheelona Dataset 1045085251085243` from that Conversions API connection's dataset list. Nothing in
this repo can do it, and no code change is involved. Harmless meanwhile — a mirrored copy carries the
browser event's own id, so nothing double counts.

### Founder closed it, 2026-09-20 23:32 IST — and the History confirmed the diagnosis independently

Business Manager → **Your Conversions API connections → Manage Datasets**, exclusion toggle. Result:
**Datasets connected 1** (`1051265191046395`, Owned, Yes) · **Datasets excluded 1**. History row:
`Dataset excluded · Dataset ID 1045085251085243 · Apoorva Sahu · Today at 11:32 PM`.

**The same History page corroborated §8.41-i without being asked to**: the row above it reads
`Conversions API added · This business is using the Conversions API · Apoorva Sahu · Today at 5:52 PM`.
**5:52 PM is why the hourly CSV's first `server_received_count` appears in the 18:30 bucket and not
earlier** — the mirroring began when the business connected, 26 minutes before the migration deploy at
18:18. Two instruments, recorded independently, agreeing on a cause. That is what the earlier
timestamp-correlation guess never had.

**One setting to remember: "Automatically connect only your datasets" is ON**, so a dataset owned by
this business connects to the Conversions API by itself. The exclusion is explicit and survives that,
but **a NEW pixel created in this portfolio will start mirroring the moment it exists** — worth
knowing before anyone creates one "just to test".

Nothing in this repo changed for any of it: our direct Conversions API calls carry their own token and
do not depend on this business connection.

#### Verification of the exclusion, 23:33–23:38 IST — structurally confirmed, behaviourally pending

| Reading | Time | Result |
|---|---|---|
| Old pixel `PageView` last received (baseline) | 23:33 | "1 hour ago" |
| Fresh traffic fired, apex + store host | 23:34 | new pixel, `eventCount` 1 |
| Old pixel last received | 23:35 | "1 hour ago" — unchanged |
| New pixel Settings → Datasets connected | 23:35 | **(1): `1051265191046395` only** |
| Old pixel last received | 23:38 | "1 hour ago" — still unchanged |

**Structurally confirmed:** the connection lists one dataset, read from the pixel's own Settings page
rather than the Business Manager screen where the change was made — two independent screens agreeing.

**Behaviourally NOT yet confirmed, and stated plainly rather than claimed:** the live pixel's own
Conversions API card also sat frozen at "25 minutes ago" through this window, so it did not register
the 23:34 traffic either. **When the instrument has not moved for the control, it cannot prove
anything about the subject.** The honest check is tomorrow: the old pixel's "last received" should
keep ageing (2 hours, 3 hours, …) and never reset. If it does reset, the exclusion did not hold.

**Either way nothing in this repo is at risk.** The mirrored copies were always Meta's bonus; the
browser pixel and our own Conversions API `Purchase` are what the funnel actually runs on, and both
are unaffected by this setting.
