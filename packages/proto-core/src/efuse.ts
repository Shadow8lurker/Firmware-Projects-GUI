import { crc16CcittFalse } from "./crc";

export interface EfuseFrame {
  type: number;
  payload: Uint8Array;
}

export const EFUSE_START = 0xaa;
export const EFUSE_END = 0xbb;

export function buildEfuseFrame(frame: EfuseFrame): Uint8Array {
  const header = new Uint8Array([EFUSE_START, frame.type & 0xff, frame.payload.length & 0xff]);
  const body = new Uint8Array([...header, ...frame.payload]);
  const crc = crc16CcittFalse(body);
  const result = new Uint8Array(body.length + 4);
  result.set(body, 0);
  result[result.length - 4] = (crc >> 8) & 0xff;
  result[result.length - 3] = crc & 0xff;
  result[result.length - 2] = EFUSE_END;
  result[result.length - 1] = 0x00; // reserved padding for alignment
  return result;
}

export function parseEfuseFrame(bytes: Uint8Array): EfuseFrame & { valid: boolean; error?: string } {
  if (bytes.length < 6) {
    return { type: 0, payload: new Uint8Array(), valid: false, error: "Frame too short" };
  }
  if (bytes[0] !== EFUSE_START) {
    return { type: 0, payload: new Uint8Array(), valid: false, error: "Missing start delimiter" };
  }
  const type = bytes[1];
  const length = bytes[2];
  const expectedEnd = bytes[bytes.length - 2];
  if (expectedEnd !== EFUSE_END) {
    return { type, payload: new Uint8Array(), valid: false, error: "Missing end delimiter" };
  }
  const payload = bytes.slice(3, 3 + length);
  const crcHigh = bytes[bytes.length - 4];
  const crcLow = bytes[bytes.length - 3];
  const crcValue = (crcHigh << 8) | crcLow;
  const computed = crc16CcittFalse(bytes.slice(0, bytes.length - 4));
  const valid = crcValue === computed;
  return { type, payload, valid, error: valid ? undefined : `CRC mismatch expected ${crcValue.toString(16)} got ${computed.toString(16)}` };
}
