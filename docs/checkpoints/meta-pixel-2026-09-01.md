# Meta Pixel, and the privacy page it forced open (2026-09-01)

**Law: `docs/website-steps.md` §8.30.** Rollback tag: **`pre-meta-pixel-2026-09-01` = `87cf706`**,
the commit *before* this round (it is an annotated tag, so `git rev-parse` on the bare name returns
the tag object `97858c7`; use `pre-meta-pixel-2026-09-01^{commit}` for the commit).

The founder set up Meta Business Manager and asked for the pixel, working from a generic
copy-paste guide. The guide was right about Next.js and wrong about this repo in five ways, and the
interesting work was not the pixel at all. It was the privacy page.

## What shipped

Pixel `1045085251085243`, Business Manager portfolio `1804686660128463`. Live on `kheelona.com`,
`www.kheelona.com` and `store.kheelona.com`, and nowhere else.

- `META_PIXEL_ID` and `META_PIXEL_HOSTS` in `src/config/site.ts`
- `src/components/molecules/MetaPixel.tsx` (+ story, + test)
- `src/lib/fbq.ts`, the single `fbTrack` seam
- `InitiateCheckout` and `Purchase` added to `src/features/preorder/lib/analytics.ts`
- three origins added to `src/lib/security-headers.ts`
- `/privacy` rewritten, and `test/analytics-tags.test.ts` extended to four tools
- Ideabaaz marked closed

## The five places the generic guide did not fit

1. **Paths.** It wanted `components/`, `lib/` and `types/` at the repo root. This is a `src/`-based
   atomic-design project, so those became `src/components/molecules/`, `src/lib/`, and a
   `declare global` inside `fbq.ts` rather than a floating `.d.ts`.
2. **`NEXT_PUBLIC_META_PIXEL_ID`.** The founder tried to add it and Vercel refused: *"Remove the
   public framework prefix to keep this value private."* Vercel was right, and the guide was wrong
   twice. A `NEXT_PUBLIC_` value is inlined into the client bundle at build time, so it can never be
   a Secret; and this repo already settled the pattern by hardcoding `GA4_MEASUREMENT_ID` and
   retiring `NEXT_PUBLIC_GA4_MEASUREMENT_ID` because nothing read it. Hardcoding also avoids the
   trap that a Vercel variable only applies to deployments created after it changes.
3. **No host gate.** The guide fires the pixel everywhere. GA4 here has fired on production hosts
   only since July, and the reason matters more for this tool: a preview page view does not merely
   dirty a report, it joins a retargeting audience and feeds the signal Meta optimises ad spend
   against.
4. **Mounted first in `<body>`.** §8.19 puts measurement tags last, because the hero image owns
   mobile LCP.
5. **`useSearchParams` + Suspense.** Unnecessary here. `usePathname` alone does the job with no
   Suspense boundary and no risk of bailing a static page out of prerendering, because a query
   string only changes on a full page load, which fires `PageView` from the init script anyway.

The guide's `useRef` first-render guard, though, was correct and was kept. It is the difference
between one `PageView` per landing and two, and a doubled `PageView` silently halves every
conversion rate Meta reports.

## The part that needed a founder decision

`/privacy` carried three promises that a Meta Pixel makes untrue:

- the tools *"set no cookies and do not follow you to other sites"*
- *"none of it is used to advertise to you"*
- *"We do not run ads with it, trade it, or share it..."*

`test/analytics-tags.test.ts` has enforced since §8.21-c that a tool and its disclosure ship in the
same commit, so this was not skippable. The founder chose to state it honestly and ship. The
measurement section now says the fourth tool is different, that it sets a cookie and does follow you,
that Meta receives the page viewed and whether a pre-order happened and for how much, and that
personalised advertising can be turned off in Facebook's own settings. The two contradicting
sentences elsewhere were narrowed to what is still true rather than deleted: the form **fields**
never reach an advertiser, and nothing about the child is measured or advertised against. The
retired wording is now pinned as banned by a test. The page keeps its standing counsel-review TODO.

**A small lesson from writing it:** the first attempt failed its own new guard, because the comment
explaining the change quoted the banned sentence, and the test reads raw file source. The comment
now describes the retired wording instead of quoting it.

## Purchase value

Founder's call: report **what was actually collected** — ₹499 for a token order, ₹7,999 for a full
one, ₹99 at an event — never the ₹4,999 headline. The ₹4,500 balance arrives weeks later by payment
link and is never reported, so ROAS reads low on token orders rather than counting revenue a refund
could take back. Refunds are not reported either. Both gaps close with the Conversions API, which is
why `fbTrack` carries an unused `eventId`: Meta deduplicates a server-side copy by matching
`eventID`, so adding it later touches no call site.

`Purchase` fires inside Razorpay's success handler with the amount from the **server's**
create-order response (§8.25-c-i holds), which also means it runs once per payment and needs no
de-duplication: a parent returning to `/thanks` weeks later from the email link never reaches it.

## Ideabaaz, closed

The tier closed itself. Its `expires_on` of 2026-08-31 passed and the page began rendering its ended
state, exactly as designed. This was noticed because **two tests went red on their own** — the
baseline for this session was 884 passed / 2 failed, not green — since the fixture carries the real
expiry date.

