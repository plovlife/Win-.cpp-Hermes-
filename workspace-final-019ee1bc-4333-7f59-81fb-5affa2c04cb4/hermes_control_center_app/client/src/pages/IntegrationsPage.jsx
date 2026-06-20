import Section from '../components/Section';

function IntegrationCard({ title, status, onTest, secretName }) {
  return (
    <div className="card subtle">
      <h3>{title}</h3>
      <p><strong>Secret:</strong> {secretName}</p>
      <p><strong>Konfiguriert:</strong> {status?.configured ? 'Ja' : 'Nein'}</p>
      <p><strong>Status:</strong> {status?.ok ? 'OK' : (status?.message || 'nicht getestet')}</p>
      <button onClick={onTest}>Testen</button>
      {status ? <pre>{JSON.stringify(status, null, 2)}</pre> : null}
    </div>
  );
}

export default function IntegrationsPage({ integrations, onTestGitHub, onTestHuggingFace, onTestGemini }) {
  return (
    <Section title="Integrationen und API-Anbindungen">
      <div className="grid cols-3">
        <IntegrationCard title="GitHub" status={integrations.github} onTest={onTestGitHub} secretName="GITHUB_TOKEN" />
        <IntegrationCard title="Hugging Face" status={integrations.huggingface} onTest={onTestHuggingFace} secretName="HF_TOKEN" />
        <IntegrationCard title="Gemini / Google AI Studio" status={integrations.gemini} onTest={onTestGemini} secretName="GEMINI_API_KEY" />
      </div>

      <div className="infoBox" style={{ marginTop: 16 }}>
        <strong>Wichtig:</strong> Secrets sollen serverseitig gesetzt werden. In Google AI Studio soll <code>GEMINI_API_KEY</code> als Secret verwendet werden. Weitere Secrets wie <code>GITHUB_TOKEN</code> und <code>HF_TOKEN</code> ebenfalls nur serverseitig nutzen.
      </div>
    </Section>
  );
}
