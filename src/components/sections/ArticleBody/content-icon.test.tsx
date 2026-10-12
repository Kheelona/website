import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { ContentIcon, asIconName } from "./content-icon";

/* Content names its icons as strings (IconRef); the DS Icon takes the generated IconName union. Sections narrow each
   content icon here, so a name that is not one of the 76 DS icons fails the render (and the build) instead of drawing
   an empty svg. */

describe("asIconName", () => {
  it("passes a DS icon name through unchanged", () => {
    expect(asIconName("book-open")).toBe("book-open");
    expect(asIconName("caret-right")).toBe("caret-right");
  });

  it("refuses a name the DS does not have, and an inherited object key", () => {
    expect(() => asIconName("linkedin-logo")).toThrow(/not one of the .* design-system icons/);
    expect(() => asIconName("toString")).toThrow(/not one of the .* design-system icons/);
  });
});

describe("ContentIcon", () => {
  it("draws the DS icon of that name, decorative, with the composition class", () => {
    const { container } = render(<ContentIcon name="check" className="ks-x" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("kh-icon", "ks-x");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.querySelector("path")).toHaveAttribute("d", ICON_PATHS.check);
  });
});
