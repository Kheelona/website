import { render, screen } from "@testing-library/react";
import { TrustRoom, SAFETY_POINTS, VOICE_PATH } from "./TrustRoom";

describe("TrustRoom (CMO merge, 2026-10-04)", () => {
  it("answers the four things parents ask first", () => {
    render(<TrustRoom />);
    expect(
      screen.getByRole("heading", { level: 2, name: "What Kheelu can and cannot do." }),
    ).toBeInTheDocument();
    for (const p of SAFETY_POINTS) {
      expect(screen.getByRole("heading", { level: 3, name: p.h })).toBeInTheDocument();
    }
  });

  /* Content doc v7 Appendix B: the mic listens for the wake word, so it is
     never described as "off" (the 2026-10-04 sweep). */
  it("describes the microphone accurately, never as off", () => {
    const { container } = render(<TrustRoom />);
    expect(container.textContent).toMatch(/until your child says the wake word/);
    expect(container.textContent).not.toMatch(/mic(rophone)? is off|Not muted/i);
  });

  it("traces the voice to Kheelona's own servers in India (founder-confirmed)", () => {
    render(<TrustRoom />);
    for (const stop of VOICE_PATH) expect(screen.getByText(stop)).toBeInTheDocument();
    expect(VOICE_PATH[1]).toBe("Our own servers, in India");
  });

  it("keeps the data promise and the deep dive to /safety", () => {
    render(<TrustRoom />);
    expect(screen.getByText(/Never sold\./)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See how safety works" })).toHaveAttribute(
      "href",
      "/safety",
    );
  });

  it("speaks in the site's voice: no contractions outside Kheelu's own speech", () => {
    const { container } = render(<TrustRoom />);
    const text = container.textContent!.replace(/child's voice/g, "");
    expect(text).not.toMatch(/\b\w+n't\b|\bit's\b/i);
  });
});
