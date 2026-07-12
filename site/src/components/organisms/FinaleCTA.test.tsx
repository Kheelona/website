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

  it("full variant renders the decorative lineup images", () => {
    const { container } = render(<FinaleCTA variant="full" />);
    // aria-hidden lineup (5 mascot/product cutouts, alt="")
    const lineup = container.querySelector('[aria-hidden="true"].flex');
    expect(lineup).toBeInTheDocument();
    expect(lineup?.querySelectorAll("img").length).toBe(5);
  });

  it("compact variant drops the lineup spectacle", () => {
    const { container } = render(<FinaleCTA variant="compact" />);
    // no aria-hidden flex row of cutout images
    expect(container.querySelector('[aria-hidden="true"].flex')).toBeNull();
  });

  it("mounts the Kheelu narrator bubble only when kheeluLine is passed", () => {
    render(<FinaleCTA kheeluLine="Your spot is one tap away." />);
    expect(screen.getByText("Your spot is one tap away.")).toBeInTheDocument();
  });
});
