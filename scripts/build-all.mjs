import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

execSync(`tsc -b tsconfig.build.json`, { stdio: "inherit", cwd: root });
execSync(`node ${join("scripts", "link-dist.mjs")}`, { stdio: "inherit", cwd: root, env: process.env });
execSync(`node ${join("apps", "desktop", "dist", "main.js")}`, { stdio: "inherit", cwd: root, env: process.env });
