import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UartSimulatorAdapter } from "./sim";

describe("UartSimulatorAdapter", () => {
  it("echoes writes", async () => {
    const adapter = new UartSimulatorAdapter();
    const handle = await adapter.open({ id: "sim" }, {});
    const received: Uint8Array[] = [];
    const unsubscribe = handle.read((chunk) => {
      received.push(chunk);
    });
    const payload = new Uint8Array([1, 2, 3]);
    await handle.write(payload);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(received.length, 1);
    assert.deepEqual(received[0], payload);
    unsubscribe();
    await handle.close();
  });
});
