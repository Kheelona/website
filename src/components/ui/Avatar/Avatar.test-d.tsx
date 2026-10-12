/**
 * Type tests for Avatar (task 2.3; ADR-010, N12). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite (the src/content/types.test-d.ts pattern). The accepted lines must type-check, and every
 * line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { StaticImageData } from "next/image";
import { Avatar } from "./Avatar";

const PHOTO = { src: { src: "/_next/static/media/aman.jpg", width: 600, height: 750 } as StaticImageData, alt: "" };

export const accepted = () => (
  <>
    <Avatar initials="AS" size="xl" tone="sun" />
    <Avatar initials="KC" label="Kashyap" />
    <Avatar image={PHOTO} sizes="96px" size="xl" />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error a photo needs sizes */}
    <Avatar image={PHOTO} />
    {/* @ts-expect-error initials or a photo, not both */}
    <Avatar initials="AS" image={PHOTO} sizes="96px" />
    {/* @ts-expect-error no priority prop: deprecated in Next 16 (N12) */}
    <Avatar image={PHOTO} sizes="96px" priority />
    {/* @ts-expect-error a photo is named by its alt text, never a label */}
    <Avatar image={PHOTO} sizes="96px" label="Aman" />
  </>
);
