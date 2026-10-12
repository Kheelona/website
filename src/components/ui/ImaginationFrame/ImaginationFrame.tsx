import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import type { ArtLayer, DoodleRef, DrawOrder, ImageRef } from "@/content/types";
import { asDoodleName, Doodle } from "@/components/ui/Doodle/Doodle";
import { imageSource, loadingFor } from "@/components/ui/Photo/image";

/* The DS imagination frame (task 2.3; kh-imagine, bundle.css:432-460; DS ImaginationFrame, photo variant).
 *
 * Approved markup (home.html:145-151): `<figure class="kh-imagine mk-imagine-zoom" data-reveal>` holding the photo
 * (`kh-imagine__photo`), the chalk doodles placed in % (`kh-imagine__doodle`) and the child's question
 * (`figcaption.kh-imagine__question`). `zoom` is the founder's crop of Kabir's frame (`ks-imagine-zoom`: scale 1.32
 * from 52% 100%, static; mockup.css:130-132, token exception `imagine-zoom`). Below the first screen the doodles draw
 * themselves one after another (D049 pick 3); in a hero they stay still (pick 2). */

/** A doodle placed on the frame: the doodle half of the content model's `ArtLayer`. */
export type DoodleLayer = Extract<ArtLayer, { readonly doodle: DoodleRef }>;

export interface ImaginationFrameProps {
  readonly photo: ImageRef;
  /** The frame's rendered width at each layout (the photo fills it). */
  readonly sizes: string;
  /** In order; without an `order` each draws one step after the one before (1 to 5). */
  readonly doodles?: readonly DoodleLayer[];
  /** The child's question, in the DS hand. */
  readonly question?: ReactNode;
  /** The founder's crop: the photo scaled from its bottom so the child fills the frame. */
  readonly zoom?: boolean;
  /** On the first screen: the doodles stay still, nothing reveals. */
  readonly hero?: boolean;
  /** The photo is the page's LCP image. */
  readonly lcp?: boolean;
  /** Fades in once on scroll (D049 pick 1); never in a hero. */
  readonly reveal?: boolean;
  /** The section's own composition class (`ks-…`). */
  readonly className?: string;
}

const stepFor = (i: number) => Math.min(i + 1, 5) as DrawOrder;

export function ImaginationFrame({ photo, sizes, doodles = [], question, zoom, hero, lcp, reveal, className }: ImaginationFrameProps) {
  if (hero && reveal) throw new Error("A hero imagination frame never fades in on scroll (D049 pick 2)");
  if (lcp && reveal) throw new Error("The imagination frame holding the LCP image never fades in on scroll (D049 pick 2)");
  return (
    <figure className={clsx("kh-imagine", zoom && "ks-imagine-zoom", className)} data-reveal={reveal ? "" : undefined}>
      <Image {...imageSource(photo)} alt={photo.alt} className="kh-imagine__photo" sizes={sizes} {...loadingFor(lcp)} />
      {doodles.map((layer, i) => {
        const { name, draw, order } = layer.doodle;
        return (
          <Doodle
            key={i}
            name={asDoodleName(name)}
            draw={!hero && draw !== false}
            order={order ?? stepFor(i)}
            className="kh-imagine__doodle"
            placement={layer}
            lazy={!hero}
          />
        );
      })}
      {question ? <figcaption className="kh-imagine__question">{question}</figcaption> : null}
    </figure>
  );
}
