import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STORE_URL, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { hoistNowrap, mockupDiff } from "./mockup-diff";
import { SiteShell } from "./SiteShell";

/* SiteShell (task 3.1; architecture §5.1, structure §3.1): the marketing site's shell, rendered by
 * src/app/(site)/layout.tsx and by the root not-found page. Its chrome is compared element by element with the same
 * elements of the approved mockup's built Home (mockup/home.html, D046): tag, classes (mk- renamed ks-), attributes,
 * order and text (mockup-diff.ts, shared with StoreShell.test.tsx), with every word, link and price from content.
 * Pixel parity of the same elements is test/e2e/chrome.spec.ts's. */

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

/** The mockup's script hook, the image source and width, and the bar's state (the mockup ships the bar hidden; here
 *  its controller has already run) are not markup. */
const differences = mockupDiff({ realHref, ignore: ["data-open-menu", "src", "width", "inert"], dropClasses: ["is-hidden"] });

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
    // The number is the support line's, from config (SUPPORT_WHATSAPP_HREF), so a new number moves the bubble too.
    expect(bubble.getAttribute("href")!.startsWith(`${SUPPORT_WHATSAPP_HREF}?text=`)).toBe(true);
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
