import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrustList } from "./TrustList";

const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;
const TITLED = [
  { icon: icon("microphone"), title: "You’ll always see when it’s listening.", body: "A light on Kheelu shows whenever it’s listening." },
  { icon: icon("hand-heart"), title: "We don’t sell your data.", body: "Your child’s data is never used to advertise to them." },
];
const UNTITLED = [{ icon: icon("eye"), body: "Read every conversation in the parent app, word for word." }];

const root = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("TrustList", () => {
  it("renders a ul list as home.html fold 5 does: li.kh-trust__item > span.kh-trust__icon + div > p.kh-trust__body", () => {
    const list = root(<TrustList items={UNTITLED} />);
    expect(list.tagName).toBe("UL");
    expect(list.className).toBe("kh-trust ks-list-reset");
    const item = list.querySelector(":scope > li.kh-trust__item") as HTMLElement;
    expect(item).not.toBeNull();
    expect(item.children[0].className).toBe("kh-trust__icon");
    expect(item.children[0].firstElementChild?.getAttribute("data-icon")).toBe("eye");
    expect(item.children[1].tagName).toBe("DIV");
    expect(item.children[1].innerHTML).toBe('<p class="kh-trust__body">Read every conversation in the parent app, word for word.</p>');
  });

  it("puts each title in an h3 before its body", () => {
    render(<TrustList items={TITLED} />);
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles.map((h) => h.textContent)).toEqual(["You’ll always see when it’s listening.", "We don’t sell your data."]);
    expect(titles[0].className).toBe("kh-trust__title");
    expect(titles[0].nextElementSibling?.className).toBe("kh-trust__body");
  });

  it("renders a numbered list (safety.html, the guide's answers) as ol > li", () => {
    const list = root(<TrustList as="ol" items={TITLED} />);
    expect(list.tagName).toBe("OL");
    expect(list.className).toBe("kh-trust ks-list-reset");
    expect(list.querySelectorAll(":scope > li.kh-trust__item")).toHaveLength(2);
  });

  it("renders a block of articles (home.html fold 6) as div > article, with no list reset", () => {
    const list = root(<TrustList as="div" items={TITLED} />);
    expect(list.tagName).toBe("DIV");
    expect(list.className).toBe("kh-trust");
    expect(list.querySelectorAll(":scope > article.kh-trust__item")).toHaveLength(2);
  });

  it("renders the article facts (story-what-to-look-for…, mk-facts-list): div items, the title as a bold label inside the body", () => {
    const list = root(
      <TrustList variant="facts" bodyType="body" className="ks-facts-list" items={[{ icon: icon("microphone"), title: "The microphone.", body: "It turns on only when someone presses the wake-up button." }]} />,
    );
    expect(list.tagName).toBe("DIV");
    expect(list.className).toBe("kh-trust ks-facts-list");
    const item = list.querySelector(":scope > div.kh-trust__item") as HTMLElement;
    expect(item.children[0].className).toBe("kh-trust__icon");
    expect(item.children[1].outerHTML).toBe(
      '<p class="kh-trust__body ks-type-body"><strong class="kh-label">The microphone.</strong> It turns on only when someone presses the wake-up button.</p>',
    );
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("holds the facts list's photo inside the grid, after the items (story-what-to-look-for…, the belly unit)", () => {
    const list = root(
      <TrustList variant="facts" items={[{ icon: icon("clock"), title: "Certification.", body: "Applied for, not yet granted." }]}>
        <figure className="kh-photo kh-photo--square ks-belly" />
      </TrustList>,
    );
    expect([...list.children].map((c) => `${c.tagName}.${c.className}`)).toEqual(["DIV.kh-trust__item", "FIGURE.kh-photo kh-photo--square ks-belly"]);
  });

  it("refuses extra content inside a ul or ol list, where only list items may sit", () => {
    expect(() => render(<TrustList items={TITLED}><figure /></TrustList>)).toThrow(/div/);
    expect(() => render(<TrustList as="ol" items={TITLED}><figure /></TrustList>)).toThrow(/div/);
  });

  it("puts the bodyType step on every body (mockup-css-mapping rows 76-77)", () => {
    const list = root(<TrustList bodyType="body" items={TITLED} />);
    expect([...list.querySelectorAll(".kh-trust__body")].map((p) => p.className)).toEqual([
      "kh-trust__body ks-type-body",
      "kh-trust__body ks-type-body",
    ]);
  });

  it("reveals on scroll only when asked (data-reveal on the list)", () => {
    expect(root(<TrustList items={TITLED} />).hasAttribute("data-reveal")).toBe(false);
    expect(root(<TrustList reveal items={TITLED} />).getAttribute("data-reveal")).toBe("");
  });
});
