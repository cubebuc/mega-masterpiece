@echo off
start /min "mega-masterpiece" cmd /k "start /min startBackend.bat & start /min startFrontend.bat"
echo -------------------------------------
echo             App running
echo -------------------------------------
echo React front-end        localhost:3000
echo Express back-end       localhost:5000
echo -------------------------------------
pause
taskkill /T /F /FI "WINDOWTITLE eq mega-masterpiece" > nul