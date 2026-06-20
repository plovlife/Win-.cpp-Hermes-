const { app, BrowserWindow, ipcMain, shell, dialog, Tray, Menu, nativeImage, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow = null;
let tray = null;
let backendProcess = null;
let appIsQuitting = false;
let serverRunning = false;
let lastKnownServerUrl = 'http://127.0.0.1:8080';

const isDev = !app.isPackaged;
const backendPort = process.env.PORT || '3001';
const frontendDevUrl = 'http://127.0.0.1:5173';
const userDataDir = app.getPath('userData');
const desktopSettingsPath = path.join(userDataDir, 'desktop-settings.json');

const defaultDesktopSettings = {
  autostart: false,
  minimizeToTray: true,
  notifications: true,
  hideOnAutostart: true,
  theme: 'dark',
  healthPollSeconds: 5,
  trayHintShown: false
};

function ensureDesktopSettingsFile() {
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
  if (!fs.existsSync(desktopSettingsPath)) {
    fs.writeFileSync(desktopSettingsPath, JSON.stringify(defaultDesktopSettings, null, 2), 'utf8');
  }
}

function getDesktopSettings() {
  ensureDesktopSettingsFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(desktopSettingsPath, 'utf8'));
    return { ...defaultDesktopSettings, ...parsed };
  } catch {
    return { ...defaultDesktopSettings };
  }
}

function saveDesktopSettings(nextSettings = {}) {
  const merged = { ...getDesktopSettings(), ...nextSettings };
  ensureDesktopSettingsFile();
  fs.writeFileSync(desktopSettingsPath, JSON.stringify(merged, null, 2), 'utf8');
  return merged;
}

