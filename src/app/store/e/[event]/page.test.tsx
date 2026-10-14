import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sign } from "@/lib/store/signing";
import { pageMeta } from "@/lib/seo/metadata";
import { seller } from "@/content/en-IN/seller";
import { eventPage, type TierRefusal } from "@/content/en-IN/store/event-page";
import { storePage } from "@/content/en-IN/store/store-page";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../../test/helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/* The event page, store.kheelona.com/e/<tier>?sig=… (task 6.1; architecture §16.1; checkout.md "Variants"). What a QR
 * code at a stall points at. Its logic is the tag's, unchanged (ADR-013): the signed tier is resolved and priced on the
 * server, a refused link says why, a store without keys says it opens shortly. Only the presentation is new: the store
 * page's folds around the same checkout, the tier's price name beside the store's age band in the first screen's
 * eyebrow (task 7.1c, CMO review C m2), a refused link's body per reason from the copy page (7.1c, m1), and the store
 * page's own not-configured state (7.1c, m3). */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = fakeEnv as StoreEnv;

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env }));
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout: vi.fn() }));

const { default: EventPage, metadata, dynamic } = await import("./page");

const SIG = sign(fakeEnv.signingSecret, "event-link", "bangalore-expo");

function expoRow(over: Record<string, unknown> = {}) {
  results["event_tiers.select"] = {
    data: { id: "bangalore-expo", label: "Bangalore expo price", amount_paise: 9_900, cap: null, expires_on: null, active: true, ...over },
  };
}

async function visit(event: string, sig?: string) {
  return render(await EventPage({ params: Promise.resolve({ event }), searchParams: Promise.resolve(sig ? { sig } : {}) }));
}

const bubbleHref = `${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`;

beforeEach(() => {
  calls = [];
  results = {};
  env = fakeEnv as StoreEnv;
});
afterEach(() => cleanup());

describe("event page: a signed, live tier", () => {
  it("resolves the tier from the link and sells it in the token shape, its price name in the first screen's heading", async () => {
    expoRow();
    const { container } = await visit("bangalore-expo", SIG);
    expect(calls.find((c) => c.table === "event_tiers" && c.method === "eq")?.args).toEqual(["id", "bangalore-expo"]);
    expect(container.querySelector(".ks-store-top .kh-eyebrow")!.textContent).toBe("Bangalore expo price · Ages 3 to 7");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Pre-order Kheelu.");
    expect(screen.getByRole("button", { name: "Pay ₹99 and reserve" })).toBeInTheDocument();
    expect(container.querySelector(".ks-store-top__price")!.textContent).toContain("₹99 today");
    expect(container.querySelector(".ks-store-top__price")!.textContent).toContain("₹4,900 before delivery");
    expect(container.querySelectorAll("form")).toHaveLength(1);
  });

  it("derives the balance from this tier's token, never the public one: ₹4,999 less ₹249 is ₹4,750", async () => {
    expoRow({ amount_paise: 24_900 });
    const { container } = await visit("bangalore-expo", SIG);
    expect(container.querySelector(".ks-agree")!.textContent).toContain("₹4,750 before delivery");
    expect(container.textContent).not.toContain("₹4,500");
  });

  it("closes with the payments line and the store's bubble (D050, store text)", async () => {
    expoRow();
    const { container } = await visit("bangalore-expo", SIG);
    const blocks = Array.from(container.children);
    expect(blocks.at(-2)!.className).toBe("ks-store-payments");
    expect(blocks.at(-1)!.getAttribute("href")).toBe(bubbleHref);
  });
});

