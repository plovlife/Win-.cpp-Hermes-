@echo off
setlocal
set SCRIPT_DIR=%~dp0
echo.
echo ============================================================
echo  LLAMA.CPP SERVER START - EINFACHER GUI START
echo ============================================================
echo.
echo Beim ersten Start wirst du nach llama-server.exe und deinem
echo .gguf Modell gefragt.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%START_llama_server_GUI.ps1"
echo.
echo Der Start wurde beendet oder das Fenster wurde geschlossen.
pause
endlocal
