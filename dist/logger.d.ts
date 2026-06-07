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
export declare function createJsonlLogger(pluginName: string): (type: string, payload?: Record<string, unknown>) => void;
export type JsonlLogger = ReturnType<typeof createJsonlLogger>;
