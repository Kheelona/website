import { cleanup, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { eventPage, storeNotFound } from "@/content/en-IN/store/event-page";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { storePage } from "@/content/en-IN/store/store-page";
import { startCheckout, type StartCheckoutInput } from "@/features/preorder/lib/checkout";
import { preorderAckEmail } from "@/lib/email/templates";
import type { PreorderRow } from "@/lib/store/db";
import type { StoreEnv } from "@/lib/store/env";
import { formatThanksSession } from "@/lib/store/thanks-session";
import { signAddressToken, sign } from "@/lib/store/signing";
import { tierRefusalMessage } from "@/lib/store/tiers";
import { buildOffer } from "@/lib/offer/offer";
import { fakeClient, fakeEnv, type RecordedCall } from "./helpers/fake-supabase";

/* The store says "Khelu" (D070 / C1, K-176; the founder's approval of 24 Nov 2026: "The store name: 'Kheelu' -> 'Khelu'";
 * deviations.md V71). Every surface a buyer sees on store.kheelona.com, in the order email and on the Razorpay payment
 * sheet is rendered here and read for the OLD name: visible text and the attributes a person or a screen reader meets
 * (alt, aria-label, title, placeholder, value, meta content), the page metadata, the email's subject, HTML and plain
 * text, and the options handed to Razorpay. A "Kheelu" anywhere in them fails this file.
 *
 * What stays "Kheelu" on purpose, and is pinned below so a later edit cannot move it silently: the ViewContent payload
 * (`content_name "Kheelu"`, `content_ids ["lumi"]`: tracking parity), file names and the DS asset folder, URLs and
 * CSS class names (none of them is a string a buyer reads). */

const OLD = /Kheelu(?!\/)/; // "Kheelu/kheelu-front.webp" is the DS folder, a path, never read by a buyer

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown; count?: number }> = {};
let env: StoreEnv | null = fakeEnv as StoreEnv;
let cookieValue: string | undefined;
const mode = vi.hoisted(() => ({ value: "token" as "token" | "full" }));
const getOffer = vi.hoisted(() => vi.fn());

vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env }));
vi.mock("@/lib/store/mode", () => ({ preorderMode: async () => mode.value, FULL_TIER: "full" }));
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined) }),
}));

const ATTRIBUTES = ["alt", "aria-label", "aria-description", "title", "placeholder", "value", "content", "label"] as const;

/** Every string a person or a screen reader meets in a rendered surface: text nodes (a <title> included) and the words in
 *  alt, aria-label, title, placeholder, value and content attributes. Never src, href, class or id: those are not read. */
function seenIn(root: ParentNode): string[] {
  const doc = (root as Node).ownerDocument ?? (root as Document);
  const out: string[] = [];
  const walker = doc.createTreeWalker(root as Node, 4 /* SHOW_TEXT */);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.textContent?.trim()) out.push(n.textContent);
  for (const el of Array.from(root.querySelectorAll("*"))) {
    for (const attr of ATTRIBUTES) {
      const value = el.getAttribute(attr);
      if (value) out.push(`${attr}="${value}"`);
    }
  }
  return out;
}

const oldNameIn = (lines: readonly string[]) => lines.filter((line) => OLD.test(line));

/** Every string of a content object (and of a metadata object), however deep. Paths and addresses are not names. */
function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

afterEach(() => cleanup());

beforeEach(() => {
  calls = [];
  results = {};
  env = fakeEnv as StoreEnv;
  cookieValue = undefined;
  mode.value = "token";
  getOffer.mockResolvedValue(buildOffer("token"));
});

describe("the store page, in both modes (the page and its metadata)", () => {
  it.each(["token", "full"] as const)("%s mode: no visible or attribute text says Kheelu, and the h1 and first words say Khelu", async (m) => {
    mode.value = m;
    getOffer.mockResolvedValue(buildOffer(m));
    const { default: StorePage, generateMetadata } = await import("@/app/store/page");
    const doc = new DOMParser().parseFromString(`<!doctype html><html><body><main>${renderToStaticMarkup((await StorePage()) as ReactElement)}</main></body></html>`, "text/html");
    expect(oldNameIn(seenIn(doc.body))).toEqual([]);
    expect(doc.querySelector("h1")!.textContent).toBe("Pre-order Khelu.");
    expect(doc.querySelector("img")!.getAttribute("alt")).toMatch(/^Khelu by Kheelona: /);
    expect(doc.body.textContent).toContain("See Khelu ask.");
    expect(oldNameIn(stringsIn(JSON.parse(JSON.stringify(await generateMetadata()))))).toEqual([]);
    expect((await generateMetadata()).description).toMatch(/^Pre-order Khelu by Kheelona/);
  }, 60_000);

  it("the not-configured store and the in-app note say it too", async () => {
    env = null;
    const { default: StorePage } = await import("@/app/store/page");
    const { container } = render((await StorePage()) as ReactElement);
    expect(oldNameIn(seenIn(container))).toEqual([]);
  });

  it("the store layout's default title says Khelu (every page overrides it, but it is served)", async () => {
    const { metadata } = await import("@/app/store/layout");
    expect(metadata.title).toBe("Pre-order Khelu");
  });
});

