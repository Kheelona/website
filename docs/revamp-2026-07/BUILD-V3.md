# BUILD-V3 — content repositioning build spec (2026-07-27)

**This document is self-contained.** A developer (or a fresh Claude session) executes it start
to finish without any other conversation context. Read §0 and §1 fully before touching code.

Goal: kheelona.com converts parents into ₹4,999 pre-bookings. Positioning mix: **40% fun,
20% brain development, 40% education** — companion story leads, education layer added.
Sources: the founder's YC application (sanctioned fact source, 2026-07-27), the benchmark memo
(`benchmarks-v3.md`), the market research memo (`research.md`). Where this spec conflicts with
older copy docs (`copy-v2.md`, the build prompt keyword map), THIS SPEC WINS.

---

## §0 Read-first: laws that bind every change

1. **Branch**: `revamp/kheelu-tour`. Never force-push `demo-website`; MERGE into it (the
   wireframe commit at /a /b /c must survive).
2. **Structure**: `docs/standards/` is law. Reuse/extend/compose registry molecules
   (SectionHeading, Card, StepList, PageHero, CheckList, LegalDoc, AnswerBlock, Room,
   RoomsTrack, FamilyGrid, ChatDemo, Faq, CompareTable, KheeluOrbit, FeelingsGallery,
   PhoneFrame, Reveal). New/changed components ship a colocated `.stories.tsx` + `.test.tsx`.
3. **Voice-lint (zero tolerance)**: no em-dashes (en-dash only inside number ranges), no
   italics, no exclamation points, no hype adjectives, second person present tense. No
   contractions in body copy; contractions ARE allowed in Kheelu `data-say`/poke lines and in
   quoted toy/child speech inside demo cards. One CTA verb: **Reserve**. Prices and CTA labels
   only via `src/config/site.ts` constants.
4. **Never invent claims**: no statistics, dates, certifications, or testimonials presented as
   real. Everything gated in §6 renders only with its PLACEHOLDER/GATED marker in code and
   ships to the PREVIEW branch only until the founder clears it.
5. **Mobile rules (M4-b, hard)**: never animate X on an element that spans the track width
   (sideways reveals exist only ≥960px); base-level element CSS belongs in `@layer base`;
   fixed-px children inside rooms need `max-w-full` and `min-w-0` on their grid/flex item;
   wide data gets a stacked view below `sm`, one data source for both views.
6. **Hero/LCP law**: the hero's largest element is a priority image; hero motion never hides
   content (rise-only reveals, no opacity on the LCP path).
7. **Interaction laws**: transform/opacity only; directional reveals below-fold only; tilt
   never wraps a whole-card link; dialogs animate standalone `scale`/`opacity` only (Tailwind
   v4 `translate` collision); `features/ambient-stage/` stays dormant, never deleted; every
   rAF loop pauses on hidden tabs; reduced-motion always gets a static, complete view.
