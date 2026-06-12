import type { BusCallback, Unsubscribe } from "./types.js";
/**
 * In-memory fallback for BusClient and BusTui.
 * Uses the existing EventBus as a shared singleton.
 * Works within the same process only — no cross-process IPC.
 *
 * Wildcard patterns (`+`) are NOT supported — only exact channel match.
 * Use the real Go bus for cross-process and wildcard subscriptions.
 */
declare class MemoryBus {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): MemoryBus;
    publish(channel: string, payload: unknown): void;
    subscribe(pattern: string, callback: BusCallback): Unsubscribe;
    clear(): void;
}
export declare const memoryBus: MemoryBus;
export {};
