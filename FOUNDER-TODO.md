# Founder TODO — everything waiting on you (nothing here blocks the build)

Each item unlocks something specific. Ordered by launch impact.

## ✅ #0 — LAUNCH IS DONE (2026-07-28). Nothing here blocks anything.

**https://kheelona.com is live and taking reservations.** Everything that was blocking has cleared,
in this order, all on 2026-07-28:

| Was blocking | Now |
|---|---|
| Vercel Root Directory said `site` | cleared to the repo root; builds succeed |
| kheelona.com DNS | pointed; apex is the canonical host, `www` 308s to it |
| Pre-order form | live — Tally `Y5XW7J`, `NEXT_PUBLIC_TALLY_FORM_URL` set in production |
| Analytics | Vercel Web Analytics + GA4 `G-7LMKSFEXZ9`, both verified firing on the live domain |
| Search Console | domain property verified, sitemap processed, 24 pages discovered |
| Bing Webmaster | sitemap submitted |

Two things about the live setup worth remembering rather than rediscovering:
- **The preview (website-hdn2.vercel.app) still shows the "opens soon" card**, because the Tally env
  var is scoped to production only. That is expected, not a fault.
- **GA4 only fires on `kheelona.com` and `www.kheelona.com`** by design, so no localhost run or
  preview deploy pollutes your reports. If the canonical host ever changes, `GA4_HOSTS` in
  `src/config/site.ts` must change with it, or the tag goes silently dead.

## THE REVAMP (2026-07-24) — theme B + V3 are BUILT, MERGED to `main` and verified; these are yours

Status + everything already decided: `docs/revamp-2026-07/WORKING.md`.

**► REVIEW URL: https://website-hdn2.vercel.app** — but read #0 first. It is currently serving a
**pre-fix bundle** (last successfully built 2026-07-25), so the home hero shows a broken image
where Lumi should be. That is fixed and pushed; it reaches the URL when the Root Directory setting
is cleared. The whole site is rebuilt on theme B plus the V3 repositioning: Home,
/products/lumi, and all 8 interior routes. What to know while you look:
- Visitor counting is now live through Vercel Web Analytics, which needs nothing from you beyond
  keeping it enabled in the dashboard. GA4 is a separate, optional thing and is NOT wired (item 8).
- The reserve panel still shows the "opens soon" card, because the two
  `NEXT_PUBLIC_*` env vars are not set in Vercel (items 1 and 2 below).
- The Home hero uses INTERIM composed art until REV-a lands, so Kheelu appears twice there.
- Gated copy is deliberately live on this preview and does not reach `main` until you sign off:
  every Kheelu speech line, and the /safety answer block "Is an AI toy OK for a three-year-old?".
- Wireframe B is still at /b if you want to compare.
- One thing to judge: at around 1200px browser width the Kheelu guide covers the first ~100px of
  the room text column and hides a few words per line. It is clean on wider screens. Say the
  word and he shrinks and shifts on narrow desktops.
- **Phones were fixed on 2026-07-25** after you flagged them: the page no longer slides sideways,
  the bottom Kheelu bar is one line with its Reserve button fully on screen, nothing is cropped
  on the right, and the "How Lumi compares" table is now one card per claim instead of a table
  you had to swipe. Checked at 320/360/390/430px on every route. **Please re-check on your own
  phone** — that is the one thing emulation cannot confirm.

**V3 IS BUILT AND LIVE ON THE PREVIEW (2026-07-28).** The repositioning from your YC
application shipped: the site now argues 40% fun / 20% brain development / 40% education with
the friend story still leading. New on the site — a Learning room that shows Kheelu mode as a
real exchange (Lumi tells the tortoise story, the child interrupts, Lumi asks one back), a
short brain-development room on serve and return, the pipeline (Lumi → Kheelu Speaker → AI
books) with age chips reading 2 to 14, Kheelona+ stated plainly as "6 months included, price
announced before launch", the tutor line under the comparison, footnotes on the two claims that
invite a follow-up, a WhatsApp share link at the finale, and "Designed by parents in
Bengaluru." in the footer. Lumi's age band now reads 2 to 5 everywhere.

