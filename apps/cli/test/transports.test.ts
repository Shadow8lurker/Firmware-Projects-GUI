import { describe, expect, it } from "vitest";
import { uartTransport } from "@commwatch/transports-uart";

describe("cli transports", () => {
  it("lists uart devices", async () => {
    const devices = await uartTransport.listDevices();
    expect(devices.length).toBeGreaterThan(0);
  });
});
