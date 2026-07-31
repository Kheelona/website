# BUILD-V6 — the growth-arc content round (2026-07-31)

> **STATUS: SHIPPED AND LIVE on https://kheelona.com (2026-07-31).** `main` = `demo-website` =
> `29d2fdd`, trees identical; rollback tag `v5-live-2026-07-31`; **279 tests** (276 at spec
> approval, +3 from the native-FAQ rebuild). Independent content QA REJECTED the first pass with
> four real blockers and APPROVED after fixes (`QA-V6-note.md` + addendum). Then the founder ordered
> the design-handoff items built rather than handed over, adding §8.24-6 (the FAQ is native
> `<details>`) and §8.24-7 (one kicker language) — see `HANDOFF-design-v6.md`. Gates at merge: tsc
> clean · build green (token-check 17) · axe 0 violations across settled runs (§8.24-5e, which found
> four pre-existing /products/lumi contrast failures) · voice-lint clean on 13 routes including the
> machine pages · overflow 0 · JSON-LD mirrors visible copy · 34 internal links all 200. QA record:
> `docs/qa-report.md` "V6"; live verification in the checkpoint.
> Spec approved as written by the founder 2026-07-31, who
> then ordered the merge ("make it live on demo and main both"). Where this
> spec conflicts with BUILD-V5, THIS SPEC WINS; V5's laws (§8.23) and V4's §0 laws still bind
> except where a decision below supersedes one. Approach approved by the founder 2026-07-31:
> **targeted conversion revision** — not a rewrite.

**What drove it.** Parents who saw the live site said, in the founder's words: *"it's good that you
are teaching, but what will a kid who buys this at age 2 GET when they are 5?"* The site never
answers it — the content inventory confirmed no within-band growth story exists anywhere (the only
"growth" arc published is the product pipeline, not the child). Second: the hero
"Your kid's favourite tutor. Their best friend first." was called very confusing, and the inventory
confirmed no other page supports the tutor claim. Third: 18 catalogued cross-page inconsistencies,
one of them factual (offline vs "WiFi operated").

**Who wrote the copy.** The founder onboarded a chief content writer persona (Joanna Wiebe /
conversion-copywriting method): customer language, benefit-led, objections answered head-on,
specificity over cleverness, one reader one action. Full draft package with per-claim provenance:
session scratchpad `joanna-copy-v6.md`; the surviving copy is verbatim in this spec, which is the
document of record.

## §0 Founder decisions locking this round (question batch, 2026-07-31)

| # | Question | Decision |
|---|---|---|
| Q1 | Source of the 2-to-5 claims | **Draft from published facts** + honest child-development framing; founder redlines at review. No invented features, telemetry, or guaranteed outcomes. |
| Q2 | Hero direction | **Outcome arc** ("A best friend at 2. A head start by 5."). Note appended by founder: *the tutor narrative stays alive elsewhere on the site, placement Claude's call* — see §1. |
| Q3 | Offline truth | **AI mode needs home WiFi; Kheelu-mode stories and Bluetooth music work offline.** NEW LICENSED FACT. Copy becomes mode-precise everywhere; the flat "No, Lumi plays offline" FAQ answer was wrong and is retired. |
| Q4 | School-readiness | **Soft frame licensed, no guarantees** ("the words, numbers, and confidence that walk into their first classroom with them"). No skill lists, nothing certification-shaped. |

