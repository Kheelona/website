import { clsx } from "clsx";
import { Fragment, type ReactNode } from "react";
import { TabsIsland } from "./Tabs.client";

export interface TabsPanel {
  /** The panel's id (`panel-specs`): its tab's `aria-controls`. */
  id: string;
  /** The tab's id (`tab-specs`): names the panel once the island has made tabs. */
  tabId: string;
  /** The tab's words. */
  label: string;
  /** The panel's heading: shown while the panels are stacked (no JavaScript), visually hidden once they are tabs. */
  heading: ReactNode;
  /** The panel's content, after its heading. */
  content: ReactNode;
}

export interface TabsProps {
  /** The tab row's accessible name ("Product details"), from content. */
  label: string;
  /** The panels in order; the first is selected. */
  panels: readonly [TabsPanel, ...TabsPanel[]];
  /** The section's own class for every panel heading (`ks-panel-title`), after `kh-subtitle`. */
  headingClassName?: string;
}

/**
 * DS Tabs (line tabs, ARIA tabs pattern; task 3.5), as the approved product page serves them
 * (mockup/pages/meet-kheelu.html:277-330): `div.kh-tabs[data-tabs]`, then the `kh-tabs__list` tablist with one
 * `button.kh-tab` per panel (ids, `aria-controls`, `aria-selected`, and `tabindex="-1"` on all but the first, as the
 * mockup), hidden in the HTML, then each `kh-tabs__panel` with its `h3.kh-subtitle[data-tab-heading]` heading and
 * content. Server component. Without JavaScript the panels show stacked under their headings and the tab row stays
 * hidden (`tabs.css`: the DS list display rule would beat `hidden`); after hydration the island (`Tabs.client.tsx`)
 * makes tabs of them as the page's own script does (:397-439). Content comes in by props; the panels' content may be
 * server components (it never enters the island).
 */
export function Tabs({ label, panels, headingClassName }: TabsProps) {
  return (
    <div className="kh-tabs" data-tabs="">
      <div className="kh-tabs__list" role="tablist" aria-label={label} hidden>
        {panels.map((panel, i) => (
          <Fragment key={panel.id}>
            {/* A space keeps the tab words apart in the text, as the mockup's line breaks do (the flex row ignores it). */}
            {i > 0 && " "}
            <button
              type="button"
              className="kh-tab"
              role="tab"
              id={panel.tabId}
              aria-controls={panel.id}
              aria-selected={i === 0}
              tabIndex={i === 0 ? undefined : -1}
            >
              {panel.label}
            </button>
          </Fragment>
        ))}
      </div>
      {panels.map((panel) => (
        <div key={panel.id} className="kh-tabs__panel" id={panel.id}>
          <h3 className={clsx("kh-subtitle", headingClassName)} data-tab-heading="">
            {panel.heading}
          </h3>
          {panel.content}
        </div>
      ))}
      <TabsIsland tab={panels[0].tabId} />
    </div>
  );
}
