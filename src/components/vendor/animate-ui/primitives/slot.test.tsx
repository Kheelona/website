// Slot calls motion.create(children.type) to promote its child to a motion
// component. The shared setup mocks motion as a tag Proxy (no working `create`),
// so we override motion/react LOCALLY here: create -> identity element type,
// isMotionComponent -> false. Runtime render behavior is what we assert.
vi.mock("motion/react", async () => {
  const React = await import("react");
  return {
    motion: { create: (Comp: React.ElementType) => Comp },
    isMotionComponent: () => false,
  };
});

import { render, screen } from "@testing-library/react";
import { Slot } from "./slot";

describe("Slot", () => {
  it("renders its single child element and forwards slot props onto it", () => {
    render(
      <Slot data-testid="slot">
        <button type="button">Slotted</button>
      </Slot>,
    );
    const btn = screen.getByRole("button", { name: "Slotted" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("data-testid", "slot");
  });

  it("merges the slot className with the child className", () => {
    // non-Tailwind tokens: real utilities in the same group (e.g. from-*) would
    // be de-duplicated by tailwind-merge inside cn().
    render(
      <Slot className="slotmark">
        <button type="button" className="childmark">
          Go
        </button>
      </Slot>,
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("slotmark");
    expect(btn.className).toContain("childmark");
  });
});
