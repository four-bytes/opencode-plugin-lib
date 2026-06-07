// ---------------------------------------------------------------------------
// JSONL debug logger — writes structured events to daily log files
// ---------------------------------------------------------------------------

import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface DebugEvent {
  ts: number;
  type: string;
  [key: string]: unknown;
}

/**
 * Create a JSONL debug logger for an opencode plugin.
 *
 * Writes one JSON line per event to ~/.cache/opencode/<plugin>/debug-YYYY-MM-DD.jsonl.
 * No-op unless CC_DEBUG=true env var is set. Never throws.
 *
 * @example
 * ```ts
 * const log = createJsonlLogger("my-plugin");
 * log("init", { version: "1.0" });
 * log("ingest.done", { filesIndexed: 42 });
 * ```
 */
export function createJsonlLogger(pluginName: string) {
  const cacheDir = join(homedir(), ".cache", "opencode", pluginName);

  function ensureDir(): void {
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
  }

  return function logDebugEvent(
    type: string,
    payload: Record<string, unknown> = {},
  ): void {
    if (process.env.CC_DEBUG !== "true") return;

    try {
      ensureDir();
      const date = new Date().toISOString().split("T")[0];
      const event: DebugEvent = { ts: Date.now(), type, ...payload };
      const line = JSON.stringify(event) + "\n";
      appendFileSync(join(cacheDir, `debug-${date}.jsonl`), line, "utf-8");
    } catch {
      // Silent — never throw from debug logger
    }
  };
}

export type JsonlLogger = ReturnType<typeof createJsonlLogger>;
