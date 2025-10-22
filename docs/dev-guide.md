# Developer Guide

## Build Orchestration

This monorepo relies on pnpm workspaces and TypeScript project references. Packages export declarations to allow downstream builds to type-check without re-transpiling sources.

- `pnpm build` – builds every package and app in topological order.
- `pnpm test` – runs Vitest suites for core packages, UI kit, and CLI.

## Shared UI Workflow

1. Develop React components inside `packages/ui-kit`.
2. The Vite application in `packages/ui-app` consumes the kit and produces the shared `dist` bundle.
3. Electron (`apps/desktop`) and the VS Code extension (`apps/vscode-ext`) load the same `dist/index.html` output.

During local development, run Vite in watch mode:

```bash
pnpm --filter @commwatch/ui-app dev
```

Electron's `NODE_ENV=development` mode proxies to `http://localhost:5173` for hot reload.

## Adding a New Transport

1. Create a new package under `packages/transports-<id>`.
2. Export a `TransportAdapter` instance matching the interface defined in `@commwatch/proto-core`.
3. Implement `listDevices`, `open`, and the simulation behavior inside the package.
4. Wire the new adapter into `packages/ui-app/src/App.tsx` and the CLI's transport map.
5. Provide tests in the new package using Vitest.

## Protocol Decoders

Add decoders under `packages/decoders/src`. Each decoder implements the `FrameDecoder` interface and may annotate errors. Include snapshot or unit tests in `packages/decoders/test`.

## Continuous Integration

Recommended CI matrix:

- `pnpm install`
- `pnpm build`
- `pnpm test`
- `pnpm --filter @commwatch/ui-app build`
- `pnpm --filter @commwatch/desktop build`
- `pnpm --filter commwatch build`
- `pnpm --filter @commwatch/cli build`

Artifacts to publish:

- `apps/vscode-ext/*.vsix`
- Electron bundles via `electron-builder` for Windows/macOS/Linux.
- CLI binaries produced with `pkg` or `nexe` (not included by default).
