import { globalBus } from "@commwatch/proto-core";
import type {
  AdapterHandle,
  AdapterOpenOptions,
  DeviceInfo,
  RxMeta,
  TransportAdapter
} from "@commwatch/proto-core";

class I2cSimulationHandle implements AdapterHandle {
  private listeners: Array<(chunk: Uint8Array, meta?: RxMeta) => void> = [];

  constructor(private readonly device: DeviceInfo, private readonly options: AdapterOpenOptions) {}

  async write(frame: Uint8Array): Promise<void> {
    const meta: RxMeta = {
      direction: "tx",
      protocol: "i2c",
      timestamp: Date.now(),
      annotations: [`addr=0x${(this.options.address ?? 0x42).toString(16)}`],
      error: undefined
    };
    this.listeners.forEach((listener) => listener(frame, meta));
    const response = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
    const rxMeta: RxMeta = {
      direction: "rx",
      protocol: "i2c",
      timestamp: Date.now(),
      annotations: ["simulated-sensor"],
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

class I2cSimulationAdapter implements TransportAdapter {
  id = "i2c" as const;

  async listDevices(): Promise<DeviceInfo[]> {
    return [
      { id: "i2c-sim", name: "I2C Sensor Array", path: "SIM::I2C" }
    ];
  }

  async open(device: DeviceInfo, options: AdapterOpenOptions): Promise<AdapterHandle> {
    globalBus.emit("log", { level: "info", message: `Opening I2C device ${device.name}` });
    return new I2cSimulationHandle(device, options);
  }
}

export const i2cTransport = new I2cSimulationAdapter();
