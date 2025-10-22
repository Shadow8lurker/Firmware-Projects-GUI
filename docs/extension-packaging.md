# VS Code Extension Packaging

1. Build shared packages and the extension host code:

   ```bash
   node scripts/build-all.mjs
   ```

2. The compiled extension entry point resides at `apps/vscode-ext/dist/extension.js`.

3. To create a `.vsix`, install `vsce` locally (outside this repository's offline scope) and run:

   ```bash
   cd apps/vscode-ext
   vsce package
   ```

4. Install locally for testing:

   ```bash
   code --install-extension commwatch-vscode-0.1.0.vsix
   ```

5. Use the command palette (`Ctrl+Shift+P`) and search for **CommWatch: Open** to launch the webview panel.
