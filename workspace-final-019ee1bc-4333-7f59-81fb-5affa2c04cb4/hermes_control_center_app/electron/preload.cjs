const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopBridge', {
  isElectron: true,
  openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
  selectLlamaExe: () => ipcRenderer.invoke('dialog:selectLlamaExe'),
  selectGgufModel: () => ipcRenderer.invoke('dialog:selectGgufModel'),
  showItemInFolder: (filePath) => ipcRenderer.invoke('app:showItemInFolder', filePath),
  getDesktopSettings: () => ipcRenderer.invoke('desktop:getSettings'),
  saveDesktopSettings: (settings) => ipcRenderer.invoke('desktop:saveSettings', settings),
  notify: (payload) => ipcRenderer.invoke('desktop:notify', payload),
  updateTrayState: (payload) => ipcRenderer.invoke('tray:updateState', payload)
});
