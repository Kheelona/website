import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { Heading } from "@/components/ui/Heading/Heading";
import { ContentIcon, Icon } from "@/components/ui/Icon/Icon";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { List } from "@/components/ui/List/List";
import type { EmptyStateSectionConfig } from "./empty-state-section.types";

/**
 * The empty state (task 3.4; 404.html fold 1): the band section of the first screen with the DS EmptyState (variant
 * `404`, ui/EmptyState holds its CSS), the page's one h1 centred, and a labelled nav of DS list rows, each one tap
 * target with its icon tile and chevron (decoration, hidden). It carries `ks-hero`, the hero's first-screen spacing
 * (HeroSection, task 3.3), as the mockup's hero hook. Server component.
 */
export type EmptyStateSectionProps = EmptyStateSectionConfig;

export function EmptyStateSection({ icon, tone, eyebrow, title, lead, nav, id = "nf-title" }: EmptyStateSectionProps) {
  return (
    <Section band className="ks-hero" labelledBy={id}>
      <Container>
        <EmptyState icon={<ContentIcon name={icon} />} tone={tone} variant="404">
          <Heading level={1} align="center" eyebrow={eyebrow} title={title} lead={lead} id={id} />
          <nav className="ks-404__nav" aria-label={nav.label}>
            <List
              className="ks-404__list"
              chevron={<Icon name="caret-right" />}
              items={nav.links.map((link) => ({ title: link.title, sub: link.sub, href: link.href, tone: link.tone, icon: <ContentIcon name={link.icon} /> }))}
            />
          </nav>
        </EmptyState>
      </Container>
    </Section>
  );
}
