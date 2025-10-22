# User Guide

CommWatch offers a consistent experience across the desktop app, VS Code extension, and CLI. Each environment reuses the same transport adapters and decoders, so switching contexts is seamless.

## Concepts

- **Transport adapters**: Provide read/write access to physical or simulated hardware. Available adapters: UART, SPI, I²C, CAN, Ethernet.
- **Decoders**: Interpret raw byte streams. Built-in decoders include Hex/ASCII, COBS, and EFuse frame parsing with CRC validation.
- **Profiles**: JSON files (`.commwatch.json`) describing preferred transports, presets, and logging behavior.

## Live Monitor

The live monitor presents RX/TX frames with timestamps, direction indicators, and color coding. Toggle between hexadecimal and ASCII views using the toolbar. CRC failures trigger red badges and diagnostics in the VS Code Problems panel.

## Transmit Builder

- Edit payloads in hex using the template textbox.
- Use variables such as `${counter}` or `${timestamp}` in future presets to auto-generate payload fields.
- Schedule periodic transmissions by enabling the rate limiter (desktop app prototype includes manual send).

## Logging

- Desktop app: Use the menu (**File → Export**) to save CSV/JSON logs.
- CLI: `commwatch record --proto uart --out session.json` writes frame metadata suitable for CI pipelines.

## Protocol Tips

- **UART**: Configure parity, stop bits, and flow control in the connection dialog. Break detection and parity errors surface as metadata tags.
- **SPI**: Compose transactions by stacking [chip select, write, read] segments. The simulator demonstrates a temperature sensor readback.
- **I²C**: Use the bus scanner to enumerate device addresses. Combined write-then-read sequences are supported.
- **CAN**: Apply filters (standard or extended IDs) and enable listen-only mode for passive observation.
- **Ethernet**: Quick-connect options exist for UDP or TCP endpoints. PCAP export is available when native capture is enabled.

## Automation

The CLI can run in headless mode for CI:

```bash
commwatch record --proto can --iface vcan0 --out artifacts/vcan.json
commwatch replay --proto can --in artifacts/vcan.json
```

Use simulators to emulate high-rate traffic without hardware.
