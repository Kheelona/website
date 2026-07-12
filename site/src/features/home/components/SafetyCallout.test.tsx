import { render, screen } from "@testing-library/react";
import { SafetyCallout } from "./SafetyCallout";

describe("SafetyCallout", () => {
  it("renders the first-question callout lead and body", () => {
    render(<SafetyCallout />);
    expect(screen.getByText(/The first question, answered/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the first question about any AI toy is whether it is safe/i),
    ).toBeInTheDocument();
  });

  it("links to the safety page", () => {
    render(<SafetyCallout />);
    expect(
      screen.getByRole("link", { name: /See how we built safety in/i }),
    ).toHaveAttribute("href", "/safety");
  });
});
