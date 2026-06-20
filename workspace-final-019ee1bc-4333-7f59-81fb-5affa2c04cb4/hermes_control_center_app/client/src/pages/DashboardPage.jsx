import StatusCard from '../components/StatusCard';
import CopyField from '../components/CopyField';
import Section from '../components/Section';

export default function DashboardPage({
  config,
  serverStatus,
  integrations,
  refreshAll,
  openWizard,
  onStartServer,
  onStopServer,
  desktopSettings
}) {
  const hermesBaseUrl = config?.hermes?.baseUrl || 'http://127.0.0.1:8080/v1';
  const healthUrl = hermesBaseUrl.replace(/\/v1$/, '') + '/health';

  async function openUrl(url) {
    if (window.desktopBridge?.openExternal) {
      await window.desktopBridge.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }

  return (
    <>
      <div className="hero">
        <h2>Lokale KI-Steuerung mit Desktop-Fokus</h2>
        <p>
          Dieses Grundgerüst verbindet einen lokalen llama.cpp-Server mit Hermes,
          GitHub, Hugging Face und Gemini / Google AI Studio.
        </p>
        <div className="buttonRow">
          <button className="primaryButton" onClick={refreshAll}>Alles aktualisieren</button>
          <button onClick={openWizard}>Setup-Assistent</button>
          <button onClick={serverStatus?.running ? onStopServer : onStartServer}>
            {serverStatus?.running ? 'Server stoppen' : 'Server starten'}
          </button>
        </div>
      </div>

      <div className="grid cols-4">
        <StatusCard title="llama.cpp Status">
          <p><strong>Läuft:</strong> {serverStatus?.running ? 'Ja' : 'Nein'}</p>
          <p><strong>PID:</strong> {serverStatus?.pid || '—'}</p>
          <p><strong>Health:</strong> {serverStatus?.healthOk ? 'OK' : 'nicht erreichbar'}</p>
        </StatusCard>

        <StatusCard title="Aktives Profil">
          <p>{config?.llamacpp?.modelPath || 'Kein Modell gesetzt'}</p>
          <p>Kontext: {config?.llamacpp?.context || '—'}</p>
          <p>Slots: {config?.llamacpp?.parallel || '—'}</p>
        </StatusCard>

        <StatusCard title="Hermes-Anbindung">
          <p>Provider: {config?.hermes?.provider || 'custom'}</p>
          <p>Context Length: {config?.hermes?.contextLength || 64000}</p>
          <p>Base URL: {hermesBaseUrl}</p>
        </StatusCard>

        <StatusCard title="Desktop-Modus">
          <p>Autostart: {desktopSettings?.autostart ? 'aktiv' : 'aus'}</p>
          <p>Tray-Minimierung: {desktopSettings?.minimizeToTray ? 'aktiv' : 'aus'}</p>
          <p>Benachrichtigungen: {desktopSettings?.notifications ? 'aktiv' : 'aus'}</p>
        </StatusCard>
      </div>

      <Section title="Hermes Quick Connect Panel">
        <div className="grid cols-2">
          <CopyField label="Hermes Provider" value={config?.hermes?.provider || 'custom'} />
          <CopyField label="Hermes Base URL" value={hermesBaseUrl} />
          <CopyField label="Hermes Context Length" value={String(config?.hermes?.contextLength || 64000)} />
          <CopyField label="llama.cpp Health URL" value={healthUrl} />
        </div>
        <div className="buttonRow" style={{ marginTop: 14 }}>
          <button onClick={() => openUrl(serverStatus?.baseUrl || 'http://127.0.0.1:8080')}>WebUI öffnen</button>
          <button onClick={() => openUrl(hermesBaseUrl)}>OpenAI Endpoint öffnen</button>
        </div>
        <div className="infoBox" style={{ marginTop: 14 }}>
          <strong>Hinweis:</strong> In Hermes solltest du normalerweise <code>Custom endpoint</code>, die Base URL <code>{hermesBaseUrl}</code> und eine Context Length von <code>{config?.hermes?.contextLength || 64000}</code> verwenden.
        </div>
      </Section>

      <Section title="Integrationsüberblick">
        <div className="grid cols-3">
          <StatusCard title="GitHub">
            <p>Status: {integrations?.github?.ok ? 'verbunden' : 'nicht bereit'}</p>
            <p>Info: {integrations?.github?.login || integrations?.github?.message || '—'}</p>
          </StatusCard>
          <StatusCard title="Hugging Face">
            <p>Status: {integrations?.huggingface?.ok ? 'verbunden' : 'nicht bereit'}</p>
            <p>Modell: {integrations?.huggingface?.model || integrations?.huggingface?.message || '—'}</p>
          </StatusCard>
          <StatusCard title="Gemini / AI Studio">
            <p>Status: {integrations?.gemini?.ok ? 'verbunden' : 'nicht bereit'}</p>
            <p>Modell: {integrations?.gemini?.model || integrations?.gemini?.message || '—'}</p>
          </StatusCard>
        </div>
      </Section>
    </>
  );
}
