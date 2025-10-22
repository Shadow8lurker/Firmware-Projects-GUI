export class MessageBus {
    constructor() {
        this.listeners = {};
    }
    emit(event, payload) {
        const set = this.listeners[event];
        if (!set)
            return;
        for (const listener of set) {
            listener(payload);
        }
    }
    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        const set = this.listeners[event];
        set.add(listener);
        return () => set.delete(listener);
    }
}
//# sourceMappingURL=message-bus.js.map