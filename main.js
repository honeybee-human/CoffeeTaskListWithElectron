const path = require("path");
const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  dialog,
} = require("electron");
const fs = require("fs");

let win;

function watchCSS() {
  fs.watch('styles.css', (eventType, filename) => {
    if (eventType === 'change') {
      win.webContents.send('css-changed');
    }
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
  watchCSS();

  ipcMain.on("load-page", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
