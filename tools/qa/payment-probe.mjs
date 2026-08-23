#!/usr/bin/env node
/** The payment path, driven for real, in a browser, against Razorpay's SANDBOX.
 *
 *  WHY THIS EXISTS. The store's 100-odd money-path tests are unit and
 *  integration level: they prove our own decisions, with the gateway and the
 *  database mocked. Two things they cannot tell you, and both matter to the
 *  2026-08-23 security engagement (security-review.md):
 *
 *    1. Whether the Content-Security-Policy disturbs Razorpay Checkout. The
 *       policy allows *.razorpay.com and *.rzp.io, and checkout.js loads
 *       frames, fonts and telemetry of its own. If any of that is refused, a
 *       parent sees a payment window that will not open. This probe is what
 *       must be green before the policy is flipped from Report-Only to
 *       enforcing (F-03).
 *    2. Whether a real signed webhook still lands, end to end, through the
 *       amount guard added for F-06.
 *
 *  IT NEVER TAKES REAL MONEY. Razorpay TEST keys only; the probe stops at the
 *  moment the sheet is open and never completes a payment. It refuses to run
 *  against a live key at all.
 *
 *  Usage, from the repo root:
 *    node tools/qa/supabase-stub.mjs &            # STUB_WRITABLE=1 for the form
 *    npx next start -p 3456 &                     # with .env.local test keys
 *    node tools/qa/payment-probe.mjs
 *
 *  Exits 1 on any failure, so it can gate a release. */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { openPage, loadSettled } from "./lib/browser.mjs";

const STORE = process.env.PROBE_STORE ?? "http://store.localhost:3456";
const API = process.env.PROBE_API ?? "http://127.0.0.1:3456";

/** Read the local env file directly: this tool runs outside Next, and the point
 *  is to use exactly the values the server under test is using. */
function localEnv() {
  const out = {};
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    out[line.slice(0, line.indexOf("="))] = line.slice(line.indexOf("=") + 1);
  }
  return out;
}

const env = localEnv();
let failures = 0;

function report(ok, label, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok    " : "FAIL  "} ${label}${detail ? `  ${detail}` : ""}`);
}

/* A live key here would mean this probe could charge a real card. Refuse. */
if (!String(env.RAZORPAY_KEY_ID ?? "").startsWith("rzp_test_")) {
  console.error("refusing to run: RAZORPAY_KEY_ID in .env.local is not a test key");
  process.exit(1);
}

/* ── 1. The form, the gateway order, and the payment sheet ──────────────── */

/* Razorpay is let through because it is the thing under test. The measurement
   hosts are NOT: their tags report to the founder's real properties, and a QA
   run has no business appearing in them. Their compatibility with the policy is
   what production Report-Only is for. */
const { browser, page } = await openPage({
  width: 1280,
  local: true,
  allow: ["razorpay.com", "rzp.io"],
});
const violations = [];
const errors = [];

await page.evaluateOnNewDocument(() => {
  window.__csp = [];
  document.addEventListener("securitypolicyviolation", (event) => {
    window.__csp.push(`${event.effectiveDirective} <- ${event.blockedURI}`);
  });
});
page.on("pageerror", (error) => errors.push(String(error).slice(0, 200)));
page.on("requestfailed", (request) => {
  /* Only care about what the policy might have stopped. */
  const failure = request.failure()?.errorText ?? "";
  if (/blocked/i.test(failure)) violations.push(`${failure} ${request.url().slice(0, 90)}`);
});

await loadSettled(page, `${STORE}/`);

const filled = await page.evaluate(() => {
  const set = (name, value) => {
    const field = document.querySelector(`[name="${name}"]`);
    if (!field) return false;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  };
  const ok =
    set("parentName", "Probe Parent") &&
    set("phone", "9000000000") &&
    set("email", "probe@example.com") &&
    set("childAge", "3");
  const tick = document.querySelector('[name="accepted"]');
  if (tick && !tick.checked) tick.click();
  return ok && Boolean(tick);
});
report(filled, "the pre-order form has the four fields and the consent tick");

const createOrder = page.waitForResponse(
  (response) => response.url().includes("/api/preorder/create-order"),
  { timeout: 20_000 },
);
await page.evaluate(() => document.querySelector("form")?.requestSubmit());

let created = null;
try {
  const response = await createOrder;
  created = await response.json();
  report(response.status() === 200, "create-order answers 200", `status ${response.status()}`);
  report(
    typeof created.razorpayOrderId === "string" && created.razorpayOrderId.startsWith("order_"),
    "a real sandbox gateway order came back",
    created.razorpayOrderId ?? JSON.stringify(created).slice(0, 120),
  );
  report(
    created.amountPaise === 49_900,
    "the amount came from OUR tier table, not the browser",
    `${created.amountPaise} paise`,
  );
  report(
    typeof created.addressToken === "string" && created.addressToken.includes("."),
    "an address token was minted for the confirmation step",
  );
} catch (error) {
  report(false, "create-order responded", String(error).slice(0, 120));
}

/* The sheet is Razorpay's own iframe. Its arrival is the assertion. */
let sheet = false;
for (let waited = 0; waited < 20_000 && !sheet; waited += 500) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  sheet = await page.evaluate(() =>
    Boolean(document.querySelector('iframe[src*="razorpay"], iframe[src*="rzp"]')),
  );
}
report(sheet, "Razorpay Checkout opened its payment sheet");

const cspEvents = await page.evaluate(() => window.__csp ?? []);
for (const event of [...new Set(cspEvents)]) violations.push(event);

report(violations.length === 0, "nothing was refused by the content policy", violations.join(" | "));
report(errors.length === 0, "no page errors while the sheet loaded", errors.join(" | "));

await browser.close();

/* ── 2. The webhook, signed for real, through the F-06 amount guard ─────── */

async function deliver(body, label, expectNote) {
  const raw = JSON.stringify(body);
  const signature = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest("hex");
  const response = await fetch(`${API}/api/razorpay/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-razorpay-signature": signature,
      "x-razorpay-event-id": `probe_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    },
    body: raw,
  });
  const json = await response.json().catch(() => ({}));
  report(
    response.status === 200 && (!expectNote || json.note === expectNote),
    label,
    `${response.status} ${JSON.stringify(json)}`,
  );
}

const orderId = created?.razorpayOrderId ?? "order_probe";

/* What this proves: the signature is verified against the raw body, the event is
   claimed, and the handler runs to completion. It does NOT prove the order was
   marked paid, because the stub remembers nothing, so markPaid finds no row and
   correctly answers "unknown". Marking paid is fulfil.test.ts's job. */
await deliver(
  {
    event: "payment.captured",
    payload: { payment: { entity: { id: "pay_probe", order_id: orderId, amount: 49_900 } } },
  },
  "a correctly signed webhook is accepted",
);

/* The same body with the signature computed over something else. */
{
  const raw = JSON.stringify({ event: "payment.captured", payload: {} });
  const response = await fetch(`${API}/api/razorpay/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-razorpay-signature": createHmac("sha256", "not-the-secret").update(raw).digest("hex"),
      "x-razorpay-event-id": "probe_forged",
    },
    body: raw,
  });
  report(response.status === 400, "a forged webhook is refused", `status ${response.status}`);
}

console.log(failures ? `\n${failures} failure(s)` : "\nclean: the payment path, in a browser, on test keys");
process.exit(failures ? 1 : 0);
