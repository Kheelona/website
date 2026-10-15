import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { LanguagesSection } from "./LanguagesSection";
import storiesMeta, * as stories from "./LanguagesSection.stories";
import type { LanguagesSectionConfig } from "./languages-section.types";

/* LanguagesSection (task Q2.9; the D2C plan v2 §2 fold 4, D064 item 9): "Does it speak ours?" in one fold. The heading
 * (eyebrow, the h2 with its one accent, the lead naming the languages), the languages in their own scripts (the DS
 * LanguageChips), and beside them one real film that shows the switching, played in place: film 6, a portrait phone
 * recording, in the expert clip's frame upright (FilmsStrip's FilmClipIsland, `portrait`), poster first and lazy, its
 * caption under it. Never a cast photo (the plan's ruling 1). No button. */

const OFFER = buildOffer("token");
const CONFIG: LanguagesSectionConfig = {
  id: "languages",
  band: true,
  heading: {
    eyebrow: "Languages",
    title: "Kheelu speaks up to 10 {hand:languages} at launch.",
    lead: "Eight today: English and Hindi.",
    id: "languages-title",
  },
  languages: [{ native: "English" }, { native: "हिन्दी", english: "Hindi", lang: "hi" }],
  film: {
    video: "/video/moments/a-story-in-two-languages.mp4",
    poster: { src: "/video/moments/a-story-in-two-languages.jpg", width: 1080, height: 1920, alt: "A girl on a sofa beside the cream Kheelu plush." },
    still: "/video/moments/a-story-in-two-languages.jpg",
    chip: "Two languages · 0:31",
    play: "Play: Two languages. In AI mode, Arha switches to English, and Kheelu switches with her.",
    name: "Two languages. In AI mode, Arha switches to English, and Kheelu switches with her.",
    caption: "In AI mode, Arha switches to English, and Kheelu switches with her.",
  },
};
const CSS = readFileSync(join(process.cwd(), "src/components/sections/LanguagesSection/languages-section.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("LanguagesSection: the fold", () => {
  it("is a section named by its h2, on the band, with the eyebrow, the one accent and the lead", () => {
    const { container } = render(<LanguagesSection {...CONFIG} offer={OFFER} />);
    const section = screen.getByRole("region", { name: "Kheelu speaks up to 10 languages at launch." });
    expect(container.firstElementChild).toBe(section);
    expect(section).toHaveAttribute("id", "languages");
    expect(section.className).toBe("kh-section kh-section--band");
    const heading = section.querySelector(".kh-heading")!;
    expect(heading.querySelector(".kh-eyebrow")?.textContent).toBe("Languages");
    expect([...heading.querySelectorAll("h2 .kh-hand")].map((s) => s.textContent)).toEqual(["languages"]);
    expect(heading.querySelector(".kh-heading__lead")?.textContent).toBe("Eight today: English and Hindi.");
  });

  it("lists the languages in their own scripts beside the film, the words first in the split", () => {
    const { container } = render(<LanguagesSection {...CONFIG} offer={OFFER} />);
    const split = container.querySelector(".kh-container > .kh-split.kh-split--wide-start.ks-langs-split")!;
    expect([...split.children].map((el) => el.tagName)).toEqual(["DIV", "FIGURE"]);
    const chips = split.firstElementChild!.querySelector("ul.kh-langs")!;
    expect([...chips.querySelectorAll(".kh-lang__native")].map((s) => [s.textContent, s.getAttribute("lang")])).toEqual([
      ["English", null],
      ["हिन्दी", "hi"],
    ]);
    expect(chips.querySelector(".kh-lang__en")?.textContent).toBe("Hindi");
  });

  it("plays one real film in place: the portrait frame, the poster lazy at its column's width, no video at rest, the caption under it", () => {
    const { container } = render(<LanguagesSection {...CONFIG} offer={OFFER} />);
    const figure = container.querySelector<HTMLElement>("figure.ks-clip.ks-langs-film")!;
    expect(figure).toHaveAttribute("data-reveal", "");
    expect([...figure.children].map((el) => el.className)).toEqual(["ks-clip__frame ks-clip__frame--portrait", "ks-clip__credit"]);
    const poster = figure.querySelector("img")!;
    expect(poster).toHaveAttribute("loading", "lazy");
    expect(poster).not.toHaveAttribute("fetchpriority");
    expect(poster).toHaveAttribute("alt", CONFIG.film.poster.alt);
    expect(poster).toHaveAttribute("sizes", "(min-width: 900px) 300px, 232px");
    expect(container.querySelector("video")).toBeNull();
    expect(within(figure).getByRole("button")).toHaveAccessibleName(CONFIG.film.play);
    expect(figure.querySelector("figcaption > p.kh-body")?.textContent).toBe(CONFIG.film.caption);
  });

  it("has no button and no tracked link: the fold answers a question, it does not sell", () => {
    const { container } = render(<LanguagesSection {...CONFIG} offer={OFFER} />);
    expect(container.querySelector(".kh-btn, [data-ph-capture-attribute-cta]")).toBeNull();
  });

  it("keeps the film at a phone's width, centred, and beside the words from 900 px, on DS tokens only", () => {
    expect(CSS).toMatch(/\.ks-clip\.ks-langs-film \{[^}]*width: min\(100%, calc\(var\(--space-10\) \* 2 - var\(--space-5\)\)\);[^}]*margin-inline: auto;/);
    expect(CSS).toMatch(/@media \(min-width: 900px\) \{\s*\.ks-clip\.ks-langs-film \{\s*width: calc\(var\(--space-9\) \* 3 \+ var\(--space-3\)\);/);
    // No literal colour or length in a declaration (the DS breakpoint in the @media prelude is the DS's own).
    expect(CSS.replace(/@media[^{]*/g, "")).not.toMatch(/#[0-9a-f]{3,6}\b|\d+px/i);
  });
});

describe("LanguagesSection: the story is Home's fold, read from content", () => {
  it("takes the page's own config", () => {
    expect(storiesMeta.args.heading.id).toBe("languages-title");
    expect(stories.Home).toBeDefined();
  });
});