function getTrayIcon(active = false) {
  const svg = active
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="4" fill="#0f1720"/><circle cx="8" cy="8" r="4.5" fill="#29c36a"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" rx="4" fill="#0f1720"/><circle cx="8" cy="8" r="4.5" fill="#94a3b8"/></svg>`;
  return nativeImage.createFromDataURL(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`);
}

function showNotification(title, body, urgent = false) {
  const settings = getDesktopSettings();
  if (!settings.notifications) return;
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title,
    body,
    urgency: urgent ? 'critical' : 'normal',
    silent: !urgent,
    timeoutType: 'default'
  });

  notification.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  notification.show();
}

function toggleAutostart(enable) {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: process.execPath,
    args: ['--autostart'],
    openAsHidden: true
  });

  const updated = saveDesktopSettings({ autostart: enable });
  updateTrayMenu();

  showNotification(
    enable ? 'Autostart aktiviert' : 'Autostart deaktiviert',
    enable
      ? 'Hermes Control Center startet beim nächsten Windows-Login im Hintergrund.'
      : 'Hermes Control Center startet nicht mehr automatisch.'
  );

  return updated;
}

function startBackend() {
  if (backendProcess) return;

  const serverScript = path.join(__dirname, '..', 'server', 'index.js');
  backendProcess = spawn(process.execPath, [serverScript], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      PORT: backendPort
    },
    stdio: 'pipe'
  });

  backendProcess.stdout.on('data', (data) => {
    console.log('[backend]', data.toString().trim());
  });

  backendProcess.stderr.on('data', (data) => {
    console.error('[backend error]', data.toString().trim());
  });

  backendProcess.on('exit', (code) => {
    console.log('[backend exit]', code);
    backendProcess = null;
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function updateTrayMenu() {
  if (!tray) return;

  const settings = getDesktopSettings();
  const menu = Menu.buildFromTemplate([
    {
      label: 'Hermes Control Center',
      enabled: false
    },
    { type: 'separator' },
    {
      label: serverRunning ? '🟢 llama.cpp Server läuft' : '🔴 llama.cpp Server gestoppt',
      enabled: false
    },
    {
      label: 'Fenster öffnen',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Lokale API im Browser öffnen',
      enabled: Boolean(lastKnownServerUrl),
      click: () => shell.openExternal(lastKnownServerUrl)
    },
    { type: 'separator' },
    {
      label: 'Autostart',
      type: 'checkbox',
      checked: settings.autostart,
      click: (menuItem) => toggleAutostart(menuItem.checked)
    },
    {
      label: 'In Tray minimieren',
      type: 'checkbox',
      checked: settings.minimizeToTray,
      click: (menuItem) => saveDesktopSettings({ minimizeToTray: menuItem.checked })
    },
    {
      label: 'Benachrichtigungen',
      type: 'checkbox',
      checked: settings.notifications,
      click: (menuItem) => saveDesktopSettings({ notifications: menuItem.checked })
    },
    { type: 'separator' },
    {
      label: 'Beenden',
      click: () => {
        appIsQuitting = true;
        stopBackend();
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip(serverRunning ? 'Hermes Control Center – Server läuft' : 'Hermes Control Center – Server gestoppt');
  tray.setImage(getTrayIcon(serverRunning));
}

function createTray() {
  tray = new Tray(getTrayIcon(false));
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible() && mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  updateTrayMenu();
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1100,
    minHeight: 760,
    show: false,
    backgroundColor: '#0f1720',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.on('close', (event) => {
    const settings = getDesktopSettings();
    if (!appIsQuitting && settings.minimizeToTray) {
      event.preventDefault();
      mainWindow.hide();
      if (!settings.trayHintShown) {
        showNotification(
          'Hermes läuft im Hintergrund',
          'Hinweis: Unter Windows liegt das Tray-Icon oft zuerst im Anpassungsbereich der Taskleiste.'
        );
        saveDesktopSettings({ trayHintShown: true });
      }
    }
  });

  mainWindow.once('ready-to-show', () => {
    const settings = getDesktopSettings();
    const loginInfo = app.getLoginItemSettings();
    const hiddenAutostart = settings.hideOnAutostart && loginInfo.wasOpenedAtLogin;
    if (!hiddenAutostart) {
      mainWindow.show();
    }
  });

  if (isDev) {
    await mainWindow.loadURL(frontendDevUrl);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
    await mainWindow.loadFile(indexPath);
  }
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    ensureDesktopSettingsFile();
    startBackend();
    createTray();
    setTimeout(() => {
      createWindow().catch((err) => console.error(err));
    }, isDev ? 2000 : 1000);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().catch((err) => console.error(err));
      } else if (mainWindow) {
        mainWindow.show();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') return;
});

app.on('before-quit', () => {
  appIsQuitting = true;
  stopBackend();
});

ipcMain.handle('app:openExternal', async (_event, url) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle('dialog:selectLlamaExe', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'llama-server.exe auswählen',
    buttonLabel: 'Auswählen',
    filters: [
      { name: 'Executables', extensions: ['exe'] },
      { name: 'Alle Dateien', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths.length) {
    return { success: false };
  }

  return { success: true, path: result.filePaths[0] };
});

ipcMain.handle('dialog:selectGgufModel', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'GGUF-Modell auswählen',
    buttonLabel: 'Modell laden',
    filters: [
      { name: 'GGUF Modelle', extensions: ['gguf'] },
      { name: 'Alle Dateien', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths.length) {
    return { success: false };
  }

  return { success: true, path: result.filePaths[0] };
});

ipcMain.handle('app:showItemInFolder', async (_event, filePath) => {
  shell.showItemInFolder(filePath);
  return true;
});

ipcMain.handle('desktop:getSettings', async () => {
  return getDesktopSettings();
});

ipcMain.handle('desktop:saveSettings', async (_event, nextSettings) => {
  const saved = saveDesktopSettings(nextSettings || {});
  if (Object.prototype.hasOwnProperty.call(nextSettings || {}, 'autostart')) {
    toggleAutostart(Boolean(nextSettings.autostart));
    return getDesktopSettings();
  }
  updateTrayMenu();
  return saved;
});

ipcMain.handle('desktop:notify', async (_event, payload) => {
  const title = payload?.title || 'Hermes Control Center';
  const body = payload?.body || '';
  const urgent = Boolean(payload?.urgent);
  showNotification(title, body, urgent);
  return true;
});

ipcMain.handle('tray:updateState', async (_event, payload) => {
  serverRunning = Boolean(payload?.serverRunning);
  if (payload?.serverUrl) {
    lastKnownServerUrl = payload.serverUrl;
  }
  updateTrayMenu();
  return true;
});
