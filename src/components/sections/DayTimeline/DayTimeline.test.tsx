import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { buildOffer } from "@/lib/offer/offer";
import { DayTimeline } from "./DayTimeline";
import storiesMeta, * as stories from "./DayTimeline.stories";
import type { DayTimelineConfig } from "./day-timeline.types";

/* DayTimeline (task Q2.9; the D2C plan v2 §2 fold 9): a few moments of one day, read top to bottom as one ordered list,
 * each a DS icon in its tone's circle, an h3, its line and its mode as a DS chip, the circles joined by a hairline; the
 * closing line; beside it one real parent-app screen in the DS device with its caption (D044). No button. */

const OFFER = buildOffer("token");
const SCREEN = { src: "/media/app-activity.webp", width: 576, height: 1209, alt: "The parent app’s activity screen." } as const;
const CONFIG: DayTimelineConfig = {
  id: "day",
  heading: { eyebrow: "Little moments", title: "A day with Kheelu, {hand:sunrise to bedtime.}", lead: "Not all day.", id: "day-title" },
  moments: [
    { icon: "sun", tone: "sun", when: "Breakfast", line: "The first ‘why’ of the day.", mode: "AI mode · home Wi‑Fi" },
    { icon: "moon", tone: "blue", when: "Bedtime", line: "One last story, lights low.", mode: "Story mode · no Wi‑Fi needed" },
  ],
  closing: "Each Kheelu has a daily limit on how long it talks.",
  screen: { image: SCREEN, caption: "The Kheelona app is live on Apple’s App Store and the Google Play Store." },
};
const CSS = readFileSync(join(process.cwd(), "src/components/sections/DayTimeline/day-timeline.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("DayTimeline: the fold", () => {
  it("is a section named by its h2, the heading with its lead, the words beside the screen (7:5 from 900 px)", () => {
    const { container } = render(<DayTimeline {...CONFIG} offer={OFFER} />);
    const section = screen.getByRole("region", { name: "A day with Kheelu, sunrise to bedtime." });
    expect(container.firstElementChild).toBe(section);
    expect(section).toHaveAttribute("id", "day");
    const split = section.querySelector(".kh-container > .kh-split.kh-split--wide-start.ks-day-split")!;
    expect([...split.children].map((el) => el.tagName)).toEqual(["DIV", "FIGURE"]);
    expect(section.querySelector(".kh-heading__lead")?.textContent).toBe("Not all day.");
  });

  it("reads the moments as one ordered list: the tone's circle and DS icon, the h3, the line and the mode chip", () => {
    render(<DayTimeline {...CONFIG} offer={OFFER} />);
    const list = screen.getAllByRole("list")[0];
    expect(list.tagName).toBe("OL");
    expect(list).toHaveAttribute("data-reveal", "");
    const items = [...list.children];
    expect(items.map((li) => li.className)).toEqual(["ks-day__moment kh-tone-sun", "ks-day__moment kh-tone-blue"]);
    expect(items.map((li) => li.querySelector(".ks-day__icon path")?.getAttribute("d"))).toEqual([ICON_PATHS.sun, ICON_PATHS.moon]);
    expect(items.every((li) => li.querySelector(".ks-day__icon")?.getAttribute("aria-hidden") === "true")).toBe(true);
    expect(items.map((li) => [li.querySelector("h3")?.textContent, li.querySelector("p.ks-day__line")?.textContent, li.querySelector(".kh-chip")?.textContent])).toEqual(
      CONFIG.moments.map((m) => [m.when, m.line, m.mode]),
    );
  });

  it("ends the words with the closing line, and shows the one real screen in the DS device, lazy, with its caption", () => {
    const { container } = render(<DayTimeline {...CONFIG} offer={OFFER} />);
    expect(container.querySelector(".ks-day + p.kh-body-l.ks-day__closing")?.textContent).toBe(CONFIG.closing);
    const figure = container.querySelector("figure.ks-shots.ks-shots--safety")!;
    expect(figure).toHaveAttribute("data-reveal", "");
    const img = figure.querySelector(".kh-device img")!;
    expect(img).toHaveAttribute("alt", SCREEN.alt);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("sizes", "(min-width: 900px) 300px, 272px");
    expect(figure.querySelector("figcaption")?.textContent).toBe(CONFIG.screen.caption);
  });

  it("has no button and no tracked link", () => {
    const { container } = render(<DayTimeline {...CONFIG} offer={OFFER} />);
    expect(container.querySelector(".kh-btn, [data-ph-capture-attribute-cta]")).toBeNull();
  });

  it("joins the circles with a hairline through the gap, on DS tokens only", () => {
    expect(CSS).toMatch(/\.ks-day__moment:not\(:last-child\)::before \{[^}]*width: var\(--stroke-hair\);[^}]*background: var\(--border-strong\);/);
    expect(CSS).toMatch(/\.ks-day__icon \{[^}]*background: var\(--tone\);[^}]*color: var\(--on-tone\);/);
    expect(CSS).not.toMatch(/#[0-9a-f]{3,6}\b|\d+px|transition|animation/i);
  });
});

describe("DayTimeline: the stories show Home's fold", () => {
  it("take the page's own config", () => {
    expect(storiesMeta.args.heading.id).toBe("day-title");
    expect(storiesMeta.args.moments).toHaveLength(5);
    expect(stories.OnBand.args?.band).toBe(true);
  });
});
