import {
  LAUNCH_PRICE,
  BALANCE_PRICE,
  SHIP_DATE_TEXT,
  STORE_URL,
  LEGAL_ENTITY,
  GSTIN,
  REGISTERED_ADDRESS_LINE,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
  CONTACT_EMAIL,
  KHEELONA_PLUS_SHORT,
  formatInr,
} from "@/config/site";
import type { Email } from "./send";
import type { PreorderRow } from "@/lib/store/db";

/** The two emails the store sends (§8.25-i).
 *
 *  In the repo, as plain functions, not in a vendor's template editor. Three
 *  reasons, all of which have bitten this project before: the voice lint has to
 *  be able to read them, the price constants have to be the same ones the site
 *  renders, and a change to what we promise a parent has to arrive through a
 *  reviewable diff rather than someone's browser tab.
 *
 *  HTML is deliberately dull. Email clients in India are Gmail, Outlook and the
 *  Apple client, and the way to look correct in all three is tables-free inline
 *  styles, one column, real text, and no images that must load. A parent
 *  checking their inbox on a bus should get a readable receipt, not a layout. */

const INK = "#2b2118";
const MUTED = "#6b5d50";
const RULE = "#e8ded2";

function layout(bodyHtml: string): string {
  return `<div style="margin:0;padding:24px 16px;background:#faf6f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ${RULE};border-radius:14px;padding:28px">
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid ${RULE};margin:28px 0 16px">
    <p style="margin:0;font-size:13px;color:${MUTED}">
      ${LEGAL_ENTITY}<br>
      ${REGISTERED_ADDRESS_LINE}<br>
      GSTIN ${GSTIN}
    </p>
    <p style="margin:12px 0 0;font-size:13px;color:${MUTED}">
      Questions? WhatsApp <a href="${SUPPORT_WHATSAPP_HREF}" style="color:${INK}">${SUPPORT_WHATSAPP_DISPLAY}</a>
      or write to <a href="mailto:${CONTACT_EMAIL}" style="color:${INK}">${CONTACT_EMAIL}</a>.
      The WhatsApp number takes messages, not calls.
    </p>
  </div>
</div>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 14px;font-size:16px">${text}</p>`;
}

/** The name to greet someone by.
 *
 *  People type their own name in lower case constantly, and the first real
 *  receipt this store ever sent opened with "Thank you, shweta." Capitalising
 *  the first letter fixes that; the REST of the name is left exactly as typed,
 *  because title-casing is where this kind of helper starts mangling
 *  d'Souza, van der Berg and every name that is not a English first name. */
function greetingName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export type AckInput = {
  order: Pick<PreorderRow, "order_ref" | "parent_name" | "amount_paise" | "address">;
  /** Present when the order still has no delivery address. */
  addressUrl?: string;
};

/** The acknowledgement a parent gets the moment their payment clears.
 *
 *  It answers, in this order, the four questions a person actually has after
 *  paying a stranger on the internet: did it work, what did I just pay for,
 *  what do I owe and when, and how do I undo this. The refund promise is in the
 *  email and not only on a policy page, because the email is the thing they
 *  still have in six weeks. */