describe("/thanks, in every state", () => {
  const REF = "KH-A2B3-C4D5";
  const liveSession = () => formatThanksSession(REF, signAddressToken(fakeEnv.signingSecret, REF, Date.now() + 3_600_000))!;
  const order = (over: Record<string, unknown> = {}) => {
    results["preorders.select"] = {
      data: { order_ref: REF, tier: "launch", amount_paise: 49_900, status: "paid", email: "parent@example.com", address: null, created_at: "2026-11-20T10:00:00Z", ...over },
    };
  };
  const states: [string, () => void][] = [
    ["paid, token order, no address", () => order()],
    ["paid, token order, address saved", () => order({ address: { line1: "1 Test Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" } })],
    ["paid in full", () => order({ tier: "full", amount_paise: 799_900 })],
    ["unpaid (the payment has not been confirmed)", () => order({ status: "created" })],
    ["a signed link whose order will not load", () => (results["preorders.select"] = { data: null })],
    ["no cookie: the link is needed again", () => (cookieValue = undefined)],
  ];

  it.each(states)("%s: nothing visible says Kheelu", async (_name, arrange) => {
    cookieValue = liveSession();
    arrange();
    const { default: ThanksPage } = await import("@/app/store/thanks/page");
    const { container } = render(await ThanksPage());
    expect(oldNameIn(seenIn(container))).toEqual([]);
  });

  it("the paid state says Khelu in its heading, its tab and its saved-address step", async () => {
    cookieValue = liveSession();
    order({ address: { line1: "1 Test Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" } });
    const { default: ThanksPage } = await import("@/app/store/thanks/page");
    const { container } = render(await ThanksPage());
    expect(container.querySelector("h1")!.textContent).toBe("Your Khelu is reserved.");
    expect(document.head.querySelector("title")!.textContent).toBe("Your Khelu is reserved · Kheelona");
    expect(container.textContent).toContain("This is where your Khelu will go");
  });

  it("the other state's tab says Khelu too, and the page metadata reads clean", async () => {
    cookieValue = liveSession();
    order({ status: "created" });
    const { default: ThanksPage, metadata } = await import("@/app/store/thanks/page");
    render(await ThanksPage());
    expect(document.head.querySelector("title")!.textContent).toBe("Your Khelu pre-order · Kheelona");
    expect(oldNameIn(stringsIn(JSON.parse(JSON.stringify(metadata))))).toEqual([]);
  });

  it("every string of the /thanks content is clean (all states, the steps and the help block included)", () => {
    expect(oldNameIn(stringsIn(confirmation))).toEqual([]);
  });
});

describe("the event page and the store's not-found page", () => {
  const SIG = () => sign(fakeEnv.signingSecret, "event-link", "bangalore-expo");

  it("a signed, live event link: the first screen, the form, the agreement card and the questions say Khelu", async () => {
    results["event_tiers.select"] = {
      data: { id: "bangalore-expo", label: "Bangalore expo price", amount_paise: 9_900, cap: null, expires_on: null, active: true },
    };
    const { default: EventPage } = await import("@/app/store/e/[event]/page");
    const { container } = render(await EventPage({ params: Promise.resolve({ event: "bangalore-expo" }), searchParams: Promise.resolve({ sig: SIG() }) }));
    expect(oldNameIn(seenIn(container))).toEqual([]);
    expect(container.querySelector("h1")!.textContent).toBe("Pre-order Khelu.");
  });

  it.each([
    ["a link that is not ours", async () => ({ event: "nope", sig: "x" })],
    ["a refused signature", async () => ({ event: "bangalore-expo", sig: "0000000000000000" })],
  ])("%s: the refusal panel is clean", async (_name, params) => {
    const p = await params();
    const { default: EventPage } = await import("@/app/store/e/[event]/page");
    const { container } = render(await EventPage({ params: Promise.resolve({ event: p.event }), searchParams: Promise.resolve({ sig: p.sig }) }));
    expect(oldNameIn(seenIn(container))).toEqual([]);
  });

  it("a store without keys opens 'shortly' and says nothing old", async () => {
    env = null;
    const { default: EventPage } = await import("@/app/store/e/[event]/page");
    const { container } = render(await EventPage({ params: Promise.resolve({ event: "x" }), searchParams: Promise.resolve({}) }));
    expect(oldNameIn(seenIn(container))).toEqual([]);
  });

  it("the event page's metadata, the not-found page and its metadata are clean", async () => {
    const event = await import("@/app/store/e/[event]/page");
    const notFound = await import("@/app/store/not-found");
    const { container } = render(<notFound.default />);
    expect(oldNameIn(seenIn(container))).toEqual([]);
    expect(oldNameIn(stringsIn(JSON.parse(JSON.stringify(event.metadata))))).toEqual([]);
    expect(oldNameIn(stringsIn(JSON.parse(JSON.stringify(notFound.metadata))))).toEqual([]);
    expect(event.metadata.title).toEqual({ absolute: "Pre-order Khelu · Kheelona" });
    expect(oldNameIn(stringsIn([eventPage, storeNotFound, storePage]))).toEqual([]);
  });

  it("the catch-all dead end (a mistyped store address) is clean", async () => {
    const { default: Rest } = await import("@/app/store/[...rest]/page");
    const { container } = render((await (Rest as () => Promise<ReactElement> | ReactElement)()) as ReactElement);
    expect(oldNameIn(seenIn(container))).toEqual([]);
  });
});

