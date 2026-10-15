import { readFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ICON_WHATSAPP_LOGO } from "@/assets/icons.generated";
import { CtaBlock } from "@/components/sections/CtaBlock/CtaBlock";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { AddressStep } from "@/components/sections/store/AddressStep/AddressStep";
import { OfferCard } from "@/components/ui/OfferCard/OfferCard";
import { PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";
import { RichText } from "@/components/ui/RichText/RichText";
import { formatInr } from "@/config/site";
import { cta } from "@/content/en-IN/cta";
import { pickFaqs } from "@/content/en-IN/faqs";
import { seller } from "@/content/en-IN/seller";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { storePage } from "@/content/en-IN/store/store-page";
import { trustItems } from "@/content/en-IN/trust";
import type { SupportChat } from "@/content/types";
import { OrderSummary } from "@/features/preorder/components/OrderSummary";
import { buildOffer } from "@/lib/offer/offer";
import { fullTier, launchTier } from "@/lib/store/tiers";
import { STEP_ASIDE_FROM, WhatsAppFloat, whatsAppChatUrl } from "./WhatsAppFloat";
import { bandMargin, isFieldIn, LAPTOP_QUERY } from "./WhatsAppFloat.client";

/** The page the bubble's link lives on: the site's bubble sits in a layout and re-arms on every page change. */
const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

/* WhatsAppFloat (task 3.1; D050, architecture §5.3, §11.2 row D050, §11.3). A real link to WhatsApp with the
 * context's pre-filled text, in the DS icon-button look with WhatsApp green (G-20). Its lift above the buy bar,
 * its hiding under an open dialog and its laptop label are CSS (whatsapp-float.css and motion.css); its one client part
 * steps it aside on a phone (tasks 4.7 and 4.9, below), the server's markup until it arms. */

/** The support line's click-to-chat link and the chat's words, as content/en-IN/seller.ts gives them (fixture copy;
 *  the shell passes `seller.support.whatsapp`, which is config's SUPPORT_WHATSAPP_HREF, and `seller.chat`). A number
 *  unlike the real one, so a test can tell where the link's number comes from. */
const HREF = "https://wa.me/910000000001";
const CHAT: Omit<SupportChat, "number"> = {
  label: "Chat with us on WhatsApp",
  shortLabel: "Chat with us on WhatsApp",
  texts: {
    site: "Hi Kheelona! I have a question about Kheelu.",
    store: "Hi Kheelona! I need help with my pre-order.",
    thanks: "Hi Kheelona! I have a question about my order.",
  },
};

const CSS = readFileSync("src/components/chrome/WhatsAppFloat/whatsapp-float.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** The declarations of the first rule whose selector list is exactly `selector`. */
function rule(selector: string, css = CSS): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`(?:^|})\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(css);
  if (!m) throw new Error(`whatsapp-float.css has no rule "${selector}"`);
  return m[1].replace(/\s+/g, " ").trim();
}

describe("whatsAppChatUrl", () => {
  it("is the D050 address: the support line's own wa.me link, then the context's text, encoded", () => {
    expect(whatsAppChatUrl(HREF, CHAT.texts.site)).toBe("https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20Kheelu.");
    expect(whatsAppChatUrl(HREF, CHAT.texts.store)).toBe("https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20need%20help%20with%20my%20pre-order.");
    expect(whatsAppChatUrl(HREF, CHAT.texts.thanks)).toBe(
      "https://wa.me/910000000001?text=Hi%20Kheelona!%20I%20have%20a%20question%20about%20my%20order.",
    );
  });

  it("decodes back to exactly the content's words", () => {
    for (const context of ["site", "store", "thanks"] as const) {
      expect(new URL(whatsAppChatUrl(HREF, CHAT.texts[context])).searchParams.get("text")).toBe(CHAT.texts[context]);
    }
  });

  it("refuses a link that already carries a query (the text would not be the only parameter)", () => {
    expect(() => whatsAppChatUrl("https://wa.me/910000000001?text=x" as typeof HREF, CHAT.texts.site)).toThrow(/query/);
  });
});

describe("WhatsAppFloat", () => {
  it("is one real link named for screen readers, opening WhatsApp in a new tab", () => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const link = screen.getByRole("link", { name: "Chat with us on WhatsApp" });
    expect(link).toHaveAttribute("href", whatsAppChatUrl(HREF, CHAT.texts.site));
    // The number is the support line's (config), never a second copy of it.
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/910000000001\?text=/);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("wears the DS large icon button with the bubble's own hook, and says which CTA it is", () => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const link = screen.getByRole("link");
    expect(link.className.split(/\s+/)).toEqual(["kh-iconbtn", "kh-iconbtn--l", "ks-wa"]);
    expect(link).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
  });

  it("draws the DS whatsapp-logo icon, hidden from screen readers", () => {
    const { container } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const svg = container.querySelector("a > svg.kh-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.querySelector("path")).toHaveAttribute("d", ICON_WHATSAPP_LOGO);
  });

  it("carries the laptop label as hidden-from-readers text (the link's name says it already)", () => {
    const { container } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
    const label = container.querySelector("a > .ks-wa__label");
    expect(label).toHaveTextContent(CHAT.shortLabel);
    expect(label).toHaveClass("kh-label-s");
    expect(label).toHaveAttribute("aria-hidden", "true");
  });

  /* Task 3.6 item 17 (P13 default): with the site's own words, the laptop label reads the link's name, so what a
     sighted keyboard or voice user sees is what the link is called (WCAG 2.5.3, label in name). */
  it("with the content's words: the laptop label reads the link's accessible name, 'Chat with us on WhatsApp'", () => {
    const { container } = render(<WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="site" />);
    const link = screen.getByRole("link", { name: seller.chat.label });
    expect(container.querySelector(".ks-wa__label")?.textContent).toBe(seller.chat.shortLabel);
    expect(link).toHaveAccessibleName("Chat with us on WhatsApp");
    expect(container.querySelector(".ks-wa__label")).toHaveTextContent("Chat with us on WhatsApp");
  });

  it.each(["site", "store", "thanks"] as const)("uses the %s text", (context) => {
    render(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", whatsAppChatUrl(HREF, CHAT.texts[context]));
  });

  it("keeps PostHog autocapture off the bubble on /thanks only (inventory row 18)", () => {
    const { rerender } = render(<WhatsAppFloat href={HREF} chat={CHAT} context="thanks" />);
    expect(screen.getByRole("link")).toHaveClass("ph-no-capture");
    expect(screen.getByRole("link")).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
    for (const context of ["site", "store"] as const) {
      rerender(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />);
      expect(screen.getByRole("link")).not.toHaveClass("ph-no-capture");
    }
  });
});

/* Task 4.7 item 3 (D050: the bubble never covers a store form field on a phone). Below 900 px the bubble steps aside
 * while a field of the store's form section (#details) has focus or the section crosses the bubble's band, as it
 * already rises for the buy bar: the link takes `.is-hidden` (motion.css slides it off to the right and fades it) and
 * `inert` (an off-screen link is never focused). Each context steps aside from its own regions only (task 4.9 adds the
 * site's prices and the /thanks address step, below). */
describe("WhatsAppFloat: steps aside from the store's form on a phone (task 4.7)", () => {
  /** IntersectionObserver under test control: each instance, its options, what it watches, and a way to report. */
  class FakeIO {
    static all: FakeIO[] = [];
    watched = new Set<Element>();
    disconnected = false;
    constructor(
      public callback: IntersectionObserverCallback,
      public options: IntersectionObserverInit = {},
    ) {
      FakeIO.all.push(this);
    }
    observe = (el: Element) => void this.watched.add(el);
    unobserve = (el: Element) => void this.watched.delete(el);
    disconnect = () => {
      this.disconnected = true;
      this.watched.clear();
    };
    takeRecords = () => [];
    report(target: Element, isIntersecting: boolean) {
      act(() => this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver));
    }
  }
  const io = () => FakeIO.all.at(-1)!;

  /** A media query list for LAPTOP_QUERY that a test can flip, as the browser does when the window crosses 900 px. */
  let laptop: { matches: boolean; listeners: Set<() => void> };
  const flip = (matches: boolean) =>
    act(() => {
      laptop.matches = matches;
      for (const listener of laptop.listeners) listener();
    });

  beforeEach(() => {
    FakeIO.all = [];
    laptop = { matches: false, listeners: new Set() };
    vi.stubGlobal("IntersectionObserver", FakeIO);
    vi.stubGlobal("matchMedia", (query: string) => ({
      get matches() {
        return query === LAPTOP_QUERY && laptop.matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) => laptop.listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => laptop.listeners.delete(listener),
    }));
  });
  afterEach(() => {
    // Unmount first, so no bubble is armed (and re-measuring) when the globals it uses are restored.
    cleanup();
    delete document.documentElement.dataset.buybar;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  /** The store page as it reaches the bubble: the details section holding the form, a field outside it, then the
   *  bubble last (the store page renders it after its content). */
  function storePageWith(context: "site" | "store" | "thanks" = "store") {
    document.body.innerHTML = `<main><input id="elsewhere"><section id="details"><h2>Your details</h2><form><input id="name"><input type="hidden" id="tier"><select id="state"></select><textarea id="address"></textarea><button type="submit" id="pay">Pay</button></form></section></main>`;
    const view = render(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />, { container: document.body.appendChild(document.createElement("div")) });
    const link = screen.getByRole("link", { name: CHAT.label });
    return { ...view, link, details: document.getElementById("details")!, field: (id: string) => document.getElementById(id)! };
  }
  const aside = (link: HTMLElement) => [link.classList.contains("is-hidden"), link.hasAttribute("inert")];

  it("steps aside from the store's details section, the one the store page renders its form in (store-page.ts)", () => {
    expect(STEP_ASIDE_FROM.store.split(", ")[0]).toBe(`#${storePage.details.id}`);
    expect(storePage.details.id).toBe("details");
  });

  /* Task 7.1a (CMO built-page review C, B1): on a phone the agreement card and the questions render after #details,
     outside it, and print the price and what is paid today; the bubble rested over "₹4,999" in the card at 412 px. Every
     amount the two blocks print, in both modes and with every answer open, sits inside a region of the store's selector,
     so a new amount in either block cannot slip past it. (The first screen's price, StoreTop, sits above the form; the
     chrome.spec.ts sweeps check every amount on the page.) */
  it("steps aside from the agreement card and the questions too: every ₹ amount they print sits inside a region, in both modes", () => {
    for (const [mode, tier] of [["token", launchTier()], ["full", fullTier()]] as const) {
      const offer = buildOffer(mode);
      const { container, unmount } = render(
        <>
          <OrderSummary amountLabel={formatInr(tier.amountPaise)} tierLabel={tier.label} mode={mode} delivery={offer.delivery} />
          <FaqSection variant="store" heading={storePage.questions.heading} items={pickFaqs(storePage.questions.items)} offer={offer} />
        </>,
      );
      for (const item of container.querySelectorAll("details")) item.open = true;
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const amounts: Text[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/₹/.test(node.nodeValue ?? "")) amounts.push(node as Text);
      expect(amounts.length, `${mode}: the card and the answers print the price`).toBeGreaterThan(1);
      expect(container.querySelector(".ks-faq details"), `${mode}: the questions`).not.toBeNull();
      for (const node of amounts) expect(node.parentElement!.closest(STEP_ASIDE_FROM.store), `${mode}: "${node.nodeValue}"`).not.toBeNull();
      unmount();
    }
  });

  it("is the same server link in every context before it arms: classes, name, address and CTA value unchanged", () => {
    for (const context of ["site", "store", "thanks"] as const) {
      const doc = new DOMParser().parseFromString(renderToStaticMarkup(<WhatsAppFloat href={HREF} chat={CHAT} context={context} />), "text/html");
      const link = doc.querySelector("a")!;
      expect(link.className.split(/\s+/), context).toEqual(["kh-iconbtn", "kh-iconbtn--l", "ks-wa", ...(context === "thanks" ? ["ph-no-capture"] : [])]);
      expect(link.hasAttribute("inert"), context).toBe(false);
      expect(link.getAttribute("href"), context).toBe(whatsAppChatUrl(HREF, CHAT.texts[context]));
      expect(link.getAttribute("data-ph-capture-attribute-cta"), context).toBe("whatsapp-float");
      expect(link.getAttribute("aria-label"), context).toBe(CHAT.label);
      expect([...link.attributes].map((a) => a.name).sort(), context).toEqual(["aria-label", "class", "data-ph-capture-attribute-cta", "href", "rel", "target"]);
    }
  });

  it("watches the details section through the bubble's band: a root margin that narrows the view to the rows it covers", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return (this.classList.contains("ks-wa") ? { top: 568.4, bottom: 624.4, left: 288, right: 344, width: 56, height: 56 } : new DOMRect()) as DOMRect;
    });
    vi.stubGlobal("innerHeight", 640);
    const { details } = storePageWith();
    expect([...io().watched]).toEqual([details]);
    expect(io().options.rootMargin).toBe(bandMargin({ top: 568.4, bottom: 624.4 }, 640));
    expect(bandMargin({ top: 568.4, bottom: 624.4 }, 640)).toBe("-568px 0px -15px 0px");
  });

  it("steps aside while the section crosses its band and comes back when it has passed", () => {
    const { link, details } = storePageWith();
    expect(aside(link)).toEqual([false, false]);
    io().report(details, true);
    expect(aside(link)).toEqual([true, true]);
    io().report(details, false);
    expect(aside(link)).toEqual([false, false]);
  });

  it("steps aside while a field of the section has focus (input, select, textarea), and not for the pay button or a field elsewhere", () => {
    const { link, field } = storePageWith();
    for (const id of ["name", "state", "address"]) {
      fireEvent.focusIn(field(id));
      expect(aside(link), id).toEqual([true, true]);
      fireEvent.focusOut(field(id), { relatedTarget: field("pay") });
      fireEvent.focusIn(field("pay"));
      expect(aside(link), `${id} to the pay button`).toEqual([false, false]);
    }
    fireEvent.focusIn(field("elsewhere"));
    expect(aside(link)).toEqual([false, false]);
  });

  it("stays aside while focus moves from field to field, and returns once focus leaves the form", () => {
    const { link, field } = storePageWith();
    fireEvent.focusIn(field("name"));
    fireEvent.focusOut(field("name"), { relatedTarget: field("address") });
    expect(aside(link)).toEqual([true, true]);
    fireEvent.focusIn(field("address"));
    expect(aside(link)).toEqual([true, true]);
    fireEvent.focusOut(field("address"), { relatedTarget: null });
    expect(aside(link)).toEqual([false, false]);
  });

  it("stays aside while either holds: a focused field keeps it aside after the section leaves the band", () => {
    const { link, details, field } = storePageWith();
    io().report(details, true);
    fireEvent.focusIn(field("name"));
    io().report(details, false);
    expect(aside(link)).toEqual([true, true]);
    fireEvent.focusOut(field("name"), { relatedTarget: null });
    expect(aside(link)).toEqual([false, false]);
  });

  it("never steps aside from 900 px (the columns sit side by side), and arms again when the window narrows", () => {
    laptop.matches = true;
    const { link, details, field } = storePageWith();
    expect(FakeIO.all).toHaveLength(0);
    fireEvent.focusIn(field("name"));
    expect(aside(link)).toEqual([false, false]);
    flip(false);
    expect([...io().watched]).toEqual([details]);
    io().report(details, true);
    expect(aside(link)).toEqual([true, true]);
    flip(true);
    expect(io().disconnected).toBe(true);
    expect(aside(link)).toEqual([false, false]);
  });

  it("re-measures its band when the window resizes (a phone's toolbar, a turned phone)", () => {
    const { details } = storePageWith();
    const first = io();
    act(() => void window.dispatchEvent(new Event("resize")));
    expect(first.disconnected).toBe(true);
    expect(io()).not.toBe(first);
    expect([...io().watched]).toEqual([details]);
  });

  it("does nothing on a store page without the form (the not-configured state, an event page's own close)", () => {
    document.body.innerHTML = "<main><p>Opening shortly</p></main>";
    render(<WhatsAppFloat href={HREF} chat={CHAT} context="store" />, { container: document.body.appendChild(document.createElement("div")) });
    expect(FakeIO.all).toHaveLength(0);
    expect(aside(screen.getByRole("link"))).toEqual([false, false]);
  });

  it("steps aside from its own context's regions only: never from the store's #details on the site or on /thanks", () => {
    for (const context of ["site", "thanks"] as const) {
      const { link, field, unmount } = storePageWith(context);
      expect([...FakeIO.all.flatMap((o) => [...o.watched])].map((el) => el.id), context).not.toContain("details");
      fireEvent.focusIn(field("name"));
      expect(aside(link), context).toEqual([false, false]);
      unmount();
      FakeIO.all = [];
    }
  });

  it("disarms when it unmounts: the observer disconnected, focus no longer read", () => {
    const { field, unmount } = storePageWith();
    const watcher = io();
    unmount();
    expect(watcher.disconnected).toBe(true);
    expect(laptop.listeners.size).toBe(0);
    expect(() => fireEvent.focusIn(field("name"))).not.toThrow();
  });

  it("isFieldIn: a field the section holds, never a hidden input, a button or something outside it", () => {
    const { details, field } = storePageWith();
    expect(["name", "state", "address", "tier", "pay", "elsewhere"].map((id) => isFieldIn(details, field(id)))).toEqual([true, true, true, false, false, false]);
    expect(isFieldIn(details, null)).toBe(false);
    expect(isFieldIn(details, window)).toBe(false);
  });

  /* Task 4.9 items 1 and 2 (D050: it never covers the price). On the marketing pages the bubble steps aside from the
     prices: the price sentences (PriceSentence `beside`, `ks-price`) and the offer card's prices, split and fine print;
     on the paid /thanks from the address step (AddressStep, `#address`), its fields' focus included. The band follows
     the bubble: re-measured when the bar lifts or drops it (html[data-buybar]) and when its own move ends. */
  describe("the site's prices and the /thanks address step (task 4.9)", () => {
    const TOKEN = buildOffer("token");

    it("names each context's regions: the site's prices, the store's #details, the /thanks address step", () => {
      expect(STEP_ASIDE_FROM).toEqual({
        site: ".ks-price, .kh-offer__prices, .kh-offer__split, .kh-offer__fine",
        store: "#details, .ks-agree, .ks-faq",
        thanks: "#address",
      });
    });

    it("each region the site's selector names holds a price: the sentence beside a button and the offer card's", () => {
      const { container } = render(
        <>
          <PriceSentence offer={TOKEN} />
          <OfferCard offer={TOKEN} perks={[]} action={null} />
        </>,
      );
      const prices = [...container.querySelectorAll(STEP_ASIDE_FROM.site)];
      expect(prices.map((el) => el.className)).toEqual(["kh-body-s ks-price", "kh-offer__prices", "kh-offer__split", "kh-offer__fine"]);
      for (const el of prices) expect(el.textContent, el.className).toMatch(/₹/);
    });

    /* From the other side: every amount the marketing pages' price components print, in both offer modes, sits inside a
       region the site's bubble steps aside from, so a new amount (an MRP line in the card, say) cannot slip past it. The
       CTA block prints the sentence beside its button (PriceSentence `beside`, with every trust item and the help line);
       the offer card its prices, split, perks (both placements) and fine print. Not here: the drawer's sentence (variant
       `drawer`), which sits in the modal drawer, under which the bubble hides (whatsapp-float.css), and the store's first
       screen (variant `store`), which is the store context's (task 4.7). */
    it("every ₹ amount the site's price components print sits inside a region of the site's selector, in both modes", () => {
      const amounts = (root: Element) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const found: Text[] = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) if (/₹/.test(node.nodeValue ?? "")) found.push(node as Text);
        return found;
      };
      for (const offer of [TOKEN, buildOffer("full")]) {
        const { container, unmount } = render(
          <>
            <CtaBlock cta="finale" trust={Object.values(trustItems)} helpLine offer={offer} ctaLabel={cta.preorder} help={seller.help} />
            {(["home", "product"] as const).map((placement) => (
              <OfferCard
                key={placement}
                offer={offer}
                perks={offer.card.perks[placement].map((perk) => ({ icon: null, text: <RichText text={perk.text} offer={offer} /> }))}
                action={null}
              />
            ))}
          </>,
        );
        const found = amounts(container);
        const printed = found.map((node) => node.nodeValue).join(" | ");
        for (const key of offer.mode === "token" ? (["token", "balance", "headline"] as const) : (["full"] as const)) {
          expect(printed, `${offer.mode}: the ${key} amount is printed`).toContain(offer.prices[key]);
        }
        for (const node of found) expect(node.parentElement!.closest(STEP_ASIDE_FROM.site), `${offer.mode}: "${node.nodeValue}"`).not.toBeNull();
        unmount();
      }
    });

    it("the /thanks selector is the address step's own section, the one that holds the form", () => {
      const { container } = render(
        <AddressStep copy={confirmation.address.empty}>
          <form>
            <input name="line1" />
          </form>
        </AddressStep>,
      );
      expect(container.querySelector(STEP_ASIDE_FROM.thanks)).toBe(container.querySelector("section"));
    });

    /** A marketing page as it reaches the bubble: two prices, then the bubble last (SiteShell renders it after main). */
    function sitePage(prices = ["hero", "close"]) {
      document.body.innerHTML = `<main>${prices.map((id) => `<p class="kh-body-s ks-price" id="${id}">₹499 today</p>`).join("")}</main>`;
      const view = render(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />, { container: document.body.appendChild(document.createElement("div")) });
      return { ...view, link: screen.getByRole("link", { name: CHAT.label }), price: (id: string) => document.getElementById(id)! };
    }

    it("watches every price through its band, and steps aside while any of them crosses it", () => {
      const { link, price } = sitePage();
      expect([...io().watched]).toEqual([price("hero"), price("close")]);
      io().report(price("hero"), true);
      expect(aside(link)).toEqual([true, true]);
      io().report(price("close"), true);
      io().report(price("hero"), false);
      expect(aside(link), "the close's price still in the band").toEqual([true, true]);
      io().report(price("close"), false);
      expect(aside(link)).toEqual([false, false]);
    });

    it("re-measures its band when the bar lifts or drops it (html[data-buybar]), and reads the page's prices again", async () => {
      const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
        return (this.classList.contains("ks-wa") ? { top: 568, bottom: 624, left: 288, right: 344, width: 56, height: 56 } : new DOMRect()) as DOMRect;
      });
      vi.stubGlobal("innerHeight", 640);
      const { link, price } = sitePage();
      const resting = io();
      expect(resting.options.rootMargin).toBe("-568px 0px -16px 0px");
      // The bar shows and lifts the bubble by its height: the band follows it up.
      rect.mockImplementation(function (this: HTMLElement) {
        return (this.classList.contains("ks-wa") ? { top: 488, bottom: 544, left: 288, right: 344, width: 56, height: 56 } : new DOMRect()) as DOMRect;
      });
      const late = document.createElement("p");
      late.className = "ks-price";
      document.querySelector("main")!.append(late);
      await act(async () => void (document.documentElement.dataset.buybar = "shown"));
      expect(resting.disconnected).toBe(true);
      expect(io().options.rootMargin).toBe("-488px 0px -96px 0px");
      expect([...io().watched]).toEqual([price("hero"), price("close"), late]);
      // The new observer's first report decides: the late price sits in the lifted band.
      io().report(late, true);
      expect(aside(link)).toEqual([true, true]);
      await act(async () => void delete document.documentElement.dataset.buybar);
      expect(io().options.rootMargin).toBe("-488px 0px -96px 0px");
    });

    it("re-measures its band when its own move ends (the lift's transition), and not when its label's does", () => {
      sitePage();
      const before = io();
      const moved = (target: Element, propertyName: string) =>
        act(() => void target.dispatchEvent(Object.assign(new Event("transitionend", { bubbles: true }), { propertyName })));
      moved(document.querySelector(".ks-wa__label")!, "transform");
      moved(document.querySelector(".ks-wa")!, "opacity");
      expect(io()).toBe(before);
      moved(document.querySelector(".ks-wa")!, "transform");
      expect(before.disconnected).toBe(true);
      expect(io()).not.toBe(before);
    });

    it("forgets a price that left the page when it re-reads them, so it never stays aside for nothing", async () => {
      const { link, price } = sitePage();
      io().report(price("hero"), true);
      expect(aside(link)).toEqual([true, true]);
      price("hero").remove();
      await act(async () => void (document.documentElement.dataset.buybar = "hidden"));
      expect([...io().watched]).toEqual([price("close")]);
      io().report(price("close"), false);
      expect(aside(link)).toEqual([false, false]);
    });

    it("re-arms on every page change: the layout's bubble watches the new page's prices", () => {
      nav.pathname = "/";
      const { rerender, link } = sitePage(["home-price"]);
      const home = io();
      document.querySelector("main")!.innerHTML = '<p class="ks-price" id="product-price">₹4,999</p>';
      nav.pathname = "/products/kheelu";
      rerender(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
      expect(home.disconnected).toBe(true);
      expect([...io().watched].map((el) => el.id)).toEqual(["product-price"]);
      expect(aside(link)).toEqual([false, false]);
      nav.pathname = "/";
    });

    /* Vercel re-renders Home in its runtime under the route segments ["", "index"], so usePathname() reads "/index" on
       the server and "/" in the browser (task 8c.7; CMO wave 8c review m1). The bubble reads the path through
       usePagePath (src/lib/page-path.ts): one page, one markup, one arming. */
    it("takes /index for Home, as Vercel's runtime render gives it: the same markup, and no re-arm between the two (task 8c.7)", () => {
      const markup = (pathname: string) => {
        nav.pathname = pathname;
        return renderToStaticMarkup(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
      };
      expect(markup("/index")).toBe(markup("/"));
      nav.pathname = "/index";
      const { rerender } = sitePage();
      const armed = io();
      nav.pathname = "/";
      rerender(<WhatsAppFloat href={HREF} chat={CHAT} context="site" />);
      expect(armed.disconnected, "the same page: it stays armed").toBe(false);
      expect(io()).toBe(armed);
    });

    it("keeps its place where the browser cannot tell the width or watch the band, as without JavaScript", () => {
      for (const missing of ["matchMedia", "IntersectionObserver"] as const) {
        vi.stubGlobal(missing, undefined);
        const { link, price, unmount } = sitePage();
        expect(FakeIO.all, missing).toHaveLength(0);
        fireEvent.focusIn(price("hero"));
        expect(aside(link), missing).toEqual([false, false]);
        unmount();
        vi.unstubAllGlobals();
        vi.stubGlobal("IntersectionObserver", FakeIO);
        vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }));
      }
    });

    it("on /thanks steps aside while a field of the address step has focus or the step crosses its band", () => {
      document.body.innerHTML = '<main><section id="address"><form><input id="line1"><button type="submit" id="save">Save</button></form></section></main>';
      render(<WhatsAppFloat href={HREF} chat={CHAT} context="thanks" />, { container: document.body.appendChild(document.createElement("div")) });
      const link = screen.getByRole("link", { name: CHAT.label });
      expect(link).toHaveClass("ph-no-capture");
      const step = document.getElementById("address")!;
      expect([...io().watched]).toEqual([step]);
      fireEvent.focusIn(document.getElementById("line1")!);
      expect(aside(link)).toEqual([true, true]);
      fireEvent.focusOut(document.getElementById("line1")!, { relatedTarget: null });
      expect(aside(link)).toEqual([false, false]);
      io().report(step, true);
      expect(aside(link)).toEqual([true, true]);
    });
  });
});

