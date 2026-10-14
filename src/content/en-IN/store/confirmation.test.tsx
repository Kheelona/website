import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { MARKETING_ORIGIN, STORE_ORIGIN } from "@/config/env";
import { SHIP_DATE_TEXT } from "@/config/site";
import { fillSlots, fillSteps } from "@/components/sections/store/ConfirmationHead/slot-text";
import { toPlainText } from "@/lib/content/plain-text";
import { signAddressToken } from "@/lib/store/signing";
import { formatThanksSession } from "@/lib/store/thanks-session";
import { fakeClient, fakeEnv } from "../../../../test/helpers/fake-supabase";
import { readRepoFile, tagText } from "../../../../test/e2e/support/repo";
import { skeleton, words } from "../../../../test/support/mockup-compare";
import { DELIVERY_TEXT } from "../delivery";
import { navigation } from "../navigation";
import { DEFAULT_OG } from "../organization";
import { RETURN_DAYS } from "../policies";
import { seller } from "../seller";
import { addressForm } from "./address-form";
import { confirmation } from "./confirmation";
import { storeNotFound } from "./event-page";
import { storePage } from "./store-page";

/* The /thanks words (task 5.16; structure §5 row store-confirmation.html; wiki/site/pages/store-confirmation.md). The
 * paid state of a token order is the approved mockup (mockup/store-confirmation.html, D046): every word of its five
 * folds equals the module's, with the mockup's sample values in the slots (its two placeholders are sample data: the
 * real page prints the order row's number and email). The other states are the live page's words, as the copy page
 * says ("as live"): each sentence is checked against the page at the freeze tag. Shared facts are read, never retyped:
 * the help lines from seller.ts, the return window from policies.ts, the delivery lines from delivery.ts and config. */

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/store-confirmation.html"), "text/html");
const main = mockup.querySelector("main")!;
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const fold = (labelledBy: string) => {
  const el = main.querySelector(`[aria-labelledby="${labelledBy}"]`);
  if (!el) throw new Error(`mockup/store-confirmation.html has no fold labelled by #${labelledBy}`);
  return el;
};
const text = (root: Element, selector: string, index = 0) => {
  const el = root.querySelectorAll(selector)[index];
  if (!el) throw new Error(`no ${selector} (#${index}) in the fold`);
  return norm(el.textContent);
};
/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = svg?.querySelector("path")?.getAttribute("d");
  return d ? (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d) : undefined;
}
/** The mockup's sample values: its two placeholders and the token order's amounts. */
const SAMPLE = {
  email: text(fold("thanks-title"), ".mk-placeholder"),
  orderRef: text(fold("order-title"), ".mk-placeholder"),
  amount: "₹499",
  balance: "₹4,500",
  price: "₹4,999",
};
/** The live page at the freeze tag, white space collapsed: where the other states' words come from. */
const live = norm(tagText("src/app/store/thanks/page.tsx"));

describe("/thanks meta", () => {
  it("is the copy page's title and description, with the site's default share card", () => {
    const meta = JSON.parse(/^<!--page (\{.*\}) -->/.exec(readRepoFile("mockup/pages/store-confirmation.html"))![1]) as {
      title: string;
      description: string;
    };
    expect(confirmation.meta.title).toBe(meta.title);
    expect(confirmation.meta.description).toBe(meta.description);
    expect(confirmation.meta.og).toBe(DEFAULT_OG);
  });

  /* CMO review C m5 (task 7.1c): the tab said "reserved" on every state, so a parent whose payment failed could read it.
     The copy page gives a title per state (store-confirmation.md, At a glance): "reserved" only once the payment is
     confirmed. */
  it("names the tab per state: the paid state's title is the mockup's, every other state's the copy page's", () => {
    const glance = readRepoFile("wiki/site/pages/store-confirmation.md");
    const row = (label: RegExp) => {
      const m = new RegExp(`^\\|\\s*${label.source} \\((\\d+) characters\\)[^|]*\\|\\s*(.+?)\\s*\\|\\s*$`, "m").exec(glance);
      if (!m) throw new Error(`store-confirmation.md has no "${label.source}" row`);
      expect(m[2].length, label.source).toBe(Number(m[1]));
      return m[2];
    };
    expect(confirmation.titles.paid).toBe(row(/Title, paid state/));
    expect(confirmation.titles.paid).toBe(confirmation.meta.title);
    expect(confirmation.titles.other).toBe(row(/Title, every other state/));
    expect(confirmation.titles.other).toBe("Your Kheelu pre-order · Kheelona");
    expect(confirmation.titles.other).not.toMatch(/reserved/i);
  });
});

