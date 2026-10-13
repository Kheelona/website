import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { PRIVACY_B11_BUILD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { privacyPage } from "./privacy";

/* The privacy page's approved parity deviation (wiki/qa/deviations.md V10; the founder's words, D054 item 10): the build's
 * words the rule accepts are privacy.ts's own, and the rule excuses only the mockup line it names. */

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
const contentSentences = stringsOf(privacyPage).flatMap((s) => sentences(toPlainText(s, TOKEN)));
const MOCKUP = new DOMParser().parseFromString(readRepoFile("mockup/privacy.html"), "text/html");
const mockupSentences = sentences(htmlToText(MOCKUP.querySelector("main")!.outerHTML));
const rules = TEXT_DEVIATIONS.privacy ?? [];

describe("privacy parity deviations (V10)", () => {
  it("accepts the two B11 sentences privacy.ts renders, and only them", () => {
    for (const line of PRIVACY_B11_BUILD) expect(contentSentences).toContain(line);
    expect(contentSentences.filter((l) => rules.some((r) => r.build?.test(l)))).toEqual([...PRIVACY_B11_BUILD]);
  });

  it("excuses exactly the mockup's Google Analytics sentence", () => {
    expect(mockupSentences.filter((l) => rules.some((r) => r.mockup.test(l)))).toEqual([
      "Counts visits and the steps of a pre-order: starting the form, opening and closing the payment window, paying, and saving your address.",
    ]);
  });

  it("hides the Google Analytics and the PostHog paragraphs on both sides, and those are the tools they name", () => {
    expect(VISUAL_HIDDEN.privacy.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".mk-tools > .mk-tool:nth-child(3) > p"],
      ["mockup", ".mk-tools > .mk-tool:nth-child(6) > p:first-of-type"],
      ["build", ".ks-tools > .ks-tool:nth-child(3) > p"],
      ["build", ".ks-tools > .ks-tool:nth-child(6) > p:first-of-type"],
    ]);
    const heading = (selector: string) => MOCKUP.querySelector(selector)?.closest(".mk-tool")?.querySelector("h3")?.textContent;
    expect(MOCKUP.querySelectorAll(".mk-tools > .mk-tool:nth-child(3) > p")).toHaveLength(1);
    expect(heading(".mk-tools > .mk-tool:nth-child(3) > p")).toBe("Google Analytics");
    expect(heading(".mk-tools > .mk-tool:nth-child(6) > p:first-of-type")).toBe("PostHog");
    // The build's tools in privacy.ts's order (the route's own test proves the markup equal to the mockup's).
    const toolsBlock = (value: unknown): { tools: { name: string }[] } | undefined => {
      if (!value || typeof value !== "object") return undefined;
      if ((value as { kind?: unknown }).kind === "tools") return value as { tools: { name: string }[] };
      for (const child of Object.values(value)) {
        const found = toolsBlock(child);
        if (found) return found;
      }
      return undefined;
    };
    const names = toolsBlock(privacyPage)!.tools.map((t) => t.name);
    expect([names[2], names[5]]).toEqual(["Google Analytics", "PostHog"]);
  });
});
