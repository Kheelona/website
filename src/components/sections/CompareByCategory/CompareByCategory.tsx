import { SectionLinkRow, SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { Card } from "@/components/ui/Card/Card";
import { CompareTable } from "@/components/ui/CompareTable/CompareTable";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Copy } from "@/content/types";
import type { CompareByCategoryProps, CompareMark } from "./compare-by-category.types";

export type { CompareByCategoryConfig, CompareByCategoryProps } from "./compare-by-category.types";

/** The mark's DS icon: a check for yes, a cross for no; "some" is words alone (home.html fold 7). */
const MARK_ICON = { yes: "check", no: "x" } as const;

function markIcon(mark: CompareMark | undefined) {
  return mark === "yes" || mark === "no" ? <Icon name={MARK_ICON[mark]} /> : undefined;
}

/**
 * Home fold 7 (task 3.3; components §2; DS gap G-05): Kheelu against kinds of products. Below 720 px one card per row
 * with Kheelu's answer first and the other kinds as a muted list (`ks-compare-stack`, revealing once); from 720 px the
 * DS comparison table (`CompareTable`, a focusable named region) with Kheelu's column marked. The caption follows
 * each; then the page's CTA block where it has one (`cta`, the product page's `product-compare`, D066 item 3, task
 * Q2.17); the guide link closes the fold.
 */
export function CompareByCategory({ heading, label, firstColumn, columns, rows, caption, link, offer, cta }: CompareByCategoryProps) {
  const text = (copy: Copy) => <RichText text={copy} offer={offer} />;
  for (const row of rows) {
    if (row.others.length !== columns.others.length || row.phone.others.length !== columns.others.length) {
      throw new Error(
        `CompareByCategory: the row "${String(row.label)}" needs one cell and one phone line per kind of product (${columns.others.length})`,
      );
    }
  }
  return (
    <Section labelledBy={heading.id}>
      <Container>
        <SectionHead>
          <SectionTitle heading={heading} align="center" offer={offer} />
        </SectionHead>
        <div className="ks-compare-stack" data-reveal="">
          {rows.map((row, r) => (
            <Card
              key={r}
              title={text(row.label)}
              body={
                <span className={`kh-${row.us.mark}`}>
                  {markIcon(row.us.mark)}
                  {text(row.phone.us)}
                </span>
              }
            >
              <ul className="kh-body-s ks-compare-others">
                {row.phone.others.map((line, i) => (
                  <li key={i}>{text(line)}</li>
                ))}
              </ul>
            </Card>
          ))}
          <RichText as="p" className="kh-caption" text={caption} offer={offer} />
        </div>
        <CompareTable
          label={label}
          firstColumn={text(firstColumn)}
          columns={[text(columns.us), ...columns.others.map(text)]}
          rows={rows.map((row) => ({
            label: text(row.label),
            cells: [row.us, ...row.others].map((cell) => ({ text: text(cell.text), mark: cell.mark, icon: markIcon(cell.mark) })),
          }))}
          usIndex={0}
          caption={text(caption)}
        />
        {cta}
        <SectionLinkRow link={link} center />
      </Container>
    </Section>
  );
}
