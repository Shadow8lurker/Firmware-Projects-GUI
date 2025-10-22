import { useCommWatch } from "../state";
import type { TransportKind } from "@commwatch/proto-core";
import React from "react";

const protocols: TransportKind[] = ["uart", "spi", "i2c", "can", "ethernet"];

export interface TopBarProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  connected: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onConnect, onDisconnect, connected }) => {
  const protocol = useCommWatch((state) => state.protocol);
  const setProtocol = useCommWatch((state) => state.setProtocol);

  return (
    <header className="flex items-center gap-4 bg-slate-900 text-white px-4 py-2">
      <div className="text-lg font-semibold">Comm Watch</div>
      <select
        className="bg-slate-800 text-white rounded px-2 py-1"
        value={protocol}
        onChange={(event) => setProtocol(event.target.value as TransportKind)}
      >
        {protocols.map((proto) => (
          <option key={proto} value={proto}>
            {proto.toUpperCase()}
          </option>
        ))}
      </select>
      <button
        className={`rounded px-3 py-1 text-sm font-medium ${connected ? "bg-red-500" : "bg-emerald-500"}`}
        onClick={() => (connected ? onDisconnect?.() : onConnect?.())}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
      <div className="ml-auto text-xs opacity-75">
        Protocol aware decoding • Profiles • Logging
      </div>
    </header>
  );
};
