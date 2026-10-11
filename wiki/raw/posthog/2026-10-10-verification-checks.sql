-- Independent verification of wiki/research/posthog-audit.md
-- PostHog project 617632 (timezone UTC), read-only, run 2026-10-11 ~02:00-03:00 UTC (2026-10-10 IST evening)
-- Window everywhere: timestamp >= '2026-09-19 00:00:00' AND < '2026-10-11 00:00:00' UTC
-- Session definitions are rebuilt from the events table only (first $pageview of each session),
-- NOT from the sessions table (session.$entry_*) that the audit used.

-- S: per-session subquery used by V1-V6, V12, V15, V17, V18 (human = has a pageview, no bot-flagged event,
--    first-pageview referrer not localhost:3456 / 127.0.0.1:3456 / *.vercel.app)
--   SELECT properties.$session_id AS sid,
--     countIf(event = '$pageview') AS pvs,
--     max(if(properties.$virt_is_bot = true, 1, 0)) AS b,
--     argMinIf(coalesce(properties.$referring_domain,''), timestamp, event='$pageview') AS ref,
--     if(ref IN ('localhost:3456','127.0.0.1:3456') OR ref LIKE '%vercel.app', 1, 0) AS i,
--     argMinIf(coalesce(properties.utm_medium,''), timestamp, event='$pageview') AS um,
--     argMinIf(coalesce(properties.utm_source,''), timestamp, event='$pageview') AS us,
--     argMinIf(coalesce(properties.fbclid,''), timestamp, event='$pageview') AS fb,
--     if(um='paid' OR (fb!='' AND us=''), 1, 0) AS p,
--     argMinIf(properties.$device_type, timestamp, event='$pageview') AS dev,
--     ... step flags as max(if(event=..., 1, 0)) ...
--   FROM events WHERE <window> AND coalesce(properties.$session_id,'') != '' GROUP BY sid
--   HAVING pvs > 0 AND b = 0 AND i = 0
-- Store step = $pageview with $current_url starting 'https://store.kheelona.com' and not containing '/thanks'
-- Product step = $pageview with $current_url starting 'https://kheelona.com/products/kheelu'

-- V0 probe: event totals in window
SELECT event, count() AS n, countIf(properties.$virt_is_bot = true) AS bot_flagged, min(timestamp), max(timestamp)
FROM events WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00')
GROUP BY event ORDER BY n DESC;

-- V1 baseline: sessions, devices, pageviews, single-page, median length, paid split
SELECT count() AS sessions_all, countIf(h=1) AS human, countIf(h=1 AND p=1) AS human_paid, countIf(h=1 AND p=0) AS human_notpaid,
  uniqExactIf(dev_id, h=1) AS uniq_devices, uniqExactIf(dev_id, h=1 AND p=1), uniqExactIf(dev_id, h=1 AND p=0),
  sumIf(pvs, h=1) AS pageviews, sumIf(pvs, h=1 AND p=1), sumIf(pvs, h=1 AND p=0),
  countIf(h=1 AND pvs=1) AS single_page, countIf(h=1 AND p=1 AND pvs=1), countIf(h=1 AND p=0 AND pvs=1),
  quantileExact(0.5)(if(h=1, dur, NULL)) AS median_len_s, quantileExact(0.5)(if(h=1 AND p=1, dur, NULL)), quantileExact(0.5)(if(h=1 AND p=0, dur, NULL)),
  countIf(pvs>0 AND b=1) AS bot_sessions, countIf(pvs>0 AND b=0 AND i=1) AS internal_sessions
FROM (S plus: any(properties.$device_id) AS dev_id, dateDiff('second', min(timestamp), max(timestamp)) AS dur,
      if(pvs>0 AND b=0 AND i=0,1,0) AS h; no HAVING);
-- result: 1175 | 802 | 414 | 388 | 690 | 399 | 292 | 1087 | 462 | 625 | 651 | 377 | 274 | 13 | 7 | 37 | 67 | 4

