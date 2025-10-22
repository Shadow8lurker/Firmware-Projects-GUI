import { parseEfuseFrame } from "@commwatch/proto-core";
import type { DecoderDefinition } from "@commwatch/proto-core";

export interface HexAsciiResult {
  hex: string;
  ascii: string;
}

export const hexAsciiDecoder: DecoderDefinition<HexAsciiResult> = {
  id: "hex-ascii",
  name: "Hex & ASCII",
  parse(frame) {
    const hex = Array.from(frame)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ");
    const ascii = new TextDecoder().decode(frame);
    return { success: true, data: { hex, ascii }, raw: frame };
  },
};

export function decodeCobs(frame: Uint8Array): Uint8Array {
  const output: number[] = [];
  let index = 0;
  while (index < frame.length) {
    const code = frame[index++];
    if (code === 0) {
      throw new Error("Invalid COBS code 0");
    }
    for (let i = 1; i < code; i++) {
      if (index >= frame.length) {
        throw new Error("Unexpected end of frame");
      }
      output.push(frame[index++]);
    }
    if (code < 0xff && index < frame.length) {
      output.push(0);
    }
  }
  return new Uint8Array(output);
}

export const cobsDecoder: DecoderDefinition<Uint8Array> = {
  id: "cobs",
  name: "COBS",
  parse(frame) {
    try {
      const decoded = decodeCobs(frame);
      return { success: true, data: decoded, raw: frame };
    } catch (error) {
      return { success: false, error: (error as Error).message, raw: frame };
    }
  },
};

export interface EfuseDecodedPayload {
  type: number;
  payload: Uint8Array;
}

export const efuseDecoder: DecoderDefinition<EfuseDecodedPayload> = {
  id: "efuse",
  name: "EFuse Frame",
  parse(frame) {
    const result = parseEfuseFrame(frame);
    if (!result.frame) {
      return { success: false, error: result.error ?? "Unknown error", raw: frame };
    }
    return { success: true, data: result.frame, raw: frame };
  },
};

export const builtinDecoders = [hexAsciiDecoder, cobsDecoder, efuseDecoder];
