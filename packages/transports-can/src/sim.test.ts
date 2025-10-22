import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CanSimulatorAdapter } from "./sim";

describe("CanSimulatorAdapter", () => {
  it("yields metadata", async () => {
    const adapter = new CanSimulatorAdapter();
    const handle = await adapter.open({ id: "sim" }, { bitrate: 500_000 });
    const metaList: any[] = [];
    const unsub = handle.read((_chunk, meta) => metaList.push(meta));
    await handle.write(new Uint8Array([0x12, 0x34]));
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(metaList[0].canId, 0x12);
    unsub();
    await handle.close();
  });
});
