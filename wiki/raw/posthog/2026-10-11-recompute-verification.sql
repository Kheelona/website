-- Independent recompute (adversarial verifier) of scroll depth, web vitals, store-link taps and country
-- PostHog project 617632 (project timezone UTC), read-only via the PostHog MCP execute-sql tool.
-- Run 2026-10-11 ~11:40-12:10 UTC. Governed metric catalog consulted first: empty (0 metrics), so every
-- figure below is a one-off derivation, not a saved definition.
-- Window everywhere: timestamp >= '2026-09-19 00:00:00' AND < '2026-10-11 00:00:00' UTC
--   (data in window runs 2026-09-19 10:52 to 2026-10-10 23:02 UTC, see W0).
-- Written without reading the parallel analyst's output. Only V9 and V12 (2026-10-10-verification-checks.sql)
-- were read, as anchors.
-- The queries below are the exact HogQL that was run. Only whitespace and line breaks were changed for reading.
--
-- Shared session definition ("S", rebuilt from each session's FIRST $pageview, not from session.$entry_*):
--   human  = at least one $pageview, no event in the session flagged $virt_is_bot = true, and the first
--            pageview's $referring_domain is not localhost:3456, 127.0.0.1:3456 or *vercel.app
--   paid   = first pageview utm_medium = 'paid', OR first pageview fbclid != '' AND first pageview utm_source = ''
--   device = $device_type on the counted event (scroll, vitals, tap); session device = first pageview's (W1, W5)
--   phone = 'Mobile', laptop = 'Desktop'; tablets (5 sessions) are excluded from the device cuts.
-- Pages: Home = kheelona.com + '/'; product page = kheelona.com + '/products/kheelu'; store page = store.kheelona.com + '/'.
-- Medians and p75: quantile() (ClickHouse reservoir sampling, interpolated; exact for n < 8192). quantileExact()
-- (no interpolation) is shown alongside where the two could differ.
-- Aggregates only. No person-level data, emails, phone numbers or IPs.


-- ===========================================================================================================
-- W0  Probe: event totals and property presence in the window (all events, no session filter)
-- ===========================================================================================================
SELECT
  event,
  count() AS n,
  countIf(properties.$virt_is_bot = true) AS bot_flagged,
  countIf(coalesce(properties.$session_id,'') = '') AS no_sid,
  countIf(properties.utm_medium IS NOT NULL AND properties.utm_medium != '') AS has_utm_medium,
  countIf(properties.$prev_pageview_max_scroll_percentage IS NOT NULL) AS has_prev_scroll,
  countIf(properties.$prev_pageview_pathname IS NOT NULL) AS has_prev_path,
  min(timestamp) AS first_ts,
  max(timestamp) AS last_ts
FROM events
WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
GROUP BY event
ORDER BY n DESC
-- Result (event | n | bot_flagged | no_sid | has_utm_medium | has_prev_scroll | has_prev_path | first | last):
--   $pageview     1159 | 67 | 0 | 245 | 150 | 150 | 2026-09-19 11:04:39 | 2026-10-10 23:02:02
--   $web_vitals   1001 |  0 | 0 | 125 |   0 |   0 | 2026-09-19 11:07:26 | 2026-10-10 22:43:29
--   $pageleave     875 |  3 | 0 | 161 | 608 | 609 | 2026-09-19 10:52:42 | 2026-10-10 09:50:47
--   $autocapture   750 |  0 | 0 |  52 |   0 |   0 | 2026-09-19 11:07:31 | 2026-10-10 22:40:35
--   $dead_click 89, $dead_swipe 61, $exception 37, $rageclick 13, preorder_form_started 11, preorder_start 6,
--   begin_checkout 6, preorder_dismissed 3, purchase 2, purchase_confirmed 2 (server, no session id),
--   preorder_address_saved 2, $recording_observed 2, $proxy_smoke_test 2, proxy_geo_check 2.
-- Schema notes (read-data-schema, 2026-10-11): $pageleave is NOT listed in the taxonomy but exists (875 events).
--   utm_medium is NOT in the $pageview taxonomy list but is present on 245 pageviews.
--   $prev_pageview_max_scroll_percentage is a 0-1 fraction; $prev_pageview_duration is in seconds.
--   CTA tag: the autocapture property is `cta` (properties.cta). Neither `data-ph-capture-attribute-cta` nor
--   `attr__data-ph-capture-attribute-cta` exists as a property name; the attribute appears inside elements_chain
--   and matches properties.cta one for one (W4a).


-- ===========================================================================================================
-- W1  Session base: human sessions from first $pageview, paid split, session device (anchor to V1)
-- ===========================================================================================================
SELECT
  count() AS sessions,
  countIf(p = 1) AS paid,
  countIf(p = 0) AS not_paid,
  countIf(dev = 'Mobile') AS phone,
  countIf(dev = 'Mobile' AND p = 1) AS phone_paid,
  countIf(dev = 'Mobile' AND p = 0) AS phone_not_paid,
  countIf(dev = 'Desktop') AS laptop,
  countIf(dev = 'Tablet') AS tablet,
  countIf(dev NOT IN ('Mobile','Desktop','Tablet')) AS other_dev
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') AS um,
    argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') AS us,
    argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') AS fb,
    if(um = 'paid' OR (fb != '' AND us = ''), 1, 0) AS p,
    argMinIf(coalesce(properties.$device_type, ''), timestamp, event = '$pageview') AS dev
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
)
-- Result: sessions 802 | paid 414 | not_paid 388 | phone 610 (paid 410, not paid 200) | laptop 187 | tablet 5 | other 0
-- = V1 totals (802 / 414 paid / 388 not paid).


