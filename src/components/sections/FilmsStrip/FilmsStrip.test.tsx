import { act, fireEvent, render, screen } from "@testing-library/react";
import postcss, { type AtRule, type Rule } from "postcss";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ICON_PLAY } from "@/assets/icons.generated";
import { expertClip, expertFold } from "@/content/en-IN/expert-video";
import { filmQuotes, films, filmsStrip } from "@/content/en-IN/films";
import { COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { outline, parseMockup } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { FilmsStrip, type FilmsStripConfig, type FilmsStripProps } from "./FilmsStrip";
import { FilmClipIsland } from "./FilmsStrip.client";
import storiesMeta, * as stories from "./FilmsStrip.stories";

/* FilmsStrip (task 3.3; components §2; D040, D049 pick 8; architecture §10, §11.2 row 8): the seven parent films on Home
 * (fold 2), the product page (fold 2) and the store (fold 6). The markup is compared class by class (mk- renamed ks-)
 * with each approved strip through the mockup comparison harness (test/support/mockup-compare.ts); the behaviour of
 * mockup.js sections 4 and 5 is driven here with the browser APIs jsdom lacks stood in for (IntersectionObserver, media
 * playback). Layout-dependent behaviour (positions, ends, the focus scale) runs in a real browser: test/e2e/films.spec.ts
 * and motion-films.spec.ts. */
vi.unmock("next/image");

const strip = (slug: string) => parseMockup(slug).querySelector("[data-films]")!.closest("section")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

/** The film chips switch to the page cream on the band (mockup.css:137; Chip `onBand`, DS gap G-19). Every mockup block
 *  of the strip takes its ks- name. */
const onBand = (el: Element) => (el.classList.contains("kh-chip") ? ["ks-chip--on-band"] : []);
const shape = (el: Element) => outline(el, { extra: onBand });

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
const filmsFrom = (section: Element): FilmsStripConfig["films"] =>
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

const LABELS = filmsStrip;

const home = strip("home");
const PROPS: FilmsStripConfig = {
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
    // The approved strip with the heading the founder changed: no count of families, no place (D056 item 2, D057 item 2;
    // deviation V17).
    const main = withFacts(parseMockup("meet-kheelu").querySelector("main")!, COPY_FIXES["meet-kheelu"].edits);
    const section = main.querySelector("[data-films]")!.closest("section")!;
    const title = "Real children, {hand:real families.}";
    expect(stories.Product.args?.heading?.title).toBe(title);
    const { container } = render(
      <FilmsStrip
        {...PROPS}
        id="films"
        heading={{ eyebrow: "Seven films", title, lead: norm(section.querySelector(".kh-heading__lead")?.textContent), id: "films-title" }}
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
        link={{ label: "Back to your details", href: "#details", iconEnd: "caret-up" }}
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
    act(() => away.callback([{ target: video, intersectionRatio: 0.6, isIntersecting: true }]));
    expect(pause).not.toHaveBeenCalled();
    act(() => away.callback([{ target: video, intersectionRatio: 0.3, isIntersecting: true }]));
    expect(pause).toHaveBeenCalled();
  });

  /* Task 8c.3: a film started from a quote below the strip is scrolled to while it starts, so the observer's first report
     may find it under half on screen; it pauses only once it has been at least half on screen and then leaves. */
  it("never pauses a film that has not yet been half on screen (still scrolling to it)", async () => {
    const { container } = render(<FilmsStrip {...PROPS} />);
    await act(async () => fireEvent.click(playButtons()[2]));
    const video = container.querySelector("video")!;
    const away = TestObserver.all.find((o) => o.targets.includes(video))!;
    act(() => away.callback([{ target: video, intersectionRatio: 0.2, isIntersecting: true }]));
    expect(pause).not.toHaveBeenCalled();
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

/* Task 8c.3 (D061 item 4): parents' own words under the strip on Home and the product page, in DS quote cards
   (ui/Quote), each with a "Watch the film" button that plays its film in the strip through the island: no video before
   the tap, a native button for the keyboard, a name that says which film. */
describe("FilmsStrip: parents' own words (task 8c.3)", () => {
  const QUOTED: FilmsStripConfig = { ...PROPS, quotes: filmQuotes };
  const watchButtons = () => [...document.querySelectorAll<HTMLButtonElement>(".ks-film-quote button")];
  const chipOf = (id: string) => films.find((f) => f.id === id)!.chip;

  it("prints each quote in a DS quote card in its own tone, cited by name and role, after the controls", () => {
    const { container } = render(<FilmsStrip {...QUOTED} after={<div className="after-slot" />} />);
    const block = container.querySelector(".ks-films-ctrl + .ks-film-quotes")!;
    expect(block).not.toBeNull();
    expect(block).toHaveClass("kh-cols", "kh-cols--2");
    expect(block.nextElementSibling).toBeNull();
    const cards = [...block.querySelectorAll(":scope > .ks-film-quote > figure.kh-quote")];
    expect(cards.map((c) => [c.querySelector("blockquote.kh-quote__text")?.textContent, c.querySelector(".kh-quote__name")?.textContent, c.querySelector(".kh-quote__role")?.textContent])).toEqual(
      filmQuotes.items.map((q) => [q.quote, q.name, q.role]),
    );
    expect(cards.map((c) => [...c.classList].find((k) => k.startsWith("kh-tone-")))).toEqual(filmQuotes.items.map((q) => `kh-tone-${q.tone}`));
    // No avatar: the films name the speakers, and no initials or photo was given for them (DS Testimonial).
    expect(block.querySelector(".kh-quote__avatar, .kh-avatar")).toBeNull();
    // The quotes sit inside the revealing wrap, before whatever follows the strip.
    expect(container.querySelector(".ks-films-wrap")?.contains(block)).toBe(true);
    expect(container.querySelector(".ks-films-wrap + .after-slot")).not.toBeNull();
  });

  it("gives each quote a native button with the DS play icon, \"Watch the film\", named by its film", () => {
    render(<FilmsStrip {...QUOTED} />);
    const buttons = watchButtons();
    expect(buttons).toHaveLength(2);
    for (const [i, button] of buttons.entries()) {
      const { film } = filmQuotes.items[i];
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass("kh-btn", "kh-btn--secondary", "kh-btn--s");
      expect(button.textContent).toBe(filmQuotes.watch);
      expect(button).toHaveAccessibleName(`${filmQuotes.watch}: ${chipOf(film)}`);
      expect(button.querySelector("svg.kh-icon path")?.getAttribute("d")).toBe(ICON_PLAY);
      expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("loads no film before the tap", () => {
    const { container } = render(<FilmsStrip {...QUOTED} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("plays the quote's own film in its tile of the strip, scrolled into view and focused", async () => {
    const focused: Element[] = [];
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement) {
      focused.push(this);
    });
    const scrolled: { el: Element; options: ScrollIntoViewOptions }[] = [];
    Element.prototype.scrollIntoView = vi.fn(function (this: Element, options?: boolean | ScrollIntoViewOptions) {
      scrolled.push({ el: this, options: options as ScrollIntoViewOptions });
    });
    const { container } = render(<FilmsStrip {...QUOTED} />);
    for (const [i, { film }] of filmQuotes.items.entries()) {
      await act(async () => fireEvent.click(watchButtons()[i]));
      const tile = container.querySelector(`[data-video-id="${film}"]`)!;
      const videos = container.querySelectorAll("video");
      expect(videos).toHaveLength(1);
      expect(tile.contains(videos[0])).toBe(true);
      expect(videos[0].getAttribute("src")).toBe(`/video/moments/${film}.mp4`);
      expect(videos[0]).toHaveAttribute("preload", "none");
      expect(tile.querySelector(".ks-film__play")).toHaveAttribute("hidden");
      expect(focused.at(-1)).toBe(videos[0]);
      expect(scrolled.at(-1)).toEqual({ el: tile, options: expect.objectContaining({ block: "center", inline: "nearest" }) });
    }
    expect(play).toHaveBeenCalledTimes(2);
    focusSpy.mockRestore();
    delete (Element.prototype as Partial<Element>).scrollIntoView;
  });

  it("gives focus back to the quote's button when its film ends", async () => {
    const { container } = render(<FilmsStrip {...QUOTED} />);
    await act(async () => fireEvent.click(watchButtons()[1]));
    await act(async () => fireEvent.ended(container.querySelector("video")!));
    expect(container.querySelector("video")).toBeNull();
    expect(document.activeElement).toBe(watchButtons()[1]);
  });

  it("refuses a quote whose film the strip does not show", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const quotes = { ...filmQuotes, items: [{ ...filmQuotes.items[0], film: "no-such-film" }] };
    expect(() => render(<FilmsStrip {...PROPS} quotes={quotes} />)).toThrow(/no-such-film/);
    vi.mocked(console.error).mockRestore();
  });
});

/* Task 8c.8 (the CMO's wave 8c review, m8; the main session's ruling, 2026-10-15): the product page's languages answer
   names film 6, about 12,000 px below the strip. Its name is an in-page link to the film's tile (`#<film id>`, faqs.ts),
   so on that page (`anchored`) each tile carries its film's id; pressed anywhere on the page, the strip's island plays
   that film as a quote's "Watch the film" does (scrolled to the middle of the screen, played in its tile, focused, focus
   back on the link at the end) and keeps the address as it was. Without JavaScript the link still takes the reader to the
   film. Home and the store keep the approved strip's markup: no ids. */
describe("FilmsStrip: an in-page link to a film (task 8c.8)", () => {
  const SIX = films.find((f) => f.id === "a-story-in-two-languages")!;
  /** The strip, with an answer's link to a film elsewhere on the page (as the product page's FAQ holds it). */
  const page = (href: string) =>
    render(
      <>
        <FilmsStrip {...PROPS} anchored />
        <p>
          You can watch it happen in the film <a href={href}>“{SIX.chip}”</a>.
        </p>
      </>,
    );
  const link = () => document.querySelector<HTMLAnchorElement>("p > a")!;

  it("gives each tile its film's id where the page anchors the strip, so a link can name it; none elsewhere", () => {
    const { container, rerender } = render(<FilmsStrip {...PROPS} anchored />);
    expect([...container.querySelectorAll(".ks-film")].map((li) => li.id)).toEqual(PROPS.films.map((f) => f.id));
    rerender(<FilmsStrip {...PROPS} />);
    expect(container.querySelectorAll(".ks-film[id]")).toHaveLength(0);
  });

  it("plays the linked film in its tile, scrolled into view and focused, and keeps the address", async () => {
    const focused: Element[] = [];
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement) {
      focused.push(this);
    });
    const scrolled: { el: Element; options: ScrollIntoViewOptions }[] = [];
    Element.prototype.scrollIntoView = vi.fn(function (this: Element, options?: boolean | ScrollIntoViewOptions) {
      scrolled.push({ el: this, options: options as ScrollIntoViewOptions });
    });
    const { container } = page(`#${SIX.id}`);
    expect(container.querySelector("video")).toBeNull();
    let prevented = false;
    await act(async () => {
      prevented = !fireEvent.click(link());
    });
    const tile = container.querySelector(`#${SIX.id}`)!;
    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(tile.contains(videos[0])).toBe(true);
    expect(videos[0].getAttribute("src")).toBe(SIX.video);
    expect(focused.at(-1)).toBe(videos[0]);
    expect(scrolled.at(-1)).toEqual({ el: tile, options: expect.objectContaining({ block: "center", inline: "nearest" }) });
    expect(prevented).toBe(true);
    expect(play).toHaveBeenCalledTimes(1);
    focusSpy.mockRestore();
    delete (Element.prototype as Partial<Element>).scrollIntoView;
  });

  it("gives focus back to the link when the film ends", async () => {
    const { container } = page(`#${SIX.id}`);
    await act(async () => fireEvent.click(link()));
    await act(async () => fireEvent.ended(container.querySelector("video")!));
    expect(container.querySelector("video")).toBeNull();
    expect(document.activeElement).toBe(link());
  });

  it("leaves alone a link to anything but one of its films, and a click that opens a new tab", async () => {
    const { container } = page("#faq");
    let prevented = false;
    await act(async () => {
      prevented = !fireEvent.click(link());
    });
    expect(prevented).toBe(false);
    expect(container.querySelector("video")).toBeNull();
    link().setAttribute("href", `#${SIX.id}`);
    for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }]) {
      await act(async () => {
        prevented = !fireEvent.click(link(), modifier);
      });
      expect(prevented).toBe(false);
    }
    expect(container.querySelector("video")).toBeNull();
  });
});

/* Task 8c.6 (D061 items 12-13): one landscape film on its own, the expert clip on the product page. No mockup has it (a
   deviation row for the founder); it is composed from the strip's own parts: the band-less section with the centred
   heading, the DS chip, the DS primary play button in the strip's place, and the strip's playback (one <video>, only
   after the tap; focus on the film; paused once it has been half on screen and leaves; focus back at the end). */
describe("FilmsStrip: one film on its own (task 8c.6)", () => {
  const SINGLE: FilmsStripProps = expertFold;
  const film = expertClip;
  const playControl = () => document.querySelector<HTMLButtonElement>("button.ks-film__play")!;

  it("is its own fold: the section named by its centred heading, the poster in a 16:9 figure, the credit and the disclosure under it", () => {
    const { container } = render(<FilmsStrip {...SINGLE} after={<div className="after-slot" />} />);
    const section = container.firstElementChild!;
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("id", "expert");
    expect(section).toHaveAttribute("aria-labelledby", "expert-title");
    expect(section.className).toBe("kh-section");
    const heading = section.querySelector(".kh-heading")!;
    expect(heading).toHaveClass("kh-heading--center");
    expect(norm(heading.querySelector(".kh-eyebrow")?.textContent)).toBe("A video from an expert");
    expect(heading.querySelector("h2#expert-title")?.textContent).toBe("Watching isn’t talking.");
    expect(heading.querySelector("h2 .kh-hand")?.textContent).toBe("talking.");
    // The figure: the frame (poster, chip, play control), then the credit and the disclosure, in body type, in that order.
    const figure = section.querySelector(".kh-container > figure.ks-clip")!;
    expect([...figure.children].map((el) => el.className)).toEqual(["ks-clip__frame", "ks-clip__credit"]);
    expect(figure.lastElementChild?.tagName).toBe("FIGCAPTION");
    expect([...figure.querySelectorAll("figcaption > p")].map((p) => [p.className, p.textContent])).toEqual([
      ["kh-body", film.credit],
      ["kh-body", film.disclosure],
    ]);
    expect(container.querySelector(".ks-clip + .after-slot")).not.toBeNull();
    // Nothing of the strip: no list, no controls, no proof line, no reveal.
    expect(section.querySelector("ul, .ks-films-ctrl, .ks-films-proof, [data-reveal]")).toBeNull();
  });

  it("shows the poster lazily at the clip's own size, with its alt, the chip on it hidden from screen readers", () => {
    const { container } = render(<FilmsStrip {...SINGLE} />);
    const frame = container.querySelector(".ks-clip__frame")!;
    const poster = frame.querySelector("img")!;
    expect(poster).toHaveAttribute("loading", "lazy");
    expect(poster).not.toHaveAttribute("fetchpriority");
    expect(poster).toHaveAttribute("alt", film.poster.alt);
    expect(poster).toHaveAttribute("width", "1280");
    expect(poster).toHaveAttribute("height", "720");
    expect(poster.getAttribute("sizes")).toBe("(min-width: 764px) 700px, (min-width: 720px) calc(100vw - 64px), calc(100vw - 32px)");
    const chip = frame.querySelector(".ks-clip__chip")!;
    expect(chip).toHaveAttribute("aria-hidden", "true");
    expect(chip.querySelector(".kh-chip")?.textContent).toBe(film.chip);
  });

  it("has no <video> and fetches no film at rest; one DS primary play control, named as the plan says", () => {
    const { container } = render(<FilmsStrip {...SINGLE} />);
    expect(container.querySelector("video")).toBeNull();
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(1);
    expect(playControl()).toHaveClass("kh-iconbtn", "kh-iconbtn--primary", "kh-iconbtn--l", "ks-film__play");
    expect(playControl()).toHaveAccessibleName(film.play);
    expect(playControl().querySelector("svg path")?.getAttribute("d")).toBe(ICON_PLAY);
    expect(container.innerHTML).not.toContain(film.video);
  });

  it("a tap swaps the poster for the film with native controls and sound, focused and playing", async () => {
    const focused: Element[] = [];
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(function (this: HTMLElement) {
      focused.push(this);
    });
    const { container } = render(<FilmsStrip {...SINGLE} />);
    await act(async () => fireEvent.click(playControl()));
    const video = container.querySelector("video")!;
    expect(video.closest(".ks-clip__frame")).not.toBeNull();
    expect(video.getAttribute("src")).toBe(film.video);
    expect(video.controls).toBe(true);
    expect(video.muted).toBe(false);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).not.toHaveAttribute("loop");
    expect(video).toHaveAttribute("aria-label", film.name);
    // jsdom loads no image, so the poster is the WebP still rather than the shown still's address.
    expect(video).toHaveAttribute("poster", film.still);
    expect(playControl()).toHaveAttribute("hidden");
    expect(focused).toEqual([video]);
    expect(play).toHaveBeenCalledTimes(1);
    focusSpy.mockRestore();
  });

  it("pauses once it has been half on screen and leaves, never before", async () => {
    const { container } = render(<FilmsStrip {...SINGLE} />);
    await act(async () => fireEvent.click(playControl()));
    const video = container.querySelector("video")!;
    const away = TestObserver.all.find((o) => o.targets.includes(video))!;
    expect(away.options.threshold).toBe(0.5);
    act(() => away.callback([{ target: video, intersectionRatio: 0.2, isIntersecting: true }]));
    expect(pause).not.toHaveBeenCalled();
    act(() => away.callback([{ target: video, intersectionRatio: 0.9, isIntersecting: true }]));
    act(() => away.callback([{ target: video, intersectionRatio: 0.3, isIntersecting: true }]));
    expect(pause).toHaveBeenCalled();
  });

  it("brings the poster back when the film ends and returns focus to the play control", async () => {
    const { container } = render(<FilmsStrip {...SINGLE} />);
    await act(async () => fireEvent.click(playControl()));
    await act(async () => fireEvent.ended(container.querySelector("video")!));
    expect(container.querySelector("video")).toBeNull();
    expect(playControl()).not.toHaveAttribute("hidden");
    expect(document.activeElement).toBe(playControl());
  });

  it("refuses a clip without its credit or its disclosure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    for (const missing of ["credit", "disclosure"] as const) {
      expect(() => render(<FilmsStrip {...SINGLE} film={{ ...film, [missing]: " " }} />)).toThrow(new RegExp(missing));
    }
    vi.mocked(console.error).mockRestore();
  });
});

