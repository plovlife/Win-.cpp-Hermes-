# User Journeys und Anwendungsfälle

## Journey 1 – Einfache lokale Nutzung

1. Nutzer öffnet Hermes Control Center.
2. Dashboard zeigt: Server läuft nicht.
3. Nutzer wechselt zu `llama.cpp`.
4. Profil „Hermes lokal – 8B – 64k“ ist geladen.
5. Nutzer klickt auf `Start`.
6. Status springt auf `läuft`.
7. Nutzer geht zu `Einstellungen` oder `Dashboard`.
8. Kopiert die Hermes Base URL.
9. Hermes nutzt nun den lokalen Endpoint.

## Journey 2 – API-Integrationen prüfen

1. Nutzer öffnet `Integrationen`.
2. GitHub ist noch nicht konfiguriert.
3. Nutzer hinterlegt serverseitig `GITHUB_TOKEN`.
4. Testbutton wird geklickt.
5. Die App zeigt Benutzername / Erfolg an.
6. Dasselbe Prinzip gilt für HF und Gemini.

## Journey 3 – Profilwechsel

1. Nutzer hat mehrere GGUF-Modelle.
2. Er speichert für jedes Modell ein Profil.
3. Vor einer Arbeitssitzung lädt er das passende Profil.
4. Danach startet er den Server mit genau diesen Werten.

## Journey 4 – Fehlersuche

1. Hermes antwortet nicht.
2. Nutzer sieht im Dashboard: Health fehlgeschlagen.
3. In `llama.cpp` erkennt er, dass der Prozess nicht läuft oder das Modell nicht geladen wurde.
4. Er prüft Logs und korrigiert Pfad oder Modell.

## Journey 5 – Forschung / Vergleich

1. Nutzer speichert Profile mit verschiedenen Kontext- und Cache-Einstellungen.
2. Mehrere Durchläufe werden durchgeführt.
3. Die App dient als visuelle Kontrollschicht fuer reproduzierbare Setups.

## Konsequenz für die App

Die App muss in allen Journeys vor allem:
- sichtbaren Status liefern,
- Profile klar verwalten,
- wenige Klicks bis zum Serverstart brauchen,
- und Integrationsprobleme leicht erkennbar machen.
