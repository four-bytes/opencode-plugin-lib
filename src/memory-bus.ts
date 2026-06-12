import { EventBus } from "./event-bus.js";
import type { BusEnvelope, BusCallback, Unsubscribe } from "./types.js";

/**
 * In-memory fallback for BusClient and BusTui.
 * Uses the existing EventBus as a shared singleton.
 * Works within the same process only — no cross-process IPC.
 *
 * Wildcard patterns (`+`) are NOT supported — only exact channel match.
 * Use the real Go bus for cross-process and wildcard subscriptions.
 */
class MemoryBus {
  private static instance: MemoryBus | null = null;
  private bus: EventBus;

  private constructor() {
    this.bus = new EventBus();
  }

  static getInstance(): MemoryBus {
    if (!MemoryBus.instance) {
      MemoryBus.instance = new MemoryBus();
    }
    return MemoryBus.instance;
  }

  publish(channel: string, payload: unknown): void {
    const envelope: BusEnvelope = {
      channel,
      payload,
      ts: Date.now(),
    };
    this.bus.emit(channel, envelope);
  }

  subscribe(pattern: string, callback: BusCallback): Unsubscribe {
    // Simple exact-match (no wildcards in memory fallback).
    // The listener is registered on EventBus with the exact pattern string.
    // It only fires when emit() is called with the same channel name.
    // The matchPattern check is defensive for consistency.
    const listener = (data: BusEnvelope) => {
      if (matchPattern(pattern, data.channel)) {
        callback(data);
      }
    };
    return this.bus.on(pattern, listener);
  }

  clear(): void {
    this.bus.clear();
  }
}

/**
 * Match a channel name against a pattern.
 * `+` matches exactly one path segment.
 * NOTE: In the memory fallback, this only works for exact patterns
 * because EventBus uses exact event-name matching. Cross-process
 * wildcard matching requires the real Go bus.
 */
function matchPattern(pattern: string, channel: string): boolean {
  const patSegs = pattern.split("/");
  const chanSegs = channel.split("/");

  if (patSegs.length !== chanSegs.length) return false;

  for (let i = 0; i < patSegs.length; i++) {
    if (patSegs[i] === "+") continue;
    if (patSegs[i].toLowerCase() !== chanSegs[i].toLowerCase()) return false;
  }
  return true;
}

export const memoryBus = MemoryBus.getInstance();
