# PRD – Product Requirements Document
## Hermes Control Center

## 1. Produktname
**Hermes Control Center**

## 2. Produktbeschreibung
Hermes Control Center ist eine Full-Stack-Anwendung zur Verwaltung eines lokalen llama.cpp-Backends und seiner wichtigsten KI- und Entwickler-Integrationen. Die Anwendung soll es ermoeglichen, lokale LLM-Inferenz, Agenten-Anbindungen und externe Plattformen ueber eine einheitliche Benutzeroberflaeche zu steuern.

## 3. Zielnutzer

### Primäre Nutzer
- technisch interessierte Einzelanwender
- lokale AI-Nutzer mit Windows-PC
- Nutzer von Hermes Agent
- Entwickler mit lokalen LLM-Workflows

### Sekundäre Nutzer
- Studierende / Forschungseinsteiger
- Maker / Tinkerer
- kleine Teams mit lokalem KI-Fokus

## 4. Kernprobleme

1. llama.cpp ist leistungsfaehig, aber alltagsnah schwerer bedienbar.
2. Nutzer muessen viele externe Dienste manuell zusammenbringen.
3. API-Schluessel und Endpunkte liegen oft verstreut.
4. Ein stabiler lokaler Hermes-Workflow braucht wiederverwendbare Profile.

## 5. MVP-Funktionen

### A. llama.cpp Servermanagement
- Pfad zu `llama-server.exe` speichern
- Pfad zu Modell-Dateien speichern
- Startprofil anlegen
- Server starten / stoppen / neu starten
- Health-Check anzeigen
- /v1/models anzeigen
- lokale WebUI oeffnen

### B. Profile
- Profile mit Namen speichern
- Werte speichern fuer:
  - Modellpfad
  - Host
  - Port
  - Kontext
  - GPU-Layer
  - Slots
  - Batch / UBatch
  - KV-Cache-Typen
  - Threads
  - Jinja an/aus

### C. Hermes-Anbindung
- vorkonfigurierte Hermes-Einstellungen anzeigen
- lokalen Endpoint als Copy-Box anbieten
- Kontextempfehlung 64000 anzeigen

### D. Integrationen
- GitHub Token speichern und testen
- Hugging Face Token speichern und testen
- Gemini API / Google AI Studio Key speichern oder lesen
- Verbindungstest je Integration

### E. Dashboard
- Serverstatus
- geladene Modelle
- aktives Profil
- Integrationsstatus
- letzte Logs / letzte Fehler

## 6. Erweiterungen nach MVP

### Phase 2
- Modell-Download-Helfer fuer Hugging Face
- GitHub Repo Browser
- PR- und Issue-Viewer
- Modellvorschlaege
- Export / Import von Profilen

### Phase 3
- Hermes Session Manager
- Plugin-System
- mehrere Provider gleichzeitig
- Benchmark-Seite
- Security-Audit / Diagnosecenter

## 7. Nicht-Ziele im MVP

- kein vollstaendiger eigener Agent
- keine Modelltrainingspipeline
- kein Ersatz fuer Hermes selbst
- kein Cloud-Hosting-Zwang

## 8. UX-Anforderungen

- einfache Bedienung
- deutschsprachige Standardoberflaeche
- fortgeschrittene Optionen einklappbar
- gefuehrte Ersteinrichtung
- klare Fehlermeldungen

## 9. Technische Grundanforderungen

- serverseitige API-Integrationen
- keine Secrets im Frontend
- lokale Konfigurationspersistenz
- robuste Fehlerbehandlung
- sauber trennbare Adapter pro Integration

## 10. Erfolgskriterien

Ein Nutzer soll nach der Ersteinrichtung in der Lage sein,

1. llama.cpp per UI zu starten,
2. Hermes mit dem lokalen Endpoint zu verbinden,
3. GitHub / HF / Gemini zu hinterlegen,
4. den Systemzustand ohne Terminal zu verstehen,
5. und das Programm spaeter ohne Bruch erweitern zu koennen.
