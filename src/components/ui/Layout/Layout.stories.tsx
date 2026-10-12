import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Actions, Cols, Container, Section, SectionHead, Split } from "./Layout";

/* The layout family nested as the approved pages nest it. Blocks are outlined panels so the grid shows. */
const meta = {
  title: "UI/Layout",
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const Panel = ({ children }: { children: string }) => <div className="kh-card kh-card--tint kh-body">{children}</div>;

export const SectionAndContainer: Story = {
  render: () => (
    <>
      <Section labelledBy="a-title">
        <Container>
          <SectionHead>
            <h2 className="kh-heading__title" id="a-title">
              A plain section
            </h2>
          </SectionHead>
          <Panel>Content</Panel>
          <Actions>
            <a className="kh-btn kh-btn--secondary" href="#a-title">
              <span>An action</span>
            </a>
          </Actions>
        </Container>
      </Section>
      <Section band tight labelledBy="b-title">
        <Container>
          <SectionHead>
            <h2 className="kh-heading__title" id="b-title">
              A tight band section
            </h2>
          </SectionHead>
          <Actions center>
            <a className="kh-btn kh-btn--secondary" href="#b-title">
              <span>A centred action</span>
            </a>
          </Actions>
        </Container>
      </Section>
    </>
  ),
};

export const Splits: Story = {
  render: () => (
    <Section>
      <Container>
        <Split>
          <Panel>Even</Panel>
          <Panel>Even</Panel>
        </Split>
        <Cols count={2}>
          <Panel>A column grid after a split sits a step down</Panel>
          <Panel>Two</Panel>
        </Cols>
        <h3 className="kh-subtitle">A subtitle after a column grid</h3>
        <Split wide="start">
          <Panel>Wide start (7)</Panel>
          <Panel>5</Panel>
        </Split>
        <SectionHead split="end">
          <Panel>5</Panel>
          <Panel>A head that is a split, wide end (7)</Panel>
        </SectionHead>
      </Container>
    </Section>
  ),
};

export const Columns: Story = {
  render: () => (
    <Section>
      <Container>
        <Cols count={3}>
          <Panel>One</Panel>
          <Panel>Two</Panel>
          <Panel>Three</Panel>
        </Cols>
        <Cols count={4} reveal>
          <Panel>One</Panel>
          <Panel>Two</Panel>
          <Panel>Three</Panel>
          <Panel>Four</Panel>
        </Cols>
      </Container>
    </Section>
  ),
};

export const HeaderAndDivSections: Story = {
  name: "Section as header and div (the article head and body)",
  render: () => (
    <>
      <Section as="header" band>
        <Container>
          <Panel>An article head: a header in a band</Panel>
        </Container>
      </Section>
      <Section as="div">
        <Container>
          <Panel>An article body: a plain div section</Panel>
        </Container>
      </Section>
    </>
  ),
};