describe("fold 1, the paid head", () => {
  const head = fold("thanks-title");

  it("says it worked, with the mockup's icon, eyebrow and h1", () => {
    expect(confirmation.head.paid.icon).toBe(iconOf(head.querySelector(".kh-eyebrow svg")));
    expect(confirmation.head.paid.eyebrow).toBe(text(head, ".kh-eyebrow"));
    expect(confirmation.head.paid.heading).toBe(text(head, "h1"));
  });

  it("puts the amount paid and the email in the lede's two slots", () => {
    expect(fillSlots(confirmation.head.paid.lede, SAMPLE)).toBe(text(head, ".mk-thanks__lede"));
  });
});

describe("fold 2, the order card", () => {
  const card = fold("order-title");
  const rows = Array.from(card.querySelectorAll("dl > div")).map((row) => [norm(row.querySelector("dt")?.textContent), norm(row.querySelector("dd")?.textContent)]);

  it("has the mockup's heading and four rows, the balance and the price in their slots", () => {
    const { order } = confirmation;
    expect(order.heading).toBe(text(card, "h2"));
    expect([
      [order.number, SAMPLE.orderRef],
      [order.paid, SAMPLE.amount],
      [order.due.term, fillSlots(order.due.balance, SAMPLE)],
      [order.delivery.current.term, order.delivery.current.value],
    ]).toEqual(rows);
  });

  it("reads the delivery lines from their one source: D023 for new orders, the date sold before 10 October (N9)", () => {
    expect(confirmation.order.delivery.current.value).toBe(DELIVERY_TEXT);
    expect(confirmation.order.delivery.early).toEqual({ term: "Ships from", value: SHIP_DATE_TEXT });
    expect(live).toContain('<Row label="Ships from" value={SHIP_DATE_TEXT} />');
  });

  it("tells a full-payment order it owes nothing, in the live words", () => {
    expect(live).toContain(`value="${confirmation.order.due.nothing}"`);
  });
});

describe("fold 3, the address step", () => {
  const step = fold("address-title");

  it("asks where it should go, as the mockup", () => {
    expect(confirmation.address.empty.heading).toBe(text(step, "h2"));
    expect(confirmation.address.empty.intro).toBe(text(step, ".mk-thanks__intro"));
  });

  it("labels the form, its state list, its button and its reassurance as the mockup", () => {
    const labels = Array.from(step.querySelectorAll("label")).map((l) => [l.getAttribute("for"), norm(l.textContent)]);
    expect(Object.entries(addressForm.labels)).toEqual(labels);
    expect(addressForm.statePlaceholder).toBe(norm(step.querySelector('option[value=""]')?.textContent));
    expect(addressForm.save).toBe(text(step, 'button[type="submit"]'));
    expect(addressForm.reassurance).toBe(text(step, "form > p"));
  });

  it("keeps the live page's saved state and the form's own live words", () => {
    expect(live).toContain(`"${confirmation.address.saved.heading}"`);
    expect(live).toContain(`"${confirmation.address.saved.intro}"`);
    const form = norm(tagText("src/features/preorder/components/AddressForm.tsx"));
    const { saved } = addressForm;
    expect(form).toContain(`${saved.title} </p>`);
    expect(form).toContain(`${saved.before}{" "}`.replace(": {", ":{"));
    expect(form).toContain(`> ${saved.link} </a>{" "} ${saved.after.trim()}`);
    expect(form).toContain(`> ${saved.change} </button>`);
    expect(form).toContain(`"${addressForm.saving}"`);
  });
});

