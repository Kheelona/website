import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs, breadcrumbList } from "./Breadcrumbs";

const TRAIL = [
  { name: "Stories", path: "/stories" },
  { name: "Learning and play", path: "/stories#learning" },
] as const;
const caret = <svg className="kh-icon" data-icon="caret-right" aria-hidden="true" />;

describe("Breadcrumbs", () => {
  it("renders the trail as the article heads do: nav.ks-crumbs[aria-label] > ol.ks-type-body-s > li > a", () => {
    const { container } = render(<Breadcrumbs trail={TRAIL} label="Breadcrumb" separator={caret} />);
    const nav = container.firstElementChild as HTMLElement;
    expect(nav.tagName).toBe("NAV");
    expect(nav.className).toBe("ks-crumbs");
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBe(nav);
    const ol = nav.firstElementChild as HTMLElement;
    expect(ol.tagName).toBe("OL");
    expect(ol.className).toBe("ks-type-body-s");
    const links = within(ol).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Stories", "/stories"],
      ["Learning and play", "/stories#learning"],
    ]);
  });

  it("puts the separator before every crumb but the first (the caret leads its own item)", () => {
    const { container } = render(<Breadcrumbs trail={TRAIL} label="Breadcrumb" separator={caret} />);
    const items = [...container.querySelectorAll("li")];
    expect(items[0].querySelector("svg")).toBeNull();
    expect(items[1].firstElementChild?.getAttribute("data-icon")).toBe("caret-right");
    expect(items[1].lastElementChild?.tagName).toBe("A");
  });
});

describe("breadcrumbList", () => {
  it("returns the visible trail, numbered from 1, for the BreadcrumbList builder", () => {
    expect(breadcrumbList(TRAIL)).toEqual([
      { position: 1, name: "Stories", path: "/stories" },
      { position: 2, name: "Learning and play", path: "/stories#learning" },
    ]);
  });

  it("adds the current page last when given, as BreadcrumbList ends on the page itself", () => {
    expect(breadcrumbList(TRAIL, { name: "Learning toys for a 3-year-old", path: "/stories/learning-toys-for-a-three-year-old" }).at(-1)).toEqual({
      position: 3,
      name: "Learning toys for a 3-year-old",
      path: "/stories/learning-toys-for-a-three-year-old",
    });
  });
});
