import React, { useState } from "react";
import { appendCrc } from "@commwatch/proto-core";

export interface TxBuilderProps {
  onSend?: (payload: Uint8Array) => void;
}

export const TxBuilder: React.FC<TxBuilderProps> = ({ onSend }) => {
  const [hex, setHex] = useState("AA 01 03 10 20 30");
  const [autoCrc, setAutoCrc] = useState(true);

  const handleSend = () => {
    const sanitized = hex
      .split(/[^0-9a-fA-F]+/)
      .filter(Boolean)
      .map((pair) => parseInt(pair, 16));
    let payload = new Uint8Array(sanitized);
    if (autoCrc) {
      payload = appendCrc(payload);
    }
    onSend?.(payload);
  };

  return (
    <section className="bg-slate-900 text-slate-100 p-4 space-y-3">
      <div className="font-semibold">TX Builder</div>
      <textarea
        className="w-full h-24 bg-slate-950 border border-slate-700 rounded p-2 font-mono text-xs"
        value={hex}
        onChange={(event) => setHex(event.target.value)}
      />
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={autoCrc} onChange={(event) => setAutoCrc(event.target.checked)} />
        Append CRC-16/CCITT-FALSE
      </label>
      <button className="bg-emerald-500 text-slate-950 font-semibold px-4 py-2 rounded" onClick={handleSend}>
        Send Frame
      </button>
    </section>
  );
};
