import { render, screen } from "@testing-library/react";
import { TrustRoom } from "./TrustRoom";

describe("TrustRoom", () => {
  it("renders the four promises", () => {
    render(<TrustRoom />);
    for (const h of [
      "We do not sell data.",
      "Kheelu thinks on the device.",
      "You hold the keys.",
      "No open internet.",
    ]) {
      expect(screen.getByRole("heading", { name: h })).toBeInTheDocument();
    }
  });

  it("gives every promise a brand shape chip (founder brief 11a)", () => {
    const { container } = render(<TrustRoom />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(4);
  });

  it("links the deep dive to /safety", () => {
    render(<TrustRoom />);
    expect(
      screen.getByRole("link", { name: /See how we built safety in/i }),
    ).toHaveAttribute("href", "/safety");
  });
});
