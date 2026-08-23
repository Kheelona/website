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

  it("crosses out the usual ₹499 and sells the booking at ₹99", async () => {
    ideabaazRow();
    const { container } = render(await IdeabaazPage());

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Reserve Lumi for");
    expect(heading.textContent).toContain("₹99");
    // the cross-out is a real <s>, holding exactly the public token price
    const struck = container.querySelector("s");
    expect(struck?.textContent).toBe("₹499");
    expect(screen.getByText("Exclusive for the Ideabaaz audience")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pay ₹99 and reserve/ })).toBeInTheDocument();
  });

  it("derives the balance: ₹99 today, ₹4,900 on dispatch, never ₹4,500", async () => {
    ideabaazRow();
    const { container } = render(await IdeabaazPage());
    expect(screen.getByText("₹4,900 on dispatch")).toBeInTheDocument();
    expect(container.textContent).not.toContain("₹4,500");
  });

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
