# Copy Reference (Phase 5 compile)

The source of truth for all rendered copy is the component/page code itself; this file records provenance, deviations, and where each page's copy lives. All copy passed voice-lint §1.7 (zero em-dashes; en-dash unused; no hype; exact names; second person present tense) and was audited by an independent copywriter review (2026-07-06, grade B+ → fixes applied, see `docs/checkpoints/executive-review-round-1.md`).

## Home `/` — VERBATIM from `kheelona homepage website content.pdf`
Copy lives in `site/components/sections/home/*.tsx`. Blue-box copy reproduced exactly, with these sanctioned/recorded deviations:
1. "Rs." → "₹" site-wide (prompt §1.10).
2. S09 Parent voices: section headline is built but UNMOUNTED until real testimonials exist (claims register §1.9; empty placeholders read as vaporware per CMO review).
3. S11 Footer CTA: the PDF's `[BUTTON] Join the pre-order list` is implemented as the inline Tally reservation form + surrounding verbatim copy (deliberate conversion decision). The button label lives on in nav/CTAs.
4. PDF label colors (brand green/terracotta small caps) rendered as Instrument Serif italic 24px in orange-deep: WCAG AA at label sizes (a11y gate).
5. Hero staging (founder-approved 2026-07-07): the hero keeps the headline, the first two sentences of the lede, the CTA, and the price line; the remaining hero sentences render verbatim and in order as oversized staged lines in `StagedIntro.tsx` directly below. No sentence removed. The 20s launch film after it uses only verbatim site copy on screen.

