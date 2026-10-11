---
name: project-seo-aeo-geo-round-2026-09
description: The kheelona.com SEO/AEO/GEO rounds — what is actually broken, what is measured, and the instruments that work
metadata:
  type: project
---

Two rounds: **2026-09-05** (dates, sources, sameAs, Person @ids) and **2026-09-11** (entity
correction, buyer's guide, three channel-targeted articles). Both live and verified on production.

**The finding that matters most (2026-09-11): the site is not the only source about the site.**
Six days after the Lumi → Kheelu rename shipped and was verified three ways, Perplexity still
answered that the flagship product is "a talking robot companion called Lumi", aged "2 to 8", in
"limited beta", founded by two people. All five wrong. Seven of its ten citations were stale
third-party profiles — loudest being the **Play Store listing, where "Lumi" appears 7 times and
"Kheelu" 0, inside a SoftwareApplication JSON-LD block on a Google-owned domain.** A rename has two
halves and only one is in the repo.

**Indexing is NOT the problem and never was.** 37 indexed against a 31-URL sitemap. 16 of 19 journal
articles are indexed and earn **zero** impressions. The homepage takes 87% of all impressions and
earns them for a **name collision** — ~1,050 of 2,280 impressions are "Lumi" queries, much of it
Romanian and Portuguese, for a different company's product. Net that out and Indian category
visibility is zero. Never propose "get them indexed" again.

**Nobody in India searches Google for this category.** Keyword Planner, India, 12 months: every
"AI toy" phrasing returns **no data**. What does carry volume: "educational/learning toys for 3 year
olds" 1k–10k each, "toys that talk back" 100–1k, "are ai toys safe" 10–100 and growing. The demand
for the category lives in answer engines, not Google's query stream. That is why AEO/GEO lead.

**Instruments that work, and ones that failed.** Ahrefs Brand Radar AI visibility is **paywalled**
on the Basic plan; GSC has **no AI Mode** search type for this property; Ahrefs' Google OAuth link
broke silently on 20 Aug and served three-week-stale data. So the tracked GEO instrument is **two
Perplexity prompts run by hand**, baselines recorded in the checkpoint. Free and cannot be switched
off. GSC itself is on `search.google.com/u/3/` (connect@kheelona.com).

**Two wrong conclusions I reached, both from trusting a proxy:**
- `dig TXT` found no `google-site-verification` record, so I concluded GSC verification had lapsed.
  It had not. Domain properties verify by **TXT or a CNAME at a random hostname**, which cannot be
  dug for. An account lacking permission and a property lacking verification look identical outside.
- `site:kheelona.com/stories` returned 10 results, so I concluded 9 of 19 articles were indexed. URL
  Inspection says otherwise. **`site:` is not an indexing report** — it truncates hard enough on a
  small site to invent a crisis.

**A gate lesson worth keeping:** `CompareTable` had a test, a story, and a banned contrast pair
(`text-ink-muted` is 4.21:1 on cool, 4.20:1 on sun, both already banned in
`test/contrast-tokens.test.ts`). It survived because it had **never been rendered on any route**, so
no sweep had loaded it. **The sweep checks pages, not exports.**

Laws: **§8.36**. Records: `docs/checkpoints/seo-aeo-geo-2026-09-11.md`, handoff
`docs/seo/handoff-2026-09-11.md`, founder drafts `docs/seo/founder-actions-2026-09-11.md` (nothing
sent). Rollback `pre-seo-round-2026-09-11` = `233a63f`. Re-measure **2026-10-03**.
See [[project-kheelona-com-build-prompt]] and [[brand-kheelu-lumi-law]].

**The 2026-09-12 follow-through, and the method lesson that outlasts it.** `/privacy-policy` had no
redirect and answered 404 while Perplexity was still citing it and quoting a dead Wix "Privacy Policy
(Beta)" — the source of its "limited beta" claim. **A 404 does not correct a stale index; a 301/308
does** (§8.36-g). The sitemap was complete but Google had not re-read it since 5 Sept, so **shipping
a sitemap change is not the same as Google reading it** — resubmit after any round that adds URLs.
**Cloudflare APPENDS to robots.txt rather than overriding**, and its managed block disallows GPTBot,
ClaudeBot, Google-Extended and CCBot, so **kheelona.com must stay DNS-only in Cloudflare** or the
whole AEO policy silently inverts (§8.36-h). DMARC ended at `p=none; sp=quarantine`, not the
`p=quarantine` the queue asked for, because the founder's aggregate reports showed **65% of apex mail
failing via IKP EDEN relay** — settled, do not re-raise.

**I was wrong three times in one day, and every time a proxy had stood in for a measurement:**
`site:` is not an indexing report (URL Inspection is); `dig TXT` does not prove a GSC property
unverified (domain properties also verify by CNAME at a random hostname); correct SPF and DKIM do not
prove DMARC is safe to tighten (only the aggregate reports show who really sends as you). A fourth
near-miss: I told the backend team their robots.txt was fine after reading only the head of the file.
**Go to the authoritative instrument, and read the whole artefact.**

