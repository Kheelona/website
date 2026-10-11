---
title: PostHog audit (Phase 1 baseline)
type: research
updated: 2026-10-11
cites_at: archive/pre-reset-2026-10-10
sources:
  - "PostHog project 617632, read-only queries and tool reads, run 2026-10-11 01:00-02:30 UTC; every query text and result is in raw/posthog/2026-10-10-*.json"
  - "raw/posthog/2026-10-11-human-session-recomputes.json (human-session recomputes H0-H39 of scroll depth, web vitals, CTA taps and countries; run 2026-10-11 12:01-12:10 UTC, same window; supersedes Q13, Q14, Q14b, Q19, Q19b, Q20, Q39 and confirms Q33)"
  - "raw/posthog/2026-10-11-cta-without-privacy-session.json (H14h: store-link taps without the one /privacy session; S5: baseline funnel Y9KjojeN's test-account setting; run 2026-10-11 12:25-12:28 UTC)"
  - "raw/posthog/2026-10-11-recompute-verification.sql (independent verifier's recompute W0-W6d, run 2026-10-11 ~11:40-12:10 UTC, same window; W2c scroll-report coverage, W5c US sessions)"
  - decisions/D031-posthog-settings-and-replays.md
  - raw/posthog/2026-10-10-traffic-overview.json
  - raw/posthog/2026-10-10-funnel.json
  - raw/posthog/2026-10-10-landing-and-cta.json
  - raw/posthog/2026-10-10-devices-qa.json
  - raw/posthog/2026-10-10-frustration-scroll-heatmaps.json
  - raw/posthog/2026-10-10-web-vitals-errors.json
  - raw/posthog/2026-10-10-paid-meta.json
  - raw/posthog/2026-10-10-replays.json
  - raw/posthog/2026-10-10-setup-audit.json
  - "raw/posthog/2026-10-10-verification-checks.sql (independent verifier, queries V0-V22 with results, run 2026-10-11 02:00-03:00 UTC, same window; source of the section 13 corrections)"
  - "Meta Ads warehouse tables in PostHog (metaads_campaign_stats, metaads_campaigns), synced 2026-10-11 02:00 UTC"
  - "git show archive/pre-reset-2026-10-10:src/components/organisms/{Navbar,KheeluGuide}.tsx, src/components/atoms/Button.tsx, src/app/(site)/contact/page.tsx (CTA attributes)"
  - site/tracking-inventory.md
  - site/checkout.md
  - site/url-map.md
  - engineering/lessons.md (section 5)
---

# PostHog audit (Phase 1 baseline)

What PostHog says about how parents use kheelona.com and store.kheelona.com today, where the money
leaks, what the new site must fix, and the baseline the post-launch reports (Phase 8) compare
against. Event names and IDs are owned by [tracking inventory](../site/tracking-inventory.md); the
checkout steps by [checkout](../site/checkout.md); URLs by [URL map](../site/url-map.md).

