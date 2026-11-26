import { REQUEST_TIMEOUT_MS } from "./config.ts";

/** Anything shaped like `fetch`: the real one in the function, a recording fake in the tests. */
export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type Sleep = (ms: number) => Promise<void>;
export const realSleep: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Statuses worth another try: rate limits and the server's own hiccups. A 4xx (a wrong key, a sheet not shared) is not. */
const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRY_DELAYS_MS = [2_000, 6_000];

/** `fetch` with a time limit on each attempt and up to two more attempts after a rate limit, a 5xx or a network error.
 *  Returns the last response whatever its status (the caller reads `ok`/`status`); rethrows the last network error. */
export function resilientFetch(
  inner: FetchLike,
  sleep: Sleep = realSleep,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): FetchLike {
  return async (input, init) => {
    for (let attempt = 0; ; attempt++) {
      const last = attempt >= RETRY_DELAYS_MS.length;
      try {
        const signal = typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(timeoutMs) : undefined;
        const response = await inner(input, signal ? { ...init, signal } : init);
        if (last || !RETRY_STATUSES.has(response.status)) return response;
      } catch (error) {
        if (last) throw error;
      }
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  };
}
