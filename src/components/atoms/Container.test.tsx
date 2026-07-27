import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container>Reserve Lumi</Container>);
    expect(screen.getByText("Reserve Lumi")).toBeInTheDocument();
  });

  it("marks itself data-content so the 3D stage can avoid the copy column", () => {
    render(<Container>copy</Container>);
    const el = screen.getByText("copy").closest("[data-content]");
    expect(el).toBeInTheDocument();
  });

  it("keeps the centered max-width column classes", () => {
    render(<Container>copy</Container>);
    const el = screen.getByText("copy").closest("[data-content]")!;
    expect(el.className).toContain("mx-auto");
    expect(el.className).toContain("max-w-[1200px]");
  });

  it("merges an extra className onto the base classes", () => {
    render(<Container className="py-10">copy</Container>);
    const el = screen.getByText("copy").closest("[data-content]")!;
    expect(el.className).toContain("py-10");
    expect(el.className).toContain("max-w-[1200px]");
  });
});
