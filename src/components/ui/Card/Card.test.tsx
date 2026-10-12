import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, TYPE_STEPS, typeStepClass } from "./Card";

describe("TYPE_STEPS", () => {
  /* The generated type steps (task 1.2, from the 19 kh- type classes in tokens.css): a step the prop accepts must
     exist as a class, and every generated base class must be selectable, so the union cannot drift from the DS. */
  const css = readFileSync(join(process.cwd(), "src/styles/generated/type-steps.css"), "utf8");
  const generated = [...new Set([...css.matchAll(/^\.ks-type-([a-z0-9-]+) \{/gm)].map((m) => m[1]))].sort();

  it("equals the base classes of src/styles/generated/type-steps.css", () => {
    expect(generated.length).toBe(19);
    expect([...TYPE_STEPS].sort()).toEqual(generated);
  });

  it("maps a step to its class, and nothing to nothing", () => {
    expect(typeStepClass("subtitle")).toBe("ks-type-subtitle");
    expect(typeStepClass(undefined)).toBeUndefined();
  });
});

const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;
const card = (ui: React.ReactElement) => render(ui).container.firstElementChild as HTMLElement;

describe("Card", () => {
  it("renders the feature card as home.html fold 3 does: article.kh-card.kh-card--tint.kh-tone-sun > icon, h3, p", () => {
    const el = card(
      <Card
        variant="tint"
        tone="sun"
        icon={icon("question")}
        title="Where Kheelu comes in"
        body="Kheelu is built around the same idea: it answers your child, then asks a question back."
      />,
    );
    expect(el.tagName).toBe("ARTICLE");
    expect(el.className).toBe("kh-card kh-card--tint kh-tone-sun");
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual([
      "SPAN.kh-card__icon",
      "H3.kh-card__title",
      "P.kh-card__body",
    ]);
    expect(el.querySelector(".kh-card__icon > svg")?.getAttribute("data-icon")).toBe("question");
  });

  it.each([
    ["plain", "kh-card kh-tone-blue"],
    ["tint", "kh-card kh-card--tint kh-tone-blue"],
    ["block", "kh-card kh-card--block kh-tone-blue"],
  ] as const)("the %s variant carries the DS modifier", (variant, classes) => {
    expect(card(<Card variant={variant} tone="blue" title="AI mode" />).className).toBe(classes);
  });

  it("renders as the element the mockup uses (li in a guides list, section, div)", () => {
    expect(card(<Card as="li" title="Screen time" />).tagName).toBe("LI");
    expect(card(<Card as="section" title="How long we keep it" />).tagName).toBe("SECTION");
    expect(card(<Card as="div" title="x" />).tagName).toBe("DIV");
  });

  it("ends with its link: the label, then the arrow (home.html fold 7b)", () => {
    const el = card(<Card title="Screen time" link={{ href: "/stories#screen-time", label: "Read the screen-time guides", icon: icon("arrow-right") }} />);
    const link = screen.getByRole("link", { name: "Read the screen-time guides" });
    expect(link).toBe(el.lastElementChild);
    expect(link.className).toBe("kh-card__link");
    expect(link).toHaveAttribute("href", "/stories#screen-time");
    expect(link.lastElementChild?.getAttribute("data-icon")).toBe("arrow-right");
  });

  it("gives a link its own accessible name where the copy asks for one", () => {
    render(<Card title="Screen time" link={{ href: "/stories#screen-time", label: "Read more", ariaLabel: "Read the screen-time guides" }} />);
    expect(screen.getByRole("link", { name: "Read the screen-time guides" })).toHaveAttribute("href", "/stories#screen-time");
  });

  it("ends with a links row as contact.html:53 does: p.ks-card-links > two tap-target links, after the body", () => {
    const el = card(
      <Card
        tone="sun"
        icon={icon("arrow-counter-clockwise")}
        title="Returns, refunds and delivery"
        body="7-day returns, no questions asked, and a 6-month warranty. Delivery is included anywhere in India."
        links={[
          { href: "/refund", label: "Refunds and returns", icon: icon("arrow-right") },
          { href: "/shipping", label: "Shipping", icon: icon("arrow-right") },
        ]}
      />,
    );
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual([
      "SPAN.kh-card__icon",
      "H3.kh-card__title",
      "P.kh-card__body",
      "P.ks-card-links",
    ]);
    const row = el.lastElementChild as HTMLElement;
    expect([...row.children].map((a) => [a.tagName, a.className, a.getAttribute("href"), a.textContent])).toEqual([
      ["A", "kh-card__link ks-card__link--tap", "/refund", "Refunds and returns"],
      ["A", "kh-card__link ks-card__link--tap", "/shipping", "Shipping"],
    ]);
    expect(row.querySelectorAll("a > svg[data-icon='arrow-right']")).toHaveLength(2);
  });

  it("names a row link by its own label where the copy gives one (contact.html:41, About your order)", () => {
    render(
      <Card
        title="About your order"
        links={[{ href: "https://wa.me/919187546483", label: "Message us on WhatsApp", ariaLabel: "Message us on WhatsApp about your order" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Message us on WhatsApp about your order" })).toHaveAttribute("href", "https://wa.me/919187546483");
  });

  it("refuses a single link and a links row together", () => {
    expect(() => render(<Card title="x" link={{ href: "/a", label: "A" }} links={[{ href: "/b", label: "B" }]} />)).toThrow(/link and links/);
  });

  it("renders no empty row for an empty links list", () => {
    expect(card(<Card title="x" links={[]} />).querySelector(".ks-card-links")).toBeNull();
  });

  it("adds the full tap target (DS gap G-01) only when asked: contact, team and hub cards", () => {
    render(<Card title="x" link={{ href: "/refund", label: "Refunds and returns", tap: true }} />);
    expect(screen.getByRole("link").className).toBe("kh-card__link ks-card__link--tap");
  });

  it("sets the hub card title in the subtitle step (titleType; mockup-css-mapping rows 63-64)", () => {
    render(<Card title="Late talker? What helps a child find their words" titleType="subtitle" />);
    expect(screen.getByRole("heading", { level: 3 }).className).toBe("kh-card__title ks-type-subtitle");
  });

  it("puts media first (the hub's guide photo), before the title", () => {
    const el = card(<Card media={<figure className="kh-photo kh-photo--wide" />} title="Late talker?" body="What helps." />);
    expect([...el.children].map((c) => c.tagName)).toEqual(["FIGURE", "H3", "P"]);
  });

  it("groups the words beside the icon for the product page's row cards (meet-kheelu.html fold 4)", () => {
    const el = card(<Card tone="blue" icon={icon("wifi-high")} title="AI mode" body="Open conversation." groupText />);
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual(["SPAN.kh-card__icon", "DIV."]);
    expect([...el.children[1].children].map((c) => c.className)).toEqual(["kh-card__title", "kh-card__body"]);
  });

  it("renders the product page's Good to know card (meet-kheelu.html fold 4): a classed text group, then the photo", () => {
    const el = card(
      <Card
        variant="tint"
        tone="sun"
        className="ks-know"
        title="Good to know"
        titleId="know-title"
        labelledBy="know-title"
        groupText
        groupClassName="ks-know__text"
        after={<figure className="ks-know__img" />}
      >
        <ul className="ks-ticks" />
      </Card>,
    );
    expect(el.className).toBe("kh-card kh-card--tint kh-tone-sun ks-know");
    expect([...el.children].map((c) => `${c.tagName}.${c.className}`)).toEqual(["DIV.ks-know__text", "FIGURE.ks-know__img"]);
    expect([...el.children[0].children].map((c) => `${c.tagName}.${c.className}`)).toEqual(["H3.kh-card__title", "UL.ks-ticks"]);
  });

  it("puts the trailing slot last, after the link", () => {
    const el = card(<Card title="x" link={{ href: "/x", label: "More" }} after={<figure />} />);
    expect([...el.children].map((c) => c.tagName)).toEqual(["H3", "A", "FIGURE"]);
  });

  it("refuses a group class without the text group", () => {
    expect(() => render(<Card title="x" groupClassName="ks-know__text" />)).toThrow(/groupText/);
  });

  it("is named by its own heading when asked (aria-labelledby on the card, id on the h3)", () => {
    const el = card(<Card as="section" title="Good to know" titleId="know-title" labelledBy="know-title" />);
    expect(el.getAttribute("aria-labelledby")).toBe("know-title");
    expect(screen.getByRole("region", { name: "Good to know" })).toBe(el);
  });

  it("renders a second-level title where the card is a section's own heading", () => {
    render(<Card title="What you are agreeing to" titleAs="h2" />);
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-card__title");
  });

  it("keeps extra content after the body and before the link, and the parent's class", () => {
    const el = card(
      <Card title="Screen-free" body="Kheelu: Yes" className="ks-compare-card" link={{ href: "/x", label: "More" }}>
        <ul className="kh-body-s" />
      </Card>,
    );
    expect(el.className).toBe("kh-card ks-compare-card");
    expect([...el.children].map((c) => c.tagName)).toEqual(["H3", "P", "UL", "A"]);
  });

  it("reveals on scroll only when asked", () => {
    expect(card(<Card title="x" />).hasAttribute("data-reveal")).toBe(false);
    expect(card(<Card title="x" reveal />).getAttribute("data-reveal")).toBe("");
  });
});
