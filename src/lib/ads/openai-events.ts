/**
 * OpenAI Ads measurement: the parts the browser and the server share (F6, D069).
 *
 * Pure data and pure functions, no Node and no DOM import, so the same module is bundled into the
 * marketing tracking shell, the store's client code and the server's Conversions API call. Anything
 * that must stay equal on both sides (the pixel ID, the currency, the shape of an order event, what
 * counts as a valid click reference) lives here once.
 *
 * What OpenAI's pixel and API are used for: telling OpenAI Ads which ChatGPT ad click led to a paid
 * pre-order (`order_created`) so the founder can see what the ads bring. Nothing else is sent: no
 * name, address or child detail ever passes through this module (test/analytics-tags.test.ts holds
 * the key allow-list).
 */

/** The Measurement Pixel's ID. A public client-side identifier (OpenAI's own snippet publishes it in
 *  the page), hardcoded like the GA4 and Meta IDs and for the same reason. */
export const OPENAI_PIXEL_ID = "CtmHigpYxafJN3qgbj3xnv";

/** OpenAI's browser SDK. Third-party script, loaded async after first interaction (marketing) or at
 *  idle (store); not an npm dependency. */
export const OPENAI_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

/** The pixel's remote configuration. It says whether OpenAI's automatic advanced matching is on for
 *  this pixel, which the SDK has no init option to switch off (see openai-pixel.ts, OPENAI_AAM_POLICY). */
export const OPENAI_PIXEL_CONFIG_URL = `https://bzrcdn.openai.com/pixel-config/v1/${OPENAI_PIXEL_ID}.json`;

/** The Conversions API endpoint (server only). `pid` names the pixel the events belong to. */
export const OPENAI_CAPI_URL = `https://bzr.openai.com/v1/events?pid=${OPENAI_PIXEL_ID}`;

/** The currency sent with every amount. OpenAI's supported-events page lists no currencies and says
 *  `amount` is an integer in the ISO 4217 minor unit, so INR amounts are paise (₹499 = 49900). INR is
 *  not named anywhere in their documentation: the first live event in Ads Manager's Test view is the
 *  check that OpenAI accepts it. */
export const OPENAI_ADS_CURRENCY = "INR";

/** Our own cookie that carries the ad click from kheelona.com to store.kheelona.com. */
export const OPENAI_OPPREF_COOKIE = "kh_oppref";
/** OpenAI's own cookies: `__oppref` (the click, 30 days) and `__obref` (a random browser reference,
 *  365 days). The SDK writes them; we read them on the server at order time and clear them on a
 *  team device. */
export const OPENAI_NATIVE_OPPREF_COOKIE = "__oppref";
export const OPENAI_OBREF_COOKIE = "__obref";
/** Every cookie this feature may read or clear. */
export const OPENAI_COOKIES = [OPENAI_OPPREF_COOKIE, OPENAI_NATIVE_OPPREF_COOKIE, OPENAI_OBREF_COOKIE] as const;

/** The `oppref` OpenAI appends to an ad click is an opaque token. Anything else (spaces, `;`, quotes,
 *  over 512 characters) is refused whole, never trimmed: a half-kept reference matches nobody and a
 *  hostile one has no business in a cookie or a database row. */
const OPPREF_SHAPE = /^[A-Za-z0-9._~-]{1,512}$/;
/** `__obref` is a random browser reference. */
const OBREF_SHAPE = /^[A-Za-z0-9-]{1,64}$/;

export function validOppref(value: string | null | undefined): string | null {
  return typeof value === "string" && OPPREF_SHAPE.test(value) ? value : null;
}

export function validObref(value: string | null | undefined): string | null {
  return typeof value === "string" && OBREF_SHAPE.test(value) ? value : null;
}

export interface OpenAiContentItem {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  currency: string;
}

export interface OpenAiOrderData {
  type: "contents";
  amount: number;
  currency: string;
  contents: OpenAiContentItem[];
}

/** What was bought, by tier. `launch` is the ₹499 reservation, `full` the order paid in full. A tier we
 *  have not named still reports, under its own id, rather than being dropped. */
function contentFor(tier: string): { id: string; name: string } {
  if (tier === "launch") return { id: "khelu-reservation", name: "Khelu reservation" };
  if (tier === "full") return { id: "khelu-full-payment", name: "Khelu (paid in full)" };
  return { id: `khelu-${tier}`, name: "Khelu pre-order" };
}

/** The `data` of a `checkout_started` or `order_created` event, in the browser and on the server. The
 *  amount is what was actually collected, in paise as an integer (the server quoted it; the client
 *  never chooses it). */
export function openAiOrderData(amountPaise: number, tier: string): OpenAiOrderData {
  const amount = Math.round(amountPaise);
  const { id, name } = contentFor(tier);
  return {
    type: "contents",
    amount,
    currency: OPENAI_ADS_CURRENCY,
    contents: [{ id, name, quantity: 1, amount, currency: OPENAI_ADS_CURRENCY }],
  };
}
