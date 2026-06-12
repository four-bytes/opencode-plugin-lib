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
     * Connect to the plugin bus. Auto-starts the bus binary if not running.
     * @param timeoutMs — Max time to wait for bus to start (default 5000ms)
     */
    static connect(timeoutMs?: number): Promise<BusClient>;
    /**
     * Spawn the bus binary and read the port from stdout.
     */
    private static startBus;
    /**
     * Check if bus at given port is healthy.
     */
    private static checkHealth;
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
