import type { MessageBusEvent, MessageBusEventMap } from "./types";
export declare class MessageBus {
    private listeners;
    emit<E extends MessageBusEvent>(event: E, payload: MessageBusEventMap[E]): void;
    on<E extends MessageBusEvent>(event: E, listener: (payload: MessageBusEventMap[E]) => void): () => void;
}