## Drafted pages (AI copy per prompt §5.2, founder may redline anytime)
- **/products/lumi** — `site/app/products/lumi/page.tsx`: hero, conversation demo script, five-feelings-deeper cards, parent-app features, box list + honest specs deferral, price block ("Under ₹4 a day" is locked fact §1.8), 10 FAQs. Keywords woven: talking toys, robot toy, educational toys, cognitive development toy for toddlers, voice toy (languages FAQ), toys for kids.
- **/playos** — `site/app/playos/page.tsx`: parent-first H1, voice path (4 steps), privacy cards, family roadmap ("One soul. Many bodies."), quiet kheelona.ai line. Keywords: brain development toys, cognitive development toy for toddlers, smart toys.
- **/safety** — `site/app/safety/page.tsx`: hero, body (no physical claims pre-certification), four word-rules, voice-data cards, parent keys, 4 AEO FAQs. Keywords: AI toys, safe AI toy, toy to reduce screen time for toddlers in India.
- **/team** — `site/app/team/page.tsx`: manifesto, three founder cards (locked facts §1.8: 14 patents filed; built at Intel; services firm unnamed), four beliefs (prompt's sample anchors, split into em-dash-free sentences), gentle close.
- **/stories** + 14 articles — `site/lib/stories.ts` (4 seed pieces: "Why three to six are the years that matter most", "Screen-free does not mean silent", "How children learn by talking", "What to look for in a safe AI toy") + `site/lib/stories-expansion.ts` (10 keyword-researched pieces, 2026-07-06: screen-time guideline, tantrums, seven-day phone plan, get-your-child-talking, speech-delay reassurance, sharp-brain, vocabulary, bilingual India, should-kids-use-AI, busy-hands). Each ends with a soft invite or no product mention at all; WHO/AAP claims attributed; speech article defers to professionals. All 14 verified 0% AI / 100% human on QuillBot AI Detector v7.1.0 (see qa-report content-expansion entry).
- **/privacy, /terms** — plain-language drafts; COUNSEL REVIEW REQUIRED before launch (flagged in code).
- **/setup** — four steps, wake word/charger details deferred to final specs.
- **Microcopy** — nav/footer/sticky bar/Tally panel in `site/components/layout/*` and `ui/TallyEmbed.tsx`. Pre-launch panel copy: "The pre-order list opens here soon. ₹4,999 held for you, no payment now. We hold the price, you hold your place."
- **404** — `site/app/not-found.tsx` ("This page wandered off.").

## CTA label system (principled two-label rule)
- "Reserve Lumi at ₹4,999" at desire peaks (heroes, price block, post-product moments).
- "Join the pre-order list" in nav, utility slots, and PlayOS.
- Sticky mobile bar: "Reserve at ₹4,999. No payment now."


## R7 imported copy (2026-07-10) — source: kheelona.ai (founder-published)

New sanctioned source: the founder's own kheelona.ai site (repo apoorva262/kheelona.ai, content/site.ts + page sources). Rules applied: statuses copied exactly, B2B phrasing adapted to second-person parent voice, voice-lint on every line. Inventory:

| Copy | Where | Treatment |
|---|---|---|
| "In 2026, the first question about any AI toy..." | Home SafetyCallout | verbatim (founder-blessed) |
| Recognition entries (NVIDIA Inception Program, Karnataka Elevate, nasscom, Founders Inc) | Home + Team strips | verbatim |
| 3 early-tester parent quotes + attributions | Home + Lumi ParentQuotes | verbatim — RESOLVES claims-testimonials |
| Parent-app chips (5) | Home ParentAppSection | verbatim; body adapted (dropped "branded yours", "sale into a subscription") |
| Team manifesto, bios, pull-quotes, tags | /team | adapted to parent voice; facts verbatim (14 patents, Intel + Thunderbolt 4/5, CA + 15 yrs) |
| Custody chain + "Nothing leaves without consent..." | /safety | adapted |
| Standards statuses (COPPA 2026/GDPR-K/DPDP Designed for; ISO 27001 In progress) | /safety | status-exact |
| Pilot stats (10 families / 1 school / 10 languages) | /products/lumi | verbatim |
| "They think they are playing. The app shows you they are growing." | /products/lumi | adapted (de-gendered, uncontracted) |
| "Safety is built in, not bolted on." / one-prompt framing | /playos | adapted |

## R9 copy decisions (2026-07-10/11) — friend-feedback round + Kheelu

**CTA label system UPDATE (supersedes the two-label rule above):** one verb everywhere — *Reserve*. Nav + mobile sheet: "Reserve at ₹4,999" (was "Join the pre-order list"); desire peaks keep "Reserve Lumi at ₹4,999"; sticky bar unchanged. Reviewer finding #1, founder-approved.

**The 500-unit cap (REAL, founder-supplied 2026-07-10):** "first 500 units at ₹4,999". Approved placements, exact lines:
- Home hero: "First 500 units at ₹4,999. ₹9,999 after launch. No payment now. We hold the price, you hold your place."
- Finale: "₹4,999 for the first 500 units. ₹9,999 after launch. No payment now. We hold the price, you hold your place."
- MeetLumi mid-CTA (varied): "First 500 units at ₹4,999. No payment now."
- Compare + /products/lumi hero (trimmed): "₹9,999 after launch. No payment now."
The full reassurance line now appears verbatim ONLY at hero + finale (reviewer: ×5 repeats read as a template).

**Kheelu, the narrator (founder mandate: "the website is told by Kheelu... he is telling his story"):**
- The mascot's public name is **Kheelu** (resolves the brand-ambiguity finding; the plush = Lumi, the product).
- Source: the founder's Kheelu intro card. Used verbatim in `KheeluIntro`: "Hi! I'm Kheelu." / "I love asking questions, discovering new things and learning together with you!" / traits Naturally Curious · Kind & Caring · Smart Explorer · Playful & Fun. Closing line (house-written): "Let me show you around."
- **Sanctioned deviation — character voice:** Kheelu's quoted speech may use contractions (his published card voice). Body copy keeps the no-contraction house rule.
- All narrator lines (KheeluSays bubbles), founder-approved via the R9 plan:
  | Where | Line |
  |---|---|
  | Home film | Press play. I will wait. |
  | Home why-we-exist | Let me tell you why we made Lumi. |
  | Home feelings | These are the five feelings Lumi understands. I will act them out for you. |
  | Home meet-Lumi | Meet Lumi, my newest friend. Pick your favourite colour. |
  | Home feature grid | A whole day with Lumi looks like this. |
  | Home how-it-works | From the box to the first hello, here is how it goes. |
  | Home safety callout | This part is for your grown-ups. It matters the most. |
  | Home parent app | Lumi and I keep no secrets from grown-ups. |
  | Home journal | I collect stories too. Here are some for you. |
  | Home finale | Save your spot. I will keep Lumi company until launch. |
  | /products/lumi | This is Lumi. I picked the colours myself. |
  | /setup | I will be right here while you set up. |
  | /stories | My notebook. Take any story you like. |
  | /playos | My friends built this brain. I asked it the first why. |
  | /safety | (none — gravity wins; the handover line lives on Home) |

**How-it-works band:** the four /setup steps verbatim (single source: `lib/setup-steps.ts`); H2 "Four steps. No manual required." derived from published copy ("four small steps", "no manual required").

**Recognition safety line (Home only):** "Wake-word mic · Safety check on every reply · One-tap delete · Voice data never sold" — all four facts already published on /safety; pairs the accelerator badges with parent-relevant proof.

## R10 copy decisions (2026-07-11)

- **Hero paragraph fold (founder-approved preview):** StagedIntro's three verbatim lines return to the hero as one muted paragraph; lines 1+2 joined: "In the years a brain grows fastest, the more Lumi understands how your child feels, the more they learn." + "In all 10 languages you speak at home." (semibold beat). Sanctioned deviation from the 2026-07-07 staging (all sentences still on the page).
- **Team additions:** manifesto/heading now "a brain, a body, a business, and a voice" (adapted copy). Ria bio facts from her published profile (The Ideagator co-founder, 7 years; 1,000+ students and entrepreneurs trained). Ria quote DRAFTED from her own published line ("most businesses don't have a marketing problem, they have a clarity problem") → "Most brands do not have a marketing problem. They have a clarity problem. My job is to keep this one clear and honest." — founder approved via R10 plan; Ria's personal sign-off pending (FOUNDER-TODO R10-a).

## R11 copy decisions (2026-07-11)

- **Hero conversation (founder pick "show the conversation")**: the dialogue is the shipped /products/lumi moon exchange; Lumi's reply drops one middle sentence ("When you move, it seems to move with you.") for hero space — sanctioned deviation. Product speech keeps its natural contractions ("doesn't it?") — quoted character speech, the same register as the KheeluSays exemption.
- **Hero copy diet**: the PDF lede ("Lumi is a screen-free AI robot toy…Really talks.") is now the conversation card's caption, verbatim. The R10 folded paragraph ("In the years a brain grows fastest…10 languages…") moved to WhyWeExist as its closing paragraph, verbatim. The cap line compressed to CAP_LINE ("First 500 units at ₹4,999. ₹9,999 after launch. No payment now.") — "We hold the price, you hold your place." remains at the finale and in TallyEmbed, so the promise still closes the page.
- **PlayOS page**: all facts from founder-published kheelona.ai/playos, adapted to parent voice; nothing invented. Per-unit pricing, partnership CTAs, Q4-2026 dates, and API framing deliberately NOT ported. Family notes describe the founder-published renders. The one-prompt example ("Tell stories where patience wins, and make my child the hero.") is the published .ai example, verbatim, set in the quote register (serif legal).
- **De-contractions (voice gate over .ai-verbatim)**: SafetyCallout "whether it's safe" → "whether it is safe"; safety "Nothing stays you can't delete." → "Nothing stays that you cannot delete." Founder may revert (FOUNDER-TODO R11-b).
- **Nav**: "How it works" → "PlayOS" (founder). Meet Lumi keeps the steps under the new heading "From question to answer, in four steps." (new copy); step copy itself moved verbatim from the old /playos.

## Revamp M4 copy decisions (2026-07-25) — the 8 interior routes

Source of truth for this milestone is `docs/revamp-2026-07/copy-v2.md` (transplanted; every
block provenance-tagged there). Deviations and additions worth recording:

- **Question-led answer blocks (new, [NEW, facts] per copy-v2 + research.md AEO bank).**
  /safety gets five visible 40–60 word answers: "Are AI toys safe for children?" (copy-v2
  verbatim, acknowledges what independent testers found, names no competitor), "Is Lumi always
  listening?", "Where does my child's voice go?", "Could Lumi say something wrong?", "Can I
  delete everything?". The four short ones were assembled ONLY from already-published
  mechanisms (wake word, on-device first, closed library, age-graded layer, red-team pass,
  parent kill switch, region-pinned, one-tap delete, never sold). /playos gets one, "What can
  you see in the parent app?", covering the four items copy-v2 names (summary, full log, topic
  filters, culture prompt). All of them are mirrored into FAQPage schema, which may only ever
  describe copy a parent can actually read.
