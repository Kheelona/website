import { readFileSync } from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { seller } from "@/content/en-IN/seller";
import { eventPage, storeNotFound } from "@/content/en-IN/store/event-page";
import { pageMeta } from "@/lib/seo/metadata";
import { NotFoundPanel } from "./_components/NotFoundPanel";

/* The store's dead end (task 6.1; architecture §16.1; checkout.md "Failure and edge states"): a path on the store host
 * with no page behind it lands on the `[...rest]` catch-all, which answers 200 in the store chrome (lib/store/host.ts),
 * and the store's not-found boundary renders the same page should anything ever throw (test/not-found-ssr.test.ts). One
 * panel serves every store state that is not the form: this dead end, a refused event link, the ended partner page,
 * the store without keys, and /thanks when an order will not load. Restyled on the design system: the store's
 * not-configured composition (a section, its h1 and lead, a button, the muted line), words from content. */

afterEach(() => cleanup());

const { default: StoreNotFound, metadata } = await import("./not-found");
const catchAll = await import("./[...rest]/page");

describe("the store's dead end", () => {
  it("a section named by its one h1, the live words, a button to the pre-order page and a person to reach", () => {
    const { container } = render(<StoreNotFound />);
    const section = container.querySelector("section")!;
    const h1 = within(section).getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe(storeNotFound.panel.title);
    expect(section.getAttribute("aria-labelledby")).toBe(h1.id);
    expect(section.querySelector(".kh-heading__lead")!.textContent).toBe(storeNotFound.panel.body);
    const button = within(section).getByRole("link", { name: storeNotFound.panel.action });
    expect(button).toHaveAttribute("href", "/");
    expect(button.className).toBe("kh-btn kh-btn--secondary");
    const help = section.querySelector("p.ks-store-closed")!;
    expect(help.textContent).toBe("Or message us on WhatsApp with your order number and a person will find it.");
    expect(within(help as HTMLElement).getByRole("link")).toHaveAttribute("href", SUPPORT_WHATSAPP_HREF);
  });

  it("closes as every store page does: the payments line, then the store's WhatsApp bubble (D050, store text)", () => {
    const { container } = render(<StoreNotFound />);
    const blocks = Array.from(container.children);
    expect(blocks.map((b) => b.tagName.toLowerCase() + "." + b.className.split(" ").join("."))).toEqual([
      "section.kh-section",
      "div.ks-store-payments",
      "a.kh-iconbtn.kh-iconbtn--l.ks-wa",
    ]);
    expect(blocks[2].getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`);
  });

  it("is the same page at the catch-all, which every unknown store path reaches (and its metadata)", () => {
    const viaCatchAll = render(<catchAll.default />).container.innerHTML;
    cleanup();
    expect(viaCatchAll).toBe(render(<StoreNotFound />).container.innerHTML);
    expect(catchAll.metadata).toBe(metadata);
  });

  it("sets the title, description, Open Graph and Twitter through pageMeta; no robots, no canonical and no og:url", () => {
    const base = pageMeta({ ...storeNotFound.meta, path: "/404" });
    expect(metadata.title).toEqual({ absolute: "Page not found · Kheelona" });
    expect(metadata.description).toBe(storeNotFound.panel.body);
    expect(metadata.twitter).toEqual(base.twitter);
    expect(metadata.openGraph).toEqual({ ...base.openGraph, url: undefined });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata).not.toHaveProperty("alternates");
  });
});

describe("NotFoundPanel, the store's panel", () => {
  it("takes another state's words: a refused link with its reason, the usual price and the live WhatsApp line", () => {
    render(<NotFoundPanel copy={eventPage.refused} body="This event link has expired." />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("That link will not work.");
    expect(screen.getByText("This event link has expired.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pre-order at the usual price" })).toHaveAttribute("href", "/");
    expect(document.querySelector("p.ks-store-closed")!.textContent).toBe(
      "Or message us on WhatsApp and a person will sort it out with you.",
    );
  });

  it("without the button (the store without keys; a reader who has paid), the WhatsApp line stands alone", () => {
    render(<NotFoundPanel copy={eventPage.notConfigured} cta={false} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pre-orders open here shortly.");
    expect(screen.queryByRole("link", { name: /pre-order/i })).toBeNull();
    expect(document.querySelector("p.ks-store-closed")!.textContent).toBe(
      "Message us on WhatsApp and we will reserve one for you by hand in the meantime.",
    );
  });

  it("keeps a page's own title and body over its words (/thanks passes both)", () => {
    render(<NotFoundPanel title="We cannot open that order right now." body="Your link is fine." cta={false} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("We cannot open that order right now.");
    expect(screen.getByText("Your link is fine.")).toBeInTheDocument();
    expect(document.querySelector("p.ks-store-closed")!.textContent).toContain("with your order number");
  });

  it("opens with a partner's mark when given one, before the heading, set a step apart", () => {
    const { container } = render(<NotFoundPanel mark={<span data-mark="partner">Partner</span>} />);
    const inner = container.querySelector(".kh-container")!;
    expect(inner.firstElementChild!.querySelector("[data-mark='partner']")).not.toBeNull();
    expect(inner.firstElementChild!.className).toBe("mb-5");
    expect(inner.children[1].matches("header.kh-heading")).toBe(true);
  });

  it("is built from the design system only: no legacy utility, arbitrary value or mockup class", () => {
    const { container } = render(<NotFoundPanel />);
    const classes = Array.from(container.querySelectorAll("[class]")).flatMap((el) => el.className.split(/\s+/));
    expect(classes.filter((c) => !/^(kh-|ks-)/.test(c))).toEqual([]);
    expect(container.innerHTML).not.toMatch(/\[|text-ink|font-display|bg-action|mk-/);
  });
});

describe("the dead end's sources", () => {
  it("the boundary keeps NotFoundPanel and the catch-all reuses the boundary, so the two can never drift", () => {
    expect(readFileSync("src/app/store/not-found.tsx", "utf8")).toContain("NotFoundPanel");
    expect(readFileSync("src/app/store/[...rest]/page.tsx", "utf8")).toMatch(/from "\.\.\/not-found"/);
  });
});
