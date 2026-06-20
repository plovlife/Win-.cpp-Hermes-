# Strikte Vorgaben für GitHub Copilot / Copilot Agent
## Projekt: `plovlife/Win-.cpp-Hermes-`

Diese Datei ist als **verbindliche Arbeitsanweisung** für GitHub Copilot oder andere Coding-Agents gedacht.

---

## 1. Verbindliche Produktdefinition

Du arbeitest an einem Projekt mit folgendem Kernzweck:

> **Hermes Control Center** ist ein lokales Windows-Desktop-Kontrollzentrum für `llama.cpp` als Haupt-LLM-Backend, mit Hermes als Haupt-Agent-Client und GitHub / Hugging Face / Gemini als ergänzenden Integrationen.

### Nicht verhandelbar
- `llama.cpp` bleibt das lokale Haupt-Backend.
- Hermes wird **angebunden**, aber **nicht ersetzt**.
- Das Produkt darf **nicht** in ein Cloud-only-Tool umgebaut werden.
- Es ist **kein** ChatGPT-Klon.
- Es ist **kein** neuer Agent von Grund auf.
- Es ist **kein** Projekt, das den lokalen Desktop-Fokus aufweichen darf.

---

## 2. Repository-Struktur ist bereits festgelegt

Die Struktur wurde bereits bewusst angeordnet und dokumentiert. Die Datei `inhalt.txt` ist hierfür Referenz.

### Wichtig
Die vorhandene Struktur ist **kein Zufall** und soll **nicht willkürlich umgebaut** werden.

## 3. Was im Repository welche Rolle hat

### A. `hermes_control_center_app/`
Das ist die **eigentliche Hauptanwendung**, also das App-Projekt, an dem weiterentwickelt werden soll.

### B. `hermes_control_center_blueprint/`
Das ist der **strategische Blueprint**:
- PRD
- Architektur
- AI-Studio-Masterprompt
- Integrationsplan
- Security-Plan

### C. `llamacpp_paket_einfach/`
Das ist das **praktische Alltags-Betriebspaket** für den lokalen Einsatz von `llama.cpp`.

### D. Root-Dokumente
Wichtige Projektdokumente im Root:
- `FINAL_ABSCHLUSS_UND_UEBERGABE.md`
- `FINAL_START_HIER.txt`
- `abschlussbericht_nur_llamacpp.md`

---

## 4. Source of Truth – zuerst lesen, dann handeln

Bevor du Code veränderst, musst du diese Dateien als verbindliche Leitdokumente lesen und berücksichtigen:

### Root
- `FINAL_ABSCHLUSS_UND_UEBERGABE.md`
- `FINAL_START_HIER.txt`

### In `hermes_control_center_app/docs/`
- `AI_KEYNOTES_PRODUKTANWENDUNG.md`
- `AI_SYSTEM_HINWEISE_FUER_WEITERENTWICKLUNG.md`
- `USER_JOURNEYS_UND_ANWENDUNGSFAELLE.md`
- `ENTSCHEIDUNG_A_STATT_B.md`
- `KI_UEBERGABE_PROMPT_V3_FINAL.md`
- `PROJEKTSTATUS_FINAL.md`
- `EMPFOHLENE_NAECHSTE_PHASE_NACH_ABSCHLUSS.md`

### Wichtig
Wenn dein Vorschlag diesen Dokumenten widerspricht, dann ist dein Vorschlag falsch.

---

## 5. Harte Architekturvorgaben

### Bestehender Stack ist verbindlich
- **Electron** = Desktop-Hülle
- **Node.js / Express** = lokales Backend
- **React + Vite** = UI

### Nicht erlaubt
- kein vollständiger Rewrite in einen anderen Stack
- kein Wechsel auf Tauri / Next / Vue / Angular / Python-GUI als Ersatz
- keine Umstellung auf reine Web-App
- keine Umstellung auf reine Cloud-Architektur

### Zielplattform
- **Windows 10/11 x64** als Primärziel

---

## 6. Sicherheitsregeln – strikt einhalten

### Immer einhalten
- `contextIsolation: true`
- `nodeIntegration: false`
- keine Secrets im Frontend
- Secrets nur serverseitig
- IPC nur über Preload-Bridge

### Verboten
- `require('electron')` im Renderer
- unsichere Renderer-Hacks
- Secrets in React-State oder lokalen Exporten im Klartext
- Umbauten, die die Sicherheitsschicht verwässern

