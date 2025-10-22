import { describe, expect, it } from "vitest";
import { appendCrc, crc16CcittFalse } from "../src/crc";

describe("crc16CcittFalse", () => {
  it("computes known value", () => {
    const bytes = new TextEncoder().encode("123456789");
    expect(crc16CcittFalse(bytes)).toBe(0x29b1);
  });

  it("appends crc bytes", () => {
    const frame = new Uint8Array([0x01, 0x02, 0x03]);
    const withCrc = appendCrc(frame);
    expect(withCrc).toHaveLength(5);
  });
});
