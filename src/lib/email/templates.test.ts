import { describe, expect, it } from "vitest";
import { preorderAckEmail, internalAlertEmail } from "./templates";
import type { PreorderRow } from "@/lib/store/db";
import {
  GSTIN,
  LEGAL_ENTITY,
  SHIP_DATE_TEXT,
  BALANCE_PRICE,
  FULL_PRICE,
  FULL_AMOUNT_PAISE,
} from "@/config/site";

/**
 * The acknowledgement email is the only part of this purchase a parent still has
 * in six weeks, so it is held to the same standard as a page: the voice laws
 * apply, the prices come from config, and the promises match the policy pages.
 *
 * A vendor's template editor could not be tested at all, which is most of why
 * these live in the repo.
 */

const order: PreorderRow = {
  id: 1,
  order_ref: "KH-A2B3-C4D5",
  tier: "launch",
  amount_paise: 49_900,
  status: "paid",
  parent_name: "Priya Menon",
  phone: "9187546483",
  email: "priya@example.com",
  child_age: "3",
  wa_consent: true,
  terms_accepted_at: "2026-08-22T10:00:00Z",
  address: null,
  rzp_order_id: "order_abc",
  rzp_payment_id: "pay_xyz",
  balance_status: "due",
  utm: { utm_source: "whatsapp" },
  created_at: "2026-08-22T10:00:00Z",
  paid_at: "2026-08-22T10:01:00Z",
};

describe("the acknowledgement email", () => {
  const email = preorderAckEmail({ order, addressUrl: "https://store.kheelona.com/thanks?x=1" });

  it("answers the four questions a person has after paying a stranger online", () => {
    for (const part of [email.html, email.text]) {
      // did it work, and what is my reference
      expect(part).toContain("KH-A2B3-C4D5");
      // what did I pay
      expect(part).toContain("₹499");
      // what do I owe and when
      expect(part).toContain(BALANCE_PRICE);
      expect(part).toContain(SHIP_DATE_TEXT);
      // how do I undo it
      expect(part).toMatch(/refund/i);
    }
  });

  it("greets by first name only, because that is what a person is called", () => {
    expect(email.html).toContain("Priya");
    expect(email.html).not.toContain("Priya Menon,");
  });

  it("chases the address when there is none, and does not when there is", () => {
    expect(email.text).toContain("https://store.kheelona.com/thanks?x=1");
    const withAddress = preorderAckEmail({
      order: {
        ...order,
        address: {
          line1: "Flat 4B",
          line2: "",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560041",
        },
      },
    });
    expect(withAddress.text).not.toContain("delivery address yet");
    expect(withAddress.text).toContain("We have your delivery address");
  });

  it("names the seller of record, because a receipt has to", () => {
    expect(email.html).toContain(LEGAL_ENTITY);
    expect(email.html).toContain(GSTIN);
    expect(email.text).toContain(LEGAL_ENTITY);
  });

  it("says the WhatsApp number does not take calls", () => {
    expect(email.html).toMatch(/messages, not calls/);
    expect(email.text).toMatch(/messages, not calls/);
  });

  /* The site's voice laws do not stop at the site. Zero em-dashes, and none of
     the retired promises: an email that says "no payment now" after taking
     ₹499 would be the single worst place for that sentence to survive. */
  it("obeys the voice laws", () => {
    for (const part of [email.html, email.text, email.subject]) {
      expect(part).not.toContain("—");
      expect(part).not.toMatch(/no payment/i);
      expect(part).not.toMatch(/first 500/i);
      expect(part).not.toMatch(/<i>|font-style:\s*italic/);
    }
  });

  it("puts the order reference in the subject, where a search will find it", () => {
    expect(email.subject).toContain("KH-A2B3-C4D5");
  });

  it("leaves the recipient for the sender to fill, so a template cannot leak one", () => {
    expect(email.to).toBe("");
  });
});

