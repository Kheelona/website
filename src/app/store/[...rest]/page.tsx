import { notFound } from "next/navigation";

/** Catch-all inside the store segment (§8.25-z).
 *
 *  Found in verification, not by reasoning: a mistyped URL on the store host is
 *  rewritten to `/store/<whatever>`, which matched no route, so Next fell back
 *  to the ROOT not-found and served the store's 404 wearing the full marketing
 *  chrome, navbar CTA and all. Someone who cannot reach their paid order was
 *  being shown the marketing site's navigation.
 *
 *  This catches those paths so `store/not-found.tsx` renders inside the store
 *  layout instead. Static and dynamic segments still win over a catch-all, so
 *  /thanks and /e/[event] are untouched. */
export default function StoreCatchAll() {
  notFound();
}
