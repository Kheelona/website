"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePagePath } from "@/lib/page-path";

/* The one observer behind the reveals and the doodle draws (task 2.8; ADR-007, architecture §11.1-§11.3,
 * D049 picks 1A and 3B), ported from mockup/mockup.js §1. Mounted once, in the site shell. It only sets the
 * class contract of architecture §11.3; src/motion/motion.css does the moving:
 *   - html.js-motion   motion is armed: a [data-reveal] block waits hidden, a [data-draw] doodle undrawn;
 *   - .is-in           the block shows, the doodle draws, once.
 * Anything already in view is marked is-in before js-motion arrives, so nothing on screen ever fades in
 * (CMO M12) and a doodle already on screen is shown drawn (doodles draw below the first screen only). The
 * rest is observed and unobserved once revealed. With reduced motion or without IntersectionObserver it does
 * nothing: js-motion never arrives, so everything stays visible and drawn, as without JavaScript.
 * It also turns on smooth in-page anchor scrolling once the page has loaded (html[data-scroll-behavior="smooth"],
 * whatever the motion setting; smoothScrollOnceLoaded, task 7.1a), so a landing at a #fragment jumps.
 * Targets added after it armed (a client-only island, a streamed block; task 2.12) follow the same rules through
 * one MutationObserver on document.body: on screen, shown at once (its fade or draw jumped to the end before the
 * frame paints); below, observed. A target with no layout box yet (a streamed block in React's hidden holder) is
 * observed, never shown at once, whether it is there at arming or added later (tasks 3.6, 4.5).
 * Line drawing (task Q2.5, D064 item 10): a section heading's one accent, the `kh-hand` or `kh-mark` span RichText
 * renders inside an h2 or h3, is a target too and writes or draws itself once as it enters (motion.css). The hook is
 * the DS markup itself, so no page's server HTML changes; an h1's accent (the hero, D049 pick 2) and an accent outside
 * a heading are never targets.
 * It renders nothing and changes only opacity and transform (motion.css), so it shifts no layout. */

/** A section heading's one accent (DS 10-pages.md:39: one Hand phrase or one Mark per heading). */
const HEADING_ACCENT =":is(h2, h3) :is(.kh-hand, .kh-mark)";
const TARGETS = `[data-reveal]:not(.is-in), [data-draw]:not(.is-in), ${HEADING_ACCENT}:not(.is-in)`;
/** Targets that draw: their animations run on their paths or their ::after, so a draw is finished with the subtree's. */
const DRAWS = `[data-draw], ${HEADING_ACCENT}`;
const ARMED = "js-motion";
const SHOWN = "is-in";
const REDUCED = "(prefers-reduced-motion: reduce)";
/** mockup.js: a block reveals once its top is a tenth of the screen above the bottom edge. */
const ROOT_MARGIN = "0px 0px -10% 0px";

/** A target shown without moving: a draw (a doodle's on its paths, a mark's on its ::after, so the whole subtree) or
 *  a block's own fade (its own transitions only, so nothing inside it is cut short) jumps to its end. Reading the
 *  animations brings the element's style up to date first, so a fade that the class change has just started is among
 *  them. (The singular word for a CSS fade stays out of this folder: Tailwind reads it as its motion utility;
 *  motion-properties guard.) */
function finishShown(el: Element): void {
  if (typeof el.getAnimations !== "function") return;
  const animations = el.matches(DRAWS) ? el.getAnimations({ subtree: true }) : el.getAnimations();
  for (const animation of animations) animation.finish();
}

/** Whether a target waits for the observer rather than showing at once: its top edge is at or below the fold, or it has
 *  no layout box yet. React streams a late block into a `hidden` holder, then moves it into place (task 3.6); in the
 *  holder its rectangle reads 0, 0, which a top-edge test alone takes for "on screen", so it would skip its reveal
 *  wherever it lands. The same test at arming and for added targets (task 4.5 item 7). */
function waits(el: Element, fold: number): boolean {
  return el.getClientRects().length === 0 || el.getBoundingClientRect().top >= fold;
}

/** The targets still waiting in the nodes a mutation added: each node itself and anything inside it. */
function addedTargets(records: readonly MutationRecord[]): Element[] {
  const found = new Set<Element>();
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (!(node instanceof Element) || !node.isConnected) continue;
      if (node.matches(TARGETS)) found.add(node);
      node.querySelectorAll(TARGETS).forEach((el) => found.add(el));
    }
  }
  return [...found];
}

