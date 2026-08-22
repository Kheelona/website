import { render, screen } from "@testing-library/react";
import { KheelonaPlusBand } from "./KheelonaPlusBand";

describe("KheelonaPlusBand", () => {
  it("states the included period and defers the price", () => {
    render(<KheelonaPlusBand />);
    expect(screen.getByText(/includes 6 months of Kheelona\+/)).toBeInTheDocument();
    expect(screen.getByText(/announced soon/)).toBeInTheDocument();
    expect(screen.getByText(/yours for life/)).toBeInTheDocument();
  });

  it("never renders a price for the subscription (gate V3-b)", () => {
    const { container } = render(<KheelonaPlusBand />);
    expect(container.textContent).not.toMatch(/₹|Rs\.?\s?\d/);
  });

  it("makes no claim about what happens after the 6 months (gate V3-b)", () => {
    const { container } = render(<KheelonaPlusBand />);
    expect(container.textContent).not.toMatch(/keeps working|stops working|still works|expires/i);
  });

  it("promises no surprise renewal, the thing the category gets wrong", () => {
    render(<KheelonaPlusBand />);
    expect(
      screen.getByText("Nothing renews without you, ever."),
    ).toBeInTheDocument();
  });

  it("mounts a footnote marker only when a page carries the notes", () => {
    const { container, rerender } = render(<KheelonaPlusBand />);
    expect(container.querySelector('a[href="#fn-kheelona-plus"]')).toBeNull();
    rerender(<KheelonaPlusBand footnote={2} />);
    expect(container.querySelector('a[href="#fn-kheelona-plus"]')).not.toBeNull();
  });
});
