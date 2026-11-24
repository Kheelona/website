"use client";

import { useEffect } from "react";

/* The store's answers open in place (D070 / C1, K-176; D-top5-changes.md Change 1, item 3): the refund and delivery links
 * on the first screen and in the pay block (the trust lines, which open the marketing site's /refund and /shipping in a
 * new tab) take the parent to the store's own matching question lower on the page and open it, instead of leaving.
 *
 * It renders nothing. One click listener on the document, armed once the page has hydrated; without JavaScript the links
 * are what they were (their `href`s are untouched: the fallback). What it takes over, and nothing else:
 *   - a plain press (no new-tab or new-window gesture, not already handled) on a link inside a trust line of the store
 *     (the first screen's, or the pay block's), never the consent line's legal links, which are not in a trust line;
 *   - whose address, `path#fragment` on the marketing site, the page names in `routes` (content's own trust hrefs, mapped
 *     by the page to the question that answers them);
 *   - when that question is on this page, as a `<details>`. Anything else leaves as it always did (the warranty and the
 *     payment-methods links have no question here).
 * The question opens, scrolls into view (smoothly, unless the parent asked for reduced motion) and takes focus, so a
 * screen reader reads it. The address bar keeps the store's address and no history entry is added: the parent scrolls
 * back, and the pay bar is there throughout. */

/** The store's trust lines: the first screen's (StoreTop) and the one in the pay block (PayBeside, inside `ks-pay-beside`). */
const TRUST_LINES = ".ks-store-top .kh-trustline, .ks-pay-beside .kh-trustline";

export interface AnswerRoute {
  /** The link as content writes it: the marketing path and its fragment ("/refund#before-dispatch"). */
  readonly href: string;
  /** The id of the question's `<details>` on this page (FaqSection `anchor`). */
  readonly answer: string;
}

export interface StoreAnswerLinksProps {
  readonly routes: readonly AnswerRoute[];
}

/** Opens the question, brings it into view and moves focus to it. */
export function openAnswer(answer: HTMLDetailsElement): void {
  answer.open = true;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  answer.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  answer.querySelector("summary")?.focus({ preventScroll: true });
}

export function StoreAnswerLinks({ routes }: StoreAnswerLinksProps) {
  useEffect(() => {
    const press = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link?.closest(TRUST_LINES)) return;
      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return;
      }
      const route = routes.find((r) => r.href === `${url.pathname}${url.hash}`);
      const answer = route && document.getElementById(route.answer);
      if (!(answer instanceof HTMLDetailsElement)) return;
      event.preventDefault();
      openAnswer(answer);
    };
    document.addEventListener("click", press);
    return () => document.removeEventListener("click", press);
  }, [routes]);
  return null;
}
