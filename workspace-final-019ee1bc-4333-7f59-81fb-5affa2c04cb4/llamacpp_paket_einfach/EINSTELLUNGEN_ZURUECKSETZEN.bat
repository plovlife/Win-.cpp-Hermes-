@echo off
set SETTINGS=%~dp0llamacpp_settings.json
if exist "%SETTINGS%" (
  del /f /q "%SETTINGS%"
  echo Gespeicherte Einstellungen wurden geloescht.
) else (
  echo Es waren keine gespeicherten Einstellungen vorhanden.
)
echo.
echo Beim naechsten Start wirst du die Dateien neu auswaehlen.
pause
