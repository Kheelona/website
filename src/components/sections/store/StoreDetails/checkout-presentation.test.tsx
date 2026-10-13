import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { isSitePath } from "@/lib/links";
import { buildOffer } from "@/lib/offer/offer";
import { mockupDiff, mockupFold, mockupRoute } from "../../../../../test/support/mockup-compare";
import { PayBeside } from "./StoreDetails";

/* The restyled checkout presentation (task 5.15; ADR-013 class 3; store.md folds 3 and 4): PreorderForm and
 * OrderSummary on the DS, compared element by element with the approved mockup (mockup/store.html `form.mk-form`,
 * `section.mk-agree`). Their own test files stay frozen (literal-only patches, test/guards/fixtures/authorised-diffs/);
 * the checkout's behaviour is theirs and the rendered contract's (test/guards/checkout-jsx-contract.test.tsx). These
 * tests pin what the restyle adds: the markup, the words from content, the slot beside the pay button. */

const startCheckout = vi.hoisted(() => vi.fn());
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout }));

const { PreorderForm } = await import("@/features/preorder/components/PreorderForm");
const { OrderSummary } = await import("@/features/preorder/components/OrderSummary");

const token = buildOffer("token");
const NOTE = navigation.labels.newTabNote;

/** The store's links open the marketing site's terms (MARKETING_ORIGIN). */
function realHref(href: string): string {
  const route = mockupRoute(href);
  return isSitePath(route) ? `${MARKETING_ORIGIN}${route}` : route;
}
const differences = mockupDiff({ realHref, ignore: ["action", "method"] });

/** The controls' generated ids (useId) are not the mockup's hand-written ones; the label still names its control
 *  (tested below), so ids, `for` and `aria-describedby` are left out on both sides. */
function withoutControlIds(source: Element): Element {
  const el = source.cloneNode(true) as Element;
  el.querySelectorAll("input, .kh-field__hint, .kh-field__error").forEach((n) => n.removeAttribute("id"));
  el.querySelectorAll("input").forEach((n) => n.removeAttribute("aria-describedby"));
  el.querySelectorAll("label[for]").forEach((n) => n.removeAttribute("for"));
  return el;
}

/** The mockup's form as the build must print it: the consent box unrequired (the rendered contract keeps the tag's
 *  `required: false`; the shared validator asks for the tick) and the consent links' live `rel` kept (ADR-013). */
function approvedForm(): Element {
  const form = withoutControlIds(mockupFold("store", "form.mk-form"));
  form.querySelector('input[name="accepted"]')!.removeAttribute("required");
  form.querySelectorAll(".kh-check__text a").forEach((a) => a.setAttribute("rel", "noopener noreferrer"));
  return form;
}

const beside = <PayBeside content={storePage.beside} offer={token} newTabNote={NOTE} />;

