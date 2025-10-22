import * as vscode from "vscode";
import { renderMonitor, renderTxBuilder } from "@commwatch/ui-kit";

export function getWebviewContent(_webview: vscode.Webview, _extensionUri: vscode.Uri): string {
  const sampleFrames = renderMonitor([
    { direction: "rx", data: new Uint8Array([0xaa, 0x10, 0x01, 0x10, 0xbb]), meta: { timestamp: Date.now(), sequence: 1, transport: "uart" } }
  ]);
  const txBuilder = renderTxBuilder({ template: "aa 10 01 10 bb", description: "Sample EFuse frame" });
  return /* html */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Comm Watch</title>
        <style>
          body { background: #020617; color: #e2e8f0; font-family: 'Segoe UI', sans-serif; padding: 16px; }
          h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
          h2 { font-size: 1rem; margin-top: 1.5rem; }
        </style>
      </head>
      <body>
        <h1>CommWatch Preview</h1>
        <p>Simulated frames rendered with shared UI kit utilities.</p>
        <section>
          <h2>Live Monitor</h2>
          ${sampleFrames}
        </section>
        <section>
          <h2>Transmit Builder</h2>
          ${txBuilder}
        </section>
      </body>
    </html>`;
}
