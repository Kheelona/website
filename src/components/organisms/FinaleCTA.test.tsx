import { render, screen } from "@testing-library/react";
import { FinaleCTA } from "./FinaleCTA";

describe("FinaleCTA", () => {
  it("renders the reserve headline and the price ask inside a #reserve section", () => {
    const { container } = render(<FinaleCTA />);
    expect(
      screen.getByRole("heading", { name: /Reserve Lumi before the price goes up/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/₹4,999 for the first 500 units/i)).toBeInTheDocument();
    expect(container.querySelector("#reserve")).toBeInTheDocument();
  });

  it("renders no decorative lineup in any variant (V4: the form is the moment)", () => {
    const { container: full } = render(<FinaleCTA variant="full" />);
    const { container: compact } = render(<FinaleCTA variant="compact" />);
    expect(full.querySelectorAll("img").length).toBe(0);
    expect(compact.querySelectorAll("img").length).toBe(0);
  });

  it("sets the finale in ink on a white shell, never white-on-orange (V4 D5)", () => {
    const { container } = render(<FinaleCTA />);
    const heading = container.querySelector("h2")!;
    expect(heading.className).toContain("text-ink-head");
    expect(container.innerHTML).not.toContain("text-white");
    expect(container.querySelector("section")?.className).toContain("bg-white");
  });

});
