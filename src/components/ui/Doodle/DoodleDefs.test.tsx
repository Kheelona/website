import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Doodle } from "./Doodle";
import { DoodleDefs } from "./DoodleDefs";

/* DoodleDefs (task 2.3; ADR-010): the one shared chalk grain filter every drawn doodle points at, rendered once
   per page by the shell instead of once per doodle file. */

describe("DoodleDefs", () => {
  it("renders one hidden, unfocusable SVG holding the #ks-chalk filter in its defs", () => {
    const { container } = render(<DoodleDefs />);
    expect(container.children).toHaveLength(1);
    const svg = container.firstElementChild!;
    expect(svg.tagName.toLowerCase()).toBe("svg");
    expect(svg).toHaveClass("ks-doodle-defs");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("width", "0");
    expect(svg).toHaveAttribute("height", "0");
    const filters = svg.querySelectorAll("defs > filter");
    expect(filters).toHaveLength(1);
    expect(filters[0]).toHaveAttribute("id", "ks-chalk");
    expect(filters[0].querySelector("feTurbulence")).not.toBeNull();
  });

  it("is not a doodle itself: motion.css never selects it", () => {
    const { container } = render(<DoodleDefs />);
    expect(container.querySelector(".ks-doodle, [data-draw]")).toBeNull();
  });

  it("is what a drawn doodle's grain points at", () => {
    const { container } = render(
      <>
        <DoodleDefs />
        <Doodle name="chalk-heart" draw className="kh-art__layer" placement={{ left: 84, top: 8, width: 11 }} />
      </>,
    );
    const refs = [...container.querySelectorAll(".ks-doodle [filter]")].map((g) => g.getAttribute("filter"));
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) {
      const id = /^url\(#([\w-]+)\)$/.exec(ref ?? "")?.[1];
      expect(id, `filter reference ${ref}`).toBeDefined();
      expect(container.querySelectorAll(`filter#${id}`)).toHaveLength(1);
    }
  });
});
