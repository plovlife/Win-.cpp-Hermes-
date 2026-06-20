# API-Integrationen
## Technischer Integrationsplan

## 1. llama.cpp

### Zweck
Lokaler Hauptserver fuer GGUF-Modelle und Hermes-Backend.

### Wichtige Endpunkte
- `GET http://127.0.0.1:8080/health`
- `GET http://127.0.0.1:8080/v1/models`
- `POST http://127.0.0.1:8080/v1/chat/completions`

### Authentifizierung
Im lokalen MVP optional keine Authentifizierung.

### Besonderheit
Der `llama-server` stellt OpenAI-kompatible Routen bereit und kann mit einem langen Kontext sowie Jinja-Templates betrieben werden.

---

## 2. GitHub API

### Zweck
- Repo-Status anzeigen
- Issues / PRs spaeter lesen
- Repositories auflisten
- spaeter Commit-/Branch-Infos nutzbar machen

### Empfohlene Authentifizierung
- Fine-grained Personal Access Token

### Wichtiger Test-Call
- `GET https://api.github.com/user`

### Hinweise
GitHub nutzt Bearer-Authentifizierung und versionsbezogene Header in REST-Beispielen der Dokumentation [1](https://docs.github.com/en/rest/orgs/personal-access-tokens) [3](https://docs.github.com/en/rest/pulls/pulls).

### Empfohlene Secret-Namen
- `GITHUB_TOKEN`
- optional `GITHUB_OWNER`
- optional `GITHUB_REPO`

---

## 3. Hugging Face

### Zweck
- Modellsuche
- Zugriff auf Hub-Metadaten
- spaeter Inference API oder Endpoint-Anbindung

### Authentifizierung
- Bearer Token (`hf_...`)

### Wichtiger Test-Ansatz
- Token gegen Hub-/Inference-Zugriff pruefen
- spaeter Modellsuche via Hub

### Hinweise
Hugging Face dokumentiert Bearer-Tokens fuer Inference-Zugriffe und stellt OpenAI-aehnliche bzw. Client-basierte Inferenzpfade bereit [2](https://huggingface.co/docs/api-inference/en/quicktour) [3](https://huggingface.co/docs/huggingface_hub/en/package_reference/inference_client).

### Empfohlene Secret-Namen
- `HF_TOKEN`
- optional `HF_DEFAULT_MODEL`

---

## 4. Google AI Studio / Gemini API

### Zweck
- Gemini-Verbindung testen
- spaeter alternativ oder ergaenzend Cloud-LLM-Aufrufe ermoeglichen
- AI-Studio-gestuetzte Erweiterungen

### Authentifizierung
- `GEMINI_API_KEY`

### Offizielle Hinweise
Alle Requests an die Gemini API enthalten den Header `x-goog-api-key` mit dem API-Key [3](https://ai.google.dev/api). AI Studio Build Mode richtet den `GEMINI_API_KEY` fuer neue Apps serverseitig als Secret ein [2](https://ai.google.dev/gemini-api/docs/aistudio-build-mode). Fuer andere Dienste muessen Secrets manuell im Secrets-Bereich hinzugefuegt werden [5](https://ai.google.dev/gemini-api/docs/aistudio-fullstack).

### Wichtiger Test-Call
- `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`

### Empfohlene Secret-Namen
- `GEMINI_API_KEY`
- optional `GEMINI_DEFAULT_MODEL`

---

## 5. Vereinheitlichungsprinzip

Alle Dienste sollen in der App nach demselben Muster erscheinen:

- Name
- Zweck
- Secret-Felder
- Testbutton
- Statusanzeige
- optionale Defaults

## 6. Adapter-Kontrakt

Jeder Adapter sollte mindestens diese Methoden haben:

- `testConnection()`
- `getStatus()`
- `getSummary()`

Spezifische Adapter koennen spaeter erweitern:

### GitHub
- `listRepos()`
- `listPullRequests()`
- `listIssues()`

### Hugging Face
- `searchModels()`
- `getModelInfo()`
- `testInference()`

### Gemini
- `generateTestResponse()`

### llama.cpp
- `startServer()`
- `stopServer()`
- `restartServer()`
- `getHealth()`
- `getModels()`
