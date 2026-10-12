import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";

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
});