Standing gates untouched by this round: Kheelona+ ₹ amount, certifications, wake word, specs,
testimonial words (founder's settled decision — the three named quotes are not touched, not
re-raised). /playos stays VC-voiced (V4 D6). No slug changes anywhere (the bilingual article ranks
#1 in India organic).

## §1 The spine, and where the tutor lives now

One sentence the whole site now supports: **a best friend at 2, a head start by 5.** It maps onto
the locked 40/20/40: friend leads (40% companion), head start pays off (40% education),
"listens, remembers, grows" is the mechanism between them (20% brain development).

The tutor narrative relocates instead of dying (founder note on Q2). Its homes:

1. Home Compare room display line, already live: "A tutor runs out of time and patience. Lumi does not."
2. `/products/lumi` PacePanel, already live: "School teaches the class. Lumi teaches your child."
3. The NEW arc room's closing display line (D2): "A best friend the whole way. A tutor whenever they need one." — the old hero's idea, de-confused.
4. Home metadata title keeps the tutor keyword (D10).

## §2 The deliverables (final copy, verbatim)

### D1 — Home hero (`src/features/home/components/Hero.tsx`)

H1, two lines, second line coloured (`text-action-ink` block span, unchanged mechanics):

> A best friend at 2.
> A head start by 5.

Subhead:

> Lumi listens, remembers, and grows with your child. Stories, numbers, and the languages you speak at home, at their pace.

CTA (`RESERVE_LABEL`), cap card (`CAP_LINE`), chip (`LUMI_AGES`), art: all unchanged.
Ages in the H1 must render from `LUMI_AGES` endpoints (see §3 arch note).

### D2 — NEW Home room: the growth arc

**Placement:** between the How-It-Works loop and "A day with Lumi" (mechanism → outcome → daily
texture). Room id `growth`. Home goes 13 → 14 rooms; nothing is removed this round (a future
"less content, more value" cut remains open, see §6 of the V5 checkpoint).

- Eyebrow: `From 2 to 5` (rendered from `LUMI_AGES` endpoints)
- H2: **What your child gets, year by year.**
- Lede: "Lumi remembers what your child knows and asks the next question. Here is how the same friend meets them at every age."
- Four stage cards (kicker + body), data in new `src/lib/growth-arc.ts`:
  1. **At 2 years: Naming the world.** "Your child points, names, and repeats. Lumi answers in short words they already own, sings the rhymes you grew up with, and starts remembering which words they know."
  2. **At 3 years: Asking why, and why again.** "Why is the sky blue? Lumi answers the fourth why with the same patience as the first, then asks one back. Every answered why teaches your child that asking is worth it."
  3. **At 4 years: Playing with ideas.** "Thinking games, counting the apples a squirrel ran off with, naming a big feeling instead of hiding it. Lumi remembers where your child stopped yesterday and starts one small step further."
  4. **By 5 years: Words, numbers, confidence.** "Three years of serve and return add up: the words, the numbers, and the confidence of a child who expects to be heard. All of it walks into their first classroom with them."
- Hedge line (after the cards): "Every child grows at their own pace. Lumi follows theirs."
- Closing display line: **"A best friend the whole way. A tutor whenever they need one."**
- No CTA inside the room (the audio room's CTA sits one fold above; V5's one-idea-one-statement law).

Per-claim provenance: card 1 = LumiModes AI card + HowItWorksLoop step 2 + DOES grid rhymes (all
published); card 2 = PacePanel fourth-why + journal "Why the early years matter most" (published);
card 3 = AudioMoments transcripts + Feelings "Grumpy" + PacePanel pick-up-tomorrow (published);
card 4 = loop-room serve-and-return close + journal "a child who expects to be heard" (published)
+ the Q4 licensed soft school frame. The hedge line answers the skeptical parent's "every child is
different" before they raise it.

**Kheelu say line — FOUNDER PICK REQUIRED (gate: GATED:kheelu-line), three candidates:**

1. `Lumi met them at 2. Look at them now.` (37 chars)
2. `Blink and they're counting. Kids, honestly.` (43 chars)
3. `From first words to big ideas. I'm there.` (41 chars)

CMO note: candidate 1 reads as if Lumi already knows the reader's child; 2 and 3 are safer.

### D3 — NEW Home FAQ entry (`HOME_FAQ`, mirrored into FAQPage schema)

**Q:** What will my child actually get out of Lumi?

**A (54 words):** "A friend at 2, and a head start by 5. Lumi answers your child's questions,
remembers the words they know, and builds on them the next day: stories, numbers, thinking games,
and the languages you speak at home. The parent app counts the new words, so you see the growth,
not just the play."

The question is the parents' feedback nearly verbatim; the answer ends on checkable proof
(word counting, published in ParentAppSection).

### D4 — Offline/WiFi precision (the Q3 licensed fact), six surfaces

(a) Home FAQ "Does Lumi need the internet to work?" — new answer (49 words):
> For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Kheelu-mode stories and lessons play offline, and Bluetooth music needs only a paired phone. On a train or anywhere without a signal, your child still has stories to interrupt, question, and be quizzed on.

(b) `/products/lumi` FAQ "Does Lumi need the internet?" — new answer:
> Only for open conversation: AI mode runs on your home WiFi. Kheelu-mode stories and lessons work offline, and Bluetooth music needs only a paired phone. New content and updates download when you choose.

(c) KheeluOrbit "On the train" card: "No signal? Kheelu-mode stories still play."

(d) LumiModes AI-mode card body gains a closing sentence, the mirror of Kheelu mode's
"It works offline.": final sentence becomes "… without anyone calling it a lesson. **It runs on
your home WiFi.**"

(e) `/llms.txt`, new bullet under "What Lumi is": "Connectivity: AI mode (open conversation) runs
on home WiFi. Kheelu-mode stories and lessons work offline, and Bluetooth music needs only a
paired phone."

(f) `/products/lumi` DOES grid card "Offline adventures" body: "Kheelu-mode stories and your
paired playlist travel anywhere, no signal needed." (The last blanket offline claim; the
founder's "mode-precise everywhere" decision covers it.)

The `/playos` "WiFi operated" chip needs NO change — these six make it consistent instead of
contradictory. `pricing.md` states no connectivity claim; verify at build and leave unless it does.

### D5 — `/products/lumi` arc echo

A slim beat directly after the PacePanel room, before "One friend. A whole day of things to do.":

> The memory that picks up where your child stopped tomorrow keeps picking up for years. First words at 2 become stories, numbers, and questions by 5, one day at a time.
>
> **A best friend at 2. A head start by 5.**

The hero promise repeated verbatim on the product page fixes inventory inconsistency #1 (four
different lead value props) by repetition, not invention. Implement inside the existing pace Room
(a closing paragraph + display line), NOT a new room — the product page does not grow a fold.

