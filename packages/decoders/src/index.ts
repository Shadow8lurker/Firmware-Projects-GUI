import { parseEfuseFrame } from "@commwatch/proto-core";
import type { FrameDecoder } from "@commwatch/proto-core";

function toHex(data: Uint8Array): string {
  return Array.from(data, (b) => b.toString(16).padStart(2, "0")).join(" ");
}

export const hexDecoder: FrameDecoder = {
  id: "hex",
  label: "Hexadecimal",
  supports: () => true,
  decode(frame: Uint8Array) {
    return {
      summary: `${frame.length} B`,
      fields: [{ name: "hex", value: toHex(frame) }]
    };
  }
};

export const asciiDecoder: FrameDecoder = {
  id: "ascii",
  label: "ASCII",
  supports: () => true,
  decode(frame: Uint8Array) {
    const text = new TextDecoder().decode(frame);
    return {
      summary: `${frame.length} B ASCII`,
      fields: [{ name: "text", value: text }]
    };
  }
};

function cobsDecode(frame: Uint8Array): Uint8Array {
  const result: number[] = [];
  let index = 0;
  while (index < frame.length) {
    const code = frame[index++];
    if (code === 0) throw new Error("Invalid COBS frame");
    for (let i = 1; i < code; i++) {
      if (index >= frame.length) {
        if (i !== code - 1) throw new Error("Malformed COBS frame");
        result.push(0);
        break;
      }
      result.push(frame[index++]);
    }
    if (code < 0xff && index < frame.length) {
      result.push(0);
    }
  }
  return new Uint8Array(result);
}

export const cobsDecoder: FrameDecoder = {
  id: "cobs",
  label: "COBS",
  supports: () => true,
  decode(frame: Uint8Array) {
    try {
      const decoded = cobsDecode(frame);
      return {
        summary: `COBS ${decoded.length} B`,
        fields: [{ name: "decoded", value: toHex(decoded) }]
      };
    } catch (error) {
      return {
        summary: "COBS error",
        fields: [],
        errors: [(error as Error).message]
      };
    }
  }
};

function slipDecode(frame: Uint8Array): Uint8Array {
  const SLIP_END = 0xc0;
  const SLIP_ESC = 0xdb;
  const SLIP_ESC_END = 0xdc;
  const SLIP_ESC_ESC = 0xdd;
  const out: number[] = [];
  let esc = false;
  for (const byte of frame) {
    if (byte === SLIP_END) {
      if (out.length) break;
      continue;
    }
    if (esc) {
      if (byte === SLIP_ESC_END) out.push(SLIP_END);
      else if (byte === SLIP_ESC_ESC) out.push(SLIP_ESC);
      esc = false;
    } else if (byte === SLIP_ESC) {
      esc = true;
    } else {
      out.push(byte);
    }
  }
  return new Uint8Array(out);
}

export const slipDecoder: FrameDecoder = {
  id: "slip",
  label: "SLIP",
  supports: () => true,
  decode(frame: Uint8Array) {
    const decoded = slipDecode(frame);
    return {
      summary: `SLIP ${decoded.length} B`,
      fields: [{ name: "decoded", value: toHex(decoded) }]
    };
  }
};

export const efuseDecoder: FrameDecoder = {
  id: "efuse",
  label: "EFuse Custom",
  supports: () => true,
  decode(frame: Uint8Array) {
    const parsed = parseEfuseFrame(frame);
    const fields = [
      { name: "type", value: parsed.type },
      { name: "length", value: parsed.payload.length },
      { name: "payload", value: toHex(parsed.payload) }
    ];
    return {
      summary: `EFuse type ${parsed.type}`,
      fields,
      errors: parsed.valid ? undefined : [parsed.error ?? "invalid"]
    };
  }
};

export const builtinDecoders: FrameDecoder[] = [hexDecoder, asciiDecoder, cobsDecoder, slipDecoder, efuseDecoder];
