import { NextResponse } from "next/server";
import { storeEnv } from "@/lib/store/env";
import { db } from "@/lib/store/db";
import { isOrderRef } from "@/lib/store/order-ref";
import { signAddressToken, ADDRESS_TOKEN_TTL_MS } from "@/lib/store/signing";
import { rateLimit, clientKey } from "@/lib/store/rate-limit";
import { THANKS_COOKIE, THANKS_COOKIE_MAX_AGE_SECONDS, THANKS_PATH, formatThanksSession } from "@/lib/store/thanks-session";
import { str } from "@/lib/store/http";
import { PAY_HEADERS, RZP_ORDER_ID } from "../_shared";

/** What became of the payment this tab started (D070 / B2, K-172; store.kheelona.com/pay/status).
 *
 *  A tab that was sent to a UPI app or to Razorpay's own page and came back finds the store form again, with no idea
 *  whether the parent paid. PreorderForm kept `{ orderRef, rzpOrderId, tier, createdAt }` in sessionStorage
 *  (`kh_preorder_pending`, no token, no personal data) and asks here, on mount, once:
 *
 *   paid   -> the `kh_order` cookie is set exactly as the proxy's claim sets it (the same session value, httpOnly,
 *             secure unless localhost, SameSite=Lax, path /thanks, 2 hours), and the page goes to /thanks. The token
 *             never reaches JavaScript;
 *   open   -> the order is still unpaid: the key and amount Razorpay needs to open the SAME order again;
 *   closed -> anything else, with no reason given.
 *
 *  The pair must belong to one order and the order must be under two hours old, so this answers a question about the
 *  order a browser itself created and nothing else; a wrong pair, an old order, a shape that is not ours and an order
 *  that does not exist all read the same, "closed". Every answer is private and unindexed. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE_MS = 2 * 60 * 60 * 1000;

function answer(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: PAY_HEADERS });
}

export async function POST(request: Request) {
  const env = storeEnv();
  /* A store that is not switched on has no orders: nothing here can be open or paid. */
  if (!env) return answer({ status: "closed" });

  if (!rateLimit(`pay-status:${clientKey(request)}`).allowed) return answer({ error: "too-many" }, 429);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return answer({ error: "bad-request" }, 400);

  const orderRef = str(body.orderRef, 32);
  const rzpOrderId = str(body.rzpOrderId, 64);
  if (!isOrderRef(orderRef) || !RZP_ORDER_ID.test(rzpOrderId)) return answer({ status: "closed" });

  const { data, error } = await db(env)
    .from("preorders")
    .select("order_ref, status, amount_paise, created_at")
    .eq("order_ref", orderRef)
    .eq("rzp_order_id", rzpOrderId)
    .maybeSingle();

  if (error) {
    console.error("[pay-status] lookup failed", error.message);
    return answer({ error: "unavailable" }, 503);
  }

  const order = data as { order_ref: string; status: string; amount_paise: number; created_at: string } | null;
  const age = order ? Date.now() - Date.parse(order.created_at) : Number.NaN;
  if (!order || !(age >= 0 && age < MAX_AGE_MS)) return answer({ status: "closed" });

  if (order.status === "paid") {
    const token = signAddressToken(env.signingSecret, order.order_ref, Date.now() + ADDRESS_TOKEN_TTL_MS);
    const session = formatThanksSession(order.order_ref, token);
    if (!session) return answer({ status: "closed" });

    const response = answer({ status: "paid" });
    const host = request.headers.get("host") ?? "";
    response.cookies.set(THANKS_COOKIE, session, {
      httpOnly: true,
      /* As src/proxy.ts sets it: secure unless the host is literally a localhost one. */
      secure: !host.split(":")[0].toLowerCase().endsWith("localhost"),
      sameSite: "lax",
      path: THANKS_PATH,
      maxAge: THANKS_COOKIE_MAX_AGE_SECONDS,
    });
    return response;
  }

  if (order.status === "created") {
    return answer({ status: "open", keyId: env.razorpayKeyId, amountPaise: order.amount_paise });
  }

  return answer({ status: "closed" });
}
