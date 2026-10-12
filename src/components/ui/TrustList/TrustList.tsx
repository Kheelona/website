import { clsx } from "clsx";
import type { ReactNode } from "react";
import { typeStepClass, type TypeStep } from "@/components/ui/Card/Card";

/**
 * The DS TrustList (`kh-trust`): an icon in a blue circle, an optional title, a body. The approved pages use it in
 * four shapes, all here:
 * - `as="ul"` (default) and `as="ol"`: list items, the list reset as a composition class (home.html fold 5,
 *   safety.html, the guide's answers; mockup.css:95, ai-toys-for-kids-in-india.css:6);
 * - `as="div"`: `article` items (home.html and meet-kheelu.html safety folds);
 * - `variant="facts"`: the safe-AI-toy article's facts, `div` items whose title is a bold `kh-label` lead-in inside
 *   the body (story-what-to-look-for-in-a-safe-ai-toy.html fold 5); its spacing is ArticleBody's.
 * The icon slot takes the `Icon` primitive; the title and body slots take `RichText`.
 */
export interface TrustListItem {
  icon: ReactNode;
  title?: ReactNode;
  body: ReactNode;
}

export interface TrustListProps {
  items: readonly TrustListItem[];
  as?: "ul" | "ol" | "div";
  variant?: "facts";
  /** A DS type step on every body (`body` for the article facts; mockup-css-mapping rows 76-77). */
  bodyType?: TypeStep;
  reveal?: boolean;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
}

export function TrustList({ items, as = "ul", variant, bodyType, reveal = false, className }: TrustListProps) {
  const facts = variant === "facts";
  const Root = facts ? "div" : as;
  const Item = facts ? "div" : as === "div" ? "article" : "li";
  const bodyClass = clsx("kh-trust__body", typeStepClass(bodyType));
  return (
    <Root className={clsx("kh-trust", Root !== "div" && "ks-list-reset", className)} data-reveal={reveal ? "" : undefined}>
      {items.map((item, i) => (
        <Item key={i} className="kh-trust__item">
          <span className="kh-trust__icon">{item.icon}</span>
          {facts ? (
            <p className={bodyClass}>
              {item.title !== undefined && (
                <>
                  <strong className="kh-label">{item.title}</strong>{" "}
                </>
              )}
              {item.body}
            </p>
          ) : (
            <div>
              {item.title !== undefined && <h3 className="kh-trust__title">{item.title}</h3>}
              <p className={bodyClass}>{item.body}</p>
            </div>
          )}
        </Item>
      ))}
    </Root>
  );
}