describe("fold 4, what happens next", () => {
  const next = fold("next-title");

  it("lists the mockup's three steps for a token order, the balance in step 2's slot", () => {
    expect(confirmation.next.heading.title).toBe(text(next, "h2"));
    const steps = Array.from(next.querySelectorAll("li")).map((li) => ({
      tone: /kh-tone-(\w+)/.exec(li.className)?.[1],
      title: norm(li.querySelector("h3")?.textContent),
      body: norm(li.querySelector("p")?.textContent),
    }));
    expect(fillSteps(confirmation.next.token, SAMPLE)).toEqual(steps);
  });

  it("gives a full-payment order the copy page's step 2, and nothing to fill", () => {
    const [, two] = confirmation.next.full;
    expect(two.title).toBe("Nothing more to pay");
    expect(two.body).toEqual(["You have paid in full, so there is no balance link to wait for."]);
    expect(confirmation.next.full.map((s) => s.title)).toEqual(["Check your email", "Nothing more to pay", "Track your delivery"]);
  });
});

describe("fold 5, help and changing your mind", () => {
  const help = fold("help-title");

  it("has the mockup's heading, help line, undo paragraph and refund link words", () => {
    expect(confirmation.help.heading).toBe(text(help, "h2"));
    expect(toPlainText(confirmation.help.contact)).toBe(text(help, ".mk-help"));
    expect(confirmation.help.undo).toBe(text(help, "p.kh-body.mk-muted"));
    expect(confirmation.help.refund.label).toBe(text(help, ".kh-btn--ghost"));
    expect(confirmation.help.refund.href).toBe("/refund");
  });

  it("builds the help line on the support line and the return window on the policy, never retyped", () => {
    expect(confirmation.help.contact.startsWith(seller.help.contact)).toBe(true);
    expect(confirmation.help.contact).toContain(`(mailto:${seller.support.email})`);
    expect(confirmation.help.undo).toContain(`within ${RETURN_DAYS} days`);
  });
});

describe("the other states, in the live page's words", () => {
  it("confirming: the eyebrow, h1 and lede of a payment not yet confirmed", () => {
    const { created } = confirmation.head;
    expect(live).toContain(`"${created.eyebrow}"`);
    expect(live).toContain(`"${created.heading}"`);
    expect(live).toContain(fillSlots(created.lede, {}));
  });

  it("link needed: the eyebrow, h1, lede, and the help line with the call option (D032)", () => {
    const { linkNeeded } = confirmation.head;
    expect(live).toContain(`> ${linkNeeded.eyebrow} </p>`);
    expect(live).toContain(`> ${linkNeeded.heading} </h1>`);
    expect(live).toContain(fillSlots(linkNeeded.lede, {}));
    expect(confirmation.linkNeededHelp.lead).toBe("Cannot find the email?");
    expect(confirmation.linkNeededHelp.contact).toBe(`${seller.help.contact} and a person will pull up your order and add your address for you.`);
    expect(live).toContain("and a person will pull up your order and add your address for you.");
  });

  it("cannot open: the live title and body for a signed link whose order will not load", () => {
    expect(live).toContain(`title="${confirmation.cannotOpen.title}"`);
    expect(live).toContain(`body="${confirmation.cannotOpen.body}"`);
  });

  /* CMO review C m4 (task 7.1c): a parent who has paid and cannot see their order got only a small muted WhatsApp link.
     The copy page gives a secondary WhatsApp button, then the call line (store-confirmation.md, Other states), every word
     an approved one: the store's not-switched-on button, the D032 help line's call, this state's live tail. */
  it("cannot open: a WhatsApp button, then the call line, each from its one source (store-confirmation.md, Other states)", () => {
    const { cannotOpen } = confirmation;
    expect(cannotOpen.action).toBe("Message us on WhatsApp");
    expect(cannotOpen.action).toBe(storePage.notConfigured.action);
    expect(toPlainText(cannotOpen.call)).toBe(`Or call ${seller.support.phone} with your order number and a person will find it.`);
    expect(cannotOpen.call).toContain(`(${seller.support.tel})`);
    expect(cannotOpen.call.endsWith(storeNotFound.panel.help.tail)).toBe(true);
    const page = readRepoFile("wiki/site/pages/store-confirmation.md");
    const rowLine = page.split("\n").find((l) => l.startsWith("| Signed link, order will not load"))!;
    expect(rowLine).toContain(`**[${cannotOpen.action}]**`);
    expect(rowLine).toContain(`Or [call ${seller.support.phone}] with your order number and a person will find it.`);
  });

  it("names the paid and confirming states with an icon each (check-circle as the mockup, a clock while confirming)", () => {
    expect(confirmation.head.created.icon).toBe("clock");
    expect(confirmation.head.linkNeeded.icon).toBe("envelope-simple");
  });
});

