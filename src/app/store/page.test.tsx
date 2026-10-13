import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { STORE_ORIGIN } from "@/config/env";
import { seller } from "@/content/en-IN/seller";
import { storePage } from "@/content/en-IN/store/store-page";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { revealOnMoneyInDocument } from "../../../test/e2e/support/page-checks";
import { fakeEnv } from "../../../test/helpers/fake-supabase";

/* The store page, store.kheelona.com (task 5.15; structure §3.1, §5 row store.html; architecture §16, ADR-013): the
 * route composes the store sections around the frozen checkout. The live mode is read per request from the store (as
 * at the tag) and decides the tier; the page wires PreorderForm and OrderSummary with that tier exactly as before. The
 * films come below every money answer, the payments line closes <main> (deviations V1), and the store's own WhatsApp
 * bubble is the page's (D050). The not-configured state (and beta, D051) says "shortly" rather than failing. */

const env = vi.hoisted(() => ({ value: null as unknown }));
const mode = vi.hoisted(() => ({ value: "token" as "token" | "full" }));
const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env.value }));
vi.mock("@/lib/store/mode", () => ({ preorderMode: async () => mode.value, FULL_TIER: "full" }));
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout: vi.fn() }));

beforeAll(async () => {
  await import("./page");
}, 60_000);

beforeEach(() => {
  env.value = fakeEnv;
  mode.value = "token";
});

const SOURCE = readFileSync("src/app/store/page.tsx", "utf8");

/** The page as the store layout holds it: the route's output inside <main>. */
async function renderPage() {
  const { default: StorePage } = await import("./page");
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup((await StorePage()) as ReactElement)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { doc, main: doc.querySelector("main")! };
}

