"use client";

import { useState, type ReactNode } from "react";

export interface CopyLinkButtonIslandProps {
  /** What goes on the clipboard. */
  value: string;
  /** The button's words. */
  label: string;
  /** Said in the polite live region once the value is on the clipboard. */
  copiedMessage: string;
  /** The DS copy icon, drawn by the server part (CopyLinkButton.tsx): this island never imports the icon map. */
  icon: ReactNode;
}

/**
 * The interactive half of "Copy link": writes the value to the clipboard on a click, then says so in the polite
 * live region. If the browser refuses or has no Clipboard API, nothing is said: the in-app note prints the address
 * in full beside the button, so it works without this (as approved). Import `CopyLinkButton` instead.
 */
export function CopyLinkButtonIsland({ value, label, copiedMessage, icon }: CopyLinkButtonIslandProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Refused, or no Clipboard API (navigator.clipboard undefined): the printed address stands in.
    }
  }

  return (
    <>
      {/* DS Button markup (secondary, s) as the mockup writes it, written out: a client island never imports ui/Button,
          which reaches the icon map (test/guards/client-icons.test.ts, task 2.11). */}
      <button type="button" className="kh-btn kh-btn--secondary kh-btn--s" onClick={copy}>
        {icon}
        <span>{label}</span>
      </button>
      <span className="kh-label-s" aria-live="polite">
        {copied ? copiedMessage : null}
      </span>
    </>
  );
}
