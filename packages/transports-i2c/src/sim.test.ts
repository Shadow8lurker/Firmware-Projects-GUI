import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { I2cSimulatorAdapter } from "./sim";

describe("I2cSimulatorAdapter", () => {
  it("provides scripted response", async () => {
    const adapter = new I2cSimulatorAdapter();
    const handle = await adapter.open({ id: "sim" }, {});
    handle.configureScript([
      { address: 0x48, readLength: 2 }
    ]);
    const rx: Uint8Array[] = [];
    const unsub = handle.read((chunk) => rx.push(chunk));
    await handle.write(new Uint8Array([0x00, 0x01]));
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.deepEqual(rx[0], new Uint8Array([0x00, 0x01]));
    unsub();
    await handle.close();
  });
});