Spec: `docs/revamp-2026-07/BUILD-V3.md`. **Your gates, all of which BLOCK merge to main
(the preview is fine):**
- **V3-a. Real testimonials — FOUNDER DECIDED 2026-07-28: the drafted quotes STAY LIVE as they
  are.** Raised once, when the site went public, on the ground that three quotes attributed to
  named people (Shweta, Priyamvada, Gaurav, labelled "Pilot parent") read as real endorsements
  and are not marked as illustrative. The founder's call is to leave them. Recorded so nobody
  re-raises it or "fixes" it. Real quotes are still welcome and swap in cleanly.
- **V3-a (original wording). Real testimonials** — the site will carry three named quote slots (Shweta,
  Priyamvada, Gaurav) with clearly-marked placeholder text you asked for. Send each person's
  real words + consent and they replace the placeholders verbatim.
- **V3-b. Kheelona+ facts** — the site says only "6 months included, monthly price announced
  before launch." Two facts stay yours: (1) the ₹ monthly price, (2) what Lumi does if the
  subscription lapses. Nothing about either is claimed until you state them.
- **V3-c. Pipeline art** — Kheelu Speaker + AI book renders via the Gemini kit the build will
  prepare (`gemini-handoff/pipeline-2026-07/`); calm placeholders until then.
- **V3-d. Kheelu lines v3** — three new guide lines join the existing sign-off queue (list in
  BUILD-V3.md §6.4): "This is the part where the games are secretly lessons.", "The Speaker is
  my cousin. Louder, and better at maths.", and "I only ever have one child to keep up with."
  (the last one on the new pace panel).
- **V3-f. Named article authors (the biggest remaining authority win)** — AI engines and Google
  both weight named authors with credentials. The 14 journal articles are currently attributed to
  "Kheelona" as an organisation. Tell me who wrote each one (or who should be credited as the
  reviewer) and the bylines plus author schema go in. Aman's 14 patents and Kashyap's Intel
  background are exactly the credentials that make a piece citable.
- **V3-g. Search Console + Bing — ✅ DONE 2026-07-28.** Google Search Console verified as a DOMAIN property (`sc-domain:kheelona.com`, so apex + www + http/https are all covered) and `sitemap.xml` processed successfully: **24 discovered pages**, matching the 24 the site emits. Bing Webmaster Tools submitted and processing. Nothing left here for you.
  the domain or submit the sitemap without your account. Once kheelona.com points at Vercel: add
  the property, verify, submit `https://kheelona.com/sitemap.xml`, and check the Coverage report.
  Until this is done Google discovers us slowly and we are blind to what it thinks.
- **V3-h. The ₹2,999 problem is now the biggest active SEO liability (was REV-c)** — the old Wix
  pages and the Play Store listing still show ₹2,999 in Google's index, competing with our own
  pricing for our own brand name. Two halves: the Play Store copy is yours to edit; the 301
  redirects from `/product-page/lumi-*` are mine, and I can only add them once DNS points at
  Vercel.
- **V3-i. Backlinks, when you want the campaign** — a new domain ranks on authority it does not have
  yet. The realistic first wave is directory and listing submissions (Product Hunt, BetaList, Indian
  startup directories, AI-toy roundups, FirstCry-style retail listings) plus any press from the
  Karnataka Elevate and NVIDIA Inception programmes. I have a `directory-submissions` skill ready
  for this; say the word and I will produce the submission kit and tracker.

- **V3-e (small, yours)**: the site lets parents pick a Lumi colour, but the Tally form has
  no colour field, so the preference is lost. Consider adding one (blue/green/pink) to the
  form. And once the V3-c/REV-a art lands, the share image (`og.png`) gets refreshed to match.
