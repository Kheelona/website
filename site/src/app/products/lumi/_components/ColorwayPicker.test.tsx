import { render, screen, fireEvent } from "@testing-library/react";
import { ColorwayPicker } from "./ColorwayPicker";

describe("ColorwayPicker", () => {
  it("is a labelled radiogroup with three colourways, blue selected first", () => {
    render(<ColorwayPicker />);
    expect(screen.getByRole("radiogroup", { name: "Pick Lumi's colour" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBe(3);
    expect(screen.getByRole("radio", { name: /Blue/ })).toHaveAttribute("aria-checked", "true");
  });

  it("keeps all three plush images mounted with only the active one visible", () => {
    render(<ColorwayPicker />);
    const images = screen.getAllByRole("img", { hidden: true });
    expect(images.length).toBe(3);
    const visible = images.filter((img) => img.className.includes("block"));
    expect(visible.length).toBe(1);
    expect(visible[0]?.getAttribute("src")).toContain("lumi-blue-2");
  });

  it("switches on click", () => {
    render(<ColorwayPicker />);
    fireEvent.click(screen.getByRole("radio", { name: /Pink/ }));
    expect(screen.getByRole("radio", { name: /Pink/ })).toHaveAttribute("aria-checked", "true");
    const visible = screen
      .getAllByRole("img", { hidden: true })
      .filter((img) => img.className.includes("block"));
    expect(visible[0]?.getAttribute("src")).toContain("lumi-pink-2");
  });

  it("moves selection with arrow keys (roving radio)", () => {
    render(<ColorwayPicker />);
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(screen.getByRole("radio", { name: /Green/ })).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
    expect(screen.getByRole("radio", { name: /Blue/ })).toHaveAttribute("aria-checked", "true");
  });
});