**Read the sample sizes.** The whole window holds **802 human sessions and 2 purchases**. Anything
counted in single digits is a lead to check in QA, not a result. Each table names its query
(`Q…`; `V…` for the verifier's checks; `H…` for the 2026-10-11 human-session recomputes; `W…` for
the 2026-10-11 verifier's recompute); the exact HogQL and the raw result sit in the linked file in
`raw/posthog/`. An independent verifier re-derived about 120 values; what it corrected is
in [section 13](#13-verification-and-corrections).

## In one screen

1. **Data exists only from 2026-09-19** (PostHog install). The brief's 90 days and 12 months are not
   available here; GA4 (from 2026-07-28) is the only source for earlier traffic, already requested as
   [C11](../open-questions.md).
2. **802 human sessions, 91 reached the store, 10 started the form, 5 created an order, 2 paid**
   (0.25% of sessions). Both payments also arrived as server `purchase_confirmed`: browser loss 0 of 2.
3. **Paid social was half the traffic and produced no order.** 414 paid sessions, 91% single-page,
   median 7 s; Meta itself saw only 29% of its 2,310 link clicks become a landing page view.
4. **The device split is 76% phone overall, but about 51% phone without ads.** The brief's 70/30 holds
   only while Meta ads run; organic traffic is close to half laptop.
5. **The store page is where the money leaks**: 81 of 91 store visitors never touched the form, half
   of form starters did not submit, and 3 of 5 orders created were never paid. All 3 unpaid orders
   were in in-app browsers (WhatsApp, Instagram); both paid orders were in normal Chrome.
6. **On phones the first screen and the sticky bar do the selling**: 90% of measured phone views of
   Home (the 373 of 607 that sent a scroll report) never pass 25% of the page, and the guide's
   sticky bottom bar produced 14 of the 29 phone taps to the store (11 of the 18 phone sessions that
   tapped through), and 14 of 18 once `cta` tags went live on 2026-09-20. That bar carries **no
   `cta` tag**, so its taps are unattributed (25 of 29 phone taps carry no tag; the other 11 predate
   tagging) (H19, W2c, H14c, H14g).
7. **The store is the slowest page**: on the phone, the store page's LCP p75 is 3.3 s and FCP p75
   3.4 s (Home LCP 2.4 s). Phone INP on Home is p75 546 ms, well over the 200 ms target (H20, human
   sessions).
8. **No errors come from our code.** The 37 exceptions are third-party or browser noise.
9. **Setup is sound; the main gaps were closed on 2026-10-11** ([D031](../decisions/D031-posthog-settings-and-replays.md)):
   conversion goal `purchase_confirmed`, revenue analytics in INR on `purchase_confirmed.value`, bots
   in the test-account filter, the store in authorised URLs. Still open: no actions, and the
   internal-users cohort is empty.

## 1. Method and window

| Item | Value | Source |
|---|---|---|
| Requested | last 90 days (2026-07-12 to 2026-10-10) and 12 months | brief §6 |
| Data found | 2026-09-19 11:04 to 2026-10-10 23:02 UTC (first recording 10:52) | Q1 |
| Window used everywhere | **2026-09-19 00:00 to 2026-10-11 00:00 UTC** (22 days) unless a table says otherwise | all |
| Human session | at least one `$pageview`, no event flagged `$virt_is_bot`, entry referrer not `localhost:3456`, `127.0.0.1:3456` or a `*.vercel.app` preview | Q6, Q7 |
| Excluded as bots | 67 bot pageviews; 54 are the **Google Play Store** checker opening `/privacy` (this is the `/privacy` pattern the URL map flagged) | Q2 |
| Excluded as internal | 4 sessions from local builds or the mid-version preview | Q3, Q6 |
| Still included | team browsing: 4 devices with 10 or more sessions each (3 Mac Chrome, 1 iPhone) hold 48 sessions; cohort 580233 is empty ([C7](../open-questions.md)) | Q24 |
| Paid | entry `utm_medium=paid`, or a Meta `fbclid` with no UTM at all | Q34 |
| Session entry (landing, source, paid flag) | PostHog's sessions table, `session.$entry_*`: the session's first event. The verifier rebuilt the same from each session's first `$pageview`: every total agrees (802 / 388 / 414) and 7 sessions change landing page (section 3) | Q12, Q34, V1, V4 |
| Human-session recomputes | Scroll depth, web vitals, CTA taps and countries were re-run on 2026-10-11 inside the human sessions above (`properties.$session_id IN` the Q34 per-session subquery), with the same window, paid flag and event-level device as the original queries; they reproduce the verifier's V9 and V12 exactly. Vitals n is still events, not sessions | H0-H39 |
| Figures with another scope | These keep the scope their query states and were not recomputed: exceptions (every event, Q21), dead, rage and swipe counts (all or non-bot events, Q15, Q16, Q41), heatmap points (heatmap table, Q37), recordings (Q36, Q36b), the native funnel (persons, Q8) | Q8, Q15, Q16, Q21, Q36, Q37, Q41 |
| Rupees | Rounded to the nearest rupee everywhere. Exact sums: ₹2,416.64 spent 09-19 to 09-23, ₹2,472.28 spent 09-02 to 09-13 | V7, V21 |
| Funnel unit | a session; a step counts if it happened in the session (steps need not be in order). PostHog's native ordered funnel by person is the cross-check (Q8) | Q6-Q8 |
| Replays | 26 drop-off sessions reviewed through recording metadata plus a full event timeline each; video frames could not be viewed through the MCP (section 6) | R1 |

Source groups (Q6): **Paid social, tagged**; **Meta click id, no UTM**; **Direct**; **Organic search**
(Google, Bing, DuckDuckGo, Yahoo, Google app); **ChatGPT** (`utm_source=chatgpt.com`, which ChatGPT
adds itself); **Instagram bio link** (`ig` / `social`); **Organic social, other**; **Own site** (a
session restarted on the store after 30 minutes idle); **Referral**.

## 2. Baseline metrics (for the post-launch comparison)

Window 2026-09-19 to 2026-10-10, human sessions, internal excluded. The web-vitals rows count the
`$web_vitals` events inside those sessions (n is events, not sessions; H39). Three rows keep a wider
scope, as labelled: exceptions, dead or rage clicks, and the recordings total. "Apex host" is every kheelona.com page;
"store host" is every store.kheelona.com page, `/thanks` included. Per-page vitals are in section 7.

| Metric | All | Not paid | Paid | Query |
|---|---|---|---|---|
| Sessions | 802 | 388 | 414 | Q34 |
| Unique devices | 690 | 292 | 399 | Q34 |
| Pageviews | 1,087 | 625 | 462 | Q34 |
| Single-page sessions | 81.2% | 70.6% | 91.1% | Q34 |
| Median session length | 13 s | 37 s | 7 s | Q34 |
| Sessions per week once ads stopped | 83 (week of 09-28, 7 days), 88 (week of 10-05, 6 days in the window) | | | Q9 |
| Phone / laptop / tablet share | 76.1% / 23.3% / 0.6% | 51.5% / 47.4% / 1.0% | 99% phone | Q7, Q6 |
| Reached the product page | 61 (7.6%) | | 1 | Q6, Q7 |
| Reached the store page | 91 (11.3%) | 71 (18.3%) | 20 (4.8%) | Q34 |
| Started the form (`preorder_form_started`) | 10 (1.2%) | 8 | 2 | Q34 |
| Valid submit (`preorder_start`) | 5 | 5 | 0 | Q34 |
| Order created (`begin_checkout`) | 5 | 5 | 0 | Q34 |
| Purchase, browser (`purchase`) | 2 (0.25%) | 2 (0.52%) | 0 | Q34 |
| Purchase, server (`purchase_confirmed`) | 2; stored `tier` is `"launch"` on both (and on both browser `purchase` events); `value` sums to ₹998, i.e. 2 × ₹499, the token amount | | | Q38, V6 |
| Browser purchase loss (server minus browser) | 0 of 2 | | | Q38 |
| LCP p75, phone, apex host / store host | 2,348 ms (n 187) / **3,308 ms (n 30)** | | | H39 |
| INP p75, phone, apex host / store host | 440 ms (n 47) / 258 ms (n 18) | | | H39 |
| CLS p75, phone, apex host / store host | 0.0 (n 134) / 0.0 (n 23) | | | H39 |
| LCP p75, laptop, apex host / store host | 1,574 ms (n 111) / 2,850 ms (n 11) | | | H39 |
| Exceptions (every event, not only human sessions) | 37 in 12 sessions, none from our code | | | Q21, Q41 |
| Dead clicks / dead swipes / rage clicks (non-bot events, internal included) | 89 / 61 / 13 (41 / 41 / 9 sessions) | | | Q41 |
| Recordings | 533 recordings in the window (all sessions); 485 of 802 human sessions (61%) have one; 0 recordings contain `/thanks` | | | Q36, V16 |

The saved insight **"Website reset — baseline funnel by device (2026-09-19 to 2026-10-10)"**
([Y9KjojeN](https://us.posthog.com/project/617632/insights/Y9KjojeN)) holds the native funnel with a
fixed date range, so Phase 8 can open it beside the post-launch one. **Note for Phase 8:** since
D031, insights with "filter test accounts" on also drop bot events; Y9KjojeN has that toggle off and
carries its own bot filter (`coalesce(properties.$virt_is_bot, false) = false`), so its result does
not change (S5, read 2026-10-11 12:27 UTC).

## 3. Traffic: source, campaign, device

### By week and source (Q9)

| Week starting (Mon) | Sessions | Paid, tagged | Meta click, no UTM | Direct | Organic search | ChatGPT | Other | Reached store | Purchases |
|---|---|---|---|---|---|---|---|---|---|
| 09-14 (only 09-19, 09-20) | 176 | 124 | 11 | 26 | 4 | 4 | 7 | 25 | 0 |
| 09-21 | 455 | 73 | 205 | 78 | 47 | 37 | 15 | 45 | 2 |
| 09-28 | 83 | 0 | 0 | 43 | 14 | 23 | 3 | 11 | 0 |
| 10-05 | 88 | 0 | 1 | 36 | 28 | 19 | 4 | 10 | 0 |

Paid traffic ended with the last ad spend on 2026-09-23 (Q30b, Q31). Since then **one** session has
arrived with a Meta click id and no UTM, on 2026-10-08 (laptop; Q9 week of 10-05, V8, V2), so the
paid flag counts it. Without ads the site draws about **13 human sessions a day**: 171 sessions in
the 13 days from 09-28 to 10-10 (Q9: 83 + 88; the week of 10-05 has 6 days in the window).

### Campaigns (Meta Ads, synced into PostHog; Q30, Q30b, Q31)

| Campaign | Objective | Days | Spend (₹, nearest rupee) | Link clicks |
|---|---|---|---|---|
| 20260918_Kids_Interaction_Video Campaign | Traffic | 09-18 to 09-20 | 814 | 1,182 |
| 20260920_Kids_Interaction_Video Campaign Campaign | Traffic | 09-20 to 09-23 | 1,183 | 1,030 |
| 2026-09-Click-to-Whatsapp | Leads | 09-22 to 09-23 | 545 | 98 |

Three earlier September campaigns (09-02 to 09-13, ₹2,472, 5,054 link clicks; Q30, V21) predate
PostHog. Daily, 09-18 to 09-23: **2,310 link clicks, 667 Meta landing page views (29%)**; on 09-20
to 09-23, PostHog saw 364 paid sessions from 1,469 link clicks (25%). Seven in ten ad clicks never
loaded the page far enough for Meta's own pixel. Spend inside the PostHog window: ₹2,417
(09-19 to 09-23; Q30b, V7).

Paid sessions by placement (Q4, Q11): Audience Network (`an`) 111, median 3 s; Instagram 37 (in-app median 0 s);
Threads 33, median 3 s; Facebook 16. **208 sessions arrived from a Meta click inside WhatsApp's
in-app browser with no UTM at all** (09-19 to 09-22, median 11 s); they match the
20260920 campaign's dates, which suggests WhatsApp placements served without URL tags (inference).

### Landing pages by host (Q12)

| Landing | Sessions | Paid | One page only | Median length | Reached store | Started form | Purchases |
|---|---|---|---|---|---|---|---|
| kheelona.com `/` | 681 | 399 | 81.8% | 13 s | 28 (4.1%) | 4 | 2 |
| store.kheelona.com `/` | 58 | 15 | 81.0% | 20 s | 58 | 5 | 0 |
| kheelona.com `/products/kheelu` | 31 | 0 | 71.0% | 31 s | 5 (16.1%) | 1 | 0 |
| `/ai-toys-for-kids-in-india` | 7 | 0 | 85.7% | 6 s | 0 | 0 | 0 |
| `/team` | 6 | 0 | 66.7% | 2 s | 0 | 0 | 0 |
| every other page | 19 | 0 | | | 0 | 0 | 0 |

**Definition.** Landing = PostHog's session entry, `session.$entry_hostname` + `$entry_pathname`
(the session's first event); length = `session.$session_duration` (Q12). Sections 2 to 4 use the
same session entry for source and paid flag.

**Reconciliation with first-pageview attribution (V4).** Rebuilt from each session's first
`$pageview` (length = last minus first event), the totals are identical and 7 sessions change
landing: their first event (a `$pageleave` or `$autocapture`) sits on a different page from their
first pageview. Q12's figure in brackets:

| Landing | Sessions | Paid | One page only | Median length |
|---|---|---|---|---|
| kheelona.com `/` | 683 (Q12: 681) | 398 (399) | 81.4% (81.8%) | 14 s (13 s) |
| kheelona.com `/products/kheelu` | 31 (31) | 0 (0) | 74.2% (71.0%) | 31 s (31 s) |
| `/team` | 6 (6) | **1** (0) | 66.7% (66.7%) | 8 s (2 s) |
| store.kheelona.com `/` | 58 (58) | 15 (15) | 81.0% (81.0%) | 21 s (20 s) |

So "every paid landing was Home or the store root" holds by session entry (399 + 15 = 414) and is
off by one by first pageview (398 + 15 + 1 on `/team`). **No paid session landed on the product
page under either definition**, and no conclusion changes.

Countries (H33, H33b; human sessions, country of the first pageview): India 84.9% (681 of 802),
US 7.6% (61), then nothing above 1% (Sweden 1.0%); 27 countries in all. Of the 388 non-paid
sessions, India is 70.6% and the US 15.2% (59): **114 of the 388 non-paid sessions (29%) are
outside India.** Paid sessions are 98.3% India (407 of 414).
Caveat on the US figure: 19 of the 61 US human sessions are direct, single-page Chrome-on-Linux
visits with a median length of 0 s and no clicks, which `$virt_is_bot` did not flag (verifier's
W5c, [recompute verification](../raw/posthog/2026-10-11-recompute-verification.sql)). That they are
automated is an inference, not a classification; either way, do not read the US count as US demand.

### Device split: the 70/30 belief, corrected (Q7, Q34, Q40)

| Population | Phone | Laptop | Tablet | n |
|---|---|---|---|---|
| All human sessions, 09-19 to 10-10 | 76.1% | 23.3% | 0.6% | 802 |
| Not paid | 51.5% | 47.4% | 1.0% | 388 |
| After ads stopped (from 09-24) | 51.0% | 48.2% | 0.8% | 257 |
| After ads stopped, without the 4 most repeated devices | 51.7% | 47.4% | 0.9% | 232 |

**Verdict:** the brief's 70/30 is right while ads run and wrong without them (about 50/50). Phone
first remains correct, because launch traffic will be paid and paid traffic is 99% phone.

## 4. The funnel, by device and by source

Steps follow the task's mapping of the brief's funnel (there is no cart; [checkout](../site/checkout.md)):
landing → product page → **store page (checkout started)** → `preorder_form_started` → `preorder_start`
(valid submit) → `begin_checkout` (order created) → `purchase` and `purchase_confirmed`.

### By device (Q7; sessions)

| Step | Phone | Laptop | Tablet | All | All, kept from previous step |
|---|---|---|---|---|---|
| Sessions | 610 | 187 | 5 | 802 | |
| Saw the product page (optional step) | 26 (4.3%) | 35 (18.7%) | 0 | 61 | |
| Reached the store | 62 (10.2%) | 28 (15.0%) | 1 | 91 | 11.3% of sessions |
| Started the form | 8 | 2 | 0 | 10 | 11.0% of store visits |
| Valid submit | 4 | 1 | 0 | 5 | 50% |
| Order created | 4 | 1 | 0 | 5 | 100% |
| Closed the payment sheet | 2 | 0 | 0 | 2 | |
| Purchase | 1 | 1 | 0 | 2 | 40% |
| Session to purchase | 0.16% | 0.53% | 0% | 0.25% | |

The biggest step loss is **store → form (89% lost)**, then **form → submit (50%)**, then **order →
paid (60%)**. Phone reaches the store less often overall only because of paid traffic: among
non-paid sessions, 21.5% of phone sessions reached the store against 14.7% of laptop ones (Q27).

PostHog's native ordered funnel by person (Q8, insight Y9KjojeN) agrees: phone 551 people → 26 store
→ 5 form → 2 submit → 2 order → 1 paid; laptop 135 → 19 → 3 → 2 → 2 → 1. Median time from order
created to purchase: 151 s on the phone, 125 s on the laptop.

### By source (Q6; sessions; internal excluded)

| Source | Sessions | Phone share | Product page | Store | Form | Submit | Order | Purchase |
|---|---|---|---|---|---|---|---|---|
| Meta click id, no UTM | 217 | 99% | 1 | 4 | 1 | 0 | 0 | 0 |
| Paid social, tagged | 197 | 99% | 0 | 16 | 1 | 0 | 0 | 0 |
| Direct | 183 | 44% | 19 | 27 | 2 | 2 | 2 | 0 |
| Organic search | 93 | 42% | 21 | 6 | 1 | 1 | 1 | **1** |
| ChatGPT | 83 | 70% | 19 | 13 | 2 | 1 | 1 | **1** |
| Instagram bio link | 16 | 81% | 0 | 16 | 1 | 1 | 1 | 0 |
| Own site (session restarted) | 7 | 57% | 0 | 7 | 1 | 0 | 0 | 0 |
| Organic social, other | 4 | 75% | 0 | 1 | 0 | 0 | 0 | 0 |
| Referral | 2 | 100% | 1 | 1 | 1 | 0 | 0 | 0 |

Both "Direct" orders came from store links opened inside WhatsApp's in-app browser with no referrer
(09-22), most likely links sent in the Click-to-WhatsApp chats (replays, section 6). The two buyers
came from Google (laptop, one session) and ChatGPT (Android Chrome, two sessions; watched all six
customer films first) (Q25, R1).

## 5. Behaviour on Home, the product page and the store

### Scroll depth (H19, H19b; human sessions)

Read from `$prev_pageview_max_scroll_percentage` and `$prev_pageview_duration`, which a page view
reports when it is left (on the next `$pageview` or a `$pageleave`). "Views measured" are the views
that sent that report; a view that sent none is not in the table. **Coverage** (verifier's W2c,
human sessions, [recompute verification](../raw/posthog/2026-10-11-recompute-verification.sql)):
only 373 of 607 phone Home pageviews (61.4%) and 33 of 68 phone store pageviews (48.5%) sent a
report; laptop Home 132 of 170, product page phone 21 of 28 and laptop 29 of 39, store laptop 22 of
31. Every percentage below describes measured views only. Device is the reporting event's
`$device_type`; paid is the audit's flag (section 1). Percentages are rounded; the raw file has one
decimal.

| Page | Device | Views measured | Median max scroll | Reach 25% | Reach 50% | Reach 90% | Median time |
|---|---|---|---|---|---|---|---|
| Home | Phone, all | 373 | 0% | 10% | 6% | 3% | 9 s |
| Home | Phone, not paid | 79 | 12% | 34% | 22% | 9% | 26 s |
| Home | Phone, paid | 294 | 0% | 3% | 2% | 1% | 8 s |
| Home | Laptop | 132 | 15% | 40% | 28% | 22% | 41 s |
| Product page | Phone | 21 | 30% | 57% | 19% | 10% | 33 s |
| Product page | Laptop | 29 | **2%** | 41% | 24% | **0%** | 10 s |
| Store | Phone | 33 | 46% | 61% | 45% | 24% | 34 s |
| Store | Laptop | 22 | 69% | 59% | 55% | 36% | 17 s |

Home on the phone: 90% of 373 measured views stay above 25% of the page (paid 97% of 294, not paid
66% of 79). The product page on the laptop is opened and left near the top: median max scroll 2%,
none of 29 views reach 90%, although 41% pass 25%. The verifier's human-session counts (V12)
reproduce exactly.

Store visitors read deep and still leave: on the phone the median measured view reaches 46% of the
store page and a quarter reach 90%; on the laptop the median is 69%. The store page answers some
question, but not the one that stops them (replays, section 6).

### Which CTAs people tap (H13, H14, H14b-H14h; human sessions)

Taps on a store link from kheelona.com. The `cta` tag went live on 2026-09-20: the attribute entered
the code that day (commit bada255) and the first tagged click arrived at 17:35 UTC (H14f). Every
store-link tap in the window was in a human session, so these counts equal Q13, Q14 and V13.

- **Laptop:** 24 taps in 19 sessions; navbar 11, finale 5, hero 3, product-top 3, untagged 2 (both
  before tagging went live; H14, H14g).
- **Phone:** 29 taps in 18 sessions; **25 carry no `cta` value** (15 sessions) (H14). Without the one
  `/privacy` session described below: 21 taps in 17 sessions, 17 untagged (14 sessions) (H14h).
  - **14 taps from 11 sessions sit in the guide's phone-only sticky bottom bar** on Home (9) and the
    product page (5); its link has no `data-ph-capture-attribute-cta`
    (`git show archive/pre-reset-2026-10-10:src/components/organisms/KheeluGuide.tsx`, lines 255-279).
    Since tagging went live, the bar gave 14 of the 18 phone taps (H14c, H14g). The mobile purchaser
    reached the store through that bar, twice.
  - The other 11 untagged taps predate tagging: 3 in-page links on Home, and 8 taps in 3 seconds
    by one session on 09-20 on the "Pre-order Kheelu" button in the phone menu's slide-in panel on
    `/privacy` (H14e, H14f). That panel is a fixed element, which is why fixed elements account for
    22 taps (12 sessions) but only the guide's bar is a sticky CTA (H14d). Without that session,
    fixed elements account for 14 taps (11 sessions), all of them the guide's bar (H14h).
- Heatmaps agree: 23% of phone click points on Home land on fixed elements (Q37; heatmap table, all
  sessions).
- `navbar-mobile` (the CTA inside the phone menu, `Navbar.tsx` line 91 at the archive tag) was never
  tapped after tagging went live; the only phone-menu taps are the 8 above (H13, H14f).

### Product page versus Home (Q12, Q32)

Sessions that saw the product page reached the store 14.8% of the time (9 of 61); sessions that saw
Home but not the product page, **4.5% (30 of 660)** (V15). Q32 printed 30 of 656 (4.6%) because it
kept only phones and laptops and so dropped 4 tablet sessions; no tablet session saw the product
page, so 61 is unchanged. Product-page landings reached the store 16.1%, Home landings 4.1% (Q12).
Self-selection inflates this, but the direction is consistent.

### Customer films (Q27)

The six "Play:" films are the most-used interactive element: 24% of non-paid phone sessions and 17% of
non-paid laptop sessions press play. Laptop sessions that played a film reached the store twice as
often (25.0% vs 12.5%, n 32 vs 152); on the phone there is no difference (22.9% vs 21.1%).

### Rage clicks, dead clicks and dead swipes (Q15, Q16, Q41)

- **Phone, Home, playing film (`<video controls>`): 36 dead clicks in 12 sessions.** Taps on native video
  controls change no page markup, so PostHog counts them as dead; weak signal on its own.
- **Laptop, "Next video" carousel arrow:** rage-clicked on the store (3 in 1 session) and clicked 5 times
  in 7 seconds on Home in a replay; the carousel gives no feedback at its end (inference).
- **"Give Kheelu a poke" mascot image:** rage-clicked in one replay; looks tappable, does little.
- Store dead taps sit on the form's wrappers and the consent row (4 on the phone, 3 sessions): people
  tap near, not on, the field or tick box.
- Dead swipes on the phone store page land on the seller address and the WhatsApp hint text.

## 6. Replays of drop-offs (26 reviewed)

**What could be seen.** The MCP returns recording metadata (duration, active seconds, clicks, key
presses, console logs, start URL) and nothing visual. For each recording the full event timeline was
rebuilt from events: every pageview with the scroll depth reached, every click with its element text
or `aria-label`, dead and rage clicks, exceptions and funnel events, to the second. Video frames were
not viewed. Replay Vision summaries were not generated: they spend credits and create objects, which
is outside this read-only remit.

**Which.** All 8 human sessions that started the form and did not pay, plus 18 store visitors who
never touched the form (phone and laptop, paid and organic, short and long). All 26 had recordings;
none logged a console error; 5 logged console warnings (R1).

**Form starters who did not pay (8):**
- 4 left after typing one or two fields (an Audience Network visitor at 37 s, a WhatsApp-browser visitor
  who tapped the hero CTA within a second of landing, an iPhone visitor from ChatGPT who came through the
  sticky bar, and a laptop visitor who opened `/refund` mid-form and returned 9 minutes later only to
  click the film carousel).
- 1, on iPhone Safari from outside India, pressed "Pay" twice, was rejected by validation both times
  (no `preorder_start`), tapped near the WhatsApp hint, then left through the logo.
- 3 reached the Razorpay sheet, **all in in-app browsers**: Instagram on iPhone closed it after 7 s;
  WhatsApp on Android closed it after 11 s; WhatsApp on Android opened it and never returned (no close,
  no payment; the page stayed open 23 minutes). Two of the three opened the store inside WhatsApp
  with no referrer and no ad click id, so most likely from links sent in WhatsApp chats.

**Store visitors who never started the form (18):**
- 9 scrolled 85% or more of the store page; 9 played a film; 7 went back to marketing pages afterwards
  (3 by tapping the store logo); 2 tapped "Need help? WhatsApp us"; 2 opened the store twice in one
  session; 3 left within 12 s; 4 came through the phone sticky bar.
- The pattern: **people who reach the store want more convincing or a question answered, and the
  store sends them away to find it.**

**The two buyers, for contrast:** the laptop buyer spent 3 minutes on Home, used the navbar CTA, took
72 s on the form and 125 s in Razorpay. The phone buyer watched all six films on Home, left, came
back, used the sticky bar twice, took 87 s on the form and 151 s in Razorpay.

Recording coverage: 485 of 802 human sessions (61%) have a recording (V16), and only 73 of 218
sessions inside WhatsApp's browser (33%; Q36b, which does not exclude internal sessions), so short
paid visits are under-represented. Recordings are kept 30 days: the paid-campaign replays
(09-19 to 09-23) expire between 2026-10-19 and 2026-10-23, and by the founder's decision they are
not exported ([D031](../decisions/D031-posthog-settings-and-replays.md)); the timelines above are
rebuilt from events, which stay.

## 7. Errors, web vitals, on-site search

**Exceptions (Q21).** 37 in 12 sessions, all on kheelona.com, none on the store:
"Script error." 23 (cross-origin scripts, no detail; 9 sessions), an unhandled rejection "Object Not
Found Matching Id:1, MethodName:update" 9 (1 laptop session; a pattern commonly reported from
link-scanning crawlers, not verified here), "Java object is gone" 3 (Android in-app browser bridge),
`window.ethereum` 2 (a wallet extension). **None comes from our code.**

**Web vitals per page, p75 (H20), against brief 9.5 (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).**
Scope: `$web_vitals` events on that page inside human sessions; n (in brackets) is events, not
sessions, and differs per metric because each event carries only the metrics ready when it was
sent. "Store page" is store.kheelona.com `/` only; section 2's "store host" adds `/thanks`.

| Page | Device | LCP | INP | CLS | FCP | Verdict |
|---|---|---|---|---|---|---|
| Home | Phone | 2,354 ms (167) | **546 ms** (38) | 0.0 (131) | 2,308 ms (333) | INP fails |
| Home | Laptop | 1,563 ms (84) | 96 ms (46) | 0.007 (70) | 1,577 ms (128) | pass |
| Product page | Phone | 2,075 ms (10) | n 2 | n 1 | 2,256 ms (13) | too few samples |
| Product page | Laptop | 2,430 ms (11) | 104 ms (13) | 0.007 (17) | 2,018 ms (14) | pass, thin |
| Store page `/` | Phone | **3,284 ms** (29) | **294 ms** (14) | 0.0 (21) | **3,368 ms** (49) | LCP and INP fail |
| Store page `/` | Laptop | **2,863 ms** (10) | 64 ms (4) | 0.0 (10) | 2,842 ms (20) | LCP fails, thin |

On the store, FCP is as slow as LCP (phone p75 3,368 against 3,284 ms; laptop 2,842 against
2,863 ms), which points at server response time rather than the page's images (the store page
renders per request; [checkout](../site/checkout.md) step 3). From tapping a store
link to the store's pageview registering takes a median 3.1 s, phone p90 6.5 s (n 25; Q35).

**On-site search:** none exists. There is no search box or `/search` route at the archive tag
(`git grep` for `type="search"`, `role="search"`, `/search` in `src/`, 2026-10-11: no match), so
there is no search data.

## 8. Top 10 issues, ranked by estimated revenue impact

**How ranked.** With 2 purchases, per-issue rupee forecasts would be invented, so none are given.
Rank = orders already lost close to payment (counted), then sessions affected × closeness to
payment, then strength of evidence. Each order is worth the launch price on
[pricing](../product/pricing.md).

| # | Issue | Evidence (window 09-19 to 10-10 unless stated) | Size and confidence | The new site must include |
|---|---|---|---|---|
| 1 | **Paid clicks do not land, and landed paid visitors leave Home in seconds** | 414 paid sessions, 0 orders; ₹2,417 spent in the window; Meta landing page views 29% of link clicks; paid phone Home views: median scroll 0%, 3% reach 25%, median 8 s (n 294); by session entry every paid landing was Home or the store root (by first pageview, one was `/team`), none the product page under either (Q30b, Q31, Q34, H19b, Q12, V4) | Half of all traffic; high confidence | Ads land on `/products/kheelu` (or a phone landing page) that matches the ad (the films), with CTA, price caption and refund line in the first 360 × 640 screen; content and CTA usable before JavaScript; LCP ≤ 2.5 s inside WhatsApp, Instagram and Facebook in-app browsers on a mid-range Android over 4G |
| 2 | **Orders created but not paid, all in in-app browsers** | 5 orders created, 2 paid; the 3 unpaid were Instagram (iPhone) and WhatsApp (Android, twice): 2 closed the sheet in 7-11 s, 1 never came back; both paid orders were in normal Chrome (Q7, Q17, R1) | 3 orders lost at the last step; n 5, directional | QA of the Razorpay sheet (sandbox) inside WhatsApp, Instagram and Facebook browsers on Android and iOS, including the UPI app switch; a presentation-only hint on the store for in-app browsers ("open in Chrome or Safari", copy link), subject to founder approval; new events that show the sheet opening and failing (section 9) |
| 3 | **Half of form starters never submit; validation stops some** | 10 started, 5 valid submits; 4 left after 1-2 fields; 1 rejected twice by validation and left; 2 of 6 submitters hit an error first, including one buyer (Q7, Q17, R1) | 5 lost form starters; directional | Presentation only, validators unchanged: label the phone field as an Indian WhatsApp number with a visible +91; errors tied to their field and announced; correct `autocomplete` and input types; refund promise and "charged on the next step" beside the button; form in the first phone screen |
| 4 | **Store visitors read the page and leave without starting** | 81 of 91 store sessions never touched the form; phone median scroll 46%, median time 34 s (n 33 measured views); in replays 9 of 18 read 85%+, 7 went back to marketing pages, 2 asked on WhatsApp (Q7, H19, R1) | 81 sessions; high confidence on the drop, medium on the cause | Checkout page restyle that answers the buying questions beside the form: price incl. taxes, what the refundable token means, ship date, returns, a 3-4 question FAQ, one help link; nothing that sends the visitor back to the marketing site mid-purchase |
| 5 | **Phones decide on the first screen and the sticky bar** | 90% of measured phone Home views (the 373 of 607 that sent a scroll report; W2c) stay above 25% depth (non-paid: 66% of 79); the guide's bottom bar gave 14 of 29 phone store taps, from 11 of the 18 phone sessions that tapped through, and 14 of 18 since `cta` tags went live; the phone buyer used it (H19, H19b, H14c, H14g, R1) | Every phone visit; high confidence | Sticky bottom CTA on phones (Home and product page) with a `cta` value; CTA, price caption and one trust line inside 360 × 640 and also 360 × 590 (in-app browser height) |
| 6 | **Visitors land on Home; the product page sends three times more to the store** | Product-page sessions → store 14.8% (9 of 61) vs Home-only 4.5% (30 of 660); product-page landings → store 16.1% vs Home 4.1% (Q32, V15, Q12) | Medium; self-selection inflates it | Product page as the default ad and share destination; Home's first screen routes to the product page or store in one tap; nav kept to buying pages (`/playos` was viewed in 24 human sessions in the window, 3% of 802; Q32 `saw_playos`, V22) |
| 7 | **The store is the slowest page** | Store page `/`, phone LCP p75 3,284 ms (n 29) and FCP 3,368 ms (n 49); whole store host, phone LCP 3,308 ms (n 30); store page laptop LCP 2,863 ms (n 10); tap to store view median 3.1 s, phone p90 6.5 s (H20, H39, Q35) | Every buyer passes it; medium confidence | Store server response fast enough for LCP ≤ 2.5 s on the phone without changing price or mode logic (architecture choice for Phase 4); perf budget includes the store |
| 8 | **Home is sluggish to the touch on phones** | INP p75 546 ms on phone Home (n 38); whole apex host, phone 440 ms (n 47); events in human sessions (H20, H39) | Thin sample; medium | INP ≤ 200 ms budget on phones; no heavy main-thread work (3D canvas, scripted reveals) on phones |
| 9 | **Visitors outside India meet an India-only phone rule without warning** | 29% of non-paid sessions (114 of 388) are outside India, 59 of them in the US; one such form starter was rejected and left; one buyer recovered after an error (H33, H33b, Q17, R1) | Small; low-medium | Say "Indian WhatsApp number" in the label and state where Kheelu is delivered beside the CTA, from [policies](../product/policies.md) |
| 10 | **Small frustrations: film carousel, mascot, taps near fields** | Rage clicks on "Next video" and on "Give Kheelu a poke"; dead taps on form wrappers and the consent row (Q15, Q16, R1) | Low | Carousel controls that show position and disable at the end; decorative art that does not look tappable; tap targets ≥ 44 px covering label and field, and the whole consent row toggles the tick |

## 9. Instrumentation gaps

What the new build or the founder must add or fix. New events and properties may be added; existing
names and parameters may not change ([tracking inventory](../site/tracking-inventory.md)).

| # | Gap | Evidence | Fix | Who |
|---|---|---|---|---|
| 1 | The phone sticky CTA has no `cta` value, so 14 of the 18 phone taps to the store since tagging went live (2026-09-20) are unattributed; over the whole window 25 of 29 carry no tag, 11 of them from before tagging | H14, H14c, H14g | Every CTA, including the new sticky bar, carries `data-ph-capture-attribute-cta` (the mid version used `sticky-bar`); mapping is [G10](../open-questions.md) | Builder |
| 2 | Nothing records the Razorpay sheet opening, a payment failure or an app switch; `begin_checkout` fires before the sheet opens ([checkout](../site/checkout.md)) | Q17, R1 | Add new events (for example sheet opened, payment failed with Razorpay's reason code); the file is on the must-not-change list, so it needs approval | Founder approval, then Builder |
| 3 | A rejected submit leaves only an autocaptured `submit` | Q17 | Add a form-error event carrying the field name only, never the value | Founder approval, then Builder |
| 4 | `purchase_confirmed` has no `$session_id`, so a server purchase cannot be tied to its session, source or replay except through the device id | Q38 | Optional: store the PostHog session id with the order; touches create-order, needs approval | Founder |
| 5 | Store links sent in WhatsApp chats carry no UTM and look like Direct; 2 of 5 orders created came that way | Q11, R1 | Tag chat links (for example `utm_source=whatsapp&utm_medium=chat`) with `npm run utm` | Founder / SKM (ops) |
| 6 | 217 Meta-click sessions had no UTM (208 inside WhatsApp's browser); `placement` never arrived; sources `an/ig/th/fb` instead of `facebook` | Q11, Q31 | Re-tag every ad and placement ([C5](../open-questions.md)) | Founder |
| 7 | No conversion goal, no actions, revenue analytics unset (currency USD, no revenue event); PostHog's own diagnostic flagged the missing goal (read 2026-10-11 ~01:00 UTC) | S1, S3, S4 | **Done 2026-10-11 ([D031](../decisions/D031-posthog-settings-and-replays.md))**: marketing-analytics conversion goal `purchase_confirmed` (counts as customer); revenue analytics on `purchase_confirmed.value`, static INR, base currency INR (the main session's check after applying: 2 charges, ₹998). Still open: no actions | Founder approved; main session applied |
| 8 | Team traffic counted: cohort "Internal / Test users" has 0 members; about 48 sessions from 4 repeat devices | Q24, S3 | Fill the cohort; option below | Founder ([C7](../open-questions.md)) |
| 9 | Bots were not in the test-account filter (67 bot pageviews; 54 from the Play Store checker on `/privacy`) | Q2 | **Done 2026-10-11 (D031)**: the filter adds `$virt_is_bot` is not true; the cohort 580233 rule is kept. Insights with "filter test accounts" on now drop bot events (Y9KjojeN does not use it; S5) | Founder approved; main session applied |
| 10 | Replays cover 485 of 802 human sessions (61%; 33% in WhatsApp's browser) and expire after 30 days | V16, Q36b, R1 | **Decided (D031)**: the paid-ad replays (09-19 to 09-23) expire from 2026-10-19; no export; retention unchanged | Founder |
| 11 | Authorised URLs listed only `https://kheelona.com`, so the toolbar and heatmap overlay could not open on the store | S1 | **Done 2026-10-11 (D031)**: `https://store.kheelona.com` added | Founder approved; main session applied |
| 12 | "Daily traffic & purchases" has no purchase tile; no funnel dashboard existed | S3 | Use the "Website reset —" baseline insight; Phase 8 builds the post-launch board | Done / Phase 8 |
| 13 | 23 of 37 exceptions are "Script error." with no detail; no source maps uploaded | Q21, S1 | Optional: `crossorigin` on third-party scripts where allowed; upload source maps from the new build | Architect |
| 14 | INP and product-page vitals have thin samples | H20 | Read field vitals over at least 7 days after launch | Phase 8 |

## 10. Setup audit

State as read 2026-10-11 ~01:00 UTC (S1-S4), with the changes the founder approved and the main
session applied at 12:25 UTC marked ([D031](../decisions/D031-posthog-settings-and-replays.md)).

| Item | State | Source |
|---|---|---|
| Autocapture | On (code `autocapture: true`; project not opted out) | S1; [tracking inventory §6](../site/tracking-inventory.md#6-posthog-in-the-browser) |
| Dead clicks, rage clicks, heatmaps | On, data flowing for Home, product page and store | S1, Q37, Q41 |
| Session replay | On, no sampling, no minimum length, all inputs masked, 30-day retention; **deny list works: 0 of 533 recordings contain a `/thanks` URL**. The paid-ad replays (09-19 to 09-23) expire from 2026-10-19 by decision, no export (D031) | S1, Q36, D031 |
| Web vitals | On; 1,001 `$web_vitals` events | S1, Q41 |
| Exceptions, console logs, network timing | On | S1 |
| Conversion events | Six browser funnel events plus server `purchase_confirmed` exist; **0 actions**. Read at 01:00 UTC: 0 conversion goals, revenue analytics not configured. **Since 12:25 UTC (D031)**: marketing-analytics conversion goal `purchase_confirmed` (counts as customer); revenue analytics on `purchase_confirmed.value`, static INR, base currency INR. The Web analytics dashboard's own "conversion goal" is a per-view filter in the UI, not a stored setting | S1, S3, S4, D031 |
| UTM and click-id capture | Works: built-in `utm_*` and click ids plus `utm_id` and `placement`; the edge cookie carried `utm_source` onto 1 of 2 server purchases (the other was organic Google, no UTM to carry) | Q38; [tracking inventory §9](../site/tracking-inventory.md#9-attribution-across-kheelonacom--storekheelonacom) |
| Cross-host sessions | One session spans both hosts (40 sessions did) | Q5 |
| Reverse proxy | Healthy (its health warning resolved 2026-09-20) | S2 |
| Installation health | **0 active issues**; 2 resolved (reverse proxy, authorised URLs); 7 onboarding tasks complete. The MCP does not expose the UI's "x/7" label, so "7/7" ([C7](../open-questions.md)) is consistent with this but not read from the screen | S1, S2 |
| "Internal / Test users" cohort | **0 members** | S3 |
| Bot handling | PostHog flags bots per event. Read at 01:00 UTC, the test filter did not exclude them; **since 12:25 UTC (D031)** it adds `$virt_is_bot` is not true, beside the cohort 580233 rule | Q2, S1, D031 |
| Authorised URLs | `https://kheelona.com`; **`https://store.kheelona.com` added 12:25 UTC (D031)** | S1, D031 |
| Dashboards and insights | "Your starter dashboard" and "Daily traffic & purchases" (pageviews and visitors only); 10 template insights; 1 added by this audit | S3 |
| Meta Ads warehouse source | Healthy, syncs every 6 h | S4 |
| GeoIP | Works (India 84.9%) | Q33 |
| PostHog's own suggestions | "Configure at least one conversion goal" (warning, read before D031 set one; not re-read). It also guesses `utm_source=chatgpt.com` is "OpenAI Ads"; it is organic ChatGPT referral | S4 |

## 11. Devices, browsers and screen sizes for QA

Shares are of human sessions in the window (Q10, Q22, Q22b, Q22c, Q23). "Not paid" is the steadier
picture without ads.

**Phone browsers (610 phone sessions; not paid 200):**

| Rank | Browser | All phone | Not paid |
|---|---|---|---|
| 1 | WhatsApp in-app browser (Android 216, iOS 2) | 35.7% | 5.0% |
| 2 | Chrome on Android | 31.8% | 43.0% |
| 3 | Safari on iPhone | 12.0% | 36.0% |
| 4 | Instagram in-app (Android 40, iOS 5) | 7.4% | 4.5% |
| 5 | Threads in-app (Android) | 5.2% | 0% |
| 6 | Facebook and Facebook Lite in-app (Android) | 3.1% | 0.5% |
| 7 | Chrome on iPhone | 2.1% | 6.5% |
| 8 | Samsung Internet | 1.8% | 2.0% |

Phone OS: Android 84.4% / iOS 15.6% overall; **55% / 45% without ads**. iPhones run iOS 18
(84 sessions) or iOS 26 (9).

**Phone makers** (Android hides the model in 233 of 515 Android sessions; prefix-to-maker mapping is
our reading of model codes): Samsung 61, OPPO/OnePlus 57, vivo/iQOO 46, realme 27,
Xiaomi/Redmi/POCO 25, Motorola 17, Nothing 12, Transsion (itel etc.) 6, Pixel 3.

**Phone viewports (CSS px; share of phone sessions; not-paid count):** 360 wide 31.3% (37; median
height 666, **minimum 588**), 384 14.4% (11), 392 12.0% (15), 402 5.4% (33; median height 714),
411 4.8% (17; 778), 393 3.4% (14), 390 1.8% (11), and **324-325 wide 3.3%** (20 sessions).

**Laptop (187 sessions):** Chrome 88% (Mac 95, Windows 48, Linux 22), Edge 4%, Firefox 3%, Brave 2%,
Safari 2%. Width bands: under 1280 18.7%, 1280-1365 8.0%, **1366-1439 1.6%**, 1440-1535 31.6%,
1536-1919 17.6%, 1920 and up 22.5%. Top exact widths: 1920×1080 17.6%, 1440×749 13.4%, 1512×861
10.7%, 1536×730 6.4%, 1280×597 5.9%, 1470×832 5.3%.

**Recommended QA matrix (changes to the brief's defaults in bold):**
- Phones: 360 × 640, **360 × 590** (short in-app browser), 390 × 670 and 393 × 695 (iPhone),
  **402 × 714** (current iPhone Pro in Safari), 412 × 780, **324 × 566** (the narrowest width with
  more than one session; one session reported 320 and 7 reported 0, V20: no sideways scroll).
- Phone browsers, in order: Chrome Android, **WhatsApp's in-app browser on Android**, Safari iOS,
  **Instagram's in-app browser on Android and iOS**, Chrome iOS, Samsung Internet. Run the Razorpay
  sandbox sheet in the in-app browsers too (issue 2).
- Laptops: 1440 × 800, 1920 × 1080, **1536 × 730**, **1280 × 600** (short screens), 1512 × 860.
  **Drop 1366 as a default**: under 2% of laptop sessions here.

## 12. What this audit could not see

- **Before 2026-09-19**: no PostHog data; seasonality over 12 months is impossible. GA4 and Search
  Console exports are requested as [C11](../open-questions.md).
- **Replay video**: timelines and metadata only (section 6).
- **Payment attempts inside Razorpay**: PostHog cannot tell a failed UPI attempt from an abandoned
  sheet; Razorpay's dashboard can (question returned to the orchestrator).
- **Team traffic**: not separable until the cohort is filled; about 6% of sessions (48 sessions on
  the 4 devices with 10 or more sessions each, against 802; Q24).
- **WhatsApp conversations** from the Click-to-WhatsApp campaign (Meta's warehouse rows report 28
  `onsite_conversion.total_messaging_connection` actions, 09-18 to 09-23; Q30b note, V21) and the
  ₹4,500 balance payments: no tool records them
  ([checkout, balance step](../site/checkout.md#the-balance-step-4500)).
- **Exceptions and frustration counts in human sessions.** Exceptions (Q21, every event) and dead,
  rage and swipe totals (Q41, non-bot events, internal included) were not recomputed in human
  sessions. **Phase 8 prerequisite:** recompute them in the human-session scope before the
  post-launch reports compare against them.
- **Meta Ads Manager itself**: figures come from PostHog's warehouse copy of the ad account.

## 13. Verification and corrections

An independent verifier rebuilt sessions from the events table (each session's first `$pageview`)
and re-derived about 120 values over the same window (V0-V22,
[verification checks](../raw/posthog/2026-10-10-verification-checks.sql)). **The baseline table,
the device split, every funnel step, the source table and the evidence for issues 1 to 3 matched
exactly.** Rows 1 to 9 were corrected on 2026-10-10, all from V queries already run; none changes a
ranking or a must-include:

| # | Where | Was | Now | Query |
|---|---|---|---|---|
| 1 | Section 5, scroll depth | Headed as human sessions; counted all non-bot views | Scope labelled; human-session view counts added; product page on the laptop is a 2% median (n 29), not 23% (n 35) | V12 |
| 2 | Section 2, recordings | "533 (61% of human sessions)" | 533 recordings; 485 of 802 human sessions (61%) have one | V16 |
| 3 | Sections 2 and 7, vitals | Under a "human sessions, internal excluded" header | Labelled as non-bot events; "store host" and "store page" named apart; store host phone LCP in human sessions 3,308 ms (n 30) | V9 |
| 4 | Section 3, landings | Definition unstated | Session entry stated; first-pageview figures reconciled (7 sessions differ) | Q12, V4 |
| 5 | Section 5 and issue 6 | Home-only 30 of 656 (4.6%) | 30 of 660 (4.5%): 4 tablet sessions were dropped | V15 |
| 6 | Section 3 | "No paid landing since 2026-09-23" | One Meta-click session with no UTM on 2026-10-08 | V8, Q9 |
| 7 | Section 3 and issue 1 | ₹2,416 (truncated) beside ₹2,473 (rounded up) | Nearest rupee everywhere: ₹2,417 and ₹2,472 | V7, V21 |
| 8 | Section 2 | "both token tier" | Stored `tier` is `"launch"`; ₹998 = 2 × ₹499 | V6, Q38 |
| 9 | Sections 3, 8, 12 | "28 messaging connections", "PlayOS drew 24 sessions" and "about 12 sessions a day" carried no query | Cited (Q30b, V21; Q32, V22; Q9). The daily rate is about 13, not 12: the week of 10-05 has 6 days in the window | Q9 |
| 10 | Section 5, scroll table; issues 1, 4, 5 | Non-bot views (Q19, Q19b): Home phone 378 / not paid 82 / paid 296 / laptop 145 views; product laptop 35 views, median 23%; store phone 40 views, 47%, 50 s; store laptop 28 views, 77%, 18 s; Home laptop 16%, 53 s | Human sessions, every cell: Home phone 373 / 79 / 294 / laptop 132 views; product laptop 29 views, median 2%; store phone 33 views, 46%, 34 s; store laptop 22 views, 69%, 17 s; Home laptop 15%, 41 s; V12 reproduced exactly | H19, H19b |
| 11 | Sections 2 and 7, vitals; issues 7, 8 | Non-bot events (Q20, Q39): store page phone LCP 3,244 ms (31), FCP 3,245 ms (52); store page laptop FCP 2,896 ms (21); Home phone FCP 2,340 ms (362); store host phone LCP 3,292 ms (32) | Events in human sessions: store page phone LCP 3,284 ms (29), FCP 3,368 ms (49); laptop FCP 2,842 ms (20); Home phone FCP 2,308 ms (333); store host phone LCP 3,308 ms (30), V9 reproduced. Every other p75 shown in sections 2 and 7 is unchanged (some n smaller); no verdict changes | H20, H39 |
| 12 | "In one screen" item 7 | Store page phone LCP and FCP "3.2 s" | 3.3 s and 3.4 s | H20 |
| 13 | Section 5 CTAs, "In one screen" item 6, issue 5, gap 1 | "Sticky elements produced 22 of 29 phone taps"; the bar's missing tag explains "25 of 29 unattributed"; "`navbar-mobile` never tapped" | Same counts in human sessions. Fixed elements: 22 taps in 12 sessions, but 8 are one session tapping the phone menu's "Pre-order Kheelu" 8 times in 3 s on 09-20; the guide's sticky bar: 14 taps in 11 sessions. All 11 other untagged phone taps, and both untagged laptop taps, predate the first tagged click (2026-09-20 17:35 UTC); since then the bar gave 14 of 18 phone taps and `navbar-mobile` was never tapped | H14-H14g |
| 14 | Section 3, countries; issue 9 | Q33 checked the bot flag on pageviews only | Same figures under the full human-session definition (India 84.9%, US 7.6%, 114 of 388 non-paid outside India, 59 US); non-paid shares added | H33, H33b |
| 15 | Sections 1, 2, 7, 12 | "Scope exception" wording and the open recompute bullet | Removed; the figures that still have a wider scope are named in section 1 and labelled in section 2; the Q21 and Q41 recompute stays in section 12 as a Phase 8 prerequisite | H0 |
| 16 | Section 5, "In one screen" item 6, issue 5 | Scroll shares with no coverage stated | Scoped to measured views: 373 of 607 phone Home pageviews (61.4%) and 33 of 68 phone store pageviews (48.5%) sent a scroll report | W2c |
| 17 | Section 3, countries | US count unqualified | Caveat: 19 of 61 US sessions look automated and were not bot-flagged (inference) | W5c |
| 18 | Section 5, CTAs | Phone untagged and fixed-element taps given only with the `/privacy` session | Also without it: 21 taps in 17 sessions, 17 untagged (14 sessions), 14 fixed (11 sessions, all the guide's bar) | H14h |

Rows 10 to 15 come from the human-session recompute of 2026-10-11
([recomputes](../raw/posthog/2026-10-11-human-session-recomputes.json)), run once the connector
was back. **No ranking in section 8 and no "must include" changes**: every issue keeps its evidence
direction and size; issue 5's evidence gets stronger (14 of 18 phone taps since tagging went live).
Rows 16 and 17 cite the verifier's independent recompute of the same day
([recompute verification](../raw/posthog/2026-10-11-recompute-verification.sql)), which matches
rows 10 to 14 on every cell; row 18 is [H14h](../raw/posthog/2026-10-11-cta-without-privacy-session.json).
The setup changes of 2026-10-11 (D031) are recorded in sections 9 and 10, not here.

Also fixed: the narrowest phone width (324 is the narrowest with more than one session; one
session reported 320, V20), and "In one screen" item 7, which mixed host-level and
page-level vitals.

## Appendix: query index

Shared definitions, used inside the queries below (exact text):

```sql
-- window on events
timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
-- human, non-internal session (in the HAVING of a per-session subquery)
pvs > 0 AND is_bot = 0
AND NOT (coalesce(ref,'') IN ('localhost:3456','127.0.0.1:3456') OR coalesce(ref,'') LIKE '%vercel.app')
-- where is_bot = max(properties.$virt_is_bot = true), ref = any(session.$entry_referring_domain)
-- H queries (2026-10-11): event-level queries keep only events with
--   properties.$session_id IN (the Q34 per-session subquery with the HAVING above)
-- paid flag
if(coalesce(any(session.$entry_utm_medium),'') = 'paid'
   OR (coalesce(any(session.$entry_fbclid),'') != '' AND coalesce(any(session.$entry_utm_source),'') = ''), 1, 0)
-- store page step
event = '$pageview' AND properties.$host = 'store.kheelona.com' AND properties.$pathname NOT LIKE '/thanks%'
```

| Query | What | Raw file (exact HogQL and result) |
|---|---|---|
| Q1-Q5, Q9, Q24, Q33, Q34, Q40 | Window, bots, referrers, channels, cross-host, weekly, repeat devices, country (Q33 confirmed by H33), baseline, device split after ads | [traffic-overview](../raw/posthog/2026-10-10-traffic-overview.json) |
| Q6-Q8, Q17, Q25, Q35, Q38 | Funnels by source and device, native funnel, validation, purchasers, tap-to-store time, purchase vs server | [funnel](../raw/posthog/2026-10-10-funnel.json) |
| Q12-Q14b, Q27, Q32 | Landing pages, CTA clicks and untagged sticky CTA (Q13-Q14b superseded by H13-H14b, same counts), films, product page vs Home | [landing-and-cta](../raw/posthog/2026-10-10-landing-and-cta.json) |
| Q10, Q11, Q22-Q23b | Devices, browsers, in-app browsers, viewports, phone makers | [devices-qa](../raw/posthog/2026-10-10-devices-qa.json) |
| Q15, Q16, Q19, Q19b, Q37, Q41 | Rage and dead clicks, scroll depth (Q19, Q19b superseded by H19, H19b), heatmaps, window totals | [frustration-scroll-heatmaps](../raw/posthog/2026-10-10-frustration-scroll-heatmaps.json) |
| Q20, Q21, Q39 | Web vitals (Q20, Q39 superseded by H20, H39), exceptions | [web-vitals-errors](../raw/posthog/2026-10-10-web-vitals-errors.json) |
| H0, H13-H14g, H19, H19b, H20, H33, H33b, H39 | Human-session recomputes (2026-10-11): session-set check, CTA taps with containers, sessions and tagging date, scroll depth, web vitals, countries | [human-session-recomputes](../raw/posthog/2026-10-11-human-session-recomputes.json) |
| H14h, S5 | Store-link taps without the one `/privacy` session; baseline funnel Y9KjojeN's test-account setting after D031 | [cta-without-privacy-session](../raw/posthog/2026-10-11-cta-without-privacy-session.json) |
| W0-W6d | The verifier's independent human-session recompute (2026-10-11), incl. scroll-report coverage (W2c) and US sessions (W5c) | [recompute-verification](../raw/posthog/2026-10-11-recompute-verification.sql) |
| Q30, Q30b, Q31 | Meta spend, clicks, landing page views, paid sessions per day | [paid-meta](../raw/posthog/2026-10-10-paid-meta.json) |
| Q36, Q36b, R1 | Recordings, coverage, the replay review | [replays](../raw/posthog/2026-10-10-replays.json) |
| S1-S4 | Project settings, health checks, dashboards and cohorts, PostHog's diagnostic | [setup-audit](../raw/posthog/2026-10-10-setup-audit.json) |
| V0-V22 | The verifier's independent checks: sessions rebuilt from each session's first `$pageview`, plus human-session scroll (V12) and vitals (V9), recordings in human sessions (V16), Meta totals (V7, V21), PlayOS sessions (V22) | [verification-checks](../raw/posthog/2026-10-10-verification-checks.sql) |

Related: [tracking inventory](../site/tracking-inventory.md) · [checkout](../site/checkout.md) ·
[URL map](../site/url-map.md) · [engineering lessons §5](../engineering/lessons.md#5-tracking-how-to-verify-it-and-how-not-to)
