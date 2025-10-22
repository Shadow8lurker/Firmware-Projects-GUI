# User Guide

## Overview

Comm Watch provides a unified interface for connecting to embedded transports, monitoring traffic, and building transmissions. The UI is shared across the VS Code extension and Electron desktop build.

## Layout

- **Top Bar** – choose protocol, connect/disconnect transports, and view status.
- **Live Monitor** – timeline of RX/TX frames with decoding summaries.
- **TX Builder** – construct frames via hex input and optional CRC auto-appending.

## Protocol Features

### UART

- Configurable baud rate, parity, stop bits (via adapter options in config files).
- Simulation generates periodic heartbeats showing timestamped strings.
- TX builder defaults to EFuse template (`0xAA 0x01 len payload CRC`).

### SPI

- Transaction composer represented by sequential writes; simulated response echoes inverted bytes.
- Use CLI replay mode with `--proto spi` to validate frame flow.

### I²C

- Combined transaction simulation (write followed by read) with deterministic sensor payload `DE AD BE EF`.

### CAN

- SocketCAN-like feed generating standard and extended identifiers at ~20 Hz.
- Monitor highlights ID, frame type, and bitrate annotation.

### Ethernet

- UDP echo loop providing textual payloads to validate parsing and logging.

## Logging

- CLI `record` writes logs to JSON with hex-encoded payloads.
- CLI `replay` re-injects captured payloads at user-defined intervals.

## Settings Profiles

Store adapter options in `.commwatch.json` files. Example:

```json
{
  "protocol": "uart",
  "deviceId": "sim-uart-1",
  "options": {
    "baudRate": 115200,
    "parity": "none"
  }
}
```

## Accessibility

- Dark mode with high-contrast text.
- Keyboard navigation for dropdowns and buttons.
- Copy content using standard selection shortcuts.
