/**
 * The approved product page's tab script (mockup/pages/meet-kheelu.html:397-439, the Gate A commit `42a65b3`), ported
 * step for step for the Tabs island (task 3.5): on DS Tabs markup served stacked (`div.kh-tabs[data-tabs]`, the
 * `kh-tabs__list` tablist hidden, each `kh-tabs__panel` under its `[data-tab-heading]` heading) it makes line tabs on
 * the ARIA tabs pattern:
 *   - each panel takes `role="tabpanel"`, `aria-labelledby` its tab and `tabindex="0"`; its heading takes `kh-sr`
 *     (the tab names the panel now);
 *   - the tablist is shown and the box takes `is-tabs`; the first tab is selected;
 *   - a click selects its tab; ArrowLeft and ArrowRight (wrapping), Home and End select and focus a tab;
 *   - only the selected tab is in the Tab order (`tabindex` 0, the others -1); the other panels are `hidden`.
 * Unlike the page script it returns an undo for its listeners (React runs an effect's cleanup on unmount, and twice in
 * development), and it leaves markup it cannot pair (a tab whose panel is missing) stacked instead of throwing.
 * Panels are looked up by id in the box's document, as the page script does. A plain DOM function, no React: the
 * enhancement is tested against the approved script itself (`enhance-tabs.test.ts`).
 */
export function enhanceTabs(box: HTMLElement): () => void {
  const list = box.querySelector<HTMLElement>('[role="tablist"]');
  if (!list) return () => {};
  const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
  const found = tabs.map((t) => box.ownerDocument.getElementById(t.getAttribute("aria-controls") ?? ""));
  if (found.some((p) => p === null)) return () => {};
  const panels = found as HTMLElement[];

  const select = (i: number, focus?: boolean) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
  };

  const undo = tabs.map((t, i) => {
    const click = () => select(i);
    const keydown = (e: KeyboardEvent) => {
      const n = tabs.length;
      const k = e.key;
      const j = k === "ArrowRight" ? (i + 1) % n : k === "ArrowLeft" ? (i - 1 + n) % n : k === "Home" ? 0 : k === "End" ? n - 1 : -1;
      if (j >= 0) {
        e.preventDefault();
        select(j, true);
      }
    };
    t.addEventListener("click", click);
    t.addEventListener("keydown", keydown);
    return () => {
      t.removeEventListener("click", click);
      t.removeEventListener("keydown", keydown);
    };
  });

  panels.forEach((p, j) => {
    p.setAttribute("role", "tabpanel");
    p.setAttribute("aria-labelledby", tabs[j].id);
    p.tabIndex = 0;
    p.querySelector("[data-tab-heading]")?.classList.add("kh-sr");
  });
  list.hidden = false;
  box.classList.add("is-tabs");
  select(0);

  return () => undo.forEach((off) => off());
}
