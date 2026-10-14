import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLayoutEffect, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs, type TabsPanel } from "./Tabs";

/* Tabs (task 3.5): the DS Tabs markup the approved product page serves (mockup/pages/meet-kheelu.html:277-330), from
   generic props, and the island that makes tabs of it as the page's own script does (:397-439). The server HTML is
   the stacked state (tab list hidden, every panel under its heading); in a browser the island runs after hydration. */

const PANELS: readonly [TabsPanel, ...TabsPanel[]] = [
  { id: "panel-a", tabId: "tab-a", label: "First", heading: "First things", content: <p>One</p> },
  { id: "panel-b", tabId: "tab-b", label: "Second", heading: "Second things", content: <p>Two</p> },
  { id: "panel-c", tabId: "tab-c", label: "Third", heading: "Third things", content: <p>Three</p> },
];

describe("Tabs: the server HTML (no JavaScript yet)", () => {
  it("prints the mockup's DS Tabs markup: the hidden tablist first, then each panel under its heading", () => {
    expect(renderToStaticMarkup(<Tabs label="Example" panels={PANELS} />)).toBe(
      '<div class="kh-tabs" data-tabs="">' +
        '<div class="kh-tabs__list" role="tablist" aria-label="Example" hidden="">' +
        '<button type="button" class="kh-tab" role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true">First</button> ' +
        '<button type="button" class="kh-tab" role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false" tabindex="-1">Second</button> ' +
        '<button type="button" class="kh-tab" role="tab" id="tab-c" aria-controls="panel-c" aria-selected="false" tabindex="-1">Third</button>' +
        "</div>" +
        '<div class="kh-tabs__panel" id="panel-a"><h3 class="kh-subtitle" data-tab-heading="">First things</h3><p>One</p></div>' +
        '<div class="kh-tabs__panel" id="panel-b"><h3 class="kh-subtitle" data-tab-heading="">Second things</h3><p>Two</p></div>' +
        '<div class="kh-tabs__panel" id="panel-c"><h3 class="kh-subtitle" data-tab-heading="">Third things</h3><p>Three</p></div>' +
        "</div>",
    );
  });

  it("keeps the tab words apart in the text, as the mockup's whitespace does (a reader without CSS sees no 'FirstSecond')", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(<Tabs label="Example" panels={PANELS} />);
    expect(host.querySelector(".kh-tabs__list")!.textContent).toBe("First Second Third");
  });

  it("gives every panel heading the section's own class", () => {
    const html = renderToStaticMarkup(<Tabs label="Example" panels={PANELS} headingClassName="ks-panel-title" />);
    expect(html.match(/<h3 [^>]*>/g)).toEqual([
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">',
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">',
      '<h3 class="kh-subtitle ks-panel-title" data-tab-heading="">',
    ]);
  });
});

