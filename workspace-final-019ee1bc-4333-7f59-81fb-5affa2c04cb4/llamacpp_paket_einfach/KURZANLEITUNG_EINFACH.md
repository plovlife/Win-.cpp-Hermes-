# Kurzanleitung – llama.cpp ganz einfach

## Ziel
Du willst deinen lokalen llama.cpp-Server moeglichst einfach starten und mit Hermes verbinden.

---

## Schritt 1 – Server starten

Starte per Doppelklick:

`START_llama_server_GUI.bat`

Beim ersten Mal fragt das Paket nach zwei Dateien:

1. `llama-server.exe`
2. dein `.gguf`-Modell

Danach werden diese Pfade gespeichert und beim naechsten Start automatisch wiederverwendet.

---

## Schritt 2 – Warten bis der Server laeuft

Wenn alles richtig ist, bleibt ein Fenster offen und `llama-server` laeuft.

Das ist normal.

---

## Schritt 3 – Funktion pruefen

Doppelklick auf:

`SERVER_TEST_UND_WEBUI.bat`

Das macht zwei Dinge:

1. oeffnet die WebUI im Browser
2. testet die Endpunkte `/health` und `/v1/models`

---

## Schritt 4 – Hermes einrichten

In Hermes eintragen:

- **Provider:** Custom endpoint
- **URL:** `http://127.0.0.1:8080/v1`
- **Context Length:** `64000`

Mehr steht auch in `HERMES_EINSTELLUNGEN.txt`.

---

## Schritt 5 – Server stoppen

Doppelklick auf:

`STOP_llama_server.bat`

---

## Schritt 6 – Dateien neu auswaehlen

Wenn du spaeter eine andere `llama-server.exe` oder ein anderes Modell nehmen willst:

Doppelklick auf:

`EINSTELLUNGEN_ZURUECKSETZEN.bat`

Danach wieder `START_llama_server_GUI.bat` starten.

---

## Empfohlene Standardwerte in diesem Paket

- Host: `127.0.0.1`
- Port: `8080`
- GPU-Layer: `all`
- Kontext: `65536`
- Slots: `1`
- KV-Cache: `q8_0`
- Flash Attention: `on`
- Batch: `2048`
- UBatch: `512`
- Threads: `8`
- Jinja: aktiv

Diese Werte sind auf einen lokalen Hermes-Anwendungsfall ausgerichtet.
