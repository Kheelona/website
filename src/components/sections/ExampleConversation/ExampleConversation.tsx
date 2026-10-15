import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { Tabs, type TabsPanel } from "@/components/ui/Tabs/Tabs";
import type { Offer } from "@/content/types";
import type { ExampleConversationConfig, ExampleConversationLines, ExampleConversationTab, ExampleConversationTabs } from "./example-conversation.types";

export type {
  ExampleConversationConfig,
  ExampleConversationLine,
  ExampleConversationLines,
  ExampleConversationTab,
  ExampleConversationTabs,
} from "./example-conversation.types";

/**
 * What asking back sounds like (task 8c.3; D061 and the main session's rulings; home.md fold 2 variant b): a written
 * example of one exchange, labelled as illustrative. The catalogue had nothing for it, so it is its own section
 * (components §2). One reading column holds it all: the DS section heading (aligned to the start, as the steps fold
 * before it on the product page), the label, then the
 * exchange as an ordered list the label names (each line led by who says it, Kheelu's lines to the start and the child's
 * to the end, as the pre-Gate A review build drew it: `mk-chat`, mockup.css:39-44 at c0f1668), then the line after it.
 * The label is required: the exchange is written by us, so it is never shown unmarked (DS 08-accessibility, "Children's
 * privacy"; home.md: "The label is required, sits above the exchange and is never removed"). Nothing moves. Server
 * component.
 *
 * Since task Q2.10 (the D2C plan v2 §3 fold 6, ruling 6): several exchanges on the DS Tabs (`ui/Tabs`, line tabs and its
 * island, as the details fold has them): one tab per exchange, each panel the label above its exchange, served stacked
 * under the tabs' words without JavaScript; then the line under the tabs and the page's CTA block (`cta`, composed by the
 * section registry), last in the column.
 */
export type ExampleConversationProps = ExampleConversationConfig & {
  /** For any amount in the words (none today); every line goes through RichText. */
  offer?: Offer;
  /** The page's CTA block (CtaBlock), last in the column. */
  cta?: ReactNode;
};

export function ExampleConversation(props: ExampleConversationProps) {
  const { heading, note, after, id, band, offer, cta } = props;
  if (!note.trim()) throw new Error("ExampleConversation: the exchange needs its label (\"Illustrative example, not a recording.\")");
  const titleId = heading.id ?? "example-title";
  return (
    <Section id={id} band={band} labelledBy={titleId}>
      <Container>
        <div className="ks-exchange">
          <SectionHead>
            <Heading eyebrow={heading.eyebrow} title={heading.title} id={titleId} offer={offer} />
          </SectionHead>
          {props.tabs !== undefined ? (
            <ExchangeTabs tabs={props.tabs} note={note} offer={offer} />
          ) : (
            <Exchange note={note} noteId={`${titleId}-note`} lines={props.lines} offer={offer} />
          )}
          {after !== undefined && <RichText as="p" className="kh-body-l ks-exchange__after" text={after} offer={offer} />}
          {cta}
        </div>
      </Container>
    </Section>
  );
}

/** The exchanges on the DS Tabs, one per tab, in order: each panel the label above its exchange. */
function ExchangeTabs({ tabs, note, offer }: { tabs: ExampleConversationTabs; note: string; offer?: Offer }) {
  const panel = (item: ExampleConversationTab): TabsPanel => ({
    id: `panel-${item.id}`,
    tabId: `tab-${item.id}`,
    label: item.label,
    heading: item.label,
    content: <Exchange note={note} noteId={`panel-${item.id}-note`} lines={item.lines} offer={offer} />,
  });
  const [first, ...rest] = tabs.items;
  return <Tabs label={tabs.label} panels={[panel(first), ...rest.map(panel)]} />;
}

interface ExchangeProps {
  note: string;
  /** The label's id, which names the list. */
  noteId: string;
  lines: ExampleConversationLines;
  offer?: Offer;
}

/** The label, then the exchange as an ordered list the label names, each line led by who says it. */
function Exchange({ note, noteId, lines, offer }: ExchangeProps) {
  return (
    <>
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
    </>
  );
}
