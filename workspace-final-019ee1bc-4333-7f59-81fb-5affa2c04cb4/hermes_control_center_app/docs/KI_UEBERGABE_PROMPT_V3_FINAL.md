# KI-Übergabe-Prompt V3 (Final, aktueller Projektstand)
## Für Google AI Studio, Gemini, Claude, GPT oder andere Codier-KI

## Projektname
**Hermes Control Center**

## Produktdefinition
Hermes Control Center ist eine **echte Desktop-Anwendung** auf Basis von:
- Electron
- React
- Node.js / Express

Das Produkt ist ein **lokales Kontrollzentrum** für:
- `llama.cpp` / `llama-server`
- Hermes als Haupt-Agent-Client
- GitHub, Hugging Face und Gemini als Integrationen

## Grundregel
`llama.cpp` bleibt das Haupt-Backend. Hermes wird angebunden, aber nicht ersetzt. Das Projekt darf nicht in ein Cloud-only-Tool umgebaut werden.

## Aktueller Projektstand
Folgende Bereiche existieren bereits im Projekt `hermes_control_center_app`:

### Electron
- `electron/main.cjs`
- `electron/preload.cjs`

### Backend
- `server/index.js`
- `server/services/configService.js`
- `server/services/llamacppService.js`
- `server/services/githubService.js`
- `server/services/huggingfaceService.js`
- `server/services/geminiService.js`

### Frontend
- `client/src/App.jsx`
- Seiten für Dashboard, llama.cpp, Integrationen, Profile, Einstellungen
- Setup-Wizard

### Dokumentation
- Produkt-Keynotes
- System-Hinweise
- User Journeys
- PDF-Auswertungen
- frühere Übergabe-Prompts

## Bereits vorhandene oder angestoßene Funktionen
- Start / Stop / Restart für llama.cpp
- Konfigurationsverwaltung
- Profilsystem
- Hermes Quick Connect Werte
- GitHub / Hugging Face / Gemini Testendpunkte
- Electron-Dateiauswahl für `llama-server.exe` und `.gguf`
- Setup-Wizard
- Tray-/Autostart-/Benachrichtigungs-Basislogik
- Desktop-Einstellungen im Main Process
- regelmäßiges Health-Refresh im Frontend

## Technische Regeln – strikt einhalten

### Sicherheit
- `contextIsolation: true`
- `nodeIntegration: false`
- keine Secrets im Frontend
- IPC nur über Preload-Bridge
- keine unsicheren Renderer-Hacks

### Architektur
- Electron = Desktop-Hülle
- Express = lokales API-/Kontroll-Backend
- React = UI
- `llama.cpp` wird angesteuert, nicht ersetzt

## Nächste Prioritäten

### Priorität 1 – sinnvoll direkt als Nächstes
1. Tray-Verhalten weiter verfeinern
2. Desktop-Einstellungen im UI noch runder machen
3. Hermes Quick Connect im Dashboard weiter stärken
4. Log-/Diagnoseansichten verbessern
5. Pfadvalidierung und bessere Startfehler für llama.cpp

### Priorität 2
1. Hugging Face Modell-Browser
2. lokales Chat-Testfenster gegen `http://127.0.0.1:8080/v1`
3. erweitertes Profilsystem
4. Health-/Diagnosebereich ausbauen

### Priorität 3
1. GPU-/RAM-Diagnose (`nvidia-smi`)
2. Auto-Updater
3. Release-/Packaging-Workflow

## UI-Prinzipien
- Standardsprache Deutsch
- modernes dunkles Desktop-Kontrollzentrum
- klare Fehlermeldungen
- nicht verspielt
- für technisch interessierte Nutzer verständlich
- möglichst wenig CLI-Pflicht im Alltag

## Wichtige Produktrealität
Die App wird so verwendet:
1. Nutzer öffnet Desktop-App
2. sieht sofort Serverstatus, aktives Profil und Hermes-Werte
3. wählt notfalls `llama-server.exe` und GGUF-Modell
4. startet lokalen llama.cpp-Server
5. verbindet Hermes mit lokalem Endpoint
6. nutzt GitHub / HF / Gemini bei Bedarf ergänzend

## Nicht-Ziele
- kein Ersatz für Hermes
- kein eigener Cloud-Agentendienst
- kein Modelltraining
- keine architektonische Verwässerung des lokalen Desktop-Fokus

## Arbeitsstil für die weiterentwickelnde KI
Wenn du Änderungen vorschlägst:
- nenne immer die betroffenen Dateien
- liefere vollständige Funktionen oder vollständige Dateien
- respektiere die bestehende Struktur
- zerstöre nicht den lokalen Desktop-Charakter
- halte die Lösung modular und testbar

## Produktformel
> Hermes Control Center ist eine lokale Desktop-Anwendung zur Verwaltung eines llama.cpp-Servers als Haupt-LLM-Backend, mit Hermes als Haupt-Agent-Client und GitHub/Hugging Face/Gemini als ergänzenden Integrationsdiensten.
