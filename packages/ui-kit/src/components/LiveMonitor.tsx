import React from "react";
import { useCommWatch } from "../state";

function formatBytes(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(" ");
}

export const LiveMonitor: React.FC = () => {
  const messages = useCommWatch((state) => state.messages);
  return (
    <section className="flex-1 overflow-auto bg-slate-950 text-slate-100 font-mono text-xs p-4 space-y-2">
      {messages.map((msg, index) => (
        <article key={`${msg.meta.timestamp}-${index}`} className="rounded border border-slate-700 p-2">
          <div className="flex justify-between">
            <span className="text-emerald-400">{msg.meta.direction.toUpperCase()}</span>
            <span className="opacity-70">{new Date(msg.meta.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="mt-1 break-words">{formatBytes(msg.data)}</div>
          {msg.decoded && (
            <div className="mt-2 grid grid-cols-2 gap-2 text-slate-300">
              {msg.decoded.fields.map((field) => (
                <div key={field.name}>
                  <span className="text-slate-500">{field.name}: </span>
                  <span>{field.value}</span>
                </div>
              ))}
            </div>
          )}
          {msg.meta.annotations && (
            <div className="mt-2 text-xs text-slate-500">{msg.meta.annotations.join(" · ")}</div>
          )}
          {msg.decoded?.errors && (
            <div className="mt-2 text-xs text-red-400">Errors: {msg.decoded.errors.join(", ")}</div>
          )}
        </article>
      ))}
      {!messages.length && <div className="text-center opacity-50">No traffic yet — connect a transport.</div>}
    </section>
  );
};
