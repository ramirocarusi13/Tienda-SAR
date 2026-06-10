@echo off
REM ============================================================
REM  Frontend hot deploy - SOLO vista Andon Auditoria Hora a Hora
REM  Ruta: http://192.168.8.16:8001/andon/auditoria_hora_hora
REM
REM  Que hace:
REM   1. Esconde con git stash los cambios NO relacionados para
REM      que NO entren al build de produccion:
REM        - src/pages/Pc/TrasvasoPage.jsx
REM        - src/pages/Stock/InventarioMaterialesResultadoPage.jsx
REM        - src/services/StockService.js
REM        - deploy.bat
REM   2. Builda el bundle Vite en un container node efimero.
REM   3. Copia el dist al container front-main ya corriendo.
REM   4. Restaura los cambios stasheados en tu working tree.
REM
REM  Los archivos que SI se deployan (todos son de esta vista):
REM    - src/pages/Andon/AndonAuditoriaHoraHoraPage.jsx (nuevo)
REM    - src/router/MainRouter.jsx (import + route nuevos)
REM    - src/services/HoraHoraService.js (funcion nueva al final)
REM    - src/utils/Constants.js (constante nueva)
REM    - src/pages/LinksPage.jsx (entrada de menu nueva)
REM
REM  NO hace docker build ni docker compose down/up.
REM  NO toca api-*, api-nginx-1, ni ningun otro servicio.
REM ============================================================

setlocal

set "HERE=%~dp0"
cd /d "%HERE%"

set "FRONT_CONT=front-main"
set "FRONT_DEST=/var/www/html"
set "STASH_MSG=deploy-andon-auditoria temporal"
set "STASHED="

echo ============================================================
echo  Frontend hot deploy - auditoria_hora_hora
echo  Container a actualizar: %FRONT_CONT%
echo  El resto de los containers permanece intacto.
echo ============================================================
echo.
set /p CONFIRM="Continuar? (s/N): "
if /I not "%CONFIRM%"=="s" (
    echo Cancelado.
    exit /b 0
)

echo.
echo [1/5] Ocultando cambios no relacionados con git stash...
git stash push -m "%STASH_MSG%" -- src/pages/Pc/TrasvasoPage.jsx src/pages/Stock/InventarioMaterialesResultadoPage.jsx src/services/StockService.js deploy.bat
if errorlevel 1 goto :errNoStash
set "STASHED=1"

echo.
echo [2/5] Build del bundle Vite en container node efimero...
echo       (node_modules va a un volumen Docker dedicado para evitar
echo        problemas de hardlinks/permisos del bind-mount Windows.
echo        La primera corrida tarda mas, las siguientes son rapidas.)
docker run --rm ^
  -v "%cd%:/front" ^
  -v frontend_andon_node_modules:/front/node_modules ^
  -v frontend_andon_pnpm_store:/pnpm-store ^
  -w /front ^
  node:18-alpine sh -c "npm install -g pnpm@latest && pnpm config set store-dir /pnpm-store && pnpm config set verify-store-integrity false && pnpm install --no-frozen-lockfile && pnpm run build --mode production && chmod -R a+rw dist"
if errorlevel 1 goto :err

if not exist "dist\index.html" (
    echo ERROR: no se genero dist\index.html
    goto :err
)

echo.
echo [3/5] Copiando dist al container %FRONT_CONT%:%FRONT_DEST%/ ...
docker cp dist/. %FRONT_CONT%:%FRONT_DEST%/
if errorlevel 1 goto :err

echo.
echo [4/5] Restaurando cambios no relacionados en working tree...
git stash pop
if errorlevel 1 (
    echo Advertencia: git stash pop fallo. Revisar manualmente:
    echo    git stash list
)
set "STASHED="

echo.
echo [5/5] Listo.
echo.
echo ============================================================
echo   LISTO. Frontend desplegado sin reiniciar containers.
echo   Modificado: %FRONT_CONT% (archivos estaticos en %FRONT_DEST%)
echo   Intactos:   api-*, y todos los demas servicios.
echo.
echo   Probar: http://192.168.8.16:8001/andon/auditoria_hora_hora
echo   Tip: Ctrl+F5 en el navegador para tomar el nuevo bundle.
echo ============================================================
echo.
pause
exit /b 0

:err
echo.
echo ERROR en el deploy.
if defined STASHED (
    echo Restaurando stash...
    git stash pop
)
pause
exit /b 1

:errNoStash
echo.
echo ERROR: no pude aplicar git stash. Revisa si hay conflictos o
echo si los archivos ya fueron commiteados.
pause
exit /b 1
