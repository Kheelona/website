import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FamilyGrid } from "@/components/organisms/FamilyGrid";

/** Home's pipeline room (V3; was the companion family room).
 *
 *  This is the story the YC application tells and the category cannot answer:
 *  one friend, many bodies, and the child's memory carries across all of them.
 *  Lumi is the body you can reserve today; the Kheelu Speaker and AI books show
 *  the arc that makes the purchase outlast the toy — the gap every shelf-mate
 *  leaves open (benchmarks-v3.md). Cards live in the shared FamilyGrid, which
 *  /playos also renders, so the lineup can never drift. */
export function Family() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          title="One friend inside. More bodies on the way."
          titleClassName="mb-4 max-w-[20ch]"
          lede="The same friend lives inside everything we make, and it remembers your child across all of it. Lumi is here first. The Kheelu Speaker and AI books follow."
          ledeClassName="mb-2 max-w-[58ch]"
        />
        <p className="mb-10 font-display text-[18px] font-bold text-ink-head">
          Starts talking at 2. Still teaching at 14.
        </p>
      </Reveal>
      <FamilyGrid />
    </div>
  );
}
