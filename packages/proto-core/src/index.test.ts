import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { appendCrc16CcittFalse, buildEfuseFrame, crc16CcittFalse, parseEfuseFrame } from "./index";

const sample = new Uint8Array([0x12, 0x34, 0x56]);

describe("crc16CcittFalse", () => {
  it("computes known value", () => {
    assert.equal(crc16CcittFalse(sample), 0x12f1);
  });
});

describe("appendCrc16CcittFalse", () => {
  it("appends two bytes", () => {
    const appended = appendCrc16CcittFalse(sample);
    assert.equal(appended.length, sample.length + 2);
  });
});

describe("EFuse frame", () => {
  it("builds and parses", () => {
    const frame = buildEfuseFrame({ type: 0x10, payload: new Uint8Array([1, 2, 3]) });
    const parsed = parseEfuseFrame(frame);
    assert.equal(parsed.frame?.type, 0x10);
    assert.deepEqual(parsed.frame?.payload, new Uint8Array([1, 2, 3]));
  });

  it("detects CRC error", () => {
    const frame = buildEfuseFrame({ type: 0x10, payload: new Uint8Array([1]) });
    frame[4] ^= 0xff;
    const parsed = parseEfuseFrame(frame);
    assert.match(parsed.error ?? "", /CRC/);
  });
});
