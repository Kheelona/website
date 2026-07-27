import { render } from "@testing-library/react";
import { LaunchVideo } from "./LaunchVideo";

describe("LaunchVideo", () => {
  it("renders the muted launch video with its poster and source", () => {
    const { container } = render(<LaunchVideo />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("poster", "/video/launch-poster.jpg");
    expect(video).toHaveAttribute("src", "/video/launch.mp4");
    expect(video).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/short film of the Lumi talking toy/i),
    );
  });

  it("autoplays ambiently when motion and data are allowed", () => {
    // setup.ts stubs matchMedia -> { matches: false }, so no reduced-motion
    const { container } = render(<LaunchVideo />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("autoplay");
    expect(video).not.toHaveAttribute("controls");
  });

  it("does not autoplay when the user asks for reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as typeof window.matchMedia;
    try {
      const { container } = render(<LaunchVideo />);
      const video = container.querySelector("video")!;
      expect(video).not.toHaveAttribute("autoplay");
      expect(video).toHaveAttribute("controls");
    } finally {
      window.matchMedia = original;
    }
  });
});
