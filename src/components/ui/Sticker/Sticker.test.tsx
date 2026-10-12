import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Sticker } from "./Sticker";

describe("Sticker", () => {
  it("renders the Home hero's round sticker as home.html fold 1 does", () => {
    expect(renderToStaticMarkup(<Sticker tone="sun" variant="round" tilt={8} lead="It asks." lines={["They think."]} />)).toBe(
      '<span class="kh-sticker kh-tone-sun kh-sticker--round" style="--kh-tilt:8deg"><strong>It asks.</strong>They think.</span>',
    );
  });

  it("renders the refund page's hand sticker as a paragraph, lines broken where the copy breaks (refund.html)", () => {
    expect(
      renderToStaticMarkup(<Sticker as="p" tone="sun" variant="hand" tilt={4} lines={["Changed your mind?", "That’s allowed."]} />),
    ).toBe('<p class="kh-sticker kh-tone-sun kh-sticker--hand ks-sticker--flush" style="--kh-tilt:4deg">Changed your mind?<br/>That’s allowed.</p>');
  });

  it("keeps the DS default tilt when none is given: no inline style at all", () => {
    const { container } = render(<Sticker tone="chilli" lines={["First 500 only"]} />);
    const sticker = container.firstElementChild!;
    expect(sticker.className).toBe("kh-sticker kh-tone-chilli");
    expect(sticker).not.toHaveAttribute("style");
  });

  it("takes negative tilts and a composition class (meet-kheelu.html hero)", () => {
    const html = renderToStaticMarkup(
      <Sticker tone="sun" variant="round" tilt={-8} lead="It asks." lines={["They think."]} className="ks-hero-sticker" />,
    );
    expect(html).toContain('class="kh-sticker kh-tone-sun kh-sticker--round ks-hero-sticker" style="--kh-tilt:-8deg"');
  });

  it("renders its words from content strings", () => {
    render(<Sticker tone="blue" lines={["Ages {nowrap:3 to 7}"]} />);
    expect(screen.getByText("3 to 7")).toHaveClass("ks-nowrap");
  });
});
