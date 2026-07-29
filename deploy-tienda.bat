@echo off
setlocal

echo [1/3] Actualizando codigo de Tienda...
git pull --autostash || goto :error

echo [2/3] Levantando contenedores separados de Tienda...
docker compose up --build -d || goto :error

echo [3/3] Estado de Tienda...
docker compose ps

echo.
echo Listo.
echo Frontend Tienda: http://192.168.8.16:8007
echo API Tienda:      http://192.168.8.16:4555
exit /b 0

:error
echo.
echo ERROR: no se pudo completar el deploy de Tienda.
exit /b 1
