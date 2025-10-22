import type { RxMeta } from "@commwatch/proto-core";
import { useEffect, useMemo, useState } from "react";

export interface MonitorProps {
  frames: { direction: "rx" | "tx"; data: Uint8Array; meta?: RxMeta }[];
}

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
});

export function Monitor({ frames }: MonitorProps) {
  return (
    <div className="flex flex-col space-y-1 text-xs font-mono">
      {frames.map((frame, idx) => (
        <div
          key={idx}
          className={`rounded border px-2 py-1 ${frame.direction === "rx" ? "border-green-500" : "border-blue-500"}`}
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wide">
            <span>{frame.direction}</span>
            <span>{frame.meta ? formatter.format(frame.meta.timestamp) : "--"}</span>
          </div>
          <div className="truncate">
            {Array.from(frame.data)
              .map((byte) => byte.toString(16).padStart(2, "0"))
              .join(" ")}
          </div>
        </div>
      ))}
    </div>
  );
}

export interface TxBuilderProps {
  template: string;
  onSend(payload: Uint8Array): void;
}

export function TxBuilder({ template, onSend }: TxBuilderProps) {
  const [text, setText] = useState(template);
  const buffer = useMemo(() => {
    const sanitized = text.replace(/[^0-9a-fA-F\s]/g, "").split(/\s+/).filter(Boolean);
    return new Uint8Array(sanitized.map((hex) => parseInt(hex, 16)));
  }, [text]);

  useEffect(() => {
    setText(template);
  }, [template]);

  return (
    <div className="space-y-2">
      <textarea
        className="w-full rounded border border-slate-500 bg-slate-900 p-2 font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center justify-between text-[10px] uppercase text-slate-400">
        <span>{buffer.length} bytes</span>
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-400"
          onClick={() => onSend(buffer)}
        >
          Send
        </button>
      </div>
    </div>
  );
}
