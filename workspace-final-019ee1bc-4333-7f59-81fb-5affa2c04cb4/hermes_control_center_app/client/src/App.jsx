import { useEffect, useState } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import LlamaPage from './pages/LlamaPage';
import IntegrationsPage from './pages/IntegrationsPage';
import ProfilesPage from './pages/ProfilesPage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';
import SetupWizard from './components/SetupWizard';

const defaultDesktopSettings = {
  autostart: false,
  minimizeToTray: true,
  notifications: true,
  hideOnAutostart: true,
  theme: 'dark',
  healthPollSeconds: 5,
  trayHintShown: false
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [config, setConfig] = useState({
    app: {},
    llamacpp: {},
    hermes: {},
    integrations: {}
  });
  const [serverStatus, setServerStatus] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [integrations, setIntegrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [desktopSettings, setDesktopSettings] = useState(defaultDesktopSettings);

  async function notifyDesktop(title, body, urgent = false) {
    if (window.desktopBridge?.notify) {
      await window.desktopBridge.notify({ title, body, urgent });
    }
  }

  async function refreshConfig() {
    const data = await api.getConfig();
    setConfig(data);
    return data;
  }

  async function refreshServer() {
    const data = await api.getServerStatus();
    setServerStatus(data);
    if (window.desktopBridge?.updateTrayState) {
      await window.desktopBridge.updateTrayState({
        serverRunning: Boolean(data?.running),
        serverUrl: data?.baseUrl || `http://${config?.llamacpp?.host || '127.0.0.1'}:${config?.llamacpp?.port || 8080}`
      });
    }
    return data;
  }

  async function refreshProfiles() {
    const data = await api.getProfiles();
    setProfiles(data);
    return data;
  }

  async function refreshIntegrations() {
    const data = await api.getIntegrationsStatus();
    setIntegrations(data);
    return data;
  }

  async function refreshDesktopSettings() {
    if (window.desktopBridge?.getDesktopSettings) {
      const data = await window.desktopBridge.getDesktopSettings();
      setDesktopSettings(data);
      return data;
    }
    return defaultDesktopSettings;
  }

  async function refreshAll() {
    setLoading(true);
    try {
      await Promise.all([
        refreshConfig(),
        refreshServer(),
        refreshProfiles(),
        refreshIntegrations(),
        refreshDesktopSettings()
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll().catch((error) => {
      console.error(error);
      alert(error.message);
    });
  }, []);

  useEffect(() => {
    const seconds = Math.max(3, Number(desktopSettings?.healthPollSeconds || 5));
    const timer = setInterval(() => {
      refreshServer().catch(() => {});
    }, seconds * 1000);
    return () => clearInterval(timer);
  }, [desktopSettings?.healthPollSeconds, config?.llamacpp?.host, config?.llamacpp?.port]);

  async function saveConfig(nextConfig) {
    const saved = await api.saveConfig(nextConfig);
    setConfig(saved);
    return saved;
  }

  async function saveDesktopSettings(nextSettings) {
    if (window.desktopBridge?.saveDesktopSettings) {
      const saved = await window.desktopBridge.saveDesktopSettings(nextSettings);
      setDesktopSettings(saved);
      return saved;
    }
    return defaultDesktopSettings;
  }

  async function startServer() {
    await api.startServer(config);
    await refreshServer();
    await notifyDesktop('llama.cpp gestartet', 'Der lokale Server wurde erfolgreich gestartet.');
  }

  async function stopServer() {
    await api.stopServer();
    await refreshServer();
    await notifyDesktop('llama.cpp gestoppt', 'Der lokale Server wurde beendet.');
  }

  async function restartServer() {
    await api.restartServer(config);
    await refreshServer();
    await notifyDesktop('llama.cpp neu gestartet', 'Der lokale Server wurde neu gestartet.');
  }

  async function testGitHub() {
    const result = await api.testGitHub();
    setIntegrations((prev) => ({ ...prev, github: result }));
  }

  async function testHuggingFace() {
    const result = await api.testHuggingFace();
    setIntegrations((prev) => ({ ...prev, huggingface: result }));
  }

  async function testGemini() {
    const result = await api.testGemini();
    setIntegrations((prev) => ({ ...prev, gemini: result }));
  }

  async function createProfile(payload) {
    await api.createProfile(payload);
  }

  async function loadProfile(id) {
    const next = await api.loadProfile(id);
    setConfig(next);
    await refreshServer();
    alert('Profil geladen.');
  }

  async function deleteProfile(id) {
    if (!window.confirm('Profil wirklich löschen?')) return;
    await api.deleteProfile(id);
    await refreshProfiles();
  }

  function renderPage() {
    if (loading) {
      return <div className="page"><div className="hero"><h2>Lade Daten…</h2></div></div>;
    }

    switch (page) {
      case 'llama':
        return (
          <LlamaPage
            config={config}
            setConfig={setConfig}
            onSaveConfig={saveConfig}
            onStart={startServer}
            onStop={stopServer}
            onRestart={restartServer}
            onRefreshServer={refreshServer}
            serverStatus={serverStatus}
          />
        );
      case 'chat':
        return <ChatPage config={config} serverStatus={serverStatus} />;
      case 'integrations':
        return (
          <IntegrationsPage
            integrations={integrations}
            onTestGitHub={testGitHub}
            onTestHuggingFace={testHuggingFace}
            onTestGemini={testGemini}
          />
        );
      case 'profiles':
        return (
          <ProfilesPage
            profiles={profiles}
            config={config}
            onCreateProfile={createProfile}
            onLoadProfile={loadProfile}
            onDeleteProfile={deleteProfile}
            refreshProfiles={refreshProfiles}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            config={config}
            desktopSettings={desktopSettings}
            saveDesktopSettings={saveDesktopSettings}
            notifyDesktop={notifyDesktop}
          />
        );
      default:
        return (
          <DashboardPage
            config={config}
            serverStatus={serverStatus}
            integrations={integrations}
            refreshAll={refreshAll}
            openWizard={() => setShowWizard(true)}
            onStartServer={startServer}
            onStopServer={stopServer}
            desktopSettings={desktopSettings}
          />
        );
    }
  }

  return (
    <div className="appShell">
      <Sidebar page={page} setPage={setPage} />
      <main className="page">
        {renderPage()}
        {showWizard ? (
          <SetupWizard
            config={config}
            setConfig={setConfig}
            onSave={saveConfig}
            onClose={() => setShowWizard(false)}
          />
        ) : null}
      </main>
    </div>
  );
}
