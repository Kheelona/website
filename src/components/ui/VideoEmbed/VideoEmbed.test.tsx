import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ICON_PLAY } from "@/assets/icons.generated";
import { VideoEmbed, type VideoEmbedProps } from "./VideoEmbed";

/* VideoEmbed (task 8b.2c; ADR-014, journal-pipeline §7; ported from main:src/components/molecules/VideoEmbed.tsx).
   A journal video as a still in the DS photo frame at 16:9 (kh-photo kh-photo--wide) with the DS primary play button,
   until a reader presses it; then the player frame replaces the button and takes focus. Nothing from YouTube or Vimeo
   loads before the press: the still comes through this site's image optimiser. No tracking event, no motion of its
   own. Rendered through the real next/image (the shared test setup mocks it), so the addresses asserted are the ones
   Next writes. */
vi.unmock("next/image");

const SIZES = "(min-width: 732px) 700px, calc(100vw - 32px)";
const YOUTUBE: VideoEmbedProps = {
  provider: "youtube",
  videoId: "M7lc1UVf-VE",
  title: "How a story turns into a conversation",
  playLabel: "Play video:",
  caption: "Nothing loads from YouTube until you press play.",
  sizes: SIZES,
};
const VIMEO: VideoEmbedProps = { provider: "vimeo", videoId: "76979871", title: "A morning with Kheelu", playLabel: "Play video:", sizes: SIZES };

/** The hosts a reader's browser must not contact before the press (journal-pipeline §7). */
const VIDEO_HOSTS = /youtube|youtu\.be|ytimg|vimeo/i;
const ORIGIN = "https://kheelona.com";

