import React, { useEffect, useMemo, useState } from "react";
import { LiveMonitor, TopBar, TxBuilder, useCommWatch } from "@commwatch/ui-kit";
import { builtinDecoders } from "@commwatch/decoders";
import type { AdapterHandle, AdapterOpenOptions, DeviceInfo, FrameRecord, TransportAdapter } from "@commwatch/proto-core";
import { uartTransport } from "@commwatch/transports-uart";
import { spiTransport } from "@commwatch/transports-spi";
import { i2cTransport } from "@commwatch/transports-i2c";
import { canTransport } from "@commwatch/transports-can";
import { ethernetTransport } from "@commwatch/transports-eth";

const transports: Record<string, TransportAdapter> = {
  uart: uartTransport,
  spi: spiTransport,
  i2c: i2cTransport,
  can: canTransport,
  ethernet: ethernetTransport
};

export const App: React.FC = () => {
  const protocol = useCommWatch((state) => state.protocol);
  const pushMessage = useCommWatch((state) => state.pushMessage);
  const clear = useCommWatch((state) => state.clear);
  const [handle, setHandle] = useState<AdapterHandle | null>(null);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const defaultOptions: AdapterOpenOptions = { baudRate: 115200 };

  useEffect(() => {
    let cancelled = false;
    transports[protocol]
      .listDevices()
      .then((list) => {
        if (!cancelled) {
          setDevices(list);
          setDevice(list[0] ?? null);
        }
      })
      .catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, [protocol]);

  const decoder = useMemo(() => builtinDecoders.find((d) => d.id === "efuse") ?? builtinDecoders[0], []);

  useEffect(() => {
    clear();
  }, [protocol, clear]);

  const connect = async () => {
    if (!device) return;
    const adapter = transports[protocol];
    const opened = await adapter.open(device, defaultOptions);
    opened.read((data, meta) => {
      const record: FrameRecord = { data, meta: meta! };
      const decoded = decoder.decode(data);
      pushMessage({ ...record, decoded });
    });
    setHandle(opened);
  };

  const disconnect = async () => {
    await handle?.close();
    setHandle(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white">
      <TopBar connected={!!handle} onConnect={connect} onDisconnect={disconnect} />
      <div className="flex flex-1 divide-x divide-slate-800">
        <LiveMonitor />
        <div className="w-96 flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-2">
            <div className="text-sm font-semibold">Device</div>
            <select
              className="w-full bg-slate-950 text-white border border-slate-700 rounded px-2 py-1"
              value={device?.id ?? ""}
              onChange={(event) => {
                const next = devices.find((item) => item.id === event.target.value);
                setDevice(next ?? null);
              }}
            >
              {devices.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>
          <TxBuilder onSend={(payload) => handle?.write(payload)} />
        </div>
      </div>
    </div>
  );
};
