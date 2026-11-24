import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readRepoFile } from "../../../../../test/e2e/support/repo";
import { StorePayBar } from "./StorePayBar.client";

/* StorePayBar (D070 / C1, K-176; D-top5-changes.md Change 1, items 1 and 9): the form's own pay button as the DS buy bar,
 * fixed to the bottom of a phone's screen. It reads its label and state from the form's button, submits that same form,
 * shows once the first screen has gone, and steps aside for a field's focus, the consent tick, the alerts, B2's notice, the
 * form's own button and the footer. The page is the store's markup in miniature (the real ids and classes); the observer
 * is under test control. */

const html = document.documentElement;
/** The matchMedia and fetch the setup file stubbed, put back after a test that replaces them. */
const { matchMedia: baseMatchMedia, fetch: baseFetch } = globalThis;

/** IntersectionObserver under test control: its options, what it watches, and a way to report entries. */
class FakeIO {
  static all: FakeIO[] = [];
  watched = new Set<Element>();
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    FakeIO.all.push(this);
  }
  observe = (el: Element) => void this.watched.add(el);
  unobserve = (el: Element) => void this.watched.delete(el);
  disconnect = () => this.watched.clear();
  takeRecords = () => [];
  report(entries: Array<[Element, boolean, number?]>) {
    act(() =>
      this.callback(
        entries.map(([target, isIntersecting, bottom = isIntersecting ? 200 : 2000]) => ({ target, isIntersecting, boundingClientRect: { bottom } }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      ),
    );
  }
}
const io = () => FakeIO.all.at(-1)!;

let barHeight = 72;
const scrolled = vi.fn();
const flush = () => act(() => new Promise((done) => setTimeout(done, 200)));

beforeEach(() => {
  FakeIO.all = [];
  barHeight = 72;
  scrolled.mockClear();
  vi.stubGlobal("IntersectionObserver", FakeIO);
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains("kh-buybar") ? barHeight : 0;
    },
  });
  Element.prototype.scrollIntoView = scrolled;
});
afterEach(() => {
  document.body.innerHTML = "";
  delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetHeight;
  delete (Element.prototype as unknown as Record<string, unknown>).scrollIntoView;
  html.removeAttribute("data-buybar");
  html.style.removeProperty("--ks-buybar-h");
  vi.stubGlobal("matchMedia", baseMatchMedia);
  vi.stubGlobal("fetch", baseFetch);
});

/** The store's markup in miniature: the first screen, the form in #details (four fields, the consent row, the pay button), the footer. */
function page(label = "Pay ₹499 and reserve") {
  document.body.innerHTML = `
    <main>
      <section class="ks-store-top"><h1>Pre-order Khelu.</h1></section>
      <section id="details"><form class="ks-form" novalidate>
        <div class="kh-field"><input name="parentName" /></div>
        <div class="kh-field"><input name="phone" /></div>
        <div class="kh-field"><input name="email" /></div>
        <div class="kh-field"><input name="childAge" /></div>
        <div class="kh-check ks-consent"><input type="checkbox" name="accepted" /></div>
        <button type="submit" class="kh-btn kh-btn--cta kh-btn--l kh-btn--block"><span>${label}</span></button>
      </form></section>
    </main>
    <footer class="kh-footer"></footer>`;
  const form = document.querySelector("form")!;
  const submitted = vi.fn((event: Event) => event.preventDefault());
  form.addEventListener("submit", submitted);
  return {
    form,
    submitted,
    first: document.querySelector(".ks-store-top")!,
    pay: form.querySelector<HTMLButtonElement>('button[type="submit"]')!,
    consent: form.querySelector(".ks-consent")!,
    footer: document.querySelector(".kh-footer")!,
    name: form.querySelector<HTMLInputElement>('input[name="parentName"]')!,
    phone: form.querySelector<HTMLInputElement>('input[name="phone"]')!,
  };
}
const bar = () => document.querySelector(".ks-paybar") as HTMLElement;
const isHidden = () => bar().classList.contains("is-hidden");
const mount = () => render(<StorePayBar />);

/** What the observer reports with the first screen gone and nothing to keep clear on screen: the bar shows. */
function allClear(p: ReturnType<typeof page>) {
  io().report([[p.first, false, -5], [p.pay, false], [p.consent, false], [p.footer, false]]);
}

