import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StoreAnswerLinks } from "./StoreAnswerLinks.client";

/* StoreAnswerLinks (D070 / C1, K-176; Change 1, item 3): the refund and delivery links in the store's trust lines open the
 * store's own matching question in place. The page is the store's markup in miniature (the real classes); the routes are
 * what the page builds from content (store-page.ts `answers` and trust.ts). */

const ROUTES = [
  { href: "/refund#before-dispatch", answer: "faq-change-my-mind" },
  { href: "/refund#returns", answer: "faq-change-my-mind" },
  { href: "/shipping#when", answer: "faq-store-arrival" },
  { href: "/shipping#where", answer: "faq-store-arrival" },
];
const ORIGIN = "https://kheelona.com";
const scrolled = vi.fn();
const baseMatchMedia = globalThis.matchMedia;

beforeEach(() => {
  scrolled.mockClear();
  Element.prototype.scrollIntoView = scrolled;
  document.body.innerHTML = `
    <section class="ks-store-top"><ul class="kh-trustline ks-trust">
      <li><a id="risk" href="${ORIGIN}/refund#before-dispatch" target="_blank" rel="noopener">Full refund until dispatch</a></li>
      <li><a id="when" href="${ORIGIN}/shipping#when" target="_blank" rel="noopener">Deliveries start</a></li>
    </ul></section>
    <section id="details"><form>
      <div class="kh-check"><label><a id="consent-refund" href="${ORIGIN}/refund" target="_blank" rel="noopener">refund policy</a></label></div>
      <div class="ks-beside ks-pay-beside"><ul class="kh-trustline ks-trust">
        <li><a id="returns" href="${ORIGIN}/refund#returns">7-day returns</a></li>
        <li><a id="warranty" href="${ORIGIN}/refund#faulty">6-month warranty</a></li>
        <li><a id="payment" href="${ORIGIN}/terms#payment">Payment methods</a></li>
        <li><a id="where" href="${ORIGIN}/shipping#where">Delivery included</a></li>
      </ul></div>
    </form></section>
    <section class="ks-faq"><div class="kh-faq">
      <details id="faq-paying-today" class="kh-faq__item" open><summary>What am I paying today?</summary></details>
      <details id="faq-change-my-mind" class="kh-faq__item"><summary>What if I change my mind?</summary></details>
      <details id="faq-store-arrival" class="kh-faq__item"><summary>When will my Khelu arrive?</summary></details>
    </div></section>`;
});
afterEach(() => {
  document.body.innerHTML = "";
  delete (Element.prototype as unknown as Record<string, unknown>).scrollIntoView;
  vi.stubGlobal("matchMedia", baseMatchMedia);
});

const link = (id: string) => document.getElementById(id) as HTMLAnchorElement;
const answer = (id: string) => document.getElementById(id) as HTMLDetailsElement;
/** A click, returning whether the browser would still follow the link: its default was not prevented by the time the click
 *  reached the window. The window then stops the navigation itself, which jsdom cannot make. */
let reachedWindow: boolean[] = [];
const stop = (event: Event) => {
  reachedWindow.push(!event.defaultPrevented);
  event.preventDefault();
};
beforeEach(() => {
  reachedWindow = [];
  window.addEventListener("click", stop);
});
afterEach(() => window.removeEventListener("click", stop));
const press = (id: string, init: MouseEventInit = {}) => {
  reachedWindow = [];
  fireEvent.click(link(id), init);
  return reachedWindow.at(-1)!;
};

describe("StoreAnswerLinks", () => {
  it("renders nothing", () => {
    expect(render(<StoreAnswerLinks routes={ROUTES} />).container.innerHTML).toBe("");
  });

  it.each([
    ["risk", "faq-change-my-mind"],
    ["returns", "faq-change-my-mind"],
    ["when", "faq-store-arrival"],
    ["where", "faq-store-arrival"],
  ])("opens the store's own question for the %s link, scrolls to it and focuses it, instead of leaving", (id, target) => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    expect(answer(target).open).toBe(false);
    expect(press(id)).toBe(false);
    expect(answer(target).open).toBe(true);
    expect(scrolled.mock.contexts).toEqual([answer(target)]);
    expect(scrolled).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });
    expect(document.activeElement).toBe(answer(target).querySelector("summary"));
  });

  it("keeps an answer that is already open open, and still brings it into view", () => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    answer("faq-change-my-mind").open = true;
    press("risk");
    expect(answer("faq-change-my-mind").open).toBe(true);
    expect(scrolled).toHaveBeenCalledTimes(1);
  });

  it("scrolls without animation when the parent asked for reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("prefers-reduced-motion"), media: query }));
    render(<StoreAnswerLinks routes={ROUTES} />);
    press("risk");
    expect(scrolled).toHaveBeenCalledWith({ block: "start", behavior: "auto" });
  });

  it("leaves the consent line's legal links as they are: they open the policy in a new tab", () => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    expect(press("consent-refund")).toBe(true);
    expect(answer("faq-change-my-mind").open).toBe(false);
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("leaves the links that have no question here (warranty, payment methods) as they are", () => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    expect(press("warranty")).toBe(true);
    expect(press("payment")).toBe(true);
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("leaves a link whose question is not on the page as it is (nothing to open, so it still leaves)", () => {
    render(<StoreAnswerLinks routes={[{ href: "/refund#before-dispatch", answer: "faq-missing" }]} />);
    expect(press("risk")).toBe(true);
  });

  it.each([
    ["a new-tab press (ctrl)", { ctrlKey: true }],
    ["a new-tab press (meta)", { metaKey: true }],
    ["a new-window press (shift)", { shiftKey: true }],
    ["a download press (alt)", { altKey: true }],
    ["a middle press", { button: 1 }],
  ])("leaves %s to the browser", (_name, init) => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    expect(press("risk", init)).toBe(true);
    expect(answer("faq-change-my-mind").open).toBe(false);
  });

  it("keeps the hrefs: the links still name the marketing site's pages (the no-JavaScript fallback)", () => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    press("risk");
    expect(link("risk").getAttribute("href")).toBe(`${ORIGIN}/refund#before-dispatch`);
    expect(link("when").getAttribute("href")).toBe(`${ORIGIN}/shipping#when`);
  });

  it("stops listening when the page goes", () => {
    const view = render(<StoreAnswerLinks routes={ROUTES} />);
    view.unmount();
    expect(press("risk")).toBe(true);
    expect(answer("faq-change-my-mind").open).toBe(false);
  });

  it("ignores a click that was not on a link, or already handled", () => {
    render(<StoreAnswerLinks routes={ROUTES} />);
    act(() => {
      fireEvent.click(document.querySelector(".ks-store-top")!);
    });
    expect(scrolled).not.toHaveBeenCalled();
  });
});
