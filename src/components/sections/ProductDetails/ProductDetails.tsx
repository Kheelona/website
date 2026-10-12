import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { DefinitionList } from "@/components/ui/DefinitionList/DefinitionList";
import { Heading } from "@/components/ui/Heading/Heading";
import { Actions, Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { TickList } from "@/components/ui/TickList/TickList";
import type { IconText, Offer } from "@/content/types";
import { ContentIcon } from "../ArticleBody/content-icon";
import type { DetailRow, ProductDetailsConfig } from "./product-details.types";

/**
 * The product's details (task 3.4; meet-kheelu.html fold 7), section `#specs`: the three panels (specs, in the box,
 * safety) STACKED, as the plan rules (N21; tasks 3.4): the mockup's no-JavaScript state, the DS `kh-tabs` and
 * `kh-tabs__panel` classes without `is-tabs`, no tab list and no JavaScript, each panel under its own heading. (The
 * mockup page also carries a page script after its main content that turns the panels into DS tabs when JavaScript
 * runs; it is not built here, and the panel ids stay so a later tabs island can enhance this markup.) Beside them the
 * declarations card (MRP from the offer, consumer care one line per way to reach us). Open facts render visibly as
 * placeholders. Server component.
 */
export interface ProductDetailsProps extends ProductDetailsConfig {
  /** For the MRP in the declarations. */
  offer?: Offer;
}

function rows(list: readonly DetailRow[], offer: Offer | undefined) {
  return list.map((row) => ({
    term: row.term,
    value:
      typeof row.value === "string" ? (
        <RichText text={row.value} offer={offer} />
      ) : (
        row.value.map((line, i) => (
          <span key={i} className="ks-care">
            <RichText text={line} offer={offer} />
          </span>
        ))
      ),
  }));
}

const ticks = (items: readonly IconText[], offer: Offer | undefined) =>
  items.map((item) => ({ icon: <ContentIcon name={item.icon} />, text: <RichText text={item.text} offer={offer} /> }));

function Panel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="kh-tabs__panel" id={id}>
      <h3 className="kh-subtitle ks-panel-title">{title}</h3>
      {children}
    </div>
  );
}

export function ProductDetails({ heading, specs, box, safety, declarations, link, offer }: ProductDetailsProps) {
  return (
    <Section id="specs" labelledBy="specs-title">
      <Container>
        <SectionHead>
          <Heading eyebrow={heading.eyebrow} title={heading.title} id="specs-title" offer={offer} />
        </SectionHead>
        <Split wide="start" className="ks-details">
          <div className="kh-tabs">
            <Panel id="panel-specs" title={specs.title}>
              <DefinitionList rows={rows(specs.rows, offer)} />
            </Panel>
            <Panel id="panel-box" title={box.title}>
              <TickList items={ticks(box.items, offer)} />
            </Panel>
            <Panel id="panel-safety" title={safety.title}>
              <TickList items={ticks(safety.items, offer)} />
            </Panel>
          </div>
          <Card as="div" className="ks-declare">
            <h3 className="kh-subtitle ks-panel-title">{declarations.title}</h3>
            <DefinitionList variant="stack" rows={rows(declarations.rows, offer)} />
          </Card>
        </Split>
        {link && (
          <Actions>
            <Button variant="ghost" href={link.href} iconEnd="arrow-right">
              {link.label}
            </Button>
          </Actions>
        )}
      </Container>
    </Section>
  );
}
