import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { WHATSAPP_GLYPH } from "@/assets/whatsapp-logo.generated";
import { asIconName, ContentIcon, Icon } from "./Icon";
import { SITE_DRAWINGS } from "./site-drawings";

/* The arrow as mockup/build.mjs inlines it (home.html fold 1, hero CTA): the DS Phosphor Bold path of
   design-system/project/assets/Icons/arrow-right.svg, hand-copied from the built mockup. */
const ARROW_RIGHT =
  '<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>';

describe("Icon", () => {
  it("renders a decorative DS icon exactly as the mockup inlines it", () => {
    expect(renderToStaticMarkup(<Icon name="arrow-right" />)).toBe(ARROW_RIGHT);
  });

  it("adds a composition class after kh-icon", () => {
    const html = renderToStaticMarkup(<Icon name="arrow-right" className="ks-btn__arrow" />);
    expect(html.startsWith('<svg class="kh-icon ks-btn__arrow" viewBox="0 0 256 256"')).toBe(true);
  });

  it("is hidden from assistive technology without a label", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("becomes an image with an accessible name when labelled", () => {
    render(<Icon name="shield-check" label="Safe" />);
    const img = screen.getByRole("img", { name: "Safe" });
    expect(img).not.toHaveAttribute("aria-hidden");
    expect(img).toHaveAttribute("focusable", "false");
  });

  it("draws the path of the icon it names, not another", () => {
    const left = renderToStaticMarkup(<Icon name="arrow-left" />);
    expect(left).not.toBe(ARROW_RIGHT);
    expect(left).toContain('d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51');
  });

  /* D064 item 3 (task Q2.4): the WhatsApp logo is Wikimedia Commons' WhatsApp.svg wherever a link or button names the DS
     `whatsapp-logo` icon (the help lines, /contact's button, the store's and /thanks' buttons through Button), in one
     colour (currentColor) on the same grid and footprint; every other name keeps its DS drawing. */
  it("draws whatsapp-logo from the site's Wikimedia logo, one colour, in the DS icon markup", () => {
    const { container } = render(<Icon name="whatsapp-logo" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("kh-icon");
    expect(svg).toHaveAttribute("viewBox", "0 0 256 256");
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    expect(svg.querySelector("path")).toHaveAttribute("d", WHATSAPP_GLYPH);
    expect(svg.querySelector("path")).not.toHaveAttribute("fill");
    expect(WHATSAPP_GLYPH).not.toBe(ICON_PATHS["whatsapp-logo"]);
  });

  it("replaces that one drawing only (SITE_DRAWINGS)", () => {
    expect(SITE_DRAWINGS).toEqual({ "whatsapp-logo": WHATSAPP_GLYPH });
  });

  it("draws every other DS icon from its DS path", () => {
    for (const name of Object.keys(ICON_PATHS) as (keyof typeof ICON_PATHS)[]) {
      if (name === "whatsapp-logo") continue;
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector("path"), name).toHaveAttribute("d", ICON_PATHS[name]);
      unmount();
    }
  });
});

/* Content names its icons as strings (IconRef, src/content/types.ts); Icon takes the generated IconName union. The one
   narrowing (task 3.6; wave-3 close "One of each helper") lives here, beside the map it reads, so a name that is not one
   of the 76 DS icons fails the render, and so the build, instead of drawing an empty svg (a DS gap, G-12). */
describe("asIconName", () => {
  it("passes a DS icon name through unchanged", () => {
    for (const name of ["book-open", "caret-right", "whatsapp-logo", "arrow-counter-clockwise"]) expect(asIconName(name)).toBe(name);
  });

  it("refuses a name the DS does not have, and an inherited object key", () => {
    for (const name of ["linkedin-logo", "phone", "toString", "constructor", ""]) {
      expect(() => asIconName(name), name).toThrow(/not one of the 76 design-system icons/);
    }
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

  it("is exactly the Icon of that name", () => {
    expect(renderToStaticMarkup(<ContentIcon name="arrow-right" />)).toBe(ARROW_RIGHT);
    // Content's WhatsApp links (contact.ts, the product page's help line) get the Wikimedia logo too (D064 item 3).
    expect(renderToStaticMarkup(<ContentIcon name="whatsapp-logo" />)).toBe(renderToStaticMarkup(<Icon name="whatsapp-logo" />));
    expect(renderToStaticMarkup(<ContentIcon name="whatsapp-logo" />)).toContain(`d="${WHATSAPP_GLYPH}"`);
  });

  it("fails the render on a content icon the DS lacks", () => {
    expect(() => renderToStaticMarkup(<ContentIcon name="linkedin-logo" />)).toThrow(/not one of the 76 design-system icons/);
  });
});
