import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders its children", () => {
    render(<Section>Reserve Lumi</Section>);
    expect(screen.getByText("Reserve Lumi")).toBeInTheDocument();
  });

  it("defaults to the white wash", () => {
    render(<Section>copy</Section>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el).toHaveAttribute("data-wash", "white");
    expect(el.className).toContain("bg-white");
  });

  it("carries white text on the deep teal band for contrast", () => {
    render(<Section wash="teal">copy</Section>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el).toHaveAttribute("data-wash", "teal");
    expect(el.className).toContain("bg-teal-deep");
    expect(el.className).toContain("text-white");
  });

  it("uses the orange-cta fill for the orange wash", () => {
    render(<Section wash="orange">copy</Section>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el.className).toContain("bg-orange-cta");
  });

  it("forwards an id for anchor targets", () => {
    render(
      <Section id="reserve">copy</Section>,
    );
    const el = screen.getByText("copy").closest("section")!;
    expect(el).toHaveAttribute("id", "reserve");
  });
});
