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
 *
 * One shape for every block (task Q2.15; the consistency review's R2): the chilli button is full width on phones with
 * the nudging arrow (D049 pick 6, D064 item 10), inline from 720 px (cta-block.css), by default, so a page never sets
 * it; and every block but a hero's groups its lines beside the button (`ks-beside`; the product close's "full" layout
 * left, CON-2).
 * Server component; never revealed on arrival (architecture §11.2): it holds the price and a chilli button.
 */
export function CtaBlock(props: CtaBlockProps) {
  const { cta, arrow = true, block = true, id, priceId, align = "start", layout = "beside", trust, helpLine, secondary, offer, ctaLabel, help } = props;
  const center = align === "center";
  const price = <PriceSentence offer={offer} id={priceId} />;
  const trustLine = <SellingTrustLine items={trust} offer={offer} center={center} />;
  const helpLineEl = helpLine ? <SellingHelpLine help={help} offer={offer} /> : null;
  return (
    <>
      <Actions center={center}>
        <PreorderButton cta={cta} label={ctaLabel} size="l" block={block} id={id} arrow={arrow} className="ks-cta__button" />
      </Actions>
      {layout === "stack" ? (
        <>
          {price}
          {trustLine}
          {helpLineEl}
        </>
      ) : (
        <div className={clsx("ks-beside", center && "ks-beside--center")}>
          {price}
          {trustLine}
          {layout === "beside" && helpLineEl}
        </div>
      )}
      {layout === "journal" && helpLineEl}
      {secondary && (
        <Actions center={center} className={secondary.from === "laptop" ? "ks-cta__laptop" : undefined}>
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
