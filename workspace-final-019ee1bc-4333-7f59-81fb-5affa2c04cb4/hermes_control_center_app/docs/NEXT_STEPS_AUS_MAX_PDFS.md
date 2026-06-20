# Nächste Schritte aus den beiden Max-PDFs

## Bereits gut passend zu unserem Projekt
- native Dateiauswahl
- sichere Electron-Bridge
- Setup-Assistent
- Logs / Diagnose
- Explorer-Integration
- Desktop-Denke statt Web-Demo

## Nächste sinnvolle technische Ausbaustufen

### 1. Tray-Modus
Die App sollte im Hintergrund weiterlaufen können, wenn der Nutzer das Fenster schließt.

### 2. Autostart
Die App soll optional beim Windows-Login starten können.

### 3. Benachrichtigungen
Die App soll den Nutzer bei Server-Ereignissen informieren.

### 4. Hugging Face Modell-Browser
Direkte Suche nach GGUF-Modellen und Modelldetails.

### 5. Lokales Chat-Testfenster
Ein Bereich, um direkt gegen den lokalen `llama.cpp`-Endpoint zu testen.

### 6. GPU- und Systemdiagnose
Anzeige von VRAM, RAM und CPU-Status.

### 7. Update- und Release-Struktur
Langfristig Auto-Updater und GitHub-Release-Workflow.

## Leitlinie
Alle neuen Funktionen sollen in dieselbe Produktlogik passen:

- `llama.cpp` bleibt Kern
- Hermes bleibt Haupt-Agent-Client
- Integrationen bleiben modular
- Desktop-UX bleibt zentral
