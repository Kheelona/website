import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_ARROW_RIGHT, ICON_PATHS, ICON_SHIELD_CHECK, type IconName } from "@/assets/icons.generated";
import { WHATSAPP_GLYPH } from "@/assets/whatsapp-logo.generated";
import { Glyph } from "./Glyph";
import { Icon } from "./Icon";

/* Glyph (task 2.11): the DS icon markup drawn from one named path constant, so a client island can draw an icon
 * without the whole icon map (Icon reads ICON_PATHS by name; Glyph takes the path itself). */

/* The arrow as mockup/build.mjs inlines it (home.html fold 1, hero CTA), hand-copied from the built mockup. */
const ARROW_RIGHT =
  '<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>';

describe("Glyph", () => {
  it("renders a decorative DS icon exactly as the mockup inlines it", () => {
    expect(renderToStaticMarkup(<Glyph d={ICON_ARROW_RIGHT} />)).toBe(ARROW_RIGHT);
  });

  it("adds a composition class after kh-icon", () => {
    const html = renderToStaticMarkup(<Glyph d={ICON_ARROW_RIGHT} className="ks-btn__arrow" />);
    expect(html.startsWith('<svg class="kh-icon ks-btn__arrow" viewBox="0 0 256 256"')).toBe(true);
  });

  it("is hidden from assistive technology without a label", () => {
    const { container } = render(<Glyph d={ICON_ARROW_RIGHT} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("becomes an image with an accessible name when labelled", () => {
    render(<Glyph d={ICON_SHIELD_CHECK} label="Safe" />);
    const img = screen.getByRole("img", { name: "Safe" });
    expect(img).not.toHaveAttribute("aria-hidden");
    expect(img).toHaveAttribute("focusable", "false");
  });

  it("renders exactly the markup Icon renders, for every DS icon, decorative, labelled and with a class", () => {
    for (const name of Object.keys(ICON_PATHS) as IconName[]) {
      // whatsapp-logo: Icon draws the site's Wikimedia logo (D064 item 3, task Q2.4), through Glyph all the same.
      const d = name === "whatsapp-logo" ? WHATSAPP_GLYPH : ICON_PATHS[name];
      expect(renderToStaticMarkup(<Glyph d={d} />), name).toBe(renderToStaticMarkup(<Icon name={name} />));
      expect(renderToStaticMarkup(<Glyph d={d} label="Named" className="ks-x" />), name).toBe(
        renderToStaticMarkup(<Icon name={name} label="Named" className="ks-x" />),
      );
    }
  });

  it("takes a DS icon constant only: a typed string does not compile", () => {
    // @ts-expect-error a string is not an IconPath: icons come from the named ICON_* constants (task 2.11)
    expect(renderToStaticMarkup(<Glyph d="M0,0Z" />)).toContain('d="M0,0Z"');
  });

  it("imports only the viewBox and the IconPath type from the icon module, never the icon map", () => {
    const source = readFileSync("src/components/ui/Icon/Glyph.tsx", "utf8");
    expect(source).toMatch(/^import \{ ICON_VIEWBOX, type IconPath \} from "@\/assets\/icons\.generated";$/m);
    expect(source).not.toMatch(/ICON_PATHS/);
    expect(source).not.toMatch(/^\s*["']use client["']/m);
  });
});

describe("Icon renders through Glyph", () => {
  it("Icon.tsx draws with Glyph (one markup for both)", () => {
    const source = readFileSync("src/components/ui/Icon/Icon.tsx", "utf8");
    expect(source).toMatch(/^import \{ Glyph \} from "\.\/Glyph";$/m);
    expect(source).toMatch(/<Glyph d=\{SITE_DRAWINGS\[name\] \?\? ICON_PATHS\[name\]\} label=\{label\} className=\{className\} \/>/);
    expect(source).not.toMatch(/<svg\b/);
  });
});
