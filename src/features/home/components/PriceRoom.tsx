import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PriceTable } from "@/components/molecules/PriceTable";
import { CheckList } from "@/components/molecules/CheckList";
import { KheelonaPlusBand } from "@/components/molecules/KheelonaPlusBand";
import { PREORDER_HREF, RESERVE_LABEL, TOKEN_PRICE, TAX_LINE } from "@/config/site";

/** The mockup's price fold (CMO merge, 2026-10-04): "₹499 today. Nothing more
 *  until it ships." The branch hand-built a price list; this is the shared
 *  PriceTable, which already carries every figure from config, row headers a
 *  parser can pair, and links to the refund and shipping pages (agency audit
 *  D06). The three promises are the mockup's, each already published: the
 *  refund window (/refund), delivery included in India (the store), GST
 *  inclusive (TAX_LINE), and first-come dispatch (the finale). */
export function PriceRoom() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="The price"
          title={`${TOKEN_PRICE} today. Nothing more until it ships.`}
          titleClassName="mb-10 max-w-[18ch]"
        />
      </Reveal>
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <Reveal>
          <PriceTable />
        </Reveal>
        <Reveal>
          <CheckList
            className="mb-8"
            items={[
              <span key="refund">
                <b className="text-ink-head">Change your mind?</b> Get your {TOKEN_PRICE} back, in
                full, any time before we ship.
              </span>,
              <span key="extras">
                <b className="text-ink-head">No extras at checkout.</b> Delivery is included
                anywhere in India. {TAX_LINE}
              </span>,
              <span key="first">
                <b className="text-ink-head">First in line.</b> Pre-orders are served first, in the
                order they were placed.
              </span>,
            ]}
          />
          <Button href={PREORDER_HREF} track="home-reserve">
            {RESERVE_LABEL}
          </Button>
        </Reveal>
      </div>
      <Reveal className="mt-10">
        <KheelonaPlusBand footnote={2} />
      </Reveal>
    </>
  );
}
