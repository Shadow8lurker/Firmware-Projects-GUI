import { app, BrowserWindow, Menu, shell } from "electron";
import { join } from "node:path";

const isDev = process.env.NODE_ENV === "development";

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexFile = join(__dirname, "..", "..", "packages", "ui-app", "dist", "index.html");
  if (isDev) {
    await win.loadURL("http://localhost:5173");
  } else {
    await win.loadFile(indexFile);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow().catch(console.error);
  const template = [
    {
      label: "File",
      submenu: [
        { role: "close" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().catch(console.error);
  }
});
