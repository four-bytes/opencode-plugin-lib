/**
 * Regression test for P1 bug #10:
 *   ScopedBusTui.close() / ScopedBusClient.close() must NOT tear down
 *   the shared parent bus connection.
 *
 * Starts its own Go bus binary so it is hermetic — does not depend on
 * the integration test fixture or any pre-running bus.
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { spawn, type Subprocess } from "bun";
import { unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { BusClient } from "../src/bus-client.js";
import { BusTui } from "../src/bus-tui.js";
import { discoverPort } from "../src/discovery.js";

const BUS_BINARY = join(homedir(), ".local", "bin", "four-local-bus");
const PORT_FILE = join(homedir(), ".cache", "opencode", "plugin-bus", "port.json");

describe("Scoped bus close (P1 bug #10)", () => {
  let busProcess: Subprocess | null = null;

  beforeAll(async () => {
    if (existsSync(PORT_FILE)) {
      unlinkSync(PORT_FILE);
    }
    busProcess = spawn([BUS_BINARY], {
      stdout: "pipe",
      stderr: "pipe",
    });
    await discoverPort(5000);
    await new Promise((r) => setTimeout(r, 200));
  }, 10000);

  afterAll(async () => {
    if (busProcess) {
      busProcess.kill();
      await busProcess.exited;
    }
    if (existsSync(PORT_FILE)) {
      unlinkSync(PORT_FILE);
    }
  });

  it("ScopedBusTui.close() does not close the parent bus", async () => {
    const tui = await BusTui.connect();
    const scopedA = tui.forService("pluginA");
    const scopedB = tui.forService("pluginB");

    const receivedA: unknown[] = [];
    const receivedB: unknown[] = [];
    scopedA.subscribe("status", (msg) => receivedA.push(msg.payload));
    scopedB.subscribe("status", (msg) => receivedB.push(msg.payload));

    await new Promise((r) => setTimeout(r, 200));

    // The bug: this used to call inner.close() and kill the shared bus
    scopedA.close();
    await new Promise((r) => setTimeout(r, 100));

    // scopedB and the parent bus must still receive messages
    const client = await BusClient.connect();
    await client.publish("pluginB/status", { ok: true });
    await new Promise((r) => setTimeout(r, 500));

    expect(receivedB.length).toBe(1);
    expect((receivedB[0] as any).ok).toBe(true);

    tui.close();
  });

  it("ScopedBusClient.close() is a no-op (defense in depth)", async () => {
    const client = await BusClient.connect();
    const scopedC = client.forService("pluginC");

    // Should be safe to call — and must not break the parent
    scopedC.close();

    // Parent client must still work
    await expect(
      client.publish("pluginC/status", { after: "scopedC.close()" }),
    ).resolves.toBeUndefined();
  });

  it("scoped close can be called multiple times safely", async () => {
    const tui = await BusTui.connect();
    const scoped = tui.forService("pluginD");

    // Idempotent — multiple scoped.close() must not compound
    scoped.close();
    scoped.close();
    scoped.close();

    // Parent still healthy
    const client = await BusClient.connect();
    await expect(
      client.publish("pluginD/status", { n: 1 }),
    ).resolves.toBeUndefined();

    tui.close();
  });
});
