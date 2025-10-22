import { renderMonitor, renderTxBuilder, type FrameEntry } from "@commwatch/ui-kit";
import { buildEfuseFrame, type RxMeta } from "@commwatch/proto-core";
import { UartSimulatorAdapter } from "@commwatch/transports-uart";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function createPreviewHtml(): Promise<string> {
  const adapter = new UartSimulatorAdapter();
  const device = (await adapter.listDevices())[0];
  const handle = await adapter.open(device, {});
  const payload = buildEfuseFrame({ type: 0x01, payload: new Uint8Array([0x10, 0x20]) });
  const frames: FrameEntry[] = [];
  const unsubscribe = handle.read((chunk: Uint8Array, meta?: RxMeta) => {
    frames.push({ direction: "rx", data: chunk, meta });
  });
  await handle.write(payload);
  await new Promise((resolve) => setTimeout(resolve, 20));
  unsubscribe();
  await handle.close();

  return `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>CommWatch Desktop Preview</title>
    <style>
      body { background: #020617; color: #e2e8f0; font-family: 'Segoe UI', sans-serif; padding: 24px; }
      h1 { font-size: 1.75rem; margin-bottom: 1rem; }
      h2 { font-size: 1.2rem; margin-top: 1.5rem; }
      a { color: #38bdf8; }
    </style>
  </head>
  <body>
    <h1>CommWatch Desktop Preview</h1>
    <p>This static preview demonstrates the shared monitor and transmit builder components using the UART simulator.</p>
    <section>
      <h2>Monitor</h2>
      ${renderMonitor(frames)}
    </section>
    <section>
      <h2>Transmit Builder</h2>
      ${renderTxBuilder({ template: "aa 01 02 10 20 bb", description: "EFuse frame with CRC" })}
    </section>
  </body>
</html>`;
}

export async function generatePreviewFile(): Promise<void> {
  const html = await createPreviewHtml();
  const outDir = join(__dirname, "../dist");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(join(outDir, "index.html"), html, "utf-8");
}

if (process.argv[1] === __filename) {
  generatePreviewFile();
}
