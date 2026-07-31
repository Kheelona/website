# BUILD-V6 Implementation Plan — the growth-arc content round

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship BUILD-V6 (approved 2026-07-31): the outcome-arc hero, the year-by-year growth room, mode-precise connectivity, and the consistency sweep — on `demo-website`, copy verbatim from the spec.

**Architecture:** Copy-first changes composed through the existing registry (SectionHeading/Card/Room/Faq), one new data module (`src/lib/growth-arc.ts`) feeding one new organism (`GrowthArc`), two new `config/site.ts` constants, and surgical string edits across 12 existing files. No token, nav, or route changes.

**Tech Stack:** Next.js 16 (src/-based atomic design), Vitest + @testing-library/react, Storybook 10 (dev-only), Tailwind v4 tokens. Node ≥ 24.

## Global Constraints

- Spec of record: `docs/revamp-2026-07/BUILD-V6.md`. Copy is VERBATIM from its §2 — do not improve it mid-implementation.
- Voice laws: zero em-dashes; no italics; no contractions outside Kheelu `say=` lines; ranges spelled "2 to 5"; one CTA verb (Reserve); never lead with "AI" where avoidable.
- Never state: a Kheelona+ ₹ amount, a received certification, the wake word, specs, new testimonial words.
- Prices/ages/dates/languages render from `@/config/site` constants; the approved new Kheelu line is `From first words to big ideas. I'm there.` (41 chars — the ONLY new say line permitted).
- Every new component ships colocated `.test.tsx` + `.stories.tsx`. Static cards get NO press/lift (V5 interaction contract); tilt default is fine.
- Branch: `demo-website` only. Commit per task, house narrative style, ending with:
  `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01SK5Fcpx85nmwNf6K81ZWa6`
- Commands: `npm test` (Vitest), `npx vitest run <file>` (single file), `npm run build` (token-check 17 then next build), `npx tsc --noEmit`.
- Read every file before editing it — line numbers below are anchors from 2026-07-31, not gospel.

---

### Task 1: config constants — `PRICE_HOLD_LINE` + derived `LANGUAGES_LINE`

**Files:**
- Modify: `src/config/site.ts:40` (after `CAP_LINE`), `src/config/site.ts:77-78` (`LANGUAGES_LINE`)
- Test: `test/config-copy.test.ts` (create)

**Interfaces:**
- Produces: `PRICE_HOLD_LINE: string` = `"We hold the price, you hold your place."`; `LANGUAGES_LINE` unchanged in VALUE, now derived from `LUMI_LANGUAGES`.

- [ ] **Step 1: Write the failing test**

```ts
// test/config-copy.test.ts
import {
  LANGUAGES_LINE,
  LUMI_LANGUAGES,
  PRICE_HOLD_LINE,
  CAP_LINE,
} from "@/config/site";

describe("config copy constants (BUILD-V6)", () => {
  it("derives LANGUAGES_LINE from LUMI_LANGUAGES so the list has one source", () => {
    const expected = `${LUMI_LANGUAGES.slice(0, -1).join(", ")}, and ${LUMI_LANGUAGES.at(-1)}`;
    expect(LANGUAGES_LINE).toBe(expected);
    // the exact published string must not drift while deriving it
    expect(LANGUAGES_LINE).toBe(
      "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French",
    );
  });

  it("PRICE_HOLD_LINE is the one sanctioned hold sentence", () => {
    expect(PRICE_HOLD_LINE).toBe("We hold the price, you hold your place.");
    // the finale lede is CAP_LINE + hold line; neither may contain the other
    expect(CAP_LINE).not.toContain(PRICE_HOLD_LINE);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (`PRICE_HOLD_LINE` not exported): `npx vitest run test/config-copy.test.ts`
- [ ] **Step 3: Implement.** In `src/config/site.ts`, after the `CAP_LINE` export add:

```ts
/** The hold promise (V6 D11): one sentence, one source. It closes the finale
 *  lede and the Tally placeholder card — paraphrases of it kept drifting. */
