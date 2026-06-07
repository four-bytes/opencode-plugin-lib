export type LogLevel = "debug" | "info" | "warn" | "error";
/**
 * Create a namespaced logger for an opencode plugin.
 *
 * @example
 * ```ts
 * const log = createLogger("my-plugin");
 * log("info", "init", "plugin loaded", { version: "1.0" });
 * ```
 */
export declare function createLogger(pluginName: string): {
    (level: LogLevel, key: string, msg: string, data?: Record<string, unknown>): void;
    setSilent(val: boolean): void;
};
export type Logger = ReturnType<typeof createLogger>;
