import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilmsStrip, type FilmsStripProps } from "./FilmsStrip";

/* FilmsStrip (task 3.3; components §2; D040, D049 pick 8; architecture §10, §11.2 row 8): the seven parent films on Home
 * (fold 2), the product page (fold 2) and the store (fold 6). The markup is compared class by class (mk- renamed ks-)
 * with each approved strip; the behaviour of mockup.js sections 4 and 5 is driven here with the browser APIs jsdom
 * lacks stood in for (IntersectionObserver, media playback). Layout-dependent behaviour (positions, ends, the focus
 * scale) runs in a real browser: test/e2e/films.spec.ts and motion-films.spec.ts. */
vi.unmock("next/image");

const doc = (slug: string) =>
  new DOMParser().parseFromString(readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8"), "text/html");
const strip = (slug: string) => doc(slug).querySelector("[data-films]")!.closest("section")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

const RENAME: Record<string, string[]> = {
  "mk-films-wrap": ["ks-films-wrap"],
  "mk-films": ["ks-films"],
  "mk-film": ["ks-film"],
  "mk-film__meta": ["ks-film__meta"],
  "mk-film__time": ["ks-film__time"],
  "mk-film__frame": ["ks-film__frame"],
  "mk-film__play": ["ks-film__play"],
  "mk-film__caption": ["ks-film__caption"],
  "mk-films-proof": ["ks-films-proof"],
  "mk-films-ctrl": ["ks-films-ctrl"],
  "mk-nowrap": ["ks-nowrap"],
};

function shape(el: Element, depth = 0): string[] {
  const classes = [...el.classList].flatMap((c) => RENAME[c] ?? [c]);
  // The film chips switch to the page cream on the band (mockup.css:137; Chip `onBand`, DS gap G-19).
  if (el.classList.contains("kh-chip")) classes.push("ks-chip--on-band");
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${[...new Set(classes)].sort().map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (el.tagName.toLowerCase() === "svg") return [line];
  return [line, ...[...el.children].flatMap((c) => shape(c, depth + 1))];
}

/** The section with whatever follows the strip (the CTA block, the store's link) replaced by the test's stand-in. */
function withAfterSlot(section: Element): Element {
  const wrap = section.querySelector(".mk-films-wrap")!;
  while (wrap.nextElementSibling) wrap.nextElementSibling.remove();
  const slot = section.ownerDocument.createElement("div");
  slot.className = "after-slot";
  wrap.after(slot);
  return section;
}

/** The films as content holds them (content/en-IN/films.ts), read from the approved strip. */
const filmsFrom = (section: Element): FilmsStripProps["films"] =>
  [...section.querySelectorAll(".mk-film")].map((li) => {
    const img = li.querySelector("img")!;
    const id = li.getAttribute("data-video-id")!;
    return {
      id,
      chip: norm(li.querySelector(".kh-chip")?.textContent),
      caption: norm(li.querySelector(".mk-film__caption")?.textContent),
      duration: norm(li.querySelector(".mk-film__time")?.textContent).replace(/^Length /, "") as `${number}:${number}`,
      poster: { src: `/video/moments/${id}.jpg`, width: 1080, height: 1920, alt: img.getAttribute("alt")! },
      video: `/video/moments/${id}.mp4`,
    };
  });

const LABELS = { listLabel: "Seven films of families with Kheelu", previous: "Previous video", next: "Next video", length: "Length", play: "Play:", of: "of" };

const home = strip("home");
const PROPS: FilmsStripProps = {
  heading: {
    eyebrow: "See it ask",
    title: "Kheelu asks. Watch them {hand:think.}",
    lead: norm(home.querySelector(".kh-heading__lead")?.textContent),
    id: "ask-title",
  },
  films: filmsFrom(home),
  labels: LABELS,
  proof: { text: norm(home.querySelector(".mk-films-proof")?.textContent), size: "body-s" },
  posters: "eager-low",
};

/* Browser APIs jsdom lacks: an IntersectionObserver whose callbacks the test calls, and media playback. */
type Entry = Partial<IntersectionObserverEntry> & { target: Element };
class TestObserver {
  static all: TestObserver[] = [];
  readonly targets: Element[] = [];
  constructor(
    readonly callback: (entries: Entry[]) => void,
    readonly options: IntersectionObserverInit = {},
  ) {
    TestObserver.all.push(this);
  }
  observe = (el: Element) => void this.targets.push(el);
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}
const original = globalThis.IntersectionObserver;
let play: ReturnType<typeof vi.spyOn>;
let pause: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  TestObserver.all = [];
  vi.stubGlobal("IntersectionObserver", TestObserver);
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  vi.stubGlobal("IntersectionObserver", original);
  play.mockRestore();
  pause.mockRestore();
});