- **The Apple-tier pass verdict (benchmarks-v3.md Pass 2)**: the site structure is at tier;
  the gap only you can close is ASSET QUALITY. The two highest-leverage items on this whole
  list are REV-a (final hero art) and R9-a (real photos of Lumi in children's hands). They
  are worth more than any further copy round.
- Superseded by your V3 answers: REV-b(1) subscription (now published per V3-b wording) and
  the "ten families" line (removed; no pilot counts anywhere). REV-b(4) stays open for the
  NAMED language list only.

- **REV-a. Hero art (the one that unblocks the new Home hero)** — run the kit in
  `gemini-handoff/hero-2026-07/README.md` (3 reference images + one prompt + a 4K follow-up),
  drop the result in `~/Downloads`, say "hero art is in". Until then previews use interim
  composed art.
- **REV-b. Four product facts the new copy needs** (research memo `docs/revamp-2026-07/research.md`):
  (1) subscription: yes/no, and what stays free — "no subscription" is the incumbent's sorest
  point in Indian reviews, we can only say it if true; (2) camera: yes/no — if none, it is a
  one-line trust differentiator; (3) ship window (existing item 5 — never invented); (4) the 10
  languages, named (existing item 7).
- **REV-c. Stale ₹2,999 price in Google's index** — the old Wix site (kheelona.com/product-page/
  lumi-pink, "Kheelona Robotics") and the Play Store listing (com.kheelona.toyapp) still show
  ₹2,999. Until the new site ships with 301s from `/product-page/lumi-*` and the Play Store
  copy is updated to ₹4,999, search engines and AI answers can quote the old price against us.
  Play Store edit is yours; the 301s are queued in the build.
- **REV-d. 3 mobile app images — NOW ASKABLE (the gate cleared).** Your brief said to ask only
  after the v1 deploy; that deploy happened 2026-07-25 (link above). Drop them in `~/Downloads`
  and say "app images are in". They land in the parent-app rooms on Home, /playos, and
  /products/lumi, which currently reuse the three existing dashboard screenshots.

## THE REDESIGN (2026-07-08/09) — DONE and on master; deploying is yours

Direction picked (Lumi's World + pop-up elements), both models generated and verified, Home rebuilt as the immersive journey, ribbon nav removed on your feedback. Merged to `master`, temp-live for feedback per your call.

**Deployed (2026-07-10; branch updated to the theme-B revamp on 2026-07-25):** https://website-hdn2.vercel.app — GitHub `Kheelona/website`, branch `demo-website`, Vercel Root Directory = repo root (was `site`; the app moved on 2026-07-28). That URL now serves the revamp, not this redesign; the redesign remains on `main`. Still yours when ready: the two `NEXT_PUBLIC_*` env vars in Vercel (the Tally URL makes the reserve form go live; the GA4 id measures nothing until GA4 is actually
wired, item 8 — visitor counting already works through Vercel Web Analytics) and pointing kheelona.com DNS when this stops being temporary. The wireframe round (`design-concepts/round-2-immersive/`) and model kit (`3d-handoff/`) stay in the repo as the design record.

Everything below is the pre-existing launch list; it all carries over to the redesigned site unchanged.

## R7 SISTER-SITE ENRICHMENT (2026-07-10) — done; two old blockers RESOLVED

kheelona.ai became the sanctioned content/design reference on your direction. Team page now has photos, full bios, pull-quotes, LinkedIn; Home gained the recognition strip, the safety callout, the parent-app section (real dashboard), and three REAL early-tester quotes from your published site — the testimonials placeholder blocker and the "backed by" TODO are both closed. One flag for your eyes in the visual pack: Kashyap's bio now names Thunderbolt 4/5 (your kheelona.ai bio publishes it; the old rule here was "name only Intel") — say the word if you want it trimmed.

## R5 CALM PASS (2026-07-10) — done on your feedback; one new item for you