describe("StorePayBar: what it is", () => {
  it("draws nothing on the server: no label to show before it can read one, and nothing in the HTML to shift", () => {
    expect(renderToString(<StorePayBar />)).toBe("");
  });

  it("is the DS buy bar holding one chilli button, hidden and inert until told otherwise, with the form's words and no words of its own", () => {
    page();
    mount();
    expect(bar().className).toBe("kh-buybar ks-paybar is-hidden");
    expect(bar()).toHaveAttribute("inert");
    const button = bar().querySelector("button")!;
    expect(button.type).toBe("button");
    expect(button.className).toBe("kh-btn kh-btn--cta kh-btn--l kh-btn--block ks-paybar__btn");
    expect(button.textContent).toBe("Pay ₹499 and reserve");
    // No tracking attribute of its own: only the Button primitive writes one (the CTA registry); a tap is an ordinary autocapture click.
    expect(bar().querySelectorAll("[data-ph-capture-attribute-cta]")).toHaveLength(0);
  });

  it("reads the label from the form's own button, in every mode and in every state the form puts it in", async () => {
    const p = page("Pay ₹7,999 and pre-order");
    mount();
    expect(bar().querySelector("button")!.textContent).toBe("Pay ₹7,999 and pre-order");
    p.pay.firstElementChild!.textContent = "Setting up your payment…";
    p.pay.disabled = true;
    p.pay.classList.add("kh-btn--loading");
    await flush();
    const button = bar().querySelector("button")!;
    expect(button.textContent).toBe("Setting up your payment…");
    expect(button.disabled).toBe(true);
    expect(button.classList.contains("kh-btn--loading")).toBe(true);
  });

  it("does nothing on a page with no form to read", () => {
    document.body.innerHTML = "<main></main>";
    mount();
    expect(bar().classList.contains("is-hidden")).toBe(true);
    expect(html.hasAttribute("data-buybar")).toBe(false);
  });
});

describe("StorePayBar: where it shows", () => {
  it("watches the first screen and everything it keeps clear of, the screen reaching one bar's height further down", () => {
    const p = page();
    mount();
    expect(io().options?.rootMargin).toBe("0px 0px 72px 0px");
    expect([...io().watched]).toEqual(expect.arrayContaining([p.first, p.consent, p.pay, p.footer]));
  });

  it("stays hidden until the first screen has gone, shows once it has and nothing it keeps clear of is on screen", () => {
    const p = page();
    mount();
    io().report([[p.first, true], [p.pay, false], [p.consent, false], [p.footer, false]]);
    expect(isHidden()).toBe(true);
    // Below the first screen, not above it (the page opened at its end): not "gone".
    io().report([[p.first, false, 900]]);
    expect(isHidden()).toBe(true);
    io().report([[p.first, false, -5]]);
    expect(isHidden()).toBe(false);
    expect(bar()).not.toHaveAttribute("inert");
  });

  it.each([
    ["the form's own pay button", (p: ReturnType<typeof page>) => p.pay],
    ["the consent tick", (p: ReturnType<typeof page>) => p.consent],
    ["the store footer", (p: ReturnType<typeof page>) => p.footer],
  ])("steps aside while %s is on screen (or about to be), so it is never a second Pay in the view and never covers it", (_name, pick) => {
    const p = page();
    mount();
    allClear(p);
    expect(isHidden()).toBe(false);
    io().report([[pick(p), true]]);
    expect(isHidden()).toBe(true);
    io().report([[pick(p), false]]);
    expect(isHidden()).toBe(false);
  });

  it("steps aside while a failure alert is on screen, and watches an alert that arrives after load", async () => {
    const p = page();
    mount();
    allClear(p);
    const alert = document.createElement("div");
    alert.className = "kh-alert kh-alert--danger";
    alert.setAttribute("role", "alert");
    p.form.insertBefore(alert, p.pay);
    await flush();
    expect(io().watched.has(alert)).toBe(true);
    io().report([[p.first, false, -5], [alert, true], [p.pay, false], [p.consent, false], [p.footer, false]]);
    expect(isHidden()).toBe(true);
    io().report([[alert, false]]);
    expect(isHidden()).toBe(false);
  });

  it("stays away altogether while B2's 'still open' notice is in the form (Continue paying is the path, not a second order), and comes back when it goes", async () => {
    const p = page();
    mount();
    allClear(p);
    const notice = document.createElement("div");
    notice.className = "kh-alert";
    notice.setAttribute("role", "status");
    p.form.insertBefore(notice, p.pay);
    await flush();
    io().report([[p.first, false, -5], [notice, false], [p.pay, false], [p.consent, false], [p.footer, false]]);
    expect(isHidden()).toBe(true);
    notice.remove();
    await flush();
    io().report([[p.first, false, -5], [p.pay, false], [p.consent, false], [p.footer, false]]);
    expect(isHidden()).toBe(false);
  });

  it("steps aside while a form field has focus (the keyboard is up), also between two fields, and returns on blur", () => {
    const p = page();
    mount();
    allClear(p);
    act(() => p.name.focus());
    expect(isHidden()).toBe(true);
    act(() => p.phone.focus());
    expect(isHidden()).toBe(true);
    act(() => p.phone.blur());
    expect(isHidden()).toBe(false);
  });

  it("is not armed at 900 px and up, where the form's own button is sticky instead: never shown, nothing published", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("min-width: 900px"), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const p = page();
    mount();
    expect(FakeIO.all).toHaveLength(0);
    expect(isHidden()).toBe(true);
    expect(p.first).toBeTruthy();
    expect(html.hasAttribute("data-buybar")).toBe(false);
  });
});

