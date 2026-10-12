import clsx from "clsx";
import { Button } from "@/components/ui/Button/Button";
import { asIconName } from "@/components/ui/Icon/Icon";
import { Actions } from "@/components/ui/Layout/Layout";
import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";
import type { CtaBlockProps, CtaSecondary } from "./cta-block.types";
import { SellingHelpLine, SellingTrustLine } from "./selling-lines";

/**
 * The compact CTA block (architecture §5.2; home.md "CTA block"; CMO mockup pass): the chilli button, then directly
 * under it the price sentence for the live mode, the trust line, the help line and an optional secondary link, in
 * that order, wherever a page sells. Ports `kh-section__actions` + `mk-beside` (mockup.css:27-28, 96) and the
 * layouts of every placement of the approved mockup (`layout`, cta-block.types.ts).
 *
 * It renders its lines as siblings, with no wrapper of its own, because the mockup puts them straight into the
 * column after the heading (home.html fold 1, the closes); the hero and close sections space them from there.
 * Server component; never revealed on arrival (architecture §11.2): it holds the price and a chilli button.
 */
export function CtaBlock(props: CtaBlockProps) {
  const { cta, arrow, block, id, priceId, align = "start", layout = "beside", trust, helpLine, secondary, offer, ctaLabel, help } = props;
  const center = align === "center";
  const full = layout === "full";
  const price = <PriceSentence offer={offer} id={priceId} />;
  const trustLine = <SellingTrustLine items={trust} offer={offer} center={center} className={full ? "ks-cta__full-trust" : undefined} />;
  const helpLineEl = helpLine ? <SellingHelpLine help={help} className={full ? "ks-cta__full-help" : undefined} /> : null;
  const grouped = layout === "beside" || layout === "journal";
  return (
    <>
      <Actions center={center}>
        <PreorderButton cta={cta} label={ctaLabel} size="l" block={block} id={id} arrow={arrow} className="ks-cta__button" />
      </Actions>
      {grouped ? (
        <div className={clsx("ks-beside", center && "ks-beside--center")}>
          {price}
          {trustLine}
          {layout === "beside" && helpLineEl}
        </div>
      ) : (
        <>
          {price}
          {trustLine}
          {helpLineEl}
        </>
      )}
      {layout === "journal" && helpLineEl}
      {secondary && (
        <Actions center={center}>
          <SecondaryLink link={secondary} />
        </Actions>
      )}
    </>
  );
}

/** The ghost or secondary button under a block (never chilli: Button refuses a pre-order value on it). */
export function SecondaryLink({ link }: { link: CtaSecondary }) {
  return (
    <Button
      variant={link.variant}
      href={link.href}
      cta={link.cta}
      icon={link.icon === undefined ? undefined : asIconName(link.icon)}
      iconEnd={link.iconEnd === undefined ? undefined : asIconName(link.iconEnd)}
    >
      {link.label}
    </Button>
  );
}
