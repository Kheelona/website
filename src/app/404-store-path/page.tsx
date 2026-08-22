import { notFound } from "next/navigation";

/** The rewrite target for `store.kheelona.com/store/...` (§8.25-a).
 *
 *  A doubled prefix must not quietly serve the store's home page, or that URL
 *  gets linked, shared and indexed as a second address for the same page. This
 *  route exists only to answer 404 for it. */
export default function StorePathNotFound() {
  notFound();
}
