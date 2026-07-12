import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders an h2 title by default with eyebrow and lede", () => {
    render(
      <SectionHeading
        eyebrow="Screen-free"
        title="A friend who listens"
        lede="No apps, no ads."
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "A friend who listens" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Screen-free")).toBeInTheDocument();
    expect(screen.getByText("No apps, no ads.")).toBeInTheDocument();
  });

  it("renders as an h1 when as='h1'", () => {
    render(<SectionHeading as="h1" title="Meet Lumi" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Meet Lumi" }),
    ).toBeInTheDocument();
  });

  it("omits the eyebrow and lede when not provided", () => {
    render(<SectionHeading title="Just a title" />);
    expect(
      screen.getByRole("heading", { name: "Just a title" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("No apps, no ads.")).not.toBeInTheDocument();
  });

  it("uses white type on the dark tone", () => {
    render(<SectionHeading title="On dark" tone="white" />);
    expect(
      screen.getByRole("heading", { name: "On dark" }).className,
    ).toContain("text-white");
  });

  it("applies the hero type scale for an h1", () => {
    render(<SectionHeading as="h1" title="Hero" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Hero" }).className,
    ).toContain("clamp(38px,4.5vw,58px)");
  });
});
