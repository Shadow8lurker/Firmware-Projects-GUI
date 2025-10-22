import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EthernetSimulatorAdapter } from "./sim";

describe("EthernetSimulatorAdapter", () => {
  it("echoes frames", async () => {
    const adapter = new EthernetSimulatorAdapter();
    const handle = await adapter.open({ id: "sim" }, { protocol: "udp" });
    const rx: Uint8Array[] = [];
    const unsub = handle.read((chunk) => rx.push(chunk));
    const payload = new Uint8Array([0xaa, 0xbb]);
    await handle.write(payload);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.deepEqual(rx[0], payload);
    unsub();
    await handle.close();
  });
});
