# Benchmark memo — what winning sites do (V3 research, 2026-07-27)

Input to `BUILD-V3.md`. Method: live fetch + analysis of 7 reference sites (July 2026), three
lenses: the kids-audio/AI-toy category, hardware+subscription framing, and tutor-to-parents
framing. Read with `docs/revamp-2026-07/research.md` (competitor weaknesses, parent voice).

## Per-reference findings

### Tonies (us.tonies.com) — category leader, ~$630M/yr
- Fold arc: hero (pre-order tease) → licensed-IP hero → **trust anchors above the fold**
  (100-day guarantee · free shipping · pay-later) → category grid → pre-order CTA → how it
  works film → hardware duo → content variety → bundles → testimonials (89k reviews) → brand
  logos → **use-case carousel** (story time / learning / sleep / mindfulness / singing) →
  age collections (1+ to 9+) → retail logos → email capture (10% off).
- Learning is sold as **"tiny lessons for little learners"** — a use-case beside bedtime, never
  a curriculum. Fun (licensed characters) anchors; education is a side effect of fun.
- Urgency is product-scarcity (pre-order hardware), never countdown theatre.
- Steal: trust anchors BEFORE the ask; occasion-based segmentation instead of demographics;
  learning in diminutive parent-warm words.

### Yoto (us.yotoplay.com)
- Sells **quantified parent outcomes, not specs**: "82% agree it's made bedtime easier",
  "89% of Mini owners agree it's made travel easier". Trustpilot shown twice.
- "No screens, no ads, no surprises" = absence claims as feature stack.
- Dual SKU segmented by occasion (home vs travel), not by tier — kills decision paralysis.
- Age-segmented library preview (0–2 / 3–5 / 6–8 / 9+) = the growth story made browsable.
- Steal: outcome-stat blocks (we substitute testimonials until real stats exist); the
  age-banded content preview as the visual for "grows with them".

### Miko (miko.ai) — the incumbent Indian parents compare against
- Safety module placed **immediately after emotional buy-in** (influencer videos), not in the
  footer: "Kid-Safe by Design", kidSAFE badge, "No hidden data practices… No surprises."
- Learning framed as a named framework: IQ / CQ / SQ / PQ quotients with lifestyle imagery.
- Subscription (Miko Max $99/yr reframed "$8.25/month") — and its own reviews show the trap:
  "without the subscription Miko simply isn't as good" (research.md). Subscription-forward
  pricing breeds resentment.
- Exploitable gaps: aspirational learning claims with zero mechanism; US-centric proof;
  no offline story; subscription value vague.
- Steal: safety directly after the emotional fold; named-competency framing (in parent words,
  not psych jargon); subscription as content unlock, never as the product's crutch.

### Curio (heycurio.com) — cautionary
- Character-first grid, magical tagline, $119 anchor from $150 — and **no safety copy above
  the footer**, no learning mechanism, no subscription clarity. Exactly the "generic LLM in a
  plush" pattern the YC application positions against. Their 2023 interrupting-toy reviews
  still rank in 2026 (research.md): never ship the beta.

### MyWonder (mywonder.in) — the ₹-lane shelf-mate
- ₹5,499 starter (39% off framing), 2,500 free minutes then **₹1/minute** — transparent but
  nickel-and-dime-feeling next to an all-inclusive period.
- Learning-first but mechanism-light: "STEM, SEL, Skills", "grows with child" with no visible
  age progression — reviewers can't tell how content scales 3–10.
- Trust done well: 90dB audio cap, IP56, "built by parents, for parents".
- Exploitable gaps (ours to take): no age-progression clarity; English+Hindi only; per-minute
  anxiety; engagement testimonials but no learning outcomes.
- Steal: physical-safety specifics (when our certs land); founder-authenticity line;
  character-led content architecture (we have Kheelu + the five feelings).

### Khanmigo parents (khanmigo.ai/parents) — tutor framing masterclass
- "A safer introduction to AI made for learners" · **"Unlike ChatGPT, Khanmigo never gives
  the answer"** · "Deep learning, no answers" — de-risks AI by naming the scary alternative
  and stating the design difference. Common Sense Media stars as third-party proof.
- $4/month framed as access, not as tutor-undercutting; transparency that "every interaction
  has costs" buys goodwill.
- Steal: the anti-chatbot mechanism sentence; the parent-dashboard teaser (parents get tools,
  not just kids get toys); problem → design-difference → proof sequencing.

### Oura (ouraring.com) — subscription framing, positive AND negative lesson
- "Membership" language upstream of specs; lifestyle-scenario carousel; testimonials embedded
  in scenarios. BUT price completely hidden on the homepage — the resentment pattern Miko's
  reviews prove out. We do the opposite: state the deal plainly.

## The winning-criteria checklist (BUILD-V3 must satisfy every line)

1. **5-second hero**: what it is + who it's for (age chip) + the offer + zero risk ("no
   payment now") all visible without scrolling, on mobile first.
2. **Trust anchors before the first ask** (Tonies): recognised-by + no-payment + read-every-
   word sit above or beside the first Reserve.
3. **Fun leads, in occasions not adjectives** (Tonies/Yoto): a day-with-Lumi fold of concrete
   moments, licensed by nothing but the child's own routine.
4. **Learning has a mechanism, not adjectives** (Khanmigo vs Miko's gap): show story →
   child's question → quiz — Kheelu mode as a visible loop, plus what the parent app reports
   (new words, one action a day). Never "STEM-powered".
5. **The growth arc is explicit** (MyWonder's gap): 2 to 14, one tutor, many bodies —
   Lumi → Kheelu Speaker → AI books, with ages on each card.
6. **Subscription stated plainly, all-inclusive period first** (anti-Oura, anti-₹1/min):
   "6 months of Kheelona+ included. Monthly price announced before launch." No hiding, no
   metering anxiety.
7. **Anti-chatbot sentence** (Khanmigo): one line that names the failure mode parents read
   about and states our design difference (closed library, small brain built for children).
8. **Safety immediately after the emotional fold** (Miko), compressed to mechanisms
   (wake-word mic, read every word, one-tap delete, no open internet) with the /safety page
   carrying depth.
9. **Named human testimonials** (Yoto's stats substitute until real data): Shweta,
   Priyamvada, Gaurav — placeholder text flagged until real quotes land.
10. **Price framed against the alternative parents already pay** (Khanmigo adjacency):
    tuition/tutoring framing in parent words, without attacking tutors.
11. **One CTA verb** (Reserve), repeated at hero, mid-page after compare, and finale; urgency
    only from the true cap (first 500 units), never countdowns.
12. **No invented numbers**: no fake stats, no dates, no badges before they are earned —
    honesty is the citation strategy (research.md) and the differentiator (PIRG wishlist).

## Notes for the fold design
- Tonies' use-case carousel and Yoto's age-banded preview merge naturally into OUR existing
  components: KheeluOrbit (occasions) and FamilyGrid (age arc) — modify, don't rebuild.
- Miko's quotient framework, translated to parent words and our 40/20/40 mix, becomes the
  learning room's three chips: words and numbers · feelings named · languages of home.
- Curio proves the sequence "cute grid, no mechanism" fails the trust test; every fun fold on
  our site must sit within one scroll of a mechanism or a control.
