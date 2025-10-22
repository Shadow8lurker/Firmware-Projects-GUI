import type { RxMeta } from "@commwatch/proto-core";

export interface FrameEntry {
  direction: "rx" | "tx";
  data: Uint8Array;
  meta?: RxMeta;
}

export function formatBytes(data: Uint8Array): string {
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

export function renderMonitor(frames: FrameEntry[]): string {
  const rows = frames
    .map((frame) => {
      const time = frame.meta ? new Date(frame.meta.timestamp).toISOString() : "--";
      const classes = frame.direction === "rx" ? "border-green-500" : "border-blue-500";
      return `<div class=\"rounded border ${classes} px-2 py-1 mb-1 text-xs font-mono bg-slate-900 text-slate-100\">
        <div class=\"flex justify-between text-[10px] uppercase\">
          <span>${frame.direction}</span>
          <span>${time}</span>
        </div>
        <div class=\"break-all\">${formatBytes(frame.data)}</div>
      </div>`;
    })
    .join("");
  return `<div class=\"flex flex-col\">${rows}</div>`;
}

export interface TxBuilderOptions {
  template: string;
  description?: string;
}

export function parseHexTemplate(template: string): Uint8Array {
  const sanitized = template.replace(/[^0-9a-fA-F\s]/g, " ");
  const bytes = sanitized
    .split(/\s+/)
    .filter(Boolean)
    .map((hex) => parseInt(hex, 16) & 0xff);
  return new Uint8Array(bytes);
}

export function renderTxBuilder(options: TxBuilderOptions): string {
  const payload = parseHexTemplate(options.template);
  const info = `${payload.length} bytes`;
  return `<div class=\"space-y-2\">
    <label class=\"text-xs uppercase text-slate-400\">Template</label>
    <pre class=\"bg-slate-900 text-slate-100 p-2 rounded\">${options.template}</pre>
    <div class=\"text-[10px] uppercase text-slate-500\">${info}</div>
    ${options.description ? `<p class=\"text-xs text-slate-400\">${options.description}</p>` : ""}
  </div>`;
}
