declare module "vscode" {
  export interface ExtensionContext {
    extensionUri: any;
    subscriptions: { push(disposable: { dispose(): void }): void };
  }
  export namespace window {
    function createWebviewPanel(viewType: string, title: string, showOptions: any, options: any): WebviewPanel;
  }
  export namespace commands {
    function registerCommand(command: string, callback: (...args: any[]) => any): { dispose(): void };
  }
  export interface Webview {
    html: string;
  }
  export interface WebviewPanel {
    webview: Webview;
  }
  export namespace ViewColumn {
    const One: any;
  }
  export interface Uri {}
}
