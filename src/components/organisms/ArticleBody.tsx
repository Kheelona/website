import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { VideoEmbed } from "@/components/molecules/VideoEmbed";
import type { StoryBlock, StoryDoc, StoryInline, StoryListItem } from "@/lib/stories";

const LINK_CLASS = "font-semibold text-ink-head underline";
const H2_CLASS = "mb-3 mt-9 font-display text-[26px] font-extrabold text-ink-head";
const H3_CLASS = "mb-2 mt-7 font-display text-[21px] font-extrabold text-ink-head";
const P_CLASS = "mb-5 text-[18px] leading-[1.7]";

/** Cover and inline images without stored dimensions reserve a 16:9 box. */
const FALLBACK = { width: 1600, height: 900 };

function Inline({ nodes }: { nodes?: StoryInline[] }) {
  return (
    <>
      {(nodes ?? []).map((node, i) => {
        if (node.type === "hardBreak") return <br key={i} />;
        let out: ReactNode = node.text;
        const link = node.marks?.find((m) => m.type === "link");
        if (node.marks?.some((m) => m.type === "bold")) out = <strong>{out}</strong>;
        if (link && link.type === "link") {
          const href = link.attrs.href;
          out = href.startsWith("/") ? (
            <Link href={href} className={LINK_CLASS}>
              {out}
            </Link>
          ) : (
            <a href={href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
              {out}
            </a>
          );
        }
        return <span key={i}>{out}</span>;
      })}
    </>
  );
}

function Block({ block }: { block: StoryBlock | StoryListItem }): ReactNode {
  switch (block.type) {
    case "paragraph":
      // An empty paragraph is a writer's blank line, not content: render nothing.
      return block.content?.length ? (
        <p className={P_CLASS}>
          <Inline nodes={block.content} />
        </p>
      ) : null;
    case "heading":
      return block.attrs.level === 3 ? (
        <h3 className={H3_CLASS}>
          <Inline nodes={block.content} />
        </h3>
      ) : (
        <h2 className={H2_CLASS}>
          <Inline nodes={block.content} />
        </h2>
      );
    case "bulletList":
    case "orderedList": {
      const List = block.type === "bulletList" ? "ul" : "ol";
      return (
        <List
          className={`mb-5 ml-6 space-y-2 text-[18px] leading-[1.7] ${block.type === "bulletList" ? "list-disc" : "list-decimal"} [&_p]:mb-0`}
        >
          {block.content.map((item, i) => (
            <Block key={i} block={item} />
          ))}
        </List>
      );
    }
    case "listItem":
      return (
        <li>
          {block.content.map((child, i) => (
            <Block key={i} block={child} />
          ))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote className="my-7 border-l-4 border-orange pl-5 text-[19px] font-semibold leading-[1.6] text-ink-head [&_p]:mb-2 [&_p]:text-[19px]">
          {block.content.map((child, i) => (
            <Block key={i} block={child} />
          ))}
        </blockquote>
      );
    case "horizontalRule":
      return <hr className="my-9 border-line" />;
    case "image": {
      const { src, alt, caption, width, height } = block.attrs;
      return (
        <figure className="my-9">
          <Image
            src={src}
            alt={alt}
            width={width || FALLBACK.width}
            height={height || FALLBACK.height}
            sizes="(max-width: 768px) 90vw, 720px"
            className="h-auto w-full rounded-(--radius-card-lg)"
          />
          {caption && <figcaption className="mt-2 text-[14.5px] text-ink-muted">{caption}</figcaption>}
        </figure>
      );
    }
    case "videoEmbed":
      return <VideoEmbed {...block.attrs} />;
    default:
      return null;
  }
}

/** A journal article's body, as the dashboard's editor wrote it.
 *
 *  Server-rendered, plain semantic HTML (h2/h3, p, ul/ol, blockquote, figure with
 *  figcaption), so a crawler reads the whole article without running a script. Only
 *  the node types the backend's whitelist keeps are rendered; anything else renders
 *  nothing rather than something wrong. The type and size of every heading and
 *  paragraph match what the hand-written articles had, so imported pieces look the same. */
export function ArticleBody({ doc }: { doc: StoryDoc }) {
  return (
    <>
      {doc.content.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </>
  );
}
