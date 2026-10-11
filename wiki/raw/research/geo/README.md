---
title: GEO and AEO raw captures (Phase 1, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - question-bank-2026-10-10.md
  - ai-answer-audit-2026-10-10.md
  - entity-consistency-2026-10-10.md
  - machine-readability-2026-10-10.md
  - ai-crawler-policy-2026-10-10.md
---

# GEO and AEO raw captures (Phase 1, 2026-10-10)

Raw research by the Search & AI Visibility agent for `research/keyword-map.md` (its GEO plan and
question bank). Immutable once written: a later round adds a new dated file, it does not edit
these. Captured 2026-10-11 01:59 to 02:50 UTC, which is the evening of 2026-10-10 in California.

| File | What it holds |
|---|---|
| [question-bank-2026-10-10.md](question-bank-2026-10-10.md) | 34 real parent questions (screen time, language, learning toys, AI toys and safety, talking toys, gifts, the brand), each with where it was seen and a 40 to 60 word answer-first draft built only from verified facts, with marked placeholders |
| [ai-answer-audit-2026-10-10.md](ai-answer-audit-2026-10-10.md) | What Bing (with its AI summary) and the WebSearch index say about Kheelona and Kheelu, what could not be tested (Perplexity, Google, ChatGPT and others), and PostHog's count of visitors sent by ChatGPT |
| [entity-consistency-2026-10-10.md](entity-consistency-2026-10-10.md) | 17 off-site sources (app stores, kheelona.ai, LinkedIn, Instagram, Facebook, YNOS, CB Insights, Tracxn, YouTube, GitHub, name collisions, press) against the true name, category, age, price and safety story |
| [machine-readability-2026-10-10.md](machine-readability-2026-10-10.md) | `llms.txt`, `robots.txt`, `sitemap.xml` and the JSON-LD on Home and `/products/kheelu` against brief 9.2 and 9.3 at ages 3 to 7 |
| [ai-crawler-policy-2026-10-10.md](ai-crawler-policy-2026-10-10.md) | Every AI crawler, what today's `robots.txt` does for it, three options and a recommendation for Gate A (G7) |
| `site-files-2026-10-10/` | Byte copies of the live `robots.txt`, `llms.txt`, `sitemap.xml`, `pricing.md` (saved as `pricing.md.txt` so no Markdown tool treats it as a wiki page), the extracted JSON-LD of both pages, and kheelona.ai's `llms.txt` and `robots.txt` |
| `engine-captures-2026-10-10/` | Bing result captures, headless-browser renders of third-party pages, Bing PAA and Google/Bing autocomplete. IP addresses, phone numbers and email addresses were redacted before saving |

**Instruments:** Bing and third-party pages were read in headless Chrome found by
`tools/qa/lib/resolve.mjs` (logged out, India market, one request at a time, 2 to 5 s apart);
WebSearch and WebFetch for the rest; PostHog through its MCP, read-only. Scripts lived in the
session scratchpad, not the repo. kheelona.com was only ever read with GET.
