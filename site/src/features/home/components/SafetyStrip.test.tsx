import { render, screen } from "@testing-library/react";
import { SafetyStrip } from "./SafetyStrip";

describe("SafetyStrip", () => {
  it("renders the section heading", () => {
    render(<SafetyStrip />);
    expect(
      screen.getByRole("heading", {
        name: /Safe in their hands\. Careful with their words\./i,
      }),
    ).toBeInTheDocument();
  });

  it("links to the safety page via its CTA button", () => {
    render(<SafetyStrip />);
    expect(
      screen.getByRole("link", { name: /Read how we built safety in/i }),
    ).toHaveAttribute("href", "/safety");
  });

  it("renders the calm mascot alongside the copy", () => {
    render(<SafetyStrip />);
    expect(
      screen.getByAltText(/standing calm and content, eyes closed/i),
    ).toBeInTheDocument();
  });
});
