# Abschlussbericht und Tutorial
## Aufbau eines lokalen Hermes-Agent-Backends **ausschließlich mit llama.cpp** unter Windows 11

**Stand:** 19.06.2026  
**Dokumenttyp:** technischer Abschlussbericht mit Tutorial-Charakter  
**Zielsetzung:** alltagstaugliche, nachvollziehbare und akademisch anschlussfähige Dokumentation eines vollständig lokalen LLM-Backends für Hermes Agent  

---

# Inhaltsverzeichnis

1. Einleitung  
2. Zielsetzung des Projekts  
3. Warum **nur llama.cpp**?  
4. Hardware- und Softwaregrundlage  
5. Zielarchitektur  
6. Empfohlenes Modell  
7. Ordnerstruktur und Vorbereitung  
8. Installation von llama.cpp unter Windows  
9. Erster Test des Servers  
10. Produktive Startkonfiguration für Hermes  
11. Erklärung der wichtigsten Parameter  
12. Hermes mit llama.cpp verbinden  
13. Komfort ohne tägliche CLI: Batch-Datei und Desktop-Start  
14. Testprotokoll  
15. Fehlerdiagnose und Troubleshooting  
16. Sicherheits- und Betriebsaspekte  
17. Wissenschaftliche Anschlussfähigkeit  
18. Endfazit  
19. Linkverzeichnis  
20. Anhang: empfohlene Befehle mit Erklärung  

---

# 1. Einleitung

Dieser Bericht beschreibt den Aufbau eines **vollständig lokalen Sprachmodell-Servers** auf Basis von **llama.cpp**, der als Backend für **Hermes Agent** dient. Im Mittelpunkt steht bewusst **nicht** ein Vergleich verschiedener Laufzeitumgebungen, sondern eine stringente, saubere und konsistente Lösung mit **nur einer Inferenzbasis**: `llama.cpp`.

Das Ziel ist ein System, das:

- lokal auf Windows 11 läuft,
- kein Cloud-Backend benötigt,
- über einen OpenAI-kompatiblen Endpoint ansprechbar ist,
- mit Hermes Agent zusammenarbeitet,
- große Kontexte unterstützt,
- und zugleich so dokumentiert ist, dass es über einen Hobbyaufbau hinaus in Richtung **technische Projektdokumentation** oder **akademische Erststandardisierung** weiterentwickelt werden kann.

---

# 2. Zielsetzung des Projekts

## 2.1 Praktisches Ziel

Es soll ein lokaler Modellserver bereitgestellt werden, der:

1. ein geeignetes GGUF-Modell lädt,
2. per HTTP-API erreichbar ist,
3. mit Hermes Agent gekoppelt werden kann,
4. lange Kontexte verarbeiten kann,
5. und im Alltag möglichst einfach startbar ist.

## 2.2 Methodisches Ziel

Das System soll nicht nur „irgendwie funktionieren“, sondern nach nachvollziehbaren Grundsätzen aufgebaut sein:

- klare Pfadstruktur,
- reproduzierbare Startparameter,
- dokumentierte Tests,
- verständliche Fehlerdiagnose,
- Trennung zwischen Infrastruktur, Modell und Agent.

---

# 3. Warum **nur llama.cpp**?

`llama.cpp` ist für dieses Projekt die sinnvollste Grundlage, weil es den direktesten Zugriff auf den Inferenzserver ermöglicht. Der offizielle `llama-server` unterstützt unter anderem:

- OpenAI-kompatible Chat-Completions,
- Anthropic-kompatible Routen,
- Web UI,
- parallele Slots,
- Continuous Batching,
- Schema-constrained JSON,
- Function Calling / Tool Use,
- Monitoring-Endpunkte,
- und spekulative Dekodierung.

Offizielle Referenz:  
https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md

## 3.1 Fachlicher Vorteil

Wenn ausschließlich `llama.cpp` verwendet wird, entstehen mehrere Vorteile:

