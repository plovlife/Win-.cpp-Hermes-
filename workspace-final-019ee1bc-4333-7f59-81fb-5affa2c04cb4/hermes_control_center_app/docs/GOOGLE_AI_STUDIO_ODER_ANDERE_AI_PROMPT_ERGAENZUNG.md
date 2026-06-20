# Prompt-Ergänzung für Google AI Studio oder andere KI-Systeme

Nutze diese Ergänzung zusätzlich zum Hauptprompt, wenn eine KI das Produkt weiterbauen soll:

---

Bitte entwickle dieses Projekt nicht als abstrakte Demo, sondern als reales Desktop-Kontrollzentrum für einen Windows-Nutzer, der lokal mit llama.cpp arbeitet und Hermes als Haupt-Agenten verwendet.

Das Endprodukt soll so gestaltet werden, dass ein technisch interessierter Nutzer ohne tägliche CLI-Arbeit:
- seinen lokalen llama.cpp-Server starten und stoppen kann,
- Profile für unterschiedliche Modelle verwalten kann,
- Hermes schnell mit dem richtigen Endpoint verbinden kann,
- GitHub, Hugging Face und Gemini / Google AI Studio anbinden kann,
- und Probleme über Health-Checks, Modelllisten und Logs diagnostizieren kann.

Wichtige Prioritäten:
1. llama.cpp zuerst
2. Hermes-Unterstützung direkt sichtbar
3. Secrets nur serverseitig
4. modulare Adapterstruktur
5. deutschsprachige UI
6. klare Fehlermeldungen
7. Desktop-artiger Eindruck statt reiner Web-Demo

Wenn du neue Funktionen hinzufügst, ordne sie in diese Struktur ein:
- Dashboard
- llama.cpp
- Hermes
- Integrationen
- Profile
- Diagnose / Logs
- Einstellungen

Bitte verwende keine Architektur, die den lokalen llama.cpp-Schwerpunkt aufweicht oder durch ein rein cloudbasiertes Modell ersetzt.

---

Kurze Produktformel:

> Hermes Control Center ist eine lokale Desktop-Anwendung zur Verwaltung eines llama.cpp-Servers als Haupt-LLM-Backend, mit Hermes als Haupt-Client und GitHub/Hugging Face/Gemini als ergänzende Integrationsdienste.
