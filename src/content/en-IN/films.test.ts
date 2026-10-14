import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { filmQuotes, films, filmsStrip } from "./films";

/* The seven parent films (D040; architecture §6.1): chip, caption, length, poster and its alt,
 * and the file, exactly as the approved film strip shows them on Home, the product page and the
 * store (film 2's chip "Real families" and film 6's caption are the founder's, home.md round 2). */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

function strip(slug: string) {
  return Array.from(doc(slug).querySelectorAll(".mk-film")).map((li) => {
    const img = li.querySelector("img")!;
    const play = li.querySelector(".mk-film__play")!;
    return {
      id: li.getAttribute("data-video-id"),
      chip: norm(li.querySelector(".kh-chip")?.textContent),
      caption: norm(li.querySelector(".mk-film__caption")?.textContent),
      duration: norm(li.querySelector(".mk-film__time")?.textContent).replace(/^Length /, ""),
      poster: {
        src: img.getAttribute("src")!.replace("../public", ""),
        width: Number(img.getAttribute("width")),
        height: Number(img.getAttribute("height")),
        alt: img.getAttribute("alt"),
      },
      video: play.getAttribute("data-film")!.replace("../public", ""),
      play: play.getAttribute("aria-label"),
    };
  });
}

describe("the films", () => {
  it("are the seven of the approved strip, in its order, on every page that shows it", () => {
    for (const slug of ["home", "meet-kheelu", "store"]) {
      expect(
        films.map((f) => ({
          id: f.id,
          chip: f.chip,
          caption: f.caption,
          duration: f.duration,
          poster: f.poster,
          video: f.video,
          play: `Play: ${f.chip}. ${f.caption}`,
        })),
        slug,
      ).toEqual(strip(slug));
    }
  });

  it("take the file name from the id, under the unchanged /video/moments/ URLs", () => {
    for (const f of films) {
      expect(f.video).toBe(`/video/moments/${f.id}.mp4`);
      expect(f.poster.src).toBe(`/video/moments/${f.id}.jpg`);
    }
  });

  it("point at files that exist, with posters of the declared size", async () => {
    for (const f of films) {
      expect(existsSync(join(ROOT, "public", f.video)), f.video).toBe(true);
      const meta = await sharp(join(ROOT, "public", f.poster.src as string)).metadata();
      expect([meta.width, meta.height], f.id).toEqual(["width" in f.poster ? f.poster.width : 0, "height" in f.poster ? f.poster.height : 0]);
    }
  });

  it("are captioned in the file and consented (D040)", () => {
    for (const f of films) {
      expect(f.hasOpenCaptions).toBe(true);
      expect(f.consentOnFile).toBe(true);
    }
  });
});

describe("the strip's own labels", () => {
  it("name the list and the controls as the mockup does", () => {
    const home = doc("home");
    expect(filmsStrip.listLabel).toBe(home.querySelector("[data-films]")?.getAttribute("aria-label"));
    expect(filmsStrip.previous).toBe(home.querySelector("[data-films-prev]")?.getAttribute("aria-label"));
    expect(filmsStrip.next).toBe(home.querySelector("[data-films-next]")?.getAttribute("aria-label"));
    expect(`${filmsStrip.length} `).toBe(home.querySelector(".mk-film__time .kh-sr")?.textContent);
    expect(filmsStrip.play).toBe("Play:");
  });

  /* Task 3.6 item 19: the position line's word, "1 of 7" (mockup.js §4 writes "1–3 of 7" on laptops), is content too. */
  it("give the position line its word, as the mockup prints it (1 of 7)", () => {
    const pos = doc("home").querySelector("[data-films-pos]")?.textContent;
    expect(pos).toBe(`1 ${filmsStrip.of} ${films.length}`);
    expect(filmsStrip.of).toBe("of");
  });
});

/* Parents' own words (task 8c.3; D061 item 4): two short quotes under the strip on Home and the product page, each word
 * for word from its film's burned-in subtitles (read off the frames of a-parent-speaks at about 0:09-0:15 and
 * a-father-speaks at about 0:17-0:23, 2026-10-15), each tied to the film a "Watch the film" button plays. The written
 * consent covers quoting the words in text (D061 item 4). Lines left out on purpose: "completely safe", "more than an
 * hour", "make him jump". */
describe("the parents' quotes", () => {
  it("are the two subtitles, word for word, each cited as the founder named the speaker", () => {
    expect(filmQuotes.items.map(({ film, quote, name, role }) => ({ film, quote, name, role }))).toEqual([
      {
        film: "a-parent-speaks",
        quote: "They first thought it’s just another soft toy, but when it started speaking, they were very much surprised.",
        name: "Nikita",
        role: "Parent",
      },
      {
        film: "a-father-speaks",
        quote: "I would recommend everyone to have one — so that there is play away from the screen.",
        name: "Siddhant’s father",
        role: "Parent",
      },
    ]);
  });

  it("each play a film the strip shows: a speaking parent's (D040: films 3 and 7)", () => {
    const ids = films.map((f) => f.id);
    for (const { film } of filmQuotes.items) expect(ids).toContain(film);
  });

  it("take two different DS tones (DS Testimonial: at most three at once, in different tones)", () => {
    const tones = filmQuotes.items.map((q) => q.tone);
    expect(new Set(tones).size).toBe(tones.length);
  });

  it("label the button that plays each film \"Watch the film\"", () => {
    expect(filmQuotes.watch).toBe("Watch the film");
  });

  it("pass the claims guard, and carry none of the lines left out on purpose", () => {
    for (const { quote, name, role } of filmQuotes.items) {
      expect(findBanned(`${quote} ${name}. ${role}.`), quote).toEqual([]);
      expect(quote).not.toMatch(/completely safe|more than an hour|make him jump/i);
    }
    expect(findBanned(filmQuotes.watch)).toEqual([]);
  });
});