- **Transparenz:** Die Startparameter sind direkt sichtbar.
- **Reproduzierbarkeit:** Ein bestimmter Befehl erzeugt einen klar definierbaren Serverzustand.
- **Kontrolle:** Kontextgröße, Slots, Batch-Größe, KV-Cache-Typen und Offloading sind direkt steuerbar.
- **Saubere Architektur:** Hermes nutzt einen generischen OpenAI-kompatiblen Endpoint; `llama.cpp` liefert genau diesen Endpoint.

## 3.2 Praktischer Vorteil

Für den späteren Betrieb ist kein zusätzlicher Abstraktionslayer zwingend nötig. Das reduziert:

- Fehlerquellen,
- Inkompatibilitäten,
- Missverständnisse über Defaults,
- und unnötige Komplexität.

---

# 4. Hardware- und Softwaregrundlage

## 4.1 Ausgangssystem

Das vorliegende Windows-System ist für lokale Inferenz sehr gut geeignet, insbesondere für 7B- und 8B-Modelle mit langem Kontext und GPU-Offload.

**Relevante Eckdaten:**
- Windows 11
- NVIDIA RTX 4070 Ti SUPER, 16 GB VRAM
- 32 GB RAM
- ausreichend SSD-Speicher
- Hermes Agent / Hermes Desktop als gewünschter Client

## 4.2 Praktische Konsequenz für llama.cpp

Die Hardware ist stark genug für:

- ein gutes 8B-GGUF-Modell,
- vollständiges oder nahezu vollständiges GPU-Offloading,
- langes Kontextfenster,
- lokal laufenden HTTP-Server,
- Tool-fähigen Agentenbetrieb über Hermes.

Der eigentliche Engpass ist **nicht** die Existenz eines Servers, sondern die saubere Abstimmung von:

- Modell,
- Kontext,
- VRAM-Verbrauch,
- und API-Konfiguration.

---

# 5. Zielarchitektur

## 5.1 Logische Architektur

```text
[Hermes Agent / Hermes Desktop]
              │
              │  OpenAI-kompatible HTTP-Anfragen
              ▼
      [llama.cpp / llama-server]
              │
              │  lädt lokales GGUF-Modell
              ▼
 [RTX 4070 Ti SUPER + CPU + RAM + SSD]
```

## 5.2 Rollen der Komponenten

### Hermes Agent
Hermes ist der Agent und die Benutzeroberfläche auf Agentenebene. Hermes führt selbständig Arbeitsabläufe aus und spricht mit einem LLM-Provider.

### llama.cpp
`llama.cpp` ist hier **ausschließlich** die Inferenzschicht. Es lädt das Modell, verarbeitet Eingaben und erzeugt Antworten.

### GGUF-Modell
Das Modell ist die eigentliche inhaltliche „Intelligenz“. In diesem Projekt wird ein **Hermes-taugliches GGUF-Modell** verwendet.

---

# 6. Empfohlenes Modell

## 6.1 Hauptempfehlung

**NousResearch / Hermes-3-Llama-3.1-8B-GGUF**  
https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF

## 6.2 Begründung

Dieses Modell ist für den Hermes-Kontext naheliegend, weil es aus derselben Hermes-Modellfamilie stammt und ausdrücklich mit Themen wie **Function Calling** und strukturierten Ausgaben verbunden ist.

## 6.3 Empfohlene Quantisierung

Für das konkrete System sind am sinnvollsten:

- **Q6_K** – bevorzugte Empfehlung
- **Q5_K_M** – wenn mehr Reserve für Kontext benötigt wird

Q8_0 ist möglich, aber für langes Kontextfenster oft weniger attraktiv, da VRAM-Reserve wichtiger ist als der letzte Qualitätsgewinn.

## 6.4 Grundsatz

Für einen Agenten-Workflow ist in der Praxis wichtiger:

- korrekte Tool-Aufrufe,
- stabile Struktur,
- ausreichender Kontext,
- zuverlässige Antworten,

als bloß die größtmögliche Modellgröße.

---

# 7. Ordnerstruktur und Vorbereitung

Eine saubere Ordnerstruktur ist für Nachvollziehbarkeit und Wartung wesentlich.

## 7.1 Empfohlene Struktur

```text
C:\llama.cpp\
C:\000.mAIn\Model\01_LLMs\GGUF\
C:\000.mAIn\Scripts\
C:\000.mAIn\Logs\
```

