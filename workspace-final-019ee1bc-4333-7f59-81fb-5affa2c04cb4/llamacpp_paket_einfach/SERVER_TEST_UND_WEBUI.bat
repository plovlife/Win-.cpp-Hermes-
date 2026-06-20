@echo off
echo.
echo ============================================================
echo  TESTE LLAMA.CPP SERVER UND OEFFNE WEBUI
echo ============================================================
echo.
echo Oeffne WebUI im Browser ...
start "" "http://127.0.0.1:8080"
echo.
echo TEST 1: /health
curl.exe http://127.0.0.1:8080/health
echo.
echo.
echo TEST 2: /v1/models
curl.exe http://127.0.0.1:8080/v1/models
echo.
echo.
echo Wenn hier JSON erscheint, laeuft der Server korrekt.
pause
