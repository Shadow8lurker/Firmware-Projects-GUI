import { globalBus } from "@commwatch/proto-core";
import type {
  AdapterHandle,
  AdapterOpenOptions,
  DeviceInfo,
  RxMeta,
  TransportAdapter
} from "@commwatch/proto-core";

class SimulationHandle implements AdapterHandle {
  private interval?: NodeJS.Timeout;
  private listeners: Array<(chunk: Uint8Array, meta?: RxMeta) => void> = [];

  constructor(private readonly device: DeviceInfo, private readonly options: AdapterOpenOptions) {}

  async write(frame: Uint8Array): Promise<void> {
    const meta: RxMeta = {
      direction: "tx",
      protocol: "uart",
      timestamp: Date.now(),
      annotations: ["simulated"],
      error: undefined
    };
    this.listeners.forEach((cb) => cb(frame, meta));
  }

  read(cb: (chunk: Uint8Array, meta?: RxMeta) => void) {
    this.listeners.push(cb);
    if (!this.interval) {
      this.interval = setInterval(() => {
        const payload = new TextEncoder().encode(
          `UART(${this.device.name}) baud=${this.options.baudRate ?? 115200} ${new Date().toISOString()}`
        );
        const meta: RxMeta = {
          direction: "rx",
          protocol: "uart",
          timestamp: Date.now(),
          annotations: ["heartbeat"],
          error: undefined
        };
        this.listeners.forEach((listener) => listener(payload, meta));
      }, 500);
    }
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== cb);
    };
  }

  async setOptions(opts: Partial<AdapterOpenOptions>): Promise<void> {
    Object.assign(this.options, opts);
  }

  async close(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.listeners = [];
  }
}

class UartSimulationAdapter implements TransportAdapter {
  id = "uart" as const;

  async listDevices(): Promise<DeviceInfo[]> {
    return [
      { id: "sim-uart-1", name: "UART Loopback", path: "SIM::UART1" },
      { id: "sim-uart-2", name: "UART Burst", path: "SIM::UART2" }
    ];
  }

  async open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle> {
    globalBus.emit("log", { level: "info", message: `Opening UART device ${device.name}` });
    return new SimulationHandle(device, { baudRate: 115200, ...options });
  }
}

export const uartTransport = new UartSimulationAdapter();
