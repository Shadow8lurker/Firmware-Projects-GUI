import { globalBus } from "@commwatch/proto-core";

export function startSimulator() {
  const interval = setInterval(() => {
    globalBus.emit("log", { level: "info", message: "Simulator tick" });
  }, 1000);
  return () => clearInterval(interval);
}
