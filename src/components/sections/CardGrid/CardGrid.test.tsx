import { render, screen } from "@testing-library/react";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { outline, parseMockup, type Renames } from "../../../../test/support/mockup-compare";
import { CardGrid, type CardGridItem } from "./CardGrid";

/** The declarations of card-grid.css's top-level rule with exactly these selectors, in order. */
function declarations(selector: string): string[] {
  const out: string[] = [];
  postcss.parse(readRepoFile("src/components/sections/CardGrid/card-grid.css")).each((node) => {
    if (node.type === "rule" && node.selectors.join(", ") === selector) {
      node.each((d) => void (d.type === "decl" && out.push(`${d.prop}: ${d.value}`)));
    }
  });
  return out;
}

/* CardGrid (task 3.3; components §2): Home's guides for parents (home.html fold 7b, D046) and the contact page's route
 * cards (contact.html fold 2), each compared class by class (mk- renamed ks-) with the built mockup fold through the
 * mockup comparison harness (test/support/mockup-compare.ts), down to the Card primitive's own parts. */

const mockup = parseMockup;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const words = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, "");

/** The guides list also takes the shared list reset; every other block takes its ks- name. */
const RENAMES: Renames = { guides: ["ks-guides", "ks-list-reset"] };
/** Card marks every link of the contact cards' row as a full tap target (G-01; contact.css:21). */
const tapTarget = (el: Element) => (el.tagName === "A" && el.parentElement?.classList.contains("mk-card-links") ? ["ks-card__link--tap"] : []);
const shape = (el: Element) => outline(el, { renames: RENAMES, extra: tapTarget });

/** The fold's cards as data, read from the mockup (words, tone, links); icons by the mockup's order. */
function cardsFrom(fold: Element, icons: CardGridItem["icon"][]): CardGridItem[] {
  return [...fold.querySelectorAll(".kh-card")].map((card, i) => {
    const anchors = [...card.querySelectorAll("a.kh-card__link")].map((a) => ({
      label: norm(a.textContent),
      href: a.getAttribute("href")!.replace(/^([a-z-]+)\.html/, "/$1"),
      ...(a.getAttribute("aria-label") ? { ariaLabel: a.getAttribute("aria-label")! } : {}),
    }));
    return {
      tone: (["blue", "sun", "chilli"] as const).find((t) => card.classList.contains(`kh-tone-${t}`)),
      icon: icons[i],
      title: norm(card.querySelector(".kh-card__title")?.textContent),
      body: norm(card.querySelector(".kh-card__body")?.textContent),
      links: anchors,
    };
  });
}

describe("CardGrid: guides (Home fold 7b)", () => {
  const fold = mockup("home").querySelector('[aria-labelledby="guides-title"]')!;
  const items = cardsFrom(fold, ["clock", "translate", "puzzle-piece"]);
  const heading = {
    eyebrow: "Guides for parents",
    title: "How we can {nowrap:{hand:help},} from 3 to 7.",
    lead: norm(fold.querySelector(".kh-heading__lead")?.textContent),
    id: "guides-title",
    align: "center" as const,
  };

  it("matches the approved fold: a centred heading, then a revealing list of three cards with one link each", () => {
    const { container } = render(<CardGrid variant="guides" band heading={heading} items={items} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("is a band section named by its heading; the list reveals; the links lead to the hub's topics", () => {
    const { container } = render(<CardGrid variant="guides" band heading={heading} items={items} />);
    const section = container.querySelector("section")!;
    expect(section).toHaveClass("kh-section--band");
    expect(section).toHaveAttribute("aria-labelledby", "guides-title");
    expect(container.querySelector("ul.ks-guides")).toHaveAttribute("data-reveal");
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Read the talking guides" })).toHaveAttribute("href", "/stories#talking");
  });

  /* The approved guide link is one line of text, under 44 px tall, so it failed the tap-target check on Home at 360
     (task 4.6, from the 5.1 review). As the trust links do (trust-line.css, mockup.css:31), an invisible ::before
     reaches 12 px above and below it, 48 px in all, with no visual change; the markup stays the mockup's (no
     ks-card__link--tap, which would make the link 48 px tall and move the card). Scoped to the guides list. */
  it("gives each guide link a 44 px tap area with an invisible extension, scoped to the guides list", () => {
    expect(declarations(".ks-guides .kh-card__link")).toEqual(["position: relative"]);
    expect(declarations(".ks-guides .kh-card__link::before")).toEqual(['content: ""', "position: absolute", "inset: calc(var(--space-3) * -1) 0"]);
    expect(declarations(".kh-card__link::before")).toEqual([]);
    const { container } = render(<CardGrid variant="guides" band heading={heading} items={items} />);
    for (const a of container.querySelectorAll("a.kh-card__link")) expect(a.className).toBe("kh-card__link");
  });

  it("refuses a guide card with more than one link (the approved cards have one each)", () => {
    const two = [{ ...items[0], links: [items[0].links![0], items[1].links![0]] }];
    expect(() => render(<CardGrid variant="guides" heading={heading} items={two} />)).toThrow(/CardGrid/);
  });
});

describe("CardGrid: routes (contact fold 2)", () => {
  const fold = mockup("contact").querySelector('[aria-labelledby="routes-title"]')!;
  const items = cardsFrom(fold, ["question", "package", "users-three", "arrow-counter-clockwise", "shield-check"]);
  const heading = { title: "Pick the route that {hand:fits.}", id: "routes-title" };

  it("matches the approved fold: five route cards, each with its row of links at the foot", () => {
    const { container } = render(<CardGrid variant="routes" band heading={heading} items={items} />);
    expect(shape(container.firstElementChild!)).toEqual(shape(fold));
    expect(words(container.textContent)).toBe(words(fold.textContent));
  });

  it("keeps each link's own accessible name and makes every link a full tap target", () => {
    render(<CardGrid variant="routes" heading={heading} items={items} />);
    const order = screen.getByRole("link", { name: "Message us on WhatsApp about your order" });
    expect(order).toHaveAttribute("href", "https://wa.me/919187546483");
    for (const link of screen.getAllByRole("link")) expect(link).toHaveClass("kh-card__link", "ks-card__link--tap");
  });

  it("does not reveal (the contact page's cards are there at once, as approved)", () => {
    const { container } = render(<CardGrid variant="routes" heading={heading} items={items} />);
    expect(container.querySelector("[data-reveal]")).toBeNull();
  });
});

describe("CardGrid: plain", () => {
  it("lays plain cards in DS columns, with no list and no composition hook", () => {
    const { container } = render(
      <CardGrid variant="plain" columns={2} heading={{ title: "Two cards", id: "two-title" }} items={[{ title: "One" }, { title: "Two", body: "Words." }]} />,
    );
    const grid = container.querySelector(".kh-cols")!;
    expect(grid.tagName.toLowerCase()).toBe("div");
    expect(grid.className).toBe("kh-cols kh-cols--2");
    expect([...grid.children].map((c) => c.tagName.toLowerCase())).toEqual(["article", "article"]);
    expect(container.querySelector(".kh-heading")).not.toHaveClass("kh-heading--center");
  });
});
