import { render, screen } from "@testing-library/react";
import { Room } from "./Room";

describe("Room", () => {
  it("renders its children in a white panel by default", () => {
    render(<Room>Reserve Lumi</Room>);
    const el = screen.getByText("Reserve Lumi").closest("section")!;
    expect(el.className).toContain("bg-white");
    expect(el.className).toContain("rounded-(--radius-room)");
  });

  it("offers the four calm fills and no conversion orange (retired in V4)", () => {
    render(<Room fill="sun">copy</Room>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el.className).toContain("bg-[#fdf1e2]");
    expect(el.className).not.toContain("bg-action");
    expect(el.className).not.toContain("text-white");
  });

  it("exposes guide pose and say line as data attributes for KheeluGuide", () => {
    render(
      <Room guide="curious" say="These folks vouch for us.">
        copy
      </Room>,
    );
    const el = screen.getByText("copy").closest("section")!;
    expect(el).toHaveAttribute("data-guide", "curious");
    expect(el).toHaveAttribute("data-say", "These folks vouch for us.");
  });

  it("opts into a directional reveal only when asked", () => {
    render(<Room reveal="left">copy</Room>);
    expect(screen.getByText("copy").closest("section")).toHaveAttribute("data-reveal", "left");
  });

  it("carries no reveal attribute by default (LCP-safe)", () => {
    render(<Room>copy</Room>);
    expect(screen.getByText("copy").closest("section")).not.toHaveAttribute("data-reveal");
  });

  it("forwards an id for anchor targets", () => {
    render(<Room id="reserve">copy</Room>);
    expect(screen.getByText("copy").closest("section")).toHaveAttribute("id", "reserve");
  });
});
