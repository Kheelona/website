import { render, screen } from "@testing-library/react";
import { LumiModes, LUMI_MODES } from "./LumiModes";

describe("LumiModes", () => {
  it("names all three modes in the full section", () => {
    render(<LumiModes />);
    expect(screen.getByRole("heading", { name: "Talk about anything." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learn inside a story." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Play your own music." })).toBeInTheDocument();
    for (const m of ["AI mode", "Kheelu mode", "Bluetooth mode"]) {
      expect(screen.getByText(m)).toBeInTheDocument();
    }
  });

  it("leads with the value: one toy, not one trick", () => {
    render(<LumiModes />);
    expect(screen.getByText("One toy, three modes")).toBeInTheDocument();
    expect(
      screen.getByText("One friend your child talks to, learns from, and dances to."),
    ).toBeInTheDocument();
  });

  /* Gate V3-b: Bluetooth is a MODE, never what you are left with if the
     subscription lapses — the founder has not stated post-lapse behaviour. */
  it("never frames Bluetooth as a subscription fallback", () => {
    const { container } = render(<LumiModes />);
    expect(container.textContent).not.toMatch(/without (a |the )?subscription|even if|lapses|expires|still works/i);
  });

  it("keeps list semantics in both variants", () => {
    const { container, rerender } = render(<LumiModes />);
    expect(container.querySelectorAll("ul > li").length).toBe(3);
    rerender(<LumiModes variant="strip" />);
    expect(container.querySelectorAll("ul > li").length).toBe(3);
  });

  it("the compact strip states the same three modes, shorter", () => {
    render(<LumiModes variant="strip" />);
    expect(screen.getByText(/One toy, three modes/)).toBeInTheDocument();
    for (const m of LUMI_MODES) {
      expect(screen.getByText(m.short)).toBeInTheDocument();
      expect(screen.getByText(m.mode)).toBeInTheDocument();
    }
  });
});
