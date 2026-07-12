import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";

// The four published /setup steps (lib/setup-steps.ts), inlined so the test
// stays self-contained — a direct "@/..." import from a test file is not
// covered by vite-tsconfig-paths' alias resolution.
const STEP_TITLES = [
  "Unbox and charge.",
  "Open the parent app.",
  "Teach the hello.",
  "Step back and listen.",
];

describe("HowItWorks", () => {
  it("renders the section heading", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: /Four steps\. No manual required\./i }),
    ).toBeInTheDocument();
  });

  it("renders one card per published setup step", () => {
    render(<HowItWorks />);
    for (const title of STEP_TITLES) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("links out to the full setup guide", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("link", { name: /Read the full setup guide/i }),
    ).toHaveAttribute("href", "/setup");
  });
});
