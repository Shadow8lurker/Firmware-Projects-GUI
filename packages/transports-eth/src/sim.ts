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

interface EthernetOptions extends AdapterOpenOptions {
  protocol?: "udp" | "tcp";
}

class SimulatedEthernetHandle implements AdapterHandle {
  private emitter = new SimpleEmitter();
  constructor(private options: EthernetOptions = {}) {}

  async write(frame: Uint8Array): Promise<void> {
    const latency = this.options.protocol === "tcp" ? 5 : 2;
    setTimeout(() => {
      this.emitter.emit(frame, { timestamp: Date.now(), sequence: Date.now(), transport: "ethernet" });
    }, latency);
  }

  read(cb: (chunk: Uint8Array, meta?: any) => void): () => void {
    this.emitter.on(cb);
    return () => this.emitter.off(cb);
  }

  async setOptions(opts: Partial<EthernetOptions>): Promise<void> {
    this.options = { ...this.options, ...opts };
  }

  async close(): Promise<void> {
    this.emitter.removeAll();
  }
}

export class EthernetSimulatorAdapter implements TransportAdapter {
  readonly id = "ethernet";
  async listDevices(): Promise<DeviceInfo[]> {
    return [{ id: "eth-sim", label: "Simulated Ethernet" }];
  }
  async open(_dev: DeviceInfo, options: EthernetOptions): Promise<SimulatedEthernetHandle> {
    return new SimulatedEthernetHandle(options);
  }
  createSimulator(): AdapterHandle {
    return new SimulatedEthernetHandle();
  }
}
