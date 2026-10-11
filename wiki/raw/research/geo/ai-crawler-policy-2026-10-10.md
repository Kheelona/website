---
title: AI-crawler policy options for Gate A (raw capture, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - "GET https://kheelona.com/robots.txt, 2026-10-11 01:59 UTC (site-files-2026-10-10/robots.txt)"
  - "https://developers.openai.com/api/docs/bots (redirected from platform.openai.com/docs/bots), fetched 2026-10-11"
  - "https://support.claude.com/en/articles/8896518, fetched 2026-10-11"
  - "https://docs.perplexity.ai/guides/bots, fetched 2026-10-11"
  - "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers, fetched 2026-10-11"
  - "https://support.apple.com/en-us/119829, fetched 2026-10-11"
  - "https://commoncrawl.org/ccbot, fetched 2026-10-11"
  - "WebSearch 'Bytespider robots.txt compliance', 2026-10-11 (ppc.land citing TollBit H1 2026; vendor blogs)"
  - "PostHog query B in ai-answer-audit-2026-10-10.md (utm_source=chatgpt.com, 2026-09-19 to 2026-10-10)"
  - "Legacy: git show archive/pre-reset-2026-10-10:docs/website-steps.md §8.36-h (Cloudflare appends a managed AI block)"
---

# AI-crawler policy options for Gate A (raw capture, 2026-10-10)

Brief 9.3: recommend a policy at Gate A and keep today's rules until the founder decides
([G7](../../../open-questions.md)). This is the evidence and the options.

## What each crawler is, and what today's `robots.txt` does

Today's file allows everything: `User-Agent: *` `Allow: /`, plus an explicit `Allow: /` group for
eleven AI agents. A crawler not named falls under `*` and is allowed too.

| Agent | Operator | What it is for (operator's own words, fetched 2026-10-11) | Obeys robots.txt? | Today |
|---|---|---|---|---|
| GPTBot | OpenAI | "crawl content that may be used in training our generative AI foundation models" | Yes | Allowed (explicit) |
| OAI-SearchBot | OpenAI | "surface websites in search results in ChatGPT's search features"; opted-out sites "will not be shown in ChatGPT search answers" | Yes; independent of GPTBot | Allowed (explicit) |
| ChatGPT-User | OpenAI | fetches a page when a user asks ChatGPT; "not used to determine whether content may appear in Search" | "robots.txt rules may not apply" | Allowed (explicit) |
| ClaudeBot | Anthropic | "collecting web content that could potentially contribute to their training" | Yes ("Anthropic's Bots respect 'do not crawl' signals") | Allowed (explicit) |
| Claude-User | Anthropic | fetches pages when a user asks Claude a question | Yes, per the same article | Allowed (explicit) |
| Claude-SearchBot | Anthropic | "navigates the web to improve search result quality" | Yes | Allowed (explicit) |
| PerplexityBot | Perplexity | surfaces and links sites in Perplexity results; "not used to crawl content for AI foundation models" | robots.txt is the stated control | Allowed (explicit) |
| Perplexity-User | Perplexity | user-requested fetches; "not used for web crawling or to collect content for training" | "generally ignores robots.txt rules" | Allowed (explicit) |
| Google-Extended | Google | a **token, not a crawler**: decides whether Google-crawled content is used to train Gemini and for **grounding** in Gemini Apps and Vertex AI; "does not impact a site's inclusion in Google Search nor is it used as a ranking signal" | n/a (honoured by Google) | Allowed (explicit). Google's page does not say whether it affects AI Overviews |
| Applebot-Extended | Apple | a **token, not a crawler**: opts content out of training Apple's generative models; "Applebot-Extended does not crawl webpages"; content stays discoverable in Siri, Spotlight and Safari | n/a | Allowed (explicit) |
| CCBot | Common Crawl | builds Common Crawl's open web archive; the page gives a robots.txt opt-out. It does not mention AI training; that Common Crawl data is widely used to train models is general knowledge, not checked here | Implied by the opt-out instructions | Allowed (explicit) |
| Bytespider | ByteDance | crawler of unclear purpose; ByteDance publishes little | **Disputed**: reported to reach disallowed pages in a TollBit study of H1 2026 (secondhand, ppc.land); its user agent can be spoofed | **Not named**; allowed under `*` |

Also allowed under `*` without being named: Googlebot and Bingbot (search; Bing's index feeds
Copilot and, per its own AI summary, already answers about Kheelu), Applebot, Meta's and Amazon's
agents. **The apex must stay DNS-only in Cloudflare**: proxied, Cloudflare prepends a managed block
that disallows GPTBot, ClaudeBot, Google-Extended and CCBot (legacy §8.36-h, still true as checked
2026-10-11: no Cloudflare section in the served file).

## The facts that decide it

1. **AI assistants already bring customers.** `utm_source=chatgpt.com` brought **77 of 762
   first-touch visitors (10.1%)** from 2026-09-19 to 2026-10-10, the third-largest source
   ([audit §4](ai-answer-audit-2026-10-10.md#4-what-ai-assistants-already-send-us-posthog)).
   Blocking OAI-SearchBot would remove us from ChatGPT search answers.
2. **The brand's GEO problem is stale facts inside models and indexes**: "Lumi", "robot", "2 to 8",
   "₹2,999", "priced at ₹499" ([entity file](entity-consistency-2026-10-10.md)). Fresh crawls are how
   the corrected facts get in. Blocking training crawlers (GPTBot, ClaudeBot, CCBot,
   Google-Extended, Applebot-Extended) would freeze whatever the next models already absorbed.
3. **Google-Extended also controls grounding in Gemini**, so blocking it is not only a training
   opt-out: it removes the site from Gemini's grounded answers.
4. **Two user-fetch agents ignore robots.txt anyway** (ChatGPT-User "may not", Perplexity-User
   "generally ignores"), so no option can block a user who asks an assistant to read our page.
5. **Nothing on the site is secret**: marketing pages and a journal; the store is `noindex` and
   has no content worth training on. The trade-off is licensing value, not privacy.
6. **Bytespider has no Indian answer-engine role we know of** and its compliance is disputed.
   (TikTok has been blocked in India since 2020: general knowledge, not checked here.)

## Options

| Option | robots.txt | For | Against |
|---|---|---|---|
| **1. Keep today's file** (allow all) | unchanged | Zero risk to parity; maximum chance that every assistant learns and cites the corrected facts | Our pages may be used for training with no payment; Bytespider stays allowed by default |
| **2. Allow everything, disallow Bytespider** (recommended) | today's file plus `User-Agent: Bytespider` `Disallow: /` | Keeps every answer-engine and training route that serves Indian parents; drops the one agent with no benefit to us and a compliance question | robots.txt is advisory, so a non-compliant agent may ignore it; a firewall rule would be the founder's (Vercel dashboard) |
| **3. Search yes, training no** | allow OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User; disallow GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, Bytespider | Content not used to train future models | Future models keep the stale picture (Lumi, robot, wrong ages and price); Google-Extended also cuts Gemini grounding; the brand is too small for its content to be worth withholding |

**Recommendation: option 2**, at Gate A, for the new site's `robots.ts`. Until the founder decides,
the new site serves today's file byte-for-byte (brief 9.3), and QA checks the served file and that
the apex is still DNS-only.

**Owner:** founder (G7). **Customer-visible:** no.

## Notes for the build

- Keep `robots.txt` generated from code (`src/app/robots.ts` at the tag) and keep the `Sitemap:`
  line. Keep the explicit `Allow` groups even though `*` already allows: they document intent and
  survive a future `*` change.
- A `Disallow` on a group named for a crawler overrides `*` for that crawler only.
- Changes take about 24 hours to reach ChatGPT search (OpenAI's page).
- The store host serves the same file; keep it allowed so crawlers can read its `noindex`.
