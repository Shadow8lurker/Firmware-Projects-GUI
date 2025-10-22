import * as vscode from "vscode";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("commwatch.open", () => {
    const panel = vscode.window.createWebviewPanel(
      "commwatch",
      "Comm Watch",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(join(context.extensionPath, "..", "..", "packages", "ui-app", "dist"))]
      }
    );

    const indexPath = join(context.extensionPath, "..", "..", "packages", "ui-app", "dist", "index.html");
    let html = readFileSync(indexPath, "utf8");
    const baseUri = vscode.Uri.file(join(context.extensionPath, "..", "..", "packages", "ui-app", "dist"));
    const baseWebviewUri = panel.webview.asWebviewUri(baseUri);
    html = html
      .replace(/<head>/, `<head><base href="${baseWebviewUri.toString()}/">`)
      .replace(/"\/(assets\//g, `"${baseWebviewUri.toString()}/$1`);
    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