### D6 — Languages become an outcome (Home audio room)

Directly under the existing "In the languages you speak at home, up to ten of them.¹" (which
stays), add:

> A child who can wonder in their own words wonders more, and a child who plays in two languages keeps both. Why that matters for years to come: [Raising a bilingual child in India](/stories/raising-a-bilingual-child-in-india).

First sentence's opening clause is published verbatim (/playos moat). The link sends the
bilingual-intent parent to the page that already ranks #1 in India for it. Slug and title untouched.

### D7 — /safety dedup + Home alignment

The visible AnswerBlock "Is an AI toy OK for a three-year-old?" STAYS (it shipped founder-reviewed).
The accordion entry "Is an AI toy safe for a 3 year old?" is REPLACED by a different real question:

**Q:** Will Lumi replace time with me?
**A (48 words):** "No, and it is not built to. Lumi is for the moments your hands are full, not
the ones they are not. The parent app gives you one simple thing to do together each day, quiet
hours are yours to set, and the grown-up holds the keys, always."

Home FAQ "Is an AI toy safe for a small child?" — answer rewritten to agree with the /safety
flagship in substance (55 words):
> Not all of them are, and the difference is in how they are built. Lumi wakes to a word and the microphone is off the rest of the time, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.

Both mirror into FAQPage schema exactly as the visible copy (standing law).

### D8 — Ship-date staleness on the legal pages

(a) `/privacy` "Why we ask for it", first sentence:
> Your email and WhatsApp number let us tell you about your reservation: the price hold, your place in line, and any change to the 1 September 2026 ship date.

(b) `/terms` "The boring but honest part", first paragraph (second paragraph unchanged):
> Lumi is still being finished. The ship date is published, 1 September 2026, and we build to it. Specifications and availability can still move while we complete testing and certification. If the ship date itself ever moves, you hear it from us first, and your ₹4,999 hold stays exactly as it is.

Both render the date from `SHIP_DATE_TEXT` and the price from `LAUNCH_PRICE`. (Counsel review was
waived by the founder 2026-07-31; the strengthened notification promise is recorded here so the
next counsel pass sees it.)

### D9 — Journal fixes (`src/lib/stories.ts`, slugs untouched)

