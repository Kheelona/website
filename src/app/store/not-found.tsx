import { NotFoundPanel } from "./_components/NotFoundPanel";

/** The store's own 404 boundary (§8.25-z).
 *
 *  Without this, `notFound()` from a store page would find the root not-found,
 *  which wears the full marketing chrome: five ways back into the marketing
 *  site, a mascot, and a footer of policies, on the host that takes money. A
 *  dead end dressed as a home page.
 *
 *  Since 2026-09-06 nothing under `src/app/store/` throws `notFound()` any
 *  more, because a thrown 404 never server-renders (§8.34-a) — the pages that
 *  used to throw render `NotFoundPanel` instead, and the proxy supplies the
 *  404 status. This file stays as the boundary of last resort: if a future
 *  change reintroduces a throw, it lands here wearing the right chrome rather
 *  than the marketing site's. A test keeps that from happening quietly. */
export default function StoreNotFound() {
  return <NotFoundPanel />;
}
