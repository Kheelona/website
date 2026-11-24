import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { payReturnUrl, prefersRedirectCheckout } from "@/features/preorder/components/redirect-checkout";
import { startCheckout } from "@/features/preorder/lib/checkout";

/**
 * Redirect checkout only where the page cannot be trusted to survive (D070 / B2, K-172; output/2026-W48/engineering/B2-spec.md).
 *
 * In-app and WebView browsers lose the page, or never call Razorpay's in-page `handler`, so they pay by redirect to our
 * /pay/return; Safari, Chrome, Samsung Internet and Firefox keep the window and the handler. The user agents are real
 * ones, one per kind; every expectation is a literal written from the spec, not computed by the code under test.
 */

const IN_APP = {
  "Instagram on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 310.0.0.27.110 (iPhone14,5; iOS 17_1; en_IN; en; scale=3.00; 1170x2532; 541635890)",
  "Facebook on iPhone (FBAN)":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.1;FBSS/3;FBID/phone;FBLC/en_GB;FBOP/5]",
  "Facebook on Android (FB_IAB, FBAV)":
    "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/442.0.0.33.113;]",
  "LinkedIn on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.2054",
  "LinkedIn on Android":
    "Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 LinkedInApp",
  "WhatsApp on Android":
    "Mozilla/5.0 (Linux; Android 13; RMX3630 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.43 Mobile Safari/537.36 WhatsApp/2.23.25.83 A",
  "an Android WebView with no app token":
    "Mozilla/5.0 (Linux; Android 12; Redmi Note 11 Build/SKQ1.211103.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36",
};

const REGULAR = {
  "Safari on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
  "Chrome on Android":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Samsung Internet":
    "Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-A536E) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36",
  "Firefox on Android": "Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0",
  "Chrome on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.50 Mobile/15E148 Safari/604.1",
  "Chrome on a laptop":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "no user agent": "",
};

describe("prefersRedirectCheckout", () => {
  it.each(Object.entries(IN_APP))("%s: redirect", (_name, ua) => {
    expect(prefersRedirectCheckout(ua)).toBe(true);
  });

  it.each(Object.entries(REGULAR))("%s: the window and its handler", (_name, ua) => {
    expect(prefersRedirectCheckout(ua)).toBe(false);
  });

  it("answers false for a missing or odd user agent instead of throwing", () => {
    expect(prefersRedirectCheckout(undefined)).toBe(false);
    expect(prefersRedirectCheckout(null)).toBe(false);
    expect(prefersRedirectCheckout(42 as unknown as string)).toBe(false);
  });

  it("does not take a word that merely contains a token for the app (whole tokens only)", () => {
    expect(prefersRedirectCheckout("Mozilla/5.0 (Linux; Android 13; Pixel) Chrome/120 Mobile NotLinkedInAppX")).toBe(false);
    expect(prefersRedirectCheckout("Mozilla/5.0 (Linux; Android 13; Pixel) Chrome/120 Mobile Safari/537.36; wvx")).toBe(false);
  });
});

describe("payReturnUrl", () => {
  it("is the origin the parent is on plus /pay/return, never a fixed host", () => {
    expect(payReturnUrl("https://store.kheelona.com")).toBe("https://store.kheelona.com/pay/return");
    expect(payReturnUrl("https://betastore.kheelona.com")).toBe("https://betastore.kheelona.com/pay/return");
    expect(payReturnUrl("http://store.localhost:3468")).toBe("http://store.localhost:3468/pay/return");
  });
});

/* ── what Razorpay is handed (checkout.ts, frozen, with its reviewed patch for B2) ───────────── */

const win = window as unknown as { Razorpay?: unknown };
let seen: Record<string, unknown>[] = [];

class FakeRazorpay {
  constructor(options: Record<string, unknown>) {
    seen.push(options);
  }
  on() {}
  open() {}
}

const BASE = {
  keyId: "rzp_test_probe",
  razorpayOrderId: "order_PROBE000000001",
  amountPaise: 49_900,
  orderRef: "KH-A2B3-C4D5",
  prefill: { name: "QA Test Parent" },
  tier: "launch",
  onPaid: () => {},
  onDismiss: () => {},
};

beforeEach(() => {
  seen = [];
  win.Razorpay = FakeRazorpay;
});
afterEach(() => {
  delete win.Razorpay;
});

describe("startCheckout and the redirect options", () => {
  it("without a callbackUrl: no callback_url and no redirect key at all (the proven window and handler)", async () => {
    await startCheckout(BASE);
    expect(seen).toHaveLength(1);
    expect("callback_url" in seen[0]).toBe(false);
    expect("redirect" in seen[0]).toBe(false);
    expect(typeof seen[0].handler).toBe("function");
    expect(seen[0].order_id).toBe("order_PROBE000000001");
    expect(seen[0].amount).toBe(49_900);
  });

  it("with a callbackUrl: callback_url and redirect: true, and everything else exactly as before", async () => {
    await startCheckout(BASE);
    await startCheckout({ ...BASE, callbackUrl: "https://store.kheelona.com/pay/return" });
    const [plain, redirect] = seen;
    expect(redirect.callback_url).toBe("https://store.kheelona.com/pay/return");
    expect(redirect.redirect).toBe(true);
    const { callback_url, redirect: flag, ...rest } = redirect;
    expect(callback_url).toBeDefined();
    expect(flag).toBe(true);
    expect(JSON.stringify(rest, (_k, v) => (typeof v === "function" ? "fn" : v))).toBe(
      JSON.stringify(plain, (_k, v) => (typeof v === "function" ? "fn" : v)),
    );
  });
});
