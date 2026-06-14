import type { BusCallback, Unsubscribe } from "./types.js";
/**
 * TUI-side client for the plugin bus. Connects via WebSocket, subscribes to
 * channels, receives real-time messages. Throws on `connect()` if the Go bus
 * is not available — use `new MemoryBusTui()` explicitly for in-process mode.
 *
 * Usage:
 *   const bus = await BusTui.connect();
 *   const unsub = bus.subscribe("tbg/+/status", (msg) => {
 *     console.log(msg.channel, msg.payload);
 *   });
 *   // Later: unsub(); or bus.close();
 */
export declare class BusTui {
    protected port: number;
    private ws;
    private subs;
    private reconnectTimer;
    private reconnectDelay;
    private maxReconnectDelay;
    private closed;
    protected constructor(port: number);
    /**
     * Connect to the plugin bus via WebSocket. Throws if the Go bus is not available.
     */
    static connect(timeoutMs?: number): Promise<BusTui>;
    /**
     * Subscribe to a channel pattern. Callback fires on each matching message.
     * Returns an unsubscribe function.
     *
     * @param pattern — Channel pattern (e.g., "tbg/+/status", "brain/embed")
     * @param callback — Called with each message matching the pattern
     */
    subscribe(pattern: string, callback: BusCallback): Unsubscribe;
    /**
     * Publish a message back to the bus (bidirectional).
     */
    publish(channel: string, payload: unknown): void;
    /**
     * Close the WebSocket connection and stop reconnecting.
     */
    close(): void;
    /** Returns a scoped TUI bus that prefixes all channels with {service}/ */
    forService(name: string): BusTui;
    /** Returns a scoped TUI bus that prefixes all channels with {sessionId}/ */
    forSession(id: string): BusTui;
    private open;
    private scheduleReconnect;
    private updateSubscriptions;
}
