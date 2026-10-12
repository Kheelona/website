import clsx from "clsx";
import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { RichTextString } from "@/content/types";

/* The parts GrievanceBlock and SellerBlock share (task 3.2): the contact page's fold that holds each of them, and the
   bold-lead line of their legal-page cards. */

export interface ContactFoldProps {
  readonly id?: string;
  readonly titleId: string;
  readonly title: RichTextString;
  /** The sentence beside the block. */
  readonly intro: RichTextString;
  readonly band?: boolean;
  /** The block itself (the card). */
  readonly children: ReactNode;
}

/** contact.html folds 3 and 4: the heading and its sentence beside the block they introduce (contact.css:24-25). */
export function ContactFold({ id, titleId, title, intro, band, children }: ContactFoldProps) {
  return (
    <Section id={id} band={band} labelledBy={titleId}>
      <Container>
        <Split wide="end" className="ks-contact-split">
          <Heading title={title} id={titleId}>
            <RichText as="p" className="kh-body-l ks-contact-text" text={intro} />
          </Heading>
          {children}
        </Split>
      </Container>
    </Section>
  );
}

export interface LeadLineProps {
  /** Set in bold first ("Grievance Officer:", "Who we are:"); none on a plain line. */
  readonly lead?: RichTextString;
  readonly text: RichTextString;
  readonly className?: string;
}

/** A paragraph that opens with a bold label, then a space and the rest (the legal cards and the grievance line). */
export function LeadLine({ lead, text, className }: LeadLineProps) {
  return (
    <p className={className}>
      {lead !== undefined && (
        <>
          <strong>
            <RichText text={lead} />
          </strong>{" "}
        </>
      )}
      <RichText text={text} />
    </p>
  );
}

export interface LegalCardProps extends LeadLineProps {
  /** A second paragraph in the card (a placeholder while a fact is open). */
  readonly note?: RichTextString;
}

/** A legal page's DS card holding one lead line (privacy.html:289-295): the page passes its own card class. */
export function LegalCard({ lead, text, note, className }: LegalCardProps) {
  return (
    <div className={clsx("kh-card", className)}>
      <LeadLine lead={lead} text={text} />
      {note !== undefined && <RichText as="p" text={note} />}
    </div>
  );
}