8. **A11y gates**: Lighthouse 100 A11y/BP/SEO per route; white text only on `bg-action`
   (#C25210) or footer cocoa; kickers in `orange-ink` on washes; every page ends with the
   orange `Room id="reserve"` wrapping `FinaleCTA bare`.
9. **Gemini art**: prepare prompt kits under `gemini-handoff/`; the FOUNDER generates; ingest
   from `~/Downloads`. Never drive gemini.google.com.

## §1 Positioning brief (locked founder decisions, 2026-07-27 — do not re-ask)

| # | Decision |
|---|---|
| 1 | India-first. Offer unchanged: ₹4,999 first 500 units, ₹9,999 after launch, no payment now. |
| 2 | Companion story leads ("a friend who listens"); education is the new second engine. NOT renamed to "AI tutor" site-wide; tutor framing appears inside folds, in parent words. |
| 3 | Product line on site: **Lumi → Kheelu Speaker → AI books**. Lori/Lua/Robu come OFF kheelona.com (they remain on kheelona.ai). |
| 4 | Kheelona+ is published as: every Lumi includes **6 months of Kheelona+**; monthly price announced before launch. NO ₹ price for it anywhere. |
| 5 | Ages: **Lumi 2 to 5**; platform arc **2 to 14** (Speaker 5 to 14, books across). The old "3 to 10" is retired everywhere: copy, metadata, JSON-LD, FAQ, compare table. |
| 6 | Kheelu the mascot lends his name to the product line (Kheelu Speaker, Kheelu mode). Narrator device unchanged. |
| 7 | No pilot-count claims ("ten families", "15 units", school names, grant amounts). Recognised-by strip is the institutional proof. Testimonials: 3 named placeholders (Shweta, Priyamvada, Gaurav) until real quotes land. |
| 8 | /team keeps all 4 people; the 3 co-founder bios refresh with YC facts. |

**New sanctioned facts** (from the YC application; usable in parent voice): Kheelu mode
(pre-loaded stories and lessons a child can interrupt, question, and be quizzed on) · parent
app reports new words learned, gives one simple action a day, and flags things that need a
parent's attention · multilingual across English, Hindi, and regional languages (keep the
published "up to 10") · a small language model built only for children (parent phrase: "a
small brain trained only for children, not shrunk from adult AI" — already live on /playos)
· rugged body built for small hands · tutors run out of time and patience, Lumi does not ·
priced like a toy, not like tuition.

**Still gated — never state**: camera yes/no · ship date · the named list of 10 languages ·
₹ price of Kheelona+ · what happens to the device if Kheelona+ lapses (NEW GATE V3-b: do not
write "Lumi keeps working without it" or any variant until the founder states the behaviour)
· toy-safety certifications/specs (existing TODO markers stay).

**Benchmark criteria this build must satisfy**: the 12-point checklist at the end of
`benchmarks-v3.md`. The fold specs below already encode it; if you deviate, re-check the list.

## §2 Shared changes (do these first — slice V3-1)

### 2.1 `src/config/site.ts`
Add (names final):
```ts
/** Ages (V3, founder 2026-07-27): Lumi's band + the platform arc. */
export const LUMI_AGES = "2 to 5";
export const PLATFORM_AGES = "2 to 14";
/** Kheelona+ line (V3): the ONLY sanctioned subscription wording. Price is
 *  founder-gated (V3-b) — never render a ₹ amount for it. */
export const KHEELONA_PLUS_LINE =
  "Every Lumi includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. The monthly price after that is announced before launch.";
```
All age copy renders from these constants where practical; hardcoded "3 to 10"/"3 to 6"
strings are bugs (final QA greps for them).

### 2.2 `src/lib/family.ts` — the pipeline replaces the old family
Rewrite `FAMILY` to three members (type gains `ages: string`):
1. **Lumi** — ages "2 to 5", `here: true`, img `/product/lumi-blue-2.png` (exists),
   note: `Here first. The friend who listens.`
2. **Kheelu Speaker** — ages "5 to 14", note: `The same friend, grown up a little. For the
   school years.` Badge `Coming soon`. Image: AssetSlot placeholder until the Gemini kit
   (§6.3) delivers; alt text: "The Kheelu Speaker, coming soon".
3. **AI books** — ages "2 to 14", note: `Stories that answer back. Read, ask, and be asked.`
   Badge `Coming soon`. AssetSlot placeholder.
`FamilyGrid` gains the age chip per card (small pill, `bg-cream`, `text-ink-head`, top-right
of the media area) and switches to `md:grid-cols-3`. Update `FamilyGrid.test.tsx` (3 members,
Lumi only link, age chips render) and stories. NOTE: `/playos` consumes the same grid — its
copy updates in §4.3 so the two pages cannot drift.

### 2.3 `src/components/molecules/ChatDemo.tsx` — script prop
Extend to accept `script?: { who: "child" | "lumi"; text: string }[]` (default = the existing
moon exchange, so current call sites do not change). Same CSS typing treatment, same at-rest
base state (no-JS and crawlers see the finished card). Add a test: custom script renders in
order; default unchanged.

### 2.4 `src/components/organisms/ParentQuotes.tsx` — named testimonials
Replace the quote data with three entries, each `name` + `quote` + `meta` (relation line).
ALL three quotes are `PLACEHOLDER` (marker comment in the file + entry in FOUNDER-TODO V3-a).
Render name + meta under each quote (name in display bold, meta in the 13px kicker style).
Drop the old anonymous "Parent of a 4-year-old, early tester" entries and any "Ten families"
heading anywhere it appears (grep `ParentQuotes` call sites for `title=` overrides).
Placeholder copy (voice-linted; replace verbatim when real quotes land):
- **Shweta** — `The first thing she does after school is tell Lumi about her day. I listen
  from the kitchen and learn things she forgets to tell me.` meta: `Pilot parent`
- **Priyamvada** — `It sings the same rhymes my mother sang to me, and then it asks him
  questions about them. He answers before I can.` meta: `Pilot parent`
- **Gaurav** — `We wanted less screen time without a fight. This is the first thing that
  worked without one.` meta: `Pilot parent`

### 2.5 `src/components/molecules/CompareTable.tsx`
Row 6 becomes: `Grows with them` — Lumi: `Yes, 2 to 14 with the family` / Smart toys:
`Varies` / Phone or TV: `No` / Ordinary toys: `Varies`. (The pipeline fold on every page
justifies "with the family".) Both views read the one ROWS array; the existing
views-cannot-disagree test keeps passing. Update the row-header test string.

### 2.6 NEW `src/components/molecules/FootnotesRow.tsx` (Apple-tier pass)
A quiet footnotes block: `<ol>` of small-print notes (13px, `text-ink-muted`), each linked
from superscript markers in copy via `id`/`href` anchors (`#fn-1`, `aria-describedby` on the
marker). Story + test (renders items, anchors resolve, list semantics). Mounted once per page
as the LAST content of the room preceding the finale, Home + /products/lumi only. V3
footnotes (the only two — do not add more without a claim that needs one):
1. `Up to 10 languages: the full language list is announced before launch.`
2. `Kheelona+: included free for 6 months with every Lumi; monthly price announced before
   launch. Nothing renews without you.`
Superscript markers go on: the hero bubble `Up to 10 home languages.` (Home) / the languages
FAQ answer (Lumi), and on each `Kheelona+` band heading.

## §3 Home (`src/app/page.tsx`) — slice V3-2

Order (14 folds). Rooms keep the existing fills/reveal alternation; new rooms noted. Every
`say` line is `GATED:kheelu-line` (queue in §6.4).

### F1 Hero (existing `features/home/Hero.tsx`, copy swap)
- Age chip: `For ages 2 to 5` (from `LUMI_AGES`).
- H1: `A friend who listens.` line 2 (orange-ink): **`A teacher who plays.`**
  (Alternates, appendix A1 — this is the chosen line.)
- Sub: `Screen-free friends that talk with your child, tell stories, sing, and slip learning
  into the play. In the languages you speak at home.`
- CTA row unchanged (Reserve + ghost `Meet Kheelu`), CAP_LINE, guide hint unchanged.
- SSR bubbles unchanged: `No screen, ever.` · `Up to 10 home languages.` · `You read every
  word.`
- Job: 5-second test — what (talking screen-free friend that teaches), who (2 to 5), offer
  (₹4,999 cap line), risk (no payment now). LCP law: plush stays largest + priority.

### F2 Recognition (unchanged)
`RecognitionStrip bare safetyLine` exactly as shipped.

### F3 Statement (copy add)
Keep H2 `We build companions, not gadgets.` and the existing body; APPEND one bridge line as
its own paragraph (display bold, like the Family range line):
`Lumi plays like a toy and teaches like a tutor. Your child will only notice the friend.`

### F4 Film (unchanged)
`Watch two friends meet.` + `LaunchVideo bare`.

### F5 Fun — a day with Lumi (`KheeluOrbit`, two card swaps)
H2 unchanged. Moments, updated for ages 2 to 5 (cards 3 and 2 change):
1. `Morning` / `Why is the sky blue? Lumi answers, then asks one back.`
2. `After playschool` / `A new story, made to order.`
3. `Counting time` / `Numbers and rhymes that feel like a game.`
4. `Evening` / `Songs you grew up with, and new ones too.`
5. `On the train` / `No internet needed. Lumi plays offline.`
6. `Bedtime` / `One last story, lights low.`

### F6 NEW — Learning room (the education 40%; new fold between Fun and Feel)
Room `fill="white"`, `reveal="right"`, guide pose `curious`,
say `This is the part where the games are secretly lessons.` [GATED:kheelu-line]
- Kicker: `The learning, built in`
- H2: `Your child hears a story. Lumi asks what happens next.`
- Lede: `Every Lumi carries stories and lessons your child can interrupt, question, and be
  quizzed on. Lumi reads, your child asks why, and Lumi asks one back. That is Kheelu mode,
  and it feels like a game.` [YC]
- Layout: two columns md+ (copy left, LearnDemo right), stacked below.
- **LearnDemo** = `ChatDemo` with the new script prop (§2.3):
  - lumi: `And the slow tortoise crossed the line first. Why do you think the hare lost?`
  - child: `He went to sleep!`
  - lumi: `He did. If you were the hare, what would you do?`
  (Quoted toy/child speech; contractions and the exclamation are inside quotes, sanctioned.)
- Under the demo, three chips (existing chip pattern from /playos):
  `New words, counted in the app` · `Numbers and rhymes` · `Feelings, named` [YC + live]
- Closing line (16px, ink-muted): `Lessons follow your child's age, from 2 to 5 today, and
  grow with the family of friends to 14.` (from constants)
- Mid-page CTA (Apple-tier pass: a buy path after the strongest new fold): Reserve Button +
  PRICE_CAPTION under the demo column on md+, full width below sm.

### F7 NEW — Brain-development room (the 20%; compact, one Reveal)
Room `fill="cream"`, `reveal="left"`, no guide line (gravity).
- Kicker: `Why talking works`
- H2: `Back and forth is how a brain gets built.`
- Body: `Researchers call it serve and return. Your child serves a question, someone returns
  it with an answer and a new question. Every loop builds language and thinking at once, in
  the years the brain grows fastest. Lumi keeps the loop going when your hands are full.`
  [live: journal "how-children-learn-by-talking", condensed]
- Link line (AnswerBlock NOT needed; plain link like /playos's): `Read the science in the
  journal` → `/stories/how-children-learn-by-talking`.

### F8 Trust (existing `TrustRoom`, unchanged copy)
The four promise cards stay word-for-word. Guide line unchanged.

### F9 Pipeline (existing Family room, copy + data swap; uses §2.2)
- H2: `One friend inside. More bodies on the way.`
- Lede: `The same friend lives inside everything we make, and it remembers your child across
  all of it. Lumi is here first. The Kheelu Speaker and AI books follow.` [YC]
- Range line (display bold, replaces "Made for a three-year-old..."):
  `Starts talking at 2. Still teaching at 14.`
- `FamilyGrid` (3 cards, age chips). Guide say updated:
  `The Speaker is my cousin. Louder, and better at maths.` [GATED:kheelu-line]

### F10 Parents room (existing `ParentAppSection`, copy add)
- H2 (from copy-v2, now the room's headline): `Your child is just playing. You can see the
  learning.`
- Lede: `Open the app for a daily summary, the full conversation log, and one simple thing to
  do together each day. The new words your child learned are counted for you. If something
  ever needs your attention, you hear about it first.` [YC]
- Chips unchanged (Summary and notifications · Conversation log · Topic filters · Your
  culture, woven in · One prompt, your way).
- NEW Kheelona+ band (compose the existing one-prompt band pattern from /playos):
  heading `Kheelona+`, body = `KHEELONA_PLUS_LINE` constant, plus:
  `You pay nothing today, and nothing renews without you.` [fact: no payment now + no
  auto-charge, already published on /terms]
  Do NOT state what happens after the 6 months (gate V3-b).

### F11 Compare (existing, §2.5 row change) + tuition line
Under the table, above the mid-page Reserve button, one line (display bold, 19px):
`A tutor runs out of time and patience. Lumi does not.` [YC]
Then Button + PRICE_CAPTION as shipped.

### F12 Testimonials (`ParentQuotes` reworked per §2.4)
- Kicker: `From the pilot families` → keep. H2: `The first families are already talking.`
  (exists on /products/lumi; reuse). NO counts anywhere.

### F13 Journal (unchanged)

### F14 Finale (existing orange room) + two additions
1. After the price paragraph, small print line (white, 15px, above the Tally embed):
   `Every Lumi includes 6 months of Kheelona+.` (Short form; the parents room carries the
   full sentence.)
2. NEW share element (Apple-tier pass; India's native growth loop, zero backend): under the
   consent print, one plain white underlined link, `target="_blank" rel="noopener"`, label
   `Know a parent who needs this? Share Lumi on WhatsApp` → href `https://wa.me/?text=` +
   URL-encoded `A screen-free talking friend that teaches, for ages 2 to 5. First 500 units
   at Rs 4,999, no payment now: https://kheelona.com` (Rs in the payload — the rupee sign
   garbles in some WhatsApp clients). Implement as a `share` prop on FinaleCTA, default on;
   test asserts the encoded href.

Metadata (layout + page): title
`Lumi by Kheelona: the screen-free talking friend that teaches, ages 2 to 5`
description: `Lumi talks with your child, tells stories, and slips learning into play, in up
to 10 home languages. No screen. You read every word. Reserve at ₹4,999, no payment now.`

## §4 Other routes — slice V3-3 (Lumi) and V3-4 (interior)

### 4.1 `/products/lumi`
- Hero: age chip/lede move to `2 to 5`: lede `A talking friend for ages 2 to 5. No screen,
  ever. Lumi listens, answers, then asks the next question.` H1 unchanged.
- DOES grid: replace `Lessons that feel like play` body with `Numbers, words, and why the sky
  is blue. Stories your child can be quizzed on.` [YC]; other cards unchanged.
- NEW room after the four-steps room — **Kheelu mode** (mirror of Home F6, shorter):
  H2 `Stories that ask questions back.` Lede: `Kheelu mode fills Lumi with stories and
  lessons your child can interrupt, question, and be quizzed on, offline. New packs arrive
  over time.` [YC + live content-library copy] + LearnDemo (same script, shared component).
- Parent app room: lede gains the same one-action + words-counted sentence as Home F10; add
  the Kheelona+ band (same composition).
- FAQ (`FAQ_ITEMS`) changes:
  - Ages answer → `Ages 2 to 5. Lumi meets your child where they are, and the family of
    friends grows with them to 14.`
  - NEW: `Does Lumi need a subscription?` → `Every Lumi includes 6 months of Kheelona+, the
    stories, lessons, languages, and the parent app. The monthly price after that is announced
    before launch. Nothing renews without you.` (mirror into JSON-LD; visible copy only)
  - NEW: `What is Kheelona+?` → `The content and the controls: stories, lessons, language
    packs, and the parent app that shows you the learning. It is included free for the first
    6 months with every Lumi.`
  - `What is PlayOS?` answer unchanged. Ship/price/pay answers unchanged.
- JSON-LD Product description: ages 2 to 5 wording.
- Compare row + pilot quotes inherit shared changes.

### 4.2 `/safety` (light sweep — the page was just rebuilt; do not restructure)
- Every `ages 3 to 10` → `tuned to your child's age` (WORD_RULES card 3, VOICE_PATH step 3)
  or `for ages 2 to 5 today` where a band is needed (FAQ answer 1 → `...for ages 2 to 5
  exactly, and it grows with the family of friends.`). Do not touch the GATED
  three-year-old block (it reads fine at 2 to 5).
- FAQPage schema mirrors the edited visible answers.

### 4.3 `/playos`
- Hero lede: `PlayOS is the friend inside every Kheelona companion, from age 2 to 14. It
  remembers, speaks your languages, and answers to you.`
- Family room lede: `Every friend that follows Lumi runs on the same PlayOS soul and the same
  memory of your child. What Lumi starts at 2, the Kheelu Speaker carries to 14, and AI books
  bind together.` [YC] (FamilyGrid already updated via §2.2.)
- Parent-app AnswerBlock answer: append `It counts the new words your child learned and gives
  you one simple thing to do together each day.` [YC] (mirror in schema).
- Add the Kheelona+ band after the one-prompt band (same composition as Home F10).
- SAFETY_LAYERS card `Age-graded responses` body → `Answers tuned to your child's age, not
  shrunk from adult AI.`
- "The brain keeps growing" lede: append `It is a small brain trained only for children.`
  [live+YC] (already consistent with the safety-layers wording).

### 4.4 `/team`
- Hero: keep structure; lede paragraph 2 gains one sentence after "...a voice.":
  `And education runs in the family: the first school Apoorva attended was the one his family
  runs, and he has been enrolling friends into classrooms since he was a teenager.` [YC]
- Aman bio → `Aman builds the part that thinks. He studied AI, shipped machine learning in
  production, and holds 14 patents filed in his own name. He owns the backend and the brain:
  the voice loop your child talks to, the safety filters, and the small language model we
  train ourselves.` [YC merge]
- Kashyap bio → `...He owns the hardware and the power: the Kheelona Magic Box, the battery
  that lasts, and the unglamorous work of making it safe to hug.` (one clause swap; Intel/
  Thunderbolt sentence unchanged.)
- Apoorva bio → `Apoorva grew up inside education businesses: his family runs the pre-school
  where he was the first student, in 1994, and he helped run his father's coaching centre as
  a teenager. Fifteen years in finance and company-building later, he is a Chartered
  Accountant who learned to ship AI. He owns the frontend, the firmware, and the promise this
  brand makes to your family.` [YC]
- Ria card unchanged. Quotes unchanged (founder-published).

### 4.5 `/setup`, `/stories`, `/privacy`, `/terms`, 404
- `/setup`: no copy change (verify no age strings).
- `/stories` + articles: already swept in M4; verify the grep in §7 passes.
- Legal: unchanged (counsel gate). 404: unchanged.
- `src/app/layout.tsx` metadata: description ages → `for ages 2 to 5` phrasing consistent
  with Home.
- `src/components/organisms/Footer.tsx` (Apple-tier pass): add the signature line
  `Designed by parents in Bengaluru.` as the last line of the brand column (15px, existing
  muted footer style; factual per the YC application). Update the Footer test.

## §5 Micro-interactions (per fold; a junior dev implements from this table alone)

### 5.1 The visual-anchor rule (Apple-tier pass — binding for Home and /products/lumi)
Every room owns exactly ONE visual anchor; copy never stands alone in a room on the two
conversion pages. Home audit: F1 hero art (interim until REV-a — the single highest-leverage
asset on the site) · F2 logos · F3 big-type statement (the one sanctioned type-only moment
per page) · F4 film · F5 orbit · F6 LearnDemo card · F7 the journal photo
`/stories/how-children-learn-by-talking.jpg` as a right-column image (grandmother
storytelling scene, already on disk; below-fold lazy, proper `sizes`) · F8 shape chips ·
F9 pipeline cards · F10 PhoneFrame dashboard · F11 the table · F12 quote cards · F14 the
product lineup. If an edit ever leaves a room text-only, add the visual before shipping.

**Global rules recap first**: only `transform`/`opacity`; directional (left/right) reveals
render as vertical below 960px (already in `globals.css` — do not add new X animation
anywhere); every new animation needs a reduced-motion path that shows the finished state;
base state of any CSS-choreographed card is the COMPLETE card (no-JS/crawler-safe).

| Fold | Interaction | Spec |
|---|---|---|
| All rooms | Entrance | Existing `Room reveal` alternation (left/right/pop) — no changes. New rooms F6 `right`, F7 `left`. |
| Guide | Narration | Existing `KheeluGuide` IO contract. New `data-say` lines in §6.4 only. |
| F5 Orbit | Rotation | Existing `KheeluOrbit` (CSS ring, counter-rotating upright cards, pause on hover, static grid <md and reduced-motion). Only card text changes. |
| F6/Lumi LearnDemo | Typing | Reuse `ChatDemo` CSS typing exactly: stagger via `animation-delay`, base state = all bubbles visible; animation runs only `md+` AND `prefers-reduced-motion: no-preference` (matches existing ChatDemo gating). No new client JS. |
| F6 chips | none | Static chips (existing pattern). No hover motion. |
| F9 Pipeline | Age arc | Pure CSS: a 2px `border-line-soft` horizontal rule behind the three cards on `md+` (pseudo-element on the grid wrapper, `top` aligned to the age chips), giving the 2→14 timeline read. No JS, no animation. Cards keep the existing Reveal stagger (`delay={i * 0.06}`). Age chip: absolute top-right inside the media area, `max-w-full` safe. |
| F10 Kheelona+ band | none | Static band (the /playos one-prompt band composition). |
| F12 Quotes | Entrance | Existing ParentQuotes Reveal stagger; no tilt (cards are not links, tilt allowed but keep `Card` default). |
| Dialogs | — | `FeelingsGallery` untouched; remains the only Radix dialog. |

Explicitly rejected (do not build): counters/odometers for "words learned" (no real numbers
exist — never fake data motion), parallax on the pipeline row, autoplaying carousels.

## §6 Assets and founder gates

### 6.1 Gate registry (mirror into FOUNDER-TODO.md as V3-a..d)
- **V3-a Testimonials**: real quotes + consent from Shweta, Priyamvada, Gaurav replace the
  §2.4 placeholders verbatim slots. BLOCKS merge to main.
- **V3-b Kheelona+ facts**: (1) ₹ monthly price, (2) what the device does if the subscription
  lapses. Until then: no price, no post-lapse claims anywhere. Copy in this spec already
  complies.
- **V3-c Pipeline art**: Kheelu Speaker + AI books renders via Gemini kit (§6.3). Until then
  AssetSlot calm placeholders.
- **V3-d Kheelu lines v3**: §6.4 queue sign-off. BLOCKS merge to main (same as v2 lines).
- **V3-e (note, not a blocker)**: consider adding a colour-preference field (blue/green/
  pink) to the Tally form — the site's ColorwayPicker builds a preference the form currently
  drops. Founder owns the form. Also: refresh `public/og.png` once REV-a hero art lands.
- Evaluated and REJECTED for V3 (do not build): sticky product subnav (navbar pill + mobile
  dock already give a persistent Reserve), autoplay hero video loop (revisit after REV-a,
  founder call), waitlist counters/referral leaderboards (no backend; invented numbers break
  the honesty law), announcement ribbon (cap line already above the fold; calm law).
- Surviving gates unchanged: REV-a hero art, camera, ship date, named languages, certs/specs,
  Tally URL, GA4, counsel review.

### 6.2 Retired by V3 (remove or supersede)
- "Ten families test Lumi every day" and every pilot-count string.
- Lori/Lua/Robu on kheelona.com (data + images out of `lib/family.ts`; the pngs stay in
  `public/products/` untouched for kheelona.ai parity; magic-box.png stays, /playos uses it).
- The "3 to 10" age band (grep-enforced).
- FOUNDER-TODO REV-b items (1) subscription and (4) languages are superseded: (1) is answered
  by Kheelona+ (V3-b remains for price/lapse), (4) stays gated for the NAMED list only.

### 6.3 Gemini kit to prepare: `gemini-handoff/pipeline-2026-07/`
README with: reference images (lumi-blue-2.png for style anchor, mascot poses for the brand
look), one prompt per asset — (a) "Kheelu Speaker": a friendly kid-room smart speaker carrying
the Kheelu character's colour language (orange/blue), soft shapes, no screen, studio cutout
style matching the Lumi renders; (b) "AI book": an open illustrated storybook with a subtle
speaker grille in the spine, same palette. 3:4 renders, plain background for `tools/cutout`.
ALSO include in the same kit (visual-anchor rule §5.1, optional batch): (c) a warm
learning-moment illustration for the Home Learning room in the brand shape language, if the
founder prefers it over the demo-only layout.
Founder runs; ingest from `~/Downloads`; process through `tools/cutout`.

### 6.4 Kheelu say-line queue v3 (ALL GATED:kheelu-line; adds to the v2 queue)
- Home F6: `This is the part where the games are secretly lessons.`
- Home F9: `The Speaker is my cousin. Louder, and better at maths.`
- /products/lumi Kheelu-mode room: reuses the Home F6 line (same fold, same voice).
- /products/lumi pace panel (added 2026-07-28): `I only ever have one child to keep up with.`
- All v2 lines carry over unchanged (WORKING.md queue). No other new lines.

## §7 Build order and QA (per slice: `npm test` + `npm run build` green before commit)

- **V3-1 Shared** (§2): constants, family.ts + FamilyGrid, ChatDemo script prop, ParentQuotes,
  CompareTable, FootnotesRow. Tests updated alongside.
- **V3-2 Home** (§3). Chrome pass desktop + 390px mobile.
- **V3-3 /products/lumi** (§4.1).
- **V3-4 Interior** (§4.2–4.5).
- **V3-5 Cleanup + full QA + deploy**:
  1. M5 cleanup (folded in here): delete retired components + their tests/stories —
     KheeluIntro, WhyWeExist, Feelings, MeetLumi, WhatLumiDoes, HowItWorks, SafetyCallout,
     SafetyStrip, HeroConversation, StickyMobileCTA, CurveDivider, MascotScene, KheeluSays,
     hero-glow, Beat — FIRST strip the dormant `KheeluSays`/`CurveDivider` imports still
     referenced by live components (FinaleCTA, ParentAppSection, LaunchVideo, Journal,
     Compare) behind props nobody passes; then delete. Remove `teal-deep` token + Section's
     teal wash. `features/ambient-stage/` stays.
  2. Voice-lint greps on rendered HTML of all routes: `—`, `italic`, `!` (allowed only inside
     ChatDemo quoted speech), `3 to 10`, `three to six`, `3 to 6` (allowed only the cited
     WHO/AAP sleep sentence in stories-expansion), `toddler`, `Lori|Lua|Robu`,
     `Ten families|ten families|15 units`.
  3. Mobile overflow probe at 320/360/390/430 (the M4-b criterion: no sideways pan, no
     stretched fixed layer), all routes.
  4. Lighthouse per §8.20 item 5 (100 A11y/BP/SEO both form factors; Perf ≥95 desktop / ≥90
     mobile devtools-throttled), axe all routes, JSON-LD validation (schema mirrors visible
     copy ONLY), internal-href crawl 200s, `#reserve` everywhere, SSR/no-JS render check.
  5. AEO plumbing (deferred from M5): `llms.txt`, robots.txt allowances for GPTBot/
     PerplexityBot/ClaudeBot/Google-Extended, visible last-updated dates on journal articles.
  6. Docs: update WORKING.md status + copy-reference (V3 entry) + project-state + qa-report
     per milestone, FOUNDER-TODO gates.
  7. Deploy: push `revamp/kheelu-tour`, MERGE into `demo-website`, push, verify
     https://website-hdn2.vercel.app serves V3 (title check + 390px probe).

## Appendix A — alternates considered (chosen options are in the folds above)

- **A1 Hero H1 line 2**: chosen `A teacher who plays.` Alternates the founder may swap to
  with one line each: (b) `Made by people you can trust.` (the v2 line; trust moves up,
  education stays below) · (c) `Plays like a friend. Teaches like a tutor.` (replaces both
  lines; stronger tutor claim, longer).
- **A2 Tuition framing**: chosen the single line in F11. Alternate: a dedicated pricing room
  ("what a tutor costs vs what Lumi costs") — rejected for v3: needs verified tuition figures
  to avoid invented stats.
- **A3 Learning room demo**: chosen the tortoise quiz script. Alternate: a Hindi-mix exchange
  demonstrating language switching — parked until the named-languages gate clears.
