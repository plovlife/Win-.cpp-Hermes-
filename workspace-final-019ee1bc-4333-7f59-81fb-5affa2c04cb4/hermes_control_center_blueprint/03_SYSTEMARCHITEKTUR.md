# Systemarchitektur
## Hermes Control Center

## 1. Empfohlene Zielarchitektur

### Architekturtyp
Full-Stack-Webanwendung mit serverseitiger Integrationslogik und spaeterer Desktop-Verpackung.

## 2. Schichtenmodell

```text
[Frontend / UI]
    React oder aehnlich
        │
        ▼
[Server Layer / API Layer]
    App-Routen + Business-Logik
        │
        ├── llama.cpp Adapter
        ├── GitHub Adapter
        ├── Hugging Face Adapter
        ├── Gemini Adapter
        └── Config / Secrets / Profiles
        │
        ▼
[Local OS + External APIs]
```

## 3. Warum serverseitig?

Google AI Studio setzt fuer Full-Stack-Apps auf serverseitige Secrets und empfiehlt, externe API-Aufrufe von der Serverseite aus zu machen. Gemini-Keys werden bei AI-Studio-Apps serverseitig als Secret gesetzt; weitere Secrets werden manuell im Secrets-Bereich hinterlegt [2](https://ai.google.dev/gemini-api/docs/aistudio-build-mode) [5](https://ai.google.dev/gemini-api/docs/aistudio-fullstack).

## 4. Empfohlener Technologie-Stack

### Frontend
- React
- TypeScript
- einfache Komponentenbibliothek
- deutsche Standardtexte

### Backend
- Node.js / serverseitige Routen
- TypeScript
- Child-Process-Steuerung fuer `llama-server.exe`
- lokale JSON- oder SQLite-Persistenz

### Desktop-Perspektive spaeter
- Electron (am einfachsten fuer Windows)
- alternativ Tauri (leichtergewichtig)

## 5. Adapter-Prinzip

Jede Integration soll als eigener Adapter modelliert werden:

- `llamacppAdapter`
- `githubAdapter`
- `huggingfaceAdapter`
- `geminiAdapter`

### Vorteil
- klare Trennung
- bessere Wartbarkeit
- einfache Erweiterung um neue Provider
- saubere Testbarkeit

## 6. Lokale Persistenz

Fuer MVP ausreichend:
- `settings.json`
- `profiles.json`
- `integrations.json`
- optional `logs.json`

Spaeter besser:
- SQLite

## 7. Prozessmodell fuer llama.cpp

### Start
Der Backend-Server startet `llama-server.exe` per Child Process mit einem gewaehlten Profil.

### Stop
Der Prozess wird sauber beendet oder im Fehlerfall gekillt.

### Status
Der Server prueft periodisch:
- Prozess laeuft?
- `/health` erreichbar?
- `/v1/models` antwortet?

## 8. API-Grundprinzip

Die App selbst sollte interne API-Routen bereitstellen, z. B.:

- `GET /api/server/status`
- `POST /api/server/start`
- `POST /api/server/stop`
- `GET /api/integrations/github/test`
- `GET /api/integrations/huggingface/test`
- `GET /api/integrations/gemini/test`

## 9. Sicherheitsprinzip

- niemals API-Keys im Frontend speichern
- niemals Secrets im Repository hartkodieren
- nur serverseitige Secret-Nutzung
- sensible Felder maskieren
- Exportfunktionen ohne Klartext-Schluessel
