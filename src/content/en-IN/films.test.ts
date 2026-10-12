import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { films, filmsStrip } from "./films";

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
