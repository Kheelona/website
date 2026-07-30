import { render, screen } from "@testing-library/react";
import { HowItWorksLoop, type LoopStep } from "./HowItWorksLoop";

const STEPS: readonly LoopStep[] = [
  { title: "Talk and play", label: "Step 1", body: "Your child asks questions." },
  { title: "Lumi remembers", label: "Step 2 · Adaptive memory", body: "Lumi keeps track." },
  { title: "Knowledge that sticks", label: "Step 3 · Real-world learning", body: "Ideas arrive in play." },
];

describe("HowItWorksLoop", () => {
  it("renders every step with its title, label, and body", () => {
    render(<HowItWorksLoop steps={STEPS} repeatNote="Then it begins again." />);
    for (const s of STEPS) {
      expect(screen.getByText(s.title)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
      expect(screen.getByText(s.body)).toBeInTheDocument();
    }
    expect(screen.getByText("Then it begins again.")).toBeInTheDocument();
  });

  it("is fully readable with no interaction: no buttons, no hidden content", () => {
    render(<HowItWorksLoop steps={STEPS} repeatNote="Again." />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("walks the cycle with a decorative opacity-only glow per step", () => {
    const { container } = render(
      <HowItWorksLoop steps={STEPS} repeatNote="Again." />,
    );
    const glows = container.querySelectorAll(".loop-step-glow");
    expect(glows).toHaveLength(3);
    glows.forEach((g) => expect(g).toHaveAttribute("aria-hidden", "true"));
    // staggered a third of the period each (the delay rides the card's
    // custom property), so only one card glows at a time
    const delays = Array.from(
      container.querySelectorAll<HTMLElement>(".loop-step"),
    ).map((s) => s.style.getPropertyValue("--loop-delay"));
    expect(new Set(delays).size).toBe(3);
  });
});
