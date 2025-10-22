# CommWatch

CommWatch is a cross-platform communication watch window that targets developers who need to inspect serial, CAN, and Ethernet protocols across desktop previews, VS Code, and automated environments. This repository hosts a TypeScript monorepo containing:

- **Shared core libraries**: framing, CRC, and message bus primitives.
- **Transport adapters**: modular UART, SPI, I²C, CAN, and Ethernet implementations with simulator fallbacks.
- **Decoders**: reusable parsers including EFuse frames with CRC-16/CCITT-FALSE validation.
- **UI kit**: HTML-generating helpers for the live monitor and transmit builder.
- **Applications**: VS Code extension scaffold, desktop preview generator, and CLI utility.
- **Simulator tooling**: zero-hardware demos for every transport.

## Quick start

1. Install Node.js 20 or newer.
2. Run the full test suite:

   ```bash
   node scripts/test-all.mjs
   ```

3. Build all packages and generate the desktop preview HTML:

   ```bash
   node scripts/build-all.mjs
   ```

4. View the generated desktop preview:

   ```bash
   xdg-open apps/desktop/dist/index.html  # or open manually in a browser
   ```

5. Launch the CLI against simulator transports:

   ```bash
   node apps/cli/dist/index.js decoders
   node apps/cli/dist/index.js record --proto uart --out demo.json
   ```

6. Package the VS Code extension entry point:

   ```bash
   node scripts/build-all.mjs
   # resulting extension host bundle: apps/vscode-ext/dist/extension.js
   ```

## Repository layout

```
apps/
  cli/             # Headless recorder and replayer
  desktop/         # Desktop preview generator (static HTML)
  vscode-ext/      # VS Code webview extension entry point
packages/
  proto-core/      # Core types, CRC, EFuse frames
  transports-*/    # Modular transport adapters with simulators
  decoders/        # Shared protocol decoders
  ui-kit/          # HTML render helpers
tools/
  simulators/      # Aggregate simulator handles
```

## Documentation

- [docs/quick-start.md](docs/quick-start.md)
- [docs/user-guide.md](docs/user-guide.md)
- [docs/dev-guide.md](docs/dev-guide.md)
- [docs/extension-packaging.md](docs/extension-packaging.md)
- [docs/faq.md](docs/faq.md)

## License

MIT
