import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STORE_URL } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { SiteShell } from "./SiteShell";

/* SiteShell (task 3.1; architecture §5.1, structure §3.1): the marketing site's shell, rendered by
 * src/app/(site)/layout.tsx and by the root not-found page. Its chrome is compared element by element with the same
 * elements of the approved mockup's built Home (mockup/home.html, D046): tag, classes (mk- renamed ks-), attributes,
 * order and text, with every word, link and price from content. Pixel parity of the same elements is
 * test/e2e/chrome.spec.ts's. */

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
afterEach(() => {
  nav.pathname = "/";
});

const mockup = new DOMParser().parseFromString(readFileSync("mockup/home.html", "utf8"), "text/html");
const offer = buildOffer("token");

/** The mockup links its pages by file name; the site by path, and the store by STORE_URL. */
function realHref(href: string): string {
  if (href === "store.html") return STORE_URL;
  if (href === "home.html") return "/";
  if (href === "meet-kheelu.html") return "/products/kheelu";
  const page = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  return page ? `/${page[1]}${page[2] ?? ""}` : href;
}

/** Attributes that are behaviour hooks, not markup: the mockup's script hook and the image source and width. */
const IGNORED = new Set(["data-open-menu", "src", "width", "inert"]);

function attributes(el: Element, side: "mockup" | "built"): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    if (IGNORED.has(a.name)) continue;
    let value = a.value;
    // is-hidden is the bar's state (the mockup ships it hidden; here its controller has already run).
    if (a.name === "class") value = value.replace(/\bmk-/g, "ks-").split(/\s+/).filter((c) => c !== "is-hidden").sort().join(" ");
    if (a.name === "href" && side === "mockup") value = realHref(value);
    out[a.name] = value;
  }
  return out;
}

/** Children as elements and whitespace-normalised text, with the mockup's data-src spans read as their text. */
function children(el: Element): Array<Element | string> {
  const out: Array<Element | string> = [];
  const pushText = (t: string) => {
    if (typeof out[out.length - 1] === "string") out[out.length - 1] += t;
    else out.push(t);
  };
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3) pushText(node.textContent ?? "");
    else if (node instanceof Element && node.hasAttribute("data-src")) pushText(node.textContent ?? "");
    else if (node instanceof Element) out.push(node);
  }
  return out.map((c) => (typeof c === "string" ? c.replace(/\s+/g, " ") : c)).filter((c) => typeof c !== "string" || c.trim() !== "")
    .map((c) => (typeof c === "string" ? c.trim() : c));
}

/**
 * Known content deviation, reported to the main session (task 3.1 report): seller.ts writes the phone link as
 * `[{nowrap:+91 91875 46483}](tel:…)`, which RichText renders as `<a><span class="ks-nowrap">…</span></a>`; the mockup
 * puts the class on the link (`{nowrap:[…](tel:…)}` in RichText's syntax). Both keep the number on one line. Until the
 * content owner swaps the two, the comparison reads a link whose only child is a no-wrap span as the mockup's link.
 */
function hoistNowrap(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  for (const span of Array.from(copy.querySelectorAll("a > span.ks-nowrap"))) {
    const link = span.parentElement!;
    if (link.childNodes.length !== 1) continue;
    link.classList.add("ks-nowrap");
    link.replaceChildren(...Array.from(span.childNodes));
  }
  return copy;
}

/** Every difference between a built element and the mockup's, with the path to it. */
function differences(built: Element, ref: Element, path = ref.tagName.toLowerCase()): string[] {
  const out: string[] = [];
  if (built.tagName !== ref.tagName) return [`${path}: <${built.tagName.toLowerCase()}> instead of <${ref.tagName.toLowerCase()}>`];
  const a = attributes(built, "built");
  const b = attributes(ref, "mockup");
  for (const name of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (a[name] !== b[name]) out.push(`${path} [${name}]: ${JSON.stringify(a[name])} instead of ${JSON.stringify(b[name])}`);
  }
  const x = children(built);
  const y = children(ref);
  if (x.length !== y.length) {
    const show = (list: Array<Element | string>) => list.map((c) => (typeof c === "string" ? JSON.stringify(c) : `<${c.tagName.toLowerCase()}>`)).join(", ");
    return [...out, `${path}: children [${show(x)}] instead of [${show(y)}]`];
  }
  x.forEach((c, i) => {
    const r = y[i];
    const say = (v: Element | string) => (typeof v === "string" ? JSON.stringify(v) : `<${v.tagName.toLowerCase()}>`);
    if (typeof c === "string" || typeof r === "string") {
      if (c !== r) out.push(`${path} child ${i}: ${say(c)} instead of ${say(r)}`);
    } else out.push(...differences(c, r, `${path} > ${r.tagName.toLowerCase()}:nth(${i})`));
  });
  return out;
}

