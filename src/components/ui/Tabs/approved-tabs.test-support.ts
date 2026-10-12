import { mockupFold, mockupPage } from "../../../../test/support/mockup-compare";

/*
 * Test support for task 3.5 (never shipped: nothing in the app imports it). The approved product page turns its
 * stacked DS Tabs panels into tabs with its own inline script (mockup/pages/meet-kheelu.html:397-439; the built copy,
 * mockup/meet-kheelu.html, carries it unchanged). These helpers run that script, as approved, on a document, so a test
 * can compare what the build's island does with what the founder saw, and compare the attributes the tabs pattern
 * sets that the section skeleton (ArticleBody's approved-fold support) does not read. The page is read through the one
 * mockup harness (test/support/mockup-compare.ts; task 4.5 item 8), shared and never changed here: the script's text
 * and the fold's markup are read off it, and the script runs on a document of the caller's own. Tests run from the
 * repository root.
 */

const PAGE = "meet-kheelu";

/** The approved page's tab script: its one inline script that looks for `[data-tabs]`. */
export function approvedTabScript(): string {
  const scripts = [...mockupPage(PAGE).querySelectorAll("script:not([src])")].filter((s) => s.textContent?.includes("[data-tabs]"));
  if (scripts.length !== 1) throw new Error(`mockup/meet-kheelu.html: expected one inline tab script, found ${scripts.length}`);
  return scripts[0].textContent ?? "";
}

/** Runs the approved tab script on `doc` exactly as the page runs it on itself (its `document` is `doc`). */
export function runApprovedTabScript(doc: Document): void {
  // The script is the approved page's own text, read from the repository; it is an IIFE over the global `document`.
  new Function("document", approvedTabScript())(doc);
}

/** The approved fold 7 (section#specs) as the server sends it: before any script ran (the harness throws when the fold
 *  is missing). */
export function approvedDetailsFoldHtml(): string {
  return mockupFold(PAGE, "section#specs").outerHTML;
}

/** The attributes of the tabs pattern beyond classes, roles, labels and ids, which the section skeleton compares. */
const STATES = ["data-tabs", "data-tab-heading", "type", "aria-controls", "aria-selected", "tabindex", "hidden"] as const;

/**
 * One line per element of `el`'s tree that carries any tabs-pattern state (see STATES), in document order: the tag,
 * the element's id when it has one, then each state attribute with its value (`hidden` and the two data hooks by
 * presence). Two trees with the same lines set the same tab states on the same elements.
 */
export function tabStates(el: Element): string {
  return [el, ...el.querySelectorAll("*")]
    .filter((node) => STATES.some((name) => node.hasAttribute(name)))
    .map((node) => {
      const attrs = STATES.filter((name) => node.hasAttribute(name)).map((name) =>
        name === "hidden" || name.startsWith("data-") ? `[${name}]` : `[${name}=${node.getAttribute(name)}]`,
      );
      return `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ""}${attrs.join("")}`;
    })
    .join("\n");
}
