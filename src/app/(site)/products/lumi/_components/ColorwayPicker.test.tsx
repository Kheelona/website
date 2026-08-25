import { render, screen, fireEvent } from "@testing-library/react";
import { ColorwayPicker } from "./ColorwayPicker";
import { LUMI_ART } from "@/lib/lumi-art";

describe("ColorwayPicker (one colourway since 2026-08-25)", () => {
  it("is a labelled radiogroup with the one colourway selected", () => {
    render(<ColorwayPicker />);
    expect(screen.getByRole("radiogroup", { name: "Pick Lumi's colour" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(1);
    expect(screen.getByRole("radio", { name: /Cream/ })).toHaveAttribute("aria-checked", "true");
  });

  it("shows the plush, from the one art source", () => {
    render(<ColorwayPicker />);
    const images = screen.getAllByRole("img", { hidden: true });
    expect(images.length).toBe(1);
    const visible = images.filter((img) => img.className.includes("block"));
    expect(visible.length).toBe(1);
    expect(visible[0]?.getAttribute("src")).toBe(LUMI_ART.src);
    expect(visible[0]).toHaveAttribute("data-priority", "true");
  });

  /* Arrow keys are a no-op with one entry, but the handler stays so that a
     second colourway is a row in COLORWAYS and nothing else. This asserts the
     no-op does not throw and does not deselect the only option. */
  it("survives arrow keys without losing the selection", () => {
    render(<ColorwayPicker />);
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: /Cream/ })).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
    expect(screen.getByRole("radio", { name: /Cream/ })).toHaveAttribute("aria-checked", "true");
  });
});
