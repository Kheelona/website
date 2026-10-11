---
title: On-site machine readability review (raw capture, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - "GET https://kheelona.com/robots.txt, /llms.txt, /sitemap.xml, /pricing.md (browser User-Agent), 2026-10-11 01:59 UTC; copies in site-files-2026-10-10/"
  - "GET https://kheelona.com/ and /products/kheelu, 2026-10-11 02:00 UTC; JSON-LD extracted to site-files-2026-10-10/home-jsonld.json and products-kheelu-jsonld.json"
  - "GET https://kheelona.com/llms-full.txt (404), https://www.kheelona.com/llms.txt (308 to apex), store.kheelona.com/robots.txt (200), 2026-10-11"
  - "git show archive/pre-reset-2026-10-10:src/lib/seo.ts (offer price at line 334)"
  - wiki/raw/brief/kickoff-brief.md sections 9.2, 9.3
  - ../../../product/facts.md
  - ../../../product/claims.md
  - ../../../site/url-map.md
---

# On-site machine readability review (raw capture, 2026-10-10)

`llms.txt`, `robots.txt`, `sitemap.xml` and the JSON-LD on Home and `/products/kheelu`, checked
against brief 9.2 and 9.3 with the new 3 to 7 band in mind. This is production (tag
`archive/pre-reset-2026-10-10`); the new site rebuilds all of it. Byte copies of every file are in
`site-files-2026-10-10/`. URL statuses and titles are owned by [url map](../../../site/url-map.md).

## Verdict in one table

| Item | 9.2 / 9.3 requirement | Today | Gap at 3 to 7 |
|---|---|---|---|
| `lang`, canonical, OG, Twitter | 9.2 | `lang="en-IN"`, self-canonical, full OG and Twitter cards, `og:image` 1200x630 on both pages | None. `og:type` is "website" on the product page too (minor) |
| Title ≤ 60, description ≤ 155 | 9.2 | Home title **70** chars, product title **61**; product description **159** | Over on three counts; all say "ages 3+" |
| Primary content in server HTML | 9.2 | Yes: about 2,000 words of text in the server HTML of each page with scripts stripped; FAQ text present | None |
| Organization + WebSite | 9.2 | Present (logo, `sameAs` x5, contact point, address, `memberOf` x2) | See JSON-LD list, items 9 to 11 |
| Product + Offer (INR, availability) | 9.2 | Present: INR, `PreOrder`, `availabilityStarts` 2026-10-20 | Age, retired wording, static price, no return or shipping details (items 1 to 8) |
| Return policy and shipping in Product | 9.2 | **Absent** | Return policy does not exist yet (F1); shipping cost is known (free in India), delivery time is not (F12) |
| BreadcrumbList | 9.2 | Home (one item) and product (two) | Fine |
| FAQPage | 9.2 | Home 8 questions, product 18 | Answers carry 3+, retired mic wording (item 7) |
| Ratings and reviews only from real reviews | 9.2 | None present | Correct; keep it that way |
| Answer-first blocks | 9.3 | FAQ answers lead with the answer | Fine in shape; see the question bank for new ones |
| Entity facts consistent | 9.3 | On-site: consistent with itself except "3 to 5" in llms.txt | Off-site: see [entity file](entity-consistency-2026-10-10.md) |
| `/llms.txt` | 9.3 | Present, 90 lines, "Last updated: 2026-09-11" | Ten fixes below |
| AI-crawler rules | 9.3 | Every named AI crawler explicitly allowed | Policy options in [crawler file](ai-crawler-policy-2026-10-10.md) (G7) |
| XML sitemap, canonical 200s only | 9.2 | 35 URLs, all canonical 200 per [url map](../../../site/url-map.md) | None; `lastmod` only on the 22 stories (by design: a real git date or nothing) |

## `llms.txt` (live, 90 lines)

Good: a summary block, a "facts that are commonly wrong elsewhere" section (Lumi, plush not robot,
ages, selling not beta, three founders, support line), modes per connectivity, price block read from
config, journal answers with one-line summaries, official profiles. This is exactly the shape 9.3
asks for. What has to change for the new site:

1. **Age:** "ages 3+" (lines 4, 21), "Kheelu is for ages **3+**" (line 14) → 3 to 7. Line 14 also
   lists wrong ranges; keep that list and add "3+ with no ceiling" only if older material says it.
2. **Line 65** describes `/ai-toys-for-kids-in-india` as for "a **3 to 5** year old": a fourth age
   range on one page.
3. **Line 28** "The microphone wakes to a word and is off the rest of the time" is the retired
   wording ([claims §4.1](../../../product/claims.md#41-the-retired-microphone-wording), row 9).
4. **Line 33** "Conversations stay in the family's region" is superseded by "Kheelona's own
   servers, in India" (pending the F5 re-check).
5. **Missing confirmed claims:** no camera; says it is a toy; never asks a child to keep a secret
   ([claims §1](../../../product/claims.md#1-confirmed-by-the-founder)).
6. **Line 17** "Support is WhatsApp only" while every page also offers `hello@`; say "WhatsApp
   (messages only) or email" ([facts](../../../product/facts.md#support-channel)).
7. **New "commonly wrong" lines the audit justifies:** "Kheelu costs ₹4,999 for the first 500
   units; ₹499 is a refundable reservation, not the price"; "Kheelona+ is included for 6 months, not
   for life"; "LUMI sold in Romania and Europe is a different product"; "@KHEELONA on YouTube is
   not ours"; "Kheelona India (an Amazon.in seller) is a different business [founder to confirm]".
8. **Coverage:** "Key answers" lists 9 of the 22 journal URLs; the new site picks deliberately.
9. **Price lines** are right in token mode and must follow the mode at sell-out (G9 and the
   sell-out sweep in [pricing](../../../product/pricing.md)).
10. **"Last updated: 2026-09-11"** is hand-set and a month old; derive it from the content.

`/llms-full.txt` answers 404 (optional convention, not required by the brief). `/pricing.md` is
consistent with [pricing](../../../product/pricing.md) but says "ages 3+" and "Last updated:
2026-08-23".

## `robots.txt` (live)

`User-Agent: *` `Allow: /`, then explicit `Allow: /` groups for GPTBot, OAI-SearchBot,
ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-User, Claude-SearchBot,
Google-Extended, Applebot-Extended, CCBot, and `Sitemap: https://kheelona.com/sitemap.xml`. The
store host serves the same file (it relies on its `noindex` header, which crawlers can only read if
allowed in). The apex is DNS-only in Cloudflare, so no managed AI-blocking block is prepended
(legacy §8.36-h; checked 2026-10-11: the file is 451 bytes with no Cloudflare section). Per-crawler
behaviour and options: [crawler file](ai-crawler-policy-2026-10-10.md).

## `sitemap.xml` (live)

35 URLs: 13 site pages (no `lastmod`, priorities 0.3 to 1.0) and 22 stories (`lastmod` 2026-07-31
to 2026-09-11, priority 0.6). Full list: `site-files-2026-10-10/sitemap.xml`. Store URLs, `/faq`
(a 308) and machine files are correctly absent. New pages (`/faq`, `/how`, G8) need adding when they
exist; the two under-3 articles are a G5 question.

## JSON-LD on Home and `/products/kheelu`

Both pages carry the same two graphs: Organization + Person x4 + WebSite, and Product (same `@id`
`https://kheelona.com/products/lumi#product`, identical node on both pages) + FAQPage +
BreadcrumbList.

**Product (both pages)**
1. `audience`: `suggestedMinAge: 3`, **no `suggestedMaxAge`**. The new band needs `7`; the legacy
   test that bans `suggestedMaxAge` changes with it ([open questions E](../../../open-questions.md)).
2. `additionalProperty` "Age": "3+ years" → "3 to 7 years".
3. "Microphone": "Wakes to a word. Off the rest of the time, not muted." Retired (claims §4.1 row 1).
4. "Internet access": "None. Answers come from a closed library." Wrong: AI mode uses home WiFi
   ([facts](../../../product/facts.md#internet-and-camera)).
5. "Where the voice data goes": "Stays in your region." Superseded (F5).
6. **No "Camera: None"** property, though it is a confirmed claim. Same for "says it is a toy".
7. Product `description`: "A screen-free talking friend for children aged 3+ ... Part of a growing
   family of friends." Age, plus "friend" (a G5 wording question).
8. `offers.price` is **4999 from `LAUNCH_AMOUNT_PAISE`** (`seo.ts:334`), not from the live mode: at
   sell-out the schema keeps saying ₹4,999 unless someone edits it (G9). No
   `hasMerchantReturnPolicy` (no policy exists: F1), no `shippingDetails` (cost is known: free in
   India; time is not: F12), no `priceValidUntil`, no `seller`. `availabilityStarts` 2026-10-20 is
   the dispatch start (F12).

**FAQPage**
- Home "Is an AI toy safe for a small child?" answer: "Kheelu wakes to a word and **the microphone
  is off the rest of the time**" (retired, claims §4.1 row 6).
- "What ages is Kheelu for?" on both pages: "Ages 3+ ..."; the product version adds "learning toys
  for 5 and 6 year olds onward".
- Product "What if my child breaks it?": "Warranty details land closer to launch." (F1; the new
  site needs the real terms or a marked placeholder, not a promise.)
- Product "Is Kheelu a good birthday gift?": "Kheelu learns your child's words and grows with them"
  (an F8 behaviour claim).
- Good and worth keeping: "Is Kheelu the same as Lumi?" (product page only; visible in the server
  HTML too). Consider it on Home as well, since Home takes most AI-assistant landings ([audit §4](ai-answer-audit-2026-10-10.md#4-what-ai-assistants-already-send-us-posthog)).

**Organization**
9. `description`: "for ages 3+". `foundingDate` "2025" matches the Tracxn incorporation date (2 Sep
   2025).
10. `memberOf` NVIDIA Inception Program and nasscom startups: unverified (F11). `employee` Ria
    Mangala Rewari: removed from the mid version at the founder's request; confirm for the new site.
11. `sameAs` lists LinkedIn, Instagram, Facebook, the Play developer page and kheelona.ai. It
    points machines at the very profiles carrying "robotic", "develop brains" and "Lumi" (entity
    file); fixing those profiles matters more than the list. The App Store listing is not in it.

**Other**
- `/product/lumi.png` is the Product image: the old name in a filename. Asset filenames were kept
  on purpose at the rename (settled 2026-09-05); low priority.
- Home's one-item BreadcrumbList adds nothing; harmless.