Your review landed: home is now the calm ambient treatment (the /playos register you preferred), 2D mascot + 2D Lumi everywhere (3D one prop-flip away), no italics, all text left-aligned, white button/band text on accessible deep fills, feelings boxed, sticky pre-order bar never hides, shapes fewer/fainter/never over text.

- **R5-a. New Kheelona logo** — you said you'll upload it later; the current wordmark stays until then. When it lands in `~/Downloads`, Claude swaps navbar, share image, and structured-data mark in one pass.

## R4 POLISH CYCLE (2026-07-10) — six decisions parked for you (site ships fine without them)

The design panel review (`docs/design-review-2026-07-10.md`) surfaced these; each is a quick call or an asset, none blocks the deploy:

- **R4-a. Reorder Home so Safety follows "Meet Lumi"** — the panel's strongest structural note: for Indian parents, safety is the gating objection and it currently answers at ~85% scroll depth. One yes/no from you; the section + 3D beat swap is ready work.
- **R4-b. Warm Lumi "beauty shot" for the /products/lumi hero** — the current render reads cool; a warm 2D shot would sell the hug. Claude prepares the Gemini prompt kit on your go.
- **R4-c. Reuse the price band ("Under ₹4 a day…", "Reserving now does not commit you to buy.") on Home after the compare table** — copy already exists on /products/lumi; this is a placement approval.
- **R4-d. Hero composition: bring the Lumi plush in next to Robu** — first-time visitors reserve Lumi but meet only the mascot in frame one. Staging change to the founder-blessed hero, so it's yours.
- **R4-e. Founder strip in the Home finale** — your real credibility (14 patents, Intel) is only on /team; a compact strip before the closing CTA would put humans behind the mic. New Home section, needs your yes.
- **R4-f. 7 journal hero images** — prompts are ready in `docs/stories-image-prompts.md`; cards use mascot placeholders until these exist.


## 0. Gemini assets — GENERATED, awaiting ingest (state as of 2026-07-07 night)
You generated 5 of 6 items; they sit in `~/Downloads` (3 image fixes + Veo shots 1-2). Claude's next session starts by ingesting them (exact steps in `docs/project-state.json` → `last_handoff.next_action`).
- **Still yours, when Gemini video credits reset (~24h from 2026-07-07 night)**: optional SHOT 3 "Cuddle" — attach `gemini-handoff/seed-3-cuddle.png`, prompt in `gemini-handoff/README.md`. The film works with 2 shots; this adds the cozy ending.
- **Then yours: approve the rebuilt V2 film** when Claude sends it.
- Settled this round: film = V2 "Two friends" Veo rebuild — **now LIVE on the site** (2026-07-08); the site was **2D everywhere** at that point (superseded 2026-07-09 by the immersive R3F redesign now on master); pink approved (cutout fixed); your 3 regenerated images ingested (green/right/left all pass); repo cleaned of superseded drafts/renders/teasers; **standing rule: all Gemini generation is done by you from Claude-prepared prompt kits, never by Claude directly** (in CLAUDE.md).
- Optional, whenever credits allow: SHOT 3 "Cuddle" (`gemini-handoff/seed-3-cuddle.png` + prompt in the README there) to extend the film's ending.

