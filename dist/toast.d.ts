import type { PluginInput } from "@opencode-ai/plugin";
export type ToastVariant = "info" | "success" | "warning" | "error";
/**
 * Create a toast helper bound to a specific plugin.
 * Silently handles all errors — never breaks plugin operation on UI failure.
 *
 * @example
 * ```ts
 * const toast = createToast(client, "Brain 🧠");
 * toast("Indexed 42 files", "success");
 * toast("Ingest failed", "error");
 * ```
 */
export declare function createToast(client: PluginInput["client"], defaultTitle: string): (message: string, variant?: ToastVariant, title?: string) => void;
