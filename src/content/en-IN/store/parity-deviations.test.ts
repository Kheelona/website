import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { navigation } from "../navigation";
import { inAppNote } from "./in-app-note";
import { paymentsLine } from "./payments-line";

/* The store's and /thanks's approved parity deviations (task 4.8 item 1; wiki/qa/deviations.md V1, V4): what the visual
 * pass hides on each side, and which sentences the text pass accepts, each read from content and held to exactly the
 * lines it names, so a rule can never excuse a sentence it was not written for. */

const mockupMain = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelector("main")!;
const textOf = (el: Element) => sentences(htmlToText(el.outerHTML));

/** The note as the mockup prints it (fold 2, `.mk-inapp`): the alert's lines, its review note left out. */
function noteSentences(): string[] {
  const alert = mockupMain("store").querySelector(".mk-inapp .kh-alert")!;
  return textOf(alert);
}
/** The payments line as the build prints it: its words, then the new-tab note, which the browser's innerText puts on
 *  a line of its own (the visually hidden span is absolutely positioned). */
const PAYMENTS = [...sentences(`${paymentsLine.text} ${paymentsLine.link.label}`), navigation.labels.newTabNote.trim()];

describe("store parity deviations: the visual pass (V4, V1)", () => {
  it("hides the mockup's in-app note and the build's payments line, each citing its row", () => {
    expect(VISUAL_HIDDEN.store).toEqual([
      expect.objectContaining({ side: "mockup", selector: ".mk-inapp", approvedBy: expect.stringContaining("V4") }),
      expect.objectContaining({ side: "build", selector: ".ks-store-payments", approvedBy: expect.stringContaining("V1") }),
    ]);
  });

  it("names elements that exist: the mockup's note fold and the payments line's root", () => {
    expect(mockupMain("store").querySelectorAll(".mk-inapp")).toHaveLength(1);
    const { container } = render(createElement(StorePaymentsLine, { content: paymentsLine, newTabNote: navigation.labels.newTabNote }));
    expect(container.firstElementChild!.matches(".ks-store-payments")).toBe(true);
  });

  it("/thanks hides the build's payments line only (V1; the paid-state composition and the route)", () => {
    expect(VISUAL_HIDDEN["store-confirmation"]).toEqual([
      expect.objectContaining({ side: "build", selector: ".ks-store-payments", approvedBy: expect.stringContaining("V1") }),
    ]);
  });
});

describe("store parity deviations: the text pass (V4, V1)", () => {
  const [note, payments] = TEXT_DEVIATIONS.store ?? [];

  it("two rules: the in-app note's lines missing (V4), the payments line moved (V1)", () => {
    expect(TEXT_DEVIATIONS.store).toHaveLength(2);
    expect(note.approvedBy).toContain("V4");
    expect(note.build).toBeUndefined();
    expect(payments.approvedBy).toContain("V1");
  });

  it("the note's rule accepts exactly the note's lines as the mockup prints them, and no other line of the page", () => {
    const page = textOf(mockupMain("store"));
    expect(page.filter((s) => note.mockup.test(s))).toEqual(noteSentences());
    expect(noteSentences()).toEqual(["Paying by UPI?", "Open this page in Chrome or Safari.", "Do it first, so you don’t type your details twice.", "Copy the link and paste it into Chrome or Safari: store.kheelona.com", "Copy link"]);
  });

  it("reads the note's lines from in-app-note.ts, so it follows the content", () => {
    for (const s of [...sentences(inAppNote.title), inAppNote.copyLabel]) expect(note.mockup.test(s), s).toBe(true);
  });

  it("the payments rule accepts exactly the payments line's sentences, as the build prints them", () => {
    expect(PAYMENTS.every((s) => payments.build!.test(s))).toBe(true);
    expect(PAYMENTS.every((s) => payments.mockup.test(s))).toBe(true);
    /* The mockup's main does not hold the line (it is in the footer), so on the mockup side the rule matches nothing but
       the new-tab note, which the store's trust links also carry. */
    expect(textOf(mockupMain("store")).filter((s) => payments.mockup.test(s) && s !== PAYMENTS.at(-1))).toEqual([]);
    expect(payments.build!.test("No payment fees, ever.")).toBe(false);
  });

  it("/thanks: the same payments rule, nothing else", () => {
    expect(TEXT_DEVIATIONS["store-confirmation"]).toEqual([payments]);
  });
});
