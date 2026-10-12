import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section } from "@/components/ui/Layout/Layout";
import type { RecognitionStripConfig } from "./recognition-strip.types";

/**
 * "Recognised by" (task 3.4; team.html fold 5): a tight section with a centred heading and the programme names as one
 * quiet line of text. Proof-gated (D038, F11): a gated name never renders, and with no name filed the whole fold
 * renders nothing, on any environment (it is hidden, not a placeholder). Server component.
 */
export type RecognitionStripProps = RecognitionStripConfig;

export function RecognitionStrip({ title, items, id = "recognised-title" }: RecognitionStripProps) {
  const names = items.filter((item) => !item.gated).map((item) => item.name);
  if (names.length === 0) return null;
  return (
    <Section tight labelledBy={id}>
      <Container>
        <Heading align="center" title={title} id={id}>
          <p className="kh-body">{names.join(" · ")}</p>
        </Heading>
      </Container>
    </Section>
  );
}
