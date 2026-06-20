import { useState } from 'react';

const PRESETS = {
  balanced: {
    label: 'Empfohlen – Hermes 8B / 64k',
    values: {
      context: 65536,
      gpuLayers: 'all',
      parallel: 1,
      cacheTypeK: 'q8_0',
      cacheTypeV: 'q8_0',
      flashAttention: 'on',
      batch: 2048,
      uBatch: 512,
      threads: 8,
      jinja: true
    }
  },
  safer: {
    label: 'Vorsichtig – erster Test',
    values: {
      context: 32768,
      gpuLayers: 'all',
      parallel: 1,
      cacheTypeK: 'q8_0',
      cacheTypeV: 'q8_0',
      flashAttention: 'on',
      batch: 1024,
      uBatch: 256,
      threads: 8,
      jinja: true
    }
  }
};

export default function SetupWizard({ config, setConfig, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const ll = config.llamacpp;

  async function selectExe() {
    if (!window.desktopBridge?.selectLlamaExe) {
      alert('Dateiauswahl ist nur in der Electron-App verfügbar.');
      return;
    }
    const result = await window.desktopBridge.selectLlamaExe();
    if (result?.success) {
      setConfig({
        ...config,
        llamacpp: {
          ...config.llamacpp,
          exePath: result.path
        }
      });
      setMessage('llama-server.exe wurde gesetzt.');
    }
  }

  async function selectModel() {
    if (!window.desktopBridge?.selectGgufModel) {
      alert('Dateiauswahl ist nur in der Electron-App verfügbar.');
      return;
    }
    const result = await window.desktopBridge.selectGgufModel();
    if (result?.success) {
      setConfig({
        ...config,
        llamacpp: {
          ...config.llamacpp,
          modelPath: result.path
        }
      });
      setMessage('GGUF-Modell wurde gesetzt.');
    }
  }

  function applyPreset(key) {
    const preset = PRESETS[key];
    setConfig({
      ...config,
      llamacpp: {
        ...config.llamacpp,
        ...preset.values
      },
      hermes: {
        ...config.hermes,
        provider: 'custom',
        baseUrl: 'http://127.0.0.1:8080/v1',
        contextLength: 64000
      }
    });
    setMessage(`Preset geladen: ${preset.label}`);
  }

  async function finishWizard() {
    setSaving(true);
    try {
      await onSave(config);
      setMessage('Konfiguration wurde gespeichert.');
      setStep(4);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overlay">
      <div className="wizardModal">
        <button className="closeBtn" onClick={onClose}>×</button>
        <div className="wizardProgress">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className={num === step ? 'progressStep active' : num < step ? 'progressStep done' : 'progressStep'}>
              <div className="progressDot">{num}</div>
              <div className="progressLabel">
                {num === 1 && 'Dateien'}
                {num === 2 && 'Preset'}
                {num === 3 && 'Prüfen'}
                {num === 4 && 'Fertig'}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="wizardBody">
            <h3>Schritt 1 – Dateien auswählen</h3>
            <p>Wähle zuerst deine <code>llama-server.exe</code> und danach dein <code>.gguf</code>-Modell.</p>
            <div className="buttonRow">
              <button className="primaryButton" onClick={selectExe}>llama-server.exe auswählen</button>
              <button onClick={selectModel}>GGUF-Modell auswählen</button>
            </div>
            <div className="configSummary" style={{ marginTop: 16 }}>
              <div className="summaryLine"><strong>EXE:</strong> <span>{ll.exePath || 'noch nicht gesetzt'}</span></div>
              <div className="summaryLine"><strong>Modell:</strong> <span>{ll.modelPath || 'noch nicht gesetzt'}</span></div>
            </div>
            <div className="wizardFooter">
              <div className="wizardStatus">{message}</div>
              <button className="primaryButton" onClick={() => setStep(2)} disabled={!ll.exePath || !ll.modelPath}>Weiter</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizardBody">
            <h3>Schritt 2 – Startpreset auswählen</h3>
            <p>Wähle ein Startprofil. Für Hermes ist das 64k-Preset standardmäßig am sinnvollsten.</p>
            <div className="presetRow">
              <button className="presetBtn" onClick={() => applyPreset('balanced')}>{PRESETS.balanced.label}</button>
              <button className="presetBtn" onClick={() => applyPreset('safer')}>{PRESETS.safer.label}</button>
            </div>
            <div className="wizardFooter">
              <button onClick={() => setStep(1)}>Zurück</button>
              <div className="wizardStatus">{message}</div>
              <button className="primaryButton" onClick={() => setStep(3)}>Weiter</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizardBody">
            <h3>Schritt 3 – Zusammenfassung prüfen</h3>
            <div className="configSummary">
              <div className="summaryLine"><strong>EXE:</strong> <span>{ll.exePath}</span></div>
              <div className="summaryLine"><strong>Modell:</strong> <span>{ll.modelPath}</span></div>
              <div className="summaryLine"><strong>Host/Port:</strong> <span>{ll.host}:{ll.port}</span></div>
              <div className="summaryLine"><strong>Kontext:</strong> <span>{ll.context}</span></div>
              <div className="summaryLine"><strong>GPU-Layer:</strong> <span>{ll.gpuLayers}</span></div>
              <div className="summaryLine"><strong>Slots:</strong> <span>{ll.parallel}</span></div>
              <div className="summaryLine"><strong>KV Cache:</strong> <span>{ll.cacheTypeK} / {ll.cacheTypeV}</span></div>
              <div className="summaryLine"><strong>Flash Attention:</strong> <span>{ll.flashAttention}</span></div>
              <div className="summaryLine"><strong>Hermes URL:</strong> <span>{config.hermes.baseUrl}</span></div>
              <div className="summaryLine"><strong>Hermes Context:</strong> <span>{config.hermes.contextLength}</span></div>
            </div>
            <div className="wizardFooter">
              <button onClick={() => setStep(2)}>Zurück</button>
              <div className="wizardStatus">{message}</div>
              <button className="primaryButton" onClick={finishWizard} disabled={saving}>{saving ? 'Speichere…' : 'Speichern und fertig'}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizardBody wizardDone">
            <div className="doneIcon">✅</div>
            <h3>Setup abgeschlossen</h3>
            <p>Die Grundkonfiguration wurde gespeichert. Du kannst jetzt zur llama.cpp-Seite wechseln und den Server starten.</p>
            <div className="configSummary">
              <div className="summaryLine"><strong>Hermes Base URL:</strong> <span>{config.hermes.baseUrl}</span></div>
              <div className="summaryLine"><strong>Hermes Context Length:</strong> <span>{config.hermes.contextLength}</span></div>
            </div>
            <div className="wizardFooter">
              <div className="wizardStatus">{message}</div>
              <button className="primaryButton" onClick={onClose}>Schließen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
