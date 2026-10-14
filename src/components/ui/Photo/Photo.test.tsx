import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import type { StaticImageData } from "next/image";
import { describe, expect, it, vi } from "vitest";
import { Photo } from "./Photo";

/* Photo (task 2.3; DS kh-photo, ADR-010). Rendered through the real next/image (the shared test setup mocks it),
   so the attributes asserted are the ones Next writes. */
vi.unmock("next/image");

const IRA = { src: { src: "/_next/static/media/ira-01.webp", width: 1208, height: 1500 } as StaticImageData, alt: "A laughing girl telling Kheelu a story." };
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

const img = (c: HTMLElement) => c.querySelector<HTMLImageElement>("figure > img")!;

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

  /* jsdom: Next adds no preload of its own (what the deprecated priority did). React's server renderer does hoist a
     preload for this image (it is eager and not fetchpriority low); the next test shows that one. */
  it("the page's LCP image: eager and fetchpriority high, and Next adds no preload of its own", () => {
    const { container, baseElement } = render(<Photo image={IRA} sizes={SIZES} lcp />);
    expect(img(container)).toHaveAttribute("loading", "eager");
    expect(img(container)).toHaveAttribute("fetchpriority", "high");
    expect(baseElement.ownerDocument.head.querySelector('link[rel="preload"]')).toBeNull();
  });

  it("on the server: the LCP image is the one React preloads, at high priority; a lazy photo is never preloaded", () => {
    const preloads = (html: string) => html.match(/<link rel="preload"[^>]*>/g) ?? [];
    const lcp = preloads(renderToStaticMarkup(<Photo image={IRA} sizes={SIZES} lcp />));
    expect(lcp).toHaveLength(1);
    expect(lcp[0]).toContain("ira-01.webp");
    expect(lcp[0]).toContain('fetchPriority="high"');
    expect(preloads(renderToStaticMarkup(<Photo image={IRA} sizes={SIZES} />))).toEqual([]);
  });

  /* fetchPriority sets only the image's fetchpriority attribute; it never changes how the image loads (it stays lazy)
     and never asks for high, which belongs to the LCP image alone (Photo.test-d.tsx refuses it). */
  it.each(["low", "auto"] as const)("fetchPriority=%s on an image that is not the LCP: still lazy, with that priority hint", (hint) => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} fetchPriority={hint} />);
    expect(img(container)).toHaveAttribute("loading", "lazy");
    expect(img(container)).toHaveAttribute("fetchpriority", hint);
  });

  it("the LCP image keeps its high priority whatever fetchPriority says", () => {
    const { container } = render(<Photo image={IRA} sizes={SIZES} lcp fetchPriority="low" />);
    expect(img(container)).toHaveAttribute("loading", "eager");
    expect(img(container)).toHaveAttribute("fetchpriority", "high");
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

/* The remote form (task 8b.2c; ADR-014, journal-pipeline §6): a journal post's uploaded image, by its exact address
   under the API's public image path, with its stated size. It goes through Next's image optimiser like any photo, so
   every address the browser is given is this site's own `/_next/image`: the reader's browser never contacts the API
   (next.config.ts admits that path alone in `images.remotePatterns`, task 8b.2b). */
describe("Photo: a journal upload (the remote form)", () => {
  const UPLOAD = { src: "https://api.kheelona.com/v1/public/blog/images/cover-1.jpg", width: 1200, height: 800, alt: "A child stacking blocks." } as const;
  const SAME_SITE = /^\/_next\/image\?url=https%3A%2F%2Fapi\.kheelona\.com%2Fv1%2Fpublic%2Fblog%2Fimages%2Fcover-1\.jpg&w=\d+&q=75$/;

  it("is a kh-photo with its stated size and alt text, every source served through this site's optimiser", () => {
    const { container } = render(<Photo image={UPLOAD} variant="wide" sizes={SIZES} />);
    expect(container.firstElementChild!.className).toBe("kh-photo kh-photo--wide");
    const image = img(container);
    expect(image).toHaveAttribute("alt", UPLOAD.alt);
    expect(image).toHaveAttribute("width", "1200");
    expect(image).toHaveAttribute("height", "800");
    expect(image.getAttribute("src")).toMatch(SAME_SITE);
    const candidates = image.getAttribute("srcset")!.split(", ").map((c) => c.split(" ")[0]);
    expect(candidates.length).toBeGreaterThan(1);
    for (const url of candidates) expect(url).toMatch(SAME_SITE);
  });

  it("follows Photo's loading rules: lazy by default, eager at high priority as the LCP image", () => {
    expect(img(render(<Photo image={UPLOAD} sizes={SIZES} />).container)).toHaveAttribute("loading", "lazy");
    const lcp = img(render(<Photo image={UPLOAD} sizes={SIZES} lcp />).container);
    expect(lcp).toHaveAttribute("loading", "eager");
    expect(lcp).toHaveAttribute("fetchpriority", "high");
  });

  it("carries its own ratio in the bare form, from its stated size", () => {
    const bare = render(<Photo bare image={UPLOAD} sizes={SIZES} />).container.firstElementChild as HTMLImageElement;
    expect(bare.style.getPropertyValue("--kh-ratio")).toBe("1200 / 800");
  });
});

/* The bare form (task 3.6 item 18; architecture §10): the image alone, with Photo's loading and sizes rules and no
   figure, frame or crop, for a DS raster a section places itself (ModesSection's "Good to know" photo,
   meet-kheelu.html fold 4, `img.mk-know__img`). Sections never render next/image directly. */
describe("Photo: the bare form", () => {
  const bare = (c: HTMLElement) => c.firstElementChild as HTMLImageElement;

  it("is the next/image alone: no figure, the section's class on the image, the alt text", () => {
    const { container } = render(<Photo bare image={IRA} sizes={SIZES} className="ks-know__img" />);
    expect(container.children).toHaveLength(1);
    expect(bare(container).tagName.toLowerCase()).toBe("img");
    expect(bare(container).getAttribute("class")).toBe("ks-know__img");
    expect(bare(container)).toHaveAttribute("alt", IRA.alt);
    expect(bare(container)).toHaveAttribute("width", "1208");
    expect(bare(container)).toHaveAttribute("height", "1500");
    expect(container.querySelector("figure")).toBeNull();
  });

  it("carries no frame class and no crop", () => {
    const { container } = render(<Photo bare image={IRA} sizes={SIZES} />);
    expect(bare(container)).not.toHaveAttribute("class");
    expect(container.querySelector("figure")).toBeNull();
  });

  /* next/image's renditions have whole-pixel heights (389 x 397 at 256 px wide is 256 x 261, not 261.26), so an image
     whose height follows its rendition moves the folds below by a fraction of a pixel. The bare image carries its own
     ratio as the DS ratio variable, which the section's class reads as its aspect-ratio (ModesSection's ks-know__img;
     task 4.6). A framed photo never does unless asked: the DS frame crops to its own ratio. */
  it("carries the DS ratio variable from its own width and height, a static import's or a site path's stated size", () => {
    expect(bare(render(<Photo bare image={IRA} sizes={SIZES} />).container).style.getPropertyValue("--kh-ratio")).toBe("1208 / 1500");
    const path = bare(render(<Photo bare image={{ src: "/team/aman.jpg", width: 600, height: 750, alt: "Aman" }} sizes="96px" />).container);
    expect(path.style.getPropertyValue("--kh-ratio")).toBe("600 / 750");
  });

  it("leaves a framed photo's ratio to the DS frame (the crop): no ratio variable unless asked", () => {
    for (const props of [{}, { variant: "wide" as const }, { variant: "square" as const }, { xl: true }]) {
      expect(img(render(<Photo image={IRA} sizes={SIZES} {...props} />).container).style.getPropertyValue("--kh-ratio")).toBe("");
    }
  });

  it("follows Photo's loading rules: the layout's sizes, lazy by default, fetchPriority as a hint only", () => {
    const lazy = bare(render(<Photo bare image={IRA} sizes={SIZES} />).container);
    expect(lazy).toHaveAttribute("sizes", SIZES);
    expect(lazy.getAttribute("srcset")).toMatch(/ \d+w(,|$)/);
    expect(lazy).toHaveAttribute("loading", "lazy");
    expect(lazy).not.toHaveAttribute("fetchpriority");
    const low = bare(render(<Photo bare image={IRA} sizes={SIZES} fetchPriority="low" />).container);
    expect(low).toHaveAttribute("loading", "lazy");
    expect(low).toHaveAttribute("fetchpriority", "low");
  });

  it("as a page's LCP image: eager and fetchpriority high", () => {
    const lcp = bare(render(<Photo bare image={IRA} sizes={SIZES} lcp fetchPriority="low" />).container);
    expect(lcp).toHaveAttribute("loading", "eager");
    expect(lcp).toHaveAttribute("fetchpriority", "high");
  });
});
