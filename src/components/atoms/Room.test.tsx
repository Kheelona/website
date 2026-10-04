import { render, screen } from "@testing-library/react";
import { Room } from "./Room";

describe("Room", () => {
  it("renders its children in a white panel by default", () => {
    render(<Room>Reserve Kheelu</Room>);
    const el = screen.getByText("Reserve Kheelu").closest("section")!;
    expect(el.className).toContain("bg-white");
    expect(el.className).toContain("rounded-(--radius-room)");
  });

  it("offers the four calm fills and no conversion orange (retired in V4)", () => {
    render(<Room fill="sun">copy</Room>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el.className).toContain("bg-sun");
    expect(el.className).not.toContain("bg-action");
    expect(el.className).not.toContain("text-white");
  });

  /* CMO merge (2026-10-04): the founder retired the Kheelu guide, and with
     it the data attributes rooms used to feed it. Nothing reads them now, so
     nothing may write them. */
  it("no longer feeds a guide: no data-guide or data-say", () => {
    render(<Room id="x">copy</Room>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el).not.toHaveAttribute("data-guide");
    expect(el).not.toHaveAttribute("data-say");
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
