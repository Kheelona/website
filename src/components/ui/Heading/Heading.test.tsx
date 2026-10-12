import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Offer } from "@/content/types";
import { Heading } from "./Heading";

describe("Heading: the DS SectionHeading as the mockup marks it up", () => {
  it("renders the Home hero heading (home.html fold 1)", () => {
    expect(
      renderToStaticMarkup(
        <Heading
          hero
          level={1}
          id="hero-title"
          eyebrow="Ages 3 to 7"
          title="Kheelu answers every why. Then it {hand:asks one back.}"
          lead="A screen-free plush toy by Kheelona. It answers your child first, then asks a question back, so they do the thinking."
        />,
      ),
    ).toBe(
      '<header class="kh-heading kh-heading--hero"><p class="kh-eyebrow">Ages 3 to 7</p>' +
        '<h1 class="kh-heading__title" id="hero-title">Kheelu answers every why. Then it <span class="kh-hand">asks one back.</span></h1>' +
        '<p class="kh-heading__lead">A screen-free plush toy by Kheelona. It answers your child first, then asks a question back, so they do the thinking.</p></header>',
    );
  });

  it("renders a centred section heading (home.html fold 2)", () => {
    expect(
      renderToStaticMarkup(
        <Heading
          align="center"
          id="ask-title"
          eyebrow="See it ask"
          title="Kheelu asks. Watch them {hand:think.}"
          lead="Real children, real families. Press play on any of them."
        />,
      ),
    ).toBe(
      '<header class="kh-heading kh-heading--center"><p class="kh-eyebrow">See it ask</p>' +
        '<h2 class="kh-heading__title" id="ask-title">Kheelu asks. Watch them <span class="kh-hand">think.</span></h2>' +
        '<p class="kh-heading__lead">Real children, real families. Press play on any of them.</p></header>',
    );
  });

  it("aligns left by default and takes the DS's own align values (SectionHeading: left, center)", () => {
    expect(renderToStaticMarkup(<Heading align="left" title="Screen time" />)).toBe(
      '<header class="kh-heading"><h2 class="kh-heading__title">Screen time</h2></header>',
    );
  });

  it("is an h2 with the title alone by default (stories.html topic headings)", () => {
    expect(renderToStaticMarkup(<Heading title="Screen time" id="screen-time-title" />)).toBe(
      '<header class="kh-heading"><h2 class="kh-heading__title" id="screen-time-title">Screen time</h2></header>',
    );
  });

  it("takes levels 1 to 3", () => {
    render(
      <>
        <Heading level={1} title="One" />
        <Heading level={2} title="Two" />
        <Heading level={3} title="Three" />
      </>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Two" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Three" })).toBeInTheDocument();
  });

  it("adds a composition class last and puts extra content after the lead (contact.html hero)", () => {
    const { container } = render(
      <Heading title="Talk to us" lead="We reply within a day." className="ks-store-top__head">
        <p className="kh-body-l">Or write to us.</p>
      </Heading>,
    );
    const header = container.querySelector("header")!;
    expect(header.className).toBe("kh-heading ks-store-top__head");
    expect([...header.children].map((el) => el.className)).toEqual(["kh-heading__title", "kh-heading__lead", "kh-body-l"]);
  });

  it("steps the title on an inner block span where a compound DS rule beats a class on the h1 (mapping row 81)", () => {
    const html = renderToStaticMarkup(
      <Heading hero level={1} id="story-title" titleStepXl="display-l" title="Learning toys for a {hand:three-year-old}" />,
    );
    expect(html).toBe(
      '<header class="kh-heading kh-heading--hero"><h1 class="kh-heading__title" id="story-title">' +
        '<span class="ks-heading__step ks-type-display-l@xl">Learning toys for a <span class="kh-hand">three-year-old</span></span></h1></header>',
    );
  });

  it("can be a div, as the article heads are (story-learning-toys-for-a-three-year-old.html)", () => {
    const html = renderToStaticMarkup(<Heading as="div" hero level={1} title="Learning toys" />);
    expect(html).toBe('<div class="kh-heading kh-heading--hero"><h1 class="kh-heading__title">Learning toys</h1></div>');
  });

  it("names the heading by its words, accent included", () => {
    render(<Heading level={1} title="Kheelu answers every why. Then it {hand:asks one back.}" />);
    expect(screen.getByRole("heading", { name: "Kheelu answers every why. Then it asks one back." })).toBeInTheDocument();
  });

  it("passes the offer to its strings", () => {
    const offer = { mode: "token", prices: { token: "₹499" } } as unknown as Offer;
    render(<Heading title="Reserve for {price:token}" lead="Then {price:token} holds it" offer={offer} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Reserve for ₹499");
    expect(screen.getByText("Then ₹499 holds it")).toHaveClass("kh-heading__lead");
  });
});
