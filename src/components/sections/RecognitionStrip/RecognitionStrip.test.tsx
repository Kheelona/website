import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton } from "../../../../test/support/mockup-compare";
import { RecognitionStrip } from "./RecognitionStrip";
import { RECOGNITION_GATED, RECOGNITION_LIVE, RECOGNITION_ONE_FILED } from "./RecognitionStrip.stories";

/* RecognitionStrip (task 3.4; marks since task 6.6, D054 item 20): team.html fold 5. A tight section with the centred
   "Recognised by." heading and the programmes as one quiet row, in their order: a mark whose alt names the programme
   stands alone; a decorative mark (empty alt) shows the name beside it; a programme with no mark shows its name. A
   proof-gated programme (D038) never renders, and with none shown the whole fold renders nothing. */

const SOURCE = readFileSync(join(process.cwd(), "src/components/sections/RecognitionStrip/RecognitionStrip.tsx"), "utf8");
const CSS = readFileSync(join(process.cwd(), "src/components/sections/RecognitionStrip/recognition-strip.css"), "utf8");

describe("RecognitionStrip: the fold", () => {
  it("keeps the approved fold's section, container and centred heading, the row in the place of the mockup's line", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_ONE_FILED} />);
    const mockup = mockupFold("team", "section[aria-labelledby='recognised-title']");
    /* The mockup holds a placeholder line for the programmes inside the heading; the build holds the row there. */
    const built = container.firstElementChild!.cloneNode(true) as Element;
    built.querySelector("ul.ks-recognition")!.remove();
    const approved = mockup.cloneNode(true) as Element;
    approved.querySelector("header > p.kh-body")!.remove();
    expect(skeleton(built)).toBe(skeleton(approved));
    const section = screen.getByRole("region", { name: "Recognised by." });
    expect(section.className).toBe("kh-section kh-section--tight");
    expect(section.querySelector("header.kh-heading.kh-heading--center > ul.ks-recognition")).not.toBeNull();
  });

  it("renders nothing while every programme is gated", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_GATED} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_GATED} items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("never renders a gated programme, by name or by mark", () => {
    render(<RecognitionStrip {...RECOGNITION_ONE_FILED} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(list.textContent).toBe("Programme one");
    expect(list.querySelector("img")).toBeNull();
  });
});

describe("RecognitionStrip: the row, as the live strip", () => {
  it("lists every programme in its order, one item each", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(list.className).toBe("ks-recognition");
    expect(list).toHaveAttribute("role", "list");
    expect(within(list).getAllByRole("listitem").map((li) => li.className)).toEqual(Array(4).fill("ks-recognition__item"));
  });

  it("shows a mark that names its programme alone, the mark's alt its accessible name", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const [first] = within(screen.getByRole("list")).getAllByRole("listitem");
    const img = within(first).getByRole("img", { name: "Mark one" });
    expect(img.className).toBe("ks-recognition__mark");
    expect(first.textContent).toBe("");
  });

  it("shows a decorative mark with the programme's name beside it, the mark hidden from the reader", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const second = within(screen.getByRole("list")).getAllByRole("listitem")[1];
    const img = second.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img.className).toBe("ks-recognition__mark");
    const name = second.querySelector("span")!;
    expect(name.className).toBe("kh-label ks-recognition__name");
    expect(name.textContent).toBe("Programme two");
    expect(img.nextElementSibling).toBe(name);
  });

  it("shows a programme with no mark as its name in text", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const last = within(screen.getByRole("list")).getAllByRole("listitem")[3];
    expect(last.querySelector("img")).toBeNull();
    expect(last.innerHTML).toBe('<span class="kh-label ks-recognition__name">Programme four</span>');
  });

  it("reads the row as the names, in order", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    const read = items.map((li) => li.querySelector("img")?.getAttribute("alt") || li.textContent);
    expect(read).toEqual(["Mark one", "Programme two", "Mark three", "Programme four"]);
  });
});

describe("RecognitionStrip: the marks", () => {
  /* Architecture §10: rasters reach next/image only inside the media primitives; a mark is Photo's bare form. */
  it("draws each mark through Photo's bare form, never next/image directly", () => {
    expect(SOURCE).not.toMatch(/from "next\/image"/);
    expect(SOURCE).toMatch(/<Photo\s[^>]*\bbare\b[^>]*className="ks-recognition__mark"/);
  });

  it("loads each mark lazily at its own ratio, sized for its drawn width at the row's height", () => {
    render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    const imgs = [...screen.getByRole("list").querySelectorAll("img")];
    expect(imgs.map((img) => [img.getAttribute("loading"), img.style.getPropertyValue("--kh-ratio"), img.getAttribute("sizes")])).toEqual([
      ["lazy", "575 / 200", "138px"],
      ["lazy", "240 / 240", "48px"],
      ["lazy", "306 / 126", "117px"],
    ]);
  });

  /* The row's height is the DS space-7 (48 px), which the sizes above assume; the mark keeps its own ratio there. */
  it("sets the marks at the DS space-7 height and their own ratio", () => {
    const rule = [...CSS.matchAll(/^\.ks-recognition__mark \{([^}]*)\}/gm)];
    expect(rule).toHaveLength(1);
    expect(rule[0][1]).toMatch(/^\s*height: var\(--space-7\);$/m);
    expect(rule[0][1]).toMatch(/^\s*width: auto;$/m);
    expect(rule[0][1]).toMatch(/^\s*aspect-ratio: var\(--kh-ratio\);$/m);
    expect(SOURCE).toMatch(/const MARK_HEIGHT = 48;/);
  });
});

/* Task Q2.9 (the selling update; the D2C plan v2 §2 fold 2, ruling 1 and the CMO's m10): on Home the strip sits directly
   under the films' quotes as a small label, "Recognised by", rather than a heading, on the films' band, so it reads as
   the end of the proof fold. The row is the same; the section is still named, by the label. */
describe("RecognitionStrip: label (task Q2.9)", () => {
  const LABEL = { ...RECOGNITION_LIVE, title: "Recognised by", variant: "label", band: true } as const;

  it("names a tight band section by a small label, not a heading, with the row right under it", () => {
    const { container } = render(<RecognitionStrip {...LABEL} />);
    const section = screen.getByRole("region", { name: "Recognised by" });
    expect(container.firstElementChild).toBe(section);
    expect(section.className).toBe("kh-section kh-section--band kh-section--tight ks-recognised");
    expect(section.querySelector("h1, h2, h3, header")).toBeNull();
    const label = section.querySelector("#recognised-title")!;
    expect(label.tagName).toBe("P");
    expect(label.className).toBe("kh-label-s ks-recognition__label");
    expect(label.nextElementSibling).toHaveClass("ks-recognition");
    expect(within(section).getAllByRole("listitem")).toHaveLength(4);
  });

  it("keeps the heading form by default, and nothing on the band unless asked", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_LIVE} />);
    expect(container.querySelector("h2#recognised-title")).not.toBeNull();
    expect(container.firstElementChild?.className).toBe("kh-section kh-section--tight");
  });

  it("centres the label over the row in its own small type and colour, on DS tokens", () => {
    expect(CSS).toMatch(/\.ks-recognition__label \{[^}]*text-align: center;[^}]*color: var\(--text-muted\);/);
    // The band section after the films' band: no second band's padding between the quotes and the strip.
    expect(CSS).toMatch(/\.kh-section--band \+ \.ks-recognised \{[^}]*padding-top: 0;/);
  });
});