describe("store page: the configured store (token mode)", () => {
  it("composes the first screen, the form, the agreement card and the questions, then the films", async () => {
    const { main } = await renderPage();
    expect(Array.from(main.querySelectorAll("h1, h2")).map((h) => h.textContent)).toEqual([
      "Pre-order Kheelu.",
      "Your details",
      "What you are agreeing to",
      "Questions before you pay",
      "See Kheelu ask, in real homes.",
    ]);
    expect(main.querySelectorAll("h1")).toHaveLength(1);
  });

  it("wires the checkout as before: the launch tier's amount on the pay button, the token sentence beside it", async () => {
    const { main } = await renderPage();
    expect(main.querySelector('button[type="submit"]')!.textContent).toBe("Pay ₹499 and reserve");
    expect(main.querySelector("form .ks-price")!.textContent).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
    expect(main.querySelectorAll("form")).toHaveLength(1);
  });

  it("puts the trust row, the payment window line and the help line inside the form's block, after the price", async () => {
    const { main } = await renderPage();
    const beside = main.querySelector("form .ks-pay-beside")!;
    expect(Array.from(beside.children).map((c) => c.className)).toEqual(["kh-body-s ks-price", "kh-trustline ks-trust", "kh-body-s ks-muted", "kh-body-s ks-help"]);
  });

  it("the agreement card states the D023 delivery line, never the old ship date", async () => {
    const { main } = await renderPage();
    const card = main.querySelector(".ks-agree")!;
    expect(card.textContent).toContain("Deliveries start mid-November");
    expect(main.textContent).not.toMatch(/Ships|20 October/);
  });

  it("shows the films below every money answer, with no <video> until play is pressed", async () => {
    const { main } = await renderPage();
    const films = main.querySelector('[aria-labelledby="ask-title"]')!;
    const store = main.querySelector(".ks-store")!;
    expect(store.compareDocumentPosition(films) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(films.querySelectorAll("[data-video-id], .ks-film")).not.toHaveLength(0);
    expect(main.querySelector("video")).toBeNull();
    expect(films.querySelector('a[href="#details"]')!.textContent).toContain("Back to your details");
  });

  it("closes <main> with the payments line (deviations V1); the WhatsApp bubble floats after it", async () => {
    const { main } = await renderPage();
    const blocks = Array.from(main.children);
    expect(blocks.at(-1)!.matches("a.ks-wa")).toBe(true);
    expect(blocks.at(-2)!.matches(".ks-store-payments")).toBe(true);
    expect(blocks.at(-2)!.textContent).toBe(
      `${storePage.payments.text} ${storePage.payments.link.label} (opens in a new tab)`,
    );
  });

  it("renders the store's WhatsApp bubble with the store text (D050)", async () => {
    const { main } = await renderPage();
    const bubble = main.querySelector("a.ks-wa")!;
    expect(bubble.getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`);
    expect(bubble.classList.contains("ph-no-capture")).toBe(false);
  });

  it("keeps the in-app note out while it is switched off (N7)", async () => {
    const { main } = await renderPage();
    expect(main.querySelector(".ks-inapp")).toBeNull();
  });

  it("moves nothing on the money: no reveal on the first fold, the h1, the price, the pay button or the form", async () => {
    const { main } = await renderPage();
    expect(revealOnMoneyInDocument(main)).toEqual([]);
  });
});

describe("store page: full mode", () => {
  it("the full tier's amount on the pay button, the full-price sentence with its refund promise, the full card", async () => {
    mode.value = "full";
    const { main } = await renderPage();
    expect(main.querySelector('button[type="submit"]')!.textContent).toBe("Pay ₹7,999 and pre-order");
    expect(main.querySelector("form .ks-price")!.textContent).toBe(
      "₹7,999 (incl. GST), paid in full when you order. Until we dispatch your Kheelu, all of it is refundable.",
    );
    expect(main.querySelector(".ks-store-top__price")!.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(main.querySelector(".ks-agree")!.textContent).toContain("Nothing due before delivery");
  });
});

describe("store page: not configured (no store keys; beta, D051)", () => {
  it("says pre-orders open shortly, that nothing was charged, and offers WhatsApp; no form", async () => {
    env.value = null;
    const { main } = await renderPage();
    expect(main.querySelector("h1")!.textContent).toBe(storePage.notConfigured.title);
    expect(main.textContent).toContain(storePage.notConfigured.body);
    expect(main.textContent).toContain(storePage.notConfigured.note);
    const action = Array.from(main.querySelectorAll("a")).find((a) => a.textContent === storePage.notConfigured.action)!;
    expect(action.getAttribute("href")).toBe(seller.support.whatsapp);
    expect(main.querySelector("form")).toBeNull();
    expect(main.querySelector("a.ks-wa")).not.toBeNull();
  });
});

describe("store page: metadata", () => {
  it("description, Open Graph and Twitter through pageMeta, on the store's own address; no robots (the layout's noindex stays)", async () => {
    getOffer.mockResolvedValue(buildOffer("token"));
    const { generateMetadata } = await import("./page");
    const meta = await generateMetadata();
    const base = pageMeta({ ...storePage.meta, path: "/", offer: buildOffer("token") });
    expect(meta.title).toEqual(base.title);
    expect(meta.description).toBe(base.description);
    expect(meta.twitter).toEqual(base.twitter);
    expect(meta.alternates).toEqual({ canonical: `${STORE_ORIGIN}/` });
    expect(meta.openGraph).toEqual({ ...base.openGraph, url: `${STORE_ORIGIN}/` });
    expect(meta).not.toHaveProperty("robots");
  });

  it("follows the offer mode", async () => {
    getOffer.mockResolvedValue(buildOffer("full"));
    const { generateMetadata } = await import("./page");
    expect((await generateMetadata()).description).toMatch(/^Pre-order Kheelu by Kheelona.*₹7,999 \(incl\. GST\), with delivery/);
  });
});

describe("store page: source", () => {
  it("stays a per-request page, as at the tag (the live mode decides the tier)", () => {
    expect(SOURCE).toContain('export const dynamic = "force-dynamic";');
  });

  it("imports no path task 6.3 deletes", () => {
    for (const legacy of ["atoms/Field", "lib/cn", "lib/interactions", "molecules/PromiseMark", "organisms/VideoMoments", "lib/video-moments", "lib/kheelu-art"]) {
      expect(SOURCE, legacy).not.toContain(legacy);
    }
  });

  it("types no words: the copy is the content module's", () => {
    const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(code).not.toMatch(/"[A-Z][a-z]+ [a-z]+[^"]*\."/);
  });
});