describe("the form's one refusal that names the toy", () => {
  it.each(["cap-reached", "not-yet", "expired", "full", "unknown"] as const)("%s: no Kheelu in what create-order returns", (reason) => {
    expect(OLD.test(tierRefusalMessage(reason))).toBe(false);
  });

  it("cap-reached says 'Khelu is now ₹7,999' (D070 / C1, the reviewed patch of src/lib/store/tiers.ts)", () => {
    expect(tierRefusalMessage("cap-reached")).toContain("have all been reserved, and Khelu is now ₹7,999.");
  });
});

describe("the order email (subject, HTML, plain text), every tier and address branch", () => {
  const base: PreorderRow = {
    id: 1,
    order_ref: "KH-A2B3-C4D5",
    tier: "launch",
    amount_paise: 49_900,
    status: "paid",
    parent_name: "Test Parent",
    phone: "9000000000",
    email: "parent@example.com",
    child_age: "4",
    wa_consent: true,
    terms_accepted_at: "2026-11-20T10:00:00Z",
    address: null,
    rzp_order_id: "order_test",
    rzp_payment_id: "pay_test",
    balance_status: "due",
    utm: {},
    fb_attrib: null,
    ph_distinct_id: null,
    created_at: "2026-11-20T10:00:00Z",
    paid_at: "2026-11-20T10:01:00Z",
  };
  const address = { line1: "1 Test Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" } as unknown as PreorderRow["address"];
  const orders: [string, PreorderRow][] = [
    ["token order, no address", base],
    ["token order, address saved", { ...base, address }],
    ["paid in full", { ...base, tier: "full", amount_paise: 799_900 }],
    ["event token", { ...base, tier: "bangalore-expo", amount_paise: 9_900 }],
  ];

  it.each(orders)("%s: subject, HTML and text say Khelu and never Kheelu", (_name, row) => {
    const email = preorderAckEmail({ order: row, addressUrl: "https://store.kheelona.com/thanks?x=1" });
    expect(email.subject).toBe("Your Khelu is reserved (KH-A2B3-C4D5)");
    expect(OLD.test(email.html)).toBe(false);
    expect(OLD.test(email.text)).toBe(false);
    expect(email.html).toContain("Your Khelu is reserved.");
    expect(email.text).toContain("Your Khelu is reserved.");
    expect(email.html).toContain("Every Khelu includes 6 months of Kheelona+.");
  });
});

describe("the Razorpay payment sheet", () => {
  class FakeRazorpay {
    static last: FakeRazorpay | null = null;
    constructor(readonly options: Record<string, unknown>) {
      FakeRazorpay.last = this;
    }
    on() {}
    open() {}
  }

  it("describes the order 'Khelu pre-order <ref>', and everything else in the options is as it was", async () => {
    (window as unknown as { Razorpay: unknown }).Razorpay = FakeRazorpay;
    const input: StartCheckoutInput = {
      keyId: "rzp_test_probe",
      razorpayOrderId: "order_PROBE0001",
      amountPaise: 49_900,
      orderRef: "KH-A2B3-C4D5",
      prefill: {},
      onPaid: () => {},
      onDismiss: () => {},
      tier: "launch",
    } as unknown as StartCheckoutInput;
    await expect(startCheckout(input)).resolves.toBe(true);
    const options = FakeRazorpay.last!.options;
    expect(options.description).toBe("Khelu pre-order KH-A2B3-C4D5");
    expect(oldNameIn(stringsIn(options))).toEqual([]);
    expect(options).toMatchObject({ name: "Kheelona", currency: "INR", notes: { order_ref: "KH-A2B3-C4D5" }, theme: { color: "#EF762F" } });
    expect("callback_url" in options).toBe(false);
    delete (window as unknown as { Razorpay?: unknown }).Razorpay;
  });
});

describe("what did not change (tracking parity, assets, URLs)", () => {
  it("the ViewContent payload still names Kheelu and the product 'lumi' (tracking parity; events.ts and the registry guard)", () => {
    const events = readFileSync("src/lib/tracking/events.ts", "utf8");
    expect(events).toContain('fixed: { content_name: "Kheelu", content_ids: ["lumi"], content_type: "product", currency: "INR" }');
    const tracker = readFileSync("src/components/tracking/ViewContentTracker.tsx", "utf8");
    expect(tracker).toContain('content_name: "Kheelu"');
  });

  it("the store's picture is still the DS file kheelu-front.webp (a file name, never read)", () => {
    expect(readFileSync("src/content/en-IN/store/store-page.ts", "utf8")).toContain('import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";');
  });
});
