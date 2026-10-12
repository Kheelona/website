import { readFileSync } from "node:fs";
import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORE_URL } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { buyBarState } from "./StickyBuyBar.client";
import { StickyBuyBar } from "./StickyBuyBar";

/* StickyBuyBar (task 3.1; G-09, D041, D049 pick 4, architecture §5.2, §5.3, §11.3), ported from mockup/mockup.js §2 and
 * mockup/partials/buybar.html: hidden until the hero CTA (#hero-cta) has left the screen, or from first paint where a
 * page has none; stepping aside while any inline chilli button in <main> is on screen; inert while hidden; publishing
 * its state on <html> as data-buybar and its height as --ks-buybar-h for the WhatsApp bubble. */

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

/** IntersectionObserver under test control: every instance, what it watches, and a way to report entries. */
class FakeIO {
  static all: FakeIO[] = [];
  watched = new Set<Element>();
  disconnected = false;
  constructor(public callback: IntersectionObserverCallback) {
    FakeIO.all.push(this);
  }
  observe = (el: Element) => void this.watched.add(el);
  unobserve = (el: Element) => void this.watched.delete(el);
  disconnect = () => {
    this.disconnected = true;
    this.watched.clear();
  };
  takeRecords = () => [];
  report(entries: Array<[Element, boolean]>) {
    act(() =>
      this.callback(
        entries.map(([target, isIntersecting]) => ({ target, isIntersecting }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      ),
    );
  }
}
const io = () => FakeIO.all.at(-1)!;

/** The bar's laid-out height: 72 px, or 0 as at 900 px and up, where the bar is display: none. */
let barHeight = 72;
const PATHS = ["/", "/safety", "/products/kheelu"];
const offer = buildOffer("token");
const html = document.documentElement;

beforeEach(() => {
  FakeIO.all = [];
  barHeight = 72;
  vi.stubGlobal("IntersectionObserver", FakeIO);
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains("kh-buybar") ? barHeight : 0;
    },
  });
});
afterEach(() => {
  nav.pathname = "/";
  document.body.innerHTML = "";
  delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetHeight;
});

/** A page body: <main> with the given chilli links and an optional hero CTA, then the bar after it, as SiteShell. */
function page(main: string, pathname = "/") {
  nav.pathname = pathname;
  const host = document.createElement("main");
  host.innerHTML = main;
  document.body.append(host);
  const view = render(<StickyBuyBar offer={offer} label="Pre-order Kheelu" paths={PATHS} />);
  return { ...view, main: host };
}
const bar = () => document.querySelector(".kh-buybar") as HTMLElement;
const isHidden = () => bar().classList.contains("is-hidden");
const flush = () => act(() => new Promise((done) => setTimeout(done, 0)));

describe("buyBarState", () => {
  it.each([
    [{ ready: false, heroOnScreen: false, inlineOnScreen: 0 }, "hidden"],
    [{ ready: true, heroOnScreen: true, inlineOnScreen: 0 }, "hidden"],
    [{ ready: true, heroOnScreen: true, inlineOnScreen: 2 }, "hidden"],
    [{ ready: true, heroOnScreen: false, inlineOnScreen: 1 }, "aside"],
    [{ ready: true, heroOnScreen: false, inlineOnScreen: 0 }, "shown"],
  ] as const)("%o is %s", (input, expected) => {
    expect(buyBarState(input)).toBe(expected);
  });
});

