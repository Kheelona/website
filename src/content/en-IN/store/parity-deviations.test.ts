import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { HOSTS } from "@/config/env";
import { PARITY_ELSEWHERE, TEXT_DEVIATIONS, VISUAL_HIDDEN, hiddenCss, parityElsewhere } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { navigation } from "../navigation";
import { inAppNote } from "./in-app-note";
import { paymentsLine } from "./payments-line";

/* The store's and /thanks's approved parity deviations (task 4.8 item 1; wiki/qa/deviations.md V1, V4): what the visual
 * pass hides on each side, and which sentences the text pass accepts, each read from content and held to exactly the
 * lines it names, so a rule can never excuse a sentence it was not written for. */

const textOf = (el: Element) => sentences(htmlToText(el.outerHTML));
const mockupDoc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const mockupMain = (slug: string) => mockupDoc(slug).querySelector("main")!;

/** The note as the mockup prints it (fold 2, `.mk-inapp`): the alert's lines, its review note left out. */
const noteSentences = () => textOf(mockupMain("store").querySelector(".mk-inapp .kh-alert")!);
/** The payments line's words, and the new-tab note the build's line adds after its link (innerText puts the visually
 *  hidden span on a line of its own: it is absolutely positioned). */
const WORDS = sentences(`${paymentsLine.text} ${paymentsLine.link.label}`);
const NEW_TAB = navigation.labels.newTabNote.trim();

/** The payments line where each side prints it: the mockups' store footer, the build's main. */
const MOCKUP_LINE = 'footer p:has(> a[href$="#chargeback"])';

describe("store parity deviations: the visual pass (V4, V1)", () => {
  it("store: hides the mockup's in-app note (V4) and the payments line on both sides, the mockup's footer line and the build's line in main (V1)", () => {
    expect(VISUAL_HIDDEN.store).toEqual([
      expect.objectContaining({ side: "mockup", selector: ".mk-inapp", approvedBy: expect.stringContaining("V4") }),
      expect.objectContaining({ side: "mockup", selector: MOCKUP_LINE, approvedBy: expect.stringContaining("V1") }),
      expect.objectContaining({ side: "build", selector: ".ks-store-payments", approvedBy: expect.stringContaining("V1") }),
    ]);
  });

  it("/thanks: the payments line on both sides only (V1; the paid-state composition and the route)", () => {
    expect(VISUAL_HIDDEN["store-confirmation"]).toEqual([
      expect.objectContaining({ side: "mockup", selector: MOCKUP_LINE, approvedBy: expect.stringContaining("V1") }),
      expect.objectContaining({ side: "build", selector: ".ks-store-payments", approvedBy: expect.stringContaining("V1") }),
    ]);
  });

  it("names elements that exist, one each: the mockup's note fold, each mockup's footer payments line, the build line's root", () => {
    expect(mockupMain("store").querySelectorAll(".mk-inapp")).toHaveLength(1);
    for (const slug of ["store", "store-confirmation"]) {
      const lines = mockupDoc(slug).querySelectorAll(MOCKUP_LINE);
      expect(lines, slug).toHaveLength(1);
      expect(lines[0].textContent, slug).toBe(`${paymentsLine.text} ${paymentsLine.link.label}${navigation.labels.newTabNote}`);
    }
    const { container } = render(createElement(StorePaymentsLine, { content: paymentsLine, newTabNote: navigation.labels.newTabNote }));
    expect(container.firstElementChild!.matches(".ks-store-payments")).toBe(true);
  });

  it("each side's style hides that side's selectors only, and nothing on a page without a rule", () => {
    expect(hiddenCss("store", "mockup")).toBe(`.mk-inapp, ${MOCKUP_LINE} { display: none !important; }`);
    expect(hiddenCss("store", "build")).toBe(".ks-store-payments { display: none !important; }");
    expect(hiddenCss("store-confirmation", "mockup")).toBe(`${MOCKUP_LINE} { display: none !important; }`);
    expect(hiddenCss("store-confirmation", "build")).toBe(".ks-store-payments { display: none !important; }");
    expect(hiddenCss("ai-toys-for-kids-in-india", "build")).toBe("");
  });

  it("every rule gives its reason", () => {
    for (const rule of Object.values(VISUAL_HIDDEN).flat()) expect(rule.reason.length, rule.selector).toBeGreaterThan(20);
  });
});

