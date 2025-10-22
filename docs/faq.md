# FAQ

## Does CommWatch require hardware?

No. Every transport ships with a simulator for development and CI. Hardware adapters can be integrated by implementing the `TransportAdapter` interface.

## How are CRC errors reported?

The EFuse decoder validates CRC-16/CCITT-FALSE values. Failures emit `rx:frame` events with `status: "crc-error"` metadata, surface as red badges in the UI, and produce diagnostics in the VS Code extension.

## Can I add my own decoder?

Yes. Create a package that exports a `DecoderDefinition`. Register it by importing the decoder into the CLI/Electron entry point or by implementing the planned plugin manifest loader.

## Are high-rate CAN and Ethernet streams supported?

The transport simulators implement backpressure using event queues. For production, consider adding a native bridge (via NAPI-RS) to access SocketCAN or libpcap while preserving the adapter interface.

## How do I export logs?

- Desktop: use the menu export action.
- CLI: `commwatch record` writes JSON metadata. Convert to CSV with the provided utility script in the dev guide.
- VS Code: copy from the monitor or open the generated log folder.
