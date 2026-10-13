import { readFileSync } from "node:fs";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sign } from "@/lib/store/signing";
import { pageMeta } from "@/lib/seo/metadata";
import { seller } from "@/content/en-IN/seller";
import { partnerPage } from "@/content/en-IN/store/partner-page";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../test/helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/* The partner page's presentation (task 6.1; architecture §16.1; ADR-013). Its frozen test (page.test.tsx) pins the
 * contract that matters now: the lockup, the ended state, the not-configured state. This file covers the restyle: the
 * ended state in the store's panel under the Ideabaaz lockup (B29), and the live branch, which no visitor can reach
 * since the tier expired on 31 August 2026 but which serves any future partner tier, in the store's folds. */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = fakeEnv as StoreEnv;

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env }));
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout: vi.fn() }));

const { default: IdeabaazPage, metadata, dynamic } = await import("./page");

const PRODUCTION = "https://store.kheelona.com/ideabaaz";
const bubbleHref = `${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`;

function ideabaazRow(over: Record<string, unknown> = {}) {
  results["event_tiers.select"] = {
    data: { id: "ideabaaz", label: "Ideabaaz exclusive price", amount_paise: 9_900, cap: null, expires_on: "2026-08-31", active: true, ...over },
  };
}

function lockup(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>(`img[alt="${partnerPage.logo.alt}"]`)!;
}

beforeEach(() => {
  calls = [];
  results = {};
  env = fakeEnv as StoreEnv;
});
afterEach(() => cleanup());

describe("the partner page: ended (the page every late QR scan meets)", () => {
  it("opens with the Ideabaaz lockup, then says the exclusive has ended and offers the usual price and a person", async () => {
    ideabaazRow();
    const { container } = render(await IdeabaazPage());
    const panel = container.querySelector("section")!;
    expect(panel.querySelector(".kh-container")!.firstElementChild!.contains(lockup(container))).toBe(true);
    expect(within(panel).getByRole("heading", { level: 1 }).textContent).toBe(partnerPage.ended.title);
    expect(panel.querySelector(".kh-heading__lead")!.textContent).toBe(partnerPage.ended.closed);
    expect(within(panel).getByRole("link", { name: "Pre-order at the usual price" })).toHaveAttribute("href", "/");
    expect(panel.querySelector("p.ks-store-closed")!.textContent).toBe("Or message us on WhatsApp and a person will sort it out with you.");
    expect(container.querySelector("form")).toBeNull();
  });

  it("names the allocation when that is what ended it", async () => {
    ideabaazRow({ expires_on: "2099-12-31", cap: 5 });
    results["preorders.select"] = { count: 5 };
    const { container } = render(await IdeabaazPage());
    expect(container.querySelector(".kh-heading__lead")!.textContent).toBe(partnerPage.ended.full);
  });

  it("closes as every store page does: the payments line, then the store's WhatsApp bubble", async () => {
    ideabaazRow();
    const { container } = render(await IdeabaazPage());
    const blocks = Array.from(container.children);
    expect(blocks.at(-2)!.className).toBe("ks-store-payments");
    expect(blocks.at(-1)!.getAttribute("href")).toBe(bubbleHref);
  });
});

describe("the partner page: the store without keys (and on beta, D051)", () => {
  it('keeps the lockup and reads "Pre-orders open here shortly.", with WhatsApp and no button to a closed store', async () => {
    env = null;
    const { container } = render(await IdeabaazPage());
    expect(lockup(container)).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pre-orders open here shortly.");
    expect(container.querySelector("p.ks-store-closed")!.textContent).toBe(
      "Message us on WhatsApp and we will reserve one for you by hand in the meantime.",
    );
    expect(screen.queryByRole("link", { name: /pre-order/i })).toBeNull();
    expect(calls).toEqual([]);
  });
});

describe("the partner page: a live partner tier (the shape any future partner page takes)", () => {
  it("the store's folds under the lockup, the tier's price name in the first screen's heading, the token shape", async () => {
    ideabaazRow({ expires_on: "2099-12-31" });
    const { container } = render(await IdeabaazPage());
    const main = container.querySelector(".ks-store__main")!;
    expect(main.firstElementChild).toBe(lockup(container));
    expect(main.querySelector(".ks-store-top .kh-eyebrow")!.textContent).toBe("Ideabaaz exclusive price");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pre-order Kheelu.");
    expect(screen.getByRole("button", { name: "Pay ₹99 and reserve" })).toBeInTheDocument();
    expect(container.querySelector(".ks-agree")!.textContent).toContain("₹4,900 before delivery");
  });

  it("sends the tier with the signature the server minted for it, never an amount", async () => {
    ideabaazRow({ expires_on: "2099-12-31" });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ message: "stop" }), { status: 409 }));
    try {
      const user = userEvent.setup();
      render(await IdeabaazPage());
      await user.type(screen.getByLabelText("Your name", { exact: false }), "QA Test Parent");
      await user.type(screen.getByLabelText("Indian WhatsApp number", { exact: false }), "9187546483");
      await user.type(screen.getByLabelText("Email", { exact: false }), "qa@example.com");
      await user.type(screen.getByLabelText("Your child’s age", { exact: false }), "4");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Pay ₹99 and reserve" }));
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      const body = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body)) as Record<string, unknown>;
      expect(body).toMatchObject({ tier: "ideabaaz", signature: sign(fakeEnv.signingSecret, "event-link", "ideabaaz") });
      expect(body).not.toHaveProperty("amountPaise");
    } finally {
      fetchMock.mockRestore();
    }
  });
});

describe("the Ideabaaz lockup (B29)", () => {
  it("is the live file as a plain image (assets.md), sized by the DS logo class and a DS space, its box reserved", async () => {
    ideabaazRow();
    const { container } = render(await IdeabaazPage());
    const img = lockup(container);
    expect(img.getAttribute("src")).toBe(partnerPage.logo.src);
    expect([img.getAttribute("width"), img.getAttribute("height")]).toEqual([String(partnerPage.logo.width), String(partnerPage.logo.height)]);
    expect(img.className).toBe("kh-logo h-7");
    expect(img.hasAttribute("data-priority")).toBe(false);
  });
});

describe("the partner page: metadata", () => {
  it("title, description, Open Graph and Twitter through pageMeta, on the production store's address; no robots", () => {
    const base = pageMeta({ ...partnerPage.meta, path: "/ideabaaz" });
    expect(metadata.title).toEqual({ absolute: "Ideabaaz exclusive pre-order · Kheelona" });
    expect(metadata.description).toBe(partnerPage.meta.description);
    expect(metadata.alternates).toEqual({ canonical: PRODUCTION });
    expect(metadata.openGraph).toEqual({ ...base.openGraph, url: PRODUCTION });
    expect(metadata.twitter).toEqual(base.twitter);
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("the partner page: source", () => {
  const code = readFileSync("src/app/store/ideabaaz/page.tsx", "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

  it("stays a per-request page, as at the tag", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("imports no path task 6.3 deletes, never the feature barrel, and leaves next/image to the media primitives", () => {
    expect(code).not.toMatch(/lib\/kheelu-art|atoms\/|lib\/cn"|lib\/interactions|molecules\/|organisms\//);
    expect(code).not.toMatch(/from "@\/features\/preorder";|from "next\/image"/);
  });

  it("types no words, amount or date: the copy is the content module's, the amount and expiry the tier row's", () => {
    expect(code).not.toMatch(/"[A-Z][a-z]+ [a-z]+[^"]*\."/);
    expect(code).not.toMatch(/₹|31 August/);
  });
});
