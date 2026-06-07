// ---------------------------------------------------------------------------
// Throttled, rate-limited plugin logger — compact JSON-compatible output
// ---------------------------------------------------------------------------

export type LogLevel = "debug" | "info" | "warn" | "error";

interface ThrottleState {
  lastCall: number;
  count: number;
}

/**
 * Create a namespaced logger for an opencode plugin.
 *
 * @example
 * ```ts
 * const log = createLogger("my-plugin");
 * log("info", "init", "plugin loaded", { version: "1.0" });
 * ```
 */
export function createLogger(pluginName: string) {
  const throttles = new Map<string, ThrottleState>();
  let silent = false;

  function shouldLog(key: string, intervalMs: number = 60000): boolean {
    const now = Date.now();
    const state = throttles.get(key);
    if (!state || now - state.lastCall > intervalMs) {
      throttles.set(key, { lastCall: now, count: 1 });
      return true;
    }
    state.count++;
    return false;
  }

  function logFn(
    level: LogLevel,
    key: string,
    msg: string,
    data?: Record<string, unknown>,
  ): void {
    if (level === "debug" && process.env.BRAIN_DEBUG !== "true") return;

    if (level === "warn" || level === "info") {
      if (!shouldLog(key, 60000)) return;
    }

    if (silent && level !== "error") return;

    const timestamp = new Date().toISOString();
    const prefix = `[${pluginName}] ${timestamp} ${level.toUpperCase()} ${key}`;
    const payload = data ? ` ${JSON.stringify(data)}` : "";
    const line = `${prefix} ${msg}${payload}`;

    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  }

  logFn.setSilent = (val: boolean): void => { silent = val; };

  return logFn;
}

export type Logger = ReturnType<typeof createLogger>;
