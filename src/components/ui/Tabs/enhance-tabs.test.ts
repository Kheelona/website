import { afterEach, describe, expect, it } from "vitest";
import { approvedDetailsFoldHtml, runApprovedTabScript } from "./approved-tabs.test-support";
import { enhanceTabs } from "./enhance-tabs";

/* The island's DOM half (task 3.5) against the approved page's own tab script (mockup/pages/meet-kheelu.html:397-439),
   both run on the approved fold's markup: every step leaves the same DOM, the same focus and the same handled keys. */

afterEach(() => {
  document.body.innerHTML = "";
});

type Step = { step: string; html: string; focus: string | null; prevented: boolean | null };

const box = () => document.querySelector<HTMLElement>("[data-tabs]")!;
const tab = (id: string) => document.getElementById(id)!;

/** Presses a key on an element; true when a handler took it (default prevented). */
function press(el: HTMLElement, key: string): boolean {
  return !el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

/** The approved fold in the page, `enhance` run on it, then one walk through the tabs by mouse and keyboard. */
function walk(enhance: () => void): Step[] {
  document.body.innerHTML = approvedDetailsFoldHtml();
  enhance();
  const steps: Step[] = [];
  const record = (step: string, prevented: boolean | null = null) =>
    steps.push({ step, html: box().outerHTML, focus: document.activeElement?.id || null, prevented });
  record("load");
  tab("tab-box").click();
  record("click In the box");
  record("ArrowRight on In the box", press(tab("tab-box"), "ArrowRight"));
  record("ArrowRight on Safety (wraps)", press(tab("tab-safety"), "ArrowRight"));
  record("ArrowLeft on Specs (wraps)", press(tab("tab-specs"), "ArrowLeft"));
  record("Home on Safety", press(tab("tab-safety"), "Home"));
  record("End on Specs", press(tab("tab-specs"), "End"));
  record("ArrowLeft on Safety", press(tab("tab-safety"), "ArrowLeft"));
  record("ArrowDown on In the box (not handled)", press(tab("tab-box"), "ArrowDown"));
  record("Enter on In the box (not handled)", press(tab("tab-box"), "Enter"));
  tab("tab-specs").click();
  record("click Specs");
  return steps;
}

describe("enhanceTabs: what the approved page script does", () => {
  it("leaves the same DOM, focus and handled keys as the approved script at every step", () => {
    const approved = walk(() => runApprovedTabScript(document));
    const built = walk(() => enhanceTabs(box()));
    expect(built).toEqual(approved);
  });

  it("makes tabs of the stacked panels on load: is-tabs, the list shown, the panels named by their tabs, the first selected", () => {
    document.body.innerHTML = approvedDetailsFoldHtml();
    enhanceTabs(box());
    expect(box().classList.contains("is-tabs")).toBe(true);
    expect(box().querySelector(".kh-tabs__list")!.hasAttribute("hidden")).toBe(false);
    const panels = [...box().querySelectorAll(".kh-tabs__panel")];
    expect(panels.map((p) => [p.getAttribute("role"), p.getAttribute("aria-labelledby"), p.getAttribute("tabindex"), p.hasAttribute("hidden")])).toEqual([
      ["tabpanel", "tab-specs", "0", false],
      ["tabpanel", "tab-box", "0", true],
      ["tabpanel", "tab-safety", "0", true],
    ]);
    expect(panels.map((p) => p.querySelector("[data-tab-heading]")!.classList.contains("kh-sr"))).toEqual([true, true, true]);
    const tabs = [...box().querySelectorAll('[role="tab"]')];
    expect(tabs.map((t) => [t.getAttribute("aria-selected"), t.getAttribute("tabindex")])).toEqual([
      ["true", "0"],
      ["false", "-1"],
      ["false", "-1"],
    ]);
    expect(document.activeElement).toBe(document.body);
  });

  it("selects and focuses with the arrow keys (wrapping), Home and End; only the selected tab stays in the Tab order", () => {
    document.body.innerHTML = approvedDetailsFoldHtml();
    enhanceTabs(box());
    const selected = () => [...box().querySelectorAll('[role="tab"][aria-selected="true"]')].map((t) => t.id);
    const inTabOrder = () => [...box().querySelectorAll('[role="tab"]')].filter((t) => t.getAttribute("tabindex") === "0").map((t) => t.id);
    expect(press(tab("tab-specs"), "ArrowLeft")).toBe(true);
    expect([selected(), inTabOrder(), document.activeElement!.id]).toEqual([["tab-safety"], ["tab-safety"], "tab-safety"]);
    expect(press(tab("tab-safety"), "ArrowRight")).toBe(true);
    expect([selected(), document.activeElement!.id]).toEqual([["tab-specs"], "tab-specs"]);
    expect(press(tab("tab-specs"), "End")).toBe(true);
    expect([selected(), document.activeElement!.id]).toEqual([["tab-safety"], "tab-safety"]);
    expect(press(tab("tab-safety"), "Home")).toBe(true);
    expect([selected(), inTabOrder(), document.activeElement!.id]).toEqual([["tab-specs"], ["tab-specs"], "tab-specs"]);
    expect(document.getElementById("panel-specs")!.hidden).toBe(false);
    expect(document.getElementById("panel-safety")!.hidden).toBe(true);
  });

  it("selects on a click without moving focus itself, as the page script (the browser focuses a clicked button)", () => {
    document.body.innerHTML = approvedDetailsFoldHtml();
    enhanceTabs(box());
    tab("tab-safety").click();
    expect(tab("tab-safety").getAttribute("aria-selected")).toBe("true");
    expect(document.getElementById("panel-safety")!.hidden).toBe(false);
    expect(document.activeElement).toBe(document.body);
  });

  it("returns an undo for its listeners: after it, a click or a key changes nothing", () => {
    document.body.innerHTML = approvedDetailsFoldHtml();
    const undo = enhanceTabs(box());
    undo();
    const before = box().outerHTML;
    tab("tab-box").click();
    expect(press(tab("tab-specs"), "ArrowRight")).toBe(false);
    expect(box().outerHTML).toBe(before);
  });

  it("can run again after its undo (React runs effects twice in development): the same DOM as one run, one step per key", () => {
    document.body.innerHTML = approvedDetailsFoldHtml();
    enhanceTabs(box());
    const once = box().outerHTML;
    document.body.innerHTML = approvedDetailsFoldHtml();
    enhanceTabs(box())();
    enhanceTabs(box());
    expect(box().outerHTML).toBe(once);
    press(tab("tab-specs"), "ArrowRight");
    expect(tab("tab-box").getAttribute("aria-selected")).toBe("true");
  });

  it("leaves markup without a tab list, or with a tab whose panel is missing, stacked", () => {
    document.body.innerHTML = '<div class="kh-tabs" data-tabs><div class="kh-tabs__panel" id="p1"><h3 data-tab-heading>One</h3></div></div>';
    const lone = box().outerHTML;
    expect(() => enhanceTabs(box())()).not.toThrow();
    expect(box().outerHTML).toBe(lone);

    document.body.innerHTML = approvedDetailsFoldHtml();
    document.getElementById("panel-box")!.remove();
    const broken = box().outerHTML;
    enhanceTabs(box());
    expect(box().outerHTML).toBe(broken);
    tab("tab-safety").click();
    expect(box().outerHTML).toBe(broken);
  });
});
