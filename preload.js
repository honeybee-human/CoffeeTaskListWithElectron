const { contextBridge, ipcRenderer } = require("electron");

function reloadCSS() {
  const links = document.getElementsByTagName('link');
  for (const link of links) {
    if (link.rel === 'stylesheet') {
      const href = link.href;
      link.href = '';
      link.href = href + '?v=' + Date.now();
    }
  }
}

ipcRenderer.on('css-changed', () => {
  reloadCSS();
});

contextBridge.exposeInMainWorld("electronAPI", {
  loadPage: (page) => ipcRenderer.send("load-page", page),
  reloadCSS: () => reloadCSS()
});