## 7.2 Bedeutung der Ordner

### `C:\llama.cpp\`
Enthält die `llama-server.exe` und ggf. weitere Programme des Releases.

### `C:\000.mAIn\Model\01_LLMs\GGUF\`
Enthält die Modell-Dateien (`.gguf`).

### `C:\000.mAIn\Scripts\`
Enthält Startskripte, z. B. Batch-Dateien zum Doppelklick-Start.

### `C:\000.mAIn\Logs\`
Optionaler Ordner für spätere Log-Dateien oder Notizen.

---

# 8. Installation von llama.cpp unter Windows

## 8.1 Offizielles Projekt

**Projekt:**  
https://github.com/ggml-org/llama.cpp

## 8.2 Vorgehensweise

1. Das passende Windows-Binary / Release von llama.cpp beschaffen.
2. Den Inhalt nach `C:\llama.cpp\` entpacken.
3. Prüfen, ob `llama-server.exe` vorhanden ist.

## 8.3 Warum `llama-server.exe`?

`llama-server.exe` ist das eigentliche Serverprogramm. Es stellt die API bereit, über die Hermes später Anfragen an das lokale Modell senden kann.

---

# 9. Erster Test des Servers

Bevor Hermes gekoppelt wird, muss geprüft werden, ob `llama.cpp` **allein** sauber startet.

## 9.1 Minimaler Teststart

```powershell
C:\llama.cpp\llama-server.exe ^
  -m C:\000.mAIn\Model\01_LLMs\GGUF\hermes-3-llama-3.1-8b-q6_k.gguf ^
  --host 127.0.0.1 --port 8080 ^
  -ngl all ^
  -c 32768 ^
  -np 1 ^
  -fa on ^
  --jinja
```

## 9.2 Was passiert bei diesem Test?

- `llama-server.exe` wird gestartet.
- Das angegebene GGUF-Modell wird geladen.
- Der Server bindet an `127.0.0.1:8080`.
- Möglichst alle Layer werden auf die GPU ausgelagert.
- Das Kontextfenster wird testweise auf 32768 gesetzt.
- Es wird nur ein einziger Slot verwendet.
- Flash Attention wird aktiviert.
- Jinja-Chat-Templates werden aktiviert.

## 9.3 Warum zunächst 32768 statt 65536?

Für die **erste Funktionsprüfung** ist ein etwas kleineres Kontextfenster oft sinnvoll, weil Fehler leichter diagnostizierbar sind. Danach wird auf die eigentliche Zielkonfiguration für Hermes umgestellt.

---

# 10. Produktive Startkonfiguration für Hermes

Die Hermes-Dokumentation empfiehlt für lokale Custom-Endpoints einen **Context Length von 64000**. Daraus ergibt sich für `llama.cpp` eine Produktionskonfiguration mit **64k-nahem Kontextfenster**.

Referenz:  
https://hermes-agent.nousresearch.com/docs/reference/faq

## 10.1 Produktionsprofil

```powershell
C:\llama.cpp\llama-server.exe ^
  -m C:\000.mAIn\Model\01_LLMs\GGUF\hermes-3-llama-3.1-8b-q6_k.gguf ^
  --host 127.0.0.1 --port 8080 ^
  -ngl all ^
  -c 65536 ^
  -np 1 ^
  -ctk q8_0 -ctv q8_0 ^
  -fa on ^
  -b 2048 -ub 512 ^
  -t 8 ^
  --jinja
