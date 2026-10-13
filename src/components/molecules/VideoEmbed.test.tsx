import { fireEvent, render, screen } from "@testing-library/react";
import { VideoEmbed, embedUrl, thumbnailUrl } from "./VideoEmbed";

describe("VideoEmbed", () => {
  it("loads nothing from the video host until a reader presses play", () => {
    const { container } = render(<VideoEmbed provider="youtube" videoId="dQw4w9WgXcQ" title="A film" />);
    expect(container.querySelector("iframe")).toBeNull();
    /* No <video> at rest either: axe's video-caption rule is critical (§8.37-a). */
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("button", { name: "Play video: A film" })).toBeTruthy();
  });

  it("swaps in the privacy-enhanced player on press", () => {
    const { container } = render(<VideoEmbed provider="youtube" videoId="dQw4w9WgXcQ" title="A film" />);
    fireEvent.click(screen.getByRole("button", { name: /play video/i }));
    const frame = container.querySelector("iframe");
    expect(frame?.getAttribute("src")).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ\?/);
    expect(frame?.getAttribute("title")).toBe("A film");
  });

  it("builds the player URL itself, so a post can embed only YouTube or Vimeo", () => {
    expect(embedUrl("vimeo", "76979871")).toMatch(/^https:\/\/player\.vimeo\.com\/video\/76979871\?.*dnt=1/);
    expect(embedUrl("youtube", '"><script>')).not.toContain("<script>");
    expect(thumbnailUrl("vimeo", "1")).toBeNull();
  });

  it("names the video for a screen reader even without a title", () => {
    render(<VideoEmbed provider="vimeo" videoId="76979871" caption="" />);
    expect(screen.getByRole("button", { name: "Play video: Vimeo video" })).toBeTruthy();
  });
});
