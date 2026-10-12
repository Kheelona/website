/**
 * Type tests for FeatureSplit (task 3.3; SCA 3, every variant behaves as typed). `npm run typecheck` (tsc --noEmit)
 * checks this file: the `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its
 * `**\/*.test.tsx` exclude and Vitest's runtime suite (the Photo.test-d.tsx pattern). The accepted lines must
 * type-check, and every line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 *
 * The `photo` layout without media (setup folds 4-6, `ks-setup-split`) is the heading beside its words, and the mockup
 * gives a link no place there, so its type takes none: a link given to it would never be drawn.
 */
import type { StaticImageData } from "next/image";
import { FeatureSplit } from "./FeatureSplit";

const HEADING = { title: "Tell the app {hand:your child’s age.}", id: "age-title" };
const COPY = ["You enter your child’s age in the parent app."];
const LINK = { label: "See what Kheelu does", href: "/products/kheelu" };
const PHOTO = { kind: "photo", image: { src: { src: "/_next/static/media/belly.png", width: 389, height: 397 } as StaticImageData, alt: "" } } as const;

export const accepted = () => (
  <>
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} />
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} split="end" band />
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} media={PHOTO} />
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} media={PHOTO} link={LINK} />
    <FeatureSplit variant="quote" heading={HEADING} copy={COPY} quote={{ text: "Quote", name: "Name" }} link={LINK} />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error without media the photo layout has no place for a link (it would never be drawn) */}
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} link={LINK} />
    {/* @ts-expect-error nor with media written out as absent */}
    <FeatureSplit variant="photo" heading={HEADING} copy={COPY} media={undefined} link={LINK} />
  </>
);
