import { describe, expect, it } from "vitest";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { toPlainText } from "@/lib/content/plain-text";
import { seller } from "../seller";
import { legalTemplateCopy } from "./shared";

/* The words LegalTemplate prints around every legal document (task 4.5 item 3; privacy.md, terms.md, refund.md and
 * shipping.md: the draft note, the "Last updated" line, "On this page" and the complaint-reference line), held once for
 * the four legal pages (5.11-5.14), each equal to what the four approved pages print. The reference close's help line is
 * seller.help itself, never retyped. */

const PAGES = ["privacy", "terms", "refund", "shipping"] as const;
const text = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the legal template's shared words", () => {
  it.each(PAGES)("are the words %s.html prints around its document", (slug) => {
    expect(toPlainText(legalTemplateCopy.draftNote)).toBe(text(mockupFold(slug, ".mk-draft")));
    expect(text(mockupFold(slug, ".mk-updated")).startsWith(`${toPlainText(legalTemplateCopy.updated)} `)).toBe(true);
    expect(toPlainText(legalTemplateCopy.contents)).toBe(text(mockupFold(slug, "#toc-title")));
    const grievance = [...mockupFold(slug, "main").querySelectorAll(".kh-card")].find((card) => text(card).startsWith("Grievance Officer:"));
    expect(grievance, `${slug}: the grievance card`).toBeDefined();
    expect(text(grievance!.querySelectorAll("p")[1])).toBe(toPlainText(legalTemplateCopy.grievanceNote));
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
