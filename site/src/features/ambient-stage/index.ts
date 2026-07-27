// Public API of the ambient-stage feature (PROJECT_STRUCTURE §5). Routes mount
// <StageGate/>; Stage/LumiInset are exposed for the dormant journey + product
// inset. Internal modules import each other directly, never through this barrel.
export { StageGate } from "./components/StageGate";
export { default as Stage, LumiInset } from "./components/Stage";
