#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import { promises as fs } from "node:fs";
import { builtinDecoders } from "@commwatch/decoders";
import type { FrameRecord, TransportAdapter, TransportKind } from "@commwatch/proto-core";
import { uartTransport } from "@commwatch/transports-uart";
import { spiTransport } from "@commwatch/transports-spi";
import { i2cTransport } from "@commwatch/transports-i2c";
import { canTransport } from "@commwatch/transports-can";
import { ethernetTransport } from "@commwatch/transports-eth";

const transports: Record<TransportKind, TransportAdapter> = {
  uart: uartTransport,
  spi: spiTransport,
  i2c: i2cTransport,
  can: canTransport,
  ethernet: ethernetTransport
};

yargs(hideBin(process.argv))
  .scriptName("commwatch")
  .command(
    "record",
    "Record frames from a transport",
    (command) =>
      command
        .option("proto", { type: "string", demandOption: true, choices: Object.keys(transports) })
        .option("device", { type: "string", describe: "Device id" })
        .option("out", { type: "string", demandOption: true, describe: "Output JSON log" })
        .option("duration", { type: "number", default: 5, describe: "Capture duration in seconds" }),
    async (args) => {
      const proto = args.proto as TransportKind;
      const adapter = transports[proto];
      const devices = await adapter.listDevices();
      const device = args.device ? devices.find((d) => d.id === args.device) : devices[0];
      if (!device) {
        throw new Error("No device available for protocol " + proto);
      }
      const handle = await adapter.open(device, {});
      const records: FrameRecord[] = [];
      const decoder = builtinDecoders.find((d) => d.id === "efuse") ?? builtinDecoders[0];
      const unsubscribe = handle.read((data, meta) => {
        const record: FrameRecord = { data, meta: meta! };
        records.push(record);
        const decoded = decoder.decode(data);
        if (decoded.errors?.length) {
          console.warn(`Decoder errors: ${decoded.errors.join(", ")}`);
        }
      });
      await new Promise((resolve) => setTimeout(resolve, (args.duration as number) * 1000));
      unsubscribe();
      await handle.close();
      const serialized = records.map((entry) => ({
        meta: entry.meta,
        data: Buffer.from(entry.data).toString("hex")
      }));
      await fs.writeFile(args.out as string, JSON.stringify(serialized, null, 2));
      console.log(`Saved ${records.length} frames to ${args.out}`);
    }
  )
  .command(
    "replay",
    "Replay frames to a transport",
    (command) =>
      command
        .option("proto", { type: "string", demandOption: true, choices: Object.keys(transports) })
        .option("device", { type: "string", describe: "Device id" })
        .option("in", { type: "string", demandOption: true, describe: "Input JSON log" })
        .option("interval", { type: "number", default: 100, describe: "Interval between frames in ms" }),
    async (args) => {
      const proto = args.proto as TransportKind;
      const adapter = transports[proto];
      const devices = await adapter.listDevices();
      const device = args.device ? devices.find((d) => d.id === args.device) : devices[0];
      if (!device) {
        throw new Error("No device available for protocol " + proto);
      }
      const handle = await adapter.open(device, {});
      const raw = await fs.readFile(args.in as string, "utf8");
      const entries: Array<{ data: string }> = JSON.parse(raw);
      for (const entry of entries) {
        const buffer = Buffer.from(entry.data, "hex");
        await handle.write(buffer);
        await new Promise((resolve) => setTimeout(resolve, args.interval as number));
      }
      await handle.close();
      console.log(`Replayed ${entries.length} frames from ${args.in}`);
    }
  )
  .demandCommand(1)
  .strict()
  .help().argv;
