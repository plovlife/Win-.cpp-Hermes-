# Implementierungsplan

## Phase 1 – Grundstruktur

### Ziel
Lauffaehiges Grundgeruest der App.

### Aufgaben
- Projektstruktur erzeugen
- Frontend-Seiten anlegen
- serverseitige API-Routen anlegen
- Settings-Persistenz vorbereiten
- deutschsprachige UI-Basis setzen

## Phase 2 – llama.cpp Management

### Ziel
Lokalen Server voll kontrollieren.

### Aufgaben
- Profile erstellen
- Child-Process Start/Stop
- Statuspruefung
- Health-Check
- `/v1/models` auslesen
- Logs darstellen

## Phase 3 – Integrationen

### Ziel
GitHub, Hugging Face und Gemini sauber einbinden.

### Aufgaben
- Secret-Eingabefelder / serverseitige Nutzung
- Test-Routen
- Statusanzeigen
- erste Datenansichten

## Phase 4 – Hermes-Assistententeil

### Ziel
Hermes-Verbindungsseite und Profilhilfen.

### Aufgaben
- Copy-Boxes
- Endpoint-Infos
- Hinweise fuer Context 64000
- ggf. Exportvorlage fuer Hermes-Config

## Phase 5 – UX und Stabilisierung

### Ziel
Angenehme Alltagsnutzung.

### Aufgaben
- Fehlerdialoge
- Formvalidierung
- Profilverwaltung verbessern
- letzte Aktionen speichern
- bessere Diagnoseseite

## Phase 6 – Erweiterungen

### Optionen
- Desktop-Verpackung
- Hugging Face Modellbrowser
- GitHub Repo Explorer
- mehrere Provider
- Benchmark-Sektion
- Plugin-System