/** Every address the server-rendered HTML hands the browser to fetch or frame, resolved against the site. */
function fetchedUrls(html: string): string[] {
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${html}`, "text/html");
  const urls: string[] = [];
  for (const el of doc.querySelectorAll("*")) {
    for (const attr of ["src", "href", "poster", "data", "action", "formaction"]) {
      const v = el.getAttribute(attr);
      if (v !== null) urls.push(v);
    }
    for (const attr of ["srcset", "imagesrcset"]) {
      const v = el.getAttribute(attr);
      if (v !== null) urls.push(...v.split(",").map((c) => c.trim().split(/\s+/)[0]));
    }
  }
  return urls.map((u) => new URL(u, ORIGIN).href);
}

describe("VideoEmbed: at rest (before the press)", () => {
  it("is the DS photo frame at 16:9 holding the still and the DS primary play button, then the caption", () => {
    const { container } = render(<VideoEmbed {...YOUTUBE} />);
    const figure = container.firstElementChild!;
    expect(figure.tagName).toBe("FIGURE");
    expect(figure.className).toBe("kh-photo kh-photo--wide ks-video");
    const [stage, caption] = [...figure.children];
    expect(stage.className).toBe("ks-video__stage");
    expect([...stage.children].map((c) => c.tagName)).toEqual(["IMG", "BUTTON"]);
    expect(caption.outerHTML).toBe('<figcaption class="kh-caption">Nothing loads from YouTube until you press play.</figcaption>');
  });

  it("names the play button with the content's word and the video's title; the DS play icon is hidden", () => {
    render(<VideoEmbed {...YOUTUBE} />);
    const button = screen.getByRole("button", { name: "Play video: How a story turns into a conversation" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toBe("kh-iconbtn kh-iconbtn--primary kh-iconbtn--l ks-video__play");
    const icon = button.querySelector("svg")!;
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon.querySelector("path")).toHaveAttribute("d", ICON_PLAY);
  });

  it("shows the still as a decorative, lazy image at the column's sizes (never the LCP image)", () => {
    const { container } = render(<VideoEmbed {...YOUTUBE} />);
    const still = container.querySelector("img")!;
    expect(still).toHaveAttribute("alt", "");
    expect(still).toHaveAttribute("loading", "lazy");
    expect(still).not.toHaveAttribute("fetchpriority");
    expect(still).toHaveAttribute("sizes", SIZES);
    expect(still).toHaveAttribute("width", "480");
    expect(still).toHaveAttribute("height", "360");
  });

  it("has no player frame and no <video> element", () => {
    const { container } = render(<VideoEmbed {...YOUTUBE} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.querySelector("video")).toBeNull();
  });

  /* The server's HTML is what the browser loads first: every address in it is this site's own (the still is
     /_next/image?url=…, fetched by the optimiser on the server), no preload is hoisted for the still, and the player
     hosts are not even named (the island builds the player address from the provider and the id on the press). */
  it.each([
    ["YouTube", YOUTUBE],
    ["Vimeo", VIMEO],
  ])("%s: the server HTML sends the browser to no YouTube, Vimeo or i.ytimg.com address", (_name, props) => {
    const html = renderToStaticMarkup(<VideoEmbed {...props} />);
    const urls = fetchedUrls(html);
    for (const url of urls) {
      expect(new URL(url).origin, url).toBe(ORIGIN);
      expect(new URL(url).pathname, url).not.toMatch(VIDEO_HOSTS);
    }
    expect(html).not.toMatch(/youtube-nocookie\.com|player\.vimeo\.com/);
    expect(html).not.toMatch(/<link[^>]+rel="preload"/);
    expect(html).not.toMatch(/<iframe|<video/);
  });

  it("YouTube: the still is the video's own, through the optimiser", () => {
    const urls = fetchedUrls(renderToStaticMarkup(<VideoEmbed {...YOUTUBE} />));
    expect(urls.length).toBeGreaterThan(1);
    for (const url of urls) {
      expect(new URL(url).pathname).toBe("/_next/image");
      expect(new URL(url).searchParams.get("url")).toBe("https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg");
    }
  });

  it("Vimeo: no still, the frame and the play button alone", () => {
    const { container } = render(<VideoEmbed {...VIMEO} />);
    expect(container.querySelector("img")).toBeNull();
    const stage = container.querySelector(".ks-video__stage")!;
    expect([...stage.children].map((c) => c.tagName)).toEqual(["BUTTON"]);
    expect(screen.getByRole("button", { name: "Play video: A morning with Kheelu" })).toBeInTheDocument();
  });

  it("without a caption: no figcaption", () => {
    const { container } = render(<VideoEmbed {...VIMEO} />);
    expect(container.querySelector("figcaption")).toBeNull();
    expect(container.firstElementChild!.children).toHaveLength(1);
  });
});

describe("VideoEmbed: the press", () => {
  it.each([
    ["YouTube", YOUTUBE, "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE?autoplay=1&rel=0&modestbranding=1"],
    ["Vimeo", VIMEO, "https://player.vimeo.com/video/76979871?autoplay=1&dnt=1"],
  ])("%s: the player frame replaces the button, named by the video's title, and takes focus", (_name, props, src) => {
    const { container } = render(<VideoEmbed {...props} />);
    fireEvent.click(screen.getByRole("button", { name: `Play video: ${props.title}` }));
    const frame = container.querySelector("iframe")!;
    expect(frame.className).toBe("ks-video__player");
    expect(frame).toHaveAttribute("src", src);
    expect(frame).toHaveAttribute("title", props.title);
    expect(frame).toHaveAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    expect(frame).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    expect(document.activeElement).toBe(frame);
    expect(screen.queryByRole("button")).toBeNull();
    expect(frame.parentElement!.className).toBe("ks-video__stage");
    expect(container.querySelector("video")).toBeNull();
  });
});

describe("VideoEmbed: no event, no motion of its own", () => {
  const DIR = join(process.cwd(), "src/components/ui/VideoEmbed");
  const SOURCES = ["VideoEmbed.tsx", "VideoEmbed.client.tsx", "embed.ts"].map((f) => readFileSync(join(DIR, f), "utf8"));

  /* No tracking event exists for a video (src/lib/tracking/events.ts; none for the films either): nothing here posts
     one, and the play button carries no autocapture attribute of its own (journal-pipeline §7). */
  it("imports nothing from the tracking module and marks nothing for capture", () => {
    for (const source of SOURCES) expect(source).not.toMatch(/lib\/tracking|posthog|fbq|gtag|components\/tracking/);
    const { container } = render(<VideoEmbed {...YOUTUBE} />);
    const attributes = [...container.querySelectorAll("*")].flatMap((el) => [...el.attributes].map((a) => a.name));
    expect(attributes.filter((name) => /^data-ph|^data-cta|^data-track/.test(name))).toEqual([]);
  });

  /* Architecture §11.3: no new motion hook, nothing autoplays before the press, not a reveal; the DS IconButton's own
     tap feedback is the only movement. */
  it("carries no motion hook and its CSS animates nothing", () => {
    const { container } = render(<VideoEmbed {...YOUTUBE} />);
    expect(container.querySelector("[data-reveal], [data-draw], .is-in, .is-focus")).toBeNull();
    const css = readFileSync(join(DIR, "video-embed.css"), "utf8");
    expect(css).not.toMatch(/\b(?:transition|animation)\b/);
  });
});

describe("VideoEmbed: refused content", () => {
  it("refuses a video with no title: it names the player and the play button", () => {
    expect(() => render(<VideoEmbed {...YOUTUBE} title=" " />)).toThrow(/title/);
  });

  it("refuses an id that is not one of the provider's", () => {
    expect(() => render(<VideoEmbed {...YOUTUBE} videoId="https://youtu.be/M7lc1UVf-VE" />)).toThrow(/video id/);
    expect(() => render(<VideoEmbed {...VIMEO} videoId="abc" />)).toThrow(/video id/);
  });
});
