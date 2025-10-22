import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createAllSimulators } from "./index";

describe("simulators", () => {
  it("creates handles", () => {
    const handles = createAllSimulators();
    assert.ok(handles.uart);
    assert.equal(typeof handles.uart.write, "function");
  });
});
