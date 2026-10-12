import { Alert } from "@/components/ui/Alert/Alert";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton/CopyLinkButton";
import type { InAppBrowserNoteContent } from "@/content/types";
import { InAppBrowserGate } from "./InAppBrowserNote.client";

export interface InAppBrowserNoteProps {
  /** The note's words and its switch (the content shape, src/content/types.ts). */
  content: InAppBrowserNoteContent;
  /** The store's own URL on this environment: what "Copy link" copies and the note prints. */
  storeUrl: string;
}

/** The address as a parent types it: the host alone ("store.kheelona.com"). */
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * The store's in-app browser note (`ks-inapp`, from the mockup's `mk-inapp`; mockup/store.html fold 2): a DS
 * info Alert telling a parent inside Instagram, Facebook or WhatsApp to open the store in Chrome or Safari
 * before paying by UPI, with "Copy link". Nothing at all while `content.enabled` is false; otherwise the
 * markup is server-rendered and handed to a small client gate that shows it only in those in-app browsers.
 */
export function InAppBrowserNote({ content, storeUrl }: InAppBrowserNoteProps) {
  if (!content.enabled) return null;
  return (
    <InAppBrowserGate>
      <div className="ks-inapp">
        <Alert
          title={content.title}
          action={
            <div className="ks-inapp__action">
              <CopyLinkButton value={storeUrl} label={content.copyLabel} copiedMessage={content.copiedMessage} />
            </div>
          }
        >
          <p>
            {content.body} <strong className="ks-nowrap">{hostOf(storeUrl)}</strong>
          </p>
        </Alert>
      </div>
    </InAppBrowserGate>
  );
}
