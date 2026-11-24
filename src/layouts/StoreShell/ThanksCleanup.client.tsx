"use client";

import { useEffect } from "react";
import { clearPaymentSession } from "@/features/preorder/components/pending-payment";

/** On the confirmation page, the payment this tab remembered is finished: forget it, together with the name, phone and
 *  email kept for the form (D070 / B2, K-172: `kh_preorder_pending`; D070 / B3: `kh_preorder_draft`). The shell calls
 *  this on every store page and it acts only on /thanks, read from the address bar in an effect (the store host serves
 *  /thanks, the proxy having rewritten it to /store/thanks, so the router's path is not the one to trust). It renders
 *  nothing. */
export function ThanksCleanup() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "");
    if (path === "/thanks") clearPaymentSession();
  }, []);
  return null;
}
