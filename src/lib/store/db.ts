import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StoreEnv } from "./env";

/** The database handle for the store (§8.25).
 *
 *  Service-role key, server only. The tables have RLS on and no policies, so
 *  this client is the only thing in the world that can read them, and it must
 *  never be constructed anywhere a browser bundle can reach. Every caller is a
 *  route handler.
 *
 *  Sessions are disabled: there are no users here, only our own server, and a
 *  client that tries to persist or refresh a session in a serverless function
 *  is a source of confusing failures. */
export function db(env: StoreEnv): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "kheelona-store" } },
  });
}

export type PreorderStatus = "created" | "paid" | "failed" | "refunded" | "cancelled";

export type PreorderRow = {
  id: number;
  order_ref: string;
  tier: string;
  amount_paise: number;
  status: PreorderStatus;
  parent_name: string;
  phone: string;
  email: string;
  child_age: string;
  wa_consent: boolean;
  terms_accepted_at: string | null;
  address: PreorderAddress | null;
  rzp_order_id: string | null;
  rzp_payment_id: string | null;
  balance_status: "due" | "link_sent" | "paid";
  utm: Record<string, string> | null;
  /** Meta attribution captured at order time (§8.30-l): the _fbp and _fbc
   *  cookies, the client IP and the user agent. Nullable, because the column
   *  was added on 2026-09-02 and every order before that has none, and because
   *  a visitor with the pixel blocked legitimately has nothing to store. */
  fb_attrib: Record<string, string> | null;
  /** PostHog's own anonymous device id, captured in the browser at order time
   *  (§8.40, founder 2026-09-20). It is what lets the SERVER-sent
   *  `purchase_confirmed` event join the same person's funnel as the form
   *  events, which the webhook otherwise has no way to know.
   *
   *  Nullable, and every consumer must cope: the column arrived in migration
   *  0004 so every order before it has none, a visitor with PostHog blocked
   *  legitimately has none, and losing the sale to protect the funnel would
   *  invert the point. It is a device id, never a person: the server event sets
   *  `$process_person_profile: false` so no profile is created. */
  ph_distinct_id: string | null;
  /** PostHog's own anonymous SESSION id, read on the server from the visitor's PostHog cookie at order time (D075,
   *  K-124b, migration 0005). The server-sent `purchase_confirmed` event carries it as `$session_id`, so PostHog attributes
   *  the sale to that visit's own entry referrer, landing path, click ids and UTMs.
   *
   *  Nullable AND optional: the column arrived in migration 0005, so every order before it has none (and a visitor with
   *  PostHog blocked legitimately has none), and the tests that build a whole row by hand predate it. A random id, never a
   *  person. */
  ph_session_id?: string | null;
  created_at: string;
  paid_at: string | null;
};

export type PreorderAddress = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};