/* Task Q2.9 (the D2C plan v2 §2 folds 4 and 6): Home's expert clip sits on the cream band between two plain folds, and
   the languages fold plays film 6 on its own, a portrait phone recording, in the same frame at 9:16 (LanguagesSection).
   The single layout takes `band`; the clip's island takes `portrait` and only the fields its frame shows. */
describe("FilmsStrip: the single film on the band, and a portrait clip (task Q2.9)", () => {
  it("puts the single film's fold on the cream band when asked, and nowhere else", () => {
    const { container } = render(<FilmsStrip {...expertFold} band />);
    expect(container.firstElementChild?.className).toBe("kh-section kh-section--band");
    expect(render(<FilmsStrip {...expertFold} />).container.firstElementChild?.className).toBe("kh-section");
  });

  it("frames a portrait film at 9:16, the frame marked --portrait, with the same poster, chip and play control", () => {
    const film = { ...expertClip, poster: { ...expertClip.poster, width: 1080, height: 1920 } };
    const { container } = render(<FilmClipIsland film={film} sizes="272px" portrait />);
    const frame = container.firstElementChild!;
    expect(frame.className).toBe("ks-clip__frame ks-clip__frame--portrait");
    expect(frame.querySelector("img")).toHaveAttribute("sizes", "272px");
    expect(frame.querySelector(".ks-clip__chip .kh-chip")?.textContent).toBe(film.chip);
    expect(frame.querySelector("button.ks-film__play")).toHaveAccessibleName(film.play);
    expect(render(<FilmClipIsland film={expertClip} sizes="1px" />).container.firstElementChild?.className).toBe("ks-clip__frame");
  });

  it("gives the portrait frame its 9:16 and its play control a place above the faces", () => {
    const css = readRepoFile("src/components/sections/FilmsStrip/films-strip.css");
    expect(css).toMatch(/\.ks-clip__frame--portrait \{\s*aspect-ratio: 9 \/ 16;\s*\}/);
    expect(css).toMatch(/\.ks-clip__frame--portrait \.ks-film__play \{\s*top: 28%;\s*\}/);
  });
});

