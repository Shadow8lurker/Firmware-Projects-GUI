import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatBytes, parseHexTemplate, renderMonitor, renderTxBuilder } from "./index";

const now = Date.now();

describe("ui-kit", () => {
  it("formats bytes", () => {
    const text = formatBytes(new Uint8Array([0x41, 0x42]));
    assert.equal(text, "41 42");
  });

  it("parses hex template", () => {
    const data = parseHexTemplate("aa bb cc");
    assert.deepEqual(Array.from(data), [0xaa, 0xbb, 0xcc]);
  });

  it("renders monitor markup", () => {
    const html = renderMonitor([
      { direction: "rx", data: new Uint8Array([1, 2, 3]), meta: { timestamp: now, sequence: 1, transport: "uart" } },
    ]);
    assert.match(html, /rx/);
    assert.match(html, /01 02 03/i);
  });

  it("renders tx builder", () => {
    const html = renderTxBuilder({ template: "aa bb" });
    assert.match(html, /2 bytes/);
  });
});
