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

interface UartOptions extends AdapterOpenOptions {
  baud?: number;
  parity?: "none" | "even" | "odd";
}

class SimulatedUartHandle implements AdapterHandle {
  private emitter = new SimpleEmitter();
  private closed = false;
  async write(frame: Uint8Array): Promise<void> {
    if (this.closed) throw new Error("UART handle closed");
    setTimeout(() => {
      this.emitter.emit(frame, { timestamp: Date.now(), sequence: Date.now(), transport: "uart" });
    }, 2);
  }
  read(cb: (chunk: Uint8Array, meta?: any) => void): () => void {
    this.emitter.on(cb);
    return () => this.emitter.off(cb);
  }
  async setOptions(_opts: Partial<UartOptions>): Promise<void> {}
  async close(): Promise<void> {
    this.closed = true;
    this.emitter.removeAll();
  }
}

export class UartSimulatorAdapter implements TransportAdapter {
  readonly id = "uart";
  async listDevices(): Promise<DeviceInfo[]> {
    return [{ id: "uart-sim", label: "Simulated UART" }];
  }
  async open(_dev: DeviceInfo, _options: AdapterOpenOptions): Promise<AdapterHandle> {
    return new SimulatedUartHandle();
  }
  createSimulator(): AdapterHandle {
    return new SimulatedUartHandle();
  }
}
