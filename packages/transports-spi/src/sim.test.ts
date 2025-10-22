import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SpiSimulatorAdapter } from "./sim";

describe("SpiSimulatorAdapter", () => {
  it("replays scripted transactions", async () => {
    const adapter = new SpiSimulatorAdapter();
    const handle = await adapter.open({ id: "sim" }, { clockHz: 1_000_000 });
    handle.defineScript([
      { write: new Uint8Array([0x9a, 0xbc]), readLength: 2 }
    ]);
    const received: Uint8Array[] = [];
    const unsub = handle.read((chunk) => received.push(chunk));
    await handle.write(new Uint8Array([0xde, 0xad]));
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.deepEqual(received[0], new Uint8Array([0xde, 0xad]));
    unsub();
    await handle.close();
  });
});
