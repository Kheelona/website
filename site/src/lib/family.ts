/** The companion family (facts published on kheelona.ai; images from the
 *  founder's repo). ONE source for the Home family room and /playos so the
 *  lineup can never drift (the setup-steps lesson, R9). Tints brand-4 only. */
export type FamilyMember = {
  name: string;
  note: string;
  img: string;
  alt: string;
  w: number;
  h: number;
  tint: string;
  here?: boolean;
};

export const FAMILY: readonly FamilyMember[] = [
  {
    name: "Lumi",
    note: "Here first. The friend who listens.",
    img: "/product/lumi-blue-2.png",
    alt: "Lumi, the sky blue talking plush toy, wearing its striped party hat",
    w: 1113,
    h: 1600,
    tint: "bg-blue/15",
    here: true,
  },
  {
    name: "Lori",
    note: "The baby-care companion. It watches over sleep, and knows hungry from sleepy.",
    img: "/products/lori.png",
    alt: "Lori, the white baby monitor with a camera, temperature display, and fabric speaker",
    w: 900,
    h: 900,
    tint: "bg-orange/15",
  },
  {
    name: "Lua",
    note: "A puppy on a leash. In the workshop.",
    img: "/products/lua.png",
    alt: "Lua, the golden plush puppy with a glowing collar and a leash controller",
    w: 900,
    h: 900,
    tint: "bg-yellow/15",
  },
  {
    name: "Robu",
    note: "The robot friend. Worth the wait.",
    img: "/products/robu.png",
    alt: "Robu, a small friendly white and orange robot waving hello",
    w: 900,
    h: 900,
    tint: "bg-blue/15",
  },
] as const;
