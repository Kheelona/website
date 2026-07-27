/** Kheelu's seven published pose renders (PNG cutouts in /public/mascot/),
 *  with their intrinsic dimensions. Extracted in the revamp (M1) so the
 *  persistent KheeluGuide and any narrator surface share ONE map — the old
 *  copies in KheeluSays/MascotScene drifted independently. */
export const KHEELU_POSES = {
  "hero-wink": { w: 384, h: 737 },
  curious: { w: 505, h: 595 },
  grumpy: { w: 459, h: 757 },
  sad: { w: 430, h: 664 },
  silly: { w: 468, h: 649 },
  joy: { w: 513, h: 696 },
  bliss: { w: 423, h: 726 },
} as const;

export type KheeluPose = keyof typeof KHEELU_POSES;

export const KHEELU_POSE_NAMES = Object.keys(KHEELU_POSES) as KheeluPose[];

export function kheeluPoseSrc(pose: KheeluPose): string {
  return `/mascot/mascot-${pose}.png`;
}