describe("whatsapp-float.css", () => {
  it("defines WhatsApp green once, as the D050 exception, and paints the bubble with it, also on hover", () => {
    expect(CSS.match(/--ks-wa-green\s*:/g)).toHaveLength(1);
    expect(CSS).toMatch(/--ks-wa-green:\s*#25D366;/i);
    expect(rule(".ks-wa")).toContain("background: var(--ks-wa-green)");
    expect(rule(".ks-wa:hover")).toBe("background: var(--ks-wa-green);");
  });

  it("sits fixed at the bottom right: space-4 plus the safe areas on phones, space-5 from 900 px", () => {
    const base = rule(".ks-wa");
    expect(base).toContain("position: fixed");
    // The right offset adds the right inset (architecture §5.3, task 3.6): a phone held sideways has one.
    expect(base).toContain("right: calc(var(--space-4) + env(safe-area-inset-right))");
    expect(base).toContain("bottom: calc(var(--space-4) + env(safe-area-inset-bottom))");
    expect(base).toContain("margin: 0");
    expect(base).toContain("box-shadow: var(--shadow-lift)");
    const laptop = /@media \(min-width: 900px\)\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    expect(rule(".ks-wa", laptop)).toContain("right: calc(var(--space-5) + env(safe-area-inset-right))");
    expect(rule(".ks-wa", laptop)).toContain("bottom: var(--space-5)");
  });

  /* Architecture §5.3 (task 3.6 item 16): the buy bar's height already holds the bottom inset (its safe-area padding,
     G-09), and the bubble already sits that inset above the edge, so the lift is the bar's height less the inset: on a
     notched phone the bubble stays space-4 above the bar, as everywhere else (D050). */
  it("lifts by the bar's height less the bottom inset while the bar shows (motion.css)", () => {
    const motion = readFileSync("src/motion/motion.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rule('html[data-buybar="shown"] .ks-wa', motion)).toBe(
      "transform: translateY(calc((var(--ks-buybar-h, 0px) - env(safe-area-inset-bottom)) * -1));",
    );
  });

  /* Task 4.7 item 3: stepping aside is the bar's hidden state turned sideways (motion.css 4A): it fades and slides off
     the right edge, past its own width and right offset, so its box leaves every field (a field never reaches past the
     right edge, while one may run below the bottom one). The lift keeps its rule; with reduced motion the bubble's
     transition is none (motion.css's reduced block, motion guard), so it leaves without moving there. */
  it("steps aside off the right edge and fades while .is-hidden (motion.css), on the same transition as the lift", () => {
    const motion = readFileSync("src/motion/motion.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rule(".ks-wa.is-hidden", motion)).toBe("opacity: 0; transform: translateX(calc(100% + var(--space-4) + env(safe-area-inset-right)));");
    expect(rule(".ks-wa", motion)).toBe("transition: transform var(--duration-base) var(--ease-standard), opacity var(--duration-base) var(--ease-standard);");
    expect(CSS).not.toContain("is-hidden");
  });

  /* Task 4.9: lifted by the bar and aside, it leaves off the right edge at its lifted height (the lift's rule alone would
     win over .is-hidden and keep it on screen at opacity 0), so its band stays where it was lifted to and it never drops
     back over the price it left. */
  it("lifted by the bar and aside, it slides off the right edge at its lifted height (motion.css)", () => {
    const motion = readFileSync("src/motion/motion.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rule('html[data-buybar="shown"] .ks-wa.is-hidden', motion)).toBe(
      "transform: translate(calc(100% + var(--space-4) + env(safe-area-inset-right)), calc((var(--ks-buybar-h, 0px) - env(safe-area-inset-bottom)) * -1));",
    );
  });

  it("adds no transition of its own: the lift and the label move only through motion.css", () => {
    expect(CSS).not.toMatch(/transition|animation/);
  });

  it("hides under any open modal dialog", () => {
    expect(rule("html:has(dialog[open]) .ks-wa")).toContain("visibility: hidden");
  });

  it("shows the label on laptops only, beside the bubble, as dark text on a raised surface", () => {
    const label = rule(".ks-wa__label");
    expect(label).toContain("display: none");
    const laptop = /@media \(min-width: 900px\)\s*\{([\s\S]*?)\n\}/.exec(CSS)?.[1] ?? "";
    const shown = rule(".ks-wa__label", laptop);
    expect(shown).toContain("display: block");
    expect(shown).toContain("color: var(--text)");
    expect(shown).toContain("background: var(--surface-raised)");
  });

  it("keeps every page's last content clear of the bubble (body.ks-has-float)", () => {
    expect(rule(".ks-has-float .kh-footer")).toBe(
      "padding-bottom: calc(var(--space-8) + var(--space-4) + env(safe-area-inset-bottom));",
    );
  });
});