describe("event page: a link the store refuses", () => {
  const cases: [string, () => Promise<ReturnType<typeof render>>, TierRefusal][] = [
    ["no signature", () => visit("bangalore-expo"), "bad-signature"],
    ["a forged signature", () => visit("bangalore-expo", "AAAAAAAAAAAAAAAA"), "bad-signature"],
    ["an unknown tier", () => visit("bangalore-expo", SIG), "unknown"],
    [
      "a tier set up without a real amount",
      () => {
        expoRow({ amount_paise: 0 });
        return visit("bangalore-expo", SIG);
      },
      "unknown",
    ],
    [
      "an expired tier",
      () => {
        expoRow({ expires_on: "2026-08-31" });
        return visit("bangalore-expo", SIG);
      },
      "expired",
    ],
    [
      "an allocation that has gone",
      () => {
        expoRow({ cap: 10 });
        results["preorders.select"] = { count: 10 };
        return visit("bangalore-expo", SIG);
      },
      "full",
    ],
    [
      "the public token tier once the store is in full mode",
      () => {
        results["preorders.select"] = { count: 1_000_000 };
        return visit("launch");
      },
      "cap-reached",
    ],
    ["the public full tier while the store is in token mode", () => visit("full"), "not-yet"],
  ];

  it.each(cases)("%s: says the link will not work and why, then the usual price and a person", async (_name, open, reason) => {
    const { container } = await open();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("That link will not work.");
    // The copy page's body for the reason (store.md, "Event link refused"), never the frozen tiers.ts words.
    expect(container.querySelector(".kh-heading__lead")!.textContent).toBe(eventPage.refused.reasons[reason]);
    // No amount anywhere on the screen, so nothing can contradict the store's own price in either mode (D028).
    expect(container.textContent).not.toMatch(/₹/);
    expect(screen.getByRole("link", { name: eventPage.refused.action })).toHaveAttribute("href", "/");
    expect(container.querySelector("p.ks-store-closed")!.textContent).toBe(
      "Or message us on WhatsApp and a person will sort it out with you.",
    );
    expect(container.querySelector("form")).toBeNull();
    expect(Array.from(container.children).at(-1)!.getAttribute("href")).toBe(bubbleHref);
  });
});

describe("event page: the store before its keys are in place (and on beta, D051)", () => {
  /* CMO review C m3 (task 7.1c): the store page's own state (store.md, "Store not switched on"), not a muted link
     beside a payments line that names a payment provider where nothing can be paid. */
  it('renders the store page\'s not-configured state: "Pre-orders open here shortly.", the WhatsApp button and the note', async () => {
    env = null;
    const { container } = await visit("bangalore-expo", SIG);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(storePage.notConfigured.title);
    expect(container.textContent).toContain(storePage.notConfigured.body);
    const button = screen.getByRole("link", { name: storePage.notConfigured.action });
    expect(button).toHaveAttribute("href", seller.support.whatsapp);
    expect(button.className).toMatch(/\bkh-btn--secondary\b/);
    expect(container.querySelector("p.ks-store-closed")!.textContent).toBe(storePage.notConfigured.note);
    expect(screen.queryByRole("link", { name: /pre-order/i })).toBeNull();
    expect(container.querySelector("form")).toBeNull();
    expect(calls).toEqual([]);
  });

  it("prints no payments line, and closes with the store's bubble", async () => {
    env = null;
    const { container } = await visit("bangalore-expo", SIG);
    expect(container.querySelector(".ks-store-payments")).toBeNull();
    expect(container.textContent).not.toMatch(/Razorpay|payment fees/);
    expect(Array.from(container.children).map((b) => b.tagName.toLowerCase())).toEqual(["section", "a"]);
    expect(Array.from(container.children).at(-1)!.getAttribute("href")).toBe(bubbleHref);
  });
});

describe("event page: metadata", () => {
  it("title, description, Open Graph and Twitter through pageMeta; no robots, no canonical, no og:url (the link is the address)", () => {
    const base = pageMeta({ ...eventPage.meta, path: "/" });
    expect(metadata.title).toEqual({ absolute: "Pre-order Kheelu · Kheelona" });
    expect(metadata.description).toBe(eventPage.meta.description);
    expect(metadata.twitter).toEqual(base.twitter);
    expect(metadata.openGraph).toEqual({ ...base.openGraph, url: undefined });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata).not.toHaveProperty("alternates");
  });
});

describe("event page: source", () => {
  const SOURCE = readFileSync("src/app/store/e/[event]/page.tsx", "utf8");
  const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

  it("stays a per-request page, as at the tag", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("imports no path task 6.3 deletes (the old Kheelu art, atoms, cn), and never the feature barrel", () => {
    expect(code).not.toMatch(/lib\/kheelu-art|atoms\/|lib\/cn"|lib\/interactions|molecules\/|organisms\//);
    expect(code).not.toMatch(/from "@\/features\/preorder";/);
  });

  it("types no words: the copy is the content module's, and no amount or age is typed", () => {
    expect(code).not.toMatch(/"[A-Z][a-z]+ [a-z]+[^"]*\."/);
    expect(code).not.toMatch(/₹|\bfriend\b|3\+/);
  });
});
