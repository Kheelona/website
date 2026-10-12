import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Copy, Offer, Placeholder as OpenFact } from "@/content/types";
import { pickMode } from "@/lib/content/mode";
import { isPlaceholder } from "@/lib/content/placeholder";
import { leafText, parseRichText, type LinkNode, type RichNode } from "@/lib/content/rich-text";
import { Placeholder } from "../Placeholder/Placeholder";
import { SourceMarker } from "../SourceMarker/SourceMarker";

/** How `[^n]` markers render: the accessible word before the number, and the article variant. */
export interface SourceMarkerOptions {
  /** "Source" makes "Source 1"; from content. */
  label: string;
  variant?: "article";
}

/** The text elements a content string may fill. */
export type RichTextTag =
  | "p"
  | "span"
  | "strong"
  | "em"
  | "small"
  | "div"
  | "li"
  | "dt"
  | "dd"
  | "figcaption"
  | "cite"
  | "blockquote"
  | "h2"
  | "h3"
  | "h4"
  | "td"
  | "th";

export interface RichTextProps {
  /** A content string in the inline syntax (one string, or one per offer mode), or a placeholder value. */
  text: Copy | OpenFact;
  /** The page's offer: needed by `{price:…}`, `{delivery}` and copy that changes with the mode. */
  offer?: Offer;
  /** Needed when the text carries source markers. */
  sources?: SourceMarkerOptions;
  /** Wraps the text in this element; without it the text renders bare, inside whatever holds it. */
  as?: RichTextTag;
  className?: string;
  id?: string;
}

/** A site path: one slash, then never a second one or a backslash (a browser reads `//host` and `/\host` as another
 *  site). Only these go through next/link; the parser already refuses the others in content. */
const SITE_PATH = /^\/(?![/\\])/;

interface Context {
  offer: Offer | undefined;
  sources: SourceMarkerOptions | undefined;
}

function renderLink(node: LinkNode, ctx: Context, className?: string): ReactNode {
  const children = renderNodes(node.children, ctx);
  return SITE_PATH.test(node.href) ? (
    <Link href={node.href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={node.href} className={className}>
      {children}
    </a>
  );
}

function renderNode(node: RichNode, ctx: Context): ReactNode {
  switch (node.kind) {
    case "hand":
    case "mark":
      return <span className={`kh-${node.kind}`}>{renderNodes(node.children, ctx)}</span>;
    case "nowrap": {
      // A no-wrap phrase that is one link puts the class on the link, as the mockup marks it up.
      const [only] = node.children;
      if (node.children.length === 1 && only.kind === "link") return renderLink(only, ctx, "ks-nowrap");
      return <span className="ks-nowrap">{renderNodes(node.children, ctx)}</span>;
    }
    case "link":
      return renderLink(node, ctx);
    case "source":
      if (ctx.sources === undefined) {
        throw new Error(`A source marker [^${node.n}] needs the section's sources: pass sources={{ label }} to RichText.`);
      }
      return <SourceMarker n={node.n} label={ctx.sources.label} variant={ctx.sources.variant} />;
    case "placeholder":
      return <Placeholder id={node.id} note={node.note} />;
    default:
      return leafText(node, ctx.offer);
  }
}

/** Renders a run of nodes, joining neighbouring text (words, amounts, the delivery line) into one string, so the
 *  server HTML prints a sentence as one text node instead of pieces React separates with `<!-- -->`. */
function renderNodes(nodes: readonly RichNode[], ctx: Context): ReactNode {
  const parts: ReactNode[] = [];
  for (const node of nodes) {
    const part = renderNode(node, ctx);
    const last = parts.length - 1;
    if (typeof part === "string" && typeof parts[last] === "string") parts[last] += part;
    else parts.push(part);
  }
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

/**
 * Renders one content string (architecture §6.2) exactly as the approved mockup marks it up: `{hand:…}` as
 * `kh-hand`, `{mark:…}` as `kh-mark`, `{nowrap:…}` as `ks-nowrap`, links (site paths through next/link),
 * `[^n]` as a `SourceMarker`, prices and the delivery line from the offer, and open facts as a `Placeholder`.
 * The words it shows are exactly those src/lib/content/plain-text.ts gives JSON-LD, meta and llms.txt. A
 * string that breaks the syntax, or needs an offer or sources it was not given, throws, so the build fails
 * instead of a parent seeing a raw token or a guessed price.
 */
export function RichText({ text, offer, sources, as: Tag, className, id }: RichTextProps) {
  const ctx: Context = { offer, sources };
  const content = isPlaceholder(text)
    ? renderNode(text, ctx)
    : renderNodes(parseRichText(pickMode(text, offer?.mode)), ctx);
  if (Tag === undefined) return <>{content}</>;
  return (
    <Tag className={className} id={id}>
      {content}
    </Tag>
  );
}
