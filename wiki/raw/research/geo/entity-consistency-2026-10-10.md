---
title: Off-site entity-fact consistency (raw capture, 2026-10-10)
type: raw-research
updated: 2026-10-10
sources:
  - "https://play.google.com/store/apps/details?id=com.kheelona.toyapp&hl=en_IN&gl=IN, GET 2026-10-11 02:01 UTC"
  - "https://play.google.com/store/apps/developer?id=Kheelona.com, GET 2026-10-11 02:01 UTC"
  - "https://apps.apple.com/in/app/kheelona/id6792490581, GET 2026-10-11 02:01 UTC"
  - "https://kheelona.ai/, /lumi, /llms.txt, /robots.txt, /sitemap.xml, GET 2026-10-11 02:02-02:04 UTC"
  - "https://www.linkedin.com/company/kheelona/ (logged-out HTML), GET 2026-10-11 02:05 UTC"
  - "https://www.instagram.com/kheelona/ and https://www.facebook.com/kheelona/ (logged-out, headless Chrome), 2026-10-11 02:07 UTC, engine-captures-2026-10-10/render-1.json"
  - "https://www.youtube.com/@kheelona, GET 2026-10-11 02:05 UTC"
  - "https://www.ynos.in/startup/kheelona-0604235 and https://www.cbinsights.com/company/kheelona (headless Chrome), 2026-10-11 02:27 UTC, render-3.json"
  - "https://tracxn.com/d/legal-entities/india/kheelona-robotics-private-limited/__kgRUM-B_NteY43NjcsJLwRE4xp9bigMHk-85hjqsNDI, GET 2026-10-11 02:26 UTC"
  - "https://www.f6s.com/kheelona and https://www.crunchbase.com/organization/kheelona: blocked (bot wall / 403), 2026-10-11"
  - "https://ailumitoy.com/en/lumi-smart-companion-toy/ (meta and partial text), render-4.json, 2026-10-11 02:29 UTC"
  - "gh repo view Kheelona/website, 2026-10-11; https://website-flame-tau-98.vercel.app/ HEAD 2026-10-11"
  - "WebSearch result lists (Amazon.in 'Kheelona India' listings), 2026-10-11"
  - ../../../product/facts.md
  - ../../../product/claims.md
---

# Off-site entity-fact consistency (raw capture, 2026-10-10)

Brief 9.3 asks that the brand, product name, what it is, the 3 to 7 age band, the price and the
safety story read the same everywhere. This is what each off-site source said on 2026-10-10
(captured 2026-10-11 UTC), set against the truth on [facts](../../../product/facts.md),
[pricing](../../../product/pricing.md) and [claims](../../../product/claims.md). Fixing these is the
founder's ([C6](../../../open-questions.md)); this file is the evidence. Phone numbers and
personal details are masked on purpose (the wiki may become public).

**The truth, in one line each:** Kheelona (Kheelona Robotics Private Limited, Bengaluru, three
co-founders) · product **Kheelu**, called Lumi until 2026-09-05 · a screen-free **plush** toy that
talks and answers back, not a robot · ages **3 to 7** on the new site (3+ live today) · **₹4,999**
for the first 500 units, a refundable **₹499** reserves one, **₹7,999** after, GST and delivery
included · no camera, says it is a toy, never asks a child to keep a secret, voice to Kheelona's
own servers in India (re-check F5) · no certification yet (F4).

## The table

