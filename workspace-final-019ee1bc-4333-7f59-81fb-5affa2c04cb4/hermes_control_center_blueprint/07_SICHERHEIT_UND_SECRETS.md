# Sicherheit und Secret-Management

## 1. Grundregel

**Keine API-Schluessel ins Frontend.**

Alle sensiblen Tokens muessen serverseitig verwendet werden.

## 2. Relevante Secrets

- `GEMINI_API_KEY`
- `GITHUB_TOKEN`
- `HF_TOKEN`
- spaeter weitere optionale Provider-Keys

## 3. AI-Studio-spezifische Hinweise

Google AI Studio Build Mode richtet fuer neue Apps mit Gemini-Nutzung den `GEMINI_API_KEY` serverseitig automatisch ein [2](https://ai.google.dev/gemini-api/docs/aistudio-build-mode). Weitere externe Schluessel sollen manuell im Secrets-Bereich hinterlegt werden [5](https://ai.google.dev/gemini-api/docs/aistudio-fullstack).

## 4. Nie tun

- keine Tokens in React-State ausgeben
- keine Tokens in Logs schreiben
- keine Tokens in Exportdateien im Klartext speichern
- keine `.env` mit echten Schluesseln committen

## 5. Export / Import

Wenn Profile exportiert werden:
- nie echte Secrets mitschreiben
- stattdessen nur Platzhalter oder Referenzen speichern

## 6. UI-Regeln

- Passwortfelder maskieren
- beim Testen nur Erfolg / Fehler anzeigen
- nicht den ganzen Key zurueckgeben
- maximal letzte 4 Zeichen sichtbar machen

## 7. Lokale llama.cpp Sicherheit

Im MVP soll der `llama-server` standardmaessig nur auf `127.0.0.1` laufen. Das verhindert ungewollten Netzwerkkontakt aus dem lokalen Netzwerk.

## 8. Zukunft

Falls spaeter eine Desktop-App entsteht, sollte geprueft werden:
- verschluesselte lokale Secret-Speicherung
- OS-Keychain / Credential Store
- Rollen- und Mehrbenutzerfaehigkeit
