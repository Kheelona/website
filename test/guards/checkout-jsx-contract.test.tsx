import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeClient, fakeEnv, type RecordedCall } from "../helpers/fake-supabase";
import { ROOT, readRepoFile } from "../e2e/support/repo";

/* checkout-jsx-contract (task 1.1; ADR-013 class 3 (b), architecture §16.2 proof 3, QA review B3).
 *
 * Renders each checkout component and the /thanks page in each state and reads the contract
 * from the DOM: what the restyle must keep, whatever the markup. The fixtures in
 * test/guards/fixtures/checkout-contract/ were seeded from the tree on 2026-10-12, byte-identical
 * to archive/pre-reset-2026-10-10, and are NEVER edited: a restyle that changes one of these
 * values is a checkout change, not a restyle.
 *
 *   PreorderForm (token, full and event tiers; idle, working, paying, failure): one <form> with
 *     noValidate; one change handler (typing in two fields fires preorder_form_started once);
 *     every field's name, type, inputMode, autocomplete, maxLength, required, checked; the submit
 *     button's type, disabled and label; a "refundable" sentence beside it; the policy links.
 *   OrderSummary (token, full, event): the amounts shown, a refund line, the delivery row.
 *   AddressForm (empty, saved): the fields, the submit, the saved state.
 *   /thanks (paid, created, link needed, cannot open): order data only inside the
 *     ph-no-capture ph-mask container, which exists exactly where the order is shown.
 *   Store layout: robots noindex, the policy links.
 */

const FIXTURES = "test/guards/fixtures/checkout-contract";
const SEED = process.env.KH_SEED_CONTRACT === "1";

const startCheckout = vi.hoisted(() => vi.fn());
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout }));

let calls: RecordedCall[] = [];
let results: Record<string, { data?: unknown; error?: unknown }> = {};
let cookieValue: string | undefined;
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => fakeEnv }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined) }),
}));

const { PreorderForm } = await import("@/features/preorder/components/PreorderForm");
const { OrderSummary } = await import("@/features/preorder/components/OrderSummary");
const { AddressForm } = await import("@/features/preorder/components/AddressForm");
const { default: ThanksPage } = await import("@/app/store/thanks/page");
const StoreLayoutModule = await import("@/app/store/layout");
const { signAddressToken } = await import("@/lib/store/signing");
const { formatThanksSession } = await import("@/lib/store/thanks-session");

