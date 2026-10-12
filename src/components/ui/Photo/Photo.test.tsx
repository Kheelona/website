import { render } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { Photo } from "./Photo";

/* Photo (task 2.3; DS kh-photo, ADR-010). Rendered through the real next/image (the shared test setup mocks it),
   so the attributes asserted are the ones Next writes. */
vi.unmock("next/image");

const IRA = { src: { src: "/_next/static/media/ira-01.webp", width: 1208, height: 1500 } as StaticImageData, alt: "A laughing girl telling Kheelu a story." };
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

const img = (c: HTMLElement) => c.querySelector("figure > img")!;

describe("Photo: markup", () => {
  it("is a kh-photo figure holding one next/image with the alt text", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} />);
    const figure = container.firstElementChild!;
    expect(figure.tagName.toLowerCase()).toBe("figure");
    expect(figure.className).toBe("kh-photo");
    expect(figure.children).toHaveLength(1);
    expect(img(container)).toHaveAttribute("alt", IRA.alt);
    expect(img(container)).toHaveAttribute("width", "1208");
    expect(img(container)).toHaveAttribute("height", "1500");
  });

  it.each([
    ["wide", { variant: "wide" as const }, "kh-photo kh-photo--wide"],
    ["square", { variant: "square" as const }, "kh-photo kh-photo--square"],
    ["xl", { xl: true }, "kh-photo kh-photo--xl"],
    // meet-kheelu.html:141: class order base, ratio, xl, then the section's own class.
    ["square xl with a section class", { variant: "square" as const, xl: true, className: "ks-offer-photo" }, "kh-photo kh-photo--square kh-photo--xl ks-offer-photo"],
  ])("variant %s", (_name, props, classes) => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} {...props} />);
    expect(container.firstElementChild!.className).toBe(classes);
  });

  it("takes a caption as a plain figcaption after the image (setup.html:101)", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} caption="The parent app’s activity screen." />);
    const figure = container.firstElementChild!;
    expect(figure.lastElementChild!.tagName.toLowerCase()).toBe("figcaption");
    expect(figure.lastElementChild).toHaveTextContent("The parent app’s activity screen.");
    expect(figure.lastElementChild).not.toHaveAttribute("class");
  });

  it("sets the DS ratio variable on the image only when asked (setup.html:100)", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} ratio="576 / 1209" />);
    expect(img(container).style.getPropertyValue("--kh-ratio")).toBe("576 / 1209");
    const plain = render(<Photo image={IRA} sizes={SIZES} />);
    expect(img(plain.container).style.getPropertyValue("--kh-ratio")).toBe("");
  });

  it("marks a block that reveals on scroll", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} reveal />);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "");
    expect(render(<Photo image={IRA} sizes={SIZES} />).container.firstElementChild).not.toHaveAttribute("data-reveal");
  });
});

describe("Photo: loading (ADR-010, N12)", () => {
  it("passes the layout's sizes and lets Next build the width srcset", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} />);
    expect(img(container)).toHaveAttribute("sizes", SIZES);
    expect(img(container).getAttribute("srcset")).toMatch(/ \d+w(,|$)/);
  });

  it("lazy-loads by default, with no priority hint", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} />);
    expect(img(container)).toHaveAttribute("loading", "lazy");
    expect(img(container)).not.toHaveAttribute("fetchpriority");
  });

  it("the page's LCP image: eager and fetchpriority high, and no preload (the deprecated priority's effect)", () => {
    const { container, baseElement } = render(<Photo image={IRA} sizes={SIZES} lcp />);
    expect(img(container)).toHaveAttribute("loading", "eager");
    expect(img(container)).toHaveAttribute("fetchpriority", "high");
    expect(baseElement.ownerDocument.head.querySelector('link[rel="preload"]')).toBeNull();
  });

  it("an image that is neither: a lower priority when asked (film posters, N19)", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} fetchPriority="low" />);
    expect(img(container)).toHaveAttribute("loading", "lazy");
    expect(img(container)).toHaveAttribute("fetchpriority", "low");
  });

  it("refuses an LCP image that would fade in on scroll (D049 pick 2: the hero never moves)", () => {
    expect(() => render(<Photo image={IRA} sizes={SIZES} lcp reveal />)).toThrow(/LCP/);
  });

  it("takes a site path with its stated size", () => {
    const { container } = render(<Photo image={{ src: "/team/aman.jpg", width: 600, height: 750, alt: "Aman" }} sizes="96px" />);
    expect(img(container)).toHaveAttribute("width", "600");
    expect(img(container)).toHaveAttribute("height", "750");
  });
});