---

## 7. Inhaltliche Entwicklungsentscheidung

Für die weitere Entwicklung wurde **verbindlich Option A statt B** gewählt.

### Bedeutung
- Nutze die inhaltliche Richtung von **A** als Referenz.
- **B wird nicht weiter verwendet.**

Wenn du neue Funktionen ergänzt, müssen sie zu **A** passen:
- modular
- robust
- lokal
- technisch sauber
- streaming-/update-/download-fähig

---

## 8. Prioritäten – in genau dieser Reihenfolge

### Priorität 1
- `llama.cpp` Start / Stop / Restart / Status stabilisieren
- Pfadvalidierung verbessern
- Logs / Fehlerdiagnose verbessern
- Hermes Quick Connect verlässlich halten
- Desktop-Verhalten (Tray / Autostart / Notifications / Settings) sauber fertig machen

### Priorität 2
- lokales Chat-Testfenster gegen `llama.cpp` verbessern
- robustes Streaming-Handling
- Profilsystem stärken
- bessere Status- und Diagnoseansichten

### Priorität 3
- Hugging Face Modell-Browser
- In-App-Download
- GPU-/VRAM-Monitoring

### Priorität 4
- Auto-Updater (nur in gepackten Builds)
- Installer / Release-Workflow

---

## 9. Was du NICHT tun darfst

### Nicht tun
- das Projekt „vereinfachen“, indem du Teile löschst
- die Dokumentation ignorieren
- `hermes_control_center_blueprint` oder `llamacpp_paket_einfach` als unwichtige Altlast behandeln
- das App-Projekt völlig neu strukturieren
- neue Produktziele erfinden
- lokale `llama.cpp`-Nutzung zugunsten externer APIs verdrängen
- eine Architektur vorschlagen, die nicht zur bestehenden Ordnerstruktur passt

---

## 10. Was du zuerst konkret prüfen sollst

Bitte zuerst genau diese Punkte analysieren:

1. Ist `hermes_control_center_app/` lokal startbar?
2. Welche API-Routen sind bereits vorhanden?
3. Welche UI-Seiten sind bereits vorhanden?
4. Welche Electron-Funktionen sind bereits vorbereitet?
5. Wo fehlen noch echte Verbindungen zwischen UI, Backend und Electron?

Danach sollst du **nicht direkt alles umbauen**, sondern in kleinen, kontrollierten Schritten weiterarbeiten.

---

## 11. Arbeitsmodus

### Bei jeder Änderung
- nenne die betroffenen Dateien
- beschreibe kurz, warum du sie änderst
- liefere vollständige Funktionen oder vollständige Dateien
- keine halben Skizzen
- keine stillen Architekturwechsel

### Bevorzugt
- kleine, saubere Commits
- nachvollziehbare Struktur
- defensive Fehlerbehandlung
- gute Benutzertexte auf Deutsch

---

## 12. Konkrete Produktrealität

Das fertige Produkt wird so verwendet:

1. Nutzer startet die Desktop-App.
2. Er sieht den Zustand des lokalen `llama.cpp`-Servers.
3. Er wählt notfalls `llama-server.exe` und ein GGUF-Modell.
4. Er startet den lokalen Server.
5. Hermes verbindet sich mit `http://127.0.0.1:8080/v1`.
6. Über das Control Center sieht der Nutzer zusätzlich:
   - Profile
   - Status
   - Logs
   - Integrationen
   - später Modellbrowser / GPU-Werte / Downloads

Daraus folgt:

> Die App ist ein **lokales Desktop-Steuerzentrum** und keine abstrakte Demo.

---

## 13. Endgültige Handlungsanweisung für Copilot

Bitte arbeite **nur innerhalb der bestehenden Produktlogik** weiter.

### Hauptfokus
Arbeite ab jetzt primär im Ordner:
- `hermes_control_center_app/`

### Unterstützende Referenzordner
- `hermes_control_center_blueprint/`
- `llamacpp_paket_einfach/`

### Ziel
Nicht neu erfinden, sondern das bestehende Projekt **präzise, modular und produkttreu** ausbauen.

---

## 14. Knappe Schlussformel

> Behandle dieses Repository nicht wie einen losen Baukasten, sondern wie ein bereits durchstrukturiertes Produkt mit klarer Identität. Deine Aufgabe ist Ausbau, nicht Neudefinition.
