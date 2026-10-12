import { describe, expect, it } from "vitest";
import { breadcrumbListNode } from "./breadcrumb-list";

describe("breadcrumbListNode", () => {
  /* Only the crumbs the page shows (architecture §9.2): the article mockups show "Stories" then
     the topic; nothing is prepended. */
  it("numbers the visible crumbs from one, with absolute item URLs", () => {
    expect(
      breadcrumbListNode([
        { name: "Stories", path: "/stories" },
        { name: "Learning and play", path: "/stories#learning" },
      ]),
    ).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Stories", item: "https://kheelona.com/stories" },
        { "@type": "ListItem", position: 2, name: "Learning and play", item: "https://kheelona.com/stories#learning" },
      ],
    });
  });

  it("lets the last crumb, the page itself, go without a link", () => {
    expect(breadcrumbListNode([{ name: "Stories", path: "/stories" }, { name: "This guide" }]).itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "This guide",
    });
  });

  it("refuses a crumb without a link anywhere but last", () => {
    expect(() => breadcrumbListNode([{ name: "Stories" }, { name: "Topic", path: "/stories#learning" }])).toThrow(/last/);
  });

  it("refuses an empty trail or an empty name", () => {
    expect(() => breadcrumbListNode([])).toThrow(/at least one/);
    expect(() => breadcrumbListNode([{ name: "", path: "/stories" }])).toThrow(/name/);
  });
});
