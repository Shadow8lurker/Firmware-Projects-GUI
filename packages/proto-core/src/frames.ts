import { crc16CcittFalse } from "./crc";

export interface EfuseFrame {
  type: number;
  payload: Uint8Array;
}

export function buildEfuseFrame(frame: EfuseFrame): Uint8Array {
  const header = new Uint8Array([0xaa, frame.type & 0xff, frame.payload.length & 0xff]);
  const body = new Uint8Array(header.length + frame.payload.length);
  body.set(header, 0);
  body.set(frame.payload, header.length);
  const crc = crc16CcittFalse(body);
  const result = new Uint8Array(body.length + 4);
  result[0] = 0xaa;
  result.set(body.subarray(1), 1);
  result.set([frame.payload.length & 0xff], 2);
  result.set(frame.payload, 3);
  result[result.length - 3] = (crc >> 8) & 0xff;
  result[result.length - 2] = crc & 0xff;
  result[result.length - 1] = 0xbb;
  return result;
}

export interface EfuseParseResult {
  frame?: EfuseFrame;
  error?: string;
  crc?: number;
}

export function parseEfuseFrame(data: Uint8Array): EfuseParseResult {
  if (data.length < 6) {
    return { error: "Frame too short" };
  }
  if (data[0] !== 0xaa || data[data.length - 1] !== 0xbb) {
    return { error: "Invalid frame delimiters" };
  }
  const type = data[1];
  const length = data[2];
  const payload = data.slice(3, 3 + length);
  if (payload.length !== length) {
    return { error: "Length mismatch" };
  }
  const crc = (data[data.length - 3] << 8) | data[data.length - 2];
  const computed = crc16CcittFalse(data.slice(0, data.length - 3));
  if (crc !== computed) {
    return { error: "CRC mismatch", crc: computed };
  }
  return { frame: { type, payload }, crc };
}
