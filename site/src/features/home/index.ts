// Public API of the home feature (PROJECT_STRUCTURE §5). The home route
// (app/page.tsx) composes these; nothing else should reach into ./components.
export { Hero } from "./components/Hero";
export { Statement } from "./components/Statement";
export { TrustRoom } from "./components/TrustRoom";
export { Family } from "./components/Family";
// V3 rooms: the education 40% and the brain-development 20%
export { LearningRoom } from "./components/LearningRoom";
export { BrainRoom } from "./components/BrainRoom";
export { KheeluOrbit } from "./components/KheeluOrbit";
export { LaunchVideo } from "./components/LaunchVideo";
export { Compare } from "./components/Compare";
export { Journal } from "./components/Journal";
export { ParentAppSection } from "./components/ParentAppSection";
