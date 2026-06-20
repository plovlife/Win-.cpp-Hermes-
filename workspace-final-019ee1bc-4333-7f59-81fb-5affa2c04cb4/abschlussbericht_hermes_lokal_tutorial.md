# Abschlussbericht und Tutorial
## Lokales Hermes-Agent-System unter Windows 11 mit GUI-gestützter LLM-Inferenz

**Datum:** 19.06.2026  
**Zielgruppe:** fortgeschrittene Einsteiger, technisch interessierte Anwender sowie Nutzer mit ersten wissenschaftlichen/akademischen Ansprüchen  
**Autor:** Arena.ai Agent

---

## Kurzfassung

Dieser Bericht dokumentiert eine praktikable, lokal ausführbare und langfristig ausbaufähige Lösung für ein **Hermes-Agent-System auf Windows 11**. Im Zentrum steht nicht nur die reine Inferenzleistung, sondern die **Gesamttauglichkeit für Agent-Workflows**: stabiles Tool-Calling, lokaler Betrieb, ausreichendes Kontextfenster, nachvollziehbare Konfiguration und alltagstaugliche Bedienung.

Die wichtigste Schlussfolgerung lautet:

> **Für den hier vorliegenden Anwendungsfall ist die beste Gesamtlösung:**  
> **llama.cpp als Inferenzkern, gestartet über eine grafische Oberfläche (vorzugsweise LlamaStation), kombiniert mit Hermes Desktop und einem Hermes-tauglichen 8B-Modell im GGUF-Format.**

