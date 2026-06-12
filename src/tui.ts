// Bus client — TUI entry point (P17b)
export { BusTui } from "./bus-tui.js";
export { discoverPort } from "./discovery.js";
export type {
  BusEnvelope,
  BusHealth,
  PortInfo,
  BusCallback,
  Unsubscribe,
} from "./types.js";