/** Every play button in the strip's order, the one hidden behind a playing film included (a hidden element has no
 *  accessible name, so the role query would skip it and shift the order). */
const playButtons = () => [...document.querySelectorAll<HTMLButtonElement>("button.ks-film__play")];

describe("FilmsStrip: the approved markup", () => {
  it("Home fold 2: the centred heading, the strip, the proof line and the controls, then the CTA block", () => {
    const { container } = render(<FilmsStrip {...PROPS} after={<div className="after-slot" />} />);
    const expected = withAfterSlot(strip("home"));
    expect(shape(container.firstElementChild!)).toEqual(shape(expected));
    expect(words(container.textContent)).toBe(words(expected.textContent));
  });

  it("product fold 2: the #films fragment and the proof line in the caption style", () => {
    const section = strip("meet-kheelu");
    const { container } = render(
      <FilmsStrip
        {...PROPS}
        id="films"
        heading={{ eyebrow: "Real homes", title: "Seven families, in their {hand:own homes.}", lead: norm(section.querySelector(".kh-heading__lead")?.textContent), id: "films-title" }}
        proof={{ text: norm(section.querySelector(".mk-films-proof")?.textContent), size: "caption" }}
        posters="lazy"
      />,
    );
    expect(shape(container.firstElementChild!)).toEqual(shape(section));
    expect(words(container.textContent)).toBe(words(section.textContent));
    expect(container.querySelector("section")).toHaveAttribute("id", "films");
  });

  it("store fold 6: no eyebrow, and the link back to the form after the strip", () => {
    const section = strip("store");
    const { container } = render(
      <FilmsStrip
        {...PROPS}
        heading={{ title: "See Kheelu {nowrap:{hand:ask},} in real homes.", lead: norm(section.querySelector(".kh-heading__lead")?.textContent), id: "ask-title" }}
        posters="lazy"
        link={{ label: "Back to your details", href: "#details", icon: "caret-up" }}
      />,
    );
    expect(shape(container.firstElementChild!)).toEqual(shape(section));
    expect(words(container.textContent)).toBe(words(section.textContent));
  });
});

describe("FilmsStrip: films at rest", () => {
  it("has no <video> at rest (axe video-caption), one play button per film labelled 'Play: {chip}. {caption}'", () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    expect(container.querySelector("video")).toBeNull();
    expect(playButtons().map((b) => b.getAttribute("aria-label"))).toEqual(PROPS.films.map((f) => `Play: ${f.chip}. ${f.caption}`));
    expect(screen.getByRole("list", { name: LABELS.listLabel })).toHaveAttribute("data-films");
  });

  it("Home: the first three posters load eagerly at low priority (never competing with the LCP image), the rest lazily", () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    const posters = [...container.querySelectorAll(".ks-film__frame img")];
    expect(posters.map((p) => p.getAttribute("loading"))).toEqual(["eager", "eager", "eager", "lazy", "lazy", "lazy", "lazy"]);
    expect(posters.map((p) => p.getAttribute("fetchpriority"))).toEqual(["low", "low", "low", null, null, null, null]);
    expect(posters[0]).toHaveAttribute("alt", PROPS.films[0].poster.alt);
  });

  it("product and store: every poster is lazy", () => {
    const { container } = render(<FilmsStrip {...PROPS} posters="lazy" />);
    expect([...container.querySelectorAll(".ks-film__frame img")].every((p) => p.getAttribute("loading") === "lazy" && !p.hasAttribute("fetchpriority"))).toBe(true);
  });

  it("reads '1 of 7' and starts with Previous disabled; the controls are named", () => {
    render(<FilmsStrip {...PROPS} />);
    expect(screen.getByRole("button", { name: "Previous video" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next video" })).toBeEnabled();
    expect(screen.getByText("1 of 7")).toHaveAttribute("aria-live", "polite");
  });

  it("prints each length with its word for screen readers only", () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    const time = container.querySelector(".ks-film__time")!;
    expect(time.querySelector(".kh-sr")).toHaveTextContent("Length");
    expect(norm(time.textContent)).toBe("Length 0:30");
  });
});