-- ===========================================================================================================
-- W2a  Scroll depth by page and device, human sessions
--      Scroll reports = $pageview or $pageleave carrying $prev_pageview_max_scroll_percentage;
--      page = host of the reporting event + $prev_pageview_pathname (the page being left).
--      reach N% = share of reported views with max scroll >= N/100. Time = $prev_pageview_duration (s).
-- ===========================================================================================================
SELECT
  multiIf(e.host = 'kheelona.com' AND e.path = '/', 'Home',
          e.host = 'kheelona.com' AND e.path = '/products/kheelu', 'Product',
          e.host = 'store.kheelona.com' AND e.path = '/', 'Store', 'other') AS page,
  e.dev AS device,
  count() AS views,
  round(quantile(0.5)(e.sc) * 100, 1) AS median_scroll_pct,
  round(quantileExact(0.5)(e.sc) * 100, 1) AS median_scroll_exact_pct,
  round(countIf(e.sc >= 0.25) / count() * 100, 1) AS reach25_pct,
  round(countIf(e.sc >= 0.5) / count() * 100, 1) AS reach50_pct,
  round(countIf(e.sc >= 0.9) / count() * 100, 1) AS reach90_pct,
  round(quantile(0.5)(e.dur), 1) AS median_time_s,
  round(quantileExact(0.5)(e.dur), 1) AS median_time_exact_s,
  countIf(e.dev != s.dev) AS dev_differs_from_session,
  countIf(e.evt = '$pageleave') AS from_pageleave
FROM (
  SELECT
    properties.$session_id AS sid,
    event AS evt,
    properties.$host AS host,
    properties.$prev_pageview_pathname AS path,
    coalesce(properties.$device_type, '') AS dev,
    toFloat(properties.$prev_pageview_max_scroll_percentage) AS sc,
    toFloat(properties.$prev_pageview_duration) AS dur
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event IN ('$pageview', '$pageleave')
    AND properties.$prev_pageview_max_scroll_percentage IS NOT NULL
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.$device_type, ''), timestamp, event = '$pageview') AS dev
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
WHERE page != 'other'
GROUP BY page, device
ORDER BY page, device
-- Result (page | device | views | median scroll % [exact] | reach25 | reach50 | reach90 | median time s [exact] | dev differs | from $pageleave):
--   Home    | Desktop | 132 | 14.7 [15.2] | 40.2 | 28.0 | 22.0 | 41.2 [42.4] | 0 |  94
--   Home    | Mobile  | 373 |  0.0 [0.0]  |  9.7 |  6.2 |  2.7 |  9.2 [9.2]  | 1 | 350
--   Home    | Tablet  |   2 |  8.9 [17.9] |  0.0 |  0.0 |  0.0 | 77.7        | 0 |   2
--   Product | Desktop |  29 |  2.4 [2.4]  | 41.4 | 24.1 |  0.0 |  9.6 [9.6]  | 0 |  14
--   Product | Mobile  |  21 | 30.3 [30.3] | 57.1 | 19.0 |  9.5 | 32.5 [32.5] | 0 |  11
--   Store   | Desktop |  22 | 69.0 [71.8] | 59.1 | 54.5 | 36.4 | 16.8 [17.7] | 0 |  22
--   Store   | Mobile  |  33 | 46.3 [46.3] | 60.6 | 45.5 | 24.2 | 34.3 [34.3] | 0 |  33
--   Store   | Tablet  |   1 |  0.1        |  0.0 |  0.0 |  0.0 | 61.7        | 0 |   1
-- ANCHORS: Home phone 373 views, 9.7% reach 25% -> REPRODUCED. Product laptop 29 views, median 2% -> REPRODUCED (2.4%).
-- One Home "Mobile" scroll view sits in a session whose first pageview had another device type (see W6b).


-- ===========================================================================================================
-- W2b  Home scroll depth by device and paid flag, human sessions
-- ===========================================================================================================
SELECT
  e.dev AS device,
  s.p AS paid,
  count() AS views,
  round(quantile(0.5)(e.sc) * 100, 1) AS median_scroll_pct,
  round(quantileExact(0.5)(e.sc) * 100, 1) AS median_scroll_exact_pct,
  round(countIf(e.sc >= 0.25) / count() * 100, 1) AS reach25_pct,
  round(countIf(e.sc >= 0.5) / count() * 100, 1) AS reach50_pct,
  round(countIf(e.sc >= 0.9) / count() * 100, 1) AS reach90_pct,
  round(quantile(0.5)(e.dur), 1) AS median_time_s,
  round(quantileExact(0.5)(e.dur), 1) AS median_time_exact_s,
  uniqExact(e.sid) AS sessions
