type Listener = (chunk: Uint8Array, meta?: any) => void;

class SimpleEmitter {
  private listeners = new Set<Listener>();
  on(listener: Listener) {
    this.listeners.add(listener);
  }
  off(listener: Listener) {
    this.listeners.delete(listener);
  }
  emit(chunk: Uint8Array, meta?: any) {
    for (const listener of this.listeners) {
      listener(chunk, meta);
    }
  }
  removeAll() {
    this.listeners.clear();
  }
}

import { type AdapterHandle, type AdapterOpenOptions, type DeviceInfo, type TransportAdapter } from "@commwatch/proto-core";

interface SpiOptions extends AdapterOpenOptions {
  mode?: 0 | 1 | 2 | 3;
  clockHz?: number;
}

type Transaction = { write: Uint8Array; readLength: number };

class SimulatedSpiHandle implements AdapterHandle {
  private emitter = new SimpleEmitter();
  private script: Transaction[] = [];
  constructor(private options: SpiOptions = {}) {}

  defineScript(transactions: Transaction[]): void {
    this.script = transactions;
  }

  async write(frame: Uint8Array): Promise<void> {
    const next = this.script.shift();
    const response = next?.readLength ? frame.slice(0, next.readLength) : new Uint8Array(frame);
    setTimeout(() => {
      this.emitter.emit(response, { timestamp: Date.now(), sequence: Date.now(), transport: "spi" });
    }, this.options.clockHz ? Math.min(5, 1000000 / this.options.clockHz) : 2);
  }

  read(cb: (chunk: Uint8Array, meta?: any) => void): () => void {
    this.emitter.on(cb);
    return () => this.emitter.off(cb);
  }

  async setOptions(opts: Partial<SpiOptions>): Promise<void> {
    this.options = { ...this.options, ...opts };
  }

  async close(): Promise<void> {
    this.emitter.removeAll();
  }
}

export class SpiSimulatorAdapter implements TransportAdapter {
  readonly id = "spi";
  async listDevices(): Promise<DeviceInfo[]> {
    return [{ id: "spi-sim", label: "Simulated SPI" }];
  }
  async open(_dev: DeviceInfo, options: SpiOptions): Promise<SimulatedSpiHandle> {
    return new SimulatedSpiHandle(options);
  }
  createSimulator(): AdapterHandle {
    return new SimulatedSpiHandle();
  }
}
