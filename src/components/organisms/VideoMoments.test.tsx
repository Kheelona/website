import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoMoments } from "./VideoMoments";
import {
  VIDEO_MOMENTS,
  VIDEO_MIN_TO_SHOW,
  VIDEO_ASPECT,
  type VideoMoment,
} from "@/lib/video-moments";

function moment(id: string, extra: Partial<VideoMoment> = {}): VideoMoment {
  return {
    id,
    chip: `Chip ${id}`,
    label: `Label ${id}`,
    alt: `Alt ${id}`,
    src: `/video/moments/${id}.mp4`,
    poster: `/video/moments/${id}.jpg`,
    preview: `/video/moments/${id}.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
    ...extra,
  };
}

const THREE = [moment("one"), moment("two"), moment("three")] as const;

beforeEach(() => {
  // jsdom has no layout, so the track has no scroll geometry. Give scrollTo a
  // body so the arrows and dots can be exercised without throwing.
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
});

afterEach(() => vi.restoreAllMocks());

describe("VideoMoments", () => {
  it("renders nothing below the minimum, so a half-stocked library shows no section", () => {
    const { container } = render(<VideoMoments moments={[moment("only")]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty library", () => {
    const { container } = render(<VideoMoments moments={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("the live VIDEO_MOMENTS list is still empty, so nothing ships on the site yet", () => {
    // Not a style assertion: it records that no real footage has landed. When
    // the founder adds rows this flips, and the assets test covers them.
    expect(VIDEO_MOMENTS.length).toBeLessThan(VIDEO_MIN_TO_SHOW);
    const { container } = render(<VideoMoments />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one tile per moment, with its chip and label", () => {
    render(<VideoMoments moments={THREE} />);
    for (const m of THREE) {
      expect(screen.getByText(m.chip)).toBeInTheDocument();
      expect(screen.getByText(m.label)).toBeInTheDocument();
    }
  });

  /* ── THE GATE GUARD ───────────────────────────────────────────────────── */

  it("puts NO video element in the DOM at rest (axe video-caption is critical)", () => {
    // axe-core 4.12.1: `video-caption` is selector 'video' with NO matcher and
    // impact 'critical', so any <video> present on load fails qa:sweep on both
    // the home page and the checkout page. If this test ever fails, the sweep
    // is already broken and the fix is here, not in the sweep's allow-list.
    const { container } = render(<VideoMoments moments={THREE} />);
    expect(container.querySelectorAll("video")).toHaveLength(0);
  });

  it("still has no video element after the carousel is advanced", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /next video/i }));
    await user.click(screen.getByRole("button", { name: /previous video/i }));
    await user.click(screen.getByRole("button", { name: /show video 3 of 3/i }));
    expect(container.querySelectorAll("video")).toHaveLength(0);
  });

  /* ── Playback ─────────────────────────────────────────────────────────── */

  it("mounts exactly one video, with the right source, when a tile is played", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip two/i }));
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(videos[0]).toHaveAttribute("src", "/video/moments/two.mp4");
  });

  it("never renders a caption track, because captions are burned into the file", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip one/i }));
    expect(container.querySelectorAll("track")).toHaveLength(0);
  });

  it("plays one at a time: opening a second tile unmounts the first", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip one/i }));
    expect(container.querySelector("video")).toHaveAttribute(
      "src",
      "/video/moments/one.mp4",
    );
    await user.click(screen.getByRole("button", { name: /Play: Chip three/i }));
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(videos[0]).toHaveAttribute("src", "/video/moments/three.mp4");
  });

  it("uses object-contain on the video so burned-in subtitles are never cropped", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip one/i }));
    expect(container.querySelector("video")?.className).toContain("object-contain");
  });

  /* ── Degradation ──────────────────────────────────────────────────────── */

  it("a still that fails to load loses its play control and keeps its label", () => {
    render(<VideoMoments moments={THREE} />);
    fireEvent.error(screen.getByAltText("Alt two"));
    expect(screen.queryByRole("button", { name: /Play: Chip two/i })).toBeNull();
    // the words survive, which is the whole point of degrading rather than hiding
    expect(screen.getByText("Label two")).toBeInTheDocument();
    expect(screen.getByText("Chip two")).toBeInTheDocument();
  });

  it("a video that fails after opening falls back rather than leaving a dead frame", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip one/i }));
    fireEvent.error(container.querySelector("video") as HTMLVideoElement);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(screen.getByText("Label one")).toBeInTheDocument();
  });

  /* ── The LCP law ──────────────────────────────────────────────────────── */

  it("marks nothing priority, so the hero plush keeps the LCP on both pages", () => {
    const { container } = render(<VideoMoments moments={THREE} />);
    expect(container.querySelectorAll("[data-priority]")).toHaveLength(0);
  });

  /* ── Motion ───────────────────────────────────────────────────────────── */

  it("does not rotate when reduced motion is preferred, and offers to start it", () => {
    // test/setup.ts stubs matchMedia to matches:false, i.e. the visitor does
    // NOT have "no-preference", i.e. reduced motion. The control must read
    // "Play", never "Pause".
    render(<VideoMoments moments={THREE} />);
    expect(
      screen.getByRole("button", { name: /play the video carousel/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /pause the video carousel/i }),
    ).toBeNull();
  });

  it("shows stills, never the animated loop, while motion is off", () => {
    const { container } = render(<VideoMoments moments={THREE} />);
    expect(container.querySelector("picture")).toBeNull();
    expect(container.querySelectorAll("img")).toHaveLength(THREE.length);
    for (const m of THREE) {
      expect(screen.getByAltText(m.alt)).toHaveAttribute("src", m.poster);
    }
  });

  it("offers a single control for everything that moves (WCAG 2.2.2)", async () => {
    const user = userEvent.setup();
    render(<VideoMoments moments={THREE} />);
    const toggle = screen.getByRole("button", { name: /play the video carousel/i });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: /pause the video carousel/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("runs the silent loop on the centred tile, as a plain img so axe ignores it", () => {
    // Drive the observer by hand: capture the callback the component registers
    // and report the middle tile as intersecting the centre band.
    let fire: ((entries: unknown[]) => void) | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: unknown[]) => void) {
          fire = cb;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = () => [];
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    );
    // motion welcome, so the loop is allowed to run
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<VideoMoments moments={THREE} />);
    const tile = container.querySelector('[data-video-id="two"]');
    act(() => fire?.([{ isIntersecting: true, target: tile }]));

    const picture = container.querySelector("picture");
    expect(picture).not.toBeNull();
    // the animated file, not the still, and NOT through next/image
    const img = within(picture as HTMLElement).getByAltText("Alt two");
    expect(img).toHaveAttribute("src", "/video/moments/two.webp");
    // and the reduced-motion fallback is declared in CSS, before any script
    const source = picture?.querySelector("source");
    expect(source).toHaveAttribute("media", "(prefers-reduced-motion: reduce)");
    expect(source).toHaveAttribute("srcset", "/video/moments/two.jpg");

    // the other two tiles stay still
    expect(container.querySelectorAll("picture")).toHaveLength(1);
  });

  /* ── Controls ─────────────────────────────────────────────────────────── */

  it("gives one labelled dot per video and marks the centred one", () => {
    let fire: ((entries: unknown[]) => void) | null = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: unknown[]) => void) {
          fire = cb;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = () => [];
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    );
    const { container } = render(<VideoMoments moments={THREE} />);
    expect(screen.getByRole("button", { name: "Show video 1 of 3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show video 3 of 3" })).toBeInTheDocument();

    act(() =>
      fire?.([
        { isIntersecting: true, target: container.querySelector('[data-video-id="three"]') },
      ]),
    );
    expect(screen.getByRole("button", { name: "Show video 3 of 3" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Show video 1 of 3" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("scrolls the track when an arrow or a dot is used", async () => {
    const user = userEvent.setup();
    render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /next video/i }));
    expect(Element.prototype.scrollTo).toHaveBeenCalled();
  });

  it("stops rotating as soon as the visitor takes over", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<VideoMoments moments={THREE} />);
    // motion is welcome, so it starts rotating
    expect(
      screen.getByRole("button", { name: /pause the video carousel/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next video/i }));
    expect(
      screen.getByRole("button", { name: /play the video carousel/i }),
    ).toBeInTheDocument();
  });

  it("stops rotating when a video is opened", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<VideoMoments moments={THREE} />);
    await user.click(screen.getByRole("button", { name: /Play: Chip one/i }));
    expect(
      screen.getByRole("button", { name: /play the video carousel/i }),
    ).toBeInTheDocument();
  });

  it("names the tile button with both the chip and the label", () => {
    render(<VideoMoments moments={THREE} />);
    expect(
      screen.getByRole("button", { name: "Play: Chip one. Label one" }),
    ).toBeInTheDocument();
  });

  it("declares each tile's aspect from the data, so nothing shifts while loading", () => {
    const { container } = render(<VideoMoments moments={THREE} />);
    const frame = container.querySelector('[data-video-id="one"] div');
    expect((frame as HTMLElement).style.aspectRatio).toBe("1080 / 1920");
  });
});
