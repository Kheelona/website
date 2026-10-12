/**
 * Type tests for ImaginationFrame (task 2.3; ADR-010, N12). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite (the src/content/types.test-d.ts pattern). The accepted lines must type-check, and every
 * line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { StaticImageData } from "next/image";
import { type DoodleLayer, ImaginationFrame } from "./ImaginationFrame";

const KABIR = { src: { src: "/_next/static/media/kabir-01.webp", width: 1208, height: 1500 } as StaticImageData, alt: "" };
const DOODLES: readonly DoodleLayer[] = [{ doodle: { name: "chalk-planet", order: 2 }, left: 4, top: 30, width: 20, rotate: -10 }];
const SIZES = "(min-width: 900px) 540px, calc(100vw - 32px)";

export const accepted = () => (
  <>
    <ImaginationFrame photo={KABIR} sizes={SIZES} doodles={DOODLES} question="why?" zoom reveal />
    <ImaginationFrame photo={KABIR} sizes={SIZES} doodles={DOODLES} hero lcp />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error sizes is required */}
    <ImaginationFrame photo={KABIR} />
    {/* @ts-expect-error no priority prop: deprecated in Next 16 (N12); the photo takes lcp */}
    <ImaginationFrame photo={KABIR} sizes={SIZES} priority />
    {/* @ts-expect-error an image layer is not a doodle */}
    <ImaginationFrame photo={KABIR} sizes={SIZES} doodles={[{ image: KABIR, left: 1, top: 1, width: 10 }]} />
    {/* @ts-expect-error a draw order is 1 to 5 */}
    <ImaginationFrame photo={KABIR} sizes={SIZES} doodles={[{ doodle: { name: "chalk-star", order: 6 }, left: 1, top: 1, width: 10 }]} />
  </>
);
