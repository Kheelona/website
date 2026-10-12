import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton, words } from "../../../../test/support/mockup-compare";
import { EmptyStateSection } from "./EmptyStateSection";
import { NOT_FOUND } from "./EmptyStateSection.stories";

/* EmptyStateSection (task 3.4): the 404's first fold (404.html fold 1): the DS EmptyState (variant 404) with the page's
   one h1 and a labelled nav of four link rows, each one tap target. */

const OPTIONS = { drop: /^ks-list-reset$/ };

describe("EmptyStateSection", () => {
  it("markup and words equal 404.html fold 1", () => {
    const { container } = render(<EmptyStateSection {...NOT_FOUND} />);
    const mockup = mockupFold("404", "section[aria-labelledby='nf-title']");
    expect(skeleton(container.firstElementChild!, OPTIONS)).toBe(skeleton(mockup, OPTIONS));
    expect(words(container.firstElementChild!)).toBe(words(mockup));
  });

  it("is the band section of the first screen, named by its one h1, with the hero's first-screen spacing", () => {
    render(<EmptyStateSection {...NOT_FOUND} />);
    const section = screen.getByRole("region", { name: "We can’t find that page." });
    expect(section.className).toBe("kh-section kh-section--band ks-hero");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(section.querySelector(".kh-empty")!.className).toBe("kh-empty kh-tone-blue ks-404");
    expect(section.querySelector(".kh-empty__art")).toHaveAttribute("aria-hidden", "true");
  });

  it("offers the four ways on as one labelled navigation, each row a link in its tone with a hidden icon and chevron", () => {
    render(<EmptyStateSection {...NOT_FOUND} />);
    const nav = screen.getByRole("navigation", { name: "Where to go next" });
    expect(nav.className).toBe("ks-404__nav");
    const rows = screen.getAllByRole("link");
    expect(rows.map((a) => a.getAttribute("href"))).toEqual(["/", "/products/kheelu", "/stories", "/contact"]);
    expect(rows[1].className).toBe("kh-listitem kh-tone-chilli");
    /* The row is named by its title and line (jsdom joins the two spans without the space a browser's layout adds). */
    expect(rows[1].querySelector(".kh-listitem__title")!.textContent).toBe("Meet Kheelu");
    expect(rows[1].querySelector(".kh-listitem__sub")!.textContent).toBe("The toy, its three modes and the price.");
    expect(screen.getByRole("link", { name: /^Meet Kheelu/ })).toBe(rows[1]);
    expect(rows[1].querySelector(".kh-listitem__icon")).toHaveAttribute("aria-hidden", "true");
    expect(rows[1].querySelector(".kh-listitem__chev")).toHaveAttribute("aria-hidden", "true");
    expect(nav.querySelector("ul")!.className).toBe("kh-list ks-list-reset ks-404__list");
  });

  it("refuses an icon the DS does not have", () => {
    expect(() => render(<EmptyStateSection {...NOT_FOUND} icon="linkedin-logo" />)).toThrow(/design-system icons/);
  });
});
