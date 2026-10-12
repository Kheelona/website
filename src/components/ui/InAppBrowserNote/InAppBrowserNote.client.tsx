"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { isInAppBrowser } from "./in-app-browser";

/* The user agent never changes while a page is open, so there is nothing to subscribe to. */
const noSubscription = () => () => {};
const inAppNow = () => isInAppBrowser(navigator.userAgent);
const notOnTheServer = () => false;

/**
 * Shows its children only inside an Instagram, Facebook or WhatsApp browser (N7). The user agent is read on the
 * client only: the server render and the hydration pass take `notOnTheServer` (false), and React re-renders
 * with the browser's answer right after hydrating. So the store page stays static, the server HTML never holds
 * the note, and hydration never mismatches. This is the post-hydration read ADR-003 asks for ("browser reads
 * happen in effects"), written as React's external-store hook rather than a state update inside an effect.
 */
export function InAppBrowserGate({ children }: { children: ReactNode }) {
  const inApp = useSyncExternalStore(noSubscription, inAppNow, notOnTheServer);
  return inApp ? children : null;
}
