# Quick Start: STM32 Nucleo via UART Simulation

1. Install dependencies and build packages:

   ```bash
   pnpm install
   pnpm build
   ```

2. Launch the UI bundle:

   ```bash
   pnpm --filter @commwatch/ui-app dev
   ```

3. Choose **UART** in the top bar, keep the default `UART Loopback` device, and click **Connect**. You will see simulated EFuse frames and heartbeats.

4. To simulate STM32 EFuse frames, open the **TX Builder** and send the default payload with CRC enabled. The live monitor confirms CRC verification.

5. Export a log from the CLI:

   ```bash
   pnpm --filter @commwatch/cli build
   node apps/cli/dist/index.js record --proto uart --out stm32-log.json --duration 5
   ```

6. Replay the log back into the simulator:

   ```bash
   node apps/cli/dist/index.js replay --proto uart --in stm32-log.json
   ```