/** Arms motion on the page as it is now and returns the disarm, or undefined when motion stays off. */
function arm(): (() => void) | undefined {
  if (typeof IntersectionObserver === "undefined" || window.matchMedia(REDUCED).matches) return undefined;
  const root = document.documentElement;
  const fold = window.innerHeight;
  const targets = Array.from(document.querySelectorAll(TARGETS));
  // Read every position first (one layout, js-motion off so no preset offset counts), then write. A target with no
  // layout box yet (a streamed block still in React's hidden holder) waits too, as it does when added later.
  const later = new Set(targets.filter((el) => waits(el, fold)));
  for (const el of targets) if (!later.has(el)) el.classList.add(SHOWN);
  root.classList.add(ARMED);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(SHOWN);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN },
  );
  later.forEach((el) => observer.observe(el));

  // A doodle or an accent already shown (on screen at load, or kept by the shell across a navigation) is drawn, not
  // drawing: its draw, which js-motion has just started, jumps to the end before the frame paints.
  document.querySelectorAll(`[data-draw].${SHOWN}, ${HEADING_ACCENT}.${SHOWN}`).forEach(finishShown);

  // Targets added later (task 2.12). A mutation observer reports as a microtask, before the browser paints, so an
  // added target on screen is never seen hidden. js-motion is on by now, so a block's position includes the preset's
  // small offset; the test is the same as above (`waits`). A target with no layout box yet (task 3.6: React streams a
  // late block into a `hidden` holder, then moves it into place) reads as 0, 0, which is not "on screen": it is
  // observed, and when React moves it into place the move is another addition, judged again where it lands.
  const mutations = new MutationObserver((records) => {
    const added = addedTargets(records);
    if (added.length === 0) return;
    const viewport = window.innerHeight;
    const below = new Set(added.filter((el) => waits(el, viewport)));
    for (const el of added) {
      if (below.has(el)) {
        observer.observe(el);
      } else {
        el.classList.add(SHOWN);
        finishShown(el);
      }
    }
  });
  mutations.observe(document.body, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    observer.disconnect();
    root.classList.remove(ARMED);
  };
}

/**
 * Turns on the mockup's smooth in-page anchor scrolling (motion.css, keyed on `html[data-scroll-behavior="smooth"]`,
 * which Next 16 also reads to jump on a route change) once the page has loaded: a frame after the load event, or at the
 * next frame when the page has loaded already. Set in the server HTML, it made the browser's own jump to a URL's
 * #fragment on arrival glide from the top through every block on the way (task 7.1a; CMO built-page review A, M1:
 * /faq and /products/kheelu#faq glided 10,600 px in 1.5 s). Whatever the motion setting: motion.css keeps the scroll a
 * jump under reduced motion. Returns the cancel for a controller that leaves before then; once set, the attribute stays
 * for the life of the page.
 */
export function smoothScrollOnceLoaded(): () => void {
  let frame = 0;
  const turnOn = () => {
    frame = requestAnimationFrame(() => {
      document.documentElement.dataset.scrollBehavior = "smooth";
    });
  };
  if (document.readyState === "complete") turnOn();
  else window.addEventListener("load", turnOn, { once: true });
  return () => {
    window.removeEventListener("load", turnOn);
    cancelAnimationFrame(frame);
  };
}

export function MotionController() {
  // The page (usePagePath: Vercel's "/index" for Home is "/", task 8c.7); it renders nothing from it.
  const pathname = usePagePath();

  // Once per page load: the shell outlives a client navigation, and the attribute with it.
  useEffect(() => smoothScrollOnceLoaded(), []);

  // Re-armed on every pathname change (lessons §2: an observer mounted in a layout must re-arm, or a
  // client-navigated page stays hidden). The disarm runs as the router commits the new page, so its blocks
  // first lay out visible; the arm waits one frame, after every layout effect of the commit (Next's own
  // scroll to the top among them), and still runs before that frame paints.
  useLayoutEffect(() => {
    let disarm: (() => void) | undefined;
    const frame = requestAnimationFrame(() => {
      disarm = arm();
    });
    return () => {
      cancelAnimationFrame(frame);
      disarm?.();
    };
  }, [pathname]);

  return null;
}
