import EventEmitter from "eventemitter3";
import type { MessageBusEventMap } from "./types";

export class MessageBus {
  private readonly emitter = new EventEmitter();

  on<K extends keyof MessageBusEventMap>(
    event: K,
    listener: (payload: MessageBusEventMap[K]) => void
  ): () => void {
    this.emitter.on(event as string, listener as (...args: unknown[]) => void);
    return () => this.emitter.off(event as string, listener as (...args: unknown[]) => void);
  }

  emit<K extends keyof MessageBusEventMap>(event: K, payload: MessageBusEventMap[K]): void {
    this.emitter.emit(event as string, payload);
  }
}

export const globalBus = new MessageBus();