describe("StorePayBar: what it tells the page", () => {
  it("publishes html[data-buybar] and --ks-buybar-h while shown, as the marketing bar does, so the WhatsApp bubble rises above it", () => {
    const p = page();
    mount();
    expect(html.dataset.buybar).toBe("hidden");
    expect(html.style.getPropertyValue("--ks-buybar-h")).toBe("72px");
    allClear(p);
    expect(html.dataset.buybar).toBe("shown");
    io().report([[p.pay, true]]);
    expect(html.dataset.buybar).toBe("hidden");
  });

  it("takes both off the page when it goes", () => {
    const p = page();
    const view = mount();
    allClear(p);
    view.unmount();
    expect(html.hasAttribute("data-buybar")).toBe(false);
    expect(html.style.getPropertyValue("--ks-buybar-h")).toBe("");
  });
});

describe("StorePayBar: a tap", () => {
  it("submits the form's own form: the same handler, the same validation (requestSubmit with the form's button)", () => {
    const p = page();
    mount();
    allClear(p);
    const spy = vi.spyOn(p.form, "requestSubmit");
    act(() => bar().querySelector("button")!.click());
    expect(spy).toHaveBeenCalledWith(p.pay);
    expect(p.submitted).toHaveBeenCalledTimes(1);
  });

  it("scrolls to the first field the form says is not right and focuses it, so the keyboard opens (no request made: the form's validation stops it)", async () => {
    const p = page();
    mount();
    allClear(p);
    // The form's validation, as PreorderForm shows it: the first empty field and the others are marked invalid; nothing is sent.
    p.form.addEventListener("submit", () => {
      p.name.setAttribute("aria-invalid", "true");
      p.phone.setAttribute("aria-invalid", "true");
    });
    const fetched = vi.fn();
    vi.stubGlobal("fetch", fetched);
    act(() => bar().querySelector("button")!.click());
    await flush();
    expect(scrolled).toHaveBeenCalledWith({ block: "center", behavior: "smooth" });
    expect(scrolled.mock.contexts.at(-1)).toBe(p.name);
    expect(document.activeElement).toBe(p.name);
    expect(fetched).not.toHaveBeenCalled();
    expect(isHidden()).toBe(true); // a field has focus
  });

  it("scrolls without animation when the parent asked for reduced motion", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("prefers-reduced-motion"), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    const p = page();
    mount();
    allClear(p);
    p.form.addEventListener("submit", () => p.name.setAttribute("aria-invalid", "true"));
    act(() => bar().querySelector("button")!.click());
    await flush();
    expect(scrolled).toHaveBeenCalledWith({ block: "center", behavior: "auto" });
  });

  it("does nothing while the form's button is busy (a payment is being set up)", () => {
    const p = page();
    mount();
    allClear(p);
    p.pay.disabled = true;
    act(() => bar().querySelector("button")!.click());
    expect(p.submitted).not.toHaveBeenCalled();
  });

  it("brings a failure the tap caused into view (the parent is at the bar, far from the alert), and only once", async () => {
    const p = page();
    mount();
    allClear(p);
    act(() => bar().querySelector("button")!.click());
    scrolled.mockClear();
    const alert = document.createElement("div");
    alert.className = "kh-alert kh-alert--danger";
    alert.setAttribute("role", "alert");
    p.form.insertBefore(alert, p.pay);
    await flush();
    expect(scrolled.mock.contexts).toEqual([alert]);
    expect(scrolled).toHaveBeenCalledWith({ block: "center", behavior: "smooth" });
    scrolled.mockClear();
    const second = alert.cloneNode(true) as HTMLElement;
    p.form.insertBefore(second, p.pay);
    await flush();
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("leaves an alert alone when the parent did not tap the bar", async () => {
    const p = page();
    mount();
    allClear(p);
    const alert = document.createElement("div");
    alert.className = "kh-alert kh-alert--danger";
    alert.setAttribute("role", "alert");
    p.form.insertBefore(alert, p.pay);
    await flush();
    expect(scrolled).not.toHaveBeenCalled();
  });
});

describe("StorePayBar: its styles", () => {
  const css = (path: string) => readRepoFile(path).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();

  it("is fixed to the bottom edge, so it takes no room in the page and nothing moves when it appears (CLS 0)", () => {
    expect(css("src/components/sections/store/StorePayBar/store-pay-bar.css")).toBe(".ks-paybar { position: fixed; inset-inline: 0; bottom: 0; }");
  });

  it("leaves the DS bar's 900 px cut-off, its safe-area foot, its slide and its colours as they are", () => {
    const own = css("src/components/sections/store/StorePayBar/store-pay-bar.css");
    expect(own).not.toMatch(/display|padding|background|transition|transform|z-index|env\(/);
    expect(css("src/components/chrome/StickyBuyBar/sticky-buy-bar.css")).toContain("@media (min-width: 900px) { .kh-buybar { display: none; } }");
  });

  it("makes the form's own pay button sticky in its column from 900 px, only on the store page's layout (the event pages keep theirs)", () => {
    const details = css("src/components/sections/store/StoreDetails/store-details.css");
    expect(details).toContain(
      "@media (min-width: 900px) { .ks-store--pay .ks-form > .kh-btn--cta { position: sticky; bottom: var(--space-4); z-index: var(--z-sticky); box-shadow: var(--shadow-lift); } }",
    );
  });
});
