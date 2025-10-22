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

import { type AdapterHandle, type AdapterOpenOptions, type DeviceInfo, type TransportAdapter, type RxMeta } from "@commwatch/proto-core";

interface CanOptions extends AdapterOpenOptions {
  bitrate?: number;
  fd?: boolean;
}

export interface CanFrameMeta extends RxMeta {
  canId: number;
  extended: boolean;
}

class SimulatedCanHandle implements AdapterHandle {
  private emitter = new SimpleEmitter();
  private seq = 0;
  constructor(private options: CanOptions = {}) {}

  async write(frame: Uint8Array): Promise<void> {
    const id = frame[0] ?? 0x123;
    const meta: CanFrameMeta = {
      timestamp: Date.now(),
      sequence: this.seq++,
      transport: "can",
      canId: id,
      extended: id > 0x7ff,
    };
    setTimeout(() => {
      this.emitter.emit(frame, meta);
    }, this.options.bitrate ? Math.max(1, 1_000_000 / this.options.bitrate) : 1);
  }

  read(cb: (chunk: Uint8Array, meta?: CanFrameMeta) => void): () => void {
    this.emitter.on(cb);
    return () => this.emitter.off(cb);
  }

  async setOptions(opts: Partial<CanOptions>): Promise<void> {
    this.options = { ...this.options, ...opts };
  }

  async close(): Promise<void> {
    this.emitter.removeAll();
  }
}

export class CanSimulatorAdapter implements TransportAdapter {
  readonly id = "can";
  async listDevices(): Promise<DeviceInfo[]> {
    return [{ id: "can-sim", label: "Simulated CAN" }];
  }
  async open(_dev: DeviceInfo, options: CanOptions): Promise<SimulatedCanHandle> {
    return new SimulatedCanHandle(options);
  }
  createSimulator(): AdapterHandle {
    return new SimulatedCanHandle();
  }
}
