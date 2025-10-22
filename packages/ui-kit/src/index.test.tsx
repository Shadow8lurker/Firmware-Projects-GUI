import { describe, expect, it, vi } from "vitest";
import { Monitor, TxBuilder } from "./index";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

const now = Date.now();

describe("Monitor", () => {
  it("renders frames", () => {
    const markup = renderToStaticMarkup(
      <Monitor
        frames={[
          { direction: "rx", data: new Uint8Array([1, 2, 3]), meta: { timestamp: now, sequence: 1, transport: "uart" } },
          { direction: "tx", data: new Uint8Array([4, 5]), meta: { timestamp: now, sequence: 2, transport: "uart" } }
        ]}
      />
    );
    expect(markup).toContain("rx");
    expect(markup).toContain("tx");
  });
});

describe("TxBuilder", () => {
  it("emits parsed payload", () => {
    const onSend = vi.fn();
    const component = (
      <TxBuilder template="aa bb" onSend={onSend} />
    );
    const markup = renderToStaticMarkup(component);
    expect(markup).toContain("aa bb");
    const handler = (component.props as any).onSend as (payload: Uint8Array) => void;
    handler(new Uint8Array([0x10]));
    expect(onSend).toHaveBeenCalledWith(new Uint8Array([0x10]));
  });
});
