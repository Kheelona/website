import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { seller } from "@/content/en-IN/seller";
import { storePage } from "@/content/en-IN/store/store-page";
import { StoreNotConfigured } from "./StoreNotConfigured";

/* The store before its keys are in place, and on beta, which never takes a payment (D051): one state for every store
 * page that would sell (store.md, "Store not switched on"). Task 6.3 built it inside the store page; task 7.1c moved it
 * here so the event page /e/<tier> renders the same state (CMO review C m3: the event page had only a muted link, and
 * still printed "Payments by Razorpay." where nothing can be paid). */

/** The state as the store layout holds it: inside <main>. */
const renderState = () => render(<StoreNotConfigured />, { container: document.body.appendChild(document.createElement("main")) });

describe("StoreNotConfigured", () => {
  it("says pre-orders open shortly and that nothing was charged, in the store page's approved words", () => {
    renderState();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(storePage.notConfigured.title);
    expect(screen.getByText(storePage.notConfigured.body)).toBeInTheDocument();
  });

  it("offers WhatsApp as a secondary button with its icon, then the note as the muted line; no button to the store", () => {
    const { container } = renderState();
    const actions = container.querySelector(".kh-section__actions")!;
    const button = within(actions as HTMLElement).getByRole("link", { name: storePage.notConfigured.action });
    expect(button).toHaveAttribute("href", seller.support.whatsapp);
    expect(button.className).toMatch(/\bkh-btn--secondary\b/);
    expect(button.querySelector("svg")).not.toBeNull();
    expect(actions.nextElementSibling!.matches("p.kh-body-s.ks-muted.ks-store-closed")).toBe(true);
    expect(actions.nextElementSibling!.textContent).toBe(storePage.notConfigured.note);
    expect(screen.queryByRole("link", { name: /pre-order/i })).toBeNull();
  });

  it("prints no payments line, since nothing can be paid, and closes with the store's WhatsApp bubble (D050)", () => {
    const { container } = renderState();
    expect(container.querySelector(".ks-store-payments")).toBeNull();
    expect(container.textContent).not.toMatch(/Razorpay|payment fees/);
    const blocks = Array.from(container.children);
    expect(blocks.map((b) => b.tagName.toLowerCase())).toEqual(["section", "a"]);
    expect(blocks[1].matches("a.ks-wa")).toBe(true);
    expect(blocks[1].getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`);
  });

  it("shows no form and nothing to buy", () => {
    const { container } = renderState();
    expect(container.querySelector("form, button[type=submit], .kh-btn--cta")).toBeNull();
  });
});
