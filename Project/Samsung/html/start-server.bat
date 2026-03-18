@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo [자산현황 로컬 서버]
echo.
echo 접속: http://localhost:3000/  (대시보드+자산현황 메뉴)
echo 종료: Ctrl+C
echo.
where node >nul 2>&1
if %errorlevel% equ 0 (
  node server.js
) else (
  python -m http.server 3000 --bind 0.0.0.0
)
if %errorlevel% neq 0 pause
