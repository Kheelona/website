import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { POSTHOG_HOSTS, POSTHOG_REPLAY_DENY_PATHS, replayAllowedOnPath } from "@/config/site";
import { PostHogGate } from "./PostHogGate";
import { shouldLoadPostHog } from "@/config/site";

/** Renders nothing by design, so the story documents the two decisions instead
 *  of a surface: which hosts run PostHog at all, and which routes are withheld
 *  from session replay. In Storybook the hostname is localhost, so the gate is
 *  shut and the component below correctly outputs nothing — and, because the
 *  import is dynamic and happens only after that check, the SDK is never even
 *  downloaded here. */
const meta = {
  title: "Molecules/PostHogGate",
  component: PostHogGate,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Loads PostHog on production hosts only, after hydration so it never competes " +
          "with the hero LCP. Product analytics, session replay and error tracking, with " +
          "autocapture on. Session replay is started and stopped per route, because the " +
          "confirmation page prints a parent's address back to them.",
      },
    },
  },
} satisfies Meta<typeof PostHogGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TheHostGate: Story = {
  render: () => {
    const cases = [
      "kheelona.com",
      "www.kheelona.com",
      "store.kheelona.com",
      "localhost",
      "website-hdn2.vercel.app",
      "kheelona.ai",
    ];
    return (
      <div className="max-w-md p-4 text-sm">
        <p className="mb-3">Allowed on {POSTHOG_HOSTS.join(", ")}.</p>
        <ul className="space-y-1">
          {cases.map((h) => (
            <li key={h}>
              <code>{h}</code> {shouldLoadPostHog(h) ? "loads PostHog" : "loads nothing"}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Session replay bills per recording and autocapture bills per event, so an ungated
          preview deploy would spend the PostHog quota on our own QA runs.
        </p>
        <PostHogGate />
      </div>
    );
  },
};

export const TheReplayDenyList: Story = {
  render: () => {
    const routes = [
      "/",
      "/products/kheelu",
      "/store",
      "/store/ideabaaz",
      "/store/thanks",
      "/store/thanks/receipt",
    ];
    return (
      <div className="max-w-md p-4 text-sm">
        <p className="mb-3">
          Replay is withheld from {POSTHOG_REPLAY_DENY_PATHS.join(", ")} and everything
          nested under it.
        </p>
        <ul className="space-y-1">
          {routes.map((r) => (
            <li key={r}>
              <code>{r}</code> {replayAllowedOnPath(r) ? "records" : "does not record"}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          The confirmation page prints a parent&rsquo;s email, order number and delivery
          address back to them as text, and a recording is a continuous screenshot. Masking
          inputs does not help, because that covers what they type rather than what we print.
        </p>
      </div>
    );
  },
};
