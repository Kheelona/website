import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { imageRatio } from "@/components/ui/Photo/image";
import { RichText } from "@/components/ui/RichText/RichText";
import type { ImageRef } from "@/content/types";
import type { RecognitionItem, RecognitionStripConfig } from "./recognition-strip.types";

/**
 * "Recognised by" (task 3.4; team.html fold 5; the live marks since task 6.6, D054 item 20): a tight section with a
 * centred heading and the programmes as one quiet row in their order, where the mockup holds its line. Each item is a
 * mark that names its programme, a decorative mark beside the name, or the name alone (recognition-strip.types.ts). On a
 * phone the row wraps; the order stays. A gated programme never renders, and with none shown the whole fold renders
 * nothing (D038). Server component.
 */
export type RecognitionStripProps = RecognitionStripConfig;

/** The marks' drawn height in CSS pixels: the DS space-7 that recognition-strip.css sets (`.ks-recognition__mark`). */
const MARK_HEIGHT = 48;

/** A mark's `sizes`: its drawn width at the row's height, so a phone never fetches more than the mark it shows. */
const markSizes = (mark: ImageRef) => `${Math.ceil(MARK_HEIGHT / imageRatio(mark))}px`;

function Programme({ item }: { item: RecognitionItem }) {
  const { mark } = item;
  return (
    <li className="ks-recognition__item">
      {mark && <Photo bare image={mark} sizes={markSizes(mark)} className="ks-recognition__mark" />}
      {(!mark || mark.alt === "") && <span className="kh-label ks-recognition__name">{item.name}</span>}
    </li>
  );
}

export function RecognitionStrip({ title, items, id = "recognised-title", variant = "heading", band }: RecognitionStripProps) {
  const shown = items.filter((item) => !item.gated);
  if (shown.length === 0) return null;
  const row = (
    <ul className="ks-recognition" role="list">
      {shown.map((item) => (
        <Programme key={item.name} item={item} />
      ))}
    </ul>
  );
  /* Task Q2.9 (the D2C plan v2 §2 fold 2; the CMO's m10): a small label over the row, not a heading, so the strip reads
     as the end of the films' proof (Home, on the films' band). */
  if (variant === "label") {
    return (
      <Section tight band={band} labelledBy={id} className="ks-recognised">
        <Container>
          <RichText as="p" className="kh-label-s ks-recognition__label" id={id} text={title} />
          {row}
        </Container>
      </Section>
    );
  }
  return (
    <Section tight band={band} labelledBy={id}>
      <Container>
        <Heading align="center" title={title} id={id}>
          {row}
        </Heading>
      </Container>
    </Section>
  );
}
