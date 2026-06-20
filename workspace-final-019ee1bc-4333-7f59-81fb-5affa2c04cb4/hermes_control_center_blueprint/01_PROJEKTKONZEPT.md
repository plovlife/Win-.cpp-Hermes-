# Projektkonzept
## Hermes Control Center

## 1. Projektidee

Das geplante Programm soll eine **zentrale Steuer- und Integrationsoberflaeche** fuer lokale und externe KI-Dienste sein. Im Zentrum steht ein **lokaler llama.cpp-Server**, der als Haupt-LLM-Backend dient. Darum herum wird eine einheitliche Anwendung gebaut, die sowohl lokale als auch externe Integrationen verwaltet.

## 2. Hauptziel

Das Programm soll folgende Probleme loesen:

- lokale llama.cpp-Server sind technisch stark, aber fuer viele Nutzer unbequem
- verschiedene Dienste (GitHub, Hugging Face, Gemini / AI Studio, Hermes) sind verstreut
- Secrets, Tokens, Profile und Endpunkte werden oft manuell verwaltet
- ein einheitliches Steuerpult fehlt

## 3. Vision

Das Endprodukt soll ein **Hermes Control Center** werden, also eine Anwendung mit folgenden Eigenschaften:

### Lokale LLM-Steuerung
- llama-server.exe auswaehlen
- GGUF-Modelle auswaehlen
- Startprofile speichern
- Server starten, stoppen, neu starten
- Health und Status pruefen
- Logs anzeigen

### Hermes-Integration
- lokalen OpenAI-kompatiblen Endpoint verwalten
- Hermes-taugliche Profile speichern
- Kontextfenster-Empfehlungen hinterlegen

### Cloud- und API-Integrationen
- GitHub API
- Hugging Face API / Hub / Inference
- Gemini API / Google AI Studio
- spaeter weitere OpenAI-kompatible Provider

### Management-Ebene
- Integrationen testen
- Profile exportieren / importieren
- Secrets sicher verwalten
- Status-Dashboard
- spaeter Plugin-System

## 4. Zielplattform

### Primäre Zielplattform
Google AI Studio soll genutzt werden, um aus diesem Konzept eine **Full-Stack-Webanwendung** zu generieren.

### Sekundäre Zielplattform
Spaeter kann dieselbe Anwendung als Desktop-App verpackt werden, z. B. mit:
- Electron
- Tauri
- oder als lokale PWA/Web-App

## 5. Warum Google AI Studio?

Google AI Studio kann mittlerweile Full-Stack-Apps per Prompting erzeugen und serverseitige Secrets verwalten. Neue Apps mit Gemini-Integration bekommen den `GEMINI_API_KEY` automatisch als serverseitiges Secret, und weitere Fremdschluessel lassen sich manuell im Secrets-Bereich hinterlegen [2](https://ai.google.dev/gemini-api/docs/aistudio-build-mode) [5](https://ai.google.dev/gemini-api/docs/aistudio-fullstack).

## 6. Ergebnisziel

Am Ende soll kein loses Skript-Sammelsurium entstehen, sondern ein strukturiertes Programm mit:

- Dashboard
- lokaler Serversteuerung
- Integrationsverwaltung
- API-Testfunktionen
- Konfigurationen und Profilen
- guter Erweiterbarkeit
