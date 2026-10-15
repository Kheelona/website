import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { teamPage } from "./pages/team";
import { recognitionStrip } from "./recognition";

/* The "Recognised by." strip on Home and the product page (task 8c.3; D061's rulings; D054 item 20): the /team strip as
 * built, its programmes, marks and heading read from the team page's own fold (team.ts, task 6.6), never retyped. */

describe("the recognition strip's placement config", () => {
  it("is the team page's strip, the very config", () => {
    const fold = teamPage.sections.find((s) => s.kind === "recognition-strip");
    expect(fold?.kind).toBe("recognition-strip");
    expect(recognitionStrip).toBe(fold!.config);
  });

  it("is the live strip: the three marks and Founders Inc as text, under \"Recognised by.\"", () => {
    expect(recognitionStrip.title).toBe("Recognised by.");
    expect(recognitionStrip.items.map((i) => [i.name, i.mark?.src ?? null])).toEqual([
      ["NVIDIA Inception Program", "/recognition/nvidia-inception.png"],
      ["Karnataka Elevate", "/recognition/karnataka-seal.png"],
      ["nasscom startups", "/recognition/nasscom.png"],
      ["Founders Inc", null],
    ]);
  });

  it("names no programme itself: the names live once, in team.ts", () => {
    const source = readRepoFile("src/content/en-IN/recognition.ts");
    for (const { name } of recognitionStrip.items) expect(source).not.toContain(name);
  });
});