/* ── The page: src/app/store/thanks/page.tsx renders these words (task 5.16) ─────────────────────────────────────────
 * The route, as the frozen page test drives it (a signed cookie, a stand-in for the order query), rendered whole:
 * the paid state equals the mockup's main fold for fold, every value from the order row, and the states the mockup
 * does not show keep their order data inside the PostHog privacy container (ADR-013; the rendered contract itself is
 * test/guards/checkout-jsx-contract.test.tsx's). */

let results: Record<string, { data?: unknown }> = {};
let cookieValue: string | undefined;
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results) }));
vi.mock("@/lib/store/env", () => ({ storeEnv: () => fakeEnv }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined) }),
}));

const REF = "KH-A2B3-C4D5";
const AFTER_CUTOFF = "2026-10-12T10:23:45.123456+00:00";
const liveSession = () => formatThanksSession(REF, signAddressToken(fakeEnv.signingSecret, REF, Date.now() + 3_600_000))!;
function order(over: Record<string, unknown> = {}) {
  results["preorders.select"] = {
    data: {
      order_ref: REF,
      tier: "launch",
      amount_paise: 49_900,
      status: "paid",
      email: "parent@example.com",
      address: null,
      created_at: AFTER_CUTOFF,
      ...over,
    },
  };
}
async function page() {
  const { default: ThanksPage } = await import("@/app/store/thanks/page");
  return render(await ThanksPage());
}
/** The mockup's main as this build prints it on the store: placeholders and value markers are sample data, the fields'
 *  ids the DS Field's own, and the refund page the marketing site's. */
function mockupMain(): Element {
  const copy = main.firstElementChild!.cloneNode(true) as Element;
  copy.querySelectorAll("input[id], select[id]").forEach((field) => field.removeAttribute("id"));
  copy.querySelector('a[href="refund.html"]')!.setAttribute("href", `${MARKETING_ORIGIN}/refund`);
  return copy;
}
const SKELETON = { unwrap: "[data-src], .mk-placeholder" };
const bubble = (container: HTMLElement) => container.querySelector<HTMLAnchorElement>("a.ks-wa");

