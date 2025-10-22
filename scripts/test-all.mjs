import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const tests = [
  "packages/proto-core/src/index.test.ts",
  "packages/transports-uart/src/sim.test.ts",
  "packages/transports-spi/src/sim.test.ts",
  "packages/transports-i2c/src/sim.test.ts",
  "packages/transports-can/src/sim.test.ts",
  "packages/transports-eth/src/sim.test.ts",
  "packages/decoders/src/index.test.ts",
  "packages/ui-kit/src/index.test.ts",
  "tools/simulators/src/index.test.ts",
  "apps/cli/src/index.test.ts",
  "apps/desktop/src/main.test.ts"
];

for (const test of tests) {
  execSync(`node --test ${test}`, { stdio: "inherit", cwd: root });
}
