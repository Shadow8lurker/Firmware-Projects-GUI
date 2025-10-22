import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Monitor, TxBuilder } from "@commwatch/ui-kit";
import { buildEfuseFrame } from "@commwatch/proto-core";
import { builtinDecoders } from "@commwatch/decoders";
import { UartSimulatorAdapter } from "@commwatch/transports-uart";

function useSimulatedUart() {
  const adapter = useMemo(() => new UartSimulatorAdapter(), []);
  const [frames, setFrames] = useState<Parameters<typeof Monitor>[0]["frames"]>([]);

  const connect = async () => {
    const device = (await adapter.listDevices())[0];
    const handle = await adapter.open(device, {});
    const unsubscribe = handle.read((chunk, meta) => {
      setFrames((prev) => [...prev, { direction: "rx", data: chunk, meta }]);
    });
    return { handle, unsubscribe };
  };

  return { frames, connect };
}

function App() {
  const { frames, connect } = useSimulatedUart();
  const [connection, setConnection] = useState<Awaited<ReturnType<typeof connect>> | null>(null);

  const onConnect = async () => {
    if (!connection) {
      const conn = await connect();
      setConnection(conn);
      const payload = buildEfuseFrame({ type: 0x01, payload: new Uint8Array([0x10, 0x20]) });
      await conn.handle.write(payload);
    }
  };

  return (
    <div style={{ backgroundColor: "#020617", color: "#e2e8f0", minHeight: "100vh", padding: "1.5rem", fontFamily: "Inter, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>CommWatch Desktop</h1>
        <button onClick={onConnect} style={{ backgroundColor: "#22c55e", color: "#021", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", fontWeight: 600 }}>
          {connection ? "Connected" : "Connect"}
        </button>
      </header>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>Live Monitor</h2>
          <Monitor frames={frames} />
        </div>
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "0.5rem" }}>Transmit Builder</h2>
          <TxBuilder template="aa 01 02 10 20 bb" onSend={async (payload) => {
            if (connection) {
              await connection.handle.write(payload);
            }
          }} />
          <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#94a3b8" }}>
            Built-in decoders: {builtinDecoders.map((d) => d.name).join(", ")}
          </div>
        </div>
      </section>
    </div>
  );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
