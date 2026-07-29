@echo off
REM ============================================================
REM  Hot deploy - PC/ABASTECIMIENTO (turno + impresion total)
REM
REM  Objetivo:
REM   - Actualizar SOLO este cambio en produccion sin tirar docker.
REM   - Mantener intactos los demas servicios/funciones.
REM
REM  Que hace:
REM   1) Backend: copia solo LectraController.php a tienda-api1 y tienda-api2.
REM   2) Backend: limpia cache/config/routes en ambos containers.
REM   3) Frontend: oculta cambios no relacionados con git stash.
REM   4) Frontend: builda dist en container node efimero.
REM   5) Frontend: copia dist al container tienda-frontend.
REM   6) Frontend: restaura el stash de cambios ocultos.
REM
REM  NO hace docker compose down, NO reinicia servicios.
REM ============================================================

setlocal EnableExtensions

set "HERE=%~dp0"
cd /d "%HERE%"
set "API_DIR=%cd%"
set "FRONT_DIR=%HERE%..\frontend"

set "CONT1=tienda-api1"
set "CONT2=tienda-api2"
set "API_DEST=/var/www/html"
set "API_FILE=app/Http/Controllers/LectraController.php"

set "FRONT_CONT=tienda-frontend"
set "FRONT_DEST=/var/www/html"
set "STASH_MSG=deploy-abastecimiento-hotfix-%RANDOM%-%RANDOM%"
set "STASHED="
set "STASH_REF="
set "ID_CONT1_BEFORE="
set "ID_CONT2_BEFORE="
set "ID_FRONT_BEFORE="
set "ID_CONT1_AFTER="
set "ID_CONT2_AFTER="
set "ID_FRONT_AFTER="

echo ============================================================
echo  Hot deploy - PC/ABASTECIMIENTO (sin tirar servicios)
echo  Backend containers: %CONT1%, %CONT2%
echo  Frontend container: %FRONT_CONT%
echo ============================================================
echo.
set /p CONFIRM="Continuar? (s/N): "
if /I not "%CONFIRM%"=="s" (
    echo Cancelado.
    exit /b 0
)

if not exist "%API_FILE%" (
    echo ERROR: falta %API_FILE% en %API_DIR%.
    pause
    exit /b 1
)

if not exist "%FRONT_DIR%\src\pages\Pc\AbastecimientoLectraPage.jsx" (
    echo ERROR: falta src/pages/Pc/AbastecimientoLectraPage.jsx en frontend.
    pause
    exit /b 1
)

if not exist "%FRONT_DIR%\src\services\LectraService.js" (
    echo ERROR: falta src/services/LectraService.js en frontend.
    pause
    exit /b 1
)

echo.
echo [0/7] Precheck: validando containers y guardando IDs...
call :check_running %CONT1% || goto :err
call :check_running %CONT2% || goto :err
call :check_running %FRONT_CONT% || goto :err
for /f %%I in ('docker inspect -f "{{.Id}}" %CONT1%') do set "ID_CONT1_BEFORE=%%I"
for /f %%I in ('docker inspect -f "{{.Id}}" %CONT2%') do set "ID_CONT2_BEFORE=%%I"
for /f %%I in ('docker inspect -f "{{.Id}}" %FRONT_CONT%') do set "ID_FRONT_BEFORE=%%I"
if "%ID_CONT1_BEFORE%"=="" goto :err
if "%ID_CONT2_BEFORE%"=="" goto :err
if "%ID_FRONT_BEFORE%"=="" goto :err

echo.
echo [1/7] Backend: copiando solo %API_FILE%...
docker cp "%API_FILE%" %CONT1%:%API_DEST%/%API_FILE% || goto :err
docker cp "%API_FILE%" %CONT2%:%API_DEST%/%API_FILE% || goto :err

echo.
echo [2/7] Backend: limpiando caches Laravel...
docker exec %CONT1% php artisan config:clear || goto :err
docker exec %CONT1% php artisan route:clear || goto :err
docker exec %CONT1% php artisan cache:clear || goto :err
docker exec %CONT2% php artisan config:clear || goto :err
docker exec %CONT2% php artisan route:clear || goto :err
docker exec %CONT2% php artisan cache:clear || goto :err

