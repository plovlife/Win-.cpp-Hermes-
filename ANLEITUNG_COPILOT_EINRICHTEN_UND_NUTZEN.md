# Anleitung: Copilot final einrichten und richtig benutzen

## 1. Welche Dateien du im Repository brauchst

Lege diese Dateien **im Repository** ab:

### Im Root des Repos
- `COPILOT_STRIKTE_VORGABEN_FINAL.md`
- `COPILOT_10_BEFEHLE.md`
- `COPILOT_STARTPROMPT_FINAL.txt`
- `FINAL_ABSCHLUSS_UND_UEBERGABE.md`
- `FINAL_START_HIER.txt`

### Im Ordner `.github/`
- `.github/copilot-instructions.md`
- `.github/PULL_REQUEST_TEMPLATE.md`

Wenn `.github/` noch nicht existiert, erstelle ihn.

---

## 2. Warum diese Ablage so wichtig ist

### Root-Dateien
Die Root-Dateien sind für Menschen und KI leicht sichtbar und dienen als Hauptreferenz.

### `.github/copilot-instructions.md`
GitHub Copilot liest diese Datei im Repository-Kontext besonders gut. Sie ist die beste Stelle für dauerhafte Copilot-Regeln.

### `.github/PULL_REQUEST_TEMPLATE.md`
Damit wird jede spätere Änderung zusätzlich diszipliniert und gegen die Projektregeln geprüft.

---

## 3. Was du Copilot im Chat schicken sollst

Wenn du mit Copilot Chat arbeitest, schicke **zuerst** den Inhalt aus:

### `COPILOT_STARTPROMPT_FINAL.txt`

Das ist dein Startbefehl an Copilot.

---

## 4. Was du Copilot danach sagen sollst

Nach dem Startprompt gibst du **nicht sofort einen riesigen Umbauauftrag**.

Sondern so:

### Richtige Reihenfolge
1. Bitte zuerst den Ist-Zustand analysieren.
2. Bitte vorhandene Funktionen auflisten.
3. Bitte die größten Lücken nennen.
4. Bitte genau **einen kleinen P1-Schritt** vorschlagen.

---

## 5. Was du Copilot NICHT sagen solltest

Nicht so anfangen:
- „Mach alles produktionsreif.“
- „Bau alles fertig.“
- „Refactor das Projekt komplett.“
- „Such dir selbst aus, wie du es strukturierst.“

Das führt fast immer dazu, dass Copilot die vorhandene Struktur verwässert.

---

## 6. Mein empfohlener erster echter Auftrag an Copilot

Nachdem Copilot die Regeln gelesen und den Ist-Zustand analysiert hat, schicke ihm als ersten sinnvollen Auftrag zum Beispiel:

> Arbeite jetzt an Priorität P1. Stabilisiere die llama.cpp-Startlogik und verbessere die Fehlerdiagnose bei ungültigen Pfaden oder nicht erreichbarem lokalen Server. Bitte nenne zuerst die betroffenen Dateien und ändere nur den kleinsten nötigen Bereich.

---

## 7. Wenn Copilot abschweift

Wenn Copilot neue Architektur, neuen Stack oder einen kompletten Umbau vorschlägt, antworte sofort:

> Das widerspricht `COPILOT_10_BEFEHLE.md` und `COPILOT_STRIKTE_VORGABEN_FINAL.md`. Bitte zurück zur bestehenden Produktlogik und nur einen kleinen P1-Schritt bearbeiten.

---

## 8. Boss-Empfehlung

### Mein letztes Wort:
- **Besser gefallen hat mir insgesamt B** als Form der harten Kurzsteuerung,
- **A war stärker bei den Meta-Hinweisen und bei der Warnung vor zu vielen Source-of-Truth-Dateien**.

### Deshalb empfehle ich final:
- **B als Grundgerüst für die harte Befehlsliste**
- **A als Korrektiv für Konfliktwarnung und Dokumentendisziplin**
- genau daraus habe ich deine finalen Copilot-Dateien gebaut

---

## 9. Kurzfassung

### Abspeichern
- Root: `COPILOT_10_BEFEHLE.md`, `COPILOT_STARTPROMPT_FINAL.txt`, `COPILOT_STRIKTE_VORGABEN_FINAL.md`
- `.github/`: `copilot-instructions.md`, `PULL_REQUEST_TEMPLATE.md`

### An Copilot schicken
- zuerst den Inhalt von `COPILOT_STARTPROMPT_FINAL.txt`
- dann nur kleine, gezielte Aufgaben

### Nicht tun
- kein Großauftrag ohne Analyse
- kein Rewrite
- kein Stack-Wechsel
