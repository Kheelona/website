import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { DELIVERY_TEXT } from "@/content/en-IN/delivery";
import { navigation } from "@/content/en-IN/navigation";
import { seller } from "@/content/en-IN/seller";
import { eventPage } from "@/content/en-IN/store/event-page";
import { storePage } from "@/content/en-IN/store/store-page";
import { revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";

const startCheckout = vi.hoisted(() => vi.fn());
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout }));

const { StoreClose, TierCheckout } = await import("./TierCheckout");

/* An event tier's checkout (task 6.1; architecture §16.1: the event and partner pages have no mockup and reuse the
 * store page's layout and components, ADR-013). The tier was priced on the server; this composes the store's folds
 * around the frozen checkout with that tier's two amounts, always in the token shape, and keeps the signature. */

const EXPO = { id: "bangalore-expo", amountPaise: 9_900, label: "Bangalore expo price" };

/** The checkout as the store layout holds it: inside <main>. */
function renderCheckout(mark?: ReactNode) {
  return render(
    <TierCheckout tier={EXPO} signature="sig-16-characters" amountLabel="₹99" balanceLabel="₹4,900" content={eventPage.checkout} mark={mark} />,
    { container: document.body.appendChild(document.createElement("main")) },
  );
}

afterEach(() => cleanup());

describe("TierCheckout: the store page's folds for an event tier", () => {
  it("shows the tier's price name in its own heading, above the store's h1 (OrderSummary no longer prints it; 5.15 review)", () => {
    const { container } = renderCheckout();
    const top = container.querySelector(".ks-store-top")!;
    expect(top.querySelector(".kh-eyebrow")!.textContent).toBe("Bangalore expo price");
    expect(within(top as HTMLElement).getByRole("heading", { level: 1 }).textContent).toBe("Pre-order Kheelu.");
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(Array.from(container.querySelectorAll("h2")).map((h) => h.textContent)).toEqual([
      "Your details",
      "What you are agreeing to",
      "Questions before you pay",
    ]);
  });

  it("says what the tier costs today, the balance and the total, in the D028 sentence, on the first screen and beside the button", () => {
    const { container } = renderCheckout();
    const sentence = "Reserve yours for ₹99 today, refundable until dispatch, then pay ₹4,900 before delivery: ₹4,999 in total (incl. GST).";
    expect(container.querySelector(".ks-store-top__price")!.textContent).toBe(sentence);
    expect(container.querySelector("form .ks-price")!.textContent).toBe(sentence);
    expect(screen.getByRole("button", { name: "Pay ₹99 and reserve" })).toHaveAttribute("type", "submit");
  });

  it("states the token shape in the agreement card and the questions, with the D023 delivery line, never the old date", () => {
    const { container } = renderCheckout();
    const card = container.querySelector(".ks-agree")!;
    const heads = Array.from(card.querySelectorAll(".kh-label")).map((p) => p.textContent);
    expect(heads).toEqual(["₹99 today", "₹4,900 before delivery", "Refundable in full", DELIVERY_TEXT]);
    expect(container.textContent).not.toMatch(/Ships|20 October/);
    expect(container.querySelector(".ks-store__side")!.textContent).toContain("A refundable ₹99 today reserves your Kheelu");
  });

  it("puts the store's trust row, payment window line and help line beside the pay button", () => {
    const { container } = renderCheckout();
    const beside = container.querySelector("form .ks-pay-beside")!;
    expect(Array.from(beside.children).map((c) => c.className)).toEqual([
      "kh-body-s ks-price",
      "kh-trustline ks-trust",
      "kh-body-s ks-muted",
      "kh-body-s ks-help",
    ]);
    expect(beside.textContent).toContain("The button opens Razorpay’s payment window.");
  });

  it("sends the tier and its signature with the order, never an amount (the server re-prices it)", async () => {
    // Only fetch is replaced (test/setup.ts stubs the browser globals the bubble needs; they stay).
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ message: "stop here" }), { status: 409 }));
    try {
      const user = userEvent.setup();
      renderCheckout();
      await user.type(screen.getByLabelText("Your name", { exact: false }), "QA Test Parent");
      await user.type(screen.getByLabelText("Indian WhatsApp number", { exact: false }), "9187546483");
      await user.type(screen.getByLabelText("Email", { exact: false }), "qa@example.com");
      await user.type(screen.getByLabelText("Your child’s age", { exact: false }), "4");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Pay ₹99 and reserve" }));
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toBe("/api/preorder/create-order");
      const body = JSON.parse(String(init.body)) as Record<string, unknown>;
      expect(body).toMatchObject({ tier: "bangalore-expo", signature: "sig-16-characters" });
      expect(body).not.toHaveProperty("amount");
      expect(body).not.toHaveProperty("amountPaise");
      expect(startCheckout).not.toHaveBeenCalled();
    } finally {
      fetchMock.mockRestore();
    }
  });

  it("opens the first column with a partner's mark when given one, before the first screen", () => {
    const { container } = renderCheckout(<span data-mark="partner">Partner</span>);
    const main = container.querySelector(".ks-store__main")!;
    expect(main.firstElementChild!.matches("[data-mark='partner']")).toBe(true);
    expect(main.children[1].matches(".ks-store-top")).toBe(true);
  });

  it("closes with the payments line, then the store's WhatsApp bubble (D050, store text)", () => {
    const { container } = renderCheckout();
    const blocks = Array.from(container.children);
    expect(blocks.map((b) => b.className)).toEqual(["kh-section ks-store", "ks-store-payments", "kh-iconbtn kh-iconbtn--l ks-wa"]);
    expect(blocks[2].getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`);
  });

  it("moves nothing on the money: no reveal on the first screen, the h1, the price, the pay button or the form", () => {
    renderCheckout();
    expect(document.querySelector("main .ks-store-top")).not.toBeNull();
    expect(revealOnMoneyInDocument(document)).toEqual([]);
  });

  it("renders no <video> and no film: the event page is the form and its answers", () => {
    const { container } = renderCheckout();
    expect(container.querySelector("video, [data-films]")).toBeNull();
  });
});

describe("StoreClose: what ends every store page but /thanks", () => {
  it("the payments line with its chargeback link (deviations V1), then the bubble with the store's text", () => {
    const { container } = render(<StoreClose />);
    const [line, bubble] = Array.from(container.children);
    expect(line.className).toBe("ks-store-payments");
    expect(line.textContent).toBe(`${storePage.payments.text} ${storePage.payments.link.label}${navigation.labels.newTabNote}`);
    expect(line.querySelector("a")!.getAttribute("href")).toBe(`${MARKETING_ORIGIN}${storePage.payments.link.href}`);
    expect(bubble.matches("a.ks-wa")).toBe(true);
    expect(bubble.getAttribute("aria-label")).toBe(seller.chat.label);
    expect(bubble.classList.contains("ph-no-capture")).toBe(false);
  });
});

beforeEach(() => startCheckout.mockReset());
