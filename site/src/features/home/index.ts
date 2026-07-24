// Public API of the home feature (PROJECT_STRUCTURE §5). The home route
// (app/page.tsx) composes these; nothing else should reach into ./components.
export { Hero } from "./components/Hero";
export { Statement } from "./components/Statement";
export { TrustRoom } from "./components/TrustRoom";
export { Family } from "./components/Family";
export { KheeluOrbit } from "./components/KheeluOrbit";
export { LaunchVideo } from "./components/LaunchVideo";
export { Compare } from "./components/Compare";
export { Journal } from "./components/Journal";
export { ParentAppSection } from "./components/ParentAppSection";
// Retired from the route by the 2026-07 revamp (M2); files delete in M5
// cleanup after the founder approves the preview:
export { KheeluIntro } from "./components/KheeluIntro";
export { WhyWeExist } from "./components/WhyWeExist";
export { Feelings } from "./components/Feelings";
export { MeetLumi } from "./components/MeetLumi";
export { WhatLumiDoes } from "./components/WhatLumiDoes";
export { HowItWorks } from "./components/HowItWorks";
export { SafetyCallout } from "./components/SafetyCallout";
export { SafetyStrip } from "./components/SafetyStrip";
