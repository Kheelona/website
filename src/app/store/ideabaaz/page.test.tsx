import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fakeClient,
  fakeEnv,
  type RecordedCall,
} from "../../../../test/helpers/fake-supabase";
import type { StoreEnv } from "@/lib/store/env";

/**
 * The Ideabaaz page is the first PUBLIC event tier (2026-08-23): the route
 * signs its own tier, so what these tests pin is the presentation contract —
 * the struck ₹499 beside the ₹99, the derived ₹4,900 balance, and an honest
 * ended state — while tiers.test.ts owns the resolution rules it rides on.
 */

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = fakeEnv as StoreEnv;

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env }));

const { default: IdeabaazPage } = await import("./page");

function ideabaazRow() {
  results["event_tiers.select"] = {
    data: {
      id: "ideabaaz",
      label: "Ideabaaz exclusive price",
      amount_paise: 9_900,
      cap: null,
      expires_on: "2026-08-31",
      active: true,
    },
  };
}

describe("the Ideabaaz pre-booking page", () => {
  beforeEach(() => {
    calls = [];
    results = {};
    env = fakeEnv as StoreEnv;
  });

  /* ⚑ THE TWO LIVE-PRICE TESTS WERE REMOVED ON 2026-09-01, when the tier
     closed (founder: "we can mark it closed").

     They asserted the ₹99 offer: the struck-through ₹499, the "Pay ₹99 and
     reserve" button, and the derived ₹4,900 balance. Both began failing on
     1 September on their own, because the fixture above carries the tier's real
     `expires_on` of 2026-08-31 and the page correctly stopped selling. Nothing
     was broken; the calendar simply arrived. That state cannot recur for this
     tier, so testing it would mean faking a future expiry and pinning a
     presentation contract for an offer that no longer exists.

     What is worth keeping is below: the ended state is now the ONLY state this
     page has, and it is what a late QR scan gets. The generic tier resolution
     these tests rode on is owned by test/store/tiers.test.ts, and any future
     event page gets its own coverage there. */

  it("carries the partner mark, since the page is the co-branding", async () => {
    ideabaazRow();
    render(await IdeabaazPage());
    expect(screen.getByAltText("Ideabaaz Startup Fest")).toBeInTheDocument();
  });

  it("says the exclusive has ended once the tier is closed, and offers the usual price", async () => {
    /* No row: what the page sees after the founder deletes or deactivates the
       tier, and (via "expired") after 31 August. Same ended shape. */
    const { container } = render(await IdeabaazPage());
    expect(
      screen.getByRole("heading", { name: "The Ideabaaz exclusive has ended." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pre-order at the usual price" })).toHaveAttribute(
      "href",
      "/",
    );
    // no form and no ₹99 offer survive the close
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).not.toContain("₹99 today");
  });

  it("renders the honest not-open state on a deployment without store keys", async () => {
    env = null;
    render(await IdeabaazPage());
    expect(
      screen.getByRole("heading", { name: "This page is not open yet." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/nothing has been charged/i)).toBeInTheDocument();
  });
});
