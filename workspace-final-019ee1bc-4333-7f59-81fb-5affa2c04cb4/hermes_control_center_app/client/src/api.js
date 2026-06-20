const API_BASE = 'http://127.0.0.1:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API-Fehler');
  }
  return data;
}

export const api = {
  getConfig: () => request('/api/config'),
  saveConfig: (config) => request('/api/config', { method: 'PUT', body: JSON.stringify(config) }),
  getProfiles: () => request('/api/profiles'),
  createProfile: (payload) => request('/api/profiles', { method: 'POST', body: JSON.stringify(payload) }),
  loadProfile: (id) => request(`/api/profiles/${id}/load`, { method: 'PUT' }),
  deleteProfile: (id) => request(`/api/profiles/${id}`, { method: 'DELETE' }),
  getServerStatus: () => request('/api/server/status'),
  startServer: (config) => request('/api/server/start', { method: 'POST', body: JSON.stringify(config) }),
  stopServer: () => request('/api/server/stop', { method: 'POST' }),
  restartServer: (config) => request('/api/server/restart', { method: 'POST', body: JSON.stringify(config) }),
  getServerHealth: () => request('/api/server/health'),
  getServerModels: () => request('/api/server/models'),
  getIntegrationsStatus: () => request('/api/integrations/status'),
  testGitHub: () => request('/api/integrations/github/test'),
  testHuggingFace: () => request('/api/integrations/huggingface/test'),
  testGemini: () => request('/api/integrations/gemini/test')
};