export function preorderAckEmail(input: AckInput): Email {
  const { order } = input;
  const paid = formatInr(order.amount_paise);
  const firstName = greetingName(order.parent_name);
  const needsAddress = !order.address;

  const addressBlock = needsAddress
    ? p(
        `<strong>One thing left.</strong> We do not have your delivery address yet. ` +
          `<a href="${input.addressUrl}" style="color:${INK}"><strong>Add it here</strong></a>, ` +
          `and it takes under a minute.`,
      )
    : p(
        `We have your delivery address. You can change it any time before dispatch, just tell us.`,
      );

  const html = layout(
    `<p style="margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#b54a0d;font-weight:700">Pre-order confirmed</p>
     <h1 style="margin:0 0 18px;font-size:26px;line-height:1.2">Your Lumi is reserved.</h1>
     ${p(`Thank you, ${firstName}. We have your ${paid}, and your place in the queue is held from the moment you paid.`)}
     <div style="border:1px solid ${RULE};border-radius:12px;padding:16px;margin:0 0 18px">
       <p style="margin:0 0 8px;font-size:15px"><strong>Order</strong> ${order.order_ref}</p>
       <p style="margin:0 0 8px;font-size:15px"><strong>Paid today</strong> ${paid}</p>
       <p style="margin:0 0 8px;font-size:15px"><strong>Due on dispatch</strong> ${BALANCE_PRICE}, of the ${LAUNCH_PRICE} price</p>
       <p style="margin:0;font-size:15px"><strong>Ships from</strong> ${SHIP_DATE_TEXT}</p>
     </div>
     ${addressBlock}
     ${p(`When your Lumi is ready to leave for you, we send a payment link for the ${BALANCE_PRICE} balance on WhatsApp and by email. Nothing is charged automatically, and we do not keep your card.`)}
     ${p(`Changed your mind? Message us any time before your Lumi is dispatched and we refund the ${paid} in full. No fee, and no reason needed.`)}
     ${p(`<span style="color:${MUTED}">${KHEELONA_PLUS_SHORT}</span>`)}`,
  );

  const text = [
    "Your Lumi is reserved.",
    "",
    `Thank you, ${firstName}. We have your ${paid}, and your place in the queue is held from the moment you paid.`,
    "",
    `Order: ${order.order_ref}`,
    `Paid today: ${paid}`,
    `Due on dispatch: ${BALANCE_PRICE}, of the ${LAUNCH_PRICE} price`,
    `Ships from: ${SHIP_DATE_TEXT}`,
    "",
    needsAddress
      ? `One thing left: we do not have your delivery address yet. Add it here: ${input.addressUrl}`
      : "We have your delivery address. You can change it any time before dispatch.",
    "",
    `When your Lumi is ready to leave for you, we send a payment link for the ${BALANCE_PRICE} balance on WhatsApp and by email. Nothing is charged automatically.`,
    "",
    `Changed your mind? Message us any time before your Lumi is dispatched and we refund the ${paid} in full.`,
    "",
    `${LEGAL_ENTITY}, ${REGISTERED_ADDRESS_LINE}. GSTIN ${GSTIN}.`,
    `WhatsApp ${SUPPORT_WHATSAPP_DISPLAY} (messages, not calls) or ${CONTACT_EMAIL}.`,
  ].join("\n");

  return {
    to: "",
    subject: `Your Lumi is reserved (${order.order_ref})`,
    html,
    text,
    replyTo: CONTACT_EMAIL ?? undefined,
  };
}

/** The internal alert. Written for a phone lock screen: everything needed to
 *  know whether to act is in the subject line. */
export function internalAlertEmail(order: PreorderRow): Email {
  const rows: [string, string][] = [
    ["Order", order.order_ref],
    ["Tier", order.tier],
    ["Paid", formatInr(order.amount_paise)],
    ["Parent", order.parent_name],
    ["WhatsApp", order.phone],
    ["Email", order.email],
    ["Child's age", order.child_age],
    [
      "Address",
      order.address
        ? `${order.address.line1}, ${order.address.line2}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`
        : "NOT GIVEN YET",
    ],
    ["Source", order.utm ? JSON.stringify(order.utm) : "direct"],
  ];

  const html = layout(
    `<h1 style="margin:0 0 18px;font-size:22px">New pre-order: ${order.parent_name}</h1>
     ${rows
       .map(
         ([k, v]) =>
           `<p style="margin:0 0 6px;font-size:15px"><strong>${k}:</strong> ${v}</p>`,
       )
       .join("")}
     <p style="margin:18px 0 0;font-size:14px;color:${MUTED}">Store: ${STORE_URL}</p>`,
  );

  return {
    to: "",
    subject: `New pre-order ${order.order_ref}: ${order.parent_name}, ${formatInr(order.amount_paise)}`,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
  };
}
