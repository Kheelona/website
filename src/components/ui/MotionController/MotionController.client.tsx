"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/* The one observer behind the reveals and the doodle draws (task 2.8; ADR-007, architecture §11.1-§11.3,
 * D049 picks 1A and 3B), ported from mockup/mockup.js §1. Mounted once, in the site shell. It only sets the
 * class contract of architecture §11.3; src/motion/motion.css does the moving:
 *   - html.js-motion   motion is armed: a [data-reveal] block waits hidden, a [data-draw] doodle undrawn;
 *   - .is-in           the block shows, the doodle draws, once.
 * Anything already in view is marked is-in before js-motion arrives, so nothing on screen ever fades in
 * (CMO M12) and a doodle already on screen is shown drawn (doodles draw below the first screen only). The
 * rest is observed and unobserved once revealed. With reduced motion or without IntersectionObserver it does
 * nothing: js-motion never arrives, so everything stays visible and drawn, as without JavaScript.
 * Targets added after it armed (a client-only island, a streamed block; task 2.12) follow the same rules through
 * one MutationObserver on document.body: on screen, shown at once (its fade or draw jumped to the end before the
 * frame paints); below, observed.
 * It renders nothing and changes only opacity and transform (motion.css), so it shifts no layout. */

const TARGETS = "[data-reveal]:not(.is-in), [data-draw]:not(.is-in)";
const ARMED = "js-motion";
const SHOWN = "is-in";
const REDUCED = "(prefers-reduced-motion: reduce)";
/** mockup.js: a block reveals once its top is a tenth of the screen above the bottom edge. */
const ROOT_MARGIN = "0px 0px -10% 0px";

/** A target shown without moving: a doodle's draw (on its paths, so the whole subtree) or a block's own fade (its
 *  own transitions only, so nothing inside it is cut short) jumps to its end. Reading the animations brings the
 *  element's style up to date first, so a transition that the class change has just started is among them. */
function finishShown(el: Element): void {
  if (typeof el.getAnimations !== "function") return;
  const animations = el.matches("[data-draw]") ? el.getAnimations({ subtree: true }) : el.getAnimations();
  for (const animation of animations) animation.finish();
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
  // Read every position first (one layout, js-motion off so no preset offset counts), then write.
  const later = new Set(targets.filter((el) => el.getBoundingClientRect().top >= fold));
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

  // A doodle already shown (on screen at load, or kept by the shell across a navigation) is drawn, not
  // drawing: its draw, which js-motion has just started, jumps to the end before the frame paints.
  document.querySelectorAll(`[data-draw].${SHOWN}`).forEach(finishShown);

  // Targets added later (task 2.12). A mutation observer reports as a microtask, before the browser paints, so an
  // added target on screen is never seen hidden. js-motion is on by now, so a block's position includes the preset's
  // small offset; the fold test is the same as above.
  const mutations = new MutationObserver((records) => {
    const added = addedTargets(records);
    if (added.length === 0) return;
    const viewport = window.innerHeight;
    const below = new Set(added.filter((el) => el.getBoundingClientRect().top >= viewport));
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

export function MotionController() {
  const pathname = usePathname();

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