describe("StickyBuyBar: markup (partials/buybar.html)", () => {
  it("is a named region holding the two price lines and the chilli button, hidden and inert until told otherwise", () => {
    page(`<a id="hero-cta" class="kh-btn kh-btn--cta">x</a>`);
    const region = screen.getByRole("region", { name: "Pre-order Kheelu", hidden: true });
    expect(region.className).toBe("kh-buybar is-hidden");
    expect(region).toHaveAttribute("inert");
    const [price, cta] = Array.from(region.children);
    expect(price.className).toBe("kh-buybar__price");
    expect(Array.from(price.children).map((s) => [s.className, s.textContent])).toEqual([
      ["kh-buybar__big", "₹499 today"],
      ["kh-buybar__small", "refundable · ₹4,999 total (incl. GST)"],
    ]);
    expect(cta.className).toBe("kh-btn kh-btn--cta");
    expect(cta).toHaveAttribute("href", STORE_URL);
    expect(cta).toHaveAttribute("data-ph-capture-attribute-cta", "sticky-bar");
    expect(within(cta as HTMLElement).getByText("Pre-order Kheelu", { selector: "span" })).toBeInTheDocument();
  });

  it("prints the full-mode lines when the store has moved to full price", () => {
    nav.pathname = "/";
    render(<StickyBuyBar offer={buildOffer("full")} label="Pre-order Kheelu" paths={PATHS} />);
    expect(Array.from(document.querySelectorAll(".kh-buybar__price > span")).map((s) => s.textContent)).toEqual([
      "₹7,999 (incl. GST)",
      "Paid in full · Deliveries start mid-November",
    ]);
  });

  it("renders nothing, and publishes nothing, on a page without the bar", () => {
    page(`<a class="kh-btn kh-btn--cta">x</a>`, "/setup");
    expect(document.querySelector(".kh-buybar")).toBeNull();
    expect(html.dataset.buybar).toBeUndefined();
  });
});

