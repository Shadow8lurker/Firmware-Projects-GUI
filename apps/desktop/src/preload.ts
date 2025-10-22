import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("commwatch", {
  version: "0.1.0"
});
