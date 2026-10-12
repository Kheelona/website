import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useLayoutEffect, useRef, type ReactElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Tabs, type TabsPanel } from "./Tabs";

/* Tabs (task 3.5): DS line tabs on the ARIA tabs pattern, served stacked and made tabs by the island after hydration,
 * as the approved product page does (mockup/pages/meet-kheelu.html:277-330, :397-439). Story data only. The product's
 * own panels are ProductDetails' stories. test/e2e/tabs.spec.ts runs the keyboard path, the ARIA states and axe on
 * these stories. */

const PANELS: readonly [TabsPanel, ...TabsPanel[]] = [
  { id: "panel-first", tabId: "tab-first", label: "First", heading: "First", content: <p className="kh-body">What the first panel says.</p> },
  { id: "panel-second", tabId: "tab-second", label: "Second", heading: "Second", content: <p className="kh-body">What the second panel says.</p> },
  { id: "panel-third", tabId: "tab-third", label: "Third", heading: "Third", content: <p className="kh-body">What the third panel says.</p> },
];

/**
 * Story support (in capitals, so left out of the story list; ProductDetails' stories use it too): renders `element` to
 * HTML as the server does and paints it. With `hydrate`, React then hydrates that HTML in place, once the fonts are in
 * and two frames have painted the served state, as Next does with a page, so the island runs on the served markup; a
 * `kh-hydrate` performance mark is set just before. Without `hydrate` the HTML stays as served: the page as a browser
 * without JavaScript shows it.
 */
export function SERVER_RENDERED({ element, hydrate }: { element: ReactElement; hydrate: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = host.current!;
    el.innerHTML = renderToString(element);
    if (!hydrate) return;
    let root: Root | undefined;
    let cancelled = false;
    void document.fonts.ready.then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          performance.mark("kh-hydrate");
          root = hydrateRoot(el, element);
        }),
      ),
    );
    return () => {
      cancelled = true;
      root?.unmount();
    };
  }, [element, hydrate]);
  return <div ref={host} data-testid="served" />;
}

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  excludeStories: /^[A-Z0-9_]+$/,
  args: { label: "Example tabs", panels: PANELS },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With JavaScript: the tab row, the first panel shown, the others behind their tabs. */
export const Default: Story = {};

/** The served HTML without JavaScript: the three panels stacked under their headings, no tab row. */
export const WithoutJavaScript: Story = {
  render: (args) => <SERVER_RENDERED element={<Tabs {...args} />} hydrate={false} />,
};
