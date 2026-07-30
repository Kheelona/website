import { fireEvent, render, screen } from "@testing-library/react";
import { ArchitectureStack, type ArchLayer } from "./ArchitectureStack";

const ABOVE: readonly ArchLayer[] = [
  {
    id: "companion",
    name: "Physical AI companion",
    blurb: "The part your child hugs.",
    chips: ["Screen free", "Educational"],
    tint: "bg-white",
  },
  {
    id: "app",
    name: "Mobile application",
    blurb: "The part parents hold.",
    chips: ["Dashboard", "Progress reports"],
    tint: "bg-white",
  },
];

const BELOW: readonly ArchLayer[] = [
  {
    id: "cloud",
    name: "Cloud and AI engine",
    blurb: "The brain when a turn needs more.",
    chips: ["Voice-to-voice AI", "Safety filters"],
    tint: "bg-cool",
  },
  {
    id: "hardware",
    name: "Hardware",
    blurb: "The body under the fur.",
    chips: ["Custom PCB", "USB-C charging"],
    tint: "bg-orange/15",
  },
];

describe("ArchitectureStack", () => {
  it("renders every layer's name and blurb, always visible", () => {
    render(<ArchitectureStack above={ABOVE} below={BELOW} />);
    for (const l of [...ABOVE, ...BELOW]) {
      expect(screen.getByText(l.name)).toBeInTheDocument();
      expect(screen.getByText(l.blurb)).toBeInTheDocument();
    }
  });

  it("draws the waterline between what families see and what gets built", () => {
    render(<ArchitectureStack above={ABOVE} below={BELOW} />);
    expect(screen.getByText("What families see")).toBeInTheDocument();
    expect(screen.getByText("What we build underneath")).toBeInTheDocument();
  });

  it("opens the first layer at rest and swaps on tap (one at a time)", () => {
    render(<ArchitectureStack above={ABOVE} below={BELOW} />);
    // first layer open at rest (the Faq precedent)
    expect(screen.getByText("Screen free")).toBeInTheDocument();
    const cloudTrigger = screen.getByRole("button", { name: /Cloud and AI engine/i });
    expect(cloudTrigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(cloudTrigger);
    expect(cloudTrigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Voice-to-voice AI")).toBeInTheDocument();
    // the companion layer closed in its place
    expect(
      screen.getByRole("button", { name: /Physical AI companion/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes real button semantics for every layer (tap parity, keyboard included)", () => {
    render(<ArchitectureStack above={ABOVE} below={BELOW} />);
    expect(screen.getAllByRole("button")).toHaveLength(ABOVE.length + BELOW.length);
  });
});
