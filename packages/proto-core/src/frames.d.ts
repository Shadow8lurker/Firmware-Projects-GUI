export interface EfuseFrame {
    type: number;
    payload: Uint8Array;
}
export declare function buildEfuseFrame(frame: EfuseFrame): Uint8Array;
export interface EfuseParseResult {
    frame?: EfuseFrame;
    error?: string;
    crc?: number;
}
export declare function parseEfuseFrame(data: Uint8Array): EfuseParseResult;
