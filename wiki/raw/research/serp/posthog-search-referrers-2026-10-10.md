---
title: "PostHog: search and AI-assistant referrals, landing pages, utm_term and on-site search (2026-10-10)"
type: raw-capture
updated: 2026-10-10
sources:
  - "PostHog project 617632 (US cloud), read-only HogQL on the sessions and events tables, run 2026-10-11 02:25-02:35 UTC; queries in full below"
  - wiki/site/url-map.md (section 5b and 'Queries used': the same window and the same sessions table)
---

# PostHog: what search and answer engines send today (2026-10-10)

**Window.** Requested `2026-07-12 00:00` to `2026-10-11 00:00` UTC (90 days). PostHog only holds data
from **2026-09-19** (installed that day), so the real window is **2026-09-19 to 2026-10-10, about
three weeks**. Sessions with at least one pageview: **873** (same base as
[url-map](../../../site/url-map.md)). The "Internal / Test users" cohort has 0 members
([C7](../../../open-questions.md)), so counts include internal traffic. Aggregates only.

PostHog's `$channel_type` is its own classification; it is used as given.

## 1. Sessions by channel (query P1)

| Channel | Sessions | Share |
|---|---|---|
| Direct | 248 | 28.4% |
| Organic Social | 237 | 27.1% |
| Paid Social | 196 | 22.5% |
| **Organic Search** | **93** | **10.7%** |
| **AI** | **83** | **9.5%** |
| Referral | 13 | 1.5% |
| Paid Unknown | 3 | 0.3% |

## 2. Search engines and assistants by referring domain (query P2)

| Referring domain | Channel | Sessions | First day | Last day |
|---|---|---|---|---|
| www.google.com | Organic Search | 85 | 2026-09-19 | 2026-10-09 |
| www.bing.com | Organic Search | 4 | 2026-10-06 | 2026-10-06 |
| com.google.android.googlequicksearchbox (Google app) | Organic Search | 2 | 2026-09-22 | 2026-09-28 |
| au.search.yahoo.com | Organic Search | 1 | 2026-10-06 | 2026-10-06 |
| duckduckgo.com | Organic Search | 1 | 2026-10-07 | 2026-10-07 |
| chatgpt.com | AI | 12 | 2026-09-20 | 2026-10-03 |

**All 83 AI-channel sessions carry `utm_source=chatgpt.com`** (the tag ChatGPT adds to links it
cites): 70 with no referrer, 12 with `chatgpt.com` as referrer, 1 with an unrelated referrer (query
P4). **No session from Perplexity, Gemini, Copilot or Claude** in the window (same query matched
those names in source and referrer).

## 3. Where they land (query P3)

| Channel | Landing page | Sessions |
|---|---|---|
| AI (ChatGPT) | `/` | 66 |
| AI (ChatGPT) | `/products/kheelu` | 15 |
| AI (ChatGPT) | `/refund` | 1 |
| AI (ChatGPT) | `/team` | 1 |
| Organic Search | `/` | 73 |
| Organic Search | `/products/kheelu` | 11 |
| Organic Search | `/ai-toys-for-kids-in-india` | 5 |
| Organic Search | `/team` | 3 |
| Organic Search | `/contact` | 1 |

**No journal article (`/stories/…`) received a single search or AI landing** in the window.

## 4. By week (query P5; weeks start Monday; the first is partial, from 2026-09-19)

| Week of | Organic Search | of which on `/` | AI (ChatGPT) | All sessions |
|---|---|---|---|---|
| 2026-09-14 | 4 | 3 | 4 | 183 |
| 2026-09-21 | 47 | 37 | 37 | 471 |
| 2026-09-28 | 14 | 12 | 23 | 106 |
| 2026-10-05 | 28 | 21 | 19 | 113 |

In the week of 2026-09-28 ChatGPT sent more sessions (23) than all search engines together (14).

## 5. Search terms available in PostHog

