import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { SETUP_STEP_BUILD, TEAM_LEAD_BUILD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach } from "../../../../test/support/mockup-facts";
import { setupPage } from "./setup";
import { teamPage } from "./team";

/* The team and setup pages' approved parity deviations (wiki/qa/deviations.md V7, V8; ruled at M1): the build's words
 * the rules accept are the content modules' own, and each rule excuses only the mockup lines it names. */

/** Every string of a content module, in order. */
const stringsOf = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(stringsOf)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(stringsOf)
        : [];
const TOKEN = buildOffer("token");
const contentSentences = (module: unknown) => stringsOf(module).flatMap((s) => sentences(toPlainText(s, TOKEN)));
const mockupMain = (slug: string) =>
  sentences(htmlToText(new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelector("main")!.outerHTML));
const excused = (slug: string, lines: readonly string[]) => lines.filter((l) => (TEXT_DEVIATIONS[slug] ?? []).some((r) => r.mockup.test(l)));
const accepted = (slug: string, lines: readonly string[]) => lines.filter((l) => (TEXT_DEVIATIONS[slug] ?? []).some((r) => r.build?.test(l)));

describe("team parity deviations (V7)", () => {
  it("accepts the hero lead team.ts renders, and only it", () => {
    expect(contentSentences(teamPage)).toContain(TEAM_LEAD_BUILD);
    expect(accepted("team", contentSentences(teamPage))).toEqual([TEAM_LEAD_BUILD]);
  });

  it("excuses exactly the mockup's old lead, the three gated backgrounds and fold 5", () => {
    const lines = excused("team", mockupMain("team"));
    expect(lines[0]).toBe("Kheelu is designed by parents in Bengaluru.");
    expect(lines.filter((l) => l.startsWith("[PLACEHOLDER F11:"))).toHaveLength(4);
    expect(lines).toContain("Recognised by.");
    expect(lines).toHaveLength(6);
  });

  it("hides the gated background lines and fold 5 in the mockup, and the hero lead on both sides", () => {
    expect(VISUAL_HIDDEN.team.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".mk-founder__bg"],
      ["mockup", 'section[aria-labelledby="recognised-title"]'],
      ["mockup", "#hero-title ~ .kh-heading__lead"],
      ["build", "#hero-title ~ .kh-heading__lead"],
    ]);
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/team.html"), "text/html");
    expect(doc.querySelectorAll(".mk-founder__bg")).toHaveLength(3);
    expect(doc.querySelectorAll('section[aria-labelledby="recognised-title"]')).toHaveLength(1);
    expect(doc.querySelectorAll("#hero-title ~ .kh-heading__lead")).toHaveLength(1);
  });
});

describe("setup parity deviations (V8, and the founder's page facts V15)", () => {
  const V8 = TEXT_DEVIATIONS.setup.find((rule) => rule.approvedBy.startsWith("deviations.md V8"))!;
  const FACTS = PAGE_FACTS.setup;
  const factsRule = TEXT_DEVIATIONS.setup.find((rule) => rule.approvedBy === FACTS.approvedBy)!;

  it("is two rules: V8 for step 2's light, then the founder's page facts (task 6.7)", () => {
    expect(TEXT_DEVIATIONS.setup.map((rule) => rule.approvedBy)).toEqual([V8.approvedBy, FACTS.approvedBy]);
  });

  it("accepts step 2's light as setup.ts renders it, and with the facts the lines setup.ts renders for them, and nothing else", () => {
    for (const line of [...SETUP_STEP_BUILD, ...FACTS.build]) expect(contentSentences(setupPage)).toContain(line);
    expect(accepted("setup", contentSentences(setupPage))).toEqual([FACTS.build[0], ...SETUP_STEP_BUILD, FACTS.build[1]]);
  });

  it("lists exactly the sentences the founder's facts change (page-facts.ts against the mockup)", () => {
    expect(factSentences(mockupFold("setup", "main"), FACTS.edits)).toEqual({ missing: [...FACTS.mockup], extra: [...FACTS.build] });
  });

  it("excuses and accepts exactly those sentences through its facts rule, and no other line of the page", () => {
    expect(ruleReach(mockupFold("setup", "main"), FACTS.edits, factsRule)).toEqual({ excused: [...FACTS.mockup], accepted: [...FACTS.build] });
  });

  it("hides for the pixels exactly the blocks its facts change, on both sides (VISUAL_HIDDEN)", () => {
    expect(hiddenProblems(mockupFold("setup", "main"), FACTS)).toEqual([]);
    const rules = VISUAL_HIDDEN.setup.filter((r) => r.approvedBy === FACTS.approvedBy);
    expect(rules.map((r) => [r.side, r.selector])).toEqual(
      (["mockup", "build"] as const).flatMap((side) => FACTS.hidden.both.map((selector) => [side, selector])),
    );
  });

  it("hides step 2 on both sides, one element each", () => {
    expect(VISUAL_HIDDEN.setup.filter((r) => r.approvedBy.startsWith("deviations.md V8")).map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".kh-steps > .kh-step:nth-child(2)"],
      ["build", ".kh-steps > .kh-step:nth-child(2)"],
    ]);
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/setup.html"), "text/html");
    expect(doc.querySelector(".kh-steps > .kh-step:nth-child(2) .kh-step__title")?.textContent).toBe("Press and hold the button on Kheelu’s back.");
  });

  it("excuses through V8 exactly the mockup's step 2 light line: its title is the founder's now (D055 item 25)", () => {
    const light = "Hold it for 3 seconds, until the light starts pulsing blue.";
    expect(readRepoFile("mockup/setup.html")).toContain(light);
    expect(mockupMain("setup").filter((line) => V8.mockup.test(line))).toEqual([light]);
    expect(V8.mockup.test("Press and hold the button on Kheelu’s back.")).toBe(false);
  });
});
