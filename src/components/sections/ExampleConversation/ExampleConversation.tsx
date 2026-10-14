import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Offer } from "@/content/types";
import type { ExampleConversationConfig } from "./example-conversation.types";

export type { ExampleConversationConfig, ExampleConversationLine } from "./example-conversation.types";

/**
 * What asking back sounds like (task 8c.3; D061 and the main session's rulings; home.md fold 2 variant b): a written
 * example of one exchange, labelled as illustrative. The catalogue had nothing for it, so it is its own section
 * (components §2). The heading is the DS section heading, centred; under it, in one reading column, the label, then the
 * exchange as an ordered list the label names (each line led by who says it, Kheelu's lines to the start and the child's
 * to the end, as the pre-Gate A review build drew it: `mk-chat`, mockup.css:39-44 at c0f1668), then the line after it.
 * The label is required: the exchange is written by us, so it is never shown unmarked (DS 08-accessibility, "Children's
 * privacy"; home.md: "The label is required, sits above the exchange and is never removed"). Nothing moves. Server
 * component.
 */
export type ExampleConversationProps = ExampleConversationConfig & {
  /** For any amount in the words (none today); every line goes through RichText. */
  offer?: Offer;
};

export function ExampleConversation({ heading, note, lines, after, id, band, offer }: ExampleConversationProps) {
  if (!note.trim()) throw new Error("ExampleConversation: the exchange needs its label (\"Illustrative example, not a recording.\")");
  const titleId = heading.id ?? "example-title";
  const noteId = `${titleId}-note`;
  return (
    <Section id={id} band={band} labelledBy={titleId}>
      <Container>
        <SectionHead>
          <Heading eyebrow={heading.eyebrow} title={heading.title} id={titleId} align="center" offer={offer} />
        </SectionHead>
        <div className="ks-exchange">
          <p className="kh-label-s ks-exchange__note" id={noteId}>
            {note}
          </p>
          {/* role="list": Safari drops a list's role once its markers are gone. */}
          <ol className="ks-exchange__lines" role="list" aria-labelledby={noteId}>
            {lines.map((line, i) => (
              <li key={i} className={`kh-body ks-exchange__line ks-exchange__line--${line.speaker}`}>
                <span className="kh-label-s ks-exchange__who">{line.who}</span>
                <RichText text={line.text} offer={offer} />
              </li>
            ))}
          </ol>
          {after !== undefined && <RichText as="p" className="kh-body-l ks-exchange__after" text={after} offer={offer} />}
        </div>
      </Container>
    </Section>
  );
}
