const CRC16_POLY = 0x1021;

export function crc16CcittFalse(data: Uint8Array, initial = 0xffff): number {
  let crc = initial;
  for (const byte of data) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ CRC16_POLY) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc & 0xffff;
}

export function appendCrc(frame: Uint8Array): Uint8Array {
  const crc = crc16CcittFalse(frame);
  const result = new Uint8Array(frame.length + 2);
  result.set(frame, 0);
  result[result.length - 2] = (crc >> 8) & 0xff;
  result[result.length - 1] = crc & 0xff;
  return result;
}
