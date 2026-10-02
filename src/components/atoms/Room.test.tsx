import { render, screen } from "@testing-library/react";
import { Room } from "./Room";

describe("Room (redesign 2026-10: a full-bleed band)", () => {
  it("renders its children in the 1180px content column, on the surface band by default", () => {
    render(<Room>Reserve Kheelu</Room>);
    const column = screen.getByText("Reserve Kheelu");
    expect(column.className).toContain("kh-wrap");
    expect(column.closest("section")!.className).toContain("bg-surface");
  });

  it("maps every other fill to the cream page band, and never a conversion fill", () => {
    render(<Room fill="sun">copy</Room>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el.className).toContain("bg-bg");
    expect(el.className).not.toContain("bg-action");
  });

  it("carries no mascot or reveal attributes any more", () => {
    render(<Room>copy</Room>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el).not.toHaveAttribute("data-say");
    expect(el).not.toHaveAttribute("data-guide");
    expect(el).not.toHaveAttribute("data-reveal");
  });

  it("forwards an id for anchor targets", () => {
    render(<Room id="reserve">copy</Room>);
    expect(screen.getByText("copy").closest("section")).toHaveAttribute("id", "reserve");
  });
});
