import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { builtinDecoders, cobsDecoder, decodeCobs, efuseDecoder, hexAsciiDecoder } from "./index";
import { buildEfuseFrame } from "@commwatch/proto-core";

describe("decoders", () => {
  it("hexAsciiDecoder returns hex", () => {
    const data = new Uint8Array([0x41, 0x42]);
    const result = hexAsciiDecoder.parse(data);
    assert.equal(result.success, true);
    assert.match(result.data?.hex ?? "", /41/);
  });

  it("cobsDecoder decodes simple payload", () => {
    const encoded = new Uint8Array([3, 65, 66, 1]);
    const result = cobsDecoder.parse(encoded);
    assert.equal(result.success, true);
    assert.deepEqual(result.data, new Uint8Array([65, 66, 0]));
  });

  it("decodeCobs throws on invalid input", () => {
    assert.throws(() => decodeCobs(new Uint8Array([0])));
  });

  it("efuseDecoder parses frame", () => {
    const frame = buildEfuseFrame({ type: 0x01, payload: new Uint8Array([0x10]) });
    const result = efuseDecoder.parse(frame);
    assert.equal(result.success, true);
    assert.deepEqual(result.data?.payload, new Uint8Array([0x10]));
  });

  it("exports builtin decoders", () => {
    assert.ok(builtinDecoders.length >= 3);
  });
});
