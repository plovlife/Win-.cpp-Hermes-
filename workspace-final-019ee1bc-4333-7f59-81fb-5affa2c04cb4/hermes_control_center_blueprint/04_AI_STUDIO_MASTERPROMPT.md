# Master-Prompt fuer Google AI Studio

Den folgenden Prompt kannst du als starke Ausgangsbasis in Google AI Studio verwenden, um die App generieren zu lassen.

---

## PROMPT BEGINN

Baue mir eine **deutschsprachige Full-Stack-Webanwendung** mit dem Namen **Hermes Control Center**.

### Gesamtziel
Die App soll eine zentrale Steueroberflaeche fuer einen lokalen `llama.cpp`-Server und mehrere KI-/Entwickler-Integrationen sein. Der Fokus liegt auf **Windows**, lokaler Nutzung und einer sehr klaren Oberflaeche fuer Nicht-CLI-Nutzer.

### Hauptfunktionen

#### 1. Dashboard
- Zeige eine Startseite mit Systemstatus
- Karten fuer:
  - llama.cpp Serverstatus
  - aktives Profil
  - Hermes Endpoint
  - GitHub Verbindungsstatus
  - Hugging Face Verbindungsstatus
  - Gemini / Google AI Studio Verbindungsstatus
- Zeige letzte Logs / letzte Fehlermeldungen

#### 2. llama.cpp Serververwaltung
- Formular fuer llama.cpp Profil:
  - Pfad zu `llama-server.exe`
  - Pfad zum GGUF-Modell
  - Host
  - Port
  - Kontext
  - GPU-Layer
  - Slots
  - Cache-Type-K
  - Cache-Type-V
  - Flash Attention on/off
  - Batch
  - UBatch
  - Threads
  - Jinja on/off
- Buttons:
  - Start
  - Stop
  - Restart
  - Save Profile
  - Load Profile
  - Open WebUI
  - Run Health Check
  - Run Models Check
- Backend soll `llama-server.exe` serverseitig als Child Process starten und stoppen.
- Speichere Prozessstatus sauber im Backend.
- Falls der Prozess abstuerzt, zeige eine gute Fehlermeldung.

#### 3. Hermes-Hilfe
- Zeige einen Bereich „Hermes verbinden“
- Zeige folgende Werte in Copy-Boxes:
  - Base URL: `http://127.0.0.1:8080/v1`
  - Provider: `Custom endpoint`
  - Context Length Empfehlung: `64000`
- Zeige kurze Erklaerung, warum 64000 fuer Hermes wichtig ist.

#### 4. Integrationen
Baue eine Seite „Integrationen“ mit Tabs oder Karten fuer:

##### GitHub
- Felder:
  - GitHub Token (serverseitig als Secret oder geschuetzt speichern)
  - Optional: Default Owner
  - Optional: Default Repo
- Testbutton:
  - Fuehre serverseitig einen Test gegen GitHub API aus
- Zeige bei Erfolg einfache Informationen wie Benutzername oder Repo-Liste

##### Hugging Face
- Felder:
  - HF Token
  - Optional: bevorzugtes Modell oder Standard-Organisation
- Testbutton:
  - pruefe Token / Zugriff
- Optional:
  - Suchfeld fuer Modelle
  - Anzeige einfacher Modellmetadaten

##### Gemini / Google AI Studio
- Nutze `GEMINI_API_KEY` als serverseitiges Secret
- Wenn moeglich, lese den Key aus dem Server-Environment
- Biete Testbutton fuer Gemini API an
- Optional: kleines Prompt-Testfeld

#### 5. Profile und Konfiguration
- Speichere Einstellungen serverseitig in JSON oder SQLite
- Ermoegliche Import / Export ohne Klartext-Secrets
- Secrets duerfen nicht im Frontend landen

#### 6. Logs und Diagnose
- Zeige einfache Logs
- Zeige letzten Startbefehl in maskierter Form
- Zeige HTTP-Ergebnisse von `/health` und `/v1/models`

### Technische Anforderungen

- Verwende TypeScript fuer Frontend und Backend.
- Verwende serverseitige Routen fuer alle externen API-Aufrufe.
- Niemals API-Schluessel im Client offenlegen.
- Halte die App modular.
- Erstelle Adapter/Services fuer:
  - `llamacppAdapter`
  - `githubAdapter`
  - `huggingfaceAdapter`
  - `geminiAdapter`
- Erzeuge eine saubere Ordnerstruktur.
- Erzeuge Komponenten fuer Dashboard, Server, Integrationen, Logs, Einstellungen.

### UI/UX Anforderungen

- Standardsprache: Deutsch
- klares, modernes, technisch-serioeses Design
- einfache Standardansicht
- „Erweiterte Einstellungen“ einklappbar
- gute Fehlermeldungen in Klartext
- Copy-Buttons fuer wichtige URLs

### Sicherheitsanforderungen

- keine Secrets im Frontend
- Secrets nur serverseitig verwenden
- sensible Felder maskieren
- keine Klartext-Secrets in Exportdateien

### Bonusfunktionen, falls moeglich
- Modellsuche auf Hugging Face
- GitHub Repo Browser
- Profile duplizieren
- Startprofile validieren
- Diagnoseseite mit Port-Test und llama.cpp Prozessstatus

### Interne API-Routen, die du anlegen sollst
- `GET /api/server/status`
- `POST /api/server/start`
- `POST /api/server/stop`
- `POST /api/server/restart`
- `GET /api/server/health`
- `GET /api/server/models`
- `GET /api/integrations/github/test`
- `GET /api/integrations/huggingface/test`
- `GET /api/integrations/gemini/test`
- `GET /api/profiles`
- `POST /api/profiles`
- `PUT /api/profiles/:id`
- `DELETE /api/profiles/:id`

### Wichtige Nichtverhandlungspunkte
- Die App darf `llama.cpp` nicht ersetzen, sondern soll es steuern.
- Lokaler `llama-server` ist das Haupt-Backend fuer Inferenz.
- Hermes wird nicht neu implementiert, sondern nur angebunden.
- Das Projekt soll fuer spaetere Desktop-Verpackung geeignet sein.

### Erzeuge bitte
1. eine lauffaehige Grundstruktur
2. serverseitige Adapter-Stubs
3. Beispielseiten und UI-Komponenten
4. Konfigurationsspeicherung
5. eine Readme mit Startanleitung

## PROMPT ENDE

---

## Hinweis
Wenn AI Studio zu viel auf einmal macht, teile es in Schritte auf:
1. nur Grundgeruest bauen
2. dann llama.cpp Management
3. dann Integrationen
4. dann Feinschliff
