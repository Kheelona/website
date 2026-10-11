---
title: "ADR-012: URLs, redirects and structured data: one redirect table with one-hop www variants, metadata and JSON-LD from content, Bytespider blocked"
type: adr
updated: 2026-10-12
sources:
  - ../../site/url-map.md (§1, §4 redirects, §4c chains, §4d guessable 404s)
  - ../../site/strategy.md (§4 URL plan, §7 search rules)
  - ../../decisions/D041-gate-a-round-1.md (G8/G5 drops, G7 crawlers), ../../decisions/D037-delivery-date-in-schema.md, ../../decisions/D028-price-wording.md
  - ../lessons.md (§1 metadata merging, title template; §6 SEO infrastructure)
  - next.config.ts, src/lib/seo.ts, src/app/robots.ts, src/app/sitemap.ts (read 2026-10-12)
---

# ADR-012: URLs, redirects and schema

**Status:** accepted by the Architect, 2026-10-12. Two items need founder dashboard actions at Gate B.

## Context

Brief §9.2: every existing URL answers 200 or 301s in one hop; no chains; unique titles and
descriptions; canonical; `lang="en-IN"`; Open Graph and Twitter; JSON-LD for Organization, WebSite,
Product and Offer (with return and shipping policies), BreadcrumbList, FAQPage, Article. D041: drop
`/playos` (301 to `/products/kheelu`) and the 2-year-old article (301 to the 3-year-old article); allow AI
crawlers, block Bytespider. Strategy §4.2: one-hop redirects for guessable 404s (`/kheelu`, `/careers`)
and remove the 2-3 hop chains through `www` and `http`. Today `www` redirects at Vercel's edge before
the app, which makes every legacy `www` URL two hops (url-map §4c).

## Choice

- **One redirect table**, `src/config/redirects.ts`, read by `next.config.ts`: the 24 existing rules
  unchanged, plus `/playos` and `/stories/brain-development-toys-for-a-2-year-old` (D041), plus
  guessable 404s `/kheelu` → `/products/kheelu`, `/careers` and `/jobs` → `/team` (url-map §4d: `/jobs` had
  2 landings, `/careers` 1), `/products` → `/products/kheelu`, `/pricing` → `/products/kheelu#offer`. A
  generator emits, **for each rule, a host-matched `www.kheelona.com` twin with an absolute apex
  destination first**, then the apex rule, then a `www` catch-all (one variant for trailing-slash paths),
  so any `https://www` URL resolves in one hop **once the founder switches the `www` domain from
  "redirect" to "serve this project"** in Vercel (Gate B runbook). `http://` adds Vercel's forced HTTPS
  hop; that one cannot be removed on Vercel and is recorded as the platform exception.
- Fragments the ads and old links use stay valid on `/products/kheelu`: `#faq`, `#story-mode`, `#reserve`,
  `#offer`.
- **Metadata:** `pageMeta()` returns the whole Open Graph and Twitter objects every time (Next merges
  shallowly) and uses `title: { absolute }` with the exact title from the content module, so no template
  can double the brand. Canonical from the route path; `metadataBase` = `CANONICAL_ORIGIN`.
- **JSON-LD:** one escaped `<script type="application/ld+json">` per page; the site shell emits
  Organization and WebSite once; pages add only their own nodes, built by `src/lib/seo/schema/*` from
  content. Product keeps `@id` `https://kheelona.com/products/lumi#product` and `alternateName: "Lumi"`;
  the Offer price is the offer's headline amount (4999 token mode, 7999 full), `availability: PreOrder`,
  `availabilityStarts: 2026-11-15` (D037), with `hasMerchantReturnPolicy`, `shippingDetails` and a
  warranty node from the policy constants; FAQPage text is the plain-text serialisation of the same FAQ
  items the page shows; BlogPosting for articles with their stored publication and update dates (taken from git history when an article changes, never computed at build); BreadcrumbList only where
  breadcrumbs are visible. No ratings or reviews (none exist).
- **robots.txt:** `*` allowed; the existing named AI agents allowed; `Bytespider` disallowed; sitemap at
  the canonical origin. Beta hosts keep the same robots file (crawlers must be able to read the noindex
  header; lessons §6 "never pair Disallow with noindex").
- **Sitemap:** generated from the route registry; only canonical 200 URLs; `lastModified` only where a
  real, stored date exists (lessons §6).
- **`/llms.txt` and `/pricing.md`:** rendered from content, ₹4,999 (incl. GST) first (D028), only visible
  facts, each with a dated `*_UPDATED` constant.

## Consequences

- Redirect correctness is a pure-data test: a hop simulator runs every legacy URL family on both hosts
  and asserts one hop to a 200 route.
- The founder's Gate B actions: switch `www` to serve the project (for one-hop `www` legacy URLs) and
  resubmit the sitemap in Search Console.
