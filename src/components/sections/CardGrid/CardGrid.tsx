import { SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { Card, type CardLink } from "@/components/ui/Card/Card";
import { Icon } from "@/components/ui/Icon/Icon";
import { Cols, Container, LIST_RESET, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Offer } from "@/content/types";
import type { CardGridItem, CardGridLink, CardGridProps } from "./card-grid.types";

export type { CardGridConfig, CardGridItem, CardGridProps } from "./card-grid.types";

/**
 * A heading and a grid of DS feature cards (task 3.3; components §2; `Cols` of `Card`s):
 * - `guides`: Home's guides for parents (home.html fold 7b, D046): a list of three tinted-tone cards (`ks-guides`),
 *   each with one link and its arrow, revealing once on scroll;
 * - `routes`: the contact page's route cards (contact.html fold 2, `ks-routes`): one column, two from 720 px with the
 *   last one wide, three then two from 1024 px; each card ends with its row of links, every link a full tap target
 *   (Card `links`);
 * - `plain`: cards in DS columns.
 */
export function CardGrid({ variant, heading, items, band, columns, offer }: CardGridProps) {
  const cards = items.map((item, i) => <GridCard key={i} item={item} variant={variant} offer={offer} />);
  return (
    <Section band={band} labelledBy={heading.id}>
      <Container>
        <SectionHead>
          <SectionTitle heading={heading} offer={offer} />
        </SectionHead>
        {variant === "guides" ? (
          <Cols as="ul" count={3} reveal className={`ks-guides ${LIST_RESET}`}>
            {cards}
          </Cols>
        ) : variant === "routes" ? (
          <Cols className="ks-routes">{cards}</Cols>
        ) : (
          <Cols count={columns}>{cards}</Cols>
        )}
      </Container>
    </Section>
  );
}

const cardLink = (link: CardGridLink): CardLink => ({
  href: link.href,
  label: link.label,
  ariaLabel: link.ariaLabel,
  icon: <Icon name="arrow-right" />,
});

function GridCard({ item, variant, offer }: { item: CardGridItem; variant: CardGridProps["variant"]; offer: Offer | undefined }) {
  const links = item.links ?? [];
  if (variant === "guides" && links.length > 1) {
    throw new Error(`CardGrid: a guides card has one link (home.html fold 7b); "${String(item.title)}" has ${links.length}`);
  }
  return (
    <Card
      as={variant === "guides" ? "li" : "article"}
      tone={item.tone}
      icon={item.icon && <Icon name={item.icon} />}
      title={<RichText text={item.title} offer={offer} />}
      body={item.body === undefined ? undefined : <RichText text={item.body} offer={offer} />}
      link={variant !== "routes" && links[0] ? cardLink(links[0]) : undefined}
      links={variant === "routes" && links.length > 0 ? links.map(cardLink) : undefined}
    />
  );
}
