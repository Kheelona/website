import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PRESS, LIFT, PRESS_LIFT, PRESS_TINT } from "@/lib/interactions";

/* V5-1 guard (website-steps §8.23-1): the interaction contract must stay a
 * CONTRACT. The review that produced it found two `active:` states in the whole
 * codebase and four different hand-rolled hover treatments across four card
 * types — one of them with a hardcoded shadow value. This test fails if that
 * drift starts again. */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(name) && !/\.(test|stories)\.tsx$/.test(name)) out.push(p);
  }
  return out;
}

const SRC = join(process.cwd(), "src");
const files = walk(SRC).map((p) => ({ p: p.replace(SRC, "src"), s: readFileSync(p, "utf8") }));

describe("the interaction contract", () => {
  it("gives touch a real answer: press scales down on the bouncy ease", () => {
    for (const c of [PRESS, PRESS_LIFT, PRESS_TINT]) {
      expect(c).toMatch(/active:scale-\[0\.9\d\]/);
      expect(c).toMatch(/ease-\(--ease-bounce\)/);
    }
  });

  it("neutralises every motion for reduced-motion users", () => {
    for (const c of [PRESS, LIFT, PRESS_LIFT, PRESS_TINT]) {
      expect(c).toMatch(/motion-reduce:/);
    }
  });

  it("keeps hover lift off touch screens (a stuck hover reads as a bug)", () => {
    expect(LIFT).toMatch(/md:hover:/);
    expect(LIFT).not.toMatch(/(^|\s)hover:-translate/);
  });

  it("animates only transform and shadow, never layout", () => {
    for (const c of [PRESS, LIFT, PRESS_LIFT, PRESS_TINT]) {
      expect(c).not.toMatch(/transition-\[[^\]]*(width|height|margin|padding|top|left)/);
    }
  });

  /* The drift this file exists to prevent: a new tappable surface inventing its
     own hover instead of composing the contract.
     Targets a tappable surface's OWN lift. Two things are deliberately not
     drift: `group-hover:` on a nested element (the feeling character peeking up
     inside its card is a detail, not the surface's lift), and the centralized
     LIFT_WHEN_CLOSED variant. Everything else must come from the contract. */
  it("no surface hand-rolls its own hover lift outside the contract", () => {
    const offenders = files.filter(
      (f) =>
        /(?<!group-)hover:-translate-y/.test(f.s) &&
        !/lib\/interactions/.test(f.p) &&
        !/atoms\/Button\.tsx$/.test(f.p) &&
        !/vendor\//.test(f.p),
    );
    expect(offenders.map((f) => f.p)).toEqual([]);
  });

  /* Scoped to INTERACTION shadows on purpose. The journal card used to carry
     `hover:shadow-[0_16px_32px_rgba(216,95,27,0.12)]` — a bespoke hover value
     nothing else shared. Static art-direction shadows (the product's tinted
     drop-shadow, the phone bezel) are art, not interaction, and forcing them
     into tokens would be abstraction for its own sake. */
  it("no surface hardcodes an interaction shadow (the journal card used to)", () => {
    const offenders = files.filter(
      (f) =>
        /(hover|active|focus):shadow-\[/.test(f.s) &&
        !/atoms\/Button\.tsx$/.test(f.p) &&
        !/vendor\//.test(f.p),
    );
    expect(offenders.map((f) => f.p)).toEqual([]);
  });

  it("is actually adopted: every clickable card surface composes it", () => {
    const shouldUse = [
      "src/app/(site)/stories/page.tsx",
      "src/features/home/components/Journal.tsx",
      "src/components/organisms/FamilyGrid.tsx",
      "src/components/organisms/FeelingsGallery.tsx",
      "src/app/(site)/products/kheelu/_components/ColorwayPicker.tsx",
      "src/components/molecules/Faq.tsx",
      "src/components/organisms/ArchitectureStack.tsx",
    ];
    for (const path of shouldUse) {
      const f = files.find((x) => x.p === path);
      expect(f, `${path} not found`).toBeTruthy();
      expect(f!.s, `${path} must compose lib/interactions`).toMatch(/from "@\/lib\/interactions"/);
    }
  });
});
