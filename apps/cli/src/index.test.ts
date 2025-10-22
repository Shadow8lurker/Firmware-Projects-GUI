import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { listDecoders, record, replay } from "./index";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("cli module", () => {
  it("lists built-in decoders", () => {
    const decoders = listDecoders();
    assert.ok(decoders.some((decoder) => decoder.id === "efuse"));
  });

  it("records and replays simulated frames", async () => {
    const file = join(tmpdir(), `commwatch-test-${Date.now()}.json`);
    await record("uart", file);
    const contents = JSON.parse(await fs.readFile(file, "utf-8")) as { frames: any[] };
    assert.ok(contents.frames.length > 0);
    await replay("uart", file);
  });
});