FROM (
  SELECT
    properties.$session_id AS sid,
    properties.$host AS host,
    properties.$prev_pageview_pathname AS path,
    coalesce(properties.$device_type, '') AS dev,
    toFloat(properties.$prev_pageview_max_scroll_percentage) AS sc,
    toFloat(properties.$prev_pageview_duration) AS dur
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event IN ('$pageview', '$pageleave')
    AND properties.$prev_pageview_max_scroll_percentage IS NOT NULL
    AND coalesce(properties.$session_id, '') != ''
    AND properties.$host = 'kheelona.com'
    AND properties.$prev_pageview_pathname = '/'
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') AS um,
    argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') AS us,
    argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') AS fb,
    if(um = 'paid' OR (fb != '' AND us = ''), 1, 0) AS p
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
GROUP BY device, paid
ORDER BY device, paid
-- Result (device | paid | views | median scroll % [exact] | reach25 | reach50 | reach90 | median time s [exact] | sessions):
--   Desktop | 0 | 130 | 15.7 [16.3] | 40.8 | 28.5 | 22.3 | 43.0 [43.6] | 107
--   Desktop | 1 |   2 |  0.0        |  0.0 |  0.0 |  0.0 | 10.5 [10.8] |   2
--   Mobile  | 0 |  79 | 11.8 [11.8] | 34.2 | 21.5 |  8.9 | 26.3 [26.3] |  65
--   Mobile  | 1 | 294 |  0.0 [0.0]  |  3.1 |  2.0 |  1.0 |  7.8 [7.8]  | 273
--   Tablet  | 0 |   1 ; Tablet | 1 | 1 (ignored)
-- Same as the V12 detail (paid 294: 3.1%, median 7.8 s; not paid 79: 34.2%).


-- ===========================================================================================================
-- W2c  Scroll-report coverage: page views vs scroll reports per page and device, human sessions
--      (a view with no $pageleave and no following SPA $pageview has no scroll report and is absent from W2a/W2b)
--      NOTE: an earlier version of this check counted a $pageview carrying prev_* only as a scroll report, not
--      also as a view of the new page; it was wrong and has been discarded. This is the corrected query.
-- ===========================================================================================================
SELECT
  e.page AS page,
  e.dev AS device,
  sum(e.pv) AS pageviews,
  sum(e.sc) AS scroll_reports,
  round(sum(e.sc) / sum(e.pv) * 100, 1) AS coverage_pct,
  uniqExactIf(e.sid, e.pv = 1) AS sessions_viewing
FROM (
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.$device_type, '') AS dev,
    multiIf(properties.$host = 'kheelona.com' AND properties.$pathname = '/', 'Home',
            properties.$host = 'kheelona.com' AND properties.$pathname = '/products/kheelu', 'Product',
            properties.$host = 'store.kheelona.com' AND properties.$pathname = '/', 'Store', 'other') AS page,
    1 AS pv,
    0 AS sc
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$pageview'
    AND coalesce(properties.$session_id, '') != ''
  UNION ALL
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.$device_type, '') AS dev,
    multiIf(properties.$host = 'kheelona.com' AND properties.$prev_pageview_pathname = '/', 'Home',
            properties.$host = 'kheelona.com' AND properties.$prev_pageview_pathname = '/products/kheelu', 'Product',
            properties.$host = 'store.kheelona.com' AND properties.$prev_pageview_pathname = '/', 'Store', 'other') AS page,
    0 AS pv,
    1 AS sc
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event IN ('$pageview', '$pageleave')
    AND properties.$prev_pageview_max_scroll_percentage IS NOT NULL
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
WHERE e.page != 'other' AND e.dev IN ('Mobile', 'Desktop')
GROUP BY page, device
ORDER BY page, device
-- Result (page | device | pageviews | scroll reports | coverage % | sessions viewing):
--   Home    | Desktop | 170 | 132 | 77.6 | 146
--   Home    | Mobile  | 607 | 373 | 61.4 | 540
--   Product | Desktop |  39 |  29 | 74.4 |  35
--   Product | Mobile  |  28 |  21 | 75.0 |  26
--   Store   | Desktop |  31 |  22 | 71.0 |  28
--   Store   | Mobile  |  68 |  33 | 48.5 |  63
-- So W2 percentages describe the ~61% of Home phone views (and ~49% of store phone views) that sent a report.


-- ===========================================================================================================
-- W3a  Web vitals p75 with n, by page and device, human sessions
--      Page = $host + $pathname of the $web_vitals event. n = non-null values of that metric.
-- ===========================================================================================================
SELECT
  multiIf(e.host = 'kheelona.com' AND e.path = '/', 'Home',
          e.host = 'kheelona.com' AND e.path = '/products/kheelu', 'Product',
          e.host = 'store.kheelona.com' AND e.path = '/', 'Store', 'other') AS page,
  e.dev AS device,
  count(e.lcp) AS lcp_n,
  round(quantile(0.75)(e.lcp)) AS lcp_p75,
  round(quantileExact(0.75)(e.lcp)) AS lcp_p75_exact,
  count(e.inp) AS inp_n,
  round(quantile(0.75)(e.inp)) AS inp_p75,
  count(e.cls) AS cls_n,
  round(quantile(0.75)(e.cls), 3) AS cls_p75,
  count(e.fcp) AS fcp_n,
  round(quantile(0.75)(e.fcp)) AS fcp_p75
