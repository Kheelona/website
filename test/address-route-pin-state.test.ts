import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "./helpers/fake-supabase";
import { signAddressToken } from "@/lib/store/signing";
import { resetRateLimits } from "@/lib/store/rate-limit";

/* D072 (K-184 B8): the server runs the same validateAddress as the form, so a PIN code that belongs to another state is
   refused there too, with the approved line, and nothing is written. The frozen address/route.test.ts is not touched. */

const MISMATCH = "This PIN code belongs to a different state. Please check your PIN code and state.";
const REF = "KH-A2B3-C4D5";

let calls: RecordedCall[] = [];

const storeEnv = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv }));
vi.mock("@/lib/store/db", () => ({
  db: () =>
    fakeClient({ "preorders.update": { data: { order_ref: "KH-A2B3-C4D5" }, error: null } }, calls),
}));

const { POST } = await import("@/app/api/preorder/address/route");

const address = {
  line1: "10",
  line2: "",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
};

function post(overrides: Partial<typeof address>) {
  const token = signAddressToken(fakeEnv.signingSecret, REF, Date.now() + 60_000);
  return POST(
    new Request("https://store.kheelona.com/api/preorder/address", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
      body: JSON.stringify({ orderRef: REF, token, ...address, ...overrides }),
    }),
  );
}

describe("POST /api/preorder/address, PIN code against the state (D072)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
    calls = [];
    storeEnv.mockReturnValue(fakeEnv);
  });

  it("answers 422 with the approved line when the PIN belongs to another state, and writes nothing", async () => {
    const response = await post({ state: "Kerala" });
    expect(response.status).toBe(422);
    const body = (await response.json()) as { error: string; errors: Record<string, string> };
    expect(body.error).toBe("invalid");
    expect(body.errors).toEqual({ pincode: MISMATCH });
    expect(calls.some((c) => c.method === "update")).toBe(false);
  });

  it("saves a house of just '10' with a PIN that matches the state", async () => {
    const response = await post({});
    expect(response.status).toBe(200);
    expect(calls.some((c) => c.method === "update")).toBe(true);
  });
});
