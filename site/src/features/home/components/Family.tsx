import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FamilyGrid } from "@/components/organisms/FamilyGrid";

/** Home room 5 (revamp M2): the companion family, Lumi first — copy-v2
 *  [seed] + published facts. Replaces the three-SKU shop grid (colorways live
 *  on /products/lumi with the picker); founder redlines at preview if the SKU
 *  shelf should return. M4: the cards moved to the shared FamilyGrid organism
 *  (/playos shows the same lineup), so this is the home copy around them. */
export function Family() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          title="Meet the family. Lumi comes first."
          titleClassName="mb-4 max-w-[18ch]"
          lede="The same friend lives inside each one. Lumi is the first your child will meet. Lori, Lua, and Robu are on the way."
          ledeClassName="mb-2 max-w-[58ch]"
        />
        <p className="mb-10 font-display text-[18px] font-bold text-ink-head">
          Made for a three-year-old. Still a friend at ten.
        </p>
      </Reveal>
      <FamilyGrid />
    </div>
  );
}
