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


  it("no longer offers the retired orange wash (V4: the finale is white)", () => {
    render(<Section wash="sun">copy</Section>);
    const el = screen.getByText("copy").closest("section")!;
    expect(el.className).toContain("bg-sun");
    expect(el.className).not.toContain("orange-cta");
  });

  it("forwards an id for anchor targets", () => {
    render(
      <Section id="reserve">copy</Section>,
    );
    const el = screen.getByText("copy").closest("section")!;
    expect(el).toHaveAttribute("id", "reserve");
  });

  it("no longer offers the retired teal wash (V3 cleanup)", () => {
    const { container } = render(<Section wash="sun">band</Section>);
    expect(container.innerHTML).not.toContain("teal");
  });
});