FROM (
  SELECT
    properties.$session_id AS sid,
    properties.$host AS host,
    properties.$pathname AS path,
    coalesce(properties.$device_type, '') AS dev,
    toFloat(properties.$web_vitals_LCP_value) AS lcp,
    toFloat(properties.$web_vitals_INP_value) AS inp,
    toFloat(properties.$web_vitals_CLS_value) AS cls,
    toFloat(properties.$web_vitals_FCP_value) AS fcp
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$web_vitals'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
WHERE page != 'other' AND e.dev IN ('Mobile', 'Desktop')
GROUP BY page, device
ORDER BY page, device
-- Result (page | device | LCP p75 ms (n) [exact] | INP p75 ms (n) | CLS p75 (n) | FCP p75 ms (n)):
--   Home    | Desktop | 1563 (84) [1608]  |  96 (46) | 0.007 (70)  | 1577 (128)
--   Home    | Mobile  | 2354 (167) [2356] | 546 (38) | 0.000 (131) | 2308 (333)
--   Product | Desktop | 2430 (11) [2640]  | 104 (13) | 0.007 (17)  | 2018 (14)
--   Product | Mobile  | 2075 (10) [2172]  |  36 (2)  | 0.000 (1)   | 2256 (13)
--   Store   | Desktop | 2863 (10) [2876]  |  64 (4)  | 0.000 (10)  | 2842 (20)
--   Store   | Mobile  | 3284 (29) [3284]  | 294 (14) | 0.000 (21)  | 3368 (49)
-- (CLS 0.000 = below 0.0005 after rounding.) Product-page and store-laptop cells have n <= 14: treat as indicative.


-- ===========================================================================================================
-- W3b  Web vitals p75 with n, by host and device, human sessions
-- ===========================================================================================================
SELECT
  e.host AS host,
  e.dev AS device,
  count(e.lcp) AS lcp_n,
  round(quantile(0.75)(e.lcp)) AS lcp_p75,
  round(quantileExact(0.75)(e.lcp)) AS lcp_p75_exact,
  count(e.inp) AS inp_n,
  round(quantile(0.75)(e.inp)) AS inp_p75,
  round(quantileExact(0.75)(e.inp)) AS inp_p75_exact,
  count(e.cls) AS cls_n,
  round(quantile(0.75)(e.cls), 3) AS cls_p75,
  count(e.fcp) AS fcp_n,
  round(quantile(0.75)(e.fcp)) AS fcp_p75
FROM (
  SELECT
    properties.$session_id AS sid,
    properties.$host AS host,
    coalesce(properties.$device_type, '') AS dev,
    toFloat(properties.$web_vitals_LCP_value) AS lcp,
    toFloat(properties.$web_vitals_INP_value) AS inp,
    toFloat(properties.$web_vitals_CLS_value) AS cls,
    toFloat(properties.$web_vitals_FCP_value) AS fcp
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$web_vitals'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
WHERE e.host IN ('kheelona.com', 'store.kheelona.com') AND e.dev IN ('Mobile', 'Desktop')
GROUP BY host, device
ORDER BY host, device
-- Result (host | device | LCP p75 ms (n) [exact] | INP p75 ms (n) [exact] | CLS p75 (n) | FCP p75 ms (n)):
--   kheelona.com       | Desktop | 1574 (111) [1600] |  96 (77) [96]  | 0.007 (102) | 1588 (153)
--   kheelona.com       | Mobile  | 2348 (187) [2352] | 440 (47) [480] | 0.000 (134) | 2284 (356)
--   store.kheelona.com | Desktop | 2850 (11) [2876]  |  64 (5) [64]   | 0.000 (12)  | 2824 (21)
--   store.kheelona.com | Mobile  | 3308 (30) [3316]  | 258 (18) [264] | 0.000 (23)  | 3368 (53)
-- ANCHOR: store-host phone LCP 3,308 ms (n 30) -> REPRODUCED (interpolated quantile; quantileExact gives 3,316).
-- Store host phone LCP n = 30 vs store page '/' n = 29: one store phone LCP is on another store path.


-- ===========================================================================================================
-- W4a  Probe: how store-link clicks and the CTA tag are recorded (all $autocapture, no session filter)
-- ===========================================================================================================
SELECT
  properties.$host AS host,
  properties.$event_type AS etype,
  count() AS n,
  countIf(elements_chain_href LIKE '%store.kheelona.com%') AS href_store,
  countIf(coalesce(properties.$external_click_url, '') LIKE '%store.kheelona.com%') AS ext_url_store,
  countIf(elements_chain_href LIKE '%store.kheelona.com%' OR coalesce(properties.$external_click_url, '') LIKE '%store.kheelona.com%') AS either_store,
  countIf(coalesce(properties.cta, '') != '') AS has_cta_prop,
  countIf(elements_chain LIKE '%data-ph-capture-attribute-cta%') AS chain_has_cta_attr,
  countIf(coalesce(properties.cta, '') != '' AND NOT elements_chain LIKE '%data-ph-capture-attribute-cta%') AS prop_without_chain,
  countIf(coalesce(properties.cta, '') = '' AND elements_chain LIKE '%data-ph-capture-attribute-cta%') AS chain_without_prop
FROM events
WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
  AND event = '$autocapture'
GROUP BY host, etype
ORDER BY n DESC
-- Result (host | type | n | href_store | ext_url_store | either | cta prop | chain cta attr | prop w/o chain | chain w/o prop):
--   kheelona.com       | click  | 569 | 53 | 53 | 53 | 26 | 26 | 0 | 0
--   store.kheelona.com | click  | 121 |  0 |  0 |  0 |  0 |  0 | 0 | 0
--   store.kheelona.com | change |  50 |  0 |  0 |  0 |  0 |  0 | 0 | 0
--   store.kheelona.com | submit |  10 |  0 |  0 |  0 |  0 |  0 | 0 | 0
-- properties.cta and the elements_chain attribute are interchangeable; href and $external_click_url agree.


-- ===========================================================================================================
-- W4b  Taps on links to store.kheelona.com from kheelona.com, by device and cta value, human sessions
-- ===========================================================================================================
SELECT
  e.dev AS device,
  if(e.cta = '', '(untagged)', e.cta) AS cta_value,
  count() AS taps,
  uniqExact(e.sid) AS sessions,
  countIf(e.chain LIKE '%fixed%') AS chain_has_fixed
FROM (
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.$device_type, '') AS dev,
    coalesce(properties.cta, '') AS cta,
    elements_chain AS chain
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$autocapture'
    AND properties.$event_type = 'click'
    AND properties.$host = 'kheelona.com'
    AND elements_chain_href LIKE '%store.kheelona.com%'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
GROUP BY device, cta_value
ORDER BY device, taps DESC
-- Result (device | cta | taps | sessions | chain contains 'fixed'):
--   Desktop | navbar      | 11 | 10 | 0
--   Desktop | finale      |  5 |  4 | 0
--   Desktop | product-top |  3 |  2 | 0
--   Desktop | hero        |  3 |  2 | 0
--   Desktop | (untagged)  |  2 |  2 | 0
--   Mobile  | (untagged)  | 25 | 15 | 22
--   Mobile  | finale      |  2 |  1 | 0
--   Mobile  | hero        |  2 |  2 | 0
-- All 53 store-link clicks in the window (W4a) are in human sessions.


-- ===========================================================================================================
-- W4c  Store-link taps: per-device totals (distinct sessions) and what the untagged taps are
-- ===========================================================================================================
SELECT
  e.dev AS device,
  count() AS taps,
  uniqExact(e.sid) AS sessions,
  countIf(e.cta = '') AS untagged_taps,
  uniqExactIf(e.sid, e.cta = '') AS untagged_sessions,
  countIf(e.cta != '') AS tagged_taps,
  uniqExactIf(e.sid, e.cta != '') AS tagged_sessions,
  groupUniqArrayIf(e.txt, e.cta = '') AS untagged_texts,
  groupUniqArrayIf(e.tag, e.cta = '') AS untagged_tags
FROM (
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.$device_type, '') AS dev,
    coalesce(properties.cta, '') AS cta,
    coalesce(properties.$el_text, '') AS txt,
    extract(elements_chain, '^([a-z0-9]+)') AS tag
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$autocapture'
    AND properties.$event_type = 'click'
    AND properties.$host = 'kheelona.com'
    AND elements_chain_href LIKE '%store.kheelona.com%'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
GROUP BY device
ORDER BY device
-- Result (device | taps | sessions | untagged taps | untagged sessions | tagged taps | tagged sessions | untagged text | tag):
--   Desktop | 24 | 19 |  2 |  2 | 22 | 17 | ['Pre-order Kheelu'] | ['a']
--   Mobile  | 29 | 18 | 25 | 15 |  4 |  3 | ['Pre-order Kheelu'] | ['a']


-- ===========================================================================================================
-- W4d  Store-link taps by the page tapped on, human sessions
--      (WITH TOTALS returned no totals row through the MCP; totals are in W4e)
-- ===========================================================================================================
SELECT
  e.path AS page_path,
  count() AS taps,
  uniqExact(e.sid) AS sessions,
  countIf(e.dev = 'Mobile') AS phone_taps,
  countIf(e.dev = 'Desktop') AS laptop_taps,
  countIf(e.cta = '') AS untagged_taps
FROM (
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.$device_type, '') AS dev,
    coalesce(properties.cta, '') AS cta,
    coalesce(properties.$pathname, '') AS path
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$autocapture'
    AND properties.$event_type = 'click'
    AND properties.$host = 'kheelona.com'
    AND elements_chain_href LIKE '%store.kheelona.com%'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
GROUP BY page_path WITH TOTALS
ORDER BY taps DESC
-- Result (path | taps | sessions | phone | laptop | untagged):
--   /                                      | 31 | 28 | 14 | 17 | 13
--   /products/kheelu                       |  8 |  6 |  5 |  3 |  5
--   /privacy                               |  8 |  1 |  8 |  0 |  8   <- one phone session, 8 untagged taps
--   /stories/how-children-learn-by-talking |  2 |  1 |  2 |  0 |  0
--   /playos 1 | 1 | 0 | 1 | 0 ; /stories 1 | 1 | 0 | 1 | 0 ; /team 1 | 1 | 0 | 1 | 1 ; /safety 1 | 1 | 0 | 1 | 0


-- ===========================================================================================================
-- W4e  Store-link taps: all-device totals, human sessions
-- ===========================================================================================================
SELECT
  count() AS taps,
  uniqExact(e.sid) AS sessions,
  uniqExactIf(e.sid, e.cta = '') AS untagged_sessions,
  uniqExactIf(e.sid, e.path != '/privacy') AS sessions_excl_privacy,
  countIf(e.path != '/privacy') AS taps_excl_privacy
FROM (
  SELECT
    properties.$session_id AS sid,
    coalesce(properties.cta, '') AS cta,
    coalesce(properties.$pathname, '') AS path
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND event = '$autocapture'
    AND properties.$event_type = 'click'
    AND properties.$host = 'kheelona.com'
    AND elements_chain_href LIKE '%store.kheelona.com%'
    AND coalesce(properties.$session_id, '') != ''
) AS e
INNER JOIN (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
) AS s ON e.sid = s.sid
-- Result: taps 53 | sessions 37 | untagged sessions 17 | sessions excluding /privacy 36 | taps excluding /privacy 45
-- Untagged taps all devices = 27 (W4c: 2 + 25).


-- ===========================================================================================================
-- W5a  Country of the session (first pageview's $geoip_country_code), human sessions
-- ===========================================================================================================
SELECT
  count() AS sessions,
  countIf(cc = 'IN') AS india,
  round(countIf(cc = 'IN') / count() * 100, 1) AS india_pct,
  countIf(cc != 'IN' AND cc != '') AS outside_india,
  countIf(cc = '') AS no_country,
  countIf(cc = 'US') AS us,
  countIf(p = 0) AS np_sessions,
  countIf(p = 0 AND cc = 'IN') AS np_india,
  round(countIf(p = 0 AND cc = 'IN') / countIf(p = 0) * 100, 1) AS np_india_pct,
  countIf(p = 0 AND cc != 'IN' AND cc != '') AS np_outside_india,
  countIf(p = 0 AND cc = 'US') AS np_us,
  countIf(p = 1) AS paid_sessions,
  countIf(p = 1 AND cc = 'IN') AS paid_india,
  countIf(p = 1 AND cc != 'IN' AND cc != '') AS paid_outside_india,
  countIf(p = 1 AND cc = 'US') AS paid_us,
  countIf(cc_any_nonin = 1 AND cc = 'IN') AS india_first_but_other_later
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') AS um,
    argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') AS us_src,
    argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') AS fb,
    if(um = 'paid' OR (fb != '' AND us_src = ''), 1, 0) AS p,
    argMinIf(coalesce(properties.$geoip_country_code, ''), timestamp, event = '$pageview') AS cc,
    max(if(event = '$pageview' AND coalesce(properties.$geoip_country_code, '') NOT IN ('IN', ''), 1, 0)) AS cc_any_nonin
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
)
-- Result:
--   all:      802 sessions | India 681 (84.9%) | outside India 121 | no country 0 | US 61
--   not paid: 388 sessions | India 274 (70.6%) | outside India 114 | US 59
--   paid:     414 sessions | India 407 (98.3%, = 407/414) | outside India 7 | US 2
--   sessions whose first pageview is India but a later pageview is elsewhere: 0


-- ===========================================================================================================
-- W5b  Country breakdown with device, distinct persons and repeat-visitor concentration, human sessions
--      (persons with 10+ = persons with >= 10 distinct session ids on $pageview in the window, any traffic)
-- ===========================================================================================================
SELECT
  cc AS country,
  count() AS sessions,
  countIf(p = 0) AS not_paid,
  countIf(dev = 'Mobile') AS phone,
  countIf(dev = 'Desktop') AS laptop,
  uniqExact(pid) AS distinct_persons,
  countIf(pid IN (
    SELECT pid FROM (
      SELECT person_id AS pid, uniqExact(properties.$session_id) AS ns
      FROM events
      WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
        AND event = '$pageview'
      GROUP BY pid
      HAVING ns >= 10
    )
  )) AS sessions_from_persons_with_10plus
FROM (
  SELECT
    properties.$session_id AS sid,
    any(person_id) AS pid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') AS um,
    argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') AS us_src,
    argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') AS fb,
    if(um = 'paid' OR (fb != '' AND us_src = ''), 1, 0) AS p,
    argMinIf(coalesce(properties.$geoip_country_code, ''), timestamp, event = '$pageview') AS cc,
    argMinIf(coalesce(properties.$device_type, ''), timestamp, event = '$pageview') AS dev
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
)
GROUP BY country
ORDER BY sessions DESC
LIMIT 15
-- Result (country | sessions | not paid | phone | laptop | distinct persons | sessions from persons with 10+):
--   IN | 681 | 274 | 562 | 114 | 586 | 33
--   US |  61 |  59 |  12 |  49 |  55 |  9
--   SE 8 | 6 | 6 | 2 | 7 | 0 ; HK 6 | 6 | 6 | 0 | 1 | 6 ; UA 5 | 5 | 4 | 1 | 5 | 0 ; CN 5 | 5 | 3 | 2 | 5 | 0 ;
--   GB 4 | 4 | 2 | 2 | 4 | 0 ; ES 3 | 3 | 2 | 1 | 3 | 0 ; NL, AU, AF, SG, JP, AE, CA 2 each (all not paid)


-- ===========================================================================================================
-- W5c  What the US human sessions look like (referrer, browser/OS, engagement)
-- ===========================================================================================================
SELECT
  if(ref = '', '$direct', ref) AS entry_referrer,
  concat(br, ' / ', os) AS browser_os,
  count() AS sessions,
  countIf(pvs = 1) AS single_page,
  round(quantile(0.5)(dur_s), 1) AS median_dur_s,
  countIf(dur_s < 5) AS under_5s,
  sum(has_click) AS sessions_with_autocapture,
  uniqExact(vw) AS distinct_viewport_widths
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.$geoip_country_code, ''), timestamp, event = '$pageview') AS cc,
    argMinIf(coalesce(properties.$browser, ''), timestamp, event = '$pageview') AS br,
    argMinIf(coalesce(properties.$os, ''), timestamp, event = '$pageview') AS os,
    argMinIf(toInt(properties.$viewport_width), timestamp, event = '$pageview') AS vw,
    dateDiff('second', min(timestamp), max(timestamp)) AS dur_s,
    max(if(event = '$autocapture', 1, 0)) AS has_click
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app') AND cc = 'US'
)
GROUP BY entry_referrer, browser_os
ORDER BY sessions DESC
LIMIT 20
-- Result (referrer | browser / OS | sessions | single-page | median duration s | under 5 s | with autocapture | viewport widths):
--   $direct      | Chrome / Linux        | 19 | 19 |   0.0 | 11 | 0 | 9
--   $direct      | Chrome / Mac OS X     | 10 | 10 | 120.5 |  3 | 3 | 5
--   $direct      | Mobile Safari / iOS   |  9 |  8 |   6.0 |  2 | 3 | 3
--   $direct      | Chrome / Windows      |  9 |  6 |  14.0 |  0 | 1 | 3
--   www.bing.com | Chrome / Windows      |  3 |  3 |   1.0 |  2 | 1 | 1
--   www.facebook.com | Chrome / Windows  |  2 |  2 |   9.5 |  0 | 0 | 1
--   remaining 9 rows are 1 session each (collapsed here so no single visit is described): 5 direct
--   (Edge, Claude app, Safari, Firefox on Mac; Chrome Android), 4 referred (Google, ChatGPT, LinkedIn, one
--   education-site referrer).
-- Reading: 19 of 61 US sessions are direct, single-page Chrome-on-Linux visits with a median length of 0 s and no
-- clicks, which looks like automation that $virt_is_bot did not flag. This is an inference, not a classification.