describe("FilmsStrip: playback (mockup.js section 5)", () => {
  it("a tap swaps the poster for the film with native controls and plays it, focused, one at a time", async () => {
    // jsdom does not treat a <video controls> as focusable; the browser does (films.spec.ts checks the real focus).
    const focused: Element[] = [];
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement) {
      focused.push(this);
    });
    const { container } = render(<FilmsStrip {...PROPS} />);
    await act(async () => fireEvent.click(playButtons()[0]));
    const video = container.querySelector("video")!;
    expect(video).not.toBeNull();
    expect(video.getAttribute("src")).toBe("/video/moments/learning-by-asking.mp4");
    expect(video.controls).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("aria-label", `${PROPS.films[0].chip}. ${PROPS.films[0].caption}`);
    expect(video.closest(".ks-film__frame")?.querySelector(".ks-film__play")).toHaveAttribute("hidden");
    expect(focused).toEqual([video]);
    focusSpy.mockRestore();
    expect(play).toHaveBeenCalledTimes(1);

    await act(async () => fireEvent.click(playButtons()[1]));
    expect(container.querySelectorAll("video")).toHaveLength(1);
    expect(container.querySelector("video")?.getAttribute("src")).toBe("/video/moments/first-conversations.mp4");
    expect(container.querySelectorAll(".ks-film__play[hidden]")).toHaveLength(1);
  });

  it("pauses the film when less than half of it is on screen", async () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    await act(async () => fireEvent.click(playButtons()[2]));
    const video = container.querySelector("video")!;
    const away = TestObserver.all.find((o) => o.targets.includes(video))!;
    expect(away.options.threshold).toBe(0.5);
    act(() => away.callback([{ target: video, intersectionRatio: 0.3, isIntersecting: true }]));
    expect(pause).toHaveBeenCalled();
  });

  it("brings the poster back when the film ends and returns focus to its play button", async () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    await act(async () => fireEvent.click(playButtons()[3]));
    await act(async () => fireEvent.ended(container.querySelector("video")!));
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector(".ks-film__play[hidden]")).toBeNull();
    expect(document.activeElement).toBe(playButtons()[3]);
  });
});

describe("FilmsStrip: the film in focus (D049 pick 8)", () => {
  it("watches the strip's central band and marks the film most inside it is-focus, one at a time", () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    const track = container.querySelector("[data-films]")!;
    const band = TestObserver.all.find((o) => o.options.root === track)!;
    expect(band.options.rootMargin).toBe("0px -33% 0px -33%");
    const tiles = [...track.children];
    act(() =>
      band.callback([
        { target: tiles[0], intersectionRect: { width: 40 } as DOMRectReadOnly },
        { target: tiles[1], intersectionRect: { width: 300 } as DOMRectReadOnly },
        { target: tiles[2], intersectionRect: { width: 0 } as DOMRectReadOnly },
      ]),
    );
    expect(tiles.map((t) => t.classList.contains("is-focus"))).toEqual([false, true, false, false, false, false, false]);
    act(() => band.callback([{ target: tiles[2], intersectionRect: { width: 320 } as DOMRectReadOnly }]));
    expect(container.querySelectorAll(".is-focus")).toHaveLength(1);
    expect(tiles[2]).toHaveClass("ks-film", "is-focus");
  });
});
