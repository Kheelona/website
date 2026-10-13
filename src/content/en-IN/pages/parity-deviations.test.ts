import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { SETUP_STEP_BUILD, TEAM_LEAD_BUILD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
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

describe("setup parity deviations (V8)", () => {
  it("accepts step 2 as setup.ts renders it, and nothing else of the page", () => {
    for (const line of SETUP_STEP_BUILD) expect(contentSentences(setupPage)).toContain(line);
    expect(accepted("setup", contentSentences(setupPage))).toEqual([...SETUP_STEP_BUILD]);
  });

  it("hides step 2 on both sides, one element each", () => {
    expect(VISUAL_HIDDEN.setup.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".kh-steps > .kh-step:nth-child(2)"],
      ["build", ".kh-steps > .kh-step:nth-child(2)"],
    ]);
    const doc = new DOMParser().parseFromString(readRepoFile("mockup/setup.html"), "text/html");
    expect(doc.querySelector(".kh-steps > .kh-step:nth-child(2) .kh-step__title")?.textContent).toBe("Press and hold the button on Kheelu’s back.");
  });

  it("excuses exactly the mockup's two step 2 lines", () => {
    const step2 = ["Press and hold the button on Kheelu’s back.", "Hold it for 3 seconds, until the light starts pulsing blue."];
    for (const line of step2) {
      expect(readRepoFile("mockup/setup.html")).toContain(line);
      expect(excused("setup", [line])).toEqual([line]);
    }
    /* Read from the file, the step's number joins its title ("2 Press and hold …"); the browser skips it (aria-hidden). */
    expect(excused("setup", mockupMain("setup"))).toEqual(["Hold it for 3 seconds, until the light starts pulsing blue."]);
  });
});
