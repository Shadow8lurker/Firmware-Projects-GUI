#!/usr/bin/env node
import { MessageBus, type RxMeta } from "@commwatch/proto-core";
import { UartSimulatorAdapter } from "@commwatch/transports-uart";
import { SpiSimulatorAdapter } from "@commwatch/transports-spi";
import { I2cSimulatorAdapter } from "@commwatch/transports-i2c";
import { CanSimulatorAdapter } from "@commwatch/transports-can";
import { EthernetSimulatorAdapter } from "@commwatch/transports-eth";
import { builtinDecoders } from "@commwatch/decoders";
import { promises as fs } from "node:fs";

const adapters = {
  uart: new UartSimulatorAdapter(),
  spi: new SpiSimulatorAdapter(),
  i2c: new I2cSimulatorAdapter(),
  can: new CanSimulatorAdapter(),
  ethernet: new EthernetSimulatorAdapter(),
} as const;

export type SupportedProto = keyof typeof adapters;

export async function record(proto: SupportedProto, out: string): Promise<void> {
  const adapter = adapters[proto];
  const devices = await adapter.listDevices();
  const handle = await adapter.open(devices[0], {});
  const bus = new MessageBus();
  const frames: { data: number[]; meta?: RxMeta }[] = [];
  const unsubscribe = handle.read((chunk: Uint8Array, meta?: RxMeta) => {
    frames.push({ data: Array.from(chunk), meta });
    bus.emit("rx:frame", { payload: chunk, meta });
  });
  await new Promise((resolve) => setTimeout(resolve, 50));
  unsubscribe();
  await handle.close();
  await fs.writeFile(out, JSON.stringify({ proto, frames }, null, 2));
}

export async function replay(proto: SupportedProto, input: string): Promise<void> {
  const contents = JSON.parse(await fs.readFile(input, "utf-8")) as { frames: { data: number[] }[] };
  const adapter = adapters[proto];
  const devices = await adapter.listDevices();
  const handle = await adapter.open(devices[0], {});
  for (const frame of contents.frames) {
    await handle.write(new Uint8Array(frame.data));
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
  await handle.close();
}

export function listDecoders() {
  return builtinDecoders.map((decoder) => ({ id: decoder.id, name: decoder.name }));
}

function showHelp(): void {
  console.log(`CommWatch CLI\n\nCommands:\n  record --proto <proto> --out <file>\n  replay --proto <proto> --in <file>\n  decoders`);
}

export async function runCli(argv: string[]): Promise<void> {
  const [, , command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h") {
    showHelp();
    return;
  }
  const args: Record<string, string> = {};
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];
    if (token.startsWith("--")) {
      args[token.slice(2)] = rest[i + 1];
      i++;
    }
  }
  switch (command) {
    case "record": {
      const proto = args["proto"] as SupportedProto;
      const out = args["out"];
      if (!proto || !out) {
        showHelp();
        return;
      }
      await record(proto, out);
      break;
    }
    case "replay": {
      const proto = args["proto"] as SupportedProto;
      const input = args["in"];
      if (!proto || !input) {
        showHelp();
        return;
      }
      await replay(proto, input);
      break;
    }
    case "decoders": {
      console.log(JSON.stringify(listDecoders(), null, 2));
      break;
    }
    default:
      showHelp();
  }
}

if (process.argv[1] === __filename) {
  runCli(process.argv);
}