The route was deliberately **kept**, not deleted or redirected: printed fest QR codes point at it
and cannot be recalled, and an honest "the exclusive has ended, pre-order at the usual price" is a
better answer to a late scan than a 404. The two live-price tests were removed with the reasoning
recorded in the test file. The `event_tiers` row was **not** touched, because production data is the
founder's and expiry already does the job.

## How it was verified without touching Meta

§8.28-g forbids pointing a probe at a measurement host, and that rule is what shaped the check. The
QA harness aborts third-party requests by default; **that default was kept**. So the probe asserts
what the page *attempted* and reads the calls sitting in the `fbq` stub's own queue. The gate is
proven open without one event reaching the founder's real pixel.

| host | tag | `fbq` | queue | facebook request |
|---|---|---|---|---|
| `kheelona.com` | yes | yes | `init:1045085251085243`, `track:PageView` | attempted, aborted |
| `127.0.0.1` | no | no | empty | none |
| `store.localhost` | no | no | empty | none |

A client-side navigation to `/safety` added exactly one further `track:PageView` and no more.

Gates: `npm test` **894/894** (102 files), `npm run build` clean, `npm run qa:sweep` **clean 34/34**
axe and voice at 390 and 1280.

## Two things left, both flagged in `Technical-Todo.md`

- **The CSP enforce flip resets.** Three origins joined the policy today, so §8.28-a needs a fresh
  few days of production Report-Only, read for `blocked=…facebook…` lines. Reports from before today
  say nothing about the pixel.
- **`qa:sweep`'s default `SWEEP_STORE` aims at production DNS.** `store.kheelona.com` resolves to
  Vercel's production IPs and the harness's local host-mapping does not take for that subdomain, so
  the bare command reports two `ERR_TIMED_OUT` failures. `SWEEP_STORE=http://store.localhost:3456`
  is clean 34/34. Worth fixing for a second reason: while `security-review.md` is open with "no
  active testing against production" as a standing rule, the default quietly aims an automated sweep
  at live infrastructure.

## Lint

`MetaPixel.tsx` produces one lint error, byte-identical to the one `GoogleAnalyticsGate.tsx` already
produces (`setState` synchronously within an effect), because it copies that component's shape on
purpose — the effect is how the host is read without forcing every page dynamic. Lint was already
red on `main` with 29 errors and is not part of the build gate.

---

# Second pass, same day: ViewContent

The founder worked through a longer guide (Parts B to D) and asked what was left. Most of it was
already done or should not be done; the assessment is §8.30-j. One thing was a real gap.

## Added

`ViewContent` on `/products/lumi`, via a route-local client component,
`_components/ViewContentTracker.tsx`. **The page stays statically prerendered** — verified in the
build output (`○ /products/lumi`), which was the main risk worth checking.

## The value: a decision with a known expiry

Offered four paths. Recommended no value at all, on the grounds that value-based optimisation and
value-based lookalikes need hundreds of conversions before Meta will use them, and the founder is
spending ₹100 to ₹192 a day. **The founder chose to send the headline unit price** (₹4,999, from
`LAUNCH_AMOUNT_PAISE`) and to change it manually when the price moves. That is a reasonable call and
it is now recorded properly rather than left as a loose constant.

What makes it safe rather than a time bomb is that it rides an existing trigger. The standing
sell-out copy sweep (§8.26-g) already fires the day `/api/health` first reports `preorder:"full"`,
and this file is now named in that checklist, in the component's own header, and in a test that
asserts both pointers still exist. If it is missed, nothing breaks — ViewContent simply
under-reports the product by ₹3,000 from that day.

Note that Purchase reports something different on purpose (the amount collected), so a ₹4,999
ViewContent beside a ₹499 Purchase is correct and not a defect.

## The bug that was nearly shipped

`fbTrack` no-ops when the pixel is absent, which is right for localhost and previews. But the pixel
is gated behind a hostname check that runs in an effect and only then loads `afterInteractive`, so on
a real production host the ordering is: page mounts, component effects run, and only afterwards does
`fbq` exist. **A `ViewContent` fired straight from a mount effect would have been dropped most of the
time** — silently, with the only symptom being an event that looks mysteriously rare in Events
Manager. Fixed before shipping with `whenFbqReady`: it polls for the queueing stub, gives up on a
bounded timeout so a gate-shut host does not poll forever, and returns a canceller for React
cleanup. Law: §8.30-k. Events fired from user interaction are unaffected.

## Three things deliberately NOT added

- **`InitiateCheckout` on pre-order CTAs.** It already fires when the Razorpay sheet opens, so this
  would double-count one person as two, misuse an event that means "checkout started" for a link
  click, and hardcode an amount that is wrong in two of the three price modes.
- **`Lead` on `/contact`.** That page has no form, only WhatsApp and mailto links. Firing Lead on the
  support WhatsApp button would fill the signal with existing customers chasing their own orders.
- **A `Purchase` on `/thanks`.** Ours fires in the Razorpay success handler with a server-supplied
  amount, so it is correct in every mode and structurally cannot re-fire on refresh.

Gates: `npm test` **912/912** (104 files), build clean with the Lumi page still static,
`qa:sweep` clean 34/34.
