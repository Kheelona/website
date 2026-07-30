// Public API of the home feature (PROJECT_STRUCTURE §5). The home route
// (app/page.tsx) composes these; nothing else should reach into ./components.
// V4 (team feedback 2026-07-30): Statement, LaunchVideo, LearningRoom and
// BrainRoom retired with their rooms — the audio room and the How-It-Works
// loop absorbed their jobs (BUILD-V4 §3).
export { Hero } from "./components/Hero";
export { TrustRoom } from "./components/TrustRoom";
export { Family } from "./components/Family";
export { KheeluOrbit } from "./components/KheeluOrbit";
export { Compare } from "./components/Compare";
export { Journal } from "./components/Journal";
export { ParentAppSection } from "./components/ParentAppSection";
