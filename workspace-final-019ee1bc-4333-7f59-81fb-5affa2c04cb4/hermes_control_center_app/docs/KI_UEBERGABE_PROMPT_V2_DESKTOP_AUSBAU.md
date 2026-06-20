# KI-Übergabe-Prompt V2
## Für Google AI Studio, Gemini, Claude, GPT oder andere Codier-KI

Nutze den folgenden Prompt, wenn du auf dem bereits bestehenden Projekt `hermes_control_center_app` weiter aufbauen willst.

---

## PROMPT BEGINN

Du entwickelst ein bestehendes Projekt mit dem Namen **Hermes Control Center** weiter.

### Produktart
Es ist eine **echte Desktop-Anwendung** auf Basis von:
- Electron
- React
- Node.js / Express

### Hauptzweck
Die App ist ein lokales Kontrollzentrum für:
- `llama.cpp` / `llama-server`
- Hermes als Haupt-Agent-Client
- GitHub, Hugging Face und Gemini als Integrationen

### Wichtigste Produktregel
`llama.cpp` bleibt das Haupt-LLM-Backend. Hermes wird angebunden, aber nicht ersetzt. Die App ist kein Cloud-only-Tool.

### Bestehende Projektstruktur
Es gibt bereits:
- `electron/main.cjs`
- `electron/preload.cjs`
- `server/index.js`
- Adapter/Services für llama.cpp, GitHub, Hugging Face, Gemini
- React-Seiten für Dashboard, llama.cpp, Integrationen, Profile, Einstellungen
- einen Setup-Wizard
- Dokumente in `docs/`, die Produktanwendung und KI-Leitlinien erklären

### Was bereits funktionieren soll oder vorbereitet ist
- Start/Stop/Restart für llama.cpp
- Konfigurationsverwaltung
- Profilsystem
- Hermes Quick-Werte
- GitHub-/HF-/Gemini-Testendpunkte
- Electron-Dateiauswahl für `llama-server.exe` und `.gguf`

### Deine Aufgabe
Baue die Desktop-App weiter in Richtung eines reifen Windows-Programms aus.

## Priorität 1 – sofort sinnvoll
1. Tray-Icon mit Kontextmenü
2. Minimieren in den Tray statt sofortigem Beenden
3. Autostart per offizieller Electron-API
4. native Benachrichtigungen für Serverstart/-stop/-fehler
5. bessere Einstellungsseite mit Persistenz
6. stärkeres Hermes Quick Connect Panel

## Priorität 2 – danach
1. Hugging Face Modell-Browser
2. lokales Chat-Testfenster gegen `http://127.0.0.1:8080/v1`
3. verbessertes Multi-Profil-System
4. Diagnosebereich für Logs, Health, /v1/models

## Priorität 3 – später
1. GPU-/RAM-Diagnose
2. Auto-Updater
3. GitHub Release Workflow
4. Desktop Packaging Feinschliff

## UI-Prinzipien
- Standardsprache Deutsch
- modernes dunkles Control-Center-Design
- technisch-seriös, nicht verspielt
- klare Fehlermeldungen
- fortgeschrittene Optionen einklappbar

## Sicherheitsregeln
- `contextIsolation: true`
- `nodeIntegration: false`
- keine Secrets im Frontend
- IPC nur über Preload Bridge
- keine unsicheren Renderer-Hacks

## Code-Regeln
- vollständige Dateien oder vollständige Funktionen liefern
- nicht nur Fragmente
- bei Änderungen angeben, welche Datei geändert wird
- React/Node/Electron-Stil beibehalten
- keine Architektur einführen, die den lokalen Desktop-Fokus verwässert

## Wichtig für das Produktverständnis
Dieses Produkt wird im Alltag so verwendet:
- Nutzer öffnet Desktop-App
- sieht Serverstatus und aktives Profil
- wählt notfalls `llama-server.exe` und GGUF aus
- startet lokalen Server
- verbindet Hermes mit lokalem Endpoint
- nutzt GitHub / HF / Gemini bei Bedarf ergänzend

Die App ist also ein **lokales Desktop-Steuerzentrum** und keine bloße Demo.

## PROMPT ENDE