- **GATED:founder-signoff.** "Is an AI toy OK for a three-year-old?" ships on the preview
  branch verbatim from copy-v2, marked in `site/src/app/safety/page.tsx`, and is held OUT of
  the schema graph so pulling it leaves no orphaned structured data. Founder decision: ship on
  the preview, gated for master.
- **/safety FAQ trimmed.** "Is Lumi always listening to my child?" and "Where does my child's
  voice data go?" were removed from the accordion because the same questions are now answered
  in the open above it; a question asked twice on one page reads as padding to a parent and to
  a crawler. Two replacements, both from published facts: "Can Lumi reach the open internet?"
  and "Which safety standards does Lumi meet?" (status-exact, mirrors the STANDARDS chips, no
  badge claimed before it is earned). "toy to reduce screen time for toddlers" → "a toy that
  helps you cut screen time" (research: all "toddler" phrasings are stale at ages 3 to 10).
- **Ages 3 to 10 sweep.** /playos lede + its age-graded card, /safety word rules + custody
  chain + FAQ. /team metadata "AI robot toy" → "talking AI toy" (research demotes "AI robot
  toy" as misaligned intent).
- **Journal age pass (founder call: rewrite article bodies, keep slugs).** Retitled with slugs
  and hero filenames untouched: "Why three to six are the years that matter most" → "Why the
  early years matter most"; "How much screen time is okay for a 3 to 6 year old?" → "…for a
  young child?"; "What actually builds a sharp brain at 3 to 6" → "…in the early years". Also
  "a toy for ages 3 to 6 should filter every response for ages 3 to 6" → "a toy for ages 3 to
  10 should filter every response for the age of the child holding it"; "the 3 to 6 crowd" →
  "small children"; the "busy hands" description → "a young child".
  **Deliberate exception:** the sourced sleep-guidance sentence keeps "children aged 3 to 6
  need ten to thirteen hours" (a cited age band; restating it as 3 to 10 would fabricate a
  claim). Flagged in the file with a comment so a later sweep does not "fix" it.
- **No invented Kheelu lines.** M4 shipped exactly the copy-v2 guide lines plus /playos's
  carried-over voice-path line and Home's finale line (already in the queue) on each orange
  room. Draft lines written during the build for the /team beliefs room, the /playos family and
  parent-app rooms, and the 404 were deleted rather than added to the founder queue.
- **/setup stayed short** (hero + one steps room + finale) rather than padding the route with
  unreviewed copy; copy-v2 specifies only H1, sub, and the four steps for it.
