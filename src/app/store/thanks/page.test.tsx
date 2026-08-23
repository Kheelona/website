import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../../../../test/helpers/fake-supabase";
import { signAddressToken } from "@/lib/store/signing";
import { formatThanksSession } from "@/lib/store/thanks-session";
import type { StoreEnv } from "@/lib/store/env";

/**
 * The confirmation page, after the credential moved out of the URL (F-01).
 *
 * Two things are pinned here. That the page still tells a paying parent the
 * truth, reading its authorisation from the cookie the proxy set rather than
 * from a query string. And that a missing or stale cookie produces an honest
 * page with a way back in, not a 404 and not somebody else's order.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = fakeEnv as StoreEnv;
let cookieValue: string | undefined;

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined),
  }),
}));

const { default: ThanksPage } = await import("./page");

const REF = "KH-A2B3-C4D5";

/** A token this fake env will actually verify, an hour from now. */
function liveSession(): string {
  const token = signAddressToken(fakeEnv.signingSecret, REF, Date.now() + 3_600_000);
  return formatThanksSession(REF, token)!;
}

function paidOrder(over: Record<string, unknown> = {}) {
  results["preorders.select"] = {
    data: {
      order_ref: REF,
      tier: "launch",
      amount_paise: 49_900,
      status: "paid",
      email: "parent@example.com",
      address: null,
      ...over,
    },
  };
}

describe("the confirmation page", () => {
  beforeEach(() => {
    calls = [];
    results = {};
    env = fakeEnv as StoreEnv;
    cookieValue = liveSession();
  });

  it("confirms the order from the cookie, and looks it up by the signed reference", async () => {
    paidOrder();
    render(await ThanksPage());

    expect(screen.getByRole("heading", { name: "Your Lumi is reserved." })).toBeInTheDocument();
    expect(screen.getByText("₹499")).toBeInTheDocument();
    expect(screen.getByText("₹4,500, of the ₹4,999 price")).toBeInTheDocument();
    /* The reference the query came from is the one inside the signed cookie,
       never anything a caller could vary. */
    expect(calls.some((c) => c.method === "eq" && c.args[1] === REF)).toBe(true);
  });

  it("never renders the token into the page it hands to the browser", async () => {
    paidOrder();
    const { container } = render(await ThanksPage());
    const mac = cookieValue!.split(".").pop()!;
    expect(container.innerHTML).not.toContain(mac);
  });

  it("asks for the email link again when there is no cookie", async () => {
    cookieValue = undefined;
    paidOrder();
    const { container } = render(await ThanksPage());

    expect(screen.getByRole("heading", { name: "We need your link again." })).toBeInTheDocument();
    /* Nothing about any order escapes this state, and no query was even run. */
    expect(container.textContent).not.toContain(REF);
    expect(calls).toEqual([]);
  });

  it("refuses a tampered cookie the same way", async () => {
    cookieValue = formatThanksSession(REF, "1790000000000.AAAAAAAAAAAAAAAA")!;
    paidOrder();
    render(await ThanksPage());
    expect(screen.getByRole("heading", { name: "We need your link again." })).toBeInTheDocument();
  });

  it("refuses an expired token, however well signed", async () => {
    const stale = signAddressToken(fakeEnv.signingSecret, REF, Date.now() - 1_000);
    cookieValue = formatThanksSession(REF, stale)!;
    paidOrder();
    render(await ThanksPage());
    expect(screen.getByRole("heading", { name: "We need your link again." })).toBeInTheDocument();
  });

  it("renders the honest state on a deployment with no store keys", async () => {
    env = null;
    render(await ThanksPage());
    expect(screen.getByRole("heading", { name: "We need your link again." })).toBeInTheDocument();
  });

  it("tells a full-payment order it owes nothing", async () => {
    paidOrder({ tier: "full", amount_paise: 799_900 });
    render(await ThanksPage());
    expect(screen.getByText("Nothing. You have paid in full")).toBeInTheDocument();
  });
});
