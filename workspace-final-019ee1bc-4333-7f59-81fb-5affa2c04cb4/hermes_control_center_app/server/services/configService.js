const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const configPath = path.join(dataDir, 'app-config.json');
const profilesPath = path.join(dataDir, 'profiles.json');

const defaultConfig = {
  app: {
    name: 'Hermes Control Center',
    language: 'de'
  },
  llamacpp: {
    exePath: 'C:\\llama.cpp\\llama-server.exe',
    modelPath: 'C:\\000.mAIn\\Model\\01_LLMs\\GGUF\\hermes-3-llama-3.1-8b-q6_k.gguf',
    host: '127.0.0.1',
    port: 8080,
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
  },
  hermes: {
    provider: 'custom',
    baseUrl: 'http://127.0.0.1:8080/v1',
    contextLength: 64000
  },
  integrations: {
    github: {
      enabled: true,
      defaultOwner: process.env.GITHUB_OWNER || '',
      defaultRepo: process.env.GITHUB_REPO || ''
    },
    huggingface: {
      enabled: true,
      defaultModel: process.env.HF_DEFAULT_MODEL || 'gpt2'
    },
    gemini: {
      enabled: true,
      defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-3.5-flash'
    }
  }
};

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  }
  if (!fs.existsSync(profilesPath)) {
    fs.writeFileSync(profilesPath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readJson(filePath, fallback) {
  ensureFiles();
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureFiles();
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
  return value;
}

function getConfig() {
  return readJson(configPath, defaultConfig);
}

function saveConfig(nextConfig) {
  const merged = {
    ...getConfig(),
    ...nextConfig,
    llamacpp: {
      ...getConfig().llamacpp,
      ...(nextConfig.llamacpp || {})
    },
    hermes: {
      ...getConfig().hermes,
      ...(nextConfig.hermes || {})
    },
    integrations: {
      ...getConfig().integrations,
      ...(nextConfig.integrations || {})
    }
  };

  return writeJson(configPath, merged);
}

function getProfiles() {
  return readJson(profilesPath, []);
}

function saveProfiles(profiles) {
  return writeJson(profilesPath, profiles);
}

function createProfile(profile) {
  const profiles = getProfiles();
  const newProfile = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    ...profile
  };
  profiles.push(newProfile);
  saveProfiles(profiles);
  return newProfile;
}

function deleteProfile(id) {
  const profiles = getProfiles().filter((item) => item.id !== id);
  saveProfiles(profiles);
  return true;
}

function loadProfileIntoConfig(id) {
  const profiles = getProfiles();
  const profile = profiles.find((item) => item.id === id);
  if (!profile) {
    throw new Error('Profil nicht gefunden.');
  }

  const config = getConfig();
  const next = {
    ...config,
    llamacpp: {
      ...config.llamacpp,
      ...(profile.llamacpp || {})
    },
    hermes: {
      ...config.hermes,
      ...(profile.hermes || {})
    }
  };

  saveConfig(next);
  return next;
}

module.exports = {
  getConfig,
  saveConfig,
  getProfiles,
  saveProfiles,
  createProfile,
  deleteProfile,
  loadProfileIntoConfig,
  ensureFiles
};
