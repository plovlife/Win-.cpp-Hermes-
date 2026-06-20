# AI Keynotes – Produktanwendung
## Damit Google AI Studio oder andere KI-Systeme verstehen, wie das fertige Produkt eingesetzt wird

## 1. Produktname
**Hermes Control Center**

## 2. Produkttyp
Desktop-orientierte Full-Stack-Anwendung mit lokaler Betriebslogik.

## 3. Kernzweck
Das Produkt ist ein **zentrales Steuerpult** fuer lokale KI-Inferenz und API-Integrationen. Es dient dazu, einen lokalen `llama.cpp`-Server ohne staendiges Terminalwissen zu betreiben und gleichzeitig die wichtigsten Entwickler- und KI-Plattformen in einer einzigen Oberflaeche zu verbinden.

## 4. Hauptnutzer

### Primäre Nutzer
- Einzelanwender mit Windows-PC
- lokale LLM-Nutzer
- Hermes-Agent-Nutzer
- Entwickler, die lokale und externe AI-Dienste kombinieren wollen

### Sekundäre Nutzer
- Studierende
- Forschungsnahe Nutzer
- technisch interessierte Power User

## 5. Alltagsszenario
Ein typischer Nutzer startet morgens das Programm, sieht sofort:
- ob der lokale `llama.cpp`-Server laeuft,
- welches GGUF-Modell aktiv ist,
- ob Hermes den Endpoint nutzen kann,
- ob GitHub, Hugging Face und Gemini erreichbar sind,
- und ob ein Profil fuer den aktuellen Task aktiv ist.

Danach kann der Nutzer:
- den lokalen Server starten oder stoppen,
- Profile wechseln,
- Hermes konfigurieren,
- GitHub-Repositories pruefen,
- Hugging Face Modelle und Endpoints einbeziehen,
- Gemini / AI Studio als Cloud-Ergaenzung nutzen.

## 6. Typische Anwendung des fertigen Produkts

### Anwendung A – Lokaler KI-Agentenbetrieb
- Nutzer startet llama.cpp lokal
- Hermes verbindet sich mit `http://127.0.0.1:8080/v1`
- der Agent arbeitet lokal mit langem Kontext

### Anwendung B – Hybrider Arbeitsmodus
- lokales Modell fuer Privatsphaere und Dateioperationen
- Gemini oder andere externe APIs fuer Spezialaufgaben
- GitHub fuer Repo-/PR-/Issue-Kontext
- Hugging Face fuer Modellverwaltung und spaeter Endpoint-Tests

### Anwendung C – Forschungs- und Vergleichsumgebung
- mehrere Startprofile
- verschiedene Modelle
- verschiedene Kontextgroessen
- Integrationen fuer strukturierte Experimente

## 7. Wichtigste UX-Prinzipien

1. **Keine CLI-Pflicht im Alltag**
2. **Lokaler llama.cpp bleibt Hauptkomponente**
3. **Hermes wird angebunden, nicht ersetzt**
4. **Integrationen sind Hilfsschichten, nicht das Hauptprodukt**
5. **Technisch ernsthaft, aber leicht bedienbar**

## 8. Wichtigste fachliche Prioritäten

### Höchste Priorität
- Serververwaltung fuer `llama.cpp`
- klares Profilsystem
- Hermes-Schnellkonfiguration
- serverseitige Secrets
- robuste Statuspruefungen

### Mittlere Priorität
- GitHub Repo-/PR-/Issue-Ansichten
- Hugging Face Modellbrowser
- Gemini Prompt-Tests

### Niedrigere Priorität im MVP
- Multi-User
- Cloud-Sync
- eigene Agentenengine

## 9. Nicht-Ziele

- Das Produkt ist kein Ersatz fuer Hermes Agent.
- Das Produkt ist kein eigenstaendiger Cloud-LLM-Anbieter.
- Das Produkt ist kein Modelltrainer.
- Das Produkt ist nicht primaer fuer Massenbetrieb gedacht.

## 10. Designstil

- serioes
- technisch aufgeraeumt
- lesbar
- deutschsprachig
- eher „Control Center“ als verspieltes Consumer-Interface

## 11. Technischer Stil fuer weiterentwickelnde KI-Systeme

Wenn eine KI dieses Projekt weiterentwickelt, soll sie:
- Modularitaet bewahren
- klare Adaptergrenzen beibehalten
- keine Secrets ins Frontend legen
- den lokalen llama.cpp-Fokus nicht verwässern
- gute Fehlermeldungen und Diagnosefunktionen bevorzugen

## 12. Kernsatz fuer jede weiterentwickelnde KI

> Dieses Produkt ist ein lokales, desktopnahes Steuerzentrum fuer llama.cpp plus begleitende Integrationen. Der lokale llama.cpp-Server ist das Herzstueck. Hermes ist der Haupt-Agent-Client. GitHub, Hugging Face und Gemini sind flankierende Integrationen.
