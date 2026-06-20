const { spawn } = require('child_process');

let currentProcess = null;
let lastStartCommand = null;
let lastStdout = [];
let lastStderr = [];

function pushLog(target, message) {
  target.push({ timestamp: new Date().toISOString(), message });
  if (target.length > 100) target.shift();
}

function buildBaseUrl(config) {
  return `http://${config.llamacpp.host}:${config.llamacpp.port}`;
}

function buildOpenAiUrl(config) {
  return `${buildBaseUrl(config)}/v1`;
}

function buildArgs(config) {
  const ll = config.llamacpp;
  const args = [
    '-m', ll.modelPath,
    '--host', String(ll.host),
    '--port', String(ll.port),
    '-ngl', String(ll.gpuLayers),
    '-c', String(ll.context),
    '-np', String(ll.parallel),
    '-ctk', String(ll.cacheTypeK),
    '-ctv', String(ll.cacheTypeV),
    '-fa', String(ll.flashAttention),
    '-b', String(ll.batch),
    '-ub', String(ll.uBatch),
    '-t', String(ll.threads)
  ];

  if (ll.jinja) args.push('--jinja');
  return args;
}

function start(config) {
  if (currentProcess) {
    throw new Error('llama.cpp laeuft bereits.');
  }

  const exePath = config.llamacpp.exePath;
  const args = buildArgs(config);
  lastStartCommand = { exePath, args };
  lastStdout = [];
  lastStderr = [];

  currentProcess = spawn(exePath, args, {
    cwd: exePath.substring(0, exePath.lastIndexOf('\\')) || process.cwd(),
    shell: false
  });

  currentProcess.stdout.on('data', (data) => pushLog(lastStdout, data.toString()));
  currentProcess.stderr.on('data', (data) => pushLog(lastStderr, data.toString()));
  currentProcess.on('exit', (code) => {
    pushLog(lastStdout, `[EXIT] llama.cpp beendet mit Code ${code}`);
    currentProcess = null;
  });

  return true;
}

function stop() {
  if (!currentProcess) return false;
  currentProcess.kill();
  currentProcess = null;
  return true;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} bei ${url}`);
  }
  return await res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} bei ${url}`);
  }
  return await res.text();
}

async function getHealth(config) {
  const baseUrl = buildBaseUrl(config);
  return await fetchText(`${baseUrl}/health`);
}

async function getModels(config) {
  const openAiUrl = buildOpenAiUrl(config);
  return await fetchJson(`${openAiUrl}/models`);
}

async function getStatus(config) {
  const baseUrl = buildBaseUrl(config);
  const openAiUrl = buildOpenAiUrl(config);
  let health = null;
  let healthOk = false;

  try {
    health = await getHealth(config);
    healthOk = true;
  } catch (error) {
    health = error.message;
  }

  return {
    running: Boolean(currentProcess),
    pid: currentProcess ? currentProcess.pid : null,
    baseUrl,
    openAiUrl,
    healthOk,
    health,
    lastStartCommand,
    lastStdout,
    lastStderr
  };
}

module.exports = {
  start,
  stop,
  getHealth,
  getModels,
  getStatus,
  buildArgs,
  buildBaseUrl,
  buildOpenAiUrl
};
