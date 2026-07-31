import { render, screen } from "@testing-library/react";
import { GROWTH_ARC, GROWTH_HEDGE, GROWTH_CLOSING } from "@/lib/growth-arc";
import { GrowthArc } from "./GrowthArc";

describe("GrowthArc", () => {
  it("renders every stage with kicker, title, and body", () => {
    render(<GrowthArc />);
    for (const s of GROWTH_ARC) {
      expect(screen.getByText(s.kicker)).toBeInTheDocument();
      expect(screen.getByText(s.title)).toBeInTheDocument();
      expect(screen.getByText(s.body)).toBeInTheDocument();
    }
  });

  it("closes on the hedge and the tutor re-homing line", () => {
    render(<GrowthArc />);
    expect(screen.getByText(GROWTH_HEDGE)).toBeInTheDocument();
    expect(screen.getByText(GROWTH_CLOSING)).toBeInTheDocument();
  });

  it("is informational: no buttons, no links, nothing pretending to be tappable", () => {
    render(<GrowthArc />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
