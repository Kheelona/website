/** Tiny JSON helpers so every store route answers in one shape.
 *
 *  Consistency matters more than elegance here: the client has one error
 *  renderer, and a route that invents its own envelope means a parent sees a
 *  blank failure instead of a sentence. */
export function json(status: number, body: unknown, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

/** The message shown when the store has no keys yet. Not an error a parent
 *  caused, so it does not read like one. */
export const NOT_CONFIGURED = {
  error: "store-not-configured",
  message:
    "Pre-orders open here shortly. Nothing is wrong with your details, our store is not switched on yet.",
} as const;

/** Read a string field from an untrusted JSON body. */
export function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}
