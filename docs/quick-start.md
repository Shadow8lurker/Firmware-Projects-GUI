# Quick Start

This guide demonstrates how to connect the CommWatch toolchain to a simulated STM32 Nucleo board that streams EFuse frames over UART. Hardware is optional thanks to the built-in simulators.

## Prerequisites

- Node.js 20+

## Install & Build

```bash
node scripts/build-all.mjs
```

## Launch the desktop preview (simulated UART)

Open the generated HTML preview in your browser:

```bash
node apps/desktop/dist/main.js
xdg-open apps/desktop/dist/index.html  # or open manually
```

1. Inspect the RX frame rendered in the live monitor with CRC-verified EFuse payload.
2. Review the transmit builder template for the sample payload.

## Use the CLI

```bash
node apps/cli/dist/index.js decoders
node apps/cli/dist/index.js record --proto uart --out demo.json
```

The resulting `demo.json` contains captured frames with metadata. Replay them onto the CAN simulator:

```bash
node apps/cli/dist/index.js replay --proto can --in demo.json
```

## VS Code extension

```bash
node scripts/build-all.mjs
# Install the generated extension bundle (VSIX packaging via vsce is documented in docs/extension-packaging.md)
```

Open VS Code and run **CommWatch: Open** to display the shared UI kit preview.
