# Founder TODO — everything waiting on you (nothing here blocks the build)

Each item unlocks something specific. Ordered by launch impact.

## THE REDESIGN (2026-07-08/09) — DONE and on master; deploying is yours

Direction picked (Lumi's World + pop-up elements), both models generated and verified, Home rebuilt as the immersive journey, ribbon nav removed on your feedback. Merged to `master`, temp-live for feedback per your call.

**Deployed (2026-07-10):** https://website-hdn2.vercel.app — GitHub `Kheelona/website`, branch `demo-website`, Vercel Root Directory `site`. Still yours when ready: the two `NEXT_PUBLIC_*` env vars in Vercel (Tally URL makes the reserve form go live; GA4 id starts measuring) and pointing kheelona.com DNS when this stops being temporary. The wireframe round (`design-concepts/round-2-immersive/`) and model kit (`3d-handoff/`) stay in the repo as the design record.

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

## 1. Tally form link (unlocks: the site actually converting)
Create the Tally form with exactly these fields: parent name, email, WhatsApp number, WhatsApp consent checkbox, child's birth month, city. Turn on the confirmation email. Then paste the share URL into `.env` at the repo root as `NEXT_PUBLIC_TALLY_FORM_URL=` (and into Vercel env settings when deploying). The reserve panel on every page switches from the "opens soon" card to the live form automatically.
- Also confirm: the consent text in Tally should match the site's promise "Your WhatsApp number is only for updates about your reservation. You can leave the list anytime." If your Tally wording differs, tell Claude and the site line gets updated.

## 2. Vercel deploy (unlocks: the site being live)
Run `vercel` (or connect the GitHub repo in the Vercel dashboard) with project root = `site/`. Add the env vars from `.env`. Point kheelona.com DNS at Vercel. Claude can drive everything after `vercel login` happens in your terminal (`! npx vercel login`).

## 3. Testimonials (unlocks: the strongest missing trust signal)
Three real quotes, each with parent name, child age, city, and written consent. The section is already built (`ParentVoices`) and unmounts itself until quotes exist; paste them to Claude and it goes live on Home.

## 4. Certifications + specs (unlocks: Safety page completeness + specs blocks)
- Toy-safety standards/certificates once testing completes (exact names and numbers).
- Final specs: battery life, size and weight, materials, the wake word, charger details.
- These fill the flagged "published before Lumi ships" spots on /safety, /products/lumi, /setup.

## 5. Ship date (unlocks: the FAQ answer + urgency)
Currently answered honestly as "not announced yet."

## 6. Contact email (unlocks: footer contact + Privacy page contact route)
Footer currently omits contact entirely (better than "pending").

## 7. The 10 languages list (unlocks: the top AEO answer for India)
"Which languages does Lumi speak?" currently answers "ten." Naming them is the single best answer-engine content on this product. Send the list.

## 8. GA4 measurement ID (unlocks: measuring conversion)
Create a GA4 property, put the `G-...` id in `.env` as `NEXT_PUBLIC_GA4_MEASUREMENT_ID`. Event stubs (`preorder_view` etc.) are already wired; the gtag snippet gets added when the ID exists. Also: verify Search Console after deploy.

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
