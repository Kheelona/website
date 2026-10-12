import { render } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { AppScreens } from "./AppScreens";

/* AppScreens (task 2.3; DS Device frame kh-device; D044, D046 equal phone sizes). Approved markup: Home
   home.html:219-225 (two) and 246-249 (one), product meet-kheelu.html:215-221 (two) and 245-248 (solo). Rendered
   through the real next/image. */
vi.unmock("next/image");

const shot = (name: string, alt: string) => ({
  src: { src: `/_next/static/media/${name}.webp`, width: 576, height: 1209 } as StaticImageData,
  alt,
});
const TRANSCRIPT = shot("app-transcript", "The parent app showing one conversation word for word.");
const ACTIVITY = shot("app-activity", "The parent app's activity screen for today.");
const PRIVACY = shot("app-privacy", "The parent app's privacy centre.");
const CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";
const SIZES = "(min-width: 900px) 280px, calc((100vw - 48px) / 2)";

/** The element tree as "tag.class class" lines, depth-indented, so the structure is compared as a whole. */
function tree(el: Element, depth = 0): string[] {
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${el.getAttribute("class") ? `.${el.getAttribute("class")!.split(" ").join(".")}` : ""}`;
  return [line, ...[...el.children].flatMap((c) => tree(c, depth + 1))];
}

describe("AppScreens: Home", () => {
  it("two phones: a row of two DS device frames, then the caption", () => {
    const { container } = render(<AppScreens variant="home" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} caption={CAPTION} />);
    expect(tree(container.firstElementChild!)).toEqual([
      "figure.ks-shots",
      "  div.ks-shots__row",
      "    div.kh-device.ks-shot",
      "      div.kh-device__screen",
      "        img",
      "    div.kh-device.ks-shot",
      "      div.kh-device__screen",
      "        img",
      "  figcaption.kh-caption",
    ]);
    expect(container.querySelector("figcaption")).toHaveTextContent(CAPTION);
  });

  it("one phone: the same row, marked --one, so it takes the width of each of the two (D046)", () => {
    const { container } = render(<AppScreens variant="home" screens={[PRIVACY]} sizes={SIZES} caption={CAPTION} />);
    expect(tree(container.firstElementChild!)).toEqual([
      "figure.ks-shots",
      "  div.ks-shots__row.ks-shots__row--one",
      "    div.kh-device.ks-shot",
      "      div.kh-device__screen",
      "        img",
      "  figcaption.kh-caption",
    ]);
  });
});

describe("AppScreens: product", () => {
  it("two phones: the product frame (ks-shots--product) around the same row", () => {
    const { container } = render(<AppScreens variant="product" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} caption={CAPTION} />);
    const lines = tree(container.firstElementChild!);
    expect(lines[0]).toBe("figure.ks-shots.ks-shots--product");
    expect(lines.slice(1)).toEqual([
      "  div.ks-shots__row",
      "    div.kh-device.ks-shot",
      "      div.kh-device__screen",
      "        img",
      "    div.kh-device.ks-shot",
      "      div.kh-device__screen",
      "        img",
      "  figcaption.kh-caption",
    ]);
  });

  it("one phone: solo, the device straight in the figure", () => {
    const { container } = render(<AppScreens variant="product" screens={[PRIVACY]} sizes={SIZES} caption={CAPTION} />);
    expect(tree(container.firstElementChild!)).toEqual([
      "figure.ks-shots.ks-shots--product.ks-shots--solo",
      "  div.kh-device.ks-shot",
      "    div.kh-device__screen",
      "      img",
      "  figcaption.kh-caption",
    ]);
  });
});

describe("AppScreens: safety page", () => {
  /* safety.html:87-93: `figure.mk-sf-shot > div.kh-device > div.kh-device__screen > img`, then the caption. The DS
     frame as it is (no compact ks-shot frame), at the page's own width (safety.css:25-29). */
  it("one phone in the plain DS device frame, then the caption", () => {
    const { container } = render(<AppScreens variant="safety" screens={[PRIVACY]} sizes={SIZES} caption={CAPTION} />);
    expect(tree(container.firstElementChild!)).toEqual([
      "figure.ks-shots.ks-shots--safety",
      "  div.kh-device",
      "    div.kh-device__screen",
      "      img",
      "  figcaption.kh-caption",
    ]);
    expect(container.querySelector("figcaption")).toHaveTextContent(CAPTION);
  });

  it("renders the screen through next/image with its alt text and sizes, lazily", () => {
    const { container } = render(<AppScreens variant="safety" screens={[PRIVACY]} sizes={SIZES} />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", PRIVACY.alt);
    expect(img).toHaveAttribute("sizes", SIZES);
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).not.toHaveAttribute("fetchpriority");
  });

  it("reveals on scroll as the mockup marks it, and takes a section class", () => {
    const { container } = render(<AppScreens variant="safety" screens={[PRIVACY]} sizes={SIZES} reveal className="ks-x" />);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "");
    expect(container.firstElementChild!.className).toBe("ks-shots ks-shots--safety ks-x");
  });
});

describe("AppScreens: images and options", () => {
  it("renders each screen through next/image with its alt text, the phone's sizes, lazily", () => {
    const { container } = render(<AppScreens variant="home" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} />);
    const imgs = [...container.querySelectorAll("img")];
    expect(imgs.map((i) => i.getAttribute("alt"))).toEqual([TRANSCRIPT.alt, ACTIVITY.alt]);
    for (const img of imgs) {
      expect(img).toHaveAttribute("sizes", SIZES);
      expect(img).toHaveAttribute("width", "576");
      expect(img).toHaveAttribute("height", "1209");
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).not.toHaveAttribute("fetchpriority");
      expect(img.getAttribute("srcset")).toMatch(/ \d+w(,|$)/);
    }
  });

  it("asks one phone for the same image size as each of two (equal phones, D046)", () => {
    const one = render(<AppScreens variant="home" screens={[PRIVACY]} sizes={SIZES} />).container.querySelector("img")!;
    const two = render(<AppScreens variant="home" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} />).container.querySelector("img")!;
    expect(one.getAttribute("sizes")).toBe(two.getAttribute("sizes"));
  });

  it("has no caption when none is given", () => {
    const { container } = render(<AppScreens variant="home" screens={[PRIVACY]} sizes={SIZES} />);
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("marks a block that reveals on scroll, and takes a section class", () => {
    const { container } = render(<AppScreens variant="product" screens={[PRIVACY]} sizes={SIZES} reveal className="ks-x" />);
    expect(container.firstElementChild).toHaveAttribute("data-reveal", "");
    expect(container.firstElementChild!.className).toBe("ks-shots ks-shots--product ks-shots--solo ks-x");
  });
});
