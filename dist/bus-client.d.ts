/**
 * Server-side client for the plugin bus.
 * Plugins import BusClient, publish messages via HTTP POST.
 *
 * Usage:
 *   const bus = await BusClient.connect();
 *   await bus.publish("tbg/status", { cumulative: 1234 });
 */
export declare class BusClient {
    private port;
    private baseUrl;
    private constructor();
    /**
     * Connect to the plugin bus.
     * Reads the port discovery file and verifies the bus is healthy.
     * If bus is not running, attempts to auto-start it.
     */
    static connect(timeoutMs?: number): Promise<BusClient>;
    /**
     * Publish a message to a channel.
     * @param channel — Channel name (e.g., "tbg/ses_abc/status")
     * @param payload — Message payload (any JSON-serializable value)
     */
    publish(channel: string, payload: unknown): Promise<void>;
    /**
     * Check if the bus is healthy.
     */
    healthCheck(): Promise<boolean>;
    /** The port the bus is running on */
    get activePort(): number;
}
