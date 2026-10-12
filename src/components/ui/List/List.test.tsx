import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { List } from "./List";

const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;
const chevron = icon("caret-right");
const root = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("List", () => {
  it("renders the 404's link rows as 404.html does: a > icon tile, text (title, sub), chevron", () => {
    const ul = root(
      <List
        chevron={chevron}
        className="ks-404__list"
        items={[{ title: "Home", sub: "What Kheelu is, on one page.", href: "/", icon: icon("house"), tone: "sun" }]}
      />,
    );
    expect(ul.tagName).toBe("UL");
    expect(ul.className).toBe("kh-list ks-list-reset ks-404__list");
    const a = ul.querySelector(":scope > li > a") as HTMLElement;
    expect(a.className).toBe("kh-listitem kh-tone-sun");
    expect(a.getAttribute("href")).toBe("/");
    expect([...a.children].map((c) => c.className)).toEqual(["kh-listitem__icon", "kh-listitem__text", "kh-listitem__chev"]);
    expect(a.children[0].getAttribute("aria-hidden")).toBe("true");
    expect(a.children[2].getAttribute("aria-hidden")).toBe("true");
    expect(a.children[1].innerHTML).toBe('<span class="kh-listitem__title">Home</span><span class="kh-listitem__sub">What Kheelu is, on one page.</span>');
  });

  it("names each row link by its words (title and line), never by the decoration", () => {
    render(<List chevron={chevron} items={[{ title: "Stories", sub: "Guides for parents.", href: "/stories", icon: icon("book-open") }]} />);
    // jsdom loads no CSS, so it joins the two inline spans without the space a browser gives the grid items
    expect(screen.getByRole("link", { name: /^Stories\s?Guides for parents\.$/ })).toBeInTheDocument();
  });

  it("renders the related-guide rows (title only, then the chevron)", () => {
    const ul = root(<List chevron={chevron} items={[{ title: "Raising a bilingual child in India", href: "/stories#talking" }]} />);
    const a = ul.querySelector("a") as HTMLElement;
    expect(a.className).toBe("kh-listitem");
    expect([...a.children].map((c) => c.className)).toEqual(["kh-listitem__text", "kh-listitem__chev"]);
  });

  it("renders rows without a link as the hub's quiet rows: li.kh-listitem > div text with an h3 title and a p line", () => {
    const ul = root(<List titleAs="h3" items={[{ title: "Busy hands, no screens", sub: "Screen-free ways to keep a young child busy." }]} />);
    const li = ul.firstElementChild as HTMLElement;
    expect(li.className).toBe("kh-listitem");
    expect(li.innerHTML).toBe(
      '<div class="kh-listitem__text"><h3 class="kh-listitem__title">Busy hands, no screens</h3><p class="kh-listitem__sub">Screen-free ways to keep a young child busy.</p></div>',
    );
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("puts a heading title inside a link row when the page's outline asks for it", () => {
    render(<List titleAs="h3" chevron={chevron} items={[{ title: "How much screen time is okay?", href: "/stories/screen-time" }]} />);
    expect(screen.getByRole("heading", { level: 3 }).className).toBe("kh-listitem__title");
  });

  it("shows meta text after the words when given", () => {
    const ul = root(<List chevron={chevron} items={[{ title: "Late talker?", href: "/x", meta: "3 min read" }]} />);
    expect(ul.querySelector(".kh-listitem__text + .kh-listitem__meta")?.textContent).toBe("3 min read");
  });

  it("takes an accessible name for the list when the page gives one", () => {
    render(<List label="Where to go next" items={[{ title: "Home", href: "/" }]} />);
    expect(screen.getByRole("list", { name: "Where to go next" })).toBeInTheDocument();
  });
});
