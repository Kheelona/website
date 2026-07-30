import { act, fireEvent, render, screen } from "@testing-library/react";
import { AudioMoments } from "./AudioMoments";
import type { AudioMomentData } from "@/lib/audio-moments";

const MOMENTS: readonly AudioMomentData[] = [
  {
    id: "knight",
    chip: "Thinking games",
    transcript: "Oh no, the bridge is out!",
    src: "/audio/lumi-demo-knight.mp3",
  },
  {
    id: "apples",
    chip: "Numbers",
    transcript: "We have 4 apples for our picnic.",
    src: "/audio/lumi-demo-apples.mp3",
  },
];

/* jsdom has no media pipeline: play()/pause() are stubbed to fire the same
   events a browser would, which is exactly what the component listens to. */
beforeEach(() => {
  vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(
    function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    },
  );
  vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(
    function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event("pause"));
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AudioMoments", () => {
  it("renders a labelled play control and a visible transcript per moment", () => {
    render(<AudioMoments moments={MOMENTS} />);
    expect(screen.getByRole("button", { name: "Play: Thinking games" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play: Numbers" })).toBeInTheDocument();
    // the transcript is always-visible content, not an alternative
    expect(screen.getByText("Oh no, the bridge is out!")).toBeInTheDocument();
    expect(screen.getByText("We have 4 apples for our picnic.")).toBeInTheDocument();
  });

  it("plays on press and reflects the state on the control", () => {
    render(<AudioMoments moments={MOMENTS} />);
    const play = window.HTMLMediaElement.prototype.play;
    fireEvent.click(screen.getByRole("button", { name: "Play: Thinking games" }));
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Pause: Thinking games" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lets only one moment speak at a time", () => {
    render(<AudioMoments moments={MOMENTS} />);
    fireEvent.click(screen.getByRole("button", { name: "Play: Thinking games" }));
    fireEvent.click(screen.getByRole("button", { name: "Play: Numbers" }));
    // the first card went back to its at-rest control
    expect(screen.getByRole("button", { name: "Play: Thinking games" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Pause: Numbers" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("degrades a broken file to a transcript-only card, never a dead button", () => {
    const { container } = render(<AudioMoments moments={MOMENTS} />);
    const first = container.querySelector('audio[src="/audio/lumi-demo-knight.mp3"]')!;
    fireEvent.error(first);
    expect(screen.queryByRole("button", { name: "Play: Thinking games" })).toBeNull();
    expect(screen.getByText("Oh no, the bridge is out!")).toBeInTheDocument();
    // the healthy card keeps its control
    expect(screen.getByRole("button", { name: "Play: Numbers" })).toBeInTheDocument();
  });

  it("folds to transcript-only when a file hangs without data (the 404 that never errors)", () => {
    vi.useFakeTimers();
    try {
      render(<AudioMoments moments={MOMENTS} />);
      // jsdom media elements sit at readyState 0 forever — exactly the
      // hang this guards against
      fireEvent.click(screen.getByRole("button", { name: "Play: Thinking games" }));
      act(() => {
        vi.advanceTimersByTime(4100);
      });
      expect(screen.queryByRole("button", { name: /Thinking games/ })).toBeNull();
      expect(screen.getByText("Oh no, the bridge is out!")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("never preloads audio (mobile data respect)", () => {
    const { container } = render(<AudioMoments moments={MOMENTS} />);
    container.querySelectorAll("audio").forEach((el) => {
      expect(el).toHaveAttribute("preload", "none");
    });
  });
});
