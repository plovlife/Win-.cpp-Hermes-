# AI-System-Hinweise fuer Weiterentwicklung

## Wenn dieses Projekt von Google AI Studio oder einer anderen KI weiterentwickelt wird, gelten folgende Leitlinien:

## 1. Architektur-Prinzip

- Frontend: React
- Backend: Node.js / Express
- Desktop-Huelle: Electron
- llama.cpp bleibt externes Laufzeitsystem und wird angesteuert, nicht ersetzt.

## 2. Uebergeordnete Produktabsicht

Die App soll als „Hermes Control Center“ funktionieren. Das bedeutet:
- lokale Inferenz verwalten
- Hermes-Anbindung vereinfachen
- externe APIs integrieren
- Status, Logs und Profile sichtbar machen

## 3. Was NICHT passieren soll

- keine Neuschreibung von Hermes
- keine Umstellung auf Cloud-only
- keine Entfernung des llama.cpp-Fokus
- keine unsichere Secret-Speicherung im Frontend
- keine UI, die nur fuer Entwickler lesbar ist

## 4. Was die KI bevorzugen soll

- robuste API-Routen
- serverseitige Adapter
- klare Datenmodelle
- JSON/SQLite Persistenz
- Copy-Buttons, Testbuttons, Diagnoseansichten
- gute deutsche Texte

## 5. Wichtige Nutzererwartung

Der Nutzer moechte moeglichst wenig CLI verwenden. Die App muss deshalb:
- Start / Stop / Restart fuer llama.cpp bieten
- Pfadauswahl und Profilverwaltung visuell unterstuetzen
- Health und Modellstatus direkt anzeigen

## 6. Weiterentwicklungsziele

### Naechste sinnvolle Schritte
1. Dateiauswahl fuer llama-server.exe und GGUF in Electron integrieren
2. Logs mit besserer Anzeige und Verlauf erweitern
3. Validierung fuer Startprofile einbauen
4. Hugging Face Modellsuche ergaenzen
5. GitHub Repo-Browser ergaenzen
6. Electron Packaging finalisieren

## 7. UI-Prinzipien

- dunkles, technisches Dashboard
- klare Kartenstruktur
- Seiten fuer Dashboard, llama.cpp, Integrationen, Profile, Einstellungen
- fortgeschrittene Optionen einklappbar

## 8. Sicherheit

- `GEMINI_API_KEY`, `GITHUB_TOKEN`, `HF_TOKEN` nur serverseitig verwenden
- Exportdateien ohne Klartext-Secrets
- sensible Werte nur maskiert anzeigen

## 9. Hermes-Priorität

Hermes soll besonders gut unterstuetzt werden durch:
- feste Copy-Werte fuer Custom Endpoint
- 64000 Context-Hinweis
- lokale llama.cpp-Healthpruefung
- gute Profilvorgaben fuer 8B / 64k / 1 Slot

## 10. Leitsatz fuer die weiterentwickelnde KI

> Optimiere das Produkt fuer reale Alltagsnutzung eines lokalen llama.cpp-Servers mit Hermes als Hauptanwendungsfall. Baue Integrationen modular aus, aber verwässere nicht den lokalen Desktop- und Kontrollzentrum-Charakter.