echo.
echo [3/7] Frontend: ocultando cambios no relacionados con git stash...
cd /d "%FRONT_DIR%"
git stash push -m "%STASH_MSG%" -- ^
  deploy.bat ^
  src/pages/LinksPage.jsx ^
  src/pages/Pc/TrasvasoPage.jsx ^
  src/pages/Stock/InventarioMaterialesResultadoPage.jsx ^
  src/router/MainRouter.jsx ^
  src/services/HoraHoraService.js ^
  src/services/StockService.js ^
  src/utils/Constants.js
if errorlevel 1 goto :errNoStash

for /f "tokens=1 delims=:" %%A in ('git stash list ^| findstr /C:"%STASH_MSG%"') do (
    if not defined STASH_REF set "STASH_REF=%%A"
)
if defined STASH_REF set "STASHED=1"

echo.
echo [4/7] Frontend: build en container node efimero...
docker run --rm ^
  -v "%cd%:/front" ^
  -v frontend_abast_node_modules:/front/node_modules ^
  -v frontend_abast_pnpm_store:/pnpm-store ^
  -w /front ^
  node:18-alpine sh -c "npm install -g pnpm@latest && pnpm config set store-dir /pnpm-store && pnpm config set verify-store-integrity false && pnpm install --no-frozen-lockfile && pnpm run build --mode production && chmod -R a+rw dist"
if errorlevel 1 goto :err

if not exist "dist\index.html" (
    echo ERROR: no se genero dist\index.html
    goto :err
)

echo.
echo [5/7] Frontend: copiando dist a %FRONT_CONT%...
docker cp dist/. %FRONT_CONT%:%FRONT_DEST%/ || goto :err

echo.
echo [6/7] Frontend: restaurando stash de cambios ocultos...
if defined STASHED (
    git stash pop %STASH_REF%
    if errorlevel 1 (
        echo Advertencia: stash pop fallo. Revisar manualmente con:
        echo   git stash list
    )
) else (
    echo Sin stash para restaurar.
)
set "STASHED="

echo.
echo [7/7] Verificacion: comprobando que NO hubo reinicios...
for /f %%I in ('docker inspect -f "{{.Id}}" %CONT1%') do set "ID_CONT1_AFTER=%%I"
for /f %%I in ('docker inspect -f "{{.Id}}" %CONT2%') do set "ID_CONT2_AFTER=%%I"
for /f %%I in ('docker inspect -f "{{.Id}}" %FRONT_CONT%') do set "ID_FRONT_AFTER=%%I"

if /I not "%ID_CONT1_BEFORE%"=="%ID_CONT1_AFTER%" (
    echo ALERTA: %CONT1% cambio de ID (posible reinicio externo).
    goto :err
)
if /I not "%ID_CONT2_BEFORE%"=="%ID_CONT2_AFTER%" (
    echo ALERTA: %CONT2% cambio de ID (posible reinicio externo).
    goto :err
)
if /I not "%ID_FRONT_BEFORE%"=="%ID_FRONT_AFTER%" (
    echo ALERTA: %FRONT_CONT% cambio de ID (posible reinicio externo).
    goto :err
)

cd /d "%API_DIR%"
echo.
echo ============================================================
echo  LISTO. Deploy aplicado en caliente sin reiniciar servicios.
echo  Backend actualizado: %API_FILE%
echo  Frontend actualizado: build dist en %FRONT_CONT%
echo.
echo  Probar:
echo   - http://192.168.8.16:8007/PC/ABASTECIMIENTO
echo   - Ctrl+F5 en la TV/cliente para tomar bundle nuevo.
echo ============================================================
echo.
pause
exit /b 0

:err
echo.
echo ERROR: fallo un paso del deploy.
if defined STASHED (
    echo Restaurando stash...
    git stash pop %STASH_REF%
)
cd /d "%API_DIR%"
pause
exit /b 1

:errNoStash
echo.
echo ERROR: no se pudo crear el stash en frontend.
echo Revisar conflictos o estado de git en %FRONT_DIR%.
cd /d "%API_DIR%"
pause
exit /b 1

:check_running
for /f %%S in ('docker inspect -f "{{.State.Running}}" %1 2^>nul') do set "RUNNING_STATE=%%S"
if /I "%RUNNING_STATE%"=="true" (
    set "RUNNING_STATE="
    exit /b 0
)
echo ERROR: container %1 no esta corriendo o no existe.
set "RUNNING_STATE="
exit /b 1
