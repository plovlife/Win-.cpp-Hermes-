import { useRef, useState } from 'react';
import Section from '../components/Section';

const API_BASE = 'http://127.0.0.1:3001';

export default function ChatPage({ config, serverStatus }) {
  const [systemPrompt, setSystemPrompt] = useState('Du bist ein hilfreicher lokaler Assistent.');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  async function startChat() {
    if (!input.trim() || streaming) return;

    const nextMessages = [...messages, { role: 'user', content: input }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setStreaming(true);
    setError('');
    setStats(null);

    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = performance.now();
    const userInput = input;
    setInput('');

    try {
      const response = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config?.hermes?.baseUrl || 'local',
          systemPrompt,
          messages: nextMessages,
          options: {
            temperature: 0.2,
            stream: true
          }
        }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(`Chat-Fehler: HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';
      let tokenCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let splitIndex;
        while ((splitIndex = buffer.indexOf('\n\n')) !== -1) {
          const rawEvent = buffer.slice(0, splitIndex).trim();
          buffer = buffer.slice(splitIndex + 2);
          if (!rawEvent) continue;

          const lines = rawEvent.split('\n').filter((line) => line.startsWith('data:'));
          for (const line of lines) {
            const data = line.slice(5).trim();
            if (!data || data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed?.choices?.[0]?.delta?.content || parsed?.choices?.[0]?.message?.content || '';
              const finishReason = parsed?.choices?.[0]?.finish_reason;
              const timings = parsed?.timings || null;

              if (delta) {
                assistantText += delta;
                tokenCount += 1;
                setMessages([...nextMessages, { role: 'assistant', content: assistantText }]);
              }

              if (finishReason || timings) {
                const elapsedMs = Math.round(performance.now() - startedAt);
                setStats({
                  elapsedMs,
                  tokenCount,
                  chars: assistantText.length,
                  approxMsPerToken: tokenCount > 0 ? Math.round(elapsedMs / tokenCount) : null,
                  timings
                });
              }
            } catch (parseError) {
              if (data.toLowerCase().includes('error')) {
                setError(data);
              }
            }
          }
        }
      }

      const elapsedMs = Math.round(performance.now() - startedAt);
      setStats((prev) => prev || {
        elapsedMs,
        tokenCount,
        chars: assistantText.length,
        approxMsPerToken: tokenCount > 0 ? Math.round(elapsedMs / tokenCount) : null
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unbekannter Streaming-Fehler');
        setMessages([...nextMessages, { role: 'assistant', content: 'Fehler beim lokalen Chat-Streaming.' }]);
      } else {
        setMessages([...nextMessages, { role: 'assistant', content: 'Streaming manuell gestoppt.' }]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      setInput((current) => current || '');
      if (!messages.length) {
        setInput('');
      }
    }
  }

  function stopChat() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }

  function clearChat() {
    setMessages([]);
    setStats(null);
    setError('');
    setInput('');
  }

  async function openEndpoint() {
    const url = serverStatus?.openAiUrl || config?.hermes?.baseUrl || 'http://127.0.0.1:8080/v1';
    if (window.desktopBridge?.openExternal) {
      await window.desktopBridge.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }

  return (
    <>
      <Section
        title="Lokales Chat-Testfenster"
        actions={
          <div className="buttonRow">
            <button onClick={openEndpoint}>Endpoint öffnen</button>
            <button onClick={clearChat}>Verlauf löschen</button>
          </div>
        }
      >
        <div className="infoBox">
          Diese Seite dient zum direkten Testen deines lokalen llama.cpp-Servers über Streaming. Sie ist absichtlich einfacher als Hermes und ideal für Diagnose, Modelltests und Prompt-Experimente.
        </div>

        <div className="formGrid twoCols" style={{ marginTop: 16 }}>
          <label>
            System Prompt
            <textarea rows="4" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
          </label>
          <div className="card subtle">
            <h3>Aktive Serverdaten</h3>
            <p><strong>Läuft:</strong> {serverStatus?.running ? 'Ja' : 'Nein'}</p>
            <p><strong>Health:</strong> {serverStatus?.healthOk ? 'OK' : 'nicht erreichbar'}</p>
            <p><strong>Endpoint:</strong> {serverStatus?.openAiUrl || config?.hermes?.baseUrl}</p>
          </div>
        </div>

        <div className="chatLayout">
          <div className="chatTranscript">
            {messages.length === 0 ? (
              <div className="chatPlaceholder">Noch keine Nachrichten. Stelle unten eine erste Testfrage an dein lokales Modell.</div>
            ) : messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={msg.role === 'user' ? 'chatBubble user' : 'chatBubble assistant'}>
                <div className="chatRole">{msg.role === 'user' ? 'Du' : 'Lokales Modell'}</div>
                <div className="chatText">{msg.content}</div>
              </div>
            ))}
          </div>

          <div className="chatComposer card subtle">
            <label>
              Deine Nachricht
              <textarea rows="6" value={input} onChange={(e) => setInput(e.target.value)} placeholder="z. B. Erkläre mir kurz, ob der lokale Server korrekt reagiert." />
            </label>
            <div className="buttonRow" style={{ marginTop: 12 }}>
              <button className="primaryButton" onClick={startChat} disabled={streaming || !input.trim()}>
                {streaming ? 'Streaming läuft…' : 'Streaming starten'}
              </button>
              <button onClick={stopChat} disabled={!streaming}>Stop</button>
            </div>
            {error ? <div className="errorBox">{error}</div> : null}
            {stats ? (
              <div className="statsBox">
                <strong>Stats:</strong>
                <div>Laufzeit: {stats.elapsedMs} ms</div>
                <div>Tokens (approx): {stats.tokenCount}</div>
                <div>Zeichen: {stats.chars}</div>
                <div>ms/Token (approx): {stats.approxMsPerToken ?? '—'}</div>
              </div>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
