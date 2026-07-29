@echo off
REM ============================================================
REM  Frontend hot deploy - solo cambios de racks (TrasvasoPage)
REM  Builda el bundle Vite en un container node efimero y copia
REM  el dist al container tienda-frontend ya corriendo.
REM  NO hace docker build ni docker compose down/up.
REM
REM  Oculta los cambios no relacionados con git stash antes del
REM  build para que NO salgan a produccion:
REM    - src/pages/Stock/InventarioMaterialesResultadoPage.jsx
REM    - src/services/StockService.js
REM    - deploy.bat
REM  Quedan deplorables los cambios de rack en TrasvasoPage.jsx.
REM ============================================================

setlocal

set "HERE=%~dp0"
cd /d "%HERE%"

set "FRONT_CONT=tienda-frontend"
set "FRONT_DEST=/var/www/html"
set "STASH_MSG=deploy-sin-tirar-docker temporal"

echo ============================================================
echo  Frontend hot deploy - flujo de ingreso a racks (TrasvasoPage)
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
git stash push -m "%STASH_MSG%" -- src/pages/Stock/InventarioMaterialesResultadoPage.jsx src/services/StockService.js deploy.bat
if errorlevel 1 goto :errNoStash

set "STASHED=1"

echo.
echo [2/5] Build del bundle Vite en container node efimero...
echo       (instala pnpm + dependencias y compila - puede tardar)
docker run --rm -v "%cd%:/front" -w /front node:18-alpine sh -c "npm install -g pnpm@latest && pnpm config set verify-store-integrity false && pnpm install --no-frozen-lockfile && pnpm run build --mode production"
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
    echo Advertencia: git stash pop fallo. Revisa manualmente:
    echo    git stash list
)
set "STASHED="

echo.
echo [5/5] Listo.
echo.
echo ============================================================
echo   LISTO. Frontend desplegado sin reiniciar containers.
echo   Modificado: %FRONT_CONT% (archivos estaticos en %FRONT_DEST%)
echo   Intactos:   api-*, front-main, y todos los demas servicios.
echo.
echo   Tip: forza recarga en los navegadores/pc-scanner (Ctrl+F5)
echo        para que tomen el nuevo bundle.
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