| # | Source | URL | What it says (quoted or close) | What is wrong |
|---|---|---|---|---|
| 1 | **Google Play, parent app** | play.google.com/store/apps/details?id=com.kheelona.toyapp | Title "kheelona"; description **"App to Manage Lumi toy"**, also in `og:description`, `twitter:description` and a `SoftwareApplication` JSON-LD; "Lumi" 7 times in the HTML, "Kheelu" 0. About text: "Boosts vocabulary, verbal skills ...", "Helps children express feelings and build emotional confidence", "Grows with your child". "Rated for 3+". Data safety: **"No data collected"**, "No data shared". Support email `contact@`; developer phone ending 969; privacy link `https://www.kheelona.com/privacy`. Updated 19 Jul 2026, "10+ downloads" | Old name (unchanged since flagged 2026-09-11). "Boosts vocabulary" and "express feelings" are unconfirmed outcome claims ([claims §3-4](../../../product/claims.md#3-not-confirmed-do-not-publish)). **"No data collected" sits badly with a parent app that shows a child's full conversation log** ([facts, parent app](../../../product/facts.md#parent-app)): a declaration question for the founder and counsel (F5). Third contact email and second phone number. Privacy link costs a `www` redirect hop. |
| 2 | **Apple App Store (India)** | apps.apple.com/in/app/kheelona/id6792490581 | Subtitle **"Smart Brain Development Toy"**; "The Kheelona App seamlessly connects users with **Lumi** and other Kheelona toys ... Powered by advanced artificial intelligence and Large Language Models (LLMs) ... gamified educational activities, **physical dance sessions** ... stimulates cognitive growth". Age rating 4+. Privacy: "Data Linked to You": contact info (email, name, phone), **user content (photos or videos)**, identifiers. Developer website and privacy links go to `www.kheelona.com`. One rating, 5.0 | Old name. "Brain development toy" and "stimulates cognitive growth" break founder decision 4 ([claims §1](../../../product/claims.md#1-confirmed-by-the-founder)). "Dance sessions" conflicts with "no moving parts". Its privacy declaration contradicts the Play listing's "No data collected"; "photos or videos" needs explaining next to "no camera". 4+ is Apple's content rating, not our age band (legacy note: do not change it to 3+). |
| 3 | **kheelona.ai** (own sister site, B2B) | kheelona.ai, /lumi, /llms.txt | "Lumi" 28 times on Home, "Kheelu" 0. `/lumi`: "Lumi: a screen-free AI companion plush ... **breathes**", "Live with 10 families", image alt **"a soft blue dinosaur plush AI companion wearing a party hat"**, "Demo units sell to families at kheelona.com, and the public launch lands this quarter". FAQ (also in its FAQPage JSON-LD): **"Does Lumi work for special-needs children? Lumi was designed with special kids in mind"**. llms.txt: "Lumi live with 10 families daily (June 2026)", "breathing motion", "Public launch this quarter; evaluation units at kheelona.com" | The company's own second domain is the single largest "Lumi" source we found. Old art (cream rabbit since 2026-08-25). "Breathing motion" contradicts kheelona.com's "no moving parts". The special-needs answer is a health-adjacent claim the positioning bans ([claims §4](../../../product/claims.md#4-retired-or-banned-wording)). "Demo / evaluation units" contradicts paid pre-orders. Its Organization `sameAs` correctly points at kheelona.com. |
| 4 | **LinkedIn company page** | linkedin.com/company/kheelona | Tagline "Smartest Toys for Sharpest Minds"; About **"India's First Robotic brand focusing on Tiny Explorers"**; industry Retail; website `www.kheelona.com`; 395 followers. A post of 7 Sep 2026, two days after the rename, still says Lumi ("the story behind Lumi", CNA) | "Robotic" feeds the "robot" error in AI answers (flagged 2026-09-11, unchanged). "India's First" is unsourced. "Sharpest Minds" is the smarter-child framing the never-say list bans. |
| 5 | **Instagram @kheelona** | instagram.com/kheelona | Bio: **"🧠AI toys that develop brains / 🗨️A safe toy that speeks in every language. / Limited Launch volume. / Reserve now at ₹499/-"**, link store.kheelona.com; 116 followers, 14 posts | "Develop brains" is banned wording (decision 4). "Every language" overstates 8 named, up to 10. Typo "speeks". "Reserve now at ₹499" with no ₹4,999 is the same ambiguity Bing's AI turned into "priced at ₹499". |
| 6 | **Facebook page** | facebook.com/kheelona | "Kheelona, Bangalore", Games/toys, 641 followers; address **BTM Layout, Bangalore**; phone ending 793; email `connect@`; website kheelona.com; "Always open". Post of 19 Sep: "Kheelu, the screen-free AI toy that teaches without her noticing. Pre-orders open. ₹499, fully ..." | Third phone number; the published support line is WhatsApp only ([facts](../../../product/facts.md#support-channel)). Address differs from the site's Jayanagar address (the site uses the GST principal place; the BTM address matches the MCA registered office, row 9). |
| 7 | **YNOS** | ynos.in/startup/kheelona-0604235 | Name **"KHAEELON"** "(KHEELONA ROBOTICS PRIVATE LIMITED)"; "founded in 2025 by **Aman, & Apoorva Sahu**"; About: **"Kheelu Mode is a startup creating interactive, offline learning experiences for children through Lumi"** | Misspelt brand, old product name, a retired mode name as the company, two founders instead of three, offline-only description. Has a "suggest edits" link. |
| 8 | **CB Insights** ("Unclaimed") | cbinsights.com/company/kheelona | "Kheelona is a company that creates AI toys designed to support language development and learning in children. Their product, Kheelu, interacts with children through conversation, stories, and games, **adapting to their learning pace** and language preferences. The toy includes **memory technology that tracks a child's progress** ... by not connecting to the open internet. It is based in Bengaluru" | Right name. "Adapting" and "tracks progress" are unconfirmed (F8). **Bing's AI summary copied this text word for word** ([audit](ai-answer-audit-2026-10-10.md)). Unclaimed, so the founder can claim and correct it. |
| 9 | **Tracxn** (legal entity only) | tracxn.com/d/legal-entities/india/kheelona-robotics-private-limited/... | "Incorporated on Sep 02, 2025", ROC Bangalore, registered address BTM Layout 560076, MCA class "manufacture of other games and toys n.e.c.", Active; "Last updated: September 30, 2026". No brand profile (`/d/companies/kheelona` is 404) | Not wrong. The registered-office address differs from the address on kheelona.com and Play; which one belongs in the legal disclosures is F2/F3. |
| 10 | **F6S** | f6s.com/kheelona | Not read: bot wall ("Checking your browser") | Legacy (2026-09-11): "Lumi", ages 2 to 8, two founders. Unverified today. |
| 11 | **Crunchbase** | crunchbase.com/organization/kheelona | Not read: 403 challenge | Unknown whether a profile exists. |
| 12 | **YouTube @KHEELONA** | youtube.com/@kheelona | Resolves to a channel titled "📊 video" posting unrelated Shorts ("Yarn factory") | **The handle is not ours.** No official channel found. Schema `sameAs` rightly omits YouTube; a channel would be a new asset. |
| 13 | **GitHub Kheelona/website** (this repo, public) | github.com/Kheelona/website | README states the offer and the rename correctly; WebSearch cites it as a source. Repo "website" field: `https://website-flame-tau-98.vercel.app` | That URL answers **404 DEPLOYMENT_NOT_FOUND**. The repo is read by answer engines, which matters for [Q1](../../../open-questions.md). |
| 14 | **Stale index of www.kheelona.com** (WebSearch tool) | www.kheelona.com | "Lumi, the most intelligent AI-powered talking toy ... pre-order price of INR 2,999 (listed down from Rs 5999) ... pink, green, and blue" | A pre-revamp snapshot; `www` 308s to the apex today. Nothing on our side to change; it ages out when that index re-crawls. |
| 15 | **Name collisions (not ours)** | amazon.in/Kheelona-India-Cradle-mobiles-5_KHEEL_149/dp/B0B3S37Z4Z; instagram.com/kheelona_india; khilonaghar.com; ailumitoy.com | "Kheelona India" sells cradle mobiles on Amazon.in and "Games/Wooden Toys/Educational" on Instagram (1,163 followers). **"LUMI", a talking plush sold from Romania across Europe** (57 €, "children between 3 and 10", "2,400+ families"). Bing also offers "Khilona" spellings and a 1970 film | Engines can merge any of these with us. The Romanian LUMI explains the Romanian "lumi jucarie" queries in the legacy GSC data. Whether "Kheelona India" is connected to the company is a founder question. |
| 16 | **Press** | (CNA link only via LinkedIn short link) | LinkedIn says CNA featured Kheelona at Bengaluru Tech Week, "the story behind Lumi" | No engine indexed the CNA piece; no YourStory or Inc42 coverage of Kheelona found (YourStory covers competitor MyWonder). Press cannot be cited until it is findable (F11 territory). |
| 17 | **Internshala** | internshala.com (job listings) | Employer "Kheelona.com" for design and video roles | No entity facts. Was a Perplexity citation on 2026-09-11. |

## What the table adds up to

1. **Name:** "Lumi" is still the current name on six sources, two of them our own (kheelona.ai and
   both app listings). kheelona.ai alone uses it 28 times on one page.
2. **What it is:** "robot" (LinkedIn), "breathes" and "dance sessions" (kheelona.ai, App Store)
   contradict "plush toy, no moving parts".
3. **Age:** no off-site source says 3 to 7. Play 3+, App Store 4+ (content rating), legacy F6S 2 to 8;
   CB Insights and YNOS give none.
4. **Price:** only Instagram and Facebook state one, both as "₹499", which is the reservation, not
   the price. One engine already repeats that error.
5. **Safety and data:** no source states the confirmed claims (no camera, says it is a toy, India
   servers). The two app listings declare **opposite** data practices ("No data collected" vs
   contact info, photos or videos and identifiers linked to the user). That is a 9.7 issue, not
   only GEO.
6. **Banned or unconfirmed claims off-site:** "develop brains" (Instagram), "Brain Development Toy"
   and "stimulates cognitive growth" (App Store), "Boosts vocabulary" and "express feelings"
   (Play), "special-needs" (kheelona.ai), "Sharpest Minds" (LinkedIn).
7. **Contact:** four emails (`hello@` site, `contact@` Play, `connect@` Facebook and kheelona.ai,
   `dev@` Play developer) and three phone numbers across sources; the site publishes one WhatsApp
   line.

## Suggested order for the founder (C6), by how much each source feeds answers

1. kheelona.ai: Lumi to Kheelu (or "Kheelu, formerly Lumi"), new art, drop "breathes" for the
   consumer product, remove the special-needs FAQ, replace "demo units" with the pre-order.
2. Google Play: name and description (drafts exist in the legacy `docs/seo/app-store-listings-2026-09-12.md`
   at the archive tag), remove outcome claims, review the Data safety form against the app.
3. App Store: description and subtitle, and its privacy labels against Play's.
4. CB Insights: claim the profile, remove "adapting" and "tracks progress".
5. Instagram bio, LinkedIn About and tagline, Facebook phone and address: one set of words
   (the legacy drafts said "3+"; they need 3 to 7 first).
6. YNOS: "suggest edits" (name, three founders, description). F6S and Crunchbase: check by hand.
