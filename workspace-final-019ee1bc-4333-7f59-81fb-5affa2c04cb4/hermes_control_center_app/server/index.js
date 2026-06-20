const express = require('express');
const cors = require('cors');
const configService = require('./services/configService');
const llamaService = require('./services/llamacppService');
const { testGitHubConnection } = require('./services/githubService');
const { testHuggingFaceConnection } = require('./services/huggingfaceService');
const { testGeminiConnection } = require('./services/geminiService');

configService.ensureFiles();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    name: 'Hermes Control Center Backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (_req, res) => {
  res.json(configService.getConfig());
});

app.put('/api/config', (req, res) => {
  const saved = configService.saveConfig(req.body || {});
  res.json(saved);
});

app.get('/api/profiles', (_req, res) => {
  res.json(configService.getProfiles());
});

app.post('/api/profiles', (req, res) => {
  const created = configService.createProfile(req.body || {});
  res.json(created);
});

app.put('/api/profiles/:id/load', (req, res) => {
  const nextConfig = configService.loadProfileIntoConfig(req.params.id);
  res.json(nextConfig);
});

app.delete('/api/profiles/:id', (req, res) => {
  configService.deleteProfile(req.params.id);
  res.json({ ok: true });
});

app.get('/api/server/status', async (_req, res) => {
  const config = configService.getConfig();
  const status = await llamaService.getStatus(config);
  res.json(status);
});

app.post('/api/server/start', async (req, res) => {
  const config = req.body && req.body.llamacpp
    ? configService.saveConfig(req.body)
    : configService.getConfig();

  llamaService.start(config);
  const status = await llamaService.getStatus(config);
  res.json({ ok: true, status });
});

app.post('/api/server/stop', (_req, res) => {
  const stopped = llamaService.stop();
  res.json({ ok: true, stopped });
});

app.post('/api/server/restart', async (req, res) => {
  llamaService.stop();
  const config = req.body && req.body.llamacpp
    ? configService.saveConfig(req.body)
    : configService.getConfig();
  llamaService.start(config);
  const status = await llamaService.getStatus(config);
  res.json({ ok: true, status });
});

app.get('/api/server/health', async (_req, res) => {
  const config = configService.getConfig();
  const payload = await llamaService.getHealth(config);
  res.json({ ok: true, payload });
});

app.get('/api/server/models', async (_req, res) => {
  const config = configService.getConfig();
  const payload = await llamaService.getModels(config);
  res.json(payload);
});

app.post('/api/chat/stream', async (req, res, next) => {
  try {
    const config = configService.getConfig();
    const baseUrl = (config.hermes?.baseUrl || `http://127.0.0.1:${config.llamacpp.port}/v1`).replace(/\/$/, '');
    const upstreamUrl = `${baseUrl}/chat/completions`;

    const upstreamMessages = [];
    if (req.body?.systemPrompt) {
      upstreamMessages.push({ role: 'system', content: req.body.systemPrompt });
    }
    for (const msg of req.body?.messages || []) {
      upstreamMessages.push({ role: msg.role, content: msg.content });
    }

    const upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'local-model',
        messages: upstreamMessages,
        stream: true,
        temperature: req.body?.options?.temperature ?? 0.2
      })
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      const text = await upstreamRes.text().catch(() => '');
      res.status(upstreamRes.status).json({
        ok: false,
        error: `Upstream-Fehler ${upstreamRes.status}`,
        details: text
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    const reader = upstreamRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/integrations/status', async (_req, res) => {
  const [github, huggingface, gemini] = await Promise.all([
    testGitHubConnection(),
    testHuggingFaceConnection(),
    testGeminiConnection()
  ]);

  res.json({ github, huggingface, gemini });
});

app.get('/api/integrations/github/test', async (_req, res) => {
  res.json(await testGitHubConnection());
});

app.get('/api/integrations/huggingface/test', async (_req, res) => {
  res.json(await testHuggingFaceConnection());
});

app.get('/api/integrations/gemini/test', async (_req, res) => {
  res.json(await testGeminiConnection());
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    ok: false,
    error: error.message || 'Unbekannter Fehler'
  });
});

app.listen(port, () => {
  console.log(`Hermes Control Center Backend laeuft auf http://127.0.0.1:${port}`);
});
