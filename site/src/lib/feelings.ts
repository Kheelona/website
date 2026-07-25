import type { KheeluPose } from "./kheelu-poses";

/** The five feelings (copy-v2, seed = wireframe copy.json): card line +
 *  the longer detail the FeelingsGallery overlay opens with. Kheelu is
 *  named in every alt (R9 law: the mascot must never read as the product).
 *  Sad uses the serene bliss render on purpose (R9 re-map). Tints are
 *  brand-4 only (P2). */
export type Feeling = {
  name: string;
  line: string;
  detail: string;
  pose: KheeluPose;
  card: string;
  tick: string;
  alt: string;
};

export const FEELINGS: readonly Feeling[] = [
  {
    name: "Curious",
    line: "Asks why. Chases ideas. Wants to know what is around the corner.",
    detail:
      "When your child asks why, Lumi answers in words they understand, then wonders with them. One why becomes three, and that is the point.",
    pose: "curious",
    card: "bg-blue/15",
    tick: "bg-blue",
    alt: "Kheelu sitting with wide, curious eyes behind his glasses",
  },
  {
    name: "Grumpy",
    line: "Names the hard feeling instead of hiding it.",
    detail:
      "Lumi does not scold and does not rush. It listens until the storm has room to pass, and helps your child put a name to it.",
    pose: "grumpy",
    card: "bg-orange/15",
    tick: "bg-orange",
    alt: "Kheelu frowning with his fists on his hips",
  },
  {
    name: "Sad",
    line: "Sits with you. Does not rush past. Makes space for the hard moments.",
    detail:
      "Some days are heavy. Lumi stays close, keeps its voice low, and lets your child take their time.",
    pose: "bliss",
    card: "bg-blue/15",
    tick: "bg-blue",
    alt: "Kheelu standing quietly with his eyes closed",
  },
  {
    name: "Silly",
    line: "Turns a dull afternoon into a game.",
    detail:
      "Rhymes, made-up words, giggle games. Laughing together is learning too.",
    pose: "silly",
    card: "bg-yellow/15",
    tick: "bg-yellow",
    alt: "Kheelu laughing with his head thrown back",
  },
  {
    name: "Joy",
    line: "Celebrates the small wins out loud.",
    detail:
      "Small wins feel big when a friend cheers. Lumi remembers what your child is proud of.",
    pose: "joy",
    card: "bg-orange/15",
    tick: "bg-orange",
    alt: "Kheelu dancing with one arm in the air",
  },
] as const;
