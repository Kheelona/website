"use client";

import { useLayoutEffect } from "react";
import { enhanceTabs } from "./enhance-tabs";

export interface TabsIslandProps {
  /** The id of one tab of the set (the first): the island finds its `[data-tabs]` box from it. */
  tab: string;
}

/** The element the address's #fragment names, when it comes after `box` in the page; otherwise null. */
function fragmentTargetAfter(box: HTMLElement): HTMLElement | null {
  const id = window.location.hash.slice(1);
  if (!id) return null;
  let target: HTMLElement | null;
  try {
    target = document.getElementById(decodeURIComponent(id));
  } catch {
    return null;
  }
  return target && box.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING ? target : null;
}

/**
 * The Tabs island (task 3.5): renders nothing; after hydration it makes tabs of the stacked panels the server sent,
 * as the approved product page's own script does (`enhance-tabs.ts`, mockup/pages/meet-kheelu.html:397-439), and
 * takes its listeners away when it unmounts. The server HTML and the hydration pass are the stacked state; making tabs
 * hides panels 2 and 3, so everything below the box moves up by their height (464 px on a phone, 394 px on a laptop on
 * the product page). Two things keep a #fragment landing in place (task 7.1a; CMO built-page review A, M1 and M2):
 * - it runs in a layout effect, before any ancestor's: Next scrolls to a #fragment on a route change in its own layout
 *   effect, an ancestor's, so the page it measures already has its tabs (from Home's "See all questions" the product
 *   page landed 464 px past its questions);
 * - when the address names an element below the box (a direct landing at /products/kheelu#faq, which the browser has
 *   already scrolled to on the stacked page), the page scrolls by what that element moved, at once, before the frame
 *   paints, so it stays where the landing put it (the browser's scroll anchoring did this only sometimes).
 * It never focuses on load. The box keeps a static className, so React never overwrites the `is-tabs` the enhancement
 * adds (architecture §11.3 authoring rule). React only, no icon map: an island never imports Icon, Button or
 * PreorderButton (client-icons guard). Import `Tabs` instead.
 */
export function TabsIsland({ tab }: TabsIslandProps) {
  useLayoutEffect(() => {
    const box = document.getElementById(tab)?.closest<HTMLElement>("[data-tabs]");
    if (!box) return undefined;
    const target = fragmentTargetAfter(box);
    const before = target?.getBoundingClientRect().top;
    const undo = enhanceTabs(box);
    if (target && before !== undefined) {
      const moved = target.getBoundingClientRect().top - before;
      if (moved !== 0) window.scrollBy({ top: moved, behavior: "instant" });
    }
    return undo;
  }, [tab]);
  return null;
}
