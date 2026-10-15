import { AppScreens } from "@/components/ui/AppScreens/AppScreens";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import { TrustLine } from "@/components/ui/TrustLine/TrustLine";
import { TrustList } from "@/components/ui/TrustList/TrustList";
import type { Copy, Offer } from "@/content/types";
import { SectionLinkRow, SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import type { TrustItemCopy, TrustSectionProps } from "./trust-section.types";

export type { TrustItemCopy, TrustSectionConfig, TrustSectionProps } from "./trust-section.types";

/** One phone screen: half of Home's 576 px row (mockup.css:149), the product page's lone phone at 224 px, 280 from 720. */
const SCREEN_SIZES = {
  home: "(min-width: 900px) 280px, calc((100vw - 48px) / 2)",
  product: "(min-width: 720px) 280px, 224px",
} as const;
/** The tummy unit beside the safety page's heading: 200 px, 300 px from 900 px (safety.css:10-11). */
const BELLY_SIZES = "(min-width: 900px) 300px, 200px";

/**
 * The safety facts fold (task 3.3; components §2): a heading, the facts as a DS TrustList (icons from the DS, words
 * through RichText) and, by layout:
 * - `safety` (home.html and meet-kheelu.html fold 6): the four facts in D020 order beside the parent app's privacy
 *   screen (`AppScreens`, revealing), the checkable facts line (`TrustLine` unlinked, centred, `ks-facts`), then the
 *   page's CTA block in `cta`. Home splits evenly; the product page uses a 7:5 split (`ks-safety-split`) whose
 *   facts stay one column and whose screen stays in view (sticky) on laptops.
 * - `facts` (safety.html fold 2, `#facts`): the tummy unit beside the heading (`ks-sf-belly`), the four facts in full
 *   as an ordered list.
 * - `never` (safety.html fold 3): five items, revealing, the last spanning both columns from 720 px, three then two
 *   from 1024 px (`ks-sf-never`); a closing link.
 * - `meets` (ai-toys-for-kids-in-india.html fold 3): the five answers as an ordered list, revealing, the last
 *   spanning both columns from 720 px (`ks-gd-answers`), the pointer line (`ks-gd-pointer`) and a closing link.
 * - `pointer` (task Q2.10; the D2C plan v2 §3 fold 9): the product page's safety in one line, centred, then the ghost
 *   link to /safety (`PointerFold`): a tight section named by the line, no heading.
 * Nothing that sells reveals: the facts line and the CTA block sit outside every revealing block.
 */
export function TrustSection(props: TrustSectionProps) {
  if (props.variant === "pointer") return <PointerFold {...props} />;
  const { heading, items, id, band, offer, cta } = props;
  const text = (copy: Copy) => <RichText text={copy} offer={offer} />;
  const title = <SectionTitle heading={heading} offer={offer} align={props.variant === "safety" ? "center" : undefined} />;
  const list = trustItems(items, offer);

  return (
    <Section id={id} band={band} labelledBy={heading.id} className={props.variant === "safety" ? "ks-safety" : undefined}>
      <Container>
        {props.variant === "facts" ? (
          <SectionHead split="start">
            {title}
            <Photo image={props.photo} sizes={BELLY_SIZES} variant="square" reveal className="ks-sf-belly" />
          </SectionHead>
        ) : (
          <SectionHead>{title}</SectionHead>
        )}

        {props.variant === "safety" && (
          <>
            <Split wide={props.placement === "product" ? "start" : undefined} className={props.placement === "product" ? "ks-safety-split" : undefined}>
              <TrustList as="div" items={list} />
              <AppScreens
                variant={props.placement}
                screens={props.screens.images}
                sizes={SCREEN_SIZES[props.placement]}
                caption={props.screens.caption === undefined ? undefined : text(props.screens.caption)}
                reveal
              />
            </Split>
            <TrustLine center className="ks-facts" items={props.facts.map((fact) => ({ icon: <Icon name={fact.icon} />, label: text(fact.text) }))} />
          </>
        )}
        {props.variant === "facts" && <TrustList as="ol" items={list} />}
        {props.variant === "never" && <TrustList as="ul" items={list} reveal className="ks-sf-never ks-trust--span-last" />}
        {props.variant === "meets" && (
          <>
            <TrustList as="ol" items={list} reveal className="ks-gd-answers ks-trust--span-last" />
            {props.pointer !== undefined && <RichText as="p" className="kh-body-l ks-gd-pointer" text={props.pointer} offer={offer} />}
          </>
        )}
        {(props.variant === "never" || props.variant === "meets") && <SectionLinkRow link={props.link} />}
        {cta}
      </Container>
    </Section>
  );
}

function trustItems(items: readonly TrustItemCopy[], offer: Offer | undefined) {
  return items.map((item) => ({
    icon: <Icon name={item.icon} />,
    title: item.title === undefined ? undefined : <RichText text={item.title} offer={offer} />,
    body: <RichText text={item.body} offer={offer} />,
  }));
}

/** One line pointing to where the safety facts live, then the link there (`pointer`; task Q2.10). The line names the
 *  section, so the fold needs no heading of its own. */
function PointerFold({ id, band, pointer, link, offer }: Extract<TrustSectionProps, { variant: "pointer" }>) {
  const lineId = `${id ?? "pointer"}-line`;
  return (
    <Section id={id} band={band} tight labelledBy={lineId} className="ks-pointer-fold">
      <Container>
        <RichText as="p" className="kh-body-l ks-pointer" id={lineId} text={pointer} offer={offer} />
        <SectionLinkRow link={link} center />
      </Container>
    </Section>
  );
}
