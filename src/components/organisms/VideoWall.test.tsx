import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoWall } from "./VideoWall";
import { VIDEO_ASPECT, type VideoMoment } from "@/lib/video-moments";

const FIXTURES: readonly VideoMoment[] = ["one", "two", "three"].map((id) => ({
  id,
  chip: `Clip ${id}`,
  label: `What happens in clip ${id}.`,
  alt: `A child with Kheelu, clip ${id}.`,
  src: `/video/moments/${id}.mp4`,
  poster: `/video/moments/${id}.jpg`,
  width: VIDEO_ASPECT.width,
  height: VIDEO_ASPECT.height,
  hasOpenCaptions: true,
  consentOnFile: true,
}));

describe("VideoWall", () => {
  it("holds no <video> element at rest (§8.37-a)", () => {
    const { container } = render(<VideoWall moments={FIXTURES} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("shows the first film on the stage, with its title and caption", () => {
    render(<VideoWall moments={FIXTURES} />);
    expect(screen.getByRole("button", { name: "Play: Clip one" })).toBeInTheDocument();
    expect(screen.getAllByText("What happens in clip one.").length).toBeGreaterThan(0);
  });

  it("moves the stage when another film is picked from the list", async () => {
    const user = userEvent.setup();
    render(<VideoWall moments={FIXTURES} />);
    const list = screen.getByRole("list", { name: "More videos" });
    const two = within(list).getByRole("button", { name: /Clip two/ });
    await user.click(two);
    expect(two).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Play: Clip two" })).toBeInTheDocument();
  });

  it("mounts the player only inside the open dialog, and removes it on close", async () => {
    const user = userEvent.setup();
    render(<VideoWall moments={FIXTURES} />);
    await user.click(screen.getByRole("button", { name: "Play: Clip one" }));
    const dialog = await screen.findByRole("dialog", { name: "Clip one" });
    expect(dialog.querySelector("video")).toHaveAttribute("src", "/video/moments/one.mp4");
    await user.click(within(dialog).getByRole("button", { name: "Close video" }));
    expect(document.querySelector("video")).toBeNull();
  });

  it("renders no list for a single film", () => {
    render(<VideoWall moments={FIXTURES.slice(0, 1)} />);
    expect(screen.queryByRole("list", { name: "More videos" })).toBeNull();
  });
});
