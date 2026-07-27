import { render, screen } from "@testing-library/react";
import { TiltCard } from "./TiltCard";

describe("TiltCard", () => {
  // setup's matchMedia stub returns matches:false, i.e. touch / no fine hover /
  // reduced-motion — the tilt must stay OFF and render a plain wrapper.
  it("renders its children on a plain div when the device cannot tilt", () => {
    const { container } = render(
      <TiltCard className="card-surface">Reserve your Lumi</TiltCard>,
    );
    expect(screen.getByText("Reserve your Lumi")).toBeInTheDocument();

    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root).toHaveClass("card-surface");
    // no tilt primitive => no 3D perspective wrapper style
    expect(root.style.perspective).toBe("");
  });

  it("still shows children with a custom maxTilt (no crash on prop pass-through)", () => {
    render(<TiltCard maxTilt={10}>Content</TiltCard>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("engages the tilt wrapper only when hover, fine pointer and motion are allowed", () => {
    const original = globalThis.matchMedia;
    // Report a capable device so the effect enables tilt.
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<TiltCard className="tilted">Playful depth</TiltCard>);
    expect(screen.getByText("Playful depth")).toBeInTheDocument();

    vi.stubGlobal("matchMedia", original);
  });
});
