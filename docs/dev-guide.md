# Developer Guide

## Monorepo

- TypeScript-only workspace with project references in each package.
- Build orchestration lives in `scripts/build-all.mjs`.
- Testing uses Node's built-in `node:test` runner.

## Building

```bash
node scripts/build-all.mjs
```

This compiles every package and application, then generates the desktop preview HTML in `apps/desktop/dist/index.html`.

## Testing

```bash
node scripts/test-all.mjs
```

The suite covers:

- CRC and EFuse frame parsing
- Transport simulator echo flows
- Decoder correctness and error handling
- CLI record/replay cycle
- UI kit rendering helpers
- Simulator factory creation
- Desktop preview HTML generation

## Adding new transports

1. Create `packages/transports-<name>` mirroring the simulator template.
2. Implement the `TransportAdapter` interface.
3. Export the adapter in the CLI and documentation.
4. Add `node:test` coverage for success and failure paths.

## Plugin system (concept)

External decoders or transports can be dropped in using a manifest file. A plugin loader can inspect `node_modules/@commwatch-plugin-*` packages and dynamically register adapters via dependency injection. This scaffolding is prepared in `packages/proto-core` with message bus and shared types.

## CI suggestions

- Matrix across Linux, macOS, Windows.
- Steps: `node scripts/build-all.mjs`, `node scripts/test-all.mjs`.
- Artifact upload: desktop preview HTML, CLI bundle, VS Code extension `dist/extension.js` (VSIX packaging described in docs/extension-packaging.md).
