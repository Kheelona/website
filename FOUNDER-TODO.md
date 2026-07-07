# Founder TODO — everything waiting on you (nothing here blocks the build)

Each item unlocks something specific. Ordered by launch impact.

## THE REDESIGN ROUND (2026-07-08) — two items, these outrank everything below

**A. Pick a direction.** Four immersive wireframes are ready in `design-concepts/round-2-immersive/` (open the files in Chrome; each cross-links to the others; the dashed purple chips explain what the live 3D scene does). Pitches in that folder's README. Redlines and cross-direction mixes welcome. **The rebuild starts only after your pick.**

**B. Generate the two 3D models** (parallel to A, not blocking it): `3d-handoff/README.md` has the exact images, Tripo settings, and export format for the mascot (rigged + idle) and the Lumi plush; or hand the kit to a 3D artist (spec included). Download results to `~/Downloads` and say "models are in".

Everything below is the pre-existing launch list; it all carries over to the redesigned site unchanged.

## 0. Gemini assets — GENERATED, awaiting ingest (state as of 2026-07-07 night)
You generated 5 of 6 items; they sit in `~/Downloads` (3 image fixes + Veo shots 1-2). Claude's next session starts by ingesting them (exact steps in `docs/project-state.json` → `last_handoff.next_action`).
- **Still yours, when Gemini video credits reset (~24h from 2026-07-07 night)**: optional SHOT 3 "Cuddle" — attach `gemini-handoff/seed-3-cuddle.png`, prompt in `gemini-handoff/README.md`. The film works with 2 shots; this adds the cozy ending.
- **Then yours: approve the rebuilt V2 film** when Claude sends it.
- Settled this round: film = V2 "Two friends" Veo rebuild — **now LIVE on the site** (2026-07-08); the site is **2D everywhere** (all GLBs, R3F and three.js removed; hero uses the MascotScene parallax cutout); pink approved (cutout fixed); your 3 regenerated images ingested (green/right/left all pass); repo cleaned of superseded drafts/renders/teasers; **standing rule: all Gemini generation is done by you from Claude-prepared prompt kits, never by Claude directly** (in CLAUDE.md).
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
