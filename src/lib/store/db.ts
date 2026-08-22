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
