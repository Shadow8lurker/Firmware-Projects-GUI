import type { MessageBusEvent, MessageBusEventMap } from "./types";

type AnyListener = (payload: unknown) => void;

export class MessageBus {
  private listeners: Record<string, Set<AnyListener>> = {};

  emit<E extends MessageBusEvent>(event: E, payload: MessageBusEventMap[E]): void {
    const set = this.listeners[event];
    if (!set) return;
    for (const listener of set) {
      (listener as (payload: MessageBusEventMap[E]) => void)(payload);
    }
  }

  on<E extends MessageBusEvent>(event: E, listener: (payload: MessageBusEventMap[E]) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    const set = this.listeners[event];
    set.add(listener as AnyListener);
    return () => set.delete(listener as AnyListener);
  }
}
