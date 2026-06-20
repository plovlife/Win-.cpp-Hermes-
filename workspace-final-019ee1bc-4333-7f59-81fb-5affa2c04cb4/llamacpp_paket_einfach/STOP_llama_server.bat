@echo off
echo Stoppe laufende llama-server Prozesse ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Process llama-server -ErrorAction SilentlyContinue | Stop-Process -Force; if ($?) { Write-Host 'Fertig.' }"
echo.
echo Wenn kein Fehler kam, ist der Server jetzt gestoppt.
pause