export const PRICE_HOLD_LINE = "We hold the price, you hold your place.";
```

Replace the `LANGUAGES_LINE` literal (keep the existing doc comment above `LUMI_LANGUAGES`):

```ts
export const LANGUAGES_LINE = `${LUMI_LANGUAGES.slice(0, -1).join(", ")}, and ${
  LUMI_LANGUAGES[LUMI_LANGUAGES.length - 1]
}`;
```

- [ ] **Step 4: Run test — expect PASS**, then `npm test` (nothing else may break; `seo.test.ts` and llms.txt consume `LANGUAGES_LINE` — its value is unchanged).
- [ ] **Step 5: Commit** — `V6-1: the hold promise becomes a constant, the language list gets one source`

### Task 2: `src/lib/growth-arc.ts` — the arc data + age endpoints helper

**Files:**
- Create: `src/lib/growth-arc.ts`
- Test: `src/lib/growth-arc.test.ts` (create)

**Interfaces:**
- Consumes: `LUMI_AGES` from `@/config/site`.
- Produces: `type GrowthStage = { kicker: string; title: string; body: string }`; `GROWTH_ARC: readonly GrowthStage[]` (4 stages); `GROWTH_HEDGE: string`; `GROWTH_CLOSING: string`; `lumiAgeEndpoints(): [string, string]`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/growth-arc.test.ts
import { LUMI_AGES } from "@/config/site";
import {
  GROWTH_ARC,
  GROWTH_HEDGE,
  GROWTH_CLOSING,
  lumiAgeEndpoints,
} from "./growth-arc";

describe("growth-arc data (BUILD-V6 D2)", () => {
  it("parses the LUMI_AGES endpoints", () => {
    expect(lumiAgeEndpoints()).toEqual(["2", "5"]);
  });

  it("cannot drift from LUMI_AGES: first kicker starts the band, last ends it", () => {
    const [start, end] = lumiAgeEndpoints();
    expect(LUMI_AGES).toBe(`${start} to ${end}`);
    expect(GROWTH_ARC[0]!.kicker).toBe(`At ${start}`);
    expect(GROWTH_ARC.at(-1)!.kicker).toBe(`By ${end}`);
  });

  it("ships four stages, a hedge, and the tutor re-homing line", () => {
    expect(GROWTH_ARC).toHaveLength(4);
    for (const s of GROWTH_ARC) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
    expect(GROWTH_HEDGE).toBe("Every child grows at their own pace. Lumi follows theirs.");
    expect(GROWTH_CLOSING).toBe("A best friend the whole way. A tutor whenever they need one.");
  });
});
```

- [ ] **Step 2: Run — expect FAIL** (module missing): `npx vitest run src/lib/growth-arc.test.ts`
- [ ] **Step 3: Create `src/lib/growth-arc.ts`** (copy VERBATIM — spec D2):

```ts
import { LUMI_AGES } from "@/config/site";

/** The LUMI_AGES endpoints ("2 to 5" → ["2", "5"]). The hero H1, the arc
 *  eyebrow, and the stage kickers all render from these, so the band is a
 *  one-constant edit (BUILD-V6 §3.1). */
export function lumiAgeEndpoints(): [string, string] {
  const [start, end] = LUMI_AGES.split(" to ");
  return [start!, end!];
}

const [AGE_START, AGE_END] = lumiAgeEndpoints();

export type GrowthStage = {
  /** "At 2 years" … "By 5 years" — the year marker, rendered as the card kicker. */
  kicker: string;
  title: string;
  body: string;
};

/** The year-by-year answer to "what will a kid who gets Lumi at 2 have at 5"
 *  (the parent feedback that drove BUILD-V6). Every claim traces to published
 *  copy; the By-5 card carries the founder-licensed soft school frame. Copy is
 *  spec-verbatim (BUILD-V6 D2) — do not edit here without a spec change. */
export const GROWTH_ARC: readonly GrowthStage[] = [
  {
    kicker: `At ${AGE_START}`,
    title: "Naming the world.",
    body: "Your child points, names, and repeats. Lumi answers in short words they already own, sings the rhymes you grew up with, and starts remembering which words they know.",
  },
  {
    kicker: "At 3 years",
    title: "Asking why, and why again.",
    body: "Why is the sky blue? Lumi answers the fourth why with the same patience as the first, then asks one back. Every answered why teaches your child that asking is worth it.",
  },
  {
    kicker: "At 4 years",
    title: "Playing with ideas.",
    body: "Thinking games, counting the apples a squirrel ran off with, naming a big feeling instead of hiding it. Lumi remembers where your child stopped yesterday and starts one small step further.",
  },
  {
    kicker: `By ${AGE_END}`,
    title: "Words, numbers, confidence.",
    body: "Three years of serve and return add up: the words, the numbers, and the confidence of a child who expects to be heard. All of it walks into their first classroom with them.",
  },
];

/** Pre-empts the skeptical parent's "every child is different". */
export const GROWTH_HEDGE = "Every child grows at their own pace. Lumi follows theirs.";

/** The old hero's idea, de-confused and re-homed (BUILD-V6 §1). */
export const GROWTH_CLOSING = "A best friend the whole way. A tutor whenever they need one.";
```

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit** — `V6-2: the growth arc as data, endpoints tied to LUMI_AGES`

