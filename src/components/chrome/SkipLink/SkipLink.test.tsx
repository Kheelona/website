import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./SkipLink";

/* SkipLink (task 3.1): the first focusable element of every page, as the mockup's build script writes it before the
 * nav (mockup/build.mjs head(): `a.kh-btn.kh-btn--secondary.mk-skip`), ported as `ks-skip` (components §7). */

const mockup = new DOMParser().parseFromString(readFileSync("mockup/home.html", "utf8"), "text/html");
const CSS = readFileSync("src/components/chrome/SkipLink/skip-link.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("SkipLink", () => {
  it("is the mockup's skip link: a DS secondary button to #main, its words in a span", () => {
    const { container } = render(<SkipLink label="Skip to content" />);
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveAttribute("href", "#main");
    const ported = mockup.body.firstElementChild!.cloneNode(true) as Element;
    ported.setAttribute("class", ported.getAttribute("class")!.replace(/\bmk-skip\b/, "ks-skip"));
    // Same element, attributes (in any order) and children as the mockup's.
    expect(container.firstElementChild!.isEqualNode(ported), container.innerHTML).toBe(true);
  });

  it("takes its words from content", () => {
    render(<SkipLink label="Zum Inhalt" />);
    expect(screen.getByRole("link")).toHaveTextContent("Zum Inhalt");
  });

  it("waits above the screen and drops in on focus (mockup.css:11-12)", () => {
    const flat = CSS.replace(/\s+/g, " ");
    expect(flat).toContain(
      ".ks-skip { position: absolute; left: var(--space-4); top: calc(var(--space-9) * -1); z-index: var(--z-toast); }",
    );
    expect(flat).toContain(".ks-skip:focus { top: var(--space-4); }");
  });
});