```

## 10.2 Ziel dieses Profils

Dieses Profil ist darauf ausgelegt,

- möglichst viel Modell auf die GPU zu legen,
- den Kontext für Hermes ausreichend groß zu machen,
- den KV-Cache effizient zu speichern,
- und eine stabile Einzel-Slot-Konfiguration für Agent-Aufgaben bereitzustellen.

---

# 11. Erklärung der wichtigsten Parameter

Dieser Abschnitt ist zentral, weil er zeigt, **was jeder wichtige Befehl genau bewirkt**.

## 11.1 `-m`

```powershell
-m C:\Pfad\zum\Modell.gguf
```

### Bedeutung
Legt fest, **welche Modell-Datei** geladen werden soll.

### Praktisch
Ohne korrektes Modell kann der Server nicht starten.

---

## 11.2 `--host` und `--port`

```powershell
--host 127.0.0.1 --port 8080
```

### Bedeutung
Bestimmt, auf welcher Adresse und welchem Port der Server erreichbar ist.

### Praktisch
- `127.0.0.1` bedeutet: nur lokal auf demselben Rechner.
- `8080` ist der lokale Netzwerkport.

### Warum wichtig?
Hermes muss exakt diesen Endpoint später ansprechen.

---

## 11.3 `-ngl all`

```powershell
-ngl all
```

### Bedeutung
Bestimmt, wie viele Modell-Layer auf die GPU ausgelagert werden.

### Praktisch
`all` bedeutet: so viel wie möglich in VRAM.

### Warum wichtig?
Je mehr Modell sinnvoll auf der GPU liegt, desto besser ist in der Regel die Inferenzgeschwindigkeit.

---

## 11.4 `-c 65536`

```powershell
-c 65536
```

### Bedeutung
Setzt die Größe des Kontextfensters.

### Praktisch
Das Modell kann sehr viel Gesprächs- und Arbeitskontext verarbeiten.

### Warum wichtig?
Für Hermes sind lange Kontexte wesentlich, weil Agent-Workflows:
- Verlauf speichern,
- Tool-Ausgaben zurückgeben,
- Dateien auswerten,
- mehrere Schritte miteinander verknüpfen.

---

## 11.5 `-np 1`

```powershell
-np 1
```

### Bedeutung
Setzt die Anzahl der **Server-Slots** auf 1.

### Praktisch
Es gibt nur **eine aktive Inferenzspur** mit vollem Ressourcenfokus.

### Warum wichtig?
Für einen Einzelbenutzer-Agenten ist 1 Slot oft sinnvoller als mehrere geteilte Slots, weil der Kontext nicht unnötig aufgeteilt wird.

---

## 11.6 `-ctk q8_0 -ctv q8_0`

```powershell
-ctk q8_0 -ctv q8_0
```

### Bedeutung
Legt die Datentypen des KV-Caches fest.

### Praktisch
Der KV-Cache wird kompakter gespeichert, was bei langen Kontextfenstern erhebliche Speicherwirkung haben kann.

### Warum wichtig?
Langer Kontext braucht viel Cache. Diese Einstellung hilft, den Speicherbedarf beherrschbar zu halten.

---

## 11.7 `-fa on`

```powershell
-fa on
```

### Bedeutung
Aktiviert Flash Attention.

### Praktisch
Die Berechnung der Attention wird effizienter durchgeführt.

### Warum wichtig?
Bei modernen GPUs und langen Kontexten ist dies oft eine sinnvolle Beschleunigung.

---

## 11.8 `-b 2048 -ub 512`

```powershell
-b 2048 -ub 512
```

### Bedeutung
Setzt die logische Batch-Größe (`-b`) und die physische Micro-Batch-Größe (`-ub`).

### Praktisch
Diese Werte beeinflussen Durchsatz und Speicherverbrauch.

### Warum wichtig?
Falsch gewählte Batch-Werte können unnötig VRAM verbrauchen oder die Performance verschlechtern.

---

## 11.9 `-t 8`

```powershell
-t 8
```

### Bedeutung
Setzt die Anzahl der CPU-Threads für die Generierung.

### Praktisch
Die CPU wird kontrolliert eingebunden, ohne beliebig viele Threads zu verwenden.

### Warum wichtig?
Eine klare Thread-Zahl verbessert Reproduzierbarkeit und Stabilität.

---

## 11.10 `--jinja`

```powershell
--jinja
```

### Bedeutung
Aktiviert die Jinja-basierte Chat-Template-Logik.

### Praktisch
Das Modell wird in einem zur Chat-/Tool-Struktur passenden Format angesprochen.

### Warum wichtig?
Gerade bei agentischen Workflows und strukturierten Antworten ist eine saubere Chat-Template-Verarbeitung zentral.

---

## 11.11 Warum **nicht** standardmäßig `--no-mmap`?

`llama.cpp` dokumentiert `--mmap` / `--no-mmap` so, dass deaktiviertes Memory-Mapping **langsameres Laden** bedeuten kann und nur in speziellen Fällen sinnvoll ist.

### Schlussfolgerung
`--no-mmap` ist **kein Standard-Tuning**, sondern ein Spezialwerkzeug. Deshalb wird es in der empfohlenen Grundkonfiguration **nicht** verwendet.

---

# 12. Hermes mit llama.cpp verbinden

Hermes unterstützt lokale OpenAI-kompatible Endpoints ausdrücklich. Das ist der Grund, weshalb `llama.cpp` hier ideal passt.

Referenz:  
https://hermes-agent.nousresearch.com/docs/reference/faq

## 12.1 Konfigurationsprinzip

In Hermes wird als Modellprovider **Custom endpoint** gewählt.

## 12.2 Einzutragende Werte

- **API Base URL:** `http://127.0.0.1:8080/v1`
- **API Key:** beliebiger Platzhalter, falls abgefragt
- **Modellname:** der geladene Modellname / Alias
- **Context Length:** `64000`