Hermes kann mit beliebigen **OpenAI-kompatiblen Endpoints** arbeiten; lokale Server wie **llama.cpp**, **Ollama**, **vLLM** oder **LM Studio** werden offiziell als mögliche lokale Provider genannt. Für lokale Setups nennt die Hermes-Dokumentation ausdrücklich einen **Context Length von 64000** als relevanten Zielwert für den Endpoint [3](https://hermes-agent.nousresearch.com/docs/reference/faq). LM Studio stellt seinen lokalen Server direkt im **Developer-Tab** bereit und unterstützt OpenAI-kompatible Endpoints [2](https://lmstudio.ai/docs/developer/core/server) [3](https://lmstudio.ai/docs/api/openai-api). Ollama bietet ebenfalls einen OpenAI-kompatiblen Endpoint, nutzt aber standardmäßig ein deutlich kleineres Kontextfenster und muss für lange Kontexte aktiv angepasst werden [4](https://ollama.com/blog/openai-compatibility) [1](https://docs.ollama.com/faq).

---

# 1. Problemstellung und Zielsetzung

## 1.1 Ausgangslage

Vorliegend ist ein Windows-11-System mit leistungsfähiger NVIDIA-GPU, auf dem ein **vollständig lokaler KI-Agent** betrieben werden soll. Der Nutzerwunsch ist klar:

1. **möglichst kein Arbeiten über die Kommandozeile im Alltag**
2. **grafische Bedienung** für Start, Stop und Konfiguration des Modellservers
3. **Hermes-Agent lokal** mit Dateizugriff, Tool-Calling und Agent-Aufgaben
4. **wissenschaftlich saubere, nachvollziehbare Struktur** statt bloßer Bastellösung

## 1.2 Ziel des Berichts

Dieser Bericht soll:

- den bisherigen Aufbau bewerten,
- die technisch beste Lösung für den konkreten Anwendungsfall bestimmen,
- eine **Schritt-für-Schritt-Anleitung** liefern,
- die **wichtigsten Befehle** dokumentieren,
- und eine Form bieten, die als Grundlage für weiterführende Arbeiten im Stil einer sauberen technischen Projektdokumentation taugt.

---

# 2. Systembewertung

## 2.1 Hardware-Einschätzung

Das vorhandene System ist für lokale Inferenz **sehr gut geeignet**, insbesondere für 7B- bis 14B-Modelle. Die RTX 4070 Ti SUPER mit 16 GB VRAM ist stark genug für leistungsfähige lokale GGUF-Modelle. Engpass ist nicht primär die GPU, sondern die Frage, **welches Modell für Agent-Aufgaben geeignet ist** und **wie sauber der gesamte Softwarepfad konfiguriert ist**.

## 2.2 Wichtigste praktische Konsequenz

Für diesen Anwendungsfall ist nicht entscheidend, ob theoretisch auch größere Modelle gerade noch startbar wären. Entscheidend ist vielmehr:

- **stabile Tool-Nutzung**,
- **lange Kontexte**,
- **lokaler Endpoint für Hermes**,
- **einfaches Starten ohne CLI-Stress**.

Daraus ergibt sich: Ein **8B-Modell mit guter Agent-Eignung** ist im Alltag oft wertvoller als ein deutlich größeres, aber trägeres Modell.

---

# 3. Vergleich der möglichen Laufzeitumgebungen

## 3.1 llama.cpp

`llama.cpp` ist der direkte, flexible und technisch sauberste Weg, einen lokalen Modellserver zu betreiben. Der integrierte `llama-server` unterstützt unter anderem:

- OpenAI-kompatible API,
- Anthropic-kompatible Routen,
- parallele Slots,
- Continuous Batching,
- Tool Use / Function Calling,
- Web UI,
- Monitoring-Endpunkte [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

### Bewertung
- **Stärken:** maximale Kontrolle, beste Nachvollziehbarkeit, sehr gute Performance
- **Schwächen:** ohne GUI für viele Nutzer unbequem
- **Fazit:** beste technische Basis, aber idealerweise **über GUI bedient**

## 3.2 LlamaStation

LlamaStation ist ein **Windows-GUI-Frontend für llama.cpp**, das direkt den Server startet und typische Verwaltungsaufgaben visuell zugänglich macht. Die Projektbeschreibung hebt insbesondere **Server Control**, **OpenAI-kompatible API**, Profilverwaltung und VRAM-Überwachung hervor [2](https://github.com/vico-png/llamastation).

### Bewertung
- **Stärken:** GUI, direkte llama.cpp-Nutzung, gute Alltagstauglichkeit
- **Schwächen:** jünger und weniger „Mainstream“ als LM Studio
- **Fazit:** **beste Wahl**, wenn raw `llama.cpp` erhalten bleiben soll, aber ohne tägliche CLI-Bedienung

## 3.3 LM Studio

LM Studio kann lokale Modelle per GUI laden und im **Developer-Tab** einen lokalen API-Server starten [2](https://lmstudio.ai/docs/developer/core/server). Die Dokumentation weist außerdem aus, dass viele LLM-Ladeparameter — etwa `context_length`, `flash_attention`, `eval_batch_size` oder `offload_kv_cache_to_gpu` — für die **llama.cpp-basierte Engine** gelten [4](https://lmstudio.ai/docs/developer/rest/load).

### Bewertung
- **Stärken:** sehr einfache GUI, integrierter Server, gute Einsteigerfreundlichkeit
- **Schwächen:** etwas weniger „roh“ und kontrollierbar als direktes llama.cpp
- **Fazit:** hervorragende Alternative, wenn **maximale Einfachheit** wichtiger ist als Low-Level-Kontrolle

## 3.4 Ollama

Ollama bietet einen lokalen OpenAI-kompatiblen Endpoint auf `http://localhost:11434/v1` [4](https://ollama.com/blog/openai-compatibility). Das System ist komfortabel, allerdings verwendet Ollama standardmäßig nur ein **Kontextfenster von 4096 Tokens**; längere Kontexte müssen explizit gesetzt werden [1](https://docs.ollama.com/faq).

### Bewertung
- **Stärken:** sehr einfach, populär, gute API-Kompatibilität
- **Schwächen:** Standardkontext zu klein, weniger präzise Kontrolle für diesen Hermes-Fall
- **Fazit:** brauchbar, aber für **Hermes + langes Kontextfenster + genaue Kontrolle** nicht meine erste Wahl

## 3.5 Vergleich in einem Satz

Die **Rohleistung** von `llama.cpp`, LM Studio und Ollama unterscheidet sich bei identischem Modell und ähnlicher Konfiguration **nicht dramatisch**. Der relevante Unterschied liegt vor allem in **Kontrolle, Kontextmanagement und Bedienkomfort**.

---

# 4. Endgültige Empfehlung

## 4.1 Empfohlene Hauptlösung

### **LlamaStation + llama.cpp + Hermes Desktop + Hermes-3 8B GGUF**

Diese Kombination vereint:

- direkte `llama.cpp`-Leistung,
- grafische Bedienung,
- lokalen OpenAI-kompatiblen Endpoint,
- hohe Hermes-Kompatibilität,
- und eine technisch saubere Grundlage für spätere Erweiterungen.

## 4.2 Empfohlenes Modell

### Primäre Empfehlung
- **NousResearch/Hermes-3-Llama-3.1-8B-GGUF** [1](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF/blame/b02ed3c4b23e18c0a6c7affceb4964555cabef07/README.md)

### Begründung
Das Modell ist ausdrücklich als Hermes-3-Variante ausgewiesen und mit den Themen **Function Calling** und **JSON Mode** verbunden [1](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF/blame/b02ed3c4b23e18c0a6c7affceb4964555cabef07/README.md). Für Agent-Workflows ist das wesentlich relevanter als bloße Parametergröße.

### Praktische Quantisierung
Empfohlen wird:
- **Q6_K** oder
- **Q5_K_M**

Q8_0 ist möglich, wenn noch ausreichend VRAM-Reserve für langen Kontext bleibt. Für Hermes ist **Stabilität bei 64k** wichtiger als die letzte Qualitätsreserve einer größeren Quantisierung.

---

# 5. Zielarchitektur

## 5.1 Funktionsschema

```text
[Hermes Desktop]
        │
        │ OpenAI-kompatible API
        ▼
[LlamaStation / llama.cpp Server]
        │
        │ lädt GGUF-Modell lokal
        ▼
[RTX 4070 Ti SUPER + System-RAM]
```

## 5.2 Datenfluss

1. Hermes Desktop sendet Anfragen an einen lokalen OpenAI-kompatiblen Endpoint.
2. LlamaStation startet und verwaltet intern `llama-server`.
3. Das GGUF-Modell wird lokal geladen.
4. Die Inferenz läuft lokal auf GPU/CPU.
5. Ergebnisse gehen direkt an Hermes zurück.

Hermes unterstützt diesen Custom-Endpoint-Ansatz explizit [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

---

# 6. Installation und Einrichtung – empfohlener Hauptpfad

## 6.1 Schritt 1 – Hermes Desktop installieren

**Offizielle Dokumentation:**  
https://hermes-agent.nousresearch.com/docs/user-guide/desktop

**Wichtig:** Hermes funktioniert mit beliebigen OpenAI-kompatiblen APIs und kann lokal betrieben werden [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

## 6.2 Schritt 2 – LlamaStation beschaffen

**Projektseite:**  
https://github.com/vico-png/llamastation [2](https://github.com/vico-png/llamastation)

LlamaStation ist dann der grafische Starter für deinen lokalen `llama.cpp`-Server.

## 6.3 Schritt 3 – Modell herunterladen

**Empfohlenes Modell:**  
https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF [1](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF/blame/b02ed3c4b23e18c0a6c7affceb4964555cabef07/README.md)

Speichere das Modell in deinem Modellordner, z. B.:

```text
C:\000.mAIn\Model\01_LLMs\GGUF\
```

## 6.4 Schritt 4 – LlamaStation-Profil anlegen

Empfohlene Werte:

- **Host:** `127.0.0.1`
- **Port:** `8080`
- **GPU Layers:** `all` bzw. `-1`
- **Context:** `65536`
- **Parallel Slots:** `1`
- **Threads:** `8`
- **Flash Attention:** `ON`
- **Jinja:** `ON`
- **KV Cache K:** `q8_0`
- **KV Cache V:** `q8_0`
- **Batch:** `2048`
- **Micro Batch:** `512`

## 6.5 Schritt 5 – Hermes mit lokalem Endpoint verbinden

Hermes-Dokumentation für lokale Modelle / Custom Endpoint [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

In Hermes:

- **Provider:** `Custom endpoint`
- **Base URL:** `http://127.0.0.1:8080/v1`
- **API Key:** beliebiger Platzhalter, falls verlangt
- **Model Name:** der geladene Modellname
- **Context Length:** `64000`

Die Hermes-Dokumentation nennt `64000` ausdrücklich als sinnvollen Zielwert für lokale Setups [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

---

# 7. Alternative Einrichtung – maximal einfach mit LM Studio

Wenn die Bedienung wichtiger ist als unmittelbare `llama.cpp`-Nähe, ist LM Studio eine ausgezeichnete Alternative.

## 7.1 Serverstart

LM Studio kann im **Developer-Tab** per Schalter den lokalen Server starten [2](https://lmstudio.ai/docs/developer/core/server).

## 7.2 API-Kompatibilität

LM Studio bietet OpenAI-kompatible Endpoints [3](https://lmstudio.ai/docs/api/openai-api).

## 7.3 Hermes-Anbindung

Dann gilt praktisch dieselbe Hermes-Konfiguration wie oben:

- Base URL: `http://localhost:1234/v1`
- Context Length in Hermes: `64000`
- Modell vorher in LM Studio geladen

## 7.4 Bewertung

LM Studio ist die bequemste Einsteigerlösung, aber aus Sicht dieses Projekts liegt die **Endempfehlung** trotzdem bei **LlamaStation + llama.cpp**, weil dort mehr Kontrolle bei langem Kontext und servernaher Konfiguration verbleibt.

---

# 8. Wichtige Befehle – mit Erklärung

Diese Befehle sind nicht für den täglichen Dauerbetrieb gedacht, sondern für **Test, Diagnose und Dokumentation**.

## 8.1 Endpoint testen

```powershell
curl.exe http://127.0.0.1:8080/v1/models
```

### Was passiert hier?
- `curl.exe` sendet eine HTTP-Anfrage an den lokalen API-Server.
- `/v1/models` fragt ab, welche Modelle der Server kennt oder geladen hat.
- Wenn hier eine gültige Antwort kommt, läuft der Server grundsätzlich.

### Warum `curl.exe`?
Unter PowerShell ist `curl` oft nur ein Alias auf `Invoke-WebRequest`. `curl.exe` ruft das echte curl-Programm auf und vermeidet Syntaxprobleme.

---

## 8.2 Health-Check

```powershell
curl.exe http://127.0.0.1:8080/health
```

### Was passiert hier?
- Der Server wird gefragt, ob er betriebsbereit ist.
- Eine positive Antwort zeigt: Prozess lebt, Port stimmt, Dienst antwortet.

---

## 8.3 GPU-Auslastung prüfen

```powershell
nvidia-smi
```

### Was passiert hier?
- NVIDIA zeigt an, welche Prozesse gerade GPU-Speicher belegen.
- Du siehst, ob `llama-server.exe` tatsächlich läuft und wie viel VRAM belegt wird.

### Wofür ist das wichtig?
- doppelte Serverprozesse erkennen
- VRAM-Engpässe sehen
- prüfen, ob das Modell wirklich auf der GPU sitzt

---

## 8.4 Laufende llama-Prozesse anzeigen

```powershell
Get-Process llama-server
```

### Was passiert hier?
- PowerShell listet alle laufenden Prozesse mit dem Namen `llama-server` auf.
- So erkennt man leicht, ob versehentlich mehrere Instanzen laufen.

---

## 8.5 Hängende Instanzen beenden

```powershell
Get-Process llama-server | Stop-Process -Force
```

### Was passiert hier?
- Alle laufenden `llama-server`-Prozesse werden beendet.
- Das hilft, wenn VRAM blockiert ist oder der Port belegt bleibt.

---

## 8.6 Hermes-Modellkonfiguration starten

```powershell
hermes model
```

### Was passiert hier?
- Der Hermes-Konfigurationsdialog für das Modell wird geöffnet.
- Dort wählst du den lokalen Custom-Endpoint.

Hermes empfiehlt für lokale Provider genau diesen Weg und dokumentiert den Custom-Endpoint-Ansatz explizit [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

---

## 8.7 Rohstart von llama.cpp – nur zu Dokumentationszwecken

Im Alltag soll das **nicht** täglich manuell verwendet werden. Es dient nur dazu, die zugrunde liegende Logik zu verstehen.

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

### Erklärung der wichtigsten Parameter

#### `-m ...`
Legt die Modell-Datei fest.

#### `--host 127.0.0.1 --port 8080`
Der Server lauscht lokal auf Port 8080.

#### `-ngl all`
Bestimmt, wie viele Modell-Layer in VRAM ausgelagert werden. `llama.cpp` dokumentiert `-ngl` als Parameter für die maximale Anzahl der GPU-Layer [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

#### `-c 65536`
Setzt die Kontextgröße. Hermes braucht für den hier angestrebten Agent-Betrieb ein langes Kontextfenster; 64000 ist der relevante Hermes-Zielwert [3](https://hermes-agent.nousresearch.com/docs/reference/faq).

#### `-np 1`
Setzt die Anzahl der Server-Slots auf 1. `llama.cpp` dokumentiert `-np, --parallel` als Zahl der Server-Slots [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

#### `-ctk q8_0 -ctv q8_0`
Quantisiert den KV-Cache für Key und Value. `llama.cpp` dokumentiert diese Cache-Typen direkt [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

#### `-fa on`
Aktiviert Flash Attention. `llama.cpp` dokumentiert `-fa, --flash-attn` als expliziten Server-Parameter [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

#### `-b 2048 -ub 512`
Bestimmt logische Batchgröße und physische Micro-Batchgröße. Diese Größen wirken sich auf Speichernutzung und Durchsatz aus [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

#### `-t 8`
Setzt die CPU-Threads für die Inferenz.

#### `--jinja`
Aktiviert die Jinja-Template-Logik für den Chat. `llama.cpp` dokumentiert `--jinja` ausdrücklich als Schalter für die Chat-Template-Engine [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md).

---

# 9. Wichtige technische Hinweise

## 9.1 Warum 64k Kontext?

Hermes ist nicht bloß ein Chatfenster, sondern ein Agent mit Werkzeugnutzung, Verlauf, Tool-Ergebnissen und interner Prozesslogik. Die Hermes-FAQ nennt für lokale Custom-Endpoints **64000** als Zielwert [3](https://hermes-agent.nousresearch.com/docs/reference/faq). Deshalb ist ein auf 16k optimiertes Setup für reines Chatten unter Umständen ausreichend, für den Hermes-Anwendungsfall aber nicht optimal.

## 9.2 Warum 1 Slot statt vieler paralleler Slots?

`llama.cpp` unterstützt mehrere Slots und Continuous Batching [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). In diesem Projekt ist aber nicht Multi-User-Serverbetrieb das Ziel, sondern **ein stabiler lokaler Agent**. Daher ist **1 Slot mit vollem Kontext** in der Praxis meist sinnvoller als mehrere geteilte Slots.

## 9.3 Warum nicht standardmäßig `--no-mmap`?

`llama.cpp` dokumentiert `--mmap, --no-mmap` so, dass deaktiviertes Memory-Mapping **langsameres Laden** bedeuten kann und nur in bestimmten Fällen hilfreich ist [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). Daher gilt:

> `--no-mmap` ist kein allgemeiner Performance-Trick, sondern nur ein Sonderwerkzeug.

## 9.4 Warum Ollama hier nicht Hauptempfehlung ist

Ollama ist bequem, aber standardmäßig mit **4096 Kontext** konfiguriert und muss für lange Kontexte aktiv angepasst werden [1](https://docs.ollama.com/faq). Für dieses Projekt ist das weniger elegant als ein direktes `llama.cpp`/LlamaStation-Setup.

---

# 10. Testprotokoll nach der Einrichtung

Nach der Einrichtung sollten mindestens folgende Tests durchgeführt werden:

## Test 1 – Server erreichbar

```powershell
curl.exe http://127.0.0.1:8080/v1/models
```

**Erwartung:** gültige JSON-Antwort mit Modellinformation.

## Test 2 – Health-Check

```powershell
curl.exe http://127.0.0.1:8080/health
```

**Erwartung:** positive Statusantwort.

## Test 3 – Hermes-Verbindung

In Hermes eine einfache Anfrage stellen, z. B.:

> „Nenne mir kurz den Zweck dieses Systems.“

**Erwartung:** Hermes antwortet über das lokale Modell.

## Test 4 – Tool-Aufgabe

> „Liste alle Dateien in diesem Ordner auf.“

**Erwartung:** korrektes Tool-Calling und strukturierte Ausgabe.

## Test 5 – Schreibaufgabe

> „Erstelle eine Datei HERMES_TEST.txt mit dem Inhalt: Tool-Calling funktioniert.“

**Erwartung:** Hermes nutzt das Dateitool korrekt.

---

# 11. Troubleshooting

## Problem: Port 8080 antwortet nicht
**Lösung:**
- Prüfen, ob Server wirklich gestartet wurde
- `curl.exe http://127.0.0.1:8080/health`
- `Get-Process llama-server`

## Problem: VRAM bleibt knapp
**Lösung:**
- Browser schließen
- doppelte Instanzen beenden
- kleinere Quantisierung wählen
- Kontext testweise reduzieren, bis Grundfunktion steht

## Problem: Hermes verbindet sich, aber Tool-Aufgaben sind unzuverlässig
**Lösung:**
- Modell wechseln, bevorzugt Hermes-3 8B
- Gemma nicht als primäre Agent-Lösung nutzen

## Problem: PowerShell-`curl` verhält sich merkwürdig
**Lösung:**
- immer `curl.exe` statt `curl` verwenden

---

# 12. Wissenschaftlich/akademisch relevante Perspektive

Dieses Setup eignet sich nicht nur als Alltagswerkzeug, sondern auch als Ausgangspunkt für strukturierte technische Arbeit, etwa in folgenden Bereichen:

1. **Vergleich lokaler Inferenz-Engines**
2. **Evaluation von Tool-Calling-Fähigkeiten verschiedener GGUF-Modelle**
3. **Untersuchung des Einflusses langer Kontextfenster auf Agent-Workflows**
4. **Vergleich GUI-gestützter und CLI-basierter Betriebsmodelle**
5. **Dokumentation reproduzierbarer lokaler KI-Experimente auf Consumer-Hardware**

Gerade weil Hermes mit lokalen OpenAI-kompatiblen Endpoints arbeiten kann [3](https://hermes-agent.nousresearch.com/docs/reference/faq), lässt sich der Aufbau vergleichsweise sauber variieren und evaluieren.

---

# 13. Endfazit

Die bisherige Arbeit war **nicht vergeblich**, sondern bereits technisch weit fortgeschritten. Die wichtigsten Korrekturen betreffen nicht die Hardware, sondern die **Architekturentscheidung**.

## Endgültige Empfehlung

### Primärer Zielaufbau
- **Hermes Desktop**
- **LlamaStation als GUI für llama.cpp**
- **Hermes-3-Llama-3.1-8B-GGUF**
- **64k-konformer lokaler Endpoint**

## Warum genau dieser Aufbau?
Weil er:
- lokal bleibt,
- Hermes-kompatibel ist,
- wenig Alltags-CLI erfordert,
- technisch nachvollziehbar dokumentierbar ist,
- und als Grundlage für weiterführende akademische Arbeit taugt.

---

# 14. Linkverzeichnis

## Offizielle / zentrale Projektseiten
- Hermes Agent FAQ: https://hermes-agent.nousresearch.com/docs/reference/faq [3](https://hermes-agent.nousresearch.com/docs/reference/faq)
- Hermes Desktop Doku: https://hermes-agent.nousresearch.com/docs/user-guide/desktop
- LlamaStation: https://github.com/vico-png/llamastation [2](https://github.com/vico-png/llamastation)
- LM Studio Server-Doku: https://lmstudio.ai/docs/developer/core/server [2](https://lmstudio.ai/docs/developer/core/server)
- LM Studio OpenAI API: https://lmstudio.ai/docs/api/openai-api [3](https://lmstudio.ai/docs/api/openai-api)
- LM Studio Model Load / llama.cpp engine: https://lmstudio.ai/docs/developer/rest/load [4](https://lmstudio.ai/docs/developer/rest/load)
- Ollama FAQ: https://docs.ollama.com/faq [1](https://docs.ollama.com/faq)
- Ollama OpenAI Compatibility: https://ollama.com/blog/openai-compatibility [4](https://ollama.com/blog/openai-compatibility)
- llama.cpp Server-README: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md [4](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- Hermes-3 8B GGUF: https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF [1](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF/blame/b02ed3c4b23e18c0a6c7affceb4964555cabef07/README.md)

---

# 15. Kompakte Schlussformel

Wenn nur **ein einziger Satz** als Endergebnis dieses Berichts festgehalten werden soll, dann dieser:

> **Für einen lokalen Hermes-Agent auf dem vorliegenden Windows-System ist ein GUI-gestütztes llama.cpp-Setup über LlamaStation mit Hermes-3 8B und langem Kontext die fachlich beste und praktisch sinnvollste Lösung.**
