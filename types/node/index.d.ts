declare module "node:fs" {
  export const promises: {
    readFile(path: string, encoding: string): Promise<string>;
    readFile(path: string): Promise<Buffer>;
    writeFile(path: string, data: string | Uint8Array, encoding?: string): Promise<void>;
    mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  };
}

declare module "node:path" {
  export function join(...parts: string[]): string;
  export function dirname(path: string): string;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}

declare module "node:os" {
  export function tmpdir(): string;
}

declare module "node:test" {
  export function describe(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
}

declare module "node:assert/strict" {
  export function equal(actual: unknown, expected: unknown): void;
  export function deepEqual(actual: unknown, expected: unknown): void;
  export function ok(value: unknown, message?: string): void;
  export function match(value: string, pattern: RegExp): void;
}

declare module "node:child_process" {
  export function execSync(command: string, options?: { stdio?: "inherit" | "pipe"; cwd?: string; env?: NodeJS.ProcessEnv }): Buffer;
}

interface ProcessEnv {
  [key: string]: string | undefined;
}

declare namespace NodeJS {
  interface Process {
    argv: string[];
    env: ProcessEnv;
  }
}

declare const process: NodeJS.Process;

declare class Buffer extends Uint8Array {}

declare const __dirname: string;
declare const __filename: string;
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number): any;
declare const require: {
  (module: string): any;
  main?: { filename: string };
};