## 12.3 Warum `/v1`?

`llama-server` stellt OpenAI-kompatible API-Routen bereit. Hermes erwartet bei einem Custom Endpoint genau diesen Typ eines API-Schemas.

---

# 13. Komfort ohne tägliche CLI: Batch-Datei und Desktop-Start

Der Nutzerwunsch war ausdrücklich, den Server **nicht ständig manuell in der Eingabeaufforderung** starten zu müssen. Auch wenn dieses Dokument nur auf `llama.cpp` fokussiert ist, lässt sich das Problem innerhalb von Windows elegant lösen.

## 13.1 Start per Batch-Datei

Lege eine Datei an:

```text
C:\000.mAIn\Scripts\start_hermes_llamacpp.bat
```

## 13.2 Inhalt der Batch-Datei

```bat
@echo off
cd /d C:\llama.cpp
llama-server.exe ^
  -m C:\000.mAIn\Model\01_LLMs\GGUF\hermes-3-llama-3.1-8b-q6_k.gguf ^
  --host 127.0.0.1 --port 8080 ^
  -ngl all ^
  -c 65536 ^
  -np 1 ^
  -ctk q8_0 -ctv q8_0 ^
  -fa on ^
  -b 2048 -ub 512 ^
  -t 8 ^
  --jinja
pause
```

## 13.3 Was passiert hier?

### `@echo off`
Verhindert, dass jede Batch-Zeile beim Ausführen mit ausgegeben wird.

### `cd /d C:\llama.cpp`
Wechselt in das Verzeichnis, in dem `llama-server.exe` liegt.

### `llama-server.exe ...`
Startet den Server mit der vollständigen Produktionskonfiguration.

### `pause`
Das Fenster bleibt geöffnet, damit eventuelle Fehlermeldungen sichtbar bleiben.

## 13.4 Vorteil

Der Server kann danach per **Doppelklick** gestartet werden. Damit bleibt die Infrastruktur zwar `llama.cpp`-basiert, aber die tägliche Bedienung wird deutlich einfacher.

---

# 14. Testprotokoll

Nach der Installation sollten die folgenden Tests dokumentiert werden.

## 14.1 Test A – Modellliste abrufen

```powershell
curl.exe http://127.0.0.1:8080/v1/models
```

### Erwartung
Es erscheint eine JSON-Antwort mit Modellinformationen.

### Aussagekraft
Der Server läuft, ist über HTTP erreichbar und stellt OpenAI-kompatible Routen bereit.

---

## 14.2 Test B – Health-Check

```powershell
curl.exe http://127.0.0.1:8080/health
```

### Erwartung
Positive Statusmeldung.

### Aussagekraft
Der Dienst ist grundsätzlich funktionsbereit.

---

## 14.3 Test C – Browserzugriff

Im Browser öffnen:

```text
http://127.0.0.1:8080
```

### Erwartung
Die eingebaute Web-Oberfläche des Servers ist erreichbar.

### Aussagekraft
Zusätzlich zur API funktioniert die lokale HTTP-Auslieferung.

---

## 14.4 Test D – GPU-Prüfung

