import { Avatar } from "@/components/ui/Avatar/Avatar";
import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { Icon } from "@/components/ui/Icon/Icon";
import { Cols, Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { isPlaceholder } from "@/lib/content/placeholder";
import type { FounderCard, FoundersSectionConfig } from "./founders-section.types";

/**
 * The founders (task 3.4; team.html fold 3): a section of DS FeatureCards in three columns, composed with Avatar (the
 * DS has no founder card). Each card: the founder's photo with its alt (the live photos since task 6.6, D054 item 20),
 * or, while the photo is a placeholder, the initials badge (hidden: the visible name says who it is) and the
 * placeholder line; the name and role; the card's words; the background line (a gated line renders nothing, on any
 * environment, D038); the profile link, a full tap target (G-01). Server component.
 */
export type FoundersSectionProps = FoundersSectionConfig;

function Founder({ founder }: { founder: FounderCard }) {
  const { photo } = founder;
  const openPhoto = isPlaceholder(photo) ? photo : undefined;
  return (
    <Card className="ks-founder" link={{ href: founder.link.href, label: founder.link.label, icon: <Icon name="arrow-right" />, tap: true }}>
      <div className="ks-founder__head">
        {isPlaceholder(photo) ? (
          <Avatar initials={founder.initials} size="xl" tone="sun" />
        ) : (
          <Avatar image={photo} sizes="96px" size="xl" tone="sun" />
        )}
        <div className="ks-founder__who">
          <h3 className="kh-card__title" id={founder.anchor}>
            {founder.name}
          </h3>
          <p className="kh-label-s ks-founder__role">{founder.role}</p>
        </div>
      </div>
      {openPhoto && <RichText as="p" className="kh-caption ks-founder__photo" text={openPhoto} />}
      <RichText as="p" className="kh-card__body" text={founder.body} />
      {founder.bio && !founder.bio.gated && <RichText as="p" className="kh-body-s ks-founder__bg" text={founder.bio.text} />}
    </Card>
  );
}

export function FoundersSection({ title, founders, id = "founders-title" }: FoundersSectionProps) {
  return (
    <Section labelledBy={id}>
      <Container>
        <SectionHead>
          <Heading title={title} id={id} />
        </SectionHead>
        <Cols count={3}>
          {founders.map((founder) => (
            <Founder key={founder.name} founder={founder} />
          ))}
        </Cols>
      </Container>
    </Section>
  );
}