/* Task 8c.8 (the CMO's wave 8c review of the product page, m5, m6, m10; main-session rulings 2026-10-15): the clip's
   layout, read from films-strip.css (where it lands on the page is measured in a browser; the task report has the boxes).
   - m6: from 720 px the figure stops at the site's narrow measure, the reading column's 700 px (ArticleBody's
     `--content-max * 7 / 12`), centred, so the toy's hero board stays the largest picture on the page; the poster's
     `sizes` follow.
   - m5: the poster is the whole front frame (her face in the upper third, public/video/expert), so the play control sits
     lower, on her coat (60 % down the frame), and the chip at the frame's foot: neither on her face or her hair.
   - m10: under 720 px the credit and the disclosure start at the left and keep out of the WhatsApp bubble's column (its
     56 px and --space-2 beside it, as the hero's help line does since task 8c.5). */
describe("FilmsStrip: the single film's layout (task 8c.8)", () => {
  /** The declarations of the rule with exactly this selector, inside the at-rule with these params ("" for top level). */
  const declarations = (selector: string, media = ""): string[] => {
    const out: string[] = [];
    postcss.parse(readRepoFile("src/components/sections/FilmsStrip/films-strip.css")).walkRules((rule: Rule) => {
      const parent = rule.parent;
      const where = parent?.type === "atrule" ? (parent as AtRule).params : "";
      if (where === media && rule.selectors.includes(selector)) rule.each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
    });
    return out;
  };

  it("m6: stops the clip at the narrow measure from 720 px, centred, and no longer at the strip's 944 px", () => {
    expect(declarations(".ks-clip", "(min-width: 720px)")).toEqual(["max-width: calc(var(--content-max) * 7 / 12)", "margin-inline: auto"]);
    expect(declarations(".ks-clip", "(min-width: 1024px)")).toEqual([]);
    const { container } = render(<FilmsStrip {...expertFold} />);
    expect(container.querySelector(".ks-clip__frame img")?.getAttribute("sizes")).toBe(
      "(min-width: 764px) 700px, (min-width: 720px) calc(100vw - 64px), calc(100vw - 32px)",
    );
  });

  it("m5: puts the play control on her coat and the chip at the frame's foot, off her face and hair", () => {
    expect(declarations(".ks-clip__frame .ks-film__play")).toEqual(["top: 60%"]);
    const chip = declarations(".ks-clip__chip");
    expect(chip).toContain("bottom: var(--space-3)");
    expect(chip).toContain("left: var(--space-3)");
    expect(chip.some((d) => d.startsWith("top:"))).toBe(false);
  });

  it("m10: on phones starts the credit and the disclosure at the left, out of the WhatsApp bubble's column", () => {
    expect(declarations(".ks-clip__credit", "(max-width: 719px)")).toEqual([
      "text-align: start",
      "padding-right: calc(var(--space-8) + env(safe-area-inset-right))",
    ]);
  });

  /* Task Q2.15 (the CMO's built review of the selling update, CMO-5): Home's two clip captions wrapped narrower than their
     players. The portrait clip (Home's languages film) is drawn 232 px wide and centred under the words on phones
     (languages-section.css), clear of the bubble's column, so its caption takes the frame's width (2 lines where it took
     4); and every credit's lines break evenly, so the expert's "coach" no longer sits alone. */
  it("CMO-5: a portrait clip's caption takes its narrow frame's width on phones, and every credit's lines break evenly", () => {
    expect(declarations(".ks-clip:has(.ks-clip__frame--portrait) .ks-clip__credit", "(max-width: 719px)")).toEqual(["padding-right: 0"]);
    expect(declarations(".ks-clip__credit > p")).toEqual(["margin: 0", "text-wrap: balance"]);
  });
});

/* Task 3.6 item 19: films.spec.ts and motion-films.spec.ts run on these stories, so the stories show the content itself
   (content/en-IN/films.ts), never a retyped copy: the specs then test what the pages publish. */
describe("FilmsStrip: the stories show the content", () => {
  it("every story takes the content's films and the strip's labels, the very values", () => {
    expect(storiesMeta.args.films).toBe(films);
    expect(storiesMeta.args.labels).toBe(filmsStrip);
    for (const story of [stories.Home, stories.Product, stories.Store]) {
      expect(story.args?.films ?? storiesMeta.args.films).toBe(films);
      expect(story.args?.labels ?? storiesMeta.args.labels).toBe(filmsStrip);
    }
  });

  it("the expert clip's story is the product page's own fold, the very config (task 8c.6)", () => {
    expect(stories.Expert.args).toBe(expertFold);
  });

  it("Home and the product page show the parents' quotes from content; the store shows none (task 8c.3)", () => {
    expect(stories.Home.args?.quotes).toBe(filmQuotes);
    expect(stories.Product.args?.quotes).toBe(filmQuotes);
    expect(stories.Store.args?.quotes).toBeUndefined();
    expect(storiesMeta.args).not.toHaveProperty("quotes");
  });
});
