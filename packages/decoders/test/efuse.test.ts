import { describe, expect, it } from "vitest";
import { efuseDecoder } from "../src";
import { buildEfuseFrame } from "@commwatch/proto-core";

describe("efuseDecoder", () => {
  it("decodes valid frames", () => {
    const payload = new Uint8Array([0x10, 0x20, 0x30]);
    const frame = buildEfuseFrame({ type: 0x01, payload });
    const decoded = efuseDecoder.decode(frame);
    expect(decoded.summary).toContain("type 1");
    expect(decoded.errors).toBeUndefined();
  });
});
