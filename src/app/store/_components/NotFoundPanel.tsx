import type { ReactNode } from "react";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { Actions, Container, Section } from "@/components/ui/Layout/Layout";
import { storeNotFound, type StorePanelCopy } from "@/content/en-IN/store/event-page";

/** What the store shows when the page a visitor asked for is not there.
 *
 *  One component in four places (§8.34-b): the `not-found.tsx` boundary, the
 *  `[...rest]` catch-all that answers a mistyped URL, the confirmation page
 *  when the order behind a valid link will not load, and the event page when
 *  the store is not configured. They were four different dead ends before, and
 *  three of them rendered nothing at all. Since task 6.1 it is also the event
 *  page's refused link and the partner page's ended and not-configured states:
 *  every store state that is not the form, with each state's words.
 *
 *  It offers a person rather than only a link home, because someone reading it
 *  may have paid us and be unable to reach their own order.
 *
 *  RESTYLED ON THE DESIGN SYSTEM (task 6.1; ADR-013: markup, classes, copy and
 *  presentation imports only). No mockup: the store's own not-configured
 *  composition (a section named by its h1, the lead, a secondary button, the
 *  muted line under it; store/page.tsx, task 5.15). The words are content's
 *  (content/en-IN/store/event-page.ts `storeNotFound`, the live words); a page
 *  passes another state's `copy`, or its own `title` and `body` as /thanks does.
 *  A partner's `mark` opens the panel a step above the heading: an app-private
 *  component has no stylesheet of its own (the compose manifest reads ui,
 *  sections, chrome and layouts), so that one step is the DS-mapped utility
 *  `mb-5` (space-5; architecture §4.2). Since task 6.3 the store page's own
 *  not-configured state is this panel as well, with its approved words
 *  (store.md, "Store not switched on"): its WhatsApp button as `action`, its
 *  note as `note`. Server component. */
export function NotFoundPanel({
  copy = storeNotFound.panel,
  title = copy.title,
  body = copy.body,
  cta = true,
  mark,
  action,
  note,
}: {
  /** The state's words: the dead end's by default. */
  copy?: StorePanelCopy;
  title?: string;
  body?: string;
  /** Off for a reader who has already paid: sending them to buy again is the
   *  wrong offer, and the WhatsApp line below is the only useful next step. */
  cta?: boolean;
  /** A partner's lockup above the heading (the partner page, B29). */
  mark?: ReactNode;
  /** A page's own action in place of the button to the pre-order page (the store page without keys: its WhatsApp
   *  button, where a button to the store would lead back to the same words). */
  action?: ReactNode;
  /** A page's own muted line in place of the WhatsApp line (the store page without keys: its note, which follows its
   *  WhatsApp button). */
  note?: string;
}) {
  return (
    <Section labelledBy={copy.titleId}>
      <Container>
        {mark ? <div className="mb-5">{mark}</div> : null}
        <Heading level={1} id={copy.titleId} title={title} lead={body} />
        {action ? (
          <Actions>{action}</Actions>
        ) : cta ? (
          <Actions>
            <Button href="/">{copy.action}</Button>
          </Actions>
        ) : null}
        {/* "Or" only reads as a second option when there is a first one. */}
        <p className="kh-body-s ks-muted ks-store-closed">
          {note ?? (
            <>
              {cta ? `${copy.help.or} ` : ""}
              <a href={SUPPORT_WHATSAPP_HREF}>{cta ? copy.help.link : copy.help.linkAlone}</a>{" "}
              {copy.help.tail}
            </>
          )}
        </p>
      </Container>
    </Section>
  );
}