describe("StickyBuyBar: behaviour (mockup.js §2)", () => {
  it("waits for the hero CTA to leave, shows, steps aside for an inline chilli button, and hides again at the top", () => {
    const { main } = page(`<a id="hero-cta" class="kh-btn kh-btn--cta">hero</a><p>…</p><a class="kh-btn kh-btn--cta">inline</a>`);
    const [hero, inline] = Array.from(main.querySelectorAll("a"));
    expect([...io().watched]).toEqual(expect.arrayContaining([hero, inline]));
    expect(isHidden()).toBe(true);
    expect(html.dataset.buybar).toBe("hidden");

    io().report([[hero, true], [inline, false]]);
    expect(isHidden()).toBe(true);
    expect(html.dataset.buybar).toBe("hidden");

    io().report([[hero, false]]);
    expect(isHidden()).toBe(false);
    expect(bar()).not.toHaveAttribute("inert");
    expect(html.dataset.buybar).toBe("shown");
    expect(html.style.getPropertyValue("--ks-buybar-h")).toBe("72px");

    io().report([[inline, true]]);
    expect(isHidden()).toBe(true);
    expect(bar()).toHaveAttribute("inert");
    expect(html.dataset.buybar).toBe("aside");

    io().report([[inline, false]]);
    expect(html.dataset.buybar).toBe("shown");

    io().report([[hero, true]]);
    expect(isHidden()).toBe(true);
    expect(html.dataset.buybar).toBe("hidden");
  });

  it("treats #hero-cta as the hero whatever it is (contact's ways-to-reach group is a div)", () => {
    const { main } = page(`<div id="hero-cta">WhatsApp us</div><a class="kh-btn kh-btn--cta">finale</a>`, "/safety");
    const [hero, finale] = [main.querySelector("#hero-cta")!, main.querySelector("a")!];
    io().report([[hero, true], [finale, false]]);
    expect(html.dataset.buybar).toBe("hidden");
    io().report([[hero, false]]);
    expect(html.dataset.buybar).toBe("shown");
  });

  it("shows from first paint on a page with no hero CTA, once the inline buttons are known to be off screen", () => {
    const { main } = page(`<p>…</p><a class="kh-btn kh-btn--cta">offer</a>`, "/products/kheelu");
    expect(html.dataset.buybar).toBe("hidden");
    io().report([[main.querySelector("a")!, false]]);
    expect(html.dataset.buybar).toBe("shown");
  });

  it("never flashes up on a page whose inline button is on screen at load: aside from the first report", () => {
    const { main } = page(`<a class="kh-btn kh-btn--cta">product top</a>`, "/products/kheelu");
    const seen = new Set<string>();
    new MutationObserver(() => seen.add(html.dataset.buybar ?? "")).observe(html, { attributes: true, attributeFilter: ["data-buybar"] });
    io().report([[main.querySelector("a")!, true]]);
    expect(html.dataset.buybar).toBe("aside");
    expect(seen.has("shown")).toBe(false);
  });

  it("shows at once when the page has nothing to wait for (no hero, no chilli button in main)", () => {
    page(`<p>no buttons</p>`);
    expect(html.dataset.buybar).toBe("shown");
    expect(isHidden()).toBe(false);
  });

  it("publishes hidden while the bar takes no room (display: none from 900 px), and its height when it does", async () => {
    barHeight = 0;
    page(`<p>no buttons</p>`);
    expect(html.dataset.buybar).toBe("hidden");
    expect(html.style.getPropertyValue("--ks-buybar-h")).toBe("0px");
  });

  it("watches chilli buttons added after it armed (a streamed or client-rendered block)", async () => {
    const { main } = page(`<a id="hero-cta" class="kh-btn kh-btn--cta">hero</a>`);
    const hero = main.querySelector("a")!;
    io().report([[hero, false]]);
    expect(html.dataset.buybar).toBe("shown");
    const late = document.createElement("a");
    late.className = "kh-btn kh-btn--cta";
    // The mutation is read on the next frame (MutationObserver, then requestAnimationFrame): wait for it.
    act(() => main.append(late));
    await vi.waitFor(() => expect(io().watched.has(late)).toBe(true));
    io().report([[late, true]]);
    expect(html.dataset.buybar).toBe("aside");
    act(() => late.remove());
    await vi.waitFor(() => expect(io().watched.has(late)).toBe(false));
    await flush();
    expect(html.dataset.buybar).toBe("shown");
  });

  it("ignores chilli buttons outside <main> (its own, the nav's, the drawer's)", () => {
    const outside = document.createElement("a");
    outside.className = "kh-btn kh-btn--cta";
    document.body.append(outside);
    page(`<p>none</p>`);
    expect(io()?.watched.has(outside) ?? false).toBe(false);
    expect(html.dataset.buybar).toBe("shown");
  });

  it("stops watching and removes what it published when it leaves the page", () => {
    const { unmount, main } = page(`<a class="kh-btn kh-btn--cta">x</a>`);
    io().report([[main.querySelector("a")!, false]]);
    expect(html.dataset.buybar).toBe("shown");
    const observer = io();
    unmount();
    expect(observer.disconnected).toBe(true);
    expect(html.dataset.buybar).toBeUndefined();
    expect(html.style.getPropertyValue("--ks-buybar-h")).toBe("");
  });

  it("goes away on a client navigation to a page without the bar", () => {
    const { rerender } = page(`<p>none</p>`);
    expect(html.dataset.buybar).toBe("shown");
    nav.pathname = "/setup";
    rerender(<StickyBuyBar offer={offer} label="Pre-order Kheelu" paths={PATHS} />);
    expect(document.querySelector(".kh-buybar")).toBeNull();
    expect(html.dataset.buybar).toBeUndefined();
  });
});

describe("sticky-buy-bar.css (mockup.css:57, :87)", () => {
  const css = readFileSync("src/components/chrome/StickyBuyBar/sticky-buy-bar.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");

  it("pads the bar's foot by the safe area (G-09) and hides it from 900 px (DS: phones only)", () => {
    expect(css).toContain(".kh-buybar { padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom)); }");
    expect(css).toContain("@media (min-width: 900px) { .kh-buybar { display: none; } }");
  });

  it("leaves every movement to motion.css (pick 4)", () => {
    expect(css).not.toMatch(/transition|animation|transform|opacity/);
  });
});
