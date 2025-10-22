import { globalBus } from "@commwatch/proto-core";
import type {
  AdapterHandle,
  AdapterOpenOptions,
  DeviceInfo,
  RxMeta,
  TransportAdapter
} from "@commwatch/proto-core";

class EthSimulationHandle implements AdapterHandle {
  private listeners: Array<(chunk: Uint8Array, meta?: RxMeta) => void> = [];
  private timer?: NodeJS.Timeout;

  constructor(private readonly device: DeviceInfo, private readonly options: AdapterOpenOptions) {}

  async write(frame: Uint8Array): Promise<void> {
    const meta: RxMeta = {
      direction: "tx",
      protocol: "ethernet",
      timestamp: Date.now(),
      annotations: ["udp"],
      error: undefined
    };
    this.listeners.forEach((listener) => listener(frame, meta));
  }

  private startEcho() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const payload = new TextEncoder().encode(`UDP echo from ${this.device.name} @ ${new Date().toISOString()}`);
      const meta: RxMeta = {
        direction: "rx",
        protocol: "ethernet",
        timestamp: Date.now(),
        annotations: ["udp", `iface=${this.options.interface ?? "loopback"}`]
      };
      this.listeners.forEach((listener) => listener(payload, meta));
    }, 1000);
  }

  read(cb: (chunk: Uint8Array, meta?: RxMeta) => void) {
    this.listeners.push(cb);
    this.startEcho();
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

class EthSimulationAdapter implements TransportAdapter {
  id = "ethernet" as const;

  async listDevices(): Promise<DeviceInfo[]> {
    return [
      { id: "eth-loop", name: "UDP Loopback", path: "lo" }
    ];
  }

  async open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle> {
    globalBus.emit("log", { level: "info", message: `Opening Ethernet interface ${device.name}` });
    return new EthSimulationHandle(device, options);
  }
}

export const ethernetTransport = new EthSimulationAdapter();
