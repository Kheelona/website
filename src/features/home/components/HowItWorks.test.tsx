import { render, screen } from "@testing-library/react";
import { HowItWorks, HOW_LEDE, HOW_STEPS, WHY_CONVERSATION } from "./HowItWorks";
import { GROWTH_CLOSING } from "@/lib/growth-arc";
import { STORE_URL, RESERVE_LABEL } from "@/config/site";

describe("HowItWorks", () => {
  it("walks the four steps, ending on the published 'remembers' step", () => {
    render(<HowItWorks />);
    for (const s of HOW_STEPS) {
      expect(screen.getByRole("heading", { level: 3, name: s.title })).toBeInTheDocument();
    }
    expect(HOW_STEPS[3]!.title).toBe("Kheelu remembers");
    expect(screen.queryByText(/Kheelu adapts/)).toBeNull();
  });

  /* Founder decision 4 (2026-10-04): research-anchored, never Kheelu's own
     effect, so Home cannot contradict /how. */
  it("credits the research to the turns, never claims Kheelu grows the brain", () => {
    render(<HowItWorks />);
    expect(screen.getByText(HOW_LEDE)).toBeInTheDocument();
    for (const copy of [HOW_LEDE, WHY_CONVERSATION]) {
      expect(copy).not.toMatch(/Kheelu (helps|grows|builds|develops)[^.]*brain/i);
    }
    expect(WHY_CONVERSATION).toMatch(/caring adult/);
  });

  it("sends the curious to /how for where the research stops", () => {
    render(<HowItWorks />);
    expect(screen.getByRole("link", { name: "Read the research" })).toHaveAttribute("href", "/how");
  });

  it("offers the age tabs", () => {
    render(<HowItWorks />);
    expect(screen.getByRole("tablist", { name: "Ages" })).toBeInTheDocument();
  });

  it("closes on the tutor line and keeps the home-arc cta value", () => {
    render(<HowItWorks />);
    expect(screen.getByText(GROWTH_CLOSING)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: RESERVE_LABEL });
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "home-arc");
  });
});