-- ===========================================================================================================
-- W6a  Definitional check: first-pageview session attributes vs PostHog session entry (session.$entry_*)
--      over non-bot sessions with a pageview
-- ===========================================================================================================
SELECT
  count() AS non_bot_sessions_with_pageview,
  countIf(i_fp = 0) AS human_first_pageview,
  countIf(i_se = 0) AS human_session_entry,
  countIf(i_fp != i_se) AS internal_flag_differs,
  countIf(i_fp = 0 AND p_fp != p_se) AS paid_flag_differs_in_fp_humans,
  countIf(i_fp = 0 AND p_fp = 1 AND p_se = 0) AS paid_fp_only,
  countIf(i_fp = 0 AND p_fp = 0 AND p_se = 1) AS paid_se_only,
  countIf(i_fp = 0 AND ref_fp != ref_se) AS entry_referrer_differs,
  countIf(i_fp = 0 AND first_evt != '$pageview') AS first_event_not_pageview,
  countIf(i_fp = 0 AND land_fp != land_se) AS landing_differs
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMin(event, timestamp) AS first_evt,
    if(argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') IN ('', '$direct'), '$direct',
       argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview')) AS ref_fp,
    if(coalesce(any(session.$entry_referring_domain), '') IN ('', '$direct'), '$direct',
       coalesce(any(session.$entry_referring_domain), '')) AS ref_se,
    if(ref_fp IN ('localhost:3456', '127.0.0.1:3456') OR ref_fp LIKE '%vercel.app', 1, 0) AS i_fp,
    if(ref_se IN ('localhost:3456', '127.0.0.1:3456') OR ref_se LIKE '%vercel.app', 1, 0) AS i_se,
    if(argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') = 'paid'
       OR (argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') != ''
           AND argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') = ''), 1, 0) AS p_fp,
    if(coalesce(any(session.$entry_utm_medium), '') = 'paid'
       OR (coalesce(any(session.$entry_fbclid), '') != '' AND coalesce(any(session.$entry_utm_source), '') = ''), 1, 0) AS p_se,
    argMinIf(concat(coalesce(properties.$host, ''), coalesce(properties.$pathname, '')), timestamp, event = '$pageview') AS land_fp,
    concat(coalesce(any(session.$entry_hostname), ''), coalesce(any(session.$entry_pathname), '')) AS land_se
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0
)
-- Result: non-bot sessions with a pageview 806 | human (first pageview) 802 | human (session entry) 802 |
--   internal flag differs 0 | paid flag differs 0 (fp-only 0, entry-only 0) | entry referrer differs 0 |
--   human sessions whose first event is not a $pageview 18 | landing page differs 6
-- (the audit's Method table says 7 sessions change landing page; this check finds 6 among human sessions).


-- ===========================================================================================================
-- W6b  Definitional check: does country or device vary within a human session?
-- ===========================================================================================================
SELECT
  count() AS human_sessions,
  countIf(n_cc > 1) AS sessions_multi_country,
  countIf(n_cc > 1 AND cc_fp = 'IN') AS multi_country_first_IN,
  countIf(n_cc > 1 AND cc_fp != 'IN') AS multi_country_first_not_IN,
  countIf(cc_fp != cc_first_event) AS first_pv_vs_first_event_country_differs,
  countIf(n_dev > 1) AS sessions_multi_device_type,
  countIf(dev_fp != dev_first_event) AS first_pv_vs_first_event_device_differs
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.$geoip_country_code, ''), timestamp, event = '$pageview') AS cc_fp,
    argMin(coalesce(properties.$geoip_country_code, ''), timestamp) AS cc_first_event,
    uniqExactIf(properties.$geoip_country_code, coalesce(properties.$geoip_country_code, '') != '') AS n_cc,
    argMinIf(coalesce(properties.$device_type, ''), timestamp, event = '$pageview') AS dev_fp,
    argMin(coalesce(properties.$device_type, ''), timestamp) AS dev_first_event,
    uniqExactIf(properties.$device_type, coalesce(properties.$device_type, '') != '') AS n_dev
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
)
-- Result: 802 human sessions | multi-country 0 | first pageview vs first event country differs 0 |
--   sessions with 2 device types 2 | first pageview vs first event device differs 0


