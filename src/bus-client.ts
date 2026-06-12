import { spawn } from "node:child_process";
import { discoverPort } from "./discovery.js";
import type { BusEnvelope, BusHealth } from "./types.js";

const BASE_URL = "http://127.0.0.1";
const BUS_BINARY = "bus"; // must be in PATH (~/.local/bin/bus)

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
   * Connect to the plugin bus. Auto-starts the bus binary if not running.
   * @param timeoutMs — Max time to wait for bus to start (default 5000ms)
   */
  static async connect(timeoutMs = 5000): Promise<BusClient> {
    // 1. Check if bus is already running
    try {
      const port = await discoverPort(500); // quick check — 500ms
      const healthy = await BusClient.checkHealth(port);
      if (healthy) {
        return new BusClient(port);
      }
    } catch {
      // Bus not running — will auto-start below
    }

    // 2. Auto-start the bus binary
    const port = await BusClient.startBus(timeoutMs);
    return new BusClient(port);
  }

  /**
   * Spawn the bus binary and read the port from stdout.
   */
  private static async startBus(timeoutMs: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = spawn(BUS_BINARY, [], {
        stdio: ["ignore", "pipe", "pipe"],
      });

      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`Bus failed to start within ${timeoutMs}ms`));
      }, timeoutMs);

      let resolved = false;

      child.stdout?.on("data", (data: Buffer) => {
        if (resolved) return;
        try {
          const line = data.toString().trim();
          const info = JSON.parse(line);
          if (info.port && info.port > 0) {
            resolved = true;
            clearTimeout(timer);
            // Note: child process stays alive (bus server runs)
            resolve(info.port);
          }
        } catch {
          // Not JSON — wait for next line
        }
      });

      child.stderr?.on("data", (data: Buffer) => {
        // Log stderr but don't fail — Go may print warnings
        console.warn("[BusClient] bus stderr:", data.toString().trim());
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        reject(new Error(`Failed to spawn bus: ${err.message}`));
      });

      child.on("exit", (code) => {
        if (!resolved) {
          clearTimeout(timer);
          reject(new Error(`Bus exited with code ${code} before reporting port`));
        }
      });
    });
  }

  /**
   * Check if bus at given port is healthy.
   */
  private static async checkHealth(port: number): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}:${port}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) return false;
      const health: BusHealth = await response.json();
      return health.status === "ok";
    } catch {
      return false;
    }
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
