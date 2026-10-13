import { describe, expect, it } from "vitest";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { withFacts } from "../../../../test/support/mockup-facts";
import { toPlainText } from "@/lib/content/plain-text";
import { seller } from "../seller";
import { legalTemplateCopy } from "./shared";

/* The words LegalTemplate prints around every legal document (task 4.5 item 3; privacy.md, terms.md, refund.md and
 * shipping.md: the draft note, the "Last updated" line, "On this page" and the complaint-reference line), held once for
 * the four legal pages (5.11-5.14), each equal to what the four approved pages print with the founder's page facts
 * applied (task 6.7): the complaint-reference line comes off until a system issues a reference (D055 item 7), so the
 * words hold no note and every grievance card is its D032 line alone, one paragraph, never an empty second one. The
 * reference close's help line is seller.help itself, never retyped. */

const PAGES = ["privacy", "terms", "refund", "shipping"] as const;
const text = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the legal template's shared words", () => {
  it.each(PAGES)("are the words %s.html prints around its document, with the founder's page facts applied", (slug) => {
    const main = withFacts(mockupFold(slug, "main"), PAGE_FACTS[slug].edits);
    expect(toPlainText(legalTemplateCopy.draftNote)).toBe(text(main.querySelector(".mk-draft")!));
    expect(text(main.querySelector(".mk-updated")!)).toBe(`${toPlainText(legalTemplateCopy.updated)} 14 October 2026`);
    expect(toPlainText(legalTemplateCopy.contents)).toBe(text(main.querySelector("#toc-title")!));
    const grievance = [...main.querySelectorAll(".kh-card")].find((card) => text(card).startsWith("Grievance Officer:"));
    expect(grievance, `${slug}: the grievance card`).toBeDefined();
    // The D032 line alone: no complaint-reference paragraph, not even an empty one (D055 item 7).
    expect(grievance!.querySelectorAll("p")).toHaveLength(1);
    expect(text(grievance!)).toMatch(/^Grievance Officer: .*of receiving it\.$/);
  });

  it("has no complaint-reference line until a system issues a reference (D055 item 7): no note, no placeholder", () => {
    expect(legalTemplateCopy).not.toHaveProperty("grievanceNote");
    for (const slug of PAGES) {
      const marker = "[PLACEHOLDER: how you get a complaint reference to track your complaint; not set up yet]";
      expect(text(mockupFold(slug, "main")), `${slug}.html still shows the approved marker`).toContain(marker);
    }
  });

  it("carries the help line of every chilli button, seller.help itself, as privacy's and terms' closes print it", () => {
    expect(legalTemplateCopy.help).toBe(seller.help);
    for (const slug of ["privacy", "terms"] as const) {
      expect(`${seller.help.lead} ${toPlainText(seller.help.contact)}`).toBe(text(mockupFold(slug, ".mk-doc-close .mk-help")));
    }
  });

  it("is a content module that needs no layout: it imports content shapes and seller.ts only (structure §6)", () => {
    const imports = [...readRepoFile("src/content/en-IN/legal/shared.ts").matchAll(/\bfrom\s+"([^"]+)"/g)].map((m) => m[1]);
    expect(imports.sort()).toEqual(["../seller", "@/content/types"]);
  });
});