```powershell
nvidia-smi
```

### Erwartung
`llama-server.exe` sollte VRAM belegen.

### Aussagekraft
Das Modell ist tatsächlich aktiv geladen; GPU-Offload funktioniert.

---

## 14.5 Test E – Hermes-Verbindung

In Hermes eine einfache Anfrage stellen, z. B.:

> „Erkläre in zwei Sätzen den Zweck dieses Systems.“

### Erwartung
Hermes antwortet über den lokalen Endpoint.

### Aussagekraft
Die Agent-Verbindung zum `llama.cpp`-Server ist korrekt eingerichtet.

---

# 15. Fehlerdiagnose und Troubleshooting

## 15.1 Problem: Server startet nicht

### Mögliche Ursachen
- Modellpfad falsch
- Datei nicht vorhanden
- Tippfehler im Batch-Skript
- falsches Arbeitsverzeichnis

### Diagnose
```powershell
dir C:\000.mAIn\Model\01_LLMs\GGUF\
dir C:\llama.cpp\
```

---

## 15.2 Problem: Port 8080 antwortet nicht

### Diagnose
```powershell
curl.exe http://127.0.0.1:8080/health
Get-Process llama-server
```

### Deutung
- Kein Prozess sichtbar → Server läuft nicht.
- Prozess sichtbar, aber kein Endpoint → Startfehler oder Portproblem.

---

## 15.3 Problem: Zu wenig VRAM

### Maßnahmen
- Browser schließen
- andere GPU-Programme beenden
- kleinere Quantisierung nutzen
- initial mit kleinerem Kontext testen

---

## 15.4 Problem: Mehrere Instanzen blockieren den Speicher

### Diagnose
```powershell
Get-Process llama-server
```

### Beenden aller Instanzen
```powershell
Get-Process llama-server | Stop-Process -Force
```

---

## 15.5 Problem: PowerShell-`curl` verhält sich unerwartet

### Lösung
Immer explizit `curl.exe` statt `curl` verwenden.

---

# 16. Sicherheits- und Betriebsaspekte

## 16.1 Nur lokal binden

Die empfohlene Grundkonfiguration verwendet:

```powershell
--host 127.0.0.1
```

Das bedeutet: nur lokale Nutzung auf demselben Rechner.

## 16.2 Keine unnötigen eingebauten Agent-Tools aktivieren

`llama.cpp` bietet eigene agentische Zusatzfunktionen wie `--tools` oder `--agent`. Diese sollten in diesem Projekt **nicht standardmäßig** aktiviert werden.

### Warum?
Weil Hermes selbst die Agentenlogik und Werkzeugnutzung übernimmt. In diesem Aufbau ist `llama.cpp` das **LLM-Backend**, nicht der Agent.

## 16.3 API-Key optional intern, aber lokal meist nicht nötig

Für ein rein lokales Setup ist ein API-Key meist nicht zwingend erforderlich. Wenn der Server später im Netzwerk geöffnet wird, sollte das Konzept überdacht werden.

---

# 17. Wissenschaftliche Anschlussfähigkeit

Ein System ist dann für erste akademische Arbeit interessant, wenn es:

- reproduzierbar,
- dokumentiert,
- modular,
- evaluierbar,
- und klar parametrisierbar ist.

Das hier beschriebene `llama.cpp`-Setup erfüllt diese Bedingungen in bemerkenswert gutem Maß.

## 17.1 Mögliche Themen für weiterführende Arbeiten

1. Einfluss der Kontextgröße auf Tool-Calling-Qualität  
2. Vergleich verschiedener Quantisierungen desselben Hermes-Modells  
3. Analyse von VRAM-Verbrauch in Abhängigkeit vom KV-Cache-Typ  
4. Auswirkung von Batch- und UBatch-Einstellungen auf Antwortzeit und Stabilität  
5. Reproduzierbarkeit lokaler Agentensysteme auf Consumer-Hardware  

## 17.2 Methodischer Vorteil

Weil `llama.cpp` die relevanten Parameter unmittelbar offenlegt, lassen sich Versuche und Beobachtungen systematisch protokollieren. Das ist für wissenschaftlich orientierte Arbeit ein erheblicher Vorteil.

