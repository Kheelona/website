"use client";

import { useEffect } from "react";
import { enhanceTabs } from "./enhance-tabs";

export interface TabsIslandProps {
  /** The id of one tab of the set (the first): the island finds its `[data-tabs]` box from it. */
  tab: string;
}

/**
 * The Tabs island (task 3.5): renders nothing; after hydration it makes tabs of the stacked panels the server sent,
 * as the approved product page's own script does (`enhance-tabs.ts`, mockup/pages/meet-kheelu.html:397-439), and
 * takes its listeners away when it unmounts. It runs in an effect, so the server HTML and the hydration pass are the
 * stacked state, and it never focuses on load (the page does not scroll). The box keeps a static className, so React
 * never overwrites the `is-tabs` the enhancement adds (architecture §11.3 authoring rule). React only, no icon map:
 * an island never imports Icon, Button or PreorderButton (client-icons guard). Import `Tabs` instead.
 */
export function TabsIsland({ tab }: TabsIslandProps) {
  useEffect(() => {
    const box = document.getElementById(tab)?.closest<HTMLElement>("[data-tabs]");
    return box ? enhanceTabs(box) : undefined;
  }, [tab]);
  return null;
}
