# COPILOT – 10 HARTE REGELN

## Geltungsbereich
Diese Regeln sind für jede Arbeit an diesem Repository verbindlich.

1. **Arbeitsordner:** Arbeite ausschließlich in `hermes_control_center_app/`.
   `hermes_control_center_blueprint/` und `llamacpp_paket_einfach/` sind Referenzordner und werden nicht umgebaut.

2. **Produktkern:** `llama.cpp` bleibt das lokale Haupt-Backend. Hermes bleibt der Haupt-Agent-Client.
   GitHub, Hugging Face und Gemini sind Zusatzintegrationen.

3. **Kein Richtungswechsel:** Kein Stack-Wechsel, kein Rewrite, keine Cloud-only-Architektur, keine neue Produktdefinition.

4. **Source of Truth zuerst lesen:**
   - `COPILOT_STRIKTE_VORGABEN_FINAL.md`
   - `FINAL_ABSCHLUSS_UND_UEBERGABE.md`
   - `hermes_control_center_app/docs/KI_UEBERGABE_PROMPT_V3_FINAL.md`
   - `hermes_control_center_app/docs/AI_KEYNOTES_PRODUKTANWENDUNG.md`
   - `hermes_control_center_app/docs/AI_SYSTEM_HINWEISE_FUER_WEITERENTWICKLUNG.md`
   - `hermes_control_center_app/docs/ENTSCHEIDUNG_A_STATT_B.md`

5. **Option A ist final.** Option B wird nicht mehr verwendet oder neu vorgeschlagen.

6. **Sicherheit ist nicht verhandelbar:**
   - `contextIsolation: true`
   - `nodeIntegration: false`
   - keine Secrets im Frontend
   - IPC nur über Preload-Bridge

7. **Prioritäten strikt einhalten:**
   - P1: llama.cpp stabil + Logs/Diagnose + Hermes Quick Connect + Desktop-Verhalten
   - P2: lokales Chat-Testfenster + Streaming + Profile
   - P3: HF-Browser + In-App-Download + GPU/VRAM-Monitor
   - P4: Auto-Updater + Installer/Release

8. **Arbeitsweise:** Erst IST-Zustand analysieren, dann Lücken benennen, dann genau **einen** kleinen nächsten Ausbauschritt vorschlagen.

9. **Keine stillen Großumbauten:** Keine Massen-Refactors, keine Strukturumbauten, keine Löschaktionen ohne ausdrücklichen Auftrag.

10. **Bei Konflikt warnen:** Wenn eine Vorgabe technisch falsch, unsicher oder unmöglich ist, markiere das explizit als `⚠ KONFLIKT`, bevor du Änderungen vorschlägst.