## 1. ✅ DONE 2026-07-28 — Tally form link (unlocked: the site actually converting)
Live: `https://tally.so/r/Y5XW7J`, set as `NEXT_PUBLIC_TALLY_FORM_URL` in Vercel production. All six
fields present and correctly typed, Submit reachable (the iframe was raised 560px → 960px on the day,
because the form measures 886px and Submit had been below the frame's own fold). Your Tally consent
wording matches the site line. `preorder_view` now reaches GA4.

<details><summary>Original instructions, kept for reference</summary>

Create the Tally form with exactly these fields: parent name, email, WhatsApp number, WhatsApp consent checkbox, child's birth month, city. Turn on the confirmation email. Then paste the share URL into `.env` at the repo root as `NEXT_PUBLIC_TALLY_FORM_URL=` (and into Vercel env settings when deploying). The reserve panel on every page switches from the "opens soon" card to the live form automatically.
- Also confirm: the consent text in Tally should match the site's promise "Your WhatsApp number is only for updates about your reservation. You can leave the list anytime." If your Tally wording differs, tell Claude and the site line gets updated.
</details>

## 2. ✅ DONE 2026-07-28 — Vercel deploy (unlocked: the site being live)
Live at https://kheelona.com, apex canonical, `www` 308s to it, Root Directory = repo root.
Env vars set in production. Claude has NO Vercel access and never runs the Vercel CLI: it pushes to
GitHub and hands you any dashboard change.

<details><summary>Original instructions</summary>

Run `vercel` (or connect the GitHub repo in the Vercel dashboard) with Root Directory = the repo root (leave it empty). Add the env vars from `.env`. Point kheelona.com DNS at Vercel. Claude can drive everything after `vercel login` happens in your terminal (`! npx vercel login`).
</details>

## 3. CLOSED BY YOUR DECISION 2026-07-28 — Testimonials
The three drafted quotes attributed to Shweta, Priyamvada and Gaurav ("Pilot parent") **stay live as
they are**. Raised once when the site went public, on the ground that nothing marks them as
illustrative; your call was to leave them. Recorded so it is not re-raised. Real quotes still swap in
cleanly whenever you have them: paste them to Claude.

<details><summary>Original ask</summary>

Three real quotes, each with parent name, child age, city, and written consent. The section is already built (`ParentVoices`) and unmounts itself until quotes exist; paste them to Claude and it goes live on Home.
</details>

## 4. Certifications + specs (unlocks: Safety page completeness + specs blocks)
- Toy-safety standards/certificates once testing completes (exact names and numbers).
- Final specs: battery life, size and weight, materials, the wake word, charger details.
- These fill the flagged "published before Lumi ships" spots on /safety, /products/lumi, /setup.

## 5. Ship date (unlocks: the FAQ answer + urgency)
Currently answered honestly as "not announced yet."

## 6. ✅ DONE 2026-07-28 — Contact email
`hello@kheelona.com`, founder-confirmed, live in the footer and on /contact. The phone number beside
it on the legacy Wix site was `+91 98765 43210`, the canonical fake Indian number, and is never
published. If a real phone line appears it needs the same confirmation before it goes on the site.

## 7. The 10 languages list (unlocks: the top AEO answer for India)
"Which languages does Lumi speak?" currently answers "ten." Naming them is the single best answer-engine content on this product. Send the list.

## 8. GA4 — ✅ DONE 2026-07-28, nothing left for you (unlocks: conversion funnels)
**Both analytics tools are wired and verified.** Vercel Web Analytics (cookieless) and GA4
(`G-7LMKSFEXZ9`, your `kheelona.com` stream) are both in the app layout. You do not need to paste
an ID anywhere: it is in the code, because a measurement ID is a public identifier, not a secret.

Manual gtag install, not Tag Manager, for the reason Google's own dialog recommends it: GTM would
ship a container runtime roughly three times the size to solve a problem you do not have, and this
site's mobile performance was won back a point at a time.

**The tag only fires on kheelona.com and www.kheelona.com.** Not on localhost, not on preview
deploys. Without that, every test run of mine would land in your reports and you could not trust
the numbers. One consequence worth knowing: **your GA4 reports will stay empty until DNS points at
Vercel**, because that is the only place the tag runs. The preview URL will never report.

While proving the wiring works I briefly allowed localhost and loaded the real tag, so **expect one
or two page views with a hostname of `localhost` in your property**, dated 2026-07-28. That is me,
not a visitor. It also means the "Data collection isn't active" warning on your stream should now
have cleared, which is the confirmation that the ID and the snippet are right. Filter it out under
Admin, Data Streams, your stream, Configure tag settings, Define internal traffic if you want the
history perfectly clean.

GA4 would add what Vercel Analytics does not do: custom conversion events and funnels. **Correcting
an older claim on this line: GA4 is NOT wired.** There is no gtag snippet anywhere in the app; the
`preorder_view` stub in `TallyEmbed` pushes to a `window.gtag` that nothing defines. So setting
`NEXT_PUBLIC_GA4_MEASUREMENT_ID` today measures nothing. If you want GA4, create the property and
share the `G-...` id, and the snippet plus consent handling gets built then. If you do not, Vercel
Analytics is enough to see whether the pre-order page is working. Either way: verify Search Console
after deploy (V3-g).

## 9. Judge the 3D mascot (regenerated 2026-07-07)
The two-faced v1 was regenerated from cleaned multi-view inputs; the new model (idle animation, single face, sharper texture) is live in the home hero, and a Lumi plush 3D turntable is on /products/lumi. Judge both on http://localhost:3456. Retry credits remain (745 left) if anything bothers you.

## 10. Legal counsel review (launch gate)
/privacy and /terms are plain-language drafts written to be fair; they must be reviewed by counsel before launch. Both carry TODO flags in code.

## 11. Investor "backed by" band (optional, /team)
Names/logos when you are ready to show them.

## Known tradeoffs already documented
- Mobile Lighthouse performance is 85 (desktop 99): the hero character image on simulated slow 4G. Acceptable per blueprint §3; further squeezing possible with a smaller mobile hero render if you want it.
- The finale renders the Tally form instead of the PDF's plain button: deliberate conversion decision, recorded in the copy reference.
- PDF's teal/terracotta section-label colors were swapped to a darker accent at label sizes: accessibility (WCAG AA) is a locked 90+ gate and won.

## R9 FRIEND-FEEDBACK ROUND (2026-07-10/11) — done; three items for you

Your friend's audit is fully dispositioned (docs/qa-report.md R9). Kheelu now narrates the site, the plush owns the hero, the 500-unit cap is live, one CTA verb everywhere. New items only you can unlock:

- **R9-a. Real photography** (your friend's strongest conversion point: "renders build the vibe; real photography builds the purchase decision"). Shot list, in priority order: (1) the plush in a child's hands — scale; (2) fabric/texture macro; (3) a short loop of the breathing motion (phone video is fine); (4) where the mic and button sit. When files land in ~/Downloads, Claude builds a "the real thing" strip on /products/lumi and swaps the trust moments on Home.
- **R9-b. Testimonial faces** — the three pilot quotes are live but anonymous. One real first name + photo (or a 20-second parent video) with written consent turns the weakest trust signal into the strongest. Ties into existing item 3.
- **R9-c. Kheelu voice check** — Kheelu's speech lines (list: docs/copy-reference.md R9) were approved in the plan, but read them once on the live page; wording tweaks are one-line changes.
- Resolved this round: the mascot's public name is **Kheelu** (your card); urgency = "first 500 units at ₹4,999" (your number, now on hero/finale/mid-page).

## R10 (2026-07-11) — one item for you
- **R10-a. Ria's sign-off on her card**: bio + quote were drafted from her public profile and approved by you in the plan; have Ria read her card on /team once — any wording change is a one-line edit. Also say the word if you want a different photo crop.

## R11 (2026-07-11) — two items for you
- **R11-a. Read the two new pages live**: the Home hero now demonstrates Lumi with the moon exchange (desktop shows it typing in; phones show it settled), and /playos is the platform story (family renders, the real Magic Box photo, six safety layers, the "brain keeps growing" note). Everything is adapted from your published kheelona.ai copy — flag any line you want tuned.
- **R11-b. Two de-contracted lines**: the voice gate (no contractions outside Kheelu) outranked your published .ai phrasing in two spots — "whether it is safe" (Home safety callout) and "Nothing stays that you cannot delete." (/safety). If you prefer the original contractions as sanctioned exceptions, say so and they go back in one line each.
- Also for your eyes: Ria's photo is re-cut on a pale lavender background (the checkerboard in the source file was baked-in fake transparency); her card sign-off (R10-a) still stands.