-- ===========================================================================================================
-- W6c  Definitional check: the two wordings of the Meta click-id paid rule
--      brief: fbclid with no entry utm_source; audit Method table: fbclid with no UTM at all
-- ===========================================================================================================
SELECT
  countIf(fb != '' AND us = '') AS fbclid_no_utm_source,
  countIf(fb != '' AND us = '' AND (um != '' OR uc != '' OR uct != '' OR ut != '')) AS fbclid_no_source_but_other_utm,
  countIf(um = 'paid' OR (fb != '' AND us = '')) AS paid_rule_brief,
  countIf(um = 'paid' OR (fb != '' AND us = '' AND um = '' AND uc = '' AND uct = '' AND ut = '')) AS paid_rule_no_utm_at_all
FROM (
  SELECT
    properties.$session_id AS sid,
    countIf(event = '$pageview') AS pvs,
    max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
    argMinIf(coalesce(properties.$referring_domain, ''), timestamp, event = '$pageview') AS ref,
    argMinIf(coalesce(properties.utm_medium, ''), timestamp, event = '$pageview') AS um,
    argMinIf(coalesce(properties.utm_source, ''), timestamp, event = '$pageview') AS us,
    argMinIf(coalesce(properties.utm_campaign, ''), timestamp, event = '$pageview') AS uc,
    argMinIf(coalesce(properties.utm_content, ''), timestamp, event = '$pageview') AS uct,
    argMinIf(coalesce(properties.utm_term, ''), timestamp, event = '$pageview') AS ut,
    argMinIf(coalesce(properties.fbclid, ''), timestamp, event = '$pageview') AS fb
  FROM events
  WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
    AND coalesce(properties.$session_id, '') != ''
  GROUP BY sid
  HAVING pvs > 0 AND b = 0 AND NOT (ref IN ('localhost:3456', '127.0.0.1:3456') OR ref LIKE '%vercel.app')
)
-- Result: fbclid with no utm_source 217 | of those with some other UTM 0 | paid (brief rule) 414 | paid (no UTM at all) 414
-- The two wordings classify identically in this window.


-- ===========================================================================================================
-- W6d  $pageleave vs $pageview by day, last 5 days (non-bot events), to check the late-window $pageleave gap
-- ===========================================================================================================
SELECT
  toDate(timestamp) AS day,
  countIf(event = '$pageview') AS pageviews,
  countIf(event = '$pageleave') AS pageleaves,
  countIf(event = '$pageview' AND timestamp > toDateTime('2026-10-10 09:50:48')) AS pageviews_after_last_pageleave
FROM events
WHERE timestamp >= toDateTime('2026-10-06 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
  AND event IN ('$pageview', '$pageleave')
  AND coalesce(properties.$virt_is_bot, false) = false
GROUP BY day
ORDER BY day
-- Result (day | pageviews | pageleaves | pageviews after the last $pageleave):
--   2026-10-06 22 | 15 | 0 ; 10-07 28 | 16 | 0 ; 10-08 30 | 15 | 0 ; 10-09 23 | 15 | 0 ; 10-10 18 | 9 | 6
-- Only 6 pageviews fall after the last $pageleave (2026-10-10 09:50:47 UTC); the gap is immaterial to W2.
