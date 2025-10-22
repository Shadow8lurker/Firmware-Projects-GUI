/** CRC-16/CCITT-FALSE implementation */
export function crc16CcittFalse(data, seed = 0xffff) {
    let crc = seed;
    for (const byte of data) {
        crc ^= byte << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            }
            else {
                crc <<= 1;
            }
            crc &= 0xffff;
        }
    }
    return crc & 0xffff;
}
export function appendCrc16CcittFalse(payload) {
    const crc = crc16CcittFalse(payload);
    const extended = new Uint8Array(payload.length + 2);
    extended.set(payload, 0);
    extended[extended.length - 2] = (crc >> 8) & 0xff;
    extended[extended.length - 1] = crc & 0xff;
    return extended;
}
//# sourceMappingURL=crc.js.map