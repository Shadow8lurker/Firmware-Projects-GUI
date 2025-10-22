import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const packages = [
  "proto-core",
  "transports-uart",
  "transports-spi",
  "transports-i2c",
  "transports-can",
  "transports-eth",
  "decoders",
  "ui-kit"
];

const base = join(root, "node_modules", "@commwatch");
await fs.mkdir(base, { recursive: true });

for (const pkg of packages) {
  const dir = join(base, pkg);
  await fs.mkdir(dir, { recursive: true });
  const pkgJson = {
    name: `@commwatch/${pkg}`,
    version: "0.1.0",
    type: "module",
    main: join("..", "..", "..", "packages", pkg, "dist", "index.js")
  };
  await fs.writeFile(join(dir, "package.json"), JSON.stringify(pkgJson, null, 2));
}