describe("Tabs: with JavaScript (the island has run)", () => {
  it("shows the named tablist, selects the first tab and shows only its panel, named by the tab", () => {
    const { container } = render(<Tabs label="Example" panels={PANELS} />);
    expect(container.firstElementChild!.className).toBe("kh-tabs is-tabs");
    const list = screen.getByRole("tablist", { name: "Example" });
    expect(list).not.toHaveAttribute("hidden");
    const tabs = within(list).getAllByRole("tab");
    expect(tabs.map((t) => [t.textContent, t.getAttribute("aria-selected"), t.getAttribute("tabindex")])).toEqual([
      ["First", "true", "0"],
      ["Second", "false", "-1"],
      ["Third", "false", "-1"],
    ]);
    expect(screen.getAllByRole("tabpanel").map((p) => p.id)).toEqual(["panel-a"]);
    expect(screen.getByRole("tabpanel", { name: "First" })).toHaveAttribute("tabindex", "0");
    expect(screen.getAllByRole("tabpanel", { hidden: true }).map((p) => [p.id, p.hidden])).toEqual([
      ["panel-a", false],
      ["panel-b", true],
      ["panel-c", true],
    ]);
    expect([...container.querySelectorAll("h3")].map((h) => h.className)).toEqual(["kh-subtitle kh-sr", "kh-subtitle kh-sr", "kh-subtitle kh-sr"]);
  });

  it("follows the keyboard: Tab reaches the selected tab, arrows (wrapping), Home and End select and focus, Tab moves on to the panel", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Example" panels={PANELS} />);
    const tab = (name: string) => screen.getByRole("tab", { name });
    const shown = () => screen.getAllByRole("tabpanel").map((p) => p.id);

    await user.tab();
    expect(tab("First")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(tab("Second")).toHaveFocus();
    expect(tab("Second")).toHaveAttribute("aria-selected", "true");
    expect(shown()).toEqual(["panel-b"]);
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(tab("First")).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(tab("Third")).toHaveFocus();
    expect(shown()).toEqual(["panel-c"]);
    await user.keyboard("{Home}");
    expect(tab("First")).toHaveFocus();
    await user.keyboard("{End}");
    expect(tab("Third")).toHaveFocus();
    expect(screen.getAllByRole("tab").filter((t) => t.getAttribute("tabindex") === "0")).toEqual([tab("Third")]);

    await user.tab();
    expect(screen.getByRole("tabpanel", { name: "Third" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(tab("Third")).toHaveFocus();
  });

  it("selects a tab on a click", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Example" panels={PANELS} />);
    await user.click(screen.getByRole("tab", { name: "Second" }));
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tabpanel").map((p) => p.id)).toEqual(["panel-b"]);
  });

  /* Task 7.1a (CMO built-page review A, M2): after a client navigation to /products/kheelu#faq, Next scrolls the hash
     target into view in its own layout effect, an ancestor's, which runs after its children's layout effects and before
     any passive effect. The island used to make tabs in a passive effect, after that scroll, so panels 2 and 3 hid above
     the questions once Next had scrolled, and the page landed 464 px (phone) or 394 px (laptop) past the questions'
     heading. Made in a layout effect, the tabs are in place before an ancestor's layout effect measures the page. */
  it("makes its tabs before an ancestor's layout effect runs (where Next scrolls to a #fragment on a route change)", () => {
    const seen: Array<{ tabs: boolean; hidden: string[] }> = [];
    function ScrollsLikeNext({ children }: { children: ReactNode }) {
      useLayoutEffect(() => {
        const box = document.querySelector(".kh-tabs")!;
        seen.push({ tabs: box.classList.contains("is-tabs"), hidden: Array.from(box.querySelectorAll<HTMLElement>(".kh-tabs__panel")).filter((p) => p.hidden).map((p) => p.id) });
      }, []);
      return children;
    }
    render(
      <ScrollsLikeNext>
        <Tabs label="Example" panels={PANELS} />
      </ScrollsLikeNext>,
    );
    expect(seen).toEqual([{ tabs: true, hidden: ["panel-b", "panel-c"] }]);
  });

  /* Task 7.1a (CMO built-page review A, M1): on a direct landing at /products/kheelu#faq the browser scrolls to the
     questions on the stacked page, before hydration; making tabs then moves them up by the hidden panels' height, and
     the browser's scroll anchoring put them back only sometimes (the landing ended 464 px past the heading). So when the
     address names an element after the box, the island scrolls by what that element moved, at once. */
  describe("keeps a #fragment landing where it was when the panels hide", () => {
    let hidden = false;
    afterEach(() => {
      window.history.replaceState(null, "", "/");
      vi.restoreAllMocks();
    });
    /** The page as the browser lays it out: the questions sit at the top of the screen until panels 2 and 3 hide. */
    function layout() {
      hidden = false;
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
        const panelsHidden = document.querySelectorAll(".kh-tabs__panel[hidden]").length > 0;
        const top = this.id === "faq" ? (panelsHidden ? -464 : 0) : this.id === "top" ? (panelsHidden ? -1000 : -1000) : 0;
        hidden ||= panelsHidden;
        return { top, bottom: top + 10, left: 0, right: 10, width: 10, height: 10, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
      });
      return vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    }
    const page = () =>
      render(
        <>
          <section id="top" />
          <Tabs label="Example" panels={PANELS} />
          <section id="faq" />
        </>,
      );

    it("scrolls by what the named element moved, at once, when it comes after the tabs", () => {
      const scrollBy = layout();
      window.history.replaceState(null, "", "/#faq");
      page();
      expect(scrollBy).toHaveBeenCalledTimes(1);
      expect(scrollBy).toHaveBeenCalledWith({ top: -464, behavior: "instant" });
      expect(hidden, "measured once the panels had hidden").toBe(true);
    });

    it("leaves the scroll alone with no fragment, a fragment above the tabs, or one that names nothing", () => {
      const scrollBy = layout();
      for (const hash of ["", "#top", "#nothing", "#%E0%A4"]) {
        window.history.replaceState(null, "", `/${hash}`);
        page().unmount();
      }
      expect(scrollBy).not.toHaveBeenCalled();
    });
  });

  it("keeps two tab sets on one page apart: each island enhances and steers its own", async () => {
    const user = userEvent.setup();
    const OTHER: readonly [TabsPanel, ...TabsPanel[]] = PANELS.map((p) => ({ ...p, id: `${p.id}-2`, tabId: `${p.tabId}-2` })) as never;
    render(
      <>
        <Tabs label="Example" panels={PANELS} />
        <Tabs label="Other" panels={OTHER} />
      </>,
    );
    const other = screen.getByRole("tablist", { name: "Other" });
    expect(other.parentElement!.className).toBe("kh-tabs is-tabs");
    await user.click(within(other).getByRole("tab", { name: "Third" }));
    expect(within(screen.getByRole("tablist", { name: "Example" })).getByRole("tab", { name: "First" })).toHaveAttribute("aria-selected", "true");
    expect(within(other).getByRole("tab", { name: "Third" })).toHaveAttribute("aria-selected", "true");
  });
});
