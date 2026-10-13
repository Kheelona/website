import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupPage, mockupRoute } from "../../../../test/support/mockup-compare";
import { confirmation } from "./confirmation";
import { paymentsLine } from "./payments-line";
import { storePage } from "./store-page";

/* The payments line (task 4.8 item 2; store.md fold 7, D042; wiki/qa/deviations.md V1): written once, read by the store
 * page and by /thanks, which print it as the last line of their main because the store layout's policy links are a
 * frozen checkout contract. Both approved mockups print it in their shared store footer, word for word. */

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
/** Visible words of a mockup element, its visually hidden notes left out. */
function seen(el: Element): string {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll(".kh-sr").forEach((n) => n.remove());
  return norm(copy.textContent);
}

describe("the payments line", () => {
  it.each(["store", "store-confirmation"] as const)("D042's words and the chargeback link on /refund, as the %s mockup's footer prints them", (slug) => {
    const line = Array.from(mockupPage(slug).querySelectorAll("footer p")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))!;
    const a = line.querySelector("a")!;
    expect(`${paymentsLine.text} ${paymentsLine.link.label}`).toBe(seen(line));
    expect(paymentsLine.link).toEqual({ label: seen(a), href: mockupRoute(a.getAttribute("href")!) });
  });

  it("is the one value both pages read: no copy", () => {
    expect(storePage.payments).toBe(paymentsLine);
    expect(confirmation.payments).toBe(paymentsLine);
  });

  it("is typed once, in this module", () => {
    for (const file of ["store-page.ts", "confirmation.ts"]) {
      expect(readRepoFile(`src/content/en-IN/store/${file}`), file).not.toMatch(/Payments by Razorpay|chargeback/);
    }
  });
});
