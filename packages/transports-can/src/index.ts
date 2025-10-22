import { globalBus } from "@commwatch/proto-core";
import type {
  AdapterHandle,
  AdapterOpenOptions,
  DeviceInfo,
  RxMeta,
  TransportAdapter
} from "@commwatch/proto-core";

interface CanFrame {
  id: number;
  data: Uint8Array;
  extended: boolean;
}

class CanSimulationHandle implements AdapterHandle {
  private listeners: Array<(chunk: Uint8Array, meta?: RxMeta) => void> = [];
  private timer?: NodeJS.Timeout;

  constructor(private readonly device: DeviceInfo, private readonly options: AdapterOpenOptions) {}

  async write(frame: Uint8Array): Promise<void> {
    const meta: RxMeta = {
      direction: "tx",
      protocol: "can",
      timestamp: Date.now(),
      annotations: ["candump"],
      error: undefined
    };
    this.listeners.forEach((listener) => listener(frame, meta));
  }

  private startFeed() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const fake: CanFrame = {
        id: Math.floor(Math.random() * 0x7ff),
        data: Uint8Array.from({ length: 8 }, () => Math.floor(Math.random() * 256)),
        extended: Math.random() > 0.5
      };
      const payload = new Uint8Array(13);
      payload[0] = fake.extended ? 1 : 0;
      payload[1] = (fake.id >> 8) & 0xff;
      payload[2] = fake.id & 0xff;
      payload[3] = fake.data.length;
      payload.set(fake.data, 5);
      const meta: RxMeta = {
        direction: "rx",
        protocol: "can",
        timestamp: Date.now(),
        annotations: [
          `id=0x${fake.id.toString(16)}`,
          fake.extended ? "ext" : "std",
          `bitrate=${this.options.bitrate ?? 500000}`
        ]
      };
      this.listeners.forEach((listener) => listener(payload, meta));
    }, 50);
  }

  read(cb: (chunk: Uint8Array, meta?: RxMeta) => void) {
    this.listeners.push(cb);
    this.startFeed();
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== cb);
      if (!this.listeners.length && this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    };
  }

  async setOptions(opts: Partial<AdapterOpenOptions>): Promise<void> {
    Object.assign(this.options, opts);
  }

  async close(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.listeners = [];
  }
}

class CanSimulationAdapter implements TransportAdapter {
  id = "can" as const;

  async listDevices(): Promise<DeviceInfo[]> {
    return [
      { id: "can-vcan0", name: "SocketCAN vcan0", path: "vcan0" },
      { id: "can-sim", name: "Simulated CAN-FD", path: "SIM::CAN" }
    ];
  }

  async open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle> {
    globalBus.emit("log", { level: "info", message: `Opening CAN interface ${device.name}` });
    return new CanSimulationHandle(device, options);
  }
}

export const canTransport = new CanSimulationAdapter();
