import { globalBus } from "@commwatch/proto-core";
import type {
  AdapterHandle,
  AdapterOpenOptions,
  DeviceInfo,
  RxMeta,
  TransportAdapter
} from "@commwatch/proto-core";

class SpiSimulationHandle implements AdapterHandle {
  private listeners: Array<(chunk: Uint8Array, meta?: RxMeta) => void> = [];

  constructor(private readonly device: DeviceInfo, private readonly options: AdapterOpenOptions) {}

  async write(frame: Uint8Array): Promise<void> {
    const meta: RxMeta = {
      direction: "tx",
      protocol: "spi",
      timestamp: Date.now(),
      annotations: ["transaction"],
      error: undefined
    };
    this.listeners.forEach((listener) => listener(frame, meta));
    // simulate immediate response with inverted payload
    const response = frame.map((value) => value ^ 0xff);
    const rxMeta: RxMeta = {
      direction: "rx",
      protocol: "spi",
      timestamp: Date.now(),
      annotations: ["simulated-response"],
      error: undefined
    };
    this.listeners.forEach((listener) => listener(response, rxMeta));
  }

  read(cb: (chunk: Uint8Array, meta?: RxMeta) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== cb);
    };
  }

  async setOptions(opts: Partial<AdapterOpenOptions>): Promise<void> {
    Object.assign(this.options, opts);
  }

  async close(): Promise<void> {
    this.listeners = [];
  }
}

class SpiSimulationAdapter implements TransportAdapter {
  id = "spi" as const;

  async listDevices(): Promise<DeviceInfo[]> {
    return [
      { id: "spi-sim", name: "SPI FT232H Simulation", path: "SIM::SPI" }
    ];
  }

  async open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle> {
    globalBus.emit("log", { level: "info", message: `Opening SPI device ${device.name}` });
    return new SpiSimulationHandle(device, options);
  }
}

export const spiTransport = new SpiSimulationAdapter();