-- V2 device split + funnel steps by device x paid (sessions)
SELECT dev, p, count(), countIf(f_prod=1), countIf(f_store=1), countIf(f_fs=1), countIf(f_ps=1), countIf(f_bc=1), countIf(f_pu=1),
  countIf(f_store=1 AND f_fs=0), countIf(f_late=1)   -- f_late = session starts >= 2026-09-24
FROM (S) GROUP BY dev, p;
-- Desktop/0 184|35|27|2|1|1|1|25|123 ; Desktop/1 3|0|1|0|0|0|0|1|1 ; Mobile/0 200|25|43|6|4|4|1|37|131 ;
-- Mobile/1 410|1|19|2|0|0|0|17|0 ; Tablet/0 4|0|1|0|0|0|0|1|2 ; Tablet/1 1|0|0|0|0|0|0|0|0

-- V3 weekly (toStartOfWeek(first event, 1)): sessions, paid tagged (um='paid'), Meta click no UTM, ChatGPT, store, purchase
-- 09-14: 176|124|11|4|25|0 ; 09-21: 455|73|205|37|45|2 ; 09-28: 83|0|0|23|11|0 ; 10-05: 88|0|1|19|10|0

-- V4 landing = argMinIf(host||pathname, timestamp, event='$pageview'); dur = max-min event time
-- kheelona.com/ 683|paid 398|one-page 556|median 14 s|store 28|form 4|purchase 2 ; store/ 58|15|47|21|58|5|0 ;
-- /products/kheelu 31|0|23|31|5|1|0 ; /team 6|1|4|8 ; 7 sessions have first-event path != first-pageview path

-- V5 orders: per session with begin_checkout, bucket by $webview_app on the begin_checkout event and purchase in same session
-- Instagram/iOS unpaid 1 ; WhatsApp/Android unpaid 2 ; none/Android paid 1 ; none/Mac paid 1 ; (+1 non-human Android unpaid)

-- V6 purchases
SELECT event, count(), sum(toFloat(properties.value)), groupUniqArray(properties.tier), groupUniqArray(properties.currency),
  countIf(coalesce(properties.$session_id,'')=''), countIf(coalesce(properties.utm_source,'')!='')
FROM events WHERE <window> AND event IN ('purchase','purchase_confirmed') GROUP BY event;
-- purchase 2|998|launch|INR|0|0 ; purchase_confirmed 2|998|launch|INR|2|1

-- V7 Meta daily (metaads.campaign_stats, date_start 2026-09-14..2026-10-10)
SELECT date_start, sum(toFloat(spend)), sum(toFloat(inline_link_clicks)),
  sum(arraySum(arrayMap(x -> if(JSONExtractString(x,'action_type')='landing_page_view', toFloatOrZero(JSONExtractString(x,'value')), 0.0),
      JSONExtractArrayRaw(coalesce(toString(actions),'[]')))))
FROM metaads.campaign_stats WHERE date_start >= '2026-09-14' AND date_start <= '2026-10-10' GROUP BY date_start ORDER BY date_start;
-- 09-18 125.00|191|59 ; 09-19 459.41|650|183 ; 09-20 263.05|403|91 ; 09-21 498.04|421|116 ; 09-22 1174.67|636|214 ; 09-23 21.47|9|4

-- V8 daily paid sessions and WhatsApp-webview Meta clicks without UTM (S + argMinIf($webview_app))
-- 09-19 49|3 ; 09-20 86|6 ; 09-21 98|57 ; 09-22 177|142 ; 09-23 3|0 ; 10-08 1 (Meta click id, no UTM)

-- V9 web vitals by host x device: quantile(0.75) on $web_vitals_*_value, $web_vitals events, no session filter
-- apex Mobile LCP 2348 (187), INP 440 (47) ; store Mobile LCP 3292 (32), INP 258 (18) ; apex Desktop LCP 1574 (111) ; store Desktop LCP 2850 (11)
-- same restricted to human sessions (S): store Mobile LCP 3308 (30)
-- V10 web vitals by host x $pathname in ('/', '/products/kheelu'): Home Mobile LCP 2354 (167), INP 546 (38), FCP 2340 (362);
-- store / Mobile LCP 3244 (31), INP 294 (14), FCP 3245 (52); store / Desktop LCP 2863 (10)