function shell(stickyBar: readonly string[] = ["/"]) {
  return render(
    <SiteShell offer={offer} stickyBar={stickyBar}>
      <p>page</p>
    </SiteShell>,
  );
}

describe("SiteShell: the chrome equals the approved mockup's (mockup/home.html)", () => {
  it.each([
    ["skip link", "a.kh-btn--secondary", "a.ks-skip"],
    ["navigation", "nav.kh-nav", "nav.kh-nav"],
    ["footer", "footer.kh-footer", "footer.kh-footer"],
    ["menu drawer", "dialog.kh-drawer", "dialog.kh-drawer"],
    ["phone buy bar", ".kh-buybar", ".kh-buybar"],
  ])("%s", (_name, mockupSelector, builtSelector) => {
    const { container } = shell();
    const ref = mockup.querySelector(mockupSelector);
    const built = container.querySelector(builtSelector);
    expect(ref, mockupSelector).not.toBeNull();
    expect(built, builtSelector).not.toBeNull();
    expect(differences(hoistNowrap(built!), ref!)).toEqual([]);
  });

  it("keeps the mockup's order: skip link, nav, main, footer, buy bar, drawer; then the bubble", () => {
    const { container } = shell();
    const order = Array.from(container.children)
      .map((el) => (el.matches(".ks-skip") ? "skip" : el.matches("nav") ? "nav" : el.matches("main") ? "main" : el.matches("footer") ? "footer"
        : el.matches(".kh-buybar") ? "bar" : el.matches("dialog") ? "drawer" : el.matches(".ks-wa") ? "bubble" : null))
      .filter(Boolean);
    expect(order).toEqual(["skip", "nav", "main", "footer", "bar", "drawer", "bubble"]);
    expect(container.firstElementChild).toHaveClass("ks-skip");
  });

  it("puts the page in <main id=\"main\">, the skip link's target", () => {
    shell();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main");
    expect(main).toHaveTextContent("page");
  });
});

describe("SiteShell: what the mockup did not have", () => {
  it("renders the WhatsApp bubble with the site's text (D050)", () => {
    shell();
    const bubble = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(bubble).toHaveClass("ks-wa");
    expect(new URL(bubble.getAttribute("href")!).searchParams.get("text")).toBe("Hi Kheelona! I have a question about Kheelu.");
    expect(bubble).not.toHaveClass("ph-no-capture");
  });

  it("emits the Organization and WebSite JSON-LD exactly once", () => {
    const { container } = shell();
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent!) as { "@graph": Array<{ "@type": string }> };
    expect(graph["@graph"].map((n) => n["@type"])).toEqual(["Organization", "WebSite"]);
  });

  it("renders the shared chalk filter once, before main, for the doodles that draw (D049 pick 3)", () => {
    const { container } = shell();
    const defs = container.querySelectorAll(".ks-doodle-defs");
    expect(defs).toHaveLength(1);
    expect(defs[0].compareDocumentPosition(container.querySelector("main")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelectorAll("#ks-chalk")).toHaveLength(1);
  });
});

describe("SiteShell: the buy bar only where it belongs", () => {
  it("renders no bar when it is given no paths (the 404)", () => {
    const { container } = shell([]);
    expect(container.querySelector(".kh-buybar")).toBeNull();
  });

  it("renders no bar on a path outside the list", () => {
    nav.pathname = "/setup";
    const { container } = shell(["/", "/safety"]);
    expect(container.querySelector(".kh-buybar")).toBeNull();
  });

  it("marks the current page's nav link", () => {
    nav.pathname = "/safety";
    const { container } = shell();
    expect(Array.from(container.querySelectorAll('nav.kh-nav [aria-current="page"]')).map((a) => a.textContent)).toEqual(["Safety"]);
  });
});