---

# 18. Endfazit

Die saubere, ausschließlich auf `llama.cpp` basierende Lösung für den vorliegenden Hermes-Anwendungsfall lautet:

## Endgültige Empfehlung

- **llama.cpp / llama-server** als einziger Inferenzkern
- **Hermes-3-Llama-3.1-8B-GGUF** als Hauptmodell
- **64k-Kontext-orientierte Konfiguration**
- **1 Slot** statt geteilter Mehrfachslots
- **Batch-Datei** für komfortablen Windows-Start
- **Hermes Custom Endpoint** auf `http://127.0.0.1:8080/v1`

## Kernaussage

> Für einen lokalen Hermes-Agenten auf dem vorliegenden Windows-System ist ein direktes `llama.cpp`-Setup mit langem Kontext, sauberer Batch-Startdatei und Hermes-3-8B-Modell die fachlich beste und praktisch sinnvollste Lösung.

---

# 19. Linkverzeichnis

## llama.cpp
- Projekt: https://github.com/ggml-org/llama.cpp
- Server-Dokumentation: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md

## Hermes
- FAQ / Local Models / Custom Endpoint: https://hermes-agent.nousresearch.com/docs/reference/faq
- Desktop App: https://hermes-agent.nousresearch.com/docs/user-guide/desktop

## Modell
- Hermes-3-Llama-3.1-8B-GGUF: https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF

---

# 20. Anhang: empfohlene Befehle mit Erklärung

## 20.1 Server starten – Produktionsprofil

```powershell
C:\llama.cpp\llama-server.exe ^
  -m C:\000.mAIn\Model\01_LLMs\GGUF\hermes-3-llama-3.1-8b-q6_k.gguf ^
  --host 127.0.0.1 --port 8080 ^
  -ngl all ^
  -c 65536 ^
  -np 1 ^
  -ctk q8_0 -ctv q8_0 ^
  -fa on ^
  -b 2048 -ub 512 ^
  -t 8 ^
  --jinja
```

**Wirkung:** startet den lokalen Inferenzserver für Hermes.

---

## 20.2 Modellliste abfragen

```powershell
curl.exe http://127.0.0.1:8080/v1/models
```

**Wirkung:** prüft, ob die OpenAI-kompatible API aktiv ist.

---

## 20.3 Health-Check

```powershell
curl.exe http://127.0.0.1:8080/health
```

**Wirkung:** prüft, ob der Server antwortet.

---

## 20.4 GPU-Status prüfen

```powershell
nvidia-smi
```

**Wirkung:** zeigt GPU-Speicherbelegung und laufende Prozesse.

---

## 20.5 Laufende Serverprozesse anzeigen

```powershell
Get-Process llama-server
```

**Wirkung:** listet alle aktiven `llama-server`-Instanzen.

---

## 20.6 Hängende Serverprozesse beenden

```powershell
Get-Process llama-server | Stop-Process -Force
```

**Wirkung:** beendet alle laufenden Instanzen sofort.

---

## 20.7 Hermes-Modellkonfiguration aufrufen

```powershell
hermes model
```

**Wirkung:** öffnet die Provider-/Endpoint-Konfiguration in Hermes.

---

## 20.8 Optional: Geräte anzeigen, die llama.cpp erkennt

```powershell
C:\llama.cpp\llama-server.exe --list-devices
```

**Wirkung:** zeigt, welche Compute-Geräte `llama.cpp` zur Verfügung stehen.

---

## 20.9 Optional: Hilfe anzeigen

```powershell
C:\llama.cpp\llama-server.exe --help
```

**Wirkung:** zeigt die vollständige Parameterliste des Servers.

---

# Schlussformel

Wenn dieses Dokument in einer einzigen präzisen Schlussformel zusammengefasst werden soll, dann lautet sie:

> **Nicht mehrere Plattformen, nicht mehrere Abstraktionsschichten, sondern ein sauber konfiguriertes `llama.cpp`-Backend mit Hermes-3-8B und langem Kontext ist für dieses Projekt die richtige technische Mitte zwischen Alltagstauglichkeit, Kontrolle und wissenschaftlicher Nachvollziehbarkeit.**
