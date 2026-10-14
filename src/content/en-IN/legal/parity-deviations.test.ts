import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLAIM_FIXES, PRIVACY_B11_BUILD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach } from "../../../../test/support/mockup-facts";
import { privacyPage } from "./privacy";

/* The legal pages' approved parity deviations. Privacy's V10 (the founder's words, D054 item 10): the build's words the
 * rule accepts are privacy.ts's own, and the rule excuses only the mockup line it names. The founder's page facts on all
 * four pages (task 6.7; D055, D054 item 12; test/e2e/support/page-facts.ts): each page's rule excuses and accepts exactly
 * the sentences its facts change, and those are exactly the ones the edits make to the frozen mockup. The route tests
 * hold each page's build to that edited mockup, markup and words alike. */

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
const rules = (TEXT_DEVIATIONS.privacy ?? []).filter((rule) => rule.approvedBy.startsWith("deviations.md V10"));

describe("privacy parity deviations (V10)", () => {
  it("is one rule, beside the page facts' (task 6.7) and D058's claim fixes (task 8b.1, proven with the other pages')", () => {
    expect(rules).toHaveLength(1);
    expect(TEXT_DEVIATIONS.privacy.map((rule) => rule.approvedBy)).toEqual([
      rules[0].approvedBy,
      PAGE_FACTS.privacy.approvedBy,
      CLAIM_FIXES.privacy.approvedBy,
    ]);
  });

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
    expect(VISUAL_HIDDEN.privacy.filter((r) => r.approvedBy.startsWith("deviations.md V10")).map((r) => [r.side, r.selector])).toEqual([
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

describe.each(["privacy", "refund", "shipping", "terms"] as const)("%s: the founder's page facts as a parity deviation (task 6.7)", (slug) => {
  const facts = PAGE_FACTS[slug];
  const main = mockupFold(slug, "main");
  const once = (lines: readonly string[]) => [...new Set(lines)];

  it("lists exactly the sentences the facts change (page-facts.ts against the frozen mockup)", () => {
    expect(factSentences(main, facts.edits)).toEqual({ missing: [...facts.mockup], extra: [...facts.build] });
  });

  it("is one rule of the page, which excuses and accepts exactly those sentences and no other line", () => {
    const rule = TEXT_DEVIATIONS[slug].filter((r) => r.approvedBy === facts.approvedBy);
    expect(rule).toHaveLength(1);
    expect(ruleReach(main, facts.edits, rule[0])).toEqual({ excused: once(facts.mockup), accepted: once(facts.build) });
  });

  it("hides for the pixels exactly the blocks its facts change, each found once on its side (VISUAL_HIDDEN)", () => {
    expect(hiddenProblems(main, facts)).toEqual([]);
    const rules = VISUAL_HIDDEN[slug].filter((r) => r.approvedBy === facts.approvedBy);
    const sel = (side: string) => rules.filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...facts.hidden.both, ...facts.hidden.mockup]);
    expect(sel("build")).toEqual([...facts.hidden.both, ...facts.hidden.build]);
  });

  it("leaves no placeholder on the page: every one the mockup shows is filled or ruled off", () => {
    expect(facts.mockup.filter((line) => line.includes("[PLACEHOLDER")).length).toBeGreaterThan(0);
    expect(facts.build.filter((line) => line.includes("PLACEHOLDER"))).toEqual([]);
  });
});
