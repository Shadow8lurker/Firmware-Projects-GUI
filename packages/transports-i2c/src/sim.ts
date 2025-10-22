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

interface I2cOptions extends AdapterOpenOptions {
  busSpeed?: number;
}

type Transaction = { address: number; write?: Uint8Array; readLength?: number };

class SimulatedI2cHandle implements AdapterHandle {
  private emitter = new SimpleEmitter();
  private transactions: Transaction[] = [];

  configureScript(transactions: Transaction[]): void {
    this.transactions = transactions;
  }

  async write(frame: Uint8Array): Promise<void> {
    const next = this.transactions.shift();
    const response = next?.readLength ? frame.slice(0, next.readLength) : new Uint8Array(frame);
    setTimeout(() => {
      this.emitter.emit(response, { timestamp: Date.now(), sequence: Date.now(), transport: "i2c" });
    }, 1);
  }

  read(cb: (chunk: Uint8Array, meta?: any) => void): () => void {
    this.emitter.on(cb);
    return () => this.emitter.off(cb);
  }

  async setOptions(_opts: Partial<I2cOptions>): Promise<void> {}

  async close(): Promise<void> {
    this.emitter.removeAll();
  }
}

export class I2cSimulatorAdapter implements TransportAdapter {
  readonly id = "i2c";
  async listDevices(): Promise<DeviceInfo[]> {
    return [{ id: "i2c-sim", label: "Simulated I2C" }];
  }
  async open(_dev: DeviceInfo, _options: I2cOptions): Promise<SimulatedI2cHandle> {
    return new SimulatedI2cHandle();
  }
  createSimulator(): AdapterHandle {
    return new SimulatedI2cHandle();
  }
}
