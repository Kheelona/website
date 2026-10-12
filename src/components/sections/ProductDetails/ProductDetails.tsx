import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { DefinitionList } from "@/components/ui/DefinitionList/DefinitionList";
import { Heading } from "@/components/ui/Heading/Heading";
import { Actions, Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { TickList } from "@/components/ui/TickList/TickList";
import type { IconText, Offer } from "@/content/types";
import { ContentIcon } from "@/components/ui/Icon/Icon";
import type { DetailRow, ProductDetailsConfig } from "./product-details.types";

/**
 * The product's details (tasks 3.4 and 3.5; meet-kheelu.html fold 7), section `#specs`: the three panels (specs, in the
 * box, safety) on `ui/Tabs`, as approved (P1 default; N21 corrected): the server sends them stacked, each under its
 * heading, with the tab row hidden, and after hydration the Tabs island makes line tabs of them as the approved page's
 * own script does (mockup/pages/meet-kheelu.html:397-439). Without JavaScript the panels stay stacked
 * (`meet-kheelu.css:81` spacing, `product-details.css`) and the tab row stays hidden. The section keeps `id="specs"`
 * and the panel and tab ids (`panel-specs`, `tab-specs`, ...). Beside them the declarations card (MRP from the offer,
 * consumer care one line per way to reach us). Open facts render visibly as placeholders. The split is
 * `ks-product-details`, not the mockup's `mk-details` renamed: the store page uses that name for a different block
 * (mapping §6.2; `ks-details` is StoreDetails', task 5.15). Server component.
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

export function ProductDetails({ heading, tabsLabel, specs, box, safety, declarations, link, offer }: ProductDetailsProps) {
  return (
    <Section id="specs" labelledBy="specs-title">
      <Container>
        <SectionHead>
          <Heading eyebrow={heading.eyebrow} title={heading.title} id="specs-title" offer={offer} />
        </SectionHead>
        <Split wide="start" className="ks-product-details">
          <Tabs
            label={tabsLabel}
            headingClassName="ks-panel-title"
            panels={[
              { id: "panel-specs", tabId: "tab-specs", label: specs.title, heading: specs.title, content: <DefinitionList rows={rows(specs.rows, offer)} /> },
              { id: "panel-box", tabId: "tab-box", label: box.title, heading: box.title, content: <TickList items={ticks(box.items, offer)} /> },
              { id: "panel-safety", tabId: "tab-safety", label: safety.title, heading: safety.title, content: <TickList items={ticks(safety.items, offer)} /> },
            ]}
          />
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