describe("the acknowledgement for a full-payment order (§8.26)", () => {
  const fullOrder: PreorderRow = {
    ...order,
    tier: "full",
    amount_paise: FULL_AMOUNT_PAISE,
    balance_status: "none",
  };
  const email = preorderAckEmail({
    order: fullOrder,
    addressUrl: "https://store.kheelona.com/thanks?x=1",
  });

  it("never mentions a balance or a payment link to come", () => {
    for (const part of [email.html, email.text]) {
      expect(part).not.toContain(BALANCE_PRICE);
      expect(part).not.toMatch(/balance/i);
      expect(part).not.toMatch(/payment link/i);
    }
  });

  it("says the whole price is paid, and keeps the refund promise on all of it", () => {
    for (const part of [email.html, email.text]) {
      expect(part).toContain(FULL_PRICE);
      expect(part).toMatch(/paid in full/i);
      expect(part).toMatch(/refund/i);
    }
  });

  it("branches on the ROW's tier, so a token receipt is untouched by the flip", () => {
    /* The token email is asserted line-by-line above; this pins that the fork
       is the order's own tier, not any global state. */
    const tokenAgain = preorderAckEmail({ order, addressUrl: "https://x.example/t" });
    expect(tokenAgain.html).toContain(BALANCE_PRICE);
    expect(tokenAgain.text).toContain(BALANCE_PRICE);
  });
});

describe("the internal alert", () => {
  const email = internalAlertEmail(order);

  it("says everything decidable on a lock screen in the subject", () => {
    expect(email.subject).toContain("KH-A2B3-C4D5");
    expect(email.subject).toContain("Priya Menon");
    expect(email.subject).toContain("₹499");
  });

  it("shouts when the address is still missing, since that blocks dispatch", () => {
    expect(email.text).toContain("NOT GIVEN YET");
  });

  it("carries the contact details needed to act, and the source", () => {
    expect(email.text).toContain("9187546483");
    expect(email.text).toContain("priya@example.com");
    expect(email.text).toContain("utm_source");
  });
});

/* Four values in these emails are typed by a customer, and one of them became
   free text on 2026-08-23 when the age dropdown went away. An unescaped `&` is
   invalid HTML that some clients mangle, and a single `<` swallows the rest of
   the receipt, so both emails escape on the way into HTML and leave the plain
   text exactly as typed. */
describe("customer text in HTML", () => {
  const awkward = {
    ...order,
    parent_name: "Sneha & Raj <family>",
    child_age: '2 & 5 <"twins">',
  };

  it("escapes the name and the age in the alert, and keeps the text raw", () => {
    const email = internalAlertEmail(awkward);
    expect(email.html).toContain("Sneha &amp; Raj &lt;family&gt;");
    expect(email.html).toContain("2 &amp; 5 &lt;&quot;twins&quot;&gt;");
    expect(email.html).not.toContain("<family>");
    expect(email.text).toContain("Sneha & Raj <family>");
  });

  /* The receipt greets by first name only, so the character has to be IN that
     first word for this to bite. It can be: people type all sorts into a name
     field, including the ampersand for a couple. */
  it("escapes the greeting in the receipt", () => {
    const email = preorderAckEmail({
      order: { ...order, parent_name: "S&R<b> Menon" },
    });
    expect(email.html).toContain("Thank you, S&amp;R&lt;b&gt;.");
    expect(email.html).not.toContain("<b>");
    expect(email.text).toContain("Thank you, S&R<b>.");
  });
});

/* The first real receipt this store sent opened "Thank you, shweta." — she had
   typed her own name in lower case, which people do constantly. */
describe("greeting a name as typed", () => {
  it("capitalises a lower-case first name", () => {
    const email = preorderAckEmail({ order: { ...order, parent_name: "shweta kiran" } });
    expect(email.html).toContain("Thank you, Shweta.");
    expect(email.text).toContain("Thank you, Shweta.");
  });

  it("leaves the rest of the name alone, because title-casing mangles real names", () => {
    for (const [typed, greeting] of [
      ["priya menon", "Priya"],
      ["Priya", "Priya"],
      ["d'Souza Fernandes", "D'Souza"],
      ["  aarav  ", "Aarav"],
    ] as const) {
      const email = preorderAckEmail({ order: { ...order, parent_name: typed } });
      expect(email.text, typed).toContain(`Thank you, ${greeting}.`);
    }
  });
});
