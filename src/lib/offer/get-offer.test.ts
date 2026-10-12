import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StoreEnv } from "@/lib/store/env";

/* getOffer (ADR-005, architecture §7; task 2.1 acceptance 3): the live mode through one cached
 * read, key "offer-mode", revalidate 300, tag "offer"; no store environment (local, CI, beta per
 * D051) or any failure reads as token, the store's own failure rule (mode.ts). */

const cacheCalls: { keyParts: unknown; options: unknown }[] = [];
let cacheBroken = false;
vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<unknown>, keyParts: unknown, options: unknown) => {
    cacheCalls.push({ keyParts, options });
    return async () => {
      if (cacheBroken) throw new Error("Invariant: incrementalCache missing");
      return fn();
    };
  },
}));

const storeEnv = vi.fn<() => StoreEnv | null>();
vi.mock("@/lib/store/env", () => ({ storeEnv: () => storeEnv() }));

const preorderMode = vi.fn<(env: StoreEnv) => Promise<"token" | "full">>();
vi.mock("@/lib/store/mode", () => ({ preorderMode: (env: StoreEnv) => preorderMode(env) }));

const ENV = { supabaseUrl: "https://example.supabase.co" } as StoreEnv;

async function load() {
  return import("./get-offer");
}

beforeEach(() => {
  cacheBroken = false;
  storeEnv.mockReset();
  preorderMode.mockReset();
});

describe("the cache", () => {
  it("wraps the mode read in unstable_cache with the ADR-005 key, window and tag", async () => {
    const mod = await load();
    expect(cacheCalls).toContainEqual({ keyParts: ["offer-mode"], options: { revalidate: 300, tags: ["offer"] } });
    expect(mod.OFFER_REVALIDATE_SECONDS).toBe(300);
  });
});

describe("getOffer", () => {
  it("is token with no store environment, without asking the database", async () => {
    storeEnv.mockReturnValue(null);
    const { getOffer } = await load();
    const offer = await getOffer();
    expect(offer.mode).toBe("token");
    expect(offer.headlinePaise).toBe(499_900);
    expect(preorderMode).not.toHaveBeenCalled();
  });

  it("follows the store's mode when it is full", async () => {
    storeEnv.mockReturnValue(ENV);
    preorderMode.mockResolvedValue("full");
    const { getOffer } = await load();
    const offer = await getOffer();
    expect(preorderMode).toHaveBeenCalledWith(ENV);
    expect(offer.mode).toBe("full");
    expect(offer.headlinePaise).toBe(799_900);
  });

  it("follows the store's mode when it is token", async () => {
    storeEnv.mockReturnValue(ENV);
    preorderMode.mockResolvedValue("token");
    const { getOffer } = await load();
    expect((await getOffer()).mode).toBe("token");
  });

  it("reads a failed count as token, never as full", async () => {
    storeEnv.mockReturnValue(ENV);
    preorderMode.mockRejectedValue(new Error("supabase paused"));
    const { getOffer } = await load();
    expect((await getOffer()).mode).toBe("token");
  });

  it("renders the token offer rather than failing the page when the cache itself fails", async () => {
    cacheBroken = true;
    storeEnv.mockReturnValue(ENV);
    preorderMode.mockResolvedValue("full");
    const { getOffer } = await load();
    expect((await getOffer()).mode).toBe("token");
  });

  it("reads a failure to read the environment as token", async () => {
    storeEnv.mockImplementation(() => {
      throw new Error("bad env");
    });
    const { getOffer } = await load();
    expect((await getOffer()).mode).toBe("token");
  });
});