(a) "How children learn by talking", closing paragraph: "…in **up to** 10 home languages…" (one
word pair added; restores the site-wide ceiling in the one place that overstated it).

(b) "Why the early years matter most", opening line: "Somewhere between the **second and fifth**
birthday, your child becomes a person." (aligns the flagship article with `LUMI_AGES`; the
author's own observation, not a cited band). Side effect in the same sentence block:
"favorite" → "favourite" (site is en-IN; the hero already spells "favourite").
The cited WHO/AAP sleep band ("aged 3 to 6") in the screen-time article is NOT touched — restating
a cited band would fabricate a claim (standing law from the journal age pass).

### D10 — Metadata

Home title — FOUNDER PICK REQUIRED, two candidates (both keep the tutor keyword):

1. **(CMO recommended)** `Lumi: the screen-free AI toy with a tutor inside, ages 2 to 5 | Kheelona` (72 chars; tail past ~60 may truncate in SERPs, losing only the brand suffix)
2. `Lumi: your kid's favourite tutor, inside their best friend | Kheelona` (closer to the currently indexed title)

Home description:
> A best friend at 2, a head start by 5. The screen-free toy that grows with your child, in the languages you speak at home. Reserve at ₹4,999, no payment now.

Root layout default title, one verb changed ("learns" → "grows"):
> Lumi by Kheelona: the screen-free friend that grows with your child, ages 2 to 5

Root layout default description: stands unchanged (accurate, ceiling-true).

### D11 — Price wording normalization (Home said the same fact three ways)

- Hero cap card: `CAP_LINE` unchanged.
- `PRICE_CAPTION` under mid-page CTAs: unchanged (the last two facts of the master line).
- `FinaleCTA` lede becomes exactly `CAP_LINE` + the hold promise: "First 500 units at ₹4,999.
  ₹9,999 after launch. No payment now. We hold the price, you hold your place." Implemented as
  `${CAP_LINE} ${PRICE_HOLD_LINE}` with `PRICE_HOLD_LINE` ("We hold the price, you hold your
  place.") promoted to a `config/site.ts` constant (the sentence already appears in the FinaleCTA
  lede, the TallyEmbed placeholder card, and the /products/lumi FAQ answer 9 — one source, no
  drift).

Rationale: repetition builds trust only when it is verbatim; three paraphrases of one price read
like three offers.

## §3 Implementation architecture

1. **New `src/lib/growth-arc.ts`** — the four stage cards + hedge + closing line as data, plus a
   small `lumiAgeEndpoints()` helper that parses `LUMI_AGES` ("2 to 5") into its endpoints. The
   helper feeds the hero H1 ages (D1), the arc eyebrow, and the stage kickers' endpoints; a guard
   test asserts the first kicker's age equals the start of `LUMI_AGES` and the last equals its
   end ("At 3 years"/"At 4 years" are data and cannot drift past the endpoints).
2. **New organism `src/components/organisms/GrowthArc.tsx`** — composes `SectionHeading` (eyebrow/
   H2/lede) + the existing card grammar + a display line, per the registry law. Static
   informational cards: NO press/lift (V5 interaction contract — static surfaces deliberately get
   nothing). Colocated `GrowthArc.stories.tsx` + `GrowthArc.test.tsx`.