/* ── Reading the contract from the DOM ────────────────────────────────────────────────────── */

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
/** Text with a space between every text node, so "in full" and the next block never fuse. */
function words(el: Element): string {
  const parts: string[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) parts.push(n.textContent ?? "");
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function fields(form: Element) {
  return [...form.querySelectorAll("input[name], select[name], textarea[name]")]
    .map((el) => ({
      name: el.getAttribute("name"),
      tag: el.tagName.toLowerCase(),
      type: el.tagName === "INPUT" ? (el.getAttribute("type") ?? "text") : null,
      inputMode: el.getAttribute("inputmode"),
      autocomplete: el.getAttribute("autocomplete"),
      maxLength: el.hasAttribute("maxlength") ? Number(el.getAttribute("maxlength")) : null,
      required: el.hasAttribute("required"),
      checked: el.tagName === "INPUT" && (el as HTMLInputElement).type === "checkbox" ? (el as HTMLInputElement).checked : null,
      // Real choices only: a "choose one" placeholder option is presentation.
      options: el.tagName === "SELECT" ? [...el.querySelectorAll("option")].filter((o) => o.getAttribute("value")).length : null,
    }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

function submitOf(scope: Element) {
  const b = scope.querySelector('button[type="submit"], input[type="submit"]') as HTMLButtonElement | null;
  return b ? { type: b.getAttribute("type"), disabled: b.disabled, label: text(b) } : null;
}

function withoutLinks(scope: Element): string {
  const clone = scope.cloneNode(true) as Element;
  clone.querySelectorAll("a").forEach((a) => a.remove());
  return words(clone);
}

function policyLinks(scope: Element, paths: RegExp) {
  return [...scope.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href")!)
    .filter((h) => paths.test(h))
    .sort();
}

function amounts(scope: Element): string[] {
  return [...new Set(words(scope).match(/₹[\d,]+/g) ?? [])].sort();
}

/* ── Fixture comparison ───────────────────────────────────────────────────────────────────── */

function matchesFixture(name: string, actual: unknown) {
  const rel = `${FIXTURES}/${name}.json`;
  const file = join(ROOT, rel);
  if (!existsSync(file)) {
    if (!SEED) throw new Error(`${rel} is missing. Contract fixtures are seeded once from the tag and never edited.`);
    mkdirSync(join(ROOT, FIXTURES), { recursive: true });
    writeFileSync(file, JSON.stringify(actual, null, 2) + "\n");
    return;
  }
  expect(actual, `${name}: the rendered checkout contract changed (ADR-013). This is a checkout change, not a restyle.`).toEqual(
    JSON.parse(readRepoFile(rel)),
  );
}

/* ── PreorderForm ─────────────────────────────────────────────────────────────────────────── */

const TIERS = {
  token: { tier: "launch", amountLabel: "₹499", mode: "token" as const },
  full: { tier: "full", amountLabel: "₹7,999", mode: "full" as const },
  event: { tier: "ideabaaz-99", signature: "sig", amountLabel: "₹99", balanceLabel: "₹4,900", mode: "token" as const },
};

const gtag = vi.fn();

async function fillValid(container: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
  const values: Record<string, string> = {
    parentName: "QA Test Parent",
    phone: "9187546483",
    email: "qa@example.com",
    childAge: "4",
  };
  for (const [name, value] of Object.entries(values)) {
    await user.type(container.querySelector(`[name="${name}"]`)!, value);
  }
  await user.click(container.querySelector('[name="accepted"]')!);
}

function formContract(container: HTMLElement) {
  const forms = container.querySelectorAll("form");
  const form = forms[0];
  return {
    forms: forms.length,
    noValidate: form ? form.noValidate : null,
    fields: form ? fields(form) : [],
    submit: submitOf(container),
    refundableSentence: /\brefundable\b/i.test(withoutLinks(container)),
    policyLinks: policyLinks(container, /\/(terms|refund)(?:[#?]|$)/),
    alert: container.querySelector('[role="alert"]') ? "shown" : "none",
  };
}

async function preorderState(props: (typeof TIERS)[keyof typeof TIERS], state: "idle" | "working" | "paying" | "failure") {
  const pending = new Promise<Response>(() => {});
  const ok = () =>
    new Response(
      JSON.stringify({ orderRef: "KH-TEST-0001", razorpayOrderId: "order_x", keyId: "rzp_test_x", amountPaise: 49_900, addressToken: "t" }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  const refused = () =>
    new Response(JSON.stringify({ message: "We could not start that. Please try again." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  vi.stubGlobal("fetch", vi.fn(async () => (state === "working" ? pending : state === "failure" ? refused() : ok())));
  startCheckout.mockImplementation(() => new Promise(() => {}));

  const user = userEvent.setup();
  const { container } = render(<PreorderForm {...props} />);
  const typedOnce = async () => {
    await user.type(container.querySelector('[name="parentName"]')!, "Q");
    await user.type(container.querySelector('[name="email"]')!, "q");
    return gtag.mock.calls.filter((c) => c[1] === "preorder_form_started").length;
  };
  let formStartedAfterTwoFields: number | null = null;
  if (state === "idle") {
    formStartedAfterTwoFields = await typedOnce();
    cleanup();
    const again = render(<PreorderForm {...props} />);
    return { ...formContract(again.container), formStartedAfterTwoFields };
  }
  await fillValid(container, user);
  await act(async () => {
    container.querySelector("form")!.requestSubmit();
  });
  await waitFor(() => {
    const label = submitOf(container)?.label ?? "";
    if (state === "working") expect(label).not.toMatch(/^Pay /);
    if (state === "paying") expect(startCheckout).toHaveBeenCalled();
    if (state === "failure") expect(container.querySelector('[role="alert"]')).not.toBeNull();
  });
  return { ...formContract(container), formStartedAfterTwoFields };
}

describe("checkout-jsx-contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
    calls = [];
    results = {};
    cookieValue = undefined;
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it("PreorderForm keeps its form, fields, submit labels, refund sentence and policy links in every tier and state", async () => {
    const out: Record<string, unknown> = {};
    for (const [tier, props] of Object.entries(TIERS)) {
      for (const state of ["idle", "working", "paying", "failure"] as const) {
        out[`${tier}/${state}`] = await preorderState(props, state);
        cleanup();
        vi.clearAllMocks();
      }
    }
    matchesFixture("PreorderForm", out);
  });

  it("OrderSummary keeps its amounts, refund line and delivery row", () => {
    const out: Record<string, unknown> = {};
    const cases = {
      token: { amountLabel: "₹499", tierLabel: "Refundable advance", mode: "token" as const },
      full: { amountLabel: "₹7,999", tierLabel: "Paid in full", mode: "full" as const },
      event: { amountLabel: "₹99", tierLabel: "Event advance", mode: "token" as const, balanceLabel: "₹4,900" },
    };
    for (const [name, props] of Object.entries(cases)) {
      const { container } = render(<OrderSummary {...props} />);
      out[name] = {
        amounts: amounts(container),
        refundLine: /\brefundable in full\b|\bfull refund\b/i.test(words(container)),
        deliveryRow: /\b(ships|deliver)/i.test(words(container)),
      };
      cleanup();
    }
    matchesFixture("OrderSummary", out);
  });

  it("AddressForm keeps its fields, submit and saved state", () => {
    const out: Record<string, unknown> = {};
    const empty = render(<AddressForm orderRef="KH-TEST-0001" token="t" existing={null} />);
    const form = empty.container.querySelector("form");
    out.empty = { forms: empty.container.querySelectorAll("form").length, noValidate: form?.noValidate ?? null, fields: form ? fields(form) : [], submit: submitOf(empty.container) };
    cleanup();
    const saved = render(
      <AddressForm
        orderRef="KH-TEST-0001"
        token="t"
        existing={{ line1: "12 Test Road", line2: "", city: "Bengaluru", state: "Karnataka", pincode: "560076" }}
      />,
    );
    out.saved = {
      forms: saved.container.querySelectorAll("form").length,
      changeButton: saved.container.querySelectorAll('button[type="button"]').length > 0,
    };
    matchesFixture("AddressForm", out);
  });

  it("/thanks shows order data only inside its ph-no-capture ph-mask container", async () => {
    const REF = "KH-A2B3-C4D5";
    const EMAIL = "qa-parent@example.com";
    const live = () => formatThanksSession(REF, signAddressToken(fakeEnv.signingSecret, REF, Date.now() + 3_600_000))!;
    const order = (status: string) => ({
      data: { order_ref: REF, tier: "launch", amount_paise: 49_900, status, email: EMAIL, address: null },
    });
    const states: Record<string, () => void> = {
      paid: () => {
        cookieValue = live();
        results["preorders.select"] = order("paid");
      },
      created: () => {
        cookieValue = live();
        results["preorders.select"] = order("created");
      },
      "link-needed": () => {
        cookieValue = undefined;
      },
      "cannot-open": () => {
        cookieValue = live();
        results["preorders.select"] = { data: null };
      },
    };
    const out: Record<string, unknown> = {};
    for (const [name, arrange] of Object.entries(states)) {
      results = {};
      arrange();
      const { container } = render(await ThanksPage());
      const containers = [...container.querySelectorAll(".ph-no-capture.ph-mask")];
      const leaks: string[] = [];
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.textContent ?? "";
        if ((t.includes(REF) || t.includes(EMAIL)) && !n.parentElement?.closest(".ph-no-capture")) leaks.push(t.trim());
      }
      out[name] = {
        orderRefShown: text(container).includes(REF),
        noCaptureContainerHoldsOrder: containers.some((c) => text(c).includes(REF)),
        orderDataOutsideNoCapture: leaks.length > 0,
      };
      cleanup();
    }
    matchesFixture("thanks-page", out);
  });

  it("the store layout stays noindex and keeps its policy links", () => {
    const StoreLayout = StoreLayoutModule.default;
    const { container } = render(
      <StoreLayout>
        <p>page</p>
      </StoreLayout>,
    );
    matchesFixture("store-layout", {
      robots: StoreLayoutModule.metadata?.robots ?? null,
      policyLinks: policyLinks(container, /\/(terms|refund|shipping|privacy|contact)(?:[#?]|$)/),
    });
  });
});
