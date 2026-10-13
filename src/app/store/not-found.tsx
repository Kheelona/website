import type { Metadata } from "next";
import { storeNotFound } from "@/content/en-IN/store/event-page";
import { pageMeta } from "@/lib/seo/metadata";
import { NotFoundPanel } from "./_components/NotFoundPanel";
import { StoreClose } from "./_components/TierCheckout";

/** The store's own 404 boundary (§8.25-z).
 *
 *  Without this, `notFound()` from a store page would find the root not-found,
 *  which wears the full marketing chrome: five ways back into the marketing
 *  site, a mascot, and a footer of policies, on the host that takes money. A
 *  dead end dressed as a home page.
 *
 *  Since 2026-09-06 nothing under `src/app/store/` throws `notFound()` any
 *  more, because a thrown 404 never server-renders (§8.34-a) — the pages that
 *  used to throw render `NotFoundPanel` instead, at 200 in the store chrome
 *  (lib/store/host.ts: on Vercel a 4xx rewrite is served the marketing 404,
 *  §8.34-f). This file stays as the boundary of last resort: if a future
 *  change reintroduces a throw, it lands here wearing the right chrome rather
 *  than the marketing site's. A test keeps that from happening quietly.
 *
 *  It is also THE store dead end: the `[...rest]` catch-all renders this page,
 *  so a mistyped store URL and a thrown 404 look the same (task 6.1). The panel,
 *  then what ends every store page: the payments line and the store's WhatsApp
 *  bubble (D050). Its title, description and share card through pageMeta, with
 *  no robots (the store layout's noindex stands), no canonical and no og:url: a
 *  dead end's address is whatever was mistyped. */
const { title, description, openGraph, twitter } = pageMeta({ ...storeNotFound.meta, path: "/404" });

export const metadata: Metadata = { title, description, openGraph: { ...openGraph, url: undefined }, twitter };

export default function StoreNotFound() {
  return (
    <>
      <NotFoundPanel />
      <StoreClose />
    </>
  );
}
