export type TransportId = "uart" | "spi" | "i2c" | "can" | "ethernet" | string;
export interface DeviceInfo {
    id: string;
    label?: string;
    vendorId?: string;
    productId?: string;
    extra?: Record<string, unknown>;
}
export interface AdapterOpenOptions {
    [key: string]: unknown;
}
export interface RxMeta {
    timestamp: number;
    sequence: number;
    transport: TransportId;
    status?: "ok" | "crc-error" | "length-error" | "transport-error";
    tags?: string[];
    errorDetails?: string;
}
export interface TransportAdapter {
    id: TransportId;
    listDevices(): Promise<DeviceInfo[]>;
    open(dev: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle>;
    createSimulator?(): AdapterHandle;
}
export interface AdapterHandle {
    write(frame: Uint8Array): Promise<void>;
    read(cb: (chunk: Uint8Array, meta?: RxMeta) => void): () => void;
    setOptions(opts: Partial<AdapterOpenOptions>): Promise<void>;
    close(): Promise<void>;
}
export interface DecoderDefinition<T = unknown> {
    id: string;
    name: string;
    description?: string;
    parse(frame: Uint8Array): DecoderResult<T>;
}
export interface DecoderResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    raw: Uint8Array;
}
export interface MessageBusEventMap {
    "rx:frame": {
        payload: Uint8Array;
        meta?: RxMeta;
    };
    "tx:frame": {
        payload: Uint8Array;
        transport: TransportId;
    };
    "log": {
        level: "info" | "warn" | "error";
        message: string;
        context?: unknown;
    };
}
export type MessageBusEvent = keyof MessageBusEventMap;