describe("store parity deviations: the text pass (V4, V1)", () => {
  const [note, payments] = TEXT_DEVIATIONS.store ?? [];

  it("two rules: the in-app note's lines missing (V4), the payments line moved (V1)", () => {
    expect(TEXT_DEVIATIONS.store).toHaveLength(2);
    expect(note.approvedBy).toContain("V4");
    expect(note.build).toBeUndefined();
    expect(payments.approvedBy).toContain("V1");
    expect(note.jsOff).toBeUndefined();
    expect(payments.jsOff).toBeUndefined();
  });

  it("the note's rule accepts exactly the note's lines as the mockup prints them, and no other line of the page", () => {
    const page = textOf(mockupMain("store"));
    expect(page.filter((s) => note.mockup.test(s))).toEqual(noteSentences());
    expect(noteSentences()).toEqual([
      "Paying by UPI?",
      "Open this page in Chrome or Safari.",
      "Do it first, so you don’t type your details twice.",
      `Copy the link and paste it into Chrome or Safari: ${HOSTS.production.store}`,
      "Copy link",
    ]);
  });

  it("reads the note's lines from in-app-note.ts, so it follows the content", () => {
    for (const s of [...sentences(inAppNote.title), ...sentences(inAppNote.body), inAppNote.copyLabel].filter((line) => !line.endsWith(":"))) {
      expect(note.mockup.test(s), s).toBe(true);
    }
  });

  it("the payments rule: the line's words on both sides, and the new-tab note only as the build's extra line", () => {
    expect(WORDS).toEqual(["No payment fees.", "Nothing recurring.", "Payments by Razorpay.", "How to raise a chargeback with your bank"]);
    for (const s of WORDS) {
      expect(payments.mockup.test(s), s).toBe(true);
      expect(payments.build!.test(s), s).toBe(true);
    }
    expect(payments.build!.test(NEW_TAB)).toBe(true);
    /* The store's trust links carry the same note in the mockup's main: the rule must never excuse one going missing. */
    expect(payments.mockup.test(NEW_TAB)).toBe(false);
    expect(payments.build!.test("No payment fees, ever.")).toBe(false);
  });

  it("the payments rule matches nothing in either mockup's main: the line is in their footer", () => {
    for (const slug of ["store", "store-confirmation"]) expect(textOf(mockupMain(slug)).filter((s) => payments.mockup.test(s)), slug).toEqual([]);
  });

  it("/thanks: the same payments rule, nothing else", () => {
    expect(TEXT_DEVIATIONS["store-confirmation"]).toEqual([payments]);
  });
});

describe("store parity deviations: a route proved elsewhere (V5)", () => {
  it("only /thanks skips its route parity runs, and the spec that proves its paid state exists and compares that mockup", () => {
    expect(Object.keys(PARITY_ELSEWHERE)).toEqual(["store-confirmation"]);
    const rule = PARITY_ELSEWHERE["store-confirmation"];
    const spec = /^(test\/e2e\/[\w-]+\.spec\.ts) /.exec(rule.provedBy)?.[1];
    expect(spec).toBe("test/e2e/thanks-paid.spec.ts");
    expect(readRepoFile(spec!)).toMatch(/const SLUG = "store-confirmation";/);
    expect(rule.approvedBy).toMatch(/V5/);
    expect(parityElsewhere("store-confirmation", "text-parity")).toMatch(/^text-parity: store-confirmation is proved by test\/e2e\/thanks-paid\.spec\.ts/);
    expect(parityElsewhere("store", "text-parity")).toBeUndefined();
  });
});
