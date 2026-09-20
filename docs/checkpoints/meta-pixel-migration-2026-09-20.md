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
