# Adapter-Code-Snippets
## Serverseitige Beispielaufrufe in JavaScript / TypeScript

> Diese Snippets sind bewusst einfach gehalten. Sie sollen Google AI Studio zeigen, wie die Adapter ungefaehr aussehen koennen.

---

## 1. llama.cpp Health Check

```ts
export async function testLlamaHealth(baseUrl: string) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/health`);
  if (!res.ok) {
    throw new Error(`Health check fehlgeschlagen: ${res.status}`);
  }
  return await res.text();
}
```

---

## 2. llama.cpp Modelle abrufen

```ts
export async function getLlamaModels(baseUrl: string) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/models`);
  if (!res.ok) throw new Error(`Modelle konnten nicht geladen werden: ${res.status}`);
  return await res.json();
}
```

---

## 3. GitHub Testverbindung

```ts
export async function testGitHub(token: string) {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2026-03-10'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub Test fehlgeschlagen: ${res.status}`);
  }

  return await res.json();
}
```

---

## 4. Hugging Face einfacher Test

```ts
export async function testHuggingFace(token: string, model = 'gpt2') {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: 'Hello from Hermes Control Center'
    })
  });

  if (!res.ok) {
    throw new Error(`Hugging Face Test fehlgeschlagen: ${res.status}`);
  }

  return await res.json();
}
```

---

## 5. Gemini einfacher Test

```ts
export async function testGemini(apiKey: string, model = 'gemini-3.5-flash') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: 'Antworte nur mit: Verbindung erfolgreich.' }
          ]
        }
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini Test fehlgeschlagen: ${res.status}`);
  }

  return await res.json();
}
```

---

## 6. llama.cpp Child-Process Start (Windows)

```ts
import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';

let currentProcess: ChildProcessWithoutNullStreams | null = null;

export function startLlamaServer(exePath: string, args: string[]) {
  if (currentProcess) {
    throw new Error('llama.cpp laeuft bereits.');
  }

  currentProcess = spawn(exePath, args, {
    cwd: exePath.substring(0, exePath.lastIndexOf('\\')),
    shell: false
  });

  currentProcess.stdout.on('data', (data) => {
    console.log('[llama stdout]', data.toString());
  });

  currentProcess.stderr.on('data', (data) => {
    console.error('[llama stderr]', data.toString());
  });

  currentProcess.on('exit', () => {
    currentProcess = null;
  });

  return true;
}
```

---

## 7. Prozess stoppen

```ts
export function stopLlamaServer() {
  if (!currentProcess) return false;
  currentProcess.kill();
  currentProcess = null;
  return true;
}
```
