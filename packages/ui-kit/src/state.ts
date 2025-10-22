import create from "zustand";
import type { DecodedFrame, FrameRecord, TransportKind } from "@commwatch/proto-core";

export interface MessageEntry extends FrameRecord {
  decoded?: DecodedFrame;
}

interface CommWatchState {
  protocol: TransportKind;
  setProtocol(proto: TransportKind): void;
  messages: MessageEntry[];
  pushMessage(entry: MessageEntry): void;
  clear(): void;
}

export const useCommWatch = create<CommWatchState>((set) => ({
  protocol: "uart",
  setProtocol: (protocol) => set({ protocol }),
  messages: [],
  pushMessage: (entry) =>
    set((state) => ({
      messages: [...state.messages.slice(-499), entry]
    })),
  clear: () => set({ messages: [] })
}));
