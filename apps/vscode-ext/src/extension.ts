import * as vscode from "vscode";
import { getWebviewContent } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("commwatch.open", () => {
    const panel = vscode.window.createWebviewPanel(
      "commwatch",
      "Comm Watch",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
