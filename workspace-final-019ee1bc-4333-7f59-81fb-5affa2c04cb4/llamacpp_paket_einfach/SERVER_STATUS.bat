@echo off
echo.
echo ============================================================
echo  SERVER STATUS
echo ============================================================
echo.
echo 1) Laufende llama-server Prozesse:
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Process llama-server -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,CPU,WS | Format-Table -AutoSize"
echo.
echo 2) Health-Check:
curl.exe http://127.0.0.1:8080/health
echo.
echo.
echo 3) Modelle:
curl.exe http://127.0.0.1:8080/v1/models
echo.
pause