### Task 3: `GrowthArc` organism + story

**Files:**
- Create: `src/components/organisms/GrowthArc.tsx`, `src/components/organisms/GrowthArc.test.tsx`, `src/components/organisms/GrowthArc.stories.tsx`

**Interfaces:**
- Consumes: `GROWTH_ARC/GROWTH_HEDGE/GROWTH_CLOSING` from `@/lib/growth-arc`; `Card` molecule; `Reveal`.
- Produces: `<GrowthArc />` (no props) — the cards + hedge + closing line. The page supplies the Room and SectionHeading (house pattern, like PacePanel/HowItWorksLoop rooms).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/organisms/GrowthArc.test.tsx
import { render, screen } from "@testing-library/react";
import { GROWTH_ARC, GROWTH_HEDGE, GROWTH_CLOSING } from "@/lib/growth-arc";
import { GrowthArc } from "./GrowthArc";

describe("GrowthArc", () => {
  it("renders every stage with kicker, title, and body", () => {
    render(<GrowthArc />);
    for (const s of GROWTH_ARC) {
      expect(screen.getByText(s.kicker)).toBeInTheDocument();
      expect(screen.getByText(s.title)).toBeInTheDocument();
      expect(screen.getByText(s.body)).toBeInTheDocument();
    }
  });

  it("closes on the hedge and the tutor re-homing line", () => {
    render(<GrowthArc />);
    expect(screen.getByText(GROWTH_HEDGE)).toBeInTheDocument();
    expect(screen.getByText(GROWTH_CLOSING)).toBeInTheDocument();
  });

  it("is informational: no buttons, no links, nothing pretending to be tappable", () => {
    render(<GrowthArc />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**: `npx vitest run src/components/organisms/GrowthArc.test.tsx`
- [ ] **Step 3: Create the component**

```tsx
// src/components/organisms/GrowthArc.tsx
import { Reveal } from "@/components/molecules/Reveal";
import { Card } from "@/components/molecules/Card";
import { GROWTH_ARC, GROWTH_HEDGE, GROWTH_CLOSING } from "@/lib/growth-arc";

/** The year-by-year growth room (BUILD-V6 D2) — the direct answer to the
 *  parent feedback "what will a kid who gets this at 2 have at 5". Four
 *  static stage cards (registry Card, tilt default, NO press/lift — a card
 *  that does nothing when tapped must not pretend otherwise, V5-1), then the
 *  honest hedge, then the display line that re-homes the old tutor hero. */
export function GrowthArc() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {GROWTH_ARC.map((s, i) => (
          <Reveal key={s.kicker} delay={i * 0.08}>
            <Card className="border border-line-soft">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
                {s.kicker}
              </p>
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">
                {s.title}
              </h3>
              <p className="text-[16px]">{s.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <p className="text-[15px] text-ink-muted">{GROWTH_HEDGE}</p>
      </Reveal>
      <Reveal className="mt-8">
        <p className="max-w-[46ch] font-display text-[19px] font-bold text-ink-head">
          {GROWTH_CLOSING}
        </p>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Add the story**

```tsx
// src/components/organisms/GrowthArc.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GrowthArc } from "./GrowthArc";

const meta = {
  title: "Organisms/GrowthArc",
  component: GrowthArc,
} satisfies Meta<typeof GrowthArc>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Home growth room (BUILD-V6 D2): data lives in lib/growth-arc. */
export const Home: Story = {};
```

- [ ] **Step 6: `npm test` green, then commit** — `V6-3: GrowthArc, the year-by-year answer as an organism`

### Task 4: Hero copy (D1) + metadata (D10)

**Files:**
- Modify: `src/features/home/components/Hero.tsx:35-49` (H1 + subhead + comment), `src/app/page.tsx:34-40` (metadata), `src/app/layout.tsx:34` (default title)
- Test: `src/features/home/components/Hero.test.tsx` (read it first; update its H1/subhead assertions)

**Interfaces:**
- Consumes: `lumiAgeEndpoints()` from `@/lib/growth-arc` (Task 2).

- [ ] **Step 1: Update `Hero.test.tsx` assertions FIRST** (exact new strings): H1 renders "A best friend at 2." and "A head start by 5." (the second in the coloured block span); subhead is "Lumi listens, remembers, and grows with your child. Stories, numbers, and the languages you speak at home, at their pace." Run `npx vitest run src/features/home/components/Hero.test.tsx` — expect FAIL against the old copy.
- [ ] **Step 2: Edit `Hero.tsx`.** Replace the V4 provenance comment + H1 + subhead (keep the V5-5 wrap note if it still applies, else drop it):

```tsx
          {/* V6 hero (BUILD-V6 D1, founder-approved): the outcome arc. It
              answers the feedback that drove this round ("what will a kid who
              gets this at 2 GET at 5") in the first two lines of the site.
              The tutor claim moved out of the hero (it confused readers) and
              lives in Compare, PacePanel, the growth room's closing line, and
              the metadata title (BUILD-V6 §1). Ages render from LUMI_AGES via
              lumiAgeEndpoints. The 5-second test still holds: what it is
              (a friend that gives a head start), who it is for (2 to 5), the
              offer (cap card), the risk (none, no payment). */}
          <h1 className="mb-5 text-balance font-display text-[clamp(38px,4.8vw,60px)] font-extrabold leading-[1.06] text-ink-head">
            A best friend at {ageStart}.{" "}
            <span className="block text-action-ink">A head start by {ageEnd}.</span>
          </h1>
          <p className="mb-7 max-w-[42ch] text-[clamp(17px,1.5vw,20px)] text-ink">
            Lumi listens, remembers, and grows with your child. Stories,
            numbers, and the languages you speak at home, at their pace.
          </p>
```

with, at the top of the component (after imports; add the import):

```tsx
import { lumiAgeEndpoints } from "@/lib/growth-arc";
// inside the component body:
const [ageStart, ageEnd] = lumiAgeEndpoints();
```

- [ ] **Step 3: Metadata.** `src/app/page.tsx` metadata becomes:

```ts
export const metadata: Metadata = {
  title: "Lumi: the screen-free AI toy with a tutor inside, ages 2 to 5 | Kheelona",
  description:
    "A best friend at 2, a head start by 5. The screen-free toy that grows with your child, in the languages you speak at home. Reserve at ₹4,999, no payment now.",
  alternates: { canonical: "/" },
};
```

`src/app/layout.tsx:34` default title: `"Lumi by Kheelona: the screen-free friend that grows with your child, ages 2 to 5"` (one verb, `learns` → `grows`; description unchanged, spec D10).

- [ ] **Step 4: Run Hero test — expect PASS. Then `npm test`** (a layout/seo test may assert the old default title — update any such assertion to the new string; the spec licenses exactly this change).
- [ ] **Step 5: Commit** — `V6-4: the outcome-arc hero; the tutor moves to the places that argue it`

### Task 5: Home composition — growth room (D2), FAQ (D3/D4a/D7), languages outcome (D6)

**Files:**
- Modify: `src/app/page.tsx` (imports, `HOME_FAQ`, room track, audio room)

**Interfaces:**
- Consumes: `GrowthArc` (Task 3), `LUMI_AGES` from config.
- Produces: Room `id="growth"`; `HOME_FAQ` with 8 entries (schema mirrors via existing `faqPage(HOME_FAQ)` — no schema work needed).

- [ ] **Step 1: Imports.** Add `import { GrowthArc } from "@/components/organisms/GrowthArc";` and extend the config import with `LUMI_AGES`.
- [ ] **Step 2: Insert the growth room** in `RoomsTrack` directly AFTER the How-It-Works room (`say="Round and round we go. Cleverer every lap."` closes at the loop room's `</Room>`) and BEFORE the `id="warm"` room:

```tsx
        {/* The growth arc (V6 D2): what the loop above adds up to — the
            year-by-year answer to "what does my child get by 5". Say line
            founder-approved at the V6 spec review. */}
        <Room
          fill="cream"
          id="growth"
          guide="joy"
          say="From first words to big ideas. I'm there."
          reveal="left"
        >
          <Reveal>
            <SectionHeading
              eyebrow={`From ${LUMI_AGES}`}
              title="What your child gets, year by year."
              titleClassName="mb-3"
              lede="Lumi remembers what your child knows and asks the next question. Here is how the same friend meets them at every age."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <GrowthArc />
        </Room>
```

- [ ] **Step 3: FAQ edits in `HOME_FAQ`** (schema follows automatically):
  - INSERT as the second entry (after "What is Lumi?"):

```ts
  {
    q: "What will my child actually get out of Lumi?",
    a: "A friend at 2, and a head start by 5. Lumi answers your child's questions, remembers the words they know, and builds on them the next day: stories, numbers, thinking games, and the languages you speak at home. The parent app counts the new words, so you see the growth, not just the play.",
  },
```

  - REPLACE the "Does Lumi need the internet to work?" answer with:

```ts
    a: "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Kheelu-mode stories and lessons play offline, and Bluetooth music needs only a paired phone. On a train or anywhere without a signal, your child still has stories to interrupt, question, and be quizzed on.",
```

  - REPLACE the "Is an AI toy safe for a small child?" answer with:

```ts
    a: "Not all of them are, and the difference is in how they are built. Lumi wakes to a word and the microphone is off the rest of the time, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
```

- [ ] **Step 4: Languages outcome (D6).** In the audio room, between the languages-footnote `Reveal` (`className="mt-7"`) and the CTA `Reveal` (`className="mt-8 flex …"`), insert:

```tsx
          <Reveal className="mt-4">
            <p className="max-w-[64ch] text-[16px] text-ink-muted">
              A child who can wonder in their own words wonders more, and a
              child who plays in two languages keeps both. Why that matters for
              years to come:{" "}
              <Link
                href="/stories/raising-a-bilingual-child-in-india"
                className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                Raising a bilingual child in India
              </Link>
              .
            </p>
          </Reveal>
```

- [ ] **Step 5: KheeluOrbit train card (D4c).** In `src/features/home/components/KheeluOrbit.tsx:19`, replace the moment with:

```ts
  { label: "On the train", text: "No signal? Kheelu-mode stories still play." },
```

(Update any KheeluOrbit test asserting the old text "No internet needed. Lumi plays offline.")
- [ ] **Step 6: `npm test` + `npx tsc --noEmit` green** (any Home page test asserting FAQ count or room count updates to the new numbers — 8 FAQ entries, 14 rooms). `npm run build` green.
- [ ] **Step 7: Commit** — `V6-5: Home answers the parents' question, year by year`

### Task 6: `/products/lumi` — arc echo (D5) + mode-precise copy (D4 b/d/f)

**Files:**
- Modify: `src/app/products/lumi/page.tsx:45,67`, `src/app/products/lumi/_components/PacePanel.tsx` (end of component), `src/components/organisms/LumiModes.tsx:31`
- Test: `src/app/products/lumi/_components/PacePanel.test.tsx`, `src/components/organisms/LumiModes.test.tsx` (read; update if they assert the old strings)

- [ ] **Step 1: PacePanel test first.** Add assertions for the two new pieces (exact strings below), run — expect FAIL.
- [ ] **Step 2: PacePanel echo (D5).** In `PacePanel.tsx`, import `lumiAgeEndpoints` from `@/lib/growth-arc`, read `const [ageStart, ageEnd] = lumiAgeEndpoints();` in the component, and AFTER the existing closing `Reveal` ("Every answer. Every day. At exactly the pace they set.") add:

```tsx
      {/* V6 D5: the pace argument extended from days to years, closing on the
          hero promise verbatim — one promise, said identically on both pages. */}
      <Reveal className="mt-10">
        <p className="max-w-[58ch] text-[16px] text-ink">
          The memory that picks up where your child stopped tomorrow keeps
          picking up for years. First words at {ageStart} become stories,
          numbers, and questions by {ageEnd}, one day at a time.
        </p>
        <p className="mt-4 font-display text-[19px] font-bold text-ink-head">
          A best friend at {ageStart}. A head start by {ageEnd}.
        </p>
      </Reveal>
```

- [ ] **Step 3: FAQ answer (D4b).** In `page.tsx`, replace the `"Does Lumi need the internet?"` answer with:

```ts
  { q: "Does Lumi need the internet?", a: "Only for open conversation: AI mode runs on your home WiFi. Kheelu-mode stories and lessons work offline, and Bluetooth music needs only a paired phone. New content and updates download when you choose." },
```

- [ ] **Step 4: DOES grid (D4f).** Replace line 45 with:

```ts
  { h: "Offline adventures", b: "Kheelu-mode stories and your paired playlist travel anywhere, no signal needed." },
```

- [ ] **Step 5: LumiModes AI card (D4d).** In `LumiModes.tsx:31`, the AI-mode `body` gains the closing sentence — new value:

```ts
    body: "Your child asks why the sky is blue, and Lumi answers in words they already own, then asks one back. This is the mode they will use most, and the one that grows their vocabulary without anyone calling it a lesson. It runs on your home WiFi.",
```

Update `LumiModes.test.tsx` if it asserts the old body verbatim. (Home's `strip` variant shows chips only, so this surfaces on `/products/lumi` alone — verify by reading the component's strip branch.)
- [ ] **Step 6: `npm test` green. Commit** — `V6-6: the product page joins the arc, and every offline claim names its mode`

### Task 7: `/safety` accordion swap (D7)

**Files:**
- Modify: `src/app/safety/page.tsx:119`

- [ ] **Step 1: Replace the first `SAFETY_FAQ` entry** (`"Is an AI toy safe for a 3 year old?"` — a near-duplicate of the page's flagship AnswerBlock) with:

```ts
  { q: "Will Lumi replace time with me?", a: "No, and it is not built to. Lumi is for the moments your hands are full, not the ones they are not. The parent app gives you one simple thing to do together each day, quiet hours are yours to set, and the grown-up holds the keys, always." },
```

The page's FAQPage schema is built from `SAFETY_FAQ`, so the swap flows through — verify by reading how the page builds its JSON-LD before editing.
- [ ] **Step 2: `npm test` green** (update any safety test asserting the old question). **Commit** — `V6-7: /safety stops asking itself the same question twice`

### Task 8: legal pages join the published ship date (D8)

**Files:**
- Modify: `src/app/privacy/page.tsx:25`, `src/app/terms/page.tsx:44`

- [ ] **Step 1: privacy.** Import `SHIP_DATE_TEXT` from `@/config/site`; replace the string at `:25` with:

```ts
      `Your email and WhatsApp number let us tell you about your reservation: the price hold, your place in line, and any change to the ${SHIP_DATE_TEXT} ship date.`,
```

- [ ] **Step 2: terms.** Import `SHIP_DATE_TEXT` and `LAUNCH_PRICE`; replace the first paragraph at `:44` with:

```ts
      `Lumi is still being finished. The ship date is published, ${SHIP_DATE_TEXT}, and we build to it. Specifications and availability can still move while we complete testing and certification. If the ship date itself ever moves, you hear it from us first, and your ${LAUNCH_PRICE} hold stays exactly as it is.`,
```

- [ ] **Step 3: `npm test` green. Commit** — `V6-8: privacy and terms stop hedging a date the same page states`

### Task 9: journal fixes (D9, slugs untouched)

**Files:**
- Modify: `src/lib/stories.ts:35,86`

- [ ] **Step 1: line 86** ("How children learn by talking"): `"in 10 home languages"` → `"in up to 10 home languages"` (the rest of the paragraph unchanged).
- [ ] **Step 2: line 35** ("Why the early years matter most") — new opener (band aligned to `LUMI_AGES`, spelling normalized):

```ts
      { p: "Somewhere between the second and fifth birthday, your child becomes a person. Not a smaller version of one. The real thing: opinions, jokes, fears, favourite dinosaurs." },
```

The cited WHO/AAP band ("aged 3 to 6", sleep guidance in the screen-time article) is NOT touched.
- [ ] **Step 3: `npm test` green. Commit** — `V6-9: the journal agrees with the band and the ceiling`

### Task 10: llms.txt connectivity (D4e)

**Files:**
- Modify: `src/app/llms.txt/route.ts` (the "What Lumi is" section, after the "Three modes" bullet)

- [ ] **Step 1: Add the bullet** directly after the "Three modes, one toy: …" line:

```
- Connectivity: AI mode (open conversation) runs on home WiFi. Kheelu-mode stories and lessons work offline, and Bluetooth music needs only a paired phone.
```

Also check `src/app/pricing.md/route.ts` for any connectivity claim (the spec expects none — leave it unless it states one).
- [ ] **Step 2: `npm test` green (an llms.txt test may snapshot the body — update). Commit** — `V6-10: the machine-readable page learns the mode-precise truth`

### Task 11: FinaleCTA lede + Tally placeholder from constants (D11)

**Files:**
- Modify: `src/components/organisms/FinaleCTA.tsx:58-61`, `src/components/molecules/TallyEmbed.tsx` (placeholder card sentence)
- Test: `src/components/organisms/FinaleCTA.test.tsx`, `src/components/molecules/TallyEmbed.test.tsx` (read; update assertions)

- [ ] **Step 1: FinaleCTA.** Import `CAP_LINE, PRICE_HOLD_LINE` (drop now-unused `LAUNCH_PRICE/LATER_PRICE` imports if nothing else uses them in the file); the lede paragraph becomes:

```tsx
        <p className="mb-8 max-w-[50ch] text-[19px] font-bold text-ink-head md:text-[21px]">
          {CAP_LINE} {PRICE_HOLD_LINE}
        </p>
```

(Rendered text: "First 500 units at ₹4,999. ₹9,999 after launch. No payment now. We hold the price, you hold your place." — same facts, one wording, spec D11.)
- [ ] **Step 2: TallyEmbed placeholder.** Find the placeholder card's hold sentence ("We hold the price, you hold your place.") and render it from `PRICE_HOLD_LINE`.
- [ ] **Step 3: Update both test files** to assert composition from the constants (e.g. `expect(screen.getByText(\`${CAP_LINE} ${PRICE_HOLD_LINE}\`)).toBeInTheDocument()`), run — expect PASS after the edits.
- [ ] **Step 4: `npm test` green. Commit** — `V6-11: one price sentence, three depths, zero drift`

### Task 12: code hygiene (stale comments + dead prop)

**Files:**
- Modify: `src/app/contact/page.tsx` (comment block only), `src/components/organisms/FamilyGrid.tsx` (docstring only), `src/components/organisms/RecognitionStrip.tsx:13,41-45,92`, `src/components/organisms/RecognitionStrip.test.tsx:21`

- [ ] **Step 1: contact comment.** Replace the stale paragraph of the header comment (it claims `CONTACT_EMAIL` is null; it has been `hello@kheelona.com` since 2026-07-28) with:

```
 * `CONTACT_EMAIL` is the founder-confirmed monitored inbox (2026-07-28). The
 * old Wix phone number was a placeholder and is never published (config/site).
```

Keep the rest of the comment (the routing rationale still holds).
- [ ] **Step 2: FamilyGrid docstring.** The claim "Home's pipeline room and /playos both show this lineup" is stale (/playos carries only the moat card). Rewrite that sentence to: "Home's pipeline room shows this lineup, fed by the single `lib/family` source (it was hand-typed twice before the M4 extraction and had drifted)."
- [ ] **Step 3: RecognitionStrip.** Remove the `safetyLine` prop, its docstring sentence, and the `{safetyLine && (…)}` branch (read the whole file first; the proof-row content it renders is published nowhere — dead since V3). Update `RecognitionStrip.test.tsx:21` to drop the `safetyLine` rerender and its assertions.
- [ ] **Step 4: `npm test` + `npx tsc --noEmit` green. Commit** — `V6-12: the comments stop lying and the dead prop goes`

### Task 13: full gates + AFTER screenshots

**Files:** none in-repo (scratchpad harness + probes)

- [ ] **Step 1:** `npm test` (expect ~275+, all green) · `npx tsc --noEmit` · `npm run build` (token-check 17).
- [ ] **Step 2:** `npx next start -p 3457` (check `lsof -iTCP:3457` first). Voice-lint probe over all rendered routes — em-dash, `<em>`, and non-say-line contractions:

```bash
for r / /products/lumi /playos /safety /setup /team /stories /contact /privacy /terms /stories/why-three-to-six-are-the-years-that-matter-most; do
  html=$(curl -s "http://localhost:3457$r")
  printf '%s emdash=%s em=%s\n' "$r" "$(printf '%s' "$html" | grep -c '—')" "$(printf '%s' "$html" | grep -c '<em')"
done
```

Expect 0/0 everywhere. Then grep the SSR HTML for `n&#x27;t|&#x27;re |&#x27;ll |I&#x27;m` and confirm every hit sits inside a `data-say` attribute or the KheeluGuide script (the sanctioned exemption).
- [ ] **Step 3:** AFTER screenshots with the §8.23 harness (`scratchpad/shot.mjs`, reveals forced): `/`, `/products/lumi`, `/safety`, `/privacy`, `/terms`, `/stories/why-three-to-six-are-the-years-that-matter-most` at 1440×900 and 390×844 → `scratchpad/after/`. Compare against `scratchpad/before/` pairs.
- [ ] **Step 4:** axe with reveals FORCED (recreate `axe-run.mjs` per §8.23 if absent) on `/`, `/products/lumi`, `/safety` at both viewports — expect 0 violations. Overflow probe at 320/390 on `/` and `/products/lumi` — expect 0 horizontal overflow.
- [ ] **Step 5:** JSON-LD: fetch `/`, `/products/lumi`, `/safety`, parse every `application/ld+json` block, assert the new FAQ q/a strings appear in the FAQPage schema and the retired safety question does not. Confirm `#reserve` present on every route. Kill the server.
- [ ] **Step 6: Commit anything the gates changed** (test-count docs etc. wait for Task 14).

### Task 14: documentation

**Files:**
- Modify: `docs/copy-reference.md` (new "V6" section: each deliverable → source, the Q3/Q4 licensed facts, the approved say line), `docs/website-steps.md` (new §8.24: the mode-precise connectivity law — an offline claim must name its mode; GrowthArc + PRICE_HOLD_LINE join the registry list), `docs/project-state.json` (`last_handoff` gains a `v6_growth_arc` entry: what shipped, test count, gates run, awaiting Step-3 QA), `CLAUDE.md` (STATE OF PLAY block: V6 built on demo-website awaiting QA/founder review; registry + laws pointers), `docs/qa-report.md` (V6 section: gate results, screenshot evidence locations), `Design/design-system/` (note the GrowthArc card pattern per the design-system-as-source-of-truth rule)
- Modify: `docs/revamp-2026-07/BUILD-V6.md` (STATUS line → BUILT, gates green, awaiting Step-3 QA)

- [ ] **Step 1:** Write each doc update with the REAL numbers from Task 13 (test count, axe results, screenshot paths). No placeholders.
- [ ] **Step 2: Commit** — `V6-14: the record catches up with the build`

---

## Self-review (done at plan-writing)

- **Spec coverage:** D1→T4, D2→T2/T3/T5, D3→T5, D4a/c→T5, D4b/d/f→T6, D4e→T10, D5→T6, D6→T5, D7→T5+T7, D8→T8, D9→T9, D10→T4, D11→T1/T11, hygiene→T12, QA→T13, docs→T14. §3.7 derived LANGUAGES_LINE→T1. (One gap found and fixed at review: D4c/KheeluOrbit is a Home component — it now lives in Task 5 Step 5.) ✔
- **Placeholder scan:** none; every step carries exact strings or code. ✔
- **Type consistency:** `GrowthStage {kicker,title,body}` used identically in T2/T3; `lumiAgeEndpoints(): [string,string]` consumed in T4/T6 as written. ✔