describe("PreorderForm, restyled", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("equals the mockup's form, with the beside block in the pay button's own block (token mode)", () => {
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" mode="token" beside={beside} />);
    expect(differences(withoutControlIds(container.querySelector("form")!), approvedForm())).toEqual([]);
  });

  it("names every field by its visible label, and ties each hint to its field", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    const phone = screen.getByLabelText("Indian WhatsApp number");
    expect(phone).toHaveAttribute("name", "phone");
    expect(phone).toHaveAccessibleDescription("For messages about your order, including the link to pay the balance before dispatch.");
    expect(screen.getByLabelText("Your child’s age")).toHaveAccessibleDescription("Kheelu is made for children aged 3 to 7. Just the number is fine, like 4.");
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("We email your confirmation here.");
    expect(screen.getByRole("checkbox", { name: /I accept the pre-order terms/ })).not.toBeChecked();
  });

  it("shows +91 inside the phone field as decoration only (hidden, never part of the value)", () => {
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    const cc = container.querySelector(".ks-tel__cc")!;
    expect(cc).toHaveTextContent("+91");
    expect(cc).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByLabelText("Indian WhatsApp number")).toHaveValue("");
  });

  it("opens the two policies on the marketing site in a new tab, and says so to screen readers", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    /* jsdom's accessible name drops the space before the visually hidden note (a browser keeps it; TrustLine's test). */
    expect(screen.getByRole("link", { name: /^pre-order terms\s?\(opens in a new tab\)$/ })).toHaveAttribute("href", `${MARKETING_ORIGIN}/terms`);
    const refund = screen.getByRole("link", { name: /^refund policy\s?\(opens in a new tab\)$/ });
    expect(refund.querySelector(".kh-sr")).toHaveTextContent(NOTE.trim());
    expect(refund.closest(".kh-check__text")!.textContent).toBe(
      `I accept the pre-order terms${NOTE} and the refund policy${NOTE}, and I am happy to hear about my own order on WhatsApp.`,
    );
    expect(refund).toHaveAttribute("href", `${MARKETING_ORIGIN}/refund`);
    expect(refund).toHaveAttribute("target", "_blank");
  });

  it("full mode: the full-price sentence, then the refund promise, beside the button; the phone hint without the balance", () => {
    const { container } = render(<PreorderForm tier="full" amountLabel="₹7,999" mode="full" />);
    expect(container.querySelector(".ks-price")).toHaveTextContent(
      "₹7,999 (incl. GST), paid in full when you order. Until we dispatch your Kheelu, all of it is refundable.",
    );
    expect(screen.getByRole("button", { name: "Pay ₹7,999 and pre-order" })).toBeInTheDocument();
    expect(screen.getByLabelText("Indian WhatsApp number")).toHaveAccessibleDescription("For messages about your order.");
  });

  it("an event token's sentence names its own advance and balance", () => {
    const { container } = render(<PreorderForm tier="ideabaaz" signature="sig" amountLabel="₹99" balanceLabel="₹4,900" />);
    expect(container.querySelector(".ks-price")).toHaveTextContent(
      "Reserve yours for ₹99 today, refundable until dispatch, then pay ₹4,900 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("the pay button is the DS chilli button, full width, with no cta attribute (as live)", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    const pay = screen.getByRole("button", { name: "Pay ₹499 and reserve" });
    expect(pay).toHaveClass("kh-btn", "kh-btn--cta", "kh-btn--l", "kh-btn--block");
    expect(pay).not.toHaveAttribute("data-ph-capture-attribute-cta");
  });

  it("while it works the button shows the DS loading state; a failure is a DS danger Alert above the button", async () => {
    let refuse: (r: Response) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolve) => (refuse = resolve))));
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await user.type(screen.getByLabelText("Your name"), "QA Parent");
    await user.type(screen.getByLabelText("Indian WhatsApp number"), "9187546483");
    await user.type(screen.getByLabelText("Email"), "qa@example.com");
    await user.type(screen.getByLabelText("Your child’s age"), "4");
    await user.click(screen.getByRole("checkbox"));
    await act(async () => screen.getByRole("button").closest("form")!.requestSubmit());
    const busy = screen.getByRole("button", { name: "Setting up your payment…" });
    expect(busy).toBeDisabled();
    expect(busy).toHaveClass("kh-btn--loading");

    await act(async () => refuse(new Response(JSON.stringify({ message: "Pre-order pricing has closed." }), { status: 409 })));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveClass("kh-alert", "kh-alert--danger");
    expect(alert).toHaveTextContent("Pre-order pricing has closed.");
    expect(alert.compareDocumentPosition(screen.getByRole("button", { name: "Pay ₹499 and reserve" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("without a beside block (event and partner pages until task 6.1) the refund sentence is still in the button's block", () => {
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    const block = container.querySelector(".ks-pay-beside")!;
    expect(block.closest("form")).not.toBeNull();
    expect(block).toHaveTextContent(/refundable until dispatch/);
    expect(within(block as HTMLElement).queryByRole("list")).toBeNull();
  });
});

describe("OrderSummary, restyled (the agreement card)", () => {
  /** The mockup's delivery head wraps "mid-November" in a no-wrap span; the build prints the one delivery line (D023)
   *  whole and keeps it from breaking at the hyphen in CSS (`text-wrap: balance`, as the legal pages do). */
  function approvedCard(): Element {
    const card = mockupFold("store", "section.mk-agree").cloneNode(true) as Element;
    card.querySelectorAll(".mk-nowrap").forEach((n) => n.replaceWith(...Array.from(n.childNodes)));
    return card;
  }

  it("equals the mockup's card when the page passes the D023 delivery line (token mode)", () => {
    const { container } = render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" mode="token" delivery={token.delivery} />);
    expect(differences(container.firstElementChild!, approvedCard())).toEqual([]);
  });

  it("is a region named by its heading, its rows a list", () => {
    render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" delivery={token.delivery} />);
    const card = screen.getByRole("region", { name: "What you are agreeing to" });
    expect(within(card).getAllByRole("listitem")).toHaveLength(4);
  });

  it("no longer prints the tier's own label (store.md fold 4: the note says what the advance is part of)", () => {
    render(<OrderSummary amountLabel="₹99" tierLabel="Bangalore expo price" balanceLabel="₹4,900" delivery={token.delivery} />);
    expect(screen.queryByText("Bangalore expo price")).toBeNull();
    expect(screen.getByText("A refundable advance, part of the ₹4,999 price (incl. GST).")).toBeInTheDocument();
    expect(screen.getByText("₹4,900 before delivery")).toBeInTheDocument();
  });

  it("without a delivery line it keeps the checkout's own ship date (the event and partner pages until 6.1 and F12)", () => {
    render(<OrderSummary amountLabel="₹499" tierLabel="Pre-order price" />);
    expect(screen.getByText(/^Ships /)).toBeInTheDocument();
    expect(screen.queryByText(token.delivery)).toBeNull();
  });

  it("full mode: the whole price today, nothing due, and the full-mode small print", () => {
    render(<OrderSummary amountLabel="₹7,999" tierLabel="Launch price" mode="full" delivery={token.delivery} />);
    expect(screen.getByText("₹7,999 today")).toBeInTheDocument();
    expect(screen.getByText("Nothing due before delivery")).toBeInTheDocument();
    expect(screen.getByText(/The first 500 units at ₹4,999 have been reserved, and this order is at the ₹7,999 price \(incl\. GST\)\./)).toBeInTheDocument();
  });
});
