import { describe, expect, it } from "vitest";
import { useCommWatch } from "../src/state";

describe("useCommWatch", () => {
  it("stores messages", () => {
    const { pushMessage, messages } = useCommWatch.getState();
    pushMessage({
      data: new Uint8Array([1, 2, 3]),
      meta: { direction: "rx", protocol: "uart", timestamp: Date.now() }
    });
    expect(useCommWatch.getState().messages.length).toBe(messages.length + 1);
  });
});
