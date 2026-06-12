import { discoverPort } from "./discovery.js";
import type { BusEnvelope, BusHealth } from "./types.js";

const BASE_URL = "http://127.0.0.1";

/**
 * Server-side client for the plugin bus.
 * Plugins import BusClient, publish messages via HTTP POST.
 *
 * Usage:
 *   const bus = await BusClient.connect();
 *   await bus.publish("tbg/status", { cumulative: 1234 });
 */
export class BusClient {
  private port: number;
  private baseUrl: string;

  private constructor(port: number) {
    this.port = port;
    this.baseUrl = `${BASE_URL}:${port}`;
  }

  /**
   * Connect to the plugin bus.
   * Reads the port discovery file and verifies the bus is healthy.
   * If bus is not running, attempts to auto-start it.
   */
  static async connect(timeoutMs = 5000): Promise<BusClient> {
    const port = await discoverPort(timeoutMs);
    const client = new BusClient(port);

    // Verify bus is healthy
    const healthy = await client.healthCheck();
    if (!healthy) {
      throw new Error(`Plugin bus at port ${port} is not healthy`);
    }

    return client;
  }

  /**
   * Publish a message to a channel.
   * @param channel — Channel name (e.g., "tbg/ses_abc/status")
   * @param payload — Message payload (any JSON-serializable value)
   */
  async publish(channel: string, payload: unknown): Promise<void> {
    const envelope: BusEnvelope = {
      channel,
      payload,
      ts: Date.now(),
    };

    const response = await fetch(`${this.baseUrl}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envelope),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Publish failed (${response.status}): ${body}`);
    }
  }

  /**
   * Check if the bus is healthy.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) return false;
      const health: BusHealth = await response.json();
      return health.status === "ok";
    } catch {
      return false;
    }
  }

  /** The port the bus is running on */
  get activePort(): number {
    return this.port;
  }
}