-- V11 exceptions and frustration events (all events in window)
SELECT event, count(), uniqExact(properties.$session_id), countIf(properties.$host='store.kheelona.com')
FROM events WHERE <window> AND event IN ('$exception','$dead_click','$dead_swipe','$rageclick') GROUP BY event;
-- $exception 37|12|0 ; $dead_click 89|41 ; $dead_swipe 61|41 ; $rageclick 13|9 ; 'Script error' 23 in 9 sessions

-- V12 scroll depth: $pageview/$pageleave with $prev_pageview_max_scroll_percentage, page = host + $prev_pageview_pathname,
--   joined to S (human only): Home phone 373 views, 9.7% reach 25% (paid 294: 3.1%, median 7.8 s; not paid 79: 34.2%);
--   Home laptop 132; product laptop 29; store phone 33; store laptop 22.
--   Same without any session filter: Home phone 378, laptop 145, product laptop 35, store phone 40, store laptop 28 (= audit).
--   Extra views come from sessions with no $pageview (Home laptop 13, Home phone 5, product laptop 6, store 9) and internal sessions (store 4).

-- V13 store-link taps from kheelona.com: $autocapture, $event_type='click', elements_chain_href contains 'store.kheelona.com'
-- Mobile 29 taps / 18 sessions / 25 with no properties.cta / 22 of those with 'fixed' in elements_chain ;
-- Desktop 24: navbar 11, finale 5, hero 3, product-top 3, none 2

-- V14 native funnel (query-funnel, typed): $pageview -> store $pageview (host store, pathname not /thanks) -> preorder_form_started
--   -> preorder_start -> begin_checkout -> purchase; ordered, 14 days, persons, breakdown $device_type,
--   2026-09-19T00:00Z..2026-10-11T00:00Z. Without bot filter: Mobile 551/26/5/2/2/1, Desktop 202/19/3/2/2/1.
--   With step-1 filter coalesce(properties.$virt_is_bot,false)=false: Desktop 135/19/3/2/2/1. Median checkout->purchase 151 s / 125 s.

-- V15 product vs Home and country (S): saw product 61, of which store 9; Home-not-product 660, of which store 30 (incl. 4 tablet);
--   India 681/802; US 61; non-paid outside India 114/388; non-paid US 59

-- V16 recordings: session_replay_events, start_time in window, grouped by session_id:
--   533 recordings, 0 with '/thanks' in first_url or all_urls, 485 in human sessions (S)

-- V17 form validation (S): sessions with store $autocapture $event_type='submit' vs preorder_start count:
--   (1 submit,1 valid) x4 [1 paid], (2,0) x1, (2,1) x1 [paid]

-- V18 sources (S, non-paid): Direct 183 (phone 81, store 27), Organic search 93 (39, 6, 1 purchase), ChatGPT 83 (58, 13, 1),
--   IG utm ig/social 16 (13, 16), Own site 7 (4, 7), LinkedIn 2 + Twitter app 1 + l.instagram 1 = 4, kheelona.ai 2

-- V19 phone browsers (S, Mobile, first-pageview $webview_app else $browser+$os): WhatsApp 218 (216 Android), Chrome Android 194,
--   Safari iOS 73, Instagram 45, Threads 32, FB Lite 15 + FB 4, Chrome iOS 13, Samsung 11
-- V20 phone viewport width (first pageview): 360: 191 (31.3%, not paid 37, min h 588, median 666); 384: 88; 392: 73; 402: 33;
--   411: 29; 393: 21; 390: 11; 324: 12 + 325: 8; 320: 1; width 0: 7

-- V21 Meta September totals (metaads.campaign_stats, spend > 0): 09-02..09-13: 2472.28 INR, 5054 link clicks, 3 campaigns;
--   09-18..09-23: 2541.64 INR, 2310 clicks, 28 onsite_conversion.total_messaging_connection
-- V22 (S): sessions with /playos pageview 24; preorder_dismissed sessions phone 2, laptop 0
