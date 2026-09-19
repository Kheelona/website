# PostHog: the settings that are the founder's, not the code's (2026-09-19)

Project **617632**, US cloud. Everything in this file is a **dashboard** setting. None of it lives in
this repo, none of it can be set by a deploy, and a session with no memory of the round can act on it
from here.

Written because the founder decided on 2026-09-19: **keep recording at 100%, shorten retention.**

> ⚠️ **The exact menu labels below are not confirmed.** The browser profile on this machine is not
> logged in to PostHog and nobody should log in on Claude's behalf. The direct links are real — the
> login redirect echoed `/project/617632/settings/project-replay` back as its `next` target — but if
> a label has moved, trust the description of what the setting *does* over the wording.

---

## 1. Session replay retention — SHORTEN IT

**Link:** `https://us.posthog.com/project/617632/settings/project-replay`

**Set it to the shortest option PostHog offers that is still useful — 30 days.**

Recordings of real parents using a site where they type a child's age, a phone number and a delivery
address are the most sensitive thing this company holds outside the orders table itself. Retention is
the one control that is purely downside: **a recording you will never watch again is liability with
no remaining value.** Nobody reviews a four-month-old replay to find out why a pre-order form
confused someone; that question is answered in the first week or not at all.

`/privacy` tells parents this data is held in the United States. It does not name a period, so
shortening is free of any copy change. **Lengthening it later would not be** — it would want a look
at the privacy page.

## 2. Sampling — LEAVE AT 100%

Same page as above.

Record every session for now. Sampling exists to control cost at volume, and this site does not have
volume yet — under-sampling early is how you end up with too few recordings to see any pattern, which
is the entire reason replay was switched on.

**Revisit when the PostHog bill becomes visible, not before.** That is a problem worth having.

## 3. What is NOT a dashboard setting, so nobody goes looking

| | Where it lives | Note |
|---|---|---|
| Which hosts run PostHog | `POSTHOG_HOSTS` in `src/config/site.ts` | = `GA4_HOSTS`. Never add a preview or localhost |
| Which routes are never recorded | `POSTHOG_REPLAY_DENY_PATHS` | **Browser paths**, not route-file paths (§8.38-i) |
| Autocapture, error tracking, input masking | `PostHogGate.tsx` | Written out rather than inherited, deliberately |
| Whether anyone is identified | nothing — there is no `identify()` call | See below |

## 4. Identity: anonymous, and it is a decision (founder, 2026-09-19)

`person_profiles: "identified_only"` and **nothing anywhere calls `identify()`**, so no person profile
is created and no parent's order is ever linked to a browsing identity.

Funnels still work — they run on the anonymous distinct id — so nothing the founder has asked for is
lost. It is also the cheapest option and it keeps `/privacy`'s promises simple and true.

**Do not re-raise this.** It was asked and answered on 2026-09-19. The moment to revisit is a specific
question the anonymous data cannot answer, and the cost of answering it is a `/privacy` rewrite plus a
real order becoming linkable to a browsing history held in the US.

## 5. Two things to look at once there is data

- **Does replay actually get watched?** If nobody opens a recording in a month, it is costing money
  and holding parents' screens for nothing, and the honest move is to turn it off rather than keep it
  because it is already wired.
- **Does PostHog make GA4 redundant?** Five measurement tools run on one marketing site. The founder
  chose "additive for now" on 2026-09-19. `Technical-Todo.md` carries what would have to move first.
