# Hermes Control Center

React + Node.js + Electron Desktop-Grundgeruest fuer:

- lokalen `llama.cpp` / `llama-server`
- Hermes-Anbindung
- GitHub-Integration
- Hugging Face-Integration
- Gemini / Google AI Studio-Integration

## Ziel

Dieses Projekt ist ein **echtes Startgeruest** fuer eine spaetere Desktop-Anwendung unter Windows. Es soll nicht Hermes ersetzen, sondern eine zentrale Steueroberflaeche fuer den lokalen `llama.cpp`-Betrieb und die wichtigsten API-Integrationen bereitstellen.

## Projektstruktur

```text
hermes_control_center_app/
  electron/
  server/
  client/
  docs/
  .env.example
  package.json
```

## Hauptbereiche

### 1. Electron
Desktop-Huelle fuer Windows/Mac/Linux.

### 2. Server (Node.js + Express)
Steuert `llama-server.exe`, verwaltet Profile und testet Integrationen serverseitig.

### 3. Client (React + Vite)
Benutzeroberflaeche mit Seiten fuer Dashboard, llama.cpp, Integrationen, Profile und Einstellungen.

### 4. docs
Enthaelt Keynotes, Produktanwendung, AI-Hinweise und Weiterentwicklungsanweisungen.

## Schnellstart fuer Entwickler

### 1. Pakete installieren

```bash
npm install
```

### 2. Entwicklungsmodus starten

```bash
npm run dev
```

Das startet:
- den Node-Server auf Port `3001`
- das React-Frontend auf Port `5173`
- Electron als Desktop-Fenster

## Wichtige Entwicklungs-URLs

- Backend API: `http://127.0.0.1:3001`
- Frontend Dev: `http://127.0.0.1:5173`
- llama.cpp lokal: `http://127.0.0.1:8080`
- llama.cpp OpenAI-kompatibel: `http://127.0.0.1:8080/v1`

## Wichtige API-Routen

- `GET /api/health`
- `GET /api/config`
- `PUT /api/config`
- `GET /api/profiles`
- `POST /api/profiles`
- `PUT /api/profiles/:id/load`
- `DELETE /api/profiles/:id`
- `GET /api/server/status`
- `POST /api/server/start`
- `POST /api/server/stop`
- `POST /api/server/restart`
- `GET /api/server/health`
- `GET /api/server/models`
- `GET /api/integrations/status`
- `GET /api/integrations/github/test`
- `GET /api/integrations/huggingface/test`
- `GET /api/integrations/gemini/test`

## Sicherheit

- keine Secrets im Frontend
- API-Keys nur serverseitig verwenden
- fuer AI Studio: `GEMINI_API_KEY` als Secret nutzen
- fuer GitHub und Hugging Face serverseitige Umgebungsvariablen nutzen

## Wichtige Dokumente

- `docs/AI_KEYNOTES_PRODUKTANWENDUNG.md`
- `docs/AI_SYSTEM_HINWEISE_FUER_WEITERENTWICKLUNG.md`
- `docs/USER_JOURNEYS_UND_ANWENDUNGSFAELLE.md`
- `docs/PDF_AUSWERTUNG_ELECTRON_SETUP_ASSISTENT.md`
- `docs/PDF2_AUSWERTUNG_MAX_DESKTOP_ERWEITERUNG.md`
- `docs/PDF3_AUSWERTUNG_DESKTOP_STUFE4.md`
- `docs/ENTSCHEIDUNG_A_STATT_B.md`
- `docs/KI_UEBERGABE_PROMPT_V2_DESKTOP_AUSBAU.md`
- `docs/KI_UEBERGABE_PROMPT_V3_FINAL.md`
- `docs/NEXT_STEPS_AUS_MAX_PDFS.md`

## Status

Dies ist ein **Grundgeruest**, kein fertig gebautes Produktionsprogramm. Es ist absichtlich so aufgebaut, dass du es

1. lokal weiterentwickeln,
2. in Google AI Studio als Referenz verwenden,
3. oder durch andere KI-Systeme weiter ausbauen lassen kannst.
