LLAMA.CPP PAKET – EINFACHER START
=================================

DIESES PAKET IST FUER DICH GEMACHT, WENN DU DEN LLAMA-SERVER MOEGLICHST EINFACH STARTEN WILLST.

WAS DU MACHEN SOLLST
-------------------
1. Doppelklick auf: START_llama_server_GUI.bat
2. Beim ersten Start waehle:
   - zuerst deine llama-server.exe
   - danach dein .gguf Modell
3. Warte, bis das Serverfenster laeuft
4. Doppelklick auf: SERVER_TEST_UND_WEBUI.bat
5. In Hermes trage ein:
   - Provider: Custom endpoint
   - URL: http://127.0.0.1:8080/v1
   - Context Length: 64000

WENN DU DEN SERVER STOPPEN WILLST
---------------------------------
Doppelklick auf: STOP_llama_server.bat

WENN DU DIE AUSGEWAEHLTEN DATEIEN AENDERN WILLST
------------------------------------------------
Doppelklick auf: EINSTELLUNGEN_ZURUECKSETZEN.bat
Danach START_llama_server_GUI.bat erneut starten.

WICHTIG
-------
- Dieses Paket nutzt nur llama.cpp.
- Das ausgewaehlte Modell sollte moeglichst ein Hermes-taugliches GGUF-Modell sein.
- Empfohlen: Hermes-3-Llama-3.1-8B-GGUF in Q6_K oder Q5_K_M.

WICHTIGE DATEIEN IN DIESEM PAKET
--------------------------------
- START_llama_server_GUI.bat          -> einfacher Start per Doppelklick
- START_llama_server_GUI.ps1          -> eigentliche Startlogik mit Dateiauswahl
- STOP_llama_server.bat               -> stoppt laufende llama-server Prozesse
- SERVER_TEST_UND_WEBUI.bat           -> oeffnet WebUI und testet den Server
- HERMES_EINSTELLUNGEN.txt            -> genau das, was du in Hermes eintragen sollst
- KURZANLEITUNG_EINFACH.md            -> kurze Schritt-fuer-Schritt-Anleitung
- abschlussbericht_nur_llamacpp.md    -> ausfuehrlicher Abschlussbericht
- abschlussbericht_nur_llamacpp.html  -> formatierte HTML-Version
