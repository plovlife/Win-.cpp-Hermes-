import { useEffect, useState } from 'react';
import CopyField from '../components/CopyField';
import Section from '../components/Section';

export default function SettingsPage({ config, desktopSettings, saveDesktopSettings, notifyDesktop }) {
  const [localSettings, setLocalSettings] = useState(desktopSettings);
  const baseUrl = config?.hermes?.baseUrl || 'http://127.0.0.1:8080/v1';

  useEffect(() => {
    setLocalSettings(desktopSettings);
  }, [desktopSettings]);

  function updateSetting(field, value) {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function saveSettings() {
    const saved = await saveDesktopSettings(localSettings);
    setLocalSettings(saved);
    alert('Desktop-Einstellungen gespeichert.');
  }

  async function sendTestNotification() {
    await notifyDesktop('Hermes Control Center', 'Dies ist eine Test-Benachrichtigung aus der Desktop-App.');
  }

  return (
    <>
      <Section title="Hermes Schnellkonfiguration">
        <div className="grid cols-2">
          <CopyField label="Provider" value={config?.hermes?.provider || 'custom'} />
          <CopyField label="Base URL" value={baseUrl} />
          <CopyField label="Context Length" value={String(config?.hermes?.contextLength || 64000)} />
          <CopyField label="Health URL" value={baseUrl.replace(/\/v1$/, '') + '/health'} />
        </div>
      </Section>

      <Section title="Desktop-Verhalten"
        actions={<div className="buttonRow"><button className="primaryButton" onClick={saveSettings}>Desktop-Einstellungen speichern</button><button onClick={sendTestNotification}>Test-Benachrichtigung</button></div>}
      >
        <div className="formGrid twoCols">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={Boolean(localSettings?.autostart)}
              onChange={(e) => updateSetting('autostart', e.target.checked)}
            />
            Autostart aktivieren
          </label>

          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={Boolean(localSettings?.minimizeToTray)}
              onChange={(e) => updateSetting('minimizeToTray', e.target.checked)}
            />
            Beim Schließen in den Tray minimieren
          </label>

          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={Boolean(localSettings?.notifications)}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
            />
            Native Benachrichtigungen erlauben
          </label>

          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={Boolean(localSettings?.hideOnAutostart)}
              onChange={(e) => updateSetting('hideOnAutostart', e.target.checked)}
            />
            Beim Autostart unsichtbar im Hintergrund starten
          </label>

          <label>
            Health-Polling in Sekunden
            <input
              type="number"
              min="3"
              max="60"
              value={localSettings?.healthPollSeconds || 5}
              onChange={(e) => updateSetting('healthPollSeconds', Number(e.target.value))}
            />
          </label>

          <label>
            Theme-Modus
            <select value={localSettings?.theme || 'dark'} onChange={(e) => updateSetting('theme', e.target.value)}>
              <option value="dark">dark</option>
              <option value="system">system</option>
            </select>
          </label>
        </div>
        <div className="infoBox" style={{ marginTop: 14 }}>
          <strong>Windows-Hinweis:</strong> Tray-Icons landen unter Windows oft zuerst im Anpassungsbereich der Taskleiste. Das ist normal und kein Fehler der App.
        </div>
      </Section>

      <Section title="Produktprinzipien">
        <ul className="plainList">
          <li>llama.cpp bleibt das lokale Haupt-Backend.</li>
          <li>Hermes wird angebunden, aber nicht neu implementiert.</li>
          <li>Secrets bleiben serverseitig.</li>
          <li>Die App soll für KI-gestützte Weiterentwicklung gut lesbar und modular sein.</li>
          <li>Der Desktop-Charakter mit Tray, Autostart und Diagnose ist ausdrücklich gewünscht.</li>
        </ul>
      </Section>
    </>
  );
}
