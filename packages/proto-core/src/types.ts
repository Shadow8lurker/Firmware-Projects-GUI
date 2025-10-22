export type TransportKind = "uart" | "spi" | "i2c" | "can" | "ethernet";

export interface DeviceInfo {
  id: string;
  name: string;
  path?: string;
  meta?: Record<string, unknown>;
}

export interface AdapterOpenOptions {
  baudRate?: number;
  parity?: "none" | "even" | "odd";
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 2;
  flowControl?: "none" | "rtscts";
  timeoutMs?: number;
  mode?: 0 | 1 | 2 | 3;
  clockHz?: number;
  bitOrder?: "msb" | "lsb";
  chipSelectHoldUs?: number;
  address?: number;
  bitrate?: number;
  fd?: boolean;
  filters?: Array<{ id: number; mask?: number }>;
  listenOnly?: boolean;
  interface?: string;
  protocolProfile?: string;
  [key: string]: unknown;
}

export interface RxMeta {
  timestamp: number;
  direction: "rx" | "tx";
  protocol: TransportKind;
  annotations?: string[];
  error?: string;
}

export type Unsubscribe = () => void;

export interface AdapterHandle {
  write(frame: Uint8Array): Promise<void>;
  read(cb: (chunk: Uint8Array, meta?: RxMeta) => void): Unsubscribe;
  setOptions(opts: Partial<AdapterOpenOptions>): Promise<void>;
  close(): Promise<void>;
}

export interface TransportAdapter {
  id: TransportKind;
  listDevices(): Promise<DeviceInfo[]>;
  open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle>;
}

export interface FrameRecord {
  meta: RxMeta;
  data: Uint8Array;
}

export interface FrameDecoder {
  id: string;
  label: string;
  supports(protocol: TransportKind): boolean;
  decode(frame: Uint8Array): DecodedFrame;
}

export interface DecodedField {
  name: string;
  value: string | number | boolean;
  raw?: string;
  unit?: string;
}

export interface DecodedFrame {
  summary: string;
  fields: DecodedField[];
  errors?: string[];
}

export interface PipelineStage {
  id: string;
  handle(record: FrameRecord): FrameRecord | void | Promise<FrameRecord | void>;
}

export interface MessageBusEventMap {
  "transport:data": FrameRecord;
  "transport:error": { error: Error; transport: TransportKind };
  "log": { level: "info" | "warn" | "error"; message: string };
}