3. **Home** (`src/app/page.tsx`): insert the `growth` Room after the loop room; add D3 to
   `HOME_FAQ`; rewrite the two D4/D7 answers; D6 line into the audio room; hero copy per D1.
   First-room reveal rules unchanged (Home has a media hero; the LCP law is untouched — the plush
   must stay the hero's largest element).
4. **`/products/lumi`**: D5 inside the pace room; D4(b)(f) data edits; LumiModes AI card D4(d).
5. **`/safety`**: D7 accordion swap (schema mirror moves with it).
6. **`/privacy` `/terms`**: D8, importing `SHIP_DATE_TEXT`/`LAUNCH_PRICE`.
7. **`config/site.ts`**: `PRICE_HOLD_LINE` constant; **`LANGUAGES_LINE` becomes derived from
   `LUMI_LANGUAGES`** (join with an "and" before the final item) so the list has one source —
   fixes the unused-export flag (#17); token-check untouched (no token changes anywhere).
8. **`src/lib/audio-moments.ts` / `KheeluOrbit` / `stories.ts` / `llms.txt` route**: the
   remaining D4/D9 data edits.
9. **Metadata**: D10 in `page.tsx` + `layout.tsx`.
10. **Code hygiene riding along** (no behaviour change): stale /contact header comment (the
    email is no longer null), stale `FamilyGrid` docstring (/playos claim), and the dead
    `RecognitionStrip` `safetyLine` prop — remove the prop and its dead branch, with its test.
11. Every changed component keeps/extends its colocated story + test. Storybook/Vitest stay
    dev-only. Nothing hardcoded that a constant already owns.

## §4 What does NOT change (so the diff is auditable)

Testimonials (all five placements, settled), Kheelona+ copy (`KHEELONA_PLUS_LINE` verbatim, price
gated), wake word, specs, certifications copy, /playos voice + ArchitectureStack chips (incl.
"WiFi operated"), all 19 journal slugs and titles, nav labels, all tokens and fonts, room grammar,
KheeluGuide behaviour, every existing founder-approved Kheelu say line, the Tally form, analytics
(no measurement change → /privacy analytics section untouched), redirects, sitemap shape.

## §5 QA + process for this round (the founder's four-step brief)

- **Step 2 (this spec + build):** copy drafted by the Joanna persona, CMO-edited, founder-gated
  items isolated above. Build lands as ONE commit series on `demo-website`.
- **Before/after evidence:** headless harness (§8.23 — the Chrome extension is locked ~390px with
  a hidden tab that freezes reveals, so evidence shots run headless), full-page shots of every
  touched route at 1440×900 and 390×844, before + after, kept in the session scratchpad and the
  changed pairs attached to the founder review.
- **Gates before Step 3:** `npm test` green (new tests included) · `npx tsc` clean · `npm run
  build` green (token-check 17) · voice-lint probe on all rendered routes (zero em-dashes, zero
  italics, contractions only inside Kheelu lines) · axe with reveals FORCED on `/`,
  `/products/lumi`, `/safety` at both viewports · overflow probe 320/390 · JSON-LD parses and
  FAQPage mirrors visible copy on all three FAQ pages · `#reserve` everywhere.
- **Step 3:** an INDEPENDENT senior-content-QA agent (fresh context, no Joanna artifacts) does a
  360° review of every rendered route + llms.txt + pricing.md against: consistency, the locked
  positioning mix, the claims gates, voice laws, and "would a parent love this". It produces an
  approve/reject note. Reject → back to Step 2 with its findings.
- **Step 4 (on approval):** push `demo-website`, verify the live preview
  (https://website-hdn2.vercel.app) route-by-route, write the design-team handoff doc
  (`docs/revamp-2026-07/HANDOFF-design-v6.md`: micro design improvements only — spacing, link
  states, no structural changes), update all state docs. **The founder merges to `main`
  themselves** (their standing instruction). Preview submissions are REAL Tally entries — delete
  test rows.

## §6 Docs to update in the build commits

`docs/copy-reference.md` (V6 provenance: every deliverable's source + the licensed Q3/Q4 facts),
`docs/website-steps.md` §8.24 (new laws if any emerge in build; at minimum the mode-precise
connectivity law), `docs/project-state.json` (`last_handoff`), `CLAUDE.md` state-of-play block,
`docs/qa-report.md` (V6 QA), checkpoint `docs/checkpoints/v6-content-2026-07-31.md` at the end,
`Design/design-system/` note for the GrowthArc pattern (per the design-system-as-source-of-truth
process note).

## §7 Founder picks — ANSWERED at spec review (2026-07-31, spec approved as written)

1. **Kheelu say line for the growth room**: candidate 3 — `From first words to big ideas. I'm there.` (41 chars). Sign-off given; the line ships.
2. **Home metadata title**: candidate 1 — `Lumi: the screen-free AI toy with a tutor inside, ages 2 to 5 | Kheelona`.
3. **"favorite" → "favourite"** in the journal (D9b): normalize to en-IN.