- **`utm_term`** (query P6): six values, all Meta ad-set ids on paid social (`an`, `ig`, `th`, `fb`
  / `paid`), 197 sessions in total. **No search keyword reaches PostHog**: Google sends no query in
  the referrer, and no paid search runs (only 2 sessions carry a `gclid`, per
  [url-map 5b](../../../site/url-map.md)).
- **On-site search** (query P7): **none exists.** Zero events whose name contains "search" and zero
  pageviews with `?q=` in the URL, 2026-09-19 to 2026-10-10.

So PostHog can say **which pages** search and ChatGPT land on, never **which words** brought them.
That needs Search Console ([C11](../../../open-questions.md)).

## Queries used (HogQL, read-only)

Range predicate `<R>` = `$start_timestamp >= toDateTime('2026-07-12 00:00:00') AND $start_timestamp < toDateTime('2026-10-11 00:00:00') AND $pageview_count > 0`.

- **P1** `SELECT $channel_type AS channel, count() AS sessions, round(100 * count() / sum(count()) OVER (), 1) AS pct FROM sessions WHERE <R> GROUP BY channel ORDER BY sessions DESC LIMIT 50`
- **P2** `SELECT coalesce($entry_referring_domain, '') AS referring_domain, $channel_type AS channel, count() AS sessions, min(toDate($start_timestamp)) AS first_day, max(toDate($start_timestamp)) AS last_day FROM sessions WHERE <R> AND coalesce($entry_referring_domain, '') NOT IN ('', '$direct') GROUP BY referring_domain, channel ORDER BY sessions DESC LIMIT 100`
- **P3** `SELECT $channel_type AS channel, $entry_hostname AS host, $entry_pathname AS landing_path, count() AS sessions FROM sessions WHERE <R> AND $channel_type IN ('Organic Search', 'AI') GROUP BY channel, host, landing_path ORDER BY channel, sessions DESC LIMIT 100`
- **P4** `SELECT $channel_type AS channel, coalesce($entry_utm_source, '') AS utm_source, coalesce($entry_referring_domain, '') AS ref, count() AS sessions FROM sessions WHERE <R> AND ($channel_type = 'AI' OR coalesce($entry_utm_source, '') ILIKE '%chatgpt%' OR coalesce($entry_utm_source, '') ILIKE '%perplexity%' OR coalesce($entry_referring_domain, '') ILIKE '%perplexity%' OR coalesce($entry_referring_domain, '') ILIKE '%gemini%' OR coalesce($entry_referring_domain, '') ILIKE '%copilot%' OR coalesce($entry_referring_domain, '') ILIKE '%claude%') GROUP BY channel, utm_source, ref ORDER BY sessions DESC LIMIT 50`
- **P5** `SELECT toStartOfWeek($start_timestamp, 1) AS week, countIf($channel_type = 'Organic Search') AS organic_search, countIf($channel_type = 'AI') AS ai, countIf($channel_type = 'AI' AND coalesce($entry_utm_source, '') = 'chatgpt.com') AS ai_chatgpt_utm, countIf($channel_type = 'Organic Search' AND $entry_pathname = '/') AS organic_search_home, count() AS all_sessions FROM sessions WHERE <R> GROUP BY week ORDER BY week`
- **P6** `SELECT coalesce($entry_utm_term, '') AS utm_term, coalesce($entry_utm_source, '') AS utm_source, coalesce($entry_utm_medium, '') AS utm_medium, count() AS sessions FROM sessions WHERE <R> AND coalesce($entry_utm_term, '') != '' GROUP BY utm_term, utm_source, utm_medium ORDER BY sessions DESC LIMIT 50`
- **P7** `SELECT event, count() AS n FROM events WHERE timestamp >= toDateTime('2026-09-19 00:00:00') AND timestamp < toDateTime('2026-10-11 00:00:00') AND (event ILIKE '%search%' OR (event = '$pageview' AND properties.$current_url ILIKE '%?q=%')) GROUP BY event LIMIT 20` → 0 rows
