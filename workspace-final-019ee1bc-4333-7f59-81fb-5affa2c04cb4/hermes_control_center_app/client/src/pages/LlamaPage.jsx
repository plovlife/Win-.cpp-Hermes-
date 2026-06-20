import { useState } from 'react';
import Section from '../components/Section';

export default function LlamaPage({ config, setConfig, onSaveConfig, onStart, onStop, onRestart, onRefreshServer, serverStatus }) {
  const [saving, setSaving] = useState(false);

  const ll = config.llamacpp;

  function updateField(field, value) {
    setConfig({
      ...config,
      llamacpp: {
        ...config.llamacpp,
        [field]: value
      }
    });
  }

  async function chooseExe() {
    if (!window.desktopBridge?.selectLlamaExe) {
      alert('Dateiauswahl ist nur in der Electron-App verfügbar.');
      return;
    }
    const result = await window.desktopBridge.selectLlamaExe();
    if (result?.success) updateField('exePath', result.path);
  }

  async function chooseModel() {
    if (!window.desktopBridge?.selectGgufModel) {
      alert('Dateiauswahl ist nur in der Electron-App verfügbar.');
      return;
    }
    const result = await window.desktopBridge.selectGgufModel();
    if (result?.success) updateField('modelPath', result.path);
  }

  async function showInFolder(filePath) {
    if (!filePath) return;
    if (window.desktopBridge?.showItemInFolder) {
      await window.desktopBridge.showItemInFolder(filePath);
    } else {
      alert('Diese Funktion ist nur in der Electron-App verfügbar.');
    }
  }

  async function openWebUi() {
    const url = serverStatus?.baseUrl || `http://${ll.host}:${ll.port}`;
    if (window.desktopBridge?.openExternal) {
      await window.desktopBridge.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }

  async function saveOnly() {
    setSaving(true);
    try {
      await onSaveConfig(config);
      alert('Konfiguration gespeichert.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section
        title="llama.cpp Serververwaltung"
        actions={
          <div className="buttonRow">
            <button className="primaryButton" onClick={onStart}>Start</button>
            <button onClick={onStop}>Stop</button>
            <button onClick={onRestart}>Restart</button>
            <button onClick={openWebUi}>WebUI öffnen</button>
            <button onClick={onRefreshServer}>Status neu laden</button>
            <button onClick={saveOnly} disabled={saving}>{saving ? 'Speichere…' : 'Speichern'}</button>
          </div>
        }
      >
        <div className="formGrid">
          <label>
            llama-server.exe Pfad
            <input value={ll.exePath} onChange={(e) => updateField('exePath', e.target.value)} />
            <div className="buttonRow compact">
              <button type="button" onClick={chooseExe}>Datei auswählen</button>
              <button type="button" onClick={() => showInFolder(ll.exePath)}>Im Explorer zeigen</button>
            </div>
          </label>
          <label>
            Modellpfad
            <input value={ll.modelPath} onChange={(e) => updateField('modelPath', e.target.value)} />
            <div className="buttonRow compact">
              <button type="button" onClick={chooseModel}>GGUF auswählen</button>
              <button type="button" onClick={() => showInFolder(ll.modelPath)}>Im Explorer zeigen</button>
            </div>
          </label>
          <label>
            Host
            <input value={ll.host} onChange={(e) => updateField('host', e.target.value)} />
          </label>
          <label>
            Port
            <input type="number" value={ll.port} onChange={(e) => updateField('port', Number(e.target.value))} />
          </label>
          <label>
            Kontext
            <input type="number" value={ll.context} onChange={(e) => updateField('context', Number(e.target.value))} />
          </label>
          <label>
            GPU-Layer
            <input value={ll.gpuLayers} onChange={(e) => updateField('gpuLayers', e.target.value)} />
          </label>
          <label>
            Slots
            <input type="number" value={ll.parallel} onChange={(e) => updateField('parallel', Number(e.target.value))} />
          </label>
          <label>
            Cache Type K
            <input value={ll.cacheTypeK} onChange={(e) => updateField('cacheTypeK', e.target.value)} />
          </label>
          <label>
            Cache Type V
            <input value={ll.cacheTypeV} onChange={(e) => updateField('cacheTypeV', e.target.value)} />
          </label>
          <label>
            Flash Attention
            <select value={ll.flashAttention} onChange={(e) => updateField('flashAttention', e.target.value)}>
              <option value="on">on</option>
              <option value="off">off</option>
              <option value="auto">auto</option>
            </select>
          </label>
          <label>
            Batch
            <input type="number" value={ll.batch} onChange={(e) => updateField('batch', Number(e.target.value))} />
          </label>
          <label>
            UBatch
            <input type="number" value={ll.uBatch} onChange={(e) => updateField('uBatch', Number(e.target.value))} />
          </label>
          <label>
            Threads
            <input type="number" value={ll.threads} onChange={(e) => updateField('threads', Number(e.target.value))} />
          </label>
          <label className="checkboxLabel">
            <input type="checkbox" checked={ll.jinja} onChange={(e) => updateField('jinja', e.target.checked)} />
            Jinja aktiv
          </label>
        </div>
      </Section>

      <Section title="Serverstatus und Logs">
        <div className="grid cols-2">
          <div className="card subtle">
            <p><strong>Läuft:</strong> {serverStatus?.running ? 'Ja' : 'Nein'}</p>
            <p><strong>PID:</strong> {serverStatus?.pid || '—'}</p>
            <p><strong>Base URL:</strong> {serverStatus?.baseUrl || '—'}</p>
            <p><strong>OpenAI URL:</strong> {serverStatus?.openAiUrl || '—'}</p>
            <p><strong>Health:</strong> {String(serverStatus?.health || '—')}</p>
          </div>
          <div className="card subtle">
            <h4>Letzter Startbefehl</h4>
            <pre>{serverStatus?.lastStartCommand ? JSON.stringify(serverStatus.lastStartCommand, null, 2) : 'Noch kein Start erfolgt.'}</pre>
          </div>
        </div>
        <div className="grid cols-2" style={{ marginTop: 16 }}>
          <div className="card subtle">
            <h4>stdout</h4>
            <pre>{(serverStatus?.lastStdout || []).map((item) => item.message).join('\n') || 'Keine Ausgabe.'}</pre>
          </div>
          <div className="card subtle">
            <h4>stderr</h4>
            <pre>{(serverStatus?.lastStderr || []).map((item) => item.message).join('\n') || 'Keine Fehlerausgabe.'}</pre>
          </div>
        </div>
      </Section>
    </>
  );
}
