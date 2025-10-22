# VS Code Extension Packaging

1. Build the shared UI bundle:

   ```bash
   pnpm --filter @commwatch/ui-app build
   ```

2. Compile the extension TypeScript sources:

   ```bash
   pnpm --filter commwatch build
   ```

3. Package the extension:

   ```bash
   pnpm --filter commwatch package
   ```

   This produces `commwatch-0.1.0.vsix` inside `apps/vscode-ext`.

4. Install the VSIX locally:

   ```bash
   code --install-extension commwatch-0.1.0.vsix
   ```

5. Verification checklist:

   - Open the **CommWatch: Open** command via the palette.
   - Confirm the UI loads and simulated transports emit data.
   - Use the TX builder to send an EFuse frame and verify CRC state.

6. Publishing:

   Configure a publisher token and run `pnpm --filter commwatch package` followed by `pnpm --filter commwatch publish` (requires marketplace publisher access).
