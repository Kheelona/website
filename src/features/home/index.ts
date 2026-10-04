// Public API of the home feature (PROJECT_STRUCTURE §5). The home route
// (app/page.tsx) composes these; nothing else should reach into ./components.
// V4 (team feedback 2026-07-30): Statement, LaunchVideo, LearningRoom and
// BrainRoom retired with their rooms. CMO merge (2026-10-04): Family moved to
// the Kheelu page, KheeluOrbit and ParentAppSection retired; TrustStrip,
// HowItWorks, AgeTabs, TwoReasons, PriceRoom and TeamStrip joined.
export { Hero } from "./components/Hero";
export { TrustStrip } from "./components/TrustStrip";
export { HowItWorks } from "./components/HowItWorks";
export { TrustRoom } from "./components/TrustRoom";
export { Compare } from "./components/Compare";
export { TwoReasons } from "./components/TwoReasons";
export { PriceRoom } from "./components/PriceRoom";
export { TeamStrip } from "./components/TeamStrip";
export { Journal } from "./components/Journal";