describe("/thanks, the page", () => {
  beforeEach(() => {
    results = {};
    cookieValue = liveSession();
  });
  afterEach(() => cleanup());

  it("paid, token, no address: the column equals the mockup's main, the order's values where its samples are", async () => {
    order({ order_ref: SAMPLE.orderRef, email: SAMPLE.email });
    const { container } = await page();
    const column = container.querySelector(".ph-no-capture.ph-mask")!;
    expect(column.className).toBe("ph-no-capture ph-mask kh-section ks-thanks");
    const built = column.cloneNode(true) as Element;
    built.querySelectorAll("input[id], select[id]").forEach((field) => field.removeAttribute("id"));
    expect(skeleton(built, SKELETON)).toBe(skeleton(mockupMain(), SKELETON));
    expect(words(column, { skip: "option" })).toBe(words(mockupMain(), { skip: "option" }));
  });

  it("renders the /thanks WhatsApp bubble outside the column, carrying ph-no-capture (D050)", async () => {
    order();
    const { container } = await page();
    const link = bubble(container)!;
    expect(link.className).toBe("kh-iconbtn kh-iconbtn--l ks-wa ph-no-capture");
    expect(link.getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.thanks)}`);
    expect(link.closest(".ph-mask")).toBeNull();
  });

  it("prints the order's own amounts: a ₹99 event token owes ₹4,900, in the card and in step 2", async () => {
    order({ tier: "ideabaaz-99", amount_paise: 9_900 });
    await page();
    expect(screen.getByText("₹4,900, of the ₹4,999 price (incl. GST)")).toBeInTheDocument();
    expect(screen.getByText(/we send a payment link for the ₹4,900 balance/)).toBeInTheDocument();
    expect(screen.getByText(/^We have your ₹99, /)).toBeInTheDocument();
  });

  it("a full-payment order owes nothing and has nothing more to pay", async () => {
    order({ tier: "full", amount_paise: 799_900 });
    await page();
    expect(screen.getByText("Nothing. You have paid in full")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Nothing more to pay" })).toBeInTheDocument();
    expect(screen.queryByText(/balance on WhatsApp/)).toBeNull();
  });

  it("keeps an order placed before 10 October on its date, and gives a later one the D023 line (N9, F12)", async () => {
    order({ created_at: "2026-09-20T08:00:00+00:00" });
    let view = await page();
    let rows = within(view.container.querySelector("dl")!).getAllByRole("definition").map((dd) => dd.textContent);
    expect(view.container.querySelectorAll("dt")[3].textContent).toBe("Ships from");
    expect(rows[3]).toBe(SHIP_DATE_TEXT);
    cleanup();
    order();
    view = await page();
    rows = within(view.container.querySelector("dl")!).getAllByRole("definition").map((dd) => dd.textContent);
    expect(view.container.querySelectorAll("dt")[3].textContent).toBe("Delivery");
    expect(rows[3]).toBe(DELIVERY_TEXT);
  });

  it("confirming: its own head, the order card and the address step still shown", async () => {
    order({ status: "created" });
    await page();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Thank you. We are confirming it now.");
    expect(screen.getByRole("region", { name: "Your order" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Where should it go?" })).toBeInTheDocument();
  });

  it("an address on the order: the saved heading and card", async () => {
    order({ address: { line1: "12 Test Road", line2: "", city: "Bengaluru", state: "Karnataka", pincode: "560076" } });
    await page();
    expect(screen.getByRole("region", { name: "Your delivery address" })).toBeInTheDocument();
    expect(screen.getByText("We have your address.")).toBeInTheDocument();
  });

  it("link needed: its head and the help line with the call option, the bubble, and no order data", async () => {
    cookieValue = undefined;
    order();
    const { container } = await page();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("We need your link again.");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", seller.support.whatsapp);
    expect(screen.getByRole("link", { name: `call ${seller.support.phone}` })).toHaveAttribute("href", seller.support.tel);
    expect(container.textContent).toContain("Cannot find the email?");
    expect(container.textContent).not.toContain(REF);
    expect(container.querySelector(".ph-mask")).toBeNull();
    expect(bubble(container)).not.toBeNull();
  });

  it("cannot open: the store's not-found panel with the module's words, and the bubble", async () => {
    results["preorders.select"] = { data: null };
    const { container } = await page();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(confirmation.cannotOpen.title);
    expect(container.textContent).toContain(confirmation.cannotOpen.body);
    expect(bubble(container)).not.toBeNull();
  });

  /* CMO review C m4 (task 7.1c; store-confirmation.md, Other states): the reader may have paid, so a secondary WhatsApp
     button (never orange, never a button to buy again), then the call line with the number as a tel: link. The panel
     sits outside the order's container, so it carries ph-no-capture itself, as the bubble and the payments line do:
     /thanks keeps zero autocapture events (tracking inventory row 18). */
  it("cannot open: a secondary WhatsApp button, then the call line with its tel: link, all inside ph-no-capture", async () => {
    results["preorders.select"] = { data: null };
    const { container } = await page();
    const panel = container.querySelector("section[aria-labelledby]")!;
    expect(panel.classList.contains("ph-no-capture")).toBe(true);
    const button = within(panel as HTMLElement).getByRole("link", { name: confirmation.cannotOpen.action });
    expect(button).toHaveAttribute("href", seller.support.whatsapp);
    expect(button.className).toMatch(/\bkh-btn--secondary\b/);
    expect(panel.querySelector(".kh-btn--cta, .kh-btn--primary")).toBeNull();
    expect(within(panel as HTMLElement).queryByRole("link", { name: /pre-order/i })).toBeNull();
    const line = panel.querySelector("p.ks-store-closed")!;
    expect(line.textContent).toBe(toPlainText(confirmation.cannotOpen.call));
    expect(within(line as HTMLElement).getByRole("link", { name: `call ${seller.support.phone}` })).toHaveAttribute("href", seller.support.tel);
    // The old muted line is gone: the button is the WhatsApp option now.
    expect(container.textContent).not.toContain("Message us on WhatsApp with your order number");
    expect(container.textContent).not.toContain(REF);
  });

  /* CMO review C m5 (task 7.1c; store-confirmation.md, At a glance): the tab says "reserved" only once the payment is
     confirmed. Next renders no title of its own on this route (its metadata title is null), so each state's <title>,
     which React hoists into <head>, is the page's only one. */
  const tabTitle = () => Array.from(document.head.querySelectorAll("title")).map((t) => t.textContent);
  it.each([
    ["paid", () => order(), confirmation.titles.paid],
    ["confirming", () => order({ status: "created" }), confirmation.titles.other],
    [
      "link needed",
      () => {
        cookieValue = undefined;
      },
      confirmation.titles.other,
    ],
    [
      "cannot open",
      () => {
        results["preorders.select"] = { data: null };
      },
      confirmation.titles.other,
    ],
  ])("%s: the tab title is the state's own, and the only one", async (_state, arrange, title) => {
    arrange();
    await page();
    expect(tabTitle()).toEqual([title]);
    cleanup();
    expect(tabTitle()).toEqual([]);
  });

  /* Task 4.8 item 2 (wiki/qa/deviations.md V1, extended to /thanks): the store footer the mockup prints the payments line
     in is the store layout's, whose policy links are a frozen contract, so /thanks closes its main with the line, as the
     store page does, in every state (the footer it stands in for shows on every state). It sits outside the order's
     privacy container and carries ph-no-capture itself, as the bubble does, so the page keeps zero autocapture events. */
  const states: Record<string, () => void> = {
    paid: () => order(),
    confirming: () => order({ status: "created" }),
    "link needed": () => {
      cookieValue = undefined;
    },
    "cannot open": () => {
      results["preorders.select"] = { data: null };
    },
  };
  it.each(Object.keys(states))("%s: the payments line is the last line before the bubble, outside the order's container", async (state) => {
    states[state]();
    const { container } = await page();
    const blocks = Array.from(container.children);
    expect(blocks.at(-1)!.matches("a.ks-wa")).toBe(true);
    const line = blocks.at(-2)!;
    expect(line.className).toBe("ks-store-payments ph-no-capture");
    expect(line.textContent).toBe(`${confirmation.payments.text} ${confirmation.payments.link.label}${navigation.labels.newTabNote}`);
    expect(line.querySelector("a")!.getAttribute("href")).toBe(`${MARKETING_ORIGIN}${confirmation.payments.link.href}`);
    expect(line.closest(".ph-mask")).toBeNull();
  });

  it("sets its description and share card through pageMeta: no robots (the store layout's noindex stands), the canonical on the store host as the store page's; the title is each state's own", async () => {
    const { metadata } = await import("@/app/store/thanks/page");
    // null, not absent: the store layout's "Pre-order Kheelu" would otherwise print a second <title> beside the state's.
    expect(metadata.title).toBeNull();
    expect(metadata.description).toBe(confirmation.meta.description);
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.alternates).toEqual({ canonical: `${STORE_ORIGIN}/thanks` });
    expect(metadata.openGraph).toMatchObject({
      title: confirmation.meta.title,
      description: confirmation.meta.description,
      url: `${STORE_ORIGIN}/thanks`,
      images: [{ url: DEFAULT_OG.image, alt: DEFAULT_OG.alt }],
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title: confirmation.meta.title, description: confirmation.meta.description });
  });
});
