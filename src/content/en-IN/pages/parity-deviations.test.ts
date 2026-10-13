import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { FoundersSection } from "@/components/sections/FoundersSection/FoundersSection";
import { RecognitionStrip } from "@/components/sections/RecognitionStrip/RecognitionStrip";
import type { SectionEntryOf, SectionKind } from "@/layouts/sections-registry";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import {
  SETUP_STEP_BUILD,
  TEAM_BIOS_BUILD,
  TEAM_LEAD_BUILD,
  TEAM_STRIP_BUILD,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { setupPage } from "./setup";
import { teamPage } from "./team";

/* The team and setup pages' approved parity deviations (wiki/qa/deviations.md V7, V8; ruled at M1; V7 narrowed by task
 * 6.6, D054 item 20): the build's words the rules accept are the content modules' own, each rule excuses only the
 * mockup lines it names, and each hidden selector finds the element it names on its side. */

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

/** One fold of the team page, by kind. */
function teamFold<K extends SectionKind>(kind: K): SectionEntryOf<K> {
  const found = teamPage.sections.find((e) => e.kind === kind) as SectionEntryOf<K> | undefined;
  if (!found) throw new Error(`the team page lists no ${kind}`);
  return found;
}
const teamMockup = () => new DOMParser().parseFromString(readRepoFile("mockup/team.html"), "text/html");

describe("team parity deviations (V7)", () => {
  /* What the build says that the mockup does not: the CMO's lead (M-T1), and the placeholders the founder's answers of
     2026-10-14 resolved (D054 item 20): the three background lines and the strip's two visible names. */
  it("accepts the hero lead, the founders' background lines and the strip's names team.ts renders, and only them", () => {
    const content = contentSentences(teamPage);
    for (const line of [TEAM_LEAD_BUILD, ...TEAM_BIOS_BUILD, ...TEAM_STRIP_BUILD]) expect(content, line).toContain(line);
    expect(accepted("team", content)).toEqual([TEAM_LEAD_BUILD, ...TEAM_BIOS_BUILD, ...TEAM_STRIP_BUILD]);
  });

  it("holds the build's words to the content: every background sentence and every programme shown as text", () => {
    const founders = teamFold("founders-section").config.founders;
    expect(founders.flatMap((f) => sentences(toPlainText(f.bio!.text, TOKEN)))).toEqual([...TEAM_BIOS_BUILD]);
    const strip = teamFold("recognition-strip").config.items;
    expect(strip.filter((i) => !i.mark || i.mark.alt === "").map((i) => i.name)).toEqual([...TEAM_STRIP_BUILD]);
  });

  /* Read from the file, every initials badge is a line of its own, the quote's (fold 4) too: this helper matches lines
     and does not count them, and the text pass excuses a line only as often as the build lacks it (the build keeps the
     quote's "AS"). */
  it("excuses exactly the mockup's old lead, its eight placeholder lines (B24 photos, F11 backgrounds and programmes) and the initials", () => {
    expect(excused("team", mockupMain("team"))).toEqual([
      "Kheelu is designed by parents in Bengaluru.",
      "AS",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Apoorva’s background, shown once its proof is filed (live bio: Chartered Accountant; fifteen years in finance and company-building; the first student at his family’s pre-school, in 1994)]",
      "AS",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Aman’s background, shown once its proof is filed (live bio: 14 patents filed in his own name; studied AI; machine learning in production)]",
      "KC",
      "[PLACEHOLDER B24: founder photo]",
      "[PLACEHOLDER F11: Kashyap’s background, shown once its proof is filed (live bio: years at Intel leading Thunderbolt 4 and 5 compliance; over a decade in hardware)]",
      "AS",
      "[PLACEHOLDER F11: programme names as plain text, each shown once its proof (acceptance email or listing URL) is filed in wiki/raw/: NVIDIA Inception, Karnataka Elevate, nasscom startups, Founders Inc]",
    ]);
  });

  /* A browser reads each founder's initials badge as a line of its own (a flex item); the build's badges hold photos.
     The quote's "AS" (fold 4) is on both sides, so only the founders' three go missing; team.test.ts holds the quote's. */
  it("excuses the founders' initials, as a browser reads them, and no longer the “Recognised by.” heading", () => {
    expect(excused("team", ["AS", "KC", "Recognised by.", "AS Apoorva Sahu", "Aman Soni"])).toEqual(["AS", "KC"]);
    const initials = Array.from(teamMockup().querySelectorAll(".mk-founder__head .kh-avatar")).map((a) => a.textContent);
    expect(initials).toEqual(["AS", "AS", "KC"]);
  });

  it("hides the hero lead, the founders' badges, the photo placeholder lines, the background lines and fold 5's line", () => {
    expect(VISUAL_HIDDEN.team.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", "#hero-title ~ .kh-heading__lead"],
      ["build", "#hero-title ~ .kh-heading__lead"],
      ["mockup", ".mk-founder__head .kh-avatar"],
      ["build", ".ks-founder__head .kh-avatar"],
      ["mockup", ".mk-founder__photo"],
      ["mockup", ".mk-founder__bg"],
      ["build", ".ks-founder__bg"],
      ["mockup", "#recognised-title ~ .kh-body"],
      ["build", "#recognised-title ~ .ks-recognition"],
    ]);
  });

  it("finds on each side exactly the elements it hides", () => {
    const counts = { "#hero-title ~ .kh-heading__lead": 1, ".mk-founder__head .kh-avatar": 3, ".mk-founder__photo": 3, ".mk-founder__bg": 3, "#recognised-title ~ .kh-body": 1 };
    const mockup = teamMockup();
    for (const rule of VISUAL_HIDDEN.team.filter((r) => r.side === "mockup")) {
      expect(mockup.querySelectorAll(rule.selector).length, rule.selector).toBe(counts[rule.selector as keyof typeof counts]);
    }
    /* The build's folds as the page renders them, from team.ts. */
    const founders = render(createElement(FoundersSection, teamFold("founders-section").config)).container;
    const strip = render(createElement(RecognitionStrip, teamFold("recognition-strip").config)).container;
    const build = { ".ks-founder__head .kh-avatar": [founders, 3], ".ks-founder__bg": [founders, 3], "#recognised-title ~ .ks-recognition": [strip, 1] } as const;
    for (const rule of VISUAL_HIDDEN.team.filter((r) => r.side === "build" && r.selector !== "#hero-title ~ .kh-heading__lead")) {
      const [root, n] = build[rule.selector as keyof typeof build];
      expect(root.querySelectorAll(rule.selector).length, rule.selector).toBe(n);
    }
    expect(mockup.querySelector("#hero-title ~ .kh-heading__lead")?.textContent).toMatch(/^Kheelu is designed by parents in Bengaluru\./);
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
