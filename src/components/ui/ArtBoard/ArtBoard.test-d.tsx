/**
 * Type tests for ArtBoard (task 2.3; ADR-010, N12). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite (the src/content/types.test-d.ts pattern). The accepted lines must type-check, and every
 * line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { StaticImageData } from "next/image";
import type { ArtLayer } from "@/content/types";
import { ArtBoard } from "./ArtBoard";

const ADVIK = { src: "/_next/static/media/advik-sticker.png", width: 744, height: 1198 } as StaticImageData;
const LAYERS: readonly ArtLayer[] = [
  { image: { src: ADVIK, alt: "" }, left: 38, width: 54, bottom: 0 },
  { doodle: { name: "chalk-question-mark" }, left: 43, width: 13, top: 2, rotate: 10 },
];
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

export const accepted = () => (
  <>
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} hero lcp />
    <ArtBoard tone="sun" layers={LAYERS} sizes={SIZES} ratio="4 / 3" reveal />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error sizes is required: each raster asks for its share of the board's sizes */}
    <ArtBoard tone="blue" layers={LAYERS} />
    {/* @ts-expect-error no priority prop: deprecated in Next 16 (N12); the board's LCP raster takes lcp */}
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} priority />
    {/* @ts-expect-error a layer is an image or a doodle, never both */}
    <ArtBoard tone="blue" sizes={SIZES} layers={[{ image: { src: ADVIK, alt: "" }, doodle: { name: "ink-heart" }, left: 1, top: 1, width: 10 }]} />
    {/* @ts-expect-error a layer is placed by a % width */}
    <ArtBoard tone="blue" sizes={SIZES} layers={[{ image: { src: ADVIK, alt: "" }, left: 1, top: 1 }]} />
    {/* @ts-expect-error a ratio is "width / height" */}
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} ratio="4:3" />
    {/* @ts-expect-error the LCP image is on the first screen: lcp only together with hero (task 2.12) */}
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} lcp />
    {/* @ts-expect-error not with hero={false} either */}
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} hero={false} lcp />
  </>
);

/** A hero decided at run time still takes the board without an LCP hint, and the hint as false. */
export const computed = (hero: boolean) => (
  <>
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} hero={hero} />
    <ArtBoard tone="blue" layers={LAYERS} sizes={SIZES} lcp={false} />
  </>
);